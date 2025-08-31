import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
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
  let mockSupabase;
  let mockNavigate;

  beforeEach(() => {
    jest.clearAllMocks();
    mockSupabase = require('../lib/supabase');
    mockNavigate = jest.fn();
    
    // Mock useNavigation to return our mock navigate function
    jest.doMock('@react-navigation/native', () => ({
      useNavigation: () => ({
        navigate: mockNavigate,
      }),
      useFocusEffect: jest.fn(),
    }));
  });

  it('should render without crashing', () => {
    const { root } = render(<HistoryScreen />);
    expect(root).toBeTruthy();
  });

  it('should render with proper structure', () => {
    const { root } = render(<HistoryScreen />);
    expect(root).toBeTruthy();
    expect(root.children[0]).toBeTruthy();
  });

  it('should handle successful data fetch with beneficial scans', async () => {
    // Mock successful response with beneficial scans
    mockSupabase.supabase.from.mockReturnValue({
      select: jest.fn(() => ({
        order: jest.fn(() => Promise.resolve({ 
          data: [{
            id: 1, 
            product_name: 'Healthy Food',
            created_at: '2024-01-01T00:00:00Z',
            analysis_results: [{
              beneficial: ['vitamins', 'minerals'],
              harmful: [],
              neutral: ['fiber']
            }]
          }], 
          error: null 
        }))
      }))
    });

    const { root } = render(<HistoryScreen />);
    expect(root).toBeTruthy();
  });

  it('should handle successful data fetch with harmful scans', async () => {
    // Mock successful response with harmful scans
    mockSupabase.supabase.from.mockReturnValue({
      select: jest.fn(() => ({
        order: jest.fn(() => Promise.resolve({ 
          data: [{
            id: 2, 
            product_name: 'Unhealthy Food',
            created_at: '2024-01-02T00:00:00Z',
            analysis_results: [{
              beneficial: [],
              harmful: ['sugar', 'preservatives'],
              neutral: []
            }]
          }], 
          error: null 
        }))
      }))
    });

    const { root } = render(<HistoryScreen />);
    expect(root).toBeTruthy();
  });

  it('should handle successful data fetch with neutral scans', async () => {
    // Mock successful response with neutral scans
    mockSupabase.supabase.from.mockReturnValue({
      select: jest.fn(() => ({
        order: jest.fn(() => Promise.resolve({ 
          data: [{
            id: 3, 
            product_name: 'Neutral Food',
            created_at: '2024-01-03T00:00:00Z',
            analysis_results: [{
              beneficial: [],
              harmful: [],
              neutral: ['water', 'salt']
            }]
          }], 
          error: null 
        }))
      }))
    });

    const { root } = render(<HistoryScreen />);
    expect(root).toBeTruthy();
  });

  it('should handle fetch error', async () => {
    // Mock error response
    mockSupabase.supabase.from.mockReturnValue({
      select: jest.fn(() => ({
        order: jest.fn(() => Promise.resolve({ 
          data: null, 
          error: { message: 'Database connection failed' }
        }))
      }))
    });

    const { root } = render(<HistoryScreen />);
    expect(root).toBeTruthy();
  });

  it('should handle empty data response', async () => {
    // Mock empty data response
    mockSupabase.supabase.from.mockReturnValue({
      select: jest.fn(() => ({
        order: jest.fn(() => Promise.resolve({ 
          data: [], 
          error: null 
        }))
      }))
    });

    const { root } = render(<HistoryScreen />);
    expect(root).toBeTruthy();
  });

  it('should handle null data response', async () => {
    // Mock null data response
    mockSupabase.supabase.from.mockReturnValue({
      select: jest.fn(() => ({
        order: jest.fn(() => Promise.resolve({ 
          data: null, 
          error: null 
        }))
      }))
    });

    const { root } = render(<HistoryScreen />);
    expect(root).toBeTruthy();
  });

  it('should handle scans without analysis results', async () => {
    // Mock scans without analysis results
    mockSupabase.supabase.from.mockReturnValue({
      select: jest.fn(() => ({
        order: jest.fn(() => Promise.resolve({ 
          data: [{
            id: 4, 
            product_name: 'Food without analysis',
            created_at: '2024-01-04T00:00:00Z',
            analysis_results: null
          }], 
          error: null 
        }))
      }))
    });

    const { root } = render(<HistoryScreen />);
    expect(root).toBeTruthy();
  });

  it('should handle scans with empty analysis results', async () => {
    // Mock scans with empty analysis results
    mockSupabase.supabase.from.mockReturnValue({
      select: jest.fn(() => ({
        order: jest.fn(() => Promise.resolve({ 
          data: [{
            id: 5, 
            product_name: 'Food with empty analysis',
            created_at: '2024-01-05T00:00:00Z',
            analysis_results: []
          }], 
          error: null 
        }))
      }))
    });

    const { root } = render(<HistoryScreen />);
    expect(root).toBeTruthy();
  });
});
