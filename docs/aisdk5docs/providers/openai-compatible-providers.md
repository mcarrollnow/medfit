AI SDK 5 is available now.










Menu














































































































































































































































































































































































































































































OpenAI Compatible Providers










# [OpenAI Compatible Providers](#openai-compatible-providers)


Below we focus on the general setup and provider instance creation. You can also [write a custom provider package leveraging the OpenAI Compatible package](openai-compatible-providers/custom-providers.html).

We provide detailed documentation for the following OpenAI compatible providers:

- [LM Studio](openai-compatible-providers/lmstudio.html)
- [NIM](openai-compatible-providers/nim.html)
- [Heroku](openai-compatible-providers/heroku.html)

The general setup and provider instance creation is the same for all of these providers.

## [Setup](#setup)

The OpenAI Compatible provider is available via the `@ai-sdk/openai-compatible` module. You can install it with:






pnpm







npm







yarn







bun








``` geist-overflow-scroll-y
pnpm add @ai-sdk/openai-compatible
```












## [Provider Instance](#provider-instance)

To use an OpenAI compatible provider, you can create a custom provider instance with the `createOpenAICompatible` function from `@ai-sdk/openai-compatible`:



``` ts
import  from '@ai-sdk/openai-compatible';
const provider = createOpenAICompatible();
```


You can use the following optional settings to customize the provider instance:

- **baseURL** *string*

  Set the URL prefix for API calls.

- **apiKey** *string*

  API key for authenticating requests. If specified, adds an `Authorization` header to request headers with the value `Bearer <apiKey>`. This will be added before any headers potentially specified in the `headers` option.

- **headers** *Record\<string,string\>*

  Optional custom headers to include in requests. These will be added to request headers after any headers potentially added by use of the `apiKey` option.

- **queryParams** *Record\<string,string\>*

  Optional custom url query parameters to include in request urls.

- **fetch** *(input: RequestInfo, init?: RequestInit) =\> Promise\<Response\>*


- **includeUsage** *boolean*

  Include usage information in streaming responses. When enabled, usage data will be included in the response metadata for streaming requests. Defaults to `undefined` (`false`).

- **supportsStructuredOutputs** *boolean*

  Set to true if the provider supports structured outputs. Only relevant for `provider()`, `provider.chatModel()`, and `provider.languageModel()`.

## [Language Models](#language-models)

You can create provider models using a provider instance. The first argument is the model id, e.g. `model-id`.



``` ts
const model = provider('model-id');
```


### [Example](#example)

You can use provider language models to generate text with the `generateText` function:



``` ts
import  from '@ai-sdk/openai-compatible';import  from 'ai';
const provider = createOpenAICompatible();
const  = await generateText();
```


### [Including model ids for auto-completion](#including-model-ids-for-auto-completion)



``` ts
import  from '@ai-sdk/openai-compatible';import  from 'ai';
type ExampleChatModelIds =  | 'meta-llama/Llama-3-70b-chat-hf'  | 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo'  | (string & );
type ExampleCompletionModelIds =  | 'codellama/CodeLlama-34b-Instruct-hf'  | 'Qwen/Qwen2.5-Coder-32B-Instruct'  | (string & );
type ExampleEmbeddingModelIds =  | 'BAAI/bge-large-en-v1.5'  | 'bert-base-uncased'  | (string & );
const model = createOpenAICompatible<  ExampleChatModelIds,  ExampleCompletionModelIds,  ExampleEmbeddingModelIds>();
// Subsequent calls to e.g. `model.chatModel` will auto-complete the model id// from the list of `ExampleChatModelIds` while still allowing free-form// strings as well.
const  = await generateText();
```


### [Custom query parameters](#custom-query-parameters)


You can set these via the optional `queryParams` provider setting. These will be added to all requests made by the provider.



``` ts
import  from '@ai-sdk/openai-compatible';
const provider = createOpenAICompatible(,});
```


For example, with the above configuration, API requests would include the query parameter in the URL like: `https://api.provider.com/v1/chat/completions?api-version=1.0.0`.

## [Provider-specific options](#provider-specific-options)

The OpenAI Compatible provider supports adding provider-specific options to the request body. These are specified with the `providerOptions` field in the request body.

For example, if you create a provider instance with the name `provider-name`, you can add a `custom-option` field to the request body like this:



``` ts
const provider = createOpenAICompatible();
const  = await generateText(,  },});
```


The request body sent to the provider will include the `customOption` field with the value `magic-value`. This gives you an easy way to add provider-specific options to requests without having to modify the provider or AI SDK code.


The OpenAI Compatible provider supports extracting provider-specific metadata from API responses through metadata extractors. These extractors allow you to capture additional information returned by the provider beyond the standard response format.

Metadata extractors receive the raw, unprocessed response data from the provider, giving you complete flexibility to extract any custom fields or experimental features that the provider may include. This is particularly useful when:

- Working with providers that include non-standard response fields
- Experimenting with beta or preview features
- Capturing provider-specific metrics or debugging information
- Supporting rapid provider API evolution without SDK changes

Metadata extractors work with both streaming and non-streaming chat completions and consist of two main components:

1.  A function to extract metadata from complete responses
2.  A streaming extractor that can accumulate metadata across chunks in a streaming response

Here's an example metadata extractor that captures both standard and custom provider data:



``` typescript
const myMetadataExtractor: MetadataExtractor = ) => ,      },    };  },
  // Process streaming responses  createStreamExtractor: () => ,    };
    return         if (parsedChunk.custom_data)       },      // Build final metadata from accumulated data      buildMetadata: () => (,      }),    };  },};
```


You can provide a metadata extractor when creating your provider instance:



``` typescript
const provider = createOpenAICompatible();
```


The extracted metadata will be included in the response under the `providerMetadata` field:



``` typescript
const  = await generateText();
console.log(providerMetadata.myProvider.customMetric);
```


This allows you to access provider-specific information while maintaining a consistent interface across different providers.
















On this page







































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.