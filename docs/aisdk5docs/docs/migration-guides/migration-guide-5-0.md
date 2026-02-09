AI SDK 5 is available now.










Menu










































































































































































































































































































































































































# [Migrate AI SDK 4.0 to 5.0](#migrate-ai-sdk-40-to-50)

## [Recommended Migration Process](#recommended-migration-process)

1.  Backup your project. If you use a versioning control system, make sure all previous versions are committed.
2.  Upgrade to AI SDK 5.0.
3.  Automatically migrate your code using one of these approaches:
    - Use the [AI SDK 5 Migration MCP Server](#ai-sdk-5-migration-mcp-server) for AI-assisted migration in Cursor or other MCP-compatible coding agents
    - Use [codemods](#codemods) to automatically transform your code
4.  Follow the breaking changes guide below.
5.  Verify your project is working as expected.
6.  Commit your changes.

## [AI SDK 5 Migration MCP Server](#ai-sdk-5-migration-mcp-server)


To get started, create or edit `.cursor/mcp.json` in your project:



``` json
  }}
```


After saving, open the command palette (Cmd+Shift+P on macOS, Ctrl+Shift+P on Windows/Linux) and search for "View: Open MCP Settings". Verify the new server appears and is toggled on.

Then use this prompt:



``` undefined
Please migrate this project to AI SDK 5 using the ai-sdk-5-migration mcp server. Start by creating a checklist.
```



## [AI SDK 5.0 Package Versions](#ai-sdk-50-package-versions)

You need to update the following packages to the following versions in your `package.json` file(s):

- `ai` package: `5.0.0`
- `@ai-sdk/provider` package: `2.0.0`
- `@ai-sdk/provider-utils` package: `3.0.0`
- `@ai-sdk/*` packages: `2.0.0` (other `@ai-sdk` packages)

Additionally, you need to update the following peer dependencies:

- `zod` package: `4.1.8` or later (recommended to avoid TypeScript performance issues)

An example upgrade command would be:



``` undefined
npm install ai @ai-sdk/react @ai-sdk/openai zod@^4.1.8
```





If you encounter TypeScript performance issues after upgrading, ensure you're using Zod 4.1.8 or later. If the issue persists, update your `tsconfig.json` to use `moduleResolution: "nodenext"`. See the [TypeScript performance troubleshooting guide](../troubleshooting/typescript-performance-zod.html) for more details.



## [Codemods](#codemods)

The AI SDK provides Codemod transformations to help upgrade your codebase when a feature is deprecated, removed, or otherwise changed.

Codemods are transformations that run on your codebase automatically. They allow you to easily apply many changes without having to manually go through every file.




Codemods are intended as a tool to help you with the upgrade process. They may not cover all of the changes you need to make. You may need to make additional changes manually.



You can run all codemods provided as part of the 5.0 upgrade process by running the following command from the root of your project:



``` sh
npx @ai-sdk/codemod upgrade
```


To run only the v5 codemods (v4 → v5 migration):



``` sh
npx @ai-sdk/codemod v5
```


Individual codemods can be run by specifying the name of the codemod:



``` sh
npx @ai-sdk/codemod <codemod-name> <path>
```


For example, to run a specific v5 codemod:



``` sh
npx @ai-sdk/codemod v5/rename-format-stream-part src/
```



## [AI SDK Core Changes](#ai-sdk-core-changes)

### [generateText and streamText Changes](#generatetext-and-streamtext-changes)

#### [Maximum Output Tokens](#maximum-output-tokens)

The `maxTokens` parameter has been renamed to `maxOutputTokens` for clarity.












``` tsx
const result = await generateText();
```













``` tsx
const result = await generateText();
```


### [Message and Type System Changes](#message-and-type-system-changes)

#### [Core Type Renames](#core-type-renames)

##### [`CoreMessage` → `ModelMessage`](#coremessage--modelmessage)












``` tsx
import  from 'ai';
```













``` tsx
import  from 'ai';
```


##### [`Message` → `UIMessage`](#message--uimessage)












``` tsx
import  from 'ai';
```













``` tsx
import  from 'ai';
```


##### [`convertToCoreMessages` → `convertToModelMessages`](#converttocoremessages--converttomodelmessages)












``` tsx
import  from 'ai';import  from '@ai-sdk/openai';
const result = await streamText();
```













``` tsx
import  from 'ai';import  from '@ai-sdk/openai';
const result = await streamText();
```





For more information about model messages, see the [Model Message reference](../reference/ai-sdk-core/model-message.html).



### [UIMessage Changes](#uimessage-changes)

#### [Content → Parts Array](#content--parts-array)

For `UIMessage`s (previously called `Message`), the `.content` property has been replaced with a `parts` array structure.












``` tsx
import  from 'ai'; // v4 Message type
// Messages (useChat) - had content propertyconst message: Message = ;
```













``` tsx
import  from 'ai';
// UIMessages (useChat) - now use parts arrayconst uiMessage: UIMessage = ],};
```



The `data` role has been removed from UI messages.












``` tsx
const message = ,};
```













``` tsx
// V5: Use UI message streams with custom data partsconst stream = createUIMessageStream() ,    });  },});
```


#### [UIMessage Reasoning Structure](#uimessage-reasoning-structure)

The reasoning property on UI messages has been moved to parts.












``` tsx
const message: Message = ;
```













``` tsx
const message: UIMessage = ,    ,  ],};
```


#### [Reasoning Part Property Rename](#reasoning-part-property-rename)

The `reasoning` property on reasoning UI parts has been renamed to `text`.












``` tsx
 className="reasoning-display">                  </div>      );    }  });}
```













``` tsx
 className="reasoning-display">                  </div>      );    }  });}
```


### [File Part Changes](#file-part-changes)

File parts now use `.url` instead of `.data` and `.mimeType`.












``` tsx
>      ></div>;        } else if (part.type === 'file' && part.mimeType.startsWith('image/'))               src=;base64,$`}            />          );        }      })}    </div>  ));}
```













``` tsx
>      ></div>;        } else if (          part.type === 'file' &&          part.mediaType.startsWith('image/')        )  src= />;        }      })}    </div>  ));}
```



The `StreamData` class has been completely removed and replaced with UI message streams for custom data.












``` tsx
import  from 'ai';
const streamData = new StreamData();streamData.append('custom-data');streamData.close();
```













``` tsx
import  from 'ai';
const stream = createUIMessageStream() );
    // Can merge with LLM streams    const result = streamText();
    writer.merge(result.toUIMessageStream());  },});
