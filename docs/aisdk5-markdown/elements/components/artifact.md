Vibe Coding: Artifact

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

[Components](../components.html)Artifact

# [Artifact](#artifact)

The `Artifact` component provides a structured container for displaying generated content like code, documents, or other outputs with built-in header actions.

CodePreview

Dijkstra's Algorithm Implementation

Updated 1 minute ago

RunCopyRegenerateDownloadShare

```
1# Dijkstra's Algorithm implementation
2import heapq
3
4def dijkstra(graph, start):
5    distances = {node: float('inf') for node in graph}
6    distances[start] = 0
7    heap = [(0, start)]
8    visited = set()
9    
10    while heap:
11        current_distance, current_node = heapq.heappop(heap)
12        if current_node in visited:
13            continue
14        visited.add(current_node)
15        
16        for neighbor, weight in graph[current_node].items():
17            distance = current_distance + weight
18            if distance < distances[neighbor]:
19                distances[neighbor] = distance
20                heapq.heappush(heap, (distance, neighbor))
21    
22    return distances
23
24# Example graph
25 graph = {
26    'A': {'B': 1, 'C': 4},
27    'B': {'A': 1, 'C': 2, 'D': 5},
28    'C': {'A': 4, 'B': 2, 'D': 1},
29    'D': {'B': 5, 'C': 1}
30}
31
32print(dijkstra(graph, 'A'))
```

```
1# Dijkstra's Algorithm implementation
2import heapq
3
4def dijkstra(graph, start):
5    distances = {node: float('inf') for node in graph}
6    distances[start] = 0
7    heap = [(0, start)]
8    visited = set()
9    
10    while heap:
11        current_distance, current_node = heapq.heappop(heap)
12        if current_node in visited:
13            continue
14        visited.add(current_node)
15        
16        for neighbor, weight in graph[current_node].items():
17            distance = current_distance + weight
18            if distance < distances[neighbor]:
19                distances[neighbor] = distance
20                heapq.heappush(heap, (distance, neighbor))
21    
22    return distances
23
24# Example graph
25 graph = {
26    'A': {'B': 1, 'C': 4},
27    'B': {'A': 1, 'C': 2, 'D': 5},
28    'C': {'A': 4, 'B': 2, 'D': 1},
29    'D': {'B': 5, 'C': 1}
30}
31
32print(dijkstra(graph, 'A'))
```

## [Installation](#installation)

ai-elementsshadcnManual

npx ai-elements@latest add artifact

## [Usage](#usage)

```tsx
import {
  Artifact,
  ArtifactAction,
  ArtifactActions,
  ArtifactContent,
  ArtifactDescription,
  ArtifactHeader,
  ArtifactTitle,
} from '@/components/ai-elements/artifact';
```

```tsx
<Artifact>
  <ArtifactHeader>
    <div>
      <ArtifactTitle>Dijkstra's Algorithm Implementation</ArtifactTitle>
      <ArtifactDescription>Updated 1 minute ago</ArtifactDescription>
    </div>
    <ArtifactActions>
      <ArtifactAction icon={CopyIcon} label="Copy" tooltip="Copy to clipboard" />
    </ArtifactActions>
  </ArtifactHeader>
  <ArtifactContent>
    {/* Your content here */}
  </ArtifactContent>
</Artifact>
```

## [Features](#features)

-   Structured container with header and content areas
-   Built-in header with title and description support
-   Flexible action buttons with tooltips
-   Customizable styling for all subcomponents
-   Support for close buttons and action groups
-   Clean, modern design with border and shadow
-   Responsive layout that adapts to content
-   TypeScript support with proper type definitions
-   Composable architecture for maximum flexibility

## [Examples](#examples)

### [With Code Display](#with-code-display)

CodePreview

Dijkstra's Algorithm Implementation

Updated 1 minute ago

RunCopyRegenerateDownloadShare

