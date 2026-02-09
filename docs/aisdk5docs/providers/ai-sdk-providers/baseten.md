AI SDK 5 is available now.










Menu






















































































































































































































































































































































































































































































# [Baseten Provider](#baseten-provider)


## [Setup](#setup)

The Baseten provider is available via the `@ai-sdk/baseten` module. You can install it with






pnpm







npm







yarn








``` geist-overflow-scroll-y
pnpm add @ai-sdk/baseten
```












## [Provider Instance](#provider-instance)

You can import the default provider instance `baseten` from `@ai-sdk/baseten`:



``` ts
import  from '@ai-sdk/baseten';
```


If you need a customized setup, you can import `createBaseten` from `@ai-sdk/baseten` and create a provider instance with your settings:



``` ts
import  from '@ai-sdk/baseten';
const baseten = createBaseten();
```


You can use the following optional settings to customize the Baseten provider instance:

- **baseURL** *string*

  Use a different URL prefix for API calls, e.g. to use proxy servers. The default prefix is `https://inference.baseten.co/v1`.

- **apiKey** *string*


- **modelURL** *string*

  Custom model URL for specific models (chat or embeddings). If not provided, the default Model APIs will be used.

- **headers** *Record\<string,string\>*

  Custom headers to include in the requests.

- **fetch** *(input: RequestInfo, init?: RequestInit) =\> Promise\<Response\>*


## [Model APIs](#model-apis)




``` ts
const model = baseten('moonshotai/Kimi-K2-Instruct-0905');
```


### [Example](#example)

You can use Baseten language models to generate text with the `generateText` function:



``` ts
import  from '@ai-sdk/baseten';import  from 'ai';
const  = await generateText();
```


Baseten language models can also be used in the `streamText` function (see [AI SDK Core](../../docs/ai-sdk-core.html)).

## [Dedicated Models](#dedicated-models)

Baseten supports dedicated model URLs for both chat and embedding models. You have to specify a `modelURL` when creating the provider:

### [OpenAI-Compatible Endpoints (`/sync/v1`)](#openai-compatible-endpoints-syncv1)

For models deployed with Baseten's OpenAI-compatible endpoints:



``` ts
import  from '@ai-sdk/baseten';
const baseten = createBaseten(.api.baseten.co/sync/v1',});// No modelId is needed because we specified modelURLconst model = baseten();const  = await generateText();
```


### [`/predict` Endpoints](#predict-endpoints)

`/predict` endpoints are currently NOT supported for chat models. You must use `/sync/v1` endpoints for chat functionality.

## [Embedding Models](#embedding-models)

You can create models that call the Baseten embeddings API using the `.textEmbeddingModel()` factory method. The Baseten provider uses the high-performance `@basetenlabs/performance-client` for optimal embedding performance.




**Important:** Embedding models require a dedicated deployment with a custom `modelURL`. Unlike chat models, embeddings cannot use Baseten's default Model APIs and must specify a dedicated model endpoint.





``` ts
import  from '@ai-sdk/baseten';import  from 'ai';
const baseten = createBaseten(.api.baseten.co/sync',});
const embeddingModel = baseten.textEmbeddingModel();
// Single embeddingconst  = await embed();
// Batch embeddingsconst  = await embedMany();
```


### [Endpoint Support for Embeddings](#endpoint-support-for-embeddings)

**Supported:**

- `/sync` endpoints (Performance Client automatically adds `/v1/embeddings`)
- `/sync/v1` endpoints (automatically strips `/v1` before passing to Performance Client)

**Not Supported:**

- `/predict` endpoints (not compatible with Performance Client)

### [Performance Features](#performance-features)

The embedding implementation includes:

- **High-performance client**: Uses `@basetenlabs/performance-client` for optimal performance
- **Automatic batching**: Efficiently handles multiple texts in a single request
- **Connection reuse**: Performance Client is created once and reused for all requests
- **Built-in retries**: Automatic retry logic for failed requests

## [Error Handling](#error-handling)

The Baseten provider includes built-in error handling for common API errors:



``` ts
import  from '@ai-sdk/baseten';import  from 'ai';
try  = await generateText();} catch (error) 
```


### [Common Error Scenarios](#common-error-scenarios)



``` ts
// Embeddings require a modelURLtry  catch (error) 
// /predict endpoints are not supported for chat modelstry .api.baseten.co/environments/production/predict',  });  baseten(); // This will throw an error} catch (error) 
// /sync/v1 endpoints are now supported for embeddingsconst baseten = createBaseten(.api.baseten.co/environments/production/sync/v1',});const embeddingModel = baseten.textEmbeddingModel(); // This works fine!
// /predict endpoints are not supported for embeddingstry .api.baseten.co/environments/production/predict',  });  baseten.textEmbeddingModel(); // This will throw an error} catch (error) 
// Image models are not supportedtry  catch (error) 
```























On this page

























































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.