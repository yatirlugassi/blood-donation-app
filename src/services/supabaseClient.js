const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://your-supabase-url.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-supabase-anon-key';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper functions for common Supabase operations

// Authentication helpers
const auth = {
  // Get current user
  getCurrentUser: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },
  
  // Get current session
  getSession: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  },
  
  // Sign up with email and password
  signUp: async (email, password, metadata = {}) => {
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    });
  },
  
  // Sign in with email and password
  signIn: async (email, password) => {
    return await supabase.auth.signInWithPassword({
      email,
      password
    });
  },
  
  // Sign out
  signOut: async () => {
    return await supabase.auth.signOut();
  }
};

// Database helpers
const db = {
  // Generic fetch function with error handling
  fetch: async (table, query = {}) => {
    try {
      let queryBuilder = supabase.from(table).select(query.select || '*');
      
      // Apply filters if provided
      if (query.filters) {
        query.filters.forEach(filter => {
          if (filter.type === 'eq') {
            queryBuilder = queryBuilder.eq(filter.column, filter.value);
          } else if (filter.type === 'neq') {
            queryBuilder = queryBuilder.neq(filter.column, filter.value);
          } else if (filter.type === 'gt') {
            queryBuilder = queryBuilder.gt(filter.column, filter.value);
          } else if (filter.type === 'lt') {
            queryBuilder = queryBuilder.lt(filter.column, filter.value);
          } else if (filter.type === 'gte') {
            queryBuilder = queryBuilder.gte(filter.column, filter.value);
          } else if (filter.type === 'lte') {
            queryBuilder = queryBuilder.lte(filter.column, filter.value);
          } else if (filter.type === 'like') {
            queryBuilder = queryBuilder.like(filter.column, filter.value);
          } else if (filter.type === 'ilike') {
            queryBuilder = queryBuilder.ilike(filter.column, filter.value);
          } else if (filter.type === 'in') {
            queryBuilder = queryBuilder.in(filter.column, filter.value);
          }
        });
      }
      
      // Apply order if provided
      if (query.order) {
        queryBuilder = queryBuilder.order(query.order.column, {
          ascending: query.order.ascending
        });
      }
      
      // Apply pagination if provided
      if (query.pagination) {
        if (query.pagination.limit) {
          queryBuilder = queryBuilder.limit(query.pagination.limit);
        }
        if (query.pagination.offset) {
          queryBuilder = queryBuilder.range(
            query.pagination.offset,
            query.pagination.offset + (query.pagination.limit || 10) - 1
          );
        }
      }
      
      const { data, error } = await queryBuilder;
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error(`Error fetching from ${table}:`, error);
      return { data: null, error };
    }
  },
  
  // Insert data
  insert: async (table, data) => {
    try {
      const { data: result, error } = await supabase
        .from(table)
        .insert(data)
        .select();
      
      if (error) throw error;
      
      return { data: result, error: null };
    } catch (error) {
      console.error(`Error inserting into ${table}:`, error);
      return { data: null, error };
    }
  },
  
  // Update data
  update: async (table, data, match) => {
    try {
      let query = supabase.from(table).update(data);
      
      // Apply match conditions
      Object.entries(match).forEach(([column, value]) => {
        query = query.eq(column, value);
      });
      
      const { data: result, error } = await query.select();
      
      if (error) throw error;
      
      return { data: result, error: null };
    } catch (error) {
      console.error(`Error updating ${table}:`, error);
      return { data: null, error };
    }
  },
  
  // Delete data
  delete: async (table, match) => {
    try {
      let query = supabase.from(table).delete();
      
      // Apply match conditions
      Object.entries(match).forEach(([column, value]) => {
        query = query.eq(column, value);
      });
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error(`Error deleting from ${table}:`, error);
      return { data: null, error };
    }
  }
};

// Storage helpers
const storage = {
  // Upload file
  uploadFile: async (bucket, path, file) => {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error(`Error uploading file to ${bucket}/${path}:`, error);
      return { data: null, error };
    }
  },
  
  // Get public URL for file
  getPublicUrl: (bucket, path) => {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  },
  
  // Delete file
  deleteFile: async (bucket, path) => {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .remove([path]);
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error(`Error deleting file from ${bucket}/${path}:`, error);
      return { data: null, error };
    }
  }
};

module.exports = {
  supabase,
  auth,
  db,
  storage
}; 