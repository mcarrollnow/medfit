AI SDK 5 is available now.










Menu






















































































































































































































































































































































# [Tool Calling](#tool-calling)

As covered under Foundations, [tools](../foundations/tools.html) are objects that can be called by the model to perform a specific task. AI SDK Core tools contain three elements:

- **`description`**: An optional description of the tool that can influence when the tool is picked.
- **`inputSchema`**: A [Zod schema](../foundations/tools.html#schemas) or a [JSON schema](../reference/ai-sdk-core/json-schema.html) that defines the input parameters. The schema is consumed by the LLM, and also used to validate the LLM tool calls.
- **`execute`**: An optional async function that is called with the inputs from the tool call. It produces a value of type `RESULT` (generic type). It is optional because you might want to forward tool calls to the client or to a queue instead of executing them in the same process.




You can use the [`tool`](../reference/ai-sdk-core/tool.html) helper function to infer the types of the `execute` parameters.



The `tools` parameter of `generateText` and `streamText` is an object that has the tool names as keys and the tools as values:



``` ts
import  from 'zod';import  from 'ai';
const result = await generateText(),      execute: async () => (),    }),  },  prompt: 'What is the weather in San Francisco?',});
```





When a model uses a tool, it is called a "tool call" and the output of the tool is called a "tool result".



Tool calling is not restricted to only text generation. You can also use it to render user interfaces (Generative UI).

## [Multi-Step Calls (using stopWhen)](#multi-step-calls-using-stopwhen)

With the `stopWhen` setting, you can enable multi-step calls in `generateText` and `streamText`. When `stopWhen` is set and the model generates a tool call, the AI SDK will trigger a new generation passing in the tool result until there are no further tool calls or the stopping condition is met.




The `stopWhen` conditions are only evaluated when the last step contains tool results.



By default, when you use `generateText` or `streamText`, it triggers a single generation. This works well for many use cases where you can rely on the model's training data to generate a response. However, when you provide tools, the model now has the choice to either generate a normal text response, or generate a tool call. If the model generates a tool call, it's generation is complete and that step is finished.

You may want the model to generate text after the tool has been executed, either to summarize the tool results in the context of the users query. In many cases, you may also want the model to use multiple tools in a single response. This is where multi-step calls come in.

You can think of multi-step calls in a similar way to a conversation with a human. When you ask a question, if the person does not have the requisite knowledge in their common knowledge (a model's training data), the person may need to look up information (use a tool) before they can provide you with an answer. In the same way, the model may need to call a tool to get the information it needs to answer your question where each generation (tool call or text generation) is a step.

### [Example](#example)

In the following example, there are two steps:

1.  **Step 1**
    1.  The prompt `'What is the weather in San Francisco?'` is sent to the model.
    2.  The model generates a tool call.
    3.  The tool call is executed.
2.  **Step 2**
    1.  The tool result is sent to the model.
    2.  The model generates a response considering the tool result.



``` ts
import  from 'zod';import  from 'ai';
const  = await generateText(),      execute: async () => (),    }),  },  stopWhen: stepCountIs(5), // stop after a maximum of 5 steps if tools were called  prompt: 'What is the weather in San Francisco?',});
```







### [Steps](#steps)

To access intermediate tool calls and results, you can use the `steps` property in the result object or the `streamText` `onFinish` callback. It contains all the text, tool calls, tool results, and more from each step.

#### [Example: Extract tool results from all steps](#example-extract-tool-results-from-all-steps)



``` ts
import  from 'ai';
const  = await generateText();
// extract all tool calls from the steps:const allToolCalls = steps.flatMap(step => step.toolCalls);
```


### [`onStepFinish` callback](#onstepfinish-callback)

When using `generateText` or `streamText`, you can provide an `onStepFinish` callback that is triggered when a step is finished, i.e. all text deltas, tool calls, and tool results for the step are available. When you have multiple steps, the callback is triggered for each step.



``` tsx
import  from 'ai';
const result = await generateText() ,});
```


### [`prepareStep` callback](#preparestep-callback)

The `prepareStep` callback is called before a step is started.

It is called with the following parameters:

- `model`: The model that was passed into `generateText`.
- `stopWhen`: The stopping condition that was passed into `generateText`.
- `stepNumber`: The number of the step that is being executed.
- `steps`: The steps that have been executed so far.
- `messages`: The messages that will be sent to the model for the current step.

You can use it to provide different settings for a step, including modifying the input messages.



``` tsx
import  from 'ai';
const result = await generateText() => ,        // limit the tools that are available for this step:        activeTools: ['tool1'],      };    }
    // when nothing is returned, the default settings are used  },});
```


#### [Message Modification for Longer Agentic Loops](#message-modification-for-longer-agentic-loops)

In longer agentic loops, you can use the `messages` parameter to modify the input messages for each step. This is particularly useful for prompt compression:



``` tsx
prepareStep: async () => ;  }
  return ;},
```


## [Response Messages](#response-messages)

Adding the generated assistant and tool messages to your conversation history is a common task, especially if you are using multi-step tool calls.

Both `generateText` and `streamText` have a `response.messages` property that you can use to add the assistant and tool messages to your conversation history. It is also available in the `onFinish` callback of `streamText`.

The `response.messages` property contains an array of `ModelMessage` objects that you can add to your conversation history:



``` ts
import  from 'ai';
const messages: ModelMessage[] = [  // ...];
const  = await generateText();
// add the response messages to your conversation history:messages.push(...response.messages); // streamText: ...((await response).messages)
```


## [Dynamic Tools](#dynamic-tools)

AI SDK Core supports dynamic tools for scenarios where tool schemas are not known at compile time. This is useful for:

- MCP (Model Context Protocol) tools without schemas
- User-defined functions at runtime
- Tools loaded from external sources

### [Using dynamicTool](#using-dynamictool)

The `dynamicTool` helper creates tools with unknown input/output types:



``` ts
import  from 'ai';import  from 'zod';
const customTool = dynamicTool(),  execute: async input =>  = input as any;
    // Execute your dynamic logic    return ` };  },});
