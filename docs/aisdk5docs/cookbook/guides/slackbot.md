AI SDK 5 is available now.










Menu


























































































































































































































































































































































































# [Building an AI Agent in Slack with the AI SDK](#building-an-ai-agent-in-slack-with-the-ai-sdk)

In this guide, you will learn how to build a Slackbot powered by the AI SDK. The bot will be able to respond to direct messages and mentions in channels using the full context of the thread.

## [Slack App Setup](#slack-app-setup)

Before we start building, you'll need to create and configure a Slack app:

2.  Click "Create New App" and choose "From scratch"
3.  Give your app a name and select your workspace
4.  Under "OAuth & Permissions", add the following bot token scopes:
    - `app_mentions:read`
    - `chat:write`
    - `im:history`
    - `im:write`
    - `assistant:write`
5.  Install the app to your workspace (button under "OAuth Tokens" subsection)
6.  Copy the Bot User OAuth Token and Signing Secret for the next step
7.  Under App Home -\> Show Tabs -\> Chat Tab, check "Allow users to send Slash commands and messages from the chat tab"

## [Project Setup](#project-setup)

This project uses the following stack:

- [AI SDK by Vercel](../../docs/introduction.html)

## [Getting Started](#getting-started)




``` geist-overflow-scroll-y
git clone https://github.com/vercel-labs/ai-sdk-slackbot.git
```

``` geist-overflow-scroll-y
cd ai-sdk-slackbot
```

``` geist-overflow-scroll-y
git checkout starter
```










2.  Install dependencies



``` geist-overflow-scroll-y
pnpm install
```










## [Project Structure](#project-structure)

The starter repository already includes:

- Slack utilities (`lib/slack-utils.ts`) including functions for validating incoming requests, converting Slack threads to AI SDK compatible message formats, and getting the Slackbot's user ID
- General utility functions (`lib/utils.ts`) including initial Exa setup
- Files to handle the different types of Slack events (`lib/handle-messages.ts` and `lib/handle-app-mention.ts`)
- An API endpoint (`POST`) for Slack events (`api/events.ts`)

## [Event Handler](#event-handler)

First, let's take a look at our API route (`api/events.ts`):



``` typescript
import type  from '@slack/web-api';import  from '../lib/handle-messages';import  from '@vercel/functions';import  from '../lib/handle-app-mention';import  from '../lib/slack-utils';
export async function POST(request: Request) );  }
  await verifyRequest();
  try 
    if (event.type === 'assistant_thread_started') 
    if (      event.type === 'message' &&      !event.subtype &&      event.channel_type === 'im' &&      !event.bot_id &&      !event.bot_profile &&      event.bot_id !== botUserId    ) 
    return new Response('Success!', );  } catch (error) );  }}
```


This file defines a `POST` function that handles incoming requests from Slack. First, you check the request type to see if it's a URL verification request. If it is, you respond with the challenge string provided by Slack. If it's an event callback, you verify the request and then have access to the event data. This is where you can implement your event handling logic.

You then handle three types of events: `app_mention`, `assistant_thread_started`, and `message`:

- For `app_mention`, you call `handleNewAppMention` with the event and the bot user ID.
- For `assistant_thread_started`, you call `assistantThreadMessage` with the event.
- For `message`, you call `handleNewAssistantMessage` with the event and the bot user ID.

Finally, you respond with a success message to Slack. Note, each handler function is wrapped in a `waitUntil` function. Let's take a look at what this means and why it's important.

### [The waitUntil Function](#the-waituntil-function)

Slack expects a response within 3 seconds to confirm the request is being handled. However, generating AI responses can take longer. If you don't respond to the Slack request within 3 seconds, Slack will send another request, leading to another invocation of your API route, another call to the LLM, and ultimately another response to the user. To solve this, you can use the `waitUntil` function, which allows you to run your AI logic after the response is sent, without blocking the response itself.

This means, your API endpoint will:

1.  Immediately respond to Slack (within 3 seconds)
2.  Continue processing the message asynchronously
3.  Send the AI response when it's ready

## [Event Handlers](#event-handlers)

Let's look at how each event type is currently handled.

### [App Mentions](#app-mentions)

When a user mentions your bot in a channel, the `app_mention` event is triggered. The `handleNewAppMention` function in `handle-app-mention.ts` processes these mentions:

1.  Checks if the message is from a bot to avoid infinite response loops
2.  Creates a status updater to show the bot is "thinking"
3.  If the mention is in a thread, it retrieves the thread history
4.  Calls the LLM with the message content (using the `generateResponse` function which you will implement in the next section)
5.  Updates the initial "thinking" message with the AI response

Here's the code for the `handleNewAppMention` function:












``` typescript
import  from '@slack/web-api';import  from './slack-utils';import  from './ai';
const updateStatusUtil = async (  initialStatus: string,  event: AppMentionEvent,) => );
  if (!initialMessage || !initialMessage.ts)    throw new Error('Failed to post initial message');
  const updateMessage = async (status: string) => );  };  return updateMessage;};
export async function handleNewAppMention(  event: AppMentionEvent,  botUserId: string,) 
  const  = event;  const updateMessage = await updateStatusUtil('is thinking...', event);
  if (thread_ts)  else ],      updateMessage,    );    updateMessage(result);  }}
```


Now let's see how new assistant threads and messages are handled.

### [Assistant Thread Messages](#assistant-thread-messages)

When a user starts a thread with your assistant, the `assistant_thread_started` event is triggered. The `assistantThreadMessage` function in `handle-messages.ts` handles this:

1.  Posts a welcome message to the thread
2.  Sets up suggested prompts to help users get started

Here's the code for the `assistantThreadMessage` function:












