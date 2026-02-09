Guides: Get started with Gemini 2.5

[](https://vercel.com/)

[

AI SDK



](../../index.html)

-   [Docs](../../docs/introduction.html)
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

[Guides](../guides.html)

[RAG Agent](rag-chatbot.html)

[Multi-Modal Agent](multi-modal-chatbot.html)

[Slackbot Agent Guide](slackbot.html)

[Natural Language Postgres](natural-language-postgres.html)

[Get started with Computer Use](computer-use.html)

[Get started with Gemini 2.5](gemini-2-5.html)

[Get started with Claude 4](claude-4.html)

[OpenAI Responses API](openai-responses.html)

[Google Gemini Image Generation](google-gemini-image-generation.html)

[Get started with Claude 3.7 Sonnet](sonnet-3-7.html)

[Get started with Llama 3.1](llama-3_1.html)

[Get started with GPT-5](gpt-5.html)

[Get started with OpenAI o1](o1.html)

[Get started with OpenAI o3-mini](o3.html)

[Get started with DeepSeek R1](r1.html)

[Next.js](../next/generate-text.html)

[Generate Text](../next/generate-text.html)

[Generate Text with Chat Prompt](../next/generate-text-with-chat-prompt.html)

[Generate Image with Chat Prompt](../next/generate-image-with-chat-prompt.html)

[Stream Text](../next/stream-text.html)

[Stream Text with Chat Prompt](../next/stream-text-with-chat-prompt.html)

[Stream Text with Image Prompt](../next/stream-text-with-image-prompt.html)

[Chat with PDFs](../next/chat-with-pdf.html)

[streamText Multi-Step Cookbook](../next/stream-text-multistep.html)

[Markdown Chatbot with Memoization](../next/markdown-chatbot-with-memoization.html)

[Generate Object](../next/generate-object.html)

[Generate Object with File Prompt through Form Submission](../next/generate-object-with-file-prompt.html)

[Stream Object](../next/stream-object.html)

[Call Tools](../next/call-tools.html)

[Call Tools in Multiple Steps](../next/call-tools-multiple-steps.html)

[Model Context Protocol (MCP) Tools](../next/mcp-tools.html)

[Share useChat State Across Components](../next/use-shared-chat-context.html)

[Human-in-the-Loop Agent with Next.js](../next/human-in-the-loop.html)

[Send Custom Body from useChat](../next/send-custom-body-from-use-chat.html)

[Render Visual Interface in Chat](../next/render-visual-interface-in-chat.html)

[Caching Middleware](../next/caching-middleware.html)

[Node](../node/generate-text.html)

[Generate Text](../node/generate-text.html)

[Generate Text with Chat Prompt](../node/generate-text-with-chat-prompt.html)

[Generate Text with Image Prompt](../node/generate-text-with-image-prompt.html)

[Stream Text](../node/stream-text.html)

[Stream Text with Chat Prompt](../node/stream-text-with-chat-prompt.html)

[Stream Text with Image Prompt](../node/stream-text-with-image-prompt.html)

[Stream Text with File Prompt](../node/stream-text-with-file-prompt.html)

[Generate Object with a Reasoning Model](../node/generate-object-reasoning.html)

[Generate Object](../node/generate-object.html)

[Stream Object](../node/stream-object.html)

[Stream Object with Image Prompt](../node/stream-object-with-image-prompt.html)

[Record Token Usage After Streaming Object](../node/stream-object-record-token-usage.html)

[Record Final Object after Streaming Object](../node/stream-object-record-final-object.html)

[Call Tools](../node/call-tools.html)

[Call Tools with Image Prompt](../node/call-tools-with-image-prompt.html)

[Call Tools in Multiple Steps](../node/call-tools-multiple-steps.html)

[Model Context Protocol (MCP) Tools](../node/mcp-tools.html)

[Manual Agent Loop](../node/manual-agent-loop.html)

[Web Search Agent](../node/web-search-agent.html)

[Embed Text](../node/embed-text.html)

[Embed Text in Batch](../node/embed-text-batch.html)

[Intercepting Fetch Requests](../node/intercept-fetch-requests.html)

[Local Caching Middleware](../node/local-caching-middleware.html)

[Retrieval Augmented Generation](../node/retrieval-augmented-generation.html)

[Knowledge Base Agent](../node/knowledge-base-agent.html)

[API Servers](../api-servers/node-http-server.html)

[Node.js HTTP Server](../api-servers/node-http-server.html)

[Express](../api-servers/express.html)

[Hono](../api-servers/hono.html)

[Fastify](../api-servers/fastify.html)

[Nest.js](../api-servers/nest.html)

[React Server Components](../rsc/generate-text.html)

[Guides](../guides.html)Get started with Gemini 2.5

# [Get started with Gemini 2.5](#get-started-with-gemini-25)

With the release of [Gemini 2.5](https://developers.googleblog.com/gemini-2-5-thinking-model-updates/), there has never been a better time to start building AI applications, particularly those that require complex reasoning capabilities and advanced intelligence.

The [AI SDK](../../index.html) is a powerful TypeScript toolkit for building AI applications with large language models (LLMs) like Gemini 2.5 alongside popular frameworks like React, Next.js, Vue, Svelte, Node.js, and more.

## [Gemini 2.5](#gemini-25)

Gemini 2.5 is Google's most advanced model family to date, offering exceptional capabilities across reasoning, instruction following, coding, and knowledge tasks. The Gemini 2.5 model family consists of:

-   [Gemini 2.5 Pro](https://ai.google.dev/gemini-api/docs/models#gemini-2.5-pro): Best for coding and highly complex tasks
-   [Gemini 2.5 Flash](https://ai.google.dev/gemini-api/docs/models#gemini-2.5-flash): Fast performance on everyday tasks
-   [Gemini 2.5 Flash-Lite](https://ai.google.dev/gemini-api/docs/models#gemini-2.5-flash-lite): Best for high volume cost-efficient tasks

## [Getting Started with the AI SDK](#getting-started-with-the-ai-sdk)

The AI SDK is the TypeScript toolkit designed to help developers build AI-powered applications with React, Next.js, Vue, Svelte, Node.js, and more. Integrating LLMs into applications is complicated and heavily dependent on the specific model provider you use.

The AI SDK abstracts away the differences between model providers, eliminates boilerplate code for building chatbots, and allows you to go beyond text output to generate rich, interactive components.

At the center of the AI SDK is [AI SDK Core](../../docs/ai-sdk-core/overview.html), which provides a unified API to call any LLM. The code snippet below is all you need to call Gemini 2.5 with the AI SDK:

```ts
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';


const { text } = await generateText({
  model: google('gemini-2.5-flash'),
  prompt: 'Explain the concept of the Hilbert space.',
});
console.log(text);
```

### [Thinking Capability](#thinking-capability)

The Gemini 2.5 series models use an internal "thinking process" that significantly improves their reasoning and multi-step planning abilities, making them highly effective for complex tasks such as coding, advanced mathematics, and data analysis.

You can control the amount of thinking using the `thinkingConfig` provider option and specifying a thinking budget in tokens. Additionally, you can request thinking summaries by setting `includeThoughts` to `true`.

```ts
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';


const { text, reasoning } = await generateText({
  model: google('gemini-2.5-flash'),
  prompt: 'What is the sum of the first 10 prime numbers?',
  providerOptions: {
    google: {
      thinkingConfig: {
        thinkingBudget: 8192,
        includeThoughts: true,
      },
    },
  },
});


console.log(text); // text response
console.log(reasoning); // reasoning summary
```

### [Using Tools with the AI SDK](#using-tools-with-the-ai-sdk)

Gemini 2.5 supports tool calling, allowing it to interact with external systems and perform discrete tasks. Here's an example of using tool calling with the AI SDK:

```ts
import { z } from 'zod';
import { generateText, tool, stepCountIs } from 'ai';
import { google } from '@ai-sdk/google';


const result = await generateText({
  model: google('gemini-2.5-flash'),
  prompt: 'What is the weather in San Francisco?',
  tools: {
    weather: tool({
      description: 'Get the weather in a location',
      inputSchema: z.object({
        location: z.string().describe('The location to get the weather for'),
      }),
      execute: async ({ location }) => ({
        location,
        temperature: 72 + Math.floor(Math.random() * 21) - 10,
      }),
    }),
  },
  stopWhen: stepCountIs(5), // Optional, enables multi step calling
});


console.log(result.text);


console.log(result.steps);
```

### [Using Google Search with Gemini](#using-google-search-with-gemini)

With [search grounding](https://ai.google.dev/gemini-api/docs/google-search), Gemini can access to the latest information using Google search. Here's an example of using Google Search with the AI SDK:

```ts
import { google } from '@ai-sdk/google';
import { GoogleGenerativeAIProviderMetadata } from '@ai-sdk/google';
import { generateText } from 'ai';


const { text, sources, providerMetadata } = await generateText({
  model: google('gemini-2.5-flash'),
  tools: {
    google_search: google.tools.googleSearch({}),
  },
  prompt:
    'List the top 5 San Francisco news from the past week.' +
    'You must include the date of each article.',
});


// access the grounding metadata. Casting to the provider metadata type
// is optional but provides autocomplete and type safety.
const metadata = providerMetadata?.google as
  | GoogleGenerativeAIProviderMetadata
  | undefined;
const groundingMetadata = metadata?.groundingMetadata;
const safetyRatings = metadata?.safetyRatings;
```

### [Building Interactive Interfaces](#building-interactive-interfaces)

AI SDK Core can be paired with [AI SDK UI](../../docs/ai-sdk-ui/overview.html), another powerful component of the AI SDK, to streamline the process of building chat, completion, and assistant interfaces with popular frameworks like Next.js, Nuxt, SvelteKit, and SolidStart.

AI SDK UI provides robust abstractions that simplify the complex tasks of managing chat streams and UI updates on the frontend, enabling you to develop dynamic AI-driven interfaces more efficiently.

With four main hooks — [`useChat`](../../docs/reference/ai-sdk-ui/use-chat.html), [`useCompletion`](../../docs/reference/ai-sdk-ui/use-completion.html), [`useObject`](../../docs/reference/ai-sdk-ui/use-object.html), and [`useAssistant`](https://ai-sdk.dev/docs/reference/ai-sdk-ui/use-assistant) — you can incorporate real-time chat capabilities, text completions, streamed JSON, and interactive assistant features into your app.

Let's explore building a chatbot with [Next.js](https://nextjs.org), the AI SDK, and Gemini 2.5 Flash:

In a new Next.js application, first install the AI SDK and the Google Generative AI provider:

pnpm install ai @ai-sdk/google

Then, create a route handler for the chat endpoint:

```tsx
import { google } from '@ai-sdk/google';
import { streamText, UIMessage, convertToModelMessages } from 'ai';


// Allow streaming responses up to 30 seconds
export const maxDuration = 30;


export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();


  const result = streamText({
    model: google('gemini-2.5-flash'),
    messages: convertToModelMessages(messages),
  });


  return result.toUIMessageStreamResponse();
}
```

Finally, update the root page (`app/page.tsx`) to use the `useChat` hook:

```tsx
'use client';


import { useChat } from '@ai-sdk/react';
import { useState } from 'react';


export default function Chat() {
  const [input, setInput] = useState('');
  const { messages, sendMessage } = useChat();
  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {messages.map(message => (
        <div key={message.id} className="whitespace-pre-wrap">
          {message.role === 'user' ? 'User: ' : 'Gemini: '}
          {message.parts.map((part, i) => {
            switch (part.type) {
              case 'text':
                return <div key={`${message.id}-${i}`}>{part.text}</div>;
            }
          })}
        </div>
      ))}


      <form
        onSubmit={e => {
          e.preventDefault();
          sendMessage({ text: input });
          setInput('');
        }}
      >
        <input
          className="fixed dark:bg-zinc-900 bottom-0 w-full max-w-md p-2 mb-8 border border-zinc-300 dark:border-zinc-800 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={e => setInput(e.currentTarget.value)}
        />
      </form>
    </div>
  );
}
```

The useChat hook on your root page (`app/page.tsx`) will make a request to your AI provider endpoint (`app/api/chat/route.ts`) whenever the user submits a message. The messages are then displayed in the chat UI.

## [Get Started](#get-started)

Ready to dive in? Here's how you can begin:

1.  Explore the documentation at [ai-sdk.dev/docs](../../docs/introduction.html) to understand the capabilities of the AI SDK.
2.  Check out practical examples at [ai-sdk.dev/examples](../../cookbook.html) to see the SDK in action.
3.  Dive deeper with advanced guides on topics like Retrieval-Augmented Generation (RAG) at [ai-sdk.dev/docs/guides](../guides.html).
4.  Use ready-to-deploy AI templates at [vercel.com/templates?type=ai](https://vercel.com/templates?type=ai).
5.  Read more about the [Google Generative AI provider](../../providers/ai-sdk-providers/google-generative-ai.html).

[Previous

Get started with Computer Use

](computer-use.html)

[Next

Get started with Claude 4

](claude-4.html)

On this page

[Get started with Gemini 2.5](#get-started-with-gemini-25)

[Gemini 2.5](#gemini-25)

[Getting Started with the AI SDK](#getting-started-with-the-ai-sdk)

[Thinking Capability](#thinking-capability)

[Using Tools with the AI SDK](#using-tools-with-the-ai-sdk)

[Using Google Search with Gemini](#using-google-search-with-gemini)

[Building Interactive Interfaces](#building-interactive-interfaces)

[Get Started](#get-started)

Deploy and Scale AI Apps with Vercel.

Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:

-   OpenAI
-   Photoroom
-   ![leonardo-ai Logo](../../_next/logo-leonardo-ai-light.svg)![leonardo-ai Logo](../../_next/logo-leonardo-ai-dark.svg)
-   ![zapier Logo](../../_next/logo-zapier-light.svg)![zapier Logo](../../_next/logo-zapier-dark.svg)

[](https://vercel.com/contact/sales?utm_source=ai_sdk&utm_medium=web&utm_campaign=contact_sales_cta&utm_content=talk_to_an_expert_sdk_docs)

#### Resources

[Docs](../../docs/introduction.html)[Cookbook](../../cookbook.html)[Providers](../../providers/ai-sdk-providers.html)[Showcase](../../showcase.html)[GitHub](https://github.com/vercel/ai)[Discussions](https://github.com/vercel/ai/discussions)

#### More

[Playground](../../playground.html)[](https://v0.dev)[Contact Sales](https://vercel.com/contact/sales)

#### About Vercel

[Next.js + Vercel](https://vercel.com/frameworks/nextjs)[Open Source Software](https://vercel.com/oss)[GitHub](https://github.com/vercel)[X](https://x.com/vercel)

#### Legal

[Privacy Policy](https://vercel.com/legal/privacy-policy)

© 2025 Vercel, Inc.