```


### [Type-Safe Handling](#type-safe-handling)

When using both static and dynamic tools, use the `dynamic` flag for type narrowing:



``` ts
const result = await generateText(),  },  onStepFinish: () => 
      // Static tool: full type inference      switch (toolCall.toolName)     }  },});
```


## [Preliminary Tool Results](#preliminary-tool-results)

You can return an `AsyncIterable` over multiple results. In this case, the last value from the iterable is the final tool result.

This can be used in combination with generator functions to e.g. stream status information during the tool execution:



``` ts
tool(),  async *execute() `,      weather: undefined,    };
    await new Promise(resolve => setTimeout(resolve, 3000));
    const temperature = 72 + Math.floor(Math.random() * 21) - 10;
    yield  is $°F`,      temperature,    };  },});
```


## [Tool Choice](#tool-choice)

You can use the `toolChoice` setting to influence when a tool is selected. It supports the following settings:

- `auto` (default): the model can choose whether and which tools to call.
- `required`: the model must call a tool. It can choose which tool to call.
- `none`: the model must not call tools
- ``: the model must call the specified tool



``` ts
import  from 'zod';import  from 'ai';
const result = await generateText(),      execute: async () => (),    }),  },  toolChoice: 'required', // force the model to call a tool  prompt: 'What is the weather in San Francisco?',});
```


## [Tool Execution Options](#tool-execution-options)

When tools are called, they receive additional options as a second parameter.

### [Tool Call ID](#tool-call-id)

The ID of the tool call is forwarded to the tool execution. You can use it e.g. when sending tool-call related information with stream data.



``` ts
import  from 'ai';
export async function POST(req: Request)  = await req.json();
  const stream = createUIMessageStream() => ) => ,              });              // ...            },          }),        },      });
      writer.merge(result.toUIMessageStream());    },  });
  return createUIMessageStreamResponse();}
