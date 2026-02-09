---
library: supabase
url: https://supabase.com/docs/guides/telemetry/sentry-monitoring
title: Sentry integration | Supabase Docs
scraped: 2025-10-23T16:59:02.320Z
---

Telemetry

# Sentry integration

## Integrate Sentry to monitor errors from a Supabase client

* * *

You can use [Sentry](https://sentry.io/welcome/) to monitor errors thrown from a Supabase JavaScript client. Install the [Supabase Sentry integration](https://github.com/supabase-community/sentry-integration-js) to get started.

The Sentry integration supports browser, Node, and edge environments.

## Installation [\#](https://supabase.com/docs/guides/telemetry/sentry-monitoring\#installation)

Install the Sentry integration using your package manager:

npmyarnpnpm

```flex

```

## Use [\#](https://supabase.com/docs/guides/telemetry/sentry-monitoring\#use)

If you are using Sentry JavaScript SDK v7, reference [`supabase-community/sentry-integration-js` repository](https://github.com/supabase-community/sentry-integration-js/blob/master/README-7v.md) instead.

To use the Supabase Sentry integration, add it to your `integrations` list when initializing your Sentry client.

You can supply either the Supabase Client constructor or an already-initiated instance of a Supabase Client.

With constructorWith instance

```flex

```

All available configuration options are available in our [`supabase-community/sentry-integration-js` repository](https://github.com/supabase-community/sentry-integration-js/blob/master/README.md#options).

## Deduplicating spans [\#](https://supabase.com/docs/guides/telemetry/sentry-monitoring\#deduplicating-spans)

If you're already monitoring HTTP errors in Sentry, for example with the HTTP, Fetch, or Undici integrations, you will get duplicate spans for Supabase calls. You can deduplicate the spans by skipping them in your other integration:

```flex

```

## Example Next.js configuration [\#](https://supabase.com/docs/guides/telemetry/sentry-monitoring\#example-nextjs-configuration)

See this example for a setup with Next.js to cover browser, server, and edge environments. First, run through the [Sentry Next.js wizard](https://docs.sentry.io/platforms/javascript/guides/nextjs/#install) to generate the base Next.js configuration. Then add the Supabase Sentry Integration to all your `Sentry.init` calls with the appropriate filters.

BrowserServerMiddleware & EdgeInstrumentation

```flex

```

Afterwards, build your application ( `npm run build`) and start it locally ( `npm run start`). You will now see the transactions being logged in the terminal when making supabase-js requests.

### Is this helpful?

NoYes

### On this page

[Installation](https://supabase.com/docs/guides/telemetry/sentry-monitoring#installation) [Use](https://supabase.com/docs/guides/telemetry/sentry-monitoring#use) [Deduplicating spans](https://supabase.com/docs/guides/telemetry/sentry-monitoring#deduplicating-spans) [Example Next.js configuration](https://supabase.com/docs/guides/telemetry/sentry-monitoring#example-nextjs-configuration)