``` typescript
import type  from '@slack/web-api';import  from './slack-utils';
export async function assistantThreadMessage(  event: AssistantThreadStartedEvent,)  = event.assistant_thread;  console.log(`Thread started: $ $`);  console.log(JSON.stringify(event));
  await client.chat.postMessage();
  await client.assistant.threads.setSuggestedPrompts(,      ,    ],  });}
```


### [Direct Messages](#direct-messages)

For direct messages to your bot, the `message` event is triggered and the event is handled by the `handleNewAssistantMessage` function in `handle-messages.ts`:

1.  Verifies the message isn't from a bot
2.  Updates the status to show the response is being generated
3.  Retrieves the conversation history
4.  Calls the LLM with the conversation context
5.  Posts the LLM's response to the thread

Here's the code for the `handleNewAssistantMessage` function:












``` typescript
import type  from '@slack/web-api';import  from './slack-utils';import  from './ai';
export async function handleNewAssistantMessage(  event: GenericMessageEvent,  botUserId: string,)  = event;  const updateStatus = updateStatusUtil(channel, thread_ts);  updateStatus('is thinking...');
  const messages = await getThread(channel, thread_ts, botUserId);  const result = await generateResponse(messages, updateStatus);
  await client.chat.postMessage(,      },    ],  });
  updateStatus('');}
```


With the event handlers in place, let's now implement the AI logic.

## [Implementing AI Logic](#implementing-ai-logic)

The core of our application is the `generateResponse` function in `lib/generate-response.ts`, which processes messages and generates responses using the AI SDK.

Here's how to implement it:












``` typescript
import  from '@ai-sdk/openai';import  from 'ai';
export const generateResponse = async (  messages: ModelMessage[],  updateStatus?: (status: string) => void,) =>  = await generateText(`,    messages,  });
  // Convert markdown to Slack mrkdwn format  return text.replace(/\[(.*?)\]\((.*?)\)/g, '<$2|$1>').replace(/\*\*/g, '*');};
```


This basic implementation:

1.  Uses the AI SDK's `generateText` function to call OpenAI's `gpt-4o` model
2.  Provides a system prompt to guide the model's behavior
3.  Formats the response for Slack's markdown format

## [Enhancing with Tools](#enhancing-with-tools)

The real power of the AI SDK comes from tools that enable your bot to perform actions. Let's add two useful tools:












``` typescript
import  from '@ai-sdk/openai';import  from 'ai';import  from 'zod';import  from './utils';
export const generateResponse = async (  messages: ModelMessage[],  updateStatus?: (status: string) => void,) =>  = await generateText(    - Always include sources in your final response if you use web search.`,    messages,    stopWhen: stepCountIs(10),    tools: ),        execute: async () => ...`);
          const response = await fetch(            `https://api.open-meteo.com/v1/forecast?latitude=$&longitude=$&current=temperature_2m,weathercode,relativehumidity_2m&timezone=auto`,          );
          const weatherData = await response.json();          return ;        },      }),      searchWeb: tool(),        execute: async () => ...`);          const  = await exa.searchAndContents(query, );
          return )),          };        },      }),    },  });
  // Convert markdown to Slack mrkdwn format  return text.replace(/\[(.*?)\]\((.*?)\)/g, '<$2|$1>').replace(/\*\*/g, '*');};
```


In this updated implementation:

1.  You added two tools:

    - `getWeather`: Fetches weather data for a specified location
    - `searchWeb`: Searches the web for information using the Exa API

2.  You set `stopWhen: stepCountIs(10)` to enable multi-step conversations. This defines the stopping conditions of your agent, when the model generates a tool call. This will automatically send any tool results back to the LLM to trigger additional tool calls or responses as the LLM deems necessary. This turns your LLM call from a one-off operation into a multi-step agentic flow.

## [How It Works](#how-it-works)

When a user interacts with your bot:

1.  The Slack event is received and processed by your API endpoint
2.  The user's message and the thread history is passed to the `generateResponse` function
3.  The AI SDK processes the message and may invoke tools as needed
4.  The response is formatted for Slack and sent back to the user

The tools are automatically invoked based on the user's intent. For example, if a user asks "What's the weather in London?", the AI will:

1.  Recognize this as a weather query
2.  Call the `getWeather` tool with London's coordinates (inferred by the LLM)
3.  Process the weather data
4.  Generate a final response, answering the user's question

## [Deploying the App](#deploying-the-app)

1.  Install the Vercel CLI



``` geist-overflow-scroll-y
pnpm install -g vercel
```










2.  Deploy the app



``` geist-overflow-scroll-y
vercel deploy
```










3.  Copy the deployment URL and update the Slack app's Event Subscriptions to point to your Vercel URL
4.  Go to your project's deployment settings (Your project -\> Settings -\> Environment Variables) and add your environment variables



``` bash
SLACK_BOT_TOKEN=your_slack_bot_tokenSLACK_SIGNING_SECRET=your_slack_signing_secretOPENAI_API_KEY=your_openai_api_keyEXA_API_KEY=your_exa_api_key
```





Make sure to redeploy your app after updating environment variables.






``` bash
https://your-vercel-url.vercel.app/api/events
```


6.  On the Events Subscription page, subscribe to the following events.
    - `app_mention`
    - `assistant_thread_started`
    - `message:im`

Finally, head to Slack and test the app by sending a message to the bot.

## [Next Steps](#next-steps)

You've built a Slack chatbot powered by the AI SDK! Here are some ways you could extend it:

1.  Add memory for specific users to give the LLM context of previous interactions
2.  Implement more tools like database queries or knowledge base searches
3.  Add support for rich message formatting with blocks
4.  Add analytics to track usage patterns




In a production environment, it is recommended to implement a robust queueing system to ensure messages are properly handled.


















On this page






























































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.