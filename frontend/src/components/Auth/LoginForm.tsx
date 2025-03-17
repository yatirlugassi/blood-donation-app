import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../services/supabaseClient';
import toast from 'react-hot-toast';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, user, refreshSession } = useAuth();
  const navigate = useNavigate();

  // Check if user is already logged in - only once on mount
  useEffect(() => {
    const checkSession = async () => {
      if (process.env.NODE_ENV === 'development') {
        console.log('LoginForm: Checking for existing session...');
      }
      
      try {
        // Use refreshSession from AuthContext
        await refreshSession();
      } catch (error) {
        console.error('LoginForm: Error checking session:', error);
      }
    };
    
    checkSession();
    // Don't include refreshSession in dependencies to avoid unnecessary calls
  }, []);

  // Redirect if user becomes logged in
  useEffect(() => {
    if (user) {
      if (process.env.NODE_ENV === 'development') {
        console.log('LoginForm: User detected, redirecting to dashboard');
      }
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Memoize the submit handler to prevent recreating on each render
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setErrorMessage('Please enter both email and password');
      return;
    }
    
    try {
      if (process.env.NODE_ENV === 'development') {
        console.log('LoginForm: Attempting to sign in user:', email);
      }
      setIsLoading(true);
      setErrorMessage('');
      
      // Test Supabase connection before attempting login
      console.log('LoginForm: Testing Supabase connection...');
      const testConnection = await supabase.from('blood_types').select('count');
      if (testConnection.error) {
        console.error('LoginForm: Supabase connection test failed:', testConnection.error);
        setErrorMessage('Database connection error. Please try again later.');
        return;
      }
      
      console.log('LoginForm: Supabase connection successful, proceeding with login');
      const { error } = await signIn(email, password);
      
      if (error) {
        console.error('LoginForm: Sign in error:', error);
        setErrorMessage(error.message || 'Failed to sign in');
        return;
      }
      
      if (process.env.NODE_ENV === 'development') {
        console.log('LoginForm: Sign in successful');
      }
      toast.success('Login successful!');
      
      // Navigate to dashboard - the user effect will handle this
    } catch (err: any) {
      console.error('LoginForm: Exception during sign in:', err);
      setErrorMessage(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [email, password, signIn]);

  return (
    <div className="auth-form-container">
      <h2>Log In</h2>
      
      {errorMessage && (
        <div className="error-message">
          {errorMessage}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            placeholder="Enter your email"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            placeholder="Enter your password"
          />
        </div>
        
        <button type="submit" className="auth-button" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Log In'}
        </button>
      </form>
      
      <div className="auth-links">
        <Link to="/forgot-password">Forgot password?</Link>
        <p>
          Don't have an account? <Link to="/register">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm; 