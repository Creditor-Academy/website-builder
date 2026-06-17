# AGENTS.md — Buildora Website Builder (Frontend)

> This file provides context for AI coding assistants (Antigravity, Gemini, Copilot, Cursor, etc.)
> working on the Frontend repository. Read this before making any changes.

---

## Project Overview

**Product:** Buildora (codename Athena) — A multi-tenant SaaS website builder platform
**Stage:** Alpha — core editor and dashboard functional.
**Focus Area:** Frontend development (React + Vite + TypeScript + Tailwind CSS)

Buildora lets institutions (universities, colleges) and individuals build, publish, and manage professional websites without code. This repository contains the Frontend Single Page Application (SPA).

---

## Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| **Framework** | React 18+ | Strict Mode enabled |
| **Build Tool** | Vite | Fast HMR and optimized builds |
| **Language** | TypeScript 5+ | Strict typing enforced |
| **Styling** | Tailwind CSS | Utility-first CSS framework |
| **Routing** | React Router | Client-side routing |

---

## Repository Structure

```
website-builder/ (Frontend Root)
├── public/                  # Static public assets
├── src/                     # Application source code
│   ├── assets/              # Images, icons, local fonts
│   ├── components/          # Reusable UI components
│   ├── hooks/               # Custom React hooks
│   ├── layouts/             # Page layouts (e.g., Dashboard Layout)
│   ├── pages/               # Route components (Dashboard, Editor, Login)
│   ├── services/            # API client calls (Axios/Fetch wrappers)
│   ├── store/               # Global state management
│   ├── types/               # TypeScript interfaces and types
│   ├── utils/               # Helper functions
│   ├── App.tsx              # Root component
│   └── main.tsx             # Application entry point
├── .env.example             # Environment variable template
├── package.json             # Frontend dependencies
├── tailwind.config.ts       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
└── vite.config.ts           # Vite configuration
```

---

## Architecture Patterns

### Component Architecture
1.  **Small & Reusable:** Break complex UIs down into small, reusable React components.
2.  **Tailwind CSS:** Use Tailwind for all styling. Avoid creating custom CSS files unless absolutely necessary for complex animations or overrides.
3.  **Strict Typing:** Ensure all props and state variables have explicit TypeScript interfaces. Avoid using `any`.

### API Integration
*   The frontend communicates with a separate Node.js API backend.
*   The API base URL is configured via the `VITE_API_BASE_URL` environment variable.
*   Authentication tokens (JWT) are handled via `httpOnly` cookies managed by the backend, meaning the frontend does not manually attach Bearer tokens to requests.

### Environment Variables
Environment variables must be prefixed with `VITE_` to be exposed to the React application.
```env
VITE_API_BASE_URL=/api/v1
VITE_SITE_HOST=https://buildora.lmsathena.com
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

---

## Common Gotchas

1.  **Cookie-based Auth:** Because auth is cookie-based, ensure that your Axios/Fetch clients are configured to send credentials (`withCredentials: true` or `credentials: 'include'`).
2.  **Tailwind Classes:** When dynamically constructing Tailwind classes, ensure the full class string is present in the code so the PurgeCSS engine doesn't strip it out during build.
3.  **Vite Asset Imports:** Import images and SVGs using ESM imports (`import logo from './assets/logo.svg'`) rather than referencing relative public paths, to ensure Vite bundles them correctly.

---

## Quick Start

```bash
npm install        # Install dependencies
npm run dev        # Start local development server
npm run build      # Build for production
```
