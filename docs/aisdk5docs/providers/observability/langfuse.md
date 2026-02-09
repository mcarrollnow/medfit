AI SDK 5 is available now.










Menu






















































































































































































































































































































































































































































































# [Langfuse Observability](#langfuse-observability)


- Usage patterns
- Cost data by user and model
- Replay sessions to debug issues

## [Setup](#setup)

The AI SDK supports tracing via OpenTelemetry. With the `LangfuseExporter` you can collect these traces in Langfuse. While telemetry is experimental ([docs](../../docs/ai-sdk-core/telemetry.html#enabling-telemetry)), you can enable it by setting `experimental_telemetry` on each request that you want to trace.



``` ts
const result = await generateText(,});
```


To collect the traces in Langfuse, you need to add the `LangfuseExporter` to your application.

You can set the Langfuse credentials via environment variables or directly to the `LangfuseExporter` constructor.







Environment Variables







Constructor


















``` bash
LANGFUSE_SECRET_KEY="sk-lf-..."LANGFUSE_PUBLIC_KEY="pk-lf-..."LANGFUSE_BASEURL="https://cloud.langfuse.com" # 🇪🇺 EU region, use "https://us.cloud.langfuse.com" for US region
```




Now you need to register this exporter via the OpenTelemetry SDK.






Next.js







Node.js







Install dependencies:



``` bash
npm install @vercel/otel langfuse-vercel @opentelemetry/api-logs @opentelemetry/instrumentation @opentelemetry/sdk-logs
```


Add `LangfuseExporter` to your instrumentation:












``` ts
import  from '@vercel/otel';import  from 'langfuse-vercel';
export function register() );}
```




Done! All traces that contain AI SDK spans are automatically captured in Langfuse.

## [Example Application](#example-application)


## [Configuration](#configuration)

### [Group multiple executions in one trace](#group-multiple-executions-in-one-trace)

You can open a Langfuse trace and pass the trace ID to AI SDK calls to group multiple execution spans under one trace. The passed name in `functionId` will be the root span name of the respective execution.



``` ts
import  from 'crypto';import  from 'langfuse';
const langfuse = new Langfuse();const parentTraceId = randomUUID();
langfuse.trace();
for (let i = 0; i < 3; i++) `,      metadata: ,    },  });
  console.log(result.text);}
await langfuse.flushAsync();await sdk.shutdown();
```


The resulting trace hierarchy will be:

![Vercel nested trace in Langfuse UI](../../../langfuse.com/images/docs/vercel-nested-trace.png)

### [Disable Tracking of Input/Output](#disable-tracking-of-inputoutput)

By default, the exporter captures the input and output of each request. You can disable this behavior by setting the `recordInputs` and `recordOutputs` options to `false`.

### [Link Langfuse prompts to traces](#link-langfuse-prompts-to-traces)

You can link Langfuse prompts to AI SDK generations by setting the `langfusePrompt` property in the `metadata` field:



``` typescript
import  from 'ai';import  from 'langfuse';
const langfuse = new Langfuse();
const fetchedPrompt = await langfuse.getPrompt('my-prompt');
const result = await generateText(,  },});
```



### [Pass Custom Attributes](#pass-custom-attributes)

All of the `metadata` fields are automatically captured by the exporter. You can also pass custom trace attributes to e.g. track users or sessions.



``` ts
const result = await generateText(,  },});
```


## [Debugging](#debugging)

Enable the `debug` option to see the logs of the exporter.



``` ts
new LangfuseExporter();
```


## [Troubleshooting](#troubleshooting)

- You need to be on `"ai": "^3.3.0"` to use the telemetry feature. In case of any issues, please update to the latest version.
- On NextJS, make sure that you only have a single instrumentation file.
- If you use Sentry, make sure to either:
  - set `skipOpenTelemetrySetup: true` in Sentry.init
  - follow Sentry's docs on how to manually set up Sentry with OTEL

## [Learn more](#learn-more)

- For more information, see the [telemetry documentation](../../docs/ai-sdk-core/telemetry.html) of the AI SDK.
















On this page













































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.