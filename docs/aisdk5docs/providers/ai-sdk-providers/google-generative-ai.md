AI SDK 5 is available now.










Menu






















































































































































































































































































































































































































































































# [Google Generative AI Provider](#google-generative-ai-provider)


## [Setup](#setup)

The Google provider is available in the `@ai-sdk/google` module. You can install it with






pnpm







npm







yarn







bun








``` geist-overflow-scroll-y
pnpm add @ai-sdk/google
```












## [Provider Instance](#provider-instance)

You can import the default provider instance `google` from `@ai-sdk/google`:



``` ts
import  from '@ai-sdk/google';
```


If you need a customized setup, you can import `createGoogleGenerativeAI` from `@ai-sdk/google` and create a provider instance with your settings:



``` ts
import  from '@ai-sdk/google';
const google = createGoogleGenerativeAI();
```


You can use the following optional settings to customize the Google Generative AI provider instance:

- **baseURL** *string*

  Use a different URL prefix for API calls, e.g. to use proxy servers. The default prefix is `https://generativelanguage.googleapis.com/v1beta`.

- **apiKey** *string*

  API key that is being sent using the `x-goog-api-key` header. It defaults to the `GOOGLE_GENERATIVE_AI_API_KEY` environment variable.

- **headers** *Record\<string,string\>*

  Custom headers to include in the requests.

- **fetch** *(input: RequestInfo, init?: RequestInit) =\> Promise\<Response\>*


## [Language Models](#language-models)




``` ts
const model = google('gemini-2.5-flash');
```


You can use Google Generative AI language models to generate text with the `generateText` function:



``` ts
import  from '@ai-sdk/google';import  from 'ai';
const  = await generateText();
```


Google Generative AI language models can also be used in the `streamText`, `generateObject`, and `streamObject` functions (see [AI SDK Core](../../docs/ai-sdk-core.html)).

Google Generative AI also supports some model specific settings that are not part of the [standard call settings](../../docs/ai-sdk-core/settings.html). You can pass them as an options argument:



``` ts
const model = google('gemini-2.5-flash');
await generateText(,      ],    },  },});
```


The following optional provider options are available for Google Generative AI models:

- **cachedContent** *string*

  Optional. The name of the cached content used as context to serve the prediction. Format: cachedContents/

