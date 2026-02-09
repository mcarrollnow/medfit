AI SDK Providers: Replicate

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

[AI SDK Providers](../ai-sdk-providers.html)Replicate

# [Replicate Provider](#replicate-provider)

[Replicate](https://replicate.com/) is a platform for running open-source AI models. It is a popular choice for running image generation models.

## [Setup](#setup)

The Replicate provider is available via the `@ai-sdk/replicate` module. You can install it with

pnpm

npm

yarn

bun

pnpm add @ai-sdk/replicate

## [Provider Instance](#provider-instance)

You can import the default provider instance `replicate` from `@ai-sdk/replicate`:

```ts
import { replicate } from '@ai-sdk/replicate';
```

If you need a customized setup, you can import `createReplicate` from `@ai-sdk/replicate` and create a provider instance with your settings:

```ts
import { createReplicate } from '@ai-sdk/replicate';


const replicate = createReplicate({
  apiToken: process.env.REPLICATE_API_TOKEN ?? '',
});
```

You can use the following optional settings to customize the Replicate provider instance:

-   **baseURL** *string*
    
    Use a different URL prefix for API calls, e.g. to use proxy servers. The default prefix is `https://api.replicate.com/v1`.
    
-   **apiToken** *string*
    
    API token that is being sent using the `Authorization` header. It defaults to the `REPLICATE_API_TOKEN` environment variable.
    
-   **headers** *Record<string,string>*
    
    Custom headers to include in the requests.
    
-   **fetch** *(input: RequestInfo, init?: RequestInit) => Promise<Response>*
    
    Custom [fetch](https://developer.mozilla.org/en-US/docs/Web/API/fetch) implementation.
    

## [Image Models](#image-models)

You can create Replicate image models using the `.image()` factory method. For more on image generation with the AI SDK see [generateImage()](../../docs/reference/ai-sdk-core/generate-image.html).

Model support for `size` and other parameters varies by model. Check the model's documentation on [Replicate](https://replicate.com/explore) for supported options and additional parameters that can be passed via `providerOptions.replicate`.

### [Supported Image Models](#supported-image-models)

The following image models are currently supported by the Replicate provider:

-   [black-forest-labs/flux-1.1-pro-ultra](https://replicate.com/black-forest-labs/flux-1.1-pro-ultra)
-   [black-forest-labs/flux-1.1-pro](https://replicate.com/black-forest-labs/flux-1.1-pro)
-   [black-forest-labs/flux-dev](https://replicate.com/black-forest-labs/flux-dev)
-   [black-forest-labs/flux-pro](https://replicate.com/black-forest-labs/flux-pro)
-   [black-forest-labs/flux-schnell](https://replicate.com/black-forest-labs/flux-schnell)
-   [bytedance/sdxl-lightning-4step](https://replicate.com/bytedance/sdxl-lightning-4step)
-   [fofr/aura-flow](https://replicate.com/fofr/aura-flow)
-   [fofr/latent-consistency-model](https://replicate.com/fofr/latent-consistency-model)
-   [fofr/realvisxl-v3-multi-controlnet-lora](https://replicate.com/fofr/realvisxl-v3-multi-controlnet-lora)
-   [fofr/sdxl-emoji](https://replicate.com/fofr/sdxl-emoji)
-   [fofr/sdxl-multi-controlnet-lora](https://replicate.com/fofr/sdxl-multi-controlnet-lora)
-   [ideogram-ai/ideogram-v2-turbo](https://replicate.com/ideogram-ai/ideogram-v2-turbo)
-   [ideogram-ai/ideogram-v2](https://replicate.com/ideogram-ai/ideogram-v2)
-   [lucataco/dreamshaper-xl-turbo](https://replicate.com/lucataco/dreamshaper-xl-turbo)
-   [lucataco/open-dalle-v1.1](https://replicate.com/lucataco/open-dalle-v1.1)
-   [lucataco/realvisxl-v2.0](https://replicate.com/lucataco/realvisxl-v2.0)
-   [lucataco/realvisxl2-lcm](https://replicate.com/lucataco/realvisxl2-lcm)
-   [luma/photon-flash](https://replicate.com/luma/photon-flash)
-   [luma/photon](https://replicate.com/luma/photon)
-   [nvidia/sana](https://replicate.com/nvidia/sana)
-   [playgroundai/playground-v2.5-1024px-aesthetic](https://replicate.com/playgroundai/playground-v2.5-1024px-aesthetic)
-   [recraft-ai/recraft-v3-svg](https://replicate.com/recraft-ai/recraft-v3-svg)
-   [recraft-ai/recraft-v3](https://replicate.com/recraft-ai/recraft-v3)
-   [stability-ai/stable-diffusion-3.5-large-turbo](https://replicate.com/stability-ai/stable-diffusion-3.5-large-turbo)
-   [stability-ai/stable-diffusion-3.5-large](https://replicate.com/stability-ai/stable-diffusion-3.5-large)
-   [stability-ai/stable-diffusion-3.5-medium](https://replicate.com/stability-ai/stable-diffusion-3.5-medium)
-   [tstramer/material-diffusion](https://replicate.com/tstramer/material-diffusion)

You can also use [versioned models](https://replicate.com/docs/topics/models/versions). The id for versioned models is the Replicate model id followed by a colon and the version ID (`$modelId:$versionId`), e.g. `bytedance/sdxl-lightning-4step:5599ed30703defd1d160a25a63321b4dec97101d98b4674bcc56e41f62f35637`.

You can also pass any available Replicate model ID as a string if needed.

### [Basic Usage](#basic-usage)

```ts
import { replicate } from '@ai-sdk/replicate';
import { experimental_generateImage as generateImage } from 'ai';
import { writeFile } from 'node:fs/promises';


const { image } = await generateImage({
  model: replicate.image('black-forest-labs/flux-schnell'),
  prompt: 'The Loch Ness Monster getting a manicure',
  aspectRatio: '16:9',
});


await writeFile('image.webp', image.uint8Array);


console.log('Image saved as image.webp');
```

### [Model-specific options](#model-specific-options)

```ts
import { replicate } from '@ai-sdk/replicate';
import { experimental_generateImage as generateImage } from 'ai';


const { image } = await generateImage({
  model: replicate.image('recraft-ai/recraft-v3'),
  prompt: 'The Loch Ness Monster getting a manicure',
  size: '1365x1024',
  providerOptions: {
    replicate: {
      style: 'realistic_image',
    },
  },
});
```

### [Versioned Models](#versioned-models)

```ts
import { replicate } from '@ai-sdk/replicate';
import { experimental_generateImage as generateImage } from 'ai';


const { image } = await generateImage({
  model: replicate.image(
    'bytedance/sdxl-lightning-4step:5599ed30703defd1d160a25a63321b4dec97101d98b4674bcc56e41f62f35637',
  ),
  prompt: 'The Loch Ness Monster getting a manicure',
});
```

For more details, see the [Replicate models page](https://replicate.com/explore).

[Previous

Cerebras

](cerebras.html)

[Next

Perplexity

](perplexity.html)

On this page

[Replicate Provider](#replicate-provider)

[Setup](#setup)

[Provider Instance](#provider-instance)

[Image Models](#image-models)

[Supported Image Models](#supported-image-models)

[Basic Usage](#basic-usage)

[Model-specific options](#model-specific-options)

[Versioned Models](#versioned-models)

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