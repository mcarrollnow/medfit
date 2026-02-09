'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCartStore } from '@/lib/cart-store'
import { getSupabaseBrowserClient } from '@/lib/supabase-browser'
import { toast } from 'sonner'

export default function TestCartPage() {
  const [authStatus, setAuthStatus] = useState<any>(null)
  const [testResults, setTestResults] = useState<any>({})
  const [isLoading, setIsLoading] = useState(false)
  const { items, fetchCart, addItem } = useCartStore()

  // Check auth status on mount
  useEffect(() => {
    checkAuthStatus()
    fetchCart()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const supabase = getSupabaseBrowserClient()
      const { data: { session }, error } = await supabase.auth.getSession()
      
      setAuthStatus({
        isAuthenticated: !!session,
        userId: session?.user?.id,
        email: session?.user?.email,
        error: error?.message
      })
    } catch (error) {
      setAuthStatus({ error: 'Failed to check auth status' })
    }
  }

  const testUserEnsure = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/user/ensure', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      })
      
      const result = {
        status: response.status,
        data: response.ok ? await response.json() : await response.text()
      }
      
      setTestResults(prev => ({ ...prev, userEnsure: result }))
      return response.ok
    } catch (error: any) {
      setTestResults(prev => ({ 
        ...prev, 
        userEnsure: { error: error.message } 
      }))
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const testAddToCart = async () => {
    setIsLoading(true)
    try {
      // Test product
      const testProduct = {
        barcode: 'TEST-001',
        name: 'Test Product',
        price: 10.00,
        in_stock: true,
        inventory_quantity: 100
      }
      
      // First ensure user exists
      const userEnsured = await testUserEnsure()
      if (!userEnsured) {
        toast.error('User ensure failed - check console')
        return
      }
      
      // Try to add to cart using the store
      await addItem(testProduct as any, 1)
      
      setTestResults(prev => ({ 
        ...prev, 
        addToCart: { success: true, message: 'Item added successfully' } 
      }))
      
      toast.success('Test passed! Item added to cart')
      
      // Fetch cart to verify
      await fetchCart()
    } catch (error: any) {
      setTestResults(prev => ({ 
        ...prev, 
        addToCart: { error: error.message } 
      }))
      toast.error(`Add to cart failed: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const testDirectAPI = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: 'TEST-002',
          quantity: 1
        })
      })
      
      const result = {
        status: response.status,
        data: response.ok ? await response.json() : await response.text()
      }
      
      setTestResults(prev => ({ ...prev, directAPI: result }))
      
      if (response.ok) {
        toast.success('Direct API test passed!')
        await fetchCart()
      } else {
        toast.error(`Direct API test failed: ${response.status}`)
      }
    } catch (error: any) {
      setTestResults(prev => ({ 
        ...prev, 
        directAPI: { error: error.message } 
      }))
      toast.error(`Direct API error: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const refreshSession = async () => {
    setIsLoading(true)
    try {
      const supabase = getSupabaseBrowserClient()
      const { data, error } = await supabase.auth.refreshSession()
      
      if (error) {
        toast.error('Session refresh failed')
        setTestResults(prev => ({ 
          ...prev, 
          sessionRefresh: { error: error.message } 
        }))
      } else {
        toast.success('Session refreshed!')
        setTestResults(prev => ({ 
          ...prev, 
          sessionRefresh: { success: true } 
        }))
        await checkAuthStatus()
      }
    } catch (error: any) {
      toast.error(`Refresh error: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Cart System Test Page</h1>
      
      {/* Auth Status */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Authentication Status</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-3 rounded text-sm overflow-auto">
            {JSON.stringify(authStatus, null, 2)}
          </pre>
          <Button 
            onClick={refreshSession} 
            className="mt-3"
            disabled={isLoading}
          >
            Refresh Session
          </Button>
        </CardContent>
      </Card>

      {/* Test Actions */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Test Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Button 
              onClick={testUserEnsure}
              disabled={isLoading}
              variant="outline"
              className="w-full"
            >
              1. Test User Ensure Endpoint
            </Button>
            {testResults.userEnsure && (
              <pre className="mt-2 bg-muted p-3 rounded text-sm overflow-auto">
                {JSON.stringify(testResults.userEnsure, null, 2)}
              </pre>
            )}
          </div>
          
          <div>
            <Button 
              onClick={testAddToCart}
              disabled={isLoading}
              variant="outline"
              className="w-full"
            >
              2. Test Add to Cart (via Store)
            </Button>
            {testResults.addToCart && (
              <pre className="mt-2 bg-muted p-3 rounded text-sm overflow-auto">
                {JSON.stringify(testResults.addToCart, null, 2)}
              </pre>
            )}
          </div>
          
          <div>
            <Button 
              onClick={testDirectAPI}
              disabled={isLoading}
              variant="outline"
              className="w-full"
            >
              3. Test Direct Cart API
            </Button>
            {testResults.directAPI && (
              <pre className="mt-2 bg-muted p-3 rounded text-sm overflow-auto">
                {JSON.stringify(testResults.directAPI, null, 2)}
              </pre>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Current Cart */}
      <Card>
        <CardHeader>
          <CardTitle>Current Cart Contents</CardTitle>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <p className="text-muted-foreground">Cart is empty</p>
          ) : (
            <pre className="bg-muted p-3 rounded text-sm overflow-auto">
              {JSON.stringify(items, null, 2)}
            </pre>
          )}
          <Button 
            onClick={() => fetchCart()} 
            className="mt-3"
            disabled={isLoading}
            variant="outline"
          >
            Refresh Cart
          </Button>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Debugging Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Check the Authentication Status - you should be logged in</li>
            <li>Run Test 1 to ensure your user record exists in the database</li>
            <li>Run Test 2 to test the full add to cart flow via the store</li>
            <li>Run Test 3 to test the cart API directly</li>
            <li>Check browser console for detailed logs</li>
            <li>If tests fail, try refreshing your session</li>
          </ol>
          
          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded">
            <p className="text-sm font-semibold">Common Issues:</p>
            <ul className="list-disc list-inside text-sm mt-2 space-y-1">
              <li>Missing SUPABASE_SERVICE_ROLE_KEY in .env.local</li>
              <li>User authenticated but no database record</li>
              <li>Expired session needs refresh</li>
              <li>RLS policies blocking operations</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
