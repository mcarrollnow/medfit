AI SDK 5 is available now.










Menu


















































































































































































































































# [Shimmer](#shimmer)

The `Shimmer` component provides an animated shimmer effect that sweeps across text, perfect for indicating loading states, progressive reveals, or drawing attention to dynamic content in AI applications.




Code

Preview







Generating your response...






## [Installation](#installation)




ai-elements

shadcn

Manual




``` geist-overflow-scroll-y
npx ai-elements@latest add shimmer
```
















## [Usage](#usage)



``` tsx
import  from '@/components/ai-elements/shimmer';
```




``` tsx
```


## [Features](#features)

- Smooth animated shimmer effect using CSS gradients and Framer Motion
- Customizable animation duration and spread
- Polymorphic component - render as any HTML element via the `as` prop
- Automatic spread calculation based on text length
- Theme-aware styling using CSS custom properties
- Infinite looping animation with linear easing
- TypeScript support with proper type definitions
- Memoized for optimal performance
- Responsive and accessible design
- Uses `text-transparent` with background-clip for crisp text rendering

## [Examples](#examples)

### [Different Durations](#different-durations)




Code

Preview








Fast (1 second)

Loading quickly...



Default (2 seconds)

Loading at normal speed...



Slow (4 seconds)

Loading slowly...



Very Slow (6 seconds)

Loading very slowly...







### [Custom Elements](#custom-elements)




Code

Preview








As paragraph (default)

This is rendered as a paragraph



As heading

## Large Heading with Shimmer



As span (inline)






As div with custom styling


Custom styled shimmer text








## [Props](#props)

### [`<Shimmer />`](#shimmer-)






### children:


string




The text content to apply the shimmer effect to.





### as?:


ElementType




The HTML element or React component to render. Defaults to "p".





### className?:


string




Additional CSS classes to apply to the component.





### duration?:


number




The duration of the shimmer animation in seconds. Defaults to 2.





### spread?:


number




The spread multiplier for the shimmer gradient, multiplied by text length. Defaults to 2.





















On this page









































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.