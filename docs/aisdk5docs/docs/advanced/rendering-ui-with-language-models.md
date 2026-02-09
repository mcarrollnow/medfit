AI SDK 5 is available now.










Menu















































































































































































































































































































































































































# [Rendering User Interfaces with Language Models](#rendering-user-interfaces-with-language-models)

Language models generate text, so at first it may seem like you would only need to render text in your application.












``` tsx
const text = generateText(),      execute: async () => );        return `It is currently $°$ and $ in $!`;      },    },  },});
```


Above, the language model is passed a [tool](../ai-sdk-core/tools-and-tool-calling.html) called `getWeather` that returns the weather information as text. However, instead of returning text, if you return a JSON object that represents the weather information, you can use it to render a React component instead.












``` tsx
const text = generateText(),      execute: async () => );        const  = weather;
        return ;      },    },  },});
```


Now you can use the object returned by the `getWeather` function to conditionally render a React component `<WeatherCard/>` that displays the weather information by passing the object as props.












``` tsx
return (  <div>     = message        const  = content;
        return (          <WeatherCard            weather=}          />        )      }    })}  </div>)
```


Here's a little preview of what that might look like.







What is the weather in SF?





getWeather("San Francisco")








Thursday, March 7




47°








sunny







7am





48°





8am





50°





9am





52°





10am





54°





11am





56°





12pm





58°





1pm





60°








Thanks!







Weather


An example of an assistant that renders the weather information in a streamed component.




Rendering interfaces as part of language model generations elevates the user experience of your application, allowing people to interact with language models beyond text.

They also make it easier for you to interpret [sequential tool calls](../ai-sdk-rsc/multistep-interfaces.html) that take place in multiple steps and help identify and debug where the model reasoned incorrectly.

## [Rendering Multiple User Interfaces](#rendering-multiple-user-interfaces)

To recap, an application has to go through the following steps to render user interfaces as part of model generations:

1.  The user prompts the language model.
2.  The language model generates a response that includes a tool call.
3.  The tool call returns a JSON object that represents the user interface.
4.  The response is sent to the client.
5.  The client receives the response and checks if the latest message was a tool call.
6.  If it was a tool call, the client renders the user interface based on the JSON object returned by the tool call.

Most applications have multiple tools that are called by the language model, and each tool can return a different user interface.

For example, a tool that searches for courses can return a list of courses, while a tool that searches for people can return a list of people. As this list grows, the complexity of your application will grow as well and it can become increasingly difficult to manage these user interfaces.












``` tsx
 />    ) : message.name === 'api-search-profile' ? (      <People people= />    ) : message.name === 'api-meetings' ? (      <Meetings meetings= />    ) : message.name === 'api-search-building' ? (      <Buildings buildings= />    ) : message.name === 'api-events' ? (      <Events events= />    ) : message.name === 'api-meals' ? (      <Meals meals= />    ) : null  ) : (    <div></div>  );}
```


## [Rendering User Interfaces on the Server](#rendering-user-interfaces-on-the-server)

The **AI SDK RSC (`@ai-sdk/rsc`)** takes advantage of RSCs to solve the problem of managing all your React components on the client side, allowing you to render React components on the server and stream them to the client.

Rather than conditionally rendering user interfaces on the client based on the data returned by the language model, you can directly stream them from the server during a model generation.












``` tsx
import  from '@ai-sdk/rsc'
const uiStream = createStreamableUI();
const text = generateText(),      execute: async () => )        const  = weather
        uiStream.done(          <WeatherCard            weather=}          />        )      }    }  }})
return 
```


The [`createStreamableUI`](../reference/ai-sdk-rsc/create-streamable-ui.html) function belongs to the `@ai-sdk/rsc` module and creates a stream that can send React components to the client.

On the server, you render the `<WeatherCard/>` component with the props passed to it, and then stream it to the client. On the client side, you only need to render the UI that is streamed from the server.












``` tsx
return (  <div>    </div>    ))}  </div>);
```


Now the steps involved are simplified:

1.  The user prompts the language model.
2.  The language model generates a response that includes a tool call.
3.  The tool call renders a React component along with relevant props that represent the user interface.
4.  The response is streamed to the client and rendered directly.

> **Note:** You can also render text on the server and stream it to the client using React Server Components. This way, all operations from language model generation to UI rendering can be done on the server, while the client only needs to render the UI that is streamed from the server.

Check out this [example](../../cookbook/rsc/stream-updates-to-visual-interfaces.html) for a full illustration of how to stream component updates with React Server Components in Next.js App Router.
















On this page



















Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.