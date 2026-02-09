Agents: Building Agents

[](https://vercel.com/)

[

AI SDK



](../../index.html)

-   [Docs](../introduction.html)
-   [Cookbook](../../cookbook.html)
-   [Providers](../../providers/ai-sdk-providers.html)
-   [Playground](../../playground.html)
-   [
    
    AI ElementsAI Elements
    
    ](../../elements/overview.html)
-   [AI GatewayGateway](https://vercel.com/ai-gateway)

AI SDK 5 is available now.

[View Announcement](https://vercel.com/blog/ai-sdk-5)

Menu

[AI SDK by Vercel](../introduction.html)

[Foundations](../foundations.html)

[Overview](../foundations/overview.html)

[Providers and Models](../foundations/providers-and-models.html)

[Prompts](../foundations/prompts.html)

[Tools](../foundations/tools.html)

[Streaming](../foundations/streaming.html)

[Getting Started](../getting-started.html)

[Navigating the Library](../getting-started/navigating-the-library.html)

[Next.js App Router](../getting-started/nextjs-app-router.html)

[Next.js Pages Router](../getting-started/nextjs-pages-router.html)

[Svelte](../getting-started/svelte.html)

[Vue.js (Nuxt)](../getting-started/nuxt.html)

[Node.js](../getting-started/nodejs.html)

[Expo](../getting-started/expo.html)

[Agents](../agents.html)

[Agents](overview.html)

[Building Agents](building-agents.html)

[Workflow Patterns](workflows.html)

[Loop Control](loop-control.html)

[AI SDK Core](../ai-sdk-core.html)

[Overview](../ai-sdk-core/overview.html)

[Generating Text](../ai-sdk-core/generating-text.html)

[Generating Structured Data](../ai-sdk-core/generating-structured-data.html)

[Tool Calling](../ai-sdk-core/tools-and-tool-calling.html)

[Model Context Protocol (MCP) Tools](../ai-sdk-core/mcp-tools.html)

[Prompt Engineering](../ai-sdk-core/prompt-engineering.html)

[Settings](../ai-sdk-core/settings.html)

[Embeddings](../ai-sdk-core/embeddings.html)

[Image Generation](../ai-sdk-core/image-generation.html)

[Transcription](../ai-sdk-core/transcription.html)

[Speech](../ai-sdk-core/speech.html)

[Language Model Middleware](../ai-sdk-core/middleware.html)

[Provider & Model Management](../ai-sdk-core/provider-management.html)

[Error Handling](../ai-sdk-core/error-handling.html)

[Testing](../ai-sdk-core/testing.html)

[Telemetry](../ai-sdk-core/telemetry.html)

[AI SDK UI](../ai-sdk-ui.html)

[Overview](../ai-sdk-ui/overview.html)

[Chatbot](../ai-sdk-ui/chatbot.html)

[Chatbot Message Persistence](../ai-sdk-ui/chatbot-message-persistence.html)

[Chatbot Resume Streams](../ai-sdk-ui/chatbot-resume-streams.html)

[Chatbot Tool Usage](../ai-sdk-ui/chatbot-tool-usage.html)

[Generative User Interfaces](../ai-sdk-ui/generative-user-interfaces.html)

[Completion](../ai-sdk-ui/completion.html)

[Object Generation](../ai-sdk-ui/object-generation.html)

[Streaming Custom Data](../ai-sdk-ui/streaming-data.html)

[Error Handling](../ai-sdk-ui/error-handling.html)

[Transport](../ai-sdk-ui/transport.html)

[Reading UIMessage Streams](../ai-sdk-ui/reading-ui-message-streams.html)

[Message Metadata](../ai-sdk-ui/message-metadata.html)

[Stream Protocols](../ai-sdk-ui/stream-protocol.html)

[AI SDK RSC](../ai-sdk-rsc.html)

[Advanced](../advanced.html)

[Reference](../reference.html)

[AI SDK Core](../reference/ai-sdk-core.html)

[AI SDK UI](../reference/ai-sdk-ui.html)

[AI SDK RSC](../reference/ai-sdk-rsc.html)

[Stream Helpers](../reference/stream-helpers.html)

[AI SDK Errors](../reference/ai-sdk-errors.html)

[Migration Guides](../migration-guides.html)

[Troubleshooting](../troubleshooting.html)

[Agents](../agents.html)Building Agents

# [Building Agents](#building-agents)

The Agent class provides a structured way to encapsulate LLM configuration, tools, and behavior into reusable components. It handles the agent loop for you, allowing the LLM to call tools multiple times in sequence to accomplish complex tasks. Define agents once and use them across your application.

## [Why Use the Agent Class?](#why-use-the-agent-class)

When building AI applications, you often need to:

-   **Reuse configurations** - Same model settings, tools, and prompts across different parts of your application
-   **Maintain consistency** - Ensure the same behavior and capabilities throughout your codebase
-   **Simplify API routes** - Reduce boilerplate in your endpoints
-   **Type safety** - Get full TypeScript support for your agent's tools and outputs

The Agent class provides a single place to define your agent's behavior.

## [Creating an Agent](#creating-an-agent)

Define an agent by instantiating the Agent class with your desired configuration:

```ts
import { Experimental_Agent as Agent } from 'ai';


const myAgent = new Agent({
  model: 'openai/gpt-4o',
  system: 'You are a helpful assistant.',
  tools: {
    // Your tools here
  },
});
```

## [Configuration Options](#configuration-options)

The Agent class accepts all the same settings as `generateText` and `streamText`. Configure:

### [Model and System Prompt](#model-and-system-prompt)

```ts
import { Experimental_Agent as Agent } from 'ai';


const agent = new Agent({
  model: 'openai/gpt-4o',
  system: 'You are an expert software engineer.',
});
```

### [Tools](#tools)

Provide tools that the agent can use to accomplish tasks:

```ts
import { Experimental_Agent as Agent, tool } from 'ai';
import { z } from 'zod';


const codeAgent = new Agent({
  model: 'openai/gpt-4o',
  tools: {
    runCode: tool({
      description: 'Execute Python code',
      inputSchema: z.object({
        code: z.string(),
      }),
      execute: async ({ code }) => {
        // Execute code and return result
        return { output: 'Code executed successfully' };
      },
    }),
  },
});
```

### [Loop Control](#loop-control)

By default, agents run for a single step (`stopWhen: stepCountIs(1)`). In each step, the model either generates text or calls a tool. If it generates text, the agent completes. If it calls a tool, the AI SDK executes that tool.

To let agents call multiple tools in sequence, configure `stopWhen` to allow more steps. After each tool execution, the agent triggers a new generation where the model can call another tool or generate text:

```ts
import { Experimental_Agent as Agent, stepCountIs } from 'ai';


const agent = new Agent({
  model: 'openai/gpt-4o',
  stopWhen: stepCountIs(20), // Allow up to 20 steps
});
```

Each step represents one generation (which results in either text or a tool call). The loop continues until:

-   The model generates text instead of calling a tool, or
-   A stop condition is met

You can combine multiple conditions:

```ts
import { Experimental_Agent as Agent, stepCountIs } from 'ai';


const agent = new Agent({
  model: 'openai/gpt-4o',
  stopWhen: [
    stepCountIs(20), // Maximum 20 steps
    yourCustomCondition(), // Custom logic for when to stop
  ],
});
```

Learn more about [loop control and stop conditions](loop-control.html).

### [Tool Choice](#tool-choice)

Control how the agent uses tools:

```ts
import { Experimental_Agent as Agent } from 'ai';


const agent = new Agent({
  model: 'openai/gpt-4o',
  tools: {
    // your tools here
  },
  toolChoice: 'required', // Force tool use
  // or toolChoice: 'none' to disable tools
  // or toolChoice: 'auto' (default) to let the model decide
});
```

You can also force the use of a specific tool:

```ts
import { Experimental_Agent as Agent } from 'ai';


const agent = new Agent({
  model: 'openai/gpt-4o',
  tools: {
    weather: weatherTool,
    cityAttractions: attractionsTool,
  },
  toolChoice: {
    type: 'tool',
    toolName: 'weather', // Force the weather tool to be used
  },
});
```

### [Structured Output](#structured-output)

Define structured output schemas:

```ts
import { Experimental_Agent as Agent, Output, stepCountIs } from 'ai';
import { z } from 'zod';


const analysisAgent = new Agent({
  model: 'openai/gpt-4o',
  experimental_output: Output.object({
    schema: z.object({
      sentiment: z.enum(['positive', 'neutral', 'negative']),
      summary: z.string(),
      keyPoints: z.array(z.string()),
    }),
  }),
  stopWhen: stepCountIs(10),
});


const { experimental_output: output } = await analysisAgent.generate({
  prompt: 'Analyze customer feedback from the last quarter',
});
```

## [Define Agent Behavior with System Prompts](#define-agent-behavior-with-system-prompts)

System prompts define your agent's behavior, personality, and constraints. They set the context for all interactions and guide how the agent responds to user queries and uses tools.

### [Basic System Prompts](#basic-system-prompts)

Set the agent's role and expertise:

```ts
const agent = new Agent({
  model: 'openai/gpt-4o',
  system:
    'You are an expert data analyst. You provide clear insights from complex data.',
});
```

### [Detailed Behavioral Instructions](#detailed-behavioral-instructions)

Provide specific guidelines for agent behavior:

```ts
const codeReviewAgent = new Agent({
  model: 'openai/gpt-4o',
  system: `You are a senior software engineer conducting code reviews.


  Your approach:
  - Focus on security vulnerabilities first
  - Identify performance bottlenecks
  - Suggest improvements for readability and maintainability
  - Be constructive and educational in your feedback
  - Always explain why something is an issue and how to fix it`,
});
```

### [Constrain Agent Behavior](#constrain-agent-behavior)

Set boundaries and ensure consistent behavior:

```ts
const customerSupportAgent = new Agent({
  model: 'openai/gpt-4o',
  system: `You are a customer support specialist for an e-commerce platform.


  Rules:
  - Never make promises about refunds without checking the policy
  - Always be empathetic and professional
  - If you don't know something, say so and offer to escalate
  - Keep responses concise and actionable
  - Never share internal company information`,
  tools: {
    checkOrderStatus,
    lookupPolicy,
    createTicket,
  },
});
```

### [Tool Usage Instructions](#tool-usage-instructions)

Guide how the agent should use available tools:

```ts
const researchAgent = new Agent({
  model: 'openai/gpt-4o',
  system: `You are a research assistant with access to search and document tools.


  When researching:
  1. Always start with a broad search to understand the topic
  2. Use document analysis for detailed information
  3. Cross-reference multiple sources before drawing conclusions
  4. Cite your sources when presenting information
  5. If information conflicts, present both viewpoints`,
  tools: {
    webSearch,
    analyzeDocument,
    extractQuotes,
  },
});
```

### [Format and Style Instructions](#format-and-style-instructions)

Control the output format and communication style:

```ts
const technicalWriterAgent = new Agent({
  model: 'openai/gpt-4o',
  system: `You are a technical documentation writer.


  Writing style:
  - Use clear, simple language
  - Avoid jargon unless necessary
  - Structure information with headers and bullet points
  - Include code examples where relevant
  - Write in second person ("you" instead of "the user")


  Always format responses in Markdown.`,
});
```

## [Using an Agent](#using-an-agent)

Once defined, you can use your agent in three ways:

### [Generate Text](#generate-text)

Use `generate()` for one-time text generation:

```ts
const result = await myAgent.generate({
  prompt: 'What is the weather like?',
});


console.log(result.text);
```

### [Stream Text](#stream-text)

Use `stream()` for streaming responses:

```ts
const stream = myAgent.stream({
  prompt: 'Tell me a story',
});


for await (const chunk of stream.textStream) {
  console.log(chunk);
}
```

### [Respond to UI Messages](#respond-to-ui-messages)

Use `respond()` to create API responses for client applications:

```ts
// In your API route (e.g., app/api/chat/route.ts)
import { validateUIMessages } from 'ai';


export async function POST(request: Request) {
  const { messages } = await request.json();


  return myAgent.respond({
    messages: await validateUIMessages({ messages }),
  });
}
```

## [End-to-end Type Safety](#end-to-end-type-safety)

You can infer types for your Agent's `UIMessage`s:

```ts
import {
  Experimental_Agent as Agent,
  Experimental_InferAgentUIMessage as InferAgentUIMessage,
} from 'ai';


const myAgent = new Agent({
  // ... configuration
});


// Infer the UIMessage type for UI components or persistence
export type MyAgentUIMessage = InferAgentUIMessage<typeof myAgent>;
```

Use this type in your client components with `useChat`:

```tsx
'use client';


import { useChat } from '@ai-sdk/react';
import type { MyAgentUIMessage } from '@/agent/my-agent';


export function Chat() {
  const { messages } = useChat<MyAgentUIMessage>();
  // Full type safety for your messages and tools
}
```

## [Next Steps](#next-steps)

Now that you understand building agents, you can:

-   Explore [workflow patterns](workflows.html) for structured patterns using core functions
-   Learn about [loop control](loop-control.html) for advanced execution control
-   See [manual loop examples](../../cookbook/node/manual-agent-loop.html) for custom workflow implementations

[Previous

Agents

](overview.html)

[Next

Workflow Patterns

](workflows.html)

On this page

[Building Agents](#building-agents)

[Why Use the Agent Class?](#why-use-the-agent-class)

[Creating an Agent](#creating-an-agent)

[Configuration Options](#configuration-options)

[Model and System Prompt](#model-and-system-prompt)

[Tools](#tools)

[Loop Control](#loop-control)

[Tool Choice](#tool-choice)

[Structured Output](#structured-output)

[Define Agent Behavior with System Prompts](#define-agent-behavior-with-system-prompts)

[Basic System Prompts](#basic-system-prompts)

[Detailed Behavioral Instructions](#detailed-behavioral-instructions)

[Constrain Agent Behavior](#constrain-agent-behavior)

[Tool Usage Instructions](#tool-usage-instructions)

[Format and Style Instructions](#format-and-style-instructions)

[Using an Agent](#using-an-agent)

[Generate Text](#generate-text)

[Stream Text](#stream-text)

[Respond to UI Messages](#respond-to-ui-messages)

[End-to-end Type Safety](#end-to-end-type-safety)

[Next Steps](#next-steps)

Deploy and Scale AI Apps with Vercel.

Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:

-   OpenAI
-   Photoroom
-   ![leonardo-ai Logo](../../_next/logo-leonardo-ai-light.svg)![leonardo-ai Logo](../../_next/logo-leonardo-ai-dark.svg)
-   ![zapier Logo](../../_next/logo-zapier-light.svg)![zapier Logo](../../_next/logo-zapier-dark.svg)

[](https://vercel.com/contact/sales?utm_source=ai_sdk&utm_medium=web&utm_campaign=contact_sales_cta&utm_content=talk_to_an_expert_sdk_docs)

#### Resources

[Docs](../introduction.html)[Cookbook](../../cookbook.html)[Providers](../../providers/ai-sdk-providers.html)[Showcase](../../showcase.html)[GitHub](https://github.com/vercel/ai)[Discussions](https://github.com/vercel/ai/discussions)

#### More

[Playground](../../playground.html)[](https://v0.dev)[Contact Sales](https://vercel.com/contact/sales)

#### About Vercel

[Next.js + Vercel](https://vercel.com/frameworks/nextjs)[Open Source Software](https://vercel.com/oss)[GitHub](https://github.com/vercel)[X](https://x.com/vercel)

#### Legal

[Privacy Policy](https://vercel.com/legal/privacy-policy)

© 2025 Vercel, Inc.