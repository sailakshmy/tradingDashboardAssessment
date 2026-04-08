import type { Request, Response } from "express";
import { describe, expect, it, vi } from "vitest";
import { createMarketRouter } from "../routes/marketRoutes.js";
import { HistoryService } from "../services/historyService.js";
import { MarketSimulator } from "../services/marketSimulator.js";

const findRouteHandler = (path: string) => {
  const router = createMarketRouter(
    new MarketSimulator(1000),
    new HistoryService(),
  );
  const layer = router.stack.find(
    (entry) => entry.route?.path === path && entry.route.methods.get,
  );

  if (!layer) {
    throw new Error(`Route ${path} not found`);
  }

  return layer.route.stack[0].handle as (
    request: Request,
    response: Response,
  ) => void;
};

const createResponse = () => {
  const response = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  };

  return response as unknown as Response & {
    status: ReturnType<typeof vi.fn>;
    json: ReturnType<typeof vi.fn>;
  };
};

describe("market routes", () => {
  it("lists tickers with a live snapshot", () => {
    const handler = findRouteHandler("/tickers");
    const response = createResponse();

    handler({ params: {}, query: {} } as Request, response);

    expect(response.json).toHaveBeenCalledTimes(1);
    expect(response.json.mock.calls[0]?.[0].data.length).toBeGreaterThan(0);
    expect(response.json.mock.calls[0]?.[0].livePrices.length).toBe(
      response.json.mock.calls[0]?.[0].data.length,
    );
  });

  it("returns historical data for a valid ticker", () => {
    const handler = findRouteHandler("/tickers/:symbol/history");
    const response = createResponse();

    handler(
      {
        params: { symbol: "BTC-USD" },
        query: { points: "20" },
      } as unknown as Request,
      response,
    );

    expect(response.json).toHaveBeenCalledTimes(1);
    expect(response.json.mock.calls[0]?.[0].data).toHaveLength(20);
    expect(response.json.mock.calls[0]?.[0].meta.symbol).toBe("BTC-USD");
  });

  it("returns 404 for an unknown ticker", () => {
    const handler = findRouteHandler("/tickers/:symbol/history");
    const response = createResponse();

    handler(
      {
        params: { symbol: "UNKNOWN" },
        query: {},
      } as unknown as Request,
      response,
    );

    expect(response.status).toHaveBeenCalledWith(404);
    expect(response.json).toHaveBeenCalledWith({ error: "Ticker not found" });
  });
});
