Vibe Coding: Web Preview

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

[Components](../components.html)Web Preview

# [WebPreview](#webpreview)

The `WebPreview` component provides a flexible way to showcase the result of a generated UI component, along with its source code. It is designed for documentation and demo purposes, allowing users to interact with live examples and view the underlying implementation.

CodePreview

Console

## [Installation](#installation)

ai-elementsshadcnManual

npx ai-elements@latest add web-preview

## [Usage](#usage)

```tsx
import {
  WebPreview,
  WebPreviewNavigation,
  WebPreviewUrl,
  WebPreviewBody,
} from '@/components/ai-elements/web-preview';
```

```tsx
<WebPreview defaultUrl="https://ai-sdk.dev" style={{ height: '400px' }}>
  <WebPreviewNavigation>
    <WebPreviewUrl src="https://ai-sdk.dev" />
  </WebPreviewNavigation>
  <WebPreviewBody src="https://ai-sdk.dev" />
</WebPreview>
```

## [Usage with AI SDK](#usage-with-ai-sdk)

Build a simple v0 clone using the [v0 Platform API](https://v0.dev/docs/api/platform).

Install the `v0-sdk` package:

pnpm

npm

yarn

pnpm add v0-sdk

Add the following component to your frontend:

```tsx
'use client';


import {
  WebPreview,
  WebPreviewBody,
  WebPreviewNavigation,
  WebPreviewUrl,
} from '@/components/ai-elements/web-preview';
import { useState } from 'react';
import {
  Input,
  PromptInputTextarea,
  PromptInputSubmit,
} from '@/components/ai-elements/prompt-input';
import { Loader } from '../ai-elements/loader';


const WebPreviewDemo = () => {
  const [previewUrl, setPreviewUrl] = useState('');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setPrompt('');


    setIsGenerating(true);
    try {
      const response = await fetch('/api/v0', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });


      const data = await response.json();
      setPreviewUrl(data.demo || '/');
      console.log('Generation finished:', data);
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };


  return (
    <div className="max-w-4xl mx-auto p-6 relative size-full rounded-lg border h-[600px]">
      <div className="flex flex-col h-full">
        <div className="flex-1 mb-4">
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center h-full">
              <Loader />
              <p className="mt-4 text-muted-foreground">
                Generating app, this may take a few seconds...
              </p>
            </div>
          ) : previewUrl ? (
            <WebPreview defaultUrl={previewUrl}>
              <WebPreviewNavigation>
                <WebPreviewUrl />
              </WebPreviewNavigation>
              <WebPreviewBody src={previewUrl} />
            </WebPreview>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Your generated app will appear here
            </div>
          )}
        </div>


        <Input
          onSubmit={handleSubmit}
          className="w-full max-w-2xl mx-auto relative"
        >
          <PromptInputTextarea
            value={prompt}
            placeholder="Describe the app you want to build..."
            onChange={(e) => setPrompt(e.currentTarget.value)}
            className="pr-12 min-h-[60px]"
          />
          <PromptInputSubmit
            status={isGenerating ? 'streaming' : 'ready'}
            disabled={!prompt.trim()}
            className="absolute bottom-1 right-1"
          />
        </Input>
      </div>
    </div>
  );
};


export default WebPreviewDemo;
```

Add the following route to your backend:

```ts
import { v0 } from 'v0-sdk';


export async function POST(req: Request) {
  const { prompt }: { prompt: string } = await req.json();


  const result = await v0.chats.create({
    system: 'You are an expert coder',
    message: prompt,
    modelConfiguration: {
      modelId: 'v0-1.5-sm',
      imageGenerations: false,
      thinking: false,
    },
  });


  return Response.json({
    demo: result.demo,
    webUrl: result.webUrl,
  });
}
```

## [Features](#features)

-   Live preview of UI components
-   Composable architecture with dedicated sub-components
-   Responsive design modes (Desktop, Tablet, Mobile)
-   Navigation controls with back/forward functionality
-   URL input and example selector
-   Full screen mode support
-   Console logging with timestamps
-   Context-based state management
-   Consistent styling with the design system
-   Easy integration into documentation pages

## [Props](#props)

### [`<WebPreview />`](#webpreview-)

### defaultUrl?:

string

The initial URL to load in the preview (default: empty string).

### onUrlChange?:

(url: string) => void

Callback fired when the URL changes.

### \[...props\]?:

React.HTMLAttributes<HTMLDivElement>

Any other props are spread to the root div.

### [`<WebPreviewNavigation />`](#webpreviewnavigation-)

### \[...props\]?:

React.HTMLAttributes<HTMLDivElement>

Any other props are spread to the navigation container.

### [`<WebPreviewNavigationButton />`](#webpreviewnavigationbutton-)

### tooltip?:

string

Tooltip text to display on hover.

### \[...props\]?:

React.ComponentProps<typeof Button>

Any other props are spread to the underlying shadcn/ui Button component.

### [`<WebPreviewUrl />`](#webpreviewurl-)

### \[...props\]?:

React.ComponentProps<typeof Input>

Any other props are spread to the underlying shadcn/ui Input component.

### [`<WebPreviewBody />`](#webpreviewbody-)

### loading?:

React.ReactNode

Optional loading indicator to display over the preview.

### \[...props\]?:

React.IframeHTMLAttributes<HTMLIFrameElement>

Any other props are spread to the underlying iframe.

### [`<WebPreviewConsole />`](#webpreviewconsole-)

### logs?:

Array<{ level: "log" | "warn" | "error"; message: string; timestamp: Date }>

Console log entries to display in the console panel.

### \[...props\]?:

React.HTMLAttributes<HTMLDivElement>

Any other props are spread to the root div.

[Previous

Artifact

](artifact.html)

On this page

[WebPreview](#webpreview)

[Installation](#installation)

[Usage](#usage)

[Usage with AI SDK](#usage-with-ai-sdk)

[Features](#features)

[Props](#props)

[<WebPreview />](#webpreview-)

[<WebPreviewNavigation />](#webpreviewnavigation-)

[<WebPreviewNavigationButton />](#webpreviewnavigationbutton-)

[<WebPreviewUrl />](#webpreviewurl-)

[<WebPreviewBody />](#webpreviewbody-)

[<WebPreviewConsole />](#webpreviewconsole-)

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