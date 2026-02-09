AI SDK 5 is available now.










Menu






















































































































































































































































































































































































































































































# [OpenAI Provider](#openai-provider)


## [Setup](#setup)

The OpenAI provider is available in the `@ai-sdk/openai` module. You can install it with






pnpm







npm







yarn







bun








``` geist-overflow-scroll-y
pnpm add @ai-sdk/openai
```












## [Provider Instance](#provider-instance)

You can import the default provider instance `openai` from `@ai-sdk/openai`:



``` ts
import  from '@ai-sdk/openai';
```


If you need a customized setup, you can import `createOpenAI` from `@ai-sdk/openai` and create a provider instance with your settings:



``` ts
import  from '@ai-sdk/openai';
const openai = createOpenAI(,});
```


You can use the following optional settings to customize the OpenAI provider instance:

- **baseURL** *string*

  Use a different URL prefix for API calls, e.g. to use proxy servers. The default prefix is `https://api.openai.com/v1`.

- **apiKey** *string*

  API key that is being sent using the `Authorization` header. It defaults to the `OPENAI_API_KEY` environment variable.

- **name** *string*

  The provider name. You can set this when using OpenAI compatible providers to change the model provider property. Defaults to `openai`.

- **organization** *string*

  OpenAI Organization.

- **project** *string*

  OpenAI project.

- **headers** *Record\<string,string\>*

  Custom headers to include in the requests.

- **fetch** *(input: RequestInfo, init?: RequestInit) =\> Promise\<Response\>*


## [Language Models](#language-models)

The OpenAI provider instance is a function that you can invoke to create a language model:



``` ts
const model = openai('gpt-5');
```


It automatically selects the correct API based on the model id. You can also pass additional settings in the second argument:



``` ts
const model = openai('gpt-5', );
```


The available options depend on the API that's automatically chosen for the model (see below). If you want to explicitly select a specific model API, you can use `.responses`, `.chat`, or `.completion`.




Since AI SDK 5, the OpenAI responses API is called by default (unless you specify e.g. 'openai.chat')



### [Example](#example)

You can use OpenAI language models to generate text with the `generateText` function:



``` ts
import  from '@ai-sdk/openai';import  from 'ai';
const  = await generateText();
```


OpenAI language models can also be used in the `streamText`, `generateObject`, and `streamObject` functions (see [AI SDK Core](../../docs/ai-sdk-core.html)).

### [Responses Models](#responses-models)

You can use the OpenAI responses API with the `openai(modelId)` or `openai.responses(modelId)` factory methods. It is the default API that is used by the OpenAI provider (since AI SDK 5).



``` ts
const model = openai('gpt-5');
```


Further configuration can be done using OpenAI provider options. You can validate the provider options using the `OpenAIResponsesProviderOptions` type.



``` ts
import  from '@ai-sdk/openai';import  from 'ai';
const result = await generateText( satisfies OpenAIResponsesProviderOptions,  },  // ...});
```


The following provider options are available:

- **parallelToolCalls** *boolean* Whether to use parallel tool calls. Defaults to `true`.

- **store** *boolean*

  Whether to store the generation. Defaults to `true`.

- **maxToolCalls** *integer* The maximum number of total calls to built-in tools that can be processed in a response. This maximum number applies across all built-in tool calls, not per individual tool. Any further attempts to call a tool by the model will be ignored.

- **metadata** *Record\<string, string\>* Additional metadata to store with the generation.

- **previousResponseId** *string* The ID of the previous response. You can use it to continue a conversation. Defaults to `undefined`.

- **instructions** *string* Instructions for the model. They can be used to change the system or developer message when continuing a conversation using the `previousResponseId` option. Defaults to `undefined`.

- **user** *string* A unique identifier representing your end-user, which can help OpenAI to monitor and detect abuse. Defaults to `undefined`.

- **reasoningEffort** *'minimal' \| 'low' \| 'medium' \| 'high'* Reasoning effort for reasoning models. Defaults to `medium`. If you use `providerOptions` to set the `reasoningEffort` option, this model setting will be ignored.

