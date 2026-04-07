import cors from "cors";
import express from "express";
import { createMarketRouter } from "./routes/marketRoutes.js";
import { HistoryService } from "./services/historyService.js";
import { MarketSimulator } from "./services/marketSimulator.js";
import { env } from "./config/env.js";

export const createApp = () => {
  const app = express();
  const historyService = new HistoryService();
  const marketSimulator = new MarketSimulator(env.tickIntervalMs);

  app.use(cors({ origin: env.corsOrigin }));
  app.use(express.json());
  app.use("/api", createMarketRouter(marketSimulator, historyService));

  return {
    app,
    marketSimulator,
  };
};
