Agents: Loop Control

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

[Agents](../agents.html)Loop Control

# [Loop Control](#loop-control)

You can control both the execution flow and the settings at each step of the agent loop. The AI SDK provides built-in loop control through two parameters: `stopWhen` for defining stopping conditions and `prepareStep` for modifying settings (model, tools, messages, and more) between steps.

## [Stop Conditions](#stop-conditions)

The `stopWhen` parameter controls when to stop execution when there are tool results in the last step. By default, agents stop after a single step using `stepCountIs(1)`.

When you provide `stopWhen`, the agent continues executing after tool calls until a stopping condition is met. When the condition is an array, execution stops when any of the conditions are met.

### [Use Built-in Conditions](#use-built-in-conditions)

The AI SDK provides several built-in stopping conditions:

```ts
import { Experimental_Agent as Agent, stepCountIs } from 'ai';


const agent = new Agent({
  model: 'openai/gpt-4o',
  tools: {
    // your tools
  },
  stopWhen: stepCountIs(20), // Stop after 20 steps maximum
});


const result = await agent.generate({
  prompt: 'Analyze this dataset and create a summary report',
});
```

### [Combine Multiple Conditions](#combine-multiple-conditions)

Combine multiple stopping conditions. The loop stops when it meets any condition:

```ts
import { Experimental_Agent as Agent, stepCountIs, hasToolCall } from 'ai';


const agent = new Agent({
  model: 'openai/gpt-4o',
  tools: {
    // your tools
  },
  stopWhen: [
    stepCountIs(20), // Maximum 20 steps
    hasToolCall('someTool'), // Stop after calling 'someTool'
  ],
});


const result = await agent.generate({
  prompt: 'Research and analyze the topic',
});
```

### [Create Custom Conditions](#create-custom-conditions)

Build custom stopping conditions for specific requirements:

```ts
import { Experimental_Agent as Agent, StopCondition, ToolSet } from 'ai';


const tools = {
  // your tools
} satisfies ToolSet;


const hasAnswer: StopCondition<typeof tools> = ({ steps }) => {
  // Stop when the model generates text containing "ANSWER:"
  return steps.some(step => step.text?.includes('ANSWER:')) ?? false;
};


const agent = new Agent({
  model: 'openai/gpt-4o',
  tools,
  stopWhen: hasAnswer,
});


const result = await agent.generate({
  prompt: 'Find the answer and respond with "ANSWER: [your answer]"',
});
```

Custom conditions receive step information across all steps:

```ts
const budgetExceeded: StopCondition<typeof tools> = ({ steps }) => {
  const totalUsage = steps.reduce(
    (acc, step) => ({
      inputTokens: acc.inputTokens + (step.usage?.inputTokens ?? 0),
      outputTokens: acc.outputTokens + (step.usage?.outputTokens ?? 0),
    }),
    { inputTokens: 0, outputTokens: 0 },
  );


  const costEstimate =
    (totalUsage.inputTokens * 0.01 + totalUsage.outputTokens * 0.03) / 1000;
  return costEstimate > 0.5; // Stop if cost exceeds $0.50
};
```

## [Prepare Step](#prepare-step)

The `prepareStep` callback runs before each step in the loop and defaults to the initial settings if you don't return any changes. Use it to modify settings, manage context, or implement dynamic behavior based on execution history.

### [Dynamic Model Selection](#dynamic-model-selection)

Switch models based on step requirements:

```ts
import { Experimental_Agent as Agent } from 'ai';


const agent = new Agent({
  model: 'openai/gpt-4o-mini', // Default model
  tools: {
    // your tools
  },
  prepareStep: async ({ stepNumber, messages }) => {
    // Use a stronger model for complex reasoning after initial steps
    if (stepNumber > 2 && messages.length > 10) {
      return {
        model: 'openai/gpt-4o',
      };
    }
    // Continue with default settings
    return {};
  },
});


const result = await agent.generate({
  prompt: '...',
});
```

### [Context Management](#context-management)

Manage growing conversation history in long-running loops:

```ts
import { Experimental_Agent as Agent } from 'ai';


const agent = new Agent({
  model: 'openai/gpt-4o',
  tools: {
    // your tools
  },
  prepareStep: async ({ messages }) => {
    // Keep only recent messages to stay within context limits
    if (messages.length > 20) {
      return {
        messages: [
          messages[0], // Keep system message
          ...messages.slice(-10), // Keep last 10 messages
        ],
      };
    }
    return {};
  },
});


const result = await agent.generate({
  prompt: '...',
});
```

### [Tool Selection](#tool-selection)

Control which tools are available at each step:

```ts
import { Experimental_Agent as Agent } from 'ai';


const agent = new Agent({
  model: 'openai/gpt-4o',
  tools: {
    search: searchTool,
    analyze: analyzeTool,
    summarize: summarizeTool,
  },
  prepareStep: async ({ stepNumber, steps }) => {
    // Search phase (steps 0-2)
    if (stepNumber <= 2) {
      return {
        activeTools: ['search'],
        toolChoice: 'required',
      };
    }


    // Analysis phase (steps 3-5)
    if (stepNumber <= 5) {
      return {
        activeTools: ['analyze'],
      };
    }


    // Summary phase (step 6+)
    return {
      activeTools: ['summarize'],
      toolChoice: 'required',
    };
  },
});


const result = await agent.generate({
  prompt: '...',
});
```

You can also force a specific tool to be used:

```ts
prepareStep: async ({ stepNumber }) => {
  if (stepNumber === 0) {
    // Force the search tool to be used first
    return {
      toolChoice: { type: 'tool', toolName: 'search' },
    };
  }


  if (stepNumber === 5) {
    // Force the summarize tool after analysis
    return {
      toolChoice: { type: 'tool', toolName: 'summarize' },
    };
  }


  return {};
};
```

### [Message Modification](#message-modification)

Transform messages before sending them to the model:

```ts
import { Experimental_Agent as Agent } from 'ai';


const agent = new Agent({
  model: 'openai/gpt-4o',
  tools: {
    // your tools
  },
  prepareStep: async ({ messages, stepNumber }) => {
    // Summarize tool results to reduce token usage
    const processedMessages = messages.map(msg => {
      if (msg.role === 'tool' && msg.content.length > 1000) {
        return {
          ...msg,
          content: summarizeToolResult(msg.content),
        };
      }
      return msg;
    });


    return { messages: processedMessages };
  },
});


const result = await agent.generate({
  prompt: '...',
});
```

## [Access Step Information](#access-step-information)

Both `stopWhen` and `prepareStep` receive detailed information about the current execution:

```ts
prepareStep: async ({
  model, // Current model configuration
  stepNumber, // Current step number (0-indexed)
  steps, // All previous steps with their results
  messages, // Messages to be sent to the model
}) => {
  // Access previous tool calls and results
  const previousToolCalls = steps.flatMap(step => step.toolCalls);
  const previousResults = steps.flatMap(step => step.toolResults);


  // Make decisions based on execution history
  if (previousToolCalls.some(call => call.toolName === 'dataAnalysis')) {
    return {
      toolChoice: { type: 'tool', toolName: 'reportGenerator' },
    };
  }


  return {};
},
```

## [Manual Loop Control](#manual-loop-control)

For scenarios requiring complete control over the agent loop, you can use AI SDK Core functions (`generateText` and `streamText`) to implement your own loop management instead of using `stopWhen` and `prepareStep`. This approach provides maximum flexibility for complex workflows.

### [Implementing a Manual Loop](#implementing-a-manual-loop)

Build your own agent loop when you need full control over execution:

```ts
import { generateText, ModelMessage } from 'ai';


const messages: ModelMessage[] = [{ role: 'user', content: '...' }];


let step = 0;
const maxSteps = 10;


while (step < maxSteps) {
  const result = await generateText({
    model: 'openai/gpt-4o',
    messages,
    tools: {
      // your tools here
    },
  });


  messages.push(...result.response.messages);


  if (result.text) {
    break; // Stop when model generates text
  }


  step++;
}
```

This manual approach gives you complete control over:

-   Message history management
-   Step-by-step decision making
-   Custom stopping conditions
-   Dynamic tool and model selection
-   Error handling and recovery

[Learn more about manual agent loops in the cookbook](../../cookbook/node/manual-agent-loop.html).

[Previous

Workflow Patterns

](workflows.html)

[Next

AI SDK Core

](../ai-sdk-core.html)

On this page

[Loop Control](#loop-control)

[Stop Conditions](#stop-conditions)

[Use Built-in Conditions](#use-built-in-conditions)

[Combine Multiple Conditions](#combine-multiple-conditions)

[Create Custom Conditions](#create-custom-conditions)

[Prepare Step](#prepare-step)

[Dynamic Model Selection](#dynamic-model-selection)

[Context Management](#context-management)

[Tool Selection](#tool-selection)

[Message Modification](#message-modification)

[Access Step Information](#access-step-information)

[Manual Loop Control](#manual-loop-control)

[Implementing a Manual Loop](#implementing-a-manual-loop)

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