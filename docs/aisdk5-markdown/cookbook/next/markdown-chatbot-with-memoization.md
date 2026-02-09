Next.js: Markdown Chatbot with Memoization

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

[Next.js](generate-text.html)Markdown Chatbot with Memoization

# [Markdown Chatbot with Memoization](#markdown-chatbot-with-memoization)

When building a chatbot with Next.js and the AI SDK, you'll likely want to render the model's responses in Markdown format using a library like `react-markdown`. However, this can have negative performance implications as the Markdown is re-rendered on each new token received from the streaming response.

As conversations get longer and more complex, this performance impact becomes exponentially worse since the entire conversation history is re-rendered with each new token.

This recipe uses memoization - a performance optimization technique where the results of expensive function calls are cached and reused to avoid unnecessary re-computation. In this case, parsed Markdown blocks are memoized to prevent them from being re-parsed and re-rendered on each token update, which means that once a block is fully parsed, it's cached and reused rather than being regenerated. This approach significantly improves rendering performance for long conversations by eliminating redundant parsing and rendering operations.

## [Installation](#installation)

First, install the required dependencies for Markdown rendering and parsing:

```bash
npm install react-markdown marked
```

## [Server](#server)

On the server, you use a simple route handler that streams the response from the language model.

```tsx
import { openai } from '@ai-sdk/openai';
import { convertToModelMessages, streamText, type UIMessage } from 'ai';


export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();


  const result = streamText({
    system:
      'You are a helpful assistant. Respond to the user in Markdown format.',
    model: openai('gpt-4o'),
    messages: convertToModelMessages(messages),
  });


  return result.toUIMessageStreamResponse();
}
```

## [Memoized Markdown Component](#memoized-markdown-component)

Next, create a memoized markdown component that will take in raw Markdown text into blocks and only updates when the content actually changes. This component splits Markdown content into blocks using the `marked` library to identify discrete Markdown elements, then uses React's memoization features to optimize re-rendering by only updating blocks that have actually changed.

```tsx
import { marked } from 'marked';
import { memo, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';


function parseMarkdownIntoBlocks(markdown: string): string[] {
  const tokens = marked.lexer(markdown);
  return tokens.map(token => token.raw);
}


const MemoizedMarkdownBlock = memo(
  ({ content }: { content: string }) => {
    return <ReactMarkdown>{content}</ReactMarkdown>;
  },
  (prevProps, nextProps) => {
    if (prevProps.content !== nextProps.content) return false;
    return true;
  },
);


MemoizedMarkdownBlock.displayName = 'MemoizedMarkdownBlock';


export const MemoizedMarkdown = memo(
  ({ content, id }: { content: string; id: string }) => {
    const blocks = useMemo(() => parseMarkdownIntoBlocks(content), [content]);


    return blocks.map((block, index) => (
      <MemoizedMarkdownBlock content={block} key={`${id}-block_${index}`} />
    ));
  },
);


MemoizedMarkdown.displayName = 'MemoizedMarkdown';
```

## [Client](#client)

Finally, on the client, use the `useChat` hook to manage the chat state and render the chat interface. You can use the `MemoizedMarkdown` component to render the message contents in Markdown format without compromising on performance. Additionally, you can render the form in its own component so as to not trigger unnecessary re-renders of the chat messages. You can also use the `experimental_throttle` option that will throttle data updates to a specified interval, helping to manage rendering performance.

```typescript
"use client";


import { Chat, useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState } from "react";
import { MemoizedMarkdown } from "@/components/memoized-markdown";


const chat = new Chat({
  transport: new DefaultChatTransport({
    api: "/api/chat",
  }),
});


export default function Page() {
  const { messages } = useChat({ chat, experimental_throttle: 50 });


  return (
    <div className="flex flex-col w-full max-w-xl py-24 mx-auto stretch">
      <div className="space-y-8 mb-4">
        {messages.map((message) => (
          <div key={message.id}>
            <div className="font-bold mb-2">
              {message.role === "user" ? "You" : "Assistant"}
            </div>
            <div className="prose space-y-2">
              {message.parts.map((part) => {
                if (part.type === "text") {
                  return (
                    <MemoizedMarkdown
                      key={`${message.id}-text`}
                      id={message.id}
                      content={part.text}
                    />
                  );
                }
              })}
            </div>
          </div>
        ))}
      </div>


      <MessageInput />
    </div>
  );
}


const MessageInput = () => {
  const [input, setInput] = useState("");
  const { sendMessage } = useChat({ chat });


  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        sendMessage({
          text: input,
        });
        setInput("");
      }}
    >
      <input
        className="fixed bottom-0 w-full max-w-xl p-2 mb-8 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded shadow-xl"
        placeholder="Say something..."
        value={input}
        onChange={(event) => {
          setInput(event.target.value);
        }}
      />
    </form>
  );
};
```

The chat state is shared between both components by using the same `Chat` instance. This allows you to split the form and chat messages into separate components while maintaining synchronized state.

[Previous

streamText Multi-Step Cookbook

](stream-text-multistep.html)

[Next

Generate Object

](generate-object.html)

On this page

[Markdown Chatbot with Memoization](#markdown-chatbot-with-memoization)

[Installation](#installation)

[Server](#server)

[Memoized Markdown Component](#memoized-markdown-component)

[Client](#client)

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