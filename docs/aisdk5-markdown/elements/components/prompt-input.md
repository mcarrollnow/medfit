Chatbot: Prompt Input

[](https://vercel.com/)

[

AI SDK



](../../index.html)

-   [Docs](../../docs/introduction.html)
-   [Cookbook](../../cookbook.html)
-   [Providers](../../providers/ai-sdk-providers.html)
-   [Playground](../../playground.html)
-   [
    
    AI ElementsAI Elements
    
    ](../overview.html)
-   [AI GatewayGateway](https://vercel.com/ai-gateway)

AI SDK 5 is available now.

[View Announcement](https://vercel.com/blog/ai-sdk-5)

Menu

[Introduction](../overview.html)

[Setup](../overview/setup.html)

[Usage](../overview/usage.html)

[Troubleshooting](../overview/troubleshooting.html)

[Examples](../examples.html)

[Chatbot](../examples/chatbot.html)

[v0 clone](../examples/v0.html)

[Workflow](../examples/workflow.html)

[Components](../components.html)

[Chatbot](chatbot.html)

[Actions](actions.html)

[Branch](branch.html)

[Chain of Thought](chain-of-thought.html)

[Code Block](code-block.html)

[Context](context.html)

[Conversation](conversation.html)

[Image](image.html)

[Inline Citation](inline-citation.html)

[Loader](loader.html)

[Message](message.html)

[Open In Chat](open-in-chat.html)

[Plan](plan.html)

[Prompt Input](prompt-input.html)

[Queue](queue.html)

[Reasoning](reasoning.html)

[Response](response.html)

[Shimmer](shimmer.html)

[Sources](sources.html)

[Suggestion](suggestion.html)

[Task](task.html)

[Tool](tool.html)

[Workflow](workflow.html)

[Canvas](canvas.html)

[Connection](connection.html)

[Controls](controls.html)

[Edge](edge.html)

[Node](node.html)

[Panel](panel.html)

[Toolbar](toolbar.html)

[Vibe Coding](vibe-coding.html)

[Artifact](artifact.html)

[Web Preview](web-preview.html)

[Components](../components.html)Prompt Input

# [Prompt Input](#prompt-input)

The `PromptInput` component allows a user to send a message with file attachments to a large language model. It includes a textarea, file upload capabilities, a submit button, and a dropdown for selecting the model.

CodePreview

Search

## [Installation](#installation)

ai-elementsshadcnManual

npx ai-elements@latest add prompt-input

## [Usage](#usage)

```tsx
import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuItem,
  PromptInputActionMenuTrigger,
  PromptInputAttachment,
  PromptInputAttachments,
  PromptInputBody,
  PromptInputButton,
  PromptInputProvider,
  PromptInputSpeechButton,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputTools,
  usePromptInputAttachments,
} from '@/components/ai-elements/prompt-input';
```

```tsx
import { GlobeIcon } from 'lucide-react';


<PromptInput onSubmit={() => {}} className="mt-4 relative">
  <PromptInputBody>
    <PromptInputAttachments>
      {(attachment) => (
        <PromptInputAttachment data={attachment} />
      )}
    </PromptInputAttachments>
    <PromptInputTextarea onChange={(e) => {}} value={''} />
  </PromptInputBody>
  <PromptInputFooter>
    <PromptInputTools>
      <PromptInputActionMenu>
        <PromptInputActionMenuTrigger />
        <PromptInputActionMenuContent>
          <PromptInputActionAddAttachments />
        </PromptInputActionMenuContent>
      </PromptInputActionMenu>
      <PromptInputSpeechButton />
      <PromptInputButton>
        <GlobeIcon size={16} />
        <span>Search</span>
      </PromptInputButton>
      <PromptInputModelSelect onValueChange={(value) => {}} value="gpt-4o">
        <PromptInputModelSelectTrigger>
          <PromptInputModelSelectValue />
        </PromptInputModelSelectTrigger>
        <PromptInputModelSelectContent>
          <PromptInputModelSelectItem value="gpt-4o">
            GPT-4o
          </PromptInputModelSelectItem>
          <PromptInputModelSelectItem value="claude-opus-4-20250514">
            Claude 4 Opus
          </PromptInputModelSelectItem>
        </PromptInputModelSelectContent>
      </PromptInputModelSelect>
    </PromptInputTools>
    <PromptInputSubmit
      disabled={false}
      status={'ready'}
    />
  </PromptInputFooter>
</PromptInput>
```

## [Usage with AI SDK](#usage-with-ai-sdk)

Built a fully functional chat app using `PromptInput`, [`Conversation`](conversation.html) with a model picker:

Add the following component to your frontend:

```tsx
'use client';


import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputAttachment,
  PromptInputAttachments,
  PromptInputBody,
  PromptInputButton,
  type PromptInputMessage,
  PromptInputModelSelect,
  PromptInputModelSelectContent,
  PromptInputModelSelectItem,
  PromptInputModelSelectTrigger,
  PromptInputModelSelectValue,
  PromptInputSpeechButton,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputTools,
} from '@/components/ai-elements/prompt-input';
import { GlobeIcon } from 'lucide-react';
import { useRef, useState } from 'react';
import { useChat } from '@ai-sdk/react';
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import { Message, MessageContent } from '@/components/ai-elements/message';
import { Response } from '@/components/ai-elements/response';


const models = [
  { id: 'gpt-4o', name: 'GPT-4o' },
  { id: 'claude-opus-4-20250514', name: 'Claude 4 Opus' },
];


const InputDemo = () => {
  const [text, setText] = useState<string>('');
  const [model, setModel] = useState<string>(models[0].id);
  const [useWebSearch, setUseWebSearch] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);


  const { messages, status, sendMessage } = useChat();


  const handleSubmit = (message: PromptInputMessage) => {
    const hasText = Boolean(message.text);
    const hasAttachments = Boolean(message.files?.length);


    if (!(hasText || hasAttachments)) {
      return;
    }


    sendMessage(
      { 
        text: message.text || 'Sent with attachments',
        files: message.files 
      },
      {
        body: {
          model: model,
          webSearch: useWebSearch,
        },
      },
    );
    setText('');
  };


  return (
    <div className="max-w-4xl mx-auto p-6 relative size-full rounded-lg border h-[600px]">
      <div className="flex flex-col h-full">
        <Conversation>
          <ConversationContent>
            {messages.map((message) => (
              <Message from={message.role} key={message.id}>
                <MessageContent>
                  {message.parts.map((part, i) => {
                    switch (part.type) {
                      case 'text':
                        return (
                          <Response key={`${message.id}-${i}`}>
                            {part.text}
                          </Response>
                        );
                      default:
                        return null;
                    }
                  })}
                </MessageContent>
              </Message>
            ))}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>


        <PromptInput onSubmit={handleSubmit} className="mt-4" globalDrop multiple>
          <PromptInputBody>
            <PromptInputAttachments>
              {(attachment) => <PromptInputAttachment data={attachment} />}
            </PromptInputAttachments>
            <PromptInputTextarea
              onChange={(e) => setText(e.target.value)}
              ref={textareaRef}
              value={text}
            />
          </PromptInputBody>
          <PromptInputFooter>
            <PromptInputTools>
              <PromptInputActionMenu>
                <PromptInputActionMenuTrigger />
                <PromptInputActionMenuContent>
                  <PromptInputActionAddAttachments />
                </PromptInputActionMenuContent>
              </PromptInputActionMenu>
              <PromptInputSpeechButton
                onTranscriptionChange={setText}
                textareaRef={textareaRef}
              />
              <PromptInputButton
                onClick={() => setUseWebSearch(!useWebSearch)}
                variant={useWebSearch ? 'default' : 'ghost'}
              >
                <GlobeIcon size={16} />
                <span>Search</span>
              </PromptInputButton>
              <PromptInputModelSelect
                onValueChange={(value) => {
                  setModel(value);
                }}
                value={model}
              >
                <PromptInputModelSelectTrigger>
                  <PromptInputModelSelectValue />
                </PromptInputModelSelectTrigger>
                <PromptInputModelSelectContent>
                  {models.map((model) => (
                    <PromptInputModelSelectItem key={model.id} value={model.id}>
                      {model.name}
                    </PromptInputModelSelectItem>
                  ))}
                </PromptInputModelSelectContent>
              </PromptInputModelSelect>
            </PromptInputTools>
            <PromptInputSubmit disabled={!text && !status} status={status} />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
};


export default InputDemo;
```

Add the following route to your backend:

```ts
import { streamText, UIMessage, convertToModelMessages } from 'ai';


// Allow streaming responses up to 30 seconds
export const maxDuration = 30;


export async function POST(req: Request) {
  const { 
    model, 
    messages, 
    webSearch 
  }: { 
    messages: UIMessage[]; 
    model: string;
    webSearch?: boolean;
  } = await req.json();


  const result = streamText({
    model: webSearch ? 'perplexity/sonar' : model,
    messages: convertToModelMessages(messages),
  });


  return result.toUIMessageStreamResponse();
}
```

## [Features](#features)

-   Auto-resizing textarea that adjusts height based on content
-   File attachment support with drag-and-drop
-   Image preview for image attachments
-   Configurable file constraints (max files, max size, accepted types)
-   Automatic submit button icons based on status
-   Support for keyboard shortcuts (Enter to submit, Shift+Enter for new line)
-   Customizable min/max height for the textarea
-   Flexible toolbar with support for custom actions and tools
-   Built-in model selection dropdown
-   Built-in native speech recognition button (Web Speech API)
-   Optional provider for lifted state management
-   Form automatically resets on submit
-   Responsive design with mobile-friendly controls
-   Clean, modern styling with customizable themes
-   Form-based submission handling
-   Hidden file input sync for native form posts
-   Global document drop support (opt-in)

## [Examples](#examples)

### [Cursor style](#cursor-style)

CodePreview

11 Tab

## [Props](#props)

### [`<PromptInput />`](#promptinput-)

### onSubmit:

(message: PromptInputMessage, event: FormEvent) => void

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

(err: { code: "max\_files" | "max\_file\_size" | "accept", message: string }) => void

Handler for file validation errors.

### \[...props\]?:

React.HTMLAttributes<HTMLFormElement>

Any other props are spread to the root form element.

### [`<PromptInputTextarea />`](#promptinputtextarea-)

### \[...props\]?:

React.ComponentProps<typeof Textarea>

Any other props are spread to the underlying Textarea component.

### [`<PromptInputFooter />`](#promptinputfooter-)

### \[...props\]?:

React.HTMLAttributes<HTMLDivElement>

Any other props are spread to the toolbar div.

### [`<PromptInputTools />`](#promptinputtools-)

### \[...props\]?:

React.HTMLAttributes<HTMLDivElement>

Any other props are spread to the tools div.

### [`<PromptInputButton />`](#promptinputbutton-)

### \[...props\]?:

React.ComponentProps<typeof Button>

Any other props are spread to the underlying shadcn/ui Button component.

### [`<PromptInputSubmit />`](#promptinputsubmit-)

### status?:

ChatStatus

Current chat status to determine button icon (submitted, streaming, error).

### \[...props\]?:

React.ComponentProps<typeof Button>

Any other props are spread to the underlying shadcn/ui Button component.

### [`<PromptInputModelSelect />`](#promptinputmodelselect-)

### \[...props\]?:

React.ComponentProps<typeof Select>

Any other props are spread to the underlying Select component.

### [`<PromptInputModelSelectTrigger />`](#promptinputmodelselecttrigger-)

### \[...props\]?:

React.ComponentProps<typeof SelectTrigger>

Any other props are spread to the underlying SelectTrigger component.

### [`<PromptInputModelSelectContent />`](#promptinputmodelselectcontent-)

### \[...props\]?:

React.ComponentProps<typeof SelectContent>

Any other props are spread to the underlying SelectContent component.

### [`<PromptInputModelSelectItem />`](#promptinputmodelselectitem-)

### \[...props\]?:

React.ComponentProps<typeof SelectItem>

Any other props are spread to the underlying SelectItem component.

### [`<PromptInputModelSelectValue />`](#promptinputmodelselectvalue-)

### \[...props\]?:

React.ComponentProps<typeof SelectValue>

Any other props are spread to the underlying SelectValue component.

### [`<PromptInputBody />`](#promptinputbody-)

### \[...props\]?:

React.HTMLAttributes<HTMLDivElement>

Any other props are spread to the body div.

### [`<PromptInputAttachments />`](#promptinputattachments-)

### children:

(attachment: FileUIPart & { id: string }) => React.ReactNode

Render function for each attachment.

### \[...props\]?:

React.HTMLAttributes<HTMLDivElement>

Any other props are spread to the attachments container.

### [`<PromptInputAttachment />`](#promptinputattachment-)

### data:

FileUIPart & { id: string }

The attachment data to display.

### \[...props\]?:

React.HTMLAttributes<HTMLDivElement>

Any other props are spread to the attachment div.

### [`<PromptInputActionMenu />`](#promptinputactionmenu-)

### \[...props\]?:

React.ComponentProps<typeof DropdownMenu>

Any other props are spread to the underlying DropdownMenu component.

### [`<PromptInputActionMenuTrigger />`](#promptinputactionmenutrigger-)

### \[...props\]?:

React.ComponentProps<typeof Button>

Any other props are spread to the underlying Button component.

### [`<PromptInputActionMenuContent />`](#promptinputactionmenucontent-)

### \[...props\]?:

React.ComponentProps<typeof DropdownMenuContent>

Any other props are spread to the underlying DropdownMenuContent component.

### [`<PromptInputActionMenuItem />`](#promptinputactionmenuitem-)

### \[...props\]?:

React.ComponentProps<typeof DropdownMenuItem>

Any other props are spread to the underlying DropdownMenuItem component.

### [`<PromptInputActionAddAttachments />`](#promptinputactionaddattachments-)

### label?:

string

Label for the menu item. Defaults to "Add photos or files".

### \[...props\]?:

React.ComponentProps<typeof DropdownMenuItem>

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

RefObject<HTMLTextAreaElement | null>

Reference to the textarea element to insert transcribed text.

### onTranscriptionChange?:

(text: string) => void

Callback fired when transcription text changes.

### \[...props\]?:

React.ComponentProps<typeof PromptInputButton>

Any other props are spread to the underlying PromptInputButton component.

Built-in button component that provides native speech recognition using the Web Speech API. The button will be disabled if speech recognition is not supported in the browser. Displays a microphone icon and pulses while actively listening.

## [Hooks](#hooks)

### [`usePromptInputAttachments`](#usepromptinputattachments)

Access and manage file attachments within a PromptInput context.

```tsx
const attachments = usePromptInputAttachments();


// Available methods:
attachments.files // Array of current attachments
attachments.add(files) // Add new files
attachments.remove(id) // Remove an attachment by ID
attachments.clear() // Clear all attachments
attachments.openFileDialog() // Open file selection dialog
```

### [`usePromptInputController`](#usepromptinputcontroller)

Access the full PromptInput controller from a PromptInputProvider. Only available when using the provider.

```tsx
const controller = usePromptInputController();


// Available methods:
controller.textInput.value // Current text input value
controller.textInput.setInput(value) // Set text input value
controller.textInput.clear() // Clear text input
controller.attachments // Same as usePromptInputAttachments
```

### [`useProviderAttachments`](#useproviderattachments)

Access attachments context from a PromptInputProvider. Only available when using the provider.

```tsx
const attachments = useProviderAttachments();


// Same interface as usePromptInputAttachments
```

### [`<PromptInputHeader />`](#promptinputheader-)

### \[...props\]?:

Omit<React.ComponentProps<typeof InputGroupAddon>, "align">

Any other props (except align) are spread to the InputGroupAddon component.

### [`<PromptInputHoverCard />`](#promptinputhovercard-)

### openDelay?:

number

Delay in milliseconds before opening. Defaults to 0.

### closeDelay?:

number

Delay in milliseconds before closing. Defaults to 0.

### \[...props\]?:

React.ComponentProps<typeof HoverCard>

Any other props are spread to the HoverCard component.

### [`<PromptInputHoverCardTrigger />`](#promptinputhovercardtrigger-)

### \[...props\]?:

React.ComponentProps<typeof HoverCardTrigger>

Any other props are spread to the HoverCardTrigger component.

### [`<PromptInputHoverCardContent />`](#promptinputhovercardcontent-)

### align?:

"start" | "center" | "end"

Alignment of the hover card content. Defaults to "start".

### \[...props\]?:

React.ComponentProps<typeof HoverCardContent>

Any other props are spread to the HoverCardContent component.

### [`<PromptInputTabsList />`](#promptinputtabslist-)

### \[...props\]?:

React.HTMLAttributes<HTMLDivElement>

Any other props are spread to the div element.

### [`<PromptInputTab />`](#promptinputtab-)

### \[...props\]?:

React.HTMLAttributes<HTMLDivElement>

Any other props are spread to the div element.

### [`<PromptInputTabLabel />`](#promptinputtablabel-)

### \[...props\]?:

React.HTMLAttributes<HTMLHeadingElement>

Any other props are spread to the h3 element.

### [`<PromptInputTabBody />`](#promptinputtabbody-)

### \[...props\]?:

React.HTMLAttributes<HTMLDivElement>

Any other props are spread to the div element.

### [`<PromptInputTabItem />`](#promptinputtabitem-)

### \[...props\]?:

React.HTMLAttributes<HTMLDivElement>

Any other props are spread to the div element.

### [`<PromptInputCommand />`](#promptinputcommand-)

### \[...props\]?:

React.ComponentProps<typeof Command>

Any other props are spread to the Command component.

### [`<PromptInputCommandInput />`](#promptinputcommandinput-)

### \[...props\]?:

React.ComponentProps<typeof CommandInput>

Any other props are spread to the CommandInput component.

### [`<PromptInputCommandList />`](#promptinputcommandlist-)

### \[...props\]?:

React.ComponentProps<typeof CommandList>

Any other props are spread to the CommandList component.

### [`<PromptInputCommandEmpty />`](#promptinputcommandempty-)

### \[...props\]?:

React.ComponentProps<typeof CommandEmpty>

Any other props are spread to the CommandEmpty component.

### [`<PromptInputCommandGroup />`](#promptinputcommandgroup-)

### \[...props\]?:

React.ComponentProps<typeof CommandGroup>

Any other props are spread to the CommandGroup component.

### [`<PromptInputCommandItem />`](#promptinputcommanditem-)

### \[...props\]?:

React.ComponentProps<typeof CommandItem>

Any other props are spread to the CommandItem component.

### [`<PromptInputCommandSeparator />`](#promptinputcommandseparator-)

### \[...props\]?:

React.ComponentProps<typeof CommandSeparator>

Any other props are spread to the CommandSeparator component.

[Previous

Plan

](plan.html)

[Next

Queue

](queue.html)

On this page

[Prompt Input](#prompt-input)

[Installation](#installation)

[Usage](#usage)

[Usage with AI SDK](#usage-with-ai-sdk)

[Features](#features)

[Examples](#examples)

[Cursor style](#cursor-style)

[Props](#props)

[<PromptInput />](#promptinput-)

[<PromptInputTextarea />](#promptinputtextarea-)

[<PromptInputFooter />](#promptinputfooter-)

[<PromptInputTools />](#promptinputtools-)

[<PromptInputButton />](#promptinputbutton-)

[<PromptInputSubmit />](#promptinputsubmit-)

[<PromptInputModelSelect />](#promptinputmodelselect-)

[<PromptInputModelSelectTrigger />](#promptinputmodelselecttrigger-)

[<PromptInputModelSelectContent />](#promptinputmodelselectcontent-)

[<PromptInputModelSelectItem />](#promptinputmodelselectitem-)

[<PromptInputModelSelectValue />](#promptinputmodelselectvalue-)

[<PromptInputBody />](#promptinputbody-)

[<PromptInputAttachments />](#promptinputattachments-)

[<PromptInputAttachment />](#promptinputattachment-)

[<PromptInputActionMenu />](#promptinputactionmenu-)

[<PromptInputActionMenuTrigger />](#promptinputactionmenutrigger-)

[<PromptInputActionMenuContent />](#promptinputactionmenucontent-)

[<PromptInputActionMenuItem />](#promptinputactionmenuitem-)

[<PromptInputActionAddAttachments />](#promptinputactionaddattachments-)

[<PromptInputProvider />](#promptinputprovider-)

[<PromptInputSpeechButton />](#promptinputspeechbutton-)

[Hooks](#hooks)

[usePromptInputAttachments](#usepromptinputattachments)

[usePromptInputController](#usepromptinputcontroller)

[useProviderAttachments](#useproviderattachments)

[<PromptInputHeader />](#promptinputheader-)

[<PromptInputHoverCard />](#promptinputhovercard-)

[<PromptInputHoverCardTrigger />](#promptinputhovercardtrigger-)

[<PromptInputHoverCardContent />](#promptinputhovercardcontent-)

[<PromptInputTabsList />](#promptinputtabslist-)

[<PromptInputTab />](#promptinputtab-)

[<PromptInputTabLabel />](#promptinputtablabel-)

[<PromptInputTabBody />](#promptinputtabbody-)

[<PromptInputTabItem />](#promptinputtabitem-)

[<PromptInputCommand />](#promptinputcommand-)

[<PromptInputCommandInput />](#promptinputcommandinput-)

[<PromptInputCommandList />](#promptinputcommandlist-)

[<PromptInputCommandEmpty />](#promptinputcommandempty-)

[<PromptInputCommandGroup />](#promptinputcommandgroup-)

[<PromptInputCommandItem />](#promptinputcommanditem-)

[<PromptInputCommandSeparator />](#promptinputcommandseparator-)

Deploy and Scale AI Apps with Vercel.

Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:

-   OpenAI
-   Photoroom
-   ![leonardo-ai Logo](../../_next/logo-leonardo-ai-light.svg)![leonardo-ai Logo](../../_next/logo-leonardo-ai-dark.svg)
-   ![zapier Logo](../../_next/logo-zapier-light.svg)![zapier Logo](../../_next/logo-zapier-dark.svg)

[](https://vercel.com/contact/sales?utm_source=ai_sdk&utm_medium=web&utm_campaign=contact_sales_cta&utm_content=talk_to_an_expert_sdk_docs)

#### Resources

[Docs](../../docs/introduction.html)[Cookbook](../../cookbook.html)[Providers](../../providers/ai-sdk-providers.html)[Showcase](../../showcase.html)[GitHub](https://github.com/vercel/ai)[Discussions](https://github.com/vercel/ai/discussions)

#### More

[Playground](../../playground.html)[](https://v0.dev)[Contact Sales](https://vercel.com/contact/sales)

#### About Vercel

[Next.js + Vercel](https://vercel.com/frameworks/nextjs)[Open Source Software](https://vercel.com/oss)[GitHub](https://github.com/vercel)[X](https://x.com/vercel)

#### Legal

[Privacy Policy](https://vercel.com/legal/privacy-policy)

© 2025 Vercel, Inc.