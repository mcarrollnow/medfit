Community Providers: Claude Code

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

[Community Providers](../community-providers.html)Claude Code

# [Claude Code Provider](#claude-code-provider)

The [ai-sdk-provider-claude-code](https://github.com/ben-vargas/ai-sdk-provider-claude-code) community provider allows you to access Claude models through the official Claude Code SDK/CLI. While it works with both Claude Pro/Max subscriptions and API key authentication, it's particularly useful for developers who want to use their existing Claude subscription without managing API keys.

## [Version Compatibility](#version-compatibility)

The Claude Code provider supports both AI SDK v4 and v5-beta:

| Provider Version | AI SDK Version | Status | Branch |
| --- | --- | --- | --- |
| 0.x | v4 | Stable | [`ai-sdk-v4`](https://github.com/ben-vargas/ai-sdk-provider-claude-code/tree/ai-sdk-v4) |
| 1.x-beta | v5-beta | Beta | [`main`](https://github.com/ben-vargas/ai-sdk-provider-claude-code/tree/main) |

## [Setup](#setup)

The Claude Code provider is available in the `ai-sdk-provider-claude-code` module. Install the version that matches your AI SDK version:

### [For AI SDK v5-beta (latest)](#for-ai-sdk-v5-beta-latest)

pnpm

npm

yarn

bun

pnpm add ai-sdk-provider-claude-code ai

### [For AI SDK v4 (stable)](#for-ai-sdk-v4-stable)

pnpm

npm

yarn

bun

pnpm add ai-sdk-provider-claude-code@^0 ai@^4

## [Provider Instance](#provider-instance)

You can import the default provider instance `claudeCode` from `ai-sdk-provider-claude-code`:

```ts
import { claudeCode } from 'ai-sdk-provider-claude-code';
```

If you need a customized setup, you can import `createClaudeCode` from `ai-sdk-provider-claude-code` and create a provider instance with your settings:

```ts
import { createClaudeCode } from 'ai-sdk-provider-claude-code';


const claudeCode = createClaudeCode({
  allowedTools: ['Read', 'Write', 'Edit'],
  disallowedTools: ['Bash'],
  // other options
});
```

You can use the following optional settings to customize the Claude Code provider instance:

-   **anthropicDir** *string*
    
    Optional. Directory for Claude Code CLI data. Defaults to `~/.claude/claude_code`.
    
-   **allowedTools** *string\[\]*
    
    Optional. List of allowed tools. When specified, only these tools will be available.
    
-   **disallowedTools** *string\[\]*
    
    Optional. List of disallowed tools. These tools will be blocked even if enabled in settings.
    
-   **mcpServers** *string\[\]*
    
    Optional. List of MCP server names to use for this session.
    

## [Language Models](#language-models)

You can create models that call Claude through the Claude Code CLI using the provider instance. The first argument is the model ID:

```ts
const model = claudeCode('opus');
```

Claude Code supports the following models:

-   **opus**: Claude 4 Opus (most capable)
-   **sonnet**: Claude 4 Sonnet (balanced performance)

### [Example: Generate Text](#example-generate-text)

You can use Claude Code language models to generate text with the `generateText` function:

```ts
import { claudeCode } from 'ai-sdk-provider-claude-code';
import { generateText } from 'ai';


// AI SDK v4
const { text } = await generateText({
  model: claudeCode('opus'),
  prompt: 'Write a vegetarian lasagna recipe for 4 people.',
});


// AI SDK v5-beta
const result = await generateText({
  model: claudeCode('opus'),
  prompt: 'Write a vegetarian lasagna recipe for 4 people.',
});
const text = await result.text;
```

Claude Code language models can also be used in the `streamText`, `generateObject`, and `streamObject` functions (see [AI SDK Core](../../docs/ai-sdk-core.html) for more information).

The response format differs between AI SDK v4 and v5-beta. In v4, text is accessed directly via `result.text`. In v5-beta, it's accessed as a promise via `await result.text`. Make sure to use the appropriate format for your AI SDK version.

### [Model Capabilities](#model-capabilities)

| Model | Image Input | Object Generation | Tool Usage | Tool Streaming |
| --- | --- | --- | --- | --- |
| `opus` |  |  |  |  |
| `sonnet` |  |  |  |  |

The ❌ for "Tool Usage" and "Tool Streaming" refers specifically to the AI SDK's standardized tool interface, which allows defining custom functions with schemas that models can call. The Claude Code provider uses a different architecture where Claude's built-in tools (Bash, Edit, Read, Write, etc.) and MCP servers are managed directly by the Claude Code CLI. While you cannot define custom tools using the AI SDK's conventions, Claude can still effectively use its comprehensive set of built-in tools to perform tasks like file manipulation, web fetching, and command execution.

## [Authentication](#authentication)

The Claude Code provider uses your existing Claude Pro or Max subscription through the Claude Code CLI. You need to authenticate once using:

```bash
claude login
```

This will open a browser window for authentication. Once authenticated, the provider will use your subscription automatically.

## [Built-in Tools](#built-in-tools)

One of the unique features of the Claude Code provider is access to Claude's built-in tools:

-   **Bash**: Execute shell commands
-   **Edit**: Edit files with precise replacements
-   **Read**: Read file contents
-   **Write**: Write new files
-   **LS**: List directory contents
-   **Grep**: Search file contents
-   **WebFetch**: Fetch and analyze web content
-   And more...

You can control which tools are available per session using the `allowedTools` and `disallowedTools` options.

## [Extended Thinking](#extended-thinking)

The Claude Code provider supports Claude Opus 4's extended thinking capabilities with proper timeout management. When using extended thinking, make sure to provide an appropriate AbortSignal with a timeout of up to 10 minutes:

```ts
const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 10 * 60 * 1000); // 10 minutes


try {
  const { text } = await generateText({
    model: claudeCode('opus'),
    prompt: 'Solve this complex problem...',
    abortSignal: controller.signal,
  });
} finally {
  clearTimeout(timeout);
}
```

## [Requirements](#requirements)

-   Node.js 18 or higher
-   Claude Code CLI installed (`npm install -g @anthropic-ai/claude-code`)
-   Claude Code authenticated with Pro or Max subscription, or API key.

[Previous

AI/ML API

](aimlapi.html)

[Next

Adapters

](../adapters.html)

On this page

[Claude Code Provider](#claude-code-provider)

[Version Compatibility](#version-compatibility)

[Setup](#setup)

[For AI SDK v5-beta (latest)](#for-ai-sdk-v5-beta-latest)

[For AI SDK v4 (stable)](#for-ai-sdk-v4-stable)

[Provider Instance](#provider-instance)

[Language Models](#language-models)

[Example: Generate Text](#example-generate-text)

[Model Capabilities](#model-capabilities)

[Authentication](#authentication)

[Built-in Tools](#built-in-tools)

[Extended Thinking](#extended-thinking)

[Requirements](#requirements)

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