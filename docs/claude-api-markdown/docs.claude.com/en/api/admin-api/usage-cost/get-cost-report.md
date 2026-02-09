Get Cost Report - Claude Docs 

[Claude Docs home page![light logo](../../../../../mintcdn.com/anthropic-claude-docs/DcI2Ybid7ZEnFaf0/logo/light%EF%B9%96fit=max&auto=format&n=DcI2Ybid7ZEnFaf0&q=85&s=c877c45432515ee69194cb19e9f983a2.svg)![dark logo](../../../../../mintcdn.com/anthropic-claude-docs/DcI2Ybid7ZEnFaf0/logo/dark%EF%B9%96fit=max&auto=format&n=DcI2Ybid7ZEnFaf0&q=85&s=f5bb877be0cb3cba86cf6d7c88185216.svg)](../../../home.html)

![US](../../../../../d3gk2c5xim1je2.cloudfront.net/flags/US.svg)

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

Usage and Cost

Get Cost Report

[Welcome

](../../../home.html)[Claude Developer Platform

](../../../docs/intro.html)[Claude Code

](../../../docs/claude-code/overview.html)[Model Context Protocol (MCP)

](../../../docs/mcp.html)[API Reference

](../../messages.html)[Resources

](../../../resources/overview.html)[Release Notes

](../../../release-notes/overview.html)

-   [
    
    Developer Guide](../../../docs/intro.html)
-   [
    
    API Guide](../../overview.html)

##### Using the APIs

-   [
    
    Overview
    
    
    
    ](../../overview.html)
-   [
    
    Rate limits
    
    
    
    ](../../rate-limits.html)
-   [
    
    Service tiers
    
    
    
    ](../../service-tiers.html)
-   [
    
    Errors
    
    
    
    ](../../errors.html)
-   [
    
    Handling stop reasons
    
    
    
    ](../../handling-stop-reasons.html)
-   [
    
    Beta headers
    
    
    
    ](../../beta-headers.html)

##### API reference

-   Messages
    
-   Models
    
-   Message Batches
    
-   Files
    
-   Skills
    
-   Admin API
    
    -   Organization Info
        
    -   Organization Member Management
        
    -   Organization Invites
        
    -   Workspace Management
        
    -   Workspace Member Management
        
    -   API Keys
        
    -   Usage and Cost
        
        -   [GET
            
            Get Usage Report for the Messages API
            
            
            
            ](get-messages-usage-report.html)
        -   [GET
            
            Get Cost Report
            
            
            
            ](get-cost-report.html)
        -   [GET
            
            Get Claude Code Usage Report
            
            
            
            ](../claude-code/get-claude-code-usage-report.html)
-   Experimental APIs
    
-   Text Completions (Legacy)
    

##### SDKs

-   [
    
    Client SDKs
    
    
    
    ](../../client-sdks.html)
-   [
    
    OpenAI SDK compatibility
    
    
    
    ](../../openai-sdk.html)
-   Agent SDK
    

##### Examples

-   [
    
    Messages examples
    
    
    
    ](../../messages-examples.html)
-   [
    
    Message Batches examples
    
    
    
    ](../../messages-batch-examples.html)

##### 3rd-party APIs

-   [
    
    Amazon Bedrock API
    
    
    
    ](../../claude-on-amazon-bedrock.html)
-   [
    
    Vertex AI API
    
    
    
    ](../../claude-on-vertex-ai.html)

##### Using the Admin API

-   [
    
    Admin API overview
    
    
    
    ](../../administration-api.html)
-   [
    
    Usage and Cost API
    
    
    
    ](../../usage-cost-api.html)
-   [
    
    Claude Code Analytics API
    
    
    
    ](../../claude-code-analytics-api.html)

##### Support & configuration

-   [
    
    Versions
    
    
    
    ](../../versioning.html)
-   [
    
    IP addresses
    
    
    
    ](../../ip-addresses.html)
-   [
    
    Supported regions
    
    
    
    ](../../supported-regions.html)
-   [
    
    Getting help
    
    
    
    ](../../getting-help.html)

 

cURL

cURL

Copy

```
curl "https://api.anthropic.com/v1/organizations/cost_report\
?starting_at=2025-08-01T00:00:00Z\
&group_by[]=workspace_id\
&group_by[]=description\
&limit=1" \
  --header "anthropic-version: 2023-06-01" \
  --header "content-type: application/json" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"
```

200

4XX

Copy

```
{
  "data": [
    {
      "starting_at": "2025-08-01T00:00:00Z",
      "ending_at": "2025-08-02T00:00:00Z",
      "results": [
        {
          "currency": "USD",
          "amount": "123.78912",
          "workspace_id": "wrkspc_01JwQvzr7rXLA5AGx3HKfFUJ",
          "description": "Claude Sonnet 4 Usage - Input Tokens",
          "cost_type": "tokens",
          "context_window": "0-200k",
          "model": "claude-sonnet-4-20250514",
          "service_tier": "standard",
          "token_type": "uncached_input_tokens"
        }
      ]
    }
  ],
  "has_more": true,
  "next_page": "page_MjAyNS0wNS0xNFQwMDowMDowMFo="
}
```

Usage and Cost

# Get Cost Report

Copy page

Copy page

GET

/

v1

/

organizations

/

cost\_report

cURL

cURL

Copy

```
curl "https://api.anthropic.com/v1/organizations/cost_report\
?starting_at=2025-08-01T00:00:00Z\
&group_by[]=workspace_id\
&group_by[]=description\
&limit=1" \
  --header "anthropic-version: 2023-06-01" \
  --header "content-type: application/json" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"
```

