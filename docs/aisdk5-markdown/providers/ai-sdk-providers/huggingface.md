AI SDK Providers: Hugging Face

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

[AI SDK Providers](../ai-sdk-providers.html)Hugging Face

# [Hugging Face Provider](#hugging-face-provider)

The [Hugging Face](https://huggingface.co/) provider offers access to thousands of language models through [Hugging Face Inference Providers](https://huggingface.co/docs/inference-providers/index), including models from Meta, DeepSeek, Qwen, and more.

API keys can be obtained from [Hugging Face Settings](https://huggingface.co/settings/tokens).

## [Setup](#setup)

The Hugging Face provider is available via the `@ai-sdk/huggingface` module. You can install it with:

pnpm

npm

yarn

bun

pnpm add @ai-sdk/huggingface

## [Provider Instance](#provider-instance)

You can import the default provider instance `huggingface` from `@ai-sdk/huggingface`:

```ts
import { huggingface } from '@ai-sdk/huggingface';
```

For custom configuration, you can import `createHuggingFace` and create a provider instance with your settings:

```ts
import { createHuggingFace } from '@ai-sdk/huggingface';


const huggingface = createHuggingFace({
  apiKey: process.env.HUGGINGFACE_API_KEY ?? '',
});
```

You can use the following optional settings to customize the Hugging Face provider instance:

-   **baseURL** *string*
    
    Use a different URL prefix for API calls, e.g. to use proxy servers. The default prefix is `https://router.huggingface.co/v1`.
    
-   **apiKey** *string*
    
    API key that is being sent using the `Authorization` header. It defaults to the `HUGGINGFACE_API_KEY` environment variable. You can get your API key from [Hugging Face Settings](https://huggingface.co/settings/tokens).
    
-   **headers** *Record<string,string>*
    
    Custom headers to include in the requests.
    
-   **fetch** *(input: RequestInfo, init?: RequestInit) => Promise<Response>*
    
    Custom [fetch](https://developer.mozilla.org/en-US/docs/Web/API/fetch) implementation.
    

## [Language Models](#language-models)

You can create language models using a provider instance:

```ts
import { huggingface } from '@ai-sdk/huggingface';
import { generateText } from 'ai';


const { text } = await generateText({
  model: huggingface('deepseek-ai/DeepSeek-V3-0324'),
  prompt: 'Write a vegetarian lasagna recipe for 4 people.',
});
```

You can also use the `.responses()` or `.languageModel()` factory methods:

```ts
const model = huggingface.responses('deepseek-ai/DeepSeek-V3-0324');
// or
const model = huggingface.languageModel('moonshotai/Kimi-K2-Instruct');
```

Hugging Face language models can be used in the `streamText` function (see [AI SDK Core](../../docs/ai-sdk-core.html)).

You can explore the latest and trending models with their capabilities, context size, throughput and pricing on the [Hugging Face Inference Models](https://huggingface.co/inference/models) page.

## [Model Capabilities](#model-capabilities)

| Model | Image Input | Object Generation | Tool Usage | Tool Streaming |
| --- | --- | --- | --- | --- |
| `meta-llama/Llama-3.1-8B-Instruct` |  |  |  |  |
| `meta-llama/Llama-3.1-70B-Instruct` |  |  |  |  |
| `meta-llama/Llama-3.3-70B-Instruct` |  |  |  |  |
| `meta-llama/Llama-4-Scout-17B-16E-Instruct` |  |  |  |  |
| `deepseek-ai/DeepSeek-V3-0324` |  |  |  |  |
| `deepseek-ai/DeepSeek-R1` |  |  |  |  |
| `deepseek-ai/DeepSeek-R1-Distill-Llama-70B` |  |  |  |  |
| `Qwen/Qwen3-235B-A22B-Instruct-2507` |  |  |  |  |
| `Qwen/Qwen3-Coder-480B-A35B-Instruct` |  |  |  |  |
| `Qwen/Qwen2.5-VL-7B-Instruct` |  |  |  |  |
| `google/gemma-3-27b-it` |  |  |  |  |
| `moonshotai/Kimi-K2-Instruct` |  |  |  |  |

The capabilities depend on the specific model you're using. Check the model documentation on Hugging Face Hub for detailed information about each model's features.

[Previous

Baseten

](baseten.html)

[Next

Mistral AI

](mistral.html)

On this page

[Hugging Face Provider](#hugging-face-provider)

[Setup](#setup)

[Provider Instance](#provider-instance)

[Language Models](#language-models)

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