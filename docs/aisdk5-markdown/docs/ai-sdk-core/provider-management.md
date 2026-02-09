AI SDK Core: Provider & Model Management

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

[Overview](overview.html)

[Generating Text](generating-text.html)

[Generating Structured Data](generating-structured-data.html)

[Tool Calling](tools-and-tool-calling.html)

[Model Context Protocol (MCP) Tools](mcp-tools.html)

[Prompt Engineering](prompt-engineering.html)

[Settings](settings.html)

[Embeddings](embeddings.html)

[Image Generation](image-generation.html)

[Transcription](transcription.html)

[Speech](speech.html)

[Language Model Middleware](middleware.html)

[Provider & Model Management](provider-management.html)

[Error Handling](error-handling.html)

[Testing](testing.html)

[Telemetry](telemetry.html)

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

[Troubleshooting](../troubleshooting.html)

[AI SDK Core](../ai-sdk-core.html)Provider & Model Management

# [Provider & Model Management](#provider--model-management)

When you work with multiple providers and models, it is often desirable to manage them in a central place and access the models through simple string ids.

The AI SDK offers [custom providers](../reference/ai-sdk-core/custom-provider.html) and a [provider registry](../reference/ai-sdk-core/provider-registry.html) for this purpose:

-   With **custom providers**, you can pre-configure model settings, provide model name aliases, and limit the available models.
-   The **provider registry** lets you mix multiple providers and access them through simple string ids.

You can mix and match custom providers, the provider registry, and [middleware](middleware.html) in your application.

## [Custom Providers](#custom-providers)

You can create a [custom provider](../reference/ai-sdk-core/custom-provider.html) using `customProvider`.

### [Example: custom model settings](#example-custom-model-settings)

You might want to override the default model settings for a provider or provide model name aliases with pre-configured settings.

```ts
import { openai as originalOpenAI } from '@ai-sdk/openai';
import {
  customProvider,
  defaultSettingsMiddleware,
  wrapLanguageModel,
} from 'ai';


// custom provider with different provider options:
export const openai = customProvider({
  languageModels: {
    // replacement model with custom provider options:
    'gpt-4o': wrapLanguageModel({
      model: originalOpenAI('gpt-4o'),
      middleware: defaultSettingsMiddleware({
        settings: {
          providerOptions: {
            openai: {
              reasoningEffort: 'high',
            },
          },
        },
      }),
    }),
    // alias model with custom provider options:
    'gpt-4o-mini-high-reasoning': wrapLanguageModel({
      model: originalOpenAI('gpt-4o-mini'),
      middleware: defaultSettingsMiddleware({
        settings: {
          providerOptions: {
            openai: {
              reasoningEffort: 'high',
            },
          },
        },
      }),
    }),
  },
  fallbackProvider: originalOpenAI,
});
```

### [Example: model name alias](#example-model-name-alias)

You can also provide model name aliases, so you can update the model version in one place in the future:

```ts
import { anthropic as originalAnthropic } from '@ai-sdk/anthropic';
import { customProvider } from 'ai';


// custom provider with alias names:
export const anthropic = customProvider({
  languageModels: {
    opus: originalAnthropic('claude-3-opus-20240229'),
    sonnet: originalAnthropic('claude-3-5-sonnet-20240620'),
    haiku: originalAnthropic('claude-3-haiku-20240307'),
  },
  fallbackProvider: originalAnthropic,
});
```

### [Example: limit available models](#example-limit-available-models)

You can limit the available models in the system, even if you have multiple providers.

```ts
import { anthropic } from '@ai-sdk/anthropic';
import { openai } from '@ai-sdk/openai';
import {
  customProvider,
  defaultSettingsMiddleware,
  wrapLanguageModel,
} from 'ai';


export const myProvider = customProvider({
  languageModels: {
    'text-medium': anthropic('claude-3-5-sonnet-20240620'),
    'text-small': openai('gpt-4o-mini'),
    'reasoning-medium': wrapLanguageModel({
      model: openai('gpt-4o'),
      middleware: defaultSettingsMiddleware({
        settings: {
          providerOptions: {
            openai: {
              reasoningEffort: 'high',
            },
          },
        },
      }),
    }),
    'reasoning-fast': wrapLanguageModel({
      model: openai('gpt-4o-mini'),
      middleware: defaultSettingsMiddleware({
        settings: {
          providerOptions: {
            openai: {
              reasoningEffort: 'high',
            },
          },
        },
      }),
    }),
  },
  embeddingModels: {
    embedding: openai.textEmbeddingModel('text-embedding-3-small'),
  },
  // no fallback provider
});
```

## [Provider Registry](#provider-registry)

You can create a [provider registry](../reference/ai-sdk-core/provider-registry.html) with multiple providers and models using `createProviderRegistry`.

### [Setup](#setup)

```ts
import { anthropic } from '@ai-sdk/anthropic';
import { createOpenAI } from '@ai-sdk/openai';
import { createProviderRegistry } from 'ai';


export const registry = createProviderRegistry({
  // register provider with prefix and default setup:
  anthropic,


  // register provider with prefix and custom setup:
  openai: createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  }),
});
```

### [Setup with Custom Separator](#setup-with-custom-separator)

By default, the registry uses `:` as the separator between provider and model IDs. You can customize this separator:

```ts
import { createProviderRegistry } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { openai } from '@ai-sdk/openai';


export const customSeparatorRegistry = createProviderRegistry(
  {
    anthropic,
    openai,
  },
  { separator: ' > ' },
);
```

### [Example: Use language models](#example-use-language-models)

You can access language models by using the `languageModel` method on the registry. The provider id will become the prefix of the model id: `providerId:modelId`.

