AI SDK Providers: DeepInfra

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

[AI SDK Providers](../ai-sdk-providers.html)DeepInfra

# [DeepInfra Provider](#deepinfra-provider)

The [DeepInfra](https://deepinfra.com) provider contains support for state-of-the-art models through the DeepInfra API, including Llama 3, Mixtral, Qwen, and many other popular open-source models.

## [Setup](#setup)

The DeepInfra provider is available via the `@ai-sdk/deepinfra` module. You can install it with:

pnpm

npm

yarn

bun

pnpm add @ai-sdk/deepinfra

## [Provider Instance](#provider-instance)

You can import the default provider instance `deepinfra` from `@ai-sdk/deepinfra`:

```ts
import { deepinfra } from '@ai-sdk/deepinfra';
```

If you need a customized setup, you can import `createDeepInfra` from `@ai-sdk/deepinfra` and create a provider instance with your settings:

```ts
import { createDeepInfra } from '@ai-sdk/deepinfra';


const deepinfra = createDeepInfra({
  apiKey: process.env.DEEPINFRA_API_KEY ?? '',
});
```

You can use the following optional settings to customize the DeepInfra provider instance:

-   **baseURL** *string*
    
    Use a different URL prefix for API calls, e.g. to use proxy servers. The default prefix is `https://api.deepinfra.com/v1`.
    
    Note: Language models and embeddings use OpenAI-compatible endpoints at `{baseURL}/openai`, while image models use `{baseURL}/inference`.
    
-   **apiKey** *string*
    
    API key that is being sent using the `Authorization` header. It defaults to the `DEEPINFRA_API_KEY` environment variable.
    
-   **headers** *Record<string,string>*
    
    Custom headers to include in the requests.
    
-   **fetch** *(input: RequestInfo, init?: RequestInit) => Promise<Response>*
    
    Custom [fetch](https://developer.mozilla.org/en-US/docs/Web/API/fetch) implementation. Defaults to the global `fetch` function. You can use it as a middleware to intercept requests, or to provide a custom fetch implementation for e.g. testing.
    

## [Language Models](#language-models)

You can create language models using a provider instance. The first argument is the model ID, for example:

```ts
import { deepinfra } from '@ai-sdk/deepinfra';
import { generateText } from 'ai';


const { text } = await generateText({
  model: deepinfra('meta-llama/Meta-Llama-3.1-70B-Instruct'),
  prompt: 'Write a vegetarian lasagna recipe for 4 people.',
});
```

DeepInfra language models can also be used in the `streamText` function (see [AI SDK Core](../../docs/ai-sdk-core.html)).

## [Model Capabilities](#model-capabilities)

| Model | Image Input | Object Generation | Tool Usage | Tool Streaming |
| --- | --- | --- | --- | --- |
| `meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8` |  |  |  |  |
| `meta-llama/Llama-4-Scout-17B-16E-Instruct` |  |  |  |  |
| `meta-llama/Llama-3.3-70B-Instruct-Turbo` |  |  |  |  |
| `meta-llama/Llama-3.3-70B-Instruct` |  |  |  |  |
| `meta-llama/Meta-Llama-3.1-405B-Instruct` |  |  |  |  |
| `meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo` |  |  |  |  |
| `meta-llama/Meta-Llama-3.1-70B-Instruct` |  |  |  |  |
| `meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo` |  |  |  |  |
| `meta-llama/Meta-Llama-3.1-8B-Instruct` |  |  |  |  |
| `meta-llama/Llama-3.2-11B-Vision-Instruct` |  |  |  |  |
| `meta-llama/Llama-3.2-90B-Vision-Instruct` |  |  |  |  |
| `mistralai/Mixtral-8x7B-Instruct-v0.1` |  |  |  |  |
| `deepseek-ai/DeepSeek-V3` |  |  |  |  |
| `deepseek-ai/DeepSeek-R1` |  |  |  |  |
| `deepseek-ai/DeepSeek-R1-Distill-Llama-70B` |  |  |  |  |
| `deepseek-ai/DeepSeek-R1-Turbo` |  |  |  |  |
| `nvidia/Llama-3.1-Nemotron-70B-Instruct` |  |  |  |  |
| `Qwen/Qwen2-7B-Instruct` |  |  |  |  |
| `Qwen/Qwen2.5-72B-Instruct` |  |  |  |  |
| `Qwen/Qwen2.5-Coder-32B-Instruct` |  |  |  |  |
| `Qwen/QwQ-32B-Preview` |  |  |  |  |
| `google/codegemma-7b-it` |  |  |  |  |
| `google/gemma-2-9b-it` |  |  |  |  |
| `microsoft/WizardLM-2-8x22B` |  |  |  |  |

The table above lists popular models. Please see the [DeepInfra docs](https://deepinfra.com) for a full list of available models. You can also pass any available provider model ID as a string if needed.

## [Image Models](#image-models)

You can create DeepInfra image models using the `.image()` factory method. For more on image generation with the AI SDK see [generateImage()](../../docs/reference/ai-sdk-core/generate-image.html).

```ts
import { deepinfra } from '@ai-sdk/deepinfra';
import { experimental_generateImage as generateImage } from 'ai';


const { image } = await generateImage({
  model: deepinfra.image('stabilityai/sd3.5'),
  prompt: 'A futuristic cityscape at sunset',
  aspectRatio: '16:9',
});
```

Model support for `size` and `aspectRatio` parameters varies by model. Please check the individual model documentation on [DeepInfra's models page](https://deepinfra.com/models/text-to-image) for supported options and additional parameters.

### [Model-specific options](#model-specific-options)

You can pass model-specific parameters using the `providerOptions.deepinfra` field:

```ts
import { deepinfra } from '@ai-sdk/deepinfra';
import { experimental_generateImage as generateImage } from 'ai';


const { image } = await generateImage({
  model: deepinfra.image('stabilityai/sd3.5'),
  prompt: 'A futuristic cityscape at sunset',
  aspectRatio: '16:9',
  providerOptions: {
    deepinfra: {
      num_inference_steps: 30, // Control the number of denoising steps (1-50)
    },
  },
});
```

### [Model Capabilities](#model-capabilities-1)

For models supporting aspect ratios, the following ratios are typically supported: `1:1 (default), 16:9, 1:9, 3:2, 2:3, 4:5, 5:4, 9:16, 9:21`

For models supporting size parameters, dimensions must typically be:

-   Multiples of 32
-   Width and height between 256 and 1440 pixels
-   Default size is 1024x1024

| Model | Dimensions Specification | Notes |
| --- | --- | --- |
| `stabilityai/sd3.5` | Aspect Ratio | Premium quality base model, 8B parameters |
| `black-forest-labs/FLUX-1.1-pro` | Size | Latest state-of-art model with superior prompt following |
| `black-forest-labs/FLUX-1-schnell` | Size | Fast generation in 1-4 steps |
| `black-forest-labs/FLUX-1-dev` | Size | Optimized for anatomical accuracy |
| `black-forest-labs/FLUX-pro` | Size | Flagship Flux model |
| `stabilityai/sd3.5-medium` | Aspect Ratio | Balanced 2.5B parameter model |
| `stabilityai/sdxl-turbo` | Aspect Ratio | Optimized for fast generation |

For more details and pricing information, see the [DeepInfra text-to-image models page](https://deepinfra.com/models/text-to-image).

## [Embedding Models](#embedding-models)

You can create DeepInfra embedding models using the `.textEmbedding()` factory method. For more on embedding models with the AI SDK see [embed()](../../docs/reference/ai-sdk-core/embed.html).

```ts
import { deepinfra } from '@ai-sdk/deepinfra';
import { embed } from 'ai';


const { embedding } = await embed({
  model: deepinfra.textEmbedding('BAAI/bge-large-en-v1.5'),
  value: 'sunny day at the beach',
});
```

### [Model Capabilities](#model-capabilities-2)

| Model | Dimensions | Max Tokens |
| --- | --- | --- |
| `BAAI/bge-base-en-v1.5` | 768 | 512 |
| `BAAI/bge-large-en-v1.5` | 1024 | 512 |
| `BAAI/bge-m3` | 1024 | 8192 |
| `intfloat/e5-base-v2` | 768 | 512 |
| `intfloat/e5-large-v2` | 1024 | 512 |
| `intfloat/multilingual-e5-large` | 1024 | 512 |
| `sentence-transformers/all-MiniLM-L12-v2` | 384 | 256 |
| `sentence-transformers/all-MiniLM-L6-v2` | 384 | 256 |
| `sentence-transformers/all-mpnet-base-v2` | 768 | 384 |
| `sentence-transformers/clip-ViT-B-32` | 512 | 77 |
| `sentence-transformers/clip-ViT-B-32-multilingual-v1` | 512 | 77 |
| `sentence-transformers/multi-qa-mpnet-base-dot-v1` | 768 | 512 |
| `sentence-transformers/paraphrase-MiniLM-L6-v2` | 384 | 128 |
| `shibing624/text2vec-base-chinese` | 768 | 512 |
| `thenlper/gte-base` | 768 | 512 |
| `thenlper/gte-large` | 1024 | 512 |

For a complete list of available embedding models, see the [DeepInfra embeddings page](https://deepinfra.com/models/embeddings).

[Previous

AssemblyAI

](assemblyai.html)

[Next

Deepgram

](deepgram.html)

On this page

[DeepInfra Provider](#deepinfra-provider)

[Setup](#setup)

[Provider Instance](#provider-instance)

[Language Models](#language-models)

[Model Capabilities](#model-capabilities)

[Image Models](#image-models)

[Model-specific options](#model-specific-options)

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