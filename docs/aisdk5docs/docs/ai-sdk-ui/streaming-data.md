AI SDK 5 is available now.










Menu






















































































































































































































































































































































# [Streaming Custom Data](#streaming-custom-data)

It is often useful to send additional data alongside the model's response. For example, you may want to send status information, the message ids after storing them, or references to content that the language model is referring to.

The AI SDK provides several helpers that allows you to stream additional data to the client and attach it to the `UIMessage` parts array:

- `createUIMessageStream`: creates a data stream
- `createUIMessageStreamResponse`: creates a response object that streams data
- `pipeUIMessageStreamToResponse`: pipes a data stream to a server response object

The data is streamed as part of the response stream using Server-Sent Events.


First, define your custom message type with data part schemas for type safety:












``` tsx
import  from 'ai';
// Define your custom message type with data part schemasexport type MyUIMessage = UIMessage<  never, // metadata type  ;    notification: ;  } // data parts type>;
```



In your server-side route handler, you can create a `UIMessageStream` and then pass it to `createUIMessageStreamResponse`:












``` tsx
import  from '@ai-sdk/openai';import  from 'ai';import type  from '@/ai/types';
export async function POST(req: Request)  = await req.json();
  const stream = createUIMessageStream<MyUIMessage>() => ,        transient: true, // This part won't be added to message history      });
      // 2. Send sources (useful for RAG use cases)      writer.write(,      });
      // 3. Send data parts with loading state      writer.write(,      });
      const result = streamText(,          });
          // 5. Send completion notification (transient)          writer.write(,            transient: true, // Won't be added to message history          });        },      });
      writer.merge(result.toUIMessageStream());    },  });
  return createUIMessageStreamResponse();}
```





You can also send stream data from custom backends, e.g. Python / FastAPI, using the [UI Message Stream Protocol](stream-protocol.html#ui-message-stream-protocol).



## [Types of Streamable Data](#types-of-streamable-data)


Regular data parts are added to the message history and appear in `message.parts`:



``` tsx
writer.write(,});
```


### [Sources](#sources)

Sources are useful for RAG implementations where you want to show which documents or URLs were referenced:



``` tsx
writer.write(,});
```



Transient parts are sent to the client but not added to the message history. They are only accessible via the `onData` useChat handler:



``` tsx
// serverwriter.write(,  transient: true, // Won't be added to message history});
// clientconst [notification, setNotification] = useState();
const  = useChat() => );    }  },});
```



When you write to a data part with the same ID, the client automatically reconciles and updates that part. This enables powerful dynamic experiences like:

- **Collaborative artifacts** - Update code, documents, or designs in real-time
- **Progressive data loading** - Show loading states that transform into final results
- **Live status updates** - Update progress bars, counters, or status indicators
- **Interactive components** - Build UI elements that evolve based on user interaction

The reconciliation happens automatically - simply use the same `id` when writing to the stream.



The `onData` callback is essential for handling streaming data, especially transient parts:












``` tsx
import  from '@ai-sdk/react';import type  from '@/ai/types';
const  = useChat<MyUIMessage>(
```


**Important:** Transient data parts are **only** available through the `onData` callback. They will not appear in the `message.parts` array since they're not added to message history.


You can filter and render data parts from the message parts array:












``` tsx
const result = (  <>    >                 className="weather-widget">              ...</>              ) : (                <>                  Weather in :                 </>              )}            </div>          ))}
                ></div>          ))}
                 className="source">              Source: <a href=></a>            </div>          ))}      </div>    ))}  </>);
```


### [Complete Example](#complete-example)












``` tsx
'use client';
import  from '@ai-sdk/react';import  from 'react';import type  from '@/ai/types';
export default function Chat()  = useChat<MyUIMessage>(    },  });
  const handleSubmit = (e: React.FormEvent) => );    setInput('');  };
  return (    <>      >          
                     className="weather-update">                ...</>                ) : (                  <>                    Weather in :                   </>                )}              </span>            ))}
                    ></div>            ))}        </div>      ))}
      <form onSubmit=>        <input          value=          onChange=          placeholder="Ask about the weather..."        />        <button type="submit">Send</button>      </form>    </>  );}
```


## [Use Cases](#use-cases)

- **RAG Applications** - Stream sources and retrieved documents
- **Real-time Status** - Show loading states and progress updates
- **Collaborative Tools** - Stream live updates to shared artifacts
- **Analytics** - Send usage data without cluttering message history
- **Notifications** - Display temporary alerts and status messages


Both [message metadata](message-metadata.html) and data parts allow you to send additional information alongside messages, but they serve different purposes:

### [Message Metadata](#message-metadata)

Message metadata is best for **message-level information** that describes the message as a whole:

- Attached at the message level via `message.metadata`
- Sent using the `messageMetadata` callback in `toUIMessageStreamResponse`
- Ideal for: timestamps, model info, token usage, user context
- Type-safe with custom metadata types



``` ts
// Server: Send metadata about the messagereturn result.toUIMessageStreamResponse() => ;    }  },});
```



Data parts are best for streaming **dynamic arbitrary data**:

- Added to the message parts array via `message.parts`
- Streamed using `createUIMessageStream` and `writer.write()`
- Can be reconciled/updated using the same ID
- Support transient parts that don't persist
- Ideal for: dynamic content, loading states, interactive components



``` ts
// Server: Stream data as part of message contentwriter.write(,});
```


For more details on message metadata, see the [Message Metadata documentation](message-metadata.html).
















On this page
































































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.