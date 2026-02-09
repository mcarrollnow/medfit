---
library: supabase
url: https://supabase.com/docs/guides/functions/examples/elevenlabs-transcribe-speech
title: Transcription Telegram Bot | Supabase Docs
scraped: 2025-10-23T16:59:02.335Z
---

Edge Functions

# Transcription Telegram Bot

## Build a Telegram bot that transcribes audio and video messages in 99 languages using TypeScript with Deno in Supabase Edge Functions.

* * *

## Introduction [\#](https://supabase.com/docs/guides/functions/examples/elevenlabs-transcribe-speech\#introduction)

In this tutorial you will learn how to build a Telegram bot that transcribes audio and video messages in 99 languages using TypeScript and the ElevenLabs Scribe model via the [speech to text API](https://elevenlabs.io/speech-to-text).

To check out what the end result will look like, you can test out the [t.me/ElevenLabsScribeBot](https://t.me/ElevenLabsScribeBot)

Find the [example project on GitHub](https://github.com/elevenlabs/elevenlabs-examples/tree/main/examples/speech-to-text/telegram-transcription-bot).

## Requirements [\#](https://supabase.com/docs/guides/functions/examples/elevenlabs-transcribe-speech\#requirements)

- An ElevenLabs account with an [API key](https://supabase.com/app/settings/api-keys).
- A [Supabase](https://supabase.com/) account (you can sign up for a free account via [database.new](https://database.new/)).
- The [Supabase CLI](https://supabase.com/docs/guides/local-development) installed on your machine.
- The [Deno runtime](https://docs.deno.com/runtime/getting_started/installation/) installed on your machine and optionally [setup in your favourite IDE](https://docs.deno.com/runtime/getting_started/setup_your_environment).
- A [Telegram](https://telegram.org/) account.

## Setup [\#](https://supabase.com/docs/guides/functions/examples/elevenlabs-transcribe-speech\#setup)

### Register a Telegram bot [\#](https://supabase.com/docs/guides/functions/examples/elevenlabs-transcribe-speech\#register-a-telegram-bot)

Use the [BotFather](https://t.me/BotFather) to create a new Telegram bot. Run the `/newbot` command and follow the instructions to create a new bot. At the end, you will receive your secret bot token. Note it down securely for the next step.

![BotFather](https://supabase.com/docs/img/guides/functions/elevenlabs/bot-father.png)

### Create a Supabase project locally [\#](https://supabase.com/docs/guides/functions/examples/elevenlabs-transcribe-speech\#create-a-supabase-project-locally)

After installing the [Supabase CLI](https://supabase.com/docs/guides/local-development), run the following command to create a new Supabase project locally:

```flex

```

### Create a database table to log the transcription results [\#](https://supabase.com/docs/guides/functions/examples/elevenlabs-transcribe-speech\#create-a-database-table-to-log-the-transcription-results)

Next, create a new database table to log the transcription results:

```flex

```

This will create a new migration file in the `supabase/migrations` directory. Open the file and add the following SQL:

```flex

```

### Create a Supabase Edge Function to handle Telegram webhook requests [\#](https://supabase.com/docs/guides/functions/examples/elevenlabs-transcribe-speech\#create-a-supabase-edge-function-to-handle-telegram-webhook-requests)

Next, create a new Edge Function to handle Telegram webhook requests:

```flex

```

If you're using VS Code or Cursor, select `y` when the CLI prompts "Generate VS Code settings for Deno? \[y/N\]"!

### Set up the environment variables [\#](https://supabase.com/docs/guides/functions/examples/elevenlabs-transcribe-speech\#set-up-the-environment-variables)

Within the `supabase/functions` directory, create a new `.env` file and add the following variables:

```flex

```

### Dependencies [\#](https://supabase.com/docs/guides/functions/examples/elevenlabs-transcribe-speech\#dependencies)

The project uses a couple of dependencies:

- The open-source [grammY Framework](https://grammy.dev/) to handle the Telegram webhook requests.
- The [@supabase/supabase-js](https://supabase.com/docs/reference/javascript) library to interact with the Supabase database.
- The ElevenLabs [JavaScript SDK](https://supabase.com/docs/quickstart) to interact with the speech-to-text API.

Since Supabase Edge Function uses the [Deno runtime](https://deno.land/), you don't need to install the dependencies, rather you can [import](https://docs.deno.com/examples/npm/) them via the `npm:` prefix.

## Code the Telegram bot [\#](https://supabase.com/docs/guides/functions/examples/elevenlabs-transcribe-speech\#code-the-telegram-bot)

In your newly created `scribe-bot/index.ts` file, add the following code:

```flex

```

## Deploy to Supabase [\#](https://supabase.com/docs/guides/functions/examples/elevenlabs-transcribe-speech\#deploy-to-supabase)

If you haven't already, create a new Supabase account at [database.new](https://database.new/) and link the local project to your Supabase account:

```flex

```

### Apply the database migrations [\#](https://supabase.com/docs/guides/functions/examples/elevenlabs-transcribe-speech\#apply-the-database-migrations)

Run the following command to apply the database migrations from the `supabase/migrations` directory:

```flex

```

Navigate to the [table editor](https://supabase.com/dashboard/project/_/editor) in your Supabase dashboard and you should see and empty `transcription_logs` table.

![Empty table](https://supabase.com/docs/img/guides/functions/elevenlabs/supa-empty-table.png)

Lastly, run the following command to deploy the Edge Function:

```flex

```

Navigate to the [Edge Functions view](https://supabase.com/dashboard/project/_/functions) in your Supabase dashboard and you should see the `scribe-bot` function deployed. Make a note of the function URL as you'll need it later, it should look something like `https://<project-ref>.functions.supabase.co/scribe-bot`.

![Edge Function deployed](https://supabase.com/docs/img/guides/functions/elevenlabs/supa-edge-function-deployed.png)

### Set up the webhook [\#](https://supabase.com/docs/guides/functions/examples/elevenlabs-transcribe-speech\#set-up-the-webhook)

Set your bot's webhook URL to `https://<PROJECT_REFERENCE>.functions.supabase.co/telegram-bot` (Replacing `<...>` with respective values). In order to do that, run a GET request to the following URL (in your browser, for example):

```flex

```

Note that the `FUNCTION_SECRET` is the secret you set in your `.env` file.

![Set webhook](https://supabase.com/docs/img/guides/functions/elevenlabs/set-webhook.png)

### Set the function secrets [\#](https://supabase.com/docs/guides/functions/examples/elevenlabs-transcribe-speech\#set-the-function-secrets)

Now that you have all your secrets set locally, you can run the following command to set the secrets in your Supabase project:

```flex

```

## Test the bot [\#](https://supabase.com/docs/guides/functions/examples/elevenlabs-transcribe-speech\#test-the-bot)

Finally you can test the bot by sending it a voice message, audio or video file.

![Test the bot](https://supabase.com/docs/img/guides/functions/elevenlabs/test-bot.png)

After you see the transcript as a reply, navigate back to your table editor in the Supabase dashboard and you should see a new row in your `transcription_logs` table.

![New row in table](https://supabase.com/docs/img/guides/functions/elevenlabs/supa-new-row.png)

Watch video guide

![Video guide preview](https://supabase.com/docs/_next/image?url=https%3A%2F%2Fimg.youtube.com%2Fvi%2FCE4iPp7kd7Q%2F0.jpg&w=3840&q=75)

### Is this helpful?

NoYes

### On this page

[Introduction](https://supabase.com/docs/guides/functions/examples/elevenlabs-transcribe-speech#introduction) [Requirements](https://supabase.com/docs/guides/functions/examples/elevenlabs-transcribe-speech#requirements) [Setup](https://supabase.com/docs/guides/functions/examples/elevenlabs-transcribe-speech#setup) [Register a Telegram bot](https://supabase.com/docs/guides/functions/examples/elevenlabs-transcribe-speech#register-a-telegram-bot) [Create a Supabase project locally](https://supabase.com/docs/guides/functions/examples/elevenlabs-transcribe-speech#create-a-supabase-project-locally) [Create a database table to log the transcription results](https://supabase.com/docs/guides/functions/examples/elevenlabs-transcribe-speech#create-a-database-table-to-log-the-transcription-results) [Create a Supabase Edge Function to handle Telegram webhook requests](https://supabase.com/docs/guides/functions/examples/elevenlabs-transcribe-speech#create-a-supabase-edge-function-to-handle-telegram-webhook-requests) [Set up the environment variables](https://supabase.com/docs/guides/functions/examples/elevenlabs-transcribe-speech#set-up-the-environment-variables) [Dependencies](https://supabase.com/docs/guides/functions/examples/elevenlabs-transcribe-speech#dependencies) [Code the Telegram bot](https://supabase.com/docs/guides/functions/examples/elevenlabs-transcribe-speech#code-the-telegram-bot) [Deploy to Supabase](https://supabase.com/docs/guides/functions/examples/elevenlabs-transcribe-speech#deploy-to-supabase) [Apply the database migrations](https://supabase.com/docs/guides/functions/examples/elevenlabs-transcribe-speech#apply-the-database-migrations) [Set up the webhook](https://supabase.com/docs/guides/functions/examples/elevenlabs-transcribe-speech#set-up-the-webhook) [Set the function secrets](https://supabase.com/docs/guides/functions/examples/elevenlabs-transcribe-speech#set-the-function-secrets) [Test the bot](https://supabase.com/docs/guides/functions/examples/elevenlabs-transcribe-speech#test-the-bot)
