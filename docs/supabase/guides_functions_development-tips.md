---
library: supabase
url: https://supabase.com/docs/guides/functions/development-tips
title: Development tips | Supabase Docs
scraped: 2025-10-23T16:59:02.316Z
---

Edge Functions

# Development tips

## Tips for getting started with Edge Functions.

* * *

Here are a few recommendations when you first start developing Edge Functions.

### Skipping authorization checks [\#](https://supabase.com/docs/guides/functions/development-tips\#skipping-authorization-checks)

By default, Edge Functions require a valid JWT in the authorization header. If you want to use Edge Functions without Authorization checks (commonly used for Stripe webhooks), you can pass the `--no-verify-jwt` flag when serving your Edge Functions locally.

```flex

```

Be careful when using this flag, as it will allow anyone to invoke your Edge Function without a valid JWT. The Supabase client libraries automatically handle authorization.

### Using HTTP methods [\#](https://supabase.com/docs/guides/functions/development-tips\#using-http-methods)

Edge Functions support `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, and `OPTIONS`. A Function can be designed to perform different actions based on a request's HTTP method. See the [example on building a RESTful service](https://github.com/supabase/supabase/tree/master/examples/edge-functions/supabase/functions/restful-tasks) to learn how to handle different HTTP methods in your Function.

##### HTML not supported

HTML content is not supported. `GET` requests that return `text/html` will be rewritten to `text/plain`.

### Naming Edge Functions [\#](https://supabase.com/docs/guides/functions/development-tips\#naming-edge-functions)

We recommend using hyphens to name functions because hyphens are the most URL-friendly of all the naming conventions (snake\_case, camelCase, PascalCase).

### Organizing your Edge Functions [\#](https://supabase.com/docs/guides/functions/development-tips\#organizing-your-edge-functions)

We recommend developing "fat functions". This means that you should develop few large functions, rather than many small functions. One common pattern when developing Functions is that you need to share code between two or more Functions. To do this, you can store any shared code in a folder prefixed with an underscore ( `_`). We also recommend a separate folder for [Unit Tests](https://supabase.com/docs/guides/functions/unit-test) including the name of the function followed by a `-test` suffix.
We recommend this folder structure:

```flex

```

### Using config.toml [\#](https://supabase.com/docs/guides/functions/development-tips\#using-configtoml)

Individual function configuration like [JWT verification](https://supabase.com/docs/guides/cli/config#functions.function_name.verify_jwt) and [import map location](https://supabase.com/docs/guides/cli/config#functions.function_name.import_map) can be set via the `config.toml` file.

```flex

```

### Not using TypeScript [\#](https://supabase.com/docs/guides/functions/development-tips\#not-using-typescript)

When you create a new Edge Function, it will use TypeScript by default. However, it is possible to write and deploy Edge Functions using pure JavaScript.

Save your Function as a JavaScript file (e.g. `index.js`) and then update the `supabase/config.toml` as follows:

`entrypoint` is available only in Supabase CLI version 1.215.0 or higher.

```flex

```

You can use any `.ts`, `.js`, `.tsx`, `.jsx` or `.mjs` file as the `entrypoint` for a Function.

### Error handling [\#](https://supabase.com/docs/guides/functions/development-tips\#error-handling)

The `supabase-js` library provides several error types that you can use to handle errors that might occur when invoking Edge Functions:

```flex

```

### Database Functions vs Edge Functions [\#](https://supabase.com/docs/guides/functions/development-tips\#database-functions-vs-edge-functions)

For data-intensive operations we recommend using [Database Functions](https://supabase.com/docs/guides/database/functions), which are executed within your database and can be called remotely using the [REST and GraphQL API](https://supabase.com/docs/guides/api).

For use-cases which require low-latency we recommend [Edge Functions](https://supabase.com/docs/guides/functions), which are globally-distributed and can be written in TypeScript.

### Is this helpful?

NoYes

### On this page

[Skipping authorization checks](https://supabase.com/docs/guides/functions/development-tips#skipping-authorization-checks) [Using HTTP methods](https://supabase.com/docs/guides/functions/development-tips#using-http-methods) [Naming Edge Functions](https://supabase.com/docs/guides/functions/development-tips#naming-edge-functions) [Organizing your Edge Functions](https://supabase.com/docs/guides/functions/development-tips#organizing-your-edge-functions) [Using config.toml](https://supabase.com/docs/guides/functions/development-tips#using-configtoml) [Not using TypeScript](https://supabase.com/docs/guides/functions/development-tips#not-using-typescript) [Error handling](https://supabase.com/docs/guides/functions/development-tips#error-handling) [Database Functions vs Edge Functions](https://supabase.com/docs/guides/functions/development-tips#database-functions-vs-edge-functions)
