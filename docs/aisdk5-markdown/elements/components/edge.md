Workflow: Edge

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

[Components](../components.html)Edge

# [Edge](#edge)

The `Edge` component provides two pre-styled edge types for React Flow canvases: `Temporary` for dashed temporary connections and `Animated` for connections with animated indicators.

The Edge component is designed to be used with the [Canvas](canvas.html) component. See the [Workflow](../examples/workflow.html) demo for a full example.

## [Installation](#installation)

ai-elementsshadcnManual

npx ai-elements@latest add edge

## [Usage](#usage)

```tsx
import { Edge } from '@/components/ai-elements/edge';
```

```tsx
const edgeTypes = {
  temporary: Edge.Temporary,
  animated: Edge.Animated,
};


<Canvas
  nodes={nodes}
  edges={edges}
  edgeTypes={edgeTypes}
/>
```

## [Features](#features)

-   Two distinct edge types: Temporary and Animated
-   Temporary edges use dashed lines with ring color
-   Animated edges include a moving circle indicator
-   Automatic handle position calculation
-   Smart offset calculation based on handle type and position
-   Uses Bezier curves for smooth, natural-looking connections
-   Fully compatible with React Flow's edge system
-   Type-safe implementation with TypeScript

## [Edge Types](#edge-types)

### [`Edge.Temporary`](#edgetemporary)

A dashed edge style for temporary or preview connections. Uses a simple Bezier path with a dashed stroke pattern.

### [`Edge.Animated`](#edgeanimated)

A solid edge with an animated circle that moves along the path. The animation repeats indefinitely with a 2-second duration, providing visual feedback for active connections.

## [Props](#props)

Both edge types accept standard React Flow `EdgeProps`:

### id:

string

Unique identifier for the edge.

### source:

string

ID of the source node.

### target:

string

ID of the target node.

### sourceX?:

number

X coordinate of the source handle (Temporary only).

### sourceY?:

number

Y coordinate of the source handle (Temporary only).

### targetX?:

number

X coordinate of the target handle (Temporary only).

### targetY?:

number

Y coordinate of the target handle (Temporary only).

### sourcePosition?:

Position

Position of the source handle (Left, Right, Top, Bottom).

### targetPosition?:

Position

Position of the target handle (Left, Right, Top, Bottom).

### markerEnd?:

string

SVG marker ID for the edge end (Animated only).

### style?:

React.CSSProperties

Custom styles for the edge (Animated only).

[Previous

Controls

](controls.html)

[Next

Node

](node.html)

On this page

[Edge](#edge)

[Installation](#installation)

[Usage](#usage)

[Features](#features)

[Edge Types](#edge-types)

[Edge.Temporary](#edgetemporary)

[Edge.Animated](#edgeanimated)

[Props](#props)

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