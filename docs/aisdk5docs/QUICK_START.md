# AI SDK - Quick Start Guide

Get started with AI SDK in 5 minutes! This guide shows you the essential patterns you'll use most often.

## 📦 Installation

```bash
npm install ai
```

## 🔑 Choose Your Provider

Pick one (or more) providers:

### OpenAI
```bash
npm install @ai-sdk/openai
```

```typescript
import { openai } from '@ai-sdk/openai';
```

### Anthropic (Claude)
```bash
npm install @ai-sdk/anthropic
```

```typescript
import { anthropic } from '@ai-sdk/anthropic';
```

### Google (Gemini)
```bash
npm install @ai-sdk/google
```

```typescript
import { google } from '@ai-sdk/google';
```

### Other Providers
See [providers/](./providers/ai-sdk-providers/) for 40+ more options.

## 🔐 Environment Variables

Create `.env.local`:

```env
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_GENERATIVE_AI_API_KEY=...
```

## 🎯 Core Examples

### 1. Generate Text (Simplest)

```typescript
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

const { text } = await generateText({
  model: openai('gpt-4-turbo'),
  prompt: 'What is the meaning of life?',
});

console.log(text);
```

### 2. Stream Text (Real-time)

```typescript
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

const result = await streamText({
  model: openai('gpt-4-turbo'),
  prompt: 'Write a short story about a robot',
});

// Print chunks as they arrive
for await (const textPart of result.textStream) {
  process.stdout.write(textPart);
}
```

### 3. Generate JSON (Structured Output)

```typescript
import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

const { object } = await generateObject({
  model: openai('gpt-4-turbo'),
  schema: z.object({
    name: z.string(),
    age: z.number(),
    occupation: z.string(),
  }),
  prompt: 'Generate a fictional character profile',
});

console.log(object);
// { name: "Alice", age: 28, occupation: "Engineer" }
```

### 4. Multi-turn Conversation

```typescript
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

const { text } = await generateText({
  model: openai('gpt-4-turbo'),
  messages: [
    { role: 'user', content: 'Hello!' },
    { role: 'assistant', content: 'Hi! How can I help?' },
    { role: 'user', content: 'Tell me a joke' },
  ],
});

console.log(text);
```

## ⚛️ React Integration

### 5. Chat Interface (useChat)

#### API Route (`app/api/chat/route.ts`)

```typescript
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: openai('gpt-4-turbo'),
    messages,
  });

  return result.toDataStreamResponse();
}
```

#### Chat Component (`app/page.tsx`)

```typescript
'use client';

import { useChat } from 'ai/react';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <div className="flex flex-col h-screen">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map(m => (
          <div key={m.id} className="mb-4">
            <strong>{m.role === 'user' ? 'You' : 'AI'}:</strong>
            <p>{m.content}</p>
          </div>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Type a message..."
          className="w-full p-2 border rounded"
        />
      </form>
    </div>
  );
}
```

### 6. Text Completion (useCompletion)

```typescript
'use client';

import { useCompletion } from 'ai/react';

export default function Completion() {
  const {
    completion,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
  } = useCompletion();

  return (
    <div>
      {/* Show completion as it streams */}
      <div className="whitespace-pre-wrap">{completion}</div>

      {/* Input form */}
      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Enter a prompt..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          Generate
        </button>
      </form>
    </div>
  );
}
```

## 🔧 Advanced Features

### 7. Tool/Function Calling

```typescript
import { generateText, tool } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

const { text, toolCalls } = await generateText({
  model: openai('gpt-4-turbo'),
  tools: {
    weather: tool({
      description: 'Get the weather in a location',
      parameters: z.object({
        location: z.string().describe('The location to get the weather for'),
      }),
      execute: async ({ location }) => {
        // Call your weather API here
        return {
          location,
          temperature: 72,
          condition: 'sunny',
        };
      },
    }),
    calculator: tool({
      description: 'Perform mathematical calculations',
      parameters: z.object({
        operation: z.enum(['add', 'subtract', 'multiply', 'divide']),
        a: z.number(),
        b: z.number(),
      }),
      execute: async ({ operation, a, b }) => {
        const ops = {
          add: a + b,
          subtract: a - b,
          multiply: a * b,
          divide: a / b,
        };
        return { result: ops[operation] };
      },
    }),
  },
  prompt: 'What is the weather in San Francisco? Also, what is 25 * 4?',
});

console.log(text);
console.log(toolCalls);
```

### 8. Embeddings (Vector Search)

```typescript
import { embed, embedMany } from 'ai';
import { openai } from '@ai-sdk/openai';

// Single embedding
const { embedding } = await embed({
  model: openai.embedding('text-embedding-3-small'),
  value: 'sunny day at the beach',
});

console.log(embedding); // [0.1, 0.2, 0.3, ..., 0.9] (1536 dimensions)

// Batch embeddings
const { embeddings } = await embedMany({
  model: openai.embedding('text-embedding-3-small'),
  values: [
    'The cat sat on the mat',
    'A dog played in the park',
    'The weather is nice today',
  ],
});

console.log(embeddings.length); // 3
```

