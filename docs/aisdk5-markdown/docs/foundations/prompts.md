Foundations: Prompts

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

[Overview](overview.html)

[Providers and Models](providers-and-models.html)

[Prompts](prompts.html)

[Tools](tools.html)

[Streaming](streaming.html)

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

[Advanced](../advanced.html)

[Reference](../reference.html)

[AI SDK Core](../reference/ai-sdk-core.html)

[AI SDK UI](../reference/ai-sdk-ui.html)

[AI SDK RSC](../reference/ai-sdk-rsc.html)

[Stream Helpers](../reference/stream-helpers.html)

[AI SDK Errors](../reference/ai-sdk-errors.html)

[Migration Guides](../migration-guides.html)

[Troubleshooting](../troubleshooting.html)

[Foundations](../foundations.html)Prompts

# [Prompts](#prompts)

Prompts are instructions that you give a [large language model (LLM)](overview.html#large-language-models) to tell it what to do. It's like when you ask someone for directions; the clearer your question, the better the directions you'll get.

Many LLM providers offer complex interfaces for specifying prompts. They involve different roles and message types. While these interfaces are powerful, they can be hard to use and understand.

In order to simplify prompting, the AI SDK supports text, message, and system prompts.

## [Text Prompts](#text-prompts)

Text prompts are strings. They are ideal for simple generation use cases, e.g. repeatedly generating content for variants of the same prompt text.

You can set text prompts using the `prompt` property made available by AI SDK functions like [`streamText`](../reference/ai-sdk-core/stream-text.html) or [`generateObject`](../reference/ai-sdk-core/generate-object.html). You can structure the text in any way and inject variables, e.g. using a template literal.

```ts
const result = await generateText({
  model: 'openai/gpt-4.1',
  prompt: 'Invent a new holiday and describe its traditions.',
});
```

You can also use template literals to provide dynamic data to your prompt.

```ts
const result = await generateText({
  model: 'openai/gpt-4.1',
  prompt:
    `I am planning a trip to ${destination} for ${lengthOfStay} days. ` +
    `Please suggest the best tourist activities for me to do.`,
});
```

## [System Prompts](#system-prompts)

System prompts are the initial set of instructions given to models that help guide and constrain the models' behaviors and responses. You can set system prompts using the `system` property. System prompts work with both the `prompt` and the `messages` properties.

```ts
const result = await generateText({
  model: 'openai/gpt-4.1',
  system:
    `You help planning travel itineraries. ` +
    `Respond to the users' request with a list ` +
    `of the best stops to make in their destination.`,
  prompt:
    `I am planning a trip to ${destination} for ${lengthOfStay} days. ` +
    `Please suggest the best tourist activities for me to do.`,
});
```

When you use a message prompt, you can also use system messages instead of a system prompt.

## [Message Prompts](#message-prompts)

A message prompt is an array of user, assistant, and tool messages. They are great for chat interfaces and more complex, multi-modal prompts. You can use the `messages` property to set message prompts.

Each message has a `role` and a `content` property. The content can either be text (for user and assistant messages), or an array of relevant parts (data) for that message type.

```ts
const result = await generateText({
  model: 'openai/gpt-4.1',
  messages: [
    { role: 'user', content: 'Hi!' },
    { role: 'assistant', content: 'Hello, how can I help?' },
    { role: 'user', content: 'Where can I buy the best Currywurst in Berlin?' },
  ],
});
```

Instead of sending a text in the `content` property, you can send an array of parts that includes a mix of text and other content parts.

Not all language models support all message and content types. For example, some models might not be capable of handling multi-modal inputs or tool messages. [Learn more about the capabilities of select models](providers-and-models.html#model-capabilities).

### [Provider Options](#provider-options)

You can pass through additional provider-specific metadata to enable provider-specific functionality at 3 levels.

#### [Function Call Level](#function-call-level)

Functions like [`streamText`](../reference/ai-sdk-core/stream-text.html#provider-options) or [`generateText`](../reference/ai-sdk-core/generate-text.html#provider-options) accept a `providerOptions` property.

Adding provider options at the function call level should be used when you do not need granular control over where the provider options are applied.

```ts
const { text } = await generateText({
  model: azure('your-deployment-name'),
  providerOptions: {
    openai: {
      reasoningEffort: 'low',
    },
  },
});
```

#### [Message Level](#message-level)

For granular control over applying provider options at the message level, you can pass `providerOptions` to the message object:

```ts
import { ModelMessage } from 'ai';


