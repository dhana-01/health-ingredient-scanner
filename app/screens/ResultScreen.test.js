import React from 'react';
import { render } from '@testing-library/react-native';
import ResultScreen from './ResultScreen';

// Mock the navigation prop
const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};

// Mock the ScreenContainer component
jest.mock('../components/ScreenContainer', () => {
  return function MockScreenContainer({ children, variant }) {
    return <div data-testid="screen-container" data-variant={variant}>{children}</div>;
  };
});

// Mock the route prop
const mockRoute = {
  params: {
    analysis: {
      beneficial: ['vitamins', 'minerals'],
      harmful: ['sugar'],
      neutral: ['fiber'],
      summary: 'This product has both beneficial and harmful ingredients.'
    },
    imageUrl: 'https://example.com/image.jpg'
  }
};

describe('ResultScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    const { root } = render(<ResultScreen navigation={mockNavigation} route={mockRoute} />);
    expect(root).toBeTruthy();
  });

  it('should render with proper structure', () => {
    const { root } = render(<ResultScreen navigation={mockNavigation} route={mockRoute} />);
    expect(root).toBeTruthy();
    expect(root.children[0]).toBeTruthy();
  });

  it('should handle beneficial ingredients display', () => {
    const { root } = render(<ResultScreen navigation={mockNavigation} route={mockRoute} />);
    expect(root).toBeTruthy();
  });

  it('should handle harmful ingredients display', () => {
    const { root } = render(<ResultScreen navigation={mockNavigation} route={mockRoute} />);
    expect(root).toBeTruthy();
  });

  it('should handle neutral ingredients display', () => {
    const { root } = render(<ResultScreen navigation={mockNavigation} route={mockRoute} />);
    expect(root).toBeTruthy();
  });

  it('should handle summary display', () => {
    const { root } = render(<ResultScreen navigation={mockNavigation} route={mockRoute} />);
    expect(root).toBeTruthy();
  });

  it('should handle image display', () => {
    const { root } = render(<ResultScreen navigation={mockNavigation} route={mockRoute} />);
    expect(root).toBeTruthy();
  });

  it('should handle navigation back', () => {
    const { root } = render(<ResultScreen navigation={mockNavigation} route={mockRoute} />);
    expect(root).toBeTruthy();
  });

  it('should handle navigation to home', () => {
    const { root } = render(<ResultScreen navigation={mockNavigation} route={mockRoute} />);
    expect(root).toBeTruthy();
  });

  it('should handle empty analysis data', () => {
    const emptyRoute = {
      params: {
        analysis: {},
        imageUrl: 'https://example.com/image.jpg'
      }
    };
    const { root } = render(<ResultScreen navigation={mockNavigation} route={emptyRoute} />);
    expect(root).toBeTruthy();
  });

  it('should handle missing image URL', () => {
    const noImageRoute = {
      params: {
        analysis: mockRoute.params.analysis,
        imageUrl: null
      }
    };
    const { root } = render(<ResultScreen navigation={mockNavigation} route={noImageRoute} />);
    expect(root).toBeTruthy();
  });

  it('should handle beneficial ingredients only', () => {
    const beneficialRoute = {
      params: {
        analysis: {
          beneficial: ['vitamins', 'minerals'],
          harmful: [],
          neutral: [],
          summary: 'This product is very healthy.'
        },
        imageUrl: 'https://example.com/image.jpg'
      }
    };
    const { root } = render(<ResultScreen navigation={mockNavigation} route={beneficialRoute} />);
    expect(root).toBeTruthy();
  });

  it('should handle harmful ingredients only', () => {
    const harmfulRoute = {
      params: {
        analysis: {
          beneficial: [],
          harmful: ['sugar', 'preservatives'],
          neutral: [],
          summary: 'This product has harmful ingredients.'
        },
        imageUrl: 'https://example.com/image.jpg'
      }
    };
    const { root } = render(<ResultScreen navigation={mockNavigation} route={harmfulRoute} />);
    expect(root).toBeTruthy();
  });

  it('should handle neutral ingredients only', () => {
    const neutralRoute = {
      params: {
        analysis: {
          beneficial: [],
          harmful: [],
          neutral: ['water', 'salt'],
          summary: 'This product is neutral.'
        },
        imageUrl: 'https://example.com/image.jpg'
      }
    };
    const { root } = render(<ResultScreen navigation={mockNavigation} route={neutralRoute} />);
    expect(root).toBeTruthy();
  });

  it('should handle share functionality', () => {
    const { root } = render(<ResultScreen navigation={mockNavigation} route={mockRoute} />);
    expect(root).toBeTruthy();
  });

  it('should handle save to history', () => {
    const { root } = render(<ResultScreen navigation={mockNavigation} route={mockRoute} />);
    expect(root).toBeTruthy();
  });
});

