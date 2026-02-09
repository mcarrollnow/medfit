AI SDK 5 is available now.










Menu











































































































































































































































































































































































































AI SDK 5.0 introduces changes to the message structure and persistence patterns. Unlike code migrations that can often be automated with codemods, data migration depends on your specific persistence approach, database schema, and application requirements.

**This guide helps you get your application working with AI SDK 5.0 first** using a runtime conversion layer. This allows you to update your app immediately without database migrations blocking you. You can then migrate your data schema at your own pace.

## [Recommended Migration Process](#recommended-migration-process)

Follow this two-phase approach for a safe migration:

### [Phase 1: Get Your App Working (Runtime Conversion)](#phase-1-get-your-app-working-runtime-conversion)

**Goal:** Update your application to AI SDK 5.0 without touching your database.

1.  Update dependencies (install v4 types alongside v5)
2.  Add conversion functions to transform between v4 and v5 message formats
3.  Update data fetching logic to convert messages when reading from the database
4.  Update the rest of your application code to AI SDK 5.0 (see the [main migration guide](migration-guide-5-0.html))

Your database schema remains unchanged during Phase 1. You're only adding a conversion layer that transforms messages at runtime.

**Timeline:** Can be completed in hours or days.

### [Phase 2: Migrate to V5 Schema (Recommended)](#phase-2-migrate-to-v5-schema-recommended)

**Goal:** Migrate your data to a v5-compatible schema, eliminating the runtime conversion overhead.

While Phase 1 gets you working immediately, migrate your schema soon after completing Phase 1. This phase uses a side-by-side migration approach with an equivalent v5 schema:

1.  Create `messages_v5` table alongside existing `messages` table
2.  Start dual-writing to both tables (with conversion)
3.  Run a background migration to convert existing messages
4.  Switch reads to the v5 schema
5.  Remove conversion from your route handlers
6.  Remove dual-write (write only to v5)
7.  Drop old tables

**Timeline:** Do this soon after Phase 1.

**Why this matters:**

- Removes runtime conversion overhead
- Eliminates technical debt early
- Type safety with v5 message format
- Easier to maintain and extend

## [Understanding the Changes](#understanding-the-changes)

Before starting, understand the main persistence-related changes in AI SDK 5.0:

**AI SDK 4.0:**

- `content` field for text
- `reasoning` as a top-level property
- `toolInvocations` as a top-level property
- `parts` (optional) ordered array

**AI SDK 5.0:**

- `parts` array is the single source of truth
- `content` is removed (deprecated) and accessed via a `text` part
- `reasoning` is removed and replaced with a `reasoning` part
- `toolInvocations` is removed and replaced with `tool-$` parts with `input`/`output` (renamed from `args`/`result`)
- `data` role removed (use data parts instead)

## [Phase 1: Runtime Conversion Pattern](#phase-1-runtime-conversion-pattern)

This creates a conversion layer without making changes to your database schema.

### [Step 1: Update Dependencies](#step-1-update-dependencies)

To get proper TypeScript types for your v4 messages, install the v4 package alongside v5 using npm aliases:












``` json
}
```


Run:



``` bash
pnpm install
```


Import v4 types for proper type safety:



``` tsx
import type  from 'ai-legacy';import type  from 'ai';
```


### [Step 2: Add Conversion Functions](#step-2-add-conversion-functions)

Create type guards to detect which message format you're working with, and build a conversion function that handles all v4 message types:



``` tsx
import type  from 'ai-legacy';import type  from 'ai';
export type MyUIMessage = UIMessage<unknown, , UITools>;
type V4Part = NonNullable<V4Message['parts']>[number];type V5Part = MyUIMessage['parts'][number];
// Type definitions for V4 partstype V4ToolInvocationPart = Extract<V4Part, >;
type V4ReasoningPart = Extract<V4Part, >;
type V4SourcePart = Extract<V4Part, >;
type V4FilePart = Extract<V4Part, >;
// Type guardsfunction isV4Message(msg: V4Message | MyUIMessage): msg is V4Message 
function isV4ToolInvocationPart(part: unknown): part is V4ToolInvocationPart 
function isV4ReasoningPart(part: unknown): part is V4ReasoningPart 
function isV4SourcePart(part: unknown): part is V4SourcePart 
function isV4FilePart(part: unknown): part is V4FilePart 
// State mappingconst V4_TO_V5_STATE_MAP =  as const;
function convertToolInvocationState(  v4State: ToolInvocation['state'],): 'input-streaming' | 'input-available' | 'output-available' 
// Tool conversionfunction convertV4ToolInvocationToV5ToolUIPart(  toolInvocation: ToolInvocation,): ToolUIPart `,    toolCallId: toolInvocation.toolCallId,    input: toolInvocation.args,    output:      toolInvocation.state === 'result' ? toolInvocation.result : undefined,    state: convertToolInvocationState(toolInvocation.state),  };}
// Part convertersfunction convertV4ToolInvocationPart(part: V4ToolInvocationPart): V5Part 
function convertV4ReasoningPart(part: V4ReasoningPart): V5Part ;}
function convertV4SourcePart(part: V4SourcePart): V5Part ;}
function convertV4FilePart(part: V4FilePart): V5Part ;}
function convertPart(part: V4Part | V5Part): V5Part   if (isV4ReasoningPart(part))   if (isV4SourcePart(part))   if (isV4FilePart(part))   // Already V5 format  return part;}
// Message conversionfunction createBaseMessage(  msg: V4Message | MyUIMessage,  index: number,): Pick<MyUIMessage, 'id' | 'role'> `,    role: msg.role === 'data' ? 'assistant' : msg.role,  };}
function convertDataMessage(msg: V4Message, index: number): MyUIMessage ,    ],  };}
function buildPartsFromTopLevelFields(msg: V4Message): MyUIMessage['parts'] );  }
  if (msg.toolInvocations) 
  if (msg.content && typeof msg.content === 'string') );  }
  return parts;}
