AI SDK 5 is available now.










Menu






















































































































































































































































































































































# [Vue.js (Nuxt) Quickstart](#vuejs-nuxt-quickstart)

The AI SDK is a powerful Typescript library designed to help developers build AI-powered applications.

In this quickstart tutorial, you'll build a simple AI-chatbot with a streaming user interface. Along the way, you'll learn key concepts and techniques that are fundamental to using the SDK in your own projects.

If you are unfamiliar with the concepts of [Prompt Engineering](../advanced/prompt-engineering.html) and [HTTP Streaming](../foundations/streaming.html), you can optionally read these documents first.

## [Prerequisites](#prerequisites)

To follow this quickstart, you'll need:

- Node.js 18+ and pnpm installed on your local development machine.
- An OpenAI API key.


## [Setup Your Application](#setup-your-application)

Start by creating a new Nuxt application. This command will create a new directory named `my-ai-app` and set up a basic Nuxt application inside it.



``` geist-overflow-scroll-y
pnpm create nuxt my-ai-app
```










Navigate to the newly created directory:



``` geist-overflow-scroll-y
cd my-ai-app
```










### [Install dependencies](#install-dependencies)

Install `ai` and `@ai-sdk/openai`, the AI SDK's OpenAI provider.




The AI SDK is designed to be a unified interface to interact with any large language model. This means that you can change model and providers with just one line of code! Learn more about [available providers](../../providers/ai-sdk-providers.html) and [building custom providers](../../providers/community-providers/custom-providers.html) in the [providers](../../providers/ai-sdk-providers.html) section.









pnpm







npm







yarn







bun








``` geist-overflow-scroll-y
pnpm add ai @ai-sdk/openai @ai-sdk/vue zod
```













### [Configure OpenAI API key](#configure-openai-api-key)

Create a `.env` file in your project root and add your OpenAI API Key. This key is used to authenticate your application with the OpenAI service.



``` geist-overflow-scroll-y
touch .env
```










Edit the `.env` file:













``` env
NUXT_OPENAI_API_KEY=xxxxxxxxx
```


Replace `xxxxxxxxx` with your actual OpenAI API key and configure the environment variable in `nuxt.config.ts`:












``` ts
export default defineNuxtConfig(,});
```





The AI SDK's OpenAI Provider will default to using the `OPENAI_API_KEY` environment variable.



## [Create an API route](#create-an-api-route)

Create an API route, `server/api/chat.ts` and add the following code:












``` typescript
import  from 'ai';import  from '@ai-sdk/openai';
export default defineLazyEventHandler(async () => );
  return defineEventHandler(async (event: any) => :  = await readBody(event);
    const result = streamText();
    return result.toUIMessageStreamResponse();  });});
```


Let's take a look at what is happening in this code:

1.  Create an OpenAI provider instance with the `createOpenAI` function from the `@ai-sdk/openai` package.
2.  Define an Event Handler and extract `messages` from the body of the request. The `messages` variable contains a history of the conversation between you and the chatbot and provides the chatbot with the necessary context to make the next generation. The `messages` are of UIMessage type, which are designed for use in application UI - they contain the entire message history and associated metadata like timestamps.
3.  Call [`streamText`](../reference/ai-sdk-core/stream-text.html), which is imported from the `ai` package. This function accepts a configuration object that contains a `model` provider (defined in step 1) and `messages` (defined in step 2). You can pass additional [settings](../ai-sdk-core/settings.html) to further customise the model's behaviour. The `messages` key expects a `ModelMessage[]` array. This type is different from `UIMessage` in that it does not include metadata, such as timestamps or sender information. To convert between these types, we use the `convertToModelMessages` function, which strips the UI-specific metadata and transforms the `UIMessage[]` array into the `ModelMessage[]` format that the model expects.
5.  Return the result to the client to stream the response.

## [Wire up the UI](#wire-up-the-ui)

Now that you have an API route that can query an LLM, it's time to setup your frontend. The AI SDK's [UI](../ai-sdk-ui/overview.html) package abstract the complexity of a chat interface into one hook, [`useChat`](../reference/ai-sdk-ui/use-chat.html).

