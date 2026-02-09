---
library: supabase
url: https://supabase.com/docs/guides/database/postgres/which-version-of-postgres
title: Print PostgreSQL version | Supabase Docs
scraped: 2025-10-23T16:59:02.342Z
---

Database

# Print PostgreSQL version

* * *

It's important to know which version of Postgres you are running as each major version has different features and may cause breaking changes. You may also need to update your schema when [upgrading](https://www.postgresql.org/docs/current/pgupgrade.html) or downgrading to a major Postgres version.

Run the following query using the [SQL Editor](https://supabase.com/dashboard/project/_/sql) in the Supabase Dashboard:

```flex

```

Which should return something like:

```flex

```

This query can also be executed via `psql` or any other query editor if you prefer to [connect directly to the database](https://supabase.com/docs/guides/database/connecting-to-postgres#direct-connections).

### Is this helpful?

NoYes
