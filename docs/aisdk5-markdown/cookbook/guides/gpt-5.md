Guides: Get started with GPT-5

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

[Guides](../guides.html)Get started with GPT-5

# [Get started with OpenAI GPT-5](#get-started-with-openai-gpt-5)

With the [release of OpenAI's GPT-5 model](https://openai.com/index/introducing-gpt-5), there has never been a better time to start building AI applications with advanced capabilities like verbosity control, web search, and native multi-modal understanding.

The [AI SDK](../../index.html) is a powerful TypeScript toolkit for building AI applications with large language models (LLMs) like OpenAI GPT-5 alongside popular frameworks like React, Next.js, Vue, Svelte, Node.js, and more.

## [OpenAI GPT-5](#openai-gpt-5)

OpenAI's GPT-5 represents their latest advancement in language models, offering powerful new features including verbosity control for tailored response lengths, integrated web search capabilities, reasoning summaries for transparency, and native support for text, images, audio, and PDFs. The model is available in three variants: `gpt-5`, `gpt-5-mini` for faster, more cost-effective processing, and `gpt-5-nano` for ultra-efficient operations.

### [Prompt Engineering for GPT-5](#prompt-engineering-for-gpt-5)

Here are the key strategies for effective prompting:

#### [Core Principles](#core-principles)

1.  **Be precise and unambiguous**: Avoid contradictory or ambiguous instructions. GPT-5 performs best with clear, explicit guidance.
2.  **Use structured prompts**: Leverage XML-like tags to organize different sections of your instructions for better clarity.
3.  **Natural language works best**: While being precise, write prompts as you would explain to a skilled colleague.

#### [Prompting Techniques](#prompting-techniques)

**1\. Agentic Workflow Control**

-   Adjust the `reasoning_effort` parameter to calibrate model autonomy
-   Set clear stop conditions and define explicit tool call budgets
-   Provide guidance on exploration depth and persistence

```ts
// Example with reasoning effort control
const result = await generateText({
  model: openai('gpt-5'),
  prompt: 'Analyze this complex dataset and provide insights.',
  providerOptions: {
    openai: {
      reasoning_effort: 'high', // Increases autonomous exploration
    },
  },
});
```

**2\. Structured Prompt Format** Use XML-like tags to organize your prompts:

```undefined
<context_gathering>
Goal: Extract key performance metrics from the report
Method: Focus on quantitative data and year-over-year comparisons
Early stop criteria: Stop after finding 5 key metrics
</context_gathering>


<task>
Analyze the attached financial report and identify the most important metrics.
</task>
```

**3\. Tool Calling Best Practices**

-   Use tool preambles to provide clear upfront plans
-   Define safe vs. unsafe actions for different tools
-   Create structured updates about tool call progress

**4\. Verbosity Control**

-   Use the `textVerbosity` parameter to control response length programmatically
-   Override with natural language when needed for specific contexts
-   Balance between conciseness and completeness

**5\. Optimization Workflow**

-   Start with a clear, simple prompt
-   Test and identify areas of ambiguity or confusion
-   Iteratively refine by removing contradictions
-   Consider using OpenAI's Prompt Optimizer tool for complex prompts
-   Document successful patterns for reuse

## [Getting Started with the AI SDK](#getting-started-with-the-ai-sdk)

The AI SDK is the TypeScript toolkit designed to help developers build AI-powered applications with React, Next.js, Vue, Svelte, Node.js, and more. Integrating LLMs into applications is complicated and heavily dependent on the specific model provider you use.

The AI SDK abstracts away the differences between model providers, eliminates boilerplate code for building chatbots, and allows you to go beyond text output to generate rich, interactive components.

At the center of the AI SDK is [AI SDK Core](../../docs/ai-sdk-core/overview.html), which provides a unified API to call any LLM. The code snippet below is all you need to call OpenAI GPT-5 with the AI SDK:

```ts
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';


const { text } = await generateText({
  model: openai('gpt-5'),
  prompt: 'Explain the concept of quantum entanglement.',
});
```

### [Generating Structured Data](#generating-structured-data)

While text generation can be useful, you might want to generate structured JSON data. For example, you might want to extract information from text, classify data, or generate synthetic data. AI SDK Core provides two functions ([`generateObject`](../../docs/reference/ai-sdk-core/generate-object.html) and [`streamObject`](../../docs/reference/ai-sdk-core/stream-object.html)) to generate structured data, allowing you to constrain model outputs to a specific schema.

```ts
import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';


const { object } = await generateObject({
  model: openai('gpt-5'),
  schema: z.object({
    recipe: z.object({
      name: z.string(),
      ingredients: z.array(z.object({ name: z.string(), amount: z.string() })),
      steps: z.array(z.string()),
    }),
  }),
  prompt: 'Generate a lasagna recipe.',
});
```

This code snippet will generate a type-safe recipe that conforms to the specified zod schema.

### [Verbosity Control](#verbosity-control)

One of GPT-5's new features is verbosity control, allowing you to adjust response length without modifying your prompt:

```ts
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';


// Concise response
const { text: conciseText } = await generateText({
  model: openai('gpt-5'),
  prompt: 'Explain quantum computing.',
  providerOptions: {
    openai: {
      textVerbosity: 'low', // Produces terse, minimal responses
    },
  },
});


// Detailed response
const { text: detailedText } = await generateText({
  model: openai('gpt-5'),
  prompt: 'Explain quantum computing.',
  providerOptions: {
    openai: {
      textVerbosity: 'high', // Produces comprehensive, detailed responses
    },
  },
});
```

### [Web Search](#web-search)

GPT-5 can access real-time information through the integrated web search tool:

```ts
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';


const result = await generateText({
  model: openai('gpt-5'),
  prompt: 'What are the latest developments in AI this week?',
  tools: {
    web_search: openai.tools.webSearch({
      searchContextSize: 'high',
    }),
  },
});


// Access URL sources
const sources = result.sources;
```

### [Reasoning Summaries](#reasoning-summaries)

For transparency into GPT-5's thought process, enable reasoning summaries:

```ts
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';


const result = streamText({
  model: openai.responses('gpt-5'),
  prompt:
    'Solve this logic puzzle: If all roses are flowers and some flowers fade quickly, do all roses fade quickly?',
  providerOptions: {
    openai: {
      reasoningSummary: 'detailed', // 'auto' for condensed or 'detailed' for comprehensive
    },
  },
});


// Stream reasoning and text separately
for await (const part of result.fullStream) {
  if (part.type === 'reasoning') {
    console.log(part.textDelta);
  } else if (part.type === 'text-delta') {
    process.stdout.write(part.textDelta);
  }
}
```

### [Using Tools with the AI SDK](#using-tools-with-the-ai-sdk)

GPT-5 supports tool calling out of the box, allowing it to interact with external systems and perform discrete tasks. Here's an example of using tool calling with the AI SDK:

```ts
import { generateText, tool } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';


const { toolResults } = await generateText({
  model: openai('gpt-5'),
  prompt: 'What is the weather like today in San Francisco?',
  tools: {
    getWeather: tool({
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
});
```

### [Building Interactive Interfaces](#building-interactive-interfaces)

AI SDK Core can be paired with [AI SDK UI](../../docs/ai-sdk-ui/overview.html), another powerful component of the AI SDK, to streamline the process of building chat, completion, and assistant interfaces with popular frameworks like Next.js, Nuxt, and SvelteKit.

AI SDK UI provides robust abstractions that simplify the complex tasks of managing chat streams and UI updates on the frontend, enabling you to develop dynamic AI-driven interfaces more efficiently.

With four main hooks — [`useChat`](../../docs/reference/ai-sdk-ui/use-chat.html), [`useCompletion`](../../docs/reference/ai-sdk-ui/use-completion.html), and [`useObject`](../../docs/reference/ai-sdk-ui/use-object.html) — you can incorporate real-time chat capabilities, text completions, streamed JSON, and interactive assistant features into your app.

Let's explore building a chatbot with [Next.js](https://nextjs.org), the AI SDK, and OpenAI GPT-5:

In a new Next.js application, first install the AI SDK and the OpenAI provider:

pnpm install ai @ai-sdk/openai @ai-sdk/react

Then, create a route handler for the chat endpoint:

```tsx
import { openai } from '@ai-sdk/openai';
import { convertToModelMessages, streamText, UIMessage } from 'ai';


// Allow responses up to 30 seconds
export const maxDuration = 30;


export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();


  const result = streamText({
    model: openai('gpt-5'),
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


export default function Page() {
  const [input, setInput] = useState('');
  const { messages, sendMessage } = useChat({});


  return (
    <>
      {messages.map(message => (
        <div key={message.id}>
          {message.role === 'user' ? 'User: ' : 'AI: '}
          {message.parts.map((part, index) => {
            if (part.type === 'text') {
              return <span key={index}>{part.text}</span>;
            }
            return null;
          })}
        </div>
      ))}
      <form
        onSubmit={e => {
          e.preventDefault();
          if (input.trim()) {
            sendMessage({ text: input });
            setInput('');
          }
        }}
      >
        <input
          name="prompt"
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
    </>
  );
}
```

The useChat hook on your root page (`app/page.tsx`) will make a request to your AI provider endpoint (`app/api/chat/route.ts`) whenever the user submits a message. The messages are then displayed in the chat UI.

## [Get Started](#get-started)

Ready to get started? Here's how you can dive in:

1.  Explore the documentation at [ai-sdk.dev/docs](../../docs/introduction.html) to understand the full capabilities of the AI SDK.
2.  Check out practical examples at [ai-sdk.dev/cookbook](../../cookbook.html) to see the SDK in action and get inspired for your own projects.
3.  Dive deeper with advanced guides on topics like Retrieval-Augmented Generation (RAG) and multi-modal chat at [ai-sdk.dev/cookbook/guides](../guides.html).
4.  Check out ready-to-deploy AI templates at [vercel.com/templates?type=ai](https://vercel.com/templates?type=ai).

[Previous

Get started with Llama 3.1

](llama-3_1.html)

[Next

Get started with OpenAI o1

](o1.html)

On this page

[Get started with OpenAI GPT-5](#get-started-with-openai-gpt-5)

[OpenAI GPT-5](#openai-gpt-5)

[Prompt Engineering for GPT-5](#prompt-engineering-for-gpt-5)

[Core Principles](#core-principles)

[Prompting Techniques](#prompting-techniques)

[Getting Started with the AI SDK](#getting-started-with-the-ai-sdk)

[Generating Structured Data](#generating-structured-data)

[Verbosity Control](#verbosity-control)

[Web Search](#web-search)

[Reasoning Summaries](#reasoning-summaries)

[Using Tools with the AI SDK](#using-tools-with-the-ai-sdk)

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