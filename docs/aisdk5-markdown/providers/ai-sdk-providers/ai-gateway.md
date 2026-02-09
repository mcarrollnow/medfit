AI SDK Providers: AI Gateway

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

[AI SDK Providers](../ai-sdk-providers.html)AI Gateway

# [AI Gateway Provider](#ai-gateway-provider)

The [AI Gateway](https://vercel.com/docs/ai-gateway) provider connects you to models from multiple AI providers through a single interface. Instead of integrating with each provider separately, you can access OpenAI, Anthropic, Google, Meta, xAI, and other providers and their models.

## [Features](#features)

-   Access models from multiple providers without having to install additional provider modules/dependencies
-   Use the same code structure across different AI providers
-   Switch between models and providers easily
-   Automatic authentication when deployed on Vercel
-   View pricing information across providers
-   Observability for AI model usage through the Vercel dashboard

## [Setup](#setup)

The Vercel AI Gateway provider is part of the AI SDK.

## [Basic Usage](#basic-usage)

For most use cases, you can use the AI Gateway directly with a model string:

```ts
// use plain model string with global provider
import { generateText } from 'ai';


const { text } = await generateText({
  model: 'openai/gpt-5',
  prompt: 'Hello world',
});
```

```ts
// use provider instance (requires version 5.0.36 or later)
import { generateText, gateway } from 'ai';


const { text } = await generateText({
  model: gateway('openai/gpt-5'),
  prompt: 'Hello world',
});
```

The AI SDK automatically uses the AI Gateway when you pass a model string in the `creator/model-name` format.

## [Provider Instance](#provider-instance)

The `gateway` provider instance is available from the `ai` package in version 5.0.36 and later.

You can also import the default provider instance `gateway` from `ai`:

```ts
import { gateway } from 'ai';
```

You may want to create a custom provider instance when you need to:

-   Set custom configuration options (API key, base URL, headers)
-   Use the provider in a [provider registry](https://ai-sdk.dev/docs/ai-sdk-core/provider-registry)
-   Wrap the provider with [middleware](../../docs/ai-sdk-core/middleware.html)
-   Use different settings for different parts of your application

To create a custom provider instance, import `createGateway` from `ai`:

```ts
import { createGateway } from 'ai';


const gateway = createGateway({
  apiKey: process.env.AI_GATEWAY_API_KEY ?? '',
});
```

You can use the following optional settings to customize the AI Gateway provider instance:

-   **baseURL** *string*
    
    Use a different URL prefix for API calls. The default prefix is `https://ai-gateway.vercel.sh/v1/ai`.
    
-   **apiKey** *string*
    
    API key that is being sent using the `Authorization` header. It defaults to the `AI_GATEWAY_API_KEY` environment variable.
    
-   **headers** *Record<string,string>*
    
    Custom headers to include in the requests.
    
-   **fetch** *(input: RequestInfo, init?: RequestInit) => Promise<Response>*
    
    Custom [fetch](https://developer.mozilla.org/en-US/docs/Web/API/fetch) implementation. Defaults to the global `fetch` function. You can use it as a middleware to intercept requests, or to provide a custom fetch implementation for e.g. testing.
    
-   **metadataCacheRefreshMillis** *number*
    
    How frequently to refresh the metadata cache in milliseconds. Defaults to 5 minutes (300,000ms).
    

## [Authentication](#authentication)

The Gateway provider supports two authentication methods:

### [API Key Authentication](#api-key-authentication)

Set your API key via environment variable:

```bash
AI_GATEWAY_API_KEY=your_api_key_here
```

Or pass it directly to the provider:

```ts
import { createGateway } from 'ai';


const gateway = createGateway({
  apiKey: 'your_api_key_here',
});
```

### [OIDC Authentication (Vercel Deployments)](#oidc-authentication-vercel-deployments)

When deployed to Vercel, the AI Gateway provider supports authenticating using [OIDC (OpenID Connect) tokens](https://vercel.com/docs/oidc) without API Keys.

#### [How OIDC Authentication Works](#how-oidc-authentication-works)

1.  **In Production/Preview Deployments**:
    
    -   OIDC authentication is automatically handled
    -   No manual configuration needed
    -   Tokens are automatically obtained and refreshed
2.  **In Local Development**:
    
    -   First, install and authenticate with the [Vercel CLI](https://vercel.com/docs/cli)
    -   Run `vercel env pull` to download your project's OIDC token locally
    -   For automatic token management:
        -   Use `vercel dev` to start your development server - this will handle token refreshing automatically
    -   For manual token management:
        -   If not using `vercel dev`, note that OIDC tokens expire after 12 hours
        -   You'll need to run `vercel env pull` again to refresh the token before it expires

If an API Key is present (either passed directly or via environment), it will always be used, even if invalid.

Read more about using OIDC tokens in the [Vercel AI Gateway docs](https://vercel.com/docs/ai-gateway#using-the-ai-gateway-with-a-vercel-oidc-token).

## [Language Models](#language-models)

You can create language models using a provider instance. The first argument is the model ID in the format `creator/model-name`:

```ts
import { generateText } from 'ai';


const { text } = await generateText({
  model: 'openai/gpt-5',
  prompt: 'Explain quantum computing in simple terms',
});
```

AI Gateway language models can also be used in the `streamText`, `generateObject`, and `streamObject` functions (see [AI SDK Core](../../docs/ai-sdk-core.html)).

## [Available Models](#available-models)

The AI Gateway supports models from OpenAI, Anthropic, Google, Meta, xAI, Mistral, DeepSeek, Amazon Bedrock, Cohere, Perplexity, Alibaba, and other providers.

For the complete list of available models, see the [AI Gateway documentation](https://vercel.com/docs/ai-gateway).

## [Dynamic Model Discovery](#dynamic-model-discovery)

You can discover available models programmatically:

```ts
import { gateway, generateText } from 'ai';


const availableModels = await gateway.getAvailableModels();


// List all available models
availableModels.models.forEach(model => {
  console.log(`${model.id}: ${model.name}`);
  if (model.description) {
    console.log(`  Description: ${model.description}`);
  }
  if (model.pricing) {
    console.log(`  Input: $${model.pricing.input}/token`);
    console.log(`  Output: $${model.pricing.output}/token`);
    if (model.pricing.cachedInputTokens) {
      console.log(
        `  Cached input (read): $${model.pricing.cachedInputTokens}/token`,
      );
    }
    if (model.pricing.cacheCreationInputTokens) {
      console.log(
        `  Cache creation (write): $${model.pricing.cacheCreationInputTokens}/token`,
      );
    }
  }
});


// Use any discovered model with plain string
const { text } = await generateText({
  model: availableModels.models[0].id, // e.g., 'openai/gpt-4o'
  prompt: 'Hello world',
});
```

## [Credit Usage](#credit-usage)

You can check your team's current credit balance and usage:

```ts
import { gateway } from 'ai';


const credits = await gateway.getCredits();


console.log(`Team balance: ${credits.balance} credits`);
console.log(`Team total used: ${credits.total_used} credits`);
```

The `getCredits()` method returns your team's credit information based on the authenticated API key or OIDC token:

-   **balance** *number* - Your team's current available credit balance
-   **total\_used** *number* - Total credits consumed by your team

## [Examples](#examples)

### [Basic Text Generation](#basic-text-generation)

```ts
import { generateText } from 'ai';


const { text } = await generateText({
  model: 'anthropic/claude-sonnet-4',
  prompt: 'Write a haiku about programming',
});


console.log(text);
```

### [Streaming](#streaming)

```ts
import { streamText } from 'ai';


const { textStream } = await streamText({
  model: 'openai/gpt-5',
  prompt: 'Explain the benefits of serverless architecture',
});


for await (const textPart of textStream) {
  process.stdout.write(textPart);
}
```

### [Tool Usage](#tool-usage)

```ts
import { generateText, tool } from 'ai';
import { z } from 'zod';


const { text } = await generateText({
  model: 'xai/grok-4',
  prompt: 'What is the weather like in San Francisco?',
  tools: {
    getWeather: tool({
      description: 'Get the current weather for a location',
      parameters: z.object({
        location: z.string().describe('The location to get weather for'),
      }),
      execute: async ({ location }) => {
        // Your weather API call here
        return `It's sunny in ${location}`;
      },
    }),
  },
});
```

### [Usage Tracking with User and Tags](#usage-tracking-with-user-and-tags)

Track usage per end-user and categorize requests with tags:

```ts
import type { GatewayProviderOptions } from '@ai-sdk/gateway';
import { generateText } from 'ai';


const { text } = await generateText({
  model: 'openai/gpt-5',
  prompt: 'Summarize this document...',
  providerOptions: {
    gateway: {
      user: 'user-abc-123', // Track usage for this specific end-user
      tags: ['document-summary', 'premium-feature'], // Categorize for reporting
    } satisfies GatewayProviderOptions,
  },
});
```

This allows you to:

-   View usage and costs broken down by end-user in your analytics
-   Filter and analyze spending by feature or use case using tags
-   Track which users or features are driving the most AI usage

## [Provider Options](#provider-options)

The AI Gateway provider accepts provider options that control routing behavior and provider-specific configurations.

### [Gateway Provider Options](#gateway-provider-options)

You can use the `gateway` key in `providerOptions` to control how AI Gateway routes requests:

```ts
import type { GatewayProviderOptions } from '@ai-sdk/gateway';
import { generateText } from 'ai';


const { text } = await generateText({
  model: 'anthropic/claude-sonnet-4',
  prompt: 'Explain quantum computing',
  providerOptions: {
    gateway: {
      order: ['vertex', 'anthropic'], // Try Vertex AI first, then Anthropic
      only: ['vertex', 'anthropic'], // Only use these providers
    } satisfies GatewayProviderOptions,
  },
});
```

The following gateway provider options are available:

-   **order** *string\[\]*
    
    Specifies the sequence of providers to attempt when routing requests. The gateway will try providers in the order specified. If a provider fails or is unavailable, it will move to the next provider in the list.
    
    Example: `order: ['bedrock', 'anthropic']` will attempt Amazon Bedrock first, then fall back to Anthropic.
    
-   **only** *string\[\]*
    
    Restricts routing to only the specified providers. When set, the gateway will never route to providers not in this list, even if they would otherwise be available.
    
    Example: `only: ['anthropic', 'vertex']` will only allow routing to Anthropic or Vertex AI.
    
-   **user** *string*
    
    Optional identifier for the end user on whose behalf the request is being made. This is used for spend tracking and attribution purposes, allowing you to track usage per end-user in your application.
    
    Example: `user: 'user-123'` will associate this request with end-user ID "user-123" in usage reports.
    
-   **tags** *string\[\]*
    
    Optional array of tags for categorizing and filtering usage in reports. Useful for tracking spend by feature, prompt version, or any other dimension relevant to your application.
    
    Example: `tags: ['chat', 'v2']` will tag this request with "chat" and "v2" for filtering in usage analytics.
    

You can combine these options to have fine-grained control over routing and tracking:

```ts
import type { GatewayProviderOptions } from '@ai-sdk/gateway';
import { generateText } from 'ai';


const { text } = await generateText({
  model: 'anthropic/claude-sonnet-4',
  prompt: 'Write a haiku about programming',
  providerOptions: {
    gateway: {
      order: ['vertex'], // Prefer Vertex AI
      only: ['anthropic', 'vertex'], // Only allow these providers
    } satisfies GatewayProviderOptions,
  },
});
```

### [Provider-Specific Options](#provider-specific-options)

When using provider-specific options through AI Gateway, use the actual provider name (e.g. `anthropic`, `openai`, not `gateway`) as the key:

```ts
import type { AnthropicProviderOptions } from '@ai-sdk/anthropic';
import type { GatewayProviderOptions } from '@ai-sdk/gateway';
import { generateText } from 'ai';


const { text } = await generateText({
  model: 'anthropic/claude-sonnet-4',
  prompt: 'Explain quantum computing',
  providerOptions: {
    gateway: {
      order: ['vertex', 'anthropic'],
    } satisfies GatewayProviderOptions,
    anthropic: {
      thinking: { type: 'enabled', budgetTokens: 12000 },
    } satisfies AnthropicProviderOptions,
  },
});
```

This works with any provider supported by AI Gateway. Each provider has its own set of options - see the individual [provider documentation pages](../ai-sdk-providers.html) for details on provider-specific options.

### [Available Providers](#available-providers)

AI Gateway supports routing to 20+ providers.

For a complete list of available providers and their slugs, see the [AI Gateway documentation](https://vercel.com/docs/ai-gateway/provider-options#available-providers).

## [Model Capabilities](#model-capabilities)

Model capabilities depend on the specific provider and model you're using. For detailed capability information, see:

-   [AI Gateway provider options](https://vercel.com/docs/ai-gateway/provider-options#available-providers) for an overview of available providers
-   Individual [AI SDK provider pages](../ai-sdk-providers.html) for specific model capabilities and features

[Previous

AI SDK Providers

](../ai-sdk-providers.html)

[Next

xAI Grok

](xai.html)

On this page

[AI Gateway Provider](#ai-gateway-provider)

[Features](#features)

[Setup](#setup)

[Basic Usage](#basic-usage)

[Provider Instance](#provider-instance)

[Authentication](#authentication)

[API Key Authentication](#api-key-authentication)

[OIDC Authentication (Vercel Deployments)](#oidc-authentication-vercel-deployments)

[How OIDC Authentication Works](#how-oidc-authentication-works)

[Language Models](#language-models)

[Available Models](#available-models)

[Dynamic Model Discovery](#dynamic-model-discovery)

[Credit Usage](#credit-usage)

[Examples](#examples)

[Basic Text Generation](#basic-text-generation)

[Streaming](#streaming)

[Tool Usage](#tool-usage)

[Usage Tracking with User and Tags](#usage-tracking-with-user-and-tags)

[Provider Options](#provider-options)

[Gateway Provider Options](#gateway-provider-options)

[Provider-Specific Options](#provider-specific-options)

[Available Providers](#available-providers)

[Model Capabilities](#model-capabilities)

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