AI SDK 5 is available now.










Menu






















































































































































































































































































































































































































































































# [Amazon Bedrock Provider](#amazon-bedrock-provider)


## [Setup](#setup)

The Bedrock provider is available in the `@ai-sdk/amazon-bedrock` module. You can install it with






pnpm







npm







yarn







bun








``` geist-overflow-scroll-y
pnpm add @ai-sdk/amazon-bedrock
```












### [Prerequisites](#prerequisites)

Access to Amazon Bedrock foundation models isn't granted by default. In order to gain access to a foundation model, an IAM user with sufficient permissions needs to request access to it through the console. Once access is provided to a model, it is available for all users in the account.


### [Authentication](#authentication)

#### [Using IAM Access Key and Secret Key](#using-iam-access-key-and-secret-key)

**Step 1: Creating AWS Access Key and Secret Key**

To get started, you'll need to create an AWS access key and secret key. Here's how:

**Login to AWS Management Console**


**Create an IAM User**

- Click on "Create user" and fill in the required details to create a new IAM user.
- Make sure to select "Programmatic access" as the access type.
- The user account needs the `AmazonBedrockFullAccess` policy attached to it.

**Create Access Key**

- Click on the "Security credentials" tab and then click on "Create access key".
- Click "Create access key" to generate a new access key pair.
- Download the `.csv` file containing the access key ID and secret access key.

**Step 2: Configuring the Access Key and Secret Key**

Within your project add a `.env` file if you don't already have one. This file will be used to set the access key and secret key as environment variables. Add the following lines to the `.env` file:



``` makefile
AWS_ACCESS_KEY_ID=YOUR_ACCESS_KEY_IDAWS_SECRET_ACCESS_KEY=YOUR_SECRET_ACCESS_KEYAWS_REGION=YOUR_REGION
```








Remember to replace `YOUR_ACCESS_KEY_ID`, `YOUR_SECRET_ACCESS_KEY`, and `YOUR_REGION` with the actual values from your AWS account.

#### [Using AWS SDK Credentials Chain (instance profiles, instance roles, ECS roles, EKS Service Accounts, etc.)](#using-aws-sdk-credentials-chain-instance-profiles-instance-roles-ecs-roles-eks-service-accounts-etc)

When using AWS SDK, the SDK will automatically use the credentials chain to determine the credentials to use. This includes instance profiles, instance roles, ECS roles, EKS Service Accounts, etc. A similar behavior is possible using the AI SDK by not specifying the `accessKeyId` and `secretAccessKey`, `sessionToken` properties in the provider settings and instead passing a `credentialProvider` property.

*Usage:*

`@aws-sdk/credential-providers` package provides a set of credential providers that can be used to create a credential provider chain.






pnpm







npm







yarn







bun








``` geist-overflow-scroll-y
pnpm add @aws-sdk/credential-providers
```














``` ts
import  from '@ai-sdk/amazon-bedrock';import  from '@aws-sdk/credential-providers';
const bedrock = createAmazonBedrock();
```


## [Provider Instance](#provider-instance)

You can import the default provider instance `bedrock` from `@ai-sdk/amazon-bedrock`:



``` ts
import  from '@ai-sdk/amazon-bedrock';
```


If you need a customized setup, you can import `createAmazonBedrock` from `@ai-sdk/amazon-bedrock` and create a provider instance with your settings:



``` ts
import  from '@ai-sdk/amazon-bedrock';
const bedrock = createAmazonBedrock();
```





The credentials settings fall back to environment variable defaults described below. These may be set by your serverless environment without your awareness, which can lead to merged/conflicting credential values and provider errors around failed authentication. If you're experiencing issues be sure you are explicitly specifying all settings (even if `undefined`) to avoid any defaults.



You can use the following optional settings to customize the Amazon Bedrock provider instance:

- **region** *string*

  The AWS region that you want to use for the API calls. It uses the `AWS_REGION` environment variable by default.

- **accessKeyId** *string*

  The AWS access key ID that you want to use for the API calls. It uses the `AWS_ACCESS_KEY_ID` environment variable by default.

