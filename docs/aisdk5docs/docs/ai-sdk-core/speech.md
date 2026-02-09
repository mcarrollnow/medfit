AI SDK 5 is available now.










Menu






















































































































































































































































































































































# [Speech](#speech)






The AI SDK provides the [`generateSpeech`](../reference/ai-sdk-core/generate-speech.html) function to generate speech from text using a speech model.



``` ts
import  from 'ai';import  from '@ai-sdk/openai';
const audio = await generateSpeech();
```


### [Language Setting](#language-setting)

You can specify the language for speech generation (provider support varies):



``` ts
import  from 'ai';import  from '@ai-sdk/lmnt';
const audio = await generateSpeech();
```


To access the generated audio:



``` ts
const audio = audio.audioData; // audio data e.g. Uint8Array
```


## [Settings](#settings)

### [Provider-Specific settings](#provider-specific-settings)

You can set model-specific settings with the `providerOptions` parameter.



``` ts
import  from 'ai';import  from '@ai-sdk/openai';
const audio = await generateSpeech(,  },});
```


### [Abort Signals and Timeouts](#abort-signals-and-timeouts)




``` ts
import  from '@ai-sdk/openai';import  from 'ai';
const audio = await generateSpeech();
```


### [Custom Headers](#custom-headers)

`generateSpeech` accepts an optional `headers` parameter of type `Record<string, string>` that you can use to add custom headers to the speech generation request.



``` ts
import  from '@ai-sdk/openai';import  from 'ai';
const audio = await generateSpeech(,});
```


### [Warnings](#warnings)

Warnings (e.g. unsupported parameters) are available on the `warnings` property.



``` ts
import  from '@ai-sdk/openai';import  from 'ai';
const audio = await generateSpeech();
const warnings = audio.warnings;
```


### [Error Handling](#error-handling)

When `generateSpeech` cannot generate a valid audio, it throws a [`AI_NoSpeechGeneratedError`](../reference/ai-sdk-errors/ai-no-speech-generated-error.html).

This error can arise for any the following reasons:

- The model failed to generate a response
- The model generated a response that could not be parsed

The error preserves the following information to help you log the issue:

- `responses`: Metadata about the speech model responses, including timestamp, model, and headers.
- `cause`: The cause of the error. You can use this for more detailed error handling.



``` ts
import  from 'ai';import  from '@ai-sdk/openai';
try );} catch (error) }
```


## [Speech Models](#speech-models)


| Provider | Model |
|----|----|
| [OpenAI](../../providers/ai-sdk-providers/openai.html#speech-models) | `tts-1` |
| [OpenAI](../../providers/ai-sdk-providers/openai.html#speech-models) | `tts-1-hd` |
| [OpenAI](../../providers/ai-sdk-providers/openai.html#speech-models) | `gpt-4o-mini-tts` |
| [ElevenLabs](../../providers/ai-sdk-providers/elevenlabs.html#speech-models) | `eleven_v3` |
| [ElevenLabs](../../providers/ai-sdk-providers/elevenlabs.html#speech-models) | `eleven_multilingual_v2` |
| [ElevenLabs](../../providers/ai-sdk-providers/elevenlabs.html#speech-models) | `eleven_flash_v2_5` |
| [ElevenLabs](../../providers/ai-sdk-providers/elevenlabs.html#speech-models) | `eleven_flash_v2` |
| [ElevenLabs](../../providers/ai-sdk-providers/elevenlabs.html#speech-models) | `eleven_turbo_v2_5` |
| [ElevenLabs](../../providers/ai-sdk-providers/elevenlabs.html#speech-models) | `eleven_turbo_v2` |
| [LMNT](../../providers/ai-sdk-providers/lmnt.html#speech-models) | `aurora` |
| [LMNT](../../providers/ai-sdk-providers/lmnt.html#speech-models) | `blizzard` |
| [Hume](../../providers/ai-sdk-providers/hume.html#speech-models) | `default` |


Above are a small subset of the speech models supported by the AI SDK providers. For more, see the respective provider documentation.
















On this page







































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.