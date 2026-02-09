AI SDK 5 is available now.










Menu






















































































































































































































































































































































# [Chatbot](#chatbot)

The `useChat` hook makes it effortless to create a conversational user interface for your chatbot application. It enables the streaming of chat messages from your AI provider, manages the chat state, and updates the UI automatically as new messages arrive.

To summarize, the `useChat` hook provides the following features:

- **Message Streaming**: All the messages from the AI provider are streamed to the chat UI in real-time.
- **Managed States**: The hook manages the states for input, messages, status, error and more for you.
- **Seamless Integration**: Easily integrate your chat AI into any design or layout with minimal effort.

In this guide, you will learn how to use the `useChat` hook to create a chatbot application with real-time message streaming. Check out our [chatbot with tools guide](chatbot-tool-usage.html) to learn how to use tools in your chatbot. Let's start with the following example first.

## [Example](#example)












``` tsx
'use client';
import  from '@ai-sdk/react';import  from 'ai';import  from 'react';
export default function Page()  = useChat(),  });  const [input, setInput] = useState('');
  return (    <>      >                    ></span> : null,          )}        </div>      ))}
      <form        onSubmit=);            setInput('');          }        }}      >        <input          value=          onChange=          disabled=          placeholder="Say something..."        />        <button type="submit" disabled=>          Submit        </button>      </form>    </>  );}
```













``` ts
import  from '@ai-sdk/openai';import  from 'ai';
// Allow streaming responses up to 30 secondsexport const maxDuration = 30;
export async function POST(req: Request) :  = await req.json();
  const result = streamText();
  return result.toUIMessageStreamResponse();}
```





The UI messages have a new `parts` property that contains the message parts. We recommend rendering the messages using the `parts` property instead of the `content` property. The parts property supports different message types, including text, tool invocation, and tool result, and allows for more flexible and complex chat UIs.



In the `Page` component, the `useChat` hook will request to your AI provider endpoint whenever the user sends a message using `sendMessage`. The messages are then streamed back in real-time and displayed in the chat UI.

This enables a seamless chat experience where the user can see the AI response as soon as it is available, without having to wait for the entire response to be received.

## [Customized UI](#customized-ui)

`useChat` also provides ways to manage the chat message states via code, show status, and update messages without being triggered by user interactions.

### [Status](#status)

The `useChat` hook returns a `status`. It has the following possible values:

- `submitted`: The message has been sent to the API and we're awaiting the start of the response stream.
- `streaming`: The response is actively streaming in from the API, receiving chunks of data.
- `ready`: The full response has been received and processed; a new user message can be submitted.
- `error`: An error occurred during the API request, preventing successful completion.

You can use `status` for e.g. the following purposes:

- To show a loading spinner while the chatbot is processing the user's message.
- To show a "Stop" button to abort the current message.
- To disable the submit button.












``` tsx
'use client';
import  from '@ai-sdk/react';import  from 'ai';import  from 'react';
export default function Page()  = useChat(),  });  const [input, setInput] = useState('');
  return (    <>      >                    ></span> : null,          )}        </div>      ))}
                <button type="button" onClick=>            Stop          </button>        </div>      )}
      <form        onSubmit=);            setInput('');          }        }}      >        <input          value=          onChange=          disabled=          placeholder="Say something..."        />        <button type="submit" disabled=>          Submit        </button>      </form>    </>  );}
```


### [Error State](#error-state)

Similarly, the `error` state reflects the error object thrown during the fetch request. It can be used to display an error message, disable the submit button, or show a retry button:




We recommend showing a generic error message to the user, such as "Something went wrong." This is a good practice to avoid leaking information from the server.





``` tsx
'use client';
import  from '@ai-sdk/react';import  from 'ai';import  from 'react';
export default function Chat()  = useChat(),  });  const [input, setInput] = useState('');
  return (    <div>      >          :          ></span> : null,          )}        </div>      ))}
      >            Retry          </button>        </>      )}
      <form        onSubmit=);            setInput('');          }        }}      >        <input          value=          onChange=          disabled=        />      </form>    </div>  );}
```


