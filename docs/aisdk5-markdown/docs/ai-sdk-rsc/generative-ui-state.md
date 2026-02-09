AI SDK RSC: Managing Generative UI State

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

[AI SDK RSC](../ai-sdk-rsc.html)Managing Generative UI State

# [Managing Generative UI State](#managing-generative-ui-state)

AI SDK RSC is currently experimental. We recommend using [AI SDK UI](../ai-sdk-ui/overview.html) for production. For guidance on migrating from RSC to UI, see our [migration guide](migrating-to-ui.html).

State is an essential part of any application. State is particularly important in AI applications as it is passed to large language models (LLMs) on each request to ensure they have the necessary context to produce a great generation. Traditional chatbots are text-based and have a structure that mirrors that of any chat application.

For example, in a chatbot, state is an array of `messages` where each `message` has:

-   `id`: a unique identifier
-   `role`: who sent the message (user/assistant/system/tool)
-   `content`: the content of the message

This state can be rendered in the UI and sent to the model without any modifications.

With Generative UI, the model can now return a React component, rather than a plain text message. The client can render that component without issue, but that state can't be sent back to the model because React components aren't serialisable. So, what can you do?

**The solution is to split the state in two, where one (AI State) becomes a proxy for the other (UI State)**.

One way to understand this concept is through a Lego analogy. Imagine a 10,000 piece Lego model that, once built, cannot be easily transported because it is fragile. By taking the model apart, it can be easily transported, and then rebuilt following the steps outlined in the instructions pamphlet. In this way, the instructions pamphlet is a proxy to the physical structure. Similarly, AI State provides a serialisable (JSON) representation of your UI that can be passed back and forth to the model.

## [What is AI and UI State?](#what-is-ai-and-ui-state)

The RSC API simplifies how you manage AI State and UI State, providing a robust way to keep them in sync between your database, server and client.

### [AI State](#ai-state)

AI State refers to the state of your application in a serialisable format that will be used on the server and can be shared with the language model.

For a chat app, the AI State is the conversation history (messages) between the user and the assistant. Components generated by the model would be represented in a JSON format as a tool alongside any necessary props. AI State can also be used to store other values and meta information such as `createdAt` for each message and `chatId` for each conversation. The LLM reads this history so it can generate the next message. This state serves as the source of truth for the current application state.

**Note**: AI state can be accessed/modified from both the server and the client.

### [UI State](#ui-state)

UI State refers to the state of your application that is rendered on the client. It is a fully client-side state (similar to `useState`) that can store anything from Javascript values to React elements. UI state is a list of actual UI elements that are rendered on the client.

**Note**: UI State can only be accessed client-side.

## [Using AI / UI State](#using-ai--ui-state)

### [Creating the AI Context](#creating-the-ai-context)

