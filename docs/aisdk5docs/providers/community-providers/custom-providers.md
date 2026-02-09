AI SDK 5 is available now.










Menu






















































































































































































































































































































































































































































































# [Writing a Custom Provider](#writing-a-custom-provider)


## [Publishing Your Provider](#publishing-your-provider)


## [Why the Language Model Specification?](#why-the-language-model-specification)

The Language Model Specification V2 is a standardized specification for interacting with language models that provides a unified abstraction layer across all AI providers. This specification creates a consistent interface that works seamlessly with different language models, ensuring that developers can interact with any provider using the same patterns and methods. It enables:




If you open-source a provider, we'd love to promote it here. Please send us a PR to add it to the [Community Providers](../community-providers.html) section.



## [Understanding the V2 Specification](#understanding-the-v2-specification)

The Language Model Specification V2 creates a robust abstraction layer that works across all current and future AI providers. By establishing a standardized interface, it provides the flexibility to support emerging LLM capabilities while ensuring your application code remains provider-agnostic and future-ready.

### [Architecture](#architecture)

At its heart, the V2 specification defines three main interfaces:

1.  **ProviderV2**: The top-level interface that serves as a factory for different model types
2.  **LanguageModelV2**: The primary interface for text generation models
3.  **EmbeddingModelV2** and **ImageModelV2**: Interfaces for embeddings and image generation

### [`ProviderV2`](#providerv2)

The `ProviderV2` interface acts as the entry point:



``` ts
interface ProviderV2 
```


### [`LanguageModelV2`](#languagemodelv2)

The `LanguageModelV2` interface defines the methods your provider must implement:



``` ts
interface LanguageModelV2 
```


Key aspects:

- **specificationVersion**: Must be 'V2'
- **supportedUrls**: Declares which URLs (for file parts) the provider can handle natively
- **doGenerate/doStream**: methods for non-streaming and streaming generation

### [Understanding Input vs Output](#understanding-input-vs-output)

Before diving into the details, it's important to understand the distinction between two key concepts in the V2 specification:

1.  **LanguageModelV2Content**: The specification for what the models generate
2.  **LanguageModelV2Prompt**: The specification for what you send to the model

### [`LanguageModelV2Content`](#languagemodelv2content)

The V2 specification supports five distinct content types that models can generate, each designed for specific use cases:

#### [Text Content](#text-content)

The fundamental building block for all text generation:



``` ts
type LanguageModelV2Text = ;
```


This is used for standard model responses, system messages, and any plain text output.

#### [Tool Calls](#tool-calls)

Enable models to invoke functions with structured arguments:



``` ts
type LanguageModelV2ToolCall = ;
```


The `toolCallId` is crucial for correlating tool results back to their calls, especially in streaming scenarios.

#### [File Generation](#file-generation)

Support for multimodal output generation:



``` ts
type LanguageModelV2File = ;
```


This enables models to generate images, audio, documents, and other file types directly.

#### [Reasoning](#reasoning)

