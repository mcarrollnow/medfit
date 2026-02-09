Next.js: Render Visual Interface in Chat

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

[Next.js](generate-text.html)Render Visual Interface in Chat

# [Render Visual Interface in Chat](#render-visual-interface-in-chat)

An interesting consequence of language models that can call [tools](../../docs/ai-sdk-core/tools-and-tool-calling.html) is that this ability can be used to render visual interfaces by streaming React components to the client.

http://localhost:3000

User: How is it going?

Assistant: All good, how may I help you?

What is the weather in San Francisco?

Send Message

## [Client](#client)

Let's build an assistant that gets the weather for any city by calling the `getWeatherInformation` tool. Instead of returning text during the tool call, you will render a React component that displays the weather information on the client.

```tsx
'use client';


import { useChat } from '@ai-sdk/react';
import {
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithToolCalls,
} from 'ai';
import { useState } from 'react';
import { ChatMessage } from './api/chat/route';


export default function Chat() {
  const [input, setInput] = useState('');
  const { messages, sendMessage, addToolResult } = useChat<ChatMessage>({
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),


    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,


    // run client-side tools that are automatically executed:
    async onToolCall({ toolCall }) {
      if (toolCall.toolName === 'getLocation') {
        const cities = ['New York', 'Los Angeles', 'Chicago', 'San Francisco'];


        // No await - avoids potential deadlocks
        addToolResult({
          tool: 'getLocation',
          toolCallId: toolCall.toolCallId,
          output: cities[Math.floor(Math.random() * cities.length)],
        });
      }
    },
  });


  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch gap-4">
      {messages?.map(m => (
        <div key={m.id} className="whitespace-pre-wrap flex flex-col gap-1">
          <strong>{`${m.role}: `}</strong>
          {m.parts?.map((part, i) => {
            switch (part.type) {
              case 'text':
                return <div key={m.id + i}>{part.text}</div>;
              // render confirmation tool (client-side tool with user interaction)
              case 'tool-askForConfirmation':
                return (
                  <div
                    key={part.toolCallId}
                    className="text-gray-500 flex flex-col gap-2"
                  >
                    <div className="flex gap-2">
                      {part.state === 'output-available' ? (
                        <b>{part.output}</b>
                      ) : (
                        <>
                          <button
                            className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
                            onClick={() =>
                              addToolResult({
                                tool: 'askForConfirmation',
                                toolCallId: part.toolCallId,
                                output: 'Yes, confirmed.',
                              })
                            }
                          >
                            Yes
                          </button>
                          <button
                            className="px-4 py-2 font-bold text-white bg-red-500 rounded hover:bg-red-700"
                            onClick={() =>
                              addToolResult({
                                tool: 'askForConfirmation',
                                toolCallId: part.toolCallId,
                                output: 'No, denied',
                              })
                            }
                          >
                            No
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );


              // other tools:
              case 'tool-getWeatherInformation':
                if (part.state === 'output-available') {
                  return (
                    <div
                      key={part.toolCallId}
                      className="flex flex-col gap-2 p-4 bg-blue-400 rounded-lg"
                    >
                      <div className="flex flex-row justify-between items-center">
                        <div className="text-4xl text-blue-50 font-medium">
                          {part.output.value}°
                          {part.output.unit === 'celsius' ? 'C' : 'F'}
                        </div>


                        <div className="h-9 w-9 bg-amber-400 rounded-full flex-shrink-0" />
                      </div>
                      <div className="flex flex-row gap-2 text-blue-50 justify-between">
                        {part.output.weeklyForecast.map(forecast => (
                          <div
                            key={forecast.day}
                            className="flex flex-col items-center"
                          >
                            <div className="text-xs">{forecast.day}</div>
                            <div>{forecast.value}°</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
                break;
              case 'tool-getLocation':
                if (part.state === 'output-available') {
                  return (
                    <div
                      key={part.toolCallId}
                      className="text-gray-500 bg-gray-100 rounded-lg p-4"
                    >
                      User is in {part.output}.
                    </div>
                  );
                } else {
                  return (
                    <div key={part.toolCallId} className="text-gray-500">
                      Calling getLocation...
                    </div>
                  );
                }


              default:
                break;
            }
          })}
        </div>
      ))}


      <form
        onSubmit={e => {
          e.preventDefault();
          sendMessage({ text: input });
          setInput('');
        }}
      >
        <input
          className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={e => setInput(e.currentTarget.value)}
        />
      </form>
    </div>
  );
}
```

## [Server](#server)

```tsx
import { openai } from '@ai-sdk/openai';
import {
  type InferUITools,
  type ToolSet,
  type UIDataTypes,
  type UIMessage,
  convertToModelMessages,
  stepCountIs,
  streamText,
  tool,
} from 'ai';
import { z } from 'zod';


const tools = {
  getWeatherInformation: tool({
    description: 'show the weather in a given city to the user',
    inputSchema: z.object({ city: z.string() }),
    execute: async ({}: { city: string }) => {
      return {
        value: 24,
        unit: 'celsius',
        weeklyForecast: [
          { day: 'Monday', value: 24 },
          { day: 'Tuesday', value: 25 },
          { day: 'Wednesday', value: 26 },
          { day: 'Thursday', value: 27 },
          { day: 'Friday', value: 28 },
          { day: 'Saturday', value: 29 },
          { day: 'Sunday', value: 30 },
        ],
      };
    },
  }),
  // client-side tool that starts user interaction:
  askForConfirmation: tool({
    description: 'Ask the user for confirmation.',
    inputSchema: z.object({
      message: z.string().describe('The message to ask for confirmation.'),
    }),
  }),
  // client-side tool that is automatically executed on the client:
  getLocation: tool({
    description:
      'Get the user location. Always ask for confirmation before using this tool.',
    inputSchema: z.object({}),
  }),
} satisfies ToolSet;


export type ChatTools = InferUITools<typeof tools>;


export type ChatMessage = UIMessage<never, UIDataTypes, ChatTools>;


export async function POST(request: Request) {
  const { messages }: { messages: ChatMessage[] } = await request.json();


  const result = streamText({
    model: openai('gpt-4.1'),
    messages: convertToModelMessages(messages),
    tools,
    stopWhen: stepCountIs(5),
  });


  return result.toUIMessageStreamResponse();
}
```

[Previous

Send Custom Body from useChat

](send-custom-body-from-use-chat.html)

[Next

Node

](../node/generate-text.html)

On this page

[Render Visual Interface in Chat](#render-visual-interface-in-chat)

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