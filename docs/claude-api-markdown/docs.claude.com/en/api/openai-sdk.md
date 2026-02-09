OpenAI SDK compatibility - Claude Docs 

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

SDKs

OpenAI SDK compatibility

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

-   [Getting started with the OpenAI SDK](#getting-started-with-the-openai-sdk)
-   [Quick start example](#quick-start-example)
-   [Important OpenAI compatibility limitations](#important-openai-compatibility-limitations)
-   [API behavior](#api-behavior)
-   [Output quality considerations](#output-quality-considerations)
-   [System / Developer message hoisting](#system-%2F-developer-message-hoisting)
-   [Extended thinking support](#extended-thinking-support)
-   [Rate limits](#rate-limits)
-   [Detailed OpenAI Compatible API Support](#detailed-openai-compatible-api-support)
-   [Request fields](#request-fields)
-   [Simple fields](#simple-fields)
-   [tools / functions fields](#tools-%2F-functions-fields)
-   [messages array fields](#messages-array-fields)
-   [Response fields](#response-fields)
-   [Error message compatibility](#error-message-compatibility)
-   [Header compatibility](#header-compatibility)

SDKs

# OpenAI SDK compatibility

Copy page

Anthropic provides a compatibility layer that enables you to use the OpenAI SDK to test the Claude API. With a few code changes, you can quickly evaluate Anthropic model capabilities.

Copy page

This compatibility layer is primarily intended to test and compare model capabilities, and is not considered a long-term or production-ready solution for most use cases. While we do intend to keep it fully functional and not make breaking changes, our priority is the reliability and effectiveness of the [Claude API](overview.html).For more information on known compatibility limitations, see [Important OpenAI compatibility limitations](#important-openai-compatibility-limitations).If you encounter any issues with the OpenAI SDK compatibility feature, please let us know [here](https://forms.gle/oQV4McQNiuuNbz9n8).

For the best experience and access to Claude API full feature set ([PDF processing](../docs/build-with-claude/pdf-support.html), [citations](../docs/build-with-claude/citations.html), [extended thinking](../docs/build-with-claude/extended-thinking.html), and [prompt caching](../docs/build-with-claude/prompt-caching.html)), we recommend using the native [Claude API](overview.html).

## 

[​

](#getting-started-with-the-openai-sdk)

Getting started with the OpenAI SDK

To use the OpenAI SDK compatibility feature, you’ll need to:

1.  Use an official OpenAI SDK
2.  Change the following
    -   Update your base URL to point to the Claude API
    -   Replace your API key with an [Claude API key](https://console.anthropic.com/settings/keys)
    -   Update your model name to use a [Claude model](../docs/about-claude/models/overview.html)
3.  Review the documentation below for what features are supported

### 

[​

](#quick-start-example)

Quick start example

Python

TypeScript

Copy

```python
from openai import OpenAI

client = OpenAI(
    api_key="ANTHROPIC_API_KEY",  # Your Claude API key
    base_url="https://api.anthropic.com/v1/"  # the Claude API endpoint
)

response = client.chat.completions.create(
    model="claude-sonnet-4-5", # Anthropic model name
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Who are you?"}
    ],
)

print(response.choices[0].message.content)
```

## 

[​

](#important-openai-compatibility-limitations)

Important OpenAI compatibility limitations

#### 

[​

](#api-behavior)

API behavior

Here are the most substantial differences from using OpenAI:

-   The `strict` parameter for function calling is ignored, which means the tool use JSON is not guaranteed to follow the supplied schema.
-   Audio input is not supported; it will simply be ignored and stripped from input
-   Prompt caching is not supported, but it is supported in [the Anthropic SDK](client-sdks.html)
-   System/developer messages are hoisted and concatenated to the beginning of the conversation, as Anthropic only supports a single initial system message.

Most unsupported fields are silently ignored rather than producing errors. These are all documented below.

#### 

[​

](#output-quality-considerations)

Output quality considerations

If you’ve done lots of tweaking to your prompt, it’s likely to be well-tuned to OpenAI specifically. Consider using our [prompt improver in the Claude Console](https://console.anthropic.com/dashboard) as a good starting point.

#### 

[​

](#system-%2F-developer-message-hoisting)

System / Developer message hoisting

Most of the inputs to the OpenAI SDK clearly map directly to Anthropic’s API parameters, but one distinct difference is the handling of system / developer prompts. These two prompts can be put throughout a chat conversation via OpenAI. Since Anthropic only supports an initial system message, we take all system/developer messages and concatenate them together with a single newline (`\n`) in between them. This full string is then supplied as a single system message at the start of the messages.

#### 

[​

](#extended-thinking-support)

Extended thinking support

You can enable [extended thinking](../docs/build-with-claude/extended-thinking.html) capabilities by adding the `thinking` parameter. While this will improve Claude’s reasoning for complex tasks, the OpenAI SDK won’t return Claude’s detailed thought process. For full extended thinking features, including access to Claude’s step-by-step reasoning output, use the native Claude API.

Python

TypeScript

Copy

```python
response = client.chat.completions.create(
    model="claude-sonnet-4-5",
    messages=...,
    extra_body={
        "thinking": { "type": "enabled", "budget_tokens": 2000 }
    }
)
```

## 

[​

](#rate-limits)

Rate limits

Rate limits follow Anthropic’s [standard limits](rate-limits.html) for the `/v1/messages` endpoint.

## 

[​

](#detailed-openai-compatible-api-support)

Detailed OpenAI Compatible API Support

### 

[​

](#request-fields)

Request fields

#### 

[​

](#simple-fields)

Simple fields

| Field | Support status |
| --- | --- |
| `model` | Use Claude model names |
| `max_tokens` | Fully supported |
| `max_completion_tokens` | Fully supported |
| `stream` | Fully supported |
| `stream_options` | Fully supported |
| `top_p` | Fully supported |
| `parallel_tool_calls` | Fully supported |
| `stop` | All non-whitespace stop sequences work |
| `temperature` | Between 0 and 1 (inclusive). Values greater than 1 are capped at 1. |
| `n` | Must be exactly 1 |
| `logprobs` | Ignored |
| `metadata` | Ignored |
| `response_format` | Ignored |
| `prediction` | Ignored |
| `presence_penalty` | Ignored |
| `frequency_penalty` | Ignored |
| `seed` | Ignored |
| `service_tier` | Ignored |
| `audio` | Ignored |
| `logit_bias` | Ignored |
| `store` | Ignored |
| `user` | Ignored |
| `modalities` | Ignored |
| `top_logprobs` | Ignored |
| `reasoning_effort` | Ignored |

#### 

[​

](#tools-%2F-functions-fields)

`tools` / `functions` fields

Show fields

-   Tools
-   Functions

`tools[n].function` fields

| Field | Support status |
| --- | --- |
| `name` | Fully supported |
| `description` | Fully supported |
| `parameters` | Fully supported |
| `strict` | Ignored |

#### 

[​

](#messages-array-fields)

`messages` array fields

Show fields

-   Developer role
-   System role
-   User role
-   Assistant role
-   Tool role
-   Function role

Fields for `messages[n].role == "developer"`

Developer messages are hoisted to beginning of conversation as part of the initial system message

| Field | Support status |
| --- | --- |
| `content` | Fully supported, but hoisted |
| `name` | Ignored |

### 

[​

](#response-fields)

Response fields

| Field | Support status |
| --- | --- |
| `id` | Fully supported |
| `choices[]` | Will always have a length of 1 |
| `choices[].finish_reason` | Fully supported |
| `choices[].index` | Fully supported |
| `choices[].message.role` | Fully supported |
| `choices[].message.content` | Fully supported |
| `choices[].message.tool_calls` | Fully supported |
| `object` | Fully supported |
| `created` | Fully supported |
| `model` | Fully supported |
| `finish_reason` | Fully supported |
| `content` | Fully supported |
| `usage.completion_tokens` | Fully supported |
| `usage.prompt_tokens` | Fully supported |
| `usage.total_tokens` | Fully supported |
| `usage.completion_tokens_details` | Always empty |
| `usage.prompt_tokens_details` | Always empty |
| `choices[].message.refusal` | Always empty |
| `choices[].message.audio` | Always empty |
| `logprobs` | Always empty |
| `service_tier` | Always empty |
| `system_fingerprint` | Always empty |

### 

[​

](#error-message-compatibility)

Error message compatibility

The compatibility layer maintains consistent error formats with the OpenAI API. However, the detailed error messages will not be equivalent. We recommend only using the error messages for logging and debugging.

### 

[​

](#header-compatibility)

Header compatibility

While the OpenAI SDK automatically manages headers, here is the complete list of headers supported by the Claude API for developers who need to work with them directly.

| Header | Support Status |
| --- | --- |
| `x-ratelimit-limit-requests` | Fully supported |
| `x-ratelimit-limit-tokens` | Fully supported |
| `x-ratelimit-remaining-requests` | Fully supported |
| `x-ratelimit-remaining-tokens` | Fully supported |
| `x-ratelimit-reset-requests` | Fully supported |
| `x-ratelimit-reset-tokens` | Fully supported |
| `retry-after` | Fully supported |
| `request-id` | Fully supported |
| `openai-version` | Always `2020-10-01` |
| `authorization` | Fully supported |
| `openai-processing-ms` | Always empty |

Was this page helpful?

YesNo

[Client SDKs](client-sdks.html)[Migrate to Claude Agent SDK](../docs/claude-code/sdk/migration-guide.html)

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