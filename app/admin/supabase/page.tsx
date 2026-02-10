'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Users, Shield, Mail, Settings, Search, RefreshCw, Loader2, 
  Trash2, Send, Key, Link2, MoreHorizontal, UserCheck, UserX,
  ArrowLeft, Save, Eye, EyeOff, ChevronDown, AlertCircle, CheckCircle2,
  Pencil, Copy, Clock, Calendar, UserCircle, Building, Phone, MapPin
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { createBrowserClient } from '@supabase/ssr'
import { toast } from 'sonner'
import Link from 'next/link'
import { EmailEditor } from '@/components/admin/email-template-editor'

// Available roles
const USER_ROLES = [
  { value: 'customer', label: 'Customer' },
  { value: 'rep', label: 'Rep' },
  { value: 'supplier', label: 'Supplier' },
  { value: 'gymowner', label: 'Gym Owner' },
  { value: 'spaowner', label: 'Spa Owner' },
  { value: 'wellnessowner', label: 'Wellness Owner' },
  { value: 'admin', label: 'Admin' },
  { value: 'superadmin', label: 'Super Admin' },
]

// Types
interface User {
  id: string
  auth_id?: string
  email: string
  first_name?: string
  last_name?: string
  full_name?: string
  phone?: string
  created_at: string
  updated_at?: string
  last_sign_in_at?: string
  email_verified?: boolean
  role?: string
  is_active?: boolean
}

interface AuthUser {
  id: string
  email: string
  phone?: string
  created_at: string
  last_sign_in_at?: string
  email_confirmed_at?: string
  phone_confirmed_at?: string
  confirmed_at?: string
  role?: string
  app_metadata?: any
  user_metadata?: any
}

interface AuthProvider {
  name: string
  enabled: boolean
  icon: React.ReactNode
}

interface EmailTemplate {
  id: string
  type: 'confirmation' | 'invite' | 'magic_link' | 'recovery' | 'email_change'
  subject: string
  content: any
  html: string
  updated_at?: string
}

// Customer types
const CUSTOMER_TYPES = [
  { value: 'retail', label: 'Retail' },
  { value: 'b2b', label: 'B2B' },
  { value: 'b2bvip', label: 'B2B VIP' },
]

interface CustomerRecord {
  id: string
  user_id: string | null
  first_name: string | null
  last_name: string | null
  company_name: string | null
  customer_type: string
  phone: string | null
  shipping_address_line1: string | null
  shipping_city: string | null
  shipping_state: string | null
  shipping_zip: string | null
  shipping_country: string | null
  notes: string | null
  rep_id: string | null
  default_wallet_id: string | null
  created_at: string
  updated_at?: string
  // Joined user data
  user_email?: string | null
}

const EMAIL_TEMPLATE_TYPES = [
  { id: 'confirmation', label: 'Sign Up Confirmation', description: 'Sent when a user signs up to confirm their email' },
  { id: 'invite', label: 'Invite User', description: 'Sent when you invite a user to your platform' },
  { id: 'magic_link', label: 'Magic Link', description: 'Sent when a user requests a passwordless login' },
  { id: 'recovery', label: 'Password Recovery', description: 'Sent when a user requests a password reset' },
  { id: 'email_change', label: 'Email Change', description: 'Sent when a user changes their email address' },
]

