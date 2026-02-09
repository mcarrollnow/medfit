AI SDK 5 is available now.










Menu






















































































































































































































































































































































































































































































# [Laminar observability](#laminar-observability)


Laminar features:








## [Setup](#setup)

Laminar's tracing is based on OpenTelemetry. It supports AI SDK [telemetry](../../docs/ai-sdk-core/telemetry.html).

### [Installation](#installation)







pnpm







npm







yarn







bun








``` geist-overflow-scroll-y
pnpm add @lmnr-ai/lmnr
```












### [Get your project API key and set in the environment](#get-your-project-api-key-and-set-in-the-environment)


In the project settings, create and copy the API key.

In your .env



``` bash
LMNR_PROJECT_API_KEY=...
```


## [Next.js](#nextjs)

### [Initialize tracing](#initialize-tracing)

In Next.js, Laminar initialization should be done in `instrumentation.`:



``` javascript
export async function register()  = await import('@lmnr-ai/lmnr');    Laminar.initialize();  }}
```


### [Add @lmnr-ai/lmnr to your next.config](#add-lmnr-ailmnr-to-your-nextconfig)

In your `next.config.js` (`.ts` / `.mjs`), add the following lines:



``` javascript
const nextConfig = ;
export default nextConfig;
```



### [Tracing AI SDK calls](#tracing-ai-sdk-calls)

Then, when you call AI SDK functions in any of your API routes, add the Laminar tracer to the `experimental_telemetry` option.



``` javascript
import  from '@ai-sdk/openai';import  from 'ai';import  from '@lmnr-ai/lmnr';
const  = await generateText(,});
```


This will create spans for `ai.generateText`. Laminar collects and displays the following information:

- LLM call input and output
- Start and end time
- Duration / latency
- Provider and model used
- Input and output tokens
- Input and output price
- Additional metadata and span attributes

### [Older versions of Next.js](#older-versions-of-nextjs)

If you are using 13.4 ≤ Next.js \< 15, you will also need to enable the experimental instrumentation hook. Place the following in your `next.config.js`:



``` javascript
module.exports = ,};
```



### [Usage with `@vercel/otel`](#usage-with-vercelotel)

Laminar can live alongside `@vercel/otel` and trace AI SDK calls. The default Laminar setup will ensure that

- regular Next.js traces are sent via `@vercel/otel` to your Telemetry backend configured with Vercel,
- AI SDK and other LLM or browser agent traces are sent via Laminar.



``` javascript
import  from '@vercel/otel';
export async function register()  = await import('@lmnr-ai/lmnr');    // Make sure to initialize Laminar **after** `@registerOTel`    Laminar.initialize();  }}
```



### [Usage with `@sentry/node`](#usage-with-sentrynode)

Laminar can live alongside `@sentry/node` and trace AI SDK calls. Make sure to initialize Laminar **after** `Sentry.init`.

This will ensure that

- Whatever is instrumented by Sentry is sent to your Sentry backend,
- AI SDK and other LLM or browser agent traces are sent via Laminar.



``` javascript
export async function register()  = await import('@lmnr-ai/lmnr');
    Sentry.init();
    // Make sure to initialize Laminar **after** `Sentry.init`    Laminar.initialize();  }}
```


## [Node.js](#nodejs)

### [Initialize tracing](#initialize-tracing-1)

Then, initialize tracing in your application:



``` javascript
import  from '@lmnr-ai/lmnr';
Laminar.initialize();
```


This must be done once in your application, as early as possible, but *after* other tracing libraries (e.g. `@sentry/node`) are initialized.


### [Tracing AI SDK calls](#tracing-ai-sdk-calls-1)

Then, when you call AI SDK functions in any of your API routes, add the Laminar tracer to the `experimental_telemetry` option.



``` javascript
import  from '@ai-sdk/openai';import  from 'ai';import  from '@lmnr-ai/lmnr';
const  = await generateText(,});
```


This will create spans for `ai.generateText`. Laminar collects and displays the following information:

- LLM call input and output
- Start and end time
- Duration / latency
- Provider and model used
- Input and output tokens
- Input and output price
- Additional metadata and span attributes

### [Usage with `@sentry/node`](#usage-with-sentrynode-1)

Laminar can work with `@sentry/node` to trace AI SDK calls. Make sure to initialize Laminar **after** `Sentry.init`:



``` javascript
const Sentry = await import('@sentry/node');const  = await import('@lmnr-ai/lmnr');
Sentry.init();
Laminar.initialize();
```


This will ensure that

- Whatever is instrumented by Sentry is sent to your Sentry backend,
- AI SDK and other LLM or browser agent traces are sent via Laminar.

The two libraries allow for additional advanced configuration, but the default setup above is recommended.

## [Additional configuration](#additional-configuration)

### [Span name](#span-name)

If you want to override the default span name, you can set the `functionId` inside the `telemetry` option.



``` javascript
import  from '@lmnr-ai/lmnr';
const  = await generateText(,});
```


### [Nested spans](#nested-spans)

If you want to trace not just the AI SDK calls, but also other functions in your application, you can use Laminar's `observe` wrapper.



``` javascript
import  from '@lmnr-ai/lmnr';
const result = await observe(, async () => );  // ... some work});
```


This will create a span with the name "my-function" and trace the function call. Inside it, you will see the nested `ai.generateText` spans.

To trace input arguments of the function that you wrap in `observe`, pass them to the wrapper as additional arguments. The return value of the function will be returned from the wrapper and traced as the span's output.



``` javascript
const result = await observe(  ,  async (topic: string, mood: string) =>  = await generateText( in $ mood.`,    });    return text;  },  'Laminar flow',  'happy',);
```


### [Metadata](#metadata)

In Laminar, metadata is set on the trace level. Metadata contains key-value pairs and can be used to filter traces.



``` javascript
import  from '@lmnr-ai/lmnr';
const  = await generateText(,  },});
```



### [Tags](#tags)


Tags can subsequently be used to filter traces in Laminar.



``` javascript
import  from '@lmnr-ai/lmnr';
const  = await generateText(,  },});
```


### [Session ID and User ID](#session-id-and-user-id)




``` javascript
import  from '@lmnr-ai/lmnr';
const  = await generateText(,  },});
```

















On this page

















































































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.