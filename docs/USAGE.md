# Usage Guide

## Workspace setup

```bash
cd /home/cain/projects/theme-hub
npm install
```

This installs the dependencies for the `server`, `web`, and `cli` packages.

## Running the API server

```bash
npm run --workspace @theme-hub/server dev
```

The server listens on `http://localhost:4000` by default. Use `NODE_ENV=production` and `PORT=` when deploying.

## Launching the web dashboard

```bash
npm run --workspace @theme-hub/web dev
```

The Vite dev server proxies `/api` to `http://localhost:4000` so you can interact with Theme Hub without CORS issues.

## CLI sync flow

```bash
cd cli
npm run sync -- --deviceId=my-device --theme=aurora
```

Set `THEME_HUB_URL` in the shell if the API is hosted externally.

## Testing and validation

- **Server unit tests:**

```bash
npm run --workspace @theme-hub/server test
```

This runs the lightweight catalog validation script in `server/test/themes.test.js`.

- **Web build check:**

```bash
npm run --workspace @theme-hub/web build
```

This ensures the React dashboard compiles.

- **CLI sanity check:**

```bash
cd cli && node src/cli.js --help
```

This confirms the CLI entry point executes without runtime errors.

## Syncing themes across clients

1. Publish or edit themes via the web dashboard or direct `POST /api/themes` workflow (future extension).
2. Trigger a sync from any client using `POST /api/themes/sync` with the registered `deviceId`.
3. Schedule the CLI or embedded cron script to pull the latest catalog and refresh local styling.
