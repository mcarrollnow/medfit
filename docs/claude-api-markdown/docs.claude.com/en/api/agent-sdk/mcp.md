MCP in the SDK - Claude Docs 

[Claude Docs home page![light logo](../../../../mintcdn.com/anthropic-claude-docs/DcI2Ybid7ZEnFaf0/logo/light%EF%B9%96fit=max&auto=format&n=DcI2Ybid7ZEnFaf0&q=85&s=c877c45432515ee69194cb19e9f983a2.svg)![dark logo](../../../../mintcdn.com/anthropic-claude-docs/DcI2Ybid7ZEnFaf0/logo/dark%EF%B9%96fit=max&auto=format&n=DcI2Ybid7ZEnFaf0&q=85&s=f5bb877be0cb3cba86cf6d7c88185216.svg)](../../home.html)

![US](../../../../d3gk2c5xim1je2.cloudfront.net/flags/US.svg)

English

Search...

⌘K

-   [Console](https://console.anthropic.com/login)
-   [Support](https://support.claude.com/)
-   [Discord](https://www.anthropic.com/discord)
-   [Sign up](https://console.anthropic.com/login)
-   [
    
    Sign up
    
    ](https://console.anthropic.com/login)

Search...

Navigation

Guides

MCP in the SDK

[Welcome

](../../home.html)[Claude Developer Platform

](../../docs/intro.html)[Claude Code

](../../docs/claude-code/overview.html)[Model Context Protocol (MCP)

](../../docs/mcp.html)[API Reference

](../messages.html)[Resources

](../../resources/overview.html)[Release Notes

](../../release-notes/overview.html)

-   [
    
    Developer Guide](../../docs/intro.html)
-   [
    
    API Guide](../overview.html)

##### Using the APIs

-   [
    
    Overview
    
    
    
    ](../overview.html)
-   [
    
    Rate limits
    
    
    
    ](../rate-limits.html)
-   [
    
    Service tiers
    
    
    
    ](../service-tiers.html)
-   [
    
    Errors
    
    
    
    ](../errors.html)
-   [
    
    Handling stop reasons
    
    
    
    ](../handling-stop-reasons.html)
-   [
    
    Beta headers
    
    
    
    ](../beta-headers.html)

##### API reference

-   Messages
    
-   Models
    
-   Message Batches
    
-   Files
    
-   Skills
    
-   Admin API
    
-   Experimental APIs
    
-   Text Completions (Legacy)
    

##### SDKs

-   [
    
    Client SDKs
    
    
    
    ](../client-sdks.html)
-   [
    
    OpenAI SDK compatibility
    
    
    
    ](../openai-sdk.html)
-   Agent SDK
    
    -   [
        
        Migrate to Claude Agent SDK
        
        
        
        ](../../docs/claude-code/sdk/migration-guide.html)
    -   [
        
        Overview
        
        
        
        ](overview.html)
    -   [
        
        TypeScript SDK
        
        
        
        ](typescript.html)
    -   [
        
        Python SDK
        
        
        
        ](python.html)
    -   Guides
        
        -   [
            
            Streaming Input
            
            
            
            ](streaming-vs-single-mode.html)
        -   [
            
            Handling Permissions
            
            
            
            ](permissions.html)
        -   [
            
            Session Management
            
            
            
            ](sessions.html)
        -   [
            
            Hosting the Agent SDK
            
            
            
            ](hosting.html)
        -   [
            
            Modifying system prompts
            
            
            
            ](modifying-system-prompts.html)
        -   [
            
            MCP in the SDK
            
            
            
            ](mcp.html)
        -   [
            
            Custom Tools
            
            
            
            ](custom-tools.html)
        -   [
            
            Subagents in the SDK
            
            
            
            ](subagents.html)
        -   [
            
            Slash Commands in the SDK
            
            
            
            ](slash-commands.html)
        -   [
            
            Tracking Costs and Usage
            
            
            
            ](cost-tracking.html)
        -   [
            
            Todo Lists
            
            
            
            ](todo-tracking.html)

##### Examples

-   [
    
    Messages examples
    
    
    
    ](../messages-examples.html)
-   [
    
    Message Batches examples
    
    
    
    ](../messages-batch-examples.html)

##### 3rd-party APIs

-   [
    
    Amazon Bedrock API
    
    
    
    ](../claude-on-amazon-bedrock.html)
-   [
    
    Vertex AI API
    
    
    
    ](../claude-on-vertex-ai.html)

##### Using the Admin API

-   [
    
    Admin API overview
    
    
    
    ](../administration-api.html)
-   [
    
    Usage and Cost API
    
    
    
    ](../usage-cost-api.html)
-   [
    
    Claude Code Analytics API
    
    
    
    ](../claude-code-analytics-api.html)

##### Support & configuration

-   [
    
    Versions
    
    
    
    ](../versioning.html)
-   [
    
    IP addresses
    
    
    
    ](../ip-addresses.html)
-   [
    
    Supported regions
    
    
    
    ](../supported-regions.html)
-   [
    
    Getting help
    
    
    
    ](../getting-help.html)

 

On this page

-   [Overview](#overview)
-   [Configuration](#configuration)
-   [Basic Configuration](#basic-configuration)
-   [Using MCP Servers in SDK](#using-mcp-servers-in-sdk)
-   [Transport Types](#transport-types)
-   [stdio Servers](#stdio-servers)
-   [HTTP/SSE Servers](#http%2Fsse-servers)
-   [SDK MCP Servers](#sdk-mcp-servers)
-   [Resource Management](#resource-management)
-   [Authentication](#authentication)
-   [Environment Variables](#environment-variables)
-   [OAuth2 Authentication](#oauth2-authentication)
-   [Error Handling](#error-handling)
-   [Related Resources](#related-resources)

Guides

# MCP in the SDK

Copy page

Extend Claude Code with custom tools using Model Context Protocol servers

Copy page

## 

[​

](#overview)

Overview

Model Context Protocol (MCP) servers extend Claude Code with custom tools and capabilities. MCPs can run as external processes, connect via HTTP/SSE, or execute directly within your SDK application.

## 

[​

](#configuration)

Configuration

### 

[​

](#basic-configuration)

Basic Configuration

Configure MCP servers in `.mcp.json` at your project root:

TypeScript

Python

Copy

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-filesystem"],
      "env": {
        "ALLOWED_PATHS": "/Users/me/projects"
      }
    }
  }
}
```

### 

[​

](#using-mcp-servers-in-sdk)

Using MCP Servers in SDK

TypeScript

Python

Copy

```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";

for await (const message of query({
  prompt: "List files in my project",
  options: {
    mcpServers: {
      "filesystem": {
        command: "npx",
        args: ["@modelcontextprotocol/server-filesystem"],
        env: {
          ALLOWED_PATHS: "/Users/me/projects"
        }
      }
    },
    allowedTools: ["mcp__filesystem__list_files"]
  }
})) {
  if (message.type === "result" && message.subtype === "success") {
    console.log(message.result);
  }
}
```

## 

[​

](#transport-types)

Transport Types

### 

[​

](#stdio-servers)

stdio Servers

External processes communicating via stdin/stdout:

TypeScript

Python

Copy

```typescript
// .mcp.json configuration
{
  "mcpServers": {
    "my-tool": {
      "command": "node",
      "args": ["./my-mcp-server.js"],
      "env": {
        "DEBUG": "${DEBUG:-false}"
      }
    }
  }
}
```

### 

[​

](#http%2Fsse-servers)

HTTP/SSE Servers

Remote servers with network communication:

TypeScript

Python

Copy

```typescript
// SSE server configuration
{
  "mcpServers": {
    "remote-api": {
      "type": "sse",
      "url": "https://api.example.com/mcp/sse",
      "headers": {
        "Authorization": "Bearer ${API_TOKEN}"
      }
    }
  }
}

// HTTP server configuration
{
  "mcpServers": {
    "http-service": {
      "type": "http",
      "url": "https://api.example.com/mcp",
      "headers": {
        "X-API-Key": "${API_KEY}"
      }
    }
  }
}
```

### 

[​

](#sdk-mcp-servers)

SDK MCP Servers

In-process servers running within your application. For detailed information on creating custom tools, see the [Custom Tools guide](custom-tools.html):

## 

[​

](#resource-management)

Resource Management

MCP servers can expose resources that Claude can list and read:

TypeScript

Python

Copy

```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";

// List available resources
for await (const message of query({
  prompt: "What resources are available from the database server?",
  options: {
    mcpServers: {
      "database": {
        command: "npx",
        args: ["@modelcontextprotocol/server-database"]
      }
    },
    allowedTools: ["mcp__list_resources", "mcp__read_resource"]
  }
})) {
  if (message.type === "result") console.log(message.result);
}
```

## 

[​

](#authentication)

Authentication

### 

[​

](#environment-variables)

Environment Variables

TypeScript

Python

Copy

```typescript
// .mcp.json with environment variables
{
  "mcpServers": {
    "secure-api": {
      "type": "sse",
      "url": "https://api.example.com/mcp",
      "headers": {
        "Authorization": "Bearer ${API_TOKEN}",
        "X-API-Key": "${API_KEY:-default-key}"
      }
    }
  }
}

// Set environment variables
process.env.API_TOKEN = "your-token";
process.env.API_KEY = "your-key";
```

### 

[​

](#oauth2-authentication)

OAuth2 Authentication

OAuth2 MCP authentication in-client is not currently supported.

## 

[​

](#error-handling)

Error Handling

Handle MCP connection failures gracefully:

TypeScript

Python

Copy

```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";

for await (const message of query({
  prompt: "Process data",
  options: {
    mcpServers: {
      "data-processor": dataServer
    }
  }
})) {
  if (message.type === "system" && message.subtype === "init") {
    // Check MCP server status
    const failedServers = message.mcp_servers.filter(
      s => s.status !== "connected"
    );
    
    if (failedServers.length > 0) {
      console.warn("Failed to connect:", failedServers);
    }
  }
  
  if (message.type === "result" && message.subtype === "error_during_execution") {
    console.error("Execution failed");
  }
}
```

## 

[​

](#related-resources)

Related Resources

-   [Custom Tools Guide](custom-tools.html) - Detailed guide on creating SDK MCP servers
-   [TypeScript SDK Reference](typescript.html)
-   [Python SDK Reference](python.html)
-   [SDK Permissions](sdk-permissions.html)
-   [Common Workflows](../../docs/claude-code/common-workflows.html)

Was this page helpful?

YesNo

[Modifying system prompts](modifying-system-prompts.html)[Custom Tools](custom-tools.html)

Assistant

Responses are generated using AI and may contain mistakes.

[Claude Docs home page![light logo](../../../../mintcdn.com/anthropic-claude-docs/DcI2Ybid7ZEnFaf0/logo/light%EF%B9%96fit=max&auto=format&n=DcI2Ybid7ZEnFaf0&q=85&s=c877c45432515ee69194cb19e9f983a2.svg)![dark logo](../../../../mintcdn.com/anthropic-claude-docs/DcI2Ybid7ZEnFaf0/logo/dark%EF%B9%96fit=max&auto=format&n=DcI2Ybid7ZEnFaf0&q=85&s=f5bb877be0cb3cba86cf6d7c88185216.svg)](../../home.html)

[x](https://x.com/AnthropicAI)[linkedin](https://www.linkedin.com/company/anthropicresearch)

Company

[Anthropic](https://www.anthropic.com/company)[Careers](https://www.anthropic.com/careers)[Economic Futures](https://www.anthropic.com/economic-futures)[Research](https://www.anthropic.com/research)[News](https://www.anthropic.com/news)[Trust center](https://trust.anthropic.com/)[Transparency](https://www.anthropic.com/transparency)

Help and security

[Availability](https://www.anthropic.com/supported-countries)[Status](https://status.anthropic.com/)[Support center](https://support.claude.com/)

Learn

[Courses](https://www.anthropic.com/learn)[MCP connectors](https://claude.com/partners/mcp)[Customer stories](https://www.claude.com/customers)[Engineering blog](https://www.anthropic.com/engineering)[Events](https://www.anthropic.com/events)[Powered by Claude](https://claude.com/partners/powered-by-claude)[Service partners](https://claude.com/partners/services)[Startups program](https://claude.com/programs/startups)

Terms and policies

[Privacy policy](https://www.anthropic.com/legal/privacy)[Disclosure policy](https://www.anthropic.com/responsible-disclosure-policy)[Usage policy](https://www.anthropic.com/legal/aup)[Commercial terms](https://www.anthropic.com/legal/commercial-terms)[Consumer terms](https://www.anthropic.com/legal/consumer-terms)