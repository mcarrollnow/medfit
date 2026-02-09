Sandboxing - Claude Docs 

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

Deployment

Sandboxing

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
-   [Why sandboxing matters](#why-sandboxing-matters)
-   [How it works](#how-it-works)
-   [Filesystem isolation](#filesystem-isolation)
-   [Network isolation](#network-isolation)
-   [OS-level enforcement](#os-level-enforcement)
-   [Getting started](#getting-started)
-   [Enable sandboxing](#enable-sandboxing)
-   [Configure sandboxing](#configure-sandboxing)
-   [Security benefits](#security-benefits)
-   [Protection against prompt injection](#protection-against-prompt-injection)
-   [Reduced attack surface](#reduced-attack-surface)
-   [Transparent operation](#transparent-operation)
-   [Security Limitations](#security-limitations)
-   [Advanced usage](#advanced-usage)
-   [Custom proxy configuration](#custom-proxy-configuration)
-   [Integration with existing security tools](#integration-with-existing-security-tools)
-   [Best practices](#best-practices)
-   [Open source](#open-source)
-   [Limitations](#limitations)
-   [See also](#see-also)

Deployment

# Sandboxing

Copy page

Learn how Claude Code’s sandboxed bash tool provides filesystem and network isolation for safer, more autonomous agent execution.

Copy page

## 

[​

](#overview)

Overview

Claude Code features native sandboxing to provide a more secure environment for agent execution while reducing the need for constant permission prompts. Instead of asking permission for each bash command, sandboxing creates defined boundaries upfront where Claude Code can work more freely with reduced risk. The sandboxed bash tool uses OS-level primitives to enforce both filesystem and network isolation.

## 

[​

](#why-sandboxing-matters)

Why sandboxing matters

Traditional permission-based security requires constant user approval for bash commands. While this provides control, it can lead to:

-   **Approval fatigue**: Repeatedly clicking “approve” can cause users to pay less attention to what they’re approving
-   **Reduced productivity**: Constant interruptions slow down development workflows
-   **Limited autonomy**: Claude Code cannot work as efficiently when waiting for approvals

Sandboxing addresses these challenges by:

1.  **Defining clear boundaries**: Specify exactly which directories and network hosts Claude Code can access
2.  **Reducing permission prompts**: Safe commands within the sandbox don’t require approval
3.  **Maintaining security**: Attempts to access resources outside the sandbox trigger immediate notifications
4.  **Enabling autonomy**: Claude Code can run more independently within defined limits

Effective sandboxing requires **both** filesystem and network isolation. Without network isolation, a compromised agent could exfiltrate sensitive files like SSH keys. Without filesystem isolation, a compromised agent could backdoor system resources to gain network access. When configuring sandboxing it is important to ensure that your configured settings do not create bypasses in these systems.

## 

[​

](#how-it-works)

How it works

### 

[​

](#filesystem-isolation)

Filesystem isolation

The sandboxed bash tool restricts file system access to specific directories:

-   **Default writes behavior**: Read and write access to the current working directory and its subdirectories
-   **Default read behavior**: Read access to the entire computer, except certain denied directories
-   **Blocked access**: Cannot modify files outside the current working directory without explicit permission
-   **Configurable**: Define custom allowed and denied paths through settings

### 

[​

](#network-isolation)

Network isolation

Network access is controlled through a proxy server running outside the sandbox:

-   **Domain restrictions**: Only approved domains can be accessed
-   **User confirmation**: New domain requests trigger permission prompts
-   **Custom proxy support**: Advanced users can implement custom rules on outgoing traffic
-   **Comprehensive coverage**: Restrictions apply to all scripts, programs, and subprocesses spawned by commands

### 

[​

](#os-level-enforcement)

OS-level enforcement

The sandboxed bash tool leverages operating system security primitives:

-   **Linux**: Uses [bubblewrap](https://github.com/containers/bubblewrap) for isolation
-   **macOS**: Uses Seatbelt for sandbox enforcement

These OS-level restrictions ensure that all child processes spawned by Claude Code’s commands inherit the same security boundaries.

## 

[​

](#getting-started)

Getting started

### 

[​

](#enable-sandboxing)

Enable sandboxing

You can enable sandboxing by running the `/sandbox` slash command:

Copy

```text
> /sandbox
```

This activates the sandboxed bash tool with default settings, allowing access to your current working directory while blocking access to sensitive system locations.

### 

[​

](#configure-sandboxing)

Configure sandboxing

Customize sandbox behavior through your `settings.json` file. See [Settings](settings.html#sandbox-settings) for complete configuration reference.

**Pattern support:**

-   Paths support absolute (`/home/user`), relative (`./src`), home directory (`~`), and wildcards (`**/*.json`)
-   Domains support exact matches (`github.com`), wildcards (`*.npmjs.org`), and subdomains

## 

[​

](#security-benefits)

Security benefits

### 

[​

](#protection-against-prompt-injection)

Protection against prompt injection

Even if an attacker successfully manipulates Claude Code’s behavior through prompt injection, the sandbox ensures your system remains secure: **Filesystem protection:**

-   Cannot modify critical config files such as `~/.bashrc`
-   Cannot modify system-level files in `/bin/`
-   Cannot read files that are denied in your [Claude permission settings](iam.html#configuring-permissions)

**Network protection:**

-   Cannot exfiltrate data to attacker-controlled servers
-   Cannot download malicious scripts from unauthorized domains
-   Cannot make unexpected API calls to unapproved services
-   Cannot contact any domains not explicitly allowed

**Monitoring and control:**

-   All access attempts outside the sandbox are blocked at the OS level
-   You receive immediate notifications when boundaries are tested
-   You can choose to deny, allow once, or permanently update your configuration

### 

[​

](#reduced-attack-surface)

Reduced attack surface

Sandboxing limits the potential damage from:

-   **Malicious dependencies**: NPM packages or other dependencies with harmful code
-   **Compromised scripts**: Build scripts or tools with security vulnerabilities
-   **Social engineering**: Attacks that trick users into running dangerous commands
-   **Prompt injection**: Attacks that trick Claude into running dangerous commands

### 

[​

](#transparent-operation)

Transparent operation

When Claude Code attempts to access network resources outside the sandbox:

1.  The operation is blocked at the OS level
2.  You receive an immediate notification
3.  You can choose to:
    -   Deny the request
    -   Allow it once
    -   Update your sandbox configuration to permanently allow it

## 

[​

](#security-limitations)

Security Limitations

-   Network Sandboxing Limitations: The network filtering system operates by restricting the domains that processes are allowed to connect to. It does not otherwise inspect the traffic passing through the proxy and users are responsible for ensuring they only allow trusted domains in their policy.

Users should be aware of potential risks that come from allowing broad domains like `github.com` that may allow for data exfiltration. Also, in some cases it may be possible to bypass the network filtering through [domain fronting](https://en.wikipedia.org/wiki/Domain_fronting).

-   Privilege Escalation via Unix Sockets: The `allowUnixSockets` configuration can inadvertently grant access to powerful system services that could lead to sandbox bypasses. For example, if it is used to allow access to `/var/run/docker.sock` this would effectively grant access to the host system through exploiting the docker socket. Users are encouraged to carefully consider any unix sockets that they allow through the sandbox.
-   Filesystem Permission Escalation: Overly broad filesystem write permissions can enable privilege escalation attacks. Allowing writes to directories containing executables in `$PATH`, system configuration directories, or user shell configuration files (`.bashrc`, `.zshrc`) can lead to code execution in different security contexts when other users or system processes access these files.
-   Linux Sandbox Strength: The Linux implementation provides strong filesystem and network isolation but includes an `enableWeakerNestedSandbox` mode that enables it to work inside of Docker environments without privileged namespaces. This option considerably weakens security and should only be used incases where additional isolation is otherwise enforced.

## 

[​

](#advanced-usage)

Advanced usage

### 

[​

](#custom-proxy-configuration)

Custom proxy configuration

For organizations requiring advanced network security, you can implement a custom proxy to:

-   Decrypt and inspect HTTPS traffic
-   Apply custom filtering rules
-   Log all network requests
-   Integrate with existing security infrastructure

Copy

```json
{
  "sandbox": {
    "httpProxyPort": 8080,
    "socksProxyPort": 8081,
  }
}
```

### 

[​

](#integration-with-existing-security-tools)

Integration with existing security tools

The sandboxed bash tool works alongside:

-   **IAM policies**: Combine with [permission settings](iam.html) for defense-in-depth
-   **Development containers**: Use with [devcontainers](devcontainer.html) for additional isolation
-   **Enterprise policies**: Enforce sandbox configurations through [managed settings](settings.html#settings-precedence)

## 

[​

](#best-practices)

Best practices

1.  **Start restrictive**: Begin with minimal permissions and expand as needed
2.  **Monitor logs**: Review sandbox violation attempts to understand Claude Code’s needs
3.  **Use environment-specific configs**: Different sandbox rules for development vs. production contexts
4.  **Combine with permissions**: Use sandboxing alongside IAM policies for comprehensive security
5.  **Test configurations**: Verify your sandbox settings don’t block legitimate workflows

## 

[​

](#open-source)

Open source

The sandbox runtime is available as an open source npm package for use in your own agent projects. This enables the broader AI agent community to build safer, more secure autonomous systems. This can also be used to sandbox other programs you may wish to run. For example, to sandbox an MCP server you could run:

Copy

```shellscript
npx @anthropic-ai/sandbox-runtime <command-to-sandbox>
```

For implementation details and source code, visit the [GitHub repository](https://github.com/anthropic-experimental/sandbox-runtime).

## 

[​

](#limitations)

Limitations

-   **Performance overhead**: Minimal, but some filesystem operations may be slightly slower
-   **Compatibility**: Some tools that require specific system access patterns may need configuration adjustments, or may even need to be run outside of the sandbox
-   **Platform support**: Currently supports Linux and macOS; Windows support planned

## 

[​

](#see-also)

See also

-   [Security](security.html) - Comprehensive security features and best practices
-   [IAM](iam.html) - Permission configuration and access control
-   [Settings](settings.html) - Complete configuration reference
-   [CLI reference](cli-reference.html) - Command-line options including `-sb`

Was this page helpful?

YesNo

[Development containers](devcontainer.html)[Advanced installation](setup.html)

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