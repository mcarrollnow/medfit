---
library: supabase
url: https://supabase.com/docs/reference/csharp/introduction
title: C# API Reference | Supabase Docs
scraped: 2025-10-23T16:59:02.334Z
---

C# Reference v1.0

# C\# Client Library

supabase [View on GitHub](https://github.com/supabase-community/supabase-csharp)

This reference documents every object and method available in Supabase's C# library, [supabase](https://www.nuget.org/packages/supabase). You can use `Supabase` to interact with your Postgres database, listen to database changes, invoke Deno Edge Functions, build login and user management functionality, and manage large files.

The C# client library is created and maintained by the Supabase community, and is not an official library. Please be tolerant of areas where the library is still being developed, and — as with all the libraries — feel free to contribute wherever you find issues.

Huge thanks to official maintainer, [Joseph Schultz](https://github.com/acupofjose). As well as [Will Iverson](https://github.com/wiverson), [Ben Randall](https://github.com/veleek), and [Rhuan Barros](https://github.com/rhuanbarros) for their help.

* * *

## Installing

### Install from NuGet [\#](https://supabase.com/docs/reference/csharp/introduction\#install-from-nuget)

You can install Supabase package from [nuget.org](https://www.nuget.org/packages/supabase/)

Terminal

```flex

```

* * *

## Initializing

Initializing a new client is pretty straightforward. Find your project url and public key from the admin panel and pass it into your client initialization function.

`Supabase` is heavily dependent on Models deriving from `BaseModel`. To interact with the API, one must have the associated model (see example) specified.

Leverage `Table`, `PrimaryKey`, and `Column` attributes to specify names of classes/properties that are different from their C# Versions.

StandardDependency Injection (Maui-like)With Models Example

```flex

```

* * *

## Fetch data

Performs vertical filtering with SELECT.

- **LINQ expressions do not currently support parsing embedded resource columns. For these cases, `string` will need to be used.**
- **When using string Column Names to select, they must match names in database, not names specified on model properties.**
- Additional information on modeling + querying Joins and Inner Joins can be found [in the `postgrest-csharp README`](https://github.com/supabase-community/postgrest-csharp/blob/master/README.md#foreign-keys-join-tables-and-relationships)
- By default, Supabase projects will return a maximum of 1,000 rows. This setting can be changed in Project API Settings. It's recommended that you keep it low to limit the payload size of accidental or malicious requests. You can use `range()` queries to paginate through your data.
- `From()` can be combined with [Modifiers](https://supabase.com/docs/reference/csharp/using-modifiers)
- `From()` can be combined with [Filters](https://supabase.com/docs/reference/csharp/using-filters)
- If using the Supabase hosted platform `apikey` is technically a reserved keyword, since the API gateway will pluck it out for authentication. [It should be avoided as a column name](https://github.com/supabase/supabase/issues/5465).

Getting your dataSelecting specific columnsQuery foreign tablesFiltering with inner joinsQuerying with count optionQuerying JSON data

```flex

```

* * *

## Insert data

Performs an INSERT into the table.

Create a recordBulk createFetch inserted record

```flex

```

* * *

## Update data

Performs an UPDATE on the table.

- `Update()` is typically called using a model as an argument or from a hydrated model.

Update your data using FilterUpdate your data

```flex

```

* * *

## Upsert data

Performs an UPSERT into the table.

- Primary keys should be included in the data payload in order for an update to work correctly.
- Primary keys must be natural, not surrogate. There are however, [workarounds](https://github.com/PostgREST/postgrest/issues/1118) for surrogate primary keys.

Upsert your dataUpserting into tables with constraintsReturn the exact number of rows

```flex

```

* * *

## Delete data

Performs a DELETE on the table.

- `Delete()` should always be combined with [Filters](https://supabase.com/docs/reference/csharp/using-filters) to target the item(s) you wish to delete.

Delete records

```flex

```

* * *

## Call a Postgres function

You can call stored procedures as a "Remote Procedure Call".

That's a fancy way of saying that you can put some logic into your database then call it from anywhere. It's especially useful when the logic rarely changes - like password resets and updates.

Call a stored procedureWith Parameters

```flex

```

Notes

* * *

## Using filters

Filters allow you to only return rows that match certain conditions.

Filters can be used on `Select()`, `Update()`, and `Delete()` queries.

**Note: LINQ expressions do not currently support parsing embedded resource columns. For these cases, `string` will need to be used.**

Applying FiltersFilter by values within a JSON columnFilter Foreign Tables

```flex

```

* * *

## Column is equal to a value

Finds all rows whose value on the stated `column` exactly matches the specified `value`.

With \`Select()\`

```flex

```

* * *

## Column is not equal to a value

Finds all rows whose value on the stated `column` doesn't match the specified `value`.

With \`Select()\`

```flex

```

* * *

## Column is greater than a value

Finds all rows whose value on the stated `column` is greater than the specified `value`.

With \`Select()\`

```flex

```

* * *

## Column is greater than or equal to a value

Finds all rows whose value on the stated `column` is greater than or equal to the specified `value`.

With \`Select()\`

```flex

```

* * *

## Column is less than a value

Finds all rows whose value on the stated `column` is less than the specified `value`.

With \`Select()\`

```flex

```

* * *

## Column is less than or equal to a value

Finds all rows whose value on the stated `column` is less than or equal to the specified `value`.

With \`Select()\`

```flex

```

* * *

## Column matches a pattern

Finds all rows whose value in the stated `column` matches the supplied `pattern` (case sensitive).

With \`Select()\`

```flex

```

* * *

## Column matches a case-insensitive pattern

Finds all rows whose value in the stated `column` matches the supplied `pattern` (case insensitive).

With \`Select()\`

```flex

```

* * *

## Column is a value

A check for exact equality (null, true, false), finds all rows whose value on the stated `column` exactly match the specified `value`.

With \`Select()\`

```flex

```

* * *

## Column is in an array

Finds all rows whose value on the stated `column` is found on the specified `values`.

With \`Select()\`

```flex

```

* * *

## Column contains every element in a value

With \`Select()\`

```flex

```

* * *

## Contained by value

With \`Select()\`

```flex

```

* * *

## Match a string

Finds all rows whose tsvector value on the stated `column` matches to\_tsquery(query).

Text searchBasic normalizationFull normalizationWebsearch

```flex

```

* * *

## Match an associated value

- Finds a model given a class (useful when hydrating models and correlating with database)
- Finds all rows whose columns match the specified `Dictionary<string, string>` object.

With ModelWith Dictionary

```flex

```

* * *

## Don't match the filter

Finds all rows which doesn't satisfy the filter.

With \`Select()\`

```flex

```

* * *

## Match at least one filter

Finds all rows satisfying at least one of the filters.

With \`Select()\`Use \`or\` with \`and\`

```flex

```

* * *

## Using modifiers

Filters work on the row level—they allow you to return rows that only match certain conditions without changing the shape of the rows. Modifiers are everything that don't fit that definition—allowing you to change the format of the response (e.g., setting a limit or offset).

* * *

## Order the results

Orders the result with the specified column.

With \`Select()\`With embedded resourcesOrder parent table by a referenced table

```flex

```

* * *

## Limit the number of rows returned

Limits the result with the specified count.

With \`Select()\`With embedded resources

```flex

```

* * *

## Limit the query to a range

Limits the result to rows within the specified range, inclusive.

With \`Select()\`

```flex

```

* * *

## Retrieve one row of data

Retrieves only one row from the result. Result must be one row (e.g. using limit), otherwise this will result in an error.

With \`Select()\`

```flex

```

* * *

## Create a new user

Creates a new user.

- By default, the user needs to verify their email address before logging in. To turn this off, disable **Confirm email** in [your project](https://supabase.com/dashboard/project/_/auth/providers).
- **Confirm email** determines if users need to confirm their email address after signing up.
  - If **Confirm email** is enabled, a `user` is returned but `session` is null.
  - If **Confirm email** is disabled, both a `user` and a `session` are returned.
- When the user confirms their email address, they are redirected to the [`SITE_URL`](https://supabase.com/docs/guides/auth/concepts/redirect-urls) by default. You can modify your `SITE_URL` or add additional redirect URLs in [your project](https://supabase.com/dashboard/project/_/auth/url-configuration).
- If SignUp() is called for an existing confirmed user:
  - When both **Confirm email** and **Confirm phone** (even when phone provider is disabled) are enabled in [your project](https://supabase.com/dashboard/project/_/auth/providers), an obfuscated/fake user object is returned.
  - When either **Confirm email** or **Confirm phone** (even when phone provider is disabled) is disabled, the error message, `User already registered` is returned.

Sign up.

```flex

```

* * *

## Listen to auth events

Receive a notification every time an auth event happens.

- Types of auth events: `AuthState.SignedIn`, `AuthState.SignedOut`, `AuthState.UserUpdated`, `AuthState.PasswordRecovery`, `AuthState.TokenRefreshed`

Listen to auth changes

```flex

```

* * *

## Sign in a user

Log in an existing user using email or phone number with password.

- Requires either an email and password or a phone number and password.

Sign in with email and passwordSign in with phone and password

```flex

```

* * *

## Sign in a user through OTP

- Requires either an email or phone number.
- This method is used for passwordless sign-ins where a OTP is sent to the user's email or phone number.
- If you're using an email, you can configure whether you want the user to receive a magiclink or a OTP.
- If you're using phone, you can configure whether you want the user to receive a OTP.
- The magic link's destination URL is determined by the [`SITE_URL`](https://supabase.com/docs/guides/auth/concepts/redirect-urls). You can modify the `SITE_URL` or add additional redirect urls in [your project](https://supabase.com/dashboard/project/_/auth/settings).

Send Magic Link.Sign in with SMS OTP.

```flex

```

Notes

* * *

## Sign in a user through OAuth

Signs the user in using third party OAuth providers.

- This method is used for signing in using a third-party provider.
- Supabase supports many different [third-party providers](https://supabase.com/docs/guides/auth#providers).

Sign in using a third-party providerWith scopes

```flex

```

* * *

## Sign out a user

Signs out the current user, if there is a logged in user.

- In order to use the `SignOut()` method, the user needs to be signed in first.

Sign out

```flex

```

* * *

## Verify and log in through OTP

- The `VerifyOtp` method takes in different verification types. If a phone number is used, the type can either be `sms` or `phone_change`. If an email address is used, the type can be one of the following: `signup`, `magiclink`, `recovery`, `invite` or `email_change`.
- The verification type used should be determined based on the corresponding auth method called before `VerifyOtp` to sign up / sign-in a user.

Verify Sms One-Time Password (OTP)

```flex

```

* * *

## Retrieve a session

Returns the session data, if there is an active session.

Get the session data

```flex

```

* * *

## Retrieve a user

Returns the user data, if there is a logged in user.

Get the logged in user

```flex

```

* * *

## Update a user

Updates user data, if there is a logged in user.

- In order to use the `UpdateUser()` method, the user needs to be signed in first.
- By Default, email updates sends a confirmation link to both the user's current and new email. To only send a confirmation link to the user's new email, disable **Secure email change** in your project's [email auth provider settings](https://supabase.com/dashboard/project/_/auth/settings).

Update the email for an authenticated userUpdate the password for an authenticated userUpdate the user's metadata

```flex

```

Notes

* * *

## Invokes a Supabase Edge Function.

Invokes a Supabase Function. See the [guide](https://supabase.com/docs/guides/functions) for details on writing Functions.

- Requires an Authorization header.
- Invoke params generally match the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) spec.

Basic invocation.Modeled invocation

```flex

```

* * *

## Subscribe to channel

Subscribe to realtime changes in your database.

- Realtime is disabled by default for new Projects for better database performance and security. You can turn it on by [managing replication](https://supabase.com/docs/guides/api#managing-realtime).
- If you want to receive the "previous" data for updates and deletes, you will need to set `REPLICA IDENTITY` to `FULL`, like this: `ALTER TABLE your_table REPLICA IDENTITY FULL;`

Listen to broadcast messagesListen to presence syncListening to a specific tableListen to all database changesListening to insertsListening to updatesListening to deletesListening to row level changes

```flex

```

* * *

## Unsubscribe from a channel

Unsubscribes and removes Realtime channel from Realtime client.

- Removing a channel is a great way to maintain the performance of your project's Realtime service as well as your database if you're listening to Postgres changes. Supabase will automatically handle cleanup 30 seconds after a client is disconnected, but unused channels may cause degradation as more clients are simultaneously subscribed.

Remove a channel

```flex

```

* * *

## Retrieve all channels

Returns all Realtime channels.

Get all channels

```flex

```

* * *

## Create a bucket

Creates a new Storage bucket

- Policy permissions required:
  - `buckets` permissions: `insert`
  - `objects` permissions: none

Create bucket

```flex

```

* * *

## Retrieve a bucket

Retrieves the details of an existing Storage bucket.

- Policy permissions required:
  - `buckets` permissions: `select`
  - `objects` permissions: none

Get bucket

```flex

```

* * *

## List all buckets

Retrieves the details of all Storage buckets within an existing product.

- Policy permissions required:
  - `buckets` permissions: `select`
  - `objects` permissions: none

List buckets

```flex

```

* * *

## Update a bucket

Updates a new Storage bucket

- Policy permissions required:
  - `buckets` permissions: `update`
  - `objects` permissions: none

Update bucket

```flex

```

* * *

## Delete a bucket

Deletes an existing bucket. A bucket can't be deleted with existing objects inside it. You must first `empty()` the bucket.

- Policy permissions required:
  - `buckets` permissions: `select` and `delete`
  - `objects` permissions: none

Delete bucket

```flex

```

* * *

## Empty a bucket

Removes all objects inside a single bucket.

- Policy permissions required:
  - `buckets` permissions: `select`
  - `objects` permissions: `select` and `delete`

Empty bucket

```flex

```

* * *

## Upload a file

Uploads a file to an existing bucket.

- Policy permissions required:
  - `buckets` permissions: none
  - `objects` permissions: `insert`

Upload fileUpload file with Progress

```flex

```

* * *

## Download a file

Downloads a file.

- Policy permissions required:
  - `buckets` permissions: none
  - `objects` permissions: `select`

Download fileDownload file with Progress

```flex

```

* * *

## List all files in a bucket

Lists all the files within a bucket.

- Policy permissions required:
  - `buckets` permissions: none
  - `objects` permissions: `select`

List files in a bucket

```flex

```

* * *

## Replace an existing file

Replaces an existing file at the specified path with a new one.

- Policy permissions required:
  - `buckets` permissions: none
  - `objects` permissions: `update` and `select`

Update file

```flex

```

* * *

## Move an existing file

Moves an existing file, optionally renaming it at the same time.

- Policy permissions required:
  - `buckets` permissions: none
  - `objects` permissions: `update` and `select`

Move file

```flex

```

* * *

## Delete files in a bucket

Deletes files within the same bucket

- Policy permissions required:
  - `buckets` permissions: none
  - `objects` permissions: `delete` and `select`

Delete file

```flex

```

* * *

## Create a signed URL

Create signed url to download file without requiring permissions. This URL can be valid for a set number of seconds.

- Policy permissions required:
  - `buckets` permissions: none
  - `objects` permissions: `select`

Create Signed URL

```flex

```

* * *

## Retrieve public URL

Retrieve URLs for assets in public buckets

- The bucket needs to be set to public, either via [UpdateBucket()](https://supabase.com/docs/reference/csharp/storage-updatebucket) or by going to Storage on [supabase.com/dashboard](https://supabase.com/dashboard), clicking the overflow menu on a bucket and choosing "Make public"
- Policy permissions required:
  - `buckets` permissions: none
  - `objects` permissions: none

Returns the URL for an asset in a public bucket

```flex

```

* * *

## Release Notes

## 1.0.0 - 2024-04-21 [\#](https://supabase.com/docs/reference/csharp/introduction\#100---2024-04-21)

- Assembly Name has been changed to `Supabase.dll`
- Update dependency: `postgrest-csharp@5.0.0`
  - \[MAJOR\] Moves namespaces from `Postgrest` to `Supabase.Postgrest`
  - Re: [#135](https://github.com/supabase-community/supabase-csharp/issues/135) Update nuget package
    name `postgrest-csharp` to `Supabase.Postgrest`
- Update dependency: `gotrue-csharp@5.0.0`
  - Re: [#135](https://supabase.com/docs/reference/csharp/supabase-community/supabase-csharp#135) Update nuget package name `gotrue-csharp` to `Supabase.Gotrue`
  - Re: [#89](https://github.com/supabase-community/gotrue-csharp/issues/89), Only add `access_token` to request body
    when it is explicitly declared.
  - \[MINOR\] Re: [#89](https://github.com/supabase-community/gotrue-csharp/issues/89) Update signature
    for `SignInWithIdToken` which adds an optional `accessToken` parameter, update doc comments, and
    call `DestroySession` in method
  - Re: [#88](https://github.com/supabase-community/gotrue-csharp/issues/88), Add `IsAnonymous` property to `User`
  - Re: [#90](https://github.com/supabase-community/gotrue-csharp/issues/90) Implement `LinkIdentity`
    and `UnlinkIdentity`
- Update dependency: `realtime-csharp@7.0.0`
  - Merges [#45](https://github.com/supabase-community/realtime-csharp/pull/45) \- Updating
    the `Websocket.Client@5.1.1`
  - Re: [#135](https://github.com/supabase-community/supabase-csharp/issues/135) Update nuget package
    name `realtime-csharp` to `Supabase.Realtime`
- Update dependency: `storage-csharp@2.0.0`
  - Re: [#135](https://github.com/supabase-community/supabase-csharp/issues/135) Update nuget package
    name `storage-csharp` to `Supabase.Storage`
- Update dependency: `functions-csharp@2.0.0`
  - Re: [#135](https://github.com/supabase-community/supabase-csharp/issues/135) Update nuget package
    name `functions-csharp` to `Supabase.Functions`
- Update dependency: `core-csharp@1.0.0`
  - Re: [#135](https://github.com/supabase-community/supabase-csharp/issues/135) Update nuget package
    name `supabase-core`
    to `Supabase.Core`
- Adds comments to the remaining undocumented code.
