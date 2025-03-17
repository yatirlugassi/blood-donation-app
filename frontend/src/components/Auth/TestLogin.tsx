import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';

const TestLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Check connection on component mount
  useEffect(() => {
    // Log that we're initializing
    console.log('TestLogin: Component mounted, ready to test Supabase connection');
  }, []);

  const checkConnection = async () => {
    setStatus('Checking connection...');
    setLoading(true);
    
    // Set a timeout to prevent hanging
    const timeoutId = setTimeout(() => {
      if (loading) {
        setStatus('Connection timeout. The request took too long to complete.');
        setLoading(false);
      }
    }, 5000);
    
    try {
      console.log('TestLogin: Testing connection to Supabase...');
      
      // Use a simpler query with a short timeout
      const { data, error } = await supabase
        .from('blood_types')
        .select('count')
        .limit(1)
        .maybeSingle();
      
      // Clear the timeout since we got a response
      clearTimeout(timeoutId);
      
      if (error) {
        console.error('TestLogin: Connection error:', error);
        setStatus(`Connection error: ${error.message}`);
      } else {
        console.log('TestLogin: Connection successful:', data);
        setStatus(`Connection successful! Response: ${JSON.stringify(data)}`);
      }
    } catch (err: any) {
      // Clear the timeout since we got a response
      clearTimeout(timeoutId);
      
      console.error('TestLogin: Exception during connection test:', err);
      setStatus(`Exception: ${err.message}`);
    } finally {
      if (loading) {
        setLoading(false);
      }
    }
  };

  const checkSession = async () => {
    setStatus('Checking session...');
    setLoading(true);
    
    try {
      console.log('TestLogin: Checking for existing session...');
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('TestLogin: Session error:', error);
        setStatus(`Session error: ${error.message}`);
      } else if (data.session) {
        console.log('TestLogin: Session found:', data.session.user.email);
        setStatus(`Session found: ${data.session.user.email}`);
        setUser(data.session.user);
      } else {
        console.log('TestLogin: No active session found');
        setStatus('No active session');
      }
    } catch (err: any) {
      console.error('TestLogin: Exception during session check:', err);
      setStatus(`Exception: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Logging in...');
    setLoading(true);
    
    try {
      console.log('TestLogin: Attempting to sign in user:', email);
      
      // First check connection
      const connectionTest = await supabase.from('blood_types').select('count');
      if (connectionTest.error) {
        console.error('TestLogin: Connection test failed before login:', connectionTest.error);
        setStatus(`Database connection error: ${connectionTest.error.message}`);
        setLoading(false);
        return;
      }
      
      console.log('TestLogin: Connection test passed, proceeding with login');
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('TestLogin: Login error:', error);
        setStatus(`Login error: ${error.message}`);
      } else {
        console.log('TestLogin: Login successful:', data.user?.email);
        setStatus(`Login successful! User: ${data.user?.email}`);
        setUser(data.user);
      }
    } catch (err: any) {
      console.error('TestLogin: Exception during login:', err);
      setStatus(`Exception: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setStatus('Logging out...');
    setLoading(true);
    
    try {
      console.log('TestLogin: Signing out user');
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('TestLogin: Logout error:', error);
        setStatus(`Logout error: ${error.message}`);
      } else {
        console.log('TestLogin: Logout successful');
        setStatus('Logged out successfully');
        setUser(null);
      }
    } catch (err: any) {
      console.error('TestLogin: Exception during logout:', err);
      setStatus(`Exception: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      <h1>Supabase Auth Test</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={checkConnection} 
          disabled={loading}
          style={{ marginRight: '10px', padding: '8px 16px' }}
        >
          Test Connection
        </button>
        
        <button 
          onClick={checkSession} 
          disabled={loading}
          style={{ padding: '8px 16px' }}
        >
          Check Session
        </button>
      </div>
      
      {user ? (
        <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
          <h3>Logged in as: {user.email}</h3>
          <p>User ID: {user.id}</p>
          <button 
            onClick={handleLogout} 
            disabled={loading}
            style={{ padding: '8px 16px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            Logout
          </button>
        </div>
      ) : (
        <form onSubmit={handleLogin} style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            style={{ padding: '8px 16px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            {loading ? 'Processing...' : 'Login'}
          </button>
        </form>
      )}
      
      <div style={{ 
        marginTop: '20px', 
        padding: '15px', 
        backgroundColor: '#f5f5f5', 
        borderRadius: '5px',
        minHeight: '100px'
      }}>
        <h3>Status:</h3>
        <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{status}</pre>
      </div>
    </div>
  );
};

export default TestLogin; 