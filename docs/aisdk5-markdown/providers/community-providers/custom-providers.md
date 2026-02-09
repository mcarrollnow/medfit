Community Providers: Writing a Custom Provider

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

[AI Gateway](../ai-sdk-providers/ai-gateway.html)

[xAI Grok](../ai-sdk-providers/xai.html)

[Vercel](../ai-sdk-providers/vercel.html)

[OpenAI](../ai-sdk-providers/openai.html)

[Azure OpenAI](../ai-sdk-providers/azure.html)

[Anthropic](../ai-sdk-providers/anthropic.html)

[Amazon Bedrock](../ai-sdk-providers/amazon-bedrock.html)

[Groq](../ai-sdk-providers/groq.html)

[Fal](../ai-sdk-providers/fal.html)

[DeepInfra](../ai-sdk-providers/deepinfra.html)

[Google Generative AI](../ai-sdk-providers/google-generative-ai.html)

[Google Vertex AI](../ai-sdk-providers/google-vertex.html)

[Mistral AI](../ai-sdk-providers/mistral.html)

[Together.ai](../ai-sdk-providers/togetherai.html)

[Cohere](../ai-sdk-providers/cohere.html)

[Fireworks](../ai-sdk-providers/fireworks.html)

[DeepSeek](../ai-sdk-providers/deepseek.html)

[Cerebras](../ai-sdk-providers/cerebras.html)

[Replicate](../ai-sdk-providers/replicate.html)

[Perplexity](../ai-sdk-providers/perplexity.html)

[Luma](../ai-sdk-providers/luma.html)

[ElevenLabs](../ai-sdk-providers/elevenlabs.html)

[AssemblyAI](../ai-sdk-providers/assemblyai.html)

[Deepgram](../ai-sdk-providers/deepgram.html)

[Gladia](../ai-sdk-providers/gladia.html)

[LMNT](../ai-sdk-providers/lmnt.html)

[Hume](../ai-sdk-providers/hume.html)

[Rev.ai](../ai-sdk-providers/revai.html)

[Baseten](../ai-sdk-providers/baseten.html)

[Hugging Face](../ai-sdk-providers/huggingface.html)

[OpenAI Compatible Providers](../openai-compatible-providers.html)

[Writing a Custom Provider](../openai-compatible-providers/custom-providers.html)

[LM Studio](../openai-compatible-providers/lmstudio.html)

[NVIDIA NIM](../openai-compatible-providers/nim.html)

[Heroku](../openai-compatible-providers/heroku.html)

[Community Providers](../community-providers.html)

[Writing a Custom Provider](custom-providers.html)

[Qwen](qwen.html)

[Ollama](ollama.html)

[A2A](a2a.html)

[Requesty](requesty.html)

[FriendliAI](friendliai.html)

[Portkey](portkey.html)

[Cloudflare Workers AI](cloudflare-workers-ai.html)

[Cloudflare AI Gateway](cloudflare-ai-gateway.html)

[OpenRouter](openrouter.html)

[Azure AI](azure-ai.html)

[Aihubmix](aihubmix.html)

[SAP AI Core](sap-ai.html)

[Crosshatch](crosshatch.html)

[Mixedbread](mixedbread.html)

[Voyage AI](voyage-ai.html)

[Jina AI](jina-ai.html)

[Mem0](mem0.html)

[Letta](letta.html)

[Supermemory](supermemory.html)

[React Native Apple](react-native-apple.html)

[Anthropic Vertex](anthropic-vertex-ai.html)

[Spark](spark.html)

[Inflection AI](inflection-ai.html)

[LangDB](langdb.html)

[Zhipu AI](zhipu.html)

[SambaNova](sambanova.html)

[Dify](dify.html)

[Sarvam](sarvam.html)

[AI/ML API](aimlapi.html)

[Claude Code](claude-code.html)

[Built-in AI](built-in-ai.html)

[Gemini CLI](gemini-cli.html)

[Automatic1111](automatic1111.html)

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

[Community Providers](../community-providers.html)Writing a Custom Provider

# [Writing a Custom Provider](#writing-a-custom-provider)

