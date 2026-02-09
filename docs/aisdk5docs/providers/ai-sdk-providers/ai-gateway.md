AI SDK 5 is available now.










Menu






















































































































































































































































































































































































































































































# [AI Gateway Provider](#ai-gateway-provider)


## [Features](#features)

- Access models from multiple providers without having to install additional provider modules/dependencies
- Use the same code structure across different AI providers
- Switch between models and providers easily
- Automatic authentication when deployed on Vercel
- View pricing information across providers
- Observability for AI model usage through the Vercel dashboard

## [Setup](#setup)

The Vercel AI Gateway provider is part of the AI SDK.

## [Basic Usage](#basic-usage)

For most use cases, you can use the AI Gateway directly with a model string:



``` ts
// use plain model string with global providerimport  from 'ai';
const  = await generateText();
```




``` ts
// use provider instance (requires version 5.0.36 or later)import  from 'ai';
const  = await generateText();
```


The AI SDK automatically uses the AI Gateway when you pass a model string in the `creator/model-name` format.

## [Provider Instance](#provider-instance)




The `gateway` provider instance is available from the `ai` package in version 5.0.36 and later.



You can also import the default provider instance `gateway` from `ai`:



``` ts
import  from 'ai';
```


You may want to create a custom provider instance when you need to:

- Set custom configuration options (API key, base URL, headers)
- Use the provider in a [provider registry](https://ai-sdk.dev/docs/ai-sdk-core/provider-registry)
- Wrap the provider with [middleware](../../docs/ai-sdk-core/middleware.html)
- Use different settings for different parts of your application

To create a custom provider instance, import `createGateway` from `ai`:



``` ts
import  from 'ai';
const gateway = createGateway();
```


You can use the following optional settings to customize the AI Gateway provider instance:

- **baseURL** *string*

  Use a different URL prefix for API calls. The default prefix is `https://ai-gateway.vercel.sh/v1/ai`.

- **apiKey** *string*

  API key that is being sent using the `Authorization` header. It defaults to the `AI_GATEWAY_API_KEY` environment variable.

- **headers** *Record\<string,string\>*

  Custom headers to include in the requests.

- **fetch** *(input: RequestInfo, init?: RequestInit) =\> Promise\<Response\>*


- **metadataCacheRefreshMillis** *number*

  How frequently to refresh the metadata cache in milliseconds. Defaults to 5 minutes (300,000ms).

## [Authentication](#authentication)

The Gateway provider supports two authentication methods:

### [API Key Authentication](#api-key-authentication)

Set your API key via environment variable:



``` bash
AI_GATEWAY_API_KEY=your_api_key_here
```


Or pass it directly to the provider:



``` ts
import  from 'ai';
const gateway = createGateway();
```


### [OIDC Authentication (Vercel Deployments)](#oidc-authentication-vercel-deployments)


#### [How OIDC Authentication Works](#how-oidc-authentication-works)

1.  **In Production/Preview Deployments**:

    - OIDC authentication is automatically handled
    - No manual configuration needed
    - Tokens are automatically obtained and refreshed

2.  **In Local Development**:

    - Run `vercel env pull` to download your project's OIDC token locally
    - For automatic token management:
      - Use `vercel dev` to start your development server - this will handle token refreshing automatically
    - For manual token management:
      - If not using `vercel dev`, note that OIDC tokens expire after 12 hours
      - You'll need to run `vercel env pull` again to refresh the token before it expires




If an API Key is present (either passed directly or via environment), it will always be used, even if invalid.




## [Language Models](#language-models)

You can create language models using a provider instance. The first argument is the model ID in the format `creator/model-name`:



``` ts
import  from 'ai';
const  = await generateText();
```


AI Gateway language models can also be used in the `streamText`, `generateObject`, and `streamObject` functions (see [AI SDK Core](../../docs/ai-sdk-core.html)).

## [Available Models](#available-models)

The AI Gateway supports models from OpenAI, Anthropic, Google, Meta, xAI, Mistral, DeepSeek, Amazon Bedrock, Cohere, Perplexity, Alibaba, and other providers.


## [Dynamic Model Discovery](#dynamic-model-discovery)

You can discover available models programmatically:



``` ts
import  from 'ai';
const availableModels = await gateway.getAvailableModels();
// List all available modelsavailableModels.models.forEach(model => : $`);  if (model.description) `);  }  if (model.pricing) /token`);    console.log(`  Output: $$/token`);    if (model.pricing.cachedInputTokens) /token`,      );    }    if (model.pricing.cacheCreationInputTokens) /token`,      );    }  }});
// Use any discovered model with plain stringconst  = await generateText();
```


## [Credit Usage](#credit-usage)

You can check your team's current credit balance and usage:



``` ts
import  from 'ai';
const credits = await gateway.getCredits();
console.log(`Team balance: $ credits`);console.log(`Team total used: $ credits`);
```


The `getCredits()` method returns your team's credit information based on the authenticated API key or OIDC token:

- **balance** *number* - Your team's current available credit balance
- **total_used** *number* - Total credits consumed by your team

## [Examples](#examples)

### [Basic Text Generation](#basic-text-generation)



``` ts
import  from 'ai';
const  = await generateText();
console.log(text);
```


### [Streaming](#streaming)



``` ts
import  from 'ai';
const  = await streamText();
for await (const textPart of textStream) 
```


### [Tool Usage](#tool-usage)



``` ts
import  from 'ai';import  from 'zod';
const  = await generateText(),      execute: async () => `;      },    }),  },});
```


