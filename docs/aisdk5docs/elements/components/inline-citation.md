AI SDK 5 is available now.










Menu


















































































































































































































































# [Inline Citation](#inline-citation)

The `InlineCitation` component provides a way to display citations inline with text content, similar to academic papers or research documents. It consists of a citation pill that shows detailed source information on hover, making it perfect for AI-generated content that needs to reference sources.




Code

Preview








example.com +5


.





## [Installation](#installation)




ai-elements

shadcn

Manual




``` geist-overflow-scroll-y
npx ai-elements@latest add inline-citation
```
















## [Usage](#usage)



``` tsx
import  from '@/components/ai-elements/inline-citation';
```




``` tsx
```


## [Usage with AI SDK](#usage-with-ai-sdk)

Build citations for AI-generated content using [`experimental_generateObject`](../../docs/reference/ai-sdk-ui/use-object.html).

Add the following component to your frontend:












``` tsx
'use client';
import  from '@ai-sdk/react';import  from '@/components/ai-elements/inline-citation';import  from '@/components/ui/button';import  from '@/app/api/citation/route';
const CitationDemo = () =>  = useObject();
  const handleSubmit = (topic: string) => );  };
  return (    <div className="max-w-4xl mx-auto p-6 space-y-6">      <div className="flex gap-2 mb-6">        <Button          onClick=          disabled=          variant="outline"        >          Generate AI Content        </Button>        <Button          onClick=          disabled=          variant="outline"        >          Generate Climate Content        </Button>      </div>
      
      >                      <InlineCitationCard>                        <InlineCitationCardTrigger sources= />                        <InlineCitationCardBody>                          <InlineCitationCarousel>                            <InlineCitationCarouselHeader>                              <InlineCitationCarouselPrev />                              <InlineCitationCarouselNext />                              <InlineCitationCarouselIndex />                            </InlineCitationCarouselHeader>                            <InlineCitationCarouselContent>                              <InlineCitationCarouselItem>                                <InlineCitationSource                                  title=                                  url=                                  description=                                />                                                                  </InlineCitationQuote>                                )}                              </InlineCitationCarouselItem>                            </InlineCitationCarouselContent>                          </InlineCitationCarousel>                        </InlineCitationCardBody>                      </InlineCitationCard>                    </InlineCitation>                  );                }              }              return part;            })}          </p>        </div>      )}    </div>  );};
export default CitationDemo;
```


Add the following route to your backend:












``` ts
import  from 'ai';import  from 'zod';
export const citationSchema = z.object(),  ),});
// Allow streaming responses up to 30 secondsexport const maxDuration = 30;
export async function POST(req: Request)  = await req.json();
  const result = streamObject( with proper citations.         Include:    - A comprehensive paragraph with inline citations marked as [1], [2], etc.    - 2-3 citations with realistic source information    - Each citation should have a title, URL, and optional description/quote    - Make the content informative and the sources credible        Format citations as numbered references within the text.`,  });
  return result.toTextStreamResponse();}
```


## [Features](#features)

- Hover interaction to reveal detailed citation information
- **Carousel navigation** for multiple citations with prev/next controls
- **Live index tracking** showing current slide position (e.g., "1/5")
- Support for source titles, URLs, and descriptions
- Optional quote blocks for relevant excerpts
- Composable architecture for flexible citation formats
- Accessible design with proper keyboard navigation
- Seamless integration with AI-generated content
- Clean visual design that doesn't disrupt reading flow
- Smart badge display showing source hostname and count

## [Props](#props)

### [`<InlineCitation />`](#inlinecitation-)






### \[...props\]?:


React.ComponentProps\<"span"\>




Any other props are spread to the root span element.






### [`<InlineCitationText />`](#inlinecitationtext-)






### \[...props\]?:


React.ComponentProps\<"span"\>




Any other props are spread to the underlying span element.






### [`<InlineCitationCard />`](#inlinecitationcard-)






### \[...props\]?:


React.ComponentProps\<"span"\>




Any other props are spread to the HoverCard component.






### [`<InlineCitationCardTrigger />`](#inlinecitationcardtrigger-)






### sources:


string\[\]




Array of source URLs. The length determines the number displayed in the badge.





### \[...props\]?:


React.ComponentProps\<"button"\>




Any other props are spread to the underlying button element.






### [`<InlineCitationCardBody />`](#inlinecitationcardbody-)






### \[...props\]?:


React.ComponentProps\<"div"\>




Any other props are spread to the underlying div.






### [`<InlineCitationCarousel />`](#inlinecitationcarousel-)






### \[...props\]?:


React.ComponentProps\<typeof Carousel\>




Any other props are spread to the underlying Carousel component.






### [`<InlineCitationCarouselContent />`](#inlinecitationcarouselcontent-)






### \[...props\]?:


React.ComponentProps\<"div"\>




Any other props are spread to the underlying CarouselContent component.






### [`<InlineCitationCarouselItem />`](#inlinecitationcarouselitem-)






### \[...props\]?:


React.ComponentProps\<"div"\>




Any other props are spread to the underlying div.






### [`<InlineCitationCarouselHeader />`](#inlinecitationcarouselheader-)






### \[...props\]?:


React.ComponentProps\<"div"\>




Any other props are spread to the underlying div.






### [`<InlineCitationCarouselIndex />`](#inlinecitationcarouselindex-)






### \[...props\]?:


React.ComponentProps\<"div"\>




Any other props are spread to the underlying div. Children will override the default index display.






### [`<InlineCitationCarouselPrev />`](#inlinecitationcarouselprev-)






### \[...props\]?:


React.ComponentProps\<typeof CarouselPrevious\>




Any other props are spread to the underlying CarouselPrevious component.






### [`<InlineCitationCarouselNext />`](#inlinecitationcarouselnext-)






### \[...props\]?:


React.ComponentProps\<typeof CarouselNext\>




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


React.ComponentProps\<"div"\>




Any other props are spread to the underlying div.






### [`<InlineCitationQuote />`](#inlinecitationquote-)






### \[...props\]?:


React.ComponentProps\<"blockquote"\>




Any other props are spread to the underlying blockquote element.





















On this page








































































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.