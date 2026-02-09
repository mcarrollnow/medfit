Community Providers: LangDB

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

[Community Providers](../community-providers.html)LangDB

# [LangDB](#langdb)

This community provider is not yet compatible with AI SDK 5. Please wait for the provider to be updated or consider using an [AI SDK 5 compatible provider](../ai-sdk-providers.html).

[LangDB](https://langdb.ai) is a high-performance enterprise AI gateway built in Rust, designed to govern, secure, and optimize AI traffic.

LangDB provides OpenAI-compatible APIs, enabling developers to connect with multiple LLMs by changing just two lines of code. With LangDB, you can:

-   Provide access to all major LLMs
-   Enable plug-and-play functionality using any framework like Langchain, Vercel AI SDK, CrewAI, etc., for easy adoption.
-   Simplify implementation of tracing and cost optimization features, ensuring streamlined operations.
-   Dynamically route requests to the most suitable LLM based on predefined parameters.

## [Setup](#setup)

The LangDB provider is available via the `@langdb/vercel-provider` module. You can install it with:

pnpm

npm

yarn

bun

pnpm add @langdb/vercel-provider

## [Provider Instance](#provider-instance)

To create a LangDB provider instance, use the `createLangDB` function:

```tsx
import { createLangDB } from '@langdb/vercel-provider';


const langdb = createLangDB({
  apiKey: process.env.LANGDB_API_KEY, // Required
  projectId: 'your-project-id', // Required
  threadId: uuidv4(), // Optional
  runId: uuidv4(), // Optional
  label: 'code-agent', // Optional
  headers: { 'Custom-Header': 'value' }, // Optional
});
```

You can find your LangDB API key in the [LangDB dashboard](https://app.langdb.ai).

## [Examples](#examples)

You can use LangDB with the `generateText` or `streamText` function:

### [`generateText`](#generatetext)

```tsx
import { createLangDB } from '@langdb/vercel-provider';
import { generateText } from 'ai';


const langdb = createLangDB({
  apiKey: process.env.LANGDB_API_KEY,
  projectId: 'your-project-id',
});


export async function generateTextExample() {
  const { text } = await generateText({
    model: langdb('openai/gpt-4o-mini'),
    prompt: 'Write a Python function that sorts a list:',
  });


  console.log(text);
}
```

### [generateImage](#generateimage)

```tsx
import { createLangDB } from '@langdb/vercel-provider';
import { experimental_generateImage as generateImage } from 'ai';
import fs from 'fs';
import path from 'path';


const langdb = createLangDB({
  apiKey: process.env.LANGDB_API_KEY,
  projectId: 'your-project-id',
});


export async function generateImageExample() {
  const { images } = await generateImage({
    model: langdb.image('openai/dall-e-3'),
    prompt: 'A delighted resplendent quetzal mid-flight amidst raindrops',
  });


  const imagePath = path.join(__dirname, 'generated-image.png');
  fs.writeFileSync(imagePath, images[0].uint8Array);
  console.log(`Image saved to: ${imagePath}`);
}
```

### [embed](#embed)

```tsx
import { createLangDB } from '@langdb/vercel-provider';
import { embed } from 'ai';


const langdb = createLangDB({
  apiKey: process.env.LANGDB_API_KEY,
  projectId: 'your-project-id',
});


export async function generateEmbeddings() {
  const { embedding } = await embed({
    model: langdb.textEmbeddingModel('text-embedding-3-small'),
    value: 'sunny day at the beach',
  });


  console.log('Embedding:', embedding);
}
```

## [Supported Models](#supported-models)

LangDB supports over 250+ models, enabling seamless interaction with a wide range of AI capabilities.

Checkout the [model list](https://app.langdb.ai/models) for more information.

For more information, visit the [LangDB documentation](https://docs.langdb.ai/).

[Previous

Inflection AI

](inflection-ai.html)

[Next

Zhipu AI

](zhipu.html)

On this page

[LangDB](#langdb)

[Setup](#setup)

[Provider Instance](#provider-instance)

[Examples](#examples)

[generateText](#generatetext)

[generateImage](#generateimage)

[embed](#embed)

[Supported Models](#supported-models)

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