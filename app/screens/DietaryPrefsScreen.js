import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
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
  });

  const handlePreferenceChange = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleContinue = () => {
    navigation.navigate('Goals');
  };

  const dietaryOptions = [
    {
      key: 'vegan',
      title: 'Vegan',
      description: 'Excludes all animal products, including dairy and honey.',
    },
    {
      key: 'vegetarian',
      title: 'Vegetarian',
      description: 'Excludes meat, poultry, and fish, but may include dairy and eggs.',
    },
    {
      key: 'diabeticFriendly',
      title: 'Diabetic-friendly',
      description: 'Focuses on balanced macronutrients and low glycemic index foods.',
    },
    {
      key: 'glutenFree',
      title: 'Gluten-free',
      description: 'Avoids gluten found in wheat, barley, and rye.',
    },
    {
      key: 'nutAllergy',
      title: 'Nut Allergy',
      description: 'Avoids all tree nuts and peanuts to prevent allergic reactions.',
    },
    {
      key: 'lactoseIntolerance',
      title: 'Lactose Intolerance',
      description: 'Avoids dairy products containing lactose.',
    },
  ];

  return (
    <ScreenContainer variant="list">
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {dietaryOptions.map((option) => (
          <PreferenceItem
            key={option.key}
            title={option.title}
            description={option.description}
            value={preferences[option.key]}
            onValueChange={(value) => handlePreferenceChange(option.key, value)}
          />
        ))}
        
        <View style={styles.buttonContainer}>
          <StyledButton
            title="Continue"
            variant="primary"
            onPress={handleContinue}
          />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    width: '100%',
  },
  buttonContainer: {
    marginTop: SPACING.xl,
    marginBottom: SPACING.lg,
  },
});
