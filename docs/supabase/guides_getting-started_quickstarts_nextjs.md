---
library: supabase
url: https://supabase.com/docs/guides/getting-started/quickstarts/nextjs
title: Use Supabase with Next.js | Supabase Docs
scraped: 2025-10-23T16:59:02.330Z
---

Getting Started

# Use Supabase with Next.js

## Learn how to create a Supabase project, add some sample data, and query from a Next.js app.

* * *

1

### Create a Supabase project

Go to [database.new](https://database.new/) and create a new Supabase project.

Alternatively, you can create a project using the Management API:

```flex

```

When your project is up and running, go to the [Table Editor](https://supabase.com/dashboard/project/_/editor), create a new table and insert some data.

Alternatively, you can run the following snippet in your project's [SQL Editor](https://supabase.com/dashboard/project/_/sql/new). This will create a `instruments` table with some sample data.

```flex

```

Make the data in your table publicly readable by adding an RLS policy:

```flex

```

2

### Create a Next.js app

Use the `create-next-app` command and the `with-supabase` template, to create a Next.js app pre-configured with:

- [Cookie-based Auth](https://supabase.com/docs/guides/auth/server-side/creating-a-client?queryGroups=package-manager&package-manager=npm&queryGroups=framework&framework=nextjs&queryGroups=environment&environment=server)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)

```flex

```

3

### Declare Supabase Environment Variables

Rename `.env.example` to `.env.local` and populate with your Supabase connection variables:

###### Project URL

No project found

To get your Project URL, [log in](https://supabase.com/dashboard).

###### Publishable key

No project found

To get your Publishable key, [log in](https://supabase.com/dashboard).

###### Anon key

No project found

To get your Anon key, [log in](https://supabase.com/dashboard).

.env.local

```flex

```

4

### Create Supabase client

Create a new file at `utils/supabase/server.ts` and populate with the following.

This creates a Supabase client, using the credentials from the `env.local` file.

utils/supabase/server.ts

```flex

```

5

### Query Supabase data from Next.js

Create a new file at `app/instruments/page.tsx` and populate with the following.

This selects all the rows from the `instruments` table in Supabase and render them on the page.

app/instruments/page.tsx

```flex

```

6

### Start the app

Run the development server, go to [http://localhost:3000/instruments](http://localhost:3000/instruments) in a browser and you should see the list of instruments.

```flex

```

## Next steps [\#](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs\#next-steps)

- Set up [Auth](https://supabase.com/docs/guides/auth) for your app
- [Insert more data](https://supabase.com/docs/guides/database/import-data) into your database
- Upload and serve static files using [Storage](https://supabase.com/docs/guides/storage)
