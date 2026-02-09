AI SDK 5 is available now.










Menu


















































































































































































































































# [Chatbot](#chatbot)

An example of how to use the AI Elements to build a chatbot.




Code

Preview
















Can you explain how to use React hooks effectively?













Used 2 sources







# React Hooks Best Practices

React hooks are a powerful feature that let you use state and other React features without writing classes. Here are some tips for using them effectively:

## Rules of Hooks


## Common Hooks


## Example of useState and useEffect


















Would you like me to explain any specific hook in more detail?














Yes, could you explain useCallback and useMemo in more detail? When should I use one over the other?












I'm particularly interested in understanding the performance implications of useCallback and useMemo. Could you break down when each is most appropriate?












Thanks for the overview! Could you dive deeper into the specific use cases where useCallback and useMemo make the biggest difference in React applications?














Thought for 10 seconds




The user is asking for a detailed explanation of useCallback and useMemo. I should provide a clear and concise explanation of each hook's purpose and how they differ.

The useCallback hook is used to memoize functions to prevent unnecessary re-renders of child components that receive functions as props.

The useMemo hook is used to memoize values to avoid expensive recalculations on every render.

Both hooks help with performance optimization, but they serve different purposes.






## useCallback vs useMemo

Both hooks help with performance optimization, but they serve different purposes:

### useCallback



















### useMemo



















### When to use which?


  - Passing callbacks to optimized child components that rely on reference equality
  - Working with event handlers that you pass to child components


  - You have computationally expensive calculations
  - You want to avoid recreating objects that are used as dependencies for other hooks

### Performance Note

Don't overuse these hooks! They come with their own overhead. Only use them when you have identified a genuine performance issue.
















What are the latest trends in AI?

How does machine learning work?

Explain quantum computing

Best practices for React development

Tell me about TypeScript benefits

How to optimize database queries?

What is the difference between SQL and NoSQL?

Explain cloud computing basics



























## [Tutorial](#tutorial)

Let's walk through how to build a chatbot using AI Elements and AI SDK. Our example will include reasoning, web search with citations, and a model picker.

### [Setup](#setup)

First, set up a new Next.js repo and cd into it by running the following command (make sure you choose to use Tailwind the project setup):













``` bash
npx create-next-app@latest ai-chatbot && cd ai-chatbot
```


Run the following command to install AI Elements. This will also set up shadcn/ui if you haven't already configured it:













``` bash
npx ai-elements@latest
```


Now, install the AI SDK dependencies:







pnpm







npm







yarn








``` geist-overflow-scroll-y
pnpm add ai @ai-sdk/react zod
```














We're now ready to start building our app!

### [Client](#client)

In your `app/page.tsx`, replace the code with the file below.

Here, we use the `PromptInput` component with its compound components to build a rich input experience with file attachments, model picker, and action menu. The input component uses the new `PromptInputMessage` type for handling both text and file attachments.

The whole chat lives in a `Conversation`. We switch on `message.parts` and render the respective part within `Message`, `Reasoning`, and `Sources`. We also use `status` from `useChat` to stream reasoning tokens, as well as render `Loader`.



``` tsx
'use client';
import  from '@/components/ai-elements/conversation';import  from '@/components/ai-elements/message';import  from '@/components/ai-elements/prompt-input';import  from '@/components/ai-elements/actions';import  from 'react';import  from '@ai-sdk/react';import  from '@/components/ai-elements/response';import  from 'lucide-react';import  from '@/components/ai-elements/sources';import  from '@/components/ai-elements/reasoning';import  from '@/components/ai-elements/loader';
const models = [  ,  ,];
const ChatBotDemo = () =>  = useChat();
  const handleSubmit = (message: PromptInputMessage) => 
    sendMessage(      ,      ,      },    );    setInput('');  };
  return (    <div className="max-w-4xl mx-auto p-6 relative size-full h-screen">      <div className="flex flex-col h-full">        <Conversation className="h-full">          <ConversationContent>            >                                    />                    -$`}>                        <Source                          key=-$`}                          href=                          title=                        />                      </SourcesContent>                    ))}                  </Sources>                )}                -$`}>                          <Message from=>                            <MessageContent>                              <Response>                                                              </Response>                            </MessageContent>                          </Message>                                                          label="Retry"                              >                                <RefreshCcwIcon className="size-3" />                              </Action>                              <Action                                onClick=                                label="Copy"                              >                                <CopyIcon className="size-3" />                              </Action>                            </Actions>                          )}                        </Fragment>                      );                    case 'reasoning':                      return (                        <Reasoning                          key=-$`}                          className="w-full"                          isStreaming=                        >                          <ReasoningTrigger />                          <ReasoningContent></ReasoningContent>                        </Reasoning>                      );                    default:                      return null;                  }                })}              </div>            ))}                      </ConversationContent>          <ConversationScrollButton />        </Conversation>
        <PromptInput onSubmit= className="mt-4" globalDrop multiple>          <PromptInputBody>            <PromptInputAttachments>               />}            </PromptInputAttachments>            <PromptInputTextarea              onChange=              value=            />          </PromptInputBody>          <PromptInputFooter>            <PromptInputTools>              <PromptInputActionMenu>                <PromptInputActionMenuTrigger />                <PromptInputActionMenuContent>                  <PromptInputActionAddAttachments />                </PromptInputActionMenuContent>              </PromptInputActionMenu>              <PromptInputButton                variant=                onClick=              >                <GlobeIcon size= />                <span>Search</span>              </PromptInputButton>              <PromptInputModelSelect                onValueChange=}                value=              >                <PromptInputModelSelectTrigger>                  <PromptInputModelSelectValue />                </PromptInputModelSelectTrigger>                <PromptInputModelSelectContent>                   value=>                                          </PromptInputModelSelectItem>                  ))}                </PromptInputModelSelectContent>              </PromptInputModelSelect>            </PromptInputTools>            <PromptInputSubmit disabled= status= />          </PromptInputFooter>        </PromptInput>      </div>    </div>  );};
export default ChatBotDemo;
```


### [Server](#server)

Create a new route handler `app/api/chat/route.ts` and paste in the following code. We're using `perplexity/sonar` for web search because by default the model returns search results. We also pass `sendSources` and `sendReasoning` to `toUIMessageStreamResponse` in order to receive as parts on the frontend. The handler now also accepts file attachments from the client.












``` ts
import  from 'ai';
// Allow streaming responses up to 30 secondsexport const maxDuration = 30;
export async function POST(req: Request) :  = await req.json();
  const result = streamText();
  // send sources and reasoning back to the client  return result.toUIMessageStreamResponse();}
```


You now have a working chatbot app with file attachment support! The chatbot can handle both text and file inputs through the action menu. Feel free to explore other components like [`Tool`](../components/tool.html) or [`Task`](../components/task.html) to extend your app, or view the other examples.
















On this page



























Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.