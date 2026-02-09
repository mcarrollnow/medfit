AI SDK Errors: AI\_InvalidDataContent

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

[AI SDK Errors](../ai-sdk-errors.html)

[AI\_APICallError](ai-api-call-error.html)

[AI\_DownloadError](ai-download-error.html)

[AI\_EmptyResponseBodyError](ai-empty-response-body-error.html)

[AI\_InvalidArgumentError](ai-invalid-argument-error.html)

[AI\_InvalidDataContentError](ai-invalid-data-content-error.html)

[AI\_InvalidDataContent](ai-invalid-data-content.html)

[AI\_InvalidMessageRoleError](ai-invalid-message-role-error.html)

[AI\_InvalidPromptError](ai-invalid-prompt-error.html)

[AI\_InvalidResponseDataError](ai-invalid-response-data-error.html)

[AI\_InvalidToolInputError](ai-invalid-tool-input-error.html)

[AI\_JSONParseError](ai-json-parse-error.html)

[AI\_LoadAPIKeyError](ai-load-api-key-error.html)

[AI\_LoadSettingError](ai-load-setting-error.html)

[AI\_MessageConversionError](ai-message-conversion-error.html)

[AI\_NoContentGeneratedError](ai-no-content-generated-error.html)

[AI\_NoImageGeneratedError](ai-no-image-generated-error.html)

[AI\_NoObjectGeneratedError](ai-no-object-generated-error.html)

[AI\_NoOutputSpecifiedError](ai-no-output-specified-error.html)

[AI\_NoSpeechGeneratedError](ai-no-speech-generated-error.html)

[AI\_NoSuchModelError](ai-no-such-model-error.html)

[AI\_NoSuchProviderError](ai-no-such-provider-error.html)

[AI\_NoSuchToolError](ai-no-such-tool-error.html)

[AI\_NoTranscriptGeneratedError](ai-no-transcript-generated-error.html)

[AI\_RetryError](ai-retry-error.html)

[AI\_TooManyEmbeddingValuesForCallError](ai-too-many-embedding-values-for-call-error.html)

[ToolCallRepairError](ai-tool-call-repair-error.html)

[AI\_TypeValidationError](ai-type-validation-error.html)

[AI\_UnsupportedFunctionalityError](ai-unsupported-functionality-error.html)

[Migration Guides](../../migration-guides.html)

[Troubleshooting](../../troubleshooting.html)

[AI SDK Errors](../ai-sdk-errors.html)AI\_InvalidDataContent

# [AI\_InvalidDataContent](#ai_invaliddatacontent)

This error occurs when invalid data content is provided.

## [Properties](#properties)

-   `content`: The invalid content value
-   `message`: The error message
-   `cause`: The cause of the error

## [Checking for this Error](#checking-for-this-error)

You can check if an error is an instance of `AI_InvalidDataContent` using:

```typescript
import { InvalidDataContent } from 'ai';


if (InvalidDataContent.isInstance(error)) {
  // Handle the error
}
```

[Previous

AI\_InvalidDataContentError

](ai-invalid-data-content-error.html)

[Next

AI\_InvalidMessageRoleError

](ai-invalid-message-role-error.html)

On this page

[AI\_InvalidDataContent](#ai_invaliddatacontent)

[Properties](#properties)

[Checking for this Error](#checking-for-this-error)

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