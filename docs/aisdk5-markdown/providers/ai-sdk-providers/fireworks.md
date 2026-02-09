AI SDK Providers: Fireworks

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

[AI SDK Providers](../ai-sdk-providers.html)Fireworks

# [Fireworks Provider](#fireworks-provider)

[Fireworks](https://fireworks.ai/) is a platform for running and testing LLMs through their [API](https://readme.fireworks.ai/).

## [Setup](#setup)

The Fireworks provider is available via the `@ai-sdk/fireworks` module. You can install it with

pnpm

npm

yarn

bun

pnpm add @ai-sdk/fireworks

## [Provider Instance](#provider-instance)

You can import the default provider instance `fireworks` from `@ai-sdk/fireworks`:

```ts
import { fireworks } from '@ai-sdk/fireworks';
```

If you need a customized setup, you can import `createFireworks` from `@ai-sdk/fireworks` and create a provider instance with your settings:

```ts
import { createFireworks } from '@ai-sdk/fireworks';


const fireworks = createFireworks({
  apiKey: process.env.FIREWORKS_API_KEY ?? '',
});
```

You can use the following optional settings to customize the Fireworks provider instance:

-   **baseURL** *string*
    
    Use a different URL prefix for API calls, e.g. to use proxy servers. The default prefix is `https://api.fireworks.ai/inference/v1`.
    
-   **apiKey** *string*
    
    API key that is being sent using the `Authorization` header. It defaults to the `FIREWORKS_API_KEY` environment variable.
    
-   **headers** *Record<string,string>*
    
    Custom headers to include in the requests.
    
-   **fetch** *(input: RequestInfo, init?: RequestInit) => Promise<Response>*
    
    Custom [fetch](https://developer.mozilla.org/en-US/docs/Web/API/fetch) implementation.
    

## [Language Models](#language-models)

You can create [Fireworks models](https://fireworks.ai/models) using a provider instance. The first argument is the model id, e.g. `accounts/fireworks/models/firefunction-v1`:

```ts
const model = fireworks('accounts/fireworks/models/firefunction-v1');
```

### [Reasoning Models](#reasoning-models)

Fireworks exposes the thinking of `deepseek-r1` in the generated text using the `<think>` tag. You can use the `extractReasoningMiddleware` to extract this reasoning and expose it as a `reasoning` property on the result:

```ts
import { fireworks } from '@ai-sdk/fireworks';
import { wrapLanguageModel, extractReasoningMiddleware } from 'ai';


const enhancedModel = wrapLanguageModel({
  model: fireworks('accounts/fireworks/models/deepseek-r1'),
  middleware: extractReasoningMiddleware({ tagName: 'think' }),
});
```

You can then use that enhanced model in functions like `generateText` and `streamText`.

### [Example](#example)

You can use Fireworks language models to generate text with the `generateText` function:

```ts
import { fireworks } from '@ai-sdk/fireworks';
import { generateText } from 'ai';


const { text } = await generateText({
  model: fireworks('accounts/fireworks/models/firefunction-v1'),
  prompt: 'Write a vegetarian lasagna recipe for 4 people.',
});
```

Fireworks language models can also be used in the `streamText` function (see [AI SDK Core](../../docs/ai-sdk-core.html)).

### [Completion Models](#completion-models)

You can create models that call the Fireworks completions API using the `.completion()` factory method:

```ts
const model = fireworks.completion('accounts/fireworks/models/firefunction-v1');
```

### [Model Capabilities](#model-capabilities)

| Model | Image Input | Object Generation | Tool Usage | Tool Streaming |
| --- | --- | --- | --- | --- |
| `accounts/fireworks/models/firefunction-v1` |  |  |  |  |
| `accounts/fireworks/models/deepseek-r1` |  |  |  |  |
| `accounts/fireworks/models/deepseek-v3` |  |  |  |  |
| `accounts/fireworks/models/llama-v3p1-405b-instruct` |  |  |  |  |
| `accounts/fireworks/models/llama-v3p1-8b-instruct` |  |  |  |  |
| `accounts/fireworks/models/llama-v3p2-3b-instruct` |  |  |  |  |
| `accounts/fireworks/models/llama-v3p3-70b-instruct` |  |  |  |  |
| `accounts/fireworks/models/mixtral-8x7b-instruct` |  |  |  |  |
| `accounts/fireworks/models/mixtral-8x7b-instruct-hf` |  |  |  |  |
| `accounts/fireworks/models/mixtral-8x22b-instruct` |  |  |  |  |
| `accounts/fireworks/models/qwen2p5-coder-32b-instruct` |  |  |  |  |
| `accounts/fireworks/models/qwen2p5-72b-instruct` |  |  |  |  |
| `accounts/fireworks/models/qwen-qwq-32b-preview` |  |  |  |  |
| `accounts/fireworks/models/qwen2-vl-72b-instruct` |  |  |  |  |
| `accounts/fireworks/models/llama-v3p2-11b-vision-instruct` |  |  |  |  |
| `accounts/fireworks/models/qwq-32b` |  |  |  |  |
| `accounts/fireworks/models/yi-large` |  |  |  |  |
| `accounts/fireworks/models/kimi-k2-instruct` |  |  |  |  |

The table above lists popular models. Please see the [Fireworks models page](https://fireworks.ai/models) for a full list of available models.

## [Embedding Models](#embedding-models)

You can create models that call the Fireworks embeddings API using the `.textEmbedding()` factory method:

```ts
const model = fireworks.textEmbedding('nomic-ai/nomic-embed-text-v1.5');
```

You can use Fireworks embedding models to generate embeddings with the `embed` function:

```ts
import { fireworks } from '@ai-sdk/fireworks';
import { embed } from 'ai';


const { embedding } = await embed({
  model: fireworks.textEmbedding('nomic-ai/nomic-embed-text-v1.5'),
  value: 'sunny day at the beach',
});
```

### [Model Capabilities](#model-capabilities-1)

| Model | Dimensions | Max Tokens |
| --- | --- | --- |
| `nomic-ai/nomic-embed-text-v1.5` | 768 | 8192 |

For more embedding models, see the [Fireworks models page](https://fireworks.ai/models) for a full list of available models.

## [Image Models](#image-models)

You can create Fireworks image models using the `.image()` factory method. For more on image generation with the AI SDK see [generateImage()](../../docs/reference/ai-sdk-core/generate-image.html).

```ts
import { fireworks } from '@ai-sdk/fireworks';
import { experimental_generateImage as generateImage } from 'ai';


const { image } = await generateImage({
  model: fireworks.image('accounts/fireworks/models/flux-1-dev-fp8'),
  prompt: 'A futuristic cityscape at sunset',
  aspectRatio: '16:9',
});
```

Model support for `size` and `aspectRatio` parameters varies. See the [Model Capabilities](#model-capabilities-1) section below for supported dimensions, or check the model's documentation on [Fireworks models page](https://fireworks.ai/models) for more details.

### [Model Capabilities](#model-capabilities-2)

For all models supporting aspect ratios, the following aspect ratios are supported:

`1:1 (default), 2:3, 3:2, 4:5, 5:4, 16:9, 9:16, 9:21, 21:9`

For all models supporting size, the following sizes are supported:

`640 x 1536, 768 x 1344, 832 x 1216, 896 x 1152, 1024x1024 (default), 1152 x 896, 1216 x 832, 1344 x 768, 1536 x 640`

| Model | Dimensions Specification |
| --- | --- |
| `accounts/fireworks/models/flux-1-dev-fp8` | Aspect Ratio |
| `accounts/fireworks/models/flux-1-schnell-fp8` | Aspect Ratio |
| `accounts/fireworks/models/playground-v2-5-1024px-aesthetic` | Size |
| `accounts/fireworks/models/japanese-stable-diffusion-xl` | Size |
| `accounts/fireworks/models/playground-v2-1024px-aesthetic` | Size |
| `accounts/fireworks/models/SSD-1B` | Size |
| `accounts/fireworks/models/stable-diffusion-xl-1024-v1-0` | Size |

For more details, see the [Fireworks models page](https://fireworks.ai/models).

#### [Stability AI Models](#stability-ai-models)

Fireworks also presents several Stability AI models backed by Stability AI API keys and endpoint. The AI SDK Fireworks provider does not currently include support for these models:

| Model ID |
| --- |
| `accounts/stability/models/sd3-turbo` |
| `accounts/stability/models/sd3-medium` |
| `accounts/stability/models/sd3` |

[Previous

Cohere

](cohere.html)

[Next

DeepSeek

](deepseek.html)

On this page

[Fireworks Provider](#fireworks-provider)

[Setup](#setup)

[Provider Instance](#provider-instance)

[Language Models](#language-models)

[Reasoning Models](#reasoning-models)

[Example](#example)

[Completion Models](#completion-models)

[Model Capabilities](#model-capabilities)

[Embedding Models](#embedding-models)

[Model Capabilities](#model-capabilities-1)

[Image Models](#image-models)

[Model Capabilities](#model-capabilities-2)

[Stability AI Models](#stability-ai-models)

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