Guides: OpenAI Responses API

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

[Guides](../guides.html)OpenAI Responses API

# [Get started with OpenAI Responses API](#get-started-with-openai-responses-api)

With the [release of OpenAI's responses API](https://openai.com/index/new-tools-for-building-agents/), there has never been a better time to start building AI applications, particularly those that require a deeper understanding of the world.

The [AI SDK](../../index.html) is a powerful TypeScript toolkit for building AI applications with large language models (LLMs) alongside popular frameworks like React, Next.js, Vue, Svelte, Node.js, and more.

## [OpenAI Responses API](#openai-responses-api)

OpenAI recently released the Responses API, a brand new way to build applications on OpenAI's platform. The new API offers a way to persist chat history, a web search tool for grounding LLM responses, file search tool for finding relevant files, and a computer use tool for building agents that can interact with and operate computers. Let's explore how to use the Responses API with the AI SDK.

## [Getting Started with the AI SDK](#getting-started-with-the-ai-sdk)

The AI SDK is the TypeScript toolkit designed to help developers build AI-powered applications with React, Next.js, Vue, Svelte, Node.js, and more. Integrating LLMs into applications is complicated and heavily dependent on the specific model provider you use.

The AI SDK abstracts away the differences between model providers, eliminates boilerplate code for building chatbots, and allows you to go beyond text output to generate rich, interactive components.

At the center of the AI SDK is [AI SDK Core](../../docs/ai-sdk-core/overview.html), which provides a unified API to call any LLM. The code snippet below is all you need to call GPT-4o with the new Responses API using the AI SDK:

```ts
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';


const { text } = await generateText({
  model: openai.responses('gpt-4o'),
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
  model: openai.responses('gpt-4o'),
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

### [Using Tools with the AI SDK](#using-tools-with-the-ai-sdk)

The Responses API supports tool calling out of the box, allowing it to interact with external systems and perform discrete tasks. Here's an example of using tool calling with the AI SDK:

```ts
import { generateText, tool } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';


const { text } = await generateText({
  model: openai.responses('gpt-4o'),
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
  stopWhen: stepCountIs(5), // enable multi-step 'agentic' LLM calls
});
```

This example demonstrates how `stopWhen` transforms a single LLM call into an agent. The `stopWhen: stepCountIs(5)` parameter allows the model to autonomously call tools, analyze results, and make additional tool calls as needed - turning what would be a simple one-shot completion into an intelligent agent that can chain multiple actions together to complete complex tasks.

### [Web Search Tool](#web-search-tool)

The Responses API introduces a built-in tool for grounding responses called `webSearch`. With this tool, the model can access the internet to find relevant information for its responses.

```ts
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';


const result = await generateText({
  model: openai.responses('gpt-4o-mini'),
  prompt: 'What happened in San Francisco last week?',
  tools: {
    web_search_preview: openai.tools.webSearchPreview(),
  },
});


console.log(result.text);
console.log(result.sources);
```

The `webSearch` tool also allows you to specify query-specific metadata that can be used to improve the quality of the search results.

```ts
import { generateText } from 'ai';


const result = await generateText({
  model: openai.responses('gpt-4o-mini'),
  prompt: 'What happened in San Francisco last week?',
  tools: {
    web_search_preview: openai.tools.webSearchPreview({
      searchContextSize: 'high',
      userLocation: {
        type: 'approximate',
        city: 'San Francisco',
        region: 'California',
      },
    }),
  },
});


console.log(result.text);
console.log(result.sources);
```

## [Using Persistence](#using-persistence)

With the Responses API, you can persist chat history with OpenAI across requests. This allows you to send just the user's last message and OpenAI can access the entire chat history:

```tsx
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';


const result1 = await generateText({
  model: openai.responses('gpt-4o-mini'),
  prompt: 'Invent a new holiday and describe its traditions.',
});


const result2 = await generateText({
  model: openai.responses('gpt-4o-mini'),
  prompt: 'Summarize in 2 sentences',
  providerOptions: {
    openai: {
      previousResponseId: result1.providerMetadata?.openai.responseId as string,
    },
  },
});
```

## [Migrating from Completions API](#migrating-from-completions-api)

Migrating from the OpenAI Completions API (via the AI SDK) to the new Responses API is simple. To migrate, simply change your provider instance from `openai(modelId)` to `openai.responses(modelId)`:

```ts
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';


// Completions API
const { text } = await generateText({
  model: openai('gpt-4o'),
  prompt: 'Explain the concept of quantum entanglement.',
});


// Responses API
const { text } = await generateText({
  model: openai.responses('gpt-4o'),
  prompt: 'Explain the concept of quantum entanglement.',
});
```

When using the Responses API, provider specific options that were previously specified on the model provider instance have now moved to the `providerOptions` object:

```ts
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';


// Completions API
const { text } = await generateText({
  model: openai('gpt-4o'),
  prompt: 'Explain the concept of quantum entanglement.',
  providerOptions: {
    openai: {
      parallelToolCalls: false,
    },
  },
});


// Responses API
const { text } = await generateText({
  model: openai.responses('gpt-4o'),
  prompt: 'Explain the concept of quantum entanglement.',
  providerOptions: {
    openai: {
      parallelToolCalls: false,
    },
  },
});
```

## [Get Started](#get-started)

Ready to get started? Here's how you can dive in:

1.  Explore the documentation at [ai-sdk.dev/docs](../../docs/introduction.html) to understand the full capabilities of the AI SDK.
2.  Check out practical examples at [ai-sdk.dev/examples](../../cookbook.html) to see the SDK in action and get inspired for your own projects.
3.  Dive deeper with advanced guides on topics like Retrieval-Augmented Generation (RAG) and multi-modal chat at [ai-sdk.dev/docs/guides](../guides.html).
4.  Check out ready-to-deploy AI templates at [vercel.com/templates?type=ai](https://vercel.com/templates?type=ai).

[Previous

Get started with Claude 4

](claude-4.html)

[Next

Google Gemini Image Generation

](google-gemini-image-generation.html)

On this page

[Get started with OpenAI Responses API](#get-started-with-openai-responses-api)

[OpenAI Responses API](#openai-responses-api)

[Getting Started with the AI SDK](#getting-started-with-the-ai-sdk)

[Generating Structured Data](#generating-structured-data)

[Using Tools with the AI SDK](#using-tools-with-the-ai-sdk)

[Web Search Tool](#web-search-tool)

[Using Persistence](#using-persistence)

[Migrating from Completions API](#migrating-from-completions-api)

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