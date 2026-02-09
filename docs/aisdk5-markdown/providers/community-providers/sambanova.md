Community Providers: SambaNova

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

[Community Providers](../community-providers.html)SambaNova

# [SambaNova Provider](#sambanova-provider)

[sambanova-ai-provider](https://github.com/sambanova/sambanova-ai-provider) contains language model support for the SambaNova API.

API keys can be obtained from the [SambaNova Cloud Platform](https://cloud.sambanova.ai/apis).

## [Setup](#setup)

The SambaNova provider is available via the `sambanova-ai-provider` module. You can install it with:

pnpm

npm

yarn

bun

pnpm add sambanova-ai-provider

### [Environment variables](#environment-variables)

Create a `.env` file with a `SAMBANOVA_API_KEY` variable.

## [Provider Instance](#provider-instance)

You can import the default provider instance `sambanova` from `sambanova-ai-provider`:

```ts
import { sambanova } from 'sambanova-ai-provider';
```

If you need a customized setup, you can import `createSambaNova` from `sambanova-ai-provider` and create a provider instance with your settings:

```ts
import { createSambaNova } from 'sambanova-ai-provider';


const sambanova = createSambaNova({
  // Optional settings
});
```

You can use the following optional settings to customize the SambaNova provider instance:

-   **baseURL** *string*
    
    Use a different URL prefix for API calls, e.g. to use proxy servers. The default prefix is `https://api.sambanova.ai/v1`.
    
-   **apiKey** *string*
    
    API key that is being sent using the `Authorization` header. It defaults to the `SAMBANOVA_API_KEY` environment variable.
    
-   **headers** *Record<string,string>*
    
    Custom headers to include in the requests.
    
-   **fetch** *(input: RequestInfo, init?: RequestInit) => Promise<Response>*
    
    Custom [fetch](https://developer.mozilla.org/en-US/docs/Web/API/fetch) implementation. Defaults to the global `fetch` function. You can use it as a middleware to intercept requests, or to provide a custom fetch implementation for e.g. testing.
    

## [Models](#models)

You can use [SambaNova models](https://docs.sambanova.ai/cloud/docs/get-started/supported-models) on a provider instance. The first argument is the model id, e.g. `Meta-Llama-3.1-70B-Instruct`.

```ts
const model = sambanova('Meta-Llama-3.1-70B-Instruct');
```

## [Tested models and capabilities](#tested-models-and-capabilities)

This provider is capable of generating and streaming text, and interpreting image inputs.

At least it has been tested with the following features (which use the `/chat/completion` endpoint):

| Chat completion | Image input |
| --- | --- |
|  |  |

### [Image input](#image-input)

You need to use any of the following models for visual understanding:

-   Llama3.2-11B-Vision-Instruct
-   Llama3.2-90B-Vision-Instruct

SambaNova does not support URLs, but the ai-sdk is able to download the file and send it to the model.

## [Example Usage](#example-usage)

Basic demonstration of text generation using the SambaNova provider.

```ts
import { createSambaNova } from 'sambanova-ai-provider';
import { generateText } from 'ai';


const sambanova = createSambaNova({
  apiKey: 'YOUR_API_KEY',
});


const model = sambanova('Meta-Llama-3.1-70B-Instruct');


const { text } = await generateText({
  model,
  prompt: 'Hello, nice to meet you.',
});


console.log(text);
```

You will get an output text similar to this one:

```undefined
Hello. Nice to meet you too. Is there something I can help you with or would you like to chat?
```

## [Intercepting Fetch Requests](#intercepting-fetch-requests)

This provider supports [Intercepting Fetch Requests](../../cookbook/node/intercept-fetch-requests.html).

### [Example](#example)

```ts
import { createSambaNova } from 'sambanova-ai-provider';
import { generateText } from 'ai';


const sambanovaProvider = createSambaNova({
  apiKey: 'YOUR_API_KEY',
  fetch: async (url, options) => {
    console.log('URL', url);
    console.log('Headers', JSON.stringify(options.headers, null, 2));
    console.log(`Body ${JSON.stringify(JSON.parse(options.body), null, 2)}`);
    return await fetch(url, options);
  },
});


const model = sambanovaProvider('Meta-Llama-3.1-70B-Instruct');


const { text } = await generateText({
  model,
  prompt: 'Hello, nice to meet you.',
});
```

And you will get an output like this:

```bash
URL https://api.sambanova.ai/v1/chat/completions
Headers {
  "Content-Type": "application/json",
  "Authorization": "Bearer YOUR_API_KEY"
}
Body {
  "model": "Meta-Llama-3.1-70B-Instruct",
  "temperature": 0,
  "messages": [
    {
      "role": "user",
      "content": "Hello, nice to meet you."
    }
  ]
}
```

[Previous

Zhipu AI

](zhipu.html)

[Next

Dify

](dify.html)

On this page

[SambaNova Provider](#sambanova-provider)

[Setup](#setup)

[Environment variables](#environment-variables)

[Provider Instance](#provider-instance)

[Models](#models)

[Tested models and capabilities](#tested-models-and-capabilities)

[Image input](#image-input)

[Example Usage](#example-usage)

[Intercepting Fetch Requests](#intercepting-fetch-requests)

[Example](#example)

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