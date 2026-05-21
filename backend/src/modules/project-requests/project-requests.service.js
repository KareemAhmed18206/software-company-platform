import { createHttpError } from "../../utils/create-http-error.js";
import { sendNotification } from "../notifications/notifications.service.js";
import { findServiceById } from "../services/services.repository.js";
import { User } from "../../models/User.js";
import { sanitizeProjectRequest } from "./project-request.utils.js";
import {
  countClientProjectRequestsByStatus,
  countProjectRequestsByStatus,
  createProjectRequestRecord,
  findProjectRequestById,
  listAllProjectRequests,
  listClientProjectRequests,
  updateProjectRequestStatusRecord
} from "./project-requests.repository.js";

const validStatuses = new Set(["pending", "accepted", "rejected"]);

const validateCreatePayload = (payload) => {
  if (!payload.projectName?.trim()) {
    throw createHttpError(400, "Project name is required.");
  }

  if (!payload.companyName?.trim()) {
    throw createHttpError(400, "Company name is required.");
  }

  if (!payload.serviceId?.trim()) {
    throw createHttpError(400, "Service is required.");
  }

  if (Number.isNaN(Number(payload.budget)) || Number(payload.budget) < 0) {
    throw createHttpError(400, "Budget must be a positive number or zero.");
  }

  if (!payload.timeline?.trim()) {
    throw createHttpError(400, "Timeline is required.");
  }

  if (!payload.goals?.trim()) {
    throw createHttpError(400, "Project goals are required.");
  }
};

export const createProjectRequest = async (client, payload) => {
  validateCreatePayload(payload);

  const service = await findServiceById(payload.serviceId);

  if (!service || !service.isActive) {
    throw createHttpError(404, "Selected service is not available.");
  }

  const request = await createProjectRequestRecord({
    clientId: client.id,
    serviceId: payload.serviceId,
    projectName: payload.projectName.trim(),
    companyName: payload.companyName.trim(),
    budget: Number(payload.budget),
    timeline: payload.timeline.trim(),
    goals: payload.goals.trim(),
    notes: payload.notes?.trim() || ""
  });

  const admins = await User.find({ role: "admin" }).select("_id").lean();
  await Promise.all(
    admins.map((admin) =>
      sendNotification({
        userId: admin._id.toString(),
        type: "project-request",
        title: "New project request",
        message: `${client.name} submitted ${payload.projectName.trim()}.`,
        data: {
          projectRequestId: request._id?.toString() || request.id
        }
      })
    )
  );

  return sanitizeProjectRequest(request);
};

export const getClientRequests = async (client) => {
  const requests = await listClientProjectRequests(client.id);

  return requests.map(sanitizeProjectRequest);
};

export const getAdminRequests = async () => {
  const requests = await listAllProjectRequests();

  return requests.map(sanitizeProjectRequest);
};

export const updateProjectRequestStatus = async (requestId, payload) => {
  if (!validStatuses.has(payload.status)) {
    throw createHttpError(400, "Status must be pending, accepted, or rejected.");
  }

  const existingRequest = await findProjectRequestById(requestId);

  if (!existingRequest) {
    throw createHttpError(404, "Project request not found.");
  }

  const updatedRequest = await updateProjectRequestStatusRecord(requestId, {
    status: payload.status,
    adminDecisionNote: payload.adminDecisionNote?.trim() || ""
  });

  if (updatedRequest?.clientId?._id) {
    await sendNotification({
      userId: updatedRequest.clientId._id.toString(),
      type: "project-request-status",
      title: `Request ${payload.status}`,
      message: `${updatedRequest.projectName} was marked as ${payload.status}.`,
      data: {
        projectRequestId: updatedRequest._id?.toString() || updatedRequest.id,
        status: payload.status
      }
    });
  }

  return sanitizeProjectRequest(updatedRequest);
};

export const getProjectRequestMetrics = async () => ({
  pendingRequests: await countProjectRequestsByStatus("pending"),
  acceptedRequests: await countProjectRequestsByStatus("accepted"),
  rejectedRequests: await countProjectRequestsByStatus("rejected")
});

export const getClientRequestMetrics = async (client) => ({
  pendingRequests: await countClientProjectRequestsByStatus(client.id, "pending"),
  acceptedRequests: await countClientProjectRequestsByStatus(
    client.id,
    "accepted"
  ),
  rejectedRequests: await countClientProjectRequestsByStatus(
    client.id,
    "rejected"
  )
});
