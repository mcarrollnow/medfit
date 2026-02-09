---
library: supabase
url: https://supabase.com/docs/guides/getting-started/tutorials/with-solidjs
title: Build a User Management App with SolidJS | Supabase Docs
scraped: 2025-10-23T16:59:02.342Z
---

Getting Started

# Build a User Management App with SolidJS

* * *

This tutorial demonstrates how to build a basic user management app. The app authenticates and identifies the user, stores their profile information in the database, and allows the user to log in, update their profile details, and upload a profile photo. The app uses:

- [Supabase Database](https://supabase.com/docs/guides/database) \- a Postgres database for storing your user data and [Row Level Security](https://supabase.com/docs/guides/auth#row-level-security) so data is protected and users can only access their own information.
- [Supabase Auth](https://supabase.com/docs/guides/auth) \- allow users to sign up and log in.
- [Supabase Storage](https://supabase.com/docs/guides/storage) \- allow users to upload a profile photo.

![Supabase User Management example](https://supabase.com/docs/img/user-management-demo.png)

If you get stuck while working through this guide, refer to the [full example on GitHub](https://github.com/supabase/supabase/tree/master/examples/user-management/solid-user-management).

## Project setup [\#](https://supabase.com/docs/guides/getting-started/tutorials/with-solidjs\#project-setup)

Before you start building you need to set up the Database and API. You can do this by starting a new Project in Supabase and then creating a "schema" inside the database.

### Create a project [\#](https://supabase.com/docs/guides/getting-started/tutorials/with-solidjs\#create-a-project)

1. [Create a new project](https://supabase.com/dashboard) in the Supabase Dashboard.
2. Enter your project details.
3. Wait for the new database to launch.

### Set up the database schema [\#](https://supabase.com/docs/guides/getting-started/tutorials/with-solidjs\#set-up-the-database-schema)

Now set up the database schema. You can use the "User Management Starter" quickstart in the SQL Editor, or you can copy/paste the SQL from below and run it.

DashboardSQL

1. Go to the [SQL Editor](https://supabase.com/dashboard/project/_/sql) page in the Dashboard.
2. Click **User Management Starter** under the **Community > Quickstarts** tab.
3. Click **Run**.

You can pull the database schema down to your local project by running the `db pull` command. Read the [local development docs](https://supabase.com/docs/guides/cli/local-development#link-your-project) for detailed instructions.

```flex

```

### Get API details [\#](https://supabase.com/docs/guides/getting-started/tutorials/with-solidjs\#get-api-details)

Now that you've created some database tables, you are ready to insert data using the auto-generated API.

To do this, you need to get the Project URL and key. Get the URL from [the API settings section](https://supabase.com/dashboard/project/_/settings/api) of a project and the key from the [the API Keys section of a project's Settings page](https://supabase.com/dashboard/project/_/settings/api-keys/).

##### Changes to API keys

Supabase is changing the way keys work to improve project security and developer experience. You can [read the full announcement](https://github.com/orgs/supabase/discussions/29260), but in the transition period, you can use both the current `anon` and `service_role` keys and the new publishable key with the form `sb_publishable_xxx` which will replace the older keys.

To get the key values, open [the API Keys section of a project's Settings page](https://supabase.com/dashboard/project/_/settings/api-keys/) and do the following:

- **For legacy keys**, copy the `anon` key for client-side operations and the `service_role` key for server-side operations from the **Legacy API Keys** tab.
- **For new keys**, open the **API Keys** tab, if you don't have a publishable key already, click **Create new API Keys**, and copy the value from the **Publishable key** section.

## Building the app [\#](https://supabase.com/docs/guides/getting-started/tutorials/with-solidjs\#building-the-app)

Let's start building the SolidJS app from scratch.

### Initialize a SolidJS app [\#](https://supabase.com/docs/guides/getting-started/tutorials/with-solidjs\#initialize-a-solidjs-app)

We can use [degit](https://github.com/Rich-Harris/degit) to initialize an app called `supabase-solid`:

```flex

```

Then let's install the only additional dependency: [supabase-js](https://github.com/supabase/supabase-js)

```flex

```

And finally we want to save the environment variables in a `.env`.
All we need are the API URL and the key that you copied [earlier](https://supabase.com/docs/guides/getting-started/tutorials/with-solidjs#get-api-details).

.env

```flex

```

Now that we have the API credentials in place, let's create a helper file to initialize the Supabase client. These variables will be exposed
on the browser, and that's completely fine since we have [Row Level Security](https://supabase.com/docs/guides/auth#row-level-security) enabled on our Database.

src/supabaseClient.tsx

```flex

```

### App styling (optional) [\#](https://supabase.com/docs/guides/getting-started/tutorials/with-solidjs\#app-styling-optional)

An optional step is to update the CSS file `src/index.css` to make the app look nice.
You can find the full contents of this file [here](https://raw.githubusercontent.com/supabase/supabase/master/examples/user-management/solid-user-management/src/index.css).

### Set up a login component [\#](https://supabase.com/docs/guides/getting-started/tutorials/with-solidjs\#set-up-a-login-component)

Let's set up a SolidJS component to manage logins and sign ups. We'll use Magic Links, so users can sign in with their email without using passwords.

src/Auth.tsx

```flex

```

### Account page [\#](https://supabase.com/docs/guides/getting-started/tutorials/with-solidjs\#account-page)

After a user is signed in we can allow them to edit their profile details and manage their account.

Let's create a new component for that called `Account.tsx`.

src/Account.tsx

```flex

```

### Launch! [\#](https://supabase.com/docs/guides/getting-started/tutorials/with-solidjs\#launch)

Now that we have all the components in place, let's update `App.tsx`:

src/App.tsx

```flex

```

Once that's done, run this in a terminal window:

```flex

```

And then open the browser to [localhost:3000](http://localhost:3000/) and you should see the completed app.

![Supabase SolidJS](https://supabase.com/docs/img/supabase-solidjs-demo.png)

## Bonus: Profile photos [\#](https://supabase.com/docs/guides/getting-started/tutorials/with-solidjs\#bonus-profile-photos)

Every Supabase project is configured with [Storage](https://supabase.com/docs/guides/storage) for managing large files like photos and videos.

### Create an upload widget [\#](https://supabase.com/docs/guides/getting-started/tutorials/with-solidjs\#create-an-upload-widget)

Let's create an avatar for the user so that they can upload a profile photo. We can start by creating a new component:

src/Avatar.tsx

```flex

```

### Add the new widget [\#](https://supabase.com/docs/guides/getting-started/tutorials/with-solidjs\#add-the-new-widget)

And then we can add the widget to the Account page:

src/Account.tsx

```flex

```

At this stage you have a fully functional application!

### Is this helpful?

NoYes

### On this page

[Project setup](https://supabase.com/docs/guides/getting-started/tutorials/with-solidjs#project-setup) [Create a project](https://supabase.com/docs/guides/getting-started/tutorials/with-solidjs#create-a-project) [Set up the database schema](https://supabase.com/docs/guides/getting-started/tutorials/with-solidjs#set-up-the-database-schema) [Get API details](https://supabase.com/docs/guides/getting-started/tutorials/with-solidjs#get-api-details) [Building the app](https://supabase.com/docs/guides/getting-started/tutorials/with-solidjs#building-the-app) [Initialize a SolidJS app](https://supabase.com/docs/guides/getting-started/tutorials/with-solidjs#initialize-a-solidjs-app) [App styling (optional)](https://supabase.com/docs/guides/getting-started/tutorials/with-solidjs#app-styling-optional) [Set up a login component](https://supabase.com/docs/guides/getting-started/tutorials/with-solidjs#set-up-a-login-component) [Account page](https://supabase.com/docs/guides/getting-started/tutorials/with-solidjs#account-page) [Launch!](https://supabase.com/docs/guides/getting-started/tutorials/with-solidjs#launch) [Bonus: Profile photos](https://supabase.com/docs/guides/getting-started/tutorials/with-solidjs#bonus-profile-photos) [Create an upload widget](https://supabase.com/docs/guides/getting-started/tutorials/with-solidjs#create-an-upload-widget) [Add the new widget](https://supabase.com/docs/guides/getting-started/tutorials/with-solidjs#add-the-new-widget)
