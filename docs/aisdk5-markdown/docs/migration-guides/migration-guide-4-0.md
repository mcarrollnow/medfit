Migration Guides: Migrate AI SDK 3.4 to 4.0

[](https://vercel.com/)

[

AI SDK



](../../index.html)

-   [Docs](../introduction.html)
-   [Cookbook](../../cookbook.html)
-   [Providers](../../providers/ai-sdk-providers.html)
-   [Playground](../../playground.html)
-   [
    
    AI ElementsAI Elements
    
    ](../../elements/overview.html)
-   [AI GatewayGateway](https://vercel.com/ai-gateway)

AI SDK 5 is available now.

[View Announcement](https://vercel.com/blog/ai-sdk-5)

Menu

[AI SDK by Vercel](../introduction.html)

[Foundations](../foundations.html)

[Overview](../foundations/overview.html)

[Providers and Models](../foundations/providers-and-models.html)

[Prompts](../foundations/prompts.html)

[Tools](../foundations/tools.html)

[Streaming](../foundations/streaming.html)

[Getting Started](../getting-started.html)

[Navigating the Library](../getting-started/navigating-the-library.html)

[Next.js App Router](../getting-started/nextjs-app-router.html)

[Next.js Pages Router](../getting-started/nextjs-pages-router.html)

[Svelte](../getting-started/svelte.html)

[Vue.js (Nuxt)](../getting-started/nuxt.html)

[Node.js](../getting-started/nodejs.html)

[Expo](../getting-started/expo.html)

[Agents](../agents.html)

[Agents](../agents/overview.html)

[Building Agents](../agents/building-agents.html)

[Workflow Patterns](../agents/workflows.html)

[Loop Control](../agents/loop-control.html)

[AI SDK Core](../ai-sdk-core.html)

[Overview](../ai-sdk-core/overview.html)

[Generating Text](../ai-sdk-core/generating-text.html)

[Generating Structured Data](../ai-sdk-core/generating-structured-data.html)

[Tool Calling](../ai-sdk-core/tools-and-tool-calling.html)

[Model Context Protocol (MCP) Tools](../ai-sdk-core/mcp-tools.html)

[Prompt Engineering](../ai-sdk-core/prompt-engineering.html)

[Settings](../ai-sdk-core/settings.html)

[Embeddings](../ai-sdk-core/embeddings.html)

[Image Generation](../ai-sdk-core/image-generation.html)

[Transcription](../ai-sdk-core/transcription.html)

[Speech](../ai-sdk-core/speech.html)

[Language Model Middleware](../ai-sdk-core/middleware.html)

[Provider & Model Management](../ai-sdk-core/provider-management.html)

[Error Handling](../ai-sdk-core/error-handling.html)

[Testing](../ai-sdk-core/testing.html)

[Telemetry](../ai-sdk-core/telemetry.html)

[AI SDK UI](../ai-sdk-ui.html)

[Overview](../ai-sdk-ui/overview.html)

[Chatbot](../ai-sdk-ui/chatbot.html)

[Chatbot Message Persistence](../ai-sdk-ui/chatbot-message-persistence.html)

[Chatbot Resume Streams](../ai-sdk-ui/chatbot-resume-streams.html)

[Chatbot Tool Usage](../ai-sdk-ui/chatbot-tool-usage.html)

[Generative User Interfaces](../ai-sdk-ui/generative-user-interfaces.html)

[Completion](../ai-sdk-ui/completion.html)

[Object Generation](../ai-sdk-ui/object-generation.html)

[Streaming Custom Data](../ai-sdk-ui/streaming-data.html)

[Error Handling](../ai-sdk-ui/error-handling.html)

[Transport](../ai-sdk-ui/transport.html)

[Reading UIMessage Streams](../ai-sdk-ui/reading-ui-message-streams.html)

[Message Metadata](../ai-sdk-ui/message-metadata.html)

[Stream Protocols](../ai-sdk-ui/stream-protocol.html)

[AI SDK RSC](../ai-sdk-rsc.html)

[Advanced](../advanced.html)

[Reference](../reference.html)

[AI SDK Core](../reference/ai-sdk-core.html)

[AI SDK UI](../reference/ai-sdk-ui.html)

[AI SDK RSC](../reference/ai-sdk-rsc.html)

[Stream Helpers](../reference/stream-helpers.html)

[AI SDK Errors](../reference/ai-sdk-errors.html)

[Migration Guides](../migration-guides.html)

[Versioning](versioning.html)

[Migrate Your Data to AI SDK 5.0](migration-guide-5-0-data.html)

[Migrate AI SDK 4.0 to 5.0](migration-guide-5-0.html)

[Migrate AI SDK 4.1 to 4.2](migration-guide-4-2.html)

[Migrate AI SDK 4.0 to 4.1](migration-guide-4-1.html)

[Migrate AI SDK 3.4 to 4.0](migration-guide-4-0.html)

[Migrate AI SDK 3.3 to 3.4](migration-guide-3-4.html)

[Migrate AI SDK 3.2 to 3.3](migration-guide-3-3.html)

[Migrate AI SDK 3.1 to 3.2](migration-guide-3-2.html)

[Migrate AI SDK 3.0 to 3.1](migration-guide-3-1.html)

[Troubleshooting](../troubleshooting.html)

[Migration Guides](../migration-guides.html)Migrate AI SDK 3.4 to 4.0

# [Migrate AI SDK 3.4 to 4.0](#migrate-ai-sdk-34-to-40)

Check out the [AI SDK 4.0 release blog post](https://vercel.com/blog/ai-sdk-4-0) for more information about the release.

## [Recommended Migration Process](#recommended-migration-process)

1.  Backup your project. If you use a versioning control system, make sure all previous versions are committed.
2.  [Migrate to AI SDK 3.4](migration-guide-3-4.html).
3.  Upgrade to AI SDK 4.0.
4.  Automatically migrate your code using [codemods](#codemods).
    
    > If you don't want to use codemods, we recommend resolving all deprecation warnings before upgrading to AI SDK 4.0.
    
5.  Follow the breaking changes guide below.
6.  Verify your project is working as expected.
7.  Commit your changes.

## [AI SDK 4.0 package versions](#ai-sdk-40-package-versions)

You need to update the following packages to the following versions in your `package.json` file(s):

-   `ai` package: `4.0.*`
-   `ai-sdk@provider-utils` package: `2.0.*`
-   `ai-sdk/*` packages: `1.0.*` (other `@ai-sdk` packages)

## [Codemods](#codemods)

The AI SDK provides Codemod transformations to help upgrade your codebase when a feature is deprecated, removed, or otherwise changed.

Codemods are transformations that run on your codebase programmatically. They allow you to easily apply many changes without having to manually go through every file.

Codemods are intended as a tool to help you with the upgrade process. They may not cover all of the changes you need to make. You may need to make additional changes manually.

You can run all codemods provided as part of the 4.0 upgrade process by running the following command from the root of your project:

```sh
npx @ai-sdk/codemod upgrade
```

To run only the v4 codemods:

```sh
npx @ai-sdk/codemod v4
```

Individual codemods can be run by specifying the name of the codemod:

```sh
npx @ai-sdk/codemod <codemod-name> <path>
```

For example, to run a specific v4 codemod:

```sh
npx @ai-sdk/codemod v4/replace-baseurl src/
```

See also the [table of codemods](#codemod-table). In addition, the latest set of codemods can be found in the [`@ai-sdk/codemod`](https://github.com/vercel/ai/tree/main/packages/codemod/src/codemods) repository.

## [Provider Changes](#provider-changes)

### [Removed `baseUrl` option](#removed-baseurl-option)

The `baseUrl` option has been removed from all providers. Please use the `baseURL` option instead.

```ts
const perplexity = createOpenAI({
  // ...
  baseUrl: 'https://api.perplexity.ai/',
});
```

```ts
const perplexity = createOpenAI({
  // ...
  baseURL: 'https://api.perplexity.ai/',
});
```

### [Anthropic Provider](#anthropic-provider)

#### [Removed `Anthropic` facade](#removed-anthropic-facade)

The `Anthropic` facade has been removed from the Anthropic provider. Please use the `anthropic` object or the `createAnthropic` function instead.

```ts
const anthropic = new Anthropic({
  // ...
});
```

```ts
const anthropic = createAnthropic({
  // ...
});
```

#### [Removed `topK` setting](#removed-topk-setting)

There is no codemod available for this change. Please review and update your code manually.

The model specific `topK` setting has been removed from the Anthropic provider. You can use the standard `topK` setting instead.

```ts
const result = await generateText({
  model: anthropic('claude-3-5-sonnet-latest', {
    topK: 0.5,
  }),
});
```

```ts
const result = await generateText({
  model: anthropic('claude-3-5-sonnet-latest'),
  topK: 0.5,
});
```

### [Google Generative AI Provider](#google-generative-ai-provider)

#### [Removed `Google` facade](#removed-google-facade)

The `Google` facade has been removed from the Google Generative AI provider. Please use the `google` object or the `createGoogleGenerativeAI` function instead.

```ts
const google = new Google({
  // ...
});
```

```ts
const google = createGoogleGenerativeAI({
  // ...
});
```

#### [Removed `topK` setting](#removed-topk-setting-1)

There is no codemod available for this change. Please review and update your code manually.

The model-specific `topK` setting has been removed from the Google Generative AI provider. You can use the standard `topK` setting instead.

```ts
const result = await generateText({
  model: google('gemini-1.5-flash', {
    topK: 0.5,
  }),
});
```

```ts
const result = await generateText({
  model: google('gemini-1.5-flash'),
  topK: 0.5,
});
```

### [Google Vertex Provider](#google-vertex-provider)

#### [Removed `topK` setting](#removed-topk-setting-2)

There is no codemod available for this change. Please review and update your code manually.

The model-specific `topK` setting has been removed from the Google Vertex provider. You can use the standard `topK` setting instead.

```ts
const result = await generateText({
  model: vertex('gemini-1.5-flash', {
    topK: 0.5,
  }),
});
```

```ts
const result = await generateText({
  model: vertex('gemini-1.5-flash'),
  topK: 0.5,
});
```

### [Mistral Provider](#mistral-provider)

#### [Removed `Mistral` facade](#removed-mistral-facade)

The `Mistral` facade has been removed from the Mistral provider. Please use the `mistral` object or the `createMistral` function instead.

```ts
const mistral = new Mistral({
  // ...
});
```

```ts
const mistral = createMistral({
  // ...
});
```

### [OpenAI Provider](#openai-provider)

#### [Removed `OpenAI` facade](#removed-openai-facade)

The `OpenAI` facade has been removed from the OpenAI provider. Please use the `openai` object or the `createOpenAI` function instead.

```ts
const openai = new OpenAI({
  // ...
});
```

```ts
const openai = createOpenAI({
  // ...
});
```

### [LangChain Adapter](#langchain-adapter)

#### [Removed `toAIStream`](#removed-toaistream)

The `toAIStream` function has been removed from the LangChain adapter. Please use the `toDataStream` function instead.

```ts
LangChainAdapter.toAIStream(stream);
```

```ts
LangChainAdapter.toDataStream(stream);
```

## [AI SDK Core Changes](#ai-sdk-core-changes)

### [`streamText` returns immediately](#streamtext-returns-immediately)

Instead of returning a Promise, the `streamText` function now returns immediately. It is not necessary to await the result of `streamText`.

```ts
const result = await streamText({
  // ...
});
```

```ts
const result = streamText({
  // ...
});
```

### [`streamObject` returns immediately](#streamobject-returns-immediately)

Instead of returning a Promise, the `streamObject` function now returns immediately. It is not necessary to await the result of `streamObject`.

```ts
const result = await streamObject({
  // ...
});
```

```ts
const result = streamObject({
  // ...
});
```

### [Remove roundtrips](#remove-roundtrips)

The `maxToolRoundtrips` and `maxAutomaticRoundtrips` options have been removed from the `generateText` and `streamText` functions. Please use the `maxSteps` option instead.

The `roundtrips` property has been removed from the `GenerateTextResult` type. Please use the `steps` property instead.

```ts
const { text, roundtrips } = await generateText({
  maxToolRoundtrips: 1, // or maxAutomaticRoundtrips
  // ...
});
```

```ts
const { text, steps } = await generateText({
  maxSteps: 2,
  // ...
});
```

### [Removed `nanoid` export](#removed-nanoid-export)

The `nanoid` export has been removed. Please use [`generateId`](../reference/ai-sdk-core/generate-id.html) instead.

```ts
import { nanoid } from 'ai';
```

```ts
import { generateId } from 'ai';
```

### [Increased default size of generated IDs](#increased-default-size-of-generated-ids)

There is no codemod available for this change. Please review and update your code manually.

The [`generateId`](../reference/ai-sdk-core/generate-id.html) function now generates 16-character IDs. The previous default was 7 characters.

This might e.g. require updating your database schema if you limit the length of IDs.

```ts
import { generateId } from 'ai';


const id = generateId(); // now 16 characters
```

### [Removed `ExperimentalMessage` types](#removed-experimentalmessage-types)

The following types have been removed:

-   `ExperimentalMessage` (use `ModelMessage` instead)
-   `ExperimentalUserMessage` (use `CoreUserMessage` instead)
-   `ExperimentalAssistantMessage` (use `CoreAssistantMessage` instead)
-   `ExperimentalToolMessage` (use `CoreToolMessage` instead)

```ts
import {
  ExperimentalMessage,
  ExperimentalUserMessage,
  ExperimentalAssistantMessage,
  ExperimentalToolMessage,
} from 'ai';
```

```ts
import {
  ModelMessage,
  CoreUserMessage,
  CoreAssistantMessage,
  CoreToolMessage,
} from 'ai';
```

### [Removed `ExperimentalTool` type](#removed-experimentaltool-type)

The `ExperimentalTool` type has been removed. Please use the `CoreTool` type instead.

```ts
import { ExperimentalTool } from 'ai';
```

```ts
import { CoreTool } from 'ai';
```

### [Removed experimental AI function exports](#removed-experimental-ai-function-exports)

The following exports have been removed:

-   `experimental_generateText` (use `generateText` instead)
-   `experimental_streamText` (use `streamText` instead)
-   `experimental_generateObject` (use `generateObject` instead)
-   `experimental_streamObject` (use `streamObject` instead)

```ts
import {
  experimental_generateText,
  experimental_streamText,
  experimental_generateObject,
  experimental_streamObject,
} from 'ai';
```

```ts
import { generateText, streamText, generateObject, streamObject } from 'ai';
```

### [Removed AI-stream related methods from `streamText`](#removed-ai-stream-related-methods-from-streamtext)

The following methods have been removed from the `streamText` result:

-   `toAIStream`
-   `pipeAIStreamToResponse`
-   `toAIStreamResponse`

Use the `toDataStream`, `pipeDataStreamToResponse`, and `toDataStreamResponse` functions instead.

```ts
const result = await streamText({
  // ...
});


result.toAIStream();
result.pipeAIStreamToResponse(response);
result.toAIStreamResponse();
```

```ts
const result = streamText({
  // ...
});


result.toDataStream();
result.pipeDataStreamToResponse(response);
result.toUIMessageStreamResponse();
```

### [Renamed "formatStreamPart" to "formatDataStreamPart"](#renamed-formatstreampart-to-formatdatastreampart)

The `formatStreamPart` function has been renamed to `formatDataStreamPart`.

```ts
formatStreamPart('text', 'Hello, world!');
```

```ts
formatDataStreamPart('text', 'Hello, world!');
```

### [Renamed "parseStreamPart" to "parseDataStreamPart"](#renamed-parsestreampart-to-parsedatastreampart)

The `parseStreamPart` function has been renamed to `parseDataStreamPart`.

```ts
const part = parseStreamPart(line);
```

```ts
const part = parseDataStreamPart(line);
```

### [Renamed `TokenUsage`, `CompletionTokenUsage` and `EmbeddingTokenUsage` types](#renamed-tokenusage-completiontokenusage-and-embeddingtokenusage-types)

The `TokenUsage`, `CompletionTokenUsage` and `EmbeddingTokenUsage` types have been renamed to `LanguageModelUsage` (for the first two) and `EmbeddingModelUsage` (for the last).

```ts
import { TokenUsage, CompletionTokenUsage, EmbeddingTokenUsage } from 'ai';
```

```ts
import { LanguageModelUsage, EmbeddingModelUsage } from 'ai';
```

### [Removed deprecated telemetry data](#removed-deprecated-telemetry-data)

There is no codemod available for this change. Please review and update your code manually.

The following telemetry data values have been removed:

-   `ai.finishReason` (now in `ai.response.finishReason`)
-   `ai.result.object` (now in `ai.response.object`)
-   `ai.result.text` (now in `ai.response.text`)
-   `ai.result.toolCalls` (now in `ai.response.toolCalls`)
-   `ai.stream.msToFirstChunk` (now in `ai.response.msToFirstChunk`)

This change will apply to observability providers and any scripts or automation that you use for processing telemetry data.

### [Provider Registry](#provider-registry)

#### [Removed experimental\_Provider, experimental\_ProviderRegistry, and experimental\_ModelRegistry](#removed-experimental_provider-experimental_providerregistry-and-experimental_modelregistry)

The `experimental_Provider` interface, `experimental_ProviderRegistry` interface, and `experimental_ModelRegistry` interface have been removed. Please use the `Provider` interface instead.

```ts
import { experimental_Provider, experimental_ProviderRegistry } from 'ai';
```

```ts
import { Provider } from 'ai';
```

The model registry is not available any more. Please [register providers](../reference/ai-sdk-core/provider-registry.html#setup) instead.

#### [Removed `experimental_​createModelRegistry` function](#removed-experimental_createmodelregistry-function)

The `experimental_createModelRegistry` function has been removed. Please use the `experimental_createProviderRegistry` function instead.

```ts
import { experimental_createModelRegistry } from 'ai';
```

```ts
import { experimental_createProviderRegistry } from 'ai';
```

The model registry is not available any more. Please [register providers](../reference/ai-sdk-core/provider-registry.html#setup) instead.

### [Removed `rawResponse` from results](#removed-rawresponse-from-results)

There is no codemod available for this change. Please review and update your code manually.

The `rawResponse` property has been removed from the `generateText`, `streamText`, `generateObject`, and `streamObject` results. You can use the `response` property instead.

```ts
const { text, rawResponse } = await generateText({
  // ...
});
```

```ts
const { text, response } = await generateText({
  // ...
});
```

### [Removed `init` option from `pipeDataStreamToResponse` and `toDataStreamResponse`](#removed-init-option-from-pipedatastreamtoresponse-and-todatastreamresponse)

There is no codemod available for this change. Please review and update your code manually.

The `init` option has been removed from the `pipeDataStreamToResponse` and `toDataStreamResponse` functions. You can set the values from `init` directly into the `options` object.

```ts
const result = await streamText({
  // ...
});


result.toUIMessageStreamResponse(response, {
  init: {
    headers: {
      'X-Custom-Header': 'value',
    },
  },
  // ...
});
```

```ts
const result = streamText({
  // ...
});


result.toUIMessageStreamResponse(response, {
  headers: {
    'X-Custom-Header': 'value',
  },
  // ...
});
```

### [Removed `responseMessages` from `generateText` and `streamText`](#removed-responsemessages-from-generatetext-and-streamtext)

There is no codemod available for this change. Please review and update your code manually.

The `responseMessages` property has been removed from the `generateText` and `streamText` results. This includes the `onFinish` callback. Please use the `response.messages` property instead.

```ts
const { text, responseMessages } = await generateText({
  // ...
});
```

```ts
const { text, response } = await generateText({
  // ...
});


const responseMessages = response.messages;
```

### [Removed `experimental_​continuationSteps` option](#removed-experimental_continuationsteps-option)

The `experimental_continuationSteps` option has been removed from the `generateText` function. Please use the `experimental_continueSteps` option instead.

```ts
const result = await generateText({
  experimental_continuationSteps: true,
  // ...
});
```

```ts
const result = await generateText({
  experimental_continueSteps: true,
  // ...
});
```

### [Removed `LanguageModelResponseMetadataWithHeaders` type](#removed-languagemodelresponsemetadatawithheaders-type)

The `LanguageModelResponseMetadataWithHeaders` type has been removed. Please use the `LanguageModelResponseMetadata` type instead.

```ts
import { LanguageModelResponseMetadataWithHeaders } from 'ai';
```

```ts
import { LanguageModelResponseMetadata } from 'ai';
```

#### [Changed `streamText` warnings result to Promise](#changed-streamtext-warnings-result-to-promise)

There is no codemod available for this change. Please review and update your code manually.

The `warnings` property of the `StreamTextResult` type is now a Promise.

```ts
const result = await streamText({
  // ...
});


const warnings = result.warnings;
```

```ts
const result = streamText({
  // ...
});


const warnings = await result.warnings;
```

#### [Changed `streamObject` warnings result to Promise](#changed-streamobject-warnings-result-to-promise)

There is no codemod available for this change. Please review and update your code manually.

The `warnings` property of the `StreamObjectResult` type is now a Promise.

```ts
const result = await streamObject({
  // ...
});


const warnings = result.warnings;
```

```ts
const result = streamObject({
  // ...
});


const warnings = await result.warnings;
```

#### [Renamed `simulateReadableStream` `values` to `chunks`](#renamed-simulatereadablestream-values-to-chunks)

There is no codemod available for this change. Please review and update your code manually.

The `simulateReadableStream` function from `ai/test` has been renamed to `chunks`.

```ts
import { simulateReadableStream } from 'ai/test';


const stream = simulateReadableStream({
  values: [1, 2, 3],
  chunkDelayInMs: 100,
});
```

```ts
import { simulateReadableStream } from 'ai/test';


const stream = simulateReadableStream({
  chunks: [1, 2, 3],
  chunkDelayInMs: 100,
});
```

## [AI SDK RSC Changes](#ai-sdk-rsc-changes)

There are no codemods available for the changes in this section. Please review and update your code manually.

### [Removed `render` function](#removed-render-function)

The AI SDK RSC 3.0 `render` function has been removed. Please use the `streamUI` function instead or [switch to AI SDK UI](../ai-sdk-rsc/migrating-to-ui.html).

```ts
import { render } from '@ai-sdk/rsc';
```

```ts
import { streamUI } from '@ai-sdk/rsc';
```

## [AI SDK UI Changes](#ai-sdk-ui-changes)

### [Removed Svelte, Vue, and SolidJS exports](#removed-svelte-vue-and-solidjs-exports)

This codemod only operates on `.ts` and `.tsx` files. If you have code in files with other suffixes, please review and update your code manually.

The `ai` package no longer exports Svelte, Vue, and SolidJS UI integrations. You need to install the `@ai-sdk/svelte`, `@ai-sdk/vue`, and `@ai-sdk/solid` packages directly.

```ts
import { useChat } from 'ai/svelte';
```

```ts
import { useChat } from '@ai-sdk/svelte';
```

### [Removed `experimental_StreamData`](#removed-experimental_streamdata)

The `experimental_StreamData` export has been removed. Please use the `StreamData` export instead.

```ts
import { experimental_StreamData } from 'ai';
```

```ts
import { StreamData } from 'ai';
```

### [`useChat` hook](#usechat-hook)

There are no codemods available for the changes in this section. Please review and update your code manually.

#### [Removed `streamMode` setting](#removed-streammode-setting)

The `streamMode` options has been removed from the `useChat` hook. Please use the `streamProtocol` parameter instead.

```ts
const { messages } = useChat({
  streamMode: 'text',
  // ...
});
```

```ts
const { messages } = useChat({
  streamProtocol: 'text',
  // ...
});
```

#### [Replaced roundtrip setting with `maxSteps`](#replaced-roundtrip-setting-with-maxsteps)

The following options have been removed from the `useChat` hook:

-   `experimental_maxAutomaticRoundtrips`
-   `maxAutomaticRoundtrips`
-   `maxToolRoundtrips`

Please use the [`maxSteps`](../ai-sdk-core/tools-and-tool-calling.html#multi-step-calls) option instead. The value of `maxSteps` is equal to roundtrips + 1.

```ts
const { messages } = useChat({
  experimental_maxAutomaticRoundtrips: 2,
  // or maxAutomaticRoundtrips
  // or maxToolRoundtrips
  // ...
});
```

```ts
const { messages } = useChat({
  maxSteps: 3, // 2 roundtrips + 1
  // ...
});
```

#### [Removed `options` setting](#removed-options-setting)

The `options` parameter in the `useChat` hook has been removed. Please use the `headers` and `body` parameters instead.

```ts
const { messages } = useChat({
  options: {
    headers: {
      'X-Custom-Header': 'value',
    },
  },
  // ...
});
```

```ts
const { messages } = useChat({
  headers: {
    'X-Custom-Header': 'value',
  },
  // ...
});
```

#### [Removed `experimental_addToolResult` method](#removed-experimental_addtoolresult-method)

The `experimental_addToolResult` method has been removed from the `useChat` hook. Please use the `addToolResult` method instead.

```ts
const { messages, experimental_addToolResult } = useChat({
  // ...
});
```

```ts
const { messages, addToolResult } = useChat({
  // ...
});
```

#### [Changed default value of `keepLastMessageOnError` to true and deprecated the option](#changed-default-value-of-keeplastmessageonerror-to-true-and-deprecated-the-option)

The `keepLastMessageOnError` option has been changed to default to `true`. The option will be removed in the next major release.

```ts
const { messages } = useChat({
  keepLastMessageOnError: true,
  // ...
});
```

```ts
const { messages } = useChat({
  // ...
});
```

### [`useCompletion` hook](#usecompletion-hook)

There are no codemods available for the changes in this section. Please review and update your code manually.

#### [Removed `streamMode` setting](#removed-streammode-setting-1)

The `streamMode` options has been removed from the `useCompletion` hook. Please use the `streamProtocol` parameter instead.

```ts
const { text } = useCompletion({
  streamMode: 'text',
  // ...
});
```

```ts
const { text } = useCompletion({
  streamProtocol: 'text',
  // ...
});
```

### [`useAssistant` hook](#useassistant-hook)

#### [Removed `experimental_useAssistant` export](#removed-experimental_useassistant-export)

The `experimental_useAssistant` export has been removed from the `useAssistant` hook. Please use the `useAssistant` hook directly instead.

```ts
import { experimental_useAssistant } from '@ai-sdk/react';
```

```ts
import { useAssistant } from '@ai-sdk/react';
```

#### [Removed `threadId` and `messageId` from `AssistantResponse`](#removed-threadid-and-messageid-from-assistantresponse)

There is no codemod available for this change. Please review and update your code manually.

The `threadId` and `messageId` parameters have been removed from the `AssistantResponse` function. Please use the `threadId` and `messageId` variables from the outer scope instead.

```ts
return AssistantResponse(
  { threadId: myThreadId, messageId: myMessageId },
  async ({ forwardStream, sendDataMessage, threadId, messageId }) => {
    // use threadId and messageId here
  },
);
```

```ts
return AssistantResponse(
  { threadId: myThreadId, messageId: myMessageId },
  async ({ forwardStream, sendDataMessage }) => {
    // use myThreadId and myMessageId here
  },
);
```

#### [Removed `experimental_​AssistantResponse` export](#removed-experimental_assistantresponse-export)

There is no codemod available for this change. Please review and update your code manually.

The `experimental_AssistantResponse` export has been removed. Please use the `AssistantResponse` function directly instead.

```ts
import { experimental_AssistantResponse } from 'ai';
```

```ts
import { AssistantResponse } from 'ai';
```

### [`experimental_useObject` hook](#experimental_useobject-hook)

There are no codemods available for the changes in this section. Please review and update your code manually.

The `setInput` helper has been removed from the `experimental_useObject` hook. Please use the `submit` helper instead.

```ts
const { object, setInput } = useObject({
  // ...
});
```

```ts
const { object, submit } = useObject({
  // ...
});
```

## [AI SDK Errors](#ai-sdk-errors)

### [Removed `isXXXError` static methods](#removed-isxxxerror-static-methods)

The `isXXXError` static methods have been removed from AI SDK errors. Please use the `isInstance` method of the corresponding error class instead.

```ts
import { APICallError } from 'ai';


APICallError.isAPICallError(error);
```

```ts
import { APICallError } from 'ai';


APICallError.isInstance(error);
```

### [Removed `toJSON` method](#removed-tojson-method)

There is no codemod available for this change. Please review and update your code manually.

The `toJSON` method has been removed from AI SDK errors.

## [AI SDK 2.x Legacy Changes](#ai-sdk-2x-legacy-changes)

There are no codemods available for the changes in this section. Please review and update your code manually.

### [Removed 2.x legacy providers](#removed-2x-legacy-providers)

Legacy providers from AI SDK 2.x have been removed. Please use the new [AI SDK provider architecture](../foundations/providers-and-models.html) instead.

#### [Removed 2.x legacy function and tool calling](#removed-2x-legacy-function-and-tool-calling)

The legacy `function_call` and `tools` options have been removed from `useChat` and `Message`. The `name` property from the `Message` type has been removed. Please use the [AI SDK Core tool calling](../ai-sdk-core/tools-and-tool-calling.html) instead.

### [Removed 2.x prompt helpers](#removed-2x-prompt-helpers)

Prompt helpers for constructing message prompts are no longer needed with the AI SDK provider architecture and have been removed.

### [Removed 2.x `AIStream`](#removed-2x-aistream)

The `AIStream` function and related exports have been removed. Please use the [`streamText`](../reference/ai-sdk-core/stream-text.html) function and its `toDataStream()` method instead.

### [Removed 2.x `StreamingTextResponse`](#removed-2x-streamingtextresponse)

The `StreamingTextResponse` function has been removed. Please use the [`streamText`](../reference/ai-sdk-core/stream-text.html) function and its `toDataStreamResponse()` method instead.

### [Removed 2.x `streamToResponse`](#removed-2x-streamtoresponse)

The `streamToResponse` function has been removed. Please use the [`streamText`](../reference/ai-sdk-core/stream-text.html) function and its `pipeDataStreamToResponse()` method instead.

### [Removed 2.x RSC `Tokens` streaming](#removed-2x-rsc-tokens-streaming)

The legacy `Tokens` RSC streaming from 2.x has been removed. `Tokens` were implemented prior to AI SDK RSC and are no longer needed.

## [Codemod Table](#codemod-table)

The following table lists codemod availability for the AI SDK 4.0 upgrade process. Note the codemod `upgrade` command will run all of them for you. This list is provided to give visibility into which migrations have some automation. It can also be helpful to find the codemod names if you'd like to run a subset of codemods. For more, see the [Codemods](#codemods) section.

| Change | Codemod |
| --- | --- |
| **Provider Changes** |  |
| Removed baseUrl option | `v4/replace-baseurl` |
| **Anthropic Provider** |  |
| Removed Anthropic facade | `v4/remove-anthropic-facade` |
| Removed topK setting | *N/A* |
| **Google Generative AI Provider** |  |
| Removed Google facade | `v4/remove-google-facade` |
| Removed topK setting | *N/A* |
| **Google Vertex Provider** |  |
| Removed topK setting | *N/A* |
| **Mistral Provider** |  |
| Removed Mistral facade | `v4/remove-mistral-facade` |
| **OpenAI Provider** |  |
| Removed OpenAI facade | `v4/remove-openai-facade` |
| **LangChain Adapter** |  |
| Removed toAIStream | `v4/replace-langchain-toaistream` |
| **AI SDK Core Changes** |  |
| streamText returns immediately | `v4/remove-await-streamtext` |
| streamObject returns immediately | `v4/remove-await-streamobject` |
| Remove roundtrips | `v4/replace-roundtrips-with-maxsteps` |
| Removed nanoid export | `v4/replace-nanoid` |
| Increased default size of generated IDs | *N/A* |
| Removed ExperimentalMessage types | `v4/remove-experimental-message-types` |
| Removed ExperimentalTool type | `v4/remove-experimental-tool` |
| Removed experimental AI function exports | `v4/remove-experimental-ai-fn-exports` |
| Removed AI-stream related methods from streamText | `v4/remove-ai-stream-methods-from-stream-text-result` |
| Renamed "formatStreamPart" to "formatDataStreamPart" | `v4/rename-format-stream-part` |
| Renamed "parseStreamPart" to "parseDataStreamPart" | `v4/rename-parse-stream-part` |
| Renamed TokenUsage, CompletionTokenUsage and EmbeddingTokenUsage types | `v4/replace-token-usage-types` |
| Removed deprecated telemetry data | *N/A* |
| **Provider Registry** |  |
| → Removed experimental\_Provider, experimental\_ProviderRegistry, and experimental\_ModelRegistry | `v4/remove-deprecated-provider-registry-exports` |
| → Removed experimental\_createModelRegistry function | *N/A* |
| Removed rawResponse from results | *N/A* |
| Removed init option from pipeDataStreamToResponse and toDataStreamResponse | *N/A* |
| Removed responseMessages from generateText and streamText | *N/A* |
| Removed experimental\_continuationSteps option | `v4/replace-continuation-steps` |
| Removed LanguageModelResponseMetadataWithHeaders type | `v4/remove-metadata-with-headers` |
| Changed streamText warnings result to Promise | *N/A* |
| Changed streamObject warnings result to Promise | *N/A* |
| Renamed simulateReadableStream values to chunks | *N/A* |
| **AI SDK RSC Changes** |  |
| Removed render function | *N/A* |
| **AI SDK UI Changes** |  |
| Removed Svelte, Vue, and SolidJS exports | `v4/rewrite-framework-imports` |
| Removed experimental\_StreamData | `v4/remove-experimental-streamdata` |
| **useChat hook** |  |
| Removed streamMode setting | *N/A* |
| Replaced roundtrip setting with maxSteps | `v4/replace-roundtrips-with-maxsteps` |
| Removed options setting | *N/A* |
| Removed experimental\_addToolResult method | *N/A* |
| Changed default value of keepLastMessageOnError to true and deprecated the option | *N/A* |
| **useCompletion hook** |  |
| Removed streamMode setting | *N/A* |
| **useAssistant hook** |  |
| Removed experimental\_useAssistant export | `v4/remove-experimental-useassistant` |
| Removed threadId and messageId from AssistantResponse | *N/A* |
| Removed experimental\_AssistantResponse export | *N/A* |
| **experimental\_useObject hook** |  |
| Removed setInput helper | *N/A* |
| **AI SDK Errors** |  |
| Removed isXXXError static methods | `v4/remove-isxxxerror` |
| Removed toJSON method | *N/A* |
| **AI SDK 2.x Legacy Changes** |  |
| Removed 2.x legacy providers | *N/A* |
| Removed 2.x legacy function and tool calling | *N/A* |
| Removed 2.x prompt helpers | *N/A* |
| Removed 2.x AIStream | *N/A* |
| Removed 2.x StreamingTextResponse | *N/A* |
| Removed 2.x streamToResponse | *N/A* |
| Removed 2.x RSC Tokens streaming | *N/A* |

[Previous

Migrate AI SDK 4.0 to 4.1

](migration-guide-4-1.html)

[Next

Migrate AI SDK 3.3 to 3.4

](migration-guide-3-4.html)

On this page

[Migrate AI SDK 3.4 to 4.0](#migrate-ai-sdk-34-to-40)

[Recommended Migration Process](#recommended-migration-process)

[AI SDK 4.0 package versions](#ai-sdk-40-package-versions)

[Codemods](#codemods)

[Provider Changes](#provider-changes)

[Removed baseUrl option](#removed-baseurl-option)

[Anthropic Provider](#anthropic-provider)

[Removed Anthropic facade](#removed-anthropic-facade)

[Removed topK setting](#removed-topk-setting)

[Google Generative AI Provider](#google-generative-ai-provider)

[Removed Google facade](#removed-google-facade)

[Removed topK setting](#removed-topk-setting-1)

[Google Vertex Provider](#google-vertex-provider)

[Removed topK setting](#removed-topk-setting-2)

[Mistral Provider](#mistral-provider)

[Removed Mistral facade](#removed-mistral-facade)

[OpenAI Provider](#openai-provider)

[Removed OpenAI facade](#removed-openai-facade)

[LangChain Adapter](#langchain-adapter)

[Removed toAIStream](#removed-toaistream)

[AI SDK Core Changes](#ai-sdk-core-changes)

[streamText returns immediately](#streamtext-returns-immediately)

[streamObject returns immediately](#streamobject-returns-immediately)

[Remove roundtrips](#remove-roundtrips)

[Removed nanoid export](#removed-nanoid-export)

[Increased default size of generated IDs](#increased-default-size-of-generated-ids)

[Removed ExperimentalMessage types](#removed-experimentalmessage-types)

[Removed ExperimentalTool type](#removed-experimentaltool-type)

[Removed experimental AI function exports](#removed-experimental-ai-function-exports)

[Removed AI-stream related methods from streamText](#removed-ai-stream-related-methods-from-streamtext)

[Renamed "formatStreamPart" to "formatDataStreamPart"](#renamed-formatstreampart-to-formatdatastreampart)

[Renamed "parseStreamPart" to "parseDataStreamPart"](#renamed-parsestreampart-to-parsedatastreampart)

[Renamed TokenUsage, CompletionTokenUsage and EmbeddingTokenUsage types](#renamed-tokenusage-completiontokenusage-and-embeddingtokenusage-types)

[Removed deprecated telemetry data](#removed-deprecated-telemetry-data)

[Provider Registry](#provider-registry)

[Removed experimental\_Provider, experimental\_ProviderRegistry, and experimental\_ModelRegistry](#removed-experimental_provider-experimental_providerregistry-and-experimental_modelregistry)

[Removed experimental\_​createModelRegistry function](#removed-experimental_createmodelregistry-function)

[Removed rawResponse from results](#removed-rawresponse-from-results)

[Removed init option from pipeDataStreamToResponse and toDataStreamResponse](#removed-init-option-from-pipedatastreamtoresponse-and-todatastreamresponse)

[Removed responseMessages from generateText and streamText](#removed-responsemessages-from-generatetext-and-streamtext)

[Removed experimental\_​continuationSteps option](#removed-experimental_continuationsteps-option)

[Removed LanguageModelResponseMetadataWithHeaders type](#removed-languagemodelresponsemetadatawithheaders-type)

[Changed streamText warnings result to Promise](#changed-streamtext-warnings-result-to-promise)

[Changed streamObject warnings result to Promise](#changed-streamobject-warnings-result-to-promise)

[Renamed simulateReadableStream values to chunks](#renamed-simulatereadablestream-values-to-chunks)

[AI SDK RSC Changes](#ai-sdk-rsc-changes)

[Removed render function](#removed-render-function)

[AI SDK UI Changes](#ai-sdk-ui-changes)

[Removed Svelte, Vue, and SolidJS exports](#removed-svelte-vue-and-solidjs-exports)

[Removed experimental\_StreamData](#removed-experimental_streamdata)

[useChat hook](#usechat-hook)

[Removed streamMode setting](#removed-streammode-setting)

[Replaced roundtrip setting with maxSteps](#replaced-roundtrip-setting-with-maxsteps)

[Removed options setting](#removed-options-setting)

[Removed experimental\_addToolResult method](#removed-experimental_addtoolresult-method)

[Changed default value of keepLastMessageOnError to true and deprecated the option](#changed-default-value-of-keeplastmessageonerror-to-true-and-deprecated-the-option)

[useCompletion hook](#usecompletion-hook)

[Removed streamMode setting](#removed-streammode-setting-1)

[useAssistant hook](#useassistant-hook)

[Removed experimental\_useAssistant export](#removed-experimental_useassistant-export)

[Removed threadId and messageId from AssistantResponse](#removed-threadid-and-messageid-from-assistantresponse)

[Removed experimental\_​AssistantResponse export](#removed-experimental_assistantresponse-export)

[experimental\_useObject hook](#experimental_useobject-hook)

[AI SDK Errors](#ai-sdk-errors)

[Removed isXXXError static methods](#removed-isxxxerror-static-methods)

[Removed toJSON method](#removed-tojson-method)

[AI SDK 2.x Legacy Changes](#ai-sdk-2x-legacy-changes)

[Removed 2.x legacy providers](#removed-2x-legacy-providers)

[Removed 2.x legacy function and tool calling](#removed-2x-legacy-function-and-tool-calling)

[Removed 2.x prompt helpers](#removed-2x-prompt-helpers)

[Removed 2.x AIStream](#removed-2x-aistream)

[Removed 2.x StreamingTextResponse](#removed-2x-streamingtextresponse)

[Removed 2.x streamToResponse](#removed-2x-streamtoresponse)

[Removed 2.x RSC Tokens streaming](#removed-2x-rsc-tokens-streaming)

[Codemod Table](#codemod-table)

Deploy and Scale AI Apps with Vercel.

Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:

-   OpenAI
-   Photoroom
-   ![leonardo-ai Logo](../../_next/logo-leonardo-ai-light.svg)![leonardo-ai Logo](../../_next/logo-leonardo-ai-dark.svg)
-   ![zapier Logo](../../_next/logo-zapier-light.svg)![zapier Logo](../../_next/logo-zapier-dark.svg)

[](https://vercel.com/contact/sales?utm_source=ai_sdk&utm_medium=web&utm_campaign=contact_sales_cta&utm_content=talk_to_an_expert_sdk_docs)

#### Resources

[Docs](../introduction.html)[Cookbook](../../cookbook.html)[Providers](../../providers/ai-sdk-providers.html)[Showcase](../../showcase.html)[GitHub](https://github.com/vercel/ai)[Discussions](https://github.com/vercel/ai/discussions)

#### More

[Playground](../../playground.html)[](https://v0.dev)[Contact Sales](https://vercel.com/contact/sales)

#### About Vercel

[Next.js + Vercel](https://vercel.com/frameworks/nextjs)[Open Source Software](https://vercel.com/oss)[GitHub](https://github.com/vercel)[X](https://x.com/vercel)

#### Legal

[Privacy Policy](https://vercel.com/legal/privacy-policy)

© 2025 Vercel, Inc.