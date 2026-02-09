AI SDK 5 is available now.










Menu






















































































































































































































































































































































# [Generating and Streaming Text](#generating-and-streaming-text)

Large language models (LLMs) can generate text in response to a prompt, which can contain instructions and information to process. For example, you can ask a model to come up with a recipe, draft an email, or summarize a document.

The AI SDK Core provides two functions to generate text and stream it from LLMs:

- [`generateText`](#generatetext): Generates text for a given prompt and model.
- [`streamText`](#streamtext): Streams text from a given prompt and model.

Advanced LLM features such as [tool calling](tools-and-tool-calling.html) and [structured data generation](generating-structured-data.html) are built on top of text generation.

## [`generateText`](#generatetext)

You can generate text using the [`generateText`](../reference/ai-sdk-core/generate-text.html) function. This function is ideal for non-interactive use cases where you need to write text (e.g. drafting email or summarizing web pages) and for agents that use tools.



``` tsx
import  from 'ai';
const  = await generateText();
```


You can use more [advanced prompts](../foundations/prompts.html) to generate text with more complex instructions and content:



``` tsx
import  from 'ai';
const  = await generateText(`,});
```


The result object of `generateText` contains several promises that resolve when all required data is available:

- `result.content`: The content that was generated in the last step.
- `result.text`: The generated text.
- `result.reasoning`: The full reasoning that the model has generated in the last step.
- `result.reasoningText`: The reasoning text of the model (only available for some models).
- `result.files`: The files that were generated in the last step.
- `result.sources`: Sources that have been used as references in the last step (only available for some models).
- `result.toolCalls`: The tool calls that were made in the last step.
- `result.toolResults`: The results of the tool calls from the last step.
- `result.finishReason`: The reason the model finished generating text.
- `result.usage`: The usage of the model during the final step of text generation.
- `result.totalUsage`: The total usage across all steps (for multi-step generations).
- `result.warnings`: Warnings from the model provider (e.g. unsupported settings).
- `result.request`: Additional request information.
- `result.response`: Additional response information, including response messages and body.
- `result.providerMetadata`: Additional provider-specific metadata.
- `result.steps`: Details for all steps, useful for getting information about intermediate steps.
- `result.experimental_output`: The generated structured output using the `experimental_output` specification.

### [Accessing response headers & body](#accessing-response-headers--body)

Sometimes you need access to the full response from the model provider, e.g. to access some provider-specific headers or body content.

You can access the raw response headers and body using the `response` property:



``` ts
import  from 'ai';
const result = await generateText();
console.log(JSON.stringify(result.response.headers, null, 2));console.log(JSON.stringify(result.response.body, null, 2));
```


## [`streamText`](#streamtext)

Depending on your model and prompt, it can take a large language model (LLM) up to a minute to finish generating its response. This delay can be unacceptable for interactive use cases such as chatbots or real-time applications, where users expect immediate responses.

AI SDK Core provides the [`streamText`](../reference/ai-sdk-core/stream-text.html) function which simplifies streaming text from LLMs:



``` ts
import  from 'ai';
const result = streamText();
// example: use textStream as an async iterablefor await (const textPart of result.textStream) 
```





`result.textStream` is both a `ReadableStream` and an `AsyncIterable`.






`streamText` immediately starts streaming and suppresses errors to prevent server crashes. Use the `onError` callback to log errors.



You can use `streamText` on its own or in combination with [AI SDK UI](../../cookbook/next/stream-text.html) and [AI SDK RSC](../../cookbook/rsc/stream-text.html). The result object contains several helper functions to make the integration into [AI SDK UI](../ai-sdk-ui.html) easier:

- `result.toUIMessageStreamResponse()`: Creates a UI Message stream HTTP response (with tool calls etc.) that can be used in a Next.js App Router API route.
- `result.pipeUIMessageStreamToResponse()`: Writes UI Message stream delta output to a Node.js response-like object.
- `result.toTextStreamResponse()`: Creates a simple text stream HTTP response.
- `result.pipeTextStreamToResponse()`: Writes text delta output to a Node.js response-like object.




`streamText` is using backpressure and only generates tokens as they are requested. You need to consume the stream in order for it to finish.



It also provides several promises that resolve when the stream is finished:

- `result.content`: The content that was generated in the last step.
- `result.text`: The generated text.
- `result.reasoning`: The full reasoning that the model has generated.
- `result.reasoningText`: The reasoning text of the model (only available for some models).
- `result.files`: Files that have been generated by the model in the last step.
- `result.sources`: Sources that have been used as references in the last step (only available for some models).
- `result.toolCalls`: The tool calls that have been executed in the last step.
- `result.toolResults`: The tool results that have been generated in the last step.
- `result.finishReason`: The reason the model finished generating text.
- `result.usage`: The usage of the model during the final step of text generation.
- `result.totalUsage`: The total usage across all steps (for multi-step generations).
- `result.warnings`: Warnings from the model provider (e.g. unsupported settings).
- `result.steps`: Details for all steps, useful for getting information about intermediate steps.
- `result.request`: Additional request information from the last step.
- `result.response`: Additional response information from the last step.
- `result.providerMetadata`: Additional provider-specific metadata from the last step.

### [`onError` callback](#onerror-callback)

`streamText` immediately starts streaming to enable sending data without waiting for the model. Errors become part of the stream and are not thrown to prevent e.g. servers from crashing.

To log errors, you can provide an `onError` callback that is triggered when an error occurs.



``` tsx
import  from 'ai';
const result = streamText() ,});
```


### [`onChunk` callback](#onchunk-callback)

When using `streamText`, you can provide an `onChunk` callback that is triggered for each chunk of the stream.

It receives the following chunk types:

- `text`
- `reasoning`
- `source`
- `tool-call`
- `tool-input-start`
- `tool-input-delta`
- `tool-result`
- `raw`



``` tsx
import  from 'ai';
const result = streamText()   },});
```


### [`onFinish` callback](#onfinish-callback)

When using `streamText`, you can provide an `onFinish` callback that is triggered when the stream is finished ( [API Reference](../reference/ai-sdk-core/stream-text.html#on-finish) ). It contains the text, usage information, finish reason, messages, steps, total usage, and more:



``` tsx
import  from 'ai';
const result = streamText() ,});
```


### [`fullStream` property](#fullstream-property)

You can read a stream with all events using the `fullStream` property. This can be useful if you want to implement your own UI or handle the stream in a different way. Here is an example of how to use the `fullStream` property:



``` tsx
import  from 'ai';import  from 'zod';
const result = streamText(),      execute: async () => (),    },  },  prompt: 'What are some San Francisco tourist attractions?',});
for await (const part of result.fullStream)     case 'start-step':     case 'text-start':     case 'text-delta':     case 'text-end':     case 'reasoning-start':     case 'reasoning-delta':     case 'reasoning-end':     case 'source':     case 'file':     case 'tool-call':       }      break;    }    case 'tool-input-start':     case 'tool-input-delta':     case 'tool-input-end':     case 'tool-result':       }      break;    }    case 'tool-error':     case 'finish-step':     case 'finish':     case 'error':     case 'raw':   }}
```


### [Stream transformation](#stream-transformation)

You can use the `experimental_transform` option to transform the stream. This is useful for e.g. filtering, changing, or smoothing the text stream.

The transformations are applied before the callbacks are invoked and the promises are resolved. If you e.g. have a transformation that changes all text to uppercase, the `onFinish` callback will receive the transformed text.

#### [Smoothing streams](#smoothing-streams)

The AI SDK Core provides a [`smoothStream` function](../reference/ai-sdk-core/smooth-stream.html) that can be used to smooth out text streaming.



``` tsx
import  from 'ai';
const result = streamText();
```


#### [Custom transformations](#custom-transformations)

You can also implement your own custom transformations. The transformation function receives the tools that are available to the model, and returns a function that is used to transform the stream. Tools can either be generic or limited to the tools that you are using.

Here is an example of how to implement a custom transformation that converts all text to uppercase:



``` ts
const upperCaseTransform =  <TOOLS extends ToolSet>() =>  (options: ) =>    new TransformStream<TextStreamPart<TOOLS>, TextStreamPart<TOOLS>>(            : chunk,        );      },    });
```


You can also stop the stream using the `stopStream` function. This is e.g. useful if you want to stop the stream when model guardrails are violated, e.g. by generating inappropriate content.

When you invoke `stopStream`, it is important to simulate the `step-finish` and `finish` events to guarantee that a well-formed stream is returned and all callbacks are invoked.



``` ts
const stopWordTransform =  <TOOLS extends ToolSet>() =>  (: ) =>    new TransformStream<TextStreamPart<TOOLS>, TextStreamPart<TOOLS>>(
        if (chunk.text.includes('STOP')) ,            request: ,            response: ,            warnings: [],            isContinued: false,          });
          // simulate the finish event          controller.enqueue(,            response: ,          });
          return;        }
        controller.enqueue(chunk);      },    });
