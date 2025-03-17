import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, UserProfile, getUserProfile, createUserProfile } from '../services/supabaseClient';

// Define the shape of our auth context
interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any | null }>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: any }>;
  refreshSession: () => Promise<void>;
}

// Create the context with a default undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Props for the AuthProvider component
interface AuthProviderProps {
  children: ReactNode;
}

// AuthProvider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Add a ref to track the last refresh time
  const lastRefreshTime = useRef<number>(0);
  // Add a ref to track if a refresh is in progress
  const isRefreshing = useRef<boolean>(false);

  // Function to fetch user profile with caching
  const fetchUserProfile = useCallback(async (userId: string) => {
    try {
      // Only log in development
      if (process.env.NODE_ENV === 'development') {
        console.log('AuthProvider: Fetching user profile for:', userId);
      }
      
      const { data: profileData, error: profileError } = await getUserProfile(userId);
      
      if (profileError || !profileData) {
        console.log('AuthProvider: Profile not found or error, creating new profile...');
        // Create new profile if it doesn't exist or there was an error
        const { data: newProfile, error: createError } = await createUserProfile({
          id: userId,
          blood_type: null,
          region: null,
          donation_count: 0,
          last_donation_date: null,
        });
        
        if (createError) {
          console.error('AuthProvider: Error creating user profile:', createError);
        } else {
          console.log('AuthProvider: New profile created successfully');
          setProfile(newProfile);
        }
      } else {
        setProfile(profileData);
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
    }
  }, []);

  // Function to refresh the session with debouncing
  const refreshSession = useCallback(async () => {
    // Prevent multiple refreshes within a short time period (1 second)
    const now = Date.now();
    if (now - lastRefreshTime.current < 1000 || isRefreshing.current) {
      return;
    }
    
    try {
      isRefreshing.current = true;
      lastRefreshTime.current = now;
      
      // Only log in development
      if (process.env.NODE_ENV === 'development') {
        console.log('AuthProvider: Refreshing session...');
      }
      
      setLoading(true);
      
      // Get the current session
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('AuthProvider: Error refreshing session:', error);
        throw error;
      }

      if (process.env.NODE_ENV === 'development') {
        console.log('AuthProvider: Session refresh result:', data?.session ? 'Session exists' : 'No session');
      }
      
      setSession(data.session);
      setUser(data.session?.user || null);

      // Fetch user profile if user exists and profile doesn't match
      if (data.session?.user && (!profile || profile.id !== data.session.user.id)) {
        await fetchUserProfile(data.session.user.id);
      } else if (!data.session?.user) {
        setProfile(null);
      }
    } catch (err) {
      console.error('Error refreshing session:', err);
    } finally {
      setLoading(false);
      isRefreshing.current = false;
    }
  }, [fetchUserProfile, profile]);

  // Initialize the auth state
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('AuthProvider: Initializing auth state...');
    }
    
    // Set up a listener for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (process.env.NODE_ENV === 'development') {
        console.log('AuthProvider: Auth state changed:', event);
      }
      
      setSession(newSession);
      setUser(newSession?.user || null);
      
      if (event === 'SIGNED_IN' && newSession?.user) {
        console.log('AuthProvider: User signed in, fetching profile...');
        await fetchUserProfile(newSession.user.id);
      } else if (event === 'SIGNED_OUT') {
        console.log('AuthProvider: User signed out');
        setProfile(null);
      } else if (event === 'TOKEN_REFRESHED' && newSession?.user) {
        if (process.env.NODE_ENV === 'development') {
          console.log('AuthProvider: Token refreshed, updating session');
        }
        // No need to fetch profile again as it should already be in state
      }
    });

    // Initial session check
    refreshSession();

    // Set up visibility change listener to refresh session when tab becomes visible again
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        if (process.env.NODE_ENV === 'development') {
          console.log('AuthProvider: Tab became visible, refreshing session');
        }
        refreshSession();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Clean up subscriptions on unmount
    return () => {
      if (process.env.NODE_ENV === 'development') {
        console.log('AuthProvider: Cleaning up auth listener and visibility listener');
      }
      authListener?.subscription.unsubscribe();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [refreshSession, fetchUserProfile]);

  // Sign up with email and password
  const signUp = async (email: string, password: string) => {
    try {
      console.log('AuthProvider: Signing up user:', email);
      setLoading(true);
      
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          // This will skip email verification
          data: {
            email_confirmed: true
          }
        }
      });
      
      if (error) {
        console.error('AuthProvider: Sign up error:', error);
      } else {
        console.log('AuthProvider: Sign up successful, user created:', data?.user?.id);
        
        // Auto sign in after signup
        console.log('AuthProvider: Auto signing in after signup...');
        await supabase.auth.signInWithPassword({ email, password });
      }
      
      return { error };
    } catch (error: any) {
      console.error('AuthProvider: Exception during sign up:', error.message);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      console.log('AuthProvider: Signing in user:', email);
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        console.error('AuthProvider: Sign in error:', error);
      } else {
        console.log('AuthProvider: Sign in successful, user:', data?.user?.id);
        
        // Explicitly set the session and user
        setSession(data.session);
        setUser(data.user);
        
        // Fetch user profile
        if (data.user) {
          await fetchUserProfile(data.user.id);
        }
      }
      
      return { error };
    } catch (error: any) {
      console.error('AuthProvider: Exception during sign in:', error.message);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      console.log('AuthProvider: Signing out user...');
      setLoading(true);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('AuthProvider: Error signing out:', error);
        throw error;
      }
      
      console.log('AuthProvider: Sign out successful, clearing user state');
      // Clear all auth state
      setUser(null);
      setSession(null);
      setProfile(null);
      
      return { error: null };
    } catch (error: any) {
      console.error('AuthProvider: Exception during sign out:', error.message);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      return { error };
    } catch (error: any) {
      console.error('Error resetting password:', error.message);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      setLoading(true);
      if (!user) {
        return { error: new Error('No user logged in') };
      }

      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      setProfile(data);
      return { error: null };
    } catch (error: any) {
      console.error('Error updating profile:', error.message);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  // Provide the auth context value
  const value = {
    session,
    user,
    profile,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}; 