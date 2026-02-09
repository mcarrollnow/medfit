Observability Integrations: Braintrust

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

[Observability Integrations](../observability.html)Braintrust

# [Braintrust Observability](#braintrust-observability)

Braintrust is an end-to-end platform for building AI applications. When building with the AI SDK, you can integrate Braintrust to [log](https://www.braintrust.dev/docs/guides/logging), monitor, and take action on real-world interactions.

## [Setup](#setup)

Braintrust natively supports OpenTelemetry and works out of the box with the AI SDK, either via Next.js or Node.js.

### [Next.js](#nextjs)

If you are using Next.js, use the Braintrust exporter with `@vercel/otel`:

```typescript
import { registerOTel } from '@vercel/otel';
import { BraintrustExporter } from 'braintrust';


// In your instrumentation.ts file
export function register() {
  registerOTel({
    serviceName: 'my-braintrust-app',
    traceExporter: new BraintrustExporter({
      parent: 'project_name:your-project-name',
      filterAISpans: true, // Only send AI-related spans
    }),
  });
}
```

Traced LLM calls will appear under the Braintrust project or experiment provided in the `parent` field.

When you call the AI SDK, make sure to set `experimental_telemetry`:

```typescript
const result = await generateText({
  model: openai('gpt-4o-mini'),
  prompt: 'What is 2 + 2?',
  experimental_telemetry: {
    isEnabled: true,
    metadata: {
      query: 'weather',
      location: 'San Francisco',
    },
  },
});
```

The integration supports streaming functions like `streamText`. Each streamed call will produce `ai.streamText` spans in Braintrust.

```typescript
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';


export async function POST(req: Request) {
  const { prompt } = await req.json();


  const result = await streamText({
    model: openai('gpt-4o-mini'),
    prompt,
    experimental_telemetry: { isEnabled: true },
  });


  return result.toDataStreamResponse();
}
```

### [Node.js](#nodejs)

If you are using Node.js without a framework, you must configure the `NodeSDK` directly. In this case, it's more straightforward to use the `BraintrustSpanProcessor`.

First, install the necessary dependencies:

```bash
npm install ai @ai-sdk/openai braintrust @opentelemetry/sdk-node @opentelemetry/sdk-trace-base zod
```

Then, set up the OpenTelemetry SDK:

```typescript
import { NodeSDK } from '@opentelemetry/sdk-node';
import { generateText, tool } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import { BraintrustSpanProcessor } from 'braintrust';


const sdk = new NodeSDK({
  spanProcessors: [
    new BraintrustSpanProcessor({
      parent: 'project_name:your-project-name',
      filterAISpans: true,
    }),
  ],
});


sdk.start();


async function main() {
  const result = await generateText({
    model: openai('gpt-4o-mini'),
    messages: [
      {
        role: 'user',
        content: 'What are my orders and where are they? My user ID is 123',
      },
    ],
    tools: {
      listOrders: tool({
        description: 'list all orders',
        parameters: z.object({ userId: z.string() }),
        execute: async ({ userId }) =>
          `User ${userId} has the following orders: 1`,
      }),
      viewTrackingInformation: tool({
        description: 'view tracking information for a specific order',
        parameters: z.object({ orderId: z.string() }),
        execute: async ({ orderId }) =>
          `Here is the tracking information for ${orderId}`,
      }),
    },
    experimental_telemetry: {
      isEnabled: true,
      functionId: 'my-awesome-function',
      metadata: {
        something: 'custom',
        someOtherThing: 'other-value',
      },
    },
    maxSteps: 10,
  });


  await sdk.shutdown();
}


main().catch(console.error);
```

## [Resources](#resources)

To see a step-by-step example, check out the Braintrust [cookbook](https://www.braintrust.dev/docs/cookbook/recipes/OTEL-logging).

After you log your application in Braintrust, explore other workflows like:

-   Adding [tools](https://www.braintrust.dev/docs/guides/functions/tools) to your library and using them in [experiments](https://www.braintrust.dev/docs/guides/evals) and the [playground](https://www.braintrust.dev/docs/guides/playground)
-   Creating [custom scorers](https://www.braintrust.dev/docs/guides/functions/scorers) to assess the quality of your LLM calls
-   Adding your logs to a [dataset](https://www.braintrust.dev/docs/guides/datasets) and running evaluations comparing models and prompts

[Previous

Axiom

](axiom.html)

[Next

Helicone

](helicone.html)

On this page

[Braintrust Observability](#braintrust-observability)

[Setup](#setup)

[Next.js](#nextjs)

[Node.js](#nodejs)

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