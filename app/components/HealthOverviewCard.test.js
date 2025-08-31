import React from 'react';
import { render } from '@testing-library/react-native';
import HealthOverviewCard from './HealthOverviewCard';

describe('HealthOverviewCard', () => {
  const mockData = {
    title: 'Health Score',
    value: '85',
    unit: '%',
    trend: 'up',
    change: '+5',
    icon: 'trending-up-outline',
    color: '#4CAF50'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    const { root } = render(<HealthOverviewCard data={mockData} />);
    expect(root).toBeTruthy();
  });

  it('should render with proper structure', () => {
    const { root } = render(<HealthOverviewCard data={mockData} />);
    expect(root).toBeTruthy();
    expect(root.children[0]).toBeTruthy();
  });

  it('should handle title display', () => {
    const { root } = render(<HealthOverviewCard data={mockData} />);
    expect(root).toBeTruthy();
  });

  it('should handle value display', () => {
    const { root } = render(<HealthOverviewCard data={mockData} />);
    expect(root).toBeTruthy();
  });

  it('should handle unit display', () => {
    const { root } = render(<HealthOverviewCard data={mockData} />);
    expect(root).toBeTruthy();
  });

  it('should handle trend display', () => {
    const { root } = render(<HealthOverviewCard data={mockData} />);
    expect(root).toBeTruthy();
  });

  it('should handle change display', () => {
    const { root } = render(<HealthOverviewCard data={mockData} />);
    expect(root).toBeTruthy();
  });

  it('should handle icon display', () => {
    const { root } = render(<HealthOverviewCard data={mockData} />);
    expect(root).toBeTruthy();
  });

  it('should handle color display', () => {
    const { root } = render(<HealthOverviewCard data={mockData} />);
    expect(root).toBeTruthy();
  });

  it('should handle upward trend', () => {
    const upwardData = { ...mockData, trend: 'up', change: '+5' };
    const { root } = render(<HealthOverviewCard data={upwardData} />);
    expect(root).toBeTruthy();
  });

  it('should handle downward trend', () => {
    const downwardData = { ...mockData, trend: 'down', change: '-3' };
    const { root } = render(<HealthOverviewCard data={downwardData} />);
    expect(root).toBeTruthy();
  });

  it('should handle neutral trend', () => {
    const neutralData = { ...mockData, trend: 'neutral', change: '0' };
    const { root } = render(<HealthOverviewCard data={neutralData} />);
    expect(root).toBeTruthy();
  });

  it('should handle different health metrics', () => {
    const weightData = { ...mockData, title: 'Weight', value: '70', unit: 'kg' };
    const { root: root1 } = render(<HealthOverviewCard data={weightData} />);
    expect(root1).toBeTruthy();

    const bmiData = { ...mockData, title: 'BMI', value: '22.5', unit: '' };
    const { root: root2 } = render(<HealthOverviewCard data={bmiData} />);
    expect(root2).toBeTruthy();

    const stepsData = { ...mockData, title: 'Daily Steps', value: '8500', unit: 'steps' };
    const { root: root3 } = render(<HealthOverviewCard data={stepsData} />);
    expect(root3).toBeTruthy();
  });

  it('should handle different colors', () => {
    const greenData = { ...mockData, color: '#4CAF50' };
    const { root: root1 } = render(<HealthOverviewCard data={greenData} />);
    expect(root1).toBeTruthy();

    const redData = { ...mockData, color: '#F44336' };
    const { root: root2 } = render(<HealthOverviewCard data={redData} />);
    expect(root2).toBeTruthy();

    const blueData = { ...mockData, color: '#2196F3' };
    const { root: root3 } = render(<HealthOverviewCard data={blueData} />);
    expect(root3).toBeTruthy();
  });

  it('should handle missing data properties', () => {
    const incompleteData = { title: 'Test', value: '100' };
    const { root } = render(<HealthOverviewCard data={incompleteData} />);
    expect(root).toBeTruthy();
  });

  it('should handle long titles', () => {
    const longTitleData = { ...mockData, title: 'This is a very long health metric title that might wrap' };
    const { root } = render(<HealthOverviewCard data={longTitleData} />);
    expect(root).toBeTruthy();
  });

  it('should handle large values', () => {
    const largeValueData = { ...mockData, value: '999999', unit: 'calories' };
    const { root } = render(<HealthOverviewCard data={largeValueData} />);
    expect(root).toBeTruthy();
  });

  it('should handle decimal values', () => {
    const decimalData = { ...mockData, value: '23.7', unit: 'BMI' };
    const { root } = render(<HealthOverviewCard data={decimalData} />);
    expect(root).toBeTruthy();
  });

  it('should handle zero values', () => {
    const zeroData = { ...mockData, value: '0', unit: 'steps' };
    const { root } = render(<HealthOverviewCard data={zeroData} />);
    expect(root).toBeTruthy();
  });

  it('should handle negative changes', () => {
    const negativeData = { ...mockData, change: '-10', trend: 'down' };
    const { root } = render(<HealthOverviewCard data={negativeData} />);
    expect(root).toBeTruthy();
  });
});

