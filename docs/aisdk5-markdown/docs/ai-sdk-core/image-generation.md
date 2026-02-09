AI SDK Core: Image Generation

[](https://vercel.com/)

[

AI SDK



](../../index.html)

-   [Docs](../introduction.html)
-   [Cookbook](../../cookbook.html)
-   [Providers](../../providers/ai-sdk-providers.html)
-   [Playground](../../playground.html)
-   [
    
    AI ElementsAI Elements
    
    ](../../elements/overview.html)
-   [AI GatewayGateway](https://vercel.com/ai-gateway)

AI SDK 5 is available now.

[View Announcement](https://vercel.com/blog/ai-sdk-5)

Menu

[AI SDK by Vercel](../introduction.html)

[Foundations](../foundations.html)

[Overview](../foundations/overview.html)

[Providers and Models](../foundations/providers-and-models.html)

[Prompts](../foundations/prompts.html)

[Tools](../foundations/tools.html)

[Streaming](../foundations/streaming.html)

[Getting Started](../getting-started.html)

[Navigating the Library](../getting-started/navigating-the-library.html)

[Next.js App Router](../getting-started/nextjs-app-router.html)

[Next.js Pages Router](../getting-started/nextjs-pages-router.html)

[Svelte](../getting-started/svelte.html)

[Vue.js (Nuxt)](../getting-started/nuxt.html)

[Node.js](../getting-started/nodejs.html)

[Expo](../getting-started/expo.html)

[Agents](../agents.html)

[Agents](../agents/overview.html)

[Building Agents](../agents/building-agents.html)

[Workflow Patterns](../agents/workflows.html)

[Loop Control](../agents/loop-control.html)

[AI SDK Core](../ai-sdk-core.html)

[Overview](overview.html)

[Generating Text](generating-text.html)

[Generating Structured Data](generating-structured-data.html)

[Tool Calling](tools-and-tool-calling.html)

[Model Context Protocol (MCP) Tools](mcp-tools.html)

[Prompt Engineering](prompt-engineering.html)

[Settings](settings.html)

[Embeddings](embeddings.html)

[Image Generation](image-generation.html)

[Transcription](transcription.html)

[Speech](speech.html)

[Language Model Middleware](middleware.html)

[Provider & Model Management](provider-management.html)

[Error Handling](error-handling.html)

[Testing](testing.html)

[Telemetry](telemetry.html)

[AI SDK UI](../ai-sdk-ui.html)

[Overview](../ai-sdk-ui/overview.html)

[Chatbot](../ai-sdk-ui/chatbot.html)

[Chatbot Message Persistence](../ai-sdk-ui/chatbot-message-persistence.html)

[Chatbot Resume Streams](../ai-sdk-ui/chatbot-resume-streams.html)

[Chatbot Tool Usage](../ai-sdk-ui/chatbot-tool-usage.html)

[Generative User Interfaces](../ai-sdk-ui/generative-user-interfaces.html)

[Completion](../ai-sdk-ui/completion.html)

[Object Generation](../ai-sdk-ui/object-generation.html)

[Streaming Custom Data](../ai-sdk-ui/streaming-data.html)

[Error Handling](../ai-sdk-ui/error-handling.html)

[Transport](../ai-sdk-ui/transport.html)

[Reading UIMessage Streams](../ai-sdk-ui/reading-ui-message-streams.html)

[Message Metadata](../ai-sdk-ui/message-metadata.html)

[Stream Protocols](../ai-sdk-ui/stream-protocol.html)

[AI SDK RSC](../ai-sdk-rsc.html)

[Advanced](../advanced.html)

[Reference](../reference.html)

[AI SDK Core](../reference/ai-sdk-core.html)

[AI SDK UI](../reference/ai-sdk-ui.html)

[AI SDK RSC](../reference/ai-sdk-rsc.html)

[Stream Helpers](../reference/stream-helpers.html)

[AI SDK Errors](../reference/ai-sdk-errors.html)

[Migration Guides](../migration-guides.html)

[Troubleshooting](../troubleshooting.html)

[AI SDK Core](../ai-sdk-core.html)Image Generation

# [Image Generation](#image-generation)

Image generation is an experimental feature.

The AI SDK provides the [`generateImage`](../reference/ai-sdk-core/generate-image.html) function to generate images based on a given prompt using an image model.

```tsx
import { experimental_generateImage as generateImage } from 'ai';
import { openai } from '@ai-sdk/openai';


const { image } = await generateImage({
  model: openai.image('dall-e-3'),
  prompt: 'Santa Claus driving a Cadillac',
});
```

You can access the image data using the `base64` or `uint8Array` properties:

```tsx
const base64 = image.base64; // base64 image data
const uint8Array = image.uint8Array; // Uint8Array image data
```

## [Settings](#settings)

### [Size and Aspect Ratio](#size-and-aspect-ratio)

Depending on the model, you can either specify the size or the aspect ratio.

##### [Size](#size)

The size is specified as a string in the format `{width}x{height}`. Models only support a few sizes, and the supported sizes are different for each model and provider.

```tsx
import { experimental_generateImage as generateImage } from 'ai';
import { openai } from '@ai-sdk/openai';


const { image } = await generateImage({
  model: openai.image('dall-e-3'),
  prompt: 'Santa Claus driving a Cadillac',
  size: '1024x1024',
});
```

##### [Aspect Ratio](#aspect-ratio)

The aspect ratio is specified as a string in the format `{width}:{height}`. Models only support a few aspect ratios, and the supported aspect ratios are different for each model and provider.

```tsx
import { experimental_generateImage as generateImage } from 'ai';
import { vertex } from '@ai-sdk/google-vertex';


const { image } = await generateImage({
  model: vertex.image('imagen-3.0-generate-002'),
  prompt: 'Santa Claus driving a Cadillac',
  aspectRatio: '16:9',
});
```

### [Generating Multiple Images](#generating-multiple-images)

`generateImage` also supports generating multiple images at once:

```tsx
import { experimental_generateImage as generateImage } from 'ai';
import { openai } from '@ai-sdk/openai';


const { images } = await generateImage({
  model: openai.image('dall-e-2'),
  prompt: 'Santa Claus driving a Cadillac',
  n: 4, // number of images to generate
});
```

`generateImage` will automatically call the model as often as needed (in parallel) to generate the requested number of images.

Each image model has an internal limit on how many images it can generate in a single API call. The AI SDK manages this automatically by batching requests appropriately when you request multiple images using the `n` parameter. By default, the SDK uses provider-documented limits (for example, DALL-E 3 can only generate 1 image per call, while DALL-E 2 supports up to 10).

If needed, you can override this behavior using the `maxImagesPerCall` setting when generating your image. This is particularly useful when working with new or custom models where the default batch size might not be optimal:

```tsx
const { images } = await generateImage({
  model: openai.image('dall-e-2'),
  prompt: 'Santa Claus driving a Cadillac',
  maxImagesPerCall: 5, // Override the default batch size
  n: 10, // Will make 2 calls of 5 images each
});
```

### [Providing a Seed](#providing-a-seed)

You can provide a seed to the `generateImage` function to control the output of the image generation process. If supported by the model, the same seed will always produce the same image.

```tsx
import { experimental_generateImage as generateImage } from 'ai';
import { openai } from '@ai-sdk/openai';


const { image } = await generateImage({
  model: openai.image('dall-e-3'),
  prompt: 'Santa Claus driving a Cadillac',
  seed: 1234567890,
});
```

### [Provider-specific Settings](#provider-specific-settings)

Image models often have provider- or even model-specific settings. You can pass such settings to the `generateImage` function using the `providerOptions` parameter. The options for the provider (`openai` in the example below) become request body properties.

```tsx
import { experimental_generateImage as generateImage } from 'ai';
import { openai } from '@ai-sdk/openai';


const { image } = await generateImage({
  model: openai.image('dall-e-3'),
  prompt: 'Santa Claus driving a Cadillac',
  size: '1024x1024',
  providerOptions: {
    openai: { style: 'vivid', quality: 'hd' },
  },
});
```

### [Abort Signals and Timeouts](#abort-signals-and-timeouts)

`generateImage` accepts an optional `abortSignal` parameter of type [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) that you can use to abort the image generation process or set a timeout.

```ts
import { openai } from '@ai-sdk/openai';
import { experimental_generateImage as generateImage } from 'ai';


const { image } = await generateImage({
  model: openai.image('dall-e-3'),
  prompt: 'Santa Claus driving a Cadillac',
  abortSignal: AbortSignal.timeout(1000), // Abort after 1 second
});
```

### [Custom Headers](#custom-headers)

`generateImage` accepts an optional `headers` parameter of type `Record<string, string>` that you can use to add custom headers to the image generation request.

```ts
import { openai } from '@ai-sdk/openai';
import { experimental_generateImage as generateImage } from 'ai';


const { image } = await generateImage({
  model: openai.image('dall-e-3'),
  prompt: 'Santa Claus driving a Cadillac',
  headers: { 'X-Custom-Header': 'custom-value' },
});
```

### [Warnings](#warnings)

If the model returns warnings, e.g. for unsupported parameters, they will be available in the `warnings` property of the response.

```tsx
const { image, warnings } = await generateImage({
  model: openai.image('dall-e-3'),
  prompt: 'Santa Claus driving a Cadillac',
});
```

### [Additional provider-specific meta data](#additional-provider-specific-meta-data)

Some providers expose additional meta data for the result overall or per image.

```tsx
const prompt = 'Santa Claus driving a Cadillac';


const { image, providerMetadata } = await generateImage({
  model: openai.image('dall-e-3'),
  prompt,
});


const revisedPrompt = providerMetadata.openai.images[0]?.revisedPrompt;


console.log({
  prompt,
  revisedPrompt,
});
```

The outer key of the returned `providerMetadata` is the provider name. The inner values are the metadata. An `images` key is always present in the metadata and is an array with the same length as the top level `images` key.

### [Error Handling](#error-handling)

When `generateImage` cannot generate a valid image, it throws a [`AI_NoImageGeneratedError`](../reference/ai-sdk-errors/ai-no-image-generated-error.html).

This error occurs when the AI provider fails to generate an image. It can arise due to the following reasons:

-   The model failed to generate a response
-   The model generated a response that could not be parsed

The error preserves the following information to help you log the issue:

-   `responses`: Metadata about the image model responses, including timestamp, model, and headers.
-   `cause`: The cause of the error. You can use this for more detailed error handling

```ts
import { generateImage, NoImageGeneratedError } from 'ai';


try {
  await generateImage({ model, prompt });
} catch (error) {
  if (NoImageGeneratedError.isInstance(error)) {
    console.log('NoImageGeneratedError');
    console.log('Cause:', error.cause);
    console.log('Responses:', error.responses);
  }
}
```

## [Generating Images with Language Models](#generating-images-with-language-models)

Some language models such as Google `gemini-2.5-flash-image-preview` support multi-modal outputs including images. With such models, you can access the generated images using the `files` property of the response.

```ts
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';


const result = await generateText({
  model: google('gemini-2.5-flash-image-preview'),
  prompt: 'Generate an image of a comic cat',
});


for (const file of result.files) {
  if (file.mediaType.startsWith('image/')) {
    // The file object provides multiple data formats:
    // Access images as base64 string, Uint8Array binary data, or check type
    // - file.base64: string (data URL format)
    // - file.uint8Array: Uint8Array (binary data)
    // - file.mediaType: string (e.g. "image/png")
  }
}
```

## [Image Models](#image-models)

| Provider | Model | Support sizes (`width x height`) or aspect ratios (`width : height`) |
| --- | --- | --- |
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

[Previous

Embeddings

](embeddings.html)

[Next

Transcription

](transcription.html)

On this page

[Image Generation](#image-generation)

[Settings](#settings)

[Size and Aspect Ratio](#size-and-aspect-ratio)

[Size](#size)

[Aspect Ratio](#aspect-ratio)

[Generating Multiple Images](#generating-multiple-images)

[Providing a Seed](#providing-a-seed)

[Provider-specific Settings](#provider-specific-settings)

[Abort Signals and Timeouts](#abort-signals-and-timeouts)

[Custom Headers](#custom-headers)

[Warnings](#warnings)

[Additional provider-specific meta data](#additional-provider-specific-meta-data)

[Error Handling](#error-handling)

[Generating Images with Language Models](#generating-images-with-language-models)

[Image Models](#image-models)

Deploy and Scale AI Apps with Vercel.

Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:

-   OpenAI
-   Photoroom
-   ![leonardo-ai Logo](../../_next/logo-leonardo-ai-light.svg)![leonardo-ai Logo](../../_next/logo-leonardo-ai-dark.svg)
-   ![zapier Logo](../../_next/logo-zapier-light.svg)![zapier Logo](../../_next/logo-zapier-dark.svg)

[](https://vercel.com/contact/sales?utm_source=ai_sdk&utm_medium=web&utm_campaign=contact_sales_cta&utm_content=talk_to_an_expert_sdk_docs)

#### Resources

[Docs](../introduction.html)[Cookbook](../../cookbook.html)[Providers](../../providers/ai-sdk-providers.html)[Showcase](../../showcase.html)[GitHub](https://github.com/vercel/ai)[Discussions](https://github.com/vercel/ai/discussions)

#### More

[Playground](../../playground.html)[](https://v0.dev)[Contact Sales](https://vercel.com/contact/sales)

#### About Vercel

[Next.js + Vercel](https://vercel.com/frameworks/nextjs)[Open Source Software](https://vercel.com/oss)[GitHub](https://github.com/vercel)[X](https://x.com/vercel)

#### Legal

[Privacy Policy](https://vercel.com/legal/privacy-policy)

© 2025 Vercel, Inc.