import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import StyledTextInput from '../components/StyledTextInput';
import StyledButton from '../components/StyledButton';
import { COLORS, SPACING } from '../constants/theme';

export default function BasicInfoScreen({ navigation }) {
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');

  const handleContinue = () => {
    navigation.navigate('DietaryPrefs');
  };

  return (
    <ScreenContainer variant="form">
      <View style={styles.content}>
        <StyledTextInput
          label="Gender"
          placeholder="Select your gender"
          value={gender}
          onChangeText={setGender}
        />
        
        <StyledTextInput
          label="Age"
          placeholder="10"
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
        />
        
        <StyledTextInput
          label="Weight (kg)"
          placeholder="e.g., 70"
          value={weight}
          onChangeText={setWeight}
          keyboardType="numeric"
        />
        
        <StyledTextInput
          label="Height (cm)"
          placeholder="e.g., 175"
          value={height}
          onChangeText={setHeight}
          keyboardType="numeric"
        />
        
        <View style={styles.buttonContainer}>
          <StyledButton
            title="Continue"
            variant="primary"
            onPress={handleContinue}
          />
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    width: '100%',
  },
  buttonContainer: {
    marginTop: SPACING.xl,
  },
});
