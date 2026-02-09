Errors - Claude Docs 

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

Errors

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

-   [HTTP errors](#http-errors)
-   [Request size limits](#request-size-limits)
-   [Error shapes](#error-shapes)
-   [Request id](#request-id)
-   [Long requests](#long-requests)

Using the APIs

# Errors

Copy page

Copy page

## 

[​

](#http-errors)

HTTP errors

Our API follows a predictable HTTP error code format:

-   400 - `invalid_request_error`: There was an issue with the format or content of your request. We may also use this error type for other 4XX status codes not listed below.
-   401 - `authentication_error`: There’s an issue with your API key.
-   403 - `permission_error`: Your API key does not have permission to use the specified resource.
-   404 - `not_found_error`: The requested resource was not found.
-   413 - `request_too_large`: Request exceeds the maximum allowed number of bytes. The maximum request size is 32 MB for standard API endpoints.
-   429 - `rate_limit_error`: Your account has hit a rate limit.
-   500 - `api_error`: An unexpected error has occurred internal to Anthropic’s systems.
-   529 - `overloaded_error`: The API is temporarily overloaded.
    
    529 errors can occur when APIs experience high traffic across all users.In rare cases, if your organization has a sharp increase in usage, you might see 429 errors due to acceleration limits on the API. To avoid hitting acceleration limits, ramp up your traffic gradually and maintain consistent usage patterns.
    

When receiving a [streaming](../docs/build-with-claude/streaming.html) response via SSE, it’s possible that an error can occur after returning a 200 response, in which case error handling wouldn’t follow these standard mechanisms.

## 

[​

](#request-size-limits)

Request size limits

The API enforces request size limits to ensure optimal performance:

| Endpoint Type | Maximum Request Size |
| --- | --- |
| Messages API | 32 MB |
| Token Counting API | 32 MB |
| [Batch API](../docs/build-with-claude/batch-processing.html) | 256 MB |
| [Files API](../docs/build-with-claude/files.html) | 500 MB |

If you exceed these limits, you’ll receive a 413 `request_too_large` error. The error is returned from Cloudflare before the request reaches our API servers.

## 

[​

](#error-shapes)

Error shapes

Errors are always returned as JSON, with a top-level `error` object that always includes a `type` and `message` value. The response also includes a `request_id` field for easier tracking and debugging. For example:

JSON

Copy

```json
{
  "type": "error",
  "error": {
    "type": "not_found_error",
    "message": "The requested resource could not be found."
  },
  "request_id": "req_011CSHoEeqs5C35K2UUqR7Fy"
}
```

In accordance with our [versioning](versioning.html) policy, we may expand the values within these objects, and it is possible that the `type` values will grow over time.

## 

[​

](#request-id)

Request id

Every API response includes a unique `request-id` header. This header contains a value such as `req_018EeWyXxfu5pfWkrYcMdjWG`. When contacting support about a specific request, please include this ID to help us quickly resolve your issue. Our official SDKs provide this value as a property on top-level response objects, containing the value of the `request-id` header:

Python

TypeScript

Copy

```python
import anthropic

client = anthropic.Anthropic()

message = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "Hello, Claude"}
    ]
)
print(f"Request ID: {message._request_id}")
```

## 

[​

](#long-requests)

Long requests

We highly encourage using the [streaming Messages API](../docs/build-with-claude/streaming.html) or [Message Batches API](creating-message-batches.html) for long running requests, especially those over 10 minutes.

We do not recommend setting a large `max_tokens` values without using our [streaming Messages API](../docs/build-with-claude/streaming.html) or [Message Batches API](creating-message-batches.html):

-   Some networks may drop idle connections after a variable period of time, which can cause the request to fail or timeout without receiving a response from Anthropic.
-   Networks differ in reliability; our [Message Batches API](creating-message-batches.html) can help you manage the risk of network issues by allowing you to poll for results rather than requiring an uninterrupted network connection.

If you are building a direct API integration, you should be aware that setting a [TCP socket keep-alive](https://tldp.org/HOWTO/TCP-Keepalive-HOWTO/programming.html) can reduce the impact of idle connection timeouts on some networks. Our [SDKs](client-sdks.html) will validate that your non-streaming Messages API requests are not expected to exceed a 10 minute timeout and also will set a socket option for TCP keep-alive.

Was this page helpful?

YesNo

[Service tiers](service-tiers.html)[Handling stop reasons](handling-stop-reasons.html)

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