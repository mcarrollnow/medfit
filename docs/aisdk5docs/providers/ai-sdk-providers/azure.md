AI SDK 5 is available now.










Menu






















































































































































































































































































































































































































































































# [Azure OpenAI Provider](#azure-openai-provider)


## [Setup](#setup)

The Azure OpenAI provider is available in the `@ai-sdk/azure` module. You can install it with






pnpm







npm







yarn







bun








``` geist-overflow-scroll-y
pnpm add @ai-sdk/azure
```












## [Provider Instance](#provider-instance)

You can import the default provider instance `azure` from `@ai-sdk/azure`:



``` ts
import  from '@ai-sdk/azure';
```


If you need a customized setup, you can import `createAzure` from `@ai-sdk/azure` and create a provider instance with your settings:



``` ts
import  from '@ai-sdk/azure';
const azure = createAzure();
```


You can use the following optional settings to customize the OpenAI provider instance:

- **resourceName** *string*

  Azure resource name. It defaults to the `AZURE_RESOURCE_NAME` environment variable.

  The resource name is used in the assembled URL: `https://.openai.azure.com/openai/v1`. You can use `baseURL` instead to specify the URL prefix.

- **apiKey** *string*

  API key that is being sent using the `api-key` header. It defaults to the `AZURE_API_KEY` environment variable.

- **apiVersion** *string*


- **baseURL** *string*

  Use a different URL prefix for API calls, e.g. to use proxy servers.

  Either this or `resourceName` can be used. When a baseURL is provided, the resourceName is ignored.

  With a baseURL, the resolved URL is `/v1`.

- **headers** *Record\<string,string\>*

  Custom headers to include in the requests.

- **fetch** *(input: RequestInfo, init?: RequestInit) =\> Promise\<Response\>*


- **useDeploymentBasedUrls** *boolean*

  Use deployment-based URLs for API calls. Set to `true` to use the legacy deployment format: `/deployments/?api-version=` instead of `/v1?api-version=`. Defaults to `false`.

  This option is useful for compatibility with certain Azure OpenAI models or deployments that require the legacy endpoint format.

## [Language Models](#language-models)

The Azure OpenAI provider instance is a function that you can invoke to create a language model:



``` ts
const model = azure('your-deployment-name');
```


You need to pass your deployment name as the first argument.

### [Reasoning Models](#reasoning-models)

Azure exposes the thinking of `DeepSeek-R1` in the generated text using the `<think>` tag. You can use the `extractReasoningMiddleware` to extract this reasoning and expose it as a `reasoning` property on the result:



``` ts
import  from '@ai-sdk/azure';import  from 'ai';
const enhancedModel = wrapLanguageModel(),});
```


You can then use that enhanced model in functions like `generateText` and `streamText`.

### [Example](#example)

You can use OpenAI language models to generate text with the `generateText` function:



``` ts
import  from '@ai-sdk/azure';import  from 'ai';
const  = await generateText();
```


OpenAI language models can also be used in the `streamText`, `generateObject`, and `streamObject` functions (see [AI SDK Core](../../docs/ai-sdk-core.html)).




Azure OpenAI sends larger chunks than OpenAI. This can lead to the perception that the response is slower. See [Troubleshooting: Azure OpenAI Slow To Stream](../../docs/troubleshooting/azure-stream-slow.html)



### [Provider Options](#provider-options)

