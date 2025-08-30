// File: app/navigation/AppNavigator.js

import React, { useState, useEffect, useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { supabase } from '../lib/supabase';

// Import all our navigators and screens
import AuthNavigator from './AuthNavigator';
import OnboardingNavigator from './OnboardingNavigator';
import MainStackNavigator from './MainStackNavigator';
import SplashScreen from '../screens/SplashScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const [appState, setAppState] = useState('loading'); // 'loading' | 'auth' | 'onboarding' | 'main'
  const [userProfile, setUserProfile] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Simplified profile fetching with better error handling
  const fetchUserProfile = useCallback(async (userId) => {
    try {
      console.log('Fetching profile for user:', userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle(); // Use maybeSingle instead of single to avoid coercion errors

      if (error) {
        console.error('Profile fetch error:', error.message);
        return null;
      }
      
      console.log('Profile fetched successfully:', data ? 'Profile found' : 'No profile');
      return data;
    } catch (error) {
      console.error('Profile fetch exception:', error.message);
      return null;
    }
  }, []);

  // Centralized app state management
  const updateAppState = useCallback(async (session) => {
    console.log('Updating app state, session:', session ? 'exists' : 'none');
    
    if (!session) {
      console.log('No session, setting app state to auth');
      setAppState('auth');
      setUserProfile(null);
      return;
    }

    // User is logged in - check their profile
    console.log('Session exists, fetching profile...');
    const profile = await fetchUserProfile(session.user.id);
    
    if (!profile) {
      // Profile doesn't exist - this shouldn't happen with our SQL trigger
      // but we'll handle it gracefully
      console.log('No profile found, setting app state to auth');
      setAppState('auth');
      setUserProfile(null);
      return;
    }

    console.log('Profile found, onboarding status:', profile.has_completed_onboarding);
    setUserProfile(profile);
    
    if (profile.has_completed_onboarding) {
      console.log('Onboarding completed, setting app state to main');
      setAppState('main');
    } else {
      console.log('Onboarding incomplete, setting app state to onboarding');
      setAppState('onboarding');
    }
  }, [fetchUserProfile]);

  // Profile refresh function - called after onboarding completion
  const refreshUserProfile = useCallback(async () => {
    console.log('Refreshing user profile...');
    if (userProfile?.id) {
      const updatedProfile = await fetchUserProfile(userProfile.id);
      if (updatedProfile) {
        setUserProfile(updatedProfile);
        if (updatedProfile.has_completed_onboarding) {
          console.log('Profile refreshed, onboarding completed, setting app state to main');
          setAppState('main');
        }
      }
    }
  }, [userProfile?.id, fetchUserProfile]);

  // Expose refresh function globally for onboarding screens
  useEffect(() => {
    global.refreshUserProfile = refreshUserProfile;
    return () => {
      delete global.refreshUserProfile;
    };
  }, [refreshUserProfile]);

  useEffect(() => {
    // Initial session check with proper splash screen timing
    const initializeApp = async () => {
      try {
        console.log('Initializing app...');
        
        // Add a minimum splash screen duration for better UX
        const startTime = Date.now();
        const minSplashDuration = 1500; // 1.5 seconds minimum
        
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Initial session check completed');
        
        await updateAppState(session);
        
        // Ensure splash screen shows for minimum duration
        const elapsed = Date.now() - startTime;
        if (elapsed < minSplashDuration) {
          await new Promise(resolve => setTimeout(resolve, minSplashDuration - elapsed));
        }
        
        console.log('App initialization completed, setting loading to false');
        setIsInitializing(false);
        
      } catch (error) {
        console.error('App initialization error:', error.message);
        setAppState('auth');
        setIsInitializing(false);
      }
    };

    initializeApp();

    // Auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.id);
        await updateAppState(session);
      }
    );

    return () => subscription.unsubscribe();
  }, [updateAppState]);

  // Render the appropriate navigator based on app state
  const renderNavigator = () => {
    // Always show splash screen during initialization
    if (isInitializing) {
      return <Stack.Screen name="Splash" component={SplashScreen} />;
    }

    switch (appState) {
      case 'loading':
        return <Stack.Screen name="Splash" component={SplashScreen} />;
      
      case 'auth':
        return <Stack.Screen name="Auth" component={AuthNavigator} />;
      
      case 'onboarding':
        return <Stack.Screen name="Onboarding" component={OnboardingNavigator} />;
      
      case 'main':
        return <Stack.Screen name="MainApp" component={MainStackNavigator} />;
      
      default:
        return <Stack.Screen name="Splash" component={SplashScreen} />;
    }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {renderNavigator()}
      </Stack.Navigator>
    </NavigationContainer>
  );
}


