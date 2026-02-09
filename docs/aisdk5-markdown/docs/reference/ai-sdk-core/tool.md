AI SDK Core: tool

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

[AI SDK Core](../../ai-sdk-core.html)tool

# [`tool()`](#tool)

Tool is a helper function that infers the tool input for its `execute` method.

It does not have any runtime behavior, but it helps TypeScript infer the types of the input for the `execute` method.

Without this helper function, TypeScript is unable to connect the `inputSchema` property to the `execute` method, and the argument types of `execute` cannot be inferred.

```ts
import { tool } from 'ai';
import { z } from 'zod';


export const weatherTool = tool({
  description: 'Get the weather in a location',
  inputSchema: z.object({
    location: z.string().describe('The location to get the weather for'),
  }),
  // location below is inferred to be a string:
  execute: async ({ location }) => ({
    location,
    temperature: 72 + Math.floor(Math.random() * 21) - 10,
  }),
});
```

## [Import](#import)

import { tool } from "ai"

## [API Signature](#api-signature)

### [Parameters](#parameters)

### tool:

Tool

The tool definition.

Tool

### description?:

string

Information about the purpose of the tool including details on how and when it can be used by the model.

### inputSchema:

Zod Schema | JSON Schema

The schema of the input that the tool expects. The language model will use this to generate the input. It is also used to validate the output of the language model. Use descriptions to make the input understandable for the language model. You can either pass in a Zod schema or a JSON schema (using the \`jsonSchema\` function).

### execute?:

async (input: INPUT, options: ToolCallOptions) => RESULT | Promise<RESULT> | AsyncIterable<RESULT>

An async function that is called with the arguments from the tool call and produces a result or a results iterable. If an iterable is provided, all results but the last one are considered preliminary. If not provided, the tool will not be executed automatically.

ToolCallOptions

### toolCallId:

string

The ID of the tool call. You can use it e.g. when sending tool-call related information with stream data.

### messages:

ModelMessage\[\]

Messages that were sent to the language model to initiate the response that contained the tool call. The messages do not include the system prompt nor the assistant response that contained the tool call.

### abortSignal?:

AbortSignal

An optional abort signal that indicates that the overall operation should be aborted.

### experimental\_context?:

unknown

Context that is passed into tool execution. Experimental (can break in patch releases).

### outputSchema?:

Zod Schema | JSON Schema

The schema of the output that the tool produces. Used for validation and type inference.

### toModelOutput?:

(output: RESULT) => LanguageModelV2ToolResultPart\['output'\]

Optional conversion function that maps the tool result to an output that can be used by the language model. If not provided, the tool result will be sent as a JSON object.

### onInputStart?:

(options: ToolCallOptions) => void | PromiseLike<void>

Optional function that is called when the argument streaming starts. Only called when the tool is used in a streaming context.

### onInputDelta?:

(options: { inputTextDelta: string } & ToolCallOptions) => void | PromiseLike<void>

Optional function that is called when an argument streaming delta is available. Only called when the tool is used in a streaming context.

### onInputAvailable?:

(options: { input: INPUT } & ToolCallOptions) => void | PromiseLike<void>

Optional function that is called when a tool call can be started, even if the execute function is not provided.

### providerOptions?:

ProviderOptions

Additional provider-specific metadata. They are passed through to the provider from the AI SDK and enable provider-specific functionality that can be fully encapsulated in the provider.

### type?:

'function' | 'provider-defined'

The type of the tool. Defaults to "function" for regular tools. Use "provider-defined" for provider-specific tools.

### id?:

string

The ID of the tool for provider-defined tools. Should follow the format \`<provider-name>.<unique-tool-name>\`. Required when type is "provider-defined".

### name?:

string

The name of the tool that the user must use in the tool set. Required when type is "provider-defined".

### args?:

Record<string, unknown>

The arguments for configuring the tool. Must match the expected arguments defined by the provider for this tool. Required when type is "provider-defined".

### [Returns](#returns)

The tool that was passed in.

[Previous

generateSpeech

](generate-speech.html)

[Next

dynamicTool

](dynamic-tool.html)

On this page

[tool()](#tool)

[Import](#import)

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