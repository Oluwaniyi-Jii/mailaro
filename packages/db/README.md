# Database
This folder contains the PostgreSQL database schema, migrations, and the ORM client (Prisma or Drizzle) to be shared across the web app and worker.

## Supabase setup

1. Create a Supabase project.
2. In Supabase, open **Connect** and copy the **transaction pooler** URI into `DATABASE_URL`.
3. Copy the direct database URI into `DIRECT_URL`.
4. Replace the password placeholders and URL-encode special characters in the password.
5. From the repository root, run:

```powershell
npm run db:generate
npm run db:push
```

`DATABASE_URL` is used by the running application. `DIRECT_URL` is used by Prisma for schema changes because the pooler is not the right connection for every administrative operation.
