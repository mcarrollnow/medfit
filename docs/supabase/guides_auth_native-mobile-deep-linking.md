---
library: supabase
url: https://supabase.com/docs/guides/auth/native-mobile-deep-linking
title: Native Mobile Deep Linking | Supabase Docs
scraped: 2025-10-23T16:59:02.324Z
---

Auth

# Native Mobile Deep Linking

## Set up Deep Linking for mobile applications.

* * *

Many Auth methods involve a redirect to your app. For example:

- Signup confirmation emails, Magic Link signins, and password reset emails contain a link that redirects to your app.
- In OAuth signins, an automatic redirect occurs to your app.

With Deep Linking, you can configure this redirect to open a specific page. This is necessary if, for example, you need to display a form for [password reset](https://supabase.com/docs/guides/auth/passwords#resetting-a-users-password-forgot-password), or to manually exchange a token hash.

## Setting up deep linking [\#](https://supabase.com/docs/guides/auth/native-mobile-deep-linking\#setting-up-deep-linking)

Expo React NativeFlutterSwiftAndroid Kotlin

To link to your development build or standalone app, you need to specify a custom URL scheme for your app. You can register a scheme in your app config (app.json, app.config.js) by adding a string under the `scheme` key:

```flex

```

In your project's [auth settings](https://supabase.com/dashboard/project/_/auth/url-configuration) add the redirect URL, e.g. `com.supabase://**`.

Finally, implement the OAuth and linking handlers. See the [supabase-js reference](https://supabase.com/docs/reference/javascript/initializing?example=react-native-options-async-storage) for instructions on initializing the supabase-js client in React Native.

```flex

```

For the best user experience it is recommended to use universal links which require a more elaborate setup. You can find the detailed setup instructions in the [Expo docs](https://docs.expo.dev/guides/deep-linking/).

Watch video guide

![Video guide preview](https://supabase.com/docs/_next/image?url=https%3A%2F%2Fimg.youtube.com%2Fvi%2F8TZ6O1C8ujE%2F0.jpg&w=3840&q=75)

### Is this helpful?

NoYes

### On this page

[Setting up deep linking](https://supabase.com/docs/guides/auth/native-mobile-deep-linking#setting-up-deep-linking)
