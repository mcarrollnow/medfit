Guides: Multi-Modal Agent

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

[RAG Agent](rag-chatbot.html)

[Multi-Modal Agent](multi-modal-chatbot.html)

[Slackbot Agent Guide](slackbot.html)

[Natural Language Postgres](natural-language-postgres.html)

[Get started with Computer Use](computer-use.html)

[Get started with Gemini 2.5](gemini-2-5.html)

[Get started with Claude 4](claude-4.html)

[OpenAI Responses API](openai-responses.html)

[Google Gemini Image Generation](google-gemini-image-generation.html)

[Get started with Claude 3.7 Sonnet](sonnet-3-7.html)

[Get started with Llama 3.1](llama-3_1.html)

[Get started with GPT-5](gpt-5.html)

[Get started with OpenAI o1](o1.html)

[Get started with OpenAI o3-mini](o3.html)

[Get started with DeepSeek R1](r1.html)

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

[API Servers](../api-servers/node-http-server.html)

[Node.js HTTP Server](../api-servers/node-http-server.html)

[Express](../api-servers/express.html)

[Hono](../api-servers/hono.html)

[Fastify](../api-servers/fastify.html)

[Nest.js](../api-servers/nest.html)

[React Server Components](../rsc/generate-text.html)

[Guides](../guides.html)Multi-Modal Agent

# [Multi-Modal Agent](#multi-modal-agent)

In this guide, you will build a multi-modal agent capable of understanding both images and PDFs.

Multi-modal refers to the ability of the agent to understand and generate responses in multiple formats. In this guide, we'll focus on images and PDFs - two common document types that modern language models can process natively.

For a complete list of providers and their multi-modal capabilities, visit the [providers documentation](../../providers/ai-sdk-providers.html).

We'll build this agent using OpenAI's GPT-4o, but the same code works seamlessly with other providers - you can switch between them by changing just one line of code.

## [Prerequisites](#prerequisites)

To follow this quickstart, you'll need:

-   Node.js 18+ and pnpm installed on your local development machine.
-   An OpenAI API key.

If you haven't obtained your OpenAI API key, you can do so by [signing up](https://platform.openai.com/signup/) on the OpenAI website.

## [Create Your Application](#create-your-application)

Start by creating a new Next.js application. This command will create a new directory named `multi-modal-agent` and set up a basic Next.js application inside it.

Be sure to select yes when prompted to use the App Router. If you are looking for the Next.js Pages Router quickstart guide, you can find it [here](../../docs/getting-started/nextjs-pages-router.html).

pnpm create next-app@latest multi-modal-agent

Navigate to the newly created directory:

cd multi-modal-agent

### [Install dependencies](#install-dependencies)

Install `ai` and `@ai-sdk/openai`, the AI SDK package and the AI SDK's [OpenAI provider](../../providers/ai-sdk-providers/openai.html) respectively.

The AI SDK is designed to be a unified interface to interact with any large language model. This means that you can change model and providers with just one line of code! Learn more about [available providers](../../providers/ai-sdk-providers.html) and [building custom providers](../../providers/community-providers/custom-providers.html) in the [providers](../../providers/ai-sdk-providers.html) section.

pnpm

npm

yarn

bun

pnpm add ai @ai-sdk/react @ai-sdk/openai

### [Configure OpenAI API key](#configure-openai-api-key)

Create a `.env.local` file in your project root and add your OpenAI API Key. This key is used to authenticate your application with the OpenAI service.

touch .env.local

Edit the `.env.local` file:

```env
OPENAI_API_KEY=xxxxxxxxx
```

Replace `xxxxxxxxx` with your actual OpenAI API key.

The AI SDK's OpenAI Provider will default to using the `OPENAI_API_KEY` environment variable.

## [Implementation Plan](#implementation-plan)

To build a multi-modal agent, you will need to:

-   Create a Route Handler to handle incoming chat messages and generate responses.
-   Wire up the UI to display chat messages, provide a user input, and handle submitting new messages.
-   Add the ability to upload images and PDFs and attach them alongside the chat messages.

