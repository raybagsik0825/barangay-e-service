# Barangay Management & Public Safety System

A digital barangay services and public safety portal built with **Next.js 14** (App Router) and **Tailwind CSS**.

**Live site:** [https://raybagsik0825.github.io/barangay-e-service/](https://raybagsik0825.github.io/barangay-e-service/)

## Features

- Community announcements
- Lupon Tagapamayapa hearing schedule tracker
- Public safety / crime registry
- Lost & Found section with All / Lost / Found tabs
- PNP certificate-to-file-action document portal
- Responsive design with mobile drawer navigation
- Animated stats, scroll-reveal, and smooth scrolling

## Database

A full MySQL 8 backend schema covering all modules:

| Module | Tables | Purpose |
| --- | --- | --- |
| Users & Audit | `users`, `permissions`, `activity_logs` | Admin accounts, RBAC, audit trail |
| Residents | `residents`, `barangay_officials` | Master person records |
| Announcements | `announcements` | Post/pin/schedule announcements |
| Cases & Lupon | `cases`, `case_parties`, `lupon_panels`, `lupon_members`, `hearings`, `hearing_panel` | Complaints, hearings, outcomes |
| Crime & Wanted | `crime_reports`, `wanted_persons`, `case_suspects` | Registry, wanted posters, suspects |
| Lost & Found | `lost_found_items` | Report → claim → return |
| Documents & PNP | `documents`, `document_requests`, `document_request_items` | Central file registry, request queue |
| Settings | `settings` | Key-value site config |

- Full plan: [`docs/DATABASE-PLAN.md`](docs/DATABASE-PLAN.md)
- SQL schema: [`database/schema.sql`](database/schema.sql)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

## Structure

```
src/
  app/
    globals.css     # Tailwind + component classes
    layout.tsx      # Root layout (navbar, footer, fonts)
    page.tsx        # Landing page
  components/       # Section components
  lib/
    site.ts         # Content + site config
    hooks.ts        # useInView, useCountUp

database/
  schema.sql        # MySQL 8 schema (17 tables)

docs/
  DATABASE-PLAN.md  # Full ERD + admin panel mapping
```

## Deployment

The site is auto-deployed to **GitHub Pages** on every push to `main` via the GitHub Actions workflow at `.github/workflows/deploy.yml`.

**Note:** Node.js is required to run this project. The interactive forms (hearing lookup, PNP login) currently use placeholder handlers and should be connected to the database backend for production use.
