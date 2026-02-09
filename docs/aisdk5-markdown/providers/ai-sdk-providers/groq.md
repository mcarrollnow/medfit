AI SDK Providers: Groq

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

[AI Gateway](ai-gateway.html)

[xAI Grok](xai.html)

[Vercel](vercel.html)

[OpenAI](openai.html)

[Azure OpenAI](azure.html)

[Anthropic](anthropic.html)

[Amazon Bedrock](amazon-bedrock.html)

[Groq](groq.html)

[Fal](fal.html)

[DeepInfra](deepinfra.html)

[Google Generative AI](google-generative-ai.html)

[Google Vertex AI](google-vertex.html)

[Mistral AI](mistral.html)

[Together.ai](togetherai.html)

[Cohere](cohere.html)

[Fireworks](fireworks.html)

[DeepSeek](deepseek.html)

[Cerebras](cerebras.html)

[Replicate](replicate.html)

[Perplexity](perplexity.html)

[Luma](luma.html)

[ElevenLabs](elevenlabs.html)

[AssemblyAI](assemblyai.html)

[Deepgram](deepgram.html)

[Gladia](gladia.html)

[LMNT](lmnt.html)

[Hume](hume.html)

[Rev.ai](revai.html)

[Baseten](baseten.html)

[Hugging Face](huggingface.html)

[OpenAI Compatible Providers](../openai-compatible-providers.html)

[Writing a Custom Provider](../openai-compatible-providers/custom-providers.html)

[LM Studio](../openai-compatible-providers/lmstudio.html)

[NVIDIA NIM](../openai-compatible-providers/nim.html)

[Heroku](../openai-compatible-providers/heroku.html)

[Community Providers](../community-providers.html)

[Writing a Custom Provider](../community-providers/custom-providers.html)

[Qwen](../community-providers/qwen.html)

[Ollama](../community-providers/ollama.html)

[A2A](../community-providers/a2a.html)

[Requesty](../community-providers/requesty.html)

[FriendliAI](../community-providers/friendliai.html)

[Portkey](../community-providers/portkey.html)

[Cloudflare Workers AI](../community-providers/cloudflare-workers-ai.html)

[Cloudflare AI Gateway](../community-providers/cloudflare-ai-gateway.html)

[OpenRouter](../community-providers/openrouter.html)

[Azure AI](../community-providers/azure-ai.html)

[Aihubmix](../community-providers/aihubmix.html)

[SAP AI Core](../community-providers/sap-ai.html)

[Crosshatch](../community-providers/crosshatch.html)

[Mixedbread](../community-providers/mixedbread.html)

[Voyage AI](../community-providers/voyage-ai.html)

[Jina AI](../community-providers/jina-ai.html)

[Mem0](../community-providers/mem0.html)

[Letta](../community-providers/letta.html)

[Supermemory](../community-providers/supermemory.html)

[React Native Apple](../community-providers/react-native-apple.html)

[Anthropic Vertex](../community-providers/anthropic-vertex-ai.html)

[Spark](../community-providers/spark.html)

[Inflection AI](../community-providers/inflection-ai.html)

[LangDB](../community-providers/langdb.html)

[Zhipu AI](../community-providers/zhipu.html)

[SambaNova](../community-providers/sambanova.html)

[Dify](../community-providers/dify.html)

[Sarvam](../community-providers/sarvam.html)

[AI/ML API](../community-providers/aimlapi.html)

[Claude Code](../community-providers/claude-code.html)

[Built-in AI](../community-providers/built-in-ai.html)

[Gemini CLI](../community-providers/gemini-cli.html)

[Automatic1111](../community-providers/automatic1111.html)

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

[AI SDK Providers](../ai-sdk-providers.html)Groq

# [Groq Provider](#groq-provider)

