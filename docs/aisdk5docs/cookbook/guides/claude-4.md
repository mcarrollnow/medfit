AI SDK 5 is available now.










Menu


























































































































































































































































































































































































# [Get started with Claude 4](#get-started-with-claude-4)

With the release of Claude 4, there has never been a better time to start building AI applications, particularly those that require complex reasoning capabilities and advanced intelligence.

The [AI SDK](../../index.html) is a powerful TypeScript toolkit for building AI applications with large language models (LLMs) like Claude 4 alongside popular frameworks like React, Next.js, Vue, Svelte, Node.js, and more.

## [Claude 4](#claude-4)

Claude 4 is Anthropic's most advanced model family to date, offering exceptional capabilities across reasoning, instruction following, coding, and knowledge tasks. Available in two variants—Sonnet and Opus—Claude 4 delivers state-of-the-art performance with enhanced reliability and control. Claude 4 builds on the extended thinking capabilities introduced in Claude 3.7, allowing for even more sophisticated problem-solving through careful, step-by-step reasoning.

Claude 4 excels at complex reasoning, code generation and analysis, detailed content creation, and agentic capabilities, making it ideal for powering sophisticated AI workflows, customer-facing agents, and applications requiring nuanced understanding and responses. Claude Opus 4 is an excellent coding model, leading on SWE-bench (72.5%) and Terminal-bench (43.2%), with the ability to sustain performance on long-running tasks that require focused effort and thousands of steps. Claude Sonnet 4 significantly improves on Sonnet 3.7, excelling in coding with 72.7% on SWE-bench while balancing performance and efficiency.

### [Prompt Engineering for Claude 4 Models](#prompt-engineering-for-claude-4-models)

Claude 4 models respond well to clear, explicit instructions. The following best practices can help achieve optimal performance:

1.  **Provide explicit instructions**: Clearly state what you want the model to do, including specific steps or formats for the response.
2.  **Include context and motivation**: Explain why a task is being performed to help the model better understand the underlying goals.
3.  **Avoid negative examples**: When providing examples, only demonstrate the behavior you want to see, not what you want to avoid.

## [Getting Started with the AI SDK](#getting-started-with-the-ai-sdk)

The AI SDK is the TypeScript toolkit designed to help developers build AI-powered applications with React, Next.js, Vue, Svelte, Node.js, and more. Integrating LLMs into applications is complicated and heavily dependent on the specific model provider you use.

The AI SDK abstracts away the differences between model providers, eliminates boilerplate code for building chatbots, and allows you to go beyond text output to generate rich, interactive components.

At the center of the AI SDK is [AI SDK Core](../../docs/ai-sdk-core/overview.html), which provides a unified API to call any LLM. The code snippet below is all you need to call Claude 4 Sonnet with the AI SDK:



``` ts
import  from '@ai-sdk/anthropic';import  from 'ai';
const  = await generateText();console.log(text);
```


### [Reasoning Ability](#reasoning-ability)

Claude 4 enhances the extended thinking capabilities first introduced in Claude 3.7 Sonnet—the ability to solve complex problems with careful, step-by-step reasoning. Additionally, both Opus 4 and Sonnet 4 can now use tools during extended thinking, allowing Claude to alternate between reasoning and tool use to improve responses. You can enable extended thinking using the `thinking` provider option and specifying a thinking budget in tokens. For interleaved thinking (where Claude can think in between tool calls) you'll need to enable a beta feature using the `anthropic-beta` header:



``` ts
import  from '@ai-sdk/anthropic';import  from 'ai';
const  = await generateText(,    } satisfies AnthropicProviderOptions,  },  headers: ,});
console.log(text); // text responseconsole.log(reasoningText); // reasoning textconsole.log(reasoning); // reasoning details including redacted reasoning
```


### [Building Interactive Interfaces](#building-interactive-interfaces)

