AI SDK 5 is available now.










Menu






















































































































































































































































































































































































































































































# [Google Vertex Provider](#google-vertex-provider)





The Google Vertex provider is compatible with both Node.js and Edge runtimes. The Edge runtime is supported through the `@ai-sdk/google-vertex/edge` sub-module. More details can be found in the [Google Vertex Edge Runtime](#google-vertex-edge-runtime) and [Google Vertex Anthropic Edge Runtime](#google-vertex-anthropic-edge-runtime) sections below.



## [Setup](#setup)

The Google Vertex and Google Vertex Anthropic providers are both available in the `@ai-sdk/google-vertex` module. You can install it with






pnpm







npm







yarn







bun








``` geist-overflow-scroll-y
pnpm add @ai-sdk/google-vertex
```












## [Google Vertex Provider Usage](#google-vertex-provider-usage)


### [Provider Instance](#provider-instance)

You can import the default provider instance `vertex` from `@ai-sdk/google-vertex`:



``` ts
import  from '@ai-sdk/google-vertex';
```


If you need a customized setup, you can import `createVertex` from `@ai-sdk/google-vertex` and create a provider instance with your settings:



``` ts
import  from '@ai-sdk/google-vertex';
const vertex = createVertex();
```


Google Vertex supports two different authentication implementations depending on your runtime environment.

#### [Node.js Runtime](#nodejs-runtime)


If you want to customize the Google authentication options you can pass them as options to the `createVertex` function, for example:



``` ts
import  from '@ai-sdk/google-vertex';
const vertex = createVertex(,  },});
```


##### [Optional Provider Settings](#optional-provider-settings)

You can use the following optional settings to customize the provider instance:

- **project** *string*

  The Google Cloud project ID that you want to use for the API calls. It uses the `GOOGLE_VERTEX_PROJECT` environment variable by default.

- **location** *string*

  The Google Cloud location that you want to use for the API calls, e.g. `us-central1`. It uses the `GOOGLE_VERTEX_LOCATION` environment variable by default.

- **googleAuthOptions** *object*


  - **authClient** *object* An `AuthClient` to use.

  - **keyFilename** *string* Path to a .json, .pem, or .p12 key file.

  - **keyFile** *string* Path to a .json, .pem, or .p12 key file.

  - **credentials** *object* Object containing client_email and private_key properties, or the external account client options.

  - **clientOptions** *object* Options object passed to the constructor of the client.

  - **scopes** *string \| string\[\]* Required scopes for the desired API request.

  - **projectId** *string* Your project ID.

  - **universeDomain** *string* The default service domain for a given Cloud universe.

- **headers** *Resolvable\<Record\<string, string \| undefined\>\>*

  Headers to include in the requests. Can be provided in multiple formats:

  - A record of header key-value pairs: `Record<string, string | undefined>`
  - A function that returns headers: `() => Record<string, string | undefined>`
  - An async function that returns headers: `async () => Record<string, string | undefined>`
  - A promise that resolves to headers: `Promise<Record<string, string | undefined>>`

- **fetch** *(input: RequestInfo, init?: RequestInit) =\> Promise\<Response\>*


- **baseURL** *string*

  Optional. Base URL for the Google Vertex API calls e.g. to use proxy servers. By default, it is constructed using the location and project: `https://$-aiplatform.googleapis.com/v1/projects/$/locations/$/publishers/google`


#### [Edge Runtime](#edge-runtime)

Edge runtimes (like Vercel Edge Functions and Cloudflare Workers) are lightweight JavaScript environments that run closer to users at the network edge. They only provide a subset of the standard Node.js APIs. For example, direct file system access is not available, and many Node.js-specific libraries (including the standard Google Auth library) are not compatible.


You can import the default provider instance `vertex` from `@ai-sdk/google-vertex/edge`:



``` ts
import  from '@ai-sdk/google-vertex/edge';
```





The `/edge` sub-module is included in the `@ai-sdk/google-vertex` package, so you don't need to install it separately. You must import from `@ai-sdk/google-vertex/edge` to differentiate it from the Node.js provider.



If you need a customized setup, you can import `createVertex` from `@ai-sdk/google-vertex/edge` and create a provider instance with your settings:



``` ts
import  from '@ai-sdk/google-vertex/edge';
const vertex = createVertex();
```


For Edge runtime authentication, you'll need to set these environment variables from your Google Default Application Credentials JSON file:

- `GOOGLE_CLIENT_EMAIL`
- `GOOGLE_PRIVATE_KEY`
- `GOOGLE_PRIVATE_KEY_ID` (optional)


##### [Optional Provider Settings](#optional-provider-settings-1)

You can use the following optional settings to customize the provider instance:

- **project** *string*

  The Google Cloud project ID that you want to use for the API calls. It uses the `GOOGLE_VERTEX_PROJECT` environment variable by default.

- **location** *string*

  The Google Cloud location that you want to use for the API calls, e.g. `us-central1`. It uses the `GOOGLE_VERTEX_LOCATION` environment variable by default.

- **googleCredentials** *object*

  Optional. The credentials used by the Edge provider for authentication. These credentials are typically set through environment variables and are derived from a service account JSON file.

  - **clientEmail** *string* The client email from the service account JSON file. Defaults to the contents of the `GOOGLE_CLIENT_EMAIL` environment variable.

  - **privateKey** *string* The private key from the service account JSON file. Defaults to the contents of the `GOOGLE_PRIVATE_KEY` environment variable.

  - **privateKeyId** *string* The private key ID from the service account JSON file (optional). Defaults to the contents of the `GOOGLE_PRIVATE_KEY_ID` environment variable.

- **headers** *Resolvable\<Record\<string, string \| undefined\>\>*

  Headers to include in the requests. Can be provided in multiple formats:

  - A record of header key-value pairs: `Record<string, string | undefined>`
  - A function that returns headers: `() => Record<string, string | undefined>`
  - An async function that returns headers: `async () => Record<string, string | undefined>`
  - A promise that resolves to headers: `Promise<Record<string, string | undefined>>`

- **fetch** *(input: RequestInfo, init?: RequestInit) =\> Promise\<Response\>*


### [Language Models](#language-models)

You can create models that call the Vertex API using the provider instance. The first argument is the model id, e.g. `gemini-1.5-pro`.



``` ts
const model = vertex('gemini-1.5-pro');
```








Google Vertex models support also some model specific settings that are not part of the [standard call settings](../../docs/ai-sdk-core/settings.html). You can pass them as an options argument:



``` ts
const model = vertex('gemini-1.5-pro');
await generateText(,      ],    },  },});
```


The following optional provider options are available for Google Vertex models:

- **structuredOutputs** *boolean*

  Optional. Enable structured output. Default is true.

  This is useful when the JSON Schema contains elements that are not supported by the OpenAPI schema version that Google Vertex uses. You can use this to disable structured outputs if you need to.

  See [Troubleshooting: Schema Limitations](#schema-limitations) for more details.

- **safetySettings** *Array\<\>*

  Optional. Safety settings for the model.

  - **category** *string*

    The category of the safety setting. Can be one of the following:

    - `HARM_CATEGORY_UNSPECIFIED`
    - `HARM_CATEGORY_HATE_SPEECH`
    - `HARM_CATEGORY_DANGEROUS_CONTENT`
    - `HARM_CATEGORY_HARASSMENT`
    - `HARM_CATEGORY_SEXUALLY_EXPLICIT`
    - `HARM_CATEGORY_CIVIC_INTEGRITY`

  - **threshold** *string*

    The threshold of the safety setting. Can be one of the following:

    - `HARM_BLOCK_THRESHOLD_UNSPECIFIED`
    - `BLOCK_LOW_AND_ABOVE`
    - `BLOCK_MEDIUM_AND_ABOVE`
    - `BLOCK_ONLY_HIGH`
    - `BLOCK_NONE`

- **audioTimestamp** *boolean*

  Optional. Enables timestamp understanding for audio files. Defaults to false.


- **labels** *object*

  Optional. Defines labels used in billing reports.


You can use Google Vertex language models to generate text with the `generateText` function:



``` ts
import  from '@ai-sdk/google-vertex';import  from 'ai';
const  = await generateText();
```


Google Vertex language models can also be used in the `streamText` function (see [AI SDK Core](../../docs/ai-sdk-core.html)).

#### [Code Execution](#code-execution)


You can enable code execution by adding the `code_execution` tool to your request.



``` ts
import  from '@ai-sdk/google-vertex';import  from 'ai';
const result = await generateText() },  prompt:    'Use python to calculate 20th fibonacci number. Then find the nearest palindrome to it.',});
```


The response will contain `tool-call` and `tool-result` parts for the executed code.

#### [URL Context](#url-context)

URL Context allows Gemini models to retrieve and analyze content from URLs. Supported models: Gemini 2.5 Flash-Lite, 2.5 Pro, 2.5 Flash, 2.0 Flash.



``` ts
import  from '@ai-sdk/google-vertex';import  from 'ai';
const result = await generateText() },  prompt: 'What are the key points from https://example.com/article?',});
```


#### [Google Search](#google-search)

Google Search enables Gemini models to access real-time web information. Supported models: Gemini 2.5 Flash-Lite, 2.5 Flash, 2.0 Flash, 2.5 Pro.



``` ts
import  from '@ai-sdk/google-vertex';import  from 'ai';
const result = await generateText() },  prompt: 'What are the latest developments in AI?',});
```


#### [Reasoning (Thinking Tokens)](#reasoning-thinking-tokens)

Google Vertex AI, through its support for Gemini models, can also emit "thinking" tokens, representing the model's reasoning process. The AI SDK exposes these as reasoning information.

To enable thinking tokens for compatible Gemini models via Vertex, set `includeThoughts: true` in the `thinkingConfig` provider option. Since the Vertex provider uses the Google provider's underlying language model, these options are passed through `providerOptions.google`:



``` ts
import  from '@ai-sdk/google-vertex';import  from '@ai-sdk/google'; // Note: importing from @ai-sdk/googleimport  from 'ai';
// For generateText:const  = await generateText(,    } satisfies GoogleGenerativeAIProviderOptions,  },  prompt: 'Explain quantum computing in simple terms.',});
console.log('Reasoning:', reasoning);console.log('Reasoning Details:', reasoningDetails);console.log('Final Text:', text);
// For streamText:const result = streamText(,    } satisfies GoogleGenerativeAIProviderOptions,  },  prompt: 'Explain quantum computing in simple terms.',});
for await (const part of result.fullStream) \n`);  } else if (part.type === 'text-delta') }
```


When `includeThoughts` is true, parts of the API response marked with `thought: true` will be processed as reasoning.

- In `generateText`, these contribute to the `reasoning` (string) and `reasoningDetails` (array) fields.
- In `streamText`, these are emitted as `reasoning` stream parts.







#### [File Inputs](#file-inputs)

The Google Vertex provider supports file inputs, e.g. PDF files.



``` ts
import  from '@ai-sdk/google-vertex';import  from 'ai';
const  = await generateText(,        ,      ],    },  ],});
```





The AI SDK will automatically download URLs if you pass them as data, except for `gs://` URLs. You can use the Google Cloud Storage API to upload larger files to that location.



