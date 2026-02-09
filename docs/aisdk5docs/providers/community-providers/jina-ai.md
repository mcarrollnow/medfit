AI SDK 5 is available now.










Menu






















































































































































































































































































































































































































































































# [Jina AI Provider](#jina-ai-provider)


## [Setup](#setup)

The Jina provider is available in the `jina-ai-provider` module. You can install it with






pnpm







npm







yarn







bun








``` geist-overflow-scroll-y
pnpm add jina-ai-provider
```












## [Provider Instance](#provider-instance)

You can import the default provider instance `jina` from `jina-ai-provider`:



``` ts
import  from 'jina-ai-provider';
```


If you need a customized setup, you can import `createJina` from `jina-ai-provider` and create a provider instance with your settings:



``` ts
import  from 'jina-ai-provider';
const customJina = createJina();
```


You can use the following optional settings to customize the Jina provider instance:

- **baseURL** *string*

  The base URL of the Jina API. The default prefix is `https://api.jina.ai/v1`.

- **apiKey** *string*

  API key that is being sent using the `Authorization` header. It defaults to the `JINA_API_KEY` environment variable.

- **headers** *Record\<string,string\>*

  Custom headers to include in the requests.

- **fetch** *(input: RequestInfo, init?: RequestInit) =\> Promise\<Response\>*


## [Text Embedding Models](#text-embedding-models)

You can create models that call the Jina text embeddings API using the `.textEmbeddingModel()` factory method.



``` ts
import  from 'jina-ai-provider';
const textEmbeddingModel = jina.textEmbeddingModel('jina-embeddings-v3');
```


You can use Jina embedding models to generate embeddings with the `embed` or `embedMany` function:



``` ts
import  from 'jina-ai-provider';import  from 'ai';
const textEmbeddingModel = jina.textEmbeddingModel('jina-embeddings-v3');
export const generateEmbeddings = async (  value: string,): Promise<Array<>> =>  = await embedMany(,    },  });
  return embeddings.map((embedding, index) => ());};
```


## [Multimodal Embedding](#multimodal-embedding)

You can create models that call the Jina multimodal (text + image) embeddings API using the `.multiModalEmbeddingModel()` factory method.



``` ts
import  from 'jina-ai-provider';import  from 'ai';
const multimodalModel = jina.multiModalEmbeddingModel('jina-clip-v2');
export const generateMultimodalEmbeddings = async () => ,    ,  ];
  const  = await embedMany<MultimodalEmbeddingInput>();
  return embeddings.map((embedding, index) => ());};
```





Use the `MultimodalEmbeddingInput` type to ensure type safety when using multimodal embeddings. You can pass Base64 encoded images to the `image` property in the Data URL format `data:[mediatype];base64,<data>`.



## [Provider Options](#provider-options)

Pass Jina embedding options via `providerOptions.jina`. The following options are supported:

- **inputType** *'text-matching' \| 'retrieval.query' \| 'retrieval.passage' \| 'separation' \| 'classification'*

  Intended downstream application to help the model produce better embeddings. Defaults to `'retrieval.passage'`.

  - `'retrieval.query'`: input is a search query.
  - `'retrieval.passage'`: input is a document/passage.
  - `'text-matching'`: for semantic textual similarity tasks.
  - `'classification'`: for classification tasks.
  - `'separation'`: for clustering tasks.

- **outputDimension** *number*

  Number of dimensions for the output embeddings. See model documentation for valid ranges.

  - `jina-embeddings-v3`: min 32, max 1024.
  - `jina-clip-v2`: min 64, max 1024.
  - `jina-clip-v1`: fixed 768.

- **embeddingType** *'float' \| 'binary' \| 'ubinary' \| 'base64'*

  Data type for the returned embeddings.

- **normalized** *boolean*

  Whether to L2-normalize embeddings. Defaults to `true`.

- **truncate** *boolean*

  Whether to truncate inputs beyond the model context limit instead of erroring. Defaults to `false`.

- **lateChunking** *boolean*

  Split long inputs into 1024-token chunks automatically. Only for text embedding models.

## [Model Capabilities](#model-capabilities)


| Model | Context Length (tokens) | Embedding Dimension | Modalities |
|----|----|----|----|
| `jina-embeddings-v3` | 8,192 | 1024 | Text |
| `jina-clip-v2` | 8,192 | 1024 | Text + Images |
| `jina-clip-v1` | 8,192 | 768 | Text + Images |


## [Supported Input Formats](#supported-input-formats)

### [Text Embeddings](#text-embeddings)

- Array of strings, for example: `const strings = ['text1', 'text2']`

### [Multimodal Embeddings](#multimodal-embeddings)

- Text objects: `const text = []`
- Image objects: `const image = []` or Base64 data URLs
- Mixed arrays: `const mixed = [, , ]`
















On this page










































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.