---
library: supabase
url: https://supabase.com/docs/guides/functions/examples/discord-bot
title: Building a Discord Bot | Supabase Docs
scraped: 2025-10-23T16:59:02.324Z
---

Edge Functions

# Building a Discord Bot

* * *

Discord Bots with Edge Functions - YouTube

[Photo image of Supabase](https://www.youtube.com/channel/UCNTVzV1InxHV-YR0fSajqPQ?embeds_referring_euri=https%3A%2F%2Fsupabase.com%2F)

Supabase

66.9K subscribers

[Discord Bots with Edge Functions](https://www.youtube.com/watch?v=J24Bvo_m7DM)

Supabase

Search

Info

Shopping

Tap to unmute

If playback doesn't begin shortly, try restarting your device.

You're signed out

Videos you watch may be added to the TV's watch history and influence TV recommendations. To avoid this, cancel and sign in to YouTube on your computer.

CancelConfirm

Share

Include playlist

An error occurred while retrieving sharing information. Please try again later.

Watch later

Share

Copy link

Watch on

0:00

/
•Live

•

## Create an application on Discord Developer portal [\#](https://supabase.com/docs/guides/functions/examples/discord-bot\#create-an-application-on-discord-developer-portal)

1. Go to [https://discord.com/developers/applications](https://discord.com/developers/applications) (login using your discord account if required).
2. Click on **New Application** button available at left side of your profile picture.
3. Name your application and click on **Create**.
4. Go to **Bot** section, click on **Add Bot**, and finally on **Yes, do it!** to confirm.

A new application is created which will hold our Slash Command. Don't close the tab as we need information from this application page throughout our development.

Before we can write some code, we need to curl a discord endpoint to register a Slash Command in our app.

Fill `DISCORD_BOT_TOKEN` with the token available in the **Bot** section and `CLIENT_ID` with the ID available on the **General Information** section of the page and run the command on your terminal.

```flex

```

This will register a Slash Command named `hello` that accepts a parameter named `name` of type string.

## Code [\#](https://supabase.com/docs/guides/functions/examples/discord-bot\#code)

```flex

```

## Deploy the slash command handler [\#](https://supabase.com/docs/guides/functions/examples/discord-bot\#deploy-the-slash-command-handler)

```flex

```

Navigate to your Function details in the Supabase Dashboard to get your Endpoint URL.

### Configure Discord application to use our URL as interactions endpoint URL [\#](https://supabase.com/docs/guides/functions/examples/discord-bot\#configure-discord-application-to-use-our-url-as-interactions-endpoint-url)

1. Go back to your application (Greeter) page on Discord Developer Portal
2. Fill **INTERACTIONS ENDPOINT URL** field with the URL and click on **Save Changes**.

The application is now ready. Let's proceed to the next section to install it.

## Install the slash command on your Discord server [\#](https://supabase.com/docs/guides/functions/examples/discord-bot\#install-the-slash-command-on-your-discord-server)

So to use the `hello` Slash Command, we need to install our Greeter application on our Discord server. Here are the steps:

1. Go to **OAuth2** section of the Discord application page on Discord Developer Portal
2. Select `applications.commands` scope and click on the **Copy** button below.
3. Now paste and visit the URL on your browser. Select your server and click on **Authorize**.

Open Discord, type `/Promise` and press **Enter**.

## Run locally [\#](https://supabase.com/docs/guides/functions/examples/discord-bot\#run-locally)

```flex

```

### Is this helpful?

NoYes

### On this page

[Create an application on Discord Developer portal](https://supabase.com/docs/guides/functions/examples/discord-bot#create-an-application-on-discord-developer-portal) [Code](https://supabase.com/docs/guides/functions/examples/discord-bot#code) [Deploy the slash command handler](https://supabase.com/docs/guides/functions/examples/discord-bot#deploy-the-slash-command-handler) [Configure Discord application to use our URL as interactions endpoint URL](https://supabase.com/docs/guides/functions/examples/discord-bot#configure-discord-application-to-use-our-url-as-interactions-endpoint-url) [Install the slash command on your Discord server](https://supabase.com/docs/guides/functions/examples/discord-bot#install-the-slash-command-on-your-discord-server) [Run locally](https://supabase.com/docs/guides/functions/examples/discord-bot#run-locally)
