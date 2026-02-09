AI SDK 5 is available now.










Menu






















































































































































































































































































































































































































































































# [Anthropic Provider](#anthropic-provider)


## [Setup](#setup)

The Anthropic provider is available in the `@ai-sdk/anthropic` module. You can install it with






pnpm







npm







yarn







bun








``` geist-overflow-scroll-y
pnpm add @ai-sdk/anthropic
```












## [Provider Instance](#provider-instance)

You can import the default provider instance `anthropic` from `@ai-sdk/anthropic`:



``` ts
import  from '@ai-sdk/anthropic';
```


If you need a customized setup, you can import `createAnthropic` from `@ai-sdk/anthropic` and create a provider instance with your settings:



``` ts
import  from '@ai-sdk/anthropic';
const anthropic = createAnthropic();
```


You can use the following optional settings to customize the Anthropic provider instance:

- **baseURL** *string*

  Use a different URL prefix for API calls, e.g. to use proxy servers. The default prefix is `https://api.anthropic.com/v1`.

- **apiKey** *string*

  API key that is being sent using the `x-api-key` header. It defaults to the `ANTHROPIC_API_KEY` environment variable.

- **headers** *Record\<string,string\>*

  Custom headers to include in the requests.

- **fetch** *(input: RequestInfo, init?: RequestInit) =\> Promise\<Response\>*


## [Language Models](#language-models)




``` ts
const model = anthropic('claude-3-haiku-20240307');
```


You can use Anthropic language models to generate text with the `generateText` function:



``` ts
import  from '@ai-sdk/anthropic';import  from 'ai';
const  = await generateText();
```


Anthropic language models can also be used in the `streamText`, `generateObject`, and `streamObject` functions (see [AI SDK Core](../../docs/ai-sdk-core.html)).

### [Structured Outputs and Tool Input Streaming](#structured-outputs-and-tool-input-streaming)

By default, the Anthropic API returns streaming tool calls and structured outputs all at once after a delay. To enable incremental streaming of tool inputs (when using `streamText` with tools) and structured outputs (when using `streamObject`), you need to set the `anthropic-beta` header to `fine-grained-tool-streaming-2025-05-14`.

#### [For structured outputs with `streamObject`](#for-structured-outputs-with-streamobject)



``` ts
import  from '@ai-sdk/anthropic';import  from 'ai';import  from 'zod';
const result = streamObject(),    ),  }),  prompt: 'Generate 3 character descriptions for a fantasy role playing game.',  headers: ,});
for await (const partialObject of result.partialObjectStream) 
```


#### [For tool input streaming with `streamText`](#for-tool-input-streaming-with-streamtext)



``` ts
import  from '@ai-sdk/anthropic';import  from 'ai';import  from 'zod';
const result = streamText(),      execute: async () => ;      },    }),  },  prompt: 'Write a short story to story.txt',  headers: ,});
```


Without this header, tool inputs and structured outputs may arrive all at once after a delay instead of streaming incrementally.

The following optional provider options are available for Anthropic models:

- `disableParallelToolUse` *boolean*

  Optional. Disables the use of parallel tool calls. Defaults to `false`.

  When set to `true`, the model will only call one tool at a time instead of potentially calling multiple tools in parallel.

- `sendReasoning` *boolean*

  Optional. Include reasoning content in requests sent to the model. Defaults to `true`.

  If you are experiencing issues with the model handling requests involving reasoning content, you can set this to `false` to omit them from the request.

