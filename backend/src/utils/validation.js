import { createHttpError } from "./create-http-error.js";

export const assertRequiredString = (value, message) => {
  if (!value || typeof value !== "string" || !value.trim()) {
    throw createHttpError(400, message);
  }
};

export const assertPositiveNumber = (value, message) => {
  if (Number.isNaN(Number(value)) || Number(value) < 0) {
    throw createHttpError(400, message);
  }
};

