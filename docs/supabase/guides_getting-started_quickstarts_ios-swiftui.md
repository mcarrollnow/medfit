---
library: supabase
url: https://supabase.com/docs/guides/getting-started/quickstarts/ios-swiftui
title: Use Supabase with iOS and SwiftUI | Supabase Docs
scraped: 2025-10-23T16:59:02.345Z
---

Getting Started

# Use Supabase with iOS and SwiftUI

## Learn how to create a Supabase project, add some sample data to your database, and query the data from an iOS app.

* * *

1

### Create a Supabase project

Go to [database.new](https://database.new/) and create a new Supabase project.

Alternatively, you can create a project using the Management API:

```flex

```

When your project is up and running, go to the [Table Editor](https://supabase.com/dashboard/project/_/editor), create a new table and insert some data.

Alternatively, you can run the following snippet in your project's [SQL Editor](https://supabase.com/dashboard/project/_/sql/new). This will create a `instruments` table with some sample data.

```flex

```

Make the data in your table publicly readable by adding an RLS policy:

```flex

```

2

### Create an iOS SwiftUI app with Xcode

Open Xcode > New Project > iOS > App. You can skip this step if you already have a working app.

3

### Install the Supabase client library

Install Supabase package dependency using Xcode by following Apple's [tutorial](https://developer.apple.com/documentation/xcode/adding-package-dependencies-to-your-app).

Make sure to add `Supabase` product package as dependency to the application.

4

### Initialize the Supabase client

Create a new `Supabase.swift` file add a new Supabase instance using your project URL and public API (anon) key:

###### Project URL

No project found

To get your Project URL, [log in](https://supabase.com/dashboard).

###### Publishable key

No project found

To get your Publishable key, [log in](https://supabase.com/dashboard).

###### Anon key

No project found

To get your Anon key, [log in](https://supabase.com/dashboard).

###### Supabase.swift

```flex

```

5

### Create a data model for instruments

Create a decodable struct to deserialize the data from the database.

Add the following code to a new file named `Instrument.swift`.

###### Supabase.swift

```flex

```

6

### Query data from the app

Use a `task` to fetch the data from the database and display it using a `List`.

Replace the default `ContentView` with the following code.

###### ContentView.swift

```flex

```

7

### Start the app

Run the app on a simulator or a physical device by hitting `Cmd + R` on Xcode.
