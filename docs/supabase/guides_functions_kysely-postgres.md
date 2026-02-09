---
library: supabase
url: https://supabase.com/docs/guides/functions/kysely-postgres
title: Type-Safe SQL with Kysely | Supabase Docs
scraped: 2025-10-23T16:59:02.336Z
---

Edge Functions

# Type-Safe SQL with Kysely

* * *

Type-Safe SQL on the Edge with Kysely - YouTube

[Photo image of Supabase](https://www.youtube.com/channel/UCNTVzV1InxHV-YR0fSajqPQ?embeds_referring_euri=https%3A%2F%2Fsupabase.com%2F)

Supabase

66.9K subscribers

[Type-Safe SQL on the Edge with Kysely](https://www.youtube.com/watch?v=zd9a_Lk3jAc)

Supabase

Search

Info

Shopping

Tap to unmute

If playback doesn't begin shortly, try restarting your device.

You're signed out

Videos you watch may be added to the TV's watch history and influence TV recommendations. To avoid this, cancel and sign in to YouTube on your computer.

CancelConfirm

Share

Include playlist

An error occurred while retrieving sharing information. Please try again later.

Watch later

Share

Copy link

Watch on

0:00

/
•Live

•

Supabase Edge Functions can [connect directly to your Postgres database](https://supabase.com/docs/guides/functions/connect-to-postgres) to execute SQL queries. [Kysely](https://github.com/kysely-org/kysely#kysely) is a type-safe and autocompletion-friendly typescript SQL query builder.

Combining Kysely with Deno Postgres gives you a convenient developer experience for interacting directly with your Postgres database.

## Code [\#](https://supabase.com/docs/guides/functions/kysely-postgres\#code)

Find the example on [GitHub](https://github.com/supabase/supabase/tree/master/examples/edge-functions/supabase/functions/kysely-postgres)

Get your database connection credentials from the project's [**Connect** panel](https://supabase.com/dashboard/project/_/?showConnect=true) and store them in an `.env` file:

```flex

```

Create a `DenoPostgresDriver.ts` file to manage the connection to Postgres via [deno-postgres](https://deno-postgres.com/):

```flex

```

Create an `index.ts` file to execute a query on incoming requests:

```flex

```

### Is this helpful?

NoYes

### On this page

[Code](https://supabase.com/docs/guides/functions/kysely-postgres#code)
