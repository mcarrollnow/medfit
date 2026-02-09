AI SDK Core: Error Handling

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

[Overview](overview.html)

[Generating Text](generating-text.html)

[Generating Structured Data](generating-structured-data.html)

[Tool Calling](tools-and-tool-calling.html)

[Model Context Protocol (MCP) Tools](mcp-tools.html)

[Prompt Engineering](prompt-engineering.html)

[Settings](settings.html)

[Embeddings](embeddings.html)

[Image Generation](image-generation.html)

[Transcription](transcription.html)

[Speech](speech.html)

[Language Model Middleware](middleware.html)

[Provider & Model Management](provider-management.html)

[Error Handling](error-handling.html)

[Testing](testing.html)

[Telemetry](telemetry.html)

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

[Advanced](../advanced.html)

[Reference](../reference.html)

[AI SDK Core](../reference/ai-sdk-core.html)

[AI SDK UI](../reference/ai-sdk-ui.html)

[AI SDK RSC](../reference/ai-sdk-rsc.html)

[Stream Helpers](../reference/stream-helpers.html)

[AI SDK Errors](../reference/ai-sdk-errors.html)

[Migration Guides](../migration-guides.html)

[Troubleshooting](../troubleshooting.html)

[AI SDK Core](../ai-sdk-core.html)Error Handling

# [Error Handling](#error-handling)

## [Handling regular errors](#handling-regular-errors)

Regular errors are thrown and can be handled using the `try/catch` block.

```ts
import { generateText } from 'ai';


try {
  const { text } = await generateText({
    model: 'openai/gpt-4.1',
    prompt: 'Write a vegetarian lasagna recipe for 4 people.',
  });
} catch (error) {
  // handle error
}
```

See [Error Types](../reference/ai-sdk-errors.html) for more information on the different types of errors that may be thrown.

## [Handling streaming errors (simple streams)](#handling-streaming-errors-simple-streams)

When errors occur during streams that do not support error chunks, the error is thrown as a regular error. You can handle these errors using the `try/catch` block.

```ts
import { generateText } from 'ai';


try {
  const { textStream } = streamText({
    model: 'openai/gpt-4.1',
    prompt: 'Write a vegetarian lasagna recipe for 4 people.',
  });


  for await (const textPart of textStream) {
    process.stdout.write(textPart);
  }
} catch (error) {
  // handle error
}
```

## [Handling streaming errors (streaming with `error` support)](#handling-streaming-errors-streaming-with-error-support)

Full streams support error parts. You can handle those parts similar to other parts. It is recommended to also add a try-catch block for errors that happen outside of the streaming.

```ts
import { generateText } from 'ai';


try {
  const { fullStream } = streamText({
    model: 'openai/gpt-4.1',
    prompt: 'Write a vegetarian lasagna recipe for 4 people.',
  });


  for await (const part of fullStream) {
    switch (part.type) {
      // ... handle other part types


      case 'error': {
        const error = part.error;
        // handle error
        break;
      }


      case 'abort': {
        // handle stream abort
        break;
      }


      case 'tool-error': {
        const error = part.error;
        // handle error
        break;
      }
    }
  }
} catch (error) {
  // handle error
}
```

## [Handling stream aborts](#handling-stream-aborts)

When streams are aborted (e.g., via chat stop button), you may want to perform cleanup operations like updating stored messages in your UI. Use the `onAbort` callback to handle these cases.

The `onAbort` callback is called when a stream is aborted via `AbortSignal`, but `onFinish` is not called. This ensures you can still update your UI state appropriately.

```ts
import { streamText } from 'ai';


const { textStream } = streamText({
  model: 'openai/gpt-4.1',
  prompt: 'Write a vegetarian lasagna recipe for 4 people.',
  onAbort: ({ steps }) => {
    // Update stored messages or perform cleanup
    console.log('Stream aborted after', steps.length, 'steps');
  },
  onFinish: ({ steps, totalUsage }) => {
    // This is called on normal completion
    console.log('Stream completed normally');
  },
});


for await (const textPart of textStream) {
  process.stdout.write(textPart);
}
```

The `onAbort` callback receives:

-   `steps`: An array of all completed steps before the abort

You can also handle abort events directly in the stream:

```ts
import { streamText } from 'ai';


const { fullStream } = streamText({
  model: 'openai/gpt-4.1',
  prompt: 'Write a vegetarian lasagna recipe for 4 people.',
});


for await (const chunk of fullStream) {
  switch (chunk.type) {
    case 'abort': {
      // Handle abort directly in stream
      console.log('Stream was aborted');
      break;
    }
    // ... handle other part types
  }
}
```

[Previous

Provider & Model Management

](provider-management.html)

[Next

Testing

](testing.html)

On this page

[Error Handling](#error-handling)

[Handling regular errors](#handling-regular-errors)

[Handling streaming errors (simple streams)](#handling-streaming-errors-simple-streams)

[Handling streaming errors (streaming with error support)](#handling-streaming-errors-streaming-with-error-support)

[Handling stream aborts](#handling-stream-aborts)

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