Workflow: Canvas

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

[Components](../components.html)Canvas

# [Canvas](#canvas)

The `Canvas` component provides a React Flow-based canvas for building interactive node-based interfaces. It comes pre-configured with sensible defaults for AI applications, including panning, zooming, and selection behaviors.

The Canvas component is designed to be used with the [Node](node.html) and [Edge](edge.html) components. See the [Workflow](../examples/workflow.html) demo for a full example.

## [Installation](#installation)

ai-elementsshadcnManual

npx ai-elements@latest add canvas

## [Usage](#usage)

```tsx
import { Canvas } from '@/components/ai-elements/canvas';
```

```tsx
<Canvas nodes={nodes} edges={edges} nodeTypes={nodeTypes} edgeTypes={edgeTypes} />
```

## [Features](#features)

-   Pre-configured React Flow canvas with AI-optimized defaults
-   Pan on scroll enabled for intuitive navigation
-   Selection on drag for multi-node operations
-   Customizable background color using CSS variables
-   Delete key support (Backspace and Delete keys)
-   Auto-fit view to show all nodes
-   Disabled double-click zoom for better UX
-   Disabled pan on drag to prevent accidental canvas movement
-   Fully compatible with React Flow props and API

## [Props](#props)

### [`<Canvas />`](#canvas-)

### children?:

ReactNode

Child components like Background, Controls, or MiniMap.

### \[...props\]:

ReactFlowProps

Any other React Flow props like nodes, edges, nodeTypes, edgeTypes, onNodesChange, etc.

[Previous

Workflow

](workflow.html)

[Next

Connection

](connection.html)

On this page

[Canvas](#canvas)

[Installation](#installation)

[Usage](#usage)

[Features](#features)

[Props](#props)

[<Canvas />](#canvas-)

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