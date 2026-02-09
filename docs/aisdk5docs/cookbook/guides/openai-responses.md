AI SDK 5 is available now.










Menu


























































































































































































































































































































































































# [Get started with OpenAI Responses API](#get-started-with-openai-responses-api)


The [AI SDK](../../index.html) is a powerful TypeScript toolkit for building AI applications with large language models (LLMs) alongside popular frameworks like React, Next.js, Vue, Svelte, Node.js, and more.

## [OpenAI Responses API](#openai-responses-api)

OpenAI recently released the Responses API, a brand new way to build applications on OpenAI's platform. The new API offers a way to persist chat history, a web search tool for grounding LLM responses, file search tool for finding relevant files, and a computer use tool for building agents that can interact with and operate computers. Let's explore how to use the Responses API with the AI SDK.

## [Getting Started with the AI SDK](#getting-started-with-the-ai-sdk)

The AI SDK is the TypeScript toolkit designed to help developers build AI-powered applications with React, Next.js, Vue, Svelte, Node.js, and more. Integrating LLMs into applications is complicated and heavily dependent on the specific model provider you use.

The AI SDK abstracts away the differences between model providers, eliminates boilerplate code for building chatbots, and allows you to go beyond text output to generate rich, interactive components.

At the center of the AI SDK is [AI SDK Core](../../docs/ai-sdk-core/overview.html), which provides a unified API to call any LLM. The code snippet below is all you need to call GPT-4o with the new Responses API using the AI SDK:



``` ts
import  from 'ai';import  from '@ai-sdk/openai';
const  = await generateText();
```


### [Generating Structured Data](#generating-structured-data)

While text generation can be useful, you might want to generate structured JSON data. For example, you might want to extract information from text, classify data, or generate synthetic data. AI SDK Core provides two functions ([`generateObject`](../../docs/reference/ai-sdk-core/generate-object.html) and [`streamObject`](../../docs/reference/ai-sdk-core/stream-object.html)) to generate structured data, allowing you to constrain model outputs to a specific schema.



``` ts
import  from 'ai';import  from '@ai-sdk/openai';import  from 'zod';
const  = await generateObject()),      steps: z.array(z.string()),    }),  }),  prompt: 'Generate a lasagna recipe.',});
```


This code snippet will generate a type-safe recipe that conforms to the specified zod schema.

### [Using Tools with the AI SDK](#using-tools-with-the-ai-sdk)

The Responses API supports tool calling out of the box, allowing it to interact with external systems and perform discrete tasks. Here's an example of using tool calling with the AI SDK:



``` ts
import  from 'ai';import  from '@ai-sdk/openai';import  from 'zod';
const  = await generateText(),      execute: async () => (),    }),  },  stopWhen: stepCountIs(5), // enable multi-step 'agentic' LLM calls});
```


This example demonstrates how `stopWhen` transforms a single LLM call into an agent. The `stopWhen: stepCountIs(5)` parameter allows the model to autonomously call tools, analyze results, and make additional tool calls as needed - turning what would be a simple one-shot completion into an intelligent agent that can chain multiple actions together to complete complex tasks.

### [Web Search Tool](#web-search-tool)

The Responses API introduces a built-in tool for grounding responses called `webSearch`. With this tool, the model can access the internet to find relevant information for its responses.



``` ts
import  from '@ai-sdk/openai';import  from 'ai';
const result = await generateText(,});
console.log(result.text);console.log(result.sources);
```


The `webSearch` tool also allows you to specify query-specific metadata that can be used to improve the quality of the search results.



``` ts
import  from 'ai';
const result = await generateText(,    }),  },});
console.log(result.text);console.log(result.sources);
```


## [Using Persistence](#using-persistence)

With the Responses API, you can persist chat history with OpenAI across requests. This allows you to send just the user's last message and OpenAI can access the entire chat history:












``` tsx
import  from '@ai-sdk/openai';import  from 'ai';
const result1 = await generateText();
const result2 = await generateText(,  },});
```


## [Migrating from Completions API](#migrating-from-completions-api)

Migrating from the OpenAI Completions API (via the AI SDK) to the new Responses API is simple. To migrate, simply change your provider instance from `openai(modelId)` to `openai.responses(modelId)`:



``` ts
import  from 'ai';import  from '@ai-sdk/openai';
// Completions APIconst  = await generateText();
// Responses APIconst  = await generateText();
```


When using the Responses API, provider specific options that were previously specified on the model provider instance have now moved to the `providerOptions` object:



``` ts
import  from 'ai';import  from '@ai-sdk/openai';
// Completions APIconst  = await generateText(,  },});
// Responses APIconst  = await generateText(,  },});
```


## [Get Started](#get-started)

Ready to get started? Here's how you can dive in:

1.  Explore the documentation at [ai-sdk.dev/docs](../../docs/introduction.html) to understand the full capabilities of the AI SDK.
2.  Check out practical examples at [ai-sdk.dev/examples](../../cookbook.html) to see the SDK in action and get inspired for your own projects.
3.  Dive deeper with advanced guides on topics like Retrieval-Augmented Generation (RAG) and multi-modal chat at [ai-sdk.dev/docs/guides](../guides.html).
















On this page







































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.