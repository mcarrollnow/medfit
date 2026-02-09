import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '../../../lib/auth-server';
import { createClient } from '@supabase/supabase-js';

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    // Verify user authentication
    const authResult = await verifyAuth(req);
    if (!authResult.authenticated) {
      console.log('[validate-discount] Authentication failed:', authResult.error);
      return NextResponse.json(
        { error: authResult.error },
        { status: 401 }
      );
    }
    
    console.log('[validate-discount] User authenticated:', authResult.user!.id);

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase environment variables');
    }

    // Use service role to read discount_codes table (admin only)
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    
    const { code, orderAmount } = await req.json();
    console.log('[validate-discount] Request data:', { code, orderAmount });

    if (!code || orderAmount === undefined) {
      console.log('[validate-discount] Missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Fetch discount code (case-insensitive)
    const { data: discount, error: discountError } = await supabase
      .from('discount_codes')
      .select('*')
      .ilike('code', code)
      .maybeSingle();

    if (discountError) {
      console.log('[validate-discount] Database error:', discountError?.message);
      return NextResponse.json({ 
        valid: false,
        error: 'Database error while validating discount code' 
      }, { status: 500 });
    }

    if (!discount) {
      console.log('[validate-discount] Discount not found for code:', code);
      return NextResponse.json({ 
        valid: false,
        error: 'Invalid discount code' 
      }, { status: 404 });
    }
    
    console.log('[validate-discount] Discount found:', discount.code);

    // Check if active
    if (!discount.is_active) {
      return NextResponse.json({ 
        valid: false,
        error: 'This discount code is no longer active' 
      }, { status: 400 });
    }

    // Check valid_from date
    if (discount.valid_from && new Date(discount.valid_from) > new Date()) {
      return NextResponse.json({ 
        valid: false,
        error: 'This discount code is not yet valid' 
      }, { status: 400 });
    }

    // Check valid_until date
    if (discount.valid_until && new Date(discount.valid_until) < new Date()) {
      return NextResponse.json({ 
        valid: false,
        error: 'This discount code has expired' 
      }, { status: 400 });
    }

    // Check max uses
    if (discount.max_uses && discount.current_uses >= discount.max_uses) {
      return NextResponse.json({ 
        valid: false,
        error: 'This discount code has reached its usage limit' 
      }, { status: 400 });
    }

    // Check minimum order amount
    if (discount.min_order_amount && orderAmount < discount.min_order_amount) {
      return NextResponse.json({ 
        valid: false,
        error: `Minimum order amount of $${discount.min_order_amount.toFixed(2)} required` 
      }, { status: 400 });
    }

    // Get customer type
    const { data: customer } = await supabase
      .from('customers')
      .select('customer_type')
      .eq('user_id', authResult.user!.id)
      .single();

    const customerType = customer?.customer_type || 'retail';
    
    // Map VIP customer types to their base types for discount validation
    const baseCustomerType = customerType.includes('vip') 
      ? customerType.replace('vip', '') 
      : customerType;

    // Check customer type restriction
    if (discount.customer_type !== 'all' && 
        discount.customer_type !== customerType && 
        discount.customer_type !== baseCustomerType) {
      return NextResponse.json({ 
        valid: false,
        error: `This discount code is only valid for ${discount.customer_type} customers` 
      }, { status: 400 });
    }

    // For set_price type, fetch custom product prices
    let customProductPrices: Record<string, number> = {};
    if (discount.discount_type === 'set_price') {
      const { data: productPrices, error: pricesError } = await supabase
        .from('discount_code_products')
        .select('product_id, custom_price')
        .eq('discount_code_id', discount.id);
      
      console.log('[validate-discount] Fetching custom prices for discount:', discount.id);
      console.log('[validate-discount] Product prices query result:', productPrices);
      console.log('[validate-discount] Product prices query error:', pricesError);
      
      if (productPrices && productPrices.length > 0) {
        productPrices.forEach(p => {
          customProductPrices[p.product_id] = p.custom_price;
        });
      }
      console.log('[validate-discount] Set price code - custom prices map:', customProductPrices);
    }

    // Calculate discount amount
    let discountAmount = 0;
    if (discount.discount_type === 'percentage') {
      discountAmount = (orderAmount * discount.discount_value) / 100;
    } else if (discount.discount_type === 'fixed') {
      discountAmount = discount.discount_value;
    }
    // For set_price, discount_amount stays 0 - the savings come from custom product prices

    // Ensure discount doesn't exceed order amount
    discountAmount = Math.min(discountAmount, orderAmount);

    return NextResponse.json({
      valid: true,
      discount_amount: parseFloat(discountAmount.toFixed(2)),
      discount_percentage: discount.discount_type === 'percentage' ? discount.discount_value : undefined,
      discount_code_id: discount.id,
      message: `Discount "${discount.code}" applied successfully!`,
      // Additional data for UI display
      discount: {
        id: discount.id,
        code: discount.code,
        description: discount.description,
        discount_type: discount.discount_type,
        discount_value: discount.discount_value,
        free_shipping: discount.free_shipping || false,
        custom_product_prices: discount.discount_type === 'set_price' ? customProductPrices : undefined
      }
    });

  } catch (error: any) {
    console.error('[validate-discount] Error:', error);
    return NextResponse.json(
      { error: 'Failed to validate discount code' },
      { status: 500 }
    );
  }
}
