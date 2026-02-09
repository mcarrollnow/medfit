AI SDK 5 is available now.










Menu






















































































































































































































































































































































# [Error Handling and warnings](#error-handling-and-warnings)

## [Warnings](#warnings)

The AI SDK shows warnings when something might not work as expected. These warnings help you fix problems before they cause errors.

### [When Warnings Appear](#when-warnings-appear)

Warnings are shown in the browser console when:

- **Unsupported settings**: You use a setting that the AI model doesn't support
- **Unsupported tools**: You use a tool that the AI model can't use
- **Other issues**: The AI model reports other problems

### [Warning Messages](#warning-messages)

All warnings start with "AI SDK Warning:" so you can easily find them. For example:



``` undefined
AI SDK Warning: The "temperature" setting is not supported by this modelAI SDK Warning: The tool "calculator" is not supported by this model
```


### [Turning Off Warnings](#turning-off-warnings)

By default, warnings are shown in the console. You can control this behavior:

#### [Turn Off All Warnings](#turn-off-all-warnings)

Set a global variable to turn off warnings completely:



``` ts
globalThis.AI_SDK_LOG_WARNINGS = false;
```


#### [Custom Warning Handler](#custom-warning-handler)

You can also provide your own function to handle warnings:



``` ts
globalThis.AI_SDK_LOG_WARNINGS = warnings => );};
```





Custom warning functions are experimental and can change in patch releases without notice.



## [Error Handling](#error-handling)

### [Error Helper Object](#error-helper-object)

Each AI SDK UI hook also returns an [error](../reference/ai-sdk-ui/use-chat.html#error) object that you can use to render the error in your UI. You can use the error object to show an error message, disable the submit button, or show a retry button.




We recommend showing a generic error message to the user, such as "Something went wrong." This is a good practice to avoid leaking information from the server.





``` tsx
'use client';
import  from '@ai-sdk/react';import  from 'react';
export default function Chat()  = useChat();
  const handleSubmit = (e: React.FormEvent) => );    setInput('');  };
  return (    <div>      >          :                  </div>      ))}
      >            Retry          </button>        </>      )}
      <form onSubmit=>        <input          value=          onChange=          disabled=        />      </form>    </div>  );}
```


#### [Alternative: replace last message](#alternative-replace-last-message)

Alternatively you can write a custom submit handler that replaces the last message when an error is present.



``` tsx
'use client';
import  from '@ai-sdk/react';import  from 'react';
export default function Chat()  = useChat();
  function customSubmit(event: React.FormEvent<HTMLFormElement>) 
    sendMessage();    setInput('');  }
  return (    <div>      >          :                  </div>      ))}
      
      <form onSubmit=>        <input value= onChange= />      </form>    </div>  );}
```


### [Error Handling Callback](#error-handling-callback)

Errors can be processed by passing an [`onError`](../reference/ai-sdk-ui/use-chat.html#on-error) callback function as an option to the [`useChat`](../reference/ai-sdk-ui/use-chat.html) or [`useCompletion`](../reference/ai-sdk-ui/use-completion.html) hooks. The callback function receives an error object as an argument.



``` tsx
import  from '@ai-sdk/react';
export default function Page()  = useChat(,  });}
```


### [Injecting Errors for Testing](#injecting-errors-for-testing)

You might want to create errors for testing. You can easily do so by throwing an error in your route handler:



``` ts
export async function POST(req: Request) 
```

















On this page






















































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.