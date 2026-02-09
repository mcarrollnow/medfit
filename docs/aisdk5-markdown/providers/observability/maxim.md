Observability Integrations: Maxim

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

[Axiom](axiom.html)

[Braintrust](braintrust.html)

[Helicone](helicone.html)

[Laminar](laminar.html)

[Langfuse](langfuse.html)

[LangSmith](langsmith.html)

[LangWatch](langwatch.html)

[Maxim](maxim.html)

[Patronus](patronus.html)

[Scorecard](scorecard.html)

[SigNoz](signoz.html)

[Traceloop](traceloop.html)

[Weave](weave.html)

[Observability Integrations](../observability.html)Maxim

# [Maxim Observability](#maxim-observability)

[Maxim AI](https://getmaxim.ai) streamlines AI application development and deployment by applying traditional software best practices to non-deterministic AI workflows. Our evaluation and observability tools help teams maintain quality, reliability, and speed throughout the AI application lifecycle. Maxim integrates with the AI SDK to provide:

-   Automatic Observability – Adds tracing, logging, and metadata to AI SDK calls with a simple wrapper.
    
-   Unified Model Wrapping – Supports OpenAI, Anthropic, and Google etc. models uniformly.
    
-   Custom Metadata & Tagging – Enables attaching trace names, tags, and session IDs to track usage.
    
-   Streaming & Structured Output Support – Handles streaming responses and structured outputs seamlessly.
    

# [Setting up Maxim with the AI SDK](#setting-up-maxim-with-the-ai-sdk)

## [Requirements](#requirements)

```undefined
"ai"
"@ai-sdk/openai"
"@ai-sdk/anthropic"
"@ai-sdk/google"
"@maximai/maxim-js"
```

## [Environment Variables](#environment-variables)

```undefined
MAXIM_API_KEY=
MAXIM_LOG_REPO_ID=
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
```

## [Initialize Logger](#initialize-logger)

```javascript
import { Maxim } from '@maximai/maxim-js';


async function initializeMaxim() {
  const apiKey = process.env.MAXIM_API_KEY || '';
  if (!apiKey) {
    throw new Error(
      'MAXIM_API_KEY is not defined in the environment variables',
    );
  }


  const maxim = new Maxim({ apiKey });
  const logger = await maxim.logger({
    id: process.env.MAXIM_LOG_REPO_ID || '',
  });


  if (!logger) {
    throw new Error('Logger is not available');
  }


  return { maxim, logger };
}
```

## [Wrap AI SDK Models with Maxim](#wrap-ai-sdk-models-with-maxim)

```javascript
import { openai } from '@ai-sdk/openai';
import { wrapMaximAISDKModel } from '@maximai/maxim-js/vercel-ai-sdk';


const model = wrapMaximAISDKModel(openai('gpt-4'), logger);
```

## [Make LLM calls using wrapped models](#make-llm-calls-using-wrapped-models)

```javascript
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { wrapMaximAISDKModel } from '@maximai/maxim-js/vercel-ai-sdk';


const model = wrapMaximAISDKModel(openai('gpt-4'), logger);


// Generate text with automatic logging
const response = await generateText({
  model: model,
  prompt: 'Write a haiku about recursion in programming.',
  temperature: 0.8,
  system: 'You are a helpful assistant.',
});


console.log('Response:', response.text);
```

## [Working with Different AI SDK Functions](#working-with-different-ai-sdk-functions)

The wrapped model works seamlessly with all Vercel AI SDK functions:

### [**Generate Object**](#generate-object)

```javascript
import { generateObject } from 'ai';
import { z } from 'zod';


const response = await generateObject({
  model: model,
  prompt: 'Generate a user profile for John Doe',
  schema: z.object({
    name: z.string(),
    age: z.number(),
    email: z.string().email(),
    interests: z.array(z.string()),
  }),
});


console.log(response.object);
```

### [**Stream Text**](#stream-text)

```javascript
import { streamText } from 'ai';


const { textStream } = await streamText({
  model: model,
  prompt: 'Write a short story about space exploration',
  system: 'You are a creative writer',
});


for await (const textPart of textStream) {
  process.stdout.write(textPart);
}
```

## [Custom Metadata and Tracing](#custom-metadata-and-tracing)

### [**Using Custom Metadata**](#using-custom-metadata)

```javascript
import { MaximVercelProviderMetadata } from '@maximai/maxim-js/vercel-ai-sdk';


const response = await generateText({
  model: model,
  prompt: 'Hello, how are you?',
  providerOptions: {
    maxim: {
      traceName: 'custom-trace-name',
      traceTags: {
        type: 'demo',
        priority: 'high',
      },
    } as MaximVercelProviderMetadata,
  },
});
```

### [**Available Metadata Fields**](#available-metadata-fields)

**Entity Naming:**

-   `sessionName` - Override the default session name
-   `traceName` - Override the default trace name
-   `spanName` - Override the default span name
-   `generationName` - Override the default LLM generation name

**Entity Tagging:**

-   `sessionTags` - Add custom tags to the session `(object: {key: value})`
-   `traceTags` - Add custom tags to the trace `(object: {key: value})`
-   `spanTags` - Add custom tags to span `(object: {key: value})`
-   `generationTags` - Add custom tags to LLM generations `(object: {key: value})`

**ID References:**

-   `sessionId` - Link this trace to an existing session
-   `traceId` - Use a specific trace ID
-   `spanId` - Use a specific span ID

![Maxim Demo](../../../cdn.getmaxim.ai/public/images/maxim_vercel.gif)

## [Streaming Support](#streaming-support)

```javascript
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { wrapMaximAISDKModel, MaximVercelProviderMetadata } from '@maximai/maxim-js/vercel-ai-sdk';


const model = wrapMaximAISDKModel(openai('gpt-4'), logger);


const { textStream } = await streamText({
  model: model,
  prompt: 'Write a story about a robot learning to paint.',
  system: 'You are a creative storyteller',
  providerOptions: {
    maxim: {
      traceName: 'Story Generation',
      traceTags: {
        type: 'creative',
        format: 'streaming'
      },
    } as MaximVercelProviderMetadata,
  },
});


for await (const textPart of textStream) {
  process.stdout.write(textPart);
}
```

## [Multiple Provider Support](#multiple-provider-support)

```javascript
import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { google } from '@ai-sdk/google';
import { wrapMaximAISDKModel } from '@maximai/maxim-js/vercel-ai-sdk';


// Wrap different provider models
const openaiModel = wrapMaximAISDKModel(openai('gpt-4'), logger);
const anthropicModel = wrapMaximAISDKModel(
  anthropic('claude-3-5-sonnet-20241022'),
  logger,
);
const googleModel = wrapMaximAISDKModel(google('gemini-pro'), logger);


// Use them with the same interface
const responses = await Promise.all([
  generateText({ model: openaiModel, prompt: 'Hello from OpenAI' }),
  generateText({ model: anthropicModel, prompt: 'Hello from Anthropic' }),
  generateText({ model: googleModel, prompt: 'Hello from Google' }),
]);
```

## [Next.js Integration](#nextjs-integration)

### [**API Route Example**](#api-route-example)

```javascript
// app/api/chat/route.js
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { wrapMaximAISDKModel, MaximVercelProviderMetadata } from '@maximai/maxim-js/vercel-ai-sdk';
import { Maxim } from "@maximai/maxim-js";


const maxim = new Maxim({ apiKey });
const logger = await maxim.logger({ id: process.env.MAXIM_LOG_REPO_ID });
const model = wrapMaximAISDKModel(openai('gpt-4'), logger);


export async function POST(req) {
  const { messages } = await req.json();


  const result = await streamText({
    model: model,
    messages,
    system: 'You are a helpful assistant',
    providerOptions: {
      maxim: {
        traceName: 'Chat API',
        traceTags: {
          endpoint: '/api/chat',
          type: 'conversation'
        },
      } as MaximVercelProviderMetadata,
    },
  });


  return result.toAIStreamResponse();
}
```

### [**Client-side Integration**](#client-side-integration)

```javascript
// components/Chat.jsx
import { useChat } from 'ai/react';


export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/chat',
  });


  return (
    <div>
      {messages.map(m => (
        <div key={m.id}>
          <strong>{m.role}:</strong> {m.content}
        </div>
      ))}


      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Say something..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
```

## [Learn more](#learn-more)

-   After setting up Maxim tracing for the Vercel AI SDK, you can explore other Maxim platform capabilities:
    
    -   Prompt Management: Version, manage, and dynamically apply prompts across environments and agents.
    -   Evaluations: Run automated and manual evaluations on traces, generations, and full agent trajectories.
    -   Simulations: Test agents in real-world scenarios with simulated multi-turn interactions and workflows.

For further details, checkout Vercel AI SDK's [Maxim integration documentation](https://www.getmaxim.ai/docs/sdk/typescript/integrations/vercel/vercel).

[Previous

LangWatch

](langwatch.html)

[Next

Patronus

](patronus.html)

On this page

[Maxim Observability](#maxim-observability)

[Setting up Maxim with the AI SDK](#setting-up-maxim-with-the-ai-sdk)

[Requirements](#requirements)

[Environment Variables](#environment-variables)

[Initialize Logger](#initialize-logger)

[Wrap AI SDK Models with Maxim](#wrap-ai-sdk-models-with-maxim)

[Make LLM calls using wrapped models](#make-llm-calls-using-wrapped-models)

[Working with Different AI SDK Functions](#working-with-different-ai-sdk-functions)

[\*\*Generate Object\*\*](#generate-object)

[\*\*Stream Text\*\*](#stream-text)

[Custom Metadata and Tracing](#custom-metadata-and-tracing)

[\*\*Using Custom Metadata\*\*](#using-custom-metadata)

[\*\*Available Metadata Fields\*\*](#available-metadata-fields)

[Streaming Support](#streaming-support)

[Multiple Provider Support](#multiple-provider-support)

[Next.js Integration](#nextjs-integration)

[\*\*API Route Example\*\*](#api-route-example)

[\*\*Client-side Integration\*\*](#client-side-integration)

[Learn more](#learn-more)

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