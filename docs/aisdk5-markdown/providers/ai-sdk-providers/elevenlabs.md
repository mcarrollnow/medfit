AI SDK Providers: ElevenLabs

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

[AI SDK Providers](../ai-sdk-providers.html)ElevenLabs

# [ElevenLabs Provider](#elevenlabs-provider)

The [ElevenLabs](https://elevenlabs.io/) provider contains language model support for the ElevenLabs transcription and speech generation APIs.

## [Setup](#setup)

The ElevenLabs provider is available in the `@ai-sdk/elevenlabs` module. You can install it with

pnpm

npm

yarn

bun

pnpm add @ai-sdk/elevenlabs

## [Provider Instance](#provider-instance)

You can import the default provider instance `elevenlabs` from `@ai-sdk/elevenlabs`:

```ts
import { elevenlabs } from '@ai-sdk/elevenlabs';
```

If you need a customized setup, you can import `createElevenLabs` from `@ai-sdk/elevenlabs` and create a provider instance with your settings:

```ts
import { createElevenLabs } from '@ai-sdk/elevenlabs';


const elevenlabs = createElevenLabs({
  // custom settings, e.g.
  fetch: customFetch,
});
```

You can use the following optional settings to customize the ElevenLabs provider instance:

-   **apiKey** *string*
    
    API key that is being sent using the `Authorization` header. It defaults to the `ELEVENLABS_API_KEY` environment variable.
    
-   **headers** *Record<string,string>*
    
    Custom headers to include in the requests.
    
-   **fetch** *(input: RequestInfo, init?: RequestInit) => Promise<Response>*
    
    Custom [fetch](https://developer.mozilla.org/en-US/docs/Web/API/fetch) implementation. Defaults to the global `fetch` function. You can use it as a middleware to intercept requests, or to provide a custom fetch implementation for e.g. testing.
    

## [Speech Models](#speech-models)

You can create models that call the [ElevenLabs speech API](https://elevenlabs.io/text-to-speech) using the `.speech()` factory method.

The first argument is the model id e.g. `eleven_multilingual_v2`.

```ts
const model = elevenlabs.speech('eleven_multilingual_v2');
```

You can also pass additional provider-specific options using the `providerOptions` argument. For example, supplying a voice to use for the generated audio.

```ts
import { experimental_generateSpeech as generateSpeech } from 'ai';
import { elevenlabs } from '@ai-sdk/elevenlabs';


const result = await generateSpeech({
  model: elevenlabs.speech('eleven_multilingual_v2'),
  text: 'Hello, world!',
  providerOptions: { elevenlabs: {} },
});
```

-   **language\_code** *string or null*  
    Optional. Language code (ISO 639-1) used to enforce a language for the model. Currently, only Turbo v2.5 and Flash v2.5 support language enforcement. For other models, providing a language code will result in an error.
    
-   **voice\_settings** *object or null*  
    Optional. Voice settings that override stored settings for the given voice. These are applied only to the current request.
    
    -   **stability** *double or null*  
        Optional. Determines how stable the voice is and the randomness between each generation. Lower values introduce broader emotional range; higher values result in a more monotonous voice.
    -   **use\_speaker\_boost** *boolean or null*  
        Optional. Boosts similarity to the original speaker. Increases computational load and latency.
    -   **similarity\_boost** *double or null*  
        Optional. Controls how closely the AI should adhere to the original voice.
    -   **style** *double or null*  
        Optional. Amplifies the style of the original speaker. May increase latency if set above 0.
-   **pronunciation\_dictionary\_locators** *array of objects or null*  
    Optional. A list of pronunciation dictionary locators to apply to the text, in order. Up to 3 locators per request.  
    Each locator object:
    
    -   **pronunciation\_dictionary\_id** *string* (required)  
        The ID of the pronunciation dictionary.
    -   **version\_id** *string or null* (optional)  
        The version ID of the dictionary. If not provided, the latest version is used.
-   **seed** *integer or null*  
    Optional. If specified, the system will attempt to sample deterministically. Must be between 0 and 4294967295. Determinism is not guaranteed.
    
-   **previous\_text** *string or null*  
    Optional. The text that came before the current request's text. Can improve continuity when concatenating generations or influence current generation continuity.
    
-   **next\_text** *string or null*  
    Optional. The text that comes after the current request's text. Can improve continuity when concatenating generations or influence current generation continuity.
    
-   **previous\_request\_ids** *array of strings or null*  
    Optional. List of request IDs for samples generated before this one. Improves continuity when splitting large tasks. Max 3 IDs. If both `previous_text` and `previous_request_ids` are sent, `previous_text` is ignored.
    
-   **next\_request\_ids** *array of strings or null*  
    Optional. List of request IDs for samples generated after this one. Useful for maintaining continuity when regenerating a sample. Max 3 IDs. If both `next_text` and `next_request_ids` are sent, `next_text` is ignored.
    
-   **apply\_text\_normalization** *enum*  
    Optional. Controls text normalization.  
    Allowed values: `'auto'` (default), `'on'`, `'off'`.
    
    -   `'auto'`: System decides whether to apply normalization (e.g., spelling out numbers).
    -   `'on'`: Always apply normalization.
    -   `'off'`: Never apply normalization.  
        For `eleven_turbo_v2_5` and `eleven_flash_v2_5`, can only be enabled with Enterprise plans.
-   **apply\_language\_text\_normalization** *boolean*  
    Optional. Defaults to `false`. Controls language text normalization, which helps with proper pronunciation in some supported languages (currently only Japanese). May significantly increase latency.
    

### [Model Capabilities](#model-capabilities)

| Model | Instructions |
| --- | --- |
| `eleven_v3` |  |
| `eleven_multilingual_v2` |  |
| `eleven_flash_v2_5` |  |
| `eleven_flash_v2` |  |
| `eleven_turbo_v2_5` |  |
| `eleven_turbo_v2` |  |
| `eleven_monolingual_v1` |  |
| `eleven_multilingual_v1` |  |

## [Transcription Models](#transcription-models)

You can create models that call the [ElevenLabs transcription API](https://elevenlabs.io/speech-to-text) using the `.transcription()` factory method.

The first argument is the model id e.g. `scribe_v1`.

```ts
const model = elevenlabs.transcription('scribe_v1');
```

You can also pass additional provider-specific options using the `providerOptions` argument. For example, supplying the input language in ISO-639-1 (e.g. `en`) format can sometimes improve transcription performance if known beforehand.

```ts
import { experimental_transcribe as transcribe } from 'ai';
import { elevenlabs } from '@ai-sdk/elevenlabs';


const result = await transcribe({
  model: elevenlabs.transcription('scribe_v1'),
  audio: new Uint8Array([1, 2, 3, 4]),
  providerOptions: { elevenlabs: { languageCode: 'en' } },
});
```

The following provider options are available:

-   **languageCode** *string*
    
    An ISO-639-1 or ISO-639-3 language code corresponding to the language of the audio file. Can sometimes improve transcription performance if known beforehand. Defaults to `null`, in which case the language is predicted automatically.
    
-   **tagAudioEvents** *boolean*
    
    Whether to tag audio events like (laughter), (footsteps), etc. in the transcription. Defaults to `true`.
    
-   **numSpeakers** *integer*
    
    The maximum amount of speakers talking in the uploaded file. Can help with predicting who speaks when. The maximum amount of speakers that can be predicted is 32. Defaults to `null`, in which case the amount of speakers is set to the maximum value the model supports.
    
-   **timestampsGranularity** *enum*
    
    The granularity of the timestamps in the transcription. Defaults to `'word'`. Allowed values: `'none'`, `'word'`, `'character'`.
    
-   **diarize** *boolean*
    
    Whether to annotate which speaker is currently talking in the uploaded file. Defaults to `true`.
    
-   **fileFormat** *enum*
    
    The format of input audio. Defaults to `'other'`. Allowed values: `'pcm_s16le_16'`, `'other'`. For `'pcm_s16le_16'`, the input audio must be 16-bit PCM at a 16kHz sample rate, single channel (mono), and little-endian byte order. Latency will be lower than with passing an encoded waveform.
    

### [Model Capabilities](#model-capabilities-1)

| Model | Transcription | Duration | Segments | Language |
| --- | --- | --- | --- | --- |
| `scribe_v1` |  |  |  |  |
| `scribe_v1_experimental` |  |  |  |  |

[Previous

Luma

](luma.html)

[Next

OpenAI Compatible Providers

](../openai-compatible-providers.html)

On this page

[ElevenLabs Provider](#elevenlabs-provider)

[Setup](#setup)

[Provider Instance](#provider-instance)

[Speech Models](#speech-models)

[Model Capabilities](#model-capabilities)

[Transcription Models](#transcription-models)

[Model Capabilities](#model-capabilities-1)

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