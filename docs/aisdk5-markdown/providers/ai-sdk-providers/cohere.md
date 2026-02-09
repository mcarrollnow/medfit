AI SDK Providers: Cohere

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

[AI SDK Providers](../ai-sdk-providers.html)Cohere

# [Cohere Provider](#cohere-provider)

The [Cohere](https://cohere.com/) provider contains language and embedding model support for the Cohere chat API.

## [Setup](#setup)

The Cohere provider is available in the `@ai-sdk/cohere` module. You can install it with

pnpm

npm

yarn

bun

pnpm add @ai-sdk/cohere

## [Provider Instance](#provider-instance)

You can import the default provider instance `cohere` from `@ai-sdk/cohere`:

```ts
import { cohere } from '@ai-sdk/cohere';
```

If you need a customized setup, you can import `createCohere` from `@ai-sdk/cohere` and create a provider instance with your settings:

```ts
import { createCohere } from '@ai-sdk/cohere';


const cohere = createCohere({
  // custom settings
});
```

You can use the following optional settings to customize the Cohere provider instance:

-   **baseURL** *string*
    
    Use a different URL prefix for API calls, e.g. to use proxy servers. The default prefix is `https://api.cohere.com/v2`.
    
-   **apiKey** *string*
    
    API key that is being sent using the `Authorization` header. It defaults to the `COHERE_API_KEY` environment variable.
    
-   **headers** *Record<string,string>*
    
    Custom headers to include in the requests.
    
-   **fetch** *(input: RequestInfo, init?: RequestInit) => Promise<Response>*
    
    Custom [fetch](https://developer.mozilla.org/en-US/docs/Web/API/fetch) implementation. Defaults to the global `fetch` function. You can use it as a middleware to intercept requests, or to provide a custom fetch implementation for e.g. testing.
    

## [Language Models](#language-models)

You can create models that call the [Cohere chat API](https://docs.cohere.com/v2/docs/chat-api) using a provider instance. The first argument is the model id, e.g. `command-r-plus`. Some Cohere chat models support tool calls.

```ts
const model = cohere('command-r-plus');
```

### [Example](#example)

You can use Cohere language models to generate text with the `generateText` function:

```ts
import { cohere } from '@ai-sdk/cohere';
import { generateText } from 'ai';


const { text } = await generateText({
  model: cohere('command-r-plus'),
  prompt: 'Write a vegetarian lasagna recipe for 4 people.',
});
```

Cohere language models can also be used in the `streamText`, `generateObject`, and `streamObject` functions (see [AI SDK Core](../../docs/ai-sdk-core.html).

### [Model Capabilities](#model-capabilities)

| Model | Image Input | Object Generation | Tool Usage | Tool Streaming |
| --- | --- | --- | --- | --- |
| `command-a-03-2025` |  |  |  |  |
| `command-a-reasoning-08-2025` |  |  |  |  |
| `command-r7b-12-2024` |  |  |  |  |
| `command-r-plus-04-2024` |  |  |  |  |
| `command-r-plus` |  |  |  |  |
| `command-r-08-2024` |  |  |  |  |
| `command-r-03-2024` |  |  |  |  |
| `command-r` |  |  |  |  |
| `command` |  |  |  |  |
| `command-nightly` |  |  |  |  |
| `command-light` |  |  |  |  |
| `command-light-nightly` |  |  |  |  |

The table above lists popular models. Please see the [Cohere docs](https://docs.cohere.com/v2/docs/models#command) for a full list of available models. You can also pass any available provider model ID as a string if needed.

#### [Reasoning](#reasoning)

Cohere has introduced reasoning with the `command-a-reasoning-08-2025` model. You can learn more at [https://docs.cohere.com/docs/reasoning](https://docs.cohere.com/docs/reasoning).

```ts
import { cohere } from '@ai-sdk/cohere';
import { generateText } from 'ai';


async function main() {
  const { text, reasoning } = await generateText({
    model: cohere('command-a-reasoning-08-2025'),
    prompt:
      "Alice has 3 brothers and she also has 2 sisters. How many sisters does Alice's brother have?",
    // optional: reasoning options
    providerOptions: {
      cohere: {
        thinking: {
          type: 'enabled',
          tokenBudget: 100,
        },
      },
    },
  });


  console.log(reasoning);
  console.log(text);
}


main().catch(console.error);
```

## [Embedding Models](#embedding-models)

You can create models that call the [Cohere embed API](https://docs.cohere.com/v2/reference/embed) using the `.textEmbedding()` factory method.

```ts
const model = cohere.textEmbedding('embed-english-v3.0');
```

You can use Cohere embedding models to generate embeddings with the `embed` function:

```ts
import { cohere } from '@ai-sdk/cohere';
import { embed } from 'ai';


const { embedding } = await embed({
  model: cohere.textEmbedding('embed-english-v3.0'),
  value: 'sunny day at the beach',
  providerOptions: {
    cohere: {
      inputType: 'search_document',
    },
  },
});
```

Cohere embedding models support additional provider options that can be passed via `providerOptions.cohere`:

```ts
import { cohere } from '@ai-sdk/cohere';
import { embed } from 'ai';


const { embedding } = await embed({
  model: cohere.textEmbedding('embed-english-v3.0'),
  value: 'sunny day at the beach',
  providerOptions: {
    cohere: {
      inputType: 'search_document',
      truncate: 'END',
    },
  },
});
```

The following provider options are available:

-   **inputType** *'search\_document' | 'search\_query' | 'classification' | 'clustering'*
    
    Specifies the type of input passed to the model. Default is `search_query`.
    
    -   `search_document`: Used for embeddings stored in a vector database for search use-cases.
    -   `search_query`: Used for embeddings of search queries run against a vector DB to find relevant documents.
    -   `classification`: Used for embeddings passed through a text classifier.
    -   `clustering`: Used for embeddings run through a clustering algorithm.
-   **truncate** *'NONE' | 'START' | 'END'*
    
    Specifies how the API will handle inputs longer than the maximum token length. Default is `END`.
    
    -   `NONE`: If selected, when the input exceeds the maximum input token length will return an error.
    -   `START`: Will discard the start of the input until the remaining input is exactly the maximum input token length for the model.
    -   `END`: Will discard the end of the input until the remaining input is exactly the maximum input token length for the model.

### [Model Capabilities](#model-capabilities-1)

| Model | Embedding Dimensions |
| --- | --- |
| `embed-english-v3.0` | 1024 |
| `embed-multilingual-v3.0` | 1024 |
| `embed-english-light-v3.0` | 384 |
| `embed-multilingual-light-v3.0` | 384 |
| `embed-english-v2.0` | 4096 |
| `embed-english-light-v2.0` | 1024 |
| `embed-multilingual-v2.0` | 768 |

[Previous

Together.ai

](togetherai.html)

[Next

Fireworks

](fireworks.html)

On this page

[Cohere Provider](#cohere-provider)

[Setup](#setup)

[Provider Instance](#provider-instance)

[Language Models](#language-models)

[Example](#example)

[Model Capabilities](#model-capabilities)

[Reasoning](#reasoning)

[Embedding Models](#embedding-models)

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