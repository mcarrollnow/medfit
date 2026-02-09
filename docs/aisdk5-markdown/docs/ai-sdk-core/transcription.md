AI SDK Core: Transcription

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

[Overview](overview.html)

[Generating Text](generating-text.html)

[Generating Structured Data](generating-structured-data.html)

[Tool Calling](tools-and-tool-calling.html)

[Model Context Protocol (MCP) Tools](mcp-tools.html)

[Prompt Engineering](prompt-engineering.html)

[Settings](settings.html)

[Embeddings](embeddings.html)

[Image Generation](image-generation.html)

[Transcription](transcription.html)

[Speech](speech.html)

[Language Model Middleware](middleware.html)

[Provider & Model Management](provider-management.html)

[Error Handling](error-handling.html)

[Testing](testing.html)

[Telemetry](telemetry.html)

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

[AI SDK Core](../ai-sdk-core.html)Transcription

# [Transcription](#transcription)

Transcription is an experimental feature.

The AI SDK provides the [`transcribe`](../reference/ai-sdk-core/transcribe.html) function to transcribe audio using a transcription model.

```ts
import { experimental_transcribe as transcribe } from 'ai';
import { openai } from '@ai-sdk/openai';
import { readFile } from 'fs/promises';


const transcript = await transcribe({
  model: openai.transcription('whisper-1'),
  audio: await readFile('audio.mp3'),
});
```

The `audio` property can be a `Uint8Array`, `ArrayBuffer`, `Buffer`, `string` (base64 encoded audio data), or a `URL`.

To access the generated transcript:

```ts
const text = transcript.text; // transcript text e.g. "Hello, world!"
const segments = transcript.segments; // array of segments with start and end times, if available
const language = transcript.language; // language of the transcript e.g. "en", if available
const durationInSeconds = transcript.durationInSeconds; // duration of the transcript in seconds, if available
```

## [Settings](#settings)

### [Provider-Specific settings](#provider-specific-settings)

Transcription models often have provider or model-specific settings which you can set using the `providerOptions` parameter.

```ts
import { experimental_transcribe as transcribe } from 'ai';
import { openai } from '@ai-sdk/openai';
import { readFile } from 'fs/promises';


const transcript = await transcribe({
  model: openai.transcription('whisper-1'),
  audio: await readFile('audio.mp3'),
  providerOptions: {
    openai: {
      timestampGranularities: ['word'],
    },
  },
});
```

### [Abort Signals and Timeouts](#abort-signals-and-timeouts)

`transcribe` accepts an optional `abortSignal` parameter of type [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) that you can use to abort the transcription process or set a timeout.

```ts
import { openai } from '@ai-sdk/openai';
import { experimental_transcribe as transcribe } from 'ai';
import { readFile } from 'fs/promises';


const transcript = await transcribe({
  model: openai.transcription('whisper-1'),
  audio: await readFile('audio.mp3'),
  abortSignal: AbortSignal.timeout(1000), // Abort after 1 second
});
```

### [Custom Headers](#custom-headers)

`transcribe` accepts an optional `headers` parameter of type `Record<string, string>` that you can use to add custom headers to the transcription request.

```ts
import { openai } from '@ai-sdk/openai';
import { experimental_transcribe as transcribe } from 'ai';
import { readFile } from 'fs/promises';


const transcript = await transcribe({
  model: openai.transcription('whisper-1'),
  audio: await readFile('audio.mp3'),
  headers: { 'X-Custom-Header': 'custom-value' },
});
```

### [Warnings](#warnings)

Warnings (e.g. unsupported parameters) are available on the `warnings` property.

```ts
import { openai } from '@ai-sdk/openai';
import { experimental_transcribe as transcribe } from 'ai';
import { readFile } from 'fs/promises';


const transcript = await transcribe({
  model: openai.transcription('whisper-1'),
  audio: await readFile('audio.mp3'),
});


const warnings = transcript.warnings;
```

### [Error Handling](#error-handling)

When `transcribe` cannot generate a valid transcript, it throws a [`AI_NoTranscriptGeneratedError`](../reference/ai-sdk-errors/ai-no-transcript-generated-error.html).

This error can arise for any the following reasons:

-   The model failed to generate a response
-   The model generated a response that could not be parsed

