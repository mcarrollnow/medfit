AI SDK 5 is available now.










Menu


















































































































































































































































# [Prompt Input](#prompt-input)

The `PromptInput` component allows a user to send a message with file attachments to a large language model. It includes a textarea, file upload capabilities, a submit button, and a dropdown for selecting the model.




Code

Preview


























## [Installation](#installation)




ai-elements

shadcn

Manual




``` geist-overflow-scroll-y
npx ai-elements@latest add prompt-input
```
















## [Usage](#usage)



``` tsx
import  from '@/components/ai-elements/prompt-input';
```




``` tsx
import  from 'lucide-react';
```


## [Usage with AI SDK](#usage-with-ai-sdk)

Built a fully functional chat app using `PromptInput`, [`Conversation`](conversation.html) with a model picker:

Add the following component to your frontend:












``` tsx
'use client';
import  from '@/components/ai-elements/prompt-input';import  from 'lucide-react';import  from 'react';import  from '@ai-sdk/react';import  from '@/components/ai-elements/conversation';import  from '@/components/ai-elements/message';import  from '@/components/ai-elements/response';
const models = [  ,  ,];
const InputDemo = () =>  = useChat();
  const handleSubmit = (message: PromptInputMessage) => 
    sendMessage(      ,      ,      },    );    setText('');  };
  return (    <div className="max-w-4xl mx-auto p-6 relative size-full rounded-lg border h-[600px]">      <div className="flex flex-col h-full">        <Conversation>          <ConversationContent>             key=>                <MessageContent>                  -$`}>                                                      </Response>                        );                      default:                        return null;                    }                  })}                </MessageContent>              </Message>            ))}          </ConversationContent>          <ConversationScrollButton />        </Conversation>
        <PromptInput onSubmit= className="mt-4" globalDrop multiple>          <PromptInputBody>            <PromptInputAttachments>               />}            </PromptInputAttachments>            <PromptInputTextarea              onChange=              ref=              value=            />          </PromptInputBody>          <PromptInputFooter>            <PromptInputTools>              <PromptInputActionMenu>                <PromptInputActionMenuTrigger />                <PromptInputActionMenuContent>                  <PromptInputActionAddAttachments />                </PromptInputActionMenuContent>              </PromptInputActionMenu>              <PromptInputSpeechButton                onTranscriptionChange=                textareaRef=              />              <PromptInputButton                onClick=                variant=              >                <GlobeIcon size= />                <span>Search</span>              </PromptInputButton>              <PromptInputModelSelect                onValueChange=}                value=              >                <PromptInputModelSelectTrigger>                  <PromptInputModelSelectValue />                </PromptInputModelSelectTrigger>                <PromptInputModelSelectContent>                   value=>                                          </PromptInputModelSelectItem>                  ))}                </PromptInputModelSelectContent>              </PromptInputModelSelect>            </PromptInputTools>            <PromptInputSubmit disabled= status= />          </PromptInputFooter>        </PromptInput>      </div>    </div>  );};
export default InputDemo;
```


Add the following route to your backend:












``` ts
import  from 'ai';
// Allow streaming responses up to 30 secondsexport const maxDuration = 30;
export async function POST(req: Request) :  = await req.json();
  const result = streamText();
  return result.toUIMessageStreamResponse();}
