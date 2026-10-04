# FCMP — Forensic Case Management Platform

A polished standalone React/Vite prototype for forensic case, evidence, examination, reporting and chain-of-custody workflows.

## What is included

- Role-aware sign-in experience with demo users
- Dashboard and operational KPIs
- Case registration and case detail views
- Evidence inventory and QR presentation
- Chain-of-custody tracking with hash records
- Examination and assignment workflows
- Documents and reports
- Notifications and audit log views
- User and role administration screens
- Analytics and system settings
- Responsive mobile navigation
- Browser persistence for demo changes via `localStorage`
- Error boundary with recovery action
- Demo-data restore action in Settings

## Run locally

Requirements: Node.js 20+ and npm.

```bash
npm install
npm run dev
```

For a production bundle:

```bash
npm run build
npm run preview
```

## Demo accounts

| Role | Email | Password |
| --- | --- | --- |
| Administrator | `admin@fcm.local` | `admin` |
| Investigator | `investigator@fcm.local` | `investigator` |
| Forensic Expert | `expert@fcm.local` | `expert` |
| Supervisor | `supervisor@fcm.local` | `supervisor` |

## Important deployment note

This repository is a **frontend/demo implementation**, not a production forensic evidence system. Authentication, authorization, audit logging, hashing, file storage and chain-of-custody records are currently browser-side/demo concerns. Before real operational use, connect the UI to a secured backend with server-side authorization, durable database storage, immutable audit infrastructure, encrypted object storage, key management, MFA/SSO, monitoring, backups and an appropriate compliance/security review.

## Project structure

- `src/pages` — application screens
- `src/components` — reusable UI and layout components
- `src/context` — authentication and application state
- `src/data/demo.ts` — seeded demo dataset
- `src/types` — domain models
- `src/utils` — supporting utilities
