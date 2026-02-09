AI SDK 5 is available now.










Menu






















































































































































































































































































































































































































































































# [FriendliAI Provider](#friendliai-provider)


It creates language model objects that can be used with the `generateText`, `streamText`, `generateObject`, and `streamObject` functions.

## [Setup](#setup)

The Friendli provider is available via the `@friendliai/ai-provider` module. You can install it with:






pnpm







npm







yarn







bun








``` geist-overflow-scroll-y
pnpm add @friendliai/ai-provider
```












### [Credentials](#credentials)


To use the provider, you need to set the `FRIENDLI_TOKEN` environment variable with your personal access token.



``` bash
export FRIENDLI_TOKEN="YOUR_FRIENDLI_TOKEN"
```



## [Provider Instance](#provider-instance)

You can import the default provider instance `friendliai` from `@friendliai/ai-provider`:



``` ts
import  from '@friendliai/ai-provider';
```


## [Language Models](#language-models)




``` ts
const model = friendli('meta-llama-3.1-8b-instruct');
```


### [Example: Generating text](#example-generating-text)

You can use FriendliAI language models to generate text with the `generateText` function:



``` ts
import  from '@friendliai/ai-provider';import  from 'ai';
const  = await generateText();
console.log(text);
```


### [Example: Reasoning](#example-reasoning)

FriendliAI exposes the thinking of `deepseek-r1` in the generated text using the `<think>` tag. You can use the `extractReasoningMiddleware` to extract this reasoning and expose it as a `reasoning` property on the result:



``` ts
import  from '@friendliai/ai-provider';import  from 'ai';
const enhancedModel = wrapLanguageModel(),});
const  = await generateText();
```


### [Example: Structured Outputs (regex)](#example-structured-outputs-regex)

The regex option allows you to control the format of your LLM's output by specifying patterns. This can be particularly useful when you need:

- Specific formats like CSV
- Restrict output to specific characters such as Korean or Japanese

This feature is available with both `generateText` and `streamText` functions.




``` ts
import  from '@friendliai/ai-provider';import  from 'ai';
const  = await generateText(),  prompt: 'Who is the first king of the Joseon Dynasty?',});
console.log(text);
```


### [Example: Structured Outputs (json)](#example-structured-outputs-json)

Structured outputs are a form of guided generation. The JSON schema is used as a grammar and the outputs will always conform to the schema.



``` ts
import  from '@friendliai/ai-provider';import  from 'ai';import  from 'zod';
const  = await generateObject(),  system: 'Extract the event information.',  prompt: 'Alice and Bob are going to a science fair on Friday.',});
console.log(object);
```


### [Example: Using built-in tools](#example-using-built-in-tools)







Built-in tools allow models to use tools to generate better answers. For example, a `web:search` tool can provide up-to-date answers to current questions.



``` ts
import  from '@friendliai/ai-provider';import  from 'ai';
const result = streamText(, ],  }),  prompt:    'Find the current USD to CAD exchange rate and calculate how much $5,000 USD would be in Canadian dollars.',});
for await (const textPart of result.textStream) 
```


### [Example: Generating text with Dedicated Endpoints](#example-generating-text-with-dedicated-endpoints)

To use a custom model via a dedicated endpoint, you can use the `friendli` instance with the endpoint id, e.g. `zbimjgovmlcb`



``` ts
import  from '@friendliai/ai-provider';import  from 'ai';
const  = await generateText();
console.log(text);
```


You can use the code below to force requests to dedicated endpoints. By default, they are auto-detected.



``` ts
import  from '@friendliai/ai-provider';import  from 'ai';
const  = await generateText();  prompt: 'What is the meaning of life?',});
console.log(text);
```


FriendliAI language models can also be used in the `streamText`, `generateObject`, and `streamObject` functions. (see [AI SDK Core](../../docs/ai-sdk-core.html)).

### [Model Capabilities](#model-capabilities)


| Model | Image Input | Object Generation | Tool Usage | Tool Streaming |
|----|----|----|----|----|








### [OpenAI Compatibility](#openai-compatibility)

You can also use `@ai-sdk/openai` as the APIs are OpenAI-compatible.



``` ts
import  from '@ai-sdk/openai';
const friendli = createOpenAI();
```


If you are using dedicated endpoints



``` ts
import  from '@ai-sdk/openai';
const friendli = createOpenAI();
```

















On this page





















































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.