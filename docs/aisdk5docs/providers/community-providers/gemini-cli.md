AI SDK 5 is available now.










Menu






















































































































































































































































































































































































































































































# [Gemini CLI Provider](#gemini-cli-provider)


## [Version Compatibility](#version-compatibility)

The Gemini CLI provider supports both AI SDK v4 and v5-beta:


| Provider Version | AI SDK Version | Status | Branch |
|----|----|----|----|


## [Setup](#setup)

The Gemini CLI provider is available in the `ai-sdk-provider-gemini-cli` module. Install the version that matches your AI SDK version:

### [For AI SDK v5-beta (latest)](#for-ai-sdk-v5-beta-latest)






pnpm







npm







yarn







bun








``` geist-overflow-scroll-y
pnpm add ai-sdk-provider-gemini-cli ai
```












### [For AI SDK v4 (stable)](#for-ai-sdk-v4-stable)






pnpm







npm







yarn







bun








``` geist-overflow-scroll-y
pnpm add ai-sdk-provider-gemini-cli@^0 ai@^4
```












## [Provider Instance](#provider-instance)

You can import `createGeminiProvider` from `ai-sdk-provider-gemini-cli` and create a provider instance with your settings:



``` ts
import  from 'ai-sdk-provider-gemini-cli';
// OAuth authentication (recommended)const gemini = createGeminiProvider();
// API key authenticationconst gemini = createGeminiProvider();
```


You can use the following settings to customize the Gemini CLI provider instance:

- **authType** *'oauth-personal' \| 'api-key' \| 'gemini-api-key'*

  Required. The authentication method to use.

  - `'oauth-personal'`: Uses existing Gemini CLI credentials from `~/.gemini/oauth_creds.json`
  - `'api-key'`: Standard AI SDK API key authentication (recommended)
  - `'gemini-api-key'`: Gemini-specific API key authentication (identical to `'api-key'`)

  Note: `'api-key'` and `'gemini-api-key'` are functionally identical. We recommend using `'api-key'` for consistency with AI SDK standards, but both options map to the same Gemini authentication method internally.

- **apiKey** *string*


## [Language Models](#language-models)

You can create models that call Gemini through the CLI using the provider instance. The first argument is the model ID:



``` ts
const model = gemini('gemini-2.5-pro');
```


Gemini CLI supports the following models:

- **gemini-2.5-pro**: Most capable model for complex tasks (64K output tokens)
- **gemini-2.5-flash**: Faster model for simpler tasks (64K output tokens)

### [Example: Generate Text](#example-generate-text)

You can use Gemini CLI language models to generate text with the `generateText` function:



``` ts
import  from 'ai-sdk-provider-gemini-cli';import  from 'ai';
const gemini = createGeminiProvider();
// AI SDK v4const  = await generateText();
// AI SDK v5-betaconst result = await generateText();console.log(result.content[0].text);
```


Gemini CLI language models can also be used in the `streamText`, `generateObject`, and `streamObject` functions (see [AI SDK Core](../../docs/ai-sdk-core.html) for more information).




The response format differs between AI SDK v4 and v5-beta. In v4, text is accessed directly via `result.text`. In v5-beta, it's accessed via `result.content[0].text`. Make sure to use the appropriate format for your AI SDK version.



### [Model Capabilities](#model-capabilities)


| Model | Image Input | Object Generation | Tool Usage | Tool Streaming |
|----|----|----|----|----|





Images must be provided as base64-encoded data. Image URLs are not supported due to the Google Cloud Code endpoint requirements.



## [Authentication](#authentication)

The Gemini CLI provider supports two authentication methods:

### [OAuth Authentication (Recommended)](#oauth-authentication-recommended)

First, install and authenticate the Gemini CLI globally:



``` bash
npm install -g @google/gemini-cligemini  # Follow the interactive authentication setup
```


Then use OAuth authentication in your code:



``` ts
const gemini = createGeminiProvider();
```


This uses your existing Gemini CLI credentials from `~/.gemini/oauth_creds.json`.

### [API Key Authentication](#api-key-authentication)


2.  Set it as an environment variable in your terminal:


    ``` bash
    export GEMINI_API_KEY="YOUR_API_KEY"
    ```


    Replace `YOUR_API_KEY` with your generated key.

3.  Use API key authentication in your code:



``` ts
const gemini = createGeminiProvider();
```








## [Features](#features)

### [Structured Object Generation](#structured-object-generation)

Generate structured data using Zod schemas:



``` ts
import  from 'ai';import  from 'ai-sdk-provider-gemini-cli';import  from 'zod';
const gemini = createGeminiProvider();
const result = await generateObject(),  prompt: 'Generate a laptop product listing',});
console.log(result.object);
```


### [Streaming Responses](#streaming-responses)

Stream text for real-time output:



``` ts
import  from 'ai';import  from 'ai-sdk-provider-gemini-cli';
const gemini = createGeminiProvider();
const result = await streamText();
// Both v4 and v5 use the same streaming APIfor await (const chunk of result.textStream) 
```



## [Model Parameters](#model-parameters)

You can configure model behavior with standard AI SDK parameters:



``` ts
// AI SDK v4const model = gemini('gemini-2.5-pro', );
// AI SDK v5-betaconst model = gemini('gemini-2.5-pro', );
```





In AI SDK v5-beta, the `maxTokens` parameter has been renamed to `maxOutputTokens`. Make sure to use the correct parameter name for your version.



## [Limitations](#limitations)

- Requires Node.js ≥ 18
- OAuth authentication requires the Gemini CLI to be installed globally
- Image URLs not supported (use base64-encoded images)
- Very strict character length constraints in schemas may be challenging
- Some AI SDK parameters not supported: `frequencyPenalty`, `presencePenalty`, `seed`
- Only function tools supported (no provider-defined tools)

## [Requirements](#requirements)

- Node.js 18 or higher
- Gemini CLI installed globally for OAuth authentication (`npm install -g @google/gemini-cli`)
- Valid Google account or Gemini API key
















On this page








































































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.