Node: Manual Agent Loop

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

[Node](generate-text.html)Manual Agent Loop

# [Manual Agent Loop](#manual-agent-loop)

When you need complete control over the agentic loop and tool execution, you can manage the agent flow yourself rather than using `prepareStep` and `stopWhen`. This approach gives you full flexibility over when and how tools are executed, message history management, and loop termination conditions.

This pattern is useful when you want to:

-   Implement custom logic between tool calls
-   Handle tool execution errors in specific ways
-   Add custom logging or monitoring
-   Integrate with external systems during the loop
-   Have complete control over the conversation history

## [Example](#example)

```ts
import { openai } from '@ai-sdk/openai';
import { ModelMessage, streamText, tool } from 'ai';
import 'dotenv/config';
import z from 'zod';


const getWeather = async ({ location }: { location: string }) => {
  return `The weather in ${location} is ${Math.floor(Math.random() * 100)} degrees.`;
};


const messages: ModelMessage[] = [
  {
    role: 'user',
    content: 'Get the weather in New York and San Francisco',
  },
];


async function main() {
  while (true) {
    const result = streamText({
      model: openai('gpt-4o'),
      messages,
      tools: {
        getWeather: tool({
          description: 'Get the current weather in a given location',
          inputSchema: z.object({
            location: z.string(),
          }),
        }),
        // add more tools here, omitting the execute function so you handle it yourself
      },
    });


    // Stream the response (only necessary for providing updates to the user)
    for await (const chunk of result.fullStream) {
      if (chunk.type === 'text-delta') {
        process.stdout.write(chunk.text);
      }


      if (chunk.type === 'tool-call') {
        console.log('\\nCalling tool:', chunk.toolName);
      }
    }


    // Add LLM generated messages to the message history
    const responseMessages = (await result.response).messages;
    messages.push(...responseMessages);


    const finishReason = await result.finishReason;


    if (finishReason === 'tool-calls') {
      const toolCalls = await result.toolCalls;


      // Handle all tool call execution here
      for (const toolCall of toolCalls) {
        if (toolCall.toolName === 'getWeather') {
          const toolOutput = await getWeather(toolCall.input);
          messages.push({
            role: 'tool',
            content: [
              {
                toolName: toolCall.toolName,
                toolCallId: toolCall.toolCallId,
                type: 'tool-result',
                output: { type: 'text', value: toolOutput }, // update depending on the tool's output format
              },
            ],
          });
        }
        // Handle other tool calls
      }
    } else {
      // Exit the loop when the model doesn't request to use any more tools
      console.log('\\n\\nFinal message history:');
      console.dir(messages, { depth: null });
      break;
    }
  }
}


main().catch(console.error);
```

## [Key Concepts](#key-concepts)

### [Message Management](#message-management)

The example maintains a `messages` array that tracks the entire conversation history. After each model response, the generated messages are added to this history:

```ts
const responseMessages = (await result.response).messages;
messages.push(...responseMessages);
```

### [Tool Execution Control](#tool-execution-control)

Tool execution is handled manually in the loop. When the model requests tool calls, you process each one individually:

```ts
if (finishReason === 'tool-calls') {
  const toolCalls = await result.toolCalls;


  for (const toolCall of toolCalls) {
    if (toolCall.toolName === 'getWeather') {
      const toolOutput = await getWeather(toolCall.input);
      // Add tool result to message history
      messages.push({
        role: 'tool',
        content: [
          {
            toolName: toolCall.toolName,
            toolCallId: toolCall.toolCallId,
            type: 'tool-result',
            output: { type: 'text', value: toolOutput },
          },
        ],
      });
    }
  }
}
```

### [Loop Termination](#loop-termination)

The loop continues until the model stops requesting tool calls. You can customize this logic to implement your own termination conditions:

```ts
if (finishReason === 'tool-calls') {
  // Continue the loop
} else {
  // Exit the loop
  break;
}
```

## [Extending This Example](#extending-this-example)

### [Custom Loop Control](#custom-loop-control)

Implement maximum iterations or time limits:

```ts
let iterations = 0;
const MAX_ITERATIONS = 10;


while (iterations < MAX_ITERATIONS) {
  iterations++;
  // ... rest of the loop
}
```

### [Parallel Tool Execution](#parallel-tool-execution)

Execute multiple tools in parallel for better performance:

```ts
const toolPromises = toolCalls.map(async toolCall => {
  if (toolCall.toolName === 'getWeather') {
    const toolOutput = await getWeather(toolCall.input);
    return {
      role: 'tool' as const,
      content: [
        {
          toolName: toolCall.toolName,
          toolCallId: toolCall.toolCallId,
          type: 'tool-result' as const,
          output: { type: 'text' as const, value: toolOutput },
        },
      ],
    };
  }
  // Handle other tools
});


const toolResults = await Promise.all(toolPromises);
messages.push(...toolResults.filter(Boolean));
```

This manual approach gives you complete control over the agentic loop while still leveraging the AI SDK's powerful streaming and tool calling capabilities.

[Previous

Model Context Protocol (MCP) Tools

](mcp-tools.html)

[Next

Web Search Agent

](web-search-agent.html)

On this page

[Manual Agent Loop](#manual-agent-loop)

[Example](#example)

[Key Concepts](#key-concepts)

[Message Management](#message-management)

[Tool Execution Control](#tool-execution-control)

[Loop Termination](#loop-termination)

[Extending This Example](#extending-this-example)

[Custom Loop Control](#custom-loop-control)

[Parallel Tool Execution](#parallel-tool-execution)

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