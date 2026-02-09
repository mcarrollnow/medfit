AI SDK Core: Language Model Middleware

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

[AI SDK Core](../ai-sdk-core.html)Language Model Middleware

# [Language Model Middleware](#language-model-middleware)

Language model middleware is a way to enhance the behavior of language models by intercepting and modifying the calls to the language model.

It can be used to add features like guardrails, RAG, caching, and logging in a language model agnostic way. Such middleware can be developed and distributed independently from the language models that they are applied to.

## [Using Language Model Middleware](#using-language-model-middleware)

You can use language model middleware with the `wrapLanguageModel` function. It takes a language model and a language model middleware and returns a new language model that incorporates the middleware.

```ts
import { wrapLanguageModel } from 'ai';


const wrappedLanguageModel = wrapLanguageModel({
  model: yourModel,
  middleware: yourLanguageModelMiddleware,
});
```

The wrapped language model can be used just like any other language model, e.g. in `streamText`:

```ts
const result = streamText({
  model: wrappedLanguageModel,
  prompt: 'What cities are in the United States?',
});
```

## [Multiple middlewares](#multiple-middlewares)

You can provide multiple middlewares to the `wrapLanguageModel` function. The middlewares will be applied in the order they are provided.

```ts
const wrappedLanguageModel = wrapLanguageModel({
  model: yourModel,
  middleware: [firstMiddleware, secondMiddleware],
});


// applied as: firstMiddleware(secondMiddleware(yourModel))
```

## [Built-in Middleware](#built-in-middleware)

The AI SDK comes with several built-in middlewares that you can use to configure language models:

-   `extractReasoningMiddleware`: Extracts reasoning information from the generated text and exposes it as a `reasoning` property on the result.
-   `simulateStreamingMiddleware`: Simulates streaming behavior with responses from non-streaming language models.
-   `defaultSettingsMiddleware`: Applies default settings to a language model.

### [Extract Reasoning](#extract-reasoning)

Some providers and models expose reasoning information in the generated text using special tags, e.g. <think> and </think>.

The `extractReasoningMiddleware` function can be used to extract this reasoning information and expose it as a `reasoning` property on the result.

```ts
import { wrapLanguageModel, extractReasoningMiddleware } from 'ai';


const model = wrapLanguageModel({
  model: yourModel,
  middleware: extractReasoningMiddleware({ tagName: 'think' }),
});
```

You can then use that enhanced model in functions like `generateText` and `streamText`.

