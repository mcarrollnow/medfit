AI SDK 5 is available now.










Menu


























































































































































































































































































































































































# [Human-in-the-Loop with Next.js](#human-in-the-loop-with-nextjs)

When building agentic systems, it's important to add human-in-the-loop (HITL) functionality to ensure that users can approve actions before the system executes them. This recipe will describe how to [build a low-level solution](#adding-a-confirmation-step) and then provide an [example abstraction](#building-your-own-abstraction) you could implement and customise based on your needs.

## [Background](#background)

To understand how to implement this functionality, let's look at how tool calling works in a simple Next.js chatbot application with the AI SDK.

On the frontend, use the `useChat` hook to manage the message state and user interaction.












``` tsx
'use client';
import  from '@ai-sdk/react';import  from 'ai';import  from 'react';
export default function Chat()  = useChat(),  });  const [input, setInput] = useState('');
  return (    <div>      <div>        >            <strong>: `}</strong>            ></div>;              }            })}            <br />          </div>        ))}      </div>
      <form        onSubmit=);            setInput('');          }        }}      >        <input          value=          placeholder="Say something..."          onChange=        />      </form>    </div>  );}
```


On the backend, create a route handler (API Route) that returns a `UIMessageStreamResponse`. Within the execute function of `createUIMessageStream`, call `streamText` and pass in the converted `messages` (sent from the client). Finally, merge the resulting generation into the `UIMessageStream`.












``` ts
import  from '@ai-sdk/openai';import  from 'ai';import  from 'zod';
export async function POST(req: Request) :  = await req.json();
  const stream = createUIMessageStream() => ),            outputSchema: z.string(),            execute: async () => ,          }),        },        stopWhen: stepCountIs(5),      });
      writer.merge(result.toUIMessageStream());    },  });
  return createUIMessageStreamResponse();}
```


What happens if you ask the LLM for the weather in New York?

The LLM has one tool available, `weather`, which requires a `location` to run. This tool will, as stated in the tool's `description`, "show the weather in a given city to the user". If the LLM decides that the `weather` tool could answer the user's query, it would generate a `ToolCall`, extracting the `location` from the context. The AI SDK would then run the associated `execute` function, passing in the `location` parameter, and finally returning a tool result.

To introduce a HITL step you will add a confirmation step to this process in between the tool call and the tool result.

## [Adding a Confirmation Step](#adding-a-confirmation-step)

At a high level, you will:

1.  Intercept tool calls before they are executed
2.  Render a confirmation UI with Yes/No buttons
3.  Send a temporary tool result indicating whether the user confirmed or declined
4.  On the server, check for the confirmation state in the tool result:
    - If confirmed, execute the tool and update the result
    - If declined, update the result with an error message
5.  Send the updated tool result back to the client to maintain state consistency

### [Forward Tool Call To The Client](#forward-tool-call-to-the-client)

To implement HITL functionality, you start by omitting the `execute` function from the tool definition. This allows the frontend to intercept the tool call and handle the responsibility of adding the final tool result to the tool call.












``` ts
import  from '@ai-sdk/openai';import  from 'ai';import  from 'zod';
export async function POST(req: Request)  = await req.json();
  const stream = createUIMessageStream() => ),            outputSchema: z.string(),            // execute function removed to stop automatic execution          }),        },        stopWhen: stepCountIs(5),      });
      writer.merge(result.toUIMessageStream()); // pass in original messages to avoid duplicate assistant messages    },  });
  return createUIMessageStreamResponse();}
