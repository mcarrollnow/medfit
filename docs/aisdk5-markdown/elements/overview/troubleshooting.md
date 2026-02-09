Introduction: Troubleshooting

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

[Setup](setup.html)

[Usage](usage.html)

[Troubleshooting](troubleshooting.html)

[Examples](../examples.html)

[Chatbot](../examples/chatbot.html)

[v0 clone](../examples/v0.html)

[Workflow](../examples/workflow.html)

[Components](../components.html)

[Chatbot](../components/chatbot.html)

[Actions](../components/actions.html)

[Branch](../components/branch.html)

[Chain of Thought](../components/chain-of-thought.html)

[Code Block](../components/code-block.html)

[Context](../components/context.html)

[Conversation](../components/conversation.html)

[Image](../components/image.html)

[Inline Citation](../components/inline-citation.html)

[Loader](../components/loader.html)

[Message](../components/message.html)

[Open In Chat](../components/open-in-chat.html)

[Plan](../components/plan.html)

[Prompt Input](../components/prompt-input.html)

[Queue](../components/queue.html)

[Reasoning](../components/reasoning.html)

[Response](../components/response.html)

[Shimmer](../components/shimmer.html)

[Sources](../components/sources.html)

[Suggestion](../components/suggestion.html)

[Task](../components/task.html)

[Tool](../components/tool.html)

[Workflow](../components/workflow.html)

[Canvas](../components/canvas.html)

[Connection](../components/connection.html)

[Controls](../components/controls.html)

[Edge](../components/edge.html)

[Node](../components/node.html)

[Panel](../components/panel.html)

[Toolbar](../components/toolbar.html)

[Vibe Coding](../components/vibe-coding.html)

[Artifact](../components/artifact.html)

[Web Preview](../components/web-preview.html)

[Introduction](../overview.html)Troubleshooting

# [Troubleshooting](#troubleshooting)

## [Why are my components not styled?](#why-are-my-components-not-styled)

Make sure your project is configured correctly for shadcn/ui in Tailwind 4 - this means having a `globals.css` file that imports Tailwind and includes the shadcn/ui base styles.

## [I ran the AI Elements CLI but nothing was added to my project](#i-ran-the-ai-elements-cli-but-nothing-was-added-to-my-project)

Double-check that:

-   Your current working directory is the root of your project (where `package.json` lives).
-   Your components.json file (if using shadcn-style config) is set up correctly.
-   You’re using the latest version of the AI Elements CLI:

```bash
npx ai-elements@latest
```

If all else fails, feel free to open an [issue on GitHub](https://github.com/vercel/ai-elements/issues).

## [Theme switching doesn’t work — my app stays in light mode](#theme-switching-doesnt-work--my-app-stays-in-light-mode)

Ensure your app is using the same data-theme system that shadcn/ui and AI Elements expect. The default implementation toggles a data-theme attribute on the `<html>` element. Make sure your tailwind.config.js is using class or data- selectors accordingly:

## [The component imports fail with “module not found”](#the-component-imports-fail-with-module-not-found)

Check the file exists. If it does, make sure your `tsconfig.json` has a proper paths alias for `@/` i.e.

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

## [My AI coding assistant can't access AI Elements components](#my-ai-coding-assistant-cant-access-ai-elements-components)

1.  Verify your config file syntax is valid JSON.
2.  Check that the file path is correct for your AI tool.
3.  Restart your coding assistant after making changes.
4.  Ensure you have a stable internet connection.

## [Still stuck?](#still-stuck)

If none of these answers help, open an [issue on GitHub](https://github.com/vercel/ai-elements/issues) and someone will be happy to assist.

[Previous

Usage

](usage.html)

[Next

Examples

](../examples.html)

On this page

[Troubleshooting](#troubleshooting)

[Why are my components not styled?](#why-are-my-components-not-styled)

[I ran the AI Elements CLI but nothing was added to my project](#i-ran-the-ai-elements-cli-but-nothing-was-added-to-my-project)

[Theme switching doesn’t work — my app stays in light mode](#theme-switching-doesnt-work--my-app-stays-in-light-mode)

[The component imports fail with “module not found”](#the-component-imports-fail-with-module-not-found)

[My AI coding assistant can't access AI Elements components](#my-ai-coding-assistant-cant-access-ai-elements-components)

[Still stuck?](#still-stuck)

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