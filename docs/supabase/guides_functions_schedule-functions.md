---
library: supabase
url: https://supabase.com/docs/guides/functions/schedule-functions
title: Scheduling Edge Functions | Supabase Docs
scraped: 2025-10-23T16:59:02.332Z
---

Edge Functions

# Scheduling Edge Functions

* * *

Scheduling Edge Functions - YouTube

[Photo image of Supabase](https://www.youtube.com/channel/UCNTVzV1InxHV-YR0fSajqPQ?embeds_referring_euri=https%3A%2F%2Fsupabase.com%2F)

Supabase

66.9K subscribers

[Scheduling Edge Functions](https://www.youtube.com/watch?v=-U6DJcjVvGo)

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

The hosted Supabase Platform supports the [`pg_cron` extension](https://supabase.com/docs/guides/database/extensions/pgcron), a recurring job scheduler in Postgres.

In combination with the [`pg_net` extension](https://supabase.com/docs/guides/database/extensions/pgnet), this allows us to invoke Edge Functions periodically on a set schedule.

To access the auth token securely for your Edge Function call, we recommend storing them in [Supabase Vault](https://supabase.com/docs/guides/database/vault).

## Examples [\#](https://supabase.com/docs/guides/functions/schedule-functions\#examples)

### Invoke an Edge Function every minute [\#](https://supabase.com/docs/guides/functions/schedule-functions\#invoke-an-edge-function-every-minute)

Store `project_url` and `anon_key` in Supabase Vault:

```flex

```

Make a POST request to a Supabase Edge Function every minute:

```flex

```

## Resources [\#](https://supabase.com/docs/guides/functions/schedule-functions\#resources)

- [`pg_net` extension](https://supabase.com/docs/guides/database/extensions/pgnet)
- [`pg_cron` extension](https://supabase.com/docs/guides/database/extensions/pgcron)

### Is this helpful?

NoYes

### On this page

[Examples](https://supabase.com/docs/guides/functions/schedule-functions#examples) [Invoke an Edge Function every minute](https://supabase.com/docs/guides/functions/schedule-functions#invoke-an-edge-function-every-minute) [Resources](https://supabase.com/docs/guides/functions/schedule-functions#resources)
