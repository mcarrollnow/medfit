Claude Code on Amazon Bedrock - Claude Docs 

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

Claude Code on Amazon Bedrock

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

-   [Prerequisites](#prerequisites)
-   [Setup](#setup)
-   [1\. Enable model access](#1-enable-model-access)
-   [2\. Configure AWS credentials](#2-configure-aws-credentials)
-   [Advanced credential configuration](#advanced-credential-configuration)
-   [3\. Configure Claude Code](#3-configure-claude-code)
-   [4\. Model configuration](#4-model-configuration)
-   [5\. Output token configuration](#5-output-token-configuration)
-   [IAM configuration](#iam-configuration)
-   [Troubleshooting](#troubleshooting)
-   [Additional resources](#additional-resources)

Deployment

# Claude Code on Amazon Bedrock

Copy page

Learn about configuring Claude Code through Amazon Bedrock, including setup, IAM configuration, and troubleshooting.

Copy page

## 

[​

](#prerequisites)

Prerequisites

Before configuring Claude Code with Bedrock, ensure you have:

-   An AWS account with Bedrock access enabled
-   Access to desired Claude models (e.g., Claude Sonnet 4.5) in Bedrock
-   AWS CLI installed and configured (optional - only needed if you don’t have another mechanism for getting credentials)
-   Appropriate IAM permissions

## 

[​

](#setup)

Setup

### 

[​

](#1-enable-model-access)

1\. Enable model access

First, ensure you have access to the required Claude models in your AWS account:

1.  Navigate to the [Amazon Bedrock console](https://console.aws.amazon.com/bedrock/)
2.  Go to **Model access** in the left navigation
3.  Request access to desired Claude models (e.g., Claude Sonnet 4.5)
4.  Wait for approval (usually instant for most regions)

### 

[​

](#2-configure-aws-credentials)

2\. Configure AWS credentials

Claude Code uses the default AWS SDK credential chain. Set up your credentials using one of these methods: **Option A: AWS CLI configuration**

Copy

```shellscript
aws configure
```

**Option B: Environment variables (access key)**

Copy

```shellscript
export AWS_ACCESS_KEY_ID=your-access-key-id
export AWS_SECRET_ACCESS_KEY=your-secret-access-key
export AWS_SESSION_TOKEN=your-session-token
```

**Option C: Environment variables (SSO profile)**

Copy

```shellscript
aws sso login --profile=<your-profile-name>

export AWS_PROFILE=your-profile-name
```

**Option D: Bedrock API keys**

Copy

```shellscript
export AWS_BEARER_TOKEN_BEDROCK=your-bedrock-api-key
```

Bedrock API keys provide a simpler authentication method without needing full AWS credentials. [Learn more about Bedrock API keys](https://aws.amazon.com/blogs/machine-learning/accelerate-ai-development-with-amazon-bedrock-api-keys/).

#### 

[​

](#advanced-credential-configuration)

Advanced credential configuration

Claude Code supports automatic credential refresh for AWS SSO and corporate identity providers. Add these settings to your Claude Code settings file (see [Settings](settings.html) for file locations). When Claude Code detects that your AWS credentials are expired (either locally based on their timestamp or when Bedrock returns a credential error), it will automatically run your configured `awsAuthRefresh` and/or `awsCredentialExport` commands to obtain new credentials before retrying the request.

##### Example configuration

Copy

```json
{
  "awsAuthRefresh": "aws sso login --profile myprofile",
  "env": {
    "AWS_PROFILE": "myprofile"
  }
}
```

##### Configuration settings explained

**`awsAuthRefresh`**: Use this for commands that modify the `.aws` directory (e.g., updating credentials, SSO cache, or config files). Output is shown to the user (but user input is not supported), making it suitable for browser-based authentication flows where the CLI displays a code to enter in the browser. **`awsCredentialExport`**: Only use this if you cannot modify `.aws` and must directly return credentials. Output is captured silently (not shown to the user). The command must output JSON in this format:

Copy

```json
{
  "Credentials": {
    "AccessKeyId": "value",
    "SecretAccessKey": "value",
    "SessionToken": "value"
  }
}
```

### 

[​

](#3-configure-claude-code)

3\. Configure Claude Code

Set the following environment variables to enable Bedrock:

Copy

```shellscript
# Enable Bedrock integration
export CLAUDE_CODE_USE_BEDROCK=1
export AWS_REGION=us-east-1  # or your preferred region

# Optional: Override the region for the small/fast model (Haiku)
export ANTHROPIC_SMALL_FAST_MODEL_AWS_REGION=us-west-2
```

When enabling Bedrock for Claude Code, keep the following in mind:

-   `AWS_REGION` is a required environment variable. Claude Code does not read from the `.aws` config file for this setting.
-   When using Bedrock, the `/login` and `/logout` commands are disabled since authentication is handled through AWS credentials.
-   You can use settings files for environment variables like `AWS_PROFILE` that you don’t want to leak to other processes. See [Settings](settings.html) for more information.

### 

[​

](#4-model-configuration)

4\. Model configuration

Claude Code uses these default models for Bedrock:

| Model type | Default value |
| --- | --- |
| Primary model | `global.anthropic.claude-sonnet-4-5-20250929-v1:0` |
| Small/fast model | `us.anthropic.claude-haiku-4-5-20251001-v1:0` |

For Bedrock users, Claude Code will not automatically upgrade from Haiku 3.5 to Haiku 4.5. To manually switch to a newer Haiku model, set the `ANTHROPIC_DEFAULT_HAIKU_MODEL` environment variable to the full model name (e.g., `us.anthropic.claude-haiku-4-5-20251001-v1:0`).

To customize models, use one of these methods:

Copy

```shellscript
# Using inference profile ID
export ANTHROPIC_MODEL='global.anthropic.claude-sonnet-4-5-20250929-v1:0'
export ANTHROPIC_SMALL_FAST_MODEL='us.anthropic.claude-haiku-4-5-20251001-v1:0'

# Using application inference profile ARN
export ANTHROPIC_MODEL='arn:aws:bedrock:us-east-2:your-account-id:application-inference-profile/your-model-id'

# Optional: Disable prompt caching if needed
export DISABLE_PROMPT_CACHING=1
```

[Prompt caching](../build-with-claude/prompt-caching.html) may not be available in all regions

### 

[​

](#5-output-token-configuration)

5\. Output token configuration

When using Claude Code with Amazon Bedrock, we recommend the following token settings:

Copy

```shellscript
# Recommended output token settings for Bedrock
export CLAUDE_CODE_MAX_OUTPUT_TOKENS=4096
export MAX_THINKING_TOKENS=1024
```

**Why these values:**

-   **`CLAUDE_CODE_MAX_OUTPUT_TOKENS=4096`**: Bedrock’s burndown throttling logic sets a minimum of 4096 tokens as the max\_token penalty. Setting this lower won’t reduce costs but may cut off long tool uses, causing the Claude Code agent loop to fail persistently. Claude Code typically uses less than 4096 output tokens without extended thinking, but may need this headroom for tasks involving significant file creation or Write tool usage.
-   **`MAX_THINKING_TOKENS=1024`**: This provides space for extended thinking without cutting off tool use responses, while still maintaining focused reasoning chains. This balance helps prevent trajectory changes that aren’t always helpful for coding tasks specifically.

## 

[​

](#iam-configuration)

IAM configuration

Create an IAM policy with the required permissions for Claude Code:

Copy

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "bedrock:InvokeModel",
        "bedrock:InvokeModelWithResponseStream",
        "bedrock:ListInferenceProfiles"
      ],
      "Resource": [
        "arn:aws:bedrock:*:*:inference-profile/*",
        "arn:aws:bedrock:*:*:application-inference-profile/*"
      ]
    }
  ]
}
```

For more restrictive permissions, you can limit the Resource to specific inference profile ARNs. For details, see [Bedrock IAM documentation](https://docs.aws.amazon.com/bedrock/latest/userguide/security-iam.html).

We recommend creating a dedicated AWS account for Claude Code to simplify cost tracking and access control.

## 

[​

](#troubleshooting)

Troubleshooting

If you encounter region issues:

-   Check model availability: `aws bedrock list-inference-profiles --region your-region`
-   Switch to a supported region: `export AWS_REGION=us-east-1`
-   Consider using inference profiles for cross-region access

If you receive an error “on-demand throughput isn’t supported”:

-   Specify the model as an [inference profile](https://docs.aws.amazon.com/bedrock/latest/userguide/inference-profiles-support.html) ID

Claude Code uses the Bedrock [Invoke API](https://docs.aws.amazon.com/bedrock/latest/APIReference/API_runtime_InvokeModelWithResponseStream.html) and does not support the Converse API.

## 

[​

](#additional-resources)

Additional resources

-   [Bedrock documentation](https://docs.aws.amazon.com/bedrock/)
-   [Bedrock pricing](https://aws.amazon.com/bedrock/pricing/)
-   [Bedrock inference profiles](https://docs.aws.amazon.com/bedrock/latest/userguide/inference-profiles-support.html)
-   [Claude Code on Amazon Bedrock: Quick Setup Guide](https://community.aws/content/2tXkZKrZzlrlu0KfH8gST5Dkppq/claude-code-on-amazon-bedrock-quick-setup-guide)\- [Claude Code Monitoring Implementation (Bedrock)](https://github.com/aws-solutions-library-samples/guidance-for-claude-code-with-amazon-bedrock/blob/main/assets/docs/MONITORING.md)

Was this page helpful?

YesNo

[Overview](third-party-integrations.html)[Google Vertex AI](google-vertex-ai.html)

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