Subagents in the SDK - Claude Docs 

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

Subagents in the SDK

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
-   [Benefits of Using Subagents](#benefits-of-using-subagents)
-   [Context Management](#context-management)
-   [Parallelization](#parallelization)
-   [Specialized Instructions and Knowledge](#specialized-instructions-and-knowledge)
-   [Tool Restrictions](#tool-restrictions)
-   [Creating Subagents](#creating-subagents)
-   [Programmatic Definition (Recommended)](#programmatic-definition-recommended)
-   [AgentDefinition Configuration](#agentdefinition-configuration)
-   [Filesystem-Based Definition (Alternative)](#filesystem-based-definition-alternative)
-   [How the SDK Uses Subagents](#how-the-sdk-uses-subagents)
-   [Example Subagents](#example-subagents)
-   [SDK Integration Patterns](#sdk-integration-patterns)
-   [Automatic Invocation](#automatic-invocation)
-   [Explicit Invocation](#explicit-invocation)
-   [Dynamic Agent Configuration](#dynamic-agent-configuration)
-   [Tool Restrictions](#tool-restrictions-2)
-   [Common Tool Combinations](#common-tool-combinations)
-   [Related Documentation](#related-documentation)

Guides

# Subagents in the SDK

Copy page

Working with subagents in the Claude Agent SDK

Copy page

Subagents in the Claude Agent SDK are specialized AIs that are orchestrated by the main agent. Use subagents for context management and parallelization. This guide explains how to define and use subagents in the SDK using the `agents` parameter.

## 

[​

](#overview)

Overview

Subagents can be defined in two ways when using the SDK:

1.  **Programmatically** - Using the `agents` parameter in your `query()` options (recommended for SDK applications)
2.  **Filesystem-based** - Placing markdown files with YAML frontmatter in designated directories (`.claude/agents/`)

This guide primarily focuses on the programmatic approach using the `agents` parameter, which provides a more integrated development experience for SDK applications.

## 

[​

](#benefits-of-using-subagents)

Benefits of Using Subagents

### 

[​

](#context-management)

Context Management

Subagents maintain separate context from the main agent, preventing information overload and keeping interactions focused. This isolation ensures that specialized tasks don’t pollute the main conversation context with irrelevant details. **Example**: A `research-assistant` subagent can explore dozens of files and documentation pages without cluttering the main conversation with all the intermediate search results - only returning the relevant findings.

### 

[​

](#parallelization)

Parallelization

Multiple subagents can run concurrently, dramatically speeding up complex workflows. **Example**: During a code review, you can run `style-checker`, `security-scanner`, and `test-coverage` subagents simultaneously, reducing review time from minutes to seconds.

### 

[​

](#specialized-instructions-and-knowledge)

Specialized Instructions and Knowledge

Each subagent can have tailored system prompts with specific expertise, best practices, and constraints. **Example**: A `database-migration` subagent can have detailed knowledge about SQL best practices, rollback strategies, and data integrity checks that would be unnecessary noise in the main agent’s instructions.

### 

[​

](#tool-restrictions)

Tool Restrictions

Subagents can be limited to specific tools, reducing the risk of unintended actions. **Example**: A `doc-reviewer` subagent might only have access to Read and Grep tools, ensuring it can analyze but never accidentally modify your documentation files.

## 

[​

](#creating-subagents)

Creating Subagents

### 

[​

](#programmatic-definition-recommended)

Programmatic Definition (Recommended)

Define subagents directly in your code using the `agents` parameter:

Copy

```typescript
import { query } from '@anthropic-ai/claude-agent-sdk';

const result = query({
  prompt: "Review the authentication module for security issues",
  options: {
    agents: {
      'code-reviewer': {
        description: 'Expert code review specialist. Use for quality, security, and maintainability reviews.',
        prompt: `You are a code review specialist with expertise in security, performance, and best practices.

When reviewing code:
- Identify security vulnerabilities
- Check for performance issues
- Verify adherence to coding standards
- Suggest specific improvements

Be thorough but concise in your feedback.`,
        tools: ['Read', 'Grep', 'Glob'],
        model: 'sonnet'
      },
      'test-runner': {
        description: 'Runs and analyzes test suites. Use for test execution and coverage analysis.',
        prompt: `You are a test execution specialist. Run tests and provide clear analysis of results.

Focus on:
- Running test commands
- Analyzing test output
- Identifying failing tests
- Suggesting fixes for failures`,
        tools: ['Bash', 'Read', 'Grep'],
      }
    }
  }
});

for await (const message of result) {
  console.log(message);
}
```

### 

[​

](#agentdefinition-configuration)

AgentDefinition Configuration

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `description` | `string` | Yes | Natural language description of when to use this agent |
| `prompt` | `string` | Yes | The agent’s system prompt defining its role and behavior |
| `tools` | `string[]` | No | Array of allowed tool names. If omitted, inherits all tools |
| `model` | `'sonnet' | 'opus' | 'haiku' | 'inherit'` | No | Model override for this agent. Defaults to main model if omitted |

### 

[​

](#filesystem-based-definition-alternative)

Filesystem-Based Definition (Alternative)

You can also define subagents as markdown files in specific directories:

-   **Project-level**: `.claude/agents/*.md` - Available only in the current project
-   **User-level**: `~/.claude/agents/*.md` - Available across all projects

Each subagent is a markdown file with YAML frontmatter:

Copy

```markdown
---
name: code-reviewer
description: Expert code review specialist. Use for quality, security, and maintainability reviews.
tools: Read, Grep, Glob, Bash
---

Your subagent's system prompt goes here. This defines the subagent's
role, capabilities, and approach to solving problems.
```

**Note:** Programmatically defined agents (via the `agents` parameter) take precedence over filesystem-based agents with the same name.

## 

[​

](#how-the-sdk-uses-subagents)

How the SDK Uses Subagents

When using the Claude Agent SDK, subagents can be defined programmatically or loaded from the filesystem. Claude will:

1.  **Load programmatic agents** from the `agents` parameter in your options
2.  **Auto-detect filesystem agents** from `.claude/agents/` directories (if not overridden)
3.  **Invoke them automatically** based on task matching and the agent’s `description`
4.  **Use their specialized prompts** and tool restrictions
5.  **Maintain separate context** for each subagent invocation

Programmatically defined agents (via `agents` parameter) take precedence over filesystem-based agents with the same name.

## 

[​

](#example-subagents)

Example Subagents

For comprehensive examples of subagents including code reviewers, test runners, debuggers, and security auditors, see the [main Subagents guide](../../docs/claude-code/sub-agents.html#example-subagents). The guide includes detailed configurations and best practices for creating effective subagents.

## 

[​

](#sdk-integration-patterns)

SDK Integration Patterns

### 

[​

](#automatic-invocation)

Automatic Invocation

The SDK will automatically invoke appropriate subagents based on the task context. Ensure your agent’s `description` field clearly indicates when it should be used:

Copy

```typescript
const result = query({
  prompt: "Optimize the database queries in the API layer",
  options: {
    agents: {
      'performance-optimizer': {
        description: 'Use PROACTIVELY when code changes might impact performance. MUST BE USED for optimization tasks.',
        prompt: 'You are a performance optimization specialist...',
        tools: ['Read', 'Edit', 'Bash', 'Grep'],
        model: 'sonnet'
      }
    }
  }
});
```

### 

[​

](#explicit-invocation)

Explicit Invocation

Users can request specific subagents in their prompts:

Copy

```typescript
const result = query({
  prompt: "Use the code-reviewer agent to check the authentication module",
  options: {
    agents: {
      'code-reviewer': {
        description: 'Expert code review specialist',
        prompt: 'You are a security-focused code reviewer...',
        tools: ['Read', 'Grep', 'Glob']
      }
    }
  }
});
```

### 

[​

](#dynamic-agent-configuration)

Dynamic Agent Configuration

You can dynamically configure agents based on your application’s needs:

Copy

```typescript
import { query, type AgentDefinition } from '@anthropic-ai/claude-agent-sdk';

function createSecurityAgent(securityLevel: 'basic' | 'strict'): AgentDefinition {
  return {
    description: 'Security code reviewer',
    prompt: `You are a ${securityLevel === 'strict' ? 'strict' : 'balanced'} security reviewer...`,
    tools: ['Read', 'Grep', 'Glob'],
    model: securityLevel === 'strict' ? 'opus' : 'sonnet'
  };
}

const result = query({
  prompt: "Review this PR for security issues",
  options: {
    agents: {
      'security-reviewer': createSecurityAgent('strict')
    }
  }
});
```

## 

[​

](#tool-restrictions-2)

Tool Restrictions

Subagents can have restricted tool access via the `tools` field:

-   **Omit the field** - Agent inherits all available tools (default)
-   **Specify tools** - Agent can only use listed tools

Example of a read-only analysis agent:

Copy

```typescript
const result = query({
  prompt: "Analyze the architecture of this codebase",
  options: {
    agents: {
      'code-analyzer': {
        description: 'Static code analysis and architecture review',
        prompt: `You are a code architecture analyst. Analyze code structure,
identify patterns, and suggest improvements without making changes.`,
        tools: ['Read', 'Grep', 'Glob']  // No write or execute permissions
      }
    }
  }
});
```

### 

[​

](#common-tool-combinations)

Common Tool Combinations

**Read-only agents** (analysis, review):

Copy

```typescript
tools: ['Read', 'Grep', 'Glob']
```

**Test execution agents**:

Copy

```typescript
tools: ['Bash', 'Read', 'Grep']
```

**Code modification agents**:

Copy

```typescript
tools: ['Read', 'Edit', 'Write', 'Grep', 'Glob']
```

## 

[​

](#related-documentation)

Related Documentation

-   [Main Subagents Guide](../../docs/claude-code/sub-agents.html) - Comprehensive subagent documentation
-   [SDK Overview](overview.html) - Overview of Claude Agent SDK
-   [Settings](../../docs/claude-code/settings.html) - Configuration file reference
-   [Slash Commands](../../docs/claude-code/slash-commands.html) - Custom command creation

Was this page helpful?

YesNo

[Custom Tools](custom-tools.html)[Slash Commands in the SDK](slash-commands.html)

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