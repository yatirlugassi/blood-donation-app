import { createClient, SupabaseClient, User } from '@supabase/supabase-js';

// Supabase configuration from environment variables
// const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
// const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

// Hardcoded values for testing - replace with your actual values from .env
const supabaseUrl = 'https://tbdoaiawpykipqwcgpuc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRiZG9haWF3cHlraXBxd2NncHVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIwNDk5OTksImV4cCI6MjA1NzYyNTk5OX0.dNZQCyfLFlX50wOfut7RjTEQjLx0LOG41ytRUgvADPI';

// Debug info
console.log('Initializing Supabase client with:');
console.log('URL:', supabaseUrl);
console.log('Key exists:', !!supabaseAnonKey);

// Create Supabase client with enhanced session persistence
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storageKey: 'blood-donation-auth-token', // Custom storage key for better identification
  },
  global: {
    headers: {
      'x-application-name': 'blood-donation-app', // Custom header for tracking
    },
    fetch: (url, options) => {
      // Set a custom timeout for fetch requests
      const timeout = 8000; // 8 seconds (reduced from 15)
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      // Add the abort signal to the options
      const fetchOptions = {
        ...options,
        signal: controller.signal
      };
      
      return new Promise((resolve, reject) => {
        fetch(url, fetchOptions)
          .then(response => {
            clearTimeout(timeoutId);
            resolve(response);
          })
          .catch(error => {
            clearTimeout(timeoutId);
            if (error.name === 'AbortError') {
              console.error('Supabase fetch request timed out after', timeout, 'ms');
              reject(new Error(`Request timed out after ${timeout}ms`));
            } else {
              reject(error);
            }
          });
      });
    }
  }
});

// Remove the automatic connection test to avoid unnecessary requests
// (async () => { ... })();

// Simple in-memory cache implementation
const cache: Record<string, { data: any; timestamp: number }> = {};
const CACHE_DURATION = 60000; // 1 minute cache duration

// Helper function to use cache
const withCache = async <T>(
  cacheKey: string,
  fetchFunction: () => Promise<{ data: T | null; error: any }>,
  cacheDuration = CACHE_DURATION
): Promise<{ data: T | null; error: any }> => {
  // Check if we have a valid cache entry
  const now = Date.now();
  const cachedItem = cache[cacheKey];
  
  if (cachedItem && (now - cachedItem.timestamp < cacheDuration)) {
    console.log(`Using cached data for ${cacheKey}`);
    return { data: cachedItem.data, error: null };
  }
  
  // No valid cache, fetch fresh data
  const result = await fetchFunction();
  
  // Cache the result if there's no error
  if (!result.error && result.data) {
    cache[cacheKey] = { data: result.data, timestamp: now };
  }
  
  return result;
};

// Types for our database
export interface BloodType {
  id: number;
  type: string;
  description: string;
}

export interface BloodCompatibility {
  id: number;
  donor_type: string;
  recipient_type: string;
  compatible: boolean;
}

export interface RegionalData {
  id: number;
  region: string;
  population: number;
  a_positive: number;
  a_negative: number;
  b_positive: number;
  b_negative: number;
  ab_positive: number;
  ab_negative: number;
  o_positive: number;
  o_negative: number;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  blood_type: string | null;
  region: string | null;
  donation_count: number;
  last_donation_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: Record<string, string>;
  correct_answer: string;
  explanation: string;
  category: string;
  difficulty: string;
}

export interface QuizResult {
  id: number;
  user_id: string;
  score: number;
  max_score: number;
  completed_at: string;
}

// Blood types functions
export const getBloodTypes = async (): Promise<{ data: BloodType[] | null; error: any }> => {
  return withCache('blood_types', async () => {
    const { data, error } = await supabase
      .from('blood_types')
      .select('*')
      .order('id');
    
    if (error) {
      console.error('Supabase error in getBloodTypes:', error);
    }
    
    return { data, error };
  });
};

// Blood compatibility functions
export const getBloodCompatibility = async (): Promise<{ data: BloodCompatibility[] | null; error: any }> => {
  return withCache('blood_compatibility', async () => {
    const { data, error } = await supabase
      .from('blood_compatibility')
      .select('*');
    
    if (error) {
      console.error('Supabase error in getBloodCompatibility:', error);
    }
    
    return { data, error };
  });
};

export const getCompatibleDonors = async (bloodType: string): Promise<{ data: string[] | null; error: any }> => {
  return withCache(`compatible_donors_${bloodType}`, async () => {
    const { data, error } = await supabase
      .from('blood_compatibility')
      .select('donor_type')
      .eq('recipient_type', bloodType)
      .eq('compatible', true);
    
    return { 
      data: data ? data.map(item => item.donor_type) : null, 
      error 
    };
  });
};

export const getCompatibleRecipients = async (bloodType: string): Promise<{ data: string[] | null; error: any }> => {
  return withCache(`compatible_recipients_${bloodType}`, async () => {
    const { data, error } = await supabase
      .from('blood_compatibility')
      .select('recipient_type')
      .eq('donor_type', bloodType)
      .eq('compatible', true);
    
    return { 
      data: data ? data.map(item => item.recipient_type) : null, 
      error 
    };
  });
};

// Regional data functions
export const getRegionalData = async (region?: string): Promise<{ data: RegionalData[] | null; error: any }> => {
  return withCache(`regional_data_${region || 'all'}`, async () => {
    let query = supabase.from('regional_blood_data').select('*');
    
    if (region) {
      query = query.ilike('region', `%${region}%`);
    }
    
    const { data, error } = await query;
    return { data, error };
  });
};

// User profile functions
export const getUserProfile = async (userId: string): Promise<{ data: UserProfile | null; error: any }> => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  return { data, error };
};

export const createUserProfile = async (profile: Partial<UserProfile>): Promise<{ data: UserProfile | null; error: any }> => {
  const { data, error } = await supabase
    .from('user_profiles')
    .insert(profile)
    .select()
    .single();
  
  return { data, error };
};

export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>): Promise<{ data: UserProfile | null; error: any }> => {
  const { data, error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  
  return { data, error };
};

// Quiz functions
export const getQuizQuestions = async (limit = 10, category?: string): Promise<{ data: QuizQuestion[] | null; error: any }> => {
  let query = supabase.from('quiz_questions').select('*');
  
  if (category) {
    query = query.eq('category', category);
  }
  
  const { data, error } = await query.limit(limit);
  return { data, error };
};

export const saveQuizResult = async (result: Omit<QuizResult, 'id' | 'completed_at'>): Promise<{ data: QuizResult | null; error: any }> => {
  const { data, error } = await supabase
    .from('quiz_results')
    .insert(result)
    .select()
    .single();
  
  return { data, error };
};

export const getUserQuizResults = async (userId: string): Promise<{ data: QuizResult[] | null; error: any }> => {
  const { data, error } = await supabase
    .from('quiz_results')
    .select('*')
    .eq('user_id', userId)
    .order('completed_at', { ascending: false });
  
  return { data, error };
}; 