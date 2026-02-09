Community Providers: Crosshatch

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

[Community Providers](../community-providers.html)Crosshatch

# [Crosshatch Provider](#crosshatch-provider)

This community provider is not yet compatible with AI SDK 5. Please wait for the provider to be updated or consider using an [AI SDK 5 compatible provider](../ai-sdk-providers.html).

The [Crosshatch](https://crosshatch.io) provider supports secure inference from popular language models with permissioned access to data users share, giving responses personalized with complete user context.

It creates language model objects that can be used with the `generateText`, `streamText`, `generateObject` and `streamObject` functions.

## [Setup](#setup)

The Crosshatch provider is available via the `@crosshatch/ai-provider` module. You can install it with:

pnpm

npm

yarn

bun

pnpm add @crosshatch/ai-provider

The [Crosshatch](https://crosshatch.io/) provider supports all of their available models such as OpenAI's GPT and Anthropic's Claude. This provider also supports the querying interface for controlling Crosshatch's custom data integration behaviors. This provider wraps the existing underlying providers ([@ai-sdk/openai](../ai-sdk-providers/openai.html), [@ai-sdk/anthropic](../ai-sdk-providers/openai.html).

### [Credentials](#credentials)

The Crosshatch provider is authenticated by user-specific tokens, enabling permissioned access to personalized inference.

You can obtain synthetic and test user tokens from the [your Crosshatch developer dashboard](https://platform.crosshatch.io/).

Production user tokens are provisioned and accessed with the [Link SDK](https://www.npmjs.com/package/@crosshatch/link) using your Crosshatch developer client id.

## [Provider Instance](#provider-instance)

To create a Crosshatch provider instance, use the `createCrosshatch` function:

```ts
import createCrosshatch from '@crosshatch/ai-provider';
```

## [Language Models](#language-models)

You can create [Crosshatch models](https://docs.crosshatch.io/endpoints/ai#supported-model-providers) using a provider instance.

```ts
import { createCrosshatch } from '@crosshatch/ai-provider';
const crosshatch = createCrosshatch();
```

To create a model instance, call the provider instance and specify the model you would like to use in the first argument. In the second argument, specify the user auth token, desired context, and model arguments. You can use Crosshatch to get generated text based on permissioned user context and your favorite language model.

### [Example: Generate Text with Context](#example-generate-text-with-context)

This example uses `gpt-4o-mini` to generate text.

```ts
import { generateText } from 'ai';
import createCrosshatch from '@crosshatch/ai-provider':
const crosshatch = createCrosshatch();


const { text } = await generateText({
  model: crosshatch.languageModel("gpt-4o-mini", {
    token: 'YOUR_ACCESS_TOKEN',
    replace: {
      restaurants: {
        select: ["entity_name", "entity_city", "entity_region"],
        from: "personalTimeline",
        where: [
          { field: "event", op: "=", value: "confirmed" },
          { field: "entity_subtype2", op: "=", value: "RESTAURANTS" }
        ],
        groupby: ["entity_name", "entity_city", "entity_region"],
        orderby: "count DESC",
        limit: 5
      }
    }
  }),
  system: `The user recently ate at these restaurants: {restaurants}`,
  messages: [{role: "user", content: "Where should I stay in Paris?"}]
});
```

### [Example: Recommend Items based on Context](#example-recommend-items-based-on-context)

Use crosshatch to re-rank items based on recent user purchases.

```ts
import { streamObject } from 'ai';
import createCrosshatch from `@crosshatch/ai-provider`
const crosshatch = createCrosshatch();


const itemSummaries = [...]; // list of items
const ids = (itemSummaries?.map(({ itemId }) => itemId) ?? []) as string[];


const { elementStream } = streamObject({
  output: "array",
  mode: "json",
  model: crosshatch.languageModel("gpt-4o-mini", {
    token,
    replace: {
      "orders": {
        select: ["originalTimestamp", "entity_name", "order_total", "order_summary"],
        from: "personalTimeline",
        where: [{ field: "event", op: "=", value: "purchased" }],
        orderBy: [{ field: "originalTimestamp", dir: "desc" }],
        limit: 5,
      },
    },
  }),
  system: `Rerank the following items based on alignment with users recent purchases {orders}`,
  messages: [{role: "user", content: "Heres a list of item: ${JSON.stringify(itemSummaries)"},],
  schema: jsonSchema<{ id: string; reason: string }>({
    type: "object",
    properties: {
      id: { type: "string", enum: ids },
      reason: { type: "string", description: "Explain your ranking." },
    },
  }),
})
```

[Previous

SAP AI Core

](sap-ai.html)

[Next

Requesty

](requesty.html)

On this page

[Crosshatch Provider](#crosshatch-provider)

[Setup](#setup)

[Credentials](#credentials)

[Provider Instance](#provider-instance)

[Language Models](#language-models)

[Example: Generate Text with Context](#example-generate-text-with-context)

[Example: Recommend Items based on Context](#example-recommend-items-based-on-context)

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