return createUIMessageStreamResponse();
```



The `writeMessageAnnotation` and `writeData` methods from `DataStreamWriter` have been removed. Instead, use custom data parts with the new `UIMessage` stream architecture.












``` tsx
import  from '@ai-sdk/openai';import  from 'ai';
export async function POST(req: Request)  = await req.json();
  return createDataStreamResponse();        },        onFinish() );
          dataStream.writeData('call completed');        },      });
      result.mergeIntoDataStream(dataStream);    },  });}
```













``` tsx
import  from '@ai-sdk/openai';import  from 'ai';
export async function POST(req: Request)  = await req.json();
  const stream = createUIMessageStream() => ,      });
      const result = streamText(,          });        },        onFinish() ,          });        },      });
      writer.merge(result.toUIMessageStream());    },  });
  return createUIMessageStreamResponse();}
```





For more detailed information about streaming custom data in v5, see the [Streaming Data guide](../ai-sdk-ui/streaming-data.html).




The `providerMetadata` input parameter has been renamed to `providerOptions`. Note that the returned metadata in results is still called `providerMetadata`.












``` tsx
const result = await generateText(,  },});
```













``` tsx
const result = await generateText(,  },});
// Returned metadata still uses providerMetadata:console.log(result.providerMetadata?.openai);
```


#### [Tool Definition Changes (parameters → inputSchema)](#tool-definition-changes-parameters--inputschema)

Tool definitions have been updated to use `inputSchema` instead of `parameters` and error classes have been renamed.












``` tsx
import  from 'ai';
const weatherTool = tool(),  execute: async () => `;  },});
```













``` tsx
import  from 'ai';
const weatherTool = tool(),  execute: async () => `;  },});
```


#### [Tool Result Content: experimental_toToolResultContent → toModelOutput](#tool-result-content-experimental_totoolresultcontent--tomodeloutput)

The `experimental_toToolResultContent` option has been renamed to `toModelOutput` and is no longer experimental.












``` tsx
const screenshotTool = tool(),  execute: async () => ,  experimental_toToolResultContent: result => [],});
```













``` tsx
const screenshotTool = tool(),  execute: async () => ,  toModelOutput: result => (],  }),});
```


### [Tool Property Changes (args/result → input/output)](#tool-property-changes-argsresult--inputoutput)

Tool call and result properties have been renamed for better consistency with schemas.












``` tsx
// Tool calls used "args" and "result"for await (const part of result.fullStream) }
```













``` tsx
// Tool calls now use "input" and "output"for await (const part of result.fullStream) }
```


### [Tool Execution Error Handling](#tool-execution-error-handling)

The `ToolExecutionError` class has been removed. Tool execution errors now appear as `tool-error` content parts in the result steps, enabling automated LLM roundtrips in multi-step scenarios.












``` tsx
import  from 'ai';
try );} catch (error) }
```













``` tsx
// Tool execution errors now appear in result stepsconst  = await generateText();
// check for tool errors in the stepsconst toolErrors = steps.flatMap(step =>  step.content.filter(part => part.type === 'tool-error'),);
toolErrors.forEach(toolError => );
```


For streaming scenarios, tool execution errors appear as `tool-error` parts in the stream, while other errors appear as `error` parts.

### [Tool Call Streaming Now Default (toolCallStreaming Removed)](#tool-call-streaming-now-default-toolcallstreaming-removed)

The `toolCallStreaming` option has been removed in AI SDK 5.0. Tool call streaming is now always enabled by default.












``` tsx
const result = streamText(,});
```













``` tsx
const result = streamText(,});
```


### [Tool Part Type Changes (UIMessage)](#tool-part-type-changes-uimessage)

In v5, UI tool parts use typed naming: `tool-$` instead of generic types.












``` tsx
// Generic tool-invocation type</div>;    }  });}
```













``` tsx
// Type-safe tool parts with specific names  });}
```


### [Dynamic Tools Support](#dynamic-tools-support)

AI SDK 5.0 introduces dynamic tools for handling tools with unknown types at development time, such as MCP tools without schemas or user-defined functions at runtime.

#### [New dynamicTool Helper](#new-dynamictool-helper)

The new `dynamicTool` helper function allows you to define tools where the input and output types are not known at compile time.












``` tsx
import  from 'ai';import  from 'zod';
// Define a dynamic toolconst runtimeTool = dynamicTool(),  execute: async input => ` };  },});
```


#### [MCP Tools Without Schemas](#mcp-tools-without-schemas)

MCP tools that don't provide schemas are now automatically treated as dynamic tools:












``` tsx
import  from 'ai';
const client = new MCPClient();const tools = await client.getTools();
// Tools without schemas are now 'dynamic' type// and won't break type inference when mixed with static tools
```


#### [Type-Safe Handling with Mixed Tools](#type-safe-handling-with-mixed-tools)

When using both static and dynamic tools together, use the `dynamic` flag for type narrowing:












``` tsx
const result = await generateText(),  },  onStepFinish: step => 
      // Static tools have full type inference      switch (toolCall.toolName)     }  },});
```


#### [New dynamic-tool UI Part](#new-dynamic-tool-ui-part)

UI messages now include a `dynamic-tool` part type for rendering dynamic tool invocations:












``` tsx
</div>;
      // Dynamic tools use the generic dynamic-tool type      case 'dynamic-tool':        return (          <div>            Dynamic tool:             <pre></pre>          </div>        );    }  });}
```


#### [Breaking Change: Type Narrowing Required for Tool Calls and Results](#breaking-change-type-narrowing-required-for-tool-calls-and-results)

When iterating over `toolCalls` and `toolResults`, you now need to check the `dynamic` flag first for proper type narrowing:












``` tsx
// Direct type checking worked without dynamic flagonStepFinish: step =>   }};
```













``` tsx
// Must check dynamic flag first for type narrowingonStepFinish: step => 
    // Now TypeScript knows it's a static tool    switch (toolCall.toolName)   }};
