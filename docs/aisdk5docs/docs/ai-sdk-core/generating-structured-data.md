AI SDK 5 is available now.










Menu






















































































































































































































































































































































# [Generating Structured Data](#generating-structured-data)

While text generation can be useful, your use case will likely call for generating structured data. For example, you might want to extract information from text, classify data, or generate synthetic data.

Many language models are capable of generating structured data, often defined as using "JSON modes" or "tools". However, you need to manually provide schemas and then validate the generated data as LLMs can produce incorrect or incomplete structured data.

The AI SDK standardises structured object generation across model providers with the [`generateObject`](../reference/ai-sdk-core/generate-object.html) and [`streamObject`](../reference/ai-sdk-core/stream-object.html) functions. You can use both functions with different output strategies, e.g. `array`, `object`, `enum`, or `no-schema`, and with different generation modes, e.g. `auto`, `tool`, or `json`. You can use [Zod schemas](../reference/ai-sdk-core/zod-schema.html), [Valibot](../reference/ai-sdk-core/valibot-schema.html), or [JSON schemas](../reference/ai-sdk-core/json-schema.html) to specify the shape of the data that you want, and the AI model will generate data that conforms to that structure.




You can pass Zod objects directly to the AI SDK functions or use the `zodSchema` helper function.



## [Generate Object](#generate-object)

The `generateObject` generates structured data from a prompt. The schema is also used to validate the generated data, ensuring type safety and correctness.



``` ts
import  from 'ai';import  from 'zod';
const  = await generateObject()),      steps: z.array(z.string()),    }),  }),  prompt: 'Generate a lasagna recipe.',});
```





See `generateObject` in action with [these examples](#more-examples)



### [Accessing response headers & body](#accessing-response-headers--body)

Sometimes you need access to the full response from the model provider, e.g. to access some provider-specific headers or body content.

You can access the raw response headers and body using the `response` property:



``` ts
import  from 'ai';
const result = await generateObject();
console.log(JSON.stringify(result.response.headers, null, 2));console.log(JSON.stringify(result.response.body, null, 2));
```


## [Stream Object](#stream-object)

Given the added complexity of returning structured data, model response time can be unacceptable for your interactive use case. With the [`streamObject`](../reference/ai-sdk-core/stream-object.html) function, you can stream the model's response as it is generated.



``` ts
import  from 'ai';
const  = streamObject();
// use partialObjectStream as an async iterablefor await (const partialObject of partialObjectStream) 
```


You can use `streamObject` to stream generated UIs in combination with React Server Components (see [Generative UI](../ai-sdk-rsc.html))) or the [`useObject`](../reference/ai-sdk-ui/use-object.html) hook.






### [`onError` callback](#onerror-callback)

`streamObject` immediately starts streaming. Errors become part of the stream and are not thrown to prevent e.g. servers from crashing.

To log errors, you can provide an `onError` callback that is triggered when an error occurs.



``` tsx
import  from 'ai';
const result = streamObject() ,});
```


## [Output Strategy](#output-strategy)

You can use both functions with different output strategies, e.g. `array`, `object`, `enum`, or `no-schema`.

### [Object](#object)

The default output strategy is `object`, which returns the generated data as an object. You don't need to specify the output strategy if you want to use the default.

### [Array](#array)

If you want to generate an array of objects, you can set the output strategy to `array`. When you use the `array` output strategy, the schema specifies the shape of an array element. With `streamObject`, you can also stream the generated array elements using `elementStream`.



``` ts
import  from '@ai-sdk/openai';import  from 'ai';import  from 'zod';
const  = streamObject(),  prompt: 'Generate 3 hero descriptions for a fantasy role playing game.',});
for await (const hero of elementStream) 
```


### [Enum](#enum)

If you want to generate a specific enum value, e.g. for classification tasks, you can set the output strategy to `enum` and provide a list of possible values in the `enum` parameter.








``` ts
import  from 'ai';
const  = await generateObject();
```


