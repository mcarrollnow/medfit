AI SDK 5 is available now.










Menu






















































































































































































































































































































































# [Stream Protocols](#stream-protocols)

AI SDK UI functions such as `useChat` and `useCompletion` support both text streams and data streams. The stream protocol defines how the data is streamed to the frontend on top of the HTTP protocol.

This page describes both protocols and how to use them in the backend and frontend.

You can use this information to develop custom backends and frontends for your use case, e.g., to provide compatible API endpoints that are implemented in a different language such as Python.


## [Text Stream Protocol](#text-stream-protocol)

A text stream contains chunks in plain text, that are streamed to the frontend. Each chunk is then appended together to form a full text response.

Text streams are supported by `useChat`, `useCompletion`, and `useObject`. When you use `useChat` or `useCompletion`, you need to enable text streaming by setting the `streamProtocol` options to `text`.

You can generate text streams with `streamText` in the backend. When you call `toTextStreamResponse()` on the result object, a streaming HTTP response is returned.




Text streams only support basic text data. If you need to stream other types of data such as tool calls, use data streams.



### [Text Stream Example](#text-stream-example)

Here is a Next.js example that uses the text stream protocol:












``` tsx
'use client';
import  from '@ai-sdk/react';import  from 'ai';import  from 'react';
export default function Chat()  = useChat(),  });
  return (    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">       className="whitespace-pre-wrap">                    -$`}></div>;            }          })}        </div>      ))}
      <form        onSubmit=);          setInput('');        }}      >        <input          className="fixed dark:bg-zinc-900 bottom-0 w-full max-w-md p-2 mb-8 border border-zinc-300 dark:border-zinc-800 rounded shadow-xl"          value=          placeholder="Say something..."          onChange=        />      </form>    </div>  );}
```













``` ts
import  from 'ai';import  from '@ai-sdk/openai';
// Allow streaming responses up to 30 secondsexport const maxDuration = 30;
export async function POST(req: Request) :  = await req.json();
  const result = streamText();
  return result.toTextStreamResponse();}
```



A data stream follows a special protocol that the AI SDK provides to send information to the frontend.

The data stream protocol uses Server-Sent Events (SSE) format for improved standardization, keep-alive through ping, reconnect capabilities, and better cache handling.




When you provide data streams from a custom backend, you need to set the `x-vercel-ai-ui-message-stream` header to `v1`.



The following stream parts are currently supported:

### [Message Start Part](#message-start-part)

Indicates the beginning of a new message with metadata.

Format: Server-Sent Event with JSON object

Example:



``` undefined
data: 
```


### [Text Parts](#text-parts)

Text content is streamed using a start/delta/end pattern with unique IDs for each text block.

#### [Text Start Part](#text-start-part)

Indicates the beginning of a text block.

Format: Server-Sent Event with JSON object

Example:



``` undefined
data: 
```


#### [Text Delta Part](#text-delta-part)

Contains incremental text content for the text block.

Format: Server-Sent Event with JSON object

Example:



``` undefined
data: 
```


#### [Text End Part](#text-end-part)

Indicates the completion of a text block.

Format: Server-Sent Event with JSON object

Example:



``` undefined
data: 
```


### [Reasoning Parts](#reasoning-parts)

Reasoning content is streamed using a start/delta/end pattern with unique IDs for each reasoning block.

#### [Reasoning Start Part](#reasoning-start-part)

Indicates the beginning of a reasoning block.

Format: Server-Sent Event with JSON object

Example:



``` undefined
data: 
```


#### [Reasoning Delta Part](#reasoning-delta-part)

Contains incremental reasoning content for the reasoning block.

Format: Server-Sent Event with JSON object

Example:



``` undefined
data: 
```


#### [Reasoning End Part](#reasoning-end-part)

Indicates the completion of a reasoning block.

Format: Server-Sent Event with JSON object

Example:



``` undefined
data: 
```


### [Source Parts](#source-parts)

Source parts provide references to external content sources.

#### [Source URL Part](#source-url-part)

References to external URLs.

Format: Server-Sent Event with JSON object

Example:



``` undefined
data: 
```


#### [Source Document Part](#source-document-part)

References to documents or files.

Format: Server-Sent Event with JSON object

Example:



``` undefined
data: 
```


### [File Part](#file-part)

The file parts contain references to files with their media type.

Format: Server-Sent Event with JSON object

Example:



``` undefined
data: 
```



Custom data parts allow streaming of arbitrary structured data with type-specific handling.

Format: Server-Sent Event with JSON object where the type includes a custom suffix

Example:



``` undefined
data: }
```



### [Error Part](#error-part)

The error parts are appended to the message as they are received.

Format: Server-Sent Event with JSON object

Example:



``` undefined
data: 
```


### [Tool Input Start Part](#tool-input-start-part)

Indicates the beginning of tool input streaming.

Format: Server-Sent Event with JSON object

Example:



``` undefined
data: 
```


### [Tool Input Delta Part](#tool-input-delta-part)

Incremental chunks of tool input as it's being generated.

Format: Server-Sent Event with JSON object

Example:



``` undefined
data: 
```


### [Tool Input Available Part](#tool-input-available-part)

Indicates that tool input is complete and ready for execution.

Format: Server-Sent Event with JSON object

Example:



``` undefined
data: }
```


### [Tool Output Available Part](#tool-output-available-part)

Contains the result of tool execution.

Format: Server-Sent Event with JSON object

Example:



``` undefined
data: }
```


### [Start Step Part](#start-step-part)

A part indicating the start of a step.

Format: Server-Sent Event with JSON object

Example:



``` undefined
data: 
```


### [Finish Step Part](#finish-step-part)

A part indicating that a step (i.e., one LLM API call in the backend) has been completed.

This part is necessary to correctly process multiple stitched assistant calls, e.g. when calling tools in the backend, and using steps in `useChat` at the same time.

Format: Server-Sent Event with JSON object

Example:



``` undefined
data: 
```


### [Finish Message Part](#finish-message-part)

A part indicating the completion of a message.

Format: Server-Sent Event with JSON object

Example:



``` undefined
data: 
```


### [Stream Termination](#stream-termination)

The stream ends with a special `[DONE]` marker.

Format: Server-Sent Event with literal `[DONE]`

Example:



``` undefined
data: [DONE]
```


The data stream protocol is supported by `useChat` and `useCompletion` on the frontend and used by default. `useCompletion` only supports the `text` and `data` stream parts.

On the backend, you can use `toUIMessageStreamResponse()` from the `streamText` result object to return a streaming HTTP response.

### [UI Message Stream Example](#ui-message-stream-example)

Here is a Next.js example that uses the UI message stream protocol:












``` tsx
'use client';
import  from '@ai-sdk/react';import  from 'react';
export default function Chat()  = useChat();
  return (    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">       className="whitespace-pre-wrap">                    -$`}></div>;            }          })}        </div>      ))}
      <form        onSubmit=);          setInput('');        }}      >        <input          className="fixed dark:bg-zinc-900 bottom-0 w-full max-w-md p-2 mb-8 border border-zinc-300 dark:border-zinc-800 rounded shadow-xl"          value=          placeholder="Say something..."          onChange=        />      </form>    </div>  );}
```













``` ts
import  from '@ai-sdk/openai';import  from 'ai';
// Allow streaming responses up to 30 secondsexport const maxDuration = 30;
export async function POST(req: Request) :  = await req.json();
  const result = streamText();
  return result.toUIMessageStreamResponse();}
```

















On this page








































































































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.