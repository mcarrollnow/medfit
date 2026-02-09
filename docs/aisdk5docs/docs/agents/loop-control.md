AI SDK 5 is available now.










Menu






















































































































































































































































































































































# [Loop Control](#loop-control)

You can control both the execution flow and the settings at each step of the agent loop. The AI SDK provides built-in loop control through two parameters: `stopWhen` for defining stopping conditions and `prepareStep` for modifying settings (model, tools, messages, and more) between steps.

## [Stop Conditions](#stop-conditions)

The `stopWhen` parameter controls when to stop execution when there are tool results in the last step. By default, agents stop after a single step using `stepCountIs(1)`.

When you provide `stopWhen`, the agent continues executing after tool calls until a stopping condition is met. When the condition is an array, execution stops when any of the conditions are met.

### [Use Built-in Conditions](#use-built-in-conditions)

The AI SDK provides several built-in stopping conditions:



``` ts
import  from 'ai';
const agent = new Agent(,  stopWhen: stepCountIs(20), // Stop after 20 steps maximum});
const result = await agent.generate();
```


### [Combine Multiple Conditions](#combine-multiple-conditions)

Combine multiple stopping conditions. The loop stops when it meets any condition:



``` ts
import  from 'ai';
const agent = new Agent(,  stopWhen: [    stepCountIs(20), // Maximum 20 steps    hasToolCall('someTool'), // Stop after calling 'someTool'  ],});
const result = await agent.generate();
```


### [Create Custom Conditions](#create-custom-conditions)

Build custom stopping conditions for specific requirements:



``` ts
import  from 'ai';
const tools =  satisfies ToolSet;
const hasAnswer: StopCondition<typeof tools> = () => ;
const agent = new Agent();
const result = await agent.generate();
```


Custom conditions receive step information across all steps:



``` ts
const budgetExceeded: StopCondition<typeof tools> = () => ),    ,  );
  const costEstimate =    (totalUsage.inputTokens * 0.01 + totalUsage.outputTokens * 0.03) / 1000;  return costEstimate > 0.5; // Stop if cost exceeds $0.50};
```


## [Prepare Step](#prepare-step)

The `prepareStep` callback runs before each step in the loop and defaults to the initial settings if you don't return any changes. Use it to modify settings, manage context, or implement dynamic behavior based on execution history.

### [Dynamic Model Selection](#dynamic-model-selection)

Switch models based on step requirements:



``` ts
import  from 'ai';
const agent = new Agent(,  prepareStep: async () => ;    }    // Continue with default settings    return ;  },});
const result = await agent.generate();
```


### [Context Management](#context-management)

Manage growing conversation history in long-running loops:



``` ts
import  from 'ai';
const agent = new Agent(,  prepareStep: async () => ;    }    return ;  },});
const result = await agent.generate();
```


### [Tool Selection](#tool-selection)

Control which tools are available at each step:



``` ts
import  from 'ai';
const agent = new Agent(,  prepareStep: async () => ;    }
    // Analysis phase (steps 3-5)    if (stepNumber <= 5) ;    }
    // Summary phase (step 6+)    return ;  },});
const result = await agent.generate();
```


You can also force a specific tool to be used:



``` ts
prepareStep: async () => ,    };  }
  if (stepNumber === 5) ,    };  }
  return ;};
```


### [Message Modification](#message-modification)

Transform messages before sending them to the model:



``` ts
import  from 'ai';
const agent = new Agent(,  prepareStep: async () => ;      }      return msg;    });
    return ;  },});
const result = await agent.generate();
```


## [Access Step Information](#access-step-information)

Both `stopWhen` and `prepareStep` receive detailed information about the current execution:



``` ts
prepareStep: async () => ,    };  }
  return ;},
```


## [Manual Loop Control](#manual-loop-control)

For scenarios requiring complete control over the agent loop, you can use AI SDK Core functions (`generateText` and `streamText`) to implement your own loop management instead of using `stopWhen` and `prepareStep`. This approach provides maximum flexibility for complex workflows.

### [Implementing a Manual Loop](#implementing-a-manual-loop)

Build your own agent loop when you need full control over execution:



``` ts
import  from 'ai';
const messages: ModelMessage[] = [];
let step = 0;const maxSteps = 10;
while (step < maxSteps) ,  });
  messages.push(...result.response.messages);
  if (result.text) 
  step++;}
```


This manual approach gives you complete control over:

- Message history management
- Step-by-step decision making
- Custom stopping conditions
- Dynamic tool and model selection
- Error handling and recovery

[Learn more about manual agent loops in the cookbook](../../cookbook/node/manual-agent-loop.html).
















On this page























































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.