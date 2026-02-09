AI SDK 5 is available now.










Menu


























































































































































































































































































































































































# [Get started with Llama 3.1](#get-started-with-llama-31)




The current generation of Llama models is 3.3. Please note that while this guide focuses on Llama 3.1, the newer Llama 3.3 models are now available and may offer improved capabilities. The concepts and integration techniques described here remain applicable, though you may want to use the latest generation models for optimal performance.




The [AI SDK](../../index.html) is a powerful TypeScript toolkit for building AI application with large language models (LLMs) like Llama 3.1 alongside popular frameworks like React, Next.js, Vue, Svelte, Node.js, and more

## [Llama 3.1](#llama-31)

The release of Meta's Llama 3.1 is an important moment in AI development. As the first state-of-the-art open weight AI model, Llama 3.1 is helping accelerate developers building AI apps. Available in 8B, 70B, and 405B sizes, these instruction-tuned models work well for tasks like dialogue generation, translation, reasoning, and code generation.

## [Benchmarks](#benchmarks)

Llama 3.1 surpasses most available open-source chat models on common industry benchmarks and even outperforms some closed-source models, offering superior performance in language nuances, contextual understanding, and complex multi-step tasks. The models' refined post-training processes significantly improve response alignment, reduce false refusal rates, and enhance answer diversity, making Llama 3.1 a powerful and accessible tool for building generative AI applications.


## [Choosing Model Size](#choosing-model-size)

Llama 3.1 includes a new 405B parameter model, becoming the largest open-source model available today. This model is designed to handle the most complex and demanding tasks.

When choosing between the different sizes of Llama 3.1 models (405B, 70B, 8B), consider the trade-off between performance and computational requirements. The 405B model offers the highest accuracy and capability for complex tasks but requires significant computational resources. The 70B model provides a good balance of performance and efficiency for most applications, while the 8B model is suitable for simpler tasks or resource-constrained environments where speed and lower computational overhead are priorities.

## [Getting Started with the AI SDK](#getting-started-with-the-ai-sdk)

The AI SDK is the TypeScript toolkit designed to help developers build AI-powered applications with React, Next.js, Vue, Svelte, Node.js, and more. Integrating LLMs into applications is complicated and heavily dependent on the specific model provider you use.

The AI SDK abstracts away the differences between model providers, eliminates boilerplate code for building chatbots, and allows you to go beyond text output to generate rich, interactive components.




``` ts
import  from '@ai-sdk/deepinfra';import  from 'ai';
const  = await generateText();
```





Llama 3.1 is available to use with many AI SDK providers including [DeepInfra](../../providers/ai-sdk-providers/deepinfra.html), [Amazon Bedrock](../../providers/ai-sdk-providers/amazon-bedrock.html), [Baseten](../../providers/ai-sdk-providers/baseten.html) [Fireworks](../../providers/ai-sdk-providers/fireworks.html), and more.



AI SDK Core abstracts away the differences between model providers, allowing you to focus on building great applications. Prefer to use [Amazon Bedrock](../../providers/ai-sdk-providers/amazon-bedrock.html)? The unified interface also means that you can easily switch between models by changing just two lines of code.



``` tsx
import  from 'ai';import  from '@ai-sdk/amazon-bedrock';
const  = await generateText();
```


### [Streaming the Response](#streaming-the-response)

To stream the model's response as it's being generated, update your code snippet to use the [`streamText`](../../docs/reference/ai-sdk-core/stream-text.html) function.



``` tsx
import  from 'ai';import  from '@ai-sdk/deepinfra';
const  = streamText();
```


### [Generating Structured Data](#generating-structured-data)

While text generation can be useful, you might want to generate structured JSON data. For example, you might want to extract information from text, classify data, or generate synthetic data. AI SDK Core provides two functions ([`generateObject`](../../docs/reference/ai-sdk-core/generate-object.html) and [`streamObject`](../../docs/reference/ai-sdk-core/stream-object.html)) to generate structured data, allowing you to constrain model outputs to a specific schema.



