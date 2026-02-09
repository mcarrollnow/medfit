AI SDK 5 is available now.










Menu















































































































































































































































































































































































































# [Stopping Streams](#stopping-streams)

Cancelling ongoing streams is often needed. For example, users might want to stop a stream when they realize that the response is not what they want.

The different parts of the AI SDK support cancelling streams in different ways.

## [AI SDK Core](#ai-sdk-core)

The AI SDK functions have an `abortSignal` argument that you can use to cancel a stream. You would use this if you want to cancel a stream from the server side to the LLM API, e.g. by forwarding the `abortSignal` from the request.



``` tsx
import  from '@ai-sdk/openai';import  from 'ai';
export async function POST(req: Request)  = await req.json();
  const result = streamText() => ,  });
  return result.toTextStreamResponse();}
```


## [AI SDK UI](#ai-sdk-ui)

The hooks, e.g. `useChat` or `useCompletion`, provide a `stop` helper function that can be used to cancel a stream. This will cancel the stream from the client side to the server.




Stream abort functionality is not compatible with stream resumption. If you're using `resume: true` in `useChat`, the abort functionality will break the resumption mechanism. Choose either abort or resume functionality, but not both.





``` tsx
'use client';
import  from '@ai-sdk/react';
export default function Chat()  =    useCompletion();
  return (    <div>      >          Stop        </button>      )}            <form onSubmit=>        <input value= onChange= />      </form>    </div>  );}
```


## [Handling stream abort cleanup](#handling-stream-abort-cleanup)

When streams are aborted, you may need to perform cleanup operations such as persisting partial results or cleaning up resources. The `onAbort` callback provides a way to handle these scenarios on the server side.

Unlike `onFinish`, which is called when a stream completes normally, `onAbort` is specifically called when a stream is aborted via `AbortSignal`. This distinction allows you to handle normal completion and aborted streams differently.




For UI message streams (`toUIMessageStreamResponse`), the `onFinish` callback also receives an `isAborted` parameter that indicates whether the stream was aborted. This allows you to handle both completion and abort scenarios in a single callback.





``` tsx
import  from 'ai';
const result = streamText() => ,  onFinish: () => ,});
```


The `onAbort` callback receives:

- `steps`: Array of all completed steps before the abort occurred

This is particularly useful for:

- Persisting partial conversation history to database
- Saving partial progress for later continuation
- Cleaning up server-side resources or connections
- Logging abort events for analytics

You can also handle abort events directly in the stream using the `abort` stream part:



``` tsx
for await (const part of result.fullStream) }
```


## [UI Message Streams](#ui-message-streams)

When using `toUIMessageStreamResponse`, you need to handle stream abortion slightly differently. The `onFinish` callback receives an `isAborted` parameter, and you should pass the `consumeStream` function to ensure proper abort handling:



``` tsx
import  from '@ai-sdk/openai';import  from 'ai';
export async function POST(req: Request) :  = await req.json();
  const result = streamText();
  return result.toUIMessageStreamResponse() =>  else     },    consumeSseStream: consumeStream,  });}
```


The `consumeStream` function is necessary for proper abort handling in UI message streams. It ensures that the stream is properly consumed even when aborted, preventing potential memory leaks or hanging connections.

## [AI SDK RSC](#ai-sdk-rsc)




The AI SDK RSC does not currently support stopping streams.


















On this page




























Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.