```
1# Dijkstra's Algorithm implementation
2import heapq
3
4def dijkstra(graph, start):
5    distances = {node: float('inf') for node in graph}
6    distances[start] = 0
7    heap = [(0, start)]
8    visited = set()
9    
10    while heap:
11        current_distance, current_node = heapq.heappop(heap)
12        if current_node in visited:
13            continue
14        visited.add(current_node)
15        
16        for neighbor, weight in graph[current_node].items():
17            distance = current_distance + weight
18            if distance < distances[neighbor]:
19                distances[neighbor] = distance
20                heapq.heappush(heap, (distance, neighbor))
21    
22    return distances
23
24# Example graph
25 graph = {
26    'A': {'B': 1, 'C': 4},
27    'B': {'A': 1, 'C': 2, 'D': 5},
28    'C': {'A': 4, 'B': 2, 'D': 1},
29    'D': {'B': 5, 'C': 1}
30}
31
32print(dijkstra(graph, 'A'))
```

```
1# Dijkstra's Algorithm implementation
2import heapq
3
4def dijkstra(graph, start):
5    distances = {node: float('inf') for node in graph}
6    distances[start] = 0
7    heap = [(0, start)]
8    visited = set()
9    
10    while heap:
11        current_distance, current_node = heapq.heappop(heap)
12        if current_node in visited:
13            continue
14        visited.add(current_node)
15        
16        for neighbor, weight in graph[current_node].items():
17            distance = current_distance + weight
18            if distance < distances[neighbor]:
19                distances[neighbor] = distance
20                heapq.heappush(heap, (distance, neighbor))
21    
22    return distances
23
24# Example graph
25 graph = {
26    'A': {'B': 1, 'C': 4},
27    'B': {'A': 1, 'C': 2, 'D': 5},
28    'C': {'A': 4, 'B': 2, 'D': 1},
29    'D': {'B': 5, 'C': 1}
30}
31
32print(dijkstra(graph, 'A'))
```

## [Props](#props)

### [`<Artifact />`](#artifact-)

### \[...props\]?:

React.HTMLAttributes<HTMLDivElement>

Any other props are spread to the underlying div element.

### [`<ArtifactHeader />`](#artifactheader-)

### \[...props\]?:

React.HTMLAttributes<HTMLDivElement>

Any other props are spread to the underlying div element.

### [`<ArtifactTitle />`](#artifacttitle-)

### \[...props\]?:

React.HTMLAttributes<HTMLParagraphElement>

Any other props are spread to the underlying paragraph element.

### [`<ArtifactDescription />`](#artifactdescription-)

### \[...props\]?:

React.HTMLAttributes<HTMLParagraphElement>

Any other props are spread to the underlying paragraph element.

### [`<ArtifactActions />`](#artifactactions-)

### \[...props\]?:

React.HTMLAttributes<HTMLDivElement>

Any other props are spread to the underlying div element.

### [`<ArtifactAction />`](#artifactaction-)

### tooltip?:

string

Tooltip text to display on hover.

### label?:

string

Screen reader label for the action button.

### icon?:

LucideIcon

Lucide icon component to display in the button.

### \[...props\]?:

React.ComponentProps<typeof Button>

Any other props are spread to the underlying shadcn/ui Button component.

### [`<ArtifactClose />`](#artifactclose-)

### \[...props\]?:

React.ComponentProps<typeof Button>

Any other props are spread to the underlying shadcn/ui Button component.

### [`<ArtifactContent />`](#artifactcontent-)

### \[...props\]?:

React.HTMLAttributes<HTMLDivElement>

Any other props are spread to the underlying div element.

[Previous

Vibe Coding

](vibe-coding.html)

[Next

Web Preview

](web-preview.html)

On this page

[Artifact](#artifact)

[Installation](#installation)

[Usage](#usage)

[Features](#features)

[Examples](#examples)

[With Code Display](#with-code-display)

[Props](#props)

[<Artifact />](#artifact-)

[<ArtifactHeader />](#artifactheader-)

[<ArtifactTitle />](#artifacttitle-)

[<ArtifactDescription />](#artifactdescription-)

[<ArtifactActions />](#artifactactions-)

[<ArtifactAction />](#artifactaction-)

[<ArtifactClose />](#artifactclose-)

[<ArtifactContent />](#artifactcontent-)

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