Please also see the [error handling](error-handling.html) guide for more information.

### [Modify messages](#modify-messages)

Sometimes, you may want to directly modify some existing messages. For example, a delete button can be added to each message to allow users to remove them from the chat history.

The `setMessages` function can help you achieve these tasks:



``` tsx
const  = useChat()
const handleDelete = (id) => 
return <>  >            ></span>        ) : null      ))}      <button onClick=>Delete</button>    </div>  ))}  ...
```


You can think of `messages` and `setMessages` as a pair of `state` and `setState` in React.

### [Cancellation and regeneration](#cancellation-and-regeneration)

It's also a common use case to abort the response message while it's still streaming back from the AI provider. You can do this by calling the `stop` function returned by the `useChat` hook.



``` tsx
const  = useChat()
return <>  <button onClick= disabled=>Stop</button>  ...
```


When the user clicks the "Stop" button, the fetch request will be aborted. This avoids consuming unnecessary resources and improves the UX of your chatbot application.

Similarly, you can also request the AI provider to reprocess the last message by calling the `regenerate` function returned by the `useChat` hook:



``` tsx
const  = useChat();
return (  <>    <button      onClick=      disabled=    >      Regenerate    </button>    ...  </>);
```


When the user clicks the "Regenerate" button, the AI provider will regenerate the last message and replace the current one correspondingly.

### [Throttling UI Updates](#throttling-ui-updates)






By default, the `useChat` hook will trigger a render every time a new chunk is received. You can throttle the UI updates with the `experimental_throttle` option.












``` tsx
const  = useChat()
```


## [Event Callbacks](#event-callbacks)

`useChat` provides optional event callbacks that you can use to handle different stages of the chatbot lifecycle:

- `onFinish`: Called when the assistant response is completed. The event includes the response message, all messages, and flags for abort, disconnect, and errors.
- `onError`: Called when an error occurs during the fetch request.
- `onData`: Called whenever a data part is received.

These callbacks can be used to trigger additional actions, such as logging, analytics, or custom UI updates.



``` tsx
import  from 'ai';
const  = useChat() => ,  onError: error => ,  onData: data => ,});
```


It's worth noting that you can abort the processing by throwing an error in the `onData` callback. This will trigger the `onError` callback and stop the message from being appended to the chat UI. This can be useful for handling unexpected responses from the AI provider.

## [Request Configuration](#request-configuration)

### [Custom headers, body, and credentials](#custom-headers-body-and-credentials)

By default, the `useChat` hook sends a HTTP POST request to the `/api/chat` endpoint with the message list as the request body. You can customize the request in two ways:

#### [Hook-Level Configuration (Applied to all requests)](#hook-level-configuration-applied-to-all-requests)

You can configure transport-level options that will be applied to all requests made by the hook:



``` tsx
import  from '@ai-sdk/react';import  from 'ai';
const  = useChat(,    body: ,    credentials: 'same-origin',  }),});
```


#### [Dynamic Hook-Level Configuration](#dynamic-hook-level-configuration)

You can also provide functions that return configuration values. This is useful for authentication tokens that need to be refreshed, or for configuration that depends on runtime conditions:



