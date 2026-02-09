Troubleshooting - Claude Docs 

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

Build with Claude Code

Troubleshooting

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

-   [Common installation issues](#common-installation-issues)
-   [Windows installation issues: errors in WSL](#windows-installation-issues%3A-errors-in-wsl)
-   [Linux and Mac installation issues: permission or command not found errors](#linux-and-mac-installation-issues%3A-permission-or-command-not-found-errors)
-   [Recommended solution: Native Claude Code installation](#recommended-solution%3A-native-claude-code-installation)
-   [Alternative solution: Migrate to local installation](#alternative-solution%3A-migrate-to-local-installation)
-   [Permissions and authentication](#permissions-and-authentication)
-   [Repeated permission prompts](#repeated-permission-prompts)
-   [Authentication issues](#authentication-issues)
-   [Performance and stability](#performance-and-stability)
-   [High CPU or memory usage](#high-cpu-or-memory-usage)
-   [Command hangs or freezes](#command-hangs-or-freezes)
-   [Search and discovery issues](#search-and-discovery-issues)
-   [Slow or incomplete search results on WSL](#slow-or-incomplete-search-results-on-wsl)
-   [IDE integration issues](#ide-integration-issues)
-   [JetBrains IDE not detected on WSL2](#jetbrains-ide-not-detected-on-wsl2)
-   [WSL2 networking modes](#wsl2-networking-modes)
-   [Reporting Windows IDE integration issues (both native and WSL)](#reporting-windows-ide-integration-issues-both-native-and-wsl)
-   [ESC key not working in JetBrains (IntelliJ, PyCharm, etc.) terminals](#esc-key-not-working-in-jetbrains-intellij%2C-pycharm%2C-etc-terminals)
-   [Markdown formatting issues](#markdown-formatting-issues)
-   [Missing language tags in code blocks](#missing-language-tags-in-code-blocks)
-   [Inconsistent spacing and formatting](#inconsistent-spacing-and-formatting)
-   [Best practices for markdown generation](#best-practices-for-markdown-generation)
-   [Getting more help](#getting-more-help)

Build with Claude Code

# Troubleshooting

Copy page

Discover solutions to common issues with Claude Code installation and usage.

Copy page

## 

[​

](#common-installation-issues)

Common installation issues

### 

[​

](#windows-installation-issues%3A-errors-in-wsl)

Windows installation issues: errors in WSL

You might encounter the following issues in WSL: **OS/platform detection issues**: If you receive an error during installation, WSL may be using Windows `npm`. Try:

-   Run `npm config set os linux` before installation
-   Install with `npm install -g @anthropic-ai/claude-code --force --no-os-check` (Do NOT use `sudo`)

**Node not found errors**: If you see `exec: node: not found` when running `claude`, your WSL environment may be using a Windows installation of Node.js. You can confirm this with `which npm` and `which node`, which should point to Linux paths starting with `/usr/` rather than `/mnt/c/`. To fix this, try installing Node via your Linux distribution’s package manager or via [`nvm`](https://github.com/nvm-sh/nvm). **nvm version conflicts**: If you have nvm installed in both WSL and Windows, you may experience version conflicts when switching Node versions in WSL. This happens because WSL imports the Windows PATH by default, causing Windows nvm/npm to take priority over the WSL installation. You can identify this issue by:

-   Running `which npm` and `which node` - if they point to Windows paths (starting with `/mnt/c/`), Windows versions are being used
-   Experiencing broken functionality after switching Node versions with nvm in WSL

To resolve this issue, fix your Linux PATH to ensure the Linux node/npm versions take priority: **Primary solution: Ensure nvm is properly loaded in your shell** The most common cause is that nvm isn’t loaded in non-interactive shells. Add the following to your shell configuration file (`~/.bashrc`, `~/.zshrc`, etc.):

Copy

```shellscript
# Load nvm if it exists
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
```

Or run directly in your current session:

Copy

```shellscript
source ~/.nvm/nvm.sh
```

**Alternative: Adjust PATH order** If nvm is properly loaded but Windows paths still take priority, you can explicitly prepend your Linux paths to PATH in your shell configuration:

Copy

```shellscript
export PATH="$HOME/.nvm/versions/node/$(node -v)/bin:$PATH"
```

Avoid disabling Windows PATH importing (`appendWindowsPath = false`) as this breaks the ability to easily call Windows executables from WSL. Similarly, avoid uninstalling Node.js from Windows if you use it for Windows development.

### 

[​

](#linux-and-mac-installation-issues%3A-permission-or-command-not-found-errors)

Linux and Mac installation issues: permission or command not found errors

When installing Claude Code with npm, `PATH` problems may prevent access to `claude`. You may also encounter permission errors if your npm global prefix is not user writable (eg. `/usr`, or `/usr/local`).

#### 

[​

](#recommended-solution%3A-native-claude-code-installation)

Recommended solution: Native Claude Code installation

Claude Code has a native installation that doesn’t depend on npm or Node.js.

The native Claude Code installer is currently in beta.

Use the following command to run the native installer. **macOS, Linux, WSL:**

Copy

```shellscript
# Install stable version (default)
curl -fsSL https://claude.ai/install.sh | bash

# Install latest version
curl -fsSL https://claude.ai/install.sh | bash -s latest

# Install specific version number
curl -fsSL https://claude.ai/install.sh | bash -s 1.0.58
```

**Windows PowerShell:**

Copy

```powershell
# Install stable version (default)
irm https://claude.ai/install.ps1 | iex

# Install latest version
& ([scriptblock]::Create((irm https://claude.ai/install.ps1))) latest

# Install specific version number
& ([scriptblock]::Create((irm https://claude.ai/install.ps1))) 1.0.58
```

This command installs the appropriate build of Claude Code for your operating system and architecture and adds a symlink to the installation at `~/.local/bin/claude`.

Make sure that you have the installation directory in your system PATH.

#### 

[​

](#alternative-solution%3A-migrate-to-local-installation)

Alternative solution: Migrate to local installation

Alternatively, if Claude Code will run, you can migrate to a local installation:

Copy

```shellscript
claude migrate-installer
```

This moves Claude Code to `~/.claude/local/` and sets up an alias in your shell configuration. No `sudo` is required for future updates. After migration, restart your shell, and then verify your installation: On macOS/Linux/WSL:

Copy

```shellscript
which claude  # Should show an alias to ~/.claude/local/claude
```

On Windows:

Copy

```powershell
where claude  # Should show path to claude executable
```

Verify installation:

Copy

```shellscript
claude doctor # Check installation health
```

## 

[​

](#permissions-and-authentication)

Permissions and authentication

### 

[​

](#repeated-permission-prompts)

Repeated permission prompts

If you find yourself repeatedly approving the same commands, you can allow specific tools to run without approval using the `/permissions` command. See [Permissions docs](iam.html#configuring-permissions).

### 

[​

](#authentication-issues)

Authentication issues

If you’re experiencing authentication problems:

1.  Run `/logout` to sign out completely
2.  Close Claude Code
3.  Restart with `claude` and complete the authentication process again

If problems persist, try:

Copy

```shellscript
rm -rf ~/.config/claude-code/auth.json
claude
```

This removes your stored authentication information and forces a clean login.

## 

[​

](#performance-and-stability)

Performance and stability

### 

[​

](#high-cpu-or-memory-usage)

High CPU or memory usage

Claude Code is designed to work with most development environments, but may consume significant resources when processing large codebases. If you’re experiencing performance issues:

1.  Use `/compact` regularly to reduce context size
2.  Close and restart Claude Code between major tasks
3.  Consider adding large build directories to your `.gitignore` file

### 

[​

](#command-hangs-or-freezes)

Command hangs or freezes

If Claude Code seems unresponsive:

1.  Press Ctrl+C to attempt to cancel the current operation
2.  If unresponsive, you may need to close the terminal and restart

### 

[​

](#search-and-discovery-issues)

Search and discovery issues

If Search tool, `@file` mentions, custom agents, and custom slash commands aren’t working, install system `ripgrep`:

Copy

```shellscript
# macOS (Homebrew)  
brew install ripgrep

# Windows (winget)
winget install BurntSushi.ripgrep.MSVC

# Ubuntu/Debian
sudo apt install ripgrep

# Alpine Linux
apk add ripgrep

# Arch Linux
pacman -S ripgrep
```

Then set `USE_BUILTIN_RIPGREP=0` in your [environment](settings.html#environment-variables).

### 

[​

](#slow-or-incomplete-search-results-on-wsl)

Slow or incomplete search results on WSL

Disk read performance penalties when [working across file systems on WSL](https://learn.microsoft.com/en-us/windows/wsl/filesystems) may result in fewer-than-expected matches (but not a complete lack of search functionality) when using Claude Code on WSL.

`/doctor` will show Search as OK in this case.

**Solutions:**

1.  **Submit more specific searches**: Reduce the number of files searched by specifying directories or file types: “Search for JWT validation logic in the auth-service package” or “Find use of md5 hash in JS files”.
2.  **Move project to Linux filesystem**: If possible, ensure your project is located on the Linux filesystem (`/home/`) rather than the Windows filesystem (`/mnt/c/`).
3.  **Use native Windows instead**: Consider running Claude Code natively on Windows instead of through WSL, for better file system performance.

## 

[​

](#ide-integration-issues)

IDE integration issues

### 

[​

](#jetbrains-ide-not-detected-on-wsl2)

JetBrains IDE not detected on WSL2

If you’re using Claude Code on WSL2 with JetBrains IDEs and getting “No available IDEs detected” errors, this is likely due to WSL2’s networking configuration or Windows Firewall blocking the connection.

#### 

[​

](#wsl2-networking-modes)

WSL2 networking modes

WSL2 uses NAT networking by default, which can prevent IDE detection. You have two options: **Option 1: Configure Windows Firewall** (recommended)

1.  Find your WSL2 IP address:
    
    Copy
    
    ```shellscript
    wsl hostname -I
    # Example output: 172.21.123.456
    ```
    
2.  Open PowerShell as Administrator and create a firewall rule:
    
    Copy
    
    ```powershell
    New-NetFirewallRule -DisplayName "Allow WSL2 Internal Traffic" -Direction Inbound -Protocol TCP -Action Allow -RemoteAddress 172.21.0.0/16 -LocalAddress 172.21.0.0/16
    ```
    
    (Adjust the IP range based on your WSL2 subnet from step 1)
3.  Restart both your IDE and Claude Code

**Option 2: Switch to mirrored networking** Add to `.wslconfig` in your Windows user directory:

Copy

```ini
[wsl2]
networkingMode=mirrored
```

Then restart WSL with `wsl --shutdown` from PowerShell.

These networking issues only affect WSL2. WSL1 uses the host’s network directly and doesn’t require these configurations.

For additional JetBrains configuration tips, see our [IDE integration guide](vs-code.html#jetbrains-plugin-settings).

### 

[​

](#reporting-windows-ide-integration-issues-both-native-and-wsl)

Reporting Windows IDE integration issues (both native and WSL)

If you’re experiencing IDE integration problems on Windows, please [create an issue](https://github.com/anthropics/claude-code/issues) with the following information: whether you are native (git bash), or WSL1/WSL2, WSL networking mode (NAT or mirrored), IDE name/version, Claude Code extension/plugin version, and shell type (bash/zsh/etc)

### 

[​

](#esc-key-not-working-in-jetbrains-intellij%2C-pycharm%2C-etc-terminals)

ESC key not working in JetBrains (IntelliJ, PyCharm, etc.) terminals

If you’re using Claude Code in JetBrains terminals and the ESC key doesn’t interrupt the agent as expected, this is likely due to a keybinding clash with JetBrains’ default shortcuts. To fix this issue:

1.  Go to Settings → Tools → Terminal
2.  Either:
    -   Uncheck “Move focus to the editor with Escape”, or
    -   Click “Configure terminal keybindings” and delete the “Switch focus to Editor” shortcut
3.  Apply the changes

This allows the ESC key to properly interrupt Claude Code operations.

## 

[​

](#markdown-formatting-issues)

Markdown formatting issues

Claude Code sometimes generates markdown files with missing language tags on code fences, which can affect syntax highlighting and readability in GitHub, editors, and documentation tools.

### 

[​

](#missing-language-tags-in-code-blocks)

Missing language tags in code blocks

If you notice code blocks like this in generated markdown:

Copy

```markdown
```
function example() {
  return "hello";
}
```
```

Instead of properly tagged blocks like:

Copy

```markdown
```javascript
function example() {
  return "hello";
}
```
```

**Solutions:**

1.  **Ask Claude to add language tags**: Simply request “Please add appropriate language tags to all code blocks in this markdown file.”
2.  **Use post-processing hooks**: Set up automatic formatting hooks to detect and add missing language tags. See the [markdown formatting hook example](hooks-guide.html#markdown-formatting-hook) for implementation details.
3.  **Manual verification**: After generating markdown files, review them for proper code block formatting and request corrections if needed.

### 

[​

](#inconsistent-spacing-and-formatting)

Inconsistent spacing and formatting

If generated markdown has excessive blank lines or inconsistent spacing: **Solutions:**

1.  **Request formatting corrections**: Ask Claude to “Fix spacing and formatting issues in this markdown file.”
2.  **Use formatting tools**: Set up hooks to run markdown formatters like `prettier` or custom formatting scripts on generated markdown files.
3.  **Specify formatting preferences**: Include formatting requirements in your prompts or project [memory](memory.html) files.

### 

[​

](#best-practices-for-markdown-generation)

Best practices for markdown generation

To minimize formatting issues:

-   **Be explicit in requests**: Ask for “properly formatted markdown with language-tagged code blocks”
-   **Use project conventions**: Document your preferred markdown style in [CLAUDE.md](memory.html)
-   **Set up validation hooks**: Use post-processing hooks to automatically verify and fix common formatting issues

## 

[​

](#getting-more-help)

Getting more help

If you’re experiencing issues not covered here:

1.  Use the `/bug` command within Claude Code to report problems directly to Anthropic
2.  Check the [GitHub repository](https://github.com/anthropics/claude-code) for known issues
3.  Run `/doctor` to check the health of your Claude Code installation
4.  Ask Claude directly about its capabilities and features - Claude has built-in access to its documentation

Was this page helpful?

YesNo

[Model Context Protocol (MCP)](mcp.html)[Migrate to Claude Agent SDK](sdk/migration-guide.html)

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