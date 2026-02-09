---
library: supabase
url: https://supabase.com/docs/guides/database/debugging-performance
title: Debugging performance issues | Supabase Docs
scraped: 2025-10-23T16:59:02.341Z
---

Database

# Debugging performance issues

## Debug slow-running queries using the Postgres execution planner.

* * *

`explain()` is a method that provides the Postgres `EXPLAIN` execution plan of a query. It is a powerful tool for debugging slow queries and understanding how Postgres will execute a given query. This feature is applicable to any query, including those made through `rpc()` or write operations.

## Enabling `explain()` [\#](https://supabase.com/docs/guides/database/debugging-performance\#enabling-explain)

`explain()` is disabled by default to protect sensitive information about your database structure and operations. We recommend using `explain()` in a non-production environment. Run the following SQL to enable `explain()`:

```flex

```

## Using `explain()` [\#](https://supabase.com/docs/guides/database/debugging-performance\#using-explain)

To get the execution plan of a query, you can chain the `explain()` method to a Supabase query:

```flex

```

### Example data [\#](https://supabase.com/docs/guides/database/debugging-performance\#example-data)

To illustrate, consider the following setup of a `instruments` table:

```flex

```

### Expected response [\#](https://supabase.com/docs/guides/database/debugging-performance\#expected-response)

The response would typically look like this:

```flex

```

By default, the execution plan is returned in TEXT format. However, you can also retrieve it as JSON by specifying the `format` parameter.

## Production use with pre-request protection [\#](https://supabase.com/docs/guides/database/debugging-performance\#production-use-with-pre-request-protection)

If you need to enable `explain()` in a production environment, ensure you protect your database by restricting access to the `explain()` feature. You can do so by using a pre-request function that filters requests based on the IP address:

```flex

```

Replace `'123.123.123.123'` with your actual IP address.

## Disabling explain [\#](https://supabase.com/docs/guides/database/debugging-performance\#disabling-explain)

To disable the `explain()` method after use, execute the following SQL commands:

```flex

```

### Is this helpful?

NoYes

### On this page

[Enabling explain()](https://supabase.com/docs/guides/database/debugging-performance#enabling-explain) [Using explain()](https://supabase.com/docs/guides/database/debugging-performance#using-explain) [Example data](https://supabase.com/docs/guides/database/debugging-performance#example-data) [Expected response](https://supabase.com/docs/guides/database/debugging-performance#expected-response) [Production use with pre-request protection](https://supabase.com/docs/guides/database/debugging-performance#production-use-with-pre-request-protection) [Disabling explain](https://supabase.com/docs/guides/database/debugging-performance#disabling-explain)
