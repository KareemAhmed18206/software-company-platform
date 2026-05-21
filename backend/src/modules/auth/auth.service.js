import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { env } from "../../config/env.js";
import { createHttpError } from "../../utils/create-http-error.js";
import {
  createUser,
  findUserByEmail,
  findUserById
} from "../users/user.repository.js";
import { sanitizeUser } from "../users/user.utils.js";

const allowedRoles = new Set(["admin", "client"]);

const createToken = (user) =>
  jwt.sign(
    {
      sub: user._id?.toString() || user.id,
      role: user.role,
      email: user.email
    },
    env.JWT_SECRET,
    {
      expiresIn: env.JWT_EXPIRES_IN
    }
  );

const createAuthResponse = (user) => ({
  token: createToken(user),
  user: sanitizeUser(user)
});

const validatePassword = (password) => {
  if (typeof password !== "string" || password.length < 8) {
    throw createHttpError(
      400,
      "Password must be at least 8 characters long."
    );
  }
};

export const registerUser = async ({ name, email, password, role }) => {
  if (!name?.trim()) {
    throw createHttpError(400, "Name is required.");
  }

  if (!email?.trim()) {
    throw createHttpError(400, "Email is required.");
  }

  validatePassword(password);

  const normalizedRole = role || "client";

  if (!allowedRoles.has(normalizedRole)) {
    throw createHttpError(400, "Role must be either admin or client.");
  }

  if (normalizedRole === "admin" && !env.ALLOW_ADMIN_SELF_REGISTRATION) {
    throw createHttpError(
      403,
      "Admin self-registration is disabled in this environment."
    );
  }

  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw createHttpError(409, "An account with this email already exists.");
  }

  const hashedPassword = await bcrypt.hash(password, env.BCRYPT_SALT_ROUNDS);
  const user = await createUser({
    name: name.trim(),
    email,
    password: hashedPassword,
    role: normalizedRole
  });

  return createAuthResponse(user);
};

export const loginUser = async ({ email, password }) => {
  if (!email?.trim() || !password) {
    throw createHttpError(400, "Email and password are required.");
  }

  const user = await findUserByEmail(email);

  if (!user) {
    throw createHttpError(401, "Invalid email or password.");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw createHttpError(401, "Invalid email or password.");
  }

  return createAuthResponse(user);
};

export const getAuthenticatedUser = async (userId) => {
  const user = await findUserById(userId);

  if (!user) {
    throw createHttpError(401, "Authentication required.");
  }

  return sanitizeUser(user);
};
