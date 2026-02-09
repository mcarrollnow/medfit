Advanced: Vercel Deployment Guide

[](https://vercel.com/)

[

AI SDK



](../../index.html)

-   [Docs](../introduction.html)
-   [Cookbook](../../cookbook.html)
-   [Providers](../../providers/ai-sdk-providers.html)
-   [Playground](../../playground.html)
-   [
    
    AI ElementsAI Elements
    
    ](../../elements/overview.html)
-   [AI GatewayGateway](https://vercel.com/ai-gateway)

AI SDK 5 is available now.

[View Announcement](https://vercel.com/blog/ai-sdk-5)

Menu

[AI SDK by Vercel](../introduction.html)

[Foundations](../foundations.html)

[Overview](../foundations/overview.html)

[Providers and Models](../foundations/providers-and-models.html)

[Prompts](../foundations/prompts.html)

[Tools](../foundations/tools.html)

[Streaming](../foundations/streaming.html)

[Getting Started](../getting-started.html)

[Navigating the Library](../getting-started/navigating-the-library.html)

[Next.js App Router](../getting-started/nextjs-app-router.html)

[Next.js Pages Router](../getting-started/nextjs-pages-router.html)

[Svelte](../getting-started/svelte.html)

[Vue.js (Nuxt)](../getting-started/nuxt.html)

[Node.js](../getting-started/nodejs.html)

[Expo](../getting-started/expo.html)

[Agents](../agents.html)

[Agents](../agents/overview.html)

[Building Agents](../agents/building-agents.html)

[Workflow Patterns](../agents/workflows.html)

[Loop Control](../agents/loop-control.html)

[AI SDK Core](../ai-sdk-core.html)

[Overview](../ai-sdk-core/overview.html)

[Generating Text](../ai-sdk-core/generating-text.html)

[Generating Structured Data](../ai-sdk-core/generating-structured-data.html)

[Tool Calling](../ai-sdk-core/tools-and-tool-calling.html)

[Model Context Protocol (MCP) Tools](../ai-sdk-core/mcp-tools.html)

[Prompt Engineering](../ai-sdk-core/prompt-engineering.html)

[Settings](../ai-sdk-core/settings.html)

[Embeddings](../ai-sdk-core/embeddings.html)

[Image Generation](../ai-sdk-core/image-generation.html)

[Transcription](../ai-sdk-core/transcription.html)

[Speech](../ai-sdk-core/speech.html)

[Language Model Middleware](../ai-sdk-core/middleware.html)

[Provider & Model Management](../ai-sdk-core/provider-management.html)

[Error Handling](../ai-sdk-core/error-handling.html)

[Testing](../ai-sdk-core/testing.html)

[Telemetry](../ai-sdk-core/telemetry.html)

[AI SDK UI](../ai-sdk-ui.html)

[Overview](../ai-sdk-ui/overview.html)

[Chatbot](../ai-sdk-ui/chatbot.html)

[Chatbot Message Persistence](../ai-sdk-ui/chatbot-message-persistence.html)

[Chatbot Resume Streams](../ai-sdk-ui/chatbot-resume-streams.html)

[Chatbot Tool Usage](../ai-sdk-ui/chatbot-tool-usage.html)

[Generative User Interfaces](../ai-sdk-ui/generative-user-interfaces.html)

[Completion](../ai-sdk-ui/completion.html)

[Object Generation](../ai-sdk-ui/object-generation.html)

[Streaming Custom Data](../ai-sdk-ui/streaming-data.html)

[Error Handling](../ai-sdk-ui/error-handling.html)

[Transport](../ai-sdk-ui/transport.html)

[Reading UIMessage Streams](../ai-sdk-ui/reading-ui-message-streams.html)

[Message Metadata](../ai-sdk-ui/message-metadata.html)

[Stream Protocols](../ai-sdk-ui/stream-protocol.html)

[AI SDK RSC](../ai-sdk-rsc.html)

[Advanced](../advanced.html)

[Prompt Engineering](prompt-engineering.html)

[Stopping Streams](stopping-streams.html)

[Backpressure](backpressure.html)

[Caching](caching.html)

[Multiple Streamables](multiple-streamables.html)

[Rate Limiting](rate-limiting.html)

[Rendering UI with Language Models](rendering-ui-with-language-models.html)

[Language Models as Routers](model-as-router.html)

[Multistep Interfaces](multistep-interfaces.html)

[Sequential Generations](sequential-generations.html)

[Vercel Deployment Guide](vercel-deployment-guide.html)

[Reference](../reference.html)

[AI SDK Core](../reference/ai-sdk-core.html)

[AI SDK UI](../reference/ai-sdk-ui.html)

[AI SDK RSC](../reference/ai-sdk-rsc.html)

[Stream Helpers](../reference/stream-helpers.html)

[AI SDK Errors](../reference/ai-sdk-errors.html)

[Migration Guides](../migration-guides.html)

[Troubleshooting](../troubleshooting.html)

[Advanced](../advanced.html)Vercel Deployment Guide

# [Vercel Deployment Guide](#vercel-deployment-guide)

In this guide, you will deploy an AI application to [Vercel](https://vercel.com) using [Next.js](https://nextjs.org) (App Router).

Vercel is a platform for developers that provides the tools, workflows, and infrastructure you need to build and deploy your web apps faster, without the need for additional configuration.

Vercel allows for automatic deployments on every branch push and merges onto the production branch of your GitHub, GitLab, and Bitbucket projects. It is a great option for deploying your AI application.

## [Before You Begin](#before-you-begin)

To follow along with this guide, you will need:

-   a Vercel account
-   an account with a Git provider (this tutorial will use [Github](https://github.com))
-   an OpenAI API key

This guide will teach you how to deploy the application you built in the Next.js (App Router) quickstart tutorial to Vercel. If you haven’t completed the quickstart guide, you can start with [this repo](https://github.com/vercel-labs/ai-sdk-deployment-guide).

## [Commit Changes](#commit-changes)

Vercel offers a powerful git-centered workflow that automatically deploys your application to production every time you push to your repository’s main branch.

Before committing your local changes, make sure that you have a `.gitignore`. Within your `.gitignore`, ensure that you are excluding your environment variables (`.env`) and your node modules (`node_modules`).

If you have any local changes, you can commit them by running the following commands:

```bash
git add .
git commit -m "init"
```

## [Create Git Repo](#create-git-repo)

You can create a GitHub repository from within your terminal, or on [github.com](https://github.com/). For this tutorial, you will use the GitHub CLI ([more info here](https://cli.github.com/)).

To create your GitHub repository:

1.  Navigate to [github.com](http://github.com/)
2.  In the top right corner, click the "plus" icon and select "New repository"
3.  Pick a name for your repository (this can be anything)
4.  Click "Create repository"

Once you have created your repository, GitHub will redirect you to your new repository.

1.  Scroll down the page and copy the commands under the title "...or push an existing repository from the command line"
2.  Go back to the terminal, paste and then run the commands

Note: if you run into the error "error: remote origin already exists.", this is because your local repository is still linked to the repository you cloned. To "unlink", you can run the following command:

```bash
rm -rf .git
git init
git add .
git commit -m "init"
```

Rerun the code snippet from the previous step.

## [Import Project in Vercel](#import-project-in-vercel)

On the [New Project](https://vercel.com/new) page, under the **Import Git Repository** section, select the Git provider that you would like to import your project from. Follow the prompts to sign in to your GitHub account.

Once you have signed in, you should see your newly created repository from the previous step in the "Import Git Repository" section. Click the "Import" button next to that project.

### [Add Environment Variables](#add-environment-variables)

Your application stores uses environment secrets to store your OpenAI API key using a `.env.local` file locally in development. To add this API key to your production deployment, expand the "Environment Variables" section and paste in your `.env.local` file. Vercel will automatically parse your variables and enter them in the appropriate `key:value` format.

### [Deploy](#deploy)

Press the **Deploy** button. Vercel will create the Project and deploy it based on the chosen configurations.

### [Enjoy the confetti!](#enjoy-the-confetti)

To view your deployment, select the Project in the dashboard and then select the **Domain**. This page is now visible to anyone who has the URL.

## [Considerations](#considerations)

When deploying an AI application, there are infrastructure-related considerations to be aware of.

### [Function Duration](#function-duration)

In most cases, you will call the large language model (LLM) on the server. By default, Vercel serverless functions have a maximum duration of 10 seconds on the Hobby Tier. Depending on your prompt, it can take an LLM more than this limit to complete a response. If the response is not resolved within this limit, the server will throw an error.

You can specify the maximum duration of your Vercel function using [route segment config](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config). To update your maximum duration, add the following route segment config to the top of your route handler or the page which is calling your server action.

```ts
export const maxDuration = 30;
```

You can increase the max duration to 60 seconds on the Hobby Tier. For other tiers, [see the documentation](https://vercel.com/docs/functions/runtimes#max-duration) for limits.

## [Security Considerations](#security-considerations)

Given the high cost of calling an LLM, it's important to have measures in place that can protect your application from abuse.

### [Rate Limit](#rate-limit)

Rate limiting is a method used to regulate network traffic by defining a maximum number of requests that a client can send to a server within a given time frame.

Follow [this guide](https://vercel.com/guides/securing-ai-app-rate-limiting) to add rate limiting to your application.

### [Firewall](#firewall)

A firewall helps protect your applications and websites from DDoS attacks and unauthorized access.

[Vercel Firewall](https://vercel.com/docs/security/vercel-firewall) is a set of tools and infrastructure, created specifically with security in mind. It automatically mitigates DDoS attacks and Enterprise teams can get further customization for their site, including dedicated support and custom rules for IP blocking.

## [Troubleshooting](#troubleshooting)

-   Streaming not working when [proxied](../troubleshooting/streaming-not-working-when-proxied.html)
-   Experiencing [Timeouts](../troubleshooting/timeout-on-vercel.html)

[Previous

Sequential Generations

](sequential-generations.html)

[Next

Reference

](../reference.html)

On this page

[Vercel Deployment Guide](#vercel-deployment-guide)

[Before You Begin](#before-you-begin)

[Commit Changes](#commit-changes)

[Create Git Repo](#create-git-repo)

[Import Project in Vercel](#import-project-in-vercel)

[Add Environment Variables](#add-environment-variables)

[Deploy](#deploy)

[Enjoy the confetti!](#enjoy-the-confetti)

[Considerations](#considerations)

[Function Duration](#function-duration)

[Security Considerations](#security-considerations)

[Rate Limit](#rate-limit)

[Firewall](#firewall)

[Troubleshooting](#troubleshooting)

Deploy and Scale AI Apps with Vercel.

Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:

-   OpenAI
-   Photoroom
-   ![leonardo-ai Logo](../../_next/logo-leonardo-ai-light.svg)![leonardo-ai Logo](../../_next/logo-leonardo-ai-dark.svg)
-   ![zapier Logo](../../_next/logo-zapier-light.svg)![zapier Logo](../../_next/logo-zapier-dark.svg)

[](https://vercel.com/contact/sales?utm_source=ai_sdk&utm_medium=web&utm_campaign=contact_sales_cta&utm_content=talk_to_an_expert_sdk_docs)

#### Resources

[Docs](../introduction.html)[Cookbook](../../cookbook.html)[Providers](../../providers/ai-sdk-providers.html)[Showcase](../../showcase.html)[GitHub](https://github.com/vercel/ai)[Discussions](https://github.com/vercel/ai/discussions)

#### More

[Playground](../../playground.html)[](https://v0.dev)[Contact Sales](https://vercel.com/contact/sales)

#### About Vercel

[Next.js + Vercel](https://vercel.com/frameworks/nextjs)[Open Source Software](https://vercel.com/oss)[GitHub](https://github.com/vercel)[X](https://x.com/vercel)

#### Legal

[Privacy Policy](https://vercel.com/legal/privacy-policy)

© 2025 Vercel, Inc.