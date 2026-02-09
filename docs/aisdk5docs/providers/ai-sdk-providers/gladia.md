AI SDK 5 is available now.










Menu






















































































































































































































































































































































































































































































# [Gladia Provider](#gladia-provider)


## [Setup](#setup)

The Gladia provider is available in the `@ai-sdk/gladia` module. You can install it with






pnpm







npm







yarn







bun








``` geist-overflow-scroll-y
pnpm add @ai-sdk/gladia
```












## [Provider Instance](#provider-instance)

You can import the default provider instance `gladia` from `@ai-sdk/gladia`:



``` ts
import  from '@ai-sdk/gladia';
```


If you need a customized setup, you can import `createGladia` from `@ai-sdk/gladia` and create a provider instance with your settings:



``` ts
import  from '@ai-sdk/gladia';
const gladia = createGladia();
```


You can use the following optional settings to customize the Gladia provider instance:

- **apiKey** *string*

  API key that is being sent using the `Authorization` header. It defaults to the `GLADIA_API_KEY` environment variable.

- **headers** *Record\<string,string\>*

  Custom headers to include in the requests.

- **fetch** *(input: RequestInfo, init?: RequestInit) =\> Promise\<Response\>*


## [Transcription Models](#transcription-models)




``` ts
const model = gladia.transcription();
```


You can also pass additional provider-specific options using the `providerOptions` argument. For example, supplying the `summarize` option will enable summaries for sections of content.



``` ts
import  from 'ai';import  from '@ai-sdk/gladia';import  from 'fs/promises';
const result = await transcribe( },});
```





Gladia does not have various models, so you can omit the standard `model` id parameter.



The following provider options are available:

- **contextPrompt** *string*

  Context to feed the transcription model with for possible better accuracy. Optional.

- **customVocabulary** *boolean \| any\[\]*

  Custom vocabulary to improve transcription accuracy. Optional.

- **customVocabularyConfig** *object*

  Configuration for custom vocabulary. Optional.

  - **vocabulary** *Array\<string \| \>*
  - **defaultIntensity** *number*

- **detectLanguage** *boolean*

  Whether to automatically detect the language. Optional.

- **enableCodeSwitching** *boolean*

  Enable code switching for multilingual audio. Optional.

- **codeSwitchingConfig** *object*

  Configuration for code switching. Optional.

  - **languages** *string\[\]*

- **language** *string*

  Specify the language of the audio. Optional.

- **callback** *boolean*

  Enable callback when transcription is complete. Optional.

- **callbackConfig** *object*

  Configuration for callback. Optional.

  - **url** *string*
  - **method** *'POST' \| 'PUT'*

- **subtitles** *boolean*

  Generate subtitles from the transcription. Optional.

- **subtitlesConfig** *object*

  Configuration for subtitles. Optional.

  - **formats** *Array\<'srt' \| 'vtt'\>*
  - **minimumDuration** *number*
  - **maximumDuration** *number*
  - **maximumCharactersPerRow** *number*
  - **maximumRowsPerCaption** *number*
  - **style** *'default' \| 'compliance'*

- **diarization** *boolean*

  Enable speaker diarization. Defaults to `true`. Optional.

- **diarizationConfig** *object*

  Configuration for diarization. Optional.

  - **numberOfSpeakers** *number*
  - **minSpeakers** *number*
  - **maxSpeakers** *number*
  - **enhanced** *boolean*

- **translation** *boolean*

  Enable translation of the transcription. Optional.

- **translationConfig** *object*

  Configuration for translation. Optional.

  - **targetLanguages** *string\[\]*
  - **model** *'base' \| 'enhanced'*
  - **matchOriginalUtterances** *boolean*

- **summarization** *boolean*

  Enable summarization of the transcription. Optional.

- **summarizationConfig** *object*

  Configuration for summarization. Optional.

  - **type** *'general' \| 'bullet_points' \| 'concise'*

- **moderation** *boolean*

  Enable content moderation. Optional.

- **namedEntityRecognition** *boolean*

  Enable named entity recognition. Optional.

- **chapterization** *boolean*

  Enable chapterization of the transcription. Optional.

- **nameConsistency** *boolean*

  Enable name consistency in the transcription. Optional.

- **customSpelling** *boolean*

  Enable custom spelling. Optional.

- **customSpellingConfig** *object*

  Configuration for custom spelling. Optional.

  - **spellingDictionary** *Record\<string, string\[\]\>*

- **structuredDataExtraction** *boolean*

  Enable structured data extraction. Optional.

- **structuredDataExtractionConfig** *object*

  Configuration for structured data extraction. Optional.

  - **classes** *string\[\]*

- **sentimentAnalysis** *boolean*

  Enable sentiment analysis. Optional.

- **audioToLlm** *boolean*

  Enable audio to LLM processing. Optional.

- **audioToLlmConfig** *object*

  Configuration for audio to LLM. Optional.

  - **prompts** *string\[\]*

- **customMetadata** *Record\<string, any\>*

  Custom metadata to include with the request. Optional.

- **sentences** *boolean*

  Enable sentence detection. Optional.

- **displayMode** *boolean*

  Enable display mode. Optional.

- **punctuationEnhanced** *boolean*

  Enable enhanced punctuation. Optional.

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