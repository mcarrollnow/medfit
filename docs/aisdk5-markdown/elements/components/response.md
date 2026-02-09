Chatbot: Response

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

[Components](../components.html)Response

# [Response](#response)

The `Response` component renders a Markdown response from a large language model. It uses [Streamdown](https://streamdown.ai/) under the hood to render the markdown.

CodePreview

## [Installation](#installation)

ai-elementsshadcnManual

npx ai-elements@latest add response

**Important:** After adding the component, you'll need to add the following to your `globals.css` file:

```css
@source "../node_modules/streamdown/dist/index.js";
```

This is **required** for the Response component to work properly. Without this import, the Streamdown styles will not be applied to your project. See [Streamdown's documentation](https://streamdown.ai/) for more details.

## [Usage](#usage)

```tsx
import { Response } from '@/components/ai-elements/response';
```

```tsx
<Response>**Hi there.** I am an AI model designed to help you.</Response>
```

## [Usage with AI SDK](#usage-with-ai-sdk)

Populate a markdown response with messages from [`useChat`](../../docs/reference/ai-sdk-ui/use-chat.html).

Add the following component to your frontend:

```tsx
'use client';


import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import { Message, MessageContent } from '@/components/ai-elements/message';
import { useChat } from '@ai-sdk/react';
import { Response } from '@/components/ai-elements/response';


const ResponseDemo = () => {
  const { messages } = useChat();


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
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>
      </div>
    </div>
  );
};


export default ResponseDemo;
```

## [Features](#features)

-   Renders markdown content with support for paragraphs, links, and code blocks
-   Supports GFM features like tables, task lists, and strikethrough text via remark-gfm
-   Supports rendering Math Equations via rehype-katex
-   **Smart streaming support** - automatically completes incomplete formatting during real-time text streaming
-   Code blocks are rendered with syntax highlighting for various programming languages
-   Code blocks include a button to easily copy code to clipboard
-   Adapts to different screen sizes while maintaining readability
-   Seamlessly integrates with both light and dark themes
-   Customizable appearance through className props and Tailwind CSS utilities
-   Built with accessibility in mind for all users

## [Props](#props)

### [`<Response />`](#response-)

### children:

string

The markdown content to render.

### parseIncompleteMarkdown?:

boolean

Whether to parse and fix incomplete markdown syntax (e.g., unclosed code blocks or lists).

### className?:

string

CSS class names to apply to the wrapper div element.

### components?:

object

Custom React components to use for rendering markdown elements (e.g., custom heading, paragraph, code block components).

### allowedImagePrefixes?:

string\[\]

Array of allowed URL prefixes for images. Use \["\*"\] to allow all images.

### allowedLinkPrefixes?:

string\[\]

Array of allowed URL prefixes for links. Use \["\*"\] to allow all links.

### defaultOrigin?:

string

Default origin to use for relative URLs in links and images.

### rehypePlugins?:

array

Array of rehype plugins to use for processing HTML. Includes KaTeX for math rendering by default.

### remarkPlugins?:

array

Array of remark plugins to use for processing markdown. Includes GitHub Flavored Markdown and math support by default.

### \[...props\]?:

React.HTMLAttributes<HTMLDivElement>

Any other props are spread to the root div.

[Previous

Reasoning

](reasoning.html)

[Next

Shimmer

](shimmer.html)

On this page

[Response](#response)

[Installation](#installation)

[Usage](#usage)

[Usage with AI SDK](#usage-with-ai-sdk)

[Features](#features)

[Props](#props)

[<Response />](#response-)

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