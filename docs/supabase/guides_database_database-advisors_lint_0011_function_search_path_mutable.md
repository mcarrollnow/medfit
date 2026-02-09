---
library: supabase
url: https://supabase.com/docs/guides/database/database-advisors?lint=0011_function_search_path_mutable
title: Performance and Security Advisors | Supabase Docs
scraped: 2025-10-23T16:59:02.340Z
---

Database

# Performance and Security Advisors

## Check your database for performance and security issues

* * *

You can use the Database Performance and Security Advisors to check your database for issues such as missing indexes and improperly set-up RLS policies.

## Using the Advisors [\#](https://supabase.com/docs/guides/database/database-advisors?lint=0011_function_search_path_mutable\#using-the-advisors)

In the dashboard, navigate to [Security Advisor](https://supabase.com/dashboard/project/_/database/security-advisor) and [Performance Advisor](https://supabase.com/dashboard/project/_/database/performance-advisor) under Database. The advisors run automatically. You can also manually rerun them after you've resolved issues.

## Available checks [\#](https://supabase.com/docs/guides/database/database-advisors?lint=0011_function_search_path_mutable\#available-checks)

0001 unindexed foreign keys0002 auth users exposed0003 auth rls initplan0004 no primary key0005 unused index0006 multiple permissive policies0007 policy exists rls disabled0008 rls enabled no policy0009 duplicate index0010 security definer view0011 function search path mutable0012 auth allow anonymous sign ins0013 rls disabled in public0014 extension in public0015 rls references user metadata0016 materialized view in api0017 foreign table in api0018 unsupported reg types0019 insecure queue exposed in api0020 table bloat0021 fkey to auth unique0022 extension versions outdated

Level: WARN

### Rationale [\#](https://supabase.com/docs/guides/database/database-advisors?lint=0011_function_search_path_mutable\#rationale)

In PostgreSQL, the `search_path` determines the order in which schemas are searched to find unqualified objects (like tables, functions, etc.). Setting `search_path` explicitly for a function is a best practice that ensures its behavior is consistent and secure, regardless of the executing user's default `search_path` settings. We recommend pinning functions' `search_path` to an empty string, `search_path = ''`, which forces all references within the function's body to be fully qualified. This helps prevent unexpected behavior due to changes in the `search_path` and mitigates potential security vulnerabilities.

### What is the Search Path? [\#](https://supabase.com/docs/guides/database/database-advisors?lint=0011_function_search_path_mutable\#what-is-the-search-path)

The search path in PostgreSQL is a list of schema names that PostgreSQL checks when trying to resolve unqualified object names like `profiles`. In contrast, a fully qualified name includes the schema like `public.profiles`, and always resolves the same way, regardless of the user's `search_path`. By default, `search_path` includes the user's schema and the `public` schema. However, this can lead to unexpected behavior if different users have different `search_path` settings. Specifically, unqualified references will be resolved differently depending on who is executing the function.

### The Issue with Not Setting the Search Path in Functions [\#](https://supabase.com/docs/guides/database/database-advisors?lint=0011_function_search_path_mutable\#the-issue-with-not-setting-the-search-path-in-functions)

When a function does not have its `search_path` explicitly set, it inherits the `search_path` of the current session when it is invoked. This behavior can lead to several problems:

- **Inconsistency**: The function may behave differently depending on the user's `search_path` settings.
- **Security Risks**: Malicious users could potentially exploit the `search_path` to direct the function to use unexpected objects, such as tables or other functions, that the malicious user controls.

### How to Resolve [\#](https://supabase.com/docs/guides/database/database-advisors?lint=0011_function_search_path_mutable\#how-to-resolve)

To ensure that your functions are secure and behave consistently, set the search path explicitly to an empty string within the function's definition.

Given a function like:

```flex

```

You can `create or replace` the function and add the `search_path` setting.

```flex

```

Remember that once you set the `search_path = ''` all references to tables/functions/views/etc in your function's body must be qualified with a schema name.

### Is this helpful?

NoYes

### On this page

[Using the Advisors](https://supabase.com/docs/guides/database/database-advisors?lint=0011_function_search_path_mutable#using-the-advisors) [Available checks](https://supabase.com/docs/guides/database/database-advisors?lint=0011_function_search_path_mutable#available-checks) [Rationale](https://supabase.com/docs/guides/database/database-advisors?lint=0011_function_search_path_mutable#rationale) [What is the Search Path?](https://supabase.com/docs/guides/database/database-advisors?lint=0011_function_search_path_mutable#what-is-the-search-path) [The Issue with Not Setting the Search Path in Functions](https://supabase.com/docs/guides/database/database-advisors?lint=0011_function_search_path_mutable#the-issue-with-not-setting-the-search-path-in-functions) [How to Resolve](https://supabase.com/docs/guides/database/database-advisors?lint=0011_function_search_path_mutable#how-to-resolve)
