AI SDK 5 is available now.










Menu






















































































































































































































































































































































# [Embeddings](#embeddings)

Embeddings are a way to represent words, phrases, or images as vectors in a high-dimensional space. In this space, similar words are close to each other, and the distance between words can be used to measure their similarity.

## [Embedding a Single Value](#embedding-a-single-value)

The AI SDK provides the [`embed`](../reference/ai-sdk-core/embed.html) function to embed single values, which is useful for tasks such as finding similar words or phrases or clustering text. You can use it with embeddings models, e.g. `openai.textEmbeddingModel('text-embedding-3-large')` or `mistral.textEmbeddingModel('mistral-embed')`.



``` tsx
import  from 'ai';import  from '@ai-sdk/openai';
// 'embedding' is a single embedding object (number[])const  = await embed();
```


## [Embedding Many Values](#embedding-many-values)

When loading data, e.g. when preparing a data store for retrieval-augmented generation (RAG), it is often useful to embed many values at once (batch embedding).

The AI SDK provides the [`embedMany`](../reference/ai-sdk-core/embed-many.html) function for this purpose. Similar to `embed`, you can use it with embeddings models, e.g. `openai.textEmbeddingModel('text-embedding-3-large')` or `mistral.textEmbeddingModel('mistral-embed')`.



``` tsx
import  from '@ai-sdk/openai';import  from 'ai';
// 'embeddings' is an array of embedding objects (number[][]).// It is sorted in the same order as the input values.const  = await embedMany();
```


## [Embedding Similarity](#embedding-similarity)

After embedding values, you can calculate the similarity between them using the [`cosineSimilarity`](../reference/ai-sdk-core/cosine-similarity.html) function. This is useful to e.g. find similar words or phrases in a dataset. You can also rank and filter related items based on their similarity.



``` ts
import  from '@ai-sdk/openai';import  from 'ai';
const  = await embedMany();
console.log(  `cosine similarity: $`,);
```


## [Token Usage](#token-usage)

Many providers charge based on the number of tokens used to generate embeddings. Both `embed` and `embedMany` provide token usage information in the `usage` property of the result object:



``` ts
import  from '@ai-sdk/openai';import  from 'ai';
const  = await embed();
console.log(usage); // 
```


## [Settings](#settings)

### [Provider Options](#provider-options)

Embedding model settings can be configured using `providerOptions` for provider-specific parameters:



``` ts
import  from '@ai-sdk/openai';import  from 'ai';
const  = await embed(,  },});
```


### [Parallel Requests](#parallel-requests)

The `embedMany` function now supports parallel processing with configurable `maxParallelCalls` to optimize performance:



``` ts
import  from '@ai-sdk/openai';import  from 'ai';
const  = await embedMany();
```


### [Retries](#retries)

Both `embed` and `embedMany` accept an optional `maxRetries` parameter of type `number` that you can use to set the maximum number of retries for the embedding process. It defaults to `2` retries (3 attempts in total). You can set it to `0` to disable retries.



``` ts
import  from '@ai-sdk/openai';import  from 'ai';
const  = await embed();
```


### [Abort Signals and Timeouts](#abort-signals-and-timeouts)




``` ts
import  from '@ai-sdk/openai';import  from 'ai';
const  = await embed();
```


### [Custom Headers](#custom-headers)

Both `embed` and `embedMany` accept an optional `headers` parameter of type `Record<string, string>` that you can use to add custom headers to the embedding request.



``` ts
import  from '@ai-sdk/openai';import  from 'ai';
const  = await embed(,});
```


## [Response Information](#response-information)

Both `embed` and `embedMany` return response information that includes the raw provider response:



``` ts
import  from '@ai-sdk/openai';import  from 'ai';
const  = await embed();
console.log(response); // Raw provider response
```


## [Embedding Providers & Models](#embedding-providers--models)

Several providers offer embedding models:


| Provider | Model | Embedding Dimensions |
|----|----|----|
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

















On this page



















































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.