Common workflows - Claude Docs 

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

Getting started

Common workflows

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

-   [Understand new codebases](#understand-new-codebases)
-   [Get a quick codebase overview](#get-a-quick-codebase-overview)
-   [Find relevant code](#find-relevant-code)
-   [Fix bugs efficiently](#fix-bugs-efficiently)
-   [Refactor code](#refactor-code)
-   [Use specialized subagents](#use-specialized-subagents)
-   [Use Plan Mode for safe code analysis](#use-plan-mode-for-safe-code-analysis)
-   [When to use Plan Mode](#when-to-use-plan-mode)
-   [How to use Plan Mode](#how-to-use-plan-mode)
-   [Example: Planning a complex refactor](#example%3A-planning-a-complex-refactor)
-   [Configure Plan Mode as default](#configure-plan-mode-as-default)
-   [Work with tests](#work-with-tests)
-   [Create pull requests](#create-pull-requests)
-   [Handle documentation](#handle-documentation)
-   [Work with images](#work-with-images)
-   [Reference files and directories](#reference-files-and-directories)
-   [Use extended thinking](#use-extended-thinking)
-   [Resume previous conversations](#resume-previous-conversations)
-   [Run parallel Claude Code sessions with Git worktrees](#run-parallel-claude-code-sessions-with-git-worktrees)
-   [Use Claude as a unix-style utility](#use-claude-as-a-unix-style-utility)
-   [Add Claude to your verification process](#add-claude-to-your-verification-process)
-   [Pipe in, pipe out](#pipe-in%2C-pipe-out)
-   [Control output format](#control-output-format)
-   [Create custom slash commands](#create-custom-slash-commands)
-   [Create project-specific commands](#create-project-specific-commands)
-   [Add command arguments with $ARGUMENTS](#add-command-arguments-with-%24arguments)
-   [Create personal slash commands](#create-personal-slash-commands)
-   [Ask Claude about its capabilities](#ask-claude-about-its-capabilities)
-   [Example questions](#example-questions)
-   [Next steps](#next-steps)

Getting started

# Common workflows

Copy page

Learn about common workflows with Claude Code.

Copy page

Each task in this document includes clear instructions, example commands, and best practices to help you get the most from Claude Code.

## 

[​

](#understand-new-codebases)

Understand new codebases

### 

[​

](#get-a-quick-codebase-overview)

Get a quick codebase overview

Suppose you’ve just joined a new project and need to understand its structure quickly.

1

Navigate to the project root directory

Copy

```shellscript
cd /path/to/project
```

2

Start Claude Code

Copy

```shellscript
claude
```

3

Ask for a high-level overview

Copy

```text
> give me an overview of this codebase
```

4

Dive deeper into specific components

Copy

```text
> explain the main architecture patterns used here
```

Copy

```text
> what are the key data models?
```

Copy

```text
> how is authentication handled?
```

Tips:

-   Start with broad questions, then narrow down to specific areas
-   Ask about coding conventions and patterns used in the project
-   Request a glossary of project-specific terms

### 

[​

](#find-relevant-code)

Find relevant code

Suppose you need to locate code related to a specific feature or functionality.

1

Ask Claude to find relevant files

Copy

```text
> find the files that handle user authentication
```

2

Get context on how components interact

Copy

```text
> how do these authentication files work together?
```

3

Understand the execution flow

Copy

```text
> trace the login process from front-end to database
```

Tips:

-   Be specific about what you’re looking for
-   Use domain language from the project

* * *

## 

[​

](#fix-bugs-efficiently)

Fix bugs efficiently

Suppose you’ve encountered an error message and need to find and fix its source.

1

Share the error with Claude

Copy

```text
> I'm seeing an error when I run npm test
```

2

Ask for fix recommendations

Copy

```text
> suggest a few ways to fix the @ts-ignore in user.ts
```

3

Apply the fix

Copy

```text
> update user.ts to add the null check you suggested
```

Tips:

-   Tell Claude the command to reproduce the issue and get a stack trace
-   Mention any steps to reproduce the error
-   Let Claude know if the error is intermittent or consistent

* * *

## 

[​

](#refactor-code)

Refactor code

Suppose you need to update old code to use modern patterns and practices.

1

Identify legacy code for refactoring

Copy

```text
> find deprecated API usage in our codebase
```

2

Get refactoring recommendations

Copy

```text
> suggest how to refactor utils.js to use modern JavaScript features
```

3

Apply the changes safely

Copy

```text
> refactor utils.js to use ES2024 features while maintaining the same behavior
```

4

Verify the refactoring

Copy

```text
> run tests for the refactored code
```

Tips:

-   Ask Claude to explain the benefits of the modern approach
-   Request that changes maintain backward compatibility when needed
-   Do refactoring in small, testable increments

* * *

## 

[​

](#use-specialized-subagents)

Use specialized subagents

Suppose you want to use specialized AI subagents to handle specific tasks more effectively.

1

View available subagents

Copy

```text
> /agents
```

This shows all available subagents and lets you create new ones.

2

Use subagents automatically

Claude Code will automatically delegate appropriate tasks to specialized subagents:

Copy

```text
> review my recent code changes for security issues
```

Copy

```text
> run all tests and fix any failures
```

3

Explicitly request specific subagents

Copy

```text
> use the code-reviewer subagent to check the auth module
```

Copy

```text
> have the debugger subagent investigate why users can't log in
```

4

Create custom subagents for your workflow

Copy

```text
> /agents
```

Then select “Create New subagent” and follow the prompts to define:

-   Subagent type (e.g., `api-designer`, `performance-optimizer`)
-   When to use it
-   Which tools it can access
-   Its specialized system prompt

Tips:

-   Create project-specific subagents in `.claude/agents/` for team sharing
-   Use descriptive `description` fields to enable automatic delegation
-   Limit tool access to what each subagent actually needs
-   Check the [subagents documentation](sub-agents.html) for detailed examples

* * *

## 

[​

](#use-plan-mode-for-safe-code-analysis)

Use Plan Mode for safe code analysis

Plan Mode instructs Claude to create a plan by analyzing the codebase with read-only operations, perfect for exploring codebases, planning complex changes, or reviewing code safely.

### 

[​

](#when-to-use-plan-mode)

When to use Plan Mode

-   **Multi-step implementation**: When your feature requires making edits to many files
-   **Code exploration**: When you want to research the codebase thoroughly before changing anything
-   **Interactive development**: When you want to iterate on the direction with Claude

### 

[​

](#how-to-use-plan-mode)

How to use Plan Mode

**Turn on Plan Mode during a session** You can switch into Plan Mode during a session using **Shift+Tab** to cycle through permission modes. If you are in Normal Mode, **Shift+Tab** will first switch into Auto-Accept Mode, indicated by `⏵⏵ accept edits on` at the bottom of the terminal. A subsequent **Shift+Tab** will switch into Plan Mode, indicated by `⏸ plan mode on`. **Start a new session in Plan Mode** To start a new session in Plan Mode, use the `--permission-mode plan` flag:

Copy

```shellscript
claude --permission-mode plan
```

**Run “headless” queries in Plan Mode** You can also run a query in Plan Mode directly with `-p` (i.e., in [“headless mode”](headless.html)):

Copy

```shellscript
claude --permission-mode plan -p "Analyze the authentication system and suggest improvements"
```

### 

[​

](#example%3A-planning-a-complex-refactor)

Example: Planning a complex refactor

Copy

```shellscript
claude --permission-mode plan
```

Copy

```text
> I need to refactor our authentication system to use OAuth2. Create a detailed migration plan.
```

Claude will analyze the current implementation and create a comprehensive plan. Refine with follow-ups:

Copy

```text
> What about backward compatibility?
> How should we handle database migration?
```

### 

[​

](#configure-plan-mode-as-default)

Configure Plan Mode as default

Copy

```json
// .claude/settings.json
{
  "permissions": {
    "defaultMode": "plan"
  }
}
```

See [settings documentation](settings.html#available-settings) for more configuration options.

* * *

## 

[​

](#work-with-tests)

Work with tests

Suppose you need to add tests for uncovered code.

1

Identify untested code

Copy

```text
> find functions in NotificationsService.swift that are not covered by tests
```

2

Generate test scaffolding

Copy

```text
> add tests for the notification service
```

3

Add meaningful test cases

Copy

```text
> add test cases for edge conditions in the notification service
```

4

Run and verify tests

Copy

```text
> run the new tests and fix any failures
```

Tips:

-   Ask for tests that cover edge cases and error conditions
-   Request both unit and integration tests when appropriate
-   Have Claude explain the testing strategy

* * *

## 

[​

](#create-pull-requests)

Create pull requests

Suppose you need to create a well-documented pull request for your changes.

1

Summarize your changes

Copy

```text
> summarize the changes I've made to the authentication module
```

2

Generate a PR with Claude

Copy

```text
> create a pr
```

3

Review and refine

Copy

```text
> enhance the PR description with more context about the security improvements
```

4

Add testing details

Copy

```text
> add information about how these changes were tested
```

Tips:

-   Ask Claude directly to make a PR for you
-   Review Claude’s generated PR before submitting
-   Ask Claude to highlight potential risks or considerations

## 

[​

](#handle-documentation)

Handle documentation

Suppose you need to add or update documentation for your code.

1

Identify undocumented code

Copy

```text
> find functions without proper JSDoc comments in the auth module
```

2

Generate documentation

Copy

```text
> add JSDoc comments to the undocumented functions in auth.js
```

3

Review and enhance

Copy

```text
> improve the generated documentation with more context and examples
```

4

Verify documentation

Copy

```text
> check if the documentation follows our project standards
```

Tips:

-   Specify the documentation style you want (JSDoc, docstrings, etc.)
-   Ask for examples in the documentation
-   Request documentation for public APIs, interfaces, and complex logic

* * *

## 

[​

](#work-with-images)

Work with images

Suppose you need to work with images in your codebase, and you want Claude’s help analyzing image content.

1

Add an image to the conversation

You can use any of these methods:

1.  Drag and drop an image into the Claude Code window
2.  Copy an image and paste it into the CLI with ctrl+v (Do not use cmd+v)
3.  Provide an image path to Claude. E.g., “Analyze this image: /path/to/your/image.png”

2

Ask Claude to analyze the image

Copy

```text
> What does this image show?
```

Copy

```text
> Describe the UI elements in this screenshot
```

Copy

```text
> Are there any problematic elements in this diagram?
```

3

Use images for context

Copy

```text
> Here's a screenshot of the error. What's causing it?
```

Copy

```text
> This is our current database schema. How should we modify it for the new feature?
```

4

Get code suggestions from visual content

Copy

```text
> Generate CSS to match this design mockup
```

Copy

```text
> What HTML structure would recreate this component?
```

Tips:

-   Use images when text descriptions would be unclear or cumbersome
-   Include screenshots of errors, UI designs, or diagrams for better context
-   You can work with multiple images in a conversation
-   Image analysis works with diagrams, screenshots, mockups, and more

* * *

## 

[​

](#reference-files-and-directories)

Reference files and directories

Use @ to quickly include files or directories without waiting for Claude to read them.

1

Reference a single file

Copy

```text
> Explain the logic in @src/utils/auth.js
```

This includes the full content of the file in the conversation.

2

Reference a directory

Copy

```text
> What's the structure of @src/components?
```

This provides a directory listing with file information.

3

Reference MCP resources

Copy

```text
> Show me the data from @github:repos/owner/repo/issues
```

This fetches data from connected MCP servers using the format @server:resource. See [MCP resources](mcp.html#use-mcp-resources) for details.

Tips:

-   File paths can be relative or absolute
-   @ file references add CLAUDE.md in the file’s directory and parent directories to context
-   Directory references show file listings, not contents
-   You can reference multiple files in a single message (e.g., “@file1.js and @file2.js”)

* * *

## 

[​

](#use-extended-thinking)

Use extended thinking

Suppose you’re working on complex architectural decisions, challenging bugs, or planning multi-step implementations that require deep reasoning.

[Extended thinking](../build-with-claude/extended-thinking.html) is disabled by default in Claude Code. You can enable it on-demand by using `Tab` to toggle Thinking on, or by using prompts like “think” or “think hard”. You can also enable it permanently by setting the [`MAX_THINKING_TOKENS` environment variable](settings.html#environment-variables) in your settings.

1

Provide context and ask Claude to think

Copy

```text
> I need to implement a new authentication system using OAuth2 for our API. Think deeply about the best approach for implementing this in our codebase.
```

Claude will gather relevant information from your codebase and use extended thinking, which will be visible in the interface.

2

Refine the thinking with follow-up prompts

Copy

```text
> think about potential security vulnerabilities in this approach
```

Copy

```text
> think hard about edge cases we should handle
```

Tips to get the most value out of extended thinking:[Extended thinking](../build-with-claude/extended-thinking.html) is most valuable for complex tasks such as:

-   Planning complex architectural changes
-   Debugging intricate issues
-   Creating implementation plans for new features
-   Understanding complex codebases
-   Evaluating tradeoffs between different approaches

Use `Tab` to toggle Thinking on and off during a session.The way you prompt for thinking results in varying levels of thinking depth:

-   “think” triggers basic extended thinking
-   intensifying phrases such as “keep hard”, “think more”, “think a lot”, or “think longer” triggers deeper thinking

For more extended thinking prompting tips, see [Extended thinking tips](../build-with-claude/prompt-engineering/extended-thinking-tips.html).

Claude will display its thinking process as italic gray text above the response.

* * *

## 

[​

](#resume-previous-conversations)

Resume previous conversations

Suppose you’ve been working on a task with Claude Code and need to continue where you left off in a later session. Claude Code provides two options for resuming previous conversations:

-   `--continue` to automatically continue the most recent conversation
-   `--resume` to display a conversation picker

1

Continue the most recent conversation

Copy

```shellscript
claude --continue
```

This immediately resumes your most recent conversation without any prompts.

2

Continue in non-interactive mode

Copy

```shellscript
claude --continue --print "Continue with my task"
```

Use `--print` with `--continue` to resume the most recent conversation in non-interactive mode, perfect for scripts or automation.

3

Show conversation picker

Copy

```shellscript
claude --resume
```

This displays an interactive conversation selector with a clean list view showing:

-   Session summary (or initial prompt)
-   Metadata: time elapsed, message count, and git branch

Use arrow keys to navigate and press Enter to select a conversation. Press Esc to exit.

Tips:

-   Conversation history is stored locally on your machine
-   Use `--continue` for quick access to your most recent conversation
-   Use `--resume` when you need to select a specific past conversation
-   When resuming, you’ll see the entire conversation history before continuing
-   The resumed conversation starts with the same model and configuration as the original

How it works:

1.  **Conversation Storage**: All conversations are automatically saved locally with their full message history
2.  **Message Deserialization**: When resuming, the entire message history is restored to maintain context
3.  **Tool State**: Tool usage and results from the previous conversation are preserved
4.  **Context Restoration**: The conversation resumes with all previous context intact

Examples:

Copy

```shellscript
# Continue most recent conversation
claude --continue

# Continue most recent conversation with a specific prompt
claude --continue --print "Show me our progress"

# Show conversation picker
claude --resume

# Continue most recent conversation in non-interactive mode
claude --continue --print "Run the tests again"
```

* * *

## 

[​

](#run-parallel-claude-code-sessions-with-git-worktrees)

Run parallel Claude Code sessions with Git worktrees

Suppose you need to work on multiple tasks simultaneously with complete code isolation between Claude Code instances.

1

Understand Git worktrees

Git worktrees allow you to check out multiple branches from the same repository into separate directories. Each worktree has its own working directory with isolated files, while sharing the same Git history. Learn more in the [official Git worktree documentation](https://git-scm.com/docs/git-worktree).

2

Create a new worktree

Copy

```shellscript
# Create a new worktree with a new branch 
git worktree add ../project-feature-a -b feature-a

# Or create a worktree with an existing branch
git worktree add ../project-bugfix bugfix-123
```

This creates a new directory with a separate working copy of your repository.

3

Run Claude Code in each worktree

Copy

```shellscript
# Navigate to your worktree 
cd ../project-feature-a

# Run Claude Code in this isolated environment
claude
```

4

Run Claude in another worktree

Copy

```shellscript
cd ../project-bugfix
claude
```

5

Manage your worktrees

Copy

```shellscript
# List all worktrees
git worktree list

# Remove a worktree when done
git worktree remove ../project-feature-a
```

Tips:

-   Each worktree has its own independent file state, making it perfect for parallel Claude Code sessions
-   Changes made in one worktree won’t affect others, preventing Claude instances from interfering with each other
-   All worktrees share the same Git history and remote connections
-   For long-running tasks, you can have Claude working in one worktree while you continue development in another
-   Use descriptive directory names to easily identify which task each worktree is for
-   Remember to initialize your development environment in each new worktree according to your project’s setup. Depending on your stack, this might include:
    -   JavaScript projects: Running dependency installation (`npm install`, `yarn`)
    -   Python projects: Setting up virtual environments or installing with package managers
    -   Other languages: Following your project’s standard setup process

* * *

## 

[​

](#use-claude-as-a-unix-style-utility)

Use Claude as a unix-style utility

### 

[​

](#add-claude-to-your-verification-process)

Add Claude to your verification process

Suppose you want to use Claude Code as a linter or code reviewer. **Add Claude to your build script:**

Copy

```json
// package.json
{
    ...
    "scripts": {
        ...
        "lint:claude": "claude -p 'you are a linter. please look at the changes vs. main and report any issues related to typos. report the filename and line number on one line, and a description of the issue on the second line. do not return any other text.'"
    }
}
```

Tips:

-   Use Claude for automated code review in your CI/CD pipeline
-   Customize the prompt to check for specific issues relevant to your project
-   Consider creating multiple scripts for different types of verification

### 

[​

](#pipe-in%2C-pipe-out)

Pipe in, pipe out

Suppose you want to pipe data into Claude, and get back data in a structured format. **Pipe data through Claude:**

Copy

```shellscript
cat build-error.txt | claude -p 'concisely explain the root cause of this build error' > output.txt
```

Tips:

-   Use pipes to integrate Claude into existing shell scripts
-   Combine with other Unix tools for powerful workflows
-   Consider using —output-format for structured output

### 

[​

](#control-output-format)

Control output format

Suppose you need Claude’s output in a specific format, especially when integrating Claude Code into scripts or other tools.

1

Use text format (default)

Copy

```shellscript
cat data.txt | claude -p 'summarize this data' --output-format text > summary.txt
```

This outputs just Claude’s plain text response (default behavior).

2

Use JSON format

Copy

```shellscript
cat code.py | claude -p 'analyze this code for bugs' --output-format json > analysis.json
```

This outputs a JSON array of messages with metadata including cost and duration.

3

Use streaming JSON format

Copy

```shellscript
cat log.txt | claude -p 'parse this log file for errors' --output-format stream-json
```

This outputs a series of JSON objects in real-time as Claude processes the request. Each message is a valid JSON object, but the entire output is not valid JSON if concatenated.

Tips:

-   Use `--output-format text` for simple integrations where you just need Claude’s response
-   Use `--output-format json` when you need the full conversation log
-   Use `--output-format stream-json` for real-time output of each conversation turn

* * *

## 

[​

](#create-custom-slash-commands)

Create custom slash commands

Claude Code supports custom slash commands that you can create to quickly execute specific prompts or tasks. For more details, see the [Slash commands](slash-commands.html) reference page.

### 

[​

](#create-project-specific-commands)

Create project-specific commands

Suppose you want to create reusable slash commands for your project that all team members can use.

1

Create a commands directory in your project

Copy

```shellscript
mkdir -p .claude/commands
```

2

Create a Markdown file for each command

Copy

```shellscript
echo "Analyze the performance of this code and suggest three specific optimizations:" > .claude/commands/optimize.md
```

3

Use your custom command in Claude Code

Copy

```text
> /optimize
```

Tips:

-   Command names are derived from the filename (e.g., `optimize.md` becomes `/optimize`)
-   You can organize commands in subdirectories (e.g., `.claude/commands/frontend/component.md` creates `/component` with “(project:frontend)” shown in the description)
-   Project commands are available to everyone who clones the repository
-   The Markdown file content becomes the prompt sent to Claude when the command is invoked

### 

[​

](#add-command-arguments-with-%24arguments)

Add command arguments with $ARGUMENTS

Suppose you want to create flexible slash commands that can accept additional input from users.

1

Create a command file with the $ARGUMENTS placeholder

Copy

```shellscript
echo 'Find and fix issue #$ARGUMENTS. Follow these steps: 1.
Understand the issue described in the ticket 2. Locate the relevant code in
our codebase 3. Implement a solution that addresses the root cause 4. Add
appropriate tests 5. Prepare a concise PR description' >
.claude/commands/fix-issue.md
```

2

Use the command with an issue number

In your Claude session, use the command with arguments.

Copy

```text
> /fix-issue 123
```

This will replace $ARGUMENTS with “123” in the prompt.

Tips:

-   The $ARGUMENTS placeholder is replaced with any text that follows the command
-   You can position $ARGUMENTS anywhere in your command template
-   Other useful applications: generating test cases for specific functions, creating documentation for components, reviewing code in particular files, or translating content to specified languages

### 

[​

](#create-personal-slash-commands)

Create personal slash commands

Suppose you want to create personal slash commands that work across all your projects.

1

Create a commands directory in your home folder

Copy

```shellscript
mkdir -p ~/.claude/commands
```

2

Create a Markdown file for each command

Copy

```shellscript
echo "Review this code for security vulnerabilities, focusing on:" >
~/.claude/commands/security-review.md
```

3

Use your personal custom command

Copy

```text
> /security-review
```

Tips:

-   Personal commands show “(user)” in their description when listed with `/help`
-   Personal commands are only available to you and not shared with your team
-   Personal commands work across all your projects
-   You can use these for consistent workflows across different codebases

* * *

## 

[​

](#ask-claude-about-its-capabilities)

Ask Claude about its capabilities

Claude has built-in access to its documentation and can answer questions about its own features and limitations.

### 

[​

](#example-questions)

Example questions

Copy

```text
> can Claude Code create pull requests?
```

Copy

```text
> how does Claude Code handle permissions?
```

Copy

```text
> what slash commands are available?
```

Copy

```text
> how do I use MCP with Claude Code?
```

Copy

```text
> how do I configure Claude Code for Amazon Bedrock?
```

Copy

```text
> what are the limitations of Claude Code?
```

Claude provides documentation-based answers to these questions. For executable examples and hands-on demonstrations, refer to the specific workflow sections above.

Tips:

-   Claude always has access to the latest Claude Code documentation, regardless of the version you’re using
-   Ask specific questions to get detailed answers
-   Claude can explain complex features like MCP integration, enterprise configurations, and advanced workflows

* * *

## 

[​

](#next-steps)

Next steps

[

## Claude Code reference implementation

Clone our development container reference implementation.





](https://github.com/anthropics/claude-code/tree/main/.devcontainer)

Was this page helpful?

YesNo

[Quickstart](quickstart.html)[Claude Code on the web](claude-code-on-the-web.html)

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