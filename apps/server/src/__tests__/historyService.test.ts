import { describe, expect, it } from "vitest";
import { HistoryService } from "../services/historyService.js";

describe("HistoryService", () => {
  it("returns a stable number of mocked points", () => {
    const service = new HistoryService();
    const history = service.getHistory("AAPL", 24);

    expect(history).toHaveLength(24);
    expect(history[0]?.price).toBeTypeOf("number");
    expect(history[0]?.timestamp).toBeTypeOf("string");
  });

  it("caches history requests for the same symbol and points", () => {
    const service = new HistoryService();
    const first = service.getHistory("TSLA", 12);
    const second = service.getHistory("TSLA", 12);

    expect(second).toBe(first);
  });
});