The AI SDK provides a [Language Model Specification](https://github.com/vercel/ai/tree/main/packages/provider/src/language-model/v2) that enables you to create custom providers compatible with the AI SDK. This specification ensures consistency across different providers.

## [Publishing Your Provider](#publishing-your-provider)

Please publish your custom provider in your own GitHub repository and as an NPM package. You are responsible for hosting and maintaining your provider. Once published, you can submit a PR to the AI SDK repository to add your provider to the [Community Providers](../community-providers.html) documentation section. Use the [OpenRouter provider documentation](https://github.com/vercel/ai/blob/main/content/providers/03-community-providers/13-openrouter.mdx) as a template for your documentation.

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

```ts
interface ProviderV2 {
  languageModel(modelId: string): LanguageModelV2;
  textEmbeddingModel(modelId: string): EmbeddingModelV2<string>;
  imageModel(modelId: string): ImageModelV2;
}
```

### [`LanguageModelV2`](#languagemodelv2)

The `LanguageModelV2` interface defines the methods your provider must implement:

```ts
interface LanguageModelV2 {
  specificationVersion: 'V2';
  provider: string;
  modelId: string;
  supportedUrls: Record<string, RegExp[]>;


  doGenerate(options: LanguageModelV2CallOptions): Promise<GenerateResult>;
  doStream(options: LanguageModelV2CallOptions): Promise<StreamResult>;
}
```

Key aspects:

-   **specificationVersion**: Must be 'V2'
-   **supportedUrls**: Declares which URLs (for file parts) the provider can handle natively
-   **doGenerate/doStream**: methods for non-streaming and streaming generation

### [Understanding Input vs Output](#understanding-input-vs-output)

Before diving into the details, it's important to understand the distinction between two key concepts in the V2 specification:

1.  **LanguageModelV2Content**: The specification for what the models generate
2.  **LanguageModelV2Prompt**: The specification for what you send to the model

### [`LanguageModelV2Content`](#languagemodelv2content)

The V2 specification supports five distinct content types that models can generate, each designed for specific use cases:

#### [Text Content](#text-content)

The fundamental building block for all text generation:

```ts
type LanguageModelV2Text = {
  type: 'text';
  text: string;
};
```

This is used for standard model responses, system messages, and any plain text output.

#### [Tool Calls](#tool-calls)

Enable models to invoke functions with structured arguments:

```ts
type LanguageModelV2ToolCall = {
  type: 'tool-call';
  toolCallType: 'function';
  toolCallId: string;
  toolName: string;
  args: string;
};
```

The `toolCallId` is crucial for correlating tool results back to their calls, especially in streaming scenarios.

#### [File Generation](#file-generation)

Support for multimodal output generation:

```ts
type LanguageModelV2File = {
  type: 'file';
  mediaType: string; // IANA media type (e.g., 'image/png', 'audio/mp3')
  data: string | Uint8Array; // Generated file data as base64 encoded strings or binary data
};
```

This enables models to generate images, audio, documents, and other file types directly.

#### [Reasoning](#reasoning)

Dedicated support for chain-of-thought reasoning (essential for models like OpenAI's o1):

```ts
type LanguageModelV2Reasoning = {
  type: 'reasoning';
  text: string;


  /**
   * Optional provider-specific metadata for the reasoning part.
   */
  providerMetadata?: SharedV2ProviderMetadata;
};
```

Reasoning content is tracked separately from regular text, allowing for proper token accounting and UI presentation.

#### [Sources](#sources)

```ts
type LanguageModelV2Source = {
  type: 'source';
  sourceType: 'url';
  id: string;
  url: string;
  title?: string;
  providerMetadata?: SharedV2ProviderMetadata;
};
```

### [`LanguageModelV2Prompt`](#languagemodelv2prompt)

The V2 prompt format (`LanguageModelV2Prompt`) is designed as a flexible message array that supports multimodal inputs:

#### [Message Roles](#message-roles)

Each message has a specific role with allowed content types:

-   **System**: Model instructions (text only)
    
    ```ts
    { role: 'system', content: string }
    ```
    
-   **User**: Human inputs supporting text and files
    
    ```ts
    { role: 'user', content: Array<LanguageModelV2TextPart | LanguageModelV2FilePart> }
    ```
    
-   **Assistant**: Model outputs with full content type support
    
    ```ts
    { role: 'assistant', content: Array<LanguageModelV2TextPart | LanguageModelV2FilePart | LanguageModelV2ReasoningPart | LanguageModelV2ToolCallPart> }
    ```
    
-   **Tool**: Results from tool executions
    
    ```ts
    { role: 'tool', content: Array<LanguageModelV2ToolResultPart> }
    ```
    

#### [Prompt Parts](#prompt-parts)

Prompt parts are the building blocks of messages in the prompt structure. While `LanguageModelV2Content` represents the model's output content, prompt parts are specifically designed for constructing input messages. Each message role supports different types of prompt parts:

-   **System messages**: Only support text content
-   **User messages**: Support text and file parts
-   **Assistant messages**: Support text, file, reasoning, and tool call parts
-   **Tool messages**: Only support tool result parts

Let's explore each prompt part type:

##### [Text Parts](#text-parts)

The most basic prompt part, containing plain text content:

```ts
interface LanguageModelV2TextPart {
  type: 'text';
  text: string;
  providerOptions?: SharedV2ProviderOptions;
}
```

##### [Reasoning Parts](#reasoning-parts)

Used in assistant messages to capture the model's reasoning process:

```ts
interface LanguageModelV2ReasoningPart {
  type: 'reasoning';
  text: string;
  providerOptions?: SharedV2ProviderOptions;
}
```

##### [File Parts](#file-parts)

Enable multimodal inputs by including files in prompts:

```ts
interface LanguageModelV2FilePart {
  type: 'file';
  filename?: string;
  data: LanguageModelV2DataContent;
  mediaType: string;
  providerOptions?: SharedV2ProviderOptions;
}
```

The `data` field offers flexibility:

-   **Uint8Array**: Direct binary data
-   **string**: Base64-encoded data
-   **URL**: Reference to external content (if supported by provider via `supportedUrls`)

##### [Tool Call Parts](#tool-call-parts)

Represent tool calls made by the assistant:

```ts
interface LanguageModelV2ToolCallPart {
  type: 'tool-call';
  toolCallId: string;
  toolName: string;
  args: unknown;
  providerOptions?: SharedV2ProviderOptions;
}
```

##### [Tool Result Parts](#tool-result-parts)

Contain the results of executed tool calls:

```ts
interface LanguageModelV2ToolResultPart {
  type: 'tool-result';
  toolCallId: string;
  toolName: string;
  result: unknown;
  isError?: boolean;
  content?: Array<{
    type: 'text' | 'image';
    text?: string;
    data?: string; // base64 encoded image data
    mediaType?: string;
  }>;
  providerOptions?: SharedV2ProviderOptions;
}
```

The optional `content` field enables rich tool results including images, providing more flexibility than the basic `result` field.

### [Streaming](#streaming)

#### [Stream Parts](#stream-parts)

The streaming system uses typed events for different stages:

1.  **Stream Lifecycle Events**:
    
    -   `stream-start`: Initial event with any warnings about unsupported features
    -   `response-metadata`: Model information and response headers
    -   `finish`: Final event with usage statistics and finish reason
    -   `error`: Error events that can occur at any point
2.  **Content Events**:
    
    -   All content types (`text`, `file`, `reasoning`, `source`, `tool-call`) stream directly
    -   `tool-call-delta`: Incremental updates for tool call arguments
    -   `reasoning-part-finish`: Explicit marker for reasoning section completion

Example stream sequence:

```ts
{ type: 'stream-start', warnings: [] }
{ type: 'text', text: 'Hello' }
{ type: 'text', text: ' world' }
{ type: 'tool-call', toolCallId: '1', toolName: 'search', args: {...} }
{ type: 'response-metadata', modelId: 'gpt-4.1', ... }
{ type: 'finish', usage: { inputTokens: 10, outputTokens: 20 }, finishReason: 'stop' }
```

#### [Usage Tracking](#usage-tracking)

Enhanced usage information:

```ts
type LanguageModelV2Usage = {
  inputTokens: number | undefined;
  outputTokens: number | undefined;
  totalTokens: number | undefined;
  reasoningTokens?: number | undefined;
  cachedInputTokens?: number | undefined;
};
```

### [Tools](#tools)

The V2 specification supports two types of tools:

#### [Function Tools](#function-tools)

Standard user-defined functions with JSON Schema validation:

```ts
type LanguageModelV2FunctionTool = {
  type: 'function';
  name: string;
  description?: string;
  parameters: JSONSchema7; // Full JSON Schema support
};
```

#### [Provider-Defined Client Tools](#provider-defined-client-tools)

Native provider capabilities exposed as tools:

```ts
export type LanguageModelV2ProviderClientDefinedTool = {
  type: 'provider-defined-client';
  id: string; // e.g., 'anthropic.computer-use'
  name: string; // Human-readable name
  args: Record<string, unknown>;
};
```

Tool choice can be controlled via:

```ts
toolChoice: 'auto' | 'none' | 'required' | { type: 'tool', toolName: string };
```

### [Native URL Support](#native-url-support)

Providers can declare URLs they can access directly:

```ts
supportedUrls: {
  'image/*': [/^https:\/\/cdn\.example\.com\/.*/],
  'application/pdf': [/^https:\/\/docs\.example\.com\/.*/],
  'audio/*': [/^https:\/\/media\.example\.com\/.*/]
}
```

The AI SDK checks these patterns before downloading any URL-based content.

### [Provider Options](#provider-options)

The specification includes a flexible system for provider-specific features without breaking the standard interface:

```ts
providerOptions: {
  anthropic: {
    cacheControl: true,
    maxTokens: 4096
  },
  openai: {
    parallelToolCalls: false,
    responseFormat: { type: 'json_object' }
  }
}
```

Provider options can be specified at multiple levels:

-   **Call level**: In `LanguageModelV2CallOptions`
-   **Message level**: On individual messages
-   **Part level**: On specific content parts (text, file, etc.)

This layered approach allows fine-grained control while maintaining compatibility.

### [Error Handling](#error-handling)

The V2 specification emphasizes robust error handling:

1.  **Streaming Errors**: Can be emitted at any point via `{ type: 'error', error: unknown }`
2.  **Warnings**: Non-fatal issues reported in `stream-start` and response objects
3.  **Finish Reasons**: Clear indication of why generation stopped:
    -   `'stop'`: Natural completion
    -   `'length'`: Hit max tokens
    -   `'content-filter'`: Safety filtering
    -   `'tool-calls'`: Stopped to execute tools
    -   `'error'`: Generation failed
    -   `'other'`: Provider-specific reasons

## [Provider Implementation Guide](#provider-implementation-guide)

To implement a custom language model provider, you'll need to install the required packages:

```bash
npm install @ai-sdk/provider @ai-sdk/provider-utils
```

Implementing a custom language model provider involves several steps:

-   Creating an entry point
-   Adding a language model implementation
-   Mapping the input (prompt, tools, settings)
-   Processing the results (generate, streaming, tool calls)
-   Supporting object generation

The best way to get started is to use the [Mistral provider](https://github.com/vercel/ai/tree/main/packages/mistral) as a reference implementation.

### [Step 1: Create the Provider Entry Point](#step-1-create-the-provider-entry-point)

Start by creating a `provider.ts` file that exports a factory function and a default instance:

```ts
import {
  generateId,
  loadApiKey,
  withoutTrailingSlash,
} from '@ai-sdk/provider-utils';
import { ProviderV2 } from '@ai-sdk/provider';
import { CustomChatLanguageModel } from './custom-chat-language-model';


// Define your provider interface extending ProviderV2
interface CustomProvider extends ProviderV2 {
  (modelId: string, settings?: CustomChatSettings): CustomChatLanguageModel;


  // Add specific methods for different model types
  languageModel(
    modelId: string,
    settings?: CustomChatSettings,
  ): CustomChatLanguageModel;
}


// Provider settings
interface CustomProviderSettings {
  /**
   * Base URL for API calls
   */
  baseURL?: string;


  /**
   * API key for authentication
   */
  apiKey?: string;


  /**
   * Custom headers for requests
   */
  headers?: Record<string, string>;
}


// Factory function to create provider instance
function createCustom(options: CustomProviderSettings = {}): CustomProvider {
  const createChatModel = (
    modelId: string,
    settings: CustomChatSettings = {},
  ) =>
    new CustomChatLanguageModel(modelId, settings, {
      provider: 'custom',
      baseURL:
        withoutTrailingSlash(options.baseURL) ?? 'https://api.custom.ai/v1',
      headers: () => ({
        Authorization: `Bearer ${loadApiKey({
          apiKey: options.apiKey,
          environmentVariableName: 'CUSTOM_API_KEY',
          description: 'Custom Provider',
        })}`,
        ...options.headers,
      }),
      generateId: options.generateId ?? generateId,
    });


  const provider = function (modelId: string, settings?: CustomChatSettings) {
    if (new.target) {
      throw new Error(
        'The model factory function cannot be called with the new keyword.',
      );
    }


    return createChatModel(modelId, settings);
  };


  provider.languageModel = createChatModel;


  return provider as CustomProvider;
}


// Export default provider instance
const custom = createCustom();
```

### [Step 2: Implement the Language Model](#step-2-implement-the-language-model)

Create a `custom-chat-language-model.ts` file that implements `LanguageModelV2`:

```ts
import { LanguageModelV2, LanguageModelV2CallOptions } from '@ai-sdk/provider';
import { postJsonToApi } from '@ai-sdk/provider-utils';


class CustomChatLanguageModel implements LanguageModelV2 {
  readonly specificationVersion = 'V2';
  readonly provider: string;
  readonly modelId: string;


  constructor(
    modelId: string,
    settings: CustomChatSettings,
    config: CustomChatConfig,
  ) {
    this.provider = config.provider;
    this.modelId = modelId;
    // Initialize with settings and config
  }


  // Convert AI SDK prompt to provider format
  private getArgs(options: LanguageModelV2CallOptions) {
    const warnings: LanguageModelV2CallWarning[] = [];


    // Map messages to provider format
    const messages = this.convertToProviderMessages(options.prompt);


    // Handle tools if provided
    const tools = options.tools
      ? this.prepareTools(options.tools, options.toolChoice)
      : undefined;


    // Build request body
    const body = {
      model: this.modelId,
      messages,
      temperature: options.temperature,
      max_tokens: options.maxOutputTokens,
      stop: options.stopSequences,
      tools,
      // ... other parameters
    };


    return { args: body, warnings };
  }


  async doGenerate(options: LanguageModelV2CallOptions) {
    const { args, warnings } = this.getArgs(options);


    // Make API call
    const response = await postJsonToApi({
      url: `${this.config.baseURL}/chat/completions`,
      headers: this.config.headers(),
      body: args,
      abortSignal: options.abortSignal,
    });


    // Convert provider response to AI SDK format
    const content: LanguageModelV2Content[] = [];


    // Extract text content
    if (response.choices[0].message.content) {
      content.push({
        type: 'text',
        text: response.choices[0].message.content,
      });
    }


    // Extract tool calls
    if (response.choices[0].message.tool_calls) {
      for (const toolCall of response.choices[0].message.tool_calls) {
        content.push({
          type: 'tool-call',
          toolCallType: 'function',
          toolCallId: toolCall.id,
          toolName: toolCall.function.name,
          args: JSON.stringify(toolCall.function.arguments),
        });
      }
    }


    return {
      content,
      finishReason: this.mapFinishReason(response.choices[0].finish_reason),
      usage: {
        inputTokens: response.usage?.prompt_tokens,
        outputTokens: response.usage?.completion_tokens,
        totalTokens: response.usage?.total_tokens,
      },
      request: { body: args },
      response: { body: response },
      warnings,
    };
  }


  async doStream(options: LanguageModelV2CallOptions) {
    const { args, warnings } = this.getArgs(options);


    // Create streaming response
    const response = await fetch(`${this.config.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        ...this.config.headers(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...args, stream: true }),
      signal: options.abortSignal,
    });


    // Transform stream to AI SDK format
    const stream = response
      .body!.pipeThrough(new TextDecoderStream())
      .pipeThrough(this.createParser())
      .pipeThrough(this.createTransformer(warnings));


    return { stream, warnings };
  }


  // Supported URL patterns for native file handling
  get supportedUrls() {
    return {
      'image/*': [/^https:\/\/example\.com\/images\/.*/],
    };
  }
}
```

### [Step 3: Implement Message Conversion](#step-3-implement-message-conversion)

Map AI SDK messages to your provider's format:

```ts
private convertToProviderMessages(prompt: LanguageModelV2Prompt) {
  return prompt.map((message) => {
    switch (message.role) {
      case 'system':
        return { role: 'system', content: message.content };


      case 'user':
        return {
          role: 'user',
          content: message.content.map((part) => {
            switch (part.type) {
              case 'text':
                return { type: 'text', text: part.text };
              case 'file':
                return {
                  type: 'image_url',
                  image_url: {
                    url: this.convertFileToUrl(part.data),
                  },
                };
              default:
                throw new Error(`Unsupported part type: ${part.type}`);
            }
          }),
        };


      case 'assistant':
        // Handle assistant messages with text, tool calls, etc.
        return this.convertAssistantMessage(message);


      case 'tool':
        // Handle tool results
        return this.convertToolMessage(message);


      default:
        throw new Error(`Unsupported message role: ${message.role}`);
    }
  });
}
```

### [Step 4: Implement Streaming](#step-4-implement-streaming)

Create a streaming transformer that converts provider chunks to AI SDK stream parts:

```ts
private createTransformer(warnings: LanguageModelV2CallWarning[]) {
  let isFirstChunk = true;


  return new TransformStream<ParsedChunk, LanguageModelV2StreamPart>({
    async transform(chunk, controller) {
      // Send warnings with first chunk
      if (isFirstChunk) {
        controller.enqueue({ type: 'stream-start', warnings });
        isFirstChunk = false;
      }


      // Handle different chunk types
      if (chunk.choices?.[0]?.delta?.content) {
        controller.enqueue({
          type: 'text',
          text: chunk.choices[0].delta.content,
        });
      }


      if (chunk.choices?.[0]?.delta?.tool_calls) {
        for (const toolCall of chunk.choices[0].delta.tool_calls) {
          controller.enqueue({
            type: 'tool-call-delta',
            toolCallType: 'function',
            toolCallId: toolCall.id,
            toolName: toolCall.function.name,
            argsTextDelta: toolCall.function.arguments,
          });
        }
      }


      // Handle finish reason
      if (chunk.choices?.[0]?.finish_reason) {
        controller.enqueue({
          type: 'finish',
          finishReason: this.mapFinishReason(chunk.choices[0].finish_reason),
          usage: {
            inputTokens: chunk.usage?.prompt_tokens,
            outputTokens: chunk.usage?.completion_tokens,
            totalTokens: chunk.usage?.total_tokens,
          },
        });
      }
    },
  });
}
```

### [Step 5: Handle Errors](#step-5-handle-errors)

Use standardized AI SDK errors for consistent error handling:

```ts
import {
  APICallError,
  InvalidResponseDataError,
  TooManyRequestsError,
} from '@ai-sdk/provider';


