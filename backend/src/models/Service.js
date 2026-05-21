import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    category: {
      type: String,
      enum: ["web", "mobile", "ai", "cybersecurity"],
      required: true
    },
    shortDescription: {
      type: String,
      required: true,
      trim: true
    },
    fullDescription: {
      type: String,
      required: true,
      trim: true
    },
    priceFrom: {
      type: Number,
      required: true,
      min: 0
    },
    deliveryEstimate: {
      type: String,
      required: true,
      trim: true
    },
    featured: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

export const Service =
  mongoose.models.Service || mongoose.model("Service", serviceSchema);

