AI SDK 5 is available now.










Menu


























































































































































































































































































































































































# [Multi-Modal Agent](#multi-modal-agent)

In this guide, you will build a multi-modal agent capable of understanding both images and PDFs.

Multi-modal refers to the ability of the agent to understand and generate responses in multiple formats. In this guide, we'll focus on images and PDFs - two common document types that modern language models can process natively.




For a complete list of providers and their multi-modal capabilities, visit the [providers documentation](../../providers/ai-sdk-providers.html).



We'll build this agent using OpenAI's GPT-4o, but the same code works seamlessly with other providers - you can switch between them by changing just one line of code.

## [Prerequisites](#prerequisites)

To follow this quickstart, you'll need:

- Node.js 18+ and pnpm installed on your local development machine.
- An OpenAI API key.


## [Create Your Application](#create-your-application)

Start by creating a new Next.js application. This command will create a new directory named `multi-modal-agent` and set up a basic Next.js application inside it.





Be sure to select yes when prompted to use the App Router. If you are looking for the Next.js Pages Router quickstart guide, you can find it [here](../../docs/getting-started/nextjs-pages-router.html).






``` geist-overflow-scroll-y
pnpm create next-app@latest multi-modal-agent
```










Navigate to the newly created directory:



``` geist-overflow-scroll-y
cd multi-modal-agent
```










### [Install dependencies](#install-dependencies)

Install `ai` and `@ai-sdk/openai`, the AI SDK package and the AI SDK's [OpenAI provider](../../providers/ai-sdk-providers/openai.html) respectively.




The AI SDK is designed to be a unified interface to interact with any large language model. This means that you can change model and providers with just one line of code! Learn more about [available providers](../../providers/ai-sdk-providers.html) and [building custom providers](../../providers/community-providers/custom-providers.html) in the [providers](../../providers/ai-sdk-providers.html) section.









pnpm







npm







yarn







bun








``` geist-overflow-scroll-y
pnpm add ai @ai-sdk/react @ai-sdk/openai
```













### [Configure OpenAI API key](#configure-openai-api-key)

Create a `.env.local` file in your project root and add your OpenAI API Key. This key is used to authenticate your application with the OpenAI service.



``` geist-overflow-scroll-y
touch .env.local
```










Edit the `.env.local` file:













``` env
OPENAI_API_KEY=xxxxxxxxx
```


Replace `xxxxxxxxx` with your actual OpenAI API key.




The AI SDK's OpenAI Provider will default to using the `OPENAI_API_KEY` environment variable.



## [Implementation Plan](#implementation-plan)

To build a multi-modal agent, you will need to:

- Create a Route Handler to handle incoming chat messages and generate responses.
- Wire up the UI to display chat messages, provide a user input, and handle submitting new messages.
- Add the ability to upload images and PDFs and attach them alongside the chat messages.

## [Create a Route Handler](#create-a-route-handler)

Create a route handler, `app/api/chat/route.ts` and add the following code:












``` tsx
import  from '@ai-sdk/openai';import  from 'ai';
// Allow streaming responses up to 30 secondsexport const maxDuration = 30;
export async function POST(req: Request) :  = await req.json();
  const result = streamText();
  return result.toUIMessageStreamResponse();}
```


Let's take a look at what is happening in this code:

1.  Define an asynchronous `POST` request handler and extract `messages` from the body of the request. The `messages` variable contains a history of the conversation between you and the agent and provides the agent with the necessary context to make the next generation.
2.  Convert the UI messages to model messages using `convertToModelMessages`, which transforms the UI-focused message format to the format expected by the language model.
3.  Call [`streamText`](../../docs/reference/ai-sdk-core/stream-text.html), which is imported from the `ai` package. This function accepts a configuration object that contains a `model` provider (imported from `@ai-sdk/openai`) and `messages` (converted in step 2). You can pass additional [settings](../../docs/ai-sdk-core/settings.html) to further customise the model's behaviour.
4.  The `streamText` function returns a [`StreamTextResult`](../../docs/reference/ai-sdk-core/stream-text.html#result-object). This result object contains the [`toUIMessageStreamResponse`](../../docs/reference/ai-sdk-core/stream-text.html#to-ui-message-stream-response) function which converts the result to a streamed response object.
5.  Finally, return the result to the client to stream the response.

This Route Handler creates a POST request endpoint at `/api/chat`.

## [Wire up the UI](#wire-up-the-ui)

Now that you have a Route Handler that can query a large language model (LLM), it's time to setup your frontend. [AI SDK UI](../../docs/ai-sdk-ui.html) abstracts the complexity of a chat interface into one hook, [`useChat`](../../docs/reference/ai-sdk-ui/use-chat.html).

Update your root page (`app/page.tsx`) with the following code to show a list of chat messages and provide a user message input:












``` tsx
'use client';
import  from '@ai-sdk/react';import  from 'ai';import  from 'react';
export default function Chat()  = useChat(),  });
  return (    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">       className="whitespace-pre-wrap">                    -text-$`}></span>;            }            return null;          })}        </div>      ))}
      <form        onSubmit=],          });          setInput('');        }}        className="fixed bottom-0 w-full max-w-md mb-8 border border-gray-300 rounded shadow-xl"      >        <input          className="w-full p-2"          value=          placeholder="Say something..."          onChange=        />      </form>    </div>  );}
