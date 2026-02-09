AI SDK UI: Chatbot Message Persistence

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

[AI SDK UI](../ai-sdk-ui.html)Chatbot Message Persistence

# [Chatbot Message Persistence](#chatbot-message-persistence)

Being able to store and load chat messages is crucial for most AI chatbots. In this guide, we'll show how to implement message persistence with `useChat` and `streamText`.

This guide does not cover authorization, error handling, or other real-world considerations. It is intended to be a simple example of how to implement message persistence.

## [Starting a new chat](#starting-a-new-chat)

When the user navigates to the chat page without providing a chat ID, we need to create a new chat and redirect to the chat page with the new chat ID.

```tsx
import { redirect } from 'next/navigation';
import { createChat } from '@util/chat-store';


export default async function Page() {
  const id = await createChat(); // create a new chat
  redirect(`/chat/${id}`); // redirect to chat page, see below
}
```

Our example chat store implementation uses files to store the chat messages. In a real-world application, you would use a database or a cloud storage service, and get the chat ID from the database. That being said, the function interfaces are designed to be easily replaced with other implementations.

```tsx
import { generateId } from 'ai';
import { existsSync, mkdirSync } from 'fs';
import { writeFile } from 'fs/promises';
import path from 'path';


export async function createChat(): Promise<string> {
  const id = generateId(); // generate a unique chat ID
  await writeFile(getChatFile(id), '[]'); // create an empty chat file
  return id;
}


function getChatFile(id: string): string {
  const chatDir = path.join(process.cwd(), '.chats');
  if (!existsSync(chatDir)) mkdirSync(chatDir, { recursive: true });
  return path.join(chatDir, `${id}.json`);
}
```

## [Loading an existing chat](#loading-an-existing-chat)

When the user navigates to the chat page with a chat ID, we need to load the chat messages from storage.

The `loadChat` function in our file-based chat store is implemented as follows:

```tsx
import { UIMessage } from 'ai';
import { readFile } from 'fs/promises';


export async function loadChat(id: string): Promise<UIMessage[]> {
  return JSON.parse(await readFile(getChatFile(id), 'utf8'));
}


// ... rest of the file
```

## [Validating messages on the server](#validating-messages-on-the-server)

When processing messages on the server that contain tool calls, custom metadata, or data parts, you should validate them using `validateUIMessages` before sending them to the model.

### [Validation with tools](#validation-with-tools)

When your messages include tool calls, validate them against your tool definitions:

```tsx
import {
  convertToModelMessages,
  streamText,
  UIMessage,
  validateUIMessages,
  tool,
} from 'ai';
import { z } from 'zod';
import { loadChat, saveChat } from '@util/chat-store';
import { openai } from '@ai-sdk/openai';
import { dataPartsSchema, metadataSchema } from '@util/schemas';


// Define your tools
const tools = {
  weather: tool({
    description: 'Get weather information',
    parameters: z.object({
      location: z.string(),
      units: z.enum(['celsius', 'fahrenheit']),
    }),
    execute: async ({ location, units }) => {
      /* tool implementation */
    },
  }),
  // other tools
};


export async function POST(req: Request) {
  const { message, id } = await req.json();


  // Load previous messages from database
  const previousMessages = await loadChat(id);


  // Append new message to previousMessages messages
  const messages = [...previousMessages, message];


  // Validate loaded messages against
  // tools, data parts schema, and metadata schema
  const validatedMessages = await validateUIMessages({
    messages,
    tools, // Ensures tool calls in messages match current schemas
    dataPartsSchema,
    metadataSchema,
  });


  const result = streamText({
    model: openai('gpt-4o-mini'),
    messages: convertToModelMessages(validatedMessages),
    tools,
  });


  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    onFinish: ({ messages }) => {
      saveChat({ chatId: id, messages });
    },
  });
}
```

### [Handling validation errors](#handling-validation-errors)

Handle validation errors gracefully when messages from the database don't match current schemas:

```tsx
import {
  convertToModelMessages,
  streamText,
  validateUIMessages,
  TypeValidationError,
} from 'ai';
import { type MyUIMessage } from '@/types';


export async function POST(req: Request) {
  const { message, id } = await req.json();


  // Load and validate messages from database
  let validatedMessages: MyUIMessage[];


  try {
    const previousMessages = await loadMessagesFromDB(id);
    validatedMessages = await validateUIMessages({
      // append the new message to the previous messages:
      messages: [...previousMessages, message],
      tools,
      metadataSchema,
    });
  } catch (error) {
    if (error instanceof TypeValidationError) {
      // Log validation error for monitoring
      console.error('Database messages validation failed:', error);
      // Could implement message migration or filtering here
      // For now, start with empty history
      validatedMessages = [];
    } else {
      throw error;
    }
  }


  // Continue with validated messages...
}
```

## [Displaying the chat](#displaying-the-chat)

Once messages are loaded from storage, you can display them in your chat UI. Here's how to set up the page component and the chat display:

```tsx
import { loadChat } from '@util/chat-store';
import Chat from '@ui/chat';


export default async function Page(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const messages = await loadChat(id);
  return <Chat id={id} initialMessages={messages} />;
}
```

The chat component uses the `useChat` hook to manage the conversation:

```tsx
'use client';


import { UIMessage, useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useState } from 'react';


export default function Chat({
  id,
  initialMessages,
}: { id?: string | undefined; initialMessages?: UIMessage[] } = {}) {
  const [input, setInput] = useState('');
  const { sendMessage, messages } = useChat({
    id, // use the provided chat ID
    messages: initialMessages, // load initial messages
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
  });


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage({ text: input });
      setInput('');
    }
  };


  // simplified rendering code, extend as needed:
  return (
    <div>
      {messages.map(m => (
        <div key={m.id}>
          {m.role === 'user' ? 'User: ' : 'AI: '}
          {m.parts
            .map(part => (part.type === 'text' ? part.text : ''))
            .join('')}
        </div>
      ))}


      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
```

## [Storing messages](#storing-messages)

`useChat` sends the chat id and the messages to the backend.

The `useChat` message format is different from the `ModelMessage` format. The `useChat` message format is designed for frontend display, and contains additional fields such as `id` and `createdAt`. We recommend storing the messages in the `useChat` message format.

