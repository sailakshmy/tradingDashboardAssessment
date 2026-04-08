import type { HistoryResponse, TickersResponse } from "../types/market";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000/api";

export const wsBaseUrl = (
  import.meta.env.VITE_WS_BASE_URL ?? "ws://localhost:4000/ws"
).replace(/\/$/, "");

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return (await response.json()) as T;
}

export const marketApi = {
  getTickers: () => fetchJson<TickersResponse>("/tickers"),
  getHistory: (symbol: string, points = 60) =>
    fetchJson<HistoryResponse>(`/tickers/${symbol}/history?points=${points}`),
};
