AI SDK 5 is available now.










Menu






















































































































































































































































































































































# [Providers and Models](#providers-and-models)

Companies such as OpenAI and Anthropic (providers) offer access to a range of large language models (LLMs) with differing strengths and capabilities through their own APIs.

Each provider typically has its own unique method for interfacing with their models, complicating the process of switching providers and increasing the risk of vendor lock-in.


Here is an overview of the AI SDK Provider Architecture:


## [AI SDK Providers](#ai-sdk-providers)

The AI SDK comes with a wide range of providers that you can use to interact with different language models:

- [xAI Grok Provider](../../providers/ai-sdk-providers/xai.html) (`@ai-sdk/xai`)
- [OpenAI Provider](../../providers/ai-sdk-providers/openai.html) (`@ai-sdk/openai`)
- [Azure OpenAI Provider](../../providers/ai-sdk-providers/azure.html) (`@ai-sdk/azure`)
- [Anthropic Provider](../../providers/ai-sdk-providers/anthropic.html) (`@ai-sdk/anthropic`)
- [Amazon Bedrock Provider](../../providers/ai-sdk-providers/amazon-bedrock.html) (`@ai-sdk/amazon-bedrock`)
- [Google Generative AI Provider](../../providers/ai-sdk-providers/google-generative-ai.html) (`@ai-sdk/google`)
- [Google Vertex Provider](../../providers/ai-sdk-providers/google-vertex.html) (`@ai-sdk/google-vertex`)
- [Mistral Provider](../../providers/ai-sdk-providers/mistral.html) (`@ai-sdk/mistral`)
- [Together.ai Provider](../../providers/ai-sdk-providers/togetherai.html) (`@ai-sdk/togetherai`)
- [Cohere Provider](../../providers/ai-sdk-providers/cohere.html) (`@ai-sdk/cohere`)
- [Fireworks Provider](../../providers/ai-sdk-providers/fireworks.html) (`@ai-sdk/fireworks`)
- [DeepInfra Provider](../../providers/ai-sdk-providers/deepinfra.html) (`@ai-sdk/deepinfra`)
- [DeepSeek Provider](../../providers/ai-sdk-providers/deepseek.html) (`@ai-sdk/deepseek`)
- [Cerebras Provider](../../providers/ai-sdk-providers/cerebras.html) (`@ai-sdk/cerebras`)
- [Groq Provider](../../providers/ai-sdk-providers/groq.html) (`@ai-sdk/groq`)
- [Perplexity Provider](../../providers/ai-sdk-providers/perplexity.html) (`@ai-sdk/perplexity`)
- [ElevenLabs Provider](../../providers/ai-sdk-providers/elevenlabs.html) (`@ai-sdk/elevenlabs`)
- [LMNT Provider](../../providers/ai-sdk-providers/lmnt.html) (`@ai-sdk/lmnt`)
- [Hume Provider](../../providers/ai-sdk-providers/hume.html) (`@ai-sdk/hume`)
- [Rev.ai Provider](../../providers/ai-sdk-providers/revai.html) (`@ai-sdk/revai`)
- [Deepgram Provider](../../providers/ai-sdk-providers/deepgram.html) (`@ai-sdk/deepgram`)
- [Gladia Provider](../../providers/ai-sdk-providers/gladia.html) (`@ai-sdk/gladia`)
- [LMNT Provider](../../providers/ai-sdk-providers/lmnt.html) (`@ai-sdk/lmnt`)
- [AssemblyAI Provider](../../providers/ai-sdk-providers/assemblyai.html) (`@ai-sdk/assemblyai`)
- [Baseten](../../providers/ai-sdk-providers/baseten.html)

You can also use the [OpenAI Compatible provider](../../providers/openai-compatible-providers.html) with OpenAI-compatible APIs:

- [LM Studio](../../providers/openai-compatible-providers/lmstudio.html)
- [Heroku](../../providers/openai-compatible-providers/heroku.html)


The open-source community has created the following providers:

- [Ollama Provider](../../providers/community-providers/ollama.html) (`ollama-ai-provider`)
- [FriendliAI Provider](../../providers/community-providers/friendliai.html) (`@friendliai/ai-provider`)
- [Portkey Provider](../../providers/community-providers/portkey.html) (`@portkey-ai/vercel-provider`)
- [Cloudflare Workers AI Provider](../../providers/community-providers/cloudflare-workers-ai.html) (`workers-ai-provider`)
- [OpenRouter Provider](../../providers/community-providers/openrouter.html) (`@openrouter/ai-sdk-provider`)
- [Aihubmix Provider](../../providers/community-providers/aihubmix.html) (`@aihubmix/ai-sdk-provider`)
- [Requesty Provider](../../providers/community-providers/requesty.html) (`@requesty/ai-sdk`)
- [Crosshatch Provider](../../providers/community-providers/crosshatch.html) (`@crosshatch/ai-provider`)
- [Mixedbread Provider](../../providers/community-providers/mixedbread.html) (`mixedbread-ai-provider`)
- [Voyage AI Provider](../../providers/community-providers/voyage-ai.html) (`voyage-ai-provider`)
- [Mem0 Provider](../../providers/community-providers/mem0.html)(`@mem0/vercel-ai-provider`)
- [Letta Provider](../../providers/community-providers/letta.html)(`@letta-ai/vercel-ai-sdk-provider`)
- [Supermemory Provider](../../providers/community-providers/supermemory.html)(`@supermemory/tools`)
- [Spark Provider](../../providers/community-providers/spark.html) (`spark-ai-provider`)
- [AnthropicVertex Provider](../../providers/community-providers/anthropic-vertex-ai.html) (`anthropic-vertex-ai`)
- [LangDB Provider](../../providers/community-providers/langdb.html) (`@langdb/vercel-provider`)
- [Dify Provider](../../providers/community-providers/dify.html) (`dify-ai-provider`)
- [Sarvam Provider](../../providers/community-providers/sarvam.html) (`sarvam-ai-provider`)
- [Claude Code Provider](../../providers/community-providers/claude-code.html) (`ai-sdk-provider-claude-code`)
- [Built-in AI Provider](../../providers/community-providers/built-in-ai.html) (`built-in-ai`)
- [Gemini CLI Provider](../../providers/community-providers/gemini-cli.html) (`ai-sdk-provider-gemini-cli`)
- [A2A Provider](../../providers/community-providers/a2a.html) (`a2a-ai-provider`)
- [SAP-AI Provider](../../providers/community-providers/sap-ai.html) (`@mymediset/sap-ai-provider`)
- [AI/ML API Provider](../../providers/community-providers/aimlapi.html) (`@ai-ml.api/aimlapi-vercel-ai`)

## [Self-Hosted Models](#self-hosted-models)

You can access self-hosted models with the following providers:

- [Ollama Provider](../../providers/community-providers/ollama.html)
- [LM Studio](../../providers/openai-compatible-providers/lmstudio.html)
- [Baseten](../../providers/ai-sdk-providers/baseten.html)
- [Built-in AI](../../providers/community-providers/built-in-ai.html)

Additionally, any self-hosted provider that supports the OpenAI specification can be used with the [OpenAI Compatible Provider](../../providers/openai-compatible-providers.html).

## [Model Capabilities](#model-capabilities)

The AI providers support different language models with various capabilities. Here are the capabilities of popular models:


| Provider | Model | Image Input | Object Generation | Tool Usage | Tool Streaming |
|----|----|----|----|----|----|





This table is not exhaustive. Additional models can be found in the provider documentation pages and on the provider websites.


















On this page






















Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.