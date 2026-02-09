Community Providers: Sarvam

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

[Community Providers](../community-providers.html)Sarvam

# [Sarvam Provider](#sarvam-provider)

The Sarvam AI Provider is a library developed to integrate with the AI SDK. This library brings Speech to Text (STT) capabilities to your applications, allowing for seamless interaction with audio and text data.

## [Setup](#setup)

The Sarvam provider is available in the `sarvam-ai-provider` module. You can install it with:

pnpm

npm

yarn

bun

pnpm add sarvam-ai-provider

## [Provider Instance](#provider-instance)

First, get your **Sarvam API Key** from the [Sarvam Dashboard](https://dashboard.sarvam.ai/auth/signin).

Then initialize `Sarvam` in your application:

```ts
import { createSarvam } from 'sarvam-ai-provider';


const sarvam = createSarvam({
  headers: {
    'api-subscription-key': 'YOUR_API_KEY',
  },
});
```

The `api-subscription-key` needs to be passed in headers. Consider using `YOUR_API_KEY` as environment variables for security.

-   Transcribe speech to text

```ts
import { experimental_transcribe as transcribe } from 'ai';
import { readFile } from 'fs/promises';


await transcribe({
  model: sarvam.transcription('saarika:v2'),
  audio: await readFile('./src/transcript-test.mp3'),
  providerOptions: {
    sarvam: {
      language_code: 'en-IN',
    },
  },
});
```

## [Features](#features)

### [Changing parameters](#changing-parameters)

-   Change language\_code

```ts
providerOptions: {
    sarvam: {
      language_code: 'en-IN',
    },
  },
```

`language_code` specifies the language of the input audio and is required for accurate transcription. • It is mandatory for the `saarika:v1` model (this model does not support `unknown`). • It is optional for the `saarika:v2` model. • Use `unknown` when the language is not known; in that case, the API will auto‑detect it. Available options: `unknown`, `hi-IN`, `bn-IN`, `kn-IN`, `ml-IN`, `mr-IN`, `od-IN`, `pa-IN`, `ta-IN`, `te-IN`, `en-IN`, `gu-IN`.

-   with\_timestamps?

```ts
providerOptions: {
  sarvam: {
    with_timestamps: true,
  },
},
```

`with_timestamps` specifies whether to include start/end timestamps for each word/token. • Type: boolean • When true, each word/token will include start/end timestamps. • Default: false

-   with\_diarization?

```ts
providerOptions: {
  sarvam: {
    with_diarization: true,
  },
},
```

`with_diarization` enables speaker diarization (Beta). • Type: boolean • When true, enables speaker diarization. • Default: false

-   num\_speakers?

```ts
providerOptions: {
  sarvam: {
    with_diarization: true,
    num_speakers: 2,
  },
},
```

`num_speakers` sets the number of distinct speakers to detect (only when `with_diarization` is true). • Type: number | null • Number of distinct speakers to detect. • Default: null

## [References](#references)

-   [Sarvam API Docs](https://docs.sarvam.ai/api-reference-docs/endpoints/speech-to-text)

[Previous

Dify

](dify.html)

[Next

AI/ML API

](aimlapi.html)

On this page

[Sarvam Provider](#sarvam-provider)

[Setup](#setup)

[Provider Instance](#provider-instance)

[Features](#features)

[Changing parameters](#changing-parameters)

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