AI SDK 5 is available now.










Menu










































































































































































































































Introduction










# [AI Elements](#ai-elements)


You can install it with:




ai-elements

shadcn




``` geist-overflow-scroll-y
npx ai-elements@latest
```














Here are some basic examples of what you can achieve using components from AI Elements.




































More














## [Components](#components)




Actions









Code

Preview











Hello, how are you?





I am fine, thank you!




















Artifact









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












Branch









Code

Preview











What are the key strategies for optimizing React performance?








How can I improve the performance of my React application?








What performance optimization techniques should I use in React?










Here's the first response to your question. This approach focuses on performance optimization.








Here's an alternative response. This approach emphasizes code readability and maintainability over pure performance.








And here's a third option. This balanced approach considers both performance and maintainability, making it suitable for most use cases.














Chain of Thought









Code

Preview
























Code Block









Code

Preview








``` overflow-hidden
function MyComponent(props) !</h1>
  );
}
```

``` hidden
function MyComponent(props) !</h1>
  );
}
```













Context









Code

Preview


















Conversation









Code

Preview














### Start a conversation

Messages will appear here as the conversation progresses.













Image









Code

Preview














Loader









Code

Preview

















Message









Code

Preview








Hello, how are you?











Open In Chat









Code

Preview
















Prompt Input









Code

Preview





























Queue









Code

Preview




































































  Complete the README and API docs













  Resolve crash on settings page








  Unify queue and todo state management








  Increase test coverage for hooks
















Reasoning









Code

Preview









Thinking...















Response









Code

Preview















Shimmer









Code

Preview







Generating your response...









Sources









Code

Preview








Used 3 sources













Suggestion









Code

Preview










What are the latest trends in AI?

How does machine learning work?

Explain quantum computing

Best practices for React development

Tell me about TypeScript benefits

How to optimize database queries?

What is the difference between SQL and NoSQL?

Explain cloud computing basics












Task









Code

Preview










Found project files






Searching "app/page.tsx, components structure"









Scanning 52 files



Scanning 2 files



















Tool









Code

Preview


























Web Preview









Code

Preview






























Inline Citation









Code

Preview








example.com +5


.

















On this page
















Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.