Advanced: Rendering UI with Language Models

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

[Overview](../ai-sdk-ui/overview.html)

[Chatbot](../ai-sdk-ui/chatbot.html)

[Chatbot Message Persistence](../ai-sdk-ui/chatbot-message-persistence.html)

[Chatbot Resume Streams](../ai-sdk-ui/chatbot-resume-streams.html)

[Chatbot Tool Usage](../ai-sdk-ui/chatbot-tool-usage.html)

[Generative User Interfaces](../ai-sdk-ui/generative-user-interfaces.html)

[Completion](../ai-sdk-ui/completion.html)

[Object Generation](../ai-sdk-ui/object-generation.html)

[Streaming Custom Data](../ai-sdk-ui/streaming-data.html)

[Error Handling](../ai-sdk-ui/error-handling.html)

[Transport](../ai-sdk-ui/transport.html)

[Reading UIMessage Streams](../ai-sdk-ui/reading-ui-message-streams.html)

[Message Metadata](../ai-sdk-ui/message-metadata.html)

[Stream Protocols](../ai-sdk-ui/stream-protocol.html)

[AI SDK RSC](../ai-sdk-rsc.html)

[Advanced](../advanced.html)

[Prompt Engineering](prompt-engineering.html)

[Stopping Streams](stopping-streams.html)

[Backpressure](backpressure.html)

[Caching](caching.html)

[Multiple Streamables](multiple-streamables.html)

[Rate Limiting](rate-limiting.html)

[Rendering UI with Language Models](rendering-ui-with-language-models.html)

[Language Models as Routers](model-as-router.html)

[Multistep Interfaces](multistep-interfaces.html)

[Sequential Generations](sequential-generations.html)

[Vercel Deployment Guide](vercel-deployment-guide.html)

[Reference](../reference.html)

[AI SDK Core](../reference/ai-sdk-core.html)

[AI SDK UI](../reference/ai-sdk-ui.html)

[AI SDK RSC](../reference/ai-sdk-rsc.html)

[Stream Helpers](../reference/stream-helpers.html)

[AI SDK Errors](../reference/ai-sdk-errors.html)

[Migration Guides](../migration-guides.html)

[Troubleshooting](../troubleshooting.html)

[Advanced](../advanced.html)Rendering UI with Language Models

# [Rendering User Interfaces with Language Models](#rendering-user-interfaces-with-language-models)

Language models generate text, so at first it may seem like you would only need to render text in your application.

```tsx
const text = generateText({
  model: openai('gpt-3.5-turbo'),
  system: 'You are a friendly assistant',
  prompt: 'What is the weather in SF?',
  tools: {
    getWeather: {
      description: 'Get the weather for a location',
      parameters: z.object({
        city: z.string().describe('The city to get the weather for'),
        unit: z
          .enum(['C', 'F'])
          .describe('The unit to display the temperature in'),
      }),
      execute: async ({ city, unit }) => {
        const weather = getWeather({ city, unit });
        return `It is currently ${weather.value}°${unit} and ${weather.description} in ${city}!`;
      },
    },
  },
});
```

Above, the language model is passed a [tool](../ai-sdk-core/tools-and-tool-calling.html) called `getWeather` that returns the weather information as text. However, instead of returning text, if you return a JSON object that represents the weather information, you can use it to render a React component instead.

```tsx
const text = generateText({
  model: openai('gpt-3.5-turbo'),
  system: 'You are a friendly assistant',
  prompt: 'What is the weather in SF?',
  tools: {
    getWeather: {
      description: 'Get the weather for a location',
      parameters: z.object({
        city: z.string().describe('The city to get the weather for'),
        unit: z
          .enum(['C', 'F'])
          .describe('The unit to display the temperature in'),
      }),
      execute: async ({ city, unit }) => {
        const weather = getWeather({ city, unit });
        const { temperature, unit, description, forecast } = weather;


        return {
          temperature,
          unit,
          description,
          forecast,
        };
      },
    },
  },
});
```

Now you can use the object returned by the `getWeather` function to conditionally render a React component `<WeatherCard/>` that displays the weather information by passing the object as props.

```tsx
return (
  <div>
    {messages.map(message => {
      if (message.role === 'function') {
        const { name, content } = message
        const { temperature, unit, description, forecast } = content;


        return (
          <WeatherCard
            weather={{
              temperature: 47,
              unit: 'F',
              description: 'sunny'
              forecast,
            }}
          />
        )
      }
    })}
  </div>
)
```

