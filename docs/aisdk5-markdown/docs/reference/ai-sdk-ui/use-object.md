AI SDK UI: useObject

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

[AI SDK UI](../../ai-sdk-ui.html)useObject

# [`experimental_useObject()`](#experimental_useobject)

`useObject` is an experimental feature and only available in React, Svelte, and Vue.

Allows you to consume text streams that represent a JSON object and parse them into a complete object based on a schema. You can use it together with [`streamObject`](../ai-sdk-core/stream-object.html) in the backend.

```tsx
'use client';


import { experimental_useObject as useObject } from '@ai-sdk/react';


export default function Page() {
  const { object, submit } = useObject({
    api: '/api/use-object',
    schema: z.object({ content: z.string() }),
  });


  return (
    <div>
      <button onClick={() => submit('example input')}>Generate</button>
      {object?.content && <p>{object.content}</p>}
    </div>
  );
}
```

## [Import](#import)

import { experimental\_useObject as useObject } from '@ai-sdk/react'

## [API Signature](#api-signature)

### [Parameters](#parameters)

### api:

string

The API endpoint that is called to generate objects. It should stream JSON that matches the schema as chunked text. It can be a relative path (starting with \`/\`) or an absolute URL.

### schema:

Zod Schema | JSON Schema

A schema that defines the shape of the complete object. You can either pass in a Zod schema or a JSON schema (using the \`jsonSchema\` function).

### id?:

string

A unique identifier. If not provided, a random one will be generated. When provided, the \`useObject\` hook with the same \`id\` will have shared states across components.

### initialValue?:

DeepPartial<RESULT> | undefined

An value for the initial object. Optional.

### fetch?:

FetchFunction

A custom fetch function to be used for the API call. Defaults to the global fetch function. Optional.

### headers?:

Record<string, string> | Headers

A headers object to be passed to the API endpoint. Optional.

### credentials?:

RequestCredentials

The credentials mode to be used for the fetch request. Possible values are: "omit", "same-origin", "include". Optional.

### onError?:

(error: Error) => void

Callback function to be called when an error is encountered. Optional.

### onFinish?:

(result: OnFinishResult) => void

Called when the streaming response has finished.

OnFinishResult

### object:

T | undefined

The generated object (typed according to the schema). Can be undefined if the final object does not match the schema.

### error:

unknown | undefined

Optional error object. This is e.g. a TypeValidationError when the final object does not match the schema.

### [Returns](#returns)

### submit:

(input: INPUT) => void

Calls the API with the provided input as JSON body.

### object:

DeepPartial<RESULT> | undefined

The current value for the generated object. Updated as the API streams JSON chunks.

### error:

Error | unknown

The error object if the API call fails.

### isLoading:

boolean

Boolean flag indicating whether a request is currently in progress.

### stop:

() => void

Function to abort the current API request.

### clear:

() => void

Function to clear the object state.

## [Examples](#examples)

[

Streaming Object Generation with useObject

](../../../cookbook/next/stream-object.html)

[Previous

useCompletion

](use-completion.html)

[Next

convertToModelMessages

](convert-to-model-messages.html)

On this page

[experimental\_useObject()](#experimental_useobject)

[Import](#import)

[API Signature](#api-signature)

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