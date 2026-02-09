Getting Started: Navigating the Library

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

[Navigating the Library](navigating-the-library.html)

[Next.js App Router](nextjs-app-router.html)

[Next.js Pages Router](nextjs-pages-router.html)

[Svelte](svelte.html)

[Vue.js (Nuxt)](nuxt.html)

[Node.js](nodejs.html)

[Expo](expo.html)

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

[Reference](../reference.html)

[AI SDK Core](../reference/ai-sdk-core.html)

[AI SDK UI](../reference/ai-sdk-ui.html)

[AI SDK RSC](../reference/ai-sdk-rsc.html)

[Stream Helpers](../reference/stream-helpers.html)

[AI SDK Errors](../reference/ai-sdk-errors.html)

[Migration Guides](../migration-guides.html)

[Troubleshooting](../troubleshooting.html)

[Getting Started](../getting-started.html)Navigating the Library

# [Navigating the Library](#navigating-the-library)

The AI SDK is a powerful toolkit for building AI applications. This page will help you pick the right tools for your requirements.

Let’s start with a quick overview of the AI SDK, which is comprised of three parts:

-   **[AI SDK Core](../ai-sdk-core/overview.html):** A unified, provider agnostic API for generating text, structured objects, and tool calls with LLMs.
-   **[AI SDK UI](../ai-sdk-ui/overview.html):** A set of framework-agnostic hooks for building chat and generative user interfaces.
-   [AI SDK RSC](../ai-sdk-rsc/overview.html): Stream generative user interfaces with React Server Components (RSC). Development is currently experimental and we recommend using [AI SDK UI](../ai-sdk-ui/overview.html).

## [Choosing the Right Tool for Your Environment](#choosing-the-right-tool-for-your-environment)

When deciding which part of the AI SDK to use, your first consideration should be the environment and existing stack you are working with. Different components of the SDK are tailored to specific frameworks and environments.

| Library | Purpose | Environment Compatibility |
| --- | --- | --- |
| [AI SDK Core](../ai-sdk-core/overview.html) | Call any LLM with unified API (e.g. [generateText](../reference/ai-sdk-core/generate-text.html) and [generateObject](../reference/ai-sdk-core/generate-object.html)) | Any JS environment (e.g. Node.js, Deno, Browser) |
| [AI SDK UI](../ai-sdk-ui/overview.html) | Build streaming chat and generative UIs (e.g. [useChat](../reference/ai-sdk-ui/use-chat.html)) | React & Next.js, Vue & Nuxt, Svelte & SvelteKit |
| [AI SDK RSC](../ai-sdk-rsc/overview.html) | Stream generative UIs from Server to Client (e.g. [streamUI](../reference/ai-sdk-rsc/stream-ui.html)). Development is currently experimental and we recommend using [AI SDK UI](../ai-sdk-ui/overview.html). | Any framework that supports React Server Components (e.g. Next.js) |

## [Environment Compatibility](#environment-compatibility)

These tools have been designed to work seamlessly with each other and it's likely that you will be using them together. Let's look at how you could decide which libraries to use based on your application environment, existing stack, and requirements.

The following table outlines AI SDK compatibility based on environment:

| Environment | [AI SDK Core](../ai-sdk-core/overview.html) | [AI SDK UI](../ai-sdk-ui/overview.html) | [AI SDK RSC](../ai-sdk-rsc/overview.html) |
| --- | --- | --- | --- |
| None / Node.js / Deno |  |  |  |
| Vue / Nuxt |  |  |  |
| Svelte / SvelteKit |  |  |  |
| Next.js Pages Router |  |  |  |
| Next.js App Router |  |  |  |

## [When to use AI SDK UI](#when-to-use-ai-sdk-ui)

AI SDK UI provides a set of framework-agnostic hooks for quickly building **production-ready AI-native applications**. It offers:

-   Full support for streaming chat and client-side generative UI
-   Utilities for handling common AI interaction patterns (i.e. chat, completion, assistant)
-   Production-tested reliability and performance
-   Compatibility across popular frameworks

## [AI SDK UI Framework Compatibility](#ai-sdk-ui-framework-compatibility)

AI SDK UI supports the following frameworks: [React](https://react.dev/), [Svelte](https://svelte.dev/), and [Vue.js](https://vuejs.org/). Here is a comparison of the supported functions across these frameworks:

| Function | React | Svelte | Vue.js |
| --- | --- | --- | --- |
| [useChat](../reference/ai-sdk-ui/use-chat.html) |  |  |  |
| [useChat](../reference/ai-sdk-ui/use-chat.html) tool calling |  |  |  |
| [useCompletion](../reference/ai-sdk-ui/use-completion.html) |  |  |  |
| [useObject](../reference/ai-sdk-ui/use-object.html) |  |  |  |

[Contributions](https://github.com/vercel/ai/blob/main/CONTRIBUTING.md) are welcome to implement missing features for non-React frameworks.

## [When to use AI SDK RSC](#when-to-use-ai-sdk-rsc)

AI SDK RSC is currently experimental. We recommend using [AI SDK UI](../ai-sdk-ui/overview.html) for production. For guidance on migrating from RSC to UI, see our [migration guide](../ai-sdk-rsc/migrating-to-ui.html).

[React Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components) (RSCs) provide a new approach to building React applications that allow components to render on the server, fetch data directly, and stream the results to the client, reducing bundle size and improving performance. They also introduce a new way to call server-side functions from anywhere in your application called [Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations).

AI SDK RSC provides a number of utilities that allow you to stream values and UI directly from the server to the client. However, **it's important to be aware of current limitations**:

-   **Cancellation**: currently, it is not possible to abort a stream using Server Actions. This will be improved in future releases of React and Next.js.
-   **Increased Data Transfer**: using [`createStreamableUI`](../reference/ai-sdk-rsc/create-streamable-ui.html) can lead to quadratic data transfer (quadratic to the length of generated text). You can avoid this using [`createStreamableValue`](../reference/ai-sdk-rsc/create-streamable-value.html) instead, and rendering the component client-side.
-   **Re-mounting Issue During Streaming**: when using `createStreamableUI`, components re-mount on `.done()`, causing [flickering](https://github.com/vercel/ai/issues/2232).

Given these limitations, **we recommend using [AI SDK UI](../ai-sdk-ui/overview.html) for production applications**.

[Previous

Getting Started

](../getting-started.html)

[Next

Next.js App Router

](nextjs-app-router.html)

On this page

[Navigating the Library](#navigating-the-library)

[Choosing the Right Tool for Your Environment](#choosing-the-right-tool-for-your-environment)

[Environment Compatibility](#environment-compatibility)

[When to use AI SDK UI](#when-to-use-ai-sdk-ui)

[AI SDK UI Framework Compatibility](#ai-sdk-ui-framework-compatibility)

[When to use AI SDK RSC](#when-to-use-ai-sdk-rsc)

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