import { create } from 'zustand';
import type { User } from '../types';
import { supabase } from '../lib/supabase-client';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  updateUser: (user: User) => void;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  loading: false, // Start with false - only show loading when actually initializing
  error: null,
  
  setUser: (user) => set({ 
    user, 
    isAuthenticated: !!user,
    loading: false,
    error: null
  }),
  
  updateUser: (user) => set({ user }),
  
  logout: async () => {
    // Clear local state first
    set({ user: null, isAuthenticated: false, error: null });
    
    // Clear all auth-related localStorage items
    if (typeof window !== 'undefined') {
      const keysToRemove = Object.keys(localStorage).filter(key => 
        key.includes('supabase') || 
        key.includes('auth') || 
        key.includes('sb-') ||
        key.includes('token')
      );
      keysToRemove.forEach(key => {
        try {
          localStorage.removeItem(key);
        } catch {}
      });
      
      // Clear session storage
      try {
        sessionStorage.clear();
      } catch {}
    }
    
    // Sign out from Supabase
    await supabase.auth.signOut({ scope: 'local' });
  },
  
  initialize: async () => {
    // Don't initialize if already loading
    if (get().loading) {
      console.log('[AuthStore] Already initializing, skipping...');
      return;
    }
    
    console.log('[AuthStore] Starting initialization...');
    set({ loading: true, error: null });
    
    // Set up auth state listener FIRST - this is crucial for session persistence
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[AuthStore] Auth state changed:', event);
      
      if (event === 'SIGNED_OUT') {
        set({ user: null, isAuthenticated: false, loading: false });
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        // Session restored or refreshed
        if (session?.user) {
          console.log('[AuthStore] Session restored/refreshed, fetching profile...');
          try {
            const { data: profile, error } = await supabase
              .from('users')
              .select('*')
              .eq('auth_id', session.user.id)
              .single();
            
            if (!error && profile) {
              set({
                user: {
                  id: profile.id,
                  authId: profile.auth_id,
                  email: profile.email,
                  firstName: profile.first_name,
                  lastName: profile.last_name,
                  role: profile.role,
                  profilePictureUrl: profile.profile_picture_url,
                  isDeveloper: profile.is_developer || false,
                },
                isAuthenticated: true,
                loading: false,
                error: null
              });
            }
          } catch (error) {
            console.error('[AuthStore] Error fetching profile on state change:', error);
          }
        }
      } else if (event === 'USER_UPDATED' && session?.user) {
        // Handle user updates
        console.log('[AuthStore] User updated');
        const currentUser = get().user;
        if (currentUser) {
          // Fetch updated profile
          const { data: newProfile } = await supabase
            .from('users')
            .select('*')
            .eq('auth_id', session.user.id)
            .single();
          
          if (newProfile) {
            set({
              user: {
                ...currentUser,
                email: newProfile.email,
                firstName: newProfile.first_name,
                lastName: newProfile.last_name,
                profilePictureUrl: newProfile.profile_picture_url,
                isDeveloper: newProfile.is_developer || false,
              }
            });
          }
        }
      }
    });
    
    // Store subscription for cleanup if needed
    (window as any).__authSubscription = subscription;
    
    // Set a timeout for the initialization
    const timeoutId = setTimeout(() => {
      console.warn('[AuthStore] Initialization timeout - forcing completion');
      set({ 
        loading: false, 
        error: 'Authentication timeout. Please refresh the page.' 
      });
    }, 5000); // 5 second timeout
    
    try {
      // Call getUser() first to suppress the warning and verify authentication
      const { data: { user: authUser }, error: userError } = await supabase.auth.getUser();

      if (userError || !authUser) {
        console.log('[AuthStore] No authenticated user:', userError?.message);
        set({
          user: null,
          isAuthenticated: false,
          loading: false,
          error: null
        });
        clearTimeout(timeoutId);
        return;
      }

      // Now we can safely call getSession() without warning
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session) {
        console.log('[AuthStore] No session found');
        set({
          user: null,
          isAuthenticated: false,
          loading: false,
          error: null
        });
        clearTimeout(timeoutId);
        return;
      }

      console.log('[AuthStore] User authenticated, fetching profile...');
      
      // Session exists, fetch the user profile
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', session.user.id)
        .single();
      
      clearTimeout(timeoutId);
      
      if (profileError || !profile) {
        console.error('[AuthStore] Profile fetch error:', profileError);
        // Session exists but profile doesn't - could be first-time user
        set({ 
          user: null, 
          isAuthenticated: false, 
          loading: false,
          error: 'User profile not found. Please contact support.' 
        });
        return;
      }
      
      // Success - set user data
      set({
        user: {
          id: profile.id,
          authId: profile.auth_id,
          email: profile.email,
          firstName: profile.first_name,
          lastName: profile.last_name,
          role: profile.role,
          profilePictureUrl: profile.profile_picture_url,
          isDeveloper: profile.is_developer || false,
        },
        isAuthenticated: true,
        loading: false,
        error: null
      });
      
    } catch (error: any) {
      console.error('[AuthStore] Auth initialization error:', error);
      set({
        user: null,
        isAuthenticated: false,
        loading: false,
        error: error.message || 'Authentication failed'
      });
      clearTimeout(timeoutId);
    }
  },
}));
