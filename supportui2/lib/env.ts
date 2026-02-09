// Environment variable validation
export const env = {
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  },
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY!,
  },
}

// Validate required environment variables
if (!env.supabase.url || !env.supabase.anonKey) {
  throw new Error("Missing required Supabase environment variables")
}

if (!env.anthropic.apiKey) {
  throw new Error("Missing required Anthropic API key")
}
