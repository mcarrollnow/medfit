AI SDK UI: Stream Protocols

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

[AI SDK UI](../ai-sdk-ui.html)Stream Protocols

# [Stream Protocols](#stream-protocols)

AI SDK UI functions such as `useChat` and `useCompletion` support both text streams and data streams. The stream protocol defines how the data is streamed to the frontend on top of the HTTP protocol.

This page describes both protocols and how to use them in the backend and frontend.

You can use this information to develop custom backends and frontends for your use case, e.g., to provide compatible API endpoints that are implemented in a different language such as Python.

For instance, here's an example using [FastAPI](https://github.com/vercel/ai/tree/main/examples/next-fastapi) as a backend.

## [Text Stream Protocol](#text-stream-protocol)

A text stream contains chunks in plain text, that are streamed to the frontend. Each chunk is then appended together to form a full text response.

Text streams are supported by `useChat`, `useCompletion`, and `useObject`. When you use `useChat` or `useCompletion`, you need to enable text streaming by setting the `streamProtocol` options to `text`.

You can generate text streams with `streamText` in the backend. When you call `toTextStreamResponse()` on the result object, a streaming HTTP response is returned.

Text streams only support basic text data. If you need to stream other types of data such as tool calls, use data streams.

### [Text Stream Example](#text-stream-example)

Here is a Next.js example that uses the text stream protocol:

```tsx
'use client';


import { useChat } from '@ai-sdk/react';
import { TextStreamChatTransport } from 'ai';
import { useState } from 'react';


export default function Chat() {
  const [input, setInput] = useState('');
  const { messages, sendMessage } = useChat({
    transport: new TextStreamChatTransport({ api: '/api/chat' }),
  });


  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {messages.map(message => (
        <div key={message.id} className="whitespace-pre-wrap">
          {message.role === 'user' ? 'User: ' : 'AI: '}
          {message.parts.map((part, i) => {
            switch (part.type) {
              case 'text':
                return <div key={`${message.id}-${i}`}>{part.text}</div>;
            }
          })}
        </div>
      ))}


      <form
        onSubmit={e => {
          e.preventDefault();
          sendMessage({ text: input });
          setInput('');
        }}
      >
        <input
          className="fixed dark:bg-zinc-900 bottom-0 w-full max-w-md p-2 mb-8 border border-zinc-300 dark:border-zinc-800 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={e => setInput(e.currentTarget.value)}
        />
      </form>
    </div>
  );
}
```

```ts
import { streamText, UIMessage, convertToModelMessages } from 'ai';
import { openai } from '@ai-sdk/openai';


// Allow streaming responses up to 30 seconds
export const maxDuration = 30;


export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();


  const result = streamText({
    model: openai('gpt-4o'),
    messages: convertToModelMessages(messages),
  });


  return result.toTextStreamResponse();
}
```

## [Data Stream Protocol](#data-stream-protocol)

A data stream follows a special protocol that the AI SDK provides to send information to the frontend.

The data stream protocol uses Server-Sent Events (SSE) format for improved standardization, keep-alive through ping, reconnect capabilities, and better cache handling.

When you provide data streams from a custom backend, you need to set the `x-vercel-ai-ui-message-stream` header to `v1`.

The following stream parts are currently supported:

### [Message Start Part](#message-start-part)

Indicates the beginning of a new message with metadata.

Format: Server-Sent Event with JSON object

Example:

```undefined
data: {"type":"start","messageId":"..."}
```

### [Text Parts](#text-parts)

Text content is streamed using a start/delta/end pattern with unique IDs for each text block.

#### [Text Start Part](#text-start-part)

Indicates the beginning of a text block.

Format: Server-Sent Event with JSON object

Example:

```undefined
data: {"type":"text-start","id":"msg_68679a454370819ca74c8eb3d04379630dd1afb72306ca5d"}
```

#### [Text Delta Part](#text-delta-part)

Contains incremental text content for the text block.

Format: Server-Sent Event with JSON object

