Community Providers: Mem0

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

[Community Providers](../community-providers.html)Mem0

# [Mem0 Provider](#mem0-provider)

The [Mem0 Provider](https://github.com/mem0ai/mem0/tree/main/vercel-ai-sdk) is a library developed by [**Mem0**](https://mem0.ai) to integrate with the AI SDK. This library brings enhanced AI interaction capabilities to your applications by introducing persistent memory functionality.

🎉 Exciting news! Mem0 AI SDK now supports **Tools Call**.

## [Setup](#setup)

The Mem0 provider is available in the `@mem0/vercel-ai-provider` module. You can install it with:

pnpm

npm

yarn

bun

pnpm add @mem0/vercel-ai-provider

## [Provider Instance](#provider-instance)

First, get your **Mem0 API Key** from the [Mem0 Dashboard](https://app.mem0.ai/dashboard/api-keys).

Then initialize the `Mem0 Client` in your application:

```ts
import { createMem0 } from '@mem0/vercel-ai-provider';


const mem0 = createMem0({
  provider: 'openai',
  mem0ApiKey: 'm0-xxx',
  apiKey: 'provider-api-key',
  config: {
    // Configure the LLM Provider here
  },
  // Optional Mem0 Global Config
  mem0Config: {
    user_id: 'mem0-user-id',
    enable_graph: true,
  },
});
```

The `openai` provider is set as default. Consider using `MEM0_API_KEY` and `OPENAI_API_KEY` as environment variables for security.

The `mem0Config` is optional. It is used to set the global config for the Mem0 Client (eg. `user_id`, `agent_id`, `app_id`, `run_id`, `org_id`, `project_id` etc).

-   Add Memories to Enhance Context:

```ts
import { LanguageModelV2Prompt } from '@ai-sdk/provider';
import { addMemories } from '@mem0/vercel-ai-provider';


const messages: LanguageModelV2Prompt = [
  { role: 'user', content: [{ type: 'text', text: 'I love red cars.' }] },
];


await addMemories(messages, { user_id: 'borat' });
```

## [Features](#features)

### [Adding and Retrieving Memories](#adding-and-retrieving-memories)

-   `retrieveMemories()`: Retrieves memory context for prompts.
-   `getMemories()`: Get memories from your profile in array format.
-   `addMemories()`: Adds user memories to enhance contextual responses.

```ts
await addMemories(messages, {
  user_id: 'borat',
  mem0ApiKey: 'm0-xxx',
});
await retrieveMemories(prompt, {
  user_id: 'borat',
  mem0ApiKey: 'm0-xxx',
});
await getMemories(prompt, {
  user_id: 'borat',
  mem0ApiKey: 'm0-xxx',
});
```

For standalone features, such as `addMemories`, `retrieveMemories`, and `getMemories`, you must either set `MEM0_API_KEY` as an environment variable or pass it directly in the function call.

`getMemories` will return raw memories in the form of an array of objects, while `retrieveMemories` will return a response in string format with a system prompt ingested with the retrieved memories.

### [Generate Text with Memory Context](#generate-text-with-memory-context)

You can use language models from **OpenAI**, **Anthropic**, **Cohere**, and **Groq** to generate text with the `generateText` function:

```ts
import { generateText } from 'ai';
import { createMem0 } from '@mem0/vercel-ai-provider';


const mem0 = createMem0();


const { text } = await generateText({
  model: mem0('gpt-4.1', { user_id: 'borat' }),
  prompt: 'Suggest me a good car to buy!',
});
```

### [Structured Message Format with Memory](#structured-message-format-with-memory)

```ts
import { generateText } from 'ai';
import { createMem0 } from '@mem0/vercel-ai-provider';


const mem0 = createMem0();


const { text } = await generateText({
  model: mem0('gpt-4.1', { user_id: 'borat' }),
  messages: [
    {
      role: 'user',
      content: [
        { type: 'text', text: 'Suggest me a good car to buy.' },
        { type: 'text', text: 'Why is it better than the other cars for me?' },
      ],
    },
  ],
});
```

### [Streaming Responses with Memory Context](#streaming-responses-with-memory-context)

```ts
import { streamText } from 'ai';
import { createMem0 } from '@mem0/vercel-ai-provider';


const mem0 = createMem0();


const { textStream } = streamText({
  model: mem0('gpt-4.1', {
    user_id: 'borat',
  }),
  prompt:
    'Suggest me a good car to buy! Why is it better than the other cars for me? Give options for every price range.',
});


for await (const textPart of textStream) {
  process.stdout.write(textPart);
}
```

### [Generate Responses with Tools Call](#generate-responses-with-tools-call)

```ts
import { generateText } from 'ai';
import { createMem0 } from '@mem0/vercel-ai-provider';
import { z } from 'zod';


const mem0 = createMem0({
  provider: 'anthropic',
  apiKey: 'anthropic-api-key',
  mem0Config: {
    // Global User ID
    user_id: 'borat',
  },
});


const prompt = 'What the temperature in the city that I live in?';


const result = await generateText({
  model: mem0('claude-3-5-sonnet-20240620'),
  tools: {
    weather: tool({
      description: 'Get the weather in a location',
      parameters: z.object({
        location: z.string().describe('The location to get the weather for'),
      }),
      execute: async ({ location }) => ({
        location,
        temperature: 72 + Math.floor(Math.random() * 21) - 10,
      }),
    }),
  },
  prompt: prompt,
});


console.log(result);
```

### [Get sources from memory](#get-sources-from-memory)

```ts
const { text, sources } = await generateText({
  model: mem0('gpt-4.1'),
  prompt: 'Suggest me a good car to buy!',
});


console.log(sources);
```

This same functionality is available in the `streamText` function.

## [Supported LLM Providers](#supported-llm-providers)

The Mem0 provider supports the following LLM providers:

| Provider | Configuration Value |
| --- | --- |
| OpenAI | `openai` |
| Anthropic | `anthropic` |
| Google | `google` |
| Groq | `groq` |
| Cohere | `cohere` |

## [Best Practices](#best-practices)

-   **User Identification**: Use a unique `user_id` for consistent memory retrieval.
-   **Memory Cleanup**: Regularly clean up unused memory data.

We also have support for `agent_id`, `app_id`, and `run_id`. Refer [Docs](https://docs.mem0.ai/api-reference/memory/add-memories).

## [Help](#help)

-   For more details on Vercel AI SDK, visit the [Vercel AI SDK documentation](../../docs/introduction.html).
-   For Mem0 documentation, refer to the [Mem0 Platform](https://app.mem0.ai/).
-   If you need further assistance, please feel free to reach out to us through following methods:

## [References](#references)

-   [Mem0 AI SDK Docs](https://docs.mem0.ai/integrations/vercel-ai-sdk#getting-started)
-   [Mem0 documentation](https://docs.mem0.ai)

[Previous

Jina AI

](jina-ai.html)

[Next

Letta

](letta.html)

On this page

[Mem0 Provider](#mem0-provider)

[Setup](#setup)

[Provider Instance](#provider-instance)

[Features](#features)

[Adding and Retrieving Memories](#adding-and-retrieving-memories)

[Generate Text with Memory Context](#generate-text-with-memory-context)

[Structured Message Format with Memory](#structured-message-format-with-memory)

[Streaming Responses with Memory Context](#streaming-responses-with-memory-context)

[Generate Responses with Tools Call](#generate-responses-with-tools-call)

[Get sources from memory](#get-sources-from-memory)

[Supported LLM Providers](#supported-llm-providers)

[Best Practices](#best-practices)

[Help](#help)

[References](#references)

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