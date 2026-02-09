AI SDK 5 is available now.










Menu






















































































































































































































































































































































































































































































# [Voyage AI Provider](#voyage-ai-provider)


## [Setup](#setup)

The Voyage provider is available in the `voyage-ai-provider` module. You can install it with






pnpm







npm







yarn







bun








``` geist-overflow-scroll-y
pnpm add voyage-ai-provider
```












## [Provider Instance](#provider-instance)

You can import the default provider instance `voyage` from `voyage-ai-provider`:



``` ts
import  from 'voyage-ai-provider';
```


If you need a customized setup, you can import `createVoyage` from `voyage-ai-provider` and create a provider instance with your settings:



``` ts
import  from 'voyage-ai-provider';
const voyage = createVoyage();
```


You can use the following optional settings to customize the Voyage provider instance:

- **baseURL** *string*

  The base URL of the Voyage API. The default prefix is `https://api.voyageai.com/v1`.

- **apiKey** *string*

  API key that is being sent using the `Authorization` header. It defaults to the `VOYAGE_API_KEY` environment variable.

- **headers** *Record\<string,string\>*

  Custom headers to include in the requests.

- **fetch** *(input: RequestInfo, init?: RequestInit) =\> Promise\<Response\>*


## [Text Embedding Models](#text-embedding-models)




``` ts
import  from 'voyage-ai-provider';
const embeddingModel = voyage.textEmbeddingModel('voyage-3.5-lite');
```


You can use Voyage embedding models to generate embeddings with the `embed` or `embedMany` function:



``` ts
import  from 'voyage-ai-provider';import  from 'ai';
const  = await embed(,  },});
```


Voyage embedding models support additional provider options that can be passed via `providerOptions.voyage`:



``` ts
import  from 'voyage-ai-provider';import  from 'ai';
const  = await embed(,  },});
```



- **inputType** *'query' \| 'document' \| 'null'*

  Specifies the type of input passed to the model. Defaults to `'null'`.

  - `'null'`: When `inputType` is `'null'`, the embedding model directly converts the inputs into numerical vectors.

  For retrieval/search purposes it is recommended to use `'query'` or `'document'`.

  - `'query'`: The input is a search query, e.g., "Represent the query for retrieving supporting documents: ...".
  - `'document'`: The input is a document to be stored in a vector database, e.g., "Represent the document for retrieval: ...".

- **outputDimension** *number*

  The number of dimensions for the resulting output embeddings. Default is `'null'`.

  - For example, `voyage-code-3` and `voyage-3-large` support: 2048, 1024 (default), 512, and 256.

- **outputDtype** *'float' \| 'int8' \| 'uint8' \| 'binary' \| 'ubinary'*

  The data type for the output embeddings. Defaults to `'float'`.

  - `'float'`: 32-bit floating-point numbers (supported by all models).
  - `'int8'`, `'uint8'`: 8-bit integer types (supported by `voyage-3-large`, `voyage-3.5`, `voyage-3.5-lite`, and `voyage-code-3`).
  - `'binary'`, `'ubinary'`: Bit-packed, quantized single-bit embedding values (`voyage-3-large`, `voyage-3.5`, `voyage-3.5-lite`, and `voyage-code-3`). The returned list length is 1/8 of `outputDimension`. `'binary'` uses offset binary encoding.


- **truncation** *boolean*

  Whether to truncate the input texts to fit within the model's context length. If not specified, defaults to true.


### [Model Capabilities](#model-capabilities)


| Model                   | Default Dimensions             | Context Length |
|-------------------------|--------------------------------|----------------|
| `voyage-3.5`            | 1024 (default), 256, 512, 2048 | 32,000         |
| `voyage-3.5-lite`       | 1024 (default), 256, 512, 2048 | 32,000         |
| `voyage-3-large`        | 1024 (default), 256, 512, 2048 | 32,000         |
| `voyage-3`              | 1024                           | 32,000         |
| `voyage-code-3`         | 1024 (default), 256, 512, 2048 | 32,000         |
| `voyage-3-lite`         | 512                            | 32,000         |
| `voyage-finance-2`      | 1024                           | 32,000         |
| `voyage-multilingual-2` | 1024                           | 32,000         |
| `voyage-law-2`          | 1024                           | 32,000         |
| `voyage-code-2`         | 1024                           | 16,000         |








