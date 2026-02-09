import { useState, useEffect } from 'react'

interface SupportTicket {
  id: string
  title: string
  status: string
  priority: string
  created_at: string
  customer: any
  order: any
}

interface Customer {
  id: string
  customer_name: string
  user: any
  orders: any[]
}

interface Message {
  id: string
  ticket_id: string
  sender_type: string
  message: string
  created_at: string
}

export function useSupportUIData() {
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTickets()
  }, [])

  const fetchTickets = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/support-ui/tickets')
      const data = await response.json()
      
      if (data.error) {
        setError(data.error)
      } else {
        setTickets(data.tickets || [])
      }
    } catch (err) {
      setError('Failed to fetch tickets')
      console.error('[useSupportUIData] Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchCustomer = async (customerId: string): Promise<Customer | null> => {
    try {
      const response = await fetch(`/api/support-ui/customers/${customerId}`)
      const data = await response.json()
      return data.customer || null
    } catch (err) {
      console.error('[useSupportUIData] Error fetching customer:', err)
      return null
    }
  }

  const fetchMessages = async (ticketId: string): Promise<Message[]> => {
    try {
      const response = await fetch(`/api/support-ui/messages?ticket_id=${ticketId}`)
      const data = await response.json()
      return data.messages || []
    } catch (err) {
      console.error('[useSupportUIData] Error fetching messages:', err)
      return []
    }
  }

  return {
    tickets,
    loading,
    error,
    refetch: fetchTickets,
    fetchCustomer,
    fetchMessages,
  }
}
