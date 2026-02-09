Archive Workspace - Claude Docs 

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

Workspace Management

Archive Workspace

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
        
        -   [GET
            
            Get Workspace
            
            
            
            ](get-workspace.html)
        -   [GET
            
            List Workspaces
            
            
            
            ](list-workspaces.html)
        -   [POST
            
            Update Workspace
            
            
            
            ](update-workspace.html)
        -   [POST
            
            Create Workspace
            
            
            
            ](create-workspace.html)
        -   [POST
            
            Archive Workspace
            
            
            
            ](archive-workspace.html)
    -   Workspace Member Management
        
    -   API Keys
        
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
curl --request POST "https://api.anthropic.com/v1/organizations/workspaces/wrkspc_01JwQvzr7rXLA5AGx3HKfFUJ/archive" \
  --header "anthropic-version: 2023-06-01" \
  --header "content-type: application/json" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"
```

200

4XX

Copy

```
{
  "archived_at": "2024-11-01T23:59:27.427722Z",
  "created_at": "2024-10-30T23:58:27.427722Z",
  "display_color": "#6C5BB9",
  "id": "wrkspc_01JwQvzr7rXLA5AGx3HKfFUJ",
  "name": "Workspace Name",
  "type": "workspace"
}
```

Workspace Management

# Archive Workspace

Copy page

Copy page

POST

/

v1

/

organizations

/

workspaces

/

{workspace\_id}

/

archive

cURL

cURL

Copy

```
curl --request POST "https://api.anthropic.com/v1/organizations/workspaces/wrkspc_01JwQvzr7rXLA5AGx3HKfFUJ/archive" \
  --header "anthropic-version: 2023-06-01" \
  --header "content-type: application/json" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"
```

200

4XX

Copy

```
{
  "archived_at": "2024-11-01T23:59:27.427722Z",
  "created_at": "2024-10-30T23:58:27.427722Z",
  "display_color": "#6C5BB9",
  "id": "wrkspc_01JwQvzr7rXLA5AGx3HKfFUJ",
  "name": "Workspace Name",
  "type": "workspace"
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

](#parameter-workspace-id)

workspace\_id

string

required

ID of the Workspace.

#### Response

200

application/json

Successful Response

[​

](#response-archived-at)

archived\_at

string<date-time> | null

required

RFC 3339 datetime string indicating when the Workspace was archived, or null if the Workspace is not archived.

Examples:

`"2024-11-01T23:59:27.427722Z"`

[​

](#response-created-at)

created\_at

string<date-time>

required

RFC 3339 datetime string indicating when the Workspace was created.

Examples:

`"2024-10-30T23:58:27.427722Z"`

[​

](#response-display-color)

display\_color

string

required

Hex color code representing the Workspace in the Anthropic Console.

Examples:

`"#6C5BB9"`

[​

](#response-id)

id

string

required

ID of the Workspace.

Examples:

`"wrkspc_01JwQvzr7rXLA5AGx3HKfFUJ"`

[​

](#response-name)

name

string

required

Name of the Workspace.

Examples:

`"Workspace Name"`

[​

](#response-type)

type

enum<string>

default:workspace

required

Object type.

For Workspaces, this is always `"workspace"`.

Available options:

| Title | Const |
| --- | --- |
| Type | `workspace` |

Was this page helpful?

YesNo

[Create Workspace](create-workspace.html)[Get Workspace Member](../workspace_members/get-workspace-member.html)

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