Node: Local Caching Middleware

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

[Next.js](../next/generate-text.html)

[Generate Text](../next/generate-text.html)

[Generate Text with Chat Prompt](../next/generate-text-with-chat-prompt.html)

[Generate Image with Chat Prompt](../next/generate-image-with-chat-prompt.html)

[Stream Text](../next/stream-text.html)

[Stream Text with Chat Prompt](../next/stream-text-with-chat-prompt.html)

[Stream Text with Image Prompt](../next/stream-text-with-image-prompt.html)

[Chat with PDFs](../next/chat-with-pdf.html)

[streamText Multi-Step Cookbook](../next/stream-text-multistep.html)

[Markdown Chatbot with Memoization](../next/markdown-chatbot-with-memoization.html)

[Generate Object](../next/generate-object.html)

[Generate Object with File Prompt through Form Submission](../next/generate-object-with-file-prompt.html)

[Stream Object](../next/stream-object.html)

[Call Tools](../next/call-tools.html)

[Call Tools in Multiple Steps](../next/call-tools-multiple-steps.html)

[Model Context Protocol (MCP) Tools](../next/mcp-tools.html)

[Share useChat State Across Components](../next/use-shared-chat-context.html)

[Human-in-the-Loop Agent with Next.js](../next/human-in-the-loop.html)

[Send Custom Body from useChat](../next/send-custom-body-from-use-chat.html)

[Render Visual Interface in Chat](../next/render-visual-interface-in-chat.html)

[Caching Middleware](../next/caching-middleware.html)

[Node](generate-text.html)

[Generate Text](generate-text.html)

[Generate Text with Chat Prompt](generate-text-with-chat-prompt.html)

[Generate Text with Image Prompt](generate-text-with-image-prompt.html)

[Stream Text](stream-text.html)

[Stream Text with Chat Prompt](stream-text-with-chat-prompt.html)

[Stream Text with Image Prompt](stream-text-with-image-prompt.html)

[Stream Text with File Prompt](stream-text-with-file-prompt.html)

[Generate Object with a Reasoning Model](generate-object-reasoning.html)

[Generate Object](generate-object.html)

[Stream Object](stream-object.html)

[Stream Object with Image Prompt](stream-object-with-image-prompt.html)

[Record Token Usage After Streaming Object](stream-object-record-token-usage.html)

[Record Final Object after Streaming Object](stream-object-record-final-object.html)

[Call Tools](call-tools.html)

[Call Tools with Image Prompt](call-tools-with-image-prompt.html)

[Call Tools in Multiple Steps](call-tools-multiple-steps.html)

[Model Context Protocol (MCP) Tools](mcp-tools.html)

[Manual Agent Loop](manual-agent-loop.html)

[Web Search Agent](web-search-agent.html)

[Embed Text](embed-text.html)

[Embed Text in Batch](embed-text-batch.html)

[Intercepting Fetch Requests](intercept-fetch-requests.html)

[Local Caching Middleware](local-caching-middleware.html)

[Retrieval Augmented Generation](retrieval-augmented-generation.html)

[Knowledge Base Agent](knowledge-base-agent.html)

[API Servers](../api-servers/node-http-server.html)

[Node.js HTTP Server](../api-servers/node-http-server.html)

[Express](../api-servers/express.html)

[Hono](../api-servers/hono.html)

[Fastify](../api-servers/fastify.html)

[Nest.js](../api-servers/nest.html)

[React Server Components](../rsc/generate-text.html)

[Node](generate-text.html)Local Caching Middleware

# [Local Caching Middleware](#local-caching-middleware)

This example is not yet updated to v5.

When developing AI applications, you'll often find yourself repeatedly making the same API calls during development. This can lead to increased costs and slower development cycles. A caching middleware allows you to store responses locally and reuse them when the same inputs are provided.

This approach is particularly useful in two scenarios:

1.  **Iterating on UI/UX** - When you're focused on styling and user experience, you don't want to regenerate AI responses for every code change.
2.  **Working on evals** - When developing evals, you need to repeatedly test the same prompts, but don't need new generations each time.

## [Implementation](#implementation)

In this implementation, you create a JSON file to store responses. When a request is made, you first check if you have already seen this exact request. If you have, you return the cached response immediately (as a one-off generation or chunks of tokens). If not, you trigger the generation, save the response, and return it.

Make sure to add the path of your local cache to your `.gitignore` so you do not commit it.

### [How it works](#how-it-works)

For regular generations, you store and retrieve complete responses. Instead, the streaming implementation captures each token as it arrives, stores the full sequence, and on cache hits uses the SDK's `simulateReadableStream` utility to recreate the token-by-token streaming experience at a controlled speed (defaults to 10ms between chunks).

This approach gives you the best of both worlds:

-   Instant responses for repeated queries
-   Preserved streaming behavior for UI development

The middleware handles all transformations needed to make cached responses indistinguishable from fresh ones, including normalizing tool calls and fixing timestamp formats.

