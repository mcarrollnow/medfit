AI SDK 5 is available now.










Menu






















































































































































































































































































































































# [Image Generation](#image-generation)






The AI SDK provides the [`generateImage`](../reference/ai-sdk-core/generate-image.html) function to generate images based on a given prompt using an image model.



``` tsx
import  from 'ai';import  from '@ai-sdk/openai';
const  = await generateImage();
```


You can access the image data using the `base64` or `uint8Array` properties:



``` tsx
const base64 = image.base64; // base64 image dataconst uint8Array = image.uint8Array; // Uint8Array image data
```


## [Settings](#settings)

### [Size and Aspect Ratio](#size-and-aspect-ratio)

Depending on the model, you can either specify the size or the aspect ratio.

##### [Size](#size)

The size is specified as a string in the format `x`. Models only support a few sizes, and the supported sizes are different for each model and provider.



``` tsx
import  from 'ai';import  from '@ai-sdk/openai';
const  = await generateImage();
```


##### [Aspect Ratio](#aspect-ratio)

The aspect ratio is specified as a string in the format `:`. Models only support a few aspect ratios, and the supported aspect ratios are different for each model and provider.



``` tsx
import  from 'ai';import  from '@ai-sdk/google-vertex';
const  = await generateImage();
```


### [Generating Multiple Images](#generating-multiple-images)

`generateImage` also supports generating multiple images at once:



``` tsx
import  from 'ai';import  from '@ai-sdk/openai';
const  = await generateImage();
```





`generateImage` will automatically call the model as often as needed (in parallel) to generate the requested number of images.



Each image model has an internal limit on how many images it can generate in a single API call. The AI SDK manages this automatically by batching requests appropriately when you request multiple images using the `n` parameter. By default, the SDK uses provider-documented limits (for example, DALL-E 3 can only generate 1 image per call, while DALL-E 2 supports up to 10).

If needed, you can override this behavior using the `maxImagesPerCall` setting when generating your image. This is particularly useful when working with new or custom models where the default batch size might not be optimal:



``` tsx
const  = await generateImage();
```


### [Providing a Seed](#providing-a-seed)

You can provide a seed to the `generateImage` function to control the output of the image generation process. If supported by the model, the same seed will always produce the same image.



``` tsx
import  from 'ai';import  from '@ai-sdk/openai';
const  = await generateImage();
```


### [Provider-specific Settings](#provider-specific-settings)

Image models often have provider- or even model-specific settings. You can pass such settings to the `generateImage` function using the `providerOptions` parameter. The options for the provider (`openai` in the example below) become request body properties.



``` tsx
import  from 'ai';import  from '@ai-sdk/openai';
const  = await generateImage(,  },});
```


### [Abort Signals and Timeouts](#abort-signals-and-timeouts)




``` ts
import  from '@ai-sdk/openai';import  from 'ai';
const  = await generateImage();
```


### [Custom Headers](#custom-headers)

`generateImage` accepts an optional `headers` parameter of type `Record<string, string>` that you can use to add custom headers to the image generation request.



``` ts
import  from '@ai-sdk/openai';import  from 'ai';
const  = await generateImage(,});
```


### [Warnings](#warnings)

If the model returns warnings, e.g. for unsupported parameters, they will be available in the `warnings` property of the response.



``` tsx
const  = await generateImage();
```


### [Additional provider-specific meta data](#additional-provider-specific-meta-data)

Some providers expose additional meta data for the result overall or per image.



``` tsx
const prompt = 'Santa Claus driving a Cadillac';
const  = await generateImage();
const revisedPrompt = providerMetadata.openai.images[0]?.revisedPrompt;
console.log();
```


The outer key of the returned `providerMetadata` is the provider name. The inner values are the metadata. An `images` key is always present in the metadata and is an array with the same length as the top level `images` key.

### [Error Handling](#error-handling)

When `generateImage` cannot generate a valid image, it throws a [`AI_NoImageGeneratedError`](../reference/ai-sdk-errors/ai-no-image-generated-error.html).

This error occurs when the AI provider fails to generate an image. It can arise due to the following reasons:

- The model failed to generate a response
- The model generated a response that could not be parsed

The error preserves the following information to help you log the issue:

- `responses`: Metadata about the image model responses, including timestamp, model, and headers.
- `cause`: The cause of the error. You can use this for more detailed error handling



``` ts
import  from 'ai';
try );} catch (error) }
```


## [Generating Images with Language Models](#generating-images-with-language-models)

Some language models such as Google `gemini-2.5-flash-image-preview` support multi-modal outputs including images. With such models, you can access the generated images using the `files` property of the response.



``` ts
import  from '@ai-sdk/google';import  from 'ai';
const result = await generateText();
for (const file of result.files) }
```


## [Image Models](#image-models)