``` ts
import  from 'ai';import  from '@ai-sdk/deepinfra';import  from 'zod';
const  = await generateObject()),      steps: z.array(z.string()),    }),  }),  prompt: 'Generate a lasagna recipe.',});
```


This code snippet will generate a type-safe recipe that conforms to the specified zod schema.

### [Tools](#tools)

While LLMs have incredible generation capabilities, they struggle with discrete tasks (e.g. mathematics) and interacting with the outside world (e.g. getting the weather). The solution: tools, which are like programs that you provide to the model, which it can choose to call as necessary.

### [Using Tools with the AI SDK](#using-tools-with-the-ai-sdk)

The AI SDK supports tool usage across several of its functions, including [`generateText`](../../docs/reference/ai-sdk-core/generate-text.html) and [`streamUI`](../../docs/reference/ai-sdk-rsc/stream-ui.html). By passing one or more tools to the `tools` parameter, you can extend the capabilities of LLMs, allowing them to perform discrete tasks and interact with external systems.

Here's an example of how you can use a tool with the AI SDK and Llama 3.1:



``` ts
import  from 'ai';import  from '@ai-sdk/deepinfra';import  from 'zod';
const  = await generateText(),      execute: async () => (),    }),  },});
```


In this example, the `getWeather` tool allows the model to fetch real-time weather data, enhancing its ability to provide accurate and up-to-date information.

### [Agents](#agents)

Agents take your AI applications a step further by allowing models to execute multiple steps (i.e. tools) in a non-deterministic way, making decisions based on context and user input.

Agents use LLMs to choose the next step in a problem-solving process. They can reason at each step and make decisions based on the evolving context.

### [Implementing Agents with the AI SDK](#implementing-agents-with-the-ai-sdk)

The AI SDK supports agent implementation through the `maxSteps` parameter. This allows the model to make multiple decisions and tool calls in a single interaction.

Here's an example of an agent that solves math problems:



``` tsx
import  from 'ai';import  from '@ai-sdk/deepinfra';import * as mathjs from 'mathjs';import  from 'zod';
const problem =  'Calculate the profit for a day if revenue is $5000 and expenses are $3500.';
const  = await generateText(),      execute: async () => mathjs.evaluate(expression),    }),  },  maxSteps: 5,});
```


In this example, the agent can use the calculator tool multiple times if needed, reasoning through the problem step by step.

### [Building Interactive Interfaces](#building-interactive-interfaces)

AI SDK Core can be paired with [AI SDK UI](../../docs/ai-sdk-ui/overview.html), another powerful component of the AI SDK, to streamline the process of building chat, completion, and assistant interfaces with popular frameworks like Next.js, Nuxt, and SvelteKit.

AI SDK UI provides robust abstractions that simplify the complex tasks of managing chat streams and UI updates on the frontend, enabling you to develop dynamic AI-driven interfaces more efficiently.

With four main hooks — [`useChat`](../../docs/reference/ai-sdk-ui/use-chat.html), [`useCompletion`](../../docs/reference/ai-sdk-ui/use-completion.html), and [`useObject`](../../docs/reference/ai-sdk-ui/use-object.html) — you can incorporate real-time chat capabilities, text completions, streamed JSON, and interactive assistant features into your app.













``` tsx
import  from '@ai-sdk/deepinfra';import  from 'ai';
// Allow streaming responses up to 30 secondsexport const maxDuration = 30;
export async function POST(req: Request)  = await req.json();
  const result = streamText();
  return result.toUIMessageStreamResponse();}
```













``` tsx
'use client';
import  from '@ai-sdk/react';
export default function Page()  = useChat();
  return (    <>      >                            </div>      ))}      <form onSubmit=>        <input name="prompt" value= onChange= />        <button type="submit">Submit</button>      </form>    </>  );}
```


The useChat hook on your root page (`app/page.tsx`) will make a request to your AI provider endpoint (`app/api/chat/route.ts`) whenever the user submits a message. The messages are then streamed back in real-time and displayed in the chat UI.

