AI SDK 5 is available now.










Menu










































































































































































































































































































































































































# [Migrating from RSC to UI](#migrating-from-rsc-to-ui)

This guide helps you migrate from AI SDK RSC to AI SDK UI.

## [Background](#background)

The AI SDK has two packages that help you build the frontend for your applications – [AI SDK UI](../ai-sdk-ui.html) and [AI SDK RSC](../ai-sdk-rsc.html).


However, given we're pushing the boundaries of this technology, AI SDK RSC currently faces significant limitations that make it unsuitable for stable production use.

- Using `createStreamableUI` can lead to quadratic data transfer. You can avoid this using createStreamableValue instead, and rendering the component client-side.

Due to these limitations, AI SDK RSC is marked as experimental, and we do not recommend using it for stable production environments.

As a result, we strongly recommend migrating to AI SDK UI, which has undergone extensive development to provide a more stable and production grade experience.


## [Streaming Chat Completions](#streaming-chat-completions)

### [Basic Setup](#basic-setup)

The `streamUI` function executes as part of a server action as illustrated below.

#### [Before: Handle generation and rendering in a single server action](#before-handle-generation-and-rendering-in-a-single-server-action)












``` tsx
import  from '@ai-sdk/openai';import  from '@ai-sdk/rsc';
export async function sendMessage(message: string) ]);
  const  = await streamUI() ,    tools: ,  });
  return stream;}
```


#### [Before: Call server action and update UI state](#before-call-server-action-and-update-ui-state)

The chat interface calls the server action. The response is then saved using the `useUIState` hook.












``` tsx
'use client';
import  from 'react';import  from '@ai-sdk/rsc';
export default function Page()  = useActions();  const [input, setInput] = useState('');  const [messages, setMessages] = useUIState();
  return (    <div>      
      <form        onSubmit=}      >        <input type="text" />        <button type="submit">Submit</button>      </form>    </div>  );}
```


The `streamUI` function combines generating text and rendering the user interface. To migrate to AI SDK UI, you need to **separate these concerns** – streaming generations with `streamText` and rendering the UI with `useChat`.

#### [After: Replace server action with route handler](#after-replace-server-action-with-route-handler)

The `streamText` function executes as part of a route handler and streams the response to the client. The `useChat` hook on the client decodes this stream and renders the response within the chat interface.












``` ts
import  from 'ai';import  from '@ai-sdk/openai';
export async function POST(request)  = await request.json();
  const result = streamText(,  });
  return result.toUIMessageStreamResponse();}
```


#### [After: Update client to use chat hook](#after-update-client-to-use-chat-hook)












``` tsx
'use client';
import  from '@ai-sdk/react';
export default function Page()  = useChat();
  return (    <div>      >          <div></div>          <div></div>        </div>      ))}
      <form onSubmit=>        <input          type="text"          value=          onChange=}        />        <button type="submit">Send</button>      </form>    </div>  );}
```


### [Parallel Tool Calls](#parallel-tool-calls)

In AI SDK RSC, `streamUI` does not support parallel tool calls. You will have to use a combination of `streamText`, `createStreamableUI` and `createStreamableValue`.

With AI SDK UI, `useChat` comes with built-in support for parallel tool calls. You can define multiple tools in the `streamText` and have them called them in parallel. The `useChat` hook will then handle the parallel tool calls for you automatically.

### [Multi-Step Tool Calls](#multi-step-tool-calls)

In AI SDK RSC, `streamUI` does not support multi-step tool calls. You will have to use a combination of `streamText`, `createStreamableUI` and `createStreamableValue`.

With AI SDK UI, `useChat` comes with built-in support for multi-step tool calls. You can set `maxSteps` in the `streamText` function to define the number of steps the language model can make in a single call. The `useChat` hook will then handle the multi-step tool calls for you automatically.

### [Generative User Interfaces](#generative-user-interfaces)

The `streamUI` function uses `tools` as a way to execute functions based on user input and renders React components based on the function output to go beyond text in the chat interface.

#### [Before: Render components within the server action and stream to client](#before-render-components-within-the-server-action-and-stream-to-client)












