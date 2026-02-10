'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  Package,
  Truck,
  User,
  Mail,
  Phone,
  MapPin,
  Edit2,
  Plus,
  Trash2,
  DollarSign,
  Calendar,
  AlertCircle,
  RefreshCw,
  CreditCard,
  X,
  Check,
  RotateCcw,
  MessageSquare,
  Send,
  Loader2,
  Printer,
  QrCode,
  ExternalLink,
  Copy,
  Download,
  ClipboardList
} from 'lucide-react';
import { RefundModal } from '@/components/admin/refund-modal';
import { motion, AnimatePresence } from 'framer-motion';
import { TrackingInfoDisplay } from '@/components/dashboard/tracking-info-display';
import { PaymentEventsTimeline } from '@/components/admin/payment-events-timeline';
import { OrderPhotos } from '@/components/admin/order-photos';

type OrderStatus = 'pending' | 'payment_requested' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

interface OrderData {
  id: string;
  order_number: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  subtotal: number;
  discount_amount: number;
  tax_amount: number;
  shipping_amount: number;
  total_amount: number;
  admin_notes?: string;
  notes?: string;
  tracking_number?: string;
  shipping_carrier?: string;
  created_at: string;
  updated_at: string;
  payment_date?: string;
  customer_id: string;
  stripe_payment_intent_id?: string;
  stripe_checkout_session_id?: string;
  stripe_receipt_url?: string;
  payment_failed_at?: string;
  payment_failure_reason?: string;
  payment_method_details?: {
    type?: string;
    last4?: string;
    brand?: string;
  };
  // Refund fields
  refund_id?: string;
  refund_amount?: number;
  refund_status?: 'pending' | 'processing' | 'succeeded' | 'failed' | 'cancelled';
  refund_destination?: 'original_payment' | 'store_credit' | 'manual';
  refund_customer_message?: string;
  refund_initiated_at?: string;
  refund_completed_at?: string;
  // Shopify payment fields
  shopify_invoice_id?: string;
  shopify_invoice_url?: string;
  shopify_order_id?: string;
  shopify_transaction_id?: string;
  shopify_payment_gateway?: string;
  shopify_payment_method?: string;
  shopify_payment_amount?: number;
  card_brand?: string;
  card_last_four?: string;
  card_exp_month?: number;
  card_exp_year?: number;
  billing_name?: string;
  billing_address_line1?: string;
  billing_city?: string;
  billing_state?: string;
  billing_zip?: string;
  billing_country?: string;
  paid_at?: string;
  payment_method?: string;
  customers?: {
    id: string;
    users?: {
      first_name?: string;
      last_name?: string;
      email?: string;
      phone?: string;
    } | Array<{
      first_name?: string;
      last_name?: string;
      email?: string;
      phone?: string;
    }>;
    shipping_address_line1?: string;
    shipping_city?: string;
    shipping_state?: string;
    shipping_zip?: string;
    shipping_country?: string;
    customer_type?: 'retail' | 'b2b';
    company_name?: string;
    phone?: string;
  };
  order_items?: Array<{
    id: string;
    product_name: string;
    product_barcode?: string;
    quantity: number;
    unit_price: number;
    total_price: number;
  }>;
}

