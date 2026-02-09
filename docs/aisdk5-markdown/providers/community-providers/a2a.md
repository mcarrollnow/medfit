Community Providers: A2A

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

[Community Providers](../community-providers.html)A2A

# [A2A](#a2a)

The [dracoblue/a2a-ai-provider](https://github.com/dracoblue/a2a-ai-provider) is a community provider enables the use of [A2A protocol](https://a2aproject.github.io/A2A/specification/) compliant agents with the [AI SDK](../../index.html). This allows developers to stream, send, and receive text, tool calls, and artifacts using a standardized JSON-RPC interface over HTTP.

The `a2a-ai-provider` package is under constant development.

The provider supports (by using the official a2a-js sdk [@a2a-js/sdk](https://github.com/a2aproject/a2a-js)):

-   **Streaming Text Responses** via `sendSubscribe` and SSE
-   **File & Artifact Uploads** to the A2A server
-   **Multi-modal Messaging** with support for text and file parts
-   **Full JSON-RPC 2.0 Compliance** for A2A-compatible LLM agents

Learn more about A2A at the [A2A Project Site](https://a2aproject.github.io/A2A/).

## [Setup](#setup)

Install the `a2a-ai-provider` from npm:

pnpm

npm

yarn

bun

pnpm add a2a-ai-provider

## [Provider Instance](#provider-instance)

To create a provider instance for an A2A server:

```ts
import { a2a } from 'a2a-ai-provider';
```

## [Examples](#examples)

You can now use the provider with the AI SDK like this:

### [`generateText`](#generatetext)

```ts
import { a2a } from 'a2a-ai-provider';
import { generateText } from 'ai';


const result = await generateText({
  model: a2a('https://your-a2a-server.example.com'),
  prompt: 'What is love?',
});


console.log(result.text);
```

### [`streamText`](#streamtext)

```ts
import { a2a } from 'a2a-ai-provider';
import { streamText } from 'ai';


const chatId = 'unique-chat-id'; // for each conversation to keep history in a2a server


const streamResult = streamText({
  model: a2a('https://your-a2a-server.example.com'),
  prompt: 'What is love?',
  providerOptions: {
    a2a: {
      contextId: chatId,
    },
  },
});


await streamResult.consumeStream();


console.log(await streamResult.content);
```

## [Features](#features)

-   **Text Streaming**: Streams token-by-token output from the A2A server
-   **File Uploads**: Send files as part of your prompts
-   **Artifact Handling**: Receives file artifacts in streamed or final results

## [Additional Resources](#additional-resources)

-   [GitHub Repository](https://github.com/DracoBlue/a2a-ai-provider)
-   [A2A Protocol Spec](https://a2aproject.github.io/A2A/specification/)
-   License: MIT

[Previous

Ollama

](ollama.html)

[Next

FriendliAI

](friendliai.html)

On this page

[A2A](#a2a)

[Setup](#setup)

[Provider Instance](#provider-instance)

[Examples](#examples)

[generateText](#generatetext)

[streamText](#streamtext)

[Features](#features)

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