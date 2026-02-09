Advanced: Multiple Streamables

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

[Advanced](../advanced.html)Multiple Streamables

# [Multiple Streams](#multiple-streams)

## [Multiple Streamable UIs](#multiple-streamable-uis)

The AI SDK RSC APIs allow you to compose and return any number of streamable UIs, along with other data, in a single request. This can be useful when you want to decouple the UI into smaller components and stream them separately.

```tsx
'use server';


import { createStreamableUI } from '@ai-sdk/rsc';


export async function getWeather() {
  const weatherUI = createStreamableUI();
  const forecastUI = createStreamableUI();


  weatherUI.update(<div>Loading weather...</div>);
  forecastUI.update(<div>Loading forecast...</div>);


  getWeatherData().then(weatherData => {
    weatherUI.done(<div>{weatherData}</div>);
  });


  getForecastData().then(forecastData => {
    forecastUI.done(<div>{forecastData}</div>);
  });


  // Return both streamable UIs and other data fields.
  return {
    requestedAt: Date.now(),
    weather: weatherUI.value,
    forecast: forecastUI.value,
  };
}
```

The client side code is similar to the previous example, but the [tool call](../ai-sdk-core/tools-and-tool-calling.html) will return the new data structure with the weather and forecast UIs. Depending on the speed of getting weather and forecast data, these two components might be updated independently.

## [Nested Streamable UIs](#nested-streamable-uis)

You can stream UI components within other UI components. This allows you to create complex UIs that are built up from smaller, reusable components. In the example below, we pass a `historyChart` streamable as a prop to a `StockCard` component. The StockCard can render the `historyChart` streamable, and it will automatically update as the server responds with new data.

```tsx
async function getStockHistoryChart({ symbol: string }) {
  'use server';


  const ui = createStreamableUI(<Spinner />);


  // We need to wrap this in an async IIFE to avoid blocking.
  (async () => {
    const price = await getStockPrice({ symbol });


    // Show a spinner as the history chart for now.
    const historyChart = createStreamableUI(<Spinner />);
    ui.done(<StockCard historyChart={historyChart.value} price={price} />);


    // Getting the history data and then update that part of the UI.
    const historyData = await fetch('https://my-stock-data-api.com');
    historyChart.done(<HistoryChart data={historyData} />);
  })();


  return ui;
}
```

[Previous

Caching

](caching.html)

[Next

Rate Limiting

](rate-limiting.html)

On this page

[Multiple Streams](#multiple-streams)

[Multiple Streamable UIs](#multiple-streamable-uis)

[Nested Streamable UIs](#nested-streamable-uis)

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