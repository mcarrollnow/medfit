---
library: supabase
url: https://supabase.com/docs/guides/getting-started/quickstarts/nuxtjs
title: Use Supabase with Nuxt | Supabase Docs
scraped: 2025-10-23T16:59:02.342Z
---

Getting Started

# Use Supabase with Nuxt

## Learn how to create a Supabase project, add some sample data to your database, and query the data from a Nuxt app.

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

### Create a Nuxt app

Create a Nuxt app using the `npx nuxi` command.

###### Terminal

```flex

```

3

### Install the Supabase client library

The fastest way to get started is to use the `supabase-js` client library which provides a convenient interface for working with Supabase from a Nuxt app.

Navigate to the Nuxt app and install `supabase-js`.

###### Terminal

```flex

```

4

### Declare Supabase Environment Variables

Create a `.env` file and populate with your Supabase connection variables:

###### Project URL

No project found

To get your Project URL, [log in](https://supabase.com/dashboard).

###### Publishable key

No project found

To get your Publishable key, [log in](https://supabase.com/dashboard).

###### Anon key

No project found

To get your Anon key, [log in](https://supabase.com/dashboard).

.env.localnuxt.config.tsx

```flex

```

5

### Query data from the app

In `app.vue`, create a Supabase client using your config values and replace the existing content with the following code.

###### app.vue

```flex

```

6

### Start the app

Start the app, navigate to [http://localhost:3000](http://localhost:3000/) in the browser, open the browser console, and you should see the list of instruments.

###### Terminal

```flex

```

The community-maintained [@nuxtjs/supabase](https://supabase.nuxtjs.org/) module provides an alternate DX for working with Supabase in Nuxt.