```


### [Tool UI Part State Changes](#tool-ui-part-state-changes)

Tool UI parts now use more granular states that better represent the streaming lifecycle and error handling.












``` tsx
// Old states            </div>          );        case 'result':          return <div>Result: </div>;      }    }  });}
```













``` tsx
// New granular states</pre>;          case 'input-available':            return <div>Getting weather for ...</div>;          case 'output-available':            return <div>Weather: </div>;          case 'output-error':            return <div>Error: </div>;        }    }  });}
```


**State Changes:**

- `partial-call` → `input-streaming` (tool input being streamed)
- `call` → `input-available` (tool input complete, ready to execute)
- `result` → `output-available` (tool execution successful)
- New: `output-error` (tool execution failed)

#### [Rendering Tool Invocations (Catch-All Pattern)](#rendering-tool-invocations-catch-all-pattern)

In v4, you typically rendered tool invocations using a catch-all `tool-invocation` type. In v5, the **recommended approach is to handle each tool specifically using its typed part name (e.g., `tool-getWeather`)**. However, if you need a catch-all pattern for rendering all tool invocations the same way, you can use the `isToolUIPart` and `getToolName` helper functions as a fallback.












``` tsx
></div>;      case 'tool-invocation':        const  = part;        return (          <details key=`}>            <summary>              <span></span>                          </summary>            </pre>              </div>            ) : null}          </details>        );    }  });}
```













``` tsx
import  from 'ai';
></div>;      default:        if (isToolUIPart(part)) `}>              <summary>                <span></span>                              </summary>              </pre>                </div>              ) : null}            </details>          );        }    }  });}
```


#### [Media Type Standardization](#media-type-standardization)

`mimeType` has been renamed to `mediaType` for consistency. Both image and file types are supported in model messages.












``` tsx
const result = await generateText(,        ,        ,      ],    },  ],});
```













``` tsx
const result = await generateText(,        ,        ,      ],    },  ],});
```


### [Reasoning Support](#reasoning-support)

#### [Reasoning Text Property Rename](#reasoning-text-property-rename)

The `.reasoning` property has been renamed to `.reasoningText` for multi-step generations.












``` tsx
for (const step of steps) 
```













``` tsx
for (const step of steps) 
```


#### [Generate Text Reasoning Property Changes](#generate-text-reasoning-property-changes)

In `generateText()` and `streamText()` results, reasoning properties have been renamed.












``` tsx
const result = await generateText();
console.log(result.reasoning); // String reasoning textconsole.log(result.reasoningDetails); // Array of reasoning details
```













``` tsx
const result = await generateText();
console.log(result.reasoningText); // String reasoning textconsole.log(result.reasoning); // Array of reasoning details
```


### [Continuation Steps Removal](#continuation-steps-removal)

The `experimental_continueSteps` option has been removed from `generateText()`.












``` tsx
const result = await generateText();
```













``` tsx
const result = await generateText();
```


### [Image Generation Changes](#image-generation-changes)

Image model settings have been moved to `providerOptions`.












``` tsx
await generateImage(),  prompt,  n: 10,});
```













``` tsx
await generateImage(,  },});
```


### [Step Result Changes](#step-result-changes)

#### [Step Type Removal](#step-type-removal)

The `stepType` property has been removed from step results.












``` tsx
steps.forEach(step => });
```













``` tsx
steps.forEach((step, index) =>  else if (step.toolResults.length > 0)  else });
```


### [Step Control: maxSteps → stopWhen](#step-control-maxsteps--stopwhen)

For core functions like `generateText` and `streamText`, the `maxSteps` parameter has been replaced with `stopWhen`, which provides more flexible control over multi-step execution. The `stopWhen` parameter defines conditions for stopping the generation **when the last step contains tool results**. When multiple conditions are provided as an array, the generation stops if any condition is met.












``` tsx
// V4: Simple numeric limitconst result = await generateText();
// useChat with maxStepsconst  = useChat();
```













``` tsx
import  from 'ai';
// V5: Server-side - flexible stopping conditions with stopWhenconst result = await generateText();
// Server-side - stop when specific tool is calledconst result = await generateText();
```


**Common stopping patterns:**












``` tsx
// Stop after N steps (equivalent to old maxSteps)// Note: Only applies when the last step has tool resultsstopWhen: stepCountIs(5);
// Stop when specific tool is calledstopWhen: hasToolCall('finalizeTask');
// Multiple conditions (stops if ANY condition is met)stopWhen: [  stepCountIs(10), // Maximum 10 steps  hasToolCall('submitOrder'), // Or when order is submitted];
// Custom condition based on step contentstopWhen: () => ;
```


**Important:** The `stopWhen` conditions are only evaluated when the last step contains tool results.

#### [Usage vs Total Usage](#usage-vs-total-usage)

Usage properties now distinguish between single step and total usage.












``` tsx
// usage contained total token usage across all stepsconsole.log(result.usage);
```













``` tsx
// usage contains token usage from the final step onlyconsole.log(result.usage);// totalUsage contains total token usage across all stepsconsole.log(result.totalUsage);
```


## [AI SDK UI Changes](#ai-sdk-ui-changes)

### [Package Structure Changes](#package-structure-changes)

### [`@ai-sdk/rsc` Package Extraction](#ai-sdkrsc-package-extraction)

The `ai/rsc` export has been extracted to a separate package `@ai-sdk/rsc`.












``` tsx
import  from 'ai/rsc';
```













``` tsx
import  from '@ai-sdk/rsc';
```







### [React UI Hooks Moved to `@ai-sdk/react`](#react-ui-hooks-moved-to-ai-sdkreact)

The deprecated `ai/react` export has been removed in favor of `@ai-sdk/react`.












``` tsx
import  from 'ai/react';
```













``` tsx
import  from '@ai-sdk/react';
```





Don't forget to install the new package: `npm install @ai-sdk/react`



### [useChat Changes](#usechat-changes)

The `useChat` hook has undergone significant changes in v5, with new transport architecture, removal of managed input state, and more.

#### [maxSteps Removal](#maxsteps-removal)

The `maxSteps` parameter has been removed from `useChat`. You should now use server-side `stopWhen` conditions for multi-step tool execution control, and manually submit tool results and trigger new messages for client-side tool calls.












``` tsx
const  = useChat();
```













``` tsx
// Server-side: Use stopWhen for multi-step controlimport  from 'ai';import  from '@ai-sdk/openai';
const result = await streamText();
// Client-side: Configure automatic submissionimport  from '@ai-sdk/react';import  from 'ai';
const  = useChat() );  },});
```





Important: When using `sendAutomaticallyWhen`, don't use `await` with `addToolResult` inside `onToolCall` as it can cause deadlocks. The `await` is useful when you're not using automatic submission and need to ensure the messages are updated before manually calling `sendMessage()`.



This change provides more flexibility for handling tool calls and aligns client behavior with server-side multi-step execution patterns.

For more details on the new tool submission approach, see the [Tool Result Submission Changes](#tool-result-submission-changes) section below.

#### [Initial Messages Renamed](#initial-messages-renamed)

The `initialMessages` option has been renamed to `messages`.












``` tsx
import  from '@ai-sdk/react';
function ChatComponent(: )  = useChat();
  // your component}
