Chatbot: Task

[](https://vercel.com/)

[

AI SDK



](../../index.html)

-   [Docs](../../docs/introduction.html)
-   [Cookbook](../../cookbook.html)
-   [Providers](../../providers/ai-sdk-providers.html)
-   [Playground](../../playground.html)
-   [
    
    AI ElementsAI Elements
    
    ](../overview.html)
-   [AI GatewayGateway](https://vercel.com/ai-gateway)

AI SDK 5 is available now.

[View Announcement](https://vercel.com/blog/ai-sdk-5)

Menu

[Introduction](../overview.html)

[Setup](../overview/setup.html)

[Usage](../overview/usage.html)

[Troubleshooting](../overview/troubleshooting.html)

[Examples](../examples.html)

[Chatbot](../examples/chatbot.html)

[v0 clone](../examples/v0.html)

[Workflow](../examples/workflow.html)

[Components](../components.html)

[Chatbot](chatbot.html)

[Actions](actions.html)

[Branch](branch.html)

[Chain of Thought](chain-of-thought.html)

[Code Block](code-block.html)

[Context](context.html)

[Conversation](conversation.html)

[Image](image.html)

[Inline Citation](inline-citation.html)

[Loader](loader.html)

[Message](message.html)

[Open In Chat](open-in-chat.html)

[Plan](plan.html)

[Prompt Input](prompt-input.html)

[Queue](queue.html)

[Reasoning](reasoning.html)

[Response](response.html)

[Shimmer](shimmer.html)

[Sources](sources.html)

[Suggestion](suggestion.html)

[Task](task.html)

[Tool](tool.html)

[Workflow](workflow.html)

[Canvas](canvas.html)

[Connection](connection.html)

[Controls](controls.html)

[Edge](edge.html)

[Node](node.html)

[Panel](panel.html)

[Toolbar](toolbar.html)

[Vibe Coding](vibe-coding.html)

[Artifact](artifact.html)

[Web Preview](web-preview.html)

[Components](../components.html)Task

# [Task](#task)

The `Task` component provides a structured way to display task lists or workflow progress with collapsible details, status indicators, and progress tracking. It consists of a main `Task` container with `TaskTrigger` for the clickable header and `TaskContent` for the collapsible content area.

CodePreview

Found project files

Searching "app/page.tsx, components structure"

Read

Reactpage.tsx

Scanning 52 files

Scanning 2 files

Reading files

Reactlayout.tsx

## [Installation](#installation)

ai-elementsshadcnManual

npx ai-elements@latest add task

## [Usage](#usage)

```tsx
import {
  Task,
  TaskContent,
  TaskItem,
  TaskItemFile,
  TaskTrigger,
} from '@/components/ai-elements/task';
```

```tsx
<Task className="w-full">
  <TaskTrigger title="Found project files" />
  <TaskContent>
    <TaskItem>
      Read <TaskItemFile>index.md</TaskItemFile>
    </TaskItem>
  </TaskContent>
</Task>
```

## [Usage with AI SDK](#usage-with-ai-sdk)

Build a mock async programming agent using [`experimental_generateObject`](../../docs/reference/ai-sdk-ui/use-object.html).

Add the following component to your frontend:

```tsx
'use client';


import { experimental_useObject as useObject } from '@ai-sdk/react';
import {
  Task,
  TaskItem,
  TaskItemFile,
  TaskTrigger,
  TaskContent,
} from '@/components/ai-elements/task';
import { Button } from '@/components/ui/button';
import { tasksSchema } from '@/app/api/task/route';
import {
  SiReact,
  SiTypescript,
  SiJavascript,
  SiCss,
  SiHtml5,
  SiJson,
  SiMarkdown,
} from '@icons-pack/react-simple-icons';


const iconMap = {
  react: { component: SiReact, color: '#149ECA' },
  typescript: { component: SiTypescript, color: '#3178C6' },
  javascript: { component: SiJavascript, color: '#F7DF1E' },
  css: { component: SiCss, color: '#1572B6' },
  html: { component: SiHtml5, color: '#E34F26' },
  json: { component: SiJson, color: '#000000' },
  markdown: { component: SiMarkdown, color: '#000000' },
};


const TaskDemo = () => {
  const { object, submit, isLoading } = useObject({
    api: '/api/agent',
    schema: tasksSchema,
  });


  const handleSubmit = (taskType: string) => {
    submit({ prompt: taskType });
  };


  const renderTaskItem = (item: any, index: number) => {
    if (item?.type === 'file' && item.file) {
      const iconInfo = iconMap[item.file.icon as keyof typeof iconMap];
      if (iconInfo) {
        const IconComponent = iconInfo.component;
        return (
          <span className="inline-flex items-center gap-1" key={index}>
            {item.text}
            <TaskItemFile>
              <IconComponent
                color={item.file.color || iconInfo.color}
                className="size-4"
              />
              <span>{item.file.name}</span>
            </TaskItemFile>
          </span>
        );
      }
    }
    return item?.text || '';
  };


  return (
    <div className="max-w-4xl mx-auto p-6 relative size-full rounded-lg border h-[600px]">
      <div className="flex flex-col h-full">
        <div className="flex gap-2 mb-6 flex-wrap">
          <Button
            onClick={() => handleSubmit('React component development')}
            disabled={isLoading}
            variant="outline"
          >
            React Development
          </Button>
        </div>


        <div className="flex-1 overflow-auto space-y-4">
          {isLoading && !object && (
            <div className="text-muted-foreground">Generating tasks...</div>
          )}


          {object?.tasks?.map((task: any, taskIndex: number) => (
            <Task key={taskIndex} defaultOpen={taskIndex === 0}>
              <TaskTrigger title={task.title || 'Loading...'} />
              <TaskContent>
                {task.items?.map((item: any, itemIndex: number) => (
                  <TaskItem key={itemIndex}>
                    {renderTaskItem(item, itemIndex)}
                  </TaskItem>
                ))}
              </TaskContent>
            </Task>
          ))}
        </div>
      </div>
    </div>
  );
};


export default TaskDemo;
```

Add the following route to your backend:

```ts
import { streamObject } from 'ai';
import { z } from 'zod';


export const taskItemSchema = z.object({
  type: z.enum(['text', 'file']),
  text: z.string(),
  file: z
    .object({
      name: z.string(),
      icon: z.string(),
      color: z.string().optional(),
    })
    .optional(),
});


export const taskSchema = z.object({
  title: z.string(),
  items: z.array(taskItemSchema),
  status: z.enum(['pending', 'in_progress', 'completed']),
});


export const tasksSchema = z.object({
  tasks: z.array(taskSchema),
});


// Allow streaming responses up to 30 seconds
export const maxDuration = 30;


export async function POST(req: Request) {
  const { prompt } = await req.json();


  const result = streamObject({
    model: 'openai/gpt-4o',
    schema: tasksSchema,
    prompt: `You are an AI assistant that generates realistic development task workflows. Generate a set of tasks that would occur during ${prompt}.


    Each task should have:
    - A descriptive title
    - Multiple task items showing the progression
    - Some items should be plain text, others should reference files
    - Use realistic file names and appropriate file types
    - Status should progress from pending to in_progress to completed


    For file items, use these icon types: 'react', 'typescript', 'javascript', 'css', 'html', 'json', 'markdown'


    Generate 3-4 tasks total, with 4-6 items each.`,
  });


  return result.toTextStreamResponse();
}
```

## [Features](#features)

-   Visual icons for pending, in-progress, completed, and error states
-   Expandable content for task descriptions and additional information
-   Built-in progress counter showing completed vs total tasks
-   Optional progressive reveal of tasks with customizable timing
-   Support for custom content within task items
-   Full type safety with proper TypeScript definitions
-   Keyboard navigation and screen reader support

## [Props](#props)

### [`<Task />`](#task-)

### \[...props\]?:

React.ComponentProps<typeof Collapsible>

Any other props are spread to the root Collapsible component.

### [`<TaskTrigger />`](#tasktrigger-)

### title:

string

The title of the task that will be displayed in the trigger.

### \[...props\]?:

React.ComponentProps<typeof CollapsibleTrigger>

Any other props are spread to the CollapsibleTrigger component.

### [`<TaskContent />`](#taskcontent-)

### \[...props\]?:

React.ComponentProps<typeof CollapsibleContent>

Any other props are spread to the CollapsibleContent component.

### [`<TaskItem />`](#taskitem-)

### \[...props\]?:

React.ComponentProps<"div">

Any other props are spread to the underlying div.

### [`<TaskItemFile />`](#taskitemfile-)

### \[...props\]?:

React.ComponentProps<"div">

Any other props are spread to the underlying div.

[Previous

Suggestion

](suggestion.html)

[Next

Tool

](tool.html)

On this page

[Task](#task)

[Installation](#installation)

[Usage](#usage)

[Usage with AI SDK](#usage-with-ai-sdk)

[Features](#features)

[Props](#props)

[<Task />](#task-)

[<TaskTrigger />](#tasktrigger-)

[<TaskContent />](#taskcontent-)

[<TaskItem />](#taskitem-)

[<TaskItemFile />](#taskitemfile-)

Deploy and Scale AI Apps with Vercel.

Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:

-   OpenAI
-   Photoroom
-   ![leonardo-ai Logo](../../_next/logo-leonardo-ai-light.svg)![leonardo-ai Logo](../../_next/logo-leonardo-ai-dark.svg)
-   ![zapier Logo](../../_next/logo-zapier-light.svg)![zapier Logo](../../_next/logo-zapier-dark.svg)

[](https://vercel.com/contact/sales?utm_source=ai_sdk&utm_medium=web&utm_campaign=contact_sales_cta&utm_content=talk_to_an_expert_sdk_docs)

#### Resources

[Docs](../../docs/introduction.html)[Cookbook](../../cookbook.html)[Providers](../../providers/ai-sdk-providers.html)[Showcase](../../showcase.html)[GitHub](https://github.com/vercel/ai)[Discussions](https://github.com/vercel/ai/discussions)

#### More

[Playground](../../playground.html)[](https://v0.dev)[Contact Sales](https://vercel.com/contact/sales)

#### About Vercel

[Next.js + Vercel](https://vercel.com/frameworks/nextjs)[Open Source Software](https://vercel.com/oss)[GitHub](https://github.com/vercel)[X](https://x.com/vercel)

#### Legal

[Privacy Policy](https://vercel.com/legal/privacy-policy)

© 2025 Vercel, Inc.