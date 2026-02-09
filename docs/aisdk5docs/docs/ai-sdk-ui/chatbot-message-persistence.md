AI SDK 5 is available now.










Menu






















































































































































































































































































































































# [Chatbot Message Persistence](#chatbot-message-persistence)

Being able to store and load chat messages is crucial for most AI chatbots. In this guide, we'll show how to implement message persistence with `useChat` and `streamText`.




This guide does not cover authorization, error handling, or other real-world considerations. It is intended to be a simple example of how to implement message persistence.



## [Starting a new chat](#starting-a-new-chat)

When the user navigates to the chat page without providing a chat ID, we need to create a new chat and redirect to the chat page with the new chat ID.












``` tsx
import  from 'next/navigation';import  from '@util/chat-store';
export default async function Page() `); // redirect to chat page, see below}
```


Our example chat store implementation uses files to store the chat messages. In a real-world application, you would use a database or a cloud storage service, and get the chat ID from the database. That being said, the function interfaces are designed to be easily replaced with other implementations.












``` tsx
import  from 'ai';import  from 'fs';import  from 'fs/promises';import path from 'path';
export async function createChat(): Promise<string> 
function getChatFile(id: string): string );  return path.join(chatDir, `$.json`);}
```


## [Loading an existing chat](#loading-an-existing-chat)

When the user navigates to the chat page with a chat ID, we need to load the chat messages from storage.

The `loadChat` function in our file-based chat store is implemented as follows:












``` tsx
import  from 'ai';import  from 'fs/promises';
export async function loadChat(id: string): Promise<UIMessage[]> 
// ... rest of the file
```


## [Validating messages on the server](#validating-messages-on-the-server)

When processing messages on the server that contain tool calls, custom metadata, or data parts, you should validate them using `validateUIMessages` before sending them to the model.

### [Validation with tools](#validation-with-tools)

When your messages include tool calls, validate them against your tool definitions:












``` tsx
import  from 'ai';import  from 'zod';import  from '@util/chat-store';import  from '@ai-sdk/openai';import  from '@util/schemas';
// Define your toolsconst tools = ),    execute: async () => ,  }),  // other tools};
export async function POST(req: Request)  = await req.json();
  // Load previous messages from database  const previousMessages = await loadChat(id);
  // Append new message to previousMessages messages  const messages = [...previousMessages, message];
  // Validate loaded messages against  // tools, data parts schema, and metadata schema  const validatedMessages = await validateUIMessages();
  const result = streamText();
  return result.toUIMessageStreamResponse() => );    },  });}
```


### [Handling validation errors](#handling-validation-errors)

Handle validation errors gracefully when messages from the database don't match current schemas:












``` tsx
import  from 'ai';import  from '@/types';
export async function POST(req: Request)  = await req.json();
  // Load and validate messages from database  let validatedMessages: MyUIMessage[];
  try );  } catch (error)  else   }
  // Continue with validated messages...}
```


## [Displaying the chat](#displaying-the-chat)

Once messages are loaded from storage, you can display them in your chat UI. Here's how to set up the page component and the chat display:












``` tsx
import  from '@util/chat-store';import Chat from '@ui/chat';
export default async function Page(props: > })  = await props.params;  const messages = await loadChat(id);  return <Chat id= initialMessages= />;}
```


The chat component uses the `useChat` hook to manage the conversation:












``` tsx
'use client';
import  from '@ai-sdk/react';import  from 'ai';import  from 'react';
export default function Chat(:  = )  = useChat(),  });
  const handleSubmit = (e: React.FormEvent) => );      setInput('');    }  };
  // simplified rendering code, extend as needed:  return (    <div>      >                            </div>      ))}
      <form onSubmit=>        <input          value=          onChange=          placeholder="Type a message..."        />        <button type="submit">Send</button>      </form>    </div>  );}
```


## [Storing messages](#storing-messages)

`useChat` sends the chat id and the messages to the backend.




The `useChat` message format is different from the `ModelMessage` format. The `useChat` message format is designed for frontend display, and contains additional fields such as `id` and `createdAt`. We recommend storing the messages in the `useChat` message format.

When loading messages from storage that contain tools, metadata, or custom data parts, validate them using `validateUIMessages` before processing (see the [validation section](#validating-messages-from-database) above).



Storing messages is done in the `onFinish` callback of the `toUIMessageStreamResponse` function. `onFinish` receives the complete messages including the new AI response as `UIMessage[]`.












``` tsx
import  from '@ai-sdk/openai';import  from '@util/chat-store';import  from 'ai';
export async function POST(req: Request) :  =    await req.json();
  const result = streamText();
  return result.toUIMessageStreamResponse() => );    },  });}
