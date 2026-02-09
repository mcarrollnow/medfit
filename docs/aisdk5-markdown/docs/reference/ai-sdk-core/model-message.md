AI SDK Core: ModelMessage

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

[AI SDK Core](../../ai-sdk-core.html)ModelMessage

# [`ModelMessage`](#modelmessage)

`ModelMessage` represents the fundamental message structure used with AI SDK Core functions. It encompasses various message types that can be used in the `messages` field of any AI SDK Core functions.

You can access the Zod schema for `ModelMessage` with the `modelMessageSchema` export.

## [`ModelMessage` Types](#modelmessage-types)

### [`SystemModelMessage`](#systemmodelmessage)

A system message that can contain system information.

```typescript
type SystemModelMessage = {
  role: 'system';
  content: string;
};
```

You can access the Zod schema for `SystemModelMessage` with the `systemModelMessageSchema` export.

Using the "system" property instead of a system message is recommended to enhance resilience against prompt injection attacks.

### [`UserModelMessage`](#usermodelmessage)

A user message that can contain text or a combination of text, images, and files.

```typescript
type UserModelMessage = {
  role: 'user';
  content: UserContent;
};


type UserContent = string | Array<TextPart | ImagePart | FilePart>;
```

You can access the Zod schema for `UserModelMessage` with the `userModelMessageSchema` export.

### [`AssistantModelMessage`](#assistantmodelmessage)

An assistant message that can contain text, tool calls, or a combination of both.

```typescript
type AssistantModelMessage = {
  role: 'assistant';
  content: AssistantContent;
};


type AssistantContent = string | Array<TextPart | ToolCallPart>;
```

You can access the Zod schema for `AssistantModelMessage` with the `assistantModelMessageSchema` export.

### [`ToolModelMessage`](#toolmodelmessage)

A tool message that contains the result of one or more tool calls.

```typescript
type ToolModelMessage = {
  role: 'tool';
  content: ToolContent;
};


type ToolContent = Array<ToolResultPart>;
```

You can access the Zod schema for `ToolModelMessage` with the `toolModelMessageSchema` export.

## [`ModelMessage` Parts](#modelmessage-parts)

### [`TextPart`](#textpart)

Represents a text content part of a prompt. It contains a string of text.

```typescript
export interface TextPart {
  type: 'text';
  /**
   * The text content.
   */
  text: string;
}
```

### [`ImagePart`](#imagepart)

Represents an image part in a user message.

```typescript
export interface ImagePart {
  type: 'image';


  /**
   * Image data. Can either be:
   * - data: a base64-encoded string, a Uint8Array, an ArrayBuffer, or a Buffer
   * - URL: a URL that points to the image
   */
  image: DataContent | URL;


  /**
   * Optional IANA media type of the image.
   * We recommend leaving this out as it will be detected automatically.
   */
  mediaType?: string;
}
```

### [`FilePart`](#filepart)

Represents an file part in a user message.

```typescript
export interface FilePart {
  type: 'file';


  /**
   * File data. Can either be:
   * - data: a base64-encoded string, a Uint8Array, an ArrayBuffer, or a Buffer
   * - URL: a URL that points to the file
   */
  data: DataContent | URL;


  /**
   * Optional filename of the file.
   */
  filename?: string;


  /**
   * IANA media type of the file.
   */
  mediaType: string;
}
```

### [`ToolCallPart`](#toolcallpart)

Represents a tool call content part of a prompt, typically generated by the AI model.

```typescript
export interface ToolCallPart {
  type: 'tool-call';


  /**
   * ID of the tool call. This ID is used to match the tool call with the tool result.
   */
  toolCallId: string;


  /**
   * Name of the tool that is being called.
   */
  toolName: string;


  /**
   * Arguments of the tool call. This is a JSON-serializable object that matches the tool's input schema.
   */
  args: unknown;
}
```

### [`ToolResultPart`](#toolresultpart)

Represents the result of a tool call in a tool message.

```typescript
export interface ToolResultPart {
  type: 'tool-result';


  /**
   * ID of the tool call that this result is associated with.
   */
  toolCallId: string;


  /**
   * Name of the tool that generated this result.
   */
  toolName: string;


  /**
   * Result of the tool call. This is a JSON-serializable object.
   */
  output: LanguageModelV2ToolResultOutput;


  /**
  Additional provider-specific metadata. They are passed through
  to the provider from the AI SDK and enable provider-specific
  functionality that can be fully encapsulated in the provider.
  */
  providerOptions?: ProviderOptions;
}
```

### [`LanguageModelV2ToolResultOutput`](#languagemodelv2toolresultoutput)

```ts
export type LanguageModelV2ToolResultOutput =
  | { type: 'text'; value: string }
  | { type: 'json'; value: JSONValue }
  | { type: 'error-text'; value: string }
  | { type: 'error-json'; value: JSONValue }
  | {
      type: 'content';
      value: Array<
        | {
            type: 'text';


            /**
          Text content.
            */
            text: string;
          }
        | {
            type: 'media';


            /**
          Base-64 encoded media data.
            */
            data: string;


            /**
          IANA media type.
          @see https://www.iana.org/assignments/media-types/media-types.xhtml
            */
            mediaType: string;
          }
      >;
    };
```

[Previous

valibotSchema

](valibot-schema.html)

[Next

UIMessage

](ui-message.html)

On this page

[ModelMessage](#modelmessage)

[ModelMessage Types](#modelmessage-types)

[SystemModelMessage](#systemmodelmessage)

[UserModelMessage](#usermodelmessage)

[AssistantModelMessage](#assistantmodelmessage)

[ToolModelMessage](#toolmodelmessage)

[ModelMessage Parts](#modelmessage-parts)

[TextPart](#textpart)

[ImagePart](#imagepart)

[FilePart](#filepart)

[ToolCallPart](#toolcallpart)

[ToolResultPart](#toolresultpart)

[LanguageModelV2ToolResultOutput](#languagemodelv2toolresultoutput)

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