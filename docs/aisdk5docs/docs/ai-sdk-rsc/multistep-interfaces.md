AI SDK 5 is available now.










Menu










































































































































































































































































































































































































# [Designing Multistep Interfaces](#designing-multistep-interfaces)




AI SDK RSC is currently experimental. We recommend using [AI SDK UI](../ai-sdk-ui/overview.html) for production. For guidance on migrating from RSC to UI, see our [migration guide](migrating-to-ui.html).



Multistep interfaces refer to user interfaces that require multiple independent steps to be executed in order to complete a specific task.

For example, if you wanted to build a Generative UI chatbot capable of booking flights, it could have three steps:

- Search all flights
- Pick flight
- Check availability

To build this kind of application you will leverage two concepts, **tool composition** and **application context**.

**Tool composition** is the process of combining multiple [tools](../ai-sdk-core/tools-and-tool-calling.html) to create a new tool. This is a powerful concept that allows you to break down complex tasks into smaller, more manageable steps. In the example above, *"search all flights"*, *"pick flight"*, and *"check availability"* come together to create a holistic *"book flight"* tool.

**Application context** refers to the state of the application at any given point in time. This includes the user's input, the output of the language model, and any other relevant information. In the example above, the flight selected in *"pick flight"* would be used as context necessary to complete the *"check availability"* task.

## [Overview](#overview)

In order to build a multistep interface with `@ai-sdk/rsc`, you will need a few things:

- A Server Action that calls and returns the result from the `streamUI` function
- Tool(s) (sub-tasks necessary to complete your overall task)
- React component(s) that should be rendered when the tool is called
- A page to render your chatbot

The general flow that you will follow is:

- User sends a message (calls your Server Action with `useActions`, passing the message as an input)
- Message is appended to the AI State and then passed to the model alongside a number of tools
- Model can decide to call a tool, which will render the `<SomeTool />` component
- Within that component, you can add interactivity by using `useActions` to call the model with your Server Action and `useUIState` to append the model's response (`<SomeOtherTool />`) to the UI State
- And so on...

## [Implementation](#implementation)

The turn-by-turn implementation is the simplest form of multistep interfaces. In this implementation, the user and the model take turns during the conversation. For every user input, the model generates a response, and the conversation continues in this turn-by-turn fashion.

In the following example, you specify two tools (`searchFlights` and `lookupFlight`) that the model can use to search for flights and lookup details for a specific flight.












``` tsx
import  from '@ai-sdk/rsc';import  from '@ai-sdk/openai';import  from 'zod';
const searchFlights = async (  source: string,  destination: string,  date: string,) => ,    ,  ];};
const lookupFlight = async (flightNumber: string) => ;};
export async function submitUserMessage(input: string) ) => <div></div>,    tools: ),        generate: async function* ()  to $ on $...`;          const results = await searchFlights(source, destination, date);
          return (            <div>              >                  <div></div>                </div>              ))}            </div>          );        },      },      lookupFlight: ),        generate: async function* () ...`;          const details = await lookupFlight(flightNumber);
          return (            <div>              <div>Flight Number: </div>              <div>Departure Time: </div>              <div>Arrival Time: </div>            </div>          );        },      },    },  });
  return ui.value;}
```


Next, create an AI context that will hold the UI State and AI State.












``` ts
import  from '@ai-sdk/rsc';import  from './actions';
export const AI = createAI<any[], React.ReactNode[]>(,});
```


Next, wrap your application with your newly created context.












``` tsx
import  from 'react';import  from './ai';
export default function RootLayout(: Readonly<>) </body>      </html>    </AI>  );}
```


To call your Server Action, update your root page with the following:












``` tsx
'use client';
import  from 'react';import  from './ai';import  from '@ai-sdk/rsc';
export default function Page()  = useActions();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => </div>,    ]);    const message = await submitUserMessage(input);    setConversation(currentConversation => [...currentConversation, message]);  };
  return (    <div>      <div>        ></div>        ))}      </div>      <div>        <form onSubmit=>          <input            type="text"            value=            onChange=          />          <button>Send Message</button>        </form>      </div>    </div>  );}
```


This page pulls in the current UI State using the `useUIState` hook, which is then mapped over and rendered in the UI. To access the Server Action, you use the `useActions` hook which will return all actions that were passed to the `actions` key of the `createAI` function in your `actions.tsx` file. Finally, you call the `submitUserMessage` function like any other TypeScript function. This function returns a React component (`message`) that is then rendered in the UI by updating the UI State with `setConversation`.

In this example, to call the next tool, the user must respond with plain text. **Given you are streaming a React component, you can add a button to trigger the next step in the conversation**.

To add user interaction, you will have to convert the component into a client component and use the `useAction` hook to trigger the next step in the conversation.












``` tsx
'use client';
import  from '@ai-sdk/rsc';import  from 'react';
interface FlightsProps [];}
export const Flights = (: FlightsProps) =>  = useActions();  const [_, setMessages] = useUIState();
  return (    <div>      >          <div            onClick=`,              );
              setMessages((messages: ReactNode[]) => [...messages, display]);            }}          >                      </div>        </div>      ))}    </div>  );};
```


Now, update your `searchFlights` tool to render the new `<Flights />` component.












``` tsx
...searchFlights: ),  generate: async function* ()  to $ on $...`;    const results = await searchFlights(source, destination, date);    return (<Flights flights= />);  },}...
```


In the above example, the `Flights` component is used to display the search results. When the user clicks on a flight number, the `lookupFlight` tool is called with the flight number as a parameter. The `submitUserMessage` action is then called to trigger the next step in the conversation.

Learn more about tool calling in Next.js App Router by checking out examples [here](../../cookbook/rsc/generate-text.html).
















On this page



















Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.