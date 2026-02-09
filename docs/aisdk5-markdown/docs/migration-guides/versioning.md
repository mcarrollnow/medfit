Migration Guides: Versioning

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

[Overview](../foundations/overview.html)

[Providers and Models](../foundations/providers-and-models.html)

[Prompts](../foundations/prompts.html)

[Tools](../foundations/tools.html)

[Streaming](../foundations/streaming.html)

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

[Versioning](versioning.html)

[Migrate Your Data to AI SDK 5.0](migration-guide-5-0-data.html)

[Migrate AI SDK 4.0 to 5.0](migration-guide-5-0.html)

[Migrate AI SDK 4.1 to 4.2](migration-guide-4-2.html)

[Migrate AI SDK 4.0 to 4.1](migration-guide-4-1.html)

[Migrate AI SDK 3.4 to 4.0](migration-guide-4-0.html)

[Migrate AI SDK 3.3 to 3.4](migration-guide-3-4.html)

[Migrate AI SDK 3.2 to 3.3](migration-guide-3-3.html)

[Migrate AI SDK 3.1 to 3.2](migration-guide-3-2.html)

[Migrate AI SDK 3.0 to 3.1](migration-guide-3-1.html)

[Troubleshooting](../troubleshooting.html)

[Migration Guides](../migration-guides.html)Versioning

# [Versioning](#versioning)

Each version number follows the format: `MAJOR.MINOR.PATCH`

-   **Major**: Breaking API updates that require code changes.
-   **Minor**: Blog post that aggregates new features and improvements into a public release that highlights benefits.
-   **Patch**: New features and bug fixes.

## [API Stability](#api-stability)

We communicate the stability of our APIs as follows:

### [Stable APIs](#stable-apis)

All APIs without special prefixes are considered stable and ready for production use. We maintain backward compatibility for stable features and only introduce breaking changes in major releases.

### [Experimental APIs](#experimental-apis)

APIs prefixed with `experimental_` or `Experimental_` (e.g. `experimental_generateImage()`) are in development and can change in any releases. To use experimental APIs safely:

1.  Test them first in development, not production
2.  Review release notes before upgrading
3.  Prepare for potential code updates

If you use experimental APIs, make sure to pin your AI SDK version number exactly (avoid using ^ or ~ version ranges) to prevent unexpected breaking changes.

### [Deprecated APIs](#deprecated-apis)

APIs marked as `deprecated` will be removed in future major releases. You can wait until the major release to update your code. To handle deprecations:

1.  Switch to the recommended alternative API
2.  Follow the migration guide (released alongside major releases)

For major releases, we provide automated codemods where possible to help migrate your code to the new version.

[Previous

Migration Guides

](../migration-guides.html)

[Next

Migrate Your Data to AI SDK 5.0

](migration-guide-5-0-data.html)

On this page

[Versioning](#versioning)

[API Stability](#api-stability)

[Stable APIs](#stable-apis)

[Experimental APIs](#experimental-apis)

[Deprecated APIs](#deprecated-apis)

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