import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import GoalItem from '../components/GoalItem';
import StyledButton from '../components/StyledButton';
import { COLORS, SPACING } from '../constants/theme';

export default function GoalsScreen({ navigation }) {
  const [selectedGoal, setSelectedGoal] = useState(null);

  const goals = [
    'Weight Loss',
    'Muscle Gain',
    'Balanced Diet',
  ];

  const handleGoalSelect = (goal) => {
    setSelectedGoal(goal);
  };

  const handleSavePreferences = () => {
    if (selectedGoal) {
      navigation.navigate('IntroOnboarding');
    }
  };

  return (
    <ScreenContainer variant="form">
      <View style={styles.content}>
        <Text style={styles.question}>What are your health goals?</Text>
        <Text style={styles.description}>
          Select the primary goal that resonates most with your journey. This helps us tailor your experience.
        </Text>
        
        <View style={styles.goalsContainer}>
          {goals.map((goal) => (
            <GoalItem
              key={goal}
              title={goal}
              selected={selectedGoal === goal}
              onPress={() => handleGoalSelect(goal)}
            />
          ))}
        </View>
        
        <View style={styles.buttonContainer}>
          <StyledButton
            title="Save Preferences"
            variant="primary"
            onPress={handleSavePreferences}
            disabled={!selectedGoal}
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
  question: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  description: {
    color: COLORS.text,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    lineHeight: 22,
  },
  goalsContainer: {
    marginBottom: SPACING.xl,
  },
  buttonContainer: {
    marginTop: SPACING.lg,
  },
});
