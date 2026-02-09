Get started with Claude Code hooks - Claude Docs 

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

Get started with Claude Code hooks

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

-   [Hook Events Overview](#hook-events-overview)
-   [Quickstart](#quickstart)
-   [Prerequisites](#prerequisites)
-   [Step 1: Open hooks configuration](#step-1%3A-open-hooks-configuration)
-   [Step 2: Add a matcher](#step-2%3A-add-a-matcher)
-   [Step 3: Add the hook](#step-3%3A-add-the-hook)
-   [Step 4: Save your configuration](#step-4%3A-save-your-configuration)
-   [Step 5: Verify your hook](#step-5%3A-verify-your-hook)
-   [Step 6: Test your hook](#step-6%3A-test-your-hook)
-   [More Examples](#more-examples)
-   [Code Formatting Hook](#code-formatting-hook)
-   [Markdown Formatting Hook](#markdown-formatting-hook)
-   [Custom Notification Hook](#custom-notification-hook)
-   [File Protection Hook](#file-protection-hook)
-   [Learn more](#learn-more)

Build with Claude Code

# Get started with Claude Code hooks

Copy page

Learn how to customize and extend Claude Code’s behavior by registering shell commands

Copy page

Claude Code hooks are user-defined shell commands that execute at various points in Claude Code’s lifecycle. Hooks provide deterministic control over Claude Code’s behavior, ensuring certain actions always happen rather than relying on the LLM to choose to run them.

For reference documentation on hooks, see [Hooks reference](hooks.html).

Example use cases for hooks include:

-   **Notifications**: Customize how you get notified when Claude Code is awaiting your input or permission to run something.
-   **Automatic formatting**: Run `prettier` on .ts files, `gofmt` on .go files, etc. after every file edit.
-   **Logging**: Track and count all executed commands for compliance or debugging.
-   **Feedback**: Provide automated feedback when Claude Code produces code that does not follow your codebase conventions.
-   **Custom permissions**: Block modifications to production files or sensitive directories.

By encoding these rules as hooks rather than prompting instructions, you turn suggestions into app-level code that executes every time it is expected to run.

You must consider the security implication of hooks as you add them, because hooks run automatically during the agent loop with your current environment’s credentials. For example, malicious hooks code can exfiltrate your data. Always review your hooks implementation before registering them.For full security best practices, see [Security Considerations](hooks.html#security-considerations) in the hooks reference documentation.

## 

[​

](#hook-events-overview)

Hook Events Overview

Claude Code provides several hook events that run at different points in the workflow:

-   **PreToolUse**: Runs before tool calls (can block them)
-   **PostToolUse**: Runs after tool calls complete
-   **UserPromptSubmit**: Runs when the user submits a prompt, before Claude processes it
-   **Notification**: Runs when Claude Code sends notifications
-   **Stop**: Runs when Claude Code finishes responding
-   **SubagentStop**: Runs when subagent tasks complete
-   **PreCompact**: Runs before Claude Code is about to run a compact operation
-   **SessionStart**: Runs when Claude Code starts a new session or resumes an existing session
-   **SessionEnd**: Runs when Claude Code session ends

Each event receives different data and can control Claude’s behavior in different ways.

## 

[​

](#quickstart)

Quickstart

In this quickstart, you’ll add a hook that logs the shell commands that Claude Code runs.

### 

[​

](#prerequisites)

Prerequisites

Install `jq` for JSON processing in the command line.

### 

[​

](#step-1%3A-open-hooks-configuration)

Step 1: Open hooks configuration

Run the `/hooks` [slash command](slash-commands.html) and select the `PreToolUse` hook event. `PreToolUse` hooks run before tool calls and can block them while providing Claude feedback on what to do differently.

### 

[​

](#step-2%3A-add-a-matcher)

Step 2: Add a matcher

Select `+ Add new matcher…` to run your hook only on Bash tool calls. Type `Bash` for the matcher.

You can use `*` to match all tools.

### 

[​

](#step-3%3A-add-the-hook)

Step 3: Add the hook

Select `+ Add new hook…` and enter this command:

Copy

```shellscript
jq -r '"\(.tool_input.command) - \(.tool_input.description // "No description")"' >> ~/.claude/bash-command-log.txt
```

### 

[​

](#step-4%3A-save-your-configuration)

Step 4: Save your configuration

For storage location, select `User settings` since you’re logging to your home directory. This hook will then apply to all projects, not just your current project. Then press Esc until you return to the REPL. Your hook is now registered!

### 

[​

](#step-5%3A-verify-your-hook)

Step 5: Verify your hook

Run `/hooks` again or check `~/.claude/settings.json` to see your configuration:

Copy

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "jq -r '\"\\(.tool_input.command) - \\(.tool_input.description // \"No description\")\"' >> ~/.claude/bash-command-log.txt"
          }
        ]
      }
    ]
  }
}
```

### 

[​

](#step-6%3A-test-your-hook)

Step 6: Test your hook

Ask Claude to run a simple command like `ls` and check your log file:

Copy

```shellscript
cat ~/.claude/bash-command-log.txt
```

You should see entries like:

Copy

```text
ls - Lists files and directories
```

## 

[​

](#more-examples)

More Examples

For a complete example implementation, see the [bash command validator example](https://github.com/anthropics/claude-code/blob/main/examples/hooks/bash_command_validator_example.py) in our public codebase.

### 

[​

](#code-formatting-hook)

Code Formatting Hook

Automatically format TypeScript files after editing:

Copy

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "jq -r '.tool_input.file_path' | { read file_path; if echo \"$file_path\" | grep -q '\\.ts$'; then npx prettier --write \"$file_path\"; fi; }"
          }
        ]
      }
    ]
  }
}
```

### 

[​

](#markdown-formatting-hook)

Markdown Formatting Hook

Automatically fix missing language tags and formatting issues in markdown files:

Copy

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/markdown_formatter.py"
          }
        ]
      }
    ]
  }
}
```

Create `.claude/hooks/markdown_formatter.py` with this content:

Copy

```python
#!/usr/bin/env python3
"""
Markdown formatter for Claude Code output.
Fixes missing language tags and spacing issues while preserving code content.
"""
import json
import sys
import re
import os

def detect_language(code):
    """Best-effort language detection from code content."""
    s = code.strip()
    
    # JSON detection
    if re.search(r'^\s*[{\[]', s):
        try:
            json.loads(s)
            return 'json'
        except:
            pass
    
    # Python detection
    if re.search(r'^\s*def\s+\w+\s*\(', s, re.M) or \
       re.search(r'^\s*(import|from)\s+\w+', s, re.M):
        return 'python'
    
    # JavaScript detection  
    if re.search(r'\b(function\s+\w+\s*\(|const\s+\w+\s*=)', s) or \
       re.search(r'=>|console\.(log|error)', s):
        return 'javascript'
    
    # Bash detection
    if re.search(r'^#!.*\b(bash|sh)\b', s, re.M) or \
       re.search(r'\b(if|then|fi|for|in|do|done)\b', s):
        return 'bash'
    
    # SQL detection
    if re.search(r'\b(SELECT|INSERT|UPDATE|DELETE|CREATE)\s+', s, re.I):
        return 'sql'
        
    return 'text'

def format_markdown(content):
    """Format markdown content with language detection."""
    # Fix unlabeled code fences
    def add_lang_to_fence(match):
        indent, info, body, closing = match.groups()
        if not info.strip():
            lang = detect_language(body)
            return f"{indent}```{lang}\n{body}{closing}\n"
        return match.group(0)
    
    fence_pattern = r'(?ms)^([ \t]{0,3})```([^\n]*)\n(.*?)(\n\1```)\s*$'
    content = re.sub(fence_pattern, add_lang_to_fence, content)
    
    # Fix excessive blank lines (only outside code fences)
    content = re.sub(r'\n{3,}', '\n\n', content)
    
    return content.rstrip() + '\n'

# Main execution
try:
    input_data = json.load(sys.stdin)
    file_path = input_data.get('tool_input', {}).get('file_path', '')
    
    if not file_path.endswith(('.md', '.mdx')):
        sys.exit(0)  # Not a markdown file
    
    if os.path.exists(file_path):
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        formatted = format_markdown(content)
        
        if formatted != content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(formatted)
            print(f"✓ Fixed markdown formatting in {file_path}")
    
except Exception as e:
    print(f"Error formatting markdown: {e}", file=sys.stderr)
    sys.exit(1)
```

Make the script executable:

Copy

```shellscript
chmod +x .claude/hooks/markdown_formatter.py
```

This hook automatically:

-   Detects programming languages in unlabeled code blocks
-   Adds appropriate language tags for syntax highlighting
-   Fixes excessive blank lines while preserving code content
-   Only processes markdown files (`.md`, `.mdx`)

### 

[​

](#custom-notification-hook)

Custom Notification Hook

Get desktop notifications when Claude needs input:

Copy

```json
{
  "hooks": {
    "Notification": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "notify-send 'Claude Code' 'Awaiting your input'"
          }
        ]
      }
    ]
  }
}
```

### 

[​

](#file-protection-hook)

File Protection Hook

Block edits to sensitive files:

Copy

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "python3 -c \"import json, sys; data=json.load(sys.stdin); path=data.get('tool_input',{}).get('file_path',''); sys.exit(2 if any(p in path for p in ['.env', 'package-lock.json', '.git/']) else 0)\""
          }
        ]
      }
    ]
  }
}
```

## 

[​

](#learn-more)

Learn more

-   For reference documentation on hooks, see [Hooks reference](hooks.html).
-   For comprehensive security best practices and safety guidelines, see [Security Considerations](hooks.html#security-considerations) in the hooks reference documentation.
-   For troubleshooting steps and debugging techniques, see [Debugging](hooks.html#debugging) in the hooks reference documentation.

Was this page helpful?

YesNo

[Output styles](output-styles.html)[Headless mode](headless.html)

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