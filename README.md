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

## Theme Library

Theme Hub now includes **76 professionally-designed themes** across 15+ categories:

- **Dark Themes** (6): Midnight, Obsidian, Charcoal, Deep Ocean, Void, Noir
- **Light Themes** (6): Daylight, Pearl, Cloud, Paper, Vanilla, Snow
- **Nature-Inspired** (8): Forest, Meadow, Sunset, Ocean Breeze, Lavender Fields, Autumn, Cherry Blossom, Desert
- **Professional/Corporate** (5): Corporate Blue, Executive, Slate Professional, Financial, Minimalist Pro
- **Vibrant/Energetic** (5): Neon Nights, Cyber Punk, Electric, Tropical, Sunset Glow
- **High Contrast/Accessibility** (3): High Contrast Dark/Light, Amber Contrast
- **Tech/Developer** (8): Terminal, Matrix, Dracula, Monokai, Solarized Dark/Light, Nord, One Dark
- **Retro/Vintage** (5): Retro Amber/Green, Commodore 64, Vaporwave, Synthwave
- **Material Design** (3): Material Indigo, Material Teal, Material Deep Purple
- **Specialty Themes** (20+): Including gemstone themes (Ruby, Emerald, Sapphire), warm/cool tones, and more

All themes include standardized color tokens (primary, accent, background, surface, text, border) for seamless cross-platform integration.

## Frontend Development

Theme Hub includes comprehensive tooling for building beautiful, animated frontends:

### Quick Start
```bash
# Automated setup with Tailwind CSS, React, and shadcn/ui
cd scripts
./setup-frontend.sh
```

### Documentation
- **[Quick Start Guide](docs/QUICK_START_FRONTEND.md)** - Get up and running in under 10 minutes
- **[Frontend Development Guide](docs/FRONTEND_DEVELOPMENT.md)** - Comprehensive patterns, animations, and best practices
- **[Architecture](docs/ARCHITECTURE.md)** - System design and integration details
- **[Usage Guide](docs/USAGE.md)** - API documentation and client integration

### Tech Stack Support
- ✅ **React 18+** with TypeScript
- ✅ **Tailwind CSS 3+** with custom animations
- ✅ **shadcn/ui** component library
- ✅ **Framer Motion** for animations
- ✅ **Vite** for blazing-fast development

## Goals

- Keep themes out of personal devices while allowing every app to fetch the latest look and feel centrally.
- Provide a reusable reference client that can be copied to web, mobile, and desktop applications.
- Enable simple tooling to broadcast theme updates across the organization with a single command.
- Offer an extensive library of professionally-designed themes for instant deployment.
- Support rapid frontend development with modern tooling and best practices.
