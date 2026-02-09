AI SDK Providers: AssemblyAI

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

[AI SDK Providers](../ai-sdk-providers.html)AssemblyAI

# [AssemblyAI Provider](#assemblyai-provider)

The [AssemblyAI](https://assemblyai.com/) provider contains language model support for the AssemblyAI transcription API.

## [Setup](#setup)

The AssemblyAI provider is available in the `@ai-sdk/assemblyai` module. You can install it with

pnpm

npm

yarn

bun

pnpm add @ai-sdk/assemblyai

## [Provider Instance](#provider-instance)

You can import the default provider instance `assemblyai` from `@ai-sdk/assemblyai`:

```ts
import { assemblyai } from '@ai-sdk/assemblyai';
```

If you need a customized setup, you can import `createAssemblyAI` from `@ai-sdk/assemblyai` and create a provider instance with your settings:

```ts
import { createAssemblyAI } from '@ai-sdk/assemblyai';


const assemblyai = createAssemblyAI({
  // custom settings, e.g.
  fetch: customFetch,
});
```

You can use the following optional settings to customize the AssemblyAI provider instance:

-   **apiKey** *string*
    
    API key that is being sent using the `Authorization` header. It defaults to the `ASSEMBLYAI_API_KEY` environment variable.
    
-   **headers** *Record<string,string>*
    
    Custom headers to include in the requests.
    
-   **fetch** *(input: RequestInfo, init?: RequestInit) => Promise<Response>*
    
    Custom [fetch](https://developer.mozilla.org/en-US/docs/Web/API/fetch) implementation. Defaults to the global `fetch` function. You can use it as a middleware to intercept requests, or to provide a custom fetch implementation for e.g. testing.
    

## [Transcription Models](#transcription-models)

You can create models that call the [AssemblyAI transcription API](https://www.assemblyai.com/docs/getting-started/transcribe-an-audio-file/typescript) using the `.transcription()` factory method.

The first argument is the model id e.g. `best`.

```ts
const model = assemblyai.transcription('best');
```

You can also pass additional provider-specific options using the `providerOptions` argument. For example, supplying the `contentSafety` option will enable content safety filtering.

```ts
import { experimental_transcribe as transcribe } from 'ai';
import { assemblyai } from '@ai-sdk/assemblyai';
import { readFile } from 'fs/promises';


const result = await transcribe({
  model: assemblyai.transcription('best'),
  audio: await readFile('audio.mp3'),
  providerOptions: { assemblyai: { contentSafety: true } },
});
```

The following provider options are available:

-   **audioEndAt** *number*
    
    End time of the audio in milliseconds. Optional.
    
-   **audioStartFrom** *number*
    
    Start time of the audio in milliseconds. Optional.
    
-   **autoChapters** *boolean*
    
    Whether to automatically generate chapters for the transcription. Optional.
    
-   **autoHighlights** *boolean*
    
    Whether to automatically generate highlights for the transcription. Optional.
    
-   **boostParam** *enum*
    
    Boost parameter for the transcription. Allowed values: `'low'`, `'default'`, `'high'`. Optional.
    
-   **contentSafety** *boolean*
    
    Whether to enable content safety filtering. Optional.
    
-   **contentSafetyConfidence** *number*
    
    Confidence threshold for content safety filtering (25-100). Optional.
    
-   **customSpelling** *array of objects*
    
    Custom spelling rules for the transcription. Each object has `from` (array of strings) and `to` (string) properties. Optional.
    
-   **disfluencies** *boolean*
    
    Whether to include disfluencies (um, uh, etc.) in the transcription. Optional.
    
-   **entityDetection** *boolean*
    
    Whether to detect entities in the transcription. Optional.
    
-   **filterProfanity** *boolean*
    
    Whether to filter profanity in the transcription. Optional.
    
-   **formatText** *boolean*
    
    Whether to format the text in the transcription. Optional.
    
-   **iabCategories** *boolean*
    
    Whether to include IAB categories in the transcription. Optional.
    
-   **languageCode** *string*
    
    Language code for the audio. Supports numerous ISO-639-1 and ISO-639-3 language codes. Optional.
    
-   **languageConfidenceThreshold** *number*
    
    Confidence threshold for language detection. Optional.
    
-   **languageDetection** *boolean*
    
    Whether to enable language detection. Optional.
    
-   **multichannel** *boolean*
    
    Whether to process multiple audio channels separately. Optional.
    
-   **punctuate** *boolean*
    
    Whether to add punctuation to the transcription. Optional.
    
-   **redactPii** *boolean*
    
    Whether to redact personally identifiable information. Optional.
    
-   **redactPiiAudio** *boolean*
    
    Whether to redact PII in the audio file. Optional.
    
-   **redactPiiAudioQuality** *enum*
    
    Quality of the redacted audio file. Allowed values: `'mp3'`, `'wav'`. Optional.
    
-   **redactPiiPolicies** *array of enums*
    
    Policies for PII redaction, specifying which types of information to redact. Supports numerous types like `'person_name'`, `'phone_number'`, etc. Optional.
    
-   **redactPiiSub** *enum*
    
    Substitution method for redacted PII. Allowed values: `'entity_name'`, `'hash'`. Optional.
    
-   **sentimentAnalysis** *boolean*
    
    Whether to perform sentiment analysis on the transcription. Optional.
    
-   **speakerLabels** *boolean*
    
    Whether to label different speakers in the transcription. Optional.
    
-   **speakersExpected** *number*
    
    Expected number of speakers in the audio. Optional.
    
-   **speechThreshold** *number*
    
    Threshold for speech detection (0-1). Optional.
    
-   **summarization** *boolean*
    
    Whether to generate a summary of the transcription. Optional.
    
-   **summaryModel** *enum*
    
    Model to use for summarization. Allowed values: `'informative'`, `'conversational'`, `'catchy'`. Optional.
    
-   **summaryType** *enum*
    
    Type of summary to generate. Allowed values: `'bullets'`, `'bullets_verbose'`, `'gist'`, `'headline'`, `'paragraph'`. Optional.
    
-   **topics** *array of strings*
    
    List of topics to detect in the transcription. Optional.
    
-   **webhookAuthHeaderName** *string*
    
    Name of the authentication header for webhook requests. Optional.
    
-   **webhookAuthHeaderValue** *string*
    
    Value of the authentication header for webhook requests. Optional.
    
-   **webhookUrl** *string*
    
    URL to send webhook notifications to. Optional.
    
-   **wordBoost** *array of strings*
    
    List of words to boost in the transcription. Optional.
    

### [Model Capabilities](#model-capabilities)

| Model | Transcription | Duration | Segments | Language |
| --- | --- | --- | --- | --- |
| `best` |  |  |  |  |
| `nano` |  |  |  |  |

[Previous

Fal

](fal.html)

[Next

DeepInfra

](deepinfra.html)

On this page

[AssemblyAI Provider](#assemblyai-provider)

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