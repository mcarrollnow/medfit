Chatbot: Sources

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

[Components](../components.html)Sources

# [Sources](#sources)

The `Sources` component allows a user to view the sources or citations used to generate a response.

CodePreview

Used 3 sources

## [Installation](#installation)

ai-elementsshadcnManual

npx ai-elements@latest add sources

## [Usage](#usage)

```tsx
import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from '@/components/ai-elements/sources';
```

```tsx
<Sources>
  <SourcesTrigger count={1} />
  <SourcesContent>
    <Source href="https://ai-sdk.dev" title="AI SDK" />
  </SourcesContent>
</Sources>
```

## [Usage with AI SDK](#usage-with-ai-sdk)

Build a simple web search agent with Perplexity Sonar.

Add the following component to your frontend:

```tsx
'use client';


import { useChat } from '@ai-sdk/react';
import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from '@/components/ai-elements/sources';
import {
  Input,
  PromptInputTextarea,
  PromptInputSubmit,
} from '@/components/ai-elements/prompt-input';
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import { Message, MessageContent } from '@/components/ai-elements/message';
import { Response } from '@/components/ai-elements/response';
import { useState } from 'react';
import { DefaultChatTransport } from 'ai';


const SourceDemo = () => {
  const [input, setInput] = useState('');
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/sources',
    }),
  });


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
        <div className="flex-1 overflow-auto mb-4">
          <Conversation>
            <ConversationContent>
              {messages.map((message) => (
                <div key={message.id}>
                  {message.role === 'assistant' && (
                    <Sources>
                      <SourcesTrigger
                        count={
                          message.parts.filter(
                            (part) => part.type === 'source-url',
                          ).length
                        }
                      />
                      {message.parts.map((part, i) => {
                        switch (part.type) {
                          case 'source-url':
                            return (
                              <SourcesContent key={`${message.id}-${i}`}>
                                <Source
                                  key={`${message.id}-${i}`}
                                  href={part.url}
                                  title={part.url}
                                />
                              </SourcesContent>
                            );
                        }
                      })}
                    </Sources>
                  )}
                  <Message from={message.role} key={message.id}>
                    <MessageContent>
                      {message.parts.map((part, i) => {
                        switch (part.type) {
                          case 'text':
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
                </div>
              ))}
            </ConversationContent>
            <ConversationScrollButton />
          </Conversation>
        </div>


        <Input
          onSubmit={handleSubmit}
          className="mt-4 w-full max-w-2xl mx-auto relative"
        >
          <PromptInputTextarea
            value={input}
            placeholder="Ask a question and search the..."
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


export default SourceDemo;
```

Add the following route to your backend:

```tsx
import { convertToModelMessages, streamText, UIMessage } from 'ai';
import { perplexity } from '@ai-sdk/perplexity';


// Allow streaming responses up to 30 seconds
export const maxDuration = 30;


export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();


  const result = streamText({
    model: 'perplexity/sonar',
    system:
      'You are a helpful assistant. Keep your responses short (< 100 words) unless you are asked for more details. ALWAYS USE SEARCH.',
    messages: convertToModelMessages(messages),
  });


  return result.toUIMessageStreamResponse({
    sendSources: true,
  });
}
```

## [Features](#features)

-   Collapsible component that allows a user to view the sources or citations used to generate a response
-   Customizable trigger and content components
-   Support for custom sources or citations
-   Responsive design with mobile-friendly controls
-   Clean, modern styling with customizable themes

## [Examples](#examples)

### [Custom rendering](#custom-rendering)

CodePreview

Using 3 citations

## [Props](#props)

### [`<Sources />`](#sources-)

### \[...props\]?:

React.HTMLAttributes<HTMLDivElement>

Any other props are spread to the root div.

### [`<SourcesTrigger />`](#sourcestrigger-)

### count?:

number

The number of sources to display in the trigger.

### \[...props\]?:

React.ButtonHTMLAttributes<HTMLButtonElement>

Any other props are spread to the trigger button.

### [`<SourcesContent />`](#sourcescontent-)

### \[...props\]?:

React.HTMLAttributes<HTMLDivElement>

Any other props are spread to the content container.

### [`<Source />`](#source-)

### \[...props\]?:

React.AnchorHTMLAttributes<HTMLAnchorElement>

Any other props are spread to the anchor element.

[Previous

Shimmer

](shimmer.html)

[Next

Suggestion

](suggestion.html)

On this page

[Sources](#sources)

[Installation](#installation)

[Usage](#usage)

[Usage with AI SDK](#usage-with-ai-sdk)

[Features](#features)

[Examples](#examples)

[Custom rendering](#custom-rendering)

[Props](#props)

[<Sources />](#sources-)

[<SourcesTrigger />](#sourcestrigger-)

[<SourcesContent />](#sourcescontent-)

[<Source />](#source-)

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