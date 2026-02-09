Next.js: Generate Image with Chat Prompt

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

[Next.js](generate-text.html)Generate Image with Chat Prompt

# [Generate Image with Chat Prompt](#generate-image-with-chat-prompt)

When building a chatbot, you may want to allow the user to generate an image. This can be done by creating a tool that generates an image using the [`experimental_generateImage`](../../docs/reference/ai-sdk-core/generate-image.html#generateimage) function from the AI SDK.

## [Server](#server)

Let's create an endpoint at `/api/chat` that generates the assistant's response based on the conversation history. You will also define a tool called `generateImage` that will generate an image based on the assistant's response.

```typescript
import { openai } from '@ai-sdk/openai';
import { experimental_generateImage, tool } from 'ai';
import z from 'zod';


export const generateImage = tool({
  description: 'Generate an image',
  inputSchema: z.object({
    prompt: z.string().describe('The prompt to generate the image from'),
  }),
  execute: async ({ prompt }) => {
    const { image } = await experimental_generateImage({
      model: openai.imageModel('dall-e-3'),
      prompt,
    });
    // in production, save this image to blob storage and return a URL
    return { image: image.base64, prompt };
  },
});
```

```typescript
import { openai } from '@ai-sdk/openai';
import {
  convertToModelMessages,
  type InferUITools,
  stepCountIs,
  streamText,
  type UIMessage,
} from 'ai';


import { generateImage } from '@/tools/generate-image';


const tools = {
  generateImage,
};


export type ChatTools = InferUITools<typeof tools>;


export async function POST(request: Request) {
  const { messages }: { messages: UIMessage[] } = await request.json();


  const result = streamText({
    model: openai('gpt-4o'),
    messages: convertToModelMessages(messages),
    stopWhen: stepCountIs(5),
    tools,
  });


  return result.toUIMessageStreamResponse();
}
```

In production, you should save the generated image to a blob storage and return a URL instead of the base64 image data. If you don't, the base64 image data will be sent to the model which may cause the generation to fail.

## [Client](#client)

Let's create a simple chat interface with `useChat`. You will call the `/api/chat` endpoint to generate the assistant's response. If the assistant's response contains a `generateImage` tool invocation, you will display the tool result (the image in base64 format and the prompt) using the Next `Image` component.

```tsx
'use client';


import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, type UIMessage } from 'ai';
import Image from 'next/image';
import { type FormEvent, useState } from 'react';
import type { ChatTools } from './api/chat/route';


type ChatMessage = UIMessage<never, never, ChatTools>;


export default function Chat() {
  const [input, setInput] = useState('');


  const { messages, sendMessage } = useChat<ChatMessage>({
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
  });


  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };


  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();


    sendMessage({
      parts: [{ type: 'text', text: input }],
    });


    setInput('');
  };


  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      <div className="space-y-4">
        {messages.map(message => (
          <div key={message.id} className="whitespace-pre-wrap">
            <div key={message.id}>
              <div className="font-bold">{message.role}</div>
              {message.parts.map((part, partIndex) => {
                const { type } = part;


                if (type === 'text') {
                  return (
                    <div key={`${message.id}-part-${partIndex}`}>
                      {part.text}
                    </div>
                  );
                }


                if (type === 'tool-generateImage') {
                  const { state, toolCallId } = part;


                  if (state === 'input-available') {
                    return (
                      <div key={`${message.id}-part-${partIndex}`}>
                        Generating image...
                      </div>
                    );
                  }


                  if (state === 'output-available') {
                    const { input, output } = part;


                    return (
                      <Image
                        key={toolCallId}
                        src={`data:image/png;base64,${output.image}`}
                        alt={input.prompt}
                        height={400}
                        width={400}
                      />
                    );
                  }
                }
              })}
            </div>
          </div>
        ))}
      </div>


      <form onSubmit={handleSubmit}>
        <input
          className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
```

[Previous

Generate Text with Chat Prompt

](generate-text-with-chat-prompt.html)

[Next

Caching Middleware

](caching-middleware.html)

On this page

[Generate Image with Chat Prompt](#generate-image-with-chat-prompt)

[Server](#server)

[Client](#client)

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