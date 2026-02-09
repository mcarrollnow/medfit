Next.js: Caching Middleware

[](https://vercel.com/)

[

AI SDK



](../../index.html)

-   [Docs](../../docs/introduction.html)
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

[Guides](../guides.html)

[RAG Agent](../guides/rag-chatbot.html)

[Multi-Modal Agent](../guides/multi-modal-chatbot.html)

[Slackbot Agent Guide](../guides/slackbot.html)

[Natural Language Postgres](../guides/natural-language-postgres.html)

[Get started with Computer Use](../guides/computer-use.html)

[Get started with Gemini 2.5](../guides/gemini-2-5.html)

[Get started with Claude 4](../guides/claude-4.html)

[OpenAI Responses API](../guides/openai-responses.html)

[Google Gemini Image Generation](../guides/google-gemini-image-generation.html)

[Get started with Claude 3.7 Sonnet](../guides/sonnet-3-7.html)

[Get started with Llama 3.1](../guides/llama-3_1.html)

[Get started with GPT-5](../guides/gpt-5.html)

[Get started with OpenAI o1](../guides/o1.html)

[Get started with OpenAI o3-mini](../guides/o3.html)

[Get started with DeepSeek R1](../guides/r1.html)

[Next.js](generate-text.html)

[Generate Text](generate-text.html)

[Generate Text with Chat Prompt](generate-text-with-chat-prompt.html)

[Generate Image with Chat Prompt](generate-image-with-chat-prompt.html)

[Stream Text](stream-text.html)

[Stream Text with Chat Prompt](stream-text-with-chat-prompt.html)

[Stream Text with Image Prompt](stream-text-with-image-prompt.html)

[Chat with PDFs](chat-with-pdf.html)

[streamText Multi-Step Cookbook](stream-text-multistep.html)

[Markdown Chatbot with Memoization](markdown-chatbot-with-memoization.html)

[Generate Object](generate-object.html)

[Generate Object with File Prompt through Form Submission](generate-object-with-file-prompt.html)

[Stream Object](stream-object.html)

[Call Tools](call-tools.html)

[Call Tools in Multiple Steps](call-tools-multiple-steps.html)

[Model Context Protocol (MCP) Tools](mcp-tools.html)

[Share useChat State Across Components](use-shared-chat-context.html)

[Human-in-the-Loop Agent with Next.js](human-in-the-loop.html)

[Send Custom Body from useChat](send-custom-body-from-use-chat.html)

[Render Visual Interface in Chat](render-visual-interface-in-chat.html)

[Caching Middleware](caching-middleware.html)

[Node](../node/generate-text.html)

[Generate Text](../node/generate-text.html)

[Generate Text with Chat Prompt](../node/generate-text-with-chat-prompt.html)

[Generate Text with Image Prompt](../node/generate-text-with-image-prompt.html)

[Stream Text](../node/stream-text.html)

[Stream Text with Chat Prompt](../node/stream-text-with-chat-prompt.html)

[Stream Text with Image Prompt](../node/stream-text-with-image-prompt.html)

[Stream Text with File Prompt](../node/stream-text-with-file-prompt.html)

[Generate Object with a Reasoning Model](../node/generate-object-reasoning.html)

[Generate Object](../node/generate-object.html)

[Stream Object](../node/stream-object.html)

[Stream Object with Image Prompt](../node/stream-object-with-image-prompt.html)

[Record Token Usage After Streaming Object](../node/stream-object-record-token-usage.html)

[Record Final Object after Streaming Object](../node/stream-object-record-final-object.html)

[Call Tools](../node/call-tools.html)

[Call Tools with Image Prompt](../node/call-tools-with-image-prompt.html)

[Call Tools in Multiple Steps](../node/call-tools-multiple-steps.html)

[Model Context Protocol (MCP) Tools](../node/mcp-tools.html)

[Manual Agent Loop](../node/manual-agent-loop.html)

[Web Search Agent](../node/web-search-agent.html)

[Embed Text](../node/embed-text.html)

[Embed Text in Batch](../node/embed-text-batch.html)

[Intercepting Fetch Requests](../node/intercept-fetch-requests.html)

[Local Caching Middleware](../node/local-caching-middleware.html)

[Retrieval Augmented Generation](../node/retrieval-augmented-generation.html)

[Knowledge Base Agent](../node/knowledge-base-agent.html)

[API Servers](../api-servers/node-http-server.html)

[Node.js HTTP Server](../api-servers/node-http-server.html)

[Express](../api-servers/express.html)

[Hono](../api-servers/hono.html)

[Fastify](../api-servers/fastify.html)

[Nest.js](../api-servers/nest.html)

[React Server Components](../rsc/generate-text.html)

[Next.js](generate-text.html)Caching Middleware

# [Caching Middleware](#caching-middleware)

This example is not yet updated to v5.

Let's create a simple chat interface that uses [`LanguageModelMiddleware`](../../docs/ai-sdk-core/middleware.html) to cache the assistant's responses in fast KV storage.

## [Client](#client)

Let's create a simple chat interface that allows users to send messages to the assistant and receive responses. You will integrate the `useChat` hook from `@ai-sdk/react` to stream responses.

```tsx
'use client';


import { useChat } from '@ai-sdk/react';


export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, error } = useChat();
  if (error) return <div>{error.message}</div>;


  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      <div className="space-y-4">
        {messages.map(m => (
          <div key={m.id} className="whitespace-pre-wrap">
            <div>
              <div className="font-bold">{m.role}</div>
              {m.toolInvocations ? (
                <pre>{JSON.stringify(m.toolInvocations, null, 2)}</pre>
              ) : (
                <p>{m.content}</p>
              )}
            </div>
          </div>
        ))}
      </div>


      <form onSubmit={handleSubmit}>
        <input
          className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
```

## [Middleware](#middleware)

Next, you will create a `LanguageModelMiddleware` that caches the assistant's responses in KV storage. `LanguageModelMiddleware` has two methods: `wrapGenerate` and `wrapStream`. `wrapGenerate` is called when using [`generateText`](../../docs/reference/ai-sdk-core/generate-text.html) and [`generateObject`](../../docs/reference/ai-sdk-core/generate-object.html), while `wrapStream` is called when using [`streamText`](../../docs/reference/ai-sdk-core/stream-text.html) and [`streamObject`](../../docs/reference/ai-sdk-core/stream-object.html).

For `wrapGenerate`, you can cache the response directly. Instead, for `wrapStream`, you cache an array of the stream parts, which can then be used with [`simulateReadableStream`](../../docs/reference/ai-sdk-core/simulate-readable-stream.html) function to create a simulated `ReadableStream` that returns the cached response. In this way, the cached response is returned chunk-by-chunk as if it were being generated by the model. You can control the initial delay and delay between chunks by adjusting the `initialDelayInMs` and `chunkDelayInMs` parameters of `simulateReadableStream`.

```tsx
import { Redis } from '@upstash/redis';
import {
  type LanguageModelV1,
  type LanguageModelV2Middleware,
  type LanguageModelV1StreamPart,
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
      ReturnType<LanguageModelV1['doGenerate']>
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
      const formattedChunks = (cached as LanguageModelV1StreamPart[]).map(p => {
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


    const fullResponse: LanguageModelV1StreamPart[] = [];


    const transformStream = new TransformStream<
      LanguageModelV1StreamPart,
      LanguageModelV1StreamPart
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

## [Server](#server)

Finally, you will create an API route for `api/chat` to handle the assistant's messages and responses. You can use your cache middleware by wrapping the model with `wrapLanguageModel` and passing the middleware as an argument.

```tsx
import { cacheMiddleware } from '@/ai/middleware';
import { openai } from '@ai-sdk/openai';
import { wrapLanguageModel, streamText, tool } from 'ai';
import { z } from 'zod';


const wrappedModel = wrapLanguageModel({
  model: openai('gpt-4o-mini'),
  middleware: cacheMiddleware,
});


export async function POST(req: Request) {
  const { messages } = await req.json();


  const result = streamText({
    model: wrappedModel,
    messages,
    tools: {
      weather: tool({
        description: 'Get the weather in a location',
        inputSchema: z.object({
          location: z.string().describe('The location to get the weather for'),
        }),
        execute: async ({ location }) => ({
          location,
          temperature: 72 + Math.floor(Math.random() * 21) - 10,
        }),
      }),
    },
  });
  return result.toUIMessageStreamResponse();
}
```

[Previous

Generate Image with Chat Prompt

](generate-image-with-chat-prompt.html)

[Next

Stream Text

](stream-text.html)

On this page

[Caching Middleware](#caching-middleware)

[Client](#client)

[Middleware](#middleware)

[Server](#server)

Deploy and Scale AI Apps with Vercel.

Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:

-   OpenAI
-   Photoroom
-   ![leonardo-ai Logo](../../_next/logo-leonardo-ai-light.svg)![leonardo-ai Logo](../../_next/logo-leonardo-ai-dark.svg)
-   ![zapier Logo](../../_next/logo-zapier-light.svg)![zapier Logo](../../_next/logo-zapier-dark.svg)

[](https://vercel.com/contact/sales?utm_source=ai_sdk&utm_medium=web&utm_campaign=contact_sales_cta&utm_content=talk_to_an_expert_sdk_docs)

#### Resources

[Docs](../../docs/introduction.html)[Cookbook](../../cookbook.html)[Providers](../../providers/ai-sdk-providers.html)[Showcase](../../showcase.html)[GitHub](https://github.com/vercel/ai)[Discussions](https://github.com/vercel/ai/discussions)

#### More

[Playground](../../playground.html)[](https://v0.dev)[Contact Sales](https://vercel.com/contact/sales)

#### About Vercel

[Next.js + Vercel](https://vercel.com/frameworks/nextjs)[Open Source Software](https://vercel.com/oss)[GitHub](https://github.com/vercel)[X](https://x.com/vercel)

#### Legal

[Privacy Policy](https://vercel.com/legal/privacy-policy)

© 2025 Vercel, Inc.