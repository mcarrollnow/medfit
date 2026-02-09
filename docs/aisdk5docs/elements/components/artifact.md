AI SDK 5 is available now.










Menu


















































































































































































































































# [Artifact](#artifact)

The `Artifact` component provides a structured container for displaying generated content like code, documents, or other outputs with built-in header actions.




Code

Preview









Dijkstra's Algorithm Implementation

Updated 1 minute ago















``` overflow-hidden
1# Dijkstra's Algorithm implementation
2import heapq
3
4def dijkstra(graph, start):
5    distances = 
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
25 graph = ,
27    'B': ,
28    'C': ,
29    'D': 
30}
31
32print(dijkstra(graph, 'A'))
```

``` hidden
1# Dijkstra's Algorithm implementation
2import heapq
3
4def dijkstra(graph, start):
5    distances = 
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
25 graph = ,
27    'B': ,
28    'C': ,
29    'D': 
30}
31
32print(dijkstra(graph, 'A'))
```









## [Installation](#installation)




ai-elements

shadcn

Manual




``` geist-overflow-scroll-y
npx ai-elements@latest add artifact
```
















## [Usage](#usage)



``` tsx
import  from '@/components/ai-elements/artifact';
```




``` tsx
```


## [Features](#features)

- Structured container with header and content areas
- Built-in header with title and description support
- Flexible action buttons with tooltips
- Customizable styling for all subcomponents
- Support for close buttons and action groups
- Clean, modern design with border and shadow
- Responsive layout that adapts to content
- TypeScript support with proper type definitions
- Composable architecture for maximum flexibility

## [Examples](#examples)

### [With Code Display](#with-code-display)




Code

Preview









Dijkstra's Algorithm Implementation

Updated 1 minute ago















``` overflow-hidden
1# Dijkstra's Algorithm implementation
2import heapq
3
4def dijkstra(graph, start):
5    distances = 
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
25 graph = ,
27    'B': ,
28    'C': ,
29    'D': 
30}
31
32print(dijkstra(graph, 'A'))
```

``` hidden
1# Dijkstra's Algorithm implementation
2import heapq
3
4def dijkstra(graph, start):
5    distances = 
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
25 graph = ,
27    'B': ,
28    'C': ,
29    'D': 
30}
31
32print(dijkstra(graph, 'A'))
```









## [Props](#props)

### [`<Artifact />`](#artifact-)






### \[...props\]?:


React.HTMLAttributes\<HTMLDivElement\>




Any other props are spread to the underlying div element.






### [`<ArtifactHeader />`](#artifactheader-)






### \[...props\]?:


React.HTMLAttributes\<HTMLDivElement\>




Any other props are spread to the underlying div element.






### [`<ArtifactTitle />`](#artifacttitle-)






### \[...props\]?:


React.HTMLAttributes\<HTMLParagraphElement\>




Any other props are spread to the underlying paragraph element.






### [`<ArtifactDescription />`](#artifactdescription-)






### \[...props\]?:


React.HTMLAttributes\<HTMLParagraphElement\>




Any other props are spread to the underlying paragraph element.






### [`<ArtifactActions />`](#artifactactions-)






### \[...props\]?:


React.HTMLAttributes\<HTMLDivElement\>




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


React.ComponentProps\<typeof Button\>




Any other props are spread to the underlying shadcn/ui Button component.






### [`<ArtifactClose />`](#artifactclose-)






### \[...props\]?:


React.ComponentProps\<typeof Button\>




Any other props are spread to the underlying shadcn/ui Button component.






### [`<ArtifactContent />`](#artifactcontent-)






### \[...props\]?:


React.HTMLAttributes\<HTMLDivElement\>




Any other props are spread to the underlying div element.





















On this page



























































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.