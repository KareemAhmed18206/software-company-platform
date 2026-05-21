import http from "node:http";

import app from "./app.js";
import { connectDatabase } from "./config/db.js";
import { env } from "./config/env.js";
import { createSocketServer } from "./socket/io.js";

const startServer = async () => {
  await connectDatabase();
  const server = http.createServer(app);
  createSocketServer(server);

  server.listen(env.PORT, () => {
    console.log(`API server listening on http://localhost:${env.PORT}`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
