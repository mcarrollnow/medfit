Community Providers: FriendliAI

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

[Community Providers](../community-providers.html)FriendliAI

# [FriendliAI Provider](#friendliai-provider)

The [FriendliAI](https://friendli.ai/) provider supports both open-source LLMs via [Friendli Serverless Endpoints](https://friendli.ai/products/serverless-endpoints) and custom models via [Dedicated Endpoints](https://friendli.ai/products/dedicated-endpoints).

It creates language model objects that can be used with the `generateText`, `streamText`, `generateObject`, and `streamObject` functions.

## [Setup](#setup)

The Friendli provider is available via the `@friendliai/ai-provider` module. You can install it with:

pnpm

npm

yarn

bun

pnpm add @friendliai/ai-provider

### [Credentials](#credentials)

The tokens required for model usage can be obtained from the [Friendli suite](https://suite.friendli.ai/).

To use the provider, you need to set the `FRIENDLI_TOKEN` environment variable with your personal access token.

```bash
export FRIENDLI_TOKEN="YOUR_FRIENDLI_TOKEN"
```

Check the [FriendliAI documentation](https://friendli.ai/docs/guides/personal_access_tokens) for more information.

## [Provider Instance](#provider-instance)

You can import the default provider instance `friendliai` from `@friendliai/ai-provider`:

```ts
import { friendli } from '@friendliai/ai-provider';
```

## [Language Models](#language-models)

You can create [FriendliAI models](https://friendli.ai/docs/guides/serverless_endpoints/text_generation#model-supports) using a provider instance. The first argument is the model id, e.g. `meta-llama-3.1-8b-instruct`.

```ts
const model = friendli('meta-llama-3.1-8b-instruct');
```

### [Example: Generating text](#example-generating-text)

You can use FriendliAI language models to generate text with the `generateText` function:

```ts
import { friendli } from '@friendliai/ai-provider';
import { generateText } from 'ai';


const { text } = await generateText({
  model: friendli('meta-llama-3.1-8b-instruct'),
  prompt: 'What is the meaning of life?',
});


console.log(text);
```

### [Example: Reasoning](#example-reasoning)

FriendliAI exposes the thinking of `deepseek-r1` in the generated text using the `<think>` tag. You can use the `extractReasoningMiddleware` to extract this reasoning and expose it as a `reasoning` property on the result:

```ts
import { friendli } from '@friendliai/ai-provider';
import { wrapLanguageModel, extractReasoningMiddleware } from 'ai';


const enhancedModel = wrapLanguageModel({
  model: friendli('deepseek-r1'),
  middleware: extractReasoningMiddleware({ tagName: 'think' }),
});


const { text, reasoning } = await generateText({
  model: enhancedModel,
  prompt: 'Explain quantum entanglement.',
});
```

### [Example: Structured Outputs (regex)](#example-structured-outputs-regex)

The regex option allows you to control the format of your LLM's output by specifying patterns. This can be particularly useful when you need:

-   Specific formats like CSV
-   Restrict output to specific characters such as Korean or Japanese

This feature is available with both `generateText` and `streamText` functions.

For a deeper understanding of how to effectively use regex patterns with LLMs, check out our detailed guide in the [Structured Output LLM Agents](https://friendli.ai/blog/structured-output-llm-agents) blog post.

```ts
import { friendli } from '@friendliai/ai-provider';
import { generateText } from 'ai';


const { text } = await generateText({
  model: friendli('meta-llama-3.1-8b-instruct', {
    regex: new RegExp('[\n ,.?!0-9\uac00-\ud7af]*'),
  }),
  prompt: 'Who is the first king of the Joseon Dynasty?',
});


console.log(text);
```

### [Example: Structured Outputs (json)](#example-structured-outputs-json)

Structured outputs are a form of guided generation. The JSON schema is used as a grammar and the outputs will always conform to the schema.

```ts
import { friendli } from '@friendliai/ai-provider';
import { generateObject } from 'ai';
import { z } from 'zod';


const { object } = await generateObject({
  model: friendli('meta-llama-3.3-70b-instruct'),
  schemaName: 'CalendarEvent',
  schema: z.object({
    name: z.string(),
    date: z.string(),
    participants: z.array(z.string()),
  }),
  system: 'Extract the event information.',
  prompt: 'Alice and Bob are going to a science fair on Friday.',
});


console.log(object);
```

### [Example: Using built-in tools](#example-using-built-in-tools)

Built-in tools are currently in beta.

If you use `@friendliai/ai-provider`, you can use the [built-in tools](https://friendli.ai/docs/guides/serverless_endpoints/tools/built_in_tools) via the `tools` option.

Built-in tools allow models to use tools to generate better answers. For example, a `web:search` tool can provide up-to-date answers to current questions.

```ts
import { friendli } from '@friendliai/ai-provider';
import { streamText } from 'ai';


const result = streamText({
  model: friendli('meta-llama-3.3-70b-instruct', {
    tools: [{ type: 'web:search' }, { type: 'math:calculator' }],
  }),
  prompt:
    'Find the current USD to CAD exchange rate and calculate how much $5,000 USD would be in Canadian dollars.',
});


for await (const textPart of result.textStream) {
  console.log(textPart);
}
```

### [Example: Generating text with Dedicated Endpoints](#example-generating-text-with-dedicated-endpoints)

To use a custom model via a dedicated endpoint, you can use the `friendli` instance with the endpoint id, e.g. `zbimjgovmlcb`

```ts
import { friendli } from '@friendliai/ai-provider';
import { generateText } from 'ai';


const { text } = await generateText({
  model: friendli('YOUR_ENDPOINT_ID'),
  prompt: 'What is the meaning of life?',
});


console.log(text);
```

You can use the code below to force requests to dedicated endpoints. By default, they are auto-detected.

```ts
import { friendli } from '@friendliai/ai-provider';
import { generateText } from 'ai';


const { text } = await generateText({
  model: friendli("YOUR_ENDPOINT_ID", {
    endpoint: "dedicated",
  });
  prompt: 'What is the meaning of life?',
});


console.log(text);
```

FriendliAI language models can also be used in the `streamText`, `generateObject`, and `streamObject` functions. (see [AI SDK Core](../../docs/ai-sdk-core.html)).

### [Model Capabilities](#model-capabilities)

| Model | Image Input | Object Generation | Tool Usage | Tool Streaming |
| --- | --- | --- | --- | --- |
| `deepseek-r1` |  |  |  |  |
| `meta-llama-3.3-70b-instruct` |  |  |  |  |
| `meta-llama-3.1-8b-instruct` |  |  |  |  |

To access [more models](https://friendli.ai/models), visit the [Friendli Dedicated Endpoints documentation](https://friendli.ai/docs/guides/dedicated_endpoints/quickstart) to deploy your custom models.

### [OpenAI Compatibility](#openai-compatibility)

You can also use `@ai-sdk/openai` as the APIs are OpenAI-compatible.

```ts
import { createOpenAI } from '@ai-sdk/openai';


const friendli = createOpenAI({
  baseURL: 'https://api.friendli.ai/serverless/v1',
  apiKey: process.env.FRIENDLI_TOKEN,
});
```

If you are using dedicated endpoints

```ts
import { createOpenAI } from '@ai-sdk/openai';


const friendli = createOpenAI({
  baseURL: 'https://api.friendli.ai/dedicated/v1',
  apiKey: process.env.FRIENDLI_TOKEN,
});
```

[Previous

A2A

](a2a.html)

[Next

Portkey

](portkey.html)

On this page

[FriendliAI Provider](#friendliai-provider)

[Setup](#setup)

[Credentials](#credentials)

[Provider Instance](#provider-instance)

[Language Models](#language-models)

[Example: Generating text](#example-generating-text)

[Example: Reasoning](#example-reasoning)

[Example: Structured Outputs (regex)](#example-structured-outputs-regex)

[Example: Structured Outputs (json)](#example-structured-outputs-json)

[Example: Using built-in tools](#example-using-built-in-tools)

[Example: Generating text with Dedicated Endpoints](#example-generating-text-with-dedicated-endpoints)

[Model Capabilities](#model-capabilities)

[OpenAI Compatibility](#openai-compatibility)

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