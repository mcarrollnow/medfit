AI SDK RSC: streamUI

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

[AI SDK UI](../ai-sdk-ui.html)

[AI SDK RSC](../ai-sdk-rsc.html)

[streamUI](stream-ui.html)

[createAI](create-ai.html)

[createStreamableUI](create-streamable-ui.html)

[createStreamableValue](create-streamable-value.html)

[readStreamableValue](read-streamable-value.html)

[getAIState](get-ai-state.html)

[getMutableAIState](get-mutable-ai-state.html)

[useAIState](use-ai-state.html)

[useActions](use-actions.html)

[useUIState](use-ui-state.html)

[useStreamableValue](use-streamable-value.html)

[render (Removed)](render.html)

[Stream Helpers](../stream-helpers.html)

[AI SDK Errors](../ai-sdk-errors.html)

[Migration Guides](../../migration-guides.html)

[Troubleshooting](../../troubleshooting.html)

[AI SDK RSC](../../ai-sdk-rsc.html)streamUI

# [`streamUI`](#streamui)

AI SDK RSC is currently experimental. We recommend using [AI SDK UI](../../ai-sdk-ui/overview.html) for production. For guidance on migrating from RSC to UI, see our [migration guide](../../ai-sdk-rsc/migrating-to-ui.html).

A helper function to create a streamable UI from LLM providers. This function is similar to AI SDK Core APIs and supports the same model interfaces.

