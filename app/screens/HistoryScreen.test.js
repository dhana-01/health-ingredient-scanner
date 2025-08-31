import React from 'react';
import { render } from '@testing-library/react-native';
import HistoryScreen from './HistoryScreen';

// Mock the useNavigation hook
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
  useFocusEffect: jest.fn(),
}));

// Mock the supabase client
jest.mock('../lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        order: jest.fn(() => Promise.resolve({ data: [], error: null }))
      }))
    }))
  }
}));

describe('HistoryScreen', () => {
  it('should render without crashing', () => {
    const { root } = render(<HistoryScreen />);
    
    // Check if the component renders without crashing
    expect(root).toBeTruthy();
  });

  it('should render with proper structure', () => {
    const { root } = render(<HistoryScreen />);
    
    // Check if the component renders
    expect(root).toBeTruthy();
    
    // Verify the component has children
    expect(root.children[0]).toBeTruthy();
  });
});
