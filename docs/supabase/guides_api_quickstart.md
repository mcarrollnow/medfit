---
library: supabase
url: https://supabase.com/docs/guides/api/quickstart
title: Build an API route in less than 2 minutes. | Supabase Docs
scraped: 2025-10-23T16:59:02.345Z
---

REST API

# Build an API route in less than 2 minutes.

## Create your first API route by creating a table called `todos` to store tasks.

* * *

Let's create our first REST route which we can query using `cURL` or the browser.

We'll create a database table called `todos` for storing tasks. This creates a corresponding API route `/rest/v1/todos` which can accept `GET`, `POST`, `PATCH`, & `DELETE` requests.

1

### Set up a Supabase project with a 'todos' table

[Create a new project](https://supabase.com/dashboard) in the Supabase Dashboard.

After your project is ready, create a table in your Supabase database. You can do this with either the Table interface or the [SQL Editor](https://supabase.com/dashboard/project/_/sql).

SQLDashboard

```flex

```

2

### Allow public access

Let's turn on Row Level Security for this table and allow public access.

```flex

```

3

### Insert some dummy data

Now we can add some data to our table which we can access through our API.

```flex

```

4

### Fetch the data

Find your API URL and Keys in your Dashboard [API Settings](https://supabase.com/dashboard/project/_/settings/api). You can now query your "todos" table by appending `/rest/v1/todos` to the API URL.

Copy this block of code, substitute `<PROJECT_REF>` and `<ANON_KEY>`, then run it from a terminal.

```flex

```

## Bonus [\#](https://supabase.com/docs/guides/api/quickstart\#bonus)

There are several options for accessing your data:

### Browser [\#](https://supabase.com/docs/guides/api/quickstart\#browser)

You can query the route in your browser, by appending the `anon` key as a query parameter:

`https://<PROJECT_REF>.supabase.co/rest/v1/todos?apikey=<ANON_KEY>`

### Client libraries [\#](https://supabase.com/docs/guides/api/quickstart\#client-libraries)

We provide a number of [Client Libraries](https://github.com/supabase/supabase#client-libraries).

JavaScriptDartPythonSwift

```flex

```
