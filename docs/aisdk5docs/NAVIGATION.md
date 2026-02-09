# AI SDK Documentation - Navigation Guide

Quick links to help you find what you need in the AI SDK documentation.

## 🚀 Getting Started

1. [README.md](./README.md) - Start here for an overview
2. [Getting Started](./getting-started.md) - Installation and first steps
3. [Introduction](./docs/introduction.md) - What is AI SDK?
4. [QUICK_START.md](./QUICK_START.md) - 5-minute quick start

## 📖 Core Documentation

### Foundations
- [Models & Providers](./docs/foundations/) - Understanding AI models
- [Prompts](./docs/foundations/) - Writing effective prompts
- [Streaming](./docs/foundations/) - Real-time responses

### AI SDK Core
- [Text Generation](./docs/ai-sdk-core/generating-text.md) - Generate text
- [Streaming Text](./docs/ai-sdk-core/streaming-text.md) - Stream responses
- [Structured Output](./docs/ai-sdk-core/generating-structured-data.md) - JSON responses
- [Tool Calling](./docs/ai-sdk-core/tools-and-tool-calling.md) - Function calling
- [Embeddings](./docs/ai-sdk-core/embeddings.md) - Vector embeddings

### AI SDK UI (React)
- [useChat Hook](./docs/ai-sdk-ui/chatbot.md) - Chat interfaces
- [useCompletion Hook](./docs/ai-sdk-ui/completion.md) - Text completion
- [useObject Hook](./docs/ai-sdk-ui/generating-structured-data.md) - Structured data
- [Streaming Components](./docs/ai-sdk-ui/) - Real-time UI

### AI SDK RSC (React Server Components)
- [Server Components](./docs/ai-sdk-rsc/) - RSC integration
- [Streaming UI](./docs/ai-sdk-rsc/streaming-react-components.md) - Generative UI
- [Server Actions](./docs/ai-sdk-rsc/) - Server-side actions

### Agents
- [Agent Basics](./docs/agents/) - What are agents?
- [Building Agents](./docs/agents/) - Create your first agent
- [Workflow Patterns](./docs/agents/) - Agent patterns

## 🔌 Providers

### Popular Providers
- [OpenAI](./providers/ai-sdk-providers/openai.md) - GPT-4, GPT-3.5
- [Anthropic](./providers/ai-sdk-providers/anthropic.md) - Claude 3
- [Google](./providers/ai-sdk-providers/google-generative-ai.md) - Gemini
- [xAI](./providers/ai-sdk-providers/xai.md) - Grok
- [Mistral](./providers/ai-sdk-providers/mistral.md) - Mistral AI
- [Groq](./providers/ai-sdk-providers/groq.md) - Fast inference

### All Providers
- [All Official Providers](./providers/ai-sdk-providers/) - 40+ providers
- [OpenAI Compatible](./providers/openai-compatible-providers/) - Compatible APIs
- [Community Providers](./providers/community-providers/) - Community integrations
- [Custom Adapters](./providers/adapters/) - LangChain, LlamaIndex

### Observability
- [Monitoring](./providers/observability/) - Track usage
- [Logging](./providers/observability/) - Debug issues

## 👨‍🍳 Cookbook & Examples

### By Framework
- [Next.js Examples](./cookbook/next/) - Next.js integrations
- [Node.js Examples](./cookbook/node/) - Node.js apps
- [API Servers](./cookbook/api-servers/) - REST APIs
- [RSC Examples](./cookbook/rsc/) - React Server Components

### By Use Case
- [RAG Applications](./cookbook/guides/) - Retrieval Augmented Generation
- [Chatbots](./cookbook/guides/) - Building chat interfaces
- [AI Agents](./cookbook/guides/) - Agent workflows
- [Streaming](./cookbook/guides/) - Real-time responses

## 📚 API Reference

### Core Functions
- [`generateText()`](./docs/reference/ai-sdk-core/generate-text.md) - Text generation
- [`streamText()`](./docs/reference/ai-sdk-core/stream-text.md) - Stream text
- [`generateObject()`](./docs/reference/ai-sdk-core/generate-object.md) - Structured output
- [`embed()`](./docs/reference/ai-sdk-core/embed.md) - Create embeddings
- [`embedMany()`](./docs/reference/ai-sdk-core/embed-many.md) - Batch embeddings

### React Hooks
- [`useChat()`](./docs/reference/ai-sdk-ui/use-chat.md) - Chat hook
- [`useCompletion()`](./docs/reference/ai-sdk-ui/use-completion.md) - Completion hook
- [`useObject()`](./docs/reference/ai-sdk-ui/use-object.md) - Object generation

### RSC Functions
- [`streamUI()`](./docs/reference/ai-sdk-rsc/stream-ui.md) - Stream UI components
- [Stream Helpers](./docs/reference/stream-helpers/) - Streaming utilities

