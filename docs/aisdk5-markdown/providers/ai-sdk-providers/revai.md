AI SDK Providers: Rev.ai

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

[AI Gateway](ai-gateway.html)

[xAI Grok](xai.html)

[Vercel](vercel.html)

[OpenAI](openai.html)

[Azure OpenAI](azure.html)

[Anthropic](anthropic.html)

[Amazon Bedrock](amazon-bedrock.html)

[Groq](groq.html)

[Fal](fal.html)

[DeepInfra](deepinfra.html)

[Google Generative AI](google-generative-ai.html)

[Google Vertex AI](google-vertex.html)

[Mistral AI](mistral.html)

[Together.ai](togetherai.html)

[Cohere](cohere.html)

[Fireworks](fireworks.html)

[DeepSeek](deepseek.html)

[Cerebras](cerebras.html)

[Replicate](replicate.html)

[Perplexity](perplexity.html)

[Luma](luma.html)

[ElevenLabs](elevenlabs.html)

[AssemblyAI](assemblyai.html)

[Deepgram](deepgram.html)

[Gladia](gladia.html)

[LMNT](lmnt.html)

[Hume](hume.html)

[Rev.ai](revai.html)

[Baseten](baseten.html)

[Hugging Face](huggingface.html)

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

[AI SDK Providers](../ai-sdk-providers.html)Rev.ai

# [Rev.ai Provider](#revai-provider)

The [Rev.ai](https://www.rev.ai/) provider contains language model support for the Rev.ai transcription API.

## [Setup](#setup)

The Rev.ai provider is available in the `@ai-sdk/revai` module. You can install it with

pnpm

npm

yarn

bun

pnpm add @ai-sdk/revai

## [Provider Instance](#provider-instance)

You can import the default provider instance `revai` from `@ai-sdk/revai`:

```ts
import { revai } from '@ai-sdk/revai';
```

If you need a customized setup, you can import `createRevai` from `@ai-sdk/revai` and create a provider instance with your settings:

```ts
import { createRevai } from '@ai-sdk/revai';


const revai = createRevai({
  // custom settings, e.g.
  fetch: customFetch,
});
```

You can use the following optional settings to customize the Rev.ai provider instance:

-   **apiKey** *string*
    
    API key that is being sent using the `Authorization` header. It defaults to the `REVAI_API_KEY` environment variable.
    
-   **headers** *Record<string,string>*
    
    Custom headers to include in the requests.
    
-   **fetch** *(input: RequestInfo, init?: RequestInit) => Promise<Response>*
    
    Custom [fetch](https://developer.mozilla.org/en-US/docs/Web/API/fetch) implementation. Defaults to the global `fetch` function. You can use it as a middleware to intercept requests, or to provide a custom fetch implementation for e.g. testing.
    

## [Transcription Models](#transcription-models)

You can create models that call the [Rev.ai transcription API](https://www.rev.ai/docs/api/transcription) using the `.transcription()` factory method.

The first argument is the model id e.g. `machine`.

```ts
const model = revai.transcription('machine');
```

You can also pass additional provider-specific options using the `providerOptions` argument. For example, supplying the input language in ISO-639-1 (e.g. `en`) format can sometimes improve transcription performance if known beforehand.

```ts
import { experimental_transcribe as transcribe } from 'ai';
import { revai } from '@ai-sdk/revai';
import { readFile } from 'fs/promises';


const result = await transcribe({
  model: revai.transcription('machine'),
  audio: await readFile('audio.mp3'),
  providerOptions: { revai: { language: 'en' } },
});
```

The following provider options are available:

-   **metadata** *string*
    
    Optional metadata that was provided during job submission.
    
-   **notification\_config** *object*
    
    Optional configuration for a callback url to invoke when processing is complete.
    
    -   **url** *string* - Callback url to invoke when processing is complete.
    -   **auth\_headers** *object* - Optional authorization headers, if needed to invoke the callback.
        -   **Authorization** *string* - Authorization header value.
-   **delete\_after\_seconds** *integer*
    
    Amount of time after job completion when job is auto-deleted.
    
-   **verbatim** *boolean*
    
    Configures the transcriber to transcribe every syllable, including all false starts and disfluencies.
    
-   **rush** *boolean*
    
    \[HIPAA Unsupported\] Only available for human transcriber option. When set to true, your job is given higher priority.
    
-   **skip\_diarization** *boolean*
    
    Specify if speaker diarization will be skipped by the speech engine.
    
-   **skip\_postprocessing** *boolean*
    
    Only available for English and Spanish languages. User-supplied preference on whether to skip post-processing operations.
    
-   **skip\_punctuation** *boolean*
    
    Specify if "punct" type elements will be skipped by the speech engine.
    
-   **remove\_disfluencies** *boolean*
    
    When set to true, disfluencies (like 'ums' and 'uhs') will not appear in the transcript.
    
-   **remove\_atmospherics** *boolean*
    
    When set to true, atmospherics (like `<laugh>`, `<affirmative>`) will not appear in the transcript.
    
-   **filter\_profanity** *boolean*
    
    When enabled, profanities will be filtered by replacing characters with asterisks except for the first and last.
    
-   **speaker\_channels\_count** *integer*
    
    Only available for English, Spanish and French languages. Specify the total number of unique speaker channels in the audio.
    
-   **speakers\_count** *integer*
    
    Only available for English, Spanish and French languages. Specify the total number of unique speakers in the audio.
    
-   **diarization\_type** *string*
    
    Specify diarization type. Possible values: "standard" (default), "premium".
    
-   **custom\_vocabulary\_id** *string*
    
    Supply the id of a pre-completed custom vocabulary submitted through the Custom Vocabularies API.
    
-   **custom\_vocabularies** *Array*
    
    Specify a collection of custom vocabulary to be used for this job.
    
-   **strict\_custom\_vocabulary** *boolean*
    
    If true, only exact phrases will be used as custom vocabulary.
    
-   **summarization\_config** *object*
    
    Specify summarization options.
    
    -   **model** *string* - Model type for summarization. Possible values: "standard" (default), "premium".
    -   **type** *string* - Summarization formatting type. Possible values: "paragraph" (default), "bullets".
    -   **prompt** *string* - Custom prompt for flexible summaries (mutually exclusive with type).
-   **translation\_config** *object*
    
    Specify translation options.
    
    -   **target\_languages** *Array* - Array of target languages for translation.
    -   **model** *string* - Model type for translation. Possible values: "standard" (default), "premium".
-   **language** *string*
    
    Language is provided as a ISO 639-1 language code. Default is "en".
    
-   **forced\_alignment** *boolean*
    
    When enabled, provides improved accuracy for per-word timestamps for a transcript. Default is `false`.
    
    Currently supported languages:
    
    -   English (en, en-us, en-gb)
    -   French (fr)
    -   Italian (it)
    -   German (de)
    -   Spanish (es)
    
    Note: This option is not available in low-cost environment.
    

### [Model Capabilities](#model-capabilities)

| Model | Transcription | Duration | Segments | Language |
| --- | --- | --- | --- | --- |
| `machine` |  |  |  |  |
| `low_cost` |  |  |  |  |
| `fusion` |  |  |  |  |

[Previous

Google Vertex AI

](google-vertex.html)

[Next

Baseten

](baseten.html)

On this page

[Rev.ai Provider](#revai-provider)

[Setup](#setup)

[Provider Instance](#provider-instance)

[Transcription Models](#transcription-models)

[Model Capabilities](#model-capabilities)

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