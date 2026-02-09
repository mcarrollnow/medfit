AI SDK Core: Generating Structured Data

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

[AI SDK Core](../ai-sdk-core.html)Generating Structured Data

# [Generating Structured Data](#generating-structured-data)

While text generation can be useful, your use case will likely call for generating structured data. For example, you might want to extract information from text, classify data, or generate synthetic data.

Many language models are capable of generating structured data, often defined as using "JSON modes" or "tools". However, you need to manually provide schemas and then validate the generated data as LLMs can produce incorrect or incomplete structured data.

The AI SDK standardises structured object generation across model providers with the [`generateObject`](../reference/ai-sdk-core/generate-object.html) and [`streamObject`](../reference/ai-sdk-core/stream-object.html) functions. You can use both functions with different output strategies, e.g. `array`, `object`, `enum`, or `no-schema`, and with different generation modes, e.g. `auto`, `tool`, or `json`. You can use [Zod schemas](../reference/ai-sdk-core/zod-schema.html), [Valibot](../reference/ai-sdk-core/valibot-schema.html), or [JSON schemas](../reference/ai-sdk-core/json-schema.html) to specify the shape of the data that you want, and the AI model will generate data that conforms to that structure.

You can pass Zod objects directly to the AI SDK functions or use the `zodSchema` helper function.

## [Generate Object](#generate-object)

The `generateObject` generates structured data from a prompt. The schema is also used to validate the generated data, ensuring type safety and correctness.

```ts
import { generateObject } from 'ai';
import { z } from 'zod';


const { object } = await generateObject({
  model: 'openai/gpt-4.1',
  schema: z.object({
    recipe: z.object({
      name: z.string(),
      ingredients: z.array(z.object({ name: z.string(), amount: z.string() })),
      steps: z.array(z.string()),
    }),
  }),
  prompt: 'Generate a lasagna recipe.',
});
```

See `generateObject` in action with [these examples](#more-examples)

### [Accessing response headers & body](#accessing-response-headers--body)

Sometimes you need access to the full response from the model provider, e.g. to access some provider-specific headers or body content.

You can access the raw response headers and body using the `response` property:

```ts
import { generateObject } from 'ai';


const result = await generateObject({
  // ...
});


console.log(JSON.stringify(result.response.headers, null, 2));
console.log(JSON.stringify(result.response.body, null, 2));
```

## [Stream Object](#stream-object)

Given the added complexity of returning structured data, model response time can be unacceptable for your interactive use case. With the [`streamObject`](../reference/ai-sdk-core/stream-object.html) function, you can stream the model's response as it is generated.

```ts
import { streamObject } from 'ai';


const { partialObjectStream } = streamObject({
  // ...
});


// use partialObjectStream as an async iterable
for await (const partialObject of partialObjectStream) {
  console.log(partialObject);
}
```

You can use `streamObject` to stream generated UIs in combination with React Server Components (see [Generative UI](../ai-sdk-rsc.html))) or the [`useObject`](../reference/ai-sdk-ui/use-object.html) hook.

