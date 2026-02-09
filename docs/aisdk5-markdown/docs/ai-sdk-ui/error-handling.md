AI SDK UI: Error Handling

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

[AI SDK UI](../ai-sdk-ui.html)Error Handling

# [Error Handling and warnings](#error-handling-and-warnings)

## [Warnings](#warnings)

The AI SDK shows warnings when something might not work as expected. These warnings help you fix problems before they cause errors.

### [When Warnings Appear](#when-warnings-appear)

Warnings are shown in the browser console when:

-   **Unsupported settings**: You use a setting that the AI model doesn't support
-   **Unsupported tools**: You use a tool that the AI model can't use
-   **Other issues**: The AI model reports other problems

### [Warning Messages](#warning-messages)

All warnings start with "AI SDK Warning:" so you can easily find them. For example:

```undefined
AI SDK Warning: The "temperature" setting is not supported by this model
AI SDK Warning: The tool "calculator" is not supported by this model
```

### [Turning Off Warnings](#turning-off-warnings)

By default, warnings are shown in the console. You can control this behavior:

#### [Turn Off All Warnings](#turn-off-all-warnings)

Set a global variable to turn off warnings completely:

```ts
globalThis.AI_SDK_LOG_WARNINGS = false;
```

#### [Custom Warning Handler](#custom-warning-handler)

You can also provide your own function to handle warnings:

```ts
globalThis.AI_SDK_LOG_WARNINGS = warnings => {
  // Handle warnings your own way
  warnings.forEach(warning => {
    // Your custom logic here
    console.log('Custom warning:', warning);
  });
};
```

Custom warning functions are experimental and can change in patch releases without notice.

## [Error Handling](#error-handling)

### [Error Helper Object](#error-helper-object)

Each AI SDK UI hook also returns an [error](../reference/ai-sdk-ui/use-chat.html#error) object that you can use to render the error in your UI. You can use the error object to show an error message, disable the submit button, or show a retry button.

We recommend showing a generic error message to the user, such as "Something went wrong." This is a good practice to avoid leaking information from the server.

```tsx
'use client';


import { useChat } from '@ai-sdk/react';
import { useState } from 'react';


export default function Chat() {
  const [input, setInput] = useState('');
  const { messages, sendMessage, error, regenerate } = useChat();


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage({ text: input });
    setInput('');
  };


  return (
    <div>
      {messages.map(m => (
        <div key={m.id}>
          {m.role}:{' '}
          {m.parts
            .filter(part => part.type === 'text')
            .map(part => part.text)
            .join('')}
        </div>
      ))}


      {error && (
        <>
          <div>An error occurred.</div>
          <button type="button" onClick={() => regenerate()}>
            Retry
          </button>
        </>
      )}


      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={error != null}
        />
      </form>
    </div>
  );
}
```

#### [Alternative: replace last message](#alternative-replace-last-message)

Alternatively you can write a custom submit handler that replaces the last message when an error is present.

```tsx
'use client';


import { useChat } from '@ai-sdk/react';
import { useState } from 'react';


export default function Chat() {
  const [input, setInput] = useState('');
  const { sendMessage, error, messages, setMessages } = useChat();


  function customSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();


    if (error != null) {
      setMessages(messages.slice(0, -1)); // remove last message
    }


    sendMessage({ text: input });
    setInput('');
  }


  return (
    <div>
      {messages.map(m => (
        <div key={m.id}>
          {m.role}:{' '}
          {m.parts
            .filter(part => part.type === 'text')
            .map(part => part.text)
            .join('')}
        </div>
      ))}


      {error && <div>An error occurred.</div>}


      <form onSubmit={customSubmit}>
        <input value={input} onChange={e => setInput(e.target.value)} />
      </form>
    </div>
  );
}
```

### [Error Handling Callback](#error-handling-callback)

Errors can be processed by passing an [`onError`](../reference/ai-sdk-ui/use-chat.html#on-error) callback function as an option to the [`useChat`](../reference/ai-sdk-ui/use-chat.html) or [`useCompletion`](../reference/ai-sdk-ui/use-completion.html) hooks. The callback function receives an error object as an argument.

```tsx
import { useChat } from '@ai-sdk/react';


export default function Page() {
  const {
    /* ... */
  } = useChat({
    // handle error:
    onError: error => {
      console.error(error);
    },
  });
}
```

### [Injecting Errors for Testing](#injecting-errors-for-testing)

You might want to create errors for testing. You can easily do so by throwing an error in your route handler:

```ts
export async function POST(req: Request) {
  throw new Error('This is a test error');
}
```

[Previous

Streaming Custom Data

](streaming-data.html)

[Next

Transport

](transport.html)

On this page

[Error Handling and warnings](#error-handling-and-warnings)

[Warnings](#warnings)

[When Warnings Appear](#when-warnings-appear)

[Warning Messages](#warning-messages)

[Turning Off Warnings](#turning-off-warnings)

[Turn Off All Warnings](#turn-off-all-warnings)

[Custom Warning Handler](#custom-warning-handler)

[Error Handling](#error-handling)

[Error Helper Object](#error-helper-object)

[Alternative: replace last message](#alternative-replace-last-message)

[Error Handling Callback](#error-handling-callback)

[Injecting Errors for Testing](#injecting-errors-for-testing)

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