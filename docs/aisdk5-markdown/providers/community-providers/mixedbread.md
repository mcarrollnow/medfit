Community Providers: Mixedbread

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

[Community Providers](../community-providers.html)Mixedbread

# [Mixedbread Provider](#mixedbread-provider)

[patelvivekdev/mixedbread-ai-provider](https://github.com/patelvivekdev/mixedbread-ai-provider) is a community provider that uses [Mixedbread](https://www.mixedbread.ai/) to provide Embedding support for the AI SDK.

## [Setup](#setup)

The Mixedbread provider is available in the `mixedbread-ai-provider` module. You can install it with

pnpm

npm

yarn

bun

pnpm add mixedbread-ai-provider

## [Provider Instance](#provider-instance)

You can import the default provider instance `mixedbread` from `mixedbread-ai-provider`:

```ts
import { mixedbread } from 'mixedbread-ai-provider';
```

If you need a customized setup, you can import `createMixedbread` from `mixedbread-ai-provider` and create a provider instance with your settings:

```ts
import { createMixedbread } from 'mixedbread-ai-provider';


const mixedbread = createMixedbread({
  // custom settings
});
```

You can use the following optional settings to customize the Mixedbread provider instance:

-   **baseURL** *string*
    
    The base URL of the Mixedbread API. The default prefix is `https://api.mixedbread.com/v1`.
    
-   **apiKey** *string*
    
    API key that is being sent using the `Authorization` header. It defaults to the `MIXEDBREAD_API_KEY` environment variable.
    
-   **headers** *Record<string,string>*
    
    Custom headers to include in the requests.
    
-   **fetch** *(input: RequestInfo, init?: RequestInit) => Promise<Response>*
    
    Custom [fetch](https://developer.mozilla.org/en-US/docs/Web/API/fetch) implementation. Defaults to the global `fetch` function. You can use it as a middleware to intercept requests, or to provide a custom fetch implementation for e.g. testing.
    

## [Text Embedding Models](#text-embedding-models)

You can create models that call the [Mixedbread embeddings API](https://www.mixedbread.com/api-reference/endpoints/embeddings) using the `.textEmbeddingModel()` factory method.

```ts
import { mixedbread } from 'mixedbread-ai-provider';


const embeddingModel = mixedbread.textEmbeddingModel(
  'mixedbread-ai/mxbai-embed-large-v1',
);
```

You can use Mixedbread embedding models to generate embeddings with the `embed` function:

```ts
import { mixedbread } from 'mixedbread-ai-provider';
import { embed } from 'ai';


const { embedding } = await embed({
  model: mixedbread.textEmbeddingModel('mixedbread-ai/mxbai-embed-large-v1'),
  value: 'sunny day at the beach',
});
```

Mixedbread embedding models support additional provider options that can be passed via `providerOptions.mixedbread`:

```ts
import { mixedbread } from 'mixedbread-ai-provider';
import { embed } from 'ai';


const { embedding } = await embed({
  model: mixedbread.textEmbeddingModel('mixedbread-ai/mxbai-embed-large-v1'),
  value: 'sunny day at the beach',
  providerOptions: {
    mixedbread: {
      prompt: 'Generate embeddings for text',
      normalized: true,
      dimensions: 512,
      encodingFormat: 'float16',
    },
  },
});
```

The following provider options are available:

-   **prompt** *string*
    
    An optional prompt to provide context to the model. Refer to the model's documentation for more information. A string between 1 and 256 characters.
    
-   **normalized** *boolean*
    
    Option to normalize the embeddings.
    
-   **dimensions** *number*
    
    The desired number of dimensions in the output vectors. Defaults to the model's maximum. A number between 1 and the model's maximum output dimensions. Only applicable for Matryoshka-based models.
    
-   **encodingFormat** *'float' | 'float16' | 'binary' | 'ubinary' | 'int8' | 'uint8' | 'base64'*
    

### [Model Capabilities](#model-capabilities)

| Model | Context Length | Dimension | Custom Dimensions |
| --- | --- | --- | --- |
| `mxbai-embed-large-v1` | 512 | 1024 |  |
| `mxbai-embed-2d-large-v1` | 512 | 1024 |  |
| `deepset-mxbai-embed-de-large-v1` | 512 | 1024 |  |
| `mxbai-embed-xsmall-v1` | 4096 | 384 |  |

The table above lists popular models. Please see the [Mixedbread docs](https://www.mixedbread.com/docs/models/embedding) for a full list of available models.

[Previous

Requesty

](requesty.html)

[Next

Voyage AI

](voyage-ai.html)

On this page

[Mixedbread Provider](#mixedbread-provider)

[Setup](#setup)

[Provider Instance](#provider-instance)

[Text Embedding Models](#text-embedding-models)

[Model Capabilities](#model-capabilities)

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