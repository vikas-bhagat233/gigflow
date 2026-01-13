import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["bid_accepted", "bid_rejected"],
      required: true
    },
    message: { type: String, required: true },
    gigId: { type: mongoose.Schema.Types.ObjectId, ref: "Gig" },
    bidId: { type: mongoose.Schema.Types.ObjectId, ref: "Bid" },
    read: { type: Boolean, default: false }
  },
  { timestamps: true }
);

notificationSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model("Notification", notificationSchema);
