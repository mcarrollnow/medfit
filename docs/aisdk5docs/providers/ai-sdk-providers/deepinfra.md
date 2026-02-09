AI SDK 5 is available now.










Menu






















































































































































































































































































































































































































































































# [DeepInfra Provider](#deepinfra-provider)


## [Setup](#setup)

The DeepInfra provider is available via the `@ai-sdk/deepinfra` module. You can install it with:






pnpm







npm







yarn







bun








``` geist-overflow-scroll-y
pnpm add @ai-sdk/deepinfra
```












## [Provider Instance](#provider-instance)

You can import the default provider instance `deepinfra` from `@ai-sdk/deepinfra`:



``` ts
import  from '@ai-sdk/deepinfra';
```


If you need a customized setup, you can import `createDeepInfra` from `@ai-sdk/deepinfra` and create a provider instance with your settings:



``` ts
import  from '@ai-sdk/deepinfra';
const deepinfra = createDeepInfra();
```


You can use the following optional settings to customize the DeepInfra provider instance:

- **baseURL** *string*

  Use a different URL prefix for API calls, e.g. to use proxy servers. The default prefix is `https://api.deepinfra.com/v1`.

  Note: Language models and embeddings use OpenAI-compatible endpoints at `/openai`, while image models use `/inference`.

- **apiKey** *string*

  API key that is being sent using the `Authorization` header. It defaults to the `DEEPINFRA_API_KEY` environment variable.

- **headers** *Record\<string,string\>*

  Custom headers to include in the requests.

- **fetch** *(input: RequestInfo, init?: RequestInit) =\> Promise\<Response\>*


## [Language Models](#language-models)

You can create language models using a provider instance. The first argument is the model ID, for example:



``` ts
import  from '@ai-sdk/deepinfra';import  from 'ai';
const  = await generateText();
```


DeepInfra language models can also be used in the `streamText` function (see [AI SDK Core](../../docs/ai-sdk-core.html)).

## [Model Capabilities](#model-capabilities)


| Model | Image Input | Object Generation | Tool Usage | Tool Streaming |
|----|----|----|----|----|








## [Image Models](#image-models)

You can create DeepInfra image models using the `.image()` factory method. For more on image generation with the AI SDK see [generateImage()](../../docs/reference/ai-sdk-core/generate-image.html).



``` ts
import  from '@ai-sdk/deepinfra';import  from 'ai';
const  = await generateImage();
```








### [Model-specific options](#model-specific-options)

You can pass model-specific parameters using the `providerOptions.deepinfra` field:



``` ts
import  from '@ai-sdk/deepinfra';import  from 'ai';
const  = await generateImage(,  },});
```


### [Model Capabilities](#model-capabilities-1)

For models supporting aspect ratios, the following ratios are typically supported: `1:1 (default), 16:9, 1:9, 3:2, 2:3, 4:5, 5:4, 9:16, 9:21`

For models supporting size parameters, dimensions must typically be:

- Multiples of 32
- Width and height between 256 and 1440 pixels
- Default size is 1024x1024


| Model | Dimensions Specification | Notes |
|----|----|----|
| `stabilityai/sd3.5` | Aspect Ratio | Premium quality base model, 8B parameters |
| `black-forest-labs/FLUX-1.1-pro` | Size | Latest state-of-art model with superior prompt following |
| `black-forest-labs/FLUX-1-schnell` | Size | Fast generation in 1-4 steps |
| `black-forest-labs/FLUX-1-dev` | Size | Optimized for anatomical accuracy |
| `black-forest-labs/FLUX-pro` | Size | Flagship Flux model |
| `stabilityai/sd3.5-medium` | Aspect Ratio | Balanced 2.5B parameter model |
| `stabilityai/sdxl-turbo` | Aspect Ratio | Optimized for fast generation |



## [Embedding Models](#embedding-models)

You can create DeepInfra embedding models using the `.textEmbedding()` factory method. For more on embedding models with the AI SDK see [embed()](../../docs/reference/ai-sdk-core/embed.html).



``` ts
import  from '@ai-sdk/deepinfra';import  from 'ai';
const  = await embed();
```


### [Model Capabilities](#model-capabilities-2)


| Model | Dimensions | Max Tokens |
|----|----|----|
| `BAAI/bge-base-en-v1.5` | 768 | 512 |
| `BAAI/bge-large-en-v1.5` | 1024 | 512 |
| `BAAI/bge-m3` | 1024 | 8192 |
| `intfloat/e5-base-v2` | 768 | 512 |
| `intfloat/e5-large-v2` | 1024 | 512 |
| `intfloat/multilingual-e5-large` | 1024 | 512 |
| `sentence-transformers/all-MiniLM-L12-v2` | 384 | 256 |
| `sentence-transformers/all-MiniLM-L6-v2` | 384 | 256 |
| `sentence-transformers/all-mpnet-base-v2` | 768 | 384 |
| `sentence-transformers/clip-ViT-B-32` | 512 | 77 |
| `sentence-transformers/clip-ViT-B-32-multilingual-v1` | 512 | 77 |
| `sentence-transformers/multi-qa-mpnet-base-dot-v1` | 768 | 512 |
| `sentence-transformers/paraphrase-MiniLM-L6-v2` | 384 | 128 |
| `shibing624/text2vec-base-chinese` | 768 | 512 |
| `thenlper/gte-base` | 768 | 512 |
| `thenlper/gte-large` | 1024 | 512 |























On this page












































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.