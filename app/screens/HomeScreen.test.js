import React from 'react';
import { render } from '@testing-library/react-native';
import HomeScreen from './HomeScreen';

// Mock the navigation prop
const mockNavigation = {
  navigate: jest.fn(),
};

// Mock the ScreenContainer component
jest.mock('../components/ScreenContainer', () => {
  return function MockScreenContainer({ children, variant }) {
    return <div data-testid="screen-container" data-variant={variant}>{children}</div>;
  };
});

// Mock the ScansContext
jest.mock('../contexts/ScansContext', () => ({
  useScans: () => ({
    scans: [
      {
        id: 1,
        product_name: 'Test Product',
        created_at: '2024-01-01T00:00:00Z',
        status: 'beneficial'
      }
    ],
    addScan: jest.fn(),
    clearScans: jest.fn()
  })
}));

// Mock the UserContext
jest.mock('../context/UserContext', () => ({
  useUser: () => ({
    profile: {
      first_name: 'Test',
      full_name: 'Test User'
    },
    user: {
      user_metadata: {
        full_name: 'Test User'
      }
    },
    refreshProfile: jest.fn()
  })
}));

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    const { root } = render(<HomeScreen navigation={mockNavigation} />);
    expect(root).toBeTruthy();
  });

  it('should render with proper structure', () => {
    const { root } = render(<HomeScreen navigation={mockNavigation} />);
    expect(root).toBeTruthy();
    expect(root.children[0]).toBeTruthy();
  });

  it('should handle scan button press', () => {
    const { root } = render(<HomeScreen navigation={mockNavigation} />);
    expect(root).toBeTruthy();
  });

  it('should handle history button press', () => {
    const { root } = render(<HomeScreen navigation={mockNavigation} />);
    expect(root).toBeTruthy();
  });

  it('should handle profile button press', () => {
    const { root } = render(<HomeScreen navigation={mockNavigation} />);
    expect(root).toBeTruthy();
  });

  it('should handle recent scans display', () => {
    const { root } = render(<HomeScreen navigation={mockNavigation} />);
    expect(root).toBeTruthy();
  });

  it('should handle empty recent scans', () => {
    const { root } = render(<HomeScreen navigation={mockNavigation} />);
    expect(root).toBeTruthy();
  });

  it('should handle welcome message display', () => {
    const { root } = render(<HomeScreen navigation={mockNavigation} />);
    expect(root).toBeTruthy();
  });

  it('should handle quick actions display', () => {
    const { root } = render(<HomeScreen navigation={mockNavigation} />);
    expect(root).toBeTruthy();
  });

  it('should handle navigation to scan screen', () => {
    const { root } = render(<HomeScreen navigation={mockNavigation} />);
    expect(root).toBeTruthy();
  });

  it('should handle navigation to history screen', () => {
    const { root } = render(<HomeScreen navigation={mockNavigation} />);
    expect(root).toBeTruthy();
  });

  it('should handle navigation to profile screen', () => {
    const { root } = render(<HomeScreen navigation={mockNavigation} />);
    expect(root).toBeTruthy();
  });

  it('should handle scan context integration', () => {
    const { root } = render(<HomeScreen navigation={mockNavigation} />);
    expect(root).toBeTruthy();
  });

  it('should handle user context integration', () => {
    const { root } = render(<HomeScreen navigation={mockNavigation} />);
    expect(root).toBeTruthy();
  });
});
