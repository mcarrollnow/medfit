import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Generate a unique random referral code
function generateReferralCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // Excluded I, O, 0, 1 to avoid confusion
  let code = ''
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

// Create Supabase client for auth
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      email, 
      password, 
      firstName, 
      lastName, 
      phone, 
      referralCode, 
      customerType, 
      phoneVerified, 
      authId,
      skipPhoneCheck // For standard email registration
    } = body;

    console.log('[Register API] Received request:', {
      email: email ? `${email.substring(0, 3)}...` : 'missing',
      passwordLength: password?.length || 0,
      firstName: firstName || 'missing',
      lastName: lastName || 'not provided',
      phone: phone || 'not provided',
      phoneVerified: phoneVerified || false,
      authId: authId ? `${authId.substring(0, 8)}...` : 'not provided',
      skipPhoneCheck: skipPhoneCheck || false,
      referralCode: referralCode || 'not provided',
      customerType: customerType || 'retail'
    });

    // Validate required fields
    if (!email || !password || !firstName) {
      return NextResponse.json(
        {
          error: {
            message: 'Missing required fields',
            details: ['Email, password, and first name are required']
          }
        },
        { status: 400 }
      );
    }

    // Password validation
    if (password.length < 8) {
      return NextResponse.json(
        {
          error: {
            message: 'Password too weak',
            details: ['Password must be at least 8 characters long']
          }
        },
        { status: 400 }
      );
    }

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('[Register API] Missing SUPABASE_SERVICE_ROLE_KEY');
      return NextResponse.json(
        {
          error: {
            message: 'Server configuration error',
            details: ['Registration service is not properly configured']
          }
        },
        { status: 500 }
      );
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    let authUserId: string;
    let isPhoneVerified = phoneVerified || false;

    // TWO PATHS:
    // 1. Phone-first registration: authId is provided (user verified phone via OTP)
    // 2. Standard email registration: create new auth user with email/password

    if (authId) {
      // Phone-first flow: User already verified phone, use their auth ID
      console.log('[Register API] Phone-first flow, using existing auth ID:', authId);
      authUserId = authId;

      // Update the auth user with email/password
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(authId, {
        email,
        password,
        user_metadata: {
          first_name: firstName,
          last_name: lastName || '',
          phone: phone || null,
          role: 'customer'
        }
      });

      if (updateError) {
        console.error('[Register API] Error updating auth user:', updateError);
      }
    } else {
      // Standard email registration: create new auth user
      console.log('[Register API] Standard email registration');

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_MAIN_APP_URL || 'http://localhost:3000'}/login`,
          data: {
            first_name: firstName,
            last_name: lastName,
            phone: phone || null,
            role: 'customer'
          }
        }
      });

      if (authError) {
        console.error('[Register API] Auth error:', authError);

        if (authError.message?.includes('already registered') || authError.message?.includes('already exists')) {
          return NextResponse.json(
            {
              error: {
                message: 'User already exists',
                details: ['An account with this email already exists']
              }
            },
            { status: 409 }
          );
        }

        return NextResponse.json(
          {
            error: {
              message: 'Registration failed',
              details: [authError.message || 'Failed to create account']
            }
          },
          { status: 400 }
        );
      }

      if (!authData.user) {
        return NextResponse.json(
          {
            error: {
              message: 'Registration failed',
              details: ['Failed to create user account']
            }
          },
          { status: 500 }
        );
      }

      authUserId = authData.user.id;
      console.log('[Register API] Auth user created:', authUserId);
    }

    // Format phone if provided
    let formattedPhone = phone ? phone.replace(/\D/g, '') : null;
    if (formattedPhone && formattedPhone.length === 10) {
      formattedPhone = `+1${formattedPhone}`;
    } else if (formattedPhone && !formattedPhone.startsWith('+')) {
      formattedPhone = `+${formattedPhone}`;
    }

    // Create or update user record in users table
    let userData: any = null;
    
    const { data: insertedUser, error: userError } = await supabaseAdmin
      .from('users')
      .insert({
        auth_id: authUserId,
        email,
        first_name: firstName,
        last_name: lastName || '',
        phone: formattedPhone,
        phone_verified: isPhoneVerified,
        phone_verified_at: isPhoneVerified ? new Date().toISOString() : null,
        preferred_auth_method: isPhoneVerified ? 'phone' : 'email',
        role: 'customer',
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (userError) {
      // Handle duplicate key error (23505) - user already exists
      if (userError.code === '23505') {
        console.log('[Register API] User already exists, fetching existing record...');
        const { data: existingUser, error: fetchError } = await supabaseAdmin
          .from('users')
          .select('*')
          .eq('auth_id', authUserId)
          .single();
        
        if (fetchError || !existingUser) {
          console.error('[Register API] Failed to fetch existing user:', fetchError);
        } else {
          userData = existingUser;
          console.log('[Register API] Found existing user:', userData.id);
          
          // Update the existing user with new info
          await supabaseAdmin
            .from('users')
            .update({
              email,
              first_name: firstName,
              last_name: lastName || '',
              phone: formattedPhone,
              phone_verified: isPhoneVerified,
              phone_verified_at: isPhoneVerified ? new Date().toISOString() : null,
              preferred_auth_method: isPhoneVerified ? 'phone' : 'email',
            })
            .eq('id', userData.id);
        }
      } else {
        console.error('[Register API] User table error:', userError);
      }
    } else {
      userData = insertedUser;
      console.log('[Register API] User record created:', userData?.id);
    }

    // Create customer record with referral code (if user exists and customer doesn't)
    if (userData) {
      // Check if customer already exists for this user
      const { data: existingCustomer } = await supabaseAdmin
        .from('customers')
        .select('id, referral_code')
        .eq('user_id', userData.id)
        .single();
      
      if (existingCustomer) {
        console.log('[Register API] Customer already exists:', existingCustomer.id);
      } else {
        const newUserReferralCode = generateReferralCode();
        
        // Validate and prepare referred_by info if a referral code was provided
        let referredByCode: string | null = null;
        let referredByCustomerId: string | null = null;
        
        if (referralCode) {
          const normalizedCode = referralCode.toUpperCase().trim();
          const { data: referrer } = await supabaseAdmin
            .from('customers')
            .select('id, referral_code')
            .eq('referral_code', normalizedCode)
            .single();
          
          if (referrer) {
            referredByCode = referrer.referral_code;
            referredByCustomerId = referrer.id;
            console.log('[Register API] Valid referral code found, referred by customer:', referrer.id);
          } else {
            console.log('[Register API] Referral code not found:', normalizedCode);
          }
        }
        
        const { error: customerError } = await supabaseAdmin
          .from('customers')
          .insert({
            user_id: userData.id,
            customer_type: customerType || 'retail',
            phone: formattedPhone,
            referral_code: newUserReferralCode,
            referred_by_code: referredByCode,
            referred_by_customer_id: referredByCustomerId,
            referral_signup_date: referredByCode ? new Date().toISOString() : null,
            created_at: new Date().toISOString()
          });

        if (customerError) {
          console.error('[Register API] Customer table error:', customerError);
        } else {
          console.log('[Register API] Customer created with referral code:', newUserReferralCode);
        }
      }
    }

    const message = authId 
      ? 'Account created successfully!' 
      : 'Account created successfully! Please check your email to verify your account.';

    return NextResponse.json(
      {
        message,
        success: true,
        user: {
          id: authUserId,
          email: email
        }
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('[Register API] Unexpected error:', error);
    return NextResponse.json(
      {
        error: {
          message: 'An unexpected error occurred',
          details: [error.message || 'Please try again later']
        }
      },
      { status: 500 }
    );
  }
}
