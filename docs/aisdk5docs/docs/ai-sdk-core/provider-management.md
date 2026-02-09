AI SDK 5 is available now.










Menu






















































































































































































































































































































































# [Provider & Model Management](#provider--model-management)

When you work with multiple providers and models, it is often desirable to manage them in a central place and access the models through simple string ids.

The AI SDK offers [custom providers](../reference/ai-sdk-core/custom-provider.html) and a [provider registry](../reference/ai-sdk-core/provider-registry.html) for this purpose:

- With **custom providers**, you can pre-configure model settings, provide model name aliases, and limit the available models.
- The **provider registry** lets you mix multiple providers and access them through simple string ids.

You can mix and match custom providers, the provider registry, and [middleware](middleware.html) in your application.

## [Custom Providers](#custom-providers)

You can create a [custom provider](../reference/ai-sdk-core/custom-provider.html) using `customProvider`.

### [Example: custom model settings](#example-custom-model-settings)

You might want to override the default model settings for a provider or provide model name aliases with pre-configured settings.



``` ts
import  from '@ai-sdk/openai';import  from 'ai';
// custom provider with different provider options:export const openai = customProvider(,          },        },      }),    }),    // alias model with custom provider options:    'gpt-4o-mini-high-reasoning': wrapLanguageModel(,          },        },      }),    }),  },  fallbackProvider: originalOpenAI,});
```


### [Example: model name alias](#example-model-name-alias)

You can also provide model name aliases, so you can update the model version in one place in the future:



``` ts
import  from '@ai-sdk/anthropic';import  from 'ai';
// custom provider with alias names:export const anthropic = customProvider(,  fallbackProvider: originalAnthropic,});
```


### [Example: limit available models](#example-limit-available-models)

You can limit the available models in the system, even if you have multiple providers.



``` ts
import  from '@ai-sdk/anthropic';import  from '@ai-sdk/openai';import  from 'ai';
export const myProvider = customProvider(,          },        },      }),    }),    'reasoning-fast': wrapLanguageModel(,          },        },      }),    }),  },  embeddingModels: ,  // no fallback provider});
```


## [Provider Registry](#provider-registry)

You can create a [provider registry](../reference/ai-sdk-core/provider-registry.html) with multiple providers and models using `createProviderRegistry`.

### [Setup](#setup)












``` ts
import  from '@ai-sdk/anthropic';import  from '@ai-sdk/openai';import  from 'ai';
export const registry = createProviderRegistry(),});
```


### [Setup with Custom Separator](#setup-with-custom-separator)

By default, the registry uses `:` as the separator between provider and model IDs. You can customize this separator:












``` ts
import  from 'ai';import  from '@ai-sdk/anthropic';import  from '@ai-sdk/openai';
export const customSeparatorRegistry = createProviderRegistry(  ,  ,);
```


### [Example: Use language models](#example-use-language-models)

You can access language models by using the `languageModel` method on the registry. The provider id will become the prefix of the model id: `providerId:modelId`.



``` ts
import  from 'ai';import  from './registry';
const  = await generateText();
```


### [Example: Use text embedding models](#example-use-text-embedding-models)

You can access text embedding models by using the `textEmbeddingModel` method on the registry. The provider id will become the prefix of the model id: `providerId:modelId`.



``` ts
import  from 'ai';import  from './registry';
const  = await embed();
```


### [Example: Use image models](#example-use-image-models)

You can access image models by using the `imageModel` method on the registry. The provider id will become the prefix of the model id: `providerId:modelId`.



``` ts
import  from 'ai';import  from './registry';
const  = await generateImage();
```


## [Combining Custom Providers, Provider Registry, and Middleware](#combining-custom-providers-provider-registry-and-middleware)

The central idea of provider management is to set up a file that contains all the providers and models you want to use. You may want to pre-configure model settings, provide model name aliases, limit the available models, and more.

Here is an example that implements the following concepts:

- pass through a full provider with a namespace prefix (here: `xai > *`)
- setup an OpenAI-compatible provider with custom api key and base URL (here: `custom > *`)
- setup model name aliases (here: `anthropic > fast`, `anthropic > writing`, `anthropic > reasoning`)
- pre-configure model settings (here: `anthropic > reasoning`)
- validate the provider-specific options (here: `AnthropicProviderOptions`)
- use a fallback provider (here: `anthropic > *`)
- limit a provider to certain models without a fallback (here: `groq > gemma2-9b-it`, `groq > qwen-qwq-32b`)
- define a custom separator for the provider registry (here: `>`)



``` ts
import  from '@ai-sdk/anthropic';import  from '@ai-sdk/openai-compatible';import  from '@ai-sdk/xai';import  from '@ai-sdk/groq';import  from 'ai';
export const registry = createProviderRegistry(  ),
    // setup model name aliases    anthropic: customProvider(,                } satisfies AnthropicProviderOptions,              },            },          }),        }),      },      fallbackProvider: anthropic,    }),
    // limit a provider to certain models without a fallback    groq: customProvider(,    }),  },  ,);
// usage:const model = registry.languageModel('anthropic > reasoning');
```


## [Global Provider Configuration](#global-provider-configuration)

The AI SDK 5 includes a global provider feature that allows you to specify a model using just a plain model ID string:



``` ts
import  from 'ai';
const result = await streamText();
```


By default, the global provider is set to the Vercel AI Gateway.

### [Customizing the Global Provider](#customizing-the-global-provider)

You can set your own preferred global provider:












``` ts
import  from '@ai-sdk/openai';
// Initialize once during startup:globalThis.AI_SDK_DEFAULT_PROVIDER = openai;
```













``` ts
import  from 'ai';
const result = await streamText();
```


This simplifies provider usage and makes it easier to switch between providers without changing your model references throughout your codebase.
















On this page


























































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.