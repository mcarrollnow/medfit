AI SDK 5 is available now.










Menu






















































































































































































































































































































































































































































































# [SambaNova Provider](#sambanova-provider)



## [Setup](#setup)

The SambaNova provider is available via the `sambanova-ai-provider` module. You can install it with:






pnpm







npm







yarn







bun








``` geist-overflow-scroll-y
pnpm add sambanova-ai-provider
```












### [Environment variables](#environment-variables)

Create a `.env` file with a `SAMBANOVA_API_KEY` variable.

## [Provider Instance](#provider-instance)

You can import the default provider instance `sambanova` from `sambanova-ai-provider`:



``` ts
import  from 'sambanova-ai-provider';
```


If you need a customized setup, you can import `createSambaNova` from `sambanova-ai-provider` and create a provider instance with your settings:



``` ts
import  from 'sambanova-ai-provider';
const sambanova = createSambaNova();
```


You can use the following optional settings to customize the SambaNova provider instance:

- **baseURL** *string*

  Use a different URL prefix for API calls, e.g. to use proxy servers. The default prefix is `https://api.sambanova.ai/v1`.

- **apiKey** *string*

  API key that is being sent using the `Authorization` header. It defaults to the `SAMBANOVA_API_KEY` environment variable.

- **headers** *Record\<string,string\>*

  Custom headers to include in the requests.

- **fetch** *(input: RequestInfo, init?: RequestInit) =\> Promise\<Response\>*


## [Models](#models)




``` ts
const model = sambanova('Meta-Llama-3.1-70B-Instruct');
```


## [Tested models and capabilities](#tested-models-and-capabilities)

This provider is capable of generating and streaming text, and interpreting image inputs.

At least it has been tested with the following features (which use the `/chat/completion` endpoint):


| Chat completion | Image input |
|----|----|


### [Image input](#image-input)

You need to use any of the following models for visual understanding:

- Llama3.2-11B-Vision-Instruct
- Llama3.2-90B-Vision-Instruct

SambaNova does not support URLs, but the ai-sdk is able to download the file and send it to the model.

## [Example Usage](#example-usage)

Basic demonstration of text generation using the SambaNova provider.



``` ts
import  from 'sambanova-ai-provider';import  from 'ai';
const sambanova = createSambaNova();
const model = sambanova('Meta-Llama-3.1-70B-Instruct');
const  = await generateText();
console.log(text);
```


You will get an output text similar to this one:



``` undefined
Hello. Nice to meet you too. Is there something I can help you with or would you like to chat?
```


## [Intercepting Fetch Requests](#intercepting-fetch-requests)

This provider supports [Intercepting Fetch Requests](../../cookbook/node/intercept-fetch-requests.html).

### [Example](#example)



``` ts
import  from 'sambanova-ai-provider';import  from 'ai';
const sambanovaProvider = createSambaNova(`);    return await fetch(url, options);  },});
const model = sambanovaProvider('Meta-Llama-3.1-70B-Instruct');
const  = await generateText();
```


And you will get an output like this:



``` bash
URL https://api.sambanova.ai/v1/chat/completionsHeaders Body   ]}
```

















On this page














































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.