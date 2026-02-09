AI SDK Core: generateObject

[](https://vercel.com/)

[

AI SDK



](../../../index.html)

-   [Docs](../../introduction.html)
-   [Cookbook](../../../cookbook.html)
-   [Providers](../../../providers/ai-sdk-providers.html)
-   [Playground](../../../playground.html)
-   [
    
    AI ElementsAI Elements
    
    ](../../../elements/overview.html)
-   [AI GatewayGateway](https://vercel.com/ai-gateway)

AI SDK 5 is available now.

[View Announcement](https://vercel.com/blog/ai-sdk-5)

Menu

[AI SDK by Vercel](../../introduction.html)

[Foundations](../../foundations.html)

[Overview](../../foundations/overview.html)

[Providers and Models](../../foundations/providers-and-models.html)

[Prompts](../../foundations/prompts.html)

[Tools](../../foundations/tools.html)

[Streaming](../../foundations/streaming.html)

[Getting Started](../../getting-started.html)

[Navigating the Library](../../getting-started/navigating-the-library.html)

[Next.js App Router](../../getting-started/nextjs-app-router.html)

[Next.js Pages Router](../../getting-started/nextjs-pages-router.html)

[Svelte](../../getting-started/svelte.html)

[Vue.js (Nuxt)](../../getting-started/nuxt.html)

[Node.js](../../getting-started/nodejs.html)

[Expo](../../getting-started/expo.html)

[Agents](../../agents.html)

[Agents](../../agents/overview.html)

[Building Agents](../../agents/building-agents.html)

[Workflow Patterns](../../agents/workflows.html)

[Loop Control](../../agents/loop-control.html)

[AI SDK Core](../../ai-sdk-core.html)

[Overview](../../ai-sdk-core/overview.html)

[Generating Text](../../ai-sdk-core/generating-text.html)

[Generating Structured Data](../../ai-sdk-core/generating-structured-data.html)

[Tool Calling](../../ai-sdk-core/tools-and-tool-calling.html)

[Model Context Protocol (MCP) Tools](../../ai-sdk-core/mcp-tools.html)

[Prompt Engineering](../../ai-sdk-core/prompt-engineering.html)

[Settings](../../ai-sdk-core/settings.html)

[Embeddings](../../ai-sdk-core/embeddings.html)

[Image Generation](../../ai-sdk-core/image-generation.html)

[Transcription](../../ai-sdk-core/transcription.html)

[Speech](../../ai-sdk-core/speech.html)

[Language Model Middleware](../../ai-sdk-core/middleware.html)

[Provider & Model Management](../../ai-sdk-core/provider-management.html)

[Error Handling](../../ai-sdk-core/error-handling.html)

[Testing](../../ai-sdk-core/testing.html)

[Telemetry](../../ai-sdk-core/telemetry.html)

[AI SDK UI](../../ai-sdk-ui.html)

[Overview](../../ai-sdk-ui/overview.html)

[Chatbot](../../ai-sdk-ui/chatbot.html)

[Chatbot Message Persistence](../../ai-sdk-ui/chatbot-message-persistence.html)

[Chatbot Resume Streams](../../ai-sdk-ui/chatbot-resume-streams.html)

[Chatbot Tool Usage](../../ai-sdk-ui/chatbot-tool-usage.html)

[Generative User Interfaces](../../ai-sdk-ui/generative-user-interfaces.html)

[Completion](../../ai-sdk-ui/completion.html)

[Object Generation](../../ai-sdk-ui/object-generation.html)

[Streaming Custom Data](../../ai-sdk-ui/streaming-data.html)

[Error Handling](../../ai-sdk-ui/error-handling.html)

[Transport](../../ai-sdk-ui/transport.html)

[Reading UIMessage Streams](../../ai-sdk-ui/reading-ui-message-streams.html)

[Message Metadata](../../ai-sdk-ui/message-metadata.html)

[Stream Protocols](../../ai-sdk-ui/stream-protocol.html)

[AI SDK RSC](../../ai-sdk-rsc.html)

[Advanced](../../advanced.html)

[Reference](../../reference.html)

[AI SDK Core](../ai-sdk-core.html)

[generateText](generate-text.html)

[streamText](stream-text.html)

[generateObject](generate-object.html)

[streamObject](stream-object.html)

[embed](embed.html)

[embedMany](embed-many.html)

[generateImage](generate-image.html)

[transcribe](transcribe.html)

[generateSpeech](generate-speech.html)

[tool](tool.html)

[dynamicTool](dynamic-tool.html)

[experimental\_createMCPClient](create-mcp-client.html)

[Experimental\_StdioMCPTransport](mcp-stdio-transport.html)

[jsonSchema](json-schema.html)

[zodSchema](zod-schema.html)

[valibotSchema](valibot-schema.html)

[ModelMessage](model-message.html)

[UIMessage](ui-message.html)

[validateUIMessages](validate-ui-messages.html)

[safeValidateUIMessages](safe-validate-ui-messages.html)

[createProviderRegistry](provider-registry.html)

[customProvider](custom-provider.html)

[cosineSimilarity](cosine-similarity.html)

[wrapLanguageModel](wrap-language-model.html)

[LanguageModelV2Middleware](language-model-v2-middleware.html)

[extractReasoningMiddleware](extract-reasoning-middleware.html)

[simulateStreamingMiddleware](simulate-streaming-middleware.html)

[defaultSettingsMiddleware](default-settings-middleware.html)

[stepCountIs](step-count-is.html)

[hasToolCall](has-tool-call.html)

[simulateReadableStream](simulate-readable-stream.html)

[smoothStream](smooth-stream.html)

[generateId](generate-id.html)

[createIdGenerator](create-id-generator.html)

[AI SDK UI](../ai-sdk-ui.html)

[AI SDK RSC](../ai-sdk-rsc.html)

[Stream Helpers](../stream-helpers.html)

[AI SDK Errors](../ai-sdk-errors.html)

[Migration Guides](../../migration-guides.html)

[Troubleshooting](../../troubleshooting.html)

[AI SDK Core](../../ai-sdk-core.html)generateObject

# [`generateObject()`](#generateobject)

Generates a typed, structured object for a given prompt and schema using a language model.

It can be used to force the language model to return structured data, e.g. for information extraction, synthetic data generation, or classification tasks.

#### [Example: generate an object using a schema](#example-generate-an-object-using-a-schema)

```ts
import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';


const { object } = await generateObject({
  model: openai('gpt-4.1'),
  schema: z.object({
    recipe: z.object({
      name: z.string(),
      ingredients: z.array(z.string()),
      steps: z.array(z.string()),
    }),
  }),
  prompt: 'Generate a lasagna recipe.',
});


console.log(JSON.stringify(object, null, 2));
```

#### [Example: generate an array using a schema](#example-generate-an-array-using-a-schema)

For arrays, you specify the schema of the array items.

```ts
import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';


const { object } = await generateObject({
  model: openai('gpt-4.1'),
  output: 'array',
  schema: z.object({
    name: z.string(),
    class: z
      .string()
      .describe('Character class, e.g. warrior, mage, or thief.'),
    description: z.string(),
  }),
  prompt: 'Generate 3 hero descriptions for a fantasy role playing game.',
});
```

#### [Example: generate an enum](#example-generate-an-enum)

When you want to generate a specific enum value, you can set the output strategy to `enum` and provide the list of possible values in the `enum` parameter.

```ts
import { generateObject } from 'ai';


const { object } = await generateObject({
  model: 'openai/gpt-4.1',
  output: 'enum',
  enum: ['action', 'comedy', 'drama', 'horror', 'sci-fi'],
  prompt:
    'Classify the genre of this movie plot: ' +
    '"A group of astronauts travel through a wormhole in search of a ' +
    'new habitable planet for humanity."',
});
```

#### [Example: generate JSON without a schema](#example-generate-json-without-a-schema)

```ts
import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';


const { object } = await generateObject({
  model: openai('gpt-4.1'),
  output: 'no-schema',
  prompt: 'Generate a lasagna recipe.',
});
```

To see `generateObject` in action, check out the [additional examples](#more-examples).

## [Import](#import)

import { generateObject } from "ai"

## [API Signature](#api-signature)

### [Parameters](#parameters)

### model:

LanguageModel

The language model to use. Example: openai('gpt-4.1')

### output:

'object' | 'array' | 'enum' | 'no-schema' | undefined

The type of output to generate. Defaults to 'object'.

### mode:

'auto' | 'json' | 'tool'

The mode to use for object generation. Not every model supports all modes. Defaults to 'auto' for 'object' output and to 'json' for 'no-schema' output. Must be 'json' for 'no-schema' output.

### schema:

Zod Schema | JSON Schema

The schema that describes the shape of the object to generate. It is sent to the model to generate the object and used to validate the output. You can either pass in a Zod schema or a JSON schema (using the \`jsonSchema\` function). In 'array' mode, the schema is used to describe an array element. Not available with 'no-schema' or 'enum' output.

### schemaName:

string | undefined

Optional name of the output that should be generated. Used by some providers for additional LLM guidance, e.g. via tool or schema name. Not available with 'no-schema' or 'enum' output.

### schemaDescription:

string | undefined

Optional description of the output that should be generated. Used by some providers for additional LLM guidance, e.g. via tool or schema name. Not available with 'no-schema' or 'enum' output.

### enum:

string\[\]

List of possible values to generate. Only available with 'enum' output.

### system:

string

The system prompt to use that specifies the behavior of the model.

### prompt:

string | Array<SystemModelMessage | UserModelMessage | AssistantModelMessage | ToolModelMessage>

The input prompt to generate the text from.

### messages:

Array<SystemModelMessage | UserModelMessage | AssistantModelMessage | ToolModelMessage>

A list of messages that represent a conversation. Automatically converts UI messages from the useChat hook.

SystemModelMessage

### role:

'system'

The role for the system message.

### content:

string

The content of the message.

UserModelMessage

### role:

'user'

The role for the user message.

### content:

string | Array<TextPart | ImagePart | FilePart>

The content of the message.

TextPart

### type:

'text'

The type of the message part.

### text:

string

The text content of the message part.

ImagePart

### type:

'image'

The type of the message part.

### image:

string | Uint8Array | Buffer | ArrayBuffer | URL

The image content of the message part. String are either base64 encoded content, base64 data URLs, or http(s) URLs.

### mediaType?:

string

The IANA media type of the image. Optional.

FilePart

### type:

'file'

The type of the message part.

### data:

string | Uint8Array | Buffer | ArrayBuffer | URL

The file content of the message part. String are either base64 encoded content, base64 data URLs, or http(s) URLs.

### mediaType:

string

The IANA media type of the file.

AssistantModelMessage

### role:

'assistant'

The role for the assistant message.

### content:

string | Array<TextPart | FilePart | ReasoningPart | ToolCallPart>

The content of the message.

TextPart

### type:

'text'

The type of the message part.

### text:

string

The text content of the message part.

ReasoningPart

### type:

'reasoning'

The type of the message part.

### text:

string

The reasoning text.

FilePart

### type:

'file'

The type of the message part.

### data:

string | Uint8Array | Buffer | ArrayBuffer | URL

The file content of the message part. String are either base64 encoded content, base64 data URLs, or http(s) URLs.

### mediaType:

string

The IANA media type of the file.

### filename?:

string

The name of the file.

ToolCallPart

### type:

'tool-call'

The type of the message part.

### toolCallId:

string

The id of the tool call.

### toolName:

string

The name of the tool, which typically would be the name of the function.

### args:

object based on zod schema

Parameters generated by the model to be used by the tool.

ToolModelMessage

### role:

'tool'

The role for the assistant message.

### content:

Array<ToolResultPart>

The content of the message.

ToolResultPart

### type:

'tool-result'

The type of the message part.

### toolCallId:

string

The id of the tool call the result corresponds to.

### toolName:

string

The name of the tool the result corresponds to.

### result:

unknown

The result returned by the tool after execution.

### isError?:

boolean

Whether the result is an error or an error message.

### maxOutputTokens?:

number

Maximum number of tokens to generate.

### temperature?:

number

Temperature setting. The value is passed through to the provider. The range depends on the provider and model. It is recommended to set either \`temperature\` or \`topP\`, but not both.

### topP?:

number

Nucleus sampling. The value is passed through to the provider. The range depends on the provider and model. It is recommended to set either \`temperature\` or \`topP\`, but not both.

### topK?:

number

Only sample from the top K options for each subsequent token. Used to remove "long tail" low probability responses. Recommended for advanced use cases only. You usually only need to use temperature.

### presencePenalty?:

number

Presence penalty setting. It affects the likelihood of the model to repeat information that is already in the prompt. The value is passed through to the provider. The range depends on the provider and model.

### frequencyPenalty?:

number

Frequency penalty setting. It affects the likelihood of the model to repeatedly use the same words or phrases. The value is passed through to the provider. The range depends on the provider and model.

### seed?:

number

The seed (integer) to use for random sampling. If set and supported by the model, calls will generate deterministic results.

### maxRetries?:

number

Maximum number of retries. Set to 0 to disable retries. Default: 2.

### abortSignal?:

AbortSignal

An optional abort signal that can be used to cancel the call.

### headers?:

Record<string, string>

Additional HTTP headers to be sent with the request. Only applicable for HTTP-based providers.

### experimental\_repairText?:

(options: RepairTextOptions) => Promise<string>

A function that attempts to repair the raw output of the model to enable JSON parsing. Should return the repaired text or null if the text cannot be repaired.

RepairTextOptions

### text:

string

The text that was generated by the model.

### error:

JSONParseError | TypeValidationError

The error that occurred while parsing the text.

### experimental\_download?:

(requestedDownloads: Array<{ url: URL; isUrlSupportedByModel: boolean }>) => Promise<Array<null | { data: Uint8Array; mediaType?: string }>>

Custom download function to control how URLs are fetched when they appear in prompts. By default, files are downloaded if the model does not support the URL for the given media type. Experimental feature. Return null to pass the URL directly to the model (when supported), or return downloaded content with data and media type.

### experimental\_telemetry?:

TelemetrySettings

Telemetry configuration. Experimental feature.

TelemetrySettings

### isEnabled?:

boolean

Enable or disable telemetry. Disabled by default while experimental.

### recordInputs?:

boolean

Enable or disable input recording. Enabled by default.

### recordOutputs?:

boolean

Enable or disable output recording. Enabled by default.

### functionId?:

string

Identifier for this function. Used to group telemetry data by function.

### metadata?:

Record<string, string | number | boolean | Array<null | undefined | string> | Array<null | undefined | number> | Array<null | undefined | boolean>>

Additional information to include in the telemetry data.

### providerOptions?:

Record<string,Record<string,JSONValue>> | undefined

Provider-specific options. The outer key is the provider name. The inner values are the metadata. Details depend on the provider.

### [Returns](#returns)

### object:

based on the schema

The generated object, validated by the schema (if it supports validation).

### finishReason:

'stop' | 'length' | 'content-filter' | 'tool-calls' | 'error' | 'other' | 'unknown'

The reason the model finished generating the text.

### usage:

LanguageModelUsage

The token usage of the generated text.

LanguageModelUsage

### inputTokens:

number | undefined

The number of input (prompt) tokens used.

### outputTokens:

number | undefined

The number of output (completion) tokens used.

### totalTokens:

number | undefined

The total number of tokens as reported by the provider. This number might be different from the sum of inputTokens and outputTokens and e.g. include reasoning tokens or other overhead.

### reasoningTokens?:

number | undefined

The number of reasoning tokens used.

### cachedInputTokens?:

number | undefined

The number of cached input tokens.

### request?:

LanguageModelRequestMetadata

Request metadata.

LanguageModelRequestMetadata

### body:

string

Raw request HTTP body that was sent to the provider API as a string (JSON should be stringified).

### response?:

LanguageModelResponseMetadata

Response metadata.

LanguageModelResponseMetadata

### id:

string

The response identifier. The AI SDK uses the ID from the provider response when available, and generates an ID otherwise.

### modelId:

string

The model that was used to generate the response. The AI SDK uses the response model from the provider response when available, and the model from the function call otherwise.

### timestamp:

Date

The timestamp of the response. The AI SDK uses the response timestamp from the provider response when available, and creates a timestamp otherwise.

### headers?:

Record<string, string>

Optional response headers.

### body?:

unknown

Optional response body.

### reasoning:

string | undefined

The reasoning that was used to generate the object. Concatenated from all reasoning parts.

### warnings:

CallWarning\[\] | undefined

Warnings from the model provider (e.g. unsupported settings).

### providerMetadata:

ProviderMetadata | undefined

Optional metadata from the provider. The outer key is the provider name. The inner values are the metadata. Details depend on the provider.

### toJsonResponse:

(init?: ResponseInit) => Response

Converts the object to a JSON response. The response will have a status code of 200 and a content type of \`application/json; charset=utf-8\`.

## [More Examples](#more-examples)

[

Learn to generate structured data using a language model in Next.js

](../../../cookbook/rsc/generate-object.html)[

Learn to generate structured data using a language model in Node.js

](../../../cookbook/node/generate-object.html)

[Previous

streamText

](stream-text.html)

[Next

streamObject

](stream-object.html)

On this page

[generateObject()](#generateobject)

[Example: generate an object using a schema](#example-generate-an-object-using-a-schema)

[Example: generate an array using a schema](#example-generate-an-array-using-a-schema)

[Example: generate an enum](#example-generate-an-enum)

[Example: generate JSON without a schema](#example-generate-json-without-a-schema)

[Import](#import)

[API Signature](#api-signature)

[Parameters](#parameters)

[Returns](#returns)

[More Examples](#more-examples)

Deploy and Scale AI Apps with Vercel.

Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:

-   OpenAI
-   Photoroom
-   ![leonardo-ai Logo](../../../_next/logo-leonardo-ai-light.svg)![leonardo-ai Logo](../../../_next/logo-leonardo-ai-dark.svg)
-   ![zapier Logo](../../../_next/logo-zapier-light.svg)![zapier Logo](../../../_next/logo-zapier-dark.svg)

[](https://vercel.com/contact/sales?utm_source=ai_sdk&utm_medium=web&utm_campaign=contact_sales_cta&utm_content=talk_to_an_expert_sdk_docs)

#### Resources

[Docs](../../introduction.html)[Cookbook](../../../cookbook.html)[Providers](../../../providers/ai-sdk-providers.html)[Showcase](../../../showcase.html)[GitHub](https://github.com/vercel/ai)[Discussions](https://github.com/vercel/ai/discussions)

#### More

[Playground](../../../playground.html)[](https://v0.dev)[Contact Sales](https://vercel.com/contact/sales)

#### About Vercel

[Next.js + Vercel](https://vercel.com/frameworks/nextjs)[Open Source Software](https://vercel.com/oss)[GitHub](https://github.com/vercel)[X](https://x.com/vercel)

#### Legal

[Privacy Policy](https://vercel.com/legal/privacy-policy)

© 2025 Vercel, Inc.