AI SDK 5 is available now.










Menu










































































































































































































































































































































































































# [Handling Loading State](#handling-loading-state)




AI SDK RSC is currently experimental. We recommend using [AI SDK UI](../ai-sdk-ui/overview.html) for production. For guidance on migrating from RSC to UI, see our [migration guide](migrating-to-ui.html).



Given that responses from language models can often take a while to complete, it's crucial to be able to show loading state to users. This provides visual feedback that the system is working on their request and helps maintain a positive user experience.

There are three approaches you can take to handle loading state with the AI SDK RSC:

- Managing loading state similar to how you would in a traditional Next.js application. This involves setting a loading state variable in the client and updating it when the response is received.
- Streaming loading state from the server to the client. This approach allows you to track loading state on a more granular level and provide more detailed feedback to the user.
- Streaming loading component from the server to the client. This approach allows you to stream a React Server Component to the client while awaiting the model's response.

## [Handling Loading State on the Client](#handling-loading-state-on-the-client)

### [Client](#client)

Let's create a simple Next.js page that will call the `generateResponse` function when the form is submitted. The function will take in the user's prompt (`input`) and then generate a response (`response`). To handle the loading state, use the `loading` state variable. When the form is submitted, set `loading` to `true`, and when the response is received, set it back to `false`. While the response is being streamed, the input field will be disabled.












``` tsx
'use client';
import  from 'react';import  from './actions';import  from '@ai-sdk/rsc';
// Force the page to be dynamic and allow streaming responses up to 30 secondsexport const maxDuration = 30;
export default function Home() </div>      <form        onSubmit=$`;            setGeneration(textContent);          }          setInput('');          setLoading(false);        }}      >        <input          type="text"          value=          disabled=          className="disabled:opacity-50"          onChange=}        />        <button>Send Message</button>      </form>    </div>  );}
```


### [Server](#server)

Now let's implement the `generateResponse` function. Use the `streamText` function to generate a response to the input.












``` typescript
'use server';
import  from 'ai';import  from '@ai-sdk/openai';import  from '@ai-sdk/rsc';
export async function generateResponse(prompt: string)  = streamText();
    for await (const text of textStream) 
    stream.done();  })();
  return stream.value;}
```


## [Streaming Loading State from the Server](#streaming-loading-state-from-the-server)

If you are looking to track loading state on a more granular level, you can create a new streamable value to store a custom variable and then read this on the frontend. Let's update the example to create a new streamable value for tracking loading state:

### [Server](#server-1)












``` typescript
'use server';
import  from 'ai';import  from '@ai-sdk/openai';import  from '@ai-sdk/rsc';
export async function generateResponse(prompt: string) );
  (async () =>  = streamText();
    for await (const text of textStream) 
    stream.done();    loadingState.done();  })();
  return ;}
```


### [Client](#client-1)












``` tsx
'use client';
import  from 'react';import  from './actions';import  from '@ai-sdk/rsc';
// Force the page to be dynamic and allow streaming responses up to 30 secondsexport const maxDuration = 30;
export default function Home() </div>      <form        onSubmit= = await generateResponse(input);
          let textContent = '';
          for await (const responseDelta of readStreamableValue(response)) $`;            setGeneration(textContent);          }          for await (const loadingDelta of readStreamableValue(loadingState))           }          setInput('');          setLoading(false);        }}      >        <input          type="text"          value=          disabled=          className="disabled:opacity-50"          onChange=}        />        <button>Send Message</button>      </form>    </div>  );}
```


This allows you to provide more detailed feedback about the generation process to your users.

## [Streaming Loading Components with `streamUI`](#streaming-loading-components-with-streamui)


## [Server](#server-2)



``` ts
'use server';
import  from '@ai-sdk/openai';import  from '@ai-sdk/rsc';
export async function generateResponse(prompt: string) ) </div>;    },  });
  return result.value;}
```





Remember to update the file from `.ts` to `.tsx` because you are defining a React component in the `streamUI` function.



## [Client](#client-2)



``` tsx
'use client';
import  from 'react';import  from './actions';import  from '@ai-sdk/rsc';
// Force the page to be dynamic and allow streaming responses up to 30 secondsexport const maxDuration = 30;
export default function Home() </div>      <form        onSubmit=}      >        <input          type="text"          value=          onChange=}        />        <button>Send Message</button>      </form>    </div>  );}
```

















On this page












































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.