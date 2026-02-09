AI SDK UI: Streaming Custom Data

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

[AI SDK UI](../ai-sdk-ui.html)Streaming Custom Data

# [Streaming Custom Data](#streaming-custom-data)

It is often useful to send additional data alongside the model's response. For example, you may want to send status information, the message ids after storing them, or references to content that the language model is referring to.

The AI SDK provides several helpers that allows you to stream additional data to the client and attach it to the `UIMessage` parts array:

-   `createUIMessageStream`: creates a data stream
-   `createUIMessageStreamResponse`: creates a response object that streams data
-   `pipeUIMessageStreamToResponse`: pipes a data stream to a server response object

The data is streamed as part of the response stream using Server-Sent Events.

## [Setting Up Type-Safe Data Streaming](#setting-up-type-safe-data-streaming)

First, define your custom message type with data part schemas for type safety:

```tsx
import { UIMessage } from 'ai';


// Define your custom message type with data part schemas
export type MyUIMessage = UIMessage<
  never, // metadata type
  {
    weather: {
      city: string;
      weather?: string;
      status: 'loading' | 'success';
    };
    notification: {
      message: string;
      level: 'info' | 'warning' | 'error';
    };
  } // data parts type
>;
```

## [Streaming Data from the Server](#streaming-data-from-the-server)

In your server-side route handler, you can create a `UIMessageStream` and then pass it to `createUIMessageStreamResponse`:

```tsx
import { openai } from '@ai-sdk/openai';
import {
  createUIMessageStream,
  createUIMessageStreamResponse,
  streamText,
  convertToModelMessages,
} from 'ai';
import type { MyUIMessage } from '@/ai/types';


export async function POST(req: Request) {
  const { messages } = await req.json();


  const stream = createUIMessageStream<MyUIMessage>({
    execute: ({ writer }) => {
      // 1. Send initial status (transient - won't be added to message history)
      writer.write({
        type: 'data-notification',
        data: { message: 'Processing your request...', level: 'info' },
        transient: true, // This part won't be added to message history
      });


      // 2. Send sources (useful for RAG use cases)
      writer.write({
        type: 'source',
        value: {
          type: 'source',
          sourceType: 'url',
          id: 'source-1',
          url: 'https://weather.com',
          title: 'Weather Data Source',
        },
      });


      // 3. Send data parts with loading state
      writer.write({
        type: 'data-weather',
        id: 'weather-1',
        data: { city: 'San Francisco', status: 'loading' },
      });


      const result = streamText({
        model: openai('gpt-4.1'),
        messages: convertToModelMessages(messages),
        onFinish() {
          // 4. Update the same data part (reconciliation)
          writer.write({
            type: 'data-weather',
            id: 'weather-1', // Same ID = update existing part
            data: {
              city: 'San Francisco',
              weather: 'sunny',
              status: 'success',
            },
          });


          // 5. Send completion notification (transient)
          writer.write({
            type: 'data-notification',
            data: { message: 'Request completed', level: 'info' },
            transient: true, // Won't be added to message history
          });
        },
      });


      writer.merge(result.toUIMessageStream());
    },
  });


  return createUIMessageStreamResponse({ stream });
}
```

