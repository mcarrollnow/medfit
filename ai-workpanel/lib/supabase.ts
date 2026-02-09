"use client"

import { createBrowserClient } from "@supabase/ssr"

export type Session = {
  id: string
  title: string
  subtitle?: string
  instructions?: string
  category: "price-research" | "peptide-research"
  archived: boolean
  created_at: string
  updated_at: string
}

export type Message = {
  id: string
  session_id: string
  role: "user" | "assistant" | "system"
  content: string
  created_at: string
}

export type Peptide = {
  id: string
  session_id?: string
  name: string
  sequence: string
  molecular_weight?: number
  length: number
  isoelectric_point?: number
  net_charge?: number
  hydrophobicity?: number
  extinction_coefficient?: number
  description?: string
  pubchem_cid?: string
  smiles?: string
  molecular_formula?: string
  created_at: string
  updated_at: string
}

export type ResearchData = {
  id: string
  session_id: string
  type: "price" | "product" | "peptide-analysis"
  query?: string
  results: any
  created_at: string
}

export type SessionState = {
  id: string
  session_id: string
  state_type: "peptide-builder" | "price-research" | "viewer"
  state_data: any
  updated_at: string
}

// Create a singleton Supabase client
let supabaseClient: ReturnType<typeof createBrowserClient> | null = null

export function getSupabase() {
  if (!supabaseClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error(
        "Missing Supabase environment variables. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your environment.",
      )
    }

    supabaseClient = createBrowserClient(supabaseUrl, supabaseAnonKey)
  }

  return supabaseClient
}

export function createClient() {
  return getSupabase()
}

// Session CRUD operations
export async function createSession(data: {
  title: string
  subtitle?: string
  instructions?: string
  category: "price-research" | "peptide-research"
}) {
  const supabase = getSupabase()
  const { data: session, error } = await supabase.from("research_sessions").insert([data]).select().single()

  if (error) throw error
  return session as Session
}

export async function getSessions(category?: "price-research" | "peptide-research", includeArchived = false) {
  const supabase = getSupabase()
  let query = supabase.from("research_sessions").select("*").order("created_at", { ascending: false })

  if (category) {
    query = query.eq("category", category)
  }

  if (!includeArchived) {
    query = query.eq("archived", false)
  }

  const { data, error } = await query

  if (error) throw error
  return data as Session[]
}

export async function updateSession(id: string, updates: Partial<Session>) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from("research_sessions")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return data as Session
}

export async function deleteSession(id: string) {
  const supabase = getSupabase()
  const { error } = await supabase.from("research_sessions").delete().eq("id", id)

  if (error) throw error
}

export async function archiveSession(id: string) {
  return updateSession(id, { archived: true })
}

// ============================================
// MESSAGE OPERATIONS
// ============================================

export async function saveMessage(data: {
  session_id: string
  role: "user" | "assistant" | "system"
  content: string
}) {
  const supabase = getSupabase()
  const { data: message, error } = await supabase.from("research_messages").insert([data]).select().single()

  if (error) throw error
  return message as Message
}

export async function getMessages(sessionId: string) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from("research_messages")
    .select("*")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true })

  if (error) throw error
  return data as Message[]
}

export async function deleteMessage(id: string) {
  const supabase = getSupabase()
  const { error } = await supabase.from("research_messages").delete().eq("id", id)

  if (error) throw error
}

export async function clearMessages(sessionId: string) {
  const supabase = getSupabase()
  const { error } = await supabase.from("research_messages").delete().eq("session_id", sessionId)

  if (error) throw error
}

// ============================================
// PEPTIDE OPERATIONS
// ============================================

export async function savePeptide(data: {
  session_id?: string
  name: string
  sequence: string
  molecular_weight?: number
  length: number
  isoelectric_point?: number
  net_charge?: number
  hydrophobicity?: number
  extinction_coefficient?: number
  description?: string
  pubchem_cid?: string
  smiles?: string
  molecular_formula?: string
}) {
  const supabase = getSupabase()
  const { data: peptide, error } = await supabase.from("research_peptides").insert([data]).select().single()

  if (error) throw error
  return peptide as Peptide
}

