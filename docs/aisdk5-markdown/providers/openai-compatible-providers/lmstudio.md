OpenAI Compatible Providers: LM Studio

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

[OpenAI Compatible Providers](../openai-compatible-providers.html)LM Studio

# [LM Studio Provider](#lm-studio-provider)

[LM Studio](https://lmstudio.ai/) is a user interface for running local models.

It contains an OpenAI compatible API server that you can use with the AI SDK. You can start the local server under the [Local Server tab](https://lmstudio.ai/docs/basics/server) in the LM Studio UI ("Start Server" button).

## [Setup](#setup)

The LM Studio provider is available via the `@ai-sdk/openai-compatible` module as it is compatible with the OpenAI API. You can install it with

pnpm

npm

yarn

bun

pnpm add @ai-sdk/openai-compatible

## [Provider Instance](#provider-instance)

To use LM Studio, you can create a custom provider instance with the `createOpenAICompatible` function from `@ai-sdk/openai-compatible`:

```ts
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';


const lmstudio = createOpenAICompatible({
  name: 'lmstudio',
  baseURL: 'http://localhost:1234/v1',
});
```

LM Studio uses port `1234` by default, but you can change in the [app's Local Server tab](https://lmstudio.ai/docs/basics/server).

## [Language Models](#language-models)

You can interact with local LLMs in [LM Studio](https://lmstudio.ai/docs/basics/server#endpoints-overview) using a provider instance. The first argument is the model id, e.g. `llama-3.2-1b`.

```ts
const model = lmstudio('llama-3.2-1b');
```

###### [To be able to use a model, you need to](#to-be-able-to-use-a-model-you-need-to-download-it-first) [download it first](https://lmstudio.ai/docs/basics/download-model).

### [Example](#example)

You can use LM Studio language models to generate text with the `generateText` function:

```ts
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { generateText } from 'ai';


const lmstudio = createOpenAICompatible({
  name: 'lmstudio',
  baseURL: 'https://localhost:1234/v1',
});


const { text } = await generateText({
  model: lmstudio('llama-3.2-1b'),
  prompt: 'Write a vegetarian lasagna recipe for 4 people.',
  maxRetries: 1, // immediately error if the server is not running
});
```

LM Studio language models can also be used with `streamText`.

## [Embedding Models](#embedding-models)

You can create models that call the [LM Studio embeddings API](https://lmstudio.ai/docs/basics/server#endpoints-overview) using the `.textEmbeddingModel()` factory method.

```ts
const model = lmstudio.textEmbeddingModel(
  'text-embedding-nomic-embed-text-v1.5',
);
```

### [Example - Embedding a Single Value](#example---embedding-a-single-value)

```tsx
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { embed } from 'ai';


const lmstudio = createOpenAICompatible({
  name: 'lmstudio',
  baseURL: 'https://localhost:1234/v1',
});


// 'embedding' is a single embedding object (number[])
const { embedding } = await embed({
  model: lmstudio.textEmbeddingModel('text-embedding-nomic-embed-text-v1.5'),
  value: 'sunny day at the beach',
});
```

### [Example - Embedding Many Values](#example---embedding-many-values)

When loading data, e.g. when preparing a data store for retrieval-augmented generation (RAG), it is often useful to embed many values at once (batch embedding).

The AI SDK provides the [`embedMany`](../../docs/reference/ai-sdk-core/embed-many.html) function for this purpose. Similar to `embed`, you can use it with embeddings models, e.g. `lmstudio.textEmbeddingModel('text-embedding-nomic-embed-text-v1.5')` or `lmstudio.textEmbeddingModel('text-embedding-bge-small-en-v1.5')`.

```tsx
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { embedMany } from 'ai';


const lmstudio = createOpenAICompatible({
  name: 'lmstudio',
  baseURL: 'https://localhost:1234/v1',
});


// 'embeddings' is an array of embedding objects (number[][]).
// It is sorted in the same order as the input values.
const { embeddings } = await embedMany({
  model: lmstudio.textEmbeddingModel('text-embedding-nomic-embed-text-v1.5'),
  values: [
    'sunny day at the beach',
    'rainy afternoon in the city',
    'snowy night in the mountains',
  ],
});
```

[Previous

Writing a Custom Provider

](custom-providers.html)

[Next

NVIDIA NIM

](nim.html)

On this page

[LM Studio Provider](#lm-studio-provider)

[Setup](#setup)

[Provider Instance](#provider-instance)

[Language Models](#language-models)

[To be able to use a model, you need to \[download it first\](https://lmstudio.ai/docs/basics/download-model).](#to-be-able-to-use-a-model-you-need-to-download-it-firsthttpslmstudioaidocsbasicsdownload-model)

[Example](#example)

[Embedding Models](#embedding-models)

[Example - Embedding a Single Value](#example---embedding-a-single-value)

[Example - Embedding Many Values](#example---embedding-many-values)

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