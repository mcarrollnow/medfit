Observability Integrations: SigNoz

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

[Observability Integrations](../observability.html)SigNoz

# [SigNoz Observability](#signoz-observability)

[SigNoz](https://signoz.io/) is a single tool for all your monitoring and observability needs. Here are a few reasons why you should choose SigNoz:

-   Single tool for observability(logs, metrics, and traces)
-   Built on top of [OpenTelemetry](https://opentelemetry.io/), the open-source standard which frees you from any type of vendor lock-in
-   Correlated logs, metrics and traces for much richer context while debugging
-   Uses ClickHouse (used by likes of Uber & Cloudflare) as datastore - an extremely fast and highly optimized storage for observability data
-   DIY Query builder, PromQL, and ClickHouse queries to fulfill all your use-cases around querying observability data

# [Setup](#setup)

-   Create a [SigNoz Cloud Account](https://signoz.io/teams/)
-   Generate a SigNoz Ingestion Key

## [Instrument your Next.js application](#instrument-your-nextjs-application)

Check out detailed instructions on how to set up OpenTelemetry instrumentation in your Nextjs applications and view your application traces in SigNoz over [here](https://signoz.io/docs/instrumentation/opentelemetry-nextjs/).

## [Send traces directly to SigNoz Cloud](#send-traces-directly-to-signoz-cloud)

**Step 1.** Install OpenTelemetry packages

```bash
npm install @vercel/otel @opentelemetry/api
```

**Step 2.** Update **`next.config.mjs`** to include instrumentationHook

> This step is only needed when using NextJs 14 and below

```jsx
/** @type {import('next').NextConfig} */
const nextConfig = {
  // include instrumentationHook experimental feature
  experimental: {
    instrumentationHook: true,
  },
};
export default nextConfig;
```

**Step 3.** Create **`instrumentation.ts`** file(in root project directory)

```jsx
import { registerOTel, OTLPHttpJsonTraceExporter } from '@vercel/otel';
// Add otel logging
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.ERROR); // set diaglog level to DEBUG when debugging
export function register() {
  registerOTel({
    serviceName: '<service_name>',
    traceExporter: new OTLPHttpJsonTraceExporter({
      url: 'https://ingest.<region>.signoz.cloud:443/v1/traces',
      headers: { 'signoz-ingestion-key': '<your-ingestion-key>' },
    }),
  });
}
```

-   **`<service_name>`** is the name of your service
-   Set the **`<region>`** to match your SigNoz Cloud [**region**](https://signoz.io/docs/ingestion/signoz-cloud/overview/#endpoint)
-   Replace **`<your-ingestion-key>`** with your SigNoz [**ingestion key**](https://signoz.io/docs/ingestion/signoz-cloud/keys/)

> The instrumentation file should be in the root of your project and not inside the app or pages directory. If you're using the src folder, then place the file inside src alongside pages and app.

Your Next.js app should be properly instrumented now.

## [Enable Telemetry for Vercel AI SDK](#enable-telemetry-for-vercel-ai-sdk)

The Vercel AI SDK uses [OpenTelemetry](https://signoz.io/blog/what-is-opentelemetry/) to collect telemetry data. OpenTelemetry is an open-source observability framework designed to provide standardized instrumentation for collecting telemetry data.

## [Enabling Telemetry](#enabling-telemetry)

Check out more detailed information about Vercel AI SDK’s telemetry options visit [here](../../docs/ai-sdk-core/telemetry.html#telemetry).

You can then use the `experimental_telemetry` option to enable telemetry on specific function calls while the feature is experimental:

```jsx
const result = await generateText({
  model: openai('gpt-4-turbo'),
  prompt: 'Write a short story about a cat.',
  experimental_telemetry: { isEnabled: true },
});
```

When telemetry is enabled, you can also control whether you want to record the input values and the output values for the function. By default, both are enabled. You can disable them by setting the `recordInputs` and `recordOutputs` options to `false`.

```jsx
experimental_telemetry: { isEnabled: true, recordInputs: false, recordOutputs: false}
```

Disabling the recording of inputs and outputs can be useful for privacy, data transfer, and performance reasons. You might, for example, want to disable recording inputs if they contain sensitive information.

## [Telemetry Metadata](#telemetry-metadata)

You can provide a `functionId` to identify the function that the telemetry data is for, and `metadata` to include additional information in the telemetry data.

```jsx
const result = await generateText({
  model: openai('gpt-4-turbo'),
  prompt: 'Write a short story about a cat.',
  experimental_telemetry: {
    isEnabled: true,
    functionId: 'my-awesome-function',
    metadata: {
      something: 'custom',
      someOtherThing: 'other-value',
    },
  },
});
```

## [Custom Tracer](#custom-tracer)

You may provide a `tracer` which must return an OpenTelemetry `Tracer`. This is useful in situations where you want your traces to use a `TracerProvider` other than the one provided by the `@opentelemetry/api` singleton.

```jsx
const tracerProvider = new NodeTracerProvider();
const result = await generateText({
  model: openai('gpt-4-turbo'),
  prompt: 'Write a short story about a cat.',
  experimental_telemetry: {
    isEnabled: true,
    tracer: tracerProvider.getTracer('ai'),
  },
});
```

Your Vercel AI SDK commands should now automatically emit traces, spans, and events. You can find more details on the types of spans and events generated [here](../../docs/ai-sdk-core/telemetry.html#collected-data).

Finally, you should be able to view this data in Signoz Cloud under the traces tab.

[Previous

Scorecard

](scorecard.html)

[Next

Traceloop

](traceloop.html)

On this page

[SigNoz Observability](#signoz-observability)

[Setup](#setup)

[Instrument your Next.js application](#instrument-your-nextjs-application)

[Send traces directly to SigNoz Cloud](#send-traces-directly-to-signoz-cloud)

[Enable Telemetry for Vercel AI SDK](#enable-telemetry-for-vercel-ai-sdk)

[Enabling Telemetry](#enabling-telemetry)

[Telemetry Metadata](#telemetry-metadata)

[Custom Tracer](#custom-tracer)

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