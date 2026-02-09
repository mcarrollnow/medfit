"use client"

import { WorkpanelLayout } from "@/components/workpanel-layout"
import { ConversationSidebar, type Conversation, type ConversationCategory } from "@/components/conversation-sidebar"
import { ChatInterface } from "@/components/chat-interface"
import { PriceResearchTools } from "@/components/price-research-tools"
import { PeptideResearchTools } from "@/components/peptide-research-tools"
import { NewSessionDialog } from "@/components/new-session-dialog"
import { getSessions } from "@/lib/supabase"
import { useState, useEffect } from "react"

export default function Home() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConversationId, setActiveConversationId] = useState<string | undefined>(undefined)
  const [activeCategory, setActiveCategory] = useState<ConversationCategory>("peptide-research")
  const [newSessionDialogOpen, setNewSessionDialogOpen] = useState(false)
  const [newSessionCategory, setNewSessionCategory] = useState<ConversationCategory>("peptide-research")

  const loadSessions = async () => {
    try {
      const sessions = await getSessions()
      const mappedConversations: Conversation[] = sessions.map((session) => ({
        id: session.id,
        title: session.title,
        subtitle: session.subtitle,
        instructions: session.instructions,
        category: session.category,
        timestamp: new Date(session.created_at),
        archived: session.archived,
      }))
      setConversations(mappedConversations)
    } catch (error) {
      console.error("Failed to load sessions:", error)
      // If Supabase is not configured, show a helpful message
      console.log(
        "To enable session persistence, add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your environment variables.",
      )
    }
  }

  useEffect(() => {
    loadSessions()
  }, [])

  const handleNewConversation = (category: ConversationCategory) => {
    setNewSessionCategory(category)
    setNewSessionDialogOpen(true)
  }

  const handleSessionCreated = (sessionId: string) => {
    loadSessions()
    setActiveConversationId(sessionId)
  }

  return (
    <>
      <WorkpanelLayout
        leftSidebar={
          <ConversationSidebar
            conversations={conversations}
            activeConversationId={activeConversationId}
            onSelectConversation={setActiveConversationId}
            onNewConversation={handleNewConversation}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            onUpdateConversations={loadSessions}
          />
        }
        rightSidebar={activeCategory === "price-research" ? <PriceResearchTools /> : <PeptideResearchTools />}
      >
        <ChatInterface conversationId={activeConversationId} category={activeCategory} />
      </WorkpanelLayout>

      <NewSessionDialog
        open={newSessionDialogOpen}
        onOpenChange={setNewSessionDialogOpen}
        category={newSessionCategory}
        onSessionCreated={handleSessionCreated}
      />
    </>
  )
}
