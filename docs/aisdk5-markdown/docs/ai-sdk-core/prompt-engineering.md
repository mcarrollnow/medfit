AI SDK Core: Prompt Engineering

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

[AI SDK Core](../ai-sdk-core.html)Prompt Engineering

# [Prompt Engineering](#prompt-engineering)

## [Tips](#tips)

### [Prompts for Tools](#prompts-for-tools)

When you create prompts that include tools, getting good results can be tricky as the number and complexity of your tools increases.

Here are a few tips to help you get the best results:

1.  Use a model that is strong at tool calling, such as `gpt-5` or `gpt-4.1`. Weaker models will often struggle to call tools effectively and flawlessly.
2.  Keep the number of tools low, e.g. to 5 or less.
3.  Keep the complexity of the tool parameters low. Complex Zod schemas with many nested and optional elements, unions, etc. can be challenging for the model to work with.
4.  Use semantically meaningful names for your tools, parameters, parameter properties, etc. The more information you pass to the model, the better it can understand what you want.
5.  Add `.describe("...")` to your Zod schema properties to give the model hints about what a particular property is for.
6.  When the output of a tool might be unclear to the model and there are dependencies between tools, use the `description` field of a tool to provide information about the output of the tool execution.
7.  You can include example input/outputs of tool calls in your prompt to help the model understand how to use the tools. Keep in mind that the tools work with JSON objects, so the examples should use JSON.

In general, the goal should be to give the model all information it needs in a clear way.

### [Tool & Structured Data Schemas](#tool--structured-data-schemas)

The mapping from Zod schemas to LLM inputs (typically JSON schema) is not always straightforward, since the mapping is not one-to-one.

#### [Zod Dates](#zod-dates)

Zod expects JavaScript Date objects, but models return dates as strings. You can specify and validate the date format using `z.string().datetime()` or `z.string().date()`, and then use a Zod transformer to convert the string to a Date object.

```ts
const result = await generateObject({
  model: openai('gpt-4.1'),
  schema: z.object({
    events: z.array(
      z.object({
        event: z.string(),
        date: z
          .string()
          .date()
          .transform(value => new Date(value)),
      }),
    ),
  }),
  prompt: 'List 5 important events from the year 2000.',
});
```

#### [Optional Parameters](#optional-parameters)

When working with tools that have optional parameters, you may encounter compatibility issues with certain providers that use strict schema validation.

This is particularly relevant for OpenAI models with structured outputs (strict mode).

For maximum compatibility, optional parameters should use `.nullable()` instead of `.optional()`:

```ts
// This may fail with strict schema validation
const failingTool = tool({
  description: 'Execute a command',
  inputSchema: z.object({
    command: z.string(),
    workdir: z.string().optional(), // This can cause errors
    timeout: z.string().optional(),
  }),
});


// This works with strict schema validation
const workingTool = tool({
  description: 'Execute a command',
  inputSchema: z.object({
    command: z.string(),
    workdir: z.string().nullable(), // Use nullable instead
    timeout: z.string().nullable(),
  }),
});
```

#### [Temperature Settings](#temperature-settings)

For tool calls and object generation, it's recommended to use `temperature: 0` to ensure deterministic and consistent results:

```ts
const result = await generateText({
  model: openai('gpt-4o'),
  temperature: 0, // Recommended for tool calls
  tools: {
    myTool: tool({
      description: 'Execute a command',
      inputSchema: z.object({
        command: z.string(),
      }),
    }),
  },
  prompt: 'Execute the ls command',
});
```

Lower temperature values reduce randomness in model outputs, which is particularly important when the model needs to:

-   Generate structured data with specific formats
-   Make precise tool calls with correct parameters
-   Follow strict schemas consistently

## [Debugging](#debugging)

### [Inspecting Warnings](#inspecting-warnings)

Not all providers support all AI SDK features. Providers either throw exceptions or return warnings when they do not support a feature. To check if your prompt, tools, and settings are handled correctly by the provider, you can check the call warnings:

```ts
const result = await generateText({
  model: openai('gpt-4o'),
  prompt: 'Hello, world!',
});


console.log(result.warnings);
```

### [HTTP Request Bodies](#http-request-bodies)

You can inspect the raw HTTP request bodies for models that expose them, e.g. [OpenAI](../../providers/ai-sdk-providers/openai.html). This allows you to inspect the exact payload that is sent to the model provider in the provider-specific way.

Request bodies are available via the `request.body` property of the response:

```ts
const result = await generateText({
  model: openai('gpt-4o'),
  prompt: 'Hello, world!',
});


console.log(result.request.body);
```

[Previous

Model Context Protocol (MCP) Tools

](mcp-tools.html)

[Next

Settings

](settings.html)

On this page

[Prompt Engineering](#prompt-engineering)

[Tips](#tips)

[Prompts for Tools](#prompts-for-tools)

[Tool & Structured Data Schemas](#tool--structured-data-schemas)

[Zod Dates](#zod-dates)

[Optional Parameters](#optional-parameters)

[Temperature Settings](#temperature-settings)

[Debugging](#debugging)

[Inspecting Warnings](#inspecting-warnings)

[HTTP Request Bodies](#http-request-bodies)

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