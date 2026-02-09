import { getCustomers } from "@/app/actions/customers"
import CustomersClient from "./customers-client"
import { headers } from "next/headers"

// Force dynamic rendering - no caching
export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

export default async function CustomersPage() {
  // Force fresh headers read to prevent caching
  const headersList = await headers()
  const timestamp = Date.now()
  
  console.log("[CustomersPage] Rendering at:", new Date(timestamp).toISOString())
  
  // Fetch data on the server - no waterfall!
  const customers = await getCustomers()
  
  console.log("[CustomersPage] Got", customers.length, "customers")
  
  return <CustomersClient initialCustomers={customers} />
}
