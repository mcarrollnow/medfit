AI SDK 5 is available now.










Menu


















































































































































































































































# [Sources](#sources)

The `Sources` component allows a user to view the sources or citations used to generate a response.




Code

Preview








Used 3 sources










## [Installation](#installation)




ai-elements

shadcn

Manual




``` geist-overflow-scroll-y
npx ai-elements@latest add sources
```
















## [Usage](#usage)



``` tsx
import  from '@/components/ai-elements/sources';
```




``` tsx
```


## [Usage with AI SDK](#usage-with-ai-sdk)

Build a simple web search agent with Perplexity Sonar.

Add the following component to your frontend:












``` tsx
'use client';
import  from '@ai-sdk/react';import  from '@/components/ai-elements/sources';import  from '@/components/ai-elements/prompt-input';import  from '@/components/ai-elements/conversation';import  from '@/components/ai-elements/message';import  from '@/components/ai-elements/response';import  from 'react';import  from 'ai';
const SourceDemo = () =>  = useChat(),  });
  const handleSubmit = (e: React.FormEvent) => );      setInput('');    }  };
  return (    <div className="max-w-4xl mx-auto p-6 relative size-full rounded-lg border h-[600px]">      <div className="flex flex-col h-full">        <div className="flex-1 overflow-auto mb-4">          <Conversation>            <ConversationContent>              >                                        />                      -$`}>                                <Source                                  key=-$`}                                  href=                                  title=                                />                              </SourcesContent>                            );                        }                      })}                    </Sources>                  )}                  <Message from= key=>                    <MessageContent>                      -$`}>                                                              </Response>                            );                          default:                            return null;                        }                      })}                    </MessageContent>                  </Message>                </div>              ))}            </ConversationContent>            <ConversationScrollButton />          </Conversation>        </div>
        <Input          onSubmit=          className="mt-4 w-full max-w-2xl mx-auto relative"        >          <PromptInputTextarea            value=            placeholder="Ask a question and search the..."            onChange=            className="pr-12"          />          <PromptInputSubmit            status=            disabled=            className="absolute bottom-1 right-1"          />        </Input>      </div>    </div>  );};
export default SourceDemo;
```


Add the following route to your backend:












``` tsx
import  from 'ai';import  from '@ai-sdk/perplexity';
// Allow streaming responses up to 30 secondsexport const maxDuration = 30;
export async function POST(req: Request) :  = await req.json();
  const result = streamText();
  return result.toUIMessageStreamResponse();}
```


## [Features](#features)

- Collapsible component that allows a user to view the sources or citations used to generate a response
- Customizable trigger and content components
- Support for custom sources or citations
- Responsive design with mobile-friendly controls
- Clean, modern styling with customizable themes

## [Examples](#examples)

### [Custom rendering](#custom-rendering)




Code

Preview








Using 3 citations










## [Props](#props)

### [`<Sources />`](#sources-)






### \[...props\]?:


React.HTMLAttributes\<HTMLDivElement\>




Any other props are spread to the root div.






### [`<SourcesTrigger />`](#sourcestrigger-)






### count?:


number




The number of sources to display in the trigger.





### \[...props\]?:


React.ButtonHTMLAttributes\<HTMLButtonElement\>




Any other props are spread to the trigger button.






### [`<SourcesContent />`](#sourcescontent-)






### \[...props\]?:


React.HTMLAttributes\<HTMLDivElement\>




Any other props are spread to the content container.






### [`<Source />`](#source-)






### \[...props\]?:


React.AnchorHTMLAttributes\<HTMLAnchorElement\>




Any other props are spread to the anchor element.





















On this page


















































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.