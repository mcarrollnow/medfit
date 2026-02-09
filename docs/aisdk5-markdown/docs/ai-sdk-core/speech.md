AI SDK Core: Speech

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

[AI SDK Core](../ai-sdk-core.html)Speech

# [Speech](#speech)

Speech is an experimental feature.

The AI SDK provides the [`generateSpeech`](../reference/ai-sdk-core/generate-speech.html) function to generate speech from text using a speech model.

```ts
import { experimental_generateSpeech as generateSpeech } from 'ai';
import { openai } from '@ai-sdk/openai';


const audio = await generateSpeech({
  model: openai.speech('tts-1'),
  text: 'Hello, world!',
  voice: 'alloy',
});
```

### [Language Setting](#language-setting)

You can specify the language for speech generation (provider support varies):

```ts
import { experimental_generateSpeech as generateSpeech } from 'ai';
import { lmnt } from '@ai-sdk/lmnt';


const audio = await generateSpeech({
  model: lmnt.speech('aurora'),
  text: 'Hola, mundo!',
  language: 'es', // Spanish
});
```

To access the generated audio:

```ts
const audio = audio.audioData; // audio data e.g. Uint8Array
```

## [Settings](#settings)

### [Provider-Specific settings](#provider-specific-settings)

You can set model-specific settings with the `providerOptions` parameter.

```ts
import { experimental_generateSpeech as generateSpeech } from 'ai';
import { openai } from '@ai-sdk/openai';


const audio = await generateSpeech({
  model: openai.speech('tts-1'),
  text: 'Hello, world!',
  providerOptions: {
    openai: {
      // ...
    },
  },
});
```

### [Abort Signals and Timeouts](#abort-signals-and-timeouts)

`generateSpeech` accepts an optional `abortSignal` parameter of type [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) that you can use to abort the speech generation process or set a timeout.

```ts
import { openai } from '@ai-sdk/openai';
import { experimental_generateSpeech as generateSpeech } from 'ai';


const audio = await generateSpeech({
  model: openai.speech('tts-1'),
  text: 'Hello, world!',
  abortSignal: AbortSignal.timeout(1000), // Abort after 1 second
});
```

### [Custom Headers](#custom-headers)

`generateSpeech` accepts an optional `headers` parameter of type `Record<string, string>` that you can use to add custom headers to the speech generation request.

```ts
import { openai } from '@ai-sdk/openai';
import { experimental_generateSpeech as generateSpeech } from 'ai';


const audio = await generateSpeech({
  model: openai.speech('tts-1'),
  text: 'Hello, world!',
  headers: { 'X-Custom-Header': 'custom-value' },
});
```

### [Warnings](#warnings)

Warnings (e.g. unsupported parameters) are available on the `warnings` property.

```ts
import { openai } from '@ai-sdk/openai';
import { experimental_generateSpeech as generateSpeech } from 'ai';


const audio = await generateSpeech({
  model: openai.speech('tts-1'),
  text: 'Hello, world!',
});


const warnings = audio.warnings;
```

### [Error Handling](#error-handling)

When `generateSpeech` cannot generate a valid audio, it throws a [`AI_NoSpeechGeneratedError`](../reference/ai-sdk-errors/ai-no-speech-generated-error.html).

This error can arise for any the following reasons:

-   The model failed to generate a response
-   The model generated a response that could not be parsed

The error preserves the following information to help you log the issue:

-   `responses`: Metadata about the speech model responses, including timestamp, model, and headers.
-   `cause`: The cause of the error. You can use this for more detailed error handling.

```ts
import {
  experimental_generateSpeech as generateSpeech,
  NoSpeechGeneratedError,
} from 'ai';
import { openai } from '@ai-sdk/openai';


try {
  await generateSpeech({
    model: openai.speech('tts-1'),
    text: 'Hello, world!',
  });
} catch (error) {
  if (NoSpeechGeneratedError.isInstance(error)) {
    console.log('AI_NoSpeechGeneratedError');
    console.log('Cause:', error.cause);
    console.log('Responses:', error.responses);
  }
}
```

## [Speech Models](#speech-models)

| Provider | Model |
| --- | --- |
| [OpenAI](../../providers/ai-sdk-providers/openai.html#speech-models) | `tts-1` |
| [OpenAI](../../providers/ai-sdk-providers/openai.html#speech-models) | `tts-1-hd` |
| [OpenAI](../../providers/ai-sdk-providers/openai.html#speech-models) | `gpt-4o-mini-tts` |
| [ElevenLabs](../../providers/ai-sdk-providers/elevenlabs.html#speech-models) | `eleven_v3` |
| [ElevenLabs](../../providers/ai-sdk-providers/elevenlabs.html#speech-models) | `eleven_multilingual_v2` |
| [ElevenLabs](../../providers/ai-sdk-providers/elevenlabs.html#speech-models) | `eleven_flash_v2_5` |
| [ElevenLabs](../../providers/ai-sdk-providers/elevenlabs.html#speech-models) | `eleven_flash_v2` |
| [ElevenLabs](../../providers/ai-sdk-providers/elevenlabs.html#speech-models) | `eleven_turbo_v2_5` |
| [ElevenLabs](../../providers/ai-sdk-providers/elevenlabs.html#speech-models) | `eleven_turbo_v2` |
| [LMNT](../../providers/ai-sdk-providers/lmnt.html#speech-models) | `aurora` |
| [LMNT](../../providers/ai-sdk-providers/lmnt.html#speech-models) | `blizzard` |
| [Hume](../../providers/ai-sdk-providers/hume.html#speech-models) | `default` |

Above are a small subset of the speech models supported by the AI SDK providers. For more, see the respective provider documentation.

[Previous

Transcription

](transcription.html)

[Next

Language Model Middleware

](middleware.html)

On this page

[Speech](#speech)

[Language Setting](#language-setting)

[Settings](#settings)

[Provider-Specific settings](#provider-specific-settings)

[Abort Signals and Timeouts](#abort-signals-and-timeouts)

[Custom Headers](#custom-headers)

[Warnings](#warnings)

[Error Handling](#error-handling)

[Speech Models](#speech-models)

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