### [No Schema](#no-schema)

In some cases, you might not want to use a schema, for example when the data is a dynamic user request. You can use the `output` setting to set the output format to `no-schema` in those cases and omit the schema parameter.



``` ts
import  from '@ai-sdk/openai';import  from 'ai';
const  = await generateObject();
```


## [Schema Name and Description](#schema-name-and-description)

You can optionally specify a name and description for the schema. These are used by some providers for additional LLM guidance, e.g. via tool or schema name.



``` ts
import  from 'ai';import  from 'zod';
const  = await generateObject()),    steps: z.array(z.string()),  }),  prompt: 'Generate a lasagna recipe.',});
```


## [Accessing Reasoning](#accessing-reasoning)

You can access the reasoning used by the language model to generate the object via the `reasoning` property on the result. This property contains a string with the model's thought process, if available.



``` ts
import  from '@ai-sdk/openai';import  from 'ai';import  from 'zod';
const result = await generateObject(),      ),      steps: z.array(z.string()),    }),  }),  prompt: 'Generate a lasagna recipe.',  providerOptions:  satisfies OpenAIResponsesProviderOptions,  },});
console.log(result.reasoning);
```


## [Error Handling](#error-handling)

When `generateObject` cannot generate a valid object, it throws a [`AI_NoObjectGeneratedError`](../reference/ai-sdk-errors/ai-no-object-generated-error.html).

This error occurs when the AI provider fails to generate a parsable object that conforms to the schema. It can arise due to the following reasons:

- The model failed to generate a response.
- The model generated a response that could not be parsed.
- The model generated a response that could not be validated against the schema.

The error preserves the following information to help you log the issue:

- `text`: The text that was generated by the model. This can be the raw text or the tool call text, depending on the object generation mode.
- `response`: Metadata about the language model response, including response id, timestamp, and model.
- `usage`: Request token usage.
- `cause`: The cause of the error (e.g. a JSON parsing error). You can use this for more detailed error handling.



``` ts
import  from 'ai';
try );} catch (error) }
```


## [Repairing Invalid or Malformed JSON](#repairing-invalid-or-malformed-json)




The `repairText` function is experimental and may change in the future.



Sometimes the model will generate invalid or malformed JSON. You can use the `repairText` function to attempt to repair the JSON.

It receives the error, either a `JSONParseError` or a `TypeValidationError`, and the text that was generated by the model. You can then attempt to repair the text and return the repaired text.



``` ts
import  from 'ai';
const  = await generateObject() => ';  },});
```


## [Structured outputs with `generateText` and `streamText`](#structured-outputs-with-generatetext-and-streamtext)

You can generate structured data with `generateText` and `streamText` by using the `experimental_output` setting.




Some models, e.g. those by OpenAI, support structured outputs and tool calling at the same time. This is only possible with `generateText` and `streamText`.






Structured output generation with `generateText` and `streamText` is experimental and may change in the future.



### [`generateText`](#generatetext)



``` ts
// experimental_output is a structured object that matches the schema:const  = await generateText(),      occupation: z.object(),    }),  }),  prompt: 'Generate an example person for testing.',});
```


### [`streamText`](#streamtext)



``` ts
// experimental_partialOutputStream contains generated partial objects:const  = await streamText(),      occupation: z.object(),    }),  }),  prompt: 'Generate an example person for testing.',});
```


## [More Examples](#more-examples)

You can see `generateObject` and `streamObject` in action using various frameworks in the following examples:

### [`generateObject`](#generateobject)









Learn to generate objects in Node.js












Learn to generate objects in Next.js with Route Handlers (AI SDK UI)












Learn to generate objects in Next.js with Server Actions (AI SDK RSC)






### [`streamObject`](#streamobject)









Learn to stream objects in Node.js












Learn to stream objects in Next.js with Route Handlers (AI SDK UI)












Learn to stream objects in Next.js with Server Actions (AI SDK RSC)





















On this page
















































































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.