- **reasoningSummary** *'auto' \| 'detailed'* Controls whether the model returns its reasoning process. Set to `'auto'` for a condensed summary, `'detailed'` for more comprehensive reasoning. Defaults to `undefined` (no reasoning summaries). When enabled, reasoning summaries appear in the stream as events with type `'reasoning'` and in non-streaming responses within the `reasoning` field.

- **strictJsonSchema** *boolean* Whether to use strict JSON schema validation. Defaults to `false`.

- **serviceTier** *'auto' \| 'flex' \| 'priority' \| 'default'* Service tier for the request. Set to 'flex' for 50% cheaper processing at the cost of increased latency (available for o3, o4-mini, and gpt-5 models). Set to 'priority' for faster processing with Enterprise access (available for gpt-4, gpt-5, gpt-5-mini, o3, o4-mini; gpt-5-nano is not supported).

  Defaults to 'auto'.

- **textVerbosity** *'low' \| 'medium' \| 'high'* Controls the verbosity of the model's response. Lower values result in more concise responses, while higher values result in more verbose responses. Defaults to `'medium'`.

- **include** *Array\<string\>* Specifies additional content to include in the response. Supported values: `['file_search_call.results']` for including file search results in responses. `['message.output_text.logprobs']` for logprobs. Defaults to `undefined`.

- **promptCacheKey** *string* A cache key for manual prompt caching control. Used by OpenAI to cache responses for similar requests to optimize your cache hit rates.

- **safetyIdentifier** *string* A stable identifier used to help detect users of your application that may be violating OpenAI's usage policies. The IDs should be a string that uniquely identifies each user.

The OpenAI responses provider also returns provider-specific metadata:



``` ts
const  = await generateText();
const openaiMetadata = providerMetadata?.openai;
```


The following OpenAI-specific metadata is returned:

- **responseId** *string* The ID of the response. Can be used to continue a conversation.

- **cachedPromptTokens** *number* The number of prompt tokens that were a cache hit.

- **reasoningTokens** *number* The number of reasoning tokens that the model generated.

#### [Reasoning Output](#reasoning-output)

For reasoning models like `gpt-5`, you can enable reasoning summaries to see the model's thought process. Different models support different summarizers—for example, `o4-mini` supports detailed summaries. Set `reasoningSummary: "auto"` to automatically receive the richest level available.



