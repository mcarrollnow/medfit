---
library: supabase
url: https://supabase.com/docs/guides/ai/vecs-python-client
title: Python client | Supabase Docs
scraped: 2025-10-23T16:59:02.325Z
---

AI & Vectors

# Python client

## Manage unstructured vector stores in PostgreSQL.

* * *

Supabase provides a Python client called [`vecs`](https://github.com/supabase/vecs) for managing unstructured vector stores. This client provides a set of useful tools for creating and querying collections in Postgres using the [pgvector](https://supabase.com/docs/guides/database/extensions/pgvector) extension.

## Quick start [\#](https://supabase.com/docs/guides/ai/vecs-python-client\#quick-start)

Let's see how Vecs works using a local database. Make sure you have the Supabase CLI [installed](https://supabase.com/docs/guides/cli#installation) on your machine.

### Initialize your project [\#](https://supabase.com/docs/guides/ai/vecs-python-client\#initialize-your-project)

Start a local Postgres instance in any folder using the `init` and `start` commands. Make sure you have Docker running!

```flex

```

### Create a collection [\#](https://supabase.com/docs/guides/ai/vecs-python-client\#create-a-collection)

Inside a Python shell, run the following commands to create a new collection called "docs", with 3 dimensions.

```flex

```

### Add embeddings [\#](https://supabase.com/docs/guides/ai/vecs-python-client\#add-embeddings)

Now we can insert some embeddings into our "docs" collection using the `upsert()` command:

```flex

```

### Query the collection [\#](https://supabase.com/docs/guides/ai/vecs-python-client\#query-the-collection)

You can now query the collection to retrieve a relevant match:

```flex

```

## Deep dive [\#](https://supabase.com/docs/guides/ai/vecs-python-client\#deep-dive)

For a more in-depth guide on `vecs` collections, see [API](https://supabase.com/docs/guides/ai/python/api).

## Resources [\#](https://supabase.com/docs/guides/ai/vecs-python-client\#resources)

- Official Vecs Documentation: [https://supabase.github.io/vecs/api](https://supabase.github.io/vecs/api)
- Source Code: [https://github.com/supabase/vecs](https://github.com/supabase/vecs)

### Is this helpful?

NoYes

### On this page

[Quick start](https://supabase.com/docs/guides/ai/vecs-python-client#quick-start) [Initialize your project](https://supabase.com/docs/guides/ai/vecs-python-client#initialize-your-project) [Create a collection](https://supabase.com/docs/guides/ai/vecs-python-client#create-a-collection) [Add embeddings](https://supabase.com/docs/guides/ai/vecs-python-client#add-embeddings) [Query the collection](https://supabase.com/docs/guides/ai/vecs-python-client#query-the-collection) [Deep dive](https://supabase.com/docs/guides/ai/vecs-python-client#deep-dive) [Resources](https://supabase.com/docs/guides/ai/vecs-python-client#resources)
