Migration Guides: Migrate AI SDK 3.0 to 3.1

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

[Reference](../reference.html)

[AI SDK Core](../reference/ai-sdk-core.html)

[AI SDK UI](../reference/ai-sdk-ui.html)

[AI SDK RSC](../reference/ai-sdk-rsc.html)

[Stream Helpers](../reference/stream-helpers.html)

[AI SDK Errors](../reference/ai-sdk-errors.html)

[Migration Guides](../migration-guides.html)

[Versioning](versioning.html)

[Migrate Your Data to AI SDK 5.0](migration-guide-5-0-data.html)

[Migrate AI SDK 4.0 to 5.0](migration-guide-5-0.html)

[Migrate AI SDK 4.1 to 4.2](migration-guide-4-2.html)

[Migrate AI SDK 4.0 to 4.1](migration-guide-4-1.html)

[Migrate AI SDK 3.4 to 4.0](migration-guide-4-0.html)

[Migrate AI SDK 3.3 to 3.4](migration-guide-3-4.html)

[Migrate AI SDK 3.2 to 3.3](migration-guide-3-3.html)

[Migrate AI SDK 3.1 to 3.2](migration-guide-3-2.html)

[Migrate AI SDK 3.0 to 3.1](migration-guide-3-1.html)

[Troubleshooting](../troubleshooting.html)

[Migration Guides](../migration-guides.html)Migrate AI SDK 3.0 to 3.1

# [Migrate AI SDK 3.0 to 3.1](#migrate-ai-sdk-30-to-31)

Check out the [AI SDK 3.1 release blog post](https://vercel.com/blog/vercel-ai-sdk-3-1-modelfusion-joins-the-team) for more information about the release.

This guide will help you:

-   Upgrade to AI SDK 3.1
-   Migrate from Legacy Providers to AI SDK Core
-   Migrate from [`render`](../reference/ai-sdk-rsc/render.html) to [`streamUI`](../reference/ai-sdk-rsc/stream-ui.html)

Upgrading to AI SDK 3.1 does not require using the newly released AI SDK Core API or [`streamUI`](../reference/ai-sdk-rsc/stream-ui.html) function.

## [Upgrading](#upgrading)

### [AI SDK](#ai-sdk)

To update to AI SDK version 3.1, run the following command using your preferred package manager:

pnpm add ai@3.1

## [Next Steps](#next-steps)

The release of AI SDK 3.1 introduces several new features that improve the way you build AI applications with the SDK:

-   AI SDK Core, a brand new unified API for interacting with large language models (LLMs).
-   [`streamUI`](../reference/ai-sdk-rsc/stream-ui.html), a new abstraction, built upon AI SDK Core functions that simplifies building streaming UIs.

## [Migrating from Legacy Providers to AI SDK Core](#migrating-from-legacy-providers-to-ai-sdk-core)

Prior to AI SDK Core, you had to use a model provider's SDK to query their models.

In the following Route Handler, you use the OpenAI SDK to query their model. You then pipe that response into the [`OpenAIStream`](../reference/stream-helpers/openai-stream.html) function which returns a [`ReadableStream`](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream) that you can pass to the client using a new [`StreamingTextResponse`](../reference/stream-helpers/streaming-text-response.html).

```tsx
import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});


export async function POST(req: Request) {
  const { messages } = await req.json();


  const response = await openai.chat.completions.create({
    model: 'gpt-4.1',
    stream: true,
    messages,
  });


  const stream = OpenAIStream(response);


  return new StreamingTextResponse(stream);
}
```

With AI SDK Core you have a unified API for any provider that implements the [AI SDK Language Model Specification](../../providers/community-providers/custom-providers.html).

Let’s take a look at the example above, but refactored to utilize the AI SDK Core API alongside the AI SDK OpenAI provider. In this example, you import the LLM function you want to use from the `ai` package, import the OpenAI provider from `@ai-sdk/openai`, and then you call the model and return the response using the `toDataStreamResponse()` helper function.

```tsx
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';


export async function POST(req: Request) {
  const { messages } = await req.json();


  const result = await streamText({
    model: openai('gpt-4.1'),
    messages,
  });


  return result.toUIMessageStreamResponse();
}
```

## [Migrating from `render` to `streamUI`](#migrating-from-render-to-streamui)

The AI SDK RSC API was launched as part of version 3.0. This API introduced the [`render`](../reference/ai-sdk-rsc/render.html) function, a helper function to create streamable UIs with OpenAI models. With the new AI SDK Core API, it became possible to make streamable UIs possible with any compatible provider.

The following example Server Action uses the `render` function using the model provider directly from OpenAI. You first create an OpenAI provider instance with the OpenAI SDK. Then, you pass it to the provider key of the render function alongside a tool that returns a React Server Component, defined in the `render` key of the tool.

```tsx
import { render } from '@ai-sdk/rsc';
import OpenAI from 'openai';
import { z } from 'zod';
import { Spinner, Weather } from '@/components';
import { getWeather } from '@/utils';


const openai = new OpenAI();


async function submitMessage(userInput = 'What is the weather in SF?') {
  'use server';


  return render({
    provider: openai,
    model: 'gpt-4.1',
    messages: [
      { role: 'system', content: 'You are a helpful assistant' },
      { role: 'user', content: userInput },
    ],
    text: ({ content }) => <p>{content}</p>,
    tools: {
      get_city_weather: {
        description: 'Get the current weather for a city',
        parameters: z
          .object({
            city: z.string().describe('the city'),
          })
          .required(),
        render: async function* ({ city }) {
          yield <Spinner />;
          const weather = await getWeather(city);
          return <Weather info={weather} />;
        },
      },
    },
  });
}
```

With the new [`streamUI`](../reference/ai-sdk-rsc/stream-ui.html) function, you can now use any compatible AI SDK provider. In this example, you import the AI SDK OpenAI provider. Then, you pass it to the [`model`](../reference/ai-sdk-rsc/stream-ui.html#model) key of the new [`streamUI`](../reference/ai-sdk-rsc/stream-ui.html) function. Finally, you declare a tool and return a React Server Component, defined in the [`generate`](../reference/ai-sdk-rsc/stream-ui.html#tools-generate) key of the tool.

```tsx
import { streamUI } from '@ai-sdk/rsc';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import { Spinner, Weather } from '@/components';
import { getWeather } from '@/utils';


async function submitMessage(userInput = 'What is the weather in SF?') {
  'use server';


  const result = await streamUI({
    model: openai('gpt-4.1'),
    system: 'You are a helpful assistant',
    messages: [{ role: 'user', content: userInput }],
    text: ({ content }) => <p>{content}</p>,
    tools: {
      get_city_weather: {
        description: 'Get the current weather for a city',
        parameters: z
          .object({
            city: z.string().describe('Name of the city'),
          })
          .required(),
        generate: async function* ({ city }) {
          yield <Spinner />;
          const weather = await getWeather(city);
          return <Weather info={weather} />;
        },
      },
    },
  });


  return result.value;
}
```

[Previous

Migrate AI SDK 3.1 to 3.2

](migration-guide-3-2.html)

[Next

Troubleshooting

](../troubleshooting.html)

On this page

[Migrate AI SDK 3.0 to 3.1](#migrate-ai-sdk-30-to-31)

[Upgrading](#upgrading)

[AI SDK](#ai-sdk)

[Next Steps](#next-steps)

[Migrating from Legacy Providers to AI SDK Core](#migrating-from-legacy-providers-to-ai-sdk-core)

[Migrating from render to streamUI](#migrating-from-render-to-streamui)

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