``` tsx
import  from 'zod';import  from '@ai-sdk/rsc';import  from '@ai-sdk/openai';import  from '@/utils/queries';import  from '@/components/weather';
const  = await streamUI() ,  tools: ),      generate: async function* ()  = await getWeather();
        return <Weather value= unit= />;      },    },  },});
```


As mentioned earlier, `streamUI` generates text and renders the React component in a single server action call.


The `streamText` function streams the props data as response to the client, while `useChat` decode the stream as `toolInvocations` and renders the chat interface.












``` ts
import  from 'zod';import  from '@ai-sdk/openai';import  from '@/utils/queries';import  from 'ai';
export async function POST(request)  = await request.json();
  const result = streamText(),        execute: async function () );          return props;        },      },    },  });
  return result.toUIMessageStreamResponse();}
```


#### [After: Update client to use chat hook and render components using tool invocations](#after-update-client-to-use-chat-hook-and-render-components-using-tool-invocations)












``` tsx
'use client';
import  from '@ai-sdk/react';import  from '@/components/weather';
export default function Page()  = useChat();
  return (    <div>      >          <div></div>          <div></div>
          <div>             = toolInvocation;
              if (state === 'result')  = toolInvocation;
                return (                  <div key=>                     />                    ) : null}                  </div>                );              } else >                                      </div>                );              }            })}          </div>        </div>      ))}
      <form onSubmit=>        <input          type="text"          value=          onChange=}        />        <button type="submit">Send</button>      </form>    </div>  );}
```


### [Handling Client Interactions](#handling-client-interactions)

With AI SDK RSC, components streamed to the client can trigger subsequent generations by calling the relevant server action using the `useActions` hooks. This is possible as long as the component is a descendant of the `<AI/>` context provider.

#### [Before: Use actions hook to send messages](#before-use-actions-hook-to-send-messages)












``` tsx
'use client';
import  from '@ai-sdk/rsc';
export function ListFlights()  = useActions();  const [_, setMessages] = useUIState();
  return (    <div>                onClick=!`,            );
            setMessages(msgs => [...msgs, response]);          }}        >                  </div>      ))}    </div>  );}
