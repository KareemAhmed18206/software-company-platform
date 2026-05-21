import mongoose from "mongoose";

import { isDatabaseConnected } from "../../config/db.js";
import { User } from "../../models/User.js";

const normalizeEmail = (email) => email.trim().toLowerCase();

export const findUserByEmail = async (email) => {
  if (!isDatabaseConnected()) {
    throw new Error("Database connection is required for auth operations.");
  }

  return User.findOne({ email: normalizeEmail(email) }).lean();
};

export const findUserById = async (userId) => {
  if (!isDatabaseConnected()) {
    throw new Error("Database connection is required for auth operations.");
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return null;
  }

  return User.findById(userId).lean();
};

export const createUser = async (userData) => {
  if (!isDatabaseConnected()) {
    throw new Error("Database connection is required for auth operations.");
  }

  const user = await User.create({
    ...userData,
    email: normalizeEmail(userData.email)
  });

  return user.toObject();
};

