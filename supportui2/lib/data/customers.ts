import { getSupabaseBrowserClient } from "@/lib/supabase/client"

export async function getCustomerById(customerId: string) {
  const supabase = getSupabaseBrowserClient()

  const { data: customer, error } = await supabase
    .from("customers")
    .select(`
      *,
      orders(*,
        items:order_items(*),
        timeline:order_timeline(*)
      ),
      admin_notes(*)
    `)
    .eq("id", customerId)
    .single()

  if (error) {
    console.error("[v0] Error fetching customer:", error)
    return null
  }

  return customer
}

export async function getCustomerByEmail(email: string) {
  const supabase = getSupabaseBrowserClient()

  const { data: customer, error } = await supabase.from("customers").select("*").eq("email", email).single()

  if (error) {
    console.error("[v0] Error fetching customer by email:", error)
    return null
  }

  return customer
}

export async function createCustomer(customerData: {
  name: string
  email: string
  phone?: string
}) {
  const supabase = getSupabaseBrowserClient()

  const { data, error } = await supabase.from("customers").insert(customerData).select().single()

  if (error) {
    console.error("[v0] Error creating customer:", error)
    return null
  }

  return data
}

export async function addAdminNote(noteData: {
  customer_id: string
  author: string
  note: string
}) {
  const supabase = getSupabaseBrowserClient()

  const { data, error } = await supabase.from("admin_notes").insert(noteData).select().single()

  if (error) {
    console.error("[v0] Error adding admin note:", error)
    return null
  }

  return data
}

export async function searchCustomers(query: string) {
  const supabase = getSupabaseBrowserClient()

  const { data: customers, error } = await supabase
    .from("customers")
    .select("*")
    .or(`name.ilike.%${query}%,email.ilike.%${query}%,phone.ilike.%${query}%`)
    .limit(10)

  if (error) {
    console.error("[v0] Error searching customers:", error)
    return []
  }

  return customers || []
}
