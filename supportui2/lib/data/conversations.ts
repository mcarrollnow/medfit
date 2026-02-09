import { getSupabaseBrowserClient } from "@/lib/supabase/client"

export async function getConversations() {
  const supabase = getSupabaseBrowserClient()

  const { data: conversations, error } = await supabase
    .from("conversations")
    .select(`
      *,
      customer:customers(name, email)
    `)
    .order("updated_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching conversations:", error)
    return []
  }

  return conversations || []
}

export async function searchConversations(query: string) {
  const supabase = getSupabaseBrowserClient()

  const { data: conversations, error } = await supabase
    .from("conversations")
    .select(`
      *,
      customer:customers(name, email)
    `)
    .or(`title.ilike.%${query}%,preview.ilike.%${query}%`)
    .order("updated_at", { ascending: false })
    .limit(20)

  if (error) {
    console.error("[v0] Error searching conversations:", error)
    return []
  }

  return conversations || []
}
