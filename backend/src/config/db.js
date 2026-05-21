import mongoose from "mongoose";

import { env } from "./env.js";

export const connectDatabase = async () => {
  if (!env.MONGODB_URI) {
    console.warn("MONGODB_URI is not set. Skipping database connection.");
    return;
  }

  try {
    await mongoose.connect(env.MONGODB_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
};

export const isDatabaseConnected = () => mongoose.connection.readyState === 1;
