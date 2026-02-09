AI SDK 5 is available now.










Menu






















































































































































































































































































































































































































































































# [Mistral AI Provider](#mistral-ai-provider)


## [Setup](#setup)

The Mistral provider is available in the `@ai-sdk/mistral` module. You can install it with






pnpm







npm







yarn







bun








``` geist-overflow-scroll-y
pnpm add @ai-sdk/mistral
```












## [Provider Instance](#provider-instance)

You can import the default provider instance `mistral` from `@ai-sdk/mistral`:



``` ts
import  from '@ai-sdk/mistral';
```


If you need a customized setup, you can import `createMistral` from `@ai-sdk/mistral` and create a provider instance with your settings:



``` ts
import  from '@ai-sdk/mistral';
const mistral = createMistral();
```


You can use the following optional settings to customize the Mistral provider instance:

- **baseURL** *string*

  Use a different URL prefix for API calls, e.g. to use proxy servers. The default prefix is `https://api.mistral.ai/v1`.

- **apiKey** *string*

  API key that is being sent using the `Authorization` header. It defaults to the `MISTRAL_API_KEY` environment variable.

- **headers** *Record\<string,string\>*

  Custom headers to include in the requests.

- **fetch** *(input: RequestInfo, init?: RequestInit) =\> Promise\<Response\>*


## [Language Models](#language-models)




``` ts
const model = mistral('mistral-large-latest');
```


Mistral chat models also support additional model settings that are not part of the [standard call settings](../../docs/ai-sdk-core/settings.html). You can pass them as an options argument and utilize `MistralLanguageModelOptions` for typing:



``` ts
import  from '@ai-sdk/mistral';const model = mistral('mistral-large-latest');
await generateText( satisfies MistralLanguageModelOptions,  },});
```


The following optional provider options are available for Mistral models:

- **safePrompt** *boolean*

  Whether to inject a safety prompt before all conversations.

  Defaults to `false`.

- **documentImageLimit** *number*

  Maximum number of images to process in a document.

- **documentPageLimit** *number*

  Maximum number of pages to process in a document.

- **strictJsonSchema** *boolean*


  Defaults to `false`.

- **structuredOutputs** *boolean*

  Whether to use [structured outputs](#structured-outputs). When enabled, tool calls and object generation will be strict and follow the provided schema.

  Defaults to `true`.

- **parallelToolCalls** *boolean*

  Whether to enable parallel function calling during tool use. When set to false, the model will use at most one tool per response.

  Defaults to `true`.

### [Document OCR](#document-ocr)

Mistral chat models support document OCR for PDF files. You can optionally set image and page limits using the provider options.



``` ts
const result = await generateText(,        ,      ],    },  ],  // optional settings:  providerOptions: ,  },});
```


### [Reasoning Models](#reasoning-models)

Mistral offers reasoning models that provide step-by-step thinking capabilities:

- **magistral-small-2506**: Smaller reasoning model for efficient step-by-step thinking
- **magistral-medium-2506**: More powerful reasoning model balancing performance and cost

These models return content that includes `<think>...</think>` tags containing the reasoning process. To properly extract and separate the reasoning from the final answer, use the [extract reasoning middleware](../../docs/reference/ai-sdk-core/extract-reasoning-middleware.html):



``` ts
import  from '@ai-sdk/mistral';import  from 'ai';
const result = await generateText(),  }),  prompt: 'What is 15 * 24?',});
console.log('REASONING:', result.reasoningText);// Output: "Let me calculate this step by step..."
console.log('ANSWER:', result.text);// Output: "360"
```


The middleware automatically parses the `<think>` tags and provides separate `reasoningText` and `text` properties in the result.

### [Example](#example)

You can use Mistral language models to generate text with the `generateText` function:



``` ts
import  from '@ai-sdk/mistral';import  from 'ai';
const  = await generateText();
```


Mistral language models can also be used in the `streamText`, `generateObject`, and `streamObject` functions (see [AI SDK Core](../../docs/ai-sdk-core.html)).

#### [Structured Outputs](#structured-outputs)

Mistral chat models support structured outputs using JSON Schema. You can use `generateObject` or `streamObject` with Zod, Valibot, or raw JSON Schema. The SDK sends your schema via Mistral's `response_format: `.



``` ts
import  from '@ai-sdk/mistral';import  from 'ai';import  from 'zod';
const result = await generateObject(),  }),  prompt: 'Generate a simple pasta recipe.',});
console.log(JSON.stringify(result.object, null, 2));
```


You can enable strict JSON Schema validation using a provider option:



``` ts
import  from '@ai-sdk/mistral';import  from 'ai';import  from 'zod';
const result = await generateObject(,  },  schema: z.object()),  }),  prompt: 'Generate a small shopping list.',});
```





When using structured outputs, the SDK no longer injects an extra "answer with JSON" instruction. It relies on Mistral's native `json_schema`/`json_object` response formats instead. You can customize the schema name/description via the standard structured-output APIs.



### [Model Capabilities](#model-capabilities)


| Model | Image Input | Object Generation | Tool Usage | Tool Streaming |
|----|----|----|----|----|








## [Embedding Models](#embedding-models)




``` ts
const model = mistral.textEmbedding('mistral-embed');
```


You can use Mistral embedding models to generate embeddings with the `embed` function:



``` ts
import  from '@ai-sdk/mistral';import  from 'ai';
const  = await embed();
```


### [Model Capabilities](#model-capabilities-1)


| Model           | Default Dimensions |
|-----------------|--------------------|
| `mistral-embed` | 1024               |

















On this page

















































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.