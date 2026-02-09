Stream Helpers: AnthropicStream

[](https://vercel.com/)

[

AI SDK



](../../../index.html)

-   [Docs](../../introduction.html)
-   [Cookbook](../../../cookbook.html)
-   [Providers](../../../providers/ai-sdk-providers.html)
-   [Playground](../../../playground.html)
-   [
    
    AI ElementsAI Elements
    
    ](../../../elements/overview.html)
-   [AI GatewayGateway](https://vercel.com/ai-gateway)

AI SDK 5 is available now.

[View Announcement](https://vercel.com/blog/ai-sdk-5)

Menu

[AI SDK by Vercel](../../introduction.html)

[Foundations](../../foundations.html)

[Overview](../../foundations/overview.html)

[Providers and Models](../../foundations/providers-and-models.html)

[Prompts](../../foundations/prompts.html)

[Tools](../../foundations/tools.html)

[Streaming](../../foundations/streaming.html)

[Getting Started](../../getting-started.html)

[Navigating the Library](../../getting-started/navigating-the-library.html)

[Next.js App Router](../../getting-started/nextjs-app-router.html)

[Next.js Pages Router](../../getting-started/nextjs-pages-router.html)

[Svelte](../../getting-started/svelte.html)

[Vue.js (Nuxt)](../../getting-started/nuxt.html)

[Node.js](../../getting-started/nodejs.html)

[Expo](../../getting-started/expo.html)

[Agents](../../agents.html)

[Agents](../../agents/overview.html)

[Building Agents](../../agents/building-agents.html)

[Workflow Patterns](../../agents/workflows.html)

[Loop Control](../../agents/loop-control.html)

[AI SDK Core](../../ai-sdk-core.html)

[Overview](../../ai-sdk-core/overview.html)

[Generating Text](../../ai-sdk-core/generating-text.html)

[Generating Structured Data](../../ai-sdk-core/generating-structured-data.html)

[Tool Calling](../../ai-sdk-core/tools-and-tool-calling.html)

[Model Context Protocol (MCP) Tools](../../ai-sdk-core/mcp-tools.html)

[Prompt Engineering](../../ai-sdk-core/prompt-engineering.html)

[Settings](../../ai-sdk-core/settings.html)

[Embeddings](../../ai-sdk-core/embeddings.html)

[Image Generation](../../ai-sdk-core/image-generation.html)

[Transcription](../../ai-sdk-core/transcription.html)

[Speech](../../ai-sdk-core/speech.html)

[Language Model Middleware](../../ai-sdk-core/middleware.html)

[Provider & Model Management](../../ai-sdk-core/provider-management.html)

[Error Handling](../../ai-sdk-core/error-handling.html)

[Testing](../../ai-sdk-core/testing.html)

[Telemetry](../../ai-sdk-core/telemetry.html)

[AI SDK UI](../../ai-sdk-ui.html)

[Overview](../../ai-sdk-ui/overview.html)

[Chatbot](../../ai-sdk-ui/chatbot.html)

[Chatbot Message Persistence](../../ai-sdk-ui/chatbot-message-persistence.html)

[Chatbot Resume Streams](../../ai-sdk-ui/chatbot-resume-streams.html)

[Chatbot Tool Usage](../../ai-sdk-ui/chatbot-tool-usage.html)

[Generative User Interfaces](../../ai-sdk-ui/generative-user-interfaces.html)

[Completion](../../ai-sdk-ui/completion.html)

[Object Generation](../../ai-sdk-ui/object-generation.html)

[Streaming Custom Data](../../ai-sdk-ui/streaming-data.html)

[Error Handling](../../ai-sdk-ui/error-handling.html)

[Transport](../../ai-sdk-ui/transport.html)

[Reading UIMessage Streams](../../ai-sdk-ui/reading-ui-message-streams.html)

[Message Metadata](../../ai-sdk-ui/message-metadata.html)

[Stream Protocols](../../ai-sdk-ui/stream-protocol.html)

[AI SDK RSC](../../ai-sdk-rsc.html)

[Advanced](../../advanced.html)

[Reference](../../reference.html)

[AI SDK Core](../ai-sdk-core.html)

[AI SDK UI](../ai-sdk-ui.html)

[AI SDK RSC](../ai-sdk-rsc.html)

[Stream Helpers](../stream-helpers.html)

[AIStream](ai-stream.html)

[StreamingTextResponse](streaming-text-response.html)

[streamToResponse](stream-to-response.html)

[OpenAIStream](openai-stream.html)

[AnthropicStream](anthropic-stream.html)

[AWSBedrockStream](aws-bedrock-stream.html)

[AWSBedrockAnthropicStream](aws-bedrock-anthropic-stream.html)

[AWSBedrockAnthropicMessagesStream](aws-bedrock-messages-stream.html)

[AWSBedrockCohereStream](aws-bedrock-cohere-stream.html)

[AWSBedrockLlama2Stream](aws-bedrock-llama-2-stream.html)

[CohereStream](cohere-stream.html)

[GoogleGenerativeAIStream](google-generative-ai-stream.html)

[HuggingFaceStream](hugging-face-stream.html)

[@ai-sdk/langchain Adapter](langchain-adapter.html)

[@ai-sdk/llamaindex Adapter](llamaindex-adapter.html)

[MistralStream](mistral-stream.html)

[ReplicateStream](replicate-stream.html)

[InkeepStream](inkeep-stream.html)

[AI SDK Errors](../ai-sdk-errors.html)

[Migration Guides](../../migration-guides.html)

[Troubleshooting](../../troubleshooting.html)

[Stream Helpers](../stream-helpers.html)AnthropicStream

# [`AnthropicStream`](#anthropicstream)

AnthropicStream has been removed in AI SDK 4.0.

AnthropicStream is part of the legacy Anthropic integration. It is not compatible with the AI SDK 3.1 functions. It is recommended to use the [AI SDK Anthropic Provider](../../../providers/ai-sdk-providers/anthropic.html) instead.

It is a utility function that transforms the output from Anthropic's SDK into a ReadableStream. It uses AIStream under the hood, applying a specific parser for the Anthropic's response data structure.

## [Import](#import)

### [React](#react)

import { AnthropicStream } from "ai"

## [API Signature](#api-signature)

### [Parameters](#parameters)

### response:

Response

The response object returned by a call made by the Provider SDK.

### callbacks?:

AIStreamCallbacksAndOptions

An object containing callback functions to handle the start, each token, and completion of the AI response. In the absence of this parameter, default behavior is implemented.

AIStreamCallbacksAndOptions

### onStart:

() => Promise<void>

An optional function that is called at the start of the stream processing.

### onCompletion:

(completion: string) => Promise<void>

An optional function that is called for every completion. It's passed the completion as a string.

### onFinal:

(completion: string) => Promise<void>

An optional function that is called once when the stream is closed with the final completion message.

### onToken:

(token: string) => Promise<void>

An optional function that is called for each token in the stream. It's passed the token as a string.

### [Returns](#returns)

A `ReadableStream`.

[Previous

OpenAIStream

](openai-stream.html)

[Next

AWSBedrockStream

](aws-bedrock-stream.html)

On this page

[AnthropicStream](#anthropicstream)

[Import](#import)

[React](#react)

[API Signature](#api-signature)

[Parameters](#parameters)

[Returns](#returns)

Deploy and Scale AI Apps with Vercel.

Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:

-   OpenAI
-   Photoroom
-   ![leonardo-ai Logo](../../../_next/logo-leonardo-ai-light.svg)![leonardo-ai Logo](../../../_next/logo-leonardo-ai-dark.svg)
-   ![zapier Logo](../../../_next/logo-zapier-light.svg)![zapier Logo](../../../_next/logo-zapier-dark.svg)

[](https://vercel.com/contact/sales?utm_source=ai_sdk&utm_medium=web&utm_campaign=contact_sales_cta&utm_content=talk_to_an_expert_sdk_docs)

#### Resources

[Docs](../../introduction.html)[Cookbook](../../../cookbook.html)[Providers](../../../providers/ai-sdk-providers.html)[Showcase](../../../showcase.html)[GitHub](https://github.com/vercel/ai)[Discussions](https://github.com/vercel/ai/discussions)

#### More

[Playground](../../../playground.html)[](https://v0.dev)[Contact Sales](https://vercel.com/contact/sales)

#### About Vercel

[Next.js + Vercel](https://vercel.com/frameworks/nextjs)[Open Source Software](https://vercel.com/oss)[GitHub](https://github.com/vercel)[X](https://x.com/vercel)

#### Legal

[Privacy Policy](https://vercel.com/legal/privacy-policy)

© 2025 Vercel, Inc.