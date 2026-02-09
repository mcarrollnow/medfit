Chatbot: Plan

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

[Components](../components.html)Plan

# [Plan](#plan)

The `Plan` component provides a flexible system for displaying AI-generated execution plans with collapsible content. Perfect for showing multi-step workflows, task breakdowns, and implementation strategies with support for streaming content and loading states.

CodePreview

Rewrite AI Elements to SolidJS

Rewrite the AI Elements component library from React to SolidJS while maintaining compatibility with existing React-based shadcn/ui components using solid-js/compat, updating all 29 components and their test suite.

Toggle plan

Build ⌘↩

## [Installation](#installation)

ai-elementsshadcnManual

npx ai-elements@latest add plan

## [Usage](#usage)

```tsx
import {
  Plan,
  PlanAction,
  PlanContent,
  PlanDescription,
  PlanFooter,
  PlanHeader,
  PlanTitle,
  PlanTrigger,
} from '@/components/ai-elements/plan';
```

```tsx
<Plan defaultOpen={false}>
  <PlanHeader>
    <div>
      <PlanTitle>Implement new feature</PlanTitle>
      <PlanDescription>
        Add authentication system with JWT tokens and refresh logic.
      </PlanDescription>
    </div>
    <PlanTrigger />
  </PlanHeader>
  <PlanContent>
    <div className="space-y-4 text-sm">
      <div>
        <h3 className="mb-2 font-semibold">Overview</h3>
        <p>This plan outlines the implementation strategy...</p>
      </div>
    </div>
  </PlanContent>
  <PlanFooter>
    <Button>Execute Plan</Button>
  </PlanFooter>
</Plan>
```

## [Features](#features)

-   Collapsible content with smooth animations
-   Streaming support with shimmer loading states
-   Built on shadcn/ui Card and Collapsible components
-   TypeScript support with comprehensive type definitions
-   Customizable styling with Tailwind CSS
-   Responsive design with mobile-friendly interactions
-   Keyboard navigation and accessibility support
-   Theme-aware with automatic dark mode support
-   Context-based state management for streaming

## [Props](#props)

### [`<Plan />`](#plan-)

### isStreaming?:

boolean

Whether content is currently streaming. Enables shimmer animations on title and description. Defaults to false.

### defaultOpen?:

boolean

Whether the plan is expanded by default.

### \[...props\]?:

React.ComponentProps<typeof Collapsible>

Any other props are spread to the Collapsible component.

### [`<PlanHeader />`](#planheader-)

### \[...props\]?:

React.ComponentProps<typeof CardHeader>

Any other props are spread to the CardHeader component.

### [`<PlanTitle />`](#plantitle-)

### children:

string

The title text. Displays with shimmer animation when isStreaming is true.

### \[...props\]?:

Omit<React.ComponentProps<typeof CardTitle>, "children">

Any other props (except children) are spread to the CardTitle component.

### [`<PlanDescription />`](#plandescription-)

### children:

string

The description text. Displays with shimmer animation when isStreaming is true.

### \[...props\]?:

Omit<React.ComponentProps<typeof CardDescription>, "children">

Any other props (except children) are spread to the CardDescription component.

### [`<PlanTrigger />`](#plantrigger-)

### \[...props\]?:

React.ComponentProps<typeof CollapsibleTrigger>

Any other props are spread to the CollapsibleTrigger component. Renders as a Button with chevron icon.

### [`<PlanContent />`](#plancontent-)

### \[...props\]?:

React.ComponentProps<typeof CardContent>

Any other props are spread to the CardContent component.

### [`<PlanFooter />`](#planfooter-)

### \[...props\]?:

React.ComponentProps<"div">

Any other props are spread to the div element.

### [`<PlanAction />`](#planaction-)

### \[...props\]?:

React.ComponentProps<typeof CardAction>

Any other props are spread to the CardAction component.

[Previous

Open In Chat

](open-in-chat.html)

[Next

Prompt Input

](prompt-input.html)

On this page

[Plan](#plan)

[Installation](#installation)

[Usage](#usage)

[Features](#features)

[Props](#props)

[<Plan />](#plan-)

[<PlanHeader />](#planheader-)

[<PlanTitle />](#plantitle-)

[<PlanDescription />](#plandescription-)

[<PlanTrigger />](#plantrigger-)

[<PlanContent />](#plancontent-)

[<PlanFooter />](#planfooter-)

[<PlanAction />](#planaction-)

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