```













``` tsx
import  from '@ai-sdk/react';
function ChatComponent(: )  = useChat();
  // your component}
```


#### [Sharing Chat Instances](#sharing-chat-instances)

In v4, you could share chat state between components by using the same `id` parameter in multiple `useChat` hooks.












``` tsx
// Component Aconst  = useChat();
// Component B - would share the same chat stateconst  = useChat();
```


In v5, you need to explicitly share chat instances by passing a shared `Chat` instance.












``` tsx
// e.g. Store Chat instance in React Context and create a custom hook
// Component Aconst  = useSharedChat(); // Custom hook that accesses shared Chat from context
const  = useChat();
// Component B - shares the same chat instanceconst  = useSharedChat(); // Same hook to access shared Chat from context
const  = useChat();
```


For a complete example of sharing chat state across components, see the [Share Chat State Across Components](https://ai-sdk.dev/docs/cookbook/use-shared-chat-context) recipe.

#### [Chat Transport Architecture](#chat-transport-architecture)

Configuration is now handled through transport objects instead of direct API options.












``` tsx
import  from '@ai-sdk/react';
const  = useChat(,});
```













``` tsx
import  from '@ai-sdk/react';import  from 'ai';
const  = useChat(,  }),});
```


#### [Removed Managed Input State](#removed-managed-input-state)

The `useChat` hook no longer manages input state internally. You must now manage input state manually.












``` tsx
import  from '@ai-sdk/react';
export default function Page()  = useChat();
  return (    <form onSubmit=>      <input value= onChange= />      <button type="submit">Send</button>    </form>  );}
```













``` tsx
import  from '@ai-sdk/react';import  from 'ai';import  from 'react';
export default function Page()  = useChat(),  });
  const handleSubmit = e => );    setInput('');  };
  return (    <form onSubmit=>      <input value= onChange= />      <button type="submit">Send</button>    </form>  );}
```


#### [Message Sending: `append` → `sendMessage`](#message-sending-append--sendmessage)

The `append` function has been replaced with `sendMessage` and requires structured message format.












``` tsx
const  = useChat();
// Simple text messageappend();
// With custom bodyappend(  ,   },);
```













``` tsx
const  = useChat();
// Simple text message (most common usage)sendMessage();
// Or with explicit parts arraysendMessage(],});
// With custom body (via request options)sendMessage(  ] },   },);
```


#### [Message Regeneration: `reload` → `regenerate`](#message-regeneration-reload--regenerate)

The `reload` function has been renamed to `regenerate` with enhanced functionality.












``` tsx
const  = useChat();
// Regenerate last messagereload();
```













``` tsx
const  = useChat();
// Regenerate last messageregenerate();
// Regenerate specific messageregenerate();
```


#### [onResponse Removal](#onresponse-removal)

The `onResponse` callback has been removed from `useChat` and `useCompletion`.












``` tsx
const  = useChat(,});
```













``` tsx
const  = useChat();
```


#### [Send Extra Message Fields Default](#send-extra-message-fields-default)

The `sendExtraMessageFields` option has been removed and is now the default behavior.












``` tsx
const  = useChat();
```













``` tsx
const  = useChat();
```


#### [Keep Last Message on Error Removal](#keep-last-message-on-error-removal)

The `keepLastMessageOnError` option has been removed as it's no longer needed.












``` tsx
const  = useChat();
```













``` tsx
const  = useChat();
```


#### [Chat Request Options Changes](#chat-request-options-changes)

The `data` and `allowEmptySubmit` options have been removed from `ChatRequestOptions`.












``` tsx
handleSubmit(e, ,  body: ,  allowEmptySubmit: true,});
```













``` tsx
sendMessage(  ,  ,  },);
```


#### [Request Options Type Rename](#request-options-type-rename)

`RequestOptions` has been renamed to `CompletionRequestOptions`.












``` tsx
import type  from 'ai';
```













``` tsx
import type  from 'ai';
```


#### [addToolResult Changes](#addtoolresult-changes)

In the `addToolResult` function, the `result` parameter has been renamed to `output` for consistency with other tool-related APIs.












``` tsx
const  = useChat();
// Add tool result with 'result' parameteraddToolResult();
```













``` tsx
const  = useChat();
// Add tool result with 'output' parameter and 'tool' name for type safetyaddToolResult();
```


#### [Tool Result Submission Changes](#tool-result-submission-changes)

The automatic tool result submission behavior has been updated in `useChat` and the `Chat` component. You now have more control and flexibility over when tool results are submitted.

- `onToolCall` no longer supports returning values to automatically submit tool results
- You must explicitly call `addToolResult` to provide tool results
- Use `sendAutomaticallyWhen` with `lastAssistantMessageIsCompleteWithToolCalls` helper for automatic submission
- Important: Don't use `await` with `addToolResult` inside `onToolCall` to avoid deadlocks
- The `maxSteps` parameter has been removed from the `Chat` component and `useChat` hook
- For multi-step tool execution, use server-side `stopWhen` conditions instead (see [maxSteps Removal](#maxsteps-removal))












``` tsx
const  = useChat()   },});
```













``` tsx
import  from '@ai-sdk/react';import  from 'ai';
const  = useChat() );    }  },});
```


#### [Loading State Changes](#loading-state-changes)

The deprecated `isLoading` helper has been removed in favor of `status`.












``` tsx
const  = useChat();
```













``` tsx
const  = useChat();// Use state instead of isLoading for more granular control
```


#### [Resume Stream Support](#resume-stream-support)

The resume functionality has been moved from `experimental_resume` to `resumeStream`.












``` tsx
// Resume was experimentalconst  = useChat();
```













``` tsx
const  = useChat();
```


#### [Dynamic Body Values](#dynamic-body-values)

In v4, the `body` option in useChat configuration would dynamically update with component state changes. In v5, the `body` value is only captured at the first render and remains static throughout the component lifecycle.












``` tsx
const [temperature, setTemperature] = useState(0.7);
const  = useChat(,});
```













``` tsx
const [temperature, setTemperature] = useState(0.7);
// Option 1: Use request-level configuration (Recommended)const  = useChat(),});
// Pass dynamic values at request timesendMessage(  ,  ,  },);
// Option 2: Use function configuration with useRefconst temperatureRef = useRef(temperature);temperatureRef.current = temperature;
const  = useChat(),  }),});
```


For more details on request configuration, see the [Chatbot guide](../ai-sdk-ui/chatbot.html#request-configuration).

#### [Usage Information](#usage-information)

In v4, usage information was directly accessible through the `onFinish` callback's options parameter. In v5, usage data is attached as metadata to individual messages using the `messageMetadata` function in `toUIMessageStreamResponse`.












``` tsx
const  = useChat(,});
```













``` tsx
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


