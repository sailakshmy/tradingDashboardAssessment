export interface Ticker {
  symbol: string;
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
  symbol: string;
  change: number;
  changePercent: number;
}