The `extractReasoningMiddleware` function also includes a `startWithReasoning` option. When set to `true`, the reasoning tag will be prepended to the generated text. This is useful for models that do not include the reasoning tag at the beginning of the response. For more details, see the [DeepSeek R1 guide](../../cookbook/guides/r1.html#deepseek-r1-middleware).

### [Simulate Streaming](#simulate-streaming)

The `simulateStreamingMiddleware` function can be used to simulate streaming behavior with responses from non-streaming language models. This is useful when you want to maintain a consistent streaming interface even when using models that only provide complete responses.

```ts
import { wrapLanguageModel, simulateStreamingMiddleware } from 'ai';


const model = wrapLanguageModel({
  model: yourModel,
  middleware: simulateStreamingMiddleware(),
});
```

### [Default Settings](#default-settings)

The `defaultSettingsMiddleware` function can be used to apply default settings to a language model.

```ts
import { wrapLanguageModel, defaultSettingsMiddleware } from 'ai';


const model = wrapLanguageModel({
  model: yourModel,
  middleware: defaultSettingsMiddleware({
    settings: {
      temperature: 0.5,
      maxOutputTokens: 800,
      providerOptions: { openai: { store: false } },
    },
  }),
});
```

## [Community Middleware](#community-middleware)

The AI SDK provides a Language Model Middleware specification. Community members can develop middleware that adheres to this specification, making it compatible with the AI SDK ecosystem.

Here are some community middlewares that you can explore:

### [Custom tool call parser](#custom-tool-call-parser)

The [Custom tool call parser](https://github.com/minpeter/ai-sdk-tool-call-middleware) middleware extends tool call capabilities to models that don't natively support the OpenAI-style `tools` parameter. This includes many self-hosted and third-party models that lack native function calling features.

Using this middleware on models that support native function calls may result in unintended performance degradation, so check whether your model supports native function calls before deciding to use it.

This middleware enables function calling capabilities by converting function schemas into prompt instructions and parsing the model's responses into structured function calls. It works by transforming the JSON function definitions into natural language instructions the model can understand, then analyzing the generated text to extract function call attempts. This approach allows developers to use the same function calling API across different model providers, even with models that don't natively support the OpenAI-style function calling format, providing a consistent function calling experience regardless of the underlying model implementation.

The `@ai-sdk-tool/parser` package offers three middleware variants:

-   `createToolMiddleware`: A flexible function for creating custom tool call middleware tailored to specific models
-   `hermesToolMiddleware`: Ready-to-use middleware for Hermes & Qwen format function calls
-   `gemmaToolMiddleware`: Pre-configured middleware for Gemma 3 model series function call format

Here's how you can enable function calls with Gemma models that don't support them natively:

```ts
import { wrapLanguageModel } from 'ai';
import { gemmaToolMiddleware } from '@ai-sdk-tool/parser';


const model = wrapLanguageModel({
  model: openrouter('google/gemma-3-27b-it'),
  middleware: gemmaToolMiddleware,
});
```

Find more examples at this [link](https://github.com/minpeter/ai-sdk-tool-call-middleware/tree/main/examples/core/src).

## [Implementing Language Model Middleware](#implementing-language-model-middleware)

Implementing language model middleware is advanced functionality and requires a solid understanding of the [language model specification](https://github.com/vercel/ai/blob/v5/packages/provider/src/language-model/v2/language-model-v2.ts).

You can implement any of the following three function to modify the behavior of the language model:

1.  `transformParams`: Transforms the parameters before they are passed to the language model, for both `doGenerate` and `doStream`.
2.  `wrapGenerate`: Wraps the `doGenerate` method of the [language model](https://github.com/vercel/ai/blob/v5/packages/provider/src/language-model/v2/language-model-v2.ts). You can modify the parameters, call the language model, and modify the result.
3.  `wrapStream`: Wraps the `doStream` method of the [language model](https://github.com/vercel/ai/blob/v5/packages/provider/src/language-model/v2/language-model-v2.ts). You can modify the parameters, call the language model, and modify the result.

Here are some examples of how to implement language model middleware:

## [Examples](#examples)

These examples are not meant to be used in production. They are just to show how you can use middleware to enhance the behavior of language models.

### [Logging](#logging)

This example shows how to log the parameters and generated text of a language model call.

```ts
import type {
  LanguageModelV2Middleware,
  LanguageModelV2StreamPart,
} from '@ai-sdk/provider';


export const yourLogMiddleware: LanguageModelV2Middleware = {
  wrapGenerate: async ({ doGenerate, params }) => {
    console.log('doGenerate called');
    console.log(`params: ${JSON.stringify(params, null, 2)}`);


    const result = await doGenerate();


    console.log('doGenerate finished');
    console.log(`generated text: ${result.text}`);


    return result;
  },


  wrapStream: async ({ doStream, params }) => {
    console.log('doStream called');
    console.log(`params: ${JSON.stringify(params, null, 2)}`);


    const { stream, ...rest } = await doStream();


    let generatedText = '';
    const textBlocks = new Map<string, string>();


    const transformStream = new TransformStream<
      LanguageModelV2StreamPart,
      LanguageModelV2StreamPart
    >({
      transform(chunk, controller) {
        switch (chunk.type) {
          case 'text-start': {
            textBlocks.set(chunk.id, '');
            break;
          }
          case 'text-delta': {
            const existing = textBlocks.get(chunk.id) || '';
            textBlocks.set(chunk.id, existing + chunk.delta);
            generatedText += chunk.delta;
            break;
          }
          case 'text-end': {
            console.log(
              `Text block ${chunk.id} completed:`,
              textBlocks.get(chunk.id),
            );
            break;
          }
        }


        controller.enqueue(chunk);
      },


      flush() {
        console.log('doStream finished');
        console.log(`generated text: ${generatedText}`);
      },
    });


    return {
      stream: stream.pipeThrough(transformStream),
      ...rest,
    };
  },
};
```

### [Caching](#caching)

This example shows how to build a simple cache for the generated text of a language model call.

```ts
import type { LanguageModelV2Middleware } from '@ai-sdk/provider';


const cache = new Map<string, any>();


export const yourCacheMiddleware: LanguageModelV2Middleware = {
  wrapGenerate: async ({ doGenerate, params }) => {
    const cacheKey = JSON.stringify(params);


    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }


    const result = await doGenerate();


    cache.set(cacheKey, result);


    return result;
  },


  // here you would implement the caching logic for streaming
};
```

### [Retrieval Augmented Generation (RAG)](#retrieval-augmented-generation-rag)

This example shows how to use RAG as middleware.

Helper functions like `getLastUserMessageText` and `findSources` are not part of the AI SDK. They are just used in this example to illustrate the concept of RAG.

```ts
import type { LanguageModelV2Middleware } from '@ai-sdk/provider';


export const yourRagMiddleware: LanguageModelV2Middleware = {
  transformParams: async ({ params }) => {
    const lastUserMessageText = getLastUserMessageText({
      prompt: params.prompt,
    });


    if (lastUserMessageText == null) {
      return params; // do not use RAG (send unmodified parameters)
    }


    const instruction =
      'Use the following information to answer the question:\n' +
      findSources({ text: lastUserMessageText })
        .map(chunk => JSON.stringify(chunk))
        .join('\n');


    return addToLastUserMessage({ params, text: instruction });
  },
};
```

### [Guardrails](#guardrails)

Guard rails are a way to ensure that the generated text of a language model call is safe and appropriate. This example shows how to use guardrails as middleware.

```ts
import type { LanguageModelV2Middleware } from '@ai-sdk/provider';


export const yourGuardrailMiddleware: LanguageModelV2Middleware = {
  wrapGenerate: async ({ doGenerate }) => {
    const { text, ...rest } = await doGenerate();


    // filtering approach, e.g. for PII or other sensitive information:
    const cleanedText = text?.replace(/badword/g, '<REDACTED>');


    return { text: cleanedText, ...rest };
  },


  // here you would implement the guardrail logic for streaming
  // Note: streaming guardrails are difficult to implement, because
  // you do not know the full content of the stream until it's finished.
};
```

## [Configuring Per Request Custom Metadata](#configuring-per-request-custom-metadata)

To send and access custom metadata in Middleware, you can use `providerOptions`. This is useful when building logging middleware where you want to pass additional context like user IDs, timestamps, or other contextual data that can help with tracking and debugging.

```ts
import { openai } from '@ai-sdk/openai';
import { generateText, wrapLanguageModel } from 'ai';
import type { LanguageModelV2Middleware } from '@ai-sdk/provider';


export const yourLogMiddleware: LanguageModelV2Middleware = {
  wrapGenerate: async ({ doGenerate, params }) => {
    console.log('METADATA', params?.providerMetadata?.yourLogMiddleware);
    const result = await doGenerate();
    return result;
  },
};


const { text } = await generateText({
  model: wrapLanguageModel({
    model: openai('gpt-4o'),
    middleware: yourLogMiddleware,
  }),
  prompt: 'Invent a new holiday and describe its traditions.',
  providerOptions: {
    yourLogMiddleware: {
      hello: 'world',
    },
  },
});


console.log(text);
```

[Previous

Speech

](speech.html)

[Next

Provider & Model Management

](provider-management.html)

On this page

[Language Model Middleware](#language-model-middleware)

[Using Language Model Middleware](#using-language-model-middleware)

[Multiple middlewares](#multiple-middlewares)

[Built-in Middleware](#built-in-middleware)

[Extract Reasoning](#extract-reasoning)

[Simulate Streaming](#simulate-streaming)

[Default Settings](#default-settings)

[Community Middleware](#community-middleware)

[Custom tool call parser](#custom-tool-call-parser)

[Implementing Language Model Middleware](#implementing-language-model-middleware)

[Examples](#examples)

[Logging](#logging)

[Caching](#caching)

[Retrieval Augmented Generation (RAG)](#retrieval-augmented-generation-rag)

[Guardrails](#guardrails)

[Configuring Per Request Custom Metadata](#configuring-per-request-custom-metadata)

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