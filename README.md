# Theme Hub

Theme Hub is a centralized, cross-platform theme distribution and synchronization platform inspired by the foundational theme components in [Skellekey](https://github.com/bitcainnet/skellekey). It keeps enterprise-approved themes in a single source of truth so any desktop, mobile, web, or future client can stay in sync without storing sensitive theme configuration locally.

## Architecture Overview

- **Server** – an Express-based API that stores shared theme definitions, tracks device registrations, and orchestrates sync events.
- **Web Client** – a Vite + React dashboard that previews themes, schedules syncs, and acts as a reference implementation for other platforms.
- **CLI Sync Tool** – a lightweight script that an administrator or automated pipeline can call to push theme updates to a device or pull the latest settings.
- **Future Clients** – `clients/mobile`, `clients/desktop`, and `clients/embedded` folders contain documentation and templates for adding platforms.

## Quick start

```bash
# install dependencies for all packages
npm install

# start the API server
npm run start:server

# in another terminal, launch the web dashboard
cd web && npm run dev
```

## Goals

- Keep themes out of personal devices while allowing every app to fetch the latest look and feel centrally.
- Provide a reusable reference client that can be copied to web, mobile, and desktop applications.
- Enable simple tooling to broadcast theme updates across the organization with a single command.
