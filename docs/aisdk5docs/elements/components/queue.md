AI SDK 5 is available now.










Menu


















































































































































































































































# [Queue](#queue)

The `Queue` component provides a flexible system for displaying lists of messages, todos, attachments, and collapsible sections. Perfect for showing AI workflow progress, pending tasks, message history, or any structured list of items in your application.




Code

Preview




































































  Complete the README and API docs













  Resolve crash on settings page








  Unify queue and todo state management








  Increase test coverage for hooks













## [Installation](#installation)




ai-elements

shadcn

Manual




``` geist-overflow-scroll-y
npx ai-elements@latest add queue
```
















## [Usage](#usage)



``` tsx
import  from '@/components/ai-elements/queue';
```




``` tsx
```


## [Features](#features)

- Flexible component system with composable parts
- Collapsible sections with smooth animations
- Support for completed/pending state indicators
- Built-in scroll area for long lists
- Attachment display with images and file indicators
- Hover-revealed action buttons for queue items
- TypeScript support with comprehensive type definitions
- Customizable styling with Tailwind CSS
- Responsive design with mobile-friendly interactions
- Keyboard navigation and accessibility support
- Theme-aware with automatic dark mode support

## [Examples](#examples)

### [With PromptInput](#with-promptinput)




Code

Preview


















Complete the README and API docs















Resolve crash on settings page









Unify queue and todo state management









Increase test coverage for hooks

























## [Props](#props)

### [`<Queue />`](#queue-)






### \[...props\]?:


React.ComponentProps\<"div"\>




Any other props are spread to the root div.






### [`<QueueSection />`](#queuesection-)






### defaultOpen?:


boolean




Whether the section is open by default. Defaults to true.





### \[...props\]?:


React.ComponentProps\<typeof Collapsible\>




Any other props are spread to the Collapsible component.






### [`<QueueSectionTrigger />`](#queuesectiontrigger-)






### \[...props\]?:


React.ComponentProps\<"button"\>




Any other props are spread to the button element.






### [`<QueueSectionLabel />`](#queuesectionlabel-)






### label:


string




The label text to display.





### count?:


number




The count to display before the label.





### icon?:


React.ReactNode




An optional icon to display before the count.





### \[...props\]?:


React.ComponentProps\<"span"\>




Any other props are spread to the span element.






### [`<QueueSectionContent />`](#queuesectioncontent-)






### \[...props\]?:


React.ComponentProps\<typeof CollapsibleContent\>




Any other props are spread to the CollapsibleContent component.






### [`<QueueList />`](#queuelist-)






### \[...props\]?:


React.ComponentProps\<typeof ScrollArea\>




Any other props are spread to the ScrollArea component.






### [`<QueueItem />`](#queueitem-)






### \[...props\]?:


React.ComponentProps\<"li"\>




Any other props are spread to the li element.






### [`<QueueItemIndicator />`](#queueitemindicator-)






### completed?:


boolean




Whether the item is completed. Affects the indicator styling. Defaults to false.





### \[...props\]?:


React.ComponentProps\<"span"\>




Any other props are spread to the span element.






### [`<QueueItemContent />`](#queueitemcontent-)






### completed?:


boolean




Whether the item is completed. Affects text styling with strikethrough and opacity. Defaults to false.





### \[...props\]?:


React.ComponentProps\<"span"\>




Any other props are spread to the span element.






### [`<QueueItemDescription />`](#queueitemdescription-)






### completed?:


boolean




Whether the item is completed. Affects text styling. Defaults to false.





### \[...props\]?:


React.ComponentProps\<"div"\>




Any other props are spread to the div element.






### [`<QueueItemActions />`](#queueitemactions-)






### \[...props\]?:


React.ComponentProps\<"div"\>




Any other props are spread to the div element.






### [`<QueueItemAction />`](#queueitemaction-)






### \[...props\]?:


Omit\<React.ComponentProps\<typeof Button\>, "variant" \| "size"\>




Any other props (except variant and size) are spread to the Button component.






### [`<QueueItemAttachment />`](#queueitemattachment-)






### \[...props\]?:


React.ComponentProps\<"div"\>




Any other props are spread to the div element.






### [`<QueueItemImage />`](#queueitemimage-)






### \[...props\]?:


React.ComponentProps\<"img"\>




Any other props are spread to the img element.






### [`<QueueItemFile />`](#queueitemfile-)






### \[...props\]?:


React.ComponentProps\<"span"\>




Any other props are spread to the span element.





















On this page
















































































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.