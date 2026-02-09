Manage costs effectively - Claude Docs 

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

Manage costs effectively

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

-   [Track your costs](#track-your-costs)
-   [Using the /cost command](#using-the-%2Fcost-command)
-   [Additional tracking options](#additional-tracking-options)
-   [Managing costs for teams](#managing-costs-for-teams)
-   [Rate limit recommendations](#rate-limit-recommendations)
-   [Reduce token usage](#reduce-token-usage)
-   [Background token usage](#background-token-usage)
-   [Tracking version changes and updates](#tracking-version-changes-and-updates)
-   [Current version information](#current-version-information)
-   [Understanding changes in Claude Code behavior](#understanding-changes-in-claude-code-behavior)
-   [When cost reporting changes](#when-cost-reporting-changes)

Administration

# Manage costs effectively

Copy page

Learn how to track and optimize token usage and costs when using Claude Code.

Copy page

Claude Code consumes tokens for each interaction. The average cost is $6 per developer per day, with daily costs remaining below $12 for 90% of users. For team usage, Claude Code charges by API token consumption. On average, Claude Code costs ~$100-200/developer per month with Sonnet 4.5 though there is large variance depending on how many instances users are running and whether they’re using it in automation.

## 

[​

](#track-your-costs)

Track your costs

### 

[​

](#using-the-%2Fcost-command)

Using the `/cost` command

The `/cost` command is not intended for Claude Max and Pro subscribers.

The `/cost` command provides detailed token usage statistics for your current session:

Copy

```text
Total cost:            $0.55
Total duration (API):  6m 19.7s
Total duration (wall): 6h 33m 10.2s
Total code changes:    0 lines added, 0 lines removed
```

### 

[​

](#additional-tracking-options)

Additional tracking options

Check [historical usage](https://support.claude.com/en/articles/9534590-cost-and-usage-reporting-in-console) in the Claude Console (requires Admin or Billing role) and set [workspace spend limits](https://support.claude.com/en/articles/9796807-creating-and-managing-workspaces) for the Claude Code workspace (requires Admin role).

When you first authenticate Claude Code with your Claude Console account, a workspace called “Claude Code” is automatically created for you. This workspace provides centralized cost tracking and management for all Claude Code usage in your organization. You cannot create API keys for this workspace - it is exclusively for Claude Code authentication and usage.

## 

[​

](#managing-costs-for-teams)

Managing costs for teams

When using Claude API, you can limit the total Claude Code workspace spend. To configure, [follow these instructions](https://support.claude.com/en/articles/9796807-creating-and-managing-workspaces). Admins can view cost and usage reporting by [following these instructions](https://support.claude.com/en/articles/9534590-cost-and-usage-reporting-in-console). On Bedrock and Vertex, Claude Code does not send metrics from your cloud. In order to get cost metrics, several large enterprises reported using [LiteLLM](third-party-integrations.html#litellm), which is an open-source tool that helps companies [track spend by key](https://docs.litellm.ai/docs/proxy/virtual_keys#tracking-spend). This project is unaffiliated with Anthropic and we have not audited its security.

### 

[​

](#rate-limit-recommendations)

Rate limit recommendations

When setting up Claude Code for teams, consider these Token Per Minute (TPM) and Request Per Minute (RPM) per-user recommendations based on your organization size:

| Team size | TPM per user | RPM per user |
| --- | --- | --- |
| 1-5 users | 200k-300k | 5-7 |
| 5-20 users | 100k-150k | 2.5-3.5 |
| 20-50 users | 50k-75k | 1.25-1.75 |
| 50-100 users | 25k-35k | 0.62-0.87 |
| 100-500 users | 15k-20k | 0.37-0.47 |
| 500+ users | 10k-15k | 0.25-0.35 |

For example, if you have 200 users, you might request 20k TPM for each user, or 4 million total TPM (200\*20,000 = 4 million). The TPM per user decreases as team size grows because we expect fewer users to use Claude Code concurrently in larger organizations. These rate limits apply at the organization level, not per individual user, which means individual users can temporarily consume more than their calculated share when others aren’t actively using the service.

If you anticipate scenarios with unusually high concurrent usage (such as live training sessions with large groups), you may need higher TPM allocations per user.

## 

[​

](#reduce-token-usage)

Reduce token usage

-   **Compact conversations:**
    -   Claude uses auto-compact by default when context exceeds 95% capacity
    -   Toggle auto-compact: Run `/config` and navigate to “Auto-compact enabled”
    -   Use `/compact` manually when context gets large
    -   Add custom instructions: `/compact Focus on code samples and API usage`
    -   Customize compaction by adding to CLAUDE.md:
        
        Copy
        
        ```markdown
        # Summary instructions
        
        When you are using compact, please focus on test output and code changes
        ```
        
-   **Write specific queries:** Avoid vague requests that trigger unnecessary scanning
-   **Break down complex tasks:** Split large tasks into focused interactions
-   **Clear history between tasks:** Use `/clear` to reset context

Costs can vary significantly based on:

-   Size of codebase being analyzed
-   Complexity of queries
-   Number of files being searched or modified
-   Length of conversation history
-   Frequency of compacting conversations

## 

[​

](#background-token-usage)

Background token usage

Claude Code uses tokens for some background functionality even when idle:

-   **Conversation summarization**: Background jobs that summarize previous conversations for the `claude --resume` feature
-   **Command processing**: Some commands like `/cost` may generate requests to check status

These background processes consume a small amount of tokens (typically under $0.04 per session) even without active interaction.

## 

[​

](#tracking-version-changes-and-updates)

Tracking version changes and updates

### 

[​

](#current-version-information)

Current version information

To check your current Claude Code version and installation details:

Copy

```shellscript
claude doctor
```

This command shows your version, installation type, and system information.

### 

[​

](#understanding-changes-in-claude-code-behavior)

Understanding changes in Claude Code behavior

Claude Code regularly receives updates that may change how features work, including cost reporting:

-   **Version tracking**: Use `claude doctor` to see your current version
-   **Behavior changes**: Features like `/cost` may display information differently across versions
-   **Documentation access**: Claude always has access to the latest documentation, which can help explain current feature behavior

### 

[​

](#when-cost-reporting-changes)

When cost reporting changes

If you notice changes in how costs are displayed (such as the `/cost` command showing different information):

1.  **Verify your version**: Run `claude doctor` to confirm your current version
2.  **Consult documentation**: Ask Claude directly about current feature behavior, as it has access to up-to-date documentation
3.  **Contact support**: For specific billing questions, contact Anthropic support through your Console account

For team deployments, we recommend starting with a small pilot group to establish usage patterns before wider rollout.

Was this page helpful?

YesNo

[Monitoring](monitoring-usage.html)[Analytics](analytics.html)

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