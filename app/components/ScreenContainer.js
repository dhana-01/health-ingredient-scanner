// File: app/components/ScreenContainer.js

import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
// Assuming SPACING is defined in your theme, if not, you can remove it from the form style.
import { COLORS, SPACING } from '../constants/theme'; 

export default function ScreenContainer({ children, style }) {
  // We remove the complex variant system for now to enforce consistency.
  // We pass an optional `style` prop if custom overrides are ever needed.
  return <SafeAreaView style={[styles.container, style]}>{children}</SafeAreaView>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 16, // Correct horizontal padding
    justifyContent: 'center', // This is the KEY FIX: Vertical centering is now the default
  },
});