AI SDK Core can be paired with [AI SDK UI](../../docs/ai-sdk-ui/overview.html), another powerful component of the AI SDK, to streamline the process of building chat, completion, and assistant interfaces with popular frameworks like Next.js, Nuxt, SvelteKit, and SolidStart.

AI SDK UI provides robust abstractions that simplify the complex tasks of managing chat streams and UI updates on the frontend, enabling you to develop dynamic AI-driven interfaces more efficiently.

With four main hooks — [`useChat`](../../docs/reference/ai-sdk-ui/use-chat.html), [`useCompletion`](../../docs/reference/ai-sdk-ui/use-completion.html), [`useObject`](../../docs/reference/ai-sdk-ui/use-object.html), and [`useAssistant`](https://ai-sdk.dev/docs/reference/ai-sdk-ui/use-assistant) — you can incorporate real-time chat capabilities, text completions, streamed JSON, and interactive assistant features into your app.


In a new Next.js application, first install the AI SDK and the Anthropic provider:



``` geist-overflow-scroll-y
pnpm install ai @ai-sdk/anthropic
```










Then, create a route handler for the chat endpoint:












``` tsx
import  from '@ai-sdk/anthropic';import  from 'ai';
export async function POST(req: Request) :  = await req.json();
  const result = streamText(,    providerOptions: ,      } satisfies AnthropicProviderOptions,    },  });
  return result.toUIMessageStreamResponse();}
```





You can forward the model's reasoning tokens to the client with `sendReasoning: true` in the `toUIMessageStreamResponse` method.



Finally, update the root page (`app/page.tsx`) to use the `useChat` hook:












``` tsx
'use client';
import  from '@ai-sdk/react';import  from 'ai';import  from 'react';
export default function Page()  = useChat(),  });
  const handleSubmit = (e: React.FormEvent) => );      setInput('');    }  };
  return (    <div className="flex flex-col h-screen max-w-2xl mx-auto p-4">      <div className="flex-1 overflow-y-auto space-y-4 mb-4">                    className=`}          >            <p className="font-semibold">                          </p>             className="mt-1">                                      </div>                );              }              if (part.type === 'reasoning')                     className="bg-gray-100 p-2 rounded mt-2 text-xs overflow-x-auto"                  >                    <details>                      <summary className="cursor-pointer">                        View reasoning                      </summary>                                          </details>                  </pre>                );              }            })}          </div>        ))}      </div>      <form onSubmit= className="flex gap-2">        <input          name="prompt"          value=          onChange=          className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"          placeholder="Ask Claude 4 something..."        />        <button          type="submit"          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"        >          Send        </button>      </form>    </div>  );}
```





You can access the model's reasoning tokens with the `reasoning` part on the message `parts`. The reasoning text is available in the `text` property of the reasoning part.



The useChat hook on your root page (`app/page.tsx`) will make a request to your LLM provider endpoint (`app/api/chat/route.ts`) whenever the user submits a message. The messages are then displayed in the chat UI.

### [Claude 4 Model Variants](#claude-4-model-variants)

Claude 4 is available in two variants, each optimized for different use cases:

- **Claude Sonnet 4**: Balanced performance suitable for most enterprise applications, with significant improvements over Sonnet 3.7.
- **Claude Opus 4**: Anthropic's most powerful model and the best coding model available. Excels at sustained performance on long-running tasks that require focused effort and thousands of steps, with the ability to work continuously for several hours.

## [Get Started](#get-started)

Ready to dive in? Here's how you can begin:

1.  Explore the documentation at [ai-sdk.dev/docs](../../docs/introduction.html) to understand the capabilities of the AI SDK.
2.  Check out practical examples at [ai-sdk.dev/examples](../../cookbook.html) to see the SDK in action.
3.  Dive deeper with advanced guides on topics like Retrieval-Augmented Generation (RAG) at [ai-sdk.dev/docs/guides](../guides.html).
















On this page






































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.