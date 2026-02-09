---
library: supabase
url: https://supabase.com/docs/guides/database/postgres-js
title: Postgres.js | Supabase Docs
scraped: 2025-10-23T16:59:02.333Z
---

Database

# Postgres.js

* * *

### Connecting with Postgres.js [\#](https://supabase.com/docs/guides/database/postgres-js\#connecting-with-postgresjs)

[Postgres.js](https://github.com/porsager/postgres) is a full-featured Postgres client for Node.js and Deno.

1

### Install

Install Postgres.js and related dependencies.

```flex

```

2

### Connect

Create a `db.js` file with the connection details.

To get your connection details, go to the [**Connect** panel](https://supabase.com/dashboard/project/_?showConnect=true). Choose **Transaction pooler** if you're on a platform with transient connections, such as a serverless function, and **Session pooler** if you have a long-lived connection. Copy the URI and save it as the environment variable `DATABASE_URL`.

```flex

```

3

### Execute commands

Use the connection to execute commands.

```flex

```
