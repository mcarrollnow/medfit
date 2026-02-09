AI SDK 5 is available now.










Menu






















































































































































































































































































































































# [Chatbot Resume Streams](#chatbot-resume-streams)

`useChat` supports resuming ongoing streams after page reloads. Use this feature to build applications with long-running generations.




Stream resumption is not compatible with abort functionality. Closing a tab or refreshing the page triggers an abort signal that will break the resumption mechanism. Do not use `resume: true` if you need abort functionality in your application. See [troubleshooting](../troubleshooting/abort-breaks-resumable-streams.html) for more details.



## [How stream resumption works](#how-stream-resumption-works)

Stream resumption requires persistence for messages and active streams in your application. The AI SDK provides tools to connect to storage, but you need to set up the storage yourself.

**The AI SDK provides:**

- A `resume` option in `useChat` that automatically reconnects to active streams
- Access to the outgoing stream through the `consumeSseStream` callback
- Automatic HTTP requests to your resume endpoints

**You build:**

- Storage to track which stream belongs to each chat
- Redis to store the UIMessage stream
- Two API endpoints: POST to create streams, GET to resume them

## [Prerequisites](#prerequisites)

To implement resumable streams in your chat application, you need:

1.  **The `resumable-stream` package** - Handles the publisher/subscriber mechanism for streams
3.  **A persistence layer** - Tracks which stream ID is active for each chat (e.g. database)

## [Implementation](#implementation)

### [1. Client-side: Enable stream resumption](#1-client-side-enable-stream-resumption)

Use the `resume` option in the `useChat` hook to enable stream resumption. When `resume` is true, the hook automatically attempts to reconnect to any active stream for the chat on mount:












``` tsx
'use client';
import  from '@ai-sdk/react';import  from 'ai';
export function Chat(: ;  resume?: boolean;})  = useChat() => ,        };      },    }),  });
  return <div></div>;}
```





You must send the chat ID with each request (see `prepareSendMessagesRequest`).



When you enable `resume`, the `useChat` hook makes a `GET` request to `/api/chat/[id]/stream` on mount to check for and resume any active streams.

Let's start by creating the POST handler to create the resumable stream.

### [2. Create the POST handler](#2-create-the-post-handler)

The POST handler creates resumable streams using the `consumeSseStream` callback:












``` ts
import  from '@ai-sdk/openai';import  from '@util/chat-store';import  from 'ai';import  from 'next/server';import  from 'resumable-stream';
export async function POST(req: Request) :  = await req.json();
  const chat = await readChat(id);  let messages = chat.messages;
  messages = [...messages, message!];
  // Clear any previous active stream and save the user message  saveChat();
  const result = streamText();
  return result.toUIMessageStreamResponse() => );    },    async consumeSseStream() );      await streamContext.createNewResumableStream(streamId, () => stream);
      // Update the chat with the active stream ID      saveChat();    },  });}
```


### [3. Implement the GET handler](#3-implement-the-get-handler)

Create a GET handler at `/api/chat/[id]/stream` that:

1.  Reads the chat ID from the route params
2.  Loads the chat data to check for an active stream
3.  Returns 204 (No Content) if no stream is active
4.  Resumes the existing stream if one is found












``` ts
import  from '@util/chat-store';import  from 'ai';import  from 'next/server';import  from 'resumable-stream';
export async function GET(  _: Request,  : > },)  = await params;
  const chat = await readChat(id);
  if (chat.activeStreamId == null) );  }
  const streamContext = createResumableStreamContext();
  return new Response(    await streamContext.resumeExistingStream(chat.activeStreamId),    ,  );}
```





The `after` function from Next.js allows work to continue after the response has been sent. This ensures that the resumable stream persists in Redis even after the initial response is returned to the client, enabling reconnection later.



## [How it works](#how-it-works)

### [Request lifecycle](#request-lifecycle)

![Diagram showing the architecture and lifecycle of resumable stream requests](../../../e742qlubrjnjqpp0.public.blob.vercel-storage.com/resume-stream-diagram.png)

The diagram above shows the complete lifecycle of a resumable stream:

1.  **Stream creation**: When you send a new message, the POST handler uses `streamText` to generate the response. The `consumeSseStream` callback creates a resumable stream with a unique ID and stores it in Redis through the `resumable-stream` package
2.  **Stream tracking**: Your persistence layer saves the `activeStreamId` in the chat data
3.  **Client reconnection**: When the client reconnects (page reload), the `resume` option triggers a GET request to `/api/chat/[id]/stream`
4.  **Stream recovery**: The GET handler checks for an `activeStreamId` and uses `resumeExistingStream` to reconnect. If no active stream exists, it returns a 204 (No Content) response
5.  **Completion cleanup**: When the stream finishes, the `onFinish` callback clears the `activeStreamId` by setting it to `null`

## [Customize the resume endpoint](#customize-the-resume-endpoint)

By default, the `useChat` hook makes a GET request to `/api/chat/[id]/stream` when resuming. Customize this endpoint, credentials, and headers, using the `prepareReconnectToStreamRequest` option in `DefaultChatTransport`:












``` tsx
import  from '@ai-sdk/react';import  from 'ai';
export function Chat()  = useChat() => /stream`, // Default pattern          // Or use a different pattern:          // api: `/api/streams/$/resume`,          // api: `/api/resume-chat?id=$`,          credentials: 'include', // Include cookies/auth          headers: ,        };      },    }),  });
  return <div></div>;}
```


This lets you:

- Match your existing API route structure
- Add query parameters or custom paths
- Integrate with different backend architectures

## [Important considerations](#important-considerations)

- **Incompatibility with abort**: Stream resumption is not compatible with abort functionality. Closing a tab or refreshing the page triggers an abort signal that will break the resumption mechanism. Do not use `resume: true` if you need abort functionality in your application
- **Stream expiration**: Streams in Redis expire after a set time (configurable in the `resumable-stream` package)
- **Multiple clients**: Multiple clients can connect to the same stream simultaneously
- **Error handling**: When no active stream exists, the GET handler returns a 204 (No Content) status code
- **Security**: Ensure proper authentication and authorization for both creating and resuming streams
- **Race conditions**: Clear the `activeStreamId` when starting a new stream to prevent resuming outdated streams

  





View Example on GitHub




















On this page















































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.