AI SDK Core: Model Context Protocol (MCP) Tools

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

[Overview](overview.html)

[Generating Text](generating-text.html)

[Generating Structured Data](generating-structured-data.html)

[Tool Calling](tools-and-tool-calling.html)

[Model Context Protocol (MCP) Tools](mcp-tools.html)

[Prompt Engineering](prompt-engineering.html)

[Settings](settings.html)

[Embeddings](embeddings.html)

[Image Generation](image-generation.html)

[Transcription](transcription.html)

[Speech](speech.html)

[Language Model Middleware](middleware.html)

[Provider & Model Management](provider-management.html)

[Error Handling](error-handling.html)

[Testing](testing.html)

[Telemetry](telemetry.html)

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

[AI SDK Core](../ai-sdk-core.html)Model Context Protocol (MCP) Tools

# [Model Context Protocol (MCP) Tools](#model-context-protocol-mcp-tools)

The MCP tools feature is experimental and may change in the future.

The AI SDK supports connecting to [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) servers to access their tools. This enables your AI applications to discover and use tools across various services through a standardized interface.

## [Initializing an MCP Client](#initializing-an-mcp-client)

We recommend using HTTP transport (like `StreamableHTTPClientTransport`) for production deployments. The stdio transport should only be used for connecting to local servers as it cannot be deployed to production environments.

Create an MCP client using one of the following transport options:

-   **HTTP transport (Recommended)**: Use transports from MCP's official TypeScript SDK like `StreamableHTTPClientTransport` for production deployments
-   SSE (Server-Sent Events): An alternative HTTP-based transport
-   `stdio`: For local development only. Uses standard input/output streams for local MCP servers

### [HTTP Transport (Recommended)](#http-transport-recommended)

For production deployments, we recommend using HTTP transports like `StreamableHTTPClientTransport` from MCP's official TypeScript SDK:

```typescript
import { experimental_createMCPClient as createMCPClient } from 'ai';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';


const url = new URL('https://your-server.com/mcp');
const mcpClient = await createMCPClient({
  transport: new StreamableHTTPClientTransport(url, {
    sessionId: 'session_123',
  }),
});
```

### [SSE Transport](#sse-transport)

SSE provides an alternative HTTP-based transport option. Configure it with a `type` and `url` property:

```typescript
import { experimental_createMCPClient as createMCPClient } from 'ai';


const mcpClient = await createMCPClient({
  transport: {
    type: 'sse',
    url: 'https://my-server.com/sse',


    // optional: configure HTTP headers, e.g. for authentication
    headers: {
      Authorization: 'Bearer my-api-key',
    },
  },
});
```

### [Stdio Transport (Local Servers)](#stdio-transport-local-servers)

The stdio transport should only be used for local servers.

The Stdio transport can be imported from either the MCP SDK or the AI SDK:

```typescript
import { experimental_createMCPClient as createMCPClient } from 'ai';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
// Or use the AI SDK's stdio transport:
// import { Experimental_StdioMCPTransport as StdioClientTransport } from 'ai/mcp-stdio';


const mcpClient = await createMCPClient({
  transport: new StdioClientTransport({
    command: 'node',
    args: ['src/stdio/dist/server.js'],
  }),
});
```

### [Custom Transport](#custom-transport)

You can also bring your own transport by implementing the `MCPTransport` interface for specific requirements not covered by the standard transports.

The client returned by the `experimental_createMCPClient` function is a lightweight client intended for use in tool conversion. It currently does not support all features of the full MCP client, such as: authorization, session management, resumable streams, and receiving notifications.

### [Closing the MCP Client](#closing-the-mcp-client)

After initialization, you should close the MCP client based on your usage pattern:

-   For short-lived usage (e.g., single requests), close the client when the response is finished
-   For long-running clients (e.g., command line apps), keep the client open but ensure it's closed when the application terminates

When streaming responses, you can close the client when the LLM response has finished. For example, when using `streamText`, you should use the `onFinish` callback:

```typescript
const mcpClient = await experimental_createMCPClient({
  // ...
});


const tools = await mcpClient.tools();


const result = await streamText({
  model: 'openai/gpt-4.1',
  tools,
  prompt: 'What is the weather in Brooklyn, New York?',
  onFinish: async () => {
    await mcpClient.close();
  },
});
```

When generating responses without streaming, you can use try/finally or cleanup functions in your framework:

```typescript
let mcpClient: MCPClient | undefined;


try {
  mcpClient = await experimental_createMCPClient({
    // ...
  });
} finally {
  await mcpClient?.close();
}
```

## [Using MCP Tools](#using-mcp-tools)

The client's `tools` method acts as an adapter between MCP tools and AI SDK tools. It supports two approaches for working with tool schemas:

### [Schema Discovery](#schema-discovery)

With schema discovery, all tools offered by the server are automatically listed, and input parameter types are inferred based on the schemas provided by the server:

```typescript
const tools = await mcpClient.tools();
```

This approach is simpler to implement and automatically stays in sync with server changes. However, you won't have TypeScript type safety during development, and all tools from the server will be loaded

### [Schema Definition](#schema-definition)

For better type safety and control, you can define the tools and their input schemas explicitly in your client code:

```typescript
import { z } from 'zod';


const tools = await mcpClient.tools({
  schemas: {
    'get-data': {
      inputSchema: z.object({
        query: z.string().describe('The data query'),
        format: z.enum(['json', 'text']).optional(),
      }),
    },
    // For tools with zero inputs, you should use an empty object:
    'tool-with-no-args': {
      inputSchema: z.object({}),
    },
  },
});
```

This approach provides full TypeScript type safety and IDE autocompletion, letting you catch parameter mismatches during development. When you define `schemas`, the client only pulls the explicitly defined tools, keeping your application focused on the tools it needs

## [Examples](#examples)

You can see MCP tools in action in the following example:

[

Learn to use MCP tools in Node.js

](../../cookbook/node/mcp-tools.html)

[Previous

Tool Calling

](tools-and-tool-calling.html)

[Next

Prompt Engineering

](prompt-engineering.html)

On this page

[Model Context Protocol (MCP) Tools](#model-context-protocol-mcp-tools)

[Initializing an MCP Client](#initializing-an-mcp-client)

[HTTP Transport (Recommended)](#http-transport-recommended)

[SSE Transport](#sse-transport)

[Stdio Transport (Local Servers)](#stdio-transport-local-servers)

[Custom Transport](#custom-transport)

[Closing the MCP Client](#closing-the-mcp-client)

[Using MCP Tools](#using-mcp-tools)

[Schema Discovery](#schema-discovery)

[Schema Definition](#schema-definition)

[Examples](#examples)

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