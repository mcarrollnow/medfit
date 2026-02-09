Chatbot: Message

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

[Components](../components.html)Message

# [Message](#message)

The `Message` component displays a chat interface message from either a user or an AI. It includes an avatar, a name, and a message content.

CodePreview

Hello, how are you?

Ha

## [Installation](#installation)

ai-elementsshadcnManual

npx ai-elements@latest add message

## [Usage](#usage)

```tsx
import { Message, MessageContent } from '@/components/ai-elements/message';
```

```tsx
// Default contained variant
<Message from="user">
  <MessageContent>Hi there!</MessageContent>
</Message>


// Flat variant for a minimalist look
<Message from="assistant">
  <MessageContent variant="flat">Hello! How can I help you today?</MessageContent>
</Message>
```

## [Usage with AI SDK](#usage-with-ai-sdk)

Render messages in a list with `useChat`.

Add the following component to your frontend:

```tsx
'use client';


import { Message, MessageContent } from '@/components/ai-elements/message';
import { useChat } from '@ai-sdk/react';
import { Response } from '@/components/ai-elements/response';


const MessageDemo = () => {
  const { messages } = useChat();


  return (
    <div className="max-w-4xl mx-auto p-6 relative size-full rounded-lg border h-[600px]">
      <div className="flex flex-col h-full">
        {messages.map((message) => (
          <Message from={message.role} key={message.id}>
            <MessageContent>
              {message.parts.map((part, i) => {
                switch (part.type) {
                  case 'text': // we don't use any reasoning or tool calls in this example
                    return (
                      <Response key={`${message.id}-${i}`}>
                        {part.text}
                      </Response>
                    );
                  default:
                    return null;
                }
              })}
            </MessageContent>
          </Message>
        ))}
      </div>
    </div>
  );
};


export default MessageDemo;
```

## [Features](#features)

-   Displays messages from both the user and AI assistant with distinct styling.
-   Two visual variants: **contained** (default) and **flat** for different design preferences.
-   Includes avatar images for message senders with fallback initials.
-   Shows the sender's name through avatar fallbacks.
-   Automatically aligns user and assistant messages on opposite sides.
-   Uses different background colors for user and assistant messages.
-   Accepts any React node as message content.

## [Variants](#variants)

### [Contained (default)](#contained-default)

The **contained** variant provides distinct visual separation with colored backgrounds:

-   User messages appear with primary background color and are right-aligned
-   Assistant messages have secondary background color and are left-aligned
-   Both message types have padding and rounded corners

### [Flat](#flat)

The **flat** variant offers a minimalist design that matches modern AI interfaces like ChatGPT and Gemini:

-   User messages use softer secondary colors with subtle borders
-   Assistant messages display full-width without background or padding
-   Creates a cleaner, more streamlined conversation appearance

## [Notes](#notes)

Always render the `AIMessageContent` first, then the `AIMessageAvatar`. The `AIMessage` component is a wrapper that determines the alignment of the message.

## [Examples](#examples)

### [Render Markdown](#render-markdown)

We can use the [`Response`](response.html) component to render markdown content.

CodePreview

What is the weather in Tokyo?

Ha

Op

### [Flat Variant](#flat-variant)

The flat variant provides a minimalist design that matches modern AI interfaces.

CodePreview

Can you explain what the flat variant does?

The flat variant provides a minimalist design for messages. User messages appear with subtle secondary colors and borders, while assistant messages display full-width without background padding. This creates a cleaner, more modern conversation interface similar to ChatGPT and other contemporary AI assistants.

That looks much cleaner! I like how it matches modern AI interfaces.

Exactly! The flat variant is perfect when you want a more streamlined appearance that puts focus on the conversation content rather than visual containers. It works especially well in full-width layouts and professional applications.

## [Props](#props)

### [`<Message />`](#message-)

### from:

UIMessage\["role"\]

The role of the message sender ("user", "assistant", or "system").

### \[...props\]?:

React.HTMLAttributes<HTMLDivElement>

Any other props are spread to the root div.

### [`<MessageContent />`](#messagecontent-)

### variant?:

"contained" | "flat"

Visual style variant. "contained" (default) shows colored backgrounds, "flat" provides a minimalist design.

### \[...props\]?:

React.HTMLAttributes<HTMLDivElement>

Any other props are spread to the content div.

### [`<MessageAvatar />`](#messageavatar-)

### src:

string

The URL of the avatar image.

### name?:

string

The name to use for the avatar fallback (first 2 letters shown if image is missing).

### \[...props\]?:

React.ComponentProps<typeof Avatar>

Any other props are spread to the underlying Avatar component.

[Previous

Loader

](loader.html)

[Next

Open In Chat

](open-in-chat.html)

On this page

[Message](#message)

[Installation](#installation)

[Usage](#usage)

[Usage with AI SDK](#usage-with-ai-sdk)

[Features](#features)

[Variants](#variants)

[Contained (default)](#contained-default)

[Flat](#flat)

[Notes](#notes)

[Examples](#examples)

[Render Markdown](#render-markdown)

[Flat Variant](#flat-variant)

[Props](#props)

[<Message />](#message-)

[<MessageContent />](#messagecontent-)

[<MessageAvatar />](#messageavatar-)

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