- **secretAccessKey** *string*

  The AWS secret access key that you want to use for the API calls. It uses the `AWS_SECRET_ACCESS_KEY` environment variable by default.

- **sessionToken** *string*

  Optional. The AWS session token that you want to use for the API calls. It uses the `AWS_SESSION_TOKEN` environment variable by default.

- **credentialProvider** *() =\> Promise\<\>*

  Optional. The AWS credential provider chain that you want to use for the API calls. It uses the specified credentials by default.

## [Language Models](#language-models)

You can create models that call the Bedrock API using the provider instance. The first argument is the model id, e.g. `meta.llama3-70b-instruct-v1:0`.



``` ts
const model = bedrock('meta.llama3-70b-instruct-v1:0');
```


Amazon Bedrock models also support some model specific provider options that are not part of the [standard call settings](../../docs/ai-sdk-core/settings.html). You can pass them in the `providerOptions` argument:



``` ts
const model = bedrock('anthropic.claude-3-sonnet-20240229-v1:0');
await generateText(,    },  },});
```



You can use Amazon Bedrock language models to generate text with the `generateText` function:



``` ts
import  from '@ai-sdk/amazon-bedrock';import  from 'ai';
const  = await generateText();
```


Amazon Bedrock language models can also be used in the `streamText` function (see [AI SDK Core](../../docs/ai-sdk-core.html)).

### [File Inputs](#file-inputs)




Amazon Bedrock supports file inputs on in combination with specific models, e.g. `anthropic.claude-3-haiku-20240307-v1:0`.



The Amazon Bedrock provider supports file inputs, e.g. PDF files.



``` ts
import  from '@ai-sdk/amazon-bedrock';import  from 'ai';
const result = await generateText(,        ,      ],    },  ],});
```


### [Guardrails](#guardrails)




``` ts
const result = await generateText(,    },  },});
```


Tracing information will be returned in the provider metadata if you have tracing enabled.



``` ts
if (result.providerMetadata?.bedrock.trace) 
```



### [Citations](#citations)

Amazon Bedrock supports citations for document-based inputs across compatible models. When enabled:

- Some models can read documents with visual understanding, not just extracting text
- Models can cite specific parts of documents you provide, making it easier to trace information back to its source (Not Supported Yet)



``` ts
import  from '@ai-sdk/amazon-bedrock';import  from 'ai';import  from 'zod';import fs from 'fs';
const result = await generateObject(),  messages: [    ,        ,            },          },        },      ],    },  ],});
console.log('Response:', result.object);
```


### [Cache Points](#cache-points)







In messages, you can use the `providerOptions` property to set cache points. Set the `bedrock` property in the `providerOptions` object to ` }` to create a cache point.

