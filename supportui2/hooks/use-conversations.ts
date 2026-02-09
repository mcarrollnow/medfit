"use client"

import { useState, useEffect } from "react"
import { getConversations, searchConversations } from "@/lib/data/conversations"

export function useConversations(searchQuery = "") {
  const [conversations, setConversations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchConversations() {
      try {
        setLoading(true)
        const data = searchQuery ? await searchConversations(searchQuery) : await getConversations()
        setConversations(data)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchConversations()
  }, [searchQuery])

  return { conversations, loading, error }
}
