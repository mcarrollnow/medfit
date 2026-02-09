Community Providers: Cloudflare Workers AI

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

[Community Providers](../community-providers.html)Cloudflare Workers AI

# [Cloudflare Workers AI](#cloudflare-workers-ai)

[workers-ai-provider](https://github.com/cloudflare/ai/tree/main/packages/workers-ai-provider) is a community provider that allows you to use Cloudflare's [Workers AI](https://ai.cloudflare.com/) models with the AI SDK.

## [Setup](#setup)

The Cloudflare Workers AI provider is available in the `workers-ai-provider` module. You can install it with:

pnpm

npm

yarn

bun

pnpm add workers-ai-provider

Then, setup an AI binding in your Cloudflare Workers project `wrangler.toml` file:

```bash
[ai]
binding = "AI"
```

## [Provider Instance](#provider-instance)

To create a `workersai` provider instance, use the `createWorkersAI` function, passing in the AI binding as an option:

```typescript
import { createWorkersAI } from 'workers-ai-provider';


const workersai = createWorkersAI({ binding: env.AI });
```

## [Language Models](#language-models)

To create a model instance, call the provider instance and specify the model you would like to use as the first argument. You can also pass additional settings in the second argument:

```typescript
import { createWorkersAI } from 'workers-ai-provider';


const workersai = createWorkersAI({ binding: env.AI });
const model = workersai('@cf/meta/llama-3.1-8b-instruct', {
  // additional settings
  safePrompt: true,
});
```

You can use the following optional settings to customize:

-   **safePrompt** *boolean*
    
    Whether to inject a safety prompt before all conversations. Defaults to `false`
    

### [Examples](#examples)

You can use Cloudflare Workers AI language models to generate text with the **`generateText`** or **`streamText`** function:

#### [`generateText`](#generatetext)

```typescript
import { createWorkersAI } from 'workers-ai-provider';
import { generateText } from 'ai';


type Env = {
  AI: Ai;
};


export default {
  async fetch(_: Request, env: Env) {
    const workersai = createWorkersAI({ binding: env.AI });
    const result = await generateText({
      model: workersai('@cf/meta/llama-2-7b-chat-int8'),
      prompt: 'Write a 50-word essay about hello world.',
    });


    return new Response(result.text);
  },
};
```

#### [`streamText`](#streamtext)

```typescript
import { createWorkersAI } from 'workers-ai-provider';
import { streamText } from 'ai';


type Env = {
  AI: Ai;
};


export default {
  async fetch(_: Request, env: Env) {
    const workersai = createWorkersAI({ binding: env.AI });
    const result = streamText({
      model: workersai('@cf/meta/llama-2-7b-chat-int8'),
      prompt: 'Write a 50-word essay about hello world.',
    });


    return result.toTextStreamResponse({
      headers: {
        // add these headers to ensure that the
        // response is chunked and streamed
        'Content-Type': 'text/x-unknown',
        'content-encoding': 'identity',
        'transfer-encoding': 'chunked',
      },
    });
  },
};
```

#### [`generateObject`](#generateobject)

Some Cloudflare Workers AI language models can also be used with the `generateObject` function:

```typescript
import { createWorkersAI } from 'workers-ai-provider';
import { generateObject } from 'ai';
import { z } from 'zod';


type Env = {
  AI: Ai;
};


export default {
  async fetch(_: Request, env: Env) {
    const workersai = createWorkersAI({ binding: env.AI });
    const result = await generateObject({
      model: workersai('@cf/meta/llama-3.1-8b-instruct'),
      prompt: 'Generate a Lasagna recipe',
      schema: z.object({
        recipe: z.object({
          ingredients: z.array(z.string()),
          description: z.string(),
        }),
      }),
    });


    return Response.json(result.object);
  },
};
```

[Previous

Automatic1111

](automatic1111.html)

[Next

Cloudflare AI Gateway

](cloudflare-ai-gateway.html)

On this page

[Cloudflare Workers AI](#cloudflare-workers-ai)

[Setup](#setup)

[Provider Instance](#provider-instance)

[Language Models](#language-models)

[Examples](#examples)

[generateText](#generatetext)

[streamText](#streamtext)

[generateObject](#generateobject)

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