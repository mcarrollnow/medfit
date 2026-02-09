Admin API overview - Claude Docs 

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

Using the Admin API

Admin API overview

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

-   [How the Admin API works](#how-the-admin-api-works)
-   [Organization roles and permissions](#organization-roles-and-permissions)
-   [Key concepts](#key-concepts)
-   [Organization Members](#organization-members)
-   [Organization Invites](#organization-invites)
-   [Workspaces](#workspaces)
-   [Workspace Members](#workspace-members)
-   [API Keys](#api-keys)
-   [Accessing organization info](#accessing-organization-info)
-   [Accessing usage and cost reports](#accessing-usage-and-cost-reports)
-   [Accessing Claude Code analytics](#accessing-claude-code-analytics)
-   [Best practices](#best-practices)
-   [FAQ](#faq)

Using the Admin API

# Admin API overview

Copy page

Copy page

**The Admin API is unavailable for individual accounts.** To collaborate with teammates and add members, set up your organization in **Console → Settings → Organization**.

The [Admin API](admin-api/organization/get-me.html) allows you to programmatically manage your organization’s resources, including organization members, workspaces, and API keys. This provides programmatic control over administrative tasks that would otherwise require manual configuration in the [Claude Console](https://console.anthropic.com).

**The Admin API requires special access**The Admin API requires a special Admin API key (starting with `sk-ant-admin...`) that differs from standard API keys. Only organization members with the admin role can provision Admin API keys through the Claude Console.

## 

[​

](#how-the-admin-api-works)

How the Admin API works

When you use the Admin API:

1.  You make requests using your Admin API key in the `x-api-key` header
2.  The API allows you to manage:
    -   Organization members and their roles
    -   Organization member invites
    -   Workspaces and their members
    -   API keys

This is useful for:

-   Automating user onboarding/offboarding
-   Programmatically managing workspace access
-   Monitoring and managing API key usage

## 

[​

](#organization-roles-and-permissions)

Organization roles and permissions

There are five organization-level roles. See more details [here](https://support.claude.com/en/articles/10186004-api-console-roles-and-permissions).

| Role | Permissions |
| --- | --- |
| user | Can use Workbench |
| claude\_code\_user | Can use Workbench and [Claude Code](../docs/claude-code/overview.html) |
| developer | Can use Workbench and manage API keys |
| billing | Can use Workbench and manage billing details |
| admin | Can do all of the above, plus manage users |

## 

[​

](#key-concepts)

Key concepts

### 

[​

](#organization-members)

Organization Members

You can list [organization members](admin-api/users/get-user.html), update member roles, and remove members.

Shell

Copy

```shellscript
# List organization members
curl "https://api.anthropic.com/v1/organizations/users?limit=10" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"

# Update member role
curl "https://api.anthropic.com/v1/organizations/users/{user_id}" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY" \
  --data '{"role": "developer"}'

# Remove member
curl --request DELETE "https://api.anthropic.com/v1/organizations/users/{user_id}" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"
```

### 

[​

](#organization-invites)

Organization Invites

You can invite users to organizations and manage those [invites](admin-api/invites/get-invite.html).

Shell

Copy

```shellscript
# Create invite
curl --request POST "https://api.anthropic.com/v1/organizations/invites" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY" \
  --data '{
    "email": "[email protected]",
    "role": "developer"
  }'

# List invites
curl "https://api.anthropic.com/v1/organizations/invites?limit=10" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"

# Delete invite
curl --request DELETE "https://api.anthropic.com/v1/organizations/invites/{invite_id}" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"
```

### 

[​

](#workspaces)

Workspaces

Create and manage [workspaces](admin-api/workspaces/get-workspace.html) ([console](https://console.anthropic.com/settings/workspaces)) to organize your resources:

Shell

Copy

```shellscript
# Create workspace
curl --request POST "https://api.anthropic.com/v1/organizations/workspaces" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY" \
  --data '{"name": "Production"}'

# List workspaces
curl "https://api.anthropic.com/v1/organizations/workspaces?limit=10&include_archived=false" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"

# Archive workspace
curl --request POST "https://api.anthropic.com/v1/organizations/workspaces/{workspace_id}/archive" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"
```

### 

[​

](#workspace-members)

Workspace Members

Manage [user access to specific workspaces](admin-api/workspace_members/get-workspace-member.html):

Shell

Copy

```shellscript
# Add member to workspace
curl --request POST "https://api.anthropic.com/v1/organizations/workspaces/{workspace_id}/members" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY" \
  --data '{
    "user_id": "user_xxx",
    "workspace_role": "workspace_developer"
  }'

# List workspace members
curl "https://api.anthropic.com/v1/organizations/workspaces/{workspace_id}/members?limit=10" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"

# Update member role
curl --request POST "https://api.anthropic.com/v1/organizations/workspaces/{workspace_id}/members/{user_id}" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY" \
  --data '{
    "workspace_role": "workspace_admin"
  }'

# Remove member from workspace
curl --request DELETE "https://api.anthropic.com/v1/organizations/workspaces/{workspace_id}/members/{user_id}" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"
```

### 

[​

](#api-keys)

API Keys

Monitor and manage [API keys](admin-api/apikeys/get-api-key.html):

Shell

Copy

```shellscript
# List API keys
curl "https://api.anthropic.com/v1/organizations/api_keys?limit=10&status=active&workspace_id=wrkspc_xxx" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"

# Update API key
curl --request POST "https://api.anthropic.com/v1/organizations/api_keys/{api_key_id}" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY" \
  --data '{
    "status": "inactive",
    "name": "New Key Name"
  }'
```

## 

[​

](#accessing-organization-info)

Accessing organization info

Get information about your organization programmatically with the `/v1/organizations/me` endpoint. For example:

Copy

```shellscript
curl "https://api.anthropic.com/v1/organizations/me" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"
```

Copy

```json
{
  "id": "12345678-1234-5678-1234-567812345678",
  "type": "organization",
  "name": "Organization Name"
}
```

This endpoint is useful for programmatically determining which organization an Admin API key belongs to. For complete parameter details and response schemas, see the [Organization Info API reference](admin-api/organization/get-me.html).

## 

[​

](#accessing-usage-and-cost-reports)

Accessing usage and cost reports

To access usage and cost reports for your organization, use the Usage and Cost API endpoints:

-   The [**Usage endpoint**](usage-cost-api.html#usage-api) (`/v1/organizations/usage_report/messages`) provides detailed usage data, including token counts and request metrics, grouped by various dimensions such as workspace, user, and model.
-   The [**Cost endpoint**](usage-cost-api.html#cost-api) (`/v1/organizations/cost_report`) provides cost data associated with your organization’s usage, allowing you to track expenses and allocate costs by workspace or description.

These endpoints provide detailed insights into your organization’s usage and associated costs.

## 

[​

](#accessing-claude-code-analytics)

Accessing Claude Code analytics

For organizations using Claude Code, the [**Claude Code Analytics API**](claude-code-analytics-api.html) provides detailed productivity metrics and usage insights:

-   The [**Claude Code Analytics endpoint**](claude-code-analytics-api.html) (`/v1/organizations/usage_report/claude_code`) provides daily aggregated metrics for Claude Code usage, including sessions, lines of code, commits, pull requests, tool usage statistics, and cost data broken down by user and model.

This API enables you to track developer productivity, analyze Claude Code adoption, and build custom dashboards for your organization.

## 

[​

](#best-practices)

Best practices

To effectively use the Admin API:

-   Use meaningful names and descriptions for workspaces and API keys
-   Implement proper error handling for failed operations
-   Regularly audit member roles and permissions
-   Clean up unused workspaces and expired invites
-   Monitor API key usage and rotate keys periodically

## 

[​

](#faq)

FAQ

What permissions are needed to use the Admin API?

Only organization members with the admin role can use the Admin API. They must also have a special Admin API key (starting with `sk-ant-admin`).

Can I create new API keys through the Admin API?

No, new API keys can only be created through the Claude Console for security reasons. The Admin API can only manage existing API keys.

What happens to API keys when removing a user?

API keys persist in their current state as they are scoped to the Organization, not to individual users.

Can organization admins be removed via the API?

No, organization members with the admin role cannot be removed via the API for security reasons.

How long do organization invites last?

Organization invites expire after 21 days. There is currently no way to modify this expiration period.

Are there limits on workspaces?

Yes, you can have a maximum of 100 workspaces per Organization. Archived workspaces do not count towards this limit.

What's the Default Workspace?

Every Organization has a “Default Workspace” that cannot be edited or removed, and has no ID. This Workspace does not appear in workspace list endpoints.

How do organization roles affect Workspace access?

Organization admins automatically get the `workspace_admin` role to all workspaces. Organization billing members automatically get the `workspace_billing` role. Organization users and developers must be manually added to each workspace.

Which roles can be assigned in workspaces?

Organization users and developers can be assigned `workspace_admin`, `workspace_developer`, or `workspace_user` roles. The `workspace_billing` role can’t be manually assigned - it’s inherited from having the organization `billing` role.

Can organization admin or billing members' workspace roles be changed?

Only organization billing members can have their workspace role upgraded to an admin role. Otherwise, organization admins and billing members can’t have their workspace roles changed or be removed from workspaces while they hold those organization roles. Their workspace access must be modified by changing their organization role first.

What happens to workspace access when organization roles change?

If an organization admin or billing member is demoted to user or developer, they lose access to all workspaces except ones where they were manually assigned roles. When users are promoted to admin or billing roles, they gain automatic access to all workspaces.

Was this page helpful?

YesNo

[Vertex AI API](claude-on-vertex-ai.html)[Usage and Cost API](usage-cost-api.html)

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