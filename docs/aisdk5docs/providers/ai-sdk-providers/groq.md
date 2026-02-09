AI SDK 5 is available now.










Menu






















































































































































































































































































































































































































































































# [Groq Provider](#groq-provider)


## [Setup](#setup)

The Groq provider is available via the `@ai-sdk/groq` module. You can install it with






pnpm







npm







yarn







bun








``` geist-overflow-scroll-y
pnpm add @ai-sdk/groq
```












## [Provider Instance](#provider-instance)

You can import the default provider instance `groq` from `@ai-sdk/groq`:



``` ts
import  from '@ai-sdk/groq';
```


If you need a customized setup, you can import `createGroq` from `@ai-sdk/groq` and create a provider instance with your settings:



``` ts
import  from '@ai-sdk/groq';
const groq = createGroq();
```


You can use the following optional settings to customize the Groq provider instance:

- **baseURL** *string*

  Use a different URL prefix for API calls, e.g. to use proxy servers. The default prefix is `https://api.groq.com/openai/v1`.

- **apiKey** *string*

  API key that is being sent using the `Authorization` header. It defaults to the `GROQ_API_KEY` environment variable.

- **headers** *Record\<string,string\>*

  Custom headers to include in the requests.

- **fetch** *(input: RequestInfo, init?: RequestInit) =\> Promise\<Response\>*


## [Language Models](#language-models)




``` ts
const model = groq('gemma2-9b-it');
```


### [Reasoning Models](#reasoning-models)

Groq offers several reasoning models such as `qwen-qwq-32b` and `deepseek-r1-distill-llama-70b`. You can configure how the reasoning is exposed in the generated text by using the `reasoningFormat` option. It supports the options `parsed`, `hidden`, and `raw`.



``` ts
import  from '@ai-sdk/groq';import  from 'ai';
const result = await generateText(,  },  prompt: 'How many "r"s are in the word "strawberry"?',});
```


The following optional provider options are available for Groq language models:

- **reasoningFormat** *'parsed' \| 'raw' \| 'hidden'*

  Controls how reasoning is exposed in the generated text. Only supported by reasoning models like `qwen-qwq-32b` and `deepseek-r1-distill-*` models.


- **reasoningEffort** *'low' \| 'meduim' \| 'high' \| 'none' \| 'default'*

  Controls the level of effort the model will put into reasoning.

  - `qwen/qwen3-32b`
    - Supported values:
      - `none`: Disable reasoning. The model will not use any reasoning tokens.
      - `default`: Enable reasoning.
  - `gpt-oss20b/gpt-oss120b`
    - Supported values:
      - `low`: Use a low level of reasoning effort.
      - `medium`: Use a medium level of reasoning effort.
      - `high`: Use a high level of reasoning effort.

  Defaults to `default` for `qwen/qwen3-32b.`

- **structuredOutputs** *boolean*

  Whether to use structured outputs.

  Defaults to `true`.

  When enabled, object generation will use the `json_schema` format instead of `json_object` format, providing more reliable structured outputs.

- **parallelToolCalls** *boolean*

  Whether to enable parallel function calling during tool use. Defaults to `true`.

- **user** *string*

  A unique identifier representing your end-user, which can help with monitoring and abuse detection.

- **serviceTier** *'on_demand' \| 'flex' \| 'auto'*

  Service tier for the request. Defaults to `'on_demand'`.

  - `'on_demand'`: Default tier with consistent performance and fairness
  - `'flex'`: Higher throughput tier (10x rate limits) optimized for workloads that can handle occasional request failures
  - `'auto'`: Uses on_demand rate limits first, then falls back to flex tier if exceeded







#### [Structured Outputs](#structured-outputs)

Structured outputs are enabled by default for Groq models. You can disable them by setting the `structuredOutputs` option to `false`.



``` ts
import  from '@ai-sdk/groq';import  from 'ai';import  from 'zod';
const result = await generateObject(),  }),  prompt: 'Generate a simple pasta recipe.',});
console.log(JSON.stringify(result.object, null, 2));
```


You can disable structured outputs for models that don't support them:



``` ts
import  from '@ai-sdk/groq';import  from 'ai';import  from 'zod';
const result = await generateObject(,  },  schema: z.object(),  }),  prompt: 'Generate a simple pasta recipe in JSON format.',});
console.log(JSON.stringify(result.object, null, 2));
```





