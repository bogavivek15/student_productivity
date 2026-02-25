/* ═══════════════════════════════════════════════════════════════
   useAuth — Supabase session management hook
   Tracks auth state, exposes signUp / signIn / signOut
   ═══════════════════════════════════════════════════════════════ */
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Session, User } from '@supabase/supabase-js';

interface AuthState {
  session: Session | null;
  user: User | null;
  loading: boolean;
  error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    session: null,
    user: null,
    loading: true,
    error: null,
  });

  /* ── Listen for auth state changes ── */
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setState((s) => ({
        ...s,
        session,
        user: session?.user ?? null,
        loading: false,
      }));
    });

    // Subscribe to future changes (login, logout, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setState((s) => ({
        ...s,
        session,
        user: session?.user ?? null,
        loading: false,
        error: null,
      }));
    });

    return () => subscription.unsubscribe();
  }, []);

  /* ── Sign up with email + password ── */
  const signUp = useCallback(
    async (email: string, password: string, name: string) => {
      setState((s) => ({ ...s, error: null, loading: true }));
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name }, // stored in raw_user_meta_data → used by profile trigger
        },
      });
      if (error) {
        setState((s) => ({ ...s, error: error.message, loading: false }));
        return false;
      }
      setState((s) => ({ ...s, loading: false }));
      return true;
    },
    [],
  );

  /* ── Sign in with email + password ── */
  const signIn = useCallback(async (email: string, password: string) => {
    setState((s) => ({ ...s, error: null, loading: true }));
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setState((s) => ({ ...s, error: error.message, loading: false }));
      return false;
    }
    setState((s) => ({ ...s, loading: false }));
    return true;
  }, []);

  /* ── Sign out ── */
  const signOut = useCallback(async () => {
    setState((s) => ({ ...s, loading: true }));
    await supabase.auth.signOut();
    setState({ session: null, user: null, loading: false, error: null });
  }, []);

  /* ── Clear error ── */
  const clearError = useCallback(() => {
    setState((s) => ({ ...s, error: null }));
  }, []);

  return {
    session: state.session,
    user: state.user,
    loading: state.loading,
    error: state.error,
    signUp,
    signIn,
    signOut,
    clearError,
  };
}
