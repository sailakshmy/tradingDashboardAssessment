import { Ticker } from "../types/market";

export const tickers: Ticker[] = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    exchange: "NASDAQ",
    currency: "USD",
    previousClose: 210.12,
  },
  {
    symbol: "TSLA",
    name: "Tesla, Inc.",
    exchange: "NASDAQ",
    currency: "USD",
    previousClose: 178.44,
  },
  {
    symbol: "BTC-USD",
    name: "Bitcoin",
    exchange: "CRYPTO",
    currency: "USD",
    previousClose: 68420.25,
  },
  {
    symbol: "ETH-USD",
    name: "Ethereum",
    exchange: "CRYPTO",
    currency: "USD",
    previousClose: 3512.66,
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corp.",
    exchange: "NASDAQ",
    currency: "USD",
    previousClose: 417.38,
  },
];
