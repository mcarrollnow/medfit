---
library: supabase
url: https://supabase.com/docs/guides/database/extensions/pg_net
title: pg_net: Async Networking | Supabase Docs
scraped: 2025-10-23T16:59:02.331Z
---

Database

# pg\_net: Async Networking

* * *

The pg\_net API is in beta. Functions signatures may change.

[pg\_net](https://github.com/supabase/pg_net/) enables Postgres to make asynchronous HTTP/HTTPS requests in SQL. It differs from the [`http`](https://supabase.com/docs/guides/database/extensions/http) extension in that it is asynchronous by default. This makes it useful in blocking functions (like triggers).

It eliminates the need for servers to continuously poll for database changes and instead allows the database to proactively notify external resources about significant events.

## Enable the extension [\#](https://supabase.com/docs/guides/database/extensions/pg_net\#enable-the-extension)

DashboardSQL

1. Go to the [Database](https://supabase.com/dashboard/project/_/database/tables) page in the Dashboard.
2. Click on **Extensions** in the sidebar.
3. Search for "pg\_net" and enable the extension.

## `http_get` [\#](https://supabase.com/docs/guides/database/extensions/pg_net\#httpget)

Creates an HTTP GET request returning the request's ID. HTTP requests are not started until the transaction is committed.

### Signature [\#](https://supabase.com/docs/guides/database/extensions/pg_net\#get-signature)

This is a Postgres [SECURITY DEFINER](https://supabase.com/docs/guides/database/postgres/row-level-security#use-security-definer-functions) function.

```flex

```

### Usage [\#](https://supabase.com/docs/guides/database/extensions/pg_net\#get-usage)

```flex

```

## `http_post` [\#](https://supabase.com/docs/guides/database/extensions/pg_net\#httppost)

Creates an HTTP POST request with a JSON body, returning the request's ID. HTTP requests are not started until the transaction is committed.

The body's character set encoding matches the database's `server_encoding` setting.

### Signature [\#](https://supabase.com/docs/guides/database/extensions/pg_net\#post-signature)

This is a Postgres [SECURITY DEFINER](https://supabase.com/docs/guides/database/postgres/row-level-security#use-security-definer-functions) function

```flex

```

### Usage [\#](https://supabase.com/docs/guides/database/extensions/pg_net\#post-usage)

```flex

```

## `http_delete` [\#](https://supabase.com/docs/guides/database/extensions/pg_net\#httpdelete)

Creates an HTTP DELETE request, returning the request's ID. HTTP requests are not started until the transaction is committed.

### Signature [\#](https://supabase.com/docs/guides/database/extensions/pg_net\#post-signature)

This is a Postgres [SECURITY DEFINER](https://supabase.com/docs/guides/database/postgres/row-level-security#use-security-definer-functions) function

```flex

```

### Usage [\#](https://supabase.com/docs/guides/database/extensions/pg_net\#delete-usage)

```flex

```

## Analyzing responses [\#](https://supabase.com/docs/guides/database/extensions/pg_net\#analyzing-responses)

Waiting requests are stored in the `net.http_request_queue` table. Upon execution, they are deleted.

```flex

```

Once a response is returned, by default, it is stored for 6 hours in the `net._http_response` table.

```flex

```

The responses can be observed with the following query:

```flex

```

The data can also be observed in the `net` schema with the [Supabase Dashboard's SQL Editor](https://supabase.com/dashboard/project/_/editor)

## Debugging requests [\#](https://supabase.com/docs/guides/database/extensions/pg_net\#debugging-requests)

### Inspecting request data [\#](https://supabase.com/docs/guides/database/extensions/pg_net\#inspecting-request-data)

The [Postman Echo API](https://documenter.getpostman.com/view/5025623/SWTG5aqV) returns a response with the same body and content
as the request. It can be used to inspect the data being sent.

Sending a post request to the echo API

```flex

```

Inspecting the echo API response content to ensure it contains the right body

```flex

```

Alternatively, by wrapping a request in a [database function](https://supabase.com/docs/guides/database/functions), sent row data can be logged or returned for inspection and debugging.

```flex

```

### Inspecting failed requests [\#](https://supabase.com/docs/guides/database/extensions/pg_net\#inspecting-failed-requests)

Finds all failed requests

```flex

```

## Configuration [\#](https://supabase.com/docs/guides/database/extensions/pg_net\#configuration)

##### Must be on pg\_net v0.12.0 or above to reconfigure

Supabase supports reconfiguring pg\*net starting from v0.12.0+. For the latest release, initiate a Postgres upgrade in the [Infrastructure Settings](https://supabase.com/dashboard/project/*/settings/infrastructure).

The extension is configured to reliably execute up to 200 requests per second. The response messages are stored for only 6 hours to prevent needless buildup. The default behavior can be modified by rewriting config variables.

### Get current settings [\#](https://supabase.com/docs/guides/database/extensions/pg_net\#get-current-settings)

```flex

```

### Alter settings [\#](https://supabase.com/docs/guides/database/extensions/pg_net\#alter-settings)

Change variables:

```flex

```

Then reload the settings and restart the `pg_net` background worker with:

```flex

```

## Examples [\#](https://supabase.com/docs/guides/database/extensions/pg_net\#examples)

### Invoke a Supabase Edge Function [\#](https://supabase.com/docs/guides/database/extensions/pg_net\#invoke-a-supabase-edge-function)

Make a POST request to a Supabase Edge Function with auth header and JSON body payload:

```flex

```

### Call an endpoint every minute with [pg\_cron](https://supabase.com/docs/guides/database/extensions/pgcron) [\#](https://supabase.com/docs/guides/database/extensions/pg_net\#call-an-endpoint-every-minute-with-pgcron)

The pg\_cron extension enables Postgres to become its own cron server. With it you can schedule regular calls with up to a minute precision to endpoints.

```flex

```

### Execute pg\_net in a trigger [\#](https://supabase.com/docs/guides/database/extensions/pg_net\#execute-pgnet-in-a-trigger)

Make a call to an external endpoint when a trigger event occurs.

```flex

```

### Send multiple table rows in one request [\#](https://supabase.com/docs/guides/database/extensions/pg_net\#send-multiple-table-rows-in-one-request)

```flex

```

More examples can be seen on the [Extension's GitHub page](https://github.com/supabase/pg_net/)

## Limitations [\#](https://supabase.com/docs/guides/database/extensions/pg_net\#limitations)

- To improve speed and performance, the requests and responses are stored in [unlogged tables](https://pgpedia.info/u/unlogged-table.html), which are not preserved during a crash or unclean shutdown.
- By default, response data is saved for only 6 hours
- Can only make POST requests with JSON data. No other data formats are supported
- Intended to handle at most 200 requests per second. Increasing the rate can introduce instability
- Does not have support for PATCH/PUT requests
- Can only work with one database at a time. It defaults to the `postgres` database.

## Resources [\#](https://supabase.com/docs/guides/database/extensions/pg_net\#resources)

- Source code: [github.com/supabase/pg\_net](https://github.com/supabase/pg_net/)
- Official Docs: [github.com/supabase/pg\_net](https://github.com/supabase/pg_net/)

### Is this helpful?

NoYes

### On this page

[Enable the extension](https://supabase.com/docs/guides/database/extensions/pg_net#enable-the-extension) [http\_get](https://supabase.com/docs/guides/database/extensions/pg_net#httpget) [Signature](https://supabase.com/docs/guides/database/extensions/pg_net#get-signature) [Usage](https://supabase.com/docs/guides/database/extensions/pg_net#get-usage) [http\_post](https://supabase.com/docs/guides/database/extensions/pg_net#httppost) [Signature](https://supabase.com/docs/guides/database/extensions/pg_net#post-signature) [Usage](https://supabase.com/docs/guides/database/extensions/pg_net#post-usage) [http\_delete](https://supabase.com/docs/guides/database/extensions/pg_net#httpdelete) [Signature](https://supabase.com/docs/guides/database/extensions/pg_net#post-signature) [Usage](https://supabase.com/docs/guides/database/extensions/pg_net#delete-usage) [Analyzing responses](https://supabase.com/docs/guides/database/extensions/pg_net#analyzing-responses) [Debugging requests](https://supabase.com/docs/guides/database/extensions/pg_net#debugging-requests) [Inspecting request data](https://supabase.com/docs/guides/database/extensions/pg_net#inspecting-request-data) [Inspecting failed requests](https://supabase.com/docs/guides/database/extensions/pg_net#inspecting-failed-requests) [Configuration](https://supabase.com/docs/guides/database/extensions/pg_net#configuration) [Get current settings](https://supabase.com/docs/guides/database/extensions/pg_net#get-current-settings) [Alter settings](https://supabase.com/docs/guides/database/extensions/pg_net#alter-settings) [Examples](https://supabase.com/docs/guides/database/extensions/pg_net#examples) [Invoke a Supabase Edge Function](https://supabase.com/docs/guides/database/extensions/pg_net#invoke-a-supabase-edge-function) [Call an endpoint every minute with pg\_cron](https://supabase.com/docs/guides/database/extensions/pg_net#/docs/guides/database/extensions/pgcron) [Execute pg\_net in a trigger](https://supabase.com/docs/guides/database/extensions/pg_net#execute-pgnet-in-a-trigger) [Send multiple table rows in one request](https://supabase.com/docs/guides/database/extensions/pg_net#send-multiple-table-rows-in-one-request) [Limitations](https://supabase.com/docs/guides/database/extensions/pg_net#limitations) [Resources](https://supabase.com/docs/guides/database/extensions/pg_net#resources)
