AI SDK UI: Generative User Interfaces

[](https://vercel.com/)

[

AI SDK



](../../index.html)

-   [Docs](../introduction.html)
-   [Cookbook](../../cookbook.html)
-   [Providers](../../providers/ai-sdk-providers.html)
-   [Playground](../../playground.html)
-   [
    
    AI ElementsAI Elements
    
    ](../../elements/overview.html)
-   [AI GatewayGateway](https://vercel.com/ai-gateway)

AI SDK 5 is available now.

[View Announcement](https://vercel.com/blog/ai-sdk-5)

Menu

[AI SDK by Vercel](../introduction.html)

[Foundations](../foundations.html)

[Overview](../foundations/overview.html)

[Providers and Models](../foundations/providers-and-models.html)

[Prompts](../foundations/prompts.html)

[Tools](../foundations/tools.html)

[Streaming](../foundations/streaming.html)

[Getting Started](../getting-started.html)

[Navigating the Library](../getting-started/navigating-the-library.html)

[Next.js App Router](../getting-started/nextjs-app-router.html)

[Next.js Pages Router](../getting-started/nextjs-pages-router.html)

[Svelte](../getting-started/svelte.html)

[Vue.js (Nuxt)](../getting-started/nuxt.html)

[Node.js](../getting-started/nodejs.html)

[Expo](../getting-started/expo.html)

[Agents](../agents.html)

[Agents](../agents/overview.html)

[Building Agents](../agents/building-agents.html)

[Workflow Patterns](../agents/workflows.html)

[Loop Control](../agents/loop-control.html)

[AI SDK Core](../ai-sdk-core.html)

[Overview](../ai-sdk-core/overview.html)

[Generating Text](../ai-sdk-core/generating-text.html)

[Generating Structured Data](../ai-sdk-core/generating-structured-data.html)

[Tool Calling](../ai-sdk-core/tools-and-tool-calling.html)

[Model Context Protocol (MCP) Tools](../ai-sdk-core/mcp-tools.html)

[Prompt Engineering](../ai-sdk-core/prompt-engineering.html)

[Settings](../ai-sdk-core/settings.html)

[Embeddings](../ai-sdk-core/embeddings.html)

[Image Generation](../ai-sdk-core/image-generation.html)

[Transcription](../ai-sdk-core/transcription.html)

[Speech](../ai-sdk-core/speech.html)

[Language Model Middleware](../ai-sdk-core/middleware.html)

[Provider & Model Management](../ai-sdk-core/provider-management.html)

[Error Handling](../ai-sdk-core/error-handling.html)

[Testing](../ai-sdk-core/testing.html)

[Telemetry](../ai-sdk-core/telemetry.html)

[AI SDK UI](../ai-sdk-ui.html)

[Overview](overview.html)

[Chatbot](chatbot.html)

[Chatbot Message Persistence](chatbot-message-persistence.html)

[Chatbot Resume Streams](chatbot-resume-streams.html)

[Chatbot Tool Usage](chatbot-tool-usage.html)

[Generative User Interfaces](generative-user-interfaces.html)

[Completion](completion.html)

[Object Generation](object-generation.html)

[Streaming Custom Data](streaming-data.html)

[Error Handling](error-handling.html)

[Transport](transport.html)

[Reading UIMessage Streams](reading-ui-message-streams.html)

[Message Metadata](message-metadata.html)

[Stream Protocols](stream-protocol.html)

[AI SDK RSC](../ai-sdk-rsc.html)

[Advanced](../advanced.html)

[Reference](../reference.html)

[AI SDK Core](../reference/ai-sdk-core.html)

[AI SDK UI](../reference/ai-sdk-ui.html)

[AI SDK RSC](../reference/ai-sdk-rsc.html)

[Stream Helpers](../reference/stream-helpers.html)

[AI SDK Errors](../reference/ai-sdk-errors.html)

[Migration Guides](../migration-guides.html)

[Troubleshooting](../troubleshooting.html)

[AI SDK UI](../ai-sdk-ui.html)Generative User Interfaces

# [Generative User Interfaces](#generative-user-interfaces)

Generative user interfaces (generative UI) is the process of allowing a large language model (LLM) to go beyond text and "generate UI". This creates a more engaging and AI-native experience for users.

What is the weather in SF?

getWeather("San Francisco")

Thursday, March 7

47°

sunny

7am

48°

8am

50°

9am

52°

10am

54°

11am

56°

12pm

58°

1pm

60°

Thanks!

At the core of generative UI are [tools](../ai-sdk-core/tools-and-tool-calling.html) , which are functions you provide to the model to perform specialized tasks like getting the weather in a location. The model can decide when and how to use these tools based on the context of the conversation.

Generative UI is the process of connecting the results of a tool call to a React component. Here's how it works:

1.  You provide the model with a prompt or conversation history, along with a set of tools.
2.  Based on the context, the model may decide to call a tool.
3.  If a tool is called, it will execute and return data.
4.  This data can then be passed to a React component for rendering.

By passing the tool results to React components, you can create a generative UI experience that's more engaging and adaptive to your needs.

## [Build a Generative UI Chat Interface](#build-a-generative-ui-chat-interface)

Let's create a chat interface that handles text-based conversations and incorporates dynamic UI elements based on model responses.

### [Basic Chat Implementation](#basic-chat-implementation)

Start with a basic chat implementation using the `useChat` hook:

```tsx
'use client';


import { useChat } from '@ai-sdk/react';
import { useState } from 'react';


export default function Page() {
  const [input, setInput] = useState('');
  const { messages, sendMessage } = useChat();


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage({ text: input });
    setInput('');
  };


  return (
    <div>
      {messages.map(message => (
        <div key={message.id}>
          <div>{message.role === 'user' ? 'User: ' : 'AI: '}</div>
          <div>
            {message.parts.map((part, index) => {
              if (part.type === 'text') {
                return <span key={index}>{part.text}</span>;
              }
              return null;
            })}
          </div>
        </div>
      ))}


      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
```

To handle the chat requests and model responses, set up an API route:

```ts
import { openai } from '@ai-sdk/openai';
import { streamText, convertToModelMessages, UIMessage, stepCountIs } from 'ai';


export async function POST(request: Request) {
  const { messages }: { messages: UIMessage[] } = await request.json();


  const result = streamText({
    model: openai('gpt-4o'),
    system: 'You are a friendly assistant!',
    messages: convertToModelMessages(messages),
    stopWhen: stepCountIs(5),
  });


  return result.toUIMessageStreamResponse();
}
```

This API route uses the `streamText` function to process chat messages and stream the model's responses back to the client.

### [Create a Tool](#create-a-tool)

Before enhancing your chat interface with dynamic UI elements, you need to create a tool and corresponding React component. A tool will allow the model to perform a specific action, such as fetching weather information.

Create a new file called `ai/tools.ts` with the following content:

```ts
import { tool as createTool } from 'ai';
import { z } from 'zod';


export const weatherTool = createTool({
  description: 'Display the weather for a location',
  inputSchema: z.object({
    location: z.string().describe('The location to get the weather for'),
  }),
  execute: async function ({ location }) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return { weather: 'Sunny', temperature: 75, location };
  },
});


export const tools = {
  displayWeather: weatherTool,
};
```

In this file, you've created a tool called `weatherTool`. This tool simulates fetching weather information for a given location. This tool will return simulated data after a 2-second delay. In a real-world application, you would replace this simulation with an actual API call to a weather service.

### [Update the API Route](#update-the-api-route)

Update the API route to include the tool you've defined:

```ts
import { openai } from '@ai-sdk/openai';
import { streamText, convertToModelMessages, UIMessage, stepCountIs } from 'ai';
import { tools } from '@/ai/tools';


export async function POST(request: Request) {
  const { messages }: { messages: UIMessage[] } = await request.json();


  const result = streamText({
    model: openai('gpt-4o'),
    system: 'You are a friendly assistant!',
    messages: convertToModelMessages(messages),
    stopWhen: stepCountIs(5),
    tools,
  });


  return result.toUIMessageStreamResponse();
}
```

Now that you've defined the tool and added it to your `streamText` call, let's build a React component to display the weather information it returns.

### [Create UI Components](#create-ui-components)

Create a new file called `components/weather.tsx`:

```tsx
type WeatherProps = {
  temperature: number;
  weather: string;
  location: string;
};


export const Weather = ({ temperature, weather, location }: WeatherProps) => {
  return (
    <div>
      <h2>Current Weather for {location}</h2>
      <p>Condition: {weather}</p>
      <p>Temperature: {temperature}°C</p>
    </div>
  );
};
```

This component will display the weather information for a given location. It takes three props: `temperature`, `weather`, and `location` (exactly what the `weatherTool` returns).

### [Render the Weather Component](#render-the-weather-component)

Now that you have your tool and corresponding React component, let's integrate them into your chat interface. You'll render the Weather component when the model calls the weather tool.

To check if the model has called a tool, you can check the `parts` array of the UIMessage object for tool-specific parts. In AI SDK 5.0, tool parts use typed naming: `tool-${toolName}` instead of generic types.

Update your `page.tsx` file:

```tsx
'use client';


import { useChat } from '@ai-sdk/react';
import { useState } from 'react';
import { Weather } from '@/components/weather';


export default function Page() {
  const [input, setInput] = useState('');
  const { messages, sendMessage } = useChat();


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage({ text: input });
    setInput('');
  };


  return (
    <div>
      {messages.map(message => (
        <div key={message.id}>
          <div>{message.role === 'user' ? 'User: ' : 'AI: '}</div>
          <div>
            {message.parts.map((part, index) => {
              if (part.type === 'text') {
                return <span key={index}>{part.text}</span>;
              }


              if (part.type === 'tool-displayWeather') {
                switch (part.state) {
                  case 'input-available':
                    return <div key={index}>Loading weather...</div>;
                  case 'output-available':
                    return (
                      <div key={index}>
                        <Weather {...part.output} />
                      </div>
                    );
                  case 'output-error':
                    return <div key={index}>Error: {part.errorText}</div>;
                  default:
                    return null;
                }
              }


              return null;
            })}
          </div>
        </div>
      ))}


      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
```

In this updated code snippet, you:

1.  Use manual input state management with `useState` instead of the built-in `input` and `handleInputChange`.
2.  Use `sendMessage` instead of `handleSubmit` to send messages.
3.  Check the `parts` array of each message for different content types.
4.  Handle tool parts with type `tool-displayWeather` and their different states (`input-available`, `output-available`, `output-error`).

This approach allows you to dynamically render UI components based on the model's responses, creating a more interactive and context-aware chat experience.

## [Expanding Your Generative UI Application](#expanding-your-generative-ui-application)

You can enhance your chat application by adding more tools and components, creating a richer and more versatile user experience. Here's how you can expand your application:

### [Adding More Tools](#adding-more-tools)

To add more tools, simply define them in your `ai/tools.ts` file:

```ts
// Add a new stock tool
export const stockTool = createTool({
  description: 'Get price for a stock',
  inputSchema: z.object({
    symbol: z.string().describe('The stock symbol to get the price for'),
  }),
  execute: async function ({ symbol }) {
    // Simulated API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    return { symbol, price: 100 };
  },
});


// Update the tools object
export const tools = {
  displayWeather: weatherTool,
  getStockPrice: stockTool,
};
```

Now, create a new file called `components/stock.tsx`:

```tsx
type StockProps = {
  price: number;
  symbol: string;
};


export const Stock = ({ price, symbol }: StockProps) => {
  return (
    <div>
      <h2>Stock Information</h2>
      <p>Symbol: {symbol}</p>
      <p>Price: ${price}</p>
    </div>
  );
};
```

Finally, update your `page.tsx` file to include the new Stock component:

```tsx
'use client';


import { useChat } from '@ai-sdk/react';
import { useState } from 'react';
import { Weather } from '@/components/weather';
import { Stock } from '@/components/stock';


export default function Page() {
  const [input, setInput] = useState('');
  const { messages, sendMessage } = useChat();


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage({ text: input });
    setInput('');
  };


  return (
    <div>
      {messages.map(message => (
        <div key={message.id}>
          <div>{message.role}</div>
          <div>
            {message.parts.map((part, index) => {
              if (part.type === 'text') {
                return <span key={index}>{part.text}</span>;
              }


              if (part.type === 'tool-displayWeather') {
                switch (part.state) {
                  case 'input-available':
                    return <div key={index}>Loading weather...</div>;
                  case 'output-available':
                    return (
                      <div key={index}>
                        <Weather {...part.output} />
                      </div>
                    );
                  case 'output-error':
                    return <div key={index}>Error: {part.errorText}</div>;
                  default:
                    return null;
                }
              }


              if (part.type === 'tool-getStockPrice') {
                switch (part.state) {
                  case 'input-available':
                    return <div key={index}>Loading stock price...</div>;
                  case 'output-available':
                    return (
                      <div key={index}>
                        <Stock {...part.output} />
                      </div>
                    );
                  case 'output-error':
                    return <div key={index}>Error: {part.errorText}</div>;
                  default:
                    return null;
                }
              }


              return null;
            })}
          </div>
        </div>
      ))}


      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
```

By following this pattern, you can continue to add more tools and components, expanding the capabilities of your Generative UI application.

[Previous

Chatbot Tool Usage

](chatbot-tool-usage.html)

[Next

Completion

](completion.html)

On this page

[Generative User Interfaces](#generative-user-interfaces)

[Build a Generative UI Chat Interface](#build-a-generative-ui-chat-interface)

[Basic Chat Implementation](#basic-chat-implementation)

[Create a Tool](#create-a-tool)

[Update the API Route](#update-the-api-route)

[Create UI Components](#create-ui-components)

[Render the Weather Component](#render-the-weather-component)

[Expanding Your Generative UI Application](#expanding-your-generative-ui-application)

[Adding More Tools](#adding-more-tools)

Deploy and Scale AI Apps with Vercel.

Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:

-   OpenAI
-   Photoroom
-   ![leonardo-ai Logo](../../_next/logo-leonardo-ai-light.svg)![leonardo-ai Logo](../../_next/logo-leonardo-ai-dark.svg)
-   ![zapier Logo](../../_next/logo-zapier-light.svg)![zapier Logo](../../_next/logo-zapier-dark.svg)

[](https://vercel.com/contact/sales?utm_source=ai_sdk&utm_medium=web&utm_campaign=contact_sales_cta&utm_content=talk_to_an_expert_sdk_docs)

#### Resources

[Docs](../introduction.html)[Cookbook](../../cookbook.html)[Providers](../../providers/ai-sdk-providers.html)[Showcase](../../showcase.html)[GitHub](https://github.com/vercel/ai)[Discussions](https://github.com/vercel/ai/discussions)

#### More

[Playground](../../playground.html)[](https://v0.dev)[Contact Sales](https://vercel.com/contact/sales)

#### About Vercel

[Next.js + Vercel](https://vercel.com/frameworks/nextjs)[Open Source Software](https://vercel.com/oss)[GitHub](https://github.com/vercel)[X](https://x.com/vercel)

#### Legal

[Privacy Policy](https://vercel.com/legal/privacy-policy)

© 2025 Vercel, Inc.