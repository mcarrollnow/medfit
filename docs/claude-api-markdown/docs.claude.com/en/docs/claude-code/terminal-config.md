Optimize your terminal setup - Claude Docs 

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

Optimize your terminal setup

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

-   [Themes and appearance](#themes-and-appearance)
-   [Line breaks](#line-breaks)
-   [Set up Shift+Enter (VS Code or iTerm2):](#set-up-shift%2Benter-vs-code-or-iterm2-%3A)
-   [Set up Option+Enter (VS Code, iTerm2 or macOS Terminal.app):](#set-up-option%2Benter-vs-code%2C-iterm2-or-macos-terminal-app-%3A)
-   [Notification setup](#notification-setup)
-   [iTerm 2 system notifications](#iterm-2-system-notifications)
-   [Custom notification hooks](#custom-notification-hooks)
-   [Handling large inputs](#handling-large-inputs)
-   [Vim Mode](#vim-mode)

Configuration

# Optimize your terminal setup

Copy page

Claude Code works best when your terminal is properly configured. Follow these guidelines to optimize your experience.

Copy page

### 

[​

](#themes-and-appearance)

Themes and appearance

Claude cannot control the theme of your terminal. That’s handled by your terminal application. You can match Claude Code’s theme to your terminal any time via the `/config` command. For additional customization of the Claude Code interface itself, you can configure a [custom status line](statusline.html) to display contextual information like the current model, working directory, or git branch at the bottom of your terminal.

### 

[​

](#line-breaks)

Line breaks

You have several options for entering linebreaks into Claude Code:

-   **Quick escape**: Type `\` followed by Enter to create a newline
-   **Keyboard shortcut**: Set up a keybinding to insert a newline

#### 

[​

](#set-up-shift%2Benter-vs-code-or-iterm2-%3A)

Set up Shift+Enter (VS Code or iTerm2):

Run `/terminal-setup` within Claude Code to automatically configure Shift+Enter.

#### 

[​

](#set-up-option%2Benter-vs-code%2C-iterm2-or-macos-terminal-app-%3A)

Set up Option+Enter (VS Code, iTerm2 or macOS Terminal.app):

**For Mac Terminal.app:**

1.  Open Settings → Profiles → Keyboard
2.  Check “Use Option as Meta Key”

**For iTerm2 and VS Code terminal:**

1.  Open Settings → Profiles → Keys
2.  Under General, set Left/Right Option key to “Esc+“

### 

[​

](#notification-setup)

Notification setup

Never miss when Claude completes a task with proper notification configuration:

#### 

[​

](#iterm-2-system-notifications)

iTerm 2 system notifications

For iTerm 2 alerts when tasks complete:

1.  Open iTerm 2 Preferences
2.  Navigate to Profiles → Terminal
3.  Enable “Silence bell” and Filter Alerts → “Send escape sequence-generated alerts”
4.  Set your preferred notification delay

Note that these notifications are specific to iTerm 2 and not available in the default macOS Terminal.

#### 

[​

](#custom-notification-hooks)

Custom notification hooks

For advanced notification handling, you can create [notification hooks](hooks.html#notification) to run your own logic.

### 

[​

](#handling-large-inputs)

Handling large inputs

When working with extensive code or long instructions:

-   **Avoid direct pasting**: Claude Code may struggle with very long pasted content
-   **Use file-based workflows**: Write content to a file and ask Claude to read it
-   **Be aware of VS Code limitations**: The VS Code terminal is particularly prone to truncating long pastes

### 

[​

](#vim-mode)

Vim Mode

Claude Code supports a subset of Vim keybindings that can be enabled with `/vim` or configured via `/config`. The supported subset includes:

-   Mode switching: `Esc` (to NORMAL), `i`/`I`, `a`/`A`, `o`/`O` (to INSERT)
-   Navigation: `h`/`j`/`k`/`l`, `w`/`e`/`b`, `0`/`$`/`^`, `gg`/`G`
-   Editing: `x`, `dw`/`de`/`db`/`dd`/`D`, `cw`/`ce`/`cb`/`cc`/`C`, `.` (repeat)

Was this page helpful?

YesNo

[JetBrains IDEs](jetbrains.html)[Model configuration](model-config.html)

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