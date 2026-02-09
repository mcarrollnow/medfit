AI SDK 5 is available now.










Menu


















































































































































































































































# [Code Block](#code-block)

The `CodeBlock` component provides syntax highlighting, line numbers, and copy to clipboard functionality for code blocks.




Code

Preview








``` overflow-hidden
function MyComponent(props) !</h1>
  );
}
```

``` hidden
function MyComponent(props) !</h1>
  );
}
```










## [Installation](#installation)




ai-elements

shadcn

Manual




``` geist-overflow-scroll-y
npx ai-elements@latest add code-block
```
















## [Usage](#usage)



``` tsx
import  from '@/components/ai-elements/code-block';
```




``` tsx
```


## [Usage with AI SDK](#usage-with-ai-sdk)


Add the following component to your frontend:












``` tsx
'use client';
import  from '@ai-sdk/react';import  from '@/app/api/codegen/route';import  from '@/components/ai-elements/prompt-input';import  from '@/components/ai-elements/code-block';import  from 'react';
export default function Page()  = useObject();
  const handleSubmit = (e: React.FormEvent) =>   };
  return (    <div className="max-w-4xl mx-auto p-6 relative size-full rounded-lg border h-[600px]">      <div className="flex flex-col h-full">        <div className="flex-1 overflow-auto mb-4">                        language=              showLineNumbers=            >              <CodeBlockCopyButton />            </CodeBlock>          )}        </div>
        <Input          onSubmit=          className="mt-4 w-full max-w-2xl mx-auto relative"        >          <PromptInputTextarea            value=            placeholder="Generate a React todolist component"            onChange=            className="pr-12"          />          <PromptInputSubmit            status=            disabled=            className="absolute bottom-1 right-1"          />        </Input>      </div>    </div>  );}
```


Add the following route to your backend:












``` tsx
import  from 'ai';import  from 'zod';
export const codeBlockSchema = z.object();// Allow streaming responses up to 30 secondsexport const maxDuration = 30;
export async function POST(req: Request) );
  return result.toTextStreamResponse();}
```


## [Features](#features)

- Syntax highlighting with react-syntax-highlighter
- Line numbers (optional)
- Copy to clipboard functionality
- Automatic light/dark theme switching
- Customizable styles
- Accessible design

## [Examples](#examples)

### [Dark Mode](#dark-mode)

To use the `CodeBlock` component in dark mode, you can wrap it in a `div` with the `dark` class.




Code

Preview









``` overflow-hidden
function MyComponent(props) !</h1>
  );
}
```

``` hidden
function MyComponent(props) !</h1>
  );
}
```











## [Props](#props)

### [`<CodeBlock />`](#codeblock-)






### code:


string




The code content to display.





### language:


string




The programming language for syntax highlighting.





### showLineNumbers?:


boolean




Whether to show line numbers. Default: false.





### children?:


React.ReactNode




Child elements (like CodeBlockCopyButton) positioned in the top-right corner.





### className?:


string




Additional CSS classes to apply to the root container.





### \[...props\]?:


React.HTMLAttributes\<HTMLDivElement\>




Any other props are spread to the root div.






### [`<CodeBlockCopyButton />`](#codeblockcopybutton-)






### onCopy?:


() =\> void




Callback fired after a successful copy.





### onError?:


(error: Error) =\> void




Callback fired if copying fails.





### timeout?:


number




How long to show the copied state (ms). Default: 2000.





### children?:


React.ReactNode




Custom content for the button. Defaults to copy/check icons.





### className?:


string




Additional CSS classes to apply to the button.





### \[...props\]?:


React.ComponentProps\<typeof Button\>




Any other props are spread to the underlying shadcn/ui Button component.





















On this page












































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.