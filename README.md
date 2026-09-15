# Barangay Management & Public Safety System

A digital barangay services and public safety portal built with **Next.js 14** (App Router) and **Tailwind CSS**.

## Features

- Community announcements
- Lupon Tagapamayapa hearing schedule tracker
- Public safety / crime registry
- Lost & Found section with All / Lost / Found tabs
- PNP certificate-to-file-action document portal
- Responsive design with mobile drawer navigation
- Animated stats, scroll-reveal, and smooth scrolling

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command      | Description           |
| ------------ | --------------------- |
| `npm run dev`   | Start dev server      |
| `npm run build` | Production build      |
| `npm start`     | Start production server |
| `npm run lint`  | Run ESLint            |

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
```

**Note:** Node.js is required to run this project. The interactive forms (hearing lookup, PNP login) currently use placeholder handlers and should be connected to a backend/API for production use.
