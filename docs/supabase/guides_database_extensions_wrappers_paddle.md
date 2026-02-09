---
library: supabase
url: https://supabase.com/docs/guides/database/extensions/wrappers/paddle
title: Paddle | Supabase Docs
scraped: 2025-10-23T16:59:02.330Z
---

Database

# Paddle

* * *

You can enable the Paddle wrapper right from the Supabase dashboard.

[Open wrapper in dashboard](https://supabase.com/dashboard/project/_/integrations/paddle_wrapper/overview)

[Paddle](https://www.paddle.com/) is a merchant of record that acts to provide a payment infrastructure to thousands of software companies around the world.

The Paddle Wrapper is a WebAssembly(Wasm) foreign data wrapper which allows you to read and write data from Paddle within your Postgres database.

## Available Versions [\#](https://supabase.com/docs/guides/database/extensions/wrappers/paddle\#available-versions)

| Version | Wasm Package URL | Checksum | Required Wrappers Version |
| --- | --- | --- | --- |
| 0.2.0 | `https://github.com/supabase/wrappers/releases/download/wasm_paddle_fdw_v0.2.0/paddle_fdw.wasm` | `e788b29ae46c158643e1e1f229d94b28a9af8edbd3233f59c5a79053c25da213` | >=0.5.0 |
| 0.1.1 | `https://github.com/supabase/wrappers/releases/download/wasm_paddle_fdw_v0.1.1/paddle_fdw.wasm` | `c5ac70bb2eef33693787b7d4efce9a83cde8d4fa40889d2037403a51263ba657` | >=0.4.0 |
| 0.1.0 | `https://github.com/supabase/wrappers/releases/download/wasm_paddle_fdw_v0.1.0/paddle_fdw.wasm` | `7d0b902440ac2ef1af85d09807145247f14d1d8fd4d700227e5a4d84c8145409` | >=0.4.0 |

## Preparation [\#](https://supabase.com/docs/guides/database/extensions/wrappers/paddle\#preparation)

Before you can query Paddle, you need to enable the Wrappers extension and store your credentials in Postgres.

### Enable Wrappers [\#](https://supabase.com/docs/guides/database/extensions/wrappers/paddle\#enable-wrappers)

Make sure the `wrappers` extension is installed on your database:

```flex

```

### Enable the Paddle Wrapper [\#](https://supabase.com/docs/guides/database/extensions/wrappers/paddle\#enable-the-paddle-wrapper)

Enable the Wasm foreign data wrapper:

```flex

```

### Store your credentials (optional) [\#](https://supabase.com/docs/guides/database/extensions/wrappers/paddle\#store-your-credentials-optional)

By default, Postgres stores FDW credentials inside `pg_catalog.pg_foreign_server` in plain text. Anyone with access to this table will be able to view these credentials. Wrappers is designed to work with [Vault](https://supabase.com/docs/guides/database/vault), which provides an additional level of security for storing credentials. We recommend using Vault to store your credentials.

```flex

```

### Connecting to Paddle [\#](https://supabase.com/docs/guides/database/extensions/wrappers/paddle\#connecting-to-paddle)

We need to provide Postgres with the credentials to access Paddle, and any additional options. We can do this using the `create server` command:

With VaultWithout Vault

```flex

```

Note the `fdw_package_*` options are required, which specify the Wasm package metadata. You can get the available package version list from [above](https://supabase.com/docs/guides/database/extensions/wrappers/paddle#available-versions).

### Create a schema [\#](https://supabase.com/docs/guides/database/extensions/wrappers/paddle\#create-a-schema)

We recommend creating a schema to hold all the foreign tables:

```flex

```

## Options [\#](https://supabase.com/docs/guides/database/extensions/wrappers/paddle\#options)

The full list of foreign table options are below:

- `object` \- Object name in Paddle, required.

Supported objects are listed below:

| Object |
| --- |
| products |
| prices |
| discounts |
| customers |
| transactions |
| reports |
| notification-settings |
| notifications |

- `rowid_column` \- Primary key column name, optional for data scan, required for data modify

## Entities [\#](https://supabase.com/docs/guides/database/extensions/wrappers/paddle\#entities)

We can use SQL [import foreign schema](https://www.postgresql.org/docs/current/sql-importforeignschema.html) to import foreign table definitions from Paddle.

For example, using below SQL can automatically create foreign tables in the `paddle` schema.

```flex

```

### Products [\#](https://supabase.com/docs/guides/database/extensions/wrappers/paddle\#products)

This is an object representing Paddle Products.

Ref: [Paddle API docs](https://developer.paddle.com/api-reference/about/data-types)

#### Operations [\#](https://supabase.com/docs/guides/database/extensions/wrappers/paddle\#operations)

| Object | Select | Insert | Update | Delete | Truncate |
| --- | :-: | :-: | :-: | :-: | :-: |
| Products | ✅ | ✅ | ✅ | ❌ | ❌ |

#### Usage [\#](https://supabase.com/docs/guides/database/extensions/wrappers/paddle\#usage)

```flex

```

#### Notes [\#](https://supabase.com/docs/guides/database/extensions/wrappers/paddle\#notes)

- Requires `rowid_column` option for data modification operations
- Query pushdown supported for `id` column
- Product type can be extracted using: `attrs->>'type'`

### Customers [\#](https://supabase.com/docs/guides/database/extensions/wrappers/paddle\#customers)

This is an object representing Paddle Customers.

Ref: [Paddle API docs](https://developer.paddle.com/api-reference/about/data-types)

#### Operations [\#](https://supabase.com/docs/guides/database/extensions/wrappers/paddle\#operations-1)

| Object | Select | Insert | Update | Delete | Truncate |
| --- | :-: | :-: | :-: | :-: | :-: |
| Customers | ✅ | ✅ | ✅ | ❌ | ❌ |

#### Usage [\#](https://supabase.com/docs/guides/database/extensions/wrappers/paddle\#usage-1)

```flex

```

#### Notes [\#](https://supabase.com/docs/guides/database/extensions/wrappers/paddle\#notes-1)

- Requires `rowid_column` option for data modification operations
- Query pushdown supported for `id` column
- Custom data stored in dedicated `custom_data` column

### Subscriptions [\#](https://supabase.com/docs/guides/database/extensions/wrappers/paddle\#subscriptions)

This is an object representing Paddle Subscriptions.

Ref: [Paddle API docs](https://developer.paddle.com/api-reference/about/data-types)

#### Operations [\#](https://supabase.com/docs/guides/database/extensions/wrappers/paddle\#operations-2)

| Object | Select | Insert | Update | Delete | Truncate |
| --- | :-: | :-: | :-: | :-: | :-: |
| Subscriptions | ✅ | ✅ | ✅ | ❌ | ❌ |

#### Usage [\#](https://supabase.com/docs/guides/database/extensions/wrappers/paddle\#usage-2)

```flex

```

#### Notes [\#](https://supabase.com/docs/guides/database/extensions/wrappers/paddle\#notes-2)

- Requires `rowid_column` option for data modification operations
- Query pushdown supported for `id` column
- Subscription items status can be extracted using: `attrs#>'{items,status}'`

## Query Pushdown Support [\#](https://supabase.com/docs/guides/database/extensions/wrappers/paddle\#query-pushdown-support)

This FDW supports `where` clause pushdown with `id` as the filter. For example,

```flex

```

## Supported Data Types [\#](https://supabase.com/docs/guides/database/extensions/wrappers/paddle\#supported-data-types)

| Postgres Data Type | Paddle Data Type |
| --- | --- |
| boolean | Boolean |
| smallint | Money |
| integer | Money |
| bigint | Money |
| real | Money |
| double precision | Money |
| numeric | Money |
| text | Text |
| date | Dates and time |
| timestamp | Dates and time |
| timestamptz | Dates and time |

The Paddle API uses JSON formatted data, please refer to [Paddle docs](https://developer.paddle.com/api-reference/about/data-types) for more details.

## Limitations [\#](https://supabase.com/docs/guides/database/extensions/wrappers/paddle\#limitations)

This section describes important limitations and considerations when using this FDW:

- Query pushdown is only supported for the `id` column, resulting in full table scans for other filters
- Large result sets may experience slower performance due to full data transfer requirement
- Materialized views using these foreign tables may fail during logical backups

## Examples [\#](https://supabase.com/docs/guides/database/extensions/wrappers/paddle\#examples)

### Basic Example [\#](https://supabase.com/docs/guides/database/extensions/wrappers/paddle\#basic-example)

This example will create a "foreign table" inside your Postgres database and query its data.

```flex

```

`attrs` is a special column which stores all the object attributes in JSON format, you can extract any attributes needed or its associated sub objects from it. See more examples below.

### Query JSON Attributes [\#](https://supabase.com/docs/guides/database/extensions/wrappers/paddle\#query-json-attributes)

```flex

```

### Data Modify Example [\#](https://supabase.com/docs/guides/database/extensions/wrappers/paddle\#data-modify-example)

This example will modify data in a "foreign table" inside your Postgres database, note that `rowid_column` option is mandatory for data modify:

```flex

```

### Is this helpful?

NoYes

### On this page

[Available Versions](https://supabase.com/docs/guides/database/extensions/wrappers/paddle#available-versions) [Preparation](https://supabase.com/docs/guides/database/extensions/wrappers/paddle#preparation) [Enable Wrappers](https://supabase.com/docs/guides/database/extensions/wrappers/paddle#enable-wrappers) [Enable the Paddle Wrapper](https://supabase.com/docs/guides/database/extensions/wrappers/paddle#enable-the-paddle-wrapper) [Store your credentials (optional)](https://supabase.com/docs/guides/database/extensions/wrappers/paddle#store-your-credentials-optional) [Connecting to Paddle](https://supabase.com/docs/guides/database/extensions/wrappers/paddle#connecting-to-paddle) [Create a schema](https://supabase.com/docs/guides/database/extensions/wrappers/paddle#create-a-schema) [Options](https://supabase.com/docs/guides/database/extensions/wrappers/paddle#options) [Entities](https://supabase.com/docs/guides/database/extensions/wrappers/paddle#entities) [Products](https://supabase.com/docs/guides/database/extensions/wrappers/paddle#products) [Customers](https://supabase.com/docs/guides/database/extensions/wrappers/paddle#customers) [Subscriptions](https://supabase.com/docs/guides/database/extensions/wrappers/paddle#subscriptions) [Query Pushdown Support](https://supabase.com/docs/guides/database/extensions/wrappers/paddle#query-pushdown-support) [Supported Data Types](https://supabase.com/docs/guides/database/extensions/wrappers/paddle#supported-data-types) [Limitations](https://supabase.com/docs/guides/database/extensions/wrappers/paddle#limitations) [Examples](https://supabase.com/docs/guides/database/extensions/wrappers/paddle#examples) [Basic Example](https://supabase.com/docs/guides/database/extensions/wrappers/paddle#basic-example) [Query JSON Attributes](https://supabase.com/docs/guides/database/extensions/wrappers/paddle#query-json-attributes) [Data Modify Example](https://supabase.com/docs/guides/database/extensions/wrappers/paddle#data-modify-example)
