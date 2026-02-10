'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Package, Truck, CheckCircle, Circle, MapPin, Calendar, ArrowLeft, Copy } from 'lucide-react';
import { getSupabaseBrowserClient } from '@/lib/supabase-browser';
import type { Order, Tracking, TrackingEvent } from '@/types';

type TrackingStatus = 'pending' | 'paid' | 'processing' | 'shipped' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'exception';

interface TimelineStep {
  id: string;
  label: string;
  status: TrackingStatus;
  icon: React.ReactNode;
  timestamp?: string;
  description?: string;
}

export default function OrderTrackingPage() {
  const params = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [tracking, setTracking] = useState<Tracking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadOrderAndTracking();
  }, [params.orderId]);

  const loadOrderAndTracking = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('order_number', params.orderId)
        .single();

      if (orderError || !orderData) {
        setError('Order not found');
        return;
      }

      setOrder(orderData);

      // Load tracking info
      const { data: trackingData } = await supabase
        .from('tracking')
        .select(`
          *,
          tracking_events (*)
        `)
        .eq('order_id', orderData.id)
        .single();

      if (trackingData) {
        setTracking({
          ...trackingData,
          events: trackingData.tracking_events || []
        });
      }
    } catch (error) {
      console.error('Error loading tracking:', error);
      setError('Failed to load tracking information');
    } finally {
      setLoading(false);
    }
  };

  const copyTrackingNumber = () => {
    if (tracking?.tracking_number) {
      navigator.clipboard.writeText(tracking.tracking_number);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getTimelineSteps = (): TimelineStep[] => {
    const steps: TimelineStep[] = [
      {
        id: 'placed',
        label: 'Order Placed',
        status: 'pending',
        icon: <CheckCircle className="w-5 h-5" />,
        timestamp: order?.created_at,
        description: 'Your order has been received'
      },
      {
        id: 'paid',
        label: 'Payment Confirmed',
        status: 'paid',
        icon: <CheckCircle className="w-5 h-5" />,
        timestamp: order?.payment_date,
        description: 'Payment has been successfully processed'
      },
      {
        id: 'processing',
        label: 'Processing',
        status: 'processing',
        icon: <Package className="w-5 h-5" />,
        description: 'Your order is being prepared'
      },
      {
        id: 'shipped',
        label: 'Shipped',
        status: 'shipped',
        icon: <Truck className="w-5 h-5" />,
        timestamp: tracking?.shipped_date,
        description: tracking?.carrier ? `Shipped via ${tracking.carrier}` : 'Your order has been shipped'
      },
      {
        id: 'out_for_delivery',
        label: 'Out for Delivery',
        status: 'out_for_delivery',
        icon: <Truck className="w-5 h-5" />,
        description: 'Your package is out for delivery'
      },
      {
        id: 'delivered',
        label: 'Delivered',
        status: 'delivered',
        icon: <CheckCircle className="w-5 h-5" />,
        timestamp: tracking?.delivered_date,
        description: 'Package has been delivered'
      }
    ];

    return steps;
  };

  const isStepCompleted = (stepStatus: TrackingStatus): boolean => {
    const orderStatuses: TrackingStatus[] = ['pending', 'paid', 'processing', 'shipped', 'in_transit', 'out_for_delivery', 'delivered'];
    const currentStatus = tracking?.status || order?.status as TrackingStatus || 'pending';
    const currentIndex = orderStatuses.indexOf(currentStatus);
    const stepIndex = orderStatuses.indexOf(stepStatus);
    return stepIndex <= currentIndex;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Loading tracking information...</div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <h1 className="text-2xl text-foreground mb-4">{error || 'Order not found'}</h1>
        <p className="text-muted-foreground mb-6">Please check your order number and try again.</p>
        <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
          ← Back to Shop
        </Link>
      </div>
    );
  }

  const timelineSteps = getTimelineSteps();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link
            href="/"
            className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Shop
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Order Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-3">Order Tracking</h1>
          <p className="text-muted-foreground">Order #{order.order_number}</p>
        </div>

        {/* Tracking Number */}
        {tracking?.tracking_number && (
          <div className="relative overflow-hidden rounded-2xl border border-border bg-foreground/5 backdrop-blur-xl p-6 mb-6">
            <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Tracking Number</p>
                <p className="text-xl font-mono text-foreground">{tracking.tracking_number}</p>
                {tracking.carrier && (
                  <p className="text-sm text-muted-foreground mt-2">Carrier: {tracking.carrier}</p>
                )}
              </div>
              <button
                onClick={copyTrackingNumber}
                className="p-3 hover:bg-foreground/10 rounded-xl transition-colors"
              >
                <Copy className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            {copied && (
              <p className="relative z-10 text-sm text-green-400 mt-3">Tracking number copied!</p>
            )}
            {tracking.tracking_url && (
              <a
                href={tracking.tracking_url}
                target="_blank"
                rel="noopener noreferrer"
                className="relative z-10 inline-block mt-4 text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                Track on carrier website →
              </a>
            )}
          </div>
        )}

        {/* Estimated Delivery */}
        {tracking?.estimated_delivery && (
          <div className="relative overflow-hidden rounded-2xl border border-border bg-foreground/5 backdrop-blur-xl p-6 mb-6">
            <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
            <div className="relative z-10 flex items-center space-x-4">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Estimated Delivery</p>
                <p className="text-lg text-foreground">{formatDate(tracking.estimated_delivery)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Visual Timeline */}
        <div className="relative overflow-hidden rounded-2xl border border-border bg-foreground/5 backdrop-blur-xl p-8 mb-6">
          <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
          <div className="relative z-10">
            <h2 className="text-xl font-semibold text-foreground mb-8">Shipment Progress</h2>
            <div className="space-y-6">
              {timelineSteps.map((step, index) => {
                const isCompleted = isStepCompleted(step.status);
                const isLast = index === timelineSteps.length - 1;

                return (
                  <div key={step.id} className="relative">
                    <div className="flex items-start space-x-4">
                      {/* Icon and Line */}
                      <div className="relative flex flex-col items-center">
                        <div className={`p-2 rounded-xl ${
                          isCompleted
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-foreground/10 text-muted-foreground'
                        }`}>
                          {isCompleted ? step.icon : <Circle className="w-5 h-5" />}
                        </div>
                        {!isLast && (
                          <div className={`w-0.5 h-16 mt-2 ${
                            isCompleted ? 'bg-green-500/50' : 'bg-foreground/10'
                          }`} />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 pb-8">
                        <div className="flex items-center justify-between">
                          <h3 className={`font-medium ${
                            isCompleted ? 'text-foreground' : 'text-muted-foreground'
                          }`}>
                            {step.label}
                          </h3>
                          {step.timestamp && (
                            <span className="text-sm text-muted-foreground">
                              {formatDate(step.timestamp)}
                            </span>
                          )}
                        </div>
                        {step.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {step.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tracking Events */}
        {tracking?.events && tracking.events.length > 0 && (
          <div className="relative overflow-hidden rounded-2xl border border-border bg-foreground/5 backdrop-blur-xl p-8 mb-6">
            <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
            <div className="relative z-10">
              <h2 className="text-xl font-semibold text-foreground mb-6">Tracking History</h2>
              <div className="space-y-4">
                {tracking.events.map((event) => (
                  <div key={event.id} className="border-l-2 border-border pl-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-foreground font-medium">{event.description}</p>
                        {event.location && (
                          <p className="text-sm text-muted-foreground mt-1 flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {event.location}
                          </p>
                        )}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(event.event_date)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Order Summary */}
        <div className="relative overflow-hidden rounded-2xl border border-border bg-foreground/5 backdrop-blur-xl p-8">
          <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
          <div className="relative z-10">
            <h2 className="text-xl font-semibold text-foreground mb-6">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Order Date</span>
                <span className="text-foreground">{formatDate(order.created_at)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Amount</span>
                <span className="text-foreground">${order.total_amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Payment Status</span>
                <span className={`capitalize ${
                  order.payment_status === 'paid' ? 'text-green-400' : 'text-yellow-400'
                }`}>
                  {order.payment_status}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}