API Servers: Fastify

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

[API Servers](node-http-server.html)

[Node.js HTTP Server](node-http-server.html)

[Express](express.html)

[Hono](hono.html)

[Fastify](fastify.html)

[Nest.js](nest.html)

[React Server Components](../rsc/generate-text.html)

[API Servers](node-http-server.html)Fastify

# [Fastify](#fastify)

You can use the AI SDK in a [Fastify](https://fastify.dev/) server to generate and stream text and objects to the client.

## [Examples](#examples)

The examples start a simple HTTP server that listens on port 8080. You can e.g. test it using `curl`:

```bash
curl -X POST http://localhost:8080
```

The examples use the OpenAI `gpt-4o` model. Ensure that the OpenAI API key is set in the `OPENAI_API_KEY` environment variable.

**Full example**: [github.com/vercel/ai/examples/fastify](https://github.com/vercel/ai/tree/main/examples/fastify)

### [Data Stream](#data-stream)

You can use the `toDataStream` method to get a data stream from the result and then pipe it to the response.

```ts
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import Fastify from 'fastify';


const fastify = Fastify({ logger: true });


fastify.post('/', async function (request, reply) {
  const result = streamText({
    model: openai('gpt-4o'),
    prompt: 'Invent a new holiday and describe its traditions.',
  });


  // Mark the response as a v1 data stream:
  reply.header('X-Vercel-AI-Data-Stream', 'v1');
  reply.header('Content-Type', 'text/plain; charset=utf-8');


  return reply.send(result.toDataStream({ data }));
});


fastify.listen({ port: 8080 });
```

### [Sending Custom Data](#sending-custom-data)

`createDataStream` can be used to send custom data to the client.

```ts
import { openai } from '@ai-sdk/openai';
import { createDataStream, streamText } from 'ai';
import Fastify from 'fastify';


const fastify = Fastify({ logger: true });


fastify.post('/stream-data', async function (request, reply) {
  // immediately start streaming the response
  const dataStream = createDataStream({
    execute: async dataStreamWriter => {
      dataStreamWriter.writeData('initialized call');


      const result = streamText({
        model: openai('gpt-4o'),
        prompt: 'Invent a new holiday and describe its traditions.',
      });


      result.mergeIntoDataStream(dataStreamWriter);
    },
    onError: error => {
      // Error messages are masked by default for security reasons.
      // If you want to expose the error message to the client, you can do so here:
      return error instanceof Error ? error.message : String(error);
    },
  });


  // Mark the response as a v1 data stream:
  reply.header('X-Vercel-AI-Data-Stream', 'v1');
  reply.header('Content-Type', 'text/plain; charset=utf-8');


  return reply.send(dataStream);
});


fastify.listen({ port: 8080 });
```

### [Text Stream](#text-stream)

You can use the `textStream` property to get a text stream from the result and then pipe it to the response.

```ts
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import Fastify from 'fastify';


const fastify = Fastify({ logger: true });


fastify.post('/', async function (request, reply) {
  const result = streamText({
    model: openai('gpt-4o'),
    prompt: 'Invent a new holiday and describe its traditions.',
  });


  reply.header('Content-Type', 'text/plain; charset=utf-8');


  return reply.send(result.textStream);
});


fastify.listen({ port: 8080 });
```

## [Troubleshooting](#troubleshooting)

-   Streaming not working when [proxied](../../docs/troubleshooting/streaming-not-working-when-proxied.html)

[Previous

Hono

](hono.html)

[Next

Nest.js

](nest.html)

On this page

[Fastify](#fastify)

[Examples](#examples)

[Data Stream](#data-stream)

[Sending Custom Data](#sending-custom-data)

[Text Stream](#text-stream)

[Troubleshooting](#troubleshooting)

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