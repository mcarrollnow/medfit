Community Providers: Built-in AI

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

[Community Providers](../community-providers.html)Built-in AI

# [Built-in AI](#built-in-ai)

[jakobhoeg/built-in-ai](https://github.com/jakobhoeg/built-in-ai) is a community provider that serves as the base AI SDK provider for client side in-browser AI models. It currently provides a model provider for Chrome & Edge's native browser AI models via the JavaScript [Prompt API](https://github.com/webmachinelearning/prompt-api), as well as a model provider for using open-source in-browser models with both [🤗 Transformers.js](https://github.com/huggingface/transformers.js) and [WebLLM](https://github.com/mlc-ai/web-llm).

The `@built-in-ai/core` package is under constant development as the Prompt API matures, and may contain errors and breaking changes. However, this module will also mature with it as new implementations arise.

## [Setup](#setup)

### [Installation](#installation)

The `@built-in-ai/core` package is the AI SDK provider for Chrome and Edge browser's built-in AI models. You can install it with:

pnpm

npm

yarn

bun

pnpm add @built-in-ai/core

The `@built-in-ai/web-llm` package is the AI SDK provider for popular open-source models using the WebLLM inference engine. You can install it with:

pnpm

npm

yarn

bun

pnpm add @built-in-ai/web-llm

The `@built-in-ai/transformers-js` package is the AI SDK provider for popular open-source models using Transformers.js. You can install it with:

pnpm

npm

yarn

bun

pnpm add @built-in-ai/transformers-js

### [Browser-specific setup (@built-in-ai/core)](#browser-specific-setup-built-in-aicore)

The Prompt API (built-in AI) is currently experimental and might change as it matures. The following enablement guide for the API might also change in the future.

1.  You need Chrome (v. 128 or higher) or Edge Dev/Canary (v. 138.0.3309.2 or higher)
    
2.  Enable these experimental flags:
    
    -   If you're using Chrome:
        1.  Go to `chrome://flags/`, search for *'Prompt API for Gemini Nano with Multimodal Input'* and set it to Enabled
        2.  Go to `chrome://components` and click Check for Update on Optimization Guide On Device Model
    -   If you're using Edge:
        1.  Go to `edge://flags/#prompt-api-for-phi-mini` and set it to Enabled

For more information, check out [this guide](https://developer.chrome.com/docs/extensions/ai/prompt-api)

## [Provider Instances](#provider-instances)

### [`@built-in-ai/core`](#built-in-aicore)

You can import the default provider instance `builtInAI` from `@built-in-ai/core`:

```ts
import { builtInAI } from '@built-in-ai/core';


const model = builtInAI();
```

You can use the following optional settings to customize the model:

-   **temperature** *number*
    
    Controls randomness in the model's responses. For most models, `0` means almost deterministic results, and higher values mean more randomness.
    
-   **topK** *number*
    
    Control the diversity and coherence of generated text by limiting the selection of the next token.
    

### [`@built-in-ai/web-llm`](#built-in-aiweb-llm)

You can import the default provider instance `webLLM` from `@built-in-ai/web-llm`:

```ts
import { webLLM } from '@built-in-ai/web-llm';


const model = webLLM();
```

### [`@built-in-ai/transformers-js`](#built-in-aitransformers-js)

You can import the default provider instance `transformersJS` from `@built-in-ai/transformers-js`:

```ts
import { transformersJS } from '@built-in-ai/transformers-js';


const model = transformersJS();
```

## [Language Models](#language-models)

### [`@built-in-ai/core`](#built-in-aicore-1)

The provider will automatically work in all browsers that support the Prompt API since the browser handles model orchestration. For instance, if your client uses Edge, it will use [Phi4-mini](https://learn.microsoft.com/en-us/microsoft-edge/web-platform/prompt-api#the-phi-4-mini-model), and for Chrome it will use [Gemini Nano](https://developer.chrome.com/docs/ai/prompt-api#model_download).

### [`@built-in-ai/web-llm`](#built-in-aiweb-llm-1)

The provider allows using a ton of popular open-source models such as Llama3 and Qwen3. To see a complete list, please refer to the official [WebLLM documentation](https://github.com/mlc-ai/web-llm)

### [`@built-in-ai/transformers-js`](#built-in-aitransformers-js-1)

The provider allows using a ton of popular open-source models from Huggingface with the Transformers.js library.

### [Example usage](#example-usage)

#### [`@built-in-ai/core`](#built-in-aicore-2)

```ts
import { streamText } from 'ai';
import { builtInAI } from '@built-in-ai/core';


const result = streamText({
  model: builtInAI(), // will default to the specific browser model
  prompt: 'Hello, how are you',
});


for await (const chunk of result.textStream) {
  console.log(chunk);
}
```

#### [`@built-in-ai/web-llm`](#built-in-aiweb-llm-2)

```ts
import { streamText } from 'ai';
import { webLLM } from '@built-in-ai/web-llm';


const result = streamText({
  model: webLLM('Qwen3-0.6B-q0f16-MLC'),
  prompt: 'Hello, how are you',
});


for await (const chunk of result.textStream) {
  console.log(chunk);
}
```

#### [`@built-in-ai/transformers-js`](#built-in-aitransformers-js-2)

```ts
import { streamText } from 'ai';
import { transformersJS } from '@built-in-ai/transformers-js';


const result = streamText({
  model: transformersJS('HuggingFaceTB/SmolLM2-360M-Instruct'),
  prompt: 'Hello, how are you',
});


for await (const chunk of result.textStream) {
  console.log(chunk);
}
```

For more examples and API reference, check out the [documentation](https://github.com/jakobhoeg/built-in-ai)

[Previous

Portkey

](portkey.html)

[Next

Gemini CLI

](gemini-cli.html)

On this page

[Built-in AI](#built-in-ai)

[Setup](#setup)

[Installation](#installation)

[Browser-specific setup (@built-in-ai/core)](#browser-specific-setup-built-in-aicore)

[Provider Instances](#provider-instances)

[@built-in-ai/core](#built-in-aicore)

[@built-in-ai/web-llm](#built-in-aiweb-llm)

[@built-in-ai/transformers-js](#built-in-aitransformers-js)

[Language Models](#language-models)

[@built-in-ai/core](#built-in-aicore-1)

[@built-in-ai/web-llm](#built-in-aiweb-llm-1)

[@built-in-ai/transformers-js](#built-in-aitransformers-js-1)

[Example usage](#example-usage)

[@built-in-ai/core](#built-in-aicore-2)

[@built-in-ai/web-llm](#built-in-aiweb-llm-2)

[@built-in-ai/transformers-js](#built-in-aitransformers-js-2)

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