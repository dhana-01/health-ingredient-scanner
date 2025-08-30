import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const COLORS = {
  primary: '#289484',
  white: '#FFFFFF',
};

export default function StyledButton({ title, onPress, style, disabled }) {
  return (
    <TouchableOpacity style={[styles.button, style, disabled && { opacity: 0.7 }]} onPress={onPress} activeOpacity={0.85} disabled={disabled}>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
});
