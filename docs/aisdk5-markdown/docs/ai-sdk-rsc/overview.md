AI SDK RSC: Overview

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

[Overview](overview.html)

[Streaming React Components](streaming-react-components.html)

[Managing Generative UI State](generative-ui-state.html)

[Saving and Restoring States](saving-and-restoring-states.html)

[Multistep Interfaces](multistep-interfaces.html)

[Streaming Values](streaming-values.html)

[Handling Loading State](loading-state.html)

[Error Handling](error-handling.html)

[Handling Authentication](authentication.html)

[Migrating from RSC to UI](migrating-to-ui.html)

[Advanced](../advanced.html)

[Reference](../reference.html)

[AI SDK Core](../reference/ai-sdk-core.html)

[AI SDK UI](../reference/ai-sdk-ui.html)

[AI SDK RSC](../reference/ai-sdk-rsc.html)

[Stream Helpers](../reference/stream-helpers.html)

[AI SDK Errors](../reference/ai-sdk-errors.html)

[Migration Guides](../migration-guides.html)

[Troubleshooting](../troubleshooting.html)

[AI SDK RSC](../ai-sdk-rsc.html)Overview

# [AI SDK RSC](#ai-sdk-rsc)

AI SDK RSC is currently experimental. We recommend using [AI SDK UI](../ai-sdk-ui/overview.html) for production. For guidance on migrating from RSC to UI, see our [migration guide](migrating-to-ui.html).

The `@ai-sdk/rsc` package is compatible with frameworks that support React Server Components.

[React Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components) (RSC) allow you to write UI that can be rendered on the server and streamed to the client. RSCs enable [Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations#with-client-components) , a new way to call server-side code directly from the client just like any other function with end-to-end type-safety. This combination opens the door to a new way of building AI applications, allowing the large language model (LLM) to generate and stream UI directly from the server to the client.

## [AI SDK RSC Functions](#ai-sdk-rsc-functions)

AI SDK RSC has various functions designed to help you build AI-native applications with React Server Components. These functions:

1.  Provide abstractions for building Generative UI applications.
    -   [`streamUI`](../reference/ai-sdk-rsc/stream-ui.html): calls a model and allows it to respond with React Server Components.
    -   [`useUIState`](../reference/ai-sdk-rsc/use-ui-state.html): returns the current UI state and a function to update the UI State (like React's `useState`). UI State is the visual representation of the AI state.
    -   [`useAIState`](../reference/ai-sdk-rsc/use-ai-state.html): returns the current AI state and a function to update the AI State (like React's `useState`). The AI state is intended to contain context and information shared with the AI model, such as system messages, function responses, and other relevant data.
    -   [`useActions`](../reference/ai-sdk-rsc/use-actions.html): provides access to your Server Actions from the client. This is particularly useful for building interfaces that require user interactions with the server.
    -   [`createAI`](../reference/ai-sdk-rsc/create-ai.html): creates a client-server context provider that can be used to wrap parts of your application tree to easily manage both UI and AI states of your application.
2.  Make it simple to work with streamable values between the server and client.
    -   [`createStreamableValue`](../reference/ai-sdk-rsc/create-streamable-value.html): creates a stream that sends values from the server to the client. The value can be any serializable data.
    -   [`readStreamableValue`](../reference/ai-sdk-rsc/read-streamable-value.html): reads a streamable value from the client that was originally created using `createStreamableValue`.
    -   [`createStreamableUI`](../reference/ai-sdk-rsc/create-streamable-ui.html): creates a stream that sends UI from the server to the client.
    -   [`useStreamableValue`](../reference/ai-sdk-rsc/use-streamable-value.html): accepts a streamable value created using `createStreamableValue` and returns the current value, error, and pending state.

## [Templates](#templates)

Check out the following templates to see AI SDK RSC in action.

[

Gemini Chatbot

Uses Google Gemini, AI SDK, and Next.js.





](https://vercel.com/templates/next.js/gemini-ai-chatbot)[

Generative UI with RSC (experimental)

Uses Next.js, AI SDK, and streamUI to create generative UIs with React Server Components.





](https://vercel.com/templates/next.js/rsc-genui)

## [API Reference](#api-reference)

Please check out the [AI SDK RSC API Reference](../reference/ai-sdk-rsc.html) for more details on each function.

[Previous

AI SDK RSC

](../ai-sdk-rsc.html)

[Next

Streaming React Components

](streaming-react-components.html)

On this page

[AI SDK RSC](#ai-sdk-rsc)

[AI SDK RSC Functions](#ai-sdk-rsc-functions)

[Templates](#templates)

[API Reference](#api-reference)

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