#### [Request Body Preparation: experimental_prepareRequestBody → prepareSendMessagesRequest](#request-body-preparation-experimental_preparerequestbody--preparesendmessagesrequest)

The `experimental_prepareRequestBody` option has been replaced with `prepareSendMessagesRequest` in the transport configuration.












``` tsx
import  from '@ai-sdk/react';
const  = useChat() ;  },});
```













``` tsx
import  from '@ai-sdk/react';import  from 'ai';
const  = useChat()  };    },  }),});
```


### [`@ai-sdk/vue` Changes](#ai-sdkvue-changes)

The Vue.js integration has been completely restructured, replacing the `useChat` composable with a `Chat` class.

#### [useChat Replaced with Chat Class](#usechat-replaced-with-chat-class)












``` typescript
<script setup>import  from '@ai-sdk/vue';
const  = useChat();</script>
```













``` typescript
<script setup>import  from '@ai-sdk/vue';import  from 'ai';import  from 'vue';
const input = ref('');const chat = new Chat(),});
const handleSubmit = (e: Event) => );  input.value = '';};</script>
```


#### [Message Structure Changes](#message-structure-changes)

Messages now use a `parts` array instead of a `content` string.












``` typescript
```













``` typescript
```


### [`@ai-sdk/svelte` Changes](#ai-sdksvelte-changes)

The Svelte integration has also been updated with new constructor patterns and readonly properties.

#### [Constructor API Changes](#constructor-api-changes)












``` js
import  from '@ai-sdk/svelte';
const chatInstance = Chat();
```













``` js
import  from '@ai-sdk/svelte';import  from 'ai';
const chatInstance = Chat(() => (),}));
```


##### [Properties Made Readonly](#properties-made-readonly)

Properties are now readonly and must be updated using setter methods.












``` js
// Direct property mutation was allowedchatInstance.messages = [...chatInstance.messages, newMessage];
```













``` js
// Must use setter methodschatInstance.setMessages([...chatInstance.messages, newMessage]);
```


##### [Removed Managed Input](#removed-managed-input)

Like React and Vue, input management has been removed from the Svelte integration.












``` js
// Input was managed internallyconst  = chatInstance;
```













``` js
// Must manage input state manuallylet input = '';const  = chatInstance;
const handleSubmit = () => );  input = '';};
```


#### [`@ai-sdk/ui-utils` Package Removal](#ai-sdkui-utils-package-removal)

The `@ai-sdk/ui-utils` package has been removed and its exports moved to the main `ai` package.












``` tsx
import  from '@ai-sdk/ui-utils';
```













``` tsx
import  from 'ai';
```


**Note**: `processDataStream` was removed entirely in v5.0. Use `readUIMessageStream` instead for processing UI message streams, or use the more configurable Chat/useChat APIs for most use cases.

### [useCompletion Changes](#usecompletion-changes)

The `data` property has been removed from the `useCompletion` hook.












``` tsx
const  = useCompletion();
```













``` tsx
const  = useCompletion();
```


### [useAssistant Removal](#useassistant-removal)

The `useAssistant` hook has been removed.












``` tsx
import  from '@ai-sdk/react';
```













``` tsx
// useAssistant has been removed// Use useChat with appropriate configuration instead
```



#### [Attachments → File Parts](#attachments--file-parts)

The `experimental_attachments` property has been replaced with the parts array.












``` tsx

      <div className="flex flex-row gap-2">         alt= />          ) : attachment.contentType?.includes('text/') ? (            <div className="w-32 h-24 p-2 overflow-hidden text-xs border rounded-md ellipsis text-zinc-500">                          </div>          ) : null,        )}      </div>    </div>  ));}
```













``` tsx
></div>;        }
        if (part.type === 'file' && part.mediaType?.startsWith('image/')) >              <img src= />            </div>          );        }      })}    </div>  ));}
```


### [Embedding Changes](#embedding-changes)

#### [Provider Options for Embeddings](#provider-options-for-embeddings)

Embedding model settings now use provider options instead of model parameters.












``` tsx
const  = await embed(),});
```













``` tsx
const  = await embed(,  },});
```


#### [Raw Response → Response](#raw-response--response)

The `rawResponse` property has been renamed to `response`.












``` tsx
const  = await embed(/* */);
```













``` tsx
const  = await embed(/* */);
```


#### [Parallel Requests in embedMany](#parallel-requests-in-embedmany)

`embedMany` now makes parallel requests with a configurable `maxParallelCalls` option.












``` tsx
const  = await embedMany();
```


#### [LangChain Adapter Moved to `@ai-sdk/langchain`](#langchain-adapter-moved-to-ai-sdklangchain)

The `LangChainAdapter` has been moved to `@ai-sdk/langchain` and the API has been updated to use UI message streams.












``` tsx
import  from 'ai';
const response = LangChainAdapter.toDataStreamResponse(stream);
```













``` tsx
import  from '@ai-sdk/langchain';import  from 'ai';
const response = createUIMessageStreamResponse();
```





Don't forget to install the new package: `npm install @ai-sdk/langchain`



#### [LlamaIndex Adapter Moved to `@ai-sdk/llamaindex`](#llamaindex-adapter-moved-to-ai-sdkllamaindex)

The `LlamaIndexAdapter` has been extracted to a separate package `@ai-sdk/llamaindex` and follows the same UI message stream pattern.












``` tsx
import  from 'ai';
const response = LlamaIndexAdapter.toDataStreamResponse(stream);
```













``` tsx
import  from '@ai-sdk/llamaindex';import  from 'ai';
const response = createUIMessageStreamResponse();
```





Don't forget to install the new package: `npm install @ai-sdk/llamaindex`



## [Streaming Architecture](#streaming-architecture)

The streaming architecture has been completely redesigned in v5 to support better content differentiation, concurrent streaming of multiple parts, and improved real-time UX.

### [Stream Protocol Changes](#stream-protocol-changes)

#### [Stream Protocol: Single Chunks → Start/Delta/End Pattern](#stream-protocol-single-chunks--startdeltaend-pattern)

The fundamental streaming pattern has changed from single chunks to a three-phase pattern with unique IDs for each content block.












