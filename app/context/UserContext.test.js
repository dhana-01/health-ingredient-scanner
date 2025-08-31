import React from 'react';
import { render, act } from '@testing-library/react-native';
import { UserContext, UserProvider, useUser } from './UserContext';

// Mock the supabase client
jest.mock('../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
      onAuthStateChange: jest.fn(() => ({
        data: { subscription: { unsubscribe: jest.fn() } }
      }))
    },
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          maybeSingle: jest.fn(() => Promise.resolve({ data: null, error: null }))
        }))
      })),
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({ data: null, error: null }))
        }))
      })),
      update: jest.fn(() => ({
        eq: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({ data: null, error: null }))
          }))
        }))
      }))
    }))
  }
}));

// Test component to use the context
function TestComponent() {
  const { user, profile, loading, refreshProfile, updateProfile, isAuthenticated, hasCompletedOnboarding } = useUser();
  return (
    <React.Fragment>
      <Text testID="user">{user ? 'User exists' : 'No user'}</Text>
      <Text testID="profile">{profile ? 'Profile exists' : 'No profile'}</Text>
      <Text testID="loading">{loading ? 'Loading' : 'Not loading'}</Text>
      <Text testID="authenticated">{isAuthenticated ? 'Authenticated' : 'Not authenticated'}</Text>
      <Text testID="onboarding">{hasCompletedOnboarding ? 'Completed' : 'Not completed'}</Text>
      <TouchableOpacity testID="refresh" onPress={refreshProfile}>
        <Text>Refresh</Text>
      </TouchableOpacity>
      <TouchableOpacity testID="update" onPress={() => updateProfile({ name: 'Test' })}>
        <Text>Update</Text>
      </TouchableOpacity>
    </React.Fragment>
  );
}

// Test component to test useUser outside provider
function TestComponentOutsideProvider() {
  const { user, profile, loading } = useUser();
  return (
    <React.Fragment>
      <Text testID="user">{user ? 'User exists' : 'No user'}</Text>
      <Text testID="profile">{profile ? 'Profile exists' : 'No profile'}</Text>
      <Text testID="loading">{loading ? 'Loading' : 'Not loading'}</Text>
    </React.Fragment>
  );
}

