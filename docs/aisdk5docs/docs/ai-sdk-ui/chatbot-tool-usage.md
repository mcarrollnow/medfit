AI SDK 5 is available now.










Menu






















































































































































































































































































































































# [Chatbot Tool Usage](#chatbot-tool-usage)

With [`useChat`](../reference/ai-sdk-ui/use-chat.html) and [`streamText`](../reference/ai-sdk-core/stream-text.html), you can use tools in your chatbot application. The AI SDK supports three types of tools in this context:

1.  Automatically executed server-side tools
2.  Automatically executed client-side tools
3.  Tools that require user interaction, such as confirmation dialogs

The flow is as follows:

1.  The user enters a message in the chat UI.
2.  The message is sent to the API route.
3.  In your server side route, the language model generates tool calls during the `streamText` call.
4.  All tool calls are forwarded to the client.
5.  Server-side tools are executed using their `execute` method and their results are forwarded to the client.
6.  Client-side tools that should be automatically executed are handled with the `onToolCall` callback. You must call `addToolResult` to provide the tool result.
7.  Client-side tool that require user interactions can be displayed in the UI. The tool calls and results are available as tool invocation parts in the `parts` property of the last assistant message.
8.  When the user interaction is done, `addToolResult` can be used to add the tool result to the chat.
9.  The chat can be configured to automatically submit when all tool results are available using `sendAutomaticallyWhen`. This triggers another iteration of this flow.

The tool calls and tool executions are integrated into the assistant message as typed tool parts. A tool part is at first a tool call, and then it becomes a tool result when the tool is executed. The tool result contains all information about the tool call as well as the result of the tool execution.




Tool result submission can be configured using the `sendAutomaticallyWhen` option. You can use the `lastAssistantMessageIsCompleteWithToolCalls` helper to automatically submit when all tool results are available. This simplifies the client-side code while still allowing full control when needed.



## [Example](#example)

In this example, we'll use three tools:

- `getWeatherInformation`: An automatically executed server-side tool that returns the weather in a given city.
- `askForConfirmation`: A user-interaction client-side tool that asks the user for confirmation.
- `getLocation`: An automatically executed client-side tool that returns a random city.

### [API route](#api-route)












``` tsx
import  from '@ai-sdk/openai';import  from 'ai';import  from 'zod';
// Allow streaming responses up to 30 secondsexport const maxDuration = 30;
export async function POST(req: Request) :  = await req.json();
  const result = streamText(),        execute: async (: ) => ,      },      // client-side tool that starts user interaction:      askForConfirmation: ),      },      // client-side tool that is automatically executed on the client:      getLocation: ),      },    },  });
  return result.toUIMessageStreamResponse();}
```


### [Client-side page](#client-side-page)

The client-side page uses the `useChat` hook to create a chatbot application with real-time message streaming. Tool calls are displayed in the chat UI as typed tool parts. Please make sure to render the messages using the `parts` property of the message.

There are three things worth mentioning:

1.  The [`onToolCall`](../reference/ai-sdk-ui/use-chat.html#on-tool-call) callback is used to handle client-side tools that should be automatically executed. In this example, the `getLocation` tool is a client-side tool that returns a random city. You call `addToolResult` to provide the result (without `await` to avoid potential deadlocks).



    Always check `if (toolCall.dynamic)` first in your `onToolCall` handler. Without this check, TypeScript will throw an error like: `Type 'string' is not assignable to type '"toolName1" | "toolName2"'` when you try to use `toolCall.toolName` in `addToolResult`.



2.  The [`sendAutomaticallyWhen`](../reference/ai-sdk-ui/use-chat.html#send-automatically-when) option with `lastAssistantMessageIsCompleteWithToolCalls` helper automatically submits when all tool results are available.

3.  The `parts` array of assistant messages contains tool parts with typed names like `tool-askForConfirmation`. The client-side tool `askForConfirmation` is displayed in the UI. It asks the user for confirmation and displays the result once the user confirms or denies the execution. The result is added to the chat using `addToolResult` with the `tool` parameter for type safety.












``` tsx
'use client';
import  from '@ai-sdk/react';import  from 'ai';import  from 'react';
export default function Chat()  = useChat(),
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
    // run client-side tools that are automatically executed:    async onToolCall() 
      if (toolCall.toolName === 'getLocation') );      }    },  });  const [input, setInput] = useState('');
  return (    <>      >          <strong>: `}</strong>          >Loading confirmation request...</div>                    );                  case 'input-available':                    return (                      <div key=>                                                <div>                          <button                            onClick=)                            }                          >                            Yes                          </button>                          <button                            onClick=)                            }                          >                            No                          </button>                        </div>                      </div>                    );                  case 'output-available':                    return (                      <div key=>                        Location access allowed:                       </div>                    );                  case 'output-error':                    return <div key=>Error: </div>;                }                break;              }
              case 'tool-getLocation': >Preparing location request...</div>                    );                  case 'input-available':                    return <div key=>Getting location...</div>;                  case 'output-available':                    return <div key=>Location: </div>;                  case 'output-error':                    return (                      <div key=>                        Error getting location:                       </div>                    );                }                break;              }
              case 'tool-getWeatherInformation': ></pre>                    );                  case 'input-available':                    return (                      <div key=>                        Getting weather information for ...                      </div>                    );                  case 'output-available':                    return (                      <div key=>                        Weather in :                       </div>                    );                  case 'output-error':                    return (                      <div key=>                        Error getting weather for :                                              </div>                    );                }                break;              }            }          })}          <br />        </div>      ))}
      <form        onSubmit=);            setInput('');          }        }}      >        <input value= onChange= />      </form>    </>  );}
