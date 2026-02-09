Reference: AI SDK Core

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

[AI SDK Core](ai-sdk-core.html)

[generateText](ai-sdk-core/generate-text.html)

[streamText](ai-sdk-core/stream-text.html)

[generateObject](ai-sdk-core/generate-object.html)

[streamObject](ai-sdk-core/stream-object.html)

[embed](ai-sdk-core/embed.html)

[embedMany](ai-sdk-core/embed-many.html)

[generateImage](ai-sdk-core/generate-image.html)

[transcribe](ai-sdk-core/transcribe.html)

[generateSpeech](ai-sdk-core/generate-speech.html)

[tool](ai-sdk-core/tool.html)

[dynamicTool](ai-sdk-core/dynamic-tool.html)

[experimental\_createMCPClient](ai-sdk-core/create-mcp-client.html)

[Experimental\_StdioMCPTransport](ai-sdk-core/mcp-stdio-transport.html)

[jsonSchema](ai-sdk-core/json-schema.html)

[zodSchema](ai-sdk-core/zod-schema.html)

[valibotSchema](ai-sdk-core/valibot-schema.html)

[ModelMessage](ai-sdk-core/model-message.html)

[UIMessage](ai-sdk-core/ui-message.html)

[validateUIMessages](ai-sdk-core/validate-ui-messages.html)

[safeValidateUIMessages](ai-sdk-core/safe-validate-ui-messages.html)

[createProviderRegistry](ai-sdk-core/provider-registry.html)

[customProvider](ai-sdk-core/custom-provider.html)

[cosineSimilarity](ai-sdk-core/cosine-similarity.html)

[wrapLanguageModel](ai-sdk-core/wrap-language-model.html)

[LanguageModelV2Middleware](ai-sdk-core/language-model-v2-middleware.html)

[extractReasoningMiddleware](ai-sdk-core/extract-reasoning-middleware.html)

[simulateStreamingMiddleware](ai-sdk-core/simulate-streaming-middleware.html)

[defaultSettingsMiddleware](ai-sdk-core/default-settings-middleware.html)

[stepCountIs](ai-sdk-core/step-count-is.html)

[hasToolCall](ai-sdk-core/has-tool-call.html)

[simulateReadableStream](ai-sdk-core/simulate-readable-stream.html)

[smoothStream](ai-sdk-core/smooth-stream.html)

[generateId](ai-sdk-core/generate-id.html)

[createIdGenerator](ai-sdk-core/create-id-generator.html)

[AI SDK UI](ai-sdk-ui.html)

[AI SDK RSC](ai-sdk-rsc.html)

[Stream Helpers](stream-helpers.html)

[AI SDK Errors](ai-sdk-errors.html)

[Migration Guides](../migration-guides.html)

[Troubleshooting](../troubleshooting.html)

[Reference](../reference.html)AI SDK Core

# [AI SDK Core](#ai-sdk-core)

[AI SDK Core](../ai-sdk-core.html) is a set of functions that allow you to interact with language models and other AI models. These functions are designed to be easy-to-use and flexible, allowing you to generate text, structured data, and embeddings from language models and other AI models.

AI SDK Core contains the following main functions:

[

generateText()

Generate text and call tools from a language model.

](ai-sdk-core/generate-text.html)[

streamText()

Stream text and call tools from a language model.

](ai-sdk-core/stream-text.html)[

generateObject()

Generate structured data from a language model.

](ai-sdk-core/generate-object.html)[

streamObject()

Stream structured data from a language model.

](ai-sdk-core/stream-object.html)[

embed()

Generate an embedding for a single value using an embedding model.

](ai-sdk-core/embed.html)[

embedMany()

Generate embeddings for several values using an embedding model (batch embedding).

](ai-sdk-core/embed-many.html)[

experimental\_generateImage()

Generate images based on a given prompt using an image model.

](ai-sdk-core/generate-image.html)[

experimental\_transcribe()

Generate a transcript from an audio file.

](ai-sdk-core/transcribe.html)[

experimental\_generateSpeech()

Generate speech audio from text.

](ai-sdk-core/generate-speech.html)

It also contains the following helper functions:

[

tool()

Type inference helper function for tools.

](ai-sdk-core/tool.html)[

experimental\_createMCPClient()

Creates a client for connecting to MCP servers.

](ai-sdk-core/create-mcp-client.html)[

jsonSchema()

Creates AI SDK compatible JSON schema objects.

](ai-sdk-core/json-schema.html)[

zodSchema()

Creates AI SDK compatible Zod schema objects.

](ai-sdk-core/zod-schema.html)[

createProviderRegistry()

Creates a registry for using models from multiple providers.

](ai-sdk-core/provider-registry.html)[

cosineSimilarity()

Calculates the cosine similarity between two vectors, e.g. embeddings.

](ai-sdk-core/cosine-similarity.html)[

simulateReadableStream()

Creates a ReadableStream that emits values with configurable delays.

](ai-sdk-core/simulate-readable-stream.html)[

wrapLanguageModel()

Wraps a language model with middleware.

](ai-sdk-core/wrap-language-model.html)[

extractReasoningMiddleware()

Extracts reasoning from the generated text and exposes it as a \`reasoning\` property on the result.

](ai-sdk-core/extract-reasoning-middleware.html)[

simulateStreamingMiddleware()

Simulates streaming behavior with responses from non-streaming language models.

](ai-sdk-core/simulate-streaming-middleware.html)[

defaultSettingsMiddleware()

Applies default settings to a language model.

](ai-sdk-core/default-settings-middleware.html)[

smoothStream()

Smooths text streaming output.

](ai-sdk-core/smooth-stream.html)[

generateId()

Helper function for generating unique IDs

](ai-sdk-core/generate-id.html)[

createIdGenerator()

Creates an ID generator

](ai-sdk-core/create-id-generator.html)

[Previous

Reference

](../reference.html)

[Next

generateText

](ai-sdk-core/generate-text.html)

On this page

[AI SDK Core](#ai-sdk-core)

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