private handleError(error: unknown): never {
  if (error instanceof Response) {
    const status = error.status;


    if (status === 429) {
      throw new TooManyRequestsError({
        cause: error,
        retryAfter: this.getRetryAfter(error),
      });
    }


    throw new APICallError({
      statusCode: status,
      statusText: error.statusText,
      cause: error,
      isRetryable: status >= 500 && status < 600,
    });
  }


  throw error;
}
```

## [Next Steps](#next-steps)

-   Dig into the [Language Model Specification V2](https://github.com/vercel/ai/tree/main/packages/provider/src/language-model/V2)
-   Check out the [Mistral provider](https://github.com/vercel/ai/tree/main/packages/mistral) reference implementation
-   Check out [provider utilities](https://github.com/vercel/ai/tree/main/packages/provider-utils) for helpful functions
-   Test your provider with the AI SDK's built-in examples
-   Explore the V2 types in detail at [`@ai-sdk/provider`](https://github.com/vercel/ai/tree/main/packages/provider/src/language-model/V2)

[Previous

Community Providers

](../community-providers.html)

[Next

Qwen

](qwen.html)

On this page

[Writing a Custom Provider](#writing-a-custom-provider)

[Publishing Your Provider](#publishing-your-provider)

[Why the Language Model Specification?](#why-the-language-model-specification)

[Understanding the V2 Specification](#understanding-the-v2-specification)

[Architecture](#architecture)

[ProviderV2](#providerv2)

[LanguageModelV2](#languagemodelv2)

[Understanding Input vs Output](#understanding-input-vs-output)

[LanguageModelV2Content](#languagemodelv2content)

[Text Content](#text-content)

[Tool Calls](#tool-calls)

[File Generation](#file-generation)

[Reasoning](#reasoning)

[Sources](#sources)

[LanguageModelV2Prompt](#languagemodelv2prompt)

[Message Roles](#message-roles)

[Prompt Parts](#prompt-parts)

[Text Parts](#text-parts)

[Reasoning Parts](#reasoning-parts)

[File Parts](#file-parts)

[Tool Call Parts](#tool-call-parts)

[Tool Result Parts](#tool-result-parts)

[Streaming](#streaming)

[Stream Parts](#stream-parts)

[Usage Tracking](#usage-tracking)

[Tools](#tools)

[Function Tools](#function-tools)

[Provider-Defined Client Tools](#provider-defined-client-tools)

[Native URL Support](#native-url-support)

[Provider Options](#provider-options)

[Error Handling](#error-handling)

[Provider Implementation Guide](#provider-implementation-guide)

[Step 1: Create the Provider Entry Point](#step-1-create-the-provider-entry-point)

[Step 2: Implement the Language Model](#step-2-implement-the-language-model)

[Step 3: Implement Message Conversion](#step-3-implement-message-conversion)

[Step 4: Implement Streaming](#step-4-implement-streaming)

[Step 5: Handle Errors](#step-5-handle-errors)

[Next Steps](#next-steps)

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