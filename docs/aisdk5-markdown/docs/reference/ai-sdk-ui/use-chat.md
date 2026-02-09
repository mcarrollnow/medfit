AI SDK UI: useChat

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

[useChat](use-chat.html)

[useCompletion](use-completion.html)

[useObject](use-object.html)

[convertToModelMessages](convert-to-model-messages.html)

[pruneMessages](prune-messages.html)

[createUIMessageStream](create-ui-message-stream.html)

[createUIMessageStreamResponse](create-ui-message-stream-response.html)

[pipeUIMessageStreamToResponse](pipe-ui-message-stream-to-response.html)

[readUIMessageStream](read-ui-message-stream.html)

[InferUITools](infer-ui-tools.html)

[InferUITool](infer-ui-tool.html)

[AI SDK RSC](../ai-sdk-rsc.html)

[Stream Helpers](../stream-helpers.html)

[AI SDK Errors](../ai-sdk-errors.html)

[Migration Guides](../../migration-guides.html)

[Troubleshooting](../../troubleshooting.html)

[AI SDK UI](../../ai-sdk-ui.html)useChat

# [`useChat()`](#usechat)

Allows you to easily create a conversational user interface for your chatbot application. It enables the streaming of chat messages from your AI provider, manages the chat state, and updates the UI automatically as new messages are received.

