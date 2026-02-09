AI SDK 5 is available now.










Menu


















































































































































































































































# [Chain of Thought](#chain-of-thought)

The `ChainOfThought` component provides a visual representation of an AI's reasoning process, showing step-by-step thinking with support for search results, images, and progress indicators. It helps users understand how AI arrives at conclusions.




Code

Preview





















## [Installation](#installation)




ai-elements

shadcn

Manual




``` geist-overflow-scroll-y
npx ai-elements@latest add chain-of-thought
```
















## [Usage](#usage)



``` tsx
import  from '@/components/ai-elements/chain-of-thought';
```




``` tsx
```


## [Features](#features)

- Collapsible interface with smooth animations powered by Radix UI
- Step-by-step visualization of AI reasoning process
- Support for different step statuses (complete, active, pending)
- Built-in search results display with badge styling
- Image support with captions for visual content
- Custom icons for different step types
- Context-aware components using React Context API
- Fully typed with TypeScript
- Accessible with keyboard navigation support
- Responsive design that adapts to different screen sizes
- Smooth fade and slide animations for content transitions
- Composable architecture for flexible customization

## [Props](#props)

### [`<ChainOfThought />`](#chainofthought-)






### open?:


boolean




Controlled open state of the collapsible.





### defaultOpen?:


boolean




Default open state when uncontrolled. Defaults to false.





### onOpenChange?:


(open: boolean) =\> void




Callback when the open state changes.





### \[...props\]?:


React.ComponentProps\<"div"\>




Any other props are spread to the root div element.






### [`<ChainOfThoughtHeader />`](#chainofthoughtheader-)






### children?:


React.ReactNode




Custom header text. Defaults to "Chain of Thought".





### \[...props\]?:


React.ComponentProps\<typeof CollapsibleTrigger\>




Any other props are spread to the CollapsibleTrigger component.






### [`<ChainOfThoughtStep />`](#chainofthoughtstep-)






### icon?:


LucideIcon




Icon to display for the step. Defaults to DotIcon.





### label:


string




The main text label for the step.





### description?:


string




Optional description text shown below the label.





### status?:


"complete" \| "active" \| "pending"




Visual status of the step. Defaults to "complete".





### \[...props\]?:


React.ComponentProps\<"div"\>




Any other props are spread to the root div element.






### [`<ChainOfThoughtSearchResults />`](#chainofthoughtsearchresults-)






### \[...props\]?:


React.ComponentProps\<"div"\>




Any props are spread to the container div element.






### [`<ChainOfThoughtSearchResult />`](#chainofthoughtsearchresult-)






### \[...props\]?:


React.ComponentProps\<typeof Badge\>




Any props are spread to the Badge component.






### [`<ChainOfThoughtContent />`](#chainofthoughtcontent-)






### \[...props\]?:


React.ComponentProps\<typeof CollapsibleContent\>




Any props are spread to the CollapsibleContent component.






### [`<ChainOfThoughtImage />`](#chainofthoughtimage-)






### caption?:


string




Optional caption text displayed below the image.





### \[...props\]?:


React.ComponentProps\<"div"\>




Any other props are spread to the container div element.





















On this page
















































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.