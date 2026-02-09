Observability Integrations: LangSmith

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

[Observability Integrations](../observability.html)LangSmith

# [LangSmith Observability](#langsmith-observability)

[LangSmith](https://docs.langchain.com/langsmith/) is a platform for building production-grade LLM applications. It allows you to closely monitor and evaluate your application, so you can ship quickly and with confidence.

Use of LangChain's open-source frameworks is not necessary.

A version of this guide is also available in the [LangSmith documentation](https://docs.langchain.com/langsmith/trace-with-vercel-ai-sdk). If you are using AI SDK v4 an older version of the `langsmith` client, see the legacy guide linked from that page.

## [Setup](#setup)

The steps in this guide assume you are using `langsmith>=0.3.63.`.

Install an [AI SDK model provider](../ai-sdk-providers.html) and the [LangSmith client SDK](https://npmjs.com/package/langsmith). The code snippets below will use the [AI SDK's OpenAI provider](../ai-sdk-providers/openai.html), but you can use any [other supported provider](../ai-sdk-providers.html) as well.

pnpm

npm

yarn

bun

pnpm add @ai-sdk/openai langsmith

Next, set required environment variables.

```bash
export LANGCHAIN_TRACING=true
export LANGCHAIN_API_KEY=<your-api-key>


export OPENAI_API_KEY=<your-openai-api-key> # The examples use OpenAI (replace with your selected provider)
```

## [Trace Logging](#trace-logging)

To start tracing, you will need to import and call the `wrapAISDK` method at the start of your code:

```ts
import { openai } from '@ai-sdk/openai';
import * as ai from 'ai';


import { wrapAISDK } from 'langsmith/experimental/vercel';


const { generateText, streamText, generateObject, streamObject } =
  wrapAISDK(ai);


await generateText({
  model: openai('gpt-5-nano'),
  prompt: 'Write a vegetarian lasagna recipe for 4 people.',
});
```

You should see a trace in your LangSmith dashboard [like this one](https://smith.langchain.com/public/4f0e689e-c801-44d3-8857-93b47ab100cc/r).

You can also trace runs with tool calls:

```ts
import * as ai from 'ai';
import { tool, stepCountIs } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';


import { wrapAISDK } from 'langsmith/experimental/vercel';


const { generateText, streamText, generateObject, streamObject } =
  wrapAISDK(ai);


await generateText({
  model: openai('gpt-5-nano'),
  messages: [
    {
      role: 'user',
      content: 'What are my orders and where are they? My user ID is 123',
    },
  ],
  tools: {
    listOrders: tool({
      description: 'list all orders',
      inputSchema: z.object({ userId: z.string() }),
      execute: async ({ userId }) =>
        `User ${userId} has the following orders: 1`,
    }),
    viewTrackingInformation: tool({
      description: 'view tracking information for a specific order',
      inputSchema: z.object({ orderId: z.string() }),
      execute: async ({ orderId }) =>
        `Here is the tracking information for ${orderId}`,
    }),
  },
  stopWhen: stepCountIs(5),
});
```

Which results in a trace like [this one](https://smith.langchain.com/public/6075fa2c-d255-4885-a66a-4fc798afaa9f/r).

You can use other AI SDK methods exactly as you usually would.

### [With `traceable`](#with-traceable)

You can wrap `traceable` calls around AI SDK calls or within AI SDK tool calls. This is useful if you want to group runs together in LangSmith:

```ts
import * as ai from 'ai';
import { tool, stepCountIs } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';


import { traceable } from 'langsmith/traceable';
import { wrapAISDK } from 'langsmith/experimental/vercel';


const { generateText, streamText, generateObject, streamObject } =
  wrapAISDK(ai);


const wrapper = traceable(
  async (input: string) => {
    const { text } = await generateText({
      model: openai('gpt-5-nano'),
      messages: [
        {
          role: 'user',
          content: input,
        },
      ],
      tools: {
        listOrders: tool({
          description: 'list all orders',
          inputSchema: z.object({ userId: z.string() }),
          execute: async ({ userId }) =>
            `User ${userId} has the following orders: 1`,
        }),
        viewTrackingInformation: tool({
          description: 'view tracking information for a specific order',
          inputSchema: z.object({ orderId: z.string() }),
          execute: async ({ orderId }) =>
            `Here is the tracking information for ${orderId}`,
        }),
      },
      stopWhen: stepCountIs(5),
    });
    return text;
  },
  {
    name: 'wrapper',
  },
);


await wrapper('What are my orders and where are they? My user ID is 123.');
```

The resulting trace will look [like this](https://smith.langchain.com/public/ff25bc26-9389-4798-8b91-2bdcc95d4a8e/r).

## [Tracing in serverless environments](#tracing-in-serverless-environments)

When tracing in serverless environments, you must wait for all runs to flush before your environment shuts down. See [this section](https://docs.langchain.com/langsmith/trace-with-vercel-ai-sdk#tracing-in-serverless-environments) of the LangSmith docs for examples.

## [Further reading](#further-reading)

For more examples and instructions for setting up tracing in specific environments, see the links below:

-   [LangSmith docs](https://docs.langchain.com/langsmith/)
-   [LangSmith guide on tracing with the AI SDK](https://docs.langchain.com/langsmith/trace-with-vercel-ai-sdk)

And once you've set up LangSmith tracing for your project, try gathering a dataset and evaluating it:

-   [LangSmith evaluation](https://docs.langchain.com/langsmith/evaluation)

[Previous

Langfuse

](langfuse.html)

[Next

LangWatch

](langwatch.html)

On this page

[LangSmith Observability](#langsmith-observability)

[Setup](#setup)

[Trace Logging](#trace-logging)

[With traceable](#with-traceable)

[Tracing in serverless environments](#tracing-in-serverless-environments)

[Further reading](#further-reading)

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