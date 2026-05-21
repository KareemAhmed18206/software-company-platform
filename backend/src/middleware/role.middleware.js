import { createHttpError } from "../utils/create-http-error.js";

export const authorizeRoles = (...allowedRoles) => (req, _res, next) => {
  if (!req.user) {
    next(createHttpError(401, "Authentication required."));
    return;
  }

  if (!allowedRoles.includes(req.user.role)) {
    next(createHttpError(403, "You do not have permission to access this route."));
    return;
  }

  next();
};

