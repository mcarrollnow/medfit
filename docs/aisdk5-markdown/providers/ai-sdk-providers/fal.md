AI SDK Providers: Fal

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

[AI SDK Providers](../ai-sdk-providers.html)Fal

# [Fal Provider](#fal-provider)

[Fal AI](https://fal.ai/) provides a generative media platform for developers with lightning-fast inference capabilities. Their platform offers optimized performance for running diffusion models, with speeds up to 4x faster than alternatives.

## [Setup](#setup)

The Fal provider is available via the `@ai-sdk/fal` module. You can install it with

pnpm

npm

yarn

bun

pnpm add @ai-sdk/fal

## [Provider Instance](#provider-instance)

You can import the default provider instance `fal` from `@ai-sdk/fal`:

```ts
import { fal } from '@ai-sdk/fal';
```

If you need a customized setup, you can import `createFal` and create a provider instance with your settings:

```ts
import { createFal } from '@ai-sdk/fal';


const fal = createFal({
  apiKey: 'your-api-key', // optional, defaults to FAL_API_KEY environment variable, falling back to FAL_KEY
  baseURL: 'custom-url', // optional
  headers: {
    /* custom headers */
  }, // optional
});
```

You can use the following optional settings to customize the Fal provider instance:

-   **baseURL** *string*
    
    Use a different URL prefix for API calls, e.g. to use proxy servers. The default prefix is `https://fal.run`.
    
-   **apiKey** *string*
    
    API key that is being sent using the `Authorization` header. It defaults to the `FAL_API_KEY` environment variable, falling back to `FAL_KEY`.
    
-   **headers** *Record<string,string>*
    
    Custom headers to include in the requests.
    
-   **fetch** *(input: RequestInfo, init?: RequestInit) => Promise<Response>*
    
    Custom [fetch](https://developer.mozilla.org/en-US/docs/Web/API/fetch) implementation. You can use it as a middleware to intercept requests, or to provide a custom fetch implementation for e.g. testing.
    

## [Image Models](#image-models)

You can create Fal image models using the `.image()` factory method. For more on image generation with the AI SDK see [generateImage()](../../docs/reference/ai-sdk-core/generate-image.html).

### [Basic Usage](#basic-usage)

```ts
import { fal } from '@ai-sdk/fal';
import { experimental_generateImage as generateImage } from 'ai';
import fs from 'fs';


const { image, providerMetadata } = await generateImage({
  model: fal.image('fal-ai/flux/dev'),
  prompt: 'A serene mountain landscape at sunset',
});


const filename = `image-${Date.now()}.png`;
fs.writeFileSync(filename, image.uint8Array);
console.log(`Image saved to ${filename}`);
```

Fal image models may return additional information for the images and the request.

Here are some examples of properties that may be set for each image

```js
providerMetadata.fal.images[0].nsfw; // boolean, image is not safe for work
providerMetadata.fal.images[0].width; // number, image width
providerMetadata.fal.images[0].height; // number, image height
providerMetadata.fal.images[0].content_type; // string, mime type of the image
```

### [Model Capabilities](#model-capabilities)

Fal offers many models optimized for different use cases. Here are a few popular examples. For a full list of models, see the [Fal AI Search Page](https://fal.ai/explore/search).

| Model | Description |
| --- | --- |
| `fal-ai/flux/dev` | FLUX.1 \[dev\] model for high-quality image generation |
| `fal-ai/flux-pro/kontext` | FLUX.1 Kontext \[pro\] handles both text and reference images as inputs, enabling targeted edits and complex transformations |
| `fal-ai/flux-pro/kontext/max` | FLUX.1 Kontext \[max\] with improved prompt adherence and typography generation |
| `fal-ai/flux-lora` | Super fast endpoint for FLUX.1 with LoRA support |
| `fal-ai/ideogram/character` | Generate consistent character appearances across multiple images. Maintain facial features, proportions, and distinctive traits |
| `fal-ai/qwen-image` | Qwen-Image foundation model with significant advances in complex text rendering and precise image editing |
| `fal-ai/omnigen-v2` | Unified image generation model for Image Editing, Personalized Image Generation, Virtual Try-On, Multi Person Generation and more |
| `fal-ai/bytedance/dreamina/v3.1/text-to-image` | Dreamina showcases superior picture effects with improvements in aesthetics, precise and diverse styles, and rich details |
| `fal-ai/recraft/v3/text-to-image` | SOTA in image generation with vector art and brand style capabilities |
| `fal-ai/wan/v2.2-a14b/text-to-image` | High-resolution, photorealistic images with fine-grained detail |

Fal models support the following aspect ratios:

-   1:1 (square HD)
-   16:9 (landscape)
-   9:16 (portrait)
-   4:3 (landscape)
-   3:4 (portrait)
-   16:10 (1280x800)
-   10:16 (800x1280)
-   21:9 (2560x1080)
-   9:21 (1080x2560)

Key features of Fal models include:

-   Up to 4x faster inference speeds compared to alternatives
-   Optimized by the Fal Inference Engine™
-   Support for real-time infrastructure
-   Cost-effective scaling with pay-per-use pricing
-   LoRA training capabilities for model personalization

#### [Modify Image](#modify-image)

Transform existing images using text prompts.

```ts
// Example: Modify existing image
await generateImage({
  model: fal.image('fal-ai/flux-pro/kontext'),
  prompt: 'Put a donut next to the flour.',
  providerOptions: {
    fal: {
      image_url:
        'https://v3.fal.media/files/rabbit/rmgBxhwGYb2d3pl3x9sKf_output.png',
    },
  },
});
```

### [Provider Options](#provider-options)

Fal image models support flexible provider options through the `providerOptions.fal` object. You can pass any parameters supported by the specific Fal model's API. Common options include:

-   **image\_url** - Reference image URL for image-to-image generation
-   **strength** - Controls how much the output differs from the input image
-   **guidance\_scale** - Controls adherence to the prompt
-   **num\_inference\_steps** - Number of denoising steps
-   **safety\_checker** - Enable/disable safety filtering

Refer to the [Fal AI model documentation](https://fal.ai/models) for model-specific parameters.

### [Advanced Features](#advanced-features)

Fal's platform offers several advanced capabilities:

-   **Private Model Inference**: Run your own diffusion transformer models with up to 50% faster inference
-   **LoRA Training**: Train and personalize models in under 5 minutes
-   **Real-time Infrastructure**: Enable new user experiences with fast inference times
-   **Scalable Architecture**: Scale to thousands of GPUs when needed

For more details about Fal's capabilities and features, visit the [Fal AI documentation](https://fal.ai/docs).

## [Transcription Models](#transcription-models)

You can create models that call the [Fal transcription API](https://docs.fal.ai/guides/convert-speech-to-text) using the `.transcription()` factory method.

The first argument is the model id without the `fal-ai/` prefix e.g. `wizper`.

```ts
const model = fal.transcription('wizper');
```

You can also pass additional provider-specific options using the `providerOptions` argument. For example, supplying the `batchSize` option will increase the number of audio chunks processed in parallel.

```ts
import { experimental_transcribe as transcribe } from 'ai';
import { fal } from '@ai-sdk/fal';
import { readFile } from 'fs/promises';


const result = await transcribe({
  model: fal.transcription('wizper'),
  audio: await readFile('audio.mp3'),
  providerOptions: { fal: { batchSize: 10 } },
});
```

The following provider options are available:

-   **language** *string* Language of the audio file. If set to null, the language will be automatically detected. Accepts ISO language codes like 'en', 'fr', 'zh', etc. Optional.
    
-   **diarize** *boolean* Whether to diarize the audio file (identify different speakers). Defaults to true. Optional.
    
-   **chunkLevel** *string* Level of the chunks to return. Either 'segment' or 'word'. Default value: "segment" Optional.
    
-   **version** *string* Version of the model to use. All models are Whisper large variants. Default value: "3" Optional.
    
-   **batchSize** *number* Batch size for processing. Default value: 64 Optional.
    
-   **numSpeakers** *number* Number of speakers in the audio file. If not provided, the number of speakers will be automatically detected. Optional.
    

### [Model Capabilities](#model-capabilities-1)

| Model | Transcription | Duration | Segments | Language |
| --- | --- | --- | --- | --- |
| `whisper` |  |  |  |  |
| `wizper` |  |  |  |  |

## [Speech Models](#speech-models)

You can create models that call Fal text-to-speech endpoints using the `.speech()` factory method.

### [Basic Usage](#basic-usage-1)

```ts
import { experimental_generateSpeech as generateSpeech } from 'ai';
import { fal } from '@ai-sdk/fal';


const result = await generateSpeech({
  model: fal.speech('fal-ai/minimax/speech-02-hd'),
  text: 'Hello from the AI SDK!',
});
```

### [Model Capabilities](#model-capabilities-2)

| Model | Description |
| --- | --- |
| `fal-ai/minimax/voice-clone` | Clone a voice from a sample audio and generate speech from text prompts |
| `fal-ai/minimax/voice-design` | Design a personalized voice from a text description and generate speech from text prompts |
| `fal-ai/dia-tts/voice-clone` | Clone dialog voices from a sample audio and generate dialogs from text prompts |
| `fal-ai/minimax/speech-02-hd` | Generate speech from text prompts and different voices |
| `fal-ai/minimax/speech-02-turbo` | Generate fast speech from text prompts and different voices |
| `fal-ai/dia-tts` | Directly generates realistic dialogue from transcripts with audio conditioning for emotion control. Produces natural nonverbals like laughter and throat clearing |
| `resemble-ai/chatterboxhd/text-to-speech` | Generate expressive, natural speech with Resemble AI's Chatterbox. Features unique emotion control, instant voice cloning from short audio, and built-in watermarking |

### [Provider Options](#provider-options-1)

Pass provider-specific options via `providerOptions.fal` depending on the model:

-   **voice\_setting** *object*
    
    -   `voice_id` (string): predefined voice ID
    -   `speed` (number): 0.5–2.0
    -   `vol` (number): 0–10
    -   `pitch` (number): -12–12
    -   `emotion` (enum): happy | sad | angry | fearful | disgusted | surprised | neutral
    -   `english_normalization` (boolean)
-   **audio\_setting** *object* Audio configuration settings specific to the model.
    
-   **language\_boost** *enum* Chinese | Chinese,Yue | English | Arabic | Russian | Spanish | French | Portuguese | German | Turkish | Dutch | Ukrainian | Vietnamese | Indonesian | Japanese | Italian | Korean | Thai | Polish | Romanian | Greek | Czech | Finnish | Hindi | auto
    
-   **pronunciation\_dict** *object* Custom pronunciation dictionary for specific words.
    

Model-specific parameters (e.g., `audio_url`, `prompt`, `preview_text`, `ref_audio_url`, `ref_text`) can be passed directly under `providerOptions.fal` and will be forwarded to the Fal API.

[Previous

Groq

](groq.html)

[Next

AssemblyAI

](assemblyai.html)

On this page

[Fal Provider](#fal-provider)

[Setup](#setup)

[Provider Instance](#provider-instance)

[Image Models](#image-models)

[Basic Usage](#basic-usage)

[Model Capabilities](#model-capabilities)

[Modify Image](#modify-image)

[Provider Options](#provider-options)

[Advanced Features](#advanced-features)

[Transcription Models](#transcription-models)

[Model Capabilities](#model-capabilities-1)

[Speech Models](#speech-models)

[Basic Usage](#basic-usage-1)

[Model Capabilities](#model-capabilities-2)

[Provider Options](#provider-options-1)

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