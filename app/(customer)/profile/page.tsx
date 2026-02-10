'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Phone, Camera, Save, Shield, MapPin, Building, Gift, Copy, Check, CheckCircle, ArrowRight, Smartphone } from 'lucide-react';
import { getSupabaseBrowserClient } from '@/lib/supabase-browser';
import { getCustomerProfile } from '@/lib/auth-client';
import { generateReferralCode, applyReferralToCustomer, validateReferralCode } from '@/app/actions/referrals';

export default function CustomerProfilePage() {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    profilePictureUrl: '',
    customerType: 'retail' as 'retail' | 'b2b',
    companyName: '',
    shippingAddressLine1: '',
    shippingAddressLine2: '',
    shippingCity: '',
    shippingState: '',
    shippingZip: '',
    shippingCountry: 'United States',
    referralCode: '',
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [referralCopied, setReferralCopied] = useState(false);
  const [generatingReferral, setGeneratingReferral] = useState(false);
  const [referredByCode, setReferredByCode] = useState('');
  const [referredByInput, setReferredByInput] = useState('');
  const [applyingReferral, setApplyingReferral] = useState(false);
  const [referralApplyError, setReferralApplyError] = useState<string | null>(null);
  const [referralApplySuccess, setReferralApplySuccess] = useState(false);
  
  // Mobile authentication state
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [verifiedPhone, setVerifiedPhone] = useState('');
  const [mobileAuthStep, setMobileAuthStep] = useState<'idle' | 'phone' | 'verify' | 'success'>('idle');
  const [newPhone, setNewPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [mobileAuthLoading, setMobileAuthLoading] = useState(false);
  const [mobileAuthError, setMobileAuthError] = useState<string | null>(null);
  const [resendCountdown, setResendCountdown] = useState(0);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Countdown timer for OTP resend
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  // Handle hash navigation (e.g., /profile#referral)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const id = window.location.hash.substring(1);
      // Small delay to ensure the element is rendered
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const profile = await getCustomerProfile();

      if (profile) {
        setCustomerId(profile.id);
        setUserId(profile.user_id);
        setProfileData({
          firstName: profile.first_name || '',
          lastName: profile.last_name || '',
          email: profile.email || '',
          phone: profile.phone || '',
          profilePictureUrl: '',
          customerType: profile.customer_type || 'retail',
          companyName: profile.company_name || '',
          shippingAddressLine1: profile.shipping_address_line1 || '',
          shippingAddressLine2: profile.shipping_address_line2 || '',
          shippingCity: profile.shipping_city || '',
          shippingState: profile.shipping_state || '',
          shippingZip: profile.shipping_zip || '',
          shippingCountry: profile.shipping_country || 'United States',
          referralCode: profile.referral_code || '',
        });
        setReferredByCode(profile.referred_by_code || '');
        
        // Fetch phone verification status from users table
        const supabase = getSupabaseBrowserClient();
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser) {
          const { data: userData } = await supabase
            .from('users')
            .select('id, phone, phone_verified')
            .eq('auth_id', authUser.id)
            .single();
          
          if (userData) {
            setUserId(userData.id);
            setPhoneVerified(userData.phone_verified || false);
            if (userData.phone_verified && userData.phone) {
              setVerifiedPhone(userData.phone);
            }
          }
        }
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
      setError('Failed to load profile');
    }
  };

  const handleApplyReferralCode = async () => {
    if (!customerId || !referredByInput.trim()) {
      setReferralApplyError('Please enter a referral code');
      return;
    }

    setApplyingReferral(true);
    setReferralApplyError(null);
    setReferralApplySuccess(false);

    try {
      // First validate the code
      const validation = await validateReferralCode(referredByInput.trim());
      if (!validation.valid) {
        setReferralApplyError(validation.error || 'Invalid referral code');
        return;
      }

      // Apply the referral
      const result = await applyReferralToCustomer(customerId, referredByInput.trim());
      if (result.success) {
        setReferredByCode(referredByInput.trim().toUpperCase());
        setReferredByInput('');
        setReferralApplySuccess(true);
        setTimeout(() => setReferralApplySuccess(false), 3000);
      } else {
        setReferralApplyError(result.error || 'Failed to apply referral code');
      }
    } catch (err) {
      console.error('Failed to apply referral code:', err);
      setReferralApplyError('Failed to apply referral code');
    } finally {
      setApplyingReferral(false);
    }
  };

  const handleGenerateReferralCode = async () => {
    if (!customerId) {
      setError('Unable to generate referral code. Please try again.');
      return;
    }
    
    setGeneratingReferral(true);
    try {
      const { success, code, error: genError } = await generateReferralCode(customerId);
      if (success && code) {
        setProfileData(prev => ({ ...prev, referralCode: code }));
      } else {
        setError(genError || 'Failed to generate referral code');
      }
    } catch (err) {
      console.error('Failed to generate referral code:', err);
      setError('Failed to generate referral code');
    } finally {
      setGeneratingReferral(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const supabase = getSupabaseBrowserClient();
      
      // Get current user
      const { data: { user: authUser } } = await supabase.auth.getUser();

      if (!authUser) {
        setError('Not authenticated');
        return;
      }

      // Update users table
      const { error: userError } = await supabase
        .from('users')
        .update({
          first_name: profileData.firstName,
          last_name: profileData.lastName,
          phone: profileData.phone,
          updated_at: new Date().toISOString()
        })
        .eq('auth_id', authUser.id);

      if (userError) {
        console.error('User update error:', userError);
        setError('Failed to update profile');
        return;
      }

      // Get user id for customer update
      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('auth_id', authUser.id)
        .single();

      if (userData) {
        // Update customers table
        const { error: customerError } = await supabase
          .from('customers')
          .update({
            company_name: profileData.companyName,
            shipping_address_line1: profileData.shippingAddressLine1,
            shipping_address_line2: profileData.shippingAddressLine2,
            shipping_city: profileData.shippingCity,
            shipping_state: profileData.shippingState,
            shipping_zip: profileData.shippingZip,
            shipping_country: profileData.shippingCountry,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userData.id);

        if (customerError) {
          console.error('Customer update error:', customerError);
        }
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Profile update error:', error);
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  // Format phone for E.164
  const formatPhoneE164 = (phoneNumber: string) => {
    const cleaned = phoneNumber.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `+1${cleaned}`;
    }
    return `+${cleaned}`;
  };

  // Format new phone as user types
  const handleNewPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const previousCleaned = newPhone.replace(/\D/g, '');
    const newCleaned = input.replace(/\D/g, '');
    
    let cleaned = newCleaned;
    if (input.length < newPhone.length && newCleaned.length === previousCleaned.length && newCleaned.length > 0) {
      cleaned = newCleaned.slice(0, -1);
    }

    let formatted = cleaned;
    if (cleaned.length >= 6) {
      formatted = `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
    } else if (cleaned.length >= 3) {
      formatted = `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    }

    setNewPhone(formatted);
  };

  // Send OTP to new phone - uses updateUser to link phone to EXISTING account
  const sendMobileAuthOtp = async () => {
    setMobileAuthLoading(true);
    setMobileAuthError(null);

    try {
      const supabase = getSupabaseBrowserClient();
      const formattedPhone = formatPhoneE164(newPhone);

      // First check if this phone is already used by another account
      const checkResponse = await fetch('/api/auth/check-phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formattedPhone }),
      });
      
      const checkData = await checkResponse.json();
      
      if (checkData.exists && checkData.verified) {
        setMobileAuthError('This phone number is already linked to another account.');
        return;
      }

      // Use updateUser to add phone to existing account (sends verification SMS)
      const { error: updateError } = await supabase.auth.updateUser({
        phone: formattedPhone,
      });

      if (updateError) {
        setMobileAuthError(updateError.message);
        return;
      }

      setMobileAuthStep('verify');
      setResendCountdown(60);
    } catch (err: any) {
      setMobileAuthError('Failed to send verification code');
    } finally {
      setMobileAuthLoading(false);
    }
  };

  // Verify OTP and update profile - uses phone_change type for linking to existing account
  const verifyMobileAuthOtp = async () => {
    setMobileAuthLoading(true);
    setMobileAuthError(null);

    try {
      const supabase = getSupabaseBrowserClient();
      const formattedPhone = formatPhoneE164(newPhone);

      // Use phone_change type since we're adding phone to existing account
      const { error: verifyError } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token: otpCode,
        type: 'phone_change',
      });

      if (verifyError) {
        setMobileAuthError(verifyError.message);
        return;
      }

      // Update the user's phone in the database
      if (userId) {
        const response = await fetch('/api/user/update-phone', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            phone: formattedPhone,
            phoneVerified: true,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          setMobileAuthError(data.error?.message || 'Failed to update profile');
          return;
        }
      }

      setPhoneVerified(true);
      setVerifiedPhone(formattedPhone);
      setMobileAuthStep('success');
      
      // Reset after showing success
      setTimeout(() => {
        setMobileAuthStep('idle');
        setNewPhone('');
        setOtpCode('');
      }, 3000);
    } catch (err: any) {
      setMobileAuthError('Verification failed');
    } finally {
      setMobileAuthLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    setUploading(true);

    try {
      // Convert to base64 for simple storage
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setProfileData({ ...profileData, profilePictureUrl: base64String });
        setUploading(false);
      };
      reader.onerror = () => {
        setError('Failed to read image');
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setError('Failed to upload image');
      setUploading(false);
    }
  };

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    
    // Allow empty
    if (cleaned.length === 0) return '';
    
    // Format based on length
    if (cleaned.length <= 3) {
      return cleaned;
    } else if (cleaned.length <= 6) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    } else {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    
    // Allow clearing the field
    if (input === '') {
      setProfileData({ ...profileData, phone: '' });
      return;
    }
    
    const formatted = formatPhoneNumber(input);
    setProfileData({ ...profileData, phone: formatted });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-8">Profile Settings</h1>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-2xl text-green-400">
            Profile updated successfully!
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400">
            {error}
          </div>
        )}

        {/* Profile Form */}
        <div className="relative overflow-hidden rounded-3xl border border-border bg-foreground/5 backdrop-blur-xl p-8">
          {/* Noise texture overlay */}
          <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
          <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
            {/* Profile Picture */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                {profileData.profilePictureUrl ? (
                  <img
                    src={profileData.profilePictureUrl}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-border"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-foreground/10 flex items-center justify-center border-4 border-border">
                    <User className="w-16 h-16 text-muted-foreground" />
                  </div>
                )}
                <label
                  htmlFor="profile-picture"
                  className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full cursor-pointer hover:bg-card/90 transition-colors"
                >
                  <Camera className="w-5 h-5" />
                  <input
                    id="profile-picture"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              </div>
              {uploading && (
                <p className="text-sm text-muted-foreground">Uploading...</p>
              )}
              <p className="text-sm text-muted-foreground">Click the camera icon to upload a profile picture</p>
            </div>

            {/* Personal Information */}
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-4">Personal Information</h2>

              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-foreground/70 mb-2">
                    First Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <input
                      type="text"
                      value={profileData.firstName}
                      onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                      required
                      className="w-full pl-12 pr-4 py-3.5 bg-foreground/5 border border-border rounded-xl text-foreground focus:outline-none focus:border-border focus:ring-0 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground/70 mb-2">
                    Last Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <input
                      type="text"
                      value={profileData.lastName}
                      onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                      className="w-full pl-12 pr-4 py-3.5 bg-foreground/5 border border-border rounded-xl text-foreground focus:outline-none focus:border-border focus:ring-0 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Email (Read-only) */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-foreground/70 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <input
                    type="email"
                    value={profileData.email}
                    disabled
                    className="w-full pl-12 pr-4 py-3.5 bg-foreground/[0.03] border border-border rounded-xl text-muted-foreground cursor-not-allowed"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
              </div>

              {/* Phone Number */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-foreground/70 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={handlePhoneChange}
                    placeholder="(555) 123-4567"
                    maxLength={14}
                    className="w-full pl-12 pr-4 py-3.5 bg-foreground/5 border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:border-border focus:ring-0 transition-colors"
                  />
                </div>
              </div>

              {/* Company Name (for B2B) */}
              {profileData.customerType === 'b2b' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-foreground/70 mb-2">
                    Company Name
                  </label>
                  <div className="relative">
                    <Building className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <input
                      type="text"
                      value={profileData.companyName}
                      onChange={(e) => setProfileData({ ...profileData, companyName: e.target.value })}
                      className="w-full pl-12 pr-4 py-3.5 bg-foreground/5 border border-border rounded-xl text-foreground focus:outline-none focus:border-border focus:ring-0 transition-colors"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Shipping Address */}
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Shipping Address
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground/70 mb-2">
                    Address Line 1
                  </label>
                  <input
                    type="text"
                    value={profileData.shippingAddressLine1}
                    onChange={(e) => setProfileData({ ...profileData, shippingAddressLine1: e.target.value })}
                    placeholder="123 Main Street"
                    className="w-full px-4 py-3.5 bg-foreground/5 border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:border-border focus:ring-0 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground/70 mb-2">
                    Address Line 2 <span className="text-muted-foreground text-xs">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={profileData.shippingAddressLine2}
                    onChange={(e) => setProfileData({ ...profileData, shippingAddressLine2: e.target.value })}
                    placeholder="Apartment, suite, etc."
                    className="w-full px-4 py-3.5 bg-foreground/5 border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:border-border focus:ring-0 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground/70 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      value={profileData.shippingCity}
                      onChange={(e) => setProfileData({ ...profileData, shippingCity: e.target.value })}
                      className="w-full px-4 py-3.5 bg-foreground/5 border border-border rounded-xl text-foreground focus:outline-none focus:border-border focus:ring-0 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground/70 mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      value={profileData.shippingState}
                      onChange={(e) => setProfileData({ ...profileData, shippingState: e.target.value })}
                      maxLength={2}
                      placeholder="AZ"
                      className="w-full px-4 py-3.5 bg-foreground/5 border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:border-border focus:ring-0 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground/70 mb-2">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      value={profileData.shippingZip}
                      onChange={(e) => setProfileData({ ...profileData, shippingZip: e.target.value })}
                      maxLength={10}
                      className="w-full px-4 py-3.5 bg-foreground/5 border border-border rounded-xl text-foreground focus:outline-none focus:border-border focus:ring-0 transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || uploading}
              className="w-full flex items-center justify-center space-x-2 py-3.5 bg-primary text-primary-foreground rounded-xl hover:bg-card/90 font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              <span>{loading ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </form>
        </div>

        {/* Referral Code */}
        <div id="referral" className="relative overflow-hidden rounded-3xl border border-border bg-foreground/5 backdrop-blur-xl p-8 mt-6 scroll-mt-24">
          <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-foreground/10 flex items-center justify-center">
                <Gift className="w-5 h-5 text-foreground" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Referral Program</h2>
            </div>

            {/* Add a friend's referral code (one-time) */}
            {!referredByCode ? (
              <div className="p-5 bg-foreground/5 rounded-2xl border border-border mb-4">
                <h3 className="text-lg font-semibold text-foreground mb-2">Add a Friend's Referral Code</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Have a friend's referral code? Enter it here to get a discount on your orders. You can only add a referral code once.
                </p>
                {referralApplySuccess && (
                  <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 text-sm">
                    Referral code applied successfully! You'll receive a discount on your orders.
                  </div>
                )}
                {referralApplyError && (
                  <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                    {referralApplyError}
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={referredByInput}
                    onChange={(e) => setReferredByInput(e.target.value.toUpperCase())}
                    placeholder="Enter code (e.g. JOHN1234)"
                    maxLength={10}
                    className="flex-1 px-4 py-3.5 bg-foreground/5 border border-border rounded-xl font-mono text-foreground placeholder-muted-foreground tracking-wider focus:outline-none focus:border-border focus:ring-0 transition-colors"
                  />
                  <button
                    onClick={handleApplyReferralCode}
                    disabled={applyingReferral || !referredByInput.trim()}
                    className="px-6 py-3.5 bg-primary text-primary-foreground rounded-xl hover:bg-card/90 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {applyingReferral ? 'Applying...' : 'Apply'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-5 bg-foreground/5 rounded-2xl border border-border mb-4">
                <h3 className="text-lg font-semibold text-foreground mb-2">Referred By</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  You were referred with this code:
                </p>
                <div className="px-4 py-3 bg-foreground/5 border border-border rounded-xl font-mono text-lg text-foreground tracking-wider inline-block">
                  {referredByCode}
                </div>
              </div>
            )}

            {profileData.referralCode ? (
              <div className="p-5 bg-foreground/5 rounded-2xl border border-border">
                <h3 className="text-lg font-semibold text-foreground mb-2">Your Referral Code</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Share this code with friends and earn rewards when they make a purchase.
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 px-4 py-3.5 bg-foreground/5 border border-border rounded-xl font-mono text-xl text-foreground tracking-wider">
                    {profileData.referralCode}
                  </div>
                  <button
                    onClick={async () => {
                      await navigator.clipboard.writeText(profileData.referralCode);
                      setReferralCopied(true);
                      setTimeout(() => setReferralCopied(false), 2000);
                    }}
                    className="px-4 py-3.5 bg-primary text-primary-foreground rounded-xl hover:bg-card/90 transition-all duration-300 flex items-center gap-2 font-medium"
                  >
                    {referralCopied ? (
                      <>
                        <Check className="w-5 h-5" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-5 h-5" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-5 bg-foreground/5 rounded-2xl border border-border">
                <h3 className="text-lg font-semibold text-foreground mb-2">Get Your Referral Code</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Share your unique code with friends. They'll get a discount on their first order, and you'll earn rewards when they make a purchase.
                </p>
                <button
                  onClick={handleGenerateReferralCode}
                  disabled={generatingReferral}
                  className="px-6 py-3.5 bg-primary text-primary-foreground rounded-xl hover:bg-card/90 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {generatingReferral ? 'Generating...' : 'Generate My Referral Code'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Security Settings */}
        <div id="security" className="relative overflow-hidden rounded-3xl border border-border bg-foreground/5 backdrop-blur-xl p-8 mt-6 scroll-mt-24">
          <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-foreground/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-foreground" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Security Settings</h2>
            </div>

            <div className="space-y-4">
              {/* Mobile Authentication */}
              <div className="p-5 bg-foreground/5 rounded-2xl border border-border">
                <div className="flex items-center gap-3 mb-4">
                  <Smartphone className="w-5 h-5 text-foreground" />
                  <h3 className="text-lg font-semibold text-foreground">Mobile Authentication</h3>
                  {phoneVerified && (
                    <span className="px-2 py-1 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 text-xs font-medium">
                      Verified
                    </span>
                  )}
                </div>

                {phoneVerified ? (
                  <div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Your phone number is verified. You can sign in using SMS verification.
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="px-4 py-3 bg-foreground/5 border border-border rounded-xl font-mono text-foreground">
                        {verifiedPhone}
                      </div>
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    </div>
                    <button
                      onClick={() => {
                        setMobileAuthStep('phone');
                        setMobileAuthError(null);
                      }}
                      className="mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Change phone number
                    </button>
                  </div>
                ) : mobileAuthStep === 'idle' ? (
                  <div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Add your phone number for faster, more secure sign-in with SMS verification codes.
                    </p>
                    <button
                      onClick={() => setMobileAuthStep('phone')}
                      className="px-4 py-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-card/90 transition-all duration-300 text-sm font-medium flex items-center gap-2"
                    >
                      <Phone className="w-4 h-4" />
                      Add Phone Number
                    </button>
                  </div>
                ) : mobileAuthStep === 'phone' ? (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Enter your phone number to receive a verification code.
                    </p>
                    
                    {mobileAuthError && (
                      <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                        {mobileAuthError}
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      <div className="relative flex-1">
                        <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                        <input
                          type="tel"
                          value={newPhone}
                          onChange={handleNewPhoneChange}
                          placeholder="(555) 123-4567"
                          maxLength={14}
                          className="w-full pl-12 pr-4 py-3.5 bg-foreground/5 border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:border-border focus:ring-0 transition-colors"
                        />
                      </div>
                      <button
                        onClick={sendMobileAuthOtp}
                        disabled={mobileAuthLoading || newPhone.replace(/\D/g, '').length < 10}
                        className="px-6 py-3.5 bg-primary text-primary-foreground rounded-xl hover:bg-card/90 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {mobileAuthLoading ? 'Sending...' : (
                          <>
                            Send Code
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        setMobileAuthStep('idle');
                        setNewPhone('');
                        setMobileAuthError(null);
                      }}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                ) : mobileAuthStep === 'verify' ? (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Enter the 6-digit code sent to {newPhone}
                    </p>
                    
                    {mobileAuthError && (
                      <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                        {mobileAuthError}
                      </div>
                    )}

                    <input
                      type="text"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="123456"
                      maxLength={6}
                      className="w-full px-4 py-3.5 bg-foreground/5 border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:border-border focus:ring-0 transition-colors text-center text-2xl font-mono tracking-[0.5em]"
                      autoFocus
                    />

                    <div className="flex items-center gap-3">
                      <button
                        onClick={verifyMobileAuthOtp}
                        disabled={mobileAuthLoading || otpCode.length !== 6}
                        className="flex-1 py-3.5 bg-primary text-primary-foreground rounded-xl hover:bg-card/90 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {mobileAuthLoading ? 'Verifying...' : (
                          <>
                            Verify
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => {
                          setMobileAuthStep('phone');
                          setOtpCode('');
                          setMobileAuthError(null);
                        }}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Back
                      </button>
                      <button
                        onClick={sendMobileAuthOtp}
                        disabled={resendCountdown > 0 || mobileAuthLoading}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                      >
                        {resendCountdown > 0 ? `Resend in ${resendCountdown}s` : 'Resend code'}
                      </button>
                    </div>
                  </div>
                ) : mobileAuthStep === 'success' ? (
                  <div className="text-center py-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500/20 border border-green-500/30 mb-4">
                      <CheckCircle className="w-6 h-6 text-green-400" />
                    </div>
                    <h4 className="text-lg font-semibold text-foreground mb-2">Phone Verified</h4>
                    <p className="text-sm text-muted-foreground">
                      You can now sign in using your phone number.
                    </p>
                  </div>
                ) : null}
              </div>

              {/* Account Type */}
              <div className="p-5 bg-foreground/5 rounded-2xl border border-border">
                <h3 className="text-lg font-semibold text-foreground mb-2">Account Type</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  You are registered as a <span className="font-semibold text-foreground">{profileData.customerType === 'b2b' ? 'Business' : 'Retail'}</span> customer.
                </p>
                {profileData.customerType === 'b2b' && (
                  <p className="text-sm text-green-400">You have access to wholesale pricing.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}