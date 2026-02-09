AI SDK Core: Generating Text

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

[AI SDK Core](../ai-sdk-core.html)Generating Text

# [Generating and Streaming Text](#generating-and-streaming-text)

Large language models (LLMs) can generate text in response to a prompt, which can contain instructions and information to process. For example, you can ask a model to come up with a recipe, draft an email, or summarize a document.

The AI SDK Core provides two functions to generate text and stream it from LLMs:

-   [`generateText`](#generatetext): Generates text for a given prompt and model.
-   [`streamText`](#streamtext): Streams text from a given prompt and model.

Advanced LLM features such as [tool calling](tools-and-tool-calling.html) and [structured data generation](generating-structured-data.html) are built on top of text generation.

## [`generateText`](#generatetext)

You can generate text using the [`generateText`](../reference/ai-sdk-core/generate-text.html) function. This function is ideal for non-interactive use cases where you need to write text (e.g. drafting email or summarizing web pages) and for agents that use tools.

```tsx
import { generateText } from 'ai';


const { text } = await generateText({
  model: 'openai/gpt-4.1',
  prompt: 'Write a vegetarian lasagna recipe for 4 people.',
});
```

You can use more [advanced prompts](../foundations/prompts.html) to generate text with more complex instructions and content:

```tsx
import { generateText } from 'ai';


const { text } = await generateText({
  model: 'openai/gpt-4.1',
  system:
    'You are a professional writer. ' +
    'You write simple, clear, and concise content.',
  prompt: `Summarize the following article in 3-5 sentences: ${article}`,
});
```

The result object of `generateText` contains several promises that resolve when all required data is available:

-   `result.content`: The content that was generated in the last step.
-   `result.text`: The generated text.
-   `result.reasoning`: The full reasoning that the model has generated in the last step.
-   `result.reasoningText`: The reasoning text of the model (only available for some models).
-   `result.files`: The files that were generated in the last step.
-   `result.sources`: Sources that have been used as references in the last step (only available for some models).
-   `result.toolCalls`: The tool calls that were made in the last step.
-   `result.toolResults`: The results of the tool calls from the last step.
-   `result.finishReason`: The reason the model finished generating text.
-   `result.usage`: The usage of the model during the final step of text generation.
-   `result.totalUsage`: The total usage across all steps (for multi-step generations).
-   `result.warnings`: Warnings from the model provider (e.g. unsupported settings).
-   `result.request`: Additional request information.
-   `result.response`: Additional response information, including response messages and body.
-   `result.providerMetadata`: Additional provider-specific metadata.
-   `result.steps`: Details for all steps, useful for getting information about intermediate steps.
-   `result.experimental_output`: The generated structured output using the `experimental_output` specification.

### [Accessing response headers & body](#accessing-response-headers--body)

Sometimes you need access to the full response from the model provider, e.g. to access some provider-specific headers or body content.

You can access the raw response headers and body using the `response` property:

```ts
import { generateText } from 'ai';


const result = await generateText({
  // ...
});


console.log(JSON.stringify(result.response.headers, null, 2));
console.log(JSON.stringify(result.response.body, null, 2));
```

## [`streamText`](#streamtext)

Depending on your model and prompt, it can take a large language model (LLM) up to a minute to finish generating its response. This delay can be unacceptable for interactive use cases such as chatbots or real-time applications, where users expect immediate responses.

AI SDK Core provides the [`streamText`](../reference/ai-sdk-core/stream-text.html) function which simplifies streaming text from LLMs:

```ts
import { streamText } from 'ai';


const result = streamText({
  model: 'openai/gpt-4.1',
  prompt: 'Invent a new holiday and describe its traditions.',
});


// example: use textStream as an async iterable
for await (const textPart of result.textStream) {
  console.log(textPart);
}
```

`result.textStream` is both a `ReadableStream` and an `AsyncIterable`.

`streamText` immediately starts streaming and suppresses errors to prevent server crashes. Use the `onError` callback to log errors.

You can use `streamText` on its own or in combination with [AI SDK UI](../../cookbook/next/stream-text.html) and [AI SDK RSC](../../cookbook/rsc/stream-text.html). The result object contains several helper functions to make the integration into [AI SDK UI](../ai-sdk-ui.html) easier:

-   `result.toUIMessageStreamResponse()`: Creates a UI Message stream HTTP response (with tool calls etc.) that can be used in a Next.js App Router API route.
-   `result.pipeUIMessageStreamToResponse()`: Writes UI Message stream delta output to a Node.js response-like object.
-   `result.toTextStreamResponse()`: Creates a simple text stream HTTP response.
-   `result.pipeTextStreamToResponse()`: Writes text delta output to a Node.js response-like object.

`streamText` is using backpressure and only generates tokens as they are requested. You need to consume the stream in order for it to finish.

It also provides several promises that resolve when the stream is finished:

-   `result.content`: The content that was generated in the last step.
-   `result.text`: The generated text.
-   `result.reasoning`: The full reasoning that the model has generated.
-   `result.reasoningText`: The reasoning text of the model (only available for some models).
-   `result.files`: Files that have been generated by the model in the last step.
-   `result.sources`: Sources that have been used as references in the last step (only available for some models).
-   `result.toolCalls`: The tool calls that have been executed in the last step.
-   `result.toolResults`: The tool results that have been generated in the last step.
-   `result.finishReason`: The reason the model finished generating text.
-   `result.usage`: The usage of the model during the final step of text generation.
-   `result.totalUsage`: The total usage across all steps (for multi-step generations).
-   `result.warnings`: Warnings from the model provider (e.g. unsupported settings).
-   `result.steps`: Details for all steps, useful for getting information about intermediate steps.
-   `result.request`: Additional request information from the last step.
-   `result.response`: Additional response information from the last step.
-   `result.providerMetadata`: Additional provider-specific metadata from the last step.

### [`onError` callback](#onerror-callback)

`streamText` immediately starts streaming to enable sending data without waiting for the model. Errors become part of the stream and are not thrown to prevent e.g. servers from crashing.

To log errors, you can provide an `onError` callback that is triggered when an error occurs.

```tsx
import { streamText } from 'ai';


const result = streamText({
  model: 'openai/gpt-4.1',
  prompt: 'Invent a new holiday and describe its traditions.',
  onError({ error }) {
    console.error(error); // your error logging logic here
  },
});
```

### [`onChunk` callback](#onchunk-callback)

When using `streamText`, you can provide an `onChunk` callback that is triggered for each chunk of the stream.

It receives the following chunk types:

-   `text`
-   `reasoning`
-   `source`
-   `tool-call`
-   `tool-input-start`
-   `tool-input-delta`
-   `tool-result`
-   `raw`

```tsx
import { streamText } from 'ai';


const result = streamText({
  model: 'openai/gpt-4.1',
  prompt: 'Invent a new holiday and describe its traditions.',
  onChunk({ chunk }) {
    // implement your own logic here, e.g.:
    if (chunk.type === 'text') {
      console.log(chunk.text);
    }
  },
});
```

### [`onFinish` callback](#onfinish-callback)

When using `streamText`, you can provide an `onFinish` callback that is triggered when the stream is finished ( [API Reference](../reference/ai-sdk-core/stream-text.html#on-finish) ). It contains the text, usage information, finish reason, messages, steps, total usage, and more:

```tsx
import { streamText } from 'ai';


const result = streamText({
  model: 'openai/gpt-4.1',
  prompt: 'Invent a new holiday and describe its traditions.',
  onFinish({ text, finishReason, usage, response, steps, totalUsage }) {
    // your own logic, e.g. for saving the chat history or recording usage


    const messages = response.messages; // messages that were generated
  },
});
```

### [`fullStream` property](#fullstream-property)

You can read a stream with all events using the `fullStream` property. This can be useful if you want to implement your own UI or handle the stream in a different way. Here is an example of how to use the `fullStream` property:

```tsx
import { streamText } from 'ai';
import { z } from 'zod';


const result = streamText({
  model: 'openai/gpt-4.1',
  tools: {
    cityAttractions: {
      inputSchema: z.object({ city: z.string() }),
      execute: async ({ city }) => ({
        attractions: ['attraction1', 'attraction2', 'attraction3'],
      }),
    },
  },
  prompt: 'What are some San Francisco tourist attractions?',
});


for await (const part of result.fullStream) {
  switch (part.type) {
    case 'start': {
      // handle start of stream
      break;
    }
    case 'start-step': {
      // handle start of step
      break;
    }
    case 'text-start': {
      // handle text start
      break;
    }
    case 'text-delta': {
      // handle text delta here
      break;
    }
    case 'text-end': {
      // handle text end
      break;
    }
    case 'reasoning-start': {
      // handle reasoning start
      break;
    }
    case 'reasoning-delta': {
      // handle reasoning delta here
      break;
    }
    case 'reasoning-end': {
      // handle reasoning end
      break;
    }
    case 'source': {
      // handle source here
      break;
    }
    case 'file': {
      // handle file here
      break;
    }
    case 'tool-call': {
      switch (part.toolName) {
        case 'cityAttractions': {
          // handle tool call here
          break;
        }
      }
      break;
    }
    case 'tool-input-start': {
      // handle tool input start
      break;
    }
    case 'tool-input-delta': {
      // handle tool input delta
      break;
    }
    case 'tool-input-end': {
      // handle tool input end
      break;
    }
    case 'tool-result': {
      switch (part.toolName) {
        case 'cityAttractions': {
          // handle tool result here
          break;
        }
      }
      break;
    }
    case 'tool-error': {
      // handle tool error
      break;
    }
    case 'finish-step': {
      // handle finish step
      break;
    }
    case 'finish': {
      // handle finish here
      break;
    }
    case 'error': {
      // handle error here
      break;
    }
    case 'raw': {
      // handle raw value
      break;
    }
  }
}
```

### [Stream transformation](#stream-transformation)

You can use the `experimental_transform` option to transform the stream. This is useful for e.g. filtering, changing, or smoothing the text stream.

The transformations are applied before the callbacks are invoked and the promises are resolved. If you e.g. have a transformation that changes all text to uppercase, the `onFinish` callback will receive the transformed text.

#### [Smoothing streams](#smoothing-streams)

The AI SDK Core provides a [`smoothStream` function](../reference/ai-sdk-core/smooth-stream.html) that can be used to smooth out text streaming.

```tsx
import { smoothStream, streamText } from 'ai';


const result = streamText({
  model,
  prompt,
  experimental_transform: smoothStream(),
});
```

#### [Custom transformations](#custom-transformations)

You can also implement your own custom transformations. The transformation function receives the tools that are available to the model, and returns a function that is used to transform the stream. Tools can either be generic or limited to the tools that you are using.

Here is an example of how to implement a custom transformation that converts all text to uppercase:

```ts
const upperCaseTransform =
  <TOOLS extends ToolSet>() =>
  (options: { tools: TOOLS; stopStream: () => void }) =>
    new TransformStream<TextStreamPart<TOOLS>, TextStreamPart<TOOLS>>({
      transform(chunk, controller) {
        controller.enqueue(
          // for text chunks, convert the text to uppercase:
          chunk.type === 'text'
            ? { ...chunk, text: chunk.text.toUpperCase() }
            : chunk,
        );
      },
    });
```

You can also stop the stream using the `stopStream` function. This is e.g. useful if you want to stop the stream when model guardrails are violated, e.g. by generating inappropriate content.

When you invoke `stopStream`, it is important to simulate the `step-finish` and `finish` events to guarantee that a well-formed stream is returned and all callbacks are invoked.

```ts
const stopWordTransform =
  <TOOLS extends ToolSet>() =>
  ({ stopStream }: { stopStream: () => void }) =>
    new TransformStream<TextStreamPart<TOOLS>, TextStreamPart<TOOLS>>({
      // note: this is a simplified transformation for testing;
      // in a real-world version more there would need to be
      // stream buffering and scanning to correctly emit prior text
      // and to detect all STOP occurrences.
      transform(chunk, controller) {
        if (chunk.type !== 'text') {
          controller.enqueue(chunk);
          return;
        }


        if (chunk.text.includes('STOP')) {
          // stop the stream
          stopStream();


          // simulate the finish-step event
          controller.enqueue({
            type: 'finish-step',
            finishReason: 'stop',
            logprobs: undefined,
            usage: {
              completionTokens: NaN,
              promptTokens: NaN,
              totalTokens: NaN,
            },
            request: {},
            response: {
              id: 'response-id',
              modelId: 'mock-model-id',
              timestamp: new Date(0),
            },
            warnings: [],
            isContinued: false,
          });


          // simulate the finish event
          controller.enqueue({
            type: 'finish',
            finishReason: 'stop',
            logprobs: undefined,
            usage: {
              completionTokens: NaN,
              promptTokens: NaN,
              totalTokens: NaN,
            },
            response: {
              id: 'response-id',
              modelId: 'mock-model-id',
              timestamp: new Date(0),
            },
          });


          return;
        }


        controller.enqueue(chunk);
      },
    });
```

#### [Multiple transformations](#multiple-transformations)

You can also provide multiple transformations. They are applied in the order they are provided.

```tsx
const result = streamText({
  model,
  prompt,
  experimental_transform: [firstTransform, secondTransform],
});
```

## [Sources](#sources)

Some providers such as [Perplexity](../../providers/ai-sdk-providers/perplexity.html#sources) and [Google Generative AI](../../providers/ai-sdk-providers/google-generative-ai.html#sources) include sources in the response.

Currently sources are limited to web pages that ground the response. You can access them using the `sources` property of the result.

Each `url` source contains the following properties:

-   `id`: The ID of the source.
-   `url`: The URL of the source.
-   `title`: The optional title of the source.
-   `providerMetadata`: Provider metadata for the source.

When you use `generateText`, you can access the sources using the `sources` property:

```ts
const result = await generateText({
  model: google('gemini-2.5-flash'),
  tools: {
    google_search: google.tools.googleSearch({}),
  },
  prompt: 'List the top 5 San Francisco news from the past week.',
});


for (const source of result.sources) {
  if (source.sourceType === 'url') {
    console.log('ID:', source.id);
    console.log('Title:', source.title);
    console.log('URL:', source.url);
    console.log('Provider metadata:', source.providerMetadata);
    console.log();
  }
}
```

When you use `streamText`, you can access the sources using the `fullStream` property:

```tsx
const result = streamText({
  model: google('gemini-2.5-flash'),
  tools: {
    google_search: google.tools.googleSearch({}),
  },
  prompt: 'List the top 5 San Francisco news from the past week.',
});


for await (const part of result.fullStream) {
  if (part.type === 'source' && part.sourceType === 'url') {
    console.log('ID:', part.id);
    console.log('Title:', part.title);
    console.log('URL:', part.url);
    console.log('Provider metadata:', part.providerMetadata);
    console.log();
  }
}
```

The sources are also available in the `result.sources` promise.

## [Examples](#examples)

You can see `generateText` and `streamText` in action using various frameworks in the following examples:

### [`generateText`](#generatetext-1)

[

Learn to generate text in Node.js

](../../cookbook/node/generate-text.html)[

Learn to generate text in Next.js with Route Handlers (AI SDK UI)

](../../cookbook/next/generate-text.html)[

Learn to generate text in Next.js with Server Actions (AI SDK RSC)

](../../cookbook/rsc/generate-text.html)

### [`streamText`](#streamtext-1)

[

Learn to stream text in Node.js

](../../cookbook/node/stream-text.html)[

Learn to stream text in Next.js with Route Handlers (AI SDK UI)

](../../cookbook/next/stream-text.html)[

Learn to stream text in Next.js with Server Actions (AI SDK RSC)

](../../cookbook/rsc/stream-text.html)

[Previous

Overview

](overview.html)

[Next

Generating Structured Data

](generating-structured-data.html)

On this page

[Generating and Streaming Text](#generating-and-streaming-text)

[generateText](#generatetext)

[Accessing response headers & body](#accessing-response-headers--body)

[streamText](#streamtext)

[onError callback](#onerror-callback)

[onChunk callback](#onchunk-callback)

[onFinish callback](#onfinish-callback)

[fullStream property](#fullstream-property)

[Stream transformation](#stream-transformation)

[Smoothing streams](#smoothing-streams)

[Custom transformations](#custom-transformations)

[Multiple transformations](#multiple-transformations)

[Sources](#sources)

[Examples](#examples)

[generateText](#generatetext-1)

[streamText](#streamtext-1)

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