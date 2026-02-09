AI SDK 5 is available now.










Menu






















































































































































































































































































































































# [Language Model Middleware](#language-model-middleware)

Language model middleware is a way to enhance the behavior of language models by intercepting and modifying the calls to the language model.

It can be used to add features like guardrails, RAG, caching, and logging in a language model agnostic way. Such middleware can be developed and distributed independently from the language models that they are applied to.

## [Using Language Model Middleware](#using-language-model-middleware)

You can use language model middleware with the `wrapLanguageModel` function. It takes a language model and a language model middleware and returns a new language model that incorporates the middleware.



``` ts
import  from 'ai';
const wrappedLanguageModel = wrapLanguageModel();
```


The wrapped language model can be used just like any other language model, e.g. in `streamText`:



``` ts
const result = streamText();
```


## [Multiple middlewares](#multiple-middlewares)

You can provide multiple middlewares to the `wrapLanguageModel` function. The middlewares will be applied in the order they are provided.



``` ts
const wrappedLanguageModel = wrapLanguageModel();
// applied as: firstMiddleware(secondMiddleware(yourModel))
```


## [Built-in Middleware](#built-in-middleware)

The AI SDK comes with several built-in middlewares that you can use to configure language models:

- `extractReasoningMiddleware`: Extracts reasoning information from the generated text and exposes it as a `reasoning` property on the result.
- `simulateStreamingMiddleware`: Simulates streaming behavior with responses from non-streaming language models.
- `defaultSettingsMiddleware`: Applies default settings to a language model.

### [Extract Reasoning](#extract-reasoning)

Some providers and models expose reasoning information in the generated text using special tags, e.g. \<think\> and \</think\>.

The `extractReasoningMiddleware` function can be used to extract this reasoning information and expose it as a `reasoning` property on the result.



``` ts
import  from 'ai';
const model = wrapLanguageModel(),});
```


You can then use that enhanced model in functions like `generateText` and `streamText`.

The `extractReasoningMiddleware` function also includes a `startWithReasoning` option. When set to `true`, the reasoning tag will be prepended to the generated text. This is useful for models that do not include the reasoning tag at the beginning of the response. For more details, see the [DeepSeek R1 guide](../../cookbook/guides/r1.html#deepseek-r1-middleware).

### [Simulate Streaming](#simulate-streaming)

The `simulateStreamingMiddleware` function can be used to simulate streaming behavior with responses from non-streaming language models. This is useful when you want to maintain a consistent streaming interface even when using models that only provide complete responses.



``` ts
import  from 'ai';
const model = wrapLanguageModel();
```


### [Default Settings](#default-settings)

The `defaultSettingsMiddleware` function can be used to apply default settings to a language model.



``` ts
import  from 'ai';
const model = wrapLanguageModel( },    },  }),});
```


## [Community Middleware](#community-middleware)

The AI SDK provides a Language Model Middleware specification. Community members can develop middleware that adheres to this specification, making it compatible with the AI SDK ecosystem.

Here are some community middlewares that you can explore:

### [Custom tool call parser](#custom-tool-call-parser)





Using this middleware on models that support native function calls may result in unintended performance degradation, so check whether your model supports native function calls before deciding to use it.



This middleware enables function calling capabilities by converting function schemas into prompt instructions and parsing the model's responses into structured function calls. It works by transforming the JSON function definitions into natural language instructions the model can understand, then analyzing the generated text to extract function call attempts. This approach allows developers to use the same function calling API across different model providers, even with models that don't natively support the OpenAI-style function calling format, providing a consistent function calling experience regardless of the underlying model implementation.

The `@ai-sdk-tool/parser` package offers three middleware variants:

- `createToolMiddleware`: A flexible function for creating custom tool call middleware tailored to specific models
- `hermesToolMiddleware`: Ready-to-use middleware for Hermes & Qwen format function calls
- `gemmaToolMiddleware`: Pre-configured middleware for Gemma 3 model series function call format

Here's how you can enable function calls with Gemma models that don't support them natively:



``` ts
import  from 'ai';import  from '@ai-sdk-tool/parser';
const model = wrapLanguageModel();
```



## [Implementing Language Model Middleware](#implementing-language-model-middleware)







You can implement any of the following three function to modify the behavior of the language model:

1.  `transformParams`: Transforms the parameters before they are passed to the language model, for both `doGenerate` and `doStream`.

Here are some examples of how to implement language model middleware:

## [Examples](#examples)




These examples are not meant to be used in production. They are just to show how you can use middleware to enhance the behavior of language models.



### [Logging](#logging)

This example shows how to log the parameters and generated text of a language model call.



``` ts
import type  from '@ai-sdk/provider';
export const yourLogMiddleware: LanguageModelV2Middleware = ) => `);
    const result = await doGenerate();
    console.log('doGenerate finished');    console.log(`generated text: $`);
    return result;  },
  wrapStream: async () => `);
    const  = await doStream();
    let generatedText = '';    const textBlocks = new Map<string, string>();
    const transformStream = new TransformStream<      LanguageModelV2StreamPart,      LanguageModelV2StreamPart    >(          case 'text-delta':           case 'text-end':  completed:`,              textBlocks.get(chunk.id),            );            break;          }        }
        controller.enqueue(chunk);      },
      flush() `);      },    });
    return ;  },};
```


### [Caching](#caching)

This example shows how to build a simple cache for the generated text of a language model call.



``` ts
import type  from '@ai-sdk/provider';
const cache = new Map<string, any>();
export const yourCacheMiddleware: LanguageModelV2Middleware = ) => 
    const result = await doGenerate();
    cache.set(cacheKey, result);
    return result;  },
  // here you would implement the caching logic for streaming};
```


### [Retrieval Augmented Generation (RAG)](#retrieval-augmented-generation-rag)

This example shows how to use RAG as middleware.




Helper functions like `getLastUserMessageText` and `findSources` are not part of the AI SDK. They are just used in this example to illustrate the concept of RAG.





``` ts
import type  from '@ai-sdk/provider';
export const yourRagMiddleware: LanguageModelV2Middleware = ) => );
    if (lastUserMessageText == null) 
    const instruction =      'Use the following information to answer the question:\n' +      findSources()        .map(chunk => JSON.stringify(chunk))        .join('\n');
    return addToLastUserMessage();  },};
```


### [Guardrails](#guardrails)

Guard rails are a way to ensure that the generated text of a language model call is safe and appropriate. This example shows how to use guardrails as middleware.



``` ts
import type  from '@ai-sdk/provider';
export const yourGuardrailMiddleware: LanguageModelV2Middleware = ) =>  = await doGenerate();
    // filtering approach, e.g. for PII or other sensitive information:    const cleanedText = text?.replace(/badword/g, '<REDACTED>');
    return ;  },
  // here you would implement the guardrail logic for streaming  // Note: streaming guardrails are difficult to implement, because  // you do not know the full content of the stream until it's finished.};
```


## [Configuring Per Request Custom Metadata](#configuring-per-request-custom-metadata)

To send and access custom metadata in Middleware, you can use `providerOptions`. This is useful when building logging middleware where you want to pass additional context like user IDs, timestamps, or other contextual data that can help with tracking and debugging.



``` ts
import  from '@ai-sdk/openai';import  from 'ai';import type  from '@ai-sdk/provider';
export const yourLogMiddleware: LanguageModelV2Middleware = ) => ,};
const  = await generateText(),  prompt: 'Invent a new holiday and describe its traditions.',  providerOptions: ,  },});
console.log(text);
```

















On this page
































































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.