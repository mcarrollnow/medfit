AI SDK 5 is available now.










Menu


















































































































































































































































# [Workflow](#workflow)





Code

Preview





















Start



Initialize workflow




Triggered by user action at 09:30 AM



Status: Ready












Process Data



Transform input




Validating 1,234 records and applying business rules



Duration: ~2.5s












Decision Point



Route based on conditions




Evaluating: data.status === 'valid' && data.score \> 0.8



Confidence: 94%












Success Path



Handle success case




1,156 records passed validation (93.7%)



Next: Send to production












Error Path



Handle error case




78 records failed validation (6.3%)



Next: Queue for review










Complete



Finalize workflow




All records processed and routed successfully



Total time: 4.2s














Export






Press enter or space to select a node. You can then use the arrow keys to move the node around. Press delete to remove it and escape to cancel.



Press enter or space to select an edge. You can then press delete to remove it or escape to cancel.









## [Tutorial](#tutorial)

Let's walk through how to build a workflow visualization using AI Elements. Our example will include custom nodes with headers, content, and footers, along with animated and temporary edge types.

### [Setup](#setup)

First, set up a new Next.js repo and cd into it by running the following command (make sure you choose to use Tailwind in the project setup):













``` bash
npx create-next-app@latest ai-workflow && cd ai-workflow
```


Run the following command to install AI Elements. This will also set up shadcn/ui if you haven't already configured it:













``` bash
npx ai-elements@latest
```


Now, install the required dependencies:







pnpm







npm







yarn








``` geist-overflow-scroll-y
pnpm add @xyflow/react
```













We're now ready to start building our workflow!

### [Client](#client)

Let's build the workflow visualization step by step. We'll create the component structure, define our nodes and edges, and configure the canvas.

#### [Import the components](#import-the-components)

First, import the necessary AI Elements components in your `app/page.tsx`:












``` tsx
'use client';
import  from '@/components/ai-elements/canvas';import  from '@/components/ai-elements/connection';import  from '@/components/ai-elements/controls';import  from '@/components/ai-elements/edge';import  from '@/components/ai-elements/node';import  from '@/components/ai-elements/panel';import  from '@/components/ai-elements/toolbar';import  from '@/components/ui/button';
```


#### [Define node IDs](#define-node-ids)

Create a constant object to manage node identifiers. This makes it easier to reference nodes when creating edges:












``` tsx
const nodeIds = ;
```


#### [Create mock nodes](#create-mock-nodes)

Define the nodes array with position, type, and data for each node in your workflow:












``` tsx
const nodes = [  ,    data: ,      content: 'Triggered by user action at 09:30 AM',      footer: 'Status: Ready',    },  },  ,    data: ,      content: 'Validating 1,234 records and applying business rules',      footer: 'Duration: ~2.5s',    },  },  ,    data: ,      content: "Evaluating: data.status === 'valid' && data.score > 0.8",      footer: 'Confidence: 94%',    },  },  ,    data: ,      content: '1,156 records passed validation (93.7%)',      footer: 'Next: Send to production',    },  },  ,    data: ,      content: '78 records failed validation (6.3%)',      footer: 'Next: Queue for review',    },  },  ,    data: ,      content: 'All records processed and routed successfully',      footer: 'Total time: 4.2s',    },  },];
```


#### [Create mock edges](#create-mock-edges)

Define the connections between nodes. Use `animated` for active paths and `temporary` for conditional or error paths:












``` tsx
const edges = [  ,  ,  ,  ,  ,  ,];
```


#### [Create the node types](#create-the-node-types)

Define custom node rendering using the compound Node components:












``` tsx
const nodeTypes = : ;      content: string;      footer: string;    };  }) => (    <Node handles=>      <NodeHeader>        <NodeTitle></NodeTitle>        <NodeDescription></NodeDescription>      </NodeHeader>      <NodeContent>        <p className="text-sm"></p>      </NodeContent>      <NodeFooter>        <p className="text-muted-foreground text-xs"></p>      </NodeFooter>      <Toolbar>        <Button size="sm" variant="ghost">          Edit        </Button>        <Button size="sm" variant="ghost">          Delete        </Button>      </Toolbar>    </Node>  ),};
```


#### [Create the edge types](#create-the-edge-types)

Map the edge type names to the Edge components:












``` tsx
const edgeTypes = ;
```


#### [Build the main component](#build-the-main-component)

Finally, create the main component that renders the Canvas with all nodes, edges, controls, and custom UI panels:












``` tsx
const App = () => (  <Canvas    edges=    edgeTypes=    fitView    nodes=    nodeTypes=    connectionLineComponent=  >    <Controls />    <Panel position="top-left">      <Button size="sm" variant="secondary">        Export      </Button>    </Panel>  </Canvas>);
export default App;
```


### [Key Features](#key-features)

The workflow visualization demonstrates several powerful features:

- **Custom Node Components**: Each node uses the compound components (`NodeHeader`, `NodeTitle`, `NodeDescription`, `NodeContent`, `NodeFooter`) for consistent, structured layouts.
- **Node Toolbars**: The `Toolbar` component attaches contextual actions (like Edit and Delete buttons) to individual nodes, appearing when hovering or selecting them.
- **Handle Configuration**: Nodes can have source and/or target handles, controlling which connections are possible.
- **Multiple Edge Types**: The `animated` type shows active data flow, while `temporary` indicates conditional or error paths.
- **Custom Connection Lines**: The `Connection` component provides styled bezier curves when dragging new connections between nodes.
- **Interactive Controls**: The `Controls` component adds zoom in/out and fit view buttons with a modern, themed design.
- **Custom UI Panels**: The `Panel` component allows you to position custom UI elements (like buttons, filters, or legends) anywhere on the canvas.
- **Automatic Layout**: The `Canvas` component auto-fits the view and provides pan/zoom controls out of the box.

You now have a working workflow visualization! Feel free to explore dynamic workflows by connecting this to AI-generated process flows, or extend it with interactive editing capabilities using React Flow's built-in features.
















On this page


















































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.