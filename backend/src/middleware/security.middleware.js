import helmet from "helmet";
import rateLimit from "express-rate-limit";

import { createHttpError } from "../utils/create-http-error.js";

const sanitizeValue = (value) => {
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([key]) => !key.startsWith("$") && !key.includes("."))
        .map(([key, nestedValue]) => [key, sanitizeValue(nestedValue)])
    );
  }

  if (typeof value === "string") {
    return value
      .replace(/<script.*?>.*?<\/script>/gi, "")
      .replace(/[<>]/g, "")
      .trim();
  }

  return value;
};

export const securityHeaders = helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
});

export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many requests. Please try again in a few minutes."
  }
});

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many authentication attempts. Please try again later."
  }
});

export const sanitizeRequest = (req, _res, next) => {
  req.body = sanitizeValue(req.body);

  if (req.params && typeof req.params === "object") {
    Object.keys(req.params).forEach((key) => {
      req.params[key] = sanitizeValue(req.params[key]);
    });
  }

  if (req.query && typeof req.query === "object") {
    Object.keys(req.query).forEach((key) => {
      req.query[key] = sanitizeValue(req.query[key]);
    });
  }

  next();
};

export const requireObjectId = (value, message = "Invalid resource id.") => {
  if (!value || typeof value !== "string" || value.length < 12) {
    throw createHttpError(400, message);
  }
};
