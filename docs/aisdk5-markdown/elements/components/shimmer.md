Chatbot: Shimmer

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

[Components](../components.html)Shimmer

# [Shimmer](#shimmer)

The `Shimmer` component provides an animated shimmer effect that sweeps across text, perfect for indicating loading states, progressive reveals, or drawing attention to dynamic content in AI applications.

CodePreview

Generating your response...

## [Installation](#installation)

ai-elementsshadcnManual

npx ai-elements@latest add shimmer

## [Usage](#usage)

```tsx
import { Shimmer } from '@/components/ai-elements/shimmer';
```

```tsx
<Shimmer>Loading your response...</Shimmer>
```

## [Features](#features)

-   Smooth animated shimmer effect using CSS gradients and Framer Motion
-   Customizable animation duration and spread
-   Polymorphic component - render as any HTML element via the `as` prop
-   Automatic spread calculation based on text length
-   Theme-aware styling using CSS custom properties
-   Infinite looping animation with linear easing
-   TypeScript support with proper type definitions
-   Memoized for optimal performance
-   Responsive and accessible design
-   Uses `text-transparent` with background-clip for crisp text rendering

## [Examples](#examples)

### [Different Durations](#different-durations)

CodePreview

Fast (1 second)

Loading quickly...

Default (2 seconds)

Loading at normal speed...

Slow (4 seconds)

Loading slowly...

Very Slow (6 seconds)

Loading very slowly...

### [Custom Elements](#custom-elements)

CodePreview

As paragraph (default)

This is rendered as a paragraph

As heading

## Large Heading with Shimmer

As span (inline)

Processing your request with AI magic...

As div with custom styling

Custom styled shimmer text

## [Props](#props)

### [`<Shimmer />`](#shimmer-)

### children:

string

The text content to apply the shimmer effect to.

### as?:

ElementType

The HTML element or React component to render. Defaults to "p".

### className?:

string

Additional CSS classes to apply to the component.

### duration?:

number

The duration of the shimmer animation in seconds. Defaults to 2.

### spread?:

number

The spread multiplier for the shimmer gradient, multiplied by text length. Defaults to 2.

[Previous

Response

](response.html)

[Next

Sources

](sources.html)

On this page

[Shimmer](#shimmer)

[Installation](#installation)

[Usage](#usage)

[Features](#features)

[Examples](#examples)

[Different Durations](#different-durations)

[Custom Elements](#custom-elements)

[Props](#props)

[<Shimmer />](#shimmer-)

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