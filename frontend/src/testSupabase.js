// Test script to verify Supabase connection
const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://tbdoaiawpykipqwcgpuc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRiZG9haWF3cHlraXBxd2NncHVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIwNDk5OTksImV4cCI6MjA1NzYyNTk5OX0.dNZQCyfLFlX50wOfut7RjTEQjLx0LOG41ytRUgvADPI';

console.log('Initializing Supabase client with:');
console.log('URL:', supabaseUrl);
console.log('Key exists:', !!supabaseAnonKey);

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test connection
async function testConnection() {
  try {
    console.log('Testing Supabase connection...');
    
    // Test 1: Get blood types
    console.log('Test 1: Fetching blood types...');
    const { data: bloodTypes, error: bloodTypesError } = await supabase
      .from('blood_types')
      .select('*')
      .limit(1);
    
    if (bloodTypesError) {
      console.error('Test 1 failed:', bloodTypesError);
    } else {
      console.log('Test 1 successful:', bloodTypes);
    }
    
    // Test 2: Get blood compatibility
    console.log('Test 2: Fetching blood compatibility...');
    const { data: compatibility, error: compatibilityError } = await supabase
      .from('blood_compatibility')
      .select('*')
      .limit(1);
    
    if (compatibilityError) {
      console.error('Test 2 failed:', compatibilityError);
    } else {
      console.log('Test 2 successful:', compatibility);
    }
    
    // Test 3: Auth status
    console.log('Test 3: Checking auth status...');
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.error('Test 3 failed:', authError);
    } else {
      console.log('Test 3 successful:', authData.session ? 'Session exists' : 'No session');
    }
    
    console.log('All tests completed.');
  } catch (err) {
    console.error('Exception during tests:', err);
  }
}

// Run the tests
testConnection(); 