```





Each tool call must have a corresponding tool result. If you do not add a tool result, all subsequent generations will fail.



### [Intercept Tool Call](#intercept-tool-call)

On the frontend, you map through the messages, either rendering the message content or checking for tool invocations and rendering custom UI.

You can check if the tool requiring confirmation has been called and, if so, present options to either confirm or deny the proposed tool call. This confirmation is done using the `addToolResult` function to create a tool result and append it to the associated tool call.












``` tsx
'use client';
import  from '@ai-sdk/react';import  from 'ai';import  from 'react';
export default function Chat()  = useChat(),  });  const [input, setInput] = useState('');
  return (    <div>      <div>        >            <strong>: `}</strong>            ></div>;              }              if (isToolUIPart(part)) >                      Get weather information for ?                      <div>                        <button                          onClick=);                            sendMessage();                          }}                        >                          Yes                        </button>                        <button                          onClick=);                            sendMessage();                          }}                        >                          No                        </button>                      </div>                    </div>                  );                }              }            })}            <br />          </div>        ))}      </div>
      <form        onSubmit=);            setInput('');          }        }}      >        <input          value=          placeholder="Say something..."          onChange=        />      </form>    </div>  );}
```





The `sendMessage()` function after `addToolResult` will trigger a call to your route handler.



### [Handle Confirmation Response](#handle-confirmation-response)

Adding a tool result and sending the message will trigger another call to your route handler. Before sending the new messages to the language model, you pull out the last message and map through the message parts to see if the tool requiring confirmation was called and whether it's in a "result" state. If those conditions are met, you check the confirmation state (the tool result state that you set on the frontend with the `addToolResult` function).












``` ts
import  from '@ai-sdk/openai';import  from 'ai';import  from 'zod';
export async function POST(req: Request) :  = await req.json();
  const stream = createUIMessageStream() =>           const toolName = getToolName(part);          // return if tool isn't weather tool or in a output-available state          if (            toolName !== 'getWeatherInformation' ||            part.state !== 'output-available'          ) 
          // switch through tool output states (set on the frontend)          switch (part.output) );
              // update the message part:              return ;            }            case 'No, denied.': );
              // update the message part:              return ;            }            default:              return part;          }        }) ?? [],      );
      const result = streamText(),            outputSchema: z.string(),          }),        },        stopWhen: stepCountIs(5),      });
      writer.merge(result.toUIMessageStream());    },  });
  return createUIMessageStreamResponse();}
async function executeWeatherTool(: ) 
```


In this implementation, you use simple strings like "Yes, the user confirmed" or "No, the user declined" as states. If confirmed, you execute the tool. If declined, you do not execute the tool. In both cases, you update the tool result from the arbitrary data you sent with the `addToolResult` function to either the result of the execute function or an "Execution declined" statement. You send the updated tool result back to the frontend to maintain state synchronization.

After handling the tool result, your API route continues. This triggers another generation with the updated tool result, allowing the LLM to continue attempting to solve the query.

## [Building your own abstraction](#building-your-own-abstraction)

The solution above is low-level and not very friendly to use in a production environment. You can build your own abstraction using these concepts

## [Move tool declarations to their own file](#move-tool-declarations-to-their-own-file)

First, you will need to move tool declarations to their own file:












``` ts
import  from 'ai';import  from 'zod';
const getWeatherInformation = tool(),  outputSchema: z.string(), // must define outputSchema  // no execute function, we want human in the loop});
const getLocalTime = tool(),  outputSchema: z.string(),  // including execute function -> no confirmation required  execute: async () => `);    return '10am';  },});
export const tools =  satisfies ToolSet;
```


In this file, you have two tools, `getWeatherInformation` (requires confirmation to run) and `getLocalTime`.

### [Create Type Definitions](#create-type-definitions)

Create a types file to define a custom message type:












``` ts
import  from 'ai';import  from './tools';
export type MyTools = InferUITools<typeof tools>;
// Define custom message typeexport type HumanInTheLoopUIMessage = UIMessage<  never, // metadata type  UIDataTypes, // data parts type  MyTools // tools type>;
```


### [Create Utility Functions](#create-utility-functions)












``` ts
import  from 'ai';import  from './types';
// Approval string to be shared across frontend and backendexport const APPROVAL =  as const;
function isValidToolName<K extends PropertyKey, T extends object>(  key: K,  obj: T,): key is K & keyof T 
/** * Processes tool invocations where human input is required, executing tools when authorized. * * @param options - The function options * @param options.tools - Map of tool names to Tool instances that may expose execute functions * @param options.writer - UIMessageStream writer for sending results back to the client * @param options.messages - Array of messages to process * @param executionFunctions - Map of tool names to execute functions * @returns Promise resolving to the processed messages */export async function processToolCalls<  Tools extends ToolSet,  ExecutableTools extends       ? never      : Tool]: Tools[Tool];  },>(  : ,  executeFunctions: ,): Promise<HumanInTheLoopUIMessage[]> 
        const toolInstance = executeFunctions[toolName] as Tool['execute'];        if (toolInstance) );        } else       } else if (part.output === APPROVAL.NO)  else 
      // Forward updated tool result to the client.      writer.write();
      // Return updated toolInvocation with the actual result.      return ;    }),  );
  // Finally return the processed messages  return [...messages.slice(0, -1), ];}
