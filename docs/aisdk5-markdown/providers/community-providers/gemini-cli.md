Community Providers: Gemini CLI

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

[Community Providers](../community-providers.html)Gemini CLI

# [Gemini CLI Provider](#gemini-cli-provider)

The [ai-sdk-provider-gemini-cli](https://github.com/ben-vargas/ai-sdk-provider-gemini-cli) community provider enables using Google's Gemini models through the [@google/gemini-cli-core](https://www.npmjs.com/package/@google/gemini-cli-core) library and Google Cloud Code endpoints. While it works with both Gemini Code Assist (GCA) licenses and API key authentication, it's particularly useful for developers who want to use their existing GCA subscription rather than paid use API keys.

## [Version Compatibility](#version-compatibility)

The Gemini CLI provider supports both AI SDK v4 and v5-beta:

| Provider Version | AI SDK Version | Status | Branch |
| --- | --- | --- | --- |
| 0.x | v4 | Stable | [`ai-sdk-v4`](https://github.com/ben-vargas/ai-sdk-provider-gemini-cli/tree/ai-sdk-v4) |
| 1.x-beta | v5-beta | Beta | [`main`](https://github.com/ben-vargas/ai-sdk-provider-gemini-cli/tree/main) |

## [Setup](#setup)

The Gemini CLI provider is available in the `ai-sdk-provider-gemini-cli` module. Install the version that matches your AI SDK version:

### [For AI SDK v5-beta (latest)](#for-ai-sdk-v5-beta-latest)

pnpm

npm

yarn

bun

pnpm add ai-sdk-provider-gemini-cli ai

### [For AI SDK v4 (stable)](#for-ai-sdk-v4-stable)

pnpm

npm

yarn

bun

pnpm add ai-sdk-provider-gemini-cli@^0 ai@^4

## [Provider Instance](#provider-instance)

You can import `createGeminiProvider` from `ai-sdk-provider-gemini-cli` and create a provider instance with your settings:

```ts
import { createGeminiProvider } from 'ai-sdk-provider-gemini-cli';


// OAuth authentication (recommended)
const gemini = createGeminiProvider({
  authType: 'oauth-personal',
});


// API key authentication
const gemini = createGeminiProvider({
  authType: 'api-key',
  apiKey: process.env.GEMINI_API_KEY,
});
```

You can use the following settings to customize the Gemini CLI provider instance:

-   **authType** *'oauth-personal' | 'api-key' | 'gemini-api-key'*
    
    Required. The authentication method to use.
    
    -   `'oauth-personal'`: Uses existing Gemini CLI credentials from `~/.gemini/oauth_creds.json`
    -   `'api-key'`: Standard AI SDK API key authentication (recommended)
    -   `'gemini-api-key'`: Gemini-specific API key authentication (identical to `'api-key'`)
    
    Note: `'api-key'` and `'gemini-api-key'` are functionally identical. We recommend using `'api-key'` for consistency with AI SDK standards, but both options map to the same Gemini authentication method internally.
    
-   **apiKey** *string*
    
    Required when using API key authentication. Your Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey).
    

## [Language Models](#language-models)

You can create models that call Gemini through the CLI using the provider instance. The first argument is the model ID:

```ts
const model = gemini('gemini-2.5-pro');
```

Gemini CLI supports the following models:

-   **gemini-2.5-pro**: Most capable model for complex tasks (64K output tokens)
-   **gemini-2.5-flash**: Faster model for simpler tasks (64K output tokens)

### [Example: Generate Text](#example-generate-text)

You can use Gemini CLI language models to generate text with the `generateText` function:

```ts
import { createGeminiProvider } from 'ai-sdk-provider-gemini-cli';
import { generateText } from 'ai';


const gemini = createGeminiProvider({
  authType: 'oauth-personal',
});


// AI SDK v4
const { text } = await generateText({
  model: gemini('gemini-2.5-pro'),
  prompt: 'Write a vegetarian lasagna recipe for 4 people.',
});


// AI SDK v5-beta
const result = await generateText({
  model: gemini('gemini-2.5-pro'),
  prompt: 'Write a vegetarian lasagna recipe for 4 people.',
});
console.log(result.content[0].text);
```

Gemini CLI language models can also be used in the `streamText`, `generateObject`, and `streamObject` functions (see [AI SDK Core](../../docs/ai-sdk-core.html) for more information).

The response format differs between AI SDK v4 and v5-beta. In v4, text is accessed directly via `result.text`. In v5-beta, it's accessed via `result.content[0].text`. Make sure to use the appropriate format for your AI SDK version.

### [Model Capabilities](#model-capabilities)

| Model | Image Input | Object Generation | Tool Usage | Tool Streaming |
| --- | --- | --- | --- | --- |
| `gemini-2.5-pro` |  |  |  |  |
| `gemini-2.5-flash` |  |  |  |  |

Images must be provided as base64-encoded data. Image URLs are not supported due to the Google Cloud Code endpoint requirements.

## [Authentication](#authentication)

The Gemini CLI provider supports two authentication methods:

### [OAuth Authentication (Recommended)](#oauth-authentication-recommended)

First, install and authenticate the Gemini CLI globally:

```bash
npm install -g @google/gemini-cli
gemini  # Follow the interactive authentication setup
```

Then use OAuth authentication in your code:

```ts
const gemini = createGeminiProvider({
  authType: 'oauth-personal',
});
```

This uses your existing Gemini CLI credentials from `~/.gemini/oauth_creds.json`.

### [API Key Authentication](#api-key-authentication)

1.  Generate an API key from [Google AI Studio](https://aistudio.google.com/apikey).
    
2.  Set it as an environment variable in your terminal:
    
    ```bash
    export GEMINI_API_KEY="YOUR_API_KEY"
    ```
    
    Replace `YOUR_API_KEY` with your generated key.
    
3.  Use API key authentication in your code:
    

```ts
const gemini = createGeminiProvider({
  authType: 'api-key',
  apiKey: process.env.GEMINI_API_KEY,
});
```

The Gemini API provides a free tier with 100 requests per day using Gemini 2.5 Pro. You can upgrade to a paid plan for higher rate limits on the [API key page](https://aistudio.google.com/apikey).

## [Features](#features)

### [Structured Object Generation](#structured-object-generation)

Generate structured data using Zod schemas:

```ts
import { generateObject } from 'ai';
import { createGeminiProvider } from 'ai-sdk-provider-gemini-cli';
import { z } from 'zod';


const gemini = createGeminiProvider({
  authType: 'oauth-personal',
});


const result = await generateObject({
  model: gemini('gemini-2.5-pro'),
  schema: z.object({
    name: z.string().describe('Product name'),
    price: z.number().describe('Price in USD'),
    features: z.array(z.string()).describe('Key features'),
  }),
  prompt: 'Generate a laptop product listing',
});


console.log(result.object);
```

### [Streaming Responses](#streaming-responses)

Stream text for real-time output:

```ts
import { streamText } from 'ai';
import { createGeminiProvider } from 'ai-sdk-provider-gemini-cli';


const gemini = createGeminiProvider({
  authType: 'oauth-personal',
});


const result = await streamText({
  model: gemini('gemini-2.5-pro'),
  prompt: 'Write a story about a robot learning to paint',
});


// Both v4 and v5 use the same streaming API
for await (const chunk of result.textStream) {
  process.stdout.write(chunk);
}
```

For more examples and features, including tool usage and multimodal input, see the [provider documentation](https://github.com/ben-vargas/ai-sdk-provider-gemini-cli).

## [Model Parameters](#model-parameters)

You can configure model behavior with standard AI SDK parameters:

```ts
// AI SDK v4
const model = gemini('gemini-2.5-pro', {
  temperature: 0.7, // Controls randomness (0-2)
  maxTokens: 1000, // Maximum output tokens (defaults to 65536)
  topP: 0.95, // Nucleus sampling threshold
});


// AI SDK v5-beta
const model = gemini('gemini-2.5-pro', {
  temperature: 0.7, // Controls randomness (0-2)
  maxOutputTokens: 1000, // Maximum output tokens (defaults to 65536)
  topP: 0.95, // Nucleus sampling threshold
});
```

In AI SDK v5-beta, the `maxTokens` parameter has been renamed to `maxOutputTokens`. Make sure to use the correct parameter name for your version.

## [Limitations](#limitations)

-   Requires Node.js ≥ 18
-   OAuth authentication requires the Gemini CLI to be installed globally
-   Image URLs not supported (use base64-encoded images)
-   Very strict character length constraints in schemas may be challenging
-   Some AI SDK parameters not supported: `frequencyPenalty`, `presencePenalty`, `seed`
-   Only function tools supported (no provider-defined tools)

## [Requirements](#requirements)

-   Node.js 18 or higher
-   Gemini CLI installed globally for OAuth authentication (`npm install -g @google/gemini-cli`)
-   Valid Google account or Gemini API key

[Previous

Built-in AI

](built-in-ai.html)

[Next

Automatic1111

](automatic1111.html)

On this page

[Gemini CLI Provider](#gemini-cli-provider)

[Version Compatibility](#version-compatibility)

[Setup](#setup)

[For AI SDK v5-beta (latest)](#for-ai-sdk-v5-beta-latest)

[For AI SDK v4 (stable)](#for-ai-sdk-v4-stable)

[Provider Instance](#provider-instance)

[Language Models](#language-models)

[Example: Generate Text](#example-generate-text)

[Model Capabilities](#model-capabilities)

[Authentication](#authentication)

[OAuth Authentication (Recommended)](#oauth-authentication-recommended)

[API Key Authentication](#api-key-authentication)

[Features](#features)

[Structured Object Generation](#structured-object-generation)

[Streaming Responses](#streaming-responses)

[Model Parameters](#model-parameters)

[Limitations](#limitations)

[Requirements](#requirements)

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