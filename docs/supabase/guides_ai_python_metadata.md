---
library: supabase
url: https://supabase.com/docs/guides/ai/python/metadata
title: Metadata | Supabase Docs
scraped: 2025-10-23T16:59:02.334Z
---

AI & Vectors

# Metadata

* * *

vecs allows you to associate key-value pairs of metadata with indexes and ids in your collections.
You can then add filters to queries that reference the metadata metadata.

## Types [\#](https://supabase.com/docs/guides/ai/python/metadata\#types)

Metadata is stored as binary JSON. As a result, allowed metadata types are drawn from JSON primitive types.

- Boolean
- String
- Number

The technical limit of a metadata field associated with a vector is 1GB.
In practice you should keep metadata fields as small as possible to maximize performance.

## Metadata Query Language [\#](https://supabase.com/docs/guides/ai/python/metadata\#metadata-query-language)

The metadata query language is based loosely on [mongodb's selectors](https://www.mongodb.com/docs/manual/reference/operator/query/).

`vecs` currently supports a subset of those operators.

### Comparison Operators [\#](https://supabase.com/docs/guides/ai/python/metadata\#comparison-operators)

Comparison operators compare a provided value with a value stored in metadata field of the vector store.

| Operator | Description |
| --- | --- |
| $eq | Matches values that are equal to a specified value |
| $ne | Matches values that are not equal to a specified value |
| $gt | Matches values that are greater than a specified value |
| $gte | Matches values that are greater than or equal to a specified value |
| $lt | Matches values that are less than a specified value |
| $lte | Matches values that are less than or equal to a specified value |
| $in | Matches values that are contained by scalar list of specified values |
| $contains | Matches values where a scalar is contained within an array metadata field |

### Logical Operators [\#](https://supabase.com/docs/guides/ai/python/metadata\#logical-operators)

Logical operators compose other operators, and can be nested.

| Operator | Description |
| --- | --- |
| $and | Joins query clauses with a logical AND returns all documents that match the conditions of both clauses. |
| $or | Joins query clauses with a logical OR returns all documents that match the conditions of either clause. |

### Performance [\#](https://supabase.com/docs/guides/ai/python/metadata\#performance)

For best performance, use scalar key-value pairs for metadata and prefer `$eq`, `$and` and `$or` filters where possible.
Those variants are most consistently able to make use of indexes.

### Examples [\#](https://supabase.com/docs/guides/ai/python/metadata\#examples)

* * *

`year` equals 2020

```flex

```

* * *

`year` equals 2020 or `gross` greater than or equal to 5000.0

```flex

```

* * *

`last_name` is less than "Brown" and `is_priority_customer` is true

```flex

```

* * *

`priority` contained by \["enterprise", "pro"\]

```flex

```

`tags`, an array, contains the string "important"

```flex

```

### Is this helpful?

NoYes

### On this page

[Types](https://supabase.com/docs/guides/ai/python/metadata#types) [Metadata Query Language](https://supabase.com/docs/guides/ai/python/metadata#metadata-query-language) [Comparison Operators](https://supabase.com/docs/guides/ai/python/metadata#comparison-operators) [Logical Operators](https://supabase.com/docs/guides/ai/python/metadata#logical-operators) [Performance](https://supabase.com/docs/guides/ai/python/metadata#performance) [Examples](https://supabase.com/docs/guides/ai/python/metadata#examples)
