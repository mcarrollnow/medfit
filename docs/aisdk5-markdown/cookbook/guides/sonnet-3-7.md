Guides: Get started with Claude 3.7 Sonnet

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

[Guides](../guides.html)Get started with Claude 3.7 Sonnet

# [Get started with Claude 3.7 Sonnet](#get-started-with-claude-37-sonnet)

With the [release of Claude 3.7 Sonnet](https://www.anthropic.com/news/claude-3-7-sonnet), there has never been a better time to start building AI applications, particularly those that require complex reasoning capabilities.

The [AI SDK](../../index.html) is a powerful TypeScript toolkit for building AI applications with large language models (LLMs) like Claude 3.7 Sonnet alongside popular frameworks like React, Next.js, Vue, Svelte, Node.js, and more.

## [Claude 3.7 Sonnet](#claude-37-sonnet)

Claude 3.7 Sonnet is Anthropic's most intelligent model to date and the first Claude model to offer extended thinking—the ability to solve complex problems with careful, step-by-step reasoning. With Claude 3.7 Sonnet, you can balance speed and quality by choosing between standard thinking for near-instant responses or extended thinking or advanced reasoning. Claude 3.7 Sonnet is state-of-the-art for coding, and delivers advancements in computer use, agentic capabilities, complex reasoning, and content generation. With frontier performance and more control over speed, Claude 3.7 Sonnet is a great choice for powering AI agents, especially customer-facing agents, and complex AI workflows.

## [Getting Started with the AI SDK](#getting-started-with-the-ai-sdk)

The AI SDK is the TypeScript toolkit designed to help developers build AI-powered applications with React, Next.js, Vue, Svelte, Node.js, and more. Integrating LLMs into applications is complicated and heavily dependent on the specific model provider you use.

The AI SDK abstracts away the differences between model providers, eliminates boilerplate code for building chatbots, and allows you to go beyond text output to generate rich, interactive components.

At the center of the AI SDK is [AI SDK Core](../../docs/ai-sdk-core/overview.html), which provides a unified API to call any LLM. The code snippet below is all you need to call Claude 3.7 Sonnet with the AI SDK:

```ts
import { anthropic } from '@ai-sdk/anthropic';
import { generateText } from 'ai';


const { text, reasoning, reasoningDetails } = await generateText({
  model: anthropic('claude-3-7-sonnet-20250219'),
  prompt: 'How many people will live in the world in 2040?',
});
console.log(text); // text response
```

The unified interface also means that you can easily switch between providers by changing just two lines of code. For example, to use Claude 3.7 Sonnet via Amazon Bedrock:

```ts
import { bedrock } from '@ai-sdk/amazon-bedrock';
import { generateText } from 'ai';


const { reasoning, text } = await generateText({
  model: bedrock('anthropic.claude-3-7-sonnet-20250219-v1:0'),
  prompt: 'How many people will live in the world in 2040?',
});
```

### [Reasoning Ability](#reasoning-ability)

Claude 3.7 Sonnet introduces a new extended thinking—the ability to solve complex problems with careful, step-by-step reasoning. You can enable it using the `thinking` provider option and specifying a thinking budget in tokens:

```ts
import { anthropic, AnthropicProviderOptions } from '@ai-sdk/anthropic';
import { generateText } from 'ai';


const { text, reasoning, reasoningDetails } = await generateText({
  model: anthropic('claude-3-7-sonnet-20250219'),
  prompt: 'How many people will live in the world in 2040?',
  providerOptions: {
    anthropic: {
      thinking: { type: 'enabled', budgetTokens: 12000 },
    } satisfies AnthropicProviderOptions,
  },
});


console.log(reasoning); // reasoning text
console.log(reasoningDetails); // reasoning details including redacted reasoning
console.log(text); // text response
```

### [Building Interactive Interfaces](#building-interactive-interfaces)

AI SDK Core can be paired with [AI SDK UI](../../docs/ai-sdk-ui/overview.html), another powerful component of the AI SDK, to streamline the process of building chat, completion, and assistant interfaces with popular frameworks like Next.js, Nuxt, and SvelteKit.

AI SDK UI provides robust abstractions that simplify the complex tasks of managing chat streams and UI updates on the frontend, enabling you to develop dynamic AI-driven interfaces more efficiently.

With four main hooks — [`useChat`](../../docs/reference/ai-sdk-ui/use-chat.html), [`useCompletion`](../../docs/reference/ai-sdk-ui/use-completion.html), and [`useObject`](../../docs/reference/ai-sdk-ui/use-object.html) — you can incorporate real-time chat capabilities, text completions, streamed JSON, and interactive assistant features into your app.

Let's explore building a chatbot with [Next.js](https://nextjs.org), the AI SDK, and Claude 3.7 Sonnet:

In a new Next.js application, first install the AI SDK and the Anthropic provider:

pnpm install ai @ai-sdk/anthropic

Then, create a route handler for the chat endpoint:

```tsx
import { anthropic, AnthropicProviderOptions } from '@ai-sdk/anthropic';
import { streamText, convertToModelMessages, type UIMessage } from 'ai';


export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();


  const result = streamText({
    model: anthropic('claude-3-7-sonnet-20250219'),
    messages: convertToModelMessages(messages),
    providerOptions: {
      anthropic: {
        thinking: { type: 'enabled', budgetTokens: 12000 },
      } satisfies AnthropicProviderOptions,
    },
  });


  return result.toUIMessageStreamResponse({
    sendReasoning: true,
  });
}
```

You can forward the model's reasoning tokens to the client with `sendReasoning: true` in the `toUIMessageStreamResponse` method.

Finally, update the root page (`app/page.tsx`) to use the `useChat` hook:

```tsx
'use client';


import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useState } from 'react';


export default function Page() {
  const [input, setInput] = useState('');
  const { messages, sendMessage } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  });


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage({ text: input });
      setInput('');
    }
  };


  return (
    <>
      {messages.map(message => (
        <div key={message.id}>
          {message.role === 'user' ? 'User: ' : 'AI: '}
          {message.parts.map((part, index) => {
            // text parts:
            if (part.type === 'text') {
              return <div key={index}>{part.text}</div>;
            }
            // reasoning parts:
            if (part.type === 'reasoning') {
              return <pre key={index}>{part.text}</pre>;
            }
          })}
        </div>
      ))}
      <form onSubmit={handleSubmit}>
        <input
          name="prompt"
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </>
  );
}
```

You can access the model's reasoning tokens with the `reasoning` part on the message `parts`.

The useChat hook on your root page (`app/page.tsx`) will make a request to your LLM provider endpoint (`app/api/chat/route.ts`) whenever the user submits a message. The messages are then displayed in the chat UI.

## [Get Started](#get-started)

Ready to dive in? Here's how you can begin:

1.  Explore the documentation at [ai-sdk.dev/docs](../../docs/introduction.html) to understand the capabilities of the AI SDK.
2.  Check out practical examples at [ai-sdk.dev/examples](../../cookbook.html) to see the SDK in action.
3.  Dive deeper with advanced guides on topics like Retrieval-Augmented Generation (RAG) at [ai-sdk.dev/docs/guides](../guides.html).
4.  Use ready-to-deploy AI templates at [vercel.com/templates?type=ai](https://vercel.com/templates?type=ai).

Claude 3.7 Sonnet opens new opportunities for reasoning-intensive AI applications. Start building today and leverage the power of advanced reasoning in your AI projects.

[Previous

Google Gemini Image Generation

](google-gemini-image-generation.html)

[Next

Get started with Llama 3.1

](llama-3_1.html)

On this page

[Get started with Claude 3.7 Sonnet](#get-started-with-claude-37-sonnet)

[Claude 3.7 Sonnet](#claude-37-sonnet)

[Getting Started with the AI SDK](#getting-started-with-the-ai-sdk)

[Reasoning Ability](#reasoning-ability)

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