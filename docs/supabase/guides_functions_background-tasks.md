---
library: supabase
url: https://supabase.com/docs/guides/functions/background-tasks
title: Background Tasks | Supabase Docs
scraped: 2025-10-23T16:59:02.345Z
---

Edge Functions

# Background Tasks

## Run background tasks in an Edge Function outside of the request handler.

* * *

Edge Function instances can process background tasks outside of the request handler. Background tasks are useful for asynchronous operations like uploading a file to Storage, updating a database, or sending events to a logging service. You can respond to the request immediately and leave the task running in the background.

This allows you to:

- Respond quickly to users while processing continues
- Handle async operations without blocking the response

* * *

## Overview [\#](https://supabase.com/docs/guides/functions/background-tasks\#overview)

You can use `EdgeRuntime.waitUntil(promise)` to explicitly mark background tasks. The Function instance continues to run until the promise provided to `waitUntil` completes.

```flex

```

You can call `EdgeRuntime.waitUntil` in the request handler too. This will not block the request.

```flex

```

You can listen to the `beforeunload` event handler to be notified when the Function is about to be shut down.

```flex

```

## Handling errors [\#](https://supabase.com/docs/guides/functions/background-tasks\#handling-errors)

We recommend using `try`/ `catch` blocks within your background task function to handle errors.

You can also add an event listener to [`unhandledrejection`](https://developer.mozilla.org/en-US/docs/Web/API/Window/unhandledrejection_event) to handle any promises without a rejection handler.

```flex

```

The maximum duration is capped based on the wall-clock, CPU, and memory limits. The function will shut down when it reaches one of these [limits](https://supabase.com/docs/guides/functions/limits).

* * *

## Testing background tasks locally [\#](https://supabase.com/docs/guides/functions/background-tasks\#testing-background-tasks-locally)

When testing Edge Functions locally with Supabase CLI, the instances are terminated automatically after a request is completed. This will prevent background tasks from running to completion.

To prevent that, you can update the `supabase/config.toml` with the following settings:

```flex

```

### Is this helpful?

NoYes

### On this page

[Overview](https://supabase.com/docs/guides/functions/background-tasks#overview) [Handling errors](https://supabase.com/docs/guides/functions/background-tasks#handling-errors) [Testing background tasks locally](https://supabase.com/docs/guides/functions/background-tasks#testing-background-tasks-locally)
