Community Providers: React Native Apple

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

[Community Providers](../community-providers.html)React Native Apple

# [React Native Apple Provider](#react-native-apple-provider)

[@react-native-ai/apple](https://github.com/callstackincubator/ai/tree/main/packages/apple-llm) is a community provider that brings Apple's on-device AI capabilities to React Native and Expo applications. It allows you to run the AI SDK entirely on-device, leveraging Apple Intelligence foundation models available from iOS 26+ to provide text generation, embeddings, transcription, and speech synthesis through Apple's native AI frameworks.

## [Setup](#setup)

The Apple provider is available in the `@react-native-ai/apple` module. You can install it with:

pnpm

npm

yarn

bun

pnpm add @react-native-ai/apple

### [Prerequisites](#prerequisites)

Before using the Apple provider, you need:

-   **React Native or Expo application**: This provider only works with React Native and Expo applications. For setup instructions, see the [Expo Quickstart guide](../../docs/getting-started/expo.html)
-   **iOS 26+**: Required for Apple Intelligence foundation models and core functionality

### [Provider Instance](#provider-instance)

You can import the default provider instance `apple` from `@react-native-ai/apple`:

```ts
import { apple } from '@react-native-ai/apple';
```

### [Availability Check](#availability-check)

Before using Apple AI features, you can check if they're available on the current device:

```ts
if (!apple.isAvailable()) {
  // Handle fallback logic for unsupported devices
}
```

## [Language Models](#language-models)

Apple provides on-device language models through Apple Foundation Models, available on iOS 26+ with Apple Intelligence enabled devices.

### [Text Generation](#text-generation)

Generate text using Apple's on-device language models:

```ts
import { apple } from '@react-native-ai/apple';
import { generateText } from 'ai';


const { text } = await generateText({
  model: apple(),
  prompt: 'Explain quantum computing in simple terms',
});
```

### [Streaming Text Generation](#streaming-text-generation)

For real-time text generation:

```ts
import { apple } from '@react-native-ai/apple';
import { streamText } from 'ai';


const result = streamText({
  model: apple(),
  prompt: 'Write a short story about space exploration',
});


for await (const chunk of result.textStream) {
  console.log(chunk);
}
```

### [Structured Output Generation](#structured-output-generation)

Generate structured data using Zod schemas:

```ts
import { apple } from '@react-native-ai/apple';
import { generateObject } from 'ai';
import { z } from 'zod';


const result = await generateObject({
  model: apple(),
  schema: z.object({
    recipe: z.string(),
    ingredients: z.array(z.string()),
    cookingTime: z.string(),
  }),
  prompt: 'Create a recipe for chocolate chip cookies',
});
```

### [Model Configuration](#model-configuration)

Configure generation parameters:

```ts
const { text } = await generateText({
  model: apple(),
  prompt: 'Generate creative content',
  temperature: 0.8, // Controls randomness (0-1)
  maxTokens: 150, // Maximum tokens to generate
  topP: 0.9, // Nucleus sampling threshold
  topK: 40, // Top-K sampling parameter
});
```

### [Tool Calling](#tool-calling)

The Apple provider supports tool calling, where tools are executed by Apple Intelligence rather than the AI SDK. Tools must be pre-registered with the provider using `createAppleProvider` before they can be used in generation calls.

```ts
import { createAppleProvider } from '@react-native-ai/apple';
import { generateText, tool } from 'ai';
import { z } from 'zod';


const getWeather = tool({
  description: 'Get current weather information',
  parameters: z.object({
    city: z.string().describe('The city name'),
  }),
  execute: async ({ city }) => {
    return `Weather in ${city}: Sunny, 25°C`;
  },
});


// Create a provider with all available tools
const apple = createAppleProvider({
  availableTools: {
    getWeather,
  },
});


// Use the provider with selected tools
const result = await generateText({
  model: apple(),
  prompt: 'What is the weather like in San Francisco?',
  tools: { getWeather },
});
```

Since tools are executed by Apple Intelligence rather than the AI SDK, multi-step features like `maxSteps`, `onStepStart`, and `onStepFinish` are not supported.

## [Text Embeddings](#text-embeddings)

Apple provides multilingual text embeddings using `NLContextualEmbedding`, available on iOS 17+.

```ts
import { apple } from '@react-native-ai/apple';
import { embed } from 'ai';


const { embedding } = await embed({
  model: apple.textEmbeddingModel(),
  value: 'Hello world',
});
```

## [Audio Transcription](#audio-transcription)

Apple provides speech-to-text transcription using `SpeechAnalyzer` and `SpeechTranscriber`, available on iOS 26+.

```ts
import { apple } from '@react-native-ai/apple';
import { experimental_transcribe } from 'ai';


const response = await experimental_transcribe({
  model: apple.transcriptionModel(),
  audio: audioBuffer,
});


console.log(response.text);
```

## [Speech Synthesis](#speech-synthesis)

Apple provides text-to-speech synthesis using `AVSpeechSynthesizer`, available on iOS 13+ with enhanced features on iOS 17+.

### [Basic Speech Generation](#basic-speech-generation)

Convert text to speech:

```ts
import { apple } from '@react-native-ai/apple';
import { experimental_generateSpeech } from 'ai';


const response = await experimental_generateSpeech({
  model: apple.speechModel(),
  text: 'Hello from Apple on-device speech!',
  language: 'en-US',
});
```

### [Voice Selection](#voice-selection)

You can configure the voice to use for speech synthesis by passing its identifier to the `voice` option.

```ts
const response = await experimental_generateSpeech({
  model: apple.speechModel(),
  text: 'Custom voice example',
  voice: 'com.apple.ttsbundle.Samantha-compact',
});
```

To check for available voices, you can use the `getVoices` method:

```ts
import { AppleSpeech } from '@react-native-ai/apple';


const voices = await AppleSpeech.getVoices();
console.log(voices);
```

## [Platform Requirements](#platform-requirements)

Different Apple AI features have varying iOS version requirements:

| Feature | Minimum iOS Version | Additional Requirements |
| --- | --- | --- |
| Text Generation | iOS 26+ | Apple Intelligence enabled device |
| Text Embeddings | iOS 17+ | \- |
| Audio Transcription | iOS 26+ | Language assets downloaded |
| Speech Synthesis | iOS 13+ | iOS 17+ for Personal Voice |

Apple Intelligence features are currently available on selected devices. Check Apple's documentation for the latest device compatibility information.

## [Additional Resources](#additional-resources)

-   [React Native Apple Provider GitHub Repository](https://github.com/callstackincubator/ai/tree/main/packages/apple-llm)
-   [React Native AI Documentation](https://www.react-native-ai.dev/)
-   [Apple Intelligence](https://www.apple.com/apple-intelligence/)
-   [Apple Foundation Models](https://developer.apple.com/documentation/foundationmodels)

[Previous

Supermemory

](supermemory.html)

[Next

Anthropic Vertex

](anthropic-vertex-ai.html)

On this page

[React Native Apple Provider](#react-native-apple-provider)

[Setup](#setup)

[Prerequisites](#prerequisites)

[Provider Instance](#provider-instance)

[Availability Check](#availability-check)

[Language Models](#language-models)

[Text Generation](#text-generation)

[Streaming Text Generation](#streaming-text-generation)

[Structured Output Generation](#structured-output-generation)

[Model Configuration](#model-configuration)

[Tool Calling](#tool-calling)

[Text Embeddings](#text-embeddings)

[Audio Transcription](#audio-transcription)

[Speech Synthesis](#speech-synthesis)

[Basic Speech Generation](#basic-speech-generation)

[Voice Selection](#voice-selection)

[Platform Requirements](#platform-requirements)

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