The error preserves the following information to help you log the issue:

-   `responses`: Metadata about the transcription model responses, including timestamp, model, and headers.
-   `cause`: The cause of the error. You can use this for more detailed error handling.

```ts
import {
  experimental_transcribe as transcribe,
  NoTranscriptGeneratedError,
} from 'ai';
import { openai } from '@ai-sdk/openai';
import { readFile } from 'fs/promises';


try {
  await transcribe({
    model: openai.transcription('whisper-1'),
    audio: await readFile('audio.mp3'),
  });
} catch (error) {
  if (NoTranscriptGeneratedError.isInstance(error)) {
    console.log('NoTranscriptGeneratedError');
    console.log('Cause:', error.cause);
    console.log('Responses:', error.responses);
  }
}
```

## [Transcription Models](#transcription-models)

| Provider | Model |
| --- | --- |
| [OpenAI](../../providers/ai-sdk-providers/openai.html#transcription-models) | `whisper-1` |
| [OpenAI](../../providers/ai-sdk-providers/openai.html#transcription-models) | `gpt-4o-transcribe` |
| [OpenAI](../../providers/ai-sdk-providers/openai.html#transcription-models) | `gpt-4o-mini-transcribe` |
| [ElevenLabs](../../providers/ai-sdk-providers/elevenlabs.html#transcription-models) | `scribe_v1` |
| [ElevenLabs](../../providers/ai-sdk-providers/elevenlabs.html#transcription-models) | `scribe_v1_experimental` |
| [Groq](../../providers/ai-sdk-providers/groq.html#transcription-models) | `whisper-large-v3-turbo` |
| [Groq](../../providers/ai-sdk-providers/groq.html#transcription-models) | `distil-whisper-large-v3-en` |
| [Groq](../../providers/ai-sdk-providers/groq.html#transcription-models) | `whisper-large-v3` |
| [Azure OpenAI](../../providers/ai-sdk-providers/azure.html#transcription-models) | `whisper-1` |
| [Azure OpenAI](../../providers/ai-sdk-providers/azure.html#transcription-models) | `gpt-4o-transcribe` |
| [Azure OpenAI](../../providers/ai-sdk-providers/azure.html#transcription-models) | `gpt-4o-mini-transcribe` |
| [Rev.ai](../../providers/ai-sdk-providers/revai.html#transcription-models) | `machine` |
| [Rev.ai](../../providers/ai-sdk-providers/revai.html#transcription-models) | `low_cost` |
| [Rev.ai](../../providers/ai-sdk-providers/revai.html#transcription-models) | `fusion` |
| [Deepgram](../../providers/ai-sdk-providers/deepgram.html#transcription-models) | `base` (+ variants) |
| [Deepgram](../../providers/ai-sdk-providers/deepgram.html#transcription-models) | `enhanced` (+ variants) |
| [Deepgram](../../providers/ai-sdk-providers/deepgram.html#transcription-models) | `nova` (+ variants) |
| [Deepgram](../../providers/ai-sdk-providers/deepgram.html#transcription-models) | `nova-2` (+ variants) |
| [Deepgram](../../providers/ai-sdk-providers/deepgram.html#transcription-models) | `nova-3` (+ variants) |
| [Gladia](../../providers/ai-sdk-providers/gladia.html#transcription-models) | `default` |
| [AssemblyAI](../../providers/ai-sdk-providers/assemblyai.html#transcription-models) | `best` |
| [AssemblyAI](../../providers/ai-sdk-providers/assemblyai.html#transcription-models) | `nano` |
| [Fal](../../providers/ai-sdk-providers/fal.html#transcription-models) | `whisper` |
| [Fal](../../providers/ai-sdk-providers/fal.html#transcription-models) | `wizper` |

Above are a small subset of the transcription models supported by the AI SDK providers. For more, see the respective provider documentation.

[Previous

Image Generation

](image-generation.html)

[Next

Speech

](speech.html)

On this page

[Transcription](#transcription)

[Settings](#settings)

[Provider-Specific settings](#provider-specific-settings)

[Abort Signals and Timeouts](#abort-signals-and-timeouts)

[Custom Headers](#custom-headers)

[Warnings](#warnings)

[Error Handling](#error-handling)

[Transcription Models](#transcription-models)

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