You can also send stream data from custom backends, e.g. Python / FastAPI, using the [UI Message Stream Protocol](stream-protocol.html#ui-message-stream-protocol).

## [Types of Streamable Data](#types-of-streamable-data)

### [Data Parts (Persistent)](#data-parts-persistent)

Regular data parts are added to the message history and appear in `message.parts`:

```tsx
writer.write({
  type: 'data-weather',
  id: 'weather-1', // Optional: enables reconciliation
  data: { city: 'San Francisco', status: 'loading' },
});
```

### [Sources](#sources)

Sources are useful for RAG implementations where you want to show which documents or URLs were referenced:

```tsx
writer.write({
  type: 'source',
  value: {
    type: 'source',
    sourceType: 'url',
    id: 'source-1',
    url: 'https://example.com',
    title: 'Example Source',
  },
});
```

### [Transient Data Parts (Ephemeral)](#transient-data-parts-ephemeral)

Transient parts are sent to the client but not added to the message history. They are only accessible via the `onData` useChat handler:

```tsx
// server
writer.write({
  type: 'data-notification',
  data: { message: 'Processing...', level: 'info' },
  transient: true, // Won't be added to message history
});


// client
const [notification, setNotification] = useState();


const { messages } = useChat({
  onData: ({ data, type }) => {
    if (type === 'data-notification') {
      setNotification({ message: data.message, level: data.level });
    }
  },
});
```

## [Data Part Reconciliation](#data-part-reconciliation)

When you write to a data part with the same ID, the client automatically reconciles and updates that part. This enables powerful dynamic experiences like:

-   **Collaborative artifacts** - Update code, documents, or designs in real-time
-   **Progressive data loading** - Show loading states that transform into final results
-   **Live status updates** - Update progress bars, counters, or status indicators
-   **Interactive components** - Build UI elements that evolve based on user interaction

The reconciliation happens automatically - simply use the same `id` when writing to the stream.

## [Processing Data on the Client](#processing-data-on-the-client)

### [Using the onData Callback](#using-the-ondata-callback)

The `onData` callback is essential for handling streaming data, especially transient parts:

```tsx
import { useChat } from '@ai-sdk/react';
import type { MyUIMessage } from '@/ai/types';


const { messages } = useChat<MyUIMessage>({
  api: '/api/chat',
  onData: dataPart => {
    // Handle all data parts as they arrive (including transient parts)
    console.log('Received data part:', dataPart);


    // Handle different data part types
    if (dataPart.type === 'data-weather') {
      console.log('Weather update:', dataPart.data);
    }


    // Handle transient notifications (ONLY available here, not in message.parts)
    if (dataPart.type === 'data-notification') {
      showToast(dataPart.data.message, dataPart.data.level);
    }
  },
});
```

**Important:** Transient data parts are **only** available through the `onData` callback. They will not appear in the `message.parts` array since they're not added to message history.

### [Rendering Persistent Data Parts](#rendering-persistent-data-parts)

You can filter and render data parts from the message parts array:

```tsx
const result = (
  <>
    {messages?.map(message => (
      <div key={message.id}>
        {/* Render weather data parts */}
        {message.parts
          .filter(part => part.type === 'data-weather')
          .map((part, index) => (
            <div key={index} className="weather-widget">
              {part.data.status === 'loading' ? (
                <>Getting weather for {part.data.city}...</>
              ) : (
                <>
                  Weather in {part.data.city}: {part.data.weather}
                </>
              )}
            </div>
          ))}


        {/* Render text content */}
        {message.parts
          .filter(part => part.type === 'text')
          .map((part, index) => (
            <div key={index}>{part.text}</div>
          ))}


        {/* Render sources */}
        {message.parts
          .filter(part => part.type === 'source')
          .map((part, index) => (
            <div key={index} className="source">
              Source: <a href={part.url}>{part.title}</a>
            </div>
          ))}
      </div>
    ))}
  </>
);
```

### [Complete Example](#complete-example)

```tsx
'use client';


import { useChat } from '@ai-sdk/react';
import { useState } from 'react';
import type { MyUIMessage } from '@/ai/types';


export default function Chat() {
  const [input, setInput] = useState('');


  const { messages, sendMessage } = useChat<MyUIMessage>({
    api: '/api/chat',
    onData: dataPart => {
      // Handle transient notifications
      if (dataPart.type === 'data-notification') {
        console.log('Notification:', dataPart.data.message);
      }
    },
  });


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage({ text: input });
    setInput('');
  };


  return (
    <>
      {messages?.map(message => (
        <div key={message.id}>
          {message.role === 'user' ? 'User: ' : 'AI: '}


          {/* Render weather data */}
          {message.parts
            .filter(part => part.type === 'data-weather')
            .map((part, index) => (
              <span key={index} className="weather-update">
                {part.data.status === 'loading' ? (
                  <>Getting weather for {part.data.city}...</>
                ) : (
                  <>
                    Weather in {part.data.city}: {part.data.weather}
                  </>
                )}
              </span>
            ))}


          {/* Render text content */}
          {message.parts
            .filter(part => part.type === 'text')
            .map((part, index) => (
              <div key={index}>{part.text}</div>
            ))}
        </div>
      ))}


      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask about the weather..."
        />
        <button type="submit">Send</button>
      </form>
    </>
  );
}
```

## [Use Cases](#use-cases)

-   **RAG Applications** - Stream sources and retrieved documents
-   **Real-time Status** - Show loading states and progress updates
-   **Collaborative Tools** - Stream live updates to shared artifacts
-   **Analytics** - Send usage data without cluttering message history
-   **Notifications** - Display temporary alerts and status messages

## [Message Metadata vs Data Parts](#message-metadata-vs-data-parts)

Both [message metadata](message-metadata.html) and data parts allow you to send additional information alongside messages, but they serve different purposes:

### [Message Metadata](#message-metadata)

Message metadata is best for **message-level information** that describes the message as a whole:

-   Attached at the message level via `message.metadata`
-   Sent using the `messageMetadata` callback in `toUIMessageStreamResponse`
-   Ideal for: timestamps, model info, token usage, user context
-   Type-safe with custom metadata types

```ts
// Server: Send metadata about the message
return result.toUIMessageStreamResponse({
  messageMetadata: ({ part }) => {
    if (part.type === 'finish') {
      return {
        model: part.response.modelId,
        totalTokens: part.totalUsage.totalTokens,
        createdAt: Date.now(),
      };
    }
  },
});
```

### [Data Parts](#data-parts)

Data parts are best for streaming **dynamic arbitrary data**:

-   Added to the message parts array via `message.parts`
-   Streamed using `createUIMessageStream` and `writer.write()`
-   Can be reconciled/updated using the same ID
-   Support transient parts that don't persist
-   Ideal for: dynamic content, loading states, interactive components

```ts
// Server: Stream data as part of message content
writer.write({
  type: 'data-weather',
  id: 'weather-1',
  data: { city: 'San Francisco', status: 'loading' },
});
```

For more details on message metadata, see the [Message Metadata documentation](message-metadata.html).

[Previous

Object Generation

](object-generation.html)

[Next

Error Handling

](error-handling.html)

On this page

[Streaming Custom Data](#streaming-custom-data)

[Setting Up Type-Safe Data Streaming](#setting-up-type-safe-data-streaming)

[Streaming Data from the Server](#streaming-data-from-the-server)

[Types of Streamable Data](#types-of-streamable-data)

[Data Parts (Persistent)](#data-parts-persistent)

[Sources](#sources)

[Transient Data Parts (Ephemeral)](#transient-data-parts-ephemeral)

[Data Part Reconciliation](#data-part-reconciliation)

[Processing Data on the Client](#processing-data-on-the-client)

[Using the onData Callback](#using-the-ondata-callback)

[Rendering Persistent Data Parts](#rendering-persistent-data-parts)

[Complete Example](#complete-example)

[Use Cases](#use-cases)

[Message Metadata vs Data Parts](#message-metadata-vs-data-parts)

[Message Metadata](#message-metadata)

[Data Parts](#data-parts)

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