Workflow: Node

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

[Components](../components.html)Node

# [Node](#node)

The `Node` component provides a composable, Card-based node for React Flow canvases. It includes support for connection handles, structured layouts, and consistent styling using shadcn/ui components.

The Node component is designed to be used with the [Canvas](canvas.html) component. See the [Workflow](../examples/workflow.html) demo for a full example.

## [Installation](#installation)

ai-elementsshadcnManual

npx ai-elements@latest add node

## [Usage](#usage)

```tsx
import {
  Node,
  NodeHeader,
  NodeTitle,
  NodeDescription,
  NodeAction,
  NodeContent,
  NodeFooter,
} from '@/components/ai-elements/node';
```

```tsx
<Node handles={{ target: true, source: true }}>
  <NodeHeader>
    <NodeTitle>Node Title</NodeTitle>
    <NodeDescription>Optional description</NodeDescription>
    <NodeAction>
      <Button>Action</Button>
    </NodeAction>
  </NodeHeader>
  <NodeContent>
    Main content goes here
  </NodeContent>
  <NodeFooter>
    Footer content
  </NodeFooter>
</Node>
```

## [Features](#features)

-   Built on shadcn/ui Card components for consistent styling
-   Automatic handle placement (left for target, right for source)
-   Composable sub-components (Header, Title, Description, Action, Content, Footer)
-   Semantic structure for organizing node information
-   Pre-styled sections with borders and backgrounds
-   Responsive sizing with fixed small width
-   Full TypeScript support with proper type definitions
-   Compatible with React Flow's node system

## [Props](#props)

### [`<Node />`](#node-)

### handles:

{ target: boolean; source: boolean; }

Configuration for connection handles. Target renders on the left, source on the right.

### className?:

string

Additional CSS classes to apply to the node.

### \[...props\]:

ComponentProps<typeof Card>

Any other props are spread to the underlying Card component.

### [`<NodeHeader />`](#nodeheader-)

### className?:

string

Additional CSS classes to apply to the header.

### \[...props\]:

ComponentProps<typeof CardHeader>

Any other props are spread to the underlying CardHeader component.

### [`<NodeTitle />`](#nodetitle-)

### \[...props\]:

ComponentProps<typeof CardTitle>

Any other props are spread to the underlying CardTitle component.

### [`<NodeDescription />`](#nodedescription-)

### \[...props\]:

ComponentProps<typeof CardDescription>

Any other props are spread to the underlying CardDescription component.

### [`<NodeAction />`](#nodeaction-)

### \[...props\]:

ComponentProps<typeof CardAction>

Any other props are spread to the underlying CardAction component.

### [`<NodeContent />`](#nodecontent-)

### className?:

string

Additional CSS classes to apply to the content.

### \[...props\]:

ComponentProps<typeof CardContent>

Any other props are spread to the underlying CardContent component.

### [`<NodeFooter />`](#nodefooter-)

### className?:

string

Additional CSS classes to apply to the footer.

### \[...props\]:

ComponentProps<typeof CardFooter>

Any other props are spread to the underlying CardFooter component.

[Previous

Edge

](edge.html)

[Next

Panel

](panel.html)

On this page

[Node](#node)

[Installation](#installation)

[Usage](#usage)

[Features](#features)

[Props](#props)

[<Node />](#node-)

[<NodeHeader />](#nodeheader-)

[<NodeTitle />](#nodetitle-)

[<NodeDescription />](#nodedescription-)

[<NodeAction />](#nodeaction-)

[<NodeContent />](#nodecontent-)

[<NodeFooter />](#nodefooter-)

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