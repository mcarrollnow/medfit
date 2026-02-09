import { getAuthHeaders } from './auth-client'

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api'

export class APIClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    console.log(`[APIClient] ${options.method || 'GET'} ${endpoint}`)

    const authHeaders = await getAuthHeaders()
    console.log('[APIClient] Auth headers:', authHeaders ? 'Present' : 'Missing')

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
        ...options.headers,
      },
    })

    console.log(`[APIClient] Response status: ${response.status}`)

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }))
      console.error(`[APIClient] Error response:`, error)
      throw new Error(error.error || `API Error: ${response.status}`)
    }

    const data = await response.json()
    console.log(`[APIClient] Success:`, data)
    return data
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }
}

export const apiClient = new APIClient()
