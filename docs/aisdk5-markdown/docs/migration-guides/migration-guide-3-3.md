Migration Guides: Migrate AI SDK 3.2 to 3.3

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

[Reference](../reference.html)

[AI SDK Core](../reference/ai-sdk-core.html)

[AI SDK UI](../reference/ai-sdk-ui.html)

[AI SDK RSC](../reference/ai-sdk-rsc.html)

[Stream Helpers](../reference/stream-helpers.html)

[AI SDK Errors](../reference/ai-sdk-errors.html)

[Migration Guides](../migration-guides.html)

[Versioning](versioning.html)

[Migrate Your Data to AI SDK 5.0](migration-guide-5-0-data.html)

[Migrate AI SDK 4.0 to 5.0](migration-guide-5-0.html)

[Migrate AI SDK 4.1 to 4.2](migration-guide-4-2.html)

[Migrate AI SDK 4.0 to 4.1](migration-guide-4-1.html)

[Migrate AI SDK 3.4 to 4.0](migration-guide-4-0.html)

[Migrate AI SDK 3.3 to 3.4](migration-guide-3-4.html)

[Migrate AI SDK 3.2 to 3.3](migration-guide-3-3.html)

[Migrate AI SDK 3.1 to 3.2](migration-guide-3-2.html)

[Migrate AI SDK 3.0 to 3.1](migration-guide-3-1.html)

[Troubleshooting](../troubleshooting.html)

[Migration Guides](../migration-guides.html)Migrate AI SDK 3.2 to 3.3

# [Migrate AI SDK 3.2 to 3.3](#migrate-ai-sdk-32-to-33)

Check out the [AI SDK 3.3 release blog post](https://vercel.com/blog/vercel-ai-sdk-3-3) for more information about the release.

No breaking changes in this release.

The following changelog encompasses all changes made in the 3.2.x series, introducing significant improvements and new features across the AI SDK and its associated libraries:

## [New Features](#new-features)

### [Open Telemetry Support](#open-telemetry-support)

-   Added experimental [OpenTelemetry support](../ai-sdk-core/telemetry.html#telemetry) for all [AI SDK Core functions](../ai-sdk-core/overview.html#ai-sdk-core-functions), enabling better observability and tracing capabilities.

### [AI SDK UI Improvements](#ai-sdk-ui-improvements)

-   Introduced the experimental **`useObject`** hook (for React) that can be used in conjunction with **`streamObject`** on the backend to enable seamless streaming of structured data.
-   Enhanced **`useChat`** with experimental support for attachments and streaming tool calls, providing more versatile chat functionalities.
-   Patched **`useChat`** to prevent empty submissions, improving the quality of user interactions by ensuring that only intended inputs are processed.
-   Fix **`useChat`**'s **`reload`** function, now correctly sending data, body, and headers.
-   Implemented **`setThreadId`** helper for **`useAssistant`**, simplifying thread management.
-   Documented the stream data protocol for **`useChat`** and **`useCompletion`**, allowing developers to use these functions with any backend. The stream data protocol also enables the use of custom frontends with **`streamText`**.
-   Added support for custom fetch functions and request body customization, offering greater control over API interactions.
-   Added **`onFinish`** to **`useChat`** hook for access to token usage and finish reason.

### [Core Enhancements](#core-enhancements)

-   Implemented support for sending custom request headers, enabling more tailored API requests.
-   Added raw JSON schema support alongside existing Zod support, providing more options for schema and data validation.
-   Introduced usage information for **`embed`** and **`embedMany`** functions, offering insights into token usage.
-   Added support for additional settings including **`stopSequences`** and **`topK`**, allowing for finer control over text generation.
-   Provided access to information for all steps on **`generateText`**, providing access to intermediate tool calls and results.

### [New Providers](#new-providers)

-   [AWS Bedrock provider](../../providers/ai-sdk-providers/amazon-bedrock.html).

### [Provider Improvements](#provider-improvements)

-   Enhanced existing providers including Anthropic, Google, Azure, and OpenAI with various improvements and bug fixes.
-   Upgraded the LangChain adapter with StreamEvent v2 support and introduced the **`toDataStreamResponse`** function, enabling conversion of LangChain output streams to data stream responses.
-   Added legacy function calling support to the OpenAI provider.
-   Updated Mistral AI provider with fixes and improvements for tool calling support.

### [UI Framework Support Expansion](#ui-framework-support-expansion)

-   SolidJS: Updated **`useChat`** and **`useCompletion`** to achieve feature parity with React implementations.
-   Vue.js: Introduced **`useAssistant`** hook.
-   Vue.js / Nuxt: [Updated examples](https://github.com/vercel/ai/tree/main/examples/nuxt-openai) to showcase latest features and best practices.
-   Svelte: Added tool calling support to **`useChat`.**

## [Fixes and Improvements](#fixes-and-improvements)

-   Resolved various issues across different components of the SDK, including race conditions, error handling, and state management.

[Previous

Migrate AI SDK 3.3 to 3.4

](migration-guide-3-4.html)

[Next

Migrate AI SDK 3.1 to 3.2

](migration-guide-3-2.html)

On this page

[Migrate AI SDK 3.2 to 3.3](#migrate-ai-sdk-32-to-33)

[New Features](#new-features)

[Open Telemetry Support](#open-telemetry-support)

[AI SDK UI Improvements](#ai-sdk-ui-improvements)

[Core Enhancements](#core-enhancements)

[New Providers](#new-providers)

[Provider Improvements](#provider-improvements)

[UI Framework Support Expansion](#ui-framework-support-expansion)

[Fixes and Improvements](#fixes-and-improvements)

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