Guides: Get started with Claude 4

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

[Guides](../guides.html)Get started with Claude 4

# [Get started with Claude 4](#get-started-with-claude-4)

With the release of Claude 4, there has never been a better time to start building AI applications, particularly those that require complex reasoning capabilities and advanced intelligence.

The [AI SDK](../../index.html) is a powerful TypeScript toolkit for building AI applications with large language models (LLMs) like Claude 4 alongside popular frameworks like React, Next.js, Vue, Svelte, Node.js, and more.

## [Claude 4](#claude-4)

Claude 4 is Anthropic's most advanced model family to date, offering exceptional capabilities across reasoning, instruction following, coding, and knowledge tasks. Available in two variants—Sonnet and Opus—Claude 4 delivers state-of-the-art performance with enhanced reliability and control. Claude 4 builds on the extended thinking capabilities introduced in Claude 3.7, allowing for even more sophisticated problem-solving through careful, step-by-step reasoning.

Claude 4 excels at complex reasoning, code generation and analysis, detailed content creation, and agentic capabilities, making it ideal for powering sophisticated AI workflows, customer-facing agents, and applications requiring nuanced understanding and responses. Claude Opus 4 is an excellent coding model, leading on SWE-bench (72.5%) and Terminal-bench (43.2%), with the ability to sustain performance on long-running tasks that require focused effort and thousands of steps. Claude Sonnet 4 significantly improves on Sonnet 3.7, excelling in coding with 72.7% on SWE-bench while balancing performance and efficiency.

### [Prompt Engineering for Claude 4 Models](#prompt-engineering-for-claude-4-models)

Claude 4 models respond well to clear, explicit instructions. The following best practices can help achieve optimal performance:

1.  **Provide explicit instructions**: Clearly state what you want the model to do, including specific steps or formats for the response.
2.  **Include context and motivation**: Explain why a task is being performed to help the model better understand the underlying goals.
3.  **Avoid negative examples**: When providing examples, only demonstrate the behavior you want to see, not what you want to avoid.

## [Getting Started with the AI SDK](#getting-started-with-the-ai-sdk)

The AI SDK is the TypeScript toolkit designed to help developers build AI-powered applications with React, Next.js, Vue, Svelte, Node.js, and more. Integrating LLMs into applications is complicated and heavily dependent on the specific model provider you use.

The AI SDK abstracts away the differences between model providers, eliminates boilerplate code for building chatbots, and allows you to go beyond text output to generate rich, interactive components.

At the center of the AI SDK is [AI SDK Core](../../docs/ai-sdk-core/overview.html), which provides a unified API to call any LLM. The code snippet below is all you need to call Claude 4 Sonnet with the AI SDK:

```ts
import { anthropic } from '@ai-sdk/anthropic';
import { generateText } from 'ai';


const { text, reasoningText, reasoning } = await generateText({
  model: anthropic('claude-sonnet-4-20250514'),
  prompt: 'How will quantum computing impact cryptography by 2050?',
});
console.log(text);
```

### [Reasoning Ability](#reasoning-ability)

Claude 4 enhances the extended thinking capabilities first introduced in Claude 3.7 Sonnet—the ability to solve complex problems with careful, step-by-step reasoning. Additionally, both Opus 4 and Sonnet 4 can now use tools during extended thinking, allowing Claude to alternate between reasoning and tool use to improve responses. You can enable extended thinking using the `thinking` provider option and specifying a thinking budget in tokens. For interleaved thinking (where Claude can think in between tool calls) you'll need to enable a beta feature using the `anthropic-beta` header:

```ts
import { anthropic, AnthropicProviderOptions } from '@ai-sdk/anthropic';
import { generateText } from 'ai';


const { text, reasoningText, reasoning } = await generateText({
  model: anthropic('claude-sonnet-4-20250514'),
  prompt: 'How will quantum computing impact cryptography by 2050?',
  providerOptions: {
    anthropic: {
      thinking: { type: 'enabled', budgetTokens: 15000 },
    } satisfies AnthropicProviderOptions,
  },
  headers: {
    'anthropic-beta': 'interleaved-thinking-2025-05-14',
  },
});


console.log(text); // text response
console.log(reasoningText); // reasoning text
console.log(reasoning); // reasoning details including redacted reasoning
```

### [Building Interactive Interfaces](#building-interactive-interfaces)

AI SDK Core can be paired with [AI SDK UI](../../docs/ai-sdk-ui/overview.html), another powerful component of the AI SDK, to streamline the process of building chat, completion, and assistant interfaces with popular frameworks like Next.js, Nuxt, SvelteKit, and SolidStart.

AI SDK UI provides robust abstractions that simplify the complex tasks of managing chat streams and UI updates on the frontend, enabling you to develop dynamic AI-driven interfaces more efficiently.

