import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { COLORS, SPACING } from '../constants/theme';

export default function ScreenHeader({ title }) {
  return (
    <Text style={styles.header}>{title}</Text>
  );
}

const styles = StyleSheet.create({
  header: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
});
