---
library: supabase
url: https://supabase.com/docs/guides/realtime/getting_started
title: Getting Started with Realtime | Supabase Docs
scraped: 2025-10-23T16:59:02.318Z
---

Realtime

# Getting Started with Realtime

## Learn how to build real-time applications with Supabase Realtime

* * *

## Quick start [\#](https://supabase.com/docs/guides/realtime/getting_started\#quick-start)

### 1\. Install the client library [\#](https://supabase.com/docs/guides/realtime/getting_started\#1-install-the-client-library)

TypeScriptFlutterSwiftPython - PIPPython - Conda

```flex

```

### 2\. Initialize the client [\#](https://supabase.com/docs/guides/realtime/getting_started\#2-initialize-the-client)

Get your project URL and key.

### Get API details [\#](https://supabase.com/docs/guides/realtime/getting_started\#get-api-details)

Now that you've created some database tables, you are ready to insert data using the auto-generated API.

To do this, you need to get the Project URL and key. Get the URL from [the API settings section](https://supabase.com/dashboard/project/_/settings/api) of a project and the key from the [the API Keys section of a project's Settings page](https://supabase.com/dashboard/project/_/settings/api-keys/).

##### Changes to API keys

Supabase is changing the way keys work to improve project security and developer experience. You can [read the full announcement](https://github.com/orgs/supabase/discussions/29260), but in the transition period, you can use both the current `anon` and `service_role` keys and the new publishable key with the form `sb_publishable_xxx` which will replace the older keys.

To get the key values, open [the API Keys section of a project's Settings page](https://supabase.com/dashboard/project/_/settings/api-keys/) and do the following:

- **For legacy keys**, copy the `anon` key for client-side operations and the `service_role` key for server-side operations from the **Legacy API Keys** tab.
- **For new keys**, open the **API Keys** tab, if you don't have a publishable key already, click **Create new API Keys**, and copy the value from the **Publishable key** section.

TypeScriptFlutterSwiftPython

```flex

```

### 3\. Create your first Channel [\#](https://supabase.com/docs/guides/realtime/getting_started\#3-create-your-first-channel)

Channels are the foundation of Realtime. Think of them as rooms where clients can communicate. Each channel is identified by a topic name and if they are public or private.

TypeScriptFlutterSwiftPython

```flex

```

### 4\. Set up authorization [\#](https://supabase.com/docs/guides/realtime/getting_started\#4-set-up-authorization)

Since we're using a private channel, you need to create a basic RLS policy on the `realtime.messages` table to allow authenticated users to connect. Row Level Security (RLS) policies control who can access your Realtime channels based on user authentication and custom rules:

```flex

```

### 5\. Send and receive messages [\#](https://supabase.com/docs/guides/realtime/getting_started\#5-send-and-receive-messages)

There are three main ways to send messages with Realtime:

#### 5.1 using client libraries [\#](https://supabase.com/docs/guides/realtime/getting_started\#51-using-client-libraries)

Send and receive messages using the Supabase client:

TypeScriptFlutterSwiftPython

```flex

```

#### 5.2 using HTTP/REST API [\#](https://supabase.com/docs/guides/realtime/getting_started\#52-using-httprest-api)

Send messages via HTTP requests, perfect for server-side applications:

TypeScriptFlutterSwiftPython

```flex

```

#### 5.3 using database triggers [\#](https://supabase.com/docs/guides/realtime/getting_started\#53-using-database-triggers)

Automatically broadcast database changes using triggers. Choose the approach that best fits your needs:

**Using `realtime.broadcast_changes` (Best for mirroring database changes)**

```flex

```

**Using `realtime.send` (Best for custom notifications and filtered data)**

```flex

```

- **`realtime.broadcast_changes`** sends the full database change with metadata
- **`realtime.send`** allows you to send custom payloads and control exactly what data is broadcast

## Essential best practices [\#](https://supabase.com/docs/guides/realtime/getting_started\#essential-best-practices)

### Use private channels [\#](https://supabase.com/docs/guides/realtime/getting_started\#use-private-channels)

Always use private channels for production applications to ensure proper security and authorization:

```flex

```

### Follow naming conventions [\#](https://supabase.com/docs/guides/realtime/getting_started\#follow-naming-conventions)

**Channel Topics:** Use the pattern `scope:id:entity`

- `room:123:messages` \- Messages in room 123
- `game:456:moves` \- Game moves for game 456
- `user:789:notifications` \- Notifications for user 789

### Clean up subscriptions [\#](https://supabase.com/docs/guides/realtime/getting_started\#clean-up-subscriptions)

Always unsubscribe when you are done with a channel to ensure you free up resources:

TypeScriptFlutterSwiftPython

```flex

```

## Choose the right feature [\#](https://supabase.com/docs/guides/realtime/getting_started\#choose-the-right-feature)

### When to use Broadcast [\#](https://supabase.com/docs/guides/realtime/getting_started\#when-to-use-broadcast)

- Real-time messaging and notifications
- Custom events and game state
- Database change notifications (with triggers)
- High-frequency updates (e.g. Cursor tracking)
- Most use cases

### When to use Presence [\#](https://supabase.com/docs/guides/realtime/getting_started\#when-to-use-presence)

- User online/offline status
- Active user counters
- Use minimally due to computational overhead

### When to use Postgres Changes [\#](https://supabase.com/docs/guides/realtime/getting_started\#when-to-use-postgres-changes)

- Quick testing and development
- Low amount of connected users

## Next steps [\#](https://supabase.com/docs/guides/realtime/getting_started\#next-steps)

Now that you understand the basics, dive deeper into each feature:

### Core features [\#](https://supabase.com/docs/guides/realtime/getting_started\#core-features)

- **[Broadcast](https://supabase.com/docs/guides/realtime/broadcast)** \- Learn about sending messages, database triggers, and REST API usage
- **[Presence](https://supabase.com/docs/guides/realtime/presence)** \- Implement user state tracking and online indicators
- **[Postgres Changes](https://supabase.com/docs/guides/realtime/postgres-changes)** \- Understanding database change listeners (consider migrating to Broadcast)

### Security & configuration [\#](https://supabase.com/docs/guides/realtime/getting_started\#security--configuration)

- **[Authorization](https://supabase.com/docs/guides/realtime/authorization)** \- Set up RLS policies for private channels
- **[Settings](https://supabase.com/docs/guides/realtime/settings)** \- Configure your Realtime instance for optimal performance

### Advanced topics [\#](https://supabase.com/docs/guides/realtime/getting_started\#advanced-topics)

- **[Architecture](https://supabase.com/docs/guides/realtime/architecture)** \- Understand how Realtime works under the hood
- **[Benchmarks](https://supabase.com/docs/guides/realtime/benchmarks)** \- Performance characteristics and scaling considerations
- **[Quotas](https://supabase.com/docs/guides/realtime/quotas)** \- Usage limits and best practices

### Integration guides [\#](https://supabase.com/docs/guides/realtime/getting_started\#integration-guides)

- **[Realtime with Next.js](https://supabase.com/docs/guides/realtime/realtime-with-nextjs)** \- Build real-time Next.js applications
- **[User Presence](https://supabase.com/docs/guides/realtime/realtime-user-presence)** \- Implement user presence features
- **[Database Changes](https://supabase.com/docs/guides/realtime/subscribing-to-database-changes)** \- Listen to database changes

### Framework examples [\#](https://supabase.com/docs/guides/realtime/getting_started\#framework-examples)

- **[Flutter Integration](https://supabase.com/docs/guides/realtime/realtime-listening-flutter)** \- Build real-time Flutter applications

Ready to build something amazing? Start with the [Broadcast guide](https://supabase.com/docs/guides/realtime/broadcast) to create your first real-time feature!

### Is this helpful?

NoYes

### On this page

[Quick start](https://supabase.com/docs/guides/realtime/getting_started#quick-start) [1\. Install the client library](https://supabase.com/docs/guides/realtime/getting_started#1-install-the-client-library) [2\. Initialize the client](https://supabase.com/docs/guides/realtime/getting_started#2-initialize-the-client) [Get API details](https://supabase.com/docs/guides/realtime/getting_started#get-api-details) [3\. Create your first Channel](https://supabase.com/docs/guides/realtime/getting_started#3-create-your-first-channel) [4\. Set up authorization](https://supabase.com/docs/guides/realtime/getting_started#4-set-up-authorization) [5\. Send and receive messages](https://supabase.com/docs/guides/realtime/getting_started#5-send-and-receive-messages) [Essential best practices](https://supabase.com/docs/guides/realtime/getting_started#essential-best-practices) [Use private channels](https://supabase.com/docs/guides/realtime/getting_started#use-private-channels) [Follow naming conventions](https://supabase.com/docs/guides/realtime/getting_started#follow-naming-conventions) [Clean up subscriptions](https://supabase.com/docs/guides/realtime/getting_started#clean-up-subscriptions) [Choose the right feature](https://supabase.com/docs/guides/realtime/getting_started#choose-the-right-feature) [When to use Broadcast](https://supabase.com/docs/guides/realtime/getting_started#when-to-use-broadcast) [When to use Presence](https://supabase.com/docs/guides/realtime/getting_started#when-to-use-presence) [When to use Postgres Changes](https://supabase.com/docs/guides/realtime/getting_started#when-to-use-postgres-changes) [Next steps](https://supabase.com/docs/guides/realtime/getting_started#next-steps) [Core features](https://supabase.com/docs/guides/realtime/getting_started#core-features) [Security & configuration](https://supabase.com/docs/guides/realtime/getting_started#security--configuration) [Advanced topics](https://supabase.com/docs/guides/realtime/getting_started#advanced-topics) [Integration guides](https://supabase.com/docs/guides/realtime/getting_started#integration-guides) [Framework examples](https://supabase.com/docs/guides/realtime/getting_started#framework-examples)
