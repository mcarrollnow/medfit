AI SDK RSC: Streaming React Components

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

[AI SDK RSC](../ai-sdk-rsc.html)Streaming React Components

# [Streaming React Components](#streaming-react-components)

AI SDK RSC is currently experimental. We recommend using [AI SDK UI](../ai-sdk-ui/overview.html) for production. For guidance on migrating from RSC to UI, see our [migration guide](migrating-to-ui.html).

The RSC API allows you to stream React components from the server to the client with the [`streamUI`](../reference/ai-sdk-rsc/stream-ui.html) function. This is useful when you want to go beyond raw text and stream components to the client in real-time.

Similar to [AI SDK Core](../ai-sdk-core/overview.html) APIs (like [`streamText`](../reference/ai-sdk-core/stream-text.html) and [`streamObject`](../reference/ai-sdk-core/stream-object.html) ), `streamUI` provides a single function to call a model and allow it to respond with React Server Components. It supports the same model interfaces as AI SDK Core APIs.

### [Concepts](#concepts)

To give the model the ability to respond to a user's prompt with a React component, you can leverage [tools](../ai-sdk-core/tools-and-tool-calling.html).

Remember, tools are like programs you can give to the model, and the model can decide as and when to use based on the context of the conversation.

With the `streamUI` function, **you provide tools that return React components**. With the ability to stream components, the model is akin to a dynamic router that is able to understand the user's intention and display relevant UI.

At a high level, the `streamUI` works like other AI SDK Core functions: you can provide the model with a prompt or some conversation history and, optionally, some tools. If the model decides, based on the context of the conversation, to call a tool, it will generate a tool call. The `streamUI` function will then run the respective tool, returning a React component. If the model doesn't have a relevant tool to use, it will return a text generation, which will be passed to the `text` function, for you to handle (render and return as a React component).

Remember, the `streamUI` function must return a React component.

```tsx
const result = await streamUI({
  model: openai('gpt-4o'),
  prompt: 'Get the weather for San Francisco',
  text: ({ content }) => <div>{content}</div>,
  tools: {},
});
```

This example calls the `streamUI` function using OpenAI's `gpt-4o` model, passes a prompt, specifies how the model's plain text response (`content`) should be rendered, and then provides an empty object for tools. Even though this example does not define any tools, it will stream the model's response as a `div` rather than plain text.

### [Adding A Tool](#adding-a-tool)

Using tools with `streamUI` is similar to how you use tools with `generateText` and `streamText`. A tool is an object that has:

-   `description`: a string telling the model what the tool does and when to use it
-   `inputSchema`: a Zod schema describing what the tool needs in order to run
-   `generate`: an asynchronous function that will be run if the model calls the tool. This must return a React component

Let's expand the previous example to add a tool.

```tsx
const result = await streamUI({
  model: openai('gpt-4o'),
  prompt: 'Get the weather for San Francisco',
  text: ({ content }) => <div>{content}</div>,
  tools: {
    getWeather: {
      description: 'Get the weather for a location',
      inputSchema: z.object({ location: z.string() }),
      generate: async function* ({ location }) {
        yield <LoadingComponent />;
        const weather = await getWeather(location);
        return <WeatherComponent weather={weather} location={location} />;
      },
    },
  },
});
```

This tool would be run if the user asks for the weather for their location. If the user hasn't specified a location, the model will ask for it before calling the tool. When the model calls the tool, the generate function will initially return a loading component. This component will show until the awaited call to `getWeather` is resolved, at which point, the model will stream the `<WeatherComponent />` to the user.

Note: This example uses a [generator function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*) (`function*`), which allows you to pause its execution and return a value, then resume from where it left off on the next call. This is useful for handling data streams, as you can fetch and return data from an asynchronous source like an API, then resume the function to fetch the next chunk when needed. By yielding values one at a time, generator functions enable efficient processing of streaming data without blocking the main thread.

## [Using `streamUI` with Next.js](#using-streamui-with-nextjs)

Let's see how you can use the example above in a Next.js application.

To use `streamUI` in a Next.js application, you will need two things:

1.  A Server Action (where you will call `streamUI`)
2.  A page to call the Server Action and render the resulting components

### [Step 1: Create a Server Action](#step-1-create-a-server-action)

Server Actions are server-side functions that you can call directly from the frontend. For more info, see [the documentation](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations#with-client-components).

Create a Server Action at `app/actions.tsx` and add the following code:

```tsx
'use server';


import { streamUI } from '@ai-sdk/rsc';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';


const LoadingComponent = () => (
  <div className="animate-pulse p-4">getting weather...</div>
);


const getWeather = async (location: string) => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  return '82°F️ ☀️';
};


interface WeatherProps {
  location: string;
  weather: string;
}


const WeatherComponent = (props: WeatherProps) => (
  <div className="border border-neutral-200 p-4 rounded-lg max-w-fit">
    The weather in {props.location} is {props.weather}
  </div>
);


export async function streamComponent() {
  const result = await streamUI({
    model: openai('gpt-4o'),
    prompt: 'Get the weather for San Francisco',
    text: ({ content }) => <div>{content}</div>,
    tools: {
      getWeather: {
        description: 'Get the weather for a location',
        inputSchema: z.object({
          location: z.string(),
        }),
        generate: async function* ({ location }) {
          yield <LoadingComponent />;
          const weather = await getWeather(location);
          return <WeatherComponent weather={weather} location={location} />;
        },
      },
    },
  });


  return result.value;
}
```

The `getWeather` tool should look familiar as it is identical to the example in the previous section. In order for this tool to work:

1.  First define a `LoadingComponent`, which renders a pulsing `div` that will show some loading text.
2.  Next, define a `getWeather` function that will timeout for 2 seconds (to simulate fetching the weather externally) before returning the "weather" for a `location`. Note: you could run any asynchronous TypeScript code here.
3.  Finally, define a `WeatherComponent` which takes in `location` and `weather` as props, which are then rendered within a `div`.

Your Server Action is an asynchronous function called `streamComponent` that takes no inputs, and returns a `ReactNode`. Within the action, you call the `streamUI` function, specifying the model (`gpt-4o`), the prompt, the component that should be rendered if the model chooses to return text, and finally, your `getWeather` tool. Last but not least, you return the resulting component generated by the model with `result.value`.

To call this Server Action and display the resulting React Component, you will need a page.

### [Step 2: Create a Page](#step-2-create-a-page)

Create or update your root page (`app/page.tsx`) with the following code:

```tsx
'use client';


import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { streamComponent } from './actions';


export default function Page() {
  const [component, setComponent] = useState<React.ReactNode>();


  return (
    <div>
      <form
        onSubmit={async e => {
          e.preventDefault();
          setComponent(await streamComponent());
        }}
      >
        <Button>Stream Component</Button>
      </form>
      <div>{component}</div>
    </div>
  );
}
```

This page is first marked as a client component with the `"use client";` directive given it will be using hooks and interactivity. On the page, you render a form. When that form is submitted, you call the `streamComponent` action created in the previous step (just like any other function). The `streamComponent` action returns a `ReactNode` that you can then render on the page using React state (`setComponent`).

## [Going beyond a single prompt](#going-beyond-a-single-prompt)

You can now allow the model to respond to your prompt with a React component. However, this example is limited to a static prompt that is set within your Server Action. You could make this example interactive by turning it into a chatbot.

Learn how to stream React components with the Next.js App Router using `streamUI` with this [example](../../cookbook/rsc/render-visual-interface-in-chat.html).

[Previous

Overview

](overview.html)

[Next

Managing Generative UI State

](generative-ui-state.html)

On this page

[Streaming React Components](#streaming-react-components)

[Concepts](#concepts)

[Adding A Tool](#adding-a-tool)

[Using streamUI with Next.js](#using-streamui-with-nextjs)

[Step 1: Create a Server Action](#step-1-create-a-server-action)

[Step 2: Create a Page](#step-2-create-a-page)

[Going beyond a single prompt](#going-beyond-a-single-prompt)

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