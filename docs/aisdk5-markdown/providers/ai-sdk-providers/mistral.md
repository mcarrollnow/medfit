AI SDK Providers: Mistral AI

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

[AI SDK Providers](../ai-sdk-providers.html)Mistral AI

# [Mistral AI Provider](#mistral-ai-provider)

The [Mistral AI](https://mistral.ai/) provider contains language model support for the Mistral chat API.

## [Setup](#setup)

The Mistral provider is available in the `@ai-sdk/mistral` module. You can install it with

pnpm

npm

yarn

bun

pnpm add @ai-sdk/mistral

## [Provider Instance](#provider-instance)

You can import the default provider instance `mistral` from `@ai-sdk/mistral`:

```ts
import { mistral } from '@ai-sdk/mistral';
```

If you need a customized setup, you can import `createMistral` from `@ai-sdk/mistral` and create a provider instance with your settings:

```ts
import { createMistral } from '@ai-sdk/mistral';


const mistral = createMistral({
  // custom settings
});
```

You can use the following optional settings to customize the Mistral provider instance:

-   **baseURL** *string*
    
    Use a different URL prefix for API calls, e.g. to use proxy servers. The default prefix is `https://api.mistral.ai/v1`.
    
-   **apiKey** *string*
    
    API key that is being sent using the `Authorization` header. It defaults to the `MISTRAL_API_KEY` environment variable.
    
-   **headers** *Record<string,string>*
    
    Custom headers to include in the requests.
    
-   **fetch** *(input: RequestInfo, init?: RequestInit) => Promise<Response>*
    
    Custom [fetch](https://developer.mozilla.org/en-US/docs/Web/API/fetch) implementation. Defaults to the global `fetch` function. You can use it as a middleware to intercept requests, or to provide a custom fetch implementation for e.g. testing.
    

## [Language Models](#language-models)

You can create models that call the [Mistral chat API](https://docs.mistral.ai/api/#operation/createChatCompletion) using a provider instance. The first argument is the model id, e.g. `mistral-large-latest`. Some Mistral chat models support tool calls.

```ts
const model = mistral('mistral-large-latest');
```

Mistral chat models also support additional model settings that are not part of the [standard call settings](../../docs/ai-sdk-core/settings.html). You can pass them as an options argument and utilize `MistralLanguageModelOptions` for typing:

```ts
import { mistral, type MistralLanguageModelOptions } from '@ai-sdk/mistral';
const model = mistral('mistral-large-latest');


await generateText({
  model,
  providerOptions: {
    mistral: {
      safePrompt: true, // optional safety prompt injection
      parallelToolCalls: false, // disable parallel tool calls (one tool per response)
    } satisfies MistralLanguageModelOptions,
  },
});
```

The following optional provider options are available for Mistral models:

-   **safePrompt** *boolean*
    
    Whether to inject a safety prompt before all conversations.
    
    Defaults to `false`.
    
-   **documentImageLimit** *number*
    
    Maximum number of images to process in a document.
    
-   **documentPageLimit** *number*
    
    Maximum number of pages to process in a document.
    
-   **strictJsonSchema** *boolean*
    
    Whether to use strict JSON schema validation for structured outputs. Only applies when a schema is provided and only sets the [`strict` flag](https://docs.mistral.ai/api/#tag/chat/operation/chat_completion_v1_chat_completions_post) in addition to using [Custom Structured Outputs](https://docs.mistral.ai/capabilities/structured-output/custom_structured_output/), which is used by default if a schema is provided.
    
    Defaults to `false`.
    
-   **structuredOutputs** *boolean*
    
    Whether to use [structured outputs](#structured-outputs). When enabled, tool calls and object generation will be strict and follow the provided schema.
    
    Defaults to `true`.
    
-   **parallelToolCalls** *boolean*
    
    Whether to enable parallel function calling during tool use. When set to false, the model will use at most one tool per response.
    
    Defaults to `true`.
    

### [Document OCR](#document-ocr)

Mistral chat models support document OCR for PDF files. You can optionally set image and page limits using the provider options.

```ts
const result = await generateText({
  model: mistral('mistral-small-latest'),
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
          mediaType: 'application/pdf',
        },
      ],
    },
  ],
  // optional settings:
  providerOptions: {
    mistral: {
      documentImageLimit: 8,
      documentPageLimit: 64,
    },
  },
});
```

### [Reasoning Models](#reasoning-models)

Mistral offers reasoning models that provide step-by-step thinking capabilities:

-   **magistral-small-2506**: Smaller reasoning model for efficient step-by-step thinking
-   **magistral-medium-2506**: More powerful reasoning model balancing performance and cost

These models return content that includes `<think>...</think>` tags containing the reasoning process. To properly extract and separate the reasoning from the final answer, use the [extract reasoning middleware](../../docs/reference/ai-sdk-core/extract-reasoning-middleware.html):

```ts
import { mistral } from '@ai-sdk/mistral';
import {
  extractReasoningMiddleware,
  generateText,
  wrapLanguageModel,
} from 'ai';


const result = await generateText({
  model: wrapLanguageModel({
    model: mistral('magistral-small-2506'),
    middleware: extractReasoningMiddleware({
      tagName: 'think',
    }),
  }),
  prompt: 'What is 15 * 24?',
});


console.log('REASONING:', result.reasoningText);
// Output: "Let me calculate this step by step..."


console.log('ANSWER:', result.text);
// Output: "360"
```

The middleware automatically parses the `<think>` tags and provides separate `reasoningText` and `text` properties in the result.

### [Example](#example)

You can use Mistral language models to generate text with the `generateText` function:

```ts
import { mistral } from '@ai-sdk/mistral';
import { generateText } from 'ai';


const { text } = await generateText({
  model: mistral('mistral-large-latest'),
  prompt: 'Write a vegetarian lasagna recipe for 4 people.',
});
```

Mistral language models can also be used in the `streamText`, `generateObject`, and `streamObject` functions (see [AI SDK Core](../../docs/ai-sdk-core.html)).

#### [Structured Outputs](#structured-outputs)

Mistral chat models support structured outputs using JSON Schema. You can use `generateObject` or `streamObject` with Zod, Valibot, or raw JSON Schema. The SDK sends your schema via Mistral's `response_format: { type: 'json_schema' }`.

```ts
import { mistral } from '@ai-sdk/mistral';
import { generateObject } from 'ai';
import { z } from 'zod';


const result = await generateObject({
  model: mistral('mistral-large-latest'),
  schema: z.object({
    recipe: z.object({
      name: z.string(),
      ingredients: z.array(z.string()),
      instructions: z.array(z.string()),
    }),
  }),
  prompt: 'Generate a simple pasta recipe.',
});


console.log(JSON.stringify(result.object, null, 2));
```

You can enable strict JSON Schema validation using a provider option:

```ts
import { mistral } from '@ai-sdk/mistral';
import { generateObject } from 'ai';
import { z } from 'zod';


const result = await generateObject({
  model: mistral('mistral-large-latest'),
  providerOptions: {
    mistral: {
      strictJsonSchema: true, // reject outputs that don't strictly match the schema
    },
  },
  schema: z.object({
    title: z.string(),
    items: z.array(z.object({ id: z.string(), qty: z.number().int().min(1) })),
  }),
  prompt: 'Generate a small shopping list.',
});
```

When using structured outputs, the SDK no longer injects an extra "answer with JSON" instruction. It relies on Mistral's native `json_schema`/`json_object` response formats instead. You can customize the schema name/description via the standard structured-output APIs.

### [Model Capabilities](#model-capabilities)

| Model | Image Input | Object Generation | Tool Usage | Tool Streaming |
| --- | --- | --- | --- | --- |
| `pixtral-large-latest` |  |  |  |  |
| `mistral-large-latest` |  |  |  |  |
| `mistral-medium-latest` |  |  |  |  |
| `mistral-medium-2505` |  |  |  |  |
| `mistral-small-latest` |  |  |  |  |
| `magistral-small-2506` |  |  |  |  |
| `magistral-medium-2506` |  |  |  |  |
| `ministral-3b-latest` |  |  |  |  |
| `ministral-8b-latest` |  |  |  |  |
| `pixtral-12b-2409` |  |  |  |  |
| `open-mistral-7b` |  |  |  |  |
| `open-mixtral-8x7b` |  |  |  |  |
| `open-mixtral-8x22b` |  |  |  |  |

The table above lists popular models. Please see the [Mistral docs](https://docs.mistral.ai/getting-started/models/models_overview/) for a full list of available models. The table above lists popular models. You can also pass any available provider model ID as a string if needed.

## [Embedding Models](#embedding-models)

You can create models that call the [Mistral embeddings API](https://docs.mistral.ai/api/#operation/createEmbedding) using the `.textEmbedding()` factory method.

```ts
const model = mistral.textEmbedding('mistral-embed');
```

You can use Mistral embedding models to generate embeddings with the `embed` function:

```ts
import { mistral } from '@ai-sdk/mistral';
import { embed } from 'ai';


const { embedding } = await embed({
  model: mistral.textEmbedding('mistral-embed'),
  value: 'sunny day at the beach',
});
```

### [Model Capabilities](#model-capabilities-1)

| Model | Default Dimensions |
| --- | --- |
| `mistral-embed` | 1024 |

[Previous

Hugging Face

](huggingface.html)

[Next

Together.ai

](togetherai.html)

On this page

[Mistral AI Provider](#mistral-ai-provider)

[Setup](#setup)

[Provider Instance](#provider-instance)

[Language Models](#language-models)

[Document OCR](#document-ocr)

[Reasoning Models](#reasoning-models)

[Example](#example)

[Structured Outputs](#structured-outputs)

[Model Capabilities](#model-capabilities)

[Embedding Models](#embedding-models)

[Model Capabilities](#model-capabilities-1)

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