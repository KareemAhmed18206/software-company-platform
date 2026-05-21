import { asyncHandler } from "../../utils/async-handler.js";
import {
  createProjectRequest,
  getAdminRequests,
  getClientRequests,
  updateProjectRequestStatus
} from "./project-requests.service.js";

export const createClientProjectRequest = asyncHandler(async (req, res) => {
  const projectRequest = await createProjectRequest(req.user, req.body);

  res.status(201).json({
    message: "Project request submitted successfully.",
    projectRequest
  });
});

export const listMyProjectRequests = asyncHandler(async (req, res) => {
  const projectRequests = await getClientRequests(req.user);

  res.status(200).json({ projectRequests });
});

export const listAdminProjectRequests = asyncHandler(async (_req, res) => {
  const projectRequests = await getAdminRequests();

  res.status(200).json({ projectRequests });
});

export const updateAdminProjectRequestStatus = asyncHandler(
  async (req, res) => {
    const projectRequest = await updateProjectRequestStatus(
      req.params.id,
      req.body
    );

    res.status(200).json({
      message: "Project request updated successfully.",
      projectRequest
    });
  }
);