```ts
import { generateText } from 'ai';
import { registry } from './registry';


const { text } = await generateText({
  model: registry.languageModel('openai:gpt-4.1'), // default separator
  // or with custom separator:
  // model: customSeparatorRegistry.languageModel('openai > gpt-4.1'),
  prompt: 'Invent a new holiday and describe its traditions.',
});
```

### [Example: Use text embedding models](#example-use-text-embedding-models)

You can access text embedding models by using the `textEmbeddingModel` method on the registry. The provider id will become the prefix of the model id: `providerId:modelId`.

```ts
import { embed } from 'ai';
import { registry } from './registry';


const { embedding } = await embed({
  model: registry.textEmbeddingModel('openai:text-embedding-3-small'),
  value: 'sunny day at the beach',
});
```

### [Example: Use image models](#example-use-image-models)

You can access image models by using the `imageModel` method on the registry. The provider id will become the prefix of the model id: `providerId:modelId`.

```ts
import { generateImage } from 'ai';
import { registry } from './registry';


const { image } = await generateImage({
  model: registry.imageModel('openai:dall-e-3'),
  prompt: 'A beautiful sunset over a calm ocean',
});
```

## [Combining Custom Providers, Provider Registry, and Middleware](#combining-custom-providers-provider-registry-and-middleware)

The central idea of provider management is to set up a file that contains all the providers and models you want to use. You may want to pre-configure model settings, provide model name aliases, limit the available models, and more.

Here is an example that implements the following concepts:

-   pass through a full provider with a namespace prefix (here: `xai > *`)
-   setup an OpenAI-compatible provider with custom api key and base URL (here: `custom > *`)
-   setup model name aliases (here: `anthropic > fast`, `anthropic > writing`, `anthropic > reasoning`)
-   pre-configure model settings (here: `anthropic > reasoning`)
-   validate the provider-specific options (here: `AnthropicProviderOptions`)
-   use a fallback provider (here: `anthropic > *`)
-   limit a provider to certain models without a fallback (here: `groq > gemma2-9b-it`, `groq > qwen-qwq-32b`)
-   define a custom separator for the provider registry (here: `>`)

```ts
import { anthropic, AnthropicProviderOptions } from '@ai-sdk/anthropic';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { xai } from '@ai-sdk/xai';
import { groq } from '@ai-sdk/groq';
import {
  createProviderRegistry,
  customProvider,
  defaultSettingsMiddleware,
  wrapLanguageModel,
} from 'ai';


export const registry = createProviderRegistry(
  {
    // pass through a full provider with a namespace prefix
    xai,


    // access an OpenAI-compatible provider with custom setup
    custom: createOpenAICompatible({
      name: 'provider-name',
      apiKey: process.env.CUSTOM_API_KEY,
      baseURL: 'https://api.custom.com/v1',
    }),


    // setup model name aliases
    anthropic: customProvider({
      languageModels: {
        fast: anthropic('claude-3-haiku-20240307'),


        // simple model
        writing: anthropic('claude-3-7-sonnet-20250219'),


        // extended reasoning model configuration:
        reasoning: wrapLanguageModel({
          model: anthropic('claude-3-7-sonnet-20250219'),
          middleware: defaultSettingsMiddleware({
            settings: {
              maxOutputTokens: 100000, // example default setting
              providerOptions: {
                anthropic: {
                  thinking: {
                    type: 'enabled',
                    budgetTokens: 32000,
                  },
                } satisfies AnthropicProviderOptions,
              },
            },
          }),
        }),
      },
      fallbackProvider: anthropic,
    }),


    // limit a provider to certain models without a fallback
    groq: customProvider({
      languageModels: {
        'gemma2-9b-it': groq('gemma2-9b-it'),
        'qwen-qwq-32b': groq('qwen-qwq-32b'),
      },
    }),
  },
  { separator: ' > ' },
);


// usage:
const model = registry.languageModel('anthropic > reasoning');
```

## [Global Provider Configuration](#global-provider-configuration)

The AI SDK 5 includes a global provider feature that allows you to specify a model using just a plain model ID string:

```ts
import { streamText } from 'ai';


const result = await streamText({
  model: 'openai/gpt-4o', // Uses the global provider (defaults to AI Gateway)
  prompt: 'Invent a new holiday and describe its traditions.',
});
```

By default, the global provider is set to the Vercel AI Gateway.

### [Customizing the Global Provider](#customizing-the-global-provider)

You can set your own preferred global provider:

```ts
import { openai } from '@ai-sdk/openai';


// Initialize once during startup:
globalThis.AI_SDK_DEFAULT_PROVIDER = openai;
```

```ts
import { streamText } from 'ai';


const result = await streamText({
  model: 'gpt-4o', // Uses OpenAI provider without prefix
  prompt: 'Invent a new holiday and describe its traditions.',
});
```

This simplifies provider usage and makes it easier to switch between providers without changing your model references throughout your codebase.

[Previous

Language Model Middleware

](middleware.html)

[Next

Error Handling

](error-handling.html)

On this page

[Provider & Model Management](#provider--model-management)

[Custom Providers](#custom-providers)

[Example: custom model settings](#example-custom-model-settings)

[Example: model name alias](#example-model-name-alias)

[Example: limit available models](#example-limit-available-models)

[Provider Registry](#provider-registry)

[Setup](#setup)

[Setup with Custom Separator](#setup-with-custom-separator)

[Example: Use language models](#example-use-language-models)

[Example: Use text embedding models](#example-use-text-embedding-models)

[Example: Use image models](#example-use-image-models)

[Combining Custom Providers, Provider Registry, and Middleware](#combining-custom-providers-provider-registry-and-middleware)

[Global Provider Configuration](#global-provider-configuration)

[Customizing the Global Provider](#customizing-the-global-provider)

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