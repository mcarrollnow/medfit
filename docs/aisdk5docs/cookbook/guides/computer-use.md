AI SDK 5 is available now.










Menu


























































































































































































































































































































































































# [Get started with Computer Use](#get-started-with-computer-use)


The AI SDK is a powerful TypeScript toolkit for building AI applications with large language models (LLMs) like Anthropic's Claude alongside popular frameworks like React, Next.js, Vue, Svelte, Node.js, and more. In this guide, you will learn how to integrate Computer Use into your AI SDK applications.







## [Computer Use](#computer-use)

Anthropic recently released a new version of the Claude 3.5 Sonnet model which is capable of 'Computer Use'. This allows the model to interact with computer interfaces through basic actions like:

- Moving the cursor
- Clicking buttons
- Typing text
- Taking screenshots
- Reading screen content

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


- A containerized environment configured for safe Computer Use
- Ready-to-use (Python) implementations of Computer Use tools
- An agent loop for API interaction and tool execution
- A web interface for monitoring and control

This reference implementation serves as a foundation to understand the requirements before building your own custom solution.

## [Getting Started with the AI SDK](#getting-started-with-the-ai-sdk)




If you have never used the AI SDK before, start by following the [Getting Started guide](../../docs/getting-started.html).









First, ensure you have the AI SDK and [Anthropic AI SDK provider](../../providers/ai-sdk-providers/anthropic.html) installed:



``` geist-overflow-scroll-y
pnpm add ai @ai-sdk/anthropic
```










You can add Computer Use to your AI SDK applications using provider-defined-client tools. These tools accept various input parameters (like display height and width in the case of the computer tool) and then require that you define an execute function.

Here's how you could set up the Computer Tool with the AI SDK:



``` ts
import  from '@ai-sdk/anthropic';import  from '@/utils/computer-use';
const computerTool = anthropic.tools.computer_20250124() => ;      }      default:     }  },  toModelOutput(result) ]      : [];  },});
```


The `computerTool` handles two main actions: taking screenshots via `getScreenshot()` and executing computer actions like mouse movements and clicks through `executeComputerAction()`. Remember, you have to implement this execution logic (eg. the `getScreenshot` and `executeComputerAction` functions) to handle the actual computer interactions. The `execute` function should handle all low-level interactions with the operating system.

Finally, to send tool results back to the model, use the [`toModelOutput()`](../../docs/foundations/prompts.html#multi-modal-tool-results) function to convert text and image responses into a format the model can process. The AI SDK includes experimental support for these multi-modal tool results when using Anthropic's models.




Computer Use requires appropriate safety measures like using virtual machines, limiting access to sensitive data, and implementing human oversight for critical actions.



### [Using Computer Tools with Text Generation](#using-computer-tools-with-text-generation)

Once your tool is defined, you can use it with both the [`generateText`](../../docs/reference/ai-sdk-core/generate-text.html) and [`streamText`](../../docs/reference/ai-sdk-core/stream-text.html) functions.

For one-shot text generation, use `generateText`:



``` ts
const result = await generateText(,});
console.log(result.text);
```


For streaming responses, use `streamText` to receive updates in real-time:



``` ts
const result = streamText(,});
for await (const chunk of result.textStream) 
```


### [Configure Multi-Step (Agentic) Generations](#configure-multi-step-agentic-generations)

To allow the model to perform multiple steps without user intervention, use the `stopWhen` parameter. This will automatically send any tool results back to the model to trigger a subsequent generation:



``` ts
import  from 'ai';
const stream = streamText(,  stopWhen: stepCountIs(10), // experiment with this value based on your use case});
```


### [Combine Multiple Tools](#combine-multiple-tools)

You can combine multiple tools in a single request to enable more complex workflows. The AI SDK supports all three of Claude's Computer Use tools:



``` ts
const computerTool = anthropic.tools.computer_20250124();
const bashTool = anthropic.tools.bash_20250124() => execSync(command).toString()});
const textEditorTool = anthropic.tools.textEditor_20250124() => );    }  }});

const response = await generateText(,});
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
















On this page















































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.