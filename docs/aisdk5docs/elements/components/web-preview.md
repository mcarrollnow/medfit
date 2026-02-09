AI SDK 5 is available now.










Menu


















































































































































































































































# [WebPreview](#webpreview)

The `WebPreview` component provides a flexible way to showcase the result of a generated UI component, along with its source code. It is designed for documentation and demo purposes, allowing users to interact with live examples and view the underlying implementation.




Code

Preview



























## [Installation](#installation)




ai-elements

shadcn

Manual




``` geist-overflow-scroll-y
npx ai-elements@latest add web-preview
```
















## [Usage](#usage)



``` tsx
import  from '@/components/ai-elements/web-preview';
```




``` tsx
```


## [Usage with AI SDK](#usage-with-ai-sdk)


Install the `v0-sdk` package:







pnpm







npm







yarn








``` geist-overflow-scroll-y
pnpm add v0-sdk
```













Add the following component to your frontend:












``` tsx
'use client';
import  from '@/components/ai-elements/web-preview';import  from 'react';import  from '@/components/ai-elements/prompt-input';import  from '../ai-elements/loader';
const WebPreviewDemo = () => ,        body: JSON.stringify(),      });
      const data = await response.json();      setPreviewUrl(data.demo || '/');      console.log('Generation finished:', data);    } catch (error)  finally   };
  return (    <div className="max-w-4xl mx-auto p-6 relative size-full rounded-lg border h-[600px]">      <div className="flex flex-col h-full">        <div className="flex-1 mb-4">          >              <WebPreviewNavigation>                <WebPreviewUrl />              </WebPreviewNavigation>              <WebPreviewBody src= />            </WebPreview>          ) : (            <div className="flex items-center justify-center h-full text-muted-foreground">              Your generated app will appear here            </div>          )}        </div>
        <Input          onSubmit=          className="w-full max-w-2xl mx-auto relative"        >          <PromptInputTextarea            value=            placeholder="Describe the app you want to build..."            onChange=            className="pr-12 min-h-[60px]"          />          <PromptInputSubmit            status=            disabled=            className="absolute bottom-1 right-1"          />        </Input>      </div>    </div>  );};
export default WebPreviewDemo;
```


Add the following route to your backend:












``` ts
import  from 'v0-sdk';
export async function POST(req: Request) :  = await req.json();
  const result = await v0.chats.create(,  });
  return Response.json();}
```


## [Features](#features)

- Live preview of UI components
- Composable architecture with dedicated sub-components
- Responsive design modes (Desktop, Tablet, Mobile)
- Navigation controls with back/forward functionality
- URL input and example selector
- Full screen mode support
- Console logging with timestamps
- Context-based state management
- Consistent styling with the design system
- Easy integration into documentation pages

## [Props](#props)

### [`<WebPreview />`](#webpreview-)






### defaultUrl?:


string




The initial URL to load in the preview (default: empty string).





### onUrlChange?:


(url: string) =\> void




Callback fired when the URL changes.





### \[...props\]?:


React.HTMLAttributes\<HTMLDivElement\>




Any other props are spread to the root div.






### [`<WebPreviewNavigation />`](#webpreviewnavigation-)






### \[...props\]?:


React.HTMLAttributes\<HTMLDivElement\>




Any other props are spread to the navigation container.






### [`<WebPreviewNavigationButton />`](#webpreviewnavigationbutton-)






### tooltip?:


string




Tooltip text to display on hover.





### \[...props\]?:


React.ComponentProps\<typeof Button\>




Any other props are spread to the underlying shadcn/ui Button component.






### [`<WebPreviewUrl />`](#webpreviewurl-)






### \[...props\]?:


React.ComponentProps\<typeof Input\>




Any other props are spread to the underlying shadcn/ui Input component.






### [`<WebPreviewBody />`](#webpreviewbody-)






### loading?:


React.ReactNode




Optional loading indicator to display over the preview.





### \[...props\]?:


React.IframeHTMLAttributes\<HTMLIFrameElement\>




Any other props are spread to the underlying iframe.






### [`<WebPreviewConsole />`](#webpreviewconsole-)






### logs?:


Array\<\>




Console log entries to display in the console panel.





### \[...props\]?:


React.HTMLAttributes\<HTMLDivElement\>




Any other props are spread to the root div.

















On this page
















































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.