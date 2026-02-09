OpenAI Compatible Providers: Heroku

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

[Writing a Custom Provider](custom-providers.html)

[LM Studio](lmstudio.html)

[NVIDIA NIM](nim.html)

[Heroku](heroku.html)

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

[OpenAI Compatible Providers](../openai-compatible-providers.html)Heroku

# [Heroku Provider](#heroku-provider)

[Heroku](https://heroku.com/) is a cloud platform that allows you to deploy and run applications, including AI models with OpenAI API compatibility. You can deploy models that are OpenAI API compatible and use them with the AI SDK.

## [Setup](#setup)

The Heroku provider is available via the `@ai-sdk/openai-compatible` module as it is compatible with the OpenAI API. You can install it with

pnpm

npm

yarn

pnpm add @ai-sdk/openai-compatible

### [Heroku Setup](#heroku-setup)

1.  Create a test app in Heroku:

```bash
heroku create
```

2.  Inference using claude-3-5-haiku:

```bash
heroku ai:models:create -a $APP_NAME claude-3-5-haiku
```

3.  Export Variables:

```bash
export INFERENCE_KEY=$(heroku config:get INFERENCE_KEY -a $APP_NAME)
export INFERENCE_MODEL_ID=$(heroku config:get INFERENCE_MODEL_ID -a $APP_NAME)
export INFERENCE_URL=$(heroku config:get INFERENCE_URL -a $APP_NAME)
```

## [Provider Instance](#provider-instance)

To use Heroku, you can create a custom provider instance with the `createOpenAICompatible` function from `@ai-sdk/openai-compatible`:

```ts
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';


const heroku = createOpenAICompatible({
  name: 'heroku',
  baseURL: process.env.INFERENCE_URL + '/v1',
  apiKey: process.env.INFERENCE_KEY,
});
```

Be sure to have your `INFERENCE_KEY`, `INFERENCE_MODEL_ID`, and `INFERENCE_URL` set in your environment variables.

## [Language Models](#language-models)

You can create Heroku models using a provider instance. The first argument is the served model name, e.g. `claude-3-5-haiku`.

```ts
const model = heroku('claude-3-5-haiku');
```

### [Example](#example)

You can use Heroku language models to generate text with the `generateText` function:

```ts
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { generateText } from 'ai';


const heroku = createOpenAICompatible({
  name: 'heroku',
  baseURL: process.env.INFERENCE_URL + '/v1',
  apiKey: process.env.INFERENCE_KEY,
});


const { text } = await generateText({
  model: heroku('claude-3-5-haiku'),
  prompt: 'Tell me about yourself in one sentence',
});


console.log(text);
```

Heroku language models are also able to generate text in a streaming fashion with the `streamText` function:

```ts
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { streamText } from 'ai';


const heroku = createOpenAICompatible({
  name: 'heroku',
  baseURL: process.env.INFERENCE_URL + '/v1',
  apiKey: process.env.INFERENCE_KEY,
});


const result = streamText({
  model: heroku('claude-3-5-haiku'),
  prompt: 'Tell me about yourself in one sentence',
});


for await (const message of result.textStream) {
  console.log(message);
}
```

Heroku language models can also be used in the `generateObject`, and `streamObject` functions.

[Previous

NVIDIA NIM

](nim.html)

[Next

Community Providers

](../community-providers.html)

On this page

[Heroku Provider](#heroku-provider)

[Setup](#setup)

[Heroku Setup](#heroku-setup)

[Provider Instance](#provider-instance)

[Language Models](#language-models)

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