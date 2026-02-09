Next.js: Call Tools in Multiple Steps

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

[Next.js](generate-text.html)Call Tools in Multiple Steps

# [Call Tools in Multiple Steps](#call-tools-in-multiple-steps)

Some language models are great at calling tools in multiple steps to achieve a more complex task. This is particularly useful when the tools are dependent on each other and need to be executed in sequence during the same generation step.

## [Client](#client)

Let's create a React component that imports the `useChat` hook from the `@ai-sdk/react` module. The `useChat` hook will call the `/api/chat` endpoint when the user sends a message. The endpoint will generate the assistant's response based on the conversation history and stream it to the client. If the assistant responds with a tool call, the hook will automatically display them as well.

```tsx
'use client';


import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useState } from 'react';
import type { ChatMessage } from './api/chat/route';


export default function Page() {
  const [input, setInput] = useState('');


  const { messages, sendMessage } = useChat<ChatMessage>({
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
  });


  return (
    <div>
      <input
        className="border"
        value={input}
        onChange={event => {
          setInput(event.target.value);
        }}
        onKeyDown={async event => {
          if (event.key === 'Enter') {
            sendMessage({
              text: input,
            });
            setInput('');
          }
        }}
      />


      {messages.map((message, index) => (
        <div key={index}>
          {message.parts.map((part, i) => {
            switch (part.type) {
              case 'text':
                return <div key={`${message.id}-text`}>{part.text}</div>;
              case 'tool-getLocation':
              case 'tool-getWeather':
                return (
                  <div key={`${message.id}-weather-${i}`}>
                    {JSON.stringify(part, null, 2)}
                  </div>
                );
            }
          })}
        </div>
      ))}
    </div>
  );
}
```

## [Server](#server)

You will create a new route at `/api/chat` that will use the `streamText` function from the `ai` module to generate the assistant's response based on the conversation history.

You will use the [`tools`](../../docs/reference/ai-sdk-core/generate-text.html#tools) parameter to specify two tools called `getLocation` and `getWeather` that will first get the user's location and then use it to get the weather.

You will add the two functions mentioned earlier and use zod to specify the schema for its parameters.

To call tools in multiple steps, you can use the `stopWhen` option to specify the stopping conditions for when the model generates a tool call. In this example, you will set it to `stepCountIs(5)` to allow for multiple consecutive tool calls (steps).

```ts
import { openai } from '@ai-sdk/openai';
import {
  type InferUITools,
  type ToolSet,
  type UIDataTypes,
  type UIMessage,
  convertToModelMessages,
  stepCountIs,
  streamText,
  tool,
} from 'ai';
import { z } from 'zod';


const tools = {
  getLocation: tool({
    description: 'Get the location of the user',
    inputSchema: z.object({}),
    execute: async () => {
      const location = { lat: 37.7749, lon: -122.4194 };
      return `Your location is at latitude ${location.lat} and longitude ${location.lon}`;
    },
  }),
  getWeather: tool({
    description: 'Get the weather for a location',
    inputSchema: z.object({
      city: z.string().describe('The city to get the weather for'),
      unit: z
        .enum(['C', 'F'])
        .describe('The unit to display the temperature in'),
    }),
    execute: async ({ city, unit }) => {
      const weather = {
        value: 24,
        description: 'Sunny',
      };


      return `It is currently ${weather.value}°${unit} and ${weather.description} in ${city}!`;
    },
  }),
} satisfies ToolSet;


export type ChatTools = InferUITools<typeof tools>;


export type ChatMessage = UIMessage<never, UIDataTypes, ChatTools>;


export async function POST(req: Request) {
  const { messages }: { messages: ChatMessage[] } = await req.json();


  const result = streamText({
    model: openai('gpt-4o'),
    system: 'You are a helpful assistant.',
    messages: convertToModelMessages(messages),
    stopWhen: stepCountIs(5),
    tools,
  });


  return result.toUIMessageStreamResponse();
}
```

[Previous

Call Tools

](call-tools.html)

[Next

Model Context Protocol (MCP) Tools

](mcp-tools.html)

On this page

[Call Tools in Multiple Steps](#call-tools-in-multiple-steps)

[Client](#client)

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