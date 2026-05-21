import cors from "cors";
import express from "express";

import { corsOptions } from "./config/cors.js";
import { env } from "./config/env.js";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware.js";
import {
  apiRateLimiter,
  sanitizeRequest,
  securityHeaders
} from "./middleware/security.middleware.js";
import apiRoutes from "./routes/index.js";

const app = express();

app.use(securityHeaders);
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sanitizeRequest);
app.use("/api", apiRateLimiter);

app.get("/", (_req, res) => {
  res.status(200).json({
    message: "Software Company Platform API is running",
    environment: env.NODE_ENV
  });
});

app.use("/api", apiRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