```





Make sure you add the `"use client"` directive to the top of your file. This allows you to add interactivity with Javascript.



This page utilizes the `useChat` hook, configured with `DefaultChatTransport` to specify the API endpoint. The `useChat` hook provides multiple utility functions and state variables:

- `messages` - the current chat messages (an array of objects with `id`, `role`, and `parts` properties).
- `sendMessage` - function to send a new message to the AI.
- Each message contains a `parts` array that can include text, images, PDFs, and other content types.
- Files are converted to data URLs before being sent to maintain compatibility across different environments.

## [Add File Upload](#add-file-upload)

To make your agent multi-modal, let's add the ability to upload and send both images and PDFs to the model. In v5, files are sent as part of the message's `parts` array. Files are converted to data URLs using the FileReader API before being sent to the server.

Update your root page (`app/page.tsx`) with the following code:












``` tsx
'use client';
import  from '@ai-sdk/react';import  from 'ai';import  from 'react';import Image from 'next/image';
async function convertFilesToDataURLs(files: FileList) >((resolve, reject) => );          };          reader.onerror = reject;          reader.readAsDataURL(file);        }),    ),  );}
export default function Chat()  = useChat(),  });
  return (    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">       className="whitespace-pre-wrap">                    -text-$`}></span>;            }            if (part.type === 'file' && part.mediaType?.startsWith('image/')) -image-$`}                  src=                  width=                  height=                  alt=`}                />              );            }            if (part.type === 'file' && part.mediaType === 'application/pdf') -pdf-$`}                  src=                  width=                  height=                  title=`}                />              );            }            return null;          })}        </div>      ))}
      <form        className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl space-y-2"        onSubmit=, ...fileParts],          });
          setInput('');          setFiles(undefined);
          if (fileInputRef.current)         }}      >        <input          type="file"          accept="image/*,application/pdf"          className=""          onChange=          }}          multiple          ref=        />        <input          className="w-full p-2"          value=          placeholder="Say something..."          onChange=        />      </form>    </div>  );}
```


In this code, you:

1.  Add a helper function `convertFilesToDataURLs` to convert file uploads to data URLs.
2.  Create state to hold the input text, files, and a ref to the file input field.
3.  Configure `useChat` with `DefaultChatTransport` to specify the API endpoint.
4.  Display messages using the `parts` array structure, rendering text, images, and PDFs appropriately.
5.  Update the `onSubmit` function to send messages with the `sendMessage` function, including both text and file parts.
6.  Add a file input field to the form, including an `onChange` handler to handle updating the files state.

## [Running Your Application](#running-your-application)

With that, you have built everything you need for your multi-modal agent! To start your application, use the command:



``` geist-overflow-scroll-y
pnpm run dev
```











Try uploading an image or PDF and asking the model questions about it. Watch as the model's response is streamed back to you!

## [Using Other Providers](#using-other-providers)

With the AI SDK's unified provider interface you can easily switch to other providers that support multi-modal capabilities:












``` tsx
// Using Anthropicimport  from '@ai-sdk/anthropic';const result = streamText();
// Using Googleimport  from '@ai-sdk/google';const result = streamText();
```


Install the provider package (`@ai-sdk/anthropic` or `@ai-sdk/google`) and update your API keys in `.env.local`. The rest of your code remains the same.




Different providers may have varying file size limits and performance characteristics. Check the [provider documentation](../../providers/ai-sdk-providers.html) for specific details.



## [Where to Next?](#where-to-next)

You've built a multi-modal AI agent using the AI SDK! Experiment and extend the functionality of this application further by exploring [tool calling](../../docs/ai-sdk-core/tools-and-tool-calling.html).
















On this page
















































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.