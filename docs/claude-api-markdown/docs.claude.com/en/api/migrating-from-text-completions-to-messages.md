Migrating from Text Completions - Claude Docs 

[Claude Docs home page![light logo](../../../mintcdn.com/anthropic-claude-docs/DcI2Ybid7ZEnFaf0/logo/light%EF%B9%96fit=max&auto=format&n=DcI2Ybid7ZEnFaf0&q=85&s=c877c45432515ee69194cb19e9f983a2.svg)![dark logo](../../../mintcdn.com/anthropic-claude-docs/DcI2Ybid7ZEnFaf0/logo/dark%EF%B9%96fit=max&auto=format&n=DcI2Ybid7ZEnFaf0&q=85&s=f5bb877be0cb3cba86cf6d7c88185216.svg)](../home.html)

![US](../../../d3gk2c5xim1je2.cloudfront.net/flags/US.svg)

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

Text Completions (Legacy)

Migrating from Text Completions

[Welcome

](../home.html)[Claude Developer Platform

](../docs/intro.html)[Claude Code

](../docs/claude-code/overview.html)[Model Context Protocol (MCP)

](../docs/mcp.html)[API Reference

](messages.html)[Resources

](../resources/overview.html)[Release Notes

](../release-notes/overview.html)

-   [
    
    Developer Guide](../docs/intro.html)
-   [
    
    API Guide](overview.html)

##### Using the APIs

-   [
    
    Overview
    
    
    
    ](overview.html)
-   [
    
    Rate limits
    
    
    
    ](rate-limits.html)
-   [
    
    Service tiers
    
    
    
    ](service-tiers.html)
-   [
    
    Errors
    
    
    
    ](errors.html)
-   [
    
    Handling stop reasons
    
    
    
    ](handling-stop-reasons.html)
-   [
    
    Beta headers
    
    
    
    ](beta-headers.html)

##### API reference

-   Messages
    
-   Models
    
-   Message Batches
    
-   Files
    
-   Skills
    
-   Admin API
    
-   Experimental APIs
    
-   Text Completions (Legacy)
    
    -   [
        
        Migrating from Text Completions
        
        
        
        ](migrating-from-text-completions-to-messages.html)

##### SDKs

-   [
    
    Client SDKs
    
    
    
    ](client-sdks.html)
-   [
    
    OpenAI SDK compatibility
    
    
    
    ](openai-sdk.html)
-   Agent SDK
    

##### Examples

-   [
    
    Messages examples
    
    
    
    ](messages-examples.html)
-   [
    
    Message Batches examples
    
    
    
    ](messages-batch-examples.html)

##### 3rd-party APIs

-   [
    
    Amazon Bedrock API
    
    
    
    ](claude-on-amazon-bedrock.html)
-   [
    
    Vertex AI API
    
    
    
    ](claude-on-vertex-ai.html)

##### Using the Admin API

-   [
    
    Admin API overview
    
    
    
    ](administration-api.html)
-   [
    
    Usage and Cost API
    
    
    
    ](usage-cost-api.html)
-   [
    
    Claude Code Analytics API
    
    
    
    ](claude-code-analytics-api.html)

##### Support & configuration

-   [
    
    Versions
    
    
    
    ](versioning.html)
-   [
    
    IP addresses
    
    
    
    ](ip-addresses.html)
-   [
    
    Supported regions
    
    
    
    ](supported-regions.html)
-   [
    
    Getting help
    
    
    
    ](getting-help.html)

 

On this page

