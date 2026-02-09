Introduction: Setup

[](https://vercel.com/)

[

AI SDK



](../../index.html)

-   [Docs](../../docs/introduction.html)
-   [Cookbook](../../cookbook.html)
-   [Providers](../../providers/ai-sdk-providers.html)
-   [Playground](../../playground.html)
-   [
    
    AI ElementsAI Elements
    
    ](../overview.html)
-   [AI GatewayGateway](https://vercel.com/ai-gateway)

AI SDK 5 is available now.

[View Announcement](https://vercel.com/blog/ai-sdk-5)

Menu

[Introduction](../overview.html)

[Setup](setup.html)

[Usage](usage.html)

[Troubleshooting](troubleshooting.html)

[Examples](../examples.html)

[Chatbot](../examples/chatbot.html)

[v0 clone](../examples/v0.html)

[Workflow](../examples/workflow.html)

[Components](../components.html)

[Chatbot](../components/chatbot.html)

[Actions](../components/actions.html)

[Branch](../components/branch.html)

[Chain of Thought](../components/chain-of-thought.html)

[Code Block](../components/code-block.html)

[Context](../components/context.html)

[Conversation](../components/conversation.html)

[Image](../components/image.html)

[Inline Citation](../components/inline-citation.html)

[Loader](../components/loader.html)

[Message](../components/message.html)

[Open In Chat](../components/open-in-chat.html)

[Plan](../components/plan.html)

[Prompt Input](../components/prompt-input.html)

[Queue](../components/queue.html)

[Reasoning](../components/reasoning.html)

[Response](../components/response.html)

[Shimmer](../components/shimmer.html)

[Sources](../components/sources.html)

[Suggestion](../components/suggestion.html)

[Task](../components/task.html)

[Tool](../components/tool.html)

[Workflow](../components/workflow.html)

[Canvas](../components/canvas.html)

[Connection](../components/connection.html)

[Controls](../components/controls.html)

[Edge](../components/edge.html)

[Node](../components/node.html)

[Panel](../components/panel.html)

[Toolbar](../components/toolbar.html)

[Vibe Coding](../components/vibe-coding.html)

[Artifact](../components/artifact.html)

[Web Preview](../components/web-preview.html)

[Introduction](../overview.html)Setup

# [Setup](#setup)

Installing AI Elements is straightforward and can be done in a couple of ways. You can use the dedicated CLI command for the fastest setup, or integrate via the standard shadcn/ui CLI if you’ve already adopted shadcn’s workflow.

ai-elementsshadcn

npx ai-elements@latest

## [Prerequisites](#prerequisites)

Before installing AI Elements, make sure your environment meets the following requirements:

-   [Node.js](https://nodejs.org/en/download/), version 18 or later
-   A [Next.js](https://nextjs.org/) project with the [AI SDK](../../index.html) installed.
-   [shadcn/ui](https://ui.shadcn.com/) installed in your project. If you don't have it installed, running any install command will automatically install it for you.
-   We also highly recommend using the [AI Gateway](https://vercel.com/docs/ai-gateway) and adding `AI_GATEWAY_API_KEY` to your `env.local` so you don't have to use an API key from every provider. AI Gateway also gives $5 in usage per month so you can experiment with models. You can obtain an API key [here](https://vercel.com/d?to=%2F%5Bteam%5D%2F%7E%2Fai%2Fapi-keys&title=Get%20your%20AI%20Gateway%20key).

## [Installing Components](#installing-components)

You can install AI Elements components using either the AI Elements CLI or the shadcn/ui CLI. Both achieve the same result: adding the selected component’s code and any needed dependencies to your project.

The CLI will download the component’s code and integrate it into your project’s directory (usually under your components folder). By default, AI Elements components are added to the `@/components/ai-elements/` directory (or whatever folder you’ve configured in your shadcn components settings).

After running the command, you should see a confirmation in your terminal that the files were added. You can then proceed to use the component in your code.

[Previous

Introduction

](../overview.html)

[Next

Usage

](usage.html)

On this page

[Setup](#setup)

[Prerequisites](#prerequisites)

[Installing Components](#installing-components)

Deploy and Scale AI Apps with Vercel.

Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:

-   OpenAI
-   Photoroom
-   ![leonardo-ai Logo](../../_next/logo-leonardo-ai-light.svg)![leonardo-ai Logo](../../_next/logo-leonardo-ai-dark.svg)
-   ![zapier Logo](../../_next/logo-zapier-light.svg)![zapier Logo](../../_next/logo-zapier-dark.svg)

[](https://vercel.com/contact/sales?utm_source=ai_sdk&utm_medium=web&utm_campaign=contact_sales_cta&utm_content=talk_to_an_expert_sdk_docs)

#### Resources

[Docs](../../docs/introduction.html)[Cookbook](../../cookbook.html)[Providers](../../providers/ai-sdk-providers.html)[Showcase](../../showcase.html)[GitHub](https://github.com/vercel/ai)[Discussions](https://github.com/vercel/ai/discussions)

#### More

[Playground](../../playground.html)[](https://v0.dev)[Contact Sales](https://vercel.com/contact/sales)

#### About Vercel

[Next.js + Vercel](https://vercel.com/frameworks/nextjs)[Open Source Software](https://vercel.com/oss)[GitHub](https://github.com/vercel)[X](https://x.com/vercel)

#### Legal

[Privacy Policy](https://vercel.com/legal/privacy-policy)

© 2025 Vercel, Inc.