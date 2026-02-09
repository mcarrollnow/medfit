Node: Knowledge Base Agent

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

[Node](generate-text.html)Knowledge Base Agent

In this recipe, you'll learn how to build an AI agent that can interact with a knowledge base using [Upstash Search](https://upstash.com/docs/search). The agent will be able to both retrieve information from the knowledge base and add new resources to it, leveraging AI SDK tools.

Upstash Search offers input enrichment, reranking, semantic search, and full-text search for highly accurate results. It also provides a built-in embedding service, eliminating the need for a separate embedding provider. This makes it convenient for building and managing simple knowledge bases.

This example uses [the following essay](https://raw.githubusercontent.com/run-llama/llama_index/main/docs/docs/examples/data/paul_graham/paul_graham_essay.txt) as input data (`essay.txt`).

For a more in-depth guide, check out the [RAG Agent Guide](../guides/rag-chatbot.html), which shows you how to build a RAG Agent with [Next.js](https://nextjs.org), [Drizzle ORM](https://orm.drizzle.team/), and [Postgres](https://postgresql.org).

## [Getting Started](#getting-started)

Create an Upstash Search database on [Upstash Console](https://console.upstash.com/search). Once created, you will get a REST URL and a token. Set these in your environment variables:

```bash
UPSTASH_SEARCH_REST_URL="***"
UPSTASH_SEARCH_REST_TOKEN="***"
```

## [Project Setup](#project-setup)

Create a new empty directory for your project and initialize pnpm:

```bash
mkdir knowledge-base-agent
cd knowledge-base-agent
pnpm init
```

Install the AI SDK, OpenAI provider, Upstash Search packages, and tsx as a dev dependency:

```bash
pnpm i ai zod @ai-sdk/openai @upstash/search
pnpm i -D tsx
```

Finally, download and save the input essay:

```bash
curl -o essay.txt https://raw.githubusercontent.com/run-llama/llama_index/main/docs/docs/examples/data/paul_graham/paul_graham_essay.txt
```

## [Setting Up the Knowledge Base](#setting-up-the-knowledge-base)

Next, let's set up the initial knowledge base by reading a file and uploading its content to Upstash Search. Create a script called `setup.ts`:

```ts
import fs from 'fs';
import path from 'path';
import 'dotenv/config';
import { Search } from '@upstash/search';


type KnowledgeContent = {
  text: string;
  section: string;
  title?: string;
};


// Initialize Upstash Search client
const search = new Search({
  url: process.env.UPSTASH_SEARCH_REST_URL!,
  token: process.env.UPSTASH_SEARCH_REST_TOKEN!,
});


const index = search.index<KnowledgeContent>('knowledge-base');


async function setupKnowledgeBase() {
  // Read and process the source file
  const content = fs.readFileSync(path.join(__dirname, 'essay.txt'), 'utf8');


  // Split content into meaningful chunks
  const chunks = content
    .split(/\n\s*\n/) // Split by double line breaks (paragraphs)
    .map(chunk => chunk.trim())
    .filter(chunk => chunk.length > 50); // Only keep substantial chunks


  // Upload chunks to Upstash Search in batches of 100
  const batchSize = 100;
  for (let i = 0; i < chunks.length; i += batchSize) {
    const batch = chunks.slice(i, i + batchSize).map((chunk, j) => ({
      id: `chunk-${i + j}`,
      content: {
        text: chunk,
        section: `section-${Math.floor((i + j) / 10)}`,
        title: chunk.split('\n')[0] || `Chunk ${i + j + 1}`,
      },
    }));
    await index.upsert(batch);
    console.log(
      `Upserted ${Math.min(i + batch.length, chunks.length)} chunks out of ${chunks.length} chunks`,
    );
  }
}


// Run setup
setupKnowledgeBase().catch(console.error);
```

Run the setup script to populate your knowledge base:

```bash
pnpm tsx setup.ts
```

Navigate to the Upstash Console and check the data browser of your Search database. You should see the essay has been indexed.

## [Building the Knowledge Base Agent](#building-the-knowledge-base-agent)

Now let's create an agent that can interact with this knowledge base. Create a new file called `agent.ts`:

```ts
import { openai } from '@ai-sdk/openai';
import { tool, stepCountIs, generateText, generateId } from 'ai';
import { z } from 'zod';
import { Search } from '@upstash/search';


import 'dotenv/config';


const search = new Search({
  url: process.env.UPSTASH_SEARCH_REST_URL!,
  token: process.env.UPSTASH_SEARCH_REST_TOKEN!,
});


type KnowledgeContent = {
  text: string;
  section: string;
  title?: string;
};


const index = search.index<KnowledgeContent>('knowledge-base');


async function main(prompt: string) {
  const { text } = await generateText({
    model: openai('gpt-4o'),
    prompt,
    stopWhen: stepCountIs(5),
    tools: {
      addResource: tool({
        description:
          'Add a new resource or piece of information to the knowledge base',
        inputSchema: z.object({
          resource: z
            .string()
            .describe('The content or resource to add to the knowledge base'),
          title: z
            .string()
            .optional()
            .describe('Optional title for the resource'),
        }),
        execute: async ({ resource, title }) => {
          const id = generateId();
          await index.upsert({
            id,
            content: {
              text: resource,
              section: 'user-added',
              title: title || `Resource ${id.slice(0, 8)}`,
            },
          });
          return `Successfully added resource "${title || 'Untitled'}" to knowledge base with ID: ${id}`;
        },
      }),
      searchKnowledge: tool({
        description:
          'Search the knowledge base to find relevant information for answering questions',
        inputSchema: z.object({
          query: z
            .string()
            .describe('The search query to find relevant information'),
          limit: z
            .number()
            .optional()
            .describe('Maximum number of results to return (default: 3)'),
        }),
        execute: async ({ query, limit = 3 }) => {
          const results = await index.search({
            query,
            limit,
            reranking: true,
          });


          if (results.length === 0) {
            return 'No relevant information found in the knowledge base.';
          }


          return results.map((hit, i) => ({
            resourceId: hit.id,
            rank: i + 1,
            title: hit.content.title || 'Untitled',
            content: hit.content.text || '',
            section: hit.content.section || 'unknown',
            score: hit.score,
          }));
        },
      }),
      deleteResource: tool({
        description: 'Delete a resource from the knowledge base',
        inputSchema: z.object({
          resourceId: z.string().describe('The ID of the resource to delete'),
        }),
        execute: async ({ resourceId }) => {
          try {
            await index.delete({ ids: [resourceId] });
            return `Successfully deleted resource with ID: ${resourceId}`;
          } catch (error) {
            return `Failed to delete resource: ${error instanceof Error ? error.message : 'Unknown error'}`;
          }
        },
      }),
    },
    // log out intermediate steps
    onStepFinish: ({ toolResults }) => {
      if (toolResults.length > 0) {
        console.log('Tool results:');
        console.dir(toolResults, { depth: null });
      }
    },
  });


  return text;
}


const question =
  'What are the two main things I worked on before college? (utilize knowledge base)';


main(question).then(console.log).catch(console.error);
```

## [Running the Agent](#running-the-agent)

Now let's run the agent:

```bash
pnpm tsx agent.ts
```

The agent will utilize the knowledge base to answer questions, add new resources, and delete existing ones as needed. You can modify the `question` variable to test different queries and interactions with the knowledge base.

[Previous

Retrieval Augmented Generation

](retrieval-augmented-generation.html)

[Next

Generate Text with Chat Prompt

](generate-text-with-chat-prompt.html)

On this page

[Getting Started](#getting-started)

[Project Setup](#project-setup)

[Setting Up the Knowledge Base](#setting-up-the-knowledge-base)

[Building the Knowledge Base Agent](#building-the-knowledge-base-agent)

[Running the Agent](#running-the-agent)

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