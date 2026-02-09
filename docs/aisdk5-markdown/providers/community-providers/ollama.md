Community Providers: Ollama

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

[Community Providers](../community-providers.html)Ollama

# [Ollama Provider](#ollama-provider)

[nordwestt/ollama-ai-provider-v2](https://github.com/nordwestt/ollama-ai-provider-v2) is a community provider that uses [Ollama](https://ollama.com/) to provide language model support for the AI SDK.

## [Setup](#setup)

The Ollama provider is available in the `ollama-ai-provider-v2` module. You can install it with

pnpm

npm

yarn

bun

pnpm add ollama-ai-provider-v2

## [Provider Instance](#provider-instance)

You can import the default provider instance `ollama` from `ollama-ai-provider-v2`:

```ts
import { ollama } from 'ollama-ai-provider-v2';
```

If you need a customized setup, you can import `createOllama` from `ollama-ai-provider-v2` and create a provider instance with your settings:

```ts
import { createOllama } from 'ollama-ai-provider-v2';


const ollama = createOllama({
  // optional settings, e.g.
  baseURL: 'https://api.ollama.com',
});
```

You can use the following optional settings to customize the Ollama provider instance:

-   **baseURL** *string*
    
    Use a different URL prefix for API calls, e.g. to use proxy servers. The default prefix is `http://localhost:11434/api`.
    
-   **headers** *Record<string,string>*
    
    Custom headers to include in the requests.
    

## [Language Models](#language-models)

You can create models that call the [Ollama Chat Completion API](https://github.com/ollama/ollama/blob/main/docs/api.md#generate-a-chat-completion) using the provider instance. The first argument is the model id, e.g. `phi3`. Some models have multi-modal capabilities.

```ts
const model = ollama('phi3');
```

You can find more models on the [Ollama Library](https://ollama.com/library) homepage.

### [Model Capabilities](#model-capabilities)

This provider is capable of using hybrid reasoning models such as qwen3, allowing toggling of reasoning between messages.

```ts
import { ollama } from 'ollama-ai-provider-v2';
import { generateText } from 'ai';


const { text } = await generateText({
  model: ollama('qwen3:4b'),
  providerOptions: { ollama: { think: true } },
  prompt:
    'Write a vegetarian lasagna recipe for 4 people, but really think about it',
});
```

## [Embedding Models](#embedding-models)

You can create models that call the [Ollama embeddings API](https://github.com/ollama/ollama/blob/main/docs/api.md#generate-embeddings) using the `.textEmbeddingModel()` factory method.

```ts
const model = ollama.textEmbeddingModel('nomic-embed-text');


const { embeddings } = await embedMany({
  model: model,
  values: ['sunny day at the beach', 'rainy afternoon in the city'],
});


console.log(
  `cosine similarity: ${cosineSimilarity(embeddings[0], embeddings[1])}`,
);
```

## [Alternative Providers](#alternative-providers)

There is an alternative provider package called [`ai-sdk-ollama` by jagreehal](https://github.com/jagreehal/ai-sdk-ollama), which uses the official [`Ollama`](https://www.npmjs.com/package/ollama) JavaScript client library instead of direct HTTP API calls.

Key differences:

-   Uses the official `ollama` npm package for communication
-   Provides automatic environment detection (Node.js vs browser)
-   Includes built-in error handling and retries via the official client
-   Supports both CommonJS and ESM module formats
-   Full TypeScript support with type-safe Ollama-specific options via `providerOptions.ollama`

This approach leverages Ollama's official client library, which may provide better compatibility with Ollama updates and additional features like model management. Both providers implement the AI SDK specification, so you can choose based on your specific requirements and preferences.

[Previous

Qwen

](qwen.html)

[Next

A2A

](a2a.html)

On this page

[Ollama Provider](#ollama-provider)

[Setup](#setup)

[Provider Instance](#provider-instance)

[Language Models](#language-models)

[Model Capabilities](#model-capabilities)

[Embedding Models](#embedding-models)

[Alternative Providers](#alternative-providers)

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