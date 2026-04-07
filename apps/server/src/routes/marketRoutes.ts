import { Router } from "express";
import { z } from "zod";
import { HistoryService } from "../services/historyService.js";
import { MarketSimulator } from "../services/marketSimulator.js";
import { tickers } from "../mockData/tickers.js";

const historyQuerySchema = z.object({
  points: z.coerce.number().int().min(10).max(240).optional(),
});

export const createMarketRouter = (
  marketSimulator: MarketSimulator,
  historyService: HistoryService,
): Router => {
  const router = Router();

  router.get("/health", (_request, response) => {
    response.json({ status: "ok", service: "market-data" });
  });

  router.get("/tickers", (_request, response) => {
    response.json({
      data: tickers,
      livePrices: marketSimulator.getSnapshot(),
    });
  });

  router.get("/tickers/:symbol/history", (request, response) => {
    const ticker = tickers.find(
      (item) => item.symbol === request.params.symbol,
    );

    if (!ticker) {
      response.status(404).json({ error: "Ticker not found" });
      return;
    }

    const parsedQuery = historyQuerySchema.safeParse(request.query);
    if (!parsedQuery.success) {
      response.status(400).json({ error: "Invalid query params" });
      return;
    }

    const points = parsedQuery.data.points ?? 60;
    response.json({
      data: historyService.getHistory(ticker.symbol, points),
      meta: {
        symbol: ticker.symbol,
        points,
        cached: true,
      },
    });
  });

  router.get("/alerts", (_request, response) => {
    response.json({
      enabled: false,
      message:
        "Threshold alerts are supported client-side in this challenge build.",
    });
  });

  return router;
};
