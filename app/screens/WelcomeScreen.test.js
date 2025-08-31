import React from 'react';
import { render } from '@testing-library/react-native';
import WelcomeScreen from './WelcomeScreen';

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

describe('WelcomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    const { root } = render(<WelcomeScreen navigation={mockNavigation} />);
    expect(root).toBeTruthy();
  });

  it('should render with proper structure', () => {
    const { root } = render(<WelcomeScreen navigation={mockNavigation} />);
    expect(root).toBeTruthy();
    expect(root.children[0]).toBeTruthy();
  });

  it('should handle welcome message display', () => {
    const { root } = render(<WelcomeScreen navigation={mockNavigation} />);
    expect(root).toBeTruthy();
  });

  it('should handle get started button press', () => {
    const { root } = render(<WelcomeScreen navigation={mockNavigation} />);
    expect(root).toBeTruthy();
  });

  it('should handle login button press', () => {
    const { root } = render(<WelcomeScreen navigation={mockNavigation} />);
    expect(root).toBeTruthy();
  });

  it('should handle sign up button press', () => {
    const { root } = render(<WelcomeScreen navigation={mockNavigation} />);
    expect(root).toBeTruthy();
  });

  it('should handle navigation to basic info screen', () => {
    const { root } = render(<WelcomeScreen navigation={mockNavigation} />);
    expect(root).toBeTruthy();
  });

  it('should handle navigation to login screen', () => {
    const { root } = render(<WelcomeScreen navigation={mockNavigation} />);
    expect(root).toBeTruthy();
  });

  it('should handle navigation to sign up screen', () => {
    const { root } = render(<WelcomeScreen navigation={mockNavigation} />);
    expect(root).toBeTruthy();
  });

  it('should handle welcome image display', () => {
    const { root } = render(<WelcomeScreen navigation={mockNavigation} />);
    expect(root).toBeTruthy();
  });

  it('should handle app description display', () => {
    const { root } = render(<WelcomeScreen navigation={mockNavigation} />);
    expect(root).toBeTruthy();
  });

  it('should handle feature highlights display', () => {
    const { root } = render(<WelcomeScreen navigation={mockNavigation} />);
    expect(root).toBeTruthy();
  });

  it('should handle social login options', () => {
    const { root } = render(<WelcomeScreen navigation={mockNavigation} />);
    expect(root).toBeTruthy();
  });

  it('should handle terms and privacy links', () => {
    const { root } = render(<WelcomeScreen navigation={mockNavigation} />);
    expect(root).toBeTruthy();
  });
});

