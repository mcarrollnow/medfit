Identity and Access Management - Claude Docs 

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

Identity and Access Management

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

-   [Authentication methods](#authentication-methods)
-   [Claude API authentication](#claude-api-authentication)
-   [Cloud provider authentication](#cloud-provider-authentication)
-   [Access control and permissions](#access-control-and-permissions)
-   [Permission system](#permission-system)
-   [Configuring permissions](#configuring-permissions)
-   [Permission modes](#permission-modes)
-   [Working directories](#working-directories)
-   [Tool-specific permission rules](#tool-specific-permission-rules)
-   [Additional permission control with hooks](#additional-permission-control-with-hooks)
-   [Enterprise managed policy settings](#enterprise-managed-policy-settings)
-   [Settings precedence](#settings-precedence)
-   [Credential management](#credential-management)

Administration

# Identity and Access Management

Copy page

Learn how to configure user authentication, authorization, and access controls for Claude Code in your organization.

Copy page

## 

[​

](#authentication-methods)

Authentication methods

Setting up Claude Code requires access to Anthropic models. For teams, you can set up Claude Code access in one of three ways:

-   Claude API via the Claude Console
-   Amazon Bedrock
-   Google Vertex AI

### 

[​

](#claude-api-authentication)

Claude API authentication

**To set up Claude Code access for your team via Claude API:**

1.  Use your existing Claude Console account or create a new Claude Console account
2.  You can add users through either method below:
    -   Bulk invite users from within the Console (Console -> Settings -> Members -> Invite)
    -   [Set up SSO](https://support.claude.com/en/articles/10280258-setting-up-single-sign-on-on-the-api-console)
3.  When inviting users, they need one of the following roles:
    -   “Claude Code” role means users can only create Claude Code API keys
    -   “Developer” role means users can create any kind of API key
4.  Each invited user needs to complete these steps:
    -   Accept the Console invite
    -   [Check system requirements](setup.html#system-requirements)
    -   [Install Claude Code](setup.html#installation)
    -   Login with Console account credentials

### 

[​

](#cloud-provider-authentication)

Cloud provider authentication

**To set up Claude Code access for your team via Bedrock or Vertex:**

1.  Follow the [Bedrock docs](amazon-bedrock.html) or [Vertex docs](google-vertex-ai.html)
2.  Distribute the environment variables and instructions for generating cloud credentials to your users. Read more about how to [manage configuration here](settings.html).
3.  Users can [install Claude Code](setup.html#installation)

## 

[​

](#access-control-and-permissions)

Access control and permissions

We support fine-grained permissions so that you’re able to specify exactly what the agent is allowed to do (e.g. run tests, run linter) and what it is not allowed to do (e.g. update cloud infrastructure). These permission settings can be checked into version control and distributed to all developers in your organization, as well as customized by individual developers.

### 

[​

](#permission-system)

Permission system

Claude Code uses a tiered permission system to balance power and safety:

| Tool Type | Example | Approval Required | ”Yes, don’t ask again” Behavior |
| --- | --- | --- | --- |
| Read-only | File reads, LS, Grep | No | N/A |
| Bash Commands | Shell execution | Yes | Permanently per project directory and command |
| File Modification | Edit/write files | Yes | Until session end |

### 

[​

](#configuring-permissions)

Configuring permissions

You can view & manage Claude Code’s tool permissions with `/permissions`. This UI lists all permission rules and the settings.json file they are sourced from.

-   **Allow** rules will allow Claude Code to use the specified tool without further manual approval.
-   **Ask** rules will ask the user for confirmation whenever Claude Code tries to use the specified tool. Ask rules take precedence over allow rules.
-   **Deny** rules will prevent Claude Code from using the specified tool. Deny rules take precedence over allow and ask rules.
-   **Additional directories** extend Claude’s file access to directories beyond the initial working directory.
-   **Default mode** controls Claude’s permission behavior when encountering new requests.

Permission rules use the format: `Tool` or `Tool(optional-specifier)` A rule that is just the tool name matches any use of that tool. For example, adding `Bash` to the list of allow rules would allow Claude Code to use the Bash tool without requiring user approval.

#### 

[​

](#permission-modes)

Permission modes

Claude Code supports several permission modes that can be set as the `defaultMode` in [settings files](settings.html#settings-files):

| Mode | Description |
| --- | --- |
| `default` | Standard behavior - prompts for permission on first use of each tool |
| `acceptEdits` | Automatically accepts file edit permissions for the session |
| `plan` | Plan Mode - Claude can analyze but not modify files or execute commands |
| `bypassPermissions` | Skips all permission prompts (requires safe environment - see warning below) |

#### 

[​

](#working-directories)

Working directories

By default, Claude has access to files in the directory where it was launched. You can extend this access:

-   **During startup**: Use `--add-dir <path>` CLI argument
-   **During session**: Use `/add-dir` slash command
-   **Persistent configuration**: Add to `additionalDirectories` in [settings files](settings.html#settings-files)

Files in additional directories follow the same permission rules as the original working directory - they become readable without prompts, and file editing permissions follow the current permission mode.

#### 

[​

](#tool-specific-permission-rules)

Tool-specific permission rules

Some tools support more fine-grained permission controls: **Bash**

-   `Bash(npm run build)` Matches the exact Bash command `npm run build`
-   `Bash(npm run test:*)` Matches Bash commands starting with `npm run test`
-   `Bash(curl http://site.com/:*)` Matches curl commands that start with exactly `curl http://site.com/`

Claude Code is aware of shell operators (like `&&`) so a prefix match rule like `Bash(safe-cmd:*)` won’t give it permission to run the command `safe-cmd && other-cmd`

Important limitations of Bash permission patterns:

1.  This tool uses **prefix matches**, not regex or glob patterns
2.  The wildcard `:*` only works at the end of a pattern to match any continuation
3.  Patterns like `Bash(curl http://github.com/:*)` can be bypassed in many ways:
    -   Options before URL: `curl -X GET http://github.com/...` won’t match
    -   Different protocol: `curl https://github.com/...` won’t match
    -   Redirects: `curl -L http://bit.ly/xyz` (redirects to github)
    -   Variables: `URL=http://github.com && curl $URL` won’t match
    -   Extra spaces: `curl http://github.com` won’t match

For more reliable URL filtering, consider:

-   Using the WebFetch tool with `WebFetch(domain:github.com)` permission
-   Instructing Claude Code about your allowed curl patterns via CLAUDE.md
-   Using hooks for custom permission validation

**Read & Edit** `Edit` rules apply to all built-in tools that edit files. Claude will make a best-effort attempt to apply `Read` rules to all built-in tools that read files like Grep, Glob, and LS. Read & Edit rules both follow the [gitignore](https://git-scm.com/docs/gitignore) specification with four distinct pattern types:

| Pattern | Meaning | Example | Matches |
| --- | --- | --- | --- |
| `//path` | **Absolute** path from filesystem root | `Read(//Users/alice/secrets/**)` | `/Users/alice/secrets/**` |
| `~/path` | Path from **home** directory | `Read(~/Documents/*.pdf)` | `/Users/alice/Documents/*.pdf` |
| `/path` | Path **relative to settings file** | `Edit(/src/**/*.ts)` | `<settings file path>/src/**/*.ts` |
| `path` or `./path` | Path **relative to current directory** | `Read(*.env)` | `<cwd>/*.env` |

A pattern like `/Users/alice/file` is NOT an absolute path - it’s relative to your settings file! Use `//Users/alice/file` for absolute paths.

-   `Edit(/docs/**)` - Edits in `<project>/docs/` (NOT `/docs/`!)
-   `Read(~/.zshrc)` - Reads your home directory’s `.zshrc`
-   `Edit(//tmp/scratch.txt)` - Edits the absolute path `/tmp/scratch.txt`
-   `Read(src/**)` - Reads from `<current-directory>/src/`

**WebFetch**

-   `WebFetch(domain:example.com)` Matches fetch requests to example.com

**MCP**

-   `mcp__puppeteer` Matches any tool provided by the `puppeteer` server (name configured in Claude Code)
-   `mcp__puppeteer__puppeteer_navigate` Matches the `puppeteer_navigate` tool provided by the `puppeteer` server

Unlike other permission types, MCP permissions do NOT support wildcards (`*`).To approve all tools from an MCP server:

-   ✅ Use: `mcp__github` (approves ALL GitHub tools)
-   ❌ Don’t use: `mcp__github__*` (wildcards are not supported)

To approve specific tools only, list each one:

-   ✅ Use: `mcp__github__get_issue`
-   ✅ Use: `mcp__github__list_issues`

### 

[​

](#additional-permission-control-with-hooks)

Additional permission control with hooks

[Claude Code hooks](hooks-guide.html) provide a way to register custom shell commands to perform permission evaluation at runtime. When Claude Code makes a tool call, PreToolUse hooks run before the permission system runs, and the hook output can determine whether to approve or deny the tool call in place of the permission system.

### 

[​

](#enterprise-managed-policy-settings)

Enterprise managed policy settings

For enterprise deployments of Claude Code, we support enterprise managed policy settings that take precedence over user and project settings. This allows system administrators to enforce security policies that users cannot override. System administrators can deploy policies to:

-   macOS: `/Library/Application Support/ClaudeCode/managed-settings.json`
-   Linux and WSL: `/etc/claude-code/managed-settings.json`
-   Windows: `C:\ProgramData\ClaudeCode\managed-settings.json`

These policy files follow the same format as regular [settings files](settings.html#settings-files) but cannot be overridden by user or project settings. This ensures consistent security policies across your organization.

### 

[​

](#settings-precedence)

Settings precedence

When multiple settings sources exist, they are applied in the following order (highest to lowest precedence):

1.  Enterprise policies
2.  Command line arguments
3.  Local project settings (`.claude/settings.local.json`)
4.  Shared project settings (`.claude/settings.json`)
5.  User settings (`~/.claude/settings.json`)

This hierarchy ensures that organizational policies are always enforced while still allowing flexibility at the project and user levels where appropriate.

## 

[​

](#credential-management)

Credential management

Claude Code securely manages your authentication credentials:

-   **Storage location**: On macOS, API keys, OAuth tokens, and other credentials are stored in the encrypted macOS Keychain.
-   **Supported authentication types**: Claude.ai credentials, Claude API credentials, Bedrock Auth, and Vertex Auth.
-   **Custom credential scripts**: The [`apiKeyHelper`](settings.html#available-settings) setting can be configured to run a shell script that returns an API key.
-   **Refresh intervals**: By default, `apiKeyHelper` is called after 5 minutes or on HTTP 401 response. Set `CLAUDE_CODE_API_KEY_HELPER_TTL_MS` environment variable for custom refresh intervals.

Was this page helpful?

YesNo

[Advanced installation](setup.html)[Security](security.html)

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