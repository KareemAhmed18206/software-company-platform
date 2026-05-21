import { createHttpError } from "../../utils/create-http-error.js";
import {
  countActiveServices,
  createServiceRecord,
  deleteServiceRecord,
  findPublicServiceBySlug,
  findServiceById,
  findServiceBySlug,
  listAllServices,
  listPublicServices,
  updateServiceRecord
} from "./services.repository.js";
import { sanitizeService, slugify } from "./service.utils.js";

const categories = new Set(["web", "mobile", "ai", "cybersecurity"]);

const validateServicePayload = (payload) => {
  if (!payload.title?.trim()) {
    throw createHttpError(400, "Service title is required.");
  }

  if (!categories.has(payload.category)) {
    throw createHttpError(
      400,
      "Category must be web, mobile, ai, or cybersecurity."
    );
  }

  if (!payload.shortDescription?.trim()) {
    throw createHttpError(400, "Short description is required.");
  }

  if (!payload.fullDescription?.trim()) {
    throw createHttpError(400, "Full description is required.");
  }

  if (Number.isNaN(Number(payload.priceFrom)) || Number(payload.priceFrom) < 0) {
    throw createHttpError(400, "Price must be a positive number or zero.");
  }

  if (!payload.deliveryEstimate?.trim()) {
    throw createHttpError(400, "Delivery estimate is required.");
  }
};

const normalizeServicePayload = (payload) => ({
  title: payload.title.trim(),
  slug: slugify(payload.slug?.trim() || payload.title),
  category: payload.category,
  shortDescription: payload.shortDescription.trim(),
  fullDescription: payload.fullDescription.trim(),
  priceFrom: Number(payload.priceFrom),
  deliveryEstimate: payload.deliveryEstimate.trim(),
  featured: Boolean(payload.featured),
  isActive: payload.isActive !== false
});

export const getPublicServices = async () => {
  const services = await listPublicServices();

  return services.map(sanitizeService);
};

export const getAdminServices = async () => {
  const services = await listAllServices();

  return services.map(sanitizeService);
};

export const getPublicServiceDetails = async (slug) => {
  const service = await findPublicServiceBySlug(slug);

  if (!service) {
    throw createHttpError(404, "Service not found.");
  }

  return sanitizeService(service);
};

export const createService = async (payload) => {
  validateServicePayload(payload);

  const normalizedPayload = normalizeServicePayload(payload);
  const existingService = await findServiceBySlug(normalizedPayload.slug);

  if (existingService) {
    throw createHttpError(409, "A service with this slug already exists.");
  }

  const service = await createServiceRecord(normalizedPayload);

  return sanitizeService(service);
};

export const updateService = async (serviceId, payload) => {
  validateServicePayload(payload);

  const existingService = await findServiceById(serviceId);

  if (!existingService) {
    throw createHttpError(404, "Service not found.");
  }

  const normalizedPayload = normalizeServicePayload(payload);
  const duplicateService = await findServiceBySlug(normalizedPayload.slug);

  if (
    duplicateService &&
    duplicateService._id.toString() !== existingService._id.toString()
  ) {
    throw createHttpError(409, "A service with this slug already exists.");
  }

  const service = await updateServiceRecord(serviceId, normalizedPayload);

  return sanitizeService(service);
};

export const deleteService = async (serviceId) => {
  const service = await deleteServiceRecord(serviceId);

  if (!service) {
    throw createHttpError(404, "Service not found.");
  }

  return sanitizeService(service);
};

export const getServiceMetrics = async () => ({
  totalActiveServices: await countActiveServices()
});

