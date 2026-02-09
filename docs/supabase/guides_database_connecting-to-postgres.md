---
library: supabase
url: https://supabase.com/docs/guides/database/connecting-to-postgres
title: Connect to your database | Supabase Docs
scraped: 2025-10-23T16:59:02.328Z
---

Database

# Connect to your database

## Supabase provides multiple methods to connect to your Postgres database, whether you’re working on the frontend, backend, or utilizing serverless functions.

* * *

## How to connect to your Postgres databases [\#](https://supabase.com/docs/guides/database/connecting-to-postgres\#how-to-connect-to-your-postgres-databases)

How you connect to your database depends on where you're connecting from:

- For frontend applications, use the [Data API](https://supabase.com/docs/guides/database/connecting-to-postgres#data-apis-and-client-libraries)
- For Postgres clients, use a connection string
  - For single sessions (for example, database GUIs) or Postgres native commands (for example, using client applications like [pg\_dump](https://www.postgresql.org/docs/current/app-pgdump.html) or specifying connections for [replication](https://supabase.com/docs/guides/database/postgres/setup-replication-external)) use the [direct connection string](https://supabase.com/docs/guides/database/connecting-to-postgres#direct-connection) if your environment supports IPv6
  - For persistent clients, and support for both IPv4 and IPv6, use [Supavisor session mode](https://supabase.com/docs/guides/database/connecting-to-postgres#supavisor-session-mode)
  - For temporary clients (for example, serverless or edge functions) use [Supavisor transaction mode](https://supabase.com/docs/guides/database/connecting-to-postgres#supavisor-transaction-mode)

## Quickstarts [\#](https://supabase.com/docs/guides/database/connecting-to-postgres\#quickstarts)

[Prisma](https://supabase.com/docs/guides/database/prisma) [Drizzle](https://supabase.com/docs/guides/database/drizzle) [Postgres.js](https://supabase.com/docs/guides/database/postgres-js) [pgAdmin](https://supabase.com/docs/guides/database/pgadmin) [PSQL](https://supabase.com/docs/guides/database/psql) [DBeaver](https://supabase.com/docs/guides/database/dbeaver) [Metabase](https://supabase.com/docs/guides/database/metabase) [Beekeeper Studio](https://supabase.com/docs/guides/database/beekeeper-studio)

## Data APIs and client libraries [\#](https://supabase.com/docs/guides/database/connecting-to-postgres\#data-apis-and-client-libraries)

The Data APIs allow you to interact with your database using REST or GraphQL requests. You can use these APIs to fetch and insert data from the frontend, as long as you have [RLS](https://supabase.com/docs/guides/database/postgres/row-level-security) enabled.

- [REST](https://supabase.com/docs/guides/api)
- [GraphQL](https://supabase.com/docs/guides/graphql/api)

For convenience, you can also use the [Supabase client libraries](https://supabase.com/docs/reference), which wrap the Data APIs with a developer-friendly interface and automatically handle authentication:

- [JavaScript](https://supabase.com/docs/reference/javascript)
- [Flutter](https://supabase.com/docs/reference/dart)
- [Swift](https://supabase.com/docs/reference/swift)
- [Python](https://supabase.com/docs/reference/python)
- [C#](https://supabase.com/docs/reference/csharp)
- [Kotlin](https://supabase.com/docs/reference/kotlin)

## Direct connection [\#](https://supabase.com/docs/guides/database/connecting-to-postgres\#direct-connection)

The direct connection string connects directly to your Postgres instance. It is ideal for persistent servers, such as virtual machines (VMs) and long-lasting containers. Examples include AWS EC2 machines, Fly.io VMs, and DigitalOcean Droplets.

Direct connections use IPv6 by default. If your environment doesn't support IPv6, use [Supavisor session mode](https://supabase.com/docs/guides/database/connecting-to-postgres#supavisor-session-mode) or get the [IPv4 add-on](https://supabase.com/docs/guides/platform/ipv4-address).

The connection string looks like this:

```flex

```

Get your project's direct connection string from your project dashboard by clicking [Connect](https://supabase.com/dashboard/project/_?showConnect=true).

## Shared pooler [\#](https://supabase.com/docs/guides/database/connecting-to-postgres\#shared-pooler)

Every Supabase project includes a free, shared connection pooler. This is ideal for persistent servers when IPv6 is not supported.

### Supavisor session mode [\#](https://supabase.com/docs/guides/database/connecting-to-postgres\#supavisor-session-mode)

The session mode connection string connects to your Postgres instance via a proxy.

The connection string looks like this:

```flex

```

Get your project's Session pooler connection string from your project dashboard by clicking [Connect](https://supabase.com/dashboard/project/_?showConnect=true).

### Supavisor transaction mode [\#](https://supabase.com/docs/guides/database/connecting-to-postgres\#supavisor-transaction-mode)

The transaction mode connection string connects to your Postgres instance via a proxy which serves as a connection pooler. This is ideal for serverless or edge functions, which require many transient connections.

Transaction mode does not support [prepared statements](https://postgresql.org/docs/current/sql-prepare.html). To avoid errors, [turn off prepared statements](https://github.com/orgs/supabase/discussions/28239) for your connection library.

The connection string looks like this:

```flex

```

Get your project's Transaction pooler connection string from your project dashboard by clicking [Connect](https://supabase.com/dashboard/project/_?showConnect=true).

## Dedicated pooler [\#](https://supabase.com/docs/guides/database/connecting-to-postgres\#dedicated-pooler)

For paying customers, we provision a Dedicated Pooler ( [PgBouncer](https://www.pgbouncer.org/)) that's co-located with your Postgres database. This will require you to connect with IPv6 or, if that's not an option, you can use the [IPv4 add-on](https://supabase.com/docs/guides/platform/ipv4-address).

The Dedicated Pooler ensures best performance and latency, while using up more of your project's compute resources. If your network supports IPv6 or you have the IPv4 add-on, we encourage you to use the Dedicated Pooler over the Shared Pooler.

Get your project's Dedicated pooler connection string from your project dashboard by clicking [Connect](https://supabase.com/dashboard/project/_?showConnect=true).

PgBouncer always runs in Transaction mode and the current version does not support prepared statement (will be added in a few weeks).

## More about connection pooling [\#](https://supabase.com/docs/guides/database/connecting-to-postgres\#more-about-connection-pooling)

Connection pooling improves database performance by reusing existing connections between queries. This reduces the overhead of establishing connections and improves scalability.

You can use an application-side pooler or a server-side pooler (Supabase automatically provides one called Supavisor), depending on whether your backend is persistent or serverless.

### Application-side poolers [\#](https://supabase.com/docs/guides/database/connecting-to-postgres\#application-side-poolers)

Application-side poolers are built into connection libraries and API servers, such as Prisma, SQLAlchemy, and PostgREST. They maintain several active connections with Postgres or a server-side pooler, reducing the overhead of establishing connections between queries. When deploying to static architecture, such as long-standing containers or VMs, application-side poolers are satisfactory on their own.

### Serverside poolers [\#](https://supabase.com/docs/guides/database/connecting-to-postgres\#serverside-poolers)

Postgres connections are like a WebSocket. Once established, they are preserved until the client (application server) disconnects. A server might only make a single 10 ms query, but needlessly reserve its database connection for seconds or longer.

Serverside-poolers, such as Supabase's [Supavisor](https://github.com/supabase/supavisor) in transaction mode, sit between clients and the database and can be thought of as load balancers for Postgres connections.

![New migration files trigger migrations on the preview instance.](https://supabase.com/docs/_next/image?url=%2Fdocs%2Fimg%2Fguides%2Fdatabase%2Fconnecting-to-postgres%2Fhow-connection-pooling-works--light.png&w=3840&q=75)

Connecting to the database directly vs using a Connection Pooler

They maintain hot connections with the database and intelligently share them with clients only when needed, maximizing the amount of queries a single connection can service. They're best used to manage queries from auto-scaling systems, such as edge and serverless functions.

## Connecting with SSL [\#](https://supabase.com/docs/guides/database/connecting-to-postgres\#connecting-with-ssl)

You should connect to your database using SSL wherever possible, to prevent snooping and man-in-the-middle attacks.

You can obtain your connection info and Server root certificate from your application's dashboard:

![Connection Info and Certificate.](https://supabase.com/docs/img/database/database-settings-ssl.png)

## Resources [\#](https://supabase.com/docs/guides/database/connecting-to-postgres\#resources)

- [Connection management](https://supabase.com/docs/guides/database/connection-management)
- [Connecting with psql](https://supabase.com/docs/guides/database/psql)
- [Importing data into Supabase](https://supabase.com/docs/guides/database/import-data)

## Troubleshooting and Postgres connection string FAQs [\#](https://supabase.com/docs/guides/database/connecting-to-postgres\#troubleshooting-and-postgres-connection-string-faqs)

Below are answers to common challenges and queries.

### What is a “connection refused” error? [\#](https://supabase.com/docs/guides/database/connecting-to-postgres\#what-is-a-connection-refused-error)

A “Connection refused” error typically means your database isn’t reachable. Ensure your Supabase project is running, confirm your database’s connection string, check firewall settings, and validate network permissions.

### What is the “FATAL: Password authentication failed” error? [\#](https://supabase.com/docs/guides/database/connecting-to-postgres\#what-is-the-fatal-password-authentication-failed-error)

This error occurs when your credentials are incorrect. Double-check your username and password from the Supabase dashboard. If the problem persists, reset your database password from the project settings.

### How do you connect using IPv4? [\#](https://supabase.com/docs/guides/database/connecting-to-postgres\#how-do-you-connect-using-ipv4)

Supabase’s default direct connection supports IPv6 only. To connect over IPv4, consider using the Supavisor session or transaction modes, or a connection pooler (shared or dedicated), which support both IPv4 and IPv6.

### Where is the Postgres connection string in Supabase? [\#](https://supabase.com/docs/guides/database/connecting-to-postgres\#where-is-the-postgres-connection-string-in-supabase)

Your connection string is located in the Supabase Dashboard. Click the [Connect](https://supabase.com/dashboard/project/_?showConnect=true) button at the top of the page.

### Can you use Supavisor and PgBouncer together? [\#](https://supabase.com/docs/guides/database/connecting-to-postgres\#can-you-use-supavisor-and-pgbouncer-together)

You can technically use both, but it’s not recommended unless you’re specifically trying to increase the total number of concurrent client connections. In most cases, it is better to choose either PgBouncer or Supavisor for pooled or transaction-based traffic. Direct connections remain the best choice for long-lived sessions, and, if IPv4 is required for those sessions, Supavisor session mode can be used as an alternative. Running both poolers simultaneously increases the risk of hitting your database’s maximum connection limit on smaller compute tiers.

### How does the default pool size work? [\#](https://supabase.com/docs/guides/database/connecting-to-postgres\#how-does-the-default-pool-size-work)

Supavisor and PgBouncer work independently, but both reference the same pool size setting. For example, if you set the pool size to 30, Supavisor can open up to 30 server-side connections to Postgres each for its session mode port (5432) and transaction mode port (6543), and PgBouncer can also open up to 30. If both poolers are active and reach their roles/modes limits at the same time, you could have as many as 60 backend connections hitting your database, in addition to any direct connections. You can adjust the pool size in [Database settings](https://supabase.com/dashboard/project/_/database/settings) in the dashboard.

### What is the difference between client connections and backend connections? [\#](https://supabase.com/docs/guides/database/connecting-to-postgres\#what-is-the-difference-between-client-connections-and-backend-connections)

There are two different limits to understand when working with poolers. The first is client connections, which refers to how many clients can connect to a pooler at the same time. This number is capped by your [compute tier’s “max pooler clients” limit](https://supabase.com/docs/guides/platform/compute-and-disk#postgres-replication-slots-wal-senders-and-connections), and it applies independently to Supavisor and PgBouncer. The second is backend connections, which is the number of active connections a pooler opens to Postgres. This number is set by the pool size for that pooler.

```flex

```

### What is the max pooler clients limit? [\#](https://supabase.com/docs/guides/database/connecting-to-postgres\#what-is-the-max-pooler-clients-limit)

The “max pooler clients” limit for your compute tier applies separately to Supavisor and PgBouncer. One pooler reaching its client limit does not affect the other. When a pooler reaches this limit, it stops accepting new client connections until existing ones are closed, but the other pooler remains unaffected. You can check your tier’s connection limits in the [compute and disk limits documentation](https://supabase.com/docs/guides/platform/compute-and-disk#postgres-replication-slots-wal-senders-and-connections).

### Where can you see current connection usage? [\#](https://supabase.com/docs/guides/database/connecting-to-postgres\#where-can-you-see-current-connection-usage)

You can track connection usage from the [Reports](https://supabase.com/dashboard/project/_/reports/database) section in your project dashboard. There are three key reports:

- **Database Connections:** shows total active connections by role (this includes direct and pooled connections).
- **Dedicated Pooler Client Connections:** shows the number of active client connections to PgBouncer.
- **Shared Pooler (Supavisor) Client Connections:** shows the number of active client connections to Supavisor.

Keep in mind that the Roles page is not real-time, it shows the connection count from the last refresh. If you need up-to-the-second data, set up Grafana or run the query against `pg_stat_activity` directly in SQL Editor. We have a few helpful queries for checking connections.

```flex

```

```flex

```

### Why are there active connections when the app is idle? [\#](https://supabase.com/docs/guides/database/connecting-to-postgres\#why-are-there-active-connections-when-the-app-is-idle)

Even if your application isn’t making queries, some Supabase services keep persistent connections to your database. For example, Storage, PostgREST, and our health checker all maintain long-lived connections. You usually see a small baseline of active connections from these services.

### Why do connection strings have different ports? [\#](https://supabase.com/docs/guides/database/connecting-to-postgres\#why-do-connection-strings-have-different-ports)

Different modes use different ports:

- Direct connection: `5432` (database server)
- PgBouncer: `6543` (database server)
- Supavisor transaction mode: `6543` (separate server)
- Supavisor session mode: `5432` (separate server)

The port helps route the connection to the right pooler/mode.

### Does connection pooling affect latency? [\#](https://supabase.com/docs/guides/database/connecting-to-postgres\#does-connection-pooling-affect-latency)

Because the dedicated pooler is hosted on the same machine as your database, it connects with lower latency than the shared pooler, which is hosted on a separate server. Direct connections have no pooler overhead but require IPv6 unless you have the IPv4 add-on.

### How to choose the right connection method? [\#](https://supabase.com/docs/guides/database/connecting-to-postgres\#how-to-choose-the-right-connection-method)

**Direct connection:**

- Best for: persistent backend services
- Limitation: IPv6 only

**Shared pooler:**

- Best for: general-purpose connections (supports IPv4 and IPv6)
  - Supavisor session mode → persistent backend that require IPv4
  - Supavisor transaction mode → serverless functions or short-lived tasks

**Dedicated pooler (paid tier):**

- Best for: high-performance apps that need dedicated resources
- Uses PgBouncer

You can follow the decision flow in the connection method diagram to quickly choose the right option for your environment.

![Decision tree diagram showing when to connect directly to Postgres or use a connection pooler.](https://supabase.com/docs/img/guides/database/connecting-to-postgres/connection-decision-tree-light.svg)

Choosing between direct Postgres connections and connection pooling

### Is this helpful?

NoYes

### On this page

[How to connect to your Postgres databases](https://supabase.com/docs/guides/database/connecting-to-postgres#how-to-connect-to-your-postgres-databases) [Quickstarts](https://supabase.com/docs/guides/database/connecting-to-postgres#quickstarts) [Data APIs and client libraries](https://supabase.com/docs/guides/database/connecting-to-postgres#data-apis-and-client-libraries) [Direct connection](https://supabase.com/docs/guides/database/connecting-to-postgres#direct-connection) [Shared pooler](https://supabase.com/docs/guides/database/connecting-to-postgres#shared-pooler) [Supavisor session mode](https://supabase.com/docs/guides/database/connecting-to-postgres#supavisor-session-mode) [Supavisor transaction mode](https://supabase.com/docs/guides/database/connecting-to-postgres#supavisor-transaction-mode) [Dedicated pooler](https://supabase.com/docs/guides/database/connecting-to-postgres#dedicated-pooler) [More about connection pooling](https://supabase.com/docs/guides/database/connecting-to-postgres#more-about-connection-pooling) [Application-side poolers](https://supabase.com/docs/guides/database/connecting-to-postgres#application-side-poolers) [Serverside poolers](https://supabase.com/docs/guides/database/connecting-to-postgres#serverside-poolers) [Connecting with SSL](https://supabase.com/docs/guides/database/connecting-to-postgres#connecting-with-ssl) [Resources](https://supabase.com/docs/guides/database/connecting-to-postgres#resources) [Troubleshooting and Postgres connection string FAQs](https://supabase.com/docs/guides/database/connecting-to-postgres#troubleshooting-and-postgres-connection-string-faqs) [What is a “connection refused” error?](https://supabase.com/docs/guides/database/connecting-to-postgres#what-is-a-connection-refused-error) [What is the “FATAL: Password authentication failed” error?](https://supabase.com/docs/guides/database/connecting-to-postgres#what-is-the-fatal-password-authentication-failed-error) [How do you connect using IPv4?](https://supabase.com/docs/guides/database/connecting-to-postgres#how-do-you-connect-using-ipv4) [Where is the Postgres connection string in Supabase?](https://supabase.com/docs/guides/database/connecting-to-postgres#where-is-the-postgres-connection-string-in-supabase) [Can you use Supavisor and PgBouncer together?](https://supabase.com/docs/guides/database/connecting-to-postgres#can-you-use-supavisor-and-pgbouncer-together) [How does the default pool size work?](https://supabase.com/docs/guides/database/connecting-to-postgres#how-does-the-default-pool-size-work) [What is the difference between client connections and backend connections?](https://supabase.com/docs/guides/database/connecting-to-postgres#what-is-the-difference-between-client-connections-and-backend-connections) [What is the max pooler clients limit?](https://supabase.com/docs/guides/database/connecting-to-postgres#what-is-the-max-pooler-clients-limit) [Where can you see current connection usage?](https://supabase.com/docs/guides/database/connecting-to-postgres#where-can-you-see-current-connection-usage) [Why are there active connections when the app is idle?](https://supabase.com/docs/guides/database/connecting-to-postgres#why-are-there-active-connections-when-the-app-is-idle) [Why do connection strings have different ports?](https://supabase.com/docs/guides/database/connecting-to-postgres#why-do-connection-strings-have-different-ports) [Does connection pooling affect latency?](https://supabase.com/docs/guides/database/connecting-to-postgres#does-connection-pooling-affect-latency) [How to choose the right connection method?](https://supabase.com/docs/guides/database/connecting-to-postgres#how-to-choose-the-right-connection-method)
