import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyAuth } from '../../../lib/auth-server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('id');

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }
    
    console.log('[Order Details API] Fetching order:', orderId);

    // Verify authentication
    const authResult = await verifyAuth(req);
    if (!authResult.authenticated || !authResult.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
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

    // Get order details with items
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          product_id,
          product_name,
          quantity,
          unit_price,
          total_price
        ),
        customers (
          id,
          users!customers_user_id_fkey (
            first_name,
            last_name,
            email
          )
        )
      `)
      .eq('id', orderId)
      .single();

    if (orderError) {
      console.error('[Order Details] Error fetching order:', orderError);
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Verify the order belongs to the authenticated user
    // Skip verification in development mode for testing
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    if (!isDevelopment && order.customer_id) {
      const { data: customer } = await supabase
        .from('customers')
        .select('user_id')
        .eq('id', order.customer_id)
        .single();

      // Also check if the auth user ID matches
      const { data: publicUser } = await supabase
        .from('users')
        .select('id')
        .eq('auth_id', authResult.user.id)
        .single();

      if (customer?.user_id !== authResult.user.id && customer?.user_id !== publicUser?.id) {
        console.log('[Order Details] Access denied - user mismatch:', {
          customerUserId: customer?.user_id,
          authUserId: authResult.user.id,
          publicUserId: publicUser?.id
        });
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 403 }
        );
      }
    }

    // Format the response
    // First try to use shipping_name from the order, then fall back to customer relationship
    const customerName = order.shipping_name || 
      (order.customers?.[0]?.users?.[0] 
        ? `${order.customers[0].users[0].first_name || ''} ${order.customers[0].users[0].last_name || ''}`.trim()
        : 'Customer');
    
    // Get customer email from order or customer relationship
    const customerEmail = order.customer_email || 
      order.customers?.[0]?.users?.[0]?.email || '';

    const response = {
      id: order.id,
      order_number: order.order_number,
      subtotal: order.subtotal || 0,
      shipping_amount: order.shipping_amount || 0,
      total_amount: order.total || 0,
      discount_amount: order.discount_amount || 0,
      payment_status: order.payment_status || 'pending',
      payment_method: order.payment_method || 'crypto',
      expected_payment_amount: order.expected_payment_amount || order.total || 0,
      expected_payment_currency: order.expected_payment_currency || 'ETH',
      transaction_hash: order.transaction_hash || '',
      customer_name: customerName,
      customer_email: customerEmail,
      shipping_address_line1: order.shipping_address_line1 || order.shipping_address || '',
      shipping_city: order.shipping_city || '',
      shipping_state: order.shipping_state || '',
      shipping_zip: order.shipping_zip || '',
      shipping_country: order.shipping_country || 'USA',
      discount_details: order.discount_details || null,
      items: order.order_items || [],
      transaction_details: order.transaction_hash ? {
        tx_hash: order.transaction_hash,
        amount: order.actual_payment_amount?.toString() || order.expected_payment_amount?.toString() || '0',
        currency: order.expected_payment_currency || 'ETH',
        from_address: '',
        to_address: '',
        etherscan_url: `https://etherscan.io/tx/${order.transaction_hash}`
      } : undefined
    };

    return NextResponse.json(response);

  } catch (error: any) {
    console.error('[Order Details] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
