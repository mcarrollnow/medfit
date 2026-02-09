AI SDK 5 is available now.










Menu


















































































































































































































































# [Plan](#plan)

The `Plan` component provides a flexible system for displaying AI-generated execution plans with collapsible content. Perfect for showing multi-step workflows, task breakdowns, and implementation strategies with support for streaming content and loading states.




Code

Preview












Rewrite AI Elements to SolidJS




Rewrite the AI Elements component library from React to SolidJS while maintaining compatibility with existing React-based shadcn/ui components using solid-js/compat, updating all 29 components and their test suite.















## [Installation](#installation)




ai-elements

shadcn

Manual




``` geist-overflow-scroll-y
npx ai-elements@latest add plan
```
















## [Usage](#usage)



``` tsx
import  from '@/components/ai-elements/plan';
```




``` tsx
```


## [Features](#features)

- Collapsible content with smooth animations
- Streaming support with shimmer loading states
- Built on shadcn/ui Card and Collapsible components
- TypeScript support with comprehensive type definitions
- Customizable styling with Tailwind CSS
- Responsive design with mobile-friendly interactions
- Keyboard navigation and accessibility support
- Theme-aware with automatic dark mode support
- Context-based state management for streaming

## [Props](#props)

### [`<Plan />`](#plan-)






### isStreaming?:


boolean




Whether content is currently streaming. Enables shimmer animations on title and description. Defaults to false.





### defaultOpen?:


boolean




Whether the plan is expanded by default.





### \[...props\]?:


React.ComponentProps\<typeof Collapsible\>




Any other props are spread to the Collapsible component.






### [`<PlanHeader />`](#planheader-)






### \[...props\]?:


React.ComponentProps\<typeof CardHeader\>




Any other props are spread to the CardHeader component.






### [`<PlanTitle />`](#plantitle-)






### children:


string




The title text. Displays with shimmer animation when isStreaming is true.





### \[...props\]?:


Omit\<React.ComponentProps\<typeof CardTitle\>, "children"\>




Any other props (except children) are spread to the CardTitle component.






### [`<PlanDescription />`](#plandescription-)






### children:


string




The description text. Displays with shimmer animation when isStreaming is true.





### \[...props\]?:


Omit\<React.ComponentProps\<typeof CardDescription\>, "children"\>




Any other props (except children) are spread to the CardDescription component.






### [`<PlanTrigger />`](#plantrigger-)






### \[...props\]?:


React.ComponentProps\<typeof CollapsibleTrigger\>




Any other props are spread to the CollapsibleTrigger component. Renders as a Button with chevron icon.






### [`<PlanContent />`](#plancontent-)






### \[...props\]?:


React.ComponentProps\<typeof CardContent\>




Any other props are spread to the CardContent component.






### [`<PlanFooter />`](#planfooter-)






### \[...props\]?:


React.ComponentProps\<"div"\>




Any other props are spread to the div element.






### [`<PlanAction />`](#planaction-)






### \[...props\]?:


React.ComponentProps\<typeof CardAction\>




Any other props are spread to the CardAction component.





















On this page



















































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.