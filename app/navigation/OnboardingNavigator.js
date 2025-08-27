import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { COLORS } from '../constants/theme';

import BasicInfoScreen from '../screens/BasicInfoScreen';
import DietaryPrefsScreen from '../screens/DietaryPrefsScreen';
import GoalsScreen from '../screens/GoalsScreen';
import IntroOnboardingScreen from '../screens/IntroOnboardingScreen';

const Stack = createNativeStackNavigator();

export default function OnboardingNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.background },
        headerTintColor: COLORS.text,
        headerTitleStyle: { color: COLORS.text },
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