```


## [Features](#features)

- Auto-resizing textarea that adjusts height based on content
- File attachment support with drag-and-drop
- Image preview for image attachments
- Configurable file constraints (max files, max size, accepted types)
- Automatic submit button icons based on status
- Support for keyboard shortcuts (Enter to submit, Shift+Enter for new line)
- Customizable min/max height for the textarea
- Flexible toolbar with support for custom actions and tools
- Built-in model selection dropdown
- Built-in native speech recognition button (Web Speech API)
- Optional provider for lifted state management
- Form automatically resets on submit
- Responsive design with mobile-friendly controls
- Clean, modern styling with customizable themes
- Form-based submission handling
- Hidden file input sync for native form posts
- Global document drop support (opt-in)

## [Examples](#examples)

### [Cursor style](#cursor-style)




Code

Preview































## [Props](#props)

### [`<PromptInput />`](#promptinput-)






### onSubmit:


(message: PromptInputMessage, event: FormEvent) =\> void




Handler called when the form is submitted with message text and files.





### accept?:


string




File types to accept (e.g., "image/\*"). Leave undefined for any.





### multiple?:


boolean




Whether to allow multiple file selection.





### globalDrop?:


boolean




When true, accepts file drops anywhere on the document.





### syncHiddenInput?:


boolean




Render a hidden input with given name for native form posts.





### maxFiles?:


number




Maximum number of files allowed.





### maxFileSize?:


number




Maximum file size in bytes.





### onError?:


(err: ) =\> void




Handler for file validation errors.





### \[...props\]?:


React.HTMLAttributes\<HTMLFormElement\>




Any other props are spread to the root form element.






### [`<PromptInputTextarea />`](#promptinputtextarea-)






### \[...props\]?:


React.ComponentProps\<typeof Textarea\>




Any other props are spread to the underlying Textarea component.






### [`<PromptInputFooter />`](#promptinputfooter-)






### \[...props\]?:


React.HTMLAttributes\<HTMLDivElement\>




Any other props are spread to the toolbar div.






### [`<PromptInputTools />`](#promptinputtools-)






### \[...props\]?:


React.HTMLAttributes\<HTMLDivElement\>




Any other props are spread to the tools div.






### [`<PromptInputButton />`](#promptinputbutton-)






### \[...props\]?:


React.ComponentProps\<typeof Button\>




Any other props are spread to the underlying shadcn/ui Button component.






### [`<PromptInputSubmit />`](#promptinputsubmit-)






### status?:


ChatStatus




Current chat status to determine button icon (submitted, streaming, error).





### \[...props\]?:


React.ComponentProps\<typeof Button\>




Any other props are spread to the underlying shadcn/ui Button component.






### [`<PromptInputModelSelect />`](#promptinputmodelselect-)






### \[...props\]?:


React.ComponentProps\<typeof Select\>




Any other props are spread to the underlying Select component.






### [`<PromptInputModelSelectTrigger />`](#promptinputmodelselecttrigger-)






### \[...props\]?:


React.ComponentProps\<typeof SelectTrigger\>




Any other props are spread to the underlying SelectTrigger component.






### [`<PromptInputModelSelectContent />`](#promptinputmodelselectcontent-)






### \[...props\]?:


React.ComponentProps\<typeof SelectContent\>




Any other props are spread to the underlying SelectContent component.






### [`<PromptInputModelSelectItem />`](#promptinputmodelselectitem-)






### \[...props\]?:


React.ComponentProps\<typeof SelectItem\>




Any other props are spread to the underlying SelectItem component.






### [`<PromptInputModelSelectValue />`](#promptinputmodelselectvalue-)






### \[...props\]?:


React.ComponentProps\<typeof SelectValue\>




Any other props are spread to the underlying SelectValue component.






### [`<PromptInputBody />`](#promptinputbody-)






### \[...props\]?:


React.HTMLAttributes\<HTMLDivElement\>




Any other props are spread to the body div.






### [`<PromptInputAttachments />`](#promptinputattachments-)






### children:


(attachment: FileUIPart & ) =\> React.ReactNode




Render function for each attachment.





### \[...props\]?:


React.HTMLAttributes\<HTMLDivElement\>




Any other props are spread to the attachments container.






### [`<PromptInputAttachment />`](#promptinputattachment-)






### data:


FileUIPart & 




The attachment data to display.





### \[...props\]?:


React.HTMLAttributes\<HTMLDivElement\>




Any other props are spread to the attachment div.






### [`<PromptInputActionMenu />`](#promptinputactionmenu-)






### \[...props\]?:


React.ComponentProps\<typeof DropdownMenu\>




Any other props are spread to the underlying DropdownMenu component.






### [`<PromptInputActionMenuTrigger />`](#promptinputactionmenutrigger-)






### \[...props\]?:


React.ComponentProps\<typeof Button\>




Any other props are spread to the underlying Button component.






### [`<PromptInputActionMenuContent />`](#promptinputactionmenucontent-)






### \[...props\]?:


React.ComponentProps\<typeof DropdownMenuContent\>




Any other props are spread to the underlying DropdownMenuContent component.






### [`<PromptInputActionMenuItem />`](#promptinputactionmenuitem-)






### \[...props\]?:


React.ComponentProps\<typeof DropdownMenuItem\>




Any other props are spread to the underlying DropdownMenuItem component.






### [`<PromptInputActionAddAttachments />`](#promptinputactionaddattachments-)






### label?:


string




Label for the menu item. Defaults to "Add photos or files".





### \[...props\]?:


React.ComponentProps\<typeof DropdownMenuItem\>




Any other props are spread to the underlying DropdownMenuItem component.






### [`<PromptInputProvider />`](#promptinputprovider-)






### initialInput?:


string




Initial text input value.





### children:


React.ReactNode




Child components that will have access to the provider context.






Optional global provider that lifts PromptInput state outside of PromptInput. When used, it allows you to access and control the input state from anywhere within the provider tree. If not used, PromptInput stays fully self-managed.

### [`<PromptInputSpeechButton />`](#promptinputspeechbutton-)






### textareaRef?:


RefObject\<HTMLTextAreaElement \| null\>




Reference to the textarea element to insert transcribed text.





### onTranscriptionChange?:


(text: string) =\> void




Callback fired when transcription text changes.





### \[...props\]?:


React.ComponentProps\<typeof PromptInputButton\>




Any other props are spread to the underlying PromptInputButton component.






Built-in button component that provides native speech recognition using the Web Speech API. The button will be disabled if speech recognition is not supported in the browser. Displays a microphone icon and pulses while actively listening.

## [Hooks](#hooks)

### [`usePromptInputAttachments`](#usepromptinputattachments)

Access and manage file attachments within a PromptInput context.



``` tsx
const attachments = usePromptInputAttachments();
// Available methods:attachments.files // Array of current attachmentsattachments.add(files) // Add new filesattachments.remove(id) // Remove an attachment by IDattachments.clear() // Clear all attachmentsattachments.openFileDialog() // Open file selection dialog
```


### [`usePromptInputController`](#usepromptinputcontroller)

Access the full PromptInput controller from a PromptInputProvider. Only available when using the provider.



``` tsx
const controller = usePromptInputController();
// Available methods:controller.textInput.value // Current text input valuecontroller.textInput.setInput(value) // Set text input valuecontroller.textInput.clear() // Clear text inputcontroller.attachments // Same as usePromptInputAttachments
```


### [`useProviderAttachments`](#useproviderattachments)

Access attachments context from a PromptInputProvider. Only available when using the provider.



``` tsx
const attachments = useProviderAttachments();
// Same interface as usePromptInputAttachments
```


### [`<PromptInputHeader />`](#promptinputheader-)






### \[...props\]?:


Omit\<React.ComponentProps\<typeof InputGroupAddon\>, "align"\>




Any other props (except align) are spread to the InputGroupAddon component.






### [`<PromptInputHoverCard />`](#promptinputhovercard-)






### openDelay?:


number




Delay in milliseconds before opening. Defaults to 0.





### closeDelay?:


number




Delay in milliseconds before closing. Defaults to 0.





### \[...props\]?:


React.ComponentProps\<typeof HoverCard\>




Any other props are spread to the HoverCard component.






### [`<PromptInputHoverCardTrigger />`](#promptinputhovercardtrigger-)






### \[...props\]?:


React.ComponentProps\<typeof HoverCardTrigger\>




Any other props are spread to the HoverCardTrigger component.






### [`<PromptInputHoverCardContent />`](#promptinputhovercardcontent-)






### align?:


"start" \| "center" \| "end"




Alignment of the hover card content. Defaults to "start".





### \[...props\]?:


React.ComponentProps\<typeof HoverCardContent\>




Any other props are spread to the HoverCardContent component.






### [`<PromptInputTabsList />`](#promptinputtabslist-)






### \[...props\]?:


React.HTMLAttributes\<HTMLDivElement\>




Any other props are spread to the div element.






### [`<PromptInputTab />`](#promptinputtab-)






### \[...props\]?:


React.HTMLAttributes\<HTMLDivElement\>




Any other props are spread to the div element.






### [`<PromptInputTabLabel />`](#promptinputtablabel-)






### \[...props\]?:


React.HTMLAttributes\<HTMLHeadingElement\>




Any other props are spread to the h3 element.






### [`<PromptInputTabBody />`](#promptinputtabbody-)






### \[...props\]?:


React.HTMLAttributes\<HTMLDivElement\>




Any other props are spread to the div element.






### [`<PromptInputTabItem />`](#promptinputtabitem-)






### \[...props\]?:


React.HTMLAttributes\<HTMLDivElement\>




Any other props are spread to the div element.






### [`<PromptInputCommand />`](#promptinputcommand-)






### \[...props\]?:


React.ComponentProps\<typeof Command\>




Any other props are spread to the Command component.






### [`<PromptInputCommandInput />`](#promptinputcommandinput-)






### \[...props\]?:


React.ComponentProps\<typeof CommandInput\>




Any other props are spread to the CommandInput component.






### [`<PromptInputCommandList />`](#promptinputcommandlist-)






### \[...props\]?:


React.ComponentProps\<typeof CommandList\>




Any other props are spread to the CommandList component.






### [`<PromptInputCommandEmpty />`](#promptinputcommandempty-)






### \[...props\]?:


React.ComponentProps\<typeof CommandEmpty\>




Any other props are spread to the CommandEmpty component.






### [`<PromptInputCommandGroup />`](#promptinputcommandgroup-)






### \[...props\]?:


React.ComponentProps\<typeof CommandGroup\>




Any other props are spread to the CommandGroup component.






### [`<PromptInputCommandItem />`](#promptinputcommanditem-)






### \[...props\]?:


React.ComponentProps\<typeof CommandItem\>




Any other props are spread to the CommandItem component.






### [`<PromptInputCommandSeparator />`](#promptinputcommandseparator-)






### \[...props\]?:


React.ComponentProps\<typeof CommandSeparator\>




Any other props are spread to the CommandSeparator component.





















On this page



































































































































































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.