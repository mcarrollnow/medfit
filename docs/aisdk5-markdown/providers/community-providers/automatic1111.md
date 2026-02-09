Community Providers: Automatic1111

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

[AI Gateway](../ai-sdk-providers/ai-gateway.html)

[xAI Grok](../ai-sdk-providers/xai.html)

[Vercel](../ai-sdk-providers/vercel.html)

[OpenAI](../ai-sdk-providers/openai.html)

[Azure OpenAI](../ai-sdk-providers/azure.html)

[Anthropic](../ai-sdk-providers/anthropic.html)

[Amazon Bedrock](../ai-sdk-providers/amazon-bedrock.html)

[Groq](../ai-sdk-providers/groq.html)

[Fal](../ai-sdk-providers/fal.html)

[DeepInfra](../ai-sdk-providers/deepinfra.html)

[Google Generative AI](../ai-sdk-providers/google-generative-ai.html)

[Google Vertex AI](../ai-sdk-providers/google-vertex.html)

[Mistral AI](../ai-sdk-providers/mistral.html)

[Together.ai](../ai-sdk-providers/togetherai.html)

[Cohere](../ai-sdk-providers/cohere.html)

[Fireworks](../ai-sdk-providers/fireworks.html)

[DeepSeek](../ai-sdk-providers/deepseek.html)

[Cerebras](../ai-sdk-providers/cerebras.html)

[Replicate](../ai-sdk-providers/replicate.html)

[Perplexity](../ai-sdk-providers/perplexity.html)

[Luma](../ai-sdk-providers/luma.html)

[ElevenLabs](../ai-sdk-providers/elevenlabs.html)

[AssemblyAI](../ai-sdk-providers/assemblyai.html)

[Deepgram](../ai-sdk-providers/deepgram.html)

[Gladia](../ai-sdk-providers/gladia.html)

[LMNT](../ai-sdk-providers/lmnt.html)

[Hume](../ai-sdk-providers/hume.html)

[Rev.ai](../ai-sdk-providers/revai.html)

[Baseten](../ai-sdk-providers/baseten.html)

[Hugging Face](../ai-sdk-providers/huggingface.html)

[OpenAI Compatible Providers](../openai-compatible-providers.html)

[Writing a Custom Provider](../openai-compatible-providers/custom-providers.html)

[LM Studio](../openai-compatible-providers/lmstudio.html)

[NVIDIA NIM](../openai-compatible-providers/nim.html)

[Heroku](../openai-compatible-providers/heroku.html)

[Community Providers](../community-providers.html)

[Writing a Custom Provider](custom-providers.html)

[Qwen](qwen.html)

[Ollama](ollama.html)

[A2A](a2a.html)

[Requesty](requesty.html)

[FriendliAI](friendliai.html)

[Portkey](portkey.html)

[Cloudflare Workers AI](cloudflare-workers-ai.html)

[Cloudflare AI Gateway](cloudflare-ai-gateway.html)

[OpenRouter](openrouter.html)

[Azure AI](azure-ai.html)

[Aihubmix](aihubmix.html)

[SAP AI Core](sap-ai.html)

[Crosshatch](crosshatch.html)

[Mixedbread](mixedbread.html)

[Voyage AI](voyage-ai.html)

[Jina AI](jina-ai.html)

[Mem0](mem0.html)

[Letta](letta.html)

[Supermemory](supermemory.html)

[React Native Apple](react-native-apple.html)

[Anthropic Vertex](anthropic-vertex-ai.html)

[Spark](spark.html)

[Inflection AI](inflection-ai.html)

[LangDB](langdb.html)

[Zhipu AI](zhipu.html)

[SambaNova](sambanova.html)

[Dify](dify.html)

[Sarvam](sarvam.html)

[AI/ML API](aimlapi.html)

[Claude Code](claude-code.html)

[Built-in AI](built-in-ai.html)

[Gemini CLI](gemini-cli.html)

[Automatic1111](automatic1111.html)

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

[Community Providers](../community-providers.html)Automatic1111

# [Automatic1111](#automatic1111)

