# AI SDK Documentation

Complete offline documentation for the **AI SDK** - The TypeScript toolkit for building AI-powered applications, from the creators of Next.js.

## 📚 What's Inside

This repository contains **437 markdown files** with complete, offline-accessible documentation for the AI SDK, including:

- Complete API reference
- Step-by-step guides and tutorials
- Cookbook with practical examples
- Provider integrations (OpenAI, Anthropic, Google, etc.)
- Code examples and best practices
- Images and assets

## 🗂️ Directory Structure

```
aisdk-docs-clean/
├── README.md                    # This file
├── NAVIGATION.md               # Quick navigation guide
├── QUICK_START.md              # Get started in 5 minutes
├── llms.txt                    # Complete docs in one file (1.2MB, 37K+ lines)
│
├── index.md                    # Homepage
├── getting-started.md          # Getting started guide
├── cookbook.md                 # Cookbook landing page
├── showcase.md                 # Example projects
│
├── docs/                       # Main documentation (189 files)
│   ├── introduction.md
│   ├── getting-started/        # Installation & setup
│   ├── foundations/            # Core concepts
│   ├── ai-sdk-core/            # Core SDK features
│   ├── ai-sdk-ui/              # UI components & hooks
│   ├── ai-sdk-rsc/             # React Server Components
│   ├── agents/                 # Building AI agents
│   ├── advanced/               # Advanced topics
│   ├── reference/              # Complete API reference
│   ├── troubleshooting/        # Common issues & solutions
│   └── migration-guides/       # Version migration
│
├── cookbook/                   # Practical examples (99 files)
│   ├── next/                   # Next.js examples
│   ├── api-servers/            # API server examples
│   ├── guides/                 # Step-by-step guides
│   ├── rsc/                    # React Server Components
│   └── node/                   # Node.js examples
│
├── providers/                  # Provider integrations (101 files)
│   ├── ai-sdk-providers/       # Official providers
│   ├── openai-compatible-providers/  # OpenAI-compatible
│   ├── community-providers/    # Community integrations
│   ├── observability/          # Monitoring & logging
│   └── adapters/               # LangChain, LlamaIndex
│
├── elements/                   # UI Elements (48 files)
│   ├── components/             # Pre-built components
│   ├── examples/               # Usage examples
│   └── overview/               # Setup & usage guides
│
├── images/                     # Documentation images
└── assets/                     # Static assets (CSS, JS, fonts)
```

## 🚀 Quick Start

### Installation

```bash
npm install ai
```

### Choose a Provider

```bash
# OpenAI
npm install @ai-sdk/openai

# Anthropic (Claude)
npm install @ai-sdk/anthropic

# Google (Gemini)
npm install @ai-sdk/google
```

### Basic Example

```typescript
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

const { text } = await generateText({
  model: openai('gpt-4-turbo'),
  prompt: 'Why is the sky blue?',
});

console.log(text);
```

See [QUICK_START.md](./QUICK_START.md) for more examples!

## 📖 Documentation Formats

### 1. Individual Markdown Files (Recommended)

Browse organized documentation by topic in the `docs/`, `cookbook/`, and `providers/` directories.

**Advantages:**
- Easy navigation
- Better organization
- Editor-friendly
- Version control friendly
- Search with Cmd/Ctrl + P

### 2. Complete Reference (`llms.txt`)

All documentation in a single 1.2MB file (37,414 lines of clean markdown).

**Perfect for:**
- Feeding to AI assistants (optimized for LLMs)
- Full-text search with grep
- Offline reference
- Quick searching

**Example:**
```bash
# Search for a topic
grep -i "streaming" llms.txt

# Search with context
grep -B 5 -A 5 "useChat" llms.txt
```

## 🔍 Finding What You Need

### By Topic

| Topic | Location |
|-------|----------|
| Getting Started | [`docs/getting-started/`](./docs/getting-started/) |
| Text Generation | [`docs/ai-sdk-core/`](./docs/ai-sdk-core/) |
| Chat & UI | [`docs/ai-sdk-ui/`](./docs/ai-sdk-ui/) |
| React Server Components | [`docs/ai-sdk-rsc/`](./docs/ai-sdk-rsc/) |
| Building Agents | [`docs/agents/`](./docs/agents/) |
| API Reference | [`docs/reference/`](./docs/reference/) |
| Examples & Recipes | [`cookbook/`](./cookbook/) |
| Provider Setup | [`providers/`](./providers/) |
| Troubleshooting | [`docs/troubleshooting/`](./docs/troubleshooting/) |

### By Use Case