Dedicated support for chain-of-thought reasoning (essential for models like OpenAI's o1):



``` ts
type LanguageModelV2Reasoning = ;
```


Reasoning content is tracked separately from regular text, allowing for proper token accounting and UI presentation.

#### [Sources](#sources)



``` ts
type LanguageModelV2Source = ;
```


### [`LanguageModelV2Prompt`](#languagemodelv2prompt)

The V2 prompt format (`LanguageModelV2Prompt`) is designed as a flexible message array that supports multimodal inputs:

#### [Message Roles](#message-roles)

Each message has a specific role with allowed content types:

- **System**: Model instructions (text only)


  ``` ts
  
  ```


- **User**: Human inputs supporting text and files


  ``` ts
  
  ```


- **Assistant**: Model outputs with full content type support


  ``` ts
  
  ```


- **Tool**: Results from tool executions


  ``` ts
  
  ```


#### [Prompt Parts](#prompt-parts)

Prompt parts are the building blocks of messages in the prompt structure. While `LanguageModelV2Content` represents the model's output content, prompt parts are specifically designed for constructing input messages. Each message role supports different types of prompt parts:

- **System messages**: Only support text content
- **User messages**: Support text and file parts
- **Assistant messages**: Support text, file, reasoning, and tool call parts
- **Tool messages**: Only support tool result parts

Let's explore each prompt part type:

##### [Text Parts](#text-parts)

The most basic prompt part, containing plain text content:



``` ts
interface LanguageModelV2TextPart 
```


##### [Reasoning Parts](#reasoning-parts)

Used in assistant messages to capture the model's reasoning process:



``` ts
interface LanguageModelV2ReasoningPart 
```


##### [File Parts](#file-parts)

Enable multimodal inputs by including files in prompts:



``` ts
interface LanguageModelV2FilePart 
```


The `data` field offers flexibility:

- **Uint8Array**: Direct binary data
- **string**: Base64-encoded data
- **URL**: Reference to external content (if supported by provider via `supportedUrls`)

##### [Tool Call Parts](#tool-call-parts)

Represent tool calls made by the assistant:



``` ts
interface LanguageModelV2ToolCallPart 
```


##### [Tool Result Parts](#tool-result-parts)

Contain the results of executed tool calls:



``` ts
interface LanguageModelV2ToolResultPart >;  providerOptions?: SharedV2ProviderOptions;}
```


The optional `content` field enables rich tool results including images, providing more flexibility than the basic `result` field.

### [Streaming](#streaming)

#### [Stream Parts](#stream-parts)

The streaming system uses typed events for different stages:

1.  **Stream Lifecycle Events**:

    - `stream-start`: Initial event with any warnings about unsupported features
    - `response-metadata`: Model information and response headers
    - `finish`: Final event with usage statistics and finish reason
    - `error`: Error events that can occur at any point

2.  **Content Events**:

    - All content types (`text`, `file`, `reasoning`, `source`, `tool-call`) stream directly
    - `tool-call-delta`: Incremental updates for tool call arguments
    - `reasoning-part-finish`: Explicit marker for reasoning section completion

Example stream sequence:



``` ts
 }, finishReason: 'stop' }
```


#### [Usage Tracking](#usage-tracking)

Enhanced usage information:



``` ts
type LanguageModelV2Usage = ;
```


### [Tools](#tools)

The V2 specification supports two types of tools:

#### [Function Tools](#function-tools)

Standard user-defined functions with JSON Schema validation:



``` ts
type LanguageModelV2FunctionTool = ;
```


#### [Provider-Defined Client Tools](#provider-defined-client-tools)

Native provider capabilities exposed as tools:



``` ts
export type LanguageModelV2ProviderClientDefinedTool = ;
```


Tool choice can be controlled via:



``` ts
toolChoice: 'auto' | 'none' | 'required' | ;
```


### [Native URL Support](#native-url-support)

Providers can declare URLs they can access directly:



``` ts
supportedUrls: 
```


The AI SDK checks these patterns before downloading any URL-based content.

### [Provider Options](#provider-options)

The specification includes a flexible system for provider-specific features without breaking the standard interface:



``` ts
providerOptions: ,  openai:   }}
```


Provider options can be specified at multiple levels:

- **Call level**: In `LanguageModelV2CallOptions`
- **Message level**: On individual messages
- **Part level**: On specific content parts (text, file, etc.)

This layered approach allows fine-grained control while maintaining compatibility.

### [Error Handling](#error-handling)

The V2 specification emphasizes robust error handling:

1.  **Streaming Errors**: Can be emitted at any point via ``
2.  **Warnings**: Non-fatal issues reported in `stream-start` and response objects
3.  **Finish Reasons**: Clear indication of why generation stopped:
    - `'stop'`: Natural completion
    - `'length'`: Hit max tokens
    - `'content-filter'`: Safety filtering
    - `'tool-calls'`: Stopped to execute tools
    - `'error'`: Generation failed
    - `'other'`: Provider-specific reasons

## [Provider Implementation Guide](#provider-implementation-guide)

To implement a custom language model provider, you'll need to install the required packages:



``` bash
npm install @ai-sdk/provider @ai-sdk/provider-utils
```


Implementing a custom language model provider involves several steps:

- Creating an entry point
- Adding a language model implementation
- Mapping the input (prompt, tools, settings)
- Processing the results (generate, streaming, tool calls)
- Supporting object generation







### [Step 1: Create the Provider Entry Point](#step-1-create-the-provider-entry-point)

Start by creating a `provider.ts` file that exports a factory function and a default instance:












``` ts
import  from '@ai-sdk/provider-utils';import  from '@ai-sdk/provider';import  from './custom-chat-language-model';
// Define your provider interface extending ProviderV2interface CustomProvider extends ProviderV2 
// Provider settingsinterface CustomProviderSettings 
// Factory function to create provider instancefunction createCustom(options: CustomProviderSettings = ): CustomProvider ,  ) =>    new CustomChatLanguageModel(modelId, settings, )}`,        ...options.headers,      }),      generateId: options.generateId ?? generateId,    });
  const provider = function (modelId: string, settings?: CustomChatSettings) 
    return createChatModel(modelId, settings);  };
  provider.languageModel = createChatModel;
  return provider as CustomProvider;}
