React Server Components: Stream Text with Chat Prompt

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

[React Server Components](generate-text.html)Stream Text with Chat Prompt

# [Stream Text with Chat Prompt](#stream-text-with-chat-prompt)

Chat completion can sometimes take a long time to finish, especially when the response is big. In such cases, it is useful to stream the chat completion to the client in real-time. This allows the client to display the new message as it is being generated by the model, rather than have users wait for it to finish.

http://localhost:3000

User: How is it going?

Assistant: All good, how may I help you?

Why is the sky blue?

Send Message

## [Client](#client)

Let's create a simple conversation between a user and a model, and place a button that will call `continueConversation`.

```tsx
'use client';


import { useState } from 'react';
import { Message, continueConversation } from './actions';
import { readStreamableValue } from '@ai-sdk/rsc';


// Allow streaming responses up to 30 seconds
export const maxDuration = 30;


export default function Home() {
  const [conversation, setConversation] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');


  return (
    <div>
      <div>
        {conversation.map((message, index) => (
          <div key={index}>
            {message.role}: {message.content}
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
            const { messages, newMessage } = await continueConversation([
              ...conversation,
              { role: 'user', content: input },
            ]);


            let textContent = '';


            for await (const delta of readStreamableValue(newMessage)) {
              textContent = `${textContent}${delta}`;


              setConversation([
                ...messages,
                { role: 'assistant', content: textContent },
              ]);
            }
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

Now, let's implement the `continueConversation` function that will insert the user's message into the conversation and stream back the new message.

```typescript
'use server';


import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { createStreamableValue } from '@ai-sdk/rsc';


export interface Message {
  role: 'user' | 'assistant';
  content: string;
}


export async function continueConversation(history: Message[]) {
  'use server';


  const stream = createStreamableValue();


  (async () => {
    const { textStream } = streamText({
      model: openai('gpt-3.5-turbo'),
      system:
        "You are a dude that doesn't drop character until the DVD commentary.",
      messages: history,
    });


    for await (const text of textStream) {
      stream.update(text);
    }


    stream.done();
  })();


  return {
    messages: history,
    newMessage: stream.value,
  };
}
```

[Previous

Stream Text

](stream-text.html)

[Next

Generate Object

](generate-object.html)

On this page

[Stream Text with Chat Prompt](#stream-text-with-chat-prompt)

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