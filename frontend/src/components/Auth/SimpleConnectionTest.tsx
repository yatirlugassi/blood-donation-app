import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Hardcoded values directly in this component for testing
const supabaseUrl = 'https://tbdoaiawpykipqwcgpuc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRiZG9haWF3cHlraXBxd2NncHVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIwNDk5OTksImV4cCI6MjA1NzYyNTk5OX0.dNZQCyfLFlX50wOfut7RjTEQjLx0LOG41ytRUgvADPI';

const SimpleConnectionTest: React.FC = () => {
  const [status, setStatus] = useState<string>('Ready to test');
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setStatus('Testing connection...');
    setLoading(true);
    
    try {
      // Create a fresh Supabase client for this test only
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      
      // Set a timeout for the test
      const timeoutPromise = new Promise<{data: null, error: Error}>((_, reject) => {
        setTimeout(() => {
          reject(new Error('Connection test timed out after 5 seconds'));
        }, 5000);
      });
      
      // Create a promise for the actual query
      const queryPromise = supabase.from('blood_types').select('count');
      
      // Race the query against the timeout
      const result = await Promise.race([
        queryPromise,
        timeoutPromise
      ]);
      
      if ('error' in result && result.error) {
        setStatus(`Connection error: ${result.error.message}`);
      } else {
        setStatus(`Connection successful! Response: ${JSON.stringify(result.data)}`);
      }
    } catch (err: any) {
      setStatus(`Exception: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      <h1>Simple Supabase Connection Test</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={testConnection} 
          disabled={loading}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#4CAF50', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            fontSize: '16px'
          }}
        >
          {loading ? 'Testing...' : 'Test Connection'}
        </button>
      </div>
      
      <div style={{ 
        marginTop: '20px', 
        padding: '15px', 
        backgroundColor: '#f5f5f5', 
        borderRadius: '5px',
        minHeight: '100px',
        fontFamily: 'monospace'
      }}>
        <h3>Status:</h3>
        <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{status}</pre>
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <h3>Notes:</h3>
        <ul>
          <li>This test creates a fresh Supabase client each time</li>
          <li>The test has a 5-second timeout to prevent hanging</li>
          <li>No dependencies on other components or contexts</li>
          <li>Uses hardcoded credentials directly in this component</li>
        </ul>
      </div>
    </div>
  );
};

export default SimpleConnectionTest; 