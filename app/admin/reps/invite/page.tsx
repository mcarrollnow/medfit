"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, UserPlus, Mail, Percent, User, Lock, Copy, Check, Eye, EyeOff, KeyRound } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { inviteRep, createRepWithPassword } from "@/app/actions/rep-management"

type CreationMode = "invite" | "password"

function generateSecurePassword(length = 12): string {
  const lowercase = "abcdefghijklmnopqrstuvwxyz"
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  const numbers = "0123456789"
  const special = "!@#$%^&*"
  const all = lowercase + uppercase + numbers + special
  
  // Ensure at least one of each type
  let password = ""
  password += lowercase[Math.floor(Math.random() * lowercase.length)]
  password += uppercase[Math.floor(Math.random() * uppercase.length)]
  password += numbers[Math.floor(Math.random() * numbers.length)]
  password += special[Math.floor(Math.random() * special.length)]
  
  // Fill the rest
  for (let i = password.length; i < length; i++) {
    password += all[Math.floor(Math.random() * all.length)]
  }
  
  // Shuffle the password
  return password.split("").sort(() => Math.random() - 0.5).join("")
}

export default function InviteRepPage() {
  const router = useRouter()
  const [mode, setMode] = useState<CreationMode>("password")
  const [email, setEmail] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [commissionRate, setCommissionRate] = useState("10")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [createdCredentials, setCreatedCredentials] = useState<{ email: string; password: string } | null>(null)
  const [copied, setCopied] = useState<"email" | "password" | "both" | null>(null)

  function handleGeneratePassword() {
    const newPassword = generateSecurePassword(12)
    setPassword(newPassword)
    setShowPassword(true) // Show it so user can see what was generated
  }

  async function copyToClipboard(text: string, type: "email" | "password" | "both") {
    await navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (mode === "invite") {
        const result = await inviteRep({
          email,
          first_name: firstName,
          last_name: lastName,
          commission_rate: Number.parseFloat(commissionRate) || 10,
        })

        if (result.success) {
          setSuccess(true)
          setTimeout(() => {
            router.push("/admin/reps")
          }, 2000)
        } else {
          setError(result.error || "Failed to send invitation")
        }
      } else {
        // Create with password
        if (!password || password.length < 8) {
          setError("Password must be at least 8 characters")
          setLoading(false)
          return
        }

        const result = await createRepWithPassword({
          email,
          password,
          first_name: firstName,
          last_name: lastName,
          commission_rate: Number.parseFloat(commissionRate) || 10,
        })

        if (result.success) {
          setSuccess(true)
          setCreatedCredentials({ email, password })
        } else {
          setError(result.error || "Failed to create rep")
        }
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen px-4 py-6 lg:px-0">
      <div className="mx-auto max-w-xl space-y-8">
        {/* Header */}
        <div className="space-y-6">
          <Link
            href="/admin/reps"
            className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Representatives</span>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tighter text-white lg:text-5xl">Add Representative</h1>
            <p className="mt-3 text-base lg:text-lg text-white/50">Create a new sales rep account</p>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="flex gap-2 p-1 rounded-2xl border border-white/10 bg-white/5">
          <button
            type="button"
            onClick={() => setMode("password")}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-all rounded-xl ${
              mode === "password"
                ? "bg-white text-black"
                : "text-white/60 hover:text-white"
            }`}
          >
            <KeyRound className="h-4 w-4 inline-block mr-2" />
            Create with Password
          </button>
          <button
            type="button"
            onClick={() => setMode("invite")}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-all rounded-xl ${
              mode === "invite"
                ? "bg-white text-black"
                : "text-white/60 hover:text-white"
            }`}
          >
            <Mail className="h-4 w-4 inline-block mr-2" />
            Send Email Invite
          </button>
        </div>

        {/* Form */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 lg:p-8 backdrop-blur-xl">
          {success && mode === "password" && createdCredentials ? (
            <div className="space-y-6">
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 lg:h-20 lg:w-20 items-center justify-center rounded-2xl lg:rounded-3xl bg-emerald-500/20">
                  <UserPlus className="h-8 w-8 lg:h-10 lg:w-10 text-emerald-400" />
                </div>
                <h3 className="mt-4 lg:mt-6 text-xl lg:text-2xl font-bold text-white">Rep Account Created!</h3>
                <p className="mt-2 lg:mt-3 text-sm lg:text-base text-white/50">
                  Share these login credentials with {firstName}
                </p>
              </div>

              {/* Credentials Display */}
              <div className="space-y-4 p-4 lg:p-6 rounded-xl border border-white/10 bg-black/30">
                <div className="space-y-2">
                  <Label className="text-white/60 text-sm">Email</Label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 p-3 rounded-lg bg-white/5 text-white font-mono text-sm break-all">
                      {createdCredentials.email}
                    </code>
                    <button
                      onClick={() => copyToClipboard(createdCredentials.email, "email")}
                      className="p-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      {copied === "email" ? (
                        <Check className="h-5 w-5 text-emerald-400" />
                      ) : (
                        <Copy className="h-5 w-5 text-white/60" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-white/60 text-sm">Temporary Password</Label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 p-3 rounded-lg bg-white/5 text-white font-mono text-sm break-all">
                      {createdCredentials.password}
                    </code>
                    <button
                      onClick={() => copyToClipboard(createdCredentials.password, "password")}
                      className="p-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      {copied === "password" ? (
                        <Check className="h-5 w-5 text-emerald-400" />
                      ) : (
                        <Copy className="h-5 w-5 text-white/60" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => copyToClipboard(
                    `Email: ${createdCredentials.email}\nPassword: ${createdCredentials.password}\n\nLogin at: ${window.location.origin}/login`,
                    "both"
                  )}
                  className="w-full py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-medium transition-colors"
                >
                  {copied === "both" ? (
                    <>
                      <Check className="h-4 w-4 inline-block mr-2" />
                      Copied All!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 inline-block mr-2" />
                      Copy All Credentials
                    </>
                  )}
                </button>
              </div>

              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <p className="text-amber-300 text-sm">
                  <strong>Important:</strong> The rep should change their password after first login. They can do this from their profile settings or via the "Forgot Password" link.
                </p>
              </div>

              <button
                onClick={() => router.push("/admin/reps")}
                className="w-full h-14 rounded-2xl bg-white text-base lg:text-lg font-bold text-black transition-all hover:scale-[1.01] active:scale-[0.99]"
              >
                Go to Representatives
              </button>
            </div>
          ) : success && mode === "invite" ? (
            <div className="text-center py-8 lg:py-12">
              <div className="mx-auto flex h-16 w-16 lg:h-20 lg:w-20 items-center justify-center rounded-2xl lg:rounded-3xl bg-emerald-500/20">
                <UserPlus className="h-8 w-8 lg:h-10 lg:w-10 text-emerald-400" />
              </div>
              <h3 className="mt-4 lg:mt-6 text-xl lg:text-2xl font-bold text-white">Invitation Sent!</h3>
              <p className="mt-2 lg:mt-3 text-sm lg:text-lg text-white/50">
                An email has been sent to {email} with instructions to set up their account.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <div className="grid gap-4 lg:gap-6 md:grid-cols-2">
                <div className="space-y-2 lg:space-y-3">
                  <Label className="text-white/60 text-sm lg:text-base">First Name</Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30" />
                    <Input
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="John"
                      required
                      className="rounded-xl h-12 lg:h-14 pl-12 bg-white/5 border-white/10 text-white text-base lg:text-lg placeholder:text-white/30"
                    />
                  </div>
                </div>
                <div className="space-y-2 lg:space-y-3">
                  <Label className="text-white/60 text-sm lg:text-base">Last Name</Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30" />
                    <Input
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Doe"
                      required
                      className="rounded-xl h-12 lg:h-14 pl-12 bg-white/5 border-white/10 text-white text-base lg:text-lg placeholder:text-white/30"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2 lg:space-y-3">
                <Label className="text-white/60 text-sm lg:text-base">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    required
                    className="rounded-xl h-12 lg:h-14 pl-12 bg-white/5 border-white/10 text-white text-base lg:text-lg placeholder:text-white/30"
                  />
                </div>
              </div>

              {mode === "password" && (
                <div className="space-y-2 lg:space-y-3">
                  <Label className="text-white/60 text-sm lg:text-base">Temporary Password</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Min 8 characters"
                        required
                        minLength={8}
                        className="rounded-xl h-12 lg:h-14 pl-12 pr-12 bg-white/5 border-white/10 text-white text-base lg:text-lg placeholder:text-white/30"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={handleGeneratePassword}
                      className="px-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-sm font-medium transition-all whitespace-nowrap"
                    >
                      Generate
                    </button>
                  </div>
                  <p className="text-xs lg:text-sm text-white/40">
                    The rep will use this password to log in. They can change it later.
                  </p>
                </div>
              )}

              <div className="space-y-2 lg:space-y-3">
                <Label className="text-white/60 text-sm lg:text-base">Commission Rate (%)</Label>
                <div className="relative">
                  <Percent className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30" />
                  <Input
                    type="number"
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(e.target.value)}
                    placeholder="10"
                    min="0"
                    max="100"
                    step="0.1"
                    className="rounded-xl h-12 lg:h-14 pl-12 bg-white/5 border-white/10 text-white text-base lg:text-lg placeholder:text-white/30"
                  />
                </div>
                <p className="text-xs lg:text-sm text-white/40">The percentage of each sale this rep will earn as commission</p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 lg:h-14 rounded-2xl bg-white text-base lg:text-lg font-bold text-black transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
              >
                {loading 
                  ? (mode === "invite" ? "Sending Invitation..." : "Creating Rep...")
                  : (mode === "invite" ? "Send Invitation" : "Create Rep Account")
                }
              </button>
            </form>
          )}
        </div>

        {/* Info */}
        {!success && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 lg:p-6 backdrop-blur-xl">
            <h3 className="font-semibold text-white mb-3">
              {mode === "password" ? "How it works" : "What happens next?"}
            </h3>
            {mode === "password" ? (
              <ul className="space-y-2 text-white/50 text-sm lg:text-base">
                <li className="flex items-start gap-3">
                  <span className="text-white/30 font-mono">1.</span>
                  Account is created immediately and ready to use
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-white/30 font-mono">2.</span>
                  Share the login credentials with your rep
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-white/30 font-mono">3.</span>
                  They can log in at {typeof window !== 'undefined' ? window.location.origin : ''}/login
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-white/30 font-mono">4.</span>
                  Recommend they change their password via "Forgot Password"
                </li>
              </ul>
            ) : (
              <ul className="space-y-2 text-white/50 text-sm lg:text-base">
                <li className="flex items-start gap-3">
                  <span className="text-white/30 font-mono">1.</span>
                  An email invitation will be sent to the provided address
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-white/30 font-mono">2.</span>
                  The recipient clicks the link to accept and create their account
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-white/30 font-mono">3.</span>
                  They'll appear in your rep list once they complete signup
                </li>
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
