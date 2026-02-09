Agent SDK reference - Python - Claude Docs 

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

Agent SDK

Agent SDK reference - Python

[Welcome

](../../home.html)[Claude Developer Platform

](../../docs/intro.html)[Claude Code

](../../docs/claude-code/overview.html)[Model Context Protocol (MCP)

](../../docs/mcp.html)[API Reference

](../messages.html)[Resources

](../../resources/overview.html)[Release Notes

](../../release-notes/overview.html)

-   [
    
    Developer Guide](../../docs/intro.html)
-   [
    
    API Guide](../overview.html)

##### Using the APIs

-   [
    
    Overview
    
    
    
    ](../overview.html)
-   [
    
    Rate limits
    
    
    
    ](../rate-limits.html)
-   [
    
    Service tiers
    
    
    
    ](../service-tiers.html)
-   [
    
    Errors
    
    
    
    ](../errors.html)
-   [
    
    Handling stop reasons
    
    
    
    ](../handling-stop-reasons.html)
-   [
    
    Beta headers
    
    
    
    ](../beta-headers.html)

##### API reference

-   Messages
    
-   Models
    
-   Message Batches
    
-   Files
    
-   Skills
    
-   Admin API
    
-   Experimental APIs
    
-   Text Completions (Legacy)
    

##### SDKs

-   [
    
    Client SDKs
    
    
    
    ](../client-sdks.html)
-   [
    
    OpenAI SDK compatibility
    
    
    
    ](../openai-sdk.html)
-   Agent SDK
    
    -   [
        
        Migrate to Claude Agent SDK
        
        
        
        ](../../docs/claude-code/sdk/migration-guide.html)
    -   [
        
        Overview
        
        
        
        ](overview.html)
    -   [
        
        TypeScript SDK
        
        
        
        ](typescript.html)
    -   [
        
        Python SDK
        
        
        
        ](python.html)
    -   Guides
        

##### Examples

-   [
    
    Messages examples
    
    
    
    ](../messages-examples.html)
-   [
    
    Message Batches examples
    
    
    
    ](../messages-batch-examples.html)

##### 3rd-party APIs

-   [
    
    Amazon Bedrock API
    
    
    
    ](../claude-on-amazon-bedrock.html)
-   [
    
    Vertex AI API
    
    
    
    ](../claude-on-vertex-ai.html)

##### Using the Admin API

-   [
    
    Admin API overview
    
    
    
    ](../administration-api.html)
-   [
    
    Usage and Cost API
    
    
    
    ](../usage-cost-api.html)
-   [
    
    Claude Code Analytics API
    
    
    
    ](../claude-code-analytics-api.html)

##### Support & configuration

-   [
    
    Versions
    
    
    
    ](../versioning.html)
-   [
    
    IP addresses
    
    
    
    ](../ip-addresses.html)
-   [
    
    Supported regions
    
    
    
    ](../supported-regions.html)
-   [
    
    Getting help
    
    
    
    ](../getting-help.html)

 

On this page

