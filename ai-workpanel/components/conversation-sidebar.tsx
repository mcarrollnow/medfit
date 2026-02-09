"use client"
import { Plus, MessageSquare, DollarSign, Flag as Flask } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { SessionMenu } from "./session-menu"

export type ConversationCategory = "price-research" | "peptide-research"

export type Conversation = {
  id: string
  title: string
  subtitle?: string
  instructions?: string
  category: ConversationCategory
  timestamp: Date
  preview?: string
  archived?: boolean
}

type ConversationSidebarProps = {
  conversations: Conversation[]
  activeConversationId?: string
  onSelectConversation: (id: string) => void
  onNewConversation: (category: ConversationCategory) => void
  activeCategory: ConversationCategory
  onCategoryChange: (category: ConversationCategory) => void
  onUpdateConversations?: () => void
}

export function ConversationSidebar({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  activeCategory,
  onCategoryChange,
  onUpdateConversations,
}: ConversationSidebarProps) {
  const priceConversations = conversations.filter((c) => c.category === "price-research")
  const peptideConversations = conversations.filter((c) => c.category === "peptide-research")

  return (
    <div className="flex h-full flex-col">
      {/* Category Tabs */}
      <div className="border-b border-sidebar-border">
        <div className="flex">
          <button
            onClick={() => onCategoryChange("price-research")}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors",
              activeCategory === "price-research"
                ? "border-sidebar-primary text-sidebar-primary-foreground"
                : "border-transparent text-sidebar-foreground/60 hover:text-sidebar-foreground",
            )}
          >
            <DollarSign className="size-4" />
            Price Research
          </button>
          <button
            onClick={() => onCategoryChange("peptide-research")}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors",
              activeCategory === "peptide-research"
                ? "border-sidebar-primary text-sidebar-primary-foreground"
                : "border-transparent text-sidebar-foreground/60 hover:text-sidebar-foreground",
            )}
          >
            <Flask className="size-4" />
            Peptide Research
          </button>
        </div>
      </div>

      {/* New Conversation Button */}
      <div className="p-3">
        <Button
          onClick={() => onNewConversation(activeCategory)}
          className="w-full justify-start gap-2"
          variant="outline"
        >
          <Plus className="size-4" />
          New {activeCategory === "price-research" ? "Price" : "Peptide"} Session
        </Button>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto px-2">
        {activeCategory === "price-research" && (
          <ConversationList
            conversations={priceConversations}
            activeConversationId={activeConversationId}
            onSelectConversation={onSelectConversation}
            onUpdateConversations={onUpdateConversations}
          />
        )}
        {activeCategory === "peptide-research" && (
          <ConversationList
            conversations={peptideConversations}
            activeConversationId={activeConversationId}
            onSelectConversation={onSelectConversation}
            onUpdateConversations={onUpdateConversations}
          />
        )}
      </div>
    </div>
  )
}

function ConversationList({
  conversations,
  activeConversationId,
  onSelectConversation,
  onUpdateConversations,
}: {
  conversations: Conversation[]
  activeConversationId?: string
  onSelectConversation: (id: string) => void
  onUpdateConversations?: () => void
}) {
  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <MessageSquare className="mb-2 size-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">No conversations yet</p>
        <p className="mt-1 text-xs text-muted-foreground">Start a new session to begin</p>
      </div>
    )
  }

  // Group by date
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const todayConversations = conversations.filter((c) => c.timestamp.toDateString() === today.toDateString())
  const yesterdayConversations = conversations.filter((c) => c.timestamp.toDateString() === yesterday.toDateString())
  const olderConversations = conversations.filter(
    (c) =>
      c.timestamp.toDateString() !== today.toDateString() && c.timestamp.toDateString() !== yesterday.toDateString(),
  )

  return (
    <div className="space-y-4 pb-4">
      {todayConversations.length > 0 && (
        <ConversationGroup
          title="Today"
          conversations={todayConversations}
          activeConversationId={activeConversationId}
          onSelectConversation={onSelectConversation}
          onUpdateConversations={onUpdateConversations}
        />
      )}
      {yesterdayConversations.length > 0 && (
        <ConversationGroup
          title="Yesterday"
          conversations={yesterdayConversations}
          activeConversationId={activeConversationId}
          onSelectConversation={onSelectConversation}
          onUpdateConversations={onUpdateConversations}
        />
      )}
      {olderConversations.length > 0 && (
        <ConversationGroup
          title="Older"
          conversations={olderConversations}
          activeConversationId={activeConversationId}
          onSelectConversation={onSelectConversation}
          onUpdateConversations={onUpdateConversations}
        />
      )}
    </div>
  )
}

function ConversationGroup({
  title,
  conversations,
  activeConversationId,
  onSelectConversation,
  onUpdateConversations,
}: {
  title: string
  conversations: Conversation[]
  activeConversationId?: string
  onSelectConversation: (id: string) => void
  onUpdateConversations?: () => void
}) {
  return (
    <div>
      <h3 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</h3>
      <div className="space-y-1">
        {conversations.map((conversation) => (
          <div key={conversation.id} className="group relative">
            <button
              onClick={() => onSelectConversation(conversation.id)}
              className={cn(
                "w-full rounded-lg px-3 py-2 text-left transition-colors",
                activeConversationId === conversation.id
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50",
              )}
            >
              <div className="flex items-start gap-2">
                <MessageSquare className="mt-0.5 size-4 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{conversation.title}</p>
                  {conversation.subtitle && (
                    <p className="truncate text-xs text-muted-foreground">{conversation.subtitle}</p>
                  )}
                  {conversation.preview && !conversation.subtitle && (
                    <p className="truncate text-xs text-muted-foreground">{conversation.preview}</p>
                  )}
                </div>
                <SessionMenu
                  sessionId={conversation.id}
                  sessionTitle={conversation.title}
                  sessionSubtitle={conversation.subtitle}
                  sessionInstructions={conversation.instructions}
                  onUpdate={() => onUpdateConversations?.()}
                />
              </div>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
