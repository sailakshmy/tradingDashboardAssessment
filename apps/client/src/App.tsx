import "./App.css";

function App() {
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
        <p className="hero__copy">
          Built as a TypeScript fullstack challenge with an Express
          microservice, WebSocket feed, mocked history caching, and a responsive
          React client.
        </p>
      </section>
    </main>
  );
}

export default App;
