Guides: Get started with Computer Use

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
    
    ](../../elements/overview.html)
-   [AI GatewayGateway](https://vercel.com/ai-gateway)

AI SDK 5 is available now.

[View Announcement](https://vercel.com/blog/ai-sdk-5)

Menu

[Guides](../guides.html)

[RAG Agent](rag-chatbot.html)

[Multi-Modal Agent](multi-modal-chatbot.html)

[Slackbot Agent Guide](slackbot.html)

[Natural Language Postgres](natural-language-postgres.html)

[Get started with Computer Use](computer-use.html)

[Get started with Gemini 2.5](gemini-2-5.html)

[Get started with Claude 4](claude-4.html)

[OpenAI Responses API](openai-responses.html)

[Google Gemini Image Generation](google-gemini-image-generation.html)

[Get started with Claude 3.7 Sonnet](sonnet-3-7.html)

[Get started with Llama 3.1](llama-3_1.html)

[Get started with GPT-5](gpt-5.html)

[Get started with OpenAI o1](o1.html)

[Get started with OpenAI o3-mini](o3.html)

[Get started with DeepSeek R1](r1.html)

[Next.js](../next/generate-text.html)

[Generate Text](../next/generate-text.html)

[Generate Text with Chat Prompt](../next/generate-text-with-chat-prompt.html)

[Generate Image with Chat Prompt](../next/generate-image-with-chat-prompt.html)

[Stream Text](../next/stream-text.html)

[Stream Text with Chat Prompt](../next/stream-text-with-chat-prompt.html)

[Stream Text with Image Prompt](../next/stream-text-with-image-prompt.html)

[Chat with PDFs](../next/chat-with-pdf.html)

[streamText Multi-Step Cookbook](../next/stream-text-multistep.html)

[Markdown Chatbot with Memoization](../next/markdown-chatbot-with-memoization.html)

[Generate Object](../next/generate-object.html)

[Generate Object with File Prompt through Form Submission](../next/generate-object-with-file-prompt.html)

[Stream Object](../next/stream-object.html)

[Call Tools](../next/call-tools.html)

[Call Tools in Multiple Steps](../next/call-tools-multiple-steps.html)

[Model Context Protocol (MCP) Tools](../next/mcp-tools.html)

[Share useChat State Across Components](../next/use-shared-chat-context.html)

[Human-in-the-Loop Agent with Next.js](../next/human-in-the-loop.html)

[Send Custom Body from useChat](../next/send-custom-body-from-use-chat.html)

[Render Visual Interface in Chat](../next/render-visual-interface-in-chat.html)

[Caching Middleware](../next/caching-middleware.html)

[Node](../node/generate-text.html)

[Generate Text](../node/generate-text.html)

[Generate Text with Chat Prompt](../node/generate-text-with-chat-prompt.html)

[Generate Text with Image Prompt](../node/generate-text-with-image-prompt.html)

[Stream Text](../node/stream-text.html)

[Stream Text with Chat Prompt](../node/stream-text-with-chat-prompt.html)

[Stream Text with Image Prompt](../node/stream-text-with-image-prompt.html)

[Stream Text with File Prompt](../node/stream-text-with-file-prompt.html)

[Generate Object with a Reasoning Model](../node/generate-object-reasoning.html)

[Generate Object](../node/generate-object.html)

[Stream Object](../node/stream-object.html)

[Stream Object with Image Prompt](../node/stream-object-with-image-prompt.html)

[Record Token Usage After Streaming Object](../node/stream-object-record-token-usage.html)

[Record Final Object after Streaming Object](../node/stream-object-record-final-object.html)

[Call Tools](../node/call-tools.html)

[Call Tools with Image Prompt](../node/call-tools-with-image-prompt.html)

[Call Tools in Multiple Steps](../node/call-tools-multiple-steps.html)

[Model Context Protocol (MCP) Tools](../node/mcp-tools.html)

[Manual Agent Loop](../node/manual-agent-loop.html)

[Web Search Agent](../node/web-search-agent.html)

[Embed Text](../node/embed-text.html)

[Embed Text in Batch](../node/embed-text-batch.html)

[Intercepting Fetch Requests](../node/intercept-fetch-requests.html)

[Local Caching Middleware](../node/local-caching-middleware.html)

[Retrieval Augmented Generation](../node/retrieval-augmented-generation.html)

[Knowledge Base Agent](../node/knowledge-base-agent.html)

[API Servers](../api-servers/node-http-server.html)

[Node.js HTTP Server](../api-servers/node-http-server.html)

[Express](../api-servers/express.html)

[Hono](../api-servers/hono.html)

[Fastify](../api-servers/fastify.html)

[Nest.js](../api-servers/nest.html)

[React Server Components](../rsc/generate-text.html)

[Guides](../guides.html)Get started with Computer Use

# [Get started with Computer Use](#get-started-with-computer-use)

With the [release of Computer Use in Claude 3.5 Sonnet](https://www.anthropic.com/news/3-5-models-and-computer-use), you can now direct AI models to interact with computers like humans do - moving cursors, clicking buttons, and typing text. This capability enables automation of complex tasks while leveraging Claude's advanced reasoning abilities.

The AI SDK is a powerful TypeScript toolkit for building AI applications with large language models (LLMs) like Anthropic's Claude alongside popular frameworks like React, Next.js, Vue, Svelte, Node.js, and more. In this guide, you will learn how to integrate Computer Use into your AI SDK applications.

Computer Use is currently in beta with some [limitations](https://docs.anthropic.com/en/docs/build-with-claude/computer-use#understand-computer-use-limitations) . The feature may be error-prone at times. Anthropic recommends starting with low-risk tasks and implementing appropriate safety measures.

## [Computer Use](#computer-use)

Anthropic recently released a new version of the Claude 3.5 Sonnet model which is capable of 'Computer Use'. This allows the model to interact with computer interfaces through basic actions like:

-   Moving the cursor
-   Clicking buttons
-   Typing text
-   Taking screenshots
-   Reading screen content

## [How It Works](#how-it-works)

Computer Use enables the model to read and interact with on-screen content through a series of coordinated steps. Here's how the process works:

1.  **Start with a prompt and tools**
    
    Add Anthropic-defined Computer Use tools to your request and provide a task (prompt) for the model. For example: "save an image to your downloads folder."
    
2.  **Select the right tool**
    
    The model evaluates which computer tools can help accomplish the task. It then sends a formatted `tool_call` to use the appropriate tool.
    
3.  **Execute the action and return results**
    
    The AI SDK processes Claude's request by running the selected tool. The results can then be sent back to Claude through a `tool_result` message.
    
4.  **Complete the task through iterations**
    
    Claude analyzes each result to determine if more actions are needed. It continues requesting tool use and processing results until it completes your task or requires additional input.
    

### [Available Tools](#available-tools)

There are three main tools available in the Computer Use API:

1.  **Computer Tool**: Enables basic computer control like mouse movement, clicking, and keyboard input
2.  **Text Editor Tool**: Provides functionality for viewing and editing text files
3.  **Bash Tool**: Allows execution of bash commands

### [Implementation Considerations](#implementation-considerations)

Computer Use tools in the AI SDK are predefined interfaces that require your own implementation of the execution layer. While the SDK provides the type definitions and structure for these tools, you need to:

1.  Set up a controlled environment for Computer Use execution
2.  Implement core functionality like mouse control and keyboard input
3.  Handle screenshot capture and processing
4.  Set up rules and limits for how Claude can interact with your system

The recommended approach is to start with [Anthropic's reference implementation](https://github.com/anthropics/anthropic-quickstarts/tree/main/computer-use-demo) , which provides:

-   A containerized environment configured for safe Computer Use
-   Ready-to-use (Python) implementations of Computer Use tools
-   An agent loop for API interaction and tool execution
-   A web interface for monitoring and control

This reference implementation serves as a foundation to understand the requirements before building your own custom solution.

## [Getting Started with the AI SDK](#getting-started-with-the-ai-sdk)

If you have never used the AI SDK before, start by following the [Getting Started guide](../../docs/getting-started.html).

For a working example of Computer Use implementation with Next.js and the AI SDK, check out our [AI SDK Computer Use Template](https://github.com/vercel-labs/ai-sdk-computer-use).

First, ensure you have the AI SDK and [Anthropic AI SDK provider](../../providers/ai-sdk-providers/anthropic.html) installed:

pnpm add ai @ai-sdk/anthropic

You can add Computer Use to your AI SDK applications using provider-defined-client tools. These tools accept various input parameters (like display height and width in the case of the computer tool) and then require that you define an execute function.

Here's how you could set up the Computer Tool with the AI SDK:

```ts
import { anthropic } from '@ai-sdk/anthropic';
import { getScreenshot, executeComputerAction } from '@/utils/computer-use';


const computerTool = anthropic.tools.computer_20250124({
  displayWidthPx: 1920,
  displayHeightPx: 1080,
  execute: async ({ action, coordinate, text }) => {
    switch (action) {
      case 'screenshot': {
        return {
          type: 'image',
          data: getScreenshot(),
        };
      }
      default: {
        return executeComputerAction(action, coordinate, text);
      }
    }
  },
  toModelOutput(result) {
    return typeof result === 'string'
      ? [{ type: 'text', text: result }]
      : [{ type: 'image', data: result.data, mediaType: 'image/png' }];
  },
});
```

The `computerTool` handles two main actions: taking screenshots via `getScreenshot()` and executing computer actions like mouse movements and clicks through `executeComputerAction()`. Remember, you have to implement this execution logic (eg. the `getScreenshot` and `executeComputerAction` functions) to handle the actual computer interactions. The `execute` function should handle all low-level interactions with the operating system.

Finally, to send tool results back to the model, use the [`toModelOutput()`](../../docs/foundations/prompts.html#multi-modal-tool-results) function to convert text and image responses into a format the model can process. The AI SDK includes experimental support for these multi-modal tool results when using Anthropic's models.

Computer Use requires appropriate safety measures like using virtual machines, limiting access to sensitive data, and implementing human oversight for critical actions.

### [Using Computer Tools with Text Generation](#using-computer-tools-with-text-generation)

Once your tool is defined, you can use it with both the [`generateText`](../../docs/reference/ai-sdk-core/generate-text.html) and [`streamText`](../../docs/reference/ai-sdk-core/stream-text.html) functions.

For one-shot text generation, use `generateText`:

```ts
const result = await generateText({
  model: anthropic('claude-sonnet-4-20250514'),
  prompt: 'Move the cursor to the center of the screen and take a screenshot',
  tools: { computer: computerTool },
});


console.log(result.text);
```

For streaming responses, use `streamText` to receive updates in real-time:

```ts
const result = streamText({
  model: anthropic('claude-sonnet-4-20250514'),
  prompt: 'Open the browser and navigate to vercel.com',
  tools: { computer: computerTool },
});


for await (const chunk of result.textStream) {
  console.log(chunk);
}
```

### [Configure Multi-Step (Agentic) Generations](#configure-multi-step-agentic-generations)

To allow the model to perform multiple steps without user intervention, use the `stopWhen` parameter. This will automatically send any tool results back to the model to trigger a subsequent generation:

```ts
import { stepCountIs } from 'ai';


const stream = streamText({
  model: anthropic('claude-sonnet-4-20250514'),
  prompt: 'Open the browser and navigate to vercel.com',
  tools: { computer: computerTool },
  stopWhen: stepCountIs(10), // experiment with this value based on your use case
});
```

### [Combine Multiple Tools](#combine-multiple-tools)

You can combine multiple tools in a single request to enable more complex workflows. The AI SDK supports all three of Claude's Computer Use tools:

```ts
const computerTool = anthropic.tools.computer_20250124({
  ...
});


const bashTool = anthropic.tools.bash_20250124({
  execute: async ({ command, restart }) => execSync(command).toString()
});


const textEditorTool = anthropic.tools.textEditor_20250124({
  execute: async ({
    command,
    path,
    file_text,
    insert_line,
    new_str,
    old_str,
    view_range
  }) => {
    // Handle file operations based on command
    switch(command) {
      return executeTextEditorFunction({
        command,
        path,
        fileText: file_text,
        insertLine: insert_line,
        newStr: new_str,
        oldStr: old_str,
        viewRange: view_range
      });
    }
  }
});




const response = await generateText({
  model: anthropic("claude-sonnet-4-20250514"),
  prompt: "Create a new file called example.txt, write 'Hello World' to it, and run 'cat example.txt' in the terminal",
  tools: {
    computer: computerTool,
    bash: bashTool,
    str_replace_editor: textEditorTool,
  },
});
```

Always implement appropriate [security measures](#security-measures) and obtain user consent before enabling Computer Use in production applications.

### [Best Practices for Computer Use](#best-practices-for-computer-use)

To get the best results when using Computer Use:

1.  Specify simple, well-defined tasks with explicit instructions for each step
2.  Prompt Claude to verify outcomes through screenshots
3.  Use keyboard shortcuts when UI elements are difficult to manipulate
4.  Include example screenshots for repeatable tasks
5.  Provide explicit tips in system prompts for known tasks

## [Security Measures](#security-measures)

Remember, Computer Use is a beta feature. Please be aware that it poses unique risks that are distinct from standard API features or chat interfaces. These risks are heightened when using Computer Use to interact with the internet. To minimize risks, consider taking precautions such as:

1.  Use a dedicated virtual machine or container with minimal privileges to prevent direct system attacks or accidents.
2.  Avoid giving the model access to sensitive data, such as account login information, to prevent information theft.
3.  Limit internet access to an allowlist of domains to reduce exposure to malicious content.
4.  Ask a human to confirm decisions that may result in meaningful real-world consequences as well as any tasks requiring affirmative consent, such as accepting cookies, executing financial transactions, or agreeing to terms of service.

[Previous

Natural Language Postgres

](natural-language-postgres.html)

[Next

Get started with Gemini 2.5

](gemini-2-5.html)

On this page

[Get started with Computer Use](#get-started-with-computer-use)

[Computer Use](#computer-use)

[How It Works](#how-it-works)

[Available Tools](#available-tools)

[Implementation Considerations](#implementation-considerations)

[Getting Started with the AI SDK](#getting-started-with-the-ai-sdk)

[Using Computer Tools with Text Generation](#using-computer-tools-with-text-generation)

[Configure Multi-Step (Agentic) Generations](#configure-multi-step-agentic-generations)

[Combine Multiple Tools](#combine-multiple-tools)

[Best Practices for Computer Use](#best-practices-for-computer-use)

[Security Measures](#security-measures)

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