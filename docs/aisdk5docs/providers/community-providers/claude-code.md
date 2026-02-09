AI SDK 5 is available now.










Menu






















































































































































































































































































































































































































































































# [Claude Code Provider](#claude-code-provider)


## [Version Compatibility](#version-compatibility)

The Claude Code provider supports both AI SDK v4 and v5-beta:


| Provider Version | AI SDK Version | Status | Branch |
|----|----|----|----|


## [Setup](#setup)

The Claude Code provider is available in the `ai-sdk-provider-claude-code` module. Install the version that matches your AI SDK version:

### [For AI SDK v5-beta (latest)](#for-ai-sdk-v5-beta-latest)






pnpm







npm







yarn







bun








``` geist-overflow-scroll-y
pnpm add ai-sdk-provider-claude-code ai
```












### [For AI SDK v4 (stable)](#for-ai-sdk-v4-stable)






pnpm







npm







yarn







bun








``` geist-overflow-scroll-y
pnpm add ai-sdk-provider-claude-code@^0 ai@^4
```












## [Provider Instance](#provider-instance)

You can import the default provider instance `claudeCode` from `ai-sdk-provider-claude-code`:



``` ts
import  from 'ai-sdk-provider-claude-code';
```


If you need a customized setup, you can import `createClaudeCode` from `ai-sdk-provider-claude-code` and create a provider instance with your settings:



``` ts
import  from 'ai-sdk-provider-claude-code';
const claudeCode = createClaudeCode();
```


You can use the following optional settings to customize the Claude Code provider instance:

- **anthropicDir** *string*

  Optional. Directory for Claude Code CLI data. Defaults to `~/.claude/claude_code`.

- **allowedTools** *string\[\]*

  Optional. List of allowed tools. When specified, only these tools will be available.

- **disallowedTools** *string\[\]*

  Optional. List of disallowed tools. These tools will be blocked even if enabled in settings.

- **mcpServers** *string\[\]*

  Optional. List of MCP server names to use for this session.

## [Language Models](#language-models)

You can create models that call Claude through the Claude Code CLI using the provider instance. The first argument is the model ID:



``` ts
const model = claudeCode('opus');
```


Claude Code supports the following models:

- **opus**: Claude 4 Opus (most capable)
- **sonnet**: Claude 4 Sonnet (balanced performance)

### [Example: Generate Text](#example-generate-text)

You can use Claude Code language models to generate text with the `generateText` function:



``` ts
import  from 'ai-sdk-provider-claude-code';import  from 'ai';
// AI SDK v4const  = await generateText();
// AI SDK v5-betaconst result = await generateText();const text = await result.text;
```


Claude Code language models can also be used in the `streamText`, `generateObject`, and `streamObject` functions (see [AI SDK Core](../../docs/ai-sdk-core.html) for more information).




The response format differs between AI SDK v4 and v5-beta. In v4, text is accessed directly via `result.text`. In v5-beta, it's accessed as a promise via `await result.text`. Make sure to use the appropriate format for your AI SDK version.



### [Model Capabilities](#model-capabilities)


| Model | Image Input | Object Generation | Tool Usage | Tool Streaming |
|----|----|----|----|----|





The ❌ for "Tool Usage" and "Tool Streaming" refers specifically to the AI SDK's standardized tool interface, which allows defining custom functions with schemas that models can call. The Claude Code provider uses a different architecture where Claude's built-in tools (Bash, Edit, Read, Write, etc.) and MCP servers are managed directly by the Claude Code CLI. While you cannot define custom tools using the AI SDK's conventions, Claude can still effectively use its comprehensive set of built-in tools to perform tasks like file manipulation, web fetching, and command execution.



## [Authentication](#authentication)

The Claude Code provider uses your existing Claude Pro or Max subscription through the Claude Code CLI. You need to authenticate once using:



``` bash
claude login
```


This will open a browser window for authentication. Once authenticated, the provider will use your subscription automatically.

## [Built-in Tools](#built-in-tools)

One of the unique features of the Claude Code provider is access to Claude's built-in tools:

- **Bash**: Execute shell commands
- **Edit**: Edit files with precise replacements
- **Read**: Read file contents
- **Write**: Write new files
- **LS**: List directory contents
- **Grep**: Search file contents
- **WebFetch**: Fetch and analyze web content
- And more...

You can control which tools are available per session using the `allowedTools` and `disallowedTools` options.

## [Extended Thinking](#extended-thinking)

The Claude Code provider supports Claude Opus 4's extended thinking capabilities with proper timeout management. When using extended thinking, make sure to provide an appropriate AbortSignal with a timeout of up to 10 minutes:



``` ts
const controller = new AbortController();const timeout = setTimeout(() => controller.abort(), 10 * 60 * 1000); // 10 minutes
try  = await generateText();} finally 
```


## [Requirements](#requirements)

- Node.js 18 or higher
- Claude Code CLI installed (`npm install -g @anthropic-ai/claude-code`)
- Claude Code authenticated with Pro or Max subscription, or API key.
















On this page





















































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.