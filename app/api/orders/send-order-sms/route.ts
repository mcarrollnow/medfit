import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  try {
    const { orderId, phoneNumber } = await req.json();

    if (!orderId || !phoneNumber) {
      return NextResponse.json(
        { error: 'Missing orderId or phoneNumber' },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Get order details
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      console.error('[Send Order SMS] Order not found:', orderError);
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Format items list
    const itemsList = order.order_items
      .map((item: any) => `${item.product_name} x${item.quantity}`)
      .join(', ');

    // Get the host from the request headers for correct URL
    const host = req.headers.get('host');
    const protocol = req.headers.get('x-forwarded-proto') || 'http';
    const baseUrl = `${protocol}://${host}`;

    // Create payment status link
    const paymentStatusLink = `${baseUrl}/payment-status/${orderId}`;

    // Create SMS message with payment status link
    const message = `🎉 Payment confirmed for Order #${order.order_number}!\n\nItems: ${itemsList}\nTotal: $${(order.total_amount || 0).toFixed(2)}\n\nTrack your order:\n${paymentStatusLink}\n\nYour order will be shipped within 24-48 hours. You'll receive tracking info once shipped.\n\nThank you for your purchase!`;

    console.log('[Send Order SMS] Sending SMS to:', phoneNumber);
    console.log('[Send Order SMS] Message:', message);
    
    // Call internal SMS API with service key authentication
    const serviceKey = process.env.INTERNAL_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    const smsResponse = await fetch(`${baseUrl}/api/internal/send-sms`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-service-key': serviceKey || ''
      },
      body: JSON.stringify({
        to: phoneNumber,
        body: message,
        metadata: {
          type: 'order_confirmation',
          order_id: orderId,
          order_number: order.order_number
        }
      })
    });

    if (!smsResponse.ok) {
      const error = await smsResponse.text();
      console.error('[Send Order SMS] SMS gateway error:', error);
      return NextResponse.json(
        { error: 'Failed to send SMS' },
        { status: 500 }
      );
    }

    const result = await smsResponse.json();
    console.log('[Send Order SMS] SMS sent successfully:', result);

    // Update order with SMS sent timestamp
    await supabase
      .from('orders')
      .update({ 
        payment_confirmation_sms_sent_at: new Date().toISOString() 
      })
      .eq('id', orderId);

    return NextResponse.json({
      success: true,
      message: 'SMS sent successfully',
      sms_id: result.sms_id
    });

  } catch (error: any) {
    console.error('[Send Order SMS] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
