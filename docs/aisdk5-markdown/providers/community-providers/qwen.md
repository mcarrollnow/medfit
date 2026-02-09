Community Providers: Qwen

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

[Community Providers](../community-providers.html)Qwen

# [Qwen Provider](#qwen-provider)

This community provider is not yet compatible with AI SDK 5. Please wait for the provider to be updated or consider using an [AI SDK 5 compatible provider](../ai-sdk-providers.html).

[younis-ahmed/qwen-ai-provider](https://github.com/younis-ahmed/qwen-ai-provider) is a community provider that uses [Qwen](https://www.alibabacloud.com/en/solutions/generative-ai/qwen) to provide language model support for the AI SDK.

## [Setup](#setup)

The Qwen provider is available in the `qwen-ai-provider` module. You can install it with

pnpm

npm

yarn

bun

pnpm add qwen-ai-provider

## [Provider Instance](#provider-instance)

You can import the default provider instance `qwen` from `qwen-ai-provider`:

```ts
import { qwen } from 'qwen-ai-provider';
```

If you need a customized setup, you can import `createQwen` from `qwen-ai-provider` and create a provider instance with your settings:

```ts
import { createQwen } from 'qwen-ai-provider';


const qwen = createQwen({
  // optional settings, e.g.
  // baseURL: 'https://qwen/api/v1',
});
```

You can use the following optional settings to customize the Qwen provider instance:

-   **baseURL** *string*
    
    Use a different URL prefix for API calls, e.g. to use proxy servers. The default prefix is `https://dashscope-intl.aliyuncs.com/compatible-mode/v1`.
    
-   **apiKey** *string*
    
    API key that is being sent using the `Authorization` header. It defaults to the `DASHSCOPE_API_KEY` environment variable.
    
-   **headers** *Record<string,string>*
    
    Custom headers to include in the requests.
    
-   **fetch** *(input: RequestInfo, init?: RequestInit) => Promise<Response>*
    
    Custom [fetch](https://developer.mozilla.org/en-US/docs/Web/API/fetch) implementation. Defaults to the global `fetch` function. You can use it as a middleware to intercept requests, or to provide a custom fetch implementation for e.g. testing.
    

## [Language Models](#language-models)

You can create models that call the [Qwen chat API](https://www.alibabacloud.com/help/en/model-studio/developer-reference/use-qwen-by-calling-api) using a provider instance. The first argument is the model id, e.g. `qwen-plus`. Some Qwen chat models support tool calls.

```ts
const model = qwen('qwen-plus');
```

### [Example](#example)

You can use Qwen language models to generate text with the `generateText` function:

```ts
import { qwen } from 'qwen-ai-provider';
import { generateText } from 'ai';


const { text } = await generateText({
  model: qwen('qwen-plus'),
  prompt: 'Write a vegetarian lasagna recipe for 4 people.',
});
```

Qwen language models can also be used in the `streamText`, `generateObject`, and `streamObject` functions (see [AI SDK Core](../../docs/ai-sdk-core.html)).

### [Model Capabilities](#model-capabilities)

| Model | Image Input | Object Generation | Tool Usage | Tool Streaming |
| --- | --- | --- | --- | --- |
| `qwen-vl-max` |  |  |  |  |
| `qwen-plus-latest` |  |  |  |  |
| `qwen-max` |  |  |  |  |
| `qwen2.5-72b-instruct` |  |  |  |  |
| `qwen2.5-14b-instruct-1m` |  |  |  |  |
| `qwen2.5-vl-72b-instruct` |  |  |  |  |

The table above lists popular models. Please see the [Qwen docs](https://www.alibabacloud.com/help/en/model-studio/getting-started/models) for a full list of available models. The table above lists popular models. You can also pass any available provider model ID as a string if needed.

## [Embedding Models](#embedding-models)

You can create models that call the [Qwen embeddings API](https://www.alibabacloud.com/help/en/model-studio/getting-started/models#cff6607866tsg) using the `.textEmbeddingModel()` factory method.

```ts
const model = qwen.textEmbeddingModel('text-embedding-v3');
```

### [Model Capabilities](#model-capabilities-1)

| Model | Default Dimensions | Maximum number of rows | Maximum tokens per row |
| --- | --- | --- | --- |
| `text-embedding-v3` | 1024 | 6 | 8,192 |

[Previous

Writing a Custom Provider

](custom-providers.html)

[Next

Ollama

](ollama.html)

On this page

[Qwen Provider](#qwen-provider)

[Setup](#setup)

[Provider Instance](#provider-instance)

[Language Models](#language-models)

[Example](#example)

[Model Capabilities](#model-capabilities)

[Embedding Models](#embedding-models)

[Model Capabilities](#model-capabilities-1)

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