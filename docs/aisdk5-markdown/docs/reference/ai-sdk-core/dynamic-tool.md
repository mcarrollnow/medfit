AI SDK Core: dynamicTool

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

[generateText](generate-text.html)

[streamText](stream-text.html)

[generateObject](generate-object.html)

[streamObject](stream-object.html)

[embed](embed.html)

[embedMany](embed-many.html)

[generateImage](generate-image.html)

[transcribe](transcribe.html)

[generateSpeech](generate-speech.html)

[tool](tool.html)

[dynamicTool](dynamic-tool.html)

[experimental\_createMCPClient](create-mcp-client.html)

[Experimental\_StdioMCPTransport](mcp-stdio-transport.html)

[jsonSchema](json-schema.html)

[zodSchema](zod-schema.html)

[valibotSchema](valibot-schema.html)

[ModelMessage](model-message.html)

[UIMessage](ui-message.html)

[validateUIMessages](validate-ui-messages.html)

[safeValidateUIMessages](safe-validate-ui-messages.html)

[createProviderRegistry](provider-registry.html)

[customProvider](custom-provider.html)

[cosineSimilarity](cosine-similarity.html)

[wrapLanguageModel](wrap-language-model.html)

[LanguageModelV2Middleware](language-model-v2-middleware.html)

[extractReasoningMiddleware](extract-reasoning-middleware.html)

[simulateStreamingMiddleware](simulate-streaming-middleware.html)

[defaultSettingsMiddleware](default-settings-middleware.html)

[stepCountIs](step-count-is.html)

[hasToolCall](has-tool-call.html)

[simulateReadableStream](simulate-readable-stream.html)

[smoothStream](smooth-stream.html)

[generateId](generate-id.html)

[createIdGenerator](create-id-generator.html)

[AI SDK UI](../ai-sdk-ui.html)

[AI SDK RSC](../ai-sdk-rsc.html)

[Stream Helpers](../stream-helpers.html)

[AI SDK Errors](../ai-sdk-errors.html)

[Migration Guides](../../migration-guides.html)

[Troubleshooting](../../troubleshooting.html)

[AI SDK Core](../../ai-sdk-core.html)dynamicTool

# [`dynamicTool()`](#dynamictool)

The `dynamicTool` function creates tools where the input and output types are not known at compile time. This is useful for scenarios such as:

-   MCP (Model Context Protocol) tools without schemas
-   User-defined functions loaded at runtime
-   Tools loaded from external sources or databases
-   Dynamic tool generation based on user input

Unlike the regular `tool` function, `dynamicTool` accepts and returns `unknown` types, allowing you to work with tools that have runtime-determined schemas.

```ts
import { dynamicTool } from 'ai';
import { z } from 'zod';


export const customTool = dynamicTool({
  description: 'Execute a custom user-defined function',
  inputSchema: z.object({}),
  // input is typed as 'unknown'
  execute: async input => {
    const { action, parameters } = input as any;


    // Execute your dynamic logic
    return {
      result: `Executed ${action} with ${JSON.stringify(parameters)}`,
    };
  },
});
```

## [Import](#import)

import { dynamicTool } from "ai"

## [API Signature](#api-signature)

### [Parameters](#parameters)

### tool:

Object

The dynamic tool definition.

Object

### description?:

string

Information about the purpose of the tool including details on how and when it can be used by the model.

### inputSchema:

FlexibleSchema<unknown>

The schema of the input that the tool expects. While the type is unknown, a schema is still required for validation. You can use Zod schemas with z.unknown() or z.any() for fully dynamic inputs.

### execute:

ToolExecuteFunction<unknown, unknown>

An async function that is called with the arguments from the tool call. The input is typed as unknown and must be validated/cast at runtime.

ToolCallOptions

### toolCallId:

string

The ID of the tool call.

### messages:

ModelMessage\[\]

Messages that were sent to the language model.

### abortSignal?:

AbortSignal

An optional abort signal.

### toModelOutput?:

(output: unknown) => LanguageModelV2ToolResultPart\['output'\]

Optional conversion function that maps the tool result to an output that can be used by the language model.

### providerOptions?:

ProviderOptions

Additional provider-specific metadata.

### [Returns](#returns)

A `Tool<unknown, unknown>` with `type: 'dynamic'` that can be used with `generateText`, `streamText`, and other AI SDK functions.

## [Type-Safe Usage](#type-safe-usage)

When using dynamic tools alongside static tools, you need to check the `dynamic` flag for proper type narrowing:

```ts
const result = await generateText({
  model: openai('gpt-4'),
  tools: {
    // Static tool with known types
    weather: weatherTool,
    // Dynamic tool with unknown types
    custom: dynamicTool({
      /* ... */
    }),
  },
  onStepFinish: ({ toolCalls, toolResults }) => {
    for (const toolCall of toolCalls) {
      if (toolCall.dynamic) {
        // Dynamic tool: input/output are 'unknown'
        console.log('Dynamic tool:', toolCall.toolName);
        console.log('Input:', toolCall.input);
        continue;
      }


      // Static tools have full type inference
      switch (toolCall.toolName) {
        case 'weather':
          // TypeScript knows the exact types
          console.log(toolCall.input.location); // string
          break;
      }
    }
  },
});
```

## [Usage with `useChat`](#usage-with-usechat)

When used with useChat (`UIMessage` format), dynamic tools appear as `dynamic-tool` parts:

```tsx
{
  message.parts.map(part => {
    switch (part.type) {
      case 'dynamic-tool':
        return (
          <div>
            <h4>Tool: {part.toolName}</h4>
            <pre>{JSON.stringify(part.input, null, 2)}</pre>
          </div>
        );
      // ... handle other part types
    }
  });
}
```

[Previous

tool

](tool.html)

[Next

experimental\_createMCPClient

](create-mcp-client.html)

On this page

[dynamicTool()](#dynamictool)

[Import](#import)

[API Signature](#api-signature)

[Parameters](#parameters)

[Returns](#returns)

[Type-Safe Usage](#type-safe-usage)

[Usage with useChat](#usage-with-usechat)

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