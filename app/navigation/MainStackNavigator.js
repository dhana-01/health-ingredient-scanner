import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TabNavigator from './TabNavigator';
import ResultScreen from '../screens/ResultScreen';

const Stack = createNativeStackNavigator();

export default function MainStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="MainTabs"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen 
        name="MainTabs" 
        component={TabNavigator} 
      />
      <Stack.Screen 
        name="Result" 
        component={ResultScreen} 
      />
    </Stack.Navigator>
  );
}

