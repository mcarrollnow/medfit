Plugin marketplaces - Claude Docs 

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

Administration

Plugin marketplaces

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

-   [Overview](#overview)
-   [Prerequisites](#prerequisites)
-   [Add and use marketplaces](#add-and-use-marketplaces)
-   [Add GitHub marketplaces](#add-github-marketplaces)
-   [Add Git repositories](#add-git-repositories)
-   [Add local marketplaces for development](#add-local-marketplaces-for-development)
-   [Install plugins from marketplaces](#install-plugins-from-marketplaces)
-   [Verify marketplace installation](#verify-marketplace-installation)
-   [Configure team marketplaces](#configure-team-marketplaces)
-   [Create your own marketplace](#create-your-own-marketplace)
-   [Prerequisites for marketplace creation](#prerequisites-for-marketplace-creation)
-   [Create the marketplace file](#create-the-marketplace-file)
-   [Marketplace schema](#marketplace-schema)
-   [Required fields](#required-fields)
-   [Optional metadata](#optional-metadata)
-   [Plugin entries](#plugin-entries)
-   [Optional plugin fields](#optional-plugin-fields)
-   [Plugin sources](#plugin-sources)
-   [Relative paths](#relative-paths)
-   [GitHub repositories](#github-repositories)
-   [Git repositories](#git-repositories)
-   [Advanced plugin entries](#advanced-plugin-entries)
-   [Host and distribute marketplaces](#host-and-distribute-marketplaces)
-   [Host on GitHub (recommended)](#host-on-github-recommended)
-   [Host on other git services](#host-on-other-git-services)
-   [Use local marketplaces for development](#use-local-marketplaces-for-development)
-   [Manage marketplace operations](#manage-marketplace-operations)
-   [List known marketplaces](#list-known-marketplaces)
-   [Update marketplace metadata](#update-marketplace-metadata)
-   [Remove a marketplace](#remove-a-marketplace)
-   [Troubleshooting marketplaces](#troubleshooting-marketplaces)
-   [Common marketplace issues](#common-marketplace-issues)
-   [Marketplace not loading](#marketplace-not-loading)
-   [Plugin installation failures](#plugin-installation-failures)
-   [Validation and testing](#validation-and-testing)
-   [Next steps](#next-steps)
-   [For marketplace users](#for-marketplace-users)
-   [For marketplace creators](#for-marketplace-creators)
-   [For organizations](#for-organizations)
-   [See also](#see-also)

Administration

# Plugin marketplaces

Copy page

Create and manage plugin marketplaces to distribute Claude Code extensions across teams and communities.

Copy page

Plugin marketplaces are catalogs of available plugins that make it easy to discover, install, and manage Claude Code extensions. This guide shows you how to use existing marketplaces and create your own for team distribution.

## 

[​

](#overview)

Overview

A marketplace is a JSON file that lists available plugins and describes where to find them. Marketplaces provide:

-   **Centralized discovery**: Browse plugins from multiple sources in one place
-   **Version management**: Track and update plugin versions automatically
-   **Team distribution**: Share required plugins across your organization
-   **Flexible sources**: Support for git repositories, GitHub repos, local paths, and package managers

### 

[​

](#prerequisites)

Prerequisites

-   Claude Code installed and running
-   Basic familiarity with JSON file format
-   For creating marketplaces: Git repository or local development environment

## 

[​

](#add-and-use-marketplaces)

Add and use marketplaces

Add marketplaces using the `/plugin marketplace` commands to access plugins from different sources:

### 

[​

](#add-github-marketplaces)

Add GitHub marketplaces

Add a GitHub repository containing .claude-plugin/marketplace.json

Copy

```shellscript
/plugin marketplace add owner/repo
```

### 

[​

](#add-git-repositories)

Add Git repositories

Add any git repository

Copy

```shellscript
/plugin marketplace add https://gitlab.com/company/plugins.git
```

### 

[​

](#add-local-marketplaces-for-development)

Add local marketplaces for development

Add local directory containing .claude-plugin/marketplace.json

Copy

```shellscript
/plugin marketplace add ./my-marketplace
```

Add direct path to marketplace.json file

Copy

```shellscript
/plugin marketplace add ./path/to/marketplace.json
```

Add remote marketplace.json via URL

Copy

```shellscript
/plugin marketplace add https://url.of/marketplace.json
```

### 

[​

](#install-plugins-from-marketplaces)

Install plugins from marketplaces

Once you’ve added marketplaces, install plugins directly:

Install from any known marketplace

Copy

```shellscript
/plugin install plugin-name@marketplace-name
```

Browse available plugins interactively

Copy

```shellscript
/plugin
```

### 

[​

](#verify-marketplace-installation)

Verify marketplace installation

After adding a marketplace:

1.  **List marketplaces**: Run `/plugin marketplace list` to confirm it’s added
2.  **Browse plugins**: Use `/plugin` to see available plugins from your marketplace
3.  **Test installation**: Try installing a plugin to verify the marketplace works correctly

## 

[​

](#configure-team-marketplaces)

Configure team marketplaces

Set up automatic marketplace installation for team projects by specifying required marketplaces in `.claude/settings.json`:

Copy

```json
{
  "extraKnownMarketplaces": {
    "team-tools": {
      "source": {
        "source": "github",
        "repo": "your-org/claude-plugins"
      }
    },
    "project-specific": {
      "source": {
        "source": "git",
        "url": "https://git.company.com/project-plugins.git"
      }
    }
  }
}
```

When team members trust the repository folder, Claude Code automatically installs these marketplaces and any plugins specified in the `enabledPlugins` field.

* * *

## 

[​

](#create-your-own-marketplace)

Create your own marketplace

Build and distribute custom plugin collections for your team or community.

### 

[​

](#prerequisites-for-marketplace-creation)

Prerequisites for marketplace creation

-   Git repository (GitHub, GitLab, or other git hosting)
-   Understanding of JSON file format
-   One or more plugins to distribute

### 

[​

](#create-the-marketplace-file)

Create the marketplace file

Create `.claude-plugin/marketplace.json` in your repository root:

Copy

```json
{
  "name": "company-tools",
  "owner": {
    "name": "DevTools Team",
    "email": "[email protected]"
  },
  "plugins": [
    {
      "name": "code-formatter",
      "source": "./plugins/formatter",
      "description": "Automatic code formatting on save",
      "version": "2.1.0",
      "author": {
        "name": "DevTools Team"
      }
    },
    {
      "name": "deployment-tools",
      "source": {
        "source": "github",
        "repo": "company/deploy-plugin"
      },
      "description": "Deployment automation tools"
    }
  ]
}
```

### 

[​

](#marketplace-schema)

Marketplace schema

#### 

[​

](#required-fields)

Required fields

| Field | Type | Description |
| --- | --- | --- |
| `name` | string | Marketplace identifier (kebab-case, no spaces) |
| `owner` | object | Marketplace maintainer information |
| `plugins` | array | List of available plugins |

#### 

[​

](#optional-metadata)

Optional metadata

| Field | Type | Description |
| --- | --- | --- |
| `metadata.description` | string | Brief marketplace description |
| `metadata.version` | string | Marketplace version |
| `metadata.pluginRoot` | string | Base path for relative plugin sources |

### 

[​

](#plugin-entries)

Plugin entries

Plugin entries are based on the *plugin manifest schema* (with all fields made optional) plus marketplace-specific fields (`source`, `category`, `tags`, `strict`), with `name` being required.

**Required fields:**

| Field | Type | Description |
| --- | --- | --- |
| `name` | string | Plugin identifier (kebab-case, no spaces) |
| `source` | string|object | Where to fetch the plugin from |

#### 

[​

](#optional-plugin-fields)

Optional plugin fields

**Standard metadata fields:**

| Field | Type | Description |
| --- | --- | --- |
| `description` | string | Brief plugin description |
| `version` | string | Plugin version |
| `author` | object | Plugin author information |
| `homepage` | string | Plugin homepage or documentation URL |
| `repository` | string | Source code repository URL |
| `license` | string | SPDX license identifier (e.g., MIT, Apache-2.0) |
| `keywords` | array | Tags for plugin discovery and categorization |
| `category` | string | Plugin category for organization |
| `tags` | array | Tags for searchability |
| `strict` | boolean | Require plugin.json in plugin folder (default: true) 1 |

**Component configuration fields:**

| Field | Type | Description |
| --- | --- | --- |
| `commands` | string|array | Custom paths to command files or directories |
| `agents` | string|array | Custom paths to agent files |
| `hooks` | string|object | Custom hooks configuration or path to hooks file |
| `mcpServers` | string|object | MCP server configurations or path to MCP config |

*1 - When `strict: true` (default), the plugin must include a `plugin.json` manifest file, and marketplace fields supplement those values. When `strict: false`, the plugin.json is optional. If it’s missing, the marketplace entry serves as the complete plugin manifest.*

### 

[​

](#plugin-sources)

Plugin sources

#### 

[​

](#relative-paths)

Relative paths

For plugins in the same repository:

Copy

```json
{
  "name": "my-plugin",
  "source": "./plugins/my-plugin"
}
```

#### 

[​

](#github-repositories)

GitHub repositories

Copy

```json
{
  "name": "github-plugin",
  "source": {
    "source": "github",
    "repo": "owner/plugin-repo"
  }
}
```

#### 

[​

](#git-repositories)

Git repositories

Copy

```json
{
  "name": "git-plugin",
  "source": {
    "source": "url",
    "url": "https://gitlab.com/team/plugin.git"
  }
}
```

#### 

[​

](#advanced-plugin-entries)

Advanced plugin entries

Plugin entries can override default component locations and provide additional metadata. Note that `${CLAUDE_PLUGIN_ROOT}` is an environment variable that resolves to the plugin’s installation directory (for details see [Environment variables](plugins-reference.html#environment-variables)):

Copy

```json
{
  "name": "enterprise-tools",
  "source": {
    "source": "github",
    "repo": "company/enterprise-plugin"
  },
  "description": "Enterprise workflow automation tools",
  "version": "2.1.0",
  "author": {
    "name": "Enterprise Team",
    "email": "[email protected]"
  },
  "homepage": "https://docs.company.com/plugins/enterprise-tools",
  "repository": "https://github.com/company/enterprise-plugin",
  "license": "MIT",
  "keywords": ["enterprise", "workflow", "automation"],
  "category": "productivity",
  "commands": [
    "./commands/core/",
    "./commands/enterprise/",
    "./commands/experimental/preview.md"
  ],
  "agents": [
    "./agents/security-reviewer.md",
    "./agents/compliance-checker.md"
  ],
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [{"type": "command", "command": "${CLAUDE_PLUGIN_ROOT}/scripts/validate.sh"}]
      }
    ]
  },
  "mcpServers": {
    "enterprise-db": {
      "command": "${CLAUDE_PLUGIN_ROOT}/servers/db-server",
      "args": ["--config", "${CLAUDE_PLUGIN_ROOT}/config.json"]
    }
  },
  "strict": false
}
```

**Schema relationship**: Plugin entries use the plugin manifest schema with all fields made optional, plus marketplace-specific fields (`source`, `strict`, `category`, `tags`). This means any field valid in a `plugin.json` file can also be used in a marketplace entry. When `strict: false`, the marketplace entry serves as the complete plugin manifest if no `plugin.json` exists. When `strict: true` (default), marketplace fields supplement the plugin’s own manifest file.

* * *

## 

[​

](#host-and-distribute-marketplaces)

Host and distribute marketplaces

Choose the best hosting strategy for your plugin distribution needs.

### 

[​

](#host-on-github-recommended)

Host on GitHub (recommended)

GitHub provides the easiest distribution method:

1.  **Create a repository**: Set up a new repository for your marketplace
2.  **Add marketplace file**: Create `.claude-plugin/marketplace.json` with your plugin definitions
3.  **Share with teams**: Team members add with `/plugin marketplace add owner/repo`

**Benefits**: Built-in version control, issue tracking, and team collaboration features.

### 

[​

](#host-on-other-git-services)

Host on other git services

Any git hosting service works for marketplace distribution, using a URL to an arbitrary git repository. For example, using GitLab:

Copy

```shellscript
/plugin marketplace add https://gitlab.com/company/plugins.git
```

### 

[​

](#use-local-marketplaces-for-development)

Use local marketplaces for development

Test your marketplace locally before distribution:

Add local marketplace for testing

Copy

```shellscript
/plugin marketplace add ./my-local-marketplace
```

Test plugin installation

Copy

```shellscript
/plugin install test-plugin@my-local-marketplace
```

## 

[​

](#manage-marketplace-operations)

Manage marketplace operations

### 

[​

](#list-known-marketplaces)

List known marketplaces

List all configured marketplaces

Copy

```shellscript
/plugin marketplace list
```

Shows all configured marketplaces with their sources and status.

### 

[​

](#update-marketplace-metadata)

Update marketplace metadata

Refresh marketplace metadata

Copy

```shellscript
/plugin marketplace update marketplace-name
```

Refreshes plugin listings and metadata from the marketplace source.

### 

[​

](#remove-a-marketplace)

Remove a marketplace

Remove a marketplace

Copy

```shellscript
/plugin marketplace remove marketplace-name
```

Removes the marketplace from your configuration.

Removing a marketplace will uninstall any plugins you installed from it.

* * *

## 

[​

](#troubleshooting-marketplaces)

Troubleshooting marketplaces

### 

[​

](#common-marketplace-issues)

Common marketplace issues

#### 

[​

](#marketplace-not-loading)

Marketplace not loading

**Symptoms**: Can’t add marketplace or see plugins from it **Solutions**:

-   Verify the marketplace URL is accessible
-   Check that `.claude-plugin/marketplace.json` exists at the specified path
-   Ensure JSON syntax is valid using `claude plugin validate`
-   For private repositories, confirm you have access permissions

#### 

[​

](#plugin-installation-failures)

Plugin installation failures

**Symptoms**: Marketplace appears but plugin installation fails **Solutions**:

-   Verify plugin source URLs are accessible
-   Check that plugin directories contain required files
-   For GitHub sources, ensure repositories are public or you have access
-   Test plugin sources manually by cloning/downloading

### 

[​

](#validation-and-testing)

Validation and testing

Test your marketplace before sharing:

Validate marketplace JSON syntax

Copy

```shellscript
claude plugin validate .
```

Add marketplace for testing

Copy

```shellscript
/plugin marketplace add ./path/to/marketplace
```

Install test plugin

Copy

```shellscript
/plugin install test-plugin@marketplace-name
```

For complete plugin testing workflows, see [Test your plugins locally](plugins.html#test-your-plugins-locally). For technical troubleshooting, see [Plugins reference](plugins-reference.html).

* * *

## 

[​

](#next-steps)

Next steps

### 

[​

](#for-marketplace-users)

For marketplace users

-   **Discover community marketplaces**: Search GitHub for Claude Code plugin collections
-   **Contribute feedback**: Report issues and suggest improvements to marketplace maintainers
-   **Share useful marketplaces**: Help your team discover valuable plugin collections

### 

[​

](#for-marketplace-creators)

For marketplace creators

-   **Build plugin collections**: Create themed marketplace around specific use cases
-   **Establish versioning**: Implement clear versioning and update policies
-   **Community engagement**: Gather feedback and maintain active marketplace communities
-   **Documentation**: Provide clear README files explaining your marketplace contents

### 

[​

](#for-organizations)

For organizations

-   **Private marketplaces**: Set up internal marketplaces for proprietary tools
-   **Governance policies**: Establish guidelines for plugin approval and security review
-   **Training resources**: Help teams discover and adopt useful plugins effectively

## 

[​

](#see-also)

See also

-   [Plugins](plugins.html) - Installing and using plugins
-   [Plugins reference](plugins-reference.html) - Complete technical specifications and schemas
-   [Plugin development](plugins.html#develop-more-complex-plugins) - Creating your own plugins
-   [Settings](settings.html#plugin-configuration) - Plugin configuration options

Was this page helpful?

YesNo

[Analytics](analytics.html)[Settings](settings.html)

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