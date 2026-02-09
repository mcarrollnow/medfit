AI SDK 5 is available now.










Menu






















































































































































































































































































































































































































































































# [xAI Grok Provider](#xai-grok-provider)


## [Setup](#setup)

The xAI Grok provider is available via the `@ai-sdk/xai` module. You can install it with






pnpm







npm







yarn







bun








``` geist-overflow-scroll-y
pnpm add @ai-sdk/xai
```












## [Provider Instance](#provider-instance)

You can import the default provider instance `xai` from `@ai-sdk/xai`:



``` ts
import  from '@ai-sdk/xai';
```


If you need a customized setup, you can import `createXai` from `@ai-sdk/xai` and create a provider instance with your settings:



``` ts
import  from '@ai-sdk/xai';
const xai = createXai();
```


You can use the following optional settings to customize the xAI provider instance:

- **baseURL** *string*

  Use a different URL prefix for API calls, e.g. to use proxy servers. The default prefix is `https://api.x.ai/v1`.

- **apiKey** *string*

  API key that is being sent using the `Authorization` header. It defaults to the `XAI_API_KEY` environment variable.

- **headers** *Record\<string,string\>*

  Custom headers to include in the requests.

- **fetch** *(input: RequestInfo, init?: RequestInit) =\> Promise\<Response\>*


## [Language Models](#language-models)




``` ts
const model = xai('grok-3');
```


### [Example](#example)

You can use xAI language models to generate text with the `generateText` function:



``` ts
import  from '@ai-sdk/xai';import  from 'ai';
const  = await generateText();
```


xAI language models can also be used in the `streamText`, `generateObject`, and `streamObject` functions (see [AI SDK Core](../../docs/ai-sdk-core.html)).

### [Provider Options](#provider-options)

xAI chat models support additional provider options that are not part of the [standard call settings](../../docs/ai-sdk-core/settings.html). You can pass them in the `providerOptions` argument:



``` ts
const model = xai('grok-3-mini');
await generateText(,  },});
```


The following optional provider options are available for xAI chat models:

- **reasoningEffort** *'low' \| 'high'*

  Reasoning effort for reasoning models. Only supported by `grok-3-mini` and `grok-3-mini-fast` models.

## [Live Search](#live-search)

xAI models support Live Search functionality, allowing them to query real-time data from various sources and include it in responses with citations.

### [Basic Search](#basic-search)

To enable search, specify `searchParameters` with a search mode:



``` ts
import  from '@ai-sdk/xai';import  from 'ai';
const  = await generateText(,    },  },});
console.log(text);console.log('Sources:', sources);
```


### [Search Parameters](#search-parameters)

The following search parameters are available:

- **mode** *'auto' \| 'on' \| 'off'*

  Search mode preference:

  - `'auto'` (default): Model decides whether to search
  - `'on'`: Always enables search
  - `'off'`: Disables search completely

- **returnCitations** *boolean*

  Whether to return citations in the response. Defaults to `true`.

- **fromDate** *string*

  Start date for search data in ISO8601 format (`YYYY-MM-DD`).

- **toDate** *string*

  End date for search data in ISO8601 format (`YYYY-MM-DD`).

- **maxSearchResults** *number*

  Maximum number of search results to consider. Defaults to 20, max 50.

- **sources** *Array\<SearchSource\>*

  Data sources to search from. Defaults to `["web", "x"]` if not specified.

### [Search Sources](#search-sources)

You can specify different types of data sources for search:

#### [Web Search](#web-search)



``` ts
const result = await generateText(,        ],      },    },  },});
```


#### [Web source parameters](#web-source-parameters)

- **country** *string*: ISO alpha-2 country code
- **allowedWebsites** *string\[\]*: Max 5 allowed websites
- **excludedWebsites** *string\[\]*: Max 5 excluded websites
- **safeSearch** *boolean*: Enable safe search (default: true)

#### [X (Twitter) Search](#x-twitter-search)



``` ts
const result = await generateText(,        ],      },    },  },});
```


#### [X source parameters](#x-source-parameters)

- **includedXHandles** *string\[\]*: Array of X handles to search (without @ symbol)
- **excludedXHandles** *string\[\]*: Array of X handles to exclude from search (without @ symbol)
- **postFavoriteCount** *number*: Minimum favorite count of the X posts to consider.
- **postViewCount** *number*: Minimum view count of the X posts to consider.

#### [News Search](#news-search)



``` ts
const result = await generateText(,        ],      },    },  },});
```


#### [News source parameters](#news-source-parameters)

- **country** *string*: ISO alpha-2 country code
- **excludedWebsites** *string\[\]*: Max 5 excluded websites
- **safeSearch** *boolean*: Enable safe search (default: true)

#### [RSS Feed Search](#rss-feed-search)



``` ts
const result = await generateText(,        ],      },    },  },});
```


#### [RSS source parameters](#rss-source-parameters)

- **links** *string\[\]*: Array of RSS feed URLs (max 1 currently supported)

### [Multiple Sources](#multiple-sources)

You can combine multiple data sources in a single search:



``` ts
const result = await generateText(,          ,          ,        ],      },    },  },});
```


### [Sources and Citations](#sources-and-citations)

When search is enabled with `returnCitations: true`, the response includes sources that were used to generate the answer:



``` ts
const  = await generateText(,    },  },});
// Access the sources usedfor (const source of sources) }
```


### [Streaming with Search](#streaming-with-search)

Live Search works with streaming responses. Citations are included when the stream completes:



``` ts
import  from 'ai';
const result = streamText(,    },  },});
for await (const textPart of result.textStream) 
console.log('Sources:', await result.sources);
```


## [Model Capabilities](#model-capabilities)


| Model | Image Input | Object Generation | Tool Usage | Tool Streaming | Reasoning |
|----|----|----|----|----|----|








## [Image Models](#image-models)

You can create xAI image models using the `.image()` factory method. For more on image generation with the AI SDK see [generateImage()](../../docs/reference/ai-sdk-core/generate-image.html).



``` ts
import  from '@ai-sdk/xai';import  from 'ai';
const  = await generateImage();
```





The xAI image model does not currently support the `aspectRatio` or `size` parameters. Image size defaults to 1024x768.



### [Model-specific options](#model-specific-options)

You can customize the image generation behavior with model-specific settings:



``` ts
import  from '@ai-sdk/xai';import  from 'ai';
const  = await generateImage();
```


### [Model Capabilities](#model-capabilities-1)


| Model | Sizes | Notes |
|----|----|----|
| `grok-2-image` | 1024x768 (default) | xAI's text-to-image generation model, designed to create high-quality images from text prompts. It's trained on a diverse dataset and can generate images across various styles, subjects, and settings. |

















On this page





























































































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.