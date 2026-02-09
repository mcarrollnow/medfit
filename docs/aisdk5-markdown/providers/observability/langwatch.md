Observability Integrations: LangWatch

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

[Axiom](axiom.html)

[Braintrust](braintrust.html)

[Helicone](helicone.html)

[Laminar](laminar.html)

[Langfuse](langfuse.html)

[LangSmith](langsmith.html)

[LangWatch](langwatch.html)

[Maxim](maxim.html)

[Patronus](patronus.html)

[Scorecard](scorecard.html)

[SigNoz](signoz.html)

[Traceloop](traceloop.html)

[Weave](weave.html)

[Observability Integrations](../observability.html)LangWatch

# [LangWatch Observability](#langwatch-observability)

[LangWatch](https://langwatch.ai/) ([GitHub](https://github.com/langwatch/langwatch)) is an LLM Ops platform for monitoring, experimenting, measuring and improving LLM pipelines, with a fair-code distribution model.

## [Setup](#setup)

Obtain your `LANGWATCH_API_KEY` from the [LangWatch dashboard](https://app.langwatch.com/).

pnpm

npm

yarn

bun

pnpm add langwatch

Ensure `LANGWATCH_API_KEY` is set:

Environment variables

Client parameters

```bash
LANGWATCH_API_KEY='your_api_key_here'
```

## [Basic Concepts](#basic-concepts)

-   Each message triggering your LLM pipeline as a whole is captured with a [Trace](https://docs.langwatch.ai/concepts#traces).
-   A [Trace](https://docs.langwatch.ai/concepts#traces) contains multiple [Spans](https://docs.langwatch.ai/concepts#spans), which are the steps inside your pipeline.
    -   A span can be an LLM call, a database query for a RAG retrieval, or a simple function transformation.
    -   Different types of [Spans](https://docs.langwatch.ai/concepts#spans) capture different parameters.
    -   [Spans](https://docs.langwatch.ai/concepts#spans) can be nested to capture the pipeline structure.
-   [Traces](https://docs.langwatch.ai/concepts#traces) can be grouped together on LangWatch Dashboard by having the same [`thread_id`](https://docs.langwatch.ai/concepts#threads) in their metadata, making the individual messages become part of a conversation.
    -   It is also recommended to provide the [`user_id`](https://docs.langwatch.ai/concepts#user-id) metadata to track user analytics.

## [Configuration](#configuration)

The AI SDK supports tracing via Next.js OpenTelemetry integration. By using the `LangWatchExporter`, you can automatically collect those traces to LangWatch.

First, you need to install the necessary dependencies:

```bash
npm install @vercel/otel langwatch @opentelemetry/api-logs @opentelemetry/instrumentation @opentelemetry/sdk-logs
```

Then, set up the OpenTelemetry for your application, follow one of the tabs below depending whether you are using AI SDK with Next.js or on Node.js:

Next.js

Node.js

You need to enable the `instrumentationHook` in your `next.config.js` file if you haven't already:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    instrumentationHook: true,
  },
};


module.exports = nextConfig;
```

Next, you need to create a file named `instrumentation.ts` (or `.js`) in the **root directory** of the project (or inside `src` folder if using one), with `LangWatchExporter` as the traceExporter:

```typescript
import { registerOTel } from '@vercel/otel';
import { LangWatchExporter } from 'langwatch';


export function register() {
  registerOTel({
    serviceName: 'next-app',
    traceExporter: new LangWatchExporter(),
  });
}
```

(Read more about Next.js OpenTelemetry configuration [on the official guide](https://nextjs.org/docs/app/building-your-application/optimizing/open-telemetry#manual-opentelemetry-configuration))

Finally, enable `experimental_telemetry` tracking on the AI SDK calls you want to trace:

```typescript
const result = await generateText({
  model: openai('gpt-4o-mini'),
  prompt:
    'Explain why a chicken would make a terrible astronaut, be creative and humorous about it.',
  experimental_telemetry: {
    isEnabled: true,
    // optional metadata
    metadata: {
      userId: 'myuser-123',
      threadId: 'mythread-123',
    },
  },
});
```

That's it! Your messages will now be visible on LangWatch:

![AI SDK](../../../mintlify.s3.us-west-1.amazonaws.com/langwatch/images/integration/vercel-ai-sdk.png)

### [Example Project](#example-project)

You can find a full example project with a more complex pipeline and AI SDK and LangWatch integration [on our GitHub](https://github.com/langwatch/langwatch/blob/main/typescript-sdk/example/lib/chat/vercel-ai.tsx).

### [Manual Integration](#manual-integration)

The docs from here below are for manual integration, in case you are not using the AI SDK OpenTelemetry integration, you can manually start a trace to capture your messages:

```typescript
import { LangWatch } from 'langwatch';


const langwatch = new LangWatch();


const trace = langwatch.getTrace({
  metadata: { threadId: 'mythread-123', userId: 'myuser-123' },
});
```

Then, you can start an LLM span inside the trace with the input about to be sent to the LLM.

```typescript
const span = trace.startLLMSpan({
  name: 'llm',
  model: model,
  input: {
    type: 'chat_messages',
    value: messages,
  },
});
```

This will capture the LLM input and register the time the call started. Once the LLM call is done, end the span to get the finish timestamp to be registered, and capture the output and the token metrics, which will be used for cost calculation, e.g.:

```typescript
span.end({
  output: {
    type: 'chat_messages',
    value: [chatCompletion.choices[0]!.message],
  },
  metrics: {
    promptTokens: chatCompletion.usage?.prompt_tokens,
    completionTokens: chatCompletion.usage?.completion_tokens,
  },
});
```

## [Resources](#resources)

For more information and examples, you can read more below:

-   [LangWatch documentation](https://docs.langwatch.ai/)
-   [LangWatch GitHub](https://github.com/langwatch/langwatch)

## [Support](#support)

If you have questions or need help, join our community:

-   [LangWatch Discord](https://discord.gg/kT4PhDS2gH)
-   [Email support](mailto:support@langwatch.ai)

[Previous

LangSmith

](langsmith.html)

[Next

Maxim

](maxim.html)

On this page

[LangWatch Observability](#langwatch-observability)

[Setup](#setup)

[Basic Concepts](#basic-concepts)

[Configuration](#configuration)

[Example Project](#example-project)

[Manual Integration](#manual-integration)

[Resources](#resources)

[Support](#support)

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