``` ts
import  from '@ai-sdk/openai';import  from 'ai';
const result = streamText(,  },});
for await (const part of result.fullStream) `);  } else if (part.type === 'text-delta') }
```


For non-streaming calls with `generateText`, the reasoning summaries are available in the `reasoning` field of the response:



``` ts
import  from '@ai-sdk/openai';import  from 'ai';
const result = await generateText(,  },});console.log('Reasoning:', result.reasoning);
```



#### [Verbosity Control](#verbosity-control)

You can control the length and detail of model responses using the `textVerbosity` parameter:



``` ts
import  from '@ai-sdk/openai';import  from 'ai';
const result = await generateText(,  },});
```


The `textVerbosity` parameter scales output length without changing the underlying prompt:

- `'low'`: Produces terse, minimal responses
- `'medium'`: Balanced detail (default)
- `'high'`: Verbose responses with comprehensive detail

#### [Web Search Tool](#web-search-tool)

The OpenAI responses API supports web search through the `openai.tools.webSearch` tool.



``` ts
const result = await generateText(,    }),  },  // Force web search tool (optional):  toolChoice: ,});
// URL sourcesconst sources = result.sources;
```


#### [File Search Tool](#file-search-tool)

The OpenAI responses API supports file search through the `openai.tools.fileSearch` tool.

You can force the use of the file search tool by setting the `toolChoice` parameter to ``.



``` ts
const result = await generateText(,      ranking: ,    }),  },  providerOptions:  satisfies OpenAIResponsesProviderOptions,  },});
```





The tool must be named `file_search` when using OpenAI's file search functionality. This name is required by OpenAI's API specification and cannot be customized.



#### [Image Generation Tool](#image-generation-tool)

OpenAI's Responses API supports multi-modal image generation as a provider-defined tool. Availability is restricted to specific models (for example, `gpt-5` variants).

You can use the image tool with either `generateText` or `streamText`:



``` ts
import  from '@ai-sdk/openai';import  from 'ai';
const result = await generateText(),  },});
for (const toolResult of result.staticToolResults) }
```




``` ts
import  from '@ai-sdk/openai';import  from 'ai';
const result = streamText(),  },});
for await (const part of result.fullStream) }
```





When you set `store: false`, then previously generated images will not be accessible by the model. We recommend using the image generation tool without setting `store: false`.



For complete details on model availability, image quality controls, supported sizes, and tool-specific parameters, refer to the OpenAI documentation:


#### [Code Interpreter Tool](#code-interpreter-tool)

The OpenAI responses API supports the code interpreter tool through the `openai.tools.codeInterpreter` tool. This allows models to write and execute Python code.



``` ts
import  from '@ai-sdk/openai';import  from 'ai';
const result = await generateText(,    }),  },});
```


The code interpreter tool can be configured with:

- **container**: Either a container ID string or an object with `fileIds` to specify uploaded files that should be available to the code interpreter




The tool must be named `code_interpreter` when using OpenAI's code interpreter functionality. This name is required by OpenAI's API specification and cannot be customized.



#### [Local Shell Tool](#local-shell-tool)

The OpenAI responses API support the local shell tool for Codex models through the `openai.tools.localShell` tool. Local shell is a tool that allows agents to run shell commands locally on a machine you or the user provides.



``` ts
import  from '@ai-sdk/openai';import  from 'ai';
const result = await generateText() => ;      },    }),  },  prompt: 'List the files in my home directory.',  stopWhen: stepCountIs(2),});
```





The tool must be named `local_shell`. This name is required by OpenAI's API specification and cannot be customized. The model can only be



#### [Image Inputs](#image-inputs)

The OpenAI Responses API supports Image inputs for appropriate models. You can pass Image files as part of the message content using the 'image' type:



``` ts
const result = await generateText(,        ,      ],    },  ],});
```


The model will have access to the image and will respond to questions about it. The image should be passed using the `image` field.

You can also pass a file-id from the OpenAI Files API.



``` ts

```


You can also pass the URL of an image.



``` ts

```


#### [PDF Inputs](#pdf-inputs)

The OpenAI Responses API supports reading PDF files. You can pass PDF files as part of the message content using the `file` type:



``` ts
const result = await generateText(,        ,      ],    },  ],});
```


You can also pass a file-id from the OpenAI Files API.



``` ts

```


You can also pass the URL of a pdf.



``` ts

