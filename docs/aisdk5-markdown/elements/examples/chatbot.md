Examples: Chatbot

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

[Chatbot](chatbot.html)

[v0 clone](v0.html)

[Workflow](workflow.html)

[Components](../components.html)

[Chatbot](../components/chatbot.html)

[Actions](../components/actions.html)

[Branch](../components/branch.html)

[Chain of Thought](../components/chain-of-thought.html)

[Code Block](../components/code-block.html)

[Context](../components/context.html)

[Conversation](../components/conversation.html)

[Image](../components/image.html)

[Inline Citation](../components/inline-citation.html)

[Loader](../components/loader.html)

[Message](../components/message.html)

[Open In Chat](../components/open-in-chat.html)

[Plan](../components/plan.html)

[Prompt Input](../components/prompt-input.html)

[Queue](../components/queue.html)

[Reasoning](../components/reasoning.html)

[Response](../components/response.html)

[Shimmer](../components/shimmer.html)

[Sources](../components/sources.html)

[Suggestion](../components/suggestion.html)

[Task](../components/task.html)

[Tool](../components/tool.html)

[Workflow](../components/workflow.html)

[Canvas](../components/canvas.html)

[Connection](../components/connection.html)

[Controls](../components/controls.html)

[Edge](../components/edge.html)

[Node](../components/node.html)

[Panel](../components/panel.html)

[Toolbar](../components/toolbar.html)

[Vibe Coding](../components/vibe-coding.html)

[Artifact](../components/artifact.html)

[Web Preview](../components/web-preview.html)

[Examples](../examples.html)Chatbot

# [Chatbot](#chatbot)

An example of how to use the AI Elements to build a chatbot.

CodePreview

Can you explain how to use React hooks effectively?

Ha

Used 2 sources

# React Hooks Best Practices

React hooks are a powerful feature that let you use state and other React features without writing classes. Here are some tips for using them effectively:

## Rules of Hooks

1.  Only call hooks at the top level of your component or custom hooks
2.  Don't call hooks inside loops, conditions, or nested functions

## Common Hooks

-   useState: For local component state
-   useEffect: For side effects like data fetching
-   useContext: For consuming context
-   useReducer: For complex state logic
-   useCallback: For memoizing functions
-   useMemo: For memoizing values

## Example of useState and useEffect

jsx

Would you like me to explain any specific hook in more detail?

Op

Yes, could you explain useCallback and useMemo in more detail? When should I use one over the other?

Ha

I'm particularly interested in understanding the performance implications of useCallback and useMemo. Could you break down when each is most appropriate?

Ha

Thanks for the overview! Could you dive deeper into the specific use cases where useCallback and useMemo make the biggest difference in React applications?

Ha

Thought for 10 seconds

The user is asking for a detailed explanation of useCallback and useMemo. I should provide a clear and concise explanation of each hook's purpose and how they differ.

The useCallback hook is used to memoize functions to prevent unnecessary re-renders of child components that receive functions as props.

The useMemo hook is used to memoize values to avoid expensive recalculations on every render.

Both hooks help with performance optimization, but they serve different purposes.

## useCallback vs useMemo

Both hooks help with performance optimization, but they serve different purposes:

### useCallback

`useCallback` memoizes functions to prevent unnecessary re-renders of child components that receive functions as props.

jsx

### useMemo

`useMemo` memoizes values to avoid expensive recalculations on every render.

jsx

### When to use which?

-   Use useCallback when:
    
    -   Passing callbacks to optimized child components that rely on reference equality
    -   Working with event handlers that you pass to child components
-   Use useMemo when:
    
    -   You have computationally expensive calculations
    -   You want to avoid recreating objects that are used as dependencies for other hooks

### Performance Note

Don't overuse these hooks! They come with their own overhead. Only use them when you have identified a genuine performance issue.

Op

What are the latest trends in AI?How does machine learning work?Explain quantum computingBest practices for React developmentTell me about TypeScript benefitsHow to optimize database queries?What is the difference between SQL and NoSQL?Explain cloud computing basics

Search

