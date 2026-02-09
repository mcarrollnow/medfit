# Support UI - Standalone Next.js Application

Customer support interface with AI-powered chat and full database integration.

## Features

- **Admin Support Interface** (`/`) - Desktop and mobile support agent view
- **Customer Support Interface** (`/customer`) - Customer-facing support portal
- **AI Chat with Database Tools**:
  - Order lookup and tracking
  - Product search and inventory
  - SMS notifications
- **Real-time Streaming** with Claude 3.5 Sonnet
- **Dark Mode** support

## Setup

1. **Install dependencies:**
   ```bash
   cd supportui
   pnpm install
   ```

2. **Configure environment variables:**
   Create `.env.local` file:
   ```bash
   cp .env.example .env.local
   ```

   Then edit `.env.local` with your values:
   ```
   ANTHROPIC_API_KEY=sk-ant-...
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=eyJhb...
   ```

3. **Run development server:**
   ```bash
   pnpm dev
   ```

   App will be available at `http://localhost:3000`

4. **Build for production:**
   ```bash
   pnpm build
   pnpm start
   ```

## Routes

- `/` - Admin support interface (responsive desktop/mobile)
- `/customer` - Customer support portal (responsive desktop/mobile)

## Database Access

The AI chat has full database access via Supabase service role key:
- Orders table
- Products table  
- Customers table
- Users table

## API Routes

- `/api/chat` - AI chat with database tools (POST)

## Tech Stack

- **Framework**: Next.js 16
- **AI**: Anthropic Claude 3.5 Sonnet
- **Database**: Supabase (PostgreSQL)
- **UI**: Tailwind CSS + Radix UI
- **Streaming**: Vercel AI SDK

## Deployment

Deploy to Vercel:
```bash
vercel
```

Make sure to set environment variables in Vercel project settings.
