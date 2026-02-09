Migrate to Claude Agent SDK - Claude Docs  

[Claude Docs home page![light logo](../../../../../mintcdn.com/anthropic-claude-docs/DcI2Ybid7ZEnFaf0/logo/light%EF%B9%96fit=max&auto=format&n=DcI2Ybid7ZEnFaf0&q=85&s=c877c45432515ee69194cb19e9f983a2.svg)![dark logo](../../../../../mintcdn.com/anthropic-claude-docs/DcI2Ybid7ZEnFaf0/logo/dark%EF%B9%96fit=max&auto=format&n=DcI2Ybid7ZEnFaf0&q=85&s=f5bb877be0cb3cba86cf6d7c88185216.svg)](../../../home.html)

![US](../../../../../d3gk2c5xim1je2.cloudfront.net/flags/US.svg)

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

Migrate to Claude Agent SDK

[Welcome

](../../../home.html)[Claude Developer Platform

](../../intro.html)[Claude Code

](../overview.html)[Model Context Protocol (MCP)

](../../mcp.html)[API Reference

](../../../api/messages.html)[Resources

](../../../resources/overview.html)[Release Notes

](../../../release-notes/overview.html)

-   [
    
    Developer Guide](../../intro.html)
-   [
    
    API Guide](../../../api/overview.html)

##### Using the APIs

-   [
    
    Overview
    
    
    
    ](../../../api/overview.html)
-   [
    
    Rate limits
    
    
    
    ](../../../api/rate-limits.html)
-   [
    
    Service tiers
    
    
    
    ](../../../api/service-tiers.html)
-   [
    
    Errors
    
    
    
    ](../../../api/errors.html)
-   [
    
    Handling stop reasons
    
    
    
    ](../../../api/handling-stop-reasons.html)
-   [
    
    Beta headers
    
    
    
    ](../../../api/beta-headers.html)

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
    
    
    
    ](../../../api/client-sdks.html)
-   [
    
    OpenAI SDK compatibility
    
    
    
    ](../../../api/openai-sdk.html)
-   Agent SDK
    
    -   [
        
        Migrate to Claude Agent SDK
        
        
        
        ](migration-guide.html)
    -   [
        
        Overview
        
        
        
        ](../../../api/agent-sdk/overview.html)
    -   [
        
        TypeScript SDK
        
        
        
        ](../../../api/agent-sdk/typescript.html)
    -   [
        
        Python SDK
        
        
        
        ](../../../api/agent-sdk/python.html)
    -   Guides
        

##### Examples

-   [
    
    Messages examples
    
    
    
    ](../../../api/messages-examples.html)
-   [
    
    Message Batches examples
    
    
    
    ](../../../api/messages-batch-examples.html)

##### 3rd-party APIs

-   [
    
    Amazon Bedrock API
    
    
    
    ](../../../api/claude-on-amazon-bedrock.html)
-   [
    
    Vertex AI API
    
    
    
    ](../../../api/claude-on-vertex-ai.html)

##### Using the Admin API

-   [
    
    Admin API overview
    
    
    
    ](../../../api/administration-api.html)
-   [
    
    Usage and Cost API
    
    
    
    ](../../../api/usage-cost-api.html)
-   [
    
    Claude Code Analytics API
    
    
    
    ](../../../api/claude-code-analytics-api.html)

##### Support & configuration

-   [
    
    Versions
    
    
    
    ](../../../api/versioning.html)
-   [
    
    IP addresses
    
    
    
    ](../../../api/ip-addresses.html)
-   [
    
    Supported regions
    
    
    
    ](../../../api/supported-regions.html)
-   [
    
    Getting help
    
    
    
    ](../../../api/getting-help.html)

 

On this page