``` tsx
for await (const chunk of result.fullStream)   }}
```













``` tsx
for await (const chunk of result.fullStream) `);      break;    }    case 'text-delta':     case 'text-end': `);      break;    }  }}
```


#### [Reasoning Streaming Pattern](#reasoning-streaming-pattern)

Reasoning content now follows the same start/delta/end pattern:












``` tsx
for await (const chunk of result.fullStream)   }}
```













``` tsx
for await (const chunk of result.fullStream) `);      break;    }    case 'reasoning-delta':     case 'reasoning-end': `);      break;    }  }}
```


#### [Tool Input Streaming](#tool-input-streaming)

Tool inputs can now be streamed as they're being generated:












``` tsx
for await (const chunk of result.fullStream) : $`);      break;    }    case 'tool-input-delta':     case 'tool-input-end': `);      break;    }    case 'tool-call':   }}
```


#### [onChunk Callback Changes](#onchunk-callback-changes)

The `onChunk` callback now receives the new streaming chunk types with IDs and the start/delta/end pattern.












``` tsx
const result = streamText()     }  },});
```













``` tsx
const result = streamText()       case 'reasoning':       case 'source':       case 'tool-call':       case 'tool-input-start': :`,          chunk.toolCallId,        );        break;      }      case 'tool-input-delta': :`, chunk.delta);        break;      }      case 'tool-result':       case 'raw':     }  },});
```


#### [File Stream Parts Restructure](#file-stream-parts-restructure)

File parts in streams have been flattened.












``` tsx
for await (const chunk of result.fullStream)   }}
```













``` tsx
for await (const chunk of result.fullStream)   }}
```


#### [Source Stream Parts Restructure](#source-stream-parts-restructure)

Source stream parts have been flattened.












``` tsx
for await (const part of result.fullStream) }
```













``` tsx
for await (const part of result.fullStream) }
```


#### [Finish Event Changes](#finish-event-changes)

Stream finish events have been renamed for consistency.












``` tsx
for await (const part of result.fullStream)     case 'finish':   }}
```













``` tsx
for await (const part of result.fullStream)     case 'finish':   }}
```


### [Stream Protocol Changes](#stream-protocol-changes-1)

#### [Proprietary Protocol -\> Server-Sent Events](#proprietary-protocol---server-sent-events)

The data stream protocol has been updated to use Server-Sent Events.












``` tsx
import  from 'ai';
const dataStream = createDataStream();  },});
```













``` tsx
import  from 'ai';
const stream = createUIMessageStream() => );    writer.write();    writer.write(,    });  },});
```



The streaming API has been completely restructured from data streams to UI message streams.












``` tsx
// Express/Node.js serversapp.post('/stream', async (req, res) => );
  result.pipeDataStreamToResponse(res);});
// Next.js API routesconst result = streamText();
return result.toDataStreamResponse();
```













``` tsx
// Express/Node.js serversapp.post('/stream', async (req, res) => );
  result.pipeUIMessageStreamToResponse(res);});
// Next.js API routesconst result = streamText();
return result.toUIMessageStreamResponse();
```


#### [Stream Transform Function Renaming](#stream-transform-function-renaming)

Various stream-related functions have been renamed for consistency.












``` tsx
import  from 'ai';
```













``` tsx
import  from 'ai';
```


#### [Error Handling: getErrorMessage → onError](#error-handling-geterrormessage--onerror)

The `getErrorMessage` option in `toDataStreamResponse` has been replaced with `onError` in `toUIMessageStreamResponse`, providing more control over error forwarding to the client.

By default, error messages are NOT sent to the client to prevent leaking sensitive information. The `onError` callback allows you to explicitly control what error information is forwarded to the client.












``` tsx
return result.toDataStreamResponse(;  },});
```













``` tsx
return result.toUIMessageStreamResponse(;  },});
```


### [Utility Changes](#utility-changes)

#### [ID Generation Changes](#id-generation-changes)

The `createIdGenerator()` function now requires a `size` argument.












``` tsx
const generator = createIdGenerator();const id = generator(16); // Custom size at call time
```













``` tsx
const generator = createIdGenerator();const id = generator(); // Fixed size from creation
```


#### [IDGenerator → IdGenerator](#idgenerator--idgenerator)

The type name has been updated.












``` tsx
import  from 'ai';
```













``` tsx
import  from 'ai';
```


### [Provider Interface Changes](#provider-interface-changes)

#### [Language Model V2 Import](#language-model-v2-import)

`LanguageModelV2` must now be imported from `@ai-sdk/provider`.












``` tsx
import  from 'ai';
```













``` tsx
import  from '@ai-sdk/provider';
```


#### [Middleware Rename](#middleware-rename)

`LanguageModelV1Middleware` has been renamed and moved.












``` tsx
import  from 'ai';
```













``` tsx
import  from '@ai-sdk/provider';
```


#### [Usage Token Properties](#usage-token-properties)

Token usage properties have been renamed for consistency.












``` tsx
// In language model implementations}
```













``` tsx
// In language model implementations}
```


#### [Stream Part Type Changes](#stream-part-type-changes)

The `LanguageModelV2StreamPart` type has been expanded to support the new streaming architecture with start/delta/end patterns and IDs.












``` tsx
// V4: Simple stream partstype LanguageModelV2StreamPart =  |   |   | ;
```













``` tsx
// V5: Enhanced stream parts with IDs and lifecycle eventstype LanguageModelV2StreamPart =  // Text blocks with start/delta/end pattern  |   |   | 
  // Reasoning blocks with start/delta/end pattern  |   |   | 
  // Tool input streaming  |   |   | 
  // Enhanced tool calls  | 
  // Stream lifecycle events  |   | ;
```


#### [Raw Response → Response](#raw-response--response-1)

Provider response objects have been updated.












``` tsx
// In language model implementations}
```













``` tsx
// In language model implementations}
```


#### [`wrapLanguageModel` now stable](#wraplanguagemodel-now-stable)












``` tsx
import  from 'ai';
```













``` tsx
import  from 'ai';
```


#### [`activeTools` No Longer Experimental](#activetools-no-longer-experimental)












``` tsx
const result = await generateText(,  experimental_activeTools: ['weatherTool'],});
```













``` tsx
const result = await generateText(,  activeTools: ['weatherTool'], // No longer experimental});
```


#### [`prepareStep` No Longer Experimental](#preparestep-no-longer-experimental)

The `experimental_prepareStep` option has been promoted and no longer requires the experimental prefix.












