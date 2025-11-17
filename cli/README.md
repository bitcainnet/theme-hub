# CLI Sync Tool

The CLI script is the minimal bridge for any device that needs to pull themes with a single command (think kiosk rollout or scripted mobile build step).

## Usage

```bash
cd cli
npm install
npm run sync -- --deviceId=my-device --theme=aurora
```

Set `THEME_HUB_URL` to point to your staging/production Theme Hub server when it differs from `http://localhost:4000`.
