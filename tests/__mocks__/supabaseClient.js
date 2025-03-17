// Mock Supabase client for testing
const mockSupabaseClient = {
  from: jest.fn(() => ({
    select: jest.fn(() => ({
      eq: jest.fn(() => ({
        single: jest.fn(() => Promise.resolve({ data: {}, error: null })),
        data: [],
        error: null
      })),
      order: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({ data: [], error: null })),
        limit: jest.fn(() => Promise.resolve({ data: [], error: null }))
      })),
      data: [],
      error: null
    })),
    insert: jest.fn((data) => ({
      single: jest.fn(() => Promise.resolve({ data, error: null })),
      eq: jest.fn(() => Promise.resolve({ data, error: null }))
    })),
    update: jest.fn(() => ({
      eq: jest.fn(() => ({
        single: jest.fn(() => Promise.resolve({ data: {}, error: null }))
      }))
    })),
    delete: jest.fn(() => ({
      eq: jest.fn(() => ({
        single: jest.fn(() => Promise.resolve({ data: null, error: null }))
      }))
    })),
    eq: jest.fn(() => Promise.resolve({ data: {}, error: null }))
  })),
  auth: {
    getSession: jest.fn(() => Promise.resolve({
      data: { session: { user: { id: '123', email: 'test@example.com' } } },
      error: null
    })),
    signUp: jest.fn(() => Promise.resolve({
      data: { user: { id: '123', email: 'test@example.com' } },
      error: null
    })),
    signInWithPassword: jest.fn(() => Promise.resolve({
      data: { user: { id: '123', email: 'test@example.com' } },
      error: null
    })),
    signOut: jest.fn(() => Promise.resolve({ error: null })),
    resetPasswordForEmail: jest.fn(() => Promise.resolve({ error: null })),
    updateUser: jest.fn(() => Promise.resolve({
      data: { user: { id: '123', email: 'test@example.com' } },
      error: null
    })),
    onAuthStateChange: jest.fn((callback) => {
      // Immediately call the callback with a session
      callback('SIGNED_IN', { user: { id: '123', email: 'test@example.com' } });
      
      // Return the expected structure
      return {
        data: {
          subscription: {
            unsubscribe: jest.fn()
          }
        }
      };
    })
  },
  storage: {
    from: jest.fn(() => ({
      upload: jest.fn(() => Promise.resolve({ data: {}, error: null })),
      getPublicUrl: jest.fn(() => ({ data: { publicUrl: 'https://example.com/image.jpg' } }))
    }))
  }
};

exports.supabase = mockSupabaseClient; 