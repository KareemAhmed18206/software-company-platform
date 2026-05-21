import mongoose from "mongoose";

import { isDatabaseConnected } from "../../config/db.js";
import { ProjectRequest } from "../../models/ProjectRequest.js";

const ensureDatabase = () => {
  if (!isDatabaseConnected()) {
    throw new Error(
      "Database connection is required for project request operations."
    );
  }
};

const projectRequestPopulate = [
  { path: "clientId", select: "name email role" },
  { path: "serviceId", select: "title slug category" }
];

export const createProjectRequestRecord = async (payload) => {
  ensureDatabase();

  const record = await ProjectRequest.create(payload);

  return ProjectRequest.findById(record._id).populate(projectRequestPopulate).lean();
};

export const listClientProjectRequests = async (clientId) => {
  ensureDatabase();

  return ProjectRequest.find({ clientId })
    .populate(projectRequestPopulate)
    .sort({ createdAt: -1 })
    .lean();
};

export const listAllProjectRequests = async () => {
  ensureDatabase();

  return ProjectRequest.find({})
    .populate(projectRequestPopulate)
    .sort({ createdAt: -1 })
    .lean();
};

export const findProjectRequestById = async (requestId) => {
  ensureDatabase();

  if (!mongoose.Types.ObjectId.isValid(requestId)) {
    return null;
  }

  return ProjectRequest.findById(requestId).populate(projectRequestPopulate).lean();
};

export const updateProjectRequestStatusRecord = async (
  requestId,
  payload
) => {
  ensureDatabase();

  return ProjectRequest.findByIdAndUpdate(requestId, payload, {
    new: true,
    runValidators: true
  })
    .populate(projectRequestPopulate)
    .lean();
};

export const countProjectRequestsByStatus = async (status) => {
  ensureDatabase();

  return ProjectRequest.countDocuments({ status });
};

export const countClientProjectRequestsByStatus = async (clientId, status) => {
  ensureDatabase();

  return ProjectRequest.countDocuments({ clientId, status });
};

