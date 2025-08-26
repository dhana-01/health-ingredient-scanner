import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { COLORS, SPACING } from '../constants/theme';

export default function ScreenContainer({ children }) {
  return <SafeAreaView style={styles.container}>{children}</SafeAreaView>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
});


