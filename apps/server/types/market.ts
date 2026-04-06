export type TickerId = "AAPL" | "TSLA" | "BTC-USD" | "ETH-USD" | "MSFT";

export interface Ticker {
  symbol: TickerId;
  name: string;
  exchange: string;
  currency: string;
  previousClose: number;
}

export interface PricePoint {
  timestamp: string;
  price: number;
}

export interface PriceUpdate extends PricePoint {
  symbol: TickerId;
  change: number;
  changePercent: number;
}
