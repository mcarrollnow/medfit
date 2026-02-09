Next.js: Generate Object with File Prompt through Form Submission

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

[Next.js](generate-text.html)

[Generate Text](generate-text.html)

[Generate Text with Chat Prompt](generate-text-with-chat-prompt.html)

[Generate Image with Chat Prompt](generate-image-with-chat-prompt.html)

[Stream Text](stream-text.html)

[Stream Text with Chat Prompt](stream-text-with-chat-prompt.html)

[Stream Text with Image Prompt](stream-text-with-image-prompt.html)

[Chat with PDFs](chat-with-pdf.html)

[streamText Multi-Step Cookbook](stream-text-multistep.html)

[Markdown Chatbot with Memoization](markdown-chatbot-with-memoization.html)

[Generate Object](generate-object.html)

[Generate Object with File Prompt through Form Submission](generate-object-with-file-prompt.html)

[Stream Object](stream-object.html)

[Call Tools](call-tools.html)

[Call Tools in Multiple Steps](call-tools-multiple-steps.html)

[Model Context Protocol (MCP) Tools](mcp-tools.html)

[Share useChat State Across Components](use-shared-chat-context.html)

[Human-in-the-Loop Agent with Next.js](human-in-the-loop.html)

[Send Custom Body from useChat](send-custom-body-from-use-chat.html)

[Render Visual Interface in Chat](render-visual-interface-in-chat.html)

[Caching Middleware](caching-middleware.html)

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

[Next.js](generate-text.html)Generate Object with File Prompt through Form Submission

# [Generate Object with File Prompt through Form Submission](#generate-object-with-file-prompt-through-form-submission)

This feature is limited to models/providers that support PDF inputs ([Anthropic](../../providers/ai-sdk-providers/anthropic.html#pdf-support), [OpenAI](../../providers/ai-sdk-providers/openai.html#pdf-support), [Google Gemini](../../providers/ai-sdk-providers/google-generative-ai.html#file-inputs), and [Google Vertex](../../providers/ai-sdk-providers/google-vertex.html#file-inputs)).

With select models, you can send PDFs (files) as part of your prompt. Let's create a simple Next.js application that allows a user to upload a PDF send it to an LLM for summarization.

## [Client](#client)

On the frontend, create a form that allows the user to upload a PDF. When the form is submitted, send the PDF to the `/api/analyze` route.

```tsx
'use client';


import { useState } from 'react';


export default function Page() {
  const [description, setDescription] = useState<string>();
  const [loading, setLoading] = useState(false);


  return (
    <div>
      <form
        action={async formData => {
          try {
            setLoading(true);
            const response = await fetch('/api/analyze', {
              method: 'POST',
              body: formData,
            });
            setLoading(false);


            if (response.ok) {
              setDescription(await response.text());
            }
          } catch (error) {
            console.error('Analysis failed:', error);
          }
        }}
      >
        <div>
          <label>Upload Image</label>
          <input name="pdf" type="file" accept="application/pdf" />
        </div>
        <button type="submit" disabled={loading}>
          Submit{loading && 'ing...'}
        </button>
      </form>
      {description && (
        <pre>{JSON.stringify(JSON.parse(description), null, 2)}</pre>
      )}
    </div>
  );
}
```

## [Server](#server)

On the server, create an API route that receives the PDF, sends it to the LLM, and returns the result. This example uses the [`generateObject`](../../docs/reference/ai-sdk-core/generate-object.html) function to generate the summary as part of a structured output.

```typescript
import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';


export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('pdf') as File;


  // Convert the file's arrayBuffer to a Base64 data URL
  const arrayBuffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);


  // Convert Uint8Array to an array of characters
  const charArray = Array.from(uint8Array, byte => String.fromCharCode(byte));
  const binaryString = charArray.join('');
  const base64Data = btoa(binaryString);
  const fileDataUrl = `data:application/pdf;base64,${base64Data}`;


  const result = await generateObject({
    model: openai('gpt-4o'),
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'Analyze the following PDF and generate a summary.',
          },
          {
            type: 'file',
            data: fileDataUrl,
            mediaType: 'application/pdf',
          },
        ],
      },
    ],
    schema: z.object({
      people: z
        .object({
          name: z.string().describe('The name of the person.'),
          age: z.number().min(0).describe('The age of the person.'),
        })
        .array()
        .describe('An array of people.'),
    }),
  });


  return Response.json(result.object);
}
```

[Previous

Generate Object

](generate-object.html)

[Next

Stream Object

](stream-object.html)

On this page

[Generate Object with File Prompt through Form Submission](#generate-object-with-file-prompt-through-form-submission)

[Client](#client)

[Server](#server)

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