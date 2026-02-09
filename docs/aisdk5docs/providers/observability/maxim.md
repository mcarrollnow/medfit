AI SDK 5 is available now.










Menu






















































































































































































































































































































































































































































































# [Maxim Observability](#maxim-observability)


- Automatic Observability – Adds tracing, logging, and metadata to AI SDK calls with a simple wrapper.

- Unified Model Wrapping – Supports OpenAI, Anthropic, and Google etc. models uniformly.

- Custom Metadata & Tagging – Enables attaching trace names, tags, and session IDs to track usage.

- Streaming & Structured Output Support – Handles streaming responses and structured outputs seamlessly.

# [Setting up Maxim with the AI SDK](#setting-up-maxim-with-the-ai-sdk)

## [Requirements](#requirements)



``` undefined
"ai""@ai-sdk/openai""@ai-sdk/anthropic""@ai-sdk/google""@maximai/maxim-js"
```


## [Environment Variables](#environment-variables)



``` undefined
MAXIM_API_KEY=MAXIM_LOG_REPO_ID=OPENAI_API_KEY=ANTHROPIC_API_KEY=
```


## [Initialize Logger](#initialize-logger)



``` javascript
import  from '@maximai/maxim-js';
async function initializeMaxim() 
  const maxim = new Maxim();  const logger = await maxim.logger();
  if (!logger) 
  return ;}
```


## [Wrap AI SDK Models with Maxim](#wrap-ai-sdk-models-with-maxim)



``` javascript
import  from '@ai-sdk/openai';import  from '@maximai/maxim-js/vercel-ai-sdk';
const model = wrapMaximAISDKModel(openai('gpt-4'), logger);
```


## [Make LLM calls using wrapped models](#make-llm-calls-using-wrapped-models)



``` javascript
import  from 'ai';import  from '@ai-sdk/openai';import  from '@maximai/maxim-js/vercel-ai-sdk';
const model = wrapMaximAISDKModel(openai('gpt-4'), logger);
// Generate text with automatic loggingconst response = await generateText();
console.log('Response:', response.text);
```


## [Working with Different AI SDK Functions](#working-with-different-ai-sdk-functions)

The wrapped model works seamlessly with all Vercel AI SDK functions:

### [**Generate Object**](#generate-object)



``` javascript
import  from 'ai';import  from 'zod';
const response = await generateObject(),});
console.log(response.object);
```


### [**Stream Text**](#stream-text)



``` javascript
import  from 'ai';
const  = await streamText();
for await (const textPart of textStream) 
```



### [**Using Custom Metadata**](#using-custom-metadata)



``` javascript
import  from '@maximai/maxim-js/vercel-ai-sdk';
const response = await generateText(,    } as MaximVercelProviderMetadata,  },});
```



**Entity Naming:**

- `sessionName` - Override the default session name
- `traceName` - Override the default trace name
- `spanName` - Override the default span name
- `generationName` - Override the default LLM generation name

**Entity Tagging:**

- `sessionTags` - Add custom tags to the session `(object: )`
- `traceTags` - Add custom tags to the trace `(object: )`
- `spanTags` - Add custom tags to span `(object: )`
- `generationTags` - Add custom tags to LLM generations `(object: )`

**ID References:**

- `sessionId` - Link this trace to an existing session
- `traceId` - Use a specific trace ID
- `spanId` - Use a specific span ID

![Maxim Demo](../../../cdn.getmaxim.ai/public/images/maxim_vercel.gif)

## [Streaming Support](#streaming-support)



``` javascript
import  from 'ai';import  from '@ai-sdk/openai';import  from '@maximai/maxim-js/vercel-ai-sdk';
const model = wrapMaximAISDKModel(openai('gpt-4'), logger);
const  = await streamText(,    } as MaximVercelProviderMetadata,  },});
for await (const textPart of textStream) 
```


## [Multiple Provider Support](#multiple-provider-support)



``` javascript
import  from '@ai-sdk/openai';import  from '@ai-sdk/anthropic';import  from '@ai-sdk/google';import  from '@maximai/maxim-js/vercel-ai-sdk';
// Wrap different provider modelsconst openaiModel = wrapMaximAISDKModel(openai('gpt-4'), logger);const anthropicModel = wrapMaximAISDKModel(  anthropic('claude-3-5-sonnet-20241022'),  logger,);const googleModel = wrapMaximAISDKModel(google('gemini-pro'), logger);
// Use them with the same interfaceconst responses = await Promise.all([  generateText(),  generateText(),  generateText(),]);
```


## [Next.js Integration](#nextjs-integration)

### [**API Route Example**](#api-route-example)



``` javascript
// app/api/chat/route.jsimport  from 'ai';import  from '@ai-sdk/openai';import  from '@maximai/maxim-js/vercel-ai-sdk';import  from "@maximai/maxim-js";
const maxim = new Maxim();const logger = await maxim.logger();const model = wrapMaximAISDKModel(openai('gpt-4'), logger);
export async function POST(req)  = await req.json();
  const result = await streamText(,      } as MaximVercelProviderMetadata,    },  });
  return result.toAIStreamResponse();}
```


### [**Client-side Integration**](#client-side-integration)



``` javascript
// components/Chat.jsximport  from 'ai/react';
export default function Chat()  = useChat();
  return (    <div>      >          <strong>:</strong>         </div>      ))}
      <form onSubmit=>        <input          value=          onChange=          placeholder="Say something..."        />        <button type="submit">Send</button>      </form>    </div>  );}
```


## [Learn more](#learn-more)

- After setting up Maxim tracing for the Vercel AI SDK, you can explore other Maxim platform capabilities:

  - Prompt Management: Version, manage, and dynamically apply prompts across environments and agents.
  - Evaluations: Run automated and manual evaluations on traces, generations, and full agent trajectories.
  - Simulations: Test agents in real-world scenarios with simulated multi-turn interactions and workflows.

















On this page









































































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.