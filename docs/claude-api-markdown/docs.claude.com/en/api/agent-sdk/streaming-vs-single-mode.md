Streaming Input - Claude Docs 

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

Streaming Input

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
-   [Streaming Input Mode (Recommended)](#streaming-input-mode-recommended)
-   [How It Works](#how-it-works)
-   [Benefits](#benefits)
-   [Implementation Example](#implementation-example)
-   [Single Message Input](#single-message-input)
-   [When to Use Single Message Input](#when-to-use-single-message-input)
-   [Limitations](#limitations)
-   [Implementation Example](#implementation-example-2)

Guides

# Streaming Input

Copy page

Understanding the two input modes for Claude Agent SDK and when to use each

Copy page

## 

[​

](#overview)

Overview

The Claude Agent SDK supports two distinct input modes for interacting with agents:

-   **Streaming Input Mode** (Default & Recommended) - A persistent, interactive session
-   **Single Message Input** - One-shot queries that use session state and resuming

This guide explains the differences, benefits, and use cases for each mode to help you choose the right approach for your application.

## 

[​

](#streaming-input-mode-recommended)

Streaming Input Mode (Recommended)

Streaming input mode is the **preferred** way to use the Claude Agent SDK. It provides full access to the agent’s capabilities and enables rich, interactive experiences. It allows the agent to operate as a long lived process that takes in user input, handles interruptions, surfaces permission requests, and handles session management.

### 

[​

](#how-it-works)

How It Works

### 

[​

](#benefits)

Benefits

## Image Uploads

Attach images directly to messages for visual analysis and understanding

## Queued Messages

Send multiple messages that process sequentially, with ability to interrupt

## Tool Integration

Full access to all tools and custom MCP servers during the session

## Hooks Support

Use lifecycle hooks to customize behavior at various points

## Real-time Feedback

See responses as they’re generated, not just final results

## Context Persistence

Maintain conversation context across multiple turns naturally

### 

[​

](#implementation-example)

Implementation Example

TypeScript

Python

Copy

```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";
import { readFileSync } from "fs";

async function* generateMessages() {
  // First message
  yield {
    type: "user" as const,
    message: {
      role: "user" as const,
      content: "Analyze this codebase for security issues"
    }
  };
  
  // Wait for conditions or user input
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Follow-up with image
  yield {
    type: "user" as const,
    message: {
      role: "user" as const,
      content: [
        {
          type: "text",
          text: "Review this architecture diagram"
        },
        {
          type: "image",
          source: {
            type: "base64",
            media_type: "image/png",
            data: readFileSync("diagram.png", "base64")
          }
        }
      ]
    }
  };
}

// Process streaming responses
for await (const message of query({
  prompt: generateMessages(),
  options: {
    maxTurns: 10,
    allowedTools: ["Read", "Grep"]
  }
})) {
  if (message.type === "result") {
    console.log(message.result);
  }
}
```

## 

[​

](#single-message-input)

Single Message Input

Single message input is simpler but more limited.

### 

[​

](#when-to-use-single-message-input)

When to Use Single Message Input

Use single message input when:

-   You need a one-shot response
-   You do not need image attachments, hooks, etc.
-   You need to operate in a stateless environment, such as a lambda function

### 

[​

](#limitations)

Limitations

Single message input mode does **not** support:

-   Direct image attachments in messages
-   Dynamic message queueing
-   Real-time interruption
-   Hook integration
-   Natural multi-turn conversations

### 

[​

](#implementation-example-2)

Implementation Example

TypeScript

Python

Copy

```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";

// Simple one-shot query
for await (const message of query({
  prompt: "Explain the authentication flow",
  options: {
    maxTurns: 1,
    allowedTools: ["Read", "Grep"]
  }
})) {
  if (message.type === "result") {
    console.log(message.result);
  }
}

// Continue conversation with session management
for await (const message of query({
  prompt: "Now explain the authorization process",
  options: {
    continue: true,
    maxTurns: 1
  }
})) {
  if (message.type === "result") {
    console.log(message.result);
  }
}
```

Was this page helpful?

YesNo

[Python SDK](python.html)[Handling Permissions](permissions.html)

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