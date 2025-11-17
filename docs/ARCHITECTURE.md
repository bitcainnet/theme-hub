# Theme Hub Architecture

Theme Hub is organized as a workspace so each platform can be developed independently while sharing canonical data and tooling.

## Central Server

The `server` package exposes RESTful endpoints for:

- Listing all approved themes
- Reporting device registrations and last sync timestamps
- Broadcasting theme changes via a message queue (WebSocket hooks or webhook recipes) for responsive clients
- Validating payloads with Zod before persisting them in the shared theme catalog

The server also maintains sample data (`src/data/themes.js`) and exposes a `/health` endpoint for automation.

## Web Dashboard

The `web` package is a Vite + React project that:

- Visualizes every theme with live previews
- Lets administrators publish, preview, and trigger device syncs
- Serves as a blueprint for other platform bridges (desktop, mobile, CLI)

It is intentionally lean to make it easy to understand how to consume the server API.

## CLI Sync Tool

The `cli` package provides a script that:

- Authenticates with the Theme Hub server using API tokens
- Pulls the latest theme payloads and writes them locally (or streams them to another client)
- Can be embedded in automated deployments to refresh user environments without end-user interaction

## Extending to Other Platforms

Look at `clients/mobile`, `clients/desktop`, and `clients/embedded` for starter templates and suggested sync workflows. Each of those directories contains guidance on how to consume the `server` API and keep theme data off personal devices.
