AI SDK 5 is available now.










Menu


















































































































































































































































# [Reasoning](#reasoning)

The `Reasoning` component displays AI reasoning content, automatically opening during streaming and closing when finished.




Code

Preview









Thinking...












## [Installation](#installation)




ai-elements

shadcn

Manual




``` geist-overflow-scroll-y
npx ai-elements@latest add reasoning
```
















## [Usage](#usage)



``` tsx
import  from '@/components/ai-elements/reasoning';
```




``` tsx
```


## [Usage with AI SDK](#usage-with-ai-sdk)

Build a chatbot with reasoning using Deepseek R1.

Add the following component to your frontend:












``` tsx
'use client';
import  from '@/components/ai-elements/reasoning';import  from '@/components/ai-elements/conversation';import  from '@/components/ai-elements/prompt-input';import  from '@/components/ai-elements/loader';import  from '@/components/ai-elements/message';import  from 'react';import  from '@ai-sdk/react';import  from @/components/ai-elements/response';
const ReasoningDemo = () =>  = useChat();
  const handleSubmit = (e: React.FormEvent) => );    setInput('');  };
  return (    <div className="max-w-4xl mx-auto p-6 relative size-full rounded-lg border h-[600px]">      <div className="flex flex-col h-full">        <Conversation>          <ConversationContent>             key=>                <MessageContent>                  -$`}>                                                      </Response>                        );                      case 'reasoning':                        return (                          <Reasoning                            key=-$`}                            className="w-full"                            isStreaming=                          >                            <ReasoningTrigger />                            <ReasoningContent></ReasoningContent>                          </Reasoning>                        );                    }                  })}                </MessageContent>              </Message>            ))}                      </ConversationContent>          <ConversationScrollButton />        </Conversation>
        <PromptInput          onSubmit=          className="mt-4 w-full max-w-2xl mx-auto relative"        >          <PromptInputTextarea            value=            placeholder="Say something..."            onChange=            className="pr-12"          />          <PromptInputSubmit            status=            disabled=            className="absolute bottom-1 right-1"          />        </PromptInput>      </div>    </div>  );};
export default ReasoningDemo;
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

- Automatically opens when streaming content and closes when finished
- Manual toggle control for user interaction
- Smooth animations and transitions powered by Radix UI
- Visual streaming indicator with pulsing animation
- Composable architecture with separate trigger and content components
- Built with accessibility in mind including keyboard navigation
- Responsive design that works across different screen sizes
- Seamlessly integrates with both light and dark themes
- Built on top of shadcn/ui Collapsible primitives
- TypeScript support with proper type definitions

## [Props](#props)

### [`<Reasoning />`](#reasoning-)






### isStreaming?:


boolean




Whether the reasoning is currently streaming (auto-opens and closes the panel).





### \[...props\]?:


React.ComponentProps\<typeof Collapsible\>




Any other props are spread to the underlying Collapsible component.






### [`<ReasoningTrigger />`](#reasoningtrigger-)






### title?:


string




Optional title to display in the trigger (default: "Reasoning").





### \[...props\]?:


React.ComponentProps\<typeof CollapsibleTrigger\>




Any other props are spread to the underlying CollapsibleTrigger component.






### [`<ReasoningContent />`](#reasoningcontent-)






### \[...props\]?:


React.ComponentProps\<typeof CollapsibleContent\>




Any other props are spread to the underlying CollapsibleContent component.





















On this page







































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.