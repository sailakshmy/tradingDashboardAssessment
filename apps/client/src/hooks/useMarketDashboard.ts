import { useEffect, useRef, useState } from "react";

import type { PricePoint, PriceUpdate, Ticker } from "../types/market";
import { marketApi, wsBaseUrl } from "../api/marketAPI";

const historyCache = new Map<string, PricePoint[]>();

const limitSeries = (points: PricePoint[], maxPoints = 60): PricePoint[] =>
  points.slice(-maxPoints);

export const useMarketDashboard = () => {
  const [tickers, setTickers] = useState<Ticker[]>([]);
  const [livePrices, setLivePrices] = useState<Record<string, PriceUpdate>>({});
  const [selectedSymbol, setSelectedSymbol] = useState<string>("AAPL");
  const [history, setHistory] = useState<PricePoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [alertThreshold, setAlertThreshold] = useState<number | null>(null);
  const [alertTriggered, setAlertTriggered] = useState(false);
  const selectedSymbolRef = useRef(selectedSymbol);
  const alertThresholdRef = useRef<number | null>(alertThreshold);

  useEffect(() => {
    selectedSymbolRef.current = selectedSymbol;
  }, [selectedSymbol]);

  useEffect(() => {
    alertThresholdRef.current = alertThreshold;
  }, [alertThreshold]);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const response = await marketApi.getTickers();
        setError(null);
        setTickers(response.data);
        setLivePrices(
          Object.fromEntries(
            response.livePrices.map((item) => [item.symbol, item]),
          ),
        );

        if (!response.data.some((ticker) => ticker.symbol === selectedSymbol)) {
          setSelectedSymbol(response.data[0]?.symbol ?? "AAPL");
        }
      } catch (requestError) {
        setError(`Unable to load market data. ${requestError}`);
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, []);

  useEffect(() => {
    const loadHistory = async () => {
      if (!selectedSymbol) {
        return;
      }

      const cached = historyCache.get(selectedSymbol);
      if (cached) {
        setHistory(cached);
        return;
      }

      try {
        const response = await marketApi.getHistory(selectedSymbol, 60);
        setError(null);
        historyCache.set(selectedSymbol, response.data);
        setHistory(response.data);
      } catch (requestError) {
        setError("Unable to load historical chart data.");
      }
    };

    loadHistory();
    setAlertTriggered(false);
  }, [selectedSymbol]);

  useEffect(() => {
    const socket = new WebSocket(wsBaseUrl);

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data) as
        | { type: "snapshot"; payload: PriceUpdate[] }
        | { type: "price-update"; payload: PriceUpdate };

      if (message.type === "snapshot") {
        setLivePrices(
          Object.fromEntries(
            message.payload.map((item) => [item.symbol, item]),
          ),
        );
        return;
      }

      const update = message.payload;
      setLivePrices((current) => ({
        ...current,
        [update.symbol]: update,
      }));

      if (update.symbol === selectedSymbolRef.current) {
        setHistory((current) => {
          const nextHistory = limitSeries([
            ...current,
            { timestamp: update.timestamp, price: update.price },
          ]);
          historyCache.set(update.symbol, nextHistory);
          return nextHistory;
        });

        if (
          alertThresholdRef.current !== null &&
          update.price >= alertThresholdRef.current
        ) {
          setAlertTriggered(true);
        }
      }
    };

    socket.onerror = () => {
      setError("WebSocket connection dropped.");
    };

    return () => {
      socket.close();
    };
  }, []);

  return {
    tickers,
    livePrices,
    selectedSymbol,
    selectSymbol: setSelectedSymbol,
    history,
    loading,
    error,
    alertThreshold,
    setAlertThreshold,
    alertTriggered,
  };
};
