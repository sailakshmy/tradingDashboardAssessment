import { tickers } from "../mockData/tickers.js";
import { EventEmitter } from "node:events";
import type { PriceUpdate, TickerId } from "../types/market.js";

const round = (value: number): number => Number(value.toFixed(2));

export class MarketSimulator extends EventEmitter {
  [x: string]: any;
  private readonly latestPrices = new Map<TickerId, number>();
  private timer?: NodeJS.Timeout;

  constructor(private readonly intervalMs: number) {
    super();

    for (const ticker of tickers) {
      this.latestPrices.set(ticker.symbol, ticker.previousClose);
    }
  }

  start(): void {
    if (this.timer) {
      return;
    }

    this.timer = setInterval(() => {
      for (const ticker of tickers) {
        const previous =
          this.latestPrices.get(ticker.symbol) ?? ticker.previousClose;
        const volatility = ticker.exchange === "CRYPTO" ? 0.012 : 0.0045;
        const delta = previous * (Math.random() * volatility * 2 - volatility);
        const price = round(Math.max(previous + delta, 0.01));
        this.latestPrices.set(ticker.symbol, price);

        const update: PriceUpdate = {
          symbol: ticker.symbol,
          timestamp: new Date().toISOString(),
          price,
          change: round(price - ticker.previousClose),
          changePercent: round(
            ((price - ticker.previousClose) / ticker.previousClose) * 100,
          ),
        };

        this.emit("price", update);
      }
    }, this.intervalMs);
  }

  stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = undefined;
    }
  }

  getSnapshot(): PriceUpdate[] {
    return tickers.map((ticker) => {
      const price =
        this.latestPrices.get(ticker.symbol) ?? ticker.previousClose;
      return {
        symbol: ticker.symbol,
        timestamp: new Date().toISOString(),
        price,
        change: round(price - ticker.previousClose),
        changePercent: round(
          ((price - ticker.previousClose) / ticker.previousClose) * 100,
        ),
      };
    });
  }
}