Cache usage information is returned in the `providerMetadata` object\`. See examples below.









``` ts
import  from '@ai-sdk/amazon-bedrock';import  from 'ai';
const cyberpunkAnalysis =  '... literary analysis of cyberpunk themes and concepts ...';
const result = await generateText(`,      providerOptions:  },      },    },    ,  ],});
console.log(result.text);console.log(result.providerMetadata?.bedrock?.usage);// Shows cache read/write token usage, e.g.:// 
```


Cache points also work with streaming responses:



``` ts
import  from '@ai-sdk/amazon-bedrock';import  from 'ai';
const cyberpunkAnalysis =  '... literary analysis of cyberpunk themes and concepts ...';
const result = streamText(,        ` },      ],      providerOptions:  } },    },    ,  ],});
for await (const textPart of result.textStream) 
console.log(  'Cache token usage:',  (await result.providerMetadata)?.bedrock?.usage,);// Shows cache read/write token usage, e.g.:// 
```


## [Reasoning](#reasoning)

Amazon Bedrock has reasoning support for the `claude-3-7-sonnet-20250219` model.

You can enable it using the `reasoningConfig` provider option and specifying a thinking budget in tokens (minimum: `1024`, maximum: `64000`).



``` ts
import  from '@ai-sdk/amazon-bedrock';import  from 'ai';
const  = await generateText(,    },  },});
console.log(reasoning); // reasoning textconsole.log(reasoningDetails); // reasoning details including redacted reasoningconsole.log(text); // text response
```


See [AI SDK UI: Chatbot](../../docs/ai-sdk-ui/chatbot.html#reasoning) for more details on how to integrate reasoning into your chatbot.

## [Computer Use](#computer-use)

Via Anthropic, Amazon Bedrock provides three provider-defined tools that can be used to interact with external systems:

1.  **Bash Tool**: Allows running bash commands.
2.  **Text Editor Tool**: Provides functionality for viewing and editing text files.
3.  **Computer Tool**: Enables control of keyboard and mouse actions on a computer.

They are available via the `tools` property of the provider instance.

### [Bash Tool](#bash-tool)

The Bash Tool allows running bash commands. Here's how to create and use it:



``` ts
const bashTool = anthropic.tools.bash_20241022() => ,});
```


Parameters:

- `command` (string): The bash command to run. Required unless the tool is being restarted.
- `restart` (boolean, optional): Specifying true will restart this tool.

### [Text Editor Tool](#text-editor-tool)

The Text Editor Tool provides functionality for viewing and editing text files.

**For Claude 4 models (Opus & Sonnet):**



``` ts
const textEditorTool = anthropic.tools.textEditor_20250429() => ,});
```


**For Claude 3.5 Sonnet and earlier models:**



``` ts
const textEditorTool = anthropic.tools.textEditor_20241022() => ,});
```


Parameters:

- `command` ('view' \| 'create' \| 'str_replace' \| 'insert' \| 'undo_edit'): The command to run. Note: `undo_edit` is only available in Claude 3.5 Sonnet and earlier models.
- `path` (string): Absolute path to file or directory, e.g. `/repo/file.py` or `/repo`.
- `file_text` (string, optional): Required for `create` command, with the content of the file to be created.
- `insert_line` (number, optional): Required for `insert` command. The line number after which to insert the new string.
- `new_str` (string, optional): New string for `str_replace` or `insert` commands.
- `old_str` (string, optional): Required for `str_replace` command, containing the string to replace.
- `view_range` (number\[\], optional): Optional for `view` command to specify line range to show.

When using the Text Editor Tool, make sure to name the key in the tools object correctly:

- **Claude 4 models**: Use `str_replace_based_edit_tool`
- **Claude 3.5 Sonnet and earlier**: Use `str_replace_editor`



``` ts
// For Claude 4 modelsconst response = await generateText(,});
// For Claude 3.5 Sonnet and earlierconst response = await generateText(,});
```


### [Computer Tool](#computer-tool)

The Computer Tool enables control of keyboard and mouse actions on a computer:



``` ts
const computerTool = anthropic.tools.computer_20241022() => ;      }      default: `;      }    }  },
  // map to tool result content for LLM consumption:  toModelOutput(result) ]      : [];  },});
```


Parameters:

- `action` ('key' \| 'type' \| 'mouse_move' \| 'left_click' \| 'left_click_drag' \| 'right_click' \| 'middle_click' \| 'double_click' \| 'screenshot' \| 'cursor_position'): The action to perform.
- `coordinate` (number\[\], optional): Required for `mouse_move` and `left_click_drag` actions. Specifies the (x, y) coordinates.
- `text` (string, optional): Required for `type` and `key` actions.

These tools can be used in conjunction with the `anthropic.claude-3-5-sonnet-20240620-v1:0` model to enable more complex interactions and tasks.

### [Model Capabilities](#model-capabilities)


| Model | Image Input | Object Generation | Tool Usage | Tool Streaming |
|----|----|----|----|----|








## [Embedding Models](#embedding-models)




``` ts
const model = bedrock.textEmbedding('amazon.titan-embed-text-v1');
```


Bedrock Titan embedding model amazon.titan-embed-text-v2:0 supports several additional settings. You can pass them as an options argument:



``` ts
import  from '@ai-sdk/amazon-bedrock';import  from 'ai';
const model = bedrock.textEmbedding('amazon.titan-embed-text-v2:0');
const  = await embed(,  },});
```


The following optional provider options are available for Bedrock Titan embedding models:

- **dimensions**: *number*

  The number of dimensions the output embeddings should have. The following values are accepted: 1024 (default), 512, 256.

- **normalize** *boolean*

  Flag indicating whether or not to normalize the output embeddings. Defaults to true.

### [Model Capabilities](#model-capabilities-1)


| Model | Default Dimensions | Custom Dimensions |
|----|----|----|


## [Image Models](#image-models)






The `amazon.nova-canvas-v1:0` model is available in the `us-east-1`, `eu-west-1`, and `ap-northeast-1` regions.





``` ts
const model = bedrock.image('amazon.nova-canvas-v1:0');
```


You can then generate images with the `experimental_generateImage` function:



``` ts
import  from '@ai-sdk/amazon-bedrock';import  from 'ai';
const  = await generateImage();
```


You can also pass the `providerOptions` object to the `generateImage` function to customize the generation behavior:



``` ts
import  from '@ai-sdk/amazon-bedrock';import  from 'ai';
const  = await generateImage(,  },});
```


The following optional provider options are available for Amazon Nova Canvas:

- **quality** *string*

  The quality level for image generation. Accepts `'standard'` or `'premium'`.

- **negativeText** *string*

  Text describing what you don't want in the generated image.

- **cfgScale** *number*

  Controls how closely the generated image adheres to the prompt. Higher values result in images that are more closely aligned to the prompt.

- **style** *string*

  Predefined visual style for image generation.  
  Accepts one of: `3D_ANIMATED_FAMILY_FILM` · `DESIGN_SKETCH` · `FLAT_VECTOR_ILLUSTRATION` ·  
  `GRAPHIC_NOVEL_ILLUSTRATION` · `MAXIMALISM` · `MIDCENTURY_RETRO` ·  
  `PHOTOREALISM` · `SOFT_DIGITAL_PAINTING`.


### [Image Model Settings](#image-model-settings)

You can customize the generation behavior with optional options:



``` ts
await generateImage();
```


- **maxImagesPerCall** *number*

  Override the maximum number of images generated per API call. Default can vary by model, with 5 as a common default.

### [Model Capabilities](#model-capabilities-2)

The Amazon Nova Canvas model supports custom sizes with constraints as follows:

- Each side must be between 320-4096 pixels, inclusive.
- Each side must be evenly divisible by 16.
- The aspect ratio must be between 1:4 and 4:1. That is, one side can't be more than 4 times longer than the other side.
- The total pixel count must be less than 4,194,304.



| Model | Sizes |
|----|----|
| `amazon.nova-canvas-v1:0` | Custom sizes: 320-4096px per side (must be divisible by 16), aspect ratio 1:4 to 4:1, max 4.2M pixels |


## [Response Headers](#response-headers)

The Amazon Bedrock provider will return the response headers associated with network requests made of the Bedrock servers.



``` ts
import  from '@ai-sdk/amazon-bedrock';import  from 'ai';
const  = await generateText();
console.log(result.response.headers);
```


Below is sample output where you can see the `x-amzn-requestid` header. This can be useful for correlating Bedrock API calls with requests made by the AI SDK:



``` js

```


This information is also available with `streamText`:



``` ts
import  from '@ai-sdk/amazon-bedrock';import  from 'ai';
const result = streamText();for await (const textPart of result.textStream) console.log('Response headers:', (await result.response).headers);
```


With sample output as:



``` js

```


## [Migrating to `@ai-sdk/amazon-bedrock` 2.x](#migrating-to-ai-sdkamazon-bedrock-2x)

The Amazon Bedrock provider was rewritten in version 2.x to remove the dependency on the `@aws-sdk/client-bedrock-runtime` package.

The `bedrockOptions` provider setting previously available has been removed. If you were using the `bedrockOptions` object, you should now use the `region`, `accessKeyId`, `secretAccessKey`, and `sessionToken` settings directly instead.

Note that you may need to set all of these explicitly, e.g. even if you're not using `sessionToken`, set it to `undefined`. If you're running in a serverless environment, there may be default environment variables set by your containing environment that the Amazon Bedrock provider will then pick up and could conflict with the ones you're intending to use.
















On this page

































































































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.