- **structuredOutputs** *boolean*

  Optional. Enable structured output. Default is true.

  This is useful when the JSON Schema contains elements that are not supported by the OpenAPI schema version that Google Generative AI uses. You can use this to disable structured outputs if you need to.

  See [Troubleshooting: Schema Limitations](#schema-limitations) for more details.

- **safetySettings** *Array\<\>*

  Optional. Safety settings for the model.

  - **category** *string*

    The category of the safety setting. Can be one of the following:

    - `HARM_CATEGORY_HATE_SPEECH`
    - `HARM_CATEGORY_DANGEROUS_CONTENT`
    - `HARM_CATEGORY_HARASSMENT`
    - `HARM_CATEGORY_SEXUALLY_EXPLICIT`

  - **threshold** *string*

    The threshold of the safety setting. Can be one of the following:

    - `HARM_BLOCK_THRESHOLD_UNSPECIFIED`
    - `BLOCK_LOW_AND_ABOVE`
    - `BLOCK_MEDIUM_AND_ABOVE`
    - `BLOCK_ONLY_HIGH`
    - `BLOCK_NONE`

- **responseModalities** *string\[\]* The modalities to use for the response. The following modalities are supported: `TEXT`, `IMAGE`. When not defined or empty, the model defaults to returning only text.

- **thinkingConfig** **


  - **thinkingBudget** *number*


  - **includeThoughts** *boolean*

    Optional. If set to true, thought summaries are returned, which are synthisized versions of the model's raw thoughts and offer insights into the model's internal reasoning process.

- **imageConfig** **


  - **aspectRatio** *string*

  Model defaults to generate 1:1 squares, or to matching the output image size to that of your input image. Can be one of the following:

  - 1:1
  - 2:3
  - 3:2
  - 3:4
  - 4:3
  - 4:5
  - 5:4
  - 9:16
  - 16:9
  - 21:9

### [Thinking](#thinking)


You can control thinking budgets and enable a thought summary by setting the `thinkingConfig` parameter.



``` ts
import  from '@ai-sdk/google';import  from 'ai';
const model = google('gemini-2.5-flash');
const  = await generateText(,    },  },});
console.log(text);
console.log(reasoning); // Reasoning summary
```


### [File Inputs](#file-inputs)

The Google Generative AI provider supports file inputs, e.g. PDF files.



``` ts
import  from '@ai-sdk/google';import  from 'ai';
const result = await generateText(,        ,      ],    },  ],});
```


You can also use YouTube URLs directly:



``` ts
import  from '@ai-sdk/google';import  from 'ai';
const result = await generateText(,        ,      ],    },  ],});
```





The AI SDK will automatically download URLs if you pass them as data, except for `https://generativelanguage.googleapis.com/v1beta/files/` and YouTube URLs. You can use the Google Generative AI Files API to upload larger files to that location. YouTube URLs (public or unlisted videos) are supported directly

- you can specify one YouTube video URL per request.



See [File Parts](../../docs/foundations/prompts.html#file-parts) for details on how to use files in prompts.

### [Cached Content](#cached-content)

Google Generative AI supports both explicit and implicit caching to help reduce costs on repetitive content.

#### [Implicit Caching](#implicit-caching)

Gemini 2.5 models automatically provide cache cost savings without needing to create an explicit cache. When you send requests that share common prefixes with previous requests, you'll receive a 75% token discount on cached content.

To maximize cache hits with implicit caching:

- Keep content at the beginning of requests consistent
- Add variable content (like user questions) at the end of prompts
- Ensure requests meet minimum token requirements:
  - Gemini 2.5 Flash: 1024 tokens minimum
  - Gemini 2.5 Pro: 2048 tokens minimum



``` ts
import  from '@ai-sdk/google';import  from 'ai';
// Structure prompts with consistent content at the beginningconst baseContext =  'You are a cooking assistant with expertise in Italian cuisine. Here are 1000 lasagna recipes for reference...';
const  = await generateText(\n\nWrite a vegetarian lasagna recipe for 4 people.`,});
// Second request with same prefix - eligible for cache hitconst  = await generateText(\n\nWrite a meat lasagna recipe for 12 people.`,});
// Check cached token count in usage metadataconsole.log('Cached tokens:', providerMetadata.google?.usageMetadata);// e.g.// // }
```





Usage metadata was added to `providerMetadata` in `@ai-sdk/google@1.2.23`. If you are using an older version, usage metadata is available in the raw HTTP `response` body returned as part of the return value from `generateText`.



#### [Explicit Caching](#explicit-caching)




``` ts
import  from '@ai-sdk/google';import  from '@google/generative-ai/server';import  from 'ai';
const cacheManager = new GoogleAICacheManager(  process.env.GOOGLE_GENERATIVE_AI_API_KEY,);
const model = 'gemini-2.5-pro';
const  = await cacheManager.create(],    },  ],  ttlSeconds: 60 * 5,});
const  = await generateText(,  },});
const  = await generateText(,  },});
```


### [Code Execution](#code-execution)


You can enable code execution by adding the `code_execution` tool to your request.



``` ts
import  from '@ai-sdk/google';import  from '@ai-sdk/google/internal';import  from 'ai';
const  = await generateText() },  prompt: 'Use python to calculate the 20th fibonacci number.',});
```


The response will contain the tool calls and results from the code execution.

### [Google Search](#google-search)




``` ts
import  from '@ai-sdk/google';import  from '@ai-sdk/google';import  from 'ai';
const  = await generateText(),  },  prompt:    'List the top 5 San Francisco news from the past week.' +    'You must include the date of each article.',});
// access the grounding metadata. Casting to the provider metadata type// is optional but provides autocomplete and type safety.const metadata = providerMetadata?.google as  | GoogleGenerativeAIProviderMetadata  | undefined;const groundingMetadata = metadata?.groundingMetadata;const safetyRatings = metadata?.safetyRatings;
```


When Search Grounding is enabled, the model will include sources in the response.

Additionally, the grounding metadata includes detailed information about how search results were used to ground the model's response. Here are the available fields:

- **`webSearchQueries`** (`string[] | null`)

  - Array of search queries used to retrieve information
  - Example: `["What's the weather in Chicago this weekend?"]`

- **`searchEntryPoint`** (` | null`)

  - Contains the main search result content used as an entry point
  - The `renderedContent` field contains the formatted content

- **`groundingSupports`** (Array of support objects \| null)

  - Contains details about how specific response parts are supported by search results
  - Each support object includes:
    - **`segment`**: Information about the grounded text segment
      - `text`: The actual text segment
      - `startIndex`: Starting position in the response
      - `endIndex`: Ending position in the response
    - **`groundingChunkIndices`**: References to supporting search result chunks
    - **`confidenceScores`**: Confidence scores (0-1) for each supporting chunk

Example response:



``` json
,    "groundingSupports": [      ,        "groundingChunkIndices": [0],        "confidenceScores": [0.99]      }    ]  }}
```


### [URL Context](#url-context)

Google provides a provider-defined URL context tool.

The URL context tool allows the you to provide specific URLs that you want the model to analyze directly in from the prompt.



``` ts
import  from '@ai-sdk/google';import  from 'ai';
const  = await generateText(),  },});
const metadata = providerMetadata?.google as  | GoogleGenerativeAIProviderMetadata  | undefined;const groundingMetadata = metadata?.groundingMetadata;const urlContextMetadata = metadata?.urlContextMetadata;
```


The URL context metadata includes detailed information about how the model used the URL context to generate the response. Here are the available fields:

- **`urlMetadata`** (`[] | null`)

  - Array of URL context metadata
  - Each object includes:
    - **`retrievedUrl`**: The URL of the context
    - **`urlRetrievalStatus`**: The status of the URL retrieval

Example response:



``` json
  ]}
