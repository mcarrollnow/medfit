---
library: supabase
url: https://supabase.com/docs/guides/database/replication/setting-up-replication
title: Setting up replication and CDC with Supabase | Supabase Docs
scraped: 2025-10-23T16:59:02.323Z
---

Database

# Setting up replication and CDC with Supabase

* * *

## Prerequisites [\#](https://supabase.com/docs/guides/database/replication/setting-up-replication\#prerequisites)

To set up replication, the following is recommended:

- Instance size of XL or greater
- [IPv4 add-on](https://supabase.com/docs/guides/platform/ipv4-address) enabled

To create a replication slot, you will need to use the `postgres` user and follow the instructions in our [guide](https://supabase.com/docs/guides/database/postgres/setup-replication-external).

If you are running Postgres 17 or higher, you can create a new user and grant them replication permissions with the `postgres` user. For versions below 17, you will need to use the `postgres` user.

If you are replicating to an external system and using any of the tools below, check their documentation first and we have added additional information where the setup with Supabase can vary.

AirbyteEstuaryFivetranMaterializeStitch

Estuary has the following [documentation](https://docs.estuary.dev/reference/Connectors/capture-connectors/PostgreSQL/Supabase/) for setting up Postgres as a source.

### Is this helpful?

NoYes

### On this page

[Prerequisites](https://supabase.com/docs/guides/database/replication/setting-up-replication#prerequisites)