```


#### [After: Use another chat hook with same ID from the component](#after-use-another-chat-hook-with-same-id-from-the-component)

After switching to AI SDK UI, these messages are synced by initializing the `useChat` hook in the component with the same `id` as the parent component.












``` tsx
'use client';
import  from '@ai-sdk/react';
export function ListFlights()  = useChat(,    maxSteps: 5,  });
  return (    <div>                onClick=!`,            });          }}        >                  </div>      ))}    </div>  );}
```


### [Loading Indicators](#loading-indicators)

In AI SDK RSC, you can use the `initial` parameter of `streamUI` to define the component to display while the generation is in progress.

#### [Before: Use `loading` to show loading indicator](#before-use-loading-to-show-loading-indicator)












``` tsx
import  from '@ai-sdk/openai';import  from '@ai-sdk/rsc';
const  = await streamUI() ,  tools: ,});
return stream;
```


With AI SDK UI, you can use the tool invocation state to show a loading indicator while the tool is executing.

#### [After: Use tool invocation state to show loading indicator](#after-use-tool-invocation-state-to-show-loading-indicator)












``` tsx
'use client';
export function Message() </div>      <div></div>
       = toolInvocation;
            if (state === 'result')  = toolInvocation;
              return (                <div key=>                   />                  ) : null}                </div>              );            } else >                   />                  ) : (                    <div>Loading...</div>                  )}                </div>              );            }          })}        </div>      )}    </div>  );}
```


### [Saving Chats](#saving-chats)

Before implementing `streamUI` as a server action, you should create an `<AI/>` provider and wrap your application at the root layout to sync the AI and UI states. During initialization, you typically use the `onSetAIState` callback function to track updates to the AI state and save it to the database when `done(...)` is called.

#### [Before: Save chats using callback function of context provider](#before-save-chats-using-callback-function-of-context-provider)












``` ts
import  from '@ai-sdk/rsc';import  from '@/utils/queries';
export const AI = createAI(,  initialUIState: ,  actions: ,  onSetAIState: async () =>   },});
```


#### [After: Save chats using callback function of `streamText`](#after-save-chats-using-callback-function-of-streamtext)

With AI SDK UI, you will save chats using the `onFinish` callback function of `streamText` in your route handler.












``` ts
import  from '@ai-sdk/openai';import  from '@/utils/queries';import  from 'ai';
export async function POST(request)  = await request.json();
  const coreMessages = convertToModelMessages(messages);
  const result = streamText() => );      } catch (error)     },  });
  return result.toUIMessageStreamResponse();}
```


### [Restoring Chats](#restoring-chats)

When using AI SDK RSC, the `useUIState` hook contains the UI state of the chat. When restoring a previously saved chat, the UI state needs to be loaded with messages.

Similar to how you typically save chats in AI SDK RSC, you should use the `onGetUIState` callback function to retrieve the chat from the database, convert it into UI state, and return it to be accessible through `useUIState`.

#### [Before: Load chat from database using callback function of context provider](#before-load-chat-from-database-using-callback-function-of-context-provider)












``` ts
import  from '@ai-sdk/rsc';import  from '@/utils/queries';
export const AI = createAI(,  onGetUIState: async () => ,});
```


AI SDK UI uses the `messages` field of `useChat` to store messages. To load messages when `useChat` is mounted, you should use `initialMessages`.

As messages are typically loaded from the database, we can use a server actions inside a Page component to fetch an older chat from the database during static generation and pass the messages as props to the `<Chat/>` component.

#### [After: Load chat from database during static generation of page](#after-load-chat-from-database-during-static-generation-of-page)












``` tsx
import  from '@/app/components/chat';import  from '@/utils/queries';
// link to example implementation: https://github.com/vercel/ai-chatbot/blob/00b125378c998d19ef60b73fe576df0fe5a0e9d4/lib/utils.ts#L87-L127import  from '@/utils/functions';
export default async function Page(: )  = params;  const chatFromDb = await getChatById();
  const chat: Chat = ;
  return <Chat key= id= initialMessages= />;}
```


#### [After: Pass chat messages as props and load into chat hook](#after-pass-chat-messages-as-props-and-load-into-chat-hook)












``` tsx
'use client';
import  from 'ai';import  from '@ai-sdk/react';
export function Chat(: )  = useChat();
  return (    <div>      >          <div></div>          <div></div>        </div>      ))}    </div>  );}
```


## [Streaming Object Generation](#streaming-object-generation)

The `createStreamableValue` function streams any serializable data from the server to the client. As a result, this function allows you to stream object generations from the server to the client when paired with `streamObject`.

#### [Before: Use streamable value to stream object generations](#before-use-streamable-value-to-stream-object-generations)












``` ts
import  from 'ai';import  from '@ai-sdk/openai';import  from '@ai-sdk/rsc';import  from '@/utils/schemas';
export async function generateSampleNotifications()  = streamObject();
    for await (const partialObject of partialObjectStream)   })();
  stream.done();
  return ;}
```


#### [Before: Read streamable value and update object](#before-read-streamable-value-and-update-object)












``` tsx
'use client';
import  from 'react';import  from '@ai-sdk/rsc';import  from '@/app/actions';
export default function Page()  =            await generateSampleNotifications();
          for await (const partialNotifications of readStreamableValue(            partialNotificationsStream,          ))           }        }}      >        Generate      </button>    </div>  );}
```


To migrate to AI SDK UI, you should use the `useObject` hook and implement `streamObject` within your route handler.

#### [After: Replace with route handler and stream text response](#after-replace-with-route-handler-and-stream-text-response)












``` ts
import  from 'ai';import  from '@ai-sdk/openai';import  from '@/utils/schemas';
export async function POST(req: Request) );
  return result.toTextStreamResponse();}
```


#### [After: Use object hook to decode stream and update object](#after-use-object-hook-to-decode-stream-and-update-object)












``` tsx
'use client';
import  from '@ai-sdk/react';import  from '@/utils/schemas';
export default function Page()  = useObject();
  return (    <div>      <button onClick=>        Generate notifications      </button>
      >          <p></p>          <p></p>        </div>      ))}    </div>  );}
```

















On this page


























































































































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.