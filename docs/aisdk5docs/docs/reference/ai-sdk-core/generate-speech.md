AI SDK 5 is available now.










Menu


































































































































































































































































































































































































































































































































# [`generateSpeech()`](#generatespeech)






Generates speech audio from text.



``` ts
import  from 'ai';import  from '@ai-sdk/openai';
const  = await generateSpeech();
console.log(audio);
```


## [Examples](#examples)

### [OpenAI](#openai)



``` ts
import  from 'ai';import  from '@ai-sdk/openai';
const  = await generateSpeech();
```


### [ElevenLabs](#elevenlabs)



``` ts
import  from 'ai';import  from '@ai-sdk/elevenlabs';
const  = await generateSpeech();
```


## [Import](#import)



``` geist-overflow-scroll-y
import  from "ai"
```










## [API Signature](#api-signature)

### [Parameters](#parameters)






### model:


SpeechModelV2




The speech model to use.





### text:


string




The text to generate the speech from.





### voice?:


string




The voice to use for the speech.





### outputFormat?:


string




The output format to use for the speech e.g. "mp3", "wav", etc.





### instructions?:


string




Instructions for the speech generation.





### speed?:


number




The speed of the speech generation.





### language?:


string




The language for speech generation. This should be an ISO 639-1 language code (e.g. "en", "es", "fr") or "auto" for automatic language detection. Provider support varies.





### providerOptions?:


Record\<string, Record\<string, JSONValue\>\>




Additional provider-specific options.





### maxRetries?:


number




Maximum number of retries. Default: 2.





### abortSignal?:


AbortSignal




An optional abort signal to cancel the call.





### headers?:


Record\<string, string\>




Additional HTTP headers for the request.






### [Returns](#returns)






### audio:


GeneratedAudioFile




The generated audio.




GeneratedAudioFile




### base64:


string




Audio as a base64 encoded string.





### uint8Array:


Uint8Array




Audio as a Uint8Array.





### mimeType:


string




MIME type of the audio (e.g. "audio/mpeg").





### format:


string




Format of the audio (e.g. "mp3").







### warnings:


SpeechWarning\[\]




Warnings from the model provider (e.g. unsupported settings).





### responses:


Array\<SpeechModelResponseMetadata\>




Response metadata from the provider. There may be multiple responses if we made multiple calls to the model.




SpeechModelResponseMetadata




### timestamp:


Date




Timestamp for the start of the generated response.





### modelId:


string




The ID of the response model that was used to generate the response.





### body?:


unknown




Optional response body.





### headers?:


Record\<string, string\>




Response headers.























On this page






































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.