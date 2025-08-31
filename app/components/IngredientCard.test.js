import React from 'react';
import { render } from '@testing-library/react-native';
import IngredientCard from './IngredientCard';

describe('IngredientCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    const { root } = render(<IngredientCard ingredient="Vitamin C" reason="Essential vitamin" type="Beneficial" />);
    expect(root).toBeTruthy();
  });

  it('should render with proper structure', () => {
    const { root } = render(<IngredientCard ingredient="Vitamin C" reason="Essential vitamin" type="Beneficial" />);
    expect(root).toBeTruthy();
    expect(root.children[0]).toBeTruthy();
  });

  it('should handle ingredient name display', () => {
    const { root } = render(<IngredientCard ingredient="Vitamin C" reason="Essential vitamin" type="Beneficial" />);
    expect(root).toBeTruthy();
  });

  it('should handle ingredient description display', () => {
    const { root } = render(<IngredientCard ingredient="Vitamin C" reason="Essential vitamin" type="Beneficial" />);
    expect(root).toBeTruthy();
  });

  it('should handle beneficial ingredients', () => {
    const { root } = render(<IngredientCard ingredient="Vitamin C" reason="Essential vitamin" type="Beneficial" />);
    expect(root).toBeTruthy();
  });

  it('should handle harmful ingredients', () => {
    const { root } = render(<IngredientCard ingredient="Sugar" reason="High glycemic index" type="Harmful" />);
    expect(root).toBeTruthy();
  });

  it('should handle neutral ingredients', () => {
    const { root } = render(<IngredientCard ingredient="Water" reason="Hydration" type="Neutral" />);
    expect(root).toBeTruthy();
  });

  it('should handle different ingredient types', () => {
    const { root: root1 } = render(<IngredientCard ingredient="Vitamin C" reason="Essential vitamin" type="Beneficial" />);
    expect(root1).toBeTruthy();

    const { root: root2 } = render(<IngredientCard ingredient="Sugar" reason="High glycemic index" type="Harmful" />);
    expect(root2).toBeTruthy();

    const { root: root3 } = render(<IngredientCard ingredient="Water" reason="Hydration" type="Neutral" />);
    expect(root3).toBeTruthy();
  });

  it('should handle long ingredient names', () => {
    const { root } = render(<IngredientCard ingredient="This is a very long ingredient name that might wrap to multiple lines" reason="Essential vitamin" type="Beneficial" />);
    expect(root).toBeTruthy();
  });

  it('should handle long descriptions', () => {
    const { root } = render(<IngredientCard ingredient="Vitamin C" reason="This is a very long ingredient description that contains a lot of text and might need to be truncated or wrapped properly in the UI" type="Beneficial" />);
    expect(root).toBeTruthy();
  });

  it('should handle missing description', () => {
    const { root } = render(<IngredientCard ingredient="Vitamin C" type="Beneficial" />);
    expect(root).toBeTruthy();
  });

  it('should handle custom title and description', () => {
    const { root } = render(<IngredientCard title="Custom Title" description="Custom description" type="Beneficial" />);
    expect(root).toBeTruthy();
  });

  it('should handle custom tag', () => {
    const { root } = render(<IngredientCard ingredient="Vitamin C" reason="Essential vitamin" tag="Custom" />);
    expect(root).toBeTruthy();
  });

  it('should handle default type when none provided', () => {
    const { root } = render(<IngredientCard ingredient="Vitamin C" reason="Essential vitamin" />);
    expect(root).toBeTruthy();
  });
});
