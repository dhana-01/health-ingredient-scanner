import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../constants/theme';

export default function SocialButton({ title, icon }) {
  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.8}>
      <View style={styles.icon}>{icon}</View>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 44,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.inputBackground,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    marginTop: SPACING.sm,
  },
  icon: {
    marginRight: SPACING.sm,
  },
  text: {
    color: COLORS.white,
    fontWeight: '500',
  },
});


