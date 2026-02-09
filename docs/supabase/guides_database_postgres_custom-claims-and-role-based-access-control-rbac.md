---
library: supabase
url: https://supabase.com/docs/guides/database/postgres/custom-claims-and-role-based-access-control-rbac
title: Custom Claims & Role-based Access Control (RBAC) | Supabase Docs
scraped: 2025-10-23T16:59:02.334Z
---

Database

# Custom Claims & Role-based Access Control (RBAC)

* * *

Custom Claims are special attributes attached to a user that you can use to control access to portions of your application. For example:

```flex

```

To implement Role-Based Access Control (RBAC) with `custom claims`, use a [Custom Access Token Auth Hook](https://supabase.com/docs/guides/auth/auth-hooks#hook-custom-access-token). This hook runs before a token is issued. You can use it to add additional claims to the user's JWT.

This guide uses the [Slack Clone example](https://github.com/supabase/supabase/tree/master/examples/slack-clone/nextjs-slack-clone) to demonstrate how to add a `user_role` claim and use it in your [Row Level Security (RLS) policies](https://supabase.com/docs/guides/database/postgres/row-level-security).

## Create a table to track user roles and permissions [\#](https://supabase.com/docs/guides/database/postgres/custom-claims-and-role-based-access-control-rbac\#create-a-table-to-track-user-roles-and-permissions)

In this example, you will implement two user roles with specific permissions:

- `moderator`: A moderator can delete all messages but not channels.
- `admin`: An admin can delete all messages and channels.

```flex

```

For the [full schema](https://github.com/supabase/supabase/blob/master/examples/slack-clone/nextjs-slack-clone/README.md), see the example application on [GitHub](https://github.com/supabase/supabase/tree/master/examples/slack-clone/nextjs-slack-clone).

You can now manage your roles and permissions in SQL. For example, to add the mentioned roles and permissions from above, run:

```flex

```

## Create Auth Hook to apply user role [\#](https://supabase.com/docs/guides/database/postgres/custom-claims-and-role-based-access-control-rbac\#create-auth-hook-to-apply-user-role)

The [Custom Access Token Auth Hook](https://supabase.com/docs/guides/auth/auth-hooks#hook-custom-access-token) runs before a token is issued. You can use it to edit the JWT.

PL/pgSQL (best performance)

```flex

```

### Enable the hook [\#](https://supabase.com/docs/guides/database/postgres/custom-claims-and-role-based-access-control-rbac\#enable-the-hook)

In the dashboard, navigate to [`Authentication > Hooks (Beta)`](https://supabase.com/dashboard/project/_/auth/hooks) and select the appropriate Postgres function from the dropdown menu.

When developing locally, follow the [local development](https://supabase.com/docs/guides/auth/auth-hooks#local-development) instructions.

To learn more about Auth Hooks, see the [Auth Hooks docs](https://supabase.com/docs/guides/auth/auth-hooks).

## Accessing custom claims in RLS policies [\#](https://supabase.com/docs/guides/database/postgres/custom-claims-and-role-based-access-control-rbac\#accessing-custom-claims-in-rls-policies)

To utilize Role-Based Access Control (RBAC) in Row Level Security (RLS) policies, create an `authorize` method that reads the user's role from their JWT and checks the role's permissions:

```flex

```

You can read more about using functions in RLS policies in the [RLS guide](https://supabase.com/docs/guides/database/postgres/row-level-security#using-functions).

You can then use the `authorize` method within your RLS policies. For example, to enable the desired delete access, you would add the following policies:

```flex

```

## Accessing custom claims in your application [\#](https://supabase.com/docs/guides/database/postgres/custom-claims-and-role-based-access-control-rbac\#accessing-custom-claims-in-your-application)

The auth hook will only modify the access token JWT but not the auth response. Therefore, to access the custom claims in your application, e.g. your browser client, or server-side middleware, you will need to decode the `access_token` JWT on the auth session.

In a JavaScript client application you can for example use the [`jwt-decode` package](https://www.npmjs.com/package/jwt-decode):

```flex

```

For server-side logic you can use packages like [`express-jwt`](https://github.com/auth0/express-jwt), [`koa-jwt`](https://github.com/stiang/koa-jwt), [`PyJWT`](https://github.com/jpadilla/pyjwt), [dart\_jsonwebtoken](https://pub.dev/packages/dart_jsonwebtoken), [Microsoft.AspNetCore.Authentication.JwtBearer](https://www.nuget.org/packages/Microsoft.AspNetCore.Authentication.JwtBearer), etc.

## Conclusion [\#](https://supabase.com/docs/guides/database/postgres/custom-claims-and-role-based-access-control-rbac\#conclusion)

You now have a robust system in place to manage user roles and permissions within your database that automatically propagates to Supabase Auth.

## More resources [\#](https://supabase.com/docs/guides/database/postgres/custom-claims-and-role-based-access-control-rbac\#more-resources)

- [Auth Hooks](https://supabase.com/docs/guides/auth/auth-hooks)
- [Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [RLS Functions](https://supabase.com/docs/guides/database/postgres/row-level-security#using-functions)
- [Next.js Slack Clone Example](https://github.com/supabase/supabase/tree/master/examples/slack-clone/nextjs-slack-clone)

### Is this helpful?

NoYes

### On this page

[Create a table to track user roles and permissions](https://supabase.com/docs/guides/database/postgres/custom-claims-and-role-based-access-control-rbac#create-a-table-to-track-user-roles-and-permissions) [Create Auth Hook to apply user role](https://supabase.com/docs/guides/database/postgres/custom-claims-and-role-based-access-control-rbac#create-auth-hook-to-apply-user-role) [Enable the hook](https://supabase.com/docs/guides/database/postgres/custom-claims-and-role-based-access-control-rbac#enable-the-hook) [Accessing custom claims in RLS policies](https://supabase.com/docs/guides/database/postgres/custom-claims-and-role-based-access-control-rbac#accessing-custom-claims-in-rls-policies) [Accessing custom claims in your application](https://supabase.com/docs/guides/database/postgres/custom-claims-and-role-based-access-control-rbac#accessing-custom-claims-in-your-application) [Conclusion](https://supabase.com/docs/guides/database/postgres/custom-claims-and-role-based-access-control-rbac#conclusion) [More resources](https://supabase.com/docs/guides/database/postgres/custom-claims-and-role-based-access-control-rbac#more-resources)
