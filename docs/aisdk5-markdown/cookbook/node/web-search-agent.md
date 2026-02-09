Node: Web Search Agent

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

[Node](generate-text.html)Web Search Agent

# [Web Search Agent](#web-search-agent)

There are two approaches you can take to building a web search agent with the AI SDK:

1.  Use a model that has native web-searching capabilities
2.  Create a tool to access the web and return search results.

Both approaches have their advantages and disadvantages. Models with native search capabilities tend to be faster and there is no additional cost to make the search. The disadvantage is that you have less control over what is being searched, and the functionality is limited to models that support it.

instead, by creating a tool, you can achieve more flexibility and greater control over your search queries. It allows you to customize your search strategy, specify search parameters, and you can use it with any LLM that supports tool calling. This approach will incur additional costs for the search API you use, but gives you complete control over the search experience.

## [Using native web-search](#using-native-web-search)

There are several models that offer native web-searching capabilities (Perplexity, OpenAI, Gemini). Let's look at how you could build a Web Search Agent across providers.

### [OpenAI Responses API](#openai-responses-api)

OpenAI's Responses API has a built-in web search tool that can be used to search the web and return search results. This tool is called `web_search_preview` and is accessed via the `openai` provider.

```ts
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';


const { text, sources } = await generateText({
  model: openai.responses('gpt-4o-mini'),
  prompt: 'What happened in San Francisco last week?',
  tools: {
    web_search_preview: openai.tools.webSearchPreview({}),
  },
});


console.log(text);
console.log(sources);
```

### [Perplexity](#perplexity)

Perplexity's Sonar models combines real-time web search with natural language processing. Each response is grounded in current web data and includes detailed citations.

```ts
import { perplexity } from '@ai-sdk/perplexity';
import { generateText } from 'ai';


const { text, sources } = await generateText({
  model: perplexity('sonar-pro'),
  prompt: 'What are the latest developments in quantum computing?',
});


console.log(text);
console.log(sources);
```

### [Gemini](#gemini)

With compatible Gemini models, you can enable search grounding to give the model access to the latest information using Google search.

```ts
import { google } from '@ai-sdk/google';
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


console.log(text);
console.log(sources);


// access the grounding metadata.
const metadata = providerMetadata?.google;
const groundingMetadata = metadata?.groundingMetadata;
const safetyRatings = metadata?.safetyRatings;
```

## [Building a web search tool](#building-a-web-search-tool)

Let's look at how you can build tools that search the web and return results. These tools can be used with any model that supports tool calling, giving you maximum flexibility and control over your search experience. We'll examine several search API options that can be integrated as tools in your agent.

Unlike the native web search examples where searching is built into the model, using web search tools requires multiple steps. The language model will make two generations - the first to call the relevant web search tool (extracting search queries from the context), and the second to process the results and generate a response. This multi-step process is handled automatically when you set `stopWhen: stepCountIs()` to a value greater than 1.

By using `stopWhen`, you can automatically send tool results back to the language model alongside the original question, enabling the model to respond with information relevant to the user's query based on the search results. This creates a seamless experience where the agent can search the web and incorporate those findings into its response.

### [Exa](#exa)

[Exa](https://exa.ai/) is a search API designed for AI. Let's look at how you could implement a search tool using Exa:

```ts
import { generateText, tool, stepCountIs } from 'ai';
import { z } from 'zod';
import Exa from 'exa-js';


export const exa = new Exa(process.env.EXA_API_KEY);


export const webSearch = tool({
  description: 'Search the web for up-to-date information',
  inputSchema: z.object({
    query: z.string().min(1).max(100).describe('The search query'),
  }),
  execute: async ({ query }) => {
    const { results } = await exa.searchAndContents(query, {
      livecrawl: 'always',
      numResults: 3,
    });
    return results.map(result => ({
      title: result.title,
      url: result.url,
      content: result.text.slice(0, 1000), // take just the first 1000 characters
      publishedDate: result.publishedDate,
    }));
  },
});


const { text } = await generateText({
  model: 'openai/gpt-4o-mini', // can be any model that supports tools
  prompt: 'What happened in San Francisco last week?',
  tools: {
    webSearch,
  },
  stopWhen: stepCountIs(5),
});
```

### [Firecrawl](#firecrawl)

[Firecrawl](https://firecrawl.dev) provides an API for web scraping and crawling. Let's look at how you could implement a scraping tool using Firecrawl:

```ts
import { generateText, tool, stepCountIs } from 'ai';
import { z } from 'zod';
import FirecrawlApp from '@mendable/firecrawl-js';
import 'dotenv/config';


const app = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });


export const webSearch = tool({
  description: 'Search the web for up-to-date information',
  inputSchema: z.object({
    urlToCrawl: z
      .string()
      .url()
      .min(1)
      .max(100)
      .describe('The URL to crawl (including http:// or https://)'),
  }),
  execute: async ({ urlToCrawl }) => {
    const crawlResponse = await app.crawlUrl(urlToCrawl, {
      limit: 1,
      scrapeOptions: {
        formats: ['markdown', 'html'],
      },
    });
    if (!crawlResponse.success) {
      throw new Error(`Failed to crawl: ${crawlResponse.error}`);
    }
    return crawlResponse.data;
  },
});


const main = async () => {
  const { text } = await generateText({
    model: 'openai/gpt-4o-mini', // can be any model that supports tools
    prompt: 'Get the latest blog post from vercel.com/blog',
    tools: {
      webSearch,
    },
    stopWhen: stepCountIs(5),
  });
  console.log(text);
};


main();
```

[Previous

Manual Agent Loop

](manual-agent-loop.html)

[Next

Embed Text

](embed-text.html)

On this page

[Web Search Agent](#web-search-agent)

[Using native web-search](#using-native-web-search)

[OpenAI Responses API](#openai-responses-api)

[Perplexity](#perplexity)

[Gemini](#gemini)

[Building a web search tool](#building-a-web-search-tool)

[Exa](#exa)

[Firecrawl](#firecrawl)

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