## [Image Embedding](#image-embedding)

### [Example 1: Embed an image as a single embedding](#example-1-embed-an-image-as-a-single-embedding)



``` ts
import  from 'voyage-ai-provider';import  from 'ai';
const imageModel = voyage.imageEmbeddingModel('voyage-multimodal-3');
const  = await embedMany<ImageEmbeddingInput>(,    ,  ],  // or you can pass the array of images url and base64 string directly  // values: [  //   'https://raw.githubusercontent.com/voyage-ai/voyage-multimodal-3/refs/heads/main/images/banana_200_x_200.jpg',  //   'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAA...',  // ],});
```


### [Example 2: Embed multiple images as single embedding](#example-2-embed-multiple-images-as-single-embedding)



``` ts
import  from 'voyage-ai-provider';import  from 'ai';
const imageModel = voyage.imageEmbeddingModel('voyage-multimodal-3');
const  = await embedMany<ImageEmbeddingInput>(,  ],});
```





If you get an image URL not found error, convert the image to base64 and pass the base64 data URL in the image array. The value should be a Base64-encoded image in the data URL format `data:[mediatype];base64,<data>`. Supported media types: `image/png`, `image/jpeg`, `image/webp`, and `image/gif`.



## [Multimodal Embedding](#multimodal-embedding)

### [Example 1: Embed multiple texts and images as single embedding](#example-1-embed-multiple-texts-and-images-as-single-embedding)



``` ts
import  from 'voyage-ai-provider';import  from 'ai';
const multimodalModel = voyage.multimodalEmbeddingModel('voyage-multimodal-3');
const  = await embedMany<MultimodalEmbeddingInput>(,    ,  ],});
```


The following constraints apply to the `values` list:

- The list must not contain more than 1,000 values.
- Each image must not contain more than 16 million pixels or be larger than 20 MB in size.
- With every 560 pixels of an image being counted as a token, each input in the list must not exceed 32,000 tokens, and the total number of tokens across all inputs must not exceed 320,000.

Voyage multimodal embedding models support additional provider options that can be passed via `providerOptions.voyage`:



``` ts
import  from 'voyage-ai-provider';import  from 'ai';
const multimodalModel = voyage.multimodalEmbeddingModel('voyage-multimodal-3');
const  = await embedMany<MultimodalEmbeddingInput>(,  ],  providerOptions: ,  },});
```


The following provider options are available:

- **inputType** *'query' \| 'document'*

  Specifies the type of input passed to the model. Defaults to `'query'`.

  When `inputType` is specified as `'query'` or `'document'`, Voyage automatically prepends a prompt to your inputs before vectorizing them, creating vectors tailored for retrieval/search tasks:

  - `'query'`: Prepends "Represent the query for retrieving supporting documents: "
  - `'document'`: Prepends "Represent the document for retrieval: "

- **outputEncoding** *'base64'*

  The data encoding for the resulting output embeddings. Defaults to `null` (list of 32-bit floats).

  - If `null`, embeddings are returned as a list of floating-point numbers (float32).
  - If `'base64'`, embeddings are returned as a Base64-encoded NumPy array of single-precision floats.


- **truncation** *boolean*

  Whether to truncate the inputs to fit within the model's context length. If not specified, defaults to `true`.

### [Model Capabilities](#model-capabilities-1)


| Model                 | Context Length (tokens) | Embedding Dimension |
|-----------------------|-------------------------|---------------------|
| `voyage-multimodal-3` | 32,000                  | 1024                |

















On this page

















































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.