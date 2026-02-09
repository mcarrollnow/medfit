Get Usage Report for the Messages API - Claude Docs 

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

Get Usage Report for the Messages API

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
curl "https://api.anthropic.com/v1/organizations/usage_report/messages\
?starting_at=2025-08-01T00:00:00Z\
&group_by[]=api_key_id\
&group_by[]=workspace_id\
&group_by[]=model\
&group_by[]=service_tier\
&group_by[]=context_window\
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
          "uncached_input_tokens": 1500,
          "cache_creation": {
            "ephemeral_1h_input_tokens": 1000,
            "ephemeral_5m_input_tokens": 500
          },
          "cache_read_input_tokens": 200,
          "output_tokens": 500,
          "server_tool_use": {
            "web_search_requests": 10
          },
          "api_key_id": "apikey_01Rj2N8SVvo6BePZj99NhmiT",
          "workspace_id": "wrkspc_01JwQvzr7rXLA5AGx3HKfFUJ",
          "model": "claude-sonnet-4-20250514",
          "service_tier": "standard",
          "context_window": "0-200k"
        }
      ]
    }
  ],
  "has_more": true,
  "next_page": "page_MjAyNS0wNS0xNFQwMDowMDowMFo="
}
```

Usage and Cost

# Get Usage Report for the Messages API

Copy page

Copy page

GET

/

v1

/

organizations

/

usage\_report

/

messages

cURL

cURL

Copy

```
curl "https://api.anthropic.com/v1/organizations/usage_report/messages\
?starting_at=2025-08-01T00:00:00Z\
&group_by[]=api_key_id\
&group_by[]=workspace_id\
&group_by[]=model\
&group_by[]=service_tier\
&group_by[]=context_window\
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
          "uncached_input_tokens": 1500,
          "cache_creation": {
            "ephemeral_1h_input_tokens": 1000,
            "ephemeral_5m_input_tokens": 500
          },
          "cache_read_input_tokens": 200,
          "output_tokens": 500,
          "server_tool_use": {
            "web_search_requests": 10
          },
          "api_key_id": "apikey_01Rj2N8SVvo6BePZj99NhmiT",
          "workspace_id": "wrkspc_01JwQvzr7rXLA5AGx3HKfFUJ",
          "model": "claude-sonnet-4-20250514",
          "service_tier": "standard",
          "context_window": "0-200k"
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

Maximum number of time buckets to return in the response.

The default and max limits depend on `bucket_width`: • `"1d"`: Default of 7 days, maximum of 31 days • `"1h"`: Default of 24 hours, maximum of 168 hours • `"1m"`: Default of 60 minutes, maximum of 1440 minutes

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

](#parameter-api-key-ids)

api\_key\_ids\[\]

string\[\] | null

Restrict usage returned to the specified API key ID(s).

Examples:

`"apikey_01Rj2N8SVvo6BePZj99NhmiT"`

[​

](#parameter-workspace-ids)

workspace\_ids\[\]

string\[\] | null

Restrict usage returned to the specified workspace ID(s).

Examples:

`"wrkspc_01JwQvzr7rXLA5AGx3HKfFUJ"`

[​

](#parameter-models)

models\[\]

string\[\] | null

Restrict usage returned to the specified model(s).

Examples:

`"claude-sonnet-4-20250514"`

`"claude-3-5-haiku-20241022"`

[​

](#parameter-service-tiers)

service\_tiers\[\]

enum<string>\[\] | null

Restrict usage returned to the specified service tier(s).

Show child attributes

Examples:

`"standard"`

`"batch"`

`"priority"`

[​

](#parameter-context-window)

context\_window\[\]

enum<string>\[\] | null

Restrict usage returned to the specified context window(s).

Show child attributes

Examples:

`"0-200k"`

`"200k-1M"`

[​

](#parameter-group-by)

group\_by\[\]

enum<string>\[\] | null

Group by any subset of the available options.

Show child attributes

Examples:

`"api_key_id"`

`"workspace_id"`

`"model"`

`"service_tier"`

`"context_window"`

[​

](#parameter-bucket-width)

bucket\_width

enum<string>

Time granularity of the response data.

Available options:

`1d`,

`1m`,

`1h`

#### Response

200

application/json

Successful Response

[​

](#response-data)

data

MessagesUsageReportTimeBucket · object\[\]

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

[Update API Keys](../apikeys/update-api-key.html)[Get Cost Report](get-cost-report.html)

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