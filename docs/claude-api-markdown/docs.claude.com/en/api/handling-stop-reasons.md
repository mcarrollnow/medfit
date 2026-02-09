Handling stop reasons - Claude Docs 

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

Using the APIs

Handling stop reasons

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

-   [What is stop\_reason?](#what-is-stop-reason%3F)
-   [Stop reason values](#stop-reason-values)
-   [end\_turn](#end-turn)
-   [Empty responses with end\_turn](#empty-responses-with-end-turn)
-   [max\_tokens](#max-tokens)
-   [stop\_sequence](#stop-sequence)
-   [tool\_use](#tool-use)
-   [pause\_turn](#pause-turn)
-   [refusal](#refusal)
-   [model\_context\_window\_exceeded](#model-context-window-exceeded)
-   [Best practices for handling stop reasons](#best-practices-for-handling-stop-reasons)
-   [1\. Always check stop\_reason](#1-always-check-stop-reason)
-   [2\. Handle truncated responses gracefully](#2-handle-truncated-responses-gracefully)
-   [3\. Implement retry logic for pause\_turn](#3-implement-retry-logic-for-pause-turn)
-   [Stop reasons vs. errors](#stop-reasons-vs-errors)
-   [Stop reasons (successful responses)](#stop-reasons-successful-responses)
-   [Errors (failed requests)](#errors-failed-requests)
-   [Streaming considerations](#streaming-considerations)
-   [Common patterns](#common-patterns)
-   [Handling tool use workflows](#handling-tool-use-workflows)
-   [Ensuring complete responses](#ensuring-complete-responses)
-   [Getting maximum tokens without knowing input size](#getting-maximum-tokens-without-knowing-input-size)

Using the APIs

# Handling stop reasons

Copy page

Copy page

When you make a request to the Messages API, Claude’s response includes a `stop_reason` field that indicates why the model stopped generating its response. Understanding these values is crucial for building robust applications that handle different response types appropriately. For details about `stop_reason` in the API response, see the [Messages API reference](messages.html).

## 

[​

](#what-is-stop-reason%3F)

What is stop\_reason?

The `stop_reason` field is part of every successful Messages API response. Unlike errors, which indicate failures in processing your request, `stop_reason` tells you why Claude successfully completed its response generation.

Example response

Copy

```json
{
  "id": "msg_01234",
  "type": "message",
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "Here's the answer to your question..."
    }
  ],
  "stop_reason": "end_turn",
  "stop_sequence": null,
  "usage": {
    "input_tokens": 100,
    "output_tokens": 50
  }
}
```

## 

[​

](#stop-reason-values)

Stop reason values

### 

[​

](#end-turn)

end\_turn

The most common stop reason. Indicates Claude finished its response naturally.

Copy

```python
if response.stop_reason == "end_turn":
    # Process the complete response
    print(response.content[0].text)
```

#### 

[​

](#empty-responses-with-end-turn)

Empty responses with end\_turn

Sometimes Claude returns an empty response (exactly 2-3 tokens with no content) with `stop_reason: "end_turn"`. This typically happens when Claude interprets that the assistant turn is complete, particularly after tool results. **Common causes:**

-   Adding text blocks immediately after tool results (Claude learns to expect the user to always insert text after tool results, so it ends its turn to follow the pattern)
-   Sending Claude’s completed response back without adding anything (Claude already decided it’s done, so it will remain done)

**How to prevent empty responses:**

Copy

```python
# INCORRECT: Adding text immediately after tool_result
messages = [
    {"role": "user", "content": "Calculate the sum of 1234 and 5678"},
    {"role": "assistant", "content": [
        {
            "type": "tool_use",
            "id": "toolu_123",
            "name": "calculator",
            "input": {"operation": "add", "a": 1234, "b": 5678}
        }
    ]},
    {"role": "user", "content": [
        {
            "type": "tool_result",
            "tool_use_id": "toolu_123",
            "content": "6912"
        },
        {
            "type": "text",
            "text": "Here's the result"  # Don't add text after tool_result
        }
    ]}
]

# CORRECT: Send tool results directly without additional text
messages = [
    {"role": "user", "content": "Calculate the sum of 1234 and 5678"},
    {"role": "assistant", "content": [
        {
            "type": "tool_use",
            "id": "toolu_123",
            "name": "calculator",
            "input": {"operation": "add", "a": 1234, "b": 5678}
        }
    ]},
    {"role": "user", "content": [
        {
            "type": "tool_result",
            "tool_use_id": "toolu_123",
            "content": "6912"
        }
    ]}  # Just the tool_result, no additional text
]

# If you still get empty responses after fixing the above:
def handle_empty_response(client, messages):
    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1024,
        messages=messages
    )

    # Check if response is empty
    if (response.stop_reason == "end_turn" and
        not response.content:

        # INCORRECT: Don't just retry with the empty response
        # This won't work because Claude already decided it's done

        # CORRECT: Add a continuation prompt in a NEW user message
        messages.append({"role": "user", "content": "Please continue"})

        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=1024,
            messages=messages
        )

    return response
```

**Best practices:**

1.  **Never add text blocks immediately after tool results** - This teaches Claude to expect user input after every tool use
2.  **Don’t retry empty responses without modification** - Simply sending the empty response back won’t help
3.  **Use continuation prompts as a last resort** - Only if the above fixes don’t resolve the issue

### 

[​

](#max-tokens)

max\_tokens

Claude stopped because it reached the `max_tokens` limit specified in your request.

Copy

```python
# Request with limited tokens
response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=10,
    messages=[{"role": "user", "content": "Explain quantum physics"}]
)

if response.stop_reason == "max_tokens":
    # Response was truncated
    print("Response was cut off at token limit")
    # Consider making another request to continue
```

### 

[​

](#stop-sequence)

stop\_sequence

Claude encountered one of your custom stop sequences.

Copy

```python
response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    stop_sequences=["END", "STOP"],
    messages=[{"role": "user", "content": "Generate text until you say END"}]
)

if response.stop_reason == "stop_sequence":
    print(f"Stopped at sequence: {response.stop_sequence}")
```

### 

[​

](#tool-use)

tool\_use

Claude is calling a tool and expects you to execute it.

Copy

```python
response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=[weather_tool],
    messages=[{"role": "user", "content": "What's the weather?"}]
)

if response.stop_reason == "tool_use":
    # Extract and execute the tool
    for content in response.content:
        if content.type == "tool_use":
            result = execute_tool(content.name, content.input)
            # Return result to Claude for final response
```

### 

[​

](#pause-turn)

pause\_turn

Used with server tools like web search when Claude needs to pause a long-running operation.

Copy

```python
response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=[{"type": "web_search_20250305", "name": "web_search"}],
    messages=[{"role": "user", "content": "Search for latest AI news"}]
)

if response.stop_reason == "pause_turn":
    # Continue the conversation
    messages = [
        {"role": "user", "content": original_query},
        {"role": "assistant", "content": response.content}
    ]
    continuation = client.messages.create(
        model="claude-sonnet-4-5",
        messages=messages,
        tools=[{"type": "web_search_20250305", "name": "web_search"}]
    )
```

### 

[​

](#refusal)

refusal

Claude refused to generate a response due to safety concerns.

Copy

```python
response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[{"role": "user", "content": "[Unsafe request]"}]
)

if response.stop_reason == "refusal":
    # Claude declined to respond
    print("Claude was unable to process this request")
    # Consider rephrasing or modifying the request
```

If you encounter `refusal` stop reasons frequently while using Claude Sonnet 4.5 or Opus 4.1, you can try updating your API calls to use Sonnet 4 (`claude-sonnet-4-20250514`), which has different usage restrictions. Learn more about [understanding Sonnet 4.5’s API safety filters](https://support.claude.com/en/articles/12449294-understanding-sonnet-4-5-s-api-safety-filters).

To learn more about refusals triggered by API safety filters for Claude Sonnet 4.5, see [Understanding Sonnet 4.5’s API Safety Filters](https://support.claude.com/en/articles/12449294-understanding-sonnet-4-5-s-api-safety-filters).

### 

[​

](#model-context-window-exceeded)

model\_context\_window\_exceeded

Claude stopped because it reached the model’s context window limit. This allows you to request the maximum possible tokens without knowing the exact input size.

Copy

```python
# Request with maximum tokens to get as much as possible
response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=64000,  # Model's maximum output tokens
    messages=[{"role": "user", "content": "Large input that uses most of context window..."}]
)

if response.stop_reason == "model_context_window_exceeded":
    # Response hit context window limit before max_tokens
    print("Response reached model's context window limit")
    # The response is still valid but was limited by context window
```

This stop reason is available by default in Sonnet 4.5 and newer models. For earlier models, use the beta header `model-context-window-exceeded-2025-08-26` to enable this behavior.

## 

[​

](#best-practices-for-handling-stop-reasons)

Best practices for handling stop reasons

### 

[​

](#1-always-check-stop-reason)

1\. Always check stop\_reason

Make it a habit to check the `stop_reason` in your response handling logic:

Copy

```python
def handle_response(response):
    if response.stop_reason == "tool_use":
        return handle_tool_use(response)
    elif response.stop_reason == "max_tokens":
        return handle_truncation(response)
    elif response.stop_reason == "model_context_window_exceeded":
        return handle_context_limit(response)
    elif response.stop_reason == "pause_turn":
        return handle_pause(response)
    elif response.stop_reason == "refusal":
        return handle_refusal(response)
    else:
        # Handle end_turn and other cases
        return response.content[0].text
```

### 

[​

](#2-handle-truncated-responses-gracefully)

2\. Handle truncated responses gracefully

When a response is truncated due to token limits or context window:

Copy

```python
def handle_truncated_response(response):
    if response.stop_reason in ["max_tokens", "model_context_window_exceeded"]:
        # Option 1: Warn the user about the specific limit
        if response.stop_reason == "max_tokens":
            message = "[Response truncated due to max_tokens limit]"
        else:
            message = "[Response truncated due to context window limit]"
        return f"{response.content[0].text}\n\n{message}"

        # Option 2: Continue generation
        messages = [
            {"role": "user", "content": original_prompt},
            {"role": "assistant", "content": response.content[0].text}
        ]
        continuation = client.messages.create(
            model="claude-sonnet-4-5",
            max_tokens=1024,
            messages=messages + [{"role": "user", "content": "Please continue"}]
        )
        return response.content[0].text + continuation.content[0].text
```

### 

[​

](#3-implement-retry-logic-for-pause-turn)

3\. Implement retry logic for pause\_turn

For server tools that may pause:

Copy

```python
def handle_paused_conversation(initial_response, max_retries=3):
    response = initial_response
    messages = [{"role": "user", "content": original_query}]
    
    for attempt in range(max_retries):
        if response.stop_reason != "pause_turn":
            break
            
        messages.append({"role": "assistant", "content": response.content})
        response = client.messages.create(
            model="claude-sonnet-4-5",
            messages=messages,
            tools=original_tools
        )
    
    return response
```

## 

[​

](#stop-reasons-vs-errors)

Stop reasons vs. errors

It’s important to distinguish between `stop_reason` values and actual errors:

### 

[​

](#stop-reasons-successful-responses)

Stop reasons (successful responses)

-   Part of the response body
-   Indicate why generation stopped normally
-   Response contains valid content

### 

[​

](#errors-failed-requests)

Errors (failed requests)

-   HTTP status codes 4xx or 5xx
-   Indicate request processing failures
-   Response contains error details

Copy

```python
try:
    response = client.messages.create(...)
    
    # Handle successful response with stop_reason
    if response.stop_reason == "max_tokens":
        print("Response was truncated")
    
except anthropic.APIError as e:
    # Handle actual errors
    if e.status_code == 429:
        print("Rate limit exceeded")
    elif e.status_code == 500:
        print("Server error")
```

## 

[​

](#streaming-considerations)

Streaming considerations

When using streaming, `stop_reason` is:

-   `null` in the initial `message_start` event
-   Provided in the `message_delta` event
-   Not provided in any other events

Copy

```python
with client.messages.stream(...) as stream:
    for event in stream:
        if event.type == "message_delta":
            stop_reason = event.delta.stop_reason
            if stop_reason:
                print(f"Stream ended with: {stop_reason}")
```

## 

[​

](#common-patterns)

Common patterns

### 

[​

](#handling-tool-use-workflows)

Handling tool use workflows

Copy

```python
def complete_tool_workflow(client, user_query, tools):
    messages = [{"role": "user", "content": user_query}]
    
    while True:
        response = client.messages.create(
            model="claude-sonnet-4-5",
            messages=messages,
            tools=tools
        )
        
        if response.stop_reason == "tool_use":
            # Execute tools and continue
            tool_results = execute_tools(response.content)
            messages.append({"role": "assistant", "content": response.content})
            messages.append({"role": "user", "content": tool_results})
        else:
            # Final response
            return response
```

### 

[​

](#ensuring-complete-responses)

Ensuring complete responses

Copy

```python
def get_complete_response(client, prompt, max_attempts=3):
    messages = [{"role": "user", "content": prompt}]
    full_response = ""

    for _ in range(max_attempts):
        response = client.messages.create(
            model="claude-sonnet-4-5",
            messages=messages,
            max_tokens=4096
        )

        full_response += response.content[0].text

        if response.stop_reason != "max_tokens":
            break

        # Continue from where it left off
        messages = [
            {"role": "user", "content": prompt},
            {"role": "assistant", "content": full_response},
            {"role": "user", "content": "Please continue from where you left off."}
        ]

    return full_response
```

### 

[​

](#getting-maximum-tokens-without-knowing-input-size)

Getting maximum tokens without knowing input size

With the `model_context_window_exceeded` stop reason, you can request the maximum possible tokens without calculating input size:

Copy

```python
def get_max_possible_tokens(client, prompt):
    """
    Get as many tokens as possible within the model's context window
    without needing to calculate input token count
    """
    response = client.messages.create(
        model="claude-sonnet-4-5",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=64000  # Set to model's maximum output tokens
    )

    if response.stop_reason == "model_context_window_exceeded":
        # Got the maximum possible tokens given input size
        print(f"Generated {response.usage.output_tokens} tokens (context limit reached)")
    elif response.stop_reason == "max_tokens":
        # Got exactly the requested tokens
        print(f"Generated {response.usage.output_tokens} tokens (max_tokens reached)")
    else:
        # Natural completion
        print(f"Generated {response.usage.output_tokens} tokens (natural completion)")

    return response.content[0].text
```

By properly handling `stop_reason` values, you can build more robust applications that gracefully handle different response scenarios and provide better user experiences.

Was this page helpful?

YesNo

[Errors](errors.html)[Beta headers](beta-headers.html)

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