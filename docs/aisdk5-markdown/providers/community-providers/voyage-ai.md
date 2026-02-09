Community Providers: Voyage AI

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

[Community Providers](../community-providers.html)Voyage AI

# [Voyage AI Provider](#voyage-ai-provider)

[patelvivekdev/voyage-ai-provider](https://github.com/patelvivekdev/voyageai-ai-provider) is a community provider that uses [Voyage AI](https://www.voyageai.com) to provide Embedding support for the AI SDK.

## [Setup](#setup)

The Voyage provider is available in the `voyage-ai-provider` module. You can install it with

pnpm

npm

yarn

bun

pnpm add voyage-ai-provider

## [Provider Instance](#provider-instance)

You can import the default provider instance `voyage` from `voyage-ai-provider`:

```ts
import { voyage } from 'voyage-ai-provider';
```

If you need a customized setup, you can import `createVoyage` from `voyage-ai-provider` and create a provider instance with your settings:

```ts
import { createVoyage } from 'voyage-ai-provider';


const voyage = createVoyage({
  // custom settings
});
```

You can use the following optional settings to customize the Voyage provider instance:

-   **baseURL** *string*
    
    The base URL of the Voyage API. The default prefix is `https://api.voyageai.com/v1`.
    
-   **apiKey** *string*
    
    API key that is being sent using the `Authorization` header. It defaults to the `VOYAGE_API_KEY` environment variable.
    
-   **headers** *Record<string,string>*
    
    Custom headers to include in the requests.
    
-   **fetch** *(input: RequestInfo, init?: RequestInit) => Promise<Response>*
    
    Custom [fetch](https://developer.mozilla.org/en-US/docs/Web/API/fetch) implementation. Defaults to the global `fetch` function. You can use it as a middleware to intercept requests, or to provide a custom fetch implementation for e.g. testing.
    

## [Text Embedding Models](#text-embedding-models)

You can create models that call the [Voyage embeddings API](https://docs.voyageai.com/reference/embeddings-api) using the `.textEmbeddingModel()` factory method.

```ts
import { voyage } from 'voyage-ai-provider';


const embeddingModel = voyage.textEmbeddingModel('voyage-3.5-lite');
```

You can use Voyage embedding models to generate embeddings with the `embed` or `embedMany` function:

```ts
import { voyage } from 'voyage-ai-provider';
import { embed } from 'ai';


const { embedding } = await embed({
  model: voyage.textEmbeddingModel('voyage-3.5-lite'),
  value: 'sunny day at the beach',
  providerOptions: {
    voyage: {
      inputType: 'document',
    },
  },
});
```

Voyage embedding models support additional provider options that can be passed via `providerOptions.voyage`:

```ts
import { voyage } from 'voyage-ai-provider';
import { embed } from 'ai';


const { embedding } = await embed({
  model: voyage.textEmbeddingModel('voyage-3.5-lite'),
  value: 'sunny day at the beach',
  providerOptions: {
    voyage: {
      inputType: 'query',
      outputDimension: 512,
    },
  },
});
```

The following [provider options](https://docs.voyageai.com/reference/embeddings-api) are available:

-   **inputType** *'query' | 'document' | 'null'*
    
    Specifies the type of input passed to the model. Defaults to `'null'`.
    
    -   `'null'`: When `inputType` is `'null'`, the embedding model directly converts the inputs into numerical vectors.
    
    For retrieval/search purposes it is recommended to use `'query'` or `'document'`.
    
    -   `'query'`: The input is a search query, e.g., "Represent the query for retrieving supporting documents: ...".
    -   `'document'`: The input is a document to be stored in a vector database, e.g., "Represent the document for retrieval: ...".
-   **outputDimension** *number*
    
    The number of dimensions for the resulting output embeddings. Default is `'null'`.
    
    -   For example, `voyage-code-3` and `voyage-3-large` support: 2048, 1024 (default), 512, and 256.
    -   Refer to the [model documentation](https://docs.voyageai.com/docs/embeddings) for supported values.
-   **outputDtype** *'float' | 'int8' | 'uint8' | 'binary' | 'ubinary'*
    
    The data type for the output embeddings. Defaults to `'float'`.
    
    -   `'float'`: 32-bit floating-point numbers (supported by all models).
    -   `'int8'`, `'uint8'`: 8-bit integer types (supported by `voyage-3-large`, `voyage-3.5`, `voyage-3.5-lite`, and `voyage-code-3`).
    -   `'binary'`, `'ubinary'`: Bit-packed, quantized single-bit embedding values (`voyage-3-large`, `voyage-3.5`, `voyage-3.5-lite`, and `voyage-code-3`). The returned list length is 1/8 of `outputDimension`. `'binary'` uses offset binary encoding.
    
    See [FAQ: Output Data Types](https://docs.voyageai.com/docs/faq#what-is-quantization-and-output-data-types) for more details.
    
-   **truncation** *boolean*
    
    Whether to truncate the input texts to fit within the model's context length. If not specified, defaults to true.
    

You can find more models on the [Voyage Library](https://docs.voyageai.com/docs/embeddings) homepage.

### [Model Capabilities](#model-capabilities)

| Model | Default Dimensions | Context Length |
| --- | --- | --- |
| `voyage-3.5` | 1024 (default), 256, 512, 2048 | 32,000 |
| `voyage-3.5-lite` | 1024 (default), 256, 512, 2048 | 32,000 |
| `voyage-3-large` | 1024 (default), 256, 512, 2048 | 32,000 |
| `voyage-3` | 1024 | 32,000 |
| `voyage-code-3` | 1024 (default), 256, 512, 2048 | 32,000 |
| `voyage-3-lite` | 512 | 32,000 |
| `voyage-finance-2` | 1024 | 32,000 |
| `voyage-multilingual-2` | 1024 | 32,000 |
| `voyage-law-2` | 1024 | 32,000 |
| `voyage-code-2` | 1024 | 16,000 |

The table above lists popular models. Please see the [Voyage docs](https://docs.voyageai.com/docs/embeddings) for a full list of available models.

## [Image Embedding](#image-embedding)

### [Example 1: Embed an image as a single embedding](#example-1-embed-an-image-as-a-single-embedding)

```ts
import { voyage, ImageEmbeddingInput } from 'voyage-ai-provider';
import { embedMany } from 'ai';


const imageModel = voyage.imageEmbeddingModel('voyage-multimodal-3');


const { embeddings } = await embedMany<ImageEmbeddingInput>({
  model: imageModel,
  values: [
    {
      image:
        'https://raw.githubusercontent.com/voyage-ai/voyage-multimodal-3/refs/heads/main/images/banana_200_x_200.jpg',
    },
    {
      image: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAA...',
    },
  ],
  // or you can pass the array of images url and base64 string directly
  // values: [
  //   'https://raw.githubusercontent.com/voyage-ai/voyage-multimodal-3/refs/heads/main/images/banana_200_x_200.jpg',
  //   'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAA...',
  // ],
});
```

### [Example 2: Embed multiple images as single embedding](#example-2-embed-multiple-images-as-single-embedding)

```ts
import { voyage, ImageEmbeddingInput } from 'voyage-ai-provider';
import { embedMany } from 'ai';


const imageModel = voyage.imageEmbeddingModel('voyage-multimodal-3');


const { embeddings } = await embedMany<ImageEmbeddingInput>({
  model: imageModel,
  values: [
    {
      image: [
        'https://raw.githubusercontent.com/voyage-ai/voyage-multimodal-3/refs/heads/main/images/banana_200_x_200.jpg',
        'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAA...',
      ],
    },
  ],
});
```

If you get an image URL not found error, convert the image to base64 and pass the base64 data URL in the image array. The value should be a Base64-encoded image in the data URL format `data:[mediatype];base64,<data>`. Supported media types: `image/png`, `image/jpeg`, `image/webp`, and `image/gif`.

## [Multimodal Embedding](#multimodal-embedding)

### [Example 1: Embed multiple texts and images as single embedding](#example-1-embed-multiple-texts-and-images-as-single-embedding)

```ts
import { voyage, MultimodalEmbeddingInput } from 'voyage-ai-provider';
import { embedMany } from 'ai';


const multimodalModel = voyage.multimodalEmbeddingModel('voyage-multimodal-3');


const { embeddings } = await embedMany<MultimodalEmbeddingInput>({
  model: multimodalModel,
  values: [
    {
      text: ['Hello, world!', 'This is a banana'],
      image: [
        'https://raw.githubusercontent.com/voyage-ai/voyage-multimodal-3/refs/heads/main/images/banana_200_x_200.jpg',
      ],
    },
    {
      text: ['Hello, coders!', 'This is a coding test'],
      image: ['data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAA...'],
    },
  ],
});
```

The following constraints apply to the `values` list:

-   The list must not contain more than 1,000 values.
-   Each image must not contain more than 16 million pixels or be larger than 20 MB in size.
-   With every 560 pixels of an image being counted as a token, each input in the list must not exceed 32,000 tokens, and the total number of tokens across all inputs must not exceed 320,000.

Voyage multimodal embedding models support additional provider options that can be passed via `providerOptions.voyage`:

```ts
import { voyage, MultimodalEmbeddingInput } from 'voyage-ai-provider';
import { embedMany } from 'ai';


const multimodalModel = voyage.multimodalEmbeddingModel('voyage-multimodal-3');


const { embeddings } = await embedMany<MultimodalEmbeddingInput>({
  model: multimodalModel,
  values: [
    {
      text: ['Hello, world!'],
      image: ['data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAA...'],
    },
  ],
  providerOptions: {
    voyage: {
      inputType: 'query',
      outputEncoding: 'base64',
      truncation: true,
    },
  },
});
```

The following provider options are available:

-   **inputType** *'query' | 'document'*
    
    Specifies the type of input passed to the model. Defaults to `'query'`.
    
    When `inputType` is specified as `'query'` or `'document'`, Voyage automatically prepends a prompt to your inputs before vectorizing them, creating vectors tailored for retrieval/search tasks:
    
    -   `'query'`: Prepends "Represent the query for retrieving supporting documents: "
    -   `'document'`: Prepends "Represent the document for retrieval: "
-   **outputEncoding** *'base64'*
    
    The data encoding for the resulting output embeddings. Defaults to `null` (list of 32-bit floats).
    
    -   If `null`, embeddings are returned as a list of floating-point numbers (float32).
    -   If `'base64'`, embeddings are returned as a Base64-encoded NumPy array of single-precision floats.
    
    See [FAQ: Output Data Types](https://docs.voyageai.com/docs/faq#what-is-quantization-and-output-data-types) for more details.
    
-   **truncation** *boolean*
    
    Whether to truncate the inputs to fit within the model's context length. If not specified, defaults to `true`.
    

### [Model Capabilities](#model-capabilities-1)

| Model | Context Length (tokens) | Embedding Dimension |
| --- | --- | --- |
| `voyage-multimodal-3` | 32,000 | 1024 |

[Previous

Mixedbread

](mixedbread.html)

[Next

Jina AI

](jina-ai.html)

On this page

[Voyage AI Provider](#voyage-ai-provider)

[Setup](#setup)

[Provider Instance](#provider-instance)

[Text Embedding Models](#text-embedding-models)

[Model Capabilities](#model-capabilities)

[Image Embedding](#image-embedding)

[Example 1: Embed an image as a single embedding](#example-1-embed-an-image-as-a-single-embedding)

[Example 2: Embed multiple images as single embedding](#example-2-embed-multiple-images-as-single-embedding)

[Multimodal Embedding](#multimodal-embedding)

[Example 1: Embed multiple texts and images as single embedding](#example-1-embed-multiple-texts-and-images-as-single-embedding)

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