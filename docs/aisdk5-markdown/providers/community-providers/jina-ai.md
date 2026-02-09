Community Providers: Jina AI

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

[Community Providers](../community-providers.html)Jina AI

# [Jina AI Provider](#jina-ai-provider)

[patelvivekdev/jina-ai-provider](https://github.com/patelvivekdev/jina-ai-provider) is a community provider that uses [Jina AI](https://jina.ai) to provide text and multimodal embedding support for the AI SDK.

## [Setup](#setup)

The Jina provider is available in the `jina-ai-provider` module. You can install it with

pnpm

npm

yarn

bun

pnpm add jina-ai-provider

## [Provider Instance](#provider-instance)

You can import the default provider instance `jina` from `jina-ai-provider`:

```ts
import { jina } from 'jina-ai-provider';
```

If you need a customized setup, you can import `createJina` from `jina-ai-provider` and create a provider instance with your settings:

```ts
import { createJina } from 'jina-ai-provider';


const customJina = createJina({
  // custom settings
});
```

You can use the following optional settings to customize the Jina provider instance:

-   **baseURL** *string*
    
    The base URL of the Jina API. The default prefix is `https://api.jina.ai/v1`.
    
-   **apiKey** *string*
    
    API key that is being sent using the `Authorization` header. It defaults to the `JINA_API_KEY` environment variable.
    
-   **headers** *Record<string,string>*
    
    Custom headers to include in the requests.
    
-   **fetch** *(input: RequestInfo, init?: RequestInit) => Promise<Response>*
    
    Custom [fetch](https://developer.mozilla.org/en-US/docs/Web/API/fetch) implementation. Defaults to the global `fetch` function. You can use it as a middleware to intercept requests, or to provide a custom fetch implementation for e.g. testing.
    

## [Text Embedding Models](#text-embedding-models)

You can create models that call the Jina text embeddings API using the `.textEmbeddingModel()` factory method.

```ts
import { jina } from 'jina-ai-provider';


const textEmbeddingModel = jina.textEmbeddingModel('jina-embeddings-v3');
```

You can use Jina embedding models to generate embeddings with the `embed` or `embedMany` function:

```ts
import { jina } from 'jina-ai-provider';
import { embedMany } from 'ai';


const textEmbeddingModel = jina.textEmbeddingModel('jina-embeddings-v3');


export const generateEmbeddings = async (
  value: string,
): Promise<Array<{ embedding: number[]; content: string }>> => {
  const chunks = value.split('\n');


  const { embeddings } = await embedMany({
    model: textEmbeddingModel,
    values: chunks,
    providerOptions: {
      jina: {
        inputType: 'retrieval.passage',
      },
    },
  });


  return embeddings.map((embedding, index) => ({
    content: chunks[index]!,
    embedding,
  }));
};
```

## [Multimodal Embedding](#multimodal-embedding)

You can create models that call the Jina multimodal (text + image) embeddings API using the `.multiModalEmbeddingModel()` factory method.

```ts
import { jina, type MultimodalEmbeddingInput } from 'jina-ai-provider';
import { embedMany } from 'ai';


const multimodalModel = jina.multiModalEmbeddingModel('jina-clip-v2');


export const generateMultimodalEmbeddings = async () => {
  const values: MultimodalEmbeddingInput[] = [
    { text: 'A beautiful sunset over the beach' },
    { image: 'https://i.ibb.co/r5w8hG8/beach2.jpg' },
  ];


  const { embeddings } = await embedMany<MultimodalEmbeddingInput>({
    model: multimodalModel,
    values,
  });


  return embeddings.map((embedding, index) => ({
    content: values[index]!,
    embedding,
  }));
};
```

Use the `MultimodalEmbeddingInput` type to ensure type safety when using multimodal embeddings. You can pass Base64 encoded images to the `image` property in the Data URL format `data:[mediatype];base64,<data>`.

## [Provider Options](#provider-options)

Pass Jina embedding options via `providerOptions.jina`. The following options are supported:

-   **inputType** *'text-matching' | 'retrieval.query' | 'retrieval.passage' | 'separation' | 'classification'*
    
    Intended downstream application to help the model produce better embeddings. Defaults to `'retrieval.passage'`.
    
    -   `'retrieval.query'`: input is a search query.
    -   `'retrieval.passage'`: input is a document/passage.
    -   `'text-matching'`: for semantic textual similarity tasks.
    -   `'classification'`: for classification tasks.
    -   `'separation'`: for clustering tasks.
-   **outputDimension** *number*
    
    Number of dimensions for the output embeddings. See model documentation for valid ranges.
    
    -   `jina-embeddings-v3`: min 32, max 1024.
    -   `jina-clip-v2`: min 64, max 1024.
    -   `jina-clip-v1`: fixed 768.
-   **embeddingType** *'float' | 'binary' | 'ubinary' | 'base64'*
    
    Data type for the returned embeddings.
    
-   **normalized** *boolean*
    
    Whether to L2-normalize embeddings. Defaults to `true`.
    
-   **truncate** *boolean*
    
    Whether to truncate inputs beyond the model context limit instead of erroring. Defaults to `false`.
    
-   **lateChunking** *boolean*
    
    Split long inputs into 1024-token chunks automatically. Only for text embedding models.
    

## [Model Capabilities](#model-capabilities)

| Model | Context Length (tokens) | Embedding Dimension | Modalities |
| --- | --- | --- | --- |
| `jina-embeddings-v3` | 8,192 | 1024 | Text |
| `jina-clip-v2` | 8,192 | 1024 | Text + Images |
| `jina-clip-v1` | 8,192 | 768 | Text + Images |

## [Supported Input Formats](#supported-input-formats)

### [Text Embeddings](#text-embeddings)

-   Array of strings, for example: `const strings = ['text1', 'text2']`

### [Multimodal Embeddings](#multimodal-embeddings)

-   Text objects: `const text = [{ text: 'Your text here' }]`
-   Image objects: `const image = [{ image: 'https://example.com/image.jpg' }]` or Base64 data URLs
-   Mixed arrays: `const mixed = [{ text: 'object text' }, { image: 'image-url' }, { image: 'data:image/jpeg;base64,...' }]`

[Previous

Voyage AI

](voyage-ai.html)

[Next

Mem0

](mem0.html)

On this page

[Jina AI Provider](#jina-ai-provider)

[Setup](#setup)

[Provider Instance](#provider-instance)

[Text Embedding Models](#text-embedding-models)

[Multimodal Embedding](#multimodal-embedding)

[Provider Options](#provider-options)

[Model Capabilities](#model-capabilities)

[Supported Input Formats](#supported-input-formats)

[Text Embeddings](#text-embeddings)

[Multimodal Embeddings](#multimodal-embeddings)

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