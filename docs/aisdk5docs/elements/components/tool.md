AI SDK 5 is available now.










Menu


















































































































































































































































# [Tool](#tool)

The `Tool` component displays a collapsible interface for showing/hiding tool details. It is designed to take the `ToolUIPart` type from the AI SDK and display it in a collapsible interface.




Code

Preview























## [Installation](#installation)




ai-elements

shadcn

Manual




``` geist-overflow-scroll-y
npx ai-elements@latest add tool
```
















## [Usage](#usage)



``` tsx
import  from '@/components/ai-elements/tool';
```




``` tsx
```


## [Usage in AI SDK](#usage-in-ai-sdk)

Build a simple stateful weather app that renders the last message in a tool using [`useChat`](../../docs/reference/ai-sdk-ui/use-chat.html).

Add the following component to your frontend:












``` tsx
'use client';
import  from '@ai-sdk/react';import  from 'ai';import  from '@/components/ui/button';import  from '@/components/ai-elements/response';import  from '@/components/ai-elements/tool';
type WeatherToolInput = ;
type WeatherToolOutput = ;
type WeatherToolUIPart = ToolUIPart<;}>;
const Example = () =>  = useChat(),  });
  const handleWeatherClick = () => );  };
  const latestMessage = messages[messages.length - 1];  const weatherTool = latestMessage?.parts?.find(    (part) => part.type === 'tool-fetch_weather_data',  ) as WeatherToolUIPart | undefined;
  return (    <div className="max-w-4xl mx-auto p-6 relative size-full rounded-lg border h-[600px]">      <div className="flex flex-col h-full">        <div className="space-y-4">          <Button onClick= disabled=>            Get Weather for San Francisco          </Button>
          >              <ToolHeader type="tool-fetch_weather_data" state= />              <ToolContent>                <ToolInput input= />                <ToolOutput                  output=                    </Response>                  }                  errorText=                />              </ToolContent>            </Tool>          )}        </div>      </div>    </div>  );};
function formatWeatherResult(result: WeatherToolOutput): string **
**Temperature:** $  **Conditions:** $  **Humidity:** $  **Wind Speed:** $  
*Last updated: $*`;}
export default Example;
```


Add the following route to your backend:












``` ts
import  from 'ai';import  from 'zod';
// Allow streaming responses up to 30 secondsexport const maxDuration = 30;
export async function POST(req: Request) :  = await req.json();
  const result = streamText(),        inputSchema: z.object(),        execute: async () => °$`,            conditions: 'Sunny',            humidity: `12%`,            windSpeed: `35 $`,            lastUpdated: new Date().toLocaleString(),          };        },      },    },  });
  return result.toUIMessageStreamResponse();}
```


## [Features](#features)

- Collapsible interface for showing/hiding tool details
- Visual status indicators with icons and badges
- Support for multiple tool execution states (pending, running, completed, error)
- Formatted parameter display with JSON syntax highlighting
- Result and error handling with appropriate styling
- Composable structure for flexible layouts
- Accessible keyboard navigation and screen reader support
- Consistent styling that matches your design system
- Auto-opens completed tools by default for better UX

## [Examples](#examples)

### [Input Streaming (Pending)](#input-streaming-pending)

Shows a tool in its initial state while parameters are being processed.




Code

Preview























### [Input Available (Running)](#input-available-running)

Shows a tool that's actively executing with its parameters.




Code

Preview























### [Output Available (Completed)](#output-available-completed)

Shows a completed tool with successful results. Opens by default to show the results. In this instance, the output is a JSON object, so we can use the `CodeBlock` component to display it.




Code

Preview























### [Output Error](#output-error)

Shows a tool that encountered an error during execution. Opens by default to display the error.




Code

Preview























## [Props](#props)

### [`<Tool />`](#tool-)






### \[...props\]?:


React.ComponentProps\<typeof Collapsible\>




Any other props are spread to the root Collapsible component.






### [`<ToolHeader />`](#toolheader-)






### type:


ToolUIPart\["type"\]




The type/name of the tool.





### state:


ToolUIPart\["state"\]




The current state of the tool (input-streaming, input-available, output-available, or output-error).





### className?:


string




Additional CSS classes to apply to the header.





### \[...props\]?:


React.ComponentProps\<typeof CollapsibleTrigger\>




Any other props are spread to the CollapsibleTrigger.






### [`<ToolContent />`](#toolcontent-)






### \[...props\]?:


React.ComponentProps\<typeof CollapsibleContent\>




Any other props are spread to the CollapsibleContent.






### [`<ToolInput />`](#toolinput-)






### input:


ToolUIPart\["input"\]




The input parameters passed to the tool, displayed as formatted JSON.





### \[...props\]?:


React.ComponentProps\<"div"\>




Any other props are spread to the underlying div.






### [`<ToolOutput />`](#tooloutput-)






### output:


React.ReactNode




The output/result of the tool execution.





### errorText:


ToolUIPart\["errorText"\]




An error message if the tool execution failed.





### \[...props\]?:


React.ComponentProps\<"div"\>




Any other props are spread to the underlying div.





















On this page






























































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.