---
library: supabase
url: https://supabase.com/docs/guides/queues/consuming-messages-with-edge-functions
title: Consuming Supabase Queue Messages with Edge Functions | Supabase Docs
scraped: 2025-10-23T16:59:02.333Z
---

Queues

# Consuming Supabase Queue Messages with Edge Functions

## Learn how to consume Supabase Queue messages server-side with a Supabase Edge Function

* * *

This guide helps you read & process queue messages server-side with a Supabase Edge Function. Read [Queues API Reference](https://supabase.com/docs/guides/queues/api) for more details on our API.

## Concepts [\#](https://supabase.com/docs/guides/queues/consuming-messages-with-edge-functions\#concepts)

Supabase Queues is a pull-based Message Queue consisting of three main components: Queues, Messages, and Queue Types. You should already be familiar with the [Queues Quickstart](https://supabase.com/docs/guides/queues/quickstart).

### Consuming messages in an Edge Function [\#](https://supabase.com/docs/guides/queues/consuming-messages-with-edge-functions\#consuming-messages-in-an-edge-function)

This is a Supabase Edge Function that reads 5 messages off the queue, processes each of them, and deletes each message when it is done.

```flex

```

Every time this Edge Function is run it:

1. Read 5 messages off the queue
2. Call the `processMessage` function
3. At the end of `processMessage`, the message is deleted from the queue
4. If `processMessage` throws an error, the error is logged. In this case, the message is still in the queue, so the next time this Edge Function runs it reads the message again.

You might find this kind of setup handy to run with [Supabase Cron](https://supabase.com/docs/guides/cron). You can set up Cron so that every N number of minutes or seconds, the Edge Function will run and process a number of messages off the queue.

Similarly, you can invoke the Edge Function on command at any given time with [`supabase.functions.invoke`](https://supabase.com/docs/guides/functions/quickstart-dashboard#usage).

### Is this helpful?

NoYes

### On this page

[Concepts](https://supabase.com/docs/guides/queues/consuming-messages-with-edge-functions#concepts) [Consuming messages in an Edge Function](https://supabase.com/docs/guides/queues/consuming-messages-with-edge-functions#consuming-messages-in-an-edge-function)
