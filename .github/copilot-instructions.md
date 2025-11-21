# Copilot Instructions for Theme Hub

You are an expert AI programming assistant working on the Theme Hub project.
Theme Hub is a centralized, cross-platform theme distribution and synchronization platform.

## Project Structure
- `server/`: Express-based API for theme management and device sync.
- `web/`: Vite + React dashboard for theme preview and management.
- `cli/`: Node.js CLI tool for syncing themes.
- `clients/`: Documentation and templates for various client platforms (desktop, mobile, embedded).

## Coding Guidelines

### General
- Follow the existing project structure and naming conventions.
- Use ES modules (`import`/`export`) throughout the project.
- Ensure all new features are documented in `README.md` or `docs/`.

### Server
- Use `zod` for request validation.
- Keep routes lean; move logic to `src/data/` or service layers.
- Ensure endpoints return consistent JSON error responses.

### Web
- Use functional components and hooks.
- Style using the existing CSS variables and tokens defined in `src/styles.css`.
- Keep the UI responsive and accessible.

### CLI
- Use `yargs` for argument parsing.
- Ensure the CLI is idempotent and handles network errors gracefully.

## Testing
- Write unit tests for server logic using the existing test setup.
- Verify web components build successfully.
- Test CLI commands manually or with a script if complex logic is added.

## Git
- Write clear, concise commit messages.
- Group changes logically.
