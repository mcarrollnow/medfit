AI SDK 5 is available now.










Menu






















































































































































































































































































































































































































































































# [Mem0 Provider](#mem0-provider)





🎉 Exciting news! Mem0 AI SDK now supports **Tools Call**.



## [Setup](#setup)

The Mem0 provider is available in the `@mem0/vercel-ai-provider` module. You can install it with:






pnpm







npm







yarn







bun








``` geist-overflow-scroll-y
pnpm add @mem0/vercel-ai-provider
```












## [Provider Instance](#provider-instance)


Then initialize the `Mem0 Client` in your application:



``` ts
import  from '@mem0/vercel-ai-provider';
const mem0 = createMem0(,  // Optional Mem0 Global Config  mem0Config: ,});
```





The `openai` provider is set as default. Consider using `MEM0_API_KEY` and `OPENAI_API_KEY` as environment variables for security.






The `mem0Config` is optional. It is used to set the global config for the Mem0 Client (eg. `user_id`, `agent_id`, `app_id`, `run_id`, `org_id`, `project_id` etc).



- Add Memories to Enhance Context:



``` ts
import  from '@ai-sdk/provider';import  from '@mem0/vercel-ai-provider';
const messages: LanguageModelV2Prompt = [  ] },];
await addMemories(messages, );
```


## [Features](#features)

### [Adding and Retrieving Memories](#adding-and-retrieving-memories)

- `retrieveMemories()`: Retrieves memory context for prompts.
- `getMemories()`: Get memories from your profile in array format.
- `addMemories()`: Adds user memories to enhance contextual responses.



``` ts
await addMemories(messages, );await retrieveMemories(prompt, );await getMemories(prompt, );
```





For standalone features, such as `addMemories`, `retrieveMemories`, and `getMemories`, you must either set `MEM0_API_KEY` as an environment variable or pass it directly in the function call.






`getMemories` will return raw memories in the form of an array of objects, while `retrieveMemories` will return a response in string format with a system prompt ingested with the retrieved memories.



### [Generate Text with Memory Context](#generate-text-with-memory-context)

You can use language models from **OpenAI**, **Anthropic**, **Cohere**, and **Groq** to generate text with the `generateText` function:



``` ts
import  from 'ai';import  from '@mem0/vercel-ai-provider';
const mem0 = createMem0();
const  = await generateText(),  prompt: 'Suggest me a good car to buy!',});
```


### [Structured Message Format with Memory](#structured-message-format-with-memory)



``` ts
import  from 'ai';import  from '@mem0/vercel-ai-provider';
const mem0 = createMem0();
const  = await generateText(),  messages: [    ,        ,      ],    },  ],});
```


### [Streaming Responses with Memory Context](#streaming-responses-with-memory-context)



``` ts
import  from 'ai';import  from '@mem0/vercel-ai-provider';
const mem0 = createMem0();
const  = streamText(),  prompt:    'Suggest me a good car to buy! Why is it better than the other cars for me? Give options for every price range.',});
for await (const textPart of textStream) 
```


### [Generate Responses with Tools Call](#generate-responses-with-tools-call)



``` ts
import  from 'ai';import  from '@mem0/vercel-ai-provider';import  from 'zod';
const mem0 = createMem0(,});
const prompt = 'What the temperature in the city that I live in?';
const result = await generateText(),      execute: async () => (),    }),  },  prompt: prompt,});
console.log(result);
```


### [Get sources from memory](#get-sources-from-memory)



``` ts
const  = await generateText();
console.log(sources);
```


This same functionality is available in the `streamText` function.

## [Supported LLM Providers](#supported-llm-providers)

The Mem0 provider supports the following LLM providers:


| Provider  | Configuration Value |
|-----------|---------------------|
| OpenAI    | `openai`            |
| Anthropic | `anthropic`         |
| Google    | `google`            |
| Groq      | `groq`              |
| Cohere    | `cohere`            |


## [Best Practices](#best-practices)

- **User Identification**: Use a unique `user_id` for consistent memory retrieval.
- **Memory Cleanup**: Regularly clean up unused memory data.







## [Help](#help)

- For more details on Vercel AI SDK, visit the [Vercel AI SDK documentation](../../docs/introduction.html).
- If you need further assistance, please feel free to reach out to us through following methods:

## [References](#references)

















On this page






















































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.