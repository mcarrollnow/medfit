AI SDK 5 is available now.










Menu



























































































































































































































































































































































































Upstash Search offers input enrichment, reranking, semantic search, and full-text search for highly accurate results. It also provides a built-in embedding service, eliminating the need for a separate embedding provider. This makes it convenient for building and managing simple knowledge bases.



## [Getting Started](#getting-started)




``` bash
UPSTASH_SEARCH_REST_URL="***"UPSTASH_SEARCH_REST_TOKEN="***"
```


## [Project Setup](#project-setup)

Create a new empty directory for your project and initialize pnpm:



``` bash
mkdir knowledge-base-agentcd knowledge-base-agentpnpm init
```


Install the AI SDK, OpenAI provider, Upstash Search packages, and tsx as a dev dependency:



``` bash
pnpm i ai zod @ai-sdk/openai @upstash/searchpnpm i -D tsx
```


Finally, download and save the input essay:



``` bash
curl -o essay.txt https://raw.githubusercontent.com/run-llama/llama_index/main/docs/docs/examples/data/paul_graham/paul_graham_essay.txt
```


## [Setting Up the Knowledge Base](#setting-up-the-knowledge-base)

Next, let's set up the initial knowledge base by reading a file and uploading its content to Upstash Search. Create a script called `setup.ts`:












``` ts
import fs from 'fs';import path from 'path';import 'dotenv/config';import  from '@upstash/search';
type KnowledgeContent = ;
// Initialize Upstash Search clientconst search = new Search();
const index = search.index<KnowledgeContent>('knowledge-base');
async function setupKnowledgeBase() `,      content: `,        title: chunk.split('\n')[0] || `Chunk $`,      },    }));    await index.upsert(batch);    console.log(      `Upserted $ chunks out of $ chunks`,    );  }}
// Run setupsetupKnowledgeBase().catch(console.error);
```


Run the setup script to populate your knowledge base:



``` bash
pnpm tsx setup.ts
```


Navigate to the Upstash Console and check the data browser of your Search database. You should see the essay has been indexed.

## [Building the Knowledge Base Agent](#building-the-knowledge-base-agent)

Now let's create an agent that can interact with this knowledge base. Create a new file called `agent.ts`:












``` ts
import  from '@ai-sdk/openai';import  from 'ai';import  from 'zod';import  from '@upstash/search';
import 'dotenv/config';
const search = new Search();
type KnowledgeContent = ;
const index = search.index<KnowledgeContent>('knowledge-base');
async function main(prompt: string)  = await generateText(),        execute: async () => `,            },          });          return `Successfully added resource "$" to knowledge base with ID: $`;        },      }),      searchKnowledge: tool(),        execute: async () => );
          if (results.length === 0) 
          return results.map((hit, i) => ());        },      }),      deleteResource: tool(),        execute: async () => );            return `Successfully deleted resource with ID: $`;          } catch (error) `;          }        },      }),    },    // log out intermediate steps    onStepFinish: () => );      }    },  });
  return text;}
const question =  'What are the two main things I worked on before college? (utilize knowledge base)';
main(question).then(console.log).catch(console.error);
```


## [Running the Agent](#running-the-agent)

Now let's run the agent:



``` bash
pnpm tsx agent.ts
```


The agent will utilize the knowledge base to answer questions, add new resources, and delete existing ones as needed. You can modify the `question` variable to test different queries and interactions with the knowledge base.
















On this page























Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.