---
library: supabase
url: https://supabase.com/docs/guides/auth/quickstarts/react-native
title: Use Supabase Auth with React Native | Supabase Docs
scraped: 2025-10-23T16:59:02.328Z
---

Auth

# Use Supabase Auth with React Native

## Learn how to use Supabase Auth with React Native

* * *

1

### Create a new Supabase project

[Launch a new project](https://supabase.com/dashboard) in the Supabase Dashboard.

Your new database has a table for storing your users. You can see that this table is currently empty by running some SQL in the [SQL Editor](https://supabase.com/dashboard/project/_/sql).

###### SQL\_EDITOR

```flex

```

2

### Create a React app

Create a React app using the `create-expo-app` command.

###### Terminal

```flex

```

3

### Install the Supabase client library

Install `supabase-js` and the required dependencies.

###### Terminal

```flex

```

4

### Set up your login component

Create a helper file `lib/supabase.ts` that exports a Supabase client using your Project URL and key.

##### Changes to API keys

Supabase is changing the way keys work to improve project security and developer experience. You can [read the full announcement](https://github.com/orgs/supabase/discussions/29260), but in the transition period, you can use both the current `anon` and `service_role` keys and the new publishable key with the form `sb_publishable_xxx` which will replace the older keys.

To get the key values, open [the API Keys section of a project's Settings page](https://supabase.com/dashboard/project/_/settings/api-keys/) and do the following:

- **For legacy keys**, copy the `anon` key for client-side operations and the `service_role` key for server-side operations from the **Legacy API Keys** tab.
- **For new keys**, open the **API Keys** tab, if you don't have a publishable key already, click **Create new API Keys**, and copy the value from the **Publishable key** section.

###### lib/supabase.ts

```flex

```

5

### Create a login component

Let's set up a React Native component to manage logins and sign ups.

###### components/Auth.tsx

```flex

```

6

### Add the Auth component to your app

Add the `Auth` component to your `App.tsx` file. If the user is logged in, print the user id to the screen.

###### App.tsx

```flex

```

7

### Start the app

Start the app, and follow the instructions in the terminal.

###### Terminal

```flex

```
