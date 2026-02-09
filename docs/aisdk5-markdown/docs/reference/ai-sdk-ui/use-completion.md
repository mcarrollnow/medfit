AI SDK UI: useCompletion

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

[AI SDK UI](../../ai-sdk-ui.html)useCompletion

# [`useCompletion()`](#usecompletion)

Allows you to create text completion based capabilities for your application. It enables the streaming of text completions from your AI provider, manages the state for chat input, and updates the UI automatically as new messages are received.

## [Import](#import)

React

Svelte

Vue

import { useCompletion } from '@ai-sdk/react'

## [API Signature](#api-signature)

### [Parameters](#parameters)

### api:

string = '/api/completion'

The API endpoint that is called to generate text. It can be a relative path (starting with \`/\`) or an absolute URL.

### id:

string

An unique identifier for the completion. If not provided, a random one will be generated. When provided, the \`useCompletion\` hook with the same \`id\` will have shared states across components. This is useful when you have multiple components showing the same chat stream

### initialInput:

string

An optional string for the initial prompt input.

### initialCompletion:

string

An optional string for the initial completion result.

### onFinish:

(prompt: string, completion: string) => void

An optional callback function that is called when the completion stream ends.

### onError:

(error: Error) => void

An optional callback that will be called when the chat stream encounters an error.

### headers:

Record<string, string> | Headers

An optional object of headers to be passed to the API endpoint.

### body:

any

An optional, additional body object to be passed to the API endpoint.

### credentials:

'omit' | 'same-origin' | 'include'

An optional literal that sets the mode of credentials to be used on the request. Defaults to same-origin.

### streamProtocol?:

'text' | 'data'

An optional literal that sets the type of stream to be used. Defaults to \`data\`. If set to \`text\`, the stream will be treated as a text stream.

### fetch?:

FetchFunction

Optional. A custom fetch function to be used for the API call. Defaults to the global fetch function.

### experimental\_throttle?:

number

React only. Custom throttle wait time in milliseconds for the completion and data updates. When specified, throttles how often the UI updates during streaming. Default is undefined, which disables throttling.

### [Returns](#returns)

### completion:

string

The current text completion.

### complete:

(prompt: string, options: { headers, body }) => void

Function to execute text completion based on the provided prompt.

### error:

undefined | Error

The error thrown during the completion process, if any.

### setCompletion:

(completion: string) => void

Function to update the \`completion\` state.

### stop:

() => void

Function to abort the current API request.

### input:

string

The current value of the input field.

### setInput:

React.Dispatch<React.SetStateAction<string>>

The current value of the input field.

### handleInputChange:

(event: any) => void

Handler for the \`onChange\` event of the input field to control the input's value.

### handleSubmit:

(event?: { preventDefault?: () => void }) => void

Form submission handler that automatically resets the input field and appends a user message.

### isLoading:

boolean

Boolean flag indicating whether a fetch operation is currently in progress.

[Previous

useChat

](use-chat.html)

[Next

useObject

](use-object.html)

On this page

[useCompletion()](#usecompletion)

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