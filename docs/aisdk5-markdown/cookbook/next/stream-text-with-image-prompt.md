Next.js: Stream Text with Image Prompt

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

[Next.js](generate-text.html)Stream Text with Image Prompt

# [Stream Text with Image Prompt](#stream-text-with-image-prompt)

Vision models such as GPT-4o can process both text and images. In this example, we will show you how to send an image URL along with the user's message to the model with `useChat`.

## [Using Image URLs](#using-image-urls)

### [Server](#server)

The server route uses `convertToModelMessages` to handle the conversion from `UIMessage`s to model messages, which automatically handles multimodal content including images.

```tsx
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';


export const maxDuration = 60;


export async function POST(req: Request) {
  const { messages } = await req.json();


  // Call the language model
  const result = streamText({
    model: openai('gpt-4.1'),
    messages: convertToModelMessages(messages),
  });


  // Respond with the stream
  return result.toUIMessageStreamResponse();
}
```

### [Client](#client)

On the client side, we use the new `useChat` hook and send multimodal messages using the `parts` array.

```typescript
'use client';


import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useState } from 'react';


// Allow streaming responses up to 30 seconds
export const maxDuration = 30;


export default function Chat() {
  const [input, setInput] = useState('');
  const [imageUrl, setImageUrl] = useState(
    'https://science.nasa.gov/wp-content/uploads/2023/09/web-first-images-release.png',
  );


  const { messages, sendMessage } = useChat();


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendMessage({
      role: 'user',
      parts: [
        // check if imageUrl is defined, if so, add it to the message
        ...(imageUrl.trim().length > 0
          ? [
              {
                type: 'file' as const,
                mediaType: 'image/png',
                url: imageUrl,
              },
            ]
          : []),
        { type: 'text' as const, text: input },
      ],
    });
    setInput('');
    setImageUrl('');
  };


  return (
    <div>
      <div>
        {messages.map(m => (
          <div key={m.id}>
            <span>{m.role === 'user' ? 'User: ' : 'AI: '}</span>
            <div>
              {m.parts.map((part, i) => {
                switch (part.type) {
                  case 'text':
                    return part.text;
                  case 'file':
                    return (
                      <img
                        key={(part.filename || 'image') + i}
                        src={part.url}
                        alt={part.filename ?? 'image'}
                      />
                    );
                  default:
                    return null;
                }
              })}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="image-url">Image URL:</label>
          <input
            id="image-url"
            value={imageUrl}
            placeholder="Enter image URL..."
            onChange={e => setImageUrl(e.currentTarget.value)}
          />
        </div>
        <div>
          <label htmlFor="image-description">Prompt:</label>
          <input
            id="image-description"
            value={input}
            placeholder="What does the image show..."
            onChange={e => setInput(e.currentTarget.value)}
          />
        </div>
        <button type="submit">Send Message</button>
      </form>
    </div>
  );
}
```

[Previous

Stream Text with Chat Prompt

](stream-text-with-chat-prompt.html)

[Next

Chat with PDFs

](chat-with-pdf.html)

On this page

[Stream Text with Image Prompt](#stream-text-with-image-prompt)

[Using Image URLs](#using-image-urls)

[Server](#server)

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