```


#### [Multiple transformations](#multiple-transformations)

You can also provide multiple transformations. They are applied in the order they are provided.



``` tsx
const result = streamText();
```


## [Sources](#sources)

Some providers such as [Perplexity](../../providers/ai-sdk-providers/perplexity.html#sources) and [Google Generative AI](../../providers/ai-sdk-providers/google-generative-ai.html#sources) include sources in the response.

Currently sources are limited to web pages that ground the response. You can access them using the `sources` property of the result.

Each `url` source contains the following properties:

- `id`: The ID of the source.
- `url`: The URL of the source.
- `title`: The optional title of the source.
- `providerMetadata`: Provider metadata for the source.

When you use `generateText`, you can access the sources using the `sources` property:



``` ts
const result = await generateText(),  },  prompt: 'List the top 5 San Francisco news from the past week.',});
for (const source of result.sources) }
```


When you use `streamText`, you can access the sources using the `fullStream` property:



``` tsx
const result = streamText(),  },  prompt: 'List the top 5 San Francisco news from the past week.',});
for await (const part of result.fullStream) }
```


The sources are also available in the `result.sources` promise.

## [Examples](#examples)

You can see `generateText` and `streamText` in action using various frameworks in the following examples:

### [`generateText`](#generatetext-1)









Learn to generate text in Node.js












Learn to generate text in Next.js with Route Handlers (AI SDK UI)












Learn to generate text in Next.js with Server Actions (AI SDK RSC)






### [`streamText`](#streamtext-1)









Learn to stream text in Node.js












Learn to stream text in Next.js with Route Handlers (AI SDK UI)












Learn to stream text in Next.js with Server Actions (AI SDK RSC)





















On this page


































































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.