function convertPartsArray(parts: V4Part[]): MyUIMessage['parts'] 
export function convertV4MessageToV5(  msg: V4Message | MyUIMessage,  index: number,): MyUIMessage 
  if (msg.role === 'data') 
  const base = createBaseMessage(msg, index);  const parts = msg.parts    ? convertPartsArray(msg.parts)    : buildPartsFromTopLevelFields(msg);
  return ;}
// V5 to V4 conversionfunction convertV5ToolUIPartToV4ToolInvocation(  part: ToolUIPart,): ToolInvocation ;
  if (state === 'result' && part.output !== undefined) ;  }
  return base as ToolInvocation;}
export function convertV5MessageToV4(msg: MyUIMessage): LegacyUIMessage ;
  let textContent = '';  let reasoning: string | undefined;  const toolInvocations: ToolInvocation[] = [];
  if (textContent) 
  if (reasoning) 
  if (toolInvocations.length > 0) 
  if (parts.length > 0)   return base;}
```


### [Step 3: Convert Messages When Reading](#step-3-convert-messages-when-reading)

Apply the conversion when loading messages from your database:








``` tsx
import  from './conversion';
export async function loadChat(chatId: string): Promise<MyUIMessage[]> 
```


### [Step 4: Convert Messages When Saving](#step-4-convert-messages-when-saving)

In Phase 1, your application runs on v5 but your database stores v4 format. Convert messages inline in your route handlers before passing them to your database functions:



``` tsx
import  from '@ai-sdk/openai';import  from './conversion';import  from './db/actions';import  from 'ai';
export async function POST(req: Request) :  =    await req.json();
  // Convert and save incoming user message (v5 to v4 inline)  await upsertMessage();
  // Load previous messages (already in v5 format)  const previousMessages = await loadChat(chatId);  const messages = [...previousMessages, message];
  const result = streamText(,  });
  return result.toUIMessageStreamResponse() => );    },  });}
```


Keep your `upsertMessage` (or equivalent) function unchanged to continue working with v4 messages.

With Steps 3 and 4 complete, you have a bidirectional conversion layer:

- **Reading:** v4 (database) → v5 (application)
- **Writing:** v5 (application) → v4 (database)

Your database schema remains unchanged, but your application now works with v5 format.

**What's next:** Follow the main migration guide to update the rest of your application code to AI SDK 5.0, including API routes, components, and other code that uses the AI SDK. Then proceed to Phase 2.

See the [main migration guide](migration-guide-5-0.html) for details.

## [Phase 2: Side-by-Side Schema Migration](#phase-2-side-by-side-schema-migration)

Now that your application is updated to AI SDK 5.0 and working with the runtime conversion layer from Phase 1, you have a fully functional system. However, **the conversion functions are only a temporary solution**. Your database still stores messages in the v4 format, which means:

- Every read operation requires runtime conversion overhead
- You maintain backward compatibility code indefinitely
- Future features require working with the legacy schema

**Phase 2 migrates your message history to the v5 schema**, eliminating the conversion layer and enabling better performance and long-term maintainability.

This phase uses a simplified approach: create a new `messages_v5` table with the same structure as your current `messages` table, but storing v5-formatted message parts.




**Adapt phase 2 examples to your setup**

These code examples demonstrate migration patterns. Your implementation will differ based on your database (Postgres, MySQL, SQLite), ORM (Drizzle, Prisma, raw SQL), schema design, and data persistence patterns.

Use these examples as a guide, then adapt them to your specific setup.



### [Overview: Migration Strategy](#overview-migration-strategy)

1.  **Create `messages_v5` table** alongside existing `messages` table
2.  **Dual-write** new messages to both schemas (with conversion)
3.  **Background migration** to convert existing messages
4.  **Verify** data integrity
5.  **Update read functions** to use `messages_v5` schema
6.  **Remove conversion** from route handlers
7.  **Remove dual-write** (write only to `messages_v5`)
8.  **Clean up** old tables

This ensures your application keeps running throughout the migration with no data loss risk.

### [Step 1: Create V5 Schema Alongside V4](#step-1-create-v5-schema-alongside-v4)

Create a new `messages_v5` table with the same structure as your existing table, but designed to store v5 message parts:

**Existing v4 Schema (keep running):**



``` typescript
import  from 'ai-legacy';
export const messages = pgTable('messages', )    .notNull(),  createdAt: timestamp().defaultNow().notNull(),  parts: jsonb().$type<UIMessage['parts']>().notNull(),  role: text().$type<UIMessage['role']>().notNull(),});
```


**New v5 Schema (create alongside):**



``` typescript
import  from './conversion';
export const messages_v5 = pgTable('messages_v5', )    .notNull(),  createdAt: timestamp().defaultNow().notNull(),  parts: jsonb().$type<MyUIMessage['parts']>().notNull(),  role: text().$type<MyUIMessage['role']>().notNull(),});
```


Run your migration to create the new table:



``` bash
pnpm drizzle-kit generatepnpm drizzle-kit migrate
```


### [Step 2: Implement Dual-Write for New Messages](#step-2-implement-dual-write-for-new-messages)

Update your save functions to write to both schemas during the migration period. This ensures new messages are available in both formats:



``` typescript
import  from './conversion';import  from './schema';import type  from 'ai-legacy';
export const upsertMessage = async (: ) => )      .onConflictDoUpdate(,      })      .returning();
    // Convert and write to v5 schema (new)    const v5Message = convertV4MessageToV5(      ,      0,    );
    await tx      .insert(messages_v5)      .values()      .onConflictDoUpdate(,      });
    return result;  });};
