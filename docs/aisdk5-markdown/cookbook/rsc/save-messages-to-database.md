React Server Components: Save Messages To Database

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

[React Server Components](generate-text.html)

[Generate Text](generate-text.html)

[Generate Text with Chat Prompt](generate-text-with-chat-prompt.html)

[Stream Text](stream-text.html)

[Stream Text with Chat Prompt](stream-text-with-chat-prompt.html)

[Generate Object](generate-object.html)

[Stream Object](stream-object.html)

[Call Tools](call-tools.html)

[Call Tools in Parallel](call-tools-in-parallel.html)

[Save Messages To Database](save-messages-to-database.html)

[Restore Messages From Database](restore-messages-from-database.html)

[Render Visual Interface in Chat](render-visual-interface-in-chat.html)

[Stream Updates to Visual Interfaces](stream-updates-to-visual-interfaces.html)

[Record Token Usage after Streaming User Interfaces](stream-ui-record-token-usage.html)

[React Server Components](generate-text.html)Save Messages To Database

# [Save Messages To Database](#save-messages-to-database)

Sometimes conversations with language models can get interesting and you might want to save the state of so you can revisit it or continue the conversation later.

`createAI` has an experimental callback function called `onSetAIState` that gets called whenever the AI state changes. You can use this to save the AI state to a file or a database.

## [Client](#client)

```tsx
import { ServerMessage } from './actions';
import { AI } from './ai';


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // get chat history from database
  const history: ServerMessage[] = getChat();


  return (
    <html lang="en">
      <body>
        <AI initialAIState={history} initialUIState={[]}>
          {children}
        </AI>
      </body>
    </html>
  );
}
```

```tsx
'use client';


import { useState } from 'react';
import { ClientMessage } from './actions';
import { useActions, useUIState } from '@ai-sdk/rsc';
import { generateId } from 'ai';


// Allow streaming responses up to 30 seconds
export const maxDuration = 30;


export default function Home() {
  const [input, setInput] = useState<string>('');
  const [conversation, setConversation] = useUIState();
  const { continueConversation } = useActions();


  return (
    <div>
      <div>
        {conversation.map((message: ClientMessage) => (
          <div key={message.id}>
            {message.role}: {message.display}
          </div>
        ))}
      </div>


      <div>
        <input
          type="text"
          value={input}
          onChange={event => {
            setInput(event.target.value);
          }}
        />
        <button
          onClick={async () => {
            setConversation((currentConversation: ClientMessage[]) => [
              ...currentConversation,
              { id: generateId(), role: 'user', display: input },
            ]);


            const message = await continueConversation(input);


            setConversation((currentConversation: ClientMessage[]) => [
              ...currentConversation,
              message,
            ]);
          }}
        >
          Send Message
        </button>
      </div>
    </div>
  );
}
```

## [Server](#server)

We will use the callback function to listen to state changes and save the conversation once we receive a `done` event.

```tsx
'use server';


import { getAIState, getMutableAIState, streamUI } from '@ai-sdk/rsc';
import { openai } from '@ai-sdk/openai';
import { ReactNode } from 'react';
import { z } from 'zod';
import { generateId } from 'ai';
import { Stock } from '@ai-studio/components/stock';


export interface ServerMessage {
  role: 'user' | 'assistant' | 'function';
  content: string;
}


export interface ClientMessage {
  id: string;
  role: 'user' | 'assistant' | 'function';
  display: ReactNode;
}


export async function continueConversation(
  input: string,
): Promise<ClientMessage> {
  'use server';


  const history = getMutableAIState();


  const result = await streamUI({
    model: openai('gpt-3.5-turbo'),
    messages: [...history.get(), { role: 'user', content: input }],
    text: ({ content, done }) => {
      if (done) {
        history.done([
          ...history.get(),
          { role: 'user', content: input },
          { role: 'assistant', content },
        ]);
      }


      return <div>{content}</div>;
    },
    tools: {
      showStockInformation: {
        description:
          'Get stock information for symbol for the last numOfMonths months',
        inputSchema: z.object({
          symbol: z
            .string()
            .describe('The stock symbol to get information for'),
          numOfMonths: z
            .number()
            .describe('The number of months to get historical information for'),
        }),
        generate: async ({ symbol, numOfMonths }) => {
          history.done([
            ...history.get(),
            {
              role: 'function',
              name: 'showStockInformation',
              content: JSON.stringify({ symbol, numOfMonths }),
            },
          ]);


          return <Stock symbol={symbol} numOfMonths={numOfMonths} />;
        },
      },
    },
  });


  return {
    id: generateId(),
    role: 'assistant',
    display: result.value,
  };
}
```

```ts
import { createAI } from '@ai-sdk/rsc';
import { ServerMessage, ClientMessage, continueConversation } from './actions';


export const AI = createAI<ServerMessage[], ClientMessage[]>({
  actions: {
    continueConversation,
  },
  onSetAIState: async ({ state, done }) => {
    'use server';


    if (done) {
      saveChat(state);
    }
  },
  onGetUIState: async () => {
    'use server';


    const history: ServerMessage[] = getAIState();


    return history.map(({ role, content }) => ({
      id: generateId(),
      role,
      display:
        role === 'function' ? <Stock {...JSON.parse(content)} /> : content,
    }));
  },
});
```

[Previous

Call Tools in Parallel

](call-tools-in-parallel.html)

[Next

Restore Messages From Database

](restore-messages-from-database.html)

On this page

[Save Messages To Database](#save-messages-to-database)

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