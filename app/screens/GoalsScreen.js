import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../components/ScreenContainer';
import StyledButton from '../components/StyledButton';
import { COLORS, SPACING, RADIUS } from '../constants/theme';

export default function GoalsScreen({ navigation }) {
  const [selectedGoals, setSelectedGoals] = useState([]);

  const goals = [
    // Primary Health Goals
    {
      id: 'weightLoss',
      title: 'Weight Loss',
      description: 'Reduce body weight through healthy eating and lifestyle changes',
      icon: 'trending-down-outline',
      category: 'Primary',
    },
    {
      id: 'muscleGain',
      title: 'Muscle Gain',
      description: 'Build lean muscle mass and improve strength',
      icon: 'barbell-outline',
      category: 'Primary',
    },
    {
      id: 'balancedDiet',
      title: 'Balanced Diet',
      description: 'Maintain a well-rounded, nutritious eating pattern',
      icon: 'nutrition-outline',
      category: 'Primary',
    },
    {
      id: 'maintenance',
      title: 'Weight Maintenance',
      description: 'Keep current weight stable and healthy',
      icon: 'scale-outline',
      category: 'Primary',
    },
    
    // Performance Goals
    {
      id: 'energyBoost',
      title: 'Energy Boost',
      description: 'Increase daily energy levels and reduce fatigue',
      icon: 'flash-outline',
      category: 'Performance',
    },
    {
      id: 'mentalClarity',
      title: 'Mental Clarity',
      description: 'Improve focus, concentration, and cognitive function',
      icon: 'brain-outline',
      category: 'Performance',
    },
    {
      id: 'betterSleep',
      title: 'Better Sleep',
      description: 'Improve sleep quality and recovery',
      icon: 'moon-outline',
      category: 'Performance',
    },
    {
      id: 'stressReduction',
      title: 'Stress Reduction',
      description: 'Manage stress through better nutrition',
      icon: 'leaf-outline',
      category: 'Performance',
    },
    
    // Specific Health Goals
    {
      id: 'heartHealth',
      title: 'Heart Health',
      description: 'Support cardiovascular health and reduce heart disease risk',
      icon: 'heart-outline',
      category: 'Health',
    },
    {
      id: 'digestiveHealth',
      title: 'Digestive Health',
      description: 'Improve gut health and digestion',
      icon: 'medical-outline',
      category: 'Health',
    },
    {
      id: 'immuneSupport',
      title: 'Immune Support',
      description: 'Strengthen immune system and resistance to illness',
      icon: 'shield-outline',
      category: 'Health',
    },
    {
      id: 'boneHealth',
      title: 'Bone Health',
      description: 'Maintain strong bones and prevent osteoporosis',
      icon: 'fitness-outline',
      category: 'Health',
    },
    
    // Lifestyle Goals
    {
      id: 'sportsPerformance',
      title: 'Sports Performance',
      description: 'Enhance athletic performance and recovery',
      icon: 'trophy-outline',
      category: 'Lifestyle',
    },
    {
      id: 'agingWell',
      title: 'Aging Well',
      description: 'Support healthy aging and longevity',
      icon: 'time-outline',
      category: 'Lifestyle',
    },
    {
      id: 'pregnancy',
      title: 'Pregnancy Support',
      description: 'Optimize nutrition for pregnancy and fetal development',
      icon: 'happy-outline',
      category: 'Lifestyle',
    },
    {
      id: 'postpartum',
      title: 'Postpartum Recovery',
      description: 'Support recovery and nutrition after childbirth',
      icon: 'refresh-outline',
      category: 'Lifestyle',
    },
  ];

  // Group goals by category
  const groupedGoals = goals.reduce((acc, goal) => {
    if (!acc[goal.category]) {
      acc[goal.category] = [];
    }
    acc[goal.category].push(goal);
    return acc;
  }, {});

  const handleGoalToggle = (goalId) => {
    setSelectedGoals(prev => 
      prev.includes(goalId)
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    );
  };

  const handleSavePreferences = () => {
    if (selectedGoals.length > 0) {
      navigation.navigate('IntroOnboarding');
    }
  };

  const selectedCount = selectedGoals.length;
  const totalGoals = goals.length;

  return (
    <ScreenContainer variant="form">
      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.title}>Health Goals</Text>
          <Text style={styles.subtitle}>
            Select your health goals to get personalized recommendations
          </Text>
        </View>

        {/* Progress Indicator */}
        <View style={styles.progressSection}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(selectedCount / totalGoals) * 100}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {selectedCount} of {totalGoals} goals selected
          </Text>
        </View>

        {/* Goals by Category */}
        {Object.entries(groupedGoals).map(([category, categoryGoals]) => (
          <View key={category} style={styles.categorySection}>
            <Text style={styles.categoryTitle}>{category}</Text>
            {categoryGoals.map((goal) => (
              <TouchableOpacity
                key={goal.id}
                style={[
                  styles.goalItem,
                  selectedGoals.includes(goal.id) && styles.goalItemActive
                ]}
                onPress={() => handleGoalToggle(goal.id)}
                activeOpacity={0.7}
              >
                <View style={styles.goalContent}>
                  <View style={styles.goalHeader}>
                    <View style={styles.goalIconContainer}>
                      <Ionicons 
                        name={goal.icon} 
                        size={24} 
                        color={selectedGoals.includes(goal.id) ? COLORS.primary : COLORS.secondaryText} 
                      />
                    </View>
                    <View style={styles.goalText}>
                      <Text style={[
                        styles.goalTitle,
                        selectedGoals.includes(goal.id) && styles.goalTitleActive
                      ]}>
                        {goal.title}
                      </Text>
                      <Text style={styles.goalDescription}>
                        {goal.description}
                      </Text>
                    </View>
                  </View>
                  <View style={[
                    styles.checkbox,
                    selectedGoals.includes(goal.id) && styles.checkboxActive
                  ]}>
                    {selectedGoals.includes(goal.id) && (
                      <Ionicons name="checkmark" size={16} color={COLORS.white} />
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ))}

        {/* Save Button */}
        <View style={styles.buttonContainer}>
          <StyledButton
            title="Save Preferences"
            variant="primary"
            onPress={handleSavePreferences}
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
    paddingBottom: SPACING.xl,
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
    lineHeight: 22,
  },
  progressSection: {
    marginBottom: SPACING.lg,
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#2C2C2E',
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
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    backgroundColor: COLORS.inputBackground,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  goalItemActive: {
    backgroundColor: COLORS.primary + '20',
    borderColor: COLORS.primary,
    borderWidth: 1,
  },
  goalContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  goalIconContainer: {
    marginRight: SPACING.sm,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  goalText: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  goalTitleActive: {
    color: COLORS.primary,
  },
  goalDescription: {
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