``` tsx
import  from '@ai-sdk/react';import  from 'ai';
const  = useChat(`,      'X-User-ID': getCurrentUserId(),    }),    body: () => (),    credentials: () => 'include',  }),});
```





For component state that changes over time, use `useRef` to store the current value and reference `ref.current` in your configuration function, or prefer request-level options (see next section) for better reliability.



#### [Request-Level Configuration (Recommended)](#request-level-configuration-recommended)




**Recommended**: Use request-level options for better flexibility and control. Request-level options take precedence over hook-level options and allow you to customize each request individually.





``` tsx
// Pass options as the second parameter to sendMessagesendMessage(  ,  ,    body: ,    metadata: ,  },);
```


The request-level options are merged with hook-level options, with request-level options taking precedence. On your server side, you can handle the request with this additional information.

### [Setting custom body fields per request](#setting-custom-body-fields-per-request)

You can configure custom `body` fields on a per-request basis using the second parameter of the `sendMessage` function. This is useful if you want to pass in additional information to your backend that is not part of the message list.












``` tsx
'use client';
import  from '@ai-sdk/react';import  from 'react';
export default function Chat()  = useChat();  const [input, setInput] = useState('');
  return (    <div>      >          :          ></span> : null,          )}        </div>      ))}
      <form        onSubmit=,              ,              },            );            setInput('');          }        }}      >        <input value= onChange= />      </form>    </div>  );}
```


You can retrieve these custom fields on your server side by destructuring the request body:












``` ts
export async function POST(req: Request) :  =    await req.json();  //...}
```


## [Message Metadata](#message-metadata)

You can attach custom metadata to messages for tracking information like timestamps, model details, and token usage.



``` ts
// Server: Send metadata about the messagereturn result.toUIMessageStreamResponse() => ;    }
    if (part.type === 'finish') ;    }  },});
```




``` tsx
// Client: Access metadata via message.metadata>      :                  ></span> : null,      )}             tokens</span>      )}    </div>  ));}
```


For complete examples with type safety and advanced use cases, see the [Message Metadata documentation](message-metadata.html).

## [Transport Configuration](#transport-configuration)

You can configure custom transport behavior using the `transport` option to customize how messages are sent to your API:












``` tsx
import  from '@ai-sdk/react';import  from 'ai';
export default function Chat()  = useChat() => ,        };      },    }),  });
  // ... rest of your component}
```


The corresponding API route receives the custom request format:












``` ts
export async function POST(req: Request)  = await req.json();
  // Load existing messages and add the new one  const messages = await loadMessages(id);  messages.push(message);
  const result = streamText();
  return result.toUIMessageStreamResponse();}
```


### [Advanced: Trigger-based routing](#advanced-trigger-based-routing)

For more complex scenarios like message regeneration, you can use trigger-based routing:












``` tsx
import  from '@ai-sdk/react';import  from 'ai';
export default function Chat()  = useChat() => ,          };        } else if (trigger === 'regenerate-assistant-message') ,          };        }        throw new Error(`Unsupported trigger: $`);      },    }),  });
  // ... rest of your component}
```


The corresponding API route would handle different triggers:












``` ts
export async function POST(req: Request)  = await req.json();
  const chat = await readChat(id);  let messages = chat.messages;
  if (trigger === 'submit-user-message')  else if (trigger === 'regenerate-assistant-message')   }
  const result = streamText();
  return result.toUIMessageStreamResponse();}
```


To learn more about building custom transports, refer to the [Transport API documentation](transport.html).

## [Controlling the response stream](#controlling-the-response-stream)

With `streamText`, you can control how error messages and usage information are sent back to the client.

### [Error Messages](#error-messages)

By default, the error message is masked for security reasons. The default error message is "An error occurred." You can forward error messages or send your own error message by providing a `getErrorMessage` function:












``` ts
import  from '@ai-sdk/openai';import  from 'ai';
export async function POST(req: Request) :  = await req.json();
  const result = streamText();
  return result.toUIMessageStreamResponse(
      if (typeof error === 'string') 
      if (error instanceof Error) 
      return JSON.stringify(error);    },  });}
