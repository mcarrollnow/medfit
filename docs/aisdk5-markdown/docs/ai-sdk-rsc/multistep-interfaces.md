AI SDK RSC: Multistep Interfaces

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

[AI SDK RSC](../ai-sdk-rsc.html)Multistep Interfaces

# [Designing Multistep Interfaces](#designing-multistep-interfaces)

AI SDK RSC is currently experimental. We recommend using [AI SDK UI](../ai-sdk-ui/overview.html) for production. For guidance on migrating from RSC to UI, see our [migration guide](migrating-to-ui.html).

Multistep interfaces refer to user interfaces that require multiple independent steps to be executed in order to complete a specific task.

For example, if you wanted to build a Generative UI chatbot capable of booking flights, it could have three steps:

-   Search all flights
-   Pick flight
-   Check availability

To build this kind of application you will leverage two concepts, **tool composition** and **application context**.

**Tool composition** is the process of combining multiple [tools](../ai-sdk-core/tools-and-tool-calling.html) to create a new tool. This is a powerful concept that allows you to break down complex tasks into smaller, more manageable steps. In the example above, *"search all flights"*, *"pick flight"*, and *"check availability"* come together to create a holistic *"book flight"* tool.

**Application context** refers to the state of the application at any given point in time. This includes the user's input, the output of the language model, and any other relevant information. In the example above, the flight selected in *"pick flight"* would be used as context necessary to complete the *"check availability"* task.

## [Overview](#overview)

In order to build a multistep interface with `@ai-sdk/rsc`, you will need a few things:

-   A Server Action that calls and returns the result from the `streamUI` function
-   Tool(s) (sub-tasks necessary to complete your overall task)
-   React component(s) that should be rendered when the tool is called
-   A page to render your chatbot

The general flow that you will follow is:

-   User sends a message (calls your Server Action with `useActions`, passing the message as an input)
-   Message is appended to the AI State and then passed to the model alongside a number of tools
-   Model can decide to call a tool, which will render the `<SomeTool />` component
-   Within that component, you can add interactivity by using `useActions` to call the model with your Server Action and `useUIState` to append the model's response (`<SomeOtherTool />`) to the UI State
-   And so on...

## [Implementation](#implementation)

The turn-by-turn implementation is the simplest form of multistep interfaces. In this implementation, the user and the model take turns during the conversation. For every user input, the model generates a response, and the conversation continues in this turn-by-turn fashion.

In the following example, you specify two tools (`searchFlights` and `lookupFlight`) that the model can use to search for flights and lookup details for a specific flight.

```tsx
import { streamUI } from '@ai-sdk/rsc';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';


const searchFlights = async (
  source: string,
  destination: string,
  date: string,
) => {
  return [
    {
      id: '1',
      flightNumber: 'AA123',
    },
    {
      id: '2',
      flightNumber: 'AA456',
    },
  ];
};


const lookupFlight = async (flightNumber: string) => {
  return {
    flightNumber: flightNumber,
    departureTime: '10:00 AM',
    arrivalTime: '12:00 PM',
  };
};


export async function submitUserMessage(input: string) {
  'use server';


  const ui = await streamUI({
    model: openai('gpt-4o'),
    system: 'you are a flight booking assistant',
    prompt: input,
    text: async ({ content }) => <div>{content}</div>,
    tools: {
      searchFlights: {
        description: 'search for flights',
        inputSchema: z.object({
          source: z.string().describe('The origin of the flight'),
          destination: z.string().describe('The destination of the flight'),
          date: z.string().describe('The date of the flight'),
        }),
        generate: async function* ({ source, destination, date }) {
          yield `Searching for flights from ${source} to ${destination} on ${date}...`;
          const results = await searchFlights(source, destination, date);


          return (
            <div>
              {results.map(result => (
                <div key={result.id}>
                  <div>{result.flightNumber}</div>
                </div>
              ))}
            </div>
          );
        },
      },
      lookupFlight: {
        description: 'lookup details for a flight',
        parameters: z.object({
          flightNumber: z.string().describe('The flight number'),
        }),
        generate: async function* ({ flightNumber }) {
          yield `Looking up details for flight ${flightNumber}...`;
          const details = await lookupFlight(flightNumber);


          return (
            <div>
              <div>Flight Number: {details.flightNumber}</div>
              <div>Departure Time: {details.departureTime}</div>
              <div>Arrival Time: {details.arrivalTime}</div>
            </div>
          );
        },
      },
    },
  });


  return ui.value;
}
```

