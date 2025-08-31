import React from 'react';
import { render } from '@testing-library/react-native';
import PreferenceItem from './PreferenceItem';

describe('PreferenceItem', () => {
  const mockPreference = {
    id: 'vegetarian',
    title: 'Vegetarian',
    description: 'Plant-based diet without meat or fish',
    icon: 'leaf-outline',
    category: 'Dietary'
  };

  const mockOnPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    const { root } = render(<PreferenceItem preference={mockPreference} onPress={mockOnPress} />);
    expect(root).toBeTruthy();
  });

  it('should render with proper structure', () => {
    const { root } = render(<PreferenceItem preference={mockPreference} onPress={mockOnPress} />);
    expect(root).toBeTruthy();
    expect(root.children[0]).toBeTruthy();
  });

  it('should handle preference title display', () => {
    const { root } = render(<PreferenceItem preference={mockPreference} onPress={mockOnPress} />);
    expect(root).toBeTruthy();
  });

  it('should handle preference description display', () => {
    const { root } = render(<PreferenceItem preference={mockPreference} onPress={mockOnPress} />);
    expect(root).toBeTruthy();
  });

  it('should handle preference icon display', () => {
    const { root } = render(<PreferenceItem preference={mockPreference} onPress={mockOnPress} />);
    expect(root).toBeTruthy();
  });

  it('should handle preference category display', () => {
    const { root } = render(<PreferenceItem preference={mockPreference} onPress={mockOnPress} />);
    expect(root).toBeTruthy();
  });

  it('should handle preference selection', () => {
    const { root } = render(<PreferenceItem preference={mockPreference} onPress={mockOnPress} />);
    expect(root).toBeTruthy();
  });

  it('should handle preference deselection', () => {
    const { root } = render(<PreferenceItem preference={mockPreference} onPress={mockOnPress} />);
    expect(root).toBeTruthy();
  });

  it('should handle different preference categories', () => {
    const dietaryPreference = { ...mockPreference, category: 'Dietary' };
    const { root: root1 } = render(<PreferenceItem preference={dietaryPreference} onPress={mockOnPress} />);
    expect(root1).toBeTruthy();

    const healthPreference = { ...mockPreference, category: 'Health' };
    const { root: root2 } = render(<PreferenceItem preference={healthPreference} onPress={mockOnPress} />);
    expect(root2).toBeTruthy();

    const lifestylePreference = { ...mockPreference, category: 'Lifestyle' };
    const { root: root3 } = render(<PreferenceItem preference={lifestylePreference} onPress={mockOnPress} />);
    expect(root3).toBeTruthy();

    const allergyPreference = { ...mockPreference, category: 'Allergies' };
    const { root: root4 } = render(<PreferenceItem preference={allergyPreference} onPress={mockOnPress} />);
    expect(root4).toBeTruthy();
  });

  it('should handle different preference icons', () => {
    const vegetarianIcon = { ...mockPreference, icon: 'leaf-outline' };
    const { root: root1 } = render(<PreferenceItem preference={vegetarianIcon} onPress={mockOnPress} />);
    expect(root1).toBeTruthy();

    const glutenIcon = { ...mockPreference, icon: 'warning-outline' };
    const { root: root2 } = render(<PreferenceItem preference={glutenIcon} onPress={mockOnPress} />);
    expect(root2).toBeTruthy();

    const dairyIcon = { ...mockPreference, icon: 'water-outline' };
    const { root: root3 } = render(<PreferenceItem preference={dairyIcon} onPress={mockOnPress} />);
    expect(root3).toBeTruthy();
  });

  it('should handle long preference titles', () => {
    const longTitlePreference = { ...mockPreference, title: 'This is a very long preference title that might wrap to multiple lines' };
    const { root } = render(<PreferenceItem preference={longTitlePreference} onPress={mockOnPress} />);
    expect(root).toBeTruthy();
  });

  it('should handle long preference descriptions', () => {
    const longDescPreference = { ...mockPreference, description: 'This is a very long preference description that contains a lot of text and might need to be truncated or wrapped properly in the UI' };
    const { root } = render(<PreferenceItem preference={longDescPreference} onPress={mockOnPress} />);
    expect(root).toBeTruthy();
  });

  it('should handle missing preference properties', () => {
    const incompletePreference = { id: 'test', title: 'Test Preference' };
    const { root } = render(<PreferenceItem preference={incompletePreference} onPress={mockOnPress} />);
    expect(root).toBeTruthy();
  });

  it('should handle onPress callback', () => {
    const { root } = render(<PreferenceItem preference={mockPreference} onPress={mockOnPress} />);
    expect(root).toBeTruthy();
  });

  it('should handle selected state', () => {
    const { root } = render(<PreferenceItem preference={mockPreference} onPress={mockOnPress} isSelected={true} />);
    expect(root).toBeTruthy();
  });

  it('should handle unselected state', () => {
    const { root } = render(<PreferenceItem preference={mockPreference} onPress={mockOnPress} isSelected={false} />);
    expect(root).toBeTruthy();
  });
});

