---
library: supabase
url: https://supabase.com/docs/guides/functions/http-methods
title: Routing | Supabase Docs
scraped: 2025-10-23T16:59:02.326Z
---

Edge Functions

# Routing

## Handle different request types in a single function to create efficient APIs.

* * *

## Overview [\#](https://supabase.com/docs/guides/functions/http-methods\#overview)

Edge Functions support **`GET`, `POST`, `PUT`, `PATCH`, `DELETE`, and `OPTIONS`**. This means you can build complete REST APIs in a single function:

```flex

```

Edge Functions allow you to build APIs without needing separate functions for each endpoint. This reduces cold starts and simplifies deployment while keeping your code organized.

HTML content is not supported. `GET` requests that return `text/html` will be rewritten to `text/plain`. Edge Functions are designed for APIs and data processing, not serving web pages. Use Supabase for your backend API and your favorite frontend framework for HTML.

* * *

## Example [\#](https://supabase.com/docs/guides/functions/http-methods\#example)

Here's a full example of a RESTful API built with Edge Functions.

```flex

```

[View source](https://github.com/supabase/supabase/blob/7f7cea24d80afb59f5551e0247530a89701cfd9d/examples/edge-functions/supabase/functions/restful-tasks/index.ts)

### Is this helpful?

NoYes

### On this page

[Overview](https://supabase.com/docs/guides/functions/http-methods#overview) [Example](https://supabase.com/docs/guides/functions/http-methods#example)