``` tsx
const result = await generateText(,  experimental_prepareStep: () => ;  },});
```













``` tsx
const result = await generateText(,  prepareStep: () => ;  },});
```


The `prepareStep` function receives `` and can return:

- `model`: Different model for this step
- `activeTools`: Which tools to make available
- `toolChoice`: Tool selection strategy
- `system`: System message for this step
- `undefined`: Use default settings

### [Temperature Default Removal](#temperature-default-removal)

Temperature is no longer set to `0` by default.












``` tsx
await generateText();
```













``` tsx
await generateText();
```


## [Message Persistence Changes](#message-persistence-changes)




If you have persisted messages in a database, see the [Data Migration Guide](migration-guide-5-0-data.html) for comprehensive guidance on migrating your stored message data to the v5 format.



In v4, you would typically use helper functions like `appendResponseMessages` or `appendClientMessage` to format messages in the `onFinish` callback of `streamText`:












``` tsx
import  from 'ai';import  from '@ai-sdk/openai';
const updatedMessages = appendClientMessage();
const result = streamText() => );
    // Save formatted messages to database    await saveMessages(finalMessages);  },});
```


In v5, message persistence is now handled through the `toUIMessageStreamResponse` method, which automatically formats response messages in the `UIMessage` format:












``` tsx
import  from 'ai';import  from '@ai-sdk/openai';
const messages: UIMessage[] = [  // Your existing messages in UIMessage format];
const result = streamText();
return result.toUIMessageStreamResponse() => );
    // responseMessage contains just the generated message in UIMessage format    saveMessage();  },});
```





**Important:** When using `toUIMessageStreamResponse`, you should always provide both `originalMessages` and `generateMessageId` parameters. Without these, you may experience duplicate or repeated assistant messages in your UI. For more details, see [Troubleshooting: Repeated Assistant Messages](../troubleshooting/repeated-assistant-messages.html).



### [Message ID Generation](#message-id-generation)

The `experimental_generateMessageId` option has been moved from `streamText` configuration to `toUIMessageStreamResponse`, as it's designed for use with `UIMessage`s rather than `ModelMessage`s.












``` tsx
const result = streamText();
```













``` tsx
const result = streamText();
return result.toUIMessageStreamResponse();
```


