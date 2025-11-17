# Embedded & IoT Clients

For kiosks, digital signage, or other embedded devices, Theme Hub can act as the remote theme operator:

- Use the CLI tool (`cli/src/cli.js`) in a cron or service to periodically fetch new themes.
- The CLI can also stream updates to a local MQTT broker or message queue that the embedded stack listens to.
- Keep the device whitelist (`clients/embedded/authorized-devices.json`) in sync with the organization’s inventory.

Add a lightweight UI or voice command layer that surfaces the current theme and allows remote operators to trigger `POST /api/themes/:id/sync` via the API.
