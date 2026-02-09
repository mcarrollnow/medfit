Observability Integrations: Axiom

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

[Observability Integrations](../observability.html)Axiom

# [Axiom Observability](#axiom-observability)

**Axiom** is a data platform with specialized features for **AI engineering workflows**, helping you build sophisticated AI systems with confidence.

Axiom’s integration with the AI SDK uses a model wrapper to automatically capture detailed traces for every LLM call, giving you immediate visibility into your application's performance, cost, and behavior.

## [Setup](#setup)

### [1\. Configure Axiom](#1-configure-axiom)

First, you'll need an Axiom organization, a dataset to send traces to, and an API token.

-   [Create an Axiom organization](https://app.axiom.co/register).
-   [Create a new dataset](https://app.axiom.co/datasets) (e.g., `my-ai-app`).
-   [Create an API token](https://app.axiom.co/settings/api-tokens) with ingest permissions for your dataset.

### [2\. Install the Axiom SDK](#2-install-the-axiom-sdk)

Install the Axiom package in your project:

pnpm

npm

yarn

bun

pnpm add axiom

### [3\. Set Environment Variables](#3-set-environment-variables)

Configure your environment variables in a `.env` file. This uses the standard OpenTelemetry configuration to send traces directly to your Axiom dataset.

```bash
# Axiom Configuration
AXIOM_TOKEN="YOUR_AXIOM_API_TOKEN"
AXIOM_DATASET="your-axiom-dataset-name"


# Vercel and OpenTelemetry Configuration
OTEL_SERVICE_NAME="my-ai-app"
OTEL_EXPORTER_OTLP_ENDPOINT="https://api.axiom.co/v1/traces"
OTEL_EXPORTER_OTLP_HEADERS="Authorization=Bearer YOUR_AXIOM_API_TOKEN,X-Axiom-Dataset=your-axiom-dataset-name"


# Your AI Provider Key
OPENAI_API_KEY="YOUR_OPENAI_API_KEY"
```

Replace the placeholder values with your actual Axiom token and dataset name.

### [4\. Set Up Instrumentation](#4-set-up-instrumentation)

To send data to Axiom, configure a tracer. For example, use a dedicated instrumentation file and load it before the rest of your app. An example configuration for a Node.js environment:

1.  Install dependencies:

pnpm

npm

yarn

bun

pnpm i dotenv @opentelemetry/exporter-trace-otlp-http @opentelemetry/resources @opentelemetry/sdk-node @opentelemetry/sdk-trace-node @opentelemetry/semantic-conventions @opentelemetry/api

2.  Create instrumentation file:

```typescript
import { trace } from '@opentelemetry/api';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import type { Resource } from '@opentelemetry/resources';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-node';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';
import { initAxiomAI, RedactionPolicy } from 'axiom/ai';


const tracer = trace.getTracer('my-tracer');


const sdk = new NodeSDK({
  resource: resourceFromAttributes({
    [ATTR_SERVICE_NAME]: 'my-ai-app',
  }) as Resource,
  spanProcessor: new SimpleSpanProcessor(
    new OTLPTraceExporter({
      url: `https://api.axiom.co/v1/traces`,
      headers: {
        Authorization: `Bearer ${process.env.AXIOM_TOKEN}`,
        'X-Axiom-Dataset': process.env.AXIOM_DATASET,
      },
    }),
  ),
});


sdk.start();


initAxiomAI({ tracer, redactionPolicy: RedactionPolicy.AxiomDefault });
```

### [5\. Wrap and Use the AI Model](#5-wrap-and-use-the-ai-model)

In your application code, import `wrapAISDKModel` from Axiom and use it to wrap your existing AI SDK model client.

```typescript
import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { wrapAISDKModel } from 'axiom/ai';


// 1. Create your standard AI model provider
const openaiProvider = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


// 2. Wrap the model to enable automatic tracing
const tracedGpt4o = wrapAISDKModel(openaiProvider('gpt-4o'));


// 3. Use the wrapped model as you normally would
const { text } = await generateText({
  model: tracedGpt4o,
  prompt: 'What is the capital of Spain?',
});


console.log(text);
```

Any calls made using the `tracedGpt4o` model will now automatically send detailed traces to your Axiom dataset.

## [What You'll See in Axiom](#what-youll-see-in-axiom)

Once integrated, your Axiom dataset will include:

-   **AI Trace Waterfall:** A dedicated view to visualize single and multi-step LLM workflows.
-   **Gen AI Dashboard:** A pre-built dashboard to monitor cost, latency, token usage, and error rates.
-   **Detailed Spans:** Rich telemetry for every call, including the full prompt and completion, token counts, and model information.

## [Advanced Usage](#advanced-usage)

Axiom’s AI SDK offers more advanced instrumentation for deeper visibility:

-   **Business Context:** Use the `withSpan` function to group LLM calls under a specific business capability (e.g., `customer_support_agent`).
-   **Tool Tracing:** Use the `wrapTool` helper to automatically trace the execution of tools your AI model calls.

To learn more about these features, see the [Axiom AI SDK Instrumentation guide](https://axiom.co/docs/ai-engineering/observe/axiom-ai-sdk-instrumentation).

## [Additional Resources](#additional-resources)

-   [Axiom AI Engineering Documentation](https://axiom.co/docs/ai-engineering/overview)
-   [Axiom AI SDK on GitHub](https://github.com/axiomhq/ai)
-   [Full Quickstart Guide](https://axiom.co/docs/ai-engineering/quickstart)

[Previous

Observability Integrations

](../observability.html)

[Next

Braintrust

](braintrust.html)

On this page

[Axiom Observability](#axiom-observability)

[Setup](#setup)

[1\. Configure Axiom](#1-configure-axiom)

[2\. Install the Axiom SDK](#2-install-the-axiom-sdk)

[3\. Set Environment Variables](#3-set-environment-variables)

[Axiom Configuration](#axiom-configuration)

[Vercel and OpenTelemetry Configuration](#vercel-and-opentelemetry-configuration)

[Your AI Provider Key](#your-ai-provider-key)

[4\. Set Up Instrumentation](#4-set-up-instrumentation)

[5\. Wrap and Use the AI Model](#5-wrap-and-use-the-ai-model)

[What You'll See in Axiom](#what-youll-see-in-axiom)

[Advanced Usage](#advanced-usage)

[Additional Resources](#additional-resources)

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