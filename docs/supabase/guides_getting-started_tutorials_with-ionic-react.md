---
library: supabase
url: https://supabase.com/docs/guides/getting-started/tutorials/with-ionic-react
title: Build a User Management App with Ionic React | Supabase Docs
scraped: 2025-10-23T16:59:02.335Z
---

Getting Started

# Build a User Management App with Ionic React

* * *

This tutorial demonstrates how to build a basic user management app. The app authenticates and identifies the user, stores their profile information in the database, and allows the user to log in, update their profile details, and upload a profile photo. The app uses:

- [Supabase Database](https://supabase.com/docs/guides/database) \- a Postgres database for storing your user data and [Row Level Security](https://supabase.com/docs/guides/auth#row-level-security) so data is protected and users can only access their own information.
- [Supabase Auth](https://supabase.com/docs/guides/auth) \- allow users to sign up and log in.
- [Supabase Storage](https://supabase.com/docs/guides/storage) \- allow users to upload a profile photo.

![Supabase User Management example](https://supabase.com/docs/img/ionic-demos/ionic-angular-account.png)

If you get stuck while working through this guide, refer to the [full example on GitHub](https://github.com/mhartington/supabase-ionic-react).

## Project setup [\#](https://supabase.com/docs/guides/getting-started/tutorials/with-ionic-react\#project-setup)

Before you start building you need to set up the Database and API. You can do this by starting a new Project in Supabase and then creating a "schema" inside the database.

### Create a project [\#](https://supabase.com/docs/guides/getting-started/tutorials/with-ionic-react\#create-a-project)

1. [Create a new project](https://supabase.com/dashboard) in the Supabase Dashboard.
2. Enter your project details.
3. Wait for the new database to launch.

### Set up the database schema [\#](https://supabase.com/docs/guides/getting-started/tutorials/with-ionic-react\#set-up-the-database-schema)

Now set up the database schema. You can use the "User Management Starter" quickstart in the SQL Editor, or you can copy/paste the SQL from below and run it.

DashboardSQL

1. Go to the [SQL Editor](https://supabase.com/dashboard/project/_/sql) page in the Dashboard.
2. Click **User Management Starter** under the **Community > Quickstarts** tab.
3. Click **Run**.

You can pull the database schema down to your local project by running the `db pull` command. Read the [local development docs](https://supabase.com/docs/guides/cli/local-development#link-your-project) for detailed instructions.

```flex

```

### Get API details [\#](https://supabase.com/docs/guides/getting-started/tutorials/with-ionic-react\#get-api-details)

Now that you've created some database tables, you are ready to insert data using the auto-generated API.

To do this, you need to get the Project URL and key. Get the URL from [the API settings section](https://supabase.com/dashboard/project/_/settings/api) of a project and the key from the [the API Keys section of a project's Settings page](https://supabase.com/dashboard/project/_/settings/api-keys/).

##### Changes to API keys

Supabase is changing the way keys work to improve project security and developer experience. You can [read the full announcement](https://github.com/orgs/supabase/discussions/29260), but in the transition period, you can use both the current `anon` and `service_role` keys and the new publishable key with the form `sb_publishable_xxx` which will replace the older keys.

To get the key values, open [the API Keys section of a project's Settings page](https://supabase.com/dashboard/project/_/settings/api-keys/) and do the following:

- **For legacy keys**, copy the `anon` key for client-side operations and the `service_role` key for server-side operations from the **Legacy API Keys** tab.
- **For new keys**, open the **API Keys** tab, if you don't have a publishable key already, click **Create new API Keys**, and copy the value from the **Publishable key** section.

## Building the app [\#](https://supabase.com/docs/guides/getting-started/tutorials/with-ionic-react\#building-the-app)

Let's start building the React app from scratch.

### Initialize an Ionic React app [\#](https://supabase.com/docs/guides/getting-started/tutorials/with-ionic-react\#initialize-an-ionic-react-app)

We can use the [Ionic CLI](https://ionicframework.com/docs/cli) to initialize
an app called `supabase-ionic-react`:

```flex

```

Then let's install the only additional dependency: [supabase-js](https://github.com/supabase/supabase-js)

```flex

```

And finally we want to save the environment variables in a `.env`.
All we need are the API URL and the key that you copied [earlier](https://supabase.com/docs/guides/getting-started/tutorials/with-ionic-react#get-api-details).

.env

```flex

```

Now that we have the API credentials in place, let's create a helper file to initialize the Supabase client. These variables will be exposed
on the browser, and that's completely fine since we have [Row Level Security](https://supabase.com/docs/guides/auth#row-level-security) enabled on our Database.

src/supabaseClient.ts

```flex

```

### Set up a login route [\#](https://supabase.com/docs/guides/getting-started/tutorials/with-ionic-react\#set-up-a-login-route)

Let's set up a React component to manage logins and sign ups. We'll use Magic Links, so users can sign in with their email without using passwords.

/src/pages/Login.tsx

```flex

```

### Account page [\#](https://supabase.com/docs/guides/getting-started/tutorials/with-ionic-react\#account-page)

After a user is signed in we can allow them to edit their profile details and manage their account.

Let's create a new component for that called `Account.tsx`.

src/pages/Account.tsx

```flex

```

### Launch! [\#](https://supabase.com/docs/guides/getting-started/tutorials/with-ionic-react\#launch)

Now that we have all the components in place, let's update `App.tsx`:

src/App.tsx

```flex

```

Once that's done, run this in a terminal window:

```flex

```

And then open the browser to [localhost:3000](http://localhost:3000/) and you should see the completed app.

![Supabase Ionic React](https://supabase.com/docs/img/ionic-demos/ionic-react.png)

## Bonus: Profile photos [\#](https://supabase.com/docs/guides/getting-started/tutorials/with-ionic-react\#bonus-profile-photos)

Every Supabase project is configured with [Storage](https://supabase.com/docs/guides/storage) for managing large files like photos and videos.

### Create an upload widget [\#](https://supabase.com/docs/guides/getting-started/tutorials/with-ionic-react\#create-an-upload-widget)

First install two packages in order to interact with the user's camera.

```flex

```

[Capacitor](https://capacitorjs.com/) is a cross platform native runtime from Ionic that enables web apps to be deployed through the app store and provides access to native device API.

Ionic PWA elements is a companion package that will polyfill certain browser APIs that provide no user interface with custom Ionic UI.

With those packages installed we can update our `index.tsx` to include an additional bootstrapping call for the Ionic PWA Elements.

src/index.tsx

```flex

```

Then create an `AvatarComponent`.

src/components/Avatar.tsx

```flex

```

### Add the new widget [\#](https://supabase.com/docs/guides/getting-started/tutorials/with-ionic-react\#add-the-new-widget)

And then we can add the widget to the Account page:

src/pages/Account.tsx

```flex

```

At this stage you have a fully functional application!

### Is this helpful?

NoYes

### On this page

[Project setup](https://supabase.com/docs/guides/getting-started/tutorials/with-ionic-react#project-setup) [Create a project](https://supabase.com/docs/guides/getting-started/tutorials/with-ionic-react#create-a-project) [Set up the database schema](https://supabase.com/docs/guides/getting-started/tutorials/with-ionic-react#set-up-the-database-schema) [Get API details](https://supabase.com/docs/guides/getting-started/tutorials/with-ionic-react#get-api-details) [Building the app](https://supabase.com/docs/guides/getting-started/tutorials/with-ionic-react#building-the-app) [Initialize an Ionic React app](https://supabase.com/docs/guides/getting-started/tutorials/with-ionic-react#initialize-an-ionic-react-app) [Set up a login route](https://supabase.com/docs/guides/getting-started/tutorials/with-ionic-react#set-up-a-login-route) [Account page](https://supabase.com/docs/guides/getting-started/tutorials/with-ionic-react#account-page) [Launch!](https://supabase.com/docs/guides/getting-started/tutorials/with-ionic-react#launch) [Bonus: Profile photos](https://supabase.com/docs/guides/getting-started/tutorials/with-ionic-react#bonus-profile-photos) [Create an upload widget](https://supabase.com/docs/guides/getting-started/tutorials/with-ionic-react#create-an-upload-widget) [Add the new widget](https://supabase.com/docs/guides/getting-started/tutorials/with-ionic-react#add-the-new-widget)
