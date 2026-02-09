Chatbot: Chain of Thought

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

[Components](../components.html)Chain of Thought

# [Chain of Thought](#chain-of-thought)

The `ChainOfThought` component provides a visual representation of an AI's reasoning process, showing step-by-step thinking with support for search results, images, and progress indicators. It helps users understand how AI arrives at conclusions.

CodePreview

Chain of Thought

## [Installation](#installation)

ai-elementsshadcnManual

npx ai-elements@latest add chain-of-thought

## [Usage](#usage)

```tsx
import {
  ChainOfThought,
  ChainOfThoughtContent,
  ChainOfThoughtHeader,
  ChainOfThoughtImage,
  ChainOfThoughtSearchResult,
  ChainOfThoughtSearchResults,
  ChainOfThoughtStep,
} from '@/components/ai-elements/chain-of-thought';
```

```tsx
<ChainOfThought defaultOpen>
  <ChainOfThoughtHeader />
  <ChainOfThoughtContent>
    <ChainOfThoughtStep
      icon={SearchIcon}
      label="Searching for information"
      status="complete"
    >
      <ChainOfThoughtSearchResults>
        <ChainOfThoughtSearchResult>
          Result 1
        </ChainOfThoughtSearchResult>
      </ChainOfThoughtSearchResults>
    </ChainOfThoughtStep>
  </ChainOfThoughtContent>
</ChainOfThought>
```

## [Features](#features)

-   Collapsible interface with smooth animations powered by Radix UI
-   Step-by-step visualization of AI reasoning process
-   Support for different step statuses (complete, active, pending)
-   Built-in search results display with badge styling
-   Image support with captions for visual content
-   Custom icons for different step types
-   Context-aware components using React Context API
-   Fully typed with TypeScript
-   Accessible with keyboard navigation support
-   Responsive design that adapts to different screen sizes
-   Smooth fade and slide animations for content transitions
-   Composable architecture for flexible customization

## [Props](#props)

### [`<ChainOfThought />`](#chainofthought-)

### open?:

boolean

Controlled open state of the collapsible.

### defaultOpen?:

boolean

Default open state when uncontrolled. Defaults to false.

### onOpenChange?:

(open: boolean) => void

Callback when the open state changes.

### \[...props\]?:

React.ComponentProps<"div">

Any other props are spread to the root div element.

### [`<ChainOfThoughtHeader />`](#chainofthoughtheader-)

### children?:

React.ReactNode

Custom header text. Defaults to "Chain of Thought".

### \[...props\]?:

React.ComponentProps<typeof CollapsibleTrigger>

Any other props are spread to the CollapsibleTrigger component.

### [`<ChainOfThoughtStep />`](#chainofthoughtstep-)

### icon?:

LucideIcon

Icon to display for the step. Defaults to DotIcon.

### label:

string

The main text label for the step.

### description?:

string

Optional description text shown below the label.

### status?:

"complete" | "active" | "pending"

Visual status of the step. Defaults to "complete".

### \[...props\]?:

React.ComponentProps<"div">

Any other props are spread to the root div element.

### [`<ChainOfThoughtSearchResults />`](#chainofthoughtsearchresults-)

### \[...props\]?:

React.ComponentProps<"div">

Any props are spread to the container div element.

### [`<ChainOfThoughtSearchResult />`](#chainofthoughtsearchresult-)

### \[...props\]?:

React.ComponentProps<typeof Badge>

Any props are spread to the Badge component.

### [`<ChainOfThoughtContent />`](#chainofthoughtcontent-)

### \[...props\]?:

React.ComponentProps<typeof CollapsibleContent>

Any props are spread to the CollapsibleContent component.

### [`<ChainOfThoughtImage />`](#chainofthoughtimage-)

### caption?:

string

Optional caption text displayed below the image.

### \[...props\]?:

React.ComponentProps<"div">

Any other props are spread to the container div element.

[Previous

Branch

](branch.html)

[Next

Code Block

](code-block.html)

On this page

[Chain of Thought](#chain-of-thought)

[Installation](#installation)

[Usage](#usage)

[Features](#features)

[Props](#props)

[<ChainOfThought />](#chainofthought-)

[<ChainOfThoughtHeader />](#chainofthoughtheader-)

[<ChainOfThoughtStep />](#chainofthoughtstep-)

[<ChainOfThoughtSearchResults />](#chainofthoughtsearchresults-)

[<ChainOfThoughtSearchResult />](#chainofthoughtsearchresult-)

[<ChainOfThoughtContent />](#chainofthoughtcontent-)

[<ChainOfThoughtImage />](#chainofthoughtimage-)

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