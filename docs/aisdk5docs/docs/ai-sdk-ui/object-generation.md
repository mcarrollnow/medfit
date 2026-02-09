AI SDK 5 is available now.










Menu






















































































































































































































































































































































# [Object Generation](#object-generation)




`useObject` is an experimental feature and only available in React, Svelte, and Vue.



The [`useObject`](../reference/ai-sdk-ui/use-object.html) hook allows you to create interfaces that represent a structured JSON object that is being streamed.

In this guide, you will learn how to use the `useObject` hook in your application to generate UIs for structured data on the fly.

## [Example](#example)

The example shows a small notifications demo app that generates fake notifications in real-time.

### [Schema](#schema)

It is helpful to set up the schema in a separate file that is imported on both the client and server.












``` ts
import  from 'zod';
// define a schema for the notificationsexport const notificationSchema = z.object(),  ),});
```


### [Client](#client)

The client uses [`useObject`](../reference/ai-sdk-ui/use-object.html) to stream the object generation process.

The results are partial and are displayed as they are received. Please note the code for handling `undefined` values in the JSX.












``` tsx
'use client';
import  from '@ai-sdk/react';import  from './api/notifications/schema';
export default function Page()  = useObject();
  return (    <>      <button onClick=>        Generate notifications      </button>
      >          <p></p>          <p></p>        </div>      ))}    </>  );}
```


### [Server](#server)

On the server, we use [`streamObject`](../reference/ai-sdk-core/stream-object.html) to stream the object generation process.












``` typescript
import  from '@ai-sdk/openai';import  from 'ai';import  from './schema';
// Allow streaming responses up to 30 secondsexport const maxDuration = 30;
export async function POST(req: Request) );
  return result.toTextStreamResponse();}
```


## [Enum Output Mode](#enum-output-mode)

When you need to classify or categorize input into predefined options, you can use the `enum` output mode with `useObject`. This requires a specific schema structure where the object has `enum` as a key with `z.enum` containing your possible values.

### [Example: Text Classification](#example-text-classification)

This example shows how to build a simple text classifier that categorizes statements as true or false.

#### [Client](#client-1)

When using `useObject` with enum output mode, your schema must be an object with `enum` as the key:












``` tsx
'use client';
import  from '@ai-sdk/react';import  from 'zod';
export default function ClassifyPage()  = useObject(),  });
  return (    <>      <button onClick= disabled=>        Classify statement      </button>
      </div>}    </>  );}
```


#### [Server](#server-1)

On the server, use `streamObject` with `output: 'enum'` to stream the classification result:












``` typescript
import  from '@ai-sdk/openai';import  from 'ai';
export async function POST(req: Request) `,  });
  return result.toTextStreamResponse();}
```


## [Customized UI](#customized-ui)

`useObject` also provides ways to show loading and error states:

### [Loading State](#loading-state)

The `isLoading` state returned by the `useObject` hook can be used for several purposes:

- To show a loading spinner while the object is generated.
- To disable the submit button.












``` tsx
'use client';
import  from '@ai-sdk/react';
export default function Page()  = useObject();
  return (    <>      
      >          <p></p>          <p></p>        </div>      ))}    </>  );}
```


### [Stop Handler](#stop-handler)

The `stop` function can be used to stop the object generation process. This can be useful if the user wants to cancel the request or if the server is taking too long to respond.












``` tsx
'use client';
import  from '@ai-sdk/react';
export default function Page()  = useObject();
  return (    <>      >          Stop        </button>      )}
      >          <p></p>          <p></p>        </div>      ))}    </>  );}
```


### [Error State](#error-state)

Similarly, the `error` state reflects the error object thrown during the fetch request. It can be used to display an error message, or to disable the submit button:




We recommend showing a generic error message to the user, such as "Something went wrong." This is a good practice to avoid leaking information from the server.





``` tsx
'use client';
import  from '@ai-sdk/react';
export default function Page()  = useObject();
  return (    <>      
      >          <p></p>          <p></p>        </div>      ))}    </>  );}
```


## [Event Callbacks](#event-callbacks)

`useObject` provides optional event callbacks that you can use to handle life-cycle events.

- `onFinish`: Called when the object generation is completed.
- `onError`: Called when an error occurs during the fetch request.

These callbacks can be used to trigger additional actions, such as logging, analytics, or custom UI updates.












``` tsx
'use client';
import  from '@ai-sdk/react';import  from './api/notifications/schema';
export default function Page()  = useObject() ,    onError(error) ,  });
  return (    <div>      <button onClick=>        Generate notifications      </button>
      >          <p></p>          <p></p>        </div>      ))}    </div>  );}
```


## [Configure Request Options](#configure-request-options)

You can configure the API endpoint, optional headers and credentials using the `api`, `headers` and `credentials` settings.



``` tsx
const  = useObject(,  credentials: 'include',  schema: yourSchema,});
```

















On this page































































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.