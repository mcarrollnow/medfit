---
library: supabase
url: https://supabase.com/docs/guides/auth/third-party/workos
title: WorkOS | Supabase Docs
scraped: 2025-10-23T16:59:02.323Z
---

Auth

# WorkOS

## Use WorkOS with your Supabase project

* * *

WorkOS can be used as a third-party authentication provider alongside Supabase Auth, or standalone, with your Supabase project.

## Getting started [\#](https://supabase.com/docs/guides/auth/third-party/workos\#getting-started)

1. First you need to add an integration to connect your Supabase project with your WorkOS tenant. You will need your WorkOS issuer. The issuer is `https://api.workos.com/user_management/<your-client-id>`. Substitute your [custom auth domain](https://workos.com/docs/custom-domains/auth-api) for "api.workos.com" if configured.
2. Add a new Third-party Auth integration in your project's [Authentication settings](https://supabase.com/dashboard/project/_/auth/third-party).
3. Set up a JWT template to assign the `role: 'authenticated'` claim to your access token.

## Setup the Supabase client library [\#](https://supabase.com/docs/guides/auth/third-party/workos\#setup-the-supabase-client-library)

TypeScript

```flex

```

## Add a new Third-Party Auth integration to your project [\#](https://supabase.com/docs/guides/auth/third-party/workos\#add-a-new-third-party-auth-integration-to-your-project)

In the dashboard navigate to your project's [Authentication settings](https://supabase.com/dashboard/project/_/auth/third-party) and find the Third-Party Auth section to add a new integration.

## Set up a JWT template to add the authenticated role. [\#](https://supabase.com/docs/guides/auth/third-party/workos\#set-up-a-jwt-template-to-add-the-authenticated-role)

Your Supabase project inspects the `role` claim present in all JWTs sent to it, to assign the correct Postgres role when using the Data API, Storage or Realtime authorization.

WorkOS JWTs already contain a `role` claim that corresponds to the user's role in their organization. It is necessary to adjust the `role` claim to be `"authenticated"` like Supabase expects. This can be done using JWT templates (navigate to Authentication -> Sessions -> JWT Template in the WorkOS Dashboard).

This template overrides the `role` claim to meet Supabase's expectations, and adds the WorkOS role in a new `user_role` claim:

```flex

```

### Is this helpful?

NoYes

### On this page

[Getting started](https://supabase.com/docs/guides/auth/third-party/workos#getting-started) [Setup the Supabase client library](https://supabase.com/docs/guides/auth/third-party/workos#setup-the-supabase-client-library) [Add a new Third-Party Auth integration to your project](https://supabase.com/docs/guides/auth/third-party/workos#add-a-new-third-party-auth-integration-to-your-project) [Set up a JWT template to add the authenticated role.](https://supabase.com/docs/guides/auth/third-party/workos#set-up-a-jwt-template-to-add-the-authenticated-role)
