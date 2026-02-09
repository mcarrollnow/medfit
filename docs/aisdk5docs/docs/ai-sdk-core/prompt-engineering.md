AI SDK 5 is available now.










Menu






















































































































































































































































































































































# [Prompt Engineering](#prompt-engineering)

## [Tips](#tips)

### [Prompts for Tools](#prompts-for-tools)

When you create prompts that include tools, getting good results can be tricky as the number and complexity of your tools increases.

Here are a few tips to help you get the best results:

1.  Use a model that is strong at tool calling, such as `gpt-5` or `gpt-4.1`. Weaker models will often struggle to call tools effectively and flawlessly.
2.  Keep the number of tools low, e.g. to 5 or less.
3.  Keep the complexity of the tool parameters low. Complex Zod schemas with many nested and optional elements, unions, etc. can be challenging for the model to work with.
4.  Use semantically meaningful names for your tools, parameters, parameter properties, etc. The more information you pass to the model, the better it can understand what you want.
5.  Add `.describe("...")` to your Zod schema properties to give the model hints about what a particular property is for.
6.  When the output of a tool might be unclear to the model and there are dependencies between tools, use the `description` field of a tool to provide information about the output of the tool execution.
7.  You can include example input/outputs of tool calls in your prompt to help the model understand how to use the tools. Keep in mind that the tools work with JSON objects, so the examples should use JSON.

In general, the goal should be to give the model all information it needs in a clear way.


The mapping from Zod schemas to LLM inputs (typically JSON schema) is not always straightforward, since the mapping is not one-to-one.

#### [Zod Dates](#zod-dates)

Zod expects JavaScript Date objects, but models return dates as strings. You can specify and validate the date format using `z.string().datetime()` or `z.string().date()`, and then use a Zod transformer to convert the string to a Date object.



``` ts
const result = await generateObject(),    ),  }),  prompt: 'List 5 important events from the year 2000.',});
```


#### [Optional Parameters](#optional-parameters)

When working with tools that have optional parameters, you may encounter compatibility issues with certain providers that use strict schema validation.




This is particularly relevant for OpenAI models with structured outputs (strict mode).



For maximum compatibility, optional parameters should use `.nullable()` instead of `.optional()`:



``` ts
// This may fail with strict schema validationconst failingTool = tool(),});
// This works with strict schema validationconst workingTool = tool(),});
```


#### [Temperature Settings](#temperature-settings)

For tool calls and object generation, it's recommended to use `temperature: 0` to ensure deterministic and consistent results:



``` ts
const result = await generateText(),    }),  },  prompt: 'Execute the ls command',});
```


Lower temperature values reduce randomness in model outputs, which is particularly important when the model needs to:

- Generate structured data with specific formats
- Make precise tool calls with correct parameters
- Follow strict schemas consistently

## [Debugging](#debugging)

### [Inspecting Warnings](#inspecting-warnings)

Not all providers support all AI SDK features. Providers either throw exceptions or return warnings when they do not support a feature. To check if your prompt, tools, and settings are handled correctly by the provider, you can check the call warnings:



``` ts
const result = await generateText();
console.log(result.warnings);
```


### [HTTP Request Bodies](#http-request-bodies)

You can inspect the raw HTTP request bodies for models that expose them, e.g. [OpenAI](../../providers/ai-sdk-providers/openai.html). This allows you to inspect the exact payload that is sent to the model provider in the provider-specific way.

Request bodies are available via the `request.body` property of the response:



``` ts
const result = await generateText();
console.log(result.request.body);
```

















On this page














































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.