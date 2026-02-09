---
library: supabase
url: https://supabase.com/docs/guides/database/database-advisors?lint=0002_auth_users_exposed
title: Performance and Security Advisors | Supabase Docs
scraped: 2025-10-23T16:59:02.324Z
---

Database

# Performance and Security Advisors

## Check your database for performance and security issues

* * *

You can use the Database Performance and Security Advisors to check your database for issues such as missing indexes and improperly set-up RLS policies.

## Using the Advisors [\#](https://supabase.com/docs/guides/database/database-advisors?lint=0002_auth_users_exposed\#using-the-advisors)

In the dashboard, navigate to [Security Advisor](https://supabase.com/dashboard/project/_/database/security-advisor) and [Performance Advisor](https://supabase.com/dashboard/project/_/database/performance-advisor) under Database. The advisors run automatically. You can also manually rerun them after you've resolved issues.

## Available checks [\#](https://supabase.com/docs/guides/database/database-advisors?lint=0002_auth_users_exposed\#available-checks)

0001 unindexed foreign keys0002 auth users exposed0003 auth rls initplan0004 no primary key0005 unused index0006 multiple permissive policies0007 policy exists rls disabled0008 rls enabled no policy0009 duplicate index0010 security definer view0011 function search path mutable0012 auth allow anonymous sign ins0013 rls disabled in public0014 extension in public0015 rls references user metadata0016 materialized view in api0017 foreign table in api0018 unsupported reg types0019 insecure queue exposed in api0020 table bloat0021 fkey to auth unique0022 extension versions outdated

Level: ERROR

### Rationale [\#](https://supabase.com/docs/guides/database/database-advisors?lint=0002_auth_users_exposed\#rationale)

Referencing the `auth.users` table in a view can inadvertently expose more data than intended.

### Why shouldn't you expose auth.users with a view? [\#](https://supabase.com/docs/guides/database/database-advisors?lint=0002_auth_users_exposed\#why-shouldnt-you-expose-authusers-with-a-view)

`auth.users` is the primary table that backs Supabase Auth. It contains detailed information about each of your projects users, their login methods, and other personally identifiable information.

In Postgres, the built in mechanism for controlling access to rows within a table is row level security (RLS). By default, views in Postgres are "security definer" which means they do not respect RLS rules associated with the tables in the view's query. Materialized views similarly don't support RLS.

As a result, a `public` security definer view referencing `auth.users` exposes all user records to all API users, which is likely not what application developers intended.

### How to Resolve [\#](https://supabase.com/docs/guides/database/database-advisors?lint=0002_auth_users_exposed\#how-to-resolve)

There are 2 recommended solutions for exposing user data to your application.

#### Trigger on auth.users [\#](https://supabase.com/docs/guides/database/database-advisors?lint=0002_auth_users_exposed\#trigger-on-authusers)

This option involves creating a table in the public schema, e.g. `public.profiles`, containing a subset of columns from `auth.users` that are appropriate for your application's use case. You can then set a trigger on `auth.users` to automatically insert the relevant data into `public.profiles` any time a new user is inserted into `auth.users`.

Note that triggers execute in the same transaction as the insert into `auth.users` so you must check the trigger logic carefully as any errors could block user signups to your project.

An additional benefit of this approach is that the `public.profiles` table provides a logical place to store any additional user metadata that is needed for the application.

To start we need a location to store public user data in the `public` schema:

```flex

```

Next, we create a trigger function to copy the data from `auth.users` into `public.profiles` when new rows are inserted

```flex

```

Finally, we can create row level security policies on the `public.profiles` schema to restrict access to certain operations:

```flex

```

For more information on this approach see the [auth docs](https://supabase.com/docs/guides/auth/managing-user-data).

#### Security Invoker View with RLS on auth.users [\#](https://supabase.com/docs/guides/database/database-advisors?lint=0002_auth_users_exposed\#security-invoker-view-with-rls-on-authusers)

The second recommended approach to securely exposing `auth.users` data is to create a view with the configuration option `security_invoker=on`. That setting, introduced in Postgres 15, tells the view to respect the RLS policies associated with the underlying tables from the query. Next, we can enable RLS on `auth.users` and create any policy we need to restrict access to the data.

To enable security invoker mode on the view we can use the `with (security_invoker=on)` clause:

```flex

```

Next, grant permissions and enable RLS on `auth.users`:

```flex

```

and finally, create a policy defining which users should be able to see each record:

```flex

```

### Is this helpful?

NoYes

### On this page

[Using the Advisors](https://supabase.com/docs/guides/database/database-advisors?lint=0002_auth_users_exposed#using-the-advisors) [Available checks](https://supabase.com/docs/guides/database/database-advisors?lint=0002_auth_users_exposed#available-checks) [Rationale](https://supabase.com/docs/guides/database/database-advisors?lint=0002_auth_users_exposed#rationale) [Why shouldn't you expose auth.users with a view?](https://supabase.com/docs/guides/database/database-advisors?lint=0002_auth_users_exposed#why-shouldnt-you-expose-authusers-with-a-view) [How to Resolve](https://supabase.com/docs/guides/database/database-advisors?lint=0002_auth_users_exposed#how-to-resolve)