export default function OrderDetailEditPage() {
  const params = useParams();
  const router = useRouter();

  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form state
  const [orderStatus, setOrderStatus] = useState<OrderStatus>('pending');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('pending');
  const [adminNotes, setAdminNotes] = useState('');
  const [shippingInfo, setShippingInfo] = useState({
    carrier: '',
    trackingNumber: ''
  });
  
  // Editable amounts
  const [editingAmounts, setEditingAmounts] = useState(false);
  const [editSubtotal, setEditSubtotal] = useState(0);
  const [editDiscount, setEditDiscount] = useState(0);
  const [editTax, setEditTax] = useState(0);
  const [editShipping, setEditShipping] = useState(0);
  
  // Refund modal state
  const [refundModalOpen, setRefundModalOpen] = useState(false);
  
  // SMS tracking notification state
  const [sendingTrackingSms, setSendingTrackingSms] = useState(false);
  const [trackingSmsSuccess, setTrackingSmsSuccess] = useState(false);
  const [trackingSmsError, setTrackingSmsError] = useState<string | null>(null);
  
  // Print label state
  const [printingLabel, setPrintingLabel] = useState(false);
  const [printLabelSuccess, setPrintLabelSuccess] = useState(false);
  const [printLabelError, setPrintLabelError] = useState<string | null>(null);
  
  // Pricing breakdown state
  const [pricingBreakdown, setPricingBreakdown] = useState<{
    total_cost: number;
    minimum_price: number;
    maximum_price: number;
    commission_pool: number;
    discount_applied: number;
    commission_after_discount: number;
    rep_commission_rate: number;
    rep_commission_amount: number;
    min_markup_used: number;
    max_markup_used: number;
  } | null>(null);
  
  // Delete order state
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  

  const loadOrderDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/admin/orders/${params.id}`, {
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to load order');
      }

      const orderData: OrderData = await response.json();
      
      setOrder(orderData);
      setOrderStatus(orderData.status || 'pending');
      setPaymentStatus(orderData.payment_status || 'pending');
      setAdminNotes(orderData.admin_notes || orderData.notes || '');
      setShippingInfo({
        carrier: orderData.shipping_carrier || '',
        trackingNumber: orderData.tracking_number || ''
      });
      // Initialize editable amounts
      setEditSubtotal(orderData.subtotal || 0);
      setEditDiscount(orderData.discount_amount || 0);
      setEditTax(orderData.tax_amount || 0);
      setEditShipping(orderData.shipping_amount || 0);
      
      // Fetch pricing breakdown for this order
      try {
        const pricingResponse = await fetch(`/api/admin/orders/${params.id}/pricing-breakdown`, {
          credentials: 'include'
        });
        if (pricingResponse.ok) {
          const pricingData = await pricingResponse.json();
          setPricingBreakdown(pricingData);
        }
      } catch (pricingErr) {
        console.log('No pricing breakdown available for this order');
      }

    } catch (err) {
      console.error('Error loading order:', err);
      setError(err instanceof Error ? err.message : 'Failed to load order details');
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    loadOrderDetails();
  }, [loadOrderDetails]);

  const handleSaveOrder = async () => {
    if (!order) return;

    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(`/api/admin/orders/${order.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          status: orderStatus,
          payment_status: paymentStatus,
          notes: adminNotes,
          tracking_number: shippingInfo.trackingNumber,
          shipping_carrier: shippingInfo.carrier,
          // Include amounts if editing
          subtotal: editSubtotal,
          discount_amount: editDiscount,
          tax_amount: editTax,
          shipping_amount: editShipping,
          total_amount: editSubtotal - editDiscount + editTax + editShipping
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save order');
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      
      // Close edit mode
      setEditingAmounts(false);
      
      // Small delay to ensure Supabase has committed the data
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Reload to get updated data
      await loadOrderDetails();
    } catch (err) {
      console.error('Error saving order:', err);
      setError(err instanceof Error ? err.message : 'Failed to save order');
    } finally {
      setSaving(false);
    }
  };

  const handleSendTrackingSms = async () => {
    if (!order) return;

    // Get customer phone
    const customerPhone = customerUser?.phone || order.customers?.phone;
    if (!customerPhone) {
      setTrackingSmsError('No phone number available for this customer');
      return;
    }

    // Check if tracking is available
    const trackingNum = shippingInfo.trackingNumber || order.tracking_number;
    const carrier = shippingInfo.carrier || order.shipping_carrier;

    if (!trackingNum) {
      setTrackingSmsError('No tracking number available. Please add tracking info first.');
      return;
    }

    setSendingTrackingSms(true);
    setTrackingSmsError(null);
    setTrackingSmsSuccess(false);

    try {
      // Build the customer order page URL
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
      const orderDetailsUrl = `${appUrl}/dashboard/orders/${order.id}`;

      // Build the tracking URL based on carrier
      let trackingUrl = '';
      const carrierLower = (carrier || '').toLowerCase();
      if (carrierLower.includes('usps')) {
        trackingUrl = `https://tools.usps.com/go/TrackConfirmAction?tLabels=${trackingNum}`;
      } else if (carrierLower.includes('ups')) {
        trackingUrl = `https://www.ups.com/track?tracknum=${trackingNum}`;
      } else if (carrierLower.includes('fedex')) {
        trackingUrl = `https://www.fedex.com/fedextrack/?trknbr=${trackingNum}`;
      } else {
        trackingUrl = `https://parcelsapp.com/en/tracking/${trackingNum}`;
      }

      // Compose the SMS message
      const customerName = customerUser?.first_name || 'there';
      const message = `Hi ${customerName}! 📦 Your order #${order.order_number} has shipped!\n\n` +
        `${carrier ? `Carrier: ${carrier}\n` : ''}` +
        `Tracking: ${trackingNum}\n\n` +
        `Track: ${trackingUrl}\n\n` +
        `View order: ${orderDetailsUrl}`;

      const response = await fetch('/api/sms/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          to: customerPhone,
          message: message
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send SMS');
      }

      setTrackingSmsSuccess(true);
      setTimeout(() => setTrackingSmsSuccess(false), 5000);

    } catch (err) {
      console.error('Error sending tracking SMS:', err);
      setTrackingSmsError(err instanceof Error ? err.message : 'Failed to send SMS');
    } finally {
      setSendingTrackingSms(false);
    }
  };

  // Handle print shipping label
  const handlePrintLabel = async () => {
    if (!order) return;

    setPrintingLabel(true);
    setPrintLabelError(null);
    setPrintLabelSuccess(false);

    try {
      const response = await fetch('/api/print-jobs/create-shipping-label', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ order_id: order.id })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to queue label');
      }

      setPrintLabelSuccess(true);
      setTimeout(() => setPrintLabelSuccess(false), 5000);

    } catch (err) {
      console.error('Error queuing print job:', err);
      setPrintLabelError(err instanceof Error ? err.message : 'Failed to queue label');
    } finally {
      setPrintingLabel(false);
    }
  };

  // Handle delete order
  const handleDeleteOrder = async () => {
    if (!order) return;

    setDeleting(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/orders/${order.id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete order');
      }

      // Navigate back to orders list
      router.push('/admin/orders');
    } catch (err) {
      console.error('Error deleting order:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete order');
      setDeleteConfirmOpen(false);
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Helper to get customer user info (handles both array and object from Supabase joins)
  const getCustomerUser = () => {
    const customer = order?.customers;
    if (!customer?.users) return null;
    
    if (Array.isArray(customer.users)) {
      return customer.users[0] || null;
    }
    return customer.users;
  };

  const customerUser = getCustomerUser();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6 md:px-12 py-24 md:py-32">
        <div className="max-w-7xl mx-auto flex items-center gap-3 text-muted-foreground">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span className="text-sm md:text-base font-mono tracking-wider uppercase">Loading order details...</span>
        </div>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 md:px-12 py-24 md:py-32">
        <h1 className="font-serif text-2xl md:text-3xl font-light text-foreground mb-6">{error}</h1>
        <Link href="/admin/orders" className="text-sm md:text-base font-mono tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors uppercase">
          ← Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-6 md:px-12 py-24 md:py-32">
      <div className="max-w-7xl mx-auto">
        {/* Section header - Chronicles style */}
        <div className="mb-16 md:mb-24">
          <p className="text-sm md:text-base font-mono tracking-[0.3em] text-muted-foreground uppercase mb-6">Order Details</p>
          <div className="flex flex-col gap-6 sm:gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4 min-w-0">
              <Link
                href="/admin/orders"
                className="p-3 glass-button rounded-xl transition-colors flex-shrink-0"
                aria-label="Back to orders"
              >
                <ArrowLeft className="w-5 h-5 text-muted-foreground" />
              </Link>
              <div className="min-w-0">
                <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-foreground">Order #{order?.order_number}</h1>
                <p className="text-base md:text-lg text-muted-foreground mt-1">Created {formatDate(order?.created_at)}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
            {/* Delete Button with Confirmation */}
            {deleteConfirmOpen ? (
              <div className="flex items-center gap-2 p-2 bg-red-500/10 border border-red-500/30 rounded-xl">
                <span className="text-red-400 text-sm font-medium px-2">Delete this order?</span>
                <button
                  onClick={handleDeleteOrder}
                  disabled={deleting}
                  className="px-4 py-2 bg-red-500 text-white font-semibold hover:bg-red-600 rounded-lg flex items-center gap-2 transition-all duration-300 disabled:opacity-50"
                >
                  {deleting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Yes
                    </>
                  )}
                </button>
                <button
                  onClick={() => setDeleteConfirmOpen(false)}
                  className="px-4 py-2 bg-foreground/10 text-foreground font-semibold hover:bg-foreground/20 rounded-lg flex items-center gap-2 transition-all duration-300"
                >
                  <X className="w-4 h-4" />
                  No
                </button>
              </div>
            ) : (
              <button
                onClick={() => setDeleteConfirmOpen(true)}
                className="px-4 py-3 border border-red-500/30 text-red-400 rounded-xl font-medium hover:bg-red-500/10 transition-all duration-300 flex items-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            )}
            <button
              onClick={() => setRefundModalOpen(true)}
              disabled={order?.refund_status === 'succeeded' || order?.payment_status === 'refunded'}
              className="px-6 py-3 border border-orange-500/30 text-orange-400 rounded-xl font-medium hover:bg-orange-500/10 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>
                {order?.refund_status === 'succeeded' ? 'Refunded' :
                 order?.refund_status === 'processing' ? 'View Refund' :
                 'Issue Refund'}
              </span>
            </button>
            <button
              onClick={handleSaveOrder}
              disabled={saving}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-card/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </div>
        </div>{/* end mb-16 header */}

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400">
            Order updated successfully!
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 flex items-center">
            <AlertCircle className="w-4 h-4 mr-2" />
            {error}
          </div>
        )}

        {/* Stats Row - stacked vertically on mobile, 2x2 on tablet, 4 across on desktop; plenty of space */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-12 md:mb-16">
          {[
            { label: 'Total Amount', value: `$${order?.total_amount?.toFixed(2) || '0.00'}`, icon: DollarSign },
            { label: 'Items', value: String(order?.order_items?.length || 0), icon: Package },
            { label: 'Order Status', value: orderStatus.replace('_', ' '), icon: Truck },
            { label: 'Payment', value: paymentStatus, icon: CreditCard },
          ].map((stat) => (
            <div key={stat.label} className="glass-button rounded-2xl p-6 md:p-8 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-xl glass-card mb-4">
                <stat.icon className="w-6 h-6 md:w-7 md:h-7 text-foreground/70" />
              </div>
              <p className="font-mono text-2xl md:text-3xl font-light text-foreground mb-2">{stat.value}</p>
              <p className="text-sm md:text-base text-muted-foreground uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
          {/* Main Content - vertical stack with generous spacing */}
          <div className="lg:col-span-2 space-y-8 md:space-y-10">
            {/* Order Status */}
            <div className="glass-card rounded-3xl p-8 md:p-10 lg:p-12 transition-all duration-500 hover:bg-foreground/[0.05]">
              <h2 className="font-serif text-xl md:text-2xl font-light text-foreground mb-8">Order Status</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono tracking-wider text-muted-foreground uppercase mb-1.5">Order Status</label>
                    <select
                      value={orderStatus}
                      onChange={(e) => setOrderStatus(e.target.value as OrderStatus)}
                      className="w-full h-11 px-4 bg-foreground/5 border border-border rounded-xl text-foreground focus:outline-none focus:border-border transition-colors [&>option]:bg-card [&>option]:text-foreground"
                    >
                      <option value="pending">Pending</option>
                      <option value="payment_requested">Payment Requested</option>
                      <option value="paid">Paid</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-mono tracking-wider text-muted-foreground uppercase mb-1.5">Payment Status</label>
                    <select
                      value={paymentStatus}
                      onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
                      className="w-full h-11 px-4 bg-foreground/5 border border-border rounded-xl text-foreground focus:outline-none focus:border-border transition-colors [&>option]:bg-card [&>option]:text-foreground"
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="failed">Failed</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </div>
                </div>
                
                {/* Payment Button */}
                <div className="mt-6 pt-6 border-t border-border">
                  {paymentStatus === 'paid' ? (
                    <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                      <Check className="w-5 h-5 text-emerald-400" />
                      <div>
                        <p className="text-emerald-400 font-medium">Paid</p>
                        <p className="text-xs text-emerald-400/60">{order?.payment_date ? formatDate(order.payment_date) : ''}</p>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        window.location.href = `/payment/card?orderId=${order?.id}&total=${order?.total_amount}`
                      }}
                      className="w-full flex items-center justify-center gap-3 px-6 py-5 bg-emerald-500 hover:bg-emerald-600 rounded-xl text-white font-bold text-lg transition-all"
                    >
                      Continue to Payment
                    </button>
                  )}
                </div>
            </div>

            {/* Line Items */}
            <div className="glass-card rounded-3xl p-8 md:p-10 lg:p-12 transition-all duration-500 hover:bg-foreground/[0.05]">
              <h2 className="font-serif text-xl md:text-2xl font-light text-foreground mb-8 flex items-center gap-3">
                <Package className="w-5 h-5 text-muted-foreground" />
                Order Items
              </h2>
                <div className="space-y-3">
                  {order?.order_items && order.order_items.length > 0 ? (
                    order.order_items.map((item) => (
                      <div key={item.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 glass-button rounded-xl hover:border-border transition-all">
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="h-10 w-10 rounded-lg glass-button flex items-center justify-center flex-shrink-0">
                            <Package className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-serif font-light text-foreground">{item.product_name}</p>
                            {item.product_barcode && (
                              <p className="text-xs text-muted-foreground">SKU: {item.product_barcode}</p>
                            )}
                            <p className="text-xs text-muted-foreground">${item.unit_price?.toFixed(2)} each × {item.quantity}</p>
                          </div>
                        </div>
                        <div className="text-left sm:text-right flex-shrink-0">
                          <p className="font-mono text-lg font-light text-foreground">
                            ${item.total_price?.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm md:text-base">No items in this order</p>
                    </div>
                  )}
                </div>
            </div>

            {/* Shipping & Fulfillment */}
            <div className="glass-card rounded-3xl p-6 md:p-8 lg:p-10 transition-all duration-500 hover:bg-foreground/[0.05]">
              <h2 className="font-serif text-xl md:text-2xl font-light text-foreground mb-6 flex items-center gap-3">
                <Truck className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                Shipping & Fulfillment
              </h2>

              {/* Shipping Inputs — side by side on desktop */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-xs font-mono tracking-wider text-muted-foreground uppercase mb-1.5">Carrier</label>
                  <input
                    type="text"
                    value={shippingInfo.carrier}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, carrier: e.target.value })}
                    placeholder="e.g., FedEx, UPS, USPS"
                    className="w-full h-11 px-4 bg-foreground/5 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-border transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono tracking-wider text-muted-foreground uppercase mb-1.5">Tracking Number</label>
                  <input
                    type="text"
                    value={shippingInfo.trackingNumber}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, trackingNumber: e.target.value })}
                    placeholder="Enter tracking number"
                    className="w-full h-11 px-4 bg-foreground/5 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-border transition-colors"
                  />
                </div>
              </div>

              {/* Action Buttons — responsive wrap */}
              <div className="flex flex-wrap gap-2 mb-4">
                {order && !['shipped', 'delivered', 'cancelled'].includes(order.status) && (
                  <Link
                    href={`/fulfill/${order.id}`}
                    className="flex items-center gap-2 px-4 py-2.5 bg-foreground text-background hover:bg-foreground/90 rounded-xl font-medium transition-colors text-sm"
                  >
                    <ClipboardList className="w-4 h-4" />
                    Fulfill Order
                  </Link>
                )}
                <a
                  href={`/api/admin/orders/${order?.id}/shipping-label`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 bg-foreground/10 hover:bg-foreground/20 border border-border text-foreground rounded-xl font-medium transition-colors text-sm"
                  title="Download/view shipping label"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Download</span> Label
                </a>
                <button
                  onClick={handlePrintLabel}
                  disabled={printingLabel}
                  className="flex items-center gap-2 px-4 py-2.5 bg-foreground/10 hover:bg-foreground/20 border border-border text-foreground rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  title="Print shipping label"
                >
                  {printingLabel ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : printLabelSuccess ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Printer className="w-4 h-4" />
                  )}
                  {printingLabel ? 'Queuing...' : printLabelSuccess ? 'Queued!' : 'Print Label'}
                </button>
                <button
                  onClick={handleSendTrackingSms}
                  disabled={sendingTrackingSms || !shippingInfo.trackingNumber}
                  className="flex items-center gap-2 px-4 py-2.5 bg-foreground/10 hover:bg-foreground/20 border border-border text-foreground rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  title={!shippingInfo.trackingNumber ? 'Add tracking number first' : 'Send tracking info via SMS'}
                >
                  {sendingTrackingSms ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : trackingSmsSuccess ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <MessageSquare className="w-4 h-4" />
                  )}
                  {sendingTrackingSms ? 'Sending...' : trackingSmsSuccess ? 'Sent!' : 'Send SMS'}
                </button>
              </div>

              {/* Status Messages */}
              {printLabelSuccess && (
                <div className="mb-3 p-3 bg-foreground/[0.04] border border-border rounded-xl text-sm flex items-center gap-2 text-muted-foreground">
                  <Printer className="w-4 h-4 flex-shrink-0" />
                  Shipping label queued for printing
                </div>
              )}
              {printLabelError && (
                <div className="mb-3 p-3 bg-destructive/10 border border-destructive/20 rounded-xl text-sm flex items-center gap-2 text-destructive-foreground">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span className="flex-1">{printLabelError}</span>
                  <button onClick={() => setPrintLabelError(null)}><X className="w-4 h-4" /></button>
                </div>
              )}
              {trackingSmsSuccess && (
                <div className="mb-3 p-3 bg-foreground/[0.04] border border-border rounded-xl text-sm flex items-center gap-2 text-muted-foreground">
                  <Check className="w-4 h-4 flex-shrink-0" />
                  Tracking info sent to customer via SMS
                </div>
              )}
              {trackingSmsError && (
                <div className="mb-3 p-3 bg-destructive/10 border border-destructive/20 rounded-xl text-sm flex items-center gap-2 text-destructive-foreground">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span className="flex-1">{trackingSmsError}</span>
                  <button onClick={() => setTrackingSmsError(null)}><X className="w-4 h-4" /></button>
                </div>
              )}

              {/* SMS Preview */}
              {shippingInfo.trackingNumber && (customerUser?.phone || order?.customers?.phone) && (
                <div className="p-4 bg-foreground/[0.03] border border-border rounded-xl">
                  <p className="text-xs text-muted-foreground mb-2 flex items-center gap-2">
                    <Send className="w-3 h-3" />
                    SMS Preview (to {customerUser?.phone || order?.customers?.phone})
                  </p>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">
                    Hi {customerUser?.first_name || 'there'}! Your order #{order?.order_number} has shipped!
                    {shippingInfo.carrier && `\nCarrier: ${shippingInfo.carrier}`}
                    {`\nTracking: ${shippingInfo.trackingNumber}`}
                  </p>
                </div>
              )}
            </div>

            {/* Photos & QR — two columns on desktop, stacked on mobile */}
            {order && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Order Photos QR Link */}
                <div className="glass-card rounded-3xl p-6 md:p-8 transition-all duration-500 hover:bg-foreground/[0.05]">
                  <div className="flex items-center gap-3 mb-4">
                    <QrCode className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    <p className="text-xs font-mono tracking-widest text-muted-foreground uppercase">
                      Photos QR Link
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Same link as the QR code on the shipping label
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const url = `${window.location.origin}/order-photos/${order.order_number}`
                        navigator.clipboard.writeText(url)
                      }}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-mono glass-button hover:bg-foreground/[0.08] transition-all"
                    >
                      <Copy className="w-4 h-4" />
                      Copy
                    </button>
                    <a
                      href={`/order-photos/${order.order_number}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-mono bg-foreground/[0.08] text-foreground hover:bg-foreground/[0.15] transition-all"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Open
                    </a>
                  </div>
                </div>

                {/* Internal Notes */}
                <div className="glass-card rounded-3xl p-6 md:p-8 transition-all duration-500 hover:bg-foreground/[0.05]">
                  <div className="flex items-center gap-3 mb-4">
                    <Edit2 className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    <p className="text-xs font-mono tracking-widest text-muted-foreground uppercase">
                      Internal Notes
                    </p>
                  </div>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add internal notes about this order..."
                    rows={3}
                    className="w-full px-4 py-3 bg-foreground/[0.04] rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-border transition-colors resize-none border border-border"
                  />
                </div>
              </div>
            )}

            {/* Order Photos - Pre-shipping documentation */}
            {order && <OrderPhotos orderId={order.id} />}

            {/* Payment Events Timeline */}
            {order && <PaymentEventsTimeline orderId={order.id} />}

            {/* Live Tracking Info - powered by AfterShip */}
            {order?.tracking_number && (
              <TrackingInfoDisplay 
                trackingNumber={order.tracking_number} 
                carrier={order.shipping_carrier || shippingInfo.carrier}
              />
            )}
          </div>

          {/* Sidebar - stacked vertically with space */}
          <div className="space-y-6 md:space-y-8">
            {/* Customer Information */}
            <div className="glass-card rounded-3xl p-6 md:p-8 transition-all duration-500 hover:bg-foreground/[0.05]">
              <h2 className="font-serif text-xl md:text-2xl font-light text-foreground mb-6 flex items-center gap-3">
                <User className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                Customer
              </h2>
              {order?.customers && (
                  <div className="space-y-3">
                    <div>
                      <p className="font-serif font-light text-foreground">
                        {customerUser?.first_name || ''} {customerUser?.last_name || ''}
                      </p>
                      {order.customers.company_name && (
                        <p className="text-xs text-muted-foreground">{order.customers.company_name}</p>
                      )}
                    </div>
                    {customerUser?.email && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span className="truncate">{customerUser.email}</span>
                      </div>
                    )}
                    {(customerUser?.phone || order.customers.phone) && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                        {customerUser?.phone || order.customers.phone}
                      </div>
                    )}
                    <div className="pt-2">
                      <span className="glass-button rounded-xl px-3 py-1.5 text-xs font-mono text-muted-foreground border border-border">
                        {order.customers.customer_type === 'b2b' ? 'Business' : 'Retail'}
                      </span>
                    </div>
                  </div>
                )}
            </div>

            {/* Shipping Address */}
            {order?.customers && (order.customers.shipping_address_line1 || order.customers.shipping_city) && (
              <div className="glass-card rounded-3xl p-6 md:p-8 transition-all duration-500 hover:bg-foreground/[0.05]">
                <h2 className="font-serif text-xl md:text-2xl font-light text-foreground mb-6 flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  Shipping Address
                </h2>
                <div className="text-sm md:text-base text-muted-foreground space-y-1">
                    {order.customers.shipping_address_line1 && (
                      <p>{order.customers.shipping_address_line1}</p>
                    )}
                    {(order.customers.shipping_city || order.customers.shipping_state || order.customers.shipping_zip) && (
                      <p>
                        {order.customers.shipping_city && `${order.customers.shipping_city}, `}
                        {order.customers.shipping_state} {order.customers.shipping_zip}
                      </p>
                    )}
                    {order.customers.shipping_country && (
                      <p>{order.customers.shipping_country}</p>
                    )}
                </div>
              </div>
            )}

            {/* Order Summary */}
            <div className="glass-card rounded-3xl p-6 md:p-8 transition-all duration-500 hover:bg-foreground/[0.05]">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h2 className="font-serif text-xl md:text-2xl font-light text-foreground flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  Order Summary
                </h2>
                  <button
                    onClick={() => setEditingAmounts(!editingAmounts)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      editingAmounts 
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
                        : 'bg-foreground/10 text-foreground/60 hover:bg-foreground/20 hover:text-foreground'
                    }`}
                  >
                    <Edit2 className="w-3 h-3 inline mr-1" />
                    {editingAmounts ? 'Editing' : 'Edit Amounts'}
                  </button>
                </div>
                
                {editingAmounts ? (
                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-4">
                      <p className="text-amber-400 text-xs">
                        ⚠️ Editing amounts will update the order total. If this order has a Shopify invoice, it will be automatically updated.
                      </p>
                    </div>
                    <div className="flex justify-between items-center text-sm p-3 rounded-xl bg-foreground/[0.04]">
                      <span className="text-muted-foreground">Subtotal</span>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">$</span>
                        <input
                          type="number"
                          step="0.01"
                          value={editSubtotal}
                          onChange={(e) => setEditSubtotal(parseFloat(e.target.value) || 0)}
                          className="w-24 h-8 px-2 bg-foreground/10 border border-border rounded-lg text-foreground text-right focus:outline-none focus:border-border"
                        />
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-sm p-3 rounded-xl bg-emerald-500/10">
                      <span className="text-emerald-400/70">Discount</span>
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-400/40">-$</span>
                        <input
                          type="number"
                          step="0.01"
                          value={editDiscount}
                          onChange={(e) => setEditDiscount(parseFloat(e.target.value) || 0)}
                          className="w-24 h-8 px-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 text-right focus:outline-none focus:border-emerald-500/50"
                        />
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-sm p-3 rounded-xl bg-foreground/[0.04]">
                      <span className="text-muted-foreground">Tax</span>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">$</span>
                        <input
                          type="number"
                          step="0.01"
                          value={editTax}
                          onChange={(e) => setEditTax(parseFloat(e.target.value) || 0)}
                          className="w-24 h-8 px-2 bg-foreground/10 border border-border rounded-lg text-foreground text-right focus:outline-none focus:border-border"
                        />
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-sm p-3 rounded-xl bg-foreground/[0.04]">
                      <span className="text-muted-foreground">Shipping</span>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">$</span>
                        <input
                          type="number"
                          step="0.01"
                          value={editShipping}
                          onChange={(e) => setEditShipping(parseFloat(e.target.value) || 0)}
                          className="w-24 h-8 px-2 bg-foreground/10 border border-border rounded-lg text-foreground text-right focus:outline-none focus:border-border"
                        />
                      </div>
                    </div>
                    <div className="border-t border-border pt-4 mt-4">
                      <div className="flex justify-between items-center p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                        <span className="font-medium text-green-400">New Total</span>
                        <span className="font-bold text-2xl text-foreground">
                          ${(editSubtotal - editDiscount + editTax + editShipping).toFixed(2)}
                        </span>
                      </div>
                      {order?.total_amount !== (editSubtotal - editDiscount + editTax + editShipping) && (
                        <p className="text-xs text-amber-400/70 mt-2 text-center">
                          Changed from ${order?.total_amount?.toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm p-3 rounded-xl bg-foreground/[0.04]">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="text-foreground font-medium">${order?.subtotal?.toFixed(2) || '0.00'}</span>
                    </div>
                    {(order?.discount_amount || 0) > 0 && (
                      <div className="flex justify-between text-sm p-3 rounded-xl bg-emerald-500/10">
                        <span className="text-emerald-400/70">Discount</span>
                        <span className="text-emerald-400 font-medium">-${order?.discount_amount?.toFixed(2)}</span>
                      </div>
                    )}
                    {(order?.tax_amount || 0) > 0 && (
                      <div className="flex justify-between text-sm p-3 rounded-xl bg-foreground/[0.04]">
                        <span className="text-muted-foreground">Tax</span>
                        <span className="text-foreground font-medium">${order?.tax_amount?.toFixed(2)}</span>
                      </div>
                    )}
                    {(order?.shipping_amount || 0) > 0 && (
                      <div className="flex justify-between text-sm p-3 rounded-xl bg-foreground/[0.04]">
                        <span className="text-muted-foreground">Shipping</span>
                        <span className="text-foreground font-medium">${order?.shipping_amount?.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="border-t border-border pt-4 mt-4">
                      <div className="flex justify-between items-center p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                        <span className="font-medium text-green-400">Total</span>
                        <span className="font-bold text-2xl text-foreground">
                          ${order?.total_amount?.toFixed(2) || '0.00'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
            </div>

            {/* Pricing Breakdown - Cost, Profit & Commission */}
            {pricingBreakdown && (
              <div className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-xl p-6 transition-all duration-300">
                <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
                <div className="relative z-10">
                  <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                    <DollarSign className="w-5 h-5 mr-3 text-emerald-400" />
                    Pricing Breakdown
                  </h2>
                  <div className="space-y-3">
                    {/* Protected Cost */}
                    <div className="flex justify-between text-sm p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                      <span className="text-red-400/70 flex items-center gap-2">
                        <span>🛡️</span> Product Cost (Protected)
                      </span>
                      <span className="text-red-400 font-medium">${pricingBreakdown.total_cost.toFixed(2)}</span>
                    </div>
                    
                    {/* Guaranteed Profit */}
                    <div className="flex justify-between text-sm p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                      <span className="text-amber-400/70 flex items-center gap-2">
                        <span>📈</span> Min Price ({pricingBreakdown.min_markup_used}×)
                      </span>
                      <span className="text-amber-400 font-medium">${pricingBreakdown.minimum_price.toFixed(2)}</span>
                    </div>
                    
                    {/* Guaranteed Profit Amount */}
                    <div className="flex justify-between text-sm p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                      <span className="text-green-400/70 flex items-center gap-2">
                        <span>✅</span> Guaranteed Profit
                      </span>
                      <span className="text-green-400 font-bold">
                        ${(pricingBreakdown.minimum_price - pricingBreakdown.total_cost).toFixed(2)}
                      </span>
                    </div>
                    
                    {/* Commission Pool */}
                    <div className="flex justify-between text-sm p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                      <span className="text-blue-400/70 flex items-center gap-2">
                        <span>💰</span> Commission Pool
                      </span>
                      <span className="text-blue-400 font-medium">${pricingBreakdown.commission_pool.toFixed(2)}</span>
                    </div>
                    
                    {/* Discount Impact */}
                    {pricingBreakdown.discount_applied > 0 && (
                      <div className="flex justify-between text-sm p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                        <span className="text-purple-400/70 flex items-center gap-2">
                          <span>🏷️</span> Discount (from commission)
                        </span>
                        <span className="text-purple-400 font-medium">-${pricingBreakdown.discount_applied.toFixed(2)}</span>
                      </div>
                    )}
                    
                    {/* Rep Commission */}
                    {pricingBreakdown.rep_commission_rate > 0 && (
                      <div className="border-t border-border pt-3 mt-3">
                        <div className="flex justify-between text-sm p-3 rounded-xl bg-foreground/5 border border-border">
                          <span className="text-foreground/70 flex items-center gap-2">
                            <span>👤</span> Rep Commission ({pricingBreakdown.rep_commission_rate}%)
                          </span>
                          <span className="text-foreground font-bold">${pricingBreakdown.rep_commission_amount.toFixed(2)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Timeline */}
            <div className="relative overflow-hidden rounded-3xl border border-border bg-foreground/5 backdrop-blur-xl p-6 transition-all duration-300 hover:bg-card/[0.07]">
              <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
              <div className="relative z-10">
                <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-3 text-muted-foreground" />
                  Timeline
                </h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between p-3 rounded-xl bg-foreground/[0.04]">
                    <span className="text-muted-foreground">Created</span>
                    <span className="text-foreground font-medium">{formatDate(order?.created_at)}</span>
                  </div>
                  {order?.payment_date && (
                    <div className="flex justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                      <span className="text-emerald-400/70">Paid</span>
                      <span className="text-emerald-400 font-medium">{formatDate(order.payment_date)}</span>
                    </div>
                  )}
                  {order?.payment_failed_at && (
                    <div className="flex justify-between p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                      <span className="text-red-400/70">Payment Failed</span>
                      <span className="text-red-400 font-medium">{formatDate(order.payment_failed_at)}</span>
                    </div>
                  )}
                  <div className="flex justify-between p-3 rounded-xl bg-foreground/[0.04]">
                    <span className="text-muted-foreground">Last Updated</span>
                    <span className="text-foreground font-medium">{formatDate(order?.updated_at)}</span>
                  </div>
                </div>
                
                {/* Payment Failure Alert */}
                {order?.payment_failure_reason && (
                  <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                    <p className="text-red-400 text-sm font-medium">Payment Failed</p>
                    <p className="text-red-400/70 text-xs mt-1">{order.payment_failure_reason}</p>
                  </div>
                )}
                
                {/* Payment Method Info */}
                {order?.payment_method_details && (order.payment_method_details.brand || order.payment_method_details.last4) && (
                  <div className="mt-4 p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                    <div className="flex items-center gap-2 text-purple-400 mb-1">
                      <CreditCard className="h-4 w-4" />
                      <span className="text-xs font-medium">Payment Method</span>
                    </div>
                    <p className="text-foreground font-medium">
                      {order.payment_method_details.brand && (
                        <span className="capitalize">{order.payment_method_details.brand} </span>
                      )}
                      {order.payment_method_details.last4 && (
                        <span>•••• {order.payment_method_details.last4}</span>
                      )}
                    </p>
                  </div>
                )}
                
                {/* Receipt Link */}
                {order?.stripe_receipt_url && (
                  <a
                    href={order.stripe_receipt_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 block p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400 hover:bg-blue-500/20 transition-colors text-sm text-center font-medium"
                  >
                    View Payment Receipt ↗
                  </a>
                )}
              </div>
            </div>

            {/* Shopify Payment Details */}
            {(order?.card_brand || order?.card_last_four || order?.shopify_invoice_id || order?.billing_name) && (
              <div className="relative overflow-hidden rounded-3xl border border-border bg-foreground/5 backdrop-blur-xl p-6 transition-all duration-300 hover:bg-card/[0.07]">
                <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
                <div className="relative z-10">
                  <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                    <CreditCard className="w-5 h-5 mr-3 text-muted-foreground" />
                    Payment Details
                  </h2>
                  <div className="space-y-3 text-sm">
                    {/* Card Info */}
                    {(order?.card_brand || order?.card_last_four) && (
                      <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-purple-400/70 text-xs mb-1">Card</p>
                            <p className="text-foreground font-medium">
                              {order.card_brand && <span className="capitalize">{order.card_brand} </span>}
                              {order.card_last_four && <span>•••• {order.card_last_four}</span>}
                            </p>
                          </div>
                          {order.card_exp_month && order.card_exp_year && (
                            <div className="text-right">
                              <p className="text-purple-400/70 text-xs mb-1">Expires</p>
                              <p className="text-foreground font-medium">
                                {String(order.card_exp_month).padStart(2, '0')}/{order.card_exp_year}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Payment Amount & Gateway */}
                    {order?.shopify_payment_amount && (
                      <div className="flex justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                        <span className="text-emerald-400/70">Amount Paid</span>
                        <span className="text-emerald-400 font-bold">${order.shopify_payment_amount.toFixed(2)}</span>
                      </div>
                    )}
                    
                    {order?.shopify_payment_gateway && (
                      <div className="flex justify-between p-3 rounded-xl bg-foreground/[0.04]">
                        <span className="text-muted-foreground">Gateway</span>
                        <span className="text-foreground font-medium capitalize">{order.shopify_payment_gateway}</span>
                      </div>
                    )}

                    {/* Billing Address */}
                    {order?.billing_name && (
                      <div className="p-4 rounded-xl bg-foreground/[0.04] border border-border">
                        <p className="text-muted-foreground text-xs mb-2">Billing Address</p>
                        <div className="text-foreground/80 space-y-0.5">
                          <p className="font-medium">{order.billing_name}</p>
                          {order.billing_address_line1 && <p className="text-sm">{order.billing_address_line1}</p>}
                          {(order.billing_city || order.billing_state || order.billing_zip) && (
                            <p className="text-sm">
                              {order.billing_city && `${order.billing_city}, `}
                              {order.billing_state} {order.billing_zip}
                            </p>
                          )}
                          {order.billing_country && <p className="text-sm">{order.billing_country}</p>}
                        </div>
                      </div>
                    )}

                    {/* Transaction IDs */}
                    {(order?.shopify_transaction_id || order?.shopify_order_id) && (
                      <div className="p-3 rounded-xl bg-foreground/[0.04] space-y-2">
                        {order.shopify_order_id && (
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Shopify Order</span>
                            <span className="text-foreground/70 font-mono">{order.shopify_order_id}</span>
                          </div>
                        )}
                        {order.shopify_transaction_id && (
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Transaction ID</span>
                            <span className="text-foreground/70 font-mono">{order.shopify_transaction_id}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Shopify Invoice Link */}
                    {order?.shopify_invoice_url && (
                      <a
                        href={order.shopify_invoice_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400 hover:bg-blue-500/20 transition-colors text-center font-medium"
                      >
                        View Shopify Invoice ↗
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          </div>
        </div>

        {/* Refund Modal */}
        {order && (
          <RefundModal
            isOpen={refundModalOpen}
            onClose={() => setRefundModalOpen(false)}
            orderId={order.id}
            orderNumber={order.order_number}
            orderTotal={order.total_amount}
            hasStripePayment={!!order.stripe_payment_intent_id}
            existingRefund={order.refund_status ? {
              refund_id: order.refund_id || null,
              refund_amount: order.refund_amount || null,
              refund_status: order.refund_status,
              refund_destination: order.refund_destination || null,
              refund_customer_message: order.refund_customer_message || null,
              refund_initiated_at: order.refund_initiated_at || null,
              refund_completed_at: order.refund_completed_at || null,
            } : null}
            onRefundComplete={loadOrderDetails}
          />
        )}
    </div>
  );
}
