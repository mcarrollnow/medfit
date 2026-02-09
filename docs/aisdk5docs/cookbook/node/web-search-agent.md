AI SDK 5 is available now.










Menu


























































































































































































































































































































































































# [Web Search Agent](#web-search-agent)

There are two approaches you can take to building a web search agent with the AI SDK:

1.  Use a model that has native web-searching capabilities
2.  Create a tool to access the web and return search results.

Both approaches have their advantages and disadvantages. Models with native search capabilities tend to be faster and there is no additional cost to make the search. The disadvantage is that you have less control over what is being searched, and the functionality is limited to models that support it.

instead, by creating a tool, you can achieve more flexibility and greater control over your search queries. It allows you to customize your search strategy, specify search parameters, and you can use it with any LLM that supports tool calling. This approach will incur additional costs for the search API you use, but gives you complete control over the search experience.

## [Using native web-search](#using-native-web-search)

There are several models that offer native web-searching capabilities (Perplexity, OpenAI, Gemini). Let's look at how you could build a Web Search Agent across providers.

### [OpenAI Responses API](#openai-responses-api)

OpenAI's Responses API has a built-in web search tool that can be used to search the web and return search results. This tool is called `web_search_preview` and is accessed via the `openai` provider.



``` ts
import  from '@ai-sdk/openai';import  from 'ai';
const  = await generateText(),  },});
console.log(text);console.log(sources);
```


### [Perplexity](#perplexity)

Perplexity's Sonar models combines real-time web search with natural language processing. Each response is grounded in current web data and includes detailed citations.



``` ts
import  from '@ai-sdk/perplexity';import  from 'ai';
const  = await generateText();
console.log(text);console.log(sources);
```


### [Gemini](#gemini)

With compatible Gemini models, you can enable search grounding to give the model access to the latest information using Google search.



``` ts
import  from '@ai-sdk/google';import  from 'ai';
const  = await generateText(),  },  prompt:    'List the top 5 San Francisco news from the past week.' +    'You must include the date of each article.',});
console.log(text);console.log(sources);
// access the grounding metadata.const metadata = providerMetadata?.google;const groundingMetadata = metadata?.groundingMetadata;const safetyRatings = metadata?.safetyRatings;
```


## [Building a web search tool](#building-a-web-search-tool)

Let's look at how you can build tools that search the web and return results. These tools can be used with any model that supports tool calling, giving you maximum flexibility and control over your search experience. We'll examine several search API options that can be integrated as tools in your agent.

Unlike the native web search examples where searching is built into the model, using web search tools requires multiple steps. The language model will make two generations - the first to call the relevant web search tool (extracting search queries from the context), and the second to process the results and generate a response. This multi-step process is handled automatically when you set `stopWhen: stepCountIs()` to a value greater than 1.




By using `stopWhen`, you can automatically send tool results back to the language model alongside the original question, enabling the model to respond with information relevant to the user's query based on the search results. This creates a seamless experience where the agent can search the web and incorporate those findings into its response.



### [Exa](#exa)




``` ts
import  from 'ai';import  from '@ai-sdk/openai';import  from 'zod';import Exa from 'exa-js';
export const exa = new Exa(process.env.EXA_API_KEY);
export const webSearch = tool(),  execute: async () =>  = await exa.searchAndContents(query, );    return results.map(result => ());  },});
const  = await generateText(,  stopWhen: stepCountIs(5),});
```


### [Firecrawl](#firecrawl)




``` ts
import  from 'ai';import  from '@ai-sdk/openai';import  from 'zod';import FirecrawlApp from '@mendable/firecrawl-js';import 'dotenv/config';
const app = new FirecrawlApp();
export const webSearch = tool(),  execute: async () => ,    });    if (!crawlResponse.success) `);    }    return crawlResponse.data;  },});
const main = async () =>  = await generateText(,    stopWhen: stepCountIs(5),  });  console.log(text);};
main();
```

















On this page






































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.