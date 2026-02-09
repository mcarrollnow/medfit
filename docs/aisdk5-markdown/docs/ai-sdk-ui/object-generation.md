AI SDK UI: Object Generation

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

[Overview](../ai-sdk-core/overview.html)

[Generating Text](../ai-sdk-core/generating-text.html)

[Generating Structured Data](../ai-sdk-core/generating-structured-data.html)

[Tool Calling](../ai-sdk-core/tools-and-tool-calling.html)

[Model Context Protocol (MCP) Tools](../ai-sdk-core/mcp-tools.html)

[Prompt Engineering](../ai-sdk-core/prompt-engineering.html)

[Settings](../ai-sdk-core/settings.html)

[Embeddings](../ai-sdk-core/embeddings.html)

[Image Generation](../ai-sdk-core/image-generation.html)

[Transcription](../ai-sdk-core/transcription.html)

[Speech](../ai-sdk-core/speech.html)

[Language Model Middleware](../ai-sdk-core/middleware.html)

[Provider & Model Management](../ai-sdk-core/provider-management.html)

[Error Handling](../ai-sdk-core/error-handling.html)

[Testing](../ai-sdk-core/testing.html)

[Telemetry](../ai-sdk-core/telemetry.html)

[AI SDK UI](../ai-sdk-ui.html)

[Overview](overview.html)

[Chatbot](chatbot.html)

[Chatbot Message Persistence](chatbot-message-persistence.html)

[Chatbot Resume Streams](chatbot-resume-streams.html)

[Chatbot Tool Usage](chatbot-tool-usage.html)

[Generative User Interfaces](generative-user-interfaces.html)

[Completion](completion.html)

[Object Generation](object-generation.html)

[Streaming Custom Data](streaming-data.html)

[Error Handling](error-handling.html)

[Transport](transport.html)

[Reading UIMessage Streams](reading-ui-message-streams.html)

[Message Metadata](message-metadata.html)

[Stream Protocols](stream-protocol.html)

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

[AI SDK UI](../ai-sdk-ui.html)Object Generation

# [Object Generation](#object-generation)

`useObject` is an experimental feature and only available in React, Svelte, and Vue.

The [`useObject`](../reference/ai-sdk-ui/use-object.html) hook allows you to create interfaces that represent a structured JSON object that is being streamed.

In this guide, you will learn how to use the `useObject` hook in your application to generate UIs for structured data on the fly.

## [Example](#example)

The example shows a small notifications demo app that generates fake notifications in real-time.

### [Schema](#schema)

It is helpful to set up the schema in a separate file that is imported on both the client and server.

```ts
import { z } from 'zod';


// define a schema for the notifications
export const notificationSchema = z.object({
  notifications: z.array(
    z.object({
      name: z.string().describe('Name of a fictional person.'),
      message: z.string().describe('Message. Do not use emojis or links.'),
    }),
  ),
});
```

### [Client](#client)

The client uses [`useObject`](../reference/ai-sdk-ui/use-object.html) to stream the object generation process.

The results are partial and are displayed as they are received. Please note the code for handling `undefined` values in the JSX.

```tsx
'use client';


import { experimental_useObject as useObject } from '@ai-sdk/react';
import { notificationSchema } from './api/notifications/schema';


export default function Page() {
  const { object, submit } = useObject({
    api: '/api/notifications',
    schema: notificationSchema,
  });


  return (
    <>
      <button onClick={() => submit('Messages during finals week.')}>
        Generate notifications
      </button>


      {object?.notifications?.map((notification, index) => (
        <div key={index}>
          <p>{notification?.name}</p>
          <p>{notification?.message}</p>
        </div>
      ))}
    </>
  );
}
```

### [Server](#server)

On the server, we use [`streamObject`](../reference/ai-sdk-core/stream-object.html) to stream the object generation process.

```typescript
import { openai } from '@ai-sdk/openai';
import { streamObject } from 'ai';
import { notificationSchema } from './schema';


// Allow streaming responses up to 30 seconds
export const maxDuration = 30;


export async function POST(req: Request) {
  const context = await req.json();


  const result = streamObject({
    model: openai('gpt-4.1'),
    schema: notificationSchema,
    prompt:
      `Generate 3 notifications for a messages app in this context:` + context,
  });


  return result.toTextStreamResponse();
}
```

## [Enum Output Mode](#enum-output-mode)

When you need to classify or categorize input into predefined options, you can use the `enum` output mode with `useObject`. This requires a specific schema structure where the object has `enum` as a key with `z.enum` containing your possible values.

### [Example: Text Classification](#example-text-classification)

This example shows how to build a simple text classifier that categorizes statements as true or false.

#### [Client](#client-1)

When using `useObject` with enum output mode, your schema must be an object with `enum` as the key:

```tsx
'use client';


import { experimental_useObject as useObject } from '@ai-sdk/react';
import { z } from 'zod';


export default function ClassifyPage() {
  const { object, submit, isLoading } = useObject({
    api: '/api/classify',
    schema: z.object({ enum: z.enum(['true', 'false']) }),
  });


  return (
    <>
      <button onClick={() => submit('The earth is flat')} disabled={isLoading}>
        Classify statement
      </button>


      {object && <div>Classification: {object.enum}</div>}
    </>
  );
}
```