const messages: ModelMessage[] = [
  {
    role: 'system',
    content: 'Cached system message',
    providerOptions: {
      // Sets a cache control breakpoint on the system message
      anthropic: { cacheControl: { type: 'ephemeral' } },
    },
  },
];
```

#### [Message Part Level](#message-part-level)

Certain provider-specific options require configuration at the message part level:

```ts
import { ModelMessage } from 'ai';


const messages: ModelMessage[] = [
  {
    role: 'user',
    content: [
      {
        type: 'text',
        text: 'Describe the image in detail.',
        providerOptions: {
          openai: { imageDetail: 'low' },
        },
      },
      {
        type: 'image',
        image:
          'https://github.com/vercel/ai/blob/main/examples/ai-core/data/comic-cat.png?raw=true',
        // Sets image detail configuration for image part:
        providerOptions: {
          openai: { imageDetail: 'low' },
        },
      },
    ],
  },
];
```

AI SDK UI hooks like [`useChat`](../reference/ai-sdk-ui/use-chat.html) return arrays of `UIMessage` objects, which do not support provider options. We recommend using the [`convertToModelMessages`](https://ai-sdk.dev/docs/reference/ai-sdk-ui/convert-to-core-messages) function to convert `UIMessage` objects to [`ModelMessage`](../reference/ai-sdk-core/model-message.html) objects before applying or appending message(s) or message parts with `providerOptions`.

### [User Messages](#user-messages)

#### [Text Parts](#text-parts)

Text content is the most common type of content. It is a string that is passed to the model.

If you only need to send text content in a message, the `content` property can be a string, but you can also use it to send multiple content parts.

```ts
const result = await generateText({
  model: 'openai/gpt-4.1',
  messages: [
    {
      role: 'user',
      content: [
        {
          type: 'text',
          text: 'Where can I buy the best Currywurst in Berlin?',
        },
      ],
    },
  ],
});
```

#### [Image Parts](#image-parts)

User messages can include image parts. An image can be one of the following:

-   base64-encoded image:
    -   `string` with base-64 encoded content
    -   data URL `string`, e.g. `data:image/png;base64,...`
-   binary image:
    -   `ArrayBuffer`
    -   `Uint8Array`
    -   `Buffer`
-   URL:
    -   http(s) URL `string`, e.g. `https://example.com/image.png`
    -   `URL` object, e.g. `new URL('https://example.com/image.png')`

##### [Example: Binary image (Buffer)](#example-binary-image-buffer)

```ts
const result = await generateText({
  model,
  messages: [
    {
      role: 'user',
      content: [
        { type: 'text', text: 'Describe the image in detail.' },
        {
          type: 'image',
          image: fs.readFileSync('./data/comic-cat.png'),
        },
      ],
    },
  ],
});
```

##### [Example: Base-64 encoded image (string)](#example-base-64-encoded-image-string)

```ts
const result = await generateText({
  model: 'openai/gpt-4.1',
  messages: [
    {
      role: 'user',
      content: [
        { type: 'text', text: 'Describe the image in detail.' },
        {
          type: 'image',
          image: fs.readFileSync('./data/comic-cat.png').toString('base64'),
        },
      ],
    },
  ],
});
```

##### [Example: Image URL (string)](#example-image-url-string)

```ts
const result = await generateText({
  model: 'openai/gpt-4.1',
  messages: [
    {
      role: 'user',
      content: [
        { type: 'text', text: 'Describe the image in detail.' },
        {
          type: 'image',
          image:
            'https://github.com/vercel/ai/blob/main/examples/ai-core/data/comic-cat.png?raw=true',
        },
      ],
    },
  ],
});
```

#### [File Parts](#file-parts)

Only a few providers and models currently support file parts: [Google Generative AI](../../providers/ai-sdk-providers/google-generative-ai.html), [Google Vertex AI](../../providers/ai-sdk-providers/google-vertex.html), [OpenAI](../../providers/ai-sdk-providers/openai.html) (for `wav` and `mp3` audio with `gpt-4o-audio-preview`), [Anthropic](../../providers/ai-sdk-providers/anthropic.html), [OpenAI](../../providers/ai-sdk-providers/openai.html) (for `pdf`).

User messages can include file parts. A file can be one of the following:

-   base64-encoded file:
    -   `string` with base-64 encoded content
    -   data URL `string`, e.g. `data:image/png;base64,...`