See `streamObject` in action with [these examples](#more-examples)

### [`onError` callback](#onerror-callback)

`streamObject` immediately starts streaming. Errors become part of the stream and are not thrown to prevent e.g. servers from crashing.

To log errors, you can provide an `onError` callback that is triggered when an error occurs.

```tsx
import { streamObject } from 'ai';


const result = streamObject({
  // ...
  onError({ error }) {
    console.error(error); // your error logging logic here
  },
});
```

## [Output Strategy](#output-strategy)

You can use both functions with different output strategies, e.g. `array`, `object`, `enum`, or `no-schema`.

### [Object](#object)

The default output strategy is `object`, which returns the generated data as an object. You don't need to specify the output strategy if you want to use the default.

### [Array](#array)

If you want to generate an array of objects, you can set the output strategy to `array`. When you use the `array` output strategy, the schema specifies the shape of an array element. With `streamObject`, you can also stream the generated array elements using `elementStream`.

```ts
import { openai } from '@ai-sdk/openai';
import { streamObject } from 'ai';
import { z } from 'zod';


const { elementStream } = streamObject({
  model: openai('gpt-4.1'),
  output: 'array',
  schema: z.object({
    name: z.string(),
    class: z
      .string()
      .describe('Character class, e.g. warrior, mage, or thief.'),
    description: z.string(),
  }),
  prompt: 'Generate 3 hero descriptions for a fantasy role playing game.',
});


for await (const hero of elementStream) {
  console.log(hero);
}
```

### [Enum](#enum)

If you want to generate a specific enum value, e.g. for classification tasks, you can set the output strategy to `enum` and provide a list of possible values in the `enum` parameter.

Enum output is only available with `generateObject`.

```ts
import { generateObject } from 'ai';


const { object } = await generateObject({
  model: 'openai/gpt-4.1',
  output: 'enum',
  enum: ['action', 'comedy', 'drama', 'horror', 'sci-fi'],
  prompt:
    'Classify the genre of this movie plot: ' +
    '"A group of astronauts travel through a wormhole in search of a ' +
    'new habitable planet for humanity."',
});
```

### [No Schema](#no-schema)

In some cases, you might not want to use a schema, for example when the data is a dynamic user request. You can use the `output` setting to set the output format to `no-schema` in those cases and omit the schema parameter.

```ts
import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';


const { object } = await generateObject({
  model: openai('gpt-4.1'),
  output: 'no-schema',
  prompt: 'Generate a lasagna recipe.',
});
```

## [Schema Name and Description](#schema-name-and-description)

You can optionally specify a name and description for the schema. These are used by some providers for additional LLM guidance, e.g. via tool or schema name.

```ts
import { generateObject } from 'ai';
import { z } from 'zod';


const { object } = await generateObject({
  model: 'openai/gpt-4.1',
  schemaName: 'Recipe',
  schemaDescription: 'A recipe for a dish.',
  schema: z.object({
    name: z.string(),
    ingredients: z.array(z.object({ name: z.string(), amount: z.string() })),
    steps: z.array(z.string()),
  }),
  prompt: 'Generate a lasagna recipe.',
});
```

## [Accessing Reasoning](#accessing-reasoning)

You can access the reasoning used by the language model to generate the object via the `reasoning` property on the result. This property contains a string with the model's thought process, if available.

```ts
import { openai, OpenAIResponsesProviderOptions } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';


const result = await generateObject({
  model: openai('gpt-5'),
  schema: z.object({
    recipe: z.object({
      name: z.string(),
      ingredients: z.array(
        z.object({
          name: z.string(),
          amount: z.string(),
        }),
      ),
      steps: z.array(z.string()),
    }),
  }),
  prompt: 'Generate a lasagna recipe.',
  providerOptions: {
    openai: {
      strictJsonSchema: true,
      reasoningSummary: 'detailed',
    } satisfies OpenAIResponsesProviderOptions,
  },
});


console.log(result.reasoning);
```

## [Error Handling](#error-handling)

When `generateObject` cannot generate a valid object, it throws a [`AI_NoObjectGeneratedError`](../reference/ai-sdk-errors/ai-no-object-generated-error.html).

This error occurs when the AI provider fails to generate a parsable object that conforms to the schema. It can arise due to the following reasons:

-   The model failed to generate a response.
-   The model generated a response that could not be parsed.
-   The model generated a response that could not be validated against the schema.

The error preserves the following information to help you log the issue:

-   `text`: The text that was generated by the model. This can be the raw text or the tool call text, depending on the object generation mode.
-   `response`: Metadata about the language model response, including response id, timestamp, and model.
-   `usage`: Request token usage.
-   `cause`: The cause of the error (e.g. a JSON parsing error). You can use this for more detailed error handling.

```ts
import { generateObject, NoObjectGeneratedError } from 'ai';


try {
  await generateObject({ model, schema, prompt });
} catch (error) {
  if (NoObjectGeneratedError.isInstance(error)) {
    console.log('NoObjectGeneratedError');
    console.log('Cause:', error.cause);
    console.log('Text:', error.text);
    console.log('Response:', error.response);
    console.log('Usage:', error.usage);
  }
}
```

## [Repairing Invalid or Malformed JSON](#repairing-invalid-or-malformed-json)

The `repairText` function is experimental and may change in the future.

Sometimes the model will generate invalid or malformed JSON. You can use the `repairText` function to attempt to repair the JSON.

It receives the error, either a `JSONParseError` or a `TypeValidationError`, and the text that was generated by the model. You can then attempt to repair the text and return the repaired text.

```ts
import { generateObject } from 'ai';


const { object } = await generateObject({
  model,
  schema,
  prompt,
  experimental_repairText: async ({ text, error }) => {
    // example: add a closing brace to the text
    return text + '}';
  },
});
```

## [Structured outputs with `generateText` and `streamText`](#structured-outputs-with-generatetext-and-streamtext)

You can generate structured data with `generateText` and `streamText` by using the `experimental_output` setting.

Some models, e.g. those by OpenAI, support structured outputs and tool calling at the same time. This is only possible with `generateText` and `streamText`.

Structured output generation with `generateText` and `streamText` is experimental and may change in the future.

### [`generateText`](#generatetext)

```ts
// experimental_output is a structured object that matches the schema:
const { experimental_output } = await generateText({
  // ...
  experimental_output: Output.object({
    schema: z.object({
      name: z.string(),
      age: z.number().nullable().describe('Age of the person.'),
      contact: z.object({
        type: z.literal('email'),
        value: z.string(),
      }),
      occupation: z.object({
        type: z.literal('employed'),
        company: z.string(),
        position: z.string(),
      }),
    }),
  }),
  prompt: 'Generate an example person for testing.',
});
```

### [`streamText`](#streamtext)

```ts
// experimental_partialOutputStream contains generated partial objects:
const { experimental_partialOutputStream } = await streamText({
  // ...
  experimental_output: Output.object({
    schema: z.object({
      name: z.string(),
      age: z.number().nullable().describe('Age of the person.'),
      contact: z.object({
        type: z.literal('email'),
        value: z.string(),
      }),
      occupation: z.object({
        type: z.literal('employed'),
        company: z.string(),
        position: z.string(),
      }),
    }),
  }),
  prompt: 'Generate an example person for testing.',
});
```

## [More Examples](#more-examples)

You can see `generateObject` and `streamObject` in action using various frameworks in the following examples:

### [`generateObject`](#generateobject)

[

Learn to generate objects in Node.js

](../../cookbook/node/generate-object.html)[

Learn to generate objects in Next.js with Route Handlers (AI SDK UI)

](../../cookbook/next/generate-object.html)[

Learn to generate objects in Next.js with Server Actions (AI SDK RSC)

](../../cookbook/rsc/generate-object.html)

### [`streamObject`](#streamobject)

[

Learn to stream objects in Node.js

](../../cookbook/node/stream-object.html)[

Learn to stream objects in Next.js with Route Handlers (AI SDK UI)

](../../cookbook/next/stream-object.html)[

Learn to stream objects in Next.js with Server Actions (AI SDK RSC)

](../../cookbook/rsc/stream-object.html)

[Previous

Generating Text

](generating-text.html)

[Next

Tool Calling

](tools-and-tool-calling.html)

On this page

[Generating Structured Data](#generating-structured-data)

[Generate Object](#generate-object)

[Accessing response headers & body](#accessing-response-headers--body)

[Stream Object](#stream-object)

[onError callback](#onerror-callback)

[Output Strategy](#output-strategy)

[Object](#object)

[Array](#array)

[Enum](#enum)

[No Schema](#no-schema)

[Schema Name and Description](#schema-name-and-description)

[Accessing Reasoning](#accessing-reasoning)

[Error Handling](#error-handling)

[Repairing Invalid or Malformed JSON](#repairing-invalid-or-malformed-json)

[Structured outputs with generateText and streamText](#structured-outputs-with-generatetext-and-streamtext)

[generateText](#generatetext)

[streamText](#streamtext)

[More Examples](#more-examples)

[generateObject](#generateobject)

[streamObject](#streamobject)

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