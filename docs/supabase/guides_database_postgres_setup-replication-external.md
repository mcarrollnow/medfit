---
library: supabase
url: https://supabase.com/docs/guides/database/postgres/setup-replication-external
title: Replicate to another Postgres database using Logical Replication | Supabase Docs
scraped: 2025-10-23T16:59:02.346Z
---

Database

# Replicate to another Postgres database using Logical Replication

* * *

For this example, you will need:

- A Supabase project
- A Postgres database (running v10 or newer)

You will be running commands on both of these databases to publish changes from the Supabase database to the external database.

1. Create a `publication` on the **Supabase database**:

```flex

```

2. Also on the **Supabase database**, create a `replication slot`:

```flex

```

3. Now we will connect to our **external database** and subscribe to our `publication` Note: ):

This will need a **direct** connection (not a Connection Pooler) to your database and you can find the connection info in the [**Connect** panel](https://supabase.com/dashboard/project/_?showConnect=true) in the `Direct connection` section.

You will also need to ensure that IPv6 is supported by your replication destination (or you can enable the [IPv4 add-on](https://supabase.com/docs/guides/platform/ipv4-address))

If you would prefer not to use the `postgres` user, then you can run `CREATE ROLE <user> WITH REPLICATION;` using the `postgres` user.

```flex

```

`create_slot` is set to `false` because `slot_name` is provided and the slot was already created in Step 2.
To copy data from before the slot was created, set `copy_data` to `true`.

4. Now we'll go back to the Supabase DB and add all the tables that you want replicated to the publication.

```flex

```

5. Check the replication status using `pg_stat_replication`

```flex

```

You can add more tables to the initial publication, but you're going to need to do a REFRESH on the subscribing database.
See [https://www.postgresql.org/docs/current/sql-alterpublication.html](https://www.postgresql.org/docs/current/sql-alterpublication.html)

### Is this helpful?

NoYes
