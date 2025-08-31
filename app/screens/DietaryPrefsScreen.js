import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../components/ScreenContainer';
import PreferenceItem from '../components/PreferenceItem';
import StyledButton from '../components/StyledButton';
import { COLORS, SPACING } from '../constants/theme';

export default function DietaryPrefsScreen({ navigation }) {
  const [preferences, setPreferences] = useState({
    vegan: false,
    vegetarian: false,
    diabeticFriendly: false,
    glutenFree: false,
    nutAllergy: false,
    lactoseIntolerance: false,
    keto: false,
    paleo: false,
    mediterranean: false,
    lowCarb: false,
    lowSodium: false,
    lowFat: false,
    highProtein: false,
    organic: false,
    nonGMO: false,
    halal: false,
    kosher: false,
    shellfishAllergy: false,
    soyAllergy: false,
    eggAllergy: false,
  });

  const handlePreferenceChange = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleContinue = () => {
    // Check if at least one preference is selected
    const hasPreferences = Object.values(preferences).some(value => value);
    if (!hasPreferences) {
      // You could show an alert here
      return;
    }
    navigation.navigate('Goals');
  };

  const dietaryOptions = [
    // Core Dietary Restrictions
    {
      key: 'vegan',
      title: 'Vegan',
      description: 'Excludes all animal products, including dairy and honey.',
      icon: 'leaf-outline',
      category: 'Core',
    },
    {
      key: 'vegetarian',
      title: 'Vegetarian',
      description: 'Excludes meat, poultry, and fish, but may include dairy and eggs.',
      icon: 'nutrition-outline',
      category: 'Core',
    },
    {
      key: 'keto',
      title: 'Keto',
      description: 'High-fat, low-carbohydrate diet for ketosis.',
      icon: 'flame-outline',
      category: 'Core',
    },
    {
      key: 'paleo',
      title: 'Paleo',
      description: 'Based on foods presumed to be available to Paleolithic humans.',
      icon: 'fitness-outline',
      category: 'Core',
    },
    {
      key: 'mediterranean',
      title: 'Mediterranean',
      description: 'Based on the traditional cuisine of Mediterranean countries.',
      icon: 'restaurant-outline',
      category: 'Core',
    },

    // Health-Focused
    {
      key: 'diabeticFriendly',
      title: 'Diabetic-friendly',
      description: 'Focuses on balanced macronutrients and low glycemic index foods.',
      icon: 'medical-outline',
      category: 'Health',
    },
    {
      key: 'lowCarb',
      title: 'Low Carb',
      description: 'Reduces carbohydrate intake for weight management.',
      icon: 'trending-down-outline',
      category: 'Health',
    },
    {
      key: 'lowSodium',
      title: 'Low Sodium',
      description: 'Reduces salt intake for heart health.',
      icon: 'water-outline',
      category: 'Health',
    },
    {
      key: 'lowFat',
      title: 'Low Fat',
      description: 'Reduces fat intake for heart health.',
      icon: 'heart-outline',
      category: 'Health',
    },
    {
      key: 'highProtein',
      title: 'High Protein',
      description: 'Increases protein intake for muscle building and satiety.',
      icon: 'barbell-outline',
      category: 'Health',
    },

    // Allergies & Intolerances
    {
      key: 'glutenFree',
      title: 'Gluten-free',
      description: 'Avoids gluten found in wheat, barley, and rye.',
      icon: 'close-circle-outline',
      category: 'Allergies',
    },
    {
      key: 'nutAllergy',
      title: 'Nut Allergy',
      description: 'Avoids all tree nuts and peanuts to prevent allergic reactions.',
      icon: 'warning-outline',
      category: 'Allergies',
    },
    {
      key: 'lactoseIntolerance',
      title: 'Lactose Intolerance',
      description: 'Avoids dairy products containing lactose.',
      icon: 'close-circle-outline',
      category: 'Allergies',
    },
    {
      key: 'shellfishAllergy',
      title: 'Shellfish Allergy',
      description: 'Avoids all types of shellfish and crustaceans.',
      icon: 'warning-outline',
      category: 'Allergies',
    },
    {
      key: 'soyAllergy',
      title: 'Soy Allergy',
      description: 'Avoids soy products and derivatives.',
      icon: 'close-circle-outline',
      category: 'Allergies',
    },
    {
      key: 'eggAllergy',
      title: 'Egg Allergy',
      description: 'Avoids eggs and egg-containing products.',
      icon: 'warning-outline',
      category: 'Allergies',
    },

    // Quality & Standards
    {
      key: 'organic',
      title: 'Organic',
      description: 'Prefers organically grown and produced foods.',
      icon: 'leaf-outline',
      category: 'Quality',
    },
    {
      key: 'nonGMO',
      title: 'Non-GMO',
      description: 'Avoids genetically modified organisms.',
      icon: 'shield-checkmark-outline',
      category: 'Quality',
    },
    {
      key: 'halal',
      title: 'Halal',
      description: 'Follows Islamic dietary laws and restrictions.',
      icon: 'checkmark-circle-outline',
      category: 'Quality',
    },
    {
      key: 'kosher',
      title: 'Kosher',
      description: 'Follows Jewish dietary laws and restrictions.',
      icon: 'checkmark-circle-outline',
      category: 'Quality',
    },
  ];

  // Group options by category
  const groupedOptions = dietaryOptions.reduce((acc, option) => {
    if (!acc[option.category]) {
      acc[option.category] = [];
    }
    acc[option.category].push(option);
    return acc;
  }, {});

  const selectedCount = Object.values(preferences).filter(Boolean).length;
  const totalOptions = dietaryOptions.length;

  return (
    <ScreenContainer variant="form">
      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.title}>Dietary Preferences</Text>
          <Text style={styles.subtitle}>
            Select your dietary preferences to get personalized food recommendations
          </Text>
        </View>

        {/* Progress Indicator */}
        <View style={styles.progressSection}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(selectedCount / totalOptions) * 100}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {selectedCount} of {totalOptions} preferences selected
          </Text>
        </View>

        {/* Preferences by Category */}
        {Object.entries(groupedOptions).map(([category, options]) => (
          <View key={category} style={styles.categorySection}>
            <Text style={styles.categoryTitle}>{category}</Text>
            {options.map((option) => (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.preferenceItem,
                  preferences[option.key] && styles.preferenceItemActive
                ]}
                onPress={() => handlePreferenceChange(option.key, !preferences[option.key])}
                activeOpacity={0.7}
              >
                <View style={styles.preferenceContent}>
                  <View style={styles.preferenceHeader}>
                    <View style={styles.preferenceIconContainer}>
                      <Ionicons 
                        name={option.icon} 
                        size={24} 
                        color={preferences[option.key] ? COLORS.primary : COLORS.secondaryText} 
                      />
                    </View>
                    <View style={styles.preferenceText}>
                      <Text style={[
                        styles.preferenceTitle,
                        preferences[option.key] && styles.preferenceTitleActive
                      ]}>
                        {option.title}
                      </Text>
                      <Text style={styles.preferenceDescription}>
                        {option.description}
                      </Text>
                    </View>
                  </View>
                  <View style={[
                    styles.checkbox,
                    preferences[option.key] && styles.checkboxActive
                  ]}>
                    {preferences[option.key] && (
                      <Ionicons name="checkmark" size={16} color={COLORS.white} />
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ))}

        {/* Continue Button */}
        <View style={styles.buttonContainer}>
          <StyledButton
            title="Continue"
            variant="primary"
            onPress={handleContinue}
            disabled={selectedCount === 0}
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
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl, // Add some padding at the bottom for the button
  },
  headerSection: {
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.secondaryText,
    textAlign: 'center',
    marginTop: SPACING.sm,
  },
  progressSection: {
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
  categorySection: {
    marginBottom: SPACING.lg,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.sm,
  },
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    backgroundColor: COLORS.inputBackground || '#2A2A2A',
    borderRadius: 10,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  preferenceItemActive: {
    backgroundColor: COLORS.primary + '20',
    borderColor: COLORS.primary,
    borderWidth: 1,
  },
  preferenceContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  preferenceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  preferenceIconContainer: {
    marginRight: SPACING.sm,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  preferenceText: {
    flex: 1,
  },
  preferenceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text || COLORS.white,
  },
  preferenceTitleActive: {
    color: COLORS.primary,
  },
  preferenceDescription: {
    fontSize: 13,
    color: COLORS.secondaryText,
    marginTop: SPACING.xs,
    lineHeight: 18,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.secondaryText + '30',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.secondaryText + '50',
  },
  checkboxActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  buttonContainer: {
    marginTop: SPACING.lg,
    marginBottom: SPACING.lg,
  },
});