```


The actual storage of the messages is done in the `saveChat` function, which in our file-based chat store is implemented as follows:












``` tsx
import  from 'ai';import  from 'fs/promises';
export async function saveChat(: ): Promise<void> 
// ... rest of the file
```


## [Message IDs](#message-ids)

In addition to a chat ID, each message has an ID. You can use this message ID to e.g. manipulate individual messages.

### [Client-side vs Server-side ID Generation](#client-side-vs-server-side-id-generation)

By default, message IDs are generated client-side:

- User message IDs are generated by the `useChat` hook on the client
- AI response message IDs are generated by `streamText` on the server

For applications without persistence, client-side ID generation works perfectly. However, **for persistence, you need server-side generated IDs** to ensure consistency across sessions and prevent ID conflicts when messages are stored and retrieved.

### [Setting Up Server-side ID Generation](#setting-up-server-side-id-generation)

When implementing persistence, you have two options for generating server-side IDs:

1.  **Using `generateMessageId` in `toUIMessageStreamResponse`**
2.  **Setting IDs in your start message part with `createUIMessageStream`**

#### [Option 1: Using `generateMessageId` in `toUIMessageStreamResponse`](#option-1-using-generatemessageid-in-touimessagestreamresponse)

You can control the ID format by providing ID generators using [`createIdGenerator()`](../reference/ai-sdk-core/create-id-generator.html):












``` tsx
import  from 'ai';
export async function POST(req: Request) );
  return result.toUIMessageStreamResponse(),    onFinish: () => );    },  });}
```


#### [Option 2: Setting IDs with `createUIMessageStream`](#option-2-setting-ids-with-createuimessagestream)

Alternatively, you can use `createUIMessageStream` to control the message ID by writing a start message part:












``` tsx
import  from 'ai';
export async function POST(req: Request)  = await req.json();
  const stream = createUIMessageStream() => );
      const result = streamText();
      writer.merge(result.toUIMessageStream()); // omit start message part    },    originalMessages: messages,    onFinish: () => ,  });
  return createUIMessageStreamResponse();}
```





For client-side applications that don't require persistence, you can still customize client-side ID generation:












``` tsx
import  from 'ai';import  from '@ai-sdk/react';
const  = useChat(),  // ...});
```




## [Sending only the last message](#sending-only-the-last-message)

Once you have implemented message persistence, you might want to send only the last message to the server. This reduces the amount of data sent to the server on each request and can improve performance.

To achieve this, you can provide a `prepareSendMessagesRequest` function to the transport. This function receives the messages and the chat ID, and returns the request body to be sent to the server.












``` tsx
import  from '@ai-sdk/react';import  from 'ai';
const  = useChat()  };    },  }),});
```


On the server, you can then load the previous messages and append the new message to the previous messages. If your messages contain tools, metadata, or custom data parts, you should validate them:












``` tsx
import  from 'ai';// import your tools and schemas
export async function POST(req: Request)  = await req.json();
  // load the previous messages from the server:  const previousMessages = await loadChat(id);
  // validate messages if they contain tools, metadata, or data parts:  const validatedMessages = await validateUIMessages();
  const result = streamText();
  return result.toUIMessageStreamResponse() => );    },  });}
```


## [Handling client disconnects](#handling-client-disconnects)

By default, the AI SDK `streamText` function uses backpressure to the language model provider to prevent the consumption of tokens that are not yet requested.

However, this means that when the client disconnects, e.g. by closing the browser tab or because of a network issue, the stream from the LLM will be aborted and the conversation may end up in a broken state.

Assuming that you have a [storage solution](#storing-messages) in place, you can use the `consumeStream` method to consume the stream on the backend, and then save the result as usual. `consumeStream` effectively removes the backpressure, meaning that the result is stored even when the client has already disconnected.












``` tsx
import  from 'ai';import  from '@util/chat-store';
export async function POST(req: Request) :  =    await req.json();
  const result = streamText();
  // consume the stream to ensure it runs to completion & triggers onFinish  // even when the client response is aborted:  result.consumeStream(); // no await
  return result.toUIMessageStreamResponse() => );    },  });}
```


When the client reloads the page after a disconnect, the chat will be restored from the storage solution.




In production applications, you would also track the state of the request (in progress, complete) in your stored messages and use it on the client to cover the case where the client reloads the page after a disconnection, but the streaming is not yet complete.



For more robust handling of disconnects, you may want to add resumability on disconnects. Check out the [Chatbot Resume Streams](chatbot-resume-streams.html) documentation to learn more.
















On this page





























































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.