[AUTOMATIC1111](https://github.com/AUTOMATIC1111/stable-diffusion-webui) is a popular web interface for Stable Diffusion that provides a comprehensive set of features for image generation. The [Automatic1111 provider](https://github.com/Ponesicek/automatic1111-provider) for the AI SDK enables seamless integration with locally hosted AUTOMATIC1111 instances while offering unique advantages:

-   **Local Control**: Full control over your image generation with local Stable Diffusion models
-   **No API Costs**: Generate unlimited images without per-request charges
-   **Model Flexibility**: Use any Stable Diffusion checkpoint
-   **Privacy**: All generation happens locally on your hardware
-   **Community Models**: Access to thousands of community-created models from Civitai and HuggingFace

Learn more about AUTOMATIC1111's capabilities in the [AUTOMATIC1111 Documentation](https://github.com/AUTOMATIC1111/stable-diffusion-webui).

## [Setup](#setup)

You need to have AUTOMATIC1111 running with the `--api` flag enabled. Start your AUTOMATIC1111 instance with:

```bash
# Windows
./webui.bat --api


# Linux/Mac
./webui.sh --api
```

The Automatic1111 provider is available in the `automatic1111-provider` module. You can install it with:

```bash
# pnpm
pnpm add automatic1111-provider


# npm
npm install automatic1111-provider


# yarn
npm install automatic1111-provider
```

## [Provider Instance](#provider-instance)

To create an Automatic1111 provider instance, use the `createAutomatic1111` function:

```typescript
import { createAutomatic1111 } from 'automatic1111-provider';


const automatic1111 = createAutomatic1111({
  baseURL: 'http://127.0.0.1:7860', // Your AUTOMATIC1111 instance
});
```

## [Image Models](#image-models)

The Automatic1111 provider supports image generation through the `image()` method:

```typescript
// Basic image generation
const imageModel = automatic1111.image('v1-5-pruned-emaonly');


// With custom model
const sdxlModel = automatic1111.image('sd_xl_base_1.0');
```

## [Examples](#examples)

### [Basic Image Generation](#basic-image-generation)

```typescript
import { automatic1111 } from 'automatic1111-provider';
import { experimental_generateImage as generateImage } from 'ai';


const { images } = await generateImage({
  model: automatic1111.image('v1-5-pruned-emaonly'),
  prompt: 'A beautiful sunset over mountains',
  size: '512x512',
});
```

### [Advanced Configuration](#advanced-configuration)

```typescript
const { images } = await generateImage({
  model: automatic1111.image('realistic-vision-v4'),
  prompt: 'Portrait of a wise old wizard with a long beard',
  n: 2,
  seed: 12345,
  providerOptions: {
    automatic1111: {
      negative_prompt: 'blurry, ugly, deformed, low quality',
      steps: 40,
      cfg_scale: 8.5,
      sampler_name: 'DPM++ SDE Karras',
      styles: ['photorealistic', 'detailed'],
      check_model_exists: true,
    },
  },
});
```

## [Provider Options](#provider-options)

The Automatic1111 provider supports the following options for customizing image generation:

### [Available Options](#available-options)

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `negative_prompt` | `string` | `undefined` | What you don't want in the image |
| `steps` | `number` | `20` | Number of sampling steps |
| `cfg_scale` | `number` | `7` | CFG (Classifier Free Guidance) scale |
| `sampler_name` | `string` | `"Euler a"` | Sampling method |
| `denoising_strength` | `number` | `undefined` | Denoising strength for img2img (0.0-1.0) |
| `styles` | `string[]` | `undefined` | Apply predefined styles |
| `check_model_exists` | `boolean` | `false` | Verify model exists before generation |

## [Model Management](#model-management)

The provider automatically detects available models from your AUTOMATIC1111 instance. To use a model:

1.  Place your `.safetensors` or `.ckpt` model files in the `models/Stable-diffusion/` folder
2.  Restart AUTOMATIC1111 or refresh the models list in the web interface
3.  Use the exact model name (without file extension) in the provider

## [Additional Resources](#additional-resources)

-   [AUTOMATIC1111 Documentation](https://github.com/AUTOMATIC1111/stable-diffusion-webui)
-   [AUTOMATIC1111 Models](https://civitai.com/models)
-   [AUTOMATIC1111 HuggingFace](https://huggingface.co/models?other=automatic1111)
-   [Vercel AI SDK](../../index.html)

[Previous

Gemini CLI

](gemini-cli.html)

[Next

Cloudflare Workers AI

](cloudflare-workers-ai.html)

On this page

[Automatic1111](#automatic1111)

[Setup](#setup)

[Windows](#windows)

[Linux/Mac](#linuxmac)

[pnpm](#pnpm)

[npm](#npm)

[yarn](#yarn)

[Provider Instance](#provider-instance)

[Image Models](#image-models)

[Examples](#examples)

[Basic Image Generation](#basic-image-generation)

[Advanced Configuration](#advanced-configuration)

[Provider Options](#provider-options)

[Available Options](#available-options)

[Model Management](#model-management)

[Additional Resources](#additional-resources)

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