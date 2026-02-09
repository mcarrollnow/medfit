Agent SDK overview - Claude Docs 

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

Agent SDK

Agent SDK overview

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

-   [Installation](#installation)
-   [SDK Options](#sdk-options)
-   [Why use the Claude Agent SDK?](#why-use-the-claude-agent-sdk%3F)
-   [What can you build with the SDK?](#what-can-you-build-with-the-sdk%3F)
-   [Core Concepts](#core-concepts)
-   [Authentication](#authentication)
-   [Full Claude Code Feature Support](#full-claude-code-feature-support)
-   [System Prompts](#system-prompts)
-   [Tool Permissions](#tool-permissions)
-   [Model Context Protocol (MCP)](#model-context-protocol-mcp)
-   [Reporting Bugs](#reporting-bugs)
-   [Changelog](#changelog)
-   [Related Resources](#related-resources)

Agent SDK

# Agent SDK overview

Copy page

Build custom AI agents with the Claude Agent SDK

Copy page

The Claude Code SDK has been renamed to the **Claude Agent SDK**. If you’re migrating from the old SDK, see the [Migration Guide](../../docs/claude-code/sdk/migration-guide.html).

## 

[​

](#installation)

Installation

TypeScript

Python

Copy

```shellscript
npm install @anthropic-ai/claude-agent-sdk
```

## 

[​

](#sdk-options)

SDK Options

The Claude Agent SDK is available in multiple forms to suit different use cases:

-   **[TypeScript SDK](typescript.html)** - For Node.js and web applications
-   **[Python SDK](python.html)** - For Python applications and data science
-   **[Streaming vs Single Mode](streaming-vs-single-mode.html)** - Understanding input modes and best practices

## 

[​

](#why-use-the-claude-agent-sdk%3F)

Why use the Claude Agent SDK?

Built on top of the agent harness that powers Claude Code, the Claude Agent SDK provides all the building blocks you need to build production-ready agents. Taking advantage of the work we’ve done on Claude Code including:

-   **Context Management**: Automatic compaction and context management to ensure your agent doesn’t run out of context.
-   **Rich tool ecosystem**: File operations, code execution, web search, and MCP extensibility
-   **Advanced permissions**: Fine-grained control over agent capabilities
-   **Production essentials**: Built-in error handling, session management, and monitoring
-   **Optimized Claude integration**: Automatic prompt caching and performance optimizations

## 

[​

](#what-can-you-build-with-the-sdk%3F)

What can you build with the SDK?

Here are some example agent types you can create: **Coding agents:**

-   SRE agents that diagnose and fix production issues
-   Security review bots that audit code for vulnerabilities
-   Oncall engineering assistants that triage incidents
-   Code review agents that enforce style and best practices

**Business agents:**

-   Legal assistants that review contracts and compliance
-   Finance advisors that analyze reports and forecasts
-   Customer support agents that resolve technical issues
-   Content creation assistants for marketing teams

## 

[​

](#core-concepts)

Core Concepts

### 

[​

](#authentication)

Authentication

For basic authentication, retrieve an Claude API key from the [Claude Console](https://console.anthropic.com/) and set the `ANTHROPIC_API_KEY` environment variable. The SDK also supports authentication via third-party API providers:

-   **Amazon Bedrock**: Set `CLAUDE_CODE_USE_BEDROCK=1` environment variable and configure AWS credentials
-   **Google Vertex AI**: Set `CLAUDE_CODE_USE_VERTEX=1` environment variable and configure Google Cloud credentials

For detailed configuration instructions for third-party providers, see the [Amazon Bedrock](../../docs/claude-code/amazon-bedrock.html) and [Google Vertex AI](../../docs/claude-code/google-vertex-ai.html) documentation.

Unless previously approved, we do not allow third party developers to apply Claude.ai rate limits for their products, including agents built on the Claude Agent SDK. Please use the API key authentication methods described in this document instead.

### 

[​

](#full-claude-code-feature-support)

Full Claude Code Feature Support

The SDK provides access to all the default features available in Claude Code, leveraging the same file system-based configuration:

-   **Subagents**: Launch specialized agents stored as Markdown files in `./.claude/agents/`
-   **Hooks**: Execute custom commands configured in `./.claude/settings.json` that respond to tool events
-   **Slash Commands**: Use custom commands defined as Markdown files in `./.claude/commands/`
-   **Memory (CLAUDE.md)**: Maintain project context through `CLAUDE.md` or `.claude/CLAUDE.md` files in your project directory, or `~/.claude/CLAUDE.md` for user-level instructions. To load these files, you must explicitly set `settingSources: ['project']` (TypeScript) or `setting_sources=["project"]` (Python) in your options. See [Modifying system prompts](modifying-system-prompts.html#method-1-claudemd-files-project-level-instructions) for details.

These features work identically to their Claude Code counterparts by reading from the same file system locations.

### 

[​

](#system-prompts)

System Prompts

System prompts define your agent’s role, expertise, and behavior. This is where you specify what kind of agent you’re building.

### 

[​

](#tool-permissions)

Tool Permissions

Control which tools your agent can use with fine-grained permissions:

-   `allowedTools` - Explicitly allow specific tools
-   `disallowedTools` - Block specific tools
-   `permissionMode` - Set overall permission strategy

### 

[​

](#model-context-protocol-mcp)

Model Context Protocol (MCP)

Extend your agents with custom tools and integrations through MCP servers. This allows you to connect to databases, APIs, and other external services.

## 

[​

](#reporting-bugs)

Reporting Bugs

If you encounter bugs or issues with the Agent SDK:

-   **TypeScript SDK**: [Report issues on GitHub](https://github.com/anthropics/claude-agent-sdk-typescript/issues)
-   **Python SDK**: [Report issues on GitHub](https://github.com/anthropics/claude-agent-sdk-python/issues)

## 

[​

](#changelog)

Changelog

View the full changelog for SDK updates, bug fixes, and new features:

-   **TypeScript SDK**: [View CHANGELOG.md](https://github.com/anthropics/claude-agent-sdk-typescript/blob/main/CHANGELOG.md)
-   **Python SDK**: [View CHANGELOG.md](https://github.com/anthropics/claude-agent-sdk-python/blob/main/CHANGELOG.md)

## 

[​

](#related-resources)

Related Resources

-   [CLI Reference](../../docs/claude-code/cli-reference.html) - Complete CLI documentation
-   [GitHub Actions Integration](../../docs/claude-code/github-actions.html) - Automate your GitHub workflow
-   [MCP Documentation](../../docs/claude-code/mcp.html) - Extend Claude with custom tools
-   [Common Workflows](../../docs/claude-code/common-workflows.html) - Step-by-step guides
-   [Troubleshooting](../../docs/claude-code/troubleshooting.html) - Common issues and solutions

Was this page helpful?

YesNo

[Migrate to Claude Agent SDK](../../docs/claude-code/sdk/migration-guide.html)[TypeScript SDK](typescript.html)

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