Community Providers: Anthropic Vertex

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

[Community Providers](../community-providers.html)Anthropic Vertex

# [AnthropicVertex Provider](#anthropicvertex-provider)

Anthropic for Google Vertex is also support by the [AI SDK Google Vertex provider](../ai-sdk-providers/google-vertex.html).

This community provider is not yet compatible with AI SDK 5. Please wait for the provider to be updated or consider using an [AI SDK 5 compatible provider](../ai-sdk-providers.html).

[nalaso/anthropic-vertex-ai](https://github.com/nalaso/anthropic-vertex-ai) is a community provider that uses Anthropic models through Vertex AI to provide language model support for the AI SDK.

## [Setup](#setup)

The AnthropicVertex provider is available in the `anthropic-vertex-ai` module. You can install it with:

pnpm

npm

yarn

bun

pnpm add anthropic-vertex-ai

## [Provider Instance](#provider-instance)

You can import the default provider instance `anthropicVertex` from `anthropic-vertex-ai`:

```ts
import { anthropicVertex } from 'anthropic-vertex-ai';
```

If you need a customized setup, you can import `createAnthropicVertex` from `anthropic-vertex-ai` and create a provider instance with your settings:

```ts
import { createAnthropicVertex } from 'anthropic-vertex-ai';


const anthropicVertex = createAnthropicVertex({
  region: 'us-central1',
  projectId: 'your-project-id',
  // other options
});
```

You can use the following optional settings to customize the AnthropicVertex provider instance:

-   **region** *string*
    
    Your Google Vertex region. Defaults to the `GOOGLE_VERTEX_REGION` environment variable.
    
-   **projectId** *string*
    
    Your Google Vertex project ID. Defaults to the `GOOGLE_VERTEX_PROJECT_ID` environment variable.
    
-   **googleAuth** *GoogleAuth*
    
    Optional. The Authentication options provided by google-auth-library.
    
-   **baseURL** *string*
    
    Use a different URL prefix for API calls, e.g., to use proxy servers. The default prefix is `https://{region}-aiplatform.googleapis.com/v1`.
    
-   **headers** *Record<string,string>*
    
    Custom headers to include in the requests.
    
-   **fetch** *(input: RequestInfo, init?: RequestInit) => Promise<Response>*
    
    Custom fetch implementation. You can use it as a middleware to intercept requests, or to provide a custom fetch implementation for e.g., testing.
    

## [Language Models](#language-models)

You can create models that call the Anthropic API through Vertex AI using the provider instance. The first argument is the model ID, e.g., `claude-3-sonnet@20240229`:

```ts
const model = anthropicVertex('claude-3-sonnet@20240229');
```

### [Example: Generate Text](#example-generate-text)

You can use AnthropicVertex language models to generate text with the `generateText` function:

```ts
import { anthropicVertex } from 'anthropic-vertex-ai';
import { generateText } from 'ai';


const { text } = await generateText({
  model: anthropicVertex('claude-3-sonnet@20240229'),
  prompt: 'Write a vegetarian lasagna recipe for 4 people.',
});
```

AnthropicVertex language models can also be used in the `streamText`, `generateObject`, and `streamObject` functions (see [AI SDK Core](../../docs/ai-sdk-core.html) for more information).

### [Model Capabilities](#model-capabilities)

| Model | Image Input | Object Generation | Tool Usage | Tool Streaming |
| --- | --- | --- | --- | --- |
| `claude-3-5-sonnet@20240620` |  |  |  |  |
| `claude-3-opus@20240229` |  |  |  |  |
| `claude-3-sonnet@20240229` |  |  |  |  |
| `claude-3-haiku@20240307` |  |  |  |  |

## [Environment Variables](#environment-variables)

To use the AnthropicVertex provider, you need to set up the following environment variables:

-   `GOOGLE_VERTEX_REGION`: Your Google Vertex region (e.g., 'us-central1')
-   `GOOGLE_VERTEX_PROJECT_ID`: Your Google Cloud project ID

Make sure to set these variables in your environment or in a `.env` file in your project root.

## [Authentication](#authentication)

The AnthropicVertex provider uses Google Cloud authentication. Make sure you have set up your Google Cloud credentials properly. You can either use a service account key file or default application credentials.

For more information on setting up authentication, refer to the [Google Cloud Authentication guide](https://cloud.google.com/docs/authentication).

[Previous

React Native Apple

](react-native-apple.html)

[Next

Spark

](spark.html)

On this page

[AnthropicVertex Provider](#anthropicvertex-provider)

[Setup](#setup)

[Provider Instance](#provider-instance)

[Language Models](#language-models)

[Example: Generate Text](#example-generate-text)

[Model Capabilities](#model-capabilities)

[Environment Variables](#environment-variables)

[Authentication](#authentication)

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