Next.js: Chat with PDFs

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

[Next.js](generate-text.html)Chat with PDFs

# [Chat with PDFs](#chat-with-pdfs)

Some language models like Anthropic's Claude Sonnet 3.5 and Google's Gemini 2.0 can understand PDFs and respond to questions about their contents. In this example, we'll show you how to build a chat interface that accepts PDF uploads.

This example requires a provider that supports PDFs, such as Anthropic's Claude 3.7, Google's Gemini 2.5, or OpenAI's GPT-4.1. Check the [provider documentation](../../providers/ai-sdk-providers.html) for up-to-date support information.

## [Implementation](#implementation)

### [Server](#server)

Create a route handler that will use Anthropic's Claude model to process messages and PDFs:

```tsx
import { openai } from '@ai-sdk/openai';
import { convertToModelMessages, streamText, type UIMessage } from 'ai';


export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();


  const result = streamText({
    model: openai('gpt-4o'),
    messages: convertToModelMessages(messages),
  });


  return result.toUIMessageStreamResponse();
}
```

### [Client](#client)

Create a chat interface that allows uploading PDFs alongside messages:

```tsx
'use client';


import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useRef, useState } from 'react';


async function convertFilesToDataURLs(
  files: FileList,
): Promise<
  { type: 'file'; filename: string; mediaType: string; url: string }[]
> {
  return Promise.all(
    Array.from(files).map(
      file =>
        new Promise<{
          type: 'file';
          filename: string;
          mediaType: string;
          url: string;
        }>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            resolve({
              type: 'file',
              filename: file.name,
              mediaType: file.type,
              url: reader.result as string, // Data URL
            });
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        }),
    ),
  );
}


export default function Chat() {
  const [input, setInput] = useState('');


  const { messages, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
  });


  const [files, setFiles] = useState<FileList | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);


  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {messages.map(message => (
        <div key={message.id} className="whitespace-pre-wrap">
          {message.role === 'user' ? 'User: ' : 'AI: '}


          {message.parts.map(part => {
            if (part.type === 'text') {
              return <div key={`${message.id}-text`}>{part.text}</div>;
            }
          })}


          <div></div>
        </div>
      ))}


      <form
        className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl space-y-2"
        onSubmit={async event => {
          event.preventDefault();


          const fileParts =
            files && files.length > 0
              ? await convertFilesToDataURLs(files)
              : [];


          sendMessage({
            role: 'user',
            parts: [{ type: 'text', text: input }, ...fileParts],
          });


          setFiles(undefined);
          setInput('');


          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }}
      >
        <input
          type="file"
          onChange={event => {
            if (event.target.files) {
              setFiles(event.target.files);
            }
          }}
          multiple
          ref={fileInputRef}
        />


        <input
          className="w-full p-2"
          value={input}
          placeholder="Say something..."
          onChange={event => {
            setInput(event.target.value);
          }}
        />
      </form>
    </div>
  );
}
```

The code uses the `useChat` hook which handles the file upload and message streaming. The `experimental_attachments` option allows you to send files alongside messages.

Make sure to set up your environment variables with your Anthropic API key:

```env
ANTHROPIC_API_KEY=xxxxxxxxx
```

Now you can upload PDFs and ask questions about their contents. The LLM will analyze the PDF and provide relevant responses based on the document's content.

[Previous

Stream Text with Image Prompt

](stream-text-with-image-prompt.html)

[Next

streamText Multi-Step Cookbook

](stream-text-multistep.html)

On this page

[Chat with PDFs](#chat-with-pdfs)

[Implementation](#implementation)

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