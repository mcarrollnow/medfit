AI SDK Core: generateSpeech

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

[generateText](generate-text.html)

[streamText](stream-text.html)

[generateObject](generate-object.html)

[streamObject](stream-object.html)

[embed](embed.html)

[embedMany](embed-many.html)

[generateImage](generate-image.html)

[transcribe](transcribe.html)

[generateSpeech](generate-speech.html)

[tool](tool.html)

[dynamicTool](dynamic-tool.html)

[experimental\_createMCPClient](create-mcp-client.html)

[Experimental\_StdioMCPTransport](mcp-stdio-transport.html)

[jsonSchema](json-schema.html)

[zodSchema](zod-schema.html)

[valibotSchema](valibot-schema.html)

[ModelMessage](model-message.html)

[UIMessage](ui-message.html)

[validateUIMessages](validate-ui-messages.html)

[safeValidateUIMessages](safe-validate-ui-messages.html)

[createProviderRegistry](provider-registry.html)

[customProvider](custom-provider.html)

[cosineSimilarity](cosine-similarity.html)

[wrapLanguageModel](wrap-language-model.html)

[LanguageModelV2Middleware](language-model-v2-middleware.html)

[extractReasoningMiddleware](extract-reasoning-middleware.html)

[simulateStreamingMiddleware](simulate-streaming-middleware.html)

[defaultSettingsMiddleware](default-settings-middleware.html)

[stepCountIs](step-count-is.html)

[hasToolCall](has-tool-call.html)

[simulateReadableStream](simulate-readable-stream.html)

[smoothStream](smooth-stream.html)

[generateId](generate-id.html)

[createIdGenerator](create-id-generator.html)

[AI SDK UI](../ai-sdk-ui.html)

[AI SDK RSC](../ai-sdk-rsc.html)

[Stream Helpers](../stream-helpers.html)

[AI SDK Errors](../ai-sdk-errors.html)

[Migration Guides](../../migration-guides.html)

[Troubleshooting](../../troubleshooting.html)

[AI SDK Core](../../ai-sdk-core.html)generateSpeech

# [`generateSpeech()`](#generatespeech)

`generateSpeech` is an experimental feature.

Generates speech audio from text.

```ts
import { experimental_generateSpeech as generateSpeech } from 'ai';
import { openai } from '@ai-sdk/openai';


const { audio } = await generateSpeech({
  model: openai.speech('tts-1'),
  text: 'Hello from the AI SDK!',
  voice: 'alloy',
});


console.log(audio);
```

## [Examples](#examples)

### [OpenAI](#openai)

```ts
import { experimental_generateSpeech as generateSpeech } from 'ai';
import { openai } from '@ai-sdk/openai';


const { audio } = await generateSpeech({
  model: openai.speech('tts-1'),
  text: 'Hello from the AI SDK!',
  voice: 'alloy',
});
```

### [ElevenLabs](#elevenlabs)

```ts
import { experimental_generateSpeech as generateSpeech } from 'ai';
import { elevenlabs } from '@ai-sdk/elevenlabs';


const { audio } = await generateSpeech({
  model: elevenlabs.speech('eleven_multilingual_v2'),
  text: 'Hello from the AI SDK!',
  voice: 'your-voice-id', // Required: get this from your ElevenLabs account
});
```

## [Import](#import)

import { experimental\_generateSpeech as generateSpeech } from "ai"

## [API Signature](#api-signature)

### [Parameters](#parameters)

### model:

SpeechModelV2

The speech model to use.

### text:

string

The text to generate the speech from.

### voice?:

string

The voice to use for the speech.

### outputFormat?:

string

The output format to use for the speech e.g. "mp3", "wav", etc.

### instructions?:

string

Instructions for the speech generation.

### speed?:

number

The speed of the speech generation.

### language?:

string

The language for speech generation. This should be an ISO 639-1 language code (e.g. "en", "es", "fr") or "auto" for automatic language detection. Provider support varies.

### providerOptions?:

Record<string, Record<string, JSONValue>>

Additional provider-specific options.

### maxRetries?:

number

Maximum number of retries. Default: 2.

### abortSignal?:

AbortSignal

An optional abort signal to cancel the call.

### headers?:

Record<string, string>

Additional HTTP headers for the request.

### [Returns](#returns)

### audio:

GeneratedAudioFile

The generated audio.

GeneratedAudioFile

### base64:

string

Audio as a base64 encoded string.

### uint8Array:

Uint8Array

Audio as a Uint8Array.

### mimeType:

string

MIME type of the audio (e.g. "audio/mpeg").

### format:

string

Format of the audio (e.g. "mp3").

### warnings:

SpeechWarning\[\]

Warnings from the model provider (e.g. unsupported settings).

### responses:

Array<SpeechModelResponseMetadata>

Response metadata from the provider. There may be multiple responses if we made multiple calls to the model.

SpeechModelResponseMetadata

### timestamp:

Date

Timestamp for the start of the generated response.

### modelId:

string

The ID of the response model that was used to generate the response.

### body?:

unknown

Optional response body.

### headers?:

Record<string, string>

Response headers.

[Previous

transcribe

](transcribe.html)

[Next

tool

](tool.html)

On this page

[generateSpeech()](#generatespeech)

[Examples](#examples)

[OpenAI](#openai)

[ElevenLabs](#elevenlabs)

[Import](#import)

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