# Barangay Management & Public Safety System

A digital barangay services and public safety portal built with **Next.js 14** (App Router), **Tailwind CSS**, and a **multi-tenant MongoDB backend**.

**Live site:** [https://raybagsik0825.github.io/barangay-e-service/](https://raybagsik0825.github.io/barangay-e-service/)

## Features

- Community announcements
- Lupon Tagapamayapa hearing schedule tracker
- Public safety / crime registry
- Lost & Found section with All / Lost / Found tabs
- PNP certificate-to-file-action document portal
- Responsive design with mobile drawer navigation
- Animated stats, scroll-reveal, and smooth scrolling

## Multi-Tenant MongoDB Backend

**19 barangays**, each with its **own database** and full backend API for every module
(announcements, cases, hearings, crime, wanted persons, lost & found, residents),
including cloud-stored documents (CFA, subpoenas, etc.) via MongoDB GridFS.

| Barangay | Database |
| --- | --- |
| Binuangan | `brgy_binuangan` |
| NBBS Kaunlaran | `brgy_nbbs_kaunlaran` |
| NBBS Dagat-dagatan | `brgy_nbbs_dagat` |
| NBBS Proper | `brgy_nbbs_proper` |
| San Jose | `brgy_san_jose` |
| San Roque | `brgy_san_roque` |
| Sipac-Almacen | `brgy_sipac_almacen` |
| Tangos North | `brgy_tangos_north` |
| Tangos South | `brgy_tangos_south` |
| Tanza 1 | `brgy_tanza_1` |
| Tanza 2 | `brgy_tanza_2` |
| Navotas South District | `brgy_navotas_south` |
| Bagumbayan North | `brgy_bagumbayan_north` |
| Daanghari | `brgy_daanghari` |
| Navotas West | `brgy_navotas_west` |
| Navotas East | `brgy_navotas_east` |
| Hulong Duhat | `brgy_hulong_duhat` |
| Dampalit | `brgy_dampalit` |
| Salambao | `brgy_salambao` |

**API:** `GET/POST /api/:barangay/cases`, `/hearings`, `/crime-reports`,
`/wanted-persons`, `/lost-found`, `/announcements`, `/residents`, and `/documents`
(+ multipart upload to cloud). Auth via JWT + bcrypt.

**Docs:**
- MongoDB schema & setup: [`docs/MONGODB-SCHEMA.md`](docs/MONGODB-SCHEMA.md)
- Seed script (creates all 19 DBs): [`database/seed.js`](database/seed.js)
- Legacy MySQL plan: [`docs/DATABASE-PLAN.md`](docs/DATABASE-PLAN.md) / [`database/schema.sql`](database/schema.sql)

## Getting Started

```bash
npm install

# 1. Create .env.local from .env.example
#    MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net
#    JWT_SECRET=<long random string>

# 2. Seed the 19 barangay databases + default admin
npm run seed

# 3. Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).
Default admin login: `admin` / `Admin123!@#` (change immediately).

## Deploying on Vercel with MongoDB Atlas

1. Create a free cluster on **cloud.mongodb.com** → copy the **Drivers** connection string.
2. On **Vercel** → New Project → import this repo.
3. Add env vars:

   | Variable | Value |
   | --- | --- |
   | `MONGODB_URI` | your `mongodb+srv://...` string |
   | `MONGODB_DB_ADMIN` | `barangay_auth` |
   | `JWT_SECRET` | long random string |
   | `ENABLE_BOOTSTRAP` | `true` (first deploy only) |

4. Deploy. Then create the initial admin:

   ```bash
   curl -X POST https://<your-app>.vercel.app/api/auth/bootstrap \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"YourStrongPassword","fullName":"System Administrator"}'
   ```

5. Remove `ENABLE_BOOTSTRAP` from Vercel env, then deploy again.
6. Login is now active at `/api/auth/login`. (Alternatively run `npm run seed`
   locally if you have Node.js.)

## Bulk account provisioning (superadmin + 19 barangay staff)

1. Add env var `SEED_SECRET` = a long random string, then redeploy.
2. Run once:

   ```bash
   curl -X POST https://<your-app>.vercel.app/api/auth/seed-accounts \
     -H "Content-Type: application/json" \
     -H "x-seed-secret: <SEED_SECRET>" \
     -d '{"password":"badboy666"}'
   ```

   Creates `superadmin` (all barangays) + one `staff` user per barangay slug
   (e.g. `san-roque`), each scoped to its own database.
3. Remove `SEED_SECRET` from Vercel env, then redeploy.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run seed` | Create 19 barangay DBs + admin user |

## Structure

```
src/
  app/
    api/              # Backend (next.config + API routes)
      auth/           # login / register
      barangays/      # list 19 barangays
      [barangay]/     # per-barangay CRUD for every module + document upload
    globals.css
    layout.tsx
    page.tsx
  components/         # Section components
  lib/
    mongodb.ts        # multi-tenant connection (admin + per-barangay dbs)
    auth.ts           # JWT + bcrypt helpers
    api-handler.ts    # CRUD factory used by all resource routes
    barangays.ts      # 19 barangay config
    site.ts
    hooks.ts

database/
  schema.sql          # Legacy MySQL schema
  seed.js             # Seeds 19 MongoDB databases

docs/
  MONGODB-SCHEMA.md   # Multi-tenant MongoDB plan
  DATABASE-PLAN.md    # Legacy SQL plan
```

## Deployment

The app is **full-stack** (Next.js frontend + MongoDB API routes), so it runs on a
Node.js host — **Vercel** is recommended (free tier):

1. Push the repo to GitHub
2. On Vercel: **New Project** → import `barangay-e-service`
3. Add env vars: `MONGODB_URI` (Atlas) and `JWT_SECRET`
4. Deploy — frontend + API are served from one deployment

The CI workflow (`.github/workflows/deploy.yml`) runs lint + build on every push to
`main`. **Note:** the former GitHub Pages static deploy was retired because static
export cannot run the API routes.

**Note:** The interactive forms (hearing lookup, PNP login) call the API routes and
return placeholder data until MongoDB is connected and the backend is deployed.