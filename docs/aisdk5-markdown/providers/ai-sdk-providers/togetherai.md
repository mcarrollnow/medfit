AI SDK Providers: Together.ai

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

[AI SDK Providers](../ai-sdk-providers.html)Together.ai

# [Together.ai Provider](#togetherai-provider)

The [Together.ai](https://together.ai) provider contains support for 200+ open-source models through the [Together.ai API](https://docs.together.ai/reference).

## [Setup](#setup)

The Together.ai provider is available via the `@ai-sdk/togetherai` module. You can install it with

pnpm

npm

yarn

bun

pnpm add @ai-sdk/togetherai

## [Provider Instance](#provider-instance)

You can import the default provider instance `togetherai` from `@ai-sdk/togetherai`:

```ts
import { togetherai } from '@ai-sdk/togetherai';
```

If you need a customized setup, you can import `createTogetherAI` from `@ai-sdk/togetherai` and create a provider instance with your settings:

```ts
import { createTogetherAI } from '@ai-sdk/togetherai';


const togetherai = createTogetherAI({
  apiKey: process.env.TOGETHER_AI_API_KEY ?? '',
});
```

You can use the following optional settings to customize the Together.ai provider instance:

-   **baseURL** *string*
    
    Use a different URL prefix for API calls, e.g. to use proxy servers. The default prefix is `https://api.together.xyz/v1`.
    
-   **apiKey** *string*
    
    API key that is being sent using the `Authorization` header. It defaults to the `TOGETHER_AI_API_KEY` environment variable.
    
-   **headers** *Record<string,string>*
    
    Custom headers to include in the requests.
    
-   **fetch** *(input: RequestInfo, init?: RequestInit) => Promise<Response>*
    
    Custom [fetch](https://developer.mozilla.org/en-US/docs/Web/API/fetch) implementation. Defaults to the global `fetch` function. You can use it as a middleware to intercept requests, or to provide a custom fetch implementation for e.g. testing.
    

## [Language Models](#language-models)

You can create [Together.ai models](https://docs.together.ai/docs/serverless-models) using a provider instance. The first argument is the model id, e.g. `google/gemma-2-9b-it`.

```ts
const model = togetherai('google/gemma-2-9b-it');
```

### [Reasoning Models](#reasoning-models)

Together.ai exposes the thinking of `deepseek-ai/DeepSeek-R1` in the generated text using the `<think>` tag. You can use the `extractReasoningMiddleware` to extract this reasoning and expose it as a `reasoning` property on the result:

```ts
import { togetherai } from '@ai-sdk/togetherai';
import { wrapLanguageModel, extractReasoningMiddleware } from 'ai';


const enhancedModel = wrapLanguageModel({
  model: togetherai('deepseek-ai/DeepSeek-R1'),
  middleware: extractReasoningMiddleware({ tagName: 'think' }),
});
```

You can then use that enhanced model in functions like `generateText` and `streamText`.

### [Example](#example)

You can use Together.ai language models to generate text with the `generateText` function:

```ts
import { togetherai } from '@ai-sdk/togetherai';
import { generateText } from 'ai';


const { text } = await generateText({
  model: togetherai('meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo'),
  prompt: 'Write a vegetarian lasagna recipe for 4 people.',
});
```

Together.ai language models can also be used in the `streamText` function (see [AI SDK Core](../../docs/ai-sdk-core.html)).

The Together.ai provider also supports [completion models](https://docs.together.ai/docs/serverless-models#language-models) via (following the above example code) `togetherai.completion()` and [embedding models](https://docs.together.ai/docs/serverless-models#embedding-models) via `togetherai.textEmbedding()`.

## [Model Capabilities](#model-capabilities)

| Model | Image Input | Object Generation | Tool Usage | Tool Streaming |
| --- | --- | --- | --- | --- |
| `meta-llama/Meta-Llama-3.3-70B-Instruct-Turbo` |  |  |  |  |
| `meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo` |  |  |  |  |
| `mistralai/Mixtral-8x22B-Instruct-v0.1` |  |  |  |  |
| `mistralai/Mistral-7B-Instruct-v0.3` |  |  |  |  |
| `deepseek-ai/DeepSeek-V3` |  |  |  |  |
| `google/gemma-2b-it` |  |  |  |  |
| `Qwen/Qwen2.5-72B-Instruct-Turbo` |  |  |  |  |
| `databricks/dbrx-instruct` |  |  |  |  |

The table above lists popular models. Please see the [Together.ai docs](https://docs.together.ai/docs/serverless-models) for a full list of available models. You can also pass any available provider model ID as a string if needed.

## [Image Models](#image-models)

You can create Together.ai image models using the `.image()` factory method. For more on image generation with the AI SDK see [generateImage()](../../docs/reference/ai-sdk-core/generate-image.html).

```ts
import { togetherai } from '@ai-sdk/togetherai';
import { experimental_generateImage as generateImage } from 'ai';


const { images } = await generateImage({
  model: togetherai.image('black-forest-labs/FLUX.1-dev'),
  prompt: 'A delighted resplendent quetzal mid flight amidst raindrops',
});
```

You can pass optional provider-specific request parameters using the `providerOptions` argument.

```ts
import { togetherai } from '@ai-sdk/togetherai';
import { experimental_generateImage as generateImage } from 'ai';


const { images } = await generateImage({
  model: togetherai.image('black-forest-labs/FLUX.1-dev'),
  prompt: 'A delighted resplendent quetzal mid flight amidst raindrops',
  size: '512x512',
  // Optional additional provider-specific request parameters
  providerOptions: {
    togetherai: {
      steps: 40,
    },
  },
});
```

For a complete list of available provider-specific options, see the [Together.ai Image Generation API Reference](https://docs.together.ai/reference/post_images-generations).

### [Model Capabilities](#model-capabilities-1)

Together.ai image models support various image dimensions that vary by model. Common sizes include 512x512, 768x768, and 1024x1024, with some models supporting up to 1792x1792. The default size is 1024x1024.

| Available Models |
| --- |
| `stabilityai/stable-diffusion-xl-base-1.0` |
| `black-forest-labs/FLUX.1-dev` |
| `black-forest-labs/FLUX.1-dev-lora` |
| `black-forest-labs/FLUX.1-schnell` |
| `black-forest-labs/FLUX.1-canny` |
| `black-forest-labs/FLUX.1-depth` |
| `black-forest-labs/FLUX.1-redux` |
| `black-forest-labs/FLUX.1.1-pro` |
| `black-forest-labs/FLUX.1-pro` |
| `black-forest-labs/FLUX.1-schnell-Free` |

Please see the [Together.ai models page](https://docs.together.ai/docs/serverless-models#image-models) for a full list of available image models and their capabilities.

## [Embedding Models](#embedding-models)

You can create Together.ai embedding models using the `.textEmbedding()` factory method. For more on embedding models with the AI SDK see [embed()](../../docs/reference/ai-sdk-core/embed.html).

```ts
import { togetherai } from '@ai-sdk/togetherai';
import { embed } from 'ai';


const { embedding } = await embed({
  model: togetherai.textEmbedding('togethercomputer/m2-bert-80M-2k-retrieval'),
  value: 'sunny day at the beach',
});
```

### [Model Capabilities](#model-capabilities-2)

| Model | Dimensions | Max Tokens |
| --- | --- | --- |
| `togethercomputer/m2-bert-80M-2k-retrieval` | 768 | 2048 |
| `togethercomputer/m2-bert-80M-8k-retrieval` | 768 | 8192 |
| `togethercomputer/m2-bert-80M-32k-retrieval` | 768 | 32768 |
| `WhereIsAI/UAE-Large-V1` | 1024 | 512 |
| `BAAI/bge-large-en-v1.5` | 1024 | 512 |
| `BAAI/bge-base-en-v1.5` | 768 | 512 |
| `sentence-transformers/msmarco-bert-base-dot-v5` | 768 | 512 |
| `bert-base-uncased` | 768 | 512 |

For a complete list of available embedding models, see the [Together.ai models page](https://docs.together.ai/docs/serverless-models#embedding-models).

[Previous

Mistral AI

](mistral.html)

[Next

Cohere

](cohere.html)

On this page

[Together.ai Provider](#togetherai-provider)

[Setup](#setup)

[Provider Instance](#provider-instance)

[Language Models](#language-models)

[Reasoning Models](#reasoning-models)

[Example](#example)

[Model Capabilities](#model-capabilities)

[Image Models](#image-models)

[Model Capabilities](#model-capabilities-1)

[Embedding Models](#embedding-models)

[Model Capabilities](#model-capabilities-2)

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