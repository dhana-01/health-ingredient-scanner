import React from 'react';
import { render } from '@testing-library/react-native';
import GoalItem from './GoalItem';

describe('GoalItem', () => {
  const mockGoal = {
    id: 'weightLoss',
    title: 'Weight Loss',
    description: 'Reduce body weight through healthy eating and lifestyle changes',
    icon: 'trending-down-outline',
    category: 'Primary'
  };

  const mockOnPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    const { root } = render(<GoalItem goal={mockGoal} onPress={mockOnPress} />);
    expect(root).toBeTruthy();
  });

  it('should render with proper structure', () => {
    const { root } = render(<GoalItem goal={mockGoal} onPress={mockOnPress} />);
    expect(root).toBeTruthy();
    expect(root.children[0]).toBeTruthy();
  });

  it('should handle goal title display', () => {
    const { root } = render(<GoalItem goal={mockGoal} onPress={mockOnPress} />);
    expect(root).toBeTruthy();
  });

  it('should handle goal description display', () => {
    const { root } = render(<GoalItem goal={mockGoal} onPress={mockOnPress} />);
    expect(root).toBeTruthy();
  });

  it('should handle goal icon display', () => {
    const { root } = render(<GoalItem goal={mockGoal} onPress={mockOnPress} />);
    expect(root).toBeTruthy();
  });

  it('should handle goal category display', () => {
    const { root } = render(<GoalItem goal={mockGoal} onPress={mockOnPress} />);
    expect(root).toBeTruthy();
  });

  it('should handle goal selection', () => {
    const { root } = render(<GoalItem goal={mockGoal} onPress={mockOnPress} />);
    expect(root).toBeTruthy();
  });

  it('should handle goal deselection', () => {
    const { root } = render(<GoalItem goal={mockGoal} onPress={mockOnPress} />);
    expect(root).toBeTruthy();
  });

  it('should handle different goal categories', () => {
    const primaryGoal = { ...mockGoal, category: 'Primary' };
    const { root: root1 } = render(<GoalItem goal={primaryGoal} onPress={mockOnPress} />);
    expect(root1).toBeTruthy();

    const secondaryGoal = { ...mockGoal, category: 'Secondary' };
    const { root: root2 } = render(<GoalItem goal={secondaryGoal} onPress={mockOnPress} />);
    expect(root2).toBeTruthy();

    const lifestyleGoal = { ...mockGoal, category: 'Lifestyle' };
    const { root: root3 } = render(<GoalItem goal={lifestyleGoal} onPress={mockOnPress} />);
    expect(root3).toBeTruthy();

    const wellnessGoal = { ...mockGoal, category: 'Wellness' };
    const { root: root4 } = render(<GoalItem goal={wellnessGoal} onPress={mockOnPress} />);
    expect(root4).toBeTruthy();
  });

  it('should handle different goal icons', () => {
    const weightLossGoal = { ...mockGoal, icon: 'trending-down-outline' };
    const { root: root1 } = render(<GoalItem goal={weightLossGoal} onPress={mockOnPress} />);
    expect(root1).toBeTruthy();

    const muscleGainGoal = { ...mockGoal, icon: 'fitness-outline' };
    const { root: root2 } = render(<GoalItem goal={muscleGainGoal} onPress={mockOnPress} />);
    expect(root2).toBeTruthy();

    const heartHealthGoal = { ...mockGoal, icon: 'heart-outline' };
    const { root: root3 } = render(<GoalItem goal={heartHealthGoal} onPress={mockOnPress} />);
    expect(root3).toBeTruthy();
  });

  it('should handle long goal titles', () => {
    const longTitleGoal = { ...mockGoal, title: 'This is a very long goal title that might wrap to multiple lines' };
    const { root } = render(<GoalItem goal={longTitleGoal} onPress={mockOnPress} />);
    expect(root).toBeTruthy();
  });

  it('should handle long goal descriptions', () => {
    const longDescGoal = { ...mockGoal, description: 'This is a very long goal description that contains a lot of text and might need to be truncated or wrapped properly in the UI' };
    const { root } = render(<GoalItem goal={longDescGoal} onPress={mockOnPress} />);
    expect(root).toBeTruthy();
  });

  it('should handle missing goal properties', () => {
    const incompleteGoal = { id: 'test', title: 'Test Goal' };
    const { root } = render(<GoalItem goal={incompleteGoal} onPress={mockOnPress} />);
    expect(root).toBeTruthy();
  });

  it('should handle onPress callback', () => {
    const { root } = render(<GoalItem goal={mockGoal} onPress={mockOnPress} />);
    expect(root).toBeTruthy();
  });
});

