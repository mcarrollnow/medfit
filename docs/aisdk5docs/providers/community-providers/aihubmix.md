AI SDK 5 is available now.










Menu






















































































































































































































































































































































































































































































# [Aihubmix Provider](#aihubmix-provider)


## [Setup](#setup)

The Aihubmix provider is available in the `@aihubmix/ai-sdk-provider` module. You can install it with






pnpm







npm







yarn








``` geist-overflow-scroll-y
pnpm add @aihubmix/ai-sdk-provider
```












## [Provider Instance](#provider-instance)

### [Method 1: Using createAihubmix](#method-1-using-createaihubmix)

To create an Aihubmix provider instance, use the `createAihubmix` function:



``` typescript
import  from '@aihubmix/ai-sdk-provider';
const aihubmix = createAihubmix();
```



### [Method 2: Using Environment Variables](#method-2-using-environment-variables)

Alternatively, you can use the pre-configured `aihubmix` instance by setting the `AIHUBMIX_API_KEY` environment variable:



``` bash
# .envAIHUBMIX_API_KEY=your_api_key_here
```


Then import and use the pre-configured instance:



``` ts
import  from '@aihubmix/ai-sdk-provider';
```


## [Usage](#usage)

### [Chat Completion](#chat-completion)



``` ts
import  from '@aihubmix/ai-sdk-provider';import  from 'ai';
const  = await generateText();
```


### [Claude Model](#claude-model)



``` ts
import  from '@aihubmix/ai-sdk-provider';import  from 'ai';
const  = await generateText();
```


### [Gemini Model](#gemini-model)



``` ts
import  from '@aihubmix/ai-sdk-provider';import  from 'ai';
const  = await generateText();
```


### [Image Generation](#image-generation)



``` ts
import  from '@aihubmix/ai-sdk-provider';import  from 'ai';
const  = await generateImage();
```


### [Embeddings](#embeddings)



``` ts
import  from '@aihubmix/ai-sdk-provider';import  from 'ai';
const  = await embed();
```


### [Transcription](#transcription)



``` ts
import  from '@aihubmix/ai-sdk-provider';import  from 'ai';
const  = await transcribe();
```


### [Stream Text](#stream-text)



``` ts
import  from '@aihubmix/ai-sdk-provider';import  from 'ai';
const result = streamText();
let fullText = '';for await (const textPart of result.textStream) 
console.log('\nUsage:', await result.usage);console.log('Finish reason:', await result.finishReason);
```


### [Generate Object](#generate-object)



``` ts
import  from '@aihubmix/ai-sdk-provider';import  from 'ai';import  from 'zod';
const result = await generateObject(),      ),      steps: z.array(z.string()),    }),  }),  prompt: 'Generate a lasagna recipe.',});
console.log(JSON.stringify(result.object.recipe, null, 2));console.log('Token usage:', result.usage);console.log('Finish reason:', result.finishReason);
```


### [Stream Object](#stream-object)



``` ts
import  from '@aihubmix/ai-sdk-provider';import  from 'ai';import  from 'zod';
const result = streamObject(),      ),      steps: z.array(z.string()),    }),  }),  prompt: 'Generate a lasagna recipe.',});
for await (const objectPart of result.partialObjectStream) 
console.log('Token usage:', await result.usage);console.log('Final object:', await result.object);
```


### [Embed Many](#embed-many)



``` ts
import  from '@aihubmix/ai-sdk-provider';import  from 'ai';
const  = await embedMany();
console.log('Embeddings:', embeddings);console.log('Usage:', usage);
```


### [Speech Synthesis](#speech-synthesis)



``` ts
import  from '@aihubmix/ai-sdk-provider';import  from 'ai';
const  = await generateSpeech();
```


## [Tools](#tools)

The Aihubmix provider supports various tools including web search:



``` ts
import  from '@aihubmix/ai-sdk-provider';import  from 'ai';
const  = await generateText(),  },});
```


## [Additional Resources](#additional-resources)

















On this page












































































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.