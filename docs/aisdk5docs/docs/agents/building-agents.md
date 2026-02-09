AI SDK 5 is available now.










Menu






















































































































































































































































































































































# [Building Agents](#building-agents)

The Agent class provides a structured way to encapsulate LLM configuration, tools, and behavior into reusable components. It handles the agent loop for you, allowing the LLM to call tools multiple times in sequence to accomplish complex tasks. Define agents once and use them across your application.

## [Why Use the Agent Class?](#why-use-the-agent-class)

When building AI applications, you often need to:

- **Reuse configurations** - Same model settings, tools, and prompts across different parts of your application
- **Maintain consistency** - Ensure the same behavior and capabilities throughout your codebase
- **Simplify API routes** - Reduce boilerplate in your endpoints
- **Type safety** - Get full TypeScript support for your agent's tools and outputs

The Agent class provides a single place to define your agent's behavior.

## [Creating an Agent](#creating-an-agent)

Define an agent by instantiating the Agent class with your desired configuration:



``` ts
import  from 'ai';
const myAgent = new Agent(,});
```


## [Configuration Options](#configuration-options)

The Agent class accepts all the same settings as `generateText` and `streamText`. Configure:

### [Model and System Prompt](#model-and-system-prompt)



``` ts
import  from 'ai';
const agent = new Agent();
```


### [Tools](#tools)

Provide tools that the agent can use to accomplish tasks:



``` ts
import  from 'ai';import  from 'zod';
const codeAgent = new Agent(),      execute: async () => ;      },    }),  },});
```


### [Loop Control](#loop-control)

By default, agents run for a single step (`stopWhen: stepCountIs(1)`). In each step, the model either generates text or calls a tool. If it generates text, the agent completes. If it calls a tool, the AI SDK executes that tool.

To let agents call multiple tools in sequence, configure `stopWhen` to allow more steps. After each tool execution, the agent triggers a new generation where the model can call another tool or generate text:



``` ts
import  from 'ai';
const agent = new Agent();
```


Each step represents one generation (which results in either text or a tool call). The loop continues until:

- The model generates text instead of calling a tool, or
- A stop condition is met

You can combine multiple conditions:



``` ts
import  from 'ai';
const agent = new Agent();
```


Learn more about [loop control and stop conditions](loop-control.html).

### [Tool Choice](#tool-choice)

Control how the agent uses tools:



``` ts
import  from 'ai';
const agent = new Agent(,  toolChoice: 'required', // Force tool use  // or toolChoice: 'none' to disable tools  // or toolChoice: 'auto' (default) to let the model decide});
```


You can also force the use of a specific tool:



``` ts
import  from 'ai';
const agent = new Agent(,  toolChoice: ,});
```


### [Structured Output](#structured-output)

Define structured output schemas:



``` ts
import  from 'ai';import  from 'zod';
const analysisAgent = new Agent(),  }),  stopWhen: stepCountIs(10),});
const  = await analysisAgent.generate();
```


## [Define Agent Behavior with System Prompts](#define-agent-behavior-with-system-prompts)

System prompts define your agent's behavior, personality, and constraints. They set the context for all interactions and guide how the agent responds to user queries and uses tools.

### [Basic System Prompts](#basic-system-prompts)

Set the agent's role and expertise:



``` ts
const agent = new Agent();
```


### [Detailed Behavioral Instructions](#detailed-behavioral-instructions)

Provide specific guidelines for agent behavior:



``` ts
const codeReviewAgent = new Agent();
```


### [Constrain Agent Behavior](#constrain-agent-behavior)

Set boundaries and ensure consistent behavior:



``` ts
const customerSupportAgent = new Agent(,});
```


### [Tool Usage Instructions](#tool-usage-instructions)

Guide how the agent should use available tools:



``` ts
const researchAgent = new Agent(,});
```


### [Format and Style Instructions](#format-and-style-instructions)

Control the output format and communication style:



``` ts
const technicalWriterAgent = new Agent();
```


## [Using an Agent](#using-an-agent)

Once defined, you can use your agent in three ways:

### [Generate Text](#generate-text)

Use `generate()` for one-time text generation:



``` ts
const result = await myAgent.generate();
console.log(result.text);
```


### [Stream Text](#stream-text)

Use `stream()` for streaming responses:



``` ts
const stream = myAgent.stream();
for await (const chunk of stream.textStream) 
```


### [Respond to UI Messages](#respond-to-ui-messages)

Use `respond()` to create API responses for client applications:



``` ts
// In your API route (e.g., app/api/chat/route.ts)import  from 'ai';
export async function POST(request: Request)  = await request.json();
  return myAgent.respond(),  });}
```


## [End-to-end Type Safety](#end-to-end-type-safety)

You can infer types for your Agent's `UIMessage`s:



``` ts
import  from 'ai';
const myAgent = new Agent();
// Infer the UIMessage type for UI components or persistenceexport type MyAgentUIMessage = InferAgentUIMessage<typeof myAgent>;
```


Use this type in your client components with `useChat`:












``` tsx
'use client';
import  from '@ai-sdk/react';import type  from '@/agent/my-agent';
export function Chat()  = useChat<MyAgentUIMessage>();  // Full type safety for your messages and tools}
```


## [Next Steps](#next-steps)

Now that you understand building agents, you can:

- Explore [workflow patterns](workflows.html) for structured patterns using core functions
- Learn about [loop control](loop-control.html) for advanced execution control
- See [manual loop examples](../../cookbook/node/manual-agent-loop.html) for custom workflow implementations
















On this page















































































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.