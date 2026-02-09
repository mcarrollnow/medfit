"use server"

import { createAdminClient } from "@/lib/supabase/admin"

export interface RepRating {
  id: string
  customer_id: string
  rep_id: string
  order_id: string | null
  rating: number
  feedback_tags: string[]
  additional_feedback: string | null
  created_at: string
  updated_at: string
}

export async function submitRepRating(data: {
  customerId: string
  repId: string
  orderId?: string
  rating: number
  feedbackTags: string[]
  additionalFeedback?: string
}): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createAdminClient()
    if (!supabase) {
      return { success: false, error: "Database connection failed" }
    }

    const { error } = await supabase.from("rep_ratings").insert({
      customer_id: data.customerId,
      rep_id: data.repId,
      order_id: data.orderId || null,
      rating: data.rating,
      feedback_tags: data.feedbackTags,
      additional_feedback: data.additionalFeedback || null,
    })

    if (error) {
      console.error("[rep-ratings] Error submitting rating:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("[rep-ratings] Error submitting rating:", error)
    return { success: false, error: "Failed to submit rating" }
  }
}

export async function getRepRatings(repId: string): Promise<RepRating[]> {
  try {
    const supabase = createAdminClient()
    if (!supabase) return []

    const { data, error } = await supabase
      .from("rep_ratings")
      .select("*")
      .eq("rep_id", repId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[rep-ratings] Error fetching rep ratings:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("[rep-ratings] Error fetching rep ratings:", error)
    return []
  }
}

export async function getRepAverageRating(repId: string): Promise<{ average: number; count: number }> {
  try {
    const supabase = createAdminClient()
    if (!supabase) return { average: 0, count: 0 }

    const { data, error } = await supabase.from("rep_ratings").select("rating").eq("rep_id", repId)

    if (error) {
      console.error("[rep-ratings] Error fetching rep average:", error)
      return { average: 0, count: 0 }
    }

    if (!data || data.length === 0) {
      return { average: 0, count: 0 }
    }

    const sum = data.reduce((acc, r) => acc + r.rating, 0)
    return { average: sum / data.length, count: data.length }
  } catch (error) {
    console.error("[rep-ratings] Error fetching rep average:", error)
    return { average: 0, count: 0 }
  }
}

export async function hasCustomerRatedOrder(customerId: string, orderId: string): Promise<boolean> {
  try {
    const supabase = createAdminClient()
    if (!supabase) return false

    const { data, error } = await supabase
      .from("rep_ratings")
      .select("id")
      .eq("customer_id", customerId)
      .eq("order_id", orderId)
      .single()

    if (error && error.code !== "PGRST116") {
      console.error("[rep-ratings] Error checking rating:", error)
    }

    return !!data
  } catch (error) {
    console.error("[rep-ratings] Error checking rating:", error)
    return false
  }
}

