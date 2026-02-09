AI SDK 5 is available now.










Menu






















































































































































































































































































































































































































































































# [Together.ai Provider](#togetherai-provider)


## [Setup](#setup)

The Together.ai provider is available via the `@ai-sdk/togetherai` module. You can install it with






pnpm







npm







yarn







bun








``` geist-overflow-scroll-y
pnpm add @ai-sdk/togetherai
```












## [Provider Instance](#provider-instance)

You can import the default provider instance `togetherai` from `@ai-sdk/togetherai`:



``` ts
import  from '@ai-sdk/togetherai';
```


If you need a customized setup, you can import `createTogetherAI` from `@ai-sdk/togetherai` and create a provider instance with your settings:



``` ts
import  from '@ai-sdk/togetherai';
const togetherai = createTogetherAI();
```


You can use the following optional settings to customize the Together.ai provider instance:

- **baseURL** *string*

  Use a different URL prefix for API calls, e.g. to use proxy servers. The default prefix is `https://api.together.xyz/v1`.

- **apiKey** *string*

  API key that is being sent using the `Authorization` header. It defaults to the `TOGETHER_AI_API_KEY` environment variable.

- **headers** *Record\<string,string\>*

  Custom headers to include in the requests.

- **fetch** *(input: RequestInfo, init?: RequestInit) =\> Promise\<Response\>*


## [Language Models](#language-models)




``` ts
const model = togetherai('google/gemma-2-9b-it');
```


### [Reasoning Models](#reasoning-models)

Together.ai exposes the thinking of `deepseek-ai/DeepSeek-R1` in the generated text using the `<think>` tag. You can use the `extractReasoningMiddleware` to extract this reasoning and expose it as a `reasoning` property on the result:



``` ts
import  from '@ai-sdk/togetherai';import  from 'ai';
const enhancedModel = wrapLanguageModel(),});
```


You can then use that enhanced model in functions like `generateText` and `streamText`.

### [Example](#example)

You can use Together.ai language models to generate text with the `generateText` function:



``` ts
import  from '@ai-sdk/togetherai';import  from 'ai';
const  = await generateText();
```


Together.ai language models can also be used in the `streamText` function (see [AI SDK Core](../../docs/ai-sdk-core.html)).


## [Model Capabilities](#model-capabilities)


| Model | Image Input | Object Generation | Tool Usage | Tool Streaming |
|----|----|----|----|----|








## [Image Models](#image-models)

You can create Together.ai image models using the `.image()` factory method. For more on image generation with the AI SDK see [generateImage()](../../docs/reference/ai-sdk-core/generate-image.html).



``` ts
import  from '@ai-sdk/togetherai';import  from 'ai';
const  = await generateImage();
```


You can pass optional provider-specific request parameters using the `providerOptions` argument.



``` ts
import  from '@ai-sdk/togetherai';import  from 'ai';
const  = await generateImage(,  },});
```



### [Model Capabilities](#model-capabilities-1)

Together.ai image models support various image dimensions that vary by model. Common sizes include 512x512, 768x768, and 1024x1024, with some models supporting up to 1792x1792. The default size is 1024x1024.


| Available Models                           |
|--------------------------------------------|
| `stabilityai/stable-diffusion-xl-base-1.0` |
| `black-forest-labs/FLUX.1-dev`             |
| `black-forest-labs/FLUX.1-dev-lora`        |
| `black-forest-labs/FLUX.1-schnell`         |
| `black-forest-labs/FLUX.1-canny`           |
| `black-forest-labs/FLUX.1-depth`           |
| `black-forest-labs/FLUX.1-redux`           |
| `black-forest-labs/FLUX.1.1-pro`           |
| `black-forest-labs/FLUX.1-pro`             |
| `black-forest-labs/FLUX.1-schnell-Free`    |








## [Embedding Models](#embedding-models)

You can create Together.ai embedding models using the `.textEmbedding()` factory method. For more on embedding models with the AI SDK see [embed()](../../docs/reference/ai-sdk-core/embed.html).



``` ts
import  from '@ai-sdk/togetherai';import  from 'ai';
const  = await embed();
```


### [Model Capabilities](#model-capabilities-2)


| Model                                            | Dimensions | Max Tokens |
|--------------------------------------------------|------------|------------|
| `togethercomputer/m2-bert-80M-2k-retrieval`      | 768        | 2048       |
| `togethercomputer/m2-bert-80M-8k-retrieval`      | 768        | 8192       |
| `togethercomputer/m2-bert-80M-32k-retrieval`     | 768        | 32768      |
| `WhereIsAI/UAE-Large-V1`                         | 1024       | 512        |
| `BAAI/bge-large-en-v1.5`                         | 1024       | 512        |
| `BAAI/bge-base-en-v1.5`                          | 768        | 512        |
| `sentence-transformers/msmarco-bert-base-dot-v5` | 768        | 512        |
| `bert-base-uncased`                              | 768        | 512        |























On this page

















































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.