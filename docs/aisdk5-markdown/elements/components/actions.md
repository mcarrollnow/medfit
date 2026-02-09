Chatbot: Actions

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

[Components](../components.html)Actions

# [Actions](#actions)

The `Actions` component provides a flexible row of action buttons for AI responses with common actions like retry, like, dislike, copy, and share.

CodePreview

Hello, how are you?

I am fine, thank you!

RetryLikeDislikeCopyShare

## [Installation](#installation)

ai-elementsshadcnManual

npx ai-elements@latest add actions

## [Usage](#usage)

```tsx
import { Actions, Action } from '@/components/ai-elements/actions';
import { ThumbsUpIcon } from 'lucide-react';
```

```tsx
<Actions className="mt-2">
  <Action label="Like">
    <ThumbsUpIcon className="size-4" />
  </Action>
</Actions>
```

## [Usage with AI SDK](#usage-with-ai-sdk)

Build a simple chat UI where the user can copy or regenerate the most recent message.

Add the following component to your frontend:

```tsx
'use client';


import { useState } from 'react';
import { Actions, Action } from '@/components/ai-elements/actions';
import { Message, MessageContent } from '@/components/ai-elements/message';
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import {
  Input,
  PromptInputTextarea,
  PromptInputSubmit,
} from '@/components/ai-elements/prompt-input';
import { Response } from '@/components/ai-elements/response';
import { RefreshCcwIcon, CopyIcon } from 'lucide-react';
import { useChat } from '@ai-sdk/react';
import { Fragment } from 'react';


const ActionsDemo = () => {
  const [input, setInput] = useState('');
  const { messages, sendMessage, status, regenerate } = useChat();


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
            {messages.map((message, messageIndex) => (
              <Fragment key={message.id}>
                {message.parts.map((part, i) => {
                  switch (part.type) {
                    case 'text':
                      const isLastMessage =
                        messageIndex === messages.length - 1;
                      
                      return (
                        <Fragment key={`${message.id}-${i}`}>
                          <Message from={message.role}>
                            <MessageContent>
                              <Response>{part.text}</Response>
                            </MessageContent>
                          </Message>
                          {message.role === 'assistant' && isLastMessage && (
                            <Actions>
                              <Action
                                onClick={() => regenerate()}
                                label="Retry"
                              >
                                <RefreshCcwIcon className="size-3" />
                              </Action>
                              <Action
                                onClick={() =>
                                  navigator.clipboard.writeText(part.text)
                                }
                                label="Copy"
                              >
                                <CopyIcon className="size-3" />
                              </Action>
                            </Actions>
                          )}
                        </Fragment>
                      );
                    default:
                      return null;
                  }
                })}
              </Fragment>
            ))}
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


export default ActionsDemo;
```

Add the following route to your backend:

```tsx
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

-   Row of composable action buttons with consistent styling
-   Support for custom actions with tooltips
-   State management for toggle actions (like, dislike, favorite)
-   Keyboard accessible with proper ARIA labels
-   Clipboard and Web Share API integration
-   TypeScript support with proper type definitions
-   Consistent with design system styling

## [Examples](#examples)

CodePreview

This is a response from an assistant. Try hovering over this message to see the actions appear!

RetryLikeDislikeCopyShareFavorite

## [Props](#props)

### [`<Actions />`](#actions-)

### \[...props\]:

React.HTMLAttributes<HTMLDivElement>

HTML attributes to spread to the root div.

### [`<Action />`](#action-)

### tooltip?:

string

Optional tooltip text shown on hover.

### label?:

string

Accessible label for screen readers. Also used as fallback if tooltip is not provided.

### \[...props\]:

React.ComponentProps<typeof Button>

Any other props are spread to the underlying shadcn/ui Button component.

[Previous

Chatbot

](chatbot.html)

[Next

Branch

](branch.html)

On this page

[Actions](#actions)

[Installation](#installation)

[Usage](#usage)

[Usage with AI SDK](#usage-with-ai-sdk)

[Features](#features)

[Examples](#examples)

[Props](#props)

[<Actions />](#actions-)

[<Action />](#action-)

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