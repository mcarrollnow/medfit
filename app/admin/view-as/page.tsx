'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  ArrowLeft, Search, Users, UserCheck, Truck, Eye, Loader2,
  User, Building, Mail, Phone, ChevronRight
} from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'
import { toast } from 'sonner'
import { useImpersonationStore, ImpersonatedUser } from '@/lib/impersonation-store'

interface UserWithCustomer {
  id: string
  auth_id: string
  email: string
  first_name: string | null
  last_name: string | null
  role: string
  phone: string | null
  profile_picture_url: string | null
  customer?: {
    id: string
    company_name: string | null
    customer_type: string
  } | null
}

// Quick view mode cards
const viewModes = [
  {
    id: 'customer',
    title: 'Customer View',
    description: 'See the site as a regular customer would',
    icon: Users,
    href: '/dashboard',
    color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  },
  {
    id: 'rep',
    title: 'Rep View',
    description: 'See the site as a sales rep would',
    icon: UserCheck,
    href: '/rep',
    color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  },
  {
    id: 'supplier',
    title: 'Supplier View',
    description: 'See the site as a supplier would',
    icon: Truck,
    href: '/supplier',
    color: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  },
]

export default function ViewAsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [users, setUsers] = useState<UserWithCustomer[]>([])
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  
  const { startImpersonation, isImpersonating, stopImpersonation } = useImpersonationStore()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Fetch users with their customer records
  const fetchUsers = useCallback(async (query?: string) => {
    try {
      setSearching(true)
      
      let usersQuery = supabase
        .from('users')
        .select('id, auth_id, email, first_name, last_name, role, phone, profile_picture_url')
        .order('created_at', { ascending: false })
        .limit(50)

      if (query) {
        usersQuery = usersQuery.or(`email.ilike.%${query}%,first_name.ilike.%${query}%,last_name.ilike.%${query}%`)
      }

      const { data: usersData, error: usersError } = await usersQuery

      if (usersError) throw usersError

      // Fetch customer records for these users
      if (usersData && usersData.length > 0) {
        const userIds = usersData.map(u => u.id)
        const { data: customersData } = await supabase
          .from('customers')
          .select('id, user_id, company_name, customer_type')
          .in('user_id', userIds)

        // Map customers to users
        const usersWithCustomers = usersData.map(user => ({
          ...user,
          customer: customersData?.find(c => c.user_id === user.id) || null
        }))

        setUsers(usersWithCustomers)
      } else {
        setUsers([])
      }
    } catch (error: any) {
      console.error('Failed to fetch users:', error)
      toast.error('Failed to fetch users')
    } finally {
      setLoading(false)
      setSearching(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        fetchUsers(searchQuery)
      } else {
        fetchUsers()
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery, fetchUsers])

  // Handle quick view mode selection
  const handleQuickView = (mode: 'customer' | 'rep' | 'supplier', href: string) => {
    startImpersonation(mode)
    toast.success(`Now viewing as ${mode}`)
    router.push(href)
  }

  // Handle specific user impersonation
  const handleImpersonateUser = (user: UserWithCustomer) => {
    const impersonatedUser: ImpersonatedUser = {
      id: user.id,
      email: user.email,
      firstName: user.first_name || '',
      lastName: user.last_name || '',
      role: user.role || 'customer',
      customerId: user.customer?.id,
      profilePictureUrl: user.profile_picture_url || undefined,
    }
    
    // Determine the redirect based on user role
    let redirectPath = '/dashboard'
    if (user.role === 'rep') {
      redirectPath = '/rep'
    } else if (user.role === 'supplier') {
      redirectPath = '/supplier'
    } else if (user.role === 'admin' || user.role === 'superadmin') {
      redirectPath = '/admin'
    }
    
    startImpersonation(user.role as any, impersonatedUser)
    toast.success(`Now viewing as ${user.first_name || user.email}`)
    router.push(redirectPath)
  }

  // Get role badge color
  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'admin':
      case 'superadmin':
        return 'bg-purple-500/20 text-purple-400'
      case 'rep':
        return 'bg-blue-500/20 text-blue-400'
      case 'supplier':
        return 'bg-amber-500/20 text-amber-400'
      case 'gymowner':
      case 'spaowner':
      case 'wellnessowner':
        return 'bg-pink-500/20 text-pink-400'
      default:
        return 'bg-white/10 text-white/70'
    }
  }

  const getUserDisplayName = (user: UserWithCustomer) => {
    if (user.first_name || user.last_name) {
      return `${user.first_name || ''} ${user.last_name || ''}`.trim()
    }
    return user.email
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-white/50" />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition"
            >
              <ArrowLeft className="h-5 w-5 text-white/70" />
            </Link>
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-white">View As</h1>
              <p className="text-lg text-white/50">Experience the site from different perspectives</p>
            </div>
          </div>
          
          {isImpersonating && (
            <Button
              onClick={() => {
                stopImpersonation()
                toast.success('Exited view mode')
              }}
              variant="outline"
              className="border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20"
            >
              <Eye className="h-4 w-4 mr-2" />
              Exit View Mode
            </Button>
          )}
        </motion.div>

        {/* Quick View Modes */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-xl font-semibold text-white mb-4">Quick View</h2>
          <p className="text-white/50 mb-6">Quickly switch to see the site as a specific role type</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {viewModes.map((mode) => {
              const Icon = mode.icon
              return (
                <button
                  key={mode.id}
                  onClick={() => handleQuickView(mode.id as any, mode.href)}
                  className={`group p-6 rounded-2xl border ${mode.color} hover:scale-[1.02] transition-all duration-200 text-left`}
                >
                  <div className="flex items-start justify-between">
                    <div className="p-3 rounded-xl bg-white/10">
                      <Icon className="h-6 w-6" />
                    </div>
                    <ChevronRight className="h-5 w-5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="text-lg font-semibold mt-4">{mode.title}</h3>
                  <p className="text-sm opacity-70 mt-1">{mode.description}</p>
                </button>
              )
            })}
          </div>
        </motion.section>

        {/* Impersonate Specific User */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">Impersonate User</h2>
            <p className="text-white/50">Select a specific user to see exactly what they see</p>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or email..."
              className="h-12 pl-12 bg-white/5 border-white/10 text-white rounded-xl"
            />
            {searching && (
              <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50 animate-spin" />
            )}
          </div>

          {/* Users List */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
            <div className="divide-y divide-white/5">
              {users.length === 0 ? (
                <div className="p-8 text-center text-white/40">
                  {searchQuery ? 'No users found matching your search' : 'No users found'}
                </div>
              ) : (
                users.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => handleImpersonateUser(user)}
                    className="w-full p-4 hover:bg-white/5 transition-colors flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      {user.profile_picture_url ? (
                        <img
                          src={user.profile_picture_url}
                          alt={getUserDisplayName(user)}
                          className="w-12 h-12 rounded-full object-cover border border-white/10"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                          <User className="h-6 w-6 text-white/50" />
                        </div>
                      )}
                      
                      {/* User Info */}
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium">
                            {getUserDisplayName(user)}
                          </span>
                          <span className={`px-2 py-0.5 text-xs rounded-full ${getRoleBadgeClass(user.role)}`}>
                            {user.role || 'customer'}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-sm text-white/50">
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {user.email}
                          </span>
                          {user.customer?.company_name && (
                            <span className="flex items-center gap-1">
                              <Building className="h-3 w-3" />
                              {user.customer.company_name}
                            </span>
                          )}
                          {user.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {user.phone}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* View Button */}
                    <div className="flex items-center gap-2 text-white/50 group-hover:text-white transition-colors">
                      <span className="text-sm font-medium">View as</span>
                      <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Help Text */}
          <div className="rounded-xl bg-blue-500/10 border border-blue-500/20 p-4">
            <p className="text-sm text-white/70">
              <strong className="text-white">Tip:</strong> When impersonating a user, you'll see a banner at the top of the screen. 
              Click "Exit" to return to your admin view. Your actual session remains secure - this only changes what you see.
            </p>
          </div>
        </motion.section>
      </div>
    </div>
  )
}