-   binary data:
    -   `ArrayBuffer`
    -   `Uint8Array`
    -   `Buffer`
-   URL:
    -   http(s) URL `string`, e.g. `https://example.com/some.pdf`
    -   `URL` object, e.g. `new URL('https://example.com/some.pdf')`

You need to specify the MIME type of the file you are sending.

##### [Example: PDF file from Buffer](#example-pdf-file-from-buffer)

```ts
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';


const result = await generateText({
  model: google('gemini-1.5-flash'),
  messages: [
    {
      role: 'user',
      content: [
        { type: 'text', text: 'What is the file about?' },
        {
          type: 'file',
          mediaType: 'application/pdf',
          data: fs.readFileSync('./data/example.pdf'),
          filename: 'example.pdf', // optional, not used by all providers
        },
      ],
    },
  ],
});
```

##### [Example: mp3 audio file from Buffer](#example-mp3-audio-file-from-buffer)

```ts
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';


const result = await generateText({
  model: openai('gpt-4o-audio-preview'),
  messages: [
    {
      role: 'user',
      content: [
        { type: 'text', text: 'What is the audio saying?' },
        {
          type: 'file',
          mediaType: 'audio/mpeg',
          data: fs.readFileSync('./data/galileo.mp3'),
        },
      ],
    },
  ],
});
```

#### [Custom Download Function (Experimental)](#custom-download-function-experimental)

You can use custom download functions to implement throttling, retries, authentication, caching, and more.

The default download implementation automatically downloads files in parallel when they are not supported by the model.

Custom download function can be passed via the `experimental_download` property:

```ts
const result = await generateText({
  model: openai('gpt-4o'),
  experimental_download: async (
    requestedDownloads: Array<{
      url: URL;
      isUrlSupportedByModel: boolean;
    }>,
  ): PromiseLike<
    Array<{
      data: Uint8Array;
      mediaType: string | undefined;
    } | null>
  > => {
    // ... download the files and return an array with similar order
  },
  messages: [
    {
      role: 'user',
      content: [
        {
          type: 'file',
          data: new URL('https://api.company.com/private/document.pdf'),
          mediaType: 'application/pdf',
        },
      ],
    },
  ],
});
```

The `experimental_download` option is experimental and may change in future releases.

### [Assistant Messages](#assistant-messages)

Assistant messages are messages that have a role of `assistant`. They are typically previous responses from the assistant and can contain text, reasoning, and tool call parts.

#### [Example: Assistant message with text content](#example-assistant-message-with-text-content)

```ts
const result = await generateText({
  model: 'openai/gpt-4.1',
  messages: [
    { role: 'user', content: 'Hi!' },
    { role: 'assistant', content: 'Hello, how can I help?' },
  ],
});
```

#### [Example: Assistant message with text content in array](#example-assistant-message-with-text-content-in-array)

```ts
const result = await generateText({
  model: 'openai/gpt-4.1',
  messages: [
    { role: 'user', content: 'Hi!' },
    {
      role: 'assistant',
      content: [{ type: 'text', text: 'Hello, how can I help?' }],
    },
  ],
});
```

#### [Example: Assistant message with tool call content](#example-assistant-message-with-tool-call-content)

```ts
const result = await generateText({
  model: 'openai/gpt-4.1',
  messages: [
    { role: 'user', content: 'How many calories are in this block of cheese?' },
    {
      role: 'assistant',
      content: [
        {
          type: 'tool-call',
          toolCallId: '12345',
          toolName: 'get-nutrition-data',
          input: { cheese: 'Roquefort' },
        },
      ],
    },
  ],
});
```

#### [Example: Assistant message with file content](#example-assistant-message-with-file-content)

This content part is for model-generated files. Only a few models support this, and only for file types that they can generate.

```ts
const result = await generateText({
  model: 'openai/gpt-4.1',
  messages: [
    { role: 'user', content: 'Generate an image of a roquefort cheese!' },
    {
      role: 'assistant',
      content: [
        {
          type: 'file',
          mediaType: 'image/png',
          data: fs.readFileSync('./data/roquefort.jpg'),
        },
      ],
    },
  ],
});
```

### [Tool messages](#tool-messages)

[Tools](tools.html) (also known as function calling) are programs that you can provide an LLM to extend its built-in functionality. This can be anything from calling an external API to calling functions within your UI. Learn more about Tools in [the next section](tools.html).

For models that support [tool](tools.html) calls, assistant messages can contain tool call parts, and tool messages can contain tool output parts. A single assistant message can call multiple tools, and a single tool message can contain multiple tool results.

