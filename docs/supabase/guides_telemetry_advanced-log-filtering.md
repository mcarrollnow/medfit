---
library: supabase
url: https://supabase.com/docs/guides/telemetry/advanced-log-filtering
title: Advanced Log Filtering | Supabase Docs
scraped: 2025-10-23T16:59:02.329Z
---

Telemetry

# Advanced Log Filtering

* * *

# Querying the logs

## Understanding field references [\#](https://supabase.com/docs/guides/telemetry/advanced-log-filtering\#understanding-field-references)

The log tables are queried with a subset of BigQuery SQL syntax. They all have three columns: `event_message`, `timestamp`, and `metadata`.

| column | description |
| --- | --- |
| timestamp | time event was recorded |
| event\_message | the log's message |
| metadata | information about the event |

The `metadata` column is an array of JSON objects that stores important details about each recorded event. For example, in the Postgres table, the `metadata.parsed.error_severity` field indicates the error level of an event. To work with its values, you need to `unnest` them using a `cross join`.

This approach is commonly used with JSON and array columns, so it might look a bit unfamiliar if you're not used to working with these data types.

```flex

```

## Expanding results [\#](https://supabase.com/docs/guides/telemetry/advanced-log-filtering\#expanding-results)

Logs returned by queries may be difficult to read in table format. A row can be double-clicked to expand the results into more readable JSON:

