Community Providers: Requesty

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

[Community Providers](../community-providers.html)Requesty

# [Requesty](#requesty)

[Requesty](https://requesty.ai/) is a unified LLM gateway that provides access to over 300 large language models from leading providers like OpenAI, Anthropic, Google, Mistral, AWS, and more. The Requesty provider for the AI SDK enables seamless integration with all these models while offering enterprise-grade advantages:

-   **Universal Model Access**: One API key for 300+ models from multiple providers
-   **99.99% Uptime SLA**: Enterprise-grade infrastructure with intelligent failover and load balancing
-   **Cost Optimization**: Pay-as-you-go pricing with intelligent routing and prompt caching to reduce costs by up to 80%
-   **Advanced Security**: Prompt injection detection, end-to-end encryption, and GDPR compliance
-   **Real-time Observability**: Built-in monitoring, tracing, and analytics
-   **Intelligent Routing**: Automatic failover and performance-based routing
-   **Reasoning Support**: Advanced reasoning capabilities with configurable effort levels

Learn more about Requesty's capabilities in the [Requesty Documentation](https://docs.requesty.ai).

## [Setup](#setup)

The Requesty provider is available in the `@requesty/ai-sdk` module. You can install it with:

pnpm

npm

yarn

bun

pnpm add @requesty/ai-sdk

## [API Key Setup](#api-key-setup)

For security, you should set your API key as an environment variable named exactly `REQUESTY_API_KEY`:

```bash
# Linux/Mac
export REQUESTY_API_KEY=your_api_key_here


# Windows Command Prompt
set REQUESTY_API_KEY=your_api_key_here


# Windows PowerShell
$env:REQUESTY_API_KEY="your_api_key_here"
```

You can obtain your Requesty API key from the [Requesty Dashboard](https://app.requesty.ai/api-keys).

## [Provider Instance](#provider-instance)

You can import the default provider instance `requesty` from `@requesty/ai-sdk`:

```typescript
import { requesty } from '@requesty/ai-sdk';
```

Alternatively, you can create a custom provider instance using `createRequesty`:

```typescript
import { createRequesty } from '@requesty/ai-sdk';


const customRequesty = createRequesty({
  apiKey: 'YOUR_REQUESTY_API_KEY',
});
```

## [Language Models](#language-models)

Requesty supports both chat and completion models with a simple, unified interface:

```typescript
// Using the default provider instance
const model = requesty('openai/gpt-4o');


// Using a custom provider instance
const customModel = customRequesty('anthropic/claude-3.5-sonnet');
```

You can find the full list of available models in the [Requesty Models documentation](https://requesty.ai/models).

## [Examples](#examples)

Here are examples of using Requesty with the AI SDK:

### [`generateText`](#generatetext)

```javascript
import { requesty } from '@requesty/ai-sdk';
import { generateText } from 'ai';


const { text } = await generateText({
  model: requesty('openai/gpt-4o'),
  prompt: 'Write a vegetarian lasagna recipe for 4 people.',
});


console.log(text);
```

### [`streamText`](#streamtext)

```javascript
import { requesty } from '@requesty/ai-sdk';
import { streamText } from 'ai';


const result = streamText({
  model: requesty('anthropic/claude-3.5-sonnet'),
  prompt: 'Write a short story about AI.',
});


for await (const chunk of result.textStream) {
  console.log(chunk);
}
```

### [Tool Usage](#tool-usage)

```javascript
import { requesty } from '@requesty/ai-sdk';
import { generateObject } from 'ai';
import { z } from 'zod';


const { object } = await generateObject({
  model: requesty('openai/gpt-4o'),
  schema: z.object({
    recipe: z.object({
      name: z.string(),
      ingredients: z.array(z.string()),
      steps: z.array(z.string()),
    }),
  }),
  prompt: 'Generate a recipe for chocolate chip cookies.',
});


console.log(object.recipe);
```

## [Advanced Features](#advanced-features)

### [Reasoning Support](#reasoning-support)

Requesty provides advanced reasoning capabilities with configurable effort levels for supported models:

```javascript
import { createRequesty } from '@requesty/ai-sdk';
import { generateText } from 'ai';


const requesty = createRequesty({ apiKey: process.env.REQUESTY_API_KEY });


// Using reasoning effort
const { text, reasoning } = await generateText({
  model: requesty('openai/o3-mini', {
    reasoningEffort: 'medium',
  }),
  prompt: 'Solve this complex problem step by step...',
});


console.log('Response:', text);
console.log('Reasoning:', reasoning);
```

#### [Reasoning Effort Values](#reasoning-effort-values)

-   `'low'` - Minimal reasoning effort
-   `'medium'` - Moderate reasoning effort
-   `'high'` - High reasoning effort
-   `'max'` - Maximum reasoning effort (Requesty-specific)
-   Budget strings (e.g., `"10000"`) - Specific token budget for reasoning

#### [Supported Reasoning Models](#supported-reasoning-models)

-   **OpenAI**: `openai/o3-mini`, `openai/o3`
-   **Anthropic**: `anthropic/claude-sonnet-4-0`, other Claude reasoning models
-   **Deepseek**: All Deepseek reasoning models (automatic reasoning)

### [Custom Configuration](#custom-configuration)

Configure Requesty with custom settings:

```javascript
import { createRequesty } from '@requesty/ai-sdk';


const requesty = createRequesty({
  apiKey: process.env.REQUESTY_API_KEY,
  baseURL: 'https://router.requesty.ai/v1',
  headers: {
    'Custom-Header': 'custom-value',
  },
  extraBody: {
    custom_field: 'value',
  },
});
```

### [Passing Extra Body Parameters](#passing-extra-body-parameters)

There are three ways to pass extra body parameters to Requesty:

#### [1\. Via Provider Options](#1-via-provider-options)

```javascript
await streamText({
  model: requesty('anthropic/claude-3.5-sonnet'),
  messages: [{ role: 'user', content: 'Hello' }],
  providerOptions: {
    requesty: {
      custom_field: 'value',
      reasoning_effort: 'high',
    },
  },
});
```

#### [2\. Via Model Settings](#2-via-model-settings)

```javascript
const model = requesty('anthropic/claude-3.5-sonnet', {
  extraBody: {
    custom_field: 'value',
  },
});
```

#### [3\. Via Provider Factory](#3-via-provider-factory)

```javascript
const requesty = createRequesty({
  apiKey: process.env.REQUESTY_API_KEY,
  extraBody: {
    custom_field: 'value',
  },
});
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

-   **Zero Downtime**: Automatic failover with <50ms switching time
-   **Multi-Provider Redundancy**: Seamless switching between healthy providers
-   **Intelligent Queuing**: Retry logic with exponential backoff
-   **Developer-Friendly**: Straightforward setup with unified API
-   **Flexibility**: Switch between models and providers without code changes
-   **Enterprise Support**: Available for high-volume users with custom SLAs

## [Additional Resources](#additional-resources)

-   [Requesty Provider Repository](https://github.com/requestyai/ai-sdk-requesty)
-   [Requesty Documentation](https://docs.requesty.ai/)
-   [Requesty Dashboard](https://app.requesty.ai/analytics)
-   [Requesty Discord Community](https://discord.com/invite/Td3rwAHgt4)
-   [Requesty Status Page](https://status.requesty.ai)

[Previous

Crosshatch

](crosshatch.html)

[Next

Mixedbread

](mixedbread.html)

On this page

[Requesty](#requesty)

[Setup](#setup)

[API Key Setup](#api-key-setup)

[Linux/Mac](#linuxmac)

[Windows Command Prompt](#windows-command-prompt)

[Windows PowerShell](#windows-powershell)

[Provider Instance](#provider-instance)

[Language Models](#language-models)

[Examples](#examples)

[generateText](#generatetext)

[streamText](#streamtext)

[Tool Usage](#tool-usage)

[Advanced Features](#advanced-features)

[Reasoning Support](#reasoning-support)

[Reasoning Effort Values](#reasoning-effort-values)

[Supported Reasoning Models](#supported-reasoning-models)

[Custom Configuration](#custom-configuration)

[Passing Extra Body Parameters](#passing-extra-body-parameters)

[1\. Via Provider Options](#1-via-provider-options)

[2\. Via Model Settings](#2-via-model-settings)

[3\. Via Provider Factory](#3-via-provider-factory)

[Enterprise Features](#enterprise-features)

[Key Benefits](#key-benefits)

[Additional Resources](#additional-resources)

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