| Use Case | Guide |
|----------|-------|
| Build a chatbot | [`cookbook/guides/`](./cookbook/guides/) |
| Stream responses | [`docs/ai-sdk-core/`](./docs/ai-sdk-core/) |
| Generate JSON | [`docs/ai-sdk-core/`](./docs/ai-sdk-core/) |
| RAG application | [`cookbook/guides/`](./cookbook/guides/) |
| AI agents | [`docs/agents/`](./docs/agents/) |
| Function calling | [`docs/ai-sdk-core/`](./docs/ai-sdk-core/) |

## 🎯 Key Features

### Multi-Provider Support

Switch between providers with a single line:

```typescript
// OpenAI
const result = await generateText({
  model: openai('gpt-4-turbo'),
  prompt: 'Hello!',
});

// Anthropic
const result = await generateText({
  model: anthropic('claude-3-opus-20240229'),
  prompt: 'Hello!',
});

// Google
const result = await generateText({
  model: google('models/gemini-pro'),
  prompt: 'Hello!',
});
```

**Supported Providers:**
- OpenAI (GPT-4, GPT-3.5)
- Anthropic (Claude 3, Claude 2)
- Google (Gemini Pro, PaLM)
- xAI (Grok)
- Mistral, Cohere, Groq
- [And 30+ more...](./providers/ai-sdk-providers/)

### Streaming Responses

```typescript
import { streamText } from 'ai';

const result = await streamText({
  model: openai('gpt-4-turbo'),
  prompt: 'Write a story',
});

for await (const chunk of result.textStream) {
  process.stdout.write(chunk);
}
```

### React Integration

```typescript
'use client';
import { useChat } from 'ai/react';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <div>
      {messages.map(m => (
        <div key={m.id}>{m.role}: {m.content}</div>
      ))}
      <form onSubmit={handleSubmit}>
        <input value={input} onChange={handleInputChange} />
      </form>
    </div>
  );
}
```

## 📱 Viewing Options

### Option 1: Text Editor

Open in VS Code, Cursor, or any editor:
- Use Cmd/Ctrl + P to quick-search files
- Use Cmd/Ctrl + F to search within files
- Preview markdown with built-in viewers

### Option 2: Markdown Viewer

- **Obsidian** - Great for linked notes
- **Typora** - Clean markdown editor
- **Marked 2** (Mac) - Live preview
- **MarkText** - Cross-platform

### Option 3: Static Site

Serve the docs locally:

```bash
cd aisdk-docs-clean

# Python
python3 -m http.server 8000

# Node.js
npx serve

# Browse to http://localhost:8000
```

### Option 4: Terminal (grep)

```bash
# Find all mentions of a topic
grep -r "streaming" docs/

# Case-insensitive search
grep -ri "anthropic" .

# Search with line numbers
grep -n "useChat" llms.txt
```

## 💡 Common Tasks

### Search for a Specific Function

```bash
grep -r "generateText" docs/reference/
```

### Find Examples

```bash
ls cookbook/
```

### Learn About a Provider

```bash
cat providers/ai-sdk-providers/openai.md
```

### Troubleshoot an Issue

```bash
ls docs/troubleshooting/
```

## 🔗 Related Resources

- **Official Website:** https://sdk.vercel.ai/
- **GitHub:** https://github.com/vercel/ai
- **NPM:** https://www.npmjs.com/package/ai
- **Vercel:** https://vercel.com

## 📊 Documentation Stats

- **Total Files:** 437 markdown files
- **Total Size:** ~15MB (including assets)
- **Markdown Content:** ~5MB
- **Images/Assets:** ~10MB
- **Lines of Documentation:** 37,000+
- **Code Examples:** 500+
- **Provider Integrations:** 40+

## 🆕 Version Information

- **AI SDK Version:** 5.x
- **Documentation Downloaded:** October 19, 2025
- **Last Updated:** Check https://sdk.vercel.ai/ for latest

## ❓ Getting Help

1. **Search this documentation** - Use your editor's search or grep
2. **Check troubleshooting** - See [`docs/troubleshooting/`](./docs/troubleshooting/)
3. **View examples** - Browse [`cookbook/`](./cookbook/)
4. **Official docs** - Visit https://sdk.vercel.ai/
5. **GitHub Issues** - https://github.com/vercel/ai/issues

## 📄 License

This documentation is for the AI SDK project by Vercel.

---

**Happy coding with AI SDK! 🚀**

For a quick navigation guide, see [NAVIGATION.md](./NAVIGATION.md)
For quick start examples, see [QUICK_START.md](./QUICK_START.md)