### [Middleware](#middleware)

```ts
import {
  type LanguageModelV1,
  type LanguageModelV2Middleware,
  LanguageModelV1Prompt,
  type LanguageModelV1StreamPart,
  simulateReadableStream,
  wrapLanguageModel,
} from 'ai';
import 'dotenv/config';
import fs from 'fs';
import path from 'path';


const CACHE_FILE = path.join(process.cwd(), '.cache/ai-cache.json');


export const cached = (model: LanguageModelV1) =>
  wrapLanguageModel({
    middleware: cacheMiddleware,
    model,
  });


const ensureCacheFile = () => {
  const cacheDir = path.dirname(CACHE_FILE);
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
  }
  if (!fs.existsSync(CACHE_FILE)) {
    fs.writeFileSync(CACHE_FILE, '{}');
  }
};


const getCachedResult = (key: string | object) => {
  ensureCacheFile();
  const cacheKey = typeof key === 'object' ? JSON.stringify(key) : key;
  try {
    const cacheContent = fs.readFileSync(CACHE_FILE, 'utf-8');


    const cache = JSON.parse(cacheContent);


    const result = cache[cacheKey];


    return result ?? null;
  } catch (error) {
    console.error('Cache error:', error);
    return null;
  }
};


const updateCache = (key: string, value: any) => {
  ensureCacheFile();
  try {
    const cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
    const updatedCache = { ...cache, [key]: value };
    fs.writeFileSync(CACHE_FILE, JSON.stringify(updatedCache, null, 2));
    console.log('Cache updated for key:', key);
  } catch (error) {
    console.error('Failed to update cache:', error);
  }
};
const cleanPrompt = (prompt: LanguageModelV1Prompt) => {
  return prompt.map(m => {
    if (m.role === 'assistant') {
      return m.content.map(part =>
        part.type === 'tool-call' ? { ...part, toolCallId: 'cached' } : part,
      );
    }
    if (m.role === 'tool') {
      return m.content.map(tc => ({
        ...tc,
        toolCallId: 'cached',
        result: {},
      }));
    }


    return m;
  });
};


export const cacheMiddleware: LanguageModelV2Middleware = {
  wrapGenerate: async ({ doGenerate, params }) => {
    const cacheKey = JSON.stringify({
      ...cleanPrompt(params.prompt),
      _function: 'generate',
    });
    console.log('Cache Key:', cacheKey);


    const cached = getCachedResult(cacheKey) as Awaited<
      ReturnType<LanguageModelV1['doGenerate']>
    > | null;


    if (cached && cached !== null) {
      console.log('Cache Hit');
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


    console.log('Cache Miss');
    const result = await doGenerate();


    updateCache(cacheKey, result);


    return result;
  },
  wrapStream: async ({ doStream, params }) => {
    const cacheKey = JSON.stringify({
      ...cleanPrompt(params.prompt),
      _function: 'stream',
    });
    console.log('Cache Key:', cacheKey);


    // Check if the result is in the cache
    const cached = getCachedResult(cacheKey);


    // If cached, return a simulated ReadableStream that yields the cached result
    if (cached && cached !== null) {
      console.log('Cache Hit');
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


    console.log('Cache Miss');
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
        updateCache(cacheKey, fullResponse);
      },
    });


    return {
      stream: stream.pipeThrough(transformStream),
      ...rest,
    };
  },
};
```

## [Using the Middleware](#using-the-middleware)

The middleware can be easily integrated into your existing AI SDK setup:

```ts
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import 'dotenv/config';
import { cached } from '../middleware/your-cache-middleware';


async function main() {
  const result = streamText({
    model: cached(openai('gpt-4o')),
    maxOutputTokens: 512,
    temperature: 0.3,
    maxRetries: 5,
    prompt: 'Invent a new holiday and describe its traditions.',
  });


  for await (const textPart of result.textStream) {
    process.stdout.write(textPart);
  }


  console.log();
  console.log('Token usage:', await result.usage);
  console.log('Finish reason:', await result.finishReason);
}


main().catch(console.error);
```

## [Considerations](#considerations)

When using this caching middleware, keep these points in mind:

1.  **Development Only** - This approach is intended for local development, not production environments
2.  **Cache Invalidation** - You'll need to clear the cache (delete the cache file) when you want fresh responses
3.  **Multi-Step Flows** - When using `maxSteps`, be aware that caching occurs at the individual language model response level, not across the entire execution flow. This means that while the model's generation is cached, the tool call is not and will run on each generation.

[Previous

Intercepting Fetch Requests

](intercept-fetch-requests.html)

[Next

API Servers

](../api-servers/node-http-server.html)

On this page

[Local Caching Middleware](#local-caching-middleware)

[Implementation](#implementation)

[How it works](#how-it-works)

[Middleware](#middleware)

[Using the Middleware](#using-the-middleware)

[Considerations](#considerations)

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