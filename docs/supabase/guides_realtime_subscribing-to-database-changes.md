---
library: supabase
url: https://supabase.com/docs/guides/realtime/subscribing-to-database-changes
title: Subscribing to Database Changes | Supabase Docs
scraped: 2025-10-23T16:59:02.332Z
---

Realtime

# Subscribing to Database Changes

## Listen to database changes in real-time from your website or application.

* * *

You can use Supabase to subscribe to real-time database changes. There are two options available:

1. [Broadcast](https://supabase.com/docs/guides/realtime/broadcast). This is the recommended method for scalability and security.
2. [Postgres Changes](https://supabase.com/docs/guides/realtime/postgres-changes). This is a simpler method. It requires less setup, but does not scale as well as Broadcast.

## Using Broadcast [\#](https://supabase.com/docs/guides/realtime/subscribing-to-database-changes\#using-broadcast)

To automatically send messages when a record is created, updated, or deleted, we can attach a [Postgres trigger](https://supabase.com/docs/guides/database/postgres/triggers) to any table. Supabase Realtime provides a `realtime.broadcast_changes()` function which we can use in conjunction with a trigger. This function will use a private channel and needs broadcast authorization RLS policies to be met.

### Broadcast authorization [\#](https://supabase.com/docs/guides/realtime/subscribing-to-database-changes\#broadcast-authorization)

[Realtime Authorization](https://supabase.com/docs/guides/realtime/authorization) is required for receiving Broadcast messages. This is an example of a policy that allows authenticated users to listen to messages from topics:

```flex

```

### Create a trigger function [\#](https://supabase.com/docs/guides/realtime/subscribing-to-database-changes\#create-a-trigger-function)

Let's create a function that we can call any time a record is created, updated, or deleted. This function will make use of some of Postgres's native [trigger variables](https://www.postgresql.org/docs/current/plpgsql-trigger.html#PLPGSQL-DML-TRIGGER). For this example, we want to have a topic with the name `topic:<record id>` to which we're going to broadcast events.

```flex

```

### Create a trigger [\#](https://supabase.com/docs/guides/realtime/subscribing-to-database-changes\#create-a-trigger)

Let's set up a trigger so the function is executed after any changes to the table.

```flex

```

#### Listening on client side [\#](https://supabase.com/docs/guides/realtime/subscribing-to-database-changes\#listening-on-client-side)

Finally, on the client side, listen to the topic `topic:<record_id>` to receive the events. Remember to set the channel as a private channel, since `realtime.broadcast_changes` uses Realtime Authorization.

```flex

```

## Using Postgres Changes [\#](https://supabase.com/docs/guides/realtime/subscribing-to-database-changes\#using-postgres-changes)

Postgres Changes are simple to use, but have some [limitations](https://supabase.com/docs/guides/realtime/postgres-changes#limitations) as your application scales. We recommend using Broadcast for most use cases.

How to subscribe to real-time changes on your database - SupabaseTips - YouTube

[Photo image of Supabase](https://www.youtube.com/channel/UCNTVzV1InxHV-YR0fSajqPQ?embeds_referring_euri=https%3A%2F%2Fsupabase.com%2F)

Supabase

66.9K subscribers

[How to subscribe to real-time changes on your database - SupabaseTips](https://www.youtube.com/watch?v=2rUjcmgZDwQ)

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

### Enable Postgres Changes [\#](https://supabase.com/docs/guides/realtime/subscribing-to-database-changes\#enable-postgres-changes)

You'll first need to create a `supabase_realtime` publication and add your tables (that you want to subscribe to) to the publication:

```flex

```

### Streaming inserts [\#](https://supabase.com/docs/guides/realtime/subscribing-to-database-changes\#streaming-inserts)

You can use the `INSERT` event to stream all new rows.

```flex

```

### Streaming updates [\#](https://supabase.com/docs/guides/realtime/subscribing-to-database-changes\#streaming-updates)

You can use the `UPDATE` event to stream all updated rows.

```flex

```

### Is this helpful?

NoYes

### On this page

[Using Broadcast](https://supabase.com/docs/guides/realtime/subscribing-to-database-changes#using-broadcast) [Broadcast authorization](https://supabase.com/docs/guides/realtime/subscribing-to-database-changes#broadcast-authorization) [Create a trigger function](https://supabase.com/docs/guides/realtime/subscribing-to-database-changes#create-a-trigger-function) [Create a trigger](https://supabase.com/docs/guides/realtime/subscribing-to-database-changes#create-a-trigger) [Using Postgres Changes](https://supabase.com/docs/guides/realtime/subscribing-to-database-changes#using-postgres-changes) [Enable Postgres Changes](https://supabase.com/docs/guides/realtime/subscribing-to-database-changes#enable-postgres-changes) [Streaming inserts](https://supabase.com/docs/guides/realtime/subscribing-to-database-changes#streaming-inserts) [Streaming updates](https://supabase.com/docs/guides/realtime/subscribing-to-database-changes#streaming-updates)
