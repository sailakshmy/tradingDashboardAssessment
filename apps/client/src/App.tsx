// import { AlertPanel } from "./components/AlertPanel";
import { AlertPanel } from "./components/AlertPanel";
import { PriceChart } from "./components/PriceChart";
import { TickerList } from "./components/TickerList";
import { useMarketDashboard } from "./hooks/useMarketDashboard";

export const App = () => {
  const {
    tickers,
    livePrices,
    selectedSymbol,
    selectSymbol,
    history,
    loading,
    error,
    alertThreshold,
    setAlertThreshold,
    alertTriggered,
  } = useMarketDashboard();

  const selectedTicker = tickers.find(
    (ticker) => ticker.symbol === selectedSymbol,
  );
  const selectedPrice = livePrices[selectedSymbol];

  return (
    <main className="app-shell">
      <section className="hero">
        <div>
          <p className="eyebrow">Realtime trading dashboard</p>
          <h1>
            Track fast-moving symbols with live pricing and an interactive
            stream chart.
          </h1>
        </div>
      </section>

      {error ? <div className="error-banner">{error}</div> : null}

      <section className="panel">
        <div className="panel__header">
          <div>
            <span className="eyebrow">Markets</span>
            <h2>Live ticker board</h2>
          </div>
          <span className="status-pill">
            {loading ? "Loading" : "Streaming"}
          </span>
        </div>
        <TickerList
          tickers={tickers}
          livePrices={livePrices}
          selectedSymbol={selectedSymbol}
          onSelect={selectSymbol}
        />
      </section>

      <section className="content-grid">
        <PriceChart
          ticker={selectedTicker}
          currentPrice={selectedPrice}
          history={history}
        />
        <AlertPanel
          selectedSymbol={selectedSymbol}
          alertThreshold={alertThreshold}
          alertTriggered={alertTriggered}
          onChange={setAlertThreshold}
        />
      </section>
    </main>
  );
};
