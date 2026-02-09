Custom Tools - Claude Docs 

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

Guides

Custom Tools

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
    
    -   [
        
        Migrate to Claude Agent SDK
        
        
        
        ](../../docs/claude-code/sdk/migration-guide.html)
    -   [
        
        Overview
        
        
        
        ](overview.html)
    -   [
        
        TypeScript SDK
        
        
        
        ](typescript.html)
    -   [
        
        Python SDK
        
        
        
        ](python.html)
    -   Guides
        
        -   [
            
            Streaming Input
            
            
            
            ](streaming-vs-single-mode.html)
        -   [
            
            Handling Permissions
            
            
            
            ](permissions.html)
        -   [
            
            Session Management
            
            
            
            ](sessions.html)
        -   [
            
            Hosting the Agent SDK
            
            
            
            ](hosting.html)
        -   [
            
            Modifying system prompts
            
            
            
            ](modifying-system-prompts.html)
        -   [
            
            MCP in the SDK
            
            
            
            ](mcp.html)
        -   [
            
            Custom Tools
            
            
            
            ](custom-tools.html)
        -   [
            
            Subagents in the SDK
            
            
            
            ](subagents.html)
        -   [
            
            Slash Commands in the SDK
            
            
            
            ](slash-commands.html)
        -   [
            
            Tracking Costs and Usage
            
            
            
            ](cost-tracking.html)
        -   [
            
            Todo Lists
            
            
            
            ](todo-tracking.html)

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

 

On this page

