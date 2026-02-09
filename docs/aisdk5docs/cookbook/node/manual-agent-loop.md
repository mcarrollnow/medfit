AI SDK 5 is available now.










Menu


























































































































































































































































































































































































# [Manual Agent Loop](#manual-agent-loop)

When you need complete control over the agentic loop and tool execution, you can manage the agent flow yourself rather than using `prepareStep` and `stopWhen`. This approach gives you full flexibility over when and how tools are executed, message history management, and loop termination conditions.

This pattern is useful when you want to:

- Implement custom logic between tool calls
- Handle tool execution errors in specific ways
- Add custom logging or monitoring
- Integrate with external systems during the loop
- Have complete control over the conversation history

## [Example](#example)



``` ts
import  from '@ai-sdk/openai';import  from 'ai';import 'dotenv/config';import z from 'zod';
const getWeather = async (: ) =>  is $ degrees.`;};
const messages: ModelMessage[] = [  ,];
async function main() ),        }),        // add more tools here, omitting the execute function so you handle it yourself      },    });
    // Stream the response (only necessary for providing updates to the user)    for await (const chunk of result.fullStream) 
      if (chunk.type === 'tool-call')     }
    // Add LLM generated messages to the message history    const responseMessages = (await result.response).messages;    messages.push(...responseMessages);
    const finishReason = await result.finishReason;
    if (finishReason === 'tool-calls') , // update depending on the tool's output format              },            ],          });        }        // Handle other tool calls      }    } else );      break;    }  }}
main().catch(console.error);
```


## [Key Concepts](#key-concepts)

### [Message Management](#message-management)

The example maintains a `messages` array that tracks the entire conversation history. After each model response, the generated messages are added to this history:



``` ts
const responseMessages = (await result.response).messages;messages.push(...responseMessages);
```


### [Tool Execution Control](#tool-execution-control)

Tool execution is handled manually in the loop. When the model requests tool calls, you process each one individually:



``` ts
if (finishReason === 'tool-calls') ,          },        ],      });    }  }}
```


### [Loop Termination](#loop-termination)

The loop continues until the model stops requesting tool calls. You can customize this logic to implement your own termination conditions:



``` ts
if (finishReason === 'tool-calls')  else 
```


## [Extending This Example](#extending-this-example)

### [Custom Loop Control](#custom-loop-control)

Implement maximum iterations or time limits:



``` ts
let iterations = 0;const MAX_ITERATIONS = 10;
while (iterations < MAX_ITERATIONS) 
```


### [Parallel Tool Execution](#parallel-tool-execution)

Execute multiple tools in parallel for better performance:



``` ts
const toolPromises = toolCalls.map(async toolCall => ,        },      ],    };  }  // Handle other tools});
const toolResults = await Promise.all(toolPromises);messages.push(...toolResults.filter(Boolean));
```


This manual approach gives you complete control over the agentic loop while still leveraging the AI SDK's powerful streaming and tool calling capabilities.
















On this page









































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.