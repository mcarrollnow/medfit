AI SDK Providers: Vercel

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

[AI SDK Providers](../ai-sdk-providers.html)Vercel

# [Vercel Provider](#vercel-provider)

The [Vercel](https://vercel.com) provider gives you access to the [v0 API](https://vercel.com/docs/v0/api), designed for building modern web applications. The v0 models support text and image inputs and provide fast streaming responses.

You can create your Vercel API key at [v0.dev](https://v0.dev/chat/settings/keys).

The v0 API is currently in beta and requires a Premium or Team plan with usage-based billing enabled. For details, visit the [pricing page](https://v0.dev/pricing). To request a higher limit, contact Vercel at [support@v0.dev](mailto:support@v0.dev).

## [Features](#features)

-   **Framework aware completions**: Evaluated on modern stacks like Next.js and Vercel
-   **Auto-fix**: Identifies and corrects common coding issues during generation
-   **Quick edit**: Streams inline edits as they're available
-   **Multimodal**: Supports both text and image inputs

## [Setup](#setup)

The Vercel provider is available via the `@ai-sdk/vercel` module. You can install it with:

pnpm

npm

yarn

bun

pnpm add @ai-sdk/vercel

## [Provider Instance](#provider-instance)

You can import the default provider instance `vercel` from `@ai-sdk/vercel`:

```ts
import { vercel } from '@ai-sdk/vercel';
```

If you need a customized setup, you can import `createVercel` from `@ai-sdk/vercel` and create a provider instance with your settings:

```ts
import { createVercel } from '@ai-sdk/vercel';


const vercel = createVercel({
  apiKey: process.env.VERCEL_API_KEY ?? '',
});
```

You can use the following optional settings to customize the Vercel provider instance:

-   **baseURL** *string*
    
    Use a different URL prefix for API calls. The default prefix is `https://api.v0.dev/v1`.
    
-   **apiKey** *string*
    
    API key that is being sent using the `Authorization` header. It defaults to the `VERCEL_API_KEY` environment variable.
    
-   **headers** *Record<string,string>*
    
    Custom headers to include in the requests.
    
-   **fetch** *(input: RequestInfo, init?: RequestInit) => Promise<Response>*
    
    Custom [fetch](https://developer.mozilla.org/en-US/docs/Web/API/fetch) implementation. Defaults to the global `fetch` function. You can use it as a middleware to intercept requests, or to provide a custom fetch implementation for e.g. testing.
    

## [Language Models](#language-models)

You can create language models using a provider instance. The first argument is the model ID, for example:

```ts
import { vercel } from '@ai-sdk/vercel';
import { generateText } from 'ai';


const { text } = await generateText({
  model: vercel('v0-1.0-md'),
  prompt: 'Create a Next.js AI chatbot',
});
```

Vercel language models can also be used in the `streamText` function (see [AI SDK Core](../../docs/ai-sdk-core.html)).

## [Models](#models)

### [v0-1.5-md](#v0-15-md)

The `v0-1.5-md` model is for everyday tasks and UI generation.

### [v0-1.5-lg](#v0-15-lg)

The `v0-1.5-lg` model is for advanced thinking or reasoning.

### [v0-1.0-md (legacy)](#v0-10-md-legacy)

The `v0-1.0-md` model is the legacy model served by the v0 API.

All v0 models have the following capabilities:

-   Supports text and image inputs (multimodal)
-   Supports function/tool calls
-   Streaming responses with low latency
-   Optimized for frontend and full-stack web development

## [Model Capabilities](#model-capabilities)

| Model | Image Input | Object Generation | Tool Usage | Tool Streaming |
| --- | --- | --- | --- | --- |
| `v0-1.5-md` |  |  |  |  |
| `v0-1.5-lg` |  |  |  |  |
| `v0-1.0-md` |  |  |  |  |

[Previous

xAI Grok

](xai.html)

[Next

OpenAI

](openai.html)

On this page

[Vercel Provider](#vercel-provider)

[Features](#features)

[Setup](#setup)

[Provider Instance](#provider-instance)

[Language Models](#language-models)

[Models](#models)

[v0-1.5-md](#v0-15-md)

[v0-1.5-lg](#v0-15-lg)

[v0-1.0-md (legacy)](#v0-10-md-legacy)

[Model Capabilities](#model-capabilities)

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