- `thinking` *object*

  Optional. See [Reasoning section](#reasoning) for more details.

### [Reasoning](#reasoning)

Anthropic has reasoning support for `claude-opus-4-20250514`, `claude-sonnet-4-20250514`, and `claude-3-7-sonnet-20250219` models.

You can enable it using the `thinking` provider option and specifying a thinking budget in tokens.



``` ts
import  from '@ai-sdk/anthropic';import  from 'ai';
const  = await generateText(,    } satisfies AnthropicProviderOptions,  },});
console.log(reasoning); // reasoning textconsole.log(reasoningDetails); // reasoning details including redacted reasoningconsole.log(text); // text response
```


See [AI SDK UI: Chatbot](../../docs/ai-sdk-ui/chatbot.html#reasoning) for more details on how to integrate reasoning into your chatbot.

### [Cache Control](#cache-control)

In the messages and message parts, you can use the `providerOptions` property to set cache control breakpoints. You need to set the `anthropic` property in the `providerOptions` object to ` }` to set a cache control breakpoint.

The cache creation input tokens are then returned in the `providerMetadata` object for `generateText` and `generateObject`, again under the `anthropic` property. When you use `streamText` or `streamObject`, the response contains a promise that resolves to the metadata. Alternatively you can receive it in the `onFinish` callback.



``` ts
import  from '@ai-sdk/anthropic';import  from 'ai';
const errorMessage = '... long error message ...';
const result = await generateText(,        `,          providerOptions:  },          },        },        ,      ],    },  ],});
console.log(result.text);console.log(result.providerMetadata?.anthropic);// e.g. 
```


You can also use cache control on system messages by providing multiple system messages at the head of your messages array:



``` ts
const result = await generateText( },      },    },    ,    ,  ],});
```


Cache control for tools:



``` ts
const result = await generateText(),      providerOptions: ,        },      },    }),  },  messages: [    ,  ],});
```


#### [Longer cache TTL](#longer-cache-ttl)

Anthropic also supports a longer 1-hour cache duration.

Here's an example:



``` ts
const result = await generateText(,            },          },        },      ],    },  ],});
```


#### [Limitations](#limitations)

The minimum cacheable prompt length is:

- 1024 tokens for Claude 3.7 Sonnet, Claude 3.5 Sonnet and Claude 3 Opus
- 2048 tokens for Claude 3.5 Haiku and Claude 3 Haiku

Shorter prompts cannot be cached, even if marked with `cacheControl`. Any requests to cache fewer than this number of tokens will be processed without caching.





Because the `UIMessage` type (used by AI SDK UI hooks like `useChat`) does not support the `providerOptions` property, you can use `convertToModelMessages` first before passing the messages to functions like `generateText` or `streamText`. For more details on `providerOptions` usage, see [here](../../docs/foundations/prompts.html#provider-options).



### [Bash Tool](#bash-tool)

The Bash Tool allows running bash commands. Here's how to create and use it:



``` ts
const bashTool = anthropic.tools.bash_20241022() => ,});
```


Parameters:

- `command` (string): The bash command to run. Required unless the tool is being restarted.
- `restart` (boolean, optional): Specifying true will restart this tool.




The bash tool must have the name `bash`. Only certain Claude versions are supported.



### [Memory Tool](#memory-tool)




``` ts
const memory = anthropic.tools.memory_20250818(,});
```





The memory tool must have the name `memory`. Only certain Claude versions are supported.



### [Text Editor Tool](#text-editor-tool)

The Text Editor Tool provides functionality for viewing and editing text files.



``` ts
const tools = ) ,  }),} satisfies ToolSet;
```





Different models support different versions of the tool. For Claude Sonnet 3.5 and 3.7 you need to use older tool versions and tool names.



Parameters:

- `command` ('view' \| 'create' \| 'str_replace' \| 'insert' \| 'undo_edit'): The command to run. Note: `undo_edit` is only available in Claude 3.5 Sonnet and earlier models.
- `path` (string): Absolute path to file or directory, e.g. `/repo/file.py` or `/repo`.
- `file_text` (string, optional): Required for `create` command, with the content of the file to be created.
- `insert_line` (number, optional): Required for `insert` command. The line number after which to insert the new string.
- `new_str` (string, optional): New string for `str_replace` or `insert` commands.
- `old_str` (string, optional): Required for `str_replace` command, containing the string to replace.
- `view_range` (number\[\], optional): Optional for `view` command to specify line range to show.

### [Computer Tool](#computer-tool)

The Computer Tool enables control of keyboard and mouse actions on a computer:



``` ts
const computerTool = anthropic.tools.computer_20241022() => ;      }      default: `;      }    }  },
  // map to tool result content for LLM consumption:  toModelOutput(result) ]      : [];  },});
```


Parameters:

- `action` ('key' \| 'type' \| 'mouse_move' \| 'left_click' \| 'left_click_drag' \| 'right_click' \| 'middle_click' \| 'double_click' \| 'screenshot' \| 'cursor_position'): The action to perform.
- `coordinate` (number\[\], optional): Required for `mouse_move` and `left_click_drag` actions. Specifies the (x, y) coordinates.
- `text` (string, optional): Required for `type` and `key` actions.

These tools can be used in conjunction with the `sonnet-3-5-sonnet-20240620` model to enable more complex interactions and tasks.

### [Web Search Tool](#web-search-tool)

Anthropic provides a provider-defined web search tool that gives Claude direct access to real-time web content, allowing it to answer questions with up-to-date information beyond its knowledge cutoff.

You can enable web search using the provider-defined web search tool:



``` ts
import  from '@ai-sdk/anthropic';import  from 'ai';
const webSearchTool = anthropic.tools.webSearch_20250305();
const result = await generateText(,});
```








#### [Configuration Options](#configuration-options)

The web search tool supports several configuration options:

- **maxUses** *number*

  Maximum number of web searches Claude can perform during the conversation.

