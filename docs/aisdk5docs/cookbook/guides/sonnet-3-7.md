AI SDK 5 is available now.










Menu


























































































































































































































































































































































































# [Get started with Claude 3.7 Sonnet](#get-started-with-claude-37-sonnet)


The [AI SDK](../../index.html) is a powerful TypeScript toolkit for building AI applications with large language models (LLMs) like Claude 3.7 Sonnet alongside popular frameworks like React, Next.js, Vue, Svelte, Node.js, and more.

## [Claude 3.7 Sonnet](#claude-37-sonnet)

Claude 3.7 Sonnet is Anthropic's most intelligent model to date and the first Claude model to offer extended thinking—the ability to solve complex problems with careful, step-by-step reasoning. With Claude 3.7 Sonnet, you can balance speed and quality by choosing between standard thinking for near-instant responses or extended thinking or advanced reasoning. Claude 3.7 Sonnet is state-of-the-art for coding, and delivers advancements in computer use, agentic capabilities, complex reasoning, and content generation. With frontier performance and more control over speed, Claude 3.7 Sonnet is a great choice for powering AI agents, especially customer-facing agents, and complex AI workflows.

## [Getting Started with the AI SDK](#getting-started-with-the-ai-sdk)

The AI SDK is the TypeScript toolkit designed to help developers build AI-powered applications with React, Next.js, Vue, Svelte, Node.js, and more. Integrating LLMs into applications is complicated and heavily dependent on the specific model provider you use.

The AI SDK abstracts away the differences between model providers, eliminates boilerplate code for building chatbots, and allows you to go beyond text output to generate rich, interactive components.

At the center of the AI SDK is [AI SDK Core](../../docs/ai-sdk-core/overview.html), which provides a unified API to call any LLM. The code snippet below is all you need to call Claude 3.7 Sonnet with the AI SDK:



``` ts
import  from '@ai-sdk/anthropic';import  from 'ai';
const  = await generateText();console.log(text); // text response
```


The unified interface also means that you can easily switch between providers by changing just two lines of code. For example, to use Claude 3.7 Sonnet via Amazon Bedrock:



``` ts
import  from '@ai-sdk/amazon-bedrock';import  from 'ai';
const  = await generateText();
```


### [Reasoning Ability](#reasoning-ability)

Claude 3.7 Sonnet introduces a new extended thinking—the ability to solve complex problems with careful, step-by-step reasoning. You can enable it using the `thinking` provider option and specifying a thinking budget in tokens:



``` ts
import  from '@ai-sdk/anthropic';import  from 'ai';
const  = await generateText(,    } satisfies AnthropicProviderOptions,  },});
console.log(reasoning); // reasoning textconsole.log(reasoningDetails); // reasoning details including redacted reasoningconsole.log(text); // text response
```


### [Building Interactive Interfaces](#building-interactive-interfaces)

AI SDK Core can be paired with [AI SDK UI](../../docs/ai-sdk-ui/overview.html), another powerful component of the AI SDK, to streamline the process of building chat, completion, and assistant interfaces with popular frameworks like Next.js, Nuxt, and SvelteKit.

AI SDK UI provides robust abstractions that simplify the complex tasks of managing chat streams and UI updates on the frontend, enabling you to develop dynamic AI-driven interfaces more efficiently.

With four main hooks — [`useChat`](../../docs/reference/ai-sdk-ui/use-chat.html), [`useCompletion`](../../docs/reference/ai-sdk-ui/use-completion.html), and [`useObject`](../../docs/reference/ai-sdk-ui/use-object.html) — you can incorporate real-time chat capabilities, text completions, streamed JSON, and interactive assistant features into your app.


In a new Next.js application, first install the AI SDK and the Anthropic provider:



``` geist-overflow-scroll-y
pnpm install ai @ai-sdk/anthropic
```










Then, create a route handler for the chat endpoint:












``` tsx
import  from '@ai-sdk/anthropic';import  from 'ai';
export async function POST(req: Request) :  = await req.json();
  const result = streamText(,      } satisfies AnthropicProviderOptions,    },  });
  return result.toUIMessageStreamResponse();}
```





You can forward the model's reasoning tokens to the client with `sendReasoning: true` in the `toUIMessageStreamResponse` method.



Finally, update the root page (`app/page.tsx`) to use the `useChat` hook:












``` tsx
'use client';
import  from '@ai-sdk/react';import  from 'ai';import  from 'react';
export default function Page()  = useChat(),  });
  const handleSubmit = (e: React.FormEvent) => );      setInput('');    }  };
  return (    <>      >                    ></div>;            }            // reasoning parts:            if (part.type === 'reasoning') ></pre>;            }          })}        </div>      ))}      <form onSubmit=>        <input          name="prompt"          value=          onChange=        />        <button type="submit">Send</button>      </form>    </>  );}
```





You can access the model's reasoning tokens with the `reasoning` part on the message `parts`.



The useChat hook on your root page (`app/page.tsx`) will make a request to your LLM provider endpoint (`app/api/chat/route.ts`) whenever the user submits a message. The messages are then displayed in the chat UI.

## [Get Started](#get-started)

Ready to dive in? Here's how you can begin:

1.  Explore the documentation at [ai-sdk.dev/docs](../../docs/introduction.html) to understand the capabilities of the AI SDK.
2.  Check out practical examples at [ai-sdk.dev/examples](../../cookbook.html) to see the SDK in action.
3.  Dive deeper with advanced guides on topics like Retrieval-Augmented Generation (RAG) at [ai-sdk.dev/docs/guides](../guides.html).

Claude 3.7 Sonnet opens new opportunities for reasoning-intensive AI applications. Start building today and leverage the power of advanced reasoning in your AI projects.
















On this page






























Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.