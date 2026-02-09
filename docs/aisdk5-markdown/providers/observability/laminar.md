Observability Integrations: Laminar

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

[Observability Integrations](../observability.html)Laminar

# [Laminar observability](#laminar-observability)

[Laminar](https://laminar.sh) is the open-source platform for tracing and evaluating AI applications.

Laminar features:

-   [Tracing compatible with AI SDK and more](https://docs.lmnr.ai/tracing/introduction),
-   [Evaluations](https://docs.lmnr.ai/evaluations/introduction),
-   [Browser agent observability](https://docs.lmnr.ai/tracing/browser-agent-observability)

A version of this guide is available in [Laminar's docs](https://docs.lmnr.ai/tracing/integrations/vercel-ai-sdk).

## [Setup](#setup)

Laminar's tracing is based on OpenTelemetry. It supports AI SDK [telemetry](../../docs/ai-sdk-core/telemetry.html).

### [Installation](#installation)

To start with Laminar's tracing, first [install](https://docs.lmnr.ai/installation) the `@lmnr-ai/lmnr` package.

pnpm

npm

yarn

bun

pnpm add @lmnr-ai/lmnr

### [Get your project API key and set in the environment](#get-your-project-api-key-and-set-in-the-environment)

Then, either sign up on [Laminar](https://laminar.sh) or self-host an instance ([github](https://github.com/lmnr-ai/lmnr)) and create a new project.

In the project settings, create and copy the API key.

In your .env

```bash
LMNR_PROJECT_API_KEY=...
```

## [Next.js](#nextjs)

### [Initialize tracing](#initialize-tracing)

In Next.js, Laminar initialization should be done in `instrumentation.{ts,js}`:

```javascript
export async function register() {
  // prevent this from running in the edge runtime
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { Laminar } = await import('@lmnr-ai/lmnr');
    Laminar.initialize({
      projectApiKey: process.env.LMNR_PROJECT_API_KEY,
    });
  }
}
```

### [Add @lmnr-ai/lmnr to your next.config](#add-lmnr-ailmnr-to-your-nextconfig)

In your `next.config.js` (`.ts` / `.mjs`), add the following lines:

```javascript
const nextConfig = {
  serverExternalPackages: ['@lmnr-ai/lmnr'],
};


export default nextConfig;
```

This is because Laminar depends on OpenTelemetry, which uses some Node.js-specific functionality, and we need to inform Next.js about it. Learn more in the [Next.js docs](https://nextjs.org/docs/app/api-reference/config/next-config-js/serverExternalPackages).

### [Tracing AI SDK calls](#tracing-ai-sdk-calls)

Then, when you call AI SDK functions in any of your API routes, add the Laminar tracer to the `experimental_telemetry` option.

```javascript
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { getTracer } from '@lmnr-ai/lmnr';


const { text } = await generateText({
  model: openai('gpt-4o-mini'),
  prompt: 'What is Laminar flow?',
  experimental_telemetry: {
    isEnabled: true,
    tracer: getTracer(),
  },
});
```

This will create spans for `ai.generateText`. Laminar collects and displays the following information:

-   LLM call input and output
-   Start and end time
-   Duration / latency
-   Provider and model used
-   Input and output tokens
-   Input and output price
-   Additional metadata and span attributes

### [Older versions of Next.js](#older-versions-of-nextjs)

If you are using 13.4 ≤ Next.js < 15, you will also need to enable the experimental instrumentation hook. Place the following in your `next.config.js`:

```javascript
module.exports = {
  experimental: {
    instrumentationHook: true,
  },
};
```

For more information, see Laminar's [Next.js guide](https://docs.lmnr.ai/tracing/nextjs) and Next.js [instrumentation docs](https://nextjs.org/docs/app/api-reference/file-conventions/instrumentation). You can also learn how to enable all traces for Next.js in the docs.

### [Usage with `@vercel/otel`](#usage-with-vercelotel)

Laminar can live alongside `@vercel/otel` and trace AI SDK calls. The default Laminar setup will ensure that

-   regular Next.js traces are sent via `@vercel/otel` to your Telemetry backend configured with Vercel,
-   AI SDK and other LLM or browser agent traces are sent via Laminar.

```javascript
import { registerOTel } from '@vercel/otel';


export async function register() {
  registerOTel('my-service-name');
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { Laminar } = await import('@lmnr-ai/lmnr');
    // Make sure to initialize Laminar **after** `@registerOTel`
    Laminar.initialize({
      projectApiKey: process.env.LMNR_PROJECT_API_KEY,
    });
  }
}
```

For an advanced configuration that allows you to trace all Next.js traces via Laminar, see an example [repo](https://github.com/lmnr-ai/lmnr-ts/tree/main/examples/nextjs).

### [Usage with `@sentry/node`](#usage-with-sentrynode)

Laminar can live alongside `@sentry/node` and trace AI SDK calls. Make sure to initialize Laminar **after** `Sentry.init`.

This will ensure that

-   Whatever is instrumented by Sentry is sent to your Sentry backend,
-   AI SDK and other LLM or browser agent traces are sent via Laminar.

```javascript
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const Sentry = await import('@sentry/node');
    const { Laminar } = await import('@lmnr-ai/lmnr');


    Sentry.init({
      dsn: process.env.SENTRY_DSN,
    });


    // Make sure to initialize Laminar **after** `Sentry.init`
    Laminar.initialize({
      projectApiKey: process.env.LMNR_PROJECT_API_KEY,
    });
  }
}
```

## [Node.js](#nodejs)

### [Initialize tracing](#initialize-tracing-1)

Then, initialize tracing in your application:

```javascript
import { Laminar } from '@lmnr-ai/lmnr';


Laminar.initialize();
```

This must be done once in your application, as early as possible, but *after* other tracing libraries (e.g. `@sentry/node`) are initialized.

Read more in Laminar [docs](https://docs.lmnr.ai/tracing/introduction).

### [Tracing AI SDK calls](#tracing-ai-sdk-calls-1)

Then, when you call AI SDK functions in any of your API routes, add the Laminar tracer to the `experimental_telemetry` option.

```javascript
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { getTracer } from '@lmnr-ai/lmnr';


const { text } = await generateText({
  model: openai('gpt-4o-mini'),
  prompt: 'What is Laminar flow?',
  experimental_telemetry: {
    isEnabled: true,
    tracer: getTracer(),
  },
});
```

This will create spans for `ai.generateText`. Laminar collects and displays the following information:

-   LLM call input and output
-   Start and end time
-   Duration / latency
-   Provider and model used
-   Input and output tokens
-   Input and output price
-   Additional metadata and span attributes

### [Usage with `@sentry/node`](#usage-with-sentrynode-1)

Laminar can work with `@sentry/node` to trace AI SDK calls. Make sure to initialize Laminar **after** `Sentry.init`:

```javascript
const Sentry = await import('@sentry/node');
const { Laminar } = await import('@lmnr-ai/lmnr');


Sentry.init({
  dsn: process.env.SENTRY_DSN,
});


Laminar.initialize({
  projectApiKey: process.env.LMNR_PROJECT_API_KEY,
});
```

This will ensure that

-   Whatever is instrumented by Sentry is sent to your Sentry backend,
-   AI SDK and other LLM or browser agent traces are sent via Laminar.

The two libraries allow for additional advanced configuration, but the default setup above is recommended.

## [Additional configuration](#additional-configuration)

### [Span name](#span-name)

If you want to override the default span name, you can set the `functionId` inside the `telemetry` option.

```javascript
import { getTracer } from '@lmnr-ai/lmnr';


const { text } = await generateText({
  model: openai('gpt-4.1-nano'),
  prompt: `Write a poem about Laminar flow.`,
  experimental_telemetry: {
    isEnabled: true,
    tracer: getTracer(),
    functionId: 'poem-writer',
  },
});
```

### [Nested spans](#nested-spans)

If you want to trace not just the AI SDK calls, but also other functions in your application, you can use Laminar's `observe` wrapper.

```javascript
import { getTracer, observe } from '@lmnr-ai/lmnr';


const result = await observe({ name: 'my-function' }, async () => {
  // ... some work
  await generateText({
    //...
  });
  // ... some work
});
```

This will create a span with the name "my-function" and trace the function call. Inside it, you will see the nested `ai.generateText` spans.

To trace input arguments of the function that you wrap in `observe`, pass them to the wrapper as additional arguments. The return value of the function will be returned from the wrapper and traced as the span's output.

```javascript
const result = await observe(
  { name: 'poem writer' },
  async (topic: string, mood: string) => {
    const { text } = await generateText({
      model: openai('gpt-4.1-nano'),
      prompt: `Write a poem about ${topic} in ${mood} mood.`,
    });
    return text;
  },
  'Laminar flow',
  'happy',
);
```

### [Metadata](#metadata)

In Laminar, metadata is set on the trace level. Metadata contains key-value pairs and can be used to filter traces.

```javascript
import { getTracer } from '@lmnr-ai/lmnr';


const { text } = await generateText({
  model: openai('gpt-4.1-nano'),
  prompt: `Write a poem about Laminar flow.`,
  experimental_telemetry: {
    isEnabled: true,
    tracer: getTracer(),
    metadata: {
      'my-key': 'my-value',
      'another-key': 'another-value',
    },
  },
});
```

This is converted to Laminar's [metadata](https://docs.lmnr.ai/tracing/structure/metadata) and stored in the trace.

### [Tags](#tags)

One of the reserved metadata keys is `tags`. It can be used to add [tags](https://docs.lmnr.ai/tracing/structure/tags) to the span.

Tags can subsequently be used to filter traces in Laminar.

```javascript
import { getTracer } from '@lmnr-ai/lmnr';


const { text } = await generateText({
  model: openai('gpt-4.1-nano'),
  prompt: `Write a poem about Laminar flow.`,
  experimental_telemetry: {
    isEnabled: true,
    tracer: getTracer(),
    metadata: {
      tags: ['fallback-model', 'api-handler'],
    },
  },
});
```

### [Session ID and User ID](#session-id-and-user-id)

Traces in Laminar can be grouped into [sessions](https://docs.lmnr.ai/tracing/structure/session) or by [user ID](https://docs.lmnr.ai/tracing/structure/user-id). These are also reserved metadata keys.

```javascript
import { getTracer } from '@lmnr-ai/lmnr';


const { text } = await generateText({
  model: openai('gpt-4.1-nano'),
  prompt: `Write a poem about Laminar flow.`,
  experimental_telemetry: {
    isEnabled: true,
    tracer: getTracer(),
    metadata: {
      sessionId: 'session-123',
      userId: 'user-123',
    },
  },
});
```

[Previous

Helicone

](helicone.html)

[Next

Langfuse

](langfuse.html)

On this page

[Laminar observability](#laminar-observability)

[Setup](#setup)

[Installation](#installation)

[Get your project API key and set in the environment](#get-your-project-api-key-and-set-in-the-environment)

[Next.js](#nextjs)

[Initialize tracing](#initialize-tracing)

[Add @lmnr-ai/lmnr to your next.config](#add-lmnr-ailmnr-to-your-nextconfig)

[Tracing AI SDK calls](#tracing-ai-sdk-calls)

[Older versions of Next.js](#older-versions-of-nextjs)

[Usage with @vercel/otel](#usage-with-vercelotel)

[Usage with @sentry/node](#usage-with-sentrynode)

[Node.js](#nodejs)

[Initialize tracing](#initialize-tracing-1)

[Tracing AI SDK calls](#tracing-ai-sdk-calls-1)

[Usage with @sentry/node](#usage-with-sentrynode-1)

[Additional configuration](#additional-configuration)

[Span name](#span-name)

[Nested spans](#nested-spans)

[Metadata](#metadata)

[Tags](#tags)

[Session ID and User ID](#session-id-and-user-id)

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