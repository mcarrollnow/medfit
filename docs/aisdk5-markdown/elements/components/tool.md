Chatbot: Tool

[](https://vercel.com/)

[

AI SDK



](../../index.html)

-   [Docs](../../docs/introduction.html)
-   [Cookbook](../../cookbook.html)
-   [Providers](../../providers/ai-sdk-providers.html)
-   [Playground](../../playground.html)
-   [
    
    AI ElementsAI Elements
    
    ](../overview.html)
-   [AI GatewayGateway](https://vercel.com/ai-gateway)

AI SDK 5 is available now.

[View Announcement](https://vercel.com/blog/ai-sdk-5)

Menu

[Introduction](../overview.html)

[Setup](../overview/setup.html)

[Usage](../overview/usage.html)

[Troubleshooting](../overview/troubleshooting.html)

[Examples](../examples.html)

[Chatbot](../examples/chatbot.html)

[v0 clone](../examples/v0.html)

[Workflow](../examples/workflow.html)

[Components](../components.html)

[Chatbot](chatbot.html)

[Actions](actions.html)

[Branch](branch.html)

[Chain of Thought](chain-of-thought.html)

[Code Block](code-block.html)

[Context](context.html)

[Conversation](conversation.html)

[Image](image.html)

[Inline Citation](inline-citation.html)

[Loader](loader.html)

[Message](message.html)

[Open In Chat](open-in-chat.html)

[Plan](plan.html)

[Prompt Input](prompt-input.html)

[Queue](queue.html)

[Reasoning](reasoning.html)

[Response](response.html)

[Shimmer](shimmer.html)

[Sources](sources.html)

[Suggestion](suggestion.html)

[Task](task.html)

[Tool](tool.html)

[Workflow](workflow.html)

[Canvas](canvas.html)

[Connection](connection.html)

[Controls](controls.html)

[Edge](edge.html)

[Node](node.html)

[Panel](panel.html)

[Toolbar](toolbar.html)

[Vibe Coding](vibe-coding.html)

[Artifact](artifact.html)

[Web Preview](web-preview.html)

[Components](../components.html)Tool

# [Tool](#tool)

The `Tool` component displays a collapsible interface for showing/hiding tool details. It is designed to take the `ToolUIPart` type from the AI SDK and display it in a collapsible interface.

CodePreview

database\_query

Completed

## [Installation](#installation)

ai-elementsshadcnManual

npx ai-elements@latest add tool

## [Usage](#usage)

```tsx
import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolOutput,
  ToolInput,
} from '@/components/ai-elements/tool';
```

```tsx
<Tool>
  <ToolHeader type="tool-call" state={'output-available' as const} />
  <ToolContent>
    <ToolInput input="Input to tool call" />
    <ToolOutput errorText="Error" output="Output from tool call" />
  </ToolContent>
</Tool>
```

## [Usage in AI SDK](#usage-in-ai-sdk)

Build a simple stateful weather app that renders the last message in a tool using [`useChat`](../../docs/reference/ai-sdk-ui/use-chat.html).

Add the following component to your frontend:

```tsx
'use client';


import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, type ToolUIPart } from 'ai';
import { Button } from '@/components/ui/button';
import { Response } from '@/components/ai-elements/response';
import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolInput,
  ToolOutput,
} from '@/components/ai-elements/tool';


type WeatherToolInput = {
  location: string;
  units: 'celsius' | 'fahrenheit';
};


type WeatherToolOutput = {
  location: string;
  temperature: string;
  conditions: string;
  humidity: string;
  windSpeed: string;
  lastUpdated: string;
};


type WeatherToolUIPart = ToolUIPart<{
  fetch_weather_data: {
    input: WeatherToolInput;
    output: WeatherToolOutput;
  };
}>;


const Example = () => {
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/weather',
    }),
  });


  const handleWeatherClick = () => {
    sendMessage({ text: 'Get weather data for San Francisco in fahrenheit' });
  };


  const latestMessage = messages[messages.length - 1];
  const weatherTool = latestMessage?.parts?.find(
    (part) => part.type === 'tool-fetch_weather_data',
  ) as WeatherToolUIPart | undefined;


  return (
    <div className="max-w-4xl mx-auto p-6 relative size-full rounded-lg border h-[600px]">
      <div className="flex flex-col h-full">
        <div className="space-y-4">
          <Button onClick={handleWeatherClick} disabled={status !== 'ready'}>
            Get Weather for San Francisco
          </Button>


          {weatherTool && (
            <Tool defaultOpen={true}>
              <ToolHeader type="tool-fetch_weather_data" state={weatherTool.state} />
              <ToolContent>
                <ToolInput input={weatherTool.input} />
                <ToolOutput
                  output={
                    <Response>
                      {formatWeatherResult(weatherTool.output)}
                    </Response>
                  }
                  errorText={weatherTool.errorText}
                />
              </ToolContent>
            </Tool>
          )}
        </div>
      </div>
    </div>
  );
};


function formatWeatherResult(result: WeatherToolOutput): string {
  return `**Weather for ${result.location}**


**Temperature:** ${result.temperature}  
**Conditions:** ${result.conditions}  
**Humidity:** ${result.humidity}  
**Wind Speed:** ${result.windSpeed}  


*Last updated: ${result.lastUpdated}*`;
}


export default Example;
```

Add the following route to your backend:

```ts
import { streamText, UIMessage, convertToModelMessages } from 'ai';
import { z } from 'zod';


// Allow streaming responses up to 30 seconds
export const maxDuration = 30;


export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();


  const result = streamText({
    model: 'openai/gpt-4o',
    messages: convertToModelMessages(messages),
    tools: {
      fetch_weather_data: {
        description: 'Fetch weather information for a specific location',
        parameters: z.object({
          location: z
            .string()
            .describe('The city or location to get weather for'),
          units: z
            .enum(['celsius', 'fahrenheit'])
            .default('celsius')
            .describe('Temperature units'),
        }),
        inputSchema: z.object({
          location: z.string(),
          units: z.enum(['celsius', 'fahrenheit']).default('celsius'),
        }),
        execute: async ({ location, units }) => {
          await new Promise((resolve) => setTimeout(resolve, 1500));


          const temp =
            units === 'celsius'
              ? Math.floor(Math.random() * 35) + 5
              : Math.floor(Math.random() * 63) + 41;


          return {
            location,
            temperature: `${temp}°${units === 'celsius' ? 'C' : 'F'}`,
            conditions: 'Sunny',
            humidity: `12%`,
            windSpeed: `35 ${units === 'celsius' ? 'km/h' : 'mph'}`,
            lastUpdated: new Date().toLocaleString(),
          };
        },
      },
    },
  });


  return result.toUIMessageStreamResponse();
}
```

## [Features](#features)

-   Collapsible interface for showing/hiding tool details
-   Visual status indicators with icons and badges
-   Support for multiple tool execution states (pending, running, completed, error)
-   Formatted parameter display with JSON syntax highlighting
-   Result and error handling with appropriate styling
-   Composable structure for flexible layouts
-   Accessible keyboard navigation and screen reader support
-   Consistent styling that matches your design system
-   Auto-opens completed tools by default for better UX

## [Examples](#examples)

### [Input Streaming (Pending)](#input-streaming-pending)

Shows a tool in its initial state while parameters are being processed.

CodePreview

web\_search

Pending

### [Input Available (Running)](#input-available-running)

Shows a tool that's actively executing with its parameters.

CodePreview

image\_generation

Running

### [Output Available (Completed)](#output-available-completed)

Shows a completed tool with successful results. Opens by default to show the results. In this instance, the output is a JSON object, so we can use the `CodeBlock` component to display it.

CodePreview

database\_query

Completed

### [Output Error](#output-error)

Shows a tool that encountered an error during execution. Opens by default to display the error.

CodePreview

api\_request

Error

## [Props](#props)

### [`<Tool />`](#tool-)

### \[...props\]?:

React.ComponentProps<typeof Collapsible>

Any other props are spread to the root Collapsible component.

### [`<ToolHeader />`](#toolheader-)

### type:

ToolUIPart\["type"\]

The type/name of the tool.

### state:

ToolUIPart\["state"\]

The current state of the tool (input-streaming, input-available, output-available, or output-error).

### className?:

string

Additional CSS classes to apply to the header.

### \[...props\]?:

React.ComponentProps<typeof CollapsibleTrigger>

Any other props are spread to the CollapsibleTrigger.

### [`<ToolContent />`](#toolcontent-)

### \[...props\]?:

React.ComponentProps<typeof CollapsibleContent>

Any other props are spread to the CollapsibleContent.

### [`<ToolInput />`](#toolinput-)

### input:

ToolUIPart\["input"\]

The input parameters passed to the tool, displayed as formatted JSON.

### \[...props\]?:

React.ComponentProps<"div">

Any other props are spread to the underlying div.

### [`<ToolOutput />`](#tooloutput-)

### output:

React.ReactNode

The output/result of the tool execution.

### errorText:

ToolUIPart\["errorText"\]

An error message if the tool execution failed.

### \[...props\]?:

React.ComponentProps<"div">

Any other props are spread to the underlying div.

[Previous

Task

](task.html)

[Next

Workflow

](workflow.html)

On this page

[Tool](#tool)

[Installation](#installation)

[Usage](#usage)

[Usage in AI SDK](#usage-in-ai-sdk)

[Features](#features)

[Examples](#examples)

[Input Streaming (Pending)](#input-streaming-pending)

[Input Available (Running)](#input-available-running)

[Output Available (Completed)](#output-available-completed)

[Output Error](#output-error)

[Props](#props)

[<Tool />](#tool-)

[<ToolHeader />](#toolheader-)

[<ToolContent />](#toolcontent-)

[<ToolInput />](#toolinput-)

[<ToolOutput />](#tooloutput-)

Deploy and Scale AI Apps with Vercel.

Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:

-   OpenAI
-   Photoroom
-   ![leonardo-ai Logo](../../_next/logo-leonardo-ai-light.svg)![leonardo-ai Logo](../../_next/logo-leonardo-ai-dark.svg)
-   ![zapier Logo](../../_next/logo-zapier-light.svg)![zapier Logo](../../_next/logo-zapier-dark.svg)

[](https://vercel.com/contact/sales?utm_source=ai_sdk&utm_medium=web&utm_campaign=contact_sales_cta&utm_content=talk_to_an_expert_sdk_docs)

#### Resources

[Docs](../../docs/introduction.html)[Cookbook](../../cookbook.html)[Providers](../../providers/ai-sdk-providers.html)[Showcase](../../showcase.html)[GitHub](https://github.com/vercel/ai)[Discussions](https://github.com/vercel/ai/discussions)

#### More

[Playground](../../playground.html)[](https://v0.dev)[Contact Sales](https://vercel.com/contact/sales)

#### About Vercel

[Next.js + Vercel](https://vercel.com/frameworks/nextjs)[Open Source Software](https://vercel.com/oss)[GitHub](https://github.com/vercel)[X](https://x.com/vercel)

#### Legal

[Privacy Policy](https://vercel.com/legal/privacy-policy)

© 2025 Vercel, Inc.