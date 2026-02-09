OpenAI Compatible Providers

[](https://vercel.com/)

[

AI SDK



](../index.html)

-   [Docs](../docs/introduction.html)
-   [Cookbook](../cookbook.html)
-   [Providers](ai-sdk-providers.html)
-   [Playground](../playground.html)
-   [
    
    AI ElementsAI Elements
    
    ](../elements/overview.html)
-   [AI GatewayGateway](https://vercel.com/ai-gateway)

AI SDK 5 is available now.

[View Announcement](https://vercel.com/blog/ai-sdk-5)

Menu

[AI SDK Providers](ai-sdk-providers.html)

[AI Gateway](ai-sdk-providers/ai-gateway.html)

[xAI Grok](ai-sdk-providers/xai.html)

[Vercel](ai-sdk-providers/vercel.html)

[OpenAI](ai-sdk-providers/openai.html)

[Azure OpenAI](ai-sdk-providers/azure.html)

[Anthropic](ai-sdk-providers/anthropic.html)

[Amazon Bedrock](ai-sdk-providers/amazon-bedrock.html)

[Groq](ai-sdk-providers/groq.html)

[Fal](ai-sdk-providers/fal.html)

[DeepInfra](ai-sdk-providers/deepinfra.html)

[Google Generative AI](ai-sdk-providers/google-generative-ai.html)

[Google Vertex AI](ai-sdk-providers/google-vertex.html)

[Mistral AI](ai-sdk-providers/mistral.html)

[Together.ai](ai-sdk-providers/togetherai.html)

[Cohere](ai-sdk-providers/cohere.html)

[Fireworks](ai-sdk-providers/fireworks.html)

[DeepSeek](ai-sdk-providers/deepseek.html)

[Cerebras](ai-sdk-providers/cerebras.html)

[Replicate](ai-sdk-providers/replicate.html)

[Perplexity](ai-sdk-providers/perplexity.html)

[Luma](ai-sdk-providers/luma.html)

[ElevenLabs](ai-sdk-providers/elevenlabs.html)

[AssemblyAI](ai-sdk-providers/assemblyai.html)

[Deepgram](ai-sdk-providers/deepgram.html)

[Gladia](ai-sdk-providers/gladia.html)

[LMNT](ai-sdk-providers/lmnt.html)

[Hume](ai-sdk-providers/hume.html)

[Rev.ai](ai-sdk-providers/revai.html)

[Baseten](ai-sdk-providers/baseten.html)

[Hugging Face](ai-sdk-providers/huggingface.html)

[OpenAI Compatible Providers](openai-compatible-providers.html)

[Writing a Custom Provider](openai-compatible-providers/custom-providers.html)

[LM Studio](openai-compatible-providers/lmstudio.html)

[NVIDIA NIM](openai-compatible-providers/nim.html)

[Heroku](openai-compatible-providers/heroku.html)

[Community Providers](community-providers.html)

[Writing a Custom Provider](community-providers/custom-providers.html)

[Qwen](community-providers/qwen.html)

[Ollama](community-providers/ollama.html)

[A2A](community-providers/a2a.html)

[Requesty](community-providers/requesty.html)

[FriendliAI](community-providers/friendliai.html)

[Portkey](community-providers/portkey.html)

[Cloudflare Workers AI](community-providers/cloudflare-workers-ai.html)

[Cloudflare AI Gateway](community-providers/cloudflare-ai-gateway.html)

[OpenRouter](community-providers/openrouter.html)

[Azure AI](community-providers/azure-ai.html)

[Aihubmix](community-providers/aihubmix.html)

[SAP AI Core](community-providers/sap-ai.html)

[Crosshatch](community-providers/crosshatch.html)

[Mixedbread](community-providers/mixedbread.html)

[Voyage AI](community-providers/voyage-ai.html)

[Jina AI](community-providers/jina-ai.html)

[Mem0](community-providers/mem0.html)

[Letta](community-providers/letta.html)

[Supermemory](community-providers/supermemory.html)

[React Native Apple](community-providers/react-native-apple.html)

[Anthropic Vertex](community-providers/anthropic-vertex-ai.html)

[Spark](community-providers/spark.html)

[Inflection AI](community-providers/inflection-ai.html)

[LangDB](community-providers/langdb.html)

[Zhipu AI](community-providers/zhipu.html)

[SambaNova](community-providers/sambanova.html)

[Dify](community-providers/dify.html)

[Sarvam](community-providers/sarvam.html)

[AI/ML API](community-providers/aimlapi.html)

[Claude Code](community-providers/claude-code.html)

[Built-in AI](community-providers/built-in-ai.html)

[Gemini CLI](community-providers/gemini-cli.html)

[Automatic1111](community-providers/automatic1111.html)

[Adapters](adapters.html)

[LangChain](adapters/langchain.html)

[LlamaIndex](adapters/llamaindex.html)

[Observability Integrations](observability.html)

[Axiom](observability/axiom.html)

[Braintrust](observability/braintrust.html)

[Helicone](observability/helicone.html)

[Laminar](observability/laminar.html)

[Langfuse](observability/langfuse.html)

[LangSmith](observability/langsmith.html)

[LangWatch](observability/langwatch.html)

[Maxim](observability/maxim.html)

[Patronus](observability/patronus.html)

[Scorecard](observability/scorecard.html)

[SigNoz](observability/signoz.html)

[Traceloop](observability/traceloop.html)

[Weave](observability/weave.html)

OpenAI Compatible Providers

# [OpenAI Compatible Providers](#openai-compatible-providers)

You can use the [OpenAI Compatible Provider](https://www.npmjs.com/package/@ai-sdk/openai-compatible) package to use language model providers that implement the OpenAI API.

Below we focus on the general setup and provider instance creation. You can also [write a custom provider package leveraging the OpenAI Compatible package](openai-compatible-providers/custom-providers.html).

We provide detailed documentation for the following OpenAI compatible providers:

-   [LM Studio](openai-compatible-providers/lmstudio.html)
-   [NIM](openai-compatible-providers/nim.html)
-   [Heroku](openai-compatible-providers/heroku.html)

The general setup and provider instance creation is the same for all of these providers.

## [Setup](#setup)

The OpenAI Compatible provider is available via the `@ai-sdk/openai-compatible` module. You can install it with:

pnpm

npm

yarn

bun

pnpm add @ai-sdk/openai-compatible

## [Provider Instance](#provider-instance)

To use an OpenAI compatible provider, you can create a custom provider instance with the `createOpenAICompatible` function from `@ai-sdk/openai-compatible`:

```ts
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';


const provider = createOpenAICompatible({
  name: 'provider-name',
  apiKey: process.env.PROVIDER_API_KEY,
  baseURL: 'https://api.provider.com/v1',
  includeUsage: true, // Include usage information in streaming responses
});
```

You can use the following optional settings to customize the provider instance:

-   **baseURL** *string*
    
    Set the URL prefix for API calls.
    
-   **apiKey** *string*
    
    API key for authenticating requests. If specified, adds an `Authorization` header to request headers with the value `Bearer <apiKey>`. This will be added before any headers potentially specified in the `headers` option.
    
-   **headers** *Record<string,string>*
    
    Optional custom headers to include in requests. These will be added to request headers after any headers potentially added by use of the `apiKey` option.
    
-   **queryParams** *Record<string,string>*
    
    Optional custom url query parameters to include in request urls.
    
-   **fetch** *(input: RequestInfo, init?: RequestInit) => Promise<Response>*
    
    Custom [fetch](https://developer.mozilla.org/en-US/docs/Web/API/fetch) implementation. Defaults to the global `fetch` function. You can use it as a middleware to intercept requests, or to provide a custom fetch implementation for e.g. testing.
    
-   **includeUsage** *boolean*
    
    Include usage information in streaming responses. When enabled, usage data will be included in the response metadata for streaming requests. Defaults to `undefined` (`false`).
    
-   **supportsStructuredOutputs** *boolean*
    
    Set to true if the provider supports structured outputs. Only relevant for `provider()`, `provider.chatModel()`, and `provider.languageModel()`.
    

## [Language Models](#language-models)

You can create provider models using a provider instance. The first argument is the model id, e.g. `model-id`.

```ts
const model = provider('model-id');
```

### [Example](#example)

You can use provider language models to generate text with the `generateText` function:

```ts
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { generateText } from 'ai';


const provider = createOpenAICompatible({
  name: 'provider-name',
  apiKey: process.env.PROVIDER_API_KEY,
  baseURL: 'https://api.provider.com/v1',
});


const { text } = await generateText({
  model: provider('model-id'),
  prompt: 'Write a vegetarian lasagna recipe for 4 people.',
});
```

### [Including model ids for auto-completion](#including-model-ids-for-auto-completion)

```ts
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { generateText } from 'ai';


type ExampleChatModelIds =
  | 'meta-llama/Llama-3-70b-chat-hf'
  | 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo'
  | (string & {});


type ExampleCompletionModelIds =
  | 'codellama/CodeLlama-34b-Instruct-hf'
  | 'Qwen/Qwen2.5-Coder-32B-Instruct'
  | (string & {});


type ExampleEmbeddingModelIds =
  | 'BAAI/bge-large-en-v1.5'
  | 'bert-base-uncased'
  | (string & {});


const model = createOpenAICompatible<
  ExampleChatModelIds,
  ExampleCompletionModelIds,
  ExampleEmbeddingModelIds
>({
  name: 'example',
  apiKey: process.env.PROVIDER_API_KEY,
  baseURL: 'https://api.example.com/v1',
});


// Subsequent calls to e.g. `model.chatModel` will auto-complete the model id
// from the list of `ExampleChatModelIds` while still allowing free-form
// strings as well.


const { text } = await generateText({
  model: model.chatModel('meta-llama/Llama-3-70b-chat-hf'),
  prompt: 'Write a vegetarian lasagna recipe for 4 people.',
});
```

### [Custom query parameters](#custom-query-parameters)

Some providers may require custom query parameters. An example is the [Azure AI Model Inference API](https://learn.microsoft.com/en-us/azure/machine-learning/reference-model-inference-chat-completions?view=azureml-api-2) which requires an `api-version` query parameter.

You can set these via the optional `queryParams` provider setting. These will be added to all requests made by the provider.

```ts
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';


const provider = createOpenAICompatible({
  name: 'provider-name',
  apiKey: process.env.PROVIDER_API_KEY,
  baseURL: 'https://api.provider.com/v1',
  queryParams: {
    'api-version': '1.0.0',
  },
});
```

For example, with the above configuration, API requests would include the query parameter in the URL like: `https://api.provider.com/v1/chat/completions?api-version=1.0.0`.

## [Provider-specific options](#provider-specific-options)

The OpenAI Compatible provider supports adding provider-specific options to the request body. These are specified with the `providerOptions` field in the request body.

For example, if you create a provider instance with the name `provider-name`, you can add a `custom-option` field to the request body like this:

```ts
const provider = createOpenAICompatible({
  name: 'provider-name',
  apiKey: process.env.PROVIDER_API_KEY,
  baseURL: 'https://api.provider.com/v1',
});


const { text } = await generateText({
  model: provider('model-id'),
  prompt: 'Hello',
  providerOptions: {
    'provider-name': { customOption: 'magic-value' },
  },
});
```

The request body sent to the provider will include the `customOption` field with the value `magic-value`. This gives you an easy way to add provider-specific options to requests without having to modify the provider or AI SDK code.

## [Custom Metadata Extraction](#custom-metadata-extraction)

The OpenAI Compatible provider supports extracting provider-specific metadata from API responses through metadata extractors. These extractors allow you to capture additional information returned by the provider beyond the standard response format.

Metadata extractors receive the raw, unprocessed response data from the provider, giving you complete flexibility to extract any custom fields or experimental features that the provider may include. This is particularly useful when:

-   Working with providers that include non-standard response fields
-   Experimenting with beta or preview features
-   Capturing provider-specific metrics or debugging information
-   Supporting rapid provider API evolution without SDK changes

Metadata extractors work with both streaming and non-streaming chat completions and consist of two main components:

1.  A function to extract metadata from complete responses
2.  A streaming extractor that can accumulate metadata across chunks in a streaming response

Here's an example metadata extractor that captures both standard and custom provider data:

```typescript
const myMetadataExtractor: MetadataExtractor = {
  // Process complete, non-streaming responses
  extractMetadata: ({ parsedBody }) => {
    // You have access to the complete raw response
    // Extract any fields the provider includes
    return {
      myProvider: {
        standardUsage: parsedBody.usage,
        experimentalFeatures: parsedBody.beta_features,
        customMetrics: {
          processingTime: parsedBody.server_timing?.total_ms,
          modelVersion: parsedBody.model_version,
          // ... any other provider-specific data
        },
      },
    };
  },


  // Process streaming responses
  createStreamExtractor: () => {
    let accumulatedData = {
      timing: [],
      customFields: {},
    };


    return {
      // Process each chunk's raw data
      processChunk: parsedChunk => {
        if (parsedChunk.server_timing) {
          accumulatedData.timing.push(parsedChunk.server_timing);
        }
        if (parsedChunk.custom_data) {
          Object.assign(accumulatedData.customFields, parsedChunk.custom_data);
        }
      },
      // Build final metadata from accumulated data
      buildMetadata: () => ({
        myProvider: {
          streamTiming: accumulatedData.timing,
          customData: accumulatedData.customFields,
        },
      }),
    };
  },
};
```

You can provide a metadata extractor when creating your provider instance:

```typescript
const provider = createOpenAICompatible({
  name: 'my-provider',
  apiKey: process.env.PROVIDER_API_KEY,
  baseURL: 'https://api.provider.com/v1',
  metadataExtractor: myMetadataExtractor,
});
```

The extracted metadata will be included in the response under the `providerMetadata` field:

```typescript
const { text, providerMetadata } = await generateText({
  model: provider('model-id'),
  prompt: 'Hello',
});


console.log(providerMetadata.myProvider.customMetric);
```

This allows you to access provider-specific information while maintaining a consistent interface across different providers.

[Previous

ElevenLabs

](ai-sdk-providers/elevenlabs.html)

[Next

Writing a Custom Provider

](openai-compatible-providers/custom-providers.html)

On this page

[OpenAI Compatible Providers](#openai-compatible-providers)

[Setup](#setup)

[Provider Instance](#provider-instance)

[Language Models](#language-models)

[Example](#example)

[Including model ids for auto-completion](#including-model-ids-for-auto-completion)

[Custom query parameters](#custom-query-parameters)

[Provider-specific options](#provider-specific-options)

[Custom Metadata Extraction](#custom-metadata-extraction)

Deploy and Scale AI Apps with Vercel.

Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:

-   OpenAI
-   Photoroom
-   ![leonardo-ai Logo](../_next/logo-leonardo-ai-light.svg)![leonardo-ai Logo](../_next/logo-leonardo-ai-dark.svg)
-   ![zapier Logo](../_next/logo-zapier-light.svg)![zapier Logo](../_next/logo-zapier-dark.svg)

[](https://vercel.com/contact/sales?utm_source=ai_sdk&utm_medium=web&utm_campaign=contact_sales_cta&utm_content=talk_to_an_expert_sdk_docs)

#### Resources

[Docs](../docs/introduction.html)[Cookbook](../cookbook.html)[Providers](ai-sdk-providers.html)[Showcase](../showcase.html)[GitHub](https://github.com/vercel/ai)[Discussions](https://github.com/vercel/ai/discussions)

#### More

[Playground](../playground.html)[](https://v0.dev)[Contact Sales](https://vercel.com/contact/sales)

#### About Vercel

[Next.js + Vercel](https://vercel.com/frameworks/nextjs)[Open Source Software](https://vercel.com/oss)[GitHub](https://github.com/vercel)[X](https://x.com/vercel)

#### Legal

[Privacy Policy](https://vercel.com/legal/privacy-policy)

© 2025 Vercel, Inc.