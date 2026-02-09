Community Providers: Cloudflare AI Gateway

[](https://vercel.com/)

[

AI SDK



](../../index.html)

-   [Docs](../../docs/introduction.html)
-   [Cookbook](../../cookbook.html)
-   [Providers](../ai-sdk-providers.html)
-   [Playground](../../playground.html)
-   [
    
    AI ElementsAI Elements
    
    ](../../elements/overview.html)
-   [AI GatewayGateway](https://vercel.com/ai-gateway)

AI SDK 5 is available now.

[View Announcement](https://vercel.com/blog/ai-sdk-5)

Menu

[AI SDK Providers](../ai-sdk-providers.html)

[AI Gateway](../ai-sdk-providers/ai-gateway.html)

[xAI Grok](../ai-sdk-providers/xai.html)

[Vercel](../ai-sdk-providers/vercel.html)

[OpenAI](../ai-sdk-providers/openai.html)

[Azure OpenAI](../ai-sdk-providers/azure.html)

[Anthropic](../ai-sdk-providers/anthropic.html)

[Amazon Bedrock](../ai-sdk-providers/amazon-bedrock.html)

[Groq](../ai-sdk-providers/groq.html)

[Fal](../ai-sdk-providers/fal.html)

[DeepInfra](../ai-sdk-providers/deepinfra.html)

[Google Generative AI](../ai-sdk-providers/google-generative-ai.html)

[Google Vertex AI](../ai-sdk-providers/google-vertex.html)

[Mistral AI](../ai-sdk-providers/mistral.html)

[Together.ai](../ai-sdk-providers/togetherai.html)

[Cohere](../ai-sdk-providers/cohere.html)

[Fireworks](../ai-sdk-providers/fireworks.html)

[DeepSeek](../ai-sdk-providers/deepseek.html)

[Cerebras](../ai-sdk-providers/cerebras.html)

[Replicate](../ai-sdk-providers/replicate.html)

[Perplexity](../ai-sdk-providers/perplexity.html)

[Luma](../ai-sdk-providers/luma.html)

[ElevenLabs](../ai-sdk-providers/elevenlabs.html)

[AssemblyAI](../ai-sdk-providers/assemblyai.html)

[Deepgram](../ai-sdk-providers/deepgram.html)

[Gladia](../ai-sdk-providers/gladia.html)

[LMNT](../ai-sdk-providers/lmnt.html)

[Hume](../ai-sdk-providers/hume.html)

[Rev.ai](../ai-sdk-providers/revai.html)

[Baseten](../ai-sdk-providers/baseten.html)

[Hugging Face](../ai-sdk-providers/huggingface.html)

[OpenAI Compatible Providers](../openai-compatible-providers.html)

[Writing a Custom Provider](../openai-compatible-providers/custom-providers.html)

[LM Studio](../openai-compatible-providers/lmstudio.html)

[NVIDIA NIM](../openai-compatible-providers/nim.html)

[Heroku](../openai-compatible-providers/heroku.html)

[Community Providers](../community-providers.html)

[Writing a Custom Provider](custom-providers.html)

[Qwen](qwen.html)

[Ollama](ollama.html)

[A2A](a2a.html)

[Requesty](requesty.html)

[FriendliAI](friendliai.html)

[Portkey](portkey.html)

[Cloudflare Workers AI](cloudflare-workers-ai.html)

[Cloudflare AI Gateway](cloudflare-ai-gateway.html)

[OpenRouter](openrouter.html)

[Azure AI](azure-ai.html)

[Aihubmix](aihubmix.html)

[SAP AI Core](sap-ai.html)

[Crosshatch](crosshatch.html)

[Mixedbread](mixedbread.html)

[Voyage AI](voyage-ai.html)

[Jina AI](jina-ai.html)

[Mem0](mem0.html)

[Letta](letta.html)

[Supermemory](supermemory.html)

[React Native Apple](react-native-apple.html)

[Anthropic Vertex](anthropic-vertex-ai.html)

[Spark](spark.html)

[Inflection AI](inflection-ai.html)

[LangDB](langdb.html)

[Zhipu AI](zhipu.html)

[SambaNova](sambanova.html)

[Dify](dify.html)

[Sarvam](sarvam.html)

[AI/ML API](aimlapi.html)

[Claude Code](claude-code.html)

[Built-in AI](built-in-ai.html)

[Gemini CLI](gemini-cli.html)

[Automatic1111](automatic1111.html)

[Adapters](../adapters.html)

[LangChain](../adapters/langchain.html)

[LlamaIndex](../adapters/llamaindex.html)

[Observability Integrations](../observability.html)

[Axiom](../observability/axiom.html)

[Braintrust](../observability/braintrust.html)

[Helicone](../observability/helicone.html)

[Laminar](../observability/laminar.html)

[Langfuse](../observability/langfuse.html)

[LangSmith](../observability/langsmith.html)

[LangWatch](../observability/langwatch.html)

[Maxim](../observability/maxim.html)

[Patronus](../observability/patronus.html)

[Scorecard](../observability/scorecard.html)

[SigNoz](../observability/signoz.html)

[Traceloop](../observability/traceloop.html)

[Weave](../observability/weave.html)

[Community Providers](../community-providers.html)Cloudflare AI Gateway

# [Cloudflare AI Gateway](#cloudflare-ai-gateway)

The Cloudflare AI Gateway Provider is a library that integrates Cloudflare's AI Gateway with the Vercel AI SDK. It enables seamless access to multiple AI models from various providers through a unified interface, with automatic fallback for high availability.

## [Features](#features)

-   **Runtime Agnostic**: Compatible with Node.js, Edge Runtime, and other JavaScript runtimes supported by the Vercel AI SDK.
-   **Automatic Fallback**: Automatically switches to the next available model if one fails, ensuring resilience.
-   **Multi-Provider Support**: Supports models from OpenAI, Anthropic, DeepSeek, Google AI Studio, Grok, Mistral, Perplexity AI, Replicate, and Groq.
-   **Cloudflare AI Gateway Integration**: Leverages Cloudflare's AI Gateway for request management, caching, and rate limiting.
-   **Simplified Configuration**: Easy setup with support for API key authentication or Cloudflare AI bindings.

## [Setup](#setup)

The Cloudflare AI Gateway Provider is available in the `ai-gateway-provider` module. Install it with:

pnpm

npm

yarn

bun

pnpm add ai-gateway-provider

## [Provider Instance](#provider-instance)

Create an `aigateway` provider instance using the `createAiGateway` function. You can authenticate using an API key or a Cloudflare AI binding.

### [API Key Authentication](#api-key-authentication)

```typescript
import { createAiGateway } from 'ai-gateway-provider';


const aigateway = createAiGateway({
  accountId: 'your-cloudflare-account-id',
  gateway: 'your-gateway-name',
  apiKey: 'your-cloudflare-api-key', // Only required if your gateway has authentication enabled
  options: {
    skipCache: true, // Optional request-level settings
  },
});
```

### [Cloudflare AI Binding](#cloudflare-ai-binding)

This method is only available inside Cloudflare Workers.

Configure an AI binding in your `wrangler.toml`:

```bash
[AI]
binding = "AI"
```

In your worker, create a new instance using the binding:

```typescript
import { createAiGateway } from 'ai-gateway-provider';


const aigateway = createAiGateway({
  binding: env.AI.gateway('my-gateway'),
  options: {
    skipCache: true, // Optional request-level settings
  },
});
```

## [Language Models](#language-models)

Create a model instance by passing an array of models to the `aigateway` provider. The provider will attempt to use the models in order, falling back to the next if one fails.

```typescript
import { createAiGateway } from 'ai-gateway-provider';
import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';


const aigateway = createAiGateway({
  accountId: 'your-cloudflare-account-id',
  gateway: 'your-gateway-name',
  apiKey: 'your-cloudflare-api-key',
});


const openai = createOpenAI({ apiKey: 'openai-api-key' });
const anthropic = createAnthropic({ apiKey: 'anthropic-api-key' });


const model = aigateway([
  anthropic('claude-3-5-haiku-20241022'), // Primary model
  openai('gpt-4o-mini'), // Fallback model
]);
```

### [Request Options](#request-options)

Customize Cloudflare AI Gateway settings per request:

-   `cacheKey`: Custom cache key for the request.
-   `cacheTtl`: Cache time-to-live in seconds.
-   `skipCache`: Bypass caching.
-   `metadata`: Custom metadata for the request.
-   `collectLog`: Enable/disable log collection.
-   `eventId`: Custom event identifier.
-   `requestTimeoutMs`: Request timeout in milliseconds.
-   `retries`:
    -   `maxAttempts`: Number of retry attempts (1-5).
    -   `retryDelayMs`: Delay between retries.
    -   `backoff`: Retry strategy (`constant`, `linear`, `exponential`).

Example:

```typescript
const aigateway = createAiGateway({
  accountId: 'your-cloudflare-account-id',
  gateway: 'your-gateway-name',
  apiKey: 'your-cloudflare-api-key',
  options: {
    cacheTtl: 3600, // Cache for 1 hour
    metadata: { userId: 'user123' },
    retries: {
      maxAttempts: 3,
      retryDelayMs: 1000,
      backoff: 'exponential',
    },
  },
});
```

## [Examples](#examples)

### [`generateText`](#generatetext)

Generate non-streaming text using the Cloudflare AI Gateway Provider:

```typescript
import { createAiGateway } from 'ai-gateway-provider';
import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';


const aigateway = createAiGateway({
  accountId: 'your-cloudflare-account-id',
  gateway: 'your-gateway-name',
  apiKey: 'your-cloudflare-api-key',
});


const openai = createOpenAI({ apiKey: 'openai-api-key' });


const { text } = await generateText({
  model: aigateway([openai('gpt-4o-mini')]),
  prompt: 'Write a greeting.',
});


console.log(text); // Output: "Hello"
```

### [`streamText`](#streamtext)

Stream text responses using the Cloudflare AI Gateway Provider:

```typescript
import { createAiGateway } from 'ai-gateway-provider';
import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';


const aigateway = createAiGateway({
  accountId: 'your-cloudflare-account-id',
  gateway: 'your-gateway-name',
  apiKey: 'your-cloudflare-api-key',
});


const openai = createOpenAI({ apiKey: 'openai-api-key' });


const result = await streamText({
  model: aigateway([openai('gpt-4o-mini')]),
  prompt: 'Write a multi-part greeting.',
});


let accumulatedText = '';
for await (const chunk of result.textStream) {
  accumulatedText += chunk;
}


console.log(accumulatedText); // Output: "Hello world!"
```

## [Supported Providers](#supported-providers)

-   OpenAI
-   Anthropic
-   DeepSeek
-   Google AI Studio
-   Grok
-   Mistral
-   Perplexity AI
-   Replicate
-   Groq

## [Error Handling](#error-handling)

The provider throws the following custom errors:

-   `AiGatewayUnauthorizedError`: Invalid or missing API key when authentication is enabled.
-   `AiGatewayDoesNotExist`: Specified Cloudflare AI Gateway does not exist.

[Previous

Cloudflare Workers AI

](cloudflare-workers-ai.html)

[Next

OpenRouter

](openrouter.html)

On this page

[Cloudflare AI Gateway](#cloudflare-ai-gateway)

[Features](#features)

[Setup](#setup)

[Provider Instance](#provider-instance)

[API Key Authentication](#api-key-authentication)

[Cloudflare AI Binding](#cloudflare-ai-binding)

[Language Models](#language-models)

[Request Options](#request-options)

[Examples](#examples)

[generateText](#generatetext)

[streamText](#streamtext)

[Supported Providers](#supported-providers)

[Error Handling](#error-handling)

Deploy and Scale AI Apps with Vercel.

Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:

-   OpenAI
-   Photoroom
-   ![leonardo-ai Logo](../../_next/logo-leonardo-ai-light.svg)![leonardo-ai Logo](../../_next/logo-leonardo-ai-dark.svg)
-   ![zapier Logo](../../_next/logo-zapier-light.svg)![zapier Logo](../../_next/logo-zapier-dark.svg)

[](https://vercel.com/contact/sales?utm_source=ai_sdk&utm_medium=web&utm_campaign=contact_sales_cta&utm_content=talk_to_an_expert_sdk_docs)

#### Resources

[Docs](../../docs/introduction.html)[Cookbook](../../cookbook.html)[Providers](../ai-sdk-providers.html)[Showcase](../../showcase.html)[GitHub](https://github.com/vercel/ai)[Discussions](https://github.com/vercel/ai/discussions)

#### More

[Playground](../../playground.html)[](https://v0.dev)[Contact Sales](https://vercel.com/contact/sales)

#### About Vercel

[Next.js + Vercel](https://vercel.com/frameworks/nextjs)[Open Source Software](https://vercel.com/oss)[GitHub](https://github.com/vercel)[X](https://x.com/vercel)

#### Legal

[Privacy Policy](https://vercel.com/legal/privacy-policy)

© 2025 Vercel, Inc.