![Expanding log results](https://supabase.com/docs/img/guides/platform/expanded-log-results.png)

## Filtering with [regular expressions](https://en.wikipedia.org/wiki/Regular_expression) [\#](https://supabase.com/docs/guides/telemetry/advanced-log-filtering\#filtering-with-regular-expressions)

The Logs use BigQuery Style regular expressions with the [regexp\_contains function](https://cloud.google.com/bigquery/docs/reference/standard-sql/string_functions#regexp_contains). In its most basic form, it will check if a string is present in a specified column.

```flex

```

There are multiple operators that you should consider using:

### Find messages that start with a phrase [\#](https://supabase.com/docs/guides/telemetry/advanced-log-filtering\#find-messages-that-start-with-a-phrase)

`^` only looks for values at the start of a string

```flex

```

### Find messages that end with a phrase: [\#](https://supabase.com/docs/guides/telemetry/advanced-log-filtering\#find-messages-that-end-with-a-phrase)

`$` only looks for values at the end of the string

```flex

```

### Ignore case sensitivity: [\#](https://supabase.com/docs/guides/telemetry/advanced-log-filtering\#ignore-case-sensitivity)

`(?i)` ignores capitalization for all proceeding characters

```flex

```

### Wildcards: [\#](https://supabase.com/docs/guides/telemetry/advanced-log-filtering\#wildcards)

`.` can represent any string of characters

```flex

```

### Alphanumeric ranges: [\#](https://supabase.com/docs/guides/telemetry/advanced-log-filtering\#alphanumeric-ranges)

`[1-9a-zA-Z]` finds any strings with only numbers and letters

```flex

```

### Repeated values: [\#](https://supabase.com/docs/guides/telemetry/advanced-log-filtering\#repeated-values)

`x*` zero or more x
`x+` one or more x
`x?` zero or one x
`x{4,}` four or more x
`x{3}` exactly 3 x

```flex

```

### Escaping reserved characters: [\#](https://supabase.com/docs/guides/telemetry/advanced-log-filtering\#escaping-reserved-characters)

`\.` interpreted as period `.` instead of as a wildcard

```flex

```

### `or` statements: [\#](https://supabase.com/docs/guides/telemetry/advanced-log-filtering\#or-statements)

`x|y` any string with `x` or `y` present

```flex

```

### `and`/ `or`/ `not` statements in SQL: [\#](https://supabase.com/docs/guides/telemetry/advanced-log-filtering\#and--or--not-statements-in-sql)

`and`, `or`, and `not` are all native terms in SQL and can be used in conjunction with regular expressions to filter results

```flex

```

### Filtering and unnesting example [\#](https://supabase.com/docs/guides/telemetry/advanced-log-filtering\#filtering-and-unnesting-example)

**Filter for Postgres**

```flex

```

## Limitations [\#](https://supabase.com/docs/guides/telemetry/advanced-log-filtering\#limitations)

### Log tables cannot be joined together [\#](https://supabase.com/docs/guides/telemetry/advanced-log-filtering\#log-tables-cannot-be-joined-together)

Each product table operates independently without the ability to join with other log tables. This may change in the future.

### The `with` keyword and subqueries are not supported [\#](https://supabase.com/docs/guides/telemetry/advanced-log-filtering\#the-with-keyword-and-subqueries-are-not-supported)

The parser does not yet support `with` and subquery statements.

### The `ilike` and `similar to` keywords are not supported [\#](https://supabase.com/docs/guides/telemetry/advanced-log-filtering\#the-ilike-and-similar-to-keywords-are-not-supported)

Although `like` and other comparison operators can be used, `ilike` and `similar to` are incompatible with BigQuery's variant of SQL. `regexp_contains` can be used as an alternative.

### The wildcard operator `*` to select columns is not supported [\#](https://supabase.com/docs/guides/telemetry/advanced-log-filtering\#the-wildcard-operator--to-select-columns-is-not-supported)

The log parser is not able to parse the `*` operator for column selection. Instead, you can access all fields from the `metadata` column:

```flex

```

### Is this helpful?

NoYes

### On this page

[Understanding field references](https://supabase.com/docs/guides/telemetry/advanced-log-filtering#understanding-field-references) [Expanding results](https://supabase.com/docs/guides/telemetry/advanced-log-filtering#expanding-results) [Filtering with regular expressions](https://supabase.com/docs/guides/telemetry/advanced-log-filtering#https://en.wikipedia.org/wiki/Regular_expression) [Find messages that start with a phrase](https://supabase.com/docs/guides/telemetry/advanced-log-filtering#find-messages-that-start-with-a-phrase) [Find messages that end with a phrase:](https://supabase.com/docs/guides/telemetry/advanced-log-filtering#find-messages-that-end-with-a-phrase) [Ignore case sensitivity:](https://supabase.com/docs/guides/telemetry/advanced-log-filtering#ignore-case-sensitivity) [Wildcards:](https://supabase.com/docs/guides/telemetry/advanced-log-filtering#wildcards) [Alphanumeric ranges:](https://supabase.com/docs/guides/telemetry/advanced-log-filtering#alphanumeric-ranges) [Repeated values:](https://supabase.com/docs/guides/telemetry/advanced-log-filtering#repeated-values) [Escaping reserved characters:](https://supabase.com/docs/guides/telemetry/advanced-log-filtering#escaping-reserved-characters) [or statements:](https://supabase.com/docs/guides/telemetry/advanced-log-filtering#or-statements) [and/or/not statements in SQL:](https://supabase.com/docs/guides/telemetry/advanced-log-filtering#and--or--not-statements-in-sql) [Filtering and unnesting example](https://supabase.com/docs/guides/telemetry/advanced-log-filtering#filtering-and-unnesting-example) [Limitations](https://supabase.com/docs/guides/telemetry/advanced-log-filtering#limitations) [Log tables cannot be joined together](https://supabase.com/docs/guides/telemetry/advanced-log-filtering#log-tables-cannot-be-joined-together) [The with keyword and subqueries are not supported](https://supabase.com/docs/guides/telemetry/advanced-log-filtering#the-with-keyword-and-subqueries-are-not-supported) [The ilike and similar to keywords are not supported](https://supabase.com/docs/guides/telemetry/advanced-log-filtering#the-ilike-and-similar-to-keywords-are-not-supported) [The wildcard operator \* to select columns is not supported](https://supabase.com/docs/guides/telemetry/advanced-log-filtering#the-wildcard-operator--to-select-columns-is-not-supported)