Next, create an AI context that will hold the UI State and AI State.

```ts
import { createAI } from '@ai-sdk/rsc';
import { submitUserMessage } from './actions';


export const AI = createAI<any[], React.ReactNode[]>({
  initialUIState: [],
  initialAIState: [],
  actions: {
    submitUserMessage,
  },
});
```

Next, wrap your application with your newly created context.

```tsx
import { type ReactNode } from 'react';
import { AI } from './ai';


export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <AI>
      <html lang="en">
        <body>{children}</body>
      </html>
    </AI>
  );
}
```

To call your Server Action, update your root page with the following:

```tsx
'use client';


import { useState } from 'react';
import { AI } from './ai';
import { useActions, useUIState } from '@ai-sdk/rsc';


export default function Page() {
  const [input, setInput] = useState<string>('');
  const [conversation, setConversation] = useUIState<typeof AI>();
  const { submitUserMessage } = useActions();


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setInput('');
    setConversation(currentConversation => [
      ...currentConversation,
      <div>{input}</div>,
    ]);
    const message = await submitUserMessage(input);
    setConversation(currentConversation => [...currentConversation, message]);
  };


  return (
    <div>
      <div>
        {conversation.map((message, i) => (
          <div key={i}>{message}</div>
        ))}
      </div>
      <div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
          />
          <button>Send Message</button>
        </form>
      </div>
    </div>
  );
}
```

This page pulls in the current UI State using the `useUIState` hook, which is then mapped over and rendered in the UI. To access the Server Action, you use the `useActions` hook which will return all actions that were passed to the `actions` key of the `createAI` function in your `actions.tsx` file. Finally, you call the `submitUserMessage` function like any other TypeScript function. This function returns a React component (`message`) that is then rendered in the UI by updating the UI State with `setConversation`.

In this example, to call the next tool, the user must respond with plain text. **Given you are streaming a React component, you can add a button to trigger the next step in the conversation**.

To add user interaction, you will have to convert the component into a client component and use the `useAction` hook to trigger the next step in the conversation.

```tsx
'use client';


import { useActions, useUIState } from '@ai-sdk/rsc';
import { ReactNode } from 'react';


interface FlightsProps {
  flights: { id: string; flightNumber: string }[];
}


export const Flights = ({ flights }: FlightsProps) => {
  const { submitUserMessage } = useActions();
  const [_, setMessages] = useUIState();


  return (
    <div>
      {flights.map(result => (
        <div key={result.id}>
          <div
            onClick={async () => {
              const display = await submitUserMessage(
                `lookupFlight ${result.flightNumber}`,
              );


              setMessages((messages: ReactNode[]) => [...messages, display]);
            }}
          >
            {result.flightNumber}
          </div>
        </div>
      ))}
    </div>
  );
};
```

Now, update your `searchFlights` tool to render the new `<Flights />` component.

```tsx
...
searchFlights: {
  description: 'search for flights',
  parameters: z.object({
    source: z.string().describe('The origin of the flight'),
    destination: z.string().describe('The destination of the flight'),
    date: z.string().describe('The date of the flight'),
  }),
  generate: async function* ({ source, destination, date }) {
    yield `Searching for flights from ${source} to ${destination} on ${date}...`;
    const results = await searchFlights(source, destination, date);
    return (<Flights flights={results} />);
  },
}
...
```

In the above example, the `Flights` component is used to display the search results. When the user clicks on a flight number, the `lookupFlight` tool is called with the flight number as a parameter. The `submitUserMessage` action is then called to trigger the next step in the conversation.

Learn more about tool calling in Next.js App Router by checking out examples [here](../../cookbook/rsc/generate-text.html).

[Previous

Saving and Restoring States

](saving-and-restoring-states.html)

[Next

Streaming Values

](streaming-values.html)

On this page

[Designing Multistep Interfaces](#designing-multistep-interfaces)

[Overview](#overview)

[Implementation](#implementation)

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