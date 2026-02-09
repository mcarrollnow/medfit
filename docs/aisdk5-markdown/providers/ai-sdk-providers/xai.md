AI SDK Providers: xAI Grok

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

[AI SDK Providers](../ai-sdk-providers.html)xAI Grok

# [xAI Grok Provider](#xai-grok-provider)

The [xAI Grok](https://x.ai) provider contains language model support for the [xAI API](https://x.ai/api).

## [Setup](#setup)

The xAI Grok provider is available via the `@ai-sdk/xai` module. You can install it with

pnpm

npm

yarn

bun

pnpm add @ai-sdk/xai

## [Provider Instance](#provider-instance)

You can import the default provider instance `xai` from `@ai-sdk/xai`:

```ts
import { xai } from '@ai-sdk/xai';
```

If you need a customized setup, you can import `createXai` from `@ai-sdk/xai` and create a provider instance with your settings:

```ts
import { createXai } from '@ai-sdk/xai';


const xai = createXai({
  apiKey: 'your-api-key',
});
```

You can use the following optional settings to customize the xAI provider instance:

-   **baseURL** *string*
    
    Use a different URL prefix for API calls, e.g. to use proxy servers. The default prefix is `https://api.x.ai/v1`.
    
-   **apiKey** *string*
    
    API key that is being sent using the `Authorization` header. It defaults to the `XAI_API_KEY` environment variable.
    
-   **headers** *Record<string,string>*
    
    Custom headers to include in the requests.
    
-   **fetch** *(input: RequestInfo, init?: RequestInit) => Promise<Response>*
    
    Custom [fetch](https://developer.mozilla.org/en-US/docs/Web/API/fetch) implementation. Defaults to the global `fetch` function. You can use it as a middleware to intercept requests, or to provide a custom fetch implementation for e.g. testing.
    

## [Language Models](#language-models)

You can create [xAI models](https://console.x.ai) using a provider instance. The first argument is the model id, e.g. `grok-3`.

```ts
const model = xai('grok-3');
```

### [Example](#example)

You can use xAI language models to generate text with the `generateText` function:

```ts
import { xai } from '@ai-sdk/xai';
import { generateText } from 'ai';


const { text } = await generateText({
  model: xai('grok-3'),
  prompt: 'Write a vegetarian lasagna recipe for 4 people.',
});
```

xAI language models can also be used in the `streamText`, `generateObject`, and `streamObject` functions (see [AI SDK Core](../../docs/ai-sdk-core.html)).

### [Provider Options](#provider-options)

xAI chat models support additional provider options that are not part of the [standard call settings](../../docs/ai-sdk-core/settings.html). You can pass them in the `providerOptions` argument:

```ts
const model = xai('grok-3-mini');


await generateText({
  model,
  providerOptions: {
    xai: {
      reasoningEffort: 'high',
    },
  },
});
```

The following optional provider options are available for xAI chat models:

-   **reasoningEffort** *'low' | 'high'*
    
    Reasoning effort for reasoning models. Only supported by `grok-3-mini` and `grok-3-mini-fast` models.
    

## [Live Search](#live-search)

xAI models support Live Search functionality, allowing them to query real-time data from various sources and include it in responses with citations.

### [Basic Search](#basic-search)

To enable search, specify `searchParameters` with a search mode:

```ts
import { xai } from '@ai-sdk/xai';
import { generateText } from 'ai';


const { text, sources } = await generateText({
  model: xai('grok-3-latest'),
  prompt: 'What are the latest developments in AI?',
  providerOptions: {
    xai: {
      searchParameters: {
        mode: 'auto', // 'auto', 'on', or 'off'
        returnCitations: true,
        maxSearchResults: 5,
      },
    },
  },
});


console.log(text);
console.log('Sources:', sources);
```

### [Search Parameters](#search-parameters)

The following search parameters are available:

-   **mode** *'auto' | 'on' | 'off'*
    
    Search mode preference:
    
    -   `'auto'` (default): Model decides whether to search
    -   `'on'`: Always enables search
    -   `'off'`: Disables search completely
-   **returnCitations** *boolean*
    
    Whether to return citations in the response. Defaults to `true`.
    
-   **fromDate** *string*
    
    Start date for search data in ISO8601 format (`YYYY-MM-DD`).
    
-   **toDate** *string*
    
    End date for search data in ISO8601 format (`YYYY-MM-DD`).
    
-   **maxSearchResults** *number*
    
    Maximum number of search results to consider. Defaults to 20, max 50.
    
-   **sources** *Array<SearchSource>*
    
    Data sources to search from. Defaults to `["web", "x"]` if not specified.
    

### [Search Sources](#search-sources)

You can specify different types of data sources for search:

#### [Web Search](#web-search)

```ts
const result = await generateText({
  model: xai('grok-3-latest'),
  prompt: 'Best ski resorts in Switzerland',
  providerOptions: {
    xai: {
      searchParameters: {
        mode: 'on',
        sources: [
          {
            type: 'web',
            country: 'CH', // ISO alpha-2 country code
            allowedWebsites: ['ski.com', 'snow-forecast.com'],
            safeSearch: true,
          },
        ],
      },
    },
  },
});
```

#### [Web source parameters](#web-source-parameters)

-   **country** *string*: ISO alpha-2 country code
-   **allowedWebsites** *string\[\]*: Max 5 allowed websites
-   **excludedWebsites** *string\[\]*: Max 5 excluded websites
-   **safeSearch** *boolean*: Enable safe search (default: true)

#### [X (Twitter) Search](#x-twitter-search)

```ts
const result = await generateText({
  model: xai('grok-3-latest'),
  prompt: 'Latest updates on Grok AI',
  providerOptions: {
    xai: {
      searchParameters: {
        mode: 'on',
        sources: [
          {
            type: 'x',
            includedXHandles: ['grok', 'xai'],
            excludedXHandles: ['openai'],
            postFavoriteCount: 10,
            postViewCount: 100,
          },
        ],
      },
    },
  },
});
```

#### [X source parameters](#x-source-parameters)

-   **includedXHandles** *string\[\]*: Array of X handles to search (without @ symbol)
-   **excludedXHandles** *string\[\]*: Array of X handles to exclude from search (without @ symbol)
-   **postFavoriteCount** *number*: Minimum favorite count of the X posts to consider.
-   **postViewCount** *number*: Minimum view count of the X posts to consider.

#### [News Search](#news-search)

```ts
const result = await generateText({
  model: xai('grok-3-latest'),
  prompt: 'Recent tech industry news',
  providerOptions: {
    xai: {
      searchParameters: {
        mode: 'on',
        sources: [
          {
            type: 'news',
            country: 'US',
            excludedWebsites: ['tabloid.com'],
            safeSearch: true,
          },
        ],
      },
    },
  },
});
```

#### [News source parameters](#news-source-parameters)

-   **country** *string*: ISO alpha-2 country code
-   **excludedWebsites** *string\[\]*: Max 5 excluded websites
-   **safeSearch** *boolean*: Enable safe search (default: true)

#### [RSS Feed Search](#rss-feed-search)

```ts
const result = await generateText({
  model: xai('grok-3-latest'),
  prompt: 'Latest status updates',
  providerOptions: {
    xai: {
      searchParameters: {
        mode: 'on',
        sources: [
          {
            type: 'rss',
            links: ['https://status.x.ai/feed.xml'],
          },
        ],
      },
    },
  },
});
```

#### [RSS source parameters](#rss-source-parameters)

-   **links** *string\[\]*: Array of RSS feed URLs (max 1 currently supported)

### [Multiple Sources](#multiple-sources)

You can combine multiple data sources in a single search:

```ts
const result = await generateText({
  model: xai('grok-3-latest'),
  prompt: 'Comprehensive overview of recent AI breakthroughs',
  providerOptions: {
    xai: {
      searchParameters: {
        mode: 'on',
        returnCitations: true,
        maxSearchResults: 15,
        sources: [
          {
            type: 'web',
            allowedWebsites: ['arxiv.org', 'openai.com'],
          },
          {
            type: 'news',
            country: 'US',
          },
          {
            type: 'x',
            includedXHandles: ['openai', 'deepmind'],
          },
        ],
      },
    },
  },
});
```

### [Sources and Citations](#sources-and-citations)

When search is enabled with `returnCitations: true`, the response includes sources that were used to generate the answer:

```ts
const { text, sources } = await generateText({
  model: xai('grok-3-latest'),
  prompt: 'What are the latest developments in AI?',
  providerOptions: {
    xai: {
      searchParameters: {
        mode: 'auto',
        returnCitations: true,
      },
    },
  },
});


// Access the sources used
for (const source of sources) {
  if (source.sourceType === 'url') {
    console.log('Source:', source.url);
  }
}
```

### [Streaming with Search](#streaming-with-search)

Live Search works with streaming responses. Citations are included when the stream completes:

```ts
import { streamText } from 'ai';


const result = streamText({
  model: xai('grok-3-latest'),
  prompt: 'What has happened in tech recently?',
  providerOptions: {
    xai: {
      searchParameters: {
        mode: 'auto',
        returnCitations: true,
      },
    },
  },
});


for await (const textPart of result.textStream) {
  process.stdout.write(textPart);
}


console.log('Sources:', await result.sources);
```

## [Model Capabilities](#model-capabilities)

| Model | Image Input | Object Generation | Tool Usage | Tool Streaming | Reasoning |
| --- | --- | --- | --- | --- | --- |
| `grok-4-fast-non-reasoning` |  |  |  |  |  |
| `grok-4-fast-reasoning` |  |  |  |  |  |
| `grok-code-fast-1` |  |  |  |  |  |
| `grok-4` |  |  |  |  |  |
| `grok-3` |  |  |  |  |  |
| `grok-3-latest` |  |  |  |  |  |
| `grok-3-fast` |  |  |  |  |  |
| `grok-3-fast-latest` |  |  |  |  |  |
| `grok-3-mini` |  |  |  |  |  |
| `grok-3-mini-latest` |  |  |  |  |  |
| `grok-3-mini-fast` |  |  |  |  |  |
| `grok-3-mini-fast-latest` |  |  |  |  |  |
| `grok-2` |  |  |  |  |  |
| `grok-2-latest` |  |  |  |  |  |
| `grok-2-1212` |  |  |  |  |  |
| `grok-2-vision` |  |  |  |  |  |
| `grok-2-vision-latest` |  |  |  |  |  |
| `grok-2-vision-1212` |  |  |  |  |  |
| `grok-beta` |  |  |  |  |  |
| `grok-vision-beta` |  |  |  |  |  |

The table above lists popular models. Please see the [xAI docs](https://docs.x.ai/docs#models) for a full list of available models. The table above lists popular models. You can also pass any available provider model ID as a string if needed.

## [Image Models](#image-models)

You can create xAI image models using the `.image()` factory method. For more on image generation with the AI SDK see [generateImage()](../../docs/reference/ai-sdk-core/generate-image.html).

```ts
import { xai } from '@ai-sdk/xai';
import { experimental_generateImage as generateImage } from 'ai';


const { image } = await generateImage({
  model: xai.image('grok-2-image'),
  prompt: 'A futuristic cityscape at sunset',
});
```

The xAI image model does not currently support the `aspectRatio` or `size` parameters. Image size defaults to 1024x768.

### [Model-specific options](#model-specific-options)

You can customize the image generation behavior with model-specific settings:

```ts
import { xai } from '@ai-sdk/xai';
import { experimental_generateImage as generateImage } from 'ai';


const { images } = await generateImage({
  model: xai.image('grok-2-image'),
  prompt: 'A futuristic cityscape at sunset',
  maxImagesPerCall: 5, // Default is 10
  n: 2, // Generate 2 images
});
```

### [Model Capabilities](#model-capabilities-1)

| Model | Sizes | Notes |
| --- | --- | --- |
| `grok-2-image` | 1024x768 (default) | xAI's text-to-image generation model, designed to create high-quality images from text prompts. It's trained on a diverse dataset and can generate images across various styles, subjects, and settings. |

[Previous

AI Gateway

](ai-gateway.html)

[Next

Vercel

](vercel.html)

On this page

[xAI Grok Provider](#xai-grok-provider)

[Setup](#setup)

[Provider Instance](#provider-instance)

[Language Models](#language-models)

[Example](#example)

[Provider Options](#provider-options)

[Live Search](#live-search)

[Basic Search](#basic-search)

[Search Parameters](#search-parameters)

[Search Sources](#search-sources)

[Web Search](#web-search)

[Web source parameters](#web-source-parameters)

[X (Twitter) Search](#x-twitter-search)

[X source parameters](#x-source-parameters)

[News Search](#news-search)

[News source parameters](#news-source-parameters)

[RSS Feed Search](#rss-feed-search)

[RSS source parameters](#rss-source-parameters)

[Multiple Sources](#multiple-sources)

[Sources and Citations](#sources-and-citations)

[Streaming with Search](#streaming-with-search)

[Model Capabilities](#model-capabilities)

[Image Models](#image-models)

[Model-specific options](#model-specific-options)

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