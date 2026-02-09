Chatbot: Suggestion

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

[Components](../components.html)Suggestion

# [Suggestion](#suggestion)

The `Suggestion` component displays a horizontal row of clickable suggestions for user interaction.

CodePreview

What are the latest trends in AI?How does machine learning work?Explain quantum computingBest practices for React developmentTell me about TypeScript benefitsHow to optimize database queries?What is the difference between SQL and NoSQL?Explain cloud computing basics

## [Installation](#installation)

ai-elementsshadcnManual

npx ai-elements@latest add suggestion

## [Usage](#usage)

```tsx
import { Suggestion, Suggestions } from '@/components/ai-elements/suggestion';
```

```tsx
<Suggestions>
  <Suggestion suggestion="What are the latest trends in AI?" />
</Suggestions>
```

## [Usage with AI SDK](#usage-with-ai-sdk)

Build a simple input with suggestions users can click to send a message to the LLM.

Add the following component to your frontend:

```tsx
'use client';


import {
  Input,
  PromptInputTextarea,
  PromptInputSubmit,
} from '@/components/ai-elements/prompt-input';
import { Suggestion, Suggestions } from '@/components/ai-elements/suggestion';
import { useState } from 'react';
import { useChat } from '@ai-sdk/react';


const suggestions = [
  'Can you explain how to play tennis?',
  'What is the weather in Tokyo?',
  'How do I make a really good fish taco?',
];


const SuggestionDemo = () => {
  const [input, setInput] = useState('');
  const { sendMessage, status } = useChat();


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage({ text: input });
      setInput('');
    }
  };


  const handleSuggestionClick = (suggestion: string) => {
    sendMessage({ text: suggestion });
  };


  return (
    <div className="max-w-4xl mx-auto p-6 relative size-full rounded-lg border h-[600px]">
      <div className="flex flex-col h-full">
        <div className="flex flex-col gap-4">
          <Suggestions>
            {suggestions.map((suggestion) => (
              <Suggestion
                key={suggestion}
                onClick={handleSuggestionClick}
                suggestion={suggestion}
              />
            ))}
          </Suggestions>
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
    </div>
  );
};


export default SuggestionDemo;
```

## [Features](#features)

-   Horizontal row of clickable suggestion buttons
-   Customizable styling with variant and size options
-   Flexible layout that wraps suggestions on smaller screens
-   onClick callback that emits the selected suggestion string
-   Support for both individual suggestions and suggestion lists
-   Clean, modern styling with hover effects
-   Responsive design with mobile-friendly touch targets
-   TypeScript support with proper type definitions

## [Examples](#examples)

### [Usage with AI Input](#usage-with-ai-input)

CodePreview

What are the latest trends in AI?How does machine learning work?Explain quantum computingBest practices for React developmentTell me about TypeScript benefitsHow to optimize database queries?What is the difference between SQL and NoSQL?Explain cloud computing basics

Search

## [Props](#props)

### [`<Suggestions />`](#suggestions-)

### \[...props\]?:

React.ComponentProps<typeof ScrollArea>

Any other props are spread to the underlying ScrollArea component.

### [`<Suggestion />`](#suggestion-)

### suggestion:

string

The suggestion string to display and emit on click.

### onClick?:

(suggestion: string) => void

Callback fired when the suggestion is clicked.

### \[...props\]?:

Omit<React.ComponentProps<typeof Button>, "onClick">

Any other props are spread to the underlying shadcn/ui Button component.

[Previous

Sources

](sources.html)

[Next

Task

](task.html)

On this page

[Suggestion](#suggestion)

[Installation](#installation)

[Usage](#usage)

[Usage with AI SDK](#usage-with-ai-sdk)

[Features](#features)

[Examples](#examples)

[Usage with AI Input](#usage-with-ai-input)

[Props](#props)

[<Suggestions />](#suggestions-)

[<Suggestion />](#suggestion-)

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