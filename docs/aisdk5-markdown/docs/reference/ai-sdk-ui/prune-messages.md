AI SDK UI: pruneMessages

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

[AI SDK UI](../../ai-sdk-ui.html)pruneMessages

# [`pruneMessages()`](#prunemessages)

The `pruneMessages` function is used to prune or filter an array of `ModelMessage` objects. This is useful for reducing message context (to save tokens), removing intermediate reasoning, or trimming tool calls and empty messages before sending to an LLM.

```ts
import { pruneMessages, streamText } from 'ai';


export async function POST(req: Request) {
  const { messages } = await req.json();


  const prunedMessages = pruneMessages({
    messages,
    reasoning: 'before-last-message',
    toolCalls: 'before-last-2-messages',
    emptyMessages: 'remove',
  });


  const result = streamText({
    model: 'openai/gpt-4o',
    messages: prunedMessages,
  });


  return result.toUIMessageStreamResponse();
}
```

## [Import](#import)

import { pruneMessages } from "ai"

## [API Signature](#api-signature)

### [Parameters](#parameters)

### messages:

ModelMessage\[\]

An array of ModelMessage objects to prune.

### reasoning:

'all' | 'before-last-message' | 'none'

How to remove reasoning content from assistant messages. Default: "none".

### toolCalls:

'all' | 'before-last-message' | 'before-last-${number}-messages' | 'none' | PruneToolCallsOption\[\]

How to prune tool call/results/approval content. Can specify strategy or a list with tools.

### emptyMessages:

'keep' | 'remove'

Whether to keep or remove messages whose content is empty after pruning. Default: "remove".

### [Returns](#returns)

An array of [`ModelMessage`](../ai-sdk-core/model-message.html) objects, pruned according to the provided options.

### ModelMessage\[\]:

Array

The pruned list of ModelMessage objects

## [Example Usage](#example-usage)

```ts
import { pruneMessages } from 'ai';


const pruned = pruneMessages({
  messages,
  reasoning: 'all', // Remove all reasoning parts
  toolCalls: 'before-last-message', // Remove tool calls except those in the last message
});
```

## [Pruning Options](#pruning-options)

-   **reasoning:** Removes reasoning parts from assistant messages. Use `'all'` to remove all, `'before-last-message'` to keep reasoning in the last message, or `'none'` to retain all reasoning.
-   **toolCalls:** Prune tool-call, tool-result, and tool-approval chunks from assistant/tool messages. Options include:
    -   `'all'`: Prune all such content.
    -   `'before-last-message'`: Prune except in the last message.
    -   `before-last-N-messages`: Prune except in the last N messages.
    -   `'none'`: Do not prune.
    -   Or provide an array for per-tool fine control.
-   **emptyMessages:** Set to `'remove'` (default) to exclude messages that have no content after pruning.

> **Tip**: `pruneMessages` is typically used prior to sending a context window to an LLM to reduce message/token count, especially after a series of tool-calls and approvals.

For advanced usage and the full list of possible message parts, see [`ModelMessage`](../ai-sdk-core/model-message.html) and [`pruneMessages` implementation](https://github.com/vercel/ai/blob/main/packages/ai/src/generate-text/prune-messages.ts).

[Previous

convertToModelMessages

](convert-to-model-messages.html)

[Next

createUIMessageStream

](create-ui-message-stream.html)

On this page

[pruneMessages()](#prunemessages)

[Import](#import)

[API Signature](#api-signature)

[Parameters](#parameters)

[Returns](#returns)

[Example Usage](#example-usage)

[Pruning Options](#pruning-options)

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