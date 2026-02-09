---
library: supabase
url: https://supabase.com/docs/guides/ai/python/api
title: API | Supabase Docs
scraped: 2025-10-23T16:59:02.323Z
---

AI & Vectors

# API

* * *

`vecs` is a python client for managing and querying vector stores in PostgreSQL with the [pgvector extension](https://github.com/pgvector/pgvector). This guide will help you get started with using vecs.

If you don't have a Postgres database with the pgvector ready, see [hosting](https://supabase.github.io/vecs/hosting) for easy options.

## Installation [\#](https://supabase.com/docs/guides/ai/python/api\#installation)

Requires:

- Python 3.7+

You can install vecs using pip:

```flex

```

## Usage [\#](https://supabase.com/docs/guides/ai/python/api\#usage)

## Connecting [\#](https://supabase.com/docs/guides/ai/python/api\#connecting)

Before you can interact with vecs, create the client to communicate with Postgres. If you haven't started a Postgres instance yet, see [hosting](https://supabase.github.io/vecs/hosting).

```flex

```

## Get or Create a Collection [\#](https://supabase.com/docs/guides/ai/python/api\#get-or-create-a-collection)

You can get a collection (or create if it doesn't exist), specifying the collection's name and the number of dimensions for the vectors you intend to store.

```flex

```

## Upserting vectors [\#](https://supabase.com/docs/guides/ai/python/api\#upserting-vectors)

`vecs` combines the concepts of "insert" and "update" into "upsert". Upserting records adds them to the collection if the `id` is not present, or updates the existing record if the `id` does exist.

```flex

```

## Deleting vectors [\#](https://supabase.com/docs/guides/ai/python/api\#deleting-vectors)

Deleting records removes them from the collection. To delete records, specify a list of `ids` or metadata filters to the `delete` method. The ids of the sucessfully deleted records are returned from the method. Note that attempting to delete non-existent records does not raise an error.

```flex

```

## Create an index [\#](https://supabase.com/docs/guides/ai/python/api\#create-an-index)

Collections can be queried immediately after being created.
However, for good throughput, the collection should be indexed after records have been upserted.

Only one index may exist per-collection. By default, creating an index will replace any existing index.

To create an index:

```flex

```

You may optionally provide a distance measure and index method.

Available options for distance `measure` are:

- `vecs.IndexMeasure.cosine_distance`
- `vecs.IndexMeasure.l2_distance`
- `vecs.IndexMeasure.l1_distance`
- `vecs.IndexMeasure.max_inner_product`

which correspond to different methods for comparing query vectors to the vectors in the database.

If you aren't sure which to use, the default of cosine\_distance is the most widely compatible with off-the-shelf embedding methods.

Available options for index `method` are:

- `vecs.IndexMethod.auto`
- `vecs.IndexMethod.hnsw`
- `vecs.IndexMethod.ivfflat`

Where `auto` selects the best available index method, `hnsw` uses the [HNSW](https://github.com/pgvector/pgvector#hnsw) method and `ivfflat` uses [IVFFlat](https://github.com/pgvector/pgvector#ivfflat).

HNSW and IVFFlat indexes both allow for parameterization to control the speed/accuracy tradeoff. vecs provides sane defaults for these parameters. For a greater level of control you can optionally pass an instance of `vecs.IndexArgsIVFFlat` or `vecs.IndexArgsHNSW` to `create_index`'s `index_arguments` argument. Descriptions of the impact for each parameter are available in the [pgvector docs](https://github.com/pgvector/pgvector).

When using IVFFlat indexes, the index must be created **after** the collection has been populated with records. Building an IVFFlat index on an empty collection will result in significantly reduced recall. You can continue upserting new documents after the index has been created, but should rebuild the index if the size of the collection more than doubles since the last index operation.

HNSW indexes can be created immediately after the collection without populating records.

To manually specify `method`, `measure`, and `index_arguments` add them as arguments to `create_index` for example:

```flex

```

The time required to create an index grows with the number of records and size of vectors.
For a few thousand records expect sub-minute a response in under a minute. It may take a few
minutes for larger collections.

## Query [\#](https://supabase.com/docs/guides/ai/python/api\#query)

Given a collection `docs` with several records:

### Basic [\#](https://supabase.com/docs/guides/ai/python/api\#basic)

The simplest form of search is to provide a query vector.

Indexes are essential for good performance. See [creating an index](https://supabase.com/docs/guides/ai/python/api#create-an-index) for more info.

If you do not create an index, every query will return a warning

```flex

```

that incldues the `IndexMeasure` you should index.

```flex

```

Which returns a list of vector record `ids`.

### Metadata Filtering [\#](https://supabase.com/docs/guides/ai/python/api\#metadata-filtering)

The metadata that is associated with each record can also be filtered during a query.

As an example, `{"year": {"$eq": 2005}}` filters a `year` metadata key to be equal to 2005

In context:

```flex

```

For a complete reference, see the [metadata guide](https://supabase.com/docs/guides/ai/python/metadata).

### Disconnect [\#](https://supabase.com/docs/guides/ai/python/api\#disconnect)

When you're done with a collection, be sure to disconnect the client from the database.

```flex

```

alternatively, use the client as a context manager and it will automatically close the connection on exit.

```flex

```

## Adapters [\#](https://supabase.com/docs/guides/ai/python/api\#adapters)

Adapters are an optional feature to transform data before adding to or querying from a collection. Adapters make it possible to interact with a collection using only your project's native data type (eg. just raw text), rather than manually handling vectors.

For a complete list of available adapters, see [built-in adapters](https://supabase.github.io/vecs/concepts_adapters#built-in-adapters).

As an example, we'll create a collection with an adapter that chunks text into paragraphs and converts each chunk into an embedding vector using the `all-MiniLM-L6-v2` model.

First, install `vecs` with optional dependencies for text embeddings:

```flex

```

Then create a collection with an adapter to chunk text into paragraphs and embed each paragraph using the `all-MiniLM-L6-v2` 384 dimensional text embedding model.

```flex

```

With the adapter registered against the collection, we can upsert records into the collection passing in text rather than vectors.

```flex

```

Similarly, we can query the collection using text.

```flex

```

* * *

## Deprecated [\#](https://supabase.com/docs/guides/ai/python/api\#deprecated)

### Create collection [\#](https://supabase.com/docs/guides/ai/python/api\#create-collection)

Deprecated: use [get\_or\_create\_collection](https://supabase.com/docs/guides/ai/python/api#get-or-create-a-collection)

You can create a collection to store vectors specifying the collections name and the number of dimensions in the vectors you intend to store.

```flex

```

### Get an existing collection [\#](https://supabase.com/docs/guides/ai/python/api\#get-an-existing-collection)

Deprecated: use [get\_or\_create\_collection](https://supabase.com/docs/guides/ai/python/api#get-or-create-a-collection)

To access a previously created collection, use `get_collection` to retrieve it by name

```flex

```

### Is this helpful?

NoYes

### On this page

[Installation](https://supabase.com/docs/guides/ai/python/api#installation) [Usage](https://supabase.com/docs/guides/ai/python/api#usage) [Connecting](https://supabase.com/docs/guides/ai/python/api#connecting) [Get or Create a Collection](https://supabase.com/docs/guides/ai/python/api#get-or-create-a-collection) [Upserting vectors](https://supabase.com/docs/guides/ai/python/api#upserting-vectors) [Deleting vectors](https://supabase.com/docs/guides/ai/python/api#deleting-vectors) [Create an index](https://supabase.com/docs/guides/ai/python/api#create-an-index) [Query](https://supabase.com/docs/guides/ai/python/api#query) [Basic](https://supabase.com/docs/guides/ai/python/api#basic) [Metadata Filtering](https://supabase.com/docs/guides/ai/python/api#metadata-filtering) [Disconnect](https://supabase.com/docs/guides/ai/python/api#disconnect) [Adapters](https://supabase.com/docs/guides/ai/python/api#adapters) [Deprecated](https://supabase.com/docs/guides/ai/python/api#deprecated) [Create collection](https://supabase.com/docs/guides/ai/python/api#create-collection) [Get an existing collection](https://supabase.com/docs/guides/ai/python/api#get-an-existing-collection)
