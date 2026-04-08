import "./AlertPanel.css";
interface AlertPanelProps {
  selectedSymbol: string;
  alertThreshold: number | null;
  alertTriggered: boolean;
  onChange: (value: number | null) => void;
}

export const AlertPanel = ({
  selectedSymbol,
  alertThreshold,
  alertTriggered,
  onChange,
}: AlertPanelProps) => (
  <section className="panel alert-panel">
    <div className="panel__header">
      <div>
        <span className="eyebrow">Mocked bonus</span>
        <h2>Price alert</h2>
      </div>
      <span className={`alert-badge ${alertTriggered ? "live" : ""}`}>
        {alertTriggered ? "Triggered" : "Monitoring"}
      </span>
    </div>
    <p>
      Set a threshold for <strong>{selectedSymbol}</strong> and the dashboard
      will flag when the live price crosses it during this session.
    </p>
    <label className="alert-panel__form">
      <span>Alert when price is above</span>
      <input
        type="number"
        value={alertThreshold ?? ""}
        onChange={(event) =>
          onChange(event.target.value ? Number(event.target.value) : null)
        }
        placeholder="Enter a price"
      />
    </label>
  </section>
);