// Export default provider instanceconst custom = createCustom();
```


### [Step 2: Implement the Language Model](#step-2-implement-the-language-model)

Create a `custom-chat-language-model.ts` file that implements `LanguageModelV2`:












``` ts
import  from '@ai-sdk/provider';import  from '@ai-sdk/provider-utils';
class CustomChatLanguageModel implements LanguageModelV2 
  // Convert AI SDK prompt to provider format  private getArgs(options: LanguageModelV2CallOptions) ;
    return ;  }
  async doGenerate(options: LanguageModelV2CallOptions)  = this.getArgs(options);
    // Make API call    const response = await postJsonToApi(/chat/completions`,      headers: this.config.headers(),      body: args,      abortSignal: options.abortSignal,    });
    // Convert provider response to AI SDK format    const content: LanguageModelV2Content[] = [];
    // Extract text content    if (response.choices[0].message.content) );    }
    // Extract tool calls    if (response.choices[0].message.tool_calls) );      }    }
    return ,      request: ,      response: ,      warnings,    };  }
  async doStream(options: LanguageModelV2CallOptions)  = this.getArgs(options);
    // Create streaming response    const response = await fetch(`$/chat/completions`, ,      body: JSON.stringify(),      signal: options.abortSignal,    });
    // Transform stream to AI SDK format    const stream = response      .body!.pipeThrough(new TextDecoderStream())      .pipeThrough(this.createParser())      .pipeThrough(this.createTransformer(warnings));
    return ;  }
  // Supported URL patterns for native file handling  get supportedUrls() ;  }}
```


### [Step 3: Implement Message Conversion](#step-3-implement-message-conversion)

Map AI SDK messages to your provider's format:












``` ts
private convertToProviderMessages(prompt: LanguageModelV2Prompt) ;
      case 'user':        return ;              case 'file':                return ,                };              default:                throw new Error(`Unsupported part type: $`);            }          }),        };
      case 'assistant':        // Handle assistant messages with text, tool calls, etc.        return this.convertAssistantMessage(message);
      case 'tool':        // Handle tool results        return this.convertToolMessage(message);
      default:        throw new Error(`Unsupported message role: $`);    }  });}
```


### [Step 4: Implement Streaming](#step-4-implement-streaming)

Create a streaming transformer that converts provider chunks to AI SDK stream parts:












``` ts
private createTransformer(warnings: LanguageModelV2CallWarning[]) );        isFirstChunk = false;      }
      // Handle different chunk types      if (chunk.choices?.[0]?.delta?.content) );      }
      if (chunk.choices?.[0]?.delta?.tool_calls) );        }      }
      // Handle finish reason      if (chunk.choices?.[0]?.finish_reason) ,        });      }    },  });}
```


### [Step 5: Handle Errors](#step-5-handle-errors)

Use standardized AI SDK errors for consistent error handling:












``` ts
import  from '@ai-sdk/provider';
private handleError(error: unknown): never );    }
    throw new APICallError();  }
  throw error;}
```


## [Next Steps](#next-steps)

- Test your provider with the AI SDK's built-in examples
















On this page










































































































































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.