AI SDK 5 is available now.










Menu






















































































































































































































































































































































# [Workflow Patterns](#workflow-patterns)

Combine the building blocks from the [overview](overview.html) with these patterns to add structure and reliability to your agents:

- [Sequential Processing](#sequential-processing-chains) - Steps executed in order
- [Parallel Processing](#parallel-processing) - Independent tasks run simultaneously
- [Evaluation/Feedback Loops](#evaluator-optimizer) - Results checked and improved iteratively
- [Orchestration](#orchestrator-worker) - Coordinating multiple components
- [Routing](#routing) - Directing work based on context

## [Choose Your Approach](#choose-your-approach)

Consider these key factors:

- **Flexibility vs Control** - How much freedom does the LLM need vs how tightly you must constrain its actions?
- **Error Tolerance** - What are the consequences of mistakes in your use case?
- **Cost Considerations** - More complex systems typically mean more LLM calls and higher costs
- **Maintenance** - Simpler architectures are easier to debug and modify

**Start with the simplest approach that meets your needs**. Add complexity only when required by:

1.  Breaking down tasks into clear steps
2.  Adding tools for specific capabilities
3.  Implementing feedback loops for quality control
4.  Introducing multiple agents for complex workflows

Let's look at examples of these patterns in action.

## [Patterns with Examples](#patterns-with-examples)


## [Sequential Processing (Chains)](#sequential-processing-chains)

The simplest workflow pattern executes steps in a predefined order. Each step's output becomes input for the next step, creating a clear chain of operations. Use this pattern for tasks with well-defined sequences, like content generation pipelines or data transformation processes.



``` ts
import  from 'ai';import  from 'zod';
async function generateMarketingCopy(input: string)  = await generateText(. Focus on benefits and emotional appeal.`,  });
  // Perform quality check on copy  const  = await generateObject(),    prompt: `Evaluate this marketing copy for:    1. Presence of call to action (true/false)    2. Emotional appeal (1-10)    3. Clarity (1-10)
    Copy to evaluate: $`,  });
  // If quality check fails, regenerate with more specific instructions  if (    !qualityMetrics.hasCallToAction ||    qualityMetrics.emotionalAppeal < 7 ||    qualityMetrics.clarity < 7  )  = await generateText(      $      $
      Original copy: $`,    });    return ;  }
  return ;}
```


## [Routing](#routing)

This pattern lets the model decide which path to take through a workflow based on context and intermediate results. The model acts as an intelligent router, directing the flow of execution between different branches of your workflow. Use this when handling varied inputs that require different processing approaches. In the example below, the first LLM call's results determine the second call's model size and system prompt.



``` ts
import  from 'ai';import  from 'zod';
async function handleCustomerQuery(query: string)  = await generateObject(),    prompt: `Classify this customer query:    $
    Determine:    1. Query type (general, refund, or technical)    2. Complexity (simple or complex)    3. Brief reasoning for classification`,  });
  // Route based on classification  // Set model and system prompt based on query type and complexity  const  = await generateText([classification.type],    prompt: query,  });
  return ;}
```


## [Parallel Processing](#parallel-processing)

Break down tasks into independent subtasks that execute simultaneously. This pattern uses parallel execution to improve efficiency while maintaining the benefits of structured workflows. For example, analyze multiple documents or process different aspects of a single input concurrently (like code review).



``` ts
import  from 'ai';import  from 'zod';
// Example: Parallel code review with multiple specialized reviewersasync function parallelCodeReview(code: string) ),        prompt: `Review this code:      $`,      }),
      generateObject(),        prompt: `Review this code:      $`,      }),
      generateObject(),        prompt: `Review this code:      $`,      }),    ]);
  const reviews = [    ,    ,    ,  ];
  // Aggregate results using another model instance  const  = await generateText(`,  });
  return ;}
```


## [Orchestrator-Worker](#orchestrator-worker)

A primary model (orchestrator) coordinates the execution of specialized workers. Each worker optimizes for a specific subtask, while the orchestrator maintains overall context and ensures coherent results. This pattern excels at complex tasks requiring different types of expertise or processing.



``` ts
import  from 'ai';import  from 'zod';
async function implementFeature(featureRequest: string)  = await generateObject(),      ),      estimatedComplexity: z.enum(['low', 'medium', 'high']),    }),    system:      'You are a senior software architect planning feature implementations.',    prompt: `Analyze this feature request and create an implementation plan:    $`,  });
  // Workers: Execute the planned changes  const fileChanges = await Promise.all(    implementationPlan.files.map(async file => [file.changeType];
      const  = await generateObject(),        system: workerSystemPrompt,        prompt: `Implement the changes for $ to support:        $
        Consider the overall feature context:        $`,      });
      return ;    }),  );
  return ;}
```


## [Evaluator-Optimizer](#evaluator-optimizer)

Add quality control to workflows with dedicated evaluation steps that assess intermediate results. Based on the evaluation, the workflow proceeds, retries with adjusted parameters, or takes corrective action. This creates robust workflows capable of self-improvement and error recovery.



``` ts
import  from 'ai';import  from 'zod';
async function translateWithFeedback(text: string, targetLanguage: string)  = await generateText(, preserving tone and cultural nuances:    $`,  });
  currentTranslation = translation;
  // Evaluation-optimization loop  while (iterations < MAX_ITERATIONS)  = await generateObject(),      system: 'You are an expert in evaluating literary translations.',      prompt: `Evaluate this translation:
      Original: $      Translation: $
      Consider:      1. Overall quality      2. Preservation of tone      3. Preservation of nuance      4. Cultural accuracy`,    });
    // Check if quality meets threshold    if (      evaluation.qualityScore >= 8 &&      evaluation.preservesTone &&      evaluation.preservesNuance &&      evaluation.culturallyAccurate    ) 
    // Generate improved translation based on feedback    const  = await generateText(      $
      Original: $      Current Translation: $`,    });
    currentTranslation = improvedTranslation;    iterations++;  }
  return ;}
```

















On this page


































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.