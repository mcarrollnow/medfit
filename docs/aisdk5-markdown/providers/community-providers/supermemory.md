Community Providers: Supermemory

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

[Community Providers](../community-providers.html)Supermemory

# [Supermemory](#supermemory)

[Supermemory](https://supermemory.ai) is a long-term memory platform that adds persistent, self-growing memory to your AI applications. The Supermemory provider for the AI SDK enables you to build AI applications with memory that works like the human brain:

-   **Persistent Memory**: Long-term storage that grows with each interaction
-   **Semantic Search**: Find relevant memories using natural language queries
-   **Automatic Memory Management**: AI automatically saves and retrieves relevant information
-   **Easy Integration**: Simple setup with existing AI SDK applications
-   **Memory Router**: Direct integration with language model providers
-   **Free Tier Available**: Get started with a free API key

Learn more about Supermemory's capabilities in the [Supermemory Documentation](https://supermemory.ai/docs/ai-sdk/overview).

## [Setup](#setup)

The Supermemory provider is available in the `@supermemory/tools` module. You can install it with:

pnpm

npm

yarn

bun

pnpm add @supermemory/tools

## [Provider Instance](#provider-instance)

You can obtain your Supermemory API key for free at [https://console.supermemory.ai](https://console.supermemory.ai).

There are two ways to integrate Supermemory with your AI applications:

**1\. Using Supermemory Tools**

Import and use Supermemory tools with your existing AI SDK setup:

```typescript
import { supermemoryTools } from '@supermemory/tools/ai-sdk';
```

**2\. Using the Memory Router**

Use the Memory Router for direct integration with language model providers:

```typescript
import { createAnthropic } from '@ai-sdk/anthropic';


const supermemoryRouter = createAnthropic({
  baseUrl: 'https://api.supermemory.ai/v3/https://api.anthropic.com/v1',
  apiKey: 'your-provider-api-key',
  headers: {
    'x-supermemory-api-key': 'supermemory-api-key',
    'x-sm-conversation-id': 'conversation-id',
  },
});
```

## [Examples](#examples)

Here are examples of using Supermemory with the AI SDK:

### [`generateText` with Tools](#generatetext-with-tools)

```javascript
import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { supermemoryTools } from '@supermemory/tools/ai-sdk';


const openai = createOpenAI({
  apiKey: 'YOUR_OPENAI_KEY',
});


const { text } = await generateText({
  model: openai('gpt-4-turbo'),
  prompt: 'Remember that my name is Alice',
  tools: supermemoryTools('YOUR_SUPERMEMORY_KEY'),
});


console.log(text);
```

### [`streamText` with Automatic Memory](#streamtext-with-automatic-memory)

```javascript
import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { supermemoryTools } from '@supermemory/tools/ai-sdk';


const openai = createOpenAI({
  apiKey: 'YOUR_OPENAI_KEY',
});


const result = streamText({
  model: openai('gpt-4'),
  prompt: 'What are my dietary preferences?',
  tools: supermemoryTools('YOUR_SUPERMEMORY_KEY'),
});


// The AI will automatically call searchMemories tool
// Example tool call:
// searchMemories({ informationToGet: "dietary preferences and restrictions" })
// OR
// addMemory({ memory: "User is allergic to peanuts" })


for await (const chunk of result.textStream) {
  console.log(chunk);
}
```

### [Using Memory Router](#using-memory-router)

```javascript
import { streamText } from 'ai';
import { createAnthropic } from '@ai-sdk/anthropic';


const supermemoryRouter = createAnthropic({
  baseUrl: 'https://api.supermemory.ai/v3/https://api.anthropic.com/v1',
  apiKey: 'your-provider-api-key',
  headers: {
    'x-supermemory-api-key': 'supermemory-api-key',
    'x-sm-conversation-id': 'conversation-id',
  },
});


const result = streamText({
  model: supermemoryRouter('claude-3-sonnet'),
  messages: [
    { role: 'user', content: 'Hello! Remember that I love TypeScript.' },
  ],
});
```

For more information about these features and advanced configuration options, visit the [Supermemory Documentation](https://supermemory.ai/docs/).

## [Additional Resources](#additional-resources)

-   [Supermemory Documentation](https://supermemory.ai/docs/?ref=ai-sdk)
-   [AI SDK Integration Cookbook](https://supermemory.ai/docs/cookbook/ai-sdk-integration)
-   [Supermemory Console](https://console.supermemory.ai)
-   [Memory Engine Blog Post](https://supermemory.ai/blog/memory-engine/)

[Previous

Letta

](letta.html)

[Next

React Native Apple

](react-native-apple.html)

On this page

[Supermemory](#supermemory)

[Setup](#setup)

[Provider Instance](#provider-instance)

[Examples](#examples)

[generateText with Tools](#generatetext-with-tools)

[streamText with Automatic Memory](#streamtext-with-automatic-memory)

[Using Memory Router](#using-memory-router)

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