AI SDK Providers: Baseten

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

[AI SDK Providers](../ai-sdk-providers.html)Baseten

# [Baseten Provider](#baseten-provider)

[Baseten](https://baseten.co/) is an inference platform for serving frontier, enterprise-grade opensource AI models via their [API](https://docs.baseten.co/overview).

## [Setup](#setup)

The Baseten provider is available via the `@ai-sdk/baseten` module. You can install it with

pnpm

npm

yarn

pnpm add @ai-sdk/baseten

## [Provider Instance](#provider-instance)

You can import the default provider instance `baseten` from `@ai-sdk/baseten`:

```ts
import { baseten } from '@ai-sdk/baseten';
```

If you need a customized setup, you can import `createBaseten` from `@ai-sdk/baseten` and create a provider instance with your settings:

```ts
import { createBaseten } from '@ai-sdk/baseten';


const baseten = createBaseten({
  apiKey: process.env.BASETEN_API_KEY ?? '',
});
```

You can use the following optional settings to customize the Baseten provider instance:

-   **baseURL** *string*
    
    Use a different URL prefix for API calls, e.g. to use proxy servers. The default prefix is `https://inference.baseten.co/v1`.
    
-   **apiKey** *string*
    
    API key that is being sent using the `Authorization` header. It defaults to the `BASETEN_API_KEY` environment variable. It is recommended you set the environment variable using `export` so you do not need to include the field everytime. You can grab your Baseten API Key [here](https://app.baseten.co/settings/api_keys)
    
-   **modelURL** *string*
    
    Custom model URL for specific models (chat or embeddings). If not provided, the default Model APIs will be used.
    
-   **headers** *Record<string,string>*
    
    Custom headers to include in the requests.
    
-   **fetch** *(input: RequestInfo, init?: RequestInit) => Promise<Response>*
    
    Custom [fetch](https://developer.mozilla.org/en-US/docs/Web/API/fetch) implementation.
    

## [Model APIs](#model-apis)

You can select [Baseten models](https://www.baseten.co/products/model-apis/) using a provider instance. The first argument is the model id, e.g. `'moonshotai/Kimi-K2-Instruct-0905'`: The complete supported models under Model APIs can be found [here](https://docs.baseten.co/development/model-apis/overview#supported-models).

```ts
const model = baseten('moonshotai/Kimi-K2-Instruct-0905');
```

### [Example](#example)

You can use Baseten language models to generate text with the `generateText` function:

```ts
import { baseten } from '@ai-sdk/baseten';
import { generateText } from 'ai';


const { text } = await generateText({
  model: baseten('moonshotai/Kimi-K2-Instruct-0905'),
  prompt: 'What is the meaning of life? Answer in one sentence.',
});
```

Baseten language models can also be used in the `streamText` function (see [AI SDK Core](../../docs/ai-sdk-core.html)).

## [Dedicated Models](#dedicated-models)

Baseten supports dedicated model URLs for both chat and embedding models. You have to specify a `modelURL` when creating the provider:

### [OpenAI-Compatible Endpoints (`/sync/v1`)](#openai-compatible-endpoints-syncv1)

For models deployed with Baseten's OpenAI-compatible endpoints:

```ts
import { createBaseten } from '@ai-sdk/baseten';


const baseten = createBaseten({
  modelURL: 'https://model-{MODEL_ID}.api.baseten.co/sync/v1',
});
// No modelId is needed because we specified modelURL
const model = baseten();
const { text } = await generateText({
  model: model,
  prompt: 'Say hello from a Baseten chat model!',
});
```

### [`/predict` Endpoints](#predict-endpoints)

`/predict` endpoints are currently NOT supported for chat models. You must use `/sync/v1` endpoints for chat functionality.

## [Embedding Models](#embedding-models)

You can create models that call the Baseten embeddings API using the `.textEmbeddingModel()` factory method. The Baseten provider uses the high-performance `@basetenlabs/performance-client` for optimal embedding performance.

**Important:** Embedding models require a dedicated deployment with a custom `modelURL`. Unlike chat models, embeddings cannot use Baseten's default Model APIs and must specify a dedicated model endpoint.

```ts
import { createBaseten } from '@ai-sdk/baseten';
import { embed, embedMany } from 'ai';


const baseten = createBaseten({
  modelURL: 'https://model-{MODEL_ID}.api.baseten.co/sync',
});


const embeddingModel = baseten.textEmbeddingModel();


// Single embedding
const { embedding } = await embed({
  model: embeddingModel,
  value: 'sunny day at the beach',
});


// Batch embeddings
const { embeddings } = await embedMany({
  model: embeddingModel,
  values: [
    'sunny day at the beach',
    'rainy afternoon in the city',
    'snowy mountain peak',
  ],
});
```

### [Endpoint Support for Embeddings](#endpoint-support-for-embeddings)

**Supported:**

-   `/sync` endpoints (Performance Client automatically adds `/v1/embeddings`)
-   `/sync/v1` endpoints (automatically strips `/v1` before passing to Performance Client)

**Not Supported:**

-   `/predict` endpoints (not compatible with Performance Client)

### [Performance Features](#performance-features)

The embedding implementation includes:

-   **High-performance client**: Uses `@basetenlabs/performance-client` for optimal performance
-   **Automatic batching**: Efficiently handles multiple texts in a single request
-   **Connection reuse**: Performance Client is created once and reused for all requests
-   **Built-in retries**: Automatic retry logic for failed requests

## [Error Handling](#error-handling)

The Baseten provider includes built-in error handling for common API errors:

```ts
import { baseten } from '@ai-sdk/baseten';
import { generateText } from 'ai';


try {
  const { text } = await generateText({
    model: baseten('moonshotai/Kimi-K2-Instruct-0905'),
    prompt: 'Hello, world!',
  });
} catch (error) {
  console.error('Baseten API error:', error.message);
}
```

### [Common Error Scenarios](#common-error-scenarios)

```ts
// Embeddings require a modelURL
try {
  baseten.textEmbeddingModel();
} catch (error) {
  // Error: "No model URL provided for embeddings. Please set modelURL option for embeddings."
}


// /predict endpoints are not supported for chat models
try {
  const baseten = createBaseten({
    modelURL:
      'https://model-{MODEL_ID}.api.baseten.co/environments/production/predict',
  });
  baseten(); // This will throw an error
} catch (error) {
  // Error: "Not supported. You must use a /sync/v1 endpoint for chat models."
}


// /sync/v1 endpoints are now supported for embeddings
const baseten = createBaseten({
  modelURL:
    'https://model-{MODEL_ID}.api.baseten.co/environments/production/sync/v1',
});
const embeddingModel = baseten.textEmbeddingModel(); // This works fine!


// /predict endpoints are not supported for embeddings
try {
  const baseten = createBaseten({
    modelURL:
      'https://model-{MODEL_ID}.api.baseten.co/environments/production/predict',
  });
  baseten.textEmbeddingModel(); // This will throw an error
} catch (error) {
  // Error: "Not supported. You must use a /sync or /sync/v1 endpoint for embeddings."
}


// Image models are not supported
try {
  baseten.imageModel('test-model');
} catch (error) {
  // Error: NoSuchModelError for imageModel
}
```

For more information about Baseten models and deployment options, see the [Baseten documentation](https://docs.baseten.co/).

[Previous

Rev.ai

](revai.html)

[Next

Hugging Face

](huggingface.html)

On this page

[Baseten Provider](#baseten-provider)

[Setup](#setup)

[Provider Instance](#provider-instance)

[Model APIs](#model-apis)

[Example](#example)

[Dedicated Models](#dedicated-models)

[OpenAI-Compatible Endpoints (/sync/v1)](#openai-compatible-endpoints-syncv1)

[/predict Endpoints](#predict-endpoints)

[Embedding Models](#embedding-models)

[Endpoint Support for Embeddings](#endpoint-support-for-embeddings)

[Performance Features](#performance-features)

[Error Handling](#error-handling)

[Common Error Scenarios](#common-error-scenarios)

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