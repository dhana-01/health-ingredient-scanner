import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { COLORS } from '../constants/theme';
import { supabase } from '../lib/supabase';

import BasicInfoScreen from '../screens/BasicInfoScreen';
import DietaryPrefsScreen from '../screens/DietaryPrefsScreen';
import GoalsScreen from '../screens/GoalsScreen';
import IntroOnboardingScreen from '../screens/IntroOnboardingScreen';

const Stack = createNativeStackNavigator();

// Utility function for onboarding screens to complete the process
export const completeOnboarding = async () => {
  try {
    console.log('OnboardingNavigator: Starting onboarding completion...');
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    console.log('OnboardingNavigator: Updating profile for user:', user.id);

    // Update the user's profile to mark onboarding as complete
    const { error } = await supabase
      .from('profiles')
      .update({ has_completed_onboarding: true })
      .eq('id', user.id);

    if (error) throw error;

    console.log('OnboardingNavigator: Profile updated successfully');

    // Trigger profile refresh in AppNavigator
    if (global.refreshUserProfile) {
      console.log('OnboardingNavigator: Calling global refresh function');
      global.refreshUserProfile();
    } else {
      console.log('OnboardingNavigator: Global refresh function not available');
    }

    return { success: true };
  } catch (error) {
    console.error('OnboardingNavigator: Error completing onboarding:', error.message);
    return { success: false, error: error.message };
  }
};

export default function OnboardingNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="BasicInfo"
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.background },
        headerTintColor: COLORS.text,
        headerTitleStyle: { color: COLORS.text },
        headerBackTitle: 'Back',
        gestureEnabled: true,
      }}
    >
      <Stack.Screen 
        name="BasicInfo" 
        component={BasicInfoScreen} 
        options={{ title: 'Basic Info' }} 
      />
      <Stack.Screen 
        name="DietaryPrefs" 
        component={DietaryPrefsScreen} 
        options={{ title: 'Dietary Preferences' }} 
      />
      <Stack.Screen 
        name="Goals" 
        component={GoalsScreen} 
        options={{ title: 'Your Goals' }} 
      />
      <Stack.Screen 
        name="IntroOnboarding" 
        component={IntroOnboardingScreen} 
        options={{ headerShown: false }} 
      />
    </Stack.Navigator>
  );
}
