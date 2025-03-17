import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';

// Import the hardcoded URL from supabaseClient.ts
const supabaseUrl = 'https://tbdoaiawpykipqwcgpuc.supabase.co';

const DiagnosticPage: React.FC = () => {
  const [diagnosticResults, setDiagnosticResults] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addResult = (message: string) => {
    setDiagnosticResults(prev => [...prev, `${new Date().toISOString()} - ${message}`]);
  };

  const runDiagnostics = async () => {
    setIsRunning(true);
    setDiagnosticResults([]);
    
    addResult('Starting diagnostics...');
    
    // 1. Check network connectivity
    addResult('Checking network connectivity...');
    try {
      const networkResponse = await fetch('https://www.google.com', { 
        mode: 'no-cors',
        cache: 'no-cache'
      });
      addResult('Network connectivity: OK');
    } catch (error: any) {
      addResult(`Network connectivity error: ${error.message}`);
    }
    
    // 2. Check Supabase URL
    addResult(`Supabase URL check: ${supabaseUrl}`);
    
    // 3. Test basic Supabase connection
    addResult('Testing basic Supabase connection...');
    try {
      const startTime = Date.now();
      const { data, error } = await supabase.from('blood_types').select('count');
      const endTime = Date.now();
      
      if (error) {
        addResult(`Basic connection error: ${error.message}`);
      } else {
        addResult(`Basic connection successful (${endTime - startTime}ms)`);
        addResult(`Response data: ${JSON.stringify(data)}`);
      }
    } catch (error: any) {
      addResult(`Basic connection exception: ${error.message}`);
    }
    
    // 4. Test authentication API
    addResult('Testing Supabase auth API...');
    try {
      const startTime = Date.now();
      const { data, error } = await supabase.auth.getSession();
      const endTime = Date.now();
      
      if (error) {
        addResult(`Auth API error: ${error.message}`);
      } else {
        addResult(`Auth API successful (${endTime - startTime}ms)`);
        addResult(`Session exists: ${data.session !== null}`);
      }
    } catch (error: any) {
      addResult(`Auth API exception: ${error.message}`);
    }
    
    // 5. Test with timeout
    addResult('Testing connection with timeout...');
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const startTime = Date.now();
      const response = await fetch(supabaseUrl, {
        signal: controller.signal,
        method: 'HEAD'
      });
      clearTimeout(timeoutId);
      const endTime = Date.now();
      
      addResult(`Direct fetch successful (${endTime - startTime}ms), status: ${response.status}`);
    } catch (error: any) {
      addResult(`Direct fetch error: ${error.message}`);
    }
    
    // 6. Check browser storage
    addResult('Checking browser storage...');
    try {
      // Test localStorage
      localStorage.setItem('supabase_test', 'test_value');
      const testValue = localStorage.getItem('supabase_test');
      localStorage.removeItem('supabase_test');
      
      if (testValue === 'test_value') {
        addResult('localStorage: OK');
      } else {
        addResult('localStorage: Failed - could not store and retrieve test value');
      }
    } catch (error: any) {
      addResult(`localStorage error: ${error.message}`);
    }
    
    addResult('Diagnostics completed.');
    setIsRunning(false);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>Supabase Connection Diagnostics</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={runDiagnostics} 
          disabled={isRunning}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#4CAF50', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            fontSize: '16px'
          }}
        >
          {isRunning ? 'Running Diagnostics...' : 'Run Diagnostics'}
        </button>
      </div>
      
      <div style={{ 
        marginTop: '20px', 
        padding: '15px', 
        backgroundColor: '#f5f5f5', 
        borderRadius: '5px',
        minHeight: '300px',
        maxHeight: '500px',
        overflowY: 'auto',
        fontFamily: 'monospace'
      }}>
        <h3>Diagnostic Results:</h3>
        {diagnosticResults.length === 0 ? (
          <p>Click "Run Diagnostics" to start the tests.</p>
        ) : (
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {diagnosticResults.join('\n')}
          </pre>
        )}
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <h3>Troubleshooting Tips:</h3>
        <ul>
          <li>If network connectivity fails, check your internet connection.</li>
          <li>If basic connection fails but network is OK, verify your Supabase URL and API key.</li>
          <li>If auth API fails, there might be an issue with the Supabase auth service.</li>
          <li>If localStorage fails, your browser might be blocking storage access.</li>
          <li>Timeouts indicate slow network or Supabase service issues.</li>
        </ul>
      </div>
    </div>
  );
};

export default DiagnosticPage; 