For more details on message IDs and persistence, see the [Chatbot Message Persistence guide](../ai-sdk-ui/chatbot-message-persistence.html#message-ids).

### [Using createUIMessageStream](#using-createuimessagestream)

For more complex scenarios, especially when working with data parts, you can use `createUIMessageStream`:












``` tsx
import  from 'ai';import  from '@ai-sdk/openai';
const stream = createUIMessageStream() => ,    });
    // Stream the AI response    const result = streamText();
    writer.merge(result.toUIMessageStream());  },  onFinish: () => );  },});
return createUIMessageStreamResponse();
```


## [Provider & Model Changes](#provider--model-changes)

### [OpenAI](#openai)

#### [Default Provider Instance Uses Responses API](#default-provider-instance-uses-responses-api)

In AI SDK 5, the default OpenAI provider instance uses the Responses API, while AI SDK 4 used the Chat Completions API. The Chat Completions API remains fully supported and you can use it with `openai.chat(...)`.












``` tsx
import  from '@ai-sdk/openai';
const defaultModel = openai('gpt-4.1-mini'); // Chat Completions API
```













``` tsx
import  from '@ai-sdk/openai';
const defaultModel = openai('gpt-4.1-mini'); // Responses API
// Specify a specific API when needed:const chatCompletionsModel = openai.chat('gpt-4.1-mini');const responsesModel = openai.responses('gpt-4.1-mini');
```





The Responses and Chat Completions APIs have different behavior and defaults. If you depend on the Chat Completions API, switch your model instance to `openai.chat(...)` and audit your configuration.



#### [Strict Schemas (`strictSchemas`) with Responses API](#strict-schemas-strictschemas-with-responses-api)

In AI SDK 4.0, you could set the `strictSchemas` option on Responses models (which defaulted to `true`). This option has been renamed to `strictJsonSchema` in AI SDK 5.0 and now defaults to `false`.












``` tsx
import  from 'zod';import  from 'ai';import  from '@ai-sdk/openai';
const result = await generateObject(),  providerOptions:  satisfies OpenAIResponsesProviderOptions,  },});
```













``` tsx
import  from 'zod';import  from 'ai';import  from '@ai-sdk/openai';
const result = await generateObject(),  providerOptions:  satisfies OpenAIResponsesProviderOptions,  },});
```


If you call `openai.chat(...)` to use the Chat Completions API directly, you can type it with `OpenAIChatLanguageModelOptions`. AI SDK 5 adds the same `strictJsonSchema` option there as well.

#### [Structured Outputs](#structured-outputs)

The `structuredOutputs` option is now configured using provider options rather than as a setting on the model instance.












``` tsx
import  from 'zod';import  from 'ai';import  from '@ai-sdk/openai';
const result = await generateObject(), // use Chat Completions API  schema: z.object(),});
```













``` tsx
import  from 'zod';import  from 'ai';import  from '@ai-sdk/openai';
const result = await generateObject(),  providerOptions:  satisfies OpenAIChatLanguageModelOptions,  },});
```


#### [Compatibility Option Removal](#compatibility-option-removal)

The `compatibility` option has been removed; strict compatibility mode is now the default.












``` tsx
const openai = createOpenAI();
```













``` tsx
const openai = createOpenAI();
```


#### [Legacy Function Calls Removal](#legacy-function-calls-removal)

The `useLegacyFunctionCalls` option has been removed.












``` tsx
const result = streamText(),});
```













``` tsx
const result = streamText();
```


#### [Simulate Streaming](#simulate-streaming)

The `simulateStreaming` model option has been replaced with middleware.












``` tsx
const result = generateText(),  prompt: 'Hello, world!',});
```













``` tsx
import  from 'ai';
const model = wrapLanguageModel();
const result = generateText();
```


### [Google](#google)

#### [Search Grounding is now a provider defined tool](#search-grounding-is-now-a-provider-defined-tool)

Search Grounding is now called "Google Search" and is now a provider defined tool.












``` tsx
const  = await generateText(),  prompt: 'List the top 5 San Francisco news from the past week.',});
```













``` tsx
import  from '@ai-sdk/google';const  = await generateText(),  },});
```


### [Amazon Bedrock](#amazon-bedrock)

#### [Snake Case → Camel Case](#snake-case--camel-case)

Provider options have been updated to use camelCase.












``` tsx
const result = await generateText(,    },  },});
```













``` tsx
const result = await generateText(,    },  },});
```


### [Provider-Utils Changes](#provider-utils-changes)

Deprecated `CoreTool*` types have been removed.












``` tsx
import  from '@ai-sdk/provider-utils';
```













``` tsx
import  from '@ai-sdk/provider-utils';
```


## [Troubleshooting](#troubleshooting)

### [TypeScript Performance Issues with Zod](#typescript-performance-issues-with-zod)

If you experience TypeScript server crashes, slow type checking, or errors like "Type instantiation is excessively deep and possibly infinite" when using Zod with AI SDK 5.0:

1.  **First, ensure you're using Zod 4.1.8 or later** - this version includes a fix for module resolution issues that cause TypeScript performance problems.

2.  If the issue persists, update your `tsconfig.json` to use `moduleResolution: "nodenext"`:



``` json
}
```


This resolves the TypeScript performance issues while allowing you to continue using the standard Zod import. If this doesn't resolve the issue, you can try using a version-specific import path as an alternative solution. For detailed troubleshooting steps, see [TypeScript performance issues with Zod](../troubleshooting/typescript-performance-zod.html).

## [Codemod Table](#codemod-table)

The following table lists available codemods for the AI SDK 5.0 upgrade process. For more information, see the [Codemods](#codemods) section.


| Change | Codemod |
|----|----|
| **AI SDK Core Changes** |  |
| Flatten streamText file properties | `v5/flatten-streamtext-file-properties` |
| ID Generation Changes | `v5/require-createIdGenerator-size-argument` |
| IDGenerator → IdGenerator | `v5/rename-IDGenerator-to-IdGenerator` |
| Import LanguageModelV2 from provider package | `v5/import-LanguageModelV2-from-provider-package` |
| Move image model maxImagesPerCall | `v5/move-image-model-maxImagesPerCall` |
| Move LangChain adapter | `v5/move-langchain-adapter` |
| Move maxSteps to stopWhen | `v5/move-maxsteps-to-stopwhen` |
| Move provider options | `v5/move-provider-options` |
| Move React to AI SDK | `v5/move-react-to-ai-sdk` |
| Move UI utils to AI | `v5/move-ui-utils-to-ai` |
| Remove experimental wrap language model | `v5/remove-experimental-wrap-language-model` |
| Remove experimental activeTools | `v5/remove-experimental-activetools` |
| Remove experimental prepareStep | `v5/remove-experimental-preparestep` |
| Remove experimental continueSteps | `v5/remove-experimental-continuesteps` |
| Remove experimental temperature | `v5/remove-experimental-temperature` |
| Remove experimental truncate | `v5/remove-experimental-truncate` |
| Remove experimental OpenAI compatibility | `v5/remove-experimental-openai-compatibility` |
| Remove experimental OpenAI legacy function calls | `v5/remove-experimental-openai-legacy-function-calls` |
| Remove experimental OpenAI structured outputs | `v5/remove-experimental-openai-structured-outputs` |
| Remove experimental OpenAI store | `v5/remove-experimental-openai-store` |
| Remove experimental OpenAI user | `v5/remove-experimental-openai-user` |
| Remove experimental OpenAI parallel tool calls | `v5/remove-experimental-openai-parallel-tool-calls` |
| Remove experimental OpenAI response format | `v5/remove-experimental-openai-response-format` |
| Remove experimental OpenAI logit bias | `v5/remove-experimental-openai-logit-bias` |
| Remove experimental OpenAI logprobs | `v5/remove-experimental-openai-logprobs` |
| Remove experimental OpenAI seed | `v5/remove-experimental-openai-seed` |
| Remove experimental OpenAI service tier | `v5/remove-experimental-openai-service-tier` |
| Remove experimental OpenAI top logprobs | `v5/remove-experimental-openai-top-logprobs` |
| Remove experimental OpenAI transform | `v5/remove-experimental-openai-transform` |
| Remove experimental OpenAI stream options | `v5/remove-experimental-openai-stream-options` |
| Remove experimental OpenAI prediction | `v5/remove-experimental-openai-prediction` |
| Remove experimental Anthropic caching | `v5/remove-experimental-anthropic-caching` |
| Remove experimental Anthropic computer use | `v5/remove-experimental-anthropic-computer-use` |
| Remove experimental Anthropic PDF support | `v5/remove-experimental-anthropic-pdf-support` |
| Remove experimental Anthropic prompt caching | `v5/remove-experimental-anthropic-prompt-caching` |
| Remove experimental Google search grounding | `v5/remove-experimental-google-search-grounding` |
| Remove experimental Google code execution | `v5/remove-experimental-google-code-execution` |
| Remove experimental Google cached content | `v5/remove-experimental-google-cached-content` |
| Remove experimental Google custom headers | `v5/remove-experimental-google-custom-headers` |
| Rename format stream part | `v5/rename-format-stream-part` |
| Rename parse stream part | `v5/rename-parse-stream-part` |
| Replace image type with file type | `v5/replace-image-type-with-file-type` |
| Replace LlamaIndex adapter | `v5/replace-llamaindex-adapter` |
| Replace onCompletion with onFinal | `v5/replace-oncompletion-with-onfinal` |
| Replace rawResponse with response | `v5/replace-rawresponse-with-response` |
| Replace redacted reasoning type | `v5/replace-redacted-reasoning-type` |
| Replace simulate streaming | `v5/replace-simulate-streaming` |
| Replace textDelta with text | `v5/replace-textdelta-with-text` |
| Replace usage token properties | `v5/replace-usage-token-properties` |
| Restructure file stream parts | `v5/restructure-file-stream-parts` |
| Restructure source stream parts | `v5/restructure-source-stream-parts` |
| RSC package | `v5/rsc-package` |


## [Changes Between v5 Beta Versions](#changes-between-v5-beta-versions)

This section documents breaking changes between different beta versions of AI SDK 5.0. If you're upgrading from an earlier v5 beta version to a later one, check this section for any changes that might affect your code.

### [fullStream Type Rename: text/reasoning → text-delta/reasoning-delta](#fullstream-type-rename-textreasoning--text-deltareasoning-delta)

The chunk types in `fullStream` have been renamed for consistency with UI streams and language model streams.












``` tsx
for await (const chunk of result.fullStream)     case 'reasoning':   }}
```













``` tsx
for await (const chunk of result.fullStream)     case 'reasoning-delta':   }}
```

















On this page



























































































































































































































































































































































































































































































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.