import jwt from "jsonwebtoken";

import { env } from "../config/env.js";
import { findUserById } from "../modules/users/user.repository.js";
import { sanitizeUser } from "../modules/users/user.utils.js";
import { createHttpError } from "../utils/create-http-error.js";

export const authenticate = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization || "";

    if (!authHeader.startsWith("Bearer ")) {
      throw createHttpError(401, "Authentication token is required.");
    }

    const token = authHeader.slice(7);
    const decoded = jwt.verify(token, env.JWT_SECRET);
    const user = await findUserById(decoded.sub);

    if (!user) {
      throw createHttpError(401, "Authentication required.");
    }

    req.user = sanitizeUser(user);
    req.token = token;

    next();
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      next(createHttpError(401, "Invalid or expired token."));
      return;
    }

    next(error);
  }
};