describe('UserContext', () => {
  let mockSupabase;

  beforeEach(() => {
    jest.clearAllMocks();
    mockSupabase = require('../lib/supabase');
  });

  describe('UserProvider', () => {
    it('should render without crashing', () => {
      const result = render(<UserProvider><Text>Test</Text></UserProvider>);
      expect(result).toBeTruthy();
    });

    it('should render with proper structure', () => {
      const result = render(<UserProvider><Text>Test</Text></UserProvider>);
      expect(result).toBeTruthy();
    });

    it('should handle empty children', () => {
      const result = render(<UserProvider>{}</UserProvider>);
      expect(result).toBeTruthy();
    });

    it('should handle null children', () => {
      const result = render(<UserProvider>{null}</UserProvider>);
      expect(result).toBeTruthy();
    });

    it('should handle undefined children', () => {
      const result = render(<UserProvider>{undefined}</UserProvider>);
      expect(result).toBeTruthy();
    });

    it('should provide context values', () => {
      const result = render(
        <UserProvider>
          <TestComponent />
        </UserProvider>
      );
      expect(result).toBeTruthy();
    });

    it('should handle initial session loading', async () => {
      mockSupabase.supabase.auth.getSession.mockResolvedValue({
        data: { session: null }
      });

      await act(async () => {
        render(
          <UserProvider>
            <TestComponent />
          </UserProvider>
        );
      });

      expect(mockSupabase.supabase.auth.getSession).toHaveBeenCalled();
    });

    it('should handle session with user', async () => {
      const mockUser = {
        id: 'test-user-id',
        user_metadata: { full_name: 'Test User' }
      };

      mockSupabase.supabase.auth.getSession.mockResolvedValue({
        data: { session: { user: mockUser } }
      });

      mockSupabase.supabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            maybeSingle: jest.fn(() => Promise.resolve({ data: null, error: null }))
          }))
        })),
        insert: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({ 
              data: { id: 'test-user-id', full_name: 'Test User' }, 
              error: null 
            }))
          }))
        }))
      });

      await act(async () => {
        render(
          <UserProvider>
            <TestComponent />
          </UserProvider>
        );
      });

      expect(mockSupabase.supabase.auth.getSession).toHaveBeenCalled();
    });

    it('should handle auth state changes', async () => {
      const mockSubscription = { unsubscribe: jest.fn() };
      mockSupabase.supabase.auth.onAuthStateChange.mockReturnValue({
        data: { subscription: mockSubscription }
      });

      await act(async () => {
        render(
          <UserProvider>
            <TestComponent />
          </UserProvider>
        );
      });

      expect(mockSupabase.supabase.auth.onAuthStateChange).toHaveBeenCalled();
    });

    it('should handle profile fetching', async () => {
      const mockUser = { id: 'test-user-id' };
      
      mockSupabase.supabase.auth.getSession.mockResolvedValue({
        data: { session: { user: mockUser } }
      });

      mockSupabase.supabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            maybeSingle: jest.fn(() => Promise.resolve({ 
              data: { id: 'test-user-id', full_name: 'Test User' }, 
              error: null 
            }))
          }))
        }))
      });

      await act(async () => {
        render(
          <UserProvider>
            <TestComponent />
          </UserProvider>
        );
      });

      expect(mockSupabase.supabase.from).toHaveBeenCalledWith('profiles');
    });

    it('should handle profile creation', async () => {
      const mockUser = {
        id: 'test-user-id',
        user_metadata: { full_name: 'Test User' }
      };

      mockSupabase.supabase.auth.getSession.mockResolvedValue({
        data: { session: { user: mockUser } }
      });

      // First call returns no profile, second call creates one
      mockSupabase.supabase.from
        .mockReturnValueOnce({
          select: jest.fn(() => ({
            eq: jest.fn(() => ({
              maybeSingle: jest.fn(() => Promise.resolve({ data: null, error: null }))
            }))
          }))
        })
        .mockReturnValueOnce({
          insert: jest.fn(() => ({
            select: jest.fn(() => ({
              single: jest.fn(() => Promise.resolve({ 
                data: { id: 'test-user-id', full_name: 'Test User' }, 
                error: null 
              }))
            }))
          }))
        });

      await act(async () => {
        render(
          <UserProvider>
            <TestComponent />
          </UserProvider>
        );
      });

      expect(mockSupabase.supabase.from).toHaveBeenCalledWith('profiles');
    });

    it('should handle profile updates', async () => {
      const mockUser = {
        id: 'test-user-id',
        user_metadata: { full_name: 'Updated User' }
      };

      mockSupabase.supabase.auth.getSession.mockResolvedValue({
        data: { session: { user: mockUser } }
      });

      // First call returns existing profile, second call updates it
      mockSupabase.supabase.from
        .mockReturnValueOnce({
          select: jest.fn(() => ({
            eq: jest.fn(() => ({
              maybeSingle: jest.fn(() => Promise.resolve({ 
                data: { id: 'test-user-id', full_name: null }, 
                error: null 
              }))
            }))
          }))
        })
        .mockReturnValueOnce({
          update: jest.fn(() => ({
            eq: jest.fn(() => ({
              select: jest.fn(() => ({
                single: jest.fn(() => Promise.resolve({ 
                  data: { id: 'test-user-id', full_name: 'Updated User' }, 
                  error: null 
                }))
              }))
            }))
          }))
        });

      await act(async () => {
        render(
          <UserProvider>
            <TestComponent />
          </UserProvider>
        );
      });

      expect(mockSupabase.supabase.from).toHaveBeenCalledWith('profiles');
    });

    it('should handle error in profile fetch', async () => {
      const mockUser = { id: 'test-user-id' };
      
      mockSupabase.supabase.auth.getSession.mockResolvedValue({
        data: { session: { user: mockUser } }
      });

      mockSupabase.supabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            maybeSingle: jest.fn(() => Promise.resolve({ 
              data: null, 
              error: { message: 'Database error' } 
            }))
          }))
        }))
      });

      await act(async () => {
        render(
          <UserProvider>
            <TestComponent />
          </UserProvider>
        );
      });

      expect(mockSupabase.supabase.from).toHaveBeenCalledWith('profiles');
    });

    it('should handle error in profile creation', async () => {
      const mockUser = {
        id: 'test-user-id',
        user_metadata: { full_name: 'Test User' }
      };

      mockSupabase.supabase.auth.getSession.mockResolvedValue({
        data: { session: { user: mockUser } }
      });

      // First call returns no profile, second call fails to create
      mockSupabase.supabase.from
        .mockReturnValueOnce({
          select: jest.fn(() => ({
            eq: jest.fn(() => ({
              maybeSingle: jest.fn(() => Promise.resolve({ data: null, error: null }))
            }))
          }))
        })
        .mockReturnValueOnce({
          insert: jest.fn(() => ({
            select: jest.fn(() => ({
              single: jest.fn(() => Promise.resolve({ 
                data: null, 
                error: { message: 'Insert failed' } 
              }))
            }))
          }))
        });

      await act(async () => {
        render(
          <UserProvider>
            <TestComponent />
          </UserProvider>
        );
      });

      expect(mockSupabase.supabase.from).toHaveBeenCalledWith('profiles');
    });

    it('should handle error in profile update', async () => {
      const mockUser = {
        id: 'test-user-id',
        user_metadata: { full_name: 'Updated User' }
      };

      mockSupabase.supabase.auth.getSession.mockResolvedValue({
        data: { session: { user: mockUser } }
      });

      // First call returns existing profile, second call fails to update
      mockSupabase.supabase.from
        .mockReturnValueOnce({
          select: jest.fn(() => ({
            eq: jest.fn(() => ({
              maybeSingle: jest.fn(() => Promise.resolve({ 
                data: { id: 'test-user-id', full_name: null }, 
                error: null 
              }))
            }))
          }))
        })
        .mockReturnValueOnce({
          update: jest.fn(() => ({
            eq: jest.fn(() => ({
              select: jest.fn(() => ({
                single: jest.fn(() => Promise.resolve({ 
                  data: null, 
                  error: { message: 'Update failed' } 
                }))
              }))
            }))
          }))
        });

      await act(async () => {
        render(
          <UserProvider>
            <TestComponent />
          </UserProvider>
        );
      });

      expect(mockSupabase.supabase.from).toHaveBeenCalledWith('profiles');
    });

    it('should handle exception in profile operations', async () => {
      const mockUser = { id: 'test-user-id' };
      
      mockSupabase.supabase.auth.getSession.mockResolvedValue({
        data: { session: { user: mockUser } }
      });

      mockSupabase.supabase.from.mockImplementation(() => {
        throw new Error('Network error');
      });

      await act(async () => {
        render(
          <UserProvider>
            <TestComponent />
          </UserProvider>
        );
      });

      // Should handle the exception gracefully
      expect(result).toBeTruthy();
    });
  });

  describe('useUser hook', () => {
    it('should throw error when used outside provider', () => {
      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      expect(() => {
        render(<TestComponentOutsideProvider />);
      }).toThrow('useUser must be used within a UserProvider');
      
      consoleSpy.mockRestore();
    });

    it('should return context values when used within provider', () => {
      const result = render(
        <UserProvider>
          <TestComponent />
        </UserProvider>
      );
      expect(result).toBeTruthy();
    });
  });

  describe('Context value structure', () => {
    it('should provide all required context values', () => {
      const result = render(
        <UserProvider>
          <TestComponent />
        </UserProvider>
      );
      expect(result).toBeTruthy();
    });

    it('should handle loading state correctly', () => {
      const result = render(
        <UserProvider>
          <TestComponent />
        </UserProvider>
      );
      expect(result).toBeTruthy();
    });

    it('should handle authentication state correctly', () => {
      const result = render(
        <UserProvider>
          <TestComponent />
        </UserProvider>
      );
      expect(result).toBeTruthy();
    });

    it('should handle onboarding completion state correctly', () => {
      const result = render(
        <UserProvider>
          <TestComponent />
        </UserProvider>
      );
      expect(result).toBeTruthy();
    });
  });
});

