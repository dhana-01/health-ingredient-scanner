import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../components/ScreenContainer';
import StyledTextInput from '../components/StyledTextInput';
import StyledButton from '../components/StyledButton';
import { COLORS, SPACING } from '../constants/theme';

export default function BasicInfoScreen({ navigation }) {
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);

  const genderOptions = [
    { label: 'Male', value: 'male', icon: 'male' },
    { label: 'Female', value: 'female', icon: 'female' },
    { label: 'Other', value: 'other', icon: 'person' },
    { label: 'Prefer not to say', value: 'prefer_not_to_say', icon: 'help-circle' },
  ];

  const handleGenderSelect = (selectedGender) => {
    setGender(selectedGender);
    setShowGenderDropdown(false);
  };

  const handleContinue = () => {
    if (!gender || !age || !weight || !height) {
      // You could add validation here
      return;
    }
    navigation.navigate('DietaryPrefs');
  };

  const isFormValid = gender && age && weight && height;

  return (
    <ScreenContainer variant="form">
      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.title}>Tell us about yourself</Text>
          <Text style={styles.subtitle}>
            This helps us personalize your experience and provide better recommendations
          </Text>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          {/* Gender Selection */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Gender</Text>
            <TouchableOpacity
              style={[styles.dropdownButton, gender && styles.dropdownButtonActive]}
              onPress={() => setShowGenderDropdown(!showGenderDropdown)}
              activeOpacity={0.7}
            >
              <View style={styles.dropdownContent}>
                {gender ? (
                  <>
                    <Ionicons 
                      name={genderOptions.find(g => g.value === gender)?.icon || 'person'} 
                      size={20} 
                      color={gender ? COLORS.primary : COLORS.secondaryText} 
                    />
                    <Text style={[styles.dropdownText, gender && styles.dropdownTextActive]}>
                      {genderOptions.find(g => g.value === gender)?.label}
                    </Text>
                  </>
                ) : (
                  <>
                    <Ionicons name="person" size={20} color={COLORS.secondaryText} />
                    <Text style={styles.dropdownText}>Select your gender</Text>
                  </>
                )}
                <Ionicons 
                  name={showGenderDropdown ? 'chevron-up' : 'chevron-down'} 
                  size={20} 
                  color={COLORS.secondaryText} 
                />
              </View>
            </TouchableOpacity>

            {/* Gender Dropdown */}
            {showGenderDropdown && (
              <View style={styles.dropdownMenu}>
                {genderOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.dropdownItem,
                      gender === option.value && styles.dropdownItemActive
                    ]}
                    onPress={() => handleGenderSelect(option.value)}
                    activeOpacity={0.7}
                  >
                    <Ionicons 
                      name={option.icon} 
                      size={20} 
                      color={gender === option.value ? COLORS.primary : COLORS.secondaryText} 
                    />
                    <Text style={[
                      styles.dropdownItemText,
                      gender === option.value && styles.dropdownItemTextActive
                    ]}>
                      {option.label}
                    </Text>
                    {gender === option.value && (
                      <Ionicons name="checkmark" size={20} color={COLORS.primary} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Age Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Age</Text>
            <StyledTextInput
              placeholder="Enter your age"
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
            />
          </View>

          {/* Weight Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Weight (kg)</Text>
            <StyledTextInput
              placeholder="e.g., 70"
              value={weight}
              onChangeText={setWeight}
              keyboardType="numeric"
            />
          </View>

          {/* Height Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Height (cm)</Text>
            <StyledTextInput
              placeholder="e.g., 175"
              value={height}
              onChangeText={setHeight}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Progress Indicator */}
        <View style={styles.progressSection}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(isFormValid ? 4 : [gender, age, weight, height].filter(Boolean).length) * 25}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {[gender, age, weight, height].filter(Boolean).length} of 4 completed
          </Text>
        </View>

        {/* Continue Button */}
        <View style={styles.buttonContainer}>
          <StyledButton
            title="Continue"
            variant="primary"
            onPress={handleContinue}
            disabled={!isFormValid}
          />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl, // Add some padding at the bottom for the button
  },
  headerSection: {
    marginBottom: SPACING.lg,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.secondaryText,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  formSection: {
    marginBottom: SPACING.lg,
  },
  inputGroup: {
    marginBottom: SPACING.md,
    position: 'relative', // For dropdown positioning
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.sm,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border || '#2C2C2E',
    backgroundColor: COLORS.inputBackground || '#2A2A2A',
    minHeight: 48,
  },
  dropdownButtonActive: {
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  dropdownContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dropdownText: {
    fontSize: 16,
    color: COLORS.secondaryText,
    marginLeft: SPACING.sm,
    flex: 1,
  },
  dropdownTextActive: {
    color: COLORS.primary,
  },
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: COLORS.background || '#000000',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border || '#2C2C2E',
    marginTop: SPACING.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1000,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border || '#2C2C2E',
  },
  dropdownItemActive: {
    backgroundColor: COLORS.primary + '20',
  },
  dropdownItemText: {
    fontSize: 16,
    color: COLORS.secondaryText,
    marginLeft: SPACING.sm,
    flex: 1,
  },
  dropdownItemTextActive: {
    color: COLORS.primary,
  },
  progressSection: {
    marginTop: SPACING.lg,
    marginBottom: SPACING.lg,
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: COLORS.border || '#2C2C2E',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  progressText: {
    marginTop: SPACING.sm,
    fontSize: 14,
    color: COLORS.secondaryText,
  },
  buttonContainer: {
    marginTop: SPACING.lg,
  },
});
