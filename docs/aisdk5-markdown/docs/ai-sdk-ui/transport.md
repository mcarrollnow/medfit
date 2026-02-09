AI SDK UI: Transport

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

[AI SDK UI](../ai-sdk-ui.html)Transport

# [Transport](#transport)

The `useChat` transport system provides fine-grained control over how messages are sent to your API endpoints and how responses are processed. This is particularly useful for alternative communication protocols like WebSockets, custom authentication patterns, or specialized backend integrations.

## [Default Transport](#default-transport)

By default, `useChat` uses HTTP POST requests to send messages to `/api/chat`:

```tsx
import { useChat } from '@ai-sdk/react';


// Uses default HTTP transport
const { messages, sendMessage } = useChat();
```

This is equivalent to:

```tsx
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';


const { messages, sendMessage } = useChat({
  transport: new DefaultChatTransport({
    api: '/api/chat',
  }),
});
```

## [Custom Transport Configuration](#custom-transport-configuration)

Configure the default transport with custom options:

```tsx
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';


const { messages, sendMessage } = useChat({
  transport: new DefaultChatTransport({
    api: '/api/custom-chat',
    headers: {
      Authorization: 'Bearer your-token',
      'X-API-Version': '2024-01',
    },
    credentials: 'include',
  }),
});
```

### [Dynamic Configuration](#dynamic-configuration)

You can also provide functions that return configuration values. This is useful for authentication tokens that need to be refreshed, or for configuration that depends on runtime conditions:

```tsx
const { messages, sendMessage } = useChat({
  transport: new DefaultChatTransport({
    api: '/api/chat',
    headers: () => ({
      Authorization: `Bearer ${getAuthToken()}`,
      'X-User-ID': getCurrentUserId(),
    }),
    body: () => ({
      sessionId: getCurrentSessionId(),
      preferences: getUserPreferences(),
    }),
    credentials: () => 'include',
  }),
});
```

### [Request Transformation](#request-transformation)

Transform requests before sending to your API:

```tsx
const { messages, sendMessage } = useChat({
  transport: new DefaultChatTransport({
    api: '/api/chat',
    prepareSendMessagesRequest: ({ id, messages, trigger, messageId }) => {
      return {
        headers: {
          'X-Session-ID': id,
        },
        body: {
          messages: messages.slice(-10), // Only send last 10 messages
          trigger,
          messageId,
        },
      };
    },
  }),
});
```

## [Building Custom Transports](#building-custom-transports)

To understand how to build your own transport, refer to the source code of the default implementation:

-   **[DefaultChatTransport](https://github.com/vercel/ai/blob/main/packages/ai/src/ui/default-chat-transport.ts)** - The complete default HTTP transport implementation
-   **[HttpChatTransport](https://github.com/vercel/ai/blob/main/packages/ai/src/ui/http-chat-transport.ts)** - Base HTTP transport with request handling
-   **[ChatTransport Interface](https://github.com/vercel/ai/blob/main/packages/ai/src/ui/chat-transport.ts)** - The transport interface you need to implement

These implementations show you exactly how to:

-   Handle the `sendMessages` method
-   Process UI message streams
-   Transform requests and responses
-   Handle errors and connection management

The transport system gives you complete control over how your chat application communicates, enabling integration with any backend protocol or service.

[Previous

Error Handling

](error-handling.html)

[Next

Reading UIMessage Streams

](reading-ui-message-streams.html)

On this page

[Transport](#transport)

[Default Transport](#default-transport)

[Custom Transport Configuration](#custom-transport-configuration)

[Dynamic Configuration](#dynamic-configuration)

[Request Transformation](#request-transformation)

[Building Custom Transports](#building-custom-transports)

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