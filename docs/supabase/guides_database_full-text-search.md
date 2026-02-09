---
library: supabase
url: https://supabase.com/docs/guides/database/full-text-search
title: Full Text Search | Supabase Docs
scraped: 2025-10-23T16:59:02.331Z
---

Database

# Full Text Search

## How to use full text search in PostgreSQL.

* * *

Postgres has built-in functions to handle `Full Text Search` queries. This is like a "search engine" within Postgres.

## Preparation [\#](https://supabase.com/docs/guides/database/full-text-search\#preparation)

For this guide we'll use the following example data:

DataSQL

| id | title | author | description |
| --- | --- | --- | --- |
| 1 | The Poky Little Puppy | Janette Sebring Lowrey | Puppy is slower than other, bigger animals. |
| 2 | The Tale of Peter Rabbit | Beatrix Potter | Rabbit eats some vegetables. |
| 3 | Tootle | Gertrude Crampton | Little toy train has big dreams. |
| 4 | Green Eggs and Ham | Dr. Seuss | Sam has changing food preferences and eats unusually colored food. |
| 5 | Harry Potter and the Goblet of Fire | J.K. Rowling | Fourth year of school starts, big drama ensues. |

## Usage [\#](https://supabase.com/docs/guides/database/full-text-search\#usage)

The functions we'll cover in this guide are:

### `to_tsvector()` [\#](https://supabase.com/docs/guides/database/full-text-search\#to-tsvector)

Converts your data into searchable tokens. `to_tsvector()` stands for "to text search vector." For example:

```flex

```

Collectively these tokens are called a "document" which Postgres can use for comparisons.

### `to_tsquery()` [\#](https://supabase.com/docs/guides/database/full-text-search\#to-tsquery)

Converts a query string into tokens to match. `to_tsquery()` stands for "to text search query."

This conversion step is important because we will want to "fuzzy match" on keywords.
For example if a user searches for `eggs`, and a column has the value `egg`, we probably still want to return a match.

Postgres provides several functions to create tsquery objects:

- **`to_tsquery()`** \- Requires manual specification of operators ( `&`, `|`, `!`)
- **`plainto_tsquery()`** \- Converts plain text to an AND query: `plainto_tsquery('english', 'fat rats')` → `'fat' & 'rat'`
- **`phraseto_tsquery()`** \- Creates phrase queries: `phraseto_tsquery('english', 'fat rats')` → `'fat' <-> 'rat'`
- **`websearch_to_tsquery()`** \- Supports web search syntax with quotes, "or", and negation

### Match: `@@` [\#](https://supabase.com/docs/guides/database/full-text-search\#match)

The `@@` symbol is the "match" symbol for Full Text Search. It returns any matches between a `to_tsvector` result and a `to_tsquery` result.

Take the following example:

SQLJavaScriptDartSwiftKotlinPython

```flex

```

The equality symbol above ( `=`) is very "strict" on what it matches. In a full text search context, we might want to find all "Harry Potter" books and so we can rewrite the
example above:

SQLJavaScriptDartSwiftKotlin

```flex

```

## Basic full text queries [\#](https://supabase.com/docs/guides/database/full-text-search\#basic-full-text-queries)

### Search a single column [\#](https://supabase.com/docs/guides/database/full-text-search\#search-a-single-column)

To find all `books` where the `description` contain the word `big`:

SQLJavaScriptDartSwiftKotlinPythonData

```flex

```

### Search multiple columns [\#](https://supabase.com/docs/guides/database/full-text-search\#search-multiple-columns)

