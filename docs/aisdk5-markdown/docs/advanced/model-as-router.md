Advanced: Language Models as Routers

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

[Advanced](../advanced.html)Language Models as Routers

# [Generative User Interfaces](#generative-user-interfaces)

Since language models can render user interfaces as part of their generations, the resulting model generations are referred to as generative user interfaces.

In this section we will learn more about generative user interfaces and their impact on the way AI applications are built.

## [Deterministic Routes and Probabilistic Routing](#deterministic-routes-and-probabilistic-routing)

Generative user interfaces are not deterministic in nature because they depend on the model's generation output. Since these generations are probabilistic in nature, it is possible for every user query to result in a different user interface.

Users expect their experience using your application to be predictable, so non-deterministic user interfaces can sound like a bad idea at first. However, language models can be set up to limit their generations to a particular set of outputs using their ability to call functions.

When language models are provided with a set of function definitions and instructed to execute any of them based on user query, they do either one of the following things:

-   Execute a function that is most relevant to the user query.
-   Not execute any function if the user query is out of bounds of the set of functions available to them.

```tsx
const sendMessage = (prompt: string) =>
  generateText({
    model: 'gpt-3.5-turbo',
    system: 'you are a friendly weather assistant!',
    prompt,
    tools: {
      getWeather: {
        description: 'Get the weather in a location',
        parameters: z.object({
          location: z.string().describe('The location to get the weather for'),
        }),
        execute: async ({ location }: { location: string }) => ({
          location,
          temperature: 72 + Math.floor(Math.random() * 21) - 10,
        }),
      },
    },
  });


sendMessage('What is the weather in San Francisco?'); // getWeather is called
sendMessage('What is the weather in New York?'); // getWeather is called
sendMessage('What events are happening in London?'); // No function is called
```

This way, it is possible to ensure that the generations result in deterministic outputs, while the choice a model makes still remains to be probabilistic.

This emergent ability exhibited by a language model to choose whether a function needs to be executed or not based on a user query is believed to be models emulating "reasoning".

As a result, the combination of language models being able to reason which function to execute as well as render user interfaces at the same time gives you the ability to build applications where language models can be used as a router.

## [Language Models as Routers](#language-models-as-routers)

Historically, developers had to write routing logic that connected different parts of an application to be navigable by a user and complete a specific task.

In web applications today, most of the routing logic takes place in the form of routes:

-   `/login` would navigate you to a page with a login form.
-   `/user/john` would navigate you to a page with profile details about John.
-   `/api/events?limit=5` would display the five most recent events from an events database.

While routes help you build web applications that connect different parts of an application into a seamless user experience, it can also be a burden to manage them as the complexity of applications grow.

Next.js has helped reduce complexity in developing with routes by introducing:

-   File-based routing system
-   Dynamic routing
-   API routes
-   Middleware
-   App router, and so on...

With language models becoming better at reasoning, we believe that there is a future where developers only write core application specific components while models take care of routing them based on the user's state in an application.

With generative user interfaces, the language model decides which user interface to render based on the user's state in the application, giving users the flexibility to interact with your application in a conversational manner instead of navigating through a series of predefined routes.

### [Routing by parameters](#routing-by-parameters)

For routes like:

-   `/profile/[username]`
-   `/search?q=[query]`
-   `/media/[id]`

that have segments dependent on dynamic data, the language model can generate the correct parameters and render the user interface.

For example, when you're in a search application, you can ask the language model to search for artworks from different artists. The language model will call the search function with the artist's name as a parameter and render the search results.

Art made by Van Gogh?

searchImages("Van Gogh")

Here are a few of his notable works

![Starry Night](../../images/starry-night.jpg)

Starry Night

![Sunflowers](../../images/sunflowers.jpg)

Sunflowers

![Olive Trees](../../images/olive-trees.jpg)

Olive Trees

Wow, these look great! How about Monet?

searchImages("Monet")

Sure! Here are a few of his paintings

![Frau im Gartenfrau](../../images/frau-im-gartenfrau.jpg)

Frau im Gartenfrau

![Cliff Walk](../../images/cliff-walk.jpg)

Cliff Walk

![Waves](../../images/waves.jpg)

Waves

Media Search

Let your users see more than words can say by rendering components directly within your search experience.

### [Routing by sequence](#routing-by-sequence)

For actions that require a sequence of steps to be completed by navigating through different routes, the language model can generate the correct sequence of routes to complete in order to fulfill the user's request.

For example, when you're in a calendar application, you can ask the language model to schedule a happy hour evening with your friends. The language model will then understand your request and will perform the right sequence of [tool calls](../ai-sdk-core/tools-and-tool-calling.html) to:

1.  Lookup your calendar
2.  Lookup your friends' calendars
3.  Determine the best time for everyone
4.  Search for nearby happy hour spots
5.  Create an event and send out invites to your friends

I'd like to get drinks with Max tomorrow evening after studio!

searchContacts("Max")

![max's avatar](../../../vercel.com/api/www/avatar/avatar.png)

max

@mleiter

![shu's avatar](../../../vercel.com/api/www/avatar/avatar.png)

shu

@shuding

getEvents("2023-10-18", \["jrmy", "mleiter"\])

4PM

5PM

6PM

7PM

studio

4-6 PM

searchNearby("Bar")

wild colonial

200m

the eddy

1.3km

createEvent("2023-10-18", \["jrmy", "mleiter"\])

4PM

5PM

6PM

7PM

studio

4-6 PM

Drinks at Wild Colonial

6-7 PM

Exciting! Max is free around that time and Wild Colonial is right around the corner, would you like me to mark it on your calendar?

Sure, sounds good!

Planning an Event

The model calls functions and generates interfaces based on user intent, acting like a router.

Just by defining functions to lookup contacts, pull events from a calendar, and search for nearby locations, the model is able to sequentially navigate the routes for you.

To learn more, check out these [examples](../../cookbook/rsc/render-visual-interface-in-chat.html) using the `streamUI` function to stream generative user interfaces to the client based on the response from the language model.

[Previous

Rendering UI with Language Models

](rendering-ui-with-language-models.html)

[Next

Multistep Interfaces

](multistep-interfaces.html)

On this page

[Generative User Interfaces](#generative-user-interfaces)

[Deterministic Routes and Probabilistic Routing](#deterministic-routes-and-probabilistic-routing)

[Language Models as Routers](#language-models-as-routers)

[Routing by parameters](#routing-by-parameters)

[Routing by sequence](#routing-by-sequence)

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