Update your root page (`pages/index.vue`) with the following code to show a list of chat messages and provide a user message input:












``` typescript
<script setup lang="ts">import  from "@ai-sdk/vue";import  from "vue";
const input = ref("");const chat = new Chat();
const handleSubmit = (e: Event) => );    input.value = "";};</script>
```





If your project has `app.vue` instead of `pages/index.vue`, delete the `app.vue` file and create a new `pages/index.vue` file with the code above.



This page utilizes the `useChat` hook, which will, by default, use the API route you created earlier (`/api/chat`). The hook provides functions and state for handling user input and form submission. The `useChat` hook provides multiple utility functions and state variables:

- `messages` - the current chat messages (an array of objects with `id`, `role`, and `parts` properties).
- `sendMessage` - a function to send a message to the chat API.

The component uses local state (`ref`) to manage the input field value, and handles form submission by calling `sendMessage` with the input text and then clearing the input field.

The LLM's response is accessed through the message `parts` array. Each message contains an ordered array of `parts` that represents everything the model generated in its response. These parts can include plain text, reasoning tokens, and more that you will see later. The `parts` array preserves the sequence of the model's outputs, allowing you to display or process each component in the order it was generated.

## [Running Your Application](#running-your-application)

With that, you have built everything you need for your chatbot! To start your application, use the command:



``` geist-overflow-scroll-y
pnpm run dev
```











## [Enhance Your Chatbot with Tools](#enhance-your-chatbot-with-tools)

While large language models (LLMs) have incredible generation capabilities, they struggle with discrete tasks (e.g. mathematics) and interacting with the outside world (e.g. getting the weather). This is where [tools](../ai-sdk-core/tools-and-tool-calling.html) come in.

Tools are actions that an LLM can invoke. The results of these actions can be reported back to the LLM to be considered in the next response.

For example, if a user asks about the current weather, without tools, the model would only be able to provide general information based on its training data. But with a weather tool, it can fetch and provide up-to-date, location-specific weather information.

Let's enhance your chatbot by adding a simple weather tool.

### [Update Your API Route](#update-your-api-route)

Modify your `server/api/chat.ts` file to include the new weather tool:












``` typescript
import  from 'ai';import  from '@ai-sdk/openai';import  from 'zod';
export default defineLazyEventHandler(async () => );
  return defineEventHandler(async (event: any) => :  = await readBody(event);
    const result = streamText(),          execute: async () => ;          },        }),      },    });
    return result.toUIMessageStreamResponse();  });});
```


In this updated code:

1.  You import the `tool` function from the `ai` package and `z` from `zod` for schema validation.

2.  You define a `tools` object with a `weather` tool. This tool:

    - Has a description that helps the model understand when to use it.
    - Defines `inputSchema` using a Zod schema, specifying that it requires a `location` string to execute this tool. The model will attempt to extract this input from the context of the conversation. If it can't, it will ask the user for the missing information.
    - Defines an `execute` function that simulates getting weather data (in this case, it returns a random temperature). This is an asynchronous function running on the server so you can fetch real data from an external API.

Now your chatbot can "fetch" weather information for any location the user asks about. When the model determines it needs to use the weather tool, it will generate a tool call with the necessary input. The `execute` function will then be automatically run, and the tool output will be added to the `messages` as a `tool` message.

Try asking something like "What's the weather in New York?" and see how the model uses the new tool.

Notice the blank response in the UI? This is because instead of generating a text response, the model generated a tool call. You can access the tool call and subsequent tool result on the client via the `tool-weather` part of the `message.parts` array.




Tool parts are always named `tool-`, where `` is the key you used when defining the tool. In this case, since we defined the tool as `weather`, the part type is `tool-weather`.



### [Update the UI](#update-the-ui)

To display the tool invocation in your UI, update your `pages/index.vue` file:












``` typescript
<script setup lang="ts">import  from "@ai-sdk/vue";import  from "vue";
const input = ref("");const chat = new Chat();
const handleSubmit = (e: Event) => );    input.value = "";};</script>
```


With this change, you're updating the UI to handle different message parts. For text parts, you display the text content as before. For weather tool invocations, you display a JSON representation of the tool call and its result.

Now, when you ask about the weather, you'll see the tool call and its result displayed in your chat interface.

## [Enabling Multi-Step Tool Calls](#enabling-multi-step-tool-calls)

You may have noticed that while the tool is now visible in the chat interface, the model isn't using this information to answer your original query. This is because once the model generates a tool call, it has technically completed its generation.

To solve this, you can enable multi-step tool calls using `stopWhen`. By default, `stopWhen` is set to `stepCountIs(1)`, which means generation stops after the first step when there are tool results. By changing this condition, you can allow the model to automatically send tool results back to itself to trigger additional generations until your specified stopping condition is met. In this case, you want the model to continue generating so it can use the weather tool results to answer your original question.

### [Update Your API Route](#update-your-api-route-1)

Modify your `server/api/chat.ts` file to include the `stopWhen` condition:












``` typescript
import  from 'ai';import  from '@ai-sdk/openai';import  from 'zod';
export default defineLazyEventHandler(async () => );
  return defineEventHandler(async (event: any) => :  = await readBody(event);
    const result = streamText(),          execute: async () => ;          },        }),      },    });
    return result.toUIMessageStreamResponse();  });});
```


Head back to the browser and ask about the weather in a location. You should now see the model using the weather tool results to answer your question.

By setting `stopWhen: stepCountIs(5)`, you're allowing the model to use up to 5 "steps" for any given generation. This enables more complex interactions and allows the model to gather and process information over several steps if needed. You can see this in action by adding another tool to convert the temperature from Fahrenheit to Celsius.

### [Add another tool](#add-another-tool)

Update your `server/api/chat.ts` file to add a new tool to convert the temperature from Fahrenheit to Celsius:












``` typescript
import  from 'ai';import  from '@ai-sdk/openai';import  from 'zod';
export default defineLazyEventHandler(async () => );
  return defineEventHandler(async (event: any) => :  = await readBody(event);
    const result = streamText(),          execute: async () => ;          },        }),        convertFahrenheitToCelsius: tool(),          execute: async () => ;          },        }),      },    });
    return result.toUIMessageStreamResponse();  });});
```


### [Update Your Frontend](#update-your-frontend)

Update your UI to handle the new temperature conversion tool by modifying the tool part handling:












``` typescript
<script setup lang="ts">import  from "@ai-sdk/vue";import  from "vue";
const input = ref("");const chat = new Chat();
const handleSubmit = (e: Event) => );    input.value = "";};</script>
```


This update handles the new `tool-convertFahrenheitToCelsius` part type, displaying the temperature conversion tool calls and results in the UI.

Now, when you ask "What's the weather in New York in celsius?", you should see a more complete interaction:

1.  The model will call the weather tool for New York.
2.  You'll see the tool output displayed.
3.  It will then call the temperature conversion tool to convert the temperature from Fahrenheit to Celsius.
4.  The model will then use that information to provide a natural language response about the weather in New York.

This multi-step approach allows the model to gather information and use it to provide more accurate and contextual responses, making your chatbot considerably more useful.

This simple example demonstrates how tools can expand your model's capabilities. You can create more complex tools to integrate with real APIs, databases, or any other external systems, allowing the model to access and process real-world data in real-time. Tools bridge the gap between the model's knowledge cutoff and current information.

## [Where to Next?](#where-to-next)

You've built an AI chatbot using the AI SDK! From here, you have several paths to explore:

- To learn more about the AI SDK, read through the [documentation](../introduction.html).
- If you're interested in diving deeper with guides, check out the [RAG (retrieval-augmented generation)](../../cookbook/guides/rag-chatbot.html) and [multi-modal chatbot](../../cookbook/guides/multi-modal-chatbot.html) guides.
















On this page
































































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.