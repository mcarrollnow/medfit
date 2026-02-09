Community Providers: AI/ML API

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

[Community Providers](../community-providers.html)AI/ML API

# [AI/ML API Provider](#aiml-api-provider)

The [AI/ML API](https://aimlapi.com/?utm_source=aimlapi-vercel-ai&utm_medium=github&utm_campaign=integration) provider gives access to more than 300 AI models over an OpenAI-compatible API.

## [Setup](#setup)

The AI/ML API provider is available via the `@ai-ml.api/aimlapi-vercel-ai` module. You can install it with:

pnpm

npm

yarn

bun

pnpm add @ai-ml.api/aimlapi-vercel-ai

### [API Key](#api-key)

Set the `AIMLAPI_API_KEY` environment variable with your key:

```bash
export AIMLAPI_API_KEY="sk-..."
```

## [Provider Instance](#provider-instance)

You can import the default provider instance `aimlapi`:

```ts
import { aimlapi } from '@ai-ml.api/aimlapi-vercel-ai';
```

## [Language Models](#language-models)

Create models for text generation with `aimlapi` and use them with `generateText`:

```ts
import { aimlapi } from '@ai-ml.api/aimlapi-vercel-ai';
import { generateText } from 'ai';


const { text } = await generateText({
  model: aimlapi('gpt-4o'),
  system: 'You are a friendly assistant!',
  prompt: 'Why is the sky blue?',
});
```

## [Image Generation](#image-generation)

You can generate images by calling `doGenerate` on an image model:

```ts
import { aimlapi } from '@ai-ml.api/aimlapi-vercel-ai';


const model = aimlapi.imageModel('flux-pro');


const res = await model.doGenerate({
  prompt: 'a red balloon floating over snowy mountains, cinematic',
  n: 1,
  aspectRatio: '16:9',
  seed: 42,
  size: '1024x768',
  providerOptions: {},
});


console.log(`✅ Generated image url: ${res.images[0]}`);
```

## [Embeddings](#embeddings)

AI/ML API also supports embedding models:

```ts
import { aimlapi } from '@ai-ml.api/aimlapi-vercel-ai';
import { embed } from 'ai';


const { embedding } = await embed({
  model: aimlapi.textEmbeddingModel('text-embedding-3-large'),
  value: 'sunny day at the beach',
});
```

For more information and a full model list, visit the [AI/ML API dashboard](https://aimlapi.com/app?utm_source=aimlapi-vercel-ai&utm_medium=github&utm_campaign=integration) and the [AI/ML API documentation](https://docs.aimlapi.com/?utm_source=aimlapi-vercel-ai&utm_medium=github&utm_campaign=integration).

[Previous

Sarvam

](sarvam.html)

[Next

Claude Code

](claude-code.html)

On this page

[AI/ML API Provider](#aiml-api-provider)

[Setup](#setup)

[API Key](#api-key)

[Provider Instance](#provider-instance)

[Language Models](#language-models)

[Image Generation](#image-generation)

[Embeddings](#embeddings)

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