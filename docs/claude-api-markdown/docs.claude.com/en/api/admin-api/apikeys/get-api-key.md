Get API Key - Claude Docs 

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

API Keys

Get API Key

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
        
        -   [GET
            
            Get API Key
            
            
            
            ](get-api-key.html)
        -   [GET
            
            List API Keys
            
            
            
            ](list-api-keys.html)
        -   [POST
            
            Update API Keys
            
            
            
            ](update-api-key.html)
    -   Usage and Cost
        
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
curl "https://api.anthropic.com/v1/organizations/api_keys/apikey_01Rj2N8SVvo6BePZj99NhmiT" \
  --header "anthropic-version: 2023-06-01" \
  --header "content-type: application/json" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"
```

200

4XX

Copy

```
{
  "created_at": "2024-10-30T23:58:27.427722Z",
  "created_by": {
    "id": "user_01WCz1FkmYMm4gnmykNKUu3Q",
    "type": "user"
  },
  "id": "apikey_01Rj2N8SVvo6BePZj99NhmiT",
  "name": "Developer Key",
  "partial_key_hint": "sk-ant-api03-R2D...igAA",
  "status": "active",
  "type": "api_key",
  "workspace_id": "wrkspc_01JwQvzr7rXLA5AGx3HKfFUJ"
}
```

API Keys

# Get API Key

Copy page

Copy page

GET

/

v1

/

organizations

/

api\_keys

/

{api\_key\_id}

cURL

cURL

Copy

```
curl "https://api.anthropic.com/v1/organizations/api_keys/apikey_01Rj2N8SVvo6BePZj99NhmiT" \
  --header "anthropic-version: 2023-06-01" \
  --header "content-type: application/json" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"
```

200

4XX

Copy

```
{
  "created_at": "2024-10-30T23:58:27.427722Z",
  "created_by": {
    "id": "user_01WCz1FkmYMm4gnmykNKUu3Q",
    "type": "user"
  },
  "id": "apikey_01Rj2N8SVvo6BePZj99NhmiT",
  "name": "Developer Key",
  "partial_key_hint": "sk-ant-api03-R2D...igAA",
  "status": "active",
  "type": "api_key",
  "workspace_id": "wrkspc_01JwQvzr7rXLA5AGx3HKfFUJ"
}
```

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

#### Path Parameters

[​

](#parameter-api-key-id)

api\_key\_id

string

required

ID of the API key.

#### Response

200

application/json

Successful Response

[​

](#response-created-at)

created\_at

string<date-time>

required

RFC 3339 datetime string indicating when the API Key was created.

Examples:

`"2024-10-30T23:58:27.427722Z"`

[​

](#response-created-by)

created\_by

object

required

The ID and type of the actor that created the API key.

Show child attributes

[​

](#response-id)

id

string

required

ID of the API key.

Examples:

`"apikey_01Rj2N8SVvo6BePZj99NhmiT"`

[​

](#response-name)

name

string

required

Name of the API key.

Examples:

`"Developer Key"`

[​

](#response-partial-key-hint)

partial\_key\_hint

string | null

required

Partially redacted hint for the API key.

Examples:

`"sk-ant-api03-R2D...igAA"`

[​

](#response-status)

status

enum<string>

required

Status of the API key.

Available options:

`active`,

`inactive`,

`archived`

Examples:

`"active"`

[​

](#response-type)

type

enum<string>

default:api\_key

required

Object type.

For API Keys, this is always `"api_key"`.

Available options:

| Title | Const |
| --- | --- |
| Type | `api_key` |

[​

](#response-workspace-id)

workspace\_id

string | null

required

ID of the Workspace associated with the API key, or null if the API key belongs to the default Workspace.

Examples:

`"wrkspc_01JwQvzr7rXLA5AGx3HKfFUJ"`

Was this page helpful?

YesNo

[Delete Workspace Member](../workspace_members/delete-workspace-member.html)[List API Keys](list-api-keys.html)

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