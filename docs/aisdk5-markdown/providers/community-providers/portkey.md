Community Providers: Portkey

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

[Community Providers](../community-providers.html)Portkey

# [Portkey Provider](#portkey-provider)

[Portkey](https://portkey.ai/?utm_source=vercel&utm_medium=docs&utm_campaign=integration) natively integrates with the AI SDK to make your apps production-ready and reliable. Import Portkey's Vercel package and use it as a provider in your Vercel AI app to enable all of Portkey's features:

-   Full-stack **observability** and **tracing** for all requests
-   Interoperability across **250+ LLMs**
-   Built-in **50+** state-of-the-art guardrails
-   Simple & semantic **caching** to save costs & time
-   Conditional request routing with fallbacks, load-balancing, automatic retries, and more
-   Continuous improvement based on user feedback

Learn more at [Portkey docs for the AI SDK](https://docs.portkey.ai/docs/integrations/libraries/vercel)

## [Setup](#setup)

The Portkey provider is available in the `@portkey-ai/vercel-provider` module. You can install it with:

pnpm

npm

yarn

bun

pnpm add @portkey-ai/vercel-provider

## [Provider Instance](#provider-instance)

To create a Portkey provider instance, use the `createPortkey` function:

```typescript
import { createPortkey } from '@portkey-ai/vercel-provider';


const portkeyConfig = {
  provider: 'openai', //enter provider of choice
  api_key: 'OPENAI_API_KEY', //enter the respective provider's api key
  override_params: {
    model: 'gpt-4', //choose from 250+ LLMs
  },
};


const portkey = createPortkey({
  apiKey: 'YOUR_PORTKEY_API_KEY',
  config: portkeyConfig,
});
```

You can find your Portkey API key in the [Portkey Dashboard](https://app.portkey.ai).

## [Language Models](#language-models)

Portkey supports both chat and completion models. Use `portkey.chatModel()` for chat models and `portkey.completionModel()` for completion models:

```typescript
const chatModel = portkey.chatModel('');
const completionModel = portkey.completionModel('');
```

Note: You can provide an empty string as the model name if you've defined it in the `portkeyConfig`.

## [Examples](#examples)

You can use Portkey language models with the `generateText` or `streamText` function:

### [`generateText`](#generatetext)

```javascript
import { createPortkey } from '@portkey-ai/vercel-provider';
import { generateText } from 'ai';


const portkey = createPortkey({
  apiKey: 'YOUR_PORTKEY_API_KEY',
  config: portkeyConfig,
});


const { text } = await generateText({
  model: portkey.chatModel(''),
  prompt: 'What is Portkey?',
});


console.log(text);
```

### [`streamText`](#streamtext)

```javascript
import { createPortkey } from '@portkey-ai/vercel-provider';
import { streamText } from 'ai';


const portkey = createPortkey({
  apiKey: 'YOUR_PORTKEY_API_KEY',
  config: portkeyConfig,
});


const result = streamText({
  model: portkey.completionModel(''),
  prompt: 'Invent a new holiday and describe its traditions.',
});


for await (const chunk of result) {
  console.log(chunk);
}
```

Note:

-   Portkey supports `Tool` use with the AI SDK
-   `generatObject` and `streamObject` are currently not supported.

## [Advanced Features](#advanced-features)

Portkey offers several advanced features to enhance your AI applications:

1.  **Interoperability**: Easily switch between 250+ AI models by changing the provider and model name in your configuration.
    
2.  **Observability**: Access comprehensive analytics and logs for all your requests.
    
3.  **Reliability**: Implement caching, fallbacks, load balancing, and conditional routing.
    
4.  **Guardrails**: Enforce LLM behavior in real-time with input and output checks.
    
5.  **Security and Compliance**: Set budget limits and implement fine-grained user roles and permissions.
    

For detailed information on these features and advanced configuration options, please refer to the [Portkey documentation](https://docs.portkey.ai/docs/integrations/libraries/vercel).

## [Additional Resources](#additional-resources)

-   [Portkey Documentation](https://docs.portkey.ai/docs/integrations/libraries/vercel)
-   [Twitter](https://twitter.com/portkeyai)
-   [Discord Community](https://discord.gg/JHPt4C7r)
-   [Portkey Dashboard](https://app.portkey.ai)

[Previous

FriendliAI

](friendliai.html)

[Next

Built-in AI

](built-in-ai.html)

On this page

[Portkey Provider](#portkey-provider)

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