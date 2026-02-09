Visual Studio Code - Claude Docs 

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

Configuration

Visual Studio Code

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

-   [VS Code Extension (Beta)](#vs-code-extension-beta)
-   [Features](#features)
-   [Requirements](#requirements)
-   [Installation](#installation)
-   [Updating](#updating)
-   [How It Works](#how-it-works)
-   [Using Third-Party Providers (Vertex and Bedrock)](#using-third-party-providers-vertex-and-bedrock)
-   [Environment Variables](#environment-variables)
-   [Not Yet Implemented](#not-yet-implemented)
-   [Security Considerations](#security-considerations)
-   [Legacy CLI Integration](#legacy-cli-integration)
-   [Troubleshooting](#troubleshooting)
-   [Extension Not Installing](#extension-not-installing)
-   [Legacy Integration Not Working](#legacy-integration-not-working)

Configuration

# Visual Studio Code

Copy page

Use Claude Code with Visual Studio Code through our native extension or CLI integration

Copy page

![Claude Code VS Code Extension Interface](../../../../mintcdn.com/anthropic-claude-docs/Xfpgr-ckk38MZnw3/images/vs-code-extension-interface%EF%B9%96fit=max&auto=format&n=Xfpgr-ckk38MZnw3&q=85&s=600835067c8b03557a0529978e3f0261.jpg)

## 

[​

](#vs-code-extension-beta)

VS Code Extension (Beta)

The VS Code extension, available in beta, lets you see Claude’s changes in real-time through a native graphical interface integrated directly into your IDE. The VS Code extension makes it easier to access and interact with Claude Code for users who prefer a visual interface over the terminal.

### 

[​

](#features)

Features

The VS Code extension provides:

-   **Native IDE experience**: Dedicated Claude Code sidebar panel accessed via the Spark icon
-   **Plan mode with editing**: Review and edit Claude’s plans before accepting them
-   **Auto-accept edits mode**: Automatically apply Claude’s changes as they’re made
-   **File management**: @-mention files or attach files and images using the system file picker
-   **MCP server usage**: Use Model Context Protocol servers configured through the CLI
-   **Conversation history**: Easy access to past conversations
-   **Multiple sessions**: Run multiple Claude Code sessions simultaneously
-   **Keyboard shortcuts**: Support for most shortcuts from the CLI
-   **Slash commands**: Access most CLI slash commands directly in the extension

### 

[​

](#requirements)

Requirements

-   VS Code 1.98.0 or higher

### 

[​

](#installation)

Installation

Download and install the extension from the [Visual Studio Code Extension Marketplace](https://marketplace.visualstudio.com/items?itemName=anthropic.claude-code).

### 

[​

](#updating)

Updating

To update the VS Code extension:

1.  Open the VS Code command palette with `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux)
2.  Search for “Claude Code: Update”
3.  Select the command to update to the latest version

### 

[​

](#how-it-works)

How It Works

Once installed, you can start using Claude Code through the VS Code interface:

1.  Click the Spark icon in your editor’s sidebar to open the Claude Code panel
2.  Prompt Claude Code in the same way you would in the terminal
3.  Watch as Claude analyzes your code and suggests changes
4.  Review and accept edits directly in the interface
    -   **Tip**: Drag the sidebar wider to see inline diffs, then click on them to expand for full details

### 

[​

](#using-third-party-providers-vertex-and-bedrock)

Using Third-Party Providers (Vertex and Bedrock)

The VS Code extension supports using Claude Code with third-party providers like Amazon Bedrock and Google Vertex AI. When configured with these providers, the extension will not prompt for login. To use third-party providers, configure environment variables in the VS Code extension settings:

1.  Open VS Code settings
2.  Search for “Claude Code: Environment Variables”
3.  Add the required environment variables

#### 

[​

](#environment-variables)

Environment Variables

| Variable | Description | Required | Example |
| --- | --- | --- | --- |
| `CLAUDE_CODE_USE_BEDROCK` | Enable Amazon Bedrock integration | Required for Bedrock | `"1"` or `"true"` |
| `CLAUDE_CODE_USE_VERTEX` | Enable Google Vertex AI integration | Required for Vertex AI | `"1"` or `"true"` |
| `ANTHROPIC_API_KEY` | API key for third-party access | Required | `"your-api-key"` |
| `AWS_REGION` | AWS region for Bedrock |  | `"us-east-2"` |
| `AWS_PROFILE` | AWS profile for Bedrock authentication |  | `"your-profile"` |
| `CLOUD_ML_REGION` | Region for Vertex AI |  | `"global"` or `"us-east5"` |
| `ANTHROPIC_VERTEX_PROJECT_ID` | GCP project ID for Vertex AI |  | `"your-project-id"` |
| `ANTHROPIC_MODEL` | Override primary model | Override model ID | `"us.anthropic.claude-3-7-sonnet-20250219-v1:0"` |
| `ANTHROPIC_SMALL_FAST_MODEL` | Override small/fast model | Optional | `"us.anthropic.claude-3-5-haiku-20241022-v1:0"` |

For detailed setup instructions and additional configuration options, see:

-   [Claude Code on Amazon Bedrock](amazon-bedrock.html)
-   [Claude Code on Google Vertex AI](google-vertex-ai.html)

### 

[​

](#not-yet-implemented)

Not Yet Implemented

The following features are not yet available in the VS Code extension:

-   **Full MCP server configuration**: You need to [configure MCP servers through the CLI](mcp.html) first, then the extension will use them
-   **Subagents configuration**: Configure [subagents through the CLI](sub-agents.html) to use them in VS Code
-   **Checkpoints**: Save and restore conversation state at specific points
-   **Advanced shortcuts**:
    -   `#` shortcut to add to memory
    -   `!` shortcut to run bash commands directly
-   **Tab completion**: File path completion with tab key

We are working on adding these features in future updates.

## 

[​

](#security-considerations)

Security Considerations

When Claude Code runs in VS Code with auto-edit permissions enabled, it may be able to modify IDE configuration files that can be automatically executed by your IDE. This may increase the risk of running Claude Code in auto-edit mode and allow bypassing Claude Code’s permission prompts for bash execution. When running in VS Code, consider:

-   Enabling [VS Code Restricted Mode](https://code.visualstudio.com/docs/editor/workspace-trust#_restricted-mode) for untrusted workspaces
-   Using manual approval mode for edits
-   Taking extra care to ensure Claude is only used with trusted prompts

## 

[​

](#legacy-cli-integration)

Legacy CLI Integration

The first VS Code integration that we released allows Claude Code running in the terminal to interact with your IDE. It provides selection context sharing (current selection/tab is automatically shared with Claude Code), diff viewing in the IDE instead of terminal, file reference shortcuts (`Cmd+Option+K` on Mac or `Alt+Ctrl+K` on Windows/Linux to insert file references like @File#L1-99), and automatic diagnostic sharing (lint and syntax errors). The legacy integration auto-installs when you run `claude` from VS Code’s integrated terminal. Simply run `claude` from the terminal and all features activate. For external terminals, use the `/ide` command to connect Claude Code to your VS Code instance. To configure, run `claude`, enter `/config`, and set the diff tool to `auto` for automatic IDE detection. Both the extension and CLI integration work with Visual Studio Code, Cursor, Windsurf, and VSCodium.

## 

[​

](#troubleshooting)

Troubleshooting

### 

[​

](#extension-not-installing)

Extension Not Installing

-   Ensure you have a compatible version of VS Code (1.85.0 or later)
-   Check that VS Code has permission to install extensions
-   Try installing directly from the marketplace website

### 

[​

](#legacy-integration-not-working)

Legacy Integration Not Working

-   Ensure you’re running Claude Code from VS Code’s integrated terminal
-   Ensure the CLI for your IDE variant is installed:
    -   VS Code: `code` command should be available
    -   Cursor: `cursor` command should be available
    -   Windsurf: `windsurf` command should be available
    -   VSCodium: `codium` command should be available
-   If the command isn’t installed:
    1.  Open command palette with `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux)
    2.  Search for “Shell Command: Install ‘code’ command in PATH” (or equivalent for your IDE)

For additional help, see our [troubleshooting guide](troubleshooting.html).

Was this page helpful?

YesNo

[Settings](settings.html)[JetBrains IDEs](jetbrains.html)

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