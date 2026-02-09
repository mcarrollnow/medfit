AI SDK UI: Message Metadata

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

[AI SDK UI](../ai-sdk-ui.html)Message Metadata

# [Message Metadata](#message-metadata)

Message metadata allows you to attach custom information to messages at the message level. This is useful for tracking timestamps, model information, token usage, user context, and other message-level data.

## [Overview](#overview)

Message metadata differs from [data parts](streaming-data.html) in that it's attached at the message level rather than being part of the message content. While data parts are ideal for dynamic content that forms part of the message, metadata is perfect for information about the message itself.

## [Getting Started](#getting-started)

Here's a simple example of using message metadata to track timestamps and model information:

### [Defining Metadata Types](#defining-metadata-types)

First, define your metadata type for type safety:

```tsx
import { UIMessage } from 'ai';
import { z } from 'zod';


// Define your metadata schema
export const messageMetadataSchema = z.object({
  createdAt: z.number().optional(),
  model: z.string().optional(),
  totalTokens: z.number().optional(),
});


export type MessageMetadata = z.infer<typeof messageMetadataSchema>;


// Create a typed UIMessage
export type MyUIMessage = UIMessage<MessageMetadata>;
```

### [Sending Metadata from the Server](#sending-metadata-from-the-server)

Use the `messageMetadata` callback in `toUIMessageStreamResponse` to send metadata at different streaming stages:

```ts
import { openai } from '@ai-sdk/openai';
import { convertToModelMessages, streamText } from 'ai';
import type { MyUIMessage } from '@/types';


export async function POST(req: Request) {
  const { messages }: { messages: MyUIMessage[] } = await req.json();


  const result = streamText({
    model: openai('gpt-4o'),
    messages: convertToModelMessages(messages),
  });


  return result.toUIMessageStreamResponse({
    originalMessages: messages, // pass this in for type-safe return objects
    messageMetadata: ({ part }) => {
      // Send metadata when streaming starts
      if (part.type === 'start') {
        return {
          createdAt: Date.now(),
          model: 'gpt-4o',
        };
      }


      // Send additional metadata when streaming completes
      if (part.type === 'finish') {
        return {
          totalTokens: part.totalUsage.totalTokens,
        };
      }
    },
  });
}
```

To enable type-safe metadata return object in `messageMetadata`, pass in the `originalMessages` parameter typed to your UIMessage type.

### [Accessing Metadata on the Client](#accessing-metadata-on-the-client)

Access metadata through the `message.metadata` property:

```tsx
'use client';


import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import type { MyUIMessage } from '@/types';


export default function Chat() {
  const { messages } = useChat<MyUIMessage>({
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
  });


  return (
    <div>
      {messages.map(message => (
        <div key={message.id}>
          <div>
            {message.role === 'user' ? 'User: ' : 'AI: '}
            {message.metadata?.createdAt && (
              <span className="text-sm text-gray-500">
                {new Date(message.metadata.createdAt).toLocaleTimeString()}
              </span>
            )}
          </div>


          {/* Render message content */}
          {message.parts.map((part, index) =>
            part.type === 'text' ? <div key={index}>{part.text}</div> : null,
          )}


          {/* Display additional metadata */}
          {message.metadata?.totalTokens && (
            <div className="text-xs text-gray-400">
              {message.metadata.totalTokens} tokens
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
```

For streaming arbitrary data that changes during generation, consider using [data parts](streaming-data.html) instead.

## [Common Use Cases](#common-use-cases)

Message metadata is ideal for:

-   **Timestamps**: When messages were created or completed
-   **Model Information**: Which AI model was used
-   **Token Usage**: Track costs and usage limits
-   **User Context**: User IDs, session information
-   **Performance Metrics**: Generation time, time to first token
-   **Quality Indicators**: Finish reason, confidence scores

## [See Also](#see-also)

-   [Chatbot Guide](chatbot.html#message-metadata) - Message metadata in the context of building chatbots
-   [Streaming Data](streaming-data.html#message-metadata-vs-data-parts) - Comparison with data parts
-   [UIMessage Reference](../reference/ai-sdk-core/ui-message.html) - Complete UIMessage type reference

[Previous

Reading UIMessage Streams

](reading-ui-message-streams.html)

[Next

Stream Protocols

](stream-protocol.html)

On this page

[Message Metadata](#message-metadata)

[Overview](#overview)

[Getting Started](#getting-started)

[Defining Metadata Types](#defining-metadata-types)

[Sending Metadata from the Server](#sending-metadata-from-the-server)

[Accessing Metadata on the Client](#accessing-metadata-on-the-client)

[Common Use Cases](#common-use-cases)

[See Also](#see-also)

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