AI SDK RSC: render (Removed)

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

[AI SDK RSC](../../ai-sdk-rsc.html)render (Removed)

# [`render` (Removed)](#render-removed)

"render" has been removed in AI SDK 4.0.

AI SDK RSC is currently experimental. We recommend using [AI SDK UI](../../ai-sdk-ui/overview.html) for production. For guidance on migrating from RSC to UI, see our [migration guide](../../ai-sdk-rsc/migrating-to-ui.html).

A helper function to create a streamable UI from LLM providers. This function is similar to AI SDK Core APIs and supports the same model interfaces.

> **Note**: `render` has been deprecated in favor of [`streamUI`](stream-ui.html). During migration, please ensure that the `messages` parameter follows the updated [specification](stream-ui.html#messages).

## [Import](#import)

import { render } from "@ai-sdk/rsc"

## [API Signature](#api-signature)

### [Parameters](#parameters)

### model:

string

Model identifier, must be OpenAI SDK compatible.

### provider:

provider client

Currently the only provider available is OpenAI. This needs to match the model name.

### initial?:

ReactNode

The initial UI to render.

### messages:

Array<SystemMessage | UserMessage | AssistantMessage | ToolMessage>

A list of messages that represent a conversation.

SystemMessage

### role:

'system'

The role for the system message.

### content:

string

The content of the message.

UserMessage

### role:

'user'

The role for the user message.

### content:

string

The content of the message.

AssistantMessage

### role:

'assistant'

The role for the assistant message.

### content:

string

The content of the message.

### tool\_calls:

ToolCall\[\]

A list of tool calls made by the model.

ToolCall

### id:

string

The id of the tool call.

### type:

'function'

The type of the tool call.

### function:

Function

The function to call.

Function

### name:

string

The name of the function.

### arguments:

string

The arguments of the function.

ToolMessage

### role:

'tool'

The role for the tool message.

### content:

string

The content of the message.

### toolCallId:

string

The id of the tool call.

### functions?:

ToolSet

Tools that are accessible to and can be called by the model.

Tool

### description?:

string

Information about the purpose of the tool including details on how and when it can be used by the model.

### parameters:

zod schema

The typed schema that describes the parameters of the tool that can also be used to validation and error handling.

### render?:

async (parameters) => any

An async function that is called with the arguments from the tool call and produces a result.

### tools?:

ToolSet

Tools that are accessible to and can be called by the model.

Tool

### description?:

string

Information about the purpose of the tool including details on how and when it can be used by the model.

### parameters:

zod schema

The typed schema that describes the parameters of the tool that can also be used to validation and error handling.

### render?:

async (parameters) => any

An async function that is called with the arguments from the tool call and produces a result.

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

### temperature?:

number

The temperature to use for the model.

### [Returns](#returns)

It can return any valid ReactNode.

[Previous

useStreamableValue

](use-streamable-value.html)

[Next

Stream Helpers

](../stream-helpers.html)

On this page

[render (Removed)](#render-removed)

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