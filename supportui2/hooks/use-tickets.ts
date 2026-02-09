"use client"

import { useState, useEffect } from "react"
import { getTickets, getTicketMessages } from "@/lib/data/tickets"

export function useTickets() {
  const [tickets, setTickets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchTickets() {
      try {
        setLoading(true)
        const data = await getTickets()
        setTickets(data)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchTickets()
  }, [])

  const refetch = async () => {
    try {
      setLoading(true)
      const data = await getTickets()
      setTickets(data)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  return { tickets, loading, error, refetch }
}

export function useTicketMessages(ticketId: string | null, adminOnly = false) {
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!ticketId) {
      setMessages([])
      setLoading(false)
      return
    }

    async function fetchMessages() {
      try {
        setLoading(true)
        const data = await getTicketMessages(ticketId, adminOnly)
        setMessages(data)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()
  }, [ticketId, adminOnly])

  return { messages, loading, error }
}
