---
library: supabase
url: https://supabase.com/docs/guides/functions/secrets
title: Environment Variables | Supabase Docs
scraped: 2025-10-23T16:59:02.324Z
---

Edge Functions

# Environment Variables

## Manage sensitive data securely across environments.

* * *

## Default secrets [\#](https://supabase.com/docs/guides/functions/secrets\#default-secrets)

Edge Functions have access to these secrets by default:

- `SUPABASE_URL`: The API gateway for your Supabase project
- `SUPABASE_ANON_KEY`: The `anon` key for your Supabase API. This is safe to use in a browser when you have Row Level Security enabled
- `SUPABASE_SERVICE_ROLE_KEY`: The `service_role` key for your Supabase API. This is safe to use in Edge Functions, but it should NEVER be used in a browser. This key will bypass Row Level Security
- `SUPABASE_DB_URL`: The URL for your Postgres database. You can use this to connect directly to your database

In a hosted environment, functions have access to the following environment variables:

- `SB_REGION`: The region function was invoked
- `SB_EXECUTION_ID`: A UUID of function instance ( [isolate](https://supabase.com/docs/guides/functions/architecture#4-execution-mechanics-fast-and-isolated))
- `DENO_DEPLOYMENT_ID`: Version of the function code ( `{project_ref}_{function_id}_{version}`)

* * *

## Accessing environment variables [\#](https://supabase.com/docs/guides/functions/secrets\#accessing-environment-variables)

You can access environment variables using Deno's built-in handler, and passing it the name of the environment variable you’d like to access.

```flex

```

For example, in a function:

```flex

```

* * *

### Local secrets [\#](https://supabase.com/docs/guides/functions/secrets\#local-secrets)

In development, you can load environment variables in two ways:

1. Through an `.env` file placed at `supabase/functions/.env`, which is automatically loaded on `supabase start`
2. Through the `--env-file` option for `supabase functions serve`. This allows you to use custom file names like `.env.local` to distinguish between different environments.

```flex

```

Never check your `.env` files into Git! Instead, add the path to this file to your `.gitignore`.

We can automatically access the secrets in our Edge Functions through Deno’s handler

```flex

```

Now we can invoke our function locally. If you're using the default `.env` file at `supabase/functions/.env`, it's automatically loaded:

```flex

```

Or you can specify a custom `.env` file with the `--env-file` flag:

```flex

```

This is useful for managing different environments (development, staging, etc.).

* * *

### Production secrets [\#](https://supabase.com/docs/guides/functions/secrets\#production-secrets)

You will also need to set secrets for your production Edge Functions. You can do this via the Dashboard or using the CLI.

**Using the Dashboard**:

1. Visit [Edge Function Secrets Management](https://supabase.com/dashboard/project/_/settings/functions) page in your Dashboard.
2. Add the Key and Value for your secret and press Save

![Edge Functions Secrets Management](https://supabase.com/docs/_next/image?url=%2Fdocs%2Fimg%2Fedge-functions-secrets--light.jpg&w=3840&q=75)

Note that you can paste multiple secrets at a time.

**Using the CLI**

You can create a `.env` file to help deploy your secrets to production

```flex

```

Never check your `.env` files into Git! Instead, add the path to this file to your `.gitignore`.

You can push all the secrets from the `.env` file to your remote project using `supabase secrets set`. This makes the environment visible in the dashboard as well.

```flex

```

Alternatively, this command also allows you to set production secrets individually rather than storing them in a `.env` file.

```flex

```

To see all the secrets which you have set remotely, you can use `supabase secrets list`

```flex

```

You don't need to re-deploy after setting your secrets. They're available immediately in your
functions.

### Is this helpful?

NoYes

### On this page

[Default secrets](https://supabase.com/docs/guides/functions/secrets#default-secrets) [Accessing environment variables](https://supabase.com/docs/guides/functions/secrets#accessing-environment-variables) [Local secrets](https://supabase.com/docs/guides/functions/secrets#local-secrets) [Production secrets](https://supabase.com/docs/guides/functions/secrets#production-secrets)
