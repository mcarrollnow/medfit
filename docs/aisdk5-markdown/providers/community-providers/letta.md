Community Providers: Letta

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

[Community Providers](../community-providers.html)Letta

# [Letta Provider](#letta-provider)

This community provider is not yet compatible with AI SDK 5. Please wait for the provider to be updated or consider using an [AI SDK 5 compatible provider](../ai-sdk-providers.html).

The [Letta AI-SDK provider](https://github.com/letta-ai/vercel-ai-sdk-provider) is the official provider for the [Letta](https://docs.letta.com) platform. It allows you to integrate Letta's AI capabilities into your applications using the Vercel AI SDK.

## [Setup](#setup)

The Letta provider is available in the `@letta-ai/vercel-ai-sdk-provider` module. You can install it with:

pnpm

npm

yarn

bun

pnpm add @letta-ai/vercel-ai-sdk-provider

## [Provider Instance](#provider-instance)

You can import the default provider instance `letta` from `@letta-ai/vercel-ai-sdk-provider`:

```ts
import { letta } from '@letta-ai/vercel-ai-sdk-provider';
```

## [Quick Start](#quick-start)

### [Using Letta Cloud (](#using-letta-cloud-httpsapilettacom)[https://api.letta.com](https://api.letta.com))

Create a file called `.env.local` and add your [API Key](https://app.letta.com/api-keys)

```text
LETTA_API_KEY=<your_api_key>
```

```ts
import { lettaCloud } from '@letta-ai/vercel-ai-sdk-provider';
import { generateText } from 'ai';


const { text } = await generateText({
  model: lettaCloud('your_agent_id'),
  prompt: 'Write a vegetarian lasagna recipe for 4 people.',
});
```

### [Local instances (](#local-instances-httplocalhost8283)[http://localhost:8283](http://localhost:8283))

```ts
import { lettaLocal } from '@letta-ai/vercel-ai-sdk-provider';
import { generateText } from 'ai';


const { text } = await generateText({
  model: lettaLocal('your_agent_id'),
  prompt: 'Write a vegetarian lasagna recipe for 4 people.',
});
```

### [Custom setups](#custom-setups)

```ts
import { createLetta } from '@letta-ai/vercel-ai-sdk-provider';
import { generateText } from 'ai';


const letta = createLetta({
  baseUrl: '<your_base_url>',
  token: '<your_access_token>',
});


const { text } = await generateText({
  model: letta('your_agent_id'),
  prompt: 'Write a vegetarian lasagna recipe for 4 people.',
});
```

### [Using other Letta Client Functions](#using-other-letta-client-functions)

The `vercel-ai-sdk-provider` extends the [@letta-ai/letta-client](https://www.npmjs.com/package/@letta-ai/letta-client), you can access the operations directly by using `lettaCloud.client` or `lettaLocal.client` or your custom generated `letta.client`

```ts
// with Letta Cloud
import { lettaCloud } from '@letta-ai/vercel-ai-sdk-provider';


lettaCloud.client.agents.list();


// with Letta Local
import { lettaLocal } from '@letta-ai/vercel-ai-sdk-provider';


lettaLocal.client.agents.list();
```

### [More Information](#more-information)

For more information on the Letta API, please refer to the [Letta API documentation](https://docs.letta.com/api).

[Previous

Mem0

](mem0.html)

[Next

Supermemory

](supermemory.html)

On this page

[Letta Provider](#letta-provider)

[Setup](#setup)

[Provider Instance](#provider-instance)

[Quick Start](#quick-start)

[Using Letta Cloud (https://api.letta.com)](#using-letta-cloud-httpsapilettacom)

[Local instances (http://localhost:8283)](#local-instances-httplocalhost8283)

[Custom setups](#custom-setups)

[Using other Letta Client Functions](#using-other-letta-client-functions)

[More Information](#more-information)

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