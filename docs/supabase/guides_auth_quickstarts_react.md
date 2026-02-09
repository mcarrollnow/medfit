---
library: supabase
url: https://supabase.com/docs/guides/auth/quickstarts/react
title: Use Supabase Auth with React | Supabase Docs
scraped: 2025-10-23T16:59:02.318Z
---

Auth

# Use Supabase Auth with React

## Learn how to use Supabase Auth with React.js.

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

Create a React app using [Vite](https://vitejs.dev/).

###### Terminal

```flex

```

3

### Install the Supabase client library

The fastest way to get started is to use Supabase's `auth-ui-react` library which provides a convenient interface for working with Supabase Auth from a React app.

Navigate to the React app and install the Supabase libraries.

###### Terminal

```flex

```

4

### Set up your login component

In `App.jsx`, create a Supabase client using your Project URL and key.

##### Changes to API keys

Supabase is changing the way keys work to improve project security and developer experience. You can [read the full announcement](https://github.com/orgs/supabase/discussions/29260), but in the transition period, you can use both the current `anon` and `service_role` keys and the new publishable key with the form `sb_publishable_xxx` which will replace the older keys.

To get the key values, open [the API Keys section of a project's Settings page](https://supabase.com/dashboard/project/_/settings/api-keys/) and do the following:

- **For legacy keys**, copy the `anon` key for client-side operations and the `service_role` key for server-side operations from the **Legacy API Keys** tab.
- **For new keys**, open the **API Keys** tab, if you don't have a publishable key already, click **Create new API Keys**, and copy the value from the **Publishable key** section.

You can configure the Auth component to display whenever there is no session inside `supabase.auth.getSession()`

###### src/App.jsx

```flex

```

5

### Start the app

Start the app, go to [http://localhost:3000](http://localhost:3000/) in a browser, and open the browser console and you should be able to log in.

###### Terminal

```flex

```
