Plugins reference - Claude Docs 

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

Reference

Plugins reference

[Welcome

](../../home.html)[Claude Developer Platform

](../intro.html)[Claude Code

](overview.html)[Model Context Protocol (MCP)

](../mcp.html)[API Reference

](../../api/messages.html)[Resources

](../../resources/overview.html)[Release Notes

](../../release-notes/overview.html)

##### Getting started

-   [
    
    Overview
    
    
    
    ](overview.html)
-   [
    
    Quickstart
    
    
    
    ](quickstart.html)
-   [
    
    Common workflows
    
    
    
    ](common-workflows.html)
-   [
    
    Claude Code on the web
    
    
    
    ](claude-code-on-the-web.html)

##### Build with Claude Code

-   [
    
    Subagents
    
    
    
    ](sub-agents.html)
-   [
    
    Plugins
    
    
    
    ](plugins.html)
-   [
    
    Agent Skills
    
    
    
    ](skills.html)
-   [
    
    Output styles
    
    
    
    ](output-styles.html)
-   [
    
    Hooks
    
    
    
    ](hooks-guide.html)
-   [
    
    Headless mode
    
    
    
    ](headless.html)
-   [
    
    GitHub Actions
    
    
    
    ](github-actions.html)
-   [
    
    GitLab CI/CD
    
    
    
    ](gitlab-ci-cd.html)
-   [
    
    Model Context Protocol (MCP)
    
    
    
    ](mcp.html)
-   [
    
    Troubleshooting
    
    
    
    ](troubleshooting.html)

##### Claude Agent SDK

-   [
    
    Migrate to Claude Agent SDK
    
    
    
    ](sdk/migration-guide.html)

##### Deployment

-   [
    
    Overview
    
    
    
    ](third-party-integrations.html)
-   [
    
    Amazon Bedrock
    
    
    
    ](amazon-bedrock.html)
-   [
    
    Google Vertex AI
    
    
    
    ](google-vertex-ai.html)
-   [
    
    Network configuration
    
    
    
    ](network-config.html)
-   [
    
    LLM gateway
    
    
    
    ](llm-gateway.html)
-   [
    
    Development containers
    
    
    
    ](devcontainer.html)
-   [
    
    Sandboxing
    
    
    
    ](sandboxing.html)

##### Administration

-   [
    
    Advanced installation
    
    
    
    ](setup.html)
-   [
    
    Identity and Access Management
    
    
    
    ](iam.html)
-   [
    
    Security
    
    
    
    ](security.html)
-   [
    
    Data usage
    
    
    
    ](data-usage.html)
-   [
    
    Monitoring
    
    
    
    ](monitoring-usage.html)
-   [
    
    Costs
    
    
    
    ](costs.html)
-   [
    
    Analytics
    
    
    
    ](analytics.html)
-   [
    
    Plugin marketplaces
    
    
    
    ](plugin-marketplaces.html)

##### Configuration

-   [
    
    Settings
    
    
    
    ](settings.html)
-   [
    
    Visual Studio Code
    
    
    
    ](vs-code.html)
-   [
    
    JetBrains IDEs
    
    
    
    ](jetbrains.html)
-   [
    
    Terminal configuration
    
    
    
    ](terminal-config.html)
-   [
    
    Model configuration
    
    
    
    ](model-config.html)
-   [
    
    Memory management
    
    
    
    ](memory.html)
-   [
    
    Status line configuration
    
    
    
    ](statusline.html)

##### Reference

-   [
    
    CLI reference
    
    
    
    ](cli-reference.html)
-   [
    
    Interactive mode
    
    
    
    ](interactive-mode.html)
-   [
    
    Slash commands
    
    
    
    ](slash-commands.html)
-   [
    
    Checkpointing
    
    
    
    ](checkpointing.html)
-   [
    
    Hooks reference
    
    
    
    ](hooks.html)
-   [
    
    Plugins reference
    
    
    
    ](plugins-reference.html)

##### Resources

-   [
    
    Legal and compliance
    
    
    
    ](legal-and-compliance.html)

 

On this page

