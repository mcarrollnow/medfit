AI SDK 5 is available now.










Menu


























































































































































































































































































































































































# [Get started with Gemini 2.5](#get-started-with-gemini-25)


The [AI SDK](../../index.html) is a powerful TypeScript toolkit for building AI applications with large language models (LLMs) like Gemini 2.5 alongside popular frameworks like React, Next.js, Vue, Svelte, Node.js, and more.

## [Gemini 2.5](#gemini-25)

Gemini 2.5 is Google's most advanced model family to date, offering exceptional capabilities across reasoning, instruction following, coding, and knowledge tasks. The Gemini 2.5 model family consists of:


## [Getting Started with the AI SDK](#getting-started-with-the-ai-sdk)

The AI SDK is the TypeScript toolkit designed to help developers build AI-powered applications with React, Next.js, Vue, Svelte, Node.js, and more. Integrating LLMs into applications is complicated and heavily dependent on the specific model provider you use.

The AI SDK abstracts away the differences between model providers, eliminates boilerplate code for building chatbots, and allows you to go beyond text output to generate rich, interactive components.

At the center of the AI SDK is [AI SDK Core](../../docs/ai-sdk-core/overview.html), which provides a unified API to call any LLM. The code snippet below is all you need to call Gemini 2.5 with the AI SDK:



``` ts
import  from '@ai-sdk/google';import  from 'ai';
const  = await generateText();console.log(text);
```


### [Thinking Capability](#thinking-capability)

The Gemini 2.5 series models use an internal "thinking process" that significantly improves their reasoning and multi-step planning abilities, making them highly effective for complex tasks such as coding, advanced mathematics, and data analysis.

You can control the amount of thinking using the `thinkingConfig` provider option and specifying a thinking budget in tokens. Additionally, you can request thinking summaries by setting `includeThoughts` to `true`.



``` ts
import  from '@ai-sdk/google';import  from 'ai';
const  = await generateText(,    },  },});
console.log(text); // text responseconsole.log(reasoning); // reasoning summary
```


### [Using Tools with the AI SDK](#using-tools-with-the-ai-sdk)

Gemini 2.5 supports tool calling, allowing it to interact with external systems and perform discrete tasks. Here's an example of using tool calling with the AI SDK:



``` ts
import  from 'zod';import  from 'ai';import  from '@ai-sdk/google';
const result = await generateText(),      execute: async () => (),    }),  },  stopWhen: stepCountIs(5), // Optional, enables multi step calling});
console.log(result.text);
console.log(result.steps);
```


### [Using Google Search with Gemini](#using-google-search-with-gemini)




``` ts
import  from '@ai-sdk/google';import  from '@ai-sdk/google';import  from 'ai';
const  = await generateText(),  },  prompt:    'List the top 5 San Francisco news from the past week.' +    'You must include the date of each article.',});
// access the grounding metadata. Casting to the provider metadata type// is optional but provides autocomplete and type safety.const metadata = providerMetadata?.google as  | GoogleGenerativeAIProviderMetadata  | undefined;const groundingMetadata = metadata?.groundingMetadata;const safetyRatings = metadata?.safetyRatings;
```


### [Building Interactive Interfaces](#building-interactive-interfaces)

AI SDK Core can be paired with [AI SDK UI](../../docs/ai-sdk-ui/overview.html), another powerful component of the AI SDK, to streamline the process of building chat, completion, and assistant interfaces with popular frameworks like Next.js, Nuxt, SvelteKit, and SolidStart.

AI SDK UI provides robust abstractions that simplify the complex tasks of managing chat streams and UI updates on the frontend, enabling you to develop dynamic AI-driven interfaces more efficiently.

With four main hooks — [`useChat`](../../docs/reference/ai-sdk-ui/use-chat.html), [`useCompletion`](../../docs/reference/ai-sdk-ui/use-completion.html), [`useObject`](../../docs/reference/ai-sdk-ui/use-object.html), and [`useAssistant`](https://ai-sdk.dev/docs/reference/ai-sdk-ui/use-assistant) — you can incorporate real-time chat capabilities, text completions, streamed JSON, and interactive assistant features into your app.


In a new Next.js application, first install the AI SDK and the Google Generative AI provider:



``` geist-overflow-scroll-y
pnpm install ai @ai-sdk/google
```










Then, create a route handler for the chat endpoint:












``` tsx
import  from '@ai-sdk/google';import  from 'ai';
// Allow streaming responses up to 30 secondsexport const maxDuration = 30;
export async function POST(req: Request) :  = await req.json();
  const result = streamText();
  return result.toUIMessageStreamResponse();}
```


Finally, update the root page (`app/page.tsx`) to use the `useChat` hook:












``` tsx
'use client';
import  from '@ai-sdk/react';import  from 'react';
export default function Chat()  = useChat();  return (    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">       className="whitespace-pre-wrap">                    -$`}></div>;            }          })}        </div>      ))}
      <form        onSubmit=);          setInput('');        }}      >        <input          className="fixed dark:bg-zinc-900 bottom-0 w-full max-w-md p-2 mb-8 border border-zinc-300 dark:border-zinc-800 rounded shadow-xl"          value=          placeholder="Say something..."          onChange=        />      </form>    </div>  );}
```


The useChat hook on your root page (`app/page.tsx`) will make a request to your AI provider endpoint (`app/api/chat/route.ts`) whenever the user submits a message. The messages are then displayed in the chat UI.

## [Get Started](#get-started)

Ready to dive in? Here's how you can begin:

1.  Explore the documentation at [ai-sdk.dev/docs](../../docs/introduction.html) to understand the capabilities of the AI SDK.
2.  Check out practical examples at [ai-sdk.dev/examples](../../cookbook.html) to see the SDK in action.
3.  Dive deeper with advanced guides on topics like Retrieval-Augmented Generation (RAG) at [ai-sdk.dev/docs/guides](../guides.html).
5.  Read more about the [Google Generative AI provider](../../providers/ai-sdk-providers/google-generative-ai.html).
















On this page




































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.