The `useChat` API has been significantly updated in AI SDK 5.0. It now uses a transport-based architecture and no longer manages input state internally. See the [migration guide](../../migration-guides/migration-guide-5-0.html#usechat-changes) for details.

## [Import](#import)

React

Svelte

Vue

import { useChat } from '@ai-sdk/react'

## [API Signature](#api-signature)

### [Parameters](#parameters)

### chat?:

Chat<UIMessage>

An existing Chat instance to use. If provided, other parameters are ignored.

### transport?:

ChatTransport

The transport to use for sending messages. Defaults to DefaultChatTransport with \`/api/chat\` endpoint.

DefaultChatTransport

### api?:

string = '/api/chat'

The API endpoint for chat requests.

### credentials?:

RequestCredentials

The credentials mode for fetch requests.

### headers?:

Record<string, string> | Headers

HTTP headers to send with requests.

### body?:

object

Extra body object to send with requests.

### prepareSendMessagesRequest?:

PrepareSendMessagesRequest

A function to customize the request before chat API calls.

PrepareSendMessagesRequest

### options:

PrepareSendMessageRequestOptions

Options for preparing the request

PrepareSendMessageRequestOptions

### id:

string

The chat ID

### messages:

UIMessage\[\]

Current messages in the chat

### requestMetadata:

unknown

The request metadata

### body:

Record<string, any> | undefined

The request body

### credentials:

RequestCredentials | undefined

The request credentials

### headers:

HeadersInit | undefined

The request headers

### api:

string

The API endpoint to use for the request. If not specified, it defaults to the transport’s API endpoint: /api/chat.

### trigger:

'submit-message' | 'regenerate-message'

The trigger for the request

### messageId:

string | undefined

The message ID if applicable

### prepareReconnectToStreamRequest?:

PrepareReconnectToStreamRequest

A function to customize the request before reconnect API call.

PrepareReconnectToStreamRequest

### options:

PrepareReconnectToStreamRequestOptions

Options for preparing the reconnect request

PrepareReconnectToStreamRequestOptions

### id:

string

The chat ID

### requestMetadata:

unknown

The request metadata

### body:

Record<string, any> | undefined

The request body

### credentials:

RequestCredentials | undefined

The request credentials

### headers:

HeadersInit | undefined

The request headers

### api:

string

The API endpoint to use for the request. If not specified, it defaults to the transport’s API endpoint combined with the chat ID: /api/chat/{chatId}/stream.

### id?:

string

A unique identifier for the chat. If not provided, a random one will be generated.

### messages?:

UIMessage\[\]

Initial chat messages to populate the conversation with.

### onToolCall?:

({toolCall: ToolCall}) => void | Promise<void>

Optional callback function that is invoked when a tool call is received. You must call addToolResult to provide the tool result.

### sendAutomaticallyWhen?:

(options: { messages: UIMessage\[\] }) => boolean | PromiseLike<boolean>

When provided, this function will be called when the stream is finished or a tool call is added to determine if the current messages should be resubmitted. You can use the lastAssistantMessageIsCompleteWithToolCalls helper for common scenarios.

### onFinish?:

(options: OnFinishOptions) => void

Called when the assistant response has finished streaming.

OnFinishOptions

### message:

UIMessage

The response message.

### messages:

UIMessage\[\]

All messages including the response message

### isAbort:

boolean

True when the request has been aborted by the client.

### isDisconnect:

boolean

True if the server has been disconnected, e.g. because of a network error.

### isError:

boolean

True if errors during streaming caused the response to stop early.

### onError?:

(error: Error) => void

Callback function to be called when an error is encountered.

### onData?:

(dataPart: DataUIPart) => void

Optional callback function that is called when a data part is received.

### experimental\_throttle?:

number

Custom throttle wait in ms for the chat messages and data updates. Default is undefined, which disables throttling.

### resume?:

boolean

Whether to resume an ongoing chat generation stream. Defaults to false.

### [Returns](#returns)

### id:

string

The id of the chat.

### messages:

UIMessage\[\]

The current array of chat messages.

UIMessage

### id:

string

A unique identifier for the message.

### role:

'system' | 'user' | 'assistant'

The role of the message.

### parts:

UIMessagePart\[\]

The parts of the message. Use this for rendering the message in the UI.

### metadata?:

unknown

The metadata of the message.

### status:

'submitted' | 'streaming' | 'ready' | 'error'

The current status of the chat: "ready" (idle), "submitted" (request sent), "streaming" (receiving response), or "error" (request failed).

### error:

Error | undefined

The error object if an error occurred.

### sendMessage:

(message: CreateUIMessage | string, options?: ChatRequestOptions) => void

Function to send a new message to the chat. This will trigger an API call to generate the assistant response.

ChatRequestOptions

### headers:

Record<string, string> | Headers

Additional headers that should be to be passed to the API endpoint.

### body:

object

Additional body JSON properties that should be sent to the API endpoint.

### data:

JSONValue

Additional data to be sent to the API endpoint.

### regenerate:

(options?: { messageId?: string }) => void

Function to regenerate the last assistant message or a specific message. If no messageId is provided, regenerates the last assistant message.

### stop:

() => void

Function to abort the current streaming response from the assistant.

### clearError:

() => void

Clears the error state.

### resumeStream:

() => void

Function to resume an interrupted streaming response. Useful when a network error occurs during streaming.

### addToolResult:

(options: { tool: string; toolCallId: string; output: unknown } | { tool: string; toolCallId: string; state: "output-error", errorText: string }) => void

Function to add a tool result to the chat. This will update the chat messages with the tool result. If sendAutomaticallyWhen is configured, it may trigger an automatic submission.

### setMessages:

(messages: UIMessage\[\] | ((messages: UIMessage\[\]) => UIMessage\[\])) => void

Function to update the messages state locally without triggering an API call. Useful for optimistic updates.

## [Learn more](#learn-more)

-   [Chatbot](../../ai-sdk-ui/chatbot.html)
-   [Chatbot with Tools](../../ai-sdk-ui/chatbot-tool-usage.html)
-   [UIMessage](../ai-sdk-core/ui-message.html)

[Previous

AI SDK UI

](../ai-sdk-ui.html)

[Next

useCompletion

](use-completion.html)

On this page

[useChat()](#usechat)

[Import](#import)

[API Signature](#api-signature)

[Parameters](#parameters)

[Returns](#returns)

[Learn more](#learn-more)

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