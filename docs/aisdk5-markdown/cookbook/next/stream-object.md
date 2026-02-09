Next.js: Stream Object

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

[Next.js](generate-text.html)Stream Object

# [Stream Object](#stream-object)

Object generation can sometimes take a long time to complete, especially when you're generating a large schema. In such cases, it is useful to stream the object generation process to the client in real-time. This allows the client to display the generated object as it is being generated, rather than have users wait for it to complete before displaying the result.

http://localhost:3000

View Notifications

## [Object Mode](#object-mode)

The `streamObject` function allows you to specify different output strategies using the `output` parameter. By default, the output mode is set to `object`, which will generate exactly the structured object that you specify in the schema option.

### [Schema](#schema)

It is helpful to set up the schema in a separate file that is imported on both the client and server.

```ts
import { z } from 'zod';


// define a schema for the notifications
export const notificationSchema = z.object({
  notifications: z.array(
    z.object({
      name: z.string().describe('Name of a fictional person.'),
      message: z.string().describe('Message. Do not use emojis or links.'),
    }),
  ),
});
```

### [Client](#client)

The client uses [`useObject`](../../docs/reference/ai-sdk-ui/use-object.html) to stream the object generation process.

The results are partial and are displayed as they are received. Please note the code for handling `undefined` values in the JSX.

```tsx
'use client';


import { experimental_useObject as useObject } from '@ai-sdk/react';
import { notificationSchema } from './api/use-object/schema';


export default function Page() {
  const { object, submit } = useObject({
    api: '/api/use-object',
    schema: notificationSchema,
  });


  return (
    <div>
      <button onClick={() => submit('Messages during finals week.')}>
        Generate notifications
      </button>


      {object?.notifications?.map((notification, index) => (
        <div key={index}>
          <p>{notification?.name}</p>
          <p>{notification?.message}</p>
        </div>
      ))}
    </div>
  );
}
```

### [Server](#server)

On the server, we use [`streamObject`](../../docs/reference/ai-sdk-core/stream-object.html) to stream the object generation process.

```typescript
import { openai } from '@ai-sdk/openai';
import { streamObject } from 'ai';
import { notificationSchema } from './schema';


// Allow streaming responses up to 30 seconds
export const maxDuration = 30;


export async function POST(req: Request) {
  const context = await req.json();


  const result = streamObject({
    model: openai('gpt-4.1'),
    schema: notificationSchema,
    prompt:
      `Generate 3 notifications for a messages app in this context:` + context,
  });


  return result.toTextStreamResponse();
}
```

## [Loading State and Stopping the Stream](#loading-state-and-stopping-the-stream)

You can use the `loading` state to display a loading indicator while the object is being generated. You can also use the `stop` function to stop the object generation process.

```tsx
'use client';


import { experimental_useObject as useObject } from '@ai-sdk/react';
import { notificationSchema } from './api/use-object/schema';


export default function Page() {
  const { object, submit, isLoading, stop } = useObject({
    api: '/api/use-object',
    schema: notificationSchema,
  });


  return (
    <div>
      <button
        onClick={() => submit('Messages during finals week.')}
        disabled={isLoading}
      >
        Generate notifications
      </button>


      {isLoading && (
        <div>
          <div>Loading...</div>
          <button type="button" onClick={() => stop()}>
            Stop
          </button>
        </div>
      )}


      {object?.notifications?.map((notification, index) => (
        <div key={index}>
          <p>{notification?.name}</p>
          <p>{notification?.message}</p>
        </div>
      ))}
    </div>
  );
}
```

## [Array Mode](#array-mode)

The "array" output mode allows you to stream an array of objects one element at a time. This is particularly useful when generating lists of items.

### [Schema](#schema-1)

First, update the schema to generate a single object (remove the `z.array()`).

```ts
import { z } from 'zod';


// define a schema for a single notification
export const notificationSchema = z.object({
  name: z.string().describe('Name of a fictional person.'),
  message: z.string().describe('Message. Do not use emojis or links.'),
});
```

### [Client](#client-1)

On the client, you wrap the schema in `z.array()` to generate an array of objects.

```tsx
'use client';


import { experimental_useObject as useObject } from '@ai-sdk/react';
import { notificationSchema } from '../api/use-object/schema';
import z from 'zod';


export default function Page() {
  const { object, submit, isLoading, stop } = useObject({
    api: '/api/use-object',
    schema: z.array(notificationSchema),
  });


  return (
    <div>
      <button
        onClick={() => submit('Messages during finals week.')}
        disabled={isLoading}
      >
        Generate notifications
      </button>


      {isLoading && (
        <div>
          <div>Loading...</div>
          <button type="button" onClick={() => stop()}>
            Stop
          </button>
        </div>
      )}


      {object?.map((notification, index) => (
        <div key={index}>
          <p>{notification?.name}</p>
          <p>{notification?.message}</p>
        </div>
      ))}
    </div>
  );
}
```

### [Server](#server-1)

On the server, specify `output: 'array'` to generate an array of objects.

```typescript
import { openai } from '@ai-sdk/openai';
import { streamObject } from 'ai';
import { notificationSchema } from './schema';


export const maxDuration = 30;


export async function POST(req: Request) {
  const context = await req.json();


  const result = streamObject({
    model: openai('gpt-4.1'),
    output: 'array',
    schema: notificationSchema,
    prompt:
      `Generate 3 notifications for a messages app in this context:` + context,
  });


  return result.toTextStreamResponse();
}
```

## [No Schema Mode](#no-schema-mode)

The "no-schema" output mode can be used when you don't want to specify a schema, for example when the data structure is defined by a dynamic user request. When using this mode, omit the schema parameter and set `output: 'no-schema'`. The model will still attempt to generate JSON data based on the prompt.

### [Client](#client-2)

On the client, you wrap the schema in `z.array()` to generate an array of objects.

```tsx
'use client';


import { experimental_useObject as useObject } from '@ai-sdk/react';
import { z } from 'zod';


export default function Page() {
  const { object, submit, isLoading, stop } = useObject({
    api: '/api/use-object',
    schema: z.unknown(),
  });


  return (
    <div>
      <button
        onClick={() => submit('Messages during finals week.')}
        disabled={isLoading}
      >
        Generate notifications
      </button>


      {isLoading && (
        <div>
          <div>Loading...</div>
          <button type="button" onClick={() => stop()}>
            Stop
          </button>
        </div>
      )}


      {JSON.stringify(object, null, 2)}
    </div>
  );
}
```

### [Server](#server-2)

On the server, specify `output: 'no-schema'`.

```typescript
import { openai } from '@ai-sdk/openai';
import { streamObject } from 'ai';


export const maxDuration = 30;


export async function POST(req: Request) {
  const context = await req.json();


  const result = streamObject({
    model: openai('gpt-4o'),
    output: 'no-schema',
    prompt:
      `Generate 3 notifications (in JSON) for a messages app in this context:` +
      context,
  });


  return result.toTextStreamResponse();
}
```

[Previous

Generate Object with File Prompt through Form Submission

](generate-object-with-file-prompt.html)

[Next

Call Tools

](call-tools.html)

On this page

[Stream Object](#stream-object)

[Object Mode](#object-mode)

[Schema](#schema)

[Client](#client)

[Server](#server)

[Loading State and Stopping the Stream](#loading-state-and-stopping-the-stream)

[Array Mode](#array-mode)

[Schema](#schema-1)

[Client](#client-1)

[Server](#server-1)

[No Schema Mode](#no-schema-mode)

[Client](#client-2)

[Server](#server-2)

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