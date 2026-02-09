Observability Integrations: Langfuse

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

[Observability Integrations](../observability.html)Langfuse

# [Langfuse Observability](#langfuse-observability)

[Langfuse](https://langfuse.com/) ([GitHub](https://github.com/langfuse/langfuse)) is an open source LLM engineering platform that helps teams to collaboratively develop, monitor, and debug AI applications. Langfuse integrates with the AI SDK to provide:

-   [Application traces](https://langfuse.com/docs/tracing)
-   Usage patterns
-   Cost data by user and model
-   Replay sessions to debug issues
-   [Evaluations](https://langfuse.com/docs/scores/overview)

## [Setup](#setup)

The AI SDK supports tracing via OpenTelemetry. With the `LangfuseExporter` you can collect these traces in Langfuse. While telemetry is experimental ([docs](../../docs/ai-sdk-core/telemetry.html#enabling-telemetry)), you can enable it by setting `experimental_telemetry` on each request that you want to trace.

```ts
const result = await generateText({
  model: openai('gpt-4o'),
  prompt: 'Write a short story about a cat.',
  experimental_telemetry: { isEnabled: true },
});
```

To collect the traces in Langfuse, you need to add the `LangfuseExporter` to your application.

You can set the Langfuse credentials via environment variables or directly to the `LangfuseExporter` constructor.

To get your Langfuse API keys, you can [self-host Langfuse](https://langfuse.com/docs/deployment/self-host) or sign up for Langfuse Cloud [here](https://cloud.langfuse.com). Create a project in the Langfuse dashboard to get your `secretKey` and `publicKey.`

Environment Variables

Constructor

```bash
LANGFUSE_SECRET_KEY="sk-lf-..."
LANGFUSE_PUBLIC_KEY="pk-lf-..."
LANGFUSE_BASEURL="https://cloud.langfuse.com" # 🇪🇺 EU region, use "https://us.cloud.langfuse.com" for US region
```

Now you need to register this exporter via the OpenTelemetry SDK.

Next.js

Node.js

Next.js has support for OpenTelemetry instrumentation on the framework level. Learn more about it in the [Next.js OpenTelemetry guide](https://nextjs.org/docs/app/building-your-application/optimizing/open-telemetry).

Install dependencies:

```bash
npm install @vercel/otel langfuse-vercel @opentelemetry/api-logs @opentelemetry/instrumentation @opentelemetry/sdk-logs
```

Add `LangfuseExporter` to your instrumentation:

```ts
import { registerOTel } from '@vercel/otel';
import { LangfuseExporter } from 'langfuse-vercel';


export function register() {
  registerOTel({
    serviceName: 'langfuse-vercel-ai-nextjs-example',
    traceExporter: new LangfuseExporter(),
  });
}
```

Done! All traces that contain AI SDK spans are automatically captured in Langfuse.

## [Example Application](#example-application)

Check out the sample repository ([langfuse/langfuse-vercel-ai-nextjs-example](https://github.com/langfuse/langfuse-vercel-ai-nextjs-example)) based on the [next-openai](https://github.com/vercel/ai/tree/main/examples/next-openai) template to showcase the integration of Langfuse with Next.js and AI SDK.

## [Configuration](#configuration)

### [Group multiple executions in one trace](#group-multiple-executions-in-one-trace)

You can open a Langfuse trace and pass the trace ID to AI SDK calls to group multiple execution spans under one trace. The passed name in `functionId` will be the root span name of the respective execution.

```ts
import { randomUUID } from 'crypto';
import { Langfuse } from 'langfuse';


const langfuse = new Langfuse();
const parentTraceId = randomUUID();


langfuse.trace({
  id: parentTraceId,
  name: 'holiday-traditions',
});


for (let i = 0; i < 3; i++) {
  const result = await generateText({
    model: openai('gpt-3.5-turbo'),
    maxOutputTokens: 50,
    prompt: 'Invent a new holiday and describe its traditions.',
    experimental_telemetry: {
      isEnabled: true,
      functionId: `holiday-tradition-${i}`,
      metadata: {
        langfuseTraceId: parentTraceId,
        langfuseUpdateParent: false, // Do not update the parent trace with execution results
      },
    },
  });


  console.log(result.text);
}


await langfuse.flushAsync();
await sdk.shutdown();
```

The resulting trace hierarchy will be:

![Vercel nested trace in Langfuse UI](../../../langfuse.com/images/docs/vercel-nested-trace.png)

### [Disable Tracking of Input/Output](#disable-tracking-of-inputoutput)

By default, the exporter captures the input and output of each request. You can disable this behavior by setting the `recordInputs` and `recordOutputs` options to `false`.

### [Link Langfuse prompts to traces](#link-langfuse-prompts-to-traces)

You can link Langfuse prompts to AI SDK generations by setting the `langfusePrompt` property in the `metadata` field:

```typescript
import { generateText } from 'ai';
import { Langfuse } from 'langfuse';


const langfuse = new Langfuse();


const fetchedPrompt = await langfuse.getPrompt('my-prompt');


const result = await generateText({
  model: openai('gpt-4o'),
  prompt: fetchedPrompt.prompt,
  experimental_telemetry: {
    isEnabled: true,
    metadata: {
      langfusePrompt: fetchedPrompt.toJSON(),
    },
  },
});
```

The resulting generation will have the prompt linked to the trace in Langfuse. Learn more about prompts in Langfuse [here](https://langfuse.com/docs/prompts/get-started).

### [Pass Custom Attributes](#pass-custom-attributes)

All of the `metadata` fields are automatically captured by the exporter. You can also pass custom trace attributes to e.g. track users or sessions.

```ts
const result = await generateText({
  model: openai('gpt-4o'),
  prompt: 'Write a short story about a cat.',
  experimental_telemetry: {
    isEnabled: true,
    functionId: 'my-awesome-function', // Trace name
    metadata: {
      langfuseTraceId: 'trace-123', // Langfuse trace
      tags: ['story', 'cat'], // Custom tags
      userId: 'user-123', // Langfuse user
      sessionId: 'session-456', // Langfuse session
      foo: 'bar', // Any custom attribute recorded in metadata
    },
  },
});
```

## [Debugging](#debugging)

Enable the `debug` option to see the logs of the exporter.

```ts
new LangfuseExporter({ debug: true });
```

## [Troubleshooting](#troubleshooting)

-   If you deploy on Vercel, Vercel's OpenTelemetry Collector is only available on Pro and Enterprise Plans ([docs](https://vercel.com/docs/observability/otel-overview)).
-   You need to be on `"ai": "^3.3.0"` to use the telemetry feature. In case of any issues, please update to the latest version.
-   On NextJS, make sure that you only have a single instrumentation file.
-   If you use Sentry, make sure to either:
    -   set `skipOpenTelemetrySetup: true` in Sentry.init
    -   follow Sentry's docs on how to manually set up Sentry with OTEL

## [Learn more](#learn-more)

-   After setting up Langfuse Tracing for the AI SDK, you can utilize any of the other Langfuse [platform features](https://langfuse.com/docs):
    -   [Prompt Management](https://langfuse.com/docs/prompts): Collaboratively manage and iterate on prompts, use them with low-latency in production.
    -   [Evaluations](https://langfuse.com/docs/scores): Test the application holistically in development and production using user feedback, LLM-as-a-judge evaluators, manual reviews, or custom evaluation pipelines.
    -   [Experiments](https://langfuse.com/docs/datasets): Iterate on prompts, models, and application design in a structured manner with datasets and evaluations.
-   For more information, see the [telemetry documentation](../../docs/ai-sdk-core/telemetry.html) of the AI SDK.

[Previous

Laminar

](laminar.html)

[Next

LangSmith

](langsmith.html)

On this page

[Langfuse Observability](#langfuse-observability)

[Setup](#setup)

[Example Application](#example-application)

[Configuration](#configuration)

[Group multiple executions in one trace](#group-multiple-executions-in-one-trace)

[Disable Tracking of Input/Output](#disable-tracking-of-inputoutput)

[Link Langfuse prompts to traces](#link-langfuse-prompts-to-traces)

[Pass Custom Attributes](#pass-custom-attributes)

[Debugging](#debugging)

[Troubleshooting](#troubleshooting)

[Learn more](#learn-more)

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