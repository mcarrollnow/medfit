Foundations: Tools

[](https://vercel.com/)

[

AI SDK



](../../index.html)

-   [Docs](../introduction.html)
-   [Cookbook](../../cookbook.html)
-   [Providers](../../providers/ai-sdk-providers.html)
-   [Playground](../../playground.html)
-   [
    
    AI ElementsAI Elements
    
    ](../../elements/overview.html)
-   [AI GatewayGateway](https://vercel.com/ai-gateway)

AI SDK 5 is available now.

[View Announcement](https://vercel.com/blog/ai-sdk-5)

Menu

[AI SDK by Vercel](../introduction.html)

[Foundations](../foundations.html)

[Overview](overview.html)

[Providers and Models](providers-and-models.html)

[Prompts](prompts.html)

[Tools](tools.html)

[Streaming](streaming.html)

[Getting Started](../getting-started.html)

[Navigating the Library](../getting-started/navigating-the-library.html)

[Next.js App Router](../getting-started/nextjs-app-router.html)

[Next.js Pages Router](../getting-started/nextjs-pages-router.html)

[Svelte](../getting-started/svelte.html)

[Vue.js (Nuxt)](../getting-started/nuxt.html)

[Node.js](../getting-started/nodejs.html)

[Expo](../getting-started/expo.html)

[Agents](../agents.html)

[Agents](../agents/overview.html)

[Building Agents](../agents/building-agents.html)

[Workflow Patterns](../agents/workflows.html)

[Loop Control](../agents/loop-control.html)

[AI SDK Core](../ai-sdk-core.html)

[Overview](../ai-sdk-core/overview.html)

[Generating Text](../ai-sdk-core/generating-text.html)

[Generating Structured Data](../ai-sdk-core/generating-structured-data.html)

[Tool Calling](../ai-sdk-core/tools-and-tool-calling.html)

[Model Context Protocol (MCP) Tools](../ai-sdk-core/mcp-tools.html)

[Prompt Engineering](../ai-sdk-core/prompt-engineering.html)

[Settings](../ai-sdk-core/settings.html)

[Embeddings](../ai-sdk-core/embeddings.html)

[Image Generation](../ai-sdk-core/image-generation.html)

[Transcription](../ai-sdk-core/transcription.html)

[Speech](../ai-sdk-core/speech.html)

[Language Model Middleware](../ai-sdk-core/middleware.html)

[Provider & Model Management](../ai-sdk-core/provider-management.html)

[Error Handling](../ai-sdk-core/error-handling.html)

[Testing](../ai-sdk-core/testing.html)

[Telemetry](../ai-sdk-core/telemetry.html)

[AI SDK UI](../ai-sdk-ui.html)

[Overview](../ai-sdk-ui/overview.html)

[Chatbot](../ai-sdk-ui/chatbot.html)

[Chatbot Message Persistence](../ai-sdk-ui/chatbot-message-persistence.html)

[Chatbot Resume Streams](../ai-sdk-ui/chatbot-resume-streams.html)

[Chatbot Tool Usage](../ai-sdk-ui/chatbot-tool-usage.html)

[Generative User Interfaces](../ai-sdk-ui/generative-user-interfaces.html)

[Completion](../ai-sdk-ui/completion.html)

[Object Generation](../ai-sdk-ui/object-generation.html)

[Streaming Custom Data](../ai-sdk-ui/streaming-data.html)

[Error Handling](../ai-sdk-ui/error-handling.html)

[Transport](../ai-sdk-ui/transport.html)

[Reading UIMessage Streams](../ai-sdk-ui/reading-ui-message-streams.html)

[Message Metadata](../ai-sdk-ui/message-metadata.html)

[Stream Protocols](../ai-sdk-ui/stream-protocol.html)

[AI SDK RSC](../ai-sdk-rsc.html)

[Advanced](../advanced.html)

[Reference](../reference.html)

[AI SDK Core](../reference/ai-sdk-core.html)

[AI SDK UI](../reference/ai-sdk-ui.html)

[AI SDK RSC](../reference/ai-sdk-rsc.html)

[Stream Helpers](../reference/stream-helpers.html)

[AI SDK Errors](../reference/ai-sdk-errors.html)

[Migration Guides](../migration-guides.html)

[Troubleshooting](../troubleshooting.html)

[Foundations](../foundations.html)Tools

# [Tools](#tools)

While [large language models (LLMs)](overview.html#large-language-models) have incredible generation capabilities, they struggle with discrete tasks (e.g. mathematics) and interacting with the outside world (e.g. getting the weather).

Tools are actions that an LLM can invoke. The results of these actions can be reported back to the LLM to be considered in the next response.

For example, when you ask an LLM for the "weather in London", and there is a weather tool available, it could call a tool with London as the argument. The tool would then fetch the weather data and return it to the LLM. The LLM can then use this information in its response.

## [What is a tool?](#what-is-a-tool)

A tool is an object that can be called by the model to perform a specific task. You can use tools with [`generateText`](../reference/ai-sdk-core/generate-text.html) and [`streamText`](../reference/ai-sdk-core/stream-text.html) by passing one or more tools to the `tools` parameter.

A tool consists of three properties:

-   **`description`**: An optional description of the tool that can influence when the tool is picked.
-   **`inputSchema`**: A [Zod schema](#schema-specification-and-validation-with-zod) or a [JSON schema](../reference/ai-sdk-core/json-schema.html) that defines the input required for the tool to run. The schema is consumed by the LLM, and also used to validate the LLM tool calls.
-   **`execute`**: An optional async function that is called with the arguments from the tool call.

`streamUI` uses UI generator tools with a `generate` function that can return React components.

If the LLM decides to use a tool, it will generate a tool call. Tools with an `execute` function are run automatically when these calls are generated. The output of the tool calls are returned using tool result objects.

You can automatically pass tool results back to the LLM using [multi-step calls](../ai-sdk-core/tools-and-tool-calling.html#multi-step-calls) with `streamText` and `generateText`.

## [Schemas](#schemas)

Schemas are used to define the parameters for tools and to validate the [tool calls](../ai-sdk-core/tools-and-tool-calling.html).

The AI SDK supports both raw JSON schemas (using the [`jsonSchema` function](../reference/ai-sdk-core/json-schema.html)) and [Zod](https://zod.dev/) schemas (either directly or using the [`zodSchema` function](../reference/ai-sdk-core/zod-schema.html)).

[Zod](https://zod.dev/) is a popular TypeScript schema validation library. You can install it with:

pnpm

npm

yarn

bun

pnpm add zod

You can then specify a Zod schema, for example:

```ts
import z from 'zod';


const recipeSchema = z.object({
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
});
```

You can also use schemas for structured output generation with [`generateObject`](../reference/ai-sdk-core/generate-object.html) and [`streamObject`](../reference/ai-sdk-core/stream-object.html).

## [Toolkits](#toolkits)

When you work with tools, you typically need a mix of application specific tools and general purpose tools. There are several providers that offer pre-built tools as **toolkits** that you can use out of the box:

-   **[agentic](https://docs.agentic.so/marketplace/ts-sdks/ai-sdk)** - A collection of 20+ tools. Most tools connect to access external APIs such as [Exa](https://exa.ai/) or [E2B](https://e2b.dev/).
-   **[browserbase](https://docs.browserbase.com/integrations/vercel/introduction#vercel-ai-integration)** - Browser tool that runs a headless browser
-   **[browserless](https://docs.browserless.io/ai-integrations/vercel-ai-sdk)** - Browser automation service with AI integration - self hosted or cloud based
-   **[Stripe agent tools](https://docs.stripe.com/agents?framework=vercel)** - Tools for interacting with Stripe.
-   **[StackOne ToolSet](https://docs.stackone.com/agents/typescript/frameworks/vercel-ai-sdk)** - Agentic integrations for hundreds of [enterprise SaaS](https://www.stackone.com/integrations)
-   **[Toolhouse](https://docs.toolhouse.ai/toolhouse/toolhouse-sdk/using-vercel-ai)** - AI function-calling in 3 lines of code for over 25 different actions.
-   **[Agent Tools](https://ai-sdk-agents.vercel.app/?item=introduction)** - A collection of tools for agents.
-   **[AI Tool Maker](https://github.com/nihaocami/ai-tool-maker)** - A CLI utility to generate AI SDK tools from OpenAPI specs.
-   **[Composio](https://docs.composio.dev/providers/vercel)** - Composio provides 250+ tools like GitHub, Gmail, Salesforce and [more](https://composio.dev/tools).
-   **[Interlify](https://www.interlify.com/docs/integrate-with-vercel-ai)** - Convert APIs into tools so that AI can connect to your backend in minutes.
-   **[JigsawStack](http://www.jigsawstack.com/docs/integration/vercel)** - JigsawStack provides over 30+ small custom fine tuned models available for specific uses.
-   **[AI Tools Registry](https://ai-tools-registry.vercel.app)** - A Shadcn compatible tool definitions and components registry for the AI SDK.
-   **[DeepAgent](https://deepagent.amardeep.space/docs/vercel-ai-sdk)** - A powerful suite of 50+ AI tools and integrations, seamlessly connecting with APIs like Tavily, E2B, Airtable and [more](https://deepagent.amardeep.space/docs) to build enterprise-ready AI agents.
-   **[Smithery](https://smithery.ai/docs/integrations/vercel_ai_sdk)** - Smithery provides an open marketplace of 6K+ MCPs, including [Browserbase](https://browserbase.com/) and [Exa](https://exa.ai/).

Do you have open source tools or tool libraries that are compatible with the AI SDK? Please [file a pull request](https://github.com/vercel/ai/pulls) to add them to this list.

## [Learn more](#learn-more)

The AI SDK Core [Tool Calling](../ai-sdk-core/tools-and-tool-calling.html) and [Agents](../agents/overview.html) documentation has more information about tools and tool calling.

[Previous

Prompts

](prompts.html)

[Next

Streaming

](streaming.html)

On this page

[Tools](#tools)

[What is a tool?](#what-is-a-tool)

[Schemas](#schemas)

[Toolkits](#toolkits)

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

[Docs](../introduction.html)[Cookbook](../../cookbook.html)[Providers](../../providers/ai-sdk-providers.html)[Showcase](../../showcase.html)[GitHub](https://github.com/vercel/ai)[Discussions](https://github.com/vercel/ai/discussions)

#### More

[Playground](../../playground.html)[](https://v0.dev)[Contact Sales](https://vercel.com/contact/sales)

#### About Vercel

[Next.js + Vercel](https://vercel.com/frameworks/nextjs)[Open Source Software](https://vercel.com/oss)[GitHub](https://github.com/vercel)[X](https://x.com/vercel)

#### Legal

[Privacy Policy](https://vercel.com/legal/privacy-policy)

© 2025 Vercel, Inc.