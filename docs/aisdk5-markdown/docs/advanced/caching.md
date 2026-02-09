Advanced: Caching

[](https://vercel.com/)

[

AI SDK



](../../index.html)

-   [Docs](../introduction.html)
-   [Cookbook](../../cookbook.html)
-   [Providers](../../providers/ai-sdk-providers.html)
-   [Playground](../../playground.html)
-   [
    
    AI ElementsAI Elements
    
    ](../../elements/overview.html)
-   [AI GatewayGateway](https://vercel.com/ai-gateway)

AI SDK 5 is available now.

[View Announcement](https://vercel.com/blog/ai-sdk-5)

Menu

[AI SDK by Vercel](../introduction.html)

[Foundations](../foundations.html)

[Overview](../foundations/overview.html)

[Providers and Models](../foundations/providers-and-models.html)

[Prompts](../foundations/prompts.html)

[Tools](../foundations/tools.html)

[Streaming](../foundations/streaming.html)

[Getting Started](../getting-started.html)

[Navigating the Library](../getting-started/navigating-the-library.html)

[Next.js App Router](../getting-started/nextjs-app-router.html)

[Next.js Pages Router](../getting-started/nextjs-pages-router.html)

[Svelte](../getting-started/svelte.html)

[Vue.js (Nuxt)](../getting-started/nuxt.html)

[Node.js](../getting-started/nodejs.html)

[Expo](../getting-started/expo.html)

[Agents](../agents.html)

[Agents](../agents/overview.html)

[Building Agents](../agents/building-agents.html)

[Workflow Patterns](../agents/workflows.html)

[Loop Control](../agents/loop-control.html)

[AI SDK Core](../ai-sdk-core.html)

[Overview](../ai-sdk-core/overview.html)

[Generating Text](../ai-sdk-core/generating-text.html)

[Generating Structured Data](../ai-sdk-core/generating-structured-data.html)

[Tool Calling](../ai-sdk-core/tools-and-tool-calling.html)

[Model Context Protocol (MCP) Tools](../ai-sdk-core/mcp-tools.html)

[Prompt Engineering](../ai-sdk-core/prompt-engineering.html)

[Settings](../ai-sdk-core/settings.html)

[Embeddings](../ai-sdk-core/embeddings.html)

[Image Generation](../ai-sdk-core/image-generation.html)

[Transcription](../ai-sdk-core/transcription.html)

[Speech](../ai-sdk-core/speech.html)

[Language Model Middleware](../ai-sdk-core/middleware.html)

[Provider & Model Management](../ai-sdk-core/provider-management.html)

[Error Handling](../ai-sdk-core/error-handling.html)

[Testing](../ai-sdk-core/testing.html)

[Telemetry](../ai-sdk-core/telemetry.html)

[AI SDK UI](../ai-sdk-ui.html)

[Overview](../ai-sdk-ui/overview.html)

[Chatbot](../ai-sdk-ui/chatbot.html)

[Chatbot Message Persistence](../ai-sdk-ui/chatbot-message-persistence.html)

[Chatbot Resume Streams](../ai-sdk-ui/chatbot-resume-streams.html)

[Chatbot Tool Usage](../ai-sdk-ui/chatbot-tool-usage.html)

[Generative User Interfaces](../ai-sdk-ui/generative-user-interfaces.html)

[Completion](../ai-sdk-ui/completion.html)

[Object Generation](../ai-sdk-ui/object-generation.html)

[Streaming Custom Data](../ai-sdk-ui/streaming-data.html)

[Error Handling](../ai-sdk-ui/error-handling.html)

[Transport](../ai-sdk-ui/transport.html)

[Reading UIMessage Streams](../ai-sdk-ui/reading-ui-message-streams.html)

[Message Metadata](../ai-sdk-ui/message-metadata.html)

[Stream Protocols](../ai-sdk-ui/stream-protocol.html)

[AI SDK RSC](../ai-sdk-rsc.html)

[Advanced](../advanced.html)

[Prompt Engineering](prompt-engineering.html)

[Stopping Streams](stopping-streams.html)

[Backpressure](backpressure.html)

[Caching](caching.html)

[Multiple Streamables](multiple-streamables.html)

[Rate Limiting](rate-limiting.html)

[Rendering UI with Language Models](rendering-ui-with-language-models.html)

[Language Models as Routers](model-as-router.html)

[Multistep Interfaces](multistep-interfaces.html)

[Sequential Generations](sequential-generations.html)

[Vercel Deployment Guide](vercel-deployment-guide.html)

[Reference](../reference.html)

[AI SDK Core](../reference/ai-sdk-core.html)

[AI SDK UI](../reference/ai-sdk-ui.html)

[AI SDK RSC](../reference/ai-sdk-rsc.html)

[Stream Helpers](../reference/stream-helpers.html)

[AI SDK Errors](../reference/ai-sdk-errors.html)

[Migration Guides](../migration-guides.html)

[Troubleshooting](../troubleshooting.html)

[Advanced](../advanced.html)Caching

# [Caching Responses](#caching-responses)

Depending on the type of application you're building, you may want to cache the responses you receive from your AI provider, at least temporarily.

## [Using Language Model Middleware (Recommended)](#using-language-model-middleware-recommended)

The recommended approach to caching responses is using [language model middleware](../ai-sdk-core/middleware.html) and the [`simulateReadableStream`](../reference/ai-sdk-core/simulate-readable-stream.html) function.

Language model middleware is a way to enhance the behavior of language models by intercepting and modifying the calls to the language model. Let's see how you can use language model middleware to cache responses.

```ts
import { Redis } from '@upstash/redis';
import {
  type LanguageModelV2,
  type LanguageModelV2Middleware,
  type LanguageModelV2StreamPart,
  simulateReadableStream,
} from 'ai';


const redis = new Redis({
  url: process.env.KV_URL,
  token: process.env.KV_TOKEN,
});


export const cacheMiddleware: LanguageModelV2Middleware = {
  wrapGenerate: async ({ doGenerate, params }) => {
    const cacheKey = JSON.stringify(params);


    const cached = (await redis.get(cacheKey)) as Awaited<
      ReturnType<LanguageModelV2['doGenerate']>
    > | null;


    if (cached !== null) {
      return {
        ...cached,
        response: {
          ...cached.response,
          timestamp: cached?.response?.timestamp
            ? new Date(cached?.response?.timestamp)
            : undefined,
        },
      };
    }


    const result = await doGenerate();


    redis.set(cacheKey, result);


    return result;
  },
  wrapStream: async ({ doStream, params }) => {
    const cacheKey = JSON.stringify(params);


    // Check if the result is in the cache
    const cached = await redis.get(cacheKey);


    // If cached, return a simulated ReadableStream that yields the cached result
    if (cached !== null) {
      // Format the timestamps in the cached response
      const formattedChunks = (cached as LanguageModelV2StreamPart[]).map(p => {
        if (p.type === 'response-metadata' && p.timestamp) {
          return { ...p, timestamp: new Date(p.timestamp) };
        } else return p;
      });
      return {
        stream: simulateReadableStream({
          initialDelayInMs: 0,
          chunkDelayInMs: 10,
          chunks: formattedChunks,
        }),
      };
    }


    // If not cached, proceed with streaming
    const { stream, ...rest } = await doStream();


    const fullResponse: LanguageModelV2StreamPart[] = [];


    const transformStream = new TransformStream<
      LanguageModelV2StreamPart,
      LanguageModelV2StreamPart
    >({
      transform(chunk, controller) {
        fullResponse.push(chunk);
        controller.enqueue(chunk);
      },
      flush() {
        // Store the full response in the cache after streaming is complete
        redis.set(cacheKey, fullResponse);
      },
    });


    return {
      stream: stream.pipeThrough(transformStream),
      ...rest,
    };
  },
};
```

This example uses `@upstash/redis` to store and retrieve the assistant's responses but you can use any KV storage provider you would like.

`LanguageModelMiddleware` has two methods: `wrapGenerate` and `wrapStream`. `wrapGenerate` is called when using [`generateText`](../reference/ai-sdk-core/generate-text.html) and [`generateObject`](../reference/ai-sdk-core/generate-object.html), while `wrapStream` is called when using [`streamText`](../reference/ai-sdk-core/stream-text.html) and [`streamObject`](../reference/ai-sdk-core/stream-object.html).

For `wrapGenerate`, you can cache the response directly. Instead, for `wrapStream`, you cache an array of the stream parts, which can then be used with [`simulateReadableStream`](../ai-sdk-core/testing.html#simulate-data-stream-protocol-responses) function to create a simulated `ReadableStream` that returns the cached response. In this way, the cached response is returned chunk-by-chunk as if it were being generated by the model. You can control the initial delay and delay between chunks by adjusting the `initialDelayInMs` and `chunkDelayInMs` parameters of `simulateReadableStream`.

You can see a full example of caching with Redis in a Next.js application in our [Caching Middleware Recipe](../../cookbook/next/caching-middleware.html).

## [Using Lifecycle Callbacks](#using-lifecycle-callbacks)

Alternatively, each AI SDK Core function has special lifecycle callbacks you can use. The one of interest is likely `onFinish`, which is called when the generation is complete. This is where you can cache the full response.

Here's an example of how you can implement caching using Vercel KV and Next.js to cache the OpenAI response for 1 hour:

This example uses [Upstash Redis](https://upstash.com/docs/redis/overall/getstarted) and Next.js to cache the response for 1 hour.

```tsx
import { openai } from '@ai-sdk/openai';
import { formatDataStreamPart, streamText, UIMessage } from 'ai';
import { Redis } from '@upstash/redis';


// Allow streaming responses up to 30 seconds
export const maxDuration = 30;


const redis = new Redis({
  url: process.env.KV_URL,
  token: process.env.KV_TOKEN,
});


export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();


  // come up with a key based on the request:
  const key = JSON.stringify(messages);


  // Check if we have a cached response
  const cached = await redis.get(key);
  if (cached != null) {
    return new Response(formatDataStreamPart('text', cached), {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    });
  }


  // Call the language model:
  const result = streamText({
    model: openai('gpt-4o'),
    messages: convertToModelMessages(messages),
    async onFinish({ text }) {
      // Cache the response text:
      await redis.set(key, text);
      await redis.expire(key, 60 * 60);
    },
  });


  // Respond with the stream
  return result.toUIMessageStreamResponse();
}
```

[Previous

Backpressure

](backpressure.html)

[Next

Multiple Streamables

](multiple-streamables.html)

On this page

[Caching Responses](#caching-responses)

[Using Language Model Middleware (Recommended)](#using-language-model-middleware-recommended)

[Using Lifecycle Callbacks](#using-lifecycle-callbacks)

Deploy and Scale AI Apps with Vercel.

Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:

-   OpenAI
-   Photoroom
-   ![leonardo-ai Logo](../../_next/logo-leonardo-ai-light.svg)![leonardo-ai Logo](../../_next/logo-leonardo-ai-dark.svg)
-   ![zapier Logo](../../_next/logo-zapier-light.svg)![zapier Logo](../../_next/logo-zapier-dark.svg)

[](https://vercel.com/contact/sales?utm_source=ai_sdk&utm_medium=web&utm_campaign=contact_sales_cta&utm_content=talk_to_an_expert_sdk_docs)

#### Resources

[Docs](../introduction.html)[Cookbook](../../cookbook.html)[Providers](../../providers/ai-sdk-providers.html)[Showcase](../../showcase.html)[GitHub](https://github.com/vercel/ai)[Discussions](https://github.com/vercel/ai/discussions)

#### More

[Playground](../../playground.html)[](https://v0.dev)[Contact Sales](https://vercel.com/contact/sales)

#### About Vercel

[Next.js + Vercel](https://vercel.com/frameworks/nextjs)[Open Source Software](https://vercel.com/oss)[GitHub](https://github.com/vercel)[X](https://x.com/vercel)

#### Legal

[Privacy Policy](https://vercel.com/legal/privacy-policy)

© 2025 Vercel, Inc.