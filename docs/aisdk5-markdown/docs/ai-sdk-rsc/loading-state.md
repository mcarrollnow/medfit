AI SDK RSC: Handling Loading State

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

[Overview](../ai-sdk-ui/overview.html)

[Chatbot](../ai-sdk-ui/chatbot.html)

[Chatbot Message Persistence](../ai-sdk-ui/chatbot-message-persistence.html)

[Chatbot Resume Streams](../ai-sdk-ui/chatbot-resume-streams.html)

[Chatbot Tool Usage](../ai-sdk-ui/chatbot-tool-usage.html)

[Generative User Interfaces](../ai-sdk-ui/generative-user-interfaces.html)

[Completion](../ai-sdk-ui/completion.html)

[Object Generation](../ai-sdk-ui/object-generation.html)

[Streaming Custom Data](../ai-sdk-ui/streaming-data.html)

[Error Handling](../ai-sdk-ui/error-handling.html)

[Transport](../ai-sdk-ui/transport.html)

[Reading UIMessage Streams](../ai-sdk-ui/reading-ui-message-streams.html)

[Message Metadata](../ai-sdk-ui/message-metadata.html)

[Stream Protocols](../ai-sdk-ui/stream-protocol.html)

[AI SDK RSC](../ai-sdk-rsc.html)

[Overview](overview.html)

[Streaming React Components](streaming-react-components.html)

[Managing Generative UI State](generative-ui-state.html)

[Saving and Restoring States](saving-and-restoring-states.html)

[Multistep Interfaces](multistep-interfaces.html)

[Streaming Values](streaming-values.html)

[Handling Loading State](loading-state.html)

[Error Handling](error-handling.html)

[Handling Authentication](authentication.html)

[Migrating from RSC to UI](migrating-to-ui.html)

[Advanced](../advanced.html)

[Reference](../reference.html)

[AI SDK Core](../reference/ai-sdk-core.html)

[AI SDK UI](../reference/ai-sdk-ui.html)

[AI SDK RSC](../reference/ai-sdk-rsc.html)

[Stream Helpers](../reference/stream-helpers.html)

[AI SDK Errors](../reference/ai-sdk-errors.html)

[Migration Guides](../migration-guides.html)

[Troubleshooting](../troubleshooting.html)

[AI SDK RSC](../ai-sdk-rsc.html)Handling Loading State

# [Handling Loading State](#handling-loading-state)

AI SDK RSC is currently experimental. We recommend using [AI SDK UI](../ai-sdk-ui/overview.html) for production. For guidance on migrating from RSC to UI, see our [migration guide](migrating-to-ui.html).

Given that responses from language models can often take a while to complete, it's crucial to be able to show loading state to users. This provides visual feedback that the system is working on their request and helps maintain a positive user experience.

There are three approaches you can take to handle loading state with the AI SDK RSC:

-   Managing loading state similar to how you would in a traditional Next.js application. This involves setting a loading state variable in the client and updating it when the response is received.
-   Streaming loading state from the server to the client. This approach allows you to track loading state on a more granular level and provide more detailed feedback to the user.
-   Streaming loading component from the server to the client. This approach allows you to stream a React Server Component to the client while awaiting the model's response.

## [Handling Loading State on the Client](#handling-loading-state-on-the-client)

### [Client](#client)

Let's create a simple Next.js page that will call the `generateResponse` function when the form is submitted. The function will take in the user's prompt (`input`) and then generate a response (`response`). To handle the loading state, use the `loading` state variable. When the form is submitted, set `loading` to `true`, and when the response is received, set it back to `false`. While the response is being streamed, the input field will be disabled.

```tsx
'use client';


import { useState } from 'react';
import { generateResponse } from './actions';
import { readStreamableValue } from '@ai-sdk/rsc';


// Force the page to be dynamic and allow streaming responses up to 30 seconds
export const maxDuration = 30;


export default function Home() {
  const [input, setInput] = useState<string>('');
  const [generation, setGeneration] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);


  return (
    <div>
      <div>{generation}</div>
      <form
        onSubmit={async e => {
          e.preventDefault();
          setLoading(true);
          const response = await generateResponse(input);


          let textContent = '';


          for await (const delta of readStreamableValue(response)) {
            textContent = `${textContent}${delta}`;
            setGeneration(textContent);
          }
          setInput('');
          setLoading(false);
        }}
      >
        <input
          type="text"
          value={input}
          disabled={loading}
          className="disabled:opacity-50"
          onChange={event => {
            setInput(event.target.value);
          }}
        />
        <button>Send Message</button>
      </form>
    </div>
  );
}
```

### [Server](#server)

Now let's implement the `generateResponse` function. Use the `streamText` function to generate a response to the input.