See [File Parts](../../docs/foundations/prompts.html#file-parts) for details on how to use files in prompts.

### [Safety Ratings](#safety-ratings)


Example response excerpt:



``` json
,    ,    ,      ]}
```



### [Troubleshooting](#troubleshooting)

#### [Schema Limitations](#schema-limitations)

The Google Vertex API uses a subset of the OpenAPI 3.0 schema, which does not support features such as unions. The errors that you get in this case look like this:

`GenerateContentRequest.generation_config.response_schema.properties[occupation].type: must be specified`

By default, structured outputs are enabled (and for tool calling they are required). You can disable structured outputs for object generation as a workaround:



``` ts
const result = await generateObject(,  },  schema: z.object(),      z.object(),    ]),  }),  prompt: 'Generate an example person for testing.',});
```


The following Zod features are known to not work with Google Vertex:

- `z.union`
- `z.record`

### [Model Capabilities](#model-capabilities)


| Model | Image Input | Object Generation | Tool Usage | Tool Streaming |
|----|----|----|----|----|








### [Embedding Models](#embedding-models)

You can create models that call the Google Vertex AI embeddings API using the `.textEmbeddingModel()` factory method:



``` ts
const model = vertex.textEmbeddingModel('text-embedding-004');
```


Google Vertex AI embedding models support additional settings. You can pass them as an options argument:



``` ts
import  from '@ai-sdk/google-vertex';import  from 'ai';
const model = vertex.textEmbeddingModel('text-embedding-004');
const  = await embed(,  },});
```


The following optional provider options are available for Google Vertex AI embedding models:

- **outputDimensionality**: *number*

  Optional reduced dimension for the output embedding. If set, excessive values in the output embedding are truncated from the end.

- **taskType**: *string*

  Optional. Specifies the task type for generating embeddings. Supported task types include:

  - `SEMANTIC_SIMILARITY`: Optimized for text similarity.
  - `CLASSIFICATION`: Optimized for text classification.
  - `CLUSTERING`: Optimized for clustering texts based on similarity.
  - `RETRIEVAL_DOCUMENT`: Optimized for document retrieval.
  - `RETRIEVAL_QUERY`: Optimized for query-based retrieval.
  - `QUESTION_ANSWERING`: Optimized for answering questions.
  - `FACT_VERIFICATION`: Optimized for verifying factual information.
  - `CODE_RETRIEVAL_QUERY`: Optimized for retrieving code blocks based on natural language queries.

- **title**: *string*

  Optional. The title of the document being embedded. This helps the model produce better embeddings by providing additional context. Only valid when `taskType` is set to `'RETRIEVAL_DOCUMENT'`.

- **autoTruncate**: *boolean*

  Optional. When set to `true`, input text will be truncated if it exceeds the maximum length. When set to `false`, an error is returned if the input text is too long. Defaults to `true`.

#### [Model Capabilities](#model-capabilities-1)


| Model | Max Values Per Call | Parallel Calls |
|----|----|----|





The table above lists popular models. You can also pass any available provider model ID as a string if needed.



### [Image Models](#image-models)




``` ts
import  from '@ai-sdk/google-vertex';import  from 'ai';
const  = await generateImage();
```


Further configuration can be done using Google Vertex provider options. You can validate the provider options using the `GoogleVertexImageProviderOptions` type.



``` ts
import  from '@ai-sdk/google-vertex';import  from '@ai-sdk/google-vertex';import  from 'ai';
const  = await generateImage( satisfies GoogleVertexImageProviderOptions,  },  // ...});
```


The following provider options are available:

- **negativePrompt** *string* A description of what to discourage in the generated images.

- **personGeneration** `allow_adult` \| `allow_all` \| `dont_allow` Whether to allow person generation. Defaults to `allow_adult`.

- **safetySetting** `block_low_and_above` \| `block_medium_and_above` \| `block_only_high` \| `block_none` Whether to block unsafe content. Defaults to `block_medium_and_above`.

- **addWatermark** *boolean* Whether to add an invisible watermark to the generated images. Defaults to `true`.

- **storageUri** *string* Cloud Storage URI to store the generated images.




Imagen models do not support the `size` parameter. Use the `aspectRatio` parameter instead.



Additional information about the images can be retrieved using Google Vertex meta data.



``` ts
import  from '@ai-sdk/google-vertex';import  from '@ai-sdk/google-vertex';import  from 'ai';
const  = await generateImage();
console.log(  `Revised prompt: $`,);
```


#### [Model Capabilities](#model-capabilities-2)


| Model                                     | Aspect Ratios             |
|-------------------------------------------|---------------------------|
| `imagen-3.0-generate-001`                 | 1:1, 3:4, 4:3, 9:16, 16:9 |
| `imagen-3.0-generate-002`                 | 1:1, 3:4, 4:3, 9:16, 16:9 |
| `imagen-3.0-fast-generate-001`            | 1:1, 3:4, 4:3, 9:16, 16:9 |
| `imagen-4.0-generate-preview-06-06`       | 1:1, 3:4, 4:3, 9:16, 16:9 |
| `imagen-4.0-fast-generate-preview-06-06`  | 1:1, 3:4, 4:3, 9:16, 16:9 |
| `imagen-4.0-ultra-generate-preview-06-06` | 1:1, 3:4, 4:3, 9:16, 16:9 |


## [Google Vertex Anthropic Provider Usage](#google-vertex-anthropic-provider-usage)

The Google Vertex Anthropic provider for the [AI SDK](../../docs/introduction.html) offers support for Anthropic's Claude models through the Google Vertex AI APIs. This section provides details on how to set up and use the Google Vertex Anthropic provider.

### [Provider Instance](#provider-instance-1)

You can import the default provider instance `vertexAnthropic` from `@ai-sdk/google-vertex/anthropic`:



``` typescript
import  from '@ai-sdk/google-vertex/anthropic';
```


If you need a customized setup, you can import `createVertexAnthropic` from `@ai-sdk/google-vertex/anthropic` and create a provider instance with your settings:



``` typescript
import  from '@ai-sdk/google-vertex/anthropic';
const vertexAnthropic = createVertexAnthropic();
```


#### [Node.js Runtime](#nodejs-runtime-1)

For Node.js environments, the Google Vertex Anthropic provider supports all standard Google Cloud authentication options through the `google-auth-library`. You can customize the authentication options by passing them to the `createVertexAnthropic` function:



``` typescript
import  from '@ai-sdk/google-vertex/anthropic';
const vertexAnthropic = createVertexAnthropic(,  },});
```


##### [Optional Provider Settings](#optional-provider-settings-2)

You can use the following optional settings to customize the Google Vertex Anthropic provider instance:

- **project** *string*

  The Google Cloud project ID that you want to use for the API calls. It uses the `GOOGLE_VERTEX_PROJECT` environment variable by default.

- **location** *string*

  The Google Cloud location that you want to use for the API calls, e.g. `us-central1`. It uses the `GOOGLE_VERTEX_LOCATION` environment variable by default.

- **googleAuthOptions** *object*


  - **authClient** *object* An `AuthClient` to use.

  - **keyFilename** *string* Path to a .json, .pem, or .p12 key file.

  - **keyFile** *string* Path to a .json, .pem, or .p12 key file.

  - **credentials** *object* Object containing client_email and private_key properties, or the external account client options.

  - **clientOptions** *object* Options object passed to the constructor of the client.

  - **scopes** *string \| string\[\]* Required scopes for the desired API request.

  - **projectId** *string* Your project ID.

  - **universeDomain** *string* The default service domain for a given Cloud universe.

- **headers** *Resolvable\<Record\<string, string \| undefined\>\>*

  Headers to include in the requests. Can be provided in multiple formats:

  - A record of header key-value pairs: `Record<string, string | undefined>`
  - A function that returns headers: `() => Record<string, string | undefined>`
  - An async function that returns headers: `async () => Record<string, string | undefined>`
  - A promise that resolves to headers: `Promise<Record<string, string | undefined>>`

- **fetch** *(input: RequestInfo, init?: RequestInit) =\> Promise\<Response\>*



#### [Edge Runtime](#edge-runtime-1)

Edge runtimes (like Vercel Edge Functions and Cloudflare Workers) are lightweight JavaScript environments that run closer to users at the network edge. They only provide a subset of the standard Node.js APIs. For example, direct file system access is not available, and many Node.js-specific libraries (including the standard Google Auth library) are not compatible.


For Edge runtimes, you can import the provider instance from `@ai-sdk/google-vertex/anthropic/edge`:



``` typescript
import  from '@ai-sdk/google-vertex/anthropic/edge';
```


To customize the setup, use `createVertexAnthropic` from the same module:



``` typescript
import  from '@ai-sdk/google-vertex/anthropic/edge';
const vertexAnthropic = createVertexAnthropic();
```


For Edge runtime authentication, set these environment variables from your Google Default Application Credentials JSON file:

- `GOOGLE_CLIENT_EMAIL`
- `GOOGLE_PRIVATE_KEY`
- `GOOGLE_PRIVATE_KEY_ID` (optional)

##### [Optional Provider Settings](#optional-provider-settings-3)

You can use the following optional settings to customize the provider instance:

- **project** *string*

  The Google Cloud project ID that you want to use for the API calls. It uses the `GOOGLE_VERTEX_PROJECT` environment variable by default.

- **location** *string*

  The Google Cloud location that you want to use for the API calls, e.g. `us-central1`. It uses the `GOOGLE_VERTEX_LOCATION` environment variable by default.

- **googleCredentials** *object*

  Optional. The credentials used by the Edge provider for authentication. These credentials are typically set through environment variables and are derived from a service account JSON file.

  - **clientEmail** *string* The client email from the service account JSON file. Defaults to the contents of the `GOOGLE_CLIENT_EMAIL` environment variable.

  - **privateKey** *string* The private key from the service account JSON file. Defaults to the contents of the `GOOGLE_PRIVATE_KEY` environment variable.

  - **privateKeyId** *string* The private key ID from the service account JSON file (optional). Defaults to the contents of the `GOOGLE_PRIVATE_KEY_ID` environment variable.

- **headers** *Resolvable\<Record\<string, string \| undefined\>\>*

  Headers to include in the requests. Can be provided in multiple formats:

  - A record of header key-value pairs: `Record<string, string | undefined>`
  - A function that returns headers: `() => Record<string, string | undefined>`
  - An async function that returns headers: `async () => Record<string, string | undefined>`
  - A promise that resolves to headers: `Promise<Record<string, string | undefined>>`

- **fetch** *(input: RequestInfo, init?: RequestInit) =\> Promise\<Response\>*


### [Language Models](#language-models-1)




``` ts
const model = anthropic('claude-3-haiku-20240307');
```


You can use Anthropic language models to generate text with the `generateText` function:



``` ts
import  from '@ai-sdk/google-vertex/anthropic';import  from 'ai';
const  = await generateText();
```


Anthropic language models can also be used in the `streamText`, `generateObject`, and `streamObject` functions (see [AI SDK Core](../../docs/ai-sdk-core.html)).




The Anthropic API returns streaming tool calls all at once after a delay. This causes the `streamObject` function to generate the object fully after a delay instead of streaming it incrementally.



The following optional provider options are available for Anthropic models:

- `sendReasoning` *boolean*

  Optional. Include reasoning content in requests sent to the model. Defaults to `true`.

  If you are experiencing issues with the model handling requests involving reasoning content, you can set this to `false` to omit them from the request.

- `thinking` *object*

  Optional. See [Reasoning section](#reasoning) for more details.

### [Reasoning](#reasoning)

Anthropic has reasoning support for the `claude-3-7-sonnet@20250219` model.

You can enable it using the `thinking` provider option and specifying a thinking budget in tokens.



``` ts
import  from '@ai-sdk/google-vertex/anthropic';import  from 'ai';
const  = await generateText(,    },  },});
console.log(reasoning); // reasoning textconsole.log(reasoningDetails); // reasoning details including redacted reasoningconsole.log(text); // text response
```


See [AI SDK UI: Chatbot](../../docs/ai-sdk-ui/chatbot.html#reasoning) for more details on how to integrate reasoning into your chatbot.

#### [Cache Control](#cache-control)







In the messages and message parts, you can use the `providerOptions` property to set cache control breakpoints. You need to set the `anthropic` property in the `providerOptions` object to ` }` to set a cache control breakpoint.

The cache creation input tokens are then returned in the `providerMetadata` object for `generateText` and `generateObject`, again under the `anthropic` property. When you use `streamText` or `streamObject`, the response contains a promise that resolves to the metadata. Alternatively you can receive it in the `onFinish` callback.



``` ts
import  from '@ai-sdk/google-vertex/anthropic';import  from 'ai';
const errorMessage = '... long error message ...';
const result = await generateText(,        `,          providerOptions:  },          },        },        ,      ],    },  ],});
console.log(result.text);console.log(result.providerMetadata?.anthropic);// e.g. 
```


You can also use cache control on system messages by providing multiple system messages at the head of your messages array:



``` ts
const result = await generateText( },      },    },    ,    ,  ],});
```



### [Computer Use](#computer-use)

Anthropic provides three built-in tools that can be used to interact with external systems:

1.  **Bash Tool**: Allows running bash commands.
2.  **Text Editor Tool**: Provides functionality for viewing and editing text files.
3.  **Computer Tool**: Enables control of keyboard and mouse actions on a computer.

They are available via the `tools` property of the provider instance.


#### [Bash Tool](#bash-tool)

The Bash Tool allows running bash commands. Here's how to create and use it:



``` ts
const bashTool = vertexAnthropic.tools.bash_20241022() => ,});
```


Parameters:

- `command` (string): The bash command to run. Required unless the tool is being restarted.
- `restart` (boolean, optional): Specifying true will restart this tool.

#### [Text Editor Tool](#text-editor-tool)

The Text Editor Tool provides functionality for viewing and editing text files:



``` ts
const textEditorTool = vertexAnthropic.tools.textEditor_20241022() => ,});
```


Parameters:

- `command` ('view' \| 'create' \| 'str_replace' \| 'insert' \| 'undo_edit'): The command to run.
- `path` (string): Absolute path to file or directory, e.g. `/repo/file.py` or `/repo`.
- `file_text` (string, optional): Required for `create` command, with the content of the file to be created.
- `insert_line` (number, optional): Required for `insert` command. The line number after which to insert the new string.
- `new_str` (string, optional): New string for `str_replace` or `insert` commands.
- `old_str` (string, optional): Required for `str_replace` command, containing the string to replace.
- `view_range` (number\[\], optional): Optional for `view` command to specify line range to show.

#### [Computer Tool](#computer-tool)

The Computer Tool enables control of keyboard and mouse actions on a computer:



``` ts
const computerTool = vertexAnthropic.tools.computer_20241022() => ;      }      default: `;      }    }  },
  // map to tool result content for LLM consumption:  toModelOutput(result) ]      : [];  },});
```


Parameters:

- `action` ('key' \| 'type' \| 'mouse_move' \| 'left_click' \| 'left_click_drag' \| 'right_click' \| 'middle_click' \| 'double_click' \| 'screenshot' \| 'cursor_position'): The action to perform.
- `coordinate` (number\[\], optional): Required for `mouse_move` and `left_click_drag` actions. Specifies the (x, y) coordinates.
- `text` (string, optional): Required for `type` and `key` actions.

These tools can be used in conjunction with the `claude-3-5-sonnet-v2@20241022` model to enable more complex interactions and tasks.

### [Model Capabilities](#model-capabilities-3)



| Model | Image Input | Object Generation | Tool Usage | Tool Streaming | Computer Use |
|----|----|----|----|----|----|





The table above lists popular models. You can also pass any available provider model ID as a string if needed.


















On this page


















































































































































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.