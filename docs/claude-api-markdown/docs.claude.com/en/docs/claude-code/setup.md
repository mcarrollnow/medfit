Set up Claude Code - Claude Docs 

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

Set up Claude Code

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

-   [System requirements](#system-requirements)
-   [Additional dependencies](#additional-dependencies)
-   [Standard installation](#standard-installation)
-   [Windows setup](#windows-setup)
-   [Alternative installation methods](#alternative-installation-methods)
-   [Global npm installation](#global-npm-installation)
-   [Native binary installation (Beta)](#native-binary-installation-beta)
-   [Local installation](#local-installation)
-   [Running on AWS or GCP](#running-on-aws-or-gcp)
-   [Update Claude Code](#update-claude-code)
-   [Auto updates](#auto-updates)
-   [Update manually](#update-manually)

Administration

# Set up Claude Code

Copy page

Install, authenticate, and start using Claude Code on your development machine.

Copy page

## 

[​

](#system-requirements)

System requirements

-   **Operating Systems**: macOS 10.15+, Ubuntu 20.04+/Debian 10+, or Windows 10+ (with WSL 1, WSL 2, or Git for Windows)
-   **Hardware**: 4GB+ RAM
-   **Software**: [Node.js 18+](https://nodejs.org/en/download)
-   **Network**: Internet connection required for authentication and AI processing
-   **Shell**: Works best in Bash, Zsh or Fish
-   **Location**: [Anthropic supported countries](https://www.anthropic.com/supported-countries)

### 

[​

](#additional-dependencies)

Additional dependencies

-   **ripgrep**: Usually included with Claude Code. If search functionality fails, see [search troubleshooting](troubleshooting.html#search-and-discovery-issues).

## 

[​

](#standard-installation)

Standard installation

To install Claude Code, run the following command:

Copy

```shellscript
npm install -g @anthropic-ai/claude-code
```

Do NOT use `sudo npm install -g` as this can lead to permission issues and security risks. If you encounter permission errors, see [configure Claude Code](troubleshooting.html#linux-permission-issues) for recommended solutions.

Some users may be automatically migrated to an improved installation method. Run `claude doctor` after installation to check your installation type.

After the installation process completes, navigate to your project and start Claude Code:

Copy

```shellscript
cd your-awesome-project
claude
```

Claude Code offers the following authentication options:

1.  **Claude Console**: The default option. Connect through the Claude Console and complete the OAuth process. Requires active billing at [console.anthropic.com](https://console.anthropic.com). A “Claude Code” workspace will be automatically created for usage tracking and cost management. Note that you cannot create API keys for the Claude Code workspace - it is dedicated exclusively for Claude Code usage.
2.  **Claude App (with Pro or Max plan)**: Subscribe to Claude’s [Pro or Max plan](https://claude.com/pricing) for a unified subscription that includes both Claude Code and the web interface. Get more value at the same price point while managing your account in one place. Log in with your Claude.ai account. During launch, choose the option that matches your subscription type.
3.  **Enterprise platforms**: Configure Claude Code to use [Amazon Bedrock or Google Vertex AI](third-party-integrations.html) for enterprise deployments with your existing cloud infrastructure.

Claude Code securely stores your credentials. See [Credential Management](iam.html#credential-management) for details.

## 

[​

](#windows-setup)

Windows setup

**Option 1: Claude Code within WSL**

-   Both WSL 1 and WSL 2 are supported

**Option 2: Claude Code on native Windows with Git Bash**

-   Requires [Git for Windows](https://git-scm.com/downloads/win)
-   For portable Git installations, specify the path to your `bash.exe`:
    
    Copy
    
    ```powershell
    $env:CLAUDE_CODE_GIT_BASH_PATH="C:\Program Files\Git\bin\bash.exe"
    ```
    

## 

[​

](#alternative-installation-methods)

Alternative installation methods

Claude Code offers multiple installation methods to suit different environments. If you encounter any issues during installation, consult the [troubleshooting guide](troubleshooting.html#linux-permission-issues).

Run `claude doctor` after installation to check your installation type and version.

### 

[​

](#global-npm-installation)

Global npm installation

Traditional method shown in the [install steps above](#standard-installation)

### 

[​

](#native-binary-installation-beta)

Native binary installation (Beta)

If you have an existing installation of Claude Code, use `claude install` to start the native binary installation. For a fresh install, run one of the following commands: **Homebrew (macOS, Linux):**

Copy

```shellscript
brew install --cask claude-code
```

Claude Code installed via Homebrew will auto-update outside of the brew directory unless explicitly disabled with the `DISABLE_AUTOUPDATER` environment variable (see [Auto updates](#auto-updates) section).

**macOS, Linux, WSL:**

Copy

```shellscript
# Install stable version (default)
curl -fsSL https://claude.ai/install.sh | bash

# Install latest version
curl -fsSL https://claude.ai/install.sh | bash -s latest

# Install specific version number
curl -fsSL https://claude.ai/install.sh | bash -s 1.0.58
```

**Alpine Linux and other musl/uClibc-based distributions**: The native build requires you to install `libgcc`, `libstdc++`, and `ripgrep`. Install (Alpine: `apk add libgcc libstdc++ ripgrep`) and set `USE_BUILTIN_RIPGREP=0`.

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

**Windows CMD:**

Copy

```bat
REM Install stable version (default)
curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd && del install.cmd

REM Install latest version
curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd latest && del install.cmd

REM Install specific version number
curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd 1.0.58 && del install.cmd
```

The native Claude Code installer is supported on macOS, Linux, and Windows.

Make sure that you remove any outdated aliases or symlinks. Once your installation is complete, run `claude doctor` to verify the installation.

### 

[​

](#local-installation)

Local installation

-   After global install via npm, use `claude migrate-installer` to move to local
-   Avoids autoupdater npm permission issues
-   Some users may be automatically migrated to this method

## 

[​

](#running-on-aws-or-gcp)

Running on AWS or GCP

By default, Claude Code uses the Claude API. For details on running Claude Code on AWS or GCP, see [third-party integrations](third-party-integrations.html).

## 

[​

](#update-claude-code)

Update Claude Code

### 

[​

](#auto-updates)

Auto updates

Claude Code automatically keeps itself up to date to ensure you have the latest features and security fixes.

-   **Update checks**: Performed on startup and periodically while running
-   **Update process**: Downloads and installs automatically in the background
-   **Notifications**: You’ll see a notification when updates are installed
-   **Applying updates**: Updates take effect the next time you start Claude Code

**Disable auto-updates:** Set the `DISABLE_AUTOUPDATER` environment variable in your shell or [settings.json file](settings.html):

Copy

```shellscript
export DISABLE_AUTOUPDATER=1
```

### 

[​

](#update-manually)

Update manually

Copy

```shellscript
claude update
```

Was this page helpful?

YesNo

[Sandboxing](sandboxing.html)[Identity and Access Management](iam.html)

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