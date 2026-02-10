"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import QRCode from "react-qr-code"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ClipboardList,
  Camera,
  Printer,
  Truck,
  Package,
  MapPin,
  X,
  Upload,
  Send,
  Loader2,
  Image as ImageIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { getSupabaseBrowserClient } from "@/lib/supabase-browser"
import {
  getOrderForFulfillment,
  generateFulfillmentToken,
  updateFulfillmentStep,
  getOrderPhotos,
  saveOrderPhoto,
  type FulfillmentOrder,
  type OrderPhoto,
} from "@/app/actions/fulfillment"
import { toast } from "react-hot-toast"

// ============================================================
// Step indicator
// ============================================================
const STEPS = [
  { key: "review", label: "Review", icon: ClipboardList },
  { key: "pick", label: "Pick & Pack", icon: Package },
  { key: "print", label: "Print Slip", icon: Printer },
  { key: "photos", label: "Photos", icon: Camera },
  { key: "ship", label: "Ship", icon: Truck },
] as const

type StepKey = (typeof STEPS)[number]["key"]

function StepIndicator({
  currentStep,
  completedSteps,
}: {
  currentStep: number
  completedSteps: Set<number>
}) {
  return (
    <div className="flex items-center justify-between mb-12">
      {STEPS.map((step, idx) => {
        const isActive = idx === currentStep
        const isComplete = completedSteps.has(idx)
        const Icon = step.icon

        return (
          <div key={step.key} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all",
                  isActive
                    ? "bg-foreground text-background"
                    : isComplete
                    ? "bg-foreground/10 text-foreground border border-border"
                    : "bg-foreground/[0.05] text-muted-foreground border border-border"
                )}
              >
                {isComplete ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <Icon className="h-4 w-4 md:h-5 md:w-5" />
                )}
              </div>
              <span
                className={cn(
                  "text-xs font-mono mt-2 hidden md:block",
                  isActive ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-px mx-2 md:mx-4",
                  isComplete ? "bg-foreground/20" : "bg-foreground/[0.07]"
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ============================================================
// Printable Packing Slip (hidden on screen, visible on print)
// ============================================================
function PackingSlip({
  order,
  qrUrl,
}: {
  order: FulfillmentOrder
  qrUrl: string
}) {
  const customerName =
    order.shipping_name ||
    order.customer_name ||
    [
      order.customers?.users?.first_name || order.customers?.first_name,
      order.customers?.users?.last_name || order.customers?.last_name,
    ]
      .filter(Boolean)
      .join(" ") ||
    "Customer"

  const address = [
    order.shipping_address_line1,
    order.shipping_address_line2,
    [order.shipping_city, order.shipping_state, order.shipping_zip]
      .filter(Boolean)
      .join(", "),
    order.shipping_country,
  ]
    .filter(Boolean)
    .join("\n")

  return (
    <div className="packing-slip-print">
      {/* Header */}
      <div style={{ borderBottom: "2px solid #000", paddingBottom: "16px", marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h1 style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>Modern Health</h1>
            <p style={{ fontSize: "11px", color: "#666", margin: "4px 0 0" }}>Quality Peptide Solutions</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <h2 style={{ fontSize: "18px", fontWeight: "bold", margin: 0, letterSpacing: "2px" }}>
              PACKING SLIP
            </h2>
            <p style={{ fontSize: "12px", color: "#666", margin: "4px 0 0" }}>
              Order #{order.order_number}
            </p>
            <p style={{ fontSize: "11px", color: "#666", margin: "2px 0 0" }}>
              {new Date(order.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Ship To */}
      <div style={{ marginBottom: "24px" }}>
        <p style={{ fontSize: "10px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "2px", color: "#888", margin: "0 0 6px" }}>
          Ship To
        </p>
        <p style={{ fontSize: "14px", fontWeight: "bold", margin: 0 }}>{customerName}</p>
        {order.customers?.company_name && (
          <p style={{ fontSize: "12px", margin: "2px 0 0" }}>{order.customers.company_name}</p>
        )}
        <p style={{ fontSize: "12px", margin: "4px 0 0", whiteSpace: "pre-line" }}>{address || "No address on file"}</p>
      </div>

      {/* Items Table */}
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "24px" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", padding: "8px 12px", borderBottom: "2px solid #000", fontSize: "10px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "2px" }}>
              Item
            </th>
            <th style={{ textAlign: "center", padding: "8px 12px", borderBottom: "2px solid #000", fontSize: "10px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "2px", width: "80px" }}>
              Qty
            </th>
            <th style={{ textAlign: "center", padding: "8px 12px", borderBottom: "2px solid #000", fontSize: "10px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "2px", width: "80px" }}>
              Checked
            </th>
          </tr>
        </thead>
        <tbody>
          {order.order_items.map((item, idx) => (
            <tr key={item.id} style={{ borderBottom: "1px solid #ddd" }}>
              <td style={{ padding: "10px 12px", fontSize: "13px" }}>
                {item.product_name}
                {item.product_barcode && (
                  <span style={{ fontSize: "10px", color: "#888", marginLeft: "8px" }}>
                    #{item.product_barcode}
                  </span>
                )}
              </td>
              <td style={{ textAlign: "center", padding: "10px 12px", fontSize: "14px", fontWeight: "bold" }}>
                {item.quantity}
              </td>
              <td style={{ textAlign: "center", padding: "10px 12px" }}>
                <span style={{ display: "inline-block", width: "20px", height: "20px", border: "2px solid #000", borderRadius: "3px" }} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Signature Block */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "32px", paddingTop: "16px", borderTop: "1px solid #ddd" }}>
        <div>
          <p style={{ fontSize: "10px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "2px", color: "#888", margin: "0 0 20px" }}>
            Packed By
          </p>
          <div style={{ borderBottom: "1px solid #000", height: "1px", marginBottom: "4px" }} />
          <p style={{ fontSize: "9px", color: "#aaa", margin: 0 }}>Signature</p>
        </div>
        <div>
          <p style={{ fontSize: "10px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "2px", color: "#888", margin: "0 0 20px" }}>
            Date
          </p>
          <div style={{ borderBottom: "1px solid #000", height: "1px", marginBottom: "4px" }} />
          <p style={{ fontSize: "9px", color: "#aaa", margin: 0 }}>MM / DD / YYYY</p>
        </div>
        <div style={{ gridColumn: "span 2" }}>
          <p style={{ fontSize: "10px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "2px", color: "#888", margin: "0 0 20px" }}>
            Quality Checked By
          </p>
          <div style={{ borderBottom: "1px solid #000", height: "1px", marginBottom: "4px" }} />
          <p style={{ fontSize: "9px", color: "#aaa", margin: 0 }}>Signature</p>
        </div>
      </div>

      {/* QR Code + Footer */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px", border: "1px solid #ddd", borderRadius: "8px" }}>
        <div style={{ flexShrink: 0 }}>
          <QRCode value={qrUrl} size={100} level="M" />
        </div>
        <div>
          <p style={{ fontSize: "11px", fontWeight: "bold", margin: "0 0 4px" }}>
            Scan to attach verification photos
          </p>
          <p style={{ fontSize: "10px", color: "#666", margin: 0 }}>
            Place this slip in the package for quality assurance documentation.
          </p>
        </div>
      </div>

      {/* Total */}
      <div style={{ marginTop: "16px", textAlign: "right" }}>
        <p style={{ fontSize: "11px", color: "#888", margin: 0 }}>
          {order.order_items.length} item{order.order_items.length !== 1 ? "s" : ""} |{" "}
          {order.order_items.reduce((s, i) => s + i.quantity, 0)} units
        </p>
      </div>
    </div>
  )
}

// ============================================================
// Main Wizard Page
// ============================================================
export default function FulfillmentWizardPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.orderId as string

  const [order, setOrder] = useState<FulfillmentOrder | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())

  // Step 2: Pick & Pack
  const [pickedItems, setPickedItems] = useState<Set<string>>(new Set())

  // Step 3: Print — token for QR
  const [fulfillmentToken, setFulfillmentToken] = useState<string | null>(null)

  // Step 4: Photos
  const [photos, setPhotos] = useState<OrderPhoto[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Step 5: Ship
  const [trackingNumber, setTrackingNumber] = useState("")
  const [carrier, setCarrier] = useState("")
  const [isShipping, setIsShipping] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  // Auth
  const [userRole, setUserRole] = useState<string | null>(null)

  // Load user role
  useEffect(() => {
    async function loadUser() {
      const supabase = getSupabaseBrowserClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        const { data: dbUser } = await supabase
          .from("users")
          .select("role")
          .eq("auth_id", session.user.id)
          .single()
        if (dbUser) setUserRole(dbUser.role)
      }
    }
    loadUser()
  }, [])

  // Load order
  const loadOrder = useCallback(async () => {
    setIsLoading(true)
    const result = await getOrderForFulfillment(orderId)
    if (result.success && result.order) {
      setOrder(result.order)
      setTrackingNumber(result.order.tracking_number || "")
      setCarrier(result.order.shipping_carrier || "")

      // Resume progress if already started
      if (result.order.fulfillment_token) {
        setFulfillmentToken(result.order.fulfillment_token)
      }
      if (result.order.status === "shipped" || result.order.status === "delivered") {
        setIsComplete(true)
      }
    }
    setIsLoading(false)
  }, [orderId])

  useEffect(() => {
    loadOrder()
  }, [loadOrder])

  // Load photos
  const loadPhotos = useCallback(async () => {
    const data = await getOrderPhotos(orderId)
    setPhotos(data)
  }, [orderId])

  useEffect(() => {
    loadPhotos()
  }, [loadPhotos])

  // Generate token on entering print step
  useEffect(() => {
    if (currentStep >= 2 && !fulfillmentToken) {
      generateFulfillmentToken(orderId).then((result) => {
        if (result.success && result.token) {
          setFulfillmentToken(result.token)
        }
      })
    }
  }, [currentStep, fulfillmentToken, orderId])

  // Helper: get customer display name
  const getCustomerName = () => {
    if (!order) return ""
    return (
      order.shipping_name ||
      order.customer_name ||
      [
        order.customers?.users?.first_name || order.customers?.first_name,
        order.customers?.users?.last_name || order.customers?.last_name,
      ]
        .filter(Boolean)
        .join(" ") ||
      "Unknown Customer"
    )
  }

  const getAddress = () => {
    if (!order) return null
    return [
      order.shipping_address_line1,
      order.shipping_address_line2,
      [order.shipping_city, order.shipping_state, order.shipping_zip].filter(Boolean).join(", "),
      order.shipping_country,
    ].filter(Boolean)
  }

  // Step navigation
  const completeStep = (stepIdx: number) => {
    setCompletedSteps((prev) => new Set([...prev, stepIdx]))
  }

  const goNext = () => {
    completeStep(currentStep)
    setCurrentStep((s) => Math.min(s + 1, STEPS.length - 1))
  }

  const goBack = () => {
    setCurrentStep((s) => Math.max(s - 1, 0))
  }

  // Step 2: Start packing
  const handleStartPacking = async () => {
    if (!order) return
    if (order.status === "pending" || order.status === "paid" || order.status === "payment_requested") {
      await updateFulfillmentStep(orderId, "start_packing")
      setOrder({ ...order, status: "processing" })
    }
    goNext()
  }

  // Step 2: Toggle pick item
  const togglePick = (itemId: string) => {
    setPickedItems((prev) => {
      const next = new Set(prev)
      if (next.has(itemId)) next.delete(itemId)
      else next.add(itemId)
      return next
    })
  }

  const allPicked = order ? pickedItems.size === order.order_items.length : false

  // Step 3: Print
  const handlePrint = () => {
    window.print()
  }

  // Step 4: Photo upload
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return
    setIsUploading(true)

    const file = e.target.files[0]
    try {
      const supabase = getSupabaseBrowserClient()
      const fileName = `${orderId}/${Date.now()}-${file.name}`

      const { data, error } = await supabase.storage
        .from("order-fulfillment-photos")
        .upload(fileName, file)

      if (error) {
        // Try creating the bucket if it doesn't exist
        if (error.message?.includes("not found")) {
          // Bucket might not exist yet — try a different bucket
          const { data: data2, error: error2 } = await supabase.storage
            .from("supplier-shipment-photos")
            .upload(`fulfillment/${fileName}`, file)
          if (error2) throw error2
          const { data: { publicUrl } } = supabase.storage
            .from("supplier-shipment-photos")
            .getPublicUrl(`fulfillment/${data2.path}`)
          await saveOrderPhoto(orderId, publicUrl, file.name, `fulfillment/${data2.path}`)
        } else {
          throw error
        }
      } else {
        const { data: { publicUrl } } = supabase.storage
          .from("order-fulfillment-photos")
          .getPublicUrl(data.path)
        await saveOrderPhoto(orderId, publicUrl, file.name, data.path)
      }

      toast.success("Photo uploaded")
      await loadPhotos()
    } catch (error: unknown) {
      console.error("Upload error:", error)
      toast.error("Failed to upload photo")
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  // Step 5: Ship
  const handleShip = async () => {
    if (!order) return
    setIsShipping(true)

    const result = await updateFulfillmentStep(orderId, "ship", {
      trackingNumber: trackingNumber || undefined,
      shippingCarrier: carrier || undefined,
    })

    if (result.success) {
      toast.success("Order marked as shipped")
      setIsComplete(true)
      completeStep(4)
    } else {
      toast.error(result.error || "Failed to ship order")
    }
    setIsShipping(false)
  }

  // Build QR URL
  const baseUrl = typeof window !== "undefined" ? window.location.origin : ""
  const qrUrl = fulfillmentToken
    ? `${baseUrl}/upload-photo/${orderId}?token=${fulfillmentToken}`
    : ""

  // Back link based on user role
  const backHref =
    userRole === "supplier" ? "/supplier/orders" : "/admin/orders"

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="glass-button rounded-2xl p-6 inline-block mb-6">
            <Package className="h-8 w-8 animate-pulse" />
          </div>
          <p className="text-muted-foreground font-mono">Loading order...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground font-mono mb-4">Order not found</p>
          <Link href={backHref} className="text-foreground font-mono hover:underline">
            Go back
          </Link>
        </div>
      </div>
    )
  }

  // Completion screen
  if (isComplete) {
    return (
      <div className="min-h-screen py-24 md:py-32 px-6 md:px-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="glass-button rounded-full p-8 inline-block mb-8">
            <CheckCircle2 className="h-12 w-12" />
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-light mb-4">
            Order Fulfilled
          </h1>
          <p className="text-lg text-muted-foreground mb-2 font-mono">
            #{order.order_number}
          </p>
          <p className="text-muted-foreground mb-12">
            {getCustomerName()} — {order.order_items.length} items shipped
          </p>

          {(trackingNumber || order.tracking_number) && (
            <div className="glass-card rounded-2xl p-6 mb-8 text-left">
              <p className="text-xs font-mono tracking-widest text-muted-foreground uppercase mb-3">
                Tracking
              </p>
              <p className="font-mono text-foreground">{trackingNumber || order.tracking_number}</p>
              {(carrier || order.shipping_carrier) && (
                <p className="text-sm text-muted-foreground mt-1">{carrier || order.shipping_carrier}</p>
              )}
            </div>
          )}

          <div className="flex gap-4 justify-center">
            <Link
              href={backHref}
              className="px-6 py-3 rounded-xl glass-button font-mono text-sm"
            >
              Back to Orders
            </Link>
            <Link
              href={userRole === "supplier" ? `/supplier/orders` : `/admin/orders/${orderId}`}
              className="px-6 py-3 rounded-xl bg-foreground text-background font-mono text-sm"
            >
              View Order
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Screen content (hidden on print) */}
      <div className="min-h-screen py-24 md:py-32 px-6 md:px-12 print:hidden">
        <div className="max-w-3xl mx-auto">
          {/* Back */}
          <Link
            href={backHref}
            className="inline-flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors mb-12"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-mono tracking-wide">Back to Orders</span>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <p className="text-sm font-mono tracking-[0.3em] text-muted-foreground uppercase mb-4">
              Fulfill Order
            </p>
            <h1 className="font-serif text-3xl md:text-4xl font-light">
              #{order.order_number}
            </h1>
            <p className="text-muted-foreground mt-2">{getCustomerName()}</p>
          </div>

          {/* Progress */}
          <StepIndicator currentStep={currentStep} completedSteps={completedSteps} />

          {/* ==================== STEP 1: Review ==================== */}
          {currentStep === 0 && (
            <div className="space-y-6">
              {/* Customer + Address */}
              <div className="glass-card rounded-3xl p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <p className="text-xs font-mono tracking-widest text-muted-foreground uppercase">
                    Shipping Address
                  </p>
                </div>
                <p className="text-foreground font-light text-lg">{getCustomerName()}</p>
                {order.customers?.company_name && (
                  <p className="text-muted-foreground mt-1">{order.customers.company_name}</p>
                )}
                {getAddress() && getAddress()!.length > 0 ? (
                  <div className="mt-3 space-y-1">
                    {getAddress()!.map((line, i) => (
                      <p key={i} className="text-muted-foreground">{line}</p>
                    ))}
                  </div>
                ) : (
                  <p className="text-destructive-foreground mt-3 flex items-center gap-2">
                    <X className="h-4 w-4" />
                    No shipping address on file
                  </p>
                )}
              </div>

              {/* Items */}
              <div className="glass-card rounded-3xl p-6 md:p-8">
                <p className="text-xs font-mono tracking-widest text-muted-foreground uppercase mb-6">
                  Order Items ({order.order_items.length})
                </p>
                <div className="space-y-3">
                  {order.order_items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between bg-foreground/[0.03] border border-border rounded-xl p-4"
                    >
                      <div>
                        <p className="text-foreground">{item.product_name}</p>
                        {item.product_barcode && (
                          <p className="text-xs text-muted-foreground font-mono mt-1">
                            #{item.product_barcode}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-lg font-light">{item.quantity}</p>
                        <p className="text-xs text-muted-foreground font-mono">
                          ${Number(item.unit_price).toFixed(2)} ea
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="mt-6 pt-6 border-t border-border space-y-2">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="font-mono">${Number(order.subtotal).toFixed(2)}</span>
                  </div>
                  {Number(order.discount_amount) > 0 && (
                    <div className="flex justify-between text-muted-foreground">
                      <span>Discount</span>
                      <span className="font-mono">-${Number(order.discount_amount).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-foreground pt-2 border-t border-border">
                    <span className="font-light">Total</span>
                    <span className="font-mono text-xl font-light">
                      ${Number(order.total_amount).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleStartPacking}
                className="w-full py-4 rounded-2xl bg-foreground text-background font-mono hover:bg-foreground/90 transition-colors flex items-center justify-center gap-2"
              >
                Confirm & Start Packing
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          )}

          {/* ==================== STEP 2: Pick & Pack ==================== */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="glass-card rounded-3xl p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <p className="text-xs font-mono tracking-widest text-muted-foreground uppercase">
                    Pick Items
                  </p>
                  <span className="text-sm font-mono text-muted-foreground">
                    {pickedItems.size} of {order.order_items.length} picked
                  </span>
                </div>

                <div className="space-y-3">
                  {order.order_items.map((item) => {
                    const isPicked = pickedItems.has(item.id)
                    return (
                      <button
                        key={item.id}
                        onClick={() => togglePick(item.id)}
                        className={cn(
                          "w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left",
                          isPicked
                            ? "bg-foreground/[0.07] border-border"
                            : "bg-foreground/[0.03] border-border hover:bg-foreground/[0.05]"
                        )}
                      >
                        <div
                          className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all",
                            isPicked
                              ? "bg-foreground text-background"
                              : "border border-border"
                          )}
                        >
                          {isPicked && <Check className="h-4 w-4" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={cn("text-foreground", isPicked && "line-through opacity-60")}>
                            {item.product_name}
                          </p>
                          {item.product_barcode && (
                            <p className="text-xs text-muted-foreground font-mono mt-1">
                              #{item.product_barcode}
                            </p>
                          )}
                        </div>
                        <span className="font-mono text-xl font-light flex-shrink-0">
                          {item.quantity}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-foreground/[0.07] rounded-full h-2">
                <div
                  className="bg-foreground h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${order.order_items.length > 0 ? (pickedItems.size / order.order_items.length) * 100 : 0}%`,
                  }}
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={goBack}
                  className="flex-1 py-4 rounded-2xl glass-button font-mono flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="h-5 w-5" />
                  Back
                </button>
                <button
                  onClick={goNext}
                  disabled={!allPicked}
                  className="flex-1 py-4 rounded-2xl bg-foreground text-background font-mono hover:bg-foreground/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Continue
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {/* ==================== STEP 3: Print Packing Slip ==================== */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="glass-card rounded-3xl p-6 md:p-8 text-center">
                <div className="glass-button rounded-2xl p-6 inline-block mb-6">
                  <Printer className="h-10 w-10" />
                </div>
                <h2 className="font-serif text-2xl md:text-3xl font-light mb-4">
                  Print Packing Slip
                </h2>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  Print the packing slip to include in the package. It contains a checklist of items,
                  signature lines for quality verification, and a QR code for photo documentation.
                </p>
                <button
                  onClick={handlePrint}
                  className="px-8 py-4 rounded-2xl bg-foreground text-background font-mono hover:bg-foreground/90 transition-colors inline-flex items-center gap-2"
                >
                  <Printer className="h-5 w-5" />
                  Print Packing Slip
                </button>
              </div>

              {/* QR preview */}
              {qrUrl && (
                <div className="glass-card rounded-3xl p-6 md:p-8">
                  <p className="text-xs font-mono tracking-widest text-muted-foreground uppercase mb-6">
                    QR Code Preview
                  </p>
                  <div className="flex items-center gap-6">
                    <div className="bg-white p-3 rounded-xl flex-shrink-0">
                      <QRCode value={qrUrl} size={100} level="M" />
                    </div>
                    <div>
                      <p className="text-foreground font-light">
                        Scan this code with a phone to upload verification photos
                      </p>
                      <p className="text-xs text-muted-foreground font-mono mt-2 break-all">
                        {qrUrl}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={goBack}
                  className="flex-1 py-4 rounded-2xl glass-button font-mono flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="h-5 w-5" />
                  Back
                </button>
                <button
                  onClick={goNext}
                  className="flex-1 py-4 rounded-2xl bg-foreground text-background font-mono hover:bg-foreground/90 transition-colors flex items-center justify-center gap-2"
                >
                  Continue
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {/* ==================== STEP 4: Photos ==================== */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="glass-card rounded-3xl p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <p className="text-xs font-mono tracking-widest text-muted-foreground uppercase">
                    Photos ({photos.length})
                  </p>
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl glass-button text-sm font-mono disabled:opacity-50"
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Camera className="h-4 w-4" />
                          Take Photo
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {photos.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {photos.map((photo) => (
                      <div
                        key={photo.id}
                        className="relative rounded-xl overflow-hidden aspect-square border border-border"
                      >
                        <img
                          src={photo.url}
                          alt={photo.filename || "Order photo"}
                          className="w-full h-full object-cover"
                        />
                        {photo.filename && (
                          <div className="absolute bottom-0 left-0 right-0 bg-foreground/60 px-3 py-2">
                            <p className="text-xs text-foreground font-mono truncate">{photo.filename}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 border border-dashed border-border rounded-xl">
                    <ImageIcon className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground font-mono mb-2">
                      No photos yet
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Take photos here or scan the QR code on the packing slip
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={goBack}
                  className="flex-1 py-4 rounded-2xl glass-button font-mono flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="h-5 w-5" />
                  Back
                </button>
                <button
                  onClick={goNext}
                  className="flex-1 py-4 rounded-2xl bg-foreground text-background font-mono hover:bg-foreground/90 transition-colors flex items-center justify-center gap-2"
                >
                  {photos.length > 0 ? "Continue" : "Skip Photos"}
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {/* ==================== STEP 5: Ship ==================== */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="glass-card rounded-3xl p-6 md:p-8">
                <p className="text-xs font-mono tracking-widest text-muted-foreground uppercase mb-6">
                  Shipping Details
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono tracking-widest text-muted-foreground uppercase mb-2">
                      Tracking Number
                    </label>
                    <input
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="Enter tracking number..."
                      className="w-full px-4 py-3 rounded-xl bg-foreground/[0.04] border border-border text-foreground font-mono focus:outline-none focus:border-border transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono tracking-widest text-muted-foreground uppercase mb-2">
                      Carrier
                    </label>
                    <input
                      value={carrier}
                      onChange={(e) => setCarrier(e.target.value)}
                      placeholder="DHL, FedEx, UPS, USPS..."
                      className="w-full px-4 py-3 rounded-xl bg-foreground/[0.04] border border-border text-foreground font-mono focus:outline-none focus:border-border transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="glass-card rounded-3xl p-6 md:p-8">
                <p className="text-xs font-mono tracking-widest text-muted-foreground uppercase mb-4">
                  Summary
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Customer</span>
                    <span className="text-foreground">{getCustomerName()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Items</span>
                    <span className="text-foreground font-mono">{order.order_items.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Units</span>
                    <span className="text-foreground font-mono">
                      {order.order_items.reduce((s, i) => s + i.quantity, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Photos</span>
                    <span className="text-foreground font-mono">{photos.length}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-border">
                    <span className="text-foreground">Order Total</span>
                    <span className="text-foreground font-mono text-lg">
                      ${Number(order.total_amount).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={goBack}
                  className="flex-1 py-4 rounded-2xl glass-button font-mono flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="h-5 w-5" />
                  Back
                </button>
                <button
                  onClick={handleShip}
                  disabled={isShipping}
                  className="flex-1 py-4 rounded-2xl bg-foreground text-background font-mono hover:bg-foreground/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isShipping ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Shipping...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      Mark as Shipped
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Printable Packing Slip (only visible in print) */}
      <PackingSlip order={order} qrUrl={qrUrl || `${baseUrl}/upload-photo/${orderId}`} />

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          /* Hide everything except packing slip */
          body * {
            visibility: hidden;
          }
          .packing-slip-print,
          .packing-slip-print * {
            visibility: visible !important;
          }
          .packing-slip-print {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 24px;
            background: white !important;
            color: black !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          /* Reset background for print */
          body {
            background: white !important;
          }
        }
        /* Hide packing slip on screen */
        @media screen {
          .packing-slip-print {
            display: none;
          }
        }
      `}</style>
    </>
  )
}