Right now there is no direct way to use JavaScript or Dart to search through multiple columns but you can do it by creating [computed columns](https://postgrest.org/en/stable/api.html#computed-virtual-columns) on the database.

To find all `books` where `description` or `title` contain the word `little`:

SQLJavaScriptDartSwiftKotlinPythonData

```flex

```

### Match all search words [\#](https://supabase.com/docs/guides/database/full-text-search\#match-all-search-words)

To find all `books` where `description` contains BOTH of the words `little` and `big`, we can use the `&` symbol:

SQLJavaScriptDartSwiftKotlinPythonData

```flex

```

### Match any search words [\#](https://supabase.com/docs/guides/database/full-text-search\#match-any-search-words)

To find all `books` where `description` contain ANY of the words `little` or `big`, use the `|` symbol:

SQLJavaScriptDartSwiftKotlinPythonData

```flex

```

Notice how searching for `big` includes results with the word `bigger` (or `biggest`, etc).

## Partial search [\#](https://supabase.com/docs/guides/database/full-text-search\#partial-search)

Partial search is particularly useful when you want to find matches on substrings within your data.

### Implementing partial search [\#](https://supabase.com/docs/guides/database/full-text-search\#implementing-partial-search)

You can use the `:*` syntax with `to_tsquery()`. Here's an example that searches for any book titles beginning with "Lit":

```flex

```

### Extending functionality with RPC [\#](https://supabase.com/docs/guides/database/full-text-search\#extending-functionality-with-rpc)

To make the partial search functionality accessible through the API, you can wrap the search logic in a stored procedure.

After creating this function, you can invoke it from your application using the SDK for your platform. Here's an example:

SQLJavaScriptDartSwiftKotlinPython

```flex

```

This function takes a prefix parameter and returns all books where the title contains a word starting with that prefix. The `:*` operator is used to denote a prefix match in the `to_tsquery()` function.

## Handling spaces in queries [\#](https://supabase.com/docs/guides/database/full-text-search\#handling-spaces-in-queries)

When you want the search term to include a phrase or multiple words, you can concatenate words using a `+` as a placeholder for space:

```flex

```

## Web search syntax with `websearch_to_tsquery()` [\#](https://supabase.com/docs/guides/database/full-text-search\#websearch-to-tsquery)

The `websearch_to_tsquery()` function provides an intuitive search syntax similar to popular web search engines, making it ideal for user-facing search interfaces.

### Basic usage [\#](https://supabase.com/docs/guides/database/full-text-search\#basic-usage)

SQLJavaScript

```flex

```

### Quoted phrases [\#](https://supabase.com/docs/guides/database/full-text-search\#quoted-phrases)

Use quotes to search for exact phrases:

```flex

```

### OR searches [\#](https://supabase.com/docs/guides/database/full-text-search\#or-searches)

Use "or" (case-insensitive) to search for multiple terms:

```flex

```

### Negation [\#](https://supabase.com/docs/guides/database/full-text-search\#negation)

Use a dash (-) to exclude terms:

```flex

```

### Complex queries [\#](https://supabase.com/docs/guides/database/full-text-search\#complex-queries)

Combine multiple operators for sophisticated searches:

```flex

```

## Creating indexes [\#](https://supabase.com/docs/guides/database/full-text-search\#creating-indexes)

Now that you have Full Text Search working, create an `index`. This allows Postgres to "build" the documents preemptively so that they
don't need to be created at the time we execute the query. This will make our queries much faster.

### Searchable columns [\#](https://supabase.com/docs/guides/database/full-text-search\#searchable-columns)

Let's create a new column `fts` inside the `books` table to store the searchable index of the `title` and `description` columns.

We can use a special feature of Postgres called
[Generated Columns](https://www.postgresql.org/docs/current/ddl-generated-columns.html)
to ensure that the index is updated any time the values in the `title` and `description` columns change.

SQLData

```flex

```

### Search using the new column [\#](https://supabase.com/docs/guides/database/full-text-search\#search-using-the-new-column)

Now that we've created and populated our index, we can search it using the same techniques as before:

SQLJavaScriptDartSwiftKotlinPythonData

```flex

```

## Query operators [\#](https://supabase.com/docs/guides/database/full-text-search\#query-operators)

Visit [Postgres: Text Search Functions and Operators](https://www.postgresql.org/docs/current/functions-textsearch.html)
to learn about additional query operators you can use to do more advanced `full text queries`, such as:

### Proximity: `<->` [\#](https://supabase.com/docs/guides/database/full-text-search\#proximity)

The proximity symbol is useful for searching for terms that are a certain "distance" apart.
For example, to find the phrase `big dreams`, where the a match for "big" is followed immediately by a match for "dreams":

SQLJavaScriptDartSwiftKotlinPython

```flex

```

We can also use the `<->` to find words within a certain distance of each other. For example to find `year` and `school` within 2 words of each other:

SQLJavaScriptDartSwiftKotlinPython

```flex

```

### Negation: `!` [\#](https://supabase.com/docs/guides/database/full-text-search\#negation)

The negation symbol can be used to find phrases which _don't_ contain a search term.
For example, to find records that have the word `big` but not `little`:

SQLJavaScriptDartSwiftKotlinPython

```flex

```

## Ranking search results [\#](https://supabase.com/docs/guides/database/full-text-search\#ranking)

Postgres provides ranking functions to sort search results by relevance, helping you present the most relevant matches first. Since ranking functions need to be computed server-side, use RPC functions and generated columns.

### Creating a search function with ranking [\#](https://supabase.com/docs/guides/database/full-text-search\#search-function-ranking)

First, create a Postgres function that handles search and ranking:

```flex

```

Now you can call this function from your client:

JavaScriptDartPythonSQL

```flex

```

### Ranking with weighted columns [\#](https://supabase.com/docs/guides/database/full-text-search\#weighted-ranking)

Postgres allows you to assign different importance levels to different parts of your documents using weight labels. This is especially useful when you want matches in certain fields (like titles) to rank higher than matches in other fields (like descriptions).

#### Understanding weight labels [\#](https://supabase.com/docs/guides/database/full-text-search\#understanding-weight-labels)

Postgres uses four weight labels: **A**, **B**, **C**, and **D**, where:

- **A** = Highest importance (weight 1.0)
- **B** = High importance (weight 0.4)
- **C** = Medium importance (weight 0.2)
- **D** = Low importance (weight 0.1)

#### Creating weighted search columns [\#](https://supabase.com/docs/guides/database/full-text-search\#creating-weighted-search-columns)

First, create a weighted tsvector column that gives titles higher priority than descriptions:

```flex

```

Now create a search function that uses this weighted column:

```flex

```

#### Custom weight arrays [\#](https://supabase.com/docs/guides/database/full-text-search\#custom-weight-arrays)

You can also specify custom weights by providing a weight array to `ts_rank()`:

```flex

```

This example uses custom weights where:

- A-labeled terms (titles) have maximum weight (1.0)
- B-labeled terms (descriptions) have medium weight (0.5)
- C-labeled terms have low weight (0.2)
- D-labeled terms are ignored (0.0)

#### Using the weighted search [\#](https://supabase.com/docs/guides/database/full-text-search\#using-the-weighted-search)

JavaScriptPythonSQL

```flex

```

#### Practical example with results [\#](https://supabase.com/docs/guides/database/full-text-search\#practical-example-with-results)

Say you search for "Harry". With weighted columns:

1. **"Harry Potter and the Goblet of Fire"** (title match) gets weight A = 1.0
2. **Books mentioning "Harry" in description** get weight B = 0.4

This ensures that books with "Harry" in the title ranks significantly higher than books that only mention "Harry" in the description, providing more relevant search results for users.

### Using ranking with indexes [\#](https://supabase.com/docs/guides/database/full-text-search\#ranking-with-indexes)

When using the `fts` column you created earlier, ranking becomes more efficient. Create a function that uses the indexed column:

```flex

```

JavaScriptDartPythonSQL

```flex

```

### Using web search syntax with ranking [\#](https://supabase.com/docs/guides/database/full-text-search\#websearch-ranking)

You can also create a function that combines `websearch_to_tsquery()` with ranking for user-friendly search:

```flex

```

JavaScriptSQL

```flex

```

## Resources [\#](https://supabase.com/docs/guides/database/full-text-search\#resources)

- [Postgres: Text Search Functions and Operators](https://www.postgresql.org/docs/12/functions-textsearch.html)

Watch video guide

![Video guide preview](https://supabase.com/docs/_next/image?url=https%3A%2F%2Fimg.youtube.com%2Fvi%2FGRwIa-ce7RA%2F0.jpg&w=3840&q=75)

### Is this helpful?

NoYes

### On this page

[Preparation](https://supabase.com/docs/guides/database/full-text-search#preparation) [Usage](https://supabase.com/docs/guides/database/full-text-search#usage) [to\_tsvector()](https://supabase.com/docs/guides/database/full-text-search#to-tsvector) [to\_tsquery()](https://supabase.com/docs/guides/database/full-text-search#to-tsquery) [Match: @@](https://supabase.com/docs/guides/database/full-text-search#match) [Basic full text queries](https://supabase.com/docs/guides/database/full-text-search#basic-full-text-queries) [Search a single column](https://supabase.com/docs/guides/database/full-text-search#search-a-single-column) [Search multiple columns](https://supabase.com/docs/guides/database/full-text-search#search-multiple-columns) [Match all search words](https://supabase.com/docs/guides/database/full-text-search#match-all-search-words) [Match any search words](https://supabase.com/docs/guides/database/full-text-search#match-any-search-words) [Partial search](https://supabase.com/docs/guides/database/full-text-search#partial-search) [Implementing partial search](https://supabase.com/docs/guides/database/full-text-search#implementing-partial-search) [Extending functionality with RPC](https://supabase.com/docs/guides/database/full-text-search#extending-functionality-with-rpc) [Handling spaces in queries](https://supabase.com/docs/guides/database/full-text-search#handling-spaces-in-queries) [Web search syntax with websearch\_to\_tsquery()](https://supabase.com/docs/guides/database/full-text-search#websearch-to-tsquery) [Basic usage](https://supabase.com/docs/guides/database/full-text-search#basic-usage) [Quoted phrases](https://supabase.com/docs/guides/database/full-text-search#quoted-phrases) [OR searches](https://supabase.com/docs/guides/database/full-text-search#or-searches) [Negation](https://supabase.com/docs/guides/database/full-text-search#negation) [Complex queries](https://supabase.com/docs/guides/database/full-text-search#complex-queries) [Creating indexes](https://supabase.com/docs/guides/database/full-text-search#creating-indexes) [Searchable columns](https://supabase.com/docs/guides/database/full-text-search#searchable-columns) [Search using the new column](https://supabase.com/docs/guides/database/full-text-search#search-using-the-new-column) [Query operators](https://supabase.com/docs/guides/database/full-text-search#query-operators) [Proximity: <->](https://supabase.com/docs/guides/database/full-text-search#proximity) [Negation: !](https://supabase.com/docs/guides/database/full-text-search#negation) [Ranking search results](https://supabase.com/docs/guides/database/full-text-search#ranking) [Creating a search function with ranking](https://supabase.com/docs/guides/database/full-text-search#search-function-ranking) [Ranking with weighted columns](https://supabase.com/docs/guides/database/full-text-search#weighted-ranking) [Using ranking with indexes](https://supabase.com/docs/guides/database/full-text-search#ranking-with-indexes) [Using web search syntax with ranking](https://supabase.com/docs/guides/database/full-text-search#websearch-ranking) [Resources](https://supabase.com/docs/guides/database/full-text-search#resources)