-   [Creating Custom Tools](#creating-custom-tools)
-   [Using Custom Tools](#using-custom-tools)
-   [Tool Name Format](#tool-name-format)
-   [Configuring Allowed Tools](#configuring-allowed-tools)
-   [Multiple Tools Example](#multiple-tools-example)
-   [Type Safety with Python](#type-safety-with-python)
-   [Error Handling](#error-handling)
-   [Example Tools](#example-tools)
-   [Database Query Tool](#database-query-tool)
-   [API Gateway Tool](#api-gateway-tool)
-   [Calculator Tool](#calculator-tool)
-   [Related Documentation](#related-documentation)

Guides

# Custom Tools

Copy page

Build and integrate custom tools to extend Claude Agent SDK functionality

Copy page

Custom tools allow you to extend Claude Code’s capabilities with your own functionality through in-process MCP servers, enabling Claude to interact with external services, APIs, or perform specialized operations.

## 

[​

](#creating-custom-tools)

Creating Custom Tools

Use the `createSdkMcpServer` and `tool` helper functions to define type-safe custom tools:

TypeScript

Python

Copy

```typescript
import { query, tool, createSdkMcpServer } from "@anthropic-ai/claude-agent-sdk";
import { z } from "zod";

// Create an SDK MCP server with custom tools
const customServer = createSdkMcpServer({
  name: "my-custom-tools",
  version: "1.0.0",
  tools: [
    tool(
      "get_weather",
      "Get current weather for a location",
      {
        location: z.string().describe("City name or coordinates"),
        units: z.enum(["celsius", "fahrenheit"]).default("celsius").describe("Temperature units")
      },
      async (args) => {
        // Call weather API
        const response = await fetch(
          `https://api.weather.com/v1/current?q=${args.location}&units=${args.units}`
        );
        const data = await response.json();
        
        return {
          content: [{
            type: "text",
            text: `Temperature: ${data.temp}°\nConditions: ${data.conditions}\nHumidity: ${data.humidity}%`
          }]
        };
      }
    )
  ]
});
```

## 

[​

](#using-custom-tools)

Using Custom Tools

Pass the custom server to the `query` function via the `mcpServers` option as a dictionary/object.

**Important:** Custom MCP tools require streaming input mode. You must use an async generator/iterable for the `prompt` parameter - a simple string will not work with MCP servers.

### 

[​

](#tool-name-format)

Tool Name Format

When MCP tools are exposed to Claude, their names follow a specific format:

-   Pattern: `mcp__{server_name}__{tool_name}`
-   Example: A tool named `get_weather` in server `my-custom-tools` becomes `mcp__my-custom-tools__get_weather`

### 

[​

](#configuring-allowed-tools)

Configuring Allowed Tools

You can control which tools Claude can use via the `allowedTools` option:

TypeScript

Python

Copy

```typescript
import { query } from "@anthropic-ai/claude-code";

// Use the custom tools in your query with streaming input
async function* generateMessages() {
  yield {
    type: "user" as const,
    message: {
      role: "user" as const,
      content: "What's the weather in San Francisco?"
    }
  };
}

for await (const message of query({
  prompt: generateMessages(),  // Use async generator for streaming input
  options: {
    mcpServers: {
      "my-custom-tools": customServer  // Pass as object/dictionary, not array
    },
    // Optionally specify which tools Claude can use
    allowedTools: [
      "mcp__my-custom-tools__get_weather",  // Allow the weather tool
      // Add other tools as needed
    ],
    maxTurns: 3
  }
})) {
  if (message.type === "result" && message.subtype === "success") {
    console.log(message.result);
  }
}
```

### 

[​

](#multiple-tools-example)

Multiple Tools Example

When your MCP server has multiple tools, you can selectively allow them:

TypeScript

Python

Copy

```typescript
const multiToolServer = createSdkMcpServer({
  name: "utilities",
  version: "1.0.0",
  tools: [
    tool("calculate", "Perform calculations", { /* ... */ }, async (args) => { /* ... */ }),
    tool("translate", "Translate text", { /* ... */ }, async (args) => { /* ... */ }),
    tool("search_web", "Search the web", { /* ... */ }, async (args) => { /* ... */ })
  ]
});

// Allow only specific tools with streaming input
async function* generateMessages() {
  yield {
    type: "user" as const,
    message: {
      role: "user" as const,
      content: "Calculate 5 + 3 and translate 'hello' to Spanish"
    }
  };
}

for await (const message of query({
  prompt: generateMessages(),  // Use async generator for streaming input
  options: {
    mcpServers: {
      utilities: multiToolServer
    },
    allowedTools: [
      "mcp__utilities__calculate",   // Allow calculator
      "mcp__utilities__translate",   // Allow translator
      // "mcp__utilities__search_web" is NOT allowed
    ]
  }
})) {
  // Process messages
}
```

## 

[​

](#type-safety-with-python)

Type Safety with Python

The `@tool` decorator supports various schema definition approaches for type safety:

TypeScript

Python

Copy

```typescript
import { z } from "zod";

tool(
  "process_data",
  "Process structured data with type safety",
  {
    // Zod schema defines both runtime validation and TypeScript types
    data: z.object({
      name: z.string(),
      age: z.number().min(0).max(150),
      email: z.string().email(),
      preferences: z.array(z.string()).optional()
    }),
    format: z.enum(["json", "csv", "xml"]).default("json")
  },
  async (args) => {
    // args is fully typed based on the schema
    // TypeScript knows: args.data.name is string, args.data.age is number, etc.
    console.log(`Processing ${args.data.name}'s data as ${args.format}`);
    
    // Your processing logic here
    return {
      content: [{
        type: "text",
        text: `Processed data for ${args.data.name}`
      }]
    };
  }
)
```

## 

[​

](#error-handling)

Error Handling

Handle errors gracefully to provide meaningful feedback:

TypeScript

Python

Copy

```typescript
tool(
  "fetch_data",
  "Fetch data from an API",
  {
    endpoint: z.string().url().describe("API endpoint URL")
  },
  async (args) => {
    try {
      const response = await fetch(args.endpoint);
      
      if (!response.ok) {
        return {
          content: [{
            type: "text",
            text: `API error: ${response.status} ${response.statusText}`
          }]
        };
      }
      
      const data = await response.json();
      return {
        content: [{
          type: "text",
          text: JSON.stringify(data, null, 2)
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Failed to fetch data: ${error.message}`
        }]
      };
    }
  }
)
```

## 

[​

](#example-tools)

Example Tools

### 

[​

](#database-query-tool)

Database Query Tool

TypeScript

Python

Copy

```typescript
const databaseServer = createSdkMcpServer({
  name: "database-tools",
  version: "1.0.0",
  tools: [
    tool(
      "query_database",
      "Execute a database query",
      {
        query: z.string().describe("SQL query to execute"),
        params: z.array(z.any()).optional().describe("Query parameters")
      },
      async (args) => {
        const results = await db.query(args.query, args.params || []);
        return {
          content: [{
            type: "text",
            text: `Found ${results.length} rows:\n${JSON.stringify(results, null, 2)}`
          }]
        };
      }
    )
  ]
});
```

### 

[​

](#api-gateway-tool)

API Gateway Tool

TypeScript

Python

Copy

```typescript
const apiGatewayServer = createSdkMcpServer({
  name: "api-gateway",
  version: "1.0.0",
  tools: [
    tool(
      "api_request",
      "Make authenticated API requests to external services",
      {
        service: z.enum(["stripe", "github", "openai", "slack"]).describe("Service to call"),
        endpoint: z.string().describe("API endpoint path"),
        method: z.enum(["GET", "POST", "PUT", "DELETE"]).describe("HTTP method"),
        body: z.record(z.any()).optional().describe("Request body"),
        query: z.record(z.string()).optional().describe("Query parameters")
      },
      async (args) => {
        const config = {
          stripe: { baseUrl: "https://api.stripe.com/v1", key: process.env.STRIPE_KEY },
          github: { baseUrl: "https://api.github.com", key: process.env.GITHUB_TOKEN },
          openai: { baseUrl: "https://api.openai.com/v1", key: process.env.OPENAI_KEY },
          slack: { baseUrl: "https://slack.com/api", key: process.env.SLACK_TOKEN }
        };
        
        const { baseUrl, key } = config[args.service];
        const url = new URL(`${baseUrl}${args.endpoint}`);
        
        if (args.query) {
          Object.entries(args.query).forEach(([k, v]) => url.searchParams.set(k, v));
        }
        
        const response = await fetch(url, {
          method: args.method,
          headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
          body: args.body ? JSON.stringify(args.body) : undefined
        });
        
        const data = await response.json();
        return {
          content: [{
            type: "text",
            text: JSON.stringify(data, null, 2)
          }]
        };
      }
    )
  ]
});
```

### 

[​

](#calculator-tool)

Calculator Tool

TypeScript

Python

Copy

```typescript
const calculatorServer = createSdkMcpServer({
  name: "calculator",
  version: "1.0.0",
  tools: [
    tool(
      "calculate",
      "Perform mathematical calculations",
      {
        expression: z.string().describe("Mathematical expression to evaluate"),
        precision: z.number().optional().default(2).describe("Decimal precision")
      },
      async (args) => {
        try {
          // Use a safe math evaluation library in production
          const result = eval(args.expression); // Example only!
          const formatted = Number(result).toFixed(args.precision);
          
          return {
            content: [{
              type: "text",
              text: `${args.expression} = ${formatted}`
            }]
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error: Invalid expression - ${error.message}`
            }]
          };
        }
      }
    ),
    tool(
      "compound_interest",
      "Calculate compound interest for an investment",
      {
        principal: z.number().positive().describe("Initial investment amount"),
        rate: z.number().describe("Annual interest rate (as decimal, e.g., 0.05 for 5%)"),
        time: z.number().positive().describe("Investment period in years"),
        n: z.number().positive().default(12).describe("Compounding frequency per year")
      },
      async (args) => {
        const amount = args.principal * Math.pow(1 + args.rate / args.n, args.n * args.time);
        const interest = amount - args.principal;
        
        return {
          content: [{
            type: "text",
            text: `Investment Analysis:\n` +
                  `Principal: $${args.principal.toFixed(2)}\n` +
                  `Rate: ${(args.rate * 100).toFixed(2)}%\n` +
                  `Time: ${args.time} years\n` +
                  `Compounding: ${args.n} times per year\n\n` +
                  `Final Amount: $${amount.toFixed(2)}\n` +
                  `Interest Earned: $${interest.toFixed(2)}\n` +
                  `Return: ${((interest / args.principal) * 100).toFixed(2)}%`
          }]
        };
      }
    )
  ]
});
```

## 

[​

](#related-documentation)

Related Documentation

-   [TypeScript SDK Reference](typescript.html)
-   [Python SDK Reference](python.html)
-   [MCP Documentation](https://modelcontextprotocol.io)
-   [SDK Overview](overview.html)

Was this page helpful?

YesNo

[MCP in the SDK](mcp.html)[Subagents in the SDK](subagents.html)

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