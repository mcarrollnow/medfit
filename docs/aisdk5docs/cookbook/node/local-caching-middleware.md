AI SDK 5 is available now.










Menu


























































































































































































































































































































































































# [Local Caching Middleware](#local-caching-middleware)






When developing AI applications, you'll often find yourself repeatedly making the same API calls during development. This can lead to increased costs and slower development cycles. A caching middleware allows you to store responses locally and reuse them when the same inputs are provided.

This approach is particularly useful in two scenarios:

1.  **Iterating on UI/UX** - When you're focused on styling and user experience, you don't want to regenerate AI responses for every code change.
2.  **Working on evals** - When developing evals, you need to repeatedly test the same prompts, but don't need new generations each time.

## [Implementation](#implementation)

In this implementation, you create a JSON file to store responses. When a request is made, you first check if you have already seen this exact request. If you have, you return the cached response immediately (as a one-off generation or chunks of tokens). If not, you trigger the generation, save the response, and return it.




Make sure to add the path of your local cache to your `.gitignore` so you do not commit it.



### [How it works](#how-it-works)

For regular generations, you store and retrieve complete responses. Instead, the streaming implementation captures each token as it arrives, stores the full sequence, and on cache hits uses the SDK's `simulateReadableStream` utility to recreate the token-by-token streaming experience at a controlled speed (defaults to 10ms between chunks).

This approach gives you the best of both worlds:

- Instant responses for repeated queries
- Preserved streaming behavior for UI development

The middleware handles all transformations needed to make cached responses indistinguishable from fresh ones, including normalizing tool calls and fixing timestamp formats.

### [Middleware](#middleware)



``` ts
import  from 'ai';import 'dotenv/config';import fs from 'fs';import path from 'path';
const CACHE_FILE = path.join(process.cwd(), '.cache/ai-cache.json');
export const cached = (model: LanguageModelV1) =>  wrapLanguageModel();
const ensureCacheFile = () => );  }  if (!fs.existsSync(CACHE_FILE)) ');  }};
const getCachedResult = (key: string | object) =>  catch (error) };
const updateCache = (key: string, value: any) => ;    fs.writeFileSync(CACHE_FILE, JSON.stringify(updatedCache, null, 2));    console.log('Cache updated for key:', key);  } catch (error) };const cleanPrompt = (prompt: LanguageModelV1Prompt) =>  : part,      );    }    if (m.role === 'tool') ,      }));    }
    return m;  });};
export const cacheMiddleware: LanguageModelV2Middleware = ) => );    console.log('Cache Key:', cacheKey);
    const cached = getCachedResult(cacheKey) as Awaited<      ReturnType<LanguageModelV1['doGenerate']>    > | null;
    if (cached && cached !== null) ,      };    }
    console.log('Cache Miss');    const result = await doGenerate();
    updateCache(cacheKey, result);
    return result;  },  wrapStream: async () => );    console.log('Cache Key:', cacheKey);
    // Check if the result is in the cache    const cached = getCachedResult(cacheKey);
    // If cached, return a simulated ReadableStream that yields the cached result    if (cached && cached !== null) ;        } else return p;      });      return ),      };    }
    console.log('Cache Miss');    // If not cached, proceed with streaming    const  = await doStream();
    const fullResponse: LanguageModelV1StreamPart[] = [];
    const transformStream = new TransformStream<      LanguageModelV1StreamPart,      LanguageModelV1StreamPart    >(,      flush() ,    });
    return ;  },};
```


## [Using the Middleware](#using-the-middleware)

The middleware can be easily integrated into your existing AI SDK setup:



``` ts
import  from '@ai-sdk/openai';import  from 'ai';import 'dotenv/config';import  from '../middleware/your-cache-middleware';
async function main() );
  for await (const textPart of result.textStream) 
  console.log();  console.log('Token usage:', await result.usage);  console.log('Finish reason:', await result.finishReason);}
main().catch(console.error);
```


## [Considerations](#considerations)

When using this caching middleware, keep these points in mind:

1.  **Development Only** - This approach is intended for local development, not production environments
2.  **Cache Invalidation** - You'll need to clear the cache (delete the cache file) when you want fresh responses
3.  **Multi-Step Flows** - When using `maxSteps`, be aware that caching occurs at the individual language model response level, not across the entire execution flow. This means that while the model's generation is cached, the tool call is not and will run on each generation.
















On this page






























Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.