| Provider | Model | Support sizes (`width x height`) or aspect ratios (`width : height`) |
|----|----|----|
| [xAI Grok](../../providers/ai-sdk-providers/xai.html#image-models) | `grok-2-image` | 1024x768 (default) |
| [OpenAI](../../providers/ai-sdk-providers/openai.html#image-models) | `gpt-image-1` | 1024x1024, 1536x1024, 1024x1536 |
| [OpenAI](../../providers/ai-sdk-providers/openai.html#image-models) | `dall-e-3` | 1024x1024, 1792x1024, 1024x1792 |
| [OpenAI](../../providers/ai-sdk-providers/openai.html#image-models) | `dall-e-2` | 256x256, 512x512, 1024x1024 |
| [Amazon Bedrock](../../providers/ai-sdk-providers/amazon-bedrock.html#image-models) | `amazon.nova-canvas-v1:0` | 320-4096 (multiples of 16), 1:4 to 4:1, max 4.2M pixels |
| [Fal](../../providers/ai-sdk-providers/fal.html#image-models) | `fal-ai/flux/dev` | 1:1, 3:4, 4:3, 9:16, 16:9, 9:21, 21:9 |
| [Fal](../../providers/ai-sdk-providers/fal.html#image-models) | `fal-ai/flux-lora` | 1:1, 3:4, 4:3, 9:16, 16:9, 9:21, 21:9 |
| [Fal](../../providers/ai-sdk-providers/fal.html#image-models) | `fal-ai/fast-sdxl` | 1:1, 3:4, 4:3, 9:16, 16:9, 9:21, 21:9 |
| [Fal](../../providers/ai-sdk-providers/fal.html#image-models) | `fal-ai/flux-pro/v1.1-ultra` | 1:1, 3:4, 4:3, 9:16, 16:9, 9:21, 21:9 |
| [Fal](../../providers/ai-sdk-providers/fal.html#image-models) | `fal-ai/ideogram/v2` | 1:1, 3:4, 4:3, 9:16, 16:9, 9:21, 21:9 |
| [Fal](../../providers/ai-sdk-providers/fal.html#image-models) | `fal-ai/recraft-v3` | 1:1, 3:4, 4:3, 9:16, 16:9, 9:21, 21:9 |
| [Fal](../../providers/ai-sdk-providers/fal.html#image-models) | `fal-ai/stable-diffusion-3.5-large` | 1:1, 3:4, 4:3, 9:16, 16:9, 9:21, 21:9 |
| [Fal](../../providers/ai-sdk-providers/fal.html#image-models) | `fal-ai/hyper-sdxl` | 1:1, 3:4, 4:3, 9:16, 16:9, 9:21, 21:9 |
| [DeepInfra](../../providers/ai-sdk-providers/deepinfra.html#image-models) | `stabilityai/sd3.5` | 1:1, 16:9, 1:9, 3:2, 2:3, 4:5, 5:4, 9:16, 9:21 |
| [DeepInfra](../../providers/ai-sdk-providers/deepinfra.html#image-models) | `black-forest-labs/FLUX-1.1-pro` | 256-1440 (multiples of 32) |
| [DeepInfra](../../providers/ai-sdk-providers/deepinfra.html#image-models) | `black-forest-labs/FLUX-1-schnell` | 256-1440 (multiples of 32) |
| [DeepInfra](../../providers/ai-sdk-providers/deepinfra.html#image-models) | `black-forest-labs/FLUX-1-dev` | 256-1440 (multiples of 32) |
| [DeepInfra](../../providers/ai-sdk-providers/deepinfra.html#image-models) | `black-forest-labs/FLUX-pro` | 256-1440 (multiples of 32) |
| [DeepInfra](../../providers/ai-sdk-providers/deepinfra.html#image-models) | `stabilityai/sd3.5-medium` | 1:1, 16:9, 1:9, 3:2, 2:3, 4:5, 5:4, 9:16, 9:21 |
| [DeepInfra](../../providers/ai-sdk-providers/deepinfra.html#image-models) | `stabilityai/sdxl-turbo` | 1:1, 16:9, 1:9, 3:2, 2:3, 4:5, 5:4, 9:16, 9:21 |
| [Replicate](../../providers/ai-sdk-providers/replicate.html) | `black-forest-labs/flux-schnell` | 1:1, 2:3, 3:2, 4:5, 5:4, 16:9, 9:16, 9:21, 21:9 |
| [Replicate](../../providers/ai-sdk-providers/replicate.html) | `recraft-ai/recraft-v3` | 1024x1024, 1365x1024, 1024x1365, 1536x1024, 1024x1536, 1820x1024, 1024x1820, 1024x2048, 2048x1024, 1434x1024, 1024x1434, 1024x1280, 1280x1024, 1024x1707, 1707x1024 |
| [Google](../reference/stream-helpers/google-generative-ai-stream.html#image-models) | `imagen-3.0-generate-002` | 1:1, 3:4, 4:3, 9:16, 16:9 |
| [Google Vertex](../../providers/ai-sdk-providers/google-vertex.html#image-models) | `imagen-3.0-generate-002` | 1:1, 3:4, 4:3, 9:16, 16:9 |
| [Google Vertex](../../providers/ai-sdk-providers/google-vertex.html#image-models) | `imagen-3.0-fast-generate-001` | 1:1, 3:4, 4:3, 9:16, 16:9 |
| [Fireworks](../../providers/ai-sdk-providers/fireworks.html#image-models) | `accounts/fireworks/models/flux-1-dev-fp8` | 1:1, 2:3, 3:2, 4:5, 5:4, 16:9, 9:16, 9:21, 21:9 |
| [Fireworks](../../providers/ai-sdk-providers/fireworks.html#image-models) | `accounts/fireworks/models/flux-1-schnell-fp8` | 1:1, 2:3, 3:2, 4:5, 5:4, 16:9, 9:16, 9:21, 21:9 |
| [Fireworks](../../providers/ai-sdk-providers/fireworks.html#image-models) | `accounts/fireworks/models/playground-v2-5-1024px-aesthetic` | 640x1536, 768x1344, 832x1216, 896x1152, 1024x1024, 1152x896, 1216x832, 1344x768, 1536x640 |
| [Fireworks](../../providers/ai-sdk-providers/fireworks.html#image-models) | `accounts/fireworks/models/japanese-stable-diffusion-xl` | 640x1536, 768x1344, 832x1216, 896x1152, 1024x1024, 1152x896, 1216x832, 1344x768, 1536x640 |
| [Fireworks](../../providers/ai-sdk-providers/fireworks.html#image-models) | `accounts/fireworks/models/playground-v2-1024px-aesthetic` | 640x1536, 768x1344, 832x1216, 896x1152, 1024x1024, 1152x896, 1216x832, 1344x768, 1536x640 |
| [Fireworks](../../providers/ai-sdk-providers/fireworks.html#image-models) | `accounts/fireworks/models/SSD-1B` | 640x1536, 768x1344, 832x1216, 896x1152, 1024x1024, 1152x896, 1216x832, 1344x768, 1536x640 |
| [Fireworks](../../providers/ai-sdk-providers/fireworks.html#image-models) | `accounts/fireworks/models/stable-diffusion-xl-1024-v1-0` | 640x1536, 768x1344, 832x1216, 896x1152, 1024x1024, 1152x896, 1216x832, 1344x768, 1536x640 |
| [Luma](../../providers/ai-sdk-providers/luma.html#image-models) | `photon-1` | 1:1, 3:4, 4:3, 9:16, 16:9, 9:21, 21:9 |
| [Luma](../../providers/ai-sdk-providers/luma.html#image-models) | `photon-flash-1` | 1:1, 3:4, 4:3, 9:16, 16:9, 9:21, 21:9 |
| [Together.ai](../../providers/ai-sdk-providers/togetherai.html#image-models) | `stabilityai/stable-diffusion-xl-base-1.0` | 512x512, 768x768, 1024x1024 |
| [Together.ai](../../providers/ai-sdk-providers/togetherai.html#image-models) | `black-forest-labs/FLUX.1-dev` | 512x512, 768x768, 1024x1024 |
| [Together.ai](../../providers/ai-sdk-providers/togetherai.html#image-models) | `black-forest-labs/FLUX.1-dev-lora` | 512x512, 768x768, 1024x1024 |
| [Together.ai](../../providers/ai-sdk-providers/togetherai.html#image-models) | `black-forest-labs/FLUX.1-schnell` | 512x512, 768x768, 1024x1024 |
| [Together.ai](../../providers/ai-sdk-providers/togetherai.html#image-models) | `black-forest-labs/FLUX.1-canny` | 512x512, 768x768, 1024x1024 |
| [Together.ai](../../providers/ai-sdk-providers/togetherai.html#image-models) | `black-forest-labs/FLUX.1-depth` | 512x512, 768x768, 1024x1024 |
| [Together.ai](../../providers/ai-sdk-providers/togetherai.html#image-models) | `black-forest-labs/FLUX.1-redux` | 512x512, 768x768, 1024x1024 |
| [Together.ai](../../providers/ai-sdk-providers/togetherai.html#image-models) | `black-forest-labs/FLUX.1.1-pro` | 512x512, 768x768, 1024x1024 |
| [Together.ai](../../providers/ai-sdk-providers/togetherai.html#image-models) | `black-forest-labs/FLUX.1-pro` | 512x512, 768x768, 1024x1024 |
| [Together.ai](../../providers/ai-sdk-providers/togetherai.html#image-models) | `black-forest-labs/FLUX.1-schnell-Free` | 512x512, 768x768, 1024x1024 |


Above are a small subset of the image models supported by the AI SDK providers. For more, see the respective provider documentation.
















On this page



























































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.