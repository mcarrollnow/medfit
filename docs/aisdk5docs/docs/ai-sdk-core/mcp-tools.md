AI SDK 5 is available now.










Menu






















































































































































































































































































































































# [Model Context Protocol (MCP) Tools](#model-context-protocol-mcp-tools)




The MCP tools feature is experimental and may change in the future.




## [Initializing an MCP Client](#initializing-an-mcp-client)

We recommend using HTTP transport (like `StreamableHTTPClientTransport`) for production deployments. The stdio transport should only be used for connecting to local servers as it cannot be deployed to production environments.

Create an MCP client using one of the following transport options:

- **HTTP transport (Recommended)**: Use transports from MCP's official TypeScript SDK like `StreamableHTTPClientTransport` for production deployments
- SSE (Server-Sent Events): An alternative HTTP-based transport
- `stdio`: For local development only. Uses standard input/output streams for local MCP servers

### [HTTP Transport (Recommended)](#http-transport-recommended)

For production deployments, we recommend using HTTP transports like `StreamableHTTPClientTransport` from MCP's official TypeScript SDK:



``` typescript
import  from 'ai';import  from '@modelcontextprotocol/sdk/client/streamableHttp.js';
const url = new URL('https://your-server.com/mcp');const mcpClient = await createMCPClient(),});
```


### [SSE Transport](#sse-transport)

SSE provides an alternative HTTP-based transport option. Configure it with a `type` and `url` property:



``` typescript
import  from 'ai';
const mcpClient = await createMCPClient(,  },});
```


### [Stdio Transport (Local Servers)](#stdio-transport-local-servers)




The stdio transport should only be used for local servers.



The Stdio transport can be imported from either the MCP SDK or the AI SDK:



``` typescript
import  from 'ai';import  from '@modelcontextprotocol/sdk/client/stdio.js';// Or use the AI SDK's stdio transport:// import  from 'ai/mcp-stdio';
const mcpClient = await createMCPClient(),});
```


### [Custom Transport](#custom-transport)

You can also bring your own transport by implementing the `MCPTransport` interface for specific requirements not covered by the standard transports.




The client returned by the `experimental_createMCPClient` function is a lightweight client intended for use in tool conversion. It currently does not support all features of the full MCP client, such as: authorization, session management, resumable streams, and receiving notifications.



### [Closing the MCP Client](#closing-the-mcp-client)

After initialization, you should close the MCP client based on your usage pattern:

- For short-lived usage (e.g., single requests), close the client when the response is finished
- For long-running clients (e.g., command line apps), keep the client open but ensure it's closed when the application terminates

When streaming responses, you can close the client when the LLM response has finished. For example, when using `streamText`, you should use the `onFinish` callback:



``` typescript
const mcpClient = await experimental_createMCPClient();
const tools = await mcpClient.tools();
const result = await streamText(,});
```


When generating responses without streaming, you can use try/finally or cleanup functions in your framework:



``` typescript
let mcpClient: MCPClient | undefined;
try );} finally 
```


## [Using MCP Tools](#using-mcp-tools)

The client's `tools` method acts as an adapter between MCP tools and AI SDK tools. It supports two approaches for working with tool schemas:

### [Schema Discovery](#schema-discovery)

With schema discovery, all tools offered by the server are automatically listed, and input parameter types are inferred based on the schemas provided by the server:



``` typescript
const tools = await mcpClient.tools();
```


This approach is simpler to implement and automatically stays in sync with server changes. However, you won't have TypeScript type safety during development, and all tools from the server will be loaded

### [Schema Definition](#schema-definition)

For better type safety and control, you can define the tools and their input schemas explicitly in your client code:



``` typescript
import  from 'zod';
const tools = await mcpClient.tools(),    },    // For tools with zero inputs, you should use an empty object:    'tool-with-no-args': ),    },  },});
```


This approach provides full TypeScript type safety and IDE autocompletion, letting you catch parameter mismatches during development. When you define `schemas`, the client only pulls the explicitly defined tools, keeping your application focused on the tools it needs

## [Examples](#examples)

You can see MCP tools in action in the following example:









Learn to use MCP tools in Node.js





















On this page















































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.