import Gig from "../models/Gig.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getGigs = asyncHandler(async (req, res) => {
  const search = req.query.search || "";
  const gigs = await Gig.find({
    status: "open",
    title: { $regex: search, $options: "i" }
  }).populate("ownerId", "name");
  res.json(gigs);
});

export const getGigById = asyncHandler(async (req, res) => {
  const gig = await Gig.findById(req.params.id).populate("ownerId", "name");
  if (!gig) {
    const err = new Error("Gig not found");
    err.statusCode = 404;
    throw err;
  }
  res.json(gig);
});

export const createGig = asyncHandler(async (req, res) => {
  const gig = await Gig.create({
    ...req.body,
    ownerId: req.user.id
  });
  await gig.populate("ownerId", "name");
  res.json(gig);
});