```


The model will have access to the contents of the PDF file and respond to questions about it. The PDF file should be passed using the `data` field, and the `mediaType` should be set to `'application/pdf'`.

#### [Structured Outputs](#structured-outputs)

The OpenAI Responses API supports structured outputs. You can enforce structured outputs using `generateObject` or `streamObject`, which expose a `schema` option. Additionally, you can pass a Zod or JSON Schema object to the `experimental_output` option when using `generateText` or `streamText`.



``` ts
// Using generateObjectconst result = await generateObject(),      ),      steps: z.array(z.string()),    }),  }),  prompt: 'Generate a lasagna recipe.',});
// Using generateTextconst result = await generateText(),  }),});
```


### [Chat Models](#chat-models)




``` ts
const model = openai.chat('gpt-5');
```


OpenAI chat models support also some model specific provider options that are not part of the [standard call settings](../../docs/ai-sdk-core/settings.html). You can pass them in the `providerOptions` argument:



``` ts
import  from '@ai-sdk/openai';
const model = openai.chat('gpt-5');
await generateText(,      user: 'test-user', // optional unique user identifier    } satisfies OpenAIChatLanguageModelOptions,  },});
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

  Whether to enable parallel function calling during tool use. Defaults to `true`.

- **user** *string*


- **reasoningEffort** *'minimal' \| 'low' \| 'medium' \| 'high'*

  Reasoning effort for reasoning models. Defaults to `medium`. If you use `providerOptions` to set the `reasoningEffort` option, this model setting will be ignored.

- **structuredOutputs** *boolean*

  Whether to use structured outputs. Defaults to `true`.

  When enabled, tool calls and object generation will be strict and follow the provided schema.

- **maxCompletionTokens** *number*

  Maximum number of completion tokens to generate. Useful for reasoning models.

- **store** *boolean*

  Whether to enable persistence in Responses API.

- **metadata** *Record\<string, string\>*

  Metadata to associate with the request.

- **prediction** *Record\<string, any\>*

  Parameters for prediction mode.

- **serviceTier** *'auto' \| 'flex' \| 'priority' \| 'default'*

  Service tier for the request. Set to 'flex' for 50% cheaper processing at the cost of increased latency (available for o3, o4-mini, and gpt-5 models). Set to 'priority' for faster processing with Enterprise access (available for gpt-4, gpt-5, gpt-5-mini, o3, o4-mini; gpt-5-nano is not supported).

  Defaults to 'auto'.

- **strictJsonSchema** *boolean*

  Whether to use strict JSON schema validation. Defaults to `false`.

- **textVerbosity** *'low' \| 'medium' \| 'high'*

  Controls the verbosity of the model's responses. Lower values will result in more concise responses, while higher values will result in more verbose responses.

- **promptCacheKey** *string*

  A cache key for manual prompt caching control. Used by OpenAI to cache responses for similar requests to optimize your cache hit rates.

- **safetyIdentifier** *string*

  A stable identifier used to help detect users of your application that may be violating OpenAI's usage policies. The IDs should be a string that uniquely identifies each user.

#### [Reasoning](#reasoning)


Reasoning models currently only generate text, have several limitations, and are only supported using `generateText` and `streamText`.

They support additional settings and response metadata:

- You can use `providerOptions` to set

  - the `reasoningEffort` option (or alternatively the `reasoningEffort` model setting), which determines the amount of reasoning the model performs.

- You can use response `providerMetadata` to access the number of reasoning tokens that the model generated.



``` ts
import  from '@ai-sdk/openai';import  from 'ai';
const  = await generateText(,  },});
console.log(text);console.log('Usage:', );
```





System messages are automatically converted to OpenAI developer messages for reasoning models when supported.






Reasoning models require additional runtime inference to complete their reasoning phase before generating a response. This introduces longer latency compared to other models.






`maxOutputTokens` is automatically mapped to `max_completion_tokens` for reasoning models.



#### [Structured Outputs](#structured-outputs-1)

Structured outputs are enabled by default. You can disable them by setting the `structuredOutputs` option to `false`.



``` ts
import  from '@ai-sdk/openai';import  from 'ai';import  from 'zod';
const result = await generateObject(,  },  schemaName: 'recipe',  schemaDescription: 'A recipe for lasagna.',  schema: z.object(),    ),    steps: z.array(z.string()),  }),  prompt: 'Generate a lasagna recipe.',});
console.log(JSON.stringify(result.object, null, 2));
```






For example, optional schema properties are not supported. You need to change Zod `.nullish()` and `.optional()` to `.nullable()`.



#### [Logprobs](#logprobs)

OpenAI provides logprobs information for completion/chat models. You can access it in the `providerMetadata` object.



``` ts
import  from '@ai-sdk/openai';import  from 'ai';
const result = await generateText(,  },});
const openaiMetadata = (await result.providerMetadata)?.openai;
const logprobs = openaiMetadata?.logprobs;
```


#### [Image Support](#image-support)

The OpenAI Chat API supports Image inputs for appropriate models. You can pass Image files as part of the message content using the 'image' type:



``` ts
const result = await generateText(,        ,      ],    },  ],});
```


The model will have access to the image and will respond to questions about it. The image should be passed using the `image` field.

You can also pass the URL of an image.



``` ts

```


#### [PDF support](#pdf-support)

The OpenAI Chat API supports reading PDF files. You can pass PDF files as part of the message content using the `file` type:



``` ts
const result = await generateText(,        ,      ],    },  ],});
```


The model will have access to the contents of the PDF file and respond to questions about it. The PDF file should be passed using the `data` field, and the `mediaType` should be set to `'application/pdf'`.

You can also pass a file-id from the OpenAI Files API.



``` ts

```


You can also pass the URL of a PDF.



``` ts

```


#### [Predicted Outputs](#predicted-outputs)




``` ts
const result = streamText(,    ,  ],  providerOptions: ,    },  },});
```


OpenAI provides usage information for predicted outputs (`acceptedPredictionTokens` and `rejectedPredictionTokens`). You can access it in the `providerMetadata` object.



``` ts
const openaiMetadata = (await result.providerMetadata)?.openai;
const acceptedPredictionTokens = openaiMetadata?.acceptedPredictionTokens;const rejectedPredictionTokens = openaiMetadata?.rejectedPredictionTokens;
```








#### [Image Detail](#image-detail)




``` ts
const result = await generateText(,        ,          },        },      ],    },  ],});
```





Because the `UIMessage` type (used by AI SDK UI hooks like `useChat`) does not support the `providerOptions` property, you can use `convertToModelMessages` first before passing the messages to functions like `generateText` or `streamText`. For more details on `providerOptions` usage, see [here](../../docs/foundations/prompts.html#provider-options).



#### [Distillation](#distillation)

OpenAI supports model distillation for some models. If you want to store a generation for use in the distillation process, you can add the `store` option to the `providerOptions.openai` object. This will save the generation to the OpenAI platform for later use in distillation.



``` typescript
import  from '@ai-sdk/openai';import  from 'ai';import 'dotenv/config';
async function main()  = await generateText(,      },    },  });
  console.log(text);  console.log();  console.log('Usage:', usage);}
main().catch(console.error);
```


#### [Prompt Caching](#prompt-caching)


- Prompt caching is automatically enabled for these models, when the prompt is 1024 tokens or longer. It does not need to be explicitly enabled.
- You can use response `providerMetadata` to access the number of prompt tokens that were a cache hit.
- Note that caching behavior is dependent on load on OpenAI's infrastructure. Prompt prefixes generally remain in the cache following 5-10 minutes of inactivity before they are evicted, but during off-peak periods they may persist for up to an hour.



``` ts
import  from '@ai-sdk/openai';import  from 'ai';
const  = await generateText();
console.log(`usage:`, );
```


To improve cache hit rates, you can manually control caching using the `promptCacheKey` option:



``` ts
import  from '@ai-sdk/openai';import  from 'ai';
const  = await generateText(,  },});
console.log(`usage:`, );
```


#### [Audio Input](#audio-input)

With the `gpt-4o-audio-preview` model, you can pass audio files to the model.




The `gpt-4o-audio-preview` model is currently in preview and requires at least some audio inputs. It will not work with non-audio data.





``` ts
import  from '@ai-sdk/openai';import  from 'ai';
const result = await generateText(,        ,      ],    },  ],});
```


### [Completion Models](#completion-models)




``` ts
const model = openai.completion('gpt-3.5-turbo-instruct');
```


OpenAI completion models support also some model specific settings that are not part of the [standard call settings](../../docs/ai-sdk-core/settings.html). You can pass them as an options argument:



``` ts
const model = openai.completion('gpt-3.5-turbo-instruct');
await model.doGenerate(,      suffix: 'some text', // optional suffix that comes after a completion of inserted text      user: 'test-user', // optional unique user identifier    },  },});
```


The following optional provider options are available for OpenAI completion models:

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


### [Model Capabilities](#model-capabilities)


| Model | Image Input | Audio Input | Object Generation | Tool Usage |
|----|----|----|----|----|








## [Embedding Models](#embedding-models)




``` ts
const model = openai.textEmbedding('text-embedding-3-large');
```


OpenAI embedding models support several additional provider options. You can pass them as an options argument:



``` ts
import  from '@ai-sdk/openai';import  from 'ai';
const  = await embed(,  },});
```


The following optional provider options are available for OpenAI embedding models:

- **dimensions**: *number*

  The number of dimensions the resulting output embeddings should have. Only supported in text-embedding-3 and later models.

- **user** *string*


### [Model Capabilities](#model-capabilities-1)


| Model | Default Dimensions | Custom Dimensions |
|----|----|----|


## [Image Models](#image-models)




``` ts
const model = openai.image('dall-e-3');
```





Dall-E models do not support the `aspectRatio` parameter. Use the `size` parameter instead.



### [Model Capabilities](#model-capabilities-2)


| Model              | Sizes                           |
|--------------------|---------------------------------|
| `gpt-image-1-mini` | 1024x1024, 1536x1024, 1024x1536 |
| `gpt-image-1`      | 1024x1024, 1536x1024, 1024x1536 |
| `dall-e-3`         | 1024x1024, 1792x1024, 1024x1792 |
| `dall-e-2`         | 256x256, 512x512, 1024x1024     |


You can pass optional `providerOptions` to the image model. These are prone to change by OpenAI and are model dependent. For example, the `gpt-image-1` model supports the `quality` option:



``` ts
const  = await generateImage(,  },});
```


For more on `generateImage()` see [Image Generation](../../docs/ai-sdk-core/image-generation.html).

OpenAI's image models may return a revised prompt for each image. It can be access at `providerMetadata.openai.images[0]?.revisedPrompt`.


## [Transcription Models](#transcription-models)


The first argument is the model id e.g. `whisper-1`.



``` ts
const model = openai.transcription('whisper-1');
```


You can also pass additional provider-specific options using the `providerOptions` argument. For example, supplying the input language in ISO-639-1 (e.g. `en`) format will improve accuracy and latency.



``` ts
import  from 'ai';import  from '@ai-sdk/openai';
const result = await transcribe( },});
```


To get word-level timestamps, specify the granularity:



``` ts
import  from 'ai';import  from '@ai-sdk/openai';
const result = await transcribe(,  },});
// Access word-level timestampsconsole.log(result.segments); // Array of segments with startSecond/endSecond
```


The following provider options are available:

- **timestampGranularities** *string\[\]* The granularity of the timestamps in the transcription. Defaults to `['segment']`. Possible values are `['word']`, `['segment']`, and `['word', 'segment']`. Note: There is no additional latency for segment timestamps, but generating word timestamps incurs additional latency.

- **language** *string* The language of the input audio. Supplying the input language in ISO-639-1 format (e.g. 'en') will improve accuracy and latency. Optional.

- **prompt** *string* An optional text to guide the model's style or continue a previous audio segment. The prompt should match the audio language. Optional.

- **temperature** *number* The sampling temperature, between 0 and 1. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic. If set to 0, the model will use log probability to automatically increase the temperature until certain thresholds are hit. Defaults to 0. Optional.

- **include** *string\[\]* Additional information to include in the transcription response.

### [Model Capabilities](#model-capabilities-3)


| Model | Transcription | Duration | Segments | Language |
|----|----|----|----|----|


## [Speech Models](#speech-models)


The first argument is the model id e.g. `tts-1`.



``` ts
const model = openai.speech('tts-1');
```


You can also pass additional provider-specific options using the `providerOptions` argument. For example, supplying a voice to use for the generated audio.



``` ts
import  from 'ai';import  from '@ai-sdk/openai';
const result = await generateSpeech( },});
```


- **instructions** *string* Control the voice of your generated audio with additional instructions e.g. "Speak in a slow and steady tone". Does not work with `tts-1` or `tts-1-hd`. Optional.

- **response_format** *string* The format to audio in. Supported formats are `mp3`, `opus`, `aac`, `flac`, `wav`, and `pcm`. Defaults to `mp3`. Optional.

- **speed** *number* The speed of the generated audio. Select a value from 0.25 to 4.0. Defaults to 1.0. Optional.

### [Model Capabilities](#model-capabilities-4)


| Model | Instructions |
|----|----|

















On this page







































































































































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.