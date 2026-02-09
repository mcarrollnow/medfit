---
library: supabase
url: https://supabase.com/docs/guides/getting-started/quickstarts/hono
title: Use Supabase with Hono | Supabase Docs
scraped: 2025-10-23T16:59:02.340Z
---

Getting Started

# Use Supabase with Hono

## Learn how to create a Supabase project, add some sample data to your database, secure it with auth, and query the data from a Hono app.

* * *

1

### Create a Hono app

Bootstrap the Hono example app from the Supabase Samples using the CLI.

###### Terminal

```flex

```

2

### Install the Supabase client library

The `package.json` file in the project includes the necessary dependencies, including `@supabase/supabase-js` and `@supabase/ssr` to help with server-side auth.

###### Terminal

```flex

```

3

### Set up the required environment variables

Copy the `.env.example` file to `.env` and update the values with your Supabase project URL and anon key.

Lastly, [enable anonymous sign-ins](https://supabase.com/dashboard/project/_/auth/providers) in the Auth settings.

###### Project URL

No project found

To get your Project URL, [log in](https://supabase.com/dashboard).

###### Publishable key

No project found

To get your Publishable key, [log in](https://supabase.com/dashboard).

###### Anon key

No project found

To get your Anon key, [log in](https://supabase.com/dashboard).

###### Terminal

```flex

```

4

### Start the app

Start the app, go to [http://localhost:5173](http://localhost:5173/).

Learn how [server side auth](https://supabase.com/docs/guides/auth/server-side/creating-a-client?queryGroups=framework&framework=hono) works with Hono.

###### Terminal

```flex

```

## Next steps [\#](https://supabase.com/docs/guides/getting-started/quickstarts/hono\#next-steps)

- Learn how [server side auth](https://supabase.com/docs/guides/auth/server-side/creating-a-client?queryGroups=framework&framework=hono) works with Hono.
- [Insert more data](https://supabase.com/docs/guides/database/import-data) into your database
- Upload and serve static files using [Storage](https://supabase.com/docs/guides/storage)
