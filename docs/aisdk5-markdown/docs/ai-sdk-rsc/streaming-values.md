AI SDK RSC: Streaming Values

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

[Overview](overview.html)

[Streaming React Components](streaming-react-components.html)

[Managing Generative UI State](generative-ui-state.html)

[Saving and Restoring States](saving-and-restoring-states.html)

[Multistep Interfaces](multistep-interfaces.html)

[Streaming Values](streaming-values.html)

[Handling Loading State](loading-state.html)

[Error Handling](error-handling.html)

[Handling Authentication](authentication.html)

[Migrating from RSC to UI](migrating-to-ui.html)

[Advanced](../advanced.html)

[Reference](../reference.html)

[AI SDK Core](../reference/ai-sdk-core.html)

[AI SDK UI](../reference/ai-sdk-ui.html)

[AI SDK RSC](../reference/ai-sdk-rsc.html)

[Stream Helpers](../reference/stream-helpers.html)

[AI SDK Errors](../reference/ai-sdk-errors.html)

[Migration Guides](../migration-guides.html)

[Troubleshooting](../troubleshooting.html)

[AI SDK RSC](../ai-sdk-rsc.html)Streaming Values

# [Streaming Values](#streaming-values)

AI SDK RSC is currently experimental. We recommend using [AI SDK UI](../ai-sdk-ui/overview.html) for production. For guidance on migrating from RSC to UI, see our [migration guide](migrating-to-ui.html).

The RSC API provides several utility functions to allow you to stream values from the server to the client. This is useful when you need more granular control over what you are streaming and how you are streaming it.

These utilities can also be paired with [AI SDK Core](../ai-sdk-core.html) functions like [`streamText`](../reference/ai-sdk-core/stream-text.html) and [`streamObject`](../reference/ai-sdk-core/stream-object.html) to easily stream LLM generations from the server to the client.

There are two functions provided by the RSC API that allow you to create streamable values:

-   [`createStreamableValue`](../reference/ai-sdk-rsc/create-streamable-value.html) - creates a streamable (serializable) value, with full control over how you create, update, and close the stream.
-   [`createStreamableUI`](../reference/ai-sdk-rsc/create-streamable-ui.html) - creates a streamable React component, with full control over how you create, update, and close the stream.

## [`createStreamableValue`](#createstreamablevalue)

The RSC API allows you to stream serializable Javascript values from the server to the client using [`createStreamableValue`](../reference/ai-sdk-rsc/create-streamable-value.html), such as strings, numbers, objects, and arrays.

This is useful when you want to stream:

-   Text generations from the language model in real-time.
-   Buffer values of image and audio generations from multi-modal models.
-   Progress updates from multi-step agent runs.

## [Creating a Streamable Value](#creating-a-streamable-value)

You can import `createStreamableValue` from `@ai-sdk/rsc` and use it to create a streamable value.

```tsx
'use server';


import { createStreamableValue } from '@ai-sdk/rsc';


export const runThread = async () => {
  const streamableStatus = createStreamableValue('thread.init');


  setTimeout(() => {
    streamableStatus.update('thread.run.create');
    streamableStatus.update('thread.run.update');
    streamableStatus.update('thread.run.end');
    streamableStatus.done('thread.end');
  }, 1000);


  return {
    status: streamableStatus.value,
  };
};
```

## [Reading a Streamable Value](#reading-a-streamable-value)

You can read streamable values on the client using `readStreamableValue`. It returns an async iterator that yields the value of the streamable as it is updated:

```tsx
import { readStreamableValue } from '@ai-sdk/rsc';
import { runThread } from '@/actions';


export default function Page() {
  return (
    <button
      onClick={async () => {
        const { status } = await runThread();


        for await (const value of readStreamableValue(status)) {
          console.log(value);
        }
      }}
    >
      Ask
    </button>
  );
}
```

Learn how to stream a text generation (with `streamText`) using the Next.js App Router and `createStreamableValue` in this [example](../../cookbook/rsc/stream-text.html).

## [`createStreamableUI`](#createstreamableui)

`createStreamableUI` creates a stream that holds a React component. Unlike AI SDK Core APIs, this function does not call a large language model. Instead, it provides a primitive that can be used to have granular control over streaming a React component.

## [Using `createStreamableUI`](#using-createstreamableui)

Let's look at how you can use the `createStreamableUI` function with a Server Action.

```tsx
'use server';


import { createStreamableUI } from '@ai-sdk/rsc';


export async function getWeather() {
  const weatherUI = createStreamableUI();


  weatherUI.update(<div style={{ color: 'gray' }}>Loading...</div>);


  setTimeout(() => {
    weatherUI.done(<div>It&apos;s a sunny day!</div>);
  }, 1000);


  return weatherUI.value;
}
```

First, you create a streamable UI with an empty state and then update it with a loading message. After 1 second, you mark the stream as done passing in the actual weather information as its final value. The `.value` property contains the actual UI that can be sent to the client.

## [Reading a Streamable UI](#reading-a-streamable-ui)

On the client side, you can call the `getWeather` Server Action and render the returned UI like any other React component.

```tsx
'use client';


import { useState } from 'react';
import { readStreamableValue } from '@ai-sdk/rsc';
import { getWeather } from '@/actions';


export default function Page() {
  const [weather, setWeather] = useState<React.ReactNode | null>(null);


  return (
    <div>
      <button
        onClick={async () => {
          const weatherUI = await getWeather();
          setWeather(weatherUI);
        }}
      >
        What&apos;s the weather?
      </button>


      {weather}
    </div>
  );
}
```

When the button is clicked, the `getWeather` function is called, and the returned UI is set to the `weather` state and rendered on the page. Users will see the loading message first and then the actual weather information after 1 second.

Learn more about handling multiple streams in a single request in the [Multiple Streamables](../advanced/multiple-streamables.html) guide.

Learn more about handling state for more complex use cases with [AI/UI State](generative-ui-state.html) .

[Previous

Multistep Interfaces

](multistep-interfaces.html)

[Next

Handling Loading State

](loading-state.html)

On this page

[Streaming Values](#streaming-values)

[createStreamableValue](#createstreamablevalue)

[Creating a Streamable Value](#creating-a-streamable-value)

[Reading a Streamable Value](#reading-a-streamable-value)

[createStreamableUI](#createstreamableui)

[Using createStreamableUI](#using-createstreamableui)

[Reading a Streamable UI](#reading-a-streamable-ui)

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