```


### [Usage Information](#usage-information)

Track token consumption and resource usage with [message metadata](message-metadata.html):

1.  Define a custom metadata type with usage fields (optional, for type safety)
2.  Attach usage data using `messageMetadata` in your response
3.  Display usage metrics in your UI components

Usage data is attached as metadata to messages and becomes available once the model completes its response generation.



``` ts
import  from '@ai-sdk/openai';import  from 'ai';
// Create a new metadata type (optional for type-safety)type MyMetadata = ;
// Create a new custom message type with your own metadataexport type MyUIMessage = UIMessage<MyMetadata>;
export async function POST(req: Request) :  = await req.json();
  const result = streamText();
  return result.toUIMessageStreamResponse() => ;      }    },  });}
```


Then, on the client, you can access the message-level metadata.



``` tsx
'use client';
import  from '@ai-sdk/react';import type  from './api/chat/route';import  from 'ai';
export default function Chat()  = useChat<MyUIMessage>(),  });
  return (    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">       className="whitespace-pre-wrap">                              })}                     tokens</div>          )}        </div>      ))}    </div>  );}
```


You can also access your metadata from the `onFinish` callback of `useChat`:



``` tsx
'use client';
import  from '@ai-sdk/react';import type  from './api/chat/route';import  from 'ai';
export default function Chat()  = useChat<MyUIMessage>(),    onFinish: () => ,  });}
```


### [Text Streams](#text-streams)

`useChat` can handle plain text streams by setting the `streamProtocol` option to `text`:












``` tsx
'use client';
import  from '@ai-sdk/react';import  from 'ai';
export default function Chat()  = useChat(),  });
  return <>...</>;}
```


This configuration also works with other backend servers that stream plain text. Check out the [stream protocol guide](stream-protocol.html) for more information.




When using `TextStreamChatTransport`, tool calls, usage information and finish reasons are not available.



## [Reasoning](#reasoning)

Some models such as as DeepSeek `deepseek-reasoner` and Anthropic `claude-3-7-sonnet-20250219` support reasoning tokens. These tokens are typically sent before the message content. You can forward them to the client with the `sendReasoning` option:












``` ts
import  from '@ai-sdk/deepseek';import  from 'ai';
export async function POST(req: Request) :  = await req.json();
  const result = streamText();
  return result.toUIMessageStreamResponse();}
```


On the client side, you can access the reasoning parts of the message object.

Reasoning parts have a `text` property that contains the reasoning content.












``` tsx
messages.map(message => (  <div key=>        ></div>;      }
      // reasoning parts:      if (part.type === 'reasoning') ></pre>;      }    })}  </div>));
```


## [Sources](#sources)

Some providers such as [Perplexity](../../providers/ai-sdk-providers/perplexity.html#sources) and [Google Generative AI](../../providers/ai-sdk-providers/google-generative-ai.html#sources) include sources in the response.

Currently sources are limited to web pages that ground the response. You can forward them to the client with the `sendSources` option:












``` ts
import  from '@ai-sdk/perplexity';import  from 'ai';
export async function POST(req: Request) :  = await req.json();
  const result = streamText();
  return result.toUIMessageStreamResponse();}
