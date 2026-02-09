Migration Guides: Migrate AI SDK 4.1 to 4.2

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

[Migration Guides](../migration-guides.html)Migrate AI SDK 4.1 to 4.2

# [Migrate AI SDK 4.1 to 4.2](#migrate-ai-sdk-41-to-42)

Check out the [AI SDK 4.2 release blog post](https://vercel.com/blog/ai-sdk-4-2) for more information about the release.

This guide will help you upgrade to AI SDK 4.2:

## [Stable APIs](#stable-apis)

The following APIs have been moved to stable and no longer have the `experimental_` prefix:

-   `customProvider`
-   `providerOptions` (renamed from `providerMetadata` for provider-specific inputs)
-   `providerMetadata` (for provider-specific outputs)
-   `toolCallStreaming` option for `streamText`

## [Dependency Versions](#dependency-versions)

AI SDK requires a non-optional `zod` dependency with version `^3.23.8`.

## [UI Message Parts](#ui-message-parts)

In AI SDK 4.2, we've redesigned how `useChat` handles model outputs with message parts and multiple steps. This is a significant improvement that simplifies rendering complex, multi-modal AI responses in your UI.

### [What's Changed](#whats-changed)

Assistant messages with tool calling now get combined into a single message with multiple parts, rather than creating separate messages for each step. This change addresses two key developments in AI applications:

1.  **Diverse Output Types**: Models now generate more than just text; they produce reasoning steps, sources, and tool calls.
2.  **Interleaved Outputs**: In multi-step agent use-cases, these different output types are frequently interleaved.

### [Benefits of the New Approach](#benefits-of-the-new-approach)

Previously, `useChat` stored different output types separately, which made it challenging to maintain the correct sequence in your UI when these elements were interleaved in a response, and led to multiple consecutive assistant messages when there were tool calls. For example:

```javascript
message.content = "Final answer: 42";
message.reasoning = "First I'll calculate X, then Y...";
message.toolInvocations = [{toolName: "calculator", args: {...}}];
```

This structure was limiting. The new message parts approach replaces separate properties with an ordered array that preserves the exact sequence:

```javascript
message.parts = [
  { type: "text", text: "Final answer: 42" },
  { type: "reasoning", reasoning: "First I'll calculate X, then Y..." },
  { type: "tool-invocation", toolInvocation: { toolName: "calculator", args: {...} } },
];
```

### [Migration](#migration)

Existing applications using the previous message format will need to update their UI components to handle the new `parts` array. The fields from the previous format are still available for backward compatibility, but we recommend migrating to the new format for better support of multi-modal and multi-step interactions.

You can use the `useChat` hook with the new message parts as follows:

```javascript
function Chat() {
  const { messages } = useChat();
  return (
    <div>
      {messages.map(message =>
        message.parts.map((part, i) => {
          switch (part.type) {
            case 'text':
              return <p key={i}>{part.text}</p>;
            case 'source':
              return <p key={i}>{part.source.url}</p>;
            case 'reasoning':
              return <div key={i}>{part.reasoning}</div>;
            case 'tool-invocation':
              return <div key={i}>{part.toolInvocation.toolName}</div>;
            case 'file':
              return (
                <img
                  key={i}
                  src={`data:${part.mediaType};base64,${part.data}`}
                />
              );
          }
        }),
      )}
    </div>
  );
}
```

[Previous

Migrate AI SDK 4.0 to 5.0

](migration-guide-5-0.html)

[Next

Migrate AI SDK 4.0 to 4.1

](migration-guide-4-1.html)

On this page

[Migrate AI SDK 4.1 to 4.2](#migrate-ai-sdk-41-to-42)

[Stable APIs](#stable-apis)

[Dependency Versions](#dependency-versions)

[UI Message Parts](#ui-message-parts)

[What's Changed](#whats-changed)

[Benefits of the New Approach](#benefits-of-the-new-approach)

[Migration](#migration)

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