When loading messages from storage that contain tools, metadata, or custom data parts, validate them using `validateUIMessages` before processing (see the [validation section](#validating-messages-from-database) above).

Storing messages is done in the `onFinish` callback of the `toUIMessageStreamResponse` function. `onFinish` receives the complete messages including the new AI response as `UIMessage[]`.

```tsx
import { openai } from '@ai-sdk/openai';
import { saveChat } from '@util/chat-store';
import { convertToModelMessages, streamText, UIMessage } from 'ai';


export async function POST(req: Request) {
  const { messages, chatId }: { messages: UIMessage[]; chatId: string } =
    await req.json();


  const result = streamText({
    model: openai('gpt-4o-mini'),
    messages: convertToModelMessages(messages),
  });


  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    onFinish: ({ messages }) => {
      saveChat({ chatId, messages });
    },
  });
}
```

The actual storage of the messages is done in the `saveChat` function, which in our file-based chat store is implemented as follows:

```tsx
import { UIMessage } from 'ai';
import { writeFile } from 'fs/promises';


export async function saveChat({
  chatId,
  messages,
}: {
  chatId: string;
  messages: UIMessage[];
}): Promise<void> {
  const content = JSON.stringify(messages, null, 2);
  await writeFile(getChatFile(chatId), content);
}


// ... rest of the file
```

## [Message IDs](#message-ids)

In addition to a chat ID, each message has an ID. You can use this message ID to e.g. manipulate individual messages.

### [Client-side vs Server-side ID Generation](#client-side-vs-server-side-id-generation)

By default, message IDs are generated client-side:

-   User message IDs are generated by the `useChat` hook on the client
-   AI response message IDs are generated by `streamText` on the server

For applications without persistence, client-side ID generation works perfectly. However, **for persistence, you need server-side generated IDs** to ensure consistency across sessions and prevent ID conflicts when messages are stored and retrieved.

### [Setting Up Server-side ID Generation](#setting-up-server-side-id-generation)

When implementing persistence, you have two options for generating server-side IDs:

1.  **Using `generateMessageId` in `toUIMessageStreamResponse`**
2.  **Setting IDs in your start message part with `createUIMessageStream`**

#### [Option 1: Using `generateMessageId` in `toUIMessageStreamResponse`](#option-1-using-generatemessageid-in-touimessagestreamresponse)

You can control the ID format by providing ID generators using [`createIdGenerator()`](../reference/ai-sdk-core/create-id-generator.html):

```tsx
import { createIdGenerator, streamText } from 'ai';


export async function POST(req: Request) {
  // ...
  const result = streamText({
    // ...
  });


  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    // Generate consistent server-side IDs for persistence:
    generateMessageId: createIdGenerator({
      prefix: 'msg',
      size: 16,
    }),
    onFinish: ({ messages }) => {
      saveChat({ chatId, messages });
    },
  });
}
```

#### [Option 2: Setting IDs with `createUIMessageStream`](#option-2-setting-ids-with-createuimessagestream)

Alternatively, you can use `createUIMessageStream` to control the message ID by writing a start message part:

```tsx
import {
  generateId,
  streamText,
  createUIMessageStream,
  createUIMessageStreamResponse,
} from 'ai';


export async function POST(req: Request) {
  const { messages, chatId } = await req.json();


  const stream = createUIMessageStream({
    execute: ({ writer }) => {
      // Write start message part with custom ID
      writer.write({
        type: 'start',
        messageId: generateId(), // Generate server-side ID for persistence
      });


      const result = streamText({
        model: openai('gpt-4o-mini'),
        messages: convertToModelMessages(messages),
      });


      writer.merge(result.toUIMessageStream({ sendStart: false })); // omit start message part
    },
    originalMessages: messages,
    onFinish: ({ responseMessage }) => {
      // save your chat here
    },
  });


  return createUIMessageStreamResponse({ stream });
}
```

For client-side applications that don't require persistence, you can still customize client-side ID generation:

```tsx
import { createIdGenerator } from 'ai';
import { useChat } from '@ai-sdk/react';


const { ... } = useChat({
  generateId: createIdGenerator({
    prefix: 'msgc',
    size: 16,
  }),
  // ...
});
```

## [Sending only the last message](#sending-only-the-last-message)

Once you have implemented message persistence, you might want to send only the last message to the server. This reduces the amount of data sent to the server on each request and can improve performance.

To achieve this, you can provide a `prepareSendMessagesRequest` function to the transport. This function receives the messages and the chat ID, and returns the request body to be sent to the server.

```tsx
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';


const {
  // ...
} = useChat({
  // ...
  transport: new DefaultChatTransport({
    api: '/api/chat',
    // only send the last message to the server:
    prepareSendMessagesRequest({ messages, id }) {
      return { body: { message: messages[messages.length - 1], id } };
    },
  }),
});
```

On the server, you can then load the previous messages and append the new message to the previous messages. If your messages contain tools, metadata, or custom data parts, you should validate them:

```tsx
import { convertToModelMessages, UIMessage, validateUIMessages } from 'ai';
// import your tools and schemas


export async function POST(req: Request) {
  // get the last message from the client:
  const { message, id } = await req.json();


  // load the previous messages from the server:
  const previousMessages = await loadChat(id);


  // validate messages if they contain tools, metadata, or data parts:
  const validatedMessages = await validateUIMessages({
    // append the new message to the previous messages:
    messages: [...previousMessages, message],
    tools, // if using tools
    metadataSchema, // if using custom metadata
    dataSchemas, // if using custom data parts
  });


  const result = streamText({
    // ...
    messages: convertToModelMessages(validatedMessages),
  });


  return result.toUIMessageStreamResponse({
    originalMessages: validatedMessages,
    onFinish: ({ messages }) => {
      saveChat({ chatId: id, messages });
    },
  });
}
```

## [Handling client disconnects](#handling-client-disconnects)

By default, the AI SDK `streamText` function uses backpressure to the language model provider to prevent the consumption of tokens that are not yet requested.

However, this means that when the client disconnects, e.g. by closing the browser tab or because of a network issue, the stream from the LLM will be aborted and the conversation may end up in a broken state.

Assuming that you have a [storage solution](#storing-messages) in place, you can use the `consumeStream` method to consume the stream on the backend, and then save the result as usual. `consumeStream` effectively removes the backpressure, meaning that the result is stored even when the client has already disconnected.

```tsx
import { convertToModelMessages, streamText, UIMessage } from 'ai';
import { saveChat } from '@util/chat-store';


export async function POST(req: Request) {
  const { messages, chatId }: { messages: UIMessage[]; chatId: string } =
    await req.json();


  const result = streamText({
    model,
    messages: convertToModelMessages(messages),
  });


  // consume the stream to ensure it runs to completion & triggers onFinish
  // even when the client response is aborted:
  result.consumeStream(); // no await


  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    onFinish: ({ messages }) => {
      saveChat({ chatId, messages });
    },
  });
}
```

When the client reloads the page after a disconnect, the chat will be restored from the storage solution.

In production applications, you would also track the state of the request (in progress, complete) in your stored messages and use it on the client to cover the case where the client reloads the page after a disconnection, but the streaming is not yet complete.

For more robust handling of disconnects, you may want to add resumability on disconnects. Check out the [Chatbot Resume Streams](chatbot-resume-streams.html) documentation to learn more.

[Previous

Chatbot

](chatbot.html)

[Next

Chatbot Resume Streams

](chatbot-resume-streams.html)

On this page

[Chatbot Message Persistence](#chatbot-message-persistence)

[Starting a new chat](#starting-a-new-chat)

[Loading an existing chat](#loading-an-existing-chat)

[Validating messages on the server](#validating-messages-on-the-server)

[Validation with tools](#validation-with-tools)

[Handling validation errors](#handling-validation-errors)

[Displaying the chat](#displaying-the-chat)

[Storing messages](#storing-messages)

[Message IDs](#message-ids)

[Client-side vs Server-side ID Generation](#client-side-vs-server-side-id-generation)

[Setting Up Server-side ID Generation](#setting-up-server-side-id-generation)

[Option 1: Using generateMessageId in toUIMessageStreamResponse](#option-1-using-generatemessageid-in-touimessagestreamresponse)

[Option 2: Setting IDs with createUIMessageStream](#option-2-setting-ids-with-createuimessagestream)

[Sending only the last message](#sending-only-the-last-message)

[Handling client disconnects](#handling-client-disconnects)

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