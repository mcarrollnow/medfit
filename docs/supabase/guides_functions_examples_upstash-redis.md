---
library: supabase
url: https://supabase.com/docs/guides/functions/examples/upstash-redis
title: Upstash Redis | Supabase Docs
scraped: 2025-10-23T16:59:02.335Z
---

Edge Functions

# Upstash Redis

* * *

Increment Redis Counter in Edge Functions - YouTube

[Photo image of Supabase](https://www.youtube.com/channel/UCNTVzV1InxHV-YR0fSajqPQ?embeds_referring_euri=https%3A%2F%2Fsupabase.com%2F)

Supabase

66.9K subscribers

[Increment Redis Counter in Edge Functions](https://www.youtube.com/watch?v=OPg3_oPZCh0)

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

A Redis counter example that stores a [hash](https://redis.io/commands/hincrby/) of function invocation count per region. Find the code on [GitHub](https://github.com/supabase/supabase/tree/master/examples/edge-functions/supabase/functions/upstash-redis-counter).

## Redis database setup [\#](https://supabase.com/docs/guides/functions/examples/upstash-redis\#redis-database-setup)

Create a Redis database using the [Upstash Console](https://console.upstash.com/) or [Upstash CLI](https://github.com/upstash/cli).

Select the `Global` type to minimize the latency from all edge locations. Copy the `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` to your .env file.

You'll find them under **Details > REST API > .env**.

```flex

```

## Code [\#](https://supabase.com/docs/guides/functions/examples/upstash-redis\#code)

Make sure you have the latest version of the [Supabase CLI installed](https://supabase.com/docs/guides/cli#installation).

Create a new function in your project:

```flex

```

And add the code to the `index.ts` file:

```flex

```

## Run locally [\#](https://supabase.com/docs/guides/functions/examples/upstash-redis\#run-locally)

```flex

```

Navigate to [http://localhost:54321/functions/v1/upstash-redis-counter](http://localhost:54321/functions/v1/upstash-redis-counter).

## Deploy [\#](https://supabase.com/docs/guides/functions/examples/upstash-redis\#deploy)

```flex

```

### Is this helpful?

NoYes

### On this page

[Redis database setup](https://supabase.com/docs/guides/functions/examples/upstash-redis#redis-database-setup) [Code](https://supabase.com/docs/guides/functions/examples/upstash-redis#code) [Run locally](https://supabase.com/docs/guides/functions/examples/upstash-redis#run-locally) [Deploy](https://supabase.com/docs/guides/functions/examples/upstash-redis#deploy)