This enables a seamless chat experience where the user can see the AI response as soon as it is available, without having to wait for the entire response to be received.

### [Going Beyond Text](#going-beyond-text)

The AI SDK's React Server Components (RSC) API enables you to create rich, interactive interfaces that go beyond simple text generation. With the [`streamUI`](../../docs/reference/ai-sdk-rsc/stream-ui.html) function, you can dynamically stream React components from the server to the client.

Let's dive into how you can leverage tools with [AI SDK RSC](../../docs/ai-sdk-rsc/overview.html) to build a generative user interface with Next.js (App Router).

First, create a Server Action.












``` tsx
'use server';
import  from '@ai-sdk/rsc';import  from '@ai-sdk/deepinfra';import  from 'zod';
export async function streamComponent() ) => <div></div>,    tools: ),        generate: async function* ()  is .            </div>          );        },      },    },  });  return result.value;}
```


In this example, if the model decides to use the `getWeather` tool, it will first yield a `div` while fetching the weather data, then return a weather component with the fetched data (note: static data in this example). This allows for a more dynamic and responsive UI that can adapt based on the AI's decisions and external data.

On the frontend, you can call this Server Action like any other asynchronous function in your application. In this case, the function returns a regular React component.












``` tsx
'use client';
import  from 'react';import  from './actions';
export default function Page() }      >        <button>Stream Component</button>      </form>      <div></div>    </div>  );}
```



## [Migrate from OpenAI](#migrate-from-openai)

One of the key advantages of the AI SDK is its unified API, which makes it incredibly easy to switch between different AI models and providers. This flexibility is particularly useful when you want to migrate from one model to another, such as moving from OpenAI's GPT models to Meta's Llama models hosted on DeepInfra.

Here's how simple the migration process can be:

**OpenAI Example:**



``` tsx
import  from 'ai';import  from '@ai-sdk/openai';
const  = await generateText();
```


**Llama on DeepInfra Example:**



``` tsx
import  from 'ai';import  from '@ai-sdk/deepinfra';
const  = await generateText();
```


Thanks to the unified API, the core structure of the code remains the same. The main differences are:

1.  Creating a DeepInfra client
2.  Changing the model name from `openai("gpt-4.1")` to `deepinfra("meta-llama/Meta-Llama-3.1-70B-Instruct")`.

With just these few changes, you've migrated from using OpenAI's GPT-4-Turbo to Meta's Llama 3.1 hosted on DeepInfra. The `generateText` function and its usage remain identical, showcasing the power of the AI SDK's unified API.

This feature allows you to easily experiment with different models, compare their performance, and choose the best one for your specific use case without having to rewrite large portions of your codebase.

## [Prompt Engineering and Fine-tuning](#prompt-engineering-and-fine-tuning)

While the Llama 3.1 family of models are powerful out-of-the-box, their performance can be enhanced through effective prompt engineering and fine-tuning techniques.

### [Prompt Engineering](#prompt-engineering)

Prompt engineering is the practice of crafting input prompts to elicit desired outputs from language models. It involves structuring and phrasing prompts in ways that guide the model towards producing more accurate, relevant, and coherent responses.

For more information on prompt engineering techniques (specific to Llama models), check out these resources:


### [Fine-tuning](#fine-tuning)

Fine-tuning involves further training a pre-trained model on a specific dataset or task to customize its performance for particular use cases. This process allows you to adapt Llama 3.1 to your specific domain or application, potentially improving its accuracy and relevance for your needs.

To learn more about fine-tuning Llama models, check out these resources:


## [Conclusion](#conclusion)

The AI SDK offers a powerful and flexible way to integrate cutting-edge AI models like Llama 3.1 into your applications. With AI SDK Core, you can seamlessly switch between different AI models and providers by changing just two lines of code. This flexibility allows for quick experimentation and adaptation, reducing the time required to change models from days to minutes.

The AI SDK ensures that your application remains clean and modular, accelerating development and future-proofing against the rapidly evolving landscape.

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