## [Tutorial](#tutorial)

Let's walk through how to build a chatbot using AI Elements and AI SDK. Our example will include reasoning, web search with citations, and a model picker.

### [Setup](#setup)

First, set up a new Next.js repo and cd into it by running the following command (make sure you choose to use Tailwind the project setup):

```bash
npx create-next-app@latest ai-chatbot && cd ai-chatbot
```

Run the following command to install AI Elements. This will also set up shadcn/ui if you haven't already configured it:

```bash
npx ai-elements@latest
```

Now, install the AI SDK dependencies:

pnpm

npm

yarn

pnpm add ai @ai-sdk/react zod

In order to use the providers, let's configure an AI Gateway API key. Create a `.env.local` in your root directory and navigate [here](https://vercel.com/d?to=%2F%5Bteam%5D%2F%7E%2Fai%2Fapi-keys&title=Get%20your%20AI%20Gateway%20key) to create a token, then paste it in your `.env.local`.

We're now ready to start building our app!

### [Client](#client)

In your `app/page.tsx`, replace the code with the file below.

Here, we use the `PromptInput` component with its compound components to build a rich input experience with file attachments, model picker, and action menu. The input component uses the new `PromptInputMessage` type for handling both text and file attachments.

The whole chat lives in a `Conversation`. We switch on `message.parts` and render the respective part within `Message`, `Reasoning`, and `Sources`. We also use `status` from `useChat` to stream reasoning tokens, as well as render `Loader`.

