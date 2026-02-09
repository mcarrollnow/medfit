AI SDK 5 is available now.










Menu






















































































































































































































































































































































































































































































# [SAP AI Core](#sap-ai-core)

## [Important Note](#important-note)



- **Multi-Model Access**: Support for 40+ models including GPT-4, Claude, Gemini, and Amazon Nova
- **OAuth Integration**: Automatic authentication handling with SAP BTP
- **Cost Management**: Enterprise billing and usage tracking through SAP BTP
- **High Availability**: Enterprise-grade infrastructure with SLA guarantees
- **Hybrid Deployment**: Support for both cloud and on-premise deployments
- **Tool Calling**: Full function calling capabilities for compatible models
- **Multi-modal Support**: Text and image inputs for compatible models


## [Setup](#setup)

The SAP AI Core provider is available in the `@mymediset/sap-ai-provider` module. You can install it with:






pnpm







npm







yarn







bun








``` geist-overflow-scroll-y
pnpm add @mymediset/sap-ai-provider
```












## [Provider Instance](#provider-instance)

To create an SAP AI Core provider instance, use the `createSAPAIProvider` function:



``` typescript
import  from '@mymediset/sap-ai-provider';
const sapai = await createSAPAIProvider();
```


You can obtain your SAP AI Core service key from your SAP BTP Cockpit by creating a service key for your AI Core instance.

## [Language Models](#language-models)

You can create SAP AI Core models using the provider instance and model name:



``` typescript
// OpenAI modelsconst gpt4Model = sapai('gpt-4o');
// Anthropic modelsconst claudeModel = sapai('anthropic--claude-3-sonnet');
// Google modelsconst geminiModel = sapai('gemini-1.5-pro');
// Amazon modelsconst novaModel = sapai('amazon--nova-pro');
```


## [Supported Models](#supported-models)

The provider supports a wide range of models available in your SAP AI Core deployment:

### [OpenAI Models](#openai-models)

- `gpt-4`, `gpt-4o`, `gpt-4o-mini`
- `o1`

### [Anthropic Models](#anthropic-models)

- `anthropic--claude-3-haiku`, `anthropic--claude-3-sonnet`, `anthropic--claude-3-opus`
- `anthropic--claude-3.5-sonnet`

### [Google Models](#google-models)

- `gemini-1.5-pro`, `gemini-1.5-flash`
- `gemini-2.0-pro`, `gemini-2.0-flash`

### [Amazon Models](#amazon-models)

- `amazon--nova-premier`, `amazon--nova-pro`, `amazon--nova-lite`, `amazon--nova-micro`

### [Other Models](#other-models)

- `mistralai--mistral-large-instruct`
- `meta--llama3-70b-instruct`, `meta--llama3.1-70b-instruct`

Note: Model availability may vary based on your SAP AI Core subscription and region. Some models may require additional configuration or permissions.

## [Examples](#examples)

Here are examples of using SAP AI Core with the AI SDK:

### [generateText](#generatetext)



``` typescript
import  from '@mymediset/sap-ai-provider';import  from 'ai';
const sapai = await createSAPAIProvider();
const  = await generateText();
console.log(text);
```


### [streamText](#streamtext)



``` typescript
import  from '@mymediset/sap-ai-provider';import  from 'ai';
const sapai = await createSAPAIProvider();
const result = streamText();
for await (const textPart of result.textStream) 
```


### [Tool Calling](#tool-calling)



``` typescript
import  from '@mymediset/sap-ai-provider';import  from 'ai';import  from 'zod';
const sapai = await createSAPAIProvider();
const result = await generateText(),      execute: async () => ;      },    }),  },});
console.log(result.text);
```


### [Multi-modal Input](#multi-modal-input)



``` typescript
import  from '@mymediset/sap-ai-provider';import  from 'ai';
const sapai = await createSAPAIProvider();
const result = await generateText(,        ,      ],    },  ],});
console.log(result.text);
```


## [Configuration](#configuration)

### [Provider Settings](#provider-settings)



``` typescript
interface SAPAIProviderSettings 
```


### [Model Settings](#model-settings)



``` typescript
interface SAPAIModelSettings ;  safePrompt?: boolean; // Enable safe prompt filtering  structuredOutputs?: boolean; // Enable structured outputs}
```


## [Environment Variables](#environment-variables)

### [Required](#required)

Your SAP AI Core service key:



``` bash
SAP_AI_SERVICE_KEY=',"clientid":"...","clientsecret":"..."}'
```


### [Optional](#optional)

Direct access token (alternative to service key):



``` bash
SAP_AI_TOKEN='your-access-token'
```


Custom base URL:



``` bash
SAP_AI_BASE_URL='https://api.ai.prod.eu-central-1.aws.ml.hana.ondemand.com'
```


## [Enterprise Features](#enterprise-features)

SAP AI Core offers several enterprise-grade features:

- **Multi-Tenant Architecture**: Isolated environments for different business units
- **Cost Allocation**: Detailed usage tracking and cost center allocation
- **Custom Models**: Deploy and manage your own fine-tuned models
- **Hybrid Deployment**: Support for both cloud and on-premise installations
- **Integration Ready**: Native integration with SAP S/4HANA, SuccessFactors, and other SAP solutions


## [Additional Resources](#additional-resources)

















On this page


























































































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.