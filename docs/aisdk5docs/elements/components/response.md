AI SDK 5 is available now.










Menu


















































































































































































































































# [Response](#response)





Code

Preview












## [Installation](#installation)




ai-elements

shadcn

Manual




``` geist-overflow-scroll-y
npx ai-elements@latest add response
```



















**Important:** After adding the component, you'll need to add the following to your `globals.css` file:



``` css
@source "../node_modules/streamdown/dist/index.js";
```





## [Usage](#usage)



``` tsx
import  from '@/components/ai-elements/response';
```




``` tsx
```


## [Usage with AI SDK](#usage-with-ai-sdk)

Populate a markdown response with messages from [`useChat`](../../docs/reference/ai-sdk-ui/use-chat.html).

Add the following component to your frontend:












``` tsx
'use client';
import  from '@/components/ai-elements/conversation';import  from '@/components/ai-elements/message';import  from '@ai-sdk/react';import  from '@/components/ai-elements/response';
const ResponseDemo = () =>  = useChat();
  return (    <div className="max-w-4xl mx-auto p-6 relative size-full rounded-lg border h-[600px]">      <div className="flex flex-col h-full">        <Conversation>          <ConversationContent>             key=>                <MessageContent>                  -$`}>                                                      </Response>                        );                      default:                        return null;                    }                  })}                </MessageContent>              </Message>            ))}          </ConversationContent>          <ConversationScrollButton />        </Conversation>      </div>    </div>  );};
export default ResponseDemo;
```


## [Features](#features)

- Renders markdown content with support for paragraphs, links, and code blocks
- Supports GFM features like tables, task lists, and strikethrough text via remark-gfm
- Supports rendering Math Equations via rehype-katex
- **Smart streaming support** - automatically completes incomplete formatting during real-time text streaming
- Code blocks are rendered with syntax highlighting for various programming languages
- Code blocks include a button to easily copy code to clipboard
- Adapts to different screen sizes while maintaining readability
- Seamlessly integrates with both light and dark themes
- Customizable appearance through className props and Tailwind CSS utilities
- Built with accessibility in mind for all users

## [Props](#props)

### [`<Response />`](#response-)






### children:


string




The markdown content to render.





### parseIncompleteMarkdown?:


boolean




Whether to parse and fix incomplete markdown syntax (e.g., unclosed code blocks or lists).





### className?:


string




CSS class names to apply to the wrapper div element.





### components?:


object




Custom React components to use for rendering markdown elements (e.g., custom heading, paragraph, code block components).





### allowedImagePrefixes?:


string\[\]




Array of allowed URL prefixes for images. Use \["\*"\] to allow all images.





### allowedLinkPrefixes?:


string\[\]




Array of allowed URL prefixes for links. Use \["\*"\] to allow all links.





### defaultOrigin?:


string




Default origin to use for relative URLs in links and images.





### rehypePlugins?:


array




Array of rehype plugins to use for processing HTML. Includes KaTeX for math rendering by default.





### remarkPlugins?:


array




Array of remark plugins to use for processing markdown. Includes GitHub Flavored Markdown and math support by default.





### \[...props\]?:


React.HTMLAttributes\<HTMLDivElement\>




Any other props are spread to the root div.





















On this page

































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.