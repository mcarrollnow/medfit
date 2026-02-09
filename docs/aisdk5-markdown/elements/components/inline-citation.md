Chatbot: Inline Citation

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

[Components](../components.html)Inline Citation

# [Inline Citation](#inline-citation)

The `InlineCitation` component provides a way to display citations inline with text content, similar to academic papers or research documents. It consists of a citation pill that shows detailed source information on hover, making it perfect for AI-generated content that needs to reference sources.

CodePreview

According to recent studies, artificial intelligence has shown remarkable progress in natural language processing. The technology continues to evolve rapidly, with new breakthroughs being announced regularly

example.com +5

.

## [Installation](#installation)

ai-elementsshadcnManual

npx ai-elements@latest add inline-citation

## [Usage](#usage)

```tsx
import {
  InlineCitation,
  InlineCitationCard,
  InlineCitationCardBody,
  InlineCitationCardTrigger,
  InlineCitationCarousel,
  InlineCitationCarouselContent,
  InlineCitationCarouselItem,
  InlineCitationCarouselHeader,
  InlineCitationCarouselIndex,
  InlineCitationSource,
  InlineCitationText,
} from '@/components/ai-elements/inline-citation';
```

```tsx
<InlineCitation>
  <InlineCitationText>{citation.text}</InlineCitationText>
  <InlineCitationCard>
    <InlineCitationCardTrigger
      sources={citation.sources.map((source) => source.url)}
    />
    <InlineCitationCardBody>
      <InlineCitationCarousel>
        <InlineCitationCarouselHeader>
          <InlineCitationCarouselIndex />
        </InlineCitationCarouselHeader>
        <InlineCitationCarouselContent>
          <InlineCitationCarouselItem>
            <InlineCitationSource
              title="AI SDK"
              url="https://ai-sdk.dev"
              description="The AI Toolkit for TypeScript"
            />
          </InlineCitationCarouselItem>
        </InlineCitationCarouselContent>
      </InlineCitationCarousel>
    </InlineCitationCardBody>
  </InlineCitationCard>
</InlineCitation>
```

## [Usage with AI SDK](#usage-with-ai-sdk)

Build citations for AI-generated content using [`experimental_generateObject`](../../docs/reference/ai-sdk-ui/use-object.html).

Add the following component to your frontend:

```tsx
'use client';


import { experimental_useObject as useObject } from '@ai-sdk/react';
import {
  InlineCitation,
  InlineCitationText,
  InlineCitationCard,
  InlineCitationCardTrigger,
  InlineCitationCardBody,
  InlineCitationCarousel,
  InlineCitationCarouselContent,
  InlineCitationCarouselItem,
  InlineCitationCarouselHeader,
  InlineCitationCarouselIndex,
  InlineCitationCarouselPrev,
  InlineCitationCarouselNext,
  InlineCitationSource,
  InlineCitationQuote,
} from '@/components/ai-elements/inline-citation';
import { Button } from '@/components/ui/button';
import { citationSchema } from '@/app/api/citation/route';


const CitationDemo = () => {
  const { object, submit, isLoading } = useObject({
    api: '/api/citation',
    schema: citationSchema,
  });


  const handleSubmit = (topic: string) => {
    submit({ prompt: topic });
  };


  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex gap-2 mb-6">
        <Button
          onClick={() => handleSubmit('artificial intelligence')}
          disabled={isLoading}
          variant="outline"
        >
          Generate AI Content
        </Button>
        <Button
          onClick={() => handleSubmit('climate change')}
          disabled={isLoading}
          variant="outline"
        >
          Generate Climate Content
        </Button>
      </div>


      {isLoading && !object && (
        <div className="text-muted-foreground">
          Generating content with citations...
        </div>
      )}


      {object?.content && (
        <div className="prose prose-sm max-w-none">
          <p className="leading-relaxed">
            {object.content.split(/(\[\d+\])/).map((part, index) => {
              const citationMatch = part.match(/\[(\d+)\]/);
              if (citationMatch) {
                const citationNumber = citationMatch[1];
                const citation = object.citations?.find(
                  (c: any) => c.number === citationNumber,
                );


                if (citation) {
                  return (
                    <InlineCitation key={index}>
                      <InlineCitationCard>
                        <InlineCitationCardTrigger sources={[citation.url]} />
                        <InlineCitationCardBody>
                          <InlineCitationCarousel>
                            <InlineCitationCarouselHeader>
                              <InlineCitationCarouselPrev />
                              <InlineCitationCarouselNext />
                              <InlineCitationCarouselIndex />
                            </InlineCitationCarouselHeader>
                            <InlineCitationCarouselContent>
                              <InlineCitationCarouselItem>
                                <InlineCitationSource
                                  title={citation.title}
                                  url={citation.url}
                                  description={citation.description}
                                />
                                {citation.quote && (
                                  <InlineCitationQuote>
                                    {citation.quote}
                                  </InlineCitationQuote>
                                )}
                              </InlineCitationCarouselItem>
                            </InlineCitationCarouselContent>
                          </InlineCitationCarousel>
                        </InlineCitationCardBody>
                      </InlineCitationCard>
                    </InlineCitation>
                  );
                }
              }
              return part;
            })}
          </p>
        </div>
      )}
    </div>
  );
};


export default CitationDemo;
```

Add the following route to your backend:

