---
library: supabase
url: https://supabase.com/docs/guides/functions/examples/send-emails
title: Sending Emails | Supabase Docs
scraped: 2025-10-23T16:59:02.340Z
---

Edge Functions

# Sending Emails

* * *

Sending emails from Edge Functions using the [Resend API](https://resend.com/).

### Prerequisites [\#](https://supabase.com/docs/guides/functions/examples/send-emails\#prerequisites)

To get the most out of this guide, you’ll need to:

- [Create an API key](https://resend.com/api-keys)
- [Verify your domain](https://resend.com/domains)

Make sure you have the latest version of the [Supabase CLI](https://supabase.com/docs/guides/cli#installation) installed.

### 1\. Create Supabase function [\#](https://supabase.com/docs/guides/functions/examples/send-emails\#1-create-supabase-function)

Create a new function locally:

```flex

```

Store the `RESEND_API_KEY` in your `.env` file.

### 2\. Edit the handler function [\#](https://supabase.com/docs/guides/functions/examples/send-emails\#2-edit-the-handler-function)

Paste the following code into the `index.ts` file:

```flex

```

### 3\. Deploy and send email [\#](https://supabase.com/docs/guides/functions/examples/send-emails\#3-deploy-and-send-email)

Run function locally:

```flex

```

Test it: [http://localhost:54321/functions/v1/resend](http://localhost:54321/functions/v1/resend)

Deploy function to Supabase:

```flex

```

When you deploy to Supabase, make sure that your `RESEND_API_KEY` is set in [Edge Function Secrets Management](https://supabase.com/dashboard/project/_/settings/functions)

Open the endpoint URL to send an email:

### 4\. Try it yourself [\#](https://supabase.com/docs/guides/functions/examples/send-emails\#4-try-it-yourself)

Find the complete example on [GitHub](https://github.com/resendlabs/resend-supabase-edge-functions-example).

Watch video guide

![Video guide preview](https://supabase.com/docs/_next/image?url=https%3A%2F%2Fimg.youtube.com%2Fvi%2FQf7XvL1fjvo%2F0.jpg&w=3840&q=75)

### Is this helpful?

NoYes

### On this page

[Prerequisites](https://supabase.com/docs/guides/functions/examples/send-emails#prerequisites) [1\. Create Supabase function](https://supabase.com/docs/guides/functions/examples/send-emails#1-create-supabase-function) [2\. Edit the handler function](https://supabase.com/docs/guides/functions/examples/send-emails#2-edit-the-handler-function) [3\. Deploy and send email](https://supabase.com/docs/guides/functions/examples/send-emails#3-deploy-and-send-email) [4\. Try it yourself](https://supabase.com/docs/guides/functions/examples/send-emails#4-try-it-yourself)