export async function getPeptides(sessionId?: string) {
  const supabase = getSupabase()
  let query = supabase.from("research_peptides").select("*").order("created_at", { ascending: false })

  if (sessionId) {
    query = query.eq("session_id", sessionId)
  }

  const { data, error } = await query

  if (error) throw error
  return data as Peptide[]
}

export async function updatePeptide(id: string, updates: Partial<Peptide>) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from("research_peptides")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return data as Peptide
}

export async function deletePeptide(id: string) {
  const supabase = getSupabase()
  const { error } = await supabase.from("research_peptides").delete().eq("id", id)

  if (error) throw error
}

// ============================================
// RESEARCH DATA OPERATIONS
// ============================================

export async function saveResearchData(data: {
  session_id: string
  type: "price" | "product" | "peptide-analysis"
  query?: string
  results: any
}) {
  const supabase = getSupabase()
  const { data: research, error } = await supabase.from("research_data").insert([data]).select().single()

  if (error) throw error
  return research as ResearchData
}

export async function getResearchData(sessionId: string, type?: "price" | "product" | "peptide-analysis") {
  const supabase = getSupabase()
  let query = supabase
    .from("research_data")
    .select("*")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: false })

  if (type) {
    query = query.eq("type", type)
  }

  const { data, error } = await query

  if (error) throw error
  return data as ResearchData[]
}

export async function deleteResearchData(id: string) {
  const supabase = getSupabase()
  const { error } = await supabase.from("research_data").delete().eq("id", id)

  if (error) throw error
}

// ============================================
// SESSION STATE OPERATIONS
// ============================================

export async function saveSessionState(data: {
  session_id: string
  state_type: "peptide-builder" | "price-research" | "viewer"
  state_data: any
}) {
  const supabase = getSupabase()

  // Upsert to update if exists, insert if not
  const { data: state, error } = await supabase
    .from("research_session_state")
    .upsert([{ ...data, updated_at: new Date().toISOString() }], {
      onConflict: "session_id,state_type",
    })
    .select()
    .single()

  if (error) throw error
  return state as SessionState
}

export async function getSessionState(sessionId: string, stateType?: "peptide-builder" | "price-research" | "viewer") {
  const supabase = getSupabase()
  let query = supabase.from("research_session_state").select("*").eq("session_id", sessionId)

  if (stateType) {
    query = query.eq("state_type", stateType)
  }

  const { data, error } = await query

  if (error) throw error
  return stateType ? (data[0] as SessionState | undefined) : (data as SessionState[])
}

export async function deleteSessionState(id: string) {
  const supabase = getSupabase()
  const { error } = await supabase.from("research_session_state").delete().eq("id", id)

  if (error) throw error
}

// ============================================
// COMPREHENSIVE EXPORT
// ============================================

export async function exportSession(id: string) {
  const supabase = getSupabase()

  // Fetch all data for the session
  const [sessionResult, messagesResult, peptidesResult, researchResult, stateResult] = await Promise.all([
    supabase.from("research_sessions").select("*").eq("id", id).single(),
    supabase.from("research_messages").select("*").eq("session_id", id).order("created_at", { ascending: true }),
    supabase.from("research_peptides").select("*").eq("session_id", id).order("created_at", { ascending: false }),
    supabase.from("research_data").select("*").eq("session_id", id).order("created_at", { ascending: false }),
    supabase.from("research_session_state").select("*").eq("session_id", id),
  ])

  if (sessionResult.error) throw sessionResult.error

  const exportData = {
    // Session metadata
    session: sessionResult.data,

    // Chat history
    chatHistory: {
      messages: messagesResult.data || [],
      totalMessages: messagesResult.data?.length || 0,
    },

    // Peptide library
    peptideLibrary: {
      savedPeptides: peptidesResult.data || [],
      totalPeptides: peptidesResult.data?.length || 0,
    },

    // Research data
    researchData: {
      data: researchResult.data || [],
      totalEntries: researchResult.data?.length || 0,
    },

    // Session state
    sessionState: stateResult.data || [],

    // Export metadata
    exportedAt: new Date().toISOString(),
    version: "2.0",
  }

  // Download as JSON file
  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `session-${sessionResult.data.title.replace(/\s+/g, "-").toLowerCase()}-${Date.now()}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
