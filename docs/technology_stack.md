# Technology Stack

This document records the technology stack choices for the first release of Mailaro.

## Core Choices
- **Web App / API**: Next.js (App Router) with React, TypeScript, and TailwindCSS. Hosted on Vercel.
- **Database**: PostgreSQL. Hosted on Supabase.
- **ORM**: Prisma or Drizzle ORM for type-safe database access.
- **Chrome Extension**: Standard Manifest V3 using TypeScript and bundled with Vite.
- **Background Worker**: Redis + BullMQ (hosted on Upstash or equivalent) for decoupling notification sending from tracking events.
- **Authentication**: NextAuth.js (Auth.js) using the Google Provider.

## Constraints
- Do not add a service unless the first release explicitly needs it.
- Keep the frontend and API in a single repository for the MVP.
- All choices are optimized for speed, reliability, and free online hosting where possible.
