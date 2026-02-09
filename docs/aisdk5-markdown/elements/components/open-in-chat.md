Chatbot: Open In Chat

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

[Components](../components.html)Open In Chat

# [Open In Chat](#open-in-chat)

The `OpenIn` component provides a dropdown menu that allows users to open queries in different AI chat platforms with a single click.

CodePreview

Open in chat

## [Installation](#installation)

ai-elementsshadcnManual

npx ai-elements@latest add open-in-chat

## [Usage](#usage)

```tsx
import {
  OpenIn,
  OpenInChatGPT,
  OpenInClaude,
  OpenInContent,
  OpenInCursor,
  OpenInScira,
  OpenInT3,
  OpenInTrigger,
  OpenInv0,
} from '@/components/ai-elements/open-in-chat';
```

```tsx
<OpenIn query="How can I implement authentication in Next.js?">
  <OpenInTrigger />
  <OpenInContent>
    <OpenInChatGPT />
    <OpenInClaude />
    <OpenInT3 />
    <OpenInScira />
    <OpenInv0 />
    <OpenInCursor />
  </OpenInContent>
</OpenIn>
```

## [Features](#features)

-   Pre-configured links to popular AI chat platforms
-   Context-based query passing for cleaner API
-   Customizable dropdown trigger button
-   Automatic URL parameter encoding for queries
-   Support for ChatGPT, Claude, T3 Chat, Scira AI, v0, and Cursor
-   Branded icons for each platform
-   TypeScript support with proper type definitions
-   Accessible dropdown menu with keyboard navigation
-   External link indicators for clarity

## [Supported Platforms](#supported-platforms)

-   **ChatGPT** - Opens query in OpenAI's ChatGPT with search hints
-   **Claude** - Opens query in Anthropic's Claude AI
-   **T3 Chat** - Opens query in T3 Chat platform
-   **Scira AI** - Opens query in Scira's AI assistant
-   **v0** - Opens query in Vercel's v0 platform
-   **Cursor** - Opens query in Cursor AI editor

## [Props](#props)

### [`<OpenIn />`](#openin-)

### query:

string

The query text to be sent to all AI platforms.

### \[...props\]:

React.ComponentProps<typeof DropdownMenu>

Props to spread to the underlying radix-ui DropdownMenu component.

### [`<OpenInTrigger />`](#openintrigger-)

### children?:

React.ReactNode

Custom trigger button. Defaults to "Open in chat" button with chevron icon.

### \[...props\]:

React.ComponentProps<typeof DropdownMenuTrigger>

Props to spread to the underlying DropdownMenuTrigger component.

### [`<OpenInContent />`](#openincontent-)

### className?:

string

Additional CSS classes to apply to the dropdown content.

### \[...props\]:

React.ComponentProps<typeof DropdownMenuContent>

Props to spread to the underlying DropdownMenuContent component.

### [`<OpenInChatGPT />`, `<OpenInClaude />`, `<OpenInT3 />`, `<OpenInScira />`, `<OpenInv0 />`, `<OpenInCursor />`](#openinchatgpt--openinclaude--openint3--openinscira--openinv0--openincursor-)

### \[...props\]:

React.ComponentProps<typeof DropdownMenuItem>

Props to spread to the underlying DropdownMenuItem component. The query is automatically provided via context from the parent OpenIn component.

### [`<OpenInItem />`, `<OpenInLabel />`, `<OpenInSeparator />`](#openinitem--openinlabel--openinseparator-)

Additional composable components for custom dropdown menu items, labels, and separators that follow the same props pattern as their underlying radix-ui counterparts.

[Previous

Message

](message.html)

[Next

Plan

](plan.html)

On this page

[Open In Chat](#open-in-chat)

[Installation](#installation)

[Usage](#usage)

[Features](#features)

[Supported Platforms](#supported-platforms)

[Props](#props)

[<OpenIn />](#openin-)

[<OpenInTrigger />](#openintrigger-)

[<OpenInContent />](#openincontent-)

[<OpenInChatGPT />, <OpenInClaude />, <OpenInT3 />, <OpenInScira />, <OpenInv0 />, <OpenInCursor />](#openinchatgpt--openinclaude--openint3--openinscira--openinv0--openincursor-)

[<OpenInItem />, <OpenInLabel />, <OpenInSeparator />](#openinitem--openinlabel--openinseparator-)

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