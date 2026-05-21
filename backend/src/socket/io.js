import { Server } from "socket.io";
import jwt from "jsonwebtoken";

import { env } from "../config/env.js";
import { findUserById } from "../modules/users/user.repository.js";
import { sanitizeUser } from "../modules/users/user.utils.js";

let ioInstance = null;

export const createSocketServer = (server) => {
  ioInstance = new Server(server, {
    cors: {
      origin: env.CLIENT_URL,
      methods: ["GET", "POST"]
    }
  });

  ioInstance.use(async (socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers.authorization?.replace("Bearer ", "");

      if (!token) {
        next(new Error("Authentication required."));
        return;
      }

      const decoded = jwt.verify(token, env.JWT_SECRET);
      const user = await findUserById(decoded.sub);

      if (!user) {
        next(new Error("Authentication required."));
        return;
      }

      socket.user = sanitizeUser(user);
      next();
    } catch (_error) {
      next(new Error("Invalid socket authentication token."));
    }
  });

  ioInstance.on("connection", (socket) => {
    socket.join(`user:${socket.user.id}`);

    socket.on("conversation:join", (conversationId) => {
      if (conversationId) {
        socket.join(`conversation:${conversationId}`);
      }
    });

    socket.on("conversation:leave", (conversationId) => {
      if (conversationId) {
        socket.leave(`conversation:${conversationId}`);
      }
    });
  });

  return ioInstance;
};

export const getIo = () => ioInstance;

