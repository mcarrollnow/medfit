AI SDK Providers: Perplexity

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

[AI SDK Providers](../ai-sdk-providers.html)Perplexity

# [Perplexity Provider](#perplexity-provider)

The [Perplexity](https://sonar.perplexity.ai) provider offers access to Sonar API - a language model that uniquely combines real-time web search with natural language processing. Each response is grounded in current web data and includes detailed citations, making it ideal for research, fact-checking, and obtaining up-to-date information.

API keys can be obtained from the [Perplexity Platform](https://docs.perplexity.ai).

## [Setup](#setup)

The Perplexity provider is available via the `@ai-sdk/perplexity` module. You can install it with:

pnpm

npm

yarn

bun

pnpm add @ai-sdk/perplexity

## [Provider Instance](#provider-instance)

You can import the default provider instance `perplexity` from `@ai-sdk/perplexity`:

```ts
import { perplexity } from '@ai-sdk/perplexity';
```

For custom configuration, you can import `createPerplexity` and create a provider instance with your settings:

```ts
import { createPerplexity } from '@ai-sdk/perplexity';


const perplexity = createPerplexity({
  apiKey: process.env.PERPLEXITY_API_KEY ?? '',
});
```

You can use the following optional settings to customize the Perplexity provider instance:

-   **baseURL** *string*
    
    Use a different URL prefix for API calls. The default prefix is `https://api.perplexity.ai`.
    
-   **apiKey** *string*
    
    API key that is being sent using the `Authorization` header. It defaults to the `PERPLEXITY_API_KEY` environment variable.
    
-   **headers** *Record<string,string>*
    
    Custom headers to include in the requests.
    
-   **fetch** *(input: RequestInfo, init?: RequestInit) => Promise<Response>*
    
    Custom [fetch](https://developer.mozilla.org/en-US/docs/Web/API/fetch) implementation.
    

## [Language Models](#language-models)

You can create Perplexity models using a provider instance:

```ts
import { perplexity } from '@ai-sdk/perplexity';
import { generateText } from 'ai';


const { text } = await generateText({
  model: perplexity('sonar-pro'),
  prompt: 'What are the latest developments in quantum computing?',
});
```

### [Sources](#sources)

Websites that have been used to generate the response are included in the `sources` property of the result:

```ts
import { perplexity } from '@ai-sdk/perplexity';
import { generateText } from 'ai';


const { text, sources } = await generateText({
  model: perplexity('sonar-pro'),
  prompt: 'What are the latest developments in quantum computing?',
});


console.log(sources);
```

### [Provider Options & Metadata](#provider-options--metadata)

The Perplexity provider includes additional metadata in the response through `providerMetadata`. Additional configuration options are available through `providerOptions`.

```ts
const result = await generateText({
  model: perplexity('sonar-pro'),
  prompt: 'What are the latest developments in quantum computing?',
  providerOptions: {
    perplexity: {
      return_images: true, // Enable image responses (Tier-2 Perplexity users only)
    },
  },
});


console.log(result.providerMetadata);
// Example output:
// {
//   perplexity: {
//     usage: { citationTokens: 5286, numSearchQueries: 1 },
//     images: [
//       { imageUrl: "https://example.com/image1.jpg", originUrl: "https://elsewhere.com/page1", height: 1280, width: 720 },
//       { imageUrl: "https://example.com/image2.jpg", originUrl: "https://elsewhere.com/page2", height: 1280, width: 720 }
//     ]
//   },
// }
```

The metadata includes:

-   `usage`: Object containing `citationTokens` and `numSearchQueries` metrics
-   `images`: Array of image URLs when `return_images` is enabled (Tier-2 users only)

You can enable image responses by setting `return_images: true` in the provider options. This feature is only available to Perplexity Tier-2 users and above.

For more details about Perplexity's capabilities, see the [Perplexity chat completion docs](https://docs.perplexity.ai/api-reference/chat-completions).

## [Model Capabilities](#model-capabilities)

| Model | Image Input | Object Generation | Tool Usage | Tool Streaming |
| --- | --- | --- | --- | --- |
| `sonar-deep-research` |  |  |  |  |
| `sonar-reasoning-pro` |  |  |  |  |
| `sonar-reasoning` |  |  |  |  |
| `sonar-pro` |  |  |  |  |
| `sonar` |  |  |  |  |

Please see the [Perplexity docs](https://docs.perplexity.ai) for detailed API documentation and the latest updates.

[Previous

Replicate

](replicate.html)

[Next

Luma

](luma.html)

On this page

[Perplexity Provider](#perplexity-provider)

[Setup](#setup)

[Provider Instance](#provider-instance)

[Language Models](#language-models)

[Sources](#sources)

[Provider Options & Metadata](#provider-options--metadata)

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