- **allowedDomains** *string\[\]*

  Optional list of domains that Claude is allowed to search. If provided, searches will be restricted to these domains.

- **blockedDomains** *string\[\]*

  Optional list of domains that Claude should avoid when searching.

- **userLocation** *object*

  Optional user location information to provide geographically relevant search results.



``` ts
const webSearchTool = anthropic.tools.webSearch_20250305(,});
const result = await generateText(,});
```


### [Web Fetch Tool](#web-fetch-tool)

Anthropic provides a provider-defined web fetch tool that allows Claude to retrieve content from specific URLs. This is useful when you want Claude to analyze or reference content from a particular webpage or document.

You can enable web fetch using the provider-defined web fetch tool:



``` ts
import  from '@ai-sdk/anthropic';import  from 'ai';
const result = await generateText(),  },});
```


#### [Configuration Options](#configuration-options-1)

The web fetch tool supports several configuration options:

- **maxUses** *number*

  The maxUses parameter limits the number of web fetches performed.

- **allowedDomains** *string\[\]*

  Only fetch from these domains.

- **blockedDomains** *string\[\]*

  Never fetch from these domains.

- **citations** *object*

  Unlike web search where citations are always enabled, citations are optional for web fetch. Set `"citations": ` to enable Claude to cite specific passages from fetched documents.

- **maxContentTokens** *number*

  The maxContentTokens parameter limits the amount of content that will be included in the context.

#### [Error Handling](#error-handling)

Web search errors are handled differently depending on whether you're using streaming or non-streaming:

**Non-streaming (`generateText`, `generateObject`):** Web search errors throw exceptions that you can catch:



``` ts
try ,  });} catch (error) }
```


**Streaming (`streamText`, `streamObject`):** Web search errors are delivered as error parts in the stream:



``` ts
const result = await streamText(,});
for await (const part of result.textStream) }
```


## [Code Execution](#code-execution)

Anthropic provides a provider-defined code execution tool that gives Claude direct access to a real Python environment allowing it to execute code to inform its responses.

You can enable code execution using the provider-defined code execution tool:



``` ts
import  from '@ai-sdk/anthropic';import  from 'ai';
const codeExecutionTool = anthropic.tools.codeExecution_20250825();
const result = await generateText(,});
```


#### [Error Handling](#error-handling-1)

Code execution errors are handled differently depending on whether you're using streaming or non-streaming:

**Non-streaming (`generateText`, `generateObject`):** Code execution errors are delivered as tool result parts in the response:



``` ts
const result = await generateText(,});
const toolErrors = result.content?.filter(  content => content.type === 'tool-error',);
toolErrors?.forEach(error => );});
```


**Streaming (`streamText`, `streamObject`):** Code execution errors are delivered as error parts in the stream:



``` ts
const result = await streamText(,});for await (const part of result.textStream) }
```


## [Agent Skills](#agent-skills)


### [Using Built-in Skills](#using-built-in-skills)

Anthropic provides several built-in skills:

- **pptx** - Create and edit PowerPoint presentations
- **docx** - Create and edit Word documents
- **pdf** - Process and analyze PDF files
- **xlsx** - Work with Excel spreadsheets

To use skills, you need to:

1.  Enable the code execution tool
2.  Specify the container with skills in `providerOptions`



``` ts
import  from '@ai-sdk/anthropic';import  from 'ai';
const result = await generateText(,  prompt: 'Create a presentation about renewable energy with 5 slides',  providerOptions: ,        ],      },    } satisfies AnthropicProviderOptions,  },});
```


### [Custom Skills](#custom-skills)

You can also use custom skills by specifying `type: 'custom'`:



``` ts
const result = await generateText(,  prompt: 'Use my custom skill to process this data',  providerOptions: ,        ],      },    } satisfies AnthropicProviderOptions,  },});
```





Skills use progressive context loading and execute within a sandboxed container with code execution capabilities.



### [PDF support](#pdf-support)

Anthropic Sonnet `claude-3-5-sonnet-20241022` supports reading PDF files. You can pass PDF files as part of the message content using the `file` type:

Option 1: URL-based PDF document



``` ts
const result = await generateText(,        ,      ],    },  ],});
```


Option 2: Base64-encoded PDF document



``` ts
const result = await generateText(,        ,      ],    },  ],});
```


The model will have access to the contents of the PDF file and respond to questions about it. The PDF file should be passed using the `data` field, and the `mediaType` should be set to `'application/pdf'`.

### [Model Capabilities](#model-capabilities)


| Model | Image Input | Object Generation | Tool Usage | Computer Use | Web Search |
|----|----|----|----|----|----|























On this page









































































































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.