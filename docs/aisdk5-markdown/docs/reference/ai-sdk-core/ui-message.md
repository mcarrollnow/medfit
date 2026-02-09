AI SDK Core: UIMessage

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

[AI SDK Core](../../ai-sdk-core.html)UIMessage

# [`UIMessage`](#uimessage)

`UIMessage` serves as the source of truth for your application's state, representing the complete message history including metadata, data parts, and all contextual information. In contrast to `ModelMessage`, which represents the state or context passed to the model, `UIMessage` contains the full application state needed for UI rendering and client-side functionality.

## [Type Safety](#type-safety)

`UIMessage` is designed to be type-safe and accepts three generic parameters to ensure proper typing throughout your application:

1.  **`METADATA`** - Custom metadata type for additional message information
2.  **`DATA_PARTS`** - Custom data part types for structured data components
3.  **`TOOLS`** - Tool definitions for type-safe tool interactions

## [Creating Your Own UIMessage Type](#creating-your-own-uimessage-type)

Here's an example of how to create a custom typed UIMessage for your application:

```typescript
import { InferUITools, ToolSet, UIMessage, tool } from 'ai';
import z from 'zod';


const metadataSchema = z.object({
  someMetadata: z.string().datetime(),
});


type MyMetadata = z.infer<typeof metadataSchema>;


const dataPartSchema = z.object({
  someDataPart: z.object({}),
  anotherDataPart: z.object({}),
});


type MyDataPart = z.infer<typeof dataPartSchema>;


const tools = {
  someTool: tool({}),
} satisfies ToolSet;


type MyTools = InferUITools<typeof tools>;


export type MyUIMessage = UIMessage<MyMetadata, MyDataPart, MyTools>;
```

## [`UIMessage` Interface](#uimessage-interface)

```typescript
interface UIMessage<
  METADATA = unknown,
  DATA_PARTS extends UIDataTypes = UIDataTypes,
  TOOLS extends UITools = UITools,
> {
  /**
   * A unique identifier for the message.
   */
  id: string;


  /**
   * The role of the message.
   */
  role: 'system' | 'user' | 'assistant';


  /**
   * The metadata of the message.
   */
  metadata?: METADATA;


  /**
   * The parts of the message. Use this for rendering the message in the UI.
   */
  parts: Array<UIMessagePart<DATA_PARTS, TOOLS>>;
}
```

## [`UIMessagePart` Types](#uimessagepart-types)

### [`TextUIPart`](#textuipart)

A text part of a message.

```typescript
type TextUIPart = {
  type: 'text';
  /**
   * The text content.
   */
  text: string;
  /**
   * The state of the text part.
   */
  state?: 'streaming' | 'done';
};
```

### [`ReasoningUIPart`](#reasoninguipart)

A reasoning part of a message.

```typescript
type ReasoningUIPart = {
  type: 'reasoning';
  /**
   * The reasoning text.
   */
  text: string;
  /**
   * The state of the reasoning part.
   */
  state?: 'streaming' | 'done';
  /**
   * The provider metadata.
   */
  providerMetadata?: Record<string, any>;
};
```

### [`ToolUIPart`](#tooluipart)

A tool part of a message that represents tool invocations and their results.

The type is based on the name of the tool (e.g., `tool-someTool` for a tool named `someTool`).

```typescript
type ToolUIPart<TOOLS extends UITools = UITools> = ValueOf<{
  [NAME in keyof TOOLS & string]: {
    type: `tool-${NAME}`;
    toolCallId: string;
  } & (
    | {
        state: 'input-streaming';
        input: DeepPartial<TOOLS[NAME]['input']> | undefined;
        providerExecuted?: boolean;
        output?: never;
        errorText?: never;
      }
    | {
        state: 'input-available';
        input: TOOLS[NAME]['input'];
        providerExecuted?: boolean;
        output?: never;
        errorText?: never;
      }
    | {
        state: 'output-available';
        input: TOOLS[NAME]['input'];
        output: TOOLS[NAME]['output'];
        errorText?: never;
        providerExecuted?: boolean;
      }
    | {
        state: 'output-error';
        input: TOOLS[NAME]['input'];
        output?: never;
        errorText: string;
        providerExecuted?: boolean;
      }
  );
}>;
```

### [`SourceUrlUIPart`](#sourceurluipart)

A source URL part of a message.

```typescript
type SourceUrlUIPart = {
  type: 'source-url';
  sourceId: string;
  url: string;
  title?: string;
  providerMetadata?: Record<string, any>;
};
```

### [`SourceDocumentUIPart`](#sourcedocumentuipart)

A document source part of a message.

```typescript
type SourceDocumentUIPart = {
  type: 'source-document';
  sourceId: string;
  mediaType: string;
  title: string;
  filename?: string;
  providerMetadata?: Record<string, any>;
};
```

### [`FileUIPart`](#fileuipart)

A file part of a message.

```typescript
type FileUIPart = {
  type: 'file';
  /**
   * IANA media type of the file.
   */
  mediaType: string;
  /**
   * Optional filename of the file.
   */
  filename?: string;
  /**
   * The URL of the file.
   * It can either be a URL to a hosted file or a Data URL.
   */
  url: string;
};
```

### [`DataUIPart`](#datauipart)

A data part of a message for custom data types.

The type is based on the name of the data part (e.g., `data-someDataPart` for a data part named `someDataPart`).

```typescript
type DataUIPart<DATA_TYPES extends UIDataTypes> = ValueOf<{
  [NAME in keyof DATA_TYPES & string]: {
    type: `data-${NAME}`;
    id?: string;
    data: DATA_TYPES[NAME];
  };
}>;
```

### [`StepStartUIPart`](#stepstartuipart)

A step boundary part of a message.

```typescript
type StepStartUIPart = {
  type: 'step-start';
};
```

[Previous

ModelMessage

](model-message.html)

[Next

validateUIMessages

](validate-ui-messages.html)

On this page

[UIMessage](#uimessage)

[Type Safety](#type-safety)

[Creating Your Own UIMessage Type](#creating-your-own-uimessage-type)

[UIMessage Interface](#uimessage-interface)

[UIMessagePart Types](#uimessagepart-types)

[TextUIPart](#textuipart)

[ReasoningUIPart](#reasoninguipart)

[ToolUIPart](#tooluipart)

[SourceUrlUIPart](#sourceurluipart)

[SourceDocumentUIPart](#sourcedocumentuipart)

[FileUIPart](#fileuipart)

[DataUIPart](#datauipart)

[StepStartUIPart](#stepstartuipart)

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