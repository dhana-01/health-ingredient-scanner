import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AuthNavigator from './AuthNavigator';
import OnboardingNavigator from './OnboardingNavigator';
import TabNavigator from './TabNavigator';
import SplashScreen from '../screens/SplashScreen';
import { UserProvider } from '../context/UserContext';
import { COLORS } from '../constants/theme';
import { supabase } from '../lib/supabase';

// Component wrappers to avoid inline functions
const OnboardingWrapper = () => (
  <UserProvider>
    <OnboardingNavigator />
  </UserProvider>
);

const MainWrapper = () => (
  <UserProvider>
    <TabNavigator />
  </UserProvider>
);

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isProfileLoading, setIsProfileLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    // Add a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (isMounted && isProfileLoading) {
        console.warn('Profile loading timeout, forcing to auth screen');
        setIsProfileLoading(false);
        setProfile(null);
      }
    }, 10000); // 10 second timeout

    const init = async () => {
      try {
        console.log('Starting app initialization...');
        
        // Check if Supabase is properly configured
        if (!process.env.EXPO_PUBLIC_SUPABASE_URL || !process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY) {
          console.error('Missing Supabase environment variables');
          throw new Error('Supabase configuration missing');
        }

        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          console.error('Error getting session:', sessionError);
          throw sessionError;
        }
        
        const currentSession = sessionData?.session ?? null;
        console.log('Session check result:', { hasSession: !!currentSession, userId: currentSession?.user?.id });
        
        if (!isMounted) return;
        setSession(currentSession);

        if (currentSession?.user?.id) {
          setIsProfileLoading(true);
          console.log('Fetching profile for user:', currentSession.user.id);
          
          const { data: profiles, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', currentSession.user.id)
            .single();
          
          if (!isMounted) return;
          
          if (error) {
            console.error('Error fetching profile:', error);
            // Don't throw here, just set profile to null
            setProfile(null);
          } else {
            console.log('Profile fetched successfully:', profiles);
            setProfile(profiles);
          }
        } else {
          console.log('No session found, setting profile to null');
          setProfile(null);
        }
      } catch (error) {
        console.error('Error during initialization:', error);
        // Set loading to false even on error to prevent infinite loading
        if (isMounted) {
          setIsProfileLoading(false);
        }
      } finally {
        if (isMounted) {
          setIsProfileLoading(false);
        }
      }
    };

    init();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession);
      if (newSession?.user?.id) {
        setIsProfileLoading(true);
        try {
          const { data: profiles, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', newSession.user.id)
            .single();
          if (!error) setProfile(profiles);
        } catch (error) {
          console.error('Error fetching profile:', error);
        } finally {
          setIsProfileLoading(false);
        }
      } else {
        setProfile(null);
      }
    });

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      authListener.subscription.unsubscribe();
    };
  }, []);

  const renderContent = () => {
    // Debug logging
    console.log('AppNavigator state:', {
      session: !!session,
      profile: !!profile,
      isProfileLoading,
      hasCompletedOnboarding: profile?.has_completed_onboarding
    });

    // Show loading screen while checking session and profile
    if (isProfileLoading) {
      console.log('Showing loading screen');
      return (
        <Stack.Screen
          name="Loading"
          options={{ headerShown: false }}
          component={SplashScreen}
        />
      );
    }

    // No session - show auth
    if (!session) {
      return <Stack.Screen name="Auth" component={AuthNavigator} options={{ headerShown: false }} />;
    }

    // Has session but no profile - this shouldn't happen, but show auth as fallback
    if (!profile) {
      console.warn('Session exists but no profile found, redirecting to auth');
      return <Stack.Screen name="Auth" component={AuthNavigator} options={{ headerShown: false }} />;
    }

    // Has profile but hasn't completed onboarding
    if (profile.has_completed_onboarding === false) {
      return (
        <Stack.Screen 
          name="Onboarding" 
          component={OnboardingWrapper} 
          options={{ headerShown: false }} 
        />
      );
    }

    // Has profile and completed onboarding - show main app
    return (
      <Stack.Screen 
        name="Main" 
        component={MainWrapper} 
        options={{ headerShown: false }} 
      />
    );
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: COLORS.background },
          headerTintColor: COLORS.text,
          headerTitleStyle: { color: COLORS.text },
        }}
      >
        {renderContent()}
      </Stack.Navigator>
    </NavigationContainer>
  );
}


