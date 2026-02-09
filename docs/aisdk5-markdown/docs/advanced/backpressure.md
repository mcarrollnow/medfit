Advanced: Backpressure

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

[Advanced](../advanced.html)Backpressure

# [Stream Back-pressure and Cancellation](#stream-back-pressure-and-cancellation)

This page focuses on understanding back-pressure and cancellation when working with streams. You do not need to know this information to use the AI SDK, but for those interested, it offers a deeper dive on why and how the SDK optimally streams responses.

In the following sections, we'll explore back-pressure and cancellation in the context of a simple example program. We'll discuss the issues that can arise from an eager approach and demonstrate how a lazy approach can resolve them.

## [Back-pressure and Cancellation with Streams](#back-pressure-and-cancellation-with-streams)

Let's begin by setting up a simple example program:

```jsx
// A generator that will yield positive integers
async function* integers() {
  let i = 1;
  while (true) {
    console.log(`yielding ${i}`);
    yield i++;


    await sleep(100);
  }
}
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


// Wraps a generator into a ReadableStream
function createStream(iterator) {
  return new ReadableStream({
    async start(controller) {
      for await (const v of iterator) {
        controller.enqueue(v);
      }
      controller.close();
    },
  });
}


// Collect data from stream
async function run() {
  // Set up a stream of integers
  const stream = createStream(integers());


  // Read values from our stream
  const reader = stream.getReader();
  for (let i = 0; i < 10_000; i++) {
    // we know our stream is infinite, so there's no need to check `done`.
    const { value } = await reader.read();
    console.log(`read ${value}`);


    await sleep(1_000);
  }
}
run();
```

In this example, we create an async-generator that yields positive integers, a `ReadableStream` that wraps our integer generator, and a reader which will read values out of our stream. Notice, too, that our integer generator logs out `"yielding ${i}"`, and our reader logs out `"read ${value}"`. Both take an arbitrary amount of time to process data, represented with a 100ms sleep in our generator, and a 1sec sleep in our reader.

## [Back-pressure](#back-pressure)

If you were to run this program, you'd notice something funny. We'll see roughly 10 "yield" logs for every "read" log. This might seem obvious, the generator can push values 10x faster than the reader can pull them out. But it represents a problem, our `stream` has to maintain an ever expanding queue of items that have been pushed in but not pulled out.

The problem stems from the way we wrap our generator into a stream. Notice the use of `for await (…)` inside our `start` handler. This is an **eager** for-loop, and it is constantly running to get the next value from our generator to be enqueued in our stream. This means our stream does not respect back-pressure, the signal from the consumer to the producer that more values aren't needed *yet*. We've essentially spawned a thread that will perpetually push more data into the stream, one that runs as fast as possible to push new data immediately. Worse, there's no way to signal to this thread to stop running when we don't need additional data.

To fix this, `ReadableStream` allows a `pull` handler. `pull` is called every time the consumer attempts to read more data from our stream (if there's no data already queued internally). But it's not enough to just move the `for await(…)` into `pull`, we also need to convert from an eager enqueuing to a **lazy** one. By making these 2 changes, we'll be able to react to the consumer. If they need more data, we can easily produce it, and if they don't, then we don't need to spend any time doing unnecessary work.

```jsx
function createStream(iterator) {
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next();


      if (done) {
        controller.close();
      } else {
        controller.enqueue(value);
      }
    },
  });
}
```

Our `createStream` is a little more verbose now, but the new code is important. First, we need to manually call our `iterator.next()` method. This returns a `Promise` for an object with the type signature `{ done: boolean, value: T }`. If `done` is `true`, then we know that our iterator won't yield any more values and we must `close` the stream (this allows the consumer to know that the stream is also finished producing values). Else, we need to `enqueue` our newly produced value.

When we run this program, we see that our "yield" and "read" logs are now paired. We're no longer yielding 10x integers for every read! And, our stream now only needs to maintain 1 item in its internal buffer. We've essentially given control to the consumer, so that it's responsible for producing new values as it needs it. Neato!

## [Cancellation](#cancellation)

Let's go back to our initial eager example, with 1 small edit. Now instead of reading 10,000 integers, we're only going to read 3:

```jsx
// A generator that will yield positive integers
async function* integers() {
  let i = 1;
  while (true) {
    console.log(`yielding ${i}`);
    yield i++;


    await sleep(100);
  }
}
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


// Wraps a generator into a ReadableStream
function createStream(iterator) {
  return new ReadableStream({
    async start(controller) {
      for await (const v of iterator) {
        controller.enqueue(v);
      }
      controller.close();
    },
  });
}
// Collect data from stream
async function run() {
  // Set up a stream that of integers
  const stream = createStream(integers());


  // Read values from our stream
  const reader = stream.getReader();
  // We're only reading 3 items this time:
  for (let i = 0; i < 3; i++) {
    // we know our stream is infinite, so there's no need to check `done`.
    const { value } = await reader.read();
    console.log(`read ${value}`);


    await sleep(1000);
  }
}
run();
```

We're back to yielding 10x the number of values read. But notice now, after we've read 3 values, we're continuing to yield new values. We know that our reader will never read another value, but our stream doesn't! The eager `for await (…)` will continue forever, loudly enqueuing new values into our stream's buffer and increasing our memory usage until it consumes all available program memory.

The fix to this is exactly the same: use `pull` and manual iteration. By producing values ***lazily***, we tie the lifetime of our integer generator to the lifetime of the reader. Once the reads stop, the yields will stop too:

```jsx
// Wraps a generator into a ReadableStream
function createStream(iterator) {
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next();


      if (done) {
        controller.close();
      } else {
        controller.enqueue(value);
      }
    },
  });
}
```

Since the solution is the same as implementing back-pressure, it shows that they're just 2 facets of the same problem: Pushing values into a stream should be done **lazily**, and doing it eagerly results in expected problems.

## [Tying Stream Laziness to AI Responses](#tying-stream-laziness-to-ai-responses)

Now let's imagine you're integrating AIBot service into your product. Users will be able to prompt "count from 1 to infinity", the browser will fetch your AI API endpoint, and your servers connect to AIBot to get a response. But "infinity" is, well, infinite. The response will never end!

After a few seconds, the user gets bored and navigates away. Or maybe you're doing local development and a hot-module reload refreshes your page. The browser will have ended its connection to the API endpoint, but will your server end its connection with AIBot?

If you used the eager `for await (...)` approach, then the connection is still running and your server is asking for more and more data from AIBot. Our server spawned a "thread" and there's no signal when we can end the eager pulls. Eventually, the server is going to run out of memory (remember, there's no active fetch connection to read the buffering responses and free them).

With the lazy approach, this is taken care of for you. Because the stream will only request new data from AIBot when the consumer requests it, navigating away from the page naturally frees all resources. The fetch connection aborts and the server can clean up the response. The `ReadableStream` tied to that response can now be garbage collected. When that happens, the connection it holds to AIBot can then be freed.

[Previous

Stopping Streams

](stopping-streams.html)

[Next

Caching

](caching.html)

On this page

[Stream Back-pressure and Cancellation](#stream-back-pressure-and-cancellation)

[Back-pressure and Cancellation with Streams](#back-pressure-and-cancellation-with-streams)

[Back-pressure](#back-pressure)

[Cancellation](#cancellation)

[Tying Stream Laziness to AI Responses](#tying-stream-laziness-to-ai-responses)

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