### [Usage Tracking with User and Tags](#usage-tracking-with-user-and-tags)

Track usage per end-user and categorize requests with tags:



``` ts
import type  from '@ai-sdk/gateway';import  from 'ai';
const  = await generateText( satisfies GatewayProviderOptions,  },});
```


This allows you to:

- View usage and costs broken down by end-user in your analytics
- Filter and analyze spending by feature or use case using tags
- Track which users or features are driving the most AI usage

## [Provider Options](#provider-options)

The AI Gateway provider accepts provider options that control routing behavior and provider-specific configurations.

### [Gateway Provider Options](#gateway-provider-options)

You can use the `gateway` key in `providerOptions` to control how AI Gateway routes requests:



``` ts
import type  from '@ai-sdk/gateway';import  from 'ai';
const  = await generateText( satisfies GatewayProviderOptions,  },});
```


The following gateway provider options are available:

- **order** *string\[\]*

  Specifies the sequence of providers to attempt when routing requests. The gateway will try providers in the order specified. If a provider fails or is unavailable, it will move to the next provider in the list.

  Example: `order: ['bedrock', 'anthropic']` will attempt Amazon Bedrock first, then fall back to Anthropic.

- **only** *string\[\]*

  Restricts routing to only the specified providers. When set, the gateway will never route to providers not in this list, even if they would otherwise be available.

  Example: `only: ['anthropic', 'vertex']` will only allow routing to Anthropic or Vertex AI.

- **user** *string*

  Optional identifier for the end user on whose behalf the request is being made. This is used for spend tracking and attribution purposes, allowing you to track usage per end-user in your application.

  Example: `user: 'user-123'` will associate this request with end-user ID "user-123" in usage reports.

- **tags** *string\[\]*

  Optional array of tags for categorizing and filtering usage in reports. Useful for tracking spend by feature, prompt version, or any other dimension relevant to your application.

  Example: `tags: ['chat', 'v2']` will tag this request with "chat" and "v2" for filtering in usage analytics.

You can combine these options to have fine-grained control over routing and tracking:



``` ts
import type  from '@ai-sdk/gateway';import  from 'ai';
const  = await generateText( satisfies GatewayProviderOptions,  },});
```


### [Provider-Specific Options](#provider-specific-options)

When using provider-specific options through AI Gateway, use the actual provider name (e.g. `anthropic`, `openai`, not `gateway`) as the key:



``` ts
import type  from '@ai-sdk/anthropic';import type  from '@ai-sdk/gateway';import  from 'ai';
const  = await generateText( satisfies GatewayProviderOptions,    anthropic: ,    } satisfies AnthropicProviderOptions,  },});
```


This works with any provider supported by AI Gateway. Each provider has its own set of options - see the individual [provider documentation pages](../ai-sdk-providers.html) for details on provider-specific options.

### [Available Providers](#available-providers)

AI Gateway supports routing to 20+ providers.


## [Model Capabilities](#model-capabilities)

Model capabilities depend on the specific provider and model you're using. For detailed capability information, see:

- Individual [AI SDK provider pages](../ai-sdk-providers.html) for specific model capabilities and features
















On this page























































































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.