To see `streamUI` in action, check out [these examples](#examples).

## [Import](#import)

import { streamUI } from "@ai-sdk/rsc"

## [Parameters](#parameters)

### model:

LanguageModel

The language model to use. Example: openai("gpt-4.1")

### initial?:

ReactNode

The initial UI to render.

### system:

string

The system prompt to use that specifies the behavior of the model.

### prompt:

string

The input prompt to generate the text from.

### messages:

Array<CoreSystemMessage | CoreUserMessage | CoreAssistantMessage | CoreToolMessage> | Array<UIMessage>

A list of messages that represent a conversation. Automatically converts UI messages from the useChat hook.

CoreSystemMessage

### role:

'system'

The role for the system message.

### content:

string

The content of the message.

CoreUserMessage

### role:

'user'

The role for the user message.

### content:

string | Array<TextPart | ImagePart | FilePart>

The content of the message.

TextPart

### type:

'text'

The type of the message part.

### text:

string

The text content of the message part.

ImagePart

### type:

'image'

The type of the message part.

### image:

string | Uint8Array | Buffer | ArrayBuffer | URL

The image content of the message part. String are either base64 encoded content, base64 data URLs, or http(s) URLs.

### mediaType?:

string

The IANA media type of the image. Optional.

FilePart

### type:

'file'

The type of the message part.

### data:

string | Uint8Array | Buffer | ArrayBuffer | URL

The file content of the message part. String are either base64 encoded content, base64 data URLs, or http(s) URLs.

### mediaType:

string

The IANA media type of the file.

CoreAssistantMessage

### role:

'assistant'

The role for the assistant message.

### content:

string | Array<TextPart | ToolCallPart>

The content of the message.

TextPart

### type:

'text'

The type of the message part.

### text:

string

The text content of the message part.

ToolCallPart

### type:

'tool-call'

The type of the message part.

### toolCallId:

string

The id of the tool call.

### toolName:

string

The name of the tool, which typically would be the name of the function.

### args:

object based on zod schema

Parameters generated by the model to be used by the tool.

CoreToolMessage

### role:

'tool'

The role for the assistant message.

### content:

Array<ToolResultPart>

The content of the message.

ToolResultPart

### type:

'tool-result'

The type of the message part.

### toolCallId:

string

The id of the tool call the result corresponds to.

### toolName:

string

The name of the tool the result corresponds to.

### result:

unknown

The result returned by the tool after execution.

### isError?:

boolean

Whether the result is an error or an error message.

### maxOutputTokens?:

number

Maximum number of tokens to generate.

### temperature?:

number

Temperature setting. The value is passed through to the provider. The range depends on the provider and model. It is recommended to set either \`temperature\` or \`topP\`, but not both.

### topP?:

number

Nucleus sampling. The value is passed through to the provider. The range depends on the provider and model. It is recommended to set either \`temperature\` or \`topP\`, but not both.

### topK?:

number

Only sample from the top K options for each subsequent token. Used to remove "long tail" low probability responses. Recommended for advanced use cases only. You usually only need to use temperature.

### presencePenalty?:

number

Presence penalty setting. It affects the likelihood of the model to repeat information that is already in the prompt. The value is passed through to the provider. The range depends on the provider and model.

### frequencyPenalty?:

number

Frequency penalty setting. It affects the likelihood of the model to repeatedly use the same words or phrases. The value is passed through to the provider. The range depends on the provider and model.

### stopSequences?:

string\[\]

Sequences that will stop the generation of the text. If the model generates any of these sequences, it will stop generating further text.

### seed?:

number

The seed (integer) to use for random sampling. If set and supported by the model, calls will generate deterministic results.

### maxRetries?:

number

Maximum number of retries. Set to 0 to disable retries. Default: 2.

### abortSignal?:

AbortSignal

An optional abort signal that can be used to cancel the call.

### headers?:

Record<string, string>

Additional HTTP headers to be sent with the request. Only applicable for HTTP-based providers.

### tools:

ToolSet

Tools that are accessible to and can be called by the model.

Tool

### description?:

string

Information about the purpose of the tool including details on how and when it can be used by the model.

### parameters:

zod schema

The typed schema that describes the parameters of the tool that can also be used to validation and error handling.

### generate?:

(async (parameters) => ReactNode) | AsyncGenerator<ReactNode, ReactNode, void>

A function or a generator function that is called with the arguments from the tool call and yields React nodes as the UI.

### toolChoice?:

"auto" | "none" | "required" | { "type": "tool", "toolName": string }

The tool choice setting. It specifies how tools are selected for execution. The default is "auto". "none" disables tool execution. "required" requires tools to be executed. { "type": "tool", "toolName": string } specifies a specific tool to execute.

### text?:

(Text) => ReactNode

Callback to handle the generated tokens from the model.

Text

### content:

string

The full content of the completion.

### delta:

string

The delta.

### done:

boolean

Is it done?

### providerOptions?:

Record<string,Record<string,JSONValue>> | undefined

Provider-specific options. The outer key is the provider name. The inner values are the metadata. Details depend on the provider.

### onFinish?:

(result: OnFinishResult) => void

Callback that is called when the LLM response and all request tool executions (for tools that have a \`generate\` function) are finished.

OnFinishResult

### usage:

TokenUsage

The token usage of the generated text.

TokenUsage

### promptTokens:

number

The total number of tokens in the prompt.

### completionTokens:

number

The total number of tokens in the completion.

### totalTokens:

number

The total number of tokens generated.

### value:

ReactNode

The final ui node that was generated.

### warnings:

Warning\[\] | undefined

Warnings from the model provider (e.g. unsupported settings).

### response:

Response

Optional response data.

Response

### headers?:

Record<string, string>

Response headers.

## [Returns](#returns)

### value:

ReactNode

The user interface based on the stream output.

### response?:

Response

Optional response data.

Response

### headers?:

Record<string, string>

Response headers.

### warnings:

Warning\[\] | undefined

Warnings from the model provider (e.g. unsupported settings).

### stream:

AsyncIterable<StreamPart> & ReadableStream<StreamPart>

A stream with all events, including text deltas, tool calls, tool results, and errors. You can use it as either an AsyncIterable or a ReadableStream. When an error occurs, the stream will throw the error.

StreamPart

### type:

'text-delta'

The type to identify the object as text delta.

### textDelta:

string

The text delta.

StreamPart

### type:

'tool-call'

The type to identify the object as tool call.

### toolCallId:

string

The id of the tool call.

### toolName:

string

The name of the tool, which typically would be the name of the function.

### args:

object based on zod schema

Parameters generated by the model to be used by the tool.

StreamPart

### type:

'error'

The type to identify the object as error.

### error:

Error

Describes the error that may have occurred during execution.

StreamPart

### type:

'finish'

The type to identify the object as finish.

### finishReason:

'stop' | 'length' | 'content-filter' | 'tool-calls' | 'error' | 'other' | 'unknown'

The reason the model finished generating the text.

### usage:

TokenUsage

The token usage of the generated text.

TokenUsage

### promptTokens:

number

The total number of tokens in the prompt.

### completionTokens:

number

The total number of tokens in the completion.

### totalTokens:

number

The total number of tokens generated.

## [Examples](#examples)

[

Learn to render a React component as a function call using a language model in Next.js

](../../ai-sdk-rsc/generative-ui-state.html#what-is-ai-and-ui-state)[

Learn to persist and restore states UI/AI states in Next.js

](../../../cookbook/rsc/save-messages-to-database.html)[

Learn to route React components using a language model in Next.js

](../../../cookbook/rsc/render-visual-interface-in-chat.html)[

Learn to stream component updates to the client in Next.js

](../../../cookbook/rsc/stream-updates-to-visual-interfaces.html)

[Previous

AI SDK RSC

](../ai-sdk-rsc.html)

[Next

createAI

](create-ai.html)

On this page

[streamUI](#streamui)

[Import](#import)

[Parameters](#parameters)

[Returns](#returns)

[Examples](#examples)

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