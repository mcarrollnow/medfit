Node: Call Tools

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

[RAG Agent](../guides/rag-chatbot.html)

[Multi-Modal Agent](../guides/multi-modal-chatbot.html)

[Slackbot Agent Guide](../guides/slackbot.html)

[Natural Language Postgres](../guides/natural-language-postgres.html)

[Get started with Computer Use](../guides/computer-use.html)

[Get started with Gemini 2.5](../guides/gemini-2-5.html)

[Get started with Claude 4](../guides/claude-4.html)

[OpenAI Responses API](../guides/openai-responses.html)

[Google Gemini Image Generation](../guides/google-gemini-image-generation.html)

[Get started with Claude 3.7 Sonnet](../guides/sonnet-3-7.html)

[Get started with Llama 3.1](../guides/llama-3_1.html)

[Get started with GPT-5](../guides/gpt-5.html)

[Get started with OpenAI o1](../guides/o1.html)

[Get started with OpenAI o3-mini](../guides/o3.html)

[Get started with DeepSeek R1](../guides/r1.html)

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

[Node](generate-text.html)

[Generate Text](generate-text.html)

[Generate Text with Chat Prompt](generate-text-with-chat-prompt.html)

[Generate Text with Image Prompt](generate-text-with-image-prompt.html)

[Stream Text](stream-text.html)

[Stream Text with Chat Prompt](stream-text-with-chat-prompt.html)

[Stream Text with Image Prompt](stream-text-with-image-prompt.html)

[Stream Text with File Prompt](stream-text-with-file-prompt.html)

[Generate Object with a Reasoning Model](generate-object-reasoning.html)

[Generate Object](generate-object.html)

[Stream Object](stream-object.html)

[Stream Object with Image Prompt](stream-object-with-image-prompt.html)

[Record Token Usage After Streaming Object](stream-object-record-token-usage.html)

[Record Final Object after Streaming Object](stream-object-record-final-object.html)

[Call Tools](call-tools.html)

[Call Tools with Image Prompt](call-tools-with-image-prompt.html)

[Call Tools in Multiple Steps](call-tools-multiple-steps.html)

[Model Context Protocol (MCP) Tools](mcp-tools.html)

[Manual Agent Loop](manual-agent-loop.html)

[Web Search Agent](web-search-agent.html)

[Embed Text](embed-text.html)

[Embed Text in Batch](embed-text-batch.html)

[Intercepting Fetch Requests](intercept-fetch-requests.html)

[Local Caching Middleware](local-caching-middleware.html)

[Retrieval Augmented Generation](retrieval-augmented-generation.html)

[Knowledge Base Agent](knowledge-base-agent.html)

[API Servers](../api-servers/node-http-server.html)

[Node.js HTTP Server](../api-servers/node-http-server.html)

[Express](../api-servers/express.html)

[Hono](../api-servers/hono.html)

[Fastify](../api-servers/fastify.html)

[Nest.js](../api-servers/nest.html)

[React Server Components](../rsc/generate-text.html)

[Node](generate-text.html)Call Tools

# [Call Tools](#call-tools)

Some models allow developers to provide a list of tools that can be called at any time during a generation. This is useful for extending the capabilities of a language model to either use logic or data to interact with systems external to the model.

```ts
import { generateText, tool } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';


const result = await generateText({
  model: openai('gpt-4.1'),
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
    cityAttractions: tool({
      inputSchema: z.object({ city: z.string() }),
    }),
  },
  prompt:
    'What is the weather in San Francisco and what attractions should I visit?',
});
```

## [Accessing Tool Calls and Tool Results](#accessing-tool-calls-and-tool-results)

If the model decides to call a tool, it will generate a tool call. You can access the tool call by checking the `toolCalls` property on the result.

```ts
import { openai } from '@ai-sdk/openai';
import { generateText, tool } from 'ai';
import dotenv from 'dotenv';
import { z } from 'zod';


dotenv.config();


async function main() {
  const result = await generateText({
    model: openai('gpt-4o'),
    maxOutputTokens: 512,
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
      cityAttractions: tool({
        inputSchema: z.object({ city: z.string() }),
      }),
    },
    prompt:
      'What is the weather in San Francisco and what attractions should I visit?',
  });


  // typed tool calls:
  for (const toolCall of result.toolCalls) {
    if (toolCall.dynamic) {
      continue;
    }


    switch (toolCall.toolName) {
      case 'cityAttractions': {
        toolCall.input.city; // string
        break;
      }


      case 'weather': {
        toolCall.input.location; // string
        break;
      }
    }
  }


  console.log(JSON.stringify(result, null, 2));
}


main().catch(console.error);
```

## [Accessing Tool Results](#accessing-tool-results)

You can access the result of a tool call by checking the `toolResults` property on the result.

```ts
import { openai } from '@ai-sdk/openai';
import { generateText, tool } from 'ai';
import dotenv from 'dotenv';
import { z } from 'zod';


dotenv.config();


async function main() {
  const result = await generateText({
    model: openai('gpt-4o'),
    maxOutputTokens: 512,
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
      cityAttractions: tool({
        inputSchema: z.object({ city: z.string() }),
      }),
    },
    prompt:
      'What is the weather in San Francisco and what attractions should I visit?',
  });


  // typed tool results for tools with execute method:
  for (const toolResult of result.toolResults) {
    if (toolResult.dynamic) {
      continue;
    }


    switch (toolResult.toolName) {
      case 'weather': {
        toolResult.input.location; // string
        toolResult.output.location; // string
        toolResult.output.temperature; // number
        break;
      }
    }
  }


  console.log(JSON.stringify(result, null, 2));
}


main().catch(console.error);
```

`toolResults` will only be available if the tool has an `execute` function.

## [Model Response](#model-response)

When using tools, it's important to note that the model won't respond with the tool call results by default. This is because the model has technically already generated its response to the prompt: the tool call. Many use cases will require the model to summarise the results of the tool call within the context of the original prompt automatically. You can achieve this by [using `stopWhen`](https://ai-sdk.dev/examples/node/tools/call-tools-multiple-steps) which will automatically send toolResults to the model to trigger another generation.

[Previous

Record Final Object after Streaming Object

](stream-object-record-final-object.html)

[Next

Call Tools with Image Prompt

](call-tools-with-image-prompt.html)

On this page

[Call Tools](#call-tools)

[Accessing Tool Calls and Tool Results](#accessing-tool-calls-and-tool-results)

[Accessing Tool Results](#accessing-tool-results)

[Model Response](#model-response)

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