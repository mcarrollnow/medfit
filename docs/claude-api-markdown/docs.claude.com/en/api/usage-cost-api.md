Usage and Cost API - Claude Docs 

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

Usage and Cost API

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

-   [Partner solutions](#partner-solutions)
-   [Quick start](#quick-start)
-   [Usage API](#usage-api)
-   [Key concepts](#key-concepts)
-   [Basic examples](#basic-examples)
-   [Daily usage by model](#daily-usage-by-model)
-   [Hourly usage with filtering](#hourly-usage-with-filtering)
-   [Filter usage by API keys and workspaces](#filter-usage-by-api-keys-and-workspaces)
-   [Time granularity limits](#time-granularity-limits)
-   [Cost API](#cost-api)
-   [Key concepts](#key-concepts-2)
-   [Basic example](#basic-example)
-   [Pagination](#pagination)
-   [Common use cases](#common-use-cases)
-   [Frequently asked questions](#frequently-asked-questions)
-   [How fresh is the data?](#how-fresh-is-the-data%3F)
-   [What’s the recommended polling frequency?](#what%E2%80%99s-the-recommended-polling-frequency%3F)
-   [How do I track code execution usage?](#how-do-i-track-code-execution-usage%3F)
-   [How do I track Priority Tier usage?](#how-do-i-track-priority-tier-usage%3F)
-   [What happens with Workbench usage?](#what-happens-with-workbench-usage%3F)
-   [How is the default workspace represented?](#how-is-the-default-workspace-represented%3F)
-   [How do I get per-user cost breakdowns for Claude Code?](#how-do-i-get-per-user-cost-breakdowns-for-claude-code%3F)
-   [See also](#see-also)

Using the Admin API

# Usage and Cost API

Copy page

Programmatically access your organization’s API usage and cost data with the Usage & Cost Admin API.

Copy page

**The Admin API is unavailable for individual accounts.** To collaborate with teammates and add members, set up your organization in **Console → Settings → Organization**.

The Usage & Cost Admin API provides programmatic and granular access to historical API usage and cost data for your organization. This data is similar to the information available in the [Usage](https://console.anthropic.com/usage) and [Cost](https://console.anthropic.com/cost) pages of the Claude Console. This API enables you to better monitor, analyze, and optimize your Claude implementations:

-   **Accurate Usage Tracking:** Get precise token counts and usage patterns instead of relying solely on response token counting
-   **Cost Reconciliation:** Match internal records with Anthropic billing for finance and accounting teams
-   **Product performance and improvement:** Monitor product performance while measuring if changes to the system have improved it, or setup alerting
-   **[Rate limit](rate-limits.html) and [Priority Tier](service-tiers.html#get-started-with-priority-tier) optimization:** Optimize features like [prompt caching](../docs/build-with-claude/prompt-caching.html) or specific prompts to make the most of one’s allocated capacity, or purchase dedicated capacity.
-   **Advanced Analysis:** Perform deeper data analysis than what’s available in Console

**Admin API key required**This API is part of the [Admin API](administration-api.html). These endpoints require an Admin API key (starting with `sk-ant-admin...`) that differs from standard API keys. Only organization members with the admin role can provision Admin API keys through the [Claude Console](https://console.anthropic.com/settings/admin-keys).

## 

[​

](#partner-solutions)

Partner solutions

Leading observability platforms offer ready-to-use integrations for monitoring your Claude API usage and cost, without writing custom code. These integrations provide dashboards, alerting, and analytics to help you manage your API usage effectively.

[

## Datadog

LLM Observability with automatic tracing and monitoring





](https://docs.datadoghq.com/integrations/anthropic/)[

## Grafana Cloud

Agentless integration for easy LLM observability with out-of-the-box dashboards and alerts





](https://grafana.com/docs/grafana-cloud/monitor-infrastructure/integrations/integration-reference/integration-anthropic/)[

## Honeycomb

Advanced querying and visualization through OpenTelemetry





](https://docs.honeycomb.io/integrations/anthropic-usage-monitoring/)

## 

[​

](#quick-start)

Quick start

Get your organization’s daily usage for the last 7 days:

Copy

```shellscript
curl "https://api.anthropic.com/v1/organizations/usage_report/messages?\
starting_at=2025-01-08T00:00:00Z&\
ending_at=2025-01-15T00:00:00Z&\
bucket_width=1d" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"
```

**Set a User-Agent header for integrations**If you’re building an integration, set your User-Agent header to help us understand usage patterns:

Copy

```text
User-Agent: YourApp/1.0.0 (https://yourapp.com)
```

## 

[​

](#usage-api)

Usage API

Track token consumption across your organization with detailed breakdowns by model, workspace, and service tier with the `/v1/organizations/usage_report/messages` endpoint.

### 

[​

](#key-concepts)

Key concepts

-   **Time buckets**: Aggregate usage data in fixed intervals (`1m`, `1h`, or `1d`)
-   **Token tracking**: Measure uncached input, cached input, cache creation, and output tokens
-   **Filtering & grouping**: Filter by API key, workspace, model, service tier, or context window, and group results by these dimensions
-   **Server tool usage**: Track usage of server-side tools like web search

For complete parameter details and response schemas, see the [Usage API reference](admin-api/usage-cost/get-messages-usage-report.html).

### 

[​

](#basic-examples)

Basic examples

#### 

[​

](#daily-usage-by-model)

Daily usage by model

Copy

```shellscript
curl "https://api.anthropic.com/v1/organizations/usage_report/messages?\
starting_at=2025-01-01T00:00:00Z&\
ending_at=2025-01-08T00:00:00Z&\
group_by[]=model&\
bucket_width=1d" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"
```

#### 

[​

](#hourly-usage-with-filtering)

Hourly usage with filtering

Copy

```shellscript
curl "https://api.anthropic.com/v1/organizations/usage_report/messages?\
starting_at=2025-01-15T00:00:00Z&\
ending_at=2025-01-15T23:59:59Z&\
models[]=claude-sonnet-4-5-20250929&\
service_tiers[]=batch&\
context_window[]=0-200k&\
bucket_width=1h" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"
```

#### 

[​

](#filter-usage-by-api-keys-and-workspaces)

Filter usage by API keys and workspaces

Copy

```shellscript
curl "https://api.anthropic.com/v1/organizations/usage_report/messages?\
starting_at=2025-01-01T00:00:00Z&\
ending_at=2025-01-08T00:00:00Z&\
api_key_ids[]=apikey_01Rj2N8SVvo6BePZj99NhmiT&\
api_key_ids[]=apikey_01ABC123DEF456GHI789JKL&\
workspace_ids[]=wrkspc_01JwQvzr7rXLA5AGx3HKfFUJ&\
workspace_ids[]=wrkspc_01XYZ789ABC123DEF456MNO&\
bucket_width=1d" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"
```

To retrieve your organization’s API key IDs, use the [List API Keys](admin-api/apikeys/list-api-keys.html) endpoint.To retrieve your organization’s workspace IDs, use the [List Workspaces](admin-api/workspaces/list-workspaces.html) endpoint, or find your organization’s workspace IDs in the Anthropic Console.

### 

[​

](#time-granularity-limits)

Time granularity limits

| Granularity | Default Limit | Maximum Limit | Use Case |
| --- | --- | --- | --- |
| `1m` | 60 buckets | 1440 buckets | Real-time monitoring |
| `1h` | 24 buckets | 168 buckets | Daily patterns |
| `1d` | 7 buckets | 31 buckets | Weekly/monthly reports |

## 

[​

](#cost-api)

Cost API

Retrieve service-level cost breakdowns in USD with the `/v1/organizations/cost_report` endpoint.

### 

[​

](#key-concepts-2)

Key concepts

-   **Currency**: All costs in USD, reported as decimal strings in lowest units (cents)
-   **Cost types**: Track token usage, web search, and code execution costs
-   **Grouping**: Group costs by workspace or description for detailed breakdowns
-   **Time buckets**: Daily granularity only (`1d`)

For complete parameter details and response schemas, see the [Cost API reference](admin-api/usage-cost/get-cost-report.html).

Priority Tier costs use a different billing model and are not included in the cost endpoint. Track Priority Tier usage through the usage endpoint instead.

### 

[​

](#basic-example)

Basic example

Copy

```shellscript
curl "https://api.anthropic.com/v1/organizations/cost_report?\
starting_at=2025-01-01T00:00:00Z&\
ending_at=2025-01-31T00:00:00Z&\
group_by[]=workspace_id&\
group_by[]=description" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"
```

## 

[​

](#pagination)

Pagination

Both endpoints support pagination for large datasets:

1.  Make your initial request
2.  If `has_more` is `true`, use the `next_page` value in your next request
3.  Continue until `has_more` is `false`

Copy

```shellscript
# First request
curl "https://api.anthropic.com/v1/organizations/usage_report/messages?\
starting_at=2025-01-01T00:00:00Z&\
ending_at=2025-01-31T00:00:00Z&\
limit=7" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"

# Response includes: "has_more": true, "next_page": "page_xyz..."

# Next request with pagination
curl "https://api.anthropic.com/v1/organizations/usage_report/messages?\
starting_at=2025-01-01T00:00:00Z&\
ending_at=2025-01-31T00:00:00Z&\
limit=7&\
page=page_xyz..." \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"
```

## 

[​

](#common-use-cases)

Common use cases

Explore detailed implementations in [anthropic-cookbook](https://github.com/anthropics/anthropic-cookbook):

-   **Daily usage reports**: Track token consumption trends
-   **Cost attribution**: Allocate expenses by workspace for chargebacks
-   **Cache efficiency**: Measure and optimize prompt caching
-   **Budget monitoring**: Set up alerts for spending thresholds
-   **CSV export**: Generate reports for finance teams

## 

[​

](#frequently-asked-questions)

Frequently asked questions

### 

[​

](#how-fresh-is-the-data%3F)

How fresh is the data?

Usage and cost data typically appears within 5 minutes of API request completion, though delays may occasionally be longer.

### 

[​

](#what%E2%80%99s-the-recommended-polling-frequency%3F)

What’s the recommended polling frequency?

The API supports polling once per minute for sustained use. For short bursts (e.g., downloading paginated data), more frequent polling is acceptable. Cache results for dashboards that need frequent updates.

### 

[​

](#how-do-i-track-code-execution-usage%3F)

How do I track code execution usage?

Code execution costs appear in the cost endpoint grouped under `Code Execution Usage` in the description field. Code execution is not included in the usage endpoint.

### 

[​

](#how-do-i-track-priority-tier-usage%3F)

How do I track Priority Tier usage?

Filter or group by `service_tier` in the usage endpoint and look for the `priority` value. Priority Tier costs are not available in the cost endpoint.

### 

[​

](#what-happens-with-workbench-usage%3F)

What happens with Workbench usage?

API usage from the Workbench is not associated with an API key, so `api_key_id` will be `null` even when grouping by that dimension.

### 

[​

](#how-is-the-default-workspace-represented%3F)

How is the default workspace represented?

Usage and costs attributed to the default workspace have a `null` value for `workspace_id`.

### 

[​

](#how-do-i-get-per-user-cost-breakdowns-for-claude-code%3F)

How do I get per-user cost breakdowns for Claude Code?

Use the [Claude Code Analytics API](claude-code-analytics-api.html), which provides per-user estimated costs and productivity metrics without the performance limitations of breaking down costs by many API keys. For general API usage with many keys, use the [Usage API](#usage-api) to track token consumption as a cost proxy.

## 

[​

](#see-also)

See also

The Usage and Cost APIs can be used to help you deliver a better experience for your users, help you manage costs, and preserve your rate limit. Learn more about some of these other features:

-   [Admin API overview](administration-api.html)
-   [Admin API reference](admin-api/organization/get-me.html)
-   [Pricing](../docs/about-claude/pricing.html)
-   [Prompt caching](../docs/build-with-claude/prompt-caching.html) - Optimize costs with caching
-   [Batch processing](../docs/build-with-claude/batch-processing.html) - 50% discount on batch requests
-   [Rate limits](rate-limits.html) - Understand usage tiers

Was this page helpful?

YesNo

[Admin API overview](administration-api.html)[Claude Code Analytics API](claude-code-analytics-api.html)

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