import { create } from 'zustand';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { User } from '../types';

interface AuthState {
  user: User | null;
  session: any | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  
  // Actions
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  checkSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  isLoading: false,
  isAuthenticated: false,

  signIn: async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      return { error: 'Supabase not configured. Add environment variables.' };
    }

    set({ isLoading: true });
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        set({ isLoading: false });
        return { error: error.message };
      }

      // Fetch user profile
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();

      set({
        session: data.session,
        user: userData,
        isAuthenticated: true,
        isLoading: false,
      });

      return {};
    } catch (e) {
      set({ isLoading: false });
      return { error: 'Failed to sign in' };
    }
  },

  signOut: async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    set({
      user: null,
      session: null,
      isAuthenticated: false,
    });
  },

  checkSession: async () => {
    if (!isSupabaseConfigured) {
      set({ isLoading: false });
      return;
    }

    set({ isLoading: true });
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        set({
          session,
          user: userData,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (e) {
      set({ isLoading: false });
    }
  },
}));