-   [Plugin components reference](#plugin-components-reference)
-   [Commands](#commands)
-   [Agents](#agents)
-   [Skills](#skills)
-   [Hooks](#hooks)
-   [MCP servers](#mcp-servers)
-   [Plugin manifest schema](#plugin-manifest-schema)
-   [Complete schema](#complete-schema)
-   [Required fields](#required-fields)
-   [Metadata fields](#metadata-fields)
-   [Component path fields](#component-path-fields)
-   [Path behavior rules](#path-behavior-rules)
-   [Environment variables](#environment-variables)
-   [Plugin directory structure](#plugin-directory-structure)
-   [Standard plugin layout](#standard-plugin-layout)
-   [File locations reference](#file-locations-reference)
-   [Debugging and development tools](#debugging-and-development-tools)
-   [Debugging commands](#debugging-commands)
-   [Common issues](#common-issues)
-   [Distribution and versioning reference](#distribution-and-versioning-reference)
-   [Version management](#version-management)

Reference

# Plugins reference

Copy page

Complete technical reference for Claude Code plugin system, including schemas, CLI commands, and component specifications.

Copy page

For hands-on tutorials and practical usage, see [Plugins](plugins.html). For plugin management across teams and communities, see [Plugin marketplaces](plugin-marketplaces.html).

This reference provides complete technical specifications for the Claude Code plugin system, including component schemas, CLI commands, and development tools.

## 

[​

](#plugin-components-reference)

Plugin components reference

This section documents the five types of components that plugins can provide.

### 

[​

](#commands)

Commands

Plugins add custom slash commands that integrate seamlessly with Claude Code’s command system. **Location**: `commands/` directory in plugin root **File format**: Markdown files with frontmatter For complete details on plugin command structure, invocation patterns, and features, see [Plugin commands](slash-commands.html#plugin-commands).

### 

[​

](#agents)

Agents

Plugins can provide specialized subagents for specific tasks that Claude can invoke automatically when appropriate. **Location**: `agents/` directory in plugin root **File format**: Markdown files describing agent capabilities **Agent structure**:

Copy

```markdown
---
description: What this agent specializes in
capabilities: ["task1", "task2", "task3"]
---

# Agent Name

Detailed description of the agent's role, expertise, and when Claude should invoke it.

## Capabilities
- Specific task the agent excels at
- Another specialized capability
- When to use this agent vs others

## Context and examples
Provide examples of when this agent should be used and what kinds of problems it solves.
```

**Integration points**:

-   Agents appear in the `/agents` interface
-   Claude can invoke agents automatically based on task context
-   Agents can be invoked manually by users
-   Plugin agents work alongside built-in Claude agents

### 

[​

](#skills)

Skills

Plugins can provide Agent Skills that extend Claude’s capabilities. Skills are model-invoked—Claude autonomously decides when to use them based on the task context. **Location**: `skills/` directory in plugin root **File format**: Directories containing `SKILL.md` files with frontmatter **Skill structure**:

Copy

```text
skills/
├── pdf-processor/
│   ├── SKILL.md
│   ├── reference.md (optional)
│   └── scripts/ (optional)
└── code-reviewer/
    └── SKILL.md
```

**Integration behavior**:

-   Plugin Skills are automatically discovered when the plugin is installed
-   Claude autonomously invokes Skills based on matching task context
-   Skills can include supporting files alongside SKILL.md

For SKILL.md format and complete Skill authoring guidance, see:

-   [Use Skills in Claude Code](skills.html)
-   [Agent Skills overview](../agents-and-tools/agent-skills/overview.html#skill-structure)

### 

[​

](#hooks)

Hooks

Plugins can provide event handlers that respond to Claude Code events automatically. **Location**: `hooks/hooks.json` in plugin root, or inline in plugin.json **Format**: JSON configuration with event matchers and actions **Hook configuration**:

Copy

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PLUGIN_ROOT}/scripts/format-code.sh"
          }
        ]
      }
    ]
  }
}
```

**Available events**:

-   `PreToolUse`: Before Claude uses any tool
-   `PostToolUse`: After Claude uses any tool
-   `UserPromptSubmit`: When user submits a prompt
-   `Notification`: When Claude Code sends notifications
-   `Stop`: When Claude attempts to stop
-   `SubagentStop`: When a subagent attempts to stop
-   `SessionStart`: At the beginning of sessions
-   `SessionEnd`: At the end of sessions
-   `PreCompact`: Before conversation history is compacted

**Hook types**:

-   `command`: Execute shell commands or scripts
-   `validation`: Validate file contents or project state
-   `notification`: Send alerts or status updates

### 

[​

](#mcp-servers)

MCP servers

Plugins can bundle Model Context Protocol (MCP) servers to connect Claude Code with external tools and services. **Location**: `.mcp.json` in plugin root, or inline in plugin.json **Format**: Standard MCP server configuration **MCP server configuration**:

Copy

```json
{
  "mcpServers": {
    "plugin-database": {
      "command": "${CLAUDE_PLUGIN_ROOT}/servers/db-server",
      "args": ["--config", "${CLAUDE_PLUGIN_ROOT}/config.json"],
      "env": {
        "DB_PATH": "${CLAUDE_PLUGIN_ROOT}/data"
      }
    },
    "plugin-api-client": {
      "command": "npx",
      "args": ["@company/mcp-server", "--plugin-mode"],
      "cwd": "${CLAUDE_PLUGIN_ROOT}"
    }
  }
}
```

**Integration behavior**:

-   Plugin MCP servers start automatically when the plugin is enabled
-   Servers appear as standard MCP tools in Claude’s toolkit
-   Server capabilities integrate seamlessly with Claude’s existing tools
-   Plugin servers can be configured independently of user MCP servers

* * *

## 

[​

](#plugin-manifest-schema)

Plugin manifest schema

The `plugin.json` file defines your plugin’s metadata and configuration. This section documents all supported fields and options.

### 

[​

](#complete-schema)

Complete schema

Copy

```json
{
  "name": "plugin-name",
  "version": "1.2.0",
  "description": "Brief plugin description",
  "author": {
    "name": "Author Name",
    "email": "[email protected]",
    "url": "https://github.com/author"
  },
  "homepage": "https://docs.example.com/plugin",
  "repository": "https://github.com/author/plugin",
  "license": "MIT",
  "keywords": ["keyword1", "keyword2"],
  "commands": ["./custom/commands/special.md"],
  "agents": "./custom/agents/",
  "hooks": "./config/hooks.json",
  "mcpServers": "./mcp-config.json"
}
```

### 

[​

](#required-fields)

Required fields

| Field | Type | Description | Example |
| --- | --- | --- | --- |
| `name` | string | Unique identifier (kebab-case, no spaces) | `"deployment-tools"` |

### 

[​

](#metadata-fields)

Metadata fields

| Field | Type | Description | Example |
| --- | --- | --- | --- |
| `version` | string | Semantic version | `"2.1.0"` |
| `description` | string | Brief explanation of plugin purpose | `"Deployment automation tools"` |
| `author` | object | Author information | `{"name": "Dev Team", "email": "[[email protected]](../../../cdn-cgi/l/email-protection.html)"}` |
| `homepage` | string | Documentation URL | `"https://docs.example.com"` |
| `repository` | string | Source code URL | `"https://github.com/user/plugin"` |
| `license` | string | License identifier | `"MIT"`, `"Apache-2.0"` |
| `keywords` | array | Discovery tags | `["deployment", "ci-cd"]` |

### 

[​

](#component-path-fields)

Component path fields

| Field | Type | Description | Example |
| --- | --- | --- | --- |
| `commands` | string|array | Additional command files/directories | `"./custom/cmd.md"` or `["./cmd1.md"]` |
| `agents` | string|array | Additional agent files | `"./custom/agents/"` |
| `hooks` | string|object | Hook config path or inline config | `"./hooks.json"` |
| `mcpServers` | string|object | MCP config path or inline config | `"./mcp.json"` |

### 

[​

](#path-behavior-rules)

Path behavior rules

**Important**: Custom paths supplement default directories - they don’t replace them.

-   If `commands/` exists, it’s loaded in addition to custom command paths
-   All paths must be relative to plugin root and start with `./`
-   Commands from custom paths use the same naming and namespacing rules
-   Multiple paths can be specified as arrays for flexibility

**Path examples**:

Copy

```json
{
  "commands": [
    "./specialized/deploy.md",
    "./utilities/batch-process.md"
  ],
  "agents": [
    "./custom-agents/reviewer.md",
    "./custom-agents/tester.md"
  ]
}
```

### 

[​

](#environment-variables)

Environment variables

**`${CLAUDE_PLUGIN_ROOT}`**: Contains the absolute path to your plugin directory. Use this in hooks, MCP servers, and scripts to ensure correct paths regardless of installation location.

Copy

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PLUGIN_ROOT}/scripts/process.sh"
          }
        ]
      }
    ]
  }
}
```

* * *

## 

[​

](#plugin-directory-structure)

Plugin directory structure

### 

[​

](#standard-plugin-layout)

Standard plugin layout

A complete plugin follows this structure:

Copy

```text
enterprise-plugin/
├── .claude-plugin/           # Metadata directory
│   └── plugin.json          # Required: plugin manifest
├── commands/                 # Default command location
│   ├── status.md
│   └──  logs.md
├── agents/                   # Default agent location
│   ├── security-reviewer.md
│   ├── performance-tester.md
│   └── compliance-checker.md
├── skills/                   # Agent Skills
│   ├── code-reviewer/
│   │   └── SKILL.md
│   └── pdf-processor/
│       ├── SKILL.md
│       └── scripts/
├── hooks/                    # Hook configurations
│   ├── hooks.json           # Main hook config
│   └── security-hooks.json  # Additional hooks
├── .mcp.json                # MCP server definitions
├── scripts/                 # Hook and utility scripts
│   ├── security-scan.sh
│   ├── format-code.py
│   └── deploy.js
├── LICENSE                  # License file
└── CHANGELOG.md             # Version history
```

The `.claude-plugin/` directory contains the `plugin.json` file. All other directories (commands/, agents/, skills/, hooks/) must be at the plugin root, not inside `.claude-plugin/`.

### 

[​

](#file-locations-reference)

File locations reference

| Component | Default Location | Purpose |
| --- | --- | --- |
| **Manifest** | `.claude-plugin/plugin.json` | Required metadata file |
| **Commands** | `commands/` | Slash command markdown files |
| **Agents** | `agents/` | Subagent markdown files |
| **Skills** | `skills/` | Agent Skills with SKILL.md files |
| **Hooks** | `hooks/hooks.json` | Hook configuration |
| **MCP servers** | `.mcp.json` | MCP server definitions |

* * *

## 

[​

](#debugging-and-development-tools)

Debugging and development tools

### 

[​

](#debugging-commands)

Debugging commands

Use `claude --debug` to see plugin loading details:

Copy

```shellscript
claude --debug
```

This shows:

-   Which plugins are being loaded
-   Any errors in plugin manifests
-   Command, agent, and hook registration
-   MCP server initialization

### 

[​

](#common-issues)

Common issues

| Issue | Cause | Solution |
| --- | --- | --- |
| Plugin not loading | Invalid `plugin.json` | Validate JSON syntax |
| Commands not appearing | Wrong directory structure | Ensure `commands/` at root, not in `.claude-plugin/` |
| Hooks not firing | Script not executable | Run `chmod +x script.sh` |
| MCP server fails | Missing `${CLAUDE_PLUGIN_ROOT}` | Use variable for all plugin paths |
| Path errors | Absolute paths used | All paths must be relative and start with `./` |

* * *

## 

[​

](#distribution-and-versioning-reference)

Distribution and versioning reference

### 

[​

](#version-management)

Version management

Follow semantic versioning for plugin releases:

Copy

```json
## See also

- [Plugins](/en/docs/claude-code/plugins) - Tutorials and practical usage
- [Plugin marketplaces](/en/docs/claude-code/plugin-marketplaces) - Creating and managing marketplaces
- [Slash commands](/en/docs/claude-code/slash-commands) - Command development details
- [Subagents](/en/docs/claude-code/sub-agents) - Agent configuration and capabilities
- [Agent Skills](/en/docs/claude-code/skills) - Extend Claude's capabilities
- [Hooks](/en/docs/claude-code/hooks) - Event handling and automation
- [MCP](/en/docs/claude-code/mcp) - External tool integration
- [Settings](/en/docs/claude-code/settings) - Configuration options for plugins
```

Was this page helpful?

YesNo

[Hooks reference](hooks.html)[Legal and compliance](legal-and-compliance.html)

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