Here's a little preview of what that might look like.

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

Weather

An example of an assistant that renders the weather information in a streamed component.

Rendering interfaces as part of language model generations elevates the user experience of your application, allowing people to interact with language models beyond text.

They also make it easier for you to interpret [sequential tool calls](../ai-sdk-rsc/multistep-interfaces.html) that take place in multiple steps and help identify and debug where the model reasoned incorrectly.

## [Rendering Multiple User Interfaces](#rendering-multiple-user-interfaces)

To recap, an application has to go through the following steps to render user interfaces as part of model generations:

1.  The user prompts the language model.
2.  The language model generates a response that includes a tool call.
3.  The tool call returns a JSON object that represents the user interface.
4.  The response is sent to the client.
5.  The client receives the response and checks if the latest message was a tool call.
6.  If it was a tool call, the client renders the user interface based on the JSON object returned by the tool call.

Most applications have multiple tools that are called by the language model, and each tool can return a different user interface.

For example, a tool that searches for courses can return a list of courses, while a tool that searches for people can return a list of people. As this list grows, the complexity of your application will grow as well and it can become increasingly difficult to manage these user interfaces.

```tsx
{
  message.role === 'tool' ? (
    message.name === 'api-search-course' ? (
      <Courses courses={message.content} />
    ) : message.name === 'api-search-profile' ? (
      <People people={message.content} />
    ) : message.name === 'api-meetings' ? (
      <Meetings meetings={message.content} />
    ) : message.name === 'api-search-building' ? (
      <Buildings buildings={message.content} />
    ) : message.name === 'api-events' ? (
      <Events events={message.content} />
    ) : message.name === 'api-meals' ? (
      <Meals meals={message.content} />
    ) : null
  ) : (
    <div>{message.content}</div>
  );
}
```

## [Rendering User Interfaces on the Server](#rendering-user-interfaces-on-the-server)

The **AI SDK RSC (`@ai-sdk/rsc`)** takes advantage of RSCs to solve the problem of managing all your React components on the client side, allowing you to render React components on the server and stream them to the client.

Rather than conditionally rendering user interfaces on the client based on the data returned by the language model, you can directly stream them from the server during a model generation.

```tsx
import { createStreamableUI } from '@ai-sdk/rsc'


const uiStream = createStreamableUI();


const text = generateText({
  model: openai('gpt-3.5-turbo'),
  system: 'you are a friendly assistant'
  prompt: 'what is the weather in SF?'
  tools: {
    getWeather: {
      description: 'Get the weather for a location',
      parameters: z.object({
        city: z.string().describe('The city to get the weather for'),
        unit: z
          .enum(['C', 'F'])
          .describe('The unit to display the temperature in')
      }),
      execute: async ({ city, unit }) => {
        const weather = getWeather({ city, unit })
        const { temperature, unit, description, forecast } = weather


        uiStream.done(
          <WeatherCard
            weather={{
              temperature: 47,
              unit: 'F',
              description: 'sunny'
              forecast,
            }}
          />
        )
      }
    }
  }
})


return {
  display: uiStream.value
}
```

The [`createStreamableUI`](../reference/ai-sdk-rsc/create-streamable-ui.html) function belongs to the `@ai-sdk/rsc` module and creates a stream that can send React components to the client.

On the server, you render the `<WeatherCard/>` component with the props passed to it, and then stream it to the client. On the client side, you only need to render the UI that is streamed from the server.

```tsx
return (
  <div>
    {messages.map(message => (
      <div>{message.display}</div>
    ))}
  </div>
);
```

Now the steps involved are simplified:

1.  The user prompts the language model.
2.  The language model generates a response that includes a tool call.
3.  The tool call renders a React component along with relevant props that represent the user interface.
4.  The response is streamed to the client and rendered directly.

> **Note:** You can also render text on the server and stream it to the client using React Server Components. This way, all operations from language model generation to UI rendering can be done on the server, while the client only needs to render the UI that is streamed from the server.

Check out this [example](../../cookbook/rsc/stream-updates-to-visual-interfaces.html) for a full illustration of how to stream component updates with React Server Components in Next.js App Router.

[Previous

Rate Limiting

](rate-limiting.html)

[Next

Language Models as Routers

](model-as-router.html)

On this page

[Rendering User Interfaces with Language Models](#rendering-user-interfaces-with-language-models)

[Rendering Multiple User Interfaces](#rendering-multiple-user-interfaces)

[Rendering User Interfaces on the Server](#rendering-user-interfaces-on-the-server)

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