export default function SupabaseAdminPage() {
  const [activeTab, setActiveTab] = useState('users')
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState<User[]>([])
  const [authUsers, setAuthUsers] = useState<AuthUser[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedAuthUser, setSelectedAuthUser] = useState<AuthUser | null>(null)
  const [actionDialogOpen, setActionDialogOpen] = useState(false)
  const [actionType, setActionType] = useState<'reset' | 'magic' | 'delete' | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  
  // Edit user state
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editLoading, setEditLoading] = useState(false)
  const [editRole, setEditRole] = useState('')
  const [editFirstName, setEditFirstName] = useState('')
  const [editLastName, setEditLastName] = useState('')
  
  // Customers state
  const [customers, setCustomers] = useState<CustomerRecord[]>([])
  const [customerSearchQuery, setCustomerSearchQuery] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerRecord | null>(null)
  const [editCustomerDialogOpen, setEditCustomerDialogOpen] = useState(false)
  const [editCustomerLoading, setEditCustomerLoading] = useState(false)
  const [editCustomerFirstName, setEditCustomerFirstName] = useState('')
  const [editCustomerLastName, setEditCustomerLastName] = useState('')
  const [editCustomerCompany, setEditCustomerCompany] = useState('')
  const [editCustomerPhone, setEditCustomerPhone] = useState('')
  const [editCustomerType, setEditCustomerType] = useState('retail')
  const [editCustomerNotes, setEditCustomerNotes] = useState('')
  const [editCustomerAddress, setEditCustomerAddress] = useState('')
  const [editCustomerCity, setEditCustomerCity] = useState('')
  const [editCustomerState, setEditCustomerState] = useState('')
  const [editCustomerZip, setEditCustomerZip] = useState('')

  // Edit user additional fields
  const [editPhone, setEditPhone] = useState('')
  const [editEmail, setEditEmail] = useState('')

  // Email template state
  const [activeTemplateType, setActiveTemplateType] = useState('confirmation')
  const [templates, setTemplates] = useState<Record<string, EmailTemplate>>({})
  const [templateSubject, setTemplateSubject] = useState('')
  const [templateContent, setTemplateContent] = useState<any>(null)
  const [templateHtml, setTemplateHtml] = useState('')
  const [savingTemplate, setSavingTemplate] = useState(false)

  // Auth providers state
  const [providers, setProviders] = useState<AuthProvider[]>([
    { name: 'Email', enabled: true, icon: <Mail className="h-4 w-4" /> },
    { name: 'Phone', enabled: false, icon: <Shield className="h-4 w-4" /> },
    { name: 'Apple', enabled: false, icon: <Shield className="h-4 w-4" /> },
    { name: 'Google', enabled: false, icon: <Shield className="h-4 w-4" /> },
    { name: 'Facebook', enabled: false, icon: <Shield className="h-4 w-4" /> },
    { name: 'Twitter', enabled: false, icon: <Shield className="h-4 w-4" /> },
    { name: 'Discord', enabled: false, icon: <Shield className="h-4 w-4" /> },
    { name: 'GitHub', enabled: false, icon: <Shield className="h-4 w-4" /> },
  ])
  const [allowSignups, setAllowSignups] = useState(true)
  const [confirmEmail, setConfirmEmail] = useState(true)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Fetch users
  const fetchUsers = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setUsers(data || [])
    } catch (error: any) {
      console.error('Failed to fetch users:', error)
      toast.error('Failed to fetch users')
    }
  }, [supabase])

  // Fetch auth users via API route
  const fetchAuthUsers = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/auth-users')
      if (!response.ok) throw new Error('Failed to fetch auth users')
      const data = await response.json()
      setAuthUsers(data.users || [])
    } catch (error: any) {
      console.error('Failed to fetch auth users:', error)
      // Don't show error toast - auth users might not be accessible
    }
  }, [])

  // Fetch customers via API route (uses service role key to bypass RLS)
  const fetchCustomers = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/customers')
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData?.error?.message || 'Failed to fetch customers')
      }
      const data = await response.json()
      
      // Transform API response to match expected format
      const customerList: CustomerRecord[] = (data || []).map((c: any) => ({
        id: c.id,
        user_id: c.user_id,
        first_name: c.first_name,
        last_name: c.last_name,
        company_name: c.company_name,
        customer_type: c.customer_type,
        phone: c.phone,
        shipping_address_line1: c.shipping_address_line1,
        shipping_city: c.shipping_city,
        shipping_state: c.shipping_state,
        shipping_zip: c.shipping_zip,
        shipping_country: c.shipping_country,
        notes: c.notes,
        rep_id: c.rep_id,
        default_wallet_id: c.default_wallet_id,
        created_at: c.created_at,
        updated_at: c.updated_at,
        user_email: c.email || null,
      }))
      
      setCustomers(customerList)
    } catch (error: any) {
      console.error('Failed to fetch customers:', error)
      toast.error(error.message || 'Failed to fetch customers')
    }
  }, [])

  // Fetch email templates
  const fetchTemplates = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('email_templates')
        .select('*')

      if (error && error.code !== 'PGRST116') {
        console.error('Failed to fetch templates:', error)
      }

      if (data) {
        const templateMap: Record<string, EmailTemplate> = {}
        data.forEach(t => {
          templateMap[t.type] = t
        })
        setTemplates(templateMap)
        
        // Load the active template
        if (templateMap[activeTemplateType]) {
          setTemplateSubject(templateMap[activeTemplateType].subject || '')
          setTemplateContent(templateMap[activeTemplateType].content || null)
          setTemplateHtml(templateMap[activeTemplateType].html || '')
        }
      }
    } catch (error) {
      console.error('Failed to fetch templates:', error)
    }
  }, [supabase, activeTemplateType])

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await Promise.all([fetchUsers(), fetchAuthUsers(), fetchCustomers(), fetchTemplates()])
      setLoading(false)
    }
    loadData()
  }, [fetchUsers, fetchAuthUsers, fetchCustomers, fetchTemplates])

  // Load template when type changes
  useEffect(() => {
    const template = templates[activeTemplateType]
    if (template) {
      setTemplateSubject(template.subject || '')
      setTemplateContent(template.content || null)
      setTemplateHtml(template.html || '')
    } else {
      setTemplateSubject('')
      setTemplateContent(null)
      setTemplateHtml('')
    }
  }, [activeTemplateType, templates])

  // Handle template save
  const handleSaveTemplate = async () => {
    setSavingTemplate(true)
    try {
      const existingTemplate = templates[activeTemplateType]
      
      const templateData = {
        type: activeTemplateType,
        subject: templateSubject,
        content: templateContent,
        html: templateHtml,
        updated_at: new Date().toISOString()
      }

      if (existingTemplate) {
        const { error } = await supabase
          .from('email_templates')
          .update(templateData)
          .eq('id', existingTemplate.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('email_templates')
          .insert([templateData])

        if (error) throw error
      }

      toast.success('Template saved successfully!')
      fetchTemplates()
    } catch (error: any) {
      console.error('Failed to save template:', error)
      toast.error(error.message || 'Failed to save template')
    } finally {
      setSavingTemplate(false)
    }
  }

  // Handle auth user actions
  const handleAuthAction = async () => {
    if (!selectedAuthUser || !actionType) return
    
    setActionLoading(true)
    try {
      const response = await fetch('/api/admin/auth-users/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedAuthUser.id,
          email: selectedAuthUser.email,
          action: actionType
        })
      })

      const result = await response.json()

      if (!response.ok) throw new Error(result.error || 'Action failed')

      toast.success(
        actionType === 'reset' ? 'Password reset email sent!' :
        actionType === 'magic' ? 'Magic link sent!' :
        'User deleted successfully!'
      )

      if (actionType === 'delete') {
        fetchAuthUsers()
        fetchUsers()
      }

      setActionDialogOpen(false)
    } catch (error: any) {
      toast.error(error.message || 'Action failed')
    } finally {
      setActionLoading(false)
    }
  }

  // Delete user from users table
  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return
    
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId)

      if (error) throw error
      toast.success('User deleted from users table')
      fetchUsers()
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete user')
    }
  }

  // Open edit dialog for a user
  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setEditRole(user.role || 'customer')
    setEditFirstName(user.first_name || '')
    setEditLastName(user.last_name || '')
    setEditPhone(user.phone || '')
    setEditEmail(user.email || '')
    setEditDialogOpen(true)
  }

  // Save edited user
  const handleSaveUser = async () => {
    if (!selectedUser) return
    
    setEditLoading(true)
    try {
      const updateData: any = {
        role: editRole,
        first_name: editFirstName,
        last_name: editLastName,
        phone: editPhone,
        email: editEmail,
        updated_at: new Date().toISOString()
      }

      const { error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', selectedUser.id)

      if (error) throw error

      // If role is changed to rep, update customer_type to b2b
      if (editRole === 'rep') {
        const { error: customerError } = await supabase
          .from('customers')
          .update({ customer_type: 'b2b' })
          .eq('user_id', selectedUser.id)
        
        if (customerError) {
          console.log('Note: Could not update customer type to b2b:', customerError.message)
        }
      }

      // Also sync first_name/last_name to the customers table
      const { error: syncError } = await supabase
        .from('customers')
        .update({
          first_name: editFirstName,
          last_name: editLastName,
        })
        .eq('user_id', selectedUser.id)
      
      if (syncError) {
        console.log('Note: Could not sync names to customers table:', syncError.message)
      }
      
      toast.success('User updated successfully!')
      setEditDialogOpen(false)
      fetchUsers()
      fetchCustomers()
    } catch (error: any) {
      toast.error(error.message || 'Failed to update user')
    } finally {
      setEditLoading(false)
    }
  }

  // Open edit dialog for a customer
  const handleEditCustomer = (customer: CustomerRecord) => {
    setSelectedCustomer(customer)
    setEditCustomerFirstName(customer.first_name || '')
    setEditCustomerLastName(customer.last_name || '')
    setEditCustomerCompany(customer.company_name || '')
    setEditCustomerPhone(customer.phone || '')
    setEditCustomerType(customer.customer_type || 'retail')
    setEditCustomerNotes(customer.notes || '')
    setEditCustomerAddress(customer.shipping_address_line1 || '')
    setEditCustomerCity(customer.shipping_city || '')
    setEditCustomerState(customer.shipping_state || '')
    setEditCustomerZip(customer.shipping_zip || '')
    setEditCustomerDialogOpen(true)
  }

  // Save edited customer
  const handleSaveCustomer = async () => {
    if (!selectedCustomer) return
    
    setEditCustomerLoading(true)
    try {
      const { error } = await supabase
        .from('customers')
        .update({
          first_name: editCustomerFirstName || null,
          last_name: editCustomerLastName || null,
          company_name: editCustomerCompany || null,
          phone: editCustomerPhone || null,
          customer_type: editCustomerType,
          notes: editCustomerNotes || null,
          shipping_address_line1: editCustomerAddress || null,
          shipping_city: editCustomerCity || null,
          shipping_state: editCustomerState || null,
          shipping_zip: editCustomerZip || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedCustomer.id)

      if (error) throw error

      // Also sync names to users table if customer has a user_id
      if (selectedCustomer.user_id && (editCustomerFirstName || editCustomerLastName)) {
        const { error: userSyncError } = await supabase
          .from('users')
          .update({
            first_name: editCustomerFirstName || null,
            last_name: editCustomerLastName || null,
          })
          .eq('id', selectedCustomer.user_id)

        if (userSyncError) {
          console.log('Note: Could not sync names to users table:', userSyncError.message)
        }
      }

      toast.success('Customer updated successfully!')
      setEditCustomerDialogOpen(false)
      fetchCustomers()
      fetchUsers()
    } catch (error: any) {
      toast.error(error.message || 'Failed to update customer')
    } finally {
      setEditCustomerLoading(false)
    }
  }

  // Delete customer from customers table
  const handleDeleteCustomer = async (customerId: string) => {
    if (!confirm('Are you sure you want to delete this customer?')) return
    
    try {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', customerId)

      if (error) throw error
      toast.success('Customer deleted')
      fetchCustomers()
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete customer')
    }
  }

  // Copy user ID to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }

  // Format date/time nicely
  const formatDateTime = (dateStr: string | undefined) => {
    if (!dateStr) return 'Never'
    const date = new Date(dateStr)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  // Get auth user info for a database user (matching by auth_id)
  const getAuthUserForUser = (user: User): AuthUser | undefined => {
    return authUsers.find(au => au.id === user.auth_id)
  }

  // Filter users
  const filteredUsers = users.filter(user =>
    user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.id?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredAuthUsers = authUsers.filter(user =>
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Filter customers
  const filteredCustomers = customers.filter(customer => {
    const q = customerSearchQuery.toLowerCase()
    if (!q) return true
    return (
      customer.first_name?.toLowerCase().includes(q) ||
      customer.last_name?.toLowerCase().includes(q) ||
      customer.company_name?.toLowerCase().includes(q) ||
      customer.phone?.toLowerCase().includes(q) ||
      customer.user_email?.toLowerCase().includes(q) ||
      customer.shipping_city?.toLowerCase().includes(q) ||
      customer.customer_type?.toLowerCase().includes(q) ||
      customer.id?.toLowerCase().includes(q)
    )
  })

  const getCustomerDisplayName = (customer: CustomerRecord) => {
    if (customer.first_name || customer.last_name) {
      return `${customer.first_name || ''} ${customer.last_name || ''}`.trim()
    }
    if (customer.company_name) return customer.company_name
    return customer.user_email || 'Unknown'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="h-10 w-10 rounded-xl bg-foreground/5 border border-border flex items-center justify-center hover:bg-foreground/10 transition"
            >
              <ArrowLeft className="h-5 w-5 text-foreground/70" />
            </Link>
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-foreground">Supabase Admin</h1>
              <p className="text-lg text-muted-foreground">Manage users, customers, auth, and email templates</p>
            </div>
          </div>
          <Button
            onClick={() => {
              fetchUsers()
              fetchAuthUsers()
              fetchCustomers()
              fetchTemplates()
            }}
            variant="outline"
            className="h-10 px-4 rounded-xl border-border bg-foreground/5 text-foreground hover:bg-foreground/10"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </motion.div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-foreground/5 border border-border rounded-xl p-1 h-auto">
            <TabsTrigger 
              value="users" 
              className="data-[state=active]:bg-foreground/10 rounded-lg px-4 py-2.5"
            >
              <Users className="h-4 w-4 mr-2" />
              Users Table
            </TabsTrigger>
            <TabsTrigger 
              value="customers" 
              className="data-[state=active]:bg-foreground/10 rounded-lg px-4 py-2.5"
            >
              <UserCircle className="h-4 w-4 mr-2" />
              Customers
            </TabsTrigger>
            <TabsTrigger 
              value="auth" 
              className="data-[state=active]:bg-foreground/10 rounded-lg px-4 py-2.5"
            >
              <Shield className="h-4 w-4 mr-2" />
              Auth Users
            </TabsTrigger>
            <TabsTrigger 
              value="providers" 
              className="data-[state=active]:bg-foreground/10 rounded-lg px-4 py-2.5"
            >
              <Settings className="h-4 w-4 mr-2" />
              Providers
            </TabsTrigger>
            <TabsTrigger 
              value="templates" 
              className="data-[state=active]:bg-foreground/10 rounded-lg px-4 py-2.5"
            >
              <Mail className="h-4 w-4 mr-2" />
              Email Templates
            </TabsTrigger>
          </TabsList>

          {/* Users Table Tab */}
          <TabsContent value="users" className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Search */}
              <div className="relative max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search users..."
                  className="h-12 pl-12 bg-foreground/5 border-border text-foreground rounded-xl"
                />
              </div>

              {/* Users Count */}
              <div className="text-sm text-muted-foreground">
                {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} found
              </div>

              {/* Users List */}
              <div className="rounded-2xl border border-border bg-foreground/5 backdrop-blur-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">User ID</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Email</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">First Name</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Last Name</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Role</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Phone</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Signed Up</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Last Access</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Verified</th>
                        <th className="text-right p-4 text-sm font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => {
                        const authUser = getAuthUserForUser(user)
                        return (
                          <tr 
                            key={user.id} 
                            className="border-b border-border hover:bg-foreground/5 cursor-pointer transition-colors"
                            onClick={() => handleEditUser(user)}
                          >
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <span className="text-muted-foreground text-xs font-mono truncate max-w-[80px]" title={user.id}>
                                  {user.id.slice(0, 8)}...
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground/70"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    copyToClipboard(user.id)
                                  }}
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                            </td>
                            <td className="p-4 text-foreground">{user.email}</td>
                            <td className="p-4 text-foreground/70">{user.first_name || '-'}</td>
                            <td className="p-4 text-foreground/70">{user.last_name || '-'}</td>
                            <td className="p-4">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                user.role === 'admin' || user.role === 'superadmin'
                                  ? 'bg-purple-500/20 text-purple-400'
                                  : user.role === 'rep'
                                  ? 'bg-blue-500/20 text-blue-400'
                                  : user.role === 'gymowner' || user.role === 'spaowner' || user.role === 'wellnessowner'
                                  ? 'bg-amber-500/20 text-amber-400'
                                  : 'bg-foreground/10 text-foreground/70'
                              }`}>
                                {USER_ROLES.find(r => r.value === user.role)?.label || user.role || 'customer'}
                              </span>
                            </td>
                            <td className="p-4 text-foreground/70 text-sm">{user.phone || '—'}</td>
                            <td className="p-4 text-muted-foreground text-xs">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDateTime(user.created_at)}
                              </div>
                            </td>
                            <td className="p-4 text-muted-foreground text-xs">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatDateTime(authUser?.last_sign_in_at)}
                              </div>
                            </td>
                            <td className="p-4">
                              {authUser?.email_confirmed_at ? (
                                <span className="px-2 py-1 text-xs rounded-full bg-emerald-500/20 text-emerald-400 flex items-center gap-1 w-fit">
                                  <CheckCircle2 className="h-3 w-3" />
                                  Yes
                                </span>
                              ) : (
                                <span className="px-2 py-1 text-xs rounded-full bg-amber-500/20 text-amber-400 flex items-center gap-1 w-fit">
                                  <AlertCircle className="h-3 w-3" />
                                  No
                                </span>
                              )}
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-foreground/10"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleEditUser(user)
                                  }}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleDeleteUser(user.id)
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                      {filteredUsers.length === 0 && (
                        <tr>
                          <td colSpan={10} className="p-8 text-center text-muted-foreground">
                            No users found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          </TabsContent>

          {/* Customers Table Tab */}
          <TabsContent value="customers" className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Search */}
              <div className="relative max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  value={customerSearchQuery}
                  onChange={(e) => setCustomerSearchQuery(e.target.value)}
                  placeholder="Search by name, email, phone, company, city..."
                  className="h-12 pl-12 bg-foreground/5 border-border text-foreground rounded-xl"
                />
              </div>

              {/* Customers Count */}
              <div className="text-sm text-muted-foreground">
                {filteredCustomers.length} customer{filteredCustomers.length !== 1 ? 's' : ''} found
              </div>

              {/* Customers List */}
              <div className="rounded-2xl border border-border bg-foreground/5 backdrop-blur-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Customer ID</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">First Name</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Last Name</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Email</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Company</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Type</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Phone</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">City</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Created</th>
                        <th className="text-right p-4 text-sm font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCustomers.map((customer) => (
                        <tr 
                          key={customer.id} 
                          className="border-b border-border hover:bg-foreground/5 cursor-pointer transition-colors"
                          onClick={() => handleEditCustomer(customer)}
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground text-xs font-mono truncate max-w-[80px]" title={customer.id}>
                                {customer.id.slice(0, 8)}...
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground/70"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  copyToClipboard(customer.id)
                                }}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className={customer.first_name ? 'text-foreground' : 'text-muted-foreground italic'}>
                              {customer.first_name || '—'}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={customer.last_name ? 'text-foreground' : 'text-muted-foreground italic'}>
                              {customer.last_name || '—'}
                            </span>
                          </td>
                          <td className="p-4 text-foreground/70">{customer.user_email || '—'}</td>
                          <td className="p-4 text-foreground/70">{customer.company_name || '—'}</td>
                          <td className="p-4">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              customer.customer_type === 'b2bvip'
                                ? 'bg-amber-500/20 text-amber-400'
                                : customer.customer_type === 'b2b'
                                ? 'bg-blue-500/20 text-blue-400'
                                : 'bg-foreground/10 text-foreground/70'
                            }`}>
                              {CUSTOMER_TYPES.find(t => t.value === customer.customer_type)?.label || customer.customer_type}
                            </span>
                          </td>
                          <td className="p-4 text-foreground/70 text-sm">{customer.phone || '—'}</td>
                          <td className="p-4 text-muted-foreground text-sm">{customer.shipping_city || '—'}</td>
                          <td className="p-4 text-muted-foreground text-xs">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDateTime(customer.created_at)}
                            </div>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-foreground/10"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleEditCustomer(customer)
                                }}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDeleteCustomer(customer.id)
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredCustomers.length === 0 && (
                        <tr>
                          <td colSpan={10} className="p-8 text-center text-muted-foreground">
                            No customers found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          </TabsContent>

          {/* Auth Users Tab */}
          <TabsContent value="auth" className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Info Banner */}
              <div className="rounded-xl bg-blue-500/10 border border-blue-500/20 p-4 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-foreground/80">
                    Auth users are managed by Supabase Auth. Click on a user to send password reset or magic link emails.
                  </p>
                </div>
              </div>

              {/* Search */}
              <div className="relative max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search auth users..."
                  className="h-12 pl-12 bg-foreground/5 border-border text-foreground rounded-xl"
                />
              </div>

              {/* Auth Users List */}
              <div className="rounded-2xl border border-border bg-foreground/5 backdrop-blur-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Email</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Created</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Last Sign In</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                        <th className="text-right p-4 text-sm font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAuthUsers.map((user) => (
                        <tr key={user.id} className="border-b border-border hover:bg-foreground/5">
                          <td className="p-4 text-foreground">{user.email}</td>
                          <td className="p-4 text-muted-foreground text-sm">
                            {new Date(user.created_at).toLocaleDateString()}
                          </td>
                          <td className="p-4 text-muted-foreground text-sm">
                            {user.last_sign_in_at 
                              ? new Date(user.last_sign_in_at).toLocaleDateString()
                              : 'Never'}
                          </td>
                          <td className="p-4">
                            {user.email_confirmed_at ? (
                              <span className="px-2 py-1 text-xs rounded-full bg-emerald-500/20 text-emerald-400 flex items-center gap-1 w-fit">
                                <CheckCircle2 className="h-3 w-3" />
                                Confirmed
                              </span>
                            ) : (
                              <span className="px-2 py-1 text-xs rounded-full bg-amber-500/20 text-amber-400 flex items-center gap-1 w-fit">
                                <AlertCircle className="h-3 w-3" />
                                Pending
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-card border-border">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-foreground/10" />
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedAuthUser(user)
                                    setActionType('reset')
                                    setActionDialogOpen(true)
                                  }}
                                  className="cursor-pointer"
                                >
                                  <Key className="h-4 w-4 mr-2" />
                                  Send Password Reset
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedAuthUser(user)
                                    setActionType('magic')
                                    setActionDialogOpen(true)
                                  }}
                                  className="cursor-pointer"
                                >
                                  <Link2 className="h-4 w-4 mr-2" />
                                  Send Magic Link
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-foreground/10" />
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedAuthUser(user)
                                    setActionType('delete')
                                    setActionDialogOpen(true)
                                  }}
                                  className="cursor-pointer text-red-400"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete User
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                      {filteredAuthUsers.length === 0 && (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-muted-foreground">
                            No auth users found. Make sure the API route is configured correctly.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          </TabsContent>

          {/* Providers Tab */}
          <TabsContent value="providers" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* User Signups */}
              <div className="rounded-2xl border border-border bg-foreground/5 backdrop-blur-xl overflow-hidden">
                <div className="p-6 border-b border-border">
                  <h3 className="text-lg font-semibold text-foreground">User Signups</h3>
                  <p className="text-sm text-muted-foreground">Configure how users can sign up to your application</p>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-foreground/5">
                    <div>
                      <Label className="text-foreground font-medium">Allow new users to sign up</Label>
                      <p className="text-sm text-muted-foreground">If disabled, new users will not be able to sign up</p>
                    </div>
                    <Switch checked={allowSignups} onCheckedChange={setAllowSignups} />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-foreground/5">
                    <div>
                      <Label className="text-foreground font-medium">Confirm email</Label>
                      <p className="text-sm text-muted-foreground">Users need to confirm their email before signing in</p>
                    </div>
                    <Switch checked={confirmEmail} onCheckedChange={setConfirmEmail} />
                  </div>
                </div>
                <div className="p-6 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    Note: These settings are for display only. To change them, go to your Supabase Dashboard → Authentication → Providers
                  </p>
                </div>
              </div>

              {/* Auth Providers */}
              <div className="rounded-2xl border border-border bg-foreground/5 backdrop-blur-xl overflow-hidden">
                <div className="p-6 border-b border-border">
                  <h3 className="text-lg font-semibold text-foreground">Auth Providers</h3>
                  <p className="text-sm text-muted-foreground">Enable different authentication methods for your users</p>
                </div>
                <div className="divide-y divide-white/5">
                  {providers.map((provider) => (
                    <div key={provider.name} className="flex items-center justify-between p-4 hover:bg-foreground/5">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-foreground/10 flex items-center justify-center">
                          {provider.icon}
                        </div>
                        <span className="text-foreground font-medium">{provider.name}</span>
                      </div>
                      <span className={`px-3 py-1 text-xs rounded-full ${
                        provider.enabled 
                          ? 'bg-emerald-500/20 text-emerald-400' 
                          : 'bg-foreground/10 text-muted-foreground'
                      }`}>
                        {provider.enabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="p-6 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    To enable or configure providers, go to your Supabase Dashboard → Authentication → Providers
                  </p>
                </div>
              </div>
            </motion.div>
          </TabsContent>

          {/* Email Templates Tab */}
          <TabsContent value="templates" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Template Type Selector */}
              <div className="flex flex-wrap gap-2">
                {EMAIL_TEMPLATE_TYPES.map((type) => (
                  <Button
                    key={type.id}
                    variant={activeTemplateType === type.id ? 'default' : 'outline'}
                    className={activeTemplateType === type.id 
                      ? 'bg-primary text-primary-foreground hover:bg-card/90' 
                      : 'border-border bg-foreground/5 text-foreground hover:bg-foreground/10'
                    }
                    onClick={() => setActiveTemplateType(type.id)}
                  >
                    {type.label}
                  </Button>
                ))}
              </div>

              {/* Template Info */}
              <div className="rounded-xl bg-foreground/5 border border-border p-4">
                <p className="text-sm text-foreground/70">
                  {EMAIL_TEMPLATE_TYPES.find(t => t.id === activeTemplateType)?.description}
                </p>
              </div>

              {/* Subject Line */}
              <div className="space-y-2">
                <Label className="text-foreground/70">Email Subject</Label>
                <Input
                  value={templateSubject}
                  onChange={(e) => setTemplateSubject(e.target.value)}
                  placeholder="Enter email subject..."
                  className="h-12 bg-foreground/5 border-border text-foreground rounded-xl"
                />
              </div>

              {/* Email Editor */}
              <div className="space-y-2">
                <Label className="text-foreground/70">Email Body</Label>
                <EmailEditor
                  content={templateContent}
                  onChange={(content, html) => {
                    setTemplateContent(content)
                    setTemplateHtml(html)
                  }}
                  templateType={activeTemplateType}
                />
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <Button
                  onClick={handleSaveTemplate}
                  disabled={savingTemplate}
                  className="h-12 px-6 rounded-xl bg-primary text-primary-foreground hover:bg-card/90 font-semibold"
                >
                  {savingTemplate ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Template
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>

        {/* Action Dialog */}
        <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">
                {actionType === 'reset' && 'Send Password Reset'}
                {actionType === 'magic' && 'Send Magic Link'}
                {actionType === 'delete' && 'Delete User'}
              </DialogTitle>
              <DialogDescription className="text-foreground/60">
                {actionType === 'reset' && `Send a password reset email to ${selectedAuthUser?.email}`}
                {actionType === 'magic' && `Send a magic link to ${selectedAuthUser?.email}`}
                {actionType === 'delete' && `Are you sure you want to delete ${selectedAuthUser?.email}? This action cannot be undone.`}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => setActionDialogOpen(false)}
                className="border-border bg-foreground/5 text-foreground hover:bg-foreground/10"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAuthAction}
                disabled={actionLoading}
                className={actionType === 'delete' ? 'bg-red-500 hover:bg-red-600' : ''}
              >
                {actionLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    {actionType === 'reset' && 'Send Reset Email'}
                    {actionType === 'magic' && 'Send Magic Link'}
                    {actionType === 'delete' && 'Delete User'}
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit User Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="bg-card border-border max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-foreground flex items-center gap-2">
                <Pencil className="h-5 w-5" />
                Edit User
              </DialogTitle>
              <DialogDescription className="text-foreground/60">
                Update user information and role
              </DialogDescription>
            </DialogHeader>
            
            {selectedUser && (
              <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
                {/* User ID */}
                <div className="space-y-2">
                  <Label className="text-foreground/70">User ID</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      value={selectedUser.id}
                      disabled
                      className="h-10 bg-foreground/5 border-border text-muted-foreground rounded-lg font-mono text-sm"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-10 px-3 border-border bg-foreground/5 text-foreground hover:bg-foreground/10"
                      onClick={() => copyToClipboard(selectedUser.id)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label className="text-foreground/70">Email</Label>
                  <Input
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="h-10 bg-foreground/5 border-border text-foreground rounded-lg"
                  />
                </div>

                {/* First Name / Last Name */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-foreground/70">First Name</Label>
                    <Input
                      value={editFirstName}
                      onChange={(e) => setEditFirstName(e.target.value)}
                      placeholder="Enter first name..."
                      className="h-10 bg-foreground/5 border-border text-foreground rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground/70">Last Name</Label>
                    <Input
                      value={editLastName}
                      onChange={(e) => setEditLastName(e.target.value)}
                      placeholder="Enter last name..."
                      className="h-10 bg-foreground/5 border-border text-foreground rounded-lg"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label className="text-foreground/70">Phone</Label>
                  <Input
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="Enter phone number..."
                    className="h-10 bg-foreground/5 border-border text-foreground rounded-lg"
                  />
                </div>

                {/* Role */}
                <div className="space-y-2">
                  <Label className="text-foreground/70">Role</Label>
                  <Select value={editRole} onValueChange={setEditRole}>
                    <SelectTrigger className="h-10 bg-foreground/5 border-border text-foreground rounded-lg">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {USER_ROLES.map((role) => (
                        <SelectItem 
                          key={role.value} 
                          value={role.value}
                          className="text-foreground hover:bg-foreground/10 focus:bg-foreground/10"
                        >
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Timestamps */}
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
                  <div>
                    <Label className="text-muted-foreground text-xs">Created</Label>
                    <p className="text-foreground/70 text-sm mt-1">{formatDateTime(selectedUser.created_at)}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Last Updated</Label>
                    <p className="text-foreground/70 text-sm mt-1">{formatDateTime(selectedUser.updated_at)}</p>
                  </div>
                </div>

                {/* Auth Info */}
                {(() => {
                  const authUser = getAuthUserForUser(selectedUser)
                  return authUser ? (
                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
                      <div>
                        <Label className="text-muted-foreground text-xs">Last Sign In</Label>
                        <p className="text-foreground/70 text-sm mt-1">{formatDateTime(authUser.last_sign_in_at)}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground text-xs">Email Verified</Label>
                        <p className="text-sm mt-1">
                          {authUser.email_confirmed_at ? (
                            <span className="text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" /> Verified
                            </span>
                          ) : (
                            <span className="text-amber-400 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" /> Not verified
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  ) : null
                })()}
              </div>
            )}

            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => setEditDialogOpen(false)}
                className="border-border bg-foreground/5 text-foreground hover:bg-foreground/10"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveUser}
                disabled={editLoading}
                className="bg-primary text-primary-foreground hover:bg-card/90"
              >
                {editLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Customer Dialog */}
        <Dialog open={editCustomerDialogOpen} onOpenChange={setEditCustomerDialogOpen}>
          <DialogContent className="bg-card border-border max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-foreground flex items-center gap-2">
                <UserCircle className="h-5 w-5" />
                Edit Customer
              </DialogTitle>
              <DialogDescription className="text-foreground/60">
                Update customer details, name, and address
              </DialogDescription>
            </DialogHeader>
            
            {selectedCustomer && (
              <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
                {/* Customer ID */}
                <div className="space-y-2">
                  <Label className="text-foreground/70">Customer ID</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      value={selectedCustomer.id}
                      disabled
                      className="h-10 bg-foreground/5 border-border text-muted-foreground rounded-lg font-mono text-sm"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-10 px-3 border-border bg-foreground/5 text-foreground hover:bg-foreground/10"
                      onClick={() => copyToClipboard(selectedCustomer.id)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Email (read-only - comes from users table) */}
                {selectedCustomer.user_email && (
                  <div className="space-y-2">
                    <Label className="text-foreground/70">Email (from Users)</Label>
                    <Input
                      value={selectedCustomer.user_email}
                      disabled
                      className="h-10 bg-foreground/5 border-border text-muted-foreground rounded-lg"
                    />
                  </div>
                )}

                {/* First Name / Last Name */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-foreground/70">First Name</Label>
                    <Input
                      value={editCustomerFirstName}
                      onChange={(e) => setEditCustomerFirstName(e.target.value)}
                      placeholder="Enter first name..."
                      className="h-10 bg-foreground/5 border-border text-foreground rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground/70">Last Name</Label>
                    <Input
                      value={editCustomerLastName}
                      onChange={(e) => setEditCustomerLastName(e.target.value)}
                      placeholder="Enter last name..."
                      className="h-10 bg-foreground/5 border-border text-foreground rounded-lg"
                    />
                  </div>
                </div>

                {/* Company */}
                <div className="space-y-2">
                  <Label className="text-foreground/70">Company</Label>
                  <Input
                    value={editCustomerCompany}
                    onChange={(e) => setEditCustomerCompany(e.target.value)}
                    placeholder="Company name..."
                    className="h-10 bg-foreground/5 border-border text-foreground rounded-lg"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label className="text-foreground/70">Phone</Label>
                  <Input
                    value={editCustomerPhone}
                    onChange={(e) => setEditCustomerPhone(e.target.value)}
                    placeholder="(555) 555-5555"
                    className="h-10 bg-foreground/5 border-border text-foreground rounded-lg"
                  />
                </div>

                {/* Customer Type */}
                <div className="space-y-2">
                  <Label className="text-foreground/70">Customer Type</Label>
                  <Select value={editCustomerType} onValueChange={setEditCustomerType}>
                    <SelectTrigger className="h-10 bg-foreground/5 border-border text-foreground rounded-lg">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {CUSTOMER_TYPES.map((type) => (
                        <SelectItem 
                          key={type.value} 
                          value={type.value}
                          className="text-foreground hover:bg-foreground/10 focus:bg-foreground/10"
                        >
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Shipping Address */}
                <div className="space-y-3 pt-2 border-t border-border">
                  <Label className="text-foreground/70 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Shipping Address
                  </Label>
                  <Input
                    value={editCustomerAddress}
                    onChange={(e) => setEditCustomerAddress(e.target.value)}
                    placeholder="Street address..."
                    className="h-10 bg-foreground/5 border-border text-foreground rounded-lg"
                  />
                  <div className="grid grid-cols-6 gap-2">
                    <Input
                      value={editCustomerCity}
                      onChange={(e) => setEditCustomerCity(e.target.value)}
                      placeholder="City"
                      className="col-span-3 h-10 bg-foreground/5 border-border text-foreground rounded-lg"
                    />
                    <Input
                      value={editCustomerState}
                      onChange={(e) => setEditCustomerState(e.target.value)}
                      placeholder="ST"
                      className="col-span-1 h-10 bg-foreground/5 border-border text-foreground rounded-lg"
                    />
                    <Input
                      value={editCustomerZip}
                      onChange={(e) => setEditCustomerZip(e.target.value)}
                      placeholder="ZIP"
                      className="col-span-2 h-10 bg-foreground/5 border-border text-foreground rounded-lg"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-2 pt-2 border-t border-border">
                  <Label className="text-foreground/70">Notes</Label>
                  <textarea
                    value={editCustomerNotes}
                    onChange={(e) => setEditCustomerNotes(e.target.value)}
                    placeholder="Internal notes..."
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg bg-foreground/5 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-border resize-none text-sm"
                  />
                </div>

                {/* Timestamps */}
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
                  <div>
                    <Label className="text-muted-foreground text-xs">Created</Label>
                    <p className="text-foreground/70 text-sm mt-1">{formatDateTime(selectedCustomer.created_at)}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Last Updated</Label>
                    <p className="text-foreground/70 text-sm mt-1">{formatDateTime(selectedCustomer.updated_at)}</p>
                  </div>
                </div>

                {/* Linked User */}
                {selectedCustomer.user_id && (
                  <div className="pt-2 border-t border-border">
                    <Label className="text-muted-foreground text-xs">Linked User ID</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-foreground/70 text-xs font-mono">{selectedCustomer.user_id}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground/70"
                        onClick={() => copyToClipboard(selectedCustomer.user_id!)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => setEditCustomerDialogOpen(false)}
                className="border-border bg-foreground/5 text-foreground hover:bg-foreground/10"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveCustomer}
                disabled={editCustomerLoading}
                className="bg-primary text-primary-foreground hover:bg-card/90"
              >
                {editCustomerLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

