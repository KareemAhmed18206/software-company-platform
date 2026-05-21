import { asyncHandler } from "../../utils/async-handler.js";
import {
  getAuthenticatedUser,
  loginUser,
  registerUser
} from "./auth.service.js";

export const register = asyncHandler(async (req, res) => {
  const authResponse = await registerUser(req.body);

  res.status(201).json({
    message: "Registration successful.",
    ...authResponse
  });
});

export const login = asyncHandler(async (req, res) => {
  const authResponse = await loginUser(req.body);

  res.status(200).json({
    message: "Login successful.",
    ...authResponse
  });
});

export const logout = asyncHandler(async (_req, res) => {
  res.status(200).json({
    message: "Logout successful."
  });
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await getAuthenticatedUser(req.user.id);

  res.status(200).json({ user });
});

