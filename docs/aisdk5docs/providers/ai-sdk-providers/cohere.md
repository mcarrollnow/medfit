AI SDK 5 is available now.










Menu






















































































































































































































































































































































































































































































# [Cohere Provider](#cohere-provider)


## [Setup](#setup)

The Cohere provider is available in the `@ai-sdk/cohere` module. You can install it with






pnpm







npm







yarn







bun








``` geist-overflow-scroll-y
pnpm add @ai-sdk/cohere
```












## [Provider Instance](#provider-instance)

You can import the default provider instance `cohere` from `@ai-sdk/cohere`:



``` ts
import  from '@ai-sdk/cohere';
```


If you need a customized setup, you can import `createCohere` from `@ai-sdk/cohere` and create a provider instance with your settings:



``` ts
import  from '@ai-sdk/cohere';
const cohere = createCohere();
```


You can use the following optional settings to customize the Cohere provider instance:

- **baseURL** *string*

  Use a different URL prefix for API calls, e.g. to use proxy servers. The default prefix is `https://api.cohere.com/v2`.

- **apiKey** *string*

  API key that is being sent using the `Authorization` header. It defaults to the `COHERE_API_KEY` environment variable.

- **headers** *Record\<string,string\>*

  Custom headers to include in the requests.

- **fetch** *(input: RequestInfo, init?: RequestInit) =\> Promise\<Response\>*


## [Language Models](#language-models)




``` ts
const model = cohere('command-r-plus');
```


### [Example](#example)

You can use Cohere language models to generate text with the `generateText` function:



``` ts
import  from '@ai-sdk/cohere';import  from 'ai';
const  = await generateText();
```


Cohere language models can also be used in the `streamText`, `generateObject`, and `streamObject` functions (see [AI SDK Core](../../docs/ai-sdk-core.html).

### [Model Capabilities](#model-capabilities)


| Model | Image Input | Object Generation | Tool Usage | Tool Streaming |
|----|----|----|----|----|








#### [Reasoning](#reasoning)




``` ts
import  from '@ai-sdk/cohere';import  from 'ai';
async function main()  = await generateText(,      },    },  });
  console.log(reasoning);  console.log(text);}
main().catch(console.error);
```


## [Embedding Models](#embedding-models)




``` ts
const model = cohere.textEmbedding('embed-english-v3.0');
```


You can use Cohere embedding models to generate embeddings with the `embed` function:



``` ts
import  from '@ai-sdk/cohere';import  from 'ai';
const  = await embed(,  },});
```


Cohere embedding models support additional provider options that can be passed via `providerOptions.cohere`:



``` ts
import  from '@ai-sdk/cohere';import  from 'ai';
const  = await embed(,  },});
```


The following provider options are available:

- **inputType** *'search_document' \| 'search_query' \| 'classification' \| 'clustering'*

  Specifies the type of input passed to the model. Default is `search_query`.

  - `search_document`: Used for embeddings stored in a vector database for search use-cases.
  - `search_query`: Used for embeddings of search queries run against a vector DB to find relevant documents.
  - `classification`: Used for embeddings passed through a text classifier.
  - `clustering`: Used for embeddings run through a clustering algorithm.

- **truncate** *'NONE' \| 'START' \| 'END'*

  Specifies how the API will handle inputs longer than the maximum token length. Default is `END`.

  - `NONE`: If selected, when the input exceeds the maximum input token length will return an error.
  - `START`: Will discard the start of the input until the remaining input is exactly the maximum input token length for the model.
  - `END`: Will discard the end of the input until the remaining input is exactly the maximum input token length for the model.

### [Model Capabilities](#model-capabilities-1)


| Model                           | Embedding Dimensions |
|---------------------------------|----------------------|
| `embed-english-v3.0`            | 1024                 |
| `embed-multilingual-v3.0`       | 1024                 |
| `embed-english-light-v3.0`      | 384                  |
| `embed-multilingual-light-v3.0` | 384                  |
| `embed-english-v2.0`            | 4096                 |
| `embed-english-light-v2.0`      | 1024                 |
| `embed-multilingual-v2.0`       | 768                  |

















On this page











































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.