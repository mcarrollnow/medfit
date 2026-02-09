---
library: supabase
url: https://supabase.com/docs/guides/database/extensions/wrappers/snowflake
title: Snowflake | Supabase Docs
scraped: 2025-10-23T16:59:02.326Z
---

Database

# Snowflake

* * *

You can enable the Snowflake wrapper right from the Supabase dashboard.

[Open wrapper in dashboard](https://supabase.com/dashboard/project/_/integrations/snowflake_wrapper/overview)

[Snowflake](https://www.snowflake.com/) is a cloud-based data platform provided as a DaaS (Data-as-a-Service) solution with data storage and analytics service.

The Snowflake Wrapper is a WebAssembly(Wasm) foreign data wrapper which allows you to read and write data from Snowflake within your Postgres database.

## Available Versions [\#](https://supabase.com/docs/guides/database/extensions/wrappers/snowflake\#available-versions)

| Version | Wasm Package URL | Checksum | Required Wrappers Version |
| --- | --- | --- | --- |
| 0.2.0 | `https://github.com/supabase/wrappers/releases/download/wasm_snowflake_fdw_v0.2.0/snowflake_fdw.wasm` | `921b18a1e9c20c4ef5a09af17b5d76fd6ebe56d41bcfa565b74a530420532437` | >=0.5.0 |
| 0.1.1 | `https://github.com/supabase/wrappers/releases/download/wasm_snowflake_fdw_v0.1.1/snowflake_fdw.wasm` | `7aaafc7edc1726bc93ddc04452d41bda9e1a264a1df2ea9bf1b00b267543b860` | >=0.4.0 |
| 0.1.0 | `https://github.com/supabase/wrappers/releases/download/wasm_snowflake_fdw_v0.1.0/snowflake_fdw.wasm` | `2fb46fd8afa63f3975dadf772338106b609b131861849356e0c09dde032d1af8` | >=0.4.0 |

## Preparation [\#](https://supabase.com/docs/guides/database/extensions/wrappers/snowflake\#preparation)

Before you can query Snowflake, you need to enable the Wrappers extension and store your credentials in Postgres.

### Enable Wrappers [\#](https://supabase.com/docs/guides/database/extensions/wrappers/snowflake\#enable-wrappers)

Make sure the `wrappers` extension is installed on your database:

```flex

```

### Enable the Snowflake Wrapper [\#](https://supabase.com/docs/guides/database/extensions/wrappers/snowflake\#enable-the-snowflake-wrapper)

Enable the Wasm foreign data wrapper:

```flex

```

### Store your credentials (optional) [\#](https://supabase.com/docs/guides/database/extensions/wrappers/snowflake\#store-your-credentials-optional)

By default, Postgres stores FDW credentials inside `pg_catalog.pg_foreign_server` in plain text. Anyone with access to this table will be able to view these credentials. Wrappers is designed to work with [Vault](https://supabase.com/docs/guides/database/vault), which provides an additional level of security for storing credentials. We recommend using Vault to store your credentials.

This FDW uses key-pair authentication to access Snowflake SQL Rest API, please refer to [Snowflake docs](https://docs.snowflake.com/en/developer-guide/sql-api/authenticating#label-sql-api-authenticating-key-pair) for more details about the key-pair authentication.

```flex

```

### Connecting to Snowflake [\#](https://supabase.com/docs/guides/database/extensions/wrappers/snowflake\#connecting-to-snowflake)

We need to provide Postgres with the credentials to connect to Snowflake, and any additional options. We can do this using the `create server` command:

With VaultWithout Vault

```flex

```

Note the `fdw_package_*` options are required, which specify the Wasm package metadata. You can get the available package version list from [above](https://supabase.com/docs/guides/database/extensions/wrappers/snowflake#available-versions).

### Create a schema [\#](https://supabase.com/docs/guides/database/extensions/wrappers/snowflake\#create-a-schema)

We recommend creating a schema to hold all the foreign tables:

```flex

```

## Options [\#](https://supabase.com/docs/guides/database/extensions/wrappers/snowflake\#options)

The full list of foreign table options are below:

- `table` \- Source table or view name in Snowflake, required.

This option can also be a subquery enclosed in parentheses.

- `rowid_column` \- Primary key column name, optional for data scan, required for data modify


## Entities [\#](https://supabase.com/docs/guides/database/extensions/wrappers/snowflake\#entities)

### Snowflake Tables/Views [\#](https://supabase.com/docs/guides/database/extensions/wrappers/snowflake\#snowflake-tablesviews)

This is an object representing a Snowflake table or view.

Ref: [Snowflake docs](https://docs.snowflake.com/en/sql-reference/sql/create-table)

#### Operations [\#](https://supabase.com/docs/guides/database/extensions/wrappers/snowflake\#operations)

| Object | Select | Insert | Update | Delete | Truncate |
| --- | :-: | :-: | :-: | :-: | :-: |
| table/view | ✅ | ✅ | ✅ | ✅ | ❌ |

#### Usage [\#](https://supabase.com/docs/guides/database/extensions/wrappers/snowflake\#usage)

```flex

```

#### Notes [\#](https://supabase.com/docs/guides/database/extensions/wrappers/snowflake\#notes)

- Supports both tables and views as data sources
- Can use subqueries in `table` option
- Requires `rowid_column` for data modification operations
- Supports query pushdown for `where`, `order by`, and `limit` clauses
- Column names must match between Snowflake and foreign table
- Data types must be compatible according to type mapping table

## Query Pushdown Support [\#](https://supabase.com/docs/guides/database/extensions/wrappers/snowflake\#query-pushdown-support)

This FDW supports `where`, `order by` and `limit` clause pushdown.

## Supported Data Types [\#](https://supabase.com/docs/guides/database/extensions/wrappers/snowflake\#supported-data-types)

| Postgres Data Type | Snowflake Data Type |
| --- | --- |
| boolean | BOOLEAN |
| smallint | SMALLINT |
| integer | INT |
| bigint | BIGINT |
| real | FLOAT4 |
| double precision | FLOAT8 |
| numeric | NUMBER |
| text | VARCHAR |
| date | DATE |
| timestamp | TIMESTAMP\_NTZ |
| timestamptz | TIMESTAMP\_TZ |

## Limitations [\#](https://supabase.com/docs/guides/database/extensions/wrappers/snowflake\#limitations)

This section describes important limitations and considerations when using this FDW:

- Large result sets may experience slower performance due to full data transfer requirement
- Column names must exactly match between Snowflake and foreign table
- Foreign tables with subquery option cannot support data modify
- Materialized views using these foreign tables may fail during logical backups

## Examples [\#](https://supabase.com/docs/guides/database/extensions/wrappers/snowflake\#examples)

### Basic Example [\#](https://supabase.com/docs/guides/database/extensions/wrappers/snowflake\#basic-example)

Let's prepare the source table in Snowflake first:

```flex

```

This example will create a "foreign table" inside your Postgres database and query its data.

```flex

```

### Data Modify Example [\#](https://supabase.com/docs/guides/database/extensions/wrappers/snowflake\#data-modify-example)

This example will modify data in a "foreign table" inside your Postgres database, note that `rowid_column` option is required for data modify:

```flex

```

### Is this helpful?

NoYes

### On this page

[Available Versions](https://supabase.com/docs/guides/database/extensions/wrappers/snowflake#available-versions) [Preparation](https://supabase.com/docs/guides/database/extensions/wrappers/snowflake#preparation) [Enable Wrappers](https://supabase.com/docs/guides/database/extensions/wrappers/snowflake#enable-wrappers) [Enable the Snowflake Wrapper](https://supabase.com/docs/guides/database/extensions/wrappers/snowflake#enable-the-snowflake-wrapper) [Store your credentials (optional)](https://supabase.com/docs/guides/database/extensions/wrappers/snowflake#store-your-credentials-optional) [Connecting to Snowflake](https://supabase.com/docs/guides/database/extensions/wrappers/snowflake#connecting-to-snowflake) [Create a schema](https://supabase.com/docs/guides/database/extensions/wrappers/snowflake#create-a-schema) [Options](https://supabase.com/docs/guides/database/extensions/wrappers/snowflake#options) [Entities](https://supabase.com/docs/guides/database/extensions/wrappers/snowflake#entities) [Snowflake Tables/Views](https://supabase.com/docs/guides/database/extensions/wrappers/snowflake#snowflake-tablesviews) [Query Pushdown Support](https://supabase.com/docs/guides/database/extensions/wrappers/snowflake#query-pushdown-support) [Supported Data Types](https://supabase.com/docs/guides/database/extensions/wrappers/snowflake#supported-data-types) [Limitations](https://supabase.com/docs/guides/database/extensions/wrappers/snowflake#limitations) [Examples](https://supabase.com/docs/guides/database/extensions/wrappers/snowflake#examples) [Basic Example](https://supabase.com/docs/guides/database/extensions/wrappers/snowflake#basic-example) [Data Modify Example](https://supabase.com/docs/guides/database/extensions/wrappers/snowflake#data-modify-example)
