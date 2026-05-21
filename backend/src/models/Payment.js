import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    planKey: {
      type: String,
      required: true,
      trim: true
    },
    planName: {
      type: String,
      required: true,
      trim: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      default: "usd",
      trim: true
    },
    status: {
      type: String,
      enum: ["pending", "paid", "failed", "canceled"],
      default: "pending"
    },
    provider: {
      type: String,
      default: "stripe"
    },
    stripeSessionId: {
      type: String,
      default: ""
    },
    stripePaymentIntentId: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

export const Payment =
  mongoose.models.Payment || mongoose.model("Payment", paymentSchema);

