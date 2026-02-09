Advanced: Prompt Engineering

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

[Advanced](../advanced.html)Prompt Engineering

# [Prompt Engineering](#prompt-engineering)

## [What is a Large Language Model (LLM)?](#what-is-a-large-language-model-llm)

A Large Language Model is essentially a prediction engine that takes a sequence of words as input and aims to predict the most likely sequence to follow. It does this by assigning probabilities to potential next sequences and then selecting one. The model continues to generate sequences until it meets a specified stopping criterion.

These models learn by training on massive text corpuses, which means they will be better suited to some use cases than others. For example, a model trained on GitHub data would understand the probabilities of sequences in source code particularly well. However, it's crucial to understand that the generated sequences, while often seeming plausible, can sometimes be random and not grounded in reality. As these models become more accurate, many surprising abilities and applications emerge.

## [What is a prompt?](#what-is-a-prompt)

Prompts are the starting points for LLMs. They are the inputs that trigger the model to generate text. The scope of prompt engineering involves not just crafting these prompts but also understanding related concepts such as hidden prompts, tokens, token limits, and the potential for prompt hacking, which includes phenomena like jailbreaks and leaks.

## [Why is prompt engineering needed?](#why-is-prompt-engineering-needed)

Prompt engineering currently plays a pivotal role in shaping the responses of LLMs. It allows us to tweak the model to respond more effectively to a broader range of queries. This includes the use of techniques like semantic search, command grammars, and the ReActive model architecture. The performance, context window, and cost of LLMs varies between models and model providers which adds further constraints to the mix. For example, the GPT-4 model is more expensive than GPT-3.5-turbo and significantly slower, but it can also be more effective at certain tasks. And so, like many things in software engineering, there is a trade-offs between cost and performance.

To assist with comparing and tweaking LLMs, we've built an AI playground that allows you to compare the performance of different models side-by-side online. When you're ready, you can even generate code with the AI SDK to quickly use your prompt and your selected model into your own applications.

## [Example: Build a Slogan Generator](#example-build-a-slogan-generator)

### [Start with an instruction](#start-with-an-instruction)

Imagine you want to build a slogan generator for marketing campaigns. Creating catchy slogans isn't always straightforward!

First, you'll need a prompt that makes it clear what you want. Let's start with an instruction. Submit this prompt to generate your first completion.

Create a slogan for a coffee shop.

Generate

...

Not bad! Now, try making your instruction more specific.

Create a slogan for an organic coffee shop.

Generate

...

Introducing a single descriptive term to our prompt influences the completion. Essentially, crafting your prompt is the means by which you "instruct" or "program" the model.

### [Include examples](#include-examples)

Clear instructions are key for quality outcomes, but that might not always be enough. Let's try to enhance your instruction further.

Create three slogans for a coffee shop with live music.

Generate

...

These slogans are fine, but could be even better. It appears the model overlooked the 'live' part in our prompt. Let's change it slightly to generate more appropriate suggestions.

Often, it's beneficial to both demonstrate and tell the model your requirements. Incorporating examples in your prompt can aid in conveying patterns or subtleties. Test this prompt that carries a few examples.

Create three slogans for a business with unique features. Business: Bookstore with cats Slogans: "Purr-fect Pages", "Books and Whiskers", "Novels and Nuzzles" Business: Gym with rock climbing Slogans: "Peak Performance", "Reach New Heights", "Climb Your Way Fit" Business: Coffee shop with live music Slogans:

Generate

...

Great! Incorporating examples of expected output for a certain input prompted the model to generate the kind of names we aimed for.

### [Tweak your settings](#tweak-your-settings)

Apart from designing prompts, you can influence completions by tweaking model settings. A crucial setting is the **temperature**.

You might have seen that the same prompt, when repeated, yielded the same or nearly the same completions. This happens when your temperature is at 0.

Attempt to re-submit the identical prompt a few times with temperature set to 1.

Temperature

Create three slogans for a business with unique features. Business: Bookstore with cats Slogans: "Purr-fect Pages", "Books and Whiskers", "Novels and Nuzzles" Business: Gym with rock climbing Slogans: "Peak Performance", "Reach New Heights", "Climb Your Way Fit" Business: Coffee shop with live music Slogans:

Generate

...

Notice the difference? With a temperature above 0, the same prompt delivers varied completions each time.

Keep in mind that the model forecasts the text most likely to follow the preceding text. Temperature, a value from 0 to 1, essentially governs the model's confidence level in making these predictions. A lower temperature implies lesser risks, leading to more precise and deterministic completions. A higher temperature yields a broader range of completions.

For your slogan generator, you might want a large pool of name suggestions. A moderate temperature of 0.6 should serve well.

## [Recommended Resources](#recommended-resources)

Prompt Engineering is evolving rapidly, with new methods and research papers surfacing every week. Here are some resources that we've found useful for learning about and experimenting with prompt engineering:

-   [The Vercel AI Playground](../../playground.html)
-   [Brex Prompt Engineering](https://github.com/brexhq/prompt-engineering)
-   [Prompt Engineering Guide by Dair AI](https://www.promptingguide.ai/)

[Previous

Advanced

](../advanced.html)

[Next

Stopping Streams

](stopping-streams.html)

On this page

[Prompt Engineering](#prompt-engineering)

[What is a Large Language Model (LLM)?](#what-is-a-large-language-model-llm)

[What is a prompt?](#what-is-a-prompt)

[Why is prompt engineering needed?](#why-is-prompt-engineering-needed)

[Example: Build a Slogan Generator](#example-build-a-slogan-generator)

[Start with an instruction](#start-with-an-instruction)

[Include examples](#include-examples)

[Tweak your settings](#tweak-your-settings)

[Recommended Resources](#recommended-resources)

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