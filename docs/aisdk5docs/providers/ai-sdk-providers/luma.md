AI SDK 5 is available now.










Menu






















































































































































































































































































































































































































































































# [Luma Provider](#luma-provider)


## [Setup](#setup)

The Luma provider is available via the `@ai-sdk/luma` module. You can install it with






pnpm







npm







yarn







bun








``` geist-overflow-scroll-y
pnpm add @ai-sdk/luma
```












## [Provider Instance](#provider-instance)

You can import the default provider instance `luma` from `@ai-sdk/luma`:



``` ts
import  from '@ai-sdk/luma';
```


If you need a customized setup, you can import `createLuma` and create a provider instance with your settings:



``` ts
import  from '@ai-sdk/luma';
const luma = createLuma(, // optional});
```


You can use the following optional settings to customize the Luma provider instance:

- **baseURL** *string*

  Use a different URL prefix for API calls, e.g. to use proxy servers. The default prefix is `https://api.lumalabs.ai`.

- **apiKey** *string*

  API key that is being sent using the `Authorization` header. It defaults to the `LUMA_API_KEY` environment variable.

- **headers** *Record\<string,string\>*

  Custom headers to include in the requests.

- **fetch** *(input: RequestInfo, init?: RequestInit) =\> Promise\<Response\>*


## [Image Models](#image-models)

You can create Luma image models using the `.image()` factory method. For more on image generation with the AI SDK see [generateImage()](../../docs/reference/ai-sdk-core/generate-image.html).

### [Basic Usage](#basic-usage)



``` ts
import  from '@ai-sdk/luma';import  from 'ai';import fs from 'fs';
const  = await generateImage();
const filename = `image-$.png`;fs.writeFileSync(filename, image.uint8Array);console.log(`Image saved to $`);
```


### [Image Model Settings](#image-model-settings)

You can customize the generation behavior with optional settings:



``` ts
const  = await generateImage(,  },});
```


Since Luma processes images through an asynchronous queue system, these settings allow you to tune the polling behavior:

- **maxImagesPerCall** *number*

  Override the maximum number of images generated per API call. Defaults to 1.

- **pollIntervalMillis** *number*

  Control how frequently the API is checked for completed images while they are being processed. Defaults to 500ms.

- **maxPollAttempts** *number*

  Limit how long to wait for results before timing out, since image generation is queued asynchronously. Defaults to 120 attempts.

### [Model Capabilities](#model-capabilities)

Luma offers two main models:


| Model | Description |
|----|----|
| `photon-1` | High-quality image generation with superior prompt understanding |
| `photon-flash-1` | Faster generation optimized for speed while maintaining quality |


Both models support the following aspect ratios:

- 1:1
- 3:4
- 4:3
- 9:16
- 16:9 (default)
- 9:21
- 21:9


Key features of Luma models include:

- Ultra-high quality image generation
- 10x higher cost efficiency compared to similar models
- Superior prompt understanding and adherence
- Unique character consistency capabilities from single reference images
- Multi-image reference support for precise style matching

### [Advanced Options](#advanced-options)

Luma models support several advanced features through the `providerOptions.luma` parameter.

#### [Image Reference](#image-reference)

Use up to 4 reference images to guide your generation. Useful for creating variations or visualizing complex concepts. Adjust the `weight` (0-1) to control the influence of reference images.



``` ts
// Example: Generate a salamander with referenceawait generateImage(,      ],    },  },});
```


#### [Style Reference](#style-reference)

Apply specific visual styles to your generations using reference images. Control the style influence using the `weight` parameter.



``` ts
// Example: Generate with style referenceawait generateImage(,      ],    },  },});
```


#### [Character Reference](#character-reference)

Create consistent and personalized characters using up to 4 reference images of the same subject. More reference images improve character representation.



``` ts
// Example: Generate character-based imageawait generateImage(,      },    },  },});
```


#### [Modify Image](#modify-image)

Transform existing images using text prompts. Use the `weight` parameter to control how closely the result matches the input image (higher weight = closer to input but less creative).




For color changes, it's recommended to use a lower weight value (0.0-0.1).





``` ts
// Example: Modify existing imageawait generateImage(,    },  },});
```


















On this page


















































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.