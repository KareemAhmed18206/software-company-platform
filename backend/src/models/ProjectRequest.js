import mongoose from "mongoose";

const projectRequestSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true
    },
    projectName: {
      type: String,
      required: true,
      trim: true
    },
    companyName: {
      type: String,
      required: true,
      trim: true
    },
    budget: {
      type: Number,
      required: true,
      min: 0
    },
    timeline: {
      type: String,
      required: true,
      trim: true
    },
    goals: {
      type: String,
      required: true,
      trim: true
    },
    notes: {
      type: String,
      trim: true,
      default: ""
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending"
    },
    adminDecisionNote: {
      type: String,
      trim: true,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

export const ProjectRequest =
  mongoose.models.ProjectRequest ||
  mongoose.model("ProjectRequest", projectRequestSchema);

