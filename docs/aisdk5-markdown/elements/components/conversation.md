Chatbot: Conversation

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

[Components](../components.html)Conversation

# [Conversation](#conversation)

The `Conversation` component wraps messages and automatically scrolls to the bottom. Also includes a scroll button that appears when not at the bottom.

CodePreview

### Start a conversation

Messages will appear here as the conversation progresses.

## [Installation](#installation)

ai-elementsshadcnManual

npx ai-elements@latest add conversation

## [Usage](#usage)

```tsx
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation';
```

```tsx
<Conversation className="relative w-full" style={{ height: '500px' }}>
  <ConversationContent>
    {messages.length === 0 ? (
      <ConversationEmptyState
        icon={<MessageSquare className="size-12" />}
        title="No messages yet"
        description="Start a conversation to see messages here"
      />
    ) : (
      messages.map((message) => (
        <Message from={message.from} key={message.id}>
          <MessageContent>{message.content}</MessageContent>
        </Message>
      ))
    )}
  </ConversationContent>
  <ConversationScrollButton />
</Conversation>
```

## [Usage with AI SDK](#usage-with-ai-sdk)

Build a simple conversational UI with `Conversation` and [`PromptInput`](prompt-input.html):

Add the following component to your frontend:

```tsx
'use client';


import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import { Message, MessageContent } from '@/components/ai-elements/message';
import {
  Input,
  PromptInputTextarea,
  PromptInputSubmit,
} from '@/components/ai-elements/prompt-input';
import { MessageSquare } from 'lucide-react';
import { useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { Response } from '@/components/ai-elements/response';


const ConversationDemo = () => {
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
            {messages.length === 0 ? (
              <ConversationEmptyState
                icon={<MessageSquare className="size-12" />}
                title="Start a conversation"
                description="Type a message below to begin chatting"
              />
            ) : (
              messages.map((message) => (
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
              ))
            )}
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


export default ConversationDemo;
```

Add the following route to your backend:

```tsx
import { streamText, UIMessage, convertToModelMessages } from 'ai';


// Allow streaming responses up to 30 seconds
export const maxDuration = 30;


export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();


  const result = streamText({
    model: 'openai/gpt-4o',
    messages: convertToModelMessages(messages),
  });


  return result.toUIMessageStreamResponse();
}
```

## [Features](#features)

-   Automatic scrolling to the bottom when new messages are added
-   Smooth scrolling behavior with configurable animation
-   Scroll button that appears when not at the bottom
-   Responsive design with customizable padding and spacing
-   Flexible content layout with consistent message spacing
-   Accessible with proper ARIA roles for screen readers
-   Customizable styling through className prop
-   Support for any number of child message components

## [Props](#props)

### [`<Conversation />`](#conversation-)

### contextRef:

React.Ref<StickToBottomContext>

Optional ref to access the StickToBottom context object.

### instance:

StickToBottomInstance

Optional instance for controlling the StickToBottom component.

### children:

((context: StickToBottomContext) => ReactNode) | ReactNode

Render prop or ReactNode for custom rendering with context.

### \[...props\]:

Omit<React.HTMLAttributes<HTMLDivElement>, "children">

Any other props are spread to the root div.

### [`<ConversationContent />`](#conversationcontent-)

### children:

((context: StickToBottomContext) => ReactNode) | ReactNode

Render prop or ReactNode for custom rendering with context.

### \[...props\]:

Omit<React.HTMLAttributes<HTMLDivElement>, "children">

Any other props are spread to the root div.

### [`<ConversationEmptyState />`](#conversationemptystate-)

### title:

string

The title text to display. Defaults to "No messages yet".

### description:

string

The description text to display. Defaults to "Start a conversation to see messages here".

### icon:

React.ReactNode

Optional icon to display above the text.

### children:

React.ReactNode

Optional additional content to render below the text.

### \[...props\]:

ComponentProps<"div">

Any other props are spread to the root div.

### [`<ConversationScrollButton />`](#conversationscrollbutton-)

### \[...props\]:

ComponentProps<typeof Button>

Any other props are spread to the underlying shadcn/ui Button component.

[Previous

Context

](context.html)

[Next

Image

](image.html)

On this page

[Conversation](#conversation)

[Installation](#installation)

[Usage](#usage)

[Usage with AI SDK](#usage-with-ai-sdk)

[Features](#features)

[Props](#props)

[<Conversation />](#conversation-)

[<ConversationContent />](#conversationcontent-)

[<ConversationEmptyState />](#conversationemptystate-)

[<ConversationScrollButton />](#conversationscrollbutton-)

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