AI SDK 5 is available now.










Menu






















































































































































































































































































































































# [Prompts](#prompts)

Prompts are instructions that you give a [large language model (LLM)](overview.html#large-language-models) to tell it what to do. It's like when you ask someone for directions; the clearer your question, the better the directions you'll get.

Many LLM providers offer complex interfaces for specifying prompts. They involve different roles and message types. While these interfaces are powerful, they can be hard to use and understand.

In order to simplify prompting, the AI SDK supports text, message, and system prompts.

## [Text Prompts](#text-prompts)

Text prompts are strings. They are ideal for simple generation use cases, e.g. repeatedly generating content for variants of the same prompt text.

You can set text prompts using the `prompt` property made available by AI SDK functions like [`streamText`](../reference/ai-sdk-core/stream-text.html) or [`generateObject`](../reference/ai-sdk-core/generate-object.html). You can structure the text in any way and inject variables, e.g. using a template literal.



``` ts
const result = await generateText();
```


You can also use template literals to provide dynamic data to your prompt.



``` ts
const result = await generateText( for $ days. ` +    `Please suggest the best tourist activities for me to do.`,});
```


## [System Prompts](#system-prompts)

System prompts are the initial set of instructions given to models that help guide and constrain the models' behaviors and responses. You can set system prompts using the `system` property. System prompts work with both the `prompt` and the `messages` properties.



``` ts
const result = await generateText( for $ days. ` +    `Please suggest the best tourist activities for me to do.`,});
```





When you use a message prompt, you can also use system messages instead of a system prompt.



## [Message Prompts](#message-prompts)

A message prompt is an array of user, assistant, and tool messages. They are great for chat interfaces and more complex, multi-modal prompts. You can use the `messages` property to set message prompts.

Each message has a `role` and a `content` property. The content can either be text (for user and assistant messages), or an array of relevant parts (data) for that message type.



``` ts
const result = await generateText(,    ,    ,  ],});
```


Instead of sending a text in the `content` property, you can send an array of parts that includes a mix of text and other content parts.




Not all language models support all message and content types. For example, some models might not be capable of handling multi-modal inputs or tool messages. [Learn more about the capabilities of select models](providers-and-models.html#model-capabilities).



### [Provider Options](#provider-options)

You can pass through additional provider-specific metadata to enable provider-specific functionality at 3 levels.

#### [Function Call Level](#function-call-level)

Functions like [`streamText`](../reference/ai-sdk-core/stream-text.html#provider-options) or [`generateText`](../reference/ai-sdk-core/generate-text.html#provider-options) accept a `providerOptions` property.

Adding provider options at the function call level should be used when you do not need granular control over where the provider options are applied.



``` ts
const  = await generateText(,  },});
```


#### [Message Level](#message-level)

For granular control over applying provider options at the message level, you can pass `providerOptions` to the message object:



``` ts
import  from 'ai';
const messages: ModelMessage[] = [   },    },  },];
```


#### [Message Part Level](#message-part-level)

Certain provider-specific options require configuration at the message part level:



``` ts
import  from 'ai';
const messages: ModelMessage[] = [  ,        },      },      ,        },      },    ],  },];
```





AI SDK UI hooks like [`useChat`](../reference/ai-sdk-ui/use-chat.html) return arrays of `UIMessage` objects, which do not support provider options. We recommend using the [`convertToModelMessages`](https://ai-sdk.dev/docs/reference/ai-sdk-ui/convert-to-core-messages) function to convert `UIMessage` objects to [`ModelMessage`](../reference/ai-sdk-core/model-message.html) objects before applying or appending message(s) or message parts with `providerOptions`.



### [User Messages](#user-messages)

#### [Text Parts](#text-parts)

Text content is the most common type of content. It is a string that is passed to the model.

If you only need to send text content in a message, the `content` property can be a string, but you can also use it to send multiple content parts.



``` ts
const result = await generateText(,      ],    },  ],});
```


#### [Image Parts](#image-parts)

User messages can include image parts. An image can be one of the following:

- base64-encoded image:
  - `string` with base-64 encoded content
  - data URL `string`, e.g. `data:image/png;base64,...`
- binary image:
  - `ArrayBuffer`
  - `Uint8Array`
  - `Buffer`
- URL:
  - http(s) URL `string`, e.g. `https://example.com/image.png`
  - `URL` object, e.g. `new URL('https://example.com/image.png')`

##### [Example: Binary image (Buffer)](#example-binary-image-buffer)



``` ts
const result = await generateText(,        ,      ],    },  ],});
```


##### [Example: Base-64 encoded image (string)](#example-base-64-encoded-image-string)



``` ts
const result = await generateText(,        ,      ],    },  ],});
```


##### [Example: Image URL (string)](#example-image-url-string)



``` ts
const result = await generateText(,        ,      ],    },  ],});
```


#### [File Parts](#file-parts)




Only a few providers and models currently support file parts: [Google Generative AI](../../providers/ai-sdk-providers/google-generative-ai.html), [Google Vertex AI](../../providers/ai-sdk-providers/google-vertex.html), [OpenAI](../../providers/ai-sdk-providers/openai.html) (for `wav` and `mp3` audio with `gpt-4o-audio-preview`), [Anthropic](../../providers/ai-sdk-providers/anthropic.html), [OpenAI](../../providers/ai-sdk-providers/openai.html) (for `pdf`).



User messages can include file parts. A file can be one of the following:

- base64-encoded file:
  - `string` with base-64 encoded content
  - data URL `string`, e.g. `data:image/png;base64,...`
- binary data:
  - `ArrayBuffer`
  - `Uint8Array`
  - `Buffer`
- URL:
  - http(s) URL `string`, e.g. `https://example.com/some.pdf`
  - `URL` object, e.g. `new URL('https://example.com/some.pdf')`

You need to specify the MIME type of the file you are sending.

##### [Example: PDF file from Buffer](#example-pdf-file-from-buffer)



``` ts
import  from '@ai-sdk/google';import  from 'ai';
const result = await generateText(,        ,      ],    },  ],});
```


##### [Example: mp3 audio file from Buffer](#example-mp3-audio-file-from-buffer)



``` ts
import  from '@ai-sdk/openai';import  from 'ai';
const result = await generateText(,        ,      ],    },  ],});
```


#### [Custom Download Function (Experimental)](#custom-download-function-experimental)

You can use custom download functions to implement throttling, retries, authentication, caching, and more.

The default download implementation automatically downloads files in parallel when they are not supported by the model.

Custom download function can be passed via the `experimental_download` property:



``` ts
const result = await generateText(>,  ): PromiseLike<    Array< | null>  > => ,  messages: [    ,      ],    },  ],});
```





The `experimental_download` option is experimental and may change in future releases.



### [Assistant Messages](#assistant-messages)

Assistant messages are messages that have a role of `assistant`. They are typically previous responses from the assistant and can contain text, reasoning, and tool call parts.

#### [Example: Assistant message with text content](#example-assistant-message-with-text-content)



``` ts
const result = await generateText(,    ,  ],});
```


#### [Example: Assistant message with text content in array](#example-assistant-message-with-text-content-in-array)



``` ts
const result = await generateText(,    ],    },  ],});
```


#### [Example: Assistant message with tool call content](#example-assistant-message-with-tool-call-content)



``` ts
const result = await generateText(,    ,        },      ],    },  ],});
```


#### [Example: Assistant message with file content](#example-assistant-message-with-file-content)




This content part is for model-generated files. Only a few models support this, and only for file types that they can generate.





``` ts
const result = await generateText(,    ,      ],    },  ],});
```


### [Tool messages](#tool-messages)




[Tools](tools.html) (also known as function calling) are programs that you can provide an LLM to extend its built-in functionality. This can be anything from calling an external API to calling functions within your UI. Learn more about Tools in [the next section](tools.html).



For models that support [tool](tools.html) calls, assistant messages can contain tool call parts, and tool messages can contain tool output parts. A single assistant message can call multiple tools, and a single tool message can contain multiple tool results.



``` ts
const result = await generateText(,        ,      ],    },    ,        },        // there could be more tool calls here (parallel calling)      ],    },    ,          },        },        // there could be more tool results here (parallel calling)      ],    },  ],});
```


#### [Multi-modal Tool Results](#multi-modal-tool-results)




Multi-part tool results are experimental and only supported by Anthropic.



Tool results can be multi-part and multi-modal, e.g. a text and an image. You can use the `experimental_content` property on tool parts to specify multi-part tool results.



``` ts
const result = await generateText(,          },        },        ,              ,            ],          },        },      ],    },  ],});
```


### [System Messages](#system-messages)

System messages are messages that are sent to the model before the user messages to guide the assistant's behavior. You can alternatively use the `system` property.



``` ts
const result = await generateText(,    ,  ],});
```

















On this page






































































































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.