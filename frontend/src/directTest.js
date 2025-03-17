// Direct test script for Supabase connection
// Run with: node directTest.js

const { createClient } = require('@supabase/supabase-js');

// Hardcoded values for testing
const supabaseUrl = 'https://tbdoaiawpykipqwcgpuc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRiZG9haWF3cHlraXBxd2NncHVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIwNDk5OTksImV4cCI6MjA1NzYyNTk5OX0.dNZQCyfLFlX50wOfut7RjTEQjLx0LOG41ytRUgvADPI';

console.log('Starting direct Supabase connection test...');
console.log('URL:', supabaseUrl);
console.log('Key exists:', !!supabaseAnonKey);

// Create a fresh Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test function with timeout
async function testWithTimeout(testFn, timeoutMs = 5000) {
  return new Promise((resolve) => {
    // Set timeout
    const timeoutId = setTimeout(() => {
      resolve({
        success: false,
        error: `Test timed out after ${timeoutMs}ms`,
        data: null
      });
    }, timeoutMs);
    
    // Run the test
    testFn()
      .then(result => {
        clearTimeout(timeoutId);
        resolve({
          success: !result.error,
          error: result.error ? result.error.message : null,
          data: result.data
        });
      })
      .catch(err => {
        clearTimeout(timeoutId);
        resolve({
          success: false,
          error: err.message,
          data: null
        });
      });
  });
}

// Run tests
async function runTests() {
  try {
    // Test 1: Basic connection
    console.log('\nTest 1: Basic connection test');
    const test1 = await testWithTimeout(
      () => supabase.from('blood_types').select('count')
    );
    
    console.log('Success:', test1.success);
    if (test1.error) {
      console.log('Error:', test1.error);
    } else {
      console.log('Data:', test1.data);
    }
    
    // Test 2: Auth API
    console.log('\nTest 2: Auth API test');
    const test2 = await testWithTimeout(
      () => supabase.auth.getSession()
    );
    
    console.log('Success:', test2.success);
    if (test2.error) {
      console.log('Error:', test2.error);
    } else {
      console.log('Session exists:', !!test2.data?.session);
    }
    
    // Test 3: Fetch specific data
    console.log('\nTest 3: Fetch specific data');
    const test3 = await testWithTimeout(
      () => supabase.from('blood_types').select('*').limit(1)
    );
    
    console.log('Success:', test3.success);
    if (test3.error) {
      console.log('Error:', test3.error);
    } else {
      console.log('Data:', JSON.stringify(test3.data));
    }
    
    console.log('\nAll tests completed.');
    
    // Summary
    console.log('\nTest Summary:');
    console.log('Test 1 (Basic connection):', test1.success ? 'PASSED' : 'FAILED');
    console.log('Test 2 (Auth API):', test2.success ? 'PASSED' : 'FAILED');
    console.log('Test 3 (Fetch data):', test3.success ? 'PASSED' : 'FAILED');
    
  } catch (err) {
    console.error('Unexpected error during tests:', err);
  }
}

// Run all tests
runTests(); 