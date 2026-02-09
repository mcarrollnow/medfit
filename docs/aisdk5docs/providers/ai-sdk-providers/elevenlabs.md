AI SDK 5 is available now.










Menu






















































































































































































































































































































































































































































































# [ElevenLabs Provider](#elevenlabs-provider)


## [Setup](#setup)

The ElevenLabs provider is available in the `@ai-sdk/elevenlabs` module. You can install it with






pnpm







npm







yarn







bun








``` geist-overflow-scroll-y
pnpm add @ai-sdk/elevenlabs
```












## [Provider Instance](#provider-instance)

You can import the default provider instance `elevenlabs` from `@ai-sdk/elevenlabs`:



``` ts
import  from '@ai-sdk/elevenlabs';
```


If you need a customized setup, you can import `createElevenLabs` from `@ai-sdk/elevenlabs` and create a provider instance with your settings:



``` ts
import  from '@ai-sdk/elevenlabs';
const elevenlabs = createElevenLabs();
```


You can use the following optional settings to customize the ElevenLabs provider instance:

- **apiKey** *string*

  API key that is being sent using the `Authorization` header. It defaults to the `ELEVENLABS_API_KEY` environment variable.

- **headers** *Record\<string,string\>*

  Custom headers to include in the requests.

- **fetch** *(input: RequestInfo, init?: RequestInit) =\> Promise\<Response\>*


## [Speech Models](#speech-models)


The first argument is the model id e.g. `eleven_multilingual_v2`.



``` ts
const model = elevenlabs.speech('eleven_multilingual_v2');
```


You can also pass additional provider-specific options using the `providerOptions` argument. For example, supplying a voice to use for the generated audio.



``` ts
import  from 'ai';import  from '@ai-sdk/elevenlabs';
const result = await generateSpeech( },});
```


- **language_code** *string or null*  
  Optional. Language code (ISO 639-1) used to enforce a language for the model. Currently, only Turbo v2.5 and Flash v2.5 support language enforcement. For other models, providing a language code will result in an error.

- **voice_settings** *object or null*  
  Optional. Voice settings that override stored settings for the given voice. These are applied only to the current request.

  - **stability** *double or null*  
    Optional. Determines how stable the voice is and the randomness between each generation. Lower values introduce broader emotional range; higher values result in a more monotonous voice.
  - **use_speaker_boost** *boolean or null*  
    Optional. Boosts similarity to the original speaker. Increases computational load and latency.
  - **similarity_boost** *double or null*  
    Optional. Controls how closely the AI should adhere to the original voice.
  - **style** *double or null*  
    Optional. Amplifies the style of the original speaker. May increase latency if set above 0.

- **pronunciation_dictionary_locators** *array of objects or null*  
  Optional. A list of pronunciation dictionary locators to apply to the text, in order. Up to 3 locators per request.  
  Each locator object:

  - **pronunciation_dictionary_id** *string* (required)  
    The ID of the pronunciation dictionary.
  - **version_id** *string or null* (optional)  
    The version ID of the dictionary. If not provided, the latest version is used.

- **seed** *integer or null*  
  Optional. If specified, the system will attempt to sample deterministically. Must be between 0 and 4294967295. Determinism is not guaranteed.

- **previous_text** *string or null*  
  Optional. The text that came before the current request's text. Can improve continuity when concatenating generations or influence current generation continuity.

- **next_text** *string or null*  
  Optional. The text that comes after the current request's text. Can improve continuity when concatenating generations or influence current generation continuity.

- **previous_request_ids** *array of strings or null*  
  Optional. List of request IDs for samples generated before this one. Improves continuity when splitting large tasks. Max 3 IDs. If both `previous_text` and `previous_request_ids` are sent, `previous_text` is ignored.

- **next_request_ids** *array of strings or null*  
  Optional. List of request IDs for samples generated after this one. Useful for maintaining continuity when regenerating a sample. Max 3 IDs. If both `next_text` and `next_request_ids` are sent, `next_text` is ignored.

- **apply_text_normalization** *enum*  
  Optional. Controls text normalization.  
  Allowed values: `'auto'` (default), `'on'`, `'off'`.

  - `'auto'`: System decides whether to apply normalization (e.g., spelling out numbers).
  - `'on'`: Always apply normalization.
  - `'off'`: Never apply normalization.  
    For `eleven_turbo_v2_5` and `eleven_flash_v2_5`, can only be enabled with Enterprise plans.

- **apply_language_text_normalization** *boolean*  
  Optional. Defaults to `false`. Controls language text normalization, which helps with proper pronunciation in some supported languages (currently only Japanese). May significantly increase latency.

### [Model Capabilities](#model-capabilities)


| Model | Instructions |
|----|----|


## [Transcription Models](#transcription-models)


The first argument is the model id e.g. `scribe_v1`.



``` ts
const model = elevenlabs.transcription('scribe_v1');
```


You can also pass additional provider-specific options using the `providerOptions` argument. For example, supplying the input language in ISO-639-1 (e.g. `en`) format can sometimes improve transcription performance if known beforehand.



``` ts
import  from 'ai';import  from '@ai-sdk/elevenlabs';
const result = await transcribe( },});
```


The following provider options are available:

- **languageCode** *string*

  An ISO-639-1 or ISO-639-3 language code corresponding to the language of the audio file. Can sometimes improve transcription performance if known beforehand. Defaults to `null`, in which case the language is predicted automatically.

- **tagAudioEvents** *boolean*

  Whether to tag audio events like (laughter), (footsteps), etc. in the transcription. Defaults to `true`.

- **numSpeakers** *integer*

  The maximum amount of speakers talking in the uploaded file. Can help with predicting who speaks when. The maximum amount of speakers that can be predicted is 32. Defaults to `null`, in which case the amount of speakers is set to the maximum value the model supports.

- **timestampsGranularity** *enum*

  The granularity of the timestamps in the transcription. Defaults to `'word'`. Allowed values: `'none'`, `'word'`, `'character'`.

- **diarize** *boolean*

  Whether to annotate which speaker is currently talking in the uploaded file. Defaults to `true`.

- **fileFormat** *enum*

  The format of input audio. Defaults to `'other'`. Allowed values: `'pcm_s16le_16'`, `'other'`. For `'pcm_s16le_16'`, the input audio must be 16-bit PCM at a 16kHz sample rate, single channel (mono), and little-endian byte order. Latency will be lower than with passing an encoded waveform.

### [Model Capabilities](#model-capabilities-1)


| Model | Transcription | Duration | Segments | Language |
|----|----|----|----|----|

















On this page



































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.