AI SDK UI: convertToModelMessages

[](https://vercel.com/)

[

AI SDK



](../../../index.html)

-   [Docs](../../introduction.html)
-   [Cookbook](../../../cookbook.html)
-   [Providers](../../../providers/ai-sdk-providers.html)
-   [Playground](../../../playground.html)
-   [
    
    AI ElementsAI Elements
    
    ](../../../elements/overview.html)
-   [AI GatewayGateway](https://vercel.com/ai-gateway)

AI SDK 5 is available now.

[View Announcement](https://vercel.com/blog/ai-sdk-5)

Menu

[AI SDK by Vercel](../../introduction.html)

[Foundations](../../foundations.html)

[Overview](../../foundations/overview.html)

[Providers and Models](../../foundations/providers-and-models.html)

[Prompts](../../foundations/prompts.html)

[Tools](../../foundations/tools.html)

[Streaming](../../foundations/streaming.html)

[Getting Started](../../getting-started.html)

[Navigating the Library](../../getting-started/navigating-the-library.html)

[Next.js App Router](../../getting-started/nextjs-app-router.html)

[Next.js Pages Router](../../getting-started/nextjs-pages-router.html)

[Svelte](../../getting-started/svelte.html)

[Vue.js (Nuxt)](../../getting-started/nuxt.html)

[Node.js](../../getting-started/nodejs.html)

[Expo](../../getting-started/expo.html)

[Agents](../../agents.html)

[Agents](../../agents/overview.html)

[Building Agents](../../agents/building-agents.html)

[Workflow Patterns](../../agents/workflows.html)

[Loop Control](../../agents/loop-control.html)

[AI SDK Core](../../ai-sdk-core.html)

[Overview](../../ai-sdk-core/overview.html)

[Generating Text](../../ai-sdk-core/generating-text.html)

[Generating Structured Data](../../ai-sdk-core/generating-structured-data.html)

[Tool Calling](../../ai-sdk-core/tools-and-tool-calling.html)

[Model Context Protocol (MCP) Tools](../../ai-sdk-core/mcp-tools.html)

[Prompt Engineering](../../ai-sdk-core/prompt-engineering.html)

[Settings](../../ai-sdk-core/settings.html)

[Embeddings](../../ai-sdk-core/embeddings.html)

[Image Generation](../../ai-sdk-core/image-generation.html)

[Transcription](../../ai-sdk-core/transcription.html)

[Speech](../../ai-sdk-core/speech.html)

[Language Model Middleware](../../ai-sdk-core/middleware.html)

[Provider & Model Management](../../ai-sdk-core/provider-management.html)

[Error Handling](../../ai-sdk-core/error-handling.html)

[Testing](../../ai-sdk-core/testing.html)

[Telemetry](../../ai-sdk-core/telemetry.html)

[AI SDK UI](../../ai-sdk-ui.html)

[Overview](../../ai-sdk-ui/overview.html)

[Chatbot](../../ai-sdk-ui/chatbot.html)

[Chatbot Message Persistence](../../ai-sdk-ui/chatbot-message-persistence.html)

[Chatbot Resume Streams](../../ai-sdk-ui/chatbot-resume-streams.html)

[Chatbot Tool Usage](../../ai-sdk-ui/chatbot-tool-usage.html)

[Generative User Interfaces](../../ai-sdk-ui/generative-user-interfaces.html)

[Completion](../../ai-sdk-ui/completion.html)

[Object Generation](../../ai-sdk-ui/object-generation.html)

[Streaming Custom Data](../../ai-sdk-ui/streaming-data.html)

[Error Handling](../../ai-sdk-ui/error-handling.html)

[Transport](../../ai-sdk-ui/transport.html)

[Reading UIMessage Streams](../../ai-sdk-ui/reading-ui-message-streams.html)

[Message Metadata](../../ai-sdk-ui/message-metadata.html)

[Stream Protocols](../../ai-sdk-ui/stream-protocol.html)

[AI SDK RSC](../../ai-sdk-rsc.html)

[Advanced](../../advanced.html)

[Reference](../../reference.html)

[AI SDK Core](../ai-sdk-core.html)

[AI SDK UI](../ai-sdk-ui.html)

[useChat](use-chat.html)

[useCompletion](use-completion.html)

[useObject](use-object.html)

[convertToModelMessages](convert-to-model-messages.html)

[pruneMessages](prune-messages.html)

[createUIMessageStream](create-ui-message-stream.html)

[createUIMessageStreamResponse](create-ui-message-stream-response.html)

[pipeUIMessageStreamToResponse](pipe-ui-message-stream-to-response.html)

[readUIMessageStream](read-ui-message-stream.html)

[InferUITools](infer-ui-tools.html)

[InferUITool](infer-ui-tool.html)

[AI SDK RSC](../ai-sdk-rsc.html)

[Stream Helpers](../stream-helpers.html)

[AI SDK Errors](../ai-sdk-errors.html)

[Migration Guides](../../migration-guides.html)

[Troubleshooting](../../troubleshooting.html)

[AI SDK UI](../../ai-sdk-ui.html)convertToModelMessages

# [`convertToModelMessages()`](#converttomodelmessages)

The `convertToModelMessages` function is used to transform an array of UI messages from the `useChat` hook into an array of `ModelMessage` objects. These `ModelMessage` objects are compatible with AI core functions like `streamText`.

```ts
import { openai } from '@ai-sdk/openai';
import { convertToModelMessages, streamText } from 'ai';


export async function POST(req: Request) {
  const { messages } = await req.json();


  const result = streamText({
    model: openai('gpt-4o'),
    messages: convertToModelMessages(messages),
  });


  return result.toUIMessageStreamResponse();
}
```

## [Import](#import)

import { convertToModelMessages } from "ai"

## [API Signature](#api-signature)

### [Parameters](#parameters)

### messages:

Message\[\]

An array of UI messages from the useChat hook to be converted

### options:

{ tools?: ToolSet }

Optional configuration object. Provide tools to enable multi-modal tool responses.

### [Returns](#returns)

An array of [`ModelMessage`](../ai-sdk-core/model-message.html) objects.

### ModelMessage\[\]:

Array

An array of ModelMessage objects

## [Multi-modal Tool Responses](#multi-modal-tool-responses)

The `convertToModelMessages` function supports tools that can return multi-modal content. This is useful when tools need to return non-text content like images.

```ts
import { tool } from 'ai';
import { z } from 'zod';


const screenshotTool = tool({
  parameters: z.object({}),
  execute: async () => 'imgbase64',
  toModelOutput: result => [{ type: 'image', data: result }],
});


const result = streamText({
  model: openai('gpt-4'),
  messages: convertToModelMessages(messages, {
    tools: {
      screenshot: screenshotTool,
    },
  }),
});
```

Tools can implement the optional `toModelOutput` method to transform their results into multi-modal content. The content is an array of content parts, where each part has a `type` (e.g., 'text', 'image') and corresponding data.

[Previous

useObject

](use-object.html)

[Next

pruneMessages

](prune-messages.html)

On this page

[convertToModelMessages()](#converttomodelmessages)

[Import](#import)

[API Signature](#api-signature)

[Parameters](#parameters)

[Returns](#returns)

[Multi-modal Tool Responses](#multi-modal-tool-responses)

Deploy and Scale AI Apps with Vercel.

Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:

-   OpenAI
-   Photoroom
-   ![leonardo-ai Logo](../../../_next/logo-leonardo-ai-light.svg)![leonardo-ai Logo](../../../_next/logo-leonardo-ai-dark.svg)
-   ![zapier Logo](../../../_next/logo-zapier-light.svg)![zapier Logo](../../../_next/logo-zapier-dark.svg)

[](https://vercel.com/contact/sales?utm_source=ai_sdk&utm_medium=web&utm_campaign=contact_sales_cta&utm_content=talk_to_an_expert_sdk_docs)

#### Resources

[Docs](../../introduction.html)[Cookbook](../../../cookbook.html)[Providers](../../../providers/ai-sdk-providers.html)[Showcase](../../../showcase.html)[GitHub](https://github.com/vercel/ai)[Discussions](https://github.com/vercel/ai/discussions)

#### More

[Playground](../../../playground.html)[](https://v0.dev)[Contact Sales](https://vercel.com/contact/sales)

#### About Vercel

[Next.js + Vercel](https://vercel.com/frameworks/nextjs)[Open Source Software](https://vercel.com/oss)[GitHub](https://github.com/vercel)[X](https://x.com/vercel)

#### Legal

[Privacy Policy](https://vercel.com/legal/privacy-policy)

© 2025 Vercel, Inc.