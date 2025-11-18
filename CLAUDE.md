# CLAUDE.md - AI Assistant Guide for Theme Hub

> **Last Updated**: 2025-11-18
> **Repository**: Theme Hub - Centralized Cross-Platform Theme Distribution Platform

---

## Table of Contents

1. [Repository Overview](#repository-overview)
2. [Directory Structure](#directory-structure)
3. [Technology Stack](#technology-stack)
4. [Development Workflows](#development-workflows)
5. [Code Conventions & Patterns](#code-conventions--patterns)
6. [API Structure](#api-structure)
7. [Testing Approach](#testing-approach)
8. [Common Tasks](#common-tasks)
9. [Important Files Reference](#important-files-reference)
10. [Git Workflow](#git-workflow)
11. [AI Assistant Guidelines](#ai-assistant-guidelines)

---

## Repository Overview

### Purpose
Theme Hub is a centralized, cross-platform theme distribution and synchronization platform that keeps enterprise-approved themes in a single source of truth. Any desktop, mobile, web, or future client can stay in sync without storing sensitive theme configuration locally.

### Key Features
- **76 Professional Themes** across 15+ categories (dark, light, nature, corporate, developer, retro, etc.)
- **RESTful API** for theme catalog and device sync management
- **React Web Dashboard** for theme preview and management
- **CLI Tool** for automated deployments
- **Cross-Platform Templates** for mobile, desktop, and embedded clients
- **Comprehensive Documentation** with frontend patterns and setup guides

### Architecture Philosophy
- **Monorepo with npm workspaces** - All packages under single repo
- **Thin clients, smart server** - Business logic centralized in API
- **No persistent database** - In-memory device registry (suitable for single-instance)
- **Standardized theme tokens** - 6-token system (primary, accent, background, surface, text, border)
- **Modern JavaScript** - ES Modules throughout, no TypeScript in implementation

---

## Directory Structure

```
/home/user/theme-hub/
├── server/              # Express REST API (Port 4000)
│   ├── src/
│   │   ├── server.js           # Server entry point
│   │   ├── app.js              # Express app configuration
│   │   ├── routes/
│   │   │   └── themes.js       # Theme endpoints (/api/themes)
│   │   └── data/
│   │       └── themes.js       # 76 themes + device registry + utilities
│   └── test/
│       └── themes.test.js      # Theme catalog validation tests
│
├── web/                 # Vite + React Dashboard (Port 5173)
│   ├── src/
│   │   ├── main.jsx            # React entry point
│   │   ├── App.jsx             # Dashboard component
│   │   └── styles.css          # Dashboard styling
│   └── vite.config.js          # Vite + React plugin + API proxy config
│
├── cli/                 # Node.js CLI Tool
│   └── src/
│       └── cli.js              # Theme sync command-line interface
│
├── clients/             # Platform Integration Templates
│   ├── mobile/                 # React Native / Native Mobile
│   ├── desktop/                # Electron / Tauri / Native
│   └── embedded/               # IoT / Kiosk integration
│
├── docs/                # Comprehensive Documentation
│   ├── ARCHITECTURE.md         # System design overview
│   ├── USAGE.md                # Getting started guide
│   ├── QUICK_START_FRONTEND.md # 10-minute frontend setup
│   └── FRONTEND_DEVELOPMENT.md # Advanced patterns & best practices
│
├── examples/
│   └── ComponentLibrary.tsx    # Reusable animated components
│
├── scripts/
│   └── setup-frontend.sh       # Automated frontend scaffolding script
│
├── package.json         # Workspace root (npm workspaces)
├── README.md            # Project overview
└── CLAUDE.md            # This file
```

---

## Technology Stack

### Server (`@theme-hub/server`)
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js v4.19.2
- **Validation**: Zod v3.25.0 (schema validation)
- **Middleware**: CORS v2.8.5
- **Dev Tools**: Nodemon v3.1.0 (auto-restart)
- **Port**: 4000 (configurable via `PORT` env var)

### Web (`@theme-hub/web`)
- **Build Tool**: Vite v5.0.0
- **Framework**: React v18.3.0 + React DOM
- **State**: React Hooks (useState, useEffect, useMemo)
- **Plugin**: @vitejs/plugin-react v4.0.0
- **Port**: 5173 (dev server)
- **API Proxy**: Routes `/api/*` to `http://localhost:4000`

### CLI (`@theme-hub/cli`)
- **HTTP Client**: node-fetch v3.3.2
- **CLI Framework**: yargs v17.7.2

### Frontend Development Stack (Optional)
- **Styling**: Tailwind CSS 3+
- **Components**: shadcn/ui
- **Animations**: Framer Motion
- **TypeScript**: Supported in examples/docs

### Package Management
- **Tool**: npm workspaces
- **Node Version**: Tested on modern Node.js (v18+)

---

## Development Workflows

### Initial Setup

```bash
# Clone repository
git clone <repository-url>
cd theme-hub

# Install all workspace dependencies
npm install

# Or use the setup script
npm run setup
```

### Running the Application

```bash
# Start server (development mode with auto-restart)
npm run start:server
# Server runs at http://localhost:4000

# In another terminal, start web dashboard
npm run start:web
# Web dashboard runs at http://localhost:5173

# Or use shortcuts
npm start              # Starts server only
cd web && npm run dev  # Starts web only
```

### Development Server Details

**Server** (`server/`):
- Entry: `server/src/server.js`
- Dev mode: `nodemon src/server.js` (auto-restart on file changes)
- Watches: All `.js` files in `src/`
- Logs: Console output with timestamps

**Web** (`web/`):
- Entry: `web/src/main.jsx`
- Dev mode: Vite dev server with HMR
- Auto-opens: Browser at http://localhost:5173
- Proxy: `/api/*` → `http://localhost:4000`

### Building for Production

```bash
# Build web dashboard
cd web
npm run build
# Output: web/dist/

# Preview production build
npm run preview
```

### Running Tests

```bash
# Run server tests
cd server
npm test

# Or from root
npm run --workspace @theme-hub/server test
```

### Using the CLI Tool

```bash
cd cli

# List all themes
node src/cli.js --list --baseUrl=http://localhost:4000

# Sync a specific theme to a device
node src/cli.js --deviceId=my-device --theme=aurora --baseUrl=http://localhost:4000

# See all options
node src/cli.js --help
```

---

## Code Conventions & Patterns

### JavaScript Style

1. **ES Modules**: All files use `import`/`export` syntax
   ```javascript
   import express from "express";
   export { app };
   ```

2. **No Semicolons**: ASI (Automatic Semicolon Insertion) is used
   - Exception: Necessary semicolons in specific contexts

3. **Async/Await**: Preferred over `.then()` chains
   ```javascript
   const fetchThemes = async () => {
     const response = await fetch(url);
     return await response.json();
   };
   ```

4. **Arrow Functions**: Preferred for callbacks and function expressions
   ```javascript
   router.get("/", (req, res) => {
     res.json({ themes });
   });
   ```

### File Naming

- **JavaScript files**: `.js` extension
- **React components**: `.jsx` extension
- **TypeScript examples**: `.tsx` extension (in examples/ only)
- **Config files**: Lowercase with dots (e.g., `vite.config.js`)
- **Documentation**: UPPERCASE.md (e.g., `README.md`, `ARCHITECTURE.md`)

### Component Structure (React)

```javascript
import { useState, useEffect } from "react";

function ComponentName() {
  // 1. State declarations
  const [state, setState] = useState(initialValue);

  // 2. Effect hooks
  useEffect(() => {
    // Side effects
  }, [dependencies]);

  // 3. Event handlers
  const handleEvent = async () => {
    // Handler logic
  };

  // 4. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}

export default ComponentName;
```

### API Route Structure

```javascript
import { Router } from "express";
import { z } from "zod";

const router = Router();

// 1. Define validation schemas
const schema = z.object({
  field: z.string().min(1)
});

// 2. Define route handlers
router.get("/path", (req, res) => {
  // Handler logic
});

router.post("/path", (req, res) => {
  // Validate first
  const payload = schema.safeParse(req.body);
  if (!payload.success) {
    return res.status(400).json({ errors: payload.error.flatten().fieldErrors });
  }

  // Handle valid request
  const { field } = payload.data;
  // Business logic
  res.json({ result: "ok" });
});

export { router };
```

### Error Handling

**Server**:
- Use Zod validation for request validation
- Return 400 for validation errors with error details
- Return 404 for not found resources
- Log errors to console in development

**Client**:
- Use try/catch with async/await
- Set error state for user feedback
- Display errors in UI (not just console)

### State Management

**Web Dashboard**:
- Uses React hooks (no Redux/Zustand)
- Local component state with `useState`
- Side effects with `useEffect`
- Computed values with `useMemo`

**Server**:
- In-memory device registry (Map)
- No persistent database
- State resets on server restart

### Environment Variables

**Server**:
- `PORT`: Server port (default: 4000)

**Web**:
- `VITE_API_BASE_URL`: API base URL (default: http://localhost:4000)
- Access via `import.meta.env.VITE_API_BASE_URL`

---

## API Structure

### Base URL
- **Development**: `http://localhost:4000`
- **Production**: Set via environment variable

### Endpoints

#### GET `/api/themes`
List all themes in catalog.

**Response**:
```json
{
  "themes": [
    {
      "id": "aurora",
      "name": "Aurora",
      "description": "Northern lights inspired theme",
      "version": "1.0.0",
      "tokens": {
        "primary": "#8b5cf6",
        "accent": "#a78bfa",
        "background": "#1e1b4b",
        "surface": "#312e81",
        "text": "#e0e7ff",
        "border": "#4c1d95"
      },
      "assetsUrl": "/themes/aurora"
    }
  ],
  "count": 76
}
```

#### POST `/api/themes/sync`
Register device and apply theme.

**Request**:
```json
{
  "deviceId": "my-device",
  "themeId": "aurora"
}
```

**Response**:
```json
{
  "result": "ok",
  "applied": {
    "id": "aurora",
    "name": "Aurora",
    "tokens": { /* ... */ },
    "appliedAt": "2025-11-18T10:30:00.000Z",
    "deviceId": "my-device",
    "syncId": "my-device-1731925800000"
  }
}
```

**Validation**:
- `deviceId`: String, min 3 characters
- `themeId`: String, min 1 character
- Returns 400 if validation fails

#### GET `/api/themes/devices/:deviceId`
Check device registration status.

**Response**:
```json
{
  "deviceId": "my-device",
  "status": "registered"
}
```

#### GET `/health`
Health check endpoint for automation.

**Response**:
```json
{
  "status": "ok",
  "timestamp": "2025-11-18T10:30:00.000Z"
}
```

### Validation with Zod

All POST endpoints validate request bodies using Zod schemas defined in `server/src/routes/themes.js`:

```javascript
const syncSchema = z.object({
  deviceId: z.string().min(3),
  themeId: z.string().min(1)
});

const payload = syncSchema.safeParse(req.body);
if (!payload.success) {
  return res.status(400).json({
    errors: payload.error.flatten().fieldErrors
  });
}
```

---

## Testing Approach

### Server Tests

**Location**: `server/test/themes.test.js`

**Coverage**:
- Theme catalog validation
- `determineTheme()` function correctness
- Device ID propagation
- Sync ID generation
- Fallback behavior

**Run**:
```bash
cd server
npm test
```

**Writing New Tests**:
- Use Node.js native test runner (no external framework)
- Import functions from `server/src/data/themes.js`
- Use assertions to validate behavior
- Test both happy paths and error cases

### Manual Testing

**Web Dashboard**:
1. Start server and web: `npm run start:server` + `npm run start:web`
2. Open http://localhost:5173
3. Verify theme catalog loads
4. Click "Sync" button on a theme
5. Check sync feedback message

**CLI Tool**:
1. Start server: `npm run start:server`
2. Run CLI: `cd cli && node src/cli.js --list --baseUrl=http://localhost:4000`
3. Verify theme list displays
4. Test sync: `node src/cli.js --deviceId=test --theme=aurora --baseUrl=http://localhost:4000`

**API Endpoints**:
```bash
# Test with curl
curl http://localhost:4000/api/themes
curl http://localhost:4000/health
curl -X POST http://localhost:4000/api/themes/sync \
  -H "Content-Type: application/json" \
  -d '{"deviceId":"test","themeId":"aurora"}'
```

---

## Common Tasks

### Adding a New Theme

**File**: `server/src/data/themes.js`

1. Add theme object to `themes` array:
```javascript
{
  id: "my-new-theme",
  name: "My New Theme",
  description: "Description of theme purpose/inspiration",
  version: "1.0.0",
  tokens: {
    primary: "#hexcolor",
    accent: "#hexcolor",
    background: "#hexcolor",
    surface: "#hexcolor",
    text: "#hexcolor",
    border: "#hexcolor"
  },
  assetsUrl: "/themes/my-new-theme"
}
```

2. Test theme appears in catalog:
```bash
curl http://localhost:4000/api/themes | grep "my-new-theme"
```

3. Test theme can be synced:
```bash
curl -X POST http://localhost:4000/api/themes/sync \
  -H "Content-Type: application/json" \
  -d '{"deviceId":"test","themeId":"my-new-theme"}'
```

### Adding a New API Endpoint

**File**: `server/src/routes/themes.js`

1. Define validation schema (if POST/PUT):
```javascript
const mySchema = z.object({
  field: z.string().min(1)
});
```

2. Add route handler:
```javascript
router.get("/my-endpoint", (req, res) => {
  // Logic here
  res.json({ result: "ok" });
});
```

3. Export router (already done in file)

4. Test endpoint:
```bash
curl http://localhost:4000/api/themes/my-endpoint
```

### Modifying the Web Dashboard

**Files**: `web/src/App.jsx`, `web/src/styles.css`

**Key patterns**:
- State changes trigger re-renders
- API calls in `useEffect` or event handlers
- Error handling with try/catch and error state
- Loading states for async operations

**Example - Adding a filter**:
```javascript
const [filter, setFilter] = useState("");

const filteredThemes = useMemo(() =>
  themes.filter(t => t.name.toLowerCase().includes(filter.toLowerCase())),
  [themes, filter]
);

// In JSX:
<input
  type="text"
  value={filter}
  onChange={(e) => setFilter(e.target.value)}
  placeholder="Filter themes..."
/>
```

### Creating a Frontend Project with Setup Script

**Script**: `scripts/setup-frontend.sh`

```bash
cd scripts
./setup-frontend.sh my-new-app

# Script creates:
# - Vite + React + TypeScript project
# - Tailwind CSS + Framer Motion setup
# - ThemeContext for Theme Hub integration
# - shadcn/ui components
# - Custom animations and theme colors
```

### Extending to New Platforms

**Templates**: `clients/mobile/`, `clients/desktop/`, `clients/embedded/`

**General pattern**:
1. Read relevant template in `clients/`
2. Implement API integration (fetch from `/api/themes`)
3. Register device with `POST /api/themes/sync`
4. Apply theme tokens to platform-specific styles
5. Persist only theme ID/version, not full theme data

---

## Important Files Reference

### Configuration Files

| File | Purpose | Key Settings |
|------|---------|--------------|
| `/package.json` | Workspace root | Workspaces: server, web, cli |
| `/server/package.json` | Server config | Express, Zod, Nodemon |
| `/web/package.json` | Web config | React, Vite |
| `/cli/package.json` | CLI config | yargs, node-fetch |
| `/web/vite.config.js` | Vite config | React plugin, proxy `/api/*` to port 4000 |
| `/.gitignore` | Git ignore | node_modules/, dist/, .env |

### Core Implementation Files

| File | Lines | Purpose |
|------|-------|---------|
| `/server/src/server.js` | 6 | Server entry point, listens on port 4000 |
| `/server/src/app.js` | 21 | Express app setup, CORS, routes, health check |
| `/server/src/routes/themes.js` | 42 | Theme API endpoints with Zod validation |
| `/server/src/data/themes.js` | 1192 | 76 themes + device registry + utilities |
| `/web/src/main.jsx` | 6 | React entry point |
| `/web/src/App.jsx` | 110 | Dashboard component with theme grid |
| `/web/src/styles.css` | 105 | Dashboard styling (dark theme, glass cards) |
| `/cli/src/cli.js` | 75 | CLI tool for theme sync |

### Documentation Files

| File | Size | Purpose |
|------|------|---------|
| `/README.md` | 3.7KB | Project overview, quick start |
| `/docs/ARCHITECTURE.md` | 1.5KB | System design overview |
| `/docs/USAGE.md` | 1.5KB | Setup and running guide |
| `/docs/QUICK_START_FRONTEND.md` | 8.7KB | 10-minute frontend setup |
| `/docs/FRONTEND_DEVELOPMENT.md` | 25KB | Comprehensive frontend patterns |
| `/clients/*/README.md` | Various | Platform integration guides |

### Example Files

| File | Size | Purpose |
|------|------|---------|
| `/examples/ComponentLibrary.tsx` | 17KB | Reusable animated components with Framer Motion |

---

## Git Workflow

### Branch Strategy

- **Main branch**: `main` (or as specified in git config)
- **Feature branches**: `claude/*` prefix required for AI assistant work
- **Branch naming**: Must match session ID for push authorization

### Common Git Operations

**Starting work**:
```bash
# Check current branch
git status

# Create feature branch (if needed)
git checkout -b claude/feature-name-session-id

# Pull latest changes
git pull origin <branch-name>
```

**Committing changes**:
```bash
# See modified files
git status

# See changes
git diff

# Stage files
git add <file>

# Commit with message
git commit -m "$(cat <<'EOF'
Add new theme: Northern Lights

- Add aurora theme with purple/indigo color palette
- Update theme catalog count
- Add test for new theme
EOF
)"
```

**Pushing changes**:
```bash
# Push to remote (use -u for new branches)
git push -u origin claude/feature-name-session-id

# Retry on network failure with exponential backoff
# (up to 4 retries: 2s, 4s, 8s, 16s)
```

### Commit Message Guidelines

- Use imperative mood ("Add" not "Added")
- First line: Brief summary (50 chars max)
- Blank line after summary
- Detailed description if needed
- Use HEREDOC format for multi-line messages

**Examples**:
```bash
# Simple commit
git commit -m "Fix theme sync error handling"

# Detailed commit
git commit -m "$(cat <<'EOF'
Add comprehensive theme validation

- Validate all 6 required token fields
- Add color format validation (hex only)
- Return detailed error messages
- Add tests for validation logic
EOF
)"
```

### Creating Pull Requests

```bash
# Ensure all changes are committed
git status

# Push branch
git push -u origin claude/feature-name-session-id

# Create PR (if gh CLI available)
gh pr create --title "Add feature X" --body "$(cat <<'EOF'
## Summary
- Add new feature X
- Update documentation
- Add tests

## Test plan
- [x] Run server tests
- [x] Test web dashboard
- [x] Manual API testing
EOF
)"
```

---

## AI Assistant Guidelines

### General Principles

1. **Read before writing**: Always read existing files before modifying
2. **Use existing patterns**: Follow established code style and structure
3. **Validate assumptions**: Check file locations and structure before operating
4. **Test changes**: Run tests and manual verification after changes
5. **Document decisions**: Update CLAUDE.md when making architectural changes

### Working with the Codebase

**File Operations**:
- Use Read tool for reading files (not `cat`)
- Use Edit tool for modifying files (not `sed`/`awk`)
- Use Write tool only for new files
- Use Glob for finding files by pattern
- Use Grep for searching file contents

**Code Changes**:
- Prefer editing existing files over creating new ones
- Match existing indentation (spaces/tabs)
- Follow ES module syntax (`import`/`export`)
- Add validation for new API endpoints (Zod schemas)
- Update tests when changing business logic

**Documentation**:
- Update README.md if adding major features
- Update CLAUDE.md if changing architecture/workflows
- Don't create unnecessary markdown files
- Keep docs concise and actionable

### Common Workflows for AI Assistants

**Investigating an issue**:
1. Read relevant files (server/src/routes/, server/src/data/)
2. Check tests (server/test/)
3. Review documentation (docs/)
4. Test locally if needed

**Adding a feature**:
1. Understand requirements clearly
2. Identify affected files
3. Read current implementation
4. Make minimal changes to achieve goal
5. Add/update tests
6. Update documentation if needed
7. Test changes locally

**Debugging**:
1. Reproduce issue locally
2. Check server logs
3. Test API with curl
4. Check browser console (web)
5. Review relevant code sections
6. Fix and verify

### Security Considerations

**Avoid**:
- Command injection (validate all user inputs)
- XSS vulnerabilities (sanitize outputs)
- SQL injection (not applicable - no database)
- Exposing secrets in code or logs
- CORS misconfigurations (currently allows all origins)

**Best practices**:
- Validate all request inputs with Zod
- Use parameterized queries if adding database
- Sanitize user-provided data before rendering
- Don't commit `.env` files or secrets
- Review OWASP top 10 vulnerabilities

### Testing Requirements

**Before committing**:
- Run `npm run --workspace @theme-hub/server test`
- Start server and verify health endpoint: `curl http://localhost:4000/health`
- Start web dashboard and verify theme loading
- Test changed API endpoints manually

**For new features**:
- Add tests to `server/test/themes.test.js`
- Test happy path and error cases
- Verify validation errors return 400 with details
- Check CORS headers if needed

### Performance Considerations

**Server**:
- In-memory storage is fast but volatile
- No database queries to optimize
- Theme catalog is loaded once at startup
- Consider caching if adding external API calls

**Web**:
- Use `useMemo` for expensive computations
- Avoid unnecessary re-renders (check dependencies)
- Lazy load large components if needed
- Vite optimizes bundle automatically

### When to Ask for Clarification

Ask the user when:
- Requirements are ambiguous (multiple valid approaches)
- Breaking changes are needed
- External dependencies would be added
- Significant architecture changes are proposed
- Security implications are unclear
- Database/persistent storage is needed

### Anti-Patterns to Avoid

**Don't**:
- Create new files when editing existing ones would work
- Use bash commands for file operations (use tools instead)
- Guess at API endpoints or data structures (read the code)
- Make breaking changes without discussion
- Add dependencies without justification
- Skip validation on new endpoints
- Commit without testing
- Push to wrong branch
- Ignore existing code style

**Do**:
- Read files before modifying
- Follow existing patterns
- Test changes locally
- Update relevant documentation
- Use Zod for validation
- Handle errors gracefully
- Write clear commit messages
- Ask for clarification when uncertain

---

## Quick Reference

### Ports
- Server: `4000`
- Web: `5173`

### Key Commands
```bash
npm install              # Setup all workspaces
npm run start:server     # Start API server
npm run start:web        # Start web dashboard
npm test                 # Run tests (in server workspace)
```

### Key URLs
- API: http://localhost:4000
- Web: http://localhost:5173
- Health: http://localhost:4000/health
- Themes: http://localhost:4000/api/themes

### Key Files to Check First
- `/README.md` - Project overview
- `/server/src/data/themes.js` - Theme catalog
- `/server/src/routes/themes.js` - API endpoints
- `/web/src/App.jsx` - Web dashboard
- `/docs/ARCHITECTURE.md` - System design

### Getting Help
- Documentation: `/docs/` directory
- Examples: `/examples/ComponentLibrary.tsx`
- Templates: `/clients/*/README.md`
- Frontend guide: `/docs/FRONTEND_DEVELOPMENT.md`

---

## Changelog

### 2025-11-18
- Initial CLAUDE.md creation
- Documented complete codebase structure
- Added development workflows and conventions
- Included API reference and testing guide
- Added AI assistant guidelines

---

**For questions or updates to this guide, modify this file directly and commit changes.**
