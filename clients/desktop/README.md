# Desktop Clients

Desktop teams should use Electron, Tauri, or native frameworks to render the UI, but defer theme decisions to Theme Hub:

1. Register the client with the `POST /api/devices` endpoint and store the returned device token securely.
2. Hit `GET /api/themes` to retrieve silver/gold-certified theme bundles (color tokens, typography, assets).
3. Apply the theme locally without persisting the raw file; keep only a lightweight manifest to compare against the server's sync version.

For inspiration, copy the React dashboard in `web` and port its fetch layer to your framework of choice. Use the CLI tool to bootstrap automated updates when theme changes are approved.
