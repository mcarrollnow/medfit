AI SDK 5 is available now.










Menu






















































































































































































































































































































































































































































































# [React Native Apple Provider](#react-native-apple-provider)


## [Setup](#setup)

The Apple provider is available in the `@react-native-ai/apple` module. You can install it with:






pnpm







npm







yarn







bun








``` geist-overflow-scroll-y
pnpm add @react-native-ai/apple
```












### [Prerequisites](#prerequisites)

Before using the Apple provider, you need:

- **React Native or Expo application**: This provider only works with React Native and Expo applications. For setup instructions, see the [Expo Quickstart guide](../../docs/getting-started/expo.html)
- **iOS 26+**: Required for Apple Intelligence foundation models and core functionality

### [Provider Instance](#provider-instance)

You can import the default provider instance `apple` from `@react-native-ai/apple`:



``` ts
import  from '@react-native-ai/apple';
```


### [Availability Check](#availability-check)

Before using Apple AI features, you can check if they're available on the current device:



``` ts
if (!apple.isAvailable()) 
```


## [Language Models](#language-models)

Apple provides on-device language models through Apple Foundation Models, available on iOS 26+ with Apple Intelligence enabled devices.

### [Text Generation](#text-generation)

Generate text using Apple's on-device language models:



``` ts
import  from '@react-native-ai/apple';import  from 'ai';
const  = await generateText();
```


### [Streaming Text Generation](#streaming-text-generation)

For real-time text generation:



``` ts
import  from '@react-native-ai/apple';import  from 'ai';
const result = streamText();
for await (const chunk of result.textStream) 
```


### [Structured Output Generation](#structured-output-generation)

Generate structured data using Zod schemas:



``` ts
import  from '@react-native-ai/apple';import  from 'ai';import  from 'zod';
const result = await generateObject(),  prompt: 'Create a recipe for chocolate chip cookies',});
```


### [Model Configuration](#model-configuration)

Configure generation parameters:



``` ts
const  = await generateText();
```


### [Tool Calling](#tool-calling)

The Apple provider supports tool calling, where tools are executed by Apple Intelligence rather than the AI SDK. Tools must be pre-registered with the provider using `createAppleProvider` before they can be used in generation calls.



``` ts
import  from '@react-native-ai/apple';import  from 'ai';import  from 'zod';
const getWeather = tool(),  execute: async () => : Sunny, 25°C`;  },});
// Create a provider with all available toolsconst apple = createAppleProvider(,});
// Use the provider with selected toolsconst result = await generateText(,});
```





Since tools are executed by Apple Intelligence rather than the AI SDK, multi-step features like `maxSteps`, `onStepStart`, and `onStepFinish` are not supported.



## [Text Embeddings](#text-embeddings)

Apple provides multilingual text embeddings using `NLContextualEmbedding`, available on iOS 17+.



``` ts
import  from '@react-native-ai/apple';import  from 'ai';
const  = await embed();
```


## [Audio Transcription](#audio-transcription)

Apple provides speech-to-text transcription using `SpeechAnalyzer` and `SpeechTranscriber`, available on iOS 26+.



``` ts
import  from '@react-native-ai/apple';import  from 'ai';
const response = await experimental_transcribe();
console.log(response.text);
```


## [Speech Synthesis](#speech-synthesis)

Apple provides text-to-speech synthesis using `AVSpeechSynthesizer`, available on iOS 13+ with enhanced features on iOS 17+.

### [Basic Speech Generation](#basic-speech-generation)

Convert text to speech:



``` ts
import  from '@react-native-ai/apple';import  from 'ai';
const response = await experimental_generateSpeech();
```


### [Voice Selection](#voice-selection)

You can configure the voice to use for speech synthesis by passing its identifier to the `voice` option.



``` ts
const response = await experimental_generateSpeech();
```


To check for available voices, you can use the `getVoices` method:



``` ts
import  from '@react-native-ai/apple';
const voices = await AppleSpeech.getVoices();console.log(voices);
```


## [Platform Requirements](#platform-requirements)

Different Apple AI features have varying iOS version requirements:


| Feature             | Minimum iOS Version | Additional Requirements           |
|---------------------|---------------------|-----------------------------------|
| Text Generation     | iOS 26+             | Apple Intelligence enabled device |
| Text Embeddings     | iOS 17+             | \-                                |
| Audio Transcription | iOS 26+             | Language assets downloaded        |
| Speech Synthesis    | iOS 13+             | iOS 17+ for Personal Voice        |





Apple Intelligence features are currently available on selected devices. Check Apple's documentation for the latest device compatibility information.



## [Additional Resources](#additional-resources)

















On this page






































































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.