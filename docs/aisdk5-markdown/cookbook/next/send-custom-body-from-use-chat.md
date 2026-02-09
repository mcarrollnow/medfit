Next.js: Send Custom Body from useChat

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

[Next.js](generate-text.html)Send Custom Body from useChat

# [Send Custom Body from useChat](#send-custom-body-from-usechat)

If you are looking to send custom values alongside each message, check out the [chatbot request configuration documentation](../../docs/ai-sdk-ui/chatbot.html#request-configuration).

By default, `useChat` sends all messages as well as information from the request to the server. However, it is often desirable to control the entire body content that is sent to the server, e.g. to:

-   only send the last message
-   send additional data along with the message
-   change the structure of the request body

The `prepareSendMessagesRequest` option allows you to customize the entire body content that is sent to the server. The function receives the message list, the request data, and the request body from the append call. It should return the body content that will be sent to the server.

## [Example](#example)

This example shows how to only send the text of the last message to the server. This can be useful if you want to reduce the amount of data sent to the server.

### [Client](#client)

```typescript
'use client';


import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useState } from 'react';


export default function Chat() {
  const [input, setInput] = useState('');
  const { messages, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      prepareSendMessagesRequest: ({ id, messages }) => {
        return {
          body: {
            id,
            message: messages[messages.length - 1],
          },
        };
      },
    }),
  });


  return (
    <div>
    {messages.map((message, index) => (
      <div key={index}>
        {message.role === 'user' ? 'User: ' : 'AI: '}
        {message.parts.map((part) => {
          switch (part.type) {
            case "text":
              return <div key={`${message.id}-text`}>{part.text}</div>;
          }
        })}
      </div>
    ))}


      <form onSubmit={(e) => {
        e.preventDefault();
        sendMessage({text: input});
        setInput('');
      }}>
        <input value={input} onChange={(e) => setInput(e.currentTarget.value)} />
      </form>
    </div>
  );
}
```

### [Server](#server)

We need to adjust the server to receive the custom request format with the chat ID and last message. The rest of the message history can be loaded from storage.

```tsx
import { openai } from '@ai-sdk/openai';
import { convertToModelMessages, streamText } from 'ai';


// Allow streaming responses up to 30 seconds
export const maxDuration = 30;


export async function POST(req: Request) {
  const { id, message } = await req.json();


  // Load existing messages and add the new one
  const messages = await loadMessages(id);
  messages.push(message);


  // Call the language model
  const result = streamText({
    model: openai('gpt-4.1'),
    messages: convertToModelMessages(messages),
  });


  // Respond with the stream
  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    onFinish: ({ messages: newMessages }) => {
      saveMessages(id, newMessages);
    },
  });
}
```

[Previous

Human-in-the-Loop Agent with Next.js

](human-in-the-loop.html)

[Next

Render Visual Interface in Chat

](render-visual-interface-in-chat.html)

On this page

[Send Custom Body from useChat](#send-custom-body-from-usechat)

[Example](#example)

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