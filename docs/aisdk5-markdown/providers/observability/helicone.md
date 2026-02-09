Observability Integrations: Helicone

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

[Axiom](axiom.html)

[Braintrust](braintrust.html)

[Helicone](helicone.html)

[Laminar](laminar.html)

[Langfuse](langfuse.html)

[LangSmith](langsmith.html)

[LangWatch](langwatch.html)

[Maxim](maxim.html)

[Patronus](patronus.html)

[Scorecard](scorecard.html)

[SigNoz](signoz.html)

[Traceloop](traceloop.html)

[Weave](weave.html)

[Observability Integrations](../observability.html)Helicone

# [Helicone Observability](#helicone-observability)

[Helicone](https://helicone.ai) is an open-source LLM observability platform that helps you monitor, analyze, and optimize your AI applications through a proxy-based approach, requiring minimal setup and zero additional dependencies.

## [Setup](#setup)

Setting up Helicone:

1.  Create a Helicone account at [helicone.ai](https://helicone.ai)
    
2.  Set your API key as an environment variable:
    
    ```bash
    HELICONE_API_KEY=your-helicone-api-key
    ```
    
3.  Update your model provider configuration to use Helicone's proxy:
    
    ```javascript
    import { createOpenAI } from '@ai-sdk/openai';
    
    
    const openai = createOpenAI({
      baseURL: 'https://oai.helicone.ai/v1',
      headers: {
        'Helicone-Auth': `Bearer ${process.env.HELICONE_API_KEY}`,
      },
    });
    
    
    // Use normally with AI SDK
    const response = await generateText({
      model: openai('gpt-4o-mini'),
      prompt: 'Hello world',
    });
    ```
    

That's it! Your requests are now being logged and monitored through Helicone.

[→ Learn more about getting started with Helicone on AI SDK](https://docs.helicone.ai/getting-started/integration-method/vercelai)

## [Integration Approach](#integration-approach)

While other observability solutions require OpenTelemetry instrumentation, Helicone uses a simple proxy approach:

Helicone Proxy (3 lines)

Typical OTEL Setup (simplified)

```javascript
const openai = createOpenAI({
  baseURL: "https://oai.helicone.ai/v1",
  headers: { "Helicone-Auth": `Bearer ${process.env.HELICONE_API_KEY}` },
});
```

**Characteristics of Helicone's Proxy Approach:**

-   No additional packages required
-   Compatible with JavaScript environments
-   Minimal code changes to existing implementations
-   Supports features such as caching and rate limiting

[→ Learn more about Helicone's proxy approach](https://docs.helicone.ai/references/proxy-vs-async)

## [Core Features](#core-features)

### [User Tracking](#user-tracking)

Monitor how individual users interact with your AI application:

```javascript
const response = await generateText({
  model: openai('gpt-4o-mini'),
  prompt: 'Hello world',
  headers: {
    'Helicone-User-Id': 'user@example.com',
  },
});
```

[→ Learn more about User Metrics](https://docs.helicone.ai/features/advanced-usage/user-metrics)

### [Custom Properties](#custom-properties)

Add structured metadata to filter and analyze requests:

```javascript
const response = await generateText({
  model: openai('gpt-4o-mini'),
  prompt: 'Translate this text to French',
  headers: {
    'Helicone-Property-Feature': 'translation',
    'Helicone-Property-Source': 'mobile-app',
    'Helicone-Property-Language': 'French',
  },
});
```

[→ Learn more about Custom Properties](https://docs.helicone.ai/features/advanced-usage/custom-properties)

### [Session Tracking](#session-tracking)

Group related requests into coherent conversations:

```javascript
const response = await generateText({
  model: openai('gpt-4o-mini'),
  prompt: 'Tell me more about that',
  headers: {
    'Helicone-Session-Id': 'convo-123',
    'Helicone-Session-Name': 'Travel Planning',
    'Helicone-Session-Path': '/chats/travel',
  },
});
```

[→ Learn more about Sessions](https://docs.helicone.ai/features/sessions)

## [Advanced Configuration](#advanced-configuration)

### [Request Caching](#request-caching)

Reduce costs by caching identical requests:

```javascript
const response = await generateText({
  model: openai('gpt-4o-mini'),
  prompt: 'What is the capital of France?',
  headers: {
    'Helicone-Cache-Enabled': 'true',
  },
});
```

[→ Learn more about Caching](https://docs.helicone.ai/features/advanced-usage/caching)

### [Rate Limiting](#rate-limiting)

Control usage by adding a rate limit policy:

```javascript
const response = await generateText({
  model: openai('gpt-4o-mini'),
  prompt: 'Generate creative content',
  headers: {
    // Allow 10,000 requests per hour
    'Helicone-RateLimit-Policy': '10000;w=3600',


    // Optional: limit by user
    'Helicone-User-Id': 'user@example.com',
  },
});
```

Format: `[quota];w=[time_window];u=[unit];s=[segment]` where:

-   `quota`: Maximum requests allowed in the time window
-   `w`: Time window in seconds (minimum 60s)
-   `u`: Optional unit - "request" (default) or "cents"
-   `s`: Optional segment - "user", custom property, or global (default)

[→ Learn more about Rate Limiting](https://docs.helicone.ai/features/advanced-usage/custom-rate-limits)

### [LLM Security](#llm-security)

Protect against prompt injection, jailbreaking, and other LLM-specific threats:

```javascript
const response = await generateText({
  model: openai('gpt-4o-mini'),
  prompt: userInput,
  headers: {
    // Basic protection (Prompt Guard model)
    'Helicone-LLM-Security-Enabled': 'true',


    // Optional: Advanced protection (Llama Guard model)
    'Helicone-LLM-Security-Advanced': 'true',
  },
});
```

Protects against multiple attack vectors in 8 languages with minimal latency. Advanced mode adds protection across 14 threat categories.

[→ Learn more about LLM Security](https://docs.helicone.ai/features/advanced-usage/llm-security)

## [Resources](#resources)

-   [Helicone Documentation](https://docs.helicone.ai)
-   [GitHub Repository](https://github.com/Helicone/helicone)
-   [Discord Community](https://discord.com/invite/2TkeWdXNPQ)

[Previous

Braintrust

](braintrust.html)

[Next

Laminar

](laminar.html)

On this page

[Helicone Observability](#helicone-observability)

[Setup](#setup)

[Integration Approach](#integration-approach)

[Core Features](#core-features)

[User Tracking](#user-tracking)

[Custom Properties](#custom-properties)

[Session Tracking](#session-tracking)

[Advanced Configuration](#advanced-configuration)

[Request Caching](#request-caching)

[Rate Limiting](#rate-limiting)

[LLM Security](#llm-security)

[Resources](#resources)

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