-   [Inputs and outputs](#inputs-and-outputs)
-   [Putting words in Claude’s mouth](#putting-words-in-claude%E2%80%99s-mouth)
-   [System prompt](#system-prompt)
-   [Model names](#model-names)
-   [Stop reason](#stop-reason)
-   [Specifying max tokens](#specifying-max-tokens)
-   [Streaming format](#streaming-format)

Text Completions (Legacy)

# Migrating from Text Completions

Copy page

Migrating from Text Completions to Messages

Copy page

The Text Completions API has been deprecated in favor of the Messages API.

When migrating from Text Completions to [Messages](messages.html), consider the following changes.

### 

[​

](#inputs-and-outputs)

Inputs and outputs

The largest change between Text Completions and the Messages is the way in which you specify model inputs and receive outputs from the model. With Text Completions, inputs are raw strings:

Python

Copy

```python
prompt = "\n\nHuman: Hello there\n\nAssistant: Hi, I'm Claude. How can I help?\n\nHuman: Can you explain Glycolysis to me?\n\nAssistant:"
```

With Messages, you specify a list of input messages instead of a raw prompt:

Shorthand

Expanded

Copy

```json
messages = [
  {"role": "user", "content": "Hello there."},
  {"role": "assistant", "content": "Hi, I'm Claude. How can I help?"},
  {"role": "user", "content": "Can you explain Glycolysis to me?"},
]
```

Each input message has a `role` and `content`.

**Role names**The Text Completions API expects alternating `\n\nHuman:` and `\n\nAssistant:` turns, but the Messages API expects `user` and `assistant` roles. You may see documentation referring to either “human” or “user” turns. These refer to the same role, and will be “user” going forward.

With Text Completions, the model’s generated text is returned in the `completion` values of the response:

Python

Copy

```python
>>> response = anthropic.completions.create(...)
>>> response.completion
" Hi, I'm Claude"
```

With Messages, the response is the `content` value, which is a list of content blocks:

Python

Copy

```python
>>> response = anthropic.messages.create(...)
>>> response.content
[{"type": "text", "text": "Hi, I'm Claude"}]
```

### 

[​

](#putting-words-in-claude%E2%80%99s-mouth)

Putting words in Claude’s mouth

With Text Completions, you can pre-fill part of Claude’s response:

Python

Copy

```python
prompt = "\n\nHuman: Hello\n\nAssistant: Hello, my name is"
```

With Messages, you can achieve the same result by making the last input message have the `assistant` role:

Python

Copy

```python
messages = [
  {"role": "human", "content": "Hello"},
  {"role": "assistant", "content": "Hello, my name is"},
]
```

When doing so, response `content` will continue from the last input message `content`:

JSON

Copy

```json
{
  "role": "assistant",
  "content": [{"type": "text", "text": " Claude. How can I assist you today?" }],
  ...
}
```

### 

[​

](#system-prompt)

System prompt

With Text Completions, the [system prompt](../docs/build-with-claude/prompt-engineering/system-prompts.html) is specified by adding text before the first `\n\nHuman:` turn:

Python

Copy

```python
prompt = "Today is January 1, 2024.\n\nHuman: Hello, Claude\n\nAssistant:"
```

With Messages, you specify the system prompt with the `system` parameter:

Python

Copy

```python
anthropic.Anthropic().messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    system="Today is January 1, 2024.", # <-- system prompt
    messages=[
        {"role": "user", "content": "Hello, Claude"}
    ]
)
```

### 

[​

](#model-names)

Model names

The Messages API requires that you specify the full model version (e.g. `claude-sonnet-4-5-20250929`). We previously supported specifying only the major version number (e.g. `claude-2`), which resulted in automatic upgrades to minor versions. However, we no longer recommend this integration pattern, and Messages do not support it.

### 

[​

](#stop-reason)

Stop reason

Text Completions always have a `stop_reason` of either:

-   `"stop_sequence"`: The model either ended its turn naturally, or one of your custom stop sequences was generated.
-   `"max_tokens"`: Either the model generated your specified `max_tokens` of content, or it reached its [absolute maximum](../docs/about-claude/models/overview.html#model-comparison-table).

Messages have a `stop_reason` of one of the following values:

-   `"end_turn"`: The conversational turn ended naturally.
-   `"stop_sequence"`: One of your specified custom stop sequences was generated.
-   `"max_tokens"`: (unchanged)

### 

[​

](#specifying-max-tokens)

Specifying max tokens

-   Text Completions: `max_tokens_to_sample` parameter. No validation, but capped values per-model.
-   Messages: `max_tokens` parameter. If passing a value higher than the model supports, returns a validation error.

### 

[​

](#streaming-format)

Streaming format

When using `"stream": true` in with Text Completions, the response included any of `completion`, `ping`, and `error` server-sent-events. Messages can contain multiple content blocks of varying types, and so its streaming format is somewhat more complex. See [Messages streaming](../docs/build-with-claude/streaming.html) for details.

Was this page helpful?

YesNo

[Templatize a prompt](prompt-tools-templatize.html)[Client SDKs](client-sdks.html)

Assistant

Responses are generated using AI and may contain mistakes.

[Claude Docs home page![light logo](../../../mintcdn.com/anthropic-claude-docs/DcI2Ybid7ZEnFaf0/logo/light%EF%B9%96fit=max&auto=format&n=DcI2Ybid7ZEnFaf0&q=85&s=c877c45432515ee69194cb19e9f983a2.svg)![dark logo](../../../mintcdn.com/anthropic-claude-docs/DcI2Ybid7ZEnFaf0/logo/dark%EF%B9%96fit=max&auto=format&n=DcI2Ybid7ZEnFaf0&q=85&s=f5bb877be0cb3cba86cf6d7c88185216.svg)](../home.html)

[x](https://x.com/AnthropicAI)[linkedin](https://www.linkedin.com/company/anthropicresearch)

Company

[Anthropic](https://www.anthropic.com/company)[Careers](https://www.anthropic.com/careers)[Economic Futures](https://www.anthropic.com/economic-futures)[Research](https://www.anthropic.com/research)[News](https://www.anthropic.com/news)[Trust center](https://trust.anthropic.com/)[Transparency](https://www.anthropic.com/transparency)

Help and security

[Availability](https://www.anthropic.com/supported-countries)[Status](https://status.anthropic.com/)[Support center](https://support.claude.com/)

Learn

[Courses](https://www.anthropic.com/learn)[MCP connectors](https://claude.com/partners/mcp)[Customer stories](https://www.claude.com/customers)[Engineering blog](https://www.anthropic.com/engineering)[Events](https://www.anthropic.com/events)[Powered by Claude](https://claude.com/partners/powered-by-claude)[Service partners](https://claude.com/partners/services)[Startups program](https://claude.com/programs/startups)

Terms and policies

[Privacy policy](https://www.anthropic.com/legal/privacy)[Disclosure policy](https://www.anthropic.com/responsible-disclosure-policy)[Usage policy](https://www.anthropic.com/legal/aup)[Commercial terms](https://www.anthropic.com/legal/commercial-terms)[Consumer terms](https://www.anthropic.com/legal/consumer-terms)