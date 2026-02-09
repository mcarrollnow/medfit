Hosting the Agent SDK - Claude Docs 

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

Hosting the Agent SDK

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

-   [Hosting Requirements](#hosting-requirements)
-   [Container-Based Sandboxing](#container-based-sandboxing)
-   [System Requirements](#system-requirements)
-   [Understanding the SDK Architecture](#understanding-the-sdk-architecture)
-   [Sandbox Provider Options](#sandbox-provider-options)
-   [Production Deployment Patterns](#production-deployment-patterns)
-   [Pattern 1: Ephemeral Sessions](#pattern-1%3A-ephemeral-sessions)
-   [Pattern 2: Long-Running Sessions](#pattern-2%3A-long-running-sessions)
-   [Pattern 3: Hybrid Sessions](#pattern-3%3A-hybrid-sessions)
-   [Pattern 4: Single Containers](#pattern-4%3A-single-containers)
-   [FAQ](#faq)
-   [How do I communicate with my sandboxes?](#how-do-i-communicate-with-my-sandboxes%3F)
-   [What is the cost of hosting a container?](#what-is-the-cost-of-hosting-a-container%3F)
-   [When should I shut down idle containers vs. keeping them warm?](#when-should-i-shut-down-idle-containers-vs-keeping-them-warm%3F)
-   [How often should I update the Claude Code CLI?](#how-often-should-i-update-the-claude-code-cli%3F)
-   [How do I monitor container health and agent performance?](#how-do-i-monitor-container-health-and-agent-performance%3F)
-   [How long can an agent session run before timing out?](#how-long-can-an-agent-session-run-before-timing-out%3F)
-   [Next Steps](#next-steps)

Guides

# Hosting the Agent SDK

Copy page

Deploy and host Claude Agent SDK in production environments

Copy page

The Claude Agent SDK differs from traditional stateless LLM APIs in that it maintains conversational state and executes commands in a persistent environment. This guide covers the architecture, hosting considerations, and best practices for deploying SDK-based agents in production.

## 

[​

](#hosting-requirements)

Hosting Requirements

### 

[​

](#container-based-sandboxing)

Container-Based Sandboxing

For security and isolation, the SDK should run inside a **sandboxed container environment**. This provides:

-   **Process isolation** - Separate execution environment per session
-   **Resource limits** - CPU, memory, and storage constraints
-   **Network control** - Restrict outbound connections
-   **Ephemeral filesystems** - Clean state for each session

### 

[​

](#system-requirements)

System Requirements

Each SDK instance requires:

-   **Runtime dependencies**
    -   Python 3.10+ (for Python SDK) or Node.js 18+ (for TypeScript SDK)
    -   Node.js (required by Claude Code CLI)
    -   Claude Code CLI: `npm install -g @anthropic-ai/claude-code`
-   **Resource allocation**
    -   Recommended: 1GiB RAM, 5GiB of disk, and 1 CPU (vary this based on your task as needed)
-   **Network access**
    -   Outbound HTTPS to `api.anthropic.com`
    -   Optional: Access to MCP servers or external tools

## 

[​

](#understanding-the-sdk-architecture)

Understanding the SDK Architecture

Unlike stateless API calls, the Claude Agent SDK operates as a **long-running process** that:

-   **Executes commands** in a persistent shell environment
-   **Manages file operations** within a working directory
-   **Handles tool execution** with context from previous interactions

## 

[​

](#sandbox-provider-options)

Sandbox Provider Options

Several providers specialize in secure container environments for AI code execution:

-   **[AWS Sandboxes](https://aws.amazon.com/solutions/implementations/innovation-sandbox-on-aws/)**
-   **[Cloudflare Sandboxes](https://github.com/cloudflare/sandbox-sdk)**
-   **[Modal Sandboxes](https://modal.com/docs/guide/sandbox)**
-   **[Daytona](https://www.daytona.io/)**
-   **[E2B](https://e2b.dev/)**
-   **[Fly Machines](https://fly.io/docs/machines/)**
-   **[Vercel Sandbox](https://vercel.com/docs/functions/sandbox)**

## 

[​

](#production-deployment-patterns)

Production Deployment Patterns

### 

[​

](#pattern-1%3A-ephemeral-sessions)

Pattern 1: Ephemeral Sessions

Create a new container for each user task, then destroy it when complete. Best for one-off tasks, the user may still interact with the AI while the task is completing, but once completed the container is destroyed. **Examples:**

-   Bug Investigation & Fix: Debug and resolve a specific issue with relevant context
-   Invoice Processing: Extract and structure data from receipts/invoices for accounting systems
-   Translation Tasks: Translate documents or content batches between languages
-   Image/Video Processing: Apply transformations, optimizations, or extract metadata from media files

### 

[​

](#pattern-2%3A-long-running-sessions)

Pattern 2: Long-Running Sessions

Maintain persistent container instances for long running tasks. Often times running *multiple* Claude Agent processes inside of the container based on demand. Best for proactive agents that take action without the users input, agents that serve content or agents that process high amounts of messages. **Examples:**

-   Email Agent: Monitors incoming emails and autonomously triages, responds, or takes actions based on content
-   Site Builder: Hosts custom websites per user with live editing capabilities served through container ports
-   High-Frequency Chat Bots: Handles continuous message streams from platforms like Slack where rapid response times are critical

### 

[​

](#pattern-3%3A-hybrid-sessions)

Pattern 3: Hybrid Sessions

Ephemeral containers that are hydrated with history and state, possibly from a database or from the SDK’s session resumption features. Best for containers with intermittent interaction from the user that kicks off work and spins down when the work is completed but can be continued. **Examples:**

-   Personal Project Manager: Helps manage ongoing projects with intermittent check-ins, maintains context of tasks, decisions, and progress
-   Deep Research: Conducts multi-hour research tasks, saves findings and resumes investigation when user returns
-   Customer Support Agent: Handles support tickets that span multiple interactions, loads ticket history and customer context

### 

[​

](#pattern-4%3A-single-containers)

Pattern 4: Single Containers

Run multiple Claude Agent SDK processes in one global container. Best for agents that must collaborate closely together. This is likely the least popular pattern because you will have to prevent agents from overwriting each other. **Examples:**

-   **Simulations**: Agents that interact with each other in simulations such as video games.

# 

[​

](#faq)

FAQ

### 

[​

](#how-do-i-communicate-with-my-sandboxes%3F)

How do I communicate with my sandboxes?

When hosting in containers, expose ports to communicate with your SDK instances. Your application can expose HTTP/WebSocket endpoints for external clients while the SDK runs internally within the container.

### 

[​

](#what-is-the-cost-of-hosting-a-container%3F)

What is the cost of hosting a container?

We have found that the dominant cost of serving agents is the tokens, containers vary based on what you provision but a minimum cost is roughly 5 cents per hour running.

### 

[​

](#when-should-i-shut-down-idle-containers-vs-keeping-them-warm%3F)

When should I shut down idle containers vs. keeping them warm?

This is likely provider dependent, different sandbox providers will let you set different criteria for idle timeouts after which a sandbox might spin down. You will want to tune this timeout based on how frequent you think user response might be.

### 

[​

](#how-often-should-i-update-the-claude-code-cli%3F)

How often should I update the Claude Code CLI?

The Claude Code CLI is versioned with semver, so any breaking changes will be versioned.

### 

[​

](#how-do-i-monitor-container-health-and-agent-performance%3F)

How do I monitor container health and agent performance?

Since containers are just servers the same logging infrastructure you use for the backend will work for containers.

### 

[​

](#how-long-can-an-agent-session-run-before-timing-out%3F)

How long can an agent session run before timing out?

An agent session will not timeout, but we recommend setting a ‘maxTurns’ property to prevent Claude from getting stuck in a loop.

## 

[​

](#next-steps)

Next Steps

-   [Sessions Guide](sessions.html) - Learn about session management
-   [Permissions](permissions.html) - Configure tool permissions
-   [Cost Tracking](cost-tracking.html) - Monitor API usage
-   [MCP Integration](mcp.html) - Extend with custom tools

Was this page helpful?

YesNo

[Session Management](sessions.html)[Modifying system prompts](modifying-system-prompts.html)

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