```ts
const result = await generateText({
  model: 'openai/gpt-4.1',
  messages: [
    {
      role: 'user',
      content: [
        {
          type: 'text',
          text: 'How many calories are in this block of cheese?',
        },
        { type: 'image', image: fs.readFileSync('./data/roquefort.jpg') },
      ],
    },
    {
      role: 'assistant',
      content: [
        {
          type: 'tool-call',
          toolCallId: '12345',
          toolName: 'get-nutrition-data',
          input: { cheese: 'Roquefort' },
        },
        // there could be more tool calls here (parallel calling)
      ],
    },
    {
      role: 'tool',
      content: [
        {
          type: 'tool-result',
          toolCallId: '12345', // needs to match the tool call id
          toolName: 'get-nutrition-data',
          output: {
            type: 'json',
            value: {
              name: 'Cheese, roquefort',
              calories: 369,
              fat: 31,
              protein: 22,
            },
          },
        },
        // there could be more tool results here (parallel calling)
      ],
    },
  ],
});
```

#### [Multi-modal Tool Results](#multi-modal-tool-results)

Multi-part tool results are experimental and only supported by Anthropic.

Tool results can be multi-part and multi-modal, e.g. a text and an image. You can use the `experimental_content` property on tool parts to specify multi-part tool results.

```ts
const result = await generateText({
  model: 'openai/gpt-4.1',
  messages: [
    // ...
    {
      role: 'tool',
      content: [
        {
          type: 'tool-result',
          toolCallId: '12345', // needs to match the tool call id
          toolName: 'get-nutrition-data',
          // for models that do not support multi-part tool results,
          // you can include a regular output part:
          output: {
            type: 'json',
            value: {
              name: 'Cheese, roquefort',
              calories: 369,
              fat: 31,
              protein: 22,
            },
          },
        },
        {
          type: 'tool-result',
          toolCallId: '12345', // needs to match the tool call id
          toolName: 'get-nutrition-data',
          // for models that support multi-part tool results,
          // you can include a multi-part content part:
          output: {
            type: 'content',
            value: [
              {
                type: 'text',
                text: 'Here is an image of the nutrition data for the cheese:',
              },
              {
                type: 'media',
                data: fs
                  .readFileSync('./data/roquefort-nutrition-data.png')
                  .toString('base64'),
                mediaType: 'image/png',
              },
            ],
          },
        },
      ],
    },
  ],
});
```

### [System Messages](#system-messages)

System messages are messages that are sent to the model before the user messages to guide the assistant's behavior. You can alternatively use the `system` property.

```ts
const result = await generateText({
  model: 'openai/gpt-4.1',
  messages: [
    { role: 'system', content: 'You help planning travel itineraries.' },
    {
      role: 'user',
      content:
        'I am planning a trip to Berlin for 3 days. Please suggest the best tourist activities for me to do.',
    },
  ],
});
```

[Previous

Providers and Models

](providers-and-models.html)

[Next

Tools

](tools.html)

On this page

[Prompts](#prompts)

[Text Prompts](#text-prompts)

[System Prompts](#system-prompts)

[Message Prompts](#message-prompts)

[Provider Options](#provider-options)

[Function Call Level](#function-call-level)

[Message Level](#message-level)

[Message Part Level](#message-part-level)

[User Messages](#user-messages)

[Text Parts](#text-parts)

[Image Parts](#image-parts)

[Example: Binary image (Buffer)](#example-binary-image-buffer)

[Example: Base-64 encoded image (string)](#example-base-64-encoded-image-string)

[Example: Image URL (string)](#example-image-url-string)

[File Parts](#file-parts)

[Example: PDF file from Buffer](#example-pdf-file-from-buffer)

[Example: mp3 audio file from Buffer](#example-mp3-audio-file-from-buffer)

[Custom Download Function (Experimental)](#custom-download-function-experimental)

[Assistant Messages](#assistant-messages)

[Example: Assistant message with text content](#example-assistant-message-with-text-content)

[Example: Assistant message with text content in array](#example-assistant-message-with-text-content-in-array)

[Example: Assistant message with tool call content](#example-assistant-message-with-tool-call-content)

[Example: Assistant message with file content](#example-assistant-message-with-file-content)

[Tool messages](#tool-messages)

[Multi-modal Tool Results](#multi-modal-tool-results)

[System Messages](#system-messages)

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