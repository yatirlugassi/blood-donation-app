const React = require('react');
const { createContext, useContext, useState, useEffect } = React;
const { supabase } = require('../services/supabaseClient');

// Create the auth context
const AuthContext = createContext();

// Custom hook to use the auth context
function useAuth() {
  return useContext(AuthContext);
}

// Auth provider component
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check for active session on initial load
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        setSession(session);
        setUser(session?.user || null);
      } catch (err) {
        console.error('Error checking session:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user || null);
        setLoading(false);
      }
    );

    // Clean up subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sign up with email and password
  const signUp = async (email, password, metadata = {}) => {
    try {
      setError(null);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      });
      
      if (error) throw error;
      
      return data;
    } catch (err) {
      console.error('Error signing up:', err);
      setError(err.message);
      throw err;
    }
  };

  // Sign in with email and password
  const signIn = async (email, password) => {
    try {
      setError(null);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      return data;
    } catch (err) {
      console.error('Error signing in:', err);
      setError(err.message);
      throw err;
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      setError(null);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
    } catch (err) {
      console.error('Error signing out:', err);
      setError(err.message);
      throw err;
    }
  };

  // Reset password
  const resetPassword = async (email) => {
    try {
      setError(null);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      
      if (error) throw error;
      
      return true;
    } catch (err) {
      console.error('Error resetting password:', err);
      setError(err.message);
      throw err;
    }
  };

  // Update password
  const updatePassword = async (newPassword) => {
    try {
      setError(null);
      
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
      
      return true;
    } catch (err) {
      console.error('Error updating password:', err);
      setError(err.message);
      throw err;
    }
  };

  // Update user metadata
  const updateUserMetadata = async (metadata) => {
    try {
      setError(null);
      
      const { data, error } = await supabase.auth.updateUser({
        data: metadata
      });
      
      if (error) throw error;
      
      return data;
    } catch (err) {
      console.error('Error updating user metadata:', err);
      setError(err.message);
      throw err;
    }
  };

  // Context value
  const value = {
    user,
    session,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    updateUserMetadata,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

module.exports = {
  AuthContext,
  AuthProvider,
  useAuth
}; 