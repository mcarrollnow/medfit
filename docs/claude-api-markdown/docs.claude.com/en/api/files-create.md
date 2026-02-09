Create a File - Claude Docs 

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

Files

Create a File

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
    
    -   [POST
        
        Create a File
        
        
        
        ](files-create.html)
    -   [GET
        
        List Files
        
        
        
        ](files-list.html)
    -   [GET
        
        Get File Metadata
        
        
        
        ](files-metadata.html)
    -   [GET
        
        Download a File
        
        
        
        ](files-content.html)
    -   [DEL
        
        Delete a File
        
        
        
        ](files-delete.html)
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

 

cURL

cURL

Copy

```
curl -X POST "https://api.anthropic.com/v1/files" \
     -H "x-api-key: $ANTHROPIC_API_KEY" \
     -H "anthropic-version: 2023-06-01" \
     -H "anthropic-beta: files-api-2025-04-14" \
     -F "file=@/path/to/document.pdf"
```

200

4XX

Copy

```
{
  "created_at": "2023-11-07T05:31:56Z",
  "downloadable": false,
  "filename": "<string>",
  "id": "<string>",
  "mime_type": "<string>",
  "size_bytes": 1,
  "type": "file"
}
```

Files

# Create a File

Copy page

Upload a file

Copy page

POST

/

v1

/

files

cURL

cURL

Copy

```
curl -X POST "https://api.anthropic.com/v1/files" \
     -H "x-api-key: $ANTHROPIC_API_KEY" \
     -H "anthropic-version: 2023-06-01" \
     -H "anthropic-beta: files-api-2025-04-14" \
     -F "file=@/path/to/document.pdf"
```

200

4XX

Copy

```
{
  "created_at": "2023-11-07T05:31:56Z",
  "downloadable": false,
  "filename": "<string>",
  "id": "<string>",
  "mime_type": "<string>",
  "size_bytes": 1,
  "type": "file"
}
```

The Files API allows you to upload and manage files to use with the Claude API without having to re-upload content with each request. For more information about the Files API, see the [developer guide for files](../docs/build-with-claude/files.html).

The Files API is currently in beta. To use the Files API, you’ll need to include the beta feature header: `anthropic-beta: files-api-2025-04-14`.Please reach out through our [feedback form](https://forms.gle/tisHyierGwgN4DUE9) to share your experience with the Files API.

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

Read more about versioning and our version history [here](versioning.html).

[​

](#parameter-x-api-key)

x-api-key

string

required

Your unique API key for authentication.

This key is required in the header of all API requests, to authenticate your account and access Anthropic's services. Get your API key through the [Console](https://console.anthropic.com/settings/keys). Each key is scoped to a Workspace.

#### Body

multipart/form-data

[​

](#body-file)

file

file

required

The file to upload

#### Response

200

application/json

Successful Response

[​

](#response-created-at)

created\_at

string<date-time>

required

RFC 3339 datetime string representing when the file was created.

[​

](#response-filename)

filename

string

required

Original filename of the uploaded file.

Required string length: `1 - 500`

[​

](#response-id)

id

string

required

Unique object identifier.

The format and length of IDs may change over time.

[​

](#response-mime-type)

mime\_type

string

required

MIME type of the file.

Required string length: `1 - 255`

[​

](#response-size-bytes)

size\_bytes

integer

required

Size of the file in bytes.

Required range: `x >= 0`

[​

](#response-type)

type

enum<string>

required

Object type.

For files, this is always `"file"`.

Available options:

| Title | Const |
| --- | --- |
| Type | `file` |

[​

](#response-downloadable)

downloadable

boolean

default:false

Whether the file can be downloaded.

Was this page helpful?

YesNo

[Delete a Message Batch](deleting-message-batches.html)[List Files](files-list.html)

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