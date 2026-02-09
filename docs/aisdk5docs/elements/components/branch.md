AI SDK 5 is available now.










Menu


















































































































































































































































# [Branch](#branch)

The `Branch` component manages multiple versions of AI messages, allowing users to navigate between different response branches. It provides a clean, modern interface with customizable themes and keyboard-accessible navigation buttons.




Code

Preview











What are the key strategies for optimizing React performance?








How can I improve the performance of my React application?








What performance optimization techniques should I use in React?










Here's the first response to your question. This approach focuses on performance optimization.








Here's an alternative response. This approach emphasizes code readability and maintainability over pure performance.








And here's a third option. This balanced approach considers both performance and maintainability, making it suitable for most use cases.











## [Installation](#installation)




ai-elements

shadcn

Manual




``` geist-overflow-scroll-y
npx ai-elements@latest add branch
```
















## [Usage](#usage)



``` tsx
import  from '@/components/ai-elements/branch';
```




``` tsx
```


## [Usage with AI SDK](#usage-with-ai-sdk)




Branching is an advanced use case that you can implement yourself to suit your application's needs. While the AI SDK does not provide built-in support for branching, you have full flexibility to design and manage multiple response paths as required.



## [Features](#features)

- Context-based state management for multiple message branches
- Navigation controls for moving between branches (previous/next)
- Uses CSS to prevent re-rendering of branches when switching
- Branch counter showing current position (e.g., "1 of 3")
- Automatic branch tracking and synchronization
- Callbacks for branch change and navigation using `onBranchChange`
- Support for custom branch change callbacks
- Responsive design with mobile-friendly controls
- Clean, modern styling with customizable themes
- Keyboard-accessible navigation buttons

## [Props](#props)

### [`<Branch />`](#branch-)






### defaultBranch?:


number




The index of the branch to show by default (default: 0).





### onBranchChange?:


(branchIndex: number) =\> void




Callback fired when the branch changes.





### \[...props\]:


React.HTMLAttributes\<HTMLDivElement\>




Any other props are spread to the root div.






### [`<BranchMessages />`](#branchmessages-)






### \[...props\]:


React.HTMLAttributes\<HTMLDivElement\>




Any other props are spread to the root div.






### [`<BranchSelector />`](#branchselector-)






### from:


UIMessage\["role"\]




Aligns the selector for user, assistant or system messages.





### \[...props\]:


React.HTMLAttributes\<HTMLDivElement\>




Any other props are spread to the selector container.






### [`<BranchPrevious />`](#branchprevious-)






### \[...props\]:


React.ComponentProps\<typeof Button\>




Any other props are spread to the underlying shadcn/ui Button component.






### [`<BranchNext />`](#branchnext-)






### \[...props\]:


React.ComponentProps\<typeof Button\>




Any other props are spread to the underlying shadcn/ui Button component.






### [`<BranchPage />`](#branchpage-)






### \[...props\]:


React.HTMLAttributes\<HTMLSpanElement\>




Any other props are spread to the underlying span element.





















On this page
















































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.