```


With the URL context tool, you will also get the `groundingMetadata`.



``` json
"groundingMetadata":         }    ],    "groundingSupports": [        ,            "groundingChunkIndices": [                0            ]        },    ]}
```













#### [Combine URL Context with Search Grounding](#combine-url-context-with-search-grounding)

You can combine the URL context tool with search grounding to provide the model with the latest information from the web.



``` ts
import  from '@ai-sdk/google';import  from 'ai';
const  = await generateText(),    url_context: google.tools.urlContext(),  },});
const metadata = providerMetadata?.google as  | GoogleGenerativeAIProviderMetadata  | undefined;const groundingMetadata = metadata?.groundingMetadata;const urlContextMetadata = metadata?.urlContextMetadata;
```


### [Image Outputs](#image-outputs)

Gemini models with image generation capabilities (`gemini-2.5-flash-image-preview`) support image generation. Images are exposed as files in the response.



``` ts
import  from '@ai-sdk/google';import  from 'ai';
const result = await generateText();
for (const file of result.files) }
```


### [Safety Ratings](#safety-ratings)


Example response excerpt:



``` json
,    ,    ,      ]}
```


### [Troubleshooting](#troubleshooting)

#### [Schema Limitations](#schema-limitations)

The Google Generative AI API uses a subset of the OpenAPI 3.0 schema, which does not support features such as unions. The errors that you get in this case look like this:

`GenerateContentRequest.generation_config.response_schema.properties[occupation].type: must be specified`

By default, structured outputs are enabled (and for tool calling they are required). You can disable structured outputs for object generation as a workaround:



``` ts
const  = await generateObject(,  },  schema: z.object(),      z.object(),    ]),  }),  prompt: 'Generate an example person for testing.',});
```


The following Zod features are known to not work with Google Generative AI:

- `z.union`
- `z.record`

### [Model Capabilities](#model-capabilities)


| Model | Image Input | Object Generation | Tool Usage | Tool Streaming | Google Search | URL Context |
|----|----|----|----|----|----|----|








## [Gemma Models](#gemma-models)


Gemma models don't natively support the `systemInstruction` parameter, but the provider automatically handles system instructions by prepending them to the first user message. This allows you to use system instructions with Gemma models seamlessly:



``` ts
import  from '@ai-sdk/google';import  from 'ai';
const  = await generateText();
```


The system instruction is automatically formatted and included in the conversation, so Gemma models can follow the guidance without any additional configuration.

## [Embedding Models](#embedding-models)




``` ts
const model = google.textEmbedding('gemini-embedding-001');
```


The Google Generative AI provider sends API calls to the right endpoint based on the type of embedding:

- **Single embeddings**: When embedding a single value with `embed()`, the provider uses the single `:embedContent` endpoint, which typically has higher rate limits compared to the batch endpoint.
- **Batch embeddings**: When embedding multiple values with `embedMany()` or multiple values in `embed()`, the provider uses the `:batchEmbedContents` endpoint.

Google Generative AI embedding models support aditional settings. You can pass them as an options argument:



``` ts
import  from '@ai-sdk/google';import  from 'ai';
const model = google.textEmbedding('gemini-embedding-001');
const  = await embed(,  },});
```


The following optional provider options are available for Google Generative AI embedding models:

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

### [Model Capabilities](#model-capabilities-1)


| Model | Default Dimensions | Custom Dimensions |
|----|----|----|


## [Image Models](#image-models)




``` ts
import  from '@ai-sdk/google';import  from 'ai';
const  = await generateImage();
```


Further configuration can be done using Google provider options. You can validate the provider options using the `GoogleGenerativeAIImageProviderOptions` type.



``` ts
import  from '@ai-sdk/google';import  from '@ai-sdk/google';import  from 'ai';
const  = await generateImage( satisfies GoogleGenerativeAIImageProviderOptions,  },  // ...});
```


The following provider options are available:

- **personGeneration** `allow_adult` \| `allow_all` \| `dont_allow` Whether to allow person generation. Defaults to `allow_adult`.




Imagen models do not support the `size` parameter. Use the `aspectRatio` parameter instead.



#### [Model Capabilities](#model-capabilities-2)


| Model                     | Aspect Ratios             |
|---------------------------|---------------------------|
| `imagen-3.0-generate-002` | 1:1, 3:4, 4:3, 9:16, 16:9 |

















On this page



























































































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.