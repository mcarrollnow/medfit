---
library: supabase
url: https://supabase.com/docs/guides/database/hardening-data-api
title: Hardening the Data API | Supabase Docs
scraped: 2025-10-23T16:59:02.346Z
---

Database

# Hardening the Data API

* * *

Your database's auto-generated Data API exposes the `public` schema by default. You can change this to any schema in your database, or even disable the Data API completely.

Any tables that are accessible through the Data API _must_ have [Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security) enabled. Row Level Security (RLS) is enabled by default when you create tables from the Supabase Dashboard. If you create a table using the SQL editor or your own SQL client or migration runner, you _must_ enable RLS yourself.

## Shared responsibility [\#](https://supabase.com/docs/guides/database/hardening-data-api\#shared-responsibility)

Your application's security is your responsibility as a developer. This includes RLS, falling under the [Shared Responsibility](https://supabase.com/docs/guides/deployment/shared-responsibility-model) model. To help you:

- Supabase sends daily emails warning of any tables that are exposed to the Data API which do not have RLS enabled.
- Supabase provides a Security Advisor and other tools in the Supabase Dashboard to fix any issues.

## Private schemas [\#](https://supabase.com/docs/guides/database/hardening-data-api\#private-schemas)

We highly recommend creating a `private` schema for storing tables that you do not want to expose via the Data API. These tables can be accessed via Supabase Edge Functions or any other serverside tool. In this model, you should implement your security model in your serverside code. Although it's not required, we _still_ recommend enabling RLS for private tables and then connecting to your database using a Postgres role with `bypassrls` privileges.

## Managing the public schema [\#](https://supabase.com/docs/guides/database/hardening-data-api\#managing-the-public-schema)

If your `public` schema is used by other tools as a default space, you might want to lock down this schema. This helps prevent accidental exposure of data that's automatically added to `public`.

There are two levels of security hardening for the Data API:

- Disabling the Data API entirely. This is recommended if you _never_ need to access your database via Supabase client libraries or the REST and GraphQL endpoints.
- Removing the `public` schema from the Data API and replacing it with a custom schema (such as `api`).

## Disabling the Data API [\#](https://supabase.com/docs/guides/database/hardening-data-api\#disabling-the-data-api)

You can disable the Data API entirely if you never intend to use the Supabase client libraries or the REST and GraphQL data endpoints. For example, if you only access your database via a direct connection on the server, disabling the Data API gives you the greatest layer of protection.

1. Go to [API Settings](https://supabase.com/dashboard/project/_/settings/api) in the Supabase Dashboard.
2. Under **Data API Settings**, toggle **Enable Data API** off.

## Exposing a custom schema instead of `public` [\#](https://supabase.com/docs/guides/database/hardening-data-api\#exposing-a-custom-schema-instead-of-public)

If you want to use the Data API but with increased security, you can expose a custom schema instead of `public`. By not using `public`, which is often used as a default space and has laxer default permissions, you get more conscious control over your exposed data.

Any data, views, or functions that should be exposed need to be deliberately put within your custom schema (which we will call `api`), rather than ending up there by default.

### Step 1: Remove `public` from exposed schemas [\#](https://supabase.com/docs/guides/database/hardening-data-api\#step-1-remove-public-from-exposed-schemas)

1. Go to [**API Settings**](https://supabase.com/dashboard/project/_/settings/api) in the Supabase Dashboard.
2. Under **Data API Settings**, remove `public` from **Exposed schemas**. Also remove `public` from **Extra search path**.
3. Click **Save**.
4. Go to [**Database Extensions**](https://supabase.com/dashboard/project/_/database/extensions) and disable the `pg_graphql` extension.

### Step 2: Create an `api` schema and expose it [\#](https://supabase.com/docs/guides/database/hardening-data-api\#step-2-create-an-api-schema-and-expose-it)

1. Connect to your database. You can use `psql`, the [Supabase SQL Editor](https://supabase.com/dashboard/project/_/sql), or the Postgres client of your choice.

2. Create a new schema named `api`:



```flex



```

3. Grant the `anon` and `authenticated` roles usage on this schema.



```flex



```

4. Go to [API Settings](https://supabase.com/dashboard/project/_/settings/api) in the Supabase Dashboard.

5. Under **Data API Settings**, add `api` to **Exposed schemas**. Make sure it is the first schema in the list, so that it will be searched first by default.

6. Under these new settings, `anon` and `authenticated` can execute functions defined in the `api` schema, but they have no automatic permissions on any tables. On a table-by-table basis, you can grant them permissions. For example:



```flex



```


### Is this helpful?

NoYes

### On this page

[Shared responsibility](https://supabase.com/docs/guides/database/hardening-data-api#shared-responsibility) [Private schemas](https://supabase.com/docs/guides/database/hardening-data-api#private-schemas) [Managing the public schema](https://supabase.com/docs/guides/database/hardening-data-api#managing-the-public-schema) [Disabling the Data API](https://supabase.com/docs/guides/database/hardening-data-api#disabling-the-data-api) [Exposing a custom schema instead of public](https://supabase.com/docs/guides/database/hardening-data-api#exposing-a-custom-schema-instead-of-public) [Step 1: Remove public from exposed schemas](https://supabase.com/docs/guides/database/hardening-data-api#step-1-remove-public-from-exposed-schemas) [Step 2: Create an api schema and expose it](https://supabase.com/docs/guides/database/hardening-data-api#step-2-create-an-api-schema-and-expose-it)