With four main hooks — [`useChat`](../../docs/reference/ai-sdk-ui/use-chat.html), [`useCompletion`](../../docs/reference/ai-sdk-ui/use-completion.html), [`useObject`](../../docs/reference/ai-sdk-ui/use-object.html), and [`useAssistant`](https://ai-sdk.dev/docs/reference/ai-sdk-ui/use-assistant) — you can incorporate real-time chat capabilities, text completions, streamed JSON, and interactive assistant features into your app.

Let's explore building a chatbot with [Next.js](https://nextjs.org), the AI SDK, and Claude Sonnet 4:

In a new Next.js application, first install the AI SDK and the Anthropic provider:

pnpm install ai @ai-sdk/anthropic

Then, create a route handler for the chat endpoint:

```tsx
import { anthropic, AnthropicProviderOptions } from '@ai-sdk/anthropic';
import { streamText, convertToModelMessages, type UIMessage } from 'ai';


export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();


  const result = streamText({
    model: anthropic('claude-sonnet-4-20250514'),
    messages: convertToModelMessages(messages),
    headers: {
      'anthropic-beta': 'interleaved-thinking-2025-05-14',
    },
    providerOptions: {
      anthropic: {
        thinking: { type: 'enabled', budgetTokens: 15000 },
      } satisfies AnthropicProviderOptions,
    },
  });


  return result.toUIMessageStreamResponse({
    sendReasoning: true,
  });
}
```

You can forward the model's reasoning tokens to the client with `sendReasoning: true` in the `toUIMessageStreamResponse` method.

Finally, update the root page (`app/page.tsx`) to use the `useChat` hook:

```tsx
'use client';


import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useState } from 'react';


export default function Page() {
  const [input, setInput] = useState('');
  const { messages, sendMessage } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  });


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage({ text: input });
      setInput('');
    }
  };


  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto p-4">
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.map(message => (
          <div
            key={message.id}
            className={`p-3 rounded-lg ${
              message.role === 'user' ? 'bg-blue-50 ml-auto' : 'bg-gray-50'
            }`}
          >
            <p className="font-semibold">
              {message.role === 'user' ? 'You' : 'Claude 4'}
            </p>
            {message.parts.map((part, index) => {
              if (part.type === 'text') {
                return (
                  <div key={index} className="mt-1">
                    {part.text}
                  </div>
                );
              }
              if (part.type === 'reasoning') {
                return (
                  <pre
                    key={index}
                    className="bg-gray-100 p-2 rounded mt-2 text-xs overflow-x-auto"
                  >
                    <details>
                      <summary className="cursor-pointer">
                        View reasoning
                      </summary>
                      {part.text}
                    </details>
                  </pre>
                );
              }
            })}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          name="prompt"
          value={input}
          onChange={e => setInput(e.target.value)}
          className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ask Claude 4 something..."
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Send
        </button>
      </form>
    </div>
  );
}
```

You can access the model's reasoning tokens with the `reasoning` part on the message `parts`. The reasoning text is available in the `text` property of the reasoning part.

The useChat hook on your root page (`app/page.tsx`) will make a request to your LLM provider endpoint (`app/api/chat/route.ts`) whenever the user submits a message. The messages are then displayed in the chat UI.

### [Claude 4 Model Variants](#claude-4-model-variants)

Claude 4 is available in two variants, each optimized for different use cases:

-   **Claude Sonnet 4**: Balanced performance suitable for most enterprise applications, with significant improvements over Sonnet 3.7.
-   **Claude Opus 4**: Anthropic's most powerful model and the best coding model available. Excels at sustained performance on long-running tasks that require focused effort and thousands of steps, with the ability to work continuously for several hours.

## [Get Started](#get-started)

Ready to dive in? Here's how you can begin:

1.  Explore the documentation at [ai-sdk.dev/docs](../../docs/introduction.html) to understand the capabilities of the AI SDK.
2.  Check out practical examples at [ai-sdk.dev/examples](../../cookbook.html) to see the SDK in action.
3.  Dive deeper with advanced guides on topics like Retrieval-Augmented Generation (RAG) at [ai-sdk.dev/docs/guides](../guides.html).
4.  Use ready-to-deploy AI templates at [vercel.com/templates?type=ai](https://vercel.com/templates?type=ai).

[Previous

Get started with Gemini 2.5

](gemini-2-5.html)

[Next

OpenAI Responses API

](openai-responses.html)

On this page

[Get started with Claude 4](#get-started-with-claude-4)

[Claude 4](#claude-4)

[Prompt Engineering for Claude 4 Models](#prompt-engineering-for-claude-4-models)

[Getting Started with the AI SDK](#getting-started-with-the-ai-sdk)

[Reasoning Ability](#reasoning-ability)

[Building Interactive Interfaces](#building-interactive-interfaces)

[Claude 4 Model Variants](#claude-4-model-variants)

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