```ts
import { streamObject } from 'ai';
import { z } from 'zod';


export const citationSchema = z.object({
  content: z.string(),
  citations: z.array(
    z.object({
      number: z.string(),
      title: z.string(),
      url: z.string(),
      description: z.string().optional(),
      quote: z.string().optional(),
    }),
  ),
});


// Allow streaming responses up to 30 seconds
export const maxDuration = 30;


export async function POST(req: Request) {
  const { prompt } = await req.json();


  const result = streamObject({
    model: 'openai/gpt-4o',
    schema: citationSchema,
    prompt: `Generate a well-researched paragraph about ${prompt} with proper citations. 
    
    Include:
    - A comprehensive paragraph with inline citations marked as [1], [2], etc.
    - 2-3 citations with realistic source information
    - Each citation should have a title, URL, and optional description/quote
    - Make the content informative and the sources credible
    
    Format citations as numbered references within the text.`,
  });


  return result.toTextStreamResponse();
}
```

## [Features](#features)

-   Hover interaction to reveal detailed citation information
-   **Carousel navigation** for multiple citations with prev/next controls
-   **Live index tracking** showing current slide position (e.g., "1/5")
-   Support for source titles, URLs, and descriptions
-   Optional quote blocks for relevant excerpts
-   Composable architecture for flexible citation formats
-   Accessible design with proper keyboard navigation
-   Seamless integration with AI-generated content
-   Clean visual design that doesn't disrupt reading flow
-   Smart badge display showing source hostname and count

## [Props](#props)

### [`<InlineCitation />`](#inlinecitation-)

### \[...props\]?:

React.ComponentProps<"span">

Any other props are spread to the root span element.

### [`<InlineCitationText />`](#inlinecitationtext-)

### \[...props\]?:

React.ComponentProps<"span">

Any other props are spread to the underlying span element.

### [`<InlineCitationCard />`](#inlinecitationcard-)

### \[...props\]?:

React.ComponentProps<"span">

Any other props are spread to the HoverCard component.

### [`<InlineCitationCardTrigger />`](#inlinecitationcardtrigger-)

### sources:

string\[\]

Array of source URLs. The length determines the number displayed in the badge.

### \[...props\]?:

React.ComponentProps<"button">

Any other props are spread to the underlying button element.

### [`<InlineCitationCardBody />`](#inlinecitationcardbody-)

### \[...props\]?:

React.ComponentProps<"div">

Any other props are spread to the underlying div.

### [`<InlineCitationCarousel />`](#inlinecitationcarousel-)

### \[...props\]?:

React.ComponentProps<typeof Carousel>

Any other props are spread to the underlying Carousel component.

### [`<InlineCitationCarouselContent />`](#inlinecitationcarouselcontent-)

### \[...props\]?:

React.ComponentProps<"div">

Any other props are spread to the underlying CarouselContent component.

### [`<InlineCitationCarouselItem />`](#inlinecitationcarouselitem-)

### \[...props\]?:

React.ComponentProps<"div">

Any other props are spread to the underlying div.

### [`<InlineCitationCarouselHeader />`](#inlinecitationcarouselheader-)

### \[...props\]?:

React.ComponentProps<"div">

Any other props are spread to the underlying div.

### [`<InlineCitationCarouselIndex />`](#inlinecitationcarouselindex-)

### \[...props\]?:

React.ComponentProps<"div">

Any other props are spread to the underlying div. Children will override the default index display.

### [`<InlineCitationCarouselPrev />`](#inlinecitationcarouselprev-)

### \[...props\]?:

React.ComponentProps<typeof CarouselPrevious>

Any other props are spread to the underlying CarouselPrevious component.

### [`<InlineCitationCarouselNext />`](#inlinecitationcarouselnext-)

### \[...props\]?:

React.ComponentProps<typeof CarouselNext>

Any other props are spread to the underlying CarouselNext component.

### [`<InlineCitationSource />`](#inlinecitationsource-)

### title?:

string

The title of the source.

### url?:

string

The URL of the source.

### description?:

string

A brief description of the source.

### \[...props\]?:

React.ComponentProps<"div">

Any other props are spread to the underlying div.

### [`<InlineCitationQuote />`](#inlinecitationquote-)

### \[...props\]?:

React.ComponentProps<"blockquote">

Any other props are spread to the underlying blockquote element.

[Previous

Image

](image.html)

[Next

Loader

](loader.html)

On this page

[Inline Citation](#inline-citation)

[Installation](#installation)

[Usage](#usage)

[Usage with AI SDK](#usage-with-ai-sdk)

[Features](#features)

[Props](#props)

[<InlineCitation />](#inlinecitation-)

[<InlineCitationText />](#inlinecitationtext-)

[<InlineCitationCard />](#inlinecitationcard-)

[<InlineCitationCardTrigger />](#inlinecitationcardtrigger-)

[<InlineCitationCardBody />](#inlinecitationcardbody-)

[<InlineCitationCarousel />](#inlinecitationcarousel-)

[<InlineCitationCarouselContent />](#inlinecitationcarouselcontent-)

[<InlineCitationCarouselItem />](#inlinecitationcarouselitem-)

[<InlineCitationCarouselHeader />](#inlinecitationcarouselheader-)

[<InlineCitationCarouselIndex />](#inlinecitationcarouselindex-)

[<InlineCitationCarouselPrev />](#inlinecitationcarouselprev-)

[<InlineCitationCarouselNext />](#inlinecitationcarouselnext-)

[<InlineCitationSource />](#inlinecitationsource-)

[<InlineCitationQuote />](#inlinecitationquote-)

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