```typescript
'use server';


import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { createStreamableValue } from '@ai-sdk/rsc';


export async function generateResponse(prompt: string) {
  const stream = createStreamableValue();


  (async () => {
    const { textStream } = streamText({
      model: openai('gpt-4o'),
      prompt,
    });


    for await (const text of textStream) {
      stream.update(text);
    }


    stream.done();
  })();


  return stream.value;
}
```

## [Streaming Loading State from the Server](#streaming-loading-state-from-the-server)

If you are looking to track loading state on a more granular level, you can create a new streamable value to store a custom variable and then read this on the frontend. Let's update the example to create a new streamable value for tracking loading state:

### [Server](#server-1)

```typescript
'use server';


import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { createStreamableValue } from '@ai-sdk/rsc';


export async function generateResponse(prompt: string) {
  const stream = createStreamableValue();
  const loadingState = createStreamableValue({ loading: true });


  (async () => {
    const { textStream } = streamText({
      model: openai('gpt-4o'),
      prompt,
    });


    for await (const text of textStream) {
      stream.update(text);
    }


    stream.done();
    loadingState.done({ loading: false });
  })();


  return { response: stream.value, loadingState: loadingState.value };
}
```

### [Client](#client-1)

```tsx
'use client';


import { useState } from 'react';
import { generateResponse } from './actions';
import { readStreamableValue } from '@ai-sdk/rsc';


// Force the page to be dynamic and allow streaming responses up to 30 seconds
export const maxDuration = 30;


export default function Home() {
  const [input, setInput] = useState<string>('');
  const [generation, setGeneration] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);


  return (
    <div>
      <div>{generation}</div>
      <form
        onSubmit={async e => {
          e.preventDefault();
          setLoading(true);
          const { response, loadingState } = await generateResponse(input);


          let textContent = '';


          for await (const responseDelta of readStreamableValue(response)) {
            textContent = `${textContent}${responseDelta}`;
            setGeneration(textContent);
          }
          for await (const loadingDelta of readStreamableValue(loadingState)) {
            if (loadingDelta) {
              setLoading(loadingDelta.loading);
            }
          }
          setInput('');
          setLoading(false);
        }}
      >
        <input
          type="text"
          value={input}
          disabled={loading}
          className="disabled:opacity-50"
          onChange={event => {
            setInput(event.target.value);
          }}
        />
        <button>Send Message</button>
      </form>
    </div>
  );
}
```

This allows you to provide more detailed feedback about the generation process to your users.

## [Streaming Loading Components with `streamUI`](#streaming-loading-components-with-streamui)

If you are using the [`streamUI`](../reference/ai-sdk-rsc/stream-ui.html) function, you can stream the loading state to the client in the form of a React component. `streamUI` supports the usage of [JavaScript generator functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*) , which allow you to yield some value (in this case a React component) while some other blocking work completes.

## [Server](#server-2)

```ts
'use server';


import { openai } from '@ai-sdk/openai';
import { streamUI } from '@ai-sdk/rsc';


export async function generateResponse(prompt: string) {
  const result = await streamUI({
    model: openai('gpt-4o'),
    prompt,
    text: async function* ({ content }) {
      yield <div>loading...</div>;
      return <div>{content}</div>;
    },
  });


  return result.value;
}
```

Remember to update the file from `.ts` to `.tsx` because you are defining a React component in the `streamUI` function.

## [Client](#client-2)

```tsx
'use client';


import { useState } from 'react';
import { generateResponse } from './actions';
import { readStreamableValue } from '@ai-sdk/rsc';


// Force the page to be dynamic and allow streaming responses up to 30 seconds
export const maxDuration = 30;


export default function Home() {
  const [input, setInput] = useState<string>('');
  const [generation, setGeneration] = useState<React.ReactNode>();


  return (
    <div>
      <div>{generation}</div>
      <form
        onSubmit={async e => {
          e.preventDefault();
          const result = await generateResponse(input);
          setGeneration(result);
          setInput('');
        }}
      >
        <input
          type="text"
          value={input}
          onChange={event => {
            setInput(event.target.value);
          }}
        />
        <button>Send Message</button>
      </form>
    </div>
  );
}
```

[Previous

Streaming Values

](streaming-values.html)

[Next

Error Handling

](error-handling.html)

On this page

[Handling Loading State](#handling-loading-state)

[Handling Loading State on the Client](#handling-loading-state-on-the-client)

[Client](#client)

[Server](#server)

[Streaming Loading State from the Server](#streaming-loading-state-from-the-server)

[Server](#server-1)

[Client](#client-1)

[Streaming Loading Components with streamUI](#streaming-loading-components-with-streamui)

[Server](#server-2)

[Client](#client-2)

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