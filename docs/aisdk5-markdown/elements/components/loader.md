Chatbot: Loader

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
    
    ](../overview.html)
-   [AI GatewayGateway](https://vercel.com/ai-gateway)

AI SDK 5 is available now.

[View Announcement](https://vercel.com/blog/ai-sdk-5)

Menu

[Introduction](../overview.html)

[Setup](../overview/setup.html)

[Usage](../overview/usage.html)

[Troubleshooting](../overview/troubleshooting.html)

[Examples](../examples.html)

[Chatbot](../examples/chatbot.html)

[v0 clone](../examples/v0.html)

[Workflow](../examples/workflow.html)

[Components](../components.html)

[Chatbot](chatbot.html)

[Actions](actions.html)

[Branch](branch.html)

[Chain of Thought](chain-of-thought.html)

[Code Block](code-block.html)

[Context](context.html)

[Conversation](conversation.html)

[Image](image.html)

[Inline Citation](inline-citation.html)

[Loader](loader.html)

[Message](message.html)

[Open In Chat](open-in-chat.html)

[Plan](plan.html)

[Prompt Input](prompt-input.html)

[Queue](queue.html)

[Reasoning](reasoning.html)

[Response](response.html)

[Shimmer](shimmer.html)

[Sources](sources.html)

[Suggestion](suggestion.html)

[Task](task.html)

[Tool](tool.html)

[Workflow](workflow.html)

[Canvas](canvas.html)

[Connection](connection.html)

[Controls](controls.html)

[Edge](edge.html)

[Node](node.html)

[Panel](panel.html)

[Toolbar](toolbar.html)

[Vibe Coding](vibe-coding.html)

[Artifact](artifact.html)

[Web Preview](web-preview.html)

[Components](../components.html)Loader

# [Loader](#loader)

The `Loader` component provides a spinning animation to indicate loading states in your AI applications. It includes both a customizable wrapper component and the underlying icon for flexible usage.

CodePreview

Loader

## [Installation](#installation)

ai-elementsshadcnManual

npx ai-elements@latest add loader

## [Usage](#usage)

```tsx
import { Loader } from '@/components/ai-elements/loader';
```

```tsx
<Loader />
```

## [Usage with AI SDK](#usage-with-ai-sdk)

Build a simple chat app that displays a loader before it the response streans by using `status === "submitted"`.

Add the following component to your frontend:

```tsx
'use client';


import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import { Message, MessageContent } from '@/components/ai-elements/message';
import {
  Input,
  PromptInputTextarea,
  PromptInputSubmit,
} from '@/components/ai-elements/prompt-input';
import { Loader } from '@/components/ai-elements/loader';
import { useState } from 'react';
import { useChat } from '@ai-sdk/react';


const LoaderDemo = () => {
  const [input, setInput] = useState('');
  const { messages, sendMessage, status } = useChat();


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage({ text: input });
      setInput('');
    }
  };


  return (
    <div className="max-w-4xl mx-auto p-6 relative size-full rounded-lg border h-[600px]">
      <div className="flex flex-col h-full">
        <Conversation>
          <ConversationContent>
            {messages.map((message) => (
              <Message from={message.role} key={message.id}>
                <MessageContent>
                  {message.parts.map((part, i) => {
                    switch (part.type) {
                      case 'text':
                        return (
                          <div key={`${message.id}-${i}`}>{part.text}</div>
                        );
                      default:
                        return null;
                    }
                  })}
                </MessageContent>
              </Message>
            ))}
            {status === 'submitted' && <Loader />}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>


        <Input
          onSubmit={handleSubmit}
          className="mt-4 w-full max-w-2xl mx-auto relative"
        >
          <PromptInputTextarea
            value={input}
            placeholder="Say something..."
            onChange={(e) => setInput(e.currentTarget.value)}
            className="pr-12"
          />
          <PromptInputSubmit
            status={status === 'streaming' ? 'streaming' : 'ready'}
            disabled={!input.trim()}
            className="absolute bottom-1 right-1"
          />
        </Input>
      </div>
    </div>
  );
};


export default LoaderDemo;
```

Add the following route to your backend:

```ts
import { streamText, UIMessage, convertToModelMessages } from 'ai';


// Allow streaming responses up to 30 seconds
export const maxDuration = 30;


export async function POST(req: Request) {
  const { model, messages }: { messages: UIMessage[]; model: string } =
    await req.json();


  const result = streamText({
    model: 'openai/gpt-4o',
    messages: convertToModelMessages(messages),
  });


  return result.toUIMessageStreamResponse();
}
```

## [Features](#features)

-   Clean, modern spinning animation using CSS animations
-   Configurable size with the `size` prop
-   Customizable styling with CSS classes
-   Built-in `animate-spin` animation with proper centering
-   Exports both `AILoader` wrapper and `LoaderIcon` for flexible usage
-   Supports all standard HTML div attributes
-   TypeScript support with proper type definitions
-   Optimized SVG icon with multiple opacity levels for smooth animation
-   Uses `currentColor` for proper theme integration
-   Responsive and accessible design

## [Examples](#examples)

### [Different Sizes](#different-sizes)

CodePreview

Small (16px)

Loader

Medium (24px)

Loader

Large (32px)

Loader

Extra Large (48px)

Loader

### [Custom Styling](#custom-styling)

CodePreview

Blue

Loader

Green

Loader

Purple

Loader

Orange

Loader

Slow Animation

Loader

Fast Animation

Loader

With Background

Loader

Dark Background

Loader

## [Props](#props)

### [`<Loader />`](#loader-)

### size?:

number

The size (width and height) of the loader in pixels. Defaults to 16.

### \[...props\]?:

React.HTMLAttributes<HTMLDivElement>

Any other props are spread to the root div.

[Previous

Inline Citation

](inline-citation.html)

[Next

Message

](message.html)

On this page

[Loader](#loader)

[Installation](#installation)

[Usage](#usage)

[Usage with AI SDK](#usage-with-ai-sdk)

[Features](#features)

[Examples](#examples)

[Different Sizes](#different-sizes)

[Custom Styling](#custom-styling)

[Props](#props)

[<Loader />](#loader-)

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