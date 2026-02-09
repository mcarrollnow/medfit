AI SDK 5 is available now.










Menu






















































































































































































































































































































































































































































































# [Cloudflare AI Gateway](#cloudflare-ai-gateway)

The Cloudflare AI Gateway Provider is a library that integrates Cloudflare's AI Gateway with the Vercel AI SDK. It enables seamless access to multiple AI models from various providers through a unified interface, with automatic fallback for high availability.

## [Features](#features)

- **Runtime Agnostic**: Compatible with Node.js, Edge Runtime, and other JavaScript runtimes supported by the Vercel AI SDK.
- **Automatic Fallback**: Automatically switches to the next available model if one fails, ensuring resilience.
- **Multi-Provider Support**: Supports models from OpenAI, Anthropic, DeepSeek, Google AI Studio, Grok, Mistral, Perplexity AI, Replicate, and Groq.
- **Cloudflare AI Gateway Integration**: Leverages Cloudflare's AI Gateway for request management, caching, and rate limiting.
- **Simplified Configuration**: Easy setup with support for API key authentication or Cloudflare AI bindings.

## [Setup](#setup)

The Cloudflare AI Gateway Provider is available in the `ai-gateway-provider` module. Install it with:






pnpm







npm







yarn







bun








``` geist-overflow-scroll-y
pnpm add ai-gateway-provider
```












## [Provider Instance](#provider-instance)

Create an `aigateway` provider instance using the `createAiGateway` function. You can authenticate using an API key or a Cloudflare AI binding.

### [API Key Authentication](#api-key-authentication)



``` typescript
import  from 'ai-gateway-provider';
const aigateway = createAiGateway(,});
```


### [Cloudflare AI Binding](#cloudflare-ai-binding)

This method is only available inside Cloudflare Workers.

Configure an AI binding in your `wrangler.toml`:



``` bash
[AI]binding = "AI"
```


In your worker, create a new instance using the binding:



``` typescript
import  from 'ai-gateway-provider';
const aigateway = createAiGateway(,});
```


## [Language Models](#language-models)

Create a model instance by passing an array of models to the `aigateway` provider. The provider will attempt to use the models in order, falling back to the next if one fails.



``` typescript
import  from 'ai-gateway-provider';import  from '@ai-sdk/openai';import  from '@ai-sdk/anthropic';
const aigateway = createAiGateway();
const openai = createOpenAI();const anthropic = createAnthropic();
const model = aigateway([  anthropic('claude-3-5-haiku-20241022'), // Primary model  openai('gpt-4o-mini'), // Fallback model]);
```


### [Request Options](#request-options)

Customize Cloudflare AI Gateway settings per request:

- `cacheKey`: Custom cache key for the request.
- `cacheTtl`: Cache time-to-live in seconds.
- `skipCache`: Bypass caching.
- `metadata`: Custom metadata for the request.
- `collectLog`: Enable/disable log collection.
- `eventId`: Custom event identifier.
- `requestTimeoutMs`: Request timeout in milliseconds.
- `retries`:
  - `maxAttempts`: Number of retry attempts (1-5).
  - `retryDelayMs`: Delay between retries.
  - `backoff`: Retry strategy (`constant`, `linear`, `exponential`).

Example:



``` typescript
const aigateway = createAiGateway(,    retries: ,  },});
```


## [Examples](#examples)

### [`generateText`](#generatetext)

Generate non-streaming text using the Cloudflare AI Gateway Provider:



``` typescript
import  from 'ai-gateway-provider';import  from '@ai-sdk/openai';import  from 'ai';
const aigateway = createAiGateway();
const openai = createOpenAI();
const  = await generateText();
console.log(text); // Output: "Hello"
```


### [`streamText`](#streamtext)

Stream text responses using the Cloudflare AI Gateway Provider:



``` typescript
import  from 'ai-gateway-provider';import  from '@ai-sdk/openai';import  from 'ai';
const aigateway = createAiGateway();
const openai = createOpenAI();
const result = await streamText();
let accumulatedText = '';for await (const chunk of result.textStream) 
console.log(accumulatedText); // Output: "Hello world!"
```


## [Supported Providers](#supported-providers)

- OpenAI
- Anthropic
- DeepSeek
- Google AI Studio
- Grok
- Mistral
- Perplexity AI
- Replicate
- Groq

## [Error Handling](#error-handling)

The provider throws the following custom errors:

- `AiGatewayUnauthorizedError`: Invalid or missing API key when authentication is enabled.
- `AiGatewayDoesNotExist`: Specified Cloudflare AI Gateway does not exist.
















On this page























































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.