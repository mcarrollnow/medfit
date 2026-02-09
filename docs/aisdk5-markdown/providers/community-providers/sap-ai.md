Community Providers: SAP AI Core

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

[Community Providers](../community-providers.html)SAP AI Core

# [SAP AI Core](#sap-ai-core)

## [Important Note](#important-note)

> **Third-Party Provider**: This SAP AI Core provider (`@mymediset/sap-ai-provider`) is developed and maintained by Mymediset, not by SAP SE. While it integrates with official SAP AI Core services, it is not an official SAP product. For official SAP AI solutions, please refer to the [SAP AI Core Documentation](https://help.sap.com/docs/ai-core).

[SAP AI Core](https://help.sap.com/docs/ai-core) is SAP's enterprise-grade AI platform that provides access to leading AI models from OpenAI, Anthropic, Google, Amazon, and more through a unified, secure, and scalable infrastructure. The SAP AI Core provider for the AI SDK enables seamless integration with enterprise AI capabilities while offering unique advantages:

-   **Multi-Model Access**: Support for 40+ models including GPT-4, Claude, Gemini, and Amazon Nova
-   **OAuth Integration**: Automatic authentication handling with SAP BTP
-   **Cost Management**: Enterprise billing and usage tracking through SAP BTP
-   **High Availability**: Enterprise-grade infrastructure with SLA guarantees
-   **Hybrid Deployment**: Support for both cloud and on-premise deployments
-   **Tool Calling**: Full function calling capabilities for compatible models
-   **Multi-modal Support**: Text and image inputs for compatible models

Learn more about SAP AI Core's capabilities in the [SAP AI Core Documentation](https://help.sap.com/docs/ai-core).

## [Setup](#setup)

The SAP AI Core provider is available in the `@mymediset/sap-ai-provider` module. You can install it with:

pnpm

npm

yarn

bun

pnpm add @mymediset/sap-ai-provider

## [Provider Instance](#provider-instance)

To create an SAP AI Core provider instance, use the `createSAPAIProvider` function:

```typescript
import { createSAPAIProvider } from '@mymediset/sap-ai-provider';


const sapai = await createSAPAIProvider({
  serviceKey: 'YOUR_SAP_AI_CORE_SERVICE_KEY',
});
```

You can obtain your SAP AI Core service key from your SAP BTP Cockpit by creating a service key for your AI Core instance.

## [Language Models](#language-models)

You can create SAP AI Core models using the provider instance and model name:

```typescript
// OpenAI models
const gpt4Model = sapai('gpt-4o');


// Anthropic models
const claudeModel = sapai('anthropic--claude-3-sonnet');


// Google models
const geminiModel = sapai('gemini-1.5-pro');


// Amazon models
const novaModel = sapai('amazon--nova-pro');
```

## [Supported Models](#supported-models)

The provider supports a wide range of models available in your SAP AI Core deployment:

### [OpenAI Models](#openai-models)

-   `gpt-4`, `gpt-4o`, `gpt-4o-mini`
-   `o1`

### [Anthropic Models](#anthropic-models)

-   `anthropic--claude-3-haiku`, `anthropic--claude-3-sonnet`, `anthropic--claude-3-opus`
-   `anthropic--claude-3.5-sonnet`

### [Google Models](#google-models)

-   `gemini-1.5-pro`, `gemini-1.5-flash`
-   `gemini-2.0-pro`, `gemini-2.0-flash`

### [Amazon Models](#amazon-models)

-   `amazon--nova-premier`, `amazon--nova-pro`, `amazon--nova-lite`, `amazon--nova-micro`

### [Other Models](#other-models)

-   `mistralai--mistral-large-instruct`
-   `meta--llama3-70b-instruct`, `meta--llama3.1-70b-instruct`

Note: Model availability may vary based on your SAP AI Core subscription and region. Some models may require additional configuration or permissions.

## [Examples](#examples)

Here are examples of using SAP AI Core with the AI SDK:

### [generateText](#generatetext)

```typescript
import { createSAPAIProvider } from '@mymediset/sap-ai-provider';
import { generateText } from 'ai';


const sapai = await createSAPAIProvider({
  serviceKey: process.env.SAP_AI_SERVICE_KEY,
});


const { text } = await generateText({
  model: sapai('gpt-4o'),
  prompt: 'What are the benefits of enterprise AI platforms?',
});


console.log(text);
```

### [streamText](#streamtext)

```typescript
import { createSAPAIProvider } from '@mymediset/sap-ai-provider';
import { streamText } from 'ai';


const sapai = await createSAPAIProvider({
  serviceKey: process.env.SAP_AI_SERVICE_KEY,
});


const result = streamText({
  model: sapai('anthropic--claude-3-sonnet'),
  prompt: 'Write a short story about AI.',
});


for await (const textPart of result.textStream) {
  console.log(textPart);
}
```

### [Tool Calling](#tool-calling)

```typescript
import { createSAPAIProvider } from '@mymediset/sap-ai-provider';
import { generateText, tool } from 'ai';
import { z } from 'zod';


const sapai = await createSAPAIProvider({
  serviceKey: process.env.SAP_AI_SERVICE_KEY,
});


const result = await generateText({
  model: sapai('gpt-4o'),
  prompt: 'What is the current status of our inventory system?',
  tools: {
    checkInventory: tool({
      description: 'Check current inventory levels',
      inputSchema: z.object({
        item: z.string().describe('Item to check'),
        location: z.string().describe('Warehouse location'),
      }),
      execute: async ({ item, location }) => {
        // Your inventory system integration
        return { item, location, quantity: 150, status: 'In Stock' };
      },
    }),
  },
});


console.log(result.text);
```

### [Multi-modal Input](#multi-modal-input)

```typescript
import { createSAPAIProvider } from '@mymediset/sap-ai-provider';
import { generateText } from 'ai';


const sapai = await createSAPAIProvider({
  serviceKey: process.env.SAP_AI_SERVICE_KEY,
});


const result = await generateText({
  model: sapai('gpt-4o'),
  messages: [
    {
      role: 'user',
      content: [
        { type: 'text', text: 'Analyze this business process diagram.' },
        {
          type: 'image',
          image: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...',
        },
      ],
    },
  ],
});


console.log(result.text);
```

## [Configuration](#configuration)

### [Provider Settings](#provider-settings)

```typescript
interface SAPAIProviderSettings {
  serviceKey?: string; // SAP AI Core service key JSON
  token?: string; // Direct access token (alternative to serviceKey)
  baseURL?: string; // Custom base URL for API calls
}
```

### [Model Settings](#model-settings)

```typescript
interface SAPAIModelSettings {
  modelParams?: {
    maxTokens?: number; // Maximum tokens to generate
    temperature?: number; // Sampling temperature (0-2)
    topP?: number; // Nucleus sampling parameter
    frequencyPenalty?: number; // Frequency penalty (-2 to 2)
    presencePenalty?: number; // Presence penalty (-2 to 2)
  };
  safePrompt?: boolean; // Enable safe prompt filtering
  structuredOutputs?: boolean; // Enable structured outputs
}
```

## [Environment Variables](#environment-variables)

### [Required](#required)

Your SAP AI Core service key:

```bash
SAP_AI_SERVICE_KEY='{"serviceurls":{"AI_API_URL":"..."},"clientid":"...","clientsecret":"..."}'
```

### [Optional](#optional)

Direct access token (alternative to service key):

```bash
SAP_AI_TOKEN='your-access-token'
```

Custom base URL:

```bash
SAP_AI_BASE_URL='https://api.ai.prod.eu-central-1.aws.ml.hana.ondemand.com'
```

## [Enterprise Features](#enterprise-features)

SAP AI Core offers several enterprise-grade features:

-   **Multi-Tenant Architecture**: Isolated environments for different business units
-   **Cost Allocation**: Detailed usage tracking and cost center allocation
-   **Custom Models**: Deploy and manage your own fine-tuned models
-   **Hybrid Deployment**: Support for both cloud and on-premise installations
-   **Integration Ready**: Native integration with SAP S/4HANA, SuccessFactors, and other SAP solutions

For more information about these features and advanced configuration options, visit the [SAP AI Core Documentation](https://help.sap.com/docs/ai-core).

## [Additional Resources](#additional-resources)

-   [SAP AI Provider Repository](https://github.com/BITASIA/sap-ai-provider)
-   [SAP AI Core Documentation](https://help.sap.com/docs/ai-core)
-   [SAP BTP Documentation](https://help.sap.com/docs/btp)
-   [SAP Community](https://community.sap.com/t5/c-khhcw49343/SAP+AI+Core/pd-p/73555000100800003283)
-   [SAP AI Core Service Guide](https://help.sap.com/docs/sap-ai-core/sap-ai-core-service-guide)

[Previous

Aihubmix

](aihubmix.html)

[Next

Crosshatch

](crosshatch.html)

On this page

[SAP AI Core](#sap-ai-core)

[Important Note](#important-note)

[Setup](#setup)

[Provider Instance](#provider-instance)

[Language Models](#language-models)

[Supported Models](#supported-models)

[OpenAI Models](#openai-models)

[Anthropic Models](#anthropic-models)

[Google Models](#google-models)

[Amazon Models](#amazon-models)

[Other Models](#other-models)

[Examples](#examples)

[generateText](#generatetext)

[streamText](#streamtext)

[Tool Calling](#tool-calling)

[Multi-modal Input](#multi-modal-input)

[Configuration](#configuration)

[Provider Settings](#provider-settings)

[Model Settings](#model-settings)

[Environment Variables](#environment-variables)

[Required](#required)

[Optional](#optional)

[Enterprise Features](#enterprise-features)

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