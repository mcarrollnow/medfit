AI SDK Providers: OpenAI

[](https://vercel.com/)

[

AI SDK



](../../index.html)

-   [Docs](../../docs/introduction.html)
-   [Cookbook](../../cookbook.html)
-   [Providers](../ai-sdk-providers.html)
-   [Playground](../../playground.html)
-   [
    
    AI ElementsAI Elements
    
    ](../../elements/overview.html)
-   [AI GatewayGateway](https://vercel.com/ai-gateway)

AI SDK 5 is available now.

[View Announcement](https://vercel.com/blog/ai-sdk-5)

Menu

[AI SDK Providers](../ai-sdk-providers.html)

[AI Gateway](ai-gateway.html)

[xAI Grok](xai.html)

[Vercel](vercel.html)

[OpenAI](openai.html)

[Azure OpenAI](azure.html)

[Anthropic](anthropic.html)

[Amazon Bedrock](amazon-bedrock.html)

[Groq](groq.html)

[Fal](fal.html)

[DeepInfra](deepinfra.html)

[Google Generative AI](google-generative-ai.html)

[Google Vertex AI](google-vertex.html)

[Mistral AI](mistral.html)

[Together.ai](togetherai.html)

[Cohere](cohere.html)

[Fireworks](fireworks.html)

[DeepSeek](deepseek.html)

[Cerebras](cerebras.html)

[Replicate](replicate.html)

[Perplexity](perplexity.html)

[Luma](luma.html)

[ElevenLabs](elevenlabs.html)

[AssemblyAI](assemblyai.html)

[Deepgram](deepgram.html)

[Gladia](gladia.html)

[LMNT](lmnt.html)

[Hume](hume.html)

[Rev.ai](revai.html)

[Baseten](baseten.html)

[Hugging Face](huggingface.html)

[OpenAI Compatible Providers](../openai-compatible-providers.html)

[Writing a Custom Provider](../openai-compatible-providers/custom-providers.html)

[LM Studio](../openai-compatible-providers/lmstudio.html)

[NVIDIA NIM](../openai-compatible-providers/nim.html)

[Heroku](../openai-compatible-providers/heroku.html)

[Community Providers](../community-providers.html)

[Writing a Custom Provider](../community-providers/custom-providers.html)

[Qwen](../community-providers/qwen.html)

[Ollama](../community-providers/ollama.html)

[A2A](../community-providers/a2a.html)

[Requesty](../community-providers/requesty.html)

[FriendliAI](../community-providers/friendliai.html)

[Portkey](../community-providers/portkey.html)

[Cloudflare Workers AI](../community-providers/cloudflare-workers-ai.html)

[Cloudflare AI Gateway](../community-providers/cloudflare-ai-gateway.html)

[OpenRouter](../community-providers/openrouter.html)

[Azure AI](../community-providers/azure-ai.html)

[Aihubmix](../community-providers/aihubmix.html)

[SAP AI Core](../community-providers/sap-ai.html)

[Crosshatch](../community-providers/crosshatch.html)

[Mixedbread](../community-providers/mixedbread.html)

[Voyage AI](../community-providers/voyage-ai.html)

[Jina AI](../community-providers/jina-ai.html)

[Mem0](../community-providers/mem0.html)

[Letta](../community-providers/letta.html)

[Supermemory](../community-providers/supermemory.html)

[React Native Apple](../community-providers/react-native-apple.html)

[Anthropic Vertex](../community-providers/anthropic-vertex-ai.html)

[Spark](../community-providers/spark.html)

[Inflection AI](../community-providers/inflection-ai.html)

[LangDB](../community-providers/langdb.html)

[Zhipu AI](../community-providers/zhipu.html)

[SambaNova](../community-providers/sambanova.html)

[Dify](../community-providers/dify.html)

[Sarvam](../community-providers/sarvam.html)

[AI/ML API](../community-providers/aimlapi.html)

[Claude Code](../community-providers/claude-code.html)

[Built-in AI](../community-providers/built-in-ai.html)

[Gemini CLI](../community-providers/gemini-cli.html)

[Automatic1111](../community-providers/automatic1111.html)

[Adapters](../adapters.html)

[LangChain](../adapters/langchain.html)

[LlamaIndex](../adapters/llamaindex.html)

[Observability Integrations](../observability.html)

[Axiom](../observability/axiom.html)

[Braintrust](../observability/braintrust.html)

[Helicone](../observability/helicone.html)

[Laminar](../observability/laminar.html)

[Langfuse](../observability/langfuse.html)

[LangSmith](../observability/langsmith.html)

[LangWatch](../observability/langwatch.html)

[Maxim](../observability/maxim.html)

[Patronus](../observability/patronus.html)

[Scorecard](../observability/scorecard.html)

[SigNoz](../observability/signoz.html)

[Traceloop](../observability/traceloop.html)

[Weave](../observability/weave.html)

[AI SDK Providers](../ai-sdk-providers.html)OpenAI

# [OpenAI Provider](#openai-provider)

The [OpenAI](https://openai.com/) provider contains language model support for the OpenAI responses, chat, and completion APIs, as well as embedding model support for the OpenAI embeddings API.

## [Setup](#setup)

The OpenAI provider is available in the `@ai-sdk/openai` module. You can install it with

pnpm

npm

yarn

bun

pnpm add @ai-sdk/openai

## [Provider Instance](#provider-instance)

You can import the default provider instance `openai` from `@ai-sdk/openai`:

```ts
import { openai } from '@ai-sdk/openai';
```

If you need a customized setup, you can import `createOpenAI` from `@ai-sdk/openai` and create a provider instance with your settings:

```ts
import { createOpenAI } from '@ai-sdk/openai';


const openai = createOpenAI({
  // custom settings, e.g.
  headers: {
    'header-name': 'header-value',
  },
});
```

You can use the following optional settings to customize the OpenAI provider instance:

-   **baseURL** *string*
    
    Use a different URL prefix for API calls, e.g. to use proxy servers. The default prefix is `https://api.openai.com/v1`.
    
-   **apiKey** *string*
    
    API key that is being sent using the `Authorization` header. It defaults to the `OPENAI_API_KEY` environment variable.
    
-   **name** *string*
    
    The provider name. You can set this when using OpenAI compatible providers to change the model provider property. Defaults to `openai`.
    
-   **organization** *string*
    
    OpenAI Organization.
    
-   **project** *string*
    
    OpenAI project.
    
-   **headers** *Record<string,string>*
    
    Custom headers to include in the requests.
    
-   **fetch** *(input: RequestInfo, init?: RequestInit) => Promise<Response>*
    
    Custom [fetch](https://developer.mozilla.org/en-US/docs/Web/API/fetch) implementation. Defaults to the global `fetch` function. You can use it as a middleware to intercept requests, or to provide a custom fetch implementation for e.g. testing.
    

## [Language Models](#language-models)

The OpenAI provider instance is a function that you can invoke to create a language model:

```ts
const model = openai('gpt-5');
```

It automatically selects the correct API based on the model id. You can also pass additional settings in the second argument:

```ts
const model = openai('gpt-5', {
  // additional settings
});
```

The available options depend on the API that's automatically chosen for the model (see below). If you want to explicitly select a specific model API, you can use `.responses`, `.chat`, or `.completion`.

Since AI SDK 5, the OpenAI responses API is called by default (unless you specify e.g. 'openai.chat')

### [Example](#example)

You can use OpenAI language models to generate text with the `generateText` function:

```ts
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';


const { text } = await generateText({
  model: openai('gpt-5'),
  prompt: 'Write a vegetarian lasagna recipe for 4 people.',
});
```

OpenAI language models can also be used in the `streamText`, `generateObject`, and `streamObject` functions (see [AI SDK Core](../../docs/ai-sdk-core.html)).

### [Responses Models](#responses-models)

You can use the OpenAI responses API with the `openai(modelId)` or `openai.responses(modelId)` factory methods. It is the default API that is used by the OpenAI provider (since AI SDK 5).

```ts
const model = openai('gpt-5');
```

Further configuration can be done using OpenAI provider options. You can validate the provider options using the `OpenAIResponsesProviderOptions` type.

```ts
import { openai, OpenAIResponsesProviderOptions } from '@ai-sdk/openai';
import { generateText } from 'ai';


const result = await generateText({
  model: openai('gpt-5'), // or openai.responses('gpt-5')
  providerOptions: {
    openai: {
      parallelToolCalls: false,
      store: false,
      user: 'user_123',
      // ...
    } satisfies OpenAIResponsesProviderOptions,
  },
  // ...
});
```

The following provider options are available:

-   **parallelToolCalls** *boolean* Whether to use parallel tool calls. Defaults to `true`.
    
-   **store** *boolean*
    
    Whether to store the generation. Defaults to `true`.
    
-   **maxToolCalls** *integer* The maximum number of total calls to built-in tools that can be processed in a response. This maximum number applies across all built-in tool calls, not per individual tool. Any further attempts to call a tool by the model will be ignored.
    
-   **metadata** *Record<string, string>* Additional metadata to store with the generation.
    
-   **previousResponseId** *string* The ID of the previous response. You can use it to continue a conversation. Defaults to `undefined`.
    
-   **instructions** *string* Instructions for the model. They can be used to change the system or developer message when continuing a conversation using the `previousResponseId` option. Defaults to `undefined`.
    
-   **user** *string* A unique identifier representing your end-user, which can help OpenAI to monitor and detect abuse. Defaults to `undefined`.
    
-   **reasoningEffort** *'minimal' | 'low' | 'medium' | 'high'* Reasoning effort for reasoning models. Defaults to `medium`. If you use `providerOptions` to set the `reasoningEffort` option, this model setting will be ignored.
    
-   **reasoningSummary** *'auto' | 'detailed'* Controls whether the model returns its reasoning process. Set to `'auto'` for a condensed summary, `'detailed'` for more comprehensive reasoning. Defaults to `undefined` (no reasoning summaries). When enabled, reasoning summaries appear in the stream as events with type `'reasoning'` and in non-streaming responses within the `reasoning` field.
    
-   **strictJsonSchema** *boolean* Whether to use strict JSON schema validation. Defaults to `false`.
    
-   **serviceTier** *'auto' | 'flex' | 'priority' | 'default'* Service tier for the request. Set to 'flex' for 50% cheaper processing at the cost of increased latency (available for o3, o4-mini, and gpt-5 models). Set to 'priority' for faster processing with Enterprise access (available for gpt-4, gpt-5, gpt-5-mini, o3, o4-mini; gpt-5-nano is not supported).
    
    Defaults to 'auto'.
    
-   **textVerbosity** *'low' | 'medium' | 'high'* Controls the verbosity of the model's response. Lower values result in more concise responses, while higher values result in more verbose responses. Defaults to `'medium'`.
    
-   **include** *Array<string>* Specifies additional content to include in the response. Supported values: `['file_search_call.results']` for including file search results in responses. `['message.output_text.logprobs']` for logprobs. Defaults to `undefined`.
    
-   **truncation** *string* The truncation strategy to use for the model response.
    
    -   Auto: If the input to this Response exceeds the model's context window size, the model will truncate the response to fit the context window by dropping items from the beginning of the conversation.
    -   disabled (default): If the input size will exceed the context window size for a model, the request will fail with a 400 error.
-   **promptCacheKey** *string* A cache key for manual prompt caching control. Used by OpenAI to cache responses for similar requests to optimize your cache hit rates.
    
-   **safetyIdentifier** *string* A stable identifier used to help detect users of your application that may be violating OpenAI's usage policies. The IDs should be a string that uniquely identifies each user.
    

The OpenAI responses provider also returns provider-specific metadata:

```ts
const { providerMetadata } = await generateText({
  model: openai.responses('gpt-5'),
});


const openaiMetadata = providerMetadata?.openai;
```

The following OpenAI-specific metadata is returned:

-   **responseId** *string* The ID of the response. Can be used to continue a conversation.
    
-   **cachedPromptTokens** *number* The number of prompt tokens that were a cache hit.
    
-   **reasoningTokens** *number* The number of reasoning tokens that the model generated.
    

#### [Reasoning Output](#reasoning-output)

For reasoning models like `gpt-5`, you can enable reasoning summaries to see the model's thought process. Different models support different summarizers—for example, `o4-mini` supports detailed summaries. Set `reasoningSummary: "auto"` to automatically receive the richest level available.

```ts
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';


const result = streamText({
  model: openai('gpt-5'),
  prompt: 'Tell me about the Mission burrito debate in San Francisco.',
  providerOptions: {
    openai: {
      reasoningSummary: 'detailed', // 'auto' for condensed or 'detailed' for comprehensive
    },
  },
});


for await (const part of result.fullStream) {
  if (part.type === 'reasoning') {
    console.log(`Reasoning: ${part.textDelta}`);
  } else if (part.type === 'text-delta') {
    process.stdout.write(part.textDelta);
  }
}
```

For non-streaming calls with `generateText`, the reasoning summaries are available in the `reasoning` field of the response:

```ts
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';


const result = await generateText({
  model: openai('gpt-5'),
  prompt: 'Tell me about the Mission burrito debate in San Francisco.',
  providerOptions: {
    openai: {
      reasoningSummary: 'auto',
    },
  },
});
console.log('Reasoning:', result.reasoning);
```

Learn more about reasoning summaries in the [OpenAI documentation](https://platform.openai.com/docs/guides/reasoning?api-mode=responses#reasoning-summaries).

#### [Verbosity Control](#verbosity-control)

You can control the length and detail of model responses using the `textVerbosity` parameter:

```ts
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';


const result = await generateText({
  model: openai('gpt-5-mini'),
  prompt: 'Write a poem about a boy and his first pet dog.',
  providerOptions: {
    openai: {
      textVerbosity: 'low', // 'low' for concise, 'medium' (default), or 'high' for verbose
    },
  },
});
```

The `textVerbosity` parameter scales output length without changing the underlying prompt:

-   `'low'`: Produces terse, minimal responses
-   `'medium'`: Balanced detail (default)
-   `'high'`: Verbose responses with comprehensive detail

#### [Web Search Tool](#web-search-tool)

The OpenAI responses API supports web search through the `openai.tools.webSearch` tool.

```ts
const result = await generateText({
  model: openai('gpt-5'),
  prompt: 'What happened in San Francisco last week?',
  tools: {
    web_search: openai.tools.webSearch({
      // optional configuration:
      searchContextSize: 'high',
      userLocation: {
        type: 'approximate',
        city: 'San Francisco',
        region: 'California',
      },
    }),
  },
  // Force web search tool (optional):
  toolChoice: { type: 'tool', toolName: 'web_search' },
});


// URL sources
const sources = result.sources;
```

#### [File Search Tool](#file-search-tool)

The OpenAI responses API supports file search through the `openai.tools.fileSearch` tool.

You can force the use of the file search tool by setting the `toolChoice` parameter to `{ type: 'tool', toolName: 'file_search' }`.

```ts
const result = await generateText({
  model: openai('gpt-5'),
  prompt: 'What does the document say about user authentication?',
  tools: {
    file_search: openai.tools.fileSearch({
      vectorStoreIds: ['vs_123'],
      // configuration below is optional:
      maxNumResults: 5,
      filters: {
        key: 'author',
        type: 'eq',
        value: 'Jane Smith',
      },
      ranking: {
        ranker: 'auto',
        scoreThreshold: 0.5,
      },
    }),
  },
  providerOptions: {
    openai: {
      // optional: include results
      include: ['file_search_call.results'],
    } satisfies OpenAIResponsesProviderOptions,
  },
});
```

The tool must be named `file_search` when using OpenAI's file search functionality. This name is required by OpenAI's API specification and cannot be customized.

#### [Image Generation Tool](#image-generation-tool)

OpenAI's Responses API supports multi-modal image generation as a provider-defined tool. Availability is restricted to specific models (for example, `gpt-5` variants).

You can use the image tool with either `generateText` or `streamText`:

```ts
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';


const result = await generateText({
  model: openai('gpt-5'),
  prompt:
    'Generate an image of an echidna swimming across the Mozambique channel.',
  tools: {
    image_generation: openai.tools.imageGeneration({ outputFormat: 'webp' }),
  },
});


for (const toolResult of result.staticToolResults) {
  if (toolResult.toolName === 'image_generation') {
    const base64Image = toolResult.output.result;
  }
}
```

```ts
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';


const result = streamText({
  model: openai('gpt-5'),
  prompt:
    'Generate an image of an echidna swimming across the Mozambique channel.',
  tools: {
    image_generation: openai.tools.imageGeneration({
      outputFormat: 'webp',
      quality: 'low',
    }),
  },
});


for await (const part of result.fullStream) {
  if (part.type == 'tool-result' && !part.dynamic) {
    const base64Image = part.output.result;
  }
}
```

When you set `store: false`, then previously generated images will not be accessible by the model. We recommend using the image generation tool without setting `store: false`.

For complete details on model availability, image quality controls, supported sizes, and tool-specific parameters, refer to the OpenAI documentation:

-   Image generation overview and models: [OpenAI Image Generation](https://platform.openai.com/docs/guides/image-generation)
-   Image generation tool parameters (background, size, quality, format, etc.): [Image Generation Tool Options](https://platform.openai.com/docs/guides/tools-image-generation#tool-options)

#### [Code Interpreter Tool](#code-interpreter-tool)

The OpenAI responses API supports the code interpreter tool through the `openai.tools.codeInterpreter` tool. This allows models to write and execute Python code.

```ts
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';


const result = await generateText({
  model: openai('gpt-5'),
  prompt: 'Write and run Python code to calculate the factorial of 10',
  tools: {
    code_interpreter: openai.tools.codeInterpreter({
      // optional configuration:
      container: {
        fileIds: ['file-123', 'file-456'], // optional file IDs to make available
      },
    }),
  },
});
```

The code interpreter tool can be configured with:

-   **container**: Either a container ID string or an object with `fileIds` to specify uploaded files that should be available to the code interpreter

The tool must be named `code_interpreter` when using OpenAI's code interpreter functionality. This name is required by OpenAI's API specification and cannot be customized.

#### [Local Shell Tool](#local-shell-tool)

The OpenAI responses API support the local shell tool for Codex models through the `openai.tools.localShell` tool. Local shell is a tool that allows agents to run shell commands locally on a machine you or the user provides.

```ts
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';


const result = await generateText({
  model: openai.responses('gpt-5-codex'),
  tools: {
    local_shell: openai.tools.localShell({
      execute: async ({ action }) => {
        // ... your implementation, e.g. sandbox access ...
        return { output: stdout };
      },
    }),
  },
  prompt: 'List the files in my home directory.',
  stopWhen: stepCountIs(2),
});
```

The tool must be named `local_shell`. This name is required by OpenAI's API specification and cannot be customized. The model can only be

#### [Image Inputs](#image-inputs)

The OpenAI Responses API supports Image inputs for appropriate models. You can pass Image files as part of the message content using the 'image' type:

```ts
const result = await generateText({
  model: openai('gpt-5'),
  messages: [
    {
      role: 'user',
      content: [
        {
          type: 'text',
          text: 'Please describe the image.',
        },
        {
          type: 'image',
          image: fs.readFileSync('./data/image.png'),
        },
      ],
    },
  ],
});
```

The model will have access to the image and will respond to questions about it. The image should be passed using the `image` field.

You can also pass a file-id from the OpenAI Files API.

```ts
{
  type: 'image',
  image: 'file-8EFBcWHsQxZV7YGezBC1fq'
}
```

You can also pass the URL of an image.

```ts
{
  type: 'image',
  image: 'https://sample.edu/image.png',
}
```

#### [PDF Inputs](#pdf-inputs)

The OpenAI Responses API supports reading PDF files. You can pass PDF files as part of the message content using the `file` type:

```ts
const result = await generateText({
  model: openai('gpt-5'),
  messages: [
    {
      role: 'user',
      content: [
        {
          type: 'text',
          text: 'What is an embedding model?',
        },
        {
          type: 'file',
          data: fs.readFileSync('./data/ai.pdf'),
          mediaType: 'application/pdf',
          filename: 'ai.pdf', // optional
        },
      ],
    },
  ],
});
```

You can also pass a file-id from the OpenAI Files API.

```ts
{
  type: 'file',
  data: 'file-8EFBcWHsQxZV7YGezBC1fq',
  mediaType: 'application/pdf',
}
```

You can also pass the URL of a pdf.

```ts
{
  type: 'file',
  data: 'https://sample.edu/example.pdf',
  mediaType: 'application/pdf',
  filename: 'ai.pdf', // optional
}
```

The model will have access to the contents of the PDF file and respond to questions about it. The PDF file should be passed using the `data` field, and the `mediaType` should be set to `'application/pdf'`.

#### [Structured Outputs](#structured-outputs)

The OpenAI Responses API supports structured outputs. You can enforce structured outputs using `generateObject` or `streamObject`, which expose a `schema` option. Additionally, you can pass a Zod or JSON Schema object to the `experimental_output` option when using `generateText` or `streamText`.

```ts
// Using generateObject
const result = await generateObject({
  model: openai('gpt-4.1'),
  schema: z.object({
    recipe: z.object({
      name: z.string(),
      ingredients: z.array(
        z.object({
          name: z.string(),
          amount: z.string(),
        }),
      ),
      steps: z.array(z.string()),
    }),
  }),
  prompt: 'Generate a lasagna recipe.',
});


// Using generateText
const result = await generateText({
  model: openai('gpt-4.1'),
  prompt: 'How do I make a pizza?',
  experimental_output: Output.object({
    schema: z.object({
      ingredients: z.array(z.string()),
      steps: z.array(z.string()),
    }),
  }),
});
```

### [Chat Models](#chat-models)

You can create models that call the [OpenAI chat API](https://platform.openai.com/docs/api-reference/chat) using the `.chat()` factory method. The first argument is the model id, e.g. `gpt-4`. The OpenAI chat models support tool calls and some have multi-modal capabilities.

```ts
const model = openai.chat('gpt-5');
```

OpenAI chat models support also some model specific provider options that are not part of the [standard call settings](../../docs/ai-sdk-core/settings.html). You can pass them in the `providerOptions` argument:

```ts
import { openai, type OpenAIChatLanguageModelOptions } from '@ai-sdk/openai';


const model = openai.chat('gpt-5');


await generateText({
  model,
  providerOptions: {
    openai: {
      logitBias: {
        // optional likelihood for specific tokens
        '50256': -100,
      },
      user: 'test-user', // optional unique user identifier
    } satisfies OpenAIChatLanguageModelOptions,
  },
});
```

The following optional provider options are available for OpenAI chat models:

-   **logitBias** *Record<number, number>*
    
    Modifies the likelihood of specified tokens appearing in the completion.
    
    Accepts a JSON object that maps tokens (specified by their token ID in the GPT tokenizer) to an associated bias value from -100 to 100. You can use this tokenizer tool to convert text to token IDs. Mathematically, the bias is added to the logits generated by the model prior to sampling. The exact effect will vary per model, but values between -1 and 1 should decrease or increase likelihood of selection; values like -100 or 100 should result in a ban or exclusive selection of the relevant token.
    
    As an example, you can pass `{"50256": -100}` to prevent the token from being generated.
    
-   **logprobs** *boolean | number*
    
    Return the log probabilities of the tokens. Including logprobs will increase the response size and can slow down response times. However, it can be useful to better understand how the model is behaving.
    
    Setting to true will return the log probabilities of the tokens that were generated.
    
    Setting to a number will return the log probabilities of the top n tokens that were generated.
    
-   **parallelToolCalls** *boolean*
    
    Whether to enable parallel function calling during tool use. Defaults to `true`.
    
-   **user** *string*
    
    A unique identifier representing your end-user, which can help OpenAI to monitor and detect abuse. [Learn more](https://platform.openai.com/docs/guides/safety-best-practices/end-user-ids).
    
-   **reasoningEffort** *'minimal' | 'low' | 'medium' | 'high'*
    
    Reasoning effort for reasoning models. Defaults to `medium`. If you use `providerOptions` to set the `reasoningEffort` option, this model setting will be ignored.
    
-   **structuredOutputs** *boolean*
    
    Whether to use structured outputs. Defaults to `true`.
    
    When enabled, tool calls and object generation will be strict and follow the provided schema.
    
-   **maxCompletionTokens** *number*
    
    Maximum number of completion tokens to generate. Useful for reasoning models.
    
-   **store** *boolean*
    
    Whether to enable persistence in Responses API.
    
-   **metadata** *Record<string, string>*
    
    Metadata to associate with the request.
    
-   **prediction** *Record<string, any>*
    
    Parameters for prediction mode.
    
-   **serviceTier** *'auto' | 'flex' | 'priority' | 'default'*
    
    Service tier for the request. Set to 'flex' for 50% cheaper processing at the cost of increased latency (available for o3, o4-mini, and gpt-5 models). Set to 'priority' for faster processing with Enterprise access (available for gpt-4, gpt-5, gpt-5-mini, o3, o4-mini; gpt-5-nano is not supported).
    
    Defaults to 'auto'.
    
-   **strictJsonSchema** *boolean*
    
    Whether to use strict JSON schema validation. Defaults to `false`.
    
-   **textVerbosity** *'low' | 'medium' | 'high'*
    
    Controls the verbosity of the model's responses. Lower values will result in more concise responses, while higher values will result in more verbose responses.
    
-   **promptCacheKey** *string*
    
    A cache key for manual prompt caching control. Used by OpenAI to cache responses for similar requests to optimize your cache hit rates.
    
-   **safetyIdentifier** *string*
    
    A stable identifier used to help detect users of your application that may be violating OpenAI's usage policies. The IDs should be a string that uniquely identifies each user.
    

#### [Reasoning](#reasoning)

OpenAI has introduced the `o1`,`o3`, and `o4` series of [reasoning models](https://platform.openai.com/docs/guides/reasoning). Currently, `o4-mini`, `o3`, `o3-mini`, and `o1` are available via both the chat and responses APIs. The models `codex-mini-latest` and `computer-use-preview` are available only via the [responses API](#responses-models).

Reasoning models currently only generate text, have several limitations, and are only supported using `generateText` and `streamText`.

They support additional settings and response metadata:

-   You can use `providerOptions` to set
    
    -   the `reasoningEffort` option (or alternatively the `reasoningEffort` model setting), which determines the amount of reasoning the model performs.
-   You can use response `providerMetadata` to access the number of reasoning tokens that the model generated.
    

```ts
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';


const { text, usage, providerMetadata } = await generateText({
  model: openai.chat('gpt-5'),
  prompt: 'Invent a new holiday and describe its traditions.',
  providerOptions: {
    openai: {
      reasoningEffort: 'low',
    },
  },
});


console.log(text);
console.log('Usage:', {
  ...usage,
  reasoningTokens: providerMetadata?.openai?.reasoningTokens,
});
```

System messages are automatically converted to OpenAI developer messages for reasoning models when supported.

Reasoning models require additional runtime inference to complete their reasoning phase before generating a response. This introduces longer latency compared to other models.

`maxOutputTokens` is automatically mapped to `max_completion_tokens` for reasoning models.

#### [Structured Outputs](#structured-outputs-1)

Structured outputs are enabled by default. You can disable them by setting the `structuredOutputs` option to `false`.

```ts
import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';


const result = await generateObject({
  model: openai.chat('gpt-4o-2024-08-06'),
  providerOptions: {
    openai: {
      structuredOutputs: false,
    },
  },
  schemaName: 'recipe',
  schemaDescription: 'A recipe for lasagna.',
  schema: z.object({
    name: z.string(),
    ingredients: z.array(
      z.object({
        name: z.string(),
        amount: z.string(),
      }),
    ),
    steps: z.array(z.string()),
  }),
  prompt: 'Generate a lasagna recipe.',
});


console.log(JSON.stringify(result.object, null, 2));
```

OpenAI structured outputs have several [limitations](https://openai.com/index/introducing-structured-outputs-in-the-api), in particular around the [supported schemas](https://platform.openai.com/docs/guides/structured-outputs/supported-schemas), and are therefore opt-in.

For example, optional schema properties are not supported. You need to change Zod `.nullish()` and `.optional()` to `.nullable()`.

#### [Logprobs](#logprobs)

OpenAI provides logprobs information for completion/chat models. You can access it in the `providerMetadata` object.

```ts
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';


const result = await generateText({
  model: openai.chat('gpt-5'),
  prompt: 'Write a vegetarian lasagna recipe for 4 people.',
  providerOptions: {
    openai: {
      // this can also be a number,
      // refer to logprobs provider options section for more
      logprobs: true,
    },
  },
});


const openaiMetadata = (await result.providerMetadata)?.openai;


const logprobs = openaiMetadata?.logprobs;
```

#### [Image Support](#image-support)

The OpenAI Chat API supports Image inputs for appropriate models. You can pass Image files as part of the message content using the 'image' type:

```ts
const result = await generateText({
  model: openai.chat('gpt-5'),
  messages: [
    {
      role: 'user',
      content: [
        {
          type: 'text',
          text: 'Please describe the image.',
        },
        {
          type: 'image',
          image: fs.readFileSync('./data/image.png'),
        },
      ],
    },
  ],
});
```

The model will have access to the image and will respond to questions about it. The image should be passed using the `image` field.

You can also pass the URL of an image.

```ts
{
  type: 'image',
  image: 'https://sample.edu/image.png',
}
```

#### [PDF support](#pdf-support)

The OpenAI Chat API supports reading PDF files. You can pass PDF files as part of the message content using the `file` type:

```ts
const result = await generateText({
  model: openai.chat('gpt-5'),
  messages: [
    {
      role: 'user',
      content: [
        {
          type: 'text',
          text: 'What is an embedding model?',
        },
        {
          type: 'file',
          data: fs.readFileSync('./data/ai.pdf'),
          mediaType: 'application/pdf',
          filename: 'ai.pdf', // optional
        },
      ],
    },
  ],
});
```

The model will have access to the contents of the PDF file and respond to questions about it. The PDF file should be passed using the `data` field, and the `mediaType` should be set to `'application/pdf'`.

You can also pass a file-id from the OpenAI Files API.

```ts
{
  type: 'file',
  data: 'file-8EFBcWHsQxZV7YGezBC1fq',
  mediaType: 'application/pdf',
}
```

You can also pass the URL of a PDF.

```ts
{
  type: 'file',
  data: 'https://sample.edu/example.pdf',
  mediaType: 'application/pdf',
  filename: 'ai.pdf', // optional
}
```

#### [Predicted Outputs](#predicted-outputs)

OpenAI supports [predicted outputs](https://platform.openai.com/docs/guides/latency-optimization#use-predicted-outputs) for `gpt-4o` and `gpt-4o-mini`. Predicted outputs help you reduce latency by allowing you to specify a base text that the model should modify. You can enable predicted outputs by adding the `prediction` option to the `providerOptions.openai` object:

```ts
const result = streamText({
  model: openai.chat('gpt-5'),
  messages: [
    {
      role: 'user',
      content: 'Replace the Username property with an Email property.',
    },
    {
      role: 'user',
      content: existingCode,
    },
  ],
  providerOptions: {
    openai: {
      prediction: {
        type: 'content',
        content: existingCode,
      },
    },
  },
});
```

OpenAI provides usage information for predicted outputs (`acceptedPredictionTokens` and `rejectedPredictionTokens`). You can access it in the `providerMetadata` object.

```ts
const openaiMetadata = (await result.providerMetadata)?.openai;


const acceptedPredictionTokens = openaiMetadata?.acceptedPredictionTokens;
const rejectedPredictionTokens = openaiMetadata?.rejectedPredictionTokens;
```

OpenAI Predicted Outputs have several [limitations](https://platform.openai.com/docs/guides/predicted-outputs#limitations), e.g. unsupported API parameters and no tool calling support.

#### [Image Detail](#image-detail)

You can use the `openai` provider option to set the [image input detail](https://platform.openai.com/docs/guides/images-vision?api-mode=responses#specify-image-input-detail-level) to `high`, `low`, or `auto`:

```ts
const result = await generateText({
  model: openai.chat('gpt-5'),
  messages: [
    {
      role: 'user',
      content: [
        { type: 'text', text: 'Describe the image in detail.' },
        {
          type: 'image',
          image:
            'https://github.com/vercel/ai/blob/main/examples/ai-core/data/comic-cat.png?raw=true',


          // OpenAI specific options - image detail:
          providerOptions: {
            openai: { imageDetail: 'low' },
          },
        },
      ],
    },
  ],
});
```

Because the `UIMessage` type (used by AI SDK UI hooks like `useChat`) does not support the `providerOptions` property, you can use `convertToModelMessages` first before passing the messages to functions like `generateText` or `streamText`. For more details on `providerOptions` usage, see [here](../../docs/foundations/prompts.html#provider-options).

#### [Distillation](#distillation)

OpenAI supports model distillation for some models. If you want to store a generation for use in the distillation process, you can add the `store` option to the `providerOptions.openai` object. This will save the generation to the OpenAI platform for later use in distillation.

```typescript
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import 'dotenv/config';


async function main() {
  const { text, usage } = await generateText({
    model: openai.chat('gpt-4o-mini'),
    prompt: 'Who worked on the original macintosh?',
    providerOptions: {
      openai: {
        store: true,
        metadata: {
          custom: 'value',
        },
      },
    },
  });


  console.log(text);
  console.log();
  console.log('Usage:', usage);
}


main().catch(console.error);
```

#### [Prompt Caching](#prompt-caching)

OpenAI has introduced [Prompt Caching](https://platform.openai.com/docs/guides/prompt-caching) for supported models including `gpt-4o` and `gpt-4o-mini`.

-   Prompt caching is automatically enabled for these models, when the prompt is 1024 tokens or longer. It does not need to be explicitly enabled.
-   You can use response `providerMetadata` to access the number of prompt tokens that were a cache hit.
-   Note that caching behavior is dependent on load on OpenAI's infrastructure. Prompt prefixes generally remain in the cache following 5-10 minutes of inactivity before they are evicted, but during off-peak periods they may persist for up to an hour.

```ts
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';


const { text, usage, providerMetadata } = await generateText({
  model: openai.chat('gpt-4o-mini'),
  prompt: `A 1024-token or longer prompt...`,
});


console.log(`usage:`, {
  ...usage,
  cachedPromptTokens: providerMetadata?.openai?.cachedPromptTokens,
});
```

To improve cache hit rates, you can manually control caching using the `promptCacheKey` option:

```ts
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';


const { text, usage, providerMetadata } = await generateText({
  model: openai.chat('gpt-5'),
  prompt: `A 1024-token or longer prompt...`,
  providerOptions: {
    openai: {
      promptCacheKey: 'my-custom-cache-key-123',
    },
  },
});


console.log(`usage:`, {
  ...usage,
  cachedPromptTokens: providerMetadata?.openai?.cachedPromptTokens,
});
```

#### [Audio Input](#audio-input)

With the `gpt-4o-audio-preview` model, you can pass audio files to the model.

The `gpt-4o-audio-preview` model is currently in preview and requires at least some audio inputs. It will not work with non-audio data.

```ts
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';


const result = await generateText({
  model: openai.chat('gpt-4o-audio-preview'),
  messages: [
    {
      role: 'user',
      content: [
        { type: 'text', text: 'What is the audio saying?' },
        {
          type: 'file',
          mediaType: 'audio/mpeg',
          data: fs.readFileSync('./data/galileo.mp3'),
        },
      ],
    },
  ],
});
```

### [Completion Models](#completion-models)

You can create models that call the [OpenAI completions API](https://platform.openai.com/docs/api-reference/completions) using the `.completion()` factory method. The first argument is the model id. Currently only `gpt-3.5-turbo-instruct` is supported.

```ts
const model = openai.completion('gpt-3.5-turbo-instruct');
```

OpenAI completion models support also some model specific settings that are not part of the [standard call settings](../../docs/ai-sdk-core/settings.html). You can pass them as an options argument:

```ts
const model = openai.completion('gpt-3.5-turbo-instruct');


await model.doGenerate({
  providerOptions: {
    openai: {
      echo: true, // optional, echo the prompt in addition to the completion
      logitBias: {
        // optional likelihood for specific tokens
        '50256': -100,
      },
      suffix: 'some text', // optional suffix that comes after a completion of inserted text
      user: 'test-user', // optional unique user identifier
    },
  },
});
```

The following optional provider options are available for OpenAI completion models:

-   **echo**: *boolean*
    
    Echo back the prompt in addition to the completion.
    
-   **logitBias** *Record<number, number>*
    
    Modifies the likelihood of specified tokens appearing in the completion.
    
    Accepts a JSON object that maps tokens (specified by their token ID in the GPT tokenizer) to an associated bias value from -100 to 100. You can use this tokenizer tool to convert text to token IDs. Mathematically, the bias is added to the logits generated by the model prior to sampling. The exact effect will vary per model, but values between -1 and 1 should decrease or increase likelihood of selection; values like -100 or 100 should result in a ban or exclusive selection of the relevant token.
    
    As an example, you can pass `{"50256": -100}` to prevent the <|endoftext|> token from being generated.
    
-   **logprobs** *boolean | number*
    
    Return the log probabilities of the tokens. Including logprobs will increase the response size and can slow down response times. However, it can be useful to better understand how the model is behaving.
    
    Setting to true will return the log probabilities of the tokens that were generated.
    
    Setting to a number will return the log probabilities of the top n tokens that were generated.
    
-   **suffix** *string*
    
    The suffix that comes after a completion of inserted text.
    
-   **user** *string*
    
    A unique identifier representing your end-user, which can help OpenAI to monitor and detect abuse. [Learn more](https://platform.openai.com/docs/guides/safety-best-practices/end-user-ids).
    

### [Model Capabilities](#model-capabilities)

| Model | Image Input | Audio Input | Object Generation | Tool Usage |
| --- | --- | --- | --- | --- |
| `gpt-5-pro` |  |  |  |  |
| `gpt-5` |  |  |  |  |
| `gpt-5-mini` |  |  |  |  |
| `gpt-5-nano` |  |  |  |  |
| `gpt-5-codex` |  |  |  |  |
| `gpt-5-chat-latest` |  |  |  |  |
| `gpt-4.1` |  |  |  |  |
| `gpt-4.1-mini` |  |  |  |  |
| `gpt-4.1-nano` |  |  |  |  |
| `gpt-4o` |  |  |  |  |
| `gpt-4o-mini` |  |  |  |  |

The table above lists popular models. Please see the [OpenAI docs](https://platform.openai.com/docs/models) for a full list of available models. The table above lists popular models. You can also pass any available provider model ID as a string if needed.

## [Embedding Models](#embedding-models)

You can create models that call the [OpenAI embeddings API](https://platform.openai.com/docs/api-reference/embeddings) using the `.textEmbedding()` factory method.

```ts
const model = openai.textEmbedding('text-embedding-3-large');
```

OpenAI embedding models support several additional provider options. You can pass them as an options argument:

```ts
import { openai } from '@ai-sdk/openai';
import { embed } from 'ai';


const { embedding } = await embed({
  model: openai.textEmbedding('text-embedding-3-large'),
  value: 'sunny day at the beach',
  providerOptions: {
    openai: {
      dimensions: 512, // optional, number of dimensions for the embedding
      user: 'test-user', // optional unique user identifier
    },
  },
});
```

The following optional provider options are available for OpenAI embedding models:

-   **dimensions**: *number*
    
    The number of dimensions the resulting output embeddings should have. Only supported in text-embedding-3 and later models.
    
-   **user** *string*
    
    A unique identifier representing your end-user, which can help OpenAI to monitor and detect abuse. [Learn more](https://platform.openai.com/docs/guides/safety-best-practices/end-user-ids).
    

### [Model Capabilities](#model-capabilities-1)

| Model | Default Dimensions | Custom Dimensions |
| --- | --- | --- |
| `text-embedding-3-large` | 3072 |  |
| `text-embedding-3-small` | 1536 |  |
| `text-embedding-ada-002` | 1536 |  |

## [Image Models](#image-models)

You can create models that call the [OpenAI image generation API](https://platform.openai.com/docs/api-reference/images) using the `.image()` factory method.

```ts
const model = openai.image('dall-e-3');
```

Dall-E models do not support the `aspectRatio` parameter. Use the `size` parameter instead.

### [Model Capabilities](#model-capabilities-2)

| Model | Sizes |
| --- | --- |
| `gpt-image-1-mini` | 1024x1024, 1536x1024, 1024x1536 |
| `gpt-image-1` | 1024x1024, 1536x1024, 1024x1536 |
| `dall-e-3` | 1024x1024, 1792x1024, 1024x1792 |
| `dall-e-2` | 256x256, 512x512, 1024x1024 |

You can pass optional `providerOptions` to the image model. These are prone to change by OpenAI and are model dependent. For example, the `gpt-image-1` model supports the `quality` option:

```ts
const { image, providerMetadata } = await generateImage({
  model: openai.image('gpt-image-1'),
  prompt: 'A salamander at sunrise in a forest pond in the Seychelles.',
  providerOptions: {
    openai: { quality: 'high' },
  },
});
```

For more on `generateImage()` see [Image Generation](../../docs/ai-sdk-core/image-generation.html).

OpenAI's image models may return a revised prompt for each image. It can be access at `providerMetadata.openai.images[0]?.revisedPrompt`.

For more information on the available OpenAI image model options, see the [OpenAI API reference](https://platform.openai.com/docs/api-reference/images/create).

## [Transcription Models](#transcription-models)

You can create models that call the [OpenAI transcription API](https://platform.openai.com/docs/api-reference/audio/transcribe) using the `.transcription()` factory method.

The first argument is the model id e.g. `whisper-1`.

```ts
const model = openai.transcription('whisper-1');
```

You can also pass additional provider-specific options using the `providerOptions` argument. For example, supplying the input language in ISO-639-1 (e.g. `en`) format will improve accuracy and latency.

```ts
import { experimental_transcribe as transcribe } from 'ai';
import { openai } from '@ai-sdk/openai';


const result = await transcribe({
  model: openai.transcription('whisper-1'),
  audio: new Uint8Array([1, 2, 3, 4]),
  providerOptions: { openai: { language: 'en' } },
});
```

To get word-level timestamps, specify the granularity:

```ts
import { experimental_transcribe as transcribe } from 'ai';
import { openai } from '@ai-sdk/openai';


const result = await transcribe({
  model: openai.transcription('whisper-1'),
  audio: new Uint8Array([1, 2, 3, 4]),
  providerOptions: {
    openai: {
      //timestampGranularities: ['word'],
      timestampGranularities: ['segment'],
    },
  },
});


// Access word-level timestamps
console.log(result.segments); // Array of segments with startSecond/endSecond
```

The following provider options are available:

-   **timestampGranularities** *string\[\]* The granularity of the timestamps in the transcription. Defaults to `['segment']`. Possible values are `['word']`, `['segment']`, and `['word', 'segment']`. Note: There is no additional latency for segment timestamps, but generating word timestamps incurs additional latency.
    
-   **language** *string* The language of the input audio. Supplying the input language in ISO-639-1 format (e.g. 'en') will improve accuracy and latency. Optional.
    
-   **prompt** *string* An optional text to guide the model's style or continue a previous audio segment. The prompt should match the audio language. Optional.
    
-   **temperature** *number* The sampling temperature, between 0 and 1. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic. If set to 0, the model will use log probability to automatically increase the temperature until certain thresholds are hit. Defaults to 0. Optional.
    
-   **include** *string\[\]* Additional information to include in the transcription response.
    

### [Model Capabilities](#model-capabilities-3)

| Model | Transcription | Duration | Segments | Language |
| --- | --- | --- | --- | --- |
| `whisper-1` |  |  |  |  |
| `gpt-4o-mini-transcribe` |  |  |  |  |
| `gpt-4o-transcribe` |  |  |  |  |

## [Speech Models](#speech-models)

You can create models that call the [OpenAI speech API](https://platform.openai.com/docs/api-reference/audio/speech) using the `.speech()` factory method.

The first argument is the model id e.g. `tts-1`.

```ts
const model = openai.speech('tts-1');
```

You can also pass additional provider-specific options using the `providerOptions` argument. For example, supplying a voice to use for the generated audio.

```ts
import { experimental_generateSpeech as generateSpeech } from 'ai';
import { openai } from '@ai-sdk/openai';


const result = await generateSpeech({
  model: openai.speech('tts-1'),
  text: 'Hello, world!',
  providerOptions: { openai: {} },
});
```

-   **instructions** *string* Control the voice of your generated audio with additional instructions e.g. "Speak in a slow and steady tone". Does not work with `tts-1` or `tts-1-hd`. Optional.
    
-   **response\_format** *string* The format to audio in. Supported formats are `mp3`, `opus`, `aac`, `flac`, `wav`, and `pcm`. Defaults to `mp3`. Optional.
    
-   **speed** *number* The speed of the generated audio. Select a value from 0.25 to 4.0. Defaults to 1.0. Optional.
    

### [Model Capabilities](#model-capabilities-4)

| Model | Instructions |
| --- | --- |
| `tts-1` |  |
| `tts-1-hd` |  |
| `gpt-4o-mini-tts` |  |

[Previous

Vercel

](vercel.html)

[Next

Azure OpenAI

](azure.html)

On this page

[OpenAI Provider](#openai-provider)

[Setup](#setup)

[Provider Instance](#provider-instance)

[Language Models](#language-models)

[Example](#example)

[Responses Models](#responses-models)

[Reasoning Output](#reasoning-output)

[Verbosity Control](#verbosity-control)

[Web Search Tool](#web-search-tool)

[File Search Tool](#file-search-tool)

[Image Generation Tool](#image-generation-tool)

[Code Interpreter Tool](#code-interpreter-tool)

[Local Shell Tool](#local-shell-tool)

[Image Inputs](#image-inputs)

[PDF Inputs](#pdf-inputs)

[Structured Outputs](#structured-outputs)

[Chat Models](#chat-models)

[Reasoning](#reasoning)

[Structured Outputs](#structured-outputs-1)

[Logprobs](#logprobs)

[Image Support](#image-support)

[PDF support](#pdf-support)

[Predicted Outputs](#predicted-outputs)

[Image Detail](#image-detail)

[Distillation](#distillation)

[Prompt Caching](#prompt-caching)

[Audio Input](#audio-input)

[Completion Models](#completion-models)

[Model Capabilities](#model-capabilities)

[Embedding Models](#embedding-models)

[Model Capabilities](#model-capabilities-1)

[Image Models](#image-models)

[Model Capabilities](#model-capabilities-2)

[Transcription Models](#transcription-models)

[Model Capabilities](#model-capabilities-3)

[Speech Models](#speech-models)

[Model Capabilities](#model-capabilities-4)

Deploy and Scale AI Apps with Vercel.

Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:

-   OpenAI
-   Photoroom
-   ![leonardo-ai Logo](../../_next/logo-leonardo-ai-light.svg)![leonardo-ai Logo](../../_next/logo-leonardo-ai-dark.svg)
-   ![zapier Logo](../../_next/logo-zapier-light.svg)![zapier Logo](../../_next/logo-zapier-dark.svg)

[](https://vercel.com/contact/sales?utm_source=ai_sdk&utm_medium=web&utm_campaign=contact_sales_cta&utm_content=talk_to_an_expert_sdk_docs)

#### Resources

[Docs](../../docs/introduction.html)[Cookbook](../../cookbook.html)[Providers](../ai-sdk-providers.html)[Showcase](../../showcase.html)[GitHub](https://github.com/vercel/ai)[Discussions](https://github.com/vercel/ai/discussions)

#### More

[Playground](../../playground.html)[](https://v0.dev)[Contact Sales](https://vercel.com/contact/sales)

#### About Vercel

[Next.js + Vercel](https://vercel.com/frameworks/nextjs)[Open Source Software](https://vercel.com/oss)[GitHub](https://github.com/vercel)[X](https://x.com/vercel)

#### Legal

[Privacy Policy](https://vercel.com/legal/privacy-policy)

© 2025 Vercel, Inc.