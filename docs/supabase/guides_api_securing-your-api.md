---
library: supabase
url: https://supabase.com/docs/guides/api/securing-your-api
title: Securing your API | Supabase Docs
scraped: 2025-10-23T16:59:02.320Z
---

REST API

# Securing your API

* * *

The data APIs are designed to work with Postgres Row Level Security (RLS). If you use [Supabase Auth](https://supabase.com/docs/guides/auth), you can restrict data based on the logged-in user.

To control access to your data, you can use [Policies](https://supabase.com/docs/guides/auth#policies).

## Enabling row level security [\#](https://supabase.com/docs/guides/api/securing-your-api\#enabling-row-level-security)

Any table you create in the `public` schema will be accessible via the Supabase Data API.

To restrict access, enable Row Level Security (RLS) on all tables, views, and functions in the `public` schema. You can then write RLS policies to grant users access to specific database rows or functions based on their authentication token.

Always enable Row Level Security on tables, views, and functions in the `public` schema to protect your data.

Any table created through the Supabase Dashboard will have RLS enabled by default. If you created the tables via the SQL editor or via another way, enable RLS like so:

DashboardSQL

1. Go to the [Authentication > Policies](https://supabase.com/dashboard/project/_/auth/policies) page in the Dashboard.
2. Select **Enable RLS** to enable Row Level Security.

With RLS enabled, you can create Policies that allow or disallow users to access and update data. We provide a detailed guide for creating Row Level Security Policies in our [Authorization documentation](https://supabase.com/docs/guides/database/postgres/row-level-security).

Any table **without RLS enabled** in the `public` schema will be accessible to the public, using the `anon` role. Always make sure that RLS is enabled or that you've got other security measures in place to avoid unauthorized access to your project's data!

## Disable the API or restrict to custom schema [\#](https://supabase.com/docs/guides/api/securing-your-api\#disable-the-api-or-restrict-to-custom-schema)

If you don't use the Data API, or if you don't want to expose the `public` schema, you can either disable it entirely or change the automatically exposed schema to one of your choice. See **[Hardening the Data API](https://supabase.com/docs/guides/database/hardening-data-api)** for instructions.

## Enforce additional rules on each request [\#](https://supabase.com/docs/guides/api/securing-your-api\#enforce-additional-rules-on-each-request)

Using Row Level Security policies may not always be adequate or sufficient to protect APIs.

Here are some common situations where additional protections are necessary:

- Enforcing per-IP or per-user rate limits.
- Checking custom or additional API keys before allowing further access.
- Rejecting requests after exceeding a quota or requiring payment.
- Disallowing direct access to certain tables, views or functions in the `public` schema.

You can build these cases in your application by creating a Postgres function that will read information from the request and perform additional checks, such as counting the number of requests received or checking that an API key is already registered in your database before serving the response.

Define a function like so:

```flex

```

And register it to run on every Data API request using:

```flex

```

This configures the `public.check_request` function to run on every Data API request. To have the changes take effect, you should run:

```flex

```

Inside the function you can perform any additional checks on the request headers or JWT and raise an exception to prevent the request from completing. For example, this exception raises a HTTP 402 Payment Required response with a `hint` and additional `X-Powered-By` header:

```flex

```

When raised within the `public.check_request` function, the resulting HTTP response will look like:

```flex

```

Use the [JSON operator functions](https://www.postgresql.org/docs/current/functions-json.html) to build rich and dynamic responses from exceptions.

If you use a custom HTTP status code like 419, you can supply the `status_text` key in the `detail` clause of the exception to describe the HTTP status.

If you're using PostgREST version 11 or lower ( [find out your PostgREST version](https://supabase.com/dashboard/project/_/settings/infrastructure)) a different and less powerful [syntax](https://postgrest.org/en/stable/references/errors.html#raise-errors-with-http-status-codes) needs to be used.

### Accessing request information [\#](https://supabase.com/docs/guides/api/securing-your-api\#accessing-request-information)

Like with RLS policies, you can access information about the request by using the `current_setting()` Postgres function. Here are some examples on how this works:

```flex

```

| `current_setting()` | Example | Description |
| --- | --- | --- |
| `request.method` | `GET`, `HEAD`, `POST`, `PUT`, `PATCH`, `DELETE` | Request's method |
| `request.path` | `table` | Table's path |
| `request.path` | `view` | View's path |
| `request.path` | `rpc/function` | Functions's path |
| `request.headers` | `{ "User-Agent": "...", ... }` | JSON object of the request's headers |
| `request.cookies` | `{ "cookieA": "...", "cookieB": "..." }` | JSON object of the request's cookies |
| `request.jwt` | `{ "sub": "a7194ea3-...", ... }` | JSON object of the JWT payload |

To access the IP address of the client look up the [X-Forwarded-For header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-For) in the `request.headers` setting. For example:

```flex

```

Read more about [PostgREST's pre-request function](https://postgrest.org/en/stable/references/transactions.html#pre-request).

### Examples [\#](https://supabase.com/docs/guides/api/securing-your-api\#examples)

Rate limit per IPUse additional API keys

You can only rate-limit `POST`, `PUT`, `PATCH` and `DELETE` requests. This is because `GET` and `HEAD` requests run in read-only mode, and will be served by [Read Replicas](https://supabase.com/docs/guides/platform/read-replicas) which do not support writing to the database.

Outline:

- A new row is added to a `private.rate_limits` table each time a modifying action is done to the database containing the IP address and the timestamp of the action.
- If there are over 100 requests from the same IP address in the last 5 minutes, the request is rejected with a HTTP 420 code.

Create the table:

```flex

```

The `private` schema is used as it cannot be accessed over the API!

Create the `public.check_request` function:

```flex

```

Finally, configure the `public.check_request()` function to run on every Data API request:

```flex

```

To clear old entries in the `private.rate_limits` table, set up a [pg\_cron](https://supabase.com/docs/guides/database/extensions/pg_cron) job to clean them up.

### Is this helpful?

NoYes

### On this page

[Enabling row level security](https://supabase.com/docs/guides/api/securing-your-api#enabling-row-level-security) [Disable the API or restrict to custom schema](https://supabase.com/docs/guides/api/securing-your-api#disable-the-api-or-restrict-to-custom-schema) [Enforce additional rules on each request](https://supabase.com/docs/guides/api/securing-your-api#enforce-additional-rules-on-each-request) [Accessing request information](https://supabase.com/docs/guides/api/securing-your-api#accessing-request-information) [Examples](https://supabase.com/docs/guides/api/securing-your-api#examples)
