---
library: supabase
url: https://supabase.com/docs/guides/functions/development-environment
title: Development Environment | Supabase Docs
scraped: 2025-10-23T16:59:02.344Z
---

Edge Functions

# Development Environment

## Set up your local development environment for Edge Functions.

* * *

Before getting started, make sure you have the Supabase CLI installed. Check out the [CLI installation guide](https://supabase.com/docs/guides/cli) for installation methods and troubleshooting.

* * *

## Step 1: Install Deno CLI [\#](https://supabase.com/docs/guides/functions/development-environment\#step-1-install-deno-cli)

The Supabase CLI doesn't use the standard Deno CLI to serve functions locally. Instead, it uses its own Edge Runtime to keep the development and production environment consistent.

You can follow the [Deno guide](https://deno.com/manual@v1.32.5/getting_started/setup_your_environment) for setting up your development environment with your favorite editor/IDE.

The benefit of installing Deno separately is that you can use the Deno LSP to improve your editor's autocompletion, type checking, and testing. You can also use Deno's built-in tools such as `deno fmt`, `deno lint`, and `deno test`.

After installing, you should have Deno installed and available in your terminal. Verify with `deno --version`

* * *

## Step 2: Set up your editor [\#](https://supabase.com/docs/guides/functions/development-environment\#step-2-set-up-your-editor)

Set up your editor environment for proper TypeScript support, autocompletion, and error detection.

### VSCode/Cursor (recommended) [\#](https://supabase.com/docs/guides/functions/development-environment\#vscodecursor-recommended)

1. **Install the Deno extension** from the VSCode marketplace

2. **Option 1: Auto-generate (easiest)**
When running `supabase init`, select `y` when prompted "Generate VS Code settings for Deno? \[y/N\]"

3. **Option 2: Manual setup**

Create a `.vscode/settings.json` in your project root:



```flex



```


This configuration enables the Deno language server only for the `supabase/functions` folder, while using VSCode's built-in JavaScript/TypeScript language server for all other files.

* * *

### Multi-root workspaces [\#](https://supabase.com/docs/guides/functions/development-environment\#multi-root-workspaces)

The standard `.vscode/settings.json` setup works perfectly for projects where your Edge Functions live alongside your main application code. However, you might need multi-root workspaces if your development setup involves:

- **Multiple repositories:** Edge Functions in one repo, main app in another
- **Microservices:** Several services you need to develop in parallel

For this development workflow, create `edge-functions.code-workspace`:

```flex

```

[View source](https://github.com/supabase/supabase/blob/7f7cea24d80afb59f5551e0247530a89701cfd9d/examples/edge-functions/edge-functions.code-workspace)

You can find the complete example on [GitHub](https://github.com/supabase/supabase/tree/master/examples/edge-functions).

* * *

## Recommended project structure [\#](https://supabase.com/docs/guides/functions/development-environment\#recommended-project-structure)

It's recommended to organize your functions according to the following structure:

```flex

```

- **Use "fat functions"**. Develop few, large functions by combining related functionality. This minimizes cold starts.
- **Name functions with hyphens ( `-`)**. This is the most URL-friendly approach
- **Store shared code in `_shared`**. Store any shared code in a folder prefixed with an underscore ( `_`).
- **Separate tests**. Use a separate folder for [Unit Tests](https://supabase.com/docs/guides/functions/unit-test) that includes the name of the function followed by a `-test` suffix.

* * *

## Essential CLI commands [\#](https://supabase.com/docs/guides/functions/development-environment\#essential-cli-commands)

Get familiar with the most commonly used CLI commands for developing and deploying Edge Functions.

### `supabase start` [\#](https://supabase.com/docs/guides/functions/development-environment\#supabase-start)

This command spins up your entire Supabase stack locally: database, auth, storage, and Edge Functions runtime. You're developing against the exact same environment you'll deploy to.

### `supabase functions serve [function-name]` [\#](https://supabase.com/docs/guides/functions/development-environment\#supabase-functions-serve-function-name)

Develop a specific function with hot reloading. Your functions run at `http://localhost:54321/functions/v1/[function-name]`. When you save your file, you’ll see the changes instantly without having to wait.

Alternatively, use `supabase functions serve` to serve all functions at once.

### `supabase functions serve hello-world --no-verify-jwt` [\#](https://supabase.com/docs/guides/functions/development-environment\#supabase-functions-serve-hello-world---no-verify-jwt)

If you want to serve an Edge Function without the default JWT verification. This is important for webhooks from Stripe, GitHub, etc. These services don't have your JWT tokens, so you need to skip auth verification.

Be careful when disabling JWT verification, as it allows anyone to call your function, so only use it for functions that are meant to be publicly accessible.

### `supabase functions deploy hello-world` [\#](https://supabase.com/docs/guides/functions/development-environment\#supabase-functions-deploy-hello-world)

Deploy the function when you’re ready

Watch video guide

![Video guide preview](https://supabase.com/docs/_next/image?url=https%3A%2F%2Fimg.youtube.com%2Fvi%2FlFhU3L8VoSQ%2F0.jpg&w=3840&q=75)

### Is this helpful?

NoYes

### On this page

[Step 1: Install Deno CLI](https://supabase.com/docs/guides/functions/development-environment#step-1-install-deno-cli) [Step 2: Set up your editor](https://supabase.com/docs/guides/functions/development-environment#step-2-set-up-your-editor) [VSCode/Cursor (recommended)](https://supabase.com/docs/guides/functions/development-environment#vscodecursor-recommended) [Multi-root workspaces](https://supabase.com/docs/guides/functions/development-environment#multi-root-workspaces) [Recommended project structure](https://supabase.com/docs/guides/functions/development-environment#recommended-project-structure) [Essential CLI commands](https://supabase.com/docs/guides/functions/development-environment#essential-cli-commands) [supabase start](https://supabase.com/docs/guides/functions/development-environment#supabase-start) [supabase functions serve \[function-name\]](https://supabase.com/docs/guides/functions/development-environment#supabase-functions-serve-function-name) [supabase functions serve hello-world --no-verify-jwt](https://supabase.com/docs/guides/functions/development-environment#supabase-functions-serve-hello-world---no-verify-jwt) [supabase functions deploy hello-world](https://supabase.com/docs/guides/functions/development-environment#supabase-functions-deploy-hello-world)
