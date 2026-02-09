AI SDK 5 is available now.










Menu


















































































































































































































































# [Suggestion](#suggestion)

The `Suggestion` component displays a horizontal row of clickable suggestions for user interaction.




Code

Preview










What are the latest trends in AI?

How does machine learning work?

Explain quantum computing

Best practices for React development

Tell me about TypeScript benefits

How to optimize database queries?

What is the difference between SQL and NoSQL?

Explain cloud computing basics









## [Installation](#installation)




ai-elements

shadcn

Manual




``` geist-overflow-scroll-y
npx ai-elements@latest add suggestion
```
















## [Usage](#usage)



``` tsx
import  from '@/components/ai-elements/suggestion';
```




``` tsx
```


## [Usage with AI SDK](#usage-with-ai-sdk)

Build a simple input with suggestions users can click to send a message to the LLM.

Add the following component to your frontend:












``` tsx
'use client';
import  from '@/components/ai-elements/prompt-input';import  from '@/components/ai-elements/suggestion';import  from 'react';import  from '@ai-sdk/react';
const suggestions = [  'Can you explain how to play tennis?',  'What is the weather in Tokyo?',  'How do I make a really good fish taco?',];
const SuggestionDemo = () =>  = useChat();
  const handleSubmit = (e: React.FormEvent) => );      setInput('');    }  };
  const handleSuggestionClick = (suggestion: string) => );  };
  return (    <div className="max-w-4xl mx-auto p-6 relative size-full rounded-lg border h-[600px]">      <div className="flex flex-col h-full">        <div className="flex flex-col gap-4">          <Suggestions>                            onClick=                suggestion=              />            ))}          </Suggestions>          <Input            onSubmit=            className="mt-4 w-full max-w-2xl mx-auto relative"          >            <PromptInputTextarea              value=              placeholder="Say something..."              onChange=              className="pr-12"            />            <PromptInputSubmit              status=              disabled=              className="absolute bottom-1 right-1"            />          </Input>        </div>      </div>    </div>  );};
export default SuggestionDemo;
```


## [Features](#features)

- Horizontal row of clickable suggestion buttons
- Customizable styling with variant and size options
- Flexible layout that wraps suggestions on smaller screens
- onClick callback that emits the selected suggestion string
- Support for both individual suggestions and suggestion lists
- Clean, modern styling with hover effects
- Responsive design with mobile-friendly touch targets
- TypeScript support with proper type definitions

## [Examples](#examples)

### [Usage with AI Input](#usage-with-ai-input)




Code

Preview











What are the latest trends in AI?

How does machine learning work?

Explain quantum computing

Best practices for React development

Tell me about TypeScript benefits

How to optimize database queries?

What is the difference between SQL and NoSQL?

Explain cloud computing basics






















## [Props](#props)

### [`<Suggestions />`](#suggestions-)






### \[...props\]?:


React.ComponentProps\<typeof ScrollArea\>




Any other props are spread to the underlying ScrollArea component.






### [`<Suggestion />`](#suggestion-)






### suggestion:


string




The suggestion string to display and emit on click.





### onClick?:


(suggestion: string) =\> void




Callback fired when the suggestion is clicked.





### \[...props\]?:


Omit\<React.ComponentProps\<typeof Button\>, "onClick"\>




Any other props are spread to the underlying shadcn/ui Button component.





















On this page












































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.