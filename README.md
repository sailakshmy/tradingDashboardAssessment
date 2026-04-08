# Pulse Trade Dashboard

Pulse Trade Dashboard is a TypeScript fullstack coding challenge solution that simulates a live market feed and renders a responsive trading interface with live prices, ticker switching, and a streaming chart.

## Project overview

- `apps/server`: Express-based market data microservice with REST endpoints, a mocked historical price service, and WebSocket broadcasting.
- `apps/client`: React + TypeScript dashboard built with Vite and Recharts.
- `docker-compose.yml`: Local container orchestration for the full stack.

## Features

- Live ticker board for `AAPL`, `TSLA`, `BTC-USD`, `ETH-USD`, and `MSFT`
- Real-time price updates over WebSocket
- Historical price API with simple in-memory caching
- Interactive chart for the selected ticker
- Mock threshold alerting in the client
- Unit tests for backend history and route behavior
- Docker support for local evaluation

## Architecture and design choices

- The backend separates ticker metadata, price simulation, history generation, and HTTP routing into focused modules to stay microservice-friendly.
- Historical data is mocked deterministically and cached in memory to keep the service lightweight while still demonstrating cache behavior.
- The frontend keeps API access, live market state, and presentation components separate so the dashboard can grow without coupling chart logic to transport logic.
- WebSocket payloads send an initial snapshot plus incremental updates, which keeps the client state model simple.

## Assumptions and trade-offs

- Market data is simulated rather than sourced from a third-party provider.
- History is generated in-memory and reset on restart; no database was added to keep the challenge focused.
- Authentication was left mocked-out in favor of delivering a stronger realtime dashboard and bonus alerting/caching.
- Progressive commit history was not generated automatically in this workspace; create commits intentionally when publishing the repository.

## Running locally

### Prerequisites

- Node.js 22+
- npm 10+

### Install dependencies

```bash
npm install
```

### Start the full stack in development

```bash
npm run dev
```

- Backend: `http://localhost:4000`
- Frontend: `http://localhost:5173`
- WebSocket: `ws://localhost:4000/ws`

### Build for production

```bash
npm run build
```

### Run backend tests

```bash
npm test
```

## Docker

```bash
docker compose up --build
```

- Backend: `http://localhost:4000`
- Frontend: `http://localhost:4173`

## API summary

### REST

- `GET /api/health`
- `GET /api/tickers`
- `GET /api/tickers/:symbol/history?points=60`
- `GET /api/alerts`

### WebSocket

- Connect to `/ws`
- Receives:
  - `snapshot`
  - `price-update`

## Notes on bonus features

- Caching: Implemented for historical data on the backend and reused in the client for previously viewed tickers.
- Alerting: Implemented as a session-scoped client threshold alert for the selected symbol.
