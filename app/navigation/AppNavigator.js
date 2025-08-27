import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AuthNavigator from './AuthNavigator';
import OnboardingNavigator from './OnboardingNavigator';
import TabNavigator from './TabNavigator';
import SplashScreen from '../screens/SplashScreen';
import { COLORS } from '../constants/theme';
import { supabase } from '../lib/supabase';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isProfileLoading, setIsProfileLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const currentSession = sessionData?.session ?? null;
        if (!isMounted) return;
        setSession(currentSession);

        if (currentSession?.user?.id) {
          setIsProfileLoading(true);
          const { data: profiles, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', currentSession.user.id)
            .single();
          if (!isMounted) return;
          if (!error) setProfile(profiles);
        } else {
          setProfile(null);
        }
      } catch (error) {
        console.error('Error during initialization:', error);
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
      authListener.subscription.unsubscribe();
    };
  }, []);

  const renderContent = () => {
    if (!session) {
      return <Stack.Screen name="Auth" component={AuthNavigator} options={{ headerShown: false }} />;
    }

    if (isProfileLoading || (!profile && session)) {
      return (
        <Stack.Screen
          name="Loading"
          options={{ headerShown: false }}
          component={SplashScreen}
        />
      );
    }

    if (profile && profile.has_completed_onboarding === false) {
      return <Stack.Screen name="Onboarding" component={OnboardingNavigator} options={{ headerShown: false }} />;
    }

    return <Stack.Screen name="Main" component={TabNavigator} options={{ headerShown: false }} />;
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


