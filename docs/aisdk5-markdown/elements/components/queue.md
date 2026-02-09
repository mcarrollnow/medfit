Chatbot: Queue

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

[Components](../components.html)Queue

# [Queue](#queue)

The `Queue` component provides a flexible system for displaying lists of messages, todos, attachments, and collapsible sections. Perfect for showing AI workflow progress, pending tasks, message history, or any structured list of items in your application.

CodePreview

7 Queued

-   How do I set up the project?
    
-   What is the roadmap for Q4?
    
-   Can you review my PR?
    
-   Please generate a changelog.
    
-   Add dark mode support.
    
-   Optimize database queries.
    
-   Set up CI/CD pipeline.
    

5 Todo

-   Write project documentation
    
    Complete the README and API docs
    
-   Implement authentication
    
-   Fix bug #42
    
    Resolve crash on settings page
    
-   Refactor queue logic
    
    Unify queue and todo state management
    
-   Add unit tests
    
    Increase test coverage for hooks
    

## [Installation](#installation)

ai-elementsshadcnManual

npx ai-elements@latest add queue

## [Usage](#usage)

```tsx
import {
  Queue,
  QueueSection,
  QueueSectionTrigger,
  QueueSectionLabel,
  QueueSectionContent,
  QueueList,
  QueueItem,
  QueueItemIndicator,
  QueueItemContent,
} from '@/components/ai-elements/queue';
```

```tsx
<Queue>
  <QueueSection>
    <QueueSectionTrigger>
      <QueueSectionLabel count={3} label="Tasks" />
    </QueueSectionTrigger>
    <QueueSectionContent>
      <QueueList>
        <QueueItem>
          <QueueItemIndicator />
          <QueueItemContent>Analyze user requirements</QueueItemContent>
        </QueueItem>
      </QueueList>
    </QueueSectionContent>
  </QueueSection>
</Queue>
```

## [Features](#features)

-   Flexible component system with composable parts
-   Collapsible sections with smooth animations
-   Support for completed/pending state indicators
-   Built-in scroll area for long lists
-   Attachment display with images and file indicators
-   Hover-revealed action buttons for queue items
-   TypeScript support with comprehensive type definitions
-   Customizable styling with Tailwind CSS
-   Responsive design with mobile-friendly interactions
-   Keyboard navigation and accessibility support
-   Theme-aware with automatic dark mode support

## [Examples](#examples)

### [With PromptInput](#with-promptinput)

CodePreview

-   Write project documentation
    
    Complete the README and API docs
    
-   Implement authentication
    
-   Fix bug #42
    
    Resolve crash on settings page
    
-   Refactor queue logic
    
    Unify queue and todo state management
    
-   Add unit tests
    
    Increase test coverage for hooks
    

Search

## [Props](#props)

### [`<Queue />`](#queue-)

### \[...props\]?:

React.ComponentProps<"div">

Any other props are spread to the root div.

### [`<QueueSection />`](#queuesection-)

### defaultOpen?:

boolean

Whether the section is open by default. Defaults to true.

### \[...props\]?:

React.ComponentProps<typeof Collapsible>

Any other props are spread to the Collapsible component.

### [`<QueueSectionTrigger />`](#queuesectiontrigger-)

### \[...props\]?:

React.ComponentProps<"button">

Any other props are spread to the button element.

### [`<QueueSectionLabel />`](#queuesectionlabel-)

### label:

string

The label text to display.

### count?:

number

The count to display before the label.

### icon?:

React.ReactNode

An optional icon to display before the count.

### \[...props\]?:

React.ComponentProps<"span">

Any other props are spread to the span element.

### [`<QueueSectionContent />`](#queuesectioncontent-)

### \[...props\]?:

React.ComponentProps<typeof CollapsibleContent>

Any other props are spread to the CollapsibleContent component.

### [`<QueueList />`](#queuelist-)

### \[...props\]?:

React.ComponentProps<typeof ScrollArea>

Any other props are spread to the ScrollArea component.

### [`<QueueItem />`](#queueitem-)

### \[...props\]?:

React.ComponentProps<"li">

Any other props are spread to the li element.

### [`<QueueItemIndicator />`](#queueitemindicator-)

### completed?:

boolean

Whether the item is completed. Affects the indicator styling. Defaults to false.

### \[...props\]?:

React.ComponentProps<"span">

Any other props are spread to the span element.

### [`<QueueItemContent />`](#queueitemcontent-)

### completed?:

boolean

Whether the item is completed. Affects text styling with strikethrough and opacity. Defaults to false.

### \[...props\]?:

React.ComponentProps<"span">

Any other props are spread to the span element.

### [`<QueueItemDescription />`](#queueitemdescription-)

### completed?:

boolean

Whether the item is completed. Affects text styling. Defaults to false.

### \[...props\]?:

React.ComponentProps<"div">

Any other props are spread to the div element.

### [`<QueueItemActions />`](#queueitemactions-)

### \[...props\]?:

React.ComponentProps<"div">

Any other props are spread to the div element.

### [`<QueueItemAction />`](#queueitemaction-)

### \[...props\]?:

Omit<React.ComponentProps<typeof Button>, "variant" | "size">

Any other props (except variant and size) are spread to the Button component.

### [`<QueueItemAttachment />`](#queueitemattachment-)

### \[...props\]?:

React.ComponentProps<"div">

Any other props are spread to the div element.

### [`<QueueItemImage />`](#queueitemimage-)

### \[...props\]?:

React.ComponentProps<"img">

Any other props are spread to the img element.

### [`<QueueItemFile />`](#queueitemfile-)

### \[...props\]?:

React.ComponentProps<"span">

Any other props are spread to the span element.

[Previous

Prompt Input

](prompt-input.html)

[Next

Reasoning

](reasoning.html)

On this page

[Queue](#queue)

[Installation](#installation)

[Usage](#usage)

[Features](#features)

[Examples](#examples)

[With PromptInput](#with-promptinput)

[Props](#props)

[<Queue />](#queue-)

[<QueueSection />](#queuesection-)

[<QueueSectionTrigger />](#queuesectiontrigger-)

[<QueueSectionLabel />](#queuesectionlabel-)

[<QueueSectionContent />](#queuesectioncontent-)

[<QueueList />](#queuelist-)

[<QueueItem />](#queueitem-)

[<QueueItemIndicator />](#queueitemindicator-)

[<QueueItemContent />](#queueitemcontent-)

[<QueueItemDescription />](#queueitemdescription-)

[<QueueItemActions />](#queueitemactions-)

[<QueueItemAction />](#queueitemaction-)

[<QueueItemAttachment />](#queueitemattachment-)

[<QueueItemImage />](#queueitemimage-)

[<QueueItemFile />](#queueitemfile-)

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