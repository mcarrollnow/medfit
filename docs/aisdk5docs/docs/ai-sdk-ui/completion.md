AI SDK 5 is available now.










Menu






















































































































































































































































































































































# [Completion](#completion)

The `useCompletion` hook allows you to create a user interface to handle text completions in your application. It enables the streaming of text completions from your AI provider, manages the state for chat input, and updates the UI automatically as new messages are received.




The `useCompletion` hook is now part of the `@ai-sdk/react` package.



In this guide, you will learn how to use the `useCompletion` hook in your application to generate text completions and stream them in real-time to your users.

## [Example](#example)












``` tsx
'use client';
import  from '@ai-sdk/react';
export default function Page()  = useCompletion();
  return (    <form onSubmit=>      <input        name="prompt"        value=        onChange=        id="input"      />      <button type="submit">Submit</button>      <div></div>    </form>  );}
```













``` ts
import  from 'ai';import  from '@ai-sdk/openai';
// Allow streaming responses up to 30 secondsexport const maxDuration = 30;
export async function POST(req: Request) :  = await req.json();
  const result = streamText();
  return result.toUIMessageStreamResponse();}
```


In the `Page` component, the `useCompletion` hook will request to your AI provider endpoint whenever the user submits a message. The completion is then streamed back in real-time and displayed in the UI.

This enables a seamless text completion experience where the user can see the AI response as soon as it is available, without having to wait for the entire response to be received.

## [Customized UI](#customized-ui)

`useCompletion` also provides ways to manage the prompt via code, show loading and error states, and update messages without being triggered by user interactions.

### [Loading and error states](#loading-and-error-states)

To show a loading spinner while the chatbot is processing the user's message, you can use the `isLoading` state returned by the `useCompletion` hook:



``` tsx
const  = useCompletion()
return(  <>      </>)
```


Similarly, the `error` state reflects the error object thrown during the fetch request. It can be used to display an error message, or show a toast notification:



``` tsx
const  = useCompletion()
useEffect(() => }, [error])
// Or display the error message in the UI:return (  <>    </div> : null}  </>)
```


### [Controlled input](#controlled-input)

In the initial example, we have `handleSubmit` and `handleInputChange` callbacks that manage the input changes and form submissions. These are handy for common use cases, but you can also use uncontrolled APIs for more advanced scenarios such as form validation or customized components.

The following example demonstrates how to use more granular APIs like `setInput` with your custom input and submit button components:



``` tsx
const  = useCompletion();
return (  <>    <MyCustomInput value= onChange= />  </>);
```


### [Cancelation](#cancelation)

It's also a common use case to abort the response message while it's still streaming back from the AI provider. You can do this by calling the `stop` function returned by the `useCompletion` hook.



``` tsx
const  = useCompletion()
return (  <>    <button onClick= disabled=>Stop</button>  </>)
```


When the user clicks the "Stop" button, the fetch request will be aborted. This avoids consuming unnecessary resources and improves the UX of your application.

### [Throttling UI Updates](#throttling-ui-updates)






By default, the `useCompletion` hook will trigger a render every time a new chunk is received. You can throttle the UI updates with the `experimental_throttle` option.












``` tsx
const  = useCompletion()
```


## [Event Callbacks](#event-callbacks)

`useCompletion` also provides optional event callbacks that you can use to handle different stages of the chatbot lifecycle. These callbacks can be used to trigger additional actions, such as logging, analytics, or custom UI updates.



``` tsx
const  = useCompletion(,  onFinish: (prompt: string, completion: string) => ,  onError: (error: Error) => ,})
```


It's worth noting that you can abort the processing by throwing an error in the `onResponse` callback. This will trigger the `onError` callback and stop the message from being appended to the chat UI. This can be useful for handling unexpected responses from the AI provider.

## [Configure Request Options](#configure-request-options)

By default, the `useCompletion` hook sends a HTTP POST request to the `/api/completion` endpoint with the prompt as part of the request body. You can customize the request by passing additional options to the `useCompletion` hook:



``` tsx
const  = useCompletion(,  body: ,  credentials: 'same-origin',});
```


In this example, the `useCompletion` hook sends a POST request to the `/api/completion` endpoint with the specified headers, additional body fields, and credentials for that fetch request. On your server side, you can handle the request with these additional information.
















On this page







































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.