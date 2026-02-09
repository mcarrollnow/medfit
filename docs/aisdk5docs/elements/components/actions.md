AI SDK 5 is available now.










Menu


















































































































































































































































# [Actions](#actions)

The `Actions` component provides a flexible row of action buttons for AI responses with common actions like retry, like, dislike, copy, and share.




Code

Preview











Hello, how are you?





I am fine, thank you!

















## [Installation](#installation)




ai-elements

shadcn

Manual




``` geist-overflow-scroll-y
npx ai-elements@latest add actions
```
















## [Usage](#usage)



``` tsx
import  from '@/components/ai-elements/actions';import  from 'lucide-react';
```




``` tsx
```


## [Usage with AI SDK](#usage-with-ai-sdk)

Build a simple chat UI where the user can copy or regenerate the most recent message.

Add the following component to your frontend:












``` tsx
'use client';
import  from 'react';import  from '@/components/ai-elements/actions';import  from '@/components/ai-elements/message';import  from '@/components/ai-elements/conversation';import  from '@/components/ai-elements/prompt-input';import  from '@/components/ai-elements/response';import  from 'lucide-react';import  from '@ai-sdk/react';import  from 'react';
const ActionsDemo = () =>  = useChat();
  const handleSubmit = (e: React.FormEvent) => );      setInput('');    }  };
  return (    <div className="max-w-4xl mx-auto p-6 relative size-full rounded-lg border h-[600px]">      <div className="flex flex-col h-full">        <Conversation>          <ConversationContent>            >                -$`}>                          <Message from=>                            <MessageContent>                              <Response></Response>                            </MessageContent>                          </Message>                                                          label="Retry"                              >                                <RefreshCcwIcon className="size-3" />                              </Action>                              <Action                                onClick=                                label="Copy"                              >                                <CopyIcon className="size-3" />                              </Action>                            </Actions>                          )}                        </Fragment>                      );                    default:                      return null;                  }                })}              </Fragment>            ))}          </ConversationContent>          <ConversationScrollButton />        </Conversation>
        <Input          onSubmit=          className="mt-4 w-full max-w-2xl mx-auto relative"        >          <PromptInputTextarea            value=            placeholder="Say something..."            onChange=            className="pr-12"          />          <PromptInputSubmit            status=            disabled=            className="absolute bottom-1 right-1"          />        </Input>      </div>    </div>  );};
export default ActionsDemo;
```


Add the following route to your backend:












``` tsx
import  from 'ai';
// Allow streaming responses up to 30 secondsexport const maxDuration = 30;
export async function POST(req: Request) :  =    await req.json();
  const result = streamText();
  return result.toUIMessageStreamResponse();}
```


## [Features](#features)

- Row of composable action buttons with consistent styling
- Support for custom actions with tooltips
- State management for toggle actions (like, dislike, favorite)
- Keyboard accessible with proper ARIA labels
- Clipboard and Web Share API integration
- TypeScript support with proper type definitions
- Consistent with design system styling

## [Examples](#examples)




Code

Preview








This is a response from an assistant. Try hovering over this message to see the actions appear!















## [Props](#props)

### [`<Actions />`](#actions-)






### \[...props\]:


React.HTMLAttributes\<HTMLDivElement\>




HTML attributes to spread to the root div.






### [`<Action />`](#action-)






### tooltip?:


string




Optional tooltip text shown on hover.





### label?:


string




Accessible label for screen readers. Also used as fallback if tooltip is not provided.





### \[...props\]:


React.ComponentProps\<typeof Button\>




Any other props are spread to the underlying shadcn/ui Button component.





















On this page







































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.