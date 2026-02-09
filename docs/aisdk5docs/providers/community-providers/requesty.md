AI SDK 5 is available now.










Menu






















































































































































































































































































































































































































































































# [Requesty](#requesty)


- **Universal Model Access**: One API key for 300+ models from multiple providers
- **99.99% Uptime SLA**: Enterprise-grade infrastructure with intelligent failover and load balancing
- **Cost Optimization**: Pay-as-you-go pricing with intelligent routing and prompt caching to reduce costs by up to 80%
- **Advanced Security**: Prompt injection detection, end-to-end encryption, and GDPR compliance
- **Real-time Observability**: Built-in monitoring, tracing, and analytics
- **Intelligent Routing**: Automatic failover and performance-based routing
- **Reasoning Support**: Advanced reasoning capabilities with configurable effort levels


## [Setup](#setup)

The Requesty provider is available in the `@requesty/ai-sdk` module. You can install it with:






pnpm







npm







yarn







bun








``` geist-overflow-scroll-y
pnpm add @requesty/ai-sdk
```












## [API Key Setup](#api-key-setup)

For security, you should set your API key as an environment variable named exactly `REQUESTY_API_KEY`:



``` bash
# Linux/Macexport REQUESTY_API_KEY=your_api_key_here
# Windows Command Promptset REQUESTY_API_KEY=your_api_key_here
# Windows PowerShell$env:REQUESTY_API_KEY="your_api_key_here"
```



## [Provider Instance](#provider-instance)

You can import the default provider instance `requesty` from `@requesty/ai-sdk`:



``` typescript
import  from '@requesty/ai-sdk';
```


Alternatively, you can create a custom provider instance using `createRequesty`:



``` typescript
import  from '@requesty/ai-sdk';
const customRequesty = createRequesty();
```


## [Language Models](#language-models)

Requesty supports both chat and completion models with a simple, unified interface:



``` typescript
// Using the default provider instanceconst model = requesty('openai/gpt-4o');
// Using a custom provider instanceconst customModel = customRequesty('anthropic/claude-3.5-sonnet');
```



## [Examples](#examples)

Here are examples of using Requesty with the AI SDK:

### [`generateText`](#generatetext)



``` javascript
import  from '@requesty/ai-sdk';import  from 'ai';
const  = await generateText();
console.log(text);
```


### [`streamText`](#streamtext)



``` javascript
import  from '@requesty/ai-sdk';import  from 'ai';
const result = streamText();
for await (const chunk of result.textStream) 
```


### [Tool Usage](#tool-usage)



``` javascript
import  from '@requesty/ai-sdk';import  from 'ai';import  from 'zod';
const  = await generateObject(),  }),  prompt: 'Generate a recipe for chocolate chip cookies.',});
console.log(object.recipe);
```


## [Advanced Features](#advanced-features)

### [Reasoning Support](#reasoning-support)

Requesty provides advanced reasoning capabilities with configurable effort levels for supported models:



``` javascript
import  from '@requesty/ai-sdk';import  from 'ai';
const requesty = createRequesty();
// Using reasoning effortconst  = await generateText(),  prompt: 'Solve this complex problem step by step...',});
console.log('Response:', text);console.log('Reasoning:', reasoning);
```


#### [Reasoning Effort Values](#reasoning-effort-values)

- `'low'` - Minimal reasoning effort
- `'medium'` - Moderate reasoning effort
- `'high'` - High reasoning effort
- `'max'` - Maximum reasoning effort (Requesty-specific)
- Budget strings (e.g., `"10000"`) - Specific token budget for reasoning

#### [Supported Reasoning Models](#supported-reasoning-models)

- **OpenAI**: `openai/o3-mini`, `openai/o3`
- **Anthropic**: `anthropic/claude-sonnet-4-0`, other Claude reasoning models
- **Deepseek**: All Deepseek reasoning models (automatic reasoning)

### [Custom Configuration](#custom-configuration)

Configure Requesty with custom settings:



``` javascript
import  from '@requesty/ai-sdk';
const requesty = createRequesty(,  extraBody: ,});
```


### [Passing Extra Body Parameters](#passing-extra-body-parameters)

There are three ways to pass extra body parameters to Requesty:

#### [1. Via Provider Options](#1-via-provider-options)



``` javascript
await streamText(],  providerOptions: ,  },});
```


#### [2. Via Model Settings](#2-via-model-settings)



``` javascript
const model = requesty('anthropic/claude-3.5-sonnet', ,});
```


#### [3. Via Provider Factory](#3-via-provider-factory)



``` javascript
const requesty = createRequesty(,});
```


## [Enterprise Features](#enterprise-features)

Requesty offers several enterprise-grade features:

1.  **99.99% Uptime SLA**: Advanced routing and failover mechanisms keep your AI application online when other services fail.

2.  **Intelligent Load Balancing**: Real-time performance-based routing automatically selects the best-performing providers.

3.  **Cost Optimization**: Intelligent routing can reduce API costs by up to 40% while maintaining response quality.

4.  **Advanced Security**: Built-in prompt injection detection, end-to-end encryption, and GDPR compliance.

5.  **Real-time Observability**: Comprehensive monitoring, tracing, and analytics for all requests.

6.  **Geographic Restrictions**: Comply with regional regulations through configurable geographic controls.

7.  **Model Access Control**: Fine-grained control over which models and providers can be accessed.

## [Key Benefits](#key-benefits)

- **Zero Downtime**: Automatic failover with \<50ms switching time
- **Multi-Provider Redundancy**: Seamless switching between healthy providers
- **Intelligent Queuing**: Retry logic with exponential backoff
- **Developer-Friendly**: Straightforward setup with unified API
- **Flexibility**: Switch between models and providers without code changes
- **Enterprise Support**: Available for high-volume users with custom SLAs

## [Additional Resources](#additional-resources)

















On this page




























































































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.