## 🎛️ Configuration Options

### Temperature & Max Tokens

```typescript
const { text } = await generateText({
  model: openai('gpt-4-turbo'),
  prompt: 'Write a creative story',
  temperature: 0.8,  // 0 = deterministic, 2 = very random
  maxTokens: 500,    // Limit output length
  topP: 0.9,         // Nucleus sampling
});
```

### Streaming with Callbacks

```typescript
const result = await streamText({
  model: openai('gpt-4-turbo'),
  prompt: 'Count from 1 to 10',
  onChunk({ chunk }) {
    console.log('New chunk:', chunk);
  },
  onFinish({ text, usage }) {
    console.log('Final text:', text);
    console.log('Tokens used:', usage.totalTokens);
  },
});
```

### Error Handling

```typescript
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

try {
  const { text } = await generateText({
    model: openai('gpt-4-turbo'),
    prompt: 'Hello!',
  });
  console.log(text);
} catch (error) {
  if (error.name === 'AI_APICallError') {
    console.error('API Error:', error.message);
  } else {
    console.error('Unknown error:', error);
  }
}
```

## 🔄 Switching Providers

Switching is as easy as changing one line:

```typescript
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { google } from '@ai-sdk/google';

// OpenAI GPT-4
const gpt4Result = await generateText({
  model: openai('gpt-4-turbo'),
  prompt: 'Hello!',
});

// Anthropic Claude
const claudeResult = await generateText({
  model: anthropic('claude-3-opus-20240229'),
  prompt: 'Hello!',
});

// Google Gemini
const geminiResult = await generateText({
  model: google('models/gemini-pro'),
  prompt: 'Hello!',
});

// xAI Grok
import { xai } from '@ai-sdk/xai';
const grokResult = await generateText({
  model: xai('grok-beta'),
  prompt: 'Hello!',
});
```

## 📚 Next Steps

### Learn More
- [Full Documentation](./README.md) - Complete guide
- [Navigation](./NAVIGATION.md) - Find specific topics
- [API Reference](./docs/reference/) - Detailed API docs

### Build Something
- [Chatbot Tutorial](./cookbook/guides/) - Full chat app
- [RAG Application](./cookbook/guides/) - Retrieval Augmented Generation
- [AI Agent](./docs/agents/) - Autonomous agents
- [Streaming UI](./docs/ai-sdk-rsc/) - Generative UI

### Explore Examples
- [Next.js Examples](./cookbook/next/)
- [Node.js Examples](./cookbook/node/)
- [API Servers](./cookbook/api-servers/)
- [All Recipes](./cookbook/)

### Get Help
- [Troubleshooting](./docs/troubleshooting/) - Common issues
- [Error Reference](./docs/reference/ai-sdk-errors/) - Error messages
- Search [llms.txt](./llms.txt) - Complete documentation

## 🎨 UI Components (AI Elements)

Pre-built components for common AI patterns:

```tsx
import { Chatbot } from '@ai-sdk/elements';

function App() {
  return <Chatbot apiEndpoint="/api/chat" />;
}
```

See [elements/](./elements/) for all components.

## 💡 Tips & Best Practices

1. **Start Simple** - Begin with `generateText()` before streaming
2. **Use TypeScript** - Better autocomplete and type safety
3. **Handle Errors** - Always wrap API calls in try-catch
4. **Env Variables** - Never commit API keys
5. **Stream for UX** - Better experience for long responses
6. **Use Tools** - Function calling is powerful
7. **Test Locally** - Use smaller models during development
8. **Monitor Costs** - Track token usage

## 🚀 Quick Commands

```bash
# Install AI SDK
npm install ai

# Install provider
npm install @ai-sdk/openai

# Install Zod (for structured output)
npm install zod

# Run development server (Next.js)
npm run dev

# Build for production
npm run build
```

## 📖 Cheat Sheet

```typescript
// Generate text
const { text } = await generateText({ model, prompt });

// Stream text
const { textStream } = await streamText({ model, prompt });

// Generate object
const { object } = await generateObject({ model, schema, prompt });

// Embed text
const { embedding } = await embed({ model, value });

// React chat
const { messages, input, handleSubmit } = useChat();

// React completion
const { completion, handleSubmit } = useCompletion();
```

## 🎯 Common Use Cases

| Use Case | Start Here |
|----------|-----------|
| Simple chatbot | [useChat example](#5-chat-interface-usechat) |
| Text generation | [generateText example](#1-generate-text-simplest) |
| Streaming responses | [streamText example](#2-stream-text-real-time) |
| JSON responses | [generateObject example](#3-generate-json-structured-output) |
| Function calling | [Tools example](#7-toolfunction-calling) |
| Embeddings/RAG | [Embeddings example](#8-embeddings-vector-search) |

---

**Ready to build?** Pick an example above and start coding!

**Need more?** Check the [full documentation](./README.md) or [browse examples](./cookbook/)
