OpenAI Compatible Providers: Writing a Custom Provider

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

[Writing a Custom Provider](custom-providers.html)

[LM Studio](lmstudio.html)

[NVIDIA NIM](nim.html)

[Heroku](heroku.html)

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

[OpenAI Compatible Providers](../openai-compatible-providers.html)Writing a Custom Provider

# [Writing a Custom Provider](#writing-a-custom-provider)

You can create your own provider package that leverages the AI SDK's [OpenAI Compatible package](https://www.npmjs.com/package/@ai-sdk/openai-compatible). Publishing your provider package to [npm](https://www.npmjs.com/) can give users an easy way to use the provider's models and stay up to date with any changes you may have. Here's an example structure:

### [File Structure](#file-structure)

```bash
packages/example/
├── src/
│   ├── example-chat-settings.ts       # Chat model types and settings
│   ├── example-completion-settings.ts # Completion model types and settings
│   ├── example-embedding-settings.ts  # Embedding model types and settings
│   ├── example-image-settings.ts      # Image model types and settings
│   ├── example-provider.ts            # Main provider implementation
│   ├── example-provider.test.ts       # Provider tests
│   └── index.ts                       # Public exports
├── package.json
├── tsconfig.json
├── tsup.config.ts                     # Build configuration
└── README.md
```

### [Key Files](#key-files)

1.  **example-chat-settings.ts** - Define chat model IDs and settings:

```ts
export type ExampleChatModelId =
  | 'example/chat-model-1'
  | 'example/chat-model-2'
  | (string & {});
```

The completion, embedding, and image settings are implemented similarly to the chat settings.

2.  **example-provider.ts** - Main provider implementation:

```ts
import { LanguageModelV1, EmbeddingModelV2 } from '@ai-sdk/provider';
import {
  OpenAICompatibleChatLanguageModel,
  OpenAICompatibleCompletionLanguageModel,
  OpenAICompatibleEmbeddingModel,
  OpenAICompatibleImageModel,
} from '@ai-sdk/openai-compatible';
import {
  FetchFunction,
  loadApiKey,
  withoutTrailingSlash,
} from '@ai-sdk/provider-utils';
// Import your model id and settings here.


export interface ExampleProviderSettings {
  /**
Example API key.
*/
  apiKey?: string;
  /**
Base URL for the API calls.
*/
  baseURL?: string;
  /**
Custom headers to include in the requests.
*/
  headers?: Record<string, string>;
  /**
Optional custom url query parameters to include in request urls.
*/
  queryParams?: Record<string, string>;
  /**
Custom fetch implementation. You can use it as a middleware to intercept requests,
or to provide a custom fetch implementation for e.g. testing.
*/
  fetch?: FetchFunction;
}


export interface ExampleProvider {
  /**
Creates a model for text generation.
*/
  (
    modelId: ExampleChatModelId,
    settings?: ExampleChatSettings,
  ): LanguageModelV1;


  /**
Creates a chat model for text generation.
*/
  chatModel(
    modelId: ExampleChatModelId,
    settings?: ExampleChatSettings,
  ): LanguageModelV1;


  /**
Creates a completion model for text generation.
*/
  completionModel(
    modelId: ExampleCompletionModelId,
    settings?: ExampleCompletionSettings,
  ): LanguageModelV1;


  /**
Creates a text embedding model for text generation.
*/
  textEmbeddingModel(
    modelId: ExampleEmbeddingModelId,
    settings?: ExampleEmbeddingSettings,
  ): EmbeddingModelV2<string>;


  /**
Creates an image model for image generation.
*/
  imageModel(
    modelId: ExampleImageModelId,
    settings?: ExampleImageSettings,
  ): ImageModelV2;
}


export function createExample(
  options: ExampleProviderSettings = {},
): ExampleProvider {
  const baseURL = withoutTrailingSlash(
    options.baseURL ?? 'https://api.example.com/v1',
  );
  const getHeaders = () => ({
    Authorization: `Bearer ${loadApiKey({
      apiKey: options.apiKey,
      environmentVariableName: 'EXAMPLE_API_KEY',
      description: 'Example API key',
    })}`,
    ...options.headers,
  });


  interface CommonModelConfig {
    provider: string;
    url: ({ path }: { path: string }) => string;
    headers: () => Record<string, string>;
    fetch?: FetchFunction;
  }


  const getCommonModelConfig = (modelType: string): CommonModelConfig => ({
    provider: `example.${modelType}`,
    url: ({ path }) => {
      const url = new URL(`${baseURL}${path}`);
      if (options.queryParams) {
        url.search = new URLSearchParams(options.queryParams).toString();
      }
      return url.toString();
    },
    headers: getHeaders,
    fetch: options.fetch,
  });


  const createChatModel = (
    modelId: ExampleChatModelId,
    settings: ExampleChatSettings = {},
  ) => {
    return new OpenAICompatibleChatLanguageModel(
      modelId,
      settings,
      getCommonModelConfig('chat'),
    );
  };


  const createCompletionModel = (
    modelId: ExampleCompletionModelId,
    settings: ExampleCompletionSettings = {},
  ) =>
    new OpenAICompatibleCompletionLanguageModel(
      modelId,
      settings,
      getCommonModelConfig('completion'),
    );


  const createTextEmbeddingModel = (
    modelId: ExampleEmbeddingModelId,
    settings: ExampleEmbeddingSettings = {},
  ) =>
    new OpenAICompatibleEmbeddingModel(
      modelId,
      settings,
      getCommonModelConfig('embedding'),
    );


  const createImageModel = (
    modelId: ExampleImageModelId,
    settings: ExampleImageSettings = {},
  ) =>
    new OpenAICompatibleImageModel(
      modelId,
      settings,
      getCommonModelConfig('image'),
    );


  const provider = (
    modelId: ExampleChatModelId,
    settings?: ExampleChatSettings,
  ) => createChatModel(modelId, settings);


  provider.completionModel = createCompletionModel;
  provider.chatModel = createChatModel;
  provider.textEmbeddingModel = createTextEmbeddingModel;
  provider.imageModel = createImageModel;


  return provider;
}


// Export default instance
export const example = createExample();
```

