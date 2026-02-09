AI SDK UI: Chatbot Resume Streams

[](https://vercel.com/)

[

AI SDK



](../../index.html)

-   [Docs](../introduction.html)
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

[AI SDK by Vercel](../introduction.html)

[Foundations](../foundations.html)

[Overview](../foundations/overview.html)

[Providers and Models](../foundations/providers-and-models.html)

[Prompts](../foundations/prompts.html)

[Tools](../foundations/tools.html)

[Streaming](../foundations/streaming.html)

[Getting Started](../getting-started.html)

[Navigating the Library](../getting-started/navigating-the-library.html)

[Next.js App Router](../getting-started/nextjs-app-router.html)

[Next.js Pages Router](../getting-started/nextjs-pages-router.html)

[Svelte](../getting-started/svelte.html)

[Vue.js (Nuxt)](../getting-started/nuxt.html)

[Node.js](../getting-started/nodejs.html)

[Expo](../getting-started/expo.html)

[Agents](../agents.html)

[Agents](../agents/overview.html)

[Building Agents](../agents/building-agents.html)

[Workflow Patterns](../agents/workflows.html)

[Loop Control](../agents/loop-control.html)

[AI SDK Core](../ai-sdk-core.html)

[Overview](../ai-sdk-core/overview.html)

[Generating Text](../ai-sdk-core/generating-text.html)

[Generating Structured Data](../ai-sdk-core/generating-structured-data.html)

[Tool Calling](../ai-sdk-core/tools-and-tool-calling.html)

[Model Context Protocol (MCP) Tools](../ai-sdk-core/mcp-tools.html)

[Prompt Engineering](../ai-sdk-core/prompt-engineering.html)

[Settings](../ai-sdk-core/settings.html)

[Embeddings](../ai-sdk-core/embeddings.html)

[Image Generation](../ai-sdk-core/image-generation.html)

[Transcription](../ai-sdk-core/transcription.html)

[Speech](../ai-sdk-core/speech.html)

[Language Model Middleware](../ai-sdk-core/middleware.html)

[Provider & Model Management](../ai-sdk-core/provider-management.html)

[Error Handling](../ai-sdk-core/error-handling.html)

[Testing](../ai-sdk-core/testing.html)

[Telemetry](../ai-sdk-core/telemetry.html)

[AI SDK UI](../ai-sdk-ui.html)

[Overview](overview.html)

[Chatbot](chatbot.html)

[Chatbot Message Persistence](chatbot-message-persistence.html)

[Chatbot Resume Streams](chatbot-resume-streams.html)

[Chatbot Tool Usage](chatbot-tool-usage.html)

[Generative User Interfaces](generative-user-interfaces.html)

[Completion](completion.html)

[Object Generation](object-generation.html)

[Streaming Custom Data](streaming-data.html)

[Error Handling](error-handling.html)

[Transport](transport.html)

[Reading UIMessage Streams](reading-ui-message-streams.html)

[Message Metadata](message-metadata.html)

[Stream Protocols](stream-protocol.html)

[AI SDK RSC](../ai-sdk-rsc.html)

[Advanced](../advanced.html)

[Reference](../reference.html)

[AI SDK Core](../reference/ai-sdk-core.html)

[AI SDK UI](../reference/ai-sdk-ui.html)

[AI SDK RSC](../reference/ai-sdk-rsc.html)

[Stream Helpers](../reference/stream-helpers.html)

[AI SDK Errors](../reference/ai-sdk-errors.html)

[Migration Guides](../migration-guides.html)

[Troubleshooting](../troubleshooting.html)

[AI SDK UI](../ai-sdk-ui.html)Chatbot Resume Streams

# [Chatbot Resume Streams](#chatbot-resume-streams)

`useChat` supports resuming ongoing streams after page reloads. Use this feature to build applications with long-running generations.

Stream resumption is not compatible with abort functionality. Closing a tab or refreshing the page triggers an abort signal that will break the resumption mechanism. Do not use `resume: true` if you need abort functionality in your application. See [troubleshooting](../troubleshooting/abort-breaks-resumable-streams.html) for more details.

## [How stream resumption works](#how-stream-resumption-works)

Stream resumption requires persistence for messages and active streams in your application. The AI SDK provides tools to connect to storage, but you need to set up the storage yourself.

**The AI SDK provides:**

-   A `resume` option in `useChat` that automatically reconnects to active streams
-   Access to the outgoing stream through the `consumeSseStream` callback
-   Automatic HTTP requests to your resume endpoints

**You build:**

-   Storage to track which stream belongs to each chat
-   Redis to store the UIMessage stream
-   Two API endpoints: POST to create streams, GET to resume them
-   Integration with [`resumable-stream`](https://www.npmjs.com/package/resumable-stream) to manage Redis storage

## [Prerequisites](#prerequisites)

To implement resumable streams in your chat application, you need:

1.  **The `resumable-stream` package** - Handles the publisher/subscriber mechanism for streams
2.  **A Redis instance** - Stores stream data (e.g. [Redis through Vercel](https://vercel.com/marketplace/redis))
3.  **A persistence layer** - Tracks which stream ID is active for each chat (e.g. database)

## [Implementation](#implementation)

### [1\. Client-side: Enable stream resumption](#1-client-side-enable-stream-resumption)

Use the `resume` option in the `useChat` hook to enable stream resumption. When `resume` is true, the hook automatically attempts to reconnect to any active stream for the chat on mount:

```tsx
'use client';


import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, type UIMessage } from 'ai';


export function Chat({
  chatData,
  resume = false,
}: {
  chatData: { id: string; messages: UIMessage[] };
  resume?: boolean;
}) {
  const { messages, sendMessage, status } = useChat({
    id: chatData.id,
    messages: chatData.messages,
    resume, // Enable automatic stream resumption
    transport: new DefaultChatTransport({
      // You must send the id of the chat
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


  return <div>{/* Your chat UI */}</div>;
}
```

You must send the chat ID with each request (see `prepareSendMessagesRequest`).

When you enable `resume`, the `useChat` hook makes a `GET` request to `/api/chat/[id]/stream` on mount to check for and resume any active streams.

Let's start by creating the POST handler to create the resumable stream.

### [2\. Create the POST handler](#2-create-the-post-handler)

The POST handler creates resumable streams using the `consumeSseStream` callback:

```ts
import { openai } from '@ai-sdk/openai';
import { readChat, saveChat } from '@util/chat-store';
import {
  convertToModelMessages,
  generateId,
  streamText,
  type UIMessage,
} from 'ai';
import { after } from 'next/server';
import { createResumableStreamContext } from 'resumable-stream';


export async function POST(req: Request) {
  const {
    message,
    id,
  }: {
    message: UIMessage | undefined;
    id: string;
  } = await req.json();


  const chat = await readChat(id);
  let messages = chat.messages;


  messages = [...messages, message!];


  // Clear any previous active stream and save the user message
  saveChat({ id, messages, activeStreamId: null });


  const result = streamText({
    model: openai('gpt-4o-mini'),
    messages: convertToModelMessages(messages),
  });


  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    generateMessageId: generateId,
    onFinish: ({ messages }) => {
      // Clear the active stream when finished
      saveChat({ id, messages, activeStreamId: null });
    },
    async consumeSseStream({ stream }) {
      const streamId = generateId();


      // Create a resumable stream from the SSE stream
      const streamContext = createResumableStreamContext({ waitUntil: after });
      await streamContext.createNewResumableStream(streamId, () => stream);


      // Update the chat with the active stream ID
      saveChat({ id, activeStreamId: streamId });
    },
  });
}
```

### [3\. Implement the GET handler](#3-implement-the-get-handler)

Create a GET handler at `/api/chat/[id]/stream` that:

1.  Reads the chat ID from the route params
2.  Loads the chat data to check for an active stream
3.  Returns 204 (No Content) if no stream is active
4.  Resumes the existing stream if one is found

```ts
import { readChat } from '@util/chat-store';
import { UI_MESSAGE_STREAM_HEADERS } from 'ai';
import { after } from 'next/server';
import { createResumableStreamContext } from 'resumable-stream';


export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;


  const chat = await readChat(id);


  if (chat.activeStreamId == null) {
    // no content response when there is no active stream
    return new Response(null, { status: 204 });
  }


  const streamContext = createResumableStreamContext({
    waitUntil: after,
  });


  return new Response(
    await streamContext.resumeExistingStream(chat.activeStreamId),
    { headers: UI_MESSAGE_STREAM_HEADERS },
  );
}
```

The `after` function from Next.js allows work to continue after the response has been sent. This ensures that the resumable stream persists in Redis even after the initial response is returned to the client, enabling reconnection later.

## [How it works](#how-it-works)

### [Request lifecycle](#request-lifecycle)

![Diagram showing the architecture and lifecycle of resumable stream requests](../../../e742qlubrjnjqpp0.public.blob.vercel-storage.com/resume-stream-diagram.png)

The diagram above shows the complete lifecycle of a resumable stream:

1.  **Stream creation**: When you send a new message, the POST handler uses `streamText` to generate the response. The `consumeSseStream` callback creates a resumable stream with a unique ID and stores it in Redis through the `resumable-stream` package
2.  **Stream tracking**: Your persistence layer saves the `activeStreamId` in the chat data
3.  **Client reconnection**: When the client reconnects (page reload), the `resume` option triggers a GET request to `/api/chat/[id]/stream`
4.  **Stream recovery**: The GET handler checks for an `activeStreamId` and uses `resumeExistingStream` to reconnect. If no active stream exists, it returns a 204 (No Content) response
5.  **Completion cleanup**: When the stream finishes, the `onFinish` callback clears the `activeStreamId` by setting it to `null`

## [Customize the resume endpoint](#customize-the-resume-endpoint)

By default, the `useChat` hook makes a GET request to `/api/chat/[id]/stream` when resuming. Customize this endpoint, credentials, and headers, using the `prepareReconnectToStreamRequest` option in `DefaultChatTransport`:

```tsx
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';


export function Chat({ chatData, resume }) {
  const { messages, sendMessage } = useChat({
    id: chatData.id,
    messages: chatData.messages,
    resume,
    transport: new DefaultChatTransport({
      // Customize reconnect settings (optional)
      prepareReconnectToStreamRequest: ({ id }) => {
        return {
          api: `/api/chat/${id}/stream`, // Default pattern
          // Or use a different pattern:
          // api: `/api/streams/${id}/resume`,
          // api: `/api/resume-chat?id=${id}`,
          credentials: 'include', // Include cookies/auth
          headers: {
            Authorization: 'Bearer token',
            'X-Custom-Header': 'value',
          },
        };
      },
    }),
  });


  return <div>{/* Your chat UI */}</div>;
}
```

This lets you:

-   Match your existing API route structure
-   Add query parameters or custom paths
-   Integrate with different backend architectures

## [Important considerations](#important-considerations)

-   **Incompatibility with abort**: Stream resumption is not compatible with abort functionality. Closing a tab or refreshing the page triggers an abort signal that will break the resumption mechanism. Do not use `resume: true` if you need abort functionality in your application
-   **Stream expiration**: Streams in Redis expire after a set time (configurable in the `resumable-stream` package)
-   **Multiple clients**: Multiple clients can connect to the same stream simultaneously
-   **Error handling**: When no active stream exists, the GET handler returns a 204 (No Content) status code
-   **Security**: Ensure proper authentication and authorization for both creating and resuming streams
-   **Race conditions**: Clear the `activeStreamId` when starting a new stream to prevent resuming outdated streams

  
[

View Example on GitHub

](https://github.com/vercel/ai/blob/main/examples/next)

[Previous

Chatbot Message Persistence

](chatbot-message-persistence.html)

[Next

Chatbot Tool Usage

](chatbot-tool-usage.html)

On this page

[Chatbot Resume Streams](#chatbot-resume-streams)

[How stream resumption works](#how-stream-resumption-works)

[Prerequisites](#prerequisites)

[Implementation](#implementation)

[1\. Client-side: Enable stream resumption](#1-client-side-enable-stream-resumption)

[2\. Create the POST handler](#2-create-the-post-handler)

[3\. Implement the GET handler](#3-implement-the-get-handler)

[How it works](#how-it-works)

[Request lifecycle](#request-lifecycle)

[Customize the resume endpoint](#customize-the-resume-endpoint)

[Important considerations](#important-considerations)

Deploy and Scale AI Apps with Vercel.

Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:

-   OpenAI
-   Photoroom
-   ![leonardo-ai Logo](../../_next/logo-leonardo-ai-light.svg)![leonardo-ai Logo](../../_next/logo-leonardo-ai-dark.svg)
-   ![zapier Logo](../../_next/logo-zapier-light.svg)![zapier Logo](../../_next/logo-zapier-dark.svg)

[](https://vercel.com/contact/sales?utm_source=ai_sdk&utm_medium=web&utm_campaign=contact_sales_cta&utm_content=talk_to_an_expert_sdk_docs)

#### Resources

[Docs](../introduction.html)[Cookbook](../../cookbook.html)[Providers](../../providers/ai-sdk-providers.html)[Showcase](../../showcase.html)[GitHub](https://github.com/vercel/ai)[Discussions](https://github.com/vercel/ai/discussions)

#### More

[Playground](../../playground.html)[](https://v0.dev)[Contact Sales](https://vercel.com/contact/sales)

#### About Vercel

[Next.js + Vercel](https://vercel.com/frameworks/nextjs)[Open Source Software](https://vercel.com/oss)[GitHub](https://github.com/vercel)[X](https://x.com/vercel)

#### Legal

[Privacy Policy](https://vercel.com/legal/privacy-policy)

© 2025 Vercel, Inc.