AI SDK RSC simplifies managing AI and UI state across your application by providing several hooks. These hooks are powered by [React context](https://react.dev/reference/react/hooks#context-hooks) under the hood.

Notably, this means you do not have to pass the message history to the server explicitly for each request. You also can access and update your application state in any child component of the context provider. As you begin building [multistep generative interfaces](multistep-interfaces.html), this will be particularly helpful.

To use `@ai-sdk/rsc` to manage AI and UI State in your application, you can create a React context using [`createAI`](../reference/ai-sdk-rsc/create-ai.html):

```tsx
// Define the AI state and UI state types
export type ServerMessage = {
  role: 'user' | 'assistant';
  content: string;
};


export type ClientMessage = {
  id: string;
  role: 'user' | 'assistant';
  display: ReactNode;
};


export const sendMessage = async (input: string): Promise<ClientMessage> => {
  "use server"
  ...
}
```

```tsx
import { createAI } from '@ai-sdk/rsc';
import { ClientMessage, ServerMessage, sendMessage } from './actions';


export type AIState = ServerMessage[];
export type UIState = ClientMessage[];


// Create the AI provider with the initial states and allowed actions
export const AI = createAI<AIState, UIState>({
  initialAIState: [],
  initialUIState: [],
  actions: {
    sendMessage,
  },
});
```

You must pass Server Actions to the `actions` object.

In this example, you define types for AI State and UI State, respectively.

Next, wrap your application with your newly created context. With that, you can get and set AI and UI State across your entire application.

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

## [Reading UI State in Client](#reading-ui-state-in-client)

The UI state can be accessed in Client Components using the [`useUIState`](../reference/ai-sdk-rsc/use-ui-state.html) hook provided by the RSC API. The hook returns the current UI state and a function to update the UI state like React's `useState`.

```tsx
'use client';


import { useUIState } from '@ai-sdk/rsc';


export default function Page() {
  const [messages, setMessages] = useUIState();


  return (
    <ul>
      {messages.map(message => (
        <li key={message.id}>{message.display}</li>
      ))}
    </ul>
  );
}
```

## [Reading AI State in Client](#reading-ai-state-in-client)

The AI state can be accessed in Client Components using the [`useAIState`](../reference/ai-sdk-rsc/use-ai-state.html) hook provided by the RSC API. The hook returns the current AI state.

```tsx
'use client';


import { useAIState } from '@ai-sdk/rsc';


export default function Page() {
  const [messages, setMessages] = useAIState();


  return (
    <ul>
      {messages.map(message => (
        <li key={message.id}>{message.content}</li>
      ))}
    </ul>
  );
}
```

## [Reading AI State on Server](#reading-ai-state-on-server)

The AI State can be accessed within any Server Action provided to the `createAI` context using the [`getAIState`](../reference/ai-sdk-rsc/get-ai-state.html) function. It returns the current AI state as a read-only value:

```tsx
import { getAIState } from '@ai-sdk/rsc';


export async function sendMessage(message: string) {
  'use server';


  const history = getAIState();


  const response = await generateText({
    model: openai('gpt-3.5-turbo'),
    messages: [...history, { role: 'user', content: message }],
  });


  return response;
}
```

Remember, you can only access state within actions that have been passed to the `createAI` context within the `actions` key.

## [Updating AI State on Server](#updating-ai-state-on-server)

The AI State can also be updated from within your Server Action with the [`getMutableAIState`](../reference/ai-sdk-rsc/get-mutable-ai-state.html) function. This function is similar to `getAIState`, but it returns the state with methods to read and update it:

```tsx
import { getMutableAIState } from '@ai-sdk/rsc';


export async function sendMessage(message: string) {
  'use server';


  const history = getMutableAIState();


  // Update the AI state with the new user message.
  history.update([...history.get(), { role: 'user', content: message }]);


  const response = await generateText({
    model: openai('gpt-3.5-turbo'),
    messages: history.get(),
  });


  // Update the AI state again with the response from the model.
  history.done([...history.get(), { role: 'assistant', content: response }]);


  return response;
}
```

It is important to update the AI State with new responses using `.update()` and `.done()` to keep the conversation history in sync.

## [Calling Server Actions from the Client](#calling-server-actions-from-the-client)

To call the `sendMessage` action from the client, you can use the [`useActions`](../reference/ai-sdk-rsc/use-actions.html) hook. The hook returns all the available Actions that were provided to `createAI`:

```tsx
'use client';


import { useActions, useUIState } from '@ai-sdk/rsc';
import { AI } from './ai';


export default function Page() {
  const { sendMessage } = useActions<typeof AI>();
  const [messages, setMessages] = useUIState();


  const handleSubmit = async event => {
    event.preventDefault();


    setMessages([
      ...messages,
      { id: Date.now(), role: 'user', display: event.target.message.value },
    ]);


    const response = await sendMessage(event.target.message.value);


    setMessages([
      ...messages,
      { id: Date.now(), role: 'assistant', display: response },
    ]);
  };


  return (
    <>
      <ul>
        {messages.map(message => (
          <li key={message.id}>{message.display}</li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <input type="text" name="message" />
        <button type="submit">Send</button>
      </form>
    </>
  );
}
```

When the user submits a message, the `sendMessage` action is called with the message content. The response from the action is then added to the UI state, updating the displayed messages.

Important! Don't forget to update the UI State after you call your Server Action otherwise the streamed component will not show in the UI.

To learn more, check out this [example](generative-ui-state.html#what-is-ai-and-ui-state) on managing AI and UI state using `@ai-sdk/rsc`.

* * *

Next, you will learn how you can save and restore state with `@ai-sdk/rsc`.

[Previous

Streaming React Components

](streaming-react-components.html)

[Next

Saving and Restoring States

](saving-and-restoring-states.html)

On this page

[Managing Generative UI State](#managing-generative-ui-state)

[What is AI and UI State?](#what-is-ai-and-ui-state)

[AI State](#ai-state)

[UI State](#ui-state)

[Using AI / UI State](#using-ai--ui-state)

[Creating the AI Context](#creating-the-ai-context)

[Reading UI State in Client](#reading-ui-state-in-client)

[Reading AI State in Client](#reading-ai-state-in-client)

[Reading AI State on Server](#reading-ai-state-on-server)

[Updating AI State on Server](#updating-ai-state-on-server)

[Calling Server Actions from the Client](#calling-server-actions-from-the-client)

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