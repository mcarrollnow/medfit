AI SDK 5 is available now.










Menu






















































































































































































































































































































































































































































































# [Fireworks Provider](#fireworks-provider)


## [Setup](#setup)

The Fireworks provider is available via the `@ai-sdk/fireworks` module. You can install it with






pnpm







npm







yarn







bun








``` geist-overflow-scroll-y
pnpm add @ai-sdk/fireworks
```












## [Provider Instance](#provider-instance)

You can import the default provider instance `fireworks` from `@ai-sdk/fireworks`:



``` ts
import  from '@ai-sdk/fireworks';
```


If you need a customized setup, you can import `createFireworks` from `@ai-sdk/fireworks` and create a provider instance with your settings:



``` ts
import  from '@ai-sdk/fireworks';
const fireworks = createFireworks();
```


You can use the following optional settings to customize the Fireworks provider instance:

- **baseURL** *string*

  Use a different URL prefix for API calls, e.g. to use proxy servers. The default prefix is `https://api.fireworks.ai/inference/v1`.

- **apiKey** *string*

  API key that is being sent using the `Authorization` header. It defaults to the `FIREWORKS_API_KEY` environment variable.

- **headers** *Record\<string,string\>*

  Custom headers to include in the requests.

- **fetch** *(input: RequestInfo, init?: RequestInit) =\> Promise\<Response\>*


## [Language Models](#language-models)




``` ts
const model = fireworks('accounts/fireworks/models/firefunction-v1');
```


### [Reasoning Models](#reasoning-models)

Fireworks exposes the thinking of `deepseek-r1` in the generated text using the `<think>` tag. You can use the `extractReasoningMiddleware` to extract this reasoning and expose it as a `reasoning` property on the result:



``` ts
import  from '@ai-sdk/fireworks';import  from 'ai';
const enhancedModel = wrapLanguageModel(),});
```


You can then use that enhanced model in functions like `generateText` and `streamText`.

### [Example](#example)

You can use Fireworks language models to generate text with the `generateText` function:



``` ts
import  from '@ai-sdk/fireworks';import  from 'ai';
const  = await generateText();
```


Fireworks language models can also be used in the `streamText` function (see [AI SDK Core](../../docs/ai-sdk-core.html)).

### [Completion Models](#completion-models)

You can create models that call the Fireworks completions API using the `.completion()` factory method:



``` ts
const model = fireworks.completion('accounts/fireworks/models/firefunction-v1');
```


### [Model Capabilities](#model-capabilities)


| Model | Image Input | Object Generation | Tool Usage | Tool Streaming |
|----|----|----|----|----|








## [Embedding Models](#embedding-models)

You can create models that call the Fireworks embeddings API using the `.textEmbedding()` factory method:



``` ts
const model = fireworks.textEmbedding('nomic-ai/nomic-embed-text-v1.5');
```


You can use Fireworks embedding models to generate embeddings with the `embed` function:



``` ts
import  from '@ai-sdk/fireworks';import  from 'ai';
const  = await embed();
```


### [Model Capabilities](#model-capabilities-1)


| Model                            | Dimensions | Max Tokens |
|----------------------------------|------------|------------|
| `nomic-ai/nomic-embed-text-v1.5` | 768        | 8192       |








## [Image Models](#image-models)

You can create Fireworks image models using the `.image()` factory method. For more on image generation with the AI SDK see [generateImage()](../../docs/reference/ai-sdk-core/generate-image.html).



``` ts
import  from '@ai-sdk/fireworks';import  from 'ai';
const  = await generateImage();
```








### [Model Capabilities](#model-capabilities-2)

For all models supporting aspect ratios, the following aspect ratios are supported:

`1:1 (default), 2:3, 3:2, 4:5, 5:4, 16:9, 9:16, 9:21, 21:9`

For all models supporting size, the following sizes are supported:

`640 x 1536, 768 x 1344, 832 x 1216, 896 x 1152, 1024x1024 (default), 1152 x 896, 1216 x 832, 1344 x 768, 1536 x 640`


| Model | Dimensions Specification |
|----|----|
| `accounts/fireworks/models/flux-1-dev-fp8` | Aspect Ratio |
| `accounts/fireworks/models/flux-1-schnell-fp8` | Aspect Ratio |
| `accounts/fireworks/models/playground-v2-5-1024px-aesthetic` | Size |
| `accounts/fireworks/models/japanese-stable-diffusion-xl` | Size |
| `accounts/fireworks/models/playground-v2-1024px-aesthetic` | Size |
| `accounts/fireworks/models/SSD-1B` | Size |
| `accounts/fireworks/models/stable-diffusion-xl-1024-v1-0` | Size |



#### [Stability AI Models](#stability-ai-models)

Fireworks also presents several Stability AI models backed by Stability AI API keys and endpoint. The AI SDK Fireworks provider does not currently include support for these models:


| Model ID                               |
|----------------------------------------|
| `accounts/stability/models/sd3-turbo`  |
| `accounts/stability/models/sd3-medium` |
| `accounts/stability/models/sd3`        |

















On this page

























































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.