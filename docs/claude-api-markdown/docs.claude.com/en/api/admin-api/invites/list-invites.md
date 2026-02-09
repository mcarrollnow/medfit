List Invites - Claude Docs 

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

Organization Invites

List Invites

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
        
        -   [GET
            
            Get Invite
            
            
            
            ](get-invite.html)
        -   [GET
            
            List Invites
            
            
            
            ](list-invites.html)
        -   [POST
            
            Create Invite
            
            
            
            ](create-invite.html)
        -   [DEL
            
            Delete Invite
            
            
            
            ](delete-invite.html)
    -   Workspace Management
        
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
curl https://api.anthropic.com/v1/organizations/invites \
     --header "x-api-key: $ANTHROPIC_ADMIN_KEY" \
     --header "anthropic-version: 2023-06-01"
```

200

4XX

Copy

```
{
  "data": [
    {
      "email": "[email protected]",
      "expires_at": "2024-11-20T23:58:27.427722Z",
      "id": "invite_015gWxCN9Hfg2QhZwTK7Mdeu",
      "invited_at": "2024-10-30T23:58:27.427722Z",
      "role": "user",
      "status": "pending",
      "type": "invite"
    }
  ],
  "first_id": "<string>",
  "has_more": true,
  "last_id": "<string>"
}
```

Organization Invites

# List Invites

Copy page

Copy page

GET

/

v1

/

organizations

/

invites

cURL

cURL

Copy

```
curl https://api.anthropic.com/v1/organizations/invites \
     --header "x-api-key: $ANTHROPIC_ADMIN_KEY" \
     --header "anthropic-version: 2023-06-01"
```

200

4XX

Copy

```
{
  "data": [
    {
      "email": "[email protected]",
      "expires_at": "2024-11-20T23:58:27.427722Z",
      "id": "invite_015gWxCN9Hfg2QhZwTK7Mdeu",
      "invited_at": "2024-10-30T23:58:27.427722Z",
      "role": "user",
      "status": "pending",
      "type": "invite"
    }
  ],
  "first_id": "<string>",
  "has_more": true,
  "last_id": "<string>"
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

](#parameter-before-id)

before\_id

string

ID of the object to use as a cursor for pagination. When provided, returns the page of results immediately before this object.

[​

](#parameter-after-id)

after\_id

string

ID of the object to use as a cursor for pagination. When provided, returns the page of results immediately after this object.

[​

](#parameter-limit)

limit

integer

default:20

Number of items to return per page.

Defaults to `20`. Ranges from `1` to `1000`.

Required range: `1 <= x <= 1000`

#### Response

200

application/json

Successful Response

[​

](#response-data)

data

InviteSchema · object\[\]

required

Show child attributes

[​

](#response-first-id)

first\_id

string | null

required

First ID in the `data` list. Can be used as the `before_id` for the previous page.

[​

](#response-has-more)

has\_more

boolean

required

Indicates if there are more results in the requested page direction.

[​

](#response-last-id)

last\_id

string | null

required

Last ID in the `data` list. Can be used as the `after_id` for the next page.

Was this page helpful?

YesNo

[Get Invite](get-invite.html)[Create Invite](create-invite.html)

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