Troubleshooting: Jest: cannot find module '@ai-sdk/rsc'

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

[Troubleshooting](../troubleshooting.html)

[Azure OpenAI Slow to Stream](azure-stream-slow.html)

[Client-Side Function Calls Not Invoked](client-side-function-calls-not-invoked.html)

[Server Actions in Client Components](server-actions-in-client-components.html)

[useChat/useCompletion stream output contains 0:... instead of text](strange-stream-output.html)

[Streamable UI Errors](streamable-ui-errors.html)

[Tool Invocation Missing Result Error](tool-invocation-missing-result.html)

[Streaming Not Working When Deployed](streaming-not-working-when-deployed.html)

[Streaming Not Working When Proxied](streaming-not-working-when-proxied.html)

[Getting Timeouts When Deploying on Vercel](timeout-on-vercel.html)

[Unclosed Streams](unclosed-streams.html)

[useChat Failed to Parse Stream](use-chat-failed-to-parse-stream.html)

[Server Action Plain Objects Error](client-stream-error.html)

[useChat No Response](use-chat-tools-no-response.html)

[Custom headers, body, and credentials not working with useChat](use-chat-custom-request-options.html)

[TypeScript performance issues with Zod and AI SDK 5](typescript-performance-zod.html)

[useChat "An error occurred"](use-chat-an-error-occurred.html)

[Repeated assistant messages in useChat](repeated-assistant-messages.html)

[onFinish not called when stream is aborted](stream-abort-handling.html)

[Tool calling with generateObject and streamObject](tool-calling-with-structured-outputs.html)

[Abort breaks resumable streams](abort-breaks-resumable-streams.html)

[streamText fails silently](stream-text-not-working.html)

[Streaming Status Shows But No Text Appears](streaming-status-delay.html)

[Stale body values with useChat](use-chat-stale-body-data.html)

[Type Error with onToolCall](ontoolcall-type-narrowing.html)

[Model is not assignable to type "LanguageModelV1"](model-is-not-assignable-to-type.html)

[TypeScript error "Cannot find namespace 'JSX'"](typescript-cannot-find-namespace-jsx.html)

[React error "Maximum update depth exceeded"](react-maximum-update-depth-exceeded.html)

[Jest: cannot find module '@ai-sdk/rsc'](jest-cannot-find-module-ai-rsc.html)

[Troubleshooting](../troubleshooting.html)Jest: cannot find module '@ai-sdk/rsc'

# [Jest: cannot find module '@ai-sdk/rsc'](#jest-cannot-find-module-ai-sdkrsc)

## [Issue](#issue)

I am using AI SDK RSC and am writing tests for my RSC components with Jest.

I am getting the following error: `Cannot find module '@ai-sdk/rsc'`.

## [Solution](#solution)

Configure the module resolution via `jest config update` in `moduleNameMapper`:

```json
"moduleNameMapper": {
  "^@ai-sdk/rsc$": "<rootDir>/node_modules/@ai-sdk/rsc/dist"
}
```

[Previous

React error "Maximum update depth exceeded"

](react-maximum-update-depth-exceeded.html)

On this page

[Jest: cannot find module '@ai-sdk/rsc'](#jest-cannot-find-module-ai-sdkrsc)

[Issue](#issue)

[Solution](#solution)

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