#### [Server](#server-1)

On the server, use `streamObject` with `output: 'enum'` to stream the classification result:

```typescript
import { openai } from '@ai-sdk/openai';
import { streamObject } from 'ai';


export async function POST(req: Request) {
  const context = await req.json();


  const result = streamObject({
    model: openai('gpt-4.1'),
    output: 'enum',
    enum: ['true', 'false'],
    prompt: `Classify this statement as true or false: ${context}`,
  });


  return result.toTextStreamResponse();
}
```

## [Customized UI](#customized-ui)

`useObject` also provides ways to show loading and error states:

### [Loading State](#loading-state)

The `isLoading` state returned by the `useObject` hook can be used for several purposes:

-   To show a loading spinner while the object is generated.
-   To disable the submit button.

```tsx
'use client';


import { useObject } from '@ai-sdk/react';


export default function Page() {
  const { isLoading, object, submit } = useObject({
    api: '/api/notifications',
    schema: notificationSchema,
  });


  return (
    <>
      {isLoading && <Spinner />}


      <button
        onClick={() => submit('Messages during finals week.')}
        disabled={isLoading}
      >
        Generate notifications
      </button>


      {object?.notifications?.map((notification, index) => (
        <div key={index}>
          <p>{notification?.name}</p>
          <p>{notification?.message}</p>
        </div>
      ))}
    </>
  );
}
```

### [Stop Handler](#stop-handler)

The `stop` function can be used to stop the object generation process. This can be useful if the user wants to cancel the request or if the server is taking too long to respond.

```tsx
'use client';


import { useObject } from '@ai-sdk/react';


export default function Page() {
  const { isLoading, stop, object, submit } = useObject({
    api: '/api/notifications',
    schema: notificationSchema,
  });


  return (
    <>
      {isLoading && (
        <button type="button" onClick={() => stop()}>
          Stop
        </button>
      )}


      <button onClick={() => submit('Messages during finals week.')}>
        Generate notifications
      </button>


      {object?.notifications?.map((notification, index) => (
        <div key={index}>
          <p>{notification?.name}</p>
          <p>{notification?.message}</p>
        </div>
      ))}
    </>
  );
}
```

### [Error State](#error-state)

Similarly, the `error` state reflects the error object thrown during the fetch request. It can be used to display an error message, or to disable the submit button:

We recommend showing a generic error message to the user, such as "Something went wrong." This is a good practice to avoid leaking information from the server.

```tsx
'use client';


import { useObject } from '@ai-sdk/react';


export default function Page() {
  const { error, object, submit } = useObject({
    api: '/api/notifications',
    schema: notificationSchema,
  });


  return (
    <>
      {error && <div>An error occurred.</div>}


      <button onClick={() => submit('Messages during finals week.')}>
        Generate notifications
      </button>


      {object?.notifications?.map((notification, index) => (
        <div key={index}>
          <p>{notification?.name}</p>
          <p>{notification?.message}</p>
        </div>
      ))}
    </>
  );
}
```

## [Event Callbacks](#event-callbacks)

`useObject` provides optional event callbacks that you can use to handle life-cycle events.

-   `onFinish`: Called when the object generation is completed.
-   `onError`: Called when an error occurs during the fetch request.

These callbacks can be used to trigger additional actions, such as logging, analytics, or custom UI updates.

```tsx
'use client';


import { experimental_useObject as useObject } from '@ai-sdk/react';
import { notificationSchema } from './api/notifications/schema';


export default function Page() {
  const { object, submit } = useObject({
    api: '/api/notifications',
    schema: notificationSchema,
    onFinish({ object, error }) {
      // typed object, undefined if schema validation fails:
      console.log('Object generation completed:', object);


      // error, undefined if schema validation succeeds:
      console.log('Schema validation error:', error);
    },
    onError(error) {
      // error during fetch request:
      console.error('An error occurred:', error);
    },
  });


  return (
    <div>
      <button onClick={() => submit('Messages during finals week.')}>
        Generate notifications
      </button>


      {object?.notifications?.map((notification, index) => (
        <div key={index}>
          <p>{notification?.name}</p>
          <p>{notification?.message}</p>
        </div>
      ))}
    </div>
  );
}
```

## [Configure Request Options](#configure-request-options)

You can configure the API endpoint, optional headers and credentials using the `api`, `headers` and `credentials` settings.

```tsx
const { submit, object } = useObject({
  api: '/api/use-object',
  headers: {
    'X-Custom-Header': 'CustomValue',
  },
  credentials: 'include',
  schema: yourSchema,
});
```

[Previous

Completion

](completion.html)

[Next

Streaming Custom Data

](streaming-data.html)

On this page

[Object Generation](#object-generation)

[Example](#example)

[Schema](#schema)

[Client](#client)

[Server](#server)

[Enum Output Mode](#enum-output-mode)

[Example: Text Classification](#example-text-classification)

[Client](#client-1)

[Server](#server-1)

[Customized UI](#customized-ui)

[Loading State](#loading-state)

[Stop Handler](#stop-handler)

[Error State](#error-state)

[Event Callbacks](#event-callbacks)

[Configure Request Options](#configure-request-options)

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