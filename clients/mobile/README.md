# Mobile Clients

Mobile apps (native or React Native) should treat Theme Hub as the single truth:

- Sync themes over HTTPS on app startup or via push notifications.
- Persist only the active theme metadata (id + version) so background syncs can detect drift.
- Use `GET /api/themes?deviceId=<id>` to retrieve the latest theme and download supporting assets from `assetsUrl`.
- Show a "Sync now" control that calls `POST /api/themes/:id/sync` with the device fingerprint when users need immediacy.

Follow the `web` client's layout when building the UI to reduce styling drift.