```tsx
'use client';


import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import { Message, MessageContent } from '@/components/ai-elements/message';
import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputAttachment,
  PromptInputAttachments,
  PromptInputBody,
  PromptInputButton,
  type PromptInputMessage,
  PromptInputModelSelect,
  PromptInputModelSelectContent,
  PromptInputModelSelectItem,
  PromptInputModelSelectTrigger,
  PromptInputModelSelectValue,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputTools,
} from '@/components/ai-elements/prompt-input';
import { Action, Actions } from '@/components/ai-elements/actions';
import { Fragment, useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { Response } from '@/components/ai-elements/response';
import { CopyIcon, GlobeIcon, RefreshCcwIcon } from 'lucide-react';
import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from '@/components/ai-elements/sources';
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from '@/components/ai-elements/reasoning';
import { Loader } from '@/components/ai-elements/loader';


const models = [
  {
    name: 'GPT 4o',
    value: 'openai/gpt-4o',
  },
  {
    name: 'Deepseek R1',
    value: 'deepseek/deepseek-r1',
  },
];


const ChatBotDemo = () => {
  const [input, setInput] = useState('');
  const [model, setModel] = useState<string>(models[0].value);
  const [webSearch, setWebSearch] = useState(false);
  const { messages, sendMessage, status, regenerate } = useChat();


  const handleSubmit = (message: PromptInputMessage) => {
    const hasText = Boolean(message.text);
    const hasAttachments = Boolean(message.files?.length);


    if (!(hasText || hasAttachments)) {
      return;
    }


    sendMessage(
      { 
        text: message.text || 'Sent with attachments',
        files: message.files 
      },
      {
        body: {
          model: model,
          webSearch: webSearch,
        },
      },
    );
    setInput('');
  };


  return (
    <div className="max-w-4xl mx-auto p-6 relative size-full h-screen">
      <div className="flex flex-col h-full">
        <Conversation className="h-full">
          <ConversationContent>
            {messages.map((message) => (
              <div key={message.id}>
                {message.role === 'assistant' && message.parts.filter((part) => part.type === 'source-url').length > 0 && (
                  <Sources>
                    <SourcesTrigger
                      count={
                        message.parts.filter(
                          (part) => part.type === 'source-url',
                        ).length
                      }
                    />
                    {message.parts.filter((part) => part.type === 'source-url').map((part, i) => (
                      <SourcesContent key={`${message.id}-${i}`}>
                        <Source
                          key={`${message.id}-${i}`}
                          href={part.url}
                          title={part.url}
                        />
                      </SourcesContent>
                    ))}
                  </Sources>
                )}
                {message.parts.map((part, i) => {
                  switch (part.type) {
                    case 'text':
                      return (
                        <Fragment key={`${message.id}-${i}`}>
                          <Message from={message.role}>
                            <MessageContent>
                              <Response>
                                {part.text}
                              </Response>
                            </MessageContent>
                          </Message>
                          {message.role === 'assistant' && i === messages.length - 1 && (
                            <Actions className="mt-2">
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
                    case 'reasoning':
                      return (
                        <Reasoning
                          key={`${message.id}-${i}`}
                          className="w-full"
                          isStreaming={status === 'streaming' && i === message.parts.length - 1 && message.id === messages.at(-1)?.id}
                        >
                          <ReasoningTrigger />
                          <ReasoningContent>{part.text}</ReasoningContent>
                        </Reasoning>
                      );
                    default:
                      return null;
                  }
                })}
              </div>
            ))}
            {status === 'submitted' && <Loader />}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>


        <PromptInput onSubmit={handleSubmit} className="mt-4" globalDrop multiple>
          <PromptInputBody>
            <PromptInputAttachments>
              {(attachment) => <PromptInputAttachment data={attachment} />}
            </PromptInputAttachments>
            <PromptInputTextarea
              onChange={(e) => setInput(e.target.value)}
              value={input}
            />
          </PromptInputBody>
          <PromptInputFooter>
            <PromptInputTools>
              <PromptInputActionMenu>
                <PromptInputActionMenuTrigger />
                <PromptInputActionMenuContent>
                  <PromptInputActionAddAttachments />
                </PromptInputActionMenuContent>
              </PromptInputActionMenu>
              <PromptInputButton
                variant={webSearch ? 'default' : 'ghost'}
                onClick={() => setWebSearch(!webSearch)}
              >
                <GlobeIcon size={16} />
                <span>Search</span>
              </PromptInputButton>
              <PromptInputModelSelect
                onValueChange={(value) => {
                  setModel(value);
                }}
                value={model}
              >
                <PromptInputModelSelectTrigger>
                  <PromptInputModelSelectValue />
                </PromptInputModelSelectTrigger>
                <PromptInputModelSelectContent>
                  {models.map((model) => (
                    <PromptInputModelSelectItem key={model.value} value={model.value}>
                      {model.name}
                    </PromptInputModelSelectItem>
                  ))}
                </PromptInputModelSelectContent>
              </PromptInputModelSelect>
            </PromptInputTools>
            <PromptInputSubmit disabled={!input && !status} status={status} />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
};


export default ChatBotDemo;
```

### [Server](#server)

Create a new route handler `app/api/chat/route.ts` and paste in the following code. We're using `perplexity/sonar` for web search because by default the model returns search results. We also pass `sendSources` and `sendReasoning` to `toUIMessageStreamResponse` in order to receive as parts on the frontend. The handler now also accepts file attachments from the client.

```ts
import { streamText, UIMessage, convertToModelMessages } from 'ai';


// Allow streaming responses up to 30 seconds
export const maxDuration = 30;


export async function POST(req: Request) {
  const {
    messages,
    model,
    webSearch,
  }: { 
    messages: UIMessage[]; 
    model: string; 
    webSearch: boolean;
  } = await req.json();


  const result = streamText({
    model: webSearch ? 'perplexity/sonar' : model,
    messages: convertToModelMessages(messages),
    system:
      'You are a helpful assistant that can answer questions and help with tasks',
  });


  // send sources and reasoning back to the client
  return result.toUIMessageStreamResponse({
    sendSources: true,
    sendReasoning: true,
  });
}
```

You now have a working chatbot app with file attachment support! The chatbot can handle both text and file inputs through the action menu. Feel free to explore other components like [`Tool`](../components/tool.html) or [`Task`](../components/task.html) to extend your app, or view the other examples.

[Previous

Examples

](../examples.html)

[Next

v0 clone

](v0.html)

On this page

[Chatbot](#chatbot)

[Tutorial](#tutorial)

[Setup](#setup)

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