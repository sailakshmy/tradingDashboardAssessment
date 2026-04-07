import type { PriceUpdate, Ticker } from "../types/market";
import "./TickerList.css";

interface TickerListProps {
  tickers: Ticker[];
  livePrices: Record<string, PriceUpdate>;
  selectedSymbol: string;
  onSelect: (symbol: string) => void;
}

const formatPrice = (price: number, currency: string) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "USD" ? 2 : 4,
  }).format(price);

export const TickerList = ({
  tickers,
  livePrices,
  selectedSymbol,
  onSelect,
}: TickerListProps) => (
  <div className="ticker-grid">
    {tickers.map((ticker) => {
      const livePrice = livePrices[ticker.symbol];
      const positive = (livePrice?.change ?? 0) >= 0;

      return (
        <button
          key={ticker.symbol}
          className={`ticker-card ${selectedSymbol === ticker.symbol ? "active" : ""}`}
          onClick={() => onSelect(ticker.symbol)}
          type="button"
        >
          <div className="ticker-card__head">
            <div>
              <strong>{ticker.symbol}</strong>
              <span>{ticker.exchange}</span>
            </div>
            <p className={positive ? "positive" : "negative"}>
              {livePrice
                ? `${positive ? "+" : ""}${livePrice.changePercent}%`
                : "--"}
            </p>
          </div>
          <h3>{ticker.name}</h3>
          <p className="ticker-card__price">
            {livePrice ? formatPrice(livePrice.price, ticker.currency) : "--"}
          </p>
        </button>
      );
    })}
  </div>
);
