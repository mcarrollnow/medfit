AI SDK 5 is available now.










Menu


















































































































































































































































# [Image](#image)

The `Image` component displays AI-generated images from the AI SDK. It accepts a [`Experimental_GeneratedImage`](../../docs/reference/ai-sdk-core/generate-image.html) object from the AI SDK's `generateImage` function and automatically renders it as an image.




Code

Preview











## [Installation](#installation)




ai-elements

shadcn

Manual




``` geist-overflow-scroll-y
npx ai-elements@latest add image
```
















## [Usage](#usage)



``` tsx
import  from '@/components/ai-elements/image';
```




``` tsx
```


## [Usage with AI SDK](#usage-with-ai-sdk)

Build a simple app allowing a user to generate an image given a prompt.

Install the `@ai-sdk/openai` package:







pnpm







npm







yarn








``` geist-overflow-scroll-y
pnpm add @ai-sdk/openai
```













Add the following component to your frontend:












``` tsx
'use client';
import  from '@/components/ai-elements/image';import  from '@/components/ai-elements/prompt-input';import  from 'react';import  from '@/components/ai-elements/loader';
const ImageDemo = () => ),      });
      const data = await response.json();
      setImageData(data);    } catch (error)  finally   };
  return (    <div className="max-w-4xl mx-auto p-6 relative size-full rounded-lg border h-[600px]">      <div className="flex flex-col h-full">        <div className="flex-1 overflow-y-auto p-4">                          alt="Generated image"                className="h-[300px] aspect-square border rounded-lg"              />            </div>          )}                  </div>
        <Input          onSubmit=          className="mt-4 w-full max-w-2xl mx-auto relative"        >          <PromptInputTextarea            value=            placeholder="Describe the image you want to generate..."            onChange=            className="pr-12"          />          <PromptInputSubmit            status=            disabled=            className="absolute bottom-1 right-1"          />        </Input>      </div>    </div>  );};
export default ImageDemo;
```


Add the following route to your backend:












``` ts
import  from '@ai-sdk/openai';import  from 'ai';
export async function POST(req: Request) :  = await req.json();
  const  = await experimental_generateImage();
  return Response.json();}
```


## [Features](#features)

- Accepts `Experimental_GeneratedImage` objects directly from the AI SDK
- Automatically creates proper data URLs from base64-encoded image data
- Supports all standard HTML image attributes
- Responsive by default with `max-w-full h-auto` styling
- Customizable with additional CSS classes
- Includes proper TypeScript types for AI SDK compatibility

## [Props](#props)

### [`<Image />`](#image-)






### alt?:


string




Alternative text for the image.





### className?:


string




Additional CSS classes to apply to the image.





### \[...props\]?:


Experimental_GeneratedImage




The image data to display, as returned by the AI SDK.





















On this page

































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.