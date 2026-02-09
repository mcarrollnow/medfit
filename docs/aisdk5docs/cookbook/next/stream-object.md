AI SDK 5 is available now.










Menu


























































































































































































































































































































































































# [Stream Object](#stream-object)

Object generation can sometimes take a long time to complete, especially when you're generating a large schema. In such cases, it is useful to stream the object generation process to the client in real-time. This allows the client to display the generated object as it is being generated, rather than have users wait for it to complete before displaying the result.












http://localhost:3000








View Notifications





## [Object Mode](#object-mode)

The `streamObject` function allows you to specify different output strategies using the `output` parameter. By default, the output mode is set to `object`, which will generate exactly the structured object that you specify in the schema option.

### [Schema](#schema)

It is helpful to set up the schema in a separate file that is imported on both the client and server.












``` ts
import  from 'zod';
// define a schema for the notificationsexport const notificationSchema = z.object(),  ),});
```


### [Client](#client)

The client uses [`useObject`](../../docs/reference/ai-sdk-ui/use-object.html) to stream the object generation process.

The results are partial and are displayed as they are received. Please note the code for handling `undefined` values in the JSX.












``` tsx
'use client';
import  from '@ai-sdk/react';import  from './api/use-object/schema';
export default function Page()  = useObject();
  return (    <div>      <button onClick=>        Generate notifications      </button>
      >          <p></p>          <p></p>        </div>      ))}    </div>  );}
```


### [Server](#server)

On the server, we use [`streamObject`](../../docs/reference/ai-sdk-core/stream-object.html) to stream the object generation process.












``` typescript
import  from '@ai-sdk/openai';import  from 'ai';import  from './schema';
// Allow streaming responses up to 30 secondsexport const maxDuration = 30;
export async function POST(req: Request) );
  return result.toTextStreamResponse();}
```


## [Loading State and Stopping the Stream](#loading-state-and-stopping-the-stream)

You can use the `loading` state to display a loading indicator while the object is being generated. You can also use the `stop` function to stop the object generation process.












``` tsx
'use client';
import  from '@ai-sdk/react';import  from './api/use-object/schema';
export default function Page()  = useObject();
  return (    <div>      <button        onClick=        disabled=      >        Generate notifications      </button>
      >            Stop          </button>        </div>      )}
      >          <p></p>          <p></p>        </div>      ))}    </div>  );}
```


## [Array Mode](#array-mode)

The "array" output mode allows you to stream an array of objects one element at a time. This is particularly useful when generating lists of items.

### [Schema](#schema-1)

First, update the schema to generate a single object (remove the `z.array()`).












``` ts
import  from 'zod';
// define a schema for a single notificationexport const notificationSchema = z.object();
```


### [Client](#client-1)

On the client, you wrap the schema in `z.array()` to generate an array of objects.












``` tsx
'use client';
import  from '@ai-sdk/react';import  from '../api/use-object/schema';import z from 'zod';
export default function Page()  = useObject();
  return (    <div>      <button        onClick=        disabled=      >        Generate notifications      </button>
      >            Stop          </button>        </div>      )}
      >          <p></p>          <p></p>        </div>      ))}    </div>  );}
```


### [Server](#server-1)

On the server, specify `output: 'array'` to generate an array of objects.












``` typescript
import  from '@ai-sdk/openai';import  from 'ai';import  from './schema';
export const maxDuration = 30;
export async function POST(req: Request) );
  return result.toTextStreamResponse();}
```


## [No Schema Mode](#no-schema-mode)

The "no-schema" output mode can be used when you don't want to specify a schema, for example when the data structure is defined by a dynamic user request. When using this mode, omit the schema parameter and set `output: 'no-schema'`. The model will still attempt to generate JSON data based on the prompt.

### [Client](#client-2)

On the client, you wrap the schema in `z.array()` to generate an array of objects.












``` tsx
'use client';
import  from '@ai-sdk/react';import  from 'zod';
export default function Page()  = useObject();
  return (    <div>      <button        onClick=        disabled=      >        Generate notifications      </button>
      >            Stop          </button>        </div>      )}
          </div>  );}
```


### [Server](#server-2)

On the server, specify `output: 'no-schema'`.












``` typescript
import  from '@ai-sdk/openai';import  from 'ai';
export const maxDuration = 30;
export async function POST(req: Request) );
  return result.toTextStreamResponse();}
```

















On this page























































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.