Chatbot: Code Block

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

[Components](../components.html)Code Block

# [Code Block](#code-block)

The `CodeBlock` component provides syntax highlighting, line numbers, and copy to clipboard functionality for code blocks.

CodePreview

```
function MyComponent(props) {
  return (
    <div>
      <h1>Hello, {props.name}!</h1>
      <p>This is an example React component.</p>
    </div>
  );
}
```

```
function MyComponent(props) {
  return (
    <div>
      <h1>Hello, {props.name}!</h1>
      <p>This is an example React component.</p>
    </div>
  );
}
```

## [Installation](#installation)

ai-elementsshadcnManual

npx ai-elements@latest add code-block

## [Usage](#usage)

```tsx
import { CodeBlock, CodeBlockCopyButton } from '@/components/ai-elements/code-block';
```

```tsx
<CodeBlock data={"console.log('hello world')"} language="jsx">
  <CodeBlockCopyButton
    onCopy={() => console.log('Copied code to clipboard')}
    onError={() => console.error('Failed to copy code to clipboard')}
  />
</CodeBlock>
```

## [Usage with AI SDK](#usage-with-ai-sdk)

Build a simple code generation tool using the [`experimental_useObject`](../../docs/reference/ai-sdk-ui/use-object.html) hook.

Add the following component to your frontend:

```tsx
'use client';


import { experimental_useObject as useObject } from '@ai-sdk/react';
import { codeBlockSchema } from '@/app/api/codegen/route';
import {
  Input,
  PromptInputTextarea,
  PromptInputSubmit,
} from '@/components/ai-elements/prompt-input';
import {
  CodeBlock,
  CodeBlockCopyButton,
} from '@/components/ai-elements/code-block';
import { useState } from 'react';


export default function Page() {
  const [input, setInput] = useState('');
  const { object, submit, isLoading } = useObject({
    api: '/api/codegen',
    schema: codeBlockSchema,
  });


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      submit(input);
    }
  };


  return (
    <div className="max-w-4xl mx-auto p-6 relative size-full rounded-lg border h-[600px]">
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-auto mb-4">
          {object?.code && object?.language && (
            <CodeBlock
              code={object.code}
              language={object.language}
              showLineNumbers={true}
            >
              <CodeBlockCopyButton />
            </CodeBlock>
          )}
        </div>


        <Input
          onSubmit={handleSubmit}
          className="mt-4 w-full max-w-2xl mx-auto relative"
        >
          <PromptInputTextarea
            value={input}
            placeholder="Generate a React todolist component"
            onChange={(e) => setInput(e.currentTarget.value)}
            className="pr-12"
          />
          <PromptInputSubmit
            status={isLoading ? 'streaming' : 'ready'}
            disabled={!input.trim()}
            className="absolute bottom-1 right-1"
          />
        </Input>
      </div>
    </div>
  );
}
```

Add the following route to your backend:

```tsx
import { streamObject } from 'ai';
import { z } from 'zod';


export const codeBlockSchema = z.object({
  language: z.string(),
  filename: z.string(),
  code: z.string(),
});
// Allow streaming responses up to 30 seconds
export const maxDuration = 30;


export async function POST(req: Request) {
  const context = await req.json();


  const result = streamObject({
    model: 'openai/gpt-4o',
    schema: codeBlockSchema,
    prompt:
      `You are a helpful coding assitant. Only generate code, no markdown formatting or backticks, or text.` +
      context,
  });


  return result.toTextStreamResponse();
}
```

## [Features](#features)

-   Syntax highlighting with react-syntax-highlighter
-   Line numbers (optional)
-   Copy to clipboard functionality
-   Automatic light/dark theme switching
-   Customizable styles
-   Accessible design

## [Examples](#examples)

### [Dark Mode](#dark-mode)

To use the `CodeBlock` component in dark mode, you can wrap it in a `div` with the `dark` class.

CodePreview

```
function MyComponent(props) {
  return (
    <div>
      <h1>Hello, {props.name}!</h1>
      <p>This is an example React component.</p>
    </div>
  );
}
```

```
function MyComponent(props) {
  return (
    <div>
      <h1>Hello, {props.name}!</h1>
      <p>This is an example React component.</p>
    </div>
  );
}
```

## [Props](#props)

### [`<CodeBlock />`](#codeblock-)

### code:

string

The code content to display.

### language:

string

The programming language for syntax highlighting.

### showLineNumbers?:

boolean

Whether to show line numbers. Default: false.

### children?:

React.ReactNode

Child elements (like CodeBlockCopyButton) positioned in the top-right corner.

### className?:

string

Additional CSS classes to apply to the root container.

### \[...props\]?:

React.HTMLAttributes<HTMLDivElement>

Any other props are spread to the root div.

### [`<CodeBlockCopyButton />`](#codeblockcopybutton-)

### onCopy?:

() => void

Callback fired after a successful copy.

### onError?:

(error: Error) => void

Callback fired if copying fails.

### timeout?:

number

How long to show the copied state (ms). Default: 2000.

### children?:

React.ReactNode

Custom content for the button. Defaults to copy/check icons.

### className?:

string

Additional CSS classes to apply to the button.

### \[...props\]?:

React.ComponentProps<typeof Button>

Any other props are spread to the underlying shadcn/ui Button component.

[Previous

Chain of Thought

](chain-of-thought.html)

[Next

Context

](context.html)

On this page

[Code Block](#code-block)

[Installation](#installation)

[Usage](#usage)

[Usage with AI SDK](#usage-with-ai-sdk)

[Features](#features)

[Examples](#examples)

[Dark Mode](#dark-mode)

[Props](#props)

[<CodeBlock />](#codeblock-)

[<CodeBlockCopyButton />](#codeblockcopybutton-)

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