import React from 'react';
import { View, Text, TouchableOpacity, Switch, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../constants/theme';

export default function SettingsItem({ 
  icon, 
  label, 
  description, 
  onPress, 
  type = 'navigate',
  value, // for toggle type
  onValueChange // for toggle type
}) {
  const renderRightElement = () => {
    if (type === 'toggle') {
      return (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: COLORS.inputBackground, true: COLORS.primary }}
          thumbColor={COLORS.white}
        />
      );
    }
    
    // Default to navigate type
    return (
      <Ionicons 
        name="chevron-forward" 
        size={20} 
        color={COLORS.secondaryText} 
      />
    );
  };

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={0.7}
      disabled={type === 'toggle'} // Disable touch for toggle items
    >
      <View style={styles.content}>
        {/* Left: Icon */}
        <View style={styles.iconContainer}>
          <Ionicons name={icon} size={24} color={COLORS.primary} />
        </View>

        {/* Middle: Label and Description */}
        <View style={styles.textContainer}>
          <Text style={styles.label}>{label}</Text>
          {description && (
            <Text style={styles.description}>{description}</Text>
          )}
        </View>

        {/* Right: Chevron or Switch */}
        <View style={styles.rightElement}>
          {renderRightElement()}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.inputBackground,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  textContainer: {
    flex: 1,
    marginRight: SPACING.md,
  },
  label: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  description: {
    color: COLORS.secondaryText,
    fontSize: 14,
    lineHeight: 18,
  },
  rightElement: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
