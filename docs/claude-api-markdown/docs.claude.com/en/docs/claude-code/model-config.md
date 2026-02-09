Model configuration - Claude Docs 

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

Model configuration

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

-   [Available models](#available-models)
-   [Model aliases](#model-aliases)
-   [Setting your model](#setting-your-model)
-   [Special model behavior](#special-model-behavior)
-   [default model setting](#default-model-setting)
-   [opusplan model setting](#opusplan-model-setting)
-   [Extended context with \[1m\]](#extended-context-with-%5B1m%5D)
-   [Checking your current model](#checking-your-current-model)
-   [Environment variables](#environment-variables)
-   [Prompt caching configuration](#prompt-caching-configuration)

Configuration

# Model configuration

Copy page

Learn about the Claude Code model configuration, including model aliases like `opusplan`

Copy page

## 

[​

](#available-models)

Available models

For the `model` setting in Claude Code, you can either configure:

-   A **model alias**
-   A full **[model name](../about-claude/models/overview.html#model-names)**
-   For Bedrock, an ARN

### 

[​

](#model-aliases)

Model aliases

Model aliases provide a convenient way to select model settings without remembering exact version numbers:

| Model alias | Behavior |
| --- | --- |
| **`default`** | Recommended model setting, depending on your account type |
| **`sonnet`** | Uses the latest Sonnet model (currently Sonnet 4.5) for daily coding tasks |
| **`opus`** | Uses Opus model (currently Opus 4.1) for specialized complex reasoning tasks |
| **`haiku`** | Uses the fast and efficient Haiku model for simple tasks |
| **`sonnet[1m]`** | Uses Sonnet with a [1 million token context window](../build-with-claude/context-windows.html#1m-token-context-window) window for long sessions |
| **`opusplan`** | Special mode that uses `opus` during plan mode, then switches to `sonnet` for execution |

### 

[​

](#setting-your-model)

Setting your model

You can configure your model in several ways, listed in order of priority:

1.  **During session** - Use `/model <alias|name>` to switch models mid-session
2.  **At startup** - Launch with `claude --model <alias|name>`
3.  **Environment variable** - Set `ANTHROPIC_MODEL=<alias|name>`
4.  **Settings** - Configure permanently in your settings file using the `model` field.

Example usage:

Copy

```shellscript
# Start with Opus
claude --model opus

# Switch to Sonnet during session
/model sonnet
```

Example settings file:

Copy

```text
{
    "permissions": {
        ...
    },
    "model": "opus"
}
```

## 

[​

](#special-model-behavior)

Special model behavior

### 

[​

](#default-model-setting)

`default` model setting

The behavior of `default` depends on your account type. For certain Max users, Claude Code will automatically fall back to Sonnet if you hit a usage threshold with Opus.

### 

[​

](#opusplan-model-setting)

`opusplan` model setting

The `opusplan` model alias provides an automated hybrid approach:

-   **In plan mode** - Uses `opus` for complex reasoning and architecture decisions
-   **In execution mode** - Automatically switches to `sonnet` for code generation and implementation

This gives you the best of both worlds: Opus’s superior reasoning for planning, and Sonnet’s efficiency for execution.

### 

[​

](#extended-context-with-%5B1m%5D)

Extended context with \[1m\]

For Console/API users, the `[1m]` suffix can be added to full model names to enable a [1 million token context window](../build-with-claude/context-windows.html#1m-token-context-window).

Copy

```shellscript
# Example of using a full model name with the [1m] suffix
/model anthropic.claude-sonnet-4-5-20250929-v1:0[1m]
```

Note: Extended context models have [different pricing](../about-claude/pricing.html#long-context-pricing).

## 

[​

](#checking-your-current-model)

Checking your current model

You can see which model you’re currently using in several ways:

1.  In [status line](statusline.html) (if configured)
2.  In `/status`, which also displays your account information.

## 

[​

](#environment-variables)

Environment variables

You can use the following environment variables, which must be full **model names**, to control the model names that the aliases map to.

| Env var | Description |
| --- | --- |
| `ANTHROPIC_DEFAULT_OPUS_MODEL` | The model to use for `opus`, or for `opusplan` when Plan Mode is active. |
| `ANTHROPIC_DEFAULT_SONNET_MODEL` | The model to use for `sonnet`, or for `opusplan` when Plan Mode is not active. |
| `ANTHROPIC_DEFAULT_HAIKU_MODEL` | The model to use for `haiku`, or [background functionality](costs.html#background-token-usage) |
| `CLAUDE_CODE_SUBAGENT_MODEL` | The model to use for [subagents](sub-agents.html) |

Note: `ANTHROPIC_SMALL_FAST_MODEL` is deprecated in favor of `ANTHROPIC_DEFAULT_HAIKU_MODEL`.

### 

[​

](#prompt-caching-configuration)

Prompt caching configuration

Claude Code automatically uses [prompt caching](../build-with-claude/prompt-caching.html) to optimize performance and reduce costs. You can disable prompt caching globally or for specific model tiers:

| Env var | Description |
| --- | --- |
| `DISABLE_PROMPT_CACHING` | Set to `1` to disable prompt caching for all models (takes precedence over per-model settings) |
| `DISABLE_PROMPT_CACHING_HAIKU` | Set to `1` to disable prompt caching for Haiku models only |
| `DISABLE_PROMPT_CACHING_SONNET` | Set to `1` to disable prompt caching for Sonnet models only |
| `DISABLE_PROMPT_CACHING_OPUS` | Set to `1` to disable prompt caching for Opus models only |

These environment variables give you fine-grained control over prompt caching behavior. The global `DISABLE_PROMPT_CACHING` setting takes precedence over the model-specific settings, allowing you to quickly disable all caching when needed. The per-model settings are useful for selective control, such as when debugging specific models or working with cloud providers that may have different caching implementations.

Was this page helpful?

YesNo

[Terminal configuration](terminal-config.html)[Memory management](memory.html)

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