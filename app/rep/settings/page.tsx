"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  User,
  Mail,
  Phone,
  Building,
  MapPin,
  Lock,
  Bell,
  Shield,
  ArrowLeft,
  Save,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { getCurrentRep } from "@/app/actions/rep"
import { cn } from "@/lib/utils"

interface RepProfile {
  id: string
  email: string
  first_name: string
  last_name: string
  phone: string
  company_name: string
  address: string
  city: string
  state: string
  zip: string
}

interface NotificationSettings {
  email_new_order: boolean
  email_commission_paid: boolean
  email_customer_signup: boolean
  email_weekly_summary: boolean
}

type ActiveSection = "profile" | "password" | "notifications"

export default function RepSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeSection, setActiveSection] = useState<ActiveSection>("profile")
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Profile state
  const [profile, setProfile] = useState<RepProfile>({
    id: "",
    email: "",
    first_name: "",
    last_name: "",
    phone: "",
    company_name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  })

  // Password state
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    new: "",
    confirm: "",
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  // Notifications state
  const [notifications, setNotifications] = useState<NotificationSettings>({
    email_new_order: true,
    email_commission_paid: true,
    email_customer_signup: false,
    email_weekly_summary: true,
  })

  useEffect(() => {
    async function loadData() {
      try {
        const rep = await getCurrentRep()
        if (rep) {
          setProfile({
            id: rep.id,
            email: rep.email || "",
            first_name: rep.name?.split(" ")[0] || "",
            last_name: rep.name?.split(" ").slice(1).join(" ") || "",
            phone: "",
            company_name: "",
            address: "",
            city: "",
            state: "",
            zip: "",
          })
        }
      } catch (error) {
        console.error("[Rep Settings] Error loading data:", error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const handleSaveProfile = async () => {
    setSaving(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      // TODO: Save profile to database
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      setSuccessMessage("Profile updated successfully")
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (error) {
      setErrorMessage("Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (passwordForm.new !== passwordForm.confirm) {
      setErrorMessage("New passwords don't match")
      return
    }

    if (passwordForm.new.length < 8) {
      setErrorMessage("Password must be at least 8 characters")
      return
    }

    setSaving(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      // TODO: Change password via auth
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      setSuccessMessage("Password changed successfully")
      setPasswordForm({ current: "", new: "", confirm: "" })
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (error) {
      setErrorMessage("Failed to change password")
    } finally {
      setSaving(false)
    }
  }

  const handleSaveNotifications = async () => {
    setSaving(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      // TODO: Save notifications to database
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      setSuccessMessage("Notification preferences saved")
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (error) {
      setErrorMessage("Failed to save preferences")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-border border-t-white rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="px-6 py-12 md:px-12 lg:px-24 md:py-16">
      <div className="mx-auto max-w-4xl space-y-12">
        {/* Back Navigation */}
        <Link
          href="/rep"
          className="inline-flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="text-base font-medium">Back to Rep Portal</span>
        </Link>

        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-5xl font-bold tracking-tighter text-foreground md:text-6xl">Settings</h1>
          <p className="text-xl text-muted-foreground">Manage your account settings and preferences.</p>
        </div>

        {/* Success/Error Messages */}
        {successMessage && (
          <div className="rounded-2xl bg-emerald-500/20 border border-emerald-500/30 p-4 flex items-center gap-3">
            <Check className="h-5 w-5 text-emerald-400" />
            <p className="text-emerald-400">{successMessage}</p>
          </div>
        )}

        {errorMessage && (
          <div className="rounded-2xl bg-red-500/20 border border-red-500/30 p-4 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <p className="text-red-400">{errorMessage}</p>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="relative overflow-hidden rounded-2xl border border-border bg-foreground/[0.07] backdrop-blur-xl">
              <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
              <div className="relative z-10 p-3 space-y-1">
                <button
                  onClick={() => setActiveSection("profile")}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-left",
                    activeSection === "profile"
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground/60 hover:bg-foreground/10 hover:text-foreground"
                  )}
                >
                  <User className="w-5 h-5" />
                  <span>Profile</span>
                </button>
                <button
                  onClick={() => setActiveSection("password")}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-left",
                    activeSection === "password"
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground/60 hover:bg-foreground/10 hover:text-foreground"
                  )}
                >
                  <Lock className="w-5 h-5" />
                  <span>Password</span>
                </button>
                <button
                  onClick={() => setActiveSection("notifications")}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-left",
                    activeSection === "notifications"
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground/60 hover:bg-foreground/10 hover:text-foreground"
                  )}
                >
                  <Bell className="w-5 h-5" />
                  <span>Notifications</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Profile Section */}
            {activeSection === "profile" && (
              <div className="space-y-8">
                <div className="relative overflow-hidden rounded-3xl border border-border bg-foreground/5 p-8 backdrop-blur-xl">
                  <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
                  <div className="relative z-10 space-y-6">
                    <h2 className="text-2xl font-bold text-foreground">Profile Information</h2>
                    <p className="text-muted-foreground">Update your personal information and contact details.</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground/60">First Name</label>
                        <Input
                          value={profile.first_name}
                          onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                          className="h-12 bg-foreground/5 border-border rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground/60">Last Name</label>
                        <Input
                          value={profile.last_name}
                          onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
                          className="h-12 bg-foreground/5 border-border rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground/60">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                          className="h-12 pl-12 bg-foreground/5 border-border rounded-xl"
                          disabled
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">Contact support to change your email address</p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground/60">Phone</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                          type="tel"
                          value={profile.phone}
                          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                          placeholder="(555) 555-5555"
                          className="h-12 pl-12 bg-foreground/5 border-border rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground/60">Company Name</label>
                      <div className="relative">
                        <Building className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                          value={profile.company_name}
                          onChange={(e) => setProfile({ ...profile, company_name: e.target.value })}
                          placeholder="Your company"
                          className="h-12 pl-12 bg-foreground/5 border-border rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="border-t border-border pt-6">
                      <h3 className="text-lg font-semibold text-foreground mb-4">Address</h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground/60">Street Address</label>
                          <Input
                            value={profile.address}
                            onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                            placeholder="123 Main St"
                            className="h-12 bg-foreground/5 border-border rounded-xl"
                          />
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          <div className="col-span-2 space-y-2">
                            <label className="text-sm font-medium text-foreground/60">City</label>
                            <Input
                              value={profile.city}
                              onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                              className="h-12 bg-foreground/5 border-border rounded-xl"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground/60">State</label>
                            <Input
                              value={profile.state}
                              onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                              className="h-12 bg-foreground/5 border-border rounded-xl"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground/60">ZIP</label>
                            <Input
                              value={profile.zip}
                              onChange={(e) => setProfile({ ...profile, zip: e.target.value })}
                              className="h-12 bg-foreground/5 border-border rounded-xl"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button
                        onClick={handleSaveProfile}
                        disabled={saving}
                        className="h-12 px-6 bg-primary text-primary-foreground hover:bg-card/90 rounded-xl font-semibold disabled:opacity-50"
                      >
                        {saving ? (
                          <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        ) : (
                          <Save className="w-5 h-5 mr-2" />
                        )}
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Password Section */}
            {activeSection === "password" && (
              <div className="space-y-8">
                <div className="relative overflow-hidden rounded-3xl border border-border bg-foreground/5 p-8 backdrop-blur-xl">
                  <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
                  <div className="relative z-10 space-y-6">
                    <h2 className="text-2xl font-bold text-foreground">Change Password</h2>
                    <p className="text-muted-foreground">Update your password to keep your account secure.</p>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground/60">Current Password</label>
                        <div className="relative">
                          <Input
                            type={showPasswords.current ? "text" : "password"}
                            value={passwordForm.current}
                            onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                            className="h-12 bg-foreground/5 border-border rounded-xl pr-12"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                            className="absolute right-4 top-1/2 -translate-y-1/2"
                          >
                            {showPasswords.current ? (
                              <EyeOff className="h-5 w-5 text-muted-foreground" />
                            ) : (
                              <Eye className="h-5 w-5 text-muted-foreground" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground/60">New Password</label>
                        <div className="relative">
                          <Input
                            type={showPasswords.new ? "text" : "password"}
                            value={passwordForm.new}
                            onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                            className="h-12 bg-foreground/5 border-border rounded-xl pr-12"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                            className="absolute right-4 top-1/2 -translate-y-1/2"
                          >
                            {showPasswords.new ? (
                              <EyeOff className="h-5 w-5 text-muted-foreground" />
                            ) : (
                              <Eye className="h-5 w-5 text-muted-foreground" />
                            )}
                          </button>
                        </div>
                        <p className="text-xs text-muted-foreground">Must be at least 8 characters</p>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground/60">Confirm New Password</label>
                        <div className="relative">
                          <Input
                            type={showPasswords.confirm ? "text" : "password"}
                            value={passwordForm.confirm}
                            onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                            className={cn(
                              "h-12 bg-foreground/5 border-border rounded-xl pr-12",
                              passwordForm.confirm && passwordForm.new !== passwordForm.confirm && "border-red-500/50"
                            )}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                            className="absolute right-4 top-1/2 -translate-y-1/2"
                          >
                            {showPasswords.confirm ? (
                              <EyeOff className="h-5 w-5 text-muted-foreground" />
                            ) : (
                              <Eye className="h-5 w-5 text-muted-foreground" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button
                        onClick={handleChangePassword}
                        disabled={saving || !passwordForm.current || !passwordForm.new || !passwordForm.confirm}
                        className="h-12 px-6 bg-primary text-primary-foreground hover:bg-card/90 rounded-xl font-semibold disabled:opacity-50"
                      >
                        {saving ? (
                          <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        ) : (
                          <Lock className="w-5 h-5 mr-2" />
                        )}
                        Change Password
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Section */}
            {activeSection === "notifications" && (
              <div className="space-y-8">
                <div className="relative overflow-hidden rounded-3xl border border-border bg-foreground/5 p-8 backdrop-blur-xl">
                  <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
                  <div className="relative z-10 space-y-6">
                    <h2 className="text-2xl font-bold text-foreground">Email Notifications</h2>
                    <p className="text-muted-foreground">Choose what emails you want to receive.</p>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 rounded-xl bg-foreground/5 border border-border">
                        <div>
                          <p className="font-semibold text-foreground">New Order Alerts</p>
                          <p className="text-sm text-muted-foreground">Get notified when a customer places an order</p>
                        </div>
                        <Switch
                          checked={notifications.email_new_order}
                          onCheckedChange={(checked) => setNotifications({ ...notifications, email_new_order: checked })}
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-xl bg-foreground/5 border border-border">
                        <div>
                          <p className="font-semibold text-foreground">Commission Paid</p>
                          <p className="text-sm text-muted-foreground">Get notified when commission is paid to your wallet</p>
                        </div>
                        <Switch
                          checked={notifications.email_commission_paid}
                          onCheckedChange={(checked) => setNotifications({ ...notifications, email_commission_paid: checked })}
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-xl bg-foreground/5 border border-border">
                        <div>
                          <p className="font-semibold text-foreground">New Customer Signup</p>
                          <p className="text-sm text-muted-foreground">Get notified when a new customer is assigned to you</p>
                        </div>
                        <Switch
                          checked={notifications.email_customer_signup}
                          onCheckedChange={(checked) => setNotifications({ ...notifications, email_customer_signup: checked })}
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-xl bg-foreground/5 border border-border">
                        <div>
                          <p className="font-semibold text-foreground">Weekly Summary</p>
                          <p className="text-sm text-muted-foreground">Receive a weekly summary of your sales and commission</p>
                        </div>
                        <Switch
                          checked={notifications.email_weekly_summary}
                          onCheckedChange={(checked) => setNotifications({ ...notifications, email_weekly_summary: checked })}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button
                        onClick={handleSaveNotifications}
                        disabled={saving}
                        className="h-12 px-6 bg-primary text-primary-foreground hover:bg-card/90 rounded-xl font-semibold disabled:opacity-50"
                      >
                        {saving ? (
                          <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        ) : (
                          <Save className="w-5 h-5 mr-2" />
                        )}
                        Save Preferences
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

