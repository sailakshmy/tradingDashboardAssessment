import { tickers } from "../mockData/tickers.js";
import type { PricePoint, TickerId } from "../types/market.js";

const round = (value: number): number => Number(value.toFixed(2));

export class HistoryService {
  private readonly cache = new Map<string, PricePoint[]>();

  getHistory(symbol: TickerId, points = 60): PricePoint[] {
    const cacheKey = `${symbol}:${points}`;
    const cached = this.cache.get(cacheKey);
    if (cached) {
      console.log("History cache hit", { symbol, points, cacheKey });
      return cached;
    }

    const ticker = tickers.find((item) => item.symbol === symbol);
    if (!ticker) {
      console.log("Requested history for unknown ticker", { symbol, points });
      return [];
    }

    const seed = Array.from(symbol).reduce(
      (sum, char) => sum + char.charCodeAt(0),
      0,
    );
    const now = Date.now();
    const history = Array.from({ length: points }, (_, index) => {
      const step = points - index;
      const drift = Math.sin((seed + step) / 6) * ticker.previousClose * 0.012;
      const wave = Math.cos((seed + step) / 3) * ticker.previousClose * 0.008;
      const price = round(ticker.previousClose + drift + wave);

      return {
        timestamp: new Date(now - step * 60_000).toISOString(),
        price,
      };
    });

    this.cache.set(cacheKey, history);
    console.log("Generated price history", {
      symbol,
      points,
      generated: history.length,
      cacheKey,
    });
    return history;
  }
}
