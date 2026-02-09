List Skill Versions - Claude Docs 

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

Skill Versions

List Skill Versions

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
    
    -   [
        
        Using Skills
        
        
        
        ](../skills-guide.html)
    -   Skill Management
        
    -   Skill Versions
        
        -   [POST
            
            Create Skill Version
            
            
            
            ](create-skill-version.html)
        -   [GET
            
            List Skill Versions
            
            
            
            ](list-skill-versions.html)
        -   [GET
            
            Get Skill Version
            
            
            
            ](get-skill-version.html)
        -   [DEL
            
            Delete Skill Version
            
            
            
            ](delete-skill-version.html)
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

 

cURL

cURL

Copy

```
curl "https://api.anthropic.com/v1/skills/skill_01AbCdEfGhIjKlMnOpQrStUv/versions" \
     -H "x-api-key: $ANTHROPIC_API_KEY" \
     -H "anthropic-version: 2023-06-01" \
     -H "anthropic-beta: skills-2025-10-02"
```

200

4XX

Copy

```
{
  "data": [
    {
      "created_at": "2024-10-30T23:58:27.427722Z",
      "description": "A custom skill for doing something useful",
      "directory": "my-skill",
      "id": "skillver_01JAbcdefghijklmnopqrstuvw",
      "name": "my-skill",
      "skill_id": "skill_01JAbcdefghijklmnopqrstuvw",
      "type": "skill_version",
      "version": "1759178010641129"
    }
  ],
  "has_more": true,
  "next_page": "page_MjAyNS0wNS0xNFQwMDowMDowMFo="
}
```

Skill Versions

# List Skill Versions

Copy page

Copy page

GET

/

v1

/

skills

/

{skill\_id}

/

versions

cURL

cURL

Copy

```
curl "https://api.anthropic.com/v1/skills/skill_01AbCdEfGhIjKlMnOpQrStUv/versions" \
     -H "x-api-key: $ANTHROPIC_API_KEY" \
     -H "anthropic-version: 2023-06-01" \
     -H "anthropic-beta: skills-2025-10-02"
```

200

4XX

Copy

```
{
  "data": [
    {
      "created_at": "2024-10-30T23:58:27.427722Z",
      "description": "A custom skill for doing something useful",
      "directory": "my-skill",
      "id": "skillver_01JAbcdefghijklmnopqrstuvw",
      "name": "my-skill",
      "skill_id": "skill_01JAbcdefghijklmnopqrstuvw",
      "type": "skill_version",
      "version": "1759178010641129"
    }
  ],
  "has_more": true,
  "next_page": "page_MjAyNS0wNS0xNFQwMDowMDowMFo="
}
```

#### Headers

[​

](#parameter-anthropic-beta)

anthropic-beta

string\[\]

Optional header to specify the beta version(s) you want to use.

To use multiple betas, use a comma separated list like `beta1,beta2` or specify the header multiple times for each beta.

[​

](#parameter-anthropic-version)

anthropic-version

string

required

The version of the Claude API you want to use.

Read more about versioning and our version history [here](../versioning.html).

[​

](#parameter-x-api-key)

x-api-key

string

required

Your unique API key for authentication.

This key is required in the header of all API requests, to authenticate your account and access Anthropic's services. Get your API key through the [Console](https://console.anthropic.com/settings/keys). Each key is scoped to a Workspace.

#### Path Parameters

[​

](#parameter-skill-id)

skill\_id

string

required

Unique identifier for the skill.

The format and length of IDs may change over time.

#### Query Parameters

[​

](#parameter-page)

page

string | null

Optionally set to the `next_page` token from the previous response.

[​

](#parameter-limit)

limit

integer | null

Number of items to return per page.

Defaults to `20`. Ranges from `1` to `1000`.

#### Response

200

application/json

Successful Response

[​

](#response-data)

data

SkillVersion · object\[\]

required

List of skill versions.

Show child attributes

[​

](#response-has-more)

has\_more

boolean

required

Indicates if there are more results in the requested page direction.

[​

](#response-next-page)

next\_page

string | null

required

Token to provide in as `page` in the subsequent request to retrieve the next page of data.

Examples:

`"page_MjAyNS0wNS0xNFQwMDowMDowMFo="`

`null`

Was this page helpful?

YesNo

[Create Skill Version](create-skill-version.html)[Get Skill Version](get-skill-version.html)

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