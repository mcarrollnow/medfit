AI SDK Core: Embeddings

[](https://vercel.com/)

[

AI SDK



](../../index.html)

-   [Docs](../introduction.html)
-   [Cookbook](../../cookbook.html)
-   [Providers](../../providers/ai-sdk-providers.html)
-   [Playground](../../playground.html)
-   [
    
    AI ElementsAI Elements
    
    ](../../elements/overview.html)
-   [AI GatewayGateway](https://vercel.com/ai-gateway)

AI SDK 5 is available now.

[View Announcement](https://vercel.com/blog/ai-sdk-5)

Menu

[AI SDK by Vercel](../introduction.html)

[Foundations](../foundations.html)

[Overview](../foundations/overview.html)

[Providers and Models](../foundations/providers-and-models.html)

[Prompts](../foundations/prompts.html)

[Tools](../foundations/tools.html)

[Streaming](../foundations/streaming.html)

[Getting Started](../getting-started.html)

[Navigating the Library](../getting-started/navigating-the-library.html)

[Next.js App Router](../getting-started/nextjs-app-router.html)

[Next.js Pages Router](../getting-started/nextjs-pages-router.html)

[Svelte](../getting-started/svelte.html)

[Vue.js (Nuxt)](../getting-started/nuxt.html)

[Node.js](../getting-started/nodejs.html)

[Expo](../getting-started/expo.html)

[Agents](../agents.html)

[Agents](../agents/overview.html)

[Building Agents](../agents/building-agents.html)

[Workflow Patterns](../agents/workflows.html)

[Loop Control](../agents/loop-control.html)

[AI SDK Core](../ai-sdk-core.html)

[Overview](overview.html)

[Generating Text](generating-text.html)

[Generating Structured Data](generating-structured-data.html)

[Tool Calling](tools-and-tool-calling.html)

[Model Context Protocol (MCP) Tools](mcp-tools.html)

[Prompt Engineering](prompt-engineering.html)

[Settings](settings.html)

[Embeddings](embeddings.html)

[Image Generation](image-generation.html)

[Transcription](transcription.html)

[Speech](speech.html)

[Language Model Middleware](middleware.html)

[Provider & Model Management](provider-management.html)

[Error Handling](error-handling.html)

[Testing](testing.html)

[Telemetry](telemetry.html)

[AI SDK UI](../ai-sdk-ui.html)

[Overview](../ai-sdk-ui/overview.html)

[Chatbot](../ai-sdk-ui/chatbot.html)

[Chatbot Message Persistence](../ai-sdk-ui/chatbot-message-persistence.html)

[Chatbot Resume Streams](../ai-sdk-ui/chatbot-resume-streams.html)

[Chatbot Tool Usage](../ai-sdk-ui/chatbot-tool-usage.html)

[Generative User Interfaces](../ai-sdk-ui/generative-user-interfaces.html)

[Completion](../ai-sdk-ui/completion.html)

[Object Generation](../ai-sdk-ui/object-generation.html)

[Streaming Custom Data](../ai-sdk-ui/streaming-data.html)

[Error Handling](../ai-sdk-ui/error-handling.html)

[Transport](../ai-sdk-ui/transport.html)

[Reading UIMessage Streams](../ai-sdk-ui/reading-ui-message-streams.html)

[Message Metadata](../ai-sdk-ui/message-metadata.html)

[Stream Protocols](../ai-sdk-ui/stream-protocol.html)

[AI SDK RSC](../ai-sdk-rsc.html)

[Advanced](../advanced.html)

[Reference](../reference.html)

[AI SDK Core](../reference/ai-sdk-core.html)

[AI SDK UI](../reference/ai-sdk-ui.html)

[AI SDK RSC](../reference/ai-sdk-rsc.html)

[Stream Helpers](../reference/stream-helpers.html)

[AI SDK Errors](../reference/ai-sdk-errors.html)

[Migration Guides](../migration-guides.html)

[Troubleshooting](../troubleshooting.html)

[AI SDK Core](../ai-sdk-core.html)Embeddings

# [Embeddings](#embeddings)

Embeddings are a way to represent words, phrases, or images as vectors in a high-dimensional space. In this space, similar words are close to each other, and the distance between words can be used to measure their similarity.

## [Embedding a Single Value](#embedding-a-single-value)

The AI SDK provides the [`embed`](../reference/ai-sdk-core/embed.html) function to embed single values, which is useful for tasks such as finding similar words or phrases or clustering text. You can use it with embeddings models, e.g. `openai.textEmbeddingModel('text-embedding-3-large')` or `mistral.textEmbeddingModel('mistral-embed')`.

```tsx
import { embed } from 'ai';
import { openai } from '@ai-sdk/openai';


// 'embedding' is a single embedding object (number[])
const { embedding } = await embed({
  model: openai.textEmbeddingModel('text-embedding-3-small'),
  value: 'sunny day at the beach',
});
```

## [Embedding Many Values](#embedding-many-values)

When loading data, e.g. when preparing a data store for retrieval-augmented generation (RAG), it is often useful to embed many values at once (batch embedding).

The AI SDK provides the [`embedMany`](../reference/ai-sdk-core/embed-many.html) function for this purpose. Similar to `embed`, you can use it with embeddings models, e.g. `openai.textEmbeddingModel('text-embedding-3-large')` or `mistral.textEmbeddingModel('mistral-embed')`.

```tsx
import { openai } from '@ai-sdk/openai';
import { embedMany } from 'ai';


// 'embeddings' is an array of embedding objects (number[][]).
// It is sorted in the same order as the input values.
const { embeddings } = await embedMany({
  model: openai.textEmbeddingModel('text-embedding-3-small'),
  values: [
    'sunny day at the beach',
    'rainy afternoon in the city',
    'snowy night in the mountains',
  ],
});
```

## [Embedding Similarity](#embedding-similarity)

After embedding values, you can calculate the similarity between them using the [`cosineSimilarity`](../reference/ai-sdk-core/cosine-similarity.html) function. This is useful to e.g. find similar words or phrases in a dataset. You can also rank and filter related items based on their similarity.

```ts
import { openai } from '@ai-sdk/openai';
import { cosineSimilarity, embedMany } from 'ai';


const { embeddings } = await embedMany({
  model: openai.textEmbeddingModel('text-embedding-3-small'),
  values: ['sunny day at the beach', 'rainy afternoon in the city'],
});


console.log(
  `cosine similarity: ${cosineSimilarity(embeddings[0], embeddings[1])}`,
);
```

## [Token Usage](#token-usage)

Many providers charge based on the number of tokens used to generate embeddings. Both `embed` and `embedMany` provide token usage information in the `usage` property of the result object:

```ts
import { openai } from '@ai-sdk/openai';
import { embed } from 'ai';


const { embedding, usage } = await embed({
  model: openai.textEmbeddingModel('text-embedding-3-small'),
  value: 'sunny day at the beach',
});


console.log(usage); // { tokens: 10 }
```

## [Settings](#settings)

### [Provider Options](#provider-options)

Embedding model settings can be configured using `providerOptions` for provider-specific parameters:

```ts
import { openai } from '@ai-sdk/openai';
import { embed } from 'ai';


const { embedding } = await embed({
  model: openai.textEmbeddingModel('text-embedding-3-small'),
  value: 'sunny day at the beach',
  providerOptions: {
    openai: {
      dimensions: 512, // Reduce embedding dimensions
    },
  },
});
```

### [Parallel Requests](#parallel-requests)

The `embedMany` function now supports parallel processing with configurable `maxParallelCalls` to optimize performance:

```ts
import { openai } from '@ai-sdk/openai';
import { embedMany } from 'ai';


const { embeddings, usage } = await embedMany({
  maxParallelCalls: 2, // Limit parallel requests
  model: openai.textEmbeddingModel('text-embedding-3-small'),
  values: [
    'sunny day at the beach',
    'rainy afternoon in the city',
    'snowy night in the mountains',
  ],
});
```

### [Retries](#retries)

Both `embed` and `embedMany` accept an optional `maxRetries` parameter of type `number` that you can use to set the maximum number of retries for the embedding process. It defaults to `2` retries (3 attempts in total). You can set it to `0` to disable retries.

```ts
import { openai } from '@ai-sdk/openai';
import { embed } from 'ai';


const { embedding } = await embed({
  model: openai.textEmbeddingModel('text-embedding-3-small'),
  value: 'sunny day at the beach',
  maxRetries: 0, // Disable retries
});
```

### [Abort Signals and Timeouts](#abort-signals-and-timeouts)

Both `embed` and `embedMany` accept an optional `abortSignal` parameter of type [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) that you can use to abort the embedding process or set a timeout.

```ts
import { openai } from '@ai-sdk/openai';
import { embed } from 'ai';


const { embedding } = await embed({
  model: openai.textEmbeddingModel('text-embedding-3-small'),
  value: 'sunny day at the beach',
  abortSignal: AbortSignal.timeout(1000), // Abort after 1 second
});
```

### [Custom Headers](#custom-headers)

Both `embed` and `embedMany` accept an optional `headers` parameter of type `Record<string, string>` that you can use to add custom headers to the embedding request.

```ts
import { openai } from '@ai-sdk/openai';
import { embed } from 'ai';


const { embedding } = await embed({
  model: openai.textEmbeddingModel('text-embedding-3-small'),
  value: 'sunny day at the beach',
  headers: { 'X-Custom-Header': 'custom-value' },
});
```

## [Response Information](#response-information)

Both `embed` and `embedMany` return response information that includes the raw provider response:

```ts
import { openai } from '@ai-sdk/openai';
import { embed } from 'ai';


const { embedding, response } = await embed({
  model: openai.textEmbeddingModel('text-embedding-3-small'),
  value: 'sunny day at the beach',
});


console.log(response); // Raw provider response
```

## [Embedding Providers & Models](#embedding-providers--models)

Several providers offer embedding models:

| Provider | Model | Embedding Dimensions |
| --- | --- | --- |
| [OpenAI](../../providers/ai-sdk-providers/openai.html#embedding-models) | `text-embedding-3-large` | 3072 |
| [OpenAI](../../providers/ai-sdk-providers/openai.html#embedding-models) | `text-embedding-3-small` | 1536 |
| [OpenAI](../../providers/ai-sdk-providers/openai.html#embedding-models) | `text-embedding-ada-002` | 1536 |
| [Google Generative AI](../../providers/ai-sdk-providers/google-generative-ai.html#embedding-models) | `gemini-embedding-001` | 3072 |
| [Google Generative AI](../../providers/ai-sdk-providers/google-generative-ai.html#embedding-models) | `text-embedding-004` | 768 |
| [Mistral](../../providers/ai-sdk-providers/mistral.html#embedding-models) | `mistral-embed` | 1024 |
| [Cohere](../../providers/ai-sdk-providers/cohere.html#embedding-models) | `embed-english-v3.0` | 1024 |
| [Cohere](../../providers/ai-sdk-providers/cohere.html#embedding-models) | `embed-multilingual-v3.0` | 1024 |
| [Cohere](../../providers/ai-sdk-providers/cohere.html#embedding-models) | `embed-english-light-v3.0` | 384 |
| [Cohere](../../providers/ai-sdk-providers/cohere.html#embedding-models) | `embed-multilingual-light-v3.0` | 384 |
| [Cohere](../../providers/ai-sdk-providers/cohere.html#embedding-models) | `embed-english-v2.0` | 4096 |
| [Cohere](../../providers/ai-sdk-providers/cohere.html#embedding-models) | `embed-english-light-v2.0` | 1024 |
| [Cohere](../../providers/ai-sdk-providers/cohere.html#embedding-models) | `embed-multilingual-v2.0` | 768 |
| [Amazon Bedrock](../../providers/ai-sdk-providers/amazon-bedrock.html#embedding-models) | `amazon.titan-embed-text-v1` | 1536 |
| [Amazon Bedrock](../../providers/ai-sdk-providers/amazon-bedrock.html#embedding-models) | `amazon.titan-embed-text-v2:0` | 1024 |

[Previous

Settings

](settings.html)

[Next

Image Generation

](image-generation.html)

On this page

[Embeddings](#embeddings)

[Embedding a Single Value](#embedding-a-single-value)

[Embedding Many Values](#embedding-many-values)

[Embedding Similarity](#embedding-similarity)

[Token Usage](#token-usage)

[Settings](#settings)

[Provider Options](#provider-options)

[Parallel Requests](#parallel-requests)

[Retries](#retries)

[Abort Signals and Timeouts](#abort-signals-and-timeouts)

[Custom Headers](#custom-headers)

[Response Information](#response-information)

[Embedding Providers & Models](#embedding-providers--models)

Deploy and Scale AI Apps with Vercel.

Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:

-   OpenAI
-   Photoroom
-   ![leonardo-ai Logo](../../_next/logo-leonardo-ai-light.svg)![leonardo-ai Logo](../../_next/logo-leonardo-ai-dark.svg)
-   ![zapier Logo](../../_next/logo-zapier-light.svg)![zapier Logo](../../_next/logo-zapier-dark.svg)

[](https://vercel.com/contact/sales?utm_source=ai_sdk&utm_medium=web&utm_campaign=contact_sales_cta&utm_content=talk_to_an_expert_sdk_docs)

#### Resources

[Docs](../introduction.html)[Cookbook](../../cookbook.html)[Providers](../../providers/ai-sdk-providers.html)[Showcase](../../showcase.html)[GitHub](https://github.com/vercel/ai)[Discussions](https://github.com/vercel/ai/discussions)

#### More

[Playground](../../playground.html)[](https://v0.dev)[Contact Sales](https://vercel.com/contact/sales)

#### About Vercel

[Next.js + Vercel](https://vercel.com/frameworks/nextjs)[Open Source Software](https://vercel.com/oss)[GitHub](https://github.com/vercel)[X](https://x.com/vercel)

#### Legal

[Privacy Policy](https://vercel.com/legal/privacy-policy)

© 2025 Vercel, Inc.