-   [Installation](#installation)
-   [Choosing Between query() and ClaudeSDKClient](#choosing-between-query-and-claudesdkclient)
-   [Quick Comparison](#quick-comparison)
-   [When to Use query() (New Session Each Time)](#when-to-use-query-new-session-each-time)
-   [When to Use ClaudeSDKClient (Continuous Conversation)](#when-to-use-claudesdkclient-continuous-conversation)
-   [Functions](#functions)
-   [query()](#query)
-   [Parameters](#parameters)
-   [Returns](#returns)
-   [Example - With options](#example-with-options)
-   [tool()](#tool)
-   [Parameters](#parameters-2)
-   [Input Schema Options](#input-schema-options)
-   [Returns](#returns-2)
-   [Example](#example)
-   [create\_sdk\_mcp\_server()](#create-sdk-mcp-server)
-   [Parameters](#parameters-3)
-   [Returns](#returns-3)
-   [Example](#example-2)
-   [Classes](#classes)
-   [ClaudeSDKClient](#claudesdkclient)
-   [Key Features](#key-features)
-   [Methods](#methods)
-   [Context Manager Support](#context-manager-support)
-   [Example - Continuing a conversation](#example-continuing-a-conversation)
-   [Example - Streaming input with ClaudeSDKClient](#example-streaming-input-with-claudesdkclient)
-   [Example - Using interrupts](#example-using-interrupts)
-   [Example - Advanced permission control](#example-advanced-permission-control)
-   [Types](#types)
-   [SdkMcpTool](#sdkmcptool)
-   [ClaudeAgentOptions](#claudeagentoptions)
-   [SystemPromptPreset](#systempromptpreset)
-   [SettingSource](#settingsource)
-   [Default behavior](#default-behavior)
-   [Why use setting\_sources?](#why-use-setting-sources%3F)
-   [Settings precedence](#settings-precedence)
-   [AgentDefinition](#agentdefinition)
-   [PermissionMode](#permissionmode)
-   [McpSdkServerConfig](#mcpsdkserverconfig)
-   [McpServerConfig](#mcpserverconfig)
-   [McpStdioServerConfig](#mcpstdioserverconfig)
-   [McpSSEServerConfig](#mcpsseserverconfig)
-   [McpHttpServerConfig](#mcphttpserverconfig)
-   [Message Types](#message-types)
-   [Message](#message)
-   [UserMessage](#usermessage)
-   [AssistantMessage](#assistantmessage)
-   [SystemMessage](#systemmessage)
-   [ResultMessage](#resultmessage)
-   [Content Block Types](#content-block-types)
-   [ContentBlock](#contentblock)
-   [TextBlock](#textblock)
-   [ThinkingBlock](#thinkingblock)
-   [ToolUseBlock](#tooluseblock)
-   [ToolResultBlock](#toolresultblock)
-   [Error Types](#error-types)
-   [ClaudeSDKError](#claudesdkerror)
-   [CLINotFoundError](#clinotfounderror)
-   [CLIConnectionError](#cliconnectionerror)
-   [ProcessError](#processerror)
-   [CLIJSONDecodeError](#clijsondecodeerror)
-   [Hook Types](#hook-types)
-   [HookEvent](#hookevent)
-   [HookCallback](#hookcallback)
-   [HookContext](#hookcontext)
-   [HookMatcher](#hookmatcher)
-   [Hook Usage Example](#hook-usage-example)
-   [Tool Input/Output Types](#tool-input%2Foutput-types)
-   [Task](#task)
-   [Bash](#bash)
-   [Edit](#edit)
-   [Read](#read)
-   [Write](#write)
-   [Glob](#glob)
-   [Grep](#grep)
-   [NotebookEdit](#notebookedit)
-   [WebFetch](#webfetch)
-   [WebSearch](#websearch)
-   [TodoWrite](#todowrite)
-   [BashOutput](#bashoutput)
-   [KillBash](#killbash)
-   [ExitPlanMode](#exitplanmode)
-   [ListMcpResources](#listmcpresources)
-   [ReadMcpResource](#readmcpresource)
-   [Advanced Features with ClaudeSDKClient](#advanced-features-with-claudesdkclient)
-   [Building a Continuous Conversation Interface](#building-a-continuous-conversation-interface)
-   [Using Hooks for Behavior Modification](#using-hooks-for-behavior-modification)
-   [Real-time Progress Monitoring](#real-time-progress-monitoring)
-   [Example Usage](#example-usage)
-   [Basic file operations (using query)](#basic-file-operations-using-query)
-   [Error handling](#error-handling)
-   [Streaming mode with client](#streaming-mode-with-client)
-   [Using custom tools with ClaudeSDKClient](#using-custom-tools-with-claudesdkclient)
-   [See also](#see-also)

Agent SDK

# Agent SDK reference - Python

Copy page

Complete API reference for the Python Agent SDK, including all functions, types, and classes.

Copy page

## 

[​

](#installation)

Installation

Copy

```shellscript
pip install claude-agent-sdk
```

## 

[​

](#choosing-between-query-and-claudesdkclient)

Choosing Between `query()` and `ClaudeSDKClient`

The Python SDK provides two ways to interact with Claude Code:

### 

[​

](#quick-comparison)

Quick Comparison

| Feature | `query()` | `ClaudeSDKClient` |
| --- | --- | --- |
| **Session** | Creates new session each time | Reuses same session |
| **Conversation** | Single exchange | Multiple exchanges in same context |
| **Connection** | Managed automatically | Manual control |
| **Streaming Input** | ✅ Supported | ✅ Supported |
| **Interrupts** | ❌ Not supported | ✅ Supported |
| **Hooks** | ❌ Not supported | ✅ Supported |
| **Custom Tools** | ❌ Not supported | ✅ Supported |
| **Continue Chat** | ❌ New session each time | ✅ Maintains conversation |
| **Use Case** | One-off tasks | Continuous conversations |

### 

[​

](#when-to-use-query-new-session-each-time)

When to Use `query()` (New Session Each Time)

**Best for:**

-   One-off questions where you don’t need conversation history
-   Independent tasks that don’t require context from previous exchanges
-   Simple automation scripts
-   When you want a fresh start each time

### 

[​

](#when-to-use-claudesdkclient-continuous-conversation)

When to Use `ClaudeSDKClient` (Continuous Conversation)

**Best for:**

-   **Continuing conversations** - When you need Claude to remember context
-   **Follow-up questions** - Building on previous responses
-   **Interactive applications** - Chat interfaces, REPLs
-   **Response-driven logic** - When next action depends on Claude’s response
-   **Session control** - Managing conversation lifecycle explicitly

## 

[​

](#functions)

Functions

### 

[​

](#query)

`query()`

Creates a new session for each interaction with Claude Code. Returns an async iterator that yields messages as they arrive. Each call to `query()` starts fresh with no memory of previous interactions.

Copy

```python
async def query(
    *,
    prompt: str | AsyncIterable[dict[str, Any]],
    options: ClaudeAgentOptions | None = None
) -> AsyncIterator[Message]
```

#### 

[​

](#parameters)

Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `prompt` | `str | AsyncIterable[dict]` | The input prompt as a string or async iterable for streaming mode |
| `options` | `ClaudeAgentOptions | None` | Optional configuration object (defaults to `ClaudeAgentOptions()` if None) |

#### 

[​

](#returns)

Returns

Returns an `AsyncIterator[Message]` that yields messages from the conversation.

#### 

[​

](#example-with-options)

Example - With options

Copy

```python
import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions

async def main():
    options = ClaudeAgentOptions(
        system_prompt="You are an expert Python developer",
        permission_mode='acceptEdits',
        cwd="/home/user/project"
    )

    async for message in query(
        prompt="Create a Python web server",
        options=options
    ):
        print(message)


asyncio.run(main())
```

### 

[​

](#tool)

`tool()`

Decorator for defining MCP tools with type safety.

Copy

```python
def tool(
    name: str,
    description: str,
    input_schema: type | dict[str, Any]
) -> Callable[[Callable[[Any], Awaitable[dict[str, Any]]]], SdkMcpTool[Any]]
```

#### 

[​

](#parameters-2)

Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `name` | `str` | Unique identifier for the tool |
| `description` | `str` | Human-readable description of what the tool does |
| `input_schema` | `type | dict[str, Any]` | Schema defining the tool’s input parameters (see below) |

#### 

[​

](#input-schema-options)

Input Schema Options

1.  **Simple type mapping** (recommended):
    
    Copy
    
    ```python
    {"text": str, "count": int, "enabled": bool}
    ```
    
2.  **JSON Schema format** (for complex validation):
    
    Copy
    
    ```python
    {
        "type": "object",
        "properties": {
            "text": {"type": "string"},
            "count": {"type": "integer", "minimum": 0}
        },
        "required": ["text"]
    }
    ```
    

#### 

[​

](#returns-2)

Returns

A decorator function that wraps the tool implementation and returns an `SdkMcpTool` instance.

#### 

[​

](#example)

Example

Copy

```python
from claude_agent_sdk import tool
from typing import Any

@tool("greet", "Greet a user", {"name": str})
async def greet(args: dict[str, Any]) -> dict[str, Any]:
    return {
        "content": [{
            "type": "text",
            "text": f"Hello, {args['name']}!"
        }]
    }
```

### 

[​

](#create-sdk-mcp-server)

`create_sdk_mcp_server()`

Create an in-process MCP server that runs within your Python application.

Copy

```python
def create_sdk_mcp_server(
    name: str,
    version: str = "1.0.0",
    tools: list[SdkMcpTool[Any]] | None = None
) -> McpSdkServerConfig
```

#### 

[​

](#parameters-3)

Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | `str` | \- | Unique identifier for the server |
| `version` | `str` | `"1.0.0"` | Server version string |
| `tools` | `list[SdkMcpTool[Any]] | None` | `None` | List of tool functions created with `@tool` decorator |

#### 

[​

](#returns-3)

Returns

Returns an `McpSdkServerConfig` object that can be passed to `ClaudeAgentOptions.mcp_servers`.

#### 

[​

](#example-2)

Example

Copy

```python
from claude_agent_sdk import tool, create_sdk_mcp_server

@tool("add", "Add two numbers", {"a": float, "b": float})
async def add(args):
    return {
        "content": [{
            "type": "text",
            "text": f"Sum: {args['a'] + args['b']}"
        }]
    }

@tool("multiply", "Multiply two numbers", {"a": float, "b": float})
async def multiply(args):
    return {
        "content": [{
            "type": "text",
            "text": f"Product: {args['a'] * args['b']}"
        }]
    }

calculator = create_sdk_mcp_server(
    name="calculator",
    version="2.0.0",
    tools=[add, multiply]  # Pass decorated functions
)

# Use with Claude
options = ClaudeAgentOptions(
    mcp_servers={"calc": calculator},
    allowed_tools=["mcp__calc__add", "mcp__calc__multiply"]
)
```

## 

[​

](#classes)

Classes

### 

[​

](#claudesdkclient)

`ClaudeSDKClient`

**Maintains a conversation session across multiple exchanges.** This is the Python equivalent of how the TypeScript SDK’s `query()` function works internally - it creates a client object that can continue conversations.

#### 

[​

](#key-features)

Key Features

-   **Session Continuity**: Maintains conversation context across multiple `query()` calls
-   **Same Conversation**: Claude remembers previous messages in the session
-   **Interrupt Support**: Can stop Claude mid-execution
-   **Explicit Lifecycle**: You control when the session starts and ends
-   **Response-driven Flow**: Can react to responses and send follow-ups
-   **Custom Tools & Hooks**: Supports custom tools (created with `@tool` decorator) and hooks

Copy

```python
class ClaudeSDKClient:
    def __init__(self, options: ClaudeAgentOptions | None = None)
    async def connect(self, prompt: str | AsyncIterable[dict] | None = None) -> None
    async def query(self, prompt: str | AsyncIterable[dict], session_id: str = "default") -> None
    async def receive_messages(self) -> AsyncIterator[Message]
    async def receive_response(self) -> AsyncIterator[Message]
    async def interrupt(self) -> None
    async def disconnect(self) -> None
```

#### 

[​

](#methods)

Methods

| Method | Description |
| --- | --- |
| `__init__(options)` | Initialize the client with optional configuration |
| `connect(prompt)` | Connect to Claude with an optional initial prompt or message stream |
| `query(prompt, session_id)` | Send a new request in streaming mode |
| `receive_messages()` | Receive all messages from Claude as an async iterator |
| `receive_response()` | Receive messages until and including a ResultMessage |
| `interrupt()` | Send interrupt signal (only works in streaming mode) |
| `disconnect()` | Disconnect from Claude |

#### 

[​

](#context-manager-support)

Context Manager Support

The client can be used as an async context manager for automatic connection management:

Copy

```python
async with ClaudeSDKClient() as client:
    await client.query("Hello Claude")
    async for message in client.receive_response():
        print(message)
```

> **Important:** When iterating over messages, avoid using `break` to exit early as this can cause asyncio cleanup issues. Instead, let the iteration complete naturally or use flags to track when you’ve found what you need.

#### 

[​

](#example-continuing-a-conversation)

Example - Continuing a conversation

Copy

```python
import asyncio
from claude_agent_sdk import ClaudeSDKClient, AssistantMessage, TextBlock, ResultMessage

async def main():
    async with ClaudeSDKClient() as client:
        # First question
        await client.query("What's the capital of France?")

        # Process response
        async for message in client.receive_response():
            if isinstance(message, AssistantMessage):
                for block in message.content:
                    if isinstance(block, TextBlock):
                        print(f"Claude: {block.text}")

        # Follow-up question - Claude remembers the previous context
        await client.query("What's the population of that city?")

        async for message in client.receive_response():
            if isinstance(message, AssistantMessage):
                for block in message.content:
                    if isinstance(block, TextBlock):
                        print(f"Claude: {block.text}")

        # Another follow-up - still in the same conversation
        await client.query("What are some famous landmarks there?")

        async for message in client.receive_response():
            if isinstance(message, AssistantMessage):
                for block in message.content:
                    if isinstance(block, TextBlock):
                        print(f"Claude: {block.text}")

asyncio.run(main())
```

#### 

[​

](#example-streaming-input-with-claudesdkclient)

Example - Streaming input with ClaudeSDKClient

Copy

```python
import asyncio
from claude_agent_sdk import ClaudeSDKClient

async def message_stream():
    """Generate messages dynamically."""
    yield {"type": "text", "text": "Analyze the following data:"}
    await asyncio.sleep(0.5)
    yield {"type": "text", "text": "Temperature: 25°C"}
    await asyncio.sleep(0.5)
    yield {"type": "text", "text": "Humidity: 60%"}
    await asyncio.sleep(0.5)
    yield {"type": "text", "text": "What patterns do you see?"}

async def main():
    async with ClaudeSDKClient() as client:
        # Stream input to Claude
        await client.query(message_stream())

        # Process response
        async for message in client.receive_response():
            print(message)

        # Follow-up in same session
        await client.query("Should we be concerned about these readings?")

        async for message in client.receive_response():
            print(message)

asyncio.run(main())
```

#### 

[​

](#example-using-interrupts)

Example - Using interrupts

Copy

```python
import asyncio
from claude_agent_sdk import ClaudeSDKClient, ClaudeAgentOptions

async def interruptible_task():
    options = ClaudeAgentOptions(
        allowed_tools=["Bash"],
        permission_mode="acceptEdits"
    )

    async with ClaudeSDKClient(options=options) as client:
        # Start a long-running task
        await client.query("Count from 1 to 100 slowly")

        # Let it run for a bit
        await asyncio.sleep(2)

        # Interrupt the task
        await client.interrupt()
        print("Task interrupted!")

        # Send a new command
        await client.query("Just say hello instead")

        async for message in client.receive_response():
            # Process the new response
            pass

asyncio.run(interruptible_task())
```

#### 

[​

](#example-advanced-permission-control)

Example - Advanced permission control

Copy

```python
from claude_agent_sdk import (
    ClaudeSDKClient,
    ClaudeAgentOptions
)

async def custom_permission_handler(
    tool_name: str,
    input_data: dict,
    context: dict
):
    """Custom logic for tool permissions."""

    # Block writes to system directories
    if tool_name == "Write" and input_data.get("file_path", "").startswith("/system/"):
        return {
            "behavior": "deny",
            "message": "System directory write not allowed",
            "interrupt": True
        }

    # Redirect sensitive file operations
    if tool_name in ["Write", "Edit"] and "config" in input_data.get("file_path", ""):
        safe_path = f"./sandbox/{input_data['file_path']}"
        return {
            "behavior": "allow",
            "updatedInput": {**input_data, "file_path": safe_path}
        }

    # Allow everything else
    return {
        "behavior": "allow",
        "updatedInput": input_data
    }

async def main():
    options = ClaudeAgentOptions(
        can_use_tool=custom_permission_handler,
        allowed_tools=["Read", "Write", "Edit"]
    )

    async with ClaudeSDKClient(options=options) as client:
        await client.query("Update the system config file")

        async for message in client.receive_response():
            # Will use sandbox path instead
            print(message)

asyncio.run(main())
```

## 

[​

](#types)

Types

### 

[​

](#sdkmcptool)

`SdkMcpTool`

Definition for an SDK MCP tool created with the `@tool` decorator.

Copy

```python
@dataclass
class SdkMcpTool(Generic[T]):
    name: str
    description: str
    input_schema: type[T] | dict[str, Any]
    handler: Callable[[T], Awaitable[dict[str, Any]]]
```

| Property | Type | Description |
| --- | --- | --- |
| `name` | `str` | Unique identifier for the tool |
| `description` | `str` | Human-readable description |
| `input_schema` | `type[T] | dict[str, Any]` | Schema for input validation |
| `handler` | `Callable[[T], Awaitable[dict[str, Any]]]` | Async function that handles tool execution |

### 

[​

](#claudeagentoptions)

`ClaudeAgentOptions`

Configuration dataclass for Claude Code queries.

Copy

```python
@dataclass
class ClaudeAgentOptions:
    allowed_tools: list[str] = field(default_factory=list)
    system_prompt: str | SystemPromptPreset | None = None
    mcp_servers: dict[str, McpServerConfig] | str | Path = field(default_factory=dict)
    permission_mode: PermissionMode | None = None
    continue_conversation: bool = False
    resume: str | None = None
    max_turns: int | None = None
    disallowed_tools: list[str] = field(default_factory=list)
    model: str | None = None
    permission_prompt_tool_name: str | None = None
    cwd: str | Path | None = None
    settings: str | None = None
    add_dirs: list[str | Path] = field(default_factory=list)
    env: dict[str, str] = field(default_factory=dict)
    extra_args: dict[str, str | None] = field(default_factory=dict)
    max_buffer_size: int | None = None
    debug_stderr: Any = sys.stderr  # Deprecated
    stderr: Callable[[str], None] | None = None
    can_use_tool: CanUseTool | None = None
    hooks: dict[HookEvent, list[HookMatcher]] | None = None
    user: str | None = None
    include_partial_messages: bool = False
    fork_session: bool = False
    agents: dict[str, AgentDefinition] | None = None
    setting_sources: list[SettingSource] | None = None
```

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `allowed_tools` | `list[str]` | `[]` | List of allowed tool names |
| `system_prompt` | `str | SystemPromptPreset | None` | `None` | System prompt configuration. Pass a string for custom prompt, or use `{"type": "preset", "preset": "claude_code"}` for Claude Code’s system prompt. Add `"append"` to extend the preset |
| `mcp_servers` | `dict[str, McpServerConfig] | str | Path` | `{}` | MCP server configurations or path to config file |
| `permission_mode` | `PermissionMode | None` | `None` | Permission mode for tool usage |
| `continue_conversation` | `bool` | `False` | Continue the most recent conversation |
| `resume` | `str | None` | `None` | Session ID to resume |
| `max_turns` | `int | None` | `None` | Maximum conversation turns |
| `disallowed_tools` | `list[str]` | `[]` | List of disallowed tool names |
| `model` | `str | None` | `None` | Claude model to use |
| `permission_prompt_tool_name` | `str | None` | `None` | MCP tool name for permission prompts |
| `cwd` | `str | Path | None` | `None` | Current working directory |
| `settings` | `str | None` | `None` | Path to settings file |
| `add_dirs` | `list[str | Path]` | `[]` | Additional directories Claude can access |
| `env` | `dict[str, str]` | `{}` | Environment variables |
| `extra_args` | `dict[str, str | None]` | `{}` | Additional CLI arguments to pass directly to the CLI |
| `max_buffer_size` | `int | None` | `None` | Maximum bytes when buffering CLI stdout |
| `debug_stderr` | `Any` | `sys.stderr` | *Deprecated* - File-like object for debug output. Use `stderr` callback instead |
| `stderr` | `Callable[[str], None] | None` | `None` | Callback function for stderr output from CLI |
| `can_use_tool` | `CanUseTool | None` | `None` | Tool permission callback function |
| `hooks` | `dict[HookEvent, list[HookMatcher]] | None` | `None` | Hook configurations for intercepting events |
| `user` | `str | None` | `None` | User identifier |
| `include_partial_messages` | `bool` | `False` | Include partial message streaming events |
| `fork_session` | `bool` | `False` | When resuming with `resume`, fork to a new session ID instead of continuing the original session |
| `agents` | `dict[str, AgentDefinition] | None` | `None` | Programmatically defined subagents |
| `setting_sources` | `list[SettingSource] | None` | `None` (no settings) | Control which filesystem settings to load. When omitted, no settings are loaded. **Note:** Must include `"project"` to load CLAUDE.md files |

### 

[​

](#systempromptpreset)

`SystemPromptPreset`

Configuration for using Claude Code’s preset system prompt with optional additions.

Copy

```python
class SystemPromptPreset(TypedDict):
    type: Literal["preset"]
    preset: Literal["claude_code"]
    append: NotRequired[str]
```

| Field | Required | Description |
| --- | --- | --- |
| `type` | Yes | Must be `"preset"` to use a preset system prompt |
| `preset` | Yes | Must be `"claude_code"` to use Claude Code’s system prompt |
| `append` | No | Additional instructions to append to the preset system prompt |

### 

[​

](#settingsource)

`SettingSource`

Controls which filesystem-based configuration sources the SDK loads settings from.

Copy

```python
SettingSource = Literal["user", "project", "local"]
```

| Value | Description | Location |
| --- | --- | --- |
| `"user"` | Global user settings | `~/.claude/settings.json` |
| `"project"` | Shared project settings (version controlled) | `.claude/settings.json` |
| `"local"` | Local project settings (gitignored) | `.claude/settings.local.json` |

#### 

[​

](#default-behavior)

Default behavior

When `setting_sources` is **omitted** or **`None`**, the SDK does **not** load any filesystem settings. This provides isolation for SDK applications.

#### 

[​

](#why-use-setting-sources%3F)

Why use setting\_sources?

**Load all filesystem settings (legacy behavior):**

Copy

```python
# Load all settings like SDK v0.0.x did
from claude_agent_sdk import query, ClaudeAgentOptions

async for message in query(
    prompt="Analyze this code",
    options=ClaudeAgentOptions(
        setting_sources=["user", "project", "local"]  # Load all settings
    )
):
    print(message)
```

**Load only specific setting sources:**

Copy

```python
# Load only project settings, ignore user and local
async for message in query(
    prompt="Run CI checks",
    options=ClaudeAgentOptions(
        setting_sources=["project"]  # Only .claude/settings.json
    )
):
    print(message)
```

**Testing and CI environments:**

Copy

```python
# Ensure consistent behavior in CI by excluding local settings
async for message in query(
    prompt="Run tests",
    options=ClaudeAgentOptions(
        setting_sources=["project"],  # Only team-shared settings
        permission_mode="bypassPermissions"
    )
):
    print(message)
```

**SDK-only applications:**

Copy

```python
# Define everything programmatically (default behavior)
# No filesystem dependencies - setting_sources defaults to None
async for message in query(
    prompt="Review this PR",
    options=ClaudeAgentOptions(
        # setting_sources=None is the default, no need to specify
        agents={ /* ... */ },
        mcp_servers={ /* ... */ },
        allowed_tools=["Read", "Grep", "Glob"]
    )
):
    print(message)
```

**Loading CLAUDE.md project instructions:**

Copy

```python
# Load project settings to include CLAUDE.md files
async for message in query(
    prompt="Add a new feature following project conventions",
    options=ClaudeAgentOptions(
        system_prompt={
            "type": "preset",
            "preset": "claude_code"  # Use Claude Code's system prompt
        },
        setting_sources=["project"],  # Required to load CLAUDE.md from project
        allowed_tools=["Read", "Write", "Edit"]
    )
):
    print(message)
```

#### 

[​

](#settings-precedence)

Settings precedence

When multiple sources are loaded, settings are merged with this precedence (highest to lowest):

1.  Local settings (`.claude/settings.local.json`)
2.  Project settings (`.claude/settings.json`)
3.  User settings (`~/.claude/settings.json`)

Programmatic options (like `agents`, `allowed_tools`) always override filesystem settings.

### 

[​

](#agentdefinition)

`AgentDefinition`

Configuration for a subagent defined programmatically.

Copy

```python
@dataclass
class AgentDefinition:
    description: str
    prompt: str
    tools: list[str] | None = None
    model: Literal["sonnet", "opus", "haiku", "inherit"] | None = None
```

| Field | Required | Description |
| --- | --- | --- |
| `description` | Yes | Natural language description of when to use this agent |
| `tools` | No | Array of allowed tool names. If omitted, inherits all tools |
| `prompt` | Yes | The agent’s system prompt |
| `model` | No | Model override for this agent. If omitted, uses the main model |

### 

[​

](#permissionmode)

`PermissionMode`

Permission modes for controlling tool execution.

Copy

```python
PermissionMode = Literal[
    "default",           # Standard permission behavior
    "acceptEdits",       # Auto-accept file edits
    "plan",              # Planning mode - no execution
    "bypassPermissions"  # Bypass all permission checks (use with caution)
]
```

### 

[​

](#mcpsdkserverconfig)

`McpSdkServerConfig`

Configuration for SDK MCP servers created with `create_sdk_mcp_server()`.

Copy

```python
class McpSdkServerConfig(TypedDict):
    type: Literal["sdk"]
    name: str
    instance: Any  # MCP Server instance
```

### 

[​

](#mcpserverconfig)

`McpServerConfig`

Union type for MCP server configurations.

Copy

```python
McpServerConfig = McpStdioServerConfig | McpSSEServerConfig | McpHttpServerConfig | McpSdkServerConfig
```

#### 

[​

](#mcpstdioserverconfig)

`McpStdioServerConfig`

Copy

```python
class McpStdioServerConfig(TypedDict):
    type: NotRequired[Literal["stdio"]]  # Optional for backwards compatibility
    command: str
    args: NotRequired[list[str]]
    env: NotRequired[dict[str, str]]
```

#### 

[​

](#mcpsseserverconfig)

`McpSSEServerConfig`

Copy

```python
class McpSSEServerConfig(TypedDict):
    type: Literal["sse"]
    url: str
    headers: NotRequired[dict[str, str]]
```

#### 

[​

](#mcphttpserverconfig)

`McpHttpServerConfig`

Copy

```python
class McpHttpServerConfig(TypedDict):
    type: Literal["http"]
    url: str
    headers: NotRequired[dict[str, str]]
```

## 

[​

](#message-types)

Message Types

### 

[​

](#message)

`Message`

Union type of all possible messages.

Copy

```python
Message = UserMessage | AssistantMessage | SystemMessage | ResultMessage
```

### 

[​

](#usermessage)

`UserMessage`

User input message.

Copy

```python
@dataclass
class UserMessage:
    content: str | list[ContentBlock]
```

### 

[​

](#assistantmessage)

`AssistantMessage`

Assistant response message with content blocks.

Copy

```python
@dataclass
class AssistantMessage:
    content: list[ContentBlock]
    model: str
```

### 

[​

](#systemmessage)

`SystemMessage`

System message with metadata.

Copy

```python
@dataclass
class SystemMessage:
    subtype: str
    data: dict[str, Any]
```

### 

[​

](#resultmessage)

`ResultMessage`

Final result message with cost and usage information.

Copy

```python
@dataclass
class ResultMessage:
    subtype: str
    duration_ms: int
    duration_api_ms: int
    is_error: bool
    num_turns: int
    session_id: str
    total_cost_usd: float | None = None
    usage: dict[str, Any] | None = None
    result: str | None = None
```

## 

[​

](#content-block-types)

Content Block Types

### 

[​

](#contentblock)

`ContentBlock`

Union type of all content blocks.

Copy

```python
ContentBlock = TextBlock | ThinkingBlock | ToolUseBlock | ToolResultBlock
```

### 

[​

](#textblock)

`TextBlock`

Text content block.

Copy

```python
@dataclass
class TextBlock:
    text: str
```

### 

[​

](#thinkingblock)

`ThinkingBlock`

Thinking content block (for models with thinking capability).

Copy

```python
@dataclass
class ThinkingBlock:
    thinking: str
    signature: str
```

### 

[​

](#tooluseblock)

`ToolUseBlock`

Tool use request block.

Copy

```python
@dataclass
class ToolUseBlock:
    id: str
    name: str
    input: dict[str, Any]
```

### 

[​

](#toolresultblock)

`ToolResultBlock`

Tool execution result block.

Copy

```python
@dataclass
class ToolResultBlock:
    tool_use_id: str
    content: str | list[dict[str, Any]] | None = None
    is_error: bool | None = None
```

## 

[​

](#error-types)

Error Types

### 

[​

](#claudesdkerror)

`ClaudeSDKError`

Base exception class for all SDK errors.

Copy

```python
class ClaudeSDKError(Exception):
    """Base error for Claude SDK."""
```

### 

[​

](#clinotfounderror)

`CLINotFoundError`

Raised when Claude Code CLI is not installed or not found.

Copy

```python
class CLINotFoundError(CLIConnectionError):
    def __init__(self, message: str = "Claude Code not found", cli_path: str | None = None):
        """
        Args:
            message: Error message (default: "Claude Code not found")
            cli_path: Optional path to the CLI that was not found
        """
```

### 

[​

](#cliconnectionerror)

`CLIConnectionError`

Raised when connection to Claude Code fails.

Copy

```python
class CLIConnectionError(ClaudeSDKError):
    """Failed to connect to Claude Code."""
```

### 

[​

](#processerror)

`ProcessError`

Raised when the Claude Code process fails.

Copy

```python
class ProcessError(ClaudeSDKError):
    def __init__(self, message: str, exit_code: int | None = None, stderr: str | None = None):
        self.exit_code = exit_code
        self.stderr = stderr
```

### 

[​

](#clijsondecodeerror)

`CLIJSONDecodeError`

Raised when JSON parsing fails.

Copy

```python
class CLIJSONDecodeError(ClaudeSDKError):
    def __init__(self, line: str, original_error: Exception):
        """
        Args:
            line: The line that failed to parse
            original_error: The original JSON decode exception
        """
        self.line = line
        self.original_error = original_error
```

## 

[​

](#hook-types)

Hook Types

### 

[​

](#hookevent)

`HookEvent`

Supported hook event types. Note that due to setup limitations, the Python SDK does not support SessionStart, SessionEnd, and Notification hooks.

Copy

```python
HookEvent = Literal[
    "PreToolUse",      # Called before tool execution
    "PostToolUse",     # Called after tool execution
    "UserPromptSubmit", # Called when user submits a prompt
    "Stop",            # Called when stopping execution
    "SubagentStop",    # Called when a subagent stops
    "PreCompact"       # Called before message compaction
]
```

### 

[​

](#hookcallback)

`HookCallback`

Type definition for hook callback functions.

Copy

```python
HookCallback = Callable[
    [dict[str, Any], str | None, HookContext],
    Awaitable[dict[str, Any]]
]
```

Parameters:

-   `input_data`: Hook-specific input data (see [hook documentation](../../docs/claude-code/hooks.html#hook-input))
-   `tool_use_id`: Optional tool use identifier (for tool-related hooks)
-   `context`: Hook context with additional information

Returns a dictionary that may contain:

-   `decision`: `"block"` to block the action
-   `systemMessage`: System message to add to the transcript
-   `hookSpecificOutput`: Hook-specific output data

### 

[​

](#hookcontext)

`HookContext`

Context information passed to hook callbacks.

Copy

```python
@dataclass
class HookContext:
    signal: Any | None = None  # Future: abort signal support
```

### 

[​

](#hookmatcher)

`HookMatcher`

Configuration for matching hooks to specific events or tools.

Copy

```python
@dataclass
class HookMatcher:
    matcher: str | None = None        # Tool name or pattern to match (e.g., "Bash", "Write|Edit")
    hooks: list[HookCallback] = field(default_factory=list)  # List of callbacks to execute
```

### 

[​

](#hook-usage-example)

Hook Usage Example

Copy

```python
from claude_agent_sdk import query, ClaudeAgentOptions, HookMatcher, HookContext
from typing import Any

async def validate_bash_command(
    input_data: dict[str, Any],
    tool_use_id: str | None,
    context: HookContext
) -> dict[str, Any]:
    """Validate and potentially block dangerous bash commands."""
    if input_data['tool_name'] == 'Bash':
        command = input_data['tool_input'].get('command', '')
        if 'rm -rf /' in command:
            return {
                'hookSpecificOutput': {
                    'hookEventName': 'PreToolUse',
                    'permissionDecision': 'deny',
                    'permissionDecisionReason': 'Dangerous command blocked'
                }
            }
    return {}

async def log_tool_use(
    input_data: dict[str, Any],
    tool_use_id: str | None,
    context: HookContext
) -> dict[str, Any]:
    """Log all tool usage for auditing."""
    print(f"Tool used: {input_data.get('tool_name')}")
    return {}

options = ClaudeAgentOptions(
    hooks={
        'PreToolUse': [
            HookMatcher(matcher='Bash', hooks=[validate_bash_command]),
            HookMatcher(hooks=[log_tool_use])  # Applies to all tools
        ],
        'PostToolUse': [
            HookMatcher(hooks=[log_tool_use])
        ]
    }
)

async for message in query(
    prompt="Analyze this codebase",
    options=options
):
    print(message)
```

## 

[​

](#tool-input%2Foutput-types)

Tool Input/Output Types

Documentation of input/output schemas for all built-in Claude Code tools. While the Python SDK doesn’t export these as types, they represent the structure of tool inputs and outputs in messages.

### 

[​

](#task)

Task

**Tool name:** `Task` **Input:**

Copy

```python
{
    "description": str,      # A short (3-5 word) description of the task
    "prompt": str,           # The task for the agent to perform
    "subagent_type": str     # The type of specialized agent to use
}
```

**Output:**

Copy

```python
{
    "result": str,                    # Final result from the subagent
    "usage": dict | None,             # Token usage statistics
    "total_cost_usd": float | None,  # Total cost in USD
    "duration_ms": int | None         # Execution duration in milliseconds
}
```

### 

[​

](#bash)

Bash

**Tool name:** `Bash` **Input:**

Copy

```python
{
    "command": str,                  # The command to execute
    "timeout": int | None,           # Optional timeout in milliseconds (max 600000)
    "description": str | None,       # Clear, concise description (5-10 words)
    "run_in_background": bool | None # Set to true to run in background
}
```

**Output:**

Copy

```python
{
    "output": str,              # Combined stdout and stderr output
    "exitCode": int,            # Exit code of the command
    "killed": bool | None,      # Whether command was killed due to timeout
    "shellId": str | None       # Shell ID for background processes
}
```

### 

[​

](#edit)

Edit

**Tool name:** `Edit` **Input:**

Copy

```python
{
    "file_path": str,           # The absolute path to the file to modify
    "old_string": str,          # The text to replace
    "new_string": str,          # The text to replace it with
    "replace_all": bool | None  # Replace all occurrences (default False)
}
```

**Output:**

Copy

```python
{
    "message": str,      # Confirmation message
    "replacements": int, # Number of replacements made
    "file_path": str     # File path that was edited
}
```

### 

[​

](#read)

Read

**Tool name:** `Read` **Input:**

Copy

```python
{
    "file_path": str,       # The absolute path to the file to read
    "offset": int | None,   # The line number to start reading from
    "limit": int | None     # The number of lines to read
}
```

**Output (Text files):**

Copy

```python
{
    "content": str,         # File contents with line numbers
    "total_lines": int,     # Total number of lines in file
    "lines_returned": int   # Lines actually returned
}
```

**Output (Images):**

Copy

```python
{
    "image": str,       # Base64 encoded image data
    "mime_type": str,   # Image MIME type
    "file_size": int    # File size in bytes
}
```

### 

[​

](#write)

Write

**Tool name:** `Write` **Input:**

Copy

```python
{
    "file_path": str,  # The absolute path to the file to write
    "content": str     # The content to write to the file
}
```

**Output:**

Copy

```python
{
    "message": str,        # Success message
    "bytes_written": int,  # Number of bytes written
    "file_path": str       # File path that was written
}
```

### 

[​

](#glob)

Glob

**Tool name:** `Glob` **Input:**

Copy

```python
{
    "pattern": str,       # The glob pattern to match files against
    "path": str | None    # The directory to search in (defaults to cwd)
}
```

**Output:**

Copy

```python
{
    "matches": list[str],  # Array of matching file paths
    "count": int,          # Number of matches found
    "search_path": str     # Search directory used
}
```

### 

[​

](#grep)

Grep

**Tool name:** `Grep` **Input:**

Copy

```python
{
    "pattern": str,                    # The regular expression pattern
    "path": str | None,                # File or directory to search in
    "glob": str | None,                # Glob pattern to filter files
    "type": str | None,                # File type to search
    "output_mode": str | None,         # "content", "files_with_matches", or "count"
    "-i": bool | None,                 # Case insensitive search
    "-n": bool | None,                 # Show line numbers
    "-B": int | None,                  # Lines to show before each match
    "-A": int | None,                  # Lines to show after each match
    "-C": int | None,                  # Lines to show before and after
    "head_limit": int | None,          # Limit output to first N lines/entries
    "multiline": bool | None           # Enable multiline mode
}
```

**Output (content mode):**

Copy

```python
{
    "matches": [
        {
            "file": str,
            "line_number": int | None,
            "line": str,
            "before_context": list[str] | None,
            "after_context": list[str] | None
        }
    ],
    "total_matches": int
}
```

**Output (files\_with\_matches mode):**

Copy

```python
{
    "files": list[str],  # Files containing matches
    "count": int         # Number of files with matches
}
```

### 

[​

](#notebookedit)

NotebookEdit

**Tool name:** `NotebookEdit` **Input:**

Copy

```python
{
    "notebook_path": str,                     # Absolute path to the Jupyter notebook
    "cell_id": str | None,                    # The ID of the cell to edit
    "new_source": str,                        # The new source for the cell
    "cell_type": "code" | "markdown" | None,  # The type of the cell
    "edit_mode": "replace" | "insert" | "delete" | None  # Edit operation type
}
```

**Output:**

Copy

```python
{
    "message": str,                              # Success message
    "edit_type": "replaced" | "inserted" | "deleted",  # Type of edit performed
    "cell_id": str | None,                       # Cell ID that was affected
    "total_cells": int                           # Total cells in notebook after edit
}
```

### 

[​

](#webfetch)

WebFetch

**Tool name:** `WebFetch` **Input:**

Copy

```python
{
    "url": str,     # The URL to fetch content from
    "prompt": str   # The prompt to run on the fetched content
}
```

**Output:**

Copy

```python
{
    "response": str,           # AI model's response to the prompt
    "url": str,                # URL that was fetched
    "final_url": str | None,   # Final URL after redirects
    "status_code": int | None  # HTTP status code
}
```

### 

[​

](#websearch)

WebSearch

**Tool name:** `WebSearch` **Input:**

Copy

```python
{
    "query": str,                        # The search query to use
    "allowed_domains": list[str] | None, # Only include results from these domains
    "blocked_domains": list[str] | None  # Never include results from these domains
}
```

**Output:**

Copy

```python
{
    "results": [
        {
            "title": str,
            "url": str,
            "snippet": str,
            "metadata": dict | None
        }
    ],
    "total_results": int,
    "query": str
}
```

### 

[​

](#todowrite)

TodoWrite

**Tool name:** `TodoWrite` **Input:**

Copy

```python
{
    "todos": [
        {
            "content": str,                              # The task description
            "status": "pending" | "in_progress" | "completed",  # Task status
            "activeForm": str                            # Active form of the description
        }
    ]
}
```

**Output:**

Copy

```python
{
    "message": str,  # Success message
    "stats": {
        "total": int,
        "pending": int,
        "in_progress": int,
        "completed": int
    }
}
```

### 

[​

](#bashoutput)

BashOutput

**Tool name:** `BashOutput` **Input:**

Copy

```python
{
    "bash_id": str,       # The ID of the background shell
    "filter": str | None  # Optional regex to filter output lines
}
```

**Output:**

Copy

```python
{
    "output": str,                                      # New output since last check
    "status": "running" | "completed" | "failed",       # Current shell status
    "exitCode": int | None                              # Exit code when completed
}
```

### 

[​

](#killbash)

KillBash

**Tool name:** `KillBash` **Input:**

Copy

```python
{
    "shell_id": str  # The ID of the background shell to kill
}
```

**Output:**

Copy

```python
{
    "message": str,  # Success message
    "shell_id": str  # ID of the killed shell
}
```

### 

[​

](#exitplanmode)

ExitPlanMode

**Tool name:** `ExitPlanMode` **Input:**

Copy

```python
{
    "plan": str  # The plan to run by the user for approval
}
```

**Output:**

Copy

```python
{
    "message": str,          # Confirmation message
    "approved": bool | None  # Whether user approved the plan
}
```

### 

[​

](#listmcpresources)

ListMcpResources

**Tool name:** `ListMcpResources` **Input:**

Copy

```python
{
    "server": str | None  # Optional server name to filter resources by
}
```

**Output:**

Copy

```python
{
    "resources": [
        {
            "uri": str,
            "name": str,
            "description": str | None,
            "mimeType": str | None,
            "server": str
        }
    ],
    "total": int
}
```

### 

[​

](#readmcpresource)

ReadMcpResource

**Tool name:** `ReadMcpResource` **Input:**

Copy

```python
{
    "server": str,  # The MCP server name
    "uri": str      # The resource URI to read
}
```

**Output:**

Copy

```python
{
    "contents": [
        {
            "uri": str,
            "mimeType": str | None,
            "text": str | None,
            "blob": str | None
        }
    ],
    "server": str
}
```

## 

[​

](#advanced-features-with-claudesdkclient)

Advanced Features with ClaudeSDKClient

### 

[​

](#building-a-continuous-conversation-interface)

Building a Continuous Conversation Interface

Copy

```python
from claude_agent_sdk import ClaudeSDKClient, ClaudeAgentOptions, AssistantMessage, TextBlock
import asyncio

class ConversationSession:
    """Maintains a single conversation session with Claude."""

    def __init__(self, options: ClaudeAgentOptions = None):
        self.client = ClaudeSDKClient(options)
        self.turn_count = 0

    async def start(self):
        await self.client.connect()
        print("Starting conversation session. Claude will remember context.")
        print("Commands: 'exit' to quit, 'interrupt' to stop current task, 'new' for new session")

        while True:
            user_input = input(f"\n[Turn {self.turn_count + 1}] You: ")

            if user_input.lower() == 'exit':
                break
            elif user_input.lower() == 'interrupt':
                await self.client.interrupt()
                print("Task interrupted!")
                continue
            elif user_input.lower() == 'new':
                # Disconnect and reconnect for a fresh session
                await self.client.disconnect()
                await self.client.connect()
                self.turn_count = 0
                print("Started new conversation session (previous context cleared)")
                continue

            # Send message - Claude remembers all previous messages in this session
            await self.client.query(user_input)
            self.turn_count += 1

            # Process response
            print(f"[Turn {self.turn_count}] Claude: ", end="")
            async for message in self.client.receive_response():
                if isinstance(message, AssistantMessage):
                    for block in message.content:
                        if isinstance(block, TextBlock):
                            print(block.text, end="")
            print()  # New line after response

        await self.client.disconnect()
        print(f"Conversation ended after {self.turn_count} turns.")

async def main():
    options = ClaudeAgentOptions(
        allowed_tools=["Read", "Write", "Bash"],
        permission_mode="acceptEdits"
    )
    session = ConversationSession(options)
    await session.start()

# Example conversation:
# Turn 1 - You: "Create a file called hello.py"
# Turn 1 - Claude: "I'll create a hello.py file for you..."
# Turn 2 - You: "What's in that file?"
# Turn 2 - Claude: "The hello.py file I just created contains..." (remembers!)
# Turn 3 - You: "Add a main function to it"
# Turn 3 - Claude: "I'll add a main function to hello.py..." (knows which file!)

asyncio.run(main())
```

### 

[​

](#using-hooks-for-behavior-modification)

Using Hooks for Behavior Modification

Copy

```python
from claude_agent_sdk import (
    ClaudeSDKClient,
    ClaudeAgentOptions,
    HookMatcher,
    HookContext
)
import asyncio
from typing import Any

async def pre_tool_logger(
    input_data: dict[str, Any],
    tool_use_id: str | None,
    context: HookContext
) -> dict[str, Any]:
    """Log all tool usage before execution."""
    tool_name = input_data.get('tool_name', 'unknown')
    print(f"[PRE-TOOL] About to use: {tool_name}")

    # You can modify or block the tool execution here
    if tool_name == "Bash" and "rm -rf" in str(input_data.get('tool_input', {})):
        return {
            'hookSpecificOutput': {
                'hookEventName': 'PreToolUse',
                'permissionDecision': 'deny',
                'permissionDecisionReason': 'Dangerous command blocked'
            }
        }
    return {}

async def post_tool_logger(
    input_data: dict[str, Any],
    tool_use_id: str | None,
    context: HookContext
) -> dict[str, Any]:
    """Log results after tool execution."""
    tool_name = input_data.get('tool_name', 'unknown')
    print(f"[POST-TOOL] Completed: {tool_name}")
    return {}

async def user_prompt_modifier(
    input_data: dict[str, Any],
    tool_use_id: str | None,
    context: HookContext
) -> dict[str, Any]:
    """Add context to user prompts."""
    original_prompt = input_data.get('prompt', '')

    # Add timestamp to all prompts
    from datetime import datetime
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    return {
        'hookSpecificOutput': {
            'hookEventName': 'UserPromptSubmit',
            'updatedPrompt': f"[{timestamp}] {original_prompt}"
        }
    }

async def main():
    options = ClaudeAgentOptions(
        hooks={
            'PreToolUse': [
                HookMatcher(hooks=[pre_tool_logger]),
                HookMatcher(matcher='Bash', hooks=[pre_tool_logger])
            ],
            'PostToolUse': [
                HookMatcher(hooks=[post_tool_logger])
            ],
            'UserPromptSubmit': [
                HookMatcher(hooks=[user_prompt_modifier])
            ]
        },
        allowed_tools=["Read", "Write", "Bash"]
    )

    async with ClaudeSDKClient(options=options) as client:
        await client.query("List files in current directory")

        async for message in client.receive_response():
            # Hooks will automatically log tool usage
            pass

asyncio.run(main())
```

### 

[​

](#real-time-progress-monitoring)

Real-time Progress Monitoring

Copy

```python
from claude_agent_sdk import (
    ClaudeSDKClient,
    ClaudeAgentOptions,
    AssistantMessage,
    ToolUseBlock,
    ToolResultBlock,
    TextBlock
)
import asyncio

async def monitor_progress():
    options = ClaudeAgentOptions(
        allowed_tools=["Write", "Bash"],
        permission_mode="acceptEdits"
    )

    async with ClaudeSDKClient(options=options) as client:
        await client.query(
            "Create 5 Python files with different sorting algorithms"
        )

        # Monitor progress in real-time
        files_created = []
        async for message in client.receive_messages():
            if isinstance(message, AssistantMessage):
                for block in message.content:
                    if isinstance(block, ToolUseBlock):
                        if block.name == "Write":
                            file_path = block.input.get("file_path", "")
                            print(f"🔨 Creating: {file_path}")
                    elif isinstance(block, ToolResultBlock):
                        print(f"✅ Completed tool execution")
                    elif isinstance(block, TextBlock):
                        print(f"💭 Claude says: {block.text[:100]}...")

            # Check if we've received the final result
            if hasattr(message, 'subtype') and message.subtype in ['success', 'error']:
                print(f"\n🎯 Task completed!")
                break

asyncio.run(monitor_progress())
```

## 

[​

](#example-usage)

Example Usage

### 

[​

](#basic-file-operations-using-query)

Basic file operations (using query)

Copy

```python
from claude_agent_sdk import query, ClaudeAgentOptions, AssistantMessage, ToolUseBlock
import asyncio

async def create_project():
    options = ClaudeAgentOptions(
        allowed_tools=["Read", "Write", "Bash"],
        permission_mode='acceptEdits',
        cwd="/home/user/project"
    )

    async for message in query(
        prompt="Create a Python project structure with setup.py",
        options=options
    ):
        if isinstance(message, AssistantMessage):
            for block in message.content:
                if isinstance(block, ToolUseBlock):
                    print(f"Using tool: {block.name}")

asyncio.run(create_project())
```

### 

[​

](#error-handling)

Error handling

Copy

```python
from claude_agent_sdk import (
    query,
    CLINotFoundError,
    ProcessError,
    CLIJSONDecodeError
)

try:
    async for message in query(prompt="Hello"):
        print(message)
except CLINotFoundError:
    print("Please install Claude Code: npm install -g @anthropic-ai/claude-code")
except ProcessError as e:
    print(f"Process failed with exit code: {e.exit_code}")
except CLIJSONDecodeError as e:
    print(f"Failed to parse response: {e}")
```

### 

[​

](#streaming-mode-with-client)

Streaming mode with client

Copy

```python
from claude_agent_sdk import ClaudeSDKClient
import asyncio

async def interactive_session():
    async with ClaudeSDKClient() as client:
        # Send initial message
        await client.query("What's the weather like?")

        # Process responses
        async for msg in client.receive_response():
            print(msg)

        # Send follow-up
        await client.query("Tell me more about that")

        # Process follow-up response
        async for msg in client.receive_response():
            print(msg)

asyncio.run(interactive_session())
```

### 

[​

](#using-custom-tools-with-claudesdkclient)

Using custom tools with ClaudeSDKClient

Copy

```python
from claude_agent_sdk import (
    ClaudeSDKClient,
    ClaudeAgentOptions,
    tool,
    create_sdk_mcp_server,
    AssistantMessage,
    TextBlock
)
import asyncio
from typing import Any

# Define custom tools with @tool decorator
@tool("calculate", "Perform mathematical calculations", {"expression": str})
async def calculate(args: dict[str, Any]) -> dict[str, Any]:
    try:
        result = eval(args["expression"], {"__builtins__": {}})
        return {
            "content": [{
                "type": "text",
                "text": f"Result: {result}"
            }]
        }
    except Exception as e:
        return {
            "content": [{
                "type": "text",
                "text": f"Error: {str(e)}"
            }],
            "is_error": True
        }

@tool("get_time", "Get current time", {})
async def get_time(args: dict[str, Any]) -> dict[str, Any]:
    from datetime import datetime
    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    return {
        "content": [{
            "type": "text",
            "text": f"Current time: {current_time}"
        }]
    }

async def main():
    # Create SDK MCP server with custom tools
    my_server = create_sdk_mcp_server(
        name="utilities",
        version="1.0.0",
        tools=[calculate, get_time]
    )

    # Configure options with the server
    options = ClaudeAgentOptions(
        mcp_servers={"utils": my_server},
        allowed_tools=[
            "mcp__utils__calculate",
            "mcp__utils__get_time"
        ]
    )

    # Use ClaudeSDKClient for interactive tool usage
    async with ClaudeSDKClient(options=options) as client:
        await client.query("What's 123 * 456?")

        # Process calculation response
        async for message in client.receive_response():
            if isinstance(message, AssistantMessage):
                for block in message.content:
                    if isinstance(block, TextBlock):
                        print(f"Calculation: {block.text}")

        # Follow up with time query
        await client.query("What time is it now?")

        async for message in client.receive_response():
            if isinstance(message, AssistantMessage):
                for block in message.content:
                    if isinstance(block, TextBlock):
                        print(f"Time: {block.text}")

asyncio.run(main())
```

## 

[​

](#see-also)

See also

-   [Python SDK guide](python.html) - Tutorial and examples
-   [SDK overview](overview.html) - General SDK concepts
-   [TypeScript SDK reference](../../docs/claude-code/typescript-sdk-reference.html) - TypeScript SDK documentation
-   [CLI reference](../../docs/claude-code/cli-reference.html) - Command-line interface
-   [Common workflows](../../docs/claude-code/common-workflows.html) - Step-by-step guides

Was this page helpful?

YesNo

[TypeScript SDK](typescript.html)[Streaming Input](streaming-vs-single-mode.html)

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