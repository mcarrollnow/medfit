Community Providers: Aihubmix

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

[Community Providers](../community-providers.html)Aihubmix

# [Aihubmix Provider](#aihubmix-provider)

The [Aihubmix](https://aihubmix.com/) provider contains unified access to multiple AI providers through the Aihubmix API, including OpenAI, Anthropic Claude, and Google Gemini models. View all available models at [aihubmix.com/models](https://aihubmix.com/models).

## [Setup](#setup)

The Aihubmix provider is available in the `@aihubmix/ai-sdk-provider` module. You can install it with

pnpm

npm

yarn

pnpm add @aihubmix/ai-sdk-provider

## [Provider Instance](#provider-instance)

### [Method 1: Using createAihubmix](#method-1-using-createaihubmix)

To create an Aihubmix provider instance, use the `createAihubmix` function:

```typescript
import { createAihubmix } from '@aihubmix/ai-sdk-provider';


const aihubmix = createAihubmix({
  apiKey: 'AIHUBMIX_API_KEY',
});
```

You can obtain your Aihubmix API key from the [Aihubmix Keys](https://aihubmix.com/token).

### [Method 2: Using Environment Variables](#method-2-using-environment-variables)

Alternatively, you can use the pre-configured `aihubmix` instance by setting the `AIHUBMIX_API_KEY` environment variable:

```bash
# .env
AIHUBMIX_API_KEY=your_api_key_here
```

Then import and use the pre-configured instance:

```ts
import { aihubmix } from '@aihubmix/ai-sdk-provider';
```

## [Usage](#usage)

### [Chat Completion](#chat-completion)

```ts
import { aihubmix } from '@aihubmix/ai-sdk-provider';
import { generateText } from 'ai';


const { text } = await generateText({
  model: aihubmix('o4-mini'),
  prompt: 'Write a vegetarian lasagna recipe for 4 people.',
});
```

### [Claude Model](#claude-model)

```ts
import { aihubmix } from '@aihubmix/ai-sdk-provider';
import { generateText } from 'ai';


const { text } = await generateText({
  model: aihubmix('claude-3-7-sonnet-20250219'),
  prompt: 'Explain quantum computing in simple terms.',
});
```

### [Gemini Model](#gemini-model)

```ts
import { aihubmix } from '@aihubmix/ai-sdk-provider';
import { generateText } from 'ai';


const { text } = await generateText({
  model: aihubmix('gemini-2.5-flash'),
  prompt: 'Create a Python script to sort a list of numbers.',
});
```

### [Image Generation](#image-generation)

```ts
import { aihubmix } from '@aihubmix/ai-sdk-provider';
import { experimental_generateImage as generateImage } from 'ai';


const { image } = await generateImage({
  model: aihubmix.image('gpt-image-1'),
  prompt: 'A beautiful sunset over mountains',
});
```

### [Embeddings](#embeddings)

```ts
import { aihubmix } from '@aihubmix/ai-sdk-provider';
import { embed } from 'ai';


const { embedding } = await embed({
  model: aihubmix.embedding('text-embedding-ada-002'),
  value: 'Hello, world!',
});
```

### [Transcription](#transcription)

```ts
import { aihubmix } from '@aihubmix/ai-sdk-provider';
import { experimental_transcribe as transcribe } from 'ai';


const { text } = await transcribe({
  model: aihubmix.transcription('whisper-1'),
  audio: audioFile,
});
```

### [Stream Text](#stream-text)

```ts
import { aihubmix } from '@aihubmix/ai-sdk-provider';
import { streamText } from 'ai';


const result = streamText({
  model: aihubmix('gpt-3.5-turbo'),
  prompt: 'Write a short story about a robot learning to paint.',
  maxOutputTokens: 256,
  temperature: 0.3,
  maxRetries: 3,
});


let fullText = '';
for await (const textPart of result.textStream) {
  fullText += textPart;
  process.stdout.write(textPart);
}


console.log('\nUsage:', await result.usage);
console.log('Finish reason:', await result.finishReason);
```

### [Generate Object](#generate-object)

```ts
import { aihubmix } from '@aihubmix/ai-sdk-provider';
import { generateObject } from 'ai';
import { z } from 'zod';


const result = await generateObject({
  model: aihubmix('gpt-4o-mini'),
  schema: z.object({
    recipe: z.object({
      name: z.string(),
      ingredients: z.array(
        z.object({
          name: z.string(),
          amount: z.string(),
        }),
      ),
      steps: z.array(z.string()),
    }),
  }),
  prompt: 'Generate a lasagna recipe.',
});


console.log(JSON.stringify(result.object.recipe, null, 2));
console.log('Token usage:', result.usage);
console.log('Finish reason:', result.finishReason);
```

### [Stream Object](#stream-object)

```ts
import { aihubmix } from '@aihubmix/ai-sdk-provider';
import { streamObject } from 'ai';
import { z } from 'zod';


const result = streamObject({
  model: aihubmix('gpt-4o-mini'),
  schema: z.object({
    recipe: z.object({
      name: z.string(),
      ingredients: z.array(
        z.object({
          name: z.string(),
          amount: z.string(),
        }),
      ),
      steps: z.array(z.string()),
    }),
  }),
  prompt: 'Generate a lasagna recipe.',
});


for await (const objectPart of result.partialObjectStream) {
  console.log(objectPart);
}


console.log('Token usage:', await result.usage);
console.log('Final object:', await result.object);
```

### [Embed Many](#embed-many)

```ts
import { aihubmix } from '@aihubmix/ai-sdk-provider';
import { embedMany } from 'ai';


const { embeddings, usage } = await embedMany({
  model: aihubmix.embedding('text-embedding-3-small'),
  values: [
    'sunny day at the beach',
    'rainy afternoon in the city',
    'snowy night in the mountains',
  ],
});


console.log('Embeddings:', embeddings);
console.log('Usage:', usage);
```

### [Speech Synthesis](#speech-synthesis)

```ts
import { aihubmix } from '@aihubmix/ai-sdk-provider';
import { experimental_generateSpeech as generateSpeech } from 'ai';


const { audio } = await generateSpeech({
  model: aihubmix.speech('tts-1'),
  text: 'Hello, this is a test for speech synthesis.',
});
```

## [Tools](#tools)

The Aihubmix provider supports various tools including web search:

```ts
import { aihubmix } from '@aihubmix/ai-sdk-provider';
import { generateText } from 'ai';


const { text } = await generateText({
  model: aihubmix('gpt-4'),
  prompt: 'What are the latest developments in AI?',
  tools: {
    webSearchPreview: aihubmix.tools.webSearch({
      searchContextSize: 'high',
    }),
  },
});
```

## [Additional Resources](#additional-resources)

-   [Aihubmix Provider Repository](https://github.com/inferera/aihubmix)
-   [Aihubmix Documentation](https://docs.aihubmix.com/en)
-   [Aihubmix Dashboard](https://aihubmix.com)

[Previous

Azure AI

](azure-ai.html)

[Next

SAP AI Core

](sap-ai.html)

On this page

[Aihubmix Provider](#aihubmix-provider)

[Setup](#setup)

[Provider Instance](#provider-instance)

[Method 1: Using createAihubmix](#method-1-using-createaihubmix)

[Method 2: Using Environment Variables](#method-2-using-environment-variables)

[.env](#env)

[Usage](#usage)

[Chat Completion](#chat-completion)

[Claude Model](#claude-model)

[Gemini Model](#gemini-model)

[Image Generation](#image-generation)

[Embeddings](#embeddings)

[Transcription](#transcription)

[Stream Text](#stream-text)

[Generate Object](#generate-object)

[Stream Object](#stream-object)

[Embed Many](#embed-many)

[Speech Synthesis](#speech-synthesis)

[Tools](#tools)

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