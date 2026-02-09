AI SDK 5 is available now.










Menu






















































































































































































































































































































































# [Transcription](#transcription)






The AI SDK provides the [`transcribe`](../reference/ai-sdk-core/transcribe.html) function to transcribe audio using a transcription model.



``` ts
import  from 'ai';import  from '@ai-sdk/openai';import  from 'fs/promises';
const transcript = await transcribe();
```


The `audio` property can be a `Uint8Array`, `ArrayBuffer`, `Buffer`, `string` (base64 encoded audio data), or a `URL`.

To access the generated transcript:



``` ts
const text = transcript.text; // transcript text e.g. "Hello, world!"const segments = transcript.segments; // array of segments with start and end times, if availableconst language = transcript.language; // language of the transcript e.g. "en", if availableconst durationInSeconds = transcript.durationInSeconds; // duration of the transcript in seconds, if available
```


## [Settings](#settings)

### [Provider-Specific settings](#provider-specific-settings)

Transcription models often have provider or model-specific settings which you can set using the `providerOptions` parameter.



``` ts
import  from 'ai';import  from '@ai-sdk/openai';import  from 'fs/promises';
const transcript = await transcribe(,  },});
```


### [Abort Signals and Timeouts](#abort-signals-and-timeouts)




``` ts
import  from '@ai-sdk/openai';import  from 'ai';import  from 'fs/promises';
const transcript = await transcribe();
```


### [Custom Headers](#custom-headers)

`transcribe` accepts an optional `headers` parameter of type `Record<string, string>` that you can use to add custom headers to the transcription request.



``` ts
import  from '@ai-sdk/openai';import  from 'ai';import  from 'fs/promises';
const transcript = await transcribe(,});
```


### [Warnings](#warnings)

Warnings (e.g. unsupported parameters) are available on the `warnings` property.



``` ts
import  from '@ai-sdk/openai';import  from 'ai';import  from 'fs/promises';
const transcript = await transcribe();
const warnings = transcript.warnings;
```


### [Error Handling](#error-handling)

When `transcribe` cannot generate a valid transcript, it throws a [`AI_NoTranscriptGeneratedError`](../reference/ai-sdk-errors/ai-no-transcript-generated-error.html).

This error can arise for any the following reasons:

- The model failed to generate a response
- The model generated a response that could not be parsed

The error preserves the following information to help you log the issue:

- `responses`: Metadata about the transcription model responses, including timestamp, model, and headers.
- `cause`: The cause of the error. You can use this for more detailed error handling.



``` ts
import  from 'ai';import  from '@ai-sdk/openai';import  from 'fs/promises';
try );} catch (error) }
```


## [Transcription Models](#transcription-models)


| Provider | Model |
|----|----|
| [OpenAI](../../providers/ai-sdk-providers/openai.html#transcription-models) | `whisper-1` |
| [OpenAI](../../providers/ai-sdk-providers/openai.html#transcription-models) | `gpt-4o-transcribe` |
| [OpenAI](../../providers/ai-sdk-providers/openai.html#transcription-models) | `gpt-4o-mini-transcribe` |
| [ElevenLabs](../../providers/ai-sdk-providers/elevenlabs.html#transcription-models) | `scribe_v1` |
| [ElevenLabs](../../providers/ai-sdk-providers/elevenlabs.html#transcription-models) | `scribe_v1_experimental` |
| [Groq](../../providers/ai-sdk-providers/groq.html#transcription-models) | `whisper-large-v3-turbo` |
| [Groq](../../providers/ai-sdk-providers/groq.html#transcription-models) | `distil-whisper-large-v3-en` |
| [Groq](../../providers/ai-sdk-providers/groq.html#transcription-models) | `whisper-large-v3` |
| [Azure OpenAI](../../providers/ai-sdk-providers/azure.html#transcription-models) | `whisper-1` |
| [Azure OpenAI](../../providers/ai-sdk-providers/azure.html#transcription-models) | `gpt-4o-transcribe` |
| [Azure OpenAI](../../providers/ai-sdk-providers/azure.html#transcription-models) | `gpt-4o-mini-transcribe` |
| [Rev.ai](../../providers/ai-sdk-providers/revai.html#transcription-models) | `machine` |
| [Rev.ai](../../providers/ai-sdk-providers/revai.html#transcription-models) | `low_cost` |
| [Rev.ai](../../providers/ai-sdk-providers/revai.html#transcription-models) | `fusion` |
| [Deepgram](../../providers/ai-sdk-providers/deepgram.html#transcription-models) | `base` (+ variants) |
| [Deepgram](../../providers/ai-sdk-providers/deepgram.html#transcription-models) | `enhanced` (+ variants) |
| [Deepgram](../../providers/ai-sdk-providers/deepgram.html#transcription-models) | `nova` (+ variants) |
| [Deepgram](../../providers/ai-sdk-providers/deepgram.html#transcription-models) | `nova-2` (+ variants) |
| [Deepgram](../../providers/ai-sdk-providers/deepgram.html#transcription-models) | `nova-3` (+ variants) |
| [Gladia](../../providers/ai-sdk-providers/gladia.html#transcription-models) | `default` |
| [AssemblyAI](../../providers/ai-sdk-providers/assemblyai.html#transcription-models) | `best` |
| [AssemblyAI](../../providers/ai-sdk-providers/assemblyai.html#transcription-models) | `nano` |
| [Fal](../../providers/ai-sdk-providers/fal.html#transcription-models) | `whisper` |
| [Fal](../../providers/ai-sdk-providers/fal.html#transcription-models) | `wizper` |


Above are a small subset of the transcription models supported by the AI SDK providers. For more, see the respective provider documentation.
















On this page




































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.