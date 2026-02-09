AI SDK Providers: Anthropic

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

[AI SDK Providers](../ai-sdk-providers.html)Anthropic

# [Anthropic Provider](#anthropic-provider)

The [Anthropic](https://www.anthropic.com/) provider contains language model support for the [Anthropic Messages API](https://docs.anthropic.com/claude/reference/messages_post).

## [Setup](#setup)

The Anthropic provider is available in the `@ai-sdk/anthropic` module. You can install it with

pnpm

npm

yarn

bun

pnpm add @ai-sdk/anthropic

## [Provider Instance](#provider-instance)

You can import the default provider instance `anthropic` from `@ai-sdk/anthropic`:

```ts
import { anthropic } from '@ai-sdk/anthropic';
```

If you need a customized setup, you can import `createAnthropic` from `@ai-sdk/anthropic` and create a provider instance with your settings:

```ts
import { createAnthropic } from '@ai-sdk/anthropic';


const anthropic = createAnthropic({
  // custom settings
});
```

You can use the following optional settings to customize the Anthropic provider instance:

-   **baseURL** *string*
    
    Use a different URL prefix for API calls, e.g. to use proxy servers. The default prefix is `https://api.anthropic.com/v1`.
    
-   **apiKey** *string*
    
    API key that is being sent using the `x-api-key` header. It defaults to the `ANTHROPIC_API_KEY` environment variable.
    
-   **headers** *Record<string,string>*
    
    Custom headers to include in the requests.
    
-   **fetch** *(input: RequestInfo, init?: RequestInit) => Promise<Response>*
    
    Custom [fetch](https://developer.mozilla.org/en-US/docs/Web/API/fetch) implementation. Defaults to the global `fetch` function. You can use it as a middleware to intercept requests, or to provide a custom fetch implementation for e.g. testing.
    

## [Language Models](#language-models)

You can create models that call the [Anthropic Messages API](https://docs.anthropic.com/claude/reference/messages_post) using the provider instance. The first argument is the model id, e.g. `claude-3-haiku-20240307`. Some models have multi-modal capabilities.

```ts
const model = anthropic('claude-3-haiku-20240307');
```

You can use Anthropic language models to generate text with the `generateText` function:

```ts
import { anthropic } from '@ai-sdk/anthropic';
import { generateText } from 'ai';


const { text } = await generateText({
  model: anthropic('claude-3-haiku-20240307'),
  prompt: 'Write a vegetarian lasagna recipe for 4 people.',
});
```

Anthropic language models can also be used in the `streamText`, `generateObject`, and `streamObject` functions (see [AI SDK Core](../../docs/ai-sdk-core.html)).

### [Structured Outputs and Tool Input Streaming](#structured-outputs-and-tool-input-streaming)

By default, the Anthropic API returns streaming tool calls and structured outputs all at once after a delay. To enable incremental streaming of tool inputs (when using `streamText` with tools) and structured outputs (when using `streamObject`), you need to set the `anthropic-beta` header to `fine-grained-tool-streaming-2025-05-14`.

#### [For structured outputs with `streamObject`](#for-structured-outputs-with-streamobject)

```ts
import { anthropic } from '@ai-sdk/anthropic';
import { streamObject } from 'ai';
import { z } from 'zod';


const result = streamObject({
  model: anthropic('claude-sonnet-4-20250514'),
  schema: z.object({
    characters: z.array(
      z.object({
        name: z.string(),
        class: z.string(),
        description: z.string(),
      }),
    ),
  }),
  prompt: 'Generate 3 character descriptions for a fantasy role playing game.',
  headers: {
    'anthropic-beta': 'fine-grained-tool-streaming-2025-05-14',
  },
});


for await (const partialObject of result.partialObjectStream) {
  console.log(partialObject);
}
```

#### [For tool input streaming with `streamText`](#for-tool-input-streaming-with-streamtext)

```ts
import { anthropic } from '@ai-sdk/anthropic';
import { streamText, tool } from 'ai';
import { z } from 'zod';


const result = streamText({
  model: anthropic('claude-sonnet-4-20250514'),
  tools: {
    writeFile: tool({
      description: 'Write content to a file',
      inputSchema: z.object({
        path: z.string(),
        content: z.string(),
      }),
      execute: async ({ path, content }) => {
        // Implementation
        return { success: true };
      },
    }),
  },
  prompt: 'Write a short story to story.txt',
  headers: {
    'anthropic-beta': 'fine-grained-tool-streaming-2025-05-14',
  },
});
```

Without this header, tool inputs and structured outputs may arrive all at once after a delay instead of streaming incrementally.

The following optional provider options are available for Anthropic models:

-   `disableParallelToolUse` *boolean*
    
    Optional. Disables the use of parallel tool calls. Defaults to `false`.
    
    When set to `true`, the model will only call one tool at a time instead of potentially calling multiple tools in parallel.
    
-   `sendReasoning` *boolean*
    
    Optional. Include reasoning content in requests sent to the model. Defaults to `true`.
    
    If you are experiencing issues with the model handling requests involving reasoning content, you can set this to `false` to omit them from the request.
    
-   `thinking` *object*
    
    Optional. See [Reasoning section](#reasoning) for more details.
    

### [Reasoning](#reasoning)

Anthropic has reasoning support for `claude-opus-4-20250514`, `claude-sonnet-4-20250514`, and `claude-3-7-sonnet-20250219` models.

You can enable it using the `thinking` provider option and specifying a thinking budget in tokens.

```ts
import { anthropic, AnthropicProviderOptions } from '@ai-sdk/anthropic';
import { generateText } from 'ai';


const { text, reasoning, reasoningDetails } = await generateText({
  model: anthropic('claude-opus-4-20250514'),
  prompt: 'How many people will live in the world in 2040?',
  providerOptions: {
    anthropic: {
      thinking: { type: 'enabled', budgetTokens: 12000 },
    } satisfies AnthropicProviderOptions,
  },
});


console.log(reasoning); // reasoning text
console.log(reasoningDetails); // reasoning details including redacted reasoning
console.log(text); // text response
```

See [AI SDK UI: Chatbot](../../docs/ai-sdk-ui/chatbot.html#reasoning) for more details on how to integrate reasoning into your chatbot.

### [Cache Control](#cache-control)

In the messages and message parts, you can use the `providerOptions` property to set cache control breakpoints. You need to set the `anthropic` property in the `providerOptions` object to `{ cacheControl: { type: 'ephemeral' } }` to set a cache control breakpoint.

The cache creation input tokens are then returned in the `providerMetadata` object for `generateText` and `generateObject`, again under the `anthropic` property. When you use `streamText` or `streamObject`, the response contains a promise that resolves to the metadata. Alternatively you can receive it in the `onFinish` callback.

```ts
import { anthropic } from '@ai-sdk/anthropic';
import { generateText } from 'ai';


const errorMessage = '... long error message ...';


const result = await generateText({
  model: anthropic('claude-3-5-sonnet-20240620'),
  messages: [
    {
      role: 'user',
      content: [
        { type: 'text', text: 'You are a JavaScript expert.' },
        {
          type: 'text',
          text: `Error message: ${errorMessage}`,
          providerOptions: {
            anthropic: { cacheControl: { type: 'ephemeral' } },
          },
        },
        { type: 'text', text: 'Explain the error message.' },
      ],
    },
  ],
});


console.log(result.text);
console.log(result.providerMetadata?.anthropic);
// e.g. { cacheCreationInputTokens: 2118 }
```

You can also use cache control on system messages by providing multiple system messages at the head of your messages array:

```ts
const result = await generateText({
  model: anthropic('claude-3-5-sonnet-20240620'),
  messages: [
    {
      role: 'system',
      content: 'Cached system message part',
      providerOptions: {
        anthropic: { cacheControl: { type: 'ephemeral' } },
      },
    },
    {
      role: 'system',
      content: 'Uncached system message part',
    },
    {
      role: 'user',
      content: 'User prompt',
    },
  ],
});
```

Cache control for tools:

```ts
const result = await generateText({
  model: anthropic('claude-3-5-haiku-latest'),
  tools: {
    cityAttractions: tool({
      inputSchema: z.object({ city: z.string() }),
      providerOptions: {
        anthropic: {
          cacheControl: { type: 'ephemeral' },
        },
      },
    }),
  },
  messages: [
    {
      role: 'user',
      content: 'User prompt',
    },
  ],
});
```

#### [Longer cache TTL](#longer-cache-ttl)

Anthropic also supports a longer 1-hour cache duration.

Here's an example:

```ts
const result = await generateText({
  model: anthropic('claude-3-5-haiku-latest'),
  messages: [
    {
      role: 'user',
      content: [
        {
          type: 'text',
          text: 'Long cached message',
          providerOptions: {
            anthropic: {
              cacheControl: { type: 'ephemeral', ttl: '1h' },
            },
          },
        },
      ],
    },
  ],
});
```

#### [Limitations](#limitations)

The minimum cacheable prompt length is:

-   1024 tokens for Claude 3.7 Sonnet, Claude 3.5 Sonnet and Claude 3 Opus
-   2048 tokens for Claude 3.5 Haiku and Claude 3 Haiku

Shorter prompts cannot be cached, even if marked with `cacheControl`. Any requests to cache fewer than this number of tokens will be processed without caching.

For more on prompt caching with Anthropic, see [Anthropic's Cache Control documentation](https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching).

Because the `UIMessage` type (used by AI SDK UI hooks like `useChat`) does not support the `providerOptions` property, you can use `convertToModelMessages` first before passing the messages to functions like `generateText` or `streamText`. For more details on `providerOptions` usage, see [here](../../docs/foundations/prompts.html#provider-options).

### [Bash Tool](#bash-tool)

The Bash Tool allows running bash commands. Here's how to create and use it:

```ts
const bashTool = anthropic.tools.bash_20241022({
  execute: async ({ command, restart }) => {
    // Implement your bash command execution logic here
    // Return the result of the command execution
  },
});
```

Parameters:

-   `command` (string): The bash command to run. Required unless the tool is being restarted.
-   `restart` (boolean, optional): Specifying true will restart this tool.

The bash tool must have the name `bash`. Only certain Claude versions are supported.

### [Memory Tool](#memory-tool)

The [Memory Tool](https://docs.claude.com/en/docs/agents-and-tools/tool-use/memory-tool) allows Claude to use a local memory, e.g. in the filesystem. Here's how to create it:

```ts
const memory = anthropic.tools.memory_20250818({
  execute: async action => {
    // Implement your memory command execution logic here
    // Return the result of the command execution
  },
});
```

The memory tool must have the name `memory`. Only certain Claude versions are supported.

### [Text Editor Tool](#text-editor-tool)

The Text Editor Tool provides functionality for viewing and editing text files.

```ts
const tools = {
  // tool name must be str_replace_based_edit_tool
  str_replace_based_edit_tool: anthropic.tools.textEditor_20250728({
    maxCharacters: 10000, // optional
    async execute({ command, path, old_str, new_str }) {
      // ...
    },
  }),
} satisfies ToolSet;
```

Different models support different versions of the tool. For Claude Sonnet 3.5 and 3.7 you need to use older tool versions and tool names.

Parameters:

-   `command` ('view' | 'create' | 'str\_replace' | 'insert' | 'undo\_edit'): The command to run. Note: `undo_edit` is only available in Claude 3.5 Sonnet and earlier models.
-   `path` (string): Absolute path to file or directory, e.g. `/repo/file.py` or `/repo`.
-   `file_text` (string, optional): Required for `create` command, with the content of the file to be created.
-   `insert_line` (number, optional): Required for `insert` command. The line number after which to insert the new string.
-   `new_str` (string, optional): New string for `str_replace` or `insert` commands.
-   `old_str` (string, optional): Required for `str_replace` command, containing the string to replace.
-   `view_range` (number\[\], optional): Optional for `view` command to specify line range to show.

### [Computer Tool](#computer-tool)

The Computer Tool enables control of keyboard and mouse actions on a computer:

```ts
const computerTool = anthropic.tools.computer_20241022({
  displayWidthPx: 1920,
  displayHeightPx: 1080,
  displayNumber: 0, // Optional, for X11 environments


  execute: async ({ action, coordinate, text }) => {
    // Implement your computer control logic here
    // Return the result of the action


    // Example code:
    switch (action) {
      case 'screenshot': {
        // multipart result:
        return {
          type: 'image',
          data: fs
            .readFileSync('./data/screenshot-editor.png')
            .toString('base64'),
        };
      }
      default: {
        console.log('Action:', action);
        console.log('Coordinate:', coordinate);
        console.log('Text:', text);
        return `executed ${action}`;
      }
    }
  },


  // map to tool result content for LLM consumption:
  toModelOutput(result) {
    return typeof result === 'string'
      ? [{ type: 'text', text: result }]
      : [{ type: 'image', data: result.data, mediaType: 'image/png' }];
  },
});
```

Parameters:

-   `action` ('key' | 'type' | 'mouse\_move' | 'left\_click' | 'left\_click\_drag' | 'right\_click' | 'middle\_click' | 'double\_click' | 'screenshot' | 'cursor\_position'): The action to perform.
-   `coordinate` (number\[\], optional): Required for `mouse_move` and `left_click_drag` actions. Specifies the (x, y) coordinates.
-   `text` (string, optional): Required for `type` and `key` actions.

These tools can be used in conjunction with the `sonnet-3-5-sonnet-20240620` model to enable more complex interactions and tasks.

### [Web Search Tool](#web-search-tool)

Anthropic provides a provider-defined web search tool that gives Claude direct access to real-time web content, allowing it to answer questions with up-to-date information beyond its knowledge cutoff.

You can enable web search using the provider-defined web search tool:

```ts
import { anthropic } from '@ai-sdk/anthropic';
import { generateText } from 'ai';


const webSearchTool = anthropic.tools.webSearch_20250305({
  maxUses: 5,
});


const result = await generateText({
  model: anthropic('claude-opus-4-20250514'),
  prompt: 'What are the latest developments in AI?',
  tools: {
    web_search: webSearchTool,
  },
});
```

Web search must be enabled in your organization's [Console settings](https://console.anthropic.com/settings/privacy).

#### [Configuration Options](#configuration-options)

The web search tool supports several configuration options:

-   **maxUses** *number*
    
    Maximum number of web searches Claude can perform during the conversation.
    
-   **allowedDomains** *string\[\]*
    
    Optional list of domains that Claude is allowed to search. If provided, searches will be restricted to these domains.
    
-   **blockedDomains** *string\[\]*
    
    Optional list of domains that Claude should avoid when searching.
    
-   **userLocation** *object*
    
    Optional user location information to provide geographically relevant search results.
    

```ts
const webSearchTool = anthropic.tools.webSearch_20250305({
  maxUses: 3,
  allowedDomains: ['techcrunch.com', 'wired.com'],
  blockedDomains: ['example-spam-site.com'],
  userLocation: {
    type: 'approximate',
    country: 'US',
    region: 'California',
    city: 'San Francisco',
    timezone: 'America/Los_Angeles',
  },
});


const result = await generateText({
  model: anthropic('claude-opus-4-20250514'),
  prompt: 'Find local news about technology',
  tools: {
    web_search: webSearchTool,
  },
});
```

### [Web Fetch Tool](#web-fetch-tool)

Anthropic provides a provider-defined web fetch tool that allows Claude to retrieve content from specific URLs. This is useful when you want Claude to analyze or reference content from a particular webpage or document.

You can enable web fetch using the provider-defined web fetch tool:

```ts
import { anthropic } from '@ai-sdk/anthropic';
import { generateText } from 'ai';


const result = await generateText({
  model: anthropic('claude-sonnet-4-0'),
  prompt:
    'What is this page about? https://en.wikipedia.org/wiki/Maglemosian_culture',
  tools: {
    web_fetch: anthropic.tools.webFetch_20250910({ maxUses: 1 }),
  },
});
```

#### [Configuration Options](#configuration-options-1)

The web fetch tool supports several configuration options:

-   **maxUses** *number*
    
    The maxUses parameter limits the number of web fetches performed.
    
-   **allowedDomains** *string\[\]*
    
    Only fetch from these domains.
    
-   **blockedDomains** *string\[\]*
    
    Never fetch from these domains.
    
-   **citations** *object*
    
    Unlike web search where citations are always enabled, citations are optional for web fetch. Set `"citations": {"enabled": true}` to enable Claude to cite specific passages from fetched documents.
    
-   **maxContentTokens** *number*
    
    The maxContentTokens parameter limits the amount of content that will be included in the context.
    

#### [Error Handling](#error-handling)

Web search errors are handled differently depending on whether you're using streaming or non-streaming:

**Non-streaming (`generateText`, `generateObject`):** Web search errors throw exceptions that you can catch:

```ts
try {
  const result = await generateText({
    model: anthropic('claude-opus-4-20250514'),
    prompt: 'Search for something',
    tools: {
      web_search: webSearchTool,
    },
  });
} catch (error) {
  if (error.message.includes('Web search failed')) {
    console.log('Search error:', error.message);
    // Handle search error appropriately
  }
}
```

**Streaming (`streamText`, `streamObject`):** Web search errors are delivered as error parts in the stream:

```ts
const result = await streamText({
  model: anthropic('claude-opus-4-20250514'),
  prompt: 'Search for something',
  tools: {
    web_search: webSearchTool,
  },
});


for await (const part of result.textStream) {
  if (part.type === 'error') {
    console.log('Search error:', part.error);
    // Handle search error appropriately
  }
}
```

## [Code Execution](#code-execution)

Anthropic provides a provider-defined code execution tool that gives Claude direct access to a real Python environment allowing it to execute code to inform its responses.

You can enable code execution using the provider-defined code execution tool:

```ts
import { anthropic } from '@ai-sdk/anthropic';
import { generateText } from 'ai';


const codeExecutionTool = anthropic.tools.codeExecution_20250825();


const result = await generateText({
  model: anthropic('claude-opus-4-20250514'),
  prompt:
    'Calculate the mean and standard deviation of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]',
  tools: {
    code_execution: codeExecutionTool,
  },
});
```

#### [Error Handling](#error-handling-1)

Code execution errors are handled differently depending on whether you're using streaming or non-streaming:

**Non-streaming (`generateText`, `generateObject`):** Code execution errors are delivered as tool result parts in the response:

```ts
const result = await generateText({
  model: anthropic('claude-opus-4-20250514'),
  prompt: 'Execute some Python script',
  tools: {
    code_execution: codeExecutionTool,
  },
});


const toolErrors = result.content?.filter(
  content => content.type === 'tool-error',
);


toolErrors?.forEach(error => {
  console.error('Tool execution error:', {
    toolName: error.toolName,
    toolCallId: error.toolCallId,
    error: error.error,
  });
});
```

**Streaming (`streamText`, `streamObject`):** Code execution errors are delivered as error parts in the stream:

```ts
const result = await streamText({
  model: anthropic('claude-opus-4-20250514'),
  prompt: 'Execute some Python script',
  tools: {
    code_execution: codeExecutionTool,
  },
});
for await (const part of result.textStream) {
  if (part.type === 'error') {
    console.log('Code execution error:', part.error);
    // Handle code execution error appropriately
  }
}
```

## [Agent Skills](#agent-skills)

[Anthropic Agent Skills](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/overview) enable Claude to perform specialized tasks like document processing (PPTX, DOCX, PDF, XLSX) and data analysis. Skills run in a sandboxed container and require the code execution tool to be enabled.

### [Using Built-in Skills](#using-built-in-skills)

Anthropic provides several built-in skills:

-   **pptx** - Create and edit PowerPoint presentations
-   **docx** - Create and edit Word documents
-   **pdf** - Process and analyze PDF files
-   **xlsx** - Work with Excel spreadsheets

To use skills, you need to:

1.  Enable the code execution tool
2.  Specify the container with skills in `providerOptions`

```ts
import { anthropic, AnthropicProviderOptions } from '@ai-sdk/anthropic';
import { generateText } from 'ai';


const result = await generateText({
  model: anthropic('claude-sonnet-4-5'),
  tools: {
    code_execution: anthropic.tools.codeExecution_20250825(),
  },
  prompt: 'Create a presentation about renewable energy with 5 slides',
  providerOptions: {
    anthropic: {
      container: {
        skills: [
          {
            type: 'anthropic',
            skillId: 'pptx',
            version: 'latest', // optional
          },
        ],
      },
    } satisfies AnthropicProviderOptions,
  },
});
```

### [Custom Skills](#custom-skills)

You can also use custom skills by specifying `type: 'custom'`:

```ts
const result = await generateText({
  model: anthropic('claude-sonnet-4-5'),
  tools: {
    code_execution: anthropic.tools.codeExecution_20250825(),
  },
  prompt: 'Use my custom skill to process this data',
  providerOptions: {
    anthropic: {
      container: {
        skills: [
          {
            type: 'custom',
            skillId: 'my-custom-skill-id',
            version: '1.0', // optional
          },
        ],
      },
    } satisfies AnthropicProviderOptions,
  },
});
```

Skills use progressive context loading and execute within a sandboxed container with code execution capabilities.

### [PDF support](#pdf-support)

Anthropic Sonnet `claude-3-5-sonnet-20241022` supports reading PDF files. You can pass PDF files as part of the message content using the `file` type:

Option 1: URL-based PDF document

```ts
const result = await generateText({
  model: anthropic('claude-3-5-sonnet-20241022'),
  messages: [
    {
      role: 'user',
      content: [
        {
          type: 'text',
          text: 'What is an embedding model according to this document?',
        },
        {
          type: 'file',
          data: new URL(
            'https://github.com/vercel/ai/blob/main/examples/ai-core/data/ai.pdf?raw=true',
          ),
          mimeType: 'application/pdf',
        },
      ],
    },
  ],
});
```

Option 2: Base64-encoded PDF document

```ts
const result = await generateText({
  model: anthropic('claude-3-5-sonnet-20241022'),
  messages: [
    {
      role: 'user',
      content: [
        {
          type: 'text',
          text: 'What is an embedding model according to this document?',
        },
        {
          type: 'file',
          data: fs.readFileSync('./data/ai.pdf'),
          mediaType: 'application/pdf',
        },
      ],
    },
  ],
});
```

The model will have access to the contents of the PDF file and respond to questions about it. The PDF file should be passed using the `data` field, and the `mediaType` should be set to `'application/pdf'`.

### [Model Capabilities](#model-capabilities)

| Model | Image Input | Object Generation | Tool Usage | Computer Use | Web Search |
| --- | --- | --- | --- | --- | --- |
| `claude-haiku-4-5` |  |  |  |  |  |
| `claude-sonnet-4-5` |  |  |  |  |  |
| `claude-opus-4-1` |  |  |  |  |  |
| `claude-opus-4-0` |  |  |  |  |  |
| `claude-sonnet-4-0` |  |  |  |  |  |
| `claude-3-7-sonnet-latest` |  |  |  |  |  |
| `claude-3-5-haiku-latest` |  |  |  |  |  |

The table above lists popular models. Please see the [Anthropic docs](https://docs.anthropic.com/en/docs/about-claude/models) for a full list of available models. The table above lists popular models. You can also pass any available provider model ID as a string if needed.

[Previous

Azure OpenAI

](azure.html)

[Next

Amazon Bedrock

](amazon-bedrock.html)

On this page

[Anthropic Provider](#anthropic-provider)

[Setup](#setup)

[Provider Instance](#provider-instance)

[Language Models](#language-models)

[Structured Outputs and Tool Input Streaming](#structured-outputs-and-tool-input-streaming)

[For structured outputs with streamObject](#for-structured-outputs-with-streamobject)

[For tool input streaming with streamText](#for-tool-input-streaming-with-streamtext)

[Reasoning](#reasoning)

[Cache Control](#cache-control)

[Longer cache TTL](#longer-cache-ttl)

[Limitations](#limitations)

[Bash Tool](#bash-tool)

[Memory Tool](#memory-tool)

[Text Editor Tool](#text-editor-tool)

[Computer Tool](#computer-tool)

[Web Search Tool](#web-search-tool)

[Configuration Options](#configuration-options)

[Web Fetch Tool](#web-fetch-tool)

[Configuration Options](#configuration-options-1)

[Error Handling](#error-handling)

[Code Execution](#code-execution)

[Error Handling](#error-handling-1)

[Agent Skills](#agent-skills)

[Using Built-in Skills](#using-built-in-skills)

[Custom Skills](#custom-skills)

[PDF support](#pdf-support)

[Model Capabilities](#model-capabilities)

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