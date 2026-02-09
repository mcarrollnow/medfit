Agents: Workflow Patterns

[](https://vercel.com/)

[

AI SDK



](../../index.html)

-   [Docs](../introduction.html)
-   [Cookbook](../../cookbook.html)
-   [Providers](../../providers/ai-sdk-providers.html)
-   [Playground](../../playground.html)
-   [
    
    AI ElementsAI Elements
    
    ](../../elements/overview.html)
-   [AI GatewayGateway](https://vercel.com/ai-gateway)

AI SDK 5 is available now.

[View Announcement](https://vercel.com/blog/ai-sdk-5)

Menu

[AI SDK by Vercel](../introduction.html)

[Foundations](../foundations.html)

[Overview](../foundations/overview.html)

[Providers and Models](../foundations/providers-and-models.html)

[Prompts](../foundations/prompts.html)

[Tools](../foundations/tools.html)

[Streaming](../foundations/streaming.html)

[Getting Started](../getting-started.html)

[Navigating the Library](../getting-started/navigating-the-library.html)

[Next.js App Router](../getting-started/nextjs-app-router.html)

[Next.js Pages Router](../getting-started/nextjs-pages-router.html)

[Svelte](../getting-started/svelte.html)

[Vue.js (Nuxt)](../getting-started/nuxt.html)

[Node.js](../getting-started/nodejs.html)

[Expo](../getting-started/expo.html)

[Agents](../agents.html)

[Agents](overview.html)

[Building Agents](building-agents.html)

[Workflow Patterns](workflows.html)

[Loop Control](loop-control.html)

[AI SDK Core](../ai-sdk-core.html)

[Overview](../ai-sdk-core/overview.html)

[Generating Text](../ai-sdk-core/generating-text.html)

[Generating Structured Data](../ai-sdk-core/generating-structured-data.html)

[Tool Calling](../ai-sdk-core/tools-and-tool-calling.html)

[Model Context Protocol (MCP) Tools](../ai-sdk-core/mcp-tools.html)

[Prompt Engineering](../ai-sdk-core/prompt-engineering.html)

[Settings](../ai-sdk-core/settings.html)

[Embeddings](../ai-sdk-core/embeddings.html)

[Image Generation](../ai-sdk-core/image-generation.html)

[Transcription](../ai-sdk-core/transcription.html)

[Speech](../ai-sdk-core/speech.html)

[Language Model Middleware](../ai-sdk-core/middleware.html)

[Provider & Model Management](../ai-sdk-core/provider-management.html)

[Error Handling](../ai-sdk-core/error-handling.html)

[Testing](../ai-sdk-core/testing.html)

[Telemetry](../ai-sdk-core/telemetry.html)

[AI SDK UI](../ai-sdk-ui.html)

[Overview](../ai-sdk-ui/overview.html)

[Chatbot](../ai-sdk-ui/chatbot.html)

[Chatbot Message Persistence](../ai-sdk-ui/chatbot-message-persistence.html)

[Chatbot Resume Streams](../ai-sdk-ui/chatbot-resume-streams.html)

[Chatbot Tool Usage](../ai-sdk-ui/chatbot-tool-usage.html)

[Generative User Interfaces](../ai-sdk-ui/generative-user-interfaces.html)

[Completion](../ai-sdk-ui/completion.html)

[Object Generation](../ai-sdk-ui/object-generation.html)

[Streaming Custom Data](../ai-sdk-ui/streaming-data.html)

[Error Handling](../ai-sdk-ui/error-handling.html)

[Transport](../ai-sdk-ui/transport.html)

[Reading UIMessage Streams](../ai-sdk-ui/reading-ui-message-streams.html)

[Message Metadata](../ai-sdk-ui/message-metadata.html)

[Stream Protocols](../ai-sdk-ui/stream-protocol.html)

[AI SDK RSC](../ai-sdk-rsc.html)

[Advanced](../advanced.html)

[Reference](../reference.html)

[AI SDK Core](../reference/ai-sdk-core.html)

[AI SDK UI](../reference/ai-sdk-ui.html)

[AI SDK RSC](../reference/ai-sdk-rsc.html)

[Stream Helpers](../reference/stream-helpers.html)

[AI SDK Errors](../reference/ai-sdk-errors.html)

[Migration Guides](../migration-guides.html)

[Troubleshooting](../troubleshooting.html)

[Agents](../agents.html)Workflow Patterns

# [Workflow Patterns](#workflow-patterns)

Combine the building blocks from the [overview](overview.html) with these patterns to add structure and reliability to your agents:

-   [Sequential Processing](#sequential-processing-chains) - Steps executed in order
-   [Parallel Processing](#parallel-processing) - Independent tasks run simultaneously
-   [Evaluation/Feedback Loops](#evaluator-optimizer) - Results checked and improved iteratively
-   [Orchestration](#orchestrator-worker) - Coordinating multiple components
-   [Routing](#routing) - Directing work based on context

## [Choose Your Approach](#choose-your-approach)

Consider these key factors:

-   **Flexibility vs Control** - How much freedom does the LLM need vs how tightly you must constrain its actions?
-   **Error Tolerance** - What are the consequences of mistakes in your use case?
-   **Cost Considerations** - More complex systems typically mean more LLM calls and higher costs
-   **Maintenance** - Simpler architectures are easier to debug and modify

**Start with the simplest approach that meets your needs**. Add complexity only when required by:

1.  Breaking down tasks into clear steps
2.  Adding tools for specific capabilities
3.  Implementing feedback loops for quality control
4.  Introducing multiple agents for complex workflows

Let's look at examples of these patterns in action.

## [Patterns with Examples](#patterns-with-examples)

These patterns, adapted from [Anthropic's guide on building effective agents](https://www.anthropic.com/research/building-effective-agents), serve as building blocks you can combine to create comprehensive workflows. Each pattern addresses specific aspects of task execution. Combine them thoughtfully to build reliable solutions for complex problems.

## [Sequential Processing (Chains)](#sequential-processing-chains)

The simplest workflow pattern executes steps in a predefined order. Each step's output becomes input for the next step, creating a clear chain of operations. Use this pattern for tasks with well-defined sequences, like content generation pipelines or data transformation processes.

```ts
import { generateText, generateObject } from 'ai';
import { z } from 'zod';


async function generateMarketingCopy(input: string) {
  const model = 'openai/gpt-4o';


  // First step: Generate marketing copy
  const { text: copy } = await generateText({
    model,
    prompt: `Write persuasive marketing copy for: ${input}. Focus on benefits and emotional appeal.`,
  });


  // Perform quality check on copy
  const { object: qualityMetrics } = await generateObject({
    model,
    schema: z.object({
      hasCallToAction: z.boolean(),
      emotionalAppeal: z.number().min(1).max(10),
      clarity: z.number().min(1).max(10),
    }),
    prompt: `Evaluate this marketing copy for:
    1. Presence of call to action (true/false)
    2. Emotional appeal (1-10)
    3. Clarity (1-10)


    Copy to evaluate: ${copy}`,
  });


  // If quality check fails, regenerate with more specific instructions
  if (
    !qualityMetrics.hasCallToAction ||
    qualityMetrics.emotionalAppeal < 7 ||
    qualityMetrics.clarity < 7
  ) {
    const { text: improvedCopy } = await generateText({
      model,
      prompt: `Rewrite this marketing copy with:
      ${!qualityMetrics.hasCallToAction ? '- A clear call to action' : ''}
      ${qualityMetrics.emotionalAppeal < 7 ? '- Stronger emotional appeal' : ''}
      ${qualityMetrics.clarity < 7 ? '- Improved clarity and directness' : ''}


      Original copy: ${copy}`,
    });
    return { copy: improvedCopy, qualityMetrics };
  }


  return { copy, qualityMetrics };
}
```

## [Routing](#routing)

This pattern lets the model decide which path to take through a workflow based on context and intermediate results. The model acts as an intelligent router, directing the flow of execution between different branches of your workflow. Use this when handling varied inputs that require different processing approaches. In the example below, the first LLM call's results determine the second call's model size and system prompt.

```ts
import { generateObject, generateText } from 'ai';
import { z } from 'zod';


async function handleCustomerQuery(query: string) {
  const model = 'openai/gpt-4o';


  // First step: Classify the query type
  const { object: classification } = await generateObject({
    model,
    schema: z.object({
      reasoning: z.string(),
      type: z.enum(['general', 'refund', 'technical']),
      complexity: z.enum(['simple', 'complex']),
    }),
    prompt: `Classify this customer query:
    ${query}


    Determine:
    1. Query type (general, refund, or technical)
    2. Complexity (simple or complex)
    3. Brief reasoning for classification`,
  });


  // Route based on classification
  // Set model and system prompt based on query type and complexity
  const { text: response } = await generateText({
    model:
      classification.complexity === 'simple'
        ? 'openai/gpt-4o-mini'
        : 'openai/o4-mini',
    system: {
      general:
        'You are an expert customer service agent handling general inquiries.',
      refund:
        'You are a customer service agent specializing in refund requests. Follow company policy and collect necessary information.',
      technical:
        'You are a technical support specialist with deep product knowledge. Focus on clear step-by-step troubleshooting.',
    }[classification.type],
    prompt: query,
  });


  return { response, classification };
}
```

## [Parallel Processing](#parallel-processing)

Break down tasks into independent subtasks that execute simultaneously. This pattern uses parallel execution to improve efficiency while maintaining the benefits of structured workflows. For example, analyze multiple documents or process different aspects of a single input concurrently (like code review).

```ts
import { generateText, generateObject } from 'ai';
import { z } from 'zod';


// Example: Parallel code review with multiple specialized reviewers
async function parallelCodeReview(code: string) {
  const model = 'openai/gpt-4o';


  // Run parallel reviews
  const [securityReview, performanceReview, maintainabilityReview] =
    await Promise.all([
      generateObject({
        model,
        system:
          'You are an expert in code security. Focus on identifying security vulnerabilities, injection risks, and authentication issues.',
        schema: z.object({
          vulnerabilities: z.array(z.string()),
          riskLevel: z.enum(['low', 'medium', 'high']),
          suggestions: z.array(z.string()),
        }),
        prompt: `Review this code:
      ${code}`,
      }),


      generateObject({
        model,
        system:
          'You are an expert in code performance. Focus on identifying performance bottlenecks, memory leaks, and optimization opportunities.',
        schema: z.object({
          issues: z.array(z.string()),
          impact: z.enum(['low', 'medium', 'high']),
          optimizations: z.array(z.string()),
        }),
        prompt: `Review this code:
      ${code}`,
      }),


      generateObject({
        model,
        system:
          'You are an expert in code quality. Focus on code structure, readability, and adherence to best practices.',
        schema: z.object({
          concerns: z.array(z.string()),
          qualityScore: z.number().min(1).max(10),
          recommendations: z.array(z.string()),
        }),
        prompt: `Review this code:
      ${code}`,
      }),
    ]);


  const reviews = [
    { ...securityReview.object, type: 'security' },
    { ...performanceReview.object, type: 'performance' },
    { ...maintainabilityReview.object, type: 'maintainability' },
  ];


  // Aggregate results using another model instance
  const { text: summary } = await generateText({
    model,
    system: 'You are a technical lead summarizing multiple code reviews.',
    prompt: `Synthesize these code review results into a concise summary with key actions:
    ${JSON.stringify(reviews, null, 2)}`,
  });


  return { reviews, summary };
}
```

## [Orchestrator-Worker](#orchestrator-worker)

A primary model (orchestrator) coordinates the execution of specialized workers. Each worker optimizes for a specific subtask, while the orchestrator maintains overall context and ensures coherent results. This pattern excels at complex tasks requiring different types of expertise or processing.

```ts
import { generateObject } from 'ai';
import { z } from 'zod';


async function implementFeature(featureRequest: string) {
  // Orchestrator: Plan the implementation
  const { object: implementationPlan } = await generateObject({
    model: 'openai/o4-mini',
    schema: z.object({
      files: z.array(
        z.object({
          purpose: z.string(),
          filePath: z.string(),
          changeType: z.enum(['create', 'modify', 'delete']),
        }),
      ),
      estimatedComplexity: z.enum(['low', 'medium', 'high']),
    }),
    system:
      'You are a senior software architect planning feature implementations.',
    prompt: `Analyze this feature request and create an implementation plan:
    ${featureRequest}`,
  });


  // Workers: Execute the planned changes
  const fileChanges = await Promise.all(
    implementationPlan.files.map(async file => {
      // Each worker is specialized for the type of change
      const workerSystemPrompt = {
        create:
          'You are an expert at implementing new files following best practices and project patterns.',
        modify:
          'You are an expert at modifying existing code while maintaining consistency and avoiding regressions.',
        delete:
          'You are an expert at safely removing code while ensuring no breaking changes.',
      }[file.changeType];


      const { object: change } = await generateObject({
        model: 'openai/gpt-4o',
        schema: z.object({
          explanation: z.string(),
          code: z.string(),
        }),
        system: workerSystemPrompt,
        prompt: `Implement the changes for ${file.filePath} to support:
        ${file.purpose}


        Consider the overall feature context:
        ${featureRequest}`,
      });


      return {
        file,
        implementation: change,
      };
    }),
  );


  return {
    plan: implementationPlan,
    changes: fileChanges,
  };
}
```

## [Evaluator-Optimizer](#evaluator-optimizer)

Add quality control to workflows with dedicated evaluation steps that assess intermediate results. Based on the evaluation, the workflow proceeds, retries with adjusted parameters, or takes corrective action. This creates robust workflows capable of self-improvement and error recovery.

```ts
import { generateText, generateObject } from 'ai';
import { z } from 'zod';


async function translateWithFeedback(text: string, targetLanguage: string) {
  let currentTranslation = '';
  let iterations = 0;
  const MAX_ITERATIONS = 3;


  // Initial translation
  const { text: translation } = await generateText({
    model: 'openai/gpt-4o-mini', // use small model for first attempt
    system: 'You are an expert literary translator.',
    prompt: `Translate this text to ${targetLanguage}, preserving tone and cultural nuances:
    ${text}`,
  });


  currentTranslation = translation;


  // Evaluation-optimization loop
  while (iterations < MAX_ITERATIONS) {
    // Evaluate current translation
    const { object: evaluation } = await generateObject({
      model: 'openai/gpt-4o', // use a larger model to evaluate
      schema: z.object({
        qualityScore: z.number().min(1).max(10),
        preservesTone: z.boolean(),
        preservesNuance: z.boolean(),
        culturallyAccurate: z.boolean(),
        specificIssues: z.array(z.string()),
        improvementSuggestions: z.array(z.string()),
      }),
      system: 'You are an expert in evaluating literary translations.',
      prompt: `Evaluate this translation:


      Original: ${text}
      Translation: ${currentTranslation}


      Consider:
      1. Overall quality
      2. Preservation of tone
      3. Preservation of nuance
      4. Cultural accuracy`,
    });


    // Check if quality meets threshold
    if (
      evaluation.qualityScore >= 8 &&
      evaluation.preservesTone &&
      evaluation.preservesNuance &&
      evaluation.culturallyAccurate
    ) {
      break;
    }


    // Generate improved translation based on feedback
    const { text: improvedTranslation } = await generateText({
      model: 'openai/gpt-4o', // use a larger model
      system: 'You are an expert literary translator.',
      prompt: `Improve this translation based on the following feedback:
      ${evaluation.specificIssues.join('\n')}
      ${evaluation.improvementSuggestions.join('\n')}


      Original: ${text}
      Current Translation: ${currentTranslation}`,
    });


    currentTranslation = improvedTranslation;
    iterations++;
  }


  return {
    finalTranslation: currentTranslation,
    iterationsRequired: iterations,
  };
}
```

[Previous

Building Agents

](building-agents.html)

[Next

Loop Control

](loop-control.html)

On this page

[Workflow Patterns](#workflow-patterns)

[Choose Your Approach](#choose-your-approach)

[Patterns with Examples](#patterns-with-examples)

[Sequential Processing (Chains)](#sequential-processing-chains)

[Routing](#routing)

[Parallel Processing](#parallel-processing)

[Orchestrator-Worker](#orchestrator-worker)

[Evaluator-Optimizer](#evaluator-optimizer)

Deploy and Scale AI Apps with Vercel.

Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:

-   OpenAI
-   Photoroom
-   ![leonardo-ai Logo](../../_next/logo-leonardo-ai-light.svg)![leonardo-ai Logo](../../_next/logo-leonardo-ai-dark.svg)
-   ![zapier Logo](../../_next/logo-zapier-light.svg)![zapier Logo](../../_next/logo-zapier-dark.svg)

[](https://vercel.com/contact/sales?utm_source=ai_sdk&utm_medium=web&utm_campaign=contact_sales_cta&utm_content=talk_to_an_expert_sdk_docs)

#### Resources

[Docs](../introduction.html)[Cookbook](../../cookbook.html)[Providers](../../providers/ai-sdk-providers.html)[Showcase](../../showcase.html)[GitHub](https://github.com/vercel/ai)[Discussions](https://github.com/vercel/ai/discussions)

#### More

[Playground](../../playground.html)[](https://v0.dev)[Contact Sales](https://vercel.com/contact/sales)

#### About Vercel

[Next.js + Vercel](https://vercel.com/frameworks/nextjs)[Open Source Software](https://vercel.com/oss)[GitHub](https://github.com/vercel)[X](https://x.com/vercel)

#### Legal

[Privacy Policy](https://vercel.com/legal/privacy-policy)

© 2025 Vercel, Inc.