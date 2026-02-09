AI SDK 5 is available now.










Menu


















































































































































































































































# [Open In Chat](#open-in-chat)

The `OpenIn` component provides a dropdown menu that allows users to open queries in different AI chat platforms with a single click.




Code

Preview













## [Installation](#installation)




ai-elements

shadcn

Manual




``` geist-overflow-scroll-y
npx ai-elements@latest add open-in-chat
```
















## [Usage](#usage)



``` tsx
import  from '@/components/ai-elements/open-in-chat';
```




``` tsx
```


## [Features](#features)

- Pre-configured links to popular AI chat platforms
- Context-based query passing for cleaner API
- Customizable dropdown trigger button
- Automatic URL parameter encoding for queries
- Support for ChatGPT, Claude, T3 Chat, Scira AI, v0, and Cursor
- Branded icons for each platform
- TypeScript support with proper type definitions
- Accessible dropdown menu with keyboard navigation
- External link indicators for clarity

## [Supported Platforms](#supported-platforms)

- **ChatGPT** - Opens query in OpenAI's ChatGPT with search hints
- **Claude** - Opens query in Anthropic's Claude AI
- **T3 Chat** - Opens query in T3 Chat platform
- **Scira AI** - Opens query in Scira's AI assistant
- **v0** - Opens query in Vercel's v0 platform
- **Cursor** - Opens query in Cursor AI editor

## [Props](#props)

### [`<OpenIn />`](#openin-)






### query:


string




The query text to be sent to all AI platforms.





### \[...props\]:


React.ComponentProps\<typeof DropdownMenu\>




Props to spread to the underlying radix-ui DropdownMenu component.






### [`<OpenInTrigger />`](#openintrigger-)






### children?:


React.ReactNode




Custom trigger button. Defaults to "Open in chat" button with chevron icon.





### \[...props\]:


React.ComponentProps\<typeof DropdownMenuTrigger\>




Props to spread to the underlying DropdownMenuTrigger component.






### [`<OpenInContent />`](#openincontent-)






### className?:


string




Additional CSS classes to apply to the dropdown content.





### \[...props\]:


React.ComponentProps\<typeof DropdownMenuContent\>




Props to spread to the underlying DropdownMenuContent component.






### [`<OpenInChatGPT />`, `<OpenInClaude />`, `<OpenInT3 />`, `<OpenInScira />`, `<OpenInv0 />`, `<OpenInCursor />`](#openinchatgpt--openinclaude--openint3--openinscira--openinv0--openincursor-)






### \[...props\]:


React.ComponentProps\<typeof DropdownMenuItem\>




Props to spread to the underlying DropdownMenuItem component. The query is automatically provided via context from the parent OpenIn component.






### [`<OpenInItem />`, `<OpenInLabel />`, `<OpenInSeparator />`](#openinitem--openinlabel--openinseparator-)

Additional composable components for custom dropdown menu items, labels, and separators that follow the same props pattern as their underlying radix-ui counterparts.
















On this page













































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.