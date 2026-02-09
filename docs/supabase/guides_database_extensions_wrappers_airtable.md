---
library: supabase
url: https://supabase.com/docs/guides/database/extensions/wrappers/airtable
title: Airtable | Supabase Docs
scraped: 2025-10-23T16:59:02.342Z
---

Database

# Airtable

* * *

You can enable the Airtable wrapper right from the Supabase dashboard.

[Open wrapper in dashboard](https://supabase.com/dashboard/project/_/integrations/airtable_wrapper/overview)

[Airtable](https://www.airtable.com/) is an easy-to-use online platform for creating and sharing relational databases.

The Airtable Wrapper allows you to read data from your Airtable bases/tables within your Postgres database.

## Preparation [\#](https://supabase.com/docs/guides/database/extensions/wrappers/airtable\#preparation)

Before you can query Airtable, you need to enable the Wrappers extension and store your credentials in Postgres.

### Enable Wrappers [\#](https://supabase.com/docs/guides/database/extensions/wrappers/airtable\#enable-wrappers)

Make sure the `wrappers` extension is installed on your database:

```flex

```

### Enable the Airtable Wrapper [\#](https://supabase.com/docs/guides/database/extensions/wrappers/airtable\#enable-the-airtable-wrapper)

Enable the `airtable_wrapper` FDW:

```flex

```

### Store your credentials (optional) [\#](https://supabase.com/docs/guides/database/extensions/wrappers/airtable\#store-your-credentials-optional)

By default, Postgres stores FDW credentials inside `pg_catalog.pg_foreign_server` in plain text. Anyone with access to this table will be able to view these credentials. Wrappers is designed to work with [Vault](https://supabase.com/docs/guides/database/vault), which provides an additional level of security for storing credentials. We recommend using Vault to store your credentials.

Get your token from [Airtable's developer portal](https://airtable.com/create/tokens).

```flex

```

### Connecting to Airtable [\#](https://supabase.com/docs/guides/database/extensions/wrappers/airtable\#connecting-to-airtable)

We need to provide Postgres with the credentials to connect to Airtable, and any additional options. We can do this using the `create server` command:

With VaultWithout Vault

```flex

```

### Create a schema [\#](https://supabase.com/docs/guides/database/extensions/wrappers/airtable\#create-a-schema)

We recommend creating a schema to hold all the foreign tables:

```flex

```

## Entities [\#](https://supabase.com/docs/guides/database/extensions/wrappers/airtable\#entities)

The Airtable Wrapper supports data reads from the Airtable API.

### Records [\#](https://supabase.com/docs/guides/database/extensions/wrappers/airtable\#records)

The Airtable Wrapper supports data reads from Airtable's [Records](https://airtable.com/developers/web/api/list-records) endpoint ( _read only_).

#### Operations [\#](https://supabase.com/docs/guides/database/extensions/wrappers/airtable\#operations)

| Object | Select | Insert | Update | Delete | Truncate |
| --- | :-: | :-: | :-: | :-: | :-: |
| Records | ✅ | ❌ | ❌ | ❌ | ❌ |

#### Usage [\#](https://supabase.com/docs/guides/database/extensions/wrappers/airtable\#usage)

Get your base ID and table ID from your table's URL.

![airtable_credentials](https://raw.githubusercontent.com/supabase/wrappers/docs_v0.5.3-1/docs/assets/airtable_credentials.png)

Foreign tables must be lowercase, regardless of capitalization in Airtable.

```flex

```

#### Notes [\#](https://supabase.com/docs/guides/database/extensions/wrappers/airtable\#notes)

- The table requires both `base_id` and `table_id` options
- Optional `view_id` can be specified to query a specific view

## Query Pushdown Support [\#](https://supabase.com/docs/guides/database/extensions/wrappers/airtable\#query-pushdown-support)

This FDW doesn't support query pushdown.

## Supported Data Types [\#](https://supabase.com/docs/guides/database/extensions/wrappers/airtable\#supported-data-types)

| Postgres Data Type | Airtable Data Type |
| --- | --- |
| boolean | Checkbox |
| smallint | Number |
| integer | Number |
| bigint | Autonumber |
| bigint | Number |
| real | Number |
| double precision | Number |
| numeric | Number |
| numeric | Currency |
| numeric | Percent |
| text | Single line text |
| text | Long text |
| text | Single select |
| text | Phone number |
| text | Email |
| text | URL |
| date | Date |
| timestamp | Created time |
| timestamp | Last modified time |
| jsonb | Multiple select |
| jsonb | Created by |
| jsonb | Last modified by |
| jsonb | User |

## Limitations [\#](https://supabase.com/docs/guides/database/extensions/wrappers/airtable\#limitations)

This section describes important limitations and considerations when using this FDW:

- No query pushdown support, all filtering must be done locally
- Large result sets may experience slower performance due to full data transfer requirement
- No support for Airtable formulas or computed fields
- Views must be pre-configured in Airtable
- No support for Airtable's block features
- Materialized views using these foreign tables may fail during logical backups

## Examples [\#](https://supabase.com/docs/guides/database/extensions/wrappers/airtable\#examples)

### Query an Airtable table [\#](https://supabase.com/docs/guides/database/extensions/wrappers/airtable\#query-an-airtable-table)

This will create a "foreign table" inside your Postgres database called `airtable_table`:

```flex

```

You can now fetch your Airtable data from within your Postgres database:

```flex

```

### Query an Airtable view [\#](https://supabase.com/docs/guides/database/extensions/wrappers/airtable\#query-an-airtable-view)

We can also create a foreign table from an Airtable View called `airtable_view`:

```flex

```

You can now fetch your Airtable data from within your Postgres database:

```flex

```

### Is this helpful?

NoYes

### On this page

[Preparation](https://supabase.com/docs/guides/database/extensions/wrappers/airtable#preparation) [Enable Wrappers](https://supabase.com/docs/guides/database/extensions/wrappers/airtable#enable-wrappers) [Enable the Airtable Wrapper](https://supabase.com/docs/guides/database/extensions/wrappers/airtable#enable-the-airtable-wrapper) [Store your credentials (optional)](https://supabase.com/docs/guides/database/extensions/wrappers/airtable#store-your-credentials-optional) [Connecting to Airtable](https://supabase.com/docs/guides/database/extensions/wrappers/airtable#connecting-to-airtable) [Create a schema](https://supabase.com/docs/guides/database/extensions/wrappers/airtable#create-a-schema) [Entities](https://supabase.com/docs/guides/database/extensions/wrappers/airtable#entities) [Records](https://supabase.com/docs/guides/database/extensions/wrappers/airtable#records) [Query Pushdown Support](https://supabase.com/docs/guides/database/extensions/wrappers/airtable#query-pushdown-support) [Supported Data Types](https://supabase.com/docs/guides/database/extensions/wrappers/airtable#supported-data-types) [Limitations](https://supabase.com/docs/guides/database/extensions/wrappers/airtable#limitations) [Examples](https://supabase.com/docs/guides/database/extensions/wrappers/airtable#examples) [Query an Airtable table](https://supabase.com/docs/guides/database/extensions/wrappers/airtable#query-an-airtable-table) [Query an Airtable view](https://supabase.com/docs/guides/database/extensions/wrappers/airtable#query-an-airtable-view)