export function getToolsRequiringConfirmation<T extends ToolSet>(  tools: T,): string[] ) as string[];}
```


In this file, you first declare the confirmation strings as constants so we can share them across the frontend and backend (reducing possible errors). Next, we create function called `processToolCalls` which takes in the `messages`, `tools`, and the `writer`. It also takes in a second parameter, `executeFunction`, which is an object that maps `toolName` to the functions that will be run upon human confirmation. This function is strongly typed so:

- it autocompletes `executableTools` - these are tools without an execute function
- provides full type-safety for arguments and options available within the `execute` function

Unlike the low-level example, this will return a modified array of `messages` that can be passed directly to the LLM.

Finally, you declare a function called `getToolsRequiringConfirmation` that takes your tools as an argument and then will return the names of your tools without execute functions (in an array of strings). This avoids the need to manually write out and check for `toolName`'s on the frontend.

### [Update Route Handler](#update-route-handler)

Update your route handler to use the `processToolCalls` utility function.












``` ts
import  from '@ai-sdk/openai';import  from 'ai';import  from './utils';import  from './tools';import  from './types';
// Allow streaming responses up to 30 secondsexport const maxDuration = 30;
export async function POST(req: Request) :  =    await req.json();
  const stream = createUIMessageStream() => ,        ) =>  is $.`;          },        },      );
      const result = streamText();
      writer.merge(        result.toUIMessageStream(),      );    },  });
  return createUIMessageStreamResponse();}
```


### [Update Frontend](#update-frontend)

Finally, update the frontend to use the new `getToolsRequiringConfirmation` function and the `APPROVAL` values:












``` tsx
'use client';
import  from '@ai-sdk/react';import  from 'ai';import  from '../api/chat/tools';import  from '../api/chat/utils';import  from 'react';import  from '../api/chat/types';
export default function Chat()  =    useChat<HumanInTheLoopUIMessage>(),    });  const [input, setInput] = useState('');
  const toolsRequiringConfirmation = getToolsRequiringConfirmation(tools);
  // used to disable input while confirmation is pending  const pendingToolCallConfirmation = messages.some(m =>    m.parts?.some(      part =>        isToolUIPart(part) &&        part.state === 'input-available' &&        toolsRequiringConfirmation.includes(getToolName(part)),    ),  );
  return (    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">       className="whitespace-pre-wrap">          <strong>: `}</strong>          ></div>;            }            if (isToolUIPart<MyTools>(part)) >                    Run <span className=></span>                    with args: <br />                    <span className=>                                          </span>                    <div className="flex gap-2 pt-2">                      <button                        className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"                        onClick=);                          sendMessage();                        }}                      >                        Yes                      </button>                      <button                        className="px-4 py-2 font-bold text-white bg-red-500 rounded hover:bg-red-700"                        onClick=);                          sendMessage();                        }}                      >                        No                      </button>                    </div>                  </div>                );              }            }          })}          <br />        </div>      ))}
      <form        onSubmit=);            setInput('');          }        }}      >        <input          disabled=          className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-zinc-300 rounded shadow-xl"          value=          placeholder="Say something..."          onChange=        />      </form>    </div>  );}
```


## [Full Example](#full-example)

















On this page





















































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.