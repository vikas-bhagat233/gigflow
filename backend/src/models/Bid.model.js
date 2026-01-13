import mongoose from "mongoose";

const bidSchema = new mongoose.Schema(
  {
    // NOTE: these field names match an existing compound unique index in the DB
    // ({ gig: 1, freelancer: 1 })
    gig: { type: mongoose.Schema.Types.ObjectId, ref: "Gig", required: true },
    freelancer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // Backward compatibility: older documents/clients used these names
    gigId: { type: mongoose.Schema.Types.ObjectId, ref: "Gig" },
    freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    message: { type: String, required: true },
    price: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "hired", "rejected"],
      default: "pending"
    },

    // If set, MongoDB TTL index will remove the document at this time.
    // We set this only for the hired (confirmed) bid.
    expiresAt: { type: Date }
  },
  { timestamps: true }
);

// Enforce one bid per freelancer per gig
bidSchema.index({ gig: 1, freelancer: 1 }, { unique: true });

// Auto-delete bids once expiresAt is reached
bidSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("Bid", bidSchema);
