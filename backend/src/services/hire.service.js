import mongoose from "mongoose";
import Bid from "../models/Bid.model.js";
import Gig from "../models/Gig.model.js";

const isTransactionUnsupportedError = (err) => {
  const msg = String(err?.message || "");
  return (
    msg.includes("Transaction numbers are only allowed") ||
    msg.includes("replica set member or mongos") ||
    msg.includes("Transaction is not supported")
  );
};

const hireBidNonTransactional = async (bidId, userId) => {
  // Best-effort hire for MongoDB standalone (no transactions).
  // Uses conditional updates to reduce race issues.

  const bid = await Bid.findOne({ _id: bidId, status: "pending" });
  if (!bid) {
    const err = new Error("Bid already processed");
    err.statusCode = 409;
    throw err;
  }

  const gigId = bid.gig || bid.gigId;
  if (!gigId) {
    const err = new Error("Bid is missing gig reference");
    err.statusCode = 400;
    throw err;
  }

  const gig = await Gig.findById(gigId);
  if (!gig) {
    const err = new Error("Gig not found");
    err.statusCode = 404;
    throw err;
  }

  if (gig.status !== "open") {
    const err = new Error("This gig is already assigned");
    err.statusCode = 409;
    throw err;
  }

  if (String(gig.ownerId) !== String(userId)) {
    const err = new Error("Only the gig owner can hire");
    err.statusCode = 403;
    throw err;
  }

  // Lock the gig first (best-effort) so no other bid can be hired after this.
  const gigLocked = await Gig.updateOne({ _id: gigId, status: "open" }, { status: "assigned" });
  if (!gigLocked?.modifiedCount) {
    const err = new Error("This gig is already assigned");
    err.statusCode = 409;
    throw err;
  }

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  // Mark selected bid as hired only if still pending
  const hired = await Bid.updateOne(
    { _id: bidId, status: "pending" },
    { status: "hired", expiresAt }
  );

  if (!hired?.modifiedCount) {
    // revert gig lock (best-effort)
    await Gig.updateOne({ _id: gigId, status: "assigned" }, { status: "open" });
    const err = new Error("Bid already processed");
    err.statusCode = 409;
    throw err;
  }

  await Bid.updateMany(
    { $or: [{ gig: gigId }, { gigId }], _id: { $ne: bidId } },
    { status: "rejected" }
  );
  return true;
};

export const hireBidAtomic = async (bidId, userId) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const bid = await Bid.findOne({ _id: bidId, status: "pending" }).session(session);
    if (!bid) {
      const err = new Error("Bid already processed");
      err.statusCode = 409;
      throw err;
    }

    const gigId = bid.gig || bid.gigId;
    if (!gigId) {
      const err = new Error("Bid is missing gig reference");
      err.statusCode = 400;
      throw err;
    }

    const gig = await Gig.findById(gigId).session(session);
    if (!gig) {
      const err = new Error("Gig not found");
      err.statusCode = 404;
      throw err;
    }

    if (gig.status !== "open") {
      const err = new Error("This gig is already assigned");
      err.statusCode = 409;
      throw err;
    }

    if (String(gig.ownerId) !== String(userId)) {
      const err = new Error("Only the gig owner can hire");
      err.statusCode = 403;
      throw err;
    }

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await Bid.updateOne({ _id: bidId }, { status: "hired", expiresAt }).session(session);
    await Bid.updateMany(
      { $or: [{ gig: gigId }, { gigId }], _id: { $ne: bidId } },
      { status: "rejected" }
    ).session(session);

    await Gig.updateOne({ _id: gigId }, { status: "assigned" }).session(session);

    await session.commitTransaction();
    return true;
  } catch (err) {
    try {
      await session.abortTransaction();
    } catch {
      // ignore
    }

    // If transactions aren't supported (standalone Mongo), fall back.
    if (isTransactionUnsupportedError(err)) {
      return hireBidNonTransactional(bidId, userId);
    }

    throw err;
  } finally {
    session.endSession();
  }
};
