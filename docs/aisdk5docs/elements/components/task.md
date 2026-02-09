AI SDK 5 is available now.










Menu


















































































































































































































































# [Task](#task)

The `Task` component provides a structured way to display task lists or workflow progress with collapsible details, status indicators, and progress tracking. It consists of a main `Task` container with `TaskTrigger` for the clickable header and `TaskContent` for the collapsible content area.




Code

Preview










Found project files






Searching "app/page.tsx, components structure"









Scanning 52 files



Scanning 2 files
















## [Installation](#installation)




ai-elements

shadcn

Manual




``` geist-overflow-scroll-y
npx ai-elements@latest add task
```
















## [Usage](#usage)



``` tsx
import  from '@/components/ai-elements/task';
```




``` tsx
```


## [Usage with AI SDK](#usage-with-ai-sdk)

Build a mock async programming agent using [`experimental_generateObject`](../../docs/reference/ai-sdk-ui/use-object.html).

Add the following component to your frontend:












``` tsx
'use client';
import  from '@ai-sdk/react';import  from '@/components/ai-elements/task';import  from '@/components/ui/button';import  from '@/app/api/task/route';import  from '@icons-pack/react-simple-icons';
const iconMap = ,  typescript: ,  javascript: ,  css: ,  html: ,  json: ,  markdown: ,};
const TaskDemo = () =>  = useObject();
  const handleSubmit = (taskType: string) => );  };
  const renderTaskItem = (item: any, index: number) => >                        <TaskItemFile>              <IconComponent                color=                className="size-4"              />              <span></span>            </TaskItemFile>          </span>        );      }    }    return item?.text || '';  };
  return (    <div className="max-w-4xl mx-auto p-6 relative size-full rounded-lg border h-[600px]">      <div className="flex flex-col h-full">        <div className="flex gap-2 mb-6 flex-wrap">          <Button            onClick=            disabled=            variant="outline"          >            React Development          </Button>        </div>
           defaultOpen=>              <TaskTrigger title= />              <TaskContent>                >                                      </TaskItem>                ))}              </TaskContent>            </Task>          ))}        </div>      </div>    </div>  );};
export default TaskDemo;
```


Add the following route to your backend:












``` ts
import  from 'ai';import  from 'zod';
export const taskItemSchema = z.object()    .optional(),});
export const taskSchema = z.object();
export const tasksSchema = z.object();
// Allow streaming responses up to 30 secondsexport const maxDuration = 30;
export async function POST(req: Request)  = await req.json();
  const result = streamObject(.
    Each task should have:    - A descriptive title    - Multiple task items showing the progression    - Some items should be plain text, others should reference files    - Use realistic file names and appropriate file types    - Status should progress from pending to in_progress to completed
    For file items, use these icon types: 'react', 'typescript', 'javascript', 'css', 'html', 'json', 'markdown'
    Generate 3-4 tasks total, with 4-6 items each.`,  });
  return result.toTextStreamResponse();}
```


## [Features](#features)

- Visual icons for pending, in-progress, completed, and error states
- Expandable content for task descriptions and additional information
- Built-in progress counter showing completed vs total tasks
- Optional progressive reveal of tasks with customizable timing
- Support for custom content within task items
- Full type safety with proper TypeScript definitions
- Keyboard navigation and screen reader support

## [Props](#props)

### [`<Task />`](#task-)






### \[...props\]?:


React.ComponentProps\<typeof Collapsible\>




Any other props are spread to the root Collapsible component.






### [`<TaskTrigger />`](#tasktrigger-)






### title:


string




The title of the task that will be displayed in the trigger.





### \[...props\]?:


React.ComponentProps\<typeof CollapsibleTrigger\>




Any other props are spread to the CollapsibleTrigger component.






### [`<TaskContent />`](#taskcontent-)






### \[...props\]?:


React.ComponentProps\<typeof CollapsibleContent\>




Any other props are spread to the CollapsibleContent component.






### [`<TaskItem />`](#taskitem-)






### \[...props\]?:


React.ComponentProps\<"div"\>




Any other props are spread to the underlying div.






### [`<TaskItemFile />`](#taskitemfile-)






### \[...props\]?:


React.ComponentProps\<"div"\>




Any other props are spread to the underlying div.





















On this page













































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.