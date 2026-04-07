import { createServer } from "node:http";
import { createApp } from "./app.js";
import { env } from "./config/env.js";
import WebSocket, { WebSocketServer } from "ws";

const { app, marketSimulator } = createApp();
const server = createServer(app);

const wss = new WebSocketServer({
  server,
  path: "/ws",
});

wss.on("connection", (socket) => {
  socket.send(
    JSON.stringify({
      type: "snapshot",
      payload: marketSimulator.getSnapshot(),
    }),
  );
});

marketSimulator.on("price", (update) => {
  const message = JSON.stringify({
    type: "price-update",
    payload: update,
  });

  for (const client of wss.clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  }
});

marketSimulator.start();

server.listen(env.port, () => {
  console.log(`Market data service listening on port ${env.port}`);
});

const shutdown = () => {
  server.close(() => process.exit(0));
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