```


On the client side, you can access source parts of the message object. There are two types of sources: `source-url` for web pages and `source-document` for documents. Here is an example that renders both types of sources:












``` tsx
messages.map(message => (  <div key=>    
        `}>          [          <a href= target="_blank">                      </a>          ]        </span>      ))}
        `}>          [<span>`}</span>]        </span>      ))}  </div>));
```


## [Image Generation](#image-generation)

Some models such as Google `gemini-2.5-flash-image-preview` support image generation. When images are generated, they are exposed as files to the client. On the client side, you can access file parts of the message object and render them as images.












``` tsx
messages.map(message => (  <div key=>        ></div>;      } else if (part.type === 'file' && part.mediaType.startsWith('image/'))  src= alt="Generated image" />;      }    })}  </div>));
```


## [Attachments](#attachments)

The `useChat` hook supports sending file attachments along with a message as well as rendering them on the client. This can be useful for building applications that involve sending images, files, or other media content to the AI provider.

There are two ways to send files with a message: using a `FileList` object from file inputs or using an array of file objects.

### [FileList](#filelist)

By using `FileList`, you can send multiple files as attachments along with a message using the file input element. The `useChat` hook will automatically convert them into data URLs and send them to the AI provider.




Currently, only `image/*` and `text/*` content types get automatically converted into [multi-modal content parts](../foundations/prompts.html#multi-modal-messages). You will need to handle other content types manually.














``` tsx
'use client';
import  from '@ai-sdk/react';import  from 'react';
export default function Page()  = useChat();
  const [input, setInput] = useState('');  const [files, setFiles] = useState<FileList | undefined>(undefined);  const fileInputRef = useRef<HTMLInputElement>(null);
  return (    <div>      <div>        >            <div>: `}</div>
            <div>              ></span>;                }
                if (                  part.type === 'file' &&                  part.mediaType?.startsWith('image/')                )  src= alt= />;                }
                return null;              })}            </div>          </div>        ))}      </div>
      <form        onSubmit=);            setInput('');            setFiles(undefined);
            if (fileInputRef.current)           }        }}      >        <input          type="file"          onChange=          }}          multiple          ref=        />        <input          value=          placeholder="Send message..."          onChange=          disabled=        />      </form>    </div>  );}
```


### [File Objects](#file-objects)

You can also send files as objects along with a message. This can be useful for sending pre-uploaded files or data URLs.












``` tsx
'use client';
import  from '@ai-sdk/react';import  from 'react';import  from 'ai';
export default function Page()  = useChat();
  const [input, setInput] = useState('');  const [files] = useState<FileUIPart[]>([    ,    ,  ]);
  return (    <div>      <div>        >            <div>: `}</div>
            <div>              ></span>;                }
                if (                  part.type === 'file' &&                  part.mediaType?.startsWith('image/')                )  src= alt= />;                }
                return null;              })}            </div>          </div>        ))}      </div>
      <form        onSubmit=);            setInput('');          }        }}      >        <input          value=          placeholder="Send message..."          onChange=          disabled=        />      </form>    </div>  );}
```


## [Type Inference for Tools](#type-inference-for-tools)

When working with tools in TypeScript, AI SDK UI provides type inference helpers to ensure type safety for your tool inputs and outputs.

### [InferUITool](#inferuitool)

The `InferUITool` type helper infers the input and output types of a single tool for use in UI messages:



``` tsx
import  from 'ai';import  from 'zod';
const weatherTool = ),  execute: async () =>  is sunny.`;  },};
// Infer the types from the tooltype WeatherUITool = InferUITool<typeof weatherTool>;// This creates a type with:// ;//   output: string;// }
```


### [InferUITools](#inferuitools)

The `InferUITools` type helper infers the input and output types of a `ToolSet`:



``` tsx
import  from 'ai';import  from 'zod';
const tools = ),    execute: async () =>  is sunny.`;    },  },  calculator: ),    execute: async () =>     },  },} satisfies ToolSet;
// Infer the types from the tool settype MyUITools = InferUITools<typeof tools>;// This creates a type with:// ; output: string };//   calculator: ; output: number };// }
```


### [Using Inferred Types](#using-inferred-types)

You can use these inferred types to create a custom UIMessage type and pass it to various AI SDK UI functions:



``` tsx
import  from 'ai';
type MyUITools = InferUITools<typeof tools>;type MyUIMessage = UIMessage<never, UIDataTypes, MyUITools>;
```


Pass the custom type to `useChat` or `createUIMessageStream`:



``` tsx
import  from '@ai-sdk/react';import  from 'ai';import type  from './types';
// With useChatconst  = useChat<MyUIMessage>();
// With createUIMessageStreamconst stream = createUIMessageStream<MyUIMessage>(/* ... */);
```


This provides full type safety for tool inputs and outputs on the client and server.
















On this page
























































































































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.