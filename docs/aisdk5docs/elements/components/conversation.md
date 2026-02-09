AI SDK 5 is available now.










Menu


















































































































































































































































# [Conversation](#conversation)

The `Conversation` component wraps messages and automatically scrolls to the bottom. Also includes a scroll button that appears when not at the bottom.




Code

Preview














### Start a conversation

Messages will appear here as the conversation progresses.










## [Installation](#installation)




ai-elements

shadcn

Manual




``` geist-overflow-scroll-y
npx ai-elements@latest add conversation
```
















## [Usage](#usage)



``` tsx
import  from '@/components/ai-elements/conversation';
```




``` tsx
```


## [Usage with AI SDK](#usage-with-ai-sdk)

Build a simple conversational UI with `Conversation` and [`PromptInput`](prompt-input.html):

Add the following component to your frontend:












``` tsx
'use client';
import  from '@/components/ai-elements/conversation';import  from '@/components/ai-elements/message';import  from '@/components/ai-elements/prompt-input';import  from 'lucide-react';import  from 'react';import  from '@ai-sdk/react';import  from '@/components/ai-elements/response';
const ConversationDemo = () =>  = useChat();
  const handleSubmit = (e: React.FormEvent) => );      setInput('');    }  };
  return (    <div className="max-w-4xl mx-auto p-6 relative size-full rounded-lg border h-[600px]">      <div className="flex flex-col h-full">        <Conversation>          <ConversationContent>                            title="Start a conversation"                description="Type a message below to begin chatting"              />            ) : (              messages.map((message) => (                <Message from= key=>                  <MessageContent>                    -$`}>                                                          </Response>                          );                        default:                          return null;                      }                    })}                  </MessageContent>                </Message>              ))            )}          </ConversationContent>          <ConversationScrollButton />        </Conversation>
        <Input          onSubmit=          className="mt-4 w-full max-w-2xl mx-auto relative"        >          <PromptInputTextarea            value=            placeholder="Say something..."            onChange=            className="pr-12"          />          <PromptInputSubmit            status=            disabled=            className="absolute bottom-1 right-1"          />        </Input>      </div>    </div>  );};
export default ConversationDemo;
```


Add the following route to your backend:












``` tsx
import  from 'ai';
// Allow streaming responses up to 30 secondsexport const maxDuration = 30;
export async function POST(req: Request) :  = await req.json();
  const result = streamText();
  return result.toUIMessageStreamResponse();}
```


## [Features](#features)

- Automatic scrolling to the bottom when new messages are added
- Smooth scrolling behavior with configurable animation
- Scroll button that appears when not at the bottom
- Responsive design with customizable padding and spacing
- Flexible content layout with consistent message spacing
- Accessible with proper ARIA roles for screen readers
- Customizable styling through className prop
- Support for any number of child message components

## [Props](#props)

### [`<Conversation />`](#conversation-)






### contextRef:


React.Ref\<StickToBottomContext\>




Optional ref to access the StickToBottom context object.





### instance:


StickToBottomInstance




Optional instance for controlling the StickToBottom component.





### children:


((context: StickToBottomContext) =\> ReactNode) \| ReactNode




Render prop or ReactNode for custom rendering with context.





### \[...props\]:


Omit\<React.HTMLAttributes\<HTMLDivElement\>, "children"\>




Any other props are spread to the root div.






### [`<ConversationContent />`](#conversationcontent-)






### children:


((context: StickToBottomContext) =\> ReactNode) \| ReactNode




Render prop or ReactNode for custom rendering with context.





### \[...props\]:


Omit\<React.HTMLAttributes\<HTMLDivElement\>, "children"\>




Any other props are spread to the root div.






### [`<ConversationEmptyState />`](#conversationemptystate-)






### title:


string




The title text to display. Defaults to "No messages yet".





### description:


string




The description text to display. Defaults to "Start a conversation to see messages here".





### icon:


React.ReactNode




Optional icon to display above the text.





### children:


React.ReactNode




Optional additional content to render below the text.





### \[...props\]:


ComponentProps\<"div"\>




Any other props are spread to the root div.






### [`<ConversationScrollButton />`](#conversationscrollbutton-)






### \[...props\]:


ComponentProps\<typeof Button\>




Any other props are spread to the underlying shadcn/ui Button component.





















On this page










































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.