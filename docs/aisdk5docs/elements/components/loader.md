AI SDK 5 is available now.










Menu


















































































































































































































































# [Loader](#loader)

The `Loader` component provides a spinning animation to indicate loading states in your AI applications. It includes both a customizable wrapper component and the underlying icon for flexible usage.




Code

Preview














## [Installation](#installation)




ai-elements

shadcn

Manual




``` geist-overflow-scroll-y
npx ai-elements@latest add loader
```
















## [Usage](#usage)



``` tsx
import  from '@/components/ai-elements/loader';
```




``` tsx
```


## [Usage with AI SDK](#usage-with-ai-sdk)

Build a simple chat app that displays a loader before it the response streans by using `status === "submitted"`.

Add the following component to your frontend:












``` tsx
'use client';
import  from '@/components/ai-elements/conversation';import  from '@/components/ai-elements/message';import  from '@/components/ai-elements/prompt-input';import  from '@/components/ai-elements/loader';import  from 'react';import  from '@ai-sdk/react';
const LoaderDemo = () =>  = useChat();
  const handleSubmit = (e: React.FormEvent) => );      setInput('');    }  };
  return (    <div className="max-w-4xl mx-auto p-6 relative size-full rounded-lg border h-[600px]">      <div className="flex flex-col h-full">        <Conversation>          <ConversationContent>             key=>                <MessageContent>                  -$`}></div>                        );                      default:                        return null;                    }                  })}                </MessageContent>              </Message>            ))}                      </ConversationContent>          <ConversationScrollButton />        </Conversation>
        <Input          onSubmit=          className="mt-4 w-full max-w-2xl mx-auto relative"        >          <PromptInputTextarea            value=            placeholder="Say something..."            onChange=            className="pr-12"          />          <PromptInputSubmit            status=            disabled=            className="absolute bottom-1 right-1"          />        </Input>      </div>    </div>  );};
export default LoaderDemo;
```


Add the following route to your backend:












``` ts
import  from 'ai';
// Allow streaming responses up to 30 secondsexport const maxDuration = 30;
export async function POST(req: Request) :  =    await req.json();
  const result = streamText();
  return result.toUIMessageStreamResponse();}
```


## [Features](#features)

- Clean, modern spinning animation using CSS animations
- Configurable size with the `size` prop
- Customizable styling with CSS classes
- Built-in `animate-spin` animation with proper centering
- Exports both `AILoader` wrapper and `LoaderIcon` for flexible usage
- Supports all standard HTML div attributes
- TypeScript support with proper type definitions
- Optimized SVG icon with multiple opacity levels for smooth animation
- Uses `currentColor` for proper theme integration
- Responsive and accessible design

## [Examples](#examples)

### [Different Sizes](#different-sizes)




Code

Preview








Small (16px)





Medium (24px)





Large (32px)





Extra Large (48px)









### [Custom Styling](#custom-styling)




Code

Preview








Blue





Green





Purple





Orange





Slow Animation





Fast Animation





With Background







Dark Background











## [Props](#props)

### [`<Loader />`](#loader-)






### size?:


number




The size (width and height) of the loader in pixels. Defaults to 16.





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