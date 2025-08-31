import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile with improved error handling
  const fetchProfile = async (userId) => {
    try {
      console.log('UserContext: Fetching profile for user:', userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle(); // Use maybeSingle to avoid coercion errors

      if (error) {
        console.error('UserContext: Profile fetch error:', error.message);
        return null;
      }
      
      console.log('UserContext: Profile fetched successfully:', data ? 'Profile found' : 'No profile');
      return data;
    } catch (error) {
      console.error('UserContext: Profile fetch exception:', error.message);
      return null;
    }
  };

  // Create or update profile with user metadata
  const ensureProfile = async (userId, userMetadata) => {
    try {
      console.log('UserContext: Ensuring profile exists for user:', userId);
      
      // First try to fetch existing profile
      let profile = await fetchProfile(userId);
      
      if (!profile) {
        // Profile doesn't exist, create it
        console.log('UserContext: Creating new profile for user:', userId);
        const { data, error } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            full_name: userMetadata?.full_name || null,
            first_name: userMetadata?.full_name?.split(' ')[0] || null,
            has_completed_onboarding: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (error) {
          console.error('UserContext: Profile creation error:', error.message);
          return null;
        }
        
        profile = data;
        console.log('UserContext: Profile created successfully');
      } else if (userMetadata?.full_name && !profile.full_name) {
        // Profile exists but doesn't have name, update it
        console.log('UserContext: Updating profile with name for user:', userId);
        const { data, error } = await supabase
          .from('profiles')
          .update({
            full_name: userMetadata.full_name,
            first_name: userMetadata.full_name.split(' ')[0],
            updated_at: new Date().toISOString(),
          })
          .eq('id', userId)
          .select()
          .single();

        if (error) {
          console.error('UserContext: Profile update error:', error.message);
        } else {
          profile = data;
          console.log('UserContext: Profile updated with name successfully');
        }
      }
      
      return profile;
    } catch (error) {
      console.error('UserContext: Profile ensure error:', error.message);
      return null;
    }
  };

  // Refresh profile function
  const refreshProfile = async () => {
    if (user?.id) {
      const updatedProfile = await ensureProfile(user.id, user.user_metadata);
      setProfile(updatedProfile);
      return updatedProfile;
    }
    return null;
  };

  // Update profile function
  const updateProfile = async (updates) => {
    if (!user?.id) return { success: false, error: 'No authenticated user' };

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      setProfile(data);
      return { success: true, data };
    } catch (error) {
      console.error('UserContext: Profile update error:', error.message);
      return { success: false, error: error.message };
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setUser(session?.user || null);
      if (session?.user) {
        // Ensure profile exists and has user's name
        const userProfile = await ensureProfile(session.user.id, session.user.user_metadata);
        setProfile(userProfile);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user || null);
        if (session?.user) {
          // Ensure profile exists and has user's name
          const userProfile = await ensureProfile(session.user.id, session.user.user_metadata);
          setProfile(userProfile);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const value = {
    user,
    profile,
    loading,
    refreshProfile,
    updateProfile,
    isAuthenticated: !!user,
    hasCompletedOnboarding: profile?.has_completed_onboarding || false,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

