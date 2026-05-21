import { asyncHandler } from "../../utils/async-handler.js";
import {
  createService,
  deleteService,
  getAdminServices,
  getPublicServiceDetails,
  getPublicServices,
  updateService
} from "./services.service.js";

export const listServices = asyncHandler(async (_req, res) => {
  const services = await getPublicServices();

  res.status(200).json({ services });
});

export const listAdminServices = asyncHandler(async (_req, res) => {
  const services = await getAdminServices();

  res.status(200).json({ services });
});

export const getServiceBySlug = asyncHandler(async (req, res) => {
  const service = await getPublicServiceDetails(req.params.slug);

  res.status(200).json({ service });
});

export const createAdminService = asyncHandler(async (req, res) => {
  const service = await createService(req.body);

  res.status(201).json({
    message: "Service created successfully.",
    service
  });
});

export const updateAdminService = asyncHandler(async (req, res) => {
  const service = await updateService(req.params.id, req.body);

  res.status(200).json({
    message: "Service updated successfully.",
    service
  });
});

export const deleteAdminService = asyncHandler(async (req, res) => {
  const service = await deleteService(req.params.id);

  res.status(200).json({
    message: "Service deleted successfully.",
    service
  });
});

