---
library: supabase
url: https://supabase.com/docs/guides/database/extensions/timescaledb
title: timescaledb: Time-Series data | Supabase Docs
scraped: 2025-10-23T16:59:02.334Z
---

Database

# timescaledb: Time-Series data

* * *

The `timescaledb` extension is deprecated in projects using Postgres 17. It continues to be supported in projects using Postgres 15, but will need to dropped before those projects are upgraded to Postgres 17. See the [Upgrading to Postgres 17 notes](https://supabase.com/docs/guides/platform/upgrading#upgrading-to-postgres-17) for more information.

[`timescaledb`](https://docs.timescale.com/timescaledb/latest/) is a Postgres extension designed for improved handling of time-series data. It provides a scalable, high-performance solution for storing and querying time-series data on top of a standard Postgres database.

`timescaledb` uses a time-series-aware storage model and indexing techniques to improve performance of Postgres in working with time-series data. The extension divides data into chunks based on time intervals, allowing it to scale efficiently, especially for large data sets. The data is then compressed, optimized for write-heavy workloads, and partitioned for parallel processing. `timescaledb` also includes a set of functions, operators, and indexes that work with time-series data to reduce query times, and make data easier to work with.

Supabase projects come with [TimescaleDB Apache 2 Edition](https://docs.timescale.com/about/latest/timescaledb-editions/#timescaledb-apache-2-edition). Functionality only available under the Community Edition is not available.

## Enable the extension [\#](https://supabase.com/docs/guides/database/extensions/timescaledb\#enable-the-extension)

DashboardSQL

1. Go to the [Database](https://supabase.com/dashboard/project/_/database/tables) page in the Dashboard.
2. Click on **Extensions** in the sidebar.
3. Search for `timescaledb` and enable the extension.

Even though the SQL code is `create extension`, this is the equivalent of "enabling the extension". To disable an extension you can call `drop extension`.

It's good practice to create the extension within a separate schema (like `extensions`) to keep your `public` schema clean.

## Usage [\#](https://supabase.com/docs/guides/database/extensions/timescaledb\#usage)

To demonstrate how `timescaledb` works, let's consider a simple example where we have a table that stores temperature data from different sensors. We will create a table named "temperatures" and store data for two sensors.

First we create a hypertable, which is a virtual table that is partitioned into chunks based on time intervals. The hypertable acts as a proxy for the actual table and makes it easy to query and manage time-series data.

```flex

```

Next, we can populate some values

```flex

```

And finally we can query the table using `timescaledb`'s `time_bucket` function to divide the time-series into intervals of the specified size (in this case, 1 hour) averaging the `temperature` reading within each group.

```flex

```

## Resources [\#](https://supabase.com/docs/guides/database/extensions/timescaledb\#resources)

- Official [`timescaledb` documentation](https://docs.timescale.com/timescaledb/latest/)

### Is this helpful?

NoYes

### On this page

[Enable the extension](https://supabase.com/docs/guides/database/extensions/timescaledb#enable-the-extension) [Usage](https://supabase.com/docs/guides/database/extensions/timescaledb#usage) [Resources](https://supabase.com/docs/guides/database/extensions/timescaledb#resources)