```


### [Messages](#messages)

The messages that were sent to the language model to initiate the response that contained the tool call are forwarded to the tool execution. You can access them in the second parameter of the `execute` function. In multi-step calls, the messages contain the text, tool calls, and tool results from all previous steps.



``` ts
import  from 'ai';
const result = await generateText() => ;      },    }),  },});
```


### [Abort Signals](#abort-signals)

The abort signals from `generateText` and `streamText` are forwarded to the tool execution. You can access them in the second parameter of the `execute` function and e.g. abort long-running computations or forward them to fetch calls inside tools.



``` ts
import  from 'zod';import  from 'ai';
const result = await generateText(),      execute: async (, ) => `,          , // forward the abort signal to fetch        );      },    }),  },  prompt: 'What is the weather in San Francisco?',});
```


### [Context (experimental)](#context-experimental)

You can pass in arbitrary context from `generateText` or `streamText` via the `experimental_context` setting. This context is available in the `experimental_context` tool execution option.



``` ts
const result = await generateText() => ; // or use type validation library        // ...      },    }),  },  experimental_context: ,});
```


## [Types](#types)

Modularizing your code often requires defining types to ensure type safety and reusability. To enable this, the AI SDK provides several helper types for tools, tool calls, and tool results.

You can use them to strongly type your variables, function parameters, and return types in parts of the code that are not directly related to `streamText` or `generateText`.

Each tool call is typed with `ToolCall<NAME extends string, ARGS>`, depending on the tool that has been invoked. Similarly, the tool results are typed with `ToolResult<NAME extends string, ARGS, RESULT>`.

The tools in `streamText` and `generateText` are defined as a `ToolSet`. The type inference helpers `TypedToolCall<TOOLS extends ToolSet>` and `TypedToolResult<TOOLS extends ToolSet>` can be used to extract the tool call and tool result types from the tools.



``` ts
import  from '@ai-sdk/openai';import  from 'ai';import  from 'zod';
const myToolSet = ),    execute: async () => `Hello, $!`,  }),  secondTool: tool(),    execute: async () => `You are $ years old!`,  }),};
type MyToolCall = TypedToolCall<typeof myToolSet>;type MyToolResult = TypedToolResult<typeof myToolSet>;
async function generateSomething(prompt: string): Promise<> );}
```


## [Handling Errors](#handling-errors)

The AI SDK has three tool-call related errors:

- [`NoSuchToolError`](../reference/ai-sdk-errors/ai-no-such-tool-error.html): the model tries to call a tool that is not defined in the tools object
- [`InvalidToolInputError`](../reference/ai-sdk-errors/ai-invalid-tool-input-error.html): the model calls a tool with inputs that do not match the tool's input schema
- [`ToolCallRepairError`](../reference/ai-sdk-errors/ai-tool-call-repair-error.html): an error that occurred during tool call repair

When tool execution fails (errors thrown by your tool's `execute` function), the AI SDK adds them as `tool-error` content parts to enable automated LLM roundtrips in multi-step scenarios.

### [`generateText`](#generatetext)

`generateText` throws errors for tool schema validation issues and other errors, and can be handled using a `try`/`catch` block. Tool execution errors appear as `tool-error` parts in the result steps:



``` ts
try );} catch (error)  else if (InvalidToolInputError.isInstance(error))  else }
```


Tool execution errors are available in the result steps:



``` ts
const  = await generateText();
// check for tool errors in the stepsconst toolErrors = steps.flatMap(step =>  step.content.filter(part => part.type === 'tool-error'),);
toolErrors.forEach(toolError => );
```


### [`streamText`](#streamtext)

`streamText` sends errors as part of the full stream. Tool execution errors appear as `tool-error` parts, while other errors appear as `error` parts.

When using `toUIMessageStreamResponse`, you can pass an `onError` function to extract the error message from the error part and forward it as part of the stream response:



``` ts
const result = streamText();
return result.toUIMessageStreamResponse( else if (InvalidToolInputError.isInstance(error))  else   },});
```


## [Tool Call Repair](#tool-call-repair)




The tool call repair feature is experimental and may change in the future.



Language models sometimes fail to generate valid tool calls, especially when the input schema is complex or the model is smaller.

If you use multiple steps, those failed tool calls will be sent back to the LLM in the next step to give it an opportunity to fix it. However, you may want to control how invalid tool calls are repaired without requiring additional steps that pollute the message history.

You can use the `experimental_repairToolCall` function to attempt to repair the tool call with a custom function.

You can use different strategies to repair the tool call:

- Use a model with structured outputs to generate the inputs.
- Send the messages, system prompt, and tool schema to a stronger model to generate the inputs.
- Provide more specific repair instructions based on which tool was called.

### [Example: Use a model with structured outputs for repair](#example-use-a-model-with-structured-outputs-for-repair)



``` ts
import  from '@ai-sdk/openai';import  from 'ai';
const result = await generateText() => 
    const tool = tools[toolCall.toolName as keyof typeof tools];
    const  = await generateObject("` +          ` with the following inputs:`,        JSON.stringify(toolCall.input),        `The tool accepts the following schema:`,        JSON.stringify(inputSchema(toolCall)),        'Please fix the inputs.',      ].join('\n'),    });
    return ;  },});