-   [Overview](#overview)
-   [What’s Changed](#what%E2%80%99s-changed)
-   [Migration Steps](#migration-steps)
-   [For TypeScript/JavaScript Projects](#for-typescript%2Fjavascript-projects)
-   [For Python Projects](#for-python-projects)
-   [Breaking changes](#breaking-changes)
-   [Python: ClaudeCodeOptions renamed to ClaudeAgentOptions](#python%3A-claudecodeoptions-renamed-to-claudeagentoptions)
-   [System prompt no longer default](#system-prompt-no-longer-default)
-   [Settings Sources No Longer Loaded by Default](#settings-sources-no-longer-loaded-by-default)
-   [Why the Rename?](#why-the-rename%3F)
-   [Getting Help](#getting-help)
-   [Next Steps](#next-steps)

Agent SDK

# Migrate to Claude Agent SDK

Copy page

Guide for migrating the Claude Code TypeScript and Python SDKs to the Claude Agent SDK

Copy page

## 

[​

](#overview)

Overview

The Claude Code SDK has been renamed to the **Claude Agent SDK** and its documentation has been reorganized. This change reflects the SDK’s broader capabilities for building AI agents beyond just coding tasks.

## 

[​

](#what%E2%80%99s-changed)

What’s Changed

| Aspect | Old | New |
| --- | --- | --- |
| **Package Name (TS/JS)** | `@anthropic-ai/claude-code` | `@anthropic-ai/claude-agent-sdk` |
| **Python Package** | `claude-code-sdk` | `claude-agent-sdk` |
| **Documentation Location** | Claude Code docs → SDK section | API Guide → Agent SDK section |

**Documentation Changes:** The Agent SDK documentation has moved from the Claude Code docs to the API Guide under a dedicated [Agent SDK](../../../api/agent-sdk/overview.html) section. The Claude Code docs now focus on the CLI tool and automation features.

## 

[​

](#migration-steps)

Migration Steps

### 

[​

](#for-typescript%2Fjavascript-projects)

For TypeScript/JavaScript Projects

**1\. Uninstall the old package:**

Copy

```shellscript
npm uninstall @anthropic-ai/claude-code
```

**2\. Install the new package:**

Copy

```shellscript
npm install @anthropic-ai/claude-agent-sdk
```

**3\. Update your imports:** Change all imports from `@anthropic-ai/claude-code` to `@anthropic-ai/claude-agent-sdk`:

Copy

```typescript
// Before
import { query, tool, createSdkMcpServer } from "@anthropic-ai/claude-code";

// After
import {
  query,
  tool,
  createSdkMcpServer,
} from "@anthropic-ai/claude-agent-sdk";
```

**4\. Update package.json dependencies:** If you have the package listed in your `package.json`, update it:

Copy

```json
// Before
{
  "dependencies": {
    "@anthropic-ai/claude-code": "^1.0.0"
  }
}

// After
{
  "dependencies": {
    "@anthropic-ai/claude-agent-sdk": "^0.1.0"
  }
}
```

That’s it! No other code changes are required.

### 

[​

](#for-python-projects)

For Python Projects

**1\. Uninstall the old package:**

Copy

```shellscript
pip uninstall claude-code-sdk
```

**2\. Install the new package:**

Copy

```shellscript
pip install claude-agent-sdk
```

**3\. Update your imports:** Change all imports from `claude_code_sdk` to `claude_agent_sdk`:

Copy

```python
# Before
from claude_code_sdk import query, ClaudeCodeOptions

# After
from claude_agent_sdk import query, ClaudeAgentOptions
```

**4\. Update type names:** Change `ClaudeCodeOptions` to `ClaudeAgentOptions`:

Copy

```python
# Before
from claude_agent_sdk import query, ClaudeCodeOptions

options = ClaudeCodeOptions(
    model="claude-sonnet-4-5"
)

# After
from claude_agent_sdk import query, ClaudeAgentOptions

options = ClaudeAgentOptions(
    model="claude-sonnet-4-5"
)
```

**5\. Review [breaking changes](#breaking-changes)** Make any code changes needed to complete the migration.

## 

[​

](#breaking-changes)

Breaking changes

To improve isolation and explicit configuration, Claude Agent SDK v0.1.0 introduces breaking changes for users migrating from Claude Code SDK. Review this section carefully before migrating.

### 

[​

](#python%3A-claudecodeoptions-renamed-to-claudeagentoptions)

Python: ClaudeCodeOptions renamed to ClaudeAgentOptions

**What changed:** The Python SDK type `ClaudeCodeOptions` has been renamed to `ClaudeAgentOptions`. **Migration:**

Copy

```python
# BEFORE (v0.0.x)
from claude_agent_sdk import query, ClaudeCodeOptions

options = ClaudeCodeOptions(
    model="claude-sonnet-4-5",
    permission_mode="acceptEdits"
)

# AFTER (v0.1.0)
from claude_agent_sdk import query, ClaudeAgentOptions

options = ClaudeAgentOptions(
    model="claude-sonnet-4-5",
    permission_mode="acceptEdits"
)
```

**Why this changed:** The type name now matches the “Claude Agent SDK” branding and provides consistency across the SDK’s naming conventions.

### 

[​

](#system-prompt-no-longer-default)

System prompt no longer default

**What changed:** The SDK no longer uses Claude Code’s system prompt by default. **Migration:**

TypeScript

Python

Copy

```typescript
// BEFORE (v0.0.x) - Used Claude Code's system prompt by default
const result = query({ prompt: "Hello" });

// AFTER (v0.1.0) - Uses empty system prompt by default
// To get the old behavior, explicitly request Claude Code's preset:
const result = query({
  prompt: "Hello",
  options: {
    systemPrompt: { type: "preset", preset: "claude_code" }
  }
});

// Or use a custom system prompt:
const result = query({
  prompt: "Hello",
  options: {
    systemPrompt: "You are a helpful coding assistant"
  }
});
```

**Why this changed:** Provides better control and isolation for SDK applications. You can now build agents with custom behavior without inheriting Claude Code’s CLI-focused instructions.

### 

[​

](#settings-sources-no-longer-loaded-by-default)

Settings Sources No Longer Loaded by Default

**What changed:** The SDK no longer reads from filesystem settings (CLAUDE.md, settings.json, slash commands, etc.) by default. **Migration:**

TypeScript

Python

Copy

```typescript
// BEFORE (v0.0.x) - Loaded all settings automatically
const result = query({ prompt: "Hello" });
// Would read from:
// - ~/.claude/settings.json (user)
// - .claude/settings.json (project)
// - .claude/settings.local.json (local)
// - CLAUDE.md files
// - Custom slash commands

// AFTER (v0.1.0) - No settings loaded by default
// To get the old behavior:
const result = query({
  prompt: "Hello",
  options: {
    settingSources: ["user", "project", "local"]
  }
});

// Or load only specific sources:
const result = query({
  prompt: "Hello",
  options: {
    settingSources: ["project"]  // Only project settings
  }
});
```

**Why this changed:** Ensures SDK applications have predictable behavior independent of local filesystem configurations. This is especially important for:

-   **CI/CD environments** - Consistent behavior without local customizations
-   **Deployed applications** - No dependency on filesystem settings
-   **Testing** - Isolated test environments
-   **Multi-tenant systems** - Prevent settings leakage between users

**Backward compatibility:** If your application relied on filesystem settings (custom slash commands, CLAUDE.md instructions, etc.), add `settingSources: ['user', 'project', 'local']` to your options.

## 

[​

](#why-the-rename%3F)

Why the Rename?

The Claude Code SDK was originally designed for coding tasks, but it has evolved into a powerful framework for building all types of AI agents. The new name “Claude Agent SDK” better reflects its capabilities:

-   Building business agents (legal assistants, finance advisors, customer support)
-   Creating specialized coding agents (SRE bots, security reviewers, code review agents)
-   Developing custom agents for any domain with tool use, MCP integration, and more

## 

[​

](#getting-help)

Getting Help

If you encounter any issues during migration: **For TypeScript/JavaScript:**

1.  Check that all imports are updated to use `@anthropic-ai/claude-agent-sdk`
2.  Verify your package.json has the new package name
3.  Run `npm install` to ensure dependencies are updated

**For Python:**

1.  Check that all imports are updated to use `claude_agent_sdk`
2.  Verify your requirements.txt or pyproject.toml has the new package name
3.  Run `pip install claude-agent-sdk` to ensure the package is installed

See the [Troubleshooting](../troubleshooting.html) guide for common issues.

## 

[​

](#next-steps)

Next Steps

-   Explore the [Agent SDK Overview](../../../api/agent-sdk/overview.html) to learn about available features
-   Check out the [TypeScript SDK Reference](../../../api/agent-sdk/typescript.html) for detailed API documentation
-   Review the [Python SDK Reference](../../../api/agent-sdk/python.html) for Python-specific documentation
-   Learn about [Custom Tools](../../../api/agent-sdk/custom-tools.html) and [MCP Integration](../../../api/agent-sdk/mcp.html)

Was this page helpful?

YesNo

[OpenAI SDK compatibility](../../../api/openai-sdk.html)[Overview](../../../api/agent-sdk/overview.html)

Assistant

Responses are generated using AI and may contain mistakes.

[Claude Docs home page![light logo](../../../../../mintcdn.com/anthropic-claude-docs/DcI2Ybid7ZEnFaf0/logo/light%EF%B9%96fit=max&auto=format&n=DcI2Ybid7ZEnFaf0&q=85&s=c877c45432515ee69194cb19e9f983a2.svg)![dark logo](../../../../../mintcdn.com/anthropic-claude-docs/DcI2Ybid7ZEnFaf0/logo/dark%EF%B9%96fit=max&auto=format&n=DcI2Ybid7ZEnFaf0&q=85&s=f5bb877be0cb3cba86cf6d7c88185216.svg)](../../../home.html)

[x](https://x.com/AnthropicAI)[linkedin](https://www.linkedin.com/company/anthropicresearch)

Company

[Anthropic](https://www.anthropic.com/company)[Careers](https://www.anthropic.com/careers)[Economic Futures](https://www.anthropic.com/economic-futures)[Research](https://www.anthropic.com/research)[News](https://www.anthropic.com/news)[Trust center](https://trust.anthropic.com/)[Transparency](https://www.anthropic.com/transparency)

Help and security

[Availability](https://www.anthropic.com/supported-countries)[Status](https://status.anthropic.com/)[Support center](https://support.claude.com/)

Learn

[Courses](https://www.anthropic.com/learn)[MCP connectors](https://claude.com/partners/mcp)[Customer stories](https://www.claude.com/customers)[Engineering blog](https://www.anthropic.com/engineering)[Events](https://www.anthropic.com/events)[Powered by Claude](https://claude.com/partners/powered-by-claude)[Service partners](https://claude.com/partners/services)[Startups program](https://claude.com/programs/startups)

Terms and policies

[Privacy policy](https://www.anthropic.com/legal/privacy)[Disclosure policy](https://www.anthropic.com/responsible-disclosure-policy)[Usage policy](https://www.anthropic.com/legal/aup)[Commercial terms](https://www.anthropic.com/legal/commercial-terms)[Consumer terms](https://www.anthropic.com/legal/consumer-terms)