```


### [Step 3: Migrate Existing Messages](#step-3-migrate-existing-messages)

Create a script to migrate existing messages from v4 to v5 schema:



``` typescript
import  from './conversion';import  from './db';import  from './db/schema';
async function migrateExistingMessages() ).from(messages_v5);
  const migratedIdSet = new Set(migratedIds.map(m => m.id));
  const allMessages = await db.select().from(messages);  const unmigrated = allMessages.filter(msg => !migratedIdSet.has(msg.id));
  console.log(`Found $ messages to migrate`);
  let migrated = 0;  let errors = 0;  const batchSize = 100;
  for (let i = 0; i < unmigrated.length; i += batchSize) ,            0,          );
          // Insert into v5 messages table          await tx.insert(messages_v5).values();
          migrated++;        } catch (error) :`, error);          errors++;        }      }    });
    console.log(`Progress: $/$ messages migrated`);  }
  console.log(`Migration complete: $ migrated, $ errors`);}
// Run migrationmigrateExistingMessages().catch(console.error);
```


This script:

- Only migrates messages that haven't been migrated yet
- Uses batching for better performance
- Can be run multiple times safely
- Can be stopped and resumed

### [Step 4: Verify Migration](#step-4-verify-migration)

Create a verification script to ensure data integrity:



``` typescript
import  from 'drizzle-orm';import  from './db';import  from './db/schema';
async function verifyMigration() ).from(messages);  const v5Count = await db.select().from(messages_v5);
  console.log('Migration Status:');  console.log(`V4 Messages: $`);  console.log(`V5 Messages: $`);  console.log(    `Migration progress: $%`,  );}
verifyMigration().catch(console.error);
```


### [Step 5: Read from V5 Schema](#step-5-read-from-v5-schema)

Once migration is complete, update your read functions to use the new v5 schema. Since the data is now in v5 format, you don't need conversion:



``` typescript
import type  from './conversion';
export const loadChat = async (chatId: string): Promise<MyUIMessage[]> => ;
```


### [Step 6: Write to V5 Schema Only](#step-6-write-to-v5-schema-only)

Once your read functions work with v5 and your background migration is complete, stop dual-writing and only write to v5:



``` typescript
import type  from './conversion';
export const upsertMessage = async (: ) => )    .onConflictDoUpdate(,    })    .returning();
  return result;};
```


Update your route handler to pass v5 messages directly:



``` tsx
export async function POST(req: Request) :  =    await req.json();
  // Pass v5 message directly - no conversion needed  await upsertMessage();
  const previousMessages = await loadChat(chatId);  const messages = [...previousMessages, message];
  const result = streamText(,  });
  return result.toUIMessageStreamResponse() => );    },  });}
```


### [Step 7: Complete the Switch](#step-7-complete-the-switch)

Once verification passes and you're confident in the migration:

1.  **Remove conversion functions**: Delete the v4↔v5 conversion utilities
2.  **Remove `ai-legacy` dependency**: Uninstall the v4 types package
3.  **Test thoroughly**: Ensure your application works correctly with v5 schema
4.  **Monitor**: Watch for issues in production
5.  **Clean up**: After a safe period (1-2 weeks), drop the old table



``` sql
-- After confirming everything worksDROP TABLE messages;
-- Optionally rename v5 table to standard nameALTER TABLE messages_v5 RENAME TO messages;
```


**Phase 2 is now complete.** Your application is fully migrated to v5 schema with no runtime conversion overhead.

## [Community Resources](#community-resources)

The following community members have shared their migration experiences:


For more API change details, see the [main migration guide](migration-guide-5-0.html).
















On this page












































































Vercel delivers the infrastructure and developer experience you need to ship reliable AI-powered applications at scale.

Trusted by industry leaders:















#### Resources




#### More




#### About Vercel




#### Legal







© 2025 Vercel, Inc.