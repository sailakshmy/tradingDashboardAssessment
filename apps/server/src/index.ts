import { createServer } from "node:http";
import { createApp } from "./app.js";
import { env } from "./config/env.js";

const { app } = createApp();
const server = createServer(app);

server.listen(env.port, () => {
  console.log(`Market data service listening on port ${env.port}`);
});

const shutdown = () => {
  server.close(() => process.exit(0));
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
