AI SDK Providers: Luma

[](https://vercel.com/)

[

AI SDK



](../../index.html)

-   [Docs](../../docs/introduction.html)
-   [Cookbook](../../cookbook.html)
-   [Providers](../ai-sdk-providers.html)
-   [Playground](../../playground.html)
-   [
    
    AI ElementsAI Elements
    
    ](../../elements/overview.html)
-   [AI GatewayGateway](https://vercel.com/ai-gateway)

AI SDK 5 is available now.

[View Announcement](https://vercel.com/blog/ai-sdk-5)

Menu

[AI SDK Providers](../ai-sdk-providers.html)

[AI Gateway](ai-gateway.html)

[xAI Grok](xai.html)

[Vercel](vercel.html)

[OpenAI](openai.html)

[Azure OpenAI](azure.html)

[Anthropic](anthropic.html)

[Amazon Bedrock](amazon-bedrock.html)

[Groq](groq.html)

[Fal](fal.html)

[DeepInfra](deepinfra.html)

[Google Generative AI](google-generative-ai.html)

[Google Vertex AI](google-vertex.html)

[Mistral AI](mistral.html)

[Together.ai](togetherai.html)

[Cohere](cohere.html)

[Fireworks](fireworks.html)

[DeepSeek](deepseek.html)

[Cerebras](cerebras.html)

[Replicate](replicate.html)

[Perplexity](perplexity.html)

[Luma](luma.html)

[ElevenLabs](elevenlabs.html)

[AssemblyAI](assemblyai.html)

[Deepgram](deepgram.html)

[Gladia](gladia.html)

[LMNT](lmnt.html)

[Hume](hume.html)

[Rev.ai](revai.html)

[Baseten](baseten.html)

[Hugging Face](huggingface.html)

[OpenAI Compatible Providers](../openai-compatible-providers.html)

[Writing a Custom Provider](../openai-compatible-providers/custom-providers.html)

[LM Studio](../openai-compatible-providers/lmstudio.html)

[NVIDIA NIM](../openai-compatible-providers/nim.html)

[Heroku](../openai-compatible-providers/heroku.html)

[Community Providers](../community-providers.html)

[Writing a Custom Provider](../community-providers/custom-providers.html)

[Qwen](../community-providers/qwen.html)

[Ollama](../community-providers/ollama.html)

[A2A](../community-providers/a2a.html)

[Requesty](../community-providers/requesty.html)

[FriendliAI](../community-providers/friendliai.html)

[Portkey](../community-providers/portkey.html)

[Cloudflare Workers AI](../community-providers/cloudflare-workers-ai.html)

[Cloudflare AI Gateway](../community-providers/cloudflare-ai-gateway.html)

[OpenRouter](../community-providers/openrouter.html)

[Azure AI](../community-providers/azure-ai.html)

[Aihubmix](../community-providers/aihubmix.html)

[SAP AI Core](../community-providers/sap-ai.html)

[Crosshatch](../community-providers/crosshatch.html)

[Mixedbread](../community-providers/mixedbread.html)

[Voyage AI](../community-providers/voyage-ai.html)

[Jina AI](../community-providers/jina-ai.html)

[Mem0](../community-providers/mem0.html)

[Letta](../community-providers/letta.html)

[Supermemory](../community-providers/supermemory.html)

[React Native Apple](../community-providers/react-native-apple.html)

[Anthropic Vertex](../community-providers/anthropic-vertex-ai.html)

[Spark](../community-providers/spark.html)

[Inflection AI](../community-providers/inflection-ai.html)

[LangDB](../community-providers/langdb.html)

[Zhipu AI](../community-providers/zhipu.html)

[SambaNova](../community-providers/sambanova.html)

[Dify](../community-providers/dify.html)

[Sarvam](../community-providers/sarvam.html)

[AI/ML API](../community-providers/aimlapi.html)

[Claude Code](../community-providers/claude-code.html)

[Built-in AI](../community-providers/built-in-ai.html)

[Gemini CLI](../community-providers/gemini-cli.html)

[Automatic1111](../community-providers/automatic1111.html)

[Adapters](../adapters.html)

[LangChain](../adapters/langchain.html)

[LlamaIndex](../adapters/llamaindex.html)

[Observability Integrations](../observability.html)

[Axiom](../observability/axiom.html)

[Braintrust](../observability/braintrust.html)

[Helicone](../observability/helicone.html)

[Laminar](../observability/laminar.html)

[Langfuse](../observability/langfuse.html)

[LangSmith](../observability/langsmith.html)

[LangWatch](../observability/langwatch.html)

[Maxim](../observability/maxim.html)

[Patronus](../observability/patronus.html)

[Scorecard](../observability/scorecard.html)

[SigNoz](../observability/signoz.html)

[Traceloop](../observability/traceloop.html)

[Weave](../observability/weave.html)

[AI SDK Providers](../ai-sdk-providers.html)Luma

# [Luma Provider](#luma-provider)

[Luma AI](https://lumalabs.ai/) provides state-of-the-art image generation models through their Dream Machine platform. Their models offer ultra-high quality image generation with superior prompt understanding and unique capabilities like character consistency and multi-image reference support.

## [Setup](#setup)

The Luma provider is available via the `@ai-sdk/luma` module. You can install it with

pnpm

npm

yarn

bun

pnpm add @ai-sdk/luma

## [Provider Instance](#provider-instance)

You can import the default provider instance `luma` from `@ai-sdk/luma`:

```ts
import { luma } from '@ai-sdk/luma';
```

If you need a customized setup, you can import `createLuma` and create a provider instance with your settings:

```ts
import { createLuma } from '@ai-sdk/luma';


const luma = createLuma({
  apiKey: 'your-api-key', // optional, defaults to LUMA_API_KEY environment variable
  baseURL: 'custom-url', // optional
  headers: {
    /* custom headers */
  }, // optional
});
```

You can use the following optional settings to customize the Luma provider instance:

-   **baseURL** *string*
    
    Use a different URL prefix for API calls, e.g. to use proxy servers. The default prefix is `https://api.lumalabs.ai`.
    
-   **apiKey** *string*
    
    API key that is being sent using the `Authorization` header. It defaults to the `LUMA_API_KEY` environment variable.
    
-   **headers** *Record<string,string>*
    
    Custom headers to include in the requests.
    
-   **fetch** *(input: RequestInfo, init?: RequestInit) => Promise<Response>*
    
    Custom [fetch](https://developer.mozilla.org/en-US/docs/Web/API/fetch) implementation. You can use it as a middleware to intercept requests, or to provide a custom fetch implementation for e.g. testing.
    

## [Image Models](#image-models)

You can create Luma image models using the `.image()` factory method. For more on image generation with the AI SDK see [generateImage()](../../docs/reference/ai-sdk-core/generate-image.html).

### [Basic Usage](#basic-usage)

```ts
import { luma } from '@ai-sdk/luma';
import { experimental_generateImage as generateImage } from 'ai';
import fs from 'fs';


const { image } = await generateImage({
  model: luma.image('photon-1'),
  prompt: 'A serene mountain landscape at sunset',
  aspectRatio: '16:9',
});


const filename = `image-${Date.now()}.png`;
fs.writeFileSync(filename, image.uint8Array);
console.log(`Image saved to ${filename}`);
```

### [Image Model Settings](#image-model-settings)

You can customize the generation behavior with optional settings:

```ts
const { image } = await generateImage({
  model: luma.image('photon-1'),
  prompt: 'A serene mountain landscape at sunset',
  aspectRatio: '16:9',
  maxImagesPerCall: 1, // Maximum number of images to generate per API call
  providerOptions: {
    luma: {
      pollIntervalMillis: 5000, // How often to check for completed images (in ms)
      maxPollAttempts: 10, // Maximum number of polling attempts before timeout
    },
  },
});
```

Since Luma processes images through an asynchronous queue system, these settings allow you to tune the polling behavior:

-   **maxImagesPerCall** *number*
    
    Override the maximum number of images generated per API call. Defaults to 1.
    
-   **pollIntervalMillis** *number*
    
    Control how frequently the API is checked for completed images while they are being processed. Defaults to 500ms.
    
-   **maxPollAttempts** *number*
    
    Limit how long to wait for results before timing out, since image generation is queued asynchronously. Defaults to 120 attempts.
    

### [Model Capabilities](#model-capabilities)

Luma offers two main models:

| Model | Description |
| --- | --- |
| `photon-1` | High-quality image generation with superior prompt understanding |
| `photon-flash-1` | Faster generation optimized for speed while maintaining quality |

Both models support the following aspect ratios:

-   1:1
-   3:4
-   4:3
-   9:16
-   16:9 (default)
-   9:21
-   21:9

For more details about supported aspect ratios, see the [Luma Image Generation documentation](https://docs.lumalabs.ai/docs/image-generation).

Key features of Luma models include:

-   Ultra-high quality image generation
-   10x higher cost efficiency compared to similar models
-   Superior prompt understanding and adherence
-   Unique character consistency capabilities from single reference images
-   Multi-image reference support for precise style matching

### [Advanced Options](#advanced-options)

Luma models support several advanced features through the `providerOptions.luma` parameter.

#### [Image Reference](#image-reference)

Use up to 4 reference images to guide your generation. Useful for creating variations or visualizing complex concepts. Adjust the `weight` (0-1) to control the influence of reference images.

```ts
// Example: Generate a salamander with reference
await generateImage({
  model: luma.image('photon-1'),
  prompt: 'A salamander at dusk in a forest pond, in the style of ukiyo-e',
  providerOptions: {
    luma: {
      image_ref: [
        {
          url: 'https://example.com/reference.jpg',
          weight: 0.85,
        },
      ],
    },
  },
});
```

#### [Style Reference](#style-reference)

Apply specific visual styles to your generations using reference images. Control the style influence using the `weight` parameter.

```ts
// Example: Generate with style reference
await generateImage({
  model: luma.image('photon-1'),
  prompt: 'A blue cream Persian cat launching its website on Vercel',
  providerOptions: {
    luma: {
      style_ref: [
        {
          url: 'https://example.com/style.jpg',
          weight: 0.8,
        },
      ],
    },
  },
});
```

#### [Character Reference](#character-reference)

Create consistent and personalized characters using up to 4 reference images of the same subject. More reference images improve character representation.

```ts
// Example: Generate character-based image
await generateImage({
  model: luma.image('photon-1'),
  prompt: 'A woman with a cat riding a broomstick in a forest',
  providerOptions: {
    luma: {
      character_ref: {
        identity0: {
          images: ['https://example.com/character.jpg'],
        },
      },
    },
  },
});
```

#### [Modify Image](#modify-image)

Transform existing images using text prompts. Use the `weight` parameter to control how closely the result matches the input image (higher weight = closer to input but less creative).

For color changes, it's recommended to use a lower weight value (0.0-0.1).

```ts
// Example: Modify existing image
await generateImage({
  model: luma.image('photon-1'),
  prompt: 'transform the bike to a boat',
  providerOptions: {
    luma: {
      modify_image_ref: {
        url: 'https://example.com/image.jpg',
        weight: 1.0,
      },
    },
  },
});
```

For more details about Luma's capabilities and features, visit the [Luma Image Generation documentation](https://docs.lumalabs.ai/docs/image-generation).

[Previous

Perplexity

](perplexity.html)

[Next

ElevenLabs

](elevenlabs.html)

On this page

[Luma Provider](#luma-provider)

[Setup](#setup)

[Provider Instance](#provider-instance)

[Image Models](#image-models)

[Basic Usage](#basic-usage)

[Image Model Settings](#image-model-settings)

[Model Capabilities](#model-capabilities)

[Advanced Options](#advanced-options)

[Image Reference](#image-reference)

[Style Reference](#style-reference)

[Character Reference](#character-reference)

[Modify Image](#modify-image)

Deploy and Scale AI Apps with Vercel.

Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:

-   OpenAI
-   Photoroom
-   ![leonardo-ai Logo](../../_next/logo-leonardo-ai-light.svg)![leonardo-ai Logo](../../_next/logo-leonardo-ai-dark.svg)
-   ![zapier Logo](../../_next/logo-zapier-light.svg)![zapier Logo](../../_next/logo-zapier-dark.svg)

[](https://vercel.com/contact/sales?utm_source=ai_sdk&utm_medium=web&utm_campaign=contact_sales_cta&utm_content=talk_to_an_expert_sdk_docs)

#### Resources

[Docs](../../docs/introduction.html)[Cookbook](../../cookbook.html)[Providers](../ai-sdk-providers.html)[Showcase](../../showcase.html)[GitHub](https://github.com/vercel/ai)[Discussions](https://github.com/vercel/ai/discussions)

#### More

[Playground](../../playground.html)[](https://v0.dev)[Contact Sales](https://vercel.com/contact/sales)

#### About Vercel

[Next.js + Vercel](https://vercel.com/frameworks/nextjs)[Open Source Software](https://vercel.com/oss)[GitHub](https://github.com/vercel)[X](https://x.com/vercel)

#### Legal

[Privacy Policy](https://vercel.com/legal/privacy-policy)

© 2025 Vercel, Inc.