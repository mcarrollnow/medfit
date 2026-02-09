Community Providers: OpenRouter

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

[Community Providers](../community-providers.html)OpenRouter

# [OpenRouter](#openrouter)

[OpenRouter](https://openrouter.ai/) is a unified API gateway that provides access to hundreds of AI models from leading providers like Anthropic, Google, Meta, Mistral, and more. The OpenRouter provider for the AI SDK enables seamless integration with all these models while offering unique advantages:

-   **Universal Model Access**: One API key for hundreds of models from multiple providers
-   **Cost-Effective**: Pay-as-you-go pricing with no monthly fees or commitments
-   **Transparent Pricing**: Clear per-token costs for all models
-   **High Availability**: Enterprise-grade infrastructure with automatic failover
-   **Simple Integration**: Standardized API across all models
-   **Latest Models**: Immediate access to new models as they're released

Learn more about OpenRouter's capabilities in the [OpenRouter Documentation](https://openrouter.ai/docs).

## [Setup](#setup)

The OpenRouter provider is available in the `@openrouter/ai-sdk-provider` module. You can install it with:

pnpm

npm

yarn

bun

pnpm add @openrouter/ai-sdk-provider

## [Provider Instance](#provider-instance)

To create an OpenRouter provider instance, use the `createOpenRouter` function:

```typescript
import { createOpenRouter } from '@openrouter/ai-sdk-provider';


const openrouter = createOpenRouter({
  apiKey: 'YOUR_OPENROUTER_API_KEY',
});
```

You can obtain your OpenRouter API key from the [OpenRouter Dashboard](https://openrouter.ai/keys).

## [Language Models](#language-models)

OpenRouter supports both chat and completion models. Use `openrouter.chat()` for chat models and `openrouter.completion()` for completion models:

```typescript
// Chat models (recommended)
const chatModel = openrouter.chat('anthropic/claude-3.5-sonnet');


// Completion models
const completionModel = openrouter.completion(
  'meta-llama/llama-3.1-405b-instruct',
);
```

You can find the full list of available models in the [OpenRouter Models documentation](https://openrouter.ai/docs#models).

## [Examples](#examples)

Here are examples of using OpenRouter with the AI SDK:

### [`generateText`](#generatetext)

```javascript
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { generateText } from 'ai';


const openrouter = createOpenRouter({
  apiKey: 'YOUR_OPENROUTER_API_KEY',
});


const { text } = await generateText({
  model: openrouter.chat('anthropic/claude-3.5-sonnet'),
  prompt: 'What is OpenRouter?',
});


console.log(text);
```

### [`streamText`](#streamtext)

```javascript
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { streamText } from 'ai';


const openrouter = createOpenRouter({
  apiKey: 'YOUR_OPENROUTER_API_KEY',
});


const result = streamText({
  model: openrouter.chat('meta-llama/llama-3.1-405b-instruct'),
  prompt: 'Write a short story about AI.',
});


for await (const chunk of result) {
  console.log(chunk);
}
```

## [Advanced Features](#advanced-features)

OpenRouter offers several advanced features to enhance your AI applications:

1.  **Model Flexibility**: Switch between hundreds of models without changing your code or managing multiple API keys.
    
2.  **Cost Management**: Track usage and costs per model in real-time through the dashboard.
    
3.  **Enterprise Support**: Available for high-volume users with custom SLAs and dedicated support.
    
4.  **Cross-Provider Compatibility**: Use the same code structure across different model providers.
    
5.  **Regular Updates**: Automatic access to new models and features as they become available.
    

For more information about these features and advanced configuration options, visit the [OpenRouter Documentation](https://openrouter.ai/docs).

## [Additional Resources](#additional-resources)

-   [OpenRouter Provider Repository](https://github.com/OpenRouterTeam/ai-sdk-provider)
-   [OpenRouter Documentation](https://openrouter.ai/docs)
-   [OpenRouter Dashboard](https://openrouter.ai/dashboard)
-   [OpenRouter Discord Community](https://discord.gg/openrouter)
-   [OpenRouter Status Page](https://status.openrouter.ai)

[Previous

Cloudflare AI Gateway

](cloudflare-ai-gateway.html)

[Next

Azure AI

](azure-ai.html)

On this page

[OpenRouter](#openrouter)

[Setup](#setup)

[Provider Instance](#provider-instance)

[Language Models](#language-models)

[Examples](#examples)

[generateText](#generatetext)

[streamText](#streamtext)

[Advanced Features](#advanced-features)

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