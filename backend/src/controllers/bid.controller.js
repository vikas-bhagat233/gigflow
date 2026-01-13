import Bid from "../models/Bid.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { hireBidAtomic } from "../services/hire.service.js";
import { getIO } from "../config/socket.js";
import Notification from "../models/Notification.model.js";
import Gig from "../models/Gig.model.js";

export const createBid = asyncHandler(async (req, res) => {
  const gigId = req.body.gigId || req.body.gig;
  const message = req.body.message;
  const price = req.body.price;

  if (!gigId) {
    const err = new Error("gigId is required");
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
    const err = new Error("Bidding is closed for this gig");
    err.statusCode = 409;
    throw err;
  }

  if (String(gig.ownerId) === String(req.user.id)) {
    const err = new Error("You cannot bid on your own gig");
    err.statusCode = 403;
    throw err;
  }

  const bid = await Bid.create({
    gig: gigId,
    freelancer: req.user.id,
    message,
    price
  });

  await bid.populate("freelancer", "name");
  const obj = bid.toObject();
  obj.freelancer = obj.freelancer || obj.freelancerId;
  obj.gig = obj.gig || obj.gigId;
  delete obj.gigId;
  delete obj.freelancerId;
  res.json(obj);
});

export const getBidsByGig = asyncHandler(async (req, res) => {
  const gigId = req.params.gigId;
  const bids = await Bid.find({
    $or: [{ gig: gigId }, { gigId }]
  })
    .populate("freelancer", "name")
    .populate("freelancerId", "name")
    .sort({ createdAt: -1 });

  const normalized = bids.map((bid) => {
    const obj = bid.toObject();
    obj.gig = obj.gig || obj.gigId;
    obj.freelancer = obj.freelancer || obj.freelancerId;
    delete obj.gigId;
    delete obj.freelancerId;
    return obj;
  });

  res.json(normalized);
});

export const hireBid = asyncHandler(async (req, res) => {
  await hireBidAtomic(req.params.bidId, req.user.id);

  // After hire: notify hired freelancer + rejected freelancers
  const bid = await Bid.findById(req.params.bidId);
  const gigId = bid?.gig || bid?.gigId;
  if (gigId) {
    const gig = await Gig.findById(gigId);
    const gigTitle = gig?.title || "this gig";

    const bids = await Bid.find({ $or: [{ gig: gigId }, { gigId }] });
    const io = getIO();

    for (const b of bids) {
      const userId = b.freelancer || b.freelancerId;
      if (!userId) continue;

      const type = b.status === "hired" ? "bid_accepted" : b.status === "rejected" ? "bid_rejected" : null;
      if (!type) continue;

      const message =
        type === "bid_accepted"
          ? `Your bid was accepted for: ${gigTitle}`
          : `Your bid was rejected for: ${gigTitle}`;

      const n = await Notification.create({
        userId,
        type,
        message,
        gigId,
        bidId: b._id
      });

      io.to(String(userId)).emit("notification", n);
    }
  }

  res.json({ message: "Freelancer hired successfully" });
});