When using OpenAI language models on Azure, you can configure provider-specific options using `providerOptions.openai`. More information on available configuration options are on [the OpenAI provider page](openai.html#language-models).



``` ts
const messages = [  ,      ,        },      },    ],  },];
const  = await generateText(,  },});
```


### [Chat Models](#chat-models)




The URL for calling Azure chat models will be constructed as follows: `https://RESOURCE_NAME.openai.azure.com/openai/v1/chat/completions?api-version=v1`



Azure OpenAI chat models support also some model specific settings that are not part of the [standard call settings](../../docs/ai-sdk-core/settings.html). You can pass them as an options argument:



``` ts
import  from '@ai-sdk/azure';import  from 'ai';
const result = await generateText(,      user: 'test-user', // optional unique user identifier    },  },});
```


The following optional provider options are available for OpenAI chat models:

- **logitBias** *Record\<number, number\>*

  Modifies the likelihood of specified tokens appearing in the completion.

  Accepts a JSON object that maps tokens (specified by their token ID in the GPT tokenizer) to an associated bias value from -100 to 100. You can use this tokenizer tool to convert text to token IDs. Mathematically, the bias is added to the logits generated by the model prior to sampling. The exact effect will vary per model, but values between -1 and 1 should decrease or increase likelihood of selection; values like -100 or 100 should result in a ban or exclusive selection of the relevant token.

  As an example, you can pass `` to prevent the token from being generated.

- **logprobs** *boolean \| number*

  Return the log probabilities of the tokens. Including logprobs will increase the response size and can slow down response times. However, it can be useful to better understand how the model is behaving.

  Setting to true will return the log probabilities of the tokens that were generated.

  Setting to a number will return the log probabilities of the top n tokens that were generated.

- **parallelToolCalls** *boolean*

  Whether to enable parallel function calling during tool use. Default to true.

- **user** *string*

  A unique identifier representing your end-user, which can help OpenAI to monitor and detect abuse. Learn more.

### [Responses Models](#responses-models)

You can use the Azure OpenAI responses API with the `azure.responses(deploymentName)` factory method.



``` ts
const model = azure.responses('your-deployment-name');
```


Further configuration can be done using OpenAI provider options. You can validate the provider options using the `OpenAIResponsesProviderOptions` type.



``` ts
import  from '@ai-sdk/azure';import  from 'ai';
const result = await generateText( satisfies OpenAIResponsesProviderOptions,  },  // ...});
```


The following provider options are available:

- **parallelToolCalls** *boolean* Whether to use parallel tool calls. Defaults to `true`.

- **store** *boolean* Whether to store the generation. Defaults to `true`.

- **metadata** *Record\<string, string\>* Additional metadata to store with the generation.

- **previousResponseId** *string* The ID of the previous response. You can use it to continue a conversation. Defaults to `undefined`.

- **instructions** *string* Instructions for the model. They can be used to change the system or developer message when continuing a conversation using the `previousResponseId` option. Defaults to `undefined`.

- **user** *string* A unique identifier representing your end-user, which can help OpenAI to monitor and detect abuse. Defaults to `undefined`.

- **reasoningEffort** *'low' \| 'medium' \| 'high'* Reasoning effort for reasoning models. Defaults to `medium`. If you use `providerOptions` to set the `reasoningEffort` option, this model setting will be ignored.

- **strictJsonSchema** *boolean* Whether to use strict JSON schema validation. Defaults to `false`.

The Azure OpenAI responses provider also returns provider-specific metadata:



``` ts
const  = await generateText();
const openaiMetadata = providerMetadata?.openai;
```


The following OpenAI-specific metadata is returned:

- **responseId** *string* The ID of the response. Can be used to continue a conversation.

- **cachedPromptTokens** *number* The number of prompt tokens that were a cache hit.

- **reasoningTokens** *number* The number of reasoning tokens that the model generated.

#### [File Search Tool](#file-search-tool)

The Azure OpenAI responses API supports file search through the `azure.tools.fileSearch` tool.

You can force the use of the file search tool by setting the `toolChoice` parameter to ``.



``` ts
const result = await generateText(,    }),  },  // Force file search tool:  toolChoice: ,});
```





The tool must be named `file_search` when using Azure OpenAI's file search functionality. This name is required by Azure OpenAI's API specification and cannot be customized.



#### [Image Generation Tool](#image-generation-tool)







Azure OpenAI's Responses API supports multi-modal image generation as a provider-defined tool. Availability is restricted to specific models (for example, `gpt-5` variants).

You can use the image tool with `generateText`.



``` ts
import  from '@ai-sdk/azure';import  from 'ai';
const azure = createAzure(,});
const result = await generateText(),  },});
for (const toolResult of result.staticToolResults) }
```





To use image_generation, you must first create an image generation model. You must add a deployment specification to the header `x-ms-oai-image-generation-deployment`. Please note that the Responses API model and the image generation model must be in the same resource.






When you set `store: false`, then previously generated images will not be accessible by the model. We recommend using the image generation tool without setting `store: false`.



#### [Code Interpreter Tool](#code-interpreter-tool)

The Azure OpenAI responses API supports the code interpreter tool through the `azure.tools.codeInterpreter` tool. This allows models to write and execute Python code.



``` ts
import  from '@ai-sdk/azure';import  from 'ai';
const result = await generateText(,    }),  },});
```


The code interpreter tool can be configured with:

- **container**: Either a container ID string or an object with `fileIds` to specify uploaded files that should be available to the code interpreter




The tool must be named `code_interpreter` when using Azure OpenAI's code interpreter functionality. This name is required by Azure OpenAI's API specification and cannot be customized.



#### [PDF support](#pdf-support)

The Azure OpenAI Responses API supports reading PDF files. You can pass PDF files as part of the message content using the `file` type:



``` ts
const result = await generateText(,        ,      ],    },  ],});
```


The model will have access to the contents of the PDF file and respond to questions about it. The PDF file should be passed using the `data` field, and the `mediaType` should be set to `'application/pdf'`.

### [Completion Models](#completion-models)

You can create models that call the completions API using the `.completion()` factory method. The first argument is the model id. Currently only `gpt-35-turbo-instruct` is supported.



``` ts
const model = azure.completion('your-gpt-35-turbo-instruct-deployment');
```


OpenAI completion models support also some model specific settings that are not part of the [standard call settings](../../docs/ai-sdk-core/settings.html). You can pass them as an options argument:



``` ts
import  from '@ai-sdk/azure';import  from 'ai';
const result = await generateText(,      suffix: 'some text', // optional suffix that comes after a completion of inserted text      user: 'test-user', // optional unique user identifier    },  },});
```


The following optional provider options are available for Azure OpenAI completion models:

- **echo**: *boolean*

  Echo back the prompt in addition to the completion.

- **logitBias** *Record\<number, number\>*

  Modifies the likelihood of specified tokens appearing in the completion.

  Accepts a JSON object that maps tokens (specified by their token ID in the GPT tokenizer) to an associated bias value from -100 to 100. You can use this tokenizer tool to convert text to token IDs. Mathematically, the bias is added to the logits generated by the model prior to sampling. The exact effect will vary per model, but values between -1 and 1 should decrease or increase likelihood of selection; values like -100 or 100 should result in a ban or exclusive selection of the relevant token.

  As an example, you can pass `` to prevent the \<\|endoftext\|\> token from being generated.

- **logprobs** *boolean \| number*

  Return the log probabilities of the tokens. Including logprobs will increase the response size and can slow down response times. However, it can be useful to better understand how the model is behaving.

  Setting to true will return the log probabilities of the tokens that were generated.

  Setting to a number will return the log probabilities of the top n tokens that were generated.

- **suffix** *string*

  The suffix that comes after a completion of inserted text.

- **user** *string*

  A unique identifier representing your end-user, which can help OpenAI to monitor and detect abuse. Learn more.

## [Embedding Models](#embedding-models)

You can create models that call the Azure OpenAI embeddings API using the `.textEmbedding()` factory method.



``` ts
const model = azure.textEmbedding('your-embedding-deployment');
```


Azure OpenAI embedding models support several additional settings. You can pass them as an options argument:



``` ts
import  from '@ai-sdk/azure';import  from 'ai';
const  = await embed(,  },});
```


The following optional provider options are available for Azure OpenAI embedding models:

- **dimensions**: *number*

  The number of dimensions the resulting output embeddings should have. Only supported in text-embedding-3 and later models.

- **user** *string*

  A unique identifier representing your end-user, which can help OpenAI to monitor and detect abuse. Learn more.

## [Image Models](#image-models)

You can create models that call the Azure OpenAI image generation API (DALL-E) using the `.image()` factory method. The first argument is your deployment name for the DALL-E model.



``` ts
const model = azure.image('your-dalle-deployment-name');
```


Azure OpenAI image models support several additional settings. You can pass them as `providerOptions.openai` when generating the image:



``` ts
await generateImage(,  },});
```


### [Example](#example-1)

You can use Azure OpenAI image models to generate images with the `generateImage` function:



``` ts
import  from '@ai-sdk/azure';import  from 'ai';
const  = await generateImage();
// image contains the URL or base64 data of the generated imageconsole.log(image);
```


### [Model Capabilities](#model-capabilities)

Azure OpenAI supports DALL-E 2 and DALL-E 3 models through deployments. The capabilities depend on which model version your deployment is using:


| Model Version | Sizes                           |
|---------------|---------------------------------|
| DALL-E 3      | 1024x1024, 1792x1024, 1024x1792 |
| DALL-E 2      | 256x256, 512x512, 1024x1024     |





DALL-E models do not support the `aspectRatio` parameter. Use the `size` parameter instead.






When creating your Azure OpenAI deployment, make sure to set the DALL-E model version you want to use.



## [Transcription Models](#transcription-models)

You can create models that call the Azure OpenAI transcription API using the `.transcription()` factory method.

The first argument is the model id e.g. `whisper-1`.



``` ts
const model = azure.transcription('whisper-1');
```





If you encounter a "DeploymentNotFound" error with transcription models, try enabling deployment-based URLs:



``` ts
const azure = createAzure();
```


This uses the legacy endpoint format which may be required for certain Azure OpenAI deployments. When using useDeploymentBasedUrls, the default api-version is not valid. You must set it to `2025-04-01-preview` or an earlier value.



You can also pass additional provider-specific options using the `providerOptions` argument. For example, supplying the input language in ISO-639-1 (e.g. `en`) format will improve accuracy and latency.



``` ts
import  from 'ai';import  from '@ai-sdk/azure';import  from 'fs/promises';
const result = await transcribe( },});
```


The following provider options are available:

- **timestampGranularities** *string\[\]* The granularity of the timestamps in the transcription. Defaults to `['segment']`. Possible values are `['word']`, `['segment']`, and `['word', 'segment']`. Note: There is no additional latency for segment timestamps, but generating word timestamps incurs additional latency.

- **language** *string* The language of the input audio. Supplying the input language in ISO-639-1 format (e.g. 'en') will improve accuracy and latency. Optional.

- **prompt** *string* An optional text to guide the model's style or continue a previous audio segment. The prompt should match the audio language. Optional.

- **temperature** *number* The sampling temperature, between 0 and 1. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic. If set to 0, the model will use log probability to automatically increase the temperature until certain thresholds are hit. Defaults to 0. Optional.

- **include** *string\[\]* Additional information to include in the transcription response.

### [Model Capabilities](#model-capabilities-1)


| Model | Transcription | Duration | Segments | Language |
|----|----|----|----|----|

















On this page














































































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.