3.  **index.ts** - Public exports:

```ts
export { createExample, example } from './example-provider';
export type {
  ExampleProvider,
  ExampleProviderSettings,
} from './example-provider';
```

4.  **package.json** - Package configuration:

```js
{
  "name": "@company-name/example",
  "version": "0.0.1",
  "dependencies": {
    "@ai-sdk/openai-compatible": "^0.0.7",
    "@ai-sdk/provider": "^1.0.2",
    "@ai-sdk/provider-utils": "^2.0.4",
    // ...additional dependencies
  },
  // ...additional scripts and module build configuration
}
```

### [Usage](#usage)

Once published, users can use your provider like this:

```ts
import { example } from '@company-name/example';
import { generateText } from 'ai';


const { text } = await generateText({
  model: example('example/chat-model-1'),
  prompt: 'Hello, how are you?',
});
```

This structure provides a clean, type-safe implementation that leverages the OpenAI Compatible package while maintaining consistency with the usage of other AI SDK providers.

### [Internal API](#internal-api)

As you work on your provider you may need to use some of the internal API of the OpenAI Compatible package. You can import these from the `@ai-sdk/openai-compatible/internal` package, for example:

```ts
import { convertToOpenAICompatibleChatMessages } from '@ai-sdk/openai-compatible/internal';
```

You can see the latest available exports in the AI SDK [GitHub repository](https://github.com/vercel/ai/blob/main/packages/openai-compatible/src/internal/index.ts).

[Previous

OpenAI Compatible Providers

](../openai-compatible-providers.html)

[Next

LM Studio

](lmstudio.html)

On this page

[Writing a Custom Provider](#writing-a-custom-provider)

[File Structure](#file-structure)

[Key Files](#key-files)

[Usage](#usage)

[Internal API](#internal-api)

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