```


### [Error handling](#error-handling)

Sometimes an error may occur during client-side tool execution. Use the `addToolResult` method with a `state` of `output-error` and `errorText` value instead of `output` record the error.












``` tsx
'use client';
import  from '@ai-sdk/react';import  from 'ai';import  from 'react';
export default function Chat()  = useChat(),
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
    // run client-side tools that are automatically executed:    async onToolCall() 
      if (toolCall.toolName === 'getWeatherInformation') );        } catch (err) );        }      }    },  });}
```


## [Dynamic Tools](#dynamic-tools)

When using dynamic tools (tools with unknown types at compile time), the UI parts use a generic `dynamic-tool` type instead of specific tool types:












``` tsx
`) types      case 'tool-getWeatherInformation':        return <WeatherDisplay part= />;
      // Dynamic tools use generic `dynamic-tool` type      case 'dynamic-tool':        return (          <div key=>            <h4>Tool: </h4>            </pre>            )}            </pre>            )}            </div>            )}          </div>        );    }  });}
```


Dynamic tools are useful when integrating with:

- MCP (Model Context Protocol) tools without schemas
- User-defined functions loaded at runtime
- External tool providers

## [Tool call streaming](#tool-call-streaming)

Tool call streaming is **enabled by default** in AI SDK 5.0, allowing you to stream tool calls while they are being generated. This provides a better user experience by showing tool inputs as they are generated in real-time.












``` tsx
export async function POST(req: Request) :  = await req.json();
  const result = streamText();
  return result.toUIMessageStreamResponse();}
```


With tool call streaming enabled, partial tool calls are streamed as part of the data stream. They are available through the `useChat` hook. The typed tool parts of assistant messages will also contain partial tool calls. You can use the `state` property of the tool part to render the correct UI.












``` tsx
export default function Chat() >          </pre>;                  case 'input-available':                    return <pre></pre>;                  case 'output-available':                    return <pre></pre>;                  case 'output-error':                    return <div>Error: </div>;                }            }          })}        </div>      ))}    </>  );}
```


## [Step start parts](#step-start-parts)

When you are using multi-step tool calls, the AI SDK will add step start parts to the assistant messages. If you want to display boundaries between tool calls, you can use the `step-start` parts as follows:












``` tsx
// ...// where you render the message parts:message.parts.map((part, index) =>  className="text-gray-500">          <hr className="my-2 border-gray-300" />        </div>      ) : null;    case 'text':    // ...    case 'tool-askForConfirmation':    case 'tool-getLocation':    case 'tool-getWeatherInformation':    // ...  }});// ...
```


## [Server-side Multi-Step Calls](#server-side-multi-step-calls)

You can also use multi-step calls on the server-side with `streamText`. This works when all invoked tools have an `execute` function on the server side.












``` tsx
import  from '@ai-sdk/openai';import  from 'ai';import  from 'zod';
export async function POST(req: Request) :  = await req.json();
  const result = streamText(),        // tool has execute function:        execute: async (: ) => ,      },    },    stopWhen: stepCountIs(5),  });
  return result.toUIMessageStreamResponse();}
```


## [Errors](#errors)

Language models can make errors when calling tools. By default, these errors are masked for security reasons, and show up as "An error occurred" in the UI.

To surface the errors, you can use the `onError` function when calling `toUIMessageResponse`.



``` tsx
export function errorHandler(error: unknown) 
  if (typeof error === 'string') 
  if (error instanceof Error) 
  return JSON.stringify(error);}
```




``` tsx
const result = streamText();
return result.toUIMessageStreamResponse();
```


In case you are using `createUIMessageResponse`, you can use the `onError` function when calling `toUIMessageResponse`:



``` tsx
const response = createUIMessageResponse(,  onError: error => `Custom error: $`,});
```

















On this page










































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.