The [Groq](https://groq.com/) provider contains language model support for the Groq API.

## [Setup](#setup)

The Groq provider is available via the `@ai-sdk/groq` module. You can install it with

pnpm

npm

yarn

bun

pnpm add @ai-sdk/groq

## [Provider Instance](#provider-instance)

You can import the default provider instance `groq` from `@ai-sdk/groq`:

```ts
import { groq } from '@ai-sdk/groq';
```

If you need a customized setup, you can import `createGroq` from `@ai-sdk/groq` and create a provider instance with your settings:

```ts
import { createGroq } from '@ai-sdk/groq';


const groq = createGroq({
  // custom settings
});
```

You can use the following optional settings to customize the Groq provider instance:

-   **baseURL** *string*
    
    Use a different URL prefix for API calls, e.g. to use proxy servers. The default prefix is `https://api.groq.com/openai/v1`.
    
-   **apiKey** *string*
    
    API key that is being sent using the `Authorization` header. It defaults to the `GROQ_API_KEY` environment variable.
    
-   **headers** *Record<string,string>*
    
    Custom headers to include in the requests.
    
-   **fetch** *(input: RequestInfo, init?: RequestInit) => Promise<Response>*
    
    Custom [fetch](https://developer.mozilla.org/en-US/docs/Web/API/fetch) implementation. Defaults to the global `fetch` function. You can use it as a middleware to intercept requests, or to provide a custom fetch implementation for e.g. testing.
    

## [Language Models](#language-models)

You can create [Groq models](https://console.groq.com/docs/models) using a provider instance. The first argument is the model id, e.g. `gemma2-9b-it`.

```ts
const model = groq('gemma2-9b-it');
```

### [Reasoning Models](#reasoning-models)

Groq offers several reasoning models such as `qwen-qwq-32b` and `deepseek-r1-distill-llama-70b`. You can configure how the reasoning is exposed in the generated text by using the `reasoningFormat` option. It supports the options `parsed`, `hidden`, and `raw`.

```ts
import { groq } from '@ai-sdk/groq';
import { generateText } from 'ai';


const result = await generateText({
  model: groq('qwen/qwen3-32b'),
  providerOptions: {
    groq: {
      reasoningFormat: 'parsed',
      reasoningEffort: 'default',
      parallelToolCalls: true, // Enable parallel function calling (default: true)
      user: 'user-123', // Unique identifier for end-user (optional)
      serviceTier: 'flex', // Use flex tier for higher throughput (optional)
    },
  },
  prompt: 'How many "r"s are in the word "strawberry"?',
});
```

The following optional provider options are available for Groq language models:

-   **reasoningFormat** *'parsed' | 'raw' | 'hidden'*
    
    Controls how reasoning is exposed in the generated text. Only supported by reasoning models like `qwen-qwq-32b` and `deepseek-r1-distill-*` models.
    
    For a complete list of reasoning models and their capabilities, see [Groq's reasoning models documentation](https://console.groq.com/docs/reasoning).
    
-   **reasoningEffort** *'low' | 'meduim' | 'high' | 'none' | 'default'*
    
    Controls the level of effort the model will put into reasoning.
    
    -   `qwen/qwen3-32b`
        -   Supported values:
            -   `none`: Disable reasoning. The model will not use any reasoning tokens.
            -   `default`: Enable reasoning.
    -   `gpt-oss20b/gpt-oss120b`
        -   Supported values:
            -   `low`: Use a low level of reasoning effort.
            -   `medium`: Use a medium level of reasoning effort.
            -   `high`: Use a high level of reasoning effort.
    
    Defaults to `default` for `qwen/qwen3-32b.`
    
-   **structuredOutputs** *boolean*
    
    Whether to use structured outputs.
    
    Defaults to `true`.
    
    When enabled, object generation will use the `json_schema` format instead of `json_object` format, providing more reliable structured outputs.
    
-   **parallelToolCalls** *boolean*
    
    Whether to enable parallel function calling during tool use. Defaults to `true`.
    
-   **user** *string*
    
    A unique identifier representing your end-user, which can help with monitoring and abuse detection.
    
-   **serviceTier** *'on\_demand' | 'flex' | 'auto'*
    
    Service tier for the request. Defaults to `'on_demand'`.
    
    -   `'on_demand'`: Default tier with consistent performance and fairness
    -   `'flex'`: Higher throughput tier (10x rate limits) optimized for workloads that can handle occasional request failures
    -   `'auto'`: Uses on\_demand rate limits first, then falls back to flex tier if exceeded
    
    For more details about service tiers and their benefits, see [Groq's Flex Processing documentation](https://console.groq.com/docs/flex-processing).
    

Only Groq reasoning models support the `reasoningFormat` option.

#### [Structured Outputs](#structured-outputs)

Structured outputs are enabled by default for Groq models. You can disable them by setting the `structuredOutputs` option to `false`.

```ts
import { groq } from '@ai-sdk/groq';
import { generateObject } from 'ai';
import { z } from 'zod';


const result = await generateObject({
  model: groq('moonshotai/kimi-k2-instruct'),
  schema: z.object({
    recipe: z.object({
      name: z.string(),
      ingredients: z.array(z.string()),
      instructions: z.array(z.string()),
    }),
  }),
  prompt: 'Generate a simple pasta recipe.',
});


console.log(JSON.stringify(result.object, null, 2));
```

You can disable structured outputs for models that don't support them:

```ts
import { groq } from '@ai-sdk/groq';
import { generateObject } from 'ai';
import { z } from 'zod';


const result = await generateObject({
  model: groq('gemma2-9b-it'),
  providerOptions: {
    groq: {
      structuredOutputs: false,
    },
  },
  schema: z.object({
    recipe: z.object({
      name: z.string(),
      ingredients: z.array(z.string()),
      instructions: z.array(z.string()),
    }),
  }),
  prompt: 'Generate a simple pasta recipe in JSON format.',
});


console.log(JSON.stringify(result.object, null, 2));
```

Structured outputs are only supported by newer Groq models like `moonshotai/kimi-k2-instruct`. For unsupported models, you can disable structured outputs by setting `structuredOutputs: false`. When disabled, Groq uses the `json_object` format which requires the word "JSON" to be included in your messages.

### [Example](#example)

You can use Groq language models to generate text with the `generateText` function:

```ts
import { groq } from '@ai-sdk/groq';
import { generateText } from 'ai';


const { text } = await generateText({
  model: groq('gemma2-9b-it'),
  prompt: 'Write a vegetarian lasagna recipe for 4 people.',
});
```

### [Image Input](#image-input)

Groq's multi-modal models like `meta-llama/llama-4-scout-17b-16e-instruct` support image inputs. You can include images in your messages using either URLs or base64-encoded data:

```ts
import { groq } from '@ai-sdk/groq';
import { generateText } from 'ai';


const { text } = await generateText({
  model: groq('meta-llama/llama-4-scout-17b-16e-instruct'),
  messages: [
    {
      role: 'user',
      content: [
        { type: 'text', text: 'What do you see in this image?' },
        {
          type: 'image',
          image: 'https://example.com/image.jpg',
        },
      ],
    },
  ],
});
```

You can also use base64-encoded images:

```ts
import { groq } from '@ai-sdk/groq';
import { generateText } from 'ai';
import { readFileSync } from 'fs';


const imageData = readFileSync('path/to/image.jpg', 'base64');


const { text } = await generateText({
  model: groq('meta-llama/llama-4-scout-17b-16e-instruct'),
  messages: [
    {
      role: 'user',
      content: [
        { type: 'text', text: 'Describe this image in detail.' },
        {
          type: 'image',
          image: `data:image/jpeg;base64,${imageData}`,
        },
      ],
    },
  ],
});
```

## [Model Capabilities](#model-capabilities)

| Model | Image Input | Object Generation | Tool Usage | Tool Streaming |
| --- | --- | --- | --- | --- |
| `gemma2-9b-it` |  |  |  |  |
| `llama-3.1-8b-instant` |  |  |  |  |
| `llama-3.3-70b-versatile` |  |  |  |  |
| `meta-llama/llama-guard-4-12b` |  |  |  |  |
| `deepseek-r1-distill-llama-70b` |  |  |  |  |
| `meta-llama/llama-4-maverick-17b-128e-instruct` |  |  |  |  |
| `meta-llama/llama-4-scout-17b-16e-instruct` |  |  |  |  |
| `meta-llama/llama-prompt-guard-2-22m` |  |  |  |  |
| `meta-llama/llama-prompt-guard-2-86m` |  |  |  |  |
| `moonshotai/kimi-k2-instruct` |  |  |  |  |
| `qwen/qwen3-32b` |  |  |  |  |
| `llama-guard-3-8b` |  |  |  |  |
| `llama3-70b-8192` |  |  |  |  |
| `llama3-8b-8192` |  |  |  |  |
| `mixtral-8x7b-32768` |  |  |  |  |
| `qwen-qwq-32b` |  |  |  |  |
| `qwen-2.5-32b` |  |  |  |  |
| `deepseek-r1-distill-qwen-32b` |  |  |  |  |
| `openai/gpt-oss-20b` |  |  |  |  |
| `openai/gpt-oss-120b` |  |  |  |  |

The tables above list the most commonly used models. Please see the [Groq docs](https://console.groq.com/docs/models) for a complete list of available models. You can also pass any available provider model ID as a string if needed.

## [Browser Search Tool](#browser-search-tool)

Groq provides a browser search tool that offers interactive web browsing capabilities. Unlike traditional web search, browser search navigates websites interactively, providing more detailed and comprehensive results.

### [Supported Models](#supported-models)

Browser search is only available for these specific models:

-   `openai/gpt-oss-20b`
-   `openai/gpt-oss-120b`

Browser search will only work with the supported models listed above. Using it with other models will generate a warning and the tool will be ignored.

### [Basic Usage](#basic-usage)

```ts
import { groq } from '@ai-sdk/groq';
import { generateText } from 'ai';


const result = await generateText({
  model: groq('openai/gpt-oss-120b'), // Must use supported model
  prompt:
    'What are the latest developments in AI? Please search for recent news.',
  tools: {
    browser_search: groq.tools.browserSearch({}),
  },
  toolChoice: 'required', // Ensure the tool is used
});


console.log(result.text);
```

### [Streaming Example](#streaming-example)

```ts
import { groq } from '@ai-sdk/groq';
import { streamText } from 'ai';


const result = streamText({
  model: groq('openai/gpt-oss-120b'),
  prompt: 'Search for the latest tech news and summarize it.',
  tools: {
    browser_search: groq.tools.browserSearch({}),
  },
  toolChoice: 'required',
});


for await (const delta of result.fullStream) {
  if (delta.type === 'text-delta') {
    process.stdout.write(delta.text);
  }
}
```

### [Key Features](#key-features)

-   **Interactive Browsing**: Navigates websites like a human user
-   **Comprehensive Results**: More detailed than traditional search snippets
-   **Server-side Execution**: Runs on Groq's infrastructure, no setup required
-   **Powered by Exa**: Uses Exa search engine for optimal results
-   **Currently Free**: Available at no additional charge during beta

### [Best Practices](#best-practices)

-   Use `toolChoice: 'required'` to ensure the browser search is activated
-   Only supported on `openai/gpt-oss-20b` and `openai/gpt-oss-120b` models
-   The tool works automatically - no configuration parameters needed
-   Server-side execution means no additional API keys or setup required

### [Model Validation](#model-validation)

The provider automatically validates model compatibility:

```ts
// ✅ Supported - will work
const result = await generateText({
  model: groq('openai/gpt-oss-120b'),
  tools: { browser_search: groq.tools.browserSearch({}) },
});


// ❌ Unsupported - will show warning and ignore tool
const result = await generateText({
  model: groq('gemma2-9b-it'),
  tools: { browser_search: groq.tools.browserSearch({}) },
});
// Warning: "Browser search is only supported on models: openai/gpt-oss-20b, openai/gpt-oss-120b"
```

For more details about browser search capabilities and limitations, see the [Groq Browser Search Documentation](https://console.groq.com/docs/browser-search).

## [Transcription Models](#transcription-models)

You can create models that call the [Groq transcription API](https://console.groq.com/docs/speech-to-text) using the `.transcription()` factory method.

The first argument is the model id e.g. `whisper-large-v3`.

```ts
const model = groq.transcription('whisper-large-v3');
```

You can also pass additional provider-specific options using the `providerOptions` argument. For example, supplying the input language in ISO-639-1 (e.g. `en`) format will improve accuracy and latency.

```ts
import { experimental_transcribe as transcribe } from 'ai';
import { groq } from '@ai-sdk/groq';
import { readFile } from 'fs/promises';


const result = await transcribe({
  model: groq.transcription('whisper-large-v3'),
  audio: await readFile('audio.mp3'),
  providerOptions: { groq: { language: 'en' } },
});
```

The following provider options are available:

-   **timestampGranularities** *string\[\]* The granularity of the timestamps in the transcription. Defaults to `['segment']`. Possible values are `['word']`, `['segment']`, and `['word', 'segment']`. Note: There is no additional latency for segment timestamps, but generating word timestamps incurs additional latency.
    
-   **language** *string* The language of the input audio. Supplying the input language in ISO-639-1 format (e.g. 'en') will improve accuracy and latency. Optional.
    
-   **prompt** *string* An optional text to guide the model's style or continue a previous audio segment. The prompt should match the audio language. Optional.
    
-   **temperature** *number* The sampling temperature, between 0 and 1. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic. If set to 0, the model will use log probability to automatically increase the temperature until certain thresholds are hit. Defaults to 0. Optional.
    

### [Model Capabilities](#model-capabilities-1)

| Model | Transcription | Duration | Segments | Language |
| --- | --- | --- | --- | --- |
| `whisper-large-v3` |  |  |  |  |
| `whisper-large-v3-turbo` |  |  |  |  |
| `distil-whisper-large-v3-en` |  |  |  |  |

[Previous

Amazon Bedrock

](amazon-bedrock.html)

[Next

Fal

](fal.html)

On this page

[Groq Provider](#groq-provider)

[Setup](#setup)

[Provider Instance](#provider-instance)

[Language Models](#language-models)

[Reasoning Models](#reasoning-models)

[Structured Outputs](#structured-outputs)

[Example](#example)

[Image Input](#image-input)

[Model Capabilities](#model-capabilities)

[Browser Search Tool](#browser-search-tool)

[Supported Models](#supported-models)

[Basic Usage](#basic-usage)

[Streaming Example](#streaming-example)

[Key Features](#key-features)

[Best Practices](#best-practices)

[Model Validation](#model-validation)

[Transcription Models](#transcription-models)

[Model Capabilities](#model-capabilities-1)

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