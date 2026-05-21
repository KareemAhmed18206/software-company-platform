import mongoose from "mongoose";

import { isDatabaseConnected } from "../../config/db.js";
import { Service } from "../../models/Service.js";

const ensureDatabase = () => {
  if (!isDatabaseConnected()) {
    throw new Error("Database connection is required for service operations.");
  }
};

export const listPublicServices = async () => {
  ensureDatabase();

  return Service.find({ isActive: true }).sort({ featured: -1, createdAt: -1 }).lean();
};

export const listAllServices = async () => {
  ensureDatabase();

  return Service.find({}).sort({ createdAt: -1 }).lean();
};

export const findPublicServiceBySlug = async (slug) => {
  ensureDatabase();

  return Service.findOne({ slug, isActive: true }).lean();
};

export const findServiceById = async (serviceId) => {
  ensureDatabase();

  if (!mongoose.Types.ObjectId.isValid(serviceId)) {
    return null;
  }

  return Service.findById(serviceId).lean();
};

export const findServiceBySlug = async (slug) => {
  ensureDatabase();

  return Service.findOne({ slug }).lean();
};

export const createServiceRecord = async (payload) => {
  ensureDatabase();

  const service = await Service.create(payload);

  return service.toObject();
};

export const updateServiceRecord = async (serviceId, payload) => {
  ensureDatabase();

  return Service.findByIdAndUpdate(serviceId, payload, {
    new: true,
    runValidators: true
  }).lean();
};

export const deleteServiceRecord = async (serviceId) => {
  ensureDatabase();

  return Service.findByIdAndDelete(serviceId).lean();
};

export const countActiveServices = async () => {
  ensureDatabase();

  return Service.countDocuments({ isActive: true });
};

