import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { PricePoint, PriceUpdate, Ticker } from "../types/market";
import "./PriceChart.css";

interface PriceChartProps {
  ticker?: Ticker;
  currentPrice?: PriceUpdate;
  history: PricePoint[];
}

const formatLabel = (value: unknown) => {
  if (typeof value !== "string") {
    return "";
  }

  return new Date(value).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const PriceChart = ({
  ticker,
  currentPrice,
  history,
}: PriceChartProps) => (
  <section className="panel chart-panel">
    <div className="panel__header">
      <div>
        <span className="eyebrow">Realtime chart</span>
        <h2>{ticker?.name ?? "Select a ticker"}</h2>
      </div>
      <div className="chart-panel__meta">
        <strong>{currentPrice?.price.toFixed(2) ?? "--"}</strong>
        <span
          className={
            currentPrice && currentPrice.change >= 0 ? "positive" : "negative"
          }
        >
          {currentPrice
            ? `${currentPrice.change >= 0 ? "+" : ""}${currentPrice.change}`
            : "--"}
        </span>
      </div>
    </div>
    <div className="chart-shell">
      <ResponsiveContainer width="100%" height={320}>
        <AreaChart data={history}>
          <defs>
            <linearGradient id="priceFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#ff8a00" stopOpacity={0.6} />
              <stop offset="100%" stopColor="#ff8a00" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
          <XAxis
            dataKey="timestamp"
            tickFormatter={formatLabel}
            stroke="rgba(255,255,255,0.5)"
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            domain={["dataMin - 5", "dataMax + 5"]}
            stroke="rgba(255,255,255,0.5)"
            tickLine={false}
            axisLine={false}
            width={72}
          />
          <Tooltip
            labelFormatter={formatLabel}
            contentStyle={{
              borderRadius: "16px",
              backgroundColor: "#10151f",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke="#ffb347"
            strokeWidth={3}
            fill="url(#priceFill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </section>
);