200

4XX

Copy

```
{
  "data": [
    {
      "starting_at": "2025-08-01T00:00:00Z",
      "ending_at": "2025-08-02T00:00:00Z",
      "results": [
        {
          "currency": "USD",
          "amount": "123.78912",
          "workspace_id": "wrkspc_01JwQvzr7rXLA5AGx3HKfFUJ",
          "description": "Claude Sonnet 4 Usage - Input Tokens",
          "cost_type": "tokens",
          "context_window": "0-200k",
          "model": "claude-sonnet-4-20250514",
          "service_tier": "standard",
          "token_type": "uncached_input_tokens"
        }
      ]
    }
  ],
  "has_more": true,
  "next_page": "page_MjAyNS0wNS0xNFQwMDowMDowMFo="
}
```

**The Admin API is unavailable for individual accounts.** To collaborate with teammates and add members, set up your organization in **Console → Settings → Organization**.

#### Headers

[​

](#parameter-x-api-key)

x-api-key

string

required

Your unique Admin API key for authentication.

This key is required in the header of all Admin API requests, to authenticate your account and access Anthropic's services. Get your Admin API key through the [Console](https://console.anthropic.com/settings/admin-keys).

[​

](#parameter-anthropic-version)

anthropic-version

string

required

The version of the Claude API you want to use.

Read more about versioning and our version history [here](../../versioning.html).

#### Query Parameters

[​

](#parameter-limit)

limit

integer

default:7

Maximum number of time buckets to return in the response.

Required range: `1 <= x <= 31`

Examples:

`7`

[​

](#parameter-page)

page

string<date-time> | null

Optionally set to the `next_page` token from the previous response.

Examples:

`"page_MjAyNS0wNS0xNFQwMDowMDowMFo="`

`null`

[​

](#parameter-starting-at)

starting\_at

string<date-time>

required

Time buckets that start on or after this RFC 3339 timestamp will be returned. Each time bucket will be snapped to the start of the minute/hour/day in UTC.

Examples:

`"2024-10-30T23:58:27.427722Z"`

[​

](#parameter-ending-at)

ending\_at

string<date-time> | null

Time buckets that end before this RFC 3339 timestamp will be returned.

Examples:

`"2024-10-30T23:58:27.427722Z"`

[​

](#parameter-group-by)

group\_by\[\]

enum<string>\[\] | null

Group by any subset of the available options.

Show child attributes

Examples:

`"workspace_id"`

`"description"`

[​

](#parameter-bucket-width)

bucket\_width

enum<string>

Time granularity of the response data.

Available options:

| Title | Const |
| --- | --- |
| CostReportTimeBucketWidth | `1d` |

#### Response

200

application/json

Successful Response

[​

](#response-data)

data

CostReportTimeBucket · object\[\]

required

Show child attributes

[​

](#response-has-more)

has\_more

boolean

required

Indicates if there are more results.

[​

](#response-next-page)

next\_page

string<date-time> | null

required

Token to provide in as `page` in the subsequent request to retrieve the next page of data.

Examples:

`"page_MjAyNS0wNS0xNFQwMDowMDowMFo="`

`null`

Was this page helpful?

YesNo

[Get Usage Report for the Messages API](get-messages-usage-report.html)[Get Claude Code Usage Report](../claude-code/get-claude-code-usage-report.html)

Assistant

Responses are generated using AI and may contain mistakes.

[Claude Docs home page![light logo](../../../../../mintcdn.com/anthropic-claude-docs/DcI2Ybid7ZEnFaf0/logo/light%EF%B9%96fit=max&auto=format&n=DcI2Ybid7ZEnFaf0&q=85&s=c877c45432515ee69194cb19e9f983a2.svg)![dark logo](../../../../../mintcdn.com/anthropic-claude-docs/DcI2Ybid7ZEnFaf0/logo/dark%EF%B9%96fit=max&auto=format&n=DcI2Ybid7ZEnFaf0&q=85&s=f5bb877be0cb3cba86cf6d7c88185216.svg)](../../../home.html)

[x](https://x.com/AnthropicAI)[linkedin](https://www.linkedin.com/company/anthropicresearch)

Company

[Anthropic](https://www.anthropic.com/company)[Careers](https://www.anthropic.com/careers)[Economic Futures](https://www.anthropic.com/economic-futures)[Research](https://www.anthropic.com/research)[News](https://www.anthropic.com/news)[Trust center](https://trust.anthropic.com/)[Transparency](https://www.anthropic.com/transparency)

Help and security

[Availability](https://www.anthropic.com/supported-countries)[Status](https://status.anthropic.com/)[Support center](https://support.claude.com/)

Learn

[Courses](https://www.anthropic.com/learn)[MCP connectors](https://claude.com/partners/mcp)[Customer stories](https://www.claude.com/customers)[Engineering blog](https://www.anthropic.com/engineering)[Events](https://www.anthropic.com/events)[Powered by Claude](https://claude.com/partners/powered-by-claude)[Service partners](https://claude.com/partners/services)[Startups program](https://claude.com/programs/startups)

Terms and policies

[Privacy policy](https://www.anthropic.com/legal/privacy)[Disclosure policy](https://www.anthropic.com/responsible-disclosure-policy)[Usage policy](https://www.anthropic.com/legal/aup)[Commercial terms](https://www.anthropic.com/legal/commercial-terms)[Consumer terms](https://www.anthropic.com/legal/consumer-terms)