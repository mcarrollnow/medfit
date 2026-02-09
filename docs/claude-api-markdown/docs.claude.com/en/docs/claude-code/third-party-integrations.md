Enterprise deployment overview - Claude Docs 

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

Enterprise deployment overview

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

-   [Provider comparison](#provider-comparison)
-   [Cloud providers](#cloud-providers)
-   [Corporate infrastructure](#corporate-infrastructure)
-   [Configuration overview](#configuration-overview)
-   [Using Bedrock with corporate proxy](#using-bedrock-with-corporate-proxy)
-   [Using Bedrock with LLM Gateway](#using-bedrock-with-llm-gateway)
-   [Using Vertex AI with corporate proxy](#using-vertex-ai-with-corporate-proxy)
-   [Using Vertex AI with LLM Gateway](#using-vertex-ai-with-llm-gateway)
-   [Authentication configuration](#authentication-configuration)
-   [Choosing the right deployment configuration](#choosing-the-right-deployment-configuration)
-   [Direct provider access](#direct-provider-access)
-   [Corporate proxy](#corporate-proxy)
-   [LLM Gateway](#llm-gateway)
-   [Debugging](#debugging)
-   [Best practices for organizations](#best-practices-for-organizations)
-   [1\. Invest in documentation and memory](#1-invest-in-documentation-and-memory)
-   [2\. Simplify deployment](#2-simplify-deployment)
-   [3\. Start with guided usage](#3-start-with-guided-usage)
-   [4\. Configure security policies](#4-configure-security-policies)
-   [5\. Leverage MCP for integrations](#5-leverage-mcp-for-integrations)
-   [Next steps](#next-steps)

Deployment

# Enterprise deployment overview

Copy page

Learn how Claude Code can integrate with various third-party services and infrastructure to meet enterprise deployment requirements.

Copy page

This page provides an overview of available deployment options and helps you choose the right configuration for your organization.

## 

[​

](#provider-comparison)

Provider comparison

| Feature | Anthropic | Amazon Bedrock | Google Vertex AI |
| --- | --- | --- | --- |
| Regions | Supported [countries](https://www.anthropic.com/supported-countries) | Multiple AWS [regions](https://docs.aws.amazon.com/bedrock/latest/userguide/models-regions.html) | Multiple GCP [regions](https://cloud.google.com/vertex-ai/generative-ai/docs/learn/locations) |
| Prompt caching | Enabled by default | Enabled by default | Enabled by default |
| Authentication | API key | AWS credentials (IAM) | GCP credentials (OAuth/Service Account) |
| Cost tracking | Dashboard | AWS Cost Explorer | GCP Billing |
| Enterprise features | Teams, usage monitoring | IAM policies, CloudTrail | IAM roles, Cloud Audit Logs |

## 

[​

](#cloud-providers)

Cloud providers

[

## Amazon Bedrock

Use Claude models through AWS infrastructure with IAM-based authentication and AWS-native monitoring





](amazon-bedrock.html)[

## Google Vertex AI

Access Claude models via Google Cloud Platform with enterprise-grade security and compliance





](google-vertex-ai.html)

## 

[​

](#corporate-infrastructure)

Corporate infrastructure

[

## Enterprise Network

Configure Claude Code to work with your organization’s proxy servers and SSL/TLS requirements





](network-config.html)[

## LLM Gateway

Deploy centralized model access with usage tracking, budgeting, and audit logging





](llm-gateway.html)

## 

[​

](#configuration-overview)

Configuration overview

Claude Code supports flexible configuration options that allow you to combine different providers and infrastructure:

Understand the difference between:

-   **Corporate proxy**: An HTTP/HTTPS proxy for routing traffic (set via `HTTPS_PROXY` or `HTTP_PROXY`)
-   **LLM Gateway**: A service that handles authentication and provides provider-compatible endpoints (set via `ANTHROPIC_BASE_URL`, `ANTHROPIC_BEDROCK_BASE_URL`, or `ANTHROPIC_VERTEX_BASE_URL`)

Both configurations can be used in tandem.

### 

[​

](#using-bedrock-with-corporate-proxy)

Using Bedrock with corporate proxy

Route Bedrock traffic through a corporate HTTP/HTTPS proxy:

Copy

```shellscript
# Enable Bedrock
export CLAUDE_CODE_USE_BEDROCK=1
export AWS_REGION=us-east-1

# Configure corporate proxy
export HTTPS_PROXY='https://proxy.example.com:8080'
```

### 

[​

](#using-bedrock-with-llm-gateway)

Using Bedrock with LLM Gateway

Use a gateway service that provides Bedrock-compatible endpoints:

Copy

```shellscript
# Enable Bedrock
export CLAUDE_CODE_USE_BEDROCK=1

# Configure LLM gateway
export ANTHROPIC_BEDROCK_BASE_URL='https://your-llm-gateway.com/bedrock'
export CLAUDE_CODE_SKIP_BEDROCK_AUTH=1  # If gateway handles AWS auth
```

### 

[​

](#using-vertex-ai-with-corporate-proxy)

Using Vertex AI with corporate proxy

Route Vertex AI traffic through a corporate HTTP/HTTPS proxy:

Copy

```shellscript
# Enable Vertex
export CLAUDE_CODE_USE_VERTEX=1
export CLOUD_ML_REGION=us-east5
export ANTHROPIC_VERTEX_PROJECT_ID=your-project-id

# Configure corporate proxy
export HTTPS_PROXY='https://proxy.example.com:8080'
```

### 

[​

](#using-vertex-ai-with-llm-gateway)

Using Vertex AI with LLM Gateway

Combine Google Vertex AI models with an LLM gateway for centralized management:

Copy

```shellscript
# Enable Vertex
export CLAUDE_CODE_USE_VERTEX=1

# Configure LLM gateway
export ANTHROPIC_VERTEX_BASE_URL='https://your-llm-gateway.com/vertex'
export CLAUDE_CODE_SKIP_VERTEX_AUTH=1  # If gateway handles GCP auth
```

### 

[​

](#authentication-configuration)

Authentication configuration

Claude Code uses the `ANTHROPIC_AUTH_TOKEN` for the `Authorization` header when needed. The `SKIP_AUTH` flags (`CLAUDE_CODE_SKIP_BEDROCK_AUTH`, `CLAUDE_CODE_SKIP_VERTEX_AUTH`) are used in LLM gateway scenarios where the gateway handles provider authentication.

## 

[​

](#choosing-the-right-deployment-configuration)

Choosing the right deployment configuration

Consider these factors when selecting your deployment approach:

### 

[​

](#direct-provider-access)

Direct provider access

Best for organizations that:

-   Want the simplest setup
-   Have existing AWS or GCP infrastructure
-   Need provider-native monitoring and compliance

### 

[​

](#corporate-proxy)

Corporate proxy

Best for organizations that:

-   Have existing corporate proxy requirements
-   Need traffic monitoring and compliance
-   Must route all traffic through specific network paths

### 

[​

](#llm-gateway)

LLM Gateway

Best for organizations that:

-   Need usage tracking across teams
-   Want to dynamically switch between models
-   Require custom rate limiting or budgets
-   Need centralized authentication management

## 

[​

](#debugging)

Debugging

When debugging your deployment:

-   Use the `claude /status` [slash command](slash-commands.html). This command provides observability into any applied authentication, proxy, and URL settings.
-   Set environment variable `export ANTHROPIC_LOG=debug` to log requests.

## 

[​

](#best-practices-for-organizations)

Best practices for organizations

### 

[​

](#1-invest-in-documentation-and-memory)

1\. Invest in documentation and memory

We strongly recommend investing in documentation so that Claude Code understands your codebase. Organizations can deploy CLAUDE.md files at multiple levels:

-   **Organization-wide**: Deploy to system directories like `/Library/Application Support/ClaudeCode/CLAUDE.md` (macOS) for company-wide standards
-   **Repository-level**: Create `CLAUDE.md` files in repository roots containing project architecture, build commands, and contribution guidelines. Check these into source control so all users benefit [Learn more](memory.html).

### 

[​

](#2-simplify-deployment)

2\. Simplify deployment

If you have a custom development environment, we find that creating a “one click” way to install Claude Code is key to growing adoption across an organization.

### 

[​

](#3-start-with-guided-usage)

3\. Start with guided usage

Encourage new users to try Claude Code for codebase Q&A, or on smaller bug fixes or feature requests. Ask Claude Code to make a plan. Check Claude’s suggestions and give feedback if it’s off-track. Over time, as users understand this new paradigm better, then they’ll be more effective at letting Claude Code run more agentically.

### 

[​

](#4-configure-security-policies)

4\. Configure security policies

Security teams can configure managed permissions for what Claude Code is and is not allowed to do, which cannot be overwritten by local configuration. [Learn more](security.html).

### 

[​

](#5-leverage-mcp-for-integrations)

5\. Leverage MCP for integrations

MCP is a great way to give Claude Code more information, such as connecting to ticket management systems or error logs. We recommend that one central team configures MCP servers and checks a `.mcp.json` configuration into the codebase so that all users benefit. [Learn more](mcp.html). At Anthropic, we trust Claude Code to power development across every Anthropic codebase. We hope you enjoy using Claude Code as much as we do!

## 

[​

](#next-steps)

Next steps

-   [Set up Amazon Bedrock](amazon-bedrock.html) for AWS-native deployment
-   [Configure Google Vertex AI](google-vertex-ai.html) for GCP deployment
-   [Configure Enterprise Network](network-config.html) for network requirements
-   [Deploy LLM Gateway](llm-gateway.html) for enterprise management
-   [Settings](settings.html) for configuration options and environment variables

Was this page helpful?

YesNo

[Migrate to Claude Agent SDK](sdk/migration-guide.html)[Amazon Bedrock](amazon-bedrock.html)

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