```


### [Example: Use the re-ask strategy for repair](#example-use-the-re-ask-strategy-for-repair)



``` ts
import  from '@ai-sdk/openai';import  from 'ai';
const result = await generateText() => ,          ],        },        ,          ],        },      ],      tools,    });
    const newToolCall = result.toolCalls.find(      newToolCall => newToolCall.toolName === toolCall.toolName,    );
    return newToolCall != null      ?       : null;  },});
```


## [Active Tools](#active-tools)

Language models can only handle a limited number of tools at a time, depending on the model. To allow for static typing using a large number of tools and limiting the available tools to the model at the same time, the AI SDK provides the `activeTools` property.

It is an array of tool names that are currently active. By default, the value is `undefined` and all tools are active.



``` ts
import  from '@ai-sdk/openai';import  from 'ai';
const  = await generateText();
```


## [Multi-modal Tool Results](#multi-modal-tool-results)




Multi-modal tool results are experimental and only supported by Anthropic and OpenAI.



In order to send multi-modal tool results, e.g. screenshots, back to the model, they need to be converted into a specific format.

AI SDK Core tools have an optional `toModelOutput` function that converts the tool result into a content part.

Here is an example for converting a screenshot into a content part:



``` ts
const result = await generateText() ;          }          default: `;          }        }      },
      // map to tool result content for LLM consumption:      toModelOutput(result) ]              : [],        };      },    }),  },  // ...});
```


## [Extracting Tools](#extracting-tools)

Once you start having many tools, you might want to extract them into separate files. The `tool` helper function is crucial for this, because it ensures correct type inference.

Here is an example of an extracted tool:












``` ts
import  from 'ai';import  from 'zod';
// the `tool` helper function ensures correct type inference:export const weatherTool = tool(),  execute: async () => (),});
```


## [MCP Tools](#mcp-tools)

The AI SDK supports connecting to Model Context Protocol (MCP) servers to access their tools. MCP enables your AI applications to discover and use tools across various services through a standardized interface.

For detailed information about MCP tools, including initialization, transport options, and usage patterns, see the [MCP Tools documentation](mcp-tools.html).

### [AI SDK Tools vs MCP Tools](#ai-sdk-tools-vs-mcp-tools)

In most cases, you should define your own AI SDK tools for production applications. They provide full control, type safety, and optimal performance. MCP tools are best suited for rapid development iteration and scenarios where users bring their own tools.


| Aspect | AI SDK Tools | MCP Tools |
|----|----|----|
| **Type Safety** | Full static typing end-to-end | Dynamic discovery at runtime |
| **Execution** | Same process as your request (low latency) | Separate server (network overhead) |
| **Prompt Control** | Full control over descriptions and schemas | Controlled by MCP server owner |
| **Schema Control** | You define and optimize for your model | Controlled by MCP server owner |
| **Version Management** | Full visibility over updates | Can update independently (version skew risk) |
| **Authentication** | Same process, no additional auth required | Separate server introduces additional auth complexity |
| **Best For** | Production applications requiring control and performance | Development iteration, user-provided tools |


## [Examples](#examples)

You can see tools in action using various frameworks in the following examples:









Learn to use tools in Node.js












Learn to use tools in Next.js with Route Handlers












Learn to use MCP tools in Node.js





















On this page


























































































































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.