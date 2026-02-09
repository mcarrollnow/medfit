AI SDK 5 is available now.










Menu






















































































































































































































































































































































































































































































# [Rev.ai Provider](#revai-provider)


## [Setup](#setup)

The Rev.ai provider is available in the `@ai-sdk/revai` module. You can install it with






pnpm







npm







yarn







bun








``` geist-overflow-scroll-y
pnpm add @ai-sdk/revai
```












## [Provider Instance](#provider-instance)

You can import the default provider instance `revai` from `@ai-sdk/revai`:



``` ts
import  from '@ai-sdk/revai';
```


If you need a customized setup, you can import `createRevai` from `@ai-sdk/revai` and create a provider instance with your settings:



``` ts
import  from '@ai-sdk/revai';
const revai = createRevai();
```


You can use the following optional settings to customize the Rev.ai provider instance:

- **apiKey** *string*

  API key that is being sent using the `Authorization` header. It defaults to the `REVAI_API_KEY` environment variable.

- **headers** *Record\<string,string\>*

  Custom headers to include in the requests.

- **fetch** *(input: RequestInfo, init?: RequestInit) =\> Promise\<Response\>*


## [Transcription Models](#transcription-models)


The first argument is the model id e.g. `machine`.



``` ts
const model = revai.transcription('machine');
```


You can also pass additional provider-specific options using the `providerOptions` argument. For example, supplying the input language in ISO-639-1 (e.g. `en`) format can sometimes improve transcription performance if known beforehand.



``` ts
import  from 'ai';import  from '@ai-sdk/revai';import  from 'fs/promises';
const result = await transcribe( },});
```


The following provider options are available:

- **metadata** *string*

  Optional metadata that was provided during job submission.

- **notification_config** *object*

  Optional configuration for a callback url to invoke when processing is complete.

  - **url** *string* - Callback url to invoke when processing is complete.
  - **auth_headers** *object* - Optional authorization headers, if needed to invoke the callback.
    - **Authorization** *string* - Authorization header value.

- **delete_after_seconds** *integer*

  Amount of time after job completion when job is auto-deleted.

- **verbatim** *boolean*

  Configures the transcriber to transcribe every syllable, including all false starts and disfluencies.

- **rush** *boolean*

  \[HIPAA Unsupported\] Only available for human transcriber option. When set to true, your job is given higher priority.

- **skip_diarization** *boolean*

  Specify if speaker diarization will be skipped by the speech engine.

- **skip_postprocessing** *boolean*

  Only available for English and Spanish languages. User-supplied preference on whether to skip post-processing operations.

- **skip_punctuation** *boolean*

  Specify if "punct" type elements will be skipped by the speech engine.

- **remove_disfluencies** *boolean*

  When set to true, disfluencies (like 'ums' and 'uhs') will not appear in the transcript.

- **remove_atmospherics** *boolean*

  When set to true, atmospherics (like `<laugh>`, `<affirmative>`) will not appear in the transcript.

- **filter_profanity** *boolean*

  When enabled, profanities will be filtered by replacing characters with asterisks except for the first and last.

- **speaker_channels_count** *integer*

  Only available for English, Spanish and French languages. Specify the total number of unique speaker channels in the audio.

- **speakers_count** *integer*

  Only available for English, Spanish and French languages. Specify the total number of unique speakers in the audio.

- **diarization_type** *string*

  Specify diarization type. Possible values: "standard" (default), "premium".

- **custom_vocabulary_id** *string*

  Supply the id of a pre-completed custom vocabulary submitted through the Custom Vocabularies API.

- **custom_vocabularies** *Array*

  Specify a collection of custom vocabulary to be used for this job.

- **strict_custom_vocabulary** *boolean*

  If true, only exact phrases will be used as custom vocabulary.

- **summarization_config** *object*

  Specify summarization options.

  - **model** *string* - Model type for summarization. Possible values: "standard" (default), "premium".
  - **type** *string* - Summarization formatting type. Possible values: "paragraph" (default), "bullets".
  - **prompt** *string* - Custom prompt for flexible summaries (mutually exclusive with type).

- **translation_config** *object*

  Specify translation options.

  - **target_languages** *Array* - Array of target languages for translation.
  - **model** *string* - Model type for translation. Possible values: "standard" (default), "premium".

- **language** *string*

  Language is provided as a ISO 639-1 language code. Default is "en".

- **forced_alignment** *boolean*

  When enabled, provides improved accuracy for per-word timestamps for a transcript. Default is `false`.

  Currently supported languages:

  - English (en, en-us, en-gb)
  - French (fr)
  - Italian (it)
  - German (de)
  - Spanish (es)

  Note: This option is not available in low-cost environment.

### [Model Capabilities](#model-capabilities)


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