### Error Handling
- [Error Types](./docs/reference/ai-sdk-errors/) - Error reference

## 🛠️ Advanced Topics

- [Custom Providers](./docs/advanced/) - Build your own provider
- [Middleware](./docs/advanced/) - Request/response middleware
- [Performance](./docs/advanced/) - Optimization tips
- [Security](./docs/advanced/) - Best practices

## 🔧 Troubleshooting

- [Common Issues](./docs/troubleshooting/) - Frequent problems
- [Debugging Guide](./docs/troubleshooting/) - Debug tips
- [Error Messages](./docs/troubleshooting/) - Error explanations

## 🔄 Migration Guides

- [Upgrading to v5](./docs/migration-guides/) - Latest version
- [v2 to v3](./docs/migration-guides/) - Migration guide
- [Breaking Changes](./docs/migration-guides/) - What changed

## 🎨 UI Elements

- [Components Overview](./elements/overview/) - Available components
- [Chatbot Component](./elements/components/chatbot.md)
- [Workflow Component](./elements/components/workflow.md)
- [All Components](./elements/components/)

## 🔍 Search Tips

### Using Your Editor
```
Cmd/Ctrl + P       Quick open files
Cmd/Ctrl + Shift + F   Search across all files
Cmd/Ctrl + F       Search in current file
```

### Using grep (Terminal)
```bash
# Search for a topic
grep -r "streaming" docs/

# Case-insensitive
grep -ri "anthropic" .

# With context
grep -B 5 -A 5 "useChat" llms.txt

# In specific directory
grep -r "generateText" docs/reference/
```

### Using llms.txt
The `llms.txt` file contains ALL documentation in one searchable file.

```bash
# Search the complete docs
grep -i "your search term" llms.txt

# Count occurrences
grep -c "streaming" llms.txt

# Show line numbers
grep -n "useChat" llms.txt
```

## 💡 Quick Reference

### Installation
```bash
npm install ai @ai-sdk/openai @ai-sdk/anthropic @ai-sdk/google
```

### Basic Usage
```typescript
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

const { text } = await generateText({
  model: openai('gpt-4-turbo'),
  prompt: 'Hello!',
});
```

### Streaming
```typescript
import { streamText } from 'ai';

const result = await streamText({
  model: openai('gpt-4-turbo'),
  prompt: 'Write a story',
});

for await (const chunk of result.textStream) {
  console.log(chunk);
}
```

### React Chat
```typescript
import { useChat } from 'ai/react';

function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  // ... render UI
}
```

## 📁 File Structure

```
aisdk-docs-clean/
├── README.md           # Main documentation
├── NAVIGATION.md       # This file
├── QUICK_START.md      # Quick start guide
├── llms.txt           # Complete docs (37K lines)
│
├── docs/              # Main documentation
│   ├── introduction.md
│   ├── getting-started/
│   ├── foundations/
│   ├── ai-sdk-core/
│   ├── ai-sdk-ui/
│   ├── ai-sdk-rsc/
│   ├── agents/
│   ├── advanced/
│   ├── reference/
│   ├── troubleshooting/
│   └── migration-guides/
│
├── cookbook/          # Examples & recipes
├── providers/         # Provider integrations
├── elements/          # UI components
├── images/           # Images
└── assets/           # Static assets
```

## 📝 Common Workflows

### Learn the Basics
1. Read [README.md](./README.md)
2. Follow [QUICK_START.md](./QUICK_START.md)
3. Check [Introduction](./docs/introduction.md)
4. Try [examples](./cookbook/)

### Build a Chatbot
1. Install: `npm install ai @ai-sdk/openai`
2. Read: [useChat docs](./docs/ai-sdk-ui/chatbot.md)
3. Example: [cookbook/next/](./cookbook/next/)

### Implement RAG
1. Learn: [RAG Guide](./cookbook/guides/)
2. Read: [Embeddings](./docs/ai-sdk-core/embeddings.md)
3. Example: Check cookbook for RAG examples

### Switch Providers
1. Install provider: `npm install @ai-sdk/anthropic`
2. Read: [Provider docs](./providers/ai-sdk-providers/)
3. Update: Change model in code

## 🎯 By Experience Level

### Beginner
- Start with [README.md](./README.md)
- Follow [QUICK_START.md](./QUICK_START.md)
- Try [simple examples](./cookbook/)

### Intermediate
- Explore [AI SDK Core](./docs/ai-sdk-core/)
- Learn [streaming](./docs/ai-sdk-core/streaming-text.md)
- Build [agents](./docs/agents/)

### Advanced
- Custom [providers](./docs/advanced/)
- [Middleware](./docs/advanced/)
- [Performance](./docs/advanced/)

---

**Need help?** Check [Troubleshooting](./docs/troubleshooting/) or search [llms.txt](./llms.txt)
