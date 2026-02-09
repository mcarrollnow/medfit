AI SDK 5 is available now.










Menu










































































































































































































































































































































































































# [Streaming Values](#streaming-values)




AI SDK RSC is currently experimental. We recommend using [AI SDK UI](../ai-sdk-ui/overview.html) for production. For guidance on migrating from RSC to UI, see our [migration guide](migrating-to-ui.html).



The RSC API provides several utility functions to allow you to stream values from the server to the client. This is useful when you need more granular control over what you are streaming and how you are streaming it.




These utilities can also be paired with [AI SDK Core](../ai-sdk-core.html) functions like [`streamText`](../reference/ai-sdk-core/stream-text.html) and [`streamObject`](../reference/ai-sdk-core/stream-object.html) to easily stream LLM generations from the server to the client.



There are two functions provided by the RSC API that allow you to create streamable values:

- [`createStreamableValue`](../reference/ai-sdk-rsc/create-streamable-value.html) - creates a streamable (serializable) value, with full control over how you create, update, and close the stream.
- [`createStreamableUI`](../reference/ai-sdk-rsc/create-streamable-ui.html) - creates a streamable React component, with full control over how you create, update, and close the stream.

## [`createStreamableValue`](#createstreamablevalue)

The RSC API allows you to stream serializable Javascript values from the server to the client using [`createStreamableValue`](../reference/ai-sdk-rsc/create-streamable-value.html), such as strings, numbers, objects, and arrays.

This is useful when you want to stream:

- Text generations from the language model in real-time.
- Buffer values of image and audio generations from multi-modal models.
- Progress updates from multi-step agent runs.

## [Creating a Streamable Value](#creating-a-streamable-value)

You can import `createStreamableValue` from `@ai-sdk/rsc` and use it to create a streamable value.



``` tsx
'use server';
import  from '@ai-sdk/rsc';
export const runThread = async () => , 1000);
  return ;};
```


## [Reading a Streamable Value](#reading-a-streamable-value)

You can read streamable values on the client using `readStreamableValue`. It returns an async iterator that yields the value of the streamable as it is updated:



``` tsx
import  from '@ai-sdk/rsc';import  from '@/actions';
export default function Page()  = await runThread();
        for await (const value of readStreamableValue(status))       }}    >      Ask    </button>  );}
```


Learn how to stream a text generation (with `streamText`) using the Next.js App Router and `createStreamableValue` in this [example](../../cookbook/rsc/stream-text.html).

## [`createStreamableUI`](#createstreamableui)

`createStreamableUI` creates a stream that holds a React component. Unlike AI SDK Core APIs, this function does not call a large language model. Instead, it provides a primitive that can be used to have granular control over streaming a React component.

## [Using `createStreamableUI`](#using-createstreamableui)

Let's look at how you can use the `createStreamableUI` function with a Server Action.












``` tsx
'use server';
import  from '@ai-sdk/rsc';
export async function getWeather() }>Loading...</div>);
  setTimeout(() => , 1000);
  return weatherUI.value;}
```


First, you create a streamable UI with an empty state and then update it with a loading message. After 1 second, you mark the stream as done passing in the actual weather information as its final value. The `.value` property contains the actual UI that can be sent to the client.

## [Reading a Streamable UI](#reading-a-streamable-ui)

On the client side, you can call the `getWeather` Server Action and render the returned UI like any other React component.












``` tsx
'use client';
import  from 'react';import  from '@ai-sdk/rsc';import  from '@/actions';
export default function Page() }      >        What&apos;s the weather?      </button>
          </div>  );}
```


When the button is clicked, the `getWeather` function is called, and the returned UI is set to the `weather` state and rendered on the page. Users will see the loading message first and then the actual weather information after 1 second.

Learn more about handling multiple streams in a single request in the [Multiple Streamables](../advanced/multiple-streamables.html) guide.

Learn more about handling state for more complex use cases with [AI/UI State](generative-ui-state.html) .
















On this page































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.