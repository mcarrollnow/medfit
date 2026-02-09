AI SDK 5 is available now.










Menu






















































































































































































































































































































































































































































































# [Built-in AI](#built-in-ai)





The `@built-in-ai/core` package is under constant development as the Prompt API matures, and may contain errors and breaking changes. However, this module will also mature with it as new implementations arise.



## [Setup](#setup)

### [Installation](#installation)

The `@built-in-ai/core` package is the AI SDK provider for Chrome and Edge browser's built-in AI models. You can install it with:






pnpm







npm







yarn







bun








``` geist-overflow-scroll-y
pnpm add @built-in-ai/core
```












The `@built-in-ai/web-llm` package is the AI SDK provider for popular open-source models using the WebLLM inference engine. You can install it with:






pnpm







npm







yarn







bun








``` geist-overflow-scroll-y
pnpm add @built-in-ai/web-llm
```












The `@built-in-ai/transformers-js` package is the AI SDK provider for popular open-source models using Transformers.js. You can install it with:






pnpm







npm







yarn







bun








``` geist-overflow-scroll-y
pnpm add @built-in-ai/transformers-js
```












### [Browser-specific setup (@built-in-ai/core)](#browser-specific-setup-built-in-aicore)




The Prompt API (built-in AI) is currently experimental and might change as it matures. The following enablement guide for the API might also change in the future.



1.  You need Chrome (v. 128 or higher) or Edge Dev/Canary (v. 138.0.3309.2 or higher)

2.  Enable these experimental flags:

    - If you're using Chrome:
      1.  Go to `chrome://flags/`, search for *'Prompt API for Gemini Nano with Multimodal Input'* and set it to Enabled
      2.  Go to `chrome://components` and click Check for Update on Optimization Guide On Device Model
    - If you're using Edge:
      1.  Go to `edge://flags/#prompt-api-for-phi-mini` and set it to Enabled


## [Provider Instances](#provider-instances)

### [`@built-in-ai/core`](#built-in-aicore)

You can import the default provider instance `builtInAI` from `@built-in-ai/core`:



``` ts
import  from '@built-in-ai/core';
const model = builtInAI();
```


You can use the following optional settings to customize the model:

- **temperature** *number*

  Controls randomness in the model's responses. For most models, `0` means almost deterministic results, and higher values mean more randomness.

- **topK** *number*

  Control the diversity and coherence of generated text by limiting the selection of the next token.

### [`@built-in-ai/web-llm`](#built-in-aiweb-llm)

You can import the default provider instance `webLLM` from `@built-in-ai/web-llm`:



``` ts
import  from '@built-in-ai/web-llm';
const model = webLLM();
```


### [`@built-in-ai/transformers-js`](#built-in-aitransformers-js)

You can import the default provider instance `transformersJS` from `@built-in-ai/transformers-js`:



``` ts
import  from '@built-in-ai/transformers-js';
const model = transformersJS();
```


## [Language Models](#language-models)

### [`@built-in-ai/core`](#built-in-aicore-1)


### [`@built-in-ai/web-llm`](#built-in-aiweb-llm-1)


### [`@built-in-ai/transformers-js`](#built-in-aitransformers-js-1)

The provider allows using a ton of popular open-source models from Huggingface with the Transformers.js library.

### [Example usage](#example-usage)

#### [`@built-in-ai/core`](#built-in-aicore-2)



``` ts
import  from 'ai';import  from '@built-in-ai/core';
const result = streamText();
for await (const chunk of result.textStream) 
```


#### [`@built-in-ai/web-llm`](#built-in-aiweb-llm-2)



``` ts
import  from 'ai';import  from '@built-in-ai/web-llm';
const result = streamText();
for await (const chunk of result.textStream) 
```


#### [`@built-in-ai/transformers-js`](#built-in-aitransformers-js-2)



``` ts
import  from 'ai';import  from '@built-in-ai/transformers-js';
const result = streamText();
for await (const chunk of result.textStream) 
```


















On this page


































































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.