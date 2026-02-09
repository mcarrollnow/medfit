Introduction: Usage

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

[Setup](setup.html)

[Usage](usage.html)

[Troubleshooting](troubleshooting.html)

[Examples](../examples.html)

[Chatbot](../examples/chatbot.html)

[v0 clone](../examples/v0.html)

[Workflow](../examples/workflow.html)

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

[Introduction](../overview.html)Usage

# [Usage](#usage)

Once an AI Elements component is installed, you can import it and use it in your application like any other React component. The components are added as part of your codebase (not hidden in a library), so the usage feels very natural.

## [Example](#example)

After installing AI Elements components, you can use them in your application like any other React component. For example:

```tsx
'use client';


import {
  Message,
  MessageAvatar,
  MessageContent,
} from '@/components/ai-elements/message';
import { useChat } from '@ai-sdk/react';
import { Response } from '@/components/ai-elements/response';


const Example = () => {
  const { messages } = useChat();


  return (
    <>
      {messages.map(({ role, parts }, index) => (
        <Message from={role} key={index}>
          <MessageContent>
            {parts.map((part, i) => {
              switch (part.type) {
                case 'text':
                  return <Response key={`${role}-${i}`}>{part.text}</Response>;
              }
            })}
          </MessageContent>
        </Message>
      ))}
    </>
  );
};


export default Example;
```

In the example above, we import the `Message` component from our AI Elements directory and include it in our JSX. Then, we compose the component with the `MessageContent` and `Response` subcomponents. You can style or configure the component just as you would if you wrote it yourself – since the code lives in your project, you can even open the component file to see how it works or make custom modifications.

## [Extensibility](#extensibility)

All AI Elements components take as many primitive attributes as possible. For example, the `Message` component extends `HTMLAttributes<HTMLDivElement>`, so you can pass any props that a `div` supports. This makes it easy to extend the component with your own styles or functionality.

## [Customization](#customization)

If you re-install AI Elements by rerunning `npx ai-elements@latest`, the CLI will ask before overwriting the file so you can save any custom changes you made.

After installation, no additional setup is needed. The component’s styles (Tailwind CSS classes) and scripts are already integrated. You can start interacting with the component in your app immediately.

For example, if you'd like to remove the rounding on `Message`, you can go to `components/ai-elements/message.tsx` and remove `rounded-lg` as follows:

```tsx
export const MessageContent = ({
  children,
  className,
  ...props
}: MessageContentProps) => (
  <div
    className={cn(
      'flex flex-col gap-2 text-sm text-foreground',
      'group-[.is-user]:bg-primary group-[.is-user]:text-primary-foreground group-[.is-user]:px-4 group-[.is-user]:py-3',
      className,
    )}
    {...props}
  >
    <div className="is-user:dark">{children}</div>
  </div>
);
```

[Previous

Setup

](setup.html)

[Next

Troubleshooting

](troubleshooting.html)

On this page

[Usage](#usage)

[Example](#example)

[Extensibility](#extensibility)

[Customization](#customization)

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