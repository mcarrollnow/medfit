---
library: supabase
url: https://supabase.com/docs/guides/database/database-advisors?lint=0007_policy_exists_rls_disabled
title: Performance and Security Advisors | Supabase Docs
scraped: 2025-10-23T16:59:02.345Z
---

Database

# Performance and Security Advisors

## Check your database for performance and security issues

* * *

You can use the Database Performance and Security Advisors to check your database for issues such as missing indexes and improperly set-up RLS policies.

## Using the Advisors [\#](https://supabase.com/docs/guides/database/database-advisors?lint=0007_policy_exists_rls_disabled\#using-the-advisors)

In the dashboard, navigate to [Security Advisor](https://supabase.com/dashboard/project/_/database/security-advisor) and [Performance Advisor](https://supabase.com/dashboard/project/_/database/performance-advisor) under Database. The advisors run automatically. You can also manually rerun them after you've resolved issues.

## Available checks [\#](https://supabase.com/docs/guides/database/database-advisors?lint=0007_policy_exists_rls_disabled\#available-checks)

0001 unindexed foreign keys0002 auth users exposed0003 auth rls initplan0004 no primary key0005 unused index0006 multiple permissive policies0007 policy exists rls disabled0008 rls enabled no policy0009 duplicate index0010 security definer view0011 function search path mutable0012 auth allow anonymous sign ins0013 rls disabled in public0014 extension in public0015 rls references user metadata0016 materialized view in api0017 foreign table in api0018 unsupported reg types0019 insecure queue exposed in api0020 table bloat0021 fkey to auth unique0022 extension versions outdated

Level: INFO

### Rationale [\#](https://supabase.com/docs/guides/database/database-advisors?lint=0007_policy_exists_rls_disabled\#rationale)

In Postgres, Row Level Security (RLS) policies control access to rows in a table based on the executing user. Policies can be created, but will not be enforced until the table is updated to enable row level security. Failing to enable row level security is a common misconfiguration that can lead to data leaks.

### How to Resolve [\#](https://supabase.com/docs/guides/database/database-advisors?lint=0007_policy_exists_rls_disabled\#how-to-resolve)

To enable existing policies on a table execute:

```flex

```

### Example [\#](https://supabase.com/docs/guides/database/database-advisors?lint=0007_policy_exists_rls_disabled\#example)

Given the schema:

```flex

```

A user may incorrectly believe that their policies are being applied. Before the policies will take effect, we first must enable row level security on the underlying table.

```flex

```

### Is this helpful?

NoYes

### On this page

[Using the Advisors](https://supabase.com/docs/guides/database/database-advisors?lint=0007_policy_exists_rls_disabled#using-the-advisors) [Available checks](https://supabase.com/docs/guides/database/database-advisors?lint=0007_policy_exists_rls_disabled#available-checks) [Rationale](https://supabase.com/docs/guides/database/database-advisors?lint=0007_policy_exists_rls_disabled#rationale) [How to Resolve](https://supabase.com/docs/guides/database/database-advisors?lint=0007_policy_exists_rls_disabled#how-to-resolve) [Example](https://supabase.com/docs/guides/database/database-advisors?lint=0007_policy_exists_rls_disabled#example)
