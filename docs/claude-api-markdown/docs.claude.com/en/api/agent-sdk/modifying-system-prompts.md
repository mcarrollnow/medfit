Modifying system prompts - Claude Docs 

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

Modifying system prompts

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

-   [Understanding system prompts](#understanding-system-prompts)
-   [Methods of modification](#methods-of-modification)
-   [Method 1: CLAUDE.md files (project-level instructions)](#method-1%3A-claude-md-files-project-level-instructions)
-   [How CLAUDE.md works with the SDK](#how-claude-md-works-with-the-sdk)
-   [Example CLAUDE.md](#example-claude-md)
-   [Using CLAUDE.md with the SDK](#using-claude-md-with-the-sdk)
-   [When to use CLAUDE.md](#when-to-use-claude-md)
-   [Method 2: Output styles (persistent configurations)](#method-2%3A-output-styles-persistent-configurations)
-   [Creating an output style](#creating-an-output-style)
-   [Using output styles](#using-output-styles)
-   [Method 3: Using systemPrompt with append](#method-3%3A-using-systemprompt-with-append)
-   [Method 4: Custom system prompts](#method-4%3A-custom-system-prompts)
-   [Comparison of all four approaches](#comparison-of-all-four-approaches)
-   [Use cases and best practices](#use-cases-and-best-practices)
-   [When to use CLAUDE.md](#when-to-use-claude-md-2)
-   [When to use output styles](#when-to-use-output-styles)
-   [When to use systemPrompt with append](#when-to-use-systemprompt-with-append)
-   [When to use custom systemPrompt](#when-to-use-custom-systemprompt)
-   [Combining approaches](#combining-approaches)
-   [Example: Output style with session-specific additions](#example%3A-output-style-with-session-specific-additions)
-   [See also](#see-also)

Guides

# Modifying system prompts

Copy page

Learn how to customize Claude’s behavior by modifying system prompts using three approaches - output styles, systemPrompt with append, and custom system prompts.

Copy page

System prompts define Claude’s behavior, capabilities, and response style. The Claude Agent SDK provides three ways to customize system prompts: using output styles (persistent, file-based configurations), appending to Claude Code’s prompt, or using a fully custom prompt.

## 

[​

](#understanding-system-prompts)

Understanding system prompts

A system prompt is the initial instruction set that shapes how Claude behaves throughout a conversation.

**Default behavior:** The Agent SDK uses an **empty system prompt** by default for maximum flexibility. To use Claude Code’s system prompt (tool instructions, code guidelines, etc.), specify `systemPrompt: { preset: "claude_code" }` in TypeScript or `system_prompt="claude_code"` in Python.

Claude Code’s system prompt includes:

-   Tool usage instructions and available tools
-   Code style and formatting guidelines
-   Response tone and verbosity settings
-   Security and safety instructions
-   Context about the current working directory and environment

## 

[​

](#methods-of-modification)

Methods of modification

### 

[​

](#method-1%3A-claude-md-files-project-level-instructions)

Method 1: CLAUDE.md files (project-level instructions)

CLAUDE.md files provide project-specific context and instructions that are automatically read by the Agent SDK when it runs in a directory. They serve as persistent “memory” for your project.

#### 

[​

](#how-claude-md-works-with-the-sdk)

How CLAUDE.md works with the SDK

**Location and discovery:**

-   **Project-level:** `CLAUDE.md` or `.claude/CLAUDE.md` in your working directory
-   **User-level:** `~/.claude/CLAUDE.md` for global instructions across all projects

**IMPORTANT:** The SDK only reads CLAUDE.md files when you explicitly configure `settingSources` (TypeScript) or `setting_sources` (Python):

-   Include `'project'` to load project-level CLAUDE.md
-   Include `'user'` to load user-level CLAUDE.md (`~/.claude/CLAUDE.md`)

The `claude_code` system prompt preset does NOT automatically load CLAUDE.md - you must also specify setting sources. **Content format:** CLAUDE.md files use plain markdown and can contain:

-   Coding guidelines and standards
-   Project-specific context
-   Common commands or workflows
-   API conventions
-   Testing requirements

#### 

[​

](#example-claude-md)

Example CLAUDE.md

Copy

```markdown
# Project Guidelines

## Code Style

- Use TypeScript strict mode
- Prefer functional components in React
- Always include JSDoc comments for public APIs

## Testing

- Run `npm test` before committing
- Maintain >80% code coverage
- Use jest for unit tests, playwright for E2E

## Commands

- Build: `npm run build`
- Dev server: `npm run dev`
- Type check: `npm run typecheck`
```

#### 

[​

](#using-claude-md-with-the-sdk)

Using CLAUDE.md with the SDK

TypeScript

Python

Copy

```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";

// IMPORTANT: You must specify settingSources to load CLAUDE.md
// The claude_code preset alone does NOT load CLAUDE.md files
const messages = [];

for await (const message of query({
  prompt: "Add a new React component for user profiles",
  options: {
    systemPrompt: {
      type: "preset",
      preset: "claude_code", // Use Claude Code's system prompt
    },
    settingSources: ["project"], // Required to load CLAUDE.md from project
  },
})) {
  messages.push(message);
}

// Now Claude has access to your project guidelines from CLAUDE.md
```

#### 

[​

](#when-to-use-claude-md)

When to use CLAUDE.md

**Best for:**

-   **Team-shared context** - Guidelines everyone should follow
-   **Project conventions** - Coding standards, file structure, naming patterns
-   **Common commands** - Build, test, deploy commands specific to your project
-   **Long-term memory** - Context that should persist across all sessions
-   **Version-controlled instructions** - Commit to git so the team stays in sync

**Key characteristics:**

-   ✅ Persistent across all sessions in a project
-   ✅ Shared with team via git
-   ✅ Automatic discovery (no code changes needed)
-   ⚠️ Requires loading settings via `settingSources`

### 

[​

](#method-2%3A-output-styles-persistent-configurations)

Method 2: Output styles (persistent configurations)

Output styles are saved configurations that modify Claude’s system prompt. They’re stored as markdown files and can be reused across sessions and projects.

#### 

[​

](#creating-an-output-style)

Creating an output style

TypeScript

Python

Copy

```typescript
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { homedir } from "os";

async function createOutputStyle(
  name: string,
  description: string,
  prompt: string
) {
  // User-level: ~/.claude/output-styles
  // Project-level: .claude/output-styles
  const outputStylesDir = join(homedir(), ".claude", "output-styles");

  await mkdir(outputStylesDir, { recursive: true });

  const content = `---
name: ${name}
description: ${description}
---

${prompt}`;

  const filePath = join(
    outputStylesDir,
    `${name.toLowerCase().replace(/\s+/g, "-")}.md`
  );
  await writeFile(filePath, content, "utf-8");
}

// Example: Create a code review specialist
await createOutputStyle(
  "Code Reviewer",
  "Thorough code review assistant",
  `You are an expert code reviewer.

For every code submission:
1. Check for bugs and security issues
2. Evaluate performance
3. Suggest improvements
4. Rate code quality (1-10)`
);
```

#### 

[​

](#using-output-styles)

Using output styles

Once created, activate output styles via:

-   **CLI**: `/output-style [style-name]`
-   **Settings**: `.claude/settings.local.json`
-   **Create new**: `/output-style:new [description]`

**Note for SDK users:** Output styles are loaded when you include `settingSources: ['user']` or `settingSources: ['project']` (TypeScript) / `setting_sources=["user"]` or `setting_sources=["project"]` (Python) in your options.

### 

[​

](#method-3%3A-using-systemprompt-with-append)

Method 3: Using `systemPrompt` with append

You can use the Claude Code preset with an `append` property to add your custom instructions while preserving all built-in functionality.

TypeScript

Python

Copy

```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";

const messages = [];

for await (const message of query({
  prompt: "Help me write a Python function to calculate fibonacci numbers",
  options: {
    systemPrompt: {
      type: "preset",
      preset: "claude_code",
      append:
        "Always include detailed docstrings and type hints in Python code.",
    },
  },
})) {
  messages.push(message);
  if (message.type === "assistant") {
    console.log(message.message.content);
  }
}
```

### 

[​

](#method-4%3A-custom-system-prompts)

Method 4: Custom system prompts

You can provide a custom string as `systemPrompt` to replace the default entirely with your own instructions.

TypeScript

Python

Copy

```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";

const customPrompt = `You are a Python coding specialist.
Follow these guidelines:
- Write clean, well-documented code
- Use type hints for all functions
- Include comprehensive docstrings
- Prefer functional programming patterns when appropriate
- Always explain your code choices`;

const messages = [];

for await (const message of query({
  prompt: "Create a data processing pipeline",
  options: {
    systemPrompt: customPrompt,
  },
})) {
  messages.push(message);
  if (message.type === "assistant") {
    console.log(message.message.content);
  }
}
```

## 

[​

](#comparison-of-all-four-approaches)

Comparison of all four approaches

| Feature | CLAUDE.md | Output Styles | `systemPrompt` with append | Custom `systemPrompt` |
| --- | --- | --- | --- | --- |
| **Persistence** | Per-project file | Saved as files | Session only | Session only |
| **Reusability** | Per-project | Across projects | Code duplication | Code duplication |
| **Management** | On filesystem | CLI + files | In code | In code |
| **Default tools** | Preserved | Preserved | Preserved | Lost (unless included) |
| **Built-in safety** | Maintained | Maintained | Maintained | Must be added |
| **Environment context** | Automatic | Automatic | Automatic | Must be provided |
| **Customization level** | Additions only | Replace default | Additions only | Complete control |
| **Version control** | With project | Yes | With code | With code |
| **Scope** | Project-specific | User or project | Code session | Code session |

**Note:** “With append” means using `systemPrompt: { type: "preset", preset: "claude_code", append: "..." }` in TypeScript or `system_prompt={"type": "preset", "preset": "claude_code", "append": "..."}` in Python.

## 

[​

](#use-cases-and-best-practices)

Use cases and best practices

### 

[​

](#when-to-use-claude-md-2)

When to use CLAUDE.md

**Best for:**

-   Project-specific coding standards and conventions
-   Documenting project structure and architecture
-   Listing common commands (build, test, deploy)
-   Team-shared context that should be version controlled
-   Instructions that apply to all SDK usage in a project

**Examples:**

-   “All API endpoints should use async/await patterns”
-   “Run `npm run lint:fix` before committing”
-   “Database migrations are in the `migrations/` directory”

**Important:** To load CLAUDE.md files, you must explicitly set `settingSources: ['project']` (TypeScript) or `setting_sources=["project"]` (Python). The `claude_code` system prompt preset does NOT automatically load CLAUDE.md without this setting.

### 

[​

](#when-to-use-output-styles)

When to use output styles

**Best for:**

-   Persistent behavior changes across sessions
-   Team-shared configurations
-   Specialized assistants (code reviewer, data scientist, DevOps)
-   Complex prompt modifications that need versioning

**Examples:**

-   Creating a dedicated SQL optimization assistant
-   Building a security-focused code reviewer
-   Developing a teaching assistant with specific pedagogy

### 

[​

](#when-to-use-systemprompt-with-append)

When to use `systemPrompt` with append

**Best for:**

-   Adding specific coding standards or preferences
-   Customizing output formatting
-   Adding domain-specific knowledge
-   Modifying response verbosity
-   Enhancing Claude Code’s default behavior without losing tool instructions

### 

[​

](#when-to-use-custom-systemprompt)

When to use custom `systemPrompt`

**Best for:**

-   Complete control over Claude’s behavior
-   Specialized single-session tasks
-   Testing new prompt strategies
-   Situations where default tools aren’t needed
-   Building specialized agents with unique behavior

## 

[​

](#combining-approaches)

Combining approaches

You can combine these methods for maximum flexibility:

### 

[​

](#example%3A-output-style-with-session-specific-additions)

Example: Output style with session-specific additions

TypeScript

Python

Copy

```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";

// Assuming "Code Reviewer" output style is active (via /output-style)
// Add session-specific focus areas
const messages = [];

for await (const message of query({
  prompt: "Review this authentication module",
  options: {
    systemPrompt: {
      type: "preset",
      preset: "claude_code",
      append: `
        For this review, prioritize:
        - OAuth 2.0 compliance
        - Token storage security
        - Session management
      `,
    },
  },
})) {
  messages.push(message);
}
```

## 

[​

](#see-also)

See also

-   [Output styles](../../docs/claude-code/output-styles.html) - Complete output styles documentation
-   [TypeScript SDK guide](typescript.html) - Complete SDK usage guide
-   [TypeScript SDK reference](../../docs/claude-code/typescript-sdk-reference.html) - Full API documentation
-   [Configuration guide](../../docs/claude-code/configuration.html) - General configuration options

Was this page helpful?

YesNo

[Hosting the Agent SDK](hosting.html)[MCP in the SDK](mcp.html)

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