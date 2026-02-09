AI SDK UI: createUIMessageStream

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

[AI SDK UI](../../ai-sdk-ui.html)createUIMessageStream

# [`createUIMessageStream`](#createuimessagestream)

The `createUIMessageStream` function allows you to create a readable stream for UI messages with advanced features like message merging, error handling, and finish callbacks.

## [Import](#import)

import { createUIMessageStream } from "ai"

## [Example](#example)

```tsx
const existingMessages: UIMessage[] = [
  /* ... */
];


const stream = createUIMessageStream({
  async execute({ writer }) {
    // Start a text message
    // Note: The id must be consistent across text-start, text-delta, and text-end steps
    // This allows the system to correctly identify they belong to the same text block
    writer.write({
      type: 'text-start',
      id: 'example-text',
    });


    // Write a message chunk
    writer.write({
      type: 'text-delta',
      id: 'example-text',
      delta: 'Hello',
    });


    // End the text message
    writer.write({
      type: 'text-end',
      id: 'example-text',
    });


    // Merge another stream from streamText
    const result = streamText({
      model: openai('gpt-4o'),
      prompt: 'Write a haiku about AI',
    });


    writer.merge(result.toUIMessageStream());
  },
  onError: error => `Custom error: ${error.message}`,
  originalMessages: existingMessages,
  onFinish: ({ messages, isContinuation, responseMessage }) => {
    console.log('Stream finished with messages:', messages);
  },
});
```

## [API Signature](#api-signature)

### [Parameters](#parameters)

### execute:

(options: { writer: UIMessageStreamWriter }) => Promise<void> | void

A function that receives a writer instance and can use it to write UI message chunks to the stream.

UIMessageStreamWriter

### write:

(part: UIMessageChunk) => void

Writes a UI message chunk to the stream.

### merge:

(stream: ReadableStream<UIMessageChunk>) => void

Merges the contents of another UI message stream into this stream.

### onError:

(error: unknown) => string

Error handler that is used by the stream writer for handling errors in merged streams.

### onError:

(error: unknown) => string

A function that handles errors and returns an error message string. By default, it returns the error message.

### originalMessages:

UIMessage\[\] | undefined

The original messages. If provided, persistence mode is assumed and a message ID is provided for the response message.

### onFinish:

(options: { messages: UIMessage\[\]; isContinuation: boolean; responseMessage: UIMessage }) => void | undefined

A callback function that is called when the stream finishes.

FinishOptions

### messages:

UIMessage\[\]

The updated list of UI messages.

### isContinuation:

boolean

Indicates whether the response message is a continuation of the last original message, or if a new message was created.

### responseMessage:

UIMessage

The message that was sent to the client as a response (including the original message if it was extended).

### generateId:

IdGenerator | undefined

A function to generate unique IDs for messages. Uses the default ID generator if not provided.

### [Returns](#returns)

`ReadableStream<UIMessageChunk>`

A readable stream that emits UI message chunks. The stream automatically handles error propagation, merging of multiple streams, and proper cleanup when all operations are complete.

[Previous

pruneMessages

](prune-messages.html)

[Next

createUIMessageStreamResponse

](create-ui-message-stream-response.html)

On this page

[createUIMessageStream](#createuimessagestream)

[Import](#import)

[Example](#example)

[API Signature](#api-signature)

[Parameters](#parameters)

[Returns](#returns)

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