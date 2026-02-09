AI SDK 5 is available now.










Menu










































































































































































































































































































































































































# [Streaming React Components](#streaming-react-components)




AI SDK RSC is currently experimental. We recommend using [AI SDK UI](../ai-sdk-ui/overview.html) for production. For guidance on migrating from RSC to UI, see our [migration guide](migrating-to-ui.html).



The RSC API allows you to stream React components from the server to the client with the [`streamUI`](../reference/ai-sdk-rsc/stream-ui.html) function. This is useful when you want to go beyond raw text and stream components to the client in real-time.

Similar to [AI SDK Core](../ai-sdk-core/overview.html) APIs (like [`streamText`](../reference/ai-sdk-core/stream-text.html) and [`streamObject`](../reference/ai-sdk-core/stream-object.html) ), `streamUI` provides a single function to call a model and allow it to respond with React Server Components. It supports the same model interfaces as AI SDK Core APIs.

### [Concepts](#concepts)

To give the model the ability to respond to a user's prompt with a React component, you can leverage [tools](../ai-sdk-core/tools-and-tool-calling.html).




Remember, tools are like programs you can give to the model, and the model can decide as and when to use based on the context of the conversation.



With the `streamUI` function, **you provide tools that return React components**. With the ability to stream components, the model is akin to a dynamic router that is able to understand the user's intention and display relevant UI.

At a high level, the `streamUI` works like other AI SDK Core functions: you can provide the model with a prompt or some conversation history and, optionally, some tools. If the model decides, based on the context of the conversation, to call a tool, it will generate a tool call. The `streamUI` function will then run the respective tool, returning a React component. If the model doesn't have a relevant tool to use, it will return a text generation, which will be passed to the `text` function, for you to handle (render and return as a React component).








``` tsx
const result = await streamUI() => <div></div>,  tools: ,});
```


This example calls the `streamUI` function using OpenAI's `gpt-4o` model, passes a prompt, specifies how the model's plain text response (`content`) should be rendered, and then provides an empty object for tools. Even though this example does not define any tools, it will stream the model's response as a `div` rather than plain text.

### [Adding A Tool](#adding-a-tool)

Using tools with `streamUI` is similar to how you use tools with `generateText` and `streamText`. A tool is an object that has:

- `description`: a string telling the model what the tool does and when to use it
- `inputSchema`: a Zod schema describing what the tool needs in order to run
- `generate`: an asynchronous function that will be run if the model calls the tool. This must return a React component

Let's expand the previous example to add a tool.



``` tsx
const result = await streamUI() => <div></div>,  tools: ),      generate: async function* ()  location= />;      },    },  },});
```


This tool would be run if the user asks for the weather for their location. If the user hasn't specified a location, the model will ask for it before calling the tool. When the model calls the tool, the generate function will initially return a loading component. This component will show until the awaited call to `getWeather` is resolved, at which point, the model will stream the `<WeatherComponent />` to the user.







## [Using `streamUI` with Next.js](#using-streamui-with-nextjs)

Let's see how you can use the example above in a Next.js application.

To use `streamUI` in a Next.js application, you will need two things:

1.  A Server Action (where you will call `streamUI`)
2.  A page to call the Server Action and render the resulting components

### [Step 1: Create a Server Action](#step-1-create-a-server-action)







Create a Server Action at `app/actions.tsx` and add the following code:












``` tsx
'use server';
import  from '@ai-sdk/rsc';import  from '@ai-sdk/openai';import  from 'zod';
const LoadingComponent = () => (  <div className="animate-pulse p-4">getting weather...</div>);
const getWeather = async (location: string) => ;
interface WeatherProps 
const WeatherComponent = (props: WeatherProps) => (  <div className="border border-neutral-200 p-4 rounded-lg max-w-fit">    The weather in  is   </div>);
export async function streamComponent() ) => <div></div>,    tools: ),        generate: async function* ()  location= />;        },      },    },  });
  return result.value;}
```


The `getWeather` tool should look familiar as it is identical to the example in the previous section. In order for this tool to work:

1.  First define a `LoadingComponent`, which renders a pulsing `div` that will show some loading text.
2.  Next, define a `getWeather` function that will timeout for 2 seconds (to simulate fetching the weather externally) before returning the "weather" for a `location`. Note: you could run any asynchronous TypeScript code here.
3.  Finally, define a `WeatherComponent` which takes in `location` and `weather` as props, which are then rendered within a `div`.

Your Server Action is an asynchronous function called `streamComponent` that takes no inputs, and returns a `ReactNode`. Within the action, you call the `streamUI` function, specifying the model (`gpt-4o`), the prompt, the component that should be rendered if the model chooses to return text, and finally, your `getWeather` tool. Last but not least, you return the resulting component generated by the model with `result.value`.

To call this Server Action and display the resulting React Component, you will need a page.

### [Step 2: Create a Page](#step-2-create-a-page)

Create or update your root page (`app/page.tsx`) with the following code:












``` tsx
'use client';
import  from 'react';import  from '@/components/ui/button';import  from './actions';
export default function Page() }      >        <Button>Stream Component</Button>      </form>      <div></div>    </div>  );}
```


This page is first marked as a client component with the `"use client";` directive given it will be using hooks and interactivity. On the page, you render a form. When that form is submitted, you call the `streamComponent` action created in the previous step (just like any other function). The `streamComponent` action returns a `ReactNode` that you can then render on the page using React state (`setComponent`).

## [Going beyond a single prompt](#going-beyond-a-single-prompt)

You can now allow the model to respond to your prompt with a React component. However, this example is limited to a static prompt that is set within your Server Action. You could make this example interactive by turning it into a chatbot.

Learn how to stream React components with the Next.js App Router using `streamUI` with this [example](../../cookbook/rsc/render-visual-interface-in-chat.html).
















On this page

































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.