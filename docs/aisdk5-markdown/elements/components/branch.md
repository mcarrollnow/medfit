Chatbot: Branch

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

[Components](../components.html)Branch

# [Branch](#branch)

The `Branch` component manages multiple versions of AI messages, allowing users to navigate between different response branches. It provides a clean, modern interface with customizable themes and keyboard-accessible navigation buttons.

CodePreview

What are the key strategies for optimizing React performance?

Ha

How can I improve the performance of my React application?

Ha

What performance optimization techniques should I use in React?

Ha

Here's the first response to your question. This approach focuses on performance optimization.

AI

Here's an alternative response. This approach emphasizes code readability and maintainability over pure performance.

AI

And here's a third option. This balanced approach considers both performance and maintainability, making it suitable for most use cases.

AI

## [Installation](#installation)

ai-elementsshadcnManual

npx ai-elements@latest add branch

## [Usage](#usage)

```tsx
import {
  Branch,
  BranchMessages,
  BranchNext,
  BranchPage,
  BranchPrevious,
  BranchSelector,
} from '@/components/ai-elements/branch';
```

```tsx
<Branch defaultBranch={0}>
  <BranchMessages>
    <Message from="user">
      <MessageContent>Hello</MessageContent>
    </Message>
    <Message from="user">
      <MessageContent>Hi!</MessageContent>
    </Message>
  </BranchMessages>
  <BranchSelector from="user">
    <BranchPrevious />
    <BranchPage />
    <BranchNext />
  </BranchSelector>
</Branch>
```

## [Usage with AI SDK](#usage-with-ai-sdk)

Branching is an advanced use case that you can implement yourself to suit your application's needs. While the AI SDK does not provide built-in support for branching, you have full flexibility to design and manage multiple response paths as required.

## [Features](#features)

-   Context-based state management for multiple message branches
-   Navigation controls for moving between branches (previous/next)
-   Uses CSS to prevent re-rendering of branches when switching
-   Branch counter showing current position (e.g., "1 of 3")
-   Automatic branch tracking and synchronization
-   Callbacks for branch change and navigation using `onBranchChange`
-   Support for custom branch change callbacks
-   Responsive design with mobile-friendly controls
-   Clean, modern styling with customizable themes
-   Keyboard-accessible navigation buttons

## [Props](#props)

### [`<Branch />`](#branch-)

### defaultBranch?:

number

The index of the branch to show by default (default: 0).

### onBranchChange?:

(branchIndex: number) => void

Callback fired when the branch changes.

### \[...props\]:

React.HTMLAttributes<HTMLDivElement>

Any other props are spread to the root div.

### [`<BranchMessages />`](#branchmessages-)

### \[...props\]:

React.HTMLAttributes<HTMLDivElement>

Any other props are spread to the root div.

### [`<BranchSelector />`](#branchselector-)

### from:

UIMessage\["role"\]

Aligns the selector for user, assistant or system messages.

### \[...props\]:

React.HTMLAttributes<HTMLDivElement>

Any other props are spread to the selector container.

### [`<BranchPrevious />`](#branchprevious-)

### \[...props\]:

React.ComponentProps<typeof Button>

Any other props are spread to the underlying shadcn/ui Button component.

### [`<BranchNext />`](#branchnext-)

### \[...props\]:

React.ComponentProps<typeof Button>

Any other props are spread to the underlying shadcn/ui Button component.

### [`<BranchPage />`](#branchpage-)

### \[...props\]:

React.HTMLAttributes<HTMLSpanElement>

Any other props are spread to the underlying span element.

[Previous

Actions

](actions.html)

[Next

Chain of Thought

](chain-of-thought.html)

On this page

[Branch](#branch)

[Installation](#installation)

[Usage](#usage)

[Usage with AI SDK](#usage-with-ai-sdk)

[Features](#features)

[Props](#props)

[<Branch />](#branch-)

[<BranchMessages />](#branchmessages-)

[<BranchSelector />](#branchselector-)

[<BranchPrevious />](#branchprevious-)

[<BranchNext />](#branchnext-)

[<BranchPage />](#branchpage-)

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