Observability Integrations: Patronus

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

[Observability Integrations](../observability.html)Patronus

# [Patronus Observability](#patronus-observability)

[Patronus AI](https://patronus.ai) provides an end-to-end system to evaluate, monitor and improve performance of an LLM system, enabling developers to ship AI products safely and confidently. Learn more [here](https://docs.patronus.ai/docs).

When you build with the AI SDK, you can stream OpenTelemetry (OTEL) traces straight into Patronus and pair every generation with rich automatic evaluations.

## [Setup](#setup)

### [1\. OpenTelemetry](#1-opentelemetry)

Patronus exposes a fully‑managed OTEL endpoint. Configure an **OTLP exporter** to point at it, pass your API key, and you’re done—Patronus will automatically convert LLM spans into prompt/response records you can explore and evaluate.

#### [Environment variables (recommended)](#environment-variables-recommended)

```bash
OTEL_EXPORTER_OTLP_ENDPOINT=https://otel.patronus.ai/v1/traces
OTEL_EXPORTER_OTLP_HEADERS="x-api-key:<PATRONUS_API_KEY>"
```

#### [With `@vercel/otel`](#with-vercelotel)

```ts
import { registerOTel } from '@vercel/otel';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-node';


export function register() {
  registerOTel({
    serviceName: 'next-app',
    additionalSpanProcessors: [
      new BatchSpanProcessor(
        new OTLPTraceExporter({
          url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT,
          headers: {
            'x-api-key': process.env.PATRONUS_API_KEY!,
          },
        }),
      ),
    ],
  });
}
```

If you need gRPC instead of HTTP, swap the exporter for `@opentelemetry/exporter-trace-otlp-grpc` and use `https://otel.patronus.ai:4317`.

### [2\. Enable telemetry on individual calls](#2-enable-telemetry-on-individual-calls)

The AI SDK emits a span only when you opt in with `experimental_telemetry`:

```ts
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';


const result = await generateText({
  model: openai('gpt-4o'),
  prompt: 'Write a haiku about spring.',
  experimental_telemetry: {
    isEnabled: true,
    functionId: 'spring-haiku', // span name
    metadata: {
      userId: 'user-123', // custom attrs surface in Patronus UI
    },
  },
});
```

Every attribute inside `metadata` becomes an OTEL attribute and is indexed by Patronus for filtering.

## [Example — tracing and automated evaluation](#example--tracing-and-automated-evaluation)

```ts
import { trace } from '@opentelemetry/api';
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';


export async function POST(req: Request) {
  const body = await req.json();
  const tracer = trace.getTracer('next-app');


  return await tracer.startActiveSpan('chat-evaluate', async span => {
    try {
      /* 1️⃣ generate answer */
      const answer = await generateText({
        model: openai('gpt-4o'),
        prompt: body.prompt,
        experimental_telemetry: { isEnabled: true, functionId: 'chat' },
      });


      /* 2️⃣ run Patronus evaluation inside the same trace */
      await fetch('https://api.patronus.ai/v1/evaluate', {
        method: 'POST',
        headers: {
          'X-API-Key': process.env.PATRONUS_API_KEY!,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          evaluators: [
            { evaluator: 'lynx', criteria: 'patronus:hallucination' },
          ],
          evaluated_model_input: body.prompt,
          evaluated_model_output: answer.text,
          trace_id: span.spanContext().traceId,
          span_id: span.spanContext().spanId,
        }),
      });


      return new Response(answer.text);
    } finally {
      span.end();
    }
  });
}
```

Result: a single trace containing the root HTTP request, the LLM generation span, and your evaluation span—**all visible in Patronus** with the hallucination score attached.

## [Once you've traced](#once-youve-traced)

-   If you're tracing an agent, Patronus's AI assistant Percival will assist with error analysis and prompt optimization. Learn more [here](https://docs.patronus.ai/docs/percival/percival)
-   Get set up on production monitoring and alerting by viewing logs and traces on Patronus and configuring webhooks for alerting. Learn more [here](https://docs.patronus.ai/docs/real_time_monitoring/webhooks)

## [Resources](#resources)

-   [Patronus docs](https://docs.patronus.ai)
-   [OpenTelemetry SDK (JS)](https://opentelemetry.io/docs/instrumentation/js/)

[Previous

Maxim

](maxim.html)

[Next

Scorecard

](scorecard.html)

On this page

[Patronus Observability](#patronus-observability)

[Setup](#setup)

[1\. OpenTelemetry](#1-opentelemetry)

[Environment variables (recommended)](#environment-variables-recommended)

[With @vercel/otel](#with-vercelotel)

[2\. Enable telemetry on individual calls](#2-enable-telemetry-on-individual-calls)

[Example — tracing and automated evaluation](#example--tracing-and-automated-evaluation)

[Once you've traced](#once-youve-traced)

[Resources](#resources)

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