Structured outputs are only supported by newer Groq models like `moonshotai/kimi-k2-instruct`. For unsupported models, you can disable structured outputs by setting `structuredOutputs: false`. When disabled, Groq uses the `json_object` format which requires the word "JSON" to be included in your messages.



### [Example](#example)

You can use Groq language models to generate text with the `generateText` function:



``` ts
import  from '@ai-sdk/groq';import  from 'ai';
const  = await generateText();
```


### [Image Input](#image-input)

Groq's multi-modal models like `meta-llama/llama-4-scout-17b-16e-instruct` support image inputs. You can include images in your messages using either URLs or base64-encoded data:



``` ts
import  from '@ai-sdk/groq';import  from 'ai';
const  = await generateText(,        ,      ],    },  ],});
```


You can also use base64-encoded images:



``` ts
import  from '@ai-sdk/groq';import  from 'ai';import  from 'fs';
const imageData = readFileSync('path/to/image.jpg', 'base64');
const  = await generateText(,        `,        },      ],    },  ],});
```


## [Model Capabilities](#model-capabilities)


| Model | Image Input | Object Generation | Tool Usage | Tool Streaming |
|----|----|----|----|----|








## [Browser Search Tool](#browser-search-tool)

Groq provides a browser search tool that offers interactive web browsing capabilities. Unlike traditional web search, browser search navigates websites interactively, providing more detailed and comprehensive results.

### [Supported Models](#supported-models)

Browser search is only available for these specific models:

- `openai/gpt-oss-20b`
- `openai/gpt-oss-120b`




Browser search will only work with the supported models listed above. Using it with other models will generate a warning and the tool will be ignored.



### [Basic Usage](#basic-usage)



``` ts
import  from '@ai-sdk/groq';import  from 'ai';
const result = await generateText(),  },  toolChoice: 'required', // Ensure the tool is used});
console.log(result.text);
```


### [Streaming Example](#streaming-example)



``` ts
import  from '@ai-sdk/groq';import  from 'ai';
const result = streamText(),  },  toolChoice: 'required',});
for await (const delta of result.fullStream) }
```


### [Key Features](#key-features)

- **Interactive Browsing**: Navigates websites like a human user
- **Comprehensive Results**: More detailed than traditional search snippets
- **Server-side Execution**: Runs on Groq's infrastructure, no setup required
- **Powered by Exa**: Uses Exa search engine for optimal results
- **Currently Free**: Available at no additional charge during beta

### [Best Practices](#best-practices)

- Use `toolChoice: 'required'` to ensure the browser search is activated
- Only supported on `openai/gpt-oss-20b` and `openai/gpt-oss-120b` models
- The tool works automatically - no configuration parameters needed
- Server-side execution means no additional API keys or setup required

### [Model Validation](#model-validation)

The provider automatically validates model compatibility:



``` ts
// ✅ Supported - will workconst result = await generateText() },});
// ❌ Unsupported - will show warning and ignore toolconst result = await generateText() },});// Warning: "Browser search is only supported on models: openai/gpt-oss-20b, openai/gpt-oss-120b"
```








## [Transcription Models](#transcription-models)


The first argument is the model id e.g. `whisper-large-v3`.



``` ts
const model = groq.transcription('whisper-large-v3');
```


You can also pass additional provider-specific options using the `providerOptions` argument. For example, supplying the input language in ISO-639-1 (e.g. `en`) format will improve accuracy and latency.



``` ts
import  from 'ai';import  from '@ai-sdk/groq';import  from 'fs/promises';
const result = await transcribe( },});
```


The following provider options are available:

- **timestampGranularities** *string\[\]* The granularity of the timestamps in the transcription. Defaults to `['segment']`. Possible values are `['word']`, `['segment']`, and `['word', 'segment']`. Note: There is no additional latency for segment timestamps, but generating word timestamps incurs additional latency.

- **language** *string* The language of the input audio. Supplying the input language in ISO-639-1 format (e.g. 'en') will improve accuracy and latency. Optional.

- **prompt** *string* An optional text to guide the model's style or continue a previous audio segment. The prompt should match the audio language. Optional.

- **temperature** *number* The sampling temperature, between 0 and 1. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic. If set to 0, the model will use log probability to automatically increase the temperature until certain thresholds are hit. Defaults to 0. Optional.

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