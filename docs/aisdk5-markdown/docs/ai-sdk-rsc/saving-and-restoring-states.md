AI SDK RSC: Saving and Restoring States

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

[AI SDK RSC](../ai-sdk-rsc.html)Saving and Restoring States

# [Saving and Restoring States](#saving-and-restoring-states)

AI SDK RSC is currently experimental. We recommend using [AI SDK UI](../ai-sdk-ui/overview.html) for production. For guidance on migrating from RSC to UI, see our [migration guide](migrating-to-ui.html).

AI SDK RSC provides convenient methods for saving and restoring AI and UI state. This is useful for saving the state of your application after every model generation, and restoring it when the user revisits the generations.

## [AI State](#ai-state)

### [Saving AI state](#saving-ai-state)

The AI state can be saved using the [`onSetAIState`](../reference/ai-sdk-rsc/create-ai.html#on-set-ai-state) callback, which gets called whenever the AI state is updated. In the following example, you save the chat history to a database whenever the generation is marked as done.

```tsx
export const AI = createAI<ServerMessage[], ClientMessage[]>({
  actions: {
    continueConversation,
  },
  onSetAIState: async ({ state, done }) => {
    'use server';


    if (done) {
      saveChatToDB(state);
    }
  },
});
```

### [Restoring AI state](#restoring-ai-state)

The AI state can be restored using the [`initialAIState`](../reference/ai-sdk-rsc/create-ai.html#initial-ai-state) prop passed to the context provider created by the [`createAI`](../reference/ai-sdk-rsc/create-ai.html) function. In the following example, you restore the chat history from a database when the component is mounted.

```tsx
import { ReactNode } from 'react';
import { AI } from './ai';


export default async function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const chat = await loadChatFromDB();


  return (
    <html lang="en">
      <body>
        <AI initialAIState={chat}>{children}</AI>
      </body>
    </html>
  );
}
```

## [UI State](#ui-state)

### [Saving UI state](#saving-ui-state)

The UI state cannot be saved directly, since the contents aren't yet serializable. Instead, you can use the AI state as proxy to store details about the UI state and use it to restore the UI state when needed.

### [Restoring UI state](#restoring-ui-state)

The UI state can be restored using the AI state as a proxy. In the following example, you restore the chat history from the AI state when the component is mounted. You use the [`onGetUIState`](../reference/ai-sdk-rsc/create-ai.html#on-get-ui-state) callback to listen for SSR events and restore the UI state.

```tsx
export const AI = createAI<ServerMessage[], ClientMessage[]>({
  actions: {
    continueConversation,
  },
  onGetUIState: async () => {
    'use server';


    const historyFromDB: ServerMessage[] = await loadChatFromDB();
    const historyFromApp: ServerMessage[] = getAIState();


    // If the history from the database is different from the
    // history in the app, they're not in sync so return the UIState
    // based on the history from the database


    if (historyFromDB.length !== historyFromApp.length) {
      return historyFromDB.map(({ role, content }) => ({
        id: generateId(),
        role,
        display:
          role === 'function' ? (
            <Component {...JSON.parse(content)} />
          ) : (
            content
          ),
      }));
    }
  },
});
```

To learn more, check out this [example](../../cookbook/rsc/save-messages-to-database.html) that persists and restores states in your Next.js application.

* * *

Next, you will learn how you can use `@ai-sdk/rsc` functions like `useActions` and `useUIState` to create interactive, multistep interfaces.

[Previous

Managing Generative UI State

](generative-ui-state.html)

[Next

Multistep Interfaces

](multistep-interfaces.html)

On this page

[Saving and Restoring States](#saving-and-restoring-states)

[AI State](#ai-state)

[Saving AI state](#saving-ai-state)

[Restoring AI state](#restoring-ai-state)

[UI State](#ui-state)

[Saving UI state](#saving-ui-state)

[Restoring UI state](#restoring-ui-state)

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