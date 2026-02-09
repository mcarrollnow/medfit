AI SDK 5 is available now.










Menu


















































































































































































































































# [Message](#message)

The `Message` component displays a chat interface message from either a user or an AI. It includes an avatar, a name, and a message content.




Code

Preview








Hello, how are you?








## [Installation](#installation)




ai-elements

shadcn

Manual




``` geist-overflow-scroll-y
npx ai-elements@latest add message
```
















## [Usage](#usage)



``` tsx
import  from '@/components/ai-elements/message';
```




``` tsx
// Default contained variant<Message from="user">  <MessageContent>Hi there!</MessageContent></Message>
// Flat variant for a minimalist look<Message from="assistant">  <MessageContent variant="flat">Hello! How can I help you today?</MessageContent></Message>
```


## [Usage with AI SDK](#usage-with-ai-sdk)

Render messages in a list with `useChat`.

Add the following component to your frontend:












``` tsx
'use client';
import  from '@/components/ai-elements/message';import  from '@ai-sdk/react';import  from '@/components/ai-elements/response';
const MessageDemo = () =>  = useChat();
  return (    <div className="max-w-4xl mx-auto p-6 relative size-full rounded-lg border h-[600px]">      <div className="flex flex-col h-full">         key=>            <MessageContent>              -$`}>                                              </Response>                    );                  default:                    return null;                }              })}            </MessageContent>          </Message>        ))}      </div>    </div>  );};
export default MessageDemo;
```


## [Features](#features)

- Displays messages from both the user and AI assistant with distinct styling.
- Two visual variants: **contained** (default) and **flat** for different design preferences.
- Includes avatar images for message senders with fallback initials.
- Shows the sender's name through avatar fallbacks.
- Automatically aligns user and assistant messages on opposite sides.
- Uses different background colors for user and assistant messages.
- Accepts any React node as message content.

## [Variants](#variants)

### [Contained (default)](#contained-default)

The **contained** variant provides distinct visual separation with colored backgrounds:

- User messages appear with primary background color and are right-aligned
- Assistant messages have secondary background color and are left-aligned
- Both message types have padding and rounded corners

### [Flat](#flat)

The **flat** variant offers a minimalist design that matches modern AI interfaces like ChatGPT and Gemini:

- User messages use softer secondary colors with subtle borders
- Assistant messages display full-width without background or padding
- Creates a cleaner, more streamlined conversation appearance

## [Notes](#notes)

Always render the `AIMessageContent` first, then the `AIMessageAvatar`. The `AIMessage` component is a wrapper that determines the alignment of the message.

## [Examples](#examples)

### [Render Markdown](#render-markdown)

We can use the [`Response`](response.html) component to render markdown content.




Code

Preview









What is the weather in Tokyo?
















### [Flat Variant](#flat-variant)

The flat variant provides a minimalist design that matches modern AI interfaces.




Code

Preview









Can you explain what the flat variant does?





The flat variant provides a minimalist design for messages. User messages appear with subtle secondary colors and borders, while assistant messages display full-width without background padding. This creates a cleaner, more modern conversation interface similar to ChatGPT and other contemporary AI assistants.





That looks much cleaner! I like how it matches modern AI interfaces.





Exactly! The flat variant is perfect when you want a more streamlined appearance that puts focus on the conversation content rather than visual containers. It works especially well in full-width layouts and professional applications.








## [Props](#props)

### [`<Message />`](#message-)






### from:


UIMessage\["role"\]




The role of the message sender ("user", "assistant", or "system").





### \[...props\]?:


React.HTMLAttributes\<HTMLDivElement\>




Any other props are spread to the root div.






### [`<MessageContent />`](#messagecontent-)






### variant?:


"contained" \| "flat"




Visual style variant. "contained" (default) shows colored backgrounds, "flat" provides a minimalist design.





### \[...props\]?:


React.HTMLAttributes\<HTMLDivElement\>




Any other props are spread to the content div.






### [`<MessageAvatar />`](#messageavatar-)






### src:


string




The URL of the avatar image.





### name?:


string




The name to use for the avatar fallback (first 2 letters shown if image is missing).





### \[...props\]?:


React.ComponentProps\<typeof Avatar\>




Any other props are spread to the underlying Avatar component.





















On this page
































































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.