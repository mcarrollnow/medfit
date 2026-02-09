AI SDK 5 is available now.










Menu


















































































































































































































































# [Node](#node)

The `Node` component provides a composable, Card-based node for React Flow canvases. It includes support for connection handles, structured layouts, and consistent styling using shadcn/ui components.




The Node component is designed to be used with the [Canvas](canvas.html) component. See the [Workflow](../examples/workflow.html) demo for a full example.



## [Installation](#installation)




ai-elements

shadcn

Manual




``` geist-overflow-scroll-y
npx ai-elements@latest add node
```
















## [Usage](#usage)



``` tsx
import  from '@/components/ai-elements/node';
```




``` tsx
```


## [Features](#features)

- Built on shadcn/ui Card components for consistent styling
- Automatic handle placement (left for target, right for source)
- Composable sub-components (Header, Title, Description, Action, Content, Footer)
- Semantic structure for organizing node information
- Pre-styled sections with borders and backgrounds
- Responsive sizing with fixed small width
- Full TypeScript support with proper type definitions
- Compatible with React Flow's node system

## [Props](#props)

### [`<Node />`](#node-)






### handles:





Configuration for connection handles. Target renders on the left, source on the right.





### className?:


string




Additional CSS classes to apply to the node.





### \[...props\]:


ComponentProps\<typeof Card\>




Any other props are spread to the underlying Card component.






### [`<NodeHeader />`](#nodeheader-)






### className?:


string




Additional CSS classes to apply to the header.





### \[...props\]:


ComponentProps\<typeof CardHeader\>




Any other props are spread to the underlying CardHeader component.






### [`<NodeTitle />`](#nodetitle-)






### \[...props\]:


ComponentProps\<typeof CardTitle\>




Any other props are spread to the underlying CardTitle component.






### [`<NodeDescription />`](#nodedescription-)






### \[...props\]:


ComponentProps\<typeof CardDescription\>




Any other props are spread to the underlying CardDescription component.






### [`<NodeAction />`](#nodeaction-)






### \[...props\]:


ComponentProps\<typeof CardAction\>




Any other props are spread to the underlying CardAction component.






### [`<NodeContent />`](#nodecontent-)






### className?:


string




Additional CSS classes to apply to the content.





### \[...props\]:


ComponentProps\<typeof CardContent\>




Any other props are spread to the underlying CardContent component.






### [`<NodeFooter />`](#nodefooter-)






### className?:


string




Additional CSS classes to apply to the footer.





### \[...props\]:


ComponentProps\<typeof CardFooter\>




Any other props are spread to the underlying CardFooter component.





















On this page
















































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.