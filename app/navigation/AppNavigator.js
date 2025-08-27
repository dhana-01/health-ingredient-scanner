import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import HomeScreen from '../screens/HomeScreen';
import OnboardingNavigator from './OnboardingNavigator';
import { COLORS } from '../constants/theme';
import { supabase } from '../lib/supabase';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const [session, setSession] = useState(null);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  useEffect(() => {
    // Check for existing session when app starts
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      // For now, we'll assume users need to complete onboarding
      // In a real app, you'd check this from user preferences or database
      setHasCompletedOnboarding(false);
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: COLORS.background },
          headerTintColor: COLORS.text,
        }}
      >
        {session && session.user ? (
          // Check if user has completed onboarding
          hasCompletedOnboarding ? (
            // Main app stack for authenticated users who completed onboarding
            <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
          ) : (
            // Onboarding flow for authenticated users
            <Stack.Screen 
              name="Onboarding" 
              component={OnboardingNavigator} 
              options={{ headerShown: false }} 
            />
          )
        ) : (
          // Auth stack for non-authenticated users
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
            <Stack.Screen name="SignUp" component={SignUpScreen} options={{ title: 'Sign Up' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}