## [Create a Route Handler](#create-a-route-handler)

Create a route handler, `app/api/chat/route.ts` and add the following code:

```tsx
import { openai } from '@ai-sdk/openai';
import { streamText, convertToModelMessages, type UIMessage } from 'ai';


// Allow streaming responses up to 30 seconds
export const maxDuration = 30;


export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();


  const result = streamText({
    model: openai('gpt-4o'),
    messages: convertToModelMessages(messages),
  });


  return result.toUIMessageStreamResponse();
}
```

Let's take a look at what is happening in this code:

1.  Define an asynchronous `POST` request handler and extract `messages` from the body of the request. The `messages` variable contains a history of the conversation between you and the agent and provides the agent with the necessary context to make the next generation.
2.  Convert the UI messages to model messages using `convertToModelMessages`, which transforms the UI-focused message format to the format expected by the language model.
3.  Call [`streamText`](../../docs/reference/ai-sdk-core/stream-text.html), which is imported from the `ai` package. This function accepts a configuration object that contains a `model` provider (imported from `@ai-sdk/openai`) and `messages` (converted in step 2). You can pass additional [settings](../../docs/ai-sdk-core/settings.html) to further customise the model's behaviour.
4.  The `streamText` function returns a [`StreamTextResult`](../../docs/reference/ai-sdk-core/stream-text.html#result-object). This result object contains the [`toUIMessageStreamResponse`](../../docs/reference/ai-sdk-core/stream-text.html#to-ui-message-stream-response) function which converts the result to a streamed response object.
5.  Finally, return the result to the client to stream the response.

This Route Handler creates a POST request endpoint at `/api/chat`.

## [Wire up the UI](#wire-up-the-ui)

Now that you have a Route Handler that can query a large language model (LLM), it's time to setup your frontend. [AI SDK UI](../../docs/ai-sdk-ui.html) abstracts the complexity of a chat interface into one hook, [`useChat`](../../docs/reference/ai-sdk-ui/use-chat.html).

Update your root page (`app/page.tsx`) with the following code to show a list of chat messages and provide a user message input:

```tsx
'use client';


import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useState } from 'react';


export default function Chat() {
  const [input, setInput] = useState('');


  const { messages, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
  });


  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {messages.map(m => (
        <div key={m.id} className="whitespace-pre-wrap">
          {m.role === 'user' ? 'User: ' : 'AI: '}
          {m.parts.map((part, index) => {
            if (part.type === 'text') {
              return <span key={`${m.id}-text-${index}`}>{part.text}</span>;
            }
            return null;
          })}
        </div>
      ))}


      <form
        onSubmit={async event => {
          event.preventDefault();
          sendMessage({
            role: 'user',
            parts: [{ type: 'text', text: input }],
          });
          setInput('');
        }}
        className="fixed bottom-0 w-full max-w-md mb-8 border border-gray-300 rounded shadow-xl"
      >
        <input
          className="w-full p-2"
          value={input}
          placeholder="Say something..."
          onChange={e => setInput(e.target.value)}
        />
      </form>
    </div>
  );
}
```

Make sure you add the `"use client"` directive to the top of your file. This allows you to add interactivity with Javascript.

This page utilizes the `useChat` hook, configured with `DefaultChatTransport` to specify the API endpoint. The `useChat` hook provides multiple utility functions and state variables:

-   `messages` - the current chat messages (an array of objects with `id`, `role`, and `parts` properties).
-   `sendMessage` - function to send a new message to the AI.
-   Each message contains a `parts` array that can include text, images, PDFs, and other content types.
-   Files are converted to data URLs before being sent to maintain compatibility across different environments.

## [Add File Upload](#add-file-upload)

To make your agent multi-modal, let's add the ability to upload and send both images and PDFs to the model. In v5, files are sent as part of the message's `parts` array. Files are converted to data URLs using the FileReader API before being sent to the server.

Update your root page (`app/page.tsx`) with the following code:

```tsx
'use client';


import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useRef, useState } from 'react';
import Image from 'next/image';


async function convertFilesToDataURLs(files: FileList) {
  return Promise.all(
    Array.from(files).map(
      file =>
        new Promise<{
          type: 'file';
          mediaType: string;
          url: string;
        }>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            resolve({
              type: 'file',
              mediaType: file.type,
              url: reader.result as string,
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
  const [files, setFiles] = useState<FileList | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);


  const { messages, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
  });


  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {messages.map(m => (
        <div key={m.id} className="whitespace-pre-wrap">
          {m.role === 'user' ? 'User: ' : 'AI: '}
          {m.parts.map((part, index) => {
            if (part.type === 'text') {
              return <span key={`${m.id}-text-${index}`}>{part.text}</span>;
            }
            if (part.type === 'file' && part.mediaType?.startsWith('image/')) {
              return (
                <Image
                  key={`${m.id}-image-${index}`}
                  src={part.url}
                  width={500}
                  height={500}
                  alt={`attachment-${index}`}
                />
              );
            }
            if (part.type === 'file' && part.mediaType === 'application/pdf') {
              return (
                <iframe
                  key={`${m.id}-pdf-${index}`}
                  src={part.url}
                  width={500}
                  height={600}
                  title={`pdf-${index}`}
                />
              );
            }
            return null;
          })}
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


          setInput('');
          setFiles(undefined);


          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }}
      >
        <input
          type="file"
          accept="image/*,application/pdf"
          className=""
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
          onChange={e => setInput(e.target.value)}
        />
      </form>
    </div>
  );
}
```

In this code, you:

1.  Add a helper function `convertFilesToDataURLs` to convert file uploads to data URLs.
2.  Create state to hold the input text, files, and a ref to the file input field.
3.  Configure `useChat` with `DefaultChatTransport` to specify the API endpoint.
4.  Display messages using the `parts` array structure, rendering text, images, and PDFs appropriately.
5.  Update the `onSubmit` function to send messages with the `sendMessage` function, including both text and file parts.
6.  Add a file input field to the form, including an `onChange` handler to handle updating the files state.

## [Running Your Application](#running-your-application)

With that, you have built everything you need for your multi-modal agent! To start your application, use the command:

pnpm run dev

Head to your browser and open [http://localhost:3000](http://localhost:3000). You should see an input field and a button to upload files.

Try uploading an image or PDF and asking the model questions about it. Watch as the model's response is streamed back to you!

## [Using Other Providers](#using-other-providers)

With the AI SDK's unified provider interface you can easily switch to other providers that support multi-modal capabilities:

```tsx
// Using Anthropic
import { anthropic } from '@ai-sdk/anthropic';
const result = streamText({
  model: anthropic('claude-sonnet-4-20250514'),
  messages: convertToModelMessages(messages),
});


// Using Google
import { google } from '@ai-sdk/google';
const result = streamText({
  model: google('gemini-2.5-flash'),
  messages: convertToModelMessages(messages),
});
```

Install the provider package (`@ai-sdk/anthropic` or `@ai-sdk/google`) and update your API keys in `.env.local`. The rest of your code remains the same.

Different providers may have varying file size limits and performance characteristics. Check the [provider documentation](../../providers/ai-sdk-providers.html) for specific details.

## [Where to Next?](#where-to-next)

You've built a multi-modal AI agent using the AI SDK! Experiment and extend the functionality of this application further by exploring [tool calling](../../docs/ai-sdk-core/tools-and-tool-calling.html).

[Previous

RAG Agent

](rag-chatbot.html)

[Next

Slackbot Agent Guide

](slackbot.html)

On this page

[Multi-Modal Agent](#multi-modal-agent)

[Prerequisites](#prerequisites)

[Create Your Application](#create-your-application)

[Install dependencies](#install-dependencies)

[Configure OpenAI API key](#configure-openai-api-key)

[Implementation Plan](#implementation-plan)

[Create a Route Handler](#create-a-route-handler)

[Wire up the UI](#wire-up-the-ui)

[Add File Upload](#add-file-upload)

[Running Your Application](#running-your-application)

[Using Other Providers](#using-other-providers)

[Where to Next?](#where-to-next)

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