Example:

```undefined
data: {"type":"text-delta","id":"msg_68679a454370819ca74c8eb3d04379630dd1afb72306ca5d","delta":"Hello"}
```

#### [Text End Part](#text-end-part)

Indicates the completion of a text block.

Format: Server-Sent Event with JSON object

Example:

```undefined
data: {"type":"text-end","id":"msg_68679a454370819ca74c8eb3d04379630dd1afb72306ca5d"}
```

### [Reasoning Parts](#reasoning-parts)

Reasoning content is streamed using a start/delta/end pattern with unique IDs for each reasoning block.

#### [Reasoning Start Part](#reasoning-start-part)

Indicates the beginning of a reasoning block.

Format: Server-Sent Event with JSON object

Example:

```undefined
data: {"type":"reasoning-start","id":"reasoning_123"}
```

#### [Reasoning Delta Part](#reasoning-delta-part)

Contains incremental reasoning content for the reasoning block.

Format: Server-Sent Event with JSON object

Example:

```undefined
data: {"type":"reasoning-delta","id":"reasoning_123","delta":"This is some reasoning"}
```

#### [Reasoning End Part](#reasoning-end-part)

Indicates the completion of a reasoning block.

Format: Server-Sent Event with JSON object

Example:

```undefined
data: {"type":"reasoning-end","id":"reasoning_123"}
```

### [Source Parts](#source-parts)

Source parts provide references to external content sources.

#### [Source URL Part](#source-url-part)

References to external URLs.

Format: Server-Sent Event with JSON object

Example:

```undefined
data: {"type":"source-url","sourceId":"https://example.com","url":"https://example.com"}
```

#### [Source Document Part](#source-document-part)

References to documents or files.

Format: Server-Sent Event with JSON object

Example:

```undefined
data: {"type":"source-document","sourceId":"https://example.com","mediaType":"file","title":"Title"}
```

### [File Part](#file-part)

The file parts contain references to files with their media type.

Format: Server-Sent Event with JSON object

Example:

```undefined
data: {"type":"file","url":"https://example.com/file.png","mediaType":"image/png"}
```

### [Data Parts](#data-parts)

Custom data parts allow streaming of arbitrary structured data with type-specific handling.

Format: Server-Sent Event with JSON object where the type includes a custom suffix

Example:

```undefined
data: {"type":"data-weather","data":{"location":"SF","temperature":100}}
```

The `data-*` type pattern allows you to define custom data types that your frontend can handle specifically.

### [Error Part](#error-part)

The error parts are appended to the message as they are received.

Format: Server-Sent Event with JSON object

Example:

```undefined
data: {"type":"error","errorText":"error message"}
```

### [Tool Input Start Part](#tool-input-start-part)

Indicates the beginning of tool input streaming.

Format: Server-Sent Event with JSON object

Example:

```undefined
data: {"type":"tool-input-start","toolCallId":"call_fJdQDqnXeGxTmr4E3YPSR7Ar","toolName":"getWeatherInformation"}
```

### [Tool Input Delta Part](#tool-input-delta-part)

Incremental chunks of tool input as it's being generated.

Format: Server-Sent Event with JSON object

Example:

```undefined
data: {"type":"tool-input-delta","toolCallId":"call_fJdQDqnXeGxTmr4E3YPSR7Ar","inputTextDelta":"San Francisco"}
```

### [Tool Input Available Part](#tool-input-available-part)

Indicates that tool input is complete and ready for execution.

Format: Server-Sent Event with JSON object

Example:

```undefined
data: {"type":"tool-input-available","toolCallId":"call_fJdQDqnXeGxTmr4E3YPSR7Ar","toolName":"getWeatherInformation","input":{"city":"San Francisco"}}
```

### [Tool Output Available Part](#tool-output-available-part)

Contains the result of tool execution.

Format: Server-Sent Event with JSON object

Example:

```undefined
data: {"type":"tool-output-available","toolCallId":"call_fJdQDqnXeGxTmr4E3YPSR7Ar","output":{"city":"San Francisco","weather":"sunny"}}
```

### [Start Step Part](#start-step-part)

A part indicating the start of a step.

Format: Server-Sent Event with JSON object

Example:

```undefined
data: {"type":"start-step"}
```

### [Finish Step Part](#finish-step-part)

A part indicating that a step (i.e., one LLM API call in the backend) has been completed.

This part is necessary to correctly process multiple stitched assistant calls, e.g. when calling tools in the backend, and using steps in `useChat` at the same time.

Format: Server-Sent Event with JSON object

Example:

```undefined
data: {"type":"finish-step"}
```

### [Finish Message Part](#finish-message-part)

A part indicating the completion of a message.

Format: Server-Sent Event with JSON object

Example:

```undefined
data: {"type":"finish"}
```

### [Stream Termination](#stream-termination)

The stream ends with a special `[DONE]` marker.

Format: Server-Sent Event with literal `[DONE]`

Example:

```undefined
data: [DONE]
```

The data stream protocol is supported by `useChat` and `useCompletion` on the frontend and used by default. `useCompletion` only supports the `text` and `data` stream parts.

On the backend, you can use `toUIMessageStreamResponse()` from the `streamText` result object to return a streaming HTTP response.

### [UI Message Stream Example](#ui-message-stream-example)

Here is a Next.js example that uses the UI message stream protocol:

```tsx
'use client';


import { useChat } from '@ai-sdk/react';
import { useState } from 'react';


export default function Chat() {
  const [input, setInput] = useState('');
  const { messages, sendMessage } = useChat();


  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {messages.map(message => (
        <div key={message.id} className="whitespace-pre-wrap">
          {message.role === 'user' ? 'User: ' : 'AI: '}
          {message.parts.map((part, i) => {
            switch (part.type) {
              case 'text':
                return <div key={`${message.id}-${i}`}>{part.text}</div>;
            }
          })}
        </div>
      ))}


      <form
        onSubmit={e => {
          e.preventDefault();
          sendMessage({ text: input });
          setInput('');
        }}
      >
        <input
          className="fixed dark:bg-zinc-900 bottom-0 w-full max-w-md p-2 mb-8 border border-zinc-300 dark:border-zinc-800 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={e => setInput(e.currentTarget.value)}
        />
      </form>
    </div>
  );
}
```

```ts
import { openai } from '@ai-sdk/openai';
import { streamText, UIMessage, convertToModelMessages } from 'ai';


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

[Previous

Message Metadata

](message-metadata.html)

[Next

AI SDK RSC

](../ai-sdk-rsc.html)

On this page

[Stream Protocols](#stream-protocols)

[Text Stream Protocol](#text-stream-protocol)

[Text Stream Example](#text-stream-example)

[Data Stream Protocol](#data-stream-protocol)

[Message Start Part](#message-start-part)

[Text Parts](#text-parts)

[Text Start Part](#text-start-part)

[Text Delta Part](#text-delta-part)

[Text End Part](#text-end-part)

[Reasoning Parts](#reasoning-parts)

[Reasoning Start Part](#reasoning-start-part)

[Reasoning Delta Part](#reasoning-delta-part)

[Reasoning End Part](#reasoning-end-part)

[Source Parts](#source-parts)

[Source URL Part](#source-url-part)

[Source Document Part](#source-document-part)

[File Part](#file-part)

[Data Parts](#data-parts)

[Error Part](#error-part)

[Tool Input Start Part](#tool-input-start-part)

[Tool Input Delta Part](#tool-input-delta-part)

[Tool Input Available Part](#tool-input-available-part)

[Tool Output Available Part](#tool-output-available-part)

[Start Step Part](#start-step-part)

[Finish Step Part](#finish-step-part)

[Finish Message Part](#finish-message-part)

[Stream Termination](#stream-termination)

[UI Message Stream Example](#ui-message-stream-example)

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