AI SDK 5 is available now.










Menu


























































































































































































































































































































































































# [Get started with OpenAI GPT-5](#get-started-with-openai-gpt-5)


The [AI SDK](../../index.html) is a powerful TypeScript toolkit for building AI applications with large language models (LLMs) like OpenAI GPT-5 alongside popular frameworks like React, Next.js, Vue, Svelte, Node.js, and more.

## [OpenAI GPT-5](#openai-gpt-5)

OpenAI's GPT-5 represents their latest advancement in language models, offering powerful new features including verbosity control for tailored response lengths, integrated web search capabilities, reasoning summaries for transparency, and native support for text, images, audio, and PDFs. The model is available in three variants: `gpt-5`, `gpt-5-mini` for faster, more cost-effective processing, and `gpt-5-nano` for ultra-efficient operations.

### [Prompt Engineering for GPT-5](#prompt-engineering-for-gpt-5)

Here are the key strategies for effective prompting:

#### [Core Principles](#core-principles)

1.  **Be precise and unambiguous**: Avoid contradictory or ambiguous instructions. GPT-5 performs best with clear, explicit guidance.
2.  **Use structured prompts**: Leverage XML-like tags to organize different sections of your instructions for better clarity.
3.  **Natural language works best**: While being precise, write prompts as you would explain to a skilled colleague.

#### [Prompting Techniques](#prompting-techniques)

**1. Agentic Workflow Control**

- Adjust the `reasoning_effort` parameter to calibrate model autonomy
- Set clear stop conditions and define explicit tool call budgets
- Provide guidance on exploration depth and persistence



``` ts
// Example with reasoning effort controlconst result = await generateText(,  },});
```


**2. Structured Prompt Format** Use XML-like tags to organize your prompts:



``` undefined
```


**3. Tool Calling Best Practices**

- Use tool preambles to provide clear upfront plans
- Define safe vs. unsafe actions for different tools
- Create structured updates about tool call progress

**4. Verbosity Control**

- Use the `textVerbosity` parameter to control response length programmatically
- Override with natural language when needed for specific contexts
- Balance between conciseness and completeness

**5. Optimization Workflow**

- Start with a clear, simple prompt
- Test and identify areas of ambiguity or confusion
- Iteratively refine by removing contradictions
- Consider using OpenAI's Prompt Optimizer tool for complex prompts
- Document successful patterns for reuse

## [Getting Started with the AI SDK](#getting-started-with-the-ai-sdk)

The AI SDK is the TypeScript toolkit designed to help developers build AI-powered applications with React, Next.js, Vue, Svelte, Node.js, and more. Integrating LLMs into applications is complicated and heavily dependent on the specific model provider you use.

The AI SDK abstracts away the differences between model providers, eliminates boilerplate code for building chatbots, and allows you to go beyond text output to generate rich, interactive components.

At the center of the AI SDK is [AI SDK Core](../../docs/ai-sdk-core/overview.html), which provides a unified API to call any LLM. The code snippet below is all you need to call OpenAI GPT-5 with the AI SDK:



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

### [Verbosity Control](#verbosity-control)

One of GPT-5's new features is verbosity control, allowing you to adjust response length without modifying your prompt:



``` ts
import  from 'ai';import  from '@ai-sdk/openai';
// Concise responseconst  = await generateText(,  },});
// Detailed responseconst  = await generateText(,  },});
```


### [Web Search](#web-search)

GPT-5 can access real-time information through the integrated web search tool:



``` ts
import  from 'ai';import  from '@ai-sdk/openai';
const result = await generateText(),  },});
// Access URL sourcesconst sources = result.sources;
```


### [Reasoning Summaries](#reasoning-summaries)

For transparency into GPT-5's thought process, enable reasoning summaries:



``` ts
import  from '@ai-sdk/openai';import  from 'ai';
const result = streamText(,  },});
// Stream reasoning and text separatelyfor await (const part of result.fullStream)  else if (part.type === 'text-delta') }
```


### [Using Tools with the AI SDK](#using-tools-with-the-ai-sdk)

GPT-5 supports tool calling out of the box, allowing it to interact with external systems and perform discrete tasks. Here's an example of using tool calling with the AI SDK:



``` ts
import  from 'ai';import  from '@ai-sdk/openai';import  from 'zod';
const  = await generateText(),      execute: async () => (),    }),  },});
```


### [Building Interactive Interfaces](#building-interactive-interfaces)

AI SDK Core can be paired with [AI SDK UI](../../docs/ai-sdk-ui/overview.html), another powerful component of the AI SDK, to streamline the process of building chat, completion, and assistant interfaces with popular frameworks like Next.js, Nuxt, and SvelteKit.

AI SDK UI provides robust abstractions that simplify the complex tasks of managing chat streams and UI updates on the frontend, enabling you to develop dynamic AI-driven interfaces more efficiently.

With four main hooks — [`useChat`](../../docs/reference/ai-sdk-ui/use-chat.html), [`useCompletion`](../../docs/reference/ai-sdk-ui/use-completion.html), and [`useObject`](../../docs/reference/ai-sdk-ui/use-object.html) — you can incorporate real-time chat capabilities, text completions, streamed JSON, and interactive assistant features into your app.


In a new Next.js application, first install the AI SDK and the OpenAI provider:



``` geist-overflow-scroll-y
pnpm install ai @ai-sdk/openai @ai-sdk/react
```










Then, create a route handler for the chat endpoint:












``` tsx
import  from '@ai-sdk/openai';import  from 'ai';
// Allow responses up to 30 secondsexport const maxDuration = 30;
export async function POST(req: Request) :  = await req.json();
  const result = streamText();
  return result.toUIMessageStreamResponse();}
```


Finally, update the root page (`app/page.tsx`) to use the `useChat` hook:












``` tsx
'use client';
import  from '@ai-sdk/react';import  from 'react';
export default function Page()  = useChat();
  return (    <>      >                    ></span>;            }            return null;          })}        </div>      ))}      <form        onSubmit=);            setInput('');          }        }}      >        <input          name="prompt"          value=          onChange=        />        <button type="submit">Submit</button>      </form>    </>  );}
```


The useChat hook on your root page (`app/page.tsx`) will make a request to your AI provider endpoint (`app/api/chat/route.ts`) whenever the user submits a message. The messages are then displayed in the chat UI.

## [Get Started](#get-started)

Ready to get started? Here's how you can dive in:

1.  Explore the documentation at [ai-sdk.dev/docs](../../docs/introduction.html) to understand the full capabilities of the AI SDK.
2.  Check out practical examples at [ai-sdk.dev/cookbook](../../cookbook.html) to see the SDK in action and get inspired for your own projects.
3.  Dive deeper with advanced guides on topics like Retrieval-Augmented Generation (RAG) and multi-modal chat at [ai-sdk.dev/cookbook/guides](../guides.html).
















On this page























































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.