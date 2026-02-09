Advanced: Stopping Streams

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

[Overview](../ai-sdk-ui/overview.html)

[Chatbot](../ai-sdk-ui/chatbot.html)

[Chatbot Message Persistence](../ai-sdk-ui/chatbot-message-persistence.html)

[Chatbot Resume Streams](../ai-sdk-ui/chatbot-resume-streams.html)

[Chatbot Tool Usage](../ai-sdk-ui/chatbot-tool-usage.html)

[Generative User Interfaces](../ai-sdk-ui/generative-user-interfaces.html)

[Completion](../ai-sdk-ui/completion.html)

[Object Generation](../ai-sdk-ui/object-generation.html)

[Streaming Custom Data](../ai-sdk-ui/streaming-data.html)

[Error Handling](../ai-sdk-ui/error-handling.html)

[Transport](../ai-sdk-ui/transport.html)

[Reading UIMessage Streams](../ai-sdk-ui/reading-ui-message-streams.html)

[Message Metadata](../ai-sdk-ui/message-metadata.html)

[Stream Protocols](../ai-sdk-ui/stream-protocol.html)

[AI SDK RSC](../ai-sdk-rsc.html)

[Advanced](../advanced.html)

[Prompt Engineering](prompt-engineering.html)

[Stopping Streams](stopping-streams.html)

[Backpressure](backpressure.html)

[Caching](caching.html)

[Multiple Streamables](multiple-streamables.html)

[Rate Limiting](rate-limiting.html)

[Rendering UI with Language Models](rendering-ui-with-language-models.html)

[Language Models as Routers](model-as-router.html)

[Multistep Interfaces](multistep-interfaces.html)

[Sequential Generations](sequential-generations.html)

[Vercel Deployment Guide](vercel-deployment-guide.html)

[Reference](../reference.html)

[AI SDK Core](../reference/ai-sdk-core.html)

[AI SDK UI](../reference/ai-sdk-ui.html)

[AI SDK RSC](../reference/ai-sdk-rsc.html)

[Stream Helpers](../reference/stream-helpers.html)

[AI SDK Errors](../reference/ai-sdk-errors.html)

[Migration Guides](../migration-guides.html)

[Troubleshooting](../troubleshooting.html)

[Advanced](../advanced.html)Stopping Streams

# [Stopping Streams](#stopping-streams)

Cancelling ongoing streams is often needed. For example, users might want to stop a stream when they realize that the response is not what they want.

The different parts of the AI SDK support cancelling streams in different ways.

## [AI SDK Core](#ai-sdk-core)

The AI SDK functions have an `abortSignal` argument that you can use to cancel a stream. You would use this if you want to cancel a stream from the server side to the LLM API, e.g. by forwarding the `abortSignal` from the request.

```tsx
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';


export async function POST(req: Request) {
  const { prompt } = await req.json();


  const result = streamText({
    model: openai('gpt-4.1'),
    prompt,
    // forward the abort signal:
    abortSignal: req.signal,
    onAbort: ({ steps }) => {
      // Handle cleanup when stream is aborted
      console.log('Stream aborted after', steps.length, 'steps');
      // Persist partial results to database
    },
  });


  return result.toTextStreamResponse();
}
```

## [AI SDK UI](#ai-sdk-ui)

The hooks, e.g. `useChat` or `useCompletion`, provide a `stop` helper function that can be used to cancel a stream. This will cancel the stream from the client side to the server.

Stream abort functionality is not compatible with stream resumption. If you're using `resume: true` in `useChat`, the abort functionality will break the resumption mechanism. Choose either abort or resume functionality, but not both.

```tsx
'use client';


import { useCompletion } from '@ai-sdk/react';


export default function Chat() {
  const { input, completion, stop, status, handleSubmit, handleInputChange } =
    useCompletion();


  return (
    <div>
      {(status === 'submitted' || status === 'streaming') && (
        <button type="button" onClick={() => stop()}>
          Stop
        </button>
      )}
      {completion}
      <form onSubmit={handleSubmit}>
        <input value={input} onChange={handleInputChange} />
      </form>
    </div>
  );
}
```

## [Handling stream abort cleanup](#handling-stream-abort-cleanup)

When streams are aborted, you may need to perform cleanup operations such as persisting partial results or cleaning up resources. The `onAbort` callback provides a way to handle these scenarios on the server side.

Unlike `onFinish`, which is called when a stream completes normally, `onAbort` is specifically called when a stream is aborted via `AbortSignal`. This distinction allows you to handle normal completion and aborted streams differently.

For UI message streams (`toUIMessageStreamResponse`), the `onFinish` callback also receives an `isAborted` parameter that indicates whether the stream was aborted. This allows you to handle both completion and abort scenarios in a single callback.

```tsx
import { streamText } from 'ai';


const result = streamText({
  model: openai('gpt-4.1'),
  prompt: 'Write a long story...',
  abortSignal: controller.signal,
  onAbort: ({ steps }) => {
    // Called when stream is aborted - persist partial results
    await savePartialResults(steps);
    await logAbortEvent(steps.length);
  },
  onFinish: ({ steps, totalUsage }) => {
    // Called when stream completes normally
    await saveFinalResults(steps, totalUsage);
  },
});
```

The `onAbort` callback receives:

-   `steps`: Array of all completed steps before the abort occurred

This is particularly useful for:

-   Persisting partial conversation history to database
-   Saving partial progress for later continuation
-   Cleaning up server-side resources or connections
-   Logging abort events for analytics

You can also handle abort events directly in the stream using the `abort` stream part:

```tsx
for await (const part of result.fullStream) {
  switch (part.type) {
    case 'text-delta':
      // Handle text delta content
      break;
    case 'abort':
      // Handle abort event directly in stream
      console.log('Stream was aborted');
      break;
    // ... other cases
  }
}
```

## [UI Message Streams](#ui-message-streams)

When using `toUIMessageStreamResponse`, you need to handle stream abortion slightly differently. The `onFinish` callback receives an `isAborted` parameter, and you should pass the `consumeStream` function to ensure proper abort handling:

```tsx
import { openai } from '@ai-sdk/openai';
import {
  consumeStream,
  convertToModelMessages,
  streamText,
  UIMessage,
} from 'ai';


export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();


  const result = streamText({
    model: openai('gpt-4o'),
    messages: convertToModelMessages(messages),
    abortSignal: req.signal,
  });


  return result.toUIMessageStreamResponse({
    onFinish: async ({ isAborted }) => {
      if (isAborted) {
        console.log('Stream was aborted');
        // Handle abort-specific cleanup
      } else {
        console.log('Stream completed normally');
        // Handle normal completion
      }
    },
    consumeSseStream: consumeStream,
  });
}
```

The `consumeStream` function is necessary for proper abort handling in UI message streams. It ensures that the stream is properly consumed even when aborted, preventing potential memory leaks or hanging connections.

## [AI SDK RSC](#ai-sdk-rsc)

The AI SDK RSC does not currently support stopping streams.

[Previous

Prompt Engineering

](prompt-engineering.html)

[Next

Backpressure

](backpressure.html)

On this page

[Stopping Streams](#stopping-streams)

[AI SDK Core](#ai-sdk-core)

[AI SDK UI](#ai-sdk-ui)

[Handling stream abort cleanup](#handling-stream